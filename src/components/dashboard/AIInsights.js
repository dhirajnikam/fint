import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  Calendar,
  DollarSign,
  PiggyBank,
  CreditCard
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AIInsights = () => {
  const { analytics, transactions, savings, debts, totalBalance, totalIncome, totalExpenses, totalSavings } = useData();

  const getInsights = () => {
    const insights = [];

    // Spending insights
    if (analytics.monthlyExpenses > analytics.monthlyIncome * 0.8) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Spending Alert',
        message: 'Your expenses are over 80% of your income this month. Consider reducing non-essential spending.',
        color: 'text-yellow-600 dark:text-yellow-400'
      });
    }

    // Savings insights
    if (analytics.savingsProgress < 25) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Savings Opportunity',
        message: 'Your savings progress is below 25%. Try setting aside 20% of your income for savings.',
        color: 'text-blue-600 dark:text-blue-400'
      });
    } else if (analytics.savingsProgress > 75) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Excellent Savings Progress',
        message: 'Great job! You\'re making excellent progress on your savings goals.',
        color: 'text-green-600 dark:text-green-400'
      });
    }

    // Debt insights
    if (analytics.debtProgress < 50 && debts.length > 0) {
      insights.push({
        type: 'warning',
        icon: CreditCard,
        title: 'Debt Management',
        message: 'Consider focusing on paying off high-interest debts first to reduce overall debt burden.',
        color: 'text-red-600 dark:text-red-400'
      });
    }

    // Income vs Expenses
    if (totalBalance < 0) {
      insights.push({
        type: 'error',
        icon: TrendingDown,
        title: 'Negative Balance',
        message: 'Your expenses exceed your income. Review your spending habits and consider additional income sources.',
        color: 'text-red-600 dark:text-red-400'
      });
    } else if (totalBalance > totalIncome * 0.3) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Strong Financial Position',
        message: 'You\'re maintaining a healthy balance. Consider investing surplus funds.',
        color: 'text-green-600 dark:text-green-400'
      });
    }

    // Category insights
    if (analytics.topCategories.length > 0) {
      const topCategory = analytics.topCategories[0];
      if (topCategory.amount > analytics.monthlyExpenses * 0.4) {
        insights.push({
          type: 'info',
          icon: Lightbulb,
          title: 'Category Focus',
          message: `${topCategory.category} accounts for ${Math.round((topCategory.amount / analytics.monthlyExpenses) * 100)}% of your expenses. Consider if this aligns with your priorities.`,
          color: 'text-blue-600 dark:text-blue-400'
        });
      }
    }

    // Monthly comparison
    const currentMonth = new Date().getMonth();
    const lastMonthTransactions = transactions.filter(t => {
      const date = t.createdAt;
      return date && date.getMonth() === currentMonth - 1;
    });
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (lastMonthExpenses > 0) {
      const change = ((analytics.monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (change > 20) {
        insights.push({
          type: 'warning',
          icon: TrendingUp,
          title: 'Spending Increase',
          message: `Your spending increased by ${Math.round(change)}% compared to last month. Review your recent expenses.`,
          color: 'text-yellow-600 dark:text-yellow-400'
        });
      } else if (change < -20) {
        insights.push({
          type: 'success',
          icon: TrendingDown,
          title: 'Spending Reduction',
          message: `Great job! Your spending decreased by ${Math.round(Math.abs(change))}% compared to last month.`,
          color: 'text-green-600 dark:text-green-400'
        });
      }
    }

    return insights;
  };

  const insights = getInsights();

  const getRecommendations = () => {
    const recommendations = [];

    // Emergency fund recommendation
    const emergencyFund = totalExpenses * 3;
    if (totalSavings < emergencyFund) {
      recommendations.push({
        icon: PiggyBank,
        title: 'Build Emergency Fund',
        description: `Aim to save $${emergencyFund.toFixed(2)} (3 months of expenses) for emergencies.`,
        priority: 'high'
      });
    }

    // Debt payoff recommendation
    if (debts.length > 0) {
      const highInterestDebts = debts.filter(d => (d.interestRate || 0) > 10);
      if (highInterestDebts.length > 0) {
        recommendations.push({
          icon: CreditCard,
          title: 'Prioritize High-Interest Debt',
          description: 'Focus on paying off debts with interest rates above 10% first.',
          priority: 'high'
        });
      }
    }

    // Investment recommendation
    if (totalBalance > totalIncome * 0.2 && totalSavings > emergencyFund) {
      recommendations.push({
        icon: TrendingUp,
        title: 'Consider Investing',
        description: 'With strong savings, consider investing surplus funds for long-term growth.',
        priority: 'medium'
      });
    }

    // Budget recommendation
    if (analytics.monthlyExpenses > analytics.monthlyIncome * 0.7) {
      recommendations.push({
        icon: Target,
        title: 'Create Detailed Budget',
        description: 'Track all expenses and create a budget to better manage your spending.',
        priority: 'high'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Insights Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          AI Insights
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Recommendations
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 border shadow-sm ${
                rec.priority === 'high' 
                  ? 'border-red-200 dark:border-red-800' 
                  : 'border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <rec.icon className={`h-5 w-5 mt-0.5 ${
                  rec.priority === 'high' 
                    ? 'text-red-500' 
                    : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.title}
                    </h4>
                    {rec.priority === 'high' && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {rec.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-500" />
          This Month's Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Income</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ${analytics.monthlyIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ${analytics.monthlyExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <PiggyBank className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {analytics.savingsProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Debt</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {analytics.debtProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights; 