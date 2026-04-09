import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: 'Curtains',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you shortly.');
    // Here you would typically send data to a backend or CRM
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <div className={styles.grid}>
          {/* Info Side */}
          <div className={styles.infoSide}>
            <span className={styles.badge}>Get in Touch</span>
            <h2 className={styles.title}>Request a <span className="text-gradient">Free Quote</span></h2>
            <p className={styles.subtitle}>
              Our experts will visit your home with fabric samples and provide a tailored quote on the spot.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.item}>
                <div className={styles.iconBox}><Phone size={24} /></div>
                <div>
                  <h4>Call Us</h4>
                  <a href="tel:0469028075">0469 028 075</a>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconBox}><Mail size={24} /></div>
                <div>
                  <h4>Email Us</h4>
                  <a href="mailto:info@royalcurtainsandblinds.com.au">info@royalcurtainsandblinds.com.au</a>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconBox}><MapPin size={24} /></div>
                <div>
                  <h4>Headquarters</h4>
                  <p>Merrylands, NSW 2160, Sydney</p>
                </div>
              </div>
            </div>

            <div className={styles.whatsappBox}>
              <p>Need a quick answer?</p>
              <a href="https://wa.me/61469028075" className={styles.whatsappBtn}>
                <MessageSquare size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.formSide}
          >
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah Smith" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="sarah@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="0400 000 000" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Project Type</label>
                <select 
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                >
                  <option>Curtains</option>
                  <option>Blinds</option>
                  <option>Shutters</option>
                  <option>Motorisation</option>
                  <option>Commercial</option>
                  <option>Multiple / Others</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>How can we help?</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us about your windows..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }}>
                <Send size={18} style={{ marginRight: '8px' }} />
                Submit Quote Request
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
