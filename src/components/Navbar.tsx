import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' }, // Keep contact as hash on home
  ];


  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          <span className={styles.logoText}>Royal</span>
          <span className={styles.logoSubtext}>Curtains & Blinds</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </a>
          ))}
          <a href="tel:0469028075" className="btn btn-primary">
            Call Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className={styles.mobileNav}>
          <a href="tel:0469028075" className={styles.mobileIconLink}>
            <Phone size={24} />
          </a>
          <button 
            className={styles.menuBtn} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={32} color="white" /> : <Menu size={32} color="white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={styles.mobileOverlay}
          >
            <div className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className={styles.mobileCta}>
              <a href="tel:0469028075" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                <Phone size={20} style={{ marginRight: '10px' }} />
                Call 0469 028 075
              </a>
              <a 
                href="https://wa.me/61469028075" 
                className="btn btn-outline" 
                style={{ borderColor: '#25D366', color: '#25D366' }}
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare size={20} style={{ marginRight: '10px' }} />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
