
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, DividirDecimalesPorEnteroChallenge } from '../../types';
import { Icons } from '../../components/icons';

interface DividirDecimalesPorEnteroG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_DIV_DEC = ['➗', '🤔', '🧐', '💡', '🔢', '🧮', '🎯'];

// Helper to generate a challenge where the division is exact (terminating decimal)
const generateChallenge = (): DividirDecimalesPorEnteroChallenge => {
    // Generate an integer divisor first
    const divisor = Math.floor(Math.random() * 8) + 2; // Divisor from 2 to 9

    // Generate a random decimal result (the quotient)
    const decimalPlacesResult = Math.random() < 0.5 ? 1 : 2; // 1 or 2 decimal places in the answer
    const randomResult = parseFloat((Math.random() * 10).toFixed(decimalPlacesResult));

    // Calculate the dividend that will produce this exact result
    const dividend = parseFloat((randomResult * divisor).toFixed(4)); // toFixed(4) to handle precision issues

    // The correct result is the quotient we started with
    const correctResult = randomResult;

    return { dividend, divisor, correctResult };
};


export const DividirDecimalesPorEnteroG5Exercise: React.FC<DividirDecimalesPorEnteroG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DividirDecimalesPorEnteroChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_DIV_DEC[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const loadNewChallenge = useCallback(() => {
    setCurrentChallenge(generateChallenge());
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
    setCharacterEmoji(FACE_EMOJIS_DIV_DEC[Math.floor(Math.random() * FACE_EMOJIS_DIV_DEC.length)]);
  }, [showFeedback]);

  useEffect(() => { loadNewChallenge(); }, [loadNewChallenge, exercise.id]);
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    
    const userAnswerNum = parseFloat(userInput.replace(',', '.'));
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    // Compare with a small tolerance for floating point precision issues
    const isCorrect = Math.abs(userAnswerNum - currentChallenge.correctResult) < 0.0001;
    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Resultado Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentChallenge.correctResult}.` });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') {
      verifyAnswer();
      return;
    }
    if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!userInput.includes('.')) {
        setUserInput(prev => prev + key);
      }
    } else if (/\d/.test(key)) {
      if (userInput.length < 8) { // Allow for reasonable length answers
        setUserInput(prev => prev + key);
      }
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);
  
  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-red-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "Resuelve la división:"}
          </Icons.SpeechBubbleIcon>
        </div>
        
        <div className="font-mono text-4xl text-slate-700 p-4 bg-slate-100 rounded-lg shadow-inner">
            {currentChallenge.dividend} ÷ {currentChallenge.divisor}
        </div>

        <div className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_._</span>}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
