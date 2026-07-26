
import React from 'react';
import { GameProvider, useGame } from '../contexts/GameContext';
import AgeGate from '../components/AgeGate';
import HomeScreen from '../components/HomeScreen';
import PlayerEntryScreen from '../components/PlayerEntryScreen';
import PreferencesScreen from '../components/PreferencesScreen';
import RelationshipSkipScreen from '../components/RelationshipSkipScreen';
import RelationshipScreen from '../components/RelationshipScreen';
import RelationshipCompletionScreen from '../components/RelationshipCompletionScreen';
import GameScreen from '../components/GameScreen';
import FeedbackScreen from '../components/FeedbackScreen';
import PaymentScreen from '../components/PaymentScreen';

const GameApp = () => {
  const { currentScreen } = useGame();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'players':
        return <PlayerEntryScreen />;
      case 'preferences':
        return <PreferencesScreen />;
      case 'relationship-skip':
        return <RelationshipSkipScreen />;
      case 'relationships':
        return <RelationshipScreen />;
      case 'completion':
        return <RelationshipCompletionScreen />;
      case 'game':
        return <GameScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'payment':
        return <PaymentScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="font-sans">
      {renderScreen()}
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <AgeGate>
        <GameApp />
      </AgeGate>
    </GameProvider>
  );
};

export default Index;
