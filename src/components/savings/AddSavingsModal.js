import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AddSavingsModal = ({ isOpen, onClose }) => {
  const { addSavingsGoal } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom validation
    if (!formData.name.trim()) {
      alert('Please enter a goal name');
      return;
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      alert('Please enter a valid target amount');
      return;
    }
    
    setIsLoading(true);

    try {
      await addSavingsGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount)
      });
      handleClose();
    } catch (error) {
      console.error('Error adding savings goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '0'
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="p-6" noValidate>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Add Savings Goal
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Goal Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Target className="h-5 w-5 text-gray-400" />
                      </div>
                                             <input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                         className="input-field pl-10"
                         placeholder="e.g., Emergency Fund"
                       />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Describe your savings goal..."
                      />
                    </div>
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                                             <input
                         type="number"
                         id="targetAmount"
                         name="targetAmount"
                         step="0.01"
                         min="0"
                         value={formData.targetAmount}
                         onChange={handleInputChange}
                         className="input-field pl-10"
                         placeholder="0.00"
                       />
                    </div>
                  </div>

                  {/* Current Amount */}
                  <div>
                    <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Amount (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="currentAmount"
                        name="currentAmount"
                        step="0.01"
                        min="0"
                        value={formData.currentAmount}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-success"
                  >
                    {isLoading ? 'Adding...' : 'Add Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSavingsModal; 