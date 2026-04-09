import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Gallery.module.css';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const categories = ['All', 'Curtains', 'Blinds', 'Shutters'];

interface Project {
  id: string;
  category: string;
  title: string;
  image: string;
}

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);

  React.useEffect(() => {
    const fetchImages = async () => {
      // Limit to 6 on homepage for performance
      const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'), limit(6));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const item = doc.data();
        return {
          id: doc.id,
          category: item.genre,
          title: item.title || 'Installation',
          image: item.url
        };
      }) as Project[];
      setProjects(data);
    };
    fetchImages();
  }, []);

  const filteredProjects = (filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter)).slice(0, 3); // Limit to 3 visual cards

  return (
    <section id="gallery" className={styles.gallery}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Our Work</span>
          <h2 className={styles.title}>Project <span className="text-gradient">Gallery</span></h2>
          <p className={styles.subtitle}>
            A showcase of our recent transformations across Sydney.
          </p>
        </div>

        <div className={styles.filters}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <img src={project.image} alt={project.title} className={styles.image} loading="lazy" />
                  <div className={styles.overlay}>
                    <span className={styles.category}>{project.category}</span>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className={styles.cta}>
          <p>Want to see more of our work?</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/gallery" className="btn btn-primary">See All Projects</Link>
            <a href="#contact" className="btn btn-outline-gold">Get a Free Quote</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
