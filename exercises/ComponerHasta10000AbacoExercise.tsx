
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi, PlaceValueKey } from '../types';
import { Icons } from '../components/icons';
import { ROD_CONFIG, PLACE_VALUES_ORDER_FOR_DISPLAY } from '../components/abacusConstants'; 
import { StaticAbacusRod } from '../components/StaticAbacusRod'; 

type KeypadHandler = (key: string) => void;

// Updated AbacusState to use keys from types.ts, especially cmil and dmil
interface AbacusState {
  umillon?: number;
  cmillon?: number; // Added for completeness, though not primary focus of G3/G4
  dmillon?: number; // Added for completeness
  umil?: number;    // U. de Mil
  cmil?: number;    // C. de Millar (was cm)
  dmil?: number;    // D. de Millar (was dm)
  um?: number;      // U. de Millar (if this is what 'um' means in types.ts for this context)
  c?: number;
  d?: number;
  u?: number;
}

type ExerciseMode = 'represent' | 'identify';

interface CurrentChallenge {
  mode: ExerciseMode;
  targetNumber?: number; 
  abacusDisplayForIdentification?: AbacusState; 
  correctNumberForIdentification?: number; 
}

const FACE_EMOJIS = ['🧮', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '✨', '🎈', '🎉', '🤩'];

// Updated to use cmil, dmil, umil based on types.ts conventions
const decomposeNumberDynamic = (num: number, placeValuesToUse: PlaceValueKey[]): AbacusState => {
  const result: AbacusState = {};
  let tempNum = num;

  // Iterate based on a defined order relevant for decomposition, e.g., from types.ts or a display order
  const decompositionOrder: PlaceValueKey[] = ['umillon', 'cmillon', 'dmillon', 'cmil', 'dmil', 'umil', 'um', 'c', 'd', 'u'];

  for (const pv of decompositionOrder) {
    if (placeValuesToUse.includes(pv)) {
      let divisor = 1;
      if (pv === 'umillon') divisor = 1000000;
      else if (pv === 'cmillon') divisor = 100000000; // Example value
      else if (pv === 'dmillon') divisor = 10000000;  // Example value
      else if (pv === 'cmil') divisor = 100000;    // Corrected: Centena de Millar
      else if (pv === 'dmil') divisor = 10000;     // Corrected: Decena de Millar
      else if (pv === 'umil') divisor = 1000;      // U. de Mil
      else if (pv === 'um') divisor = 1000;        // Assuming 'um' is also U. de Millar if used this way
      else if (pv === 'c') divisor = 100;
      else if (pv === 'd') divisor = 10;
      else if (pv === 'u') divisor = 1;
      
      result[pv as keyof AbacusState] = Math.floor(tempNum / divisor);
      tempNum %= divisor;
    } else {
      result[pv as keyof AbacusState] = 0; 
    }
  }
  return result;
};

// Updated to use cmil, dmil, umil
const calculateAbacusValueDynamic = (state: AbacusState): number => {
  let total = 0;
  if (state.umillon) total += state.umillon * 1000000;
  if (state.cmillon) total += state.cmillon * 100000000; // Example
  if (state.dmillon) total += state.dmillon * 10000000;  // Example
  if (state.cmil) total += state.cmil * 100000;    // Corrected
  if (state.dmil) total += state.dmil * 10000;     // Corrected
  if (state.umil) total += state.umil * 1000;      // U. de Mil
  if (state.um) total += state.um * 1000;        // U. de Millar (if 'um' is used this way)
  if (state.c) total += state.c * 100;
  if (state.d) total += state.d * 10;
  if (state.u) total += state.u * 1;
  return total;
};

interface ComponerHasta10000AbacoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}


