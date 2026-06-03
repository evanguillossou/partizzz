
export type RelationshipLevel = 'stranger' | 'friend' | 'close';

export interface PlayerRelationship {
  fromPlayerId: string;
  toPlayerId: string;
  level: RelationshipLevel;
}

export interface RelationshipData {
  [key: string]: PlayerRelationship[];
}

export const RELATIONSHIP_EMOJIS = {
  stranger: { emoji: '😶‍🌫️👎', label: 'On se connaît à peine' },
  friend: { emoji: '🤝😎', label: 'On se connaît un peu' },
  close: { emoji: '💗🔐', label: 'On est très proches' }
} as const;
