// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFqCkPWASrPEuT31MT0yVkxq3itweqklk",
  authDomain: "partners-chat-2a98f.firebaseapp.com",
  projectId: "partners-chat-2a98f",
  storageBucket: "partners-chat-2a98f.appspot.com",
  messagingSenderId: "175094547239",
  appId: "1:175094547239:web:f96505eb4dced519105f02",
  measurementId: "G-T6EFMVEZCZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Auth
// Initialize Firebase Authentication and get a reference to the service
export const storage = getStorage(app);
export default app;
