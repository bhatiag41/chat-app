import React from 'react'
import User from './User'
import Chat from './Chat'
import ChatList from './ChatList'

const Main = () => {
  return (
    <>
                  <User/>
      <div className='inner'>
  <div className='left'>

          <ChatList/>
  </div>
       <div className='right'>

<Chat/>
       </div>

      </div>
   </>
  )
}

export default Main