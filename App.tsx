import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role } from './types';
import { mockLogin } from './services/db';
import { Layout } from './components/Layout';
import { AdminDashboard } from './views/AdminDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { MarksEntry } from './views/MarksEntry';
import { StudentPortal } from './views/StudentPortal';
import { SplashScreen } from './components/SplashScreen';
import { GraduationCap, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to access the EDU KE portal</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Portal</p>
          
          <button 
            onClick={() => login(Role.ADMIN)} 
            className="group flex items-center justify-between p-5 bg-white border border-slate-200 hover:border-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
          >
            <div className="text-left">
              <span className="font-bold text-slate-800 block text-lg group-hover:text-blue-600 transition-colors">Administration</span>
              <span className="text-sm text-slate-500">Principal & Admin Access</span>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
          </button>

          <button 
            onClick={() => login(Role.TEACHER)} 
            className="group flex items-center justify-between p-5 bg-white border border-slate-200 hover:border-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
          >
             <div className="text-left">
               <span className="font-bold text-slate-800 block text-lg group-hover:text-blue-600 transition-colors">Teacher Portal</span>
               <span className="text-sm text-slate-500">Manage Classes & Marks</span>
             </div>
             <ArrowRight className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
          </button>

          <button 
            onClick={() => login(Role.STUDENT)} 
            className="group flex items-center justify-between p-5 bg-white border border-slate-200 hover:border-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
          >
             <div className="text-left">
               <span className="font-bold text-slate-800 block text-lg group-hover:text-blue-600 transition-colors">Student & Parent</span>
               <span className="text-sm text-slate-500">View Results & Reports</span>
             </div>
             <ArrowRight className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
          </button>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">© 2025 EDU KE. Secure Access Required.</p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles?: Role[] }>) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if trying to access unauthorized area
    if (user.role === Role.ADMIN) return <Navigate to="/admin" />;
    if (user.role === Role.TEACHER) return <Navigate to="/teacher" />;
    return <Navigate to="/student" />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading and splash screen display
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const login = (role: Role) => {
    const userData = mockLogin(role);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
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
  );
};

export default App;