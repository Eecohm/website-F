import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Facebook, Instagram, Linkedin } from '../SocialIcons/SocialIcons';
import styles from './Footer.module.css';
import { org } from '../../data/content';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/programs', label: 'Programs' },
  { to: '/why-eecohm', label: 'Why EECOHM' },
  { to: '/credit-transfer', label: 'Credit Transfer' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/contact', label: 'Contact' },
];

const programLinks = [
  { to: '/programs/advanced-diploma-computer-science', label: 'ADCS' },
  { to: '/programs/advanced-diploma-hotel-management', label: 'ADHM' },
  { to: '/programs/diploma-hotel-management', label: 'DHM' },
  { to: '/programs/business-studies', label: 'Business Studies' },
  { to: '/programs/pre-school-to-secondary', label: 'Pre-School to Secondary' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className="container section-pad">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <img src="/images/logo.svg" alt="EECOHM logo" className={styles.logoImg} width="48" height="48" />
              <span className={styles.logoText}>EECOHM</span>
            </div>
            <p className={styles.tagline}>{org.tagline}</p>
            <div className={styles.socials} aria-label="Social media links">
              <a href={org.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href={org.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={org.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList} role="list">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={styles.footerLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className={styles.colTitle}>Programs</h3>
            <ul className={styles.linkList} role="list">
              {programLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={styles.footerLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={styles.colTitle}>Contact Us</h3>
            <div className={styles.linkList}>
              <div className={styles.contactItem}>
                <MapPin size={16} className={styles.contactIcon} />
                <span>{org.address}</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} />
                <a href={`tel:${org.phone}`} className={styles.footerLink}>{org.phone}</a>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <a href={`mailto:${org.email}`} className={styles.footerLink}>{org.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} <span className={styles.accent}>EECOHM School of Excellence</span>. All rights reserved.
          </p>
          <p className={styles.affiliation}>
            Affiliated with NEB & Qualifications Scotland · Birtamod-4, Jhapa, Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
