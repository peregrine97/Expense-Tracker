const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const loginUser = async (googleToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/login?token=${googleToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  return response.json();
};

export const getAnalyticsSummary = async (year, month) => {
  const response = await fetch(`${API_BASE_URL}/analytics/summary/${year}/${month}`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};

export const getMonthlyTransactions = async (year, month) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${year}/${month}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const addTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE_URL}/expenses/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) throw new Error('Failed to add transaction');
  return response.json();
};

export const getHistoricalSavings = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/historical/savings`);
  if (!response.ok) throw new Error('Failed to fetch historical savings');
  return response.json();
};
