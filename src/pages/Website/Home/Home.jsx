import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../../../components/website/Navbar/Navbar';
import Footer from '../../../components/website/Footer/Footer';
import SocialButtons from '../../../components/website/SocialFloatingButtons/SocialButtons';

import Hero from './sections/Hero/Hero';
import Moto from './sections/Moto/Moto';
import About from './sections/About/About';
import Courses from './sections/Courses/Courses';
import Facilities from './sections/Facilities/Facilities';
import Team from './sections/Team/Team';
import Testimonials from './sections/Testimonials/Testimonials';
import Gallery from './sections/Gallery/Gallery';
import Contact from './sections/Contact/Contact';

import styles from './Home.module.css';

export default function Home() {
  // Add Outfit font globally to the container just to be safe
  useEffect(() => {
    document.body.style.fontFamily = "'Outfit', sans-serif";
    
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
    
    return () => {
      document.body.style.fontFamily = ''; // Revert on unmount
    };
  }, []);

  return (
    <div className={styles.websiteContainer}>
      <Navbar />
      
      <main>
        <Hero />
        <div data-aos="fade-up"><Moto /></div>
        <div data-aos="fade-up"><About /></div>
        <div data-aos="fade-up"><Courses /></div>
        <div data-aos="fade-up"><Facilities /></div>
        <div data-aos="fade-up"><Team /></div>
        <div data-aos="fade-up"><Testimonials /></div>
        <div data-aos="fade-up"><Gallery /></div>
        <div data-aos="fade-up"><Contact /></div>
      </main>

      <Footer />
      <SocialButtons />
    </div>
  );
}