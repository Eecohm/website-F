import { useAdminAuth } from '@/context/AdminAuthContext';
import styles from './AdminTopBar.module.css';

export function AdminTopBar({ onToggleSidebar }) {
    const { admin } = useAdminAuth();

    const initials = admin?.full_name
        ? admin.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'A';

    return (
        <header className={styles.topbar}>
            <button className={styles.menuToggle} onClick={onToggleSidebar} aria-label="Toggle Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20"/>
                </svg>
            </button>
            <div className={styles.userInfo}>
                <div className={styles.userLabel}>
                    <span className={styles.userName}>{admin?.full_name || 'Admin'}</span>
                    <span className={styles.userRole}>System Administrator</span>
                </div>
                <div className={styles.avatar}>
                    {initials}
                </div>
            </div>
        </header>
    );
}
