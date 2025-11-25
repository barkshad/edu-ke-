import React from 'react';
import { ArrowUp, ArrowDown, Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

export const StatCard = ({ title, value, change, trend, icon: Icon, color = "blue", subtext }: any) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {(change || subtext) && (
        <div className="flex items-center gap-2 text-sm">
          {change && (
            trend === 'up' ? (
              <span className="flex items-center text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                <ArrowUp size={12} className="mr-1" /> {change}
              </span>
            ) : (
              <span className="flex items-center text-red-500 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-xs">
                <ArrowDown size={12} className="mr-1" /> {change}
              </span>
            )
          )}
          {subtext && <span className="text-slate-400 dark:text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
};

export const Button = ({ children, variant = "primary", className = "", ...props }: any) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
    outline: "border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ children, color = "gray" }: any) => {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
    red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    gray: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600",
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export const Heatmap = ({ data }: { data: number[][] }) => {
  // Simple 5x7 grid mock for weekly attendance
  return (
    <div className="grid grid-cols-7 gap-1">
      {data.flat().map((val, i) => {
        const opacity = val / 100;
        return (
          <div 
            key={i}
            className="w-full aspect-square rounded-sm bg-blue-600 dark:bg-blue-500"
            style={{ opacity: Math.max(0.1, opacity) }}
            title={`Attendance: ${val}%`}
          />
        );
      })}
    </div>
  );
};