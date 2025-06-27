

import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold';
import { Exercise as ExerciseType, AvatarData, RectasPairType, RECTAS_PAIR_TYPE_LABELS } from '../types';
import { Icons } from '../components/icons';

interface ClasificarParesDeRectasExerciseProps {
  exercise: ExerciseType;
  currentAvatar: AvatarData;
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onComplete: (success: boolean) => void;
}

interface LinePairChallenge {
  id: string;
  ImageComponent: React.FC<{ className?: string }>; 
  correctType: RectasPairType;
  options: RectasPairType[];
}

const FACE_EMOJIS_RECTAS = ['📏', '📐', '🤔', '🧐', '💡', '✨', '✍️', '👀'];

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const ClasificarParesDeRectasExercise: React.FC<ClasificarParesDeRectasExerciseProps> = ({
  exercise,
  currentAvatar,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onComplete,
}) => {
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<LinePairChallenge | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<RectasPairType[]>([]);
  const [selectedOption, setSelectedOption] = useState<RectasPairType | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_RECTAS[0]);
  const [availableChallenges, setAvailableChallenges] = useState<LinePairChallenge[]>([]);

  const { totalStars = 7, challenges = [] } = exercise.data || {};

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
      setShuffledOptions(shuffleArray([...nextChallenge.options]));
      setAvailableChallenges(prev => prev.slice(1));
    } else {
      if (stars >= totalStars && totalStars > 0) {
        setFeedback({ type: 'correct', message: '¡Felicidades! Has clasificado todos los pares de rectas.' });
        setTimeout(onGoHome, 2500);
      }
      return;
    }

    setSelectedOption(null);
    setIsVerified(false);
    setFeedback(null);
    setCurrentEmoji(FACE_EMOJIS_RECTAS[Math.floor(Math.random() * FACE_EMOJIS_RECTAS.length)]);
  }, [availableChallenges, challenges, stars, totalStars, onGoHome]);

  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
        loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  const handleOptionSelect = (option: RectasPairType) => {
    if (isVerified && feedback?.type === 'correct') return;
    setSelectedOption(option);
    setFeedback(null);
    if (isVerified && feedback?.type === 'incorrect') setIsVerified(false);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && feedback?.type === 'correct')) return;

    setIsVerified(true);
    const correctLabel = RECTAS_PAIR_TYPE_LABELS[currentChallenge.correctType];

    if (selectedOption === currentChallenge.correctType) {
      setStars(prev => Math.min(prev + 1, totalStars));
      setFeedback({ type: 'correct', message: `¡Correcto! Son rectas ${correctLabel.toLowerCase()}.` });
      onComplete(true);
      if (stars + 1 >= totalStars) {
        setTimeout(() => setFeedback({type: 'correct', message: '¡Felicidades! Ejercicio completado.'}), 50);
        setTimeout(onGoHome, 2500);
      } else {
        setTimeout(loadNewChallenge, 2000);
      }
    } else {
      setFeedback({ type: 'incorrect', message: 'Clasificación incorrecta. ¡Intenta otra vez!' });
      onComplete(false);
      if (stars < totalStars) {
        setTimeout(loadNewChallenge, 2500);
      }
    }
  }, [currentChallenge, selectedOption, totalStars, onComplete, loadNewChallenge, stars, onGoHome, isVerified, feedback]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando rectas...</div>;
    }
    const { ImageComponent } = currentChallenge; 
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-teal-600 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
            {exercise.question || "Observa las rectas. ¿Cómo son?"}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner">
          <ImageComponent className="max-w-full max-h-full" />
        </div>
        
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
      <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2">
        {shuffledOptions.map((optionType) => {
          const label = RECTAS_PAIR_TYPE_LABELS[optionType];
          const isSelected = selectedOption === optionType;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isSelected) {
            if (isVerified) {
              buttonClass = optionType === currentChallenge.correctType ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
          } else if (isVerified) { // Covers: verified, not selected, and feedback is 'incorrect' OR feedback is 'correct' (and this is not the selected one)
             buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          
          return (
            <button
              key={optionType}
              onClick={() => handleOptionSelect(optionType)}
              disabled={isVerified && feedback?.type === 'correct'}
              className={`w-full p-3 rounded-lg text-center text-md sm:text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            >
              {label}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={!selectedOption || (isVerified && feedback?.type === 'correct')}
          className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${!selectedOption || (isVerified && feedback?.type === 'correct') ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Verificar
        </button>
      </div>
    );
  };

  return (
    <ExerciseScaffold
      exerciseId={exercise.id}
      exerciseQuestion={exercise.question || "Observa el par de rectas. ¿Cómo se clasifican?"}
      totalStarsForExercise={totalStars}
      onNavigateBack={onNavigateBack}
      onGoHome={onGoHome}
      onAvatarClick={onAvatarClick}
      currentAvatar={currentAvatar}
      mainExerciseContentRenderer={(api) => <MainContent />} // To be adapted if this component uses scaffoldApi
      keypadComponent={<OptionsSidebar />}
      onFooterBack={onNavigateBack}
      onFooterHome={onGoHome}
      onSetCompleted={(exerciseId) => console.log('Fallback onSetCompleted called', exerciseId)}
    />
  );
};
