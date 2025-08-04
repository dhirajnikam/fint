import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, TrendingUp, Calculator, Target } from 'lucide-react';

const DebtRepaymentPlan = ({ isOpen, onClose, debts }) => {
  const [strategy, setStrategy] = useState('avalanche');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && debts.length > 0) {
      generateRepaymentPlan();
    }
  }, [isOpen, debts, strategy, monthlyPayment]);

  const generateRepaymentPlan = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const sortedDebts = [...debts].sort((a, b) => {
        if (strategy === 'avalanche') {
          // Sort by interest rate (highest first)
          return parseFloat(b.interestRate) - parseFloat(a.interestRate);
        } else {
          // Sort by amount (lowest first) for snowball
          return parseFloat(a.amount) - parseFloat(b.amount);
        }
      });

      const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
      const totalMinPayments = debts.reduce((sum, debt) => sum + parseFloat(debt.minPayment || 0), 0);
      const extraPayment = parseFloat(monthlyPayment || 0) - totalMinPayments;

      const repaymentPlan = sortedDebts.map((debt, index) => {
        const amount = parseFloat(debt.amount);
        const rate = parseFloat(debt.interestRate);
        const minPayment = parseFloat(debt.minPayment || 0);
        
        // Calculate monthly payment for this debt
        let monthlyPaymentForDebt = minPayment;
        if (index === 0 && extraPayment > 0) {
          monthlyPaymentForDebt += extraPayment;
        }

        // Calculate time to pay off
        const monthlyRate = rate / 100 / 12;
        let remainingBalance = amount;
        let monthsToPayoff = 0;
        let totalInterest = 0;

        while (remainingBalance > 0 && monthsToPayoff < 600) { // Max 50 years
          const interest = remainingBalance * monthlyRate;
          const principal = monthlyPaymentForDebt - interest;
          remainingBalance = Math.max(0, remainingBalance - principal);
          totalInterest += interest;
          monthsToPayoff++;
        }

        return {
          ...debt,
          monthlyPayment: monthlyPaymentForDebt,
          monthsToPayoff,
          totalInterest,
          totalPaid: amount + totalInterest
        };
      });

      const totalInterest = repaymentPlan.reduce((sum, debt) => sum + debt.totalInterest, 0);
      const totalPaid = repaymentPlan.reduce((sum, debt) => sum + debt.totalPaid, 0);
      const maxMonths = Math.max(...repaymentPlan.map(d => d.monthsToPayoff));

      setPlan({
        strategy,
        debts: repaymentPlan,
        totalInterest,
        totalPaid,
        maxMonths,
        monthlyPayment: parseFloat(monthlyPayment || 0)
      });
      setLoading(false);
    }, 1000);
  };

  const getStrategyDescription = () => {
    if (strategy === 'avalanche') {
      return 'Pay off debts with the highest interest rates first. This saves the most money on interest.';
    } else {
      return 'Pay off debts with the smallest balances first. This provides quick wins and motivation.';
    }
  };

  const getRecommendation = () => {
    if (!plan) return '';
    
    const highInterestDebts = debts.filter(d => parseFloat(d.interestRate) > 15);
    const lowBalanceDebts = debts.filter(d => parseFloat(d.amount) < 1000);
    
    if (highInterestDebts.length > 0) {
      return 'Avalanche method recommended due to high-interest debts.';
    } else if (lowBalanceDebts.length > 0) {
      return 'Snowball method recommended for quick wins and motivation.';
    } else {
      return 'Both methods are viable. Choose based on your preference.';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-screen overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      AI Debt Repayment Strategy
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Personalized repayment plan based on your debts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Strategy Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="card">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Repayment Strategy
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="avalanche"
                          checked={strategy === 'avalanche'}
                          onChange={(e) => setStrategy(e.target.value)}
                          className="mr-2"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">Avalanche Method</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pay highest interest first</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="snowball"
                          checked={strategy === 'snowball'}
                          onChange={(e) => setStrategy(e.target.value)}
                          className="mr-2"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">Snowball Method</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pay smallest balance first</p>
                        </div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      {getStrategyDescription()}
                    </p>
                  </div>

                  <div className="card">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Monthly Payment
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="monthlyPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Total Monthly Payment
                        </label>
                        <input
                          type="number"
                          id="monthlyPayment"
                          value={monthlyPayment}
                          onChange={(e) => setMonthlyPayment(e.target.value)}
                          className="input-field"
                          placeholder="Enter your monthly payment amount"
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Minimum payments: ${debts.reduce((sum, debt) => sum + parseFloat(debt.minPayment || 0), 0).toFixed(2)}</p>
                        <p>Extra payment: ${Math.max(0, parseFloat(monthlyPayment || 0) - debts.reduce((sum, debt) => sum + parseFloat(debt.minPayment || 0), 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="card mb-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        AI Recommendation
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getRecommendation()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Repayment Plan */}
                {loading ? (
                  <div className="card">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : plan ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interest</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${plan.totalInterest.toFixed(2)}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-danger-600 dark:text-danger-400" />
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${plan.totalPaid.toFixed(2)}
                            </p>
                          </div>
                          <Calculator className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time to Payoff</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {Math.floor(plan.maxMonths / 12)}y {plan.maxMonths % 12}m
                            </p>
                          </div>
                          <Target className="h-8 w-8 text-success-600 dark:text-success-400" />
                        </div>
                      </div>
                    </div>

                    {/* Debt Order */}
                    <div className="card">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Repayment Order
                      </h4>
                      <div className="space-y-4">
                        {plan.debts.map((debt, index) => (
                          <div key={debt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                  {debt.name}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {debt.interestRate}% APR
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                ${debt.monthlyPayment.toFixed(2)}/month
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {Math.floor(debt.monthsToPayoff / 12)}y {debt.monthsToPayoff % 12}m
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DebtRepaymentPlan; 