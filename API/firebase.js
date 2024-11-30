// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlane8x-tr1nh8lCsDCMKHmkIvBmmTcok",
  authDomain: "devdeakin-bb283.firebaseapp.com",
  projectId: "devdeakin-bb283",
  storageBucket: "devdeakin-bb283.appspot.com",
  messagingSenderId: "1083954181792",
  appId: "1:1083954181792:web:a1d0aad2c85c6b46477bc5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters ({
    prompt:"select_account"
});

export default firebaseApp;
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const db = getFirestore();

export const createUserDocFromAuth = async (userAuth, additionalInformation ={}) => {
  if (!userAuth.email) return;
  const userDocRef = doc (db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (! userSnapshot.exists()){
    const{displayName, email} = userAuth;
    const createdAt =  new Date();
  

    try{
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      })
    }
    catch (error){
      console.log('error in creating', error.message )
    }
  }

  return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if(!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signinAuthUserWithEmailAndPassword = async (email, password) => {
  if(!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password)
}