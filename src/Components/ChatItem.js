import React, { useEffect, useState } from "react";

const ChatItem = ({ chat, fetchLatestMessage, currentUser }) => {
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getLatestMessage = async () => {
      if (chat && chat.id) {
        const message = await fetchLatestMessage(chat.id);
        setLatestMessage(message);
      }
    };

    getLatestMessage();
  }, [chat, fetchLatestMessage]);

  // Ensure chat object and participants exist
  const participants = chat && chat.participants ? chat.participants : [];

  return (
    <div className='chats'>
      <img src='./sa.JPG' alt='profiles' />
      <div className='chatText'>
        <div className='name'>
          {participants
            .filter(participant => participant !== currentUser.uid)
            .join(', ')}
        </div>
        <div className='messagePreview'>
          {latestMessage ? latestMessage.content : 'No messages yet'}
        </div>
      </div>
      <div className='timeList'>
        {latestMessage ? new Date(latestMessage.timestamp.toDate()).toLocaleTimeString() : ''}
      </div>
    </div>
  );
};

export default ChatItem;
