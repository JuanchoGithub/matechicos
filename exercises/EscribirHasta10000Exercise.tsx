
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

// Helper function to convert number to Spanish words (0-9,999,999)
const numberToWordsSpanish = (num: number): string => {
    if (num < 0 || num > 9999999) { // Expanded range
        return "Número fuera de rango";
    }
    if (num === 0) return "Cero";

    const units: string[] = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const teens: string[] = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const tens: string[] = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const hundreds: string[] = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    const convertGroupOfThree = (n: number): string => {
        if (n === 0) return "";
        let currentWords = "";

        const C = Math.floor(n / 100);
        const DU = n % 100;

        if (C > 0) {
            if (C === 1 && DU === 0) currentWords = "cien"; // Cien exacto
            else currentWords = hundreds[C] + (DU > 0 ? " " : ""); // Add space only if tens/units follow, e.g. "ciento cinco", "doscientos"
        }

        if (DU > 0) {
            if (DU < 10) currentWords += units[DU];
            else if (DU < 20) currentWords += teens[DU - 10];
            else {
                const D_digit = Math.floor(DU / 10);
                const U_digit = DU % 10;
                if (DU < 30) { // Veintialgo
                    currentWords += (DU === 20) ? "veinte" : "veinti" + units[U_digit];
                } else {
                    currentWords += tens[D_digit];
                    if (U_digit > 0) currentWords += " y " + units[U_digit];
                }
            }
        }
        return currentWords.trim(); // Ensure no leading/trailing spaces from this part
    };

    const millionsPart = Math.floor(num / 1000000);
    const remainderAfterMillions = num % 1000000;

    let resultWords = "";

    if (millionsPart > 0) {
        if (millionsPart === 1) {
            resultWords = "Un millón";
        } else {
            let millionsStr = convertGroupOfThree(millionsPart);
            // Apocopation for "uno" -> "un" or "ún" before "millones"
            // Only apply if it's not just "uno" standalone (which convertGroupOfThree(1) would return)
            // and not part of a larger number like "ciento uno" where "uno" is desired.
            if (millionsStr.endsWith("uno") && millionsPart !== 1) { 
                 if (millionsPart % 100 === 21 && millionsPart !== 21 && Math.floor(millionsPart / 100) > 0) { // e.g. "ciento veintiuno" -> "ciento veintiún"
                     millionsStr = millionsStr.slice(0, -1) + "ún"; 
                } else if (millionsPart === 21) { // "veintiuno" -> "veintiún"
                     millionsStr = "veintiún";
                } else if (millionsStr !== "uno") { // e.g. "treinta y uno" -> "treinta y un", but "uno" stays "uno" (as in "ciento uno")
                     millionsStr = millionsStr.slice(0, -1); 
                }
            }
            resultWords = millionsStr + " millones";
        }
    }

    if (remainderAfterMillions > 0) {
        if (resultWords.length > 0) resultWords += " ";
        
        const thousandsPart = Math.floor(remainderAfterMillions / 1000);
        const remainderPart = remainderAfterMillions % 1000;
        let lessThanMillionStr = "";

        if (thousandsPart > 0) {
            if (thousandsPart === 1) {
                lessThanMillionStr = "mil"; // "mil" not "un mil"
            } else { // thousandsPart > 1
                let thousandsStr = convertGroupOfThree(thousandsPart);
                // Apocopation for "uno" -> "un" or "ún" before "mil"
                if (thousandsStr.endsWith("uno")) { 
                    if (thousandsPart % 100 === 21 && thousandsPart !== 21 && Math.floor(thousandsPart / 100) > 0 ) { // e.g. "ciento veintiuno mil" -> "ciento veintiún mil"
                         thousandsStr = thousandsStr.slice(0, -1) + "ún"; 
                    } else if (thousandsPart === 21) { // "veintiuno mil" -> "veintiún mil"
                         thousandsStr = "veintiún";
                    }
                    // For cases like "treinta y uno mil", "ciento uno mil"
                    else if (thousandsStr !== "uno") { // Avoid changing "uno" from convertGroupOfThree(1) if it were to be used directly with "mil"
                         thousandsStr = thousandsStr.slice(0, -1); 
                    }
                }
                lessThanMillionStr = thousandsStr + " mil";
            }
        }

        if (remainderPart > 0) {
            if (lessThanMillionStr.length > 0) lessThanMillionStr += " ";
            lessThanMillionStr += convertGroupOfThree(remainderPart);
        }
        resultWords += lessThanMillionStr;
    }
    
    if (resultWords.length > 0) {
        // Capitalize first letter
        return resultWords.charAt(0).toUpperCase() + resultWords.slice(1);
    }
    return ""; // Should only happen if num was 0 (handled) or error (caught by range check)
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
    if (advanceToNextChallengeSignal > (previousAdvanceSignalRef.current ?? -1) ) { // Handle initial undefined
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
    } else if (userInput.length < 7 && /\d/.test(key)) { // Max length for 9,999,999 is 7
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
