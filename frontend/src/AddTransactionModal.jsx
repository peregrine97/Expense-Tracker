import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    is_income: false
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onClose();
      // Reset form
      setFormData({
        amount: '',
        category: 'Food & Dining',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
        is_income: false
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className="modal-header">
            <h2>Add Transaction</h2>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="type-toggle">
              <button 
                type="button" 
                className={`toggle-btn ${!formData.is_income ? 'active expense' : ''}`}
                onClick={() => setFormData({...formData, is_income: false})}
              >
                Expense
              </button>
              <button 
                type="button" 
                className={`toggle-btn ${formData.is_income ? 'active income' : ''}`}
                onClick={() => setFormData({...formData, is_income: true})}
              >
                Income
              </button>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01" 
                required 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {!formData.is_income ? (
                  <>
                    <option>Food & Dining</option>
                    <option>Shopping</option>
                    <option>Transport</option>
                    <option>Bills</option>
                  </>
                ) : (
                  <option>Income</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="e.g. Starbucks or Salary"
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                required
                value={formData.expense_date}
                onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Save Transaction'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
