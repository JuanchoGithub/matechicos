
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Corrected: Will be content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ConvertirSumarCapacidadMlExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface TermTemplate {
  itemName: string;
  litersRange: [number, number];
  millilitersRange: [number, number];
}

interface ProblemTemplate {
  id: string;
  term1: TermTemplate;
  term2: TermTemplate;
  containerName: string;
  emoji?: string;
}

interface TermDetail {
  itemName: string;
  liters: number;
  milliliters: number;
  descriptiveText: string;
  totalMl: number;
}

interface CurrentChallenge {
  term1: TermDetail;
  term2: TermDetail;
  containerName: string;
  problemFullText: string;
  correctAnswer: number; 
  emoji: string;
}

const FACE_EMOJIS = ['🫗', '💧', '🌊', '🚰', '🥤', '🪣', '🧴', '🤔', '🧐', '💡'];
const DEFAULT_EMOJI = '💧';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatTermDescription = (liters: number, milliliters: number): string => {
  if (liters > 0 && milliliters > 0) {
    return `${liters} litro${liters !== 1 ? 's' : ''} y ${milliliters} ml`;
  } else if (liters > 0) {
    return `${liters} litro${liters !== 1 ? 's' : ''}`;
  } else if (milliliters > 0) {
    return `${milliliters} ml`;
  }
  return "0 ml"; 
};

export const ConvertirSumarCapacidadMlExercise: React.FC<ConvertirSumarCapacidadMlExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [availableProblems, setAvailableProblems] = useState<ProblemTemplate[]>([]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { problems = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (problems.length > 0) {
      setAvailableProblems(shuffleArray([...problems as ProblemTemplate[]]));
    }
  }, [problems]);
  
  const generateNewChallenge = useCallback(() => {
    let problemPool = availableProblems;
    if (problemPool.length === 0 && (problems as ProblemTemplate[]).length > 0) {
        problemPool = shuffleArray([...problems as ProblemTemplate[]]);
        setAvailableProblems(problemPool);
    }
    if (problemPool.length === 0) {
        // Scaffold handles overall completion via stars, but we signal success for the last internal attempt.
        // This allows the scaffold to potentially trigger the final "congrats" message.
        // No need to call onAttempt(true) here as the last verifyAnswer would have done it.
        // The scaffold will not advance if all stars are met.
        showFeedback({type: 'congrats', message: '¡Todos los desafíos de este tipo completados!'});
        return;
    }

    const selectedTemplate = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));

    const generateTermDetail = (termTemplate: TermTemplate): TermDetail => {
      let liters = getRandomIntInRange(termTemplate.litersRange[0], termTemplate.litersRange[1]);
      let milliliters = getRandomIntInRange(termTemplate.millilitersRange[0], termTemplate.millilitersRange[1]);
      if (liters === 0 && milliliters === 0 && (termTemplate.litersRange[1] > 0 || termTemplate.millilitersRange[1] > 0)) { 
        if(termTemplate.millilitersRange[1] > 0) milliliters = getRandomIntInRange(1, termTemplate.millilitersRange[1]);
        else if(termTemplate.litersRange[1] > 0) liters = getRandomIntInRange(1, termTemplate.litersRange[1]);
      }
      return { itemName: termTemplate.itemName, liters, milliliters, descriptiveText: formatTermDescription(liters, milliliters), totalMl: liters * 1000 + milliliters };
    };

    const term1Detail = generateTermDetail(selectedTemplate.term1);
    const term2Detail = generateTermDetail(selectedTemplate.term2);
    const correctAnswer = term1Detail.totalMl + term2Detail.totalMl;
    const problemFullText = `En ${term1Detail.itemName} hay ${term1Detail.descriptiveText}. En ${term2Detail.itemName} hay ${term2Detail.descriptiveText}. Si combinas todo el líquido en ${selectedTemplate.containerName}, ¿cuántos mililitros tendrás en total?`;
    const emoji = selectedTemplate.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)] || DEFAULT_EMOJI;

    setCurrentChallenge({ term1: term1Detail, term2: term2Detail, containerName: selectedTemplate.containerName, problemFullText, correctAnswer, emoji });
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
  }, [availableProblems, problems, showFeedback]);

  useEffect(() => {
    if ((problems as ProblemTemplate[]).length > 0 && !currentChallenge) { 
        generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignalRef.current) {
        generateNewChallenge();
        previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Suma correcta!' });
      // Scaffold handles advancement via signal or completion.
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. Revisa las conversiones y tu suma.' });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 6 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentChallenge.emoji}
          </div>
           <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-lg p-3" direction="left">
            ¡A convertir y sumar!
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-md sm:text-lg text-slate-700 p-4 bg-lime-50 border border-lime-200 rounded-lg shadow-sm min-h-[100px] flex items-center">
          {currentChallenge.problemFullText}
        </p>
        <div
          className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada en mililitros: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-2">ml</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
