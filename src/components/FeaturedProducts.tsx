import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './FeaturedProducts.module.css';

interface ProductItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'), 
          where('isFeatured', '==', true),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductItem[];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching featured products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <div className={styles.loader}>Loading Elite Collection...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.title}>Featured <span>Collection</span></h2>
            <p className={styles.subtitle}>
              Discover our handpicked selection of premium drapery and blinds, designed to elevate your living spaces.
            </p>
          </motion.div>
        </div>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={styles.productCard}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className={styles.productImg}
                  loading="lazy" 
                />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.productName}>{product.title}</h3>
                <p className={styles.productDetails}>{product.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/products" className={styles.catalogBtn}>
            View Full Catalog <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
