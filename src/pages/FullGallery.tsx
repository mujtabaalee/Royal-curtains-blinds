import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import styles from './FullGallery.module.css';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const categories = ['All', 'Curtains', 'Blinds', 'Shutters'];

interface Project {
  id: string;
  category: string;
  title: string;
  image: string;
}

const FullGallery = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const fetchImages = async () => {
      const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'));
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

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className={styles.page}>
      <Hero suburb="Our Portfolio" />
      
      <section className={styles.gallery}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.badge}>Our Work</span>
            <h2 className={styles.title}>Full Project <span className="text-gradient">Showcase</span></h2>
            <p className={styles.subtitle}>
              Explore our complete collection of custom installations across Sydney. 
              Find inspiration for your next home improvement project.
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
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default FullGallery;
