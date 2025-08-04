import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  Bell, 
  Shield, 
  User,
  Settings as SettingsIcon,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const {
    exportData,
    clearAllData,
    showNotification,

    analytics,
    addTransaction,
    addSavingsGoal,
    addDebt

  } = useData();
  const { user, logout } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportData();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Clear data error:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (
          !data ||
          typeof data !== 'object' ||
          !Array.isArray(data.transactions) ||
          !Array.isArray(data.savings) ||
          !Array.isArray(data.debts)
        ) {
          throw new Error('Invalid data structure');
        }

        for (const transaction of data.transactions) {
          const { id, userId, createdAt, updatedAt, ...transactionData } = transaction;
          await addTransaction(transactionData);
        }

        for (const goal of data.savings) {
          const { id, userId, createdAt, updatedAt, ...goalData } = goal;
          await addSavingsGoal(goalData);
        }

        for (const debt of data.debts) {
          const { id, userId, createdAt, updatedAt, ...debtData } = debt;
          await addDebt(debtData);
        }

        showNotification('Data imported successfully!', 'success');
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Error importing data. Please check the file and try again.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const getDataStats = () => {
    return {
      transactions: transactions.length,
      savings: savings.length,
      debts: debts.length,
      totalSize: '~2.5 MB' // Placeholder
    };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account and data preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Account Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                {user?.email}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Created
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                {user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString() : 
                  'Unknown'
                }
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full btn-danger flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Data Management
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Transactions</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{stats.transactions}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Savings Goals</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{stats.savings}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Active Debts</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{stats.debts}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Total Size</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{stats.totalSize}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="w-full btn-secondary flex items-center justify-center cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </label>
              </div>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full btn-danger flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Transaction Alerts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified for large transactions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Savings Reminders
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reminders for savings goals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Debt Alerts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Payment due reminders
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Privacy & Security
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Data Security
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your data is encrypted and stored securely using Firebase's enterprise-grade security.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Data Ownership
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You own your data. Export it anytime or delete it completely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      Clear All Data
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This action will permanently delete all your transactions, savings goals, and debts. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleClearData}
                  disabled={isClearing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isClearing ? 'Clearing...' : 'Clear All Data'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 