
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Removed, this is content-only
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface VisualArithmetic1DigitExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const VISUAL_ITEM_EMOJIS = ['🍎', '⚽', '⭐', '🎈', '🚗', '🌸', '🦋', '🌳', '🐠', '🍓', '🍭', '🧁', '🧩', '🧸'];
const CHARACTER_EMOJIS_VISUAL = ['🤔', '🧐', '💡', '🤓', '😊', '➕', '➖', '👀', '👍', '💯'];

interface CurrentChallenge {
  num1: number;
  num2: number;
  operation: '+' | '-';
  correctAnswer: number;
  visualItemEmoji: string;
  problemText: string; // For display if needed, though focus is visual
}

export const VisualArithmetic1DigitExercise: React.FC<VisualArithmetic1DigitExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_VISUAL[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    operation = '+', 
    maxOperandValue = 9, 
    ensureNoCarryOrBorrow = false, 
    forceCarryOrBorrow = false, 
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    let num1: number, num2: number, answer: number;
    const op = operation as '+' | '-'; 

    do {
        num1 = Math.floor(Math.random() * (maxOperandValue + 1));
        num2 = Math.floor(Math.random() * (maxOperandValue + 1));

        if (op === '+') {
            answer = num1 + num2;
            if (ensureNoCarryOrBorrow && answer >= 10) continue;
            if (forceCarryOrBorrow && answer < 10 && (num1 < 9 || num2 < 9) ) continue; 
        } else { 
            if (num1 < num2) [num1, num2] = [num2, num1]; 
            answer = num1 - num2;
            if (ensureNoCarryOrBorrow && (num1 % 10) < (num2 % 10) ) continue; 
        }
    } while ( (ensureNoCarryOrBorrow && op === '+' && (num1 % 10) + (num2 % 10) >= 10) ||
              (forceCarryOrBorrow && op === '+' && (num1 % 10) + (num2 % 10) < 10 && (num1 < 9 || num2 < 9)) ||
              (op === '+' && answer > 18) || 
              (op === '-' && answer < 0) 
            );


    const visualItemEmoji = VISUAL_ITEM_EMOJIS[Math.floor(Math.random() * VISUAL_ITEM_EMOJIS.length)];
    const problemText = `${num1} ${op} ${num2} = ?`; 

    setCurrentChallenge({
      num1,
      num2,
      operation: op,
      correctAnswer: answer,
      visualItemEmoji,
      problemText,
    });

    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
    setCharacterEmoji(CHARACTER_EMOJIS_VISUAL[Math.floor(Math.random() * CHARACTER_EMOJIS_VISUAL.length)]);
  }, [maxOperandValue, operation, ensureNoCarryOrBorrow, forceCarryOrBorrow, showFeedback]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

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

    const isCorrect = userAnswerNum === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: '¡Inténtalo de nuevo!' });
      setIsAttemptPending(false);
    }
  }, [userInput, currentChallenge, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 2 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const VisualGroup: React.FC<{ count: number; emoji: string, label: string }> = ({ count, emoji, label }) => (
    <div className="flex flex-col items-center m-2 p-2 bg-slate-100 rounded-md shadow-sm min-w-[80px]">
      <div className="flex flex-wrap justify-center gap-1 min-h-[3em]">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-2xl sm:text-3xl" role="img" aria-label={label}>{emoji}</span>
        ))}
      </div>
      <span className="text-lg sm:text-xl font-bold text-slate-700 mt-1">{count}</span>
    </div>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="text-xl text-slate-600">Cargando desafío...</div>;
    }
    const { num1, num2, operation, visualItemEmoji } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-2 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {characterEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-green-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || `¿Cuánto es ${num1} ${operation} ${num2}?`}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-4 my-2">
          <VisualGroup count={num1} emoji={visualItemEmoji} label={`Grupo de ${num1} ${visualItemEmoji}`} />
          <span className="text-3xl sm:text-4xl font-bold text-slate-600">{operation}</span>
          <VisualGroup count={num2} emoji={visualItemEmoji} label={`Grupo de ${num2} ${visualItemEmoji}`} />
        </div>
        
        <div 
          className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
