
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, SimpleProbabilityScenario, ProbabilityOption, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ExpresarProbabilidadSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_EXPRESAR = ['🎲', '🎯', '🤔', '🧐', '💡', '✨', '🤞', '🔢'];
const DEFAULT_EMOJI_EXPRESAR = '🎲';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const ExpresarProbOptionsKeypad: React.FC<{
  options: ProbabilityOption[];
  selectedOption: ProbabilityOption | null;
  onSelect: (option: ProbabilityOption) => void;
  onVerify: () => void;
  isVerified: boolean;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified }) => {
  if (!options || options.length === 0) {
    return null; 
  }
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {options.map((opt, index) => {
        const isSelected = selectedOption?.text === opt.text;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.isCorrect 
              ? 'bg-green-500 text-white ring-2 ring-green-700' 
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (opt.isCorrect) {
            // Correct answer, but user didn't pick it.
            // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight
          } else { // Neither selected nor correct (if verified and wrong)
             buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) { // Not verified yet, but selected
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        
        return ( // Explicit return
          <button
            key={index}
            onClick={() => onSelect(opt)}
            disabled={isVerified && selectedOption?.isCorrect && selectedOption?.text === opt.text}
            className={`w-full p-3 rounded-lg text-center text-md sm:text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${opt.text}`}
          >
            {opt.text}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption?.isCorrect)}
        className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOption || (isVerified && selectedOption?.isCorrect))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        Verificar
      </button>
    </div>
  );
};

export const ExpresarProbabilidadSimpleExercise: React.FC<ExpresarProbabilidadSimpleExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<SimpleProbabilityScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProbabilityOption | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_EMOJI_EXPRESAR);
  const [availableChallenges, setAvailableChallenges] = useState<SimpleProbabilityScenario[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) {
      setAvailableChallenges(shuffleArray([...scenarios as SimpleProbabilityScenario[]]));
    }
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && (scenarios as SimpleProbabilityScenario[]).length > 0) {
      challengePool = shuffleArray([...scenarios as SimpleProbabilityScenario[]]);
      setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = {...challengePool[0]};
      nextChallenge.options = shuffleArray([...nextChallenge.options]); // Shuffle options for this specific challenge instance
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCurrentEmoji(nextChallenge.emoji || FACE_EMOJIS_EXPRESAR[Math.floor(Math.random() * FACE_EMOJIS_EXPRESAR.length)]);
    } else {
      onAttempt(true); // Signal completion of internal challenges
      return;
    }
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, scenarios, showFeedback, onAttempt]);

  useEffect(() => {
    if ((scenarios as SimpleProbabilityScenario[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [scenarios, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1) ) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: ProbabilityOption) => {
    if (isVerified && selectedOption?.isCorrect && selectedOption.text === option.text) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && (!selectedOption?.isCorrect || selectedOption.text !== option.text)) setIsVerified(false);
  }, [isVerified, selectedOption, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption.isCorrect)) return;
    setIsVerified(true);
    const isCorrect = selectedOption.isCorrect;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      const correctAnswerText = currentChallenge.options.find(opt => opt.isCorrect)?.text || "la opción correcta";
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${correctAnswerText}.` });
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);
  
  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) {
      setCustomKeypadContent(
        <ExpresarProbOptionsKeypad
          options={currentChallenge.options}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
        />
      );
    } else if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema de probabilidad...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallenge.contextText}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-slate-700 my-4 p-2 bg-slate-100 rounded-md shadow">
          {currentChallenge.visualContext}
        </div>
        <p className="text-lg sm:text-xl text-slate-700 p-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm min-h-[60px] flex items-center justify-center">
          {currentChallenge.eventToEvaluate}
        </p>
      </div>
    );
  };
  
  return <MainContent />;
};
