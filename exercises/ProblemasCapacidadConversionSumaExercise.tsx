import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Import ExerciseScaffoldProps
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; // Import ExerciseScaffoldApi
import { Icons } from '../components/icons';

interface ProblemasCapacidadConversionSumaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

interface ProblemDetail {
  id: string;
  jarLiters: number;
  jarMilliliters: number;
  glassMilliliters: number;
  numGlasses: number;
  emoji?: string;
}

interface CurrentChallenge extends ProblemDetail {
  problemText: string;
  correctAnswer: number; // Stored in mL
}

const FACE_EMOJIS = ['🥤', '🫙', '🍹', '💧', '🧉', '🍾', '🤔', '🧐', '💡'];
const DEFAULT_EMOJI = '🥤';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const ProblemasCapacidadConversionSumaExercise: React.FC<ProblemasCapacidadConversionSumaExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  // stars and feedback states removed
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [availableProblems, setAvailableProblems] = useState<ProblemDetail[]>([]);

  const { problems = [] } = exercise.data || {};

  useEffect(() => {
    if (problems.length > 0) {
      setAvailableProblems(shuffleArray([...problems]));
    }
  }, [problems]);

  const generateNewChallenge = useCallback(() => {
    let problemPool = availableProblems;
    if (problemPool.length === 0 && problems.length > 0) {
        problemPool = shuffleArray([...problems]);
        setAvailableProblems(problemPool);
    }
    if (problemPool.length === 0) {
        scaffoldApi.onAttempt(true); // Signal completion
        return;
    }

    const selectedProblemDetail = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));

    const { jarLiters, jarMilliliters, glassMilliliters, numGlasses } = selectedProblemDetail;
    
    const totalJarMl = (jarLiters * 1000) + jarMilliliters;
    const totalGlassesMl = numGlasses * glassMilliliters;
    const correctAnswer = totalJarMl + totalGlassesMl;

    let jarDesc = "";
    if (jarLiters > 0 && jarMilliliters > 0) jarDesc = `${jarLiters} litro${jarLiters > 1 ? 's' : ''} y ${jarMilliliters} mililitros`;
    else if (jarLiters > 0) jarDesc = `${jarLiters} litro${jarLiters > 1 ? 's' : ''}`;
    else jarDesc = `${jarMilliliters} mililitros`;

    const problemText = `Una jarra grande contiene ${jarDesc}. Un vaso pequeño tiene una capacidad de ${glassMilliliters} mililitros. Si llenas la jarra grande y además sirves ${numGlasses} vaso${numGlasses > 1 ? 's' : ''} pequeño${numGlasses > 1 ? 's' : ''}, ¿cuántos mililitros tendrás en total?`;
    
    const emoji = selectedProblemDetail.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)] || DEFAULT_EMOJI;

    setCurrentChallenge({ ...selectedProblemDetail, problemText, correctAnswer, emoji });
    setUserInput('');
    scaffoldApi.showFeedback(null);
  }, [availableProblems, problems, scaffoldApi]);

  useEffect(() => {
    if (problems.length > 0 && !currentChallenge) { 
        generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge) return;
    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      scaffoldApi.onAttempt(false);
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Cálculo correcto!' });
      // Scaffold handles advancement or completion
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. Revisa las conversiones y la suma.' });
    }
  }, [currentChallenge, userInput, scaffoldApi]);

  const handleKeyPress = useCallback((key: string) => {
    scaffoldApi.showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 5 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, scaffoldApi]);

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
           <Icons.SpeechBubbleIcon className="bg-purple-500 text-white text-lg p-3" direction="left">
            ¡A calcular!
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-md sm:text-lg text-slate-700 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm min-h-[100px] flex items-center">
          {currentChallenge.problemText}
        </p>
        <div
          className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada en mililitros: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-2">ml</span>}
        </div>
        {/* Feedback handled by scaffold */}
      </div>
    );
  };
  return <MainContent />;
};
