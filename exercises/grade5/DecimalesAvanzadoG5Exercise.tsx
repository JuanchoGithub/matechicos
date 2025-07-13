import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, DecimalAvanzadoChallenge } from '../../types';
import { Icons } from '../../components/icons'; // Icons might be used for feedback or styling
import { TimeOptionsKeypad } from '../../components/TimeOptionsKeypad';

// Helper function to convert number part to Spanish words (0-999)
const numberToWordsHelper = (num: number): string => {
    if (num === 0) return "cero";

    const units: string[] = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const teens: string[] = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const tens: string[] = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const hundreds: string[] = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    let words = "";

    if (num >= 100) {
        if (num === 100) return "cien";
        words += hundreds[Math.floor(num / 100)];
        num %= 100;
        if (num > 0) words += " ";
    }

    if (num > 0) {
        if (num < 10) words += units[num];
        else if (num < 20) words += teens[num - 10];
        else {
            words += tens[Math.floor(num / 10)];
            if (num % 10 > 0) {
                if (num > 20 && num < 30) words = words.slice(0, -1) + "i" + units[num % 10]; // veintiuno, veintidos...
                else words += " y " + units[num % 10];
            }
        }
    }
    // Apocope "uno" to "un" if it's part of a larger number like "veintiuno" (handled by veinti prefix)
    // but for standalone 1 like "un milésimo", it should be handled at the place value naming.
    if (words.endsWith("uno") && num !== 1) { // Example: "ciento uno"
      // Keep "uno" for "ciento uno"
    } else if (words === "uno" && num === 1) {
      // Keep "uno" when it's just the number 1 itself for a place value.
    }


    return words.trim();
};


const decimalToWordsSpanish = (decimalValue: number): string => {
    if (decimalValue < 0 || decimalValue >= 1) {
        // This function currently handles only the decimal part of numbers like 0.xxx
        // For whole numbers or numbers >= 1, extend this logic.
        // For this exercise, we expect numbers like 0.753
        if (decimalValue === 0) return "cero"; // Though context is usually positive decimals
        // Fallback for now if a whole number part is passed unexpectedly.
        // A more robust function would handle the integer part separately.
        // For 0.xxx, integerPart is 0.
    }

    const decimalStr = decimalValue.toString();
    if (!decimalStr.includes('.')) { // It's a whole number, this function is for the decimal part
        return numberToWordsHelper(decimalValue); // Or handle as an error / integer part
    }
    
    const parts = decimalStr.split('.');
    const decimalPartStr = parts[1] || "";
    let num = parseInt(decimalPartStr, 10);

    if (isNaN(num) || decimalPartStr.length === 0) {
        return "cero"; // Or an empty string if only integer part was handled elsewhere
    }

    let placeValueWord = "";
    if (decimalPartStr.length === 1) placeValueWord = num === 1 ? "décimo" : "décimos";
    else if (decimalPartStr.length === 2) placeValueWord = num === 1 ? "centésimo" : "centésimos";
    else if (decimalPartStr.length === 3) placeValueWord = num === 1 ? "milésimo" : "milésimos";
    else {
        // Handle more decimal places or decide on a limit
        // For G5, up to milésimos is typical
        // If it's more, e.g., 0.1234, we might need to adjust num and placeValueWord
        // For now, assume max 3 decimal places based on "milésimos"
        num = parseInt(decimalPartStr.substring(0, 3), 10); // Truncate to 3 for simplicity
        placeValueWord = num === 1 ? "milésimo" : "milésimos";
    }
    
    let numberWords = numberToWordsHelper(num);
    if (num === 1) { // Apocope "uno" to "un" before masculine nouns like "décimo", "centésimo", "milésimo"
        if (placeValueWord.startsWith("décim") || placeValueWord.startsWith("centésim") || placeValueWord.startsWith("milésim")) {
            numberWords = "un";
        }
    }

    return `${numberWords} ${placeValueWord}`;
};


interface DecimalesAvanzadoG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler?: (handler: ((key: string) => void) | null) => void;
  setCustomKeypadContent?: (content: React.ReactNode | null) => void;
}

