
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, OperacionesCombinadasG5Challenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface OperacionesCombinadasG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_COMBINADAS = ['🧠', '🤔', '🧐', '💡', '➕➖✖️➗', '🧮', '🚀'];

export const OperacionesCombinadasG5Exercise: React.FC<OperacionesCombinadasG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<OperacionesCombinadasG5Challenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_COMBINADAS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<OperacionesCombinadasG5Challenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) {
      pool = shuffleArray([...challenges]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_COMBINADAS[Math.floor(Math.random() * FACE_EMOJIS_COMBINADAS.length)]);
    } else {
      onAttempt(true); // No more challenges
      return;
    }
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

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
    } else if (userInput.length < 5 && (/\d/.test(key) || (key === '-' && userInput.length === 0))) {
      setUserInput(prev => prev + key);
    }
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
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "Calcula respetando la jerarquía:"}
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-4xl sm:text-5xl font-bold text-slate-700 my-4 p-2 bg-slate-100 rounded-md shadow-inner">
          {currentChallenge.expression}
        </p>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
