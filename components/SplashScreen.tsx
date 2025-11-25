import React from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl relative z-10">
            <GraduationCap size={64} className="text-white" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">EDU KE</h1>
          <p className="text-slate-500 text-lg font-medium tracking-wide">Empowering Kenyan Education</p>
        </div>

        <div className="pt-8">
          <Loader2 className="text-blue-600 animate-spin" size={32} />
        </div>
      </div>
      
      <div className="pb-12 text-center space-y-1">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Developed by</p>
        <p className="text-slate-800 font-bold text-lg">Shadrack & Hakeem</p>
        <p className="text-slate-400 text-xs">© 2025 All Rights Reserved</p>
      </div>
    </div>
  );
};
