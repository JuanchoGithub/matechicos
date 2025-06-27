
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface MedirConReglaCmExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

interface RulerChallenge {
  objectEmoji: string;
  label: string;
  lengthCm: number; 
}

const CHARACTER_EMOJIS_REGLA = ['📏', '✏️', '📐', '🤔', '🧐'];

const RulerSVG: React.FC<{ maxCm: number; objectLengthCm: number }> = ({ maxCm, objectLengthCm }) => {
  const rulerHeight = 30;
  const tickHeight = 10;
  const halfTickHeight = 6;
  const labelYOffset = 22;
  const pixelsPerCm = 20; 
  const rulerWidth = maxCm * pixelsPerCm + 20; 

  return (
    <svg width={rulerWidth} height={rulerHeight + 15} className="bg-yellow-200 rounded">
      <rect x="5" y="5" width={maxCm * pixelsPerCm +10} height={rulerHeight} fill="rgb(253 224 71)" rx="3" />
      {Array.from({ length: maxCm + 1 }).map((_, i) => (
        <React.Fragment key={`cm-${i}`}>
          <line x1={10 + i * pixelsPerCm} y1="5" x2={10 + i * pixelsPerCm} y2={5 + tickHeight} stroke="black" strokeWidth="1" />
          <text x={10 + i * pixelsPerCm} y={labelYOffset+5} textAnchor="middle" fontSize="10px" fill="black">{i}</text>
          {i < maxCm && Array.from({ length: 9 }).map((_, j) => {
             if (j === 4) { 
                return <line key={`half-mm-${i}-${j}`} x1={10 + i * pixelsPerCm + (j + 1) * (pixelsPerCm / 10)} y1="5" x2={10 + i * pixelsPerCm + (j + 1) * (pixelsPerCm / 10)} y2={5+halfTickHeight + 2} stroke="black" strokeWidth="0.75" />;
             }
             return <line key={`mm-${i}-${j}`} x1={10 + i * pixelsPerCm + (j + 1) * (pixelsPerCm / 10)} y1="5" x2={10 + i * pixelsPerCm + (j + 1) * (pixelsPerCm / 10)} y2={5+halfTickHeight} stroke="black" strokeWidth="0.5" />;
          })}
        </React.Fragment>
      ))}
    </svg>
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const MedirConReglaCmExercise: React.FC<MedirConReglaCmExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<RulerChallenge | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_REGLA[0]);
  const [availableChallenges, setAvailableChallenges] = useState<RulerChallenge[]>([]);
  const [rulerMax, setRulerMax] = useState<number>(10);
  const [isAttemptPending, setIsAttemptPending] = useState<boolean>(false);


  const { challenges = [], rulerMaxCm = 10 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
      setRulerMax(rulerMaxCm);
    }
  }, [challenges, rulerMaxCm, exercise.id]);

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
      setCharacterEmoji(CHARACTER_EMOJIS_REGLA[Math.floor(Math.random() * CHARACTER_EMOJIS_REGLA.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
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


  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false); 
      setIsAttemptPending(false);
      return;
    }
    const isCorrect = userAnswerNum === currentChallenge.lengthCm;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Medida Correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'No es correcto. Mira bien la regla.' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 2 && /\d/.test(key)) setUserInput(prev => prev + key); 
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const pixelsPerCm = 20;
    const objectDisplayWidth = currentChallenge.lengthCm * pixelsPerCm;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <div className="my-4 flex flex-col items-start space-y-1">
          <div 
            className="h-10 bg-blue-300 rounded-sm flex items-center justify-center text-3xl p-2 shadow" 
            style={{ width: `${objectDisplayWidth}px`, marginLeft: '10px' }}
            aria-label={`${currentChallenge.label} de ${currentChallenge.lengthCm} cm`}
          >
            {currentChallenge.objectEmoji}
          </div>
          <RulerSVG maxCm={rulerMax} objectLengthCm={currentChallenge.lengthCm} />
        </div>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-2">cm</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
