import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role } from './types';
import { mockLogin } from './services/db';
import { Layout } from './components/Layout';
import { AdminDashboard } from './views/AdminDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { MarksEntry } from './views/MarksEntry';
import { StudentPortal } from './views/StudentPortal';
import { GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <GraduationCap size={48} className="text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">EDU KE</h1>
        <p className="text-slate-500 mb-8">School Analytics Platform</p>
        
        <div className="grid grid-cols-1 gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Select Demo Role</p>
          <button 
            onClick={() => login(Role.ADMIN)} 
            className="p-4 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all text-left group"
          >
            <span className="font-bold text-slate-800 block group-hover:text-blue-600">Admin / Principal</span>
            <span className="text-sm text-slate-500">View school-wide analytics</span>
          </button>

          <button 
            onClick={() => login(Role.TEACHER)} 
            className="p-4 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all text-left group"
          >
             <span className="font-bold text-slate-800 block group-hover:text-blue-600">Teacher</span>
             <span className="text-sm text-slate-500">Manage classes & marks</span>
          </button>

          <button 
            onClick={() => login(Role.STUDENT)} 
            className="p-4 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all text-left group"
          >
             <span className="font-bold text-slate-800 block group-hover:text-blue-600">Student / Parent</span>
             <span className="text-sm text-slate-500">View reports & insights</span>
          </button>
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

  // Restore session from local state if needed, but for demo we start at login
  const login = (role: Role) => {
    const userData = mockLogin(role);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

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