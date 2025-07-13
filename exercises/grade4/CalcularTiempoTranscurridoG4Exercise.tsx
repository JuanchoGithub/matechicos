
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, TiempoTranscurridoChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface CalcularTiempoTranscurridoG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_TIEMPO = ['⏰', '🤔', '🧐', '💡', '⏳', '📅'];
type ActiveTimeInput = 'hours' | 'minutes';

export const CalcularTiempoTranscurridoG4Exercise: React.FC<CalcularTiempoTranscurridoG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<TiempoTranscurridoChallenge | null>(null);
  const [userInputHours, setUserInputHours] = useState<string>('');
  const [userInputMinutes, setUserInputMinutes] = useState<string>('');
  const [activeInput, setActiveInput] = useState<ActiveTimeInput>('hours');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_TIEMPO[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<TiempoTranscurridoChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_TIEMPO[Math.floor(Math.random() * FACE_EMOJIS_TIEMPO.length)]);
    } else {
      onAttempt(true); return;
    }
    setUserInputHours(''); setUserInputMinutes(''); setActiveInput('hours');
    setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const hoursNum = parseInt(userInputHours, 10);
    const minutesNum = parseInt(userInputMinutes, 10);
    if (isNaN(hoursNum) || isNaN(minutesNum)) {
      showFeedback({ type: 'incorrect', message: 'Completa horas y minutos.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = hoursNum === currentChallenge.correctAnswer.hours && minutesNum === currentChallenge.correctAnswer.minutes;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Tiempo Correcto!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. Eran ${currentChallenge.correctAnswer.hours}h y ${currentChallenge.correctAnswer.minutes}min.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInputHours, userInputMinutes, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    const targetSetter = activeInput === 'hours' ? setUserInputHours : setUserInputMinutes;
    const currentVal = activeInput === 'hours' ? userInputHours : userInputMinutes;
    const maxLength = 2;

    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { targetSetter(prev => prev.slice(0, -1)); }
    else if (/\d/.test(key)) {
      if (currentVal.length < maxLength) targetSetter(prev => prev + key);
      else targetSetter(key); // Replace if max length reached
      if (activeInput === 'hours' && (currentVal + key).length >= maxLength) setActiveInput('minutes');
    }
  }, [activeInput, userInputHours, userInputMinutes, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const TimeInput: React.FC<{value: string, label:string, isActive: boolean, onClick: () => void}> = ({value, label, isActive, onClick}) => (
    <button onClick={onClick} className={`w-20 h-16 border-2 rounded-md text-2xl font-mono flex flex-col items-center justify-center ${isActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
      {value || <span className="text-slate-400">_</span>} <span className="text-xs text-slate-500">{label}</span>
    </button>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-pink-500 text-white text-md p-2 max-w-[280px]" direction="left">
            ¿Cuánto tiempo pasó?
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="text-xl font-semibold text-slate-700">
          De: <span className="text-blue-600">{currentChallenge.startTime}</span> a: <span className="text-green-600">{currentChallenge.endTime}</span>
        </div>
        <div className="flex items-center space-x-2 my-3">
          <TimeInput value={userInputHours} label="horas" isActive={activeInput === 'hours'} onClick={() => setActiveInput('hours')} />
          <span className="text-3xl font-bold text-slate-500">:</span>
          <TimeInput value={userInputMinutes} label="min" isActive={activeInput === 'minutes'} onClick={() => setActiveInput('minutes')} />
        </div>
      </div>
    );
  };
  return <MainContent />;
};
