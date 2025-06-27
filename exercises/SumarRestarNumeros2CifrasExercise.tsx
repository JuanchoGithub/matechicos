import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Added import
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData } from '../types';
import { Icons } from '../components/icons';

interface SumarRestarNumeros2CifrasExerciseProps {
  exercise: ExerciseType;
  currentAvatar: AvatarData;
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onComplete: (success: boolean) => void;
  onSetCompleted?: (exerciseId: string) => void; 
}

interface CurrentProblem {
  num1: number;
  num2: number;
  operationType: 'addition' | 'subtraction';
  problemString: string;
  correctAnswer: number;
}

export const SumarRestarNumeros2CifrasExercise: React.FC<SumarRestarNumeros2CifrasExerciseProps> = ({
  exercise,
  currentAvatar,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onComplete,
  onSetCompleted, 
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);

  const {
    totalStars = 10,
    minOperand = 10,
    maxOperand = 99,
  } = exercise.data || {};

  const generateNewProblem = useCallback(() => {
    const operationType = Math.random() < 0.5 ? 'addition' : 'subtraction';
    let num1: number, num2: number, answer: number, problemStr: string;

    if (operationType === 'addition') {
      num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
      num2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
      answer = num1 + num2;
      problemStr = `${num1} + ${num2}`;
    } else { // Subtraction
      do {
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        num2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
      } while (num1 < num2); 
      answer = num1 - num2;
      problemStr = `${num1} - ${num2}`;
    }

    setCurrentProblem({
      num1,
      num2,
      operationType,
      problemString: problemStr,
      correctAnswer: answer,
    });
    setUserInput('');
    setFeedback(null);
  }, [minOperand, maxOperand]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const verifyAnswer = useCallback(() => {
    if (!currentProblem) return;

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      setFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onComplete(false);
      return;
    }

    if (userAnswer === currentProblem.correctAnswer) {
      setStars(prev => Math.min(prev + 1, totalStars));
      setFeedback({ type: 'correct', message: `¡Muy bien! ${currentProblem.operationType === 'addition' ? 'Suma' : 'Resta'} correcta.` });
      onComplete(true);
      if (stars + 1 >= totalStars) {
        if(onSetCompleted) onSetCompleted(exercise.id); 
        setTimeout(() => setFeedback({ type: 'correct', message: '¡Felicidades! Ejercicio completado.' }), 50);
        setTimeout(onNavigateBack, 2500);
      } else {
        setTimeout(generateNewProblem, 2000);
      }
    } else {
      setFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. Revisa tu operación e inténtalo de nuevo.' });
      onComplete(false);
    }
  }, [currentProblem, userInput, totalStars, onComplete, generateNewProblem, stars, onNavigateBack, exercise.id, onSetCompleted]);

  const handleKeyPress = (key: string) => {
    setFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 3 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  };

  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-lg p-3 space-y-6 h-full">
        <p className="text-6xl sm:text-7xl font-bold text-slate-800 tracking-tight mb-6">
          {currentProblem.problemString}
        </p>

        <div
          className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
        </div>
        
        <div className="h-16 mt-4 flex items-center justify-center w-full">
          {feedback && (
            <div className={`p-3 rounded-md text-white font-semibold text-md w-full max-w-md ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
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
      exerciseQuestion={exercise.question || `Resuelve la operación:`}
      totalStarsForExercise={totalStars} // Corrected prop name
      onNavigateBack={onNavigateBack}
      onGoHome={onGoHome}
      onAvatarClick={onAvatarClick}
      currentAvatar={currentAvatar}
      mainExerciseContentRenderer={(api) => <MainContent />}
      keypadComponent={<NumericKeypad onKeyPress={handleKeyPress} className="w-full" />}
      onFooterBack={onNavigateBack}
      onFooterHome={onGoHome}
      onSetCompleted={onSetCompleted || ((exerciseId) => console.log(`Exercise ${exerciseId} completed via scaffold`))}
    />
  );
};
