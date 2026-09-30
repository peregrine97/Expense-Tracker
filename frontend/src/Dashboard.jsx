import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart as ChartIcon, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Coffee,
  ShoppingBag,
  Car,
  TrendingUp,
  TrendingDown,
  DollarSign,
  LogOut,
  Award,
  Zap,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsSummary, getMonthlyTransactions, addTransaction, getHistoricalSavings } from './api';
import AddTransactionModal from './AddTransactionModal';
import AnalyticsView from './AnalyticsView';

const CATEGORY_MAP = {
  'Food & Dining': { color: '#FE5A61', icon: Coffee, colorClass: 'food' },
  'Shopping': { color: '#40C3F9', icon: ShoppingBag, colorClass: 'shopping' },
  'Transport': { color: '#FFC053', icon: Car, colorClass: 'transport' },
  'Bills': { color: '#9b51e0', icon: FileText, colorClass: 'shopping' },
};

const getCategoryStyle = (category, isIncome) => {
  if (isIncome) return { color: '#12C48B', icon: DollarSign, colorClass: 'salary' };
  return CATEGORY_MAP[category] || { color: '#8884d8', icon: ShoppingBag, colorClass: 'shopping' };
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [historicalData, setHistoricalData] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-indexed

      const [txs, summary, historical] = await Promise.all([
        getMonthlyTransactions(year, month),
        getAnalyticsSummary(year, month),
        getHistoricalSavings()
      ]);
      
      // Sort transactions newest first
      const sortedTxs = txs.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));
      setTransactions(sortedTxs);
      setSummaryData(summary);
      setHistoricalData(historical);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const handleAddTransaction = async (data) => {
    await addTransaction(data);
    await fetchData(); // Refresh data after adding
  };

  // Derive pie chart data directly from actual transactions
  const expensesOnly = transactions.filter(t => !t.is_income);
  const totalExpenses = expensesOnly.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals = expensesOnly.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category],
    color: getCategoryStyle(category, false).color
  }));

  const handleAction = (actionName) => {
    if (['Dashboard', 'Wallets', 'Analytics', 'Settings'].includes(actionName)) {
      setActiveTab(actionName);
    } else {
      alert(`${actionName} feature is coming in the next update!`);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Decorative Floating Background Elements */}
      <div className="bg-shape shape-1" />
      <div className="bg-shape shape-2" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="bg-shape shape-3" 
      />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sidebar"
      >
        <div className="logo-container">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #12C48B, #40C3F9)', borderRadius: '50%' }}>
            <Wallet color="white" size={20} />
          </div>
          Ekspenses
        </div>
        
        <nav className="nav-menu">
          <a href="#" className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleAction('Dashboard'); }}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className={`nav-item ${activeTab === 'Wallets' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleAction('Wallets'); }}>
            <Wallet size={20} />
            Wallets
          </a>
          <a href="#" className={`nav-item ${activeTab === 'Analytics' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleAction('Analytics'); }}>
            <ChartIcon size={20} />
            Analytics
          </a>
          <a href="#" className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleAction('Settings'); }}>
            <Settings size={20} />
            Settings
          </a>
          
          <div style={{ flexGrow: 1 }}></div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="main-content">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="header"
        >
          <div className="greeting">
            <h1>Good morning, {user?.name ? user.name.split(' ')[0] : 'Explorer'} 👋</h1>
            <p className="text-muted" style={{marginBottom: '10px'}}>Here's what's happening with your money.</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} 
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              >
                &larr; Prev
              </button>
              <span style={{ fontWeight: 'bold', minWidth: '120px', textAlign: 'center' }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} 
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
          <div className="header-actions" style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ 
                cursor: 'pointer',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #12C48B, #40C3F9)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '16px',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(18, 196, 139, 0.3)',
                border: '2px solid white'
              }}
            >
              {getInitials(user?.name)}
            </div>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '8px',
                  minWidth: '200px',
                  zIndex: 100,
                  border: '1px solid #eee'
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, color: '#333' }}>{user?.name || 'Explorer'}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{user?.email || ''}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--expense)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 90, 97, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {activeTab === 'Dashboard' ? (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="dashboard-grid"
        >
          {/* Left Column */}
          <div className="dashboard-left">
            <motion.div variants={fadeUp} className="card balance-card">
              <div className="balance-content-wrapper">
                <div className="balance-label">Total Balance</div>
                <div className="balance-amount">
                  ₹{loading ? "..." : (summaryData?.summary?.savings || 0).toFixed(2)}
                </div>
                
                <div className="balance-stats">
                  <div className="stat-item">
                    <span className="stat-label">Income</span>
                    <span className="stat-value income">
                      <TrendingUp size={16} /> ₹{loading ? "..." : (summaryData?.summary?.income || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Expenses</span>
                    <span className="stat-value expense">
                      <TrendingDown size={16} /> ₹{loading ? "..." : (summaryData?.summary?.expenses || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="card">
              <div className="card-title">
                Recent Transactions
                <button 
                  onClick={() => handleAction('See All Transactions')}
                  style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}
                >
                  See All
                </button>
              </div>
              <div className="transaction-list">
                {loading ? <p style={{padding: '20px', color: '#888'}}>Loading transactions...</p> : 
                 transactions.length === 0 ? <p style={{padding: '20px', color: '#888'}}>No transactions this month.</p> :
                 transactions.map(t => {
                  const style = getCategoryStyle(t.category, t.is_income);
                  const Icon = style.icon;
                  const displayDate = new Date(t.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  
                  return (
                    <div className="transaction-item" key={t.id} onClick={() => handleAction(`View Transaction ${t.id}`)}>
                      <div className="t-left">
                        <div className={`t-icon ${style.colorClass}`}>
                          <Icon size={24} />
                        </div>
                        <div className="t-details">
                          <span className="t-title">{t.description || t.category}</span>
                          <span className="t-date">{displayDate}</span>
                        </div>
                      </div>
                      <div className={`t-amount ${t.is_income ? 'income' : 'expense'}`}>
                        {t.is_income ? '+' : '-'}₹{Math.abs(t.amount).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            


            {/* Analytics */}
            <motion.div variants={fadeUp} className="card">
              <div className="card-title">Analytics</div>
              
              <div className="chart-container">
                <div className="chart-center-text">
                  <span>Total Expenses</span>
                  <strong>₹{totalExpenses.toFixed(2)}</strong>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="category-list">
                {pieChartData.length === 0 && !loading && <p style={{textAlign:'center', color: '#888', marginTop: '20px'}}>No expenses yet.</p>}
                {pieChartData.map((cat, i) => (
                  <div className="category-item" key={i}>
                    <div className="cat-left">
                      <div className="cat-dot" style={{ backgroundColor: cat.color }}></div>
                      <span className="cat-name">{cat.name}</span>
                    </div>
                    <span className="cat-amount">₹{cat.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        ) : activeTab === 'Analytics' ? (
          <AnalyticsView summaryData={summaryData} transactions={transactions} historicalData={historicalData} loading={loading} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '60vh',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Settings size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '8px' }}>{activeTab}</h2>
            <p style={{ color: '#666' }}>This module is currently under construction.</p>
          </motion.div>
        )}
      </main>

      <motion.button 
        className="fab" 
        title="Add Transaction"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={32} />
      </motion.button>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

export default Dashboard;
