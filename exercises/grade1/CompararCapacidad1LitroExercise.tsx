
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CompararCapacidad1LitroExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type CapacityComparisonOption = 'MAS_DE_1L' | 'MENOS_DE_1L' | 'APROX_1L';

interface CapacityChallenge {
  itemEmoji: string;
  itemLabel: string;
  correctAnswer: CapacityComparisonOption;
}

const CHARACTER_EMOJIS_CAPACIDAD = ['💧', '🤔', '🧐', '🍾', '🥤', '🪣'];
const OPTIONS_CAPACIDAD: { id: CapacityComparisonOption; label: string }[] = [
    { id: 'MAS_DE_1L', label: 'Más de 1 Litro' },
    { id: 'APROX_1L', label: 'Aproximadamente 1 Litro' },
    { id: 'MENOS_DE_1L', label: 'Menos de 1 Litro' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompararCapacidad1LitroExercise: React.FC<CompararCapacidad1LitroExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CapacityChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<CapacityComparisonOption | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_CAPACIDAD[0]);
  const [availableChallenges, setAvailableChallenges] = useState<CapacityChallenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = pool[0]; setCurrentChallenge(next); setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_CAPACIDAD[Math.floor(Math.random() * CHARACTER_EMOJIS_CAPACIDAD.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: CapacityComparisonOption) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. Un/a ${currentChallenge.itemLabel.toLowerCase()} tiene ${currentChallenge.correctAnswer.toLowerCase().replace('_', ' ').replace('1l', '1 litro')} de capacidad.` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <div className="p-4 bg-slate-100 rounded-lg shadow-inner flex flex-col items-center">
          <span className="text-6xl sm:text-8xl mb-2">{currentChallenge.itemEmoji}</span>
          <span className="text-lg text-slate-700 font-semibold">{currentChallenge.itemLabel}</span>
        </div>
      </div>
    );
  };
  
  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {OPTIONS_CAPACIDAD.map((opt) => {
          const isSelected = selectedOption === opt.id;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) {
            buttonClass = isVerified && opt.id === currentChallenge.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' 
                : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          } else if (isVerified) { 
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          return (<button key={opt.id} onClick={() => handleOptionSelect(opt.id)} disabled={isVerified && selectedOption === currentChallenge.correctAnswer} className={`w-full p-3 rounded-lg text-center text-sm font-semibold ${buttonClass}`}>{opt.label}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(<OptionsKeypad />);
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
