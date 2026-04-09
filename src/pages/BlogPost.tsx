import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import styles from './BlogPost.module.css';

interface PostData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'blog_posts'), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          navigate('/blog');
          return;
        }

        const data = snapshot.docs[0].data() as PostData;
        setPost(data);

        // SEO Fields
        document.title = data.metaTitle || data.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.metaDescription || '');
        }

      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!post) return null;

  return (
    <div className={styles.page}>
      <motion.article 
        className={styles.article}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            Published on {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('en-AU', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : 'Draft'}
          </div>
        </header>

        {post.imageUrl && (
          <div className={styles.heroImageWrapper}>
            <img src={post.imageUrl} alt={post.title} className={styles.heroImage} />
          </div>
        )}
        
        <div 

          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
    </div>
  );
};

export default BlogPost;
