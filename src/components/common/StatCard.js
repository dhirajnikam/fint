import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue }) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${parseFloat(value).toLocaleString()}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                {trend === 'up' ? '↗' : '↘'} {trendValue}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard; 