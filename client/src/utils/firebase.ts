import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTAlxG_b-Lo3g8ZJJ9KWdU4VuV-dLdNUQ",
  authDomain: "payments-project-90656.firebaseapp.com",
  projectId: "payments-project-90656",
  storageBucket: "payments-project-90656.firebasestorage.app",
  messagingSenderId: "571381534421",
  appId: "1:571381534421:web:423fa126a7ec9d4dee9c5c"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  export { auth, provider };

