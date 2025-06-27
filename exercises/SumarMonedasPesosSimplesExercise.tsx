

import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData } from '../types';
import { Icons } from '../components/icons';

interface SumarMonedasPesosSimplesExerciseProps {
  exercise: ExerciseType;
  currentAvatar: AvatarData;
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onComplete: (success: boolean) => void;
}

interface Coin { value: number; count: number; label: string; } // value in pesos
interface CoinProblem {
  coins: Coin[];
  emoji?: string;
}
interface CurrentChallengeData extends CoinProblem {
  correctAnswer: number;
}

const FACE_EMOJIS = ['💰', '🤑', '🪙', '💵', '🤔', '➕', '🏦'];
const DEFAULT_COIN_EMOJI = '🪙';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const SumarMonedasPesosSimplesExercise: React.FC<SumarMonedasPesosSimplesExerciseProps> = ({
  exercise,
  currentAvatar,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onComplete,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallengeData | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_COIN_EMOJI);
  const [availableProblems, setAvailableProblems] = useState<CoinProblem[]>([]);

  const { totalStars = 10, problems = [] } = exercise.data || {};

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
    if (problemPool.length === 0) return;

    const selectedProblem = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));
    
    const correctAnswer = selectedProblem.coins.reduce((sum, coin) => sum + (coin.value * coin.count), 0);
    
    setCurrentChallenge({ ...selectedProblem, correctAnswer });
    setUserInput('');
    setFeedback(null);
    setCurrentEmoji(selectedProblem.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)] || DEFAULT_COIN_EMOJI);
  }, [availableProblems, problems]);

  useEffect(() => {
    if (problems.length > 0 && !currentChallenge) {
      generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge) return;
    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      setFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onComplete(false);
      return;
    }

    if (userAnswer === currentChallenge.correctAnswer) {
      setStars(prev => Math.min(prev + 1, totalStars));
      setFeedback({ type: 'correct', message: `¡Correcto! En total son $${currentChallenge.correctAnswer}.` });
      onComplete(true);
      if (stars + 1 >= totalStars) {
        setTimeout(() => setFeedback({type: 'correct', message: '¡Felicidades! Ejercicio completado.'}), 50);
        setTimeout(onGoHome, 2500);
      } else {
        setTimeout(generateNewChallenge, 2000);
      }
    } else {
      setFeedback({ type: 'incorrect', message: 'Resultado incorrecto. ¡Cuenta otra vez!' });
      onComplete(false);
    }
  }, [currentChallenge, userInput, totalStars, onComplete, generateNewChallenge, stars, onGoHome]);

  const handleKeyPress = (key: string) => {
    setFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 3 && /\d/.test(key)) setUserInput(prev => prev + key); // Max 3 digits (e.g. $999)
  };

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando monedas...</div>;
    
    const coinsDescription = currentChallenge.coins
      .filter(c => c.count > 0) // Filter out coins with count 0
      .map(c => `${c.count} moneda${c.count !== 1 ? 's' : ''} de ${c.label}`)
      .join(' y ');

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-lime-600 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            Tienes: <strong className="block text-sm sm:text-base">{coinsDescription}</strong>
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
        <div className="h-12 sm:h-16 mt-1 flex items-center justify-center w-full">
          {feedback && (
            <div className={`p-2 sm:p-3 rounded-md text-white font-semibold text-sm sm:text-md w-full max-w-md ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ExerciseScaffold
      exerciseId={exercise.id}
      exerciseQuestion={exercise.question || "¿Cuántos pesos hay en total?"}
      totalStarsForExercise={totalStars}
      onNavigateBack={onNavigateBack}
      onGoHome={onGoHome}
      onAvatarClick={onAvatarClick}
      currentAvatar={currentAvatar}
      mainExerciseContentRenderer={(api) => <MainContent />} // To be adapted if this component uses scaffoldApi
      keypadComponent={<NumericKeypad onKeyPress={handleKeyPress} className="w-full" />}
      onSetCompleted={(exerciseId) => console.log('Fallback onSetCompleted called in SumarMonedasPesosSimplesExercise', exerciseId)} // Provide a fallback or ensure it's passed correctly
    />
  );
};
