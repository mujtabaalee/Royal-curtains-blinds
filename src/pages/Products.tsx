import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import styles from './Products.module.css';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface ProductItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollUp = () => window.scrollTo(0, 0);
  
  useEffect(() => {
    scrollUp();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductItem[];
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Curtains', 'Blinds', 'Shutters'];
  
  const getProductsByCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName);
  };

  const getCategoryDescription = (categoryName: string) => {
    switch (categoryName) {
      case 'Curtains':
        return "Discover our elegant collection of custom-made curtains that perfectly balance privacy, light control, and luxurious style. From airy sheers to robust blockouts.";
      case 'Blinds':
        return "Sleek and highly functional, our bespoke blinds offer precision control over natural light while complementing modern and classic interiors alike.";
      case 'Shutters':
        return "Timeless and durable. Our premium shutters provide an architectural elegance to your windows with superior insulation and robust build quality.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Hero suburb="Our Collection" />
        <div className={styles.loader}>Loading Premium Products...</div>
        <Contact />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Hero suburb="Our Collection" />
      
      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category);
        
        if (categoryProducts.length === 0) return null; // Don't render empty sections

        return (
          <section key={category} className={styles.catalogSection} id={category.toLowerCase()}>
            <div className="container">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles.categoryHeader}
              >
                <h2 className={styles.categoryTitle}>
                  Premium <span>{category}</span>
                </h2>
                <p className={styles.categoryDesc}>
                  {getCategoryDescription(category)}
                </p>
              </motion.div>

              <div className="mobile-swipe-indicator" style={{ justifyContent: 'flex-start', paddingLeft: '1rem' }}>
                <span>Swipe to explore</span>
                <ArrowRight size={14} className="mobile-swipe-icon" />
              </div>

              <div className={`${styles.scrollContainer} horizontal-scroll`}>
                {categoryProducts.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
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
                      <h3 className={styles.productName}>{product.title}</h3>
                      <p className={styles.productDetails}>{product.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <Contact />
    </div>
  );
};

export default ProductsPage;
