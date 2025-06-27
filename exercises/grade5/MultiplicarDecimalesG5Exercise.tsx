
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MultiplicarDecimalesChallenge } from '../../types';
import { Icons } from '../../components/icons';

interface MultiplicarDecimalesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_MULT_DEC = ['✖️', '🤔', '🧐', '💡', '🔢', '🧮', '🎯'];

const generateRandomDecimal = (min: number, max: number, maxPlaces: number): number => {
  const places = Math.floor(Math.random() * (maxPlaces + 1));
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(places));
};

export const MultiplicarDecimalesG5Exercise: React.FC<MultiplicarDecimalesG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MultiplicarDecimalesChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_MULT_DEC[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    minFactor1 = 0.1, maxFactor1 = 99.9, maxDecimalPlaces1 = 2,
    minFactor2 = 0.1, maxFactor2 = 9.9, maxDecimalPlaces2 = 1,
  } = exercise.data || {};

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const factor1 = generateRandomDecimal(minFactor1, maxFactor1, maxDecimalPlaces1);
    const factor2 = generateRandomDecimal(minFactor2, maxFactor2, maxDecimalPlaces2);
    
    const totalDecimalPlaces = (factor1.toString().split('.')[1] || '').length + (factor2.toString().split('.')[1] || '').length;
    const result = parseFloat((factor1 * factor2).toFixed(totalDecimalPlaces));
    
    setCurrentChallenge({ factor1, factor2, correctResult: result });
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
    setCharacterEmoji(FACE_EMOJIS_MULT_DEC[Math.floor(Math.random() * FACE_EMOJIS_MULT_DEC.length)]);
  }, [minFactor1, maxFactor1, maxDecimalPlaces1, minFactor2, maxFactor2, maxDecimalPlaces2, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

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
    
    const f1Str = currentChallenge.factor1.toString();
    const f2Str = currentChallenge.factor2.toString();
    const maxLength = Math.max(f1Str.length, f2Str.length) + 2; // +2 for 'x '

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-red-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "Resuelve la multiplicación:"}
          </Icons.SpeechBubbleIcon>
        </div>
        
        <div className="font-mono text-4xl text-slate-700 p-4 bg-slate-100 rounded-lg shadow-inner">
            <div className="text-right" style={{ width: `${maxLength}ch` }}>{f1Str}</div>
            <div className="text-right" style={{ width: `${maxLength}ch` }}>× {f2Str}</div>
            <hr className="my-2 border-t-2 border-slate-400" />
        </div>

        <div className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_._</span>}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
