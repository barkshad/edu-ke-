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
  FileText
} from 'lucide-react';
import { useAuth } from '../App';
import { Role } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  const getNavItems = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/classes', icon: Users, label: 'Classes & Teachers' },
          { to: '/analytics', icon: LineChart, label: 'Analytics' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      case Role.TEACHER:
        return [
          { to: '/teacher', icon: LayoutDashboard, label: 'My Classes' },
          { to: '/marks', icon: FileText, label: 'Enter Marks' },
          { to: '/attendance', icon: Users, label: 'Attendance' },
        ];
      case Role.STUDENT:
      case Role.PARENT:
        return [
          { to: '/student', icon: GraduationCap, label: 'My Performance' },
          { to: '/reports', icon: FileText, label: 'Reports' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-900">
          <GraduationCap className="text-blue-600" />
          EDU KE
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:flex items-center gap-2 font-bold text-2xl text-blue-900 mb-8">
            <GraduationCap className="text-blue-600" size={32} />
            EDU KE
          </div>

          <div className="flex flex-col gap-2 flex-grow">
            {getNavItems().map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};