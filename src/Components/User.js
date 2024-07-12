import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';

const User = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
        });
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login'); // Redirect to the login page
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className='userInfo'>
      <div className='user'>
        <img src={user.photoURL || './avatar.png'} alt='user' />
        <h2>{user.displayName || user.email}</h2>
      </div>
      <div className='icons'>
        <img src='./more.png' alt='more' />
        <button onClick={handleLogout} className='logoutButton'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;
