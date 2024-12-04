export type FeedbackType = 'text' | 'audio';

export interface Feedback {
  id: string;
  content: string;
  type: FeedbackType;
  timestamp: Date;
  processed: boolean;
}

export interface AIResponse {
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  type: 'feedback' | 'training' | 'question';
  suggestions?: string[];
}