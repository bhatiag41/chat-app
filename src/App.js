import React from 'react'
import "./App.css"
import List  from './Components/List'
import Chat from './Components/Chat'
import Details from './Components/Details'
import ChatList from './Components/ChatList'
import User from './Components/User'
const App = () => {
  return (
    <div className='container'>
          <User/>
      <div className='inner'>
  
          <ChatList/>
       

      </div>
    </div>
  )
}

export default App