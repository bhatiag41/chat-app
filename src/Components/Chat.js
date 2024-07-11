import React,{useState} from 'react';
import EmojiPicker from 'emoji-picker-react';
// import './Chat.scss';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
const Chat = () => {
  const [open,setOpen] = useState(false);
const [text,setText]= useState('');
  const handleEmoji=e=>{
    setText((prev=>prev+e.emoji))
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
<div className='chatWindow'>
<div className='senderMsg'>Hello</div>
<div className='recieverMsg'>Hi</div>
<div className='recieverMsg'>Hi</div>
<div className='senderMsg'>Hello</div>
</div>
<div className='emojiPicker'>

<EmojiPicker open={open} onEmojiClick={handleEmoji} style={{backgroundColor:"#BE9FE1"}}  pickerStyle={{ backgroundColor: '#BE9FE1' }}/>
</div>
<div className='chatInput'>
<div className='searchbar'>
  <MdOutlineEmojiEmotions onClick={()=>setOpen((prev)=> !prev)}/>

<input type='text' placeholder='Enter your Message'value={text} onChange={(e)=>setText(e.target.value)}/>
<IoSend/>
</div>

</div>

</div>
  );
}

export default Chat;
