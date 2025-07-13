
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, DivisibilidadChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface ReglasDivisibilidadG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_DIVISIBILIDAD = ['🤔', '🧐', '💡', '🔢', '✔️', '✖️', '🕵️'];

// Keypad Component
const OptionsKeypad: React.FC<{
    onSelect: (option: boolean) => void;
    onVerify: () => void;
    selectedOption: boolean | null;
    isVerified: boolean;
    correctAnswer: boolean | null;
}> = ({ onSelect, onVerify, selectedOption, isVerified, correctAnswer }) => {
    const options = [
        { label: 'Sí, es divisible', value: true },
        { label: 'No, no es divisible', value: false },
    ];

    return (
        <div className="w-full flex flex-col space-y-2 p-2 mt-4">
            {options.map(opt => {
                const isSelected = selectedOption === opt.value;
                let buttonClass = 'bg-white text-black hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

                if (isVerified) {
                    if (isSelected) {
                        buttonClass = opt.value === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
                    } else {
                        buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
                    }
                } else if (isSelected) {
                    buttonClass = 'bg-sky-100 text-black ring-2 ring-sky-500';
                }

                return (
                    <button
                        key={String(opt.value)}
                        onClick={() => onSelect(opt.value)}
                        disabled={isVerified && selectedOption === correctAnswer}
                        className={`w-full p-4 rounded-lg text-center text-lg font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
                        aria-label={`Opción: ${opt.label}`}
                    >
                        {opt.label}
                    </button>
                );
            })}
            <button
                onClick={onVerify}
                disabled={selectedOption === null || (isVerified && selectedOption === correctAnswer)}
                className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${selectedOption === null || (isVerified && selectedOption === correctAnswer)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
                }`}
            >
                <Icons.CheckIcon className="w-5 h-5 mr-2" />
                Verificar
            </button>
        </div>
    );
};


export const ReglasDivisibilidadG5Exercise: React.FC<ReglasDivisibilidadG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DivisibilidadChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_DIVISIBILIDAD[0]);
  const [availableChallenges, setAvailableChallenges] = useState<DivisibilidadChallenge[]>([]);

  const { totalStars = 10, numberRange = [10, 1000] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateDynamicChallenge = useCallback((): DivisibilidadChallenge => {
    const divisors: (2 | 3 | 5 | 9 | 10)[] = [2, 3, 5, 9, 10];
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    
    let numberToCheck: number;
    let isDivisible: boolean = Math.random() < 0.6; // 60% chance to be divisible
    
    let attempts = 0;
    do {
      numberToCheck = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
      attempts++;
      if (attempts > 50) { // Avoid infinite loop
          isDivisible = (numberToCheck % divisor === 0);
          break;
      }
    } while ( (isDivisible && numberToCheck % divisor !== 0) || (!isDivisible && numberToCheck % divisor === 0) );

    const ruleExplanation = {
      2: "Termina en cifra par (0, 2, 4, 6, 8).",
      3: "La suma de sus cifras es múltiplo de 3.",
      5: "Termina en 0 o 5.",
      9: "La suma de sus cifras es múltiplo de 9.",
      10: "Termina en 0."
    }[divisor];

    return { numberToCheck, divisor, isDivisible, ruleExplanation };
  }, [numberRange]);

  useEffect(() => {
    const predefinedChallenges = (exercise.data.challenges as DivisibilidadChallenge[])?.filter(c => c.numberToCheck);
    if (predefinedChallenges && predefinedChallenges.length > 0) {
      setAvailableChallenges(shuffleArray(predefinedChallenges));
    } else {
      const dynamicChallenges = Array.from({ length: totalStars * 2 }, () => generateDynamicChallenge());
      setAvailableChallenges(dynamicChallenges);
    }
  }, [exercise.id, exercise.data.challenges, totalStars, generateDynamicChallenge]);
  
  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0) {
        // Pool exhausted, generate a new one if needed, or finish.
        const dynamicChallenges = Array.from({ length: 5 }, () => generateDynamicChallenge());
        pool = dynamicChallenges;
    }
    
    if (pool.length > 0) {
        const nextChallenge = pool[0];
        setCurrentChallenge(nextChallenge);
        setAvailableChallenges(prev => prev.slice(1));
        setCharacterEmoji(FACE_EMOJIS_DIVISIBILIDAD[Math.floor(Math.random() * FACE_EMOJIS_DIVISIBILIDAD.length)]);
    } else {
        onAttempt(true); // End of exercise
        return;
    }
    
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, generateDynamicChallenge, onAttempt, showFeedback]);

  useEffect(() => {
    if (availableChallenges.length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [availableChallenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleSelectOption = useCallback((option: boolean) => {
    if (isVerified && selectedOption === currentChallenge?.isDivisible) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null) return;
    if (isVerified && selectedOption === currentChallenge.isDivisible) return;
    
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.isDivisible;
    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. El número ${currentChallenge.isDivisible ? 'SÍ' : 'NO'} es divisible por ${currentChallenge.divisor}.` });
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) {
      setCustomKeypadContent(
        <OptionsKeypad
          selectedOption={selectedOption}
          onSelect={handleSelectOption}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswer={currentChallenge.isDivisible}
        />
      );
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, currentChallenge, selectedOption, isVerified, handleSelectOption, verifyAnswer]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center p-4 text-center w-full">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {characterEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md p-3 max-w-xs" direction="left">
            ¿El número <strong className="block text-2xl">{currentChallenge.numberToCheck}</strong> es divisible por <strong className="block text-2xl">{currentChallenge.divisor}</strong>?
          </Icons.SpeechBubbleIcon>
        </div>
        
        {currentChallenge.ruleExplanation && (
          <p className="text-slate-500 mt-2 text-sm italic">
            <strong>Pista:</strong> {currentChallenge.ruleExplanation}
          </p>
        )}

        <p className="text-slate-600 mt-6">Selecciona una opción en el panel de la derecha.</p>
      </div>
    );
  };

  return <MainContent />;
};
