import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Award } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AnalyticsView({ summaryData, transactions, historicalData, loading }) {
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Analytics...</div>;

  const income = summaryData?.summary?.income || 0;
  const expenses = summaryData?.summary?.expenses || 0;
  const savings = summaryData?.summary?.savings || 0;
  const savingsRate = summaryData?.summary?.savings_rate || 0;
  const socialRanking = summaryData?.social_ranking || "Top 100%";
  const pointsEarned = summaryData?.points_earned_this_month || 0;

  const chartData = [
    {
      name: 'Current Month',
      Income: income,
      Expenses: expenses
    }
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <motion.div variants={fadeUp} className="card" style={{ background: 'linear-gradient(135deg, #12C48B, #0E9B6D)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Savings Rate</span>
            <Target size={20} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{savingsRate.toFixed(1)}%</div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
            Of your total income is saved
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666' }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Net Savings</span>
            <Zap size={20} color="#FFC053" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#333' }}>₹{savings.toFixed(2)}</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
            {savings >= 0 ? "You're in the green!" : "You've spent more than you earned."}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card" style={{ background: 'linear-gradient(135deg, #9b51e0, #6a11cb)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Your Savings Rank</span>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '8px' }}>
              <Award size={20} color="white" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{socialRanking}</div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
            <Zap size={16} color="#FFC053" />
            <span style={{ fontSize: '12px' }}>
              You earned <strong>{pointsEarned} pts</strong> this month!
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="card" style={{ height: '400px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#333' }}>Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Income" fill="#12C48B" radius={[8, 8, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Expenses" fill="#FE5A61" radius={[8, 8, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={fadeUp} className="card" style={{ height: '400px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#333' }}>Historical Savings Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData || []} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`₹${value}`, 'Net Savings']}
            />
            <ReferenceLine y={0} stroke="#ccc" />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#9b51e0" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, value, key } = props;
                const isPositive = value >= 0;
                return (
                  <circle 
                    key={key} 
                    cx={cx} 
                    cy={cy} 
                    r={6} 
                    stroke="white" 
                    strokeWidth={2} 
                    fill={isPositive ? "#12C48B" : "#FE5A61"} 
                  />
                );
              }}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
