import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import Savings from './components/savings/Savings';
import Debts from './components/debts/Debts';
import Settings from './components/settings/Settings';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/" 
                element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    <Layout>
                      <Dashboard />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  user ? (
                    <Layout>
                      <Transactions />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/savings" 
                element={
                  user ? (
                    <Layout>
                      <Savings />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/debts" 
                element={
                  user ? (
                    <Layout>
                      <Debts />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/settings" 
                element={
                  user ? (
                    <Layout>
                      <Settings />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 