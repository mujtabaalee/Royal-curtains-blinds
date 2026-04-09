import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
  suburb?: string;
}

// Animated counter hook
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
};

// Floating particles
const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className={styles.particle}
    style={{ left: `${x}%`, width: size, height: size }}
    initial={{ y: '110vh', opacity: 0 }}
    animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 8 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

// Stagger container variant
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Hero = ({ suburb }: HeroProps) => {
  const displaySuburb = suburb ? suburb : 'Sydney';
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Stats with animated counters
  const projects = useCounter(2500);
  const clients = useCounter(1500);
  const years = useCounter(10);

  // Generate particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.8,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
  }));

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Animated Background with Parallax */}
      <motion.div className={styles.background} style={{ y: bgY }} />
      <motion.div className={styles.overlay} style={{ opacity: overlayOpacity }} />

      {/* Floating Gold Particles */}
      <div className={styles.particles}>
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Animated Decorative Lines */}
      <div className={styles.decorLines}>
        <motion.div
          className={styles.decorLine}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
        />
        <motion.div
          className={styles.decorLine}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.3, ease: 'easeOut' }}
        />
      </div>

      <motion.div
        className={`container ${styles.content}`}
        style={{ y: textY }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={styles.textContent}
        >
          {/* Animated Badge */}
          <motion.span variants={itemVariants} className={styles.badge}>
            <motion.span
              className={styles.badgeDot}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {displaySuburb}&apos;s #1 Window Specialists
          </motion.span>

          {/* Title with word-by-word reveal */}
          <motion.h1 variants={itemVariants} className={styles.title}>
            Tailored-to-Perfection <br />
            <motion.span
              className="text-gradient"
              initial={{ backgroundSize: '0% 100%' }}
              animate={{ backgroundSize: '100% 100%' }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              Curtains & Blinds {suburb ? `in ${suburb}` : ''}
            </motion.span>
          </motion.h1>

          <motion.p variants={itemVariants} className={styles.subtitle}>
            Experience affordable luxury with {displaySuburb}&apos;s most trusted family-owned window furnishing experts.
            Free in-home consultation & professional installation.
          </motion.p>

          {/* Animated CTA Buttons */}
          <motion.div variants={itemVariants} className={styles.actions}>
            <motion.button
              className="btn btn-primary"
              onClick={() => window.location.href = '#contact'}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              Request Free Quote
              <motion.span
                style={{ display: 'inline-flex', marginLeft: '8px' }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
            <motion.button
              className={styles.btnSecondary}
              onClick={() => window.location.href = '/gallery'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              View Gallery
            </motion.button>
          </motion.div>

          {/* Animated Stats with Counters */}
          <motion.div variants={itemVariants} className={styles.socialProof}>
            <div className={styles.stat}>
              <span ref={projects.ref} className={styles.statNumber}>
                {projects.count.toLocaleString()}+
              </span>
              <span className={styles.statLabel}>Projects Completed</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span ref={clients.ref} className={styles.statNumber}>
                {clients.count.toLocaleString()}+
              </span>
              <span className={styles.statLabel}>Happy Clients</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span ref={years.ref} className={styles.statNumber}>
                {years.count}+
              </span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Side - Animated Feature Cards (Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={styles.visualContent}
        >
          <div className={styles.featureStack}>
            {[
              { label: 'Free Measure & Quote', icon: '📐' },
              { label: 'Professional Installation', icon: '🛠️' },
              { label: 'Premium Fabrics', icon: '✨' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className={styles.featureCard}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
                whileHover={{ x: -10, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.15)' }}
              >
                <span className={styles.featureIcon}>{item.icon}</span>
                <span className={styles.featureLabel}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} />
        </motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default Hero;
