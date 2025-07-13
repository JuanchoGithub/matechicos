
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MultiStepProblem } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface ProblemasMultiplesPasosG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_MULTISTEP = ['🤔', '🧐', '💡', '🧠', '🔢', '🚀'];

export const ProblemasMultiplesPasosG5Exercise: React.FC<ProblemasMultiplesPasosG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MultiStepProblem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_MULTISTEP[0]);
  const [availableChallenges, setAvailableChallenges] = useState<MultiStepProblem[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) setAvailableChallenges(shuffleArray([...scenarios]));
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (scenarios as MultiStepProblem[]).length > 0) {
      pool = shuffleArray([...scenarios as MultiStepProblem[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(pool[0].icon || FACE_EMOJIS_MULTISTEP[Math.floor(Math.random() * FACE_EMOJIS_MULTISTEP.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setCurrentStepIndex(0);
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

    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      setIsAttemptPending(false);
      return;
    }

    const isFinalStep = currentStepIndex >= currentChallenge.steps.length;
    const correctAnswer = isFinalStep ? currentChallenge.finalAnswer : currentChallenge.steps[currentStepIndex].correctAnswer;
    const isCorrect = userAnswerNum === correctAnswer;

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Paso Correcto!' });
      setTimeout(() => {
        if (isFinalStep) {
          onAttempt(true); // Final correct answer for the whole problem
        } else {
          setCurrentStepIndex(prev => prev + 1);
          setUserInput('');
          setIsAttemptPending(false);
          showFeedback(null);
        }
      }, 1200);
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. Revisa tu cálculo. La respuesta correcta era ${correctAnswer}.` });
      onAttempt(false); // Mark attempt as incorrect, but don't advance the whole problem
      setIsAttemptPending(false);
    }
  }, [currentChallenge, currentStepIndex, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { setUserInput(prev => prev.slice(0, -1)); }
    else if (userInput.length < 5 && /\d/.test(key)) { setUserInput(prev => prev + key); }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const getCurrentQuestion = () => {
    if (!currentChallenge) return "";
    return currentStepIndex < currentChallenge.steps.length
      ? currentChallenge.steps[currentStepIndex].question
      : currentChallenge.finalQuestion;
  };

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;

  return (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-lg">
      <div className="w-full text-md text-slate-700 p-4 bg-amber-100 border border-amber-300 rounded-lg shadow min-h-[100px] flex items-center justify-center mb-4">
        {currentChallenge.problemText}
      </div>
      
      <div className="w-full p-4 bg-sky-50 border-2 border-sky-200 rounded-lg shadow-md">
        <div className="relative flex items-center justify-center mb-4">
          <div className="text-5xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-md p-2 max-w-xs" direction="left">
            Paso {currentStepIndex + 1}:
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="font-semibold text-slate-800 text-lg mb-3">{getCurrentQuestion()}</p>
        <div className="w-3/4 max-w-xs h-16 bg-white border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl text-slate-700 font-mono tracking-wider shadow-inner mx-auto">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    </div>
  );
};
