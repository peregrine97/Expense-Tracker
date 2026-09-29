import React from 'react';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import './Component.css';

const Features = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="features-section">
      <div className="bg-polygon"></div>

      <motion.div 
        className="features-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Card 1 */}
        <motion.div variants={cardVariants} whileHover={{ y: -15, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }} className="feature-card">
          <div className="icon-circle icon-green">
            <Target size={32} color="white" />
          </div>
          <h3 className="feature-title">Effortless Tracking</h3>
          <p className="feature-text">
            Log your regular transactions on the go. Get a clear view of your cash flow in real-time.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={cardVariants} whileHover={{ y: -15, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }} className="feature-card">
          <div className="icon-circle icon-pink">
            <TrendingUp size={32} color="white" />
          </div>
          <h3 className="feature-title">Month-End Insights</h3>
          <p className="feature-text">
            Know exactly what you spent and saved. Earn compliments for saving more than previous months!
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={cardVariants} whileHover={{ y: -15, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }} className="feature-card">
          <div className="icon-circle icon-blue">
            <Trophy size={32} color="white" />
          </div>
          <h3 className="feature-title">Gamified Savings</h3>
          <p className="feature-text">
            Anonymously see your savings rank among other users. Strive to reach the top 5% of savers!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
