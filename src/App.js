import React from 'react'
import "./App.css"
import List  from './Components/List'
import Chat from './Components/Chat'
import Details from './Components/Details'
import ChatList from './Components/ChatList'
import User from './Components/User'
import Login from './Components/Login'
const App = () => {
  const user = false;
  return (
    <div className='container'>
      {
        user?(
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
        ):
        <Login/>
      }

    </div>
  )
}

export default App