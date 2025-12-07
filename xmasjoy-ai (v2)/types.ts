
export interface GiftIdea {
  item: string;
  description: string;
  priceRange: string;
  reason: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export enum AppTab {
  HOME = 'HOME',
  GIFT = 'GIFT',
  GAME = 'GAME',
  LUCKY = 'LUCKY',
  GHOST_LEG = 'GHOST_LEG',
}

export interface LuckyDrawParticipant {
  id: string;
  name: string;
}

export interface LuckyResult {
  winner: LuckyDrawParticipant;
  blessing: string;
}

export interface TruthOrDareItem {
  type: 'TRUTH' | 'DARE';
  content: string;
}

export interface QuickFireItem {
  question: string; // The overall question/topic e.g. "Which is better?"
  optionA: string;
  optionB: string;
}
