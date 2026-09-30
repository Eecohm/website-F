import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Facebook, Instagram, Linkedin } from '../../components/SocialIcons/SocialIcons';
import ContactForm from '../../components/ContactForm/ContactForm';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { org, seo } from '../../data/content';
import styles from './Contact.module.css';

export default function Contact() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>{seo['/contact'].title}</title>
        <meta name="description" content={seo['/contact'].description} />
        <meta property="og:title" content={seo['/contact'].title} />
        <meta property="og:description" content={seo['/contact'].description} />
        <link rel="canonical" href="https://eecohm.edu.np/contact" />
      </Helmet>

      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.heroSection} aria-label="Contact page header">
          <div className="container">
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Get in Touch
            </motion.span>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Contact <span className={styles.heroAccent}>EECOHM</span>
            </motion.h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Have questions about admissions, programs, or facilities? We&apos;re here to help.
              Reach out and our team will respond within one business day.
            </motion.p>
          </div>
        </section>

        {/* ── Contact section ──────────────────────────────────────────── */}
        <section className={styles.contactSection} aria-label="Contact information and form">
          <div className="container">
            <div className={styles.contactGrid}>
              {/* Info panel */}
              <div className={styles.infoPanel}>
                <SectionReveal direction="left">
                  <span className={styles.sectionEyebrow}>Find Us</span>
                  <h2 className={styles.sectionHeading}>
                    We&apos;d Love to <span className={styles.headingAccent}>Hear</span> From You
                  </h2>
                  <p className={styles.sectionText}>
                    Whether you&apos;re a prospective student, parent, or partner, we welcome your
                    enquiry. Rolling admissions are open — seats fill fast.
                  </p>
                </SectionReveal>

                <SectionReveal direction="left" delay={0.1}>
                  <div className={styles.contactItems}>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIconWrap} aria-hidden="true">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className={styles.contactItemLabel}>Address</p>
                        <a
                          href={org.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.contactItemLink}
                        >
                          {org.address}
                        </a>
                      </div>
                    </div>

                    <div className={styles.contactItem}>
                      <div className={styles.contactIconWrap} aria-hidden="true">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className={styles.contactItemLabel}>Phone</p>
                        <a href={`tel:${org.phone}`} className={styles.contactItemLink}>
                          {org.phone}
                        </a>
                      </div>
                    </div>

                    <div className={styles.contactItem}>
                      <div className={styles.contactIconWrap} aria-hidden="true">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className={styles.contactItemLabel}>Email</p>
                        <a href={`mailto:${org.email}`} className={styles.contactItemLink}>
                          {org.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Socials */}
                  <div className={styles.socials} aria-label="Social media">
                    <a href={org.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="EECOHM on Facebook">
                      <Facebook size={18} />
                    </a>
                    <a href={org.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="EECOHM on Instagram">
                      <Instagram size={18} />
                    </a>
                    <a href={org.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="EECOHM on LinkedIn">
                      <Linkedin size={18} />
                    </a>
                  </div>
                </SectionReveal>

                {/* Map */}
                <SectionReveal direction="left" delay={0.2}>
                  <div className={styles.mapWrap}>
                    <iframe
                      className={styles.mapIframe}
                      title="EECOHM School of Excellence location map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.1234!2d87.9692917!3d26.643542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEECOHM+College!5e0!3m2!1sen!2snp!4v1234567890"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      aria-label="Google Maps showing EECOHM School of Excellence in Birtamod, Jhapa"
                    />
                  </div>
                </SectionReveal>
              </div>

              {/* Form panel */}
              <SectionReveal direction="right">
                <div className={styles.formPanel}>
                  <ContactForm />
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
