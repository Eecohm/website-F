import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.layout}>
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className={styles.main}>
                <AdminTopBar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
