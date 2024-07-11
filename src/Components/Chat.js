import React from 'react';
// import './Chat.scss';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
const chat = () => {
  return (
<div className='chat'>
<div className='header'>
<div className='user window'>
    <img src='./sa.JPG' alt='user'/>
    <h2>Gaurav Bhatia</h2>
</div>
</div>
<div className='chatWindow'>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
</div>
<div className='chatInput'>
<div className='searchbar'>
<MdOutlineEmojiEmotions/>

<input type='text' placeholder='Enter your Message'></input>
<IoSend/>
</div>

</div>

</div>
  );
}

export default chat;