interface AbacusRodProps {
  placeValue: PlaceValueKey;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const AbacusRod: React.FC<AbacusRodProps> = ({ placeValue, count, onIncrement, onDecrement }) => {
  const config = ROD_CONFIG[placeValue];
  if(!config) return null; 
  const beads = Array.from({ length: count });

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-1.5"> 
      <button 
        onClick={onIncrement} 
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${config.color} text-white text-xl sm:text-2xl font-bold flex items-center justify-center shadow-md hover:opacity-80 transition-opacity mb-1`}
        aria-label={`Añadir ${config.label}`}
        disabled={count >= 9}
      >
        +
      </button>
      <div className={`w-6 sm:w-8 h-40 sm:h-56 ${config.color} bg-opacity-30 rounded-md flex flex-col-reverse justify-start p-0.5 items-center relative shadow-inner`}>
        {beads.map((_, i) => (
          <div key={`bead-${i}`} className={`w-4 h-3 sm:w-6 sm:h-4 rounded-full ${config.beadColor} my-0.5 shadow-sm`}></div>
        ))}
         <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-500/50 transform -translate-x-1/2 -z-10 rounded-full"></div>
      </div>
       <span className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">{config.label} ({count})</span>
      <button 
        onClick={onDecrement} 
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${config.color} text-white text-xl sm:text-2xl font-bold flex items-center justify-center shadow-md hover:opacity-80 transition-opacity mt-1`}
        aria-label={`Quitar ${config.label}`}
        disabled={count <= 0}
      >
        -
      </button>
    </div>
  );
};

interface InteractiveAbacusProps {
  state: AbacusState;
  onBeadChange: (placeValue: PlaceValueKey, operation: 'increment' | 'decrement') => void;
  placeValuesToShow: PlaceValueKey[];
}

const InteractiveAbacus: React.FC<InteractiveAbacusProps> = ({ state, onBeadChange, placeValuesToShow }) => {
  return (
    <div className="flex justify-center items-end p-1 sm:p-2 bg-slate-200 rounded-lg shadow-md">
      {PLACE_VALUES_ORDER_FOR_DISPLAY.filter(pv => placeValuesToShow.includes(pv)).map(pv => (
        <AbacusRod
          key={pv}
          placeValue={pv}
          count={state[pv as keyof AbacusState] || 0}
          onIncrement={() => onBeadChange(pv, 'increment')}
          onDecrement={() => onBeadChange(pv, 'decrement')}
        />
      ))}
    </div>
  );
};

const StaticAbacusDisplay: React.FC<{ state: AbacusState, placeValuesToShow: PlaceValueKey[] }> = ({ state, placeValuesToShow }) => {
    return (
      <div className="flex justify-center items-end p-1 sm:p-2 bg-slate-200 rounded-lg shadow-md">
        {PLACE_VALUES_ORDER_FOR_DISPLAY.filter(pv => placeValuesToShow.includes(pv)).map(pv => (
          <StaticAbacusRod
            key={`static-${pv}`}
            placeValue={pv}
            count={state[pv as keyof AbacusState] || 0}
          />
        ))}
      </div>
    );
};


