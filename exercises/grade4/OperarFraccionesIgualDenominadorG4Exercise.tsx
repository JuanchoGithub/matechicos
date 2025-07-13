
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, OperateFractionChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface OperarFraccionesIgualDenominadorG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_OP_FRAC = ['➕➖', '🤔', '🧐', '💡', '🍰', '🧮'];
type ActiveFracInput = 'numerator' | 'denominator';

export const OperarFraccionesIgualDenominadorG4Exercise: React.FC<OperarFraccionesIgualDenominadorG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<OperateFractionChallenge | null>(null);
  const [userInputNumerator, setUserInputNumerator] = useState<string>('');
  const [userInputDenominator, setUserInputDenominator] = useState<string>(''); // Denominator will be fixed, but can show it
  const [activeInput, setActiveInput] = useState<ActiveFracInput>('numerator');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_OP_FRAC[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<OperateFractionChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      // Denominator is known for this exercise type
      setUserInputDenominator(nextChallenge.fractionA.denominator.toString());
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_OP_FRAC[Math.floor(Math.random() * FACE_EMOJIS_OP_FRAC.length)]);
    } else {
      onAttempt(true); return;
    }
    setUserInputNumerator(''); setActiveInput('numerator');
    setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const numN = parseInt(userInputNumerator, 10);
    // Denominator is fixed based on the problem
    const numD = currentChallenge.fractionA.denominator; 

    if (isNaN(numN) || userInputNumerator === '') {
      showFeedback({ type: 'incorrect', message: 'Completa el numerador.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = numN === currentChallenge.correctResult.numerator && numD === currentChallenge.correctResult.denominator;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Fracción Correcta!' });
    else { showFeedback({ type: 'incorrect', message: `Resultado incorrecto. Era ${currentChallenge.correctResult.numerator}/${currentChallenge.correctResult.denominator}.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInputNumerator, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') {
      if (activeInput === 'numerator') setUserInputNumerator('');
      // Denominator is not user-editable for this specific exercise type
    } else if (/\d/.test(key)) {
      if (activeInput === 'numerator') {
        if (userInputNumerator.length < 2) setUserInputNumerator(prev => prev + key);
        else setUserInputNumerator(key);
      }
    }
  }, [activeInput, userInputNumerator, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const FractionInput: React.FC<{numerator: string, denominator: string, onNumeratorClick: () => void, isNumeratorActive: boolean}> = 
    ({numerator, denominator, onNumeratorClick, isNumeratorActive}) => (
    <div className="flex flex-col items-center justify-center">
      <button onClick={onNumeratorClick} className={`w-20 h-12 sm:w-24 sm:h-16 border-2 rounded-md text-2xl font-bold flex items-center justify-center ${isNumeratorActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
        {numerator || <span className="text-slate-400">N</span>}
      </button>
      <hr className="w-16 border-t-2 border-slate-700 my-1" />
      <div className="w-20 h-12 sm:w-24 sm:h-16 border-2 border-slate-300 bg-slate-100 rounded-md text-2xl font-bold flex items-center justify-center text-slate-500">
        {denominator}
      </div>
    </div>
  );

  const FractionDisplay: React.FC<{fraction: {numerator:number, denominator:number}}> = ({fraction}) => (
    <div className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md">
        <span className="text-2xl font-bold text-slate-700">{fraction.numerator}</span>
        <hr className="w-12 border-t-2 border-slate-500 my-0.5"/>
        <span className="text-2xl font-bold text-slate-700">{fraction.denominator}</span>
    </div>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md p-2 max-w-[280px]" direction="left">
            Resuelve la operación:
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex items-center justify-center space-x-3 my-3">
          <FractionDisplay fraction={currentChallenge.fractionA} />
          <span className="text-4xl font-bold text-slate-600">{currentChallenge.operation}</span>
          <FractionDisplay fraction={currentChallenge.fractionB} />
          <span className="text-4xl font-bold text-slate-600">=</span>
          <FractionInput 
            numerator={userInputNumerator} 
            denominator={userInputDenominator} 
            onNumeratorClick={() => setActiveInput('numerator')}
            isNumeratorActive={activeInput === 'numerator'}
          />
        </div>
      </div>
    );
  };
  return <MainContent />;
};
