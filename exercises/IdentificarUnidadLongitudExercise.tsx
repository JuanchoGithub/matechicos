import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Import ExerciseScaffoldProps
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; // Import ExerciseScaffoldApi
import { Icons } from '../components/icons';

interface IdentificarUnidadLongitudExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type LengthUnit = 'km' | 'm' | 'cm';

interface ItemChallenge {
  id: string;
  description: string;
  correctUnit: LengthUnit;
  emoji?: string;
}

interface CurrentChallengeData extends ItemChallenge {}

const FACE_EMOJIS = ['📏', '📐', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '🗺️', '🏙️', '🏞️'];
const UNITS_OPTIONS: { unit: LengthUnit; label: string; fullLabel: string }[] = [
  { unit: 'cm', label: 'cm', fullLabel: 'Centímetro' },
  { unit: 'm', label: 'm', fullLabel: 'Metro' },
  { unit: 'km', label: 'km', fullLabel: 'Kilómetro' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarUnidadLongitudExercise: React.FC<IdentificarUnidadLongitudExerciseProps> = ({
  exercise,
  scaffoldApi,
}) => {
  // stars and feedback states removed
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallengeData | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<LengthUnit | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [availableItems, setAvailableItems] = useState<ItemChallenge[]>([]);

  const { items = [] } = exercise.data || {};

   useEffect(() => {
    if (items.length > 0) {
      setAvailableItems(shuffleArray([...items]));
    }
  }, [items]);


  const generateNewChallenge = useCallback(() => {
    let itemPool = availableItems;
    if (itemPool.length === 0 && items.length > 0) {
        itemPool = shuffleArray([...items]); 
        setAvailableItems(itemPool);
    }
    
    if (itemPool.length > 0) {
        const nextItem = itemPool[0];
        setCurrentChallenge(nextItem);
        setAvailableItems(prev => prev.slice(1)); 
        setCurrentEmoji(nextItem.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)]);
    } else {
        // No more challenges, scaffold will handle completion via onAttempt if all stars are met
        scaffoldApi.onAttempt(true); // Signal a "successful" end if no more challenges
        return;
    }
    setSelectedUnit(null);
    setIsVerified(false);
    scaffoldApi.showFeedback(null);
  }, [availableItems, items, scaffoldApi]);

  useEffect(() => {
    if (items.length > 0 && !currentChallenge) { 
        generateNewChallenge();
    }
  }, [items, currentChallenge, generateNewChallenge]);
  
  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);


  const handleUnitSelect = (unit: LengthUnit) => {
    if (isVerified && selectedUnit === currentChallenge?.correctUnit) return; 
    setSelectedUnit(unit);
    scaffoldApi.showFeedback(null); 
    if (isVerified) setIsVerified(false); 
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedUnit || (isVerified && selectedUnit === currentChallenge.correctUnit )) return;

    setIsVerified(true);
    const isCorrect = selectedUnit === currentChallenge.correctUnit;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: `¡Correcto! Usarías ${selectedUnit} para ${currentChallenge.description}.` });
      // Scaffold handles advancement or completion
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: `No es la unidad más adecuada. ¡Inténtalo de nuevo!` });
    }
  }, [currentChallenge, selectedUnit, scaffoldApi, isVerified]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    const itemEmojiToDisplay = currentChallenge.emoji || currentEmoji;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4 sm:space-y-6">
        <div className="relative flex items-center justify-center mb-2 sm:mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {itemEmojiToDisplay}
          </div>
          <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
             Medir: <strong className="block text-lg sm:text-xl">{currentChallenge.description}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        
        <p className="text-lg sm:text-xl text-slate-700">{exercise.question || "¿Qué unidad usarías?"}</p>
        {/* Feedback handled by scaffold */}
      </div>
    );
  };

  return (
    <>
      <MainContent />
      {currentChallenge && (
        <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4 max-w-xs mx-auto">
          {UNITS_OPTIONS.map(({ unit, label, fullLabel }) => {
            const isSelected = selectedUnit === unit;
            let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

            if (isVerified) {
                if (isSelected) { // User selected this option
                    buttonClass = unit === currentChallenge.correctUnit ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
                } else if (unit === currentChallenge.correctUnit) { // This is the correct answer, but user didn't pick it
                    // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if user was wrong
                } else { // Neither selected nor correct (if verified and wrong)
                    buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
                }
            } else if (isSelected) { // Not verified yet, but selected
                buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
            
            return (
              <button
                key={unit}
                onClick={() => handleUnitSelect(unit)}
                disabled={isVerified && selectedUnit === currentChallenge.correctUnit}
                className={`w-full p-3 sm:p-4 rounded-lg text-center text-lg sm:text-xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
                aria-label={`Opción: ${fullLabel} (${label})`}
              >
                {fullLabel} <span className="text-sm">({label})</span>
              </button>
            );
          })}
          <button
            onClick={verifyAnswer}
            disabled={!selectedUnit || (isVerified && selectedUnit === currentChallenge.correctUnit)}
            className={`w-full p-3 mt-3 sm:mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
              ${!selectedUnit || (isVerified && selectedUnit === currentChallenge.correctUnit)
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
              }`}
          >
            <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Verificar
          </button>
        </div>
      )}
    </>
  );
};
