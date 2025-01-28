import { useNavigate } from 'react-router-dom';
import { loginFirebase } from '../../utils/reqs';
import styles from './style.module.scss';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

export default function GoogleSignIn() {
  const nav = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await loginFirebase(idToken);
      if (res) {
        console.log('Login successful, navigating...', res);
        nav('/');
      } else {
        console.error('Login failed:', res?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error during Google sign-in:', error.message);
    }
  };

  return (
    <div className={styles.googleCont}>
      <div className={styles.orLine}>
        <span className={styles.line}></span>
        or
        <span className={styles.line}></span>
      </div>
      <button className={styles.googleButton} onClick={handleGoogleSignIn}>
        Continue with Google
        <img
          className={styles.googleIcon}
          src="https://banner2.cleanpng.com/20201008/rtv/transparent-google-suite-icon-google-icon-1713858301568.webp"
          alt="Google Icon"
        />
      </button>
    </div>
  );
}
