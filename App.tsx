
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ClientsPage from './pages/ClientsPage.tsx';
import WorkOrdersPage from './pages/WorkOrdersPage.tsx';
import ServiceReportsPage from './pages/ServiceReportsPage.tsx';
import Layout from './components/Layout.tsx';
import { User } from './app/types.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('servicelog_auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={setUser} />} 
        />
        
        <Route element={user ? <Layout user={user} setUser={setUser} /> : <Navigate to="/login" />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/service-reports" element={<ServiceReportsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
