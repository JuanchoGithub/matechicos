
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, GenericVisualChallenge, GenericVisualOption, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface IdentificarFormaGeometricaGenericoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; // New optional prop
}

const FACE_EMOJIS_GEOMETRY = ['📐', '🤔', '🧐', '💡', '✨', '✏️', '📏', '🎨', '🧊', '🦋'];
const DEFAULT_GEOMETRY_EMOJI = '📐';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarFormaGeometricaGenericoExercise: React.FC<IdentificarFormaGeometricaGenericoExerciseProps> = ({
  exercise,
  scaffoldApi,
  setExternalKeypad, // Destructure the new prop
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<GenericVisualChallenge | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<GenericVisualOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_GEOMETRY_EMOJI);
  const [availableChallenges, setAvailableChallenges] = useState<GenericVisualChallenge[]>([]);

  const { 
    challenges = [], // Default to empty array if undefined
    questionPrompt = "Observa la figura. ¿Qué tipo es?"
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges && challenges.length > 0) { // Check if challenges is defined and not empty
      setAvailableChallenges(shuffleArray([...challenges as GenericVisualChallenge[]]));
    } else {
      setAvailableChallenges([]); // Ensure it's an empty array if no challenges
    }
  }, [challenges, exercise.id]); // Added exercise.id to re-init if exercise changes

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges && challenges.length > 0) { // Check challenges before spreading
        challengePool = shuffleArray([...challenges as GenericVisualChallenge[]]);
        setAvailableChallenges(challengePool); 
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setShuffledOptions(shuffleArray([...nextChallenge.options]));
      setAvailableChallenges(prev => prev.slice(1)); 
      setCurrentEmoji(nextChallenge.emoji || FACE_EMOJIS_GEOMETRY[Math.floor(Math.random() * FACE_EMOJIS_GEOMETRY.length)]);
    } else {
        onAttempt(true); // Signal completion of internal challenges
        return;
    }
    setSelectedOptionId(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if (challenges && challenges.length > 0 && !currentChallenge) { // Check challenges before accessing length
        loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1) ) { // Handle initial undefined
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctAnswerId) return; 
    setSelectedOptionId(optionId);
    showFeedback(null); 
    if (isVerified && selectedOptionId !== currentChallenge?.correctAnswerId) setIsVerified(false); 
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)) return;

    setIsVerified(true);
    const correctOption = currentChallenge.options.find(opt => opt.id === currentChallenge.correctAnswerId);
    const correctLabel = correctOption ? correctOption.label.toLowerCase() : "la opción correcta";
    const isCorrect = selectedOptionId === currentChallenge.correctAnswerId;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! Es: ${correctLabel}.` });
    } else {
      const selectedLabelObj = currentChallenge.options.find(opt => opt.id === selectedOptionId);
      const selectedLabel = selectedLabelObj ? selectedLabelObj.label.toLowerCase() : "tu selección";
      showFeedback({ type: 'incorrect', message: `No es ${selectedLabel}. La respuesta correcta era ${correctLabel}.` });
    }
  }, [currentChallenge, selectedOptionId, showFeedback, onAttempt, isVerified]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando figura...</div>;
    }
    const { VisualComponent, visualProps, description } = currentChallenge;
    const defaultVisualProps = { className: "max-w-full max-h-full", strokeColor: "rgb(59 130 246)" };
    const finalVisualProps = { ...defaultVisualProps, ...visualProps };

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {questionPrompt}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          {VisualComponent ? <VisualComponent {...finalVisualProps} /> : <p>Error al cargar imagen</p>}
        </div>
        {description && <p className="text-slate-600 text-sm italic">({description})</p>}
      </div>
    );
  };
  
  const optionsAndVerifyKeypadJSX = useMemo(() => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-1.5 p-2">
        {shuffledOptions.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isVerified) {
              if (isSelected) {
                  buttonClass = option.id === currentChallenge.correctAnswerId 
                      ? 'bg-green-500 text-white ring-2 ring-green-700' 
                      : 'bg-red-500 text-white ring-2 ring-red-700';
              } else if (option.id === currentChallenge.correctAnswerId) {
                  // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct
              } else {
                  buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
              }
          } else if (isSelected) {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          
          return (
            <button
              key={option.id} // Use option.id as key
              onClick={() => handleOptionSelect(option.id)}
              disabled={isVerified && selectedOptionId === currentChallenge.correctAnswerId}
              className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
              aria-label={`Opción: ${option.label}`}
            >
              {option.label}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)}
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${(!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId))
              ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  }, [currentChallenge, shuffledOptions, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setExternalKeypad) {
      if (currentChallenge) {
        setExternalKeypad(optionsAndVerifyKeypadJSX);
      } else {
        setExternalKeypad(null); // Clear keypad if no challenge
      }
      // Cleanup function
      return () => {
        if (setExternalKeypad) {
          setExternalKeypad(null);
        }
      };
    }
  }, [setExternalKeypad, optionsAndVerifyKeypadJSX, currentChallenge]);

  if (setExternalKeypad) {
    return <MainContent />; // Only render main content if keypad is handled externally
  } else {
    // Default behavior: render options in main panel (though this specific component is designed for external keypad)
    // This path means the component's options won't use the sidebar.
    return (
      <>
        <MainContent />
        {currentChallenge && optionsAndVerifyKeypadJSX}
      </>
    );
  }
};
