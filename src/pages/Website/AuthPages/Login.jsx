import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import styles from './Login.module.css';

/**
 * LoginPage — handles both user and admin login.
 *
 * When "Login as System Admin" is checked, submits to the admin
 * endpoint via AdminAuthContext. Otherwise uses AuthContext.
 *
 * NOTE: This page is rendered inside <AuthProvider> for regular login.
 *       For admin login, the user can navigate to /admin/login instead;
 *       the checkbox here is a convenience shortcut.
 */
export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  function validate() {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      addToast({ type: 'success', message: 'Welcome back!' });
      navigate('/app/dashboard');
    } catch (err) {
      let msg = 'An unexpected error occurred during login.';

      if (!err.response) {
        msg = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (err.response.status === 401 || err.response.status === 400) {
        msg = err.response.data?.message || err.response.data?.detail || 'Invalid credentials. Please try again.';
        setServerError(msg);
        return; // Early return as we've set the specific server error
      } else {
        msg = err.response.data?.message || err.response.data?.detail || 'Server error. Please try again later.';
      }

      // Unexpected error or server error → toast
      addToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>
          Sign in to your account to continue
        </p>
      </div>

      {serverError && (
        <p className={styles.serverError} role="alert">
          {serverError}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextInput
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Login
        </Button>

        <div className={styles.divider}>
          <span className={styles.dividerText}>OR</span>
        </div>

        <Button
          variant="ghost"
          fullWidth
          onClick={() => navigate('/admin/login')}
          className={styles.adminBtn}
        >
          Login as System Admin
        </Button>

        <div className={styles.links}>
          <Link to="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}