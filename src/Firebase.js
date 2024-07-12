import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVPSTfsr7weOj3oMj_lPn_68sDrDMucj8",
  authDomain: "chat-app-7ceec.firebaseapp.com",
  projectId: "chat-app-7ceec",
  storageBucket: "chat-app-7ceec.appspot.com",
  messagingSenderId: "549947054490",
  appId: "1:549947054490:web:f45610c54ce08ab5738223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, storage };