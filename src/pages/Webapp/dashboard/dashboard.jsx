import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { UserCog, Clock, XCircle, LayoutDashboard, UserCheck, Bell } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || (!user.membership_status && !user.membership)) {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  const status = user.membership_status || user.membership?.status;
  const role = user.role_type || user.membership?.role;
  const displayName = user.first_name || user.email?.split('@')[0] || 'there';

  if (status === 'pending') {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.welcomeHeading}>Welcome, {displayName}!</h1>
        <div className={styles.statusCard} style={{ '--primary': '#f59e0b' }}>
          <div className={`${styles.iconWrapper} ${styles.iconPending}`}>
            <UserCog size={36} strokeWidth={2} />
          </div>
          <h3 className={styles.cardTitle}>Profile Pending Completion</h3>
          <p className={styles.cardDescription}>
            Your profile setup is incomplete. To access the dashboard and organization features, please provide your necessary profile details.
          </p>
          <div className={styles.actionRow}>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Return Home
            </Button>
            <Button variant="primary" onClick={() => navigate('/app/profile/setup')}>
              Complete Profile Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'waiting_approval') {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.welcomeHeading}>Welcome, {displayName}!</h1>
        <div className={styles.statusCard} style={{ '--primary': '#3b82f6' }}>
          <div className={`${styles.iconWrapper} ${styles.iconWaiting}`}>
            <Clock size={36} strokeWidth={2} />
          </div>
          <h3 className={styles.cardTitle}>Approval in Progress</h3>
          <p className={styles.cardDescription}>
            Your profile has been submitted and is currently waiting for administrator review. 
            You will be notified once your account is activated.
          </p>
          <div className={styles.actionRow}>
            <Button variant="outline" onClick={() => navigate('/app/profile/setup')}>
              Review Submitted Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.welcomeHeading}>Welcome, {displayName}</h1>
        <div className={styles.statusCard} style={{ '--primary': '#ef4444' }}>
          <div className={`${styles.iconWrapper} ${styles.iconRejected}`}>
            <XCircle size={36} strokeWidth={2} />
          </div>
          <h3 className={styles.cardTitle}>Application Rejected</h3>
          <p className={styles.cardDescription}>
            Unfortunately, your profile application was declined by the organization administrator. 
            You may update your details and submit again if you believe this was an error.
          </p>
          <div className={styles.actionRow}>
            <Button variant="outline" onClick={() => navigate('/app/profile/setup')}>
              Edit & Resubmit Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active User Dashboard
  return (
    <div className={styles.dashboardContainer} style={{ paddingTop: '2rem' }}>
      <div className={styles.activeHeader}>
        <h1 className={styles.activeGreeting}>Hello, {displayName} 👋</h1>
        <span className={styles.roleBadge}>{role ? role.replaceAll('_', ' ') : ''}</span>
      </div>
      
      <div className={styles.widgetGrid}>
        {/* Profile Widget */}
        <div 
          className={styles.widgetCard} 
          onClick={() => navigate('/app/profile')} 
          style={{ cursor: 'pointer', transition: 'transform 0.2s', ':active': { transform: 'scale(0.98)' } }}
        >
          <div className={styles.widgetIcon}>
            <UserCheck size={24} />
          </div>
          <div className={styles.widgetContent}>
            <h4>My Profile</h4>
            <p>View your profile details and upload identity documents.</p>
          </div>
        </div>

        {/* Placeholder Widget 2 */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetIcon}>
            <LayoutDashboard size={24} />
          </div>
          <div className={styles.widgetContent}>
            <h4>Workspace</h4>
            <p>Access your primary tools, schedules, and daily tasks.</p>
          </div>
        </div>

        {/* Placeholder Widget 3 */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetIcon}>
            <Bell size={24} />
          </div>
          <div className={styles.widgetContent}>
            <h4>Notifications</h4>
            <p>You're all caught up! No new alerts from the system today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}