import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const StatCard = ({ title, value, change, trend, icon: Icon, color = "blue" }: any) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 text-sm">
          {trend === 'up' ? (
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUp size={14} className="mr-1" /> {change}
            </span>
          ) : (
            <span className="flex items-center text-red-500 font-medium">
              <ArrowDown size={14} className="mr-1" /> {change}
            </span>
          )}
          <span className="text-slate-400">vs last term</span>
        </div>
      )}
    </div>
  );
};

export const Button = ({ children, variant = "primary", className = "", ...props }: any) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ children, color = "gray" }: any) => {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-slate-100 text-slate-800",
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};
