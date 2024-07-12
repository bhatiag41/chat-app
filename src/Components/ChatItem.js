import React,{useEffect,useState} from "react";

// import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
// import { db } from '../Firebase';
const ChatItem = ({ chat, fetchLatestMessage,currentUser }) => {
    const [latestMessage, setLatestMessage] = useState(null);
  
    useEffect(() => {
      const getLatestMessage = async () => {
        const message = await fetchLatestMessage(chat.id);
        setLatestMessage(message);
      };
      
      getLatestMessage();
    }, [chat, fetchLatestMessage]);
  
    if (!latestMessage) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className='chats'>
        <img src='./sa.JPG' alt='profiles' />
        <div className='chatText'>
          <div className='name'>{chat.participants.filter(participant => participant !== currentUser.uid).join(', ')}</div>
          <div className='messagePreview'>{latestMessage.text}</div>
        </div>
        <div className='timeList'>{new Date(latestMessage.timestamp.toDate()).toLocaleTimeString()}</div>
      </div>
    );
  };
  export default ChatItem;