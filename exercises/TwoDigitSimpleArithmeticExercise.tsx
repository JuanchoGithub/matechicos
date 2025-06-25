
import React, { useState, useEffect, useCallback } from 'react';
// import { ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types'; 
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface TwoDigitSimpleArithmeticExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentProblem {
  num1: number;
  num2: number;
  operationType: 'addition' | 'subtraction' | 'mixed';
  problemString: string;
  correctAnswer: number;
}

// Helper to generate numbers for "sin llevar" (no carry) addition
const generateNoCarryAdditionOperands = (maxOperand: number, numOperands: number): number[] => {
    let operands: number[];
    let sum: number;
    let unitsSum: number;
    let tensSum: number;

    if (numOperands === 2) {
        do {
            operands = [
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
            ];
            sum = operands[0] + operands[1];
            unitsSum = (operands[0] % 10) + (operands[1] % 10);
            tensSum = (Math.floor(operands[0] / 10)) + (Math.floor(operands[1] / 10));
        } while ( (maxOperand <= 9 && sum >= 10) || // Single digit, no carry
                  (maxOperand > 9 && (unitsSum >= 10 || tensSum >=10 || sum >=100) ) // Two digits, no carry in units or tens, sum < 100
                );
    } else { // numOperands === 3, assumed all single digit for 1st grade "sin llevar"
        do {
             operands = [
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
            ];
            sum = operands[0] + operands[1] + operands[2];
        } while (sum >= 10); // Ensure sum of 3 single digits is less than 10
    }
    return operands;
};

// Helper to generate numbers for "sin prestar" (no borrow) subtraction
const generateNoBorrowSubtractionOperands = (maxOperand: number): number[] => {
    let num1: number, num2: number;
     if (maxOperand <= 9) { // Single digit
        do {
            num1 = Math.floor(Math.random() * (maxOperand + 1));
            num2 = Math.floor(Math.random() * (num1 + 1)); // num2 <= num1
        } while (false); // No specific borrow condition for single digit beyond num1 >= num2
    } else { // Two digits
        do {
            num1 = Math.floor(Math.random() * (maxOperand - 10 + 1)) + 10; // Ensure num1 is at least 10 for 2-digit
            num2 = Math.floor(Math.random() * (maxOperand + 1));
            if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure num1 >= num2
        } while ( (num1 % 10) < (num2 % 10) || (Math.floor(num1 / 10) % 10) < (Math.floor(num2 / 10) % 10) );
    }
    return [num1, num2];
};

export const TwoDigitSimpleArithmeticExercise: React.FC<TwoDigitSimpleArithmeticExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    minOperand = 10,
    maxOperand = 99,
    operationType = 'mixed', 
    generateOperands 
  } = exercise.data || {};

  const generateNewProblem = useCallback(() => {
    let num1: number, num2: number;
    let actualOperationType = operationType;

    if (typeof generateOperands === 'function') {
        const operands = generateOperands(); 
        num1 = operands[0];
        num2 = operands[1];
    } else {
        if (actualOperationType === 'mixed') {
            actualOperationType = Math.random() < 0.5 ? 'addition' : 'subtraction';
        }
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        num2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
    }
    
    let answer: number;
    let problemString: string;

    if (actualOperationType === 'addition') {
      answer = num1 + num2;
      problemString = `${num1} + ${num2}`;
    } else { // Subtraction
      if (num1 < num2 && !generateOperands) { 
          [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
      problemString = `${num1} - ${num2}`;
    }

    setCurrentProblem({
      num1,
      num2,
      operationType: actualOperationType as 'addition' | 'subtraction' | 'mixed',
      problemString,
      correctAnswer: answer,
    });

    setUserInput('');
    scaffoldApi.showFeedback(null); 
    setIsAttemptPending(false);
  }, [minOperand, maxOperand, operationType, generateOperands, scaffoldApi]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem, exercise.id]);

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewProblem();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewProblem]);

  const verifyAnswer = useCallback(() => {
    if (!currentProblem || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      scaffoldApi.onAttempt(false);
      setIsAttemptPending(false); // Allow retry
      return;
    }
    
    const isCorrect = userAnswer === currentProblem.correctAnswer;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: `¡Muy bien! ${currentProblem.operationType === 'addition' ? 'Suma' : 'Resta'} correcta.` });
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. Revisa tu operación e inténtalo de nuevo.' });
      setIsAttemptPending(false); // Allow retry
    }
  }, [currentProblem, userInput, scaffoldApi, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    scaffoldApi.showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 3 && /\d/.test(key)) { // Max 3 digits for result (e.g. 99+99 = 198)
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, scaffoldApi, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-lg p-3 space-y-6 h-full">
        <p className="text-6xl sm:text-7xl font-bold text-slate-800 tracking-tight mb-6">
          {currentProblem.problemString}
        </p>

        <div
          className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };

  // Return only the main content, not wrapped in ExerciseScaffold
  return <MainContent />;
};
