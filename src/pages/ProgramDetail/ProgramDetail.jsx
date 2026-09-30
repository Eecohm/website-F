import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, Award, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { programs } from '../../data/content';
import styles from './ProgramDetail.module.css';

export default function ProgramDetail() {
  const { slug } = useParams();
  const prefersReduced = useReducedMotion();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  const related = programs.filter((p) => p.slug !== slug && p.category === program.category).slice(0, 2);

  const title = `${program.name} — EECOHM School of Excellence`;
  const description = `${program.description} ${program.features.slice(0, 2).join('. ')}. Jhapa, Nepal.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={program.image} />
        <link rel="canonical" href={`https://eecohm.edu.np/programs/${slug}`} />
      </Helmet>

      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.heroSection} aria-label={`${program.name} header`}>
          <img
            src={program.image}
            alt={program.name}
            className={styles.heroBg}
            loading="eager"
            width={1920}
            height={600}
          />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className="container">
            <div className={styles.heroContent}>
              {/* Breadcrumb */}
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight size={13} className={styles.breadcrumbSep} aria-hidden="true" />
                <Link to="/programs">Programs</Link>
                <ChevronRight size={13} className={styles.breadcrumbSep} aria-hidden="true" />
                <span>{program.shortName}</span>
              </nav>

              {/* Icon */}
              {program.icon && (
                <motion.img
                  src={program.icon}
                  alt={`${program.acronym} icon`}
                  className={styles.heroIcon}
                  initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* Badges */}
              <div className={styles.heroMeta}>
                <span className={styles.heroBadge}>
                  <Clock size={13} /> {program.duration}
                </span>
                <span className={styles.heroBadge}>
                  <Award size={13} /> NEB Affiliated
                </span>
              </div>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                {program.name}
              </motion.h1>
            </div>
          </div>
        </section>

        {/* ── Description + Info card ──────────────────────────────────── */}
        <section className={styles.descSection}>
          <div className="container">
            <div className={styles.descGrid}>
              <div className={styles.descContent}>
                <SectionReveal>
                  <span className={styles.sectionEyebrow}>Program Overview</span>
                  <h2 className={styles.sectionHeading}>
                    About the <span className={styles.headingAccent}>{program.acronym}</span> Program
                  </h2>
                  <p className={styles.descText}>{program.description}</p>
                </SectionReveal>

                {program.features.length > 0 && (
                  <SectionReveal delay={0.1}>
                    <h3 className={styles.sectionHeading} style={{ fontSize: 'var(--text-xl)' }}>
                      Key Features
                    </h3>
                    <ul className={styles.featuresList} role="list">
                      {program.features.map((f) => (
                        <li key={f} className={styles.featureItem}>
                          <CheckCircle size={17} className={styles.featureIcon} aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </SectionReveal>
                )}
              </div>

              {/* Sticky info card */}
              <motion.aside
                className={styles.infoCard}
                initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                aria-label="Program quick information"
              >
                <h3 className={styles.infoTitle}>Program Info</h3>

                <div className={styles.infoRow}>
                  <Clock size={18} className={styles.infoRowIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoRowLabel}>Duration</p>
                    <p className={styles.infoRowValue}>{program.duration}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <Award size={18} className={styles.infoRowIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoRowLabel}>Affiliation</p>
                    <p className={styles.infoRowValue}>NEB (Nepal Examinations Board)</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <CheckCircle size={18} className={styles.infoRowIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoRowLabel}>Eligibility</p>
                    <p className={styles.infoRowValue}>SEE Passed (Grade 10 or equivalent)</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <ArrowRight size={18} className={styles.infoRowIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoRowLabel}>Admissions</p>
                    <p className={styles.infoRowValue}>Rolling — Apply any time</p>
                  </div>
                </div>

                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.03 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                >
                  <Link
                    to="/contact"
                    className={styles.applyBtn}
                    id={`apply-btn-${slug}`}
                    aria-label={`Apply for ${program.name}`}
                  >
                    Apply Now <ArrowRight size={17} />
                  </Link>
                </motion.div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* ── Related programs ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section style={{ paddingBlock: 'var(--section-pad-v)', background: 'var(--color-surface-alt)' }}>
            <div className="container">
              <SectionReveal>
                <h2 className={styles.sectionHeading} style={{ marginBottom: 'var(--space-10)' }}>
                  Related <span className={styles.headingAccent}>Programs</span>
                </h2>
              </SectionReveal>
              <div style={{ display: 'grid', gap: 'var(--space-8)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {related.map((prog, i) => (
                  <ProgramCard key={prog.slug} program={prog} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
