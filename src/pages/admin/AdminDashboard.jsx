import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { PageContainer } from '@/components/layout/AdminLayout/PageContainer';

export default function AdminDashboard() {
  const sections = [
    {
      title: 'Organization Profile',
      desc: 'Update school details, logo, contact information, and legal records.',
      icon: '🏢',
      path: '/app/admin/profile',
      theme: styles.cardPurple
    },
    {
      title: 'User Approvals',
      desc: 'Review and approve pending student or teacher registrations.',
      icon: '👥',
      path: '/app/admin/approvals',
      theme: styles.cardNavy
    },
    {
      title: 'System Logs',
      desc: 'Audit all platform activities and security events across the system.',
      icon: '📜',
      path: '/app/admin/logs',
      theme: styles.cardTeal
    },
    {
      title: 'Roles Management',
      desc: 'Define custom access roles and manage granular permissions.',
      icon: '🔐',
      path: '/app/admin/roles',
      theme: styles.cardPurple
    }
  ];

  return (
    <PageContainer>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>System Overview</h1>
          <p className={styles.subtitle}>Welcome back. Here is what is happening across the platform today.</p>
        </header>

        <div className={styles.grid}>
          {sections.map((section) => (
            <Link key={section.path} to={section.path} className={styles.card}>
              <div className={`${styles.cardIcon} ${section.theme}`}>
                {section.icon}
              </div>
              <h3 className={styles.cardTitle}>{section.title}</h3>
              <p className={styles.cardDesc}>{section.desc}</p>
              <div className={styles.cardAction}>
                Manage Section →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}