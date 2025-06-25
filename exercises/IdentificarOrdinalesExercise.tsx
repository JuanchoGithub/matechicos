
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; 
import { Icons } from '../components/icons';

interface IdentificarOrdinalesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

interface OrdinalChallenge {
  ordinalWord: string;
  correctCardinal: number;
  options: number[];
}

// Combined Ordinal Mapping Logic
const ORDINAL_MAP_ES_BASE: { [key: number]: string } = {
  1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto",
  6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo",
  11: "Undécimo", 12: "Duodécimo", 13: "Decimotercero", 14: "Decimocuarto",
  15: "Decimoquinto", 16: "Decimosexto", 17: "Decimoséptimo",
  18: "Decimoctavo", 19: "Decimonoveno", 20: "Vigésimo",
};
const ORDINAL_MAP_ES_TENS: { [key: number]: string } = {
  20: "Vigésimo", 30: "Trigésimo", 40: "Cuadragésimo",
  50: "Quincuagésimo", 60: "Sexagésimo", 70: "Septuagésimo",
  80: "Octogésimo", 90: "Nonagésimo", 100: "Centésimo",
};
const ORDINAL_MAP_ES_UNITS_FOR_COMPOUND: { [key: number]: string } = {
  1: "primero", 2: "segundo", 3: "tercero", 4: "cuarto", 5: "quinto",
  6: "sexto", 7: "séptimo", 8: "octavo", 9: "noveno",
};

const cardinalToOrdinalSpanishComprehensive = (num: number): string => {
  if (num <= 0 || num > 100) return `Ordinal de ${num}`; 
  if (ORDINAL_MAP_ES_BASE[num]) return ORDINAL_MAP_ES_BASE[num];
  if (ORDINAL_MAP_ES_TENS[num]) return ORDINAL_MAP_ES_TENS[num];

  const tenPart = Math.floor(num / 10) * 10;
  const unitPart = num % 10;

  if (ORDINAL_MAP_ES_TENS[tenPart] && ORDINAL_MAP_ES_UNITS_FOR_COMPOUND[unitPart]) {
    return `${ORDINAL_MAP_ES_TENS[tenPart]} ${ORDINAL_MAP_ES_UNITS_FOR_COMPOUND[unitPart]}`;
  }
  return `Ordinal de ${num}`; 
};

