
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface AproximarNumerosDecenasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface CurrentChallenge {
  numberToRound: number;
  correctAnswer: number;
}

const FACE_EMOJIS_DECENAS = ['🎯', '🤔', '🧐', '💡', '🤓', '👍', '👌', '💯', '✨', '📏', '🎈'];

export const AproximarNumerosDecenasExercise: React.FC<AproximarNumerosDecenasExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_DECENAS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minNumber = 10, maxNumber = 999 } = exercise.data || {};
  const roundingUnit = 10; 

  // Destructure showFeedback for stable reference in useCallback
  const { showFeedback, advanceToNextChallengeSignal } = scaffoldApi;

  const generateNewChallenge = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const correctAnswer = Math.round(newNumber / roundingUnit) * roundingUnit;

    setCurrentChallenge({
      numberToRound: newNumber,
      correctAnswer: correctAnswer,
    });
    setUserInput('');
    showFeedback(null); // Use stable destructured showFeedback
    setIsAttemptPending(false);
    setCurrentEmoji(FACE_EMOJIS_DECENAS[Math.floor(Math.random() * FACE_EMOJIS_DECENAS.length)]);
  }, [minNumber, maxNumber, roundingUnit, showFeedback]); // Dependency on stable showFeedback

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]); // Runs on mount and if exercise.id changes

  const previousAdvanceSignal = useRef(advanceToNextChallengeSignal);
  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignal.current) {
        generateNewChallenge();
        previousAdvanceSignal.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      scaffoldApi.onAttempt(false); // Use the full scaffoldApi for onAttempt
      setIsAttemptPending(false); 
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto! Bien redondeado.' });
    } else {
      showFeedback({ type: 'incorrect', message: 'No es la decena correcta. Revisa las unidades y prueba de nuevo.' });
      setIsAttemptPending(false); 
    }
  }, [currentChallenge, userInput, showFeedback, scaffoldApi, isAttemptPending]); // Added scaffoldApi for onAttempt

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 4 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null); 
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-28 h-28 flex items-center justify-center text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-lg p-3 max-w-xs" direction="left">
            Redondea a la decena: <strong className="block text-4xl font-bold">{currentChallenge.numberToRound}</strong>
          </Icons.SpeechBubbleIcon>
        </div>

        <div
          className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
