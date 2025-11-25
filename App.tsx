import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Role } from './types';
import { mockLogin } from './services/db';
import { Layout } from './components/Layout';
import { AdminDashboard } from './views/AdminDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { MarksEntry } from './views/MarksEntry';
import { StudentPortal } from './views/StudentPortal';
import { SplashScreen } from './components/SplashScreen';
import { GraduationCap, ArrowRight } from 'lucide-react';

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>(null!);
export const useTheme = () => useContext(ThemeContext);

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

// Login Page Component
const Login = () => {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-2xl shadow-lg shadow-blue-500/30">
            <GraduationCap size={40} className="text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400">Sign in to access the Edu KE platform</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Select Account Type</p>
          
          {[
            { role: Role.ADMIN, label: "Administration", sub: "Principal & Admin", color: "hover:border-purple-500 hover:text-purple-600" },
            { role: Role.TEACHER, label: "Teacher Portal", sub: "Class & Marks", color: "hover:border-blue-500 hover:text-blue-600" },
            { role: Role.STUDENT, label: "Student & Parent", sub: "Results & Fees", color: "hover:border-green-500 hover:text-green-600" }
          ].map((item) => (
             <button 
              key={item.role}
              onClick={() => login(item.role)} 
              className={`group flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 ${item.color} hover:shadow-lg rounded-2xl transition-all duration-300`}
            >
              <div className="text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-lg group-hover:text-inherit transition-colors">{item.label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.sub}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <ArrowRight className="text-slate-300 dark:text-slate-400 group-hover:text-inherit transition-colors" size={20} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-700 pt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2025 EDU KE. Secure Access Required.</p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles?: Role[] }>) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === Role.ADMIN) return <Navigate to="/admin" />;
    if (user.role === Role.TEACHER) return <Navigate to="/teacher" />;
    return <Navigate to="/student" />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');

    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (role: Role) => {
    setUser(mockLogin(role));
  };

  const logout = () => setUser(null);

  if (loading) return <SplashScreen />;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={!user ? <Login /> : <Navigate to={
              user.role === Role.ADMIN ? '/admin' : 
              user.role === Role.TEACHER ? '/teacher' : '/student'
            } />} />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={[Role.TEACHER]}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/marks" element={
              <ProtectedRoute allowedRoles={[Role.TEACHER]}>
                <MarksEntry />
              </ProtectedRoute>
            } />

            <Route path="/student" element={
              <ProtectedRoute allowedRoles={[Role.STUDENT, Role.PARENT]}>
                <StudentPortal />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;