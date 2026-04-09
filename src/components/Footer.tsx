import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>Royal</span>
              <span className={styles.logoSubtext}>Curtains & Blinds</span>
            </Link>
            <p className={styles.description}>
              Premium custom-made curtains, blinds, and shutters tailored for your home and office across Sydney.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksColumn}>
            <h4 className={styles.heading}>Our Services</h4>
            <ul className={styles.links}>
              <li><Link to="/curtains">Custom Curtains</Link></li>
              <li><Link to="/blinds">Roller Blinds</Link></li>
              <li><Link to="/shutters">Plantation Shutters</Link></li>
              <li><Link to="/gallery">Project Gallery</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div className={styles.linksColumn}>
            <h4 className={styles.heading}>Visit Us</h4>
            <ul className={styles.links}>
              <li>Merrylands, NSW 2160</li>
              <li>Parramatta, NSW 2150</li>
              <li>Blacktown, NSW 2148</li>
              <li>Penrith, NSW 2750</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactColumn}>
            <h4 className={styles.heading}>Contact Us</h4>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.icon} />
              <a href="tel:0469028075">0469 028 075</a>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.icon} />
              <a href="mailto:info@royalcurtainsandblinds.com.au">info@royalcurtainsandblinds.com.au</a>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.icon} />
              <span>Merrylands, NSW, Sydney</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} Royal Curtains and Blinds. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
