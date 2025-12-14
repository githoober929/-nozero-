export type Category = 'mental' | 'physical' | 'career' | 'health' | 'relationship' | 'skill' | 'other';
export type Effort = 'easy' | 'medium' | 'hard';

export interface DayLog {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  note: string;
  category: Category;
  effort: Effort;
  moodBefore: number; // 1-5
  moodAfter: number; // 1-5
  reflection: string;
  timestamp: number;
}

export interface AppState {
  logs: DayLog[];
  streak: number;
}

export enum MotivationType {
  QUOTE = 'quote',
  TASK = 'task'
}

export interface MotivationResponse {
  text: string;
  type: MotivationType;
}

export interface MonthlyStats {
  totalDays: number;
  mostCommonCategory: string;
  lowEffortCount: number;
  hardestDayNote: string;
  monthName: string;
}
