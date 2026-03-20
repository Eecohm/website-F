import { PageContainer } from '@/components/layout/AdminLayout/PageContainer';
import styles from '../OrgProfileSetup.module.css'; // Reuse setup styles for layout consistency

export default function RolesManagement() {
  return (
    <PageContainer>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Roles Management</h1>
            <p className={styles.subtitle}>
              Create and manage custom roles for your organization, and configure their permission profiles.
            </p>
          </div>
        </header>

        <div className={styles.card} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Roles Management Coming Soon
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            This section will allow you to create custom roles, assign granular permissions across modules, and manage feature flags per role. 
            Default roles (Student, Teacher, Staff) have already been provisioned for your organization.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
