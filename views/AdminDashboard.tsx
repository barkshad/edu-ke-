import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Users, BookOpen, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { StatCard, Button } from '../components/Widgets';
import { getDB, getClassAverage } from '../services/db';
import { TERMS, CLASSES } from '../constants';
import { generateClassInsights } from '../services/gemini';

export const AdminDashboard = () => {
  const [db] = useState(getDB());
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Computed Metrics
  const totalStudents = db.students.length;
  const avgPerformance = Math.round(db.results.reduce((acc, r) => acc + r.score, 0) / (db.results.length || 1));
  
  // Prepare chart data
  const classPerformanceData = CLASSES.map(cls => ({
    name: `${cls.name} ${cls.stream}`,
    score: getClassAverage(cls.id, 'Term 1')
  }));

  const subjectTrendData = TERMS.map(term => ({
    name: term,
    Math: 65 + Math.floor(Math.random() * 10),
    Eng: 70 + Math.floor(Math.random() * 5),
    Sci: 60 + Math.floor(Math.random() * 15),
  }));

  const handleGenerateInsights = async () => {
    setLoadingAI(true);
    // Simulate finding best/weakest for the school
    const insight = await generateClassInsights("Whole School", avgPerformance, "Physics", "English");
    setAiInsight(insight);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Overview</h1>
          <p className="text-slate-500">Welcome back, Principal.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => window.print()}>
             <Download size={18} /> Export Report
           </Button>
           <Button onClick={handleGenerateInsights} disabled={loadingAI}>
             {loadingAI ? 'Analyzing...' : 'Generate AI Insights'}
           </Button>
        </div>
      </div>

      {aiInsight && (
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-purple-800 font-bold">
            <TrendingUp size={20} />
            <h3>AI Executive Summary</h3>
          </div>
          <div className="prose prose-purple max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: aiInsight.replace(/\n/g, '<br/>') }} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={totalStudents} icon={Users} color="blue" />
        <StatCard title="School Mean Score" value={`${avgPerformance}%`} change="+2.4%" trend="up" icon={TrendingUp} color="green" />
        <StatCard title="Attendance Rate" value="94%" change="-1.2%" trend="down" icon={Users} color="orange" />
        <StatCard title="Active Classes" value={CLASSES.length} icon={BookOpen} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Class Performance (Term 1)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subjectTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Math" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Eng" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Sci" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
