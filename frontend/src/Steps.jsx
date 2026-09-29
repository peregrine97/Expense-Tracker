import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ArrowUp, ArrowDown, Award, Sparkles, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import './Steps.css';

const monthSavingsData = [
  { month: 'Jan', savings: 200, isPeak: false },
  { month: 'Feb', savings: 350, isPeak: false },
  { month: 'Mar', savings: 200, isPeak: false },
  { month: 'Apr', savings: 500, isPeak: false },
  { month: 'May', savings: 480, isPeak: false },
  { month: 'Jun', savings: 850, isPeak: true },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const currentData = payload[0].payload;
    const index = monthSavingsData.findIndex(d => d.month === label);
    const prevSavings = index > 0 ? monthSavingsData[index - 1].savings : 0;
    const diff = currentData.savings - prevSavings;

    return (
      <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#344554' }}>{label} Savings</p>
        <p style={{ color: '#12C48B', fontWeight: '800', fontSize: '24px' }}>${currentData.savings}</p>
        
        {currentData.isPeak && (
          <p style={{ color: '#FFC053', fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
            🌟 Peak Savings Area!
          </p>
        )}
        
        {index > 0 && diff > 0 && (
          <p style={{ fontSize: '13px', color: '#718096', marginTop: '8px' }}>
            Better than previous month by <span style={{ color: '#12C48B', fontWeight: 'bold' }}>+${diff}</span>!
          </p>
        )}
        {index > 0 && diff < 0 && (
          <p style={{ fontSize: '13px', color: '#718096', marginTop: '8px' }}>
            Dropped by <span style={{ color: '#FE5A61', fontWeight: 'bold' }}>-${Math.abs(diff)}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Steps = () => {
  const containerRef = useRef(null);
  const [chartInView, setChartInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effects for watermarks
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const floatAnimation = {
    y: ["-8px", "8px"],
    transition: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="steps-section" ref={containerRef}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="steps-header"
      >
        <h2>How to master your<br/><strong>finances with Ekspenses?</strong></h2>
      </motion.div>

      {/* STEP 1 */}
      <div className="step-container">
        <motion.div style={{ y: y1 }} className="watermark watermark-1">1</motion.div>
        
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="step-content">
          <div className="step-label">Step 1</div>
          <h3 className="step-title">Log daily transactions</h3>
          
          <div className="step-list">
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>Add your expenses on every regular transaction effortlessly.</p>
            </div>
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>Categorize your spending to know exactly where your money goes.</p>
            </div>
          </div>
        </motion.div>

        <div className="step-visual">
          <div className="stacked-cards-container">
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 0.8, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="mock-card mock-card-1"
            >
              <div className="mock-card-header">Coffee Shop</div>
              <div className="mock-card-sub">Food & Dining</div>
              <div className="mock-card-amount" style={{ color: '#FE5A61' }}>- 4.50 USD</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="mock-card mock-card-2"
            >
              <div className="mock-card-header">Grocery Store</div>
              <div className="mock-card-sub">Groceries</div>
              <div className="mock-card-amount" style={{ color: '#FE5A61' }}>- 85.00 USD</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} animate={floatAnimation}
              className="mock-card mock-card-3"
            >
              <div className="mock-card-header">Salary Deposit</div>
              <div className="mock-card-sub">Income</div>
              <div className="mock-card-amount" style={{ color: '#12C48B' }}>+ 3,200 USD</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* STEP 2 */}
      <div className="step-container step-reverse">
        <motion.div style={{ y: y2 }} className="watermark watermark-2" style={{ left: '-50px', right: 'auto' }}>2</motion.div>
        
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="step-content">
          <div className="step-label">Step 2</div>
          <h3 className="step-title">Month-end insights <br/>& tracking</h3>
          
          <div className="step-list">
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>At the end of the month, immediately see how much you spent vs. what you successfully saved.</p>
            </div>
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>Easily identify months where your savings dropped to help correct your spending habits.</p>
            </div>
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p><strong>Hover over the chart</strong> to see your peak savings and month-over-month comparisons!</p>
            </div>
          </div>
        </motion.div>

        <div className="step-visual">
          <div className="chart-visual-container">
            
            {/* The chart container triggers the chart render when scrolled into view */}
            <motion.div 
              onViewportEnter={() => setChartInView(true)}
              viewport={{ once: true, amount: 0.4 }}
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '300px', zIndex: 1 }}
            >
              {chartInView && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthSavingsData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12C48B" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#12C48B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    
                    {/* Show X axis to indicate months simultaneously */}
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A0AEC0', fontSize: 12, fontWeight: 600 }} dy={10} />
                    
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#12C48B', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#12C48B" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#savingsGradient)" 
                      isAnimationActive={true}
                      animationDuration={3500} 
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Float Card pointing out the decrease in red */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ delay: 1.5, type: 'spring', stiffness: 100 }} 
              animate={floatAnimation}
              className="floating-stat-card stat-card-1"
              style={{ zIndex: 2, top: '40px', left: '15%', padding: '16px' }}
            >
              <div className="stat-icon" style={{ backgroundColor: 'rgba(254, 90, 97, 0.1)', color: '#FE5A61' }}>
                <ArrowDown size={18} />
              </div>
              <div className="stat-details">
                <h4 style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase' }}>March Dip</h4>
                <p style={{ color: '#FE5A61', fontSize: '14px', margin: 0 }}>Savings fell by $150</p>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* STEP 3 */}
      <div className="step-container">
        <motion.div style={{ y: y3 }} className="watermark watermark-1" style={{ top: '-150px' }}>3</motion.div>
        
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="step-content">
          <div className="step-label">Step 3</div>
          <h3 className="step-title">Earn your private rank</h3>
          
          <div className="step-list">
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>Based on how well you save compared to all other users, you earn a personalized saving rank.</p>
            </div>
            <div className="step-list-item">
              <Check className="step-check" size={20} strokeWidth={3} />
              <p>This "Top X%" metric is entirely private and restricted to you. It's a fun way to push your saving habits further!</p>
            </div>
          </div>
        </motion.div>

        <div className="step-visual">
          <div className="chart-visual-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }} 
              animate={floatAnimation}
              style={{
                background: 'linear-gradient(135deg, #FFC053, #FF9C00)',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(255, 192, 83, 0.4)',
                textAlign: 'center',
                color: 'white',
                width: '280px'
              }}
            >
              <Award size={64} style={{ margin: '0 auto 16px auto', opacity: 0.9 }} />
              <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', opacity: 0.9 }}>Savings Rank</h4>
              <p style={{ fontSize: '42px', fontWeight: 800 }}>Top 5%</p>
              <p style={{ fontSize: '14px', marginTop: '16px', opacity: 0.8 }}>Private & Secure</p>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Steps;
