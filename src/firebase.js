// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Your web app's Firebase configuration
// Create a .env file to keep your app configurations
// Find an .env.examples file for reference under the project folder.
const firebaseConfig = {
  apiKey: "AIzaSyCYQlMz7DJ1cp5CYA3GrcoPHyNRHYAW1sk",
  authDomain: "guestbook-e46b4.firebaseapp.com",
  projectId: "guestbook-e46b4",
  storageBucket: "guestbook-e46b4.appspot.com",
  messagingSenderId: "761619793810",
  appId: "1:761619793810:web:a6ce569041dbefa461a34b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return user;
  } catch (err) {
    // eslint-disable-next-line no-undef
    throw error;
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    // eslint-disable-next-line no-undef
    throw error;
  }
};

const sendPasswordReset = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

const signInWithGoogle = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await signInWithPopup(auth, googleAuthProvider);
    const user = res.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  auth,
  sendPasswordReset,
  signInWithGoogle,
};
