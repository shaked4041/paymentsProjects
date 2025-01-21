import { NavLink } from 'react-router-dom';
import styles from './style.module.scss';
import { LuMenu } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const toggleNavbar = () => {
    setNavOpen((prev) => !prev);
  };

  return (
    <div>
      <button onClick={toggleNavbar} className={`${styles.menuButton}`}>
        {navOpen ? <div className={styles.closeButton}><IoMdClose /></div> : <LuMenu />}
      </button>
      <div className={`${styles.navContainer} ${navOpen ? styles.open : ''}`}>
        <div className={styles.headerTitle}>BillTracker</div>
        <div className={styles.linksContainer}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            dashboard
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            payments
          </NavLink>
        </div>
      </div>
    </div>
  );
}
