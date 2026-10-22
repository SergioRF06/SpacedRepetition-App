export interface Subject {
  id: string;
  title: string;
  color?: string; // Hex color code or tailwind color name
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  interval: number; // días transcurridos, default 1
  nextReviewDate: string; // formato ISO o timestamp, default fecha actual
}

export type ReviewDifficulty = 'hard' | 'good' | 'easy';

export interface ReviewResult {
  interval: number;
  nextReviewDate: string;
}
