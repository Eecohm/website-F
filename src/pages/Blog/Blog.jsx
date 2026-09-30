import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import styles from './Blog.module.css';
import { blogs } from '../../data/blogs';

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog & News — EECOHM School of Excellence</title>
        <meta name="description" content="Stay updated with the latest news, career advice, and educational insights from EECOHM School of Excellence — the best college in Jhapa and Birtamode." />
        <meta name="keywords" content="EECOHM blog, best college in Jhapa news, hospitality management Jhapa, credit transfer Nepal, Birtamode college updates" />
        <link rel="canonical" href="https://eecohm.edu.np/blog" />
      </Helmet>

      <main id="main-content" className={styles.main}>
        {/* Header */}
        <section className={styles.header}>
          <div className="container">
            <SectionReveal>
              <h1 className={styles.title}>
                EECOHM <span className={styles.accent}>Insights</span>
              </h1>
              <p className={styles.subtitle}>
                News, updates, and deep dives into the world of hospitality, technology, 
                and modern education from the best college in Jhapa.
              </p>
            </SectionReveal>
          </div>
        </section>

        {/* Blog Grid */}
        <section className={styles.blogSection}>
          <div className="container">
            <div className={styles.grid}>
              {blogs.map((blog, idx) => (
                <SectionReveal key={blog.id} delay={idx * 0.1}>
                  <motion.article 
                    className={styles.card}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.imageWrapper}>
                      <img src={blog.image} alt={blog.title} className={styles.image} loading="lazy" />
                      <span className={styles.categoryBadge}>{blog.category}</span>
                    </div>
                    
                    <div className={styles.content}>
                      <div className={styles.meta}>
                        <span className={styles.metaItem}>
                          <Calendar size={14} /> {blog.date}
                        </span>
                        <span className={styles.metaItem}>
                          <Clock size={14} /> {blog.readTime}
                        </span>
                      </div>
                      
                      <h2 className={styles.blogTitle}>{blog.title}</h2>
                      <p className={styles.excerpt}>{blog.excerpt}</p>
                      
                      <Link to={`/blog/${blog.slug}`} className={styles.readMore} aria-label={`Read more about ${blog.title}`}>
                        Read Article <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
