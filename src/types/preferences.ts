
export interface GamePreferences {
  sexualLevel: number; // 0-5
  alcoholLevel: number; // 0-5
  deepQuestions: boolean;
  votes: boolean;
}

export interface CardTags {
  sexualLevel?: number;
  alcoholLevel?: number;
  isDeep?: boolean;
  isVote?: boolean;
}
