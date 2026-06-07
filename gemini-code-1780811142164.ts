// src/components/Flashcard.tsx
'use client';

import { useState } from 'react';
import { useStore } from '../store/useStore';

interface VocabularyWord {
  id: string;
  word: string;
  article?: string | null;
  partOfSpeech: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  difficultyLevel: string;
}

interface FlashcardProps {
  card: VocabularyWord;
  onNext: () => void;
}

export default function Flashcard({ card, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Zustand actions
  const addXp = useStore((state) => state.addXp);
  const markAsMastered = useStore((state) => state.markAsMastered);
  const updateStreak = useStore((state) => state.updateStreak);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(card.word);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleReviewLater = () => {
    updateStreak();
    setIsFlipped(false);
    onNext();
  };

  const handleMastered = () => {
    addXp(10);
    markAsMastered(card.id);
    updateStreak();
    setIsFlipped(false);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto perspective-1000">
      
      {/* Flashcard Container */}
      <div 
        className={`relative w-full h-96 transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl backface-hidden border border-gray-200 dark:border-gray-700">
          <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            {card.difficultyLevel}
          </span>
          <button 
            onClick={handleAudio}
            className="absolute top-4 left-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 transition"
          >
            🔊
          </button>
          
          <p className="text-sm text-gray-500 italic mb-2">{card.partOfSpeech}</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {card.article && <span className="text-blue-500 font-normal mr-2">{card.article}</span>}
            {card.word}
          </h2>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-gray-900 rounded-2xl shadow-xl backface-hidden rotate-y-180 border border-blue-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {card.translation}
          </h2>
          <div className="text-center">
            <p className="text-lg text-gray-800 dark:text-gray-300 font-medium mb-2">
              "{card.exampleSentence}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              "{card.exampleTranslation}"
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-4 mt-8 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={handleReviewLater}
          className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition"
        >
          Review Later
        </button>
        <button 
          onClick={handleMastered}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
        >
          Got it! (+10 XP)
        </button>
      </div>

    </div>
  );
}