// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

firebase.initializeApp({
  // Add your Firebase configuration here
});

const messaging = firebase.messaging();

// Customize notification behavior
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  // Customize notification handling here
});
