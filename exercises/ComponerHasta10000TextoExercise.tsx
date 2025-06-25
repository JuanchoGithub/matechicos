
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi, GradeLevel } from '../types'; // Added GradeLevel
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

type PlaceValueKey = 'um' | 'c' | 'd' | 'u';

const ORDERED_PLACE_VALUES_ALL: PlaceValueKey[] = ['um', 'c', 'd', 'u'];

interface DecomposedNumber { // Assuming this is defined or should be. Based on usage.
  um: number;
  c: number;
  d: number;
  u: number;
}

// Define CurrentChallenge interface
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
  um: string;
  c: string;
  d: string;
  u: string;
}

const PLACE_VALUE_CONFIG: Record<PlaceValueKey, { label: string; longLabel: string, color: string }> = {
  um: { label: 'UM', longLabel: 'Unidades de Millar', color: 'border-red-500 focus:ring-red-500' },
  c: { label: 'C', longLabel: 'Centenas', color: 'border-blue-500 focus:ring-blue-500' },
  d: { label: 'D', longLabel: 'Decenas', color: 'border-green-500 focus:ring-green-500' },
  u: { label: 'U', longLabel: 'Unidades', color: 'border-yellow-500 focus:ring-yellow-500' },
};

const FACE_EMOJIS = ['🔢', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '✨', '🧩'];

const decomposeNumber = (num: number): DecomposedNumber => {
  return {
    um: Math.floor(num / 1000),
    c: Math.floor((num % 1000) / 100),
    d: Math.floor((num % 100) / 10),
    u: num % 10,
  };
};

export const ComponerHasta10000TextoExercise: React.FC<ComponerHasta10000TextoExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
  gradeLevel, 
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [userInputs, setUserInputs] = useState<UserInputs>({ um: '', c: '', d: '', u: '' });
  const [activeInput, setActiveInput] = useState<PlaceValueKey | null>(null); 
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minNumber = 1, maxNumber = 9999, placeValuesToAsk: dataPlaceValuesToAsk } = exercise.data || {};

  const determinedPlaceValues = useMemo<PlaceValueKey[]>(() => { // Explicitly type return of useMemo
    let values: PlaceValueKey[] = [...ORDERED_PLACE_VALUES_ALL]; 

    if (dataPlaceValuesToAsk && Array.isArray(dataPlaceValuesToAsk) && dataPlaceValuesToAsk.length > 0) {
        const safeDataPlaceValuesToAsk = dataPlaceValuesToAsk as PlaceValueKey[];
        values = ORDERED_PLACE_VALUES_ALL.filter(pv => safeDataPlaceValuesToAsk.includes(pv));
    }
    
    if (gradeLevel === 2) {
        values = values.filter(pv => pv !== 'um');
    }
    return values.length > 0 ? values : ['u']; 
  }, [gradeLevel, dataPlaceValuesToAsk]);


  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    setCurrentChallenge({
      numberToDecompose: newNumber,
      correctDecomposition: decomposeNumber(newNumber),
    });
    setUserInputs({ um: '', c: '', d: '', u: '' });
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
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
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
        const correctVal = correct[pvKey];
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
          {determinedPlaceValues.map((pvKey) => (
            <div key={pvKey} className="flex flex-col items-center">
              <label htmlFor={`input-${pvKey}`} className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                {PLACE_VALUE_CONFIG[pvKey].longLabel} ({PLACE_VALUE_CONFIG[pvKey].label})
              </label>
              <button
                id={`input-${pvKey}`}
                onClick={() => handleInputFocus(pvKey)} // pvKey is PlaceValueKey here
                className={`w-full h-14 sm:h-20 bg-white border-2 rounded-lg text-2xl sm:text-4xl font-bold text-slate-700 flex items-center justify-center transition-all
                            ${PLACE_VALUE_CONFIG[pvKey].color}
                            ${activeInput === pvKey ? 'ring-4 ring-offset-1 ' + PLACE_VALUE_CONFIG[pvKey].color.replace('border-','ring-') : 'hover:bg-slate-50'}`}
                aria-label={`Valor para ${PLACE_VALUE_CONFIG[pvKey].longLabel}. Ingresado: ${userInputs[pvKey] || 'vacío'}. Presione para activar.`}
              >
                {userInputs[pvKey] || <span className="text-slate-300">_</span>}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return <MainContent />;
};
