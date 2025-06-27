
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CompararLongitudesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type LengthComparisonOption = 'A_MAS_LARGO' | 'B_MAS_LARGO' | 'IGUAL_LARGO';

interface LengthChallenge {
  visualA: string; 
  labelA: string;
  visualB: string;
  labelB: string;
  correctAnswer: LengthComparisonOption;
}

const CHARACTER_EMOJIS_LONGITUD = ['📏', '🤔', '🧐', '🐛', '✏️', '🥖'];
const OPTION_IDS_LONGITUD: LengthComparisonOption[] = ['A_MAS_LARGO', 'B_MAS_LARGO', 'IGUAL_LARGO'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompararLongitudesExercise: React.FC<CompararLongitudesExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<LengthChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<LengthComparisonOption | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_LONGITUD[0]);
  const [availableChallenges, setAvailableChallenges] = useState<LengthChallenge[]>([]);

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
      setCharacterEmoji(CHARACTER_EMOJIS_LONGITUD[Math.floor(Math.random() * CHARACTER_EMOJIS_LONGITUD.length)]);
    } else {
      onAttempt(true);
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

  const handleOptionSelect = useCallback((option: LengthComparisonOption) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    let feedbackMessage = "";
    if (isCorrect) {
      switch (currentChallenge.correctAnswer) {
        case 'A_MAS_LARGO': feedbackMessage = `¡Correcto! ${currentChallenge.labelA} es más largo/a.`; break;
        case 'B_MAS_LARGO': feedbackMessage = `¡Correcto! ${currentChallenge.labelB} es más largo/a.`; break;
        case 'IGUAL_LARGO': feedbackMessage = `¡Correcto! ${currentChallenge.labelA} y ${currentChallenge.labelB} son de igual longitud.`; break;
      }
      showFeedback({ type: 'correct', message: feedbackMessage });
    } else {
      let correctDesc = "";
       switch (currentChallenge.correctAnswer) {
        case 'A_MAS_LARGO': correctDesc = `${currentChallenge.labelA} es más largo/a.`; break;
        case 'B_MAS_LARGO': correctDesc = `${currentChallenge.labelB} es más largo/a.`; break;
        case 'IGUAL_LARGO': correctDesc = `${currentChallenge.labelA} y ${currentChallenge.labelB} son de igual longitud.`; break;
      }
      showFeedback({ type: 'incorrect', message: `Incorrecto. ${correctDesc} ¡Observa bien las longitudes!` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const getDynamicOptionLabel = (optionId: LengthComparisonOption, labelA: string, labelB: string): string => {
    switch (optionId) {
        case 'A_MAS_LARGO': return `${labelA} es más largo/a`;
        case 'B_MAS_LARGO': return `${labelB} es más largo/a`;
        case 'IGUAL_LARGO': return `Son igual de largos`;
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
            {exercise.question || '¿Cuál es más largo, más corto o son iguales?'}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex flex-col items-center space-y-3 w-full p-4 bg-slate-100 rounded-lg shadow-inner">
          <div className="flex items-center w-full">
            <span className="text-4xl sm:text-5xl mr-2">{visualA}</span>
            <span className="text-xs text-slate-600">{labelA}</span>
          </div>
          <div className="text-2xl text-slate-500 my-1">vs</div>
          <div className="flex items-center w-full">
            <span className="text-4xl sm:text-5xl mr-2">{visualB}</span>
            <span className="text-xs text-slate-600">{labelB}</span>
          </div>
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {OPTION_IDS_LONGITUD.map((optId) => {
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
