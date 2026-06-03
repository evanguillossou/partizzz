
export interface Player {
  id: string;
  name: string;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export interface GamePreferences {
  sexualLevel: number; // 0-5
  alcoholLevel: number; // 0-5
  deepQuestions: boolean;
  votes: boolean;
  discovery?: boolean; // Pour les parties à 2
  refMode?: boolean; // Mode "T'as la réf"
}

export interface Card {
  id: string;
  content: string;
  sexualLevel?: number;
  alcoholLevel?: number;
  isDeep?: boolean;
  isVote?: boolean;
  proximityLevel?: 'stranger' | 'friend' | 'close';
  dateMode?: 'no' | 'compatible' | 'exclusive';
  explicitlySexual?: boolean;
  isPremium?: boolean;
  isRef?: boolean;
}

export interface GameSession {
  players: Player[];
  mode?: GameMode;
  preferences?: GamePreferences;
  usedCardIds: string[];
  currentCardIndex: number;
  playerTargetCounts?: Record<string, number>; // Compteur de ciblage par joueur
}

export type FeedbackRating = '🔥' | '😐' | '💤';
