import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import { IoLogOut } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const User = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
      
      try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL });
        setUser(prev => ({ ...prev, photoURL }));
      } catch (error) {
        console.error('Error updating profile photo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) {
    return <p>User</p>;
  }

  return (
    <div className='userInfo'>
      <div className='user'>
        <label htmlFor="profilePhotoInput" style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
          <img src={user.photoURL || './avatar.png'} alt='user' />
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
          <MdModeEdit
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '1px',
              Color: '#E1CCEC',
              borderRadius: '50%',
              padding: '4px',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              backgroundColor: '#734c9e'
            }}
          />
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>
        <h2>{user.displayName || user.email}</h2>
      </div>
      <div className='icons'>
        
        <button className='deleteBtn' onClick={handleLogout}>
        <IoLogOut />
        </button>
      </div>
    </div>
  );
};

export default User;
