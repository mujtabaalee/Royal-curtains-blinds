import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from './Blog.module.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  imageUrl?: string;
  createdAt: any;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setPosts(data);
    };
    
    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.badge}>Insights</span>
            <h1 className={styles.title}>Our <span className="text-gradient">Blog</span></h1>
          </div>

          <div className={styles.grid}>
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={styles.card}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className={styles.cardHeader}>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.title} className={styles.cardImage} />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardExcerpt}>{post.metaDescription}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.date}>
                        {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('en-AU', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        }) : ''}
                      </span>
                      <span className={styles.readMore}>Read Article &rarr;</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              No blog posts available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
