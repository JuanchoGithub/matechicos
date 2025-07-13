import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Added import
import { Exercise as ExerciseType, AvatarData } from '../types';
import { Icons } from '../components/icons';

interface IdentificarOrdinalesHasta20ExerciseProps {
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

const ORDINAL_MAP_ES: { [key: number]: string } = {
  1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto",
  6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo",
  11: "Undécimo", 12: "Duodécimo", 13: "Decimotercero", 14: "Decimocuarto",
  15: "Decimoquinto", 16: "Decimosexto", 17: "Decimoséptimo",
  18: "Decimoctavo", 19: "Decimonoveno", 20: "Vigésimo",
};
const CARDINAL_NUMBERS = Object.keys(ORDINAL_MAP_ES).map(Number);

const FACE_EMOJIS = ['🧐', '🥇', '🥈', '🥉', '🏅', '🏆', '🔢', '👍', '💡', '🤓', '🎯', '💯'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const IdentificarOrdinalesHasta20Exercise: React.FC<IdentificarOrdinalesHasta20ExerciseProps> = ({
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
    const correctCardinal = CARDINAL_NUMBERS[Math.floor(Math.random() * CARDINAL_NUMBERS.length)];
    const ordinalWord = ORDINAL_MAP_ES[correctCardinal];

    const distractors: number[] = [];
    while (distractors.length < 3) { 
      const randomDistractor = CARDINAL_NUMBERS[Math.floor(Math.random() * CARDINAL_NUMBERS.length)];
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
      setFeedback({ type: 'incorrect', message: 'Esa no es la correspondencia correcta. ¡Vuelve a intentarlo!' });
      onComplete(false);
    }
  }, [currentChallenge, selectedOption, totalStars, onComplete, generateNewChallenge, stars, onNavigateBack, isVerified, feedback, exercise.id, onSetCompleted]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-28 h-28 flex items-center justify-center text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-lime-500 text-white text-lg p-3 max-w-xs" direction="left">
            Ordinal: <strong className="block text-3xl font-bold">{currentChallenge.ordinalWord}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        
        <p className="text-xl text-slate-700">Este ordinal corresponde al número:</p>

        <div className="h-16 mt-2 flex items-center justify-center w-full">
          {feedback && (
            <div className={`p-3 rounded-md text-white font-semibold text-md w-full max-w-md ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
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
      <div className="w-full flex flex-col space-y-3 p-2">
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
              className={`w-full p-4 rounded-lg text-center text-2xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
              aria-label={`Opción ${optionValue}`}
            >
              {optionValue}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={selectedOption === null || (isVerified && feedback?.type === 'correct')}
          className={`w-full p-3 mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${selectedOption === null || (isVerified && feedback?.type === 'correct')
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
            }`}
        >
          <Icons.CheckIcon className="w-6 h-6 mr-2" />
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
