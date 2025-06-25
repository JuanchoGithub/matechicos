
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed, this component is content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void; // Define KeypadHandler type if not globally available

interface EscribirHasta10000ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

// Helper function to convert number to Spanish words (0-10000)
const numberToWordsSpanish = (num: number): string => {
  if (num < 0 || num > 10000) {
    return "Número fuera de rango";
  }
  if (num === 0) return "Cero";

  const units: string[] = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teens: string[] = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const tens: string[] = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const hundreds: string[] = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

  let words = "";

  if (num === 10000) return "Diez mil";

  if (num >= 1000) {
    const thousandsDigit = Math.floor(num / 1000);
    if (thousandsDigit === 1) {
      words += "Mil";
    } else {
      words += units[thousandsDigit] + " mil";
    }
    num %= 1000; 
    if (num > 0) {
      words += " ";
    } else {
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
  }

  if (num >= 100) {
    const hundredsDigit = Math.floor(num / 100);
    if (num === 100 && words === "") { 
      words += "cien";
    } else if (num === 100 && words !== "") { 
       words += "cien";
    }
     else {
      words += hundreds[hundredsDigit];
    }
    num %= 100;
    if (num > 0) {
      words += " ";
    } else {
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
  }
  
  if (num > 0) {
    if (num < 10) { 
      words += units[num];
    } else if (num < 20) { 
      words += teens[num - 10];
    } else if (num < 30) { 
      if (num === 20) {
        words += "veinte";
      } else {
        words += "veinti" + units[num % 10].toLowerCase();
      }
    } else { 
      const tensDigit = Math.floor(num / 10);
      words += tens[tensDigit];
      const unitsDigit = num % 10;
      if (unitsDigit > 0) {
        words += " y " + units[unitsDigit];
      }
    }
  }
  
  return words.charAt(0).toUpperCase() + words.slice(1);
};


interface CurrentChallenge {
  numberWord: string;
  correctNumber: string;
}

const FACE_EMOJIS = ['😀', '🤔', '😊', '🥳', '🤩', '🧐', '🙂', '😇', '😃', '😉', '😙', '😋', '😌', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐒'];

export const EscribirHasta10000Exercise: React.FC<EscribirHasta10000ExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minNumber = 0, maxNumber = 10000 } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi; // Destructure for stable refs
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallengeInternal = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const newNumberWord = numberToWordsSpanish(newNumber);
    setCurrentChallenge({
      numberWord: newNumberWord,
      correctNumber: newNumber.toString(),
    });
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
    setUserInput('');
    setIsAttemptPending(false); 
    showFeedback(null); // Clear feedback for new challenge
  }, [minNumber, maxNumber, showFeedback]);

  useEffect(() => {
    generateNewChallengeInternal();
  }, [generateNewChallengeInternal, exercise.id]); 

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) { 
        generateNewChallengeInternal();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallengeInternal]);


  const checkAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;

    setIsAttemptPending(true);
    const isCorrect = userInput === currentChallenge.correctNumber;
    onAttempt(isCorrect); // Use onAttempt from scaffoldApi

    if (isCorrect) {
        showFeedback({ type: 'correct', message: '¡Número correcto!' });
        // Scaffold will handle advancing if needed, setIsAttemptPending(false) will be called in generateNewChallengeInternal
    } else {
        showFeedback({ type: 'incorrect', message: 'Número incorrecto. ¡Inténtalo de nuevo!' });
        setIsAttemptPending(false); // Allow retry immediately
    }
  }, [userInput, currentChallenge, onAttempt, showFeedback, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return; 
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1)); // Improved backspace
    } else if (key === 'check') {
      checkAnswer();
    } else if (userInput.length < 5 && /\d/.test(key)) { 
      setUserInput((prev) => prev + key);
    }
  }, [isAttemptPending, checkAnswer, userInput, showFeedback]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null); // Cleanup
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
          <div className="relative mb-8">
              <div className="w-32 h-32 flex items-center justify-center text-8xl">
                {currentEmoji}
              </div>
              <div className="absolute -top-5 -right-10 transform translate-x-1/2">
                  <Icons.SpeechBubbleIcon className="bg-green-500 text-white" direction="left">
                      <Icons.ProblemsIcon className="w-8 h-8 inline-block" />
                  </Icons.SpeechBubbleIcon>
              </div>
          </div>

        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-6 h-24 flex items-center justify-center">
          {currentChallenge.numberWord}
        </p>
        
        <div 
          className="w-full h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider mb-6 shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400"></span>}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
