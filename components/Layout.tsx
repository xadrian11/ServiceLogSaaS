
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { User } from '../app/types';

interface LayoutProps {
  user: User;
  setUser: (user: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('servicelog_auth');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { label: 'Pulpit', icon: LayoutDashboard, path: '/' },
    { label: 'Klienci', icon: Users, path: '/clients' },
    { label: 'Zlecenia', icon: ClipboardList, path: '/work-orders' },
    { label: 'Raporty', icon: FileText, path: '/service-reports' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm z-10 print:hidden">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <ShieldCheck size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">ServiceLog</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`mr-4 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-slate-900'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black shadow-sm mr-3">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-widest">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl transition-all"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Wyloguj
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="text-lg font-black tracking-tighter">ServiceLog</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-50 rounded-xl">
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 print:p-0 custom-scroll">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl animate-in slide-in-from-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xl font-black text-indigo-600">ServiceLog</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-5 py-5 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
                >
                  <item.icon className="mr-4 h-6 w-6 opacity-40" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
