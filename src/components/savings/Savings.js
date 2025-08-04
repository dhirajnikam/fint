import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  PiggyBank, 
  Edit, 
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import AddSavingsModal from './AddSavingsModal';
import UpdateSavingsModal from './UpdateSavingsModal';

const Savings = () => {
  const { savings, deleteSavingsGoal, loading } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleUpdateGoal = (goal) => {
    setSelectedGoal(goal);
    setShowUpdateModal(true);
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await deleteSavingsGoal(id);
      } catch (error) {
        console.error('Error deleting savings goal:', error);
      }
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success-600';
    if (progress >= 50) return 'bg-warning-600';
    return 'bg-primary-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Savings Goals</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track your savings progress
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Savings Goals</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track your savings progress
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-success flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </motion.button>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${savings.reduce((sum, goal) => sum + parseFloat(goal.currentAmount || 0), 0).toFixed(2)}
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-success-600 dark:text-success-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {savings.length}
              </p>
            </div>
            <Target className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {savings.length > 0 
                  ? `${(savings.reduce((sum, goal) => sum + calculateProgress(parseFloat(goal.currentAmount || 0), parseFloat(goal.targetAmount)), 0) / savings.length).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-warning-600 dark:text-warning-400" />
          </div>
        </div>
      </div>

      {/* Savings Goals List */}
      <div className="card">
        {savings.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {savings.map((goal) => {
                const progress = calculateProgress(
                  parseFloat(goal.currentAmount || 0), 
                  parseFloat(goal.targetAmount)
                );
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {goal.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {goal.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateGoal(goal)}
                          className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          ${parseFloat(goal.currentAmount || 0).toFixed(2)} / ${parseFloat(goal.targetAmount).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{progress.toFixed(1)}% Complete</span>
                        <span>
                          ${(parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount || 0)).toFixed(2)} remaining
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <PiggyBank className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No savings goals yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start saving by creating your first goal
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-success"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Savings Goal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSavingsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <UpdateSavingsModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        goal={selectedGoal}
      />
    </div>
  );
};

export default Savings; 