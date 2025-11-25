import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { CLASSES, SUBJECTS, calculateGrade } from '../constants';
import { getStudentsByClass, getDB, saveResult } from '../services/db';
import { Student, ExamResult } from '../types';
import { Button } from '../components/Widgets';

export const MarksEntry = () => {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('class') || CLASSES[0].id;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const classStudents = getStudentsByClass(classId);
    setStudents(classStudents);
    
    // Load existing marks if any
    const db = getDB();
    const currentMarks: Record<string, number> = {};
    classStudents.forEach(s => {
      const result = db.results.find(r => 
        r.studentId === s.id && 
        r.subjectId === selectedSubject && 
        r.term === 'Term 1'
      );
      if (result) currentMarks[s.id] = result.score;
    });
    setMarks(currentMarks);
    setSaved(false);
  }, [classId, selectedSubject]);

  const handleMarkChange = (studentId: string, val: string) => {
    const score = parseInt(val);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      setMarks(prev => ({ ...prev, [studentId]: score }));
      setSaved(false);
    }
  };

  const handleSave = () => {
    students.forEach(s => {
      if (marks[s.id] !== undefined) {
        const result: ExamResult = {
          id: `${s.id}-${selectedSubject}-t1`,
          studentId: s.id,
          subjectId: selectedSubject,
          term: 'Term 1',
          score: marks[s.id],
          grade: calculateGrade(marks[s.id]),
          date: new Date().toISOString()
        };
        saveResult(result);
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cls = CLASSES.find(c => c.id === classId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enter Marks</h1>
          <p className="text-slate-500">{cls?.name} {cls?.stream} - Term 1 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="p-2 border border-slate-300 rounded-lg bg-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button onClick={handleSave} disabled={saved}>
            {saved ? <><CheckCircle size={18}/> Saved</> : <><Save size={18}/> Save Marks</>}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600 w-16">#</th>
              <th className="p-4 font-semibold text-slate-600">Admission</th>
              <th className="p-4 font-semibold text-slate-600">Student Name</th>
              <th className="p-4 font-semibold text-slate-600 w-32">Score (%)</th>
              <th className="p-4 font-semibold text-slate-600 w-24">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, idx) => {
              const score = marks[student.id] || 0;
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500">{idx + 1}</td>
                  <td className="p-4 font-mono text-sm">{student.admissionNumber}</td>
                  <td className="p-4 font-medium text-slate-900">{student.name}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={marks[student.id] ?? ''}
                      onChange={(e) => handleMarkChange(student.id, e.target.value)}
                    />
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${score < 40 ? 'text-red-500' : 'text-slate-700'}`}>
                      {calculateGrade(score)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No students found in this class.
          </div>
        )}
      </div>
    </div>
  );
};