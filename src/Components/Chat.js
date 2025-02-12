import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions, MdDelete, MdArrowBack } from "react-icons/md";
import { IoSend } from "react-icons/io5";

// Memoized Message component for better performance
const Message = memo(({ message, isUser, isLastMessage, latestMessageRef }) => (
  <div 
    className={`${isUser ? 'senderMsg' : 'receiverMsg'}`}
    ref={isLastMessage ? latestMessageRef : null}
  >
    {message.content}
  </div>
));

const Chat = ({ user, selectedChatId, receiver, onDeleteChat, onBackToList }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const latestMessageRef = useRef(null);

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

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    try {
      if (!newMessage.trim() || !selectedChatId || !user) return;
      setIsLoading(true);

      const messageData = {
        userId: user.uid,
        content: newMessage.trim(),
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'chats', selectedChatId, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, selectedChatId, user]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleEmojiClick = useCallback((emojiData) => {
    setNewMessage(prevMessage => prevMessage + emojiData.emoji);
    setOpenEmojiPicker(false);
  }, []);

  const deleteChat = useCallback(async () => {
    if (!selectedChatId) return;
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        setIsLoading(true);
        const chatDocRef = doc(db, 'chats', selectedChatId);
        await deleteDoc(chatDocRef);
        onDeleteChat(selectedChatId);
      } catch (error) {
        console.error('Error deleting chat:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedChatId, onDeleteChat]);

  return (
    <div className='chat'>
      <div className='header'>
        <div className='user'>
          <MdArrowBack className='backBtn' onClick={onBackToList} />
          <img src={receiver?.photoURL || './avatar.png'} alt='receiver' />
          <h2>{receiver?.name || 'Chat'}</h2>
        </div>
        <button 
          onClick={deleteChat} 
          className='deleteBtn'
          disabled={isLoading}
        >
          <MdDelete />
        </button>
      </div>
      <div className='chatWindow'>
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            isUser={message.userId === user.uid}
            isLastMessage={index === messages.length - 1}
            latestMessageRef={latestMessageRef}
          />
        ))}
      </div>
      <div className='emojiPicker'>
        {openEmojiPicker && (
          <EmojiPicker 
            onEmojiClick={handleEmojiClick} 
            style={{ backgroundColor: "#BE9FE1" }} 
          />
        )}
      </div>
      <div className='chatInput'>
        <div className='searchbar'>
          <MdOutlineEmojiEmotions 
            onClick={() => setOpenEmojiPicker(prev => !prev)}
            style={{ cursor: 'pointer' }}
          />
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Enter your message...'
            disabled={isLoading}
          />
          <button 
            style={{ background: "transparent", border: "none", cursor: 'pointer' }} 
            onClick={sendMessage}
            disabled={isLoading}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Chat);
