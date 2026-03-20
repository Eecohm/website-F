import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  waiting_approval: {
    title: 'Approval in Progress',
    message: 'Your profile has been submitted and is under review. You will be notified once your account is activated.',
    canUpdate: false,
  },
  rejected: {
    title: 'Profile Not Approved',
    message: 'Your profile was not approved. Please update your details and resubmit.',
    canUpdate: true,
  },
  suspended: {
    title: 'Account Suspended',
    message: 'Your account has been suspended. Please contact your administrator.',
    canUpdate: false,
  },
};

export default function StatusPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const config = STATUS_CONFIG[user?.membership_status] ?? STATUS_CONFIG.waiting_approval;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h2>{config.title}</h2>
      <p style={{ color: '#6B7280', lineHeight: 1.6 }}>{config.message}</p>
      {config.canUpdate && (
        <button
          onClick={() => navigate('/app/profile/setup')}
          style={{ marginTop: 20, padding: '9px 20px', background: '#3B5BDB', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
        >
          Update Profile
        </button>
      )}
      <br />
      <button
        onClick={handleSignOut}
        style={{ marginTop: 12, padding: '9px 20px', border: '1.5px solid #E2E6EF', borderRadius: 8, cursor: 'pointer', background: 'transparent', fontSize: 14, color: '#6B7280' }}
      >
        Sign Out
      </button>
    </div>
  );
}
