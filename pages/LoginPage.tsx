
import React, { useState } from 'react';
import { User, UserRole } from '../app/types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@servicelog.pl');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@servicelog.pl' && password === 'password123') {
      const mockUser: User = {
        id: 'u1', email: 'admin@servicelog.pl', name: 'Jan Kowalski', role: UserRole.ADMIN, companyId: 'c1', createdAt: new Date()
      };
      localStorage.setItem('servicelog_auth', JSON.stringify(mockUser));
      onLogin(mockUser);
    } else {
      setError('Błędne dane logowania.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4 text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ServiceLog</h1>
          <p className="text-slate-500 mt-2 font-medium">Zarządzanie serwisem stało się proste.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 ring-1 ring-slate-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Adres e-mail</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hasło</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-rose-500 text-sm font-medium animate-pulse">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              Zaloguj się
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Konto administratora: <span className="font-semibold text-indigo-600">admin@servicelog.pl</span> (hasło: <span className="font-semibold text-indigo-600">password123</span>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
