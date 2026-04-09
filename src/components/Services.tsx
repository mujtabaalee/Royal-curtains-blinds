import React from 'react';
import { Layers, Sun, Home, Cpu, Maximize, Layout, Building2, Ruler, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

const services = [
  {
    title: 'Custom Curtains',
    icon: <Layers size={32} />,
    description: 'From elegant S-Wave and Sheers to heavy Blockouts. Tailored fabrics for every room.',
    features: ['S-Wave', 'Sheer', 'Blockout', 'Pinch Pleat'],
    link: '/curtains',
  },
  {
    title: 'Roller Blinds',
    icon: <Sun size={32} />,
    description: 'Modern, minimalist solutions for light control and privacy. Huge range of colors.',
    features: ['Sunscreen', 'Light-Filtering', 'Dual Roller'],
    link: '/blinds',
  },
  {
    title: 'Plantation Shutters',
    icon: <Layout size={32} />,
    description: 'Timeless style with unmatched durability. Available in PVC and premium Basswood.',
    features: ['PVC', 'Basswood', 'Custom Shapes'],
    link: '/shutters',
  },
  {
    title: 'Motorised Solutions',
    icon: <Cpu size={32} />,
    description: 'Smart home integrated blinds and curtains. Control with a remote or your phone.',
    features: ['Somfy Motors', 'Battery Powered', 'Voice Control'],
    link: '/blinds',
  },
  {
    title: 'Roman Blinds',
    icon: <Maximize size={32} />,
    description: 'Soft fold elegance for a sophisticated look. Perfect for bedrooms and studies.',
    features: ['Soft Fold', 'Textured Fabrics', 'Clean Lines'],
    link: '/blinds',
  },
  {
    title: 'Commercial Fit-outs',
    icon: <Building2 size={32} />,
    description: 'Full-scale window solutions for offices, hotels, and new apartment developments.',
    features: ['Volume Pricing', 'Fire Rated', 'Fast Turnaround'],
    link: '/#contact',
  }
];

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const Services = () => {
  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={headerVariants}
          className={styles.header}
        >
          <span className={styles.badge}>Our Expertise</span>
          <h2 className={styles.title}>Premium Window <span className="text-gradient">Solutions</span></h2>
          <p className={styles.subtitle}>
            Explore our wide range of custom-made products designed to enhance your home&apos;s aesthetics and functionality.
          </p>
        </motion.div>

        <div className="mobile-swipe-indicator" style={{ justifyContent: 'center' }}>
          <span>Swipe to explore</span>
          <ArrowRight size={14} className="mobile-swipe-icon" />
        </div>

        <div className={`${styles.grid} horizontal-scroll`}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className={styles.card}
            >
              <motion.div 
                className={styles.iconWrapper}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                {service.icon}
              </motion.div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
              <ul className={styles.features}>
                {service.features.map((f, i) => (
                  <li key={i} className={styles.feature}>
                    <Ruler size={14} className={styles.featureIcon} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={service.link} className={styles.cardLink}>
                Learn More <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
