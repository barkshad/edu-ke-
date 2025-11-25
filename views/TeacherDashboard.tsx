import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ArrowRight } from 'lucide-react';
import { CLASSES } from '../constants';
import { getStudentsByClass, getClassAverage } from '../services/db';
import { Button, Badge } from '../components/Widgets';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  // Assume logged in teacher manages North stream classes for demo
  const myClasses = CLASSES.filter(c => c.stream === 'North');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Classes</h1>
        <p className="text-slate-500">Manage your assigned streams and marks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls) => {
          const studentCount = getStudentsByClass(cls.id).length;
          const avg = getClassAverage(cls.id, 'Term 1');
          
          return (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{cls.name} <span className="text-slate-500 font-normal">{cls.stream}</span></h3>
                  <Badge color={avg > 60 ? 'green' : 'yellow'}>Mean: {avg}</Badge>
                </div>
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <Users size={16} />
                  <span>{studentCount} Students</span>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-3">
                <Button 
                  variant="primary" 
                  className="w-full text-sm"
                  onClick={() => navigate(`/marks?class=${cls.id}`)}
                >
                  <FileText size={16} /> Enter Marks
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full text-sm"
                  onClick={() => navigate(`/classes/${cls.id}`)}
                >
                   Analytics <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="z-10 relative">
          <h2 className="text-2xl font-bold mb-2">Upcoming Exam Period</h2>
          <p className="text-blue-100 max-w-lg mb-6">
            Term 2 End Exams start in 14 days. Ensure all continuous assessment tests (CATs) are uploaded by Friday.
          </p>
          <Button variant="secondary" className="border-none">View Schedule</Button>
        </div>
        <div className="opacity-10 absolute right-0 bottom-0 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <FileText size={300} />
        </div>
      </div>
    </div>
  );
};
