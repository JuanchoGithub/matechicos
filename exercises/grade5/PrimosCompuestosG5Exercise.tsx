
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PrimoCompuestoChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray }from '../../utils';

interface PrimosCompuestosG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_PRIMOS = ['🤔', '🧐', '💡', '🔢', '✨', '🕵️'];

// Helper to determine if a number is prime
const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};


// Local OptionsKeypad component
const OptionsKeypad: React.FC<{
    selectedOption: 'primo' | 'compuesto' | null;
    onSelect: (option: 'primo' | 'compuesto') => void;
    onVerify: () => void;
    isVerified: boolean;
    correctAnswerIsPrime: boolean | null;
}> = ({ selectedOption, onSelect, onVerify, isVerified, correctAnswerIsPrime }) => {
    const options = [
        { id: 'primo', label: 'Primo' },
        { id: 'compuesto', label: 'Compuesto' }
    ];

    return (
        <div className="w-full flex flex-col space-y-2 p-2 mt-4">
            {options.map(opt => {
                const isSelected = selectedOption === opt.id;
                const isCorrectSelection = (opt.id === 'primo' && correctAnswerIsPrime === true) || (opt.id === 'compuesto' && correctAnswerIsPrime === false);
                let buttonClass = 'bg-white text-black hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

                if (isVerified) {
                    if (isSelected) {
                        buttonClass = isCorrectSelection ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
                    } else if (isCorrectSelection) {
                        // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if not selected
                    } else {
                        buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
                    }
                } else if (isSelected) {
                    buttonClass = 'bg-sky-100 text-black ring-2 ring-sky-500';
                }

                return (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id as 'primo' | 'compuesto')}
                        disabled={isVerified && isCorrectSelection}
                        className={`w-full p-4 rounded-lg text-center text-lg font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
                        aria-label={`Opción: ${opt.label}`}
                    >
                        {opt.label}
                    </button>
                );
            })}
            <button
                onClick={onVerify}
                disabled={!selectedOption || (isVerified && correctAnswerIsPrime === (selectedOption === 'primo'))}
                className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${!selectedOption || (isVerified && correctAnswerIsPrime === (selectedOption === 'primo'))
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


export const PrimosCompuestosG5Exercise: React.FC<PrimosCompuestosG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [challenge, setChallenge] = useState<PrimoCompuestoChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<'primo' | 'compuesto' | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_PRIMOS[0]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);

  const { totalStars = 10, numberRange = [2, 100] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    // Create a pool of numbers for the exercise
    const numberPool = Array.from({ length: numberRange[1] - numberRange[0] + 1 }, (_, i) => i + numberRange[0]);
    setAvailableNumbers(shuffleArray(numberPool));
  }, [exercise.id, numberRange]);

  const loadNewChallenge = useCallback(() => {
    let currentPool = availableNumbers;
    if (currentPool.length === 0) {
      const numberPool = Array.from({ length: numberRange[1] - numberRange[0] + 1 }, (_, i) => i + numberRange[0]);
      currentPool = shuffleArray(numberPool);
    }
    
    if (currentPool.length > 0) {
        const numToCheck = currentPool[0];
        setChallenge({ numberToCheck: numToCheck, isPrime: isPrime(numToCheck) });
        setAvailableNumbers(prev => prev.slice(1));
        setCharacterEmoji(FACE_EMOJIS_PRIMOS[Math.floor(Math.random() * FACE_EMOJIS_PRIMOS.length)]);
    } else {
        onAttempt(true); // All numbers from range used
        return;
    }
    
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableNumbers, numberRange, showFeedback, onAttempt]);

  useEffect(() => {
    if (availableNumbers.length > 0 && !challenge) {
      loadNewChallenge();
    }
  }, [availableNumbers, challenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleSelectOption = useCallback((option: 'primo' | 'compuesto') => {
    if (isVerified && selectedOption === option && challenge?.isPrime === (option === 'primo')) return;
    setSelectedOption(option);
    showFeedback(null);
    if(isVerified) setIsVerified(false);
  }, [isVerified, selectedOption, challenge, showFeedback]);

  const handleVerify = useCallback(() => {
    if (!challenge || selectedOption === null) return;
    if (isVerified && selectedOption === (challenge.isPrime ? 'primo' : 'compuesto')) return;
    
    setIsVerified(true);
    const correct = (selectedOption === 'primo' && challenge.isPrime) || (selectedOption === 'compuesto' && !challenge.isPrime);
    onAttempt(correct);
    if(correct) {
      showFeedback({ type: 'correct', message: `¡Correcto! ${challenge.numberToCheck} es ${challenge.isPrime ? 'primo' : 'compuesto'}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. El número ${challenge.numberToCheck} es ${challenge.isPrime ? 'primo' : 'compuesto'}.` });
      setIsVerified(false); // Allow re-try
    }
  }, [challenge, selectedOption, onAttempt, showFeedback, isVerified]);


  useEffect(() => {
    if (setCustomKeypadContent && challenge) {
      setCustomKeypadContent(
        <OptionsKeypad
          selectedOption={selectedOption}
          onSelect={handleSelectOption}
          onVerify={handleVerify}
          isVerified={isVerified}
          correctAnswerIsPrime={challenge.isPrime}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, challenge, selectedOption, isVerified, handleSelectOption, handleVerify]);


  if (!challenge) {
    return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center w-full">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
          {characterEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-green-500 text-white text-md p-3 max-w-xs" direction="left">
          {exercise.question || '¿Este número es primo o compuesto?'}
        </Icons.SpeechBubbleIcon>
      </div>
      
      <div className="text-6xl sm:text-8xl font-bold text-sky-600 p-4 bg-white rounded-xl shadow-lg border-2 border-slate-200">
        {challenge.numberToCheck}
      </div>
      
      <p className="text-slate-500 mt-4 text-sm">Selecciona una opción en el panel de la derecha.</p>
    </div>
  );
};
