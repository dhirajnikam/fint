import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcsJV6bRt1NVtHncmnnBZCpy0JclC1hd0",
  authDomain: "trackwise-h6zk3.firebaseapp.com",
  projectId: "trackwise-h6zk3",
  storageBucket: "trackwise-h6zk3.firebasestorage.app",
  messagingSenderId: "188468311111",
  appId: "1:188468311111:web:e0f520b25b6872b6992d62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 