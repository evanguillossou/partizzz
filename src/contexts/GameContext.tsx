
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameMode, GameSession, FeedbackRating } from '../types/game';
import { RelationshipData } from '../types/relationships';

interface GameContextType {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  currentMode: GameMode | null;
  setCurrentMode: (mode: GameMode) => void;
  gameSession: GameSession | null;
  setGameSession: (session: GameSession) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  feedback: FeedbackRating | null;
  setFeedback: (rating: FeedbackRating) => void;
  relationships: RelationshipData;
  setRelationships: (relationships: RelationshipData) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [feedback, setFeedback] = useState<FeedbackRating | null>(null);
  const [relationships, setRelationships] = useState<RelationshipData>({});

  const resetGame = () => {
    setPlayers([]);
    setCurrentMode(null);
    setGameSession(null);
    setCurrentScreen('home');
    setFeedback(null);
    setRelationships({});
  };

  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      currentMode,
      setCurrentMode,
      gameSession,
      setGameSession,
      currentScreen,
      setCurrentScreen,
      feedback,
      setFeedback,
      relationships,
      setRelationships,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
