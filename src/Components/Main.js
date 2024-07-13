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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  const handleChatSelection = (chatId, user) => {
    setSelectedChatId(chatId);
    setReceiver(user);
    console.log(user);
  };

  return (
    <>
      <User currentUser={currentUser} />
      <div className='inner'>
        <div className='left'>
          <ChatList currentUser={currentUser} onChatSelect={handleChatSelection} />
        </div>
        <div className='right'>
          {selectedChatId ? (
            <Chat user={currentUser} selectedChatId={selectedChatId} receiver={receiver} />
          ) : (
            <div>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
