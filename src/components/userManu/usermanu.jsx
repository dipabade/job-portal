import React, { useState, useRef, useEffect } from 'react';
import styles from './UserManu.module.scss';

const UserMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className={styles.menu} ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className={styles.avatarBtn}>
        <img src={user.avatar} alt="avatar" className={styles.avatar} />
      </button>
      {open && (
        <ul className={styles.dropdown}>
          <li><button onClick={() => {/* logout logic */}}>Logout</button></li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
