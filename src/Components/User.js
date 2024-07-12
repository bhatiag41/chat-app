import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
// import { useHistory } from 'react-router-dom';
import { auth } from '../Firebase'
const User = () => {
  const [user, setUser] = useState(null);
  
  // const history = useHistory();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        email: currentUser.email,
      });

    }
  }, []);

  const handleLogout = async () => {
    signOut(auth)
    .then(result => {
    })
    .catch(error => {
      console.log('error', error.message);
    })
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className='userInfo'>
      <div className='user'>
        <img src={user.photoURL || './default-avatar.png'} alt='user' />
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
