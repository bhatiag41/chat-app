import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../Firebase';
import ChatItem from './ChatItem';

const ChatList = ({ currentUser }) => {
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
      const chatsCollection = collection(db, 'chats');
      const chatsSnapshot = await getDocs(chatsCollection);
      const chatsList = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsList);
    };

    fetchUsers();
    fetchChats();
  }, []);

  const handleStartChat = async (user) => {
    const existingChat = chats.find(chat => chat.participants.includes(user.id));
    if (!existingChat) {
      const newChat = {
        participants: [currentUser.uid, user.id],
        messages: [],
      };

      const chatCollection = collection(db, 'chats');
      await addDoc(chatCollection, newChat);
      
      const updatedChats = await getDocs(chatCollection);
      setChats(updatedChats.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  const fetchLatestMessage = async (chatId) => {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'), limit(1));
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
        <hr/>
      </div>
    </div>
  );
};

export default ChatList;
