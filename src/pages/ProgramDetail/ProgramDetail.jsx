import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, Award, CheckCircle, ArrowRight, ChevronRight, ExternalLink, Globe, BookOpen } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { programs } from '../../data/content';
import styles from './ProgramDetail.module.css';

const subjectColors = {
  core: { bg: 'rgba(139,69,19,0.1)', border: '#8B4513', label: 'Core Module' },
  compulsory: { bg: 'rgba(13,92,99,0.1)', border: '#0D5C63', label: 'Compulsory' },
  elective: { bg: 'rgba(108,52,131,0.1)', border: '#6C3483', label: 'Elective' },
  diploma: { bg: 'rgba(46,89,2,0.1)', border: '#2E5902', label: 'Diploma Module' },
  support: { bg: 'rgba(232,160,32,0.12)', border: '#E8A020', label: 'Support Module' },
  practical: { bg: 'rgba(134,59,255,0.1)', border: '#863bff', label: 'Practical' },
};

function SubjectPill({ subject }) {
  const s = subjectColors[subject.type] || subjectColors.core;
  return (
    <motion.div
      className={styles.subjectPill}
      style={{ background: s.bg, borderColor: s.border }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.18 }}
    >
      <span className={styles.subjectType} style={{ color: s.border }}>{s.label}</span>
      <span className={styles.subjectName}>{subject.name}</span>
      {subject.hours && (
        <span className={styles.subjectHours}>{subject.hours}h</span>
      )}
    </motion.div>
  );
}

