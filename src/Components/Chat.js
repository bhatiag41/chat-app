import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const Chat = ({ user, selectedChatId, receiver, onDeleteChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatId) {
        const q = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messageList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const deleteChat = async () => {
    if (!selectedChatId) return;

    try {
      const chatDocRef = doc(db, 'chats', selectedChatId);
      await deleteDoc(chatDocRef);
      onDeleteChat(selectedChatId);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className='chat'>
      <div className='header'>

        <div className='user'>
          <img src={receiver?.photoURL || './avatar.png'} alt='receiver' />
          <h2>{receiver?.name || 'Chat'}</h2>
      </div>
        <button onClick={deleteChat} className='deleteBtn'>
        <MdDelete />
        </button>
      </div>
      <div className='chatWindow'>
          {messages.map((message, index) => (
            <div key={index} className={`${message.userId === user.uid ? 'senderMsg' : 'recieverMsg'}`}>
              {message.content}
            </div>
          ))}
  
      </div>
      <div className='emojiPicker'>
        {openEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick}  style={{backgroundColor:"#BE9FE1"}}/>}
      </div>
      <div className='chatInput'>
        <div className='searchbar'>
          <MdOutlineEmojiEmotions onClick={() => setOpenEmojiPicker(prev => !prev)} />
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Enter your message...'

          />
          <button style={{ background: "transparent", border: "none" }} onClick={sendMessage}>
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
