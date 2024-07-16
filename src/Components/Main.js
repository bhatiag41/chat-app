import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import User from './User';
import Chat from './Chat';
import ChatList from './ChatList';

const Main = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setIsChatVisible(false);
      setSelectedChatId(null);
      setReceiver(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleChatSelection = (chatId, user) => {
    setSelectedChatId(chatId);
    setReceiver(user);
    setIsChatVisible(true); 
    window.history.pushState({ chatId }, '', `#chat-${chatId}`);
  };

  const handleDeleteChat = (chatId) => {
    setSelectedChatId(null);
    setReceiver(null);
    setIsChatVisible(false); 
    window.history.pushState(null, '', '#');
  };

  const handleBackToList = () => {
    window.history.back();
  };

  return (
    <>
      {isChatVisible?"":<User currentUser={currentUser} />}
      <div className={`inner ${isChatVisible ? 'chat-visible' : ''}`}>
        <div className={`left ${isChatVisible ? 'hidden' : ''}`}>
          <ChatList currentUser={currentUser} onChatSelect={handleChatSelection} />
        </div>
        <div className='right'>
          {selectedChatId ? (
            <Chat 
              user={currentUser} 
              selectedChatId={selectedChatId} 
              receiver={receiver} 
              onDeleteChat={handleDeleteChat} 
              onBackToList={handleBackToList} 
            />
          ) : (
            <div className='text'>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
