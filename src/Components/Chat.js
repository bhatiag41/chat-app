import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import EmojiPicker from 'emoji-picker-react';
// import './Chat.scss';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
const Chat = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [open,setOpen] = useState(false);
// const [newMessage,setNewMessage]= useState('');
useEffect(() => {
  const fetchMessages = async () => {
    if (selectedChatId) {
      const q = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messageList = querySnapshot.docs.map(doc => doc.data());
        setMessages(messageList);
      });

      return unsubscribe;
    }
  };

  fetchMessages();
}, [selectedChatId]);
const sendMessage = async () => {
  try {
    if (newMessage.trim() === '') return;

    const messageData = {
      userId: user.uid,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    await addDoc(collection(db, 'chats', selectedChatId, 'messages'), messageData);
    setNewMessage('');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
  const handleEmoji=e=>{
    setNewMessage((prev=>prev+e.emoji))
    setOpen(false)
  }
  return (
<div className='chat'>
<div className='header'>
<div className='user window'>
    <img src='./sa.JPG' alt='user'/>
    <h2>Gaurav Bhatia</h2>
</div>
 </div>
{/*<div className='chatWindow'>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
</div> */}
 <div className='chat'>
      <div className='messages'>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.userId === user.uid ? 'own' : 'other'}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
<div className='emojiPicker'>

<EmojiPicker open={open} onEmojiClick={handleEmoji} style={{backgroundColor:"#BE9FE1"}}  pickerStyle={{ backgroundColor: '#BE9FE1' }}/>
</div>
<div className='chatInput'>
<div className='searchbar'>
  <MdOutlineEmojiEmotions onClick={()=>setOpen((prev)=> !prev)}/>

<input type='newMessage' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder='Enter your Message'/>

<button  onClick={sendMessage} style={{border:"none", background:"transparent"}}>
  <IoSend/>
  </button>
</div>

</div>

</div>
  );
}

export default Chat;
