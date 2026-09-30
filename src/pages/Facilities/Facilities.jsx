import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import FacilitiesGrid from '../../components/FacilitiesGrid/FacilitiesGrid';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { facilities, seo } from '../../data/content';
import styles from './Facilities.module.css';

export default function Facilities() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>{seo['/facilities'].title}</title>
        <meta name="description" content={seo['/facilities'].description} />
        <meta property="og:title" content={seo['/facilities'].title} />
        <meta property="og:description" content={seo['/facilities'].description} />
        <link rel="canonical" href="https://eecohm.edu.np/facilities" />
      </Helmet>

      <main id="main-content">
        {/* ── Hero banner ──────────────────────────────────────────────── */}
        <section className={styles.heroSection} aria-label="Facilities page header">
          <div className="container">
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Campus Life
            </motion.span>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              World-Class <span className={styles.heroAccent}>Facilities</span>
            </motion.h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              From AI & Robotics labs to culinary kitchens, our 12+ world-class
              facilities are designed to give every student the environment they
              need to excel.
            </motion.p>
          </div>
        </section>

        {/* ── Facilities grid (all 12) ─────────────────────────────────── */}
        <section className={styles.facilitiesSection} aria-labelledby="facilities-heading">
          <div className="container">
            <FacilitiesGrid facilities={facilities} showHeader={false} />
          </div>
        </section>
      </main>
    </>
  );
}
