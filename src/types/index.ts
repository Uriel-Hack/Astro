export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  course: string;
  avatar?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: Question[];
  createdAt: string;
  isActive: boolean;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'document';
  url: string;
  subject: string;
  uploadDate: string;
  size: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}