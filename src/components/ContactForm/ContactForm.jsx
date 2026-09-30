import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import MagneticButton from '../MagneticButton/MagneticButton';
import styles from './ContactForm.module.css';

// ── EmailJS configuration ─────────────────────────────────────────────────────
// The user must create a free EmailJS account at https://emailjs.com and set
// these env vars in .env.local (and in Vercel Project Settings → Env Vars):
//   VITE_EMAILJS_SERVICE_ID  = your service ID
//   VITE_EMAILJS_TEMPLATE_ID = your template ID
//   VITE_EMAILJS_PUBLIC_KEY  = your public key
// Template variables expected: {{from_name}}, {{from_email}}, {{phone}},
// {{program}}, {{message}}
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

const programs = [
  '+2 with Advanced Diploma in Computer Science (ADCS)',
  '+2 with Advanced Diploma in Hotel Management (ADHM)',
  'Diploma in Hotel Management (DHM)',
  '+2 with Business Studies',
  '+2 with Hotel Management',
  '+2 with Computer Science',
  'Pre-School to Secondary',
  'General Enquiry',
];

function validate(values) {
  const errors = {};
  if (!values.from_name.trim()) errors.from_name = 'Full name is required.';
  if (!values.from_email.trim()) {
    errors.from_email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.from_email)) {
    errors.from_email = 'Please enter a valid email.';
  }
  if (!values.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

export default function ContactForm() {
  const formRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const [values, setValues] = useState({
    from_name: '', from_email: '', phone: '', program: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.formWrap}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            className={styles.successMsg}
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            role="alert"
            aria-live="polite"
          >
            <div className={styles.successIcon}>
              <CheckCircle size={28} />
            </div>
            <p className={styles.successTitle}>Message Sent!</p>
            <p className={styles.successText}>
              Thank you for reaching out. The EECOHM admissions team will get back
              to you within 1 business day.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Contact and enquiry form"
            id="contact-form"
          >
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="from_name" className={styles.label}>Full Name *</label>
                <input
                  id="from_name"
                  name="from_name"
                  type="text"
                  autoComplete="name"
                  className={`${styles.input} ${errors.from_name ? styles.error : ''}`}
                  value={values.from_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  aria-required="true"
                  aria-describedby={errors.from_name ? 'name-error' : undefined}
                />
                {errors.from_name && <span id="name-error" className={styles.errorMsg} role="alert">{errors.from_name}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="from_email" className={styles.label}>Email Address *</label>
                <input
                  id="from_email"
                  name="from_email"
                  type="email"
                  autoComplete="email"
                  className={`${styles.input} ${errors.from_email ? styles.error : ''}`}
                  value={values.from_email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  aria-required="true"
                  aria-describedby={errors.from_email ? 'email-error' : undefined}
                />
                {errors.from_email && <span id="email-error" className={styles.errorMsg} role="alert">{errors.from_email}</span>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={styles.input}
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="program" className={styles.label}>Program of Interest</label>
                <select
                  id="program"
                  name="program"
                  className={styles.select}
                  value={values.program}
                  onChange={handleChange}
                >
                  <option value="">Select a program…</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>Message *</label>
              <textarea
                id="message"
                name="message"
                className={`${styles.textarea} ${errors.message ? styles.error : ''}`}
                value={values.message}
                onChange={handleChange}
                placeholder="Tell us about yourself or ask a question…"
                aria-required="true"
                aria-describedby={errors.message ? 'msg-error' : undefined}
              />
              {errors.message && <span id="msg-error" className={styles.errorMsg} role="alert">{errors.message}</span>}
            </div>

            {status === 'error' && (
              <p className={styles.errorMsg} role="alert">
                Something went wrong. Please try again or email us directly at eecohm@gmail.com.
              </p>
            )}

            <MagneticButton radius={80} maxOffset={8}>
              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'sending'}
                whileHover={prefersReduced ? {} : { scale: 1.03, y: -1 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                id="contact-submit-btn"
                aria-label="Send message"
              >
                {status === 'sending' ? (
                  <><Loader2 size={18} className="spin" /> Sending…</>
                ) : (
                  <><Send size={18} /> Send Message</>
                )}
              </motion.button>
            </MagneticButton>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
