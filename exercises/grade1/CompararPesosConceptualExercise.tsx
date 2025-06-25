
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CompararPesosConceptualExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type WeightComparisonOption = 'A_MAS_PESADO' | 'B_MAS_PESADO'; 

interface WeightChallenge {
  visualA: string; 
  labelA: string;
  visualB: string;
  labelB: string;
  correctAnswer: WeightComparisonOption;
  questionType: 'MAS_PESADO' | 'MENOS_PESADO';
}

const CHARACTER_EMOJIS_PESO = ['⚖️', '🤔', '🧐', '🐘', '🪶', '🧱'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompararPesosConceptualExercise: React.FC<CompararPesosConceptualExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<WeightChallenge | null>(null);
  const [selectedObjectLabel, setSelectedObjectLabel] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_PESO[0]);
  const [availableChallenges, setAvailableChallenges] = useState<WeightChallenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges.length > 0) {
        challengePool = shuffleArray([...challenges]);
        setAvailableChallenges(challengePool);
    }
    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_PESO[Math.floor(Math.random() * CHARACTER_EMOJIS_PESO.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedObjectLabel(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);


  const handleObjectClick = useCallback((objectLabel: string) => {
    if (isVerified && selectedObjectLabel === (currentChallenge?.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge?.labelB)) return;
    setSelectedObjectLabel(objectLabel); showFeedback(null);
    if (isVerified && selectedObjectLabel !== (currentChallenge?.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge?.labelB)) setIsVerified(false);
  }, [isVerified, selectedObjectLabel, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedObjectLabel || (isVerified && selectedObjectLabel === (currentChallenge.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge.labelB))) return;
    setIsVerified(true);
    let isCorrect = false;
    let correctObjectLabel = "";
    let otherObjectLabel = "";

    if (currentChallenge.questionType === 'MAS_PESADO') {
      isCorrect = (selectedObjectLabel === currentChallenge.labelA && currentChallenge.correctAnswer === 'A_MAS_PESADO') ||
                  (selectedObjectLabel === currentChallenge.labelB && currentChallenge.correctAnswer === 'B_MAS_PESADO');
      correctObjectLabel = currentChallenge.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge.labelB;
      otherObjectLabel = currentChallenge.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelB : currentChallenge.labelA;
    } else { 
       isCorrect = (selectedObjectLabel === currentChallenge.labelA && currentChallenge.correctAnswer === 'B_MAS_PESADO') || 
                  (selectedObjectLabel === currentChallenge.labelB && currentChallenge.correctAnswer === 'A_MAS_PESADO'); 
      correctObjectLabel = currentChallenge.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelB : currentChallenge.labelA; 
      otherObjectLabel = currentChallenge.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge.labelB; 
    }
    
    onAttempt(isCorrect);
    if (isCorrect) {
      const verb = currentChallenge.questionType === 'MAS_PESADO' ? "pesa más que" : "pesa menos que";
      showFeedback({ type: 'correct', message: `¡Correcto! ${correctObjectLabel} ${verb} ${otherObjectLabel}.` });
    } else {
      const verb = currentChallenge.questionType === 'MAS_PESADO' ? "pesa más que" : "pesa menos que";
      showFeedback({ type: 'incorrect', message: `Incorrecto. ${correctObjectLabel} ${verb} ${otherObjectLabel}. ¡Inténtalo de nuevo!` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedObjectLabel, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { visualA, labelA, visualB, labelB, questionType } = currentChallenge;
    const questionText = questionType === 'MAS_PESADO' ? '¿Cuál pesa más?' : '¿Cuál pesa menos?';
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{questionText}</Icons.SpeechBubbleIcon>
        </div>
        <div className="flex justify-around items-center w-full min-h-[120px] p-4">
          {[ {visual: visualA, label: labelA}, {visual: visualB, label: labelB} ].map(item => (
            <button key={item.label} onClick={() => handleObjectClick(item.label)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-150
                                ${selectedObjectLabel === item.label ? 'bg-sky-200 ring-2 ring-sky-500 scale-105' : 'hover:bg-slate-100'}`}>
              <span className="text-5xl sm:text-6xl mb-1">{item.visual}</span>
              <span className="text-xs text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => (
    <div className="w-full flex flex-col space-y-2 p-2 mt-8">
      <button onClick={verifyAnswer} disabled={!selectedObjectLabel || (isVerified && selectedObjectLabel === (currentChallenge?.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge?.labelB))} className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedObjectLabel || (isVerified && selectedObjectLabel === (currentChallenge?.correctAnswer === 'A_MAS_PESADO' ? currentChallenge.labelA : currentChallenge?.labelB))) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  ), [selectedObjectLabel, isVerified, verifyAnswer, currentChallenge]);

  useEffect(() => {
    if (setCustomKeypadContent) {
        setCustomKeypadContent(<OptionsKeypad />);
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, OptionsKeypad]);


  return <MainContent />;
};
