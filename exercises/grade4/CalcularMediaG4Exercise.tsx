
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MeanCalculationChallenge } from '../../types';
import { Icons } from '../../components/icons';

interface CalcularMediaG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_MEDIA = ['📊', '🤔', '🧐', '💡', '➕➗', '📈'];

const generateRandomSet = (minSetSize: number, maxSetSize: number, minValue: number, maxValue: number): number[] => {
  const setSize = Math.floor(Math.random() * (maxSetSize - minSetSize + 1)) + minSetSize;
  const numbers: number[] = [];
  for (let i = 0; i < setSize; i++) {
    numbers.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
  }
  // Ensure sum is divisible by setSize for integer mean for simplicity in G4 intro, or allow decimals later.
  // For now, let's allow decimals.
  return numbers;
};

export const CalcularMediaG4Exercise: React.FC<CalcularMediaG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MeanCalculationChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_MEDIA[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minSetSize = 3, maxSetSize = 5, minValue = 1, maxValue = 20 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const numbers = generateRandomSet(minSetSize, maxSetSize, minValue, maxValue);
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = parseFloat((sum / numbers.length).toFixed(2)); // Allow up to 2 decimal places for mean
    setCurrentChallenge({ numbers, correctMean: mean });
    setUserInput(''); showFeedback(null); setIsAttemptPending(false);
    setCharacterEmoji(FACE_EMOJIS_MEDIA[Math.floor(Math.random() * FACE_EMOJIS_MEDIA.length)]);
  }, [minSetSize, maxSetSize, minValue, maxValue, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) generateNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseFloat(userInput.replace(',', '.')); // Allow comma as decimal separator
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    // Compare with a tolerance for floating point issues if allowing decimals
    const isCorrect = Math.abs(userAnswerNum - currentChallenge.correctMean) < 0.01;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Media Correcta!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. La media era ${currentChallenge.correctMean}.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { setUserInput(prev => prev.slice(0, -1)); }
    else if (key === '.' || key === ',') { if (!userInput.includes('.') && !userInput.includes(',')) setUserInput(prev => prev + '.'); }
    else if (userInput.length < 5 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { 
    registerKeypadHandler(handleKeyPress); 
    return () => registerKeypadHandler(null); 
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-md p-2 max-w-[280px]" direction="left">
            Calcula la media (promedio) de estos números:
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-xl sm:text-2xl font-semibold text-slate-700 p-3 bg-slate-100 rounded-md shadow flex flex-wrap justify-center gap-2">
          {currentChallenge.numbers.join(', ')}
        </p>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
