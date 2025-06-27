
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, ProbabilityComparisonScenario, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface CompararProbabilidadesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

type ComparisonResultType = 'A_MAS_PROBABLE' | 'B_MAS_PROBABLE' | 'IGUAL_PROBABLE';

interface ActiveChallengeData extends ProbabilityComparisonScenario {
  correctComparison: ComparisonResultType;
  optionLabels: {
    aMoreProbable: string;
    bMoreProbable: string;
    equallyProbable: string;
  };
}

const FACE_EMOJIS_COMPARE = ['⚖️', '🤔', '🧐', '💡', '🎲', '❓', '✨', '🤞'];
const DEFAULT_EMOJI_COMPARE = '⚖️';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const CompararProbOptionsKeypad: React.FC<{
  options: {id: ComparisonResultType, label: string}[];
  selectedOption: ComparisonResultType | null;
  onSelect: (option: ComparisonResultType) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctComparison: ComparisonResultType | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctComparison }) => {
   if (!options || options.length === 0) {
    return null; 
   }
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {options.map((opt) => {
        const isSelected = selectedOption === opt.id;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctComparison
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (opt.id === correctComparison) {
            // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isVerified && selectedOption === correctComparison}
            className={`w-full p-3 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption === correctComparison)}
        className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOption || (isVerified && selectedOption === correctComparison))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const CompararProbabilidadesExercise: React.FC<CompararProbabilidadesExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ActiveChallengeData | null>(null);
  const [selectedOption, setSelectedOption] = useState<ComparisonResultType | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_EMOJI_COMPARE);
  const [availableScenarios, setAvailableScenarios] = useState<ProbabilityComparisonScenario[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarios as ProbabilityComparisonScenario[]]));
    }
  }, [scenarios]);

  const loadNewChallenge = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (scenarios as ProbabilityComparisonScenario[]).length > 0) {
      scenarioPool = shuffleArray([...scenarios as ProbabilityComparisonScenario[]]);
      setAvailableScenarios(scenarioPool);
    }

    if (scenarioPool.length > 0) {
      const nextScenario = scenarioPool[0];
      const probA = nextScenario.eventA.total > 0 ? nextScenario.eventA.favorable / nextScenario.eventA.total : 0;
      const probB = nextScenario.eventB.total > 0 ? nextScenario.eventB.favorable / nextScenario.eventB.total : 0;
      let correctComparison: ComparisonResultType;
      if (probA > probB) correctComparison = 'A_MAS_PROBABLE';
      else if (probB > probA) correctComparison = 'B_MAS_PROBABLE';
      else correctComparison = 'IGUAL_PROBABLE';
      const optionLabels = {
        aMoreProbable: `${nextScenario.eventA.text} es más probable.`,
        bMoreProbable: `${nextScenario.eventB.text} es más probable.`,
        equallyProbable: "Ambos sucesos son igualmente probables."
      };
      setCurrentChallenge({ ...nextScenario, correctComparison, optionLabels });
      setAvailableScenarios(prev => prev.slice(1));
      setCurrentEmoji(nextScenario.emoji || FACE_EMOJIS_COMPARE[Math.floor(Math.random() * FACE_EMOJIS_COMPARE.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableScenarios, scenarios, showFeedback, onAttempt]);

  useEffect(() => {
    if ((scenarios as ProbabilityComparisonScenario[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [scenarios, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignalRef.current && advanceToNextChallengeSignal > 0) {
      loadNewChallenge();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: ComparisonResultType) => {
    if (isVerified && selectedOption === currentChallenge?.correctComparison) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctComparison) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge?.correctComparison, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctComparison)) return;
    setIsVerified(true);
    const { correctComparison, optionLabels } = currentChallenge;
    let correctMessageText = "";
    if (correctComparison === 'A_MAS_PROBABLE') correctMessageText = optionLabels.aMoreProbable;
    else if (correctComparison === 'B_MAS_PROBABLE') correctMessageText = optionLabels.bMoreProbable;
    else correctMessageText = optionLabels.equallyProbable;
    const isCorrect = selectedOption === correctComparison;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! ${correctMessageText}` });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. La respuesta correcta es: "${correctMessageText}"` });
    }
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        const keypadOptions = [
          {id: 'A_MAS_PROBABLE', label: currentChallenge.optionLabels.aMoreProbable},
          {id: 'B_MAS_PROBABLE', label: currentChallenge.optionLabels.bMoreProbable},
          {id: 'IGUAL_PROBABLE', label: currentChallenge.optionLabels.equallyProbable},
        ] as {id: ComparisonResultType, label: string}[];

        setCustomKeypadContent(
          <CompararProbOptionsKeypad
            options={keypadOptions}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            onVerify={verifyAnswer}
            isVerified={isVerified}
            correctComparison={currentChallenge?.correctComparison || null}
          />
        );
      } else {
         setCustomKeypadContent(null);
      }
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando comparación...</div>;
    }
    const { eventA, eventB, contextText } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-pink-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {contextText}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-blue-700 mb-1">Suceso A:</h4>
            <p className="text-xs text-slate-600">{eventA.text}</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{eventA.visual}</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-green-700 mb-1">Suceso B:</h4>
            <p className="text-xs text-slate-600">{eventB.text}</p>
            <p className="text-lg font-bold text-green-600 mt-1">{eventB.visual}</p>
          </div>
        </div>
      </div>
    );
  };

  return <MainContent />;
};
