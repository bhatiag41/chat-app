import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";

const Chat = ({ user, selectedChatId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

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

  const handleEmojiClick = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji);
    setOpenEmojiPicker(false);
  };

  return (
    <div className='chat'>
      <div className='header'>
        <div className='user'>
          <img src={receiver?.photoURL || './avatar.png'} alt='receiver' />
          <h2>{receiver?.name || 'Chat'}</h2>
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
        <MdOutlineEmojiEmotions onClick={() => setOpenEmojiPicker(prev => !prev)} />
        {openEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
      </div>
      <div className='chatInput'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Enter your message...'
        />
        <button onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;
