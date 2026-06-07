// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Gamification State
  totalXp: number;
  currentLevel: number;
  streakCount: number;
  lastActiveDate: string | null;
  
  // Progress State
  masteredWords: string[]; // Array of Vocabulary IDs
  
  // App State
  activeDifficulty: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Actions
  addXp: (amount: number) => void;
  updateStreak: () => void;
  markAsMastered: (wordId: string) => void;
  setDifficulty: (level: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      totalXp: 0,
      currentLevel: 1,
      streakCount: 0,
      lastActiveDate: null,
      masteredWords: [],
      activeDifficulty: 'ALL',

      addXp: (amount) => set((state) => {
        const newXp = state.totalXp + amount;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        return { totalXp: newXp, currentLevel: newLevel };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastActiveDate === today) return state; // Already active today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutive = state.lastActiveDate === yesterday.toDateString();
        
        return {
          streakCount: isConsecutive ? state.streakCount + 1 : 1,
          lastActiveDate: today,
        };
      }),

      markAsMastered: (wordId) => set((state) => ({
        masteredWords: state.masteredWords.includes(wordId) 
          ? state.masteredWords 
          : [...state.masteredWords, wordId]
      })),
      
      setDifficulty: (level) => set({ activeDifficulty: level }),
    }),
    {
      name: 'german-b1-storage', // Name of the item in localStorage
    }
  )
);