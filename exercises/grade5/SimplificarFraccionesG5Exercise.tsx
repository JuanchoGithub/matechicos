
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, SimplificarFraccionChallenge, FractionChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface SimplificarFraccionesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_SIMPLIFICAR = ['🤔', '🧐', '💡', '✂️', '✨', '📏'];

// Reusable FractionBar component (can be moved to a shared location if used elsewhere)
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
            style={{ width: `${segmentWidth}px`, borderRight: i < denominator - 1 ? '1px solid #bfdbfe' : 'none' }}
            aria-hidden="true"
          ></div>
        ))}
      </div>
    </div>
  );
};

// Reusable FractionPartDisplay for options (can be moved if needed)
const FractionPartDisplay: React.FC<{ numerator: number; denominator: number; size?: 'sm' | 'lg', className?: string }> = 
  ({ numerator, denominator, size = 'lg', className = "" }) => {
  const numDenFontSize = size === 'lg' ? 'text-3xl' : 'text-lg';
  const hrWidth = size === 'lg' ? 'w-10' : 'w-6';
  const hrMargin = size === 'lg' ? 'my-0.5' : 'my-px';
  return (
    <div className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className={`${numDenFontSize} font-bold`}>{numerator}</span>
      <hr className={`${hrWidth} border-t-2 border-current ${hrMargin}`} />
      <span className={`${numDenFontSize} font-bold`}>{denominator}</span>
    </div>
  );
};


// Keypad Component for Options
const OptionsKeypad: React.FC<{
  options: { fraction: FractionChallenge; isCorrect: boolean; }[]; // Adjusted to use the new structure in SimplificarFraccionChallenge
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
            if (isSelected) {
                buttonClass = opt.isCorrect
                    ? 'bg-green-500 text-white ring-2 ring-green-700' 
                    : 'bg-red-500 text-white ring-2 ring-red-700';
            } else if (opt.isCorrect) {
                // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if user was wrong
            } else { 
                buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
        } else if (isSelected) { 
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
            <FractionPartDisplay numerator={opt.fraction.numerator} denominator={opt.fraction.denominator} size="sm" />
            {/* Visual for option can be added here if visualType='bar' for options too */}
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

export const SimplificarFraccionesG5Exercise: React.FC<SimplificarFraccionesG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallengeInternal, setCurrentChallengeInternal] = useState<SimplificarFraccionChallenge | null>(null);
  const [selectedOptionString, setSelectedOptionString] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_SIMPLIFICAR[0]);
  const [availableChallenges, setAvailableChallenges] = useState<SimplificarFraccionChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as SimplificarFraccionChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as SimplificarFraccionChallenge[]).length > 0) { 
      pool = shuffleArray([...challenges as SimplificarFraccionChallenge[]]); 
      setAvailableChallenges(pool); 
    }

    if (pool.length > 0) {
      const nextChallengeData = {...pool[0]};
      nextChallengeData.options = shuffleArray([...nextChallengeData.options]);
      setCurrentChallengeInternal(nextChallengeData);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_SIMPLIFICAR[Math.floor(Math.random() * FACE_EMOJIS_SIMPLIFICAR.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOptionString(null); 
    setIsVerified(false); 
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as SimplificarFraccionChallenge[]).length > 0 && !currentChallengeInternal) {
      loadNewChallenge();
    }
  }, [challenges, currentChallengeInternal, loadNewChallenge]);
  
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionStr: string) => {
    if (!currentChallengeInternal) return;
    const correctSimplifiedStr = `${currentChallengeInternal.correctSimplifiedFraction.numerator}/${currentChallengeInternal.correctSimplifiedFraction.denominator}`;
    if (isVerified && selectedOptionString === correctSimplifiedStr) return;
    
    setSelectedOptionString(optionStr); 
    showFeedback(null);
    if (isVerified && selectedOptionString !== correctSimplifiedStr) setIsVerified(false);
  }, [isVerified, selectedOptionString, currentChallengeInternal, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallengeInternal || !selectedOptionString) return;
    const correctSimplifiedStr = `${currentChallengeInternal.correctSimplifiedFraction.numerator}/${currentChallengeInternal.correctSimplifiedFraction.denominator}`;
    if (isVerified && selectedOptionString === correctSimplifiedStr) return;
    
    setIsVerified(true);
    const isCorrect = selectedOptionString === correctSimplifiedStr;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto! Fracción simplificada.' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La forma más simple era ${correctSimplifiedStr}.` });
    }
  }, [currentChallengeInternal, selectedOptionString, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallengeInternal) {
      const correctSimplifiedStr = `${currentChallengeInternal.correctSimplifiedFraction.numerator}/${currentChallengeInternal.correctSimplifiedFraction.denominator}`;
      setCustomKeypadContent(
        <OptionsKeypad
          options={currentChallengeInternal.options}
          selectedOptionString={selectedOptionString}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswerString={correctSimplifiedStr}
          visualType={currentChallengeInternal.visualType}
        />
      );
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, currentChallengeInternal, selectedOptionString, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallengeInternal) return <div className="p-4 text-xl text-slate-600">Cargando desafío de fracciones...</div>;
    const { fractionToSimplify, visualType } = currentChallengeInternal;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
          <div className="relative flex items-center justify-center mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
              <Icons.SpeechBubbleIcon className="bg-emerald-500 text-white text-md p-2 max-w-[280px]" direction="left">
                {exercise.question || "Simplifica esta fracción:"}
              </Icons.SpeechBubbleIcon>
          </div>
          <div className="flex flex-col items-center my-2 p-3 bg-yellow-50 rounded-lg shadow">
              <FractionPartDisplay numerator={fractionToSimplify.numerator} denominator={fractionToSimplify.denominator} size="lg" className="text-yellow-700" />
              {visualType === 'bar' && <FractionBar numerator={fractionToSimplify.numerator} denominator={fractionToSimplify.denominator} color="bg-yellow-500" width={160} height={32} />}
          </div>
          <p className="text-sm text-slate-500">Selecciona la fracción más simple de las opciones.</p>
      </div>
    );
  };
  
  return <MainContent />;
};
