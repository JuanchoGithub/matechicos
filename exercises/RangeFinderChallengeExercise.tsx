import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, RangeFinderChallenge, ExerciseScaffoldApi } from '../types';

interface RangeFinderChallengeExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

export const RangeFinderChallengeExercise: React.FC<RangeFinderChallengeExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<RangeFinderChallenge | null>(null);
  const [selectedMin, setSelectedMin] = useState<number | null>(null);
  const [selectedMax, setSelectedMax] = useState<number | null>(null);
  const [isCalculatingRange, setIsCalculatingRange] = useState(false);
  const [hasShownAnimation, setHasShownAnimation] = useState(false);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const challenges = exercise.data as RangeFinderChallenge[];

  // Destructure for stable reference
  const { showFeedback, advanceToNextChallengeSignal } = scaffoldApi;

  // Generate a new challenge
  const generateNewChallenge = useCallback(() => {
    const newChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(newChallenge);
    setUserInput('');
    setSelectedMin(null);
    setSelectedMax(null);
    setIsCalculatingRange(false);
    setHasShownAnimation(false);
    showFeedback(null);
    setIsAttemptPending(false);
  }, [challenges, showFeedback]);

  // Initialize on mount
  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);

  // Listen for signals to advance
  const previousAdvanceSignal = useRef(advanceToNextChallengeSignal);
  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignal.current) {
      generateNewChallenge();
      previousAdvanceSignal.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  // Handle user clicking on a value in the number line
  const handleValueSelect = useCallback((value: number) => {
    if (isAttemptPending) return;

    // Deselecting logic
    if (selectedMin === value) {
      setSelectedMin(null);
      showFeedback(null);
      return;
    }
    if (selectedMax === value) {
      setSelectedMax(null);
      setIsCalculatingRange(false);
      showFeedback(null);
      return;
    }

    if (selectedMin === null) {
      // First selection - set as minimum
      setSelectedMin(value);
      showFeedback({
        type: 'correct', // Using correct as a neutral feedback type
        message: `Has seleccionado ${value}${currentChallenge?.unit} como el valor mínimo. Ahora selecciona el máximo.`
      });
    } else if (selectedMax === null) {
      // Second selection - prevent selecting the same value
      if (value === selectedMin) {
        showFeedback({
          type: 'incorrect',
          message: 'El valor máximo no puede ser igual al mínimo. Elige un valor diferente.'
        });
        return;
      }
      // Set as maximum
      setSelectedMax(value);
      // Set calculating state to trigger animation
      setIsCalculatingRange(true);
    }
  }, [selectedMin, selectedMax, currentChallenge, isAttemptPending, showFeedback]);

  // Handle animation completion
  useEffect(() => {
    if (isCalculatingRange && !hasShownAnimation) {
      const timer = setTimeout(() => {
        setHasShownAnimation(true);
      }, 1500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isCalculatingRange, hasShownAnimation]);

  // Verify the user's answer
  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseFloat(userInput);
    if (isNaN(userAnswer)) {
      showFeedback({
        type: 'incorrect',
        message: 'Por favor, introduce un número válido.'
      });
      scaffoldApi.onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    // Check if min/max were selected correctly
    let isMinCorrect = selectedMin === currentChallenge.minValue;
    let isMaxCorrect = selectedMax === currentChallenge.maxValue;
    
    // Check if range calculation is correct
    let isRangeCorrect = userAnswer === currentChallenge.range;
    
    // Overall correctness
    let isCorrect = isMinCorrect && isMaxCorrect && isRangeCorrect;
    
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({
        type: 'correct',
        message: `¡Muy bien! Rango = ${currentChallenge.maxValue} - ${currentChallenge.minValue} = ${currentChallenge.range}${currentChallenge.unit}.`
      });
    } else {
      let errorMessage = '';
      
      if (!isMinCorrect) {
        errorMessage = `El valor mínimo es ${currentChallenge.minValue}${currentChallenge.unit}, no ${selectedMin}${currentChallenge.unit}.`;
      } else if (!isMaxCorrect) {
        errorMessage = `El valor máximo es ${currentChallenge.maxValue}${currentChallenge.unit}, no ${selectedMax}${currentChallenge.unit}.`;
      } else if (!isRangeCorrect) {
        errorMessage = `Revisa tu cálculo. Rango = Máximo - Mínimo = ${currentChallenge.maxValue} - ${currentChallenge.minValue} = ${currentChallenge.range}${currentChallenge.unit}.`;
      }
      
      showFeedback({
        type: 'incorrect',
        message: errorMessage
      });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, selectedMin, selectedMax, showFeedback, scaffoldApi, isAttemptPending]);

  // Handle keypad input
  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending || !hasShownAnimation) return;
    
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (key === '.') {
      // Allow only one decimal point
      if (!userInput.includes('.')) {
        setUserInput(prev => prev + key);
      }
    } else if (/\d/.test(key)) {
      // Max 5 digits for answer
      if (userInput.length < 5) {
        setUserInput(prev => prev + key);
      }
    }
  }, [userInput, verifyAnswer, isAttemptPending, hasShownAnimation]);

  // Register keypad handler
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  // Render number line with values
  const renderNumberLine = () => {
    if (!currentChallenge) return null;
    
    // Determine range for number line
    const values = currentChallenge.dataSet;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const buffer = (max - min) * 0.2; // Add 20% buffer on each side
    const displayMin = Math.floor((min - buffer) * 10) / 10;
    const displayMax = Math.ceil((max + buffer) * 10) / 10;
    
    // Generate ticks
    const ticks = [];
    const step = determineStepSize(displayMin, displayMax);
    
    for (let i = displayMin; i <= displayMax; i += step) {
      ticks.push(parseFloat(i.toFixed(1))); // Fix floating point precision issues
    }
    
    return (
      <div className="mt-4 mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className="text-sm font-semibold">Selecciona los valores mínimo y máximo en la línea numérica:</div>
        </div>
        <div className="relative h-16 w-full bg-white rounded-lg shadow-inner">
          <div className="relative h-full mx-5"> {/* Padded inner container for positioning */}
            {/* Number line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-400"></div>
            
            {/* Ticks and labels */}
            {ticks.map((tick, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${((tick - displayMin) / (displayMax - displayMin)) * 100}%`,
                  top: '28px',
                  transform: 'translate(-50%, 0)',
                }}
              >
                <div className="h-4 w-1 bg-gray-400"></div>
                <div className="text-xs mt-1">{tick}</div>
              </div>
            ))}
            
            {/* Data points */}
            {currentChallenge.dataSet.map((value, index) => (
              <button
                key={index}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                  ${selectedMin === value ? 'bg-blue-600 scale-110' : 
                    selectedMax === value ? 'bg-red-600 scale-110' : 'bg-purple-500 hover:scale-105'}
                  transition-all duration-300`}
                style={{
                  top: '2rem', // Corresponds to top-8, to align with the line
                  left: `${((value - displayMin) / (displayMax - displayMin)) * 100}%`,
                  transform: 'translate(-50%, -50%)', // Center the button on the point
                }}
                onClick={() => handleValueSelect(value)}
                disabled={isAttemptPending || (selectedMin !== null && selectedMax !== null && selectedMin !== value && selectedMax !== value)}
              >
                {value}
              </button>
            ))}
            
            {/* Range highlight */}
            {selectedMin !== null && selectedMax !== null && (
              <div 
                className="absolute h-3 bg-yellow-300 opacity-75"
                style={{
                  top: '1.75rem', // top-7, to be on top of the line
                  left: `${((Math.min(selectedMin, selectedMax) - displayMin) / (displayMax - displayMin)) * 100}%`,
                  width: `${(Math.abs(selectedMax - selectedMin) / (displayMax - displayMin)) * 100}%`,
                  animation: isCalculatingRange ? 'pulse 1.5s ease-in-out' : 'none',
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Utility function to determine appropriate step size for number line
  const determineStepSize = (min: number, max: number) => {
    const range = max - min;
    if (range <= 2) return 0.1; // Small range, use 0.1 steps
    if (range <= 5) return 0.5; // Medium range, use 0.5 steps
    if (range <= 10) return 1; // Larger range, use 1 steps
    if (range <= 50) return 5; // Even larger range, use 5 steps
    return 10; // Very large range, use 10 steps
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Reto Calculador de Rango</h2>
        {currentChallenge && (
          <p className="text-lg">
            Encuentra el rango de estos datos de {currentChallenge.context}: 
            {currentChallenge.dataSet.map((value, i) => (
              <span key={i}>{i > 0 ? ', ' : ' '}{value}{currentChallenge.unit}</span>
            ))}
          </p>
        )}
      </div>
      
      {/* Number line visualization */}
      {renderNumberLine()}
      
      {/* Range calculation UI */}
      {selectedMin !== null && selectedMax !== null && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-2 font-semibold">
            Calcula el rango restando el valor mínimo del valor máximo:
          </div>
          <div className="flex justify-center items-center space-x-3 text-xl">
            <div>Rango =</div>
            <div className="font-bold">{Math.max(selectedMin, selectedMax)}</div>
            <div>-</div>
            <div className="font-bold">{Math.min(selectedMin, selectedMax)}</div>
            <div>=</div>
            {hasShownAnimation ? (
              <div className="border-b-2 border-gray-500 min-w-[50px] text-center">
                <input
                  type="text"
                  className="w-full text-center bg-blue-50 focus:outline-none"
                  value={userInput}
                  readOnly
                  aria-label="Respuesta"
                />
              </div>
            ) : (
              <div className="w-12 h-6 bg-gray-200 animate-pulse rounded"></div>
            )}
            <div>{currentChallenge?.unit}</div>
          </div>
          
          {hasShownAnimation && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600 mb-2">
                Ingresa el valor del rango en el teclado numérico.
              </div>
              <div className="text-sm text-gray-500 italic">
                Pista: Resta el valor más pequeño del más grande.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weather Tracker theme decoration */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <span role="img" aria-label="weather" className="text-2xl">
          {currentChallenge?.context === 'temperaturas' ? '🌡️' : 
           currentChallenge?.context === 'alturas de plantas' ? '🌱' :
           currentChallenge?.context === 'puntajes de juego' ? '🎮' : '📊'}
        </span>
        <span className="font-semibold">Tracker de {currentChallenge?.context}</span>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
};
