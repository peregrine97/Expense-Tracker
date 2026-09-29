import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Reviews.css';

const reviewsData = [
  {
    id: 1,
    name: 'Alex',
    text: "Logging expenses is completely effortless, but what I love most is the end-of-month breakdown. Getting compliments when I save more than last month keeps me incredibly motivated!"
  },
  {
    id: 2,
    name: 'Sarah',
    text: "I've tried other budgeting apps before, but discovering my anonymous savings rank totally changed the game. Striving for that Top 5% badge is so addicting!"
  },
  {
    id: 3,
    name: 'David',
    text: "Ekspenses turns a boring chore into a rewarding habit. It's simple, beautifully designed, and actually celebrates your financial wins. Highly recommended."
  }
];

const Reviews = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="reviews-section">
      {/* Decorative green circle matching the image */}
      <div className="reviews-bg-circle"></div>

      <div className="reviews-container">
        <div className="reviews-header">
          <h2>Why people <strong>use Ekspenses</strong></h2>
          <div className="carousel-controls">
            <button className="carousel-btn"><ChevronLeft size={20} /></button>
            <button className="carousel-btn"><ChevronRight size={20} /></button>
          </div>
        </div>

        <motion.div 
          className="reviews-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {reviewsData.map((review) => (
            <motion.div variants={fadeUp} className="review-card" key={review.id}>
              <p className="review-text">{review.text}</p>
              <h4 className="review-author">{review.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
