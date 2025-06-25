
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CompararAlturasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type HeightComparisonOption = 'A_MAS_ALTO' | 'B_MAS_ALTO' | 'IGUAL_ALTURA';

interface HeightChallenge {
  visualA: string; 
  labelA: string;
  visualB: string;
  labelB: string;
  correctAnswer: HeightComparisonOption;
}

const CHARACTER_EMOJIS_ALTURA = ['📏', '🤔', '🧐', '🦒', '🧍', '🌳'];
const OPTION_IDS: HeightComparisonOption[] = ['A_MAS_ALTO', 'B_MAS_ALTO', 'IGUAL_ALTURA'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompararAlturasExercise: React.FC<CompararAlturasExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<HeightChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<HeightComparisonOption | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_ALTURA[0]);
  const [availableChallenges, setAvailableChallenges] = useState<HeightChallenge[]>([]);

  const { totalStars: totalStarsFromData = 5, challenges = [] } = exercise.data || {};
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
      setCharacterEmoji(CHARACTER_EMOJIS_ALTURA[Math.floor(Math.random() * CHARACTER_EMOJIS_ALTURA.length)]);
    } else {
      onAttempt(true); // Signal completion of internal challenges
      return;
    }
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
        loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: HeightComparisonOption) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer )) return;
    setIsVerified(true);
    
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    let feedbackMessage = "";
    if (isCorrect) {
      switch (currentChallenge.correctAnswer) {
        case 'A_MAS_ALTO': feedbackMessage = `¡Correcto! ${currentChallenge.labelA} es más alto/a.`; break;
        case 'B_MAS_ALTO': feedbackMessage = `¡Correcto! ${currentChallenge.labelB} es más alto/a.`; break;
        case 'IGUAL_ALTURA': feedbackMessage = `¡Correcto! ${currentChallenge.labelA} y ${currentChallenge.labelB} son de igual altura.`; break;
      }
      showFeedback({ type: 'correct', message: feedbackMessage });
    } else {
      let correctDesc = "";
       switch (currentChallenge.correctAnswer) {
        case 'A_MAS_ALTO': correctDesc = `${currentChallenge.labelA} es más alto/a.`; break;
        case 'B_MAS_ALTO': correctDesc = `${currentChallenge.labelB} es más alto/a.`; break;
        case 'IGUAL_ALTURA': correctDesc = `${currentChallenge.labelA} y ${currentChallenge.labelB} son de igual altura.`; break;
      }
      showFeedback({ type: 'incorrect', message: `Incorrecto. ${correctDesc} ¡Observa bien las alturas!` });
      setTimeout(() => setIsVerified(false), 1500); // Allow retry after incorrect
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const getDynamicOptionLabel = (optionId: HeightComparisonOption, labelA: string, labelB: string): string => {
    switch (optionId) {
        case 'A_MAS_ALTO': return `${labelA} es más alto/a`;
        case 'B_MAS_ALTO': return `${labelB} es más alto/a`;
        case 'IGUAL_ALTURA': return `Son iguales de altos`;
        default: return "Opción inválida";
    }
  };

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { visualA, labelA, visualB, labelB } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || '¿Cuál es más alto, más bajo o son iguales?'}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex justify-around items-end w-full min-h-[150px] sm:min-h-[200px] p-4 bg-slate-100 rounded-lg shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl">{visualA}</span>
            <span className="text-xs text-slate-600 mt-1">{labelA}</span>
          </div>
          <div className="text-3xl text-slate-500 mx-2 sm:mx-4">vs</div>
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-7xl">{visualB}</span>
            <span className="text-xs text-slate-600 mt-1">{labelB}</span>
          </div>
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {OPTION_IDS.map((optId) => {
          const label = getDynamicOptionLabel(optId, currentChallenge.labelA, currentChallenge.labelB);
          const isSelected = selectedOption === optId;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) {
            buttonClass = isVerified && optId === currentChallenge.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' 
                : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          } else if (isVerified) { 
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          return (<button key={optId} onClick={() => handleOptionSelect(optId)} disabled={isVerified && selectedOption === currentChallenge.correctAnswer} className={`w-full p-3 rounded-lg text-center text-sm font-semibold ${buttonClass}`}>{label}</button>);
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
