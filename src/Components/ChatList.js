import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { IoMdSearch } from "react-icons/io";
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db, fetchUserDetails } from '../Firebase'; // Import fetchUserDetails from Firebase configuration
import ChatItem from './ChatItem';
import { debounce } from 'lodash'; // Add this import

const ChatList = ({ currentUser, onChatSelect }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce the search input
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Memoize filtered results
  const filteredResults = useMemo(() => {
    const searchTerm = debouncedSearchQuery.toLowerCase();
    
    // Filter users without existing chats
    const filteredUsers = users
      .filter(user => user.name && user.name.toLowerCase().includes(searchTerm))
      .filter(user => !chats.some(chat => chat.participants.includes(user.id)))
      .map(user => ({
        type: 'new',
        data: user
      }));

    // Filter existing chats
    const filteredChats = chats
      .filter(chat => {
        const participantNames = chat.participants.map(participant => {
          const participantUser = users.find(user => user.id === participant);
          return participantUser ? participantUser.name : 'Unknown';
        });
        return participantNames.some(name => name.toLowerCase().includes(searchTerm));
      })
      .map(chat => ({
        type: 'existing',
        data: chat
      }));

    return [...filteredUsers, ...filteredChats];
  }, [users, chats, debouncedSearchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      if (currentUser && currentUser.uid) {
        setUsers(usersList.filter(user => user.id !== currentUser.uid)); // Filter out current user
      } else {
        setUsers(usersList); // Set users without filtering if currentUser.uid is not available
      }
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
  }, [currentUser]);  // Fetch users and chats when currentUser changes

  const handleStartChat = async (user) => {
    if (!currentUser || !currentUser.uid || !user || !user.id) {
      console.error('Invalid user or currentUser');
      return;
    }
  
    const existingChat = chats.find(chat => chat.participants.includes(user.id));
  
    if (!existingChat) {
      const newChat = {
        participants: [currentUser.uid, user.id],
        messages: [],
      };
  
      try {
        const chatCollection = collection(db, 'chats');
        const docRef = await addDoc(chatCollection, newChat);
  
        // Update state with new chat using functional update
        setChats(prevChats => [...prevChats, { id: docRef.id, ...newChat }]);
  
        // Select this new chat
        onChatSelect(docRef.id, user); // Trigger selection of new chat
      } catch (error) {
        console.error('Error creating new chat:', error);
      }
    } else {
      // Select existing chat
      onChatSelect(existingChat.id, user); // Trigger selection of existing chat
    }
  };

  const fetchLatestMessage = async (chatId) => {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(doc => doc.data())[0];
  };

  return (
    <>
      <div className='list'>
        <div className='searchbar'>
          <IoMdSearch />
          <input 
            type='text' 
            placeholder='Search' 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {filteredResults.map((item, index) => (
          item.type === 'new' ? (
            <div key={item.data.id} className='chats' onClick={() => handleStartChat(item.data)}>
              <img src={item.data.photoURL || './avatar.png'} alt='profiles' />
              <div className='chatText'>
                <div className='name'>{item.data.name}</div>
                <div className='messagePreview'>Start a chat</div>
              </div>
            </div>
          ) : (
            <ChatItem
              key={item.data.id}
              chat={item.data}
              fetchLatestMessage={fetchLatestMessage}
              currentUser={currentUser}
              fetchUserDetails={fetchUserDetails}
              onChatSelect={onChatSelect}
            />
          )
        ))}
      </div>
    </>
  );
};

export default ChatList;
