import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZNajyAVMmHWIqX_Resj9FWZu_7WV7mTA",
  authDomain: "paysafesecurity-81d4a.firebaseapp.com",
  databaseURL: "https://paysafesecurity-81d4a-default-rtdb.firebaseio.com",
  projectId: "paysafesecurity-81d4a",
  storageBucket: "paysafesecurity-81d4a.appspot.com",
  messagingSenderId: "430055383965",
  appId: "1:430055383965:web:c62a085f7899cc32194574",
  measurementId: "G-N16T82BXE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app; 
