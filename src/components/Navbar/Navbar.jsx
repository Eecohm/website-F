import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import styles from './Navbar.module.css';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/blog', label: 'Blog' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/contact', label: 'Contact' },
];

const menuVariants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.97 },
  visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:   { opacity: 0, y: -8, scaleY: 0.97, transition: { duration: 0.18, ease: 'easeIn' } },
};

const menuVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:   { opacity: 0, transition: { duration: 0.1 } },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 900) setIsOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const variants = prefersReduced ? menuVariantsReduced : menuVariants;

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : styles.navTransparent}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)} aria-label="EECOHM School of Excellence — Home">
            <img
              src="/images/logo.svg"
              alt="EECOHM logo"
              className={styles.logoImg}
              width="48"
              height="48"
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>EECOHM</span>
              <span className={styles.logoSub}>School of Excellence</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className={styles.desktopLinks} aria-label="Desktop navigation links">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.04, y: -1 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
            >
              <Link to="/contact" className={styles.ctaBtn} id="nav-apply-btn">
                Apply Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            id="hamburger-btn"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: prefersReduced ? 0 : 0.18 }}
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: prefersReduced ? 0 : 0.18 }}
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className={styles.mobileCta}
              onClick={() => setIsOpen(false)}
            >
              Apply Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
