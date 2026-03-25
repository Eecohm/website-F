import { useState } from 'react';
import styles from './About.module.css';

// Using exact paths from the master markdown mappings
import mainImg from '../../../../../assets/Images/program_3.png';
import p1 from '../../../../../assets/pngs/1.png';
import p2 from '../../../../../assets/pngs/2.png';
import p3 from '../../../../../assets/pngs/3.png';
import p4 from '../../../../../assets/pngs/4.png';
import p5 from '../../../../../assets/pngs/5.png';
import p6 from '../../../../../assets/pngs/6.png';
import p7 from '../../../../../assets/pngs/7.png';
import p8 from '../../../../../assets/pngs/8.png';
import p9 from '../../../../../assets/pngs/9.png';

export default function About() {
  const [revealedBox, setRevealedBox] = useState(null);

  const boxes = [
    { id: 1, image: p1, quote: "Innovation drives us forward." },
    { id: 2, image: p2, quote: "Creativity is our foundation." },
    { id: 3, image: p3, quote: "Teamwork makes the dream work." },
    { id: 4, image: p4, quote: "Excellence in every detail." },
    { id: 5, image: p5, quote: "Passion fuels our mission." },
    { id: 6, image: p6, quote: "Together, we build the future." },
    { id: 7, image: p7, quote: "Every step counts." },
    { id: 8, image: p8, quote: "Dream big, act bold." },
    { id: 9, image: p9, quote: "Inspire, create, succeed." },
  ];

  const handleBoxClick = (id) => {
    setRevealedBox(revealedBox === id ? null : id);
  };

  return (
    <section id="about-us" className={styles.aboutSection}>
      <div className={styles.container}>
        
        <div className={styles.content}>
          <h2 className={styles.heading}>About Us</h2>
          
          <p className={styles.text}>
            In 2015, Eastern Empire College Of Hotel Management was born with a bold vision to redefine 
            education in the hotel and hospitality industry. What started as a single program, the Diploma 
            in Hotel Management (DHM), quickly gained momentum, attracting ambitious students eager to build 
            their careers in hospitality. With a strong foundation in practical learning and academic excellence, 
            the institution soon expanded, introducing +2 level programs, including the Advanced Diploma in Hotel 
            Management (ADHM), Advanced Diploma in Computer Science (ADCS), and Business Studies. As demand for 
            quality education across multiple disciplines increased, EECOHM recognized the need to evolve.
          </p>
          
          <p className={styles.text}>
            By 2025, EECOHM took its biggest leap yet, transforming into EECOHM School of Excellence. No longer 
            just a college, it became a comprehensive institution, offering programs from Pre-Group (PG) levels 
            to Advanced Diplomas, ensuring students could begin their educational journey from the ground up and 
            emerge as professionals ready to take on the world.
          </p>
          
          <p className={styles.text}>
            This evolution within 10 years marked as a benchmark that cemented EECOHM's place as a leader in 
            academic excellence, skill development, and industry readiness. From its humble beginnings to a School 
            of Excellence, EECOHM remains committed to shaping the future of education and empowering the next 
            generation of professionals.
          </p>
        </div>

        <div className={styles.visuals}>
          <div className={styles.mainImageContainer}>
            <img src={mainImg} alt="Students" className={styles.mainImage} />
          </div>
          
          <div className={styles.mosaicGrid}>
            {boxes.map((box) => (
              <div 
                key={box.id} 
                className={`${styles.mosaicBox} ${revealedBox === box.id ? styles.revealed : ''}`}
                onClick={() => handleBoxClick(box.id)}
              >
                <img src={box.image} alt={`Mosaic ${box.id}`} className={styles.boxImage} />
                <div className={styles.boxOverlay}>
                  <p className={styles.quote}>{box.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
