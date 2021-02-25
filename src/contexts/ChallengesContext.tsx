import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
   type: 'body' | 'eye';
   description: string;
   amount: number;
}

interface ChallengesContextData {
   level: number;
   currentExperience: number;
   challengesCompleted: number;
   experienceToNextLevel: number;
   activeChallenge: Challenge;
   levelUp: () => void;
   startNewChallenge: () => void;
   resetChallenge: () => void;
   completeChallenge: () => void;
}
interface ChallengesProviderProps {
   children: ReactNode;
}
export const ChallengesContext = createContext({} as ChallengesContextData);
export function ChallengesProvider({ children }: ChallengesProviderProps) {
   const [level, setLevel] = useState(1)
   const [currentExperience, setCurrentExperience] = useState(0)
   const [challengesCompleted, setChallengesCompleted] = useState(0)
   const [activeChallenge, setActiveChalenge] = useState(null);

   const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

   useEffect(() => {
      Notification.requestPermission()
   }, [])

   function levelUp() {
      setLevel(level + 1)
   }
   function startNewChallenge() {
      const randomchallengeIndex = Math.floor(Math.random() * challenges.length)
      const challenge = challenges[randomchallengeIndex];

      setActiveChalenge(challenge);
      new Audio('/notification.mp3').play();
      if (Notification.permission === 'granted') {
         new Notification('Novo desafio 🎉', {
            body: `Valendo ${challenge.amount} xp!`
         })
      }

   }

   function resetChallenge() {
      setActiveChalenge(null);
   }
   function completeChallenge() {
      if (!activeChallenge) {
         return;
      }
      const { amount } = activeChallenge;
      let finalExperience = currentExperience + amount;
      if (finalExperience >= experienceToNextLevel) {
         finalExperience = finalExperience - experienceToNextLevel;
         levelUp();
      }
      setCurrentExperience(finalExperience);
      setActiveChalenge(null);
      setChallengesCompleted(challengesCompleted + 1);

   }
   return (
      <ChallengesContext.Provider
         value={{
            level,
            currentExperience,
            experienceToNextLevel,
            challengesCompleted,
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            completeChallenge,
         }}>
         {children}
      </ChallengesContext.Provider>
   );
}