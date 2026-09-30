/**
 * CreditTransfer page — fully animated, data-rich dedicated page explaining
 * SCQF credit transfer, what it means, how EECOHM qualifications unlock it,
 * NEB GPA chart, SCQF level ladder, and partner university pathways.
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, BookOpen, Award, TrendingUp, CheckCircle } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import styles from './CreditTransfer.module.css';

// ── Data ──────────────────────────────────────────────────────────────────
const NEB_GRADES = [
  { grade: 'A+', gp: 4.0, range: '90–100', label: 'Outstanding', color: '#0D5C63' },
  { grade: 'A',  gp: 3.6, range: '80–90',  label: 'Excellent',  color: '#2E5902' },
  { grade: 'B+', gp: 3.2, range: '70–80',  label: 'Very Good',  color: '#5A6B00' },
  { grade: 'B',  gp: 2.8, range: '60–70',  label: 'Good',       color: '#8B8B00' },
  { grade: 'C+', gp: 2.4, range: '50–60',  label: 'Satisfactory', color: '#E8A020' },
  { grade: 'C',  gp: 2.0, range: '40–50',  label: 'Acceptable', color: '#C47A1A' },
  { grade: 'D',  gp: 1.6, range: '35–40',  label: 'Basic',      color: '#A0522D' },
  { grade: 'NG', gp: 0,   range: 'Below 35', label: 'Not Graded', color: '#dc2626' },
];

const SCQF_LEVELS = [
  { level: 12, desc: 'Doctorate (PhD)', equiv: 'EQF 8', color: '#3B0764', example: '' },
  { level: 11, desc: 'Masters Degree', equiv: 'EQF 7', color: '#4C1D95', example: '' },
  { level: 10, desc: 'Honours Degree', equiv: 'EQF 6', color: '#5B21B6', example: '' },
  { level: 9,  desc: 'Degree Year 3/Grad Cert', equiv: 'EQF 6', color: '#6D28D9', example: '' },
  { level: 8,  desc: 'HND / Degree Year 2', equiv: 'EQF 5', color: '#7C3AED', example: '' },
  { level: 7,  desc: 'HNC / ADHM ✦', equiv: 'EQF 5', color: '#8B5CF6', example: 'ADHM = SCQF 7', highlight: true },
  { level: 6,  desc: 'Higher / Diploma Year 2', equiv: 'EQF 4', color: '#A78BFA', example: '' },
  { level: 5,  desc: 'Higher / DHM ✦', equiv: 'EQF 3', color: '#C4B5FD', example: 'DHM = SCQF 5', highlight: true },
  { level: 4,  desc: 'Intermediate 2', equiv: 'EQF 3', color: '#DDD6FE', example: '' },
  { level: 3,  desc: 'Standard Grade / Int 1', equiv: 'EQF 2', color: '#EDE9FE', example: '' },
];

const PATHWAYS = [
  {
    from: 'SEE (Grade 10 Pass)',
    to: 'DHM — SCQF Level 5',
    label: 'Entry',
    color: '#0D5C63',
    desc: '15 months training + 6 months internship. 64 SCQF credits.',
  },
  {
    from: 'DHM (SCQF 5)',
    to: 'ADHM — SCQF Level 7',
    label: 'Progression',
    color: '#8B4513',
    desc: 'Direct lateral entry. Top up 35 SCQF credits over 21 months.',
  },
  {
    from: 'ADHM (SCQF 7, 99 credits)',
    to: "Bachelor's Degree — Year 2",
    label: 'Credit Transfer',
    color: '#863bff',
    desc: 'University of West of Scotland (UK), Glion (Switzerland), Les Roches (Switzerland), INTI (Malaysia) & more.',
  },
  {
    from: "Bachelor's Degree (3 yrs)",
    to: 'Career — Global Hospitality',
    label: 'Graduation',
    color: '#E8A020',
    desc: 'Hotels, resorts, cruise lines, airlines worldwide.',
  },
];

const UNIVERSITIES = [
  { name: 'University of West of Scotland', country: '🇬🇧 United Kingdom', entry: 'Year 2', program: 'BA (Hons) International Hospitality & Tourism' },
  { name: 'Glion Institute of Higher Education', country: '🇨🇭 Switzerland', entry: 'Year 2', program: 'BBA International Hospitality Business' },
  { name: 'Les Roches Global Hospitality Education', country: '🇨🇭 Switzerland', entry: 'Year 2', program: 'BBA International Hotel Management' },
  { name: 'INTI International University', country: '🇲🇾 Malaysia', entry: 'Year 2', program: 'BA (Hons) Hospitality Management' },
  { name: 'Selected Australian Universities', country: '🇦🇺 Australia', entry: 'Year 2 or 3', program: 'Bachelor of Hospitality Management' },
  { name: 'Selected Canadian & US Institutions', country: '🇺🇸🇨🇦 North America', entry: 'Varies', program: 'Case-by-case assessment of SCQF credits' },
];

const CT_BENEFITS = [
  { icon: '⏱️', title: 'Save Time & Money', desc: 'Skip Year 1 of a 3–4 year degree by entering Year 2 directly. Save 1 academic year of tuition and living costs.' },
  { icon: '🌍', title: 'Global Recognition', desc: 'SCQF is benchmarked to the European Qualifications Framework (EQF) and recognised by universities in 30+ countries.' },
  { icon: '📜', title: 'Dual Qualification', desc: 'You graduate from EECOHM with an internationally rated diploma AND a degree from a top institution abroad.' },
  { icon: '💼', title: 'Career Fast-Track', desc: "Enter the global hospitality job market 1 year earlier than peers who start a bachelor's degree from scratch." },
];

// ── Animated Bar Chart (NEB GPA) ─────────────────────────────────────────
function NEBGradeChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={styles.gradeChart} aria-label="NEB Grading System">
      {NEB_GRADES.map((g, i) => (
        <motion.div
          key={g.grade}
          className={styles.gradeRow}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.45 }}
        >
          <span className={styles.gradeLabel} style={{ color: g.color }}>{g.grade}</span>
          <span className={styles.gradeRange}>{g.range}</span>
          <div className={styles.gradeBarWrap}>
            <motion.div
              className={styles.gradeBar}
              style={{ background: g.color }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: g.gp / 4 } : { scaleX: 0 }}
              transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className={styles.gradeGP}>GP {g.gp.toFixed(1)}</span>
          <span className={styles.gradeDesc}>{g.label}</span>
        </motion.div>
      ))}
      <p className={styles.chartNote}>NEB evaluates on a 4.0 GPA scale. Minimum pass: 35% theory per subject (Grade D). 75% written + 25% internal assessment.</p>
    </div>
  );
}

// ── SCQF Level Ladder ──────────────────────────────────────────────────
function SCQFLadder() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={styles.scqfLadder} aria-label="SCQF Level Ladder">
      {SCQF_LEVELS.map((l, i) => (
        <motion.div
          key={l.level}
          className={`${styles.scqfRung} ${l.highlight ? styles.scqfHighlight : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: (SCQF_LEVELS.length - i) * 0.06, duration: 0.4 }}
        >
          <span className={styles.scqfLevelNum} style={{ background: l.color }}>
            {l.level}
          </span>
          <div className={styles.scqfRungContent}>
            <span className={styles.scqfRungDesc}>{l.desc}</span>
            {l.example && <span className={styles.scqfRungExample}>← {l.example}</span>}
          </div>
          <span className={styles.scqfEquiv}>{l.equiv}</span>
        </motion.div>
      ))}
      <p className={styles.chartNote}>✦ EECOHM qualifications. SCQF = Scottish Credit &amp; Qualifications Framework.</p>
    </div>
  );
}

// ── Animated Pathway Flowchart ─────────────────────────────────────────
function PathwayFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={styles.pathwayFlow}>
      {PATHWAYS.map((p, i) => (
        <motion.div
          key={i}
          className={styles.pathwayStep}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.18, duration: 0.5 }}
        >
          <div className={styles.pathwayFrom}>{p.from}</div>
          <div className={styles.pathwayArrow} style={{ color: p.color }}>
            <span className={styles.pathwayArrowLine} style={{ background: p.color }} />
            <span className={styles.pathwayArrowLabel} style={{ background: p.color }}>{p.label}</span>
            <span className={styles.pathwayArrowLine} style={{ background: p.color }} />
            ▼
          </div>
          <div className={styles.pathwayDesc}>{p.desc}</div>
          {i < PATHWAYS.length - 1 && (
            <motion.div
              className={styles.pathwayConnector}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ delay: i * 0.18 + 0.4, duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
      <div className={styles.pathwayDestination}>
        <span>🌟 {PATHWAYS[PATHWAYS.length - 1].to}</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function CreditTransfer() {
  return (
    <>
      <Helmet>
        <title>Credit Transfer & SCQF Pathways — EECOHM School of Excellence</title>
        <meta name="description" content="Learn how EECOHM's SCQF Level 7 ADHM qualification enables credit transfer to Year 2 of bachelor's degrees in the UK, Switzerland, Australia and Malaysia." />
        <link rel="canonical" href="https://eecohm.edu.np/credit-transfer" />
      </Helmet>

      <main id="main-content" className={styles.page}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.heroBubble}
                style={{
                  left: `${5 + i * 8}%`,
                  width: `${40 + (i % 4) * 20}px`,
                  height: `${40 + (i % 4) * 20}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
                animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className={styles.heroEyebrow}>International Pathways</span>
              <h1 className={styles.heroTitle}>
                Credit Transfer &<br />
                <span className={styles.heroAccent}>Global Qualifications</span>
              </h1>
              <p className={styles.heroSubhead}>
                Your EECOHM diploma is more than a local certificate — it's an internationally
                benchmarked SCQF qualification that can unlock Year 2 entry at universities
                across the UK, Switzerland, Malaysia, Australia, and beyond.
              </p>
              <div className={styles.heroActions}>
                <Link to="/programs/advanced-diploma-hotel-management" className={styles.heroCta}>
                  View ADHM Programme <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className={styles.heroCtaSecondary}>
                  Ask an Advisor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── What is Credit Transfer ───────────────────────────────── */}
        <section className={styles.section}>
          <div className="container">
            <SectionReveal>
              <span className={styles.eyebrow}>Understanding the System</span>
              <h2 className={styles.heading}>What is Credit Transfer?</h2>
            </SectionReveal>
            <div className={styles.explainerGrid}>
              <SectionReveal direction="left">
                <div className={styles.explainerText}>
                  <p>
                    <strong>Credit transfer</strong> (also called Recognition of Prior Learning, or RPL) is the process
                    by which academic credits you've earned in one programme are formally recognised and counted
                    toward a different qualification — often at a higher level or a different institution.
                  </p>
                  <p>
                    In the UK and Scotland, credits are measured using the <strong>Scottish Credit and Qualifications
                    Framework (SCQF)</strong>. Every SCQF credit represents approximately <strong>10 notional hours of learning</strong>.
                    ADHM from EECOHM carries <strong>99 SCQF credits at Level 7</strong> — making it academically equivalent
                    to the first year of a Scottish Honours Degree.
                  </p>
                  <p>
                    This means universities can formally recognise your ADHM and allow you to <strong>skip Year 1</strong> and
                    enter directly into <strong>Year 2</strong> of a 3–4 year Bachelor's programme.
                  </p>
                </div>
              </SectionReveal>
              <div className={styles.ctBenefitCards}>
                {CT_BENEFITS.map((b, i) => (
                  <SectionReveal key={b.title} direction="right" delay={i * 0.1}>
                    <div className={styles.ctBenefitCard}>
                      <span className={styles.ctBenefitIcon}>{b.icon}</span>
                      <div>
                        <h4>{b.title}</h4>
                        <p>{b.desc}</p>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SCQF Level Ladder ─────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className="container">
            <SectionReveal>
              <span className={styles.eyebrow}>Framework Reference</span>
              <h2 className={styles.heading}>The SCQF Level Ladder</h2>
              <p className={styles.subhead}>
                The Scottish Credit and Qualifications Framework (SCQF) has 12 levels. 
                EECOHM's hospitality qualifications sit at Levels 5 and 7 — internationally benchmarked to the European Qualifications Framework (EQF).
              </p>
            </SectionReveal>
            <div className={styles.twoCol}>
              <SCQFLadder />
              <div className={styles.scqfExplainer}>
                <SectionReveal direction="right">
                  <h3>EECOHM's Position</h3>
                  <div className={styles.qualCard} style={{ borderColor: '#C4B5FD' }}>
                    <span className={styles.qualLevel} style={{ background: '#C4B5FD', color: '#3B0764' }}>SCQF 5</span>
                    <div>
                      <strong>DHM</strong> — Diploma in Hospitality Management
                      <p>64 credits · 15 months · EQF Level 3</p>
                    </div>
                  </div>
                  <div className={styles.qualArrow}>↓ Progress to</div>
                  <div className={styles.qualCard} style={{ borderColor: '#8B5CF6' }}>
                    <span className={styles.qualLevel} style={{ background: '#8B5CF6', color: '#fff' }}>SCQF 7</span>
                    <div>
                      <strong>ADHM</strong> — Advanced Diploma in Hospitality Management
                      <p>99 credits · 21 months · EQF Level 5</p>
                    </div>
                  </div>
                  <div className={styles.qualArrow}>↓ Credit Transfer to</div>
                  <div className={styles.qualCard} style={{ borderColor: '#4F46E5' }}>
                    <span className={styles.qualLevel} style={{ background: '#4F46E5', color: '#fff' }}>SCQF 8–10</span>
                    <div>
                      <strong>Bachelor's Degree</strong> — Year 2 or 3
                      <p>UK, Switzerland, Malaysia, Australia</p>
                    </div>
                  </div>
                </SectionReveal>
                <SectionReveal direction="right" delay={0.2}>
                  <div className={styles.scqfFactBox}>
                    <h4>Key Facts</h4>
                    <ul>
                      <li><CheckCircle size={14} /> 1 SCQF credit ≈ 10 hours of learning</li>
                      <li><CheckCircle size={14} /> ADHM = 99 credits at Level 7</li>
                      <li><CheckCircle size={14} /> Quality-assured by Qualifications Scotland</li>
                      <li><CheckCircle size={14} /> Benchmarked to EQF Level 5</li>
                      <li><CheckCircle size={14} /> Recognised in 30+ countries</li>
                    </ul>
                    <a href="https://scqf.org.uk" target="_blank" rel="noopener noreferrer" className={styles.scqfLink}>
                      Visit scqf.org.uk ↗
                    </a>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pathway Flowchart ─────────────────────────────────────── */}
        <section className={styles.section}>
          <div className="container">
            <SectionReveal>
              <span className={styles.eyebrow}>Your Journey</span>
              <h2 className={styles.heading}>The EECOHM Pathway</h2>
              <p className={styles.subhead}>From SEE pass to a global career in hospitality — step by step.</p>
            </SectionReveal>
            <PathwayFlow />
          </div>
        </section>

        {/* ── NEB GPA Chart ─────────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className="container">
            <SectionReveal>
              <span className={styles.eyebrow}>NEB Assessment System</span>
              <h2 className={styles.heading}>NEB +2 Grading System</h2>
              <p className={styles.subhead}>
                Nepal Examinations Board (NEB) evaluates +2 students on a 4.0 GPA scale with letter grades.
                Programmes like <strong>+2 with CS</strong>, <strong>+2 with Hotel Management</strong>, and
                <strong> +2 with Business Studies</strong> at EECOHM follow this assessment framework.
              </p>
            </SectionReveal>
            <div className={styles.twoCol}>
              <div>
                <NEBGradeChart />
              </div>
              <SectionReveal direction="right">
                <div className={styles.nebInfo}>
                  <h3>NEB +2 Structure</h3>
                  <div className={styles.nebCard}>
                    <span className={styles.nebCardIcon}><BookOpen size={20} /></span>
                    <div>
                      <strong>6 Subjects Per Year</strong>
                      <p>3 compulsory (English, Nepali, Maths/Social) + 3 electives</p>
                    </div>
                  </div>
                  <div className={styles.nebCard}>
                    <span className={styles.nebCardIcon}><TrendingUp size={20} /></span>
                    <div>
                      <strong>Assessment Split</strong>
                      <p>75% written board examination + 25% internal assessment</p>
                    </div>
                  </div>
                  <div className={styles.nebCard}>
                    <span className={styles.nebCardIcon}><Award size={20} /></span>
                    <div>
                      <strong>Computer Science</strong>
                      <p>Special split: 50% theory + 50% practical</p>
                    </div>
                  </div>
                  <div className={styles.nebCard}>
                    <span className={styles.nebCardIcon}><Globe size={20} /></span>
                    <div>
                      <strong>Minimum Pass</strong>
                      <p>35% in theory (Grade D, GP 1.6). Below = NG (Not Graded)</p>
                    </div>
                  </div>
                  <a
                    href="https://www.neb.gov.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.scqfLink}
                  >
                    Visit neb.gov.np ↗
                  </a>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* ── Partner Universities ───────────────────────────────────── */}
        <section className={styles.section}>
          <div className="container">
            <SectionReveal>
              <span className={styles.eyebrow}>Global Destinations</span>
              <h2 className={styles.heading}>Credit Transfer Partner Universities</h2>
              <p className={styles.subhead}>
                ADHM (SCQF Level 7) graduates may apply for advanced Year 2 entry to these institutions.
                Individual offers are subject to academic merit, language requirements, and institutional policy.
              </p>
            </SectionReveal>
            <div className={styles.uniGrid}>
              {UNIVERSITIES.map((u, i) => (
                <SectionReveal key={u.name} delay={i * 0.07}>
                  <motion.div
                    className={styles.uniCard}
                    whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(134,59,255,0.12)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.uniFlag}>{u.country}</span>
                    <h4 className={styles.uniName}>{u.name}</h4>
                    <p className={styles.uniProgram}>{u.program}</p>
                    <span className={styles.uniEntry}>Entry: <strong>{u.entry}</strong></span>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
            <SectionReveal>
              <div className={styles.disclaimer}>
                <strong>Important Note:</strong> Credit transfer is subject to individual university admission policies,
                available places, English language requirements (e.g. IELTS), and your academic performance.
                Always obtain written confirmation from the receiving institution. EECOHM staff can assist with
                university applications and documentation.
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className={styles.ctaSection}>
          <div className="container">
            <SectionReveal>
              <h2 className={styles.ctaHeading}>Ready to Explore Your Global Future?</h2>
              <p className={styles.ctaSubhead}>
                Talk to our academic advisors to learn which programme is right for you and
                how EECOHM's international qualifications can open doors worldwide.
              </p>
              <div className={styles.ctaActions}>
                <Link to="/contact" className={styles.ctaPrimary} id="credit-transfer-contact-cta">
                  Book a Free Consultation <ArrowRight size={16} />
                </Link>
                <Link to="/programs" className={styles.ctaSecondary}>
                  Browse All Programmes
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>

      </main>
    </>
  );
}
