import { teamData } from '../../../data/teamData';
import { FaFacebook, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from './Team.module.css';

export default function Team() {
  return (
    <section id="team" className={styles.teamSection}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Meet Our Team</h2>
        <p className={styles.subheading}>A group of passionate individuals driving innovation.</p>
      </div>

      <div className={styles.scrollContainer} onWheel={(e) => {
        // Optional horizontal wheel scrolling
        if (e.deltaY !== 0) {
          e.currentTarget.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }}>
        <div className={styles.cardsTrack}>
          {teamData.map((member, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={member.image} alt={member.name} className={styles.image} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{member.name}</h3>
                <span className={styles.role}>{member.role}</span>
                <p className={styles.bio}>{member.bio}</p>
                <p className={styles.quote}>{member.quote}</p>
                
                <div className={styles.socials}>
                  {member.social.facebook && (
                    <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                      <FaFacebook />
                    </a>
                  )}
                  {member.social.phone && (
                    <a href={`tel:${member.social.phone}`} className={styles.socialLink} aria-label="Phone">
                      <FaPhone />
                    </a>
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`} className={styles.socialLink} aria-label="Email">
                      <FaEnvelope />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
