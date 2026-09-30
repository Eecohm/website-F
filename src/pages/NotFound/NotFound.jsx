import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | EECOHM School of Excellence</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className={styles.page} id="main-content">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.code} aria-hidden="true">404</p>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.text}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Head back to the
            homepage and explore EECOHM School of Excellence.
          </p>
          <Link to="/" className={styles.link} id="notfound-home-link">
            <Home size={18} /> Back to Homepage
          </Link>
        </motion.div>
      </main>
    </>
  );
}
