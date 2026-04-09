import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloatingActions.module.css';

const FloatingActions = () => {
  return (
    <div className={styles.container}>
      <AnimatePresence>
        <motion.div 
          className={styles.stack}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* WhatsApp Button */}
          <motion.a
            href="https://wa.me/61469028075"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.fab} ${styles.whatsapp}`}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={styles.tooltip}>Chat on WhatsApp</span>
            <MessageCircle size={24} fill="currentColor" />
          </motion.a>

          {/* Call Button */}
          <motion.a
            href="tel:0469028075"
            className={`${styles.fab} ${styles.call}`}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={styles.tooltip}>Call Ali Now</span>
            <Phone size={24} fill="currentColor" />
          </motion.a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FloatingActions;
