import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// These should be environment variables -> process.env.SOME_VAR
const firebaseConfig = {
  apiKey: 'AIzaSyDXpUFRCD8HPnUXBv1kSYJkPrFTNB3281I',
  authDomain: 'cgi-tool.firebaseapp.com',
  projectId: 'cgi-tool',
  storageBucket: 'cgi-tool.appspot.com',
  messagingSenderId: '1033732471907',
  appId: '1:1033732471907:web:f476d424141c05090acc56',
  measurementId: 'G-69MY878CVT',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore(app)

// const analytics = getAnalytics(app)
