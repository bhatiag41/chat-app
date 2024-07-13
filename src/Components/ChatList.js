import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../Firebase';
import ChatItem from './ChatItem';

const ChatList = ({ currentUser, onChatSelect }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    const fetchChats = async () => {
      if (!currentUser || !currentUser.uid) {
        return; // Ensure currentUser is defined and has uid property
      }

      const chatsCollection = collection(db, 'chats');
      const q = query(chatsCollection, where('participants', 'array-contains', currentUser.uid));
      const chatsSnapshot = await getDocs(q);
      const chatsList = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsList);
    };

    fetchUsers();
    fetchChats();
  }, [currentUser]); 

  const handleStartChat = async (user) => {
    const existingChat = chats.find(chat => chat.participants.includes(user.id));
    
    if (!existingChat) {
      const newChat = {
        participants: [currentUser.uid, user.id],
        messages: [],
      };

      try {
        const chatCollection = collection(db, 'chats');
        const docRef = await addDoc(chatCollection, newChat);
        
        // Update state with new chat
        setChats([...chats, { id: docRef.id, ...newChat }]);
        
        // Select this new chat
        onChatSelect(docRef.id, user);
      } catch (error) {
        console.error('Error creating new chat:', error);
      }
    } else {
      // Select existing chat
      onChatSelect(existingChat.id, user);
    }
  };

  const fetchLatestMessage = async (chatId) => {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(doc => doc.data())[0];
  };

  return (
    <div>
      <div className='list'>
        <div className='searchbar'>
          <IoMdSearch />
          <input 
            type='text' 
            placeholder='Search' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        {users
          .filter(user => user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((user) => (
            <div key={user.id} className='chats' onClick={() => handleStartChat(user)}>
              <img src={user.photoURL || './avatar.png'} alt='profiles' />
              <div className='chatText'>
                <div className='name'>{user.name}</div>
                <div className='messagePreview'>Start a chat</div>
              </div>
            </div>
        ))}
        {chats.map((chat, index) => (
          <ChatItem key={index} chat={chat} fetchLatestMessage={fetchLatestMessage} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
