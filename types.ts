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
  classId: string; // e.g., "form-1-a"
  stream: string;  // e.g., "North"
  parentPhone: string;
  attendanceRate: number; // 0-100
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
  term: string; // "Term 1 2024"
  score: number;
  grade: string;
}

export interface ClassRoom {
  id: string;
  name: string; // "Form 1"
  stream: string; // "North"
  teacherId: string; // Class teacher
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface DashboardStats {
  totalStudents: number;
  averagePerformance: number;
  attendanceRate: number;
  topClass: string;
}
