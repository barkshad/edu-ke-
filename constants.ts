import { Subject, ClassRoom } from './types';

export const TERMS = ['Term 1', 'Term 2', 'Term 3'];
export const CURRENT_YEAR = new Date().getFullYear();

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', code: '101', category: 'Sciences' },
  { id: 'eng', name: 'English', code: '102', category: 'Languages' },
  { id: 'kis', name: 'Kiswahili', code: '103', category: 'Languages' },
  { id: 'chem', name: 'Chemistry', code: '201', category: 'Sciences' },
  { id: 'bio', name: 'Biology', code: '202', category: 'Sciences' },
  { id: 'phy', name: 'Physics', code: '203', category: 'Sciences' },
  { id: 'hist', name: 'History', code: '301', category: 'Humanities' },
  { id: 'geo', name: 'Geography', code: '302', category: 'Humanities' },
  { id: 'cre', name: 'C.R.E', code: '303', category: 'Humanities' },
  { id: 'biz', name: 'Business Studies', code: '401', category: 'Technical' },
];

export const CLASSES: ClassRoom[] = [
  { id: 'f1n', name: 'Form 1', stream: 'North', teacherId: 't1' },
  { id: 'f1s', name: 'Form 1', stream: 'South', teacherId: 't2' },
  { id: 'f2n', name: 'Form 2', stream: 'North', teacherId: 't3' },
  { id: 'f2s', name: 'Form 2', stream: 'South', teacherId: 't4' },
  { id: 'f3n', name: 'Form 3', stream: 'North', teacherId: 't5' },
  { id: 'f4n', name: 'Form 4', stream: 'North', teacherId: 't6' },
];

export const GRADING_SYSTEM = [
  { min: 80, grade: 'A', points: 12 },
  { min: 75, grade: 'A-', points: 11 },
  { min: 70, grade: 'B+', points: 10 },
  { min: 65, grade: 'B', points: 9 },
  { min: 60, grade: 'B-', points: 8 },
  { min: 55, grade: 'C+', points: 7 },
  { min: 50, grade: 'C', points: 6 },
  { min: 45, grade: 'C-', points: 5 },
  { min: 40, grade: 'D+', points: 4 },
  { min: 35, grade: 'D', points: 3 },
  { min: 30, grade: 'D-', points: 2 },
  { min: 0, grade: 'E', points: 1 },
];

export const calculateGrade = (score: number) => {
  const grade = GRADING_SYSTEM.find(g => score >= g.min);
  return grade ? grade.grade : 'E';
};
