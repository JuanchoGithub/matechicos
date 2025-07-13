
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi, GradeLevel, PlaceValueKey } from '../types'; 
import { Icons } from '../components/icons';
import { ROD_CONFIG, PLACE_VALUES_ORDER_FOR_DISPLAY } from '../components/abacusConstants'; // Using new display order


type KeypadHandler = (key: string) => void;

interface DecomposedNumber {
  umillon?: number;
  cmillon?: number;
  dmillon?: number;
  umil?: number;
  cmil?: number; // Centena de Millar
  dmil?: number; // Decena de Millar
  um: number;   // Unidad de Millar
  c: number;
  d: number;
  u: number;
}

interface CurrentChallenge {
  numberToDecompose: number;
  correctDecomposition: DecomposedNumber;
}

interface ComponerHasta10000TextoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
  gradeLevel: GradeLevel; 
}

interface UserInputs {
  [key: string]: string; // Allow any place value key
}

const FACE_EMOJIS = ['🔢', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '✨', '🧩'];

const decomposeNumberG4 = (num: number, placeValuesToConsider: PlaceValueKey[]): DecomposedNumber => {
  const result: Partial<DecomposedNumber> = { u:0, d:0, c:0, um:0, dmil:0, cmil:0, umil:0, umillon:0, cmillon:0, dmillon:0 };
  let tempNum = num;
  const fullOrder: PlaceValueKey[] = ['umillon', 'cmillon', 'dmillon', 'cmil', 'dmil', 'umil', 'um', 'c', 'd', 'u'];


  for (const pv of fullOrder) {
      if (placeValuesToConsider.includes(pv)) {
        let divisor = 1;
        if (pv === 'umillon') divisor = 1000000;
        else if (pv === 'cmillon') divisor = 100000000;
        else if (pv === 'dmillon') divisor = 10000000;
        else if (pv === 'cmil') divisor = 100000;    // Centena de Millar
        else if (pv === 'dmil') divisor = 10000;     // Decena de Millar
        else if (pv === 'umil') divisor = 1000;      // Unidad de Mil
        else if (pv === 'um') divisor = 1000;        // Assuming 'um' from types.ts means Unidad de Millar
        else if (pv === 'c') divisor = 100;
        else if (pv === 'd') divisor = 10;
        else if (pv === 'u') divisor = 1;
        
        result[pv as keyof DecomposedNumber] = Math.floor(tempNum / divisor);
        tempNum %= divisor;
      }
  }
  return result as DecomposedNumber;
};

export const ComponerHasta10000TextoExercise: React.FC<ComponerHasta10000TextoExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
  gradeLevel, 
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [userInputs, setUserInputs] = useState<UserInputs>({});
  const [activeInput, setActiveInput] = useState<PlaceValueKey | null>(null); 
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minNumber = 1, maxNumber = 999999, placeValuesToAsk: dataPlaceValuesToAsk } = exercise.data || {};

  const determinedPlaceValues = useMemo<PlaceValueKey[]>(() => {
    let values: PlaceValueKey[];
    if (dataPlaceValuesToAsk && Array.isArray(dataPlaceValuesToAsk) && dataPlaceValuesToAsk.length > 0) {
        values = dataPlaceValuesToAsk as PlaceValueKey[];
    } else { 
        if (maxNumber >= 1000000) values = ['umillon', 'cmil', 'dmil', 'um', 'c', 'd', 'u'];
        else if (maxNumber >= 100000) values = ['cmil', 'dmil', 'um', 'c', 'd', 'u'];
        else if (maxNumber >= 10000) values = ['dmil', 'um', 'c', 'd', 'u'];
        else if (maxNumber >= 1000) values = ['um', 'c', 'd', 'u'];
        else if (maxNumber >= 100) values = ['c', 'd', 'u'];
        else if (maxNumber >= 10) values = ['d', 'u'];
        else values = ['u'];
    }
    // Ensure they are in the correct visual order (high to low) based on standard PV order
    return PLACE_VALUES_ORDER_FOR_DISPLAY.filter(pv => values.includes(pv));
  }, [maxNumber, dataPlaceValuesToAsk]);


  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    setCurrentChallenge({
      numberToDecompose: newNumber,
      correctDecomposition: decomposeNumberG4(newNumber, determinedPlaceValues),
    });
    
    const initialInputs: UserInputs = {};
    determinedPlaceValues.forEach(pv => initialInputs[pv] = '');
    setUserInputs(initialInputs);

    setActiveInput(determinedPlaceValues.length > 0 ? determinedPlaceValues[0] : null); 
    showFeedback(null);
    setIsAttemptPending(false);
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
  }, [minNumber, maxNumber, showFeedback, determinedPlaceValues]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) { // Added nullish coalescing for initial undefined state
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);


  const handleInputFocus = (placeValue: PlaceValueKey) => {
    if (determinedPlaceValues.includes(placeValue)) {
        setActiveInput(placeValue);
        showFeedback(null);
    }
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const correct = currentChallenge.correctDecomposition;
    const allCorrect = determinedPlaceValues.every(pvKey => {
        const userVal = parseInt(userInputs[pvKey], 10);
        const correctVal = correct[pvKey as keyof DecomposedNumber] || 0; 
        return (isNaN(userVal) ? 0 : userVal) === correctVal; 
    });

    onAttempt(allCorrect);
    if (allCorrect) {
      showFeedback({ type: 'correct', message: '¡Excelente descomposición!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Algunos valores no son correctos. ¡Revisa y vuelve a intentarlo!' });
      setIsAttemptPending(false); 
    }
  }, [currentChallenge, userInputs, showFeedback, onAttempt, isAttemptPending, determinedPlaceValues]);


  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') {
      verifyAnswer();
      return;
    }

    if (!activeInput || !determinedPlaceValues.includes(activeInput)) return; 

    if (key === 'backspace') {
      setUserInputs(prev => ({ ...prev, [activeInput]: '' }));
    } else if (/\d/.test(key)) { 
      setUserInputs(prev => ({ ...prev, [activeInput]: key })); 
      
      const currentIndex = determinedPlaceValues.indexOf(activeInput);
      if (currentIndex < determinedPlaceValues.length - 1) {
        setActiveInput(determinedPlaceValues[currentIndex + 1]);
      } 
    }
  }, [activeInput, verifyAnswer, showFeedback, isAttemptPending, determinedPlaceValues]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-24 h-24 flex items-center justify-center text-7xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-3 max-w-xs" direction="left">
            Descompón: <strong className="block text-3xl font-bold">{currentChallenge.numberToDecompose}</strong>
          </Icons.SpeechBubbleIcon>
        </div>

        <div className={`grid grid-cols-${Math.min(determinedPlaceValues.length, 4)} gap-2 sm:gap-3 w-full`}>
          {determinedPlaceValues.map((pvKey) => {
             const config = ROD_CONFIG[pvKey as keyof typeof ROD_CONFIG]; 
             if (!config) return null; 
             return (
                <div key={pvKey} className="flex flex-col items-center">
                <label htmlFor={`input-${pvKey}`} className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    {config.longLabel} ({config.label})
                </label>
                <button
                    id={`input-${pvKey}`}
                    onClick={() => handleInputFocus(pvKey)}
                    className={`w-full h-14 sm:h-20 bg-white border-2 rounded-lg text-2xl sm:text-4xl font-bold text-slate-700 flex items-center justify-center transition-all
                                ${config.color}
                                ${activeInput === pvKey ? 'ring-4 ring-offset-1 ' + config.color.replace('bg-','ring-').replace('-500', '-400').replace('-600', '-500') : 'hover:bg-slate-50'}`}
                    aria-label={`Valor para ${config.longLabel}. Ingresado: ${userInputs[pvKey] || 'vacío'}. Presione para activar.`}
                >
                    {userInputs[pvKey] || <span className="text-slate-300">_</span>}
                </button>
                </div>
            );
        })}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
