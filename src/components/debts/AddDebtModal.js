import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, DollarSign, Percent, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AddDebtModal = ({ isOpen, onClose }) => {
  const { addDebt } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    interestRate: '',
    minPayment: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom validation
    if (!formData.name.trim()) {
      alert('Please enter a debt name');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
      alert('Please enter a valid interest rate');
      return;
    }
    
    setIsLoading(true);

    try {
      await addDebt({
        ...formData,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        minPayment: parseFloat(formData.minPayment || 0)
      });
      handleClose();
    } catch (error) {
      console.error('Error adding debt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      amount: '',
      interestRate: '',
      minPayment: ''
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
                    Add Debt
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
                  {/* Debt Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Debt Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AlertTriangle className="h-5 w-5 text-gray-400" />
                      </div>
                                             <input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                         className="input-field pl-10"
                         placeholder="e.g., Credit Card, Student Loan"
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
                        placeholder="Describe your debt..."
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount Owed
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                                             <input
                         type="number"
                         id="amount"
                         name="amount"
                         step="0.01"
                         min="0"
                         value={formData.amount}
                         onChange={handleInputChange}
                         className="input-field pl-10"
                         placeholder="0.00"
                       />
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interest Rate (%)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-400" />
                      </div>
                                             <input
                         type="number"
                         id="interestRate"
                         name="interestRate"
                         step="0.01"
                         min="0"
                         max="100"
                         value={formData.interestRate}
                         onChange={handleInputChange}
                         className="input-field pl-10"
                         placeholder="0.00"
                       />
                    </div>
                  </div>

                  {/* Minimum Payment */}
                  <div>
                    <label htmlFor="minPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Payment (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="minPayment"
                        name="minPayment"
                        step="0.01"
                        min="0"
                        value={formData.minPayment}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Monthly Interest Cost Display */}
                  {formData.amount && formData.interestRate && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly Interest Cost
                        </span>
                        <span className="text-sm font-semibold text-danger-600 dark:text-danger-400">
                          ${((parseFloat(formData.amount) * parseFloat(formData.interestRate) / 100) / 12).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
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
                    className="btn-warning"
                  >
                    {isLoading ? 'Adding...' : 'Add Debt'}
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

export default AddDebtModal; 