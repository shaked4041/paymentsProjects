import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/reqs';
import styles from './style.module.scss';
import { IoIosLogOut } from 'react-icons/io';

export default function index() {
  const nav = useNavigate();
  const handleLogout = () => {
    logout();
    nav('/login');
    // console.log(res);
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
