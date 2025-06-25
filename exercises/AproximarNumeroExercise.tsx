
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; 
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface AproximarNumeroExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentChallenge {
  numberToRound: number;
  correctAnswer: number;
}

const FACE_EMOJIS_MAP: { [key: number]: string[] } = {
  10: ['🎯', '🤔', '🧐', '💡', '🤓', '👍', '👌', '💯', '✨', '📏', '🎈'],
  100: ['🎯', '🤔', '🧐', '💡', '🤓', '👍', '👌', '💯', '✨', '📏', '🎈', '🏦'],
  1000: ['🎯', '🤔', '🧐', '💡', '🤓', '👍', '👌', '💯', '✨', '📏', '🎈', '🏦', '⛰️'],
};

const SPEECH_BUBBLE_COLORS: { [key: number]: string } = {
    10: 'bg-orange-500',
    100: 'bg-teal-500',
    1000: 'bg-purple-600',
};

const UNIT_NAMES: { [key: number]: string } = {
    10: 'decena',
    100: 'centena',
    1000: 'millar',
};

export const AproximarNumeroExercise: React.FC<AproximarNumeroExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>('🎯');
  const [speechBubbleColor, setSpeechBubbleColor] = useState<string>('bg-orange-500');
  const [unitName, setUnitName] = useState<string>('decena');
  const [isAttemptPending, setIsAttemptPending] = useState(false);


  const { 
    minNumber = 10, 
    maxNumber = 999, 
    roundingUnit = 10 
  } = exercise.data || {};

  const { showFeedback, advanceToNextChallengeSignal, onAttempt } = scaffoldApi; // Destructure for stable refs

  useEffect(() => {
    const emojis = FACE_EMOJIS_MAP[roundingUnit] || FACE_EMOJIS_MAP[10];
    setCurrentEmoji(emojis[0]);
    setSpeechBubbleColor(SPEECH_BUBBLE_COLORS[roundingUnit] || SPEECH_BUBBLE_COLORS[10]);
    setUnitName(UNIT_NAMES[roundingUnit] || UNIT_NAMES[10]);
  }, [roundingUnit]);

  const generateNewChallenge = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const correctAnswer = Math.round(newNumber / roundingUnit) * roundingUnit;

    setCurrentChallenge({
      numberToRound: newNumber,
      correctAnswer: correctAnswer,
    });
    setUserInput('');
    showFeedback(null); 
    setIsAttemptPending(false);
    const emojis = FACE_EMOJIS_MAP[roundingUnit] || FACE_EMOJIS_MAP[10];
    setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  }, [minNumber, maxNumber, roundingUnit, showFeedback]); // Use destructured showFeedback

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);
  
  const previousAdvanceSignal = useRef(advanceToNextChallengeSignal);
  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignal.current) {
        generateNewChallenge();
        previousAdvanceSignal.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);


  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false); // Use destructured onAttempt
      setIsAttemptPending(false); // Allow retry
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    onAttempt(isCorrect); // Use destructured onAttempt

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto! Bien redondeado.' });
    } else {
      let errorMsg = `No es la ${unitName} correcta. `;
      if (roundingUnit === 10) errorMsg += 'Revisa las unidades y prueba de nuevo.';
      else if (roundingUnit === 100) errorMsg += 'Revisa las decenas y unidades y prueba de nuevo.';
      else if (roundingUnit === 1000) errorMsg += 'Revisa las centenas, decenas y unidades y prueba de nuevo.';
      else errorMsg += 'Revisa tu cálculo y prueba de nuevo.';
      showFeedback({ type: 'incorrect', message: errorMsg });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, roundingUnit, unitName, isAttemptPending]); // Use destructured versions

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 5 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]); // Use destructured showFeedback
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-28 h-28 flex items-center justify-center text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className={`${speechBubbleColor} text-white text-lg p-3 max-w-xs`} direction="left">
            Redondea a la {unitName}: <strong className="block text-4xl font-bold">{currentChallenge.numberToRound}</strong>
          </Icons.SpeechBubbleIcon>
        </div>

        <div
          className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
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
