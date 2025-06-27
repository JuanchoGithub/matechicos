
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AvatarData, IconName, HeartStatus, ExerciseScaffoldApi } from '../types';
import { Icons, getIcon, AllIconNames } from './icons';

const INITIAL_LIVES = 3;
const HEART_ANIMATION_DURATION = 1100; // ms, pulse (0.5s) + shatter (0.6s)
const DEFAULT_TOTAL_STARS_SCAFFOLD = 5; // Default if not provided by exercise data

export interface ExerciseScaffoldProps {
  exerciseId: string;
  exerciseQuestion?: string;
  totalStarsForExercise: number; 
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onSetCompleted: (exerciseId: string) => void; 
  currentAvatar: AvatarData;
  mainExerciseContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  keypadComponent: React.ReactNode | null; // Updated type to allow null
  onFooterBack?: () => void;
  onFooterHome?: () => void;
  onApiReady?: (api: ExerciseScaffoldApi) => void;
}

const HeaderAvatarDisplay: React.FC<{ avatar: AvatarData, onClick: () => void }> = ({ avatar, onClick }) => {
  const AvatarIconComponent = getIcon(avatar.iconName as AllIconNames);
  return (
    <button onClick={onClick} className={`p-1 rounded-full hover:bg-white/30 transition-colors ${avatar.color}`}>
      {AvatarIconComponent && <AvatarIconComponent className="w-9 h-9" />}
    </button>
  );
};

