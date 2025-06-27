
import React, { useState, useEffect, useCallback } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface SumarMonedasPesosCentavosExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CoinInCents { value: number; count: number; label: string; }
interface CoinProblemCentavos {
  coins: CoinInCents[];
  emoji?: string;
}
interface CurrentChallengeDataCentavos extends CoinProblemCentavos {
  correctAnswerInCents: number;
}

const FACE_EMOJIS_CENTAVOS = ['💰', '🤑', '🪙', '💵', '🤔', '➕', '🏦', '💡'];
const DEFAULT_COIN_EMOJI_CENTAVOS = '🪙';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatCentsToPesosString = (cents: number): string => {
  const pesos = Math.floor(cents / 100);
  const remainingCents = cents % 100;
  return `${pesos}.${remainingCents < 10 ? '0' : ''}${remainingCents}`;
};

export const SumarMonedasPesosCentavosExercise: React.FC<SumarMonedasPesosCentavosExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallengeDataCentavos | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_COIN_EMOJI_CENTAVOS);
  const [availableProblems, setAvailableProblems] = useState<CoinProblemCentavos[]>([]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { problems = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;

  useEffect(() => {
    if (problems.length > 0) {
      setAvailableProblems(shuffleArray([...problems as CoinProblemCentavos[]]));
    }
  }, [problems]);

  const generateNewChallenge = useCallback(() => {
    let problemPool = availableProblems;
    if (problemPool.length === 0 && (problems as CoinProblemCentavos[]).length > 0) {
        problemPool = shuffleArray([...problems as CoinProblemCentavos[]]);
        setAvailableProblems(problemPool);
    }
    if (problemPool.length === 0) {
        showFeedback({type: 'congrats', message: '¡Todos los desafíos de este tipo completados!'});
        onAttempt(true); // Signal completion if no more problems
        return;
    }

    const selectedProblem = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));
    
    const correctAnswerInCents = selectedProblem.coins.reduce((sum, coin) => sum + (coin.value * coin.count), 0);
    
    setCurrentChallenge({ ...selectedProblem, correctAnswerInCents });
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
    setCurrentEmoji(selectedProblem.emoji || FACE_EMOJIS_CENTAVOS[Math.floor(Math.random() * FACE_EMOJIS_CENTAVOS.length)] || DEFAULT_COIN_EMOJI_CENTAVOS);
  }, [availableProblems, problems, showFeedback, onAttempt]);

  useEffect(() => {
    if ((problems as CoinProblemCentavos[]).length > 0 && !currentChallenge) {
      generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  const previousAdvanceSignal = React.useRef(advanceToNextChallengeSignal);
  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignal.current) {
        generateNewChallenge();
        previousAdvanceSignal.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    
    let userAnswerInCents: number;
    if (userInput.includes('.')) {
        const parts = userInput.split('.');
        const pesos = parseInt(parts[0], 10) || 0;
        const centavos = parseInt((parts[1] || "0").padEnd(2, '0'), 10) || 0; 
        userAnswerInCents = pesos * 100 + centavos;
    } else {
        userAnswerInCents = (parseInt(userInput, 10) || 0) * 100; 
    }

    if (isNaN(userAnswerInCents) && userInput !== "") { // Allow empty input for clearing
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un monto válido (ej: $3.50).' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    const isCorrect = userAnswerInCents === currentChallenge.correctAnswerInCents;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! El total es $${formatCentsToPesosString(currentChallenge.correctAnswerInCents)}.` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. ¡Cuenta con cuidado!' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === 'check') {
      verifyAnswer();
    } else if (key === '.') {
      if (!userInput.includes('.')) { 
        setUserInput(prev => prev + key);
      }
    } else if (/\d/.test(key)) {
      const parts = userInput.split('.');
      if (parts.length === 1 && parts[0].length < 3) { 
        setUserInput(prev => prev + key);
      } else if (parts.length === 2 && parts[1].length < 2) { 
        setUserInput(prev => prev + key);
      } else if (parts.length === 1 && userInput.length < 3 && !userInput.includes('.')) { 
         setUserInput(prev => prev + key);
      }
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando monedas...</div>;
    const coinsDescription = currentChallenge.coins.map(c => `${c.count} x ${c.label}`).join(' y ');

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-sky-500 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            Tienes: <strong className="block text-sm sm:text-base">{coinsDescription}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-xl sm:text-2xl text-slate-700">{exercise.question || "¿Cuántos pesos hay en total?"}</p>
        <div
          className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada en pesos: ${userInput || 'Vacío'}`}
        >
          {userInput ? `$${userInput}` : <span className="text-slate-400">$?.??</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
