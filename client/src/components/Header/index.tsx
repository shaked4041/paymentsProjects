import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';
import { IoIosLogOut } from 'react-icons/io';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

export default function index() {
  const { logoutUser } = useAuthStore();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      logoutUser() 
      nav('/login');  
    } catch (error) {
      console.error('Logout failed:', error);  
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className={styles.mainHeaderContainer}>
      <div className={styles.tooltipContainer}>
        <button
          title="Logout"
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <IoIosLogOut />
        </button>
        <span className={styles.tooltipText}>Logout</span>
      </div>
    </div>
  );
}
