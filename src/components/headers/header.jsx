import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';
import styles from './Header.module.scss';

export default function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to='/'>MyApp</Link>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.show : ''}`}>
        {!user ? (
          <Link to='/login' className={styles.navLink}>Login</Link>
        ) : (
          <>
            {role === 'admin' && (
              <>
                <Link to='/admin/jobs' className={styles.navLink}>Add Job</Link>
                <Link to='/admin/jobs/list' className={styles.navLink}>Jobs</Link>
              </>
            )}
            <span className={styles.email}>{user.email}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
