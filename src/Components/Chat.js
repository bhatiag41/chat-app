import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";

const Chat = ({ user, selectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatId) {
        const q = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messageList = querySnapshot.docs.map(doc => doc.data());
          setMessages(messageList);
        });

        return unsubscribe;
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (selectedChatId && user) { // Ensure user is also defined
        try {
          const chatDoc = await collection(db, 'chats').doc(selectedChatId).get();
          const participants = chatDoc.data()?.participants || [];
          const receiverId = participants.find(id => id !== user.uid);

          if (receiverId) {
            const receiverDoc = await collection(db, 'users').doc(receiverId).get();
            setReceiver(receiverDoc.data());
          }
        } catch (error) {
          console.error('Error fetching receiver details:', error);
        }
      }
    };

    fetchReceiver();
  }, [selectedChatId, user]);

  const sendMessage = async () => {
    try {
      if (!newMessage.trim() || !selectedChatId || !user) return;

      const messageData = {
        userId: user.uid,
        content: newMessage.trim(),
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'chats', selectedChatId, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEmoji = (e) => {
    setNewMessage((prev => prev + e.emoji));
    setOpen(false);
  };

  if (!selectedChatId) {
    return <div className="chat">Select a chat to start messaging</div>;
  }

  return (
    <div className='chat'>
      <div className='header'>
        <div className='user window'>
          <img src={receiver?.photoURL || './avatar.png'} alt='receiver' />
          <h2>{receiver?.displayName || 'Chat'}</h2>
        </div>
      </div>
      <div className='messages'>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.userId === user.uid ? 'own' : 'other'}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className='emojiPicker'>
        <MdOutlineEmojiEmotions onClick={() => setOpen(prev => !prev)} />
        <EmojiPicker open={open} onEmojiClick={handleEmoji} style={{ backgroundColor: "#BE9FE1" }} pickerStyle={{ backgroundColor: '#BE9FE1' }} />
      </div>
      <div className='chatInput'>
        <div className='searchbar'>
          <input type='text' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder='Enter your Message' />
          <button onClick={sendMessage} style={{ border: "none", background: "transparent" }}>
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