function SCQFBadge({ level, credits, eqfLevel }) {
  return (
    <div className={styles.scqfBadge}>
      <div className={styles.scqfItem}>
        <span className={styles.scqfValue}>Level {level}</span>
        <span className={styles.scqfLabel}>SCQF</span>
      </div>
      <div className={styles.scqfDivider} />
      <div className={styles.scqfItem}>
        <span className={styles.scqfValue}>{credits}</span>
        <span className={styles.scqfLabel}>Credits</span>
      </div>
      {eqfLevel && (
        <>
          <div className={styles.scqfDivider} />
          <div className={styles.scqfItem}>
            <span className={styles.scqfValue}>EQF {eqfLevel}</span>
            <span className={styles.scqfLabel}>European</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProgramDetail() {
  const { slug } = useParams();
  const prefersReduced = useReducedMotion();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  const related = programs
    .filter((p) => p.slug !== slug && p.category === program.category)
    .slice(0, 2);

  const isQS = program.affiliation?.includes('Qualifications Scotland');
  const isNEB = program.affiliation?.includes('NEB');

  const title = `${program.name} — EECOHM School of Excellence`;
  const description = `${program.description} Jhapa, Nepal.`;

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
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight size={13} className={styles.breadcrumbSep} aria-hidden="true" />
                <Link to="/programs">Programs</Link>
                <ChevronRight size={13} className={styles.breadcrumbSep} aria-hidden="true" />
                <span>{program.shortName}</span>
              </nav>

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

              <div className={styles.heroMeta}>
                <span className={styles.heroBadge}>
                  <Clock size={13} /> {program.duration}
                </span>
                <span className={styles.heroBadge} style={{ background: isQS ? 'rgba(0,100,160,0.85)' : undefined }}>
                  <Award size={13} />
                  {program.affiliation || 'NEB Affiliated'}
                </span>
                {program.scqfLevel && (
                  <span className={styles.heroBadge} style={{ background: 'rgba(134,59,255,0.85)' }}>
                    SCQF Level {program.scqfLevel} · {program.scqfCredits} Credits
                  </span>
                )}
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
                  <span className={styles.sectionEyebrow}>Programme Overview</span>
                  <h2 className={styles.sectionHeading}>
                    About the <span className={styles.headingAccent}>{program.acronym}</span> Programme
                  </h2>
                  <p className={styles.descText}>{program.description}</p>
                </SectionReveal>

                {/* SCQF Badge for QS programmes */}
                {program.scqfLevel && (
                  <SectionReveal delay={0.05}>
                    <SCQFBadge
                      level={program.scqfLevel}
                      credits={program.scqfCredits}
                      eqfLevel={program.eqfLevel}
                    />
                  </SectionReveal>
                )}

                {/* Duration breakdown */}
                {program.durationBreakdown?.internship && (
                  <SectionReveal delay={0.08}>
                    <div className={styles.durationGrid}>
                      <div className={styles.durationItem}>
                        <span className={styles.durationVal}>{program.durationBreakdown.training}</span>
                        <span className={styles.durationLbl}>Academic Training</span>
                      </div>
                      <div className={styles.durationPlus}>+</div>
                      <div className={styles.durationItem}>
                        <span className={styles.durationVal}>{program.durationBreakdown.internship}</span>
                        <span className={styles.durationLbl}>Paid Internship</span>
                      </div>
                      <div className={styles.durationPlus}>=</div>
                      <div className={styles.durationItem}>
                        <span className={styles.durationVal}>{program.duration}</span>
                        <span className={styles.durationLbl}>Total Programme</span>
                      </div>
                    </div>
                  </SectionReveal>
                )}

                {/* Subjects */}
                {program.detailedSubjects && program.detailedSubjects.length > 0 ? (
                  <SectionReveal delay={0.1}>
                    <h3 className={styles.sectionHeading} style={{ fontSize: 'var(--text-xl)', marginTop: '2rem' }}>
                      <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      Detailed Curriculum
                    </h3>
                    
                    <div className={styles.detailedSubjectsWrapper}>
                      {program.detailedSubjects.map((levelBlock) => (
                        <div key={levelBlock.level} className={styles.levelBlock}>
                          <h4 className={styles.levelTitle}>{levelBlock.level}</h4>
                          <div className={styles.tableResponsive}>
                            <table className={styles.subjectTable}>
                              <thead>
                                <tr>
                                  <th>Course Code</th>
                                  <th>Subject</th>
                                  <th>Th. Int</th>
                                  <th>Th. Ext</th>
                                  <th>Pr. Int</th>
                                  <th>Pr. Ext</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {levelBlock.courses.map((c, i) => (
                                  <tr key={i}>
                                    <td>{c.code}</td>
                                    <td>{c.name}</td>
                                    <td>{c.thInt}</td>
                                    <td>{c.thExt}</td>
                                    <td>{c.prInt}</td>
                                    <td>{c.prExt}</td>
                                    <td className={styles.totalCol}>{c.total}</td>
                                  </tr>
                                ))}
                                <tr className={styles.tableFooter}>
                                  <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total full marks at this level:</td>
                                  <td className={styles.totalCol} style={{ fontWeight: 'bold' }}>{levelBlock.totalMarks}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionReveal>
                ) : program.subjects && program.subjects.length > 0 ? (
                  <SectionReveal delay={0.1}>
                    <h3 className={styles.sectionHeading} style={{ fontSize: 'var(--text-xl)', marginTop: '2rem' }}>
                      <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      Curriculum & Subjects
                    </h3>
                    <div className={styles.subjectsGrid}>
                      {program.subjects.map((s) => (
                        <SubjectPill key={s.name} subject={s} />
                      ))}
                    </div>
                    <p className={styles.subjectsNote}>
                      {isNEB
                        ? 'Subjects follow NEB choice-based curriculum. 75% written exam + 25% internal assessment.'
                        : 'Programme delivered by LCCI GQ partner training sites. Hours are indicative.'}
                    </p>
                  </SectionReveal>
                ) : null}

                {program.features.length > 0 && (
                  <SectionReveal delay={0.12}>
                    <h3 className={styles.sectionHeading} style={{ fontSize: 'var(--text-xl)', marginTop: '2rem' }}>
                      Key Features & Benefits
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

                {/* Credit Transfer table */}
                {program.creditTransfer && program.creditTransfer.length > 0 && (
                  <SectionReveal delay={0.15}>
                    <h3 className={styles.sectionHeading} style={{ fontSize: 'var(--text-xl)', marginTop: '2rem' }}>
                      <Globe size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      Credit Transfer Pathways
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                      Your SCQF Level 7 qualification may entitle you to advanced entry at these institutions:
                    </p>
                    <div className={styles.ctTable}>
                      <div className={styles.ctTableHeader}>
                        <span>University / Institution</span>
                        <span>Country</span>
                        <span>Entry Level</span>
                      </div>
                      {program.creditTransfer.map((ct) => (
                        <div key={ct.university} className={styles.ctTableRow}>
                          <span>{ct.university}</span>
                          <span>{ct.country}</span>
                          <span className={styles.ctEntry}>{ct.entry}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/credit-transfer" className={styles.ctLink}>
                      Learn more about Credit Transfer <ArrowRight size={15} />
                    </Link>
                  </SectionReveal>
                )}
              </div>

              {/* Sticky info card */}
              <motion.aside
                className={styles.infoCard}
                initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                aria-label="Programme quick information"
              >
                <h3 className={styles.infoTitle}>Programme Info</h3>

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
                    <p className={styles.infoRowValue}>
                      {program.affiliation || 'Nepal Examinations Board (NEB)'}
                    </p>
                    {program.affiliationUrl && (
                      <a
                        href={program.affiliationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.affiliationLink}
                      >
                        Official Site <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                {program.scqfLevel && (
                  <div className={styles.infoRow}>
                    <Globe size={18} className={styles.infoRowIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoRowLabel}>International Level</p>
                      <p className={styles.infoRowValue}>SCQF Level {program.scqfLevel} · {program.scqfCredits} Credits</p>
                      <p className={styles.infoRowValue} style={{ fontSize: '0.75rem', opacity: 0.7 }}>EQF Level {program.eqfLevel}</p>
                    </div>
                  </div>
                )}

                <div className={styles.infoRow}>
                  <CheckCircle size={18} className={styles.infoRowIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoRowLabel}>Eligibility</p>
                    <p className={styles.infoRowValue}>{program.eligibility || 'SEE Passed (Grade 10)'}</p>
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
                  Related <span className={styles.headingAccent}>Programmes</span>
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
