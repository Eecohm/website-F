import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { programs, seo } from '../../data/content';
import styles from './Programs.module.css';

const filters = [
  { key: 'all', label: 'All Programs' },
  { key: 'technology', label: 'Computer Science' },
  { key: 'hospitality', label: 'Hotel Management' },
  { key: 'business', label: 'Business Studies' },
  { key: 'school', label: 'Pre-School / Secondary' },
];

export default function Programs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const prefersReduced = useReducedMotion();

  const filtered = activeFilter === 'all'
    ? programs
    : programs.filter((p) => p.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>{seo['/programs'].title}</title>
        <meta name="description" content={seo['/programs'].description} />
        <meta property="og:title" content={seo['/programs'].title} />
        <meta property="og:description" content={seo['/programs'].description} />
        <link rel="canonical" href="https://eecohm.edu.np/programs" />
      </Helmet>

      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.heroSection} aria-label="Programs page header">
          <div className="container">
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              NEB Affiliated
            </motion.span>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Our <span className={styles.heroAccent}>Programs</span>
            </motion.h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              7 programs spanning technology, hospitality, business, and school
              education — all designed for real-world career readiness.
            </motion.p>
          </div>
        </section>

        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className={styles.filterSection} role="navigation" aria-label="Filter programs by category">
          <div className="container">
            <div className={styles.filterBar}>
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`${styles.filterBtn} ${activeFilter === f.key ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={activeFilter === f.key}
                  id={`filter-${f.key}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Programs grid ────────────────────────────────────────────── */}
        <section className={styles.programsSection} aria-label="Programs grid">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                className={styles.grid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReduced ? 0.1 : 0.25 }}
              >
                {filtered.length === 0 ? (
                  <p className={styles.noResults}>No programs found in this category.</p>
                ) : (
                  filtered.map((prog, i) => (
                    <ProgramCard key={prog.slug} program={prog} index={i} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>
    </>
  );
}
