import React, { useState, useEffect, useCallback } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, FraccionCantidadChallenge } from '../../types';
import { NumericKeypad } from '../../components/NumericKeypad';

interface FraccionDeCantidadG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

export const FraccionDeCantidadG5Exercise: React.FC<FraccionDeCantidadG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [challenge, setChallenge] = useState<FraccionCantidadChallenge | null>(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Placeholder challenge
    setChallenge({ fractionNum: 2, fractionDen: 5, wholeNumber: 20, correctAnswer: 8, context: "manzanas" });
  }, [exercise.id]);

  const handleKeyPress = useCallback((key: string) => {
     if (key === 'check') {
        const userAnswer = parseInt(userInput, 10);
        if(challenge && !isNaN(userAnswer) && userAnswer === challenge.correctAnswer) {
            scaffoldApi.onAttempt(true);
            scaffoldApi.showFeedback({type: 'correct', message:'¡Correcto!'});
        } else {
            scaffoldApi.onAttempt(false);
            scaffoldApi.showFeedback({type: 'incorrect', message:`Incorrecto. Era ${challenge?.correctAnswer}`});
        }
    } else if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (/\d/.test(key) && userInput.length < 4) {
      setUserInput(prev => prev + key);
    }
  }, [userInput, challenge, scaffoldApi]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  if (!challenge) return <div className="p-4">Cargando desafío de fracción de cantidad...</div>;

  return (
    <div className="flex flex-col items-center p-4 text-slate-800">
      <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
      <p className="text-md mb-1">Calcula: {challenge.fractionNum}/{challenge.fractionDen} de {challenge.wholeNumber} {challenge.context || ''}</p>
      <div className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner my-4">
        {userInput || <span className="text-slate-400">_</span>}
      </div>
    </div>
  );
};
