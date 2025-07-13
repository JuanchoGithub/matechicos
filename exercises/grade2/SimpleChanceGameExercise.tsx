
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, SimpleChanceGameScenario, SimpleChanceGameOption } from '../../types';
import { Icons } from '../../components/icons';

interface SimpleChanceGameExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const CHARACTER_EMOJIS_CHANCE = ['🤔', '🧐', '💡', '🎲', '❓', '🔮', '✨', '🤞'];
const DEFAULT_EMOJI_CHANCE = '❓';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const ChanceGameOptionsKeypad: React.FC<{
  options: SimpleChanceGameOption[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctOptionId: string | null;
}> = ({ options, selectedOptionId, onSelect, onVerify, isVerified, correctOptionId }) => {
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctOptionId
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (opt.id === correctOptionId) {
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
            disabled={isVerified && selectedOptionId === correctOptionId}
            className={`w-full p-3 rounded-lg text-center text-md sm:text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionId || (isVerified && selectedOptionId === correctOptionId)}
        className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOptionId || (isVerified && selectedOptionId === correctOptionId))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const SimpleChanceGameExercise: React.FC<SimpleChanceGameExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<SimpleChanceGameScenario | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(DEFAULT_EMOJI_CHANCE);
  const [availableScenarios, setAvailableScenarios] = useState<SimpleChanceGameScenario[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarios as SimpleChanceGameScenario[]]));
    }
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (scenarios as SimpleChanceGameScenario[]).length > 0) {
      scenarioPool = shuffleArray([...scenarios as SimpleChanceGameScenario[]]);
      setAvailableScenarios(scenarioPool);
    }

    if (scenarioPool.length > 0) {
      const nextScenario = {...scenarioPool[0]};
      nextScenario.options = shuffleArray([...nextScenario.options]); // Shuffle options for this specific challenge instance
      setCurrentChallenge(nextScenario);
      setAvailableScenarios(prev => prev.slice(1));
      setCharacterEmoji(nextScenario.emoji || CHARACTER_EMOJIS_CHANCE[Math.floor(Math.random() * CHARACTER_EMOJIS_CHANCE.length)]);
    } else {
      onAttempt(true); // No more scenarios, signal success to scaffold
      return;
    }
    setSelectedOptionId(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableScenarios, scenarios, showFeedback, onAttempt]);

  useEffect(() => {
    if ((scenarios as SimpleChanceGameScenario[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [scenarios, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal !== prevAdvanceSignalRef.current && advanceToNextChallengeSignal > 0) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctOptionId) return;
    setSelectedOptionId(optionId);
    showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctOptionId) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge?.correctOptionId, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctOptionId)) return;
    setIsVerified(true);
    const correctOption = currentChallenge.options.find(opt => opt.id === currentChallenge.correctOptionId);
    const isCorrect = selectedOptionId === currentChallenge.correctOptionId;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! La respuesta es ${correctOption?.label.toLowerCase()}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. La respuesta era: ${correctOption?.label.toLowerCase()}.` });
    }
  }, [currentChallenge, selectedOptionId, showFeedback, onAttempt, isVerified]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) {
      setCustomKeypadContent(
        <ChanceGameOptionsKeypad
          options={currentChallenge.options}
          selectedOptionId={selectedOptionId}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctOptionId={currentChallenge?.correctOptionId || null}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando juego...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {characterEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-lime-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallenge.contextText}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="text-3xl sm:text-5xl font-bold text-slate-700 my-3">{currentChallenge.visualContext}</div>
        <p className="text-lg sm:text-xl text-slate-700 p-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm min-h-[60px] flex items-center justify-center">
          {currentChallenge.questionText}
        </p>
      </div>
    );
  };

  return <MainContent />;
};
