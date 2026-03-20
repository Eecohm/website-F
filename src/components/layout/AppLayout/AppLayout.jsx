import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <div className={styles.logoCircle}></div>
          <span className={styles.brandName}>SchoolManage</span>
        </div>

        <button
          onClick={handleSignOut}
          className={styles.btnSignOut}
          title="Sign out of your account"
          type="button"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </nav>

      {/* Page Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
