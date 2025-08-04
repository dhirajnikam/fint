import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  AlertTriangle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import StatCard from '../common/StatCard';
import ExpenseChart from './ExpenseChart';
import CategoryChart from './CategoryChart';
import AIInsights from './AIInsights';

const Dashboard = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    totalBalance, 
    totalSavings, 
    totalDebts,
    transactions,
    savings,
    debts
  } = useData();

  const recentTransactions = transactions.slice(0, 5);
  const recentSavings = savings.slice(0, 3);
  const recentDebts = debts.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overview of your financial health and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Balance"
            value={totalBalance}
            icon={DollarSign}
            color="primary"
            trend={totalBalance > 0 ? 'up' : 'down'}
            trendValue={Math.abs((totalBalance / (totalIncome || 1)) * 100).toFixed(1)}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Income"
            value={totalIncome}
            icon={TrendingUp}
            color="success"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            icon={TrendingDown}
            color="danger"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Savings"
            value={totalSavings}
            icon={PiggyBank}
            color="success"
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Income vs Expenses
            </h3>
          </div>
          <ExpenseChart transactions={transactions} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Expenses by Category
            </h3>
          </div>
          <CategoryChart transactions={transactions} />
        </motion.div>
      </div>

      {/* AI Insights and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <AIInsights />
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <Zap className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
              <button className="w-full btn-success flex items-center justify-center">
                <Target className="h-4 w-4 mr-2" />
                Add Savings Goal
              </button>
              <button className="w-full btn-warning flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Add Debt
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.category}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent transactions
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings and Debts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Savings Goals
            </h3>
            <PiggyBank className="h-5 w-5 text-success-600 dark:text-success-400" />
          </div>
          <div className="space-y-3">
            {recentSavings.length > 0 ? (
              recentSavings.map((goal) => {
                const progress = (parseFloat(goal.currentAmount || 0) / parseFloat(goal.targetAmount)) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {goal.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ${parseFloat(goal.currentAmount || 0).toFixed(2)} / ${parseFloat(goal.targetAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-success-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No savings goals yet
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Debts
            </h3>
            <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </div>
          <div className="space-y-3">
            {recentDebts.length > 0 ? (
              recentDebts.map((debt) => (
                <div key={debt.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {debt.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {debt.interestRate}% APR
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">
                      ${parseFloat(debt.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No active debts
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 