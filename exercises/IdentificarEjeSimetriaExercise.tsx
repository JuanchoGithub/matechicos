
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, SymmetryChallengeDefinition, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface IdentificarEjeSimetriaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_SYMMETRY = ['🤔', '🧐', '💡', '🦋', '💠', '✨', '♦️', '🌸'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarEjeSimetriaExercise: React.FC<IdentificarEjeSimetriaExerciseProps> = ({
  exercise,
  scaffoldApi,
  setExternalKeypad,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<SymmetryChallengeDefinition | null>(null);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null); 
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_SYMMETRY[0]);
  const [availableChallenges, setAvailableChallenges] = useState<SymmetryChallengeDefinition[]>([]);

  const { challenges = [] } = exercise.data as { totalStars?: number; challenges: SymmetryChallengeDefinition[] } || {};
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges]);

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
    } else {
      onAttempt(true);
      return;
    }

    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
    setCurrentEmoji(FACE_EMOJIS_SYMMETRY[Math.floor(Math.random() * FACE_EMOJIS_SYMMETRY.length)]);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

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

  const handleOptionSelect = (option: boolean) => {
    if (isVerified && selectedOption === currentChallenge?.isSymmetricalAboutAxis) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.isSymmetricalAboutAxis) setIsVerified(false);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && selectedOption === currentChallenge.isSymmetricalAboutAxis)) return;

    setIsVerified(true);
    const correctSymmetryStatus = currentChallenge.isSymmetricalAboutAxis;
    const isCorrect = selectedOption === correctSymmetryStatus;
    onAttempt(isCorrect);

    const message = isCorrect
      ? (correctSymmetryStatus ? "¡Correcto! Esta línea es un eje de simetría." : "¡Correcto! Esta línea NO es un eje de simetría.")
      : (correctSymmetryStatus ? "Incorrecto. Esta línea SÍ es un eje de simetría." : "Incorrecto. Esta línea NO es un eje de simetría.");
    showFeedback({ type: isCorrect ? 'correct' : 'incorrect', message });
    
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando figura...</div>;
    }
    const { VisualComponent, name } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-pink-600 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "¿Es esta línea un eje de simetría para la figura?"}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent className="max-w-full max-h-full" shapeStroke="black" shapeFill="rgba(128,0,128,0.1)" axisStroke="rgb(220, 38, 38)" axisStyle="dashed"/>
        </div>
        <p className="text-slate-600 text-sm italic">({name})</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    const options = [
        { label: 'Sí, es un eje de simetría', value: true },
        { label: 'No, no es un eje de simetría', value: false }
    ];

    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.value;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isVerified) {
            if (isSelected) {
              buttonClass = opt.value === currentChallenge.isSymmetricalAboutAxis ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
          } else if (isSelected) {
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          
          return (
            <button
              key={String(opt.value)}
              onClick={() => handleOptionSelect(opt.value)}
              disabled={isVerified && selectedOption === currentChallenge.isSymmetricalAboutAxis}
              className={`w-full p-3 rounded-lg text-center text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            >
              {opt.label}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={selectedOption === null || (isVerified && selectedOption === currentChallenge.isSymmetricalAboutAxis)}
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${(selectedOption === null || (isVerified && selectedOption === currentChallenge.isSymmetricalAboutAxis))
              ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setExternalKeypad) {
      if (currentChallenge) {
        setExternalKeypad(<OptionsKeypad />);
      } else {
        setExternalKeypad(null);
      }
      return () => {
        if (setExternalKeypad) {
          setExternalKeypad(null);
        }
      };
    }
  }, [setExternalKeypad, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
