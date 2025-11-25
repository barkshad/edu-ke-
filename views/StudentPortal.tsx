import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Brain, Download, Calendar, Wallet, CheckCircle } from 'lucide-react';
import { useAuth } from '../App';
import { getDB, getStudentResults } from '../services/db';
import { SUBJECTS } from '../constants';
import { generateStudentInsights } from '../services/gemini';
import { Button, StatCard, Badge } from '../components/Widgets';

export const StudentPortal = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'academics' | 'fees'>('academics');

  useEffect(() => {
    if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
      const db = getDB();
      // Mock mapping: assuming user.id matches student.id or linked
      const s = db.students.find(stu => stu.id === user.id || stu.id === 'f1n-s1'); 
      if (s) {
        setStudent(s);
        const r = getStudentResults(s.id);
        setResults(r);
      }
    }
  }, [user]);

  const handleAIAnalysis = async () => {
    if (!student || !results.length) return;
    setLoading(true);
    const text = await generateStudentInsights(student, results);
    setInsight(text);
    setLoading(false);
  };

  if (!student) return <div className="p-8 text-center">Loading Profile...</div>;

  const currentTermResults = results.filter(r => r.term === 'Term 1');
  const chartData = currentTermResults.map(r => {
    const sub = SUBJECTS.find(s => s.id === r.subjectId);
    return { name: sub?.code, full: sub?.name, score: r.score };
  });

  const average = Math.round(currentTermResults.reduce((a, b) => a + b.score, 0) / (currentTermResults.length || 1));
  const feeBalance = student.feesTotal - student.feesPaid;
  const feePercent = Math.round((student.feesPaid / student.feesTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold ring-4 ring-blue-50 dark:ring-blue-900/30">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">Adm: {student.admissionNumber} • {student.classId.toUpperCase()} {student.stream}</p>
            <div className="flex gap-2 mt-2">
               <Badge color="blue">Student</Badge>
               <Badge color={feeBalance === 0 ? 'green' : 'orange'}>{feeBalance === 0 ? 'Fees Cleared' : 'Fees Pending'}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAIAnalysis} disabled={loading} variant="primary" className="shadow-lg shadow-blue-500/20">
            <Brain size={18} /> {loading ? 'Thinking...' : 'AI Tutor'}
          </Button>
          <Button variant="secondary">
            <Download size={18} /> Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-1">
        <button 
          onClick={() => setActiveTab('academics')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'academics' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Academic Performance
          {activeTab === 'academics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'fees' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Fee Statement
          {activeTab === 'fees' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'academics' ? (
        <div className="space-y-6 animate-fade-in">
          {insight && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800 p-6 rounded-2xl shadow-sm">
               <div className="flex items-center gap-2 mb-4 text-indigo-900 dark:text-indigo-300 font-bold text-lg">
                <Brain className="text-indigo-600 dark:text-indigo-400" />
                <h3>Personalized Learning Insights</h3>
              </div>
               <div 
                 className="prose prose-indigo dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} 
               />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Term Mean" value={`${average}%`} color={average >= 50 ? 'green' : 'red'} icon={CheckCircle} subtext="Class Rank: 4th" />
            <StatCard title="Attendance" value={`${student.attendanceRate}%`} color="blue" icon={Calendar} subtext="2 days absent" />
            <StatCard title="Fee Balance" value={`KES ${feeBalance.toLocaleString()}`} color="orange" icon={Wallet} subtext="Due: 30th July" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">Subject Performance</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none' }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f1f5f9', radius: [0, 4, 4, 0] }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Detailed Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="p-3 rounded-l-lg">Subject</th>
                      <th className="p-3">Score</th>
                      <th className="p-3 rounded-r-lg">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {currentTermResults.map(r => {
                       const subName = SUBJECTS.find(s => s.id === r.subjectId)?.name;
                       return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{subName}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{r.score}%</td>
                          <td className="p-3"><Badge color={r.score >= 50 ? 'green' : 'red'}>{r.grade}</Badge></td>
                        </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
           <div className="max-w-md mx-auto">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
               <Wallet size={32} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Fee Statement</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8">
               You have paid <span className="font-bold text-slate-800 dark:text-slate-200">{feePercent}%</span> of the total fees for 2024.
             </p>

             <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
               <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${feePercent}%` }}></div>
             </div>
             <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
               <span>Paid: KES {student.feesPaid.toLocaleString()}</span>
               <span>Total: KES {student.feesTotal.toLocaleString()}</span>
             </div>

             <Button variant="primary" className="w-full py-3">Download Receipt</Button>
           </div>
        </div>
      )}
    </div>
  );
};