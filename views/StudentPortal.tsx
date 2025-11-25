import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, Download, Calendar } from 'lucide-react';
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

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      const db = getDB();
      // In a real app, we'd look up by user.id mapping. 
      // Here we assume user.id matches student.id for the mock login
      const s = db.students.find(stu => stu.id === user.id);
      if (s) {
        setStudent(s);
        const r = getStudentResults(s.id).filter(res => res.term === 'Term 1');
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

  if (!student) return <div>Loading Profile...</div>;

  const chartData = results.map(r => {
    const sub = SUBJECTS.find(s => s.id === r.subjectId);
    return { name: sub?.code, full: sub?.name, score: r.score };
  });

  const average = Math.round(results.reduce((a, b) => a + b.score, 0) / (results.length || 1));
  const passed = results.filter(r => r.score >= 50).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
            <p className="text-slate-500">Adm: {student.admissionNumber} | {student.classId.toUpperCase()} {student.stream}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAIAnalysis} disabled={loading} variant="primary">
            <Brain size={18} /> {loading ? 'Analyzing...' : 'AI Performance Coach'}
          </Button>
          <Button variant="secondary">
            <Download size={18} /> Report Card
          </Button>
        </div>
      </div>

      {insight && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-xl animate-fade-in shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-indigo-900 font-bold text-lg">
            <Brain className="text-indigo-600" />
            <h3>AI Performance Insights</h3>
          </div>
           <div 
             className="prose prose-indigo max-w-none text-slate-700 text-sm md:text-base leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} 
           />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Term Average" value={`${average}%`} color={average >= 50 ? 'green' : 'red'} icon={Calendar} />
        <StatCard title="Subjects Passed" value={`${passed}/${results.length}`} color="blue" icon={Calendar} />
        <StatCard title="Attendance" value={`${student.attendanceRate}%`} color="orange" icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Subject Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f1f5f9' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Results Detail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 rounded-l-lg">Subject</th>
                  <th className="p-3">Score</th>
                  <th className="p-3 rounded-r-lg">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(r => {
                   const subName = SUBJECTS.find(s => s.id === r.subjectId)?.name;
                   return (
                    <tr key={r.id}>
                      <td className="p-3 font-medium">{subName}</td>
                      <td className="p-3">{r.score}%</td>
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
  );
};
