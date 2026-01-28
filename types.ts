
export enum Grade {
  G5 = '5',
  G6 = '6',
  G7 = '7',
  G8 = '8',
  G9 = '9',
  G10 = '10'
}

export enum Semester {
  S1 = 'الفصل الدراسي الأول',
  S2 = 'الفصل الدراسي الثاني'
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  isCompleted: boolean;
  time: string; // e.g., "16:00"
  isPriority?: boolean;
}

export interface DailySchedule {
  day: string;
  tasks: StudyTask[];
}

export interface SummaryResult {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Notification {
  id: string;
  message: string;
  time: Date;
  isRead: boolean;
}

export interface AppSettings {
  studentName: string;
  defaultStartTime: string;
  notificationsEnabled: boolean;
  reminderInterval: number;
}
