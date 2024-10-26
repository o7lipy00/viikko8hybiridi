import { initializeApp } from "firebase/app";
import { getFirestore,collection,addDoc, } from "firebase/firestore";



const firebaseConfig = {
apiKey: "",
  authDomain: "shoplist-22499.firebaseapp.com",
  projectId: "shoplist-22499",
  storageBucket: "shoplist-22499.appspot.com",
  messagingSenderId: "804011056956",
  appId: "1:804011056956:web:cf4209c2f66bfc667fc839"
};


initializeApp(firebaseConfig);
const firestore = getFirestore();


const MESSAGES = 'messages';

export{
    firestore,
    collection,
    addDoc,
    MESSAGES
};