
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface DivisionSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentProblem {
  dividend: number;
  divisor: number;
  correctAnswerString: string; 
  numAnswerDigits: number;
  entryOrderIndices: number[];
}

function getVisualPlaceholderOrderForEntry(numDigits: number): number[] {
  // For simple division, users typically enter left-to-right for quotient
  const sequence = [];
  for (let i = 0; i < numDigits; i++) {
    sequence.push(i); 
  }
  return sequence;
}

export const DivisionSimpleExercise: React.FC<DivisionSimpleExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler, 
}) => {
  const [userInputValues, setUserInputValues] = useState<string[]>([]);
  const [currentEntryStep, setCurrentEntryStep] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    minDivisor = 2,
    maxDivisor = 9,
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewProblem = useCallback(() => {
    let dividend: number, divisor: number, quotient: number;
    const maxPossibleQuotient = Math.floor(99 / minDivisor); 

    do {
      divisor = Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;
      const maxQuotientForThisDivisor = Math.floor(99 / divisor);
      quotient = Math.floor(Math.random() * maxQuotientForThisDivisor) + 1; 
      dividend = quotient * divisor;
    } while (dividend > 99 || dividend === 0); 

    const correctAnswerString = quotient.toString();
    const numAnswerDigits = correctAnswerString.length;
    const entryOrderIndices = getVisualPlaceholderOrderForEntry(numAnswerDigits);

    setCurrentProblem({
      dividend,
      divisor,
      correctAnswerString,
      numAnswerDigits,
      entryOrderIndices,
    });

    setUserInputValues(Array(numAnswerDigits).fill(''));
    setCurrentEntryStep(0);
    showFeedback(null);
    setIsAttemptPending(false);
  }, [minDivisor, maxDivisor, showFeedback]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        generateNewProblem();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewProblem]);


  const verifyAnswer = useCallback(() => {
    if (!currentProblem || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswerString = userInputValues.join('');
    const isCorrect = userAnswerString === currentProblem.correctAnswerString;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡División correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. Revisa tu división.' });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentProblem, userInputValues, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (!currentProblem || isAttemptPending) return;
    showFeedback(null);

    const { numAnswerDigits, entryOrderIndices } = currentProblem;

    if (key === 'check') {
      verifyAnswer();
      return;
    }

    if (key === 'backspace') {
      const activeVisualIndex = entryOrderIndices[currentEntryStep];
      const newInputValues = [...userInputValues];

      if (activeVisualIndex < newInputValues.length && newInputValues[activeVisualIndex] !== '') {
        newInputValues[activeVisualIndex] = '';
        setUserInputValues(newInputValues);
      } else if (currentEntryStep > 0) {
        const prevEntryStep = currentEntryStep - 1;
        const prevVisualIndexToClear = entryOrderIndices[prevEntryStep];
        if (prevVisualIndexToClear < newInputValues.length) newInputValues[prevVisualIndexToClear] = '';
        setUserInputValues(newInputValues);
        setCurrentEntryStep(prevEntryStep);
      }
    } else if (/\d/.test(key) && currentEntryStep < numAnswerDigits) {
      const visualIndexToFill = entryOrderIndices[currentEntryStep];
      const newInputValues = [...userInputValues];
      if(visualIndexToFill < newInputValues.length) newInputValues[visualIndexToFill] = key;
      setUserInputValues(newInputValues);

      if (currentEntryStep < numAnswerDigits - 1) {
        setCurrentEntryStep(currentEntryStep + 1);
      }
    }
  }, [currentProblem, userInputValues, currentEntryStep, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }

    const { dividend, divisor, numAnswerDigits, entryOrderIndices } = currentProblem;
    const activeVisualInputIndex = currentEntryStep < entryOrderIndices.length ? entryOrderIndices[currentEntryStep] : -1;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-md p-3 space-y-4 mt-12">

        <div className="flex items-center justify-center font-mono text-5xl sm:text-6xl text-slate-700 space-x-3 mb-4">
          <span>{dividend}</span>
          <span>÷</span>
          <span>{divisor}</span>
          <span>=</span>
        </div>

        <div className="flex justify-center w-full mb-4">
          <div className="flex">
            {Array.from({ length: numAnswerDigits }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-16 sm:w-14 sm:h-20 border-2 rounded-md flex items-center justify-center text-3xl sm:text-4xl font-bold mx-1
                            ${activeVisualInputIndex === index ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white'}
                            ${userInputValues[index] ? 'text-slate-800' : 'text-slate-400'}`}
              >
                {userInputValues[index] || ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return <MainContent />;
};
