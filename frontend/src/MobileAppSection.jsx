import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart2, Award, Home, PieChart, Plus, Wallet, User } from 'lucide-react';
import './MobileAppSection.css';

const MobileAppSection = () => {
  const floatAnimation = {
    y: ["-10px", "10px"],
    transition: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="mobile-app-section">
      <div className="mobile-app-container">
        
        {/* Left Side: Text & Pills */}
        <motion.div 
          className="mobile-text-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.h2 variants={fadeUp}>Gamified finances.<br/>Powerful clarity.</motion.h2>
          <motion.p variants={fadeUp} className="mobile-subtitle">
            Track expenses effortlessly, earn personalized compliments, and build better habits by seeing your private savings rank.
          </motion.p>

          <div className="feature-pills">
            <motion.div variants={fadeUp} className="feature-pill">
              <Zap size={20} className="pill-icon" />
              <span>Instant Tracking</span>
            </motion.div>
            <motion.div variants={fadeUp} className="feature-pill">
              <BarChart2 size={20} className="pill-icon" />
              <span>Monthly Compliments</span>
            </motion.div>
            <motion.div variants={fadeUp} className="feature-pill">
              <Award size={20} className="pill-icon" />
              <span>Private Top X% Ranks</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Phone Mockup */}
        <motion.div 
          className="mobile-visual"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating overlapping card */}
          <motion.div 
            className="floating-glass-card"
            animate={floatAnimation}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-header">Monthly Review</div>
            <div className="glass-item">
              <div className="glass-icon green"><Zap size={14}/></div>
              <div className="glass-text">
                <strong>Compliment Earned!</strong>
                <span>Saved $250 more</span>
              </div>
            </div>
            <div className="glass-item">
              <div className="glass-icon gold"><Award size={14}/></div>
              <div className="glass-text">
                <strong>New Rank</strong>
                <span>Top 5% Saver</span>
              </div>
            </div>
          </motion.div>

          <div className="phone-mockup">
            <div className="phone-notch"></div>
            
            {/* Phone Screen UI */}
            <div className="phone-screen">
              <div className="phone-header">
                <div className="phone-logo">
                  <Wallet size={16} color="white" />
                </div>
                <span>Ekspenses</span>
              </div>

              <div className="phone-greeting">
                <h3>Good evening</h3>
                <p>Here's your overview</p>
              </div>

              <div className="phone-balance-card">
                <p>TOTAL SAVED</p>
                <h2>$4,285.60</h2>
                <span className="positive">↑ 12.4% this month</span>
              </div>

              <div className="phone-chart-area">
                <div className="chart-placeholder">
                  <div className="chart-ring">
                    <span className="ring-text">Top 5%</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item"><span className="dot food"></span> Food</div>
                  <div className="legend-item"><span className="dot bills"></span> Bills</div>
                  <div className="legend-item"><span className="dot shopping"></span> Shopping</div>
                </div>
              </div>

              <div className="phone-transactions">
                <div className="ptrans-item">
                  <div className="ptrans-icon yellow"><Zap size={14}/></div>
                  <div className="ptrans-details">
                    <strong>Grocery Market</strong>
                    <span>Food & Dining</span>
                  </div>
                  <div className="ptrans-amount negative">-$54.20</div>
                </div>
                <div className="ptrans-item">
                  <div className="ptrans-icon green"><Wallet size={14}/></div>
                  <div className="ptrans-details">
                    <strong>Salary</strong>
                    <span>Income</span>
                  </div>
                  <div className="ptrans-amount positive">+$2,100.00</div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="phone-nav">
                <Home size={20} className="active" />
                <PieChart size={20} />
                <div className="nav-fab"><Plus size={24} color="white" /></div>
                <Wallet size={20} />
                <User size={20} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MobileAppSection;
