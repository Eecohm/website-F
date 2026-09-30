import { Helmet } from 'react-helmet-async';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import { blogs } from '../../data/blogs';
import styles from './BlogPost.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const blog = blogs.find(b => b.slug === slug);

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} — EECOHM Blog</title>
        <meta name="description" content={blog.excerpt} />
        <link rel="canonical" href={`https://eecohm.edu.np/blog/${blog.slug}`} />
      </Helmet>

      <main id="main-content" className={styles.main}>
        {/* Header Hero */}
        <section className={styles.headerHero} style={{ backgroundImage: `url(${blog.image})` }}>
          <div className={styles.overlay}></div>
          <div className={`container ${styles.headerContent}`}>
            <SectionReveal>
              <Link to="/blog" className={styles.backBtn}>
                <ArrowLeft size={16} /> Back to all articles
              </Link>
              <div className={styles.meta}>
                <span className={styles.badge}>{blog.category}</span>
                <span className={styles.metaItem}><Calendar size={14} /> {blog.date}</span>
                <span className={styles.metaItem}><Clock size={14} /> {blog.readTime}</span>
              </div>
              <h1 className={styles.title}>{blog.title}</h1>
            </SectionReveal>
          </div>
        </section>

        {/* Content */}
        <section className={styles.contentSection}>
          <div className={`container ${styles.contentContainer}`}>
            <SectionReveal delay={0.1}>
              <div className={styles.markdownContent}>
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>
    </>
  );
}