export const ComponerHasta10000AbacoExercise: React.FC<ComponerHasta10000AbacoExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS[0]);
  
  const [interactiveAbacusState, setInteractiveAbacusState] = useState<AbacusState>({});
  const [identifyInput, setIdentifyInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false); 

  const { 
    minNumber = 1, 
    maxNumber = 9999, 
    placeValuesToShow: dataPlaceValuesToShow = ['um', 'c', 'd', 'u'] as PlaceValueKey[] 
  } = exercise.data || {};

  // Determine which place values to actually use based on maxNumber and exercise data
  const placeValuesToUse = useMemo<PlaceValueKey[]>(() => {
    let relevantPVs: PlaceValueKey[] = PLACE_VALUES_ORDER_FOR_DISPLAY.filter(pvKey => {
        const config = ROD_CONFIG[pvKey];
        if (!config) return false; // Should not happen with correct setup
        if (pvKey === 'umillon' && maxNumber < 1000000) return false;
        if (pvKey === 'cmillon' && maxNumber < 10000000) return false; 
        if (pvKey === 'dmillon' && maxNumber < 100000000) return false;
        if (pvKey === 'cmil' && maxNumber < 100000) return false;
        if (pvKey === 'dmil' && maxNumber < 10000) return false;
        if (pvKey === 'umil' && maxNumber < 1000) return false; 
        if (pvKey === 'um' && maxNumber < 1000) return false; // Assuming 'um' is U.de Millar
        if (pvKey === 'c' && maxNumber < 100) return false;
        if (pvKey === 'd' && maxNumber < 10) return false;
        return true;
    }) as PlaceValueKey[];
    
    // If specific placeValues are provided in exercise data, filter by them
    if (Array.isArray(dataPlaceValuesToShow) && dataPlaceValuesToShow.length > 0) {
        relevantPVs = relevantPVs.filter(pv => (dataPlaceValuesToShow as PlaceValueKey[]).includes(pv));
    }
    // Ensure at least 'u' is shown if nothing else qualifies
    return relevantPVs.length > 0 ? relevantPVs : ['u'] as PlaceValueKey[];
  }, [maxNumber, dataPlaceValuesToShow]);

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const mode: ExerciseMode = Math.random() < 0.5 ? 'identify' : 'represent';
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    const initialAbacusState: AbacusState = {};
    placeValuesToUse.forEach(pv => initialAbacusState[pv as keyof AbacusState] = 0);


    if (mode === 'identify') {
      const decomposition = decomposeNumberDynamic(randomNumber, placeValuesToUse);
      setCurrentChallenge({
        mode: 'identify',
        abacusDisplayForIdentification: decomposition,
        correctNumberForIdentification: randomNumber,
      });
      setIdentifyInput('');
    } else { 
      setCurrentChallenge({
        mode: 'represent',
        targetNumber: randomNumber,
      });
      setInteractiveAbacusState(initialAbacusState);
    }
    
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
    showFeedback(null);
    setIsVerified(false);
  }, [minNumber, maxNumber, showFeedback, placeValuesToUse]); // Added placeValuesToUse

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const handleInteractiveBeadChange = (placeValue: PlaceValueKey, operation: 'increment' | 'decrement') => {
    if (isVerified && currentChallenge?.mode === 'represent') return; 
    setInteractiveAbacusState(prevState => {
      const pvKey = placeValue as keyof AbacusState;
      const currentValue = prevState[pvKey] || 0;
      let newValue = currentValue;
      if (operation === 'increment' && currentValue < 9) newValue = currentValue + 1;
      else if (operation === 'decrement' && currentValue > 0) newValue = currentValue - 1;
      return { ...prevState, [pvKey]: newValue };
    });
    showFeedback(null);
    if(isVerified) setIsVerified(false);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || (isVerified && ( (currentChallenge.mode === 'represent' && calculateAbacusValueDynamic(interactiveAbacusState) === currentChallenge.targetNumber) || (currentChallenge.mode === 'identify' && identifyInput === currentChallenge.correctNumberForIdentification?.toString()) ))) return;
    
    setIsVerified(true);
    let isCorrect = false;
    let successMessage = "";
    let incorrectMessageBase = "";

    if (currentChallenge.mode === 'represent' && currentChallenge.targetNumber !== undefined) {
      const studentValue = calculateAbacusValueDynamic(interactiveAbacusState);
      isCorrect = studentValue === currentChallenge.targetNumber;
      successMessage = `¡Correcto! ${currentChallenge.targetNumber} está bien representado.`;
      incorrectMessageBase = `Aún no es correcto. El número a representar es ${currentChallenge.targetNumber}. Tu ábaco muestra ${studentValue}.`;
    } else if (currentChallenge.mode === 'identify' && currentChallenge.correctNumberForIdentification !== undefined) {
      const userAnswer = parseInt(identifyInput, 10);
      isCorrect = userAnswer === currentChallenge.correctNumberForIdentification;
      successMessage = `¡Correcto! El ábaco representa el número ${currentChallenge.correctNumberForIdentification}.`;
      incorrectMessageBase = `No es el número correcto. El ábaco representa ${currentChallenge.correctNumberForIdentification}. Tú ingresaste ${identifyInput || 'nada'}.`;
    }

    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({type: 'correct', message: successMessage});
    } else {
      showFeedback({type: 'incorrect', message: `${incorrectMessageBase} Revisa y vuelve a intentarlo.`});
      setIsVerified(false); 
    }
  }, [currentChallenge, interactiveAbacusState, identifyInput, isVerified, showFeedback, onAttempt]);

  const handleNumericKeyPress = useCallback((key: string) => {
    if (currentChallenge?.mode !== 'identify' || (isVerified && currentChallenge.correctNumberForIdentification?.toString() === identifyInput)) return;
    showFeedback(null);
    if (isVerified) setIsVerified(false);

    if (key === 'backspace') {
      setIdentifyInput(''); 
    } else if (key === 'check') {
      verifyAnswer(); 
    } else if (identifyInput.length < maxNumber.toString().length && /\d/.test(key)) { 
      setIdentifyInput(prev => prev + key);
    }
  }, [currentChallenge, identifyInput, isVerified, showFeedback, verifyAnswer, maxNumber]); 
  
  useEffect(() => {
      if (currentChallenge?.mode === 'identify') {
          registerKeypadHandler(handleNumericKeyPress);
      } else {
          registerKeypadHandler(null); 
      }
      return () => registerKeypadHandler(null);
  }, [currentChallenge, registerKeypadHandler, handleNumericKeyPress]);


  const currentInteractiveAbacusValue = calculateAbacusValueDynamic(interactiveAbacusState);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="text-xl text-slate-600 p-4">Cargando desafío...</div>;
    }
    
    let questionText = "";
    if (currentChallenge.mode === 'represent' && currentChallenge.targetNumber !== undefined) {
        questionText = `Representa: <strong class="block text-xl sm:text-2xl">${currentChallenge.targetNumber}</strong>`;
    } else if (currentChallenge.mode === 'identify') {
        questionText = "¿Qué número muestra el ábaco?";
    }

    return (
      <div className="flex flex-col items-center justify-start text-center w-full p-2 space-y-3 sm:space-y-4">
          <div className="relative flex items-center justify-center mb-2 sm:mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
                {currentEmoji}
              </div>
              <Icons.SpeechBubbleIcon className={`${ROD_CONFIG[placeValuesToUse[0] as keyof typeof ROD_CONFIG]?.color || 'bg-gray-500'} text-white text-sm sm:text-md p-2 sm:p-3 max-w-[200px] sm:max-w-xs`} direction="left">
                  <span dangerouslySetInnerHTML={{ __html: questionText }} />
              </Icons.SpeechBubbleIcon>
          </div>

        {currentChallenge.mode === 'represent' && (
          <InteractiveAbacus state={interactiveAbacusState} onBeadChange={handleInteractiveBeadChange} placeValuesToShow={placeValuesToUse} />
        )}
        {currentChallenge.mode === 'identify' && currentChallenge.abacusDisplayForIdentification && (
          <>
            <StaticAbacusDisplay state={currentChallenge.abacusDisplayForIdentification} placeValuesToShow={placeValuesToUse} />
            <div className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner mt-2"
                 aria-live="polite" aria-label={`Número ingresado: ${identifyInput || 'Vacío'}`}>
              {identifyInput || <span className="text-slate-400">_</span>}
            </div>
          </>
        )}
      </div>
    );
  };

  if (currentChallenge?.mode === 'represent') {
    return (
      <>
        <MainContent />
        <div className="w-full flex flex-col items-center space-y-3 p-2 mt-4 max-w-xs mx-auto">
            <div className="text-center text-slate-700 p-2 bg-slate-100 rounded-lg w-full shadow">
                <p className="text-xs sm:text-sm opacity-90">Tu ábaco muestra:</p>
                <p className="text-2xl sm:text-3xl font-bold tracking-wider">{currentInteractiveAbacusValue}</p>
            </div>
            <button
              onClick={verifyAnswer}
              disabled={isVerified && currentChallenge.targetNumber === calculateAbacusValueDynamic(interactiveAbacusState)}
              className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${(isVerified && currentChallenge.targetNumber === calculateAbacusValueDynamic(interactiveAbacusState))
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
                }`}
            >
              <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Verificar
            </button>
        </div>
      </>
    );
  }
  
  return <MainContent />; 
};