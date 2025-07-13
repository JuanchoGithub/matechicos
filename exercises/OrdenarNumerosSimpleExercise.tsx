
import React, { useState, useEffect, useCallback } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface OrdenarNumerosSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

const CHARACTER_EMOJIS = ['🤔', '🧐', '👍', '🔢', '👀', '🎉', '✨'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const OrdenarNumerosSimpleExercise: React.FC<OrdenarNumerosSimpleExerciseProps> = ({
  exercise,
  scaffoldApi,
}) => {
  const [challengeNumbers, setChallengeNumbers] = useState<number[]>([]); 
  const [poolNumbers, setPoolNumbers] = useState<number[]>([]); 
  const [slotNumbers, setSlotNumbers] = useState<(number | null)[]>([]); 
  const [heldNumber, setHeldNumber] = useState<number | null>(null); 
  const [isCorrectlySorted, setIsCorrectlySorted] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS[0]);

  const {
    count = 5, 
    numberRange = [0, 20], 
    sortOrder = 'asc', 
  } = exercise.data || {};

  const generateNewChallenge = useCallback(() => {
    const newNumbersSet = new Set<number>();
    while (newNumbersSet.size < count) {
      const randomNumber = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
      newNumbersSet.add(randomNumber);
    }
    const numbers = Array.from(newNumbersSet);
    
    setChallengeNumbers([...numbers]); 
    setPoolNumbers(shuffleArray([...numbers])); 
    setSlotNumbers(Array(count).fill(null));
    setHeldNumber(null);
    scaffoldApi.showFeedback(null);
    setIsCorrectlySorted(false);
    setCharacterEmoji(CHARACTER_EMOJIS[Math.floor(Math.random() * CHARACTER_EMOJIS.length)]);
  }, [count, numberRange, scaffoldApi]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);
  
  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);


  const handlePoolNumberClick = (num: number) => {
    if (isCorrectlySorted) return;
    setHeldNumber(num === heldNumber ? null : num); 
    scaffoldApi.showFeedback(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isCorrectlySorted) return;
    scaffoldApi.showFeedback(null);

    const newSlots = [...slotNumbers];
    const newPool = [...poolNumbers];

    if (newSlots[slotIndex] !== null) { 
      const numToReturn = newSlots[slotIndex] as number;
      newSlots[slotIndex] = null;
      if (!newPool.includes(numToReturn)) { 
        newPool.push(numToReturn);
      }
      setHeldNumber(null); 
    } else if (heldNumber !== null) { 
      if (newPool.includes(heldNumber)) {
        newSlots[slotIndex] = heldNumber;
        const poolIndex = newPool.indexOf(heldNumber);
        if (poolIndex > -1) {
          newPool.splice(poolIndex, 1);
        }
        setHeldNumber(null);
      }
    }
    setSlotNumbers(newSlots);
    setPoolNumbers(shuffleArray(newPool)); 
  };
  
  const handleVerify = useCallback(() => {
    if (isCorrectlySorted) return;

    const filledSlots = slotNumbers.filter(num => num !== null) as number[];
    if (filledSlots.length !== count) {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Completa todos los espacios para verificar.' });
      return;
    }

    const sortedChallengeNumbers = [...challengeNumbers].sort((a, b) => sortOrder === 'asc' ? a - b : b - a);
    const userSortedCorrectly = filledSlots.every((num, index) => num === sortedChallengeNumbers[index]);

    scaffoldApi.onAttempt(userSortedCorrectly);
    if (userSortedCorrectly) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Excelente! Números ordenados correctamente.' });
      setIsCorrectlySorted(true);
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'El orden no es correcto. ¡Inténtalo de nuevo!' });
    }
  }, [slotNumbers, challengeNumbers, sortOrder, count, scaffoldApi, isCorrectlySorted]);


  const MainContent: React.FC = () => (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-2 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {characterEmoji}
            </div>
            <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || `Ordena los números de ${sortOrder === 'asc' ? 'menor a mayor' : 'mayor a menor'}:`}
            </Icons.SpeechBubbleIcon>
        </div>

      <div className="flex justify-center items-center space-x-2 p-2 bg-slate-200 rounded-lg min-h-[5rem] w-full max-w-md shadow-inner">
        {slotNumbers.map((num, index) => (
          <button
            key={`slot-${index}`}
            onClick={() => handleSlotClick(index)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center text-xl sm:text-2xl font-bold transition-all
                        ${num !== null ? 'bg-white border-2 border-blue-400 text-blue-600 shadow-md' 
                                      : 'bg-slate-300 border-2 border-dashed border-slate-400 text-slate-500'}`}
            aria-label={num !== null ? `Número ${num} en posición ${index + 1}. Click para devolver.` : `Posición ${index + 1} vacía. Click para colocar número.`}
          >
            {num !== null ? num : '?'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 p-3 bg-sky-50 rounded-lg min-h-[5rem] w-full max-w-md border border-sky-200">
        {poolNumbers.map((num, index) => (
          <button
            key={`pool-${num}-${index}`} 
            onClick={() => handlePoolNumberClick(num)}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-semibold shadow-sm transition-all
                        ${heldNumber === num ? 'bg-yellow-400 text-white ring-2 ring-yellow-600 scale-110' 
                                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            aria-label={`Número ${num} en el grupo. ${heldNumber === num ? 'Seleccionado.' : 'Click para seleccionar.'}`}
          >
            {num}
          </button>
        ))}
        {poolNumbers.length === 0 && <p className="text-slate-500 italic">¡Todos los números colocados!</p>}
      </div>
        <div className="w-full flex flex-col items-center space-y-3 p-2 mt-8 max-w-xs mx-auto">
            <button
            onClick={handleVerify}
            disabled={isCorrectlySorted || slotNumbers.some(s => s === null)}
            className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${(isCorrectlySorted || slotNumbers.some(s => s === null))
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-700'
                }`}
            >
            <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Verificar
            </button>
            <button
            onClick={generateNewChallenge} 
            className="w-full p-3 rounded-lg flex items-center justify-center font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-slate-400 shadow-md transition-colors"
            >
            <Icons.BackArrowIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 transform rotate-90" /> 
            Reiniciar Intento
            </button>
        </div>
    </div>
  );

  return <MainContent />;
};
