import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  AlertTriangle, 
  Edit, 
  Trash2,
  TrendingDown,
  Calculator,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import AddDebtModal from './AddDebtModal';
import UpdateDebtModal from './UpdateDebtModal';
import DebtRepaymentPlan from './DebtRepaymentPlan';

const Debts = () => {
  const { debts, deleteDebt, loading } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRepaymentPlan, setShowRepaymentPlan] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const handleUpdateDebt = (debt) => {
    setSelectedDebt(debt);
    setShowUpdateModal(true);
  };

  const handleDeleteDebt = async (id) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      try {
        await deleteDebt(id);
      } catch (error) {
        console.error('Error deleting debt:', error);
      }
    }
  };

  const calculateTotalDebt = () => {
    return debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
  };

  const calculateMonthlyInterest = () => {
    return debts.reduce((sum, debt) => {
      const amount = parseFloat(debt.amount || 0);
      const rate = parseFloat(debt.interestRate || 0);
      return sum + (amount * (rate / 100) / 12);
    }, 0);
  };

  const getHighInterestDebts = () => {
    return debts.filter(debt => parseFloat(debt.interestRate) > 10);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debt Management</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track and manage your debts
            </p>
          </div>
        </div>
        <div className="card">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debt Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage your debts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-warning flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Debt</span>
        </motion.button>
      </div>

      {/* Debt Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Debt</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${calculateTotalDebt().toFixed(2)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning-600 dark:text-warning-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Interest</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${calculateMonthlyInterest().toFixed(2)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-danger-600 dark:text-danger-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Interest Debts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {getHighInterestDebts().length}
              </p>
            </div>
            <Calculator className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* AI Repayment Strategy */}
      {debts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Repayment Strategy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized debt repayment recommendations
              </p>
            </div>
            <button
              onClick={() => setShowRepaymentPlan(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>View Strategy</span>
            </button>
          </div>
        </div>
      )}

      {/* Debts List */}
      <div className="card">
        {debts.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {debts.map((debt) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {debt.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {debt.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateDebt(debt)}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${parseFloat(debt.amount).toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interest Rate</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {parseFloat(debt.interestRate).toFixed(2)}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Min Payment</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${parseFloat(debt.minPayment || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Interest Cost */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly Interest Cost
                      </span>
                      <span className="text-sm font-semibold text-danger-600 dark:text-danger-400">
                        ${((parseFloat(debt.amount) * parseFloat(debt.interestRate) / 100) / 12).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No debts recorded
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start tracking your debts to get repayment strategies
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-warning"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Debt
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddDebtModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <UpdateDebtModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        debt={selectedDebt}
      />

      <DebtRepaymentPlan
        isOpen={showRepaymentPlan}
        onClose={() => setShowRepaymentPlan(false)}
        debts={debts}
      />
    </div>
  );
};

export default Debts; 