// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXpUFRCD8HPnUXBv1kSYJkPrFTNB3281I",
  authDomain: "cgi-tool.firebaseapp.com",
  projectId: "cgi-tool",
  storageBucket: "cgi-tool.appspot.com",
  messagingSenderId: "1033732471907",
  appId: "1:1033732471907:web:f476d424141c05090acc56",
  measurementId: "G-69MY878CVT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);  