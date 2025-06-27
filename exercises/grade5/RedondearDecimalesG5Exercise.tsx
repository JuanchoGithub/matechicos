
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, RedondearDecimalesChallenge } from '../../types';
import { NumericKeypad } from '../../components/NumericKeypad';

interface RedondearDecimalesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

export const RedondearDecimalesG5Exercise: React.FC<RedondearDecimalesG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [challenge, setChallenge] = useState<RedondearDecimalesChallenge | null>(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Placeholder challenge
    setChallenge({ decimal: 3.14159, placeToRound: 'centesimo', correctAnswer: 3.14 });
  }, [exercise.id]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'check') {
        const userAnswer = parseFloat(userInput);
        if(challenge && !isNaN(userAnswer) && Math.abs(userAnswer - challenge.correctAnswer) < 0.001) {
            scaffoldApi.onAttempt(true);
            scaffoldApi.showFeedback({type: 'correct', message:'¡Correcto!'});
        } else {
            scaffoldApi.onAttempt(false);
            scaffoldApi.showFeedback({type: 'incorrect', message:`Incorrecto. Era ${challenge?.correctAnswer}`});
        }
    } else if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (/\d|\./.test(key) && userInput.length < 6) {
      if (key === '.' && userInput.includes('.')) return;
      setUserInput(prev => prev + key);
    }
  }, [userInput, challenge, scaffoldApi]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  if (!challenge) return <div className="p-4">Cargando desafío de redondear decimales...</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
      <p className="text-md mb-1">Redondea {challenge.decimal} al {challenge.placeToRound} más cercano.</p>
      <div className="my-2 p-2 border rounded bg-slate-100 w-40 h-12 text-2xl text-center">{userInput || '_.__'}</div>
    </div>
  );
};
