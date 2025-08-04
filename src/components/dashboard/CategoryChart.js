import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategoryChart = ({ transactions }) => {
  // Group expenses by category
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(transaction.amount);
      return acc;
    }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: parseFloat(value)
  }));

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
    '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No expense data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart; 