
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';
import { generateProperFraction } from '../utils'; 

type KeypadHandler = (key: string) => void;

interface EscribirFraccionesPropiasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface FractionChallenge {
  numerator: number;
  denominator: number;
}

type ActiveInputType = 'numerator' | 'denominator';

const FACE_EMOJIS = ['📝', '🤔', '🧐', '💡', '📏', '🍰', '🍕', '🍫', '🔢', '🎯'];

export const EscribirFraccionesPropiasExercise: React.FC<EscribirFraccionesPropiasExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<FractionChallenge | null>(null);
  const [userInputNumerator, setUserInputNumerator] = useState<string>('');
  const [userInputDenominator, setUserInputDenominator] = useState<string>('');
  const [activeInput, setActiveInput] = useState<ActiveInputType>('numerator');
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState<boolean>(false);

  const { maxDenominator = 9 } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const initializeChallenge = useCallback(() => {
    const newFraction = generateProperFraction(maxDenominator); 
    setCurrentChallenge(newFraction);
    setUserInputNumerator('');
    setUserInputDenominator('');
    setActiveInput('numerator');
    showFeedback(null);
    setIsAttemptPending(false);
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
  }, [maxDenominator, showFeedback]);

  useEffect(() => {
    initializeChallenge();
  }, [initializeChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        initializeChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, initializeChallenge]);


  const handleInputFocus = (inputType: ActiveInputType) => {
    setActiveInput(inputType);
    showFeedback(null);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const numN = parseInt(userInputNumerator, 10);
    const numD = parseInt(userInputDenominator, 10);

    if (isNaN(numN) || isNaN(numD) || userInputNumerator === '' || userInputDenominator === '') {
      showFeedback({ type: 'incorrect', message: 'Completa ambos números de la fracción.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    const isCorrect = numN === currentChallenge.numerator && numD === currentChallenge.denominator;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Fracción correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Esa no es la fracción representada. ¡Intenta de nuevo!' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInputNumerator, userInputDenominator, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null); 

    if (key === 'check') {
      verifyAnswer();
      return;
    }

    if (key === 'backspace') {
      if (activeInput === 'denominator') {
        if (userInputDenominator) {
          setUserInputDenominator(''); 
        } else {
          setActiveInput('numerator');
          setUserInputNumerator('');
        }
      } else { 
        setUserInputNumerator(''); 
      }
    } else if (/\d/.test(key)) { 
      if (activeInput === 'numerator') {
        setUserInputNumerator(key); 
        setActiveInput('denominator'); 
      } else { 
        setUserInputDenominator(key); 
      }
    }
  }, [activeInput, userInputNumerator, userInputDenominator, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando fracción...</div>;
    }

    const { numerator, denominator } = currentChallenge;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-emerald-500 text-white text-md sm:text-lg p-2 sm:p-3" direction="left">
            Escribe la fracción que ves:
          </Icons.SpeechBubbleIcon>
        </div>

        {/* Visual Representation of Fraction */}
        <div className="w-full max-w-sm p-2 mb-4">
          <div className="flex border-2 border-slate-400 rounded-md overflow-hidden h-12 sm:h-16 shadow-inner">
            {Array.from({ length: denominator }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 transition-colors duration-150 ease-in-out border-r border-slate-300 last:border-r-0
                            ${i < numerator ? 'bg-sky-500' : 'bg-slate-200'}`}
                aria-hidden="true" 
              >
              </div>
            ))}
          </div>
        </div>

        {/* User Input Area for Fraction */}
        <div className="flex flex-col items-center justify-center space-y-1 mb-4">
            <button
                onClick={() => handleInputFocus('numerator')}
                className={`w-24 h-16 sm:w-28 sm:h-20 bg-white border-2 rounded-lg text-3xl sm:text-4xl font-bold text-slate-700 flex items-center justify-center transition-all
                            ${activeInput === 'numerator' ? 'border-sky-500 ring-4 ring-sky-300' : 'border-slate-300 hover:border-slate-400'}`}
                aria-label={`Numerador. Ingresado: ${userInputNumerator || 'vacío'}. Presione para activar.`}
            >
                {userInputNumerator || <span className="text-slate-300">N</span>}
            </button>
            <div className="h-1.5 bg-slate-700 w-20 sm:w-24 my-1 rounded-full"></div> {/* Fraction line */}
            <button
                onClick={() => handleInputFocus('denominator')}
                className={`w-24 h-16 sm:w-28 sm:h-20 bg-white border-2 rounded-lg text-3xl sm:text-4xl font-bold text-slate-700 flex items-center justify-center transition-all
                            ${activeInput === 'denominator' ? 'border-sky-500 ring-4 ring-sky-300' : 'border-slate-300 hover:border-slate-400'}`}
                aria-label={`Denominador. Ingresado: ${userInputDenominator || 'vacío'}. Presione para activar.`}
            >
                {userInputDenominator || <span className="text-slate-300">D</span>}
            </button>
        </div>
      </div>
    );
  };

  return <MainContent />;
};
