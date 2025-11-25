import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { CLASSES } from '../constants';
import { getStudentsByClass, getClassAverage } from '../services/db';
import { Button, Badge } from '../components/Widgets';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const myClasses = CLASSES.filter(c => c.stream === 'North');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Classroom</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage assignments, grading, and attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls) => {
          const studentCount = getStudentsByClass(cls.id).length;
          const avg = getClassAverage(cls.id, 'Term 1');
          
          return (
            <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{cls.name}</h3>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{cls.stream} Stream</span>
                  </div>
                  <Badge color={avg > 60 ? 'green' : 'yellow'}>Mean: {avg}</Badge>
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-4">
                  <div className="flex items-center gap-1"><Users size={16} /> {studentCount}</div>
                  <div className="flex items-center gap-1"><BookOpen size={16} /> 8 Subjects</div>
                </div>
              </div>
              
              <div className="p-5 grid grid-cols-2 gap-3">
                <Button 
                  variant="primary" 
                  className="w-full text-sm py-2.5"
                  onClick={() => navigate(`/marks?class=${cls.id}`)}
                >
                  <FileText size={16} /> Enter Marks
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full text-sm py-2.5"
                  onClick={() => navigate(`/classes/${cls.id}`)}
                >
                   Analytics <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Quick Action: Add Assignment */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600">
             <BookOpen size={24} />
          </div>
          <span className="font-medium">New Assignment</span>
        </div>
      </div>
      
      {/* Teacher Schedule Snippet */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
        <div className="z-10 relative max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-blue-200 uppercase text-xs font-bold tracking-wider">
            <Clock size={14} /> Upcoming Deadline
          </div>
          <h2 className="text-2xl font-bold mb-3">Term 2 Examination Period</h2>
          <p className="text-blue-100/80 mb-6 leading-relaxed">
            Final grades must be submitted by Friday, 14th July. Ensure all Continuous Assessment Tests (CATs) are properly recorded before the portal locks.
          </p>
          <Button className="bg-white text-blue-900 hover:bg-blue-50 border-none">View Exam Schedule</Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};