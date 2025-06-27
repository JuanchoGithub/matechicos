
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, RemainderProblem } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface InterpretarRestoG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_RESTO = ['🤔', '🧐', '💡', '÷', '❓', '📦', '🍪'];
type ActiveInput = 'quotient' | 'remainder';

export const InterpretarRestoG5Exercise: React.FC<InterpretarRestoG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<RemainderProblem | null>(null);
  const [userInputQuotient, setUserInputQuotient] = useState('');
  const [userInputRemainder, setUserInputRemainder] = useState('');
  const [activeInput, setActiveInput] = useState<ActiveInput>('quotient');
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_RESTO[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<RemainderProblem[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) setAvailableChallenges(shuffleArray([...scenarios]));
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (scenarios as RemainderProblem[]).length > 0) {
      pool = shuffleArray([...scenarios as RemainderProblem[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(pool[0].icon || FACE_EMOJIS_RESTO[Math.floor(Math.random() * FACE_EMOJIS_RESTO.length)]);
    } else {
      onAttempt(true); // End of challenges
      return;
    }
    setUserInputQuotient('');
    setUserInputRemainder('');
    setActiveInput('quotient');
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
    
    const { dividend, divisor } = currentChallenge;
    const correctQuotient = Math.floor(dividend / divisor);
    const correctRemainder = dividend % divisor;

    const userQuotient = parseInt(userInputQuotient, 10);
    const userRemainder = parseInt(userInputRemainder, 10);

    const isQuotientCorrect = userQuotient === correctQuotient;
    const isRemainderCorrect = userRemainder === correctRemainder;
    const isCorrect = isQuotientCorrect && isRemainderCorrect;

    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      let feedbackMsg = 'Incorrecto. ';
      if (!isQuotientCorrect) feedbackMsg += `La respuesta para "${currentChallenge.quotientLabel}" era ${correctQuotient}. `;
      if (!isRemainderCorrect) feedbackMsg += `La respuesta para "${currentChallenge.remainderLabel}" era ${correctRemainder}.`;
      showFeedback({ type: 'incorrect', message: feedbackMsg.trim() });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInputQuotient, userInputRemainder, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }

    const targetSetter = activeInput === 'quotient' ? setUserInputQuotient : setUserInputRemainder;
    const currentVal = activeInput === 'quotient' ? userInputQuotient : userInputRemainder;
    
    if (key === 'backspace') {
      targetSetter(prev => prev.slice(0, -1));
    } else if (/\d/.test(key) && currentVal.length < 3) {
      targetSetter(prev => prev + key);
    }
  }, [activeInput, userInputQuotient, userInputRemainder, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const InputField: React.FC<{ label: string; value: string; isActive: boolean; onClick: () => void }> = ({ label, value, isActive, onClick }) => (
    <div className="flex flex-col items-center">
      <label className="text-sm text-slate-600 mb-1">{label}</label>
      <button onClick={onClick} className={`w-32 h-14 border-2 rounded-lg text-2xl font-mono flex items-center justify-center transition-all ${isActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white'}`}>
        {value || <span className="text-slate-400">_</span>}
      </button>
    </div>
  );

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;

  return (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-lg">
      <div className="relative flex items-center justify-center mb-4">
        <div className="text-6xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-red-500 text-white text-md p-2 max-w-xs" direction="left">
          {currentChallenge.context}
        </Icons.SpeechBubbleIcon>
      </div>

      <div className="text-2xl font-bold text-slate-700 my-4">
        {currentChallenge.dividend} ÷ {currentChallenge.divisor}
      </div>

      <div className="flex justify-around w-full mt-2">
        <InputField label={currentChallenge.quotientLabel} value={userInputQuotient} isActive={activeInput === 'quotient'} onClick={() => setActiveInput('quotient')} />
        <InputField label={currentChallenge.remainderLabel} value={userInputRemainder} isActive={activeInput === 'remainder'} onClick={() => setActiveInput('remainder')} />
      </div>
    </div>
  );
};
