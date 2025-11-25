import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  LineChart,
  FileText,
  Bell,
  Search,
  Wallet
} from 'lucide-react';
import { useAuth } from '../App';
import { Role } from '../types';
import { ThemeToggle } from './Widgets';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/classes', icon: Users, label: 'Classes' },
          { to: '/finance', icon: Wallet, label: 'Finance' },
          { to: '/analytics', icon: LineChart, label: 'Analytics' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      case Role.TEACHER:
        return [
          { to: '/teacher', icon: LayoutDashboard, label: 'Overview' },
          { to: '/marks', icon: FileText, label: 'Marks Entry' },
          { to: '/attendance', icon: Users, label: 'Attendance' },
        ];
      case Role.STUDENT:
      case Role.PARENT:
        return [
          { to: '/student', icon: GraduationCap, label: 'Performance' },
          { to: '/reports', icon: FileText, label: 'Reports' },
          { to: '/fees', icon: Wallet, label: 'Fee Status' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-between items-center z-30 relative border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <GraduationCap className="text-blue-600" />
          EDU KE
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-600 dark:text-slate-300">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:flex items-center gap-2 font-bold text-2xl text-slate-900 dark:text-white mb-10 tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            EDU KE
          </div>

          <div className="flex flex-col gap-2 flex-grow">
            {getNavItems().map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-auto space-y-4">
             {/* User Profile Snippet */}
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold shrink-0">
                {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" /> : user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Top Bar for Desktop */}
        <header className="hidden md:flex h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for students, classes..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};