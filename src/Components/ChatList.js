import React from 'react'
import { IoMdSearch } from "react-icons/io";
const ChatList = () => {
  return (
    <div>
      <div className='list'>
        <div className='searchbar'>
          <IoMdSearch/>
          <input type='text' placeholder='Seacrh' ></input>
          </div>
          <div className='chats'>
            <img src='./sa.JPG' alt='profiles'/>
            <div className='chatText'>
              <div className='name'>gaurav Bhatia</div>
              <div className='messagePreview'>Hello bro, how are you</div>
            </div>
            <div className='timeList'>01:20 pm</div>

          </div>
      </div>
    </div>
  )
}

export default ChatList