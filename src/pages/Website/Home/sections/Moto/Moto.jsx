import { useState } from 'react';
import { FaBook, FaLeaf, FaLightbulb } from 'react-icons/fa';
import styles from './Moto.module.css';

export default function Moto() {
  const [activeCard, setActiveCard] = useState(null);

  const motos = [
    { id: 1, icon: <FaBook />, title: 'LEARN' },
    { id: 2, icon: <FaLeaf />, title: 'GROW' },
    { id: 3, icon: <FaLightbulb />, title: 'INNOVATE' }
  ];

  return (
    <section className={styles.motoSection}>
      <div className={styles.cardsContainer}>
        {motos.map((moto) => (
          <div 
            key={moto.id} 
            className={`${styles.card} ${activeCard === moto.id ? styles.active : ''}`}
            onClick={() => setActiveCard(activeCard === moto.id ? null : moto.id)}
          >
            <div className={styles.iconContainer}>
              {moto.icon}
            </div>
            <h3 className={styles.title}>{moto.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