const FACE_EMOJIS = ['🧐', '🥇', '🥈', '🥉', '🏅', '🏆', '🔢', '👍', '💡', '🤓', '🎯', '💯', '📜', '📖'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarOrdinalesExercise: React.FC<IdentificarOrdinalesExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<OrdinalChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [availableChallengesData, setAvailableChallengesData] = useState<{ordinalWord: string, correctCardinal: number, options: number[]}[]>([]); 
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);

  const { 
    minCardinal = 1, 
    maxCardinal = 20,
  } = exercise.data || {};
  
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateChallengePool = useCallback(() => {
    const pool: {ordinalWord: string, correctCardinal: number, options: number[]}[] = [];
    const usedCardinals = new Set<number>();
    const numPossibleCardinals = maxCardinal - minCardinal + 1;
    const totalStarsForExercise = (scaffoldApi as any)?.totalStarsForExercise || exercise.data?.totalStars || 10;
    const challengesToGenerate = Math.min(totalStarsForExercise * 2, numPossibleCardinals, 20); 

    while(pool.length < challengesToGenerate && usedCardinals.size < numPossibleCardinals) {
        const correctCardinal = Math.floor(Math.random() * (maxCardinal - minCardinal + 1)) + minCardinal;
        if (usedCardinals.has(correctCardinal) && pool.length + usedCardinals.size < numPossibleCardinals) continue;
        usedCardinals.add(correctCardinal);

        const ordinalWord = cardinalToOrdinalSpanishComprehensive(correctCardinal);
        const distractors: number[] = [];
        const numOptions = 4; 
        while (distractors.length < numOptions - 1) {
          const randomDistractor = Math.floor(Math.random() * (maxCardinal - minCardinal + 1)) + minCardinal;
          if (randomDistractor !== correctCardinal && !distractors.includes(randomDistractor)) {
             distractors.push(randomDistractor);
          }
        }
        const options = shuffleArray([correctCardinal, ...distractors]);
        pool.push({ordinalWord, correctCardinal, options});
    }
    setAvailableChallengesData(shuffleArray(pool));
  }, [minCardinal, maxCardinal, scaffoldApi, exercise.data?.totalStars]);

  useEffect(() => {
    generateChallengePool();
  }, [generateChallengePool, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = [...availableChallengesDataRef.current]; 
    if (challengePool.length === 0) {
       generateChallengePool(); 
       challengePool = availableChallengesDataRef.current; 
    }
    
    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setShuffledOptions(shuffleArray([...nextChallenge.options]));
      setAvailableChallengesData(prev => prev.slice(1));
      setCurrentEmoji(FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)]);
    } else {
      onAttempt(true); 
      return;
    }

    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null); 
  }, [generateChallengePool, onAttempt, showFeedback]);
  
  const availableChallengesDataRef = useRef(availableChallengesData);
  useEffect(() => { availableChallengesDataRef.current = availableChallengesData; }, [availableChallengesData]);


  useEffect(() => {
    if (availableChallengesDataRef.current.length > 0 && !currentChallenge) { 
        loadNewChallenge();
    }
  }, [currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: number) => { 
    if (isVerified && selectedOption === currentChallenge?.correctCardinal ) return; 
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctCardinal) setIsVerified(false); 
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && selectedOption === currentChallenge.correctCardinal) ) return;

    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctCardinal;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! ${currentChallenge.ordinalWord} es el número ${currentChallenge.correctCardinal}.` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Esa no es la correspondencia correcta. ¡Vuelve a intentarlo!' });
    }
  }, [currentChallenge, selectedOption, showFeedback, onAttempt, isVerified]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    const speechBubbleColor = maxCardinal <= 20 ? 'bg-lime-500' : 'bg-amber-500';
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4 sm:space-y-6">
        <div className="relative flex items-center justify-center mb-2 sm:mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className={`${speechBubbleColor} text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs`} direction="left">
            Ordinal: <strong className="block text-xl sm:text-2xl font-bold">{currentChallenge.ordinalWord}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        
        <p className="text-lg sm:text-xl text-slate-700">{exercise.question || "Este ordinal corresponde al número:"}</p>
      </div>
    );
  };

  const OptionsSidebarComponent: React.FC<{
    options: number[];
    selectedOption: number | null;
    onSelect: (option: number) => void;
    onVerify: () => void;
    isVerified: boolean;
    correctAnswer: number | null;
  }> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2">
        {shuffledOptions.map((optionValue) => {
          const isSelected = selectedOption === optionValue;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isVerified) {
            if (isSelected) {
              buttonClass = optionValue === currentChallenge.correctCardinal
                ? 'bg-green-500 text-white ring-2 ring-green-700'
                : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
          } else if (isSelected) {
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          
          return (
            <button
              key={optionValue}
              onClick={() => handleOptionSelect(optionValue)}
              disabled={isVerified && selectedOption === currentChallenge.correctCardinal}
              className={`w-full p-3 rounded-lg text-center text-xl sm:text-2xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
              aria-label={`Opción ${optionValue}`}
            >
              {optionValue}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={selectedOption === null || (isVerified && selectedOption === currentChallenge.correctCardinal)}
          className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${selectedOption === null || (isVerified && selectedOption === currentChallenge.correctCardinal)
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

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(
          <OptionsSidebarComponent
            key={`${currentChallenge.ordinalWord}-${selectedOption}-${isVerified}`} 
            options={shuffledOptions}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            onVerify={verifyAnswer}
            isVerified={isVerified}
            correctAnswer={currentChallenge.correctCardinal}
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
  }, [
    setCustomKeypadContent,
    currentChallenge,
    shuffledOptions,
    selectedOption,
    isVerified,
    handleOptionSelect, 
    verifyAnswer,       
  ]);

  return <MainContent />;
};
