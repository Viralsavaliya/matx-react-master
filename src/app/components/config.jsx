import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/firestore';


import { getAuth } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyDWPgbeCDY0tBn5tzj9vuVkRYQ75FZb8vQ",
//   authDomain: "metime-993b3.firebaseapp.com",
//   projectId: "metime-993b3",
//   storageBucket: "metime-993b3.appspot.com",
//   messagingSenderId: "0976550843",
//   appId: "1:70976550843:web:605a040728356f4310369e",
//   measurementId: "G-KMCZPZGTZ9"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDugv256WzQ4HY0GfhEcj6O3og3Q-XhzCc",
  authDomain: "new-project-386405.firebaseapp.com",
  projectId: "new-project-386405",
  storageBucket: "new-project-386405.appspot.com",
  messagingSenderId: "422790938507",
  appId: "1:422790938507:web:c449df2f0f996fe3be398e",
  measurementId: "G-MMP9ZLQP4X"
};

const app = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);  
const messaging = app.messaging();
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');
  return messaging.getyoken();
}).then((token) => {
  console.log('Device token:', token);
}).catch((error) => {
  console.error('Error obtaining permission:', error);
});

const auth = getAuth(app);
export {auth}