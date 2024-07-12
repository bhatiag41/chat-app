import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import "./App.css"
import Chat from './Components/Chat'

import ChatList from './Components/ChatList'
import User from './Components/User'
import Login from './Components/Login'
const App = () => {
  const [user, setUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className='container'>
      {
        user?(
          <>
          <User user={user}/>
      <div className='inner'>
  <div className='left'>

          <ChatList user={user}/>
  </div>
       <div className='right'>

<Chat user={user}/>
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