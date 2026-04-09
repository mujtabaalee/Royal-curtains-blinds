import React from 'react';
import { Star, Quote, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Reviews.module.css';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
}

const staticReviews: Review[] = [
  {
    id: '1',
    author: 'Hamid Yawari',
    rating: 5,
    text: 'Has provided us 5 stars service. The curtain is amazing and he makes sure everything is done properly before leaving. Highly recommend for those who want to have curtain.',
    date: 'a month ago',
    location: 'Sydney, NSW'
  },
  {
    id: '2',
    author: 'Abdo Hassan',
    rating: 5,
    text: 'Highly recommend Royal Curtains and Blinds. I had called for a quote they were able to accommodate to my timings. Had Ali come out and inspect the place and guided us through the whole process.',
    date: '9 months ago',
    location: 'Sydney, NSW'
  },
  {
    id: '3',
    author: 'Prakash Bhandari',
    rating: 5,
    text: 'Just put up these new grey blinds with a white patterned sheer layer underneath, and I love how they look! Super clean and modern. They let in just the right amount of light during the day and still give you privacy.',
    date: '10 months ago',
    location: 'Sydney, NSW'
  },
  {
    id: '4',
    author: 'Ahmad Javid',
    rating: 5,
    text: 'I highly recommend the team of Royal Curtain and Blinds. On-time, professional and we are very happy with the quality of material and finish.',
    date: '3 months ago',
    location: 'Sydney, NSW'
  },
  {
    id: '5',
    author: 'Mohammed Al-kanaani',
    rating: 5,
    text: 'Excellent job. The work was precise, the finish was clean, and the result was exactly what we wanted. Very professional, reliable, and I highly recommend his service.',
    date: '6 months ago',
    location: 'Sydney, NSW'
  },
  {
    id: '6',
    author: 'John Gergis',
    rating: 5,
    text: 'The team arrived on time, were polite and professional, and got the job done efficiently without any fuss. Really impressed with the whole experience.',
    date: '7 months ago',
    location: 'Sydney, NSW'
  },
];

const Reviews = () => {
  return (
    <section className={styles.reviews}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <span className={styles.badge}>
            <span className={styles.liveDot} />
            Verified Google Reviews
          </span>
          <h2 className={styles.title}>What Our <span className="text-gradient">Customers Say</span></h2>
          <p className={styles.subtitle}>
            Rated 5.0 stars based on 17+ reviews on Google. We take massive pride in our precise craftsmanship and reliability.
          </p>
        </motion.div>

        <div className="mobile-swipe-indicator" style={{ justifyContent: 'center' }}>
          <span>Swipe to explore</span>
          <ArrowRight size={14} className="mobile-swipe-icon" />
        </div>

        <div className={`${styles.grid} horizontal-scroll`}>
          {staticReviews.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={styles.card}
            >
              <div className={styles.quoteIcon}>
                <Quote size={20} fill="var(--accent)" />
              </div>
              <div className={styles.stars}>
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="#FBBC05" color="#FBBC05" />
                ))}
              </div>
              <p className={styles.text}>"{review.text}"</p>
              <div className={styles.footer}>
                <div className={styles.user}>
                  <div className={styles.avatar}>
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className={styles.name}>{review.author}</h4>
                    <span className={styles.date}>{review.date}</span>
                  </div>
                </div>
                <div className={styles.source}>
                  <MapPin size={12} />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.googleCta}>
          <div className={styles.googleBadge}>
            <div className={styles.googleStars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />
              ))}
            </div>
            <span>5.0 Rating on Google</span>
            <span className={styles.totalCount}>(17 Reviews)</span>
          </div>
          <a 
            href="https://www.google.com/search?q=Royal+Curtains+and+Blinds+Merrylands"
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <ExternalLink size={16} style={{ marginRight: '8px' }} />
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