export const ExerciseScaffold: React.FC<ExerciseScaffoldProps> = ({
  exerciseId,
  exerciseQuestion,
  totalStarsForExercise,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onSetCompleted,
  currentAvatar,
  mainExerciseContentRenderer,
  keypadComponent,
  onFooterBack,
  onFooterHome,
  onApiReady, 
}) => {
  const [starsAchievedInternal, setStarsAchievedInternal] = useState<number>(0);
  const [livesRemaining, setLivesRemaining] = useState<number>(INITIAL_LIVES);
  const [losingLifeAtIndex, setLosingLifeAtIndex] = useState<number | null>(null);
  const [advanceSignal, setAdvanceSignal] = useState<number>(0); 
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'correct' | 'incorrect' | 'gameover' | 'congrats', message: string} | null>(null);

  useEffect(() => {
    setStarsAchievedInternal(0);
    setLivesRemaining(INITIAL_LIVES);
    setLosingLifeAtIndex(null);
    setAdvanceSignal(0);
    setFeedbackMessage(null);
  }, [exerciseId]);

  const showTemporaryFeedback = useCallback((type: 'correct' | 'incorrect' | 'gameover' | 'congrats', message: string, duration: number = 1500) => {
    let bgColorClass = 'bg-blue-500'; // Default or for neutral/info
    if (type === 'correct') bgColorClass = 'bg-green-500';
    else if (type === 'incorrect') bgColorClass = 'bg-red-500';
    else if (type === 'gameover') bgColorClass = 'bg-slate-700';
    else if (type === 'congrats') bgColorClass = 'bg-yellow-500';
    
    setFeedbackMessage({ type, message }); // Store type for potential specific styling if needed later
    
    // Apply background color directly or pass it to the rendering part
    // For now, let's assume the rendering part handles the background based on `type`
    
    setTimeout(() => {
        if (type !== 'gameover' && type !== 'congrats') { 
            setFeedbackMessage(null);
        }
    }, duration);
  }, []); 

  const handleAttempt: ExerciseScaffoldApi['onAttempt'] = useCallback((isCorrect: boolean) => {
    if (losingLifeAtIndex !== null) return; 

    if (isCorrect) {
      const newStars = starsAchievedInternal + 1;
      setStarsAchievedInternal(newStars);
      showTemporaryFeedback('correct', '¡Correcto!');
      
      if (newStars >= totalStarsForExercise) {
        onSetCompleted(exerciseId);
        showTemporaryFeedback('congrats', '¡Felicidades! Ejercicio completado.', 2500);
        setTimeout(onNavigateBack, 2600);
      } else {
        setTimeout(() => setAdvanceSignal(prev => prev + 1), 500);
      }
    } else {
      const currentLives = livesRemaining;
      setLosingLifeAtIndex(currentLives - 1); 
      const newLives = currentLives - 1;
      setLivesRemaining(newLives);

      setTimeout(() => { 
        setLosingLifeAtIndex(null); 
        if (newLives <= 0) {
          showTemporaryFeedback('gameover', '¡Oh no! Te quedaste sin intentos.', 2000);
          setTimeout(onNavigateBack, 2100); 
        } else {
          showTemporaryFeedback('incorrect', 'Inténtalo de nuevo.');
        }
      }, HEART_ANIMATION_DURATION);
    }
  }, [starsAchievedInternal, livesRemaining, totalStarsForExercise, exerciseId, onSetCompleted, onNavigateBack, losingLifeAtIndex, showTemporaryFeedback]);

  const memoizedShowFeedback = useCallback((feedback: {type: 'correct' | 'incorrect' | 'gameover' | 'congrats', message: string} | null) => {
    if (feedback) {
        showTemporaryFeedback(feedback.type, feedback.message, 2000);
    } else {
        setFeedbackMessage(null); 
    }
  }, [showTemporaryFeedback]); 

  const scaffoldApi = useMemo((): ExerciseScaffoldApi => ({
    onAttempt: handleAttempt,
    advanceToNextChallengeSignal: advanceSignal,
    showFeedback: memoizedShowFeedback,
  }), [handleAttempt, advanceSignal, memoizedShowFeedback]);

  useEffect(() => {
    if (onApiReady) {
      onApiReady(scaffoldApi);
    }
  }, [onApiReady, scaffoldApi]);
  
  let feedbackBgColor = 'bg-blue-500';
  if (feedbackMessage) {
    if (feedbackMessage.type === 'correct') feedbackBgColor = 'bg-green-500';
    else if (feedbackMessage.type === 'incorrect') feedbackBgColor = 'bg-red-500';
    else if (feedbackMessage.type === 'gameover') feedbackBgColor = 'bg-slate-700';
    else if (feedbackMessage.type === 'congrats') feedbackBgColor = 'bg-yellow-500 text-black'; // Congrats with black text for yellow bg
  }


  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden">
      <header className="bg-sky-500 text-white p-2 shadow-md flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Volver">
            <Icons.BackArrowIcon className="w-6 h-6" />
          </button>
          <button onClick={onGoHome} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Inicio">
            <Icons.HomeIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalStarsForExercise || DEFAULT_TOTAL_STARS_SCAFFOLD }).map((_, i) => (
            <Icons.StarIcon key={`star-${i}`} className={`w-5 h-5 ${i < starsAchievedInternal ? 'text-yellow-400' : 'text-sky-300'}`} filled={i < starsAchievedInternal} />
          ))}
          <Icons.GiftIcon className="w-6 h-6 text-yellow-300 ml-1 mr-3" />
        </div>
        <HeaderAvatarDisplay avatar={currentAvatar} onClick={onAvatarClick} />
      </header>

      <div className="flex-grow flex flex-row overflow-hidden relative z-10"> {/* Main/Aside Parent with z-10 */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-y-auto overflow-x-hidden relative z-[1]"> {/* main with z-1 */}
          {exerciseQuestion && (
            <div className="w-full max-w-2xl text-left mb-4 p-2 border-b-2 border-slate-300 border-dashed">
              <p className="text-slate-600 text-lg">{exerciseQuestion}</p>
            </div>
          )}
          {mainExerciseContentRenderer(scaffoldApi)}
          {feedbackMessage && (
             <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transform p-3 rounded-md text-white font-semibold text-lg shadow-xl z-10 pointer-events-none ${feedbackBgColor}`}>
                {feedbackMessage.message}
            </div>
          )}
        </main>

        <aside className="w-1/3 max-w-xs bg-teal-500 p-3 flex flex-col items-center space-y-3 shadow-lg flex-shrink-0 relative z-[2]"> {/* aside with z-2 */}
          <div className="flex flex-col items-center text-white mt-2">
             {(() => { 
                const AvatarIcon = getIcon(currentAvatar.iconName as AllIconNames);
                return AvatarIcon && <AvatarIcon className={`w-16 h-16 mb-1 ${currentAvatar.color.replace('text-','fill-')}`} />;
            })()}
            <span className="font-semibold">{currentAvatar.name || 'Usuario'}</span>
          </div>
          {keypadComponent}
          
          <div className="flex items-center justify-center space-x-1 mt-4 pt-3 border-t border-teal-400/50 w-full">
            {Array.from({ length: INITIAL_LIVES }).map((_, i) => {
              let heartStatus: HeartStatus = 'empty';
              if (losingLifeAtIndex === i) heartStatus = 'losing';
              else if (i < livesRemaining) heartStatus = 'filled';
              return (
                <Icons.HeartIcon key={`life-${i}`} className="w-7 h-7 sm:w-8 sm:h-8" status={heartStatus} />
              );
            })}
          </div>
        </aside>
      </div>

      {(onFooterBack || onFooterHome) && (
        <footer className="bg-slate-200 p-2 flex items-center justify-center space-x-4 border-t border-slate-300 flex-shrink-0 relative z-[3]">
          {onFooterBack && (
            <button onClick={onFooterBack} className="p-2 text-slate-600 hover:text-sky-600 transition-colors" aria-label="Atrás (pie de página)">
              <Icons.BackArrowIcon className="w-7 h-7 transform scale-x-[-1]" />
            </button>
          )}
          {onFooterHome && (
            <button onClick={onFooterHome} className="p-2 text-slate-600 hover:text-sky-600 transition-colors" aria-label="Inicio (pie de página)">
              <Icons.HomeIcon className="w-7 h-7" />
            </button>
          )}
        </footer>
      )}
    </div>
  );
};

