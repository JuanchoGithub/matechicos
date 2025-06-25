
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed, content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';
import { PlaceValue, PLACE_VALUES_ORDER, ROD_CONFIG } from '../components/abacusConstants'; 
import { StaticAbacusRod } from '../components/StaticAbacusRod'; 

type KeypadHandler = (key: string) => void;

interface ComponerHasta10000AbacoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface AbacusState {
  um: number;
  c: number;
  d: number;
  u: number;
}

type ExerciseMode = 'represent' | 'identify';

interface CurrentChallenge {
  mode: ExerciseMode;
  targetNumber?: number; 
  abacusDisplayForIdentification?: AbacusState; 
  correctNumberForIdentification?: number; 
}

const FACE_EMOJIS = ['🧮', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '✨', '🎈', '🎉', '🤩'];

const decomposeNumber = (num: number): AbacusState => {
  const um = Math.floor(num / 1000);
  const c = Math.floor((num % 1000) / 100);
  const d = Math.floor((num % 100) / 10);
  const u = num % 10;
  return { um, c, d, u };
};

const calculateAbacusValue = (state: AbacusState): number => {
  return state.um * 1000 + state.c * 100 + state.d * 10 + state.u;
};

// --- Sub-components for Interactive Abacus ---
interface AbacusRodProps {
  placeValue: PlaceValue;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const AbacusRod: React.FC<AbacusRodProps> = ({ placeValue, count, onIncrement, onDecrement }) => {
  const config = ROD_CONFIG[placeValue];
  const beads = Array.from({ length: count });

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2">
      <button 
        onClick={onIncrement} 
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${config.color} text-white text-2xl font-bold flex items-center justify-center shadow-md hover:opacity-80 transition-opacity mb-1 sm:mb-2`}
        aria-label={`Añadir ${config.label}`}
        disabled={count >= 9}
      >
        +
      </button>
      <div className={`w-8 sm:w-10 h-48 sm:h-64 ${config.color} bg-opacity-30 rounded-md flex flex-col-reverse justify-start p-1 items-center relative shadow-inner`}>
        {beads.map((_, i) => (
          <div key={`bead-${i}`} className={`w-6 h-4 sm:w-8 sm:h-5 rounded-full ${config.beadColor} my-0.5 shadow-sm`}></div>
        ))}
         <div className="absolute top-0 left-1/2 w-1 h-full bg-slate-500/50 transform -translate-x-1/2 -z-10 rounded-full"></div>
      </div>
       <span className="mt-1 sm:mt-2 text-sm sm:text-md font-semibold text-slate-600">{config.label} ({count})</span>
      <button 
        onClick={onDecrement} 
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${config.color} text-white text-2xl font-bold flex items-center justify-center shadow-md hover:opacity-80 transition-opacity mt-1 sm:mt-2`}
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
  onBeadChange: (placeValue: PlaceValue, operation: 'increment' | 'decrement') => void;
}

const InteractiveAbacus: React.FC<InteractiveAbacusProps> = ({ state, onBeadChange }) => {
  return (
    <div className="flex justify-center items-end p-2 sm:p-4 bg-slate-200 rounded-lg shadow-md">
      {PLACE_VALUES_ORDER.map(pv => (
        <AbacusRod
          key={pv}
          placeValue={pv}
          count={state[pv]}
          onIncrement={() => onBeadChange(pv, 'increment')}
          onDecrement={() => onBeadChange(pv, 'decrement')}
        />
      ))}
    </div>
  );
};

// Static Abacus Display for "Identify" mode
const StaticAbacusDisplay: React.FC<{ state: AbacusState }> = ({ state }) => {
    return (
      <div className="flex justify-center items-end p-2 sm:p-4 bg-slate-200 rounded-lg shadow-md">
        {PLACE_VALUES_ORDER.map(pv => (
          <StaticAbacusRod
            key={`static-${pv}`}
            placeValue={pv}
            count={state[pv]}
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
  
  const [interactiveAbacusState, setInteractiveAbacusState] = useState<AbacusState>({ um: 0, c: 0, d: 0, u: 0 });
  const [identifyInput, setIdentifyInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false); 

  const { minNumber = 1, maxNumber = 9999 } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const mode: ExerciseMode = Math.random() < 0.5 ? 'identify' : 'represent';
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    if (mode === 'identify') {
      const decomposition = decomposeNumber(randomNumber);
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
      setInteractiveAbacusState({ um: 0, c: 0, d: 0, u: 0 });
    }
    
    const randomEmoji = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
    showFeedback(null);
    setIsVerified(false);
  }, [minNumber, maxNumber, showFeedback]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const handleInteractiveBeadChange = (placeValue: PlaceValue, operation: 'increment' | 'decrement') => {
    if (isVerified && currentChallenge?.mode === 'represent') return; // No changes after correct verification
    setInteractiveAbacusState(prevState => {
      const currentValue = prevState[placeValue];
      let newValue = currentValue;
      if (operation === 'increment' && currentValue < 9) newValue = currentValue + 1;
      else if (operation === 'decrement' && currentValue > 0) newValue = currentValue - 1;
      return { ...prevState, [placeValue]: newValue };
    });
    showFeedback(null);
    if(isVerified) setIsVerified(false); // Allow re-verification if beads are changed after incorrect attempt
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || (isVerified && ( (currentChallenge.mode === 'represent' && calculateAbacusValue(interactiveAbacusState) === currentChallenge.targetNumber) || (currentChallenge.mode === 'identify' && identifyInput === currentChallenge.correctNumberForIdentification?.toString()) ))) return;
    
    setIsVerified(true);
    let isCorrect = false;
    let successMessage = "";
    let incorrectMessageBase = "";

    if (currentChallenge.mode === 'represent' && currentChallenge.targetNumber !== undefined) {
      const studentValue = calculateAbacusValue(interactiveAbacusState);
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
      setIsVerified(false); // Allow re-attempt
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
    } else if (identifyInput.length < 4 && /\d/.test(key)) { 
      setIdentifyInput(prev => prev + key);
    }
  }, [currentChallenge, identifyInput, isVerified, showFeedback, verifyAnswer]); 
  
  useEffect(() => {
      if (currentChallenge?.mode === 'identify') {
          registerKeypadHandler(handleNumericKeyPress);
      } else {
          registerKeypadHandler(null); 
      }
      return () => registerKeypadHandler(null);
  }, [currentChallenge, registerKeypadHandler, handleNumericKeyPress]);


  const currentInteractiveAbacusValue = calculateAbacusValue(interactiveAbacusState);

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
              <Icons.SpeechBubbleIcon className={`${ROD_CONFIG.um.color} text-white text-sm sm:text-md p-2 sm:p-3 max-w-[200px] sm:max-w-xs`} direction="left">
                  <span dangerouslySetInnerHTML={{ __html: questionText }} />
              </Icons.SpeechBubbleIcon>
          </div>

        {currentChallenge.mode === 'represent' && (
          <InteractiveAbacus state={interactiveAbacusState} onBeadChange={handleInteractiveBeadChange} />
        )}
        {currentChallenge.mode === 'identify' && currentChallenge.abacusDisplayForIdentification && (
          <>
            <StaticAbacusDisplay state={currentChallenge.abacusDisplayForIdentification} />
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
              disabled={isVerified && currentChallenge.targetNumber === calculateAbacusValue(interactiveAbacusState)}
              className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
                ${(isVerified && currentChallenge.targetNumber === calculateAbacusValue(interactiveAbacusState))
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
  
  return <MainContent />; // For 'identify' mode, keypad is handled by page
};
