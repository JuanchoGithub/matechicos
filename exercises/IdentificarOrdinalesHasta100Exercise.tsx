import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Added import
import { Exercise as ExerciseType, AvatarData } from '../types';
import { Icons } from '../components/icons';

interface IdentificarOrdinalesHasta100ExerciseProps {
  exercise: ExerciseType;
  currentAvatar: AvatarData;
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onComplete: (success: boolean) => void;
  onSetCompleted?: (exerciseId: string) => void; 
}

interface OrdinalChallenge {
  ordinalWord: string;
  correctCardinal: number;
  options: number[];
}

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

const cardinalToOrdinalSpanish = (num: number): string => {
  if (num <= 0 || num > 100) return "Número fuera de rango";
  if (ORDINAL_MAP_ES_BASE[num]) return ORDINAL_MAP_ES_BASE[num];
  if (ORDINAL_MAP_ES_TENS[num]) return ORDINAL_MAP_ES_TENS[num];

  const tenPart = Math.floor(num / 10) * 10;
  const unitPart = num % 10;

  if (ORDINAL_MAP_ES_TENS[tenPart] && ORDINAL_MAP_ES_UNITS_FOR_COMPOUND[unitPart]) {
    return `${ORDINAL_MAP_ES_TENS[tenPart]} ${ORDINAL_MAP_ES_UNITS_FOR_COMPOUND[unitPart]}`;
  }
  return `Ordinal de ${num}`; 
};

const MIN_CARDINAL_FOR_CHALLENGE = 21;
const MAX_CARDINAL_FOR_CHALLENGE = 100;

const FACE_EMOJIS = ['🧐', '🥇', '🥈', '🥉', '🏅', '🏆', '🔢', '👍', '💡', '🤓', '🎯', '💯', '📜', '📖'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarOrdinalesHasta100Exercise: React.FC<IdentificarOrdinalesHasta100ExerciseProps> = ({
  exercise,
  currentAvatar,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onComplete,
  onSetCompleted, 
}) => {
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<OrdinalChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);

  const { totalStars = 10 } = exercise.data || {};

  const generateNewChallenge = useCallback(() => {
    const correctCardinal = Math.floor(Math.random() * (MAX_CARDINAL_FOR_CHALLENGE - MIN_CARDINAL_FOR_CHALLENGE + 1)) + MIN_CARDINAL_FOR_CHALLENGE;
    const ordinalWord = cardinalToOrdinalSpanish(correctCardinal);

    const distractors: number[] = [];
    const numOptions = 4; 
    while (distractors.length < numOptions - 1) {
      const randomDistractor = Math.floor(Math.random() * (MAX_CARDINAL_FOR_CHALLENGE - MIN_CARDINAL_FOR_CHALLENGE + 1)) + MIN_CARDINAL_FOR_CHALLENGE;
      if (randomDistractor !== correctCardinal && !distractors.includes(randomDistractor)) {
         distractors.push(randomDistractor);
      }
    }

    const options = shuffleArray([correctCardinal, ...distractors]);

    setCurrentChallenge({
      ordinalWord,
      correctCardinal,
      options,
    });
    setSelectedOption(null);
    setIsVerified(false);
    setFeedback(null);
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
  }, []);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge]);

  const handleOptionSelect = (option: number) => {
    if (isVerified && feedback?.type === 'incorrect') {
        setIsVerified(false);
        setFeedback(null);
    } else if (isVerified && feedback?.type === 'correct') {
        return;
    }
    setSelectedOption(option);
    setFeedback(null);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && feedback?.type === 'correct') ) return;

    setIsVerified(true);

    if (selectedOption === currentChallenge.correctCardinal) {
      setStars(prev => Math.min(prev + 1, totalStars));
      setFeedback({ type: 'correct', message: `¡Correcto! ${currentChallenge.ordinalWord} es el número ${currentChallenge.correctCardinal}.` });
      onComplete(true);
      if (stars + 1 >= totalStars) {
        if(onSetCompleted) onSetCompleted(exercise.id); 
        setTimeout(() => setFeedback({ type: 'correct', message: '¡Felicidades! Ejercicio completado.' }), 50);
        setTimeout(onNavigateBack, 2500);
      } else {
        setTimeout(generateNewChallenge, 2000);
      }
    } else {
      setFeedback({ type: 'incorrect', message: 'Esa no es la correspondencia correcta. ¡Prueba otra vez!' });
      onComplete(false);
    }
  }, [currentChallenge, selectedOption, totalStars, onComplete, generateNewChallenge, stars, onNavigateBack, isVerified, feedback, exercise.id, onSetCompleted]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-amber-500 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            Ordinal: <strong className="block text-xl sm:text-2xl font-bold">{currentChallenge.ordinalWord}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        
        <p className="text-lg sm:text-xl text-slate-700">Este ordinal corresponde al número:</p>

        <div className="h-12 sm:h-16 mt-1 flex items-center justify-center w-full">
          {feedback && (
            <div className={`p-2 sm:p-3 rounded-md text-white font-semibold text-sm sm:text-md w-full max-w-md ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    );
  };

  const OptionsSidebar: React.FC = () => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentChallenge.options.map((optionValue) => {
          const isSelected = selectedOption === optionValue;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isSelected) {
            if (isVerified) {
              buttonClass = optionValue === currentChallenge.correctCardinal
                ? 'bg-green-500 text-white ring-2 ring-green-700'
                : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
          } else if (isVerified && feedback?.type === 'correct') {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          } else if (isVerified && feedback?.type === 'incorrect') {
             buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }


          return (
            <button
              key={optionValue}
              onClick={() => handleOptionSelect(optionValue)}
              disabled={isVerified && feedback?.type === 'correct'}
              className={`w-full p-3 rounded-lg text-center text-xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
              aria-label={`Opción ${optionValue}`}
            >
              {optionValue}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={selectedOption === null || (isVerified && feedback?.type === 'correct')}
          className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${selectedOption === null || (isVerified && feedback?.type === 'correct')
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

  return (
    <ExerciseScaffold
      exerciseId={exercise.id}
      exerciseQuestion={exercise.question || "Identifica el número que corresponde al ordinal:"}
      totalStarsForExercise={totalStars} // Corrected prop name
      onNavigateBack={onNavigateBack}
      onGoHome={onGoHome}
      onAvatarClick={onAvatarClick}
      currentAvatar={currentAvatar}
      mainExerciseContentRenderer={(api) => <MainContent />}
      keypadComponent={<OptionsSidebar />}
      onFooterBack={onNavigateBack}
      onFooterHome={onGoHome}
      onSetCompleted={onSetCompleted || ((exerciseId) => console.log(`Exercise ${exerciseId} completed via scaffold`))}
    />
  );
};
