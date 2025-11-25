import { Student, ExamResult, AttendanceRecord, Role, User } from '../types';
import { CLASSES, SUBJECTS, calculateGrade } from '../constants';

const STORAGE_KEY = 'edu_ke_data_v1';

interface DBState {
  students: Student[];
  results: ExamResult[];
  attendance: AttendanceRecord[];
}

// Initial Mock Data Generation
const generateInitialData = (): DBState => {
  const students: Student[] = [];
  const results: ExamResult[] = [];
  const attendance: AttendanceRecord[] = [];

  CLASSES.forEach(cls => {
    // Generate 15 students per class for demo
    for (let i = 1; i <= 15; i++) {
      const sId = `${cls.id}-s${i}`;
      students.push({
        id: sId,
        name: `Student ${cls.name} ${cls.stream} ${i}`,
        admissionNumber: `${2020 + parseInt(cls.id[1])}0${i}`,
        classId: cls.id,
        stream: cls.stream,
        parentPhone: '0700000000',
        attendanceRate: 95 + Math.floor(Math.random() * 5)
      });

      // Generate results for Term 1
      SUBJECTS.forEach(sub => {
        const score = Math.floor(Math.random() * 60) + 40; // Random score 40-100
        results.push({
          id: `${sId}-${sub.id}-t1`,
          studentId: sId,
          subjectId: sub.id,
          term: 'Term 1',
          score,
          grade: calculateGrade(score)
        });
      });
    }
  });

  return { students, results, attendance };
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

export const mockLogin = (role: Role): User => {
  // Simple mock login based on role selection
  switch (role) {
    case Role.ADMIN:
      return { id: 'admin1', name: 'Principal Jane', role: Role.ADMIN, email: 'admin@school.ke' };
    case Role.TEACHER:
      return { id: 't1', name: 'Mr. Kamau', role: Role.TEACHER, email: 'kamau@school.ke' };
    case Role.STUDENT:
      return { id: 'f1n-s1', name: 'Student One', role: Role.STUDENT, email: 'student@school.ke' };
    case Role.PARENT:
      return { id: 'p1', name: 'Parent One', role: Role.PARENT, email: 'parent@school.ke' };
    default:
      throw new Error('Invalid role');
  }
};
