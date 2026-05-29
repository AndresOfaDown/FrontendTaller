importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Necesitamos las mismas variables que configuraste en tu environment
firebase.initializeApp({
  apiKey: "AIzaSyDWqrhJIj2O9LsoqGEhwq7R3RLOGVB-Soc",
  authDomain: "talleres-39524.firebaseapp.com",
  projectId: "talleres-39524",
  storageBucket: "talleres-39524.firebasestorage.app",
  messagingSenderId: "928798373047",
  appId: "1:928798373047:web:4be2ed662c29737bdd0932",
  measurementId: "G-K0R59MJE01"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
