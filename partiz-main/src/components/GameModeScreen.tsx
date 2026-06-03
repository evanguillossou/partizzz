
import React from 'react';
import { useGame } from '../contexts/GameContext';

const GameModeScreen = () => {
  const { setCurrentScreen } = useGame();

  React.useEffect(() => {
    // Rediriger automatiquement vers l'écran de préférences
    setCurrentScreen('preferences');
  }, [setCurrentScreen]);

  return null;
};

export default GameModeScreen;
