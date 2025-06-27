
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';
import { generateProperFraction } from '../utils'; 

interface RepresentarFraccionesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void; // Changed prop name
}

interface FractionChallenge {
  numerator: number;
  denominator: number;
}

const FACE_EMOJIS = ['🎨', '🤔', '🧐', '💡', '📏', '🍰', '🍕', '🍫', '👍', '🎯'];

// Keypad Component for Verification Button
const RepresentarFraccionesKeypad: React.FC<{
  onVerify: () => void;
  isVerified: boolean;
  selectedSegmentsCount: number;
  targetNumerator: number | null;
}> = ({ onVerify, isVerified, selectedSegmentsCount, targetNumerator }) => {
  return (
    <div className="w-full flex flex-col items-center space-y-3 p-2 mt-4 max-w-xs mx-auto">
      <button
        onClick={onVerify}
        disabled={isVerified && selectedSegmentsCount === targetNumerator}
        className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(isVerified && selectedSegmentsCount === targetNumerator)
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        Verificar
      </button>
    </div>
  );
};

export const RepresentarFraccionesExercise: React.FC<RepresentarFraccionesExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent, // Changed prop name
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<FractionChallenge | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<boolean[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);

  const { maxDenominator = 8 } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const initializeChallenge = useCallback(() => {
    const newFraction = generateProperFraction(maxDenominator); 
    setCurrentChallenge(newFraction);
    setSelectedSegments(new Array(newFraction.denominator).fill(false));
    showFeedback(null);
    setIsVerified(false);
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
  }, [maxDenominator, showFeedback]);

  useEffect(() => {
    initializeChallenge();
  }, [initializeChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        initializeChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, initializeChallenge]);


  const handleSegmentClick = (index: number) => {
    if (isVerified && selectedSegments.filter(Boolean).length === currentChallenge?.numerator) return; 

    setSelectedSegments(prev => {
      const newSelected = [...prev];
      newSelected[index] = !newSelected[index];
      return newSelected;
    });
    showFeedback(null);
    if(isVerified) setIsVerified(false); 
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || (isVerified && selectedSegments.filter(Boolean).length === currentChallenge.numerator)) return;

    setIsVerified(true);
    const numSelected = selectedSegments.filter(Boolean).length;
    const isCorrect = numSelected === currentChallenge.numerator;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Representación correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'No es correcto. Revisa cuántas partes debes seleccionar.' });
      setIsVerified(false); 
    }
  }, [currentChallenge, selectedSegments, showFeedback, onAttempt, isVerified]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) { // Changed prop name
      setCustomKeypadContent(
        <RepresentarFraccionesKeypad
          onVerify={verifyAnswer}
          isVerified={isVerified}
          selectedSegmentsCount={selectedSegments.filter(Boolean).length}
          targetNumerator={currentChallenge?.numerator ?? null}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) { // Changed prop name
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, verifyAnswer, isVerified, selectedSegments]); // Changed prop name

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando fracción...</div>;
    }

    const { numerator, denominator } = currentChallenge;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-pink-500 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            Representa: <strong className="block text-xl sm:text-2xl font-bold">{numerator}/{denominator}</strong>
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full max-w-md p-2">
          <div className="flex border-2 border-slate-400 rounded-md overflow-hidden h-16 sm:h-20 shadow-inner">
            {Array.from({ length: denominator }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleSegmentClick(i)}
                className={`flex-1 transition-colors duration-150 ease-in-out border-r border-slate-300 last:border-r-0
                            ${selectedSegments[i] ? 'bg-sky-500 hover:bg-sky-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                aria-label={`Segmento ${i + 1} de ${denominator}. ${selectedSegments[i] ? 'Seleccionado' : 'No seleccionado'}.`}
                disabled={isVerified && selectedSegments.filter(Boolean).length === currentChallenge.numerator}
              >
                <span className="sr-only">{i+1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
