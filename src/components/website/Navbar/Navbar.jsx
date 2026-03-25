import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import logo from '../../../assets/logo.svg';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Blur + cream activates when scrolled within hero but not at the very top (e.g. 50px)
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Quick handle for home/root
    if (id === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Program', id: 'programs' },
    { label: 'School', id: 'school' },
    { label: 'About', id: 'about-us' },
    { label: 'Testimonials', id: 'testimonials' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.logoContainer}>
          <a href="/" onClick={(e) => scrollToSection(e, '/')}>
            <img src={logo} alt="EECOHM Logo" className={styles.logo} />
          </a>
        </div>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className={styles.navLink}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact-us" 
            className={styles.contactBtn}
            onClick={(e) => scrollToSection(e, 'contact-us')}
          >
            Contact
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className={styles.hamburger} 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <FaBars />
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`${styles.drawer} ${isMobileMenuOpen ? styles.open : ''}`}>
        <button 
          className={styles.closeBtn} 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close Menu"
        >
          ✕
        </button>
        
        <div className={styles.mobileLinks}>
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className={styles.mobileLink}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact-us" 
            className={styles.mobileLink}
            style={{color: 'var(--brand-primary)', fontWeight: 'bold'}}
            onClick={(e) => scrollToSection(e, 'contact-us')}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
