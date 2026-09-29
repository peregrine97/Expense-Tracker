import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Award, DollarSign } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  // Define variations for smooth, continuous floating
  const float1 = {
    y: ["-15px", "15px"],
    x: ["-5px", "5px"],
    rotate: [-2, 2],
    transition: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  };
  
  const float2 = {
    y: ["20px", "-20px"],
    rotate: [2, -2],
    transition: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }
  };

  const float3 = {
    y: ["-10px", "10px"],
    x: ["10px", "-10px"],
    transition: { duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }
  };

  const float4 = {
    y: ["15px", "-15px"],
    x: ["-15px", "15px"],
    rotate: [-5, 5],
    transition: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }
  };

  return (
    <section className="hero-section">
      {/* Background glowing gradient */}
      <div className="hero-glow-bg"></div>

      <div className="hero-content">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Expense Tracking <br/>
          <span className="highlight-box">Made Simple</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle"
        >
          Understand where your money goes, earn private ranks, and get complimented for saving through a clean, intuitive experience.
        </motion.p>
      </div>

      <div className="hero-visual-area">
        {/* Center Logo / Centerpiece */}
        <motion.div 
          className="center-glowing-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
        >
          <Wallet size={48} color="white" />
        </motion.div>

        {/* Floating Elements */}
        
        {/* Top Left: Transaction */}
        <motion.div 
          className="hero-float-card card-tl"
          initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
        >
          <motion.div animate={float1} className="inner-float">
            <div className="card-header">Latest Expense</div>
            <div className="card-val" style={{ color: '#FE5A61' }}>- $12.50</div>
            <div className="card-sub">Coffee Shop</div>
          </motion.div>
        </motion.div>

        {/* Bottom Left: Bar Chart snippet */}
        <motion.div 
          className="hero-float-card card-bl"
          initial={{ opacity: 0, x: -50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8 }}
        >
          <motion.div animate={float2} className="inner-float">
            <div className="mini-chart">
              <div className="bar b1"></div>
              <div className="bar b2"></div>
              <div className="bar b3"></div>
              <div className="bar b4"></div>
            </div>
            <div className="card-sub" style={{ marginTop: '8px' }}>Weekly Spending</div>
          </motion.div>
        </motion.div>

        {/* Top Right: Rank Badge */}
        <motion.div 
          className="hero-float-card card-tr"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
        >
          <motion.div animate={float3} className="inner-float" style={{ textAlign: 'center' }}>
            <Award size={24} color="#FFC053" style={{ margin: '0 auto 8px auto' }} />
            <div className="card-header">Your Rank</div>
            <div className="card-val" style={{ color: '#FFC053' }}>Top 5%</div>
          </motion.div>
        </motion.div>

        {/* Bottom Right: Compliment */}
        <motion.div 
          className="hero-float-card card-br"
          initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.9 }}
        >
          <motion.div animate={float4} className="inner-float">
            <div className="card-header" style={{ color: '#12C48B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={16} /> Great Job!
            </div>
            <div className="card-sub" style={{ marginTop: '4px' }}>You saved $250 more this month!</div>
          </motion.div>
        </motion.div>

        {/* Far Right: Income */}
        <motion.div 
          className="hero-float-card card-fr"
          initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}
        >
          <motion.div animate={float1} className="inner-float">
            <div className="card-header">Salary</div>
            <div className="card-val" style={{ color: '#12C48B', display: 'flex', alignItems: 'center', gap: '4px' }}>
               + $4,200
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
