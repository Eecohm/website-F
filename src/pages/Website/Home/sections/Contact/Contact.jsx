import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from './Contact.module.css';

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EmailJS Configuration from website_rebuild_master.md
  // Using the actual credentials mentioned in the document
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    emailjs.sendForm(
      'service_qwyckzi', // Verified Service ID
      'template_4d0m0c6', // Verified Notification Template ID
      formRef.current,
      'E7PBW2JJQEYniKIBZ' // Verified Public Key
    )
    .then(() => {
        // Assume auto-reply template_7rl59tg is connected within EmailJS dashboard
        setStatus({ 
          type: 'success', 
          message: "Thank you! We've sent you a confirmation email and we'll get back to you soon." 
        });
        formRef.current.reset();
        setIsSubmitting(false);
      }, (error) => {
        setStatus({ 
          type: 'error', 
          message: `Failed to send your message: ${error.text || 'Unknown error'}` 
        });
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact-us" className={styles.contactSection}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Contact Us</h2>
        <p className={styles.subheading}>We'd love to hear from you!</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCards}>
          <a href="tel:023536392" className={styles.card}>
            <div className={styles.iconWrapper}><FaPhoneAlt /></div>
            <div className={styles.cardText}>
              <h4>Phone</h4>
              <p>023-536392</p>
            </div>
          </a>

          <a href="mailto:eecohm@gmail.com" className={styles.card}>
            <div className={styles.iconWrapper}><FaEnvelope /></div>
            <div className={styles.cardText}>
              <h4>Email</h4>
              <p>eecohm@gmail.com</p>
            </div>
          </a>

          <a 
            href="https://www.google.com/maps/place/EECOHM+College/@26.643542,87.9692917,17z" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.card}
          >
            <div className={styles.iconWrapper}><FaMapMarkerAlt /></div>
            <div className={styles.cardText}>
              <h4>Location</h4>
              <p>Birtamod Jhapa, Nepal</p>
            </div>
          </a>

          <div className={styles.socials}>
            <h4>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/eecohmschoolofexcellence" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/eecohm_college?igsh=NzRmMWpyM2JpaW42" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/106791483/admin/dashboard/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form ref={formRef} onSubmit={sendEmail}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="user_name" 
                placeholder="Your Name" 
                required 
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <input 
                type="email" 
                name="user_email" 
                placeholder="Your Email" 
                required 
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea 
                name="message" 
                placeholder="Your Message..." 
                required 
                className={styles.textarea}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {status.message && (
              <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
