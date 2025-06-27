
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface IdentificarParesImparesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (content: React.ReactNode | null) => void; // Added from standard
}

const CHARACTER_EMOJIS_PI = ['🤔', '🧐', '💡', '🤓', '🔢', '👍', '🎯', '💯', '✨', '👀'];


const OptionsKeypadComponent: React.FC<{
    selectedOption: 'par' | 'impar' | null;
    onOptionSelect: (option: 'par' | 'impar') => void;
    onVerify: () => void;
    isVerified: boolean;
    isCorrect: boolean | null; // To know if the current selection was correct after verification
    currentChallengeValue: number | null; // To display relevant info if needed
}> = ({ selectedOption, onOptionSelect, onVerify, isVerified, isCorrect, currentChallengeValue }) => {
    
    const getButtonClass = (optionValue: 'par' | 'impar') => {
        const isSelected = selectedOption === optionValue;
        if (isVerified) {
            if (isSelected) {
                return isCorrect ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
            } else if (optionValue === (currentChallengeValue !== null && currentChallengeValue % 2 === 0 ? 'par' : 'impar') && isCorrect === false) {
                // Optionally highlight correct if user was wrong, but not selected by user
                // return 'bg-green-200 text-green-700'; 
                 return 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
             return 'bg-slate-200 text-slate-500 cursor-not-allowed';
        }
        return isSelected ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-500' : 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
    };

    return (
        <div className="w-full flex flex-col space-y-3 p-2 mt-4">
            {(['par', 'impar'] as const).map((optionValue) => (
                <button
                    key={optionValue}
                    onClick={() => onOptionSelect(optionValue)}
                    disabled={isVerified && isCorrect === true}
                    className={`w-full p-4 rounded-lg text-center text-2xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${getButtonClass(optionValue)}`}
                    aria-label={`Opción: ${optionValue.charAt(0).toUpperCase() + optionValue.slice(1)}`}
                >
                    {optionValue.charAt(0).toUpperCase() + optionValue.slice(1)}
                </button>
            ))}
            <button
                onClick={onVerify}
                disabled={!selectedOption || (isVerified && isCorrect === true)}
                className={`w-full p-3 mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${!selectedOption || (isVerified && isCorrect === true)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
                }`}
            >
                <Icons.CheckIcon className="w-6 h-6 mr-2" />
                Verificar
            </button>
        </div>
    );
};


export const IdentificarParesImparesExercise: React.FC<IdentificarParesImparesExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent, 
}) => {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [isCurrentNumberEven, setIsCurrentNumberEven] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<'par' | 'impar' | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_PI[0]);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);

  const { maxNumber = 20 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);


  const generateNewChallenge = useCallback(() => {
    const newNum = Math.floor(Math.random() * (maxNumber + 1)); 
    setCurrentNumber(newNum);
    setIsCurrentNumberEven(newNum % 2 === 0);
    setSelectedOption(null);
    setIsVerified(false);
    setIsCorrectState(null);
    showFeedback(null);
    setCharacterEmoji(CHARACTER_EMOJIS_PI[Math.floor(Math.random() * CHARACTER_EMOJIS_PI.length)]);
  }, [maxNumber, showFeedback]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const handleOptionSelect = useCallback((option: 'par' | 'impar') => {
    if (isVerified && isCorrectState) return; 
    setSelectedOption(option);
    showFeedback(null); 
    if (isVerified && !isCorrectState) {
        setIsVerified(false);
        setIsCorrectState(null);
    }
  }, [isVerified, isCorrectState, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!selectedOption || (isVerified && isCorrectState)) return;
    setIsVerified(true);

    const selectedIsEven = selectedOption === 'par';
    const isCorrect = selectedIsEven === isCurrentNumberEven;
    setIsCorrectState(isCorrect);
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! El número ${currentNumber} es ${isCurrentNumberEven ? 'par' : 'impar'}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. El número ${currentNumber} es ${isCurrentNumberEven ? 'par' : 'impar'}.` });
    }
  }, [selectedOption, isCurrentNumberEven, currentNumber, showFeedback, onAttempt, isVerified, isCorrectState]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      setCustomKeypadContent(
        <OptionsKeypadComponent
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          isCorrect={isCorrectState}
          currentChallengeValue={currentNumber}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, selectedOption, handleOptionSelect, verifyAnswer, isVerified, isCorrectState, currentNumber]);


  const MainContent: React.FC = () => (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-6">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-28 h-28 flex items-center justify-center text-8xl">
          {characterEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-purple-500 text-white text-lg p-3 max-w-xs" direction="left">
          ¿Es <strong className="block text-4xl font-bold">{currentNumber}</strong> par o impar?
        </Icons.SpeechBubbleIcon>
      </div>
    </div>
  );
  
  return <MainContent />;
};
