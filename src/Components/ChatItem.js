import React, { useEffect, useState } from "react";

const ChatItem = ({ chat, fetchLatestMessage, currentUser, fetchParticipantNames, fetchUserDetails }) => {
  const [latestMessage, setLatestMessage] = useState(null);
  const [receiverDetails, setReceiverDetails] = useState(null);

  useEffect(() => {
    const getLatestMessage = async () => {
      if (chat && chat.id) {
        const message = await fetchLatestMessage(chat.id);
        setLatestMessage(message);
      }
    };

    const fetchReceiverDetails = async () => {
      const participantIds = chat.participants.filter(id => id !== currentUser.uid); // Exclude current user
      if (participantIds.length === 1) {
        const receiverId = participantIds[0];
        const userDetails = await fetchUserDetails(receiverId);
        setReceiverDetails(userDetails);
      }
    };

    getLatestMessage();
    fetchReceiverDetails();
  }, [chat, currentUser.uid, fetchLatestMessage, fetchUserDetails]);

  return (
    <div className='chats'>
      <img src={receiverDetails?.photoURL || './default-avatar.jpg'} alt='profiles' />
      <div className='chatText'>
        <div className='name'>
          {receiverDetails ? receiverDetails.name : 'Unknown'}
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
