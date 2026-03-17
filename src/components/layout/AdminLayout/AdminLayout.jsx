import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <main className={styles.main}>
                <AdminTopBar />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
