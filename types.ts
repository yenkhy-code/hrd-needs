// Add declarations for global libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface SurveyStepData {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export type SurveyAnswers = Record<string, string | string[]>;

export interface SurveyState {
  currentStep: number;
  answers: SurveyAnswers;
  isLoading: boolean;
  error: string | null;
  proposal: Proposal | null;
}

export type SurveyAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: string | string[] } }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: Proposal }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET' };

export interface AddieAnalysis {
  analysis: string;
  design: string;
  development: string;
  implementation: string;
  evaluation: string;
}

export interface Curriculum {
  module: string;
  topics: string[];
  duration: string;
}

export interface TrainingProposal {
  title: string;
  objectives: string[];
  targetAudience: string;
  curriculum: Curriculum[];
  methods: string[];
}

export interface Proposal {
  addieAnalysis: AddieAnalysis;
  trainingProposal: TrainingProposal;
}