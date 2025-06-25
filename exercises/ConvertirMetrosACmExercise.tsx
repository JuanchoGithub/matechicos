
import React, { useState, useEffect, useCallback } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; 
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface ConvertirMetrosACmExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentChallenge {
  meters: number;
  correctCentimeters: number;
}

const FACE_EMOJIS = ['📏', '📐', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯'];

export const ConvertirMetrosACmExercise: React.FC<ConvertirMetrosACmExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minMeters = 1, maxMeters = 10 } = exercise.data || {};

  const generateNewChallenge = useCallback(() => {
    const meters = Math.floor(Math.random() * (maxMeters - minMeters + 1)) + minMeters;
    const correctCentimeters = meters * 100;

    setCurrentChallenge({
      meters,
      correctCentimeters,
    });
    setUserInput('');
    scaffoldApi.showFeedback(null); 
    setIsAttemptPending(false);
    setCurrentEmoji(FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)]);
  }, [minMeters, maxMeters, scaffoldApi]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      scaffoldApi.onAttempt(false);
      setIsAttemptPending(false); // Allow retry
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctCentimeters;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Correcto! Excelente conversión.' });
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'No es correcto. Recuerda que 1 metro son 100 centímetros.' });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentChallenge, userInput, scaffoldApi, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    scaffoldApi.showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 4 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  },[userInput, verifyAnswer, scaffoldApi, isAttemptPending]);

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
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-lg p-3 max-w-xs" direction="left">
            Convierte: <strong className="block text-3xl font-bold">{currentChallenge.meters}m</strong> a cm
          </Icons.SpeechBubbleIcon>
        </div>
        
        <div 
          className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada en centímetros: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-2">cm</span>}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
