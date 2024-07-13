import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { collection, getDocs, addDoc, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { db, fetchUserDetails } from '../Firebase'; // Import fetchUserDetails from Firebase configuration
import ChatItem from './ChatItem';

const ChatList = ({ currentUser, onChatSelect }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startedChats, setStartedChats] = useState([]);

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

  // Function to fetch participant names
  const fetchParticipantNames = async (participantIds) => {
    const participantNames = [];

    for (const id of participantIds) {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        participantNames.push(userDoc.data().name);
      } else {
        participantNames.push('Unknown'); // Handle case where user document doesn't exist
      }
    }

    return participantNames;
  };

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
        setStartedChats(prevChats => [...prevChats, user.id]); // Mark this user as started chat with
  
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
          .filter(user => !startedChats.includes(user.id)) // Filter out users you have started chats with
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
          <ChatItem
            key={index}
            chat={chat}
            fetchLatestMessage={fetchLatestMessage}
            currentUser={currentUser}
            fetchParticipantNames={fetchParticipantNames}
            fetchUserDetails={fetchUserDetails} // Pass the function to ChatItem
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;