
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, ProportionProblem } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface ProporcionalidadG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_PROPORCION = ['🤔', '🧐', '💡', '⚖️', '➡️', '✨'];

export const ProporcionalidadG5Exercise: React.FC<ProporcionalidadG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ProportionProblem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_PROPORCION[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<ProportionProblem[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) setAvailableChallenges(shuffleArray([...scenarios]));
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (scenarios as ProportionProblem[]).length > 0) {
      pool = shuffleArray([...scenarios as ProportionProblem[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(pool[0].icon || FACE_EMOJIS_PROPORCION[Math.floor(Math.random() * FACE_EMOJIS_PROPORCION.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableChallenges, scenarios, showFeedback, onAttempt]);

  useEffect(() => { if (scenarios.length > 0 && !currentChallenge) loadNewChallenge(); }, [scenarios, currentChallenge, loadNewChallenge]);
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const correctAnswer = (currentChallenge.b * currentChallenge.c) / currentChallenge.a;
    const userAnswerNum = parseInt(userInput, 10);
    
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    
    const isCorrect = Math.abs(userAnswerNum - correctAnswer) < 0.01;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta correcta era ${correctAnswer}.` });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (userInput.length < 5 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;

  return (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-lg">
      <div className="relative flex items-center justify-center mb-4">
        <div className="text-6xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-emerald-500 text-white text-md p-2 max-w-xs" direction="left">
          {currentChallenge.context}
        </Icons.SpeechBubbleIcon>
      </div>

      <div className="w-full bg-slate-50 p-4 rounded-lg border-2 border-slate-200 space-y-4">
        <div className="flex justify-around items-center text-lg text-slate-700">
          <div className="flex flex-col items-center">
            <span>{currentChallenge.a} {currentChallenge.aLabel}</span>
            <span className="text-2xl">→</span>
            <span>{currentChallenge.b} {currentChallenge.bLabel}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{currentChallenge.c} {currentChallenge.cLabel}</span>
            <span className="text-2xl">→</span>
            <span className="font-bold">X {currentChallenge.xLabel}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <span className="text-xl font-semibold mr-2">X =</span>
          <div className="w-32 h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl font-mono text-slate-700 shadow-inner">
            {userInput || <span className="text-slate-400">?</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
