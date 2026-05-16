export interface RewrittenBullet {
  before: string;
  after: string;
}

export interface AnalysisResult {
  atsScore: number;
  readabilityScore: number;
  technicalClarity: number;
  roast: string;
  atsIssues: string[];
  suggestions: string[];
  rewrittenBullets: RewrittenBullet[];
  finalVerdict: string;
}

export interface JobMatchResult {
  matchScore: number;
  missingKeywords: string[];
  strongMatches: string[];
  improvements: string[];
}

export interface InterviewQuestion {
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'culture' | 'closing';
  difficulty: 'easy' | 'medium' | 'hard';
  idealAnswer: string;
}

export interface SalaryInsight {
  estimatedRange: { min: number; max: number; currency: string };
  level: 'entry' | 'mid' | 'senior';
  topHiringCities: string[];
  salaryBoostSkills: string[];
}

export interface TrackedJob {
  id: string;
  company: string;
  title: string;
  url: string;
  dateApplied: string;
  notes: string;
  salary: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
}

export interface RoastHistoryEntry {
  date: number;
  atsScore: number;
  readabilityScore: number;
  technicalClarity: number;
  roast: string;
  finalVerdict: string;
}
