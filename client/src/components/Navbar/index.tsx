import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { LuMenu } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => {
    setNavOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setNavOpen(false);
    }
  };

  useEffect(() => {
    if (navOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navOpen]);

  return (
    <div>
      <button onClick={toggleNavbar} className={`${styles.menuButton}`}>
        {navOpen ? (
          <div className={styles.closeButton}>
            <IoMdClose />
          </div>
        ) : (
          <LuMenu />
        )}
      </button>
      <div
        ref={navRef}
        className={`${styles.navContainer} ${navOpen ? styles.open : ''}`}
      >
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
