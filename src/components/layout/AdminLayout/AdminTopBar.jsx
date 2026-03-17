import { useAdminAuth } from '@/context/AdminAuthContext';
import styles from './AdminTopBar.module.css';

export function AdminTopBar() {
    const { admin } = useAdminAuth();

    const initials = admin?.full_name
        ? admin.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'A';

    return (
        <header className={styles.topbar}>
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
