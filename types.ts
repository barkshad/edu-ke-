export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  classId: string;
  stream: string;
  gender: 'M' | 'F';
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  attendanceRate: number;
  feesPaid: number;
  feesTotal: number;
  dob?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'Languages' | 'Sciences' | 'Humanities' | 'Technical';
}

export interface ExamResult {
  id: string;
  studentId: string;
  subjectId: string;
  term: string;
  score: number;
  grade: string;
  date: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  stream: string;
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  date: string;
  read: boolean;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  type: 'Tuition' | 'Transport' | 'Lunch';
  date: string;
  status: 'Paid' | 'Pending';
}