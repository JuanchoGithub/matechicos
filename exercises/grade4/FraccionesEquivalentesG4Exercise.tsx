
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, FractionEquivalentChallenge, FractionChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface FraccionesEquivalentesG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_FRAC_EQ = ['🤔', '🧐', '💡', '🟰', '🍰', '🍫', '📊', '📏'];

// Basic visual fraction bar
const FractionBar: React.FC<{ numerator: number; denominator: number; color?: string; width?: number; height?: number; label?: string }> = 
  ({ numerator, denominator, color = 'bg-sky-500', width = 120, height = 24, label }) => {
  if (denominator === 0) return null;
  const segmentWidth = width / denominator;
  return (
    <div className="flex flex-col items-center my-1">
      {label && <span className="text-xs text-slate-600 mb-0.5">{label}</span>}
      <div className="flex border border-slate-400" style={{ width: `${width}px`, height: `${height}px` }} role="img" aria-label={`Barra de fracción representando ${numerator} de ${denominator}`}>
        {Array.from({ length: denominator }).map((_, i) => (
          <div
            key={i}
            className={`h-full ${i < numerator ? color : 'bg-slate-100'}`}
            style={{ width: `${segmentWidth}px`, borderRight: i < denominator - 1 ? '1px solid #bfdbfe' : 'none' }} // Lighter border for segments
            aria-hidden="true"
          ></div>
        ))}
      </div>
    </div>
  );
};

// Keypad Component for Options
const OptionsKeypad: React.FC<{
  options: { fraction: FractionChallenge; isCorrect: boolean; visual?: string }[];
  selectedOptionString: string | null;
  onSelect: (optionString: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerString: string | null;
  visualType?: 'bar' | 'circle';
}> = ({ options, selectedOptionString, onSelect, onVerify, isVerified, correctAnswerString, visualType }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((opt, index) => {
        const optStr = `${opt.fraction.numerator}/${opt.fraction.denominator}`;
        const isSelected = selectedOptionString === optStr;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
            if (isSelected) { // User selected this option
                buttonClass = opt.isCorrect
                    ? 'bg-green-500 text-white ring-2 ring-green-700' 
                    : 'bg-red-500 text-white ring-2 ring-red-700';
            } else if (opt.isCorrect) { // This is the correct answer, but user didn't pick it
                // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if user was wrong
            } else { // Neither selected nor correct (if verified and wrong)
                buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
        } else if (isSelected) { // Not verified yet, but selected
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        
        return (
          <button
            key={index}
            onClick={() => onSelect(optStr)}
            disabled={isVerified && selectedOptionString === correctAnswerString}
            className={`w-full p-2 rounded-lg text-center font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass} flex flex-col items-center`}
            aria-label={`Opción: ${optStr}`}
          >
            <span className="text-lg">{optStr}</span>
            {visualType === 'bar' && <FractionBar numerator={opt.fraction.numerator} denominator={opt.fraction.denominator} width={80} height={16} color="bg-blue-400" />}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionString || (isVerified && selectedOptionString === correctAnswerString)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOptionString || (isVerified && selectedOptionString === correctAnswerString))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const FraccionesEquivalentesG4Exercise: React.FC<FraccionesEquivalentesG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallengeInternal, setCurrentChallengeInternal] = useState<FractionEquivalentChallenge | null>(null);
  const [selectedOptionString, setSelectedOptionString] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_FRAC_EQ[0]);
  const [availableChallenges, setAvailableChallenges] = useState<FractionEquivalentChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as FractionEquivalentChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as FractionEquivalentChallenge[]).length > 0) { 
      pool = shuffleArray([...challenges as FractionEquivalentChallenge[]]); 
      setAvailableChallenges(pool); 
    }

    if (pool.length > 0) {
      const nextChallengeData = {...pool[0]};
      // Shuffle options for the new challenge
      nextChallengeData.options = shuffleArray([...nextChallengeData.options]);
      setCurrentChallengeInternal(nextChallengeData);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_FRAC_EQ[Math.floor(Math.random() * FACE_EMOJIS_FRAC_EQ.length)]);
    } else {
      onAttempt(true); // Signal scaffold that internal challenges are done
      return;
    }
    setSelectedOptionString(null); 
    setIsVerified(false); 
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as FractionEquivalentChallenge[]).length > 0 && !currentChallengeInternal) {
      loadNewChallenge();
    }
  }, [challenges, currentChallengeInternal, loadNewChallenge]);
  
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) { // Handle initial undefined case
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionStr: string) => {
    const correctOpt = currentChallengeInternal?.options.find(opt => opt.isCorrect);
    const correctOptStr = correctOpt ? `${correctOpt.fraction.numerator}/${correctOpt.fraction.denominator}` : null;
    
    if (isVerified && selectedOptionString === correctOptStr) return;
    setSelectedOptionString(optionStr); 
    showFeedback(null);
    if (isVerified && selectedOptionString !== correctOptStr) setIsVerified(false);
  }, [isVerified, selectedOptionString, currentChallengeInternal, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallengeInternal || !selectedOptionString) return;
    const correctOpt = currentChallengeInternal.options.find(opt => opt.isCorrect);
    if (!correctOpt || (isVerified && selectedOptionString === `${correctOpt.fraction.numerator}/${correctOpt.fraction.denominator}`)) return;
    
    setIsVerified(true);
    const isCorrect = selectedOptionString === `${correctOpt.fraction.numerator}/${correctOpt.fraction.denominator}`;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto! Son fracciones equivalentes.' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La fracción equivalente era ${correctOpt.fraction.numerator}/${correctOpt.fraction.denominator}.` });
    }
  }, [currentChallengeInternal, selectedOptionString, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallengeInternal) {
      const correctOpt = currentChallengeInternal.options.find(opt => opt.isCorrect);
      const correctOptStr = correctOpt ? `${correctOpt.fraction.numerator}/${correctOpt.fraction.denominator}` : null;
      setCustomKeypadContent(
        <OptionsKeypad
          options={currentChallengeInternal.options}
          selectedOptionString={selectedOptionString}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswerString={correctOptStr}
          visualType={currentChallengeInternal.visualType}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallengeInternal, selectedOptionString, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallengeInternal) return <div className="p-4 text-xl text-slate-600">Cargando desafío de fracciones...</div>;
    const { baseFraction, visualType } = currentChallengeInternal;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
          <div className="relative flex items-center justify-center mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
              <Icons.SpeechBubbleIcon className="bg-sky-500 text-white text-md p-2 max-w-[280px]" direction="left">
                {exercise.question || "¿Qué fracción es igual a esta?"}
              </Icons.SpeechBubbleIcon>
          </div>
          <div className="flex flex-col items-center my-2 p-3 bg-amber-50 rounded-lg shadow">
              <span className="text-3xl font-bold text-amber-700">{baseFraction.numerator} / {baseFraction.denominator}</span>
              {visualType === 'bar' && <FractionBar numerator={baseFraction.numerator} denominator={baseFraction.denominator} color="bg-amber-500" width={150} height={30} />}
              {/* Add circle visual later if needed */}
          </div>
          <p className="text-sm text-slate-500">Selecciona la fracción equivalente de las opciones en la barra lateral.</p>
      </div>
    );
  };
  
  return <MainContent />;
};
