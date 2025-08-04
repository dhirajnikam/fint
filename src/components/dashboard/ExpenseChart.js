import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ExpenseChart = ({ transactions }) => {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += parseFloat(transaction.amount);
    } else {
      acc[monthYear].expenses += parseFloat(transaction.amount);
    }
    
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB;
  });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No transaction data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="month" 
          stroke="#6B7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }}
          formatter={(value) => [`$${parseFloat(value).toLocaleString()}`, '']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#22C55E" 
          strokeWidth={2}
          dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#EF4444" 
          strokeWidth={2}
          dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart; 