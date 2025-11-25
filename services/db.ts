import { Student, ExamResult, AttendanceRecord, Role, User, Notification, FeeRecord } from '../types';
import { CLASSES, SUBJECTS, calculateGrade, TERMS } from '../constants';

const STORAGE_KEY = 'edu_ke_data_v2'; // Bump version to force new schema

interface DBState {
  students: Student[];
  results: ExamResult[];
  attendance: AttendanceRecord[];
  notifications: Notification[];
  fees: FeeRecord[];
}

const generateInitialData = (): DBState => {
  const students: Student[] = [];
  const results: ExamResult[] = [];
  const attendance: AttendanceRecord[] = [];
  const notifications: Notification[] = [];
  const fees: FeeRecord[] = [];

  const terms = ['Term 1', 'Term 2', 'Term 3'];

  CLASSES.forEach(cls => {
    for (let i = 1; i <= 15; i++) {
      const sId = `${cls.id}-s${i}`;
      const gender = Math.random() > 0.5 ? 'M' : 'F';
      const feesTotal = 45000;
      const feesPaid = Math.floor(Math.random() * feesTotal);
      
      students.push({
        id: sId,
        name: `Student ${cls.name} ${cls.stream} ${i}`,
        admissionNumber: `${2020 + parseInt(cls.id[1])}0${i}`,
        classId: cls.id,
        stream: cls.stream,
        gender,
        parentName: `Parent of ${i}`,
        parentPhone: '0700000000',
        attendanceRate: 90 + Math.floor(Math.random() * 10),
        feesPaid,
        feesTotal,
        dob: '2008-01-01'
      });

      // Generate results for multiple terms for trend analysis
      terms.forEach(term => {
         // Skip Term 3 for current year to simulate ongoing year
         if (term === 'Term 3') return;

         SUBJECTS.forEach(sub => {
          const baseScore = Math.floor(Math.random() * 40) + 40; 
          // Add some variance based on student ID to simulate consistency
          const consistency = (i % 3) * 5; 
          const score = Math.min(100, baseScore + consistency);
          
          results.push({
            id: `${sId}-${sub.id}-${term}`,
            studentId: sId,
            subjectId: sub.id,
            term: term,
            score,
            grade: calculateGrade(score),
            date: new Date().toISOString()
          });
        });
      });

      // Generate some fee records
      fees.push({
        id: `fee-${sId}-1`,
        studentId: sId,
        amount: Math.floor(feesPaid / 2),
        type: 'Tuition',
        date: '2024-01-10',
        status: 'Paid'
      });
    }
  });

  // Sample Notifications
  notifications.push({
    id: 'n1',
    userId: 'admin1',
    title: 'Low Attendance Alert',
    message: 'Form 2 North attendance has dropped by 5% this week.',
    type: 'alert',
    date: new Date().toISOString(),
    read: false
  });
  notifications.push({
    id: 'n2',
    userId: 't1',
    title: 'Marks Submission',
    message: 'Deadline for Term 2 marks is Friday.',
    type: 'warning',
    date: new Date().toISOString(),
    read: false
  });

  return { students, results, attendance, notifications, fees };
};

export const getDB = (): DBState => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = generateInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveDB = (state: DBState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getStudentsByClass = (classId: string) => {
  const db = getDB();
  return db.students.filter(s => s.classId === classId);
};

export const getStudentResults = (studentId: string) => {
  const db = getDB();
  return db.results.filter(r => r.studentId === studentId);
};

export const saveResult = (result: ExamResult) => {
  const db = getDB();
  const existingIndex = db.results.findIndex(r => r.studentId === result.studentId && r.subjectId === result.subjectId && r.term === result.term);
  if (existingIndex >= 0) {
    db.results[existingIndex] = result;
  } else {
    db.results.push(result);
  }
  saveDB(db);
};

export const getClassAverage = (classId: string, term: string, subjectId?: string) => {
  const db = getDB();
  const classStudents = db.students.filter(s => s.classId === classId).map(s => s.id);
  const relevantResults = db.results.filter(r => 
    classStudents.includes(r.studentId) && 
    r.term === term &&
    (!subjectId || r.subjectId === subjectId)
  );

  if (relevantResults.length === 0) return 0;
  const total = relevantResults.reduce((sum, r) => sum + r.score, 0);
  return Math.round(total / relevantResults.length);
};

// Advanced Analytics Helpers
export const getStudentsAtRisk = () => {
  const db = getDB();
  // Simple logic: Average score < 40 or Attendance < 80%
  return db.students.filter(s => {
    const studentResults = db.results.filter(r => r.studentId === s.id && r.term === 'Term 1');
    const avg = studentResults.reduce((a, b) => a + b.score, 0) / (studentResults.length || 1);
    return avg < 40 || s.attendanceRate < 85;
  });
};

export const mockLogin = (role: Role): User => {
  switch (role) {
    case Role.ADMIN:
      return { id: 'admin1', name: 'Principal Jane', role: Role.ADMIN, email: 'admin@school.ke', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe' };
    case Role.TEACHER:
      return { id: 't1', name: 'Mr. Kamau', role: Role.TEACHER, email: 'kamau@school.ke', avatar: 'https://ui-avatars.com/api/?name=Mr+Kamau' };
    case Role.STUDENT:
      return { id: 'f1n-s1', name: 'Student One', role: Role.STUDENT, email: 'student@school.ke' };
    case Role.PARENT:
      return { id: 'p1', name: 'Parent One', role: Role.PARENT, email: 'parent@school.ke' };
    default:
      throw new Error('Invalid role');
  }
};