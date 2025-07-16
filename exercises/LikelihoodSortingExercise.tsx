import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, LikelihoodEventScenario, LikelihoodLevel, ExerciseScaffoldApi, LIKELIHOOD_LEVEL_LABELS } from '../types';
import { Icons } from '../components/icons';

interface LikelihoodSortingExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

const DEFAULT_EMOJI = '🌦️';

const LIKELIHOOD_OPTIONS_CONFIG: { id: LikelihoodLevel; label: string; color: string }[] = [
  { id: 'certain', label: LIKELIHOOD_LEVEL_LABELS.certain, color: 'bg-green-500 hover:bg-green-600' },
  { id: 'likely', label: LIKELIHOOD_LEVEL_LABELS.likely, color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'unlikely', label: LIKELIHOOD_LEVEL_LABELS.unlikely, color: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'impossible', label: LIKELIHOOD_LEVEL_LABELS.impossible, color: 'bg-red-500 hover:bg-red-600' },
];

// Utility function to shuffle arrays
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Keypad Component for Options
const LikelihoodOptionsKeypad: React.FC<{
  optionsConfig: typeof LIKELIHOOD_OPTIONS_CONFIG;
  selectedOption: LikelihoodLevel | null;
  onSelect: (option: LikelihoodLevel) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctLikelihood: LikelihoodLevel | null;
}> = ({ optionsConfig, selectedOption, onSelect, onVerify, isVerified, correctLikelihood }) => {
  if (!optionsConfig || optionsConfig.length === 0) {
    return null; 
  }
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {optionsConfig.map((opt) => {
        const isSelected = selectedOption === opt.id;
        let buttonClass = `text-white font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${opt.color}`;

        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctLikelihood
              ? `${opt.color} ring-4 ring-offset-2 ring-yellow-400`
              : `${opt.color} opacity-50 ring-2 ring-black`;
          } else if (opt.id === correctLikelihood) {
            buttonClass = `${opt.color} opacity-70 ring-2 ring-yellow-300`;
          } else {
            buttonClass += ' opacity-60 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = `${opt.color} ring-4 ring-offset-1 ring-white/70`;
        }

        return (
          <button
            key={opt.id}
            onClick={() => !isVerified && onSelect(opt.id)}
            className={`${buttonClass} py-3 px-4 rounded-lg flex items-center justify-center text-lg sm:text-xl`}
            disabled={isVerified}
          >
            <span>{opt.label}</span>
            {isVerified && isSelected && opt.id === correctLikelihood && (
              <Icons.CheckIcon className="ml-3 w-6 h-6" />
            )}
            {isVerified && isSelected && opt.id !== correctLikelihood && (
              <span className="ml-3 text-xl">❌</span>
            )}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || isVerified}
        className={`mt-4 py-3 px-4 rounded-lg flex items-center justify-center text-lg sm:text-xl ${
          !selectedOption
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        } ${isVerified ? 'hidden' : ''}`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" />
        Verificar
      </button>
    </div>
  );
};

// Card component for event
const EventCard: React.FC<{
  eventText: string;
  emoji: string;
  binId: LikelihoodLevel | null;
  isCorrect: boolean | null;
}> = ({ eventText, emoji, binId, isCorrect }) => {
  let cardClass = "transform transition-all duration-300 bg-white rounded-lg p-4 shadow-lg border-2";
  
  if (binId !== null) {
    if (isCorrect === true) {
      cardClass += " border-green-500 shadow-green-200";
    } else if (isCorrect === false) {
      cardClass += " border-red-500 shadow-red-200";
    } else {
      cardClass += " border-gray-300";
    }
  } else {
    cardClass += " border-gray-300";
  }
  
  return (
    <div className={cardClass}>
      <div className="text-4xl mb-2 flex justify-center">{emoji}</div>
      <p className="text-center font-medium text-gray-800">{eventText}</p>
    </div>
  );
};

// Main Exercise Component
export const LikelihoodSortingExercise: React.FC<LikelihoodSortingExerciseProps> = ({ 
  exercise, 
  scaffoldApi,
  setCustomKeypadContent 
}) => {
  const { onAttempt, showFeedback, onSetCompleted, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const [scenariosPool, setScenariosPool] = useState<LikelihoodEventScenario[]>(
    Array.isArray(exercise.data) ? shuffleArray([...exercise.data]) : []
  );

  const [currentScenario, setCurrentScenario] = useState<LikelihoodEventScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<LikelihoodLevel | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [forecastUnlocked, setForecastUnlocked] = useState(false);

  // Load a new challenge
  const loadNewChallenge = useCallback(() => {
    if (scenariosPool.length === 0) {
      // If we've run out of scenarios, we could reset or end the exercise
      if (onSetCompleted) {
        onSetCompleted(exercise.id);
      }
      return;
    }
    
    // Get the next scenario from the pool
    const nextScenario = scenariosPool[0];
    setCurrentScenario(nextScenario);
    
    // Remove the used scenario from the pool
    setScenariosPool(prev => prev.slice(1));
    
    // Reset state for new scenario
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
    setIsCorrect(null);
    setForecastUnlocked(false);
  }, [scenariosPool, showFeedback, onSetCompleted, exercise.id]);

  // Set up the exercise
  useEffect(() => {
    if (scenariosPool.length > 0 && !currentScenario) {
      loadNewChallenge();
    }
  }, [exercise.data, scenariosPool, loadNewChallenge, currentScenario]);

  // Handle next challenge signal
  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignalRef.current && advanceToNextChallengeSignal > 0) {
      loadNewChallenge();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  // Handle option selection
  const handleOptionSelect = useCallback((option: LikelihoodLevel) => {
    setSelectedOption(option);
  }, []);

  // Handle verification
  const handleVerify = useCallback(() => {
    if (!currentScenario || !selectedOption) return;
    
    const isAnswerCorrect = selectedOption === currentScenario.correctLikelihood;
    setIsVerified(true);
    setIsCorrect(isAnswerCorrect);
    onAttempt(isAnswerCorrect);
    
    // Update the feedback message
    if (isAnswerCorrect) {
      setForecastUnlocked(true);
      showFeedback({
        type: 'correct', 
        message: currentScenario.feedbackMessage || `¡Correcto! Has clasificado el evento correctamente como ${LIKELIHOOD_LEVEL_LABELS[currentScenario.correctLikelihood]}.`
      });
      
      // Add to completed scenarios
      setCompletedScenarios(prev => [...prev, currentScenario.id]);
    } else {
      showFeedback({
        type: 'incorrect', 
        message: `Intenta de nuevo. Este evento se clasifica como ${LIKELIHOOD_LEVEL_LABELS[currentScenario.correctLikelihood]}.`
      });
    }
  }, [currentScenario, selectedOption, onAttempt, showFeedback]);

  // Set custom keypad
  useEffect(() => {
    if (setCustomKeypadContent && currentScenario) {
      setCustomKeypadContent(
        <LikelihoodOptionsKeypad
          optionsConfig={LIKELIHOOD_OPTIONS_CONFIG}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          onVerify={handleVerify}
          isVerified={isVerified}
          correctLikelihood={isVerified ? currentScenario.correctLikelihood : null}
        />
      );
    }
  }, [currentScenario, selectedOption, isVerified, setCustomKeypadContent, handleOptionSelect, handleVerify]);

  if (!currentScenario) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center space-y-6 p-4"
    >
      {/* Exercise title and instructions */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Juego del Meteorólogo
        </h2>
        <p className="text-gray-600 mt-2">
          Clasifica los eventos según su probabilidad de ocurrencia.
        </p>
        <p className="text-sm text-indigo-600 mt-1">
          Usa los botones del panel lateral para seleccionar la probabilidad →
        </p>
      </div>

      {/* Card with Event */}
      <div 
        className="w-full max-w-md"
      >
        <EventCard 
          eventText={currentScenario.eventText} 
          emoji={currentScenario.emoji || DEFAULT_EMOJI}
          binId={selectedOption}
          isCorrect={isCorrect}
        />
      </div>

      {/* Feedback is handled by the scaffold API */}

      {/* Weather Forecast Animation (when correct) */}
      {forecastUnlocked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-inner max-w-md">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {currentScenario.emoji || DEFAULT_EMOJI}
            </div>
            <p className="text-blue-800 font-medium">
              ¡Pronóstico desbloqueado!
            </p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-4 text-sm text-gray-500">
        Escenarios completados: {completedScenarios.length} / {scenariosPool.length}
      </div>
    </div>
  );
};

export default LikelihoodSortingExercise;
