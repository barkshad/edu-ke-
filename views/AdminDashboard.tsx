import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { Users, TrendingUp, TrendingDown, AlertTriangle, Download, Wallet, Calendar } from 'lucide-react';
import { StatCard, Button, Heatmap, Badge } from '../components/Widgets';
import { getDB, getClassAverage, getStudentsAtRisk } from '../services/db';
import { TERMS, CLASSES } from '../constants';
import { generateClassInsights } from '../services/gemini';

export const AdminDashboard = () => {
  const [db] = useState(getDB());
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Computed Metrics
  const totalStudents = db.students.length;
  const atRiskStudents = getStudentsAtRisk();
  const avgPerformance = Math.round(db.results.reduce((acc, r) => acc + r.score, 0) / (db.results.length || 1));
  
  // Financial Metrics
  const totalFees = db.students.reduce((acc, s) => acc + s.feesTotal, 0);
  const feesPaid = db.students.reduce((acc, s) => acc + s.feesPaid, 0);
  const collectionRate = Math.round((feesPaid / totalFees) * 100);

  // Prepare chart data
  const classPerformanceData = CLASSES.map(cls => ({
    name: `${cls.name} ${cls.stream}`,
    score: getClassAverage(cls.id, 'Term 1')
  }));

  const generateHeatmapData = () => {
    // Generate 5 weeks of mock data (5 days x 7 columns for UI)
    return Array.from({ length: 5 }, () => 
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 80)
    );
  };

  const handleGenerateInsights = async () => {
    setLoadingAI(true);
    const insight = await generateClassInsights("Whole School", avgPerformance, "Physics", "English");
    setAiInsight(insight);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time insights for {new Date().getFullYear()}</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => window.print()}>
             <Download size={18} /> Export
           </Button>
           <Button onClick={handleGenerateInsights} disabled={loadingAI}>
             {loadingAI ? 'Analyzing...' : 'AI Insights'}
           </Button>
        </div>
      </div>

      {aiInsight && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-6 rounded-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-purple-800 dark:text-purple-300 font-bold">
            <TrendingUp size={20} />
            <h3>Executive AI Summary</h3>
          </div>
          <div className="prose prose-purple dark:prose-invert max-w-none text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: aiInsight.replace(/\n/g, '<br/>') }} />
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Enrollment" 
          value={totalStudents} 
          icon={Users} 
          color="blue" 
          change="+12" 
          trend="up" 
          subtext="vs last term"
        />
        <StatCard 
          title="Mean Score" 
          value={`${avgPerformance}%`} 
          change="+2.4%" 
          trend="up" 
          icon={TrendingUp} 
          color="green" 
          subtext="Target: 65%"
        />
        <StatCard 
          title="Fee Collection" 
          value={`${collectionRate}%`} 
          change="-5%" 
          trend="down" 
          icon={Wallet} 
          color="purple" 
          subtext={`${(feesPaid/1000000).toFixed(1)}M / ${(totalFees/1000000).toFixed(1)}M KES`}
        />
        <StatCard 
          title="Students At Risk" 
          value={atRiskStudents.length} 
          icon={AlertTriangle} 
          color="red" 
          subtext="Needs intervention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Academic Performance Trends</h3>
             <select className="bg-slate-50 dark:bg-slate-700 border-none rounded-lg text-sm p-2 text-slate-600 dark:text-slate-300">
               <option>Term 1 2024</option>
               <option>Term 3 2023</option>
             </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={classPerformanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Heatmap */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Attendance Intensity</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Visualizing daily attendance rates over the last 5 weeks.</p>
          <Heatmap data={generateHeatmapData()} />
          <div className="flex justify-between text-xs text-slate-400 mt-4">
             <span>Less</span>
             <span>More</span>
          </div>
        </div>
      </div>

      {/* At Risk Students Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> 
            Students Requiring Attention
          </h3>
          <Button variant="outline" className="text-sm py-1">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-medium">Student Info</th>
                <th className="p-4 font-medium">Class</th>
                <th className="p-4 font-medium">Avg. Score</th>
                <th className="p-4 font-medium">Attendance</th>
                <th className="p-4 font-medium">Fees</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {atRiskStudents.slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.admissionNumber}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{s.classId.toUpperCase()}</td>
                  <td className="p-4">
                     <span className="font-bold text-red-600 dark:text-red-400">38%</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{s.attendanceRate}%</td>
                  <td className="p-4">
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {(s.feesTotal - s.feesPaid).toLocaleString()} KES due
                    </span>
                  </td>
                  <td className="p-4"><Badge color="red">Critical</Badge></td>
                </tr>
              ))}
              {atRiskStudents.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No students currently at risk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};