export const DecimalesAvanzadoG5Exercise: React.FC<DecimalesAvanzadoG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler, setCustomKeypadContent
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DecimalAvanzadoChallenge | null>(null);
  const [userInputWords, setUserInputWords] = useState<string>("");
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    // For now, cycle through a predefined set or generate dynamically
    // This example uses a hardcoded challenge for "decimal_to_word"
    const exampleDecimal = parseFloat((Math.random() * 0.999 + 0.001).toFixed(3)); // Random 1-3 decimal places
    const correctWords = decimalToWordsSpanish(exampleDecimal);

    const newChallenge: DecimalAvanzadoChallenge = {
      value: exampleDecimal,
      representationType: 'decimal_to_word',
      correctAnswer: correctWords,
      // Options are not used for text input mode, but good for MCQ variant
      options: [correctWords, decimalToWordsSpanish(parseFloat((Math.random()*0.99+0.01).toFixed(2))), decimalToWordsSpanish(parseFloat(Math.random().toFixed(1)))]
    };
    setCurrentChallenge(newChallenge);
    setUserInputWords("");
    showFeedback(null);
    setIsAttemptPending(false);
  }, [showFeedback]);

  useEffect(() => {
    generateNewChallenge();
    // Cleanup custom keypad if it was set by a previous version of this component
    return () => {
      if (setCustomKeypadContent) setCustomKeypadContent(null);
    };
  }, [exercise.id, generateNewChallenge, setCustomKeypadContent]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInputWords(event.target.value);
  };

  const verifyAnswer = useCallback((selectedOption?: string) => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    // Use selectedOption if provided (MCQ), else use userInputWords (for fallback/text input)
    const userAnswer = (typeof selectedOption === 'string' ? selectedOption : userInputWords).toLowerCase().trim().split(/\s+/).join(' ');
    const normalizedCorrectAnswer = currentChallenge.correctAnswer.toLowerCase().trim().split(/\s+/).join(' ');

    const isCorrect = userAnswer === normalizedCorrectAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era: "${currentChallenge.correctAnswer}"` });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentChallenge, userInputWords, onAttempt, showFeedback, isAttemptPending]);

  // For MCQ sidebar keypad
  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge && currentChallenge.representationType === 'decimal_to_word') {
      setCustomKeypadContent(
        <TimeOptionsKeypad
          options={currentChallenge.options || []}
          selectedOption={userInputWords}
          onOptionSelect={option => {
            if (!isAttemptPending) {
              setUserInputWords(option);
              setIsVerified(false);
            }
          }}
          onVerify={() => {
            if (!isAttemptPending && userInputWords) {
              verifyAnswer(userInputWords);
              setIsVerified(true);
            }
          }}
          isVerified={isVerified}
          correctAnswerText={currentChallenge.correctAnswer}
        />
      );
    } else if (setCustomKeypadContent) {
      setCustomKeypadContent(null);
    }
    // Clean up on unmount
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, currentChallenge, userInputWords, isAttemptPending, isVerified, verifyAnswer]);

  if (!currentChallenge) {
    return <div className="p-4 text-slate-700">Cargando desafío de decimales...</div>;
  }

  let questionText = "";
  if (currentChallenge.representationType === 'decimal_to_word') {
    questionText = `Escribe cómo se lee el siguiente número decimal:`;
  } else if (currentChallenge.representationType === 'word_to_decimal') {
    questionText = `Escribe el número decimal para: "${currentChallenge.correctAnswer}"`; // Example use
  } else {
    questionText = `Identifica el valor en la posición de ${currentChallenge.placeToIdentify || 'desconocido'} en el número:`;
  }

  return (
    <div className="flex flex-col items-center p-4 text-slate-800 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-sky-700 mb-3 text-center">{exercise.title}</h3>
      <p className="text-md text-slate-700 mb-2 text-center">
        {questionText}
      </p>
      {currentChallenge.representationType === 'decimal_to_word' && (
        <div className="my-3 p-3 bg-sky-100 border border-sky-300 rounded-lg shadow-sm w-full text-center">
          <span className="text-4xl font-mono text-sky-700 tracking-wider">
            {currentChallenge.value}
          </span>
        </div>
      )}
      {/* Options are now in the sidebar keypad */}
      {/* Add UI for 'word_to_decimal' and 'identify_place_value_decimal' types here as needed */}
       {currentChallenge.representationType === 'word_to_decimal' && (
         <div className="p-6 border border-slate-300 rounded-lg bg-white shadow-md w-full max-w-md min-h-[100px] flex items-center justify-center mt-4">
            <p className="text-slate-600 italic">
                (Aquí iría la interfaz para ingresar el decimal basado en: "{currentChallenge.correctAnswer}")
            </p>
        </div>
       )}
       {currentChallenge.representationType === 'identify_place_value_decimal' && (
         <div className="p-6 border border-slate-300 rounded-lg bg-white shadow-md w-full max-w-md min-h-[100px] flex items-center justify-center mt-4">
            <p className="text-slate-600 italic">
                (Aquí iría la interfaz para identificar la cifra en la posición de {currentChallenge.placeToIdentify} del número {currentChallenge.value})
            </p>
        </div>
       )}


    </div>
  );
};
