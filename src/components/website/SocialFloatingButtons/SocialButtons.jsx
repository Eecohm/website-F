import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import styles from './SocialButtons.module.css';

export default function SocialButtons() {
  const whatsappUrl = 'https://wa.me/9779852646392?text=Hello!%20I%27d%20like%20to%20chat%20with%20you.';
  const messengerUrl = 'https://m.me/yourfacebookpageid'; // Placeholder

  return (
    <div className={styles.container}>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${styles.button} ${styles.whatsapp}`}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
      <a 
        href={messengerUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${styles.button} ${styles.messenger}`}
        aria-label="Chat on Messenger"
      >
        <FaFacebookMessenger />
      </a>
    </div>
  );
}
