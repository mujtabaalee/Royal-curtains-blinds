import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Map.module.css';

const Map = () => {
  return (
    <section id="contact" className={styles.mapSection}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.infoContent}
          >
            <span className={styles.badge}>Our Location</span>
            <h2 className={styles.title}>Find Us in <span className="text-gradient">Sydney</span></h2>
            <p className={styles.subtitle}>
              Visit our showroom or get in touch for a free measure and quote. 
              We serve all of Western Sydney and beyond.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.item}>
                <div className={styles.iconBox}><MapPin size={20} /></div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Merrylands, NSW 2160, Australia</p>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconBox}><Clock size={20} /></div>
                <div>
                  <h4>Opening Hours</h4>
                  <p>Mon - Fri: 9am - 5pm<br />Sat: 10am - 3pm</p>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconBox}><Phone size={20} /></div>
                <div>
                  <h4>Call Us</h4>
                  <a href="tel:0469028075">0469 028 075</a>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconBox}><Mail size={20} /></div>
                <div>
                  <h4>Email Us</h4>
                  <a href="mailto:info@royalcurtains.com.au">info@royalcurtains.com.au</a>
                </div>
              </div>
            </div>

            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Merrylands+NSW+2160" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: '2rem' }}
            >
              Get Directions
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.mapContainer}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d852745.367132425!2d150.38318840470447!3d-33.39620958008014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x654dbf077cb5dae1%3A0xaf2fb526974bc477!2sRoyal%20Curtains%20and%20Blinds!5e0!3m2!1sen!2s!4v1775637022047!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '24px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Royal Curtains and Blinds Location"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Map;
