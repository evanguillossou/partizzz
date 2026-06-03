
import { Player } from '../types/game';
import { RelationshipData, RelationshipLevel, PlayerRelationship } from '../types/relationships';

export const calculateProximityScore = (
  player1Id: string,
  player2Id: string,
  relationships: RelationshipData
): number => {
  const player1Relations = relationships[player1Id] || [];
  const player2Relations = relationships[player2Id] || [];

  const relation1to2 = player1Relations.find(r => r.toPlayerId === player2Id);
  const relation2to1 = player2Relations.find(r => r.toPlayerId === player1Id);

  const levelToScore = {
    stranger: 1,
    friend: 2,
    close: 3
  };

  const score1 = relation1to2 ? levelToScore[relation1to2.level] : 1;
  const score2 = relation2to1 ? levelToScore[relation2to1.level] : 1;

  // Moyenne des deux scores
  return (score1 + score2) / 2;
};

export const getGroupProximityLevel = (
  players: Player[],
  relationships: RelationshipData
): 'low' | 'medium' | 'high' => {
  if (players.length < 2) return 'medium';

  let totalScore = 0;
  let pairCount = 0;

  // Calculer le score moyen de toutes les paires
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const score = calculateProximityScore(players[i].id, players[j].id, relationships);
      totalScore += score;
      pairCount++;
    }
  }

  const averageScore = totalScore / pairCount;

  if (averageScore <= 1.5) return 'low';
  if (averageScore <= 2.5) return 'medium';
  return 'high';
};

export const shouldIncludeCard = (
  cardIntimacyLevel: 'soft' | 'medium' | 'spicy',
  groupProximityLevel: 'low' | 'medium' | 'high'
): boolean => {
  switch (groupProximityLevel) {
    case 'low':
      return cardIntimacyLevel === 'soft';
    case 'medium':
      return cardIntimacyLevel === 'soft' || cardIntimacyLevel === 'medium';
    case 'high':
      return true; // Toutes les cartes
    default:
      return true;
  }
};
