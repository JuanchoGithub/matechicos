
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, CompareFractionChallenge, ComparisonSymbol } from '../../types';
import { Icons } from '../../components/icons';
import { ComparisonKeypad } from '../../components/ComparisonKeypad'; // Reusing this

interface CompararFraccionesG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_COMP_FRAC = ['🤔', '🧐', '💡', '⚖️', '🍰', '🍕'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompararFraccionesG4Exercise: React.FC<CompararFraccionesG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CompareFractionChallenge | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<ComparisonSymbol | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_COMP_FRAC[0]);
  const [availableChallenges, setAvailableChallenges] = useState<CompareFractionChallenge[]>([]);
  
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
      setCharacterEmoji(FACE_EMOJIS_COMP_FRAC[Math.floor(Math.random() * FACE_EMOJIS_COMP_FRAC.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedSymbol(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleSymbolSelect = useCallback((symbol: ComparisonSymbol) => {
    if (isVerified && selectedSymbol === currentChallenge?.correctSymbol) return;
    setSelectedSymbol(symbol); showFeedback(null);
    if (isVerified && selectedSymbol !== currentChallenge?.correctSymbol) setIsVerified(false);
  }, [isVerified, selectedSymbol, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedSymbol || (isVerified && selectedSymbol === currentChallenge.correctSymbol)) return;
    setIsVerified(true);
    const isCorrect = selectedSymbol === currentChallenge.correctSymbol;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Comparación Correcta!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La comparación correcta era ${currentChallenge.correctSymbol}` });
  }, [currentChallenge, selectedSymbol, isVerified, showFeedback, onAttempt]);

  const FractionDisplay: React.FC<{ fraction: {numerator: number, denominator: number} }> = ({ fraction }) => (
    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg shadow-md border-2 border-sky-300 w-28 h-32">
      <span className="text-3xl font-bold text-sky-700">{fraction.numerator}</span>
      <hr className="w-10/12 border-t-2 border-sky-600 my-1" />
      <span className="text-3xl font-bold text-sky-700">{fraction.denominator}</span>
    </div>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-md p-2 max-w-[280px]" direction="left">
            Compara las fracciones:
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex items-center justify-around w-full my-4">
          <FractionDisplay fraction={currentChallenge.fractionA} />
          <div className="text-5xl font-bold text-slate-400 w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 mx-2">
            {selectedSymbol || '?'}
          </div>
          <FractionDisplay fraction={currentChallenge.fractionB} />
        </div>
      </div>
    );
  };

  const Keypad: React.FC = React.useMemo(() => () => (
    <ComparisonKeypad 
      onSymbolSelect={handleSymbolSelect} 
      onVerify={verifyAnswer} 
      selectedSymbol={selectedSymbol} 
      isVerified={isVerified} 
      correctSymbolForFeedback={currentChallenge?.correctSymbol || null} 
    />
  ), [handleSymbolSelect, verifyAnswer, selectedSymbol, isVerified, currentChallenge]);

  useEffect(() => { if (setCustomKeypadContent) { if (currentChallenge) setCustomKeypadContent(<Keypad />); else setCustomKeypadContent(null); } return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; }, [setCustomKeypadContent, Keypad, currentChallenge]);

  return <MainContent />;
};
