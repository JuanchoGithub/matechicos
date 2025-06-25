
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, QuadrilateralDefinition, QuadrilateralTypeId, QUADRILATERAL_TYPE_LABELS, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface IdentificarCuadrilaterosExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void; // Changed prop name
}

interface CurrentChallengeData extends QuadrilateralDefinition {}

const FACE_EMOJIS_CUADRILATEROS = ['🟥', '🤔', '🧐', '💡', '🔷', '💠', '📐'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarCuadrilaterosExercise: React.FC<IdentificarCuadrilaterosExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent, // Changed prop name
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallengeData | null>(null);
  const [optionsForButtons, setOptionsForButtons] = useState<QuadrilateralTypeId[]>([]);
  const [selectedOption, setSelectedOption] = useState<QuadrilateralTypeId | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_CUADRILATEROS[0]);
  const [availableChallenges, setAvailableChallenges] = useState<QuadrilateralDefinition[]>([]);

  const { challenges = [], optionsOrder = [] } = exercise.data as { totalStars?: number; challenges: QuadrilateralDefinition[], optionsOrder: QuadrilateralTypeId[] } || {};
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
    if (optionsOrder.length > 0) {
      setOptionsForButtons(shuffleArray([...optionsOrder])); 
    } else if (challenges.length > 0) { 
      const allTypeIds = challenges.map(c => c.id);
      setOptionsForButtons(shuffleArray(Array.from(new Set(allTypeIds))));
    }
  }, [challenges, optionsOrder]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges.length > 0) {
        challengePool = shuffleArray([...challenges]);
        setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
       if (optionsOrder.length > 0) {
        setOptionsForButtons(shuffleArray([...optionsOrder]));
      } else if (challenges.length > 0) { // Ensure options are set from nextChallenge's actual possibilities if no specific order
        const allTypeIds = (Object.keys(QUADRILATERAL_TYPE_LABELS) as QuadrilateralTypeId[]);
        const distractors = shuffleArray(allTypeIds.filter(id => id !== nextChallenge.id)).slice(0,3);
        setOptionsForButtons(shuffleArray([nextChallenge.id, ...distractors]));
      }
    } else {
      onAttempt(true);
      return;
    }

    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
    setCurrentEmoji(FACE_EMOJIS_CUADRILATEROS[Math.floor(Math.random() * FACE_EMOJIS_CUADRILATEROS.length)]);
  }, [availableChallenges, challenges, optionsOrder, showFeedback, onAttempt]);

  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
        loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = (option: QuadrilateralTypeId) => {
    if (isVerified && selectedOption === currentChallenge?.id) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.id) setIsVerified(false);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.id)) return;

    setIsVerified(true);
    const correctLabel = QUADRILATERAL_TYPE_LABELS[currentChallenge.id];
    const isCorrect = selectedOption === currentChallenge.id;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! Es un ${correctLabel.toLowerCase()}.` });
    } else {
      const selectedLabel = QUADRILATERAL_TYPE_LABELS[selectedOption];
      showFeedback({ type: 'incorrect', message: `No es un ${selectedLabel.toLowerCase()}. Observa bien sus lados y ángulos. ¡Intenta otra vez!` });
    }
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando figura...</div>;
    }
    const { VisualComponent, characteristic } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-cyan-600 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "Observa la figura. ¿Qué tipo de cuadrilátero es?"}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent className="max-w-full max-h-full" strokeColor="rgb(8 145 178)" />
        </div>
        <p className="text-slate-600 text-sm italic">({characteristic})</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || optionsForButtons.length === 0) return null;
    return (
      <div className="w-full flex flex-col space-y-1.5 p-2">
        {optionsForButtons.map((optionTypeId) => {
          const label = QUADRILATERAL_TYPE_LABELS[optionTypeId];
          const isSelected = selectedOption === optionTypeId;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isVerified) {
             if (isSelected) {
                buttonClass = optionTypeId === currentChallenge.id ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
             } else {
                buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
             }
          } else if (isSelected) {
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          
          return (
            <button
              key={optionTypeId}
              onClick={() => handleOptionSelect(optionTypeId)}
              disabled={isVerified && selectedOption === currentChallenge.id}
              className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            >
              {label}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={!selectedOption || (isVerified && selectedOption === currentChallenge.id)}
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${(!selectedOption || (isVerified && selectedOption === currentChallenge.id))
              ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  }, [currentChallenge, optionsForButtons, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) { // Changed prop name
      if (currentChallenge) {
        setCustomKeypadContent(<OptionsKeypad />);
      } else {
        setCustomKeypadContent(null);
      }
      return () => {
        if (setCustomKeypadContent) { // Changed prop name
          setCustomKeypadContent(null);
        }
      };
    }
  }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]); // Changed prop name

  return <MainContent />;
};
