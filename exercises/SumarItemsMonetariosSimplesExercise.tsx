
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface SumarItemsMonetariosSimplesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

interface MonetaryItem { value: number; count: number; label: string; } // value will now be in cents
interface MonetaryProblem {
  items: MonetaryItem[];
  emoji?: string;
}
interface CurrentChallengeData extends MonetaryProblem {
  correctAnswer: number; // This will store the correct answer in WHOLE PESOS
}

const FACE_EMOJIS_MONEY = ['💰', '🤑', '🪙', '💵', '🤔', '➕', '🏦', '🛍️'];
const DEFAULT_MONEY_EMOJI = '💰';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const SumarItemsMonetariosSimplesExercise: React.FC<SumarItemsMonetariosSimplesExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallengeData | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_MONEY_EMOJI);
  const [availableProblems, setAvailableProblems] = useState<MonetaryProblem[]>([]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { problems = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (problems.length > 0) {
      setAvailableProblems(shuffleArray([...problems as MonetaryProblem[]]));
    }
  }, [problems, exercise.id]); // Added exercise.id to re-init if exercise changes

  const generateNewChallenge = useCallback(() => {
    let problemPool = availableProblems;
    if (problemPool.length === 0 && (problems as MonetaryProblem[]).length > 0) {
        problemPool = shuffleArray([...problems as MonetaryProblem[]]);
        setAvailableProblems(problemPool);
    }
    if (problemPool.length === 0) {
        showFeedback({ type: 'congrats', message: '¡Todos los desafíos de este tipo completados!' });
        // Let scaffold handle completion based on stars
        onAttempt(true); // Signal success for the last "attempt" if pool is empty
        return;
    }

    const selectedProblem = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));
    
    const sumInCents = selectedProblem.items.reduce((sum, item) => sum + (item.value * item.count), 0);
    const correctAnswerInPesos = sumInCents / 100; 
    
    setCurrentChallenge({ ...selectedProblem, correctAnswer: correctAnswerInPesos });
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
    setCurrentEmoji(selectedProblem.emoji || FACE_EMOJIS_MONEY[Math.floor(Math.random() * FACE_EMOJIS_MONEY.length)] || DEFAULT_MONEY_EMOJI);
  }, [availableProblems, problems, showFeedback, onAttempt]);

  useEffect(() => {
    if ((problems as MonetaryProblem[]).length > 0 && !currentChallenge) {
      generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10); 
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! En total son $${currentChallenge.correctAnswer}.` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. ¡Cuenta otra vez!' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 4 && /\d/.test(key)) setUserInput(prev => prev + key); 
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando items...</div>;
    
    const itemsDescription = currentChallenge.items
      .filter(c => c.count > 0) 
      .map(c => `${c.count} ${c.label.startsWith('$') ? 'billete' : 'moneda'}${c.count !== 1 ? 's' : ''} de ${c.label}`)
      .join(' y ');

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            Tienes: <strong className="block text-sm sm:text-base">{itemsDescription}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-xl sm:text-2xl text-slate-700">{exercise.question || "¿Cuántos pesos hay en total?"}</p>
        <div
          className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada en pesos: ${userInput || 'Vacío'}`}
        >
          {userInput ? `$${userInput}` : <span className="text-slate-400">$?</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
