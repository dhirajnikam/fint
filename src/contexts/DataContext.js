import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [debts, setDebts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsProgress: 0,
    debtProgress: 0,
    topCategories: [],
    recentActivity: []
  });

  // Enhanced notification system
  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    // Show toast notification
    if (type === 'success') {
      toast.success(message, { duration });
    } else if (type === 'error') {
      toast.error(message, { duration });
    } else if (type === 'warning') {
      toast(message, { 
        icon: '⚠️',
        duration 
      });
    }
  };

  // Enhanced transaction functions
  const addTransaction = async (transaction) => {
    try {
      const transactionData = {
        ...transaction,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        amount: parseFloat(transaction.amount),
        category: transaction.category || 'Other',
        description: transaction.description || '',
        tags: transaction.tags || [],
        location: transaction.location || null,
        receiptUrl: transaction.receiptUrl || null
      };

      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      
      showNotification(
        `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} added successfully!`,
        'success'
      );
      
      // Add to analytics
      updateAnalytics();
      
      return docRef;
    } catch (error) {
      showNotification('Error adding transaction. Please try again.', 'error');
      throw error;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        amount: parseFloat(updates.amount)
      };

      await updateDoc(doc(db, 'transactions', id), updateData);
      showNotification('Transaction updated successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error updating transaction. Please try again.', 'error');
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      showNotification('Transaction deleted successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error deleting transaction. Please try again.', 'error');
      throw error;
    }
  };

  // Enhanced savings functions
  const addSavingsGoal = async (goal) => {
    try {
      const goalData = {
        ...goal,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: parseFloat(goal.currentAmount || 0),
        progress: parseFloat(goal.currentAmount || 0) / parseFloat(goal.targetAmount) * 100,
        status: goal.status || 'active',
        deadline: goal.deadline || null,
        notes: goal.notes || '',
        color: goal.color || '#3B82F6'
      };

      const docRef = await addDoc(collection(db, 'savings'), goalData);
      showNotification('Savings goal added successfully!', 'success');
      updateAnalytics();
      return docRef;
    } catch (error) {
      showNotification('Error adding savings goal. Please try again.', 'error');
      throw error;
    }
  };

  const updateSavingsGoal = async (id, updates) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.currentAmount && updates.targetAmount) {
        updateData.progress = (parseFloat(updates.currentAmount) / parseFloat(updates.targetAmount)) * 100;
      }

      await updateDoc(doc(db, 'savings', id), updateData);
      showNotification('Savings goal updated successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error updating savings goal. Please try again.', 'error');
      throw error;
    }
  };

  const deleteSavingsGoal = async (id) => {
    try {
      await deleteDoc(doc(db, 'savings', id));
      showNotification('Savings goal deleted successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error deleting savings goal. Please try again.', 'error');
      throw error;
    }
  };

  // Enhanced debt functions
  const addDebt = async (debt) => {
    try {
      const debtData = {
        ...debt,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        amount: parseFloat(debt.amount),
        remainingAmount: parseFloat(debt.remainingAmount || debt.amount),
        interestRate: parseFloat(debt.interestRate || 0),
        status: debt.status || 'active',
        dueDate: debt.dueDate || null,
        notes: debt.notes || '',
        color: debt.color || '#EF4444'
      };

      const docRef = await addDoc(collection(db, 'debts'), debtData);
      showNotification('Debt added successfully!', 'success');
      updateAnalytics();
      return docRef;
    } catch (error) {
      showNotification('Error adding debt. Please try again.', 'error');
      throw error;
    }
  };

  const updateDebt = async (id, updates) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.remainingAmount && updates.amount) {
        updateData.progress = ((parseFloat(updates.amount) - parseFloat(updates.remainingAmount)) / parseFloat(updates.amount)) * 100;
      }

      await updateDoc(doc(db, 'debts', id), updateData);
      showNotification('Debt updated successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error updating debt. Please try again.', 'error');
      throw error;
    }
  };

  const deleteDebt = async (id) => {
    try {
      await deleteDoc(doc(db, 'debts', id));
      showNotification('Debt deleted successfully!', 'success');
      updateAnalytics();
    } catch (error) {
      showNotification('Error deleting debt. Please try again.', 'error');
      throw error;
    }
  };

  // Analytics and insights
  const updateAnalytics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = t.createdAt;
      return transactionDate &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate top spending categories
    const categorySpending = {};
    monthlyTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + parseFloat(t.amount);
      });

    const topCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    // Calculate savings progress
    const totalSavingsTarget = savings.reduce((sum, s) => sum + parseFloat(s.targetAmount || 0), 0);
    const totalSavingsCurrent = savings.reduce((sum, s) => sum + parseFloat(s.currentAmount || 0), 0);
    const savingsProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

    // Calculate debt progress
    const totalDebtAmount = debts.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    const totalDebtRemaining = debts.reduce((sum, d) => sum + parseFloat(d.remainingAmount || d.amount || 0), 0);
    const debtProgress = totalDebtAmount > 0 ? ((totalDebtAmount - totalDebtRemaining) / totalDebtAmount) * 100 : 0;

    // Recent activity
    const recentActivity = [...transactions, ...savings, ...debts]
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 10);

    setAnalytics({
      monthlyIncome,
      monthlyExpenses,
      savingsProgress,
      debtProgress,
      topCategories,
      recentActivity
    });
  };

  // Export data functionality
  const exportData = async () => {
    try {
      const exportData = {
        transactions,
        savings,
        debts,
        analytics,
        exportDate: new Date().toISOString(),
        userId: user.uid
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showNotification('Data exported successfully!', 'success');
    } catch (error) {
      showNotification('Error exporting data. Please try again.', 'error');
    }
  };

  // Clear all data (for testing or reset)
  const clearAllData = async () => {
    try {
      const batch = writeBatch(db);
      
      // Delete all transactions
      const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
      const transactionsSnapshot = await getDocs(transactionsQuery);
      transactionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete all savings
      const savingsQuery = query(collection(db, 'savings'), where('userId', '==', user.uid));
      const savingsSnapshot = await getDocs(savingsQuery);
      savingsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      // Delete all debts
      const debtsQuery = query(collection(db, 'debts'), where('userId', '==', user.uid));
      const debtsSnapshot = await getDocs(debtsQuery);
      debtsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();
      showNotification('All data cleared successfully!', 'success');
    } catch (error) {
      showNotification('Error clearing data. Please try again.', 'error');
    }
  };

  // Real-time listeners
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setSavings([]);
      setDebts([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Transactions listener
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const transactionsUnsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null
        };
      });
      setTransactions(transactionsData);
    });

    // Savings listener
    const savingsQuery = query(
      collection(db, 'savings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const savingsUnsubscribe = onSnapshot(savingsQuery, (snapshot) => {
      const savingsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null
        };
      });
      setSavings(savingsData);
    });

    // Debts listener
    const debtsQuery = query(
      collection(db, 'debts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const debtsUnsubscribe = onSnapshot(debtsQuery, (snapshot) => {
      const debtsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null
        };
      });
      setDebts(debtsData);
    });

    setLoading(false);

    return () => {
      transactionsUnsubscribe();
      savingsUnsubscribe();
      debtsUnsubscribe();
    };
  }, [user]);

  // Update analytics when data changes
  useEffect(() => {
    if (user) {
      updateAnalytics();
    }
  }, [transactions, savings, debts, user]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  const totalSavings = savings.reduce((sum, s) => sum + parseFloat(s.currentAmount || 0), 0);
  const totalDebts = debts.reduce((sum, d) => sum + parseFloat(d.remainingAmount || d.amount || 0), 0);

  const value = {
    transactions,
    savings,
    debts,
    notifications,
    analytics,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addDebt,
    updateDebt,
    deleteDebt,
    showNotification,
    exportData,
    clearAllData,
    totalIncome,
    totalExpenses,
    totalBalance,
    totalSavings,
    totalDebts
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 