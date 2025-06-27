
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, FrecuenciaScenario, FrequencyLevel, FREQUENCY_LEVEL_LABELS, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface FrecuenciaSucesosExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_FRECUENCIA = ['🤔', '🧐', '💡', '🗓️', '🔄', '❓', '✨', '🕰️'];
const DEFAULT_EMOJI_FRECUENCIA = '❓';

const FREQUENCY_OPTIONS_CONFIG: { id: FrequencyLevel; label: string; color: string }[] = [
  { id: 'nunca', label: FREQUENCY_LEVEL_LABELS.nunca, color: 'bg-red-500 hover:bg-red-600' },
  { id: 'a_veces', label: FREQUENCY_LEVEL_LABELS.a_veces, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'siempre', label: FREQUENCY_LEVEL_LABELS.siempre, color: 'bg-green-500 hover:bg-green-600' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const FrecuenciaOptionsKeypad: React.FC<{
  optionsConfig: typeof FREQUENCY_OPTIONS_CONFIG;
  selectedOption: FrequencyLevel | null;
  onSelect: (option: FrequencyLevel) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctFrequency: FrequencyLevel | null;
}> = ({ optionsConfig, selectedOption, onSelect, onVerify, isVerified, correctFrequency }) => {
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {optionsConfig.map((opt) => {
        const isSelected = selectedOption === opt.id;
        let buttonClass = `text-white font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${opt.color}`;

        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctFrequency
              ? `${opt.color} ring-4 ring-offset-2 ring-yellow-300`
              : `${opt.color} opacity-50 ring-2 ring-black`;
          } else if (opt.id === correctFrequency) {
            // buttonClass = `${opt.color} opacity-70 ring-2 ring-yellow-300`;
          } else {
            buttonClass += ' opacity-60 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = `${opt.color} ring-4 ring-offset-1 ring-white/70`;
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isVerified && selectedOption === correctFrequency}
            className={`w-full p-3 rounded-lg text-center text-md sm:text-lg ${buttonClass}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption === correctFrequency)}
        className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOption || (isVerified && selectedOption === correctFrequency))
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-600 focus:ring-2 focus:ring-amber-700'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const FrecuenciaSucesosExercise: React.FC<FrecuenciaSucesosExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<FrecuenciaScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<FrequencyLevel | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_EMOJI_FRECUENCIA);
  const [availableChallenges, setAvailableChallenges] = useState<FrecuenciaScenario[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) {
      setAvailableChallenges(shuffleArray([...scenarios as FrecuenciaScenario[]]));
    }
  }, [scenarios]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && (scenarios as FrecuenciaScenario[]).length > 0) {
      challengePool = shuffleArray([...scenarios as FrecuenciaScenario[]]);
      setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCurrentEmoji(nextChallenge.emoji || FACE_EMOJIS_FRECUENCIA[Math.floor(Math.random() * FACE_EMOJIS_FRECUENCIA.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, scenarios, showFeedback, onAttempt]);

  useEffect(() => {
    if ((scenarios as FrecuenciaScenario[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [scenarios, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignalRef.current && advanceToNextChallengeSignal > 0) {
      loadNewChallenge();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: FrequencyLevel) => {
    if (isVerified && selectedOption === currentChallenge?.correctFrequency) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctFrequency) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge?.correctFrequency, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctFrequency)) return;
    setIsVerified(true);
    const correctFrequency = currentChallenge.correctFrequency;
    const correctLabel = FREQUENCY_LEVEL_LABELS[correctFrequency];
    const isCorrect = selectedOption === correctFrequency;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! El suceso ocurre ${correctLabel.toLowerCase()}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. Este suceso ocurre ${correctLabel.toLowerCase()}.` });
    }
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) {
      setCustomKeypadContent(
        <FrecuenciaOptionsKeypad
          optionsConfig={FREQUENCY_OPTIONS_CONFIG}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctFrequency={currentChallenge?.correctFrequency || null}
        />
      );
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando suceso...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-2 max-w-[280px]" direction="left">
            Analiza el suceso:
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-lg sm:text-xl text-slate-700 p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm min-h-[80px] flex items-center justify-center">
          {currentChallenge.eventText}
        </p>
      </div>
    );
  };

  return <MainContent />;
};
