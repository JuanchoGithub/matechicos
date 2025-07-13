
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PotenciasChallenge } from '../../types';
import { Icons } from '../../components/icons';

interface PotenciasCuadradosCubosG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_POTENCIAS = ['🤯', '🤔', '🧐', '💡', '🚀', '💥', '✨'];

export const PotenciasCuadradosCubosG5Exercise: React.FC<PotenciasCuadradosCubosG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<PotenciasChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_POTENCIAS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    baseRangeForSquare = [2, 15],
    baseRangeForCube = [2, 10],
  } = exercise.data || {};

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const exponent = Math.random() < 0.6 ? 2 : 3; // 60% chance for square
    let base: number;
    if (exponent === 2) {
      base = Math.floor(Math.random() * (baseRangeForSquare[1] - baseRangeForSquare[0] + 1)) + baseRangeForSquare[0];
    } else {
      base = Math.floor(Math.random() * (baseRangeForCube[1] - baseRangeForCube[0] + 1)) + baseRangeForCube[0];
    }

    const correctAnswer = Math.pow(base, exponent);

    setCurrentChallenge({ base, exponent, correctAnswer });
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
    setCharacterEmoji(FACE_EMOJIS_POTENCIAS[Math.floor(Math.random() * FACE_EMOJIS_POTENCIAS.length)]);
  }, [baseRangeForSquare, baseRangeForCube, showFeedback]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    const isCorrect = userAnswerNum === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentChallenge.correctAnswer}.` });
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
    } else if (userInput.length < 4 && /\d/.test(key)) {
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { base, exponent } = currentChallenge;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-red-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || `Calcula la siguiente potencia:`}
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-6xl font-bold text-slate-700 my-4 p-4 bg-slate-100 rounded-lg shadow-inner inline-flex items-start">
          {base}<sup className="text-4xl -top-4">{exponent}</sup>
        </p>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
