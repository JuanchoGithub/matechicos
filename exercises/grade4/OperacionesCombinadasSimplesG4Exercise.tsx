
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface OperacionesCombinadasSimplesG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface ChallengeG4 {
  expression: string;
  correctAnswer: number;
}

const FACE_EMOJIS_COMBINADAS = ['🧠', '🤔', '🧐', '💡', '➕➖✖️', '🧮'];

const generateSimpleCombinedExpression = (maxOperands: number, maxOperandValue: number, operations: string[]): ChallengeG4 => {
  let expression = "";
  let result = 0;
  const numOps = Math.floor(Math.random() * (maxOperands - 1)) + 1; // 1 to (maxOperands - 1) operations -> 2 to maxOperands numbers

  let currentOperand = Math.floor(Math.random() * maxOperandValue) + 1;
  expression += currentOperand;
  result = currentOperand;

  for (let i = 0; i < numOps; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];
    let nextOperand = Math.floor(Math.random() * maxOperandValue) + 1;

    // Prioritize multiplication
    if (op === '*' && i > 0 && (expression.endsWith('+') || expression.endsWith('-'))) {
      // If previous op was + or -, evaluate that part first
      // This simple generator doesn't handle complex precedence, it's sequential for now
      // For true precedence, we'd need a more complex parser or specific structures.
      // For G4 "simple" without parentheses, usually it's sequential or very basic precedence
    }

    expression += ` ${op} ${nextOperand}`;
    
    // Simple sequential evaluation for this generator
    if (op === '+') result += nextOperand;
    else if (op === '-') result -= nextOperand;
    else if (op === '*') result *= nextOperand; 
    // Division might be added later if needed, ensure no division by zero or non-integer results for G4 simple.
  }
  
  // A more robust way to evaluate expression with correct precedence (but still without parentheses here)
  try {
    // Create a function to evaluate simple expressions: multiply first, then add/subtract
    const evalSimpleExpr = (expr: string): number => {
      // Phase 1: Multiplication
      const multParts = expr.split(/([+\-])/); // Split by + or -
      const evaluatedMultParts: (number | string)[] = [];
      
      for (let part of multParts) {
        if (part.includes('*')) {
          const factors = part.split('*').map(s => parseInt(s.trim(), 10));
          evaluatedMultParts.push(factors.reduce((acc, val) => acc * val, 1));
        } else {
          evaluatedMultParts.push(part);
        }
      }
      
      // Phase 2: Addition/Subtraction
      let finalResult = 0;
      let currentOperation = '+';
      for (let part of evaluatedMultParts) {
        if (part === '+' || part === '-') {
          currentOperation = part as string;
        } else {
          const num = typeof part === 'number' ? part : parseInt(part.trim(), 10);
          if (currentOperation === '+') finalResult += num;
          else if (currentOperation === '-') finalResult -= num;
        }
      }
      return finalResult;
    };
    
    result = evalSimpleExpr(expression);

  } catch (e) {
    console.error("Error evaluating expression:", expression, e);
    // Fallback to a very simple problem if evaluation fails
    expression = "5 + 3";
    result = 8;
  }

  return { expression, correctAnswer: result };
};

export const OperacionesCombinadasSimplesG4Exercise: React.FC<OperacionesCombinadasSimplesG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeG4 | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_COMBINADAS[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { maxOperands = 3, maxOperandValue = 20, operations = ['+', '-', '*'] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    setCurrentChallenge(generateSimpleCombinedExpression(maxOperands, maxOperandValue, operations));
    setUserInput(''); showFeedback(null); setIsAttemptPending(false);
    setCharacterEmoji(FACE_EMOJIS_COMBINADAS[Math.floor(Math.random() * FACE_EMOJIS_COMBINADAS.length)]);
  }, [maxOperands, maxOperandValue, operations, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) generateNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = userAnswerNum === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. El resultado era ${currentChallenge.correctAnswer}.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 4 && (/\d/.test(key) || (key === '-' && userInput === ''))) setUserInput(prev => prev + key); // Allow negative sign at start
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "Calcula:"}
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-4xl sm:text-5xl font-bold text-slate-700 my-4 p-2 bg-slate-100 rounded-md shadow">
          {currentChallenge.expression} = ?
        </p>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
