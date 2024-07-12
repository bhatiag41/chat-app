import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Chat from './Components/Chat';
import Main from './Components/Main';
import ChatList from './Components/ChatList';
import User from './Components/User';
import Login from './Components/Login';

const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <Router>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Main user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
