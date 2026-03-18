import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import styles from './AdminSidebar.module.css';

export function AdminSidebar() {
    const { adminLogout } = useAdminAuth();

    const navLinks = [
        { name: 'Dashboard', path: '/app/admin/dashboard' },
        { name: 'Org Profile', path: '/app/admin/profile' },
        { name: 'Sub-Organizations', path: '/app/admin/sub-orgs' },
        { name: 'User Approvals', path: '/app/admin/approvals' },
        { name: 'System Logs', path: '/app/admin/logs' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.brandName}>EduCore</div>
                <span className={styles.brandTag}>System Admin</span>
            </div>

            <nav className={styles.nav}>
                <div className={styles.navGroup}>
                    <div className={styles.groupLabel}>Management</div>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn} onClick={adminLogout}>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
