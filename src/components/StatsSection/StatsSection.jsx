import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import FastCountUp from 'react-countup';
const CountUp = FastCountUp.default || FastCountUp;
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { stats } from '../../data/content';
import styles from './StatsSection.module.css';

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const itemVariantReduced = {
  hidden: { opacity: 0 },
  visible: (i) => ({ opacity: 1, transition: { delay: i * 0.05, duration: 0.3 } }),
};

export default function StatsSection() {
  const prefersReduced = useReducedMotion();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const variant = prefersReduced ? itemVariantReduced : itemVariant;

  return (
    <section className={styles.section} aria-label="Statistics" ref={ref}>
      <div className="container">
        <div className={styles.inner}>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            A Decade of <span className={styles.headingAccent}>Excellence</span>
          </motion.h2>

          <div className={styles.grid} role="list">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statItem}
                variants={variant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                custom={i}
                role="listitem"
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                <div className={styles.number} aria-hidden="true">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.8}
                      suffix={stat.suffix}
                      useEasing
                      preserveValue
                    />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <p className={styles.label}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
