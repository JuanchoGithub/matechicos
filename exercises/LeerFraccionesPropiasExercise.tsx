
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface LeerFraccionesPropiasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void; // Changed prop name
}

interface FractionChallengeDefinition {
  numerator: number;
  denominator: number;
  fractionString: string;
  correctWordsString: string;
  options: string[];
}

const FACE_EMOJIS = ['😀', '🤔', '😊', '🥳', '🤩', '🧐', '🙂', '😇', '😃', '😉', '😙', '😋', '😌', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐒'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const LeerFraccionesOptionsKeypad: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  return (
    <div className="w-full flex flex-col space-y-3 p-2 mt-4 max-w-xs mx-auto">
      {options.map((optionText, index) => {
        const isSelected = selectedOption === optionText;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
            if (isSelected) {
                buttonClass = optionText === correctAnswer
                    ? 'bg-green-500 text-white ring-2 ring-green-700' 
                    : 'bg-red-500 text-white ring-2 ring-red-700';
            } else if (optionText === correctAnswer) {
                // Optionally highlight the correct answer if user was wrong
                // buttonClass = 'bg-green-200 text-green-700 ring-2 ring-green-400';
            } else { // Neither selected nor correct (if verified and wrong)
                buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
        } else if (isSelected) { // Not verified yet, but selected
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        
        return (
          <button
            key={index}
            onClick={() => onSelect(optionText)}
            disabled={isVerified && selectedOption === correctAnswer}
            className={`w-full p-4 rounded-lg text-center text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${optionText}`}
          >
            {optionText}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)}
        className={`w-full p-3 mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${!selectedOption || (isVerified && selectedOption === correctAnswer)
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


export const LeerFraccionesPropiasExercise: React.FC<LeerFraccionesPropiasExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent, // Changed prop name
}) => {
  const [allShuffledChallengeDefinitions, setAllShuffledChallengeDefinitions] = useState<FractionChallengeDefinition[]>([]);
  const [currentChallengeDefIndex, setCurrentChallengeDefIndex] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<FractionChallengeDefinition | null>(null);
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  
  const { totalStars: totalStarsForExercise = 5 } = exercise.data || {}; 

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const challengeDefsFromProps = (exercise.data?.challenges || []) as FractionChallengeDefinition[];
    if (challengeDefsFromProps.length > 0) {
      setAllShuffledChallengeDefinitions(shuffleArray([...challengeDefsFromProps]));
      setCurrentChallengeDefIndex(0); 
    } else {
      setAllShuffledChallengeDefinitions([]);
      setCurrentChallenge(null); 
    }
  }, [exercise.data?.challenges, exercise.id]);


  const loadChallenge = useCallback(() => {
    if (allShuffledChallengeDefinitions.length > 0 && currentChallengeDefIndex < allShuffledChallengeDefinitions.length) {
      const nextChallengeDef = allShuffledChallengeDefinitions[currentChallengeDefIndex];
      setCurrentChallenge(nextChallengeDef);
      setShuffledOptions(shuffleArray([...nextChallengeDef.options]));
      setSelectedOption(null);
      setIsVerified(false);
      showFeedback(null);
      const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
      setCurrentEmoji(randomEmoji);
    } else if (allShuffledChallengeDefinitions.length > 0 && currentChallengeDefIndex >= allShuffledChallengeDefinitions.length) {
        onAttempt(true); 
    }
  }, [allShuffledChallengeDefinitions, currentChallengeDefIndex, showFeedback, onAttempt]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge, currentChallengeDefIndex]); 

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) {
        if (currentChallengeDefIndex < allShuffledChallengeDefinitions.length -1){
            setCurrentChallengeDefIndex(prev => prev + 1);
        }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentChallengeDefIndex, allShuffledChallengeDefinitions.length]);


  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentChallenge?.correctWordsString) return;
    setSelectedOption(option);
    showFeedback(null);
    if(isVerified && selectedOption !== currentChallenge?.correctWordsString) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctWordsString) ) return;
    setIsVerified(true);

    const isCorrect = selectedOption === currentChallenge.correctWordsString;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! ${currentChallenge.fractionString} se lee "${currentChallenge.correctWordsString}".` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Esa no es la forma correcta. ¡Intenta otra vez!' });
    }
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);
  
  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) { // Changed prop name
      setCustomKeypadContent(
        <LeerFraccionesOptionsKeypad
          options={shuffledOptions}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswer={currentChallenge.correctWordsString}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) { // Changed prop name
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, shuffledOptions, selectedOption, handleOptionSelect, verifyAnswer, isVerified]); // Changed prop name


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando fracción...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-6">
          <div className="relative flex items-center justify-center mb-4">
              <div className="w-28 h-28 flex items-center justify-center text-8xl">
                {currentEmoji}
              </div>
              <Icons.SpeechBubbleIcon className="bg-purple-500 text-white text-lg p-3 max-w-xs" direction="left">
                Fracción: <strong className="block text-4xl font-bold" aria-label={`Fracción ${currentChallenge.fractionString.replace(/\s\/\s/, ' sobre ')}`}>
                    {currentChallenge.fractionString}
                </strong>
              </Icons.SpeechBubbleIcon>
          </div>
      </div>
    );
  };
  
  return <MainContent />;
};
