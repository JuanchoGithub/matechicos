
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed, this component is content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

type KeypadHandler = (key: string) => void;

interface CalculaMentalmenteExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentProblem {
  problemString: string;
  correctAnswer: number;
  operand1?: number; 
  operand2?: number; 
  powerOfTen?: 10 | 100 | 1000;
  divisor?: 2 | 3 | 5 | 10;
}


export const CalculaMentalmenteExercise: React.FC<CalculaMentalmenteExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const {
    problemType = 'addition', 
    minOperand = 10, 
    maxOperand = 999, 
    minResultOperand = 1, 
    maxResultOperand = 50,
    tens, 
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewProblem = useCallback(() => {
    let num1: number, num2: number | undefined, answer: number, problemStr: string;
    let powerOfTenVal: 10 | 100 | 1000 | undefined;
    let divisorVal: 2 | 3 | 5 | 10 | undefined;
    let effectiveProblemType = problemType;

    if (problemType === 'mixed_addition_subtraction_3_digit') {
        effectiveProblemType = Math.random() < 0.5 ? 'addition' : 'subtraction_3_digit';
    }


    switch (effectiveProblemType) {
      case 'double':
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        answer = num1 * 2;
        problemStr = `El doble de ${num1} es...`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1 });
        break;
      case 'half':
        let potentialNum1Half;
        do {
            const halfCandidate = Math.floor(Math.random() * (Math.floor(maxOperand / 2) - Math.ceil(minOperand / 2) + 1)) + Math.ceil(minOperand / 2);
            potentialNum1Half = halfCandidate * 2;
        } while (potentialNum1Half < minOperand || potentialNum1Half > maxOperand || potentialNum1Half % 2 !== 0); 
        num1 = potentialNum1Half;
        answer = num1 / 2;
        problemStr = `La mitad de ${num1} es...`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1 });
        break;
      case 'triple':
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        answer = num1 * 3;
        problemStr = `El triple de ${num1} es...`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1 });
        break;
      case 'third':
        let k;
        let potentialNum1Third;
        do {
            k = Math.floor(Math.random() * (Math.floor(maxOperand / 3) - Math.ceil(minOperand / 3) + 1)) + Math.ceil(minOperand / 3);
            potentialNum1Third = k * 3;
        } while (potentialNum1Third < minOperand || potentialNum1Third > maxOperand || potentialNum1Third % 3 !== 0); 
        num1 = potentialNum1Third;
        answer = num1 / 3;
        problemStr = `El tercio de ${num1} es...`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1 });
        break;
      case 'multiplyByPowerOfTen':
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        const powers: (10 | 100 | 1000)[] = [10, 100, 1000];
        powerOfTenVal = powers[Math.floor(Math.random() * powers.length)];
        answer = num1 * powerOfTenVal;
        problemStr = `${num1} × ${powerOfTenVal}`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, powerOfTen: powerOfTenVal });
        break;
      case 'divideByBasicDivisor':
        const divisors: (2 | 3 | 5 | 10)[] = [2, 3, 5, 10];
        divisorVal = divisors[Math.floor(Math.random() * divisors.length)];
        const quotient = Math.floor(Math.random() * (maxResultOperand - minResultOperand + 1)) + minResultOperand;
        num1 = quotient * divisorVal; 
        answer = quotient; 
        problemStr = `${num1} ÷ ${divisorVal}`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, divisor: divisorVal });
        break;
      case 'subtraction_3_digit':
        do {
            num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand; 
            num2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand; 
        } while (num1 < num2); 
        answer = num1 - num2;
        problemStr = `${num1} - ${num2}`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, operand2: num2 });
        break;
      case 'add_subtract_tens':
        if (tens && tens.length >= 2) {
            const shuffledTens = [...tens].sort(() => 0.5 - Math.random());
            num1 = shuffledTens[0];
            num2 = shuffledTens[1];
            const operation = Math.random() < 0.5 ? 'addition' : 'subtraction';
            if (operation === 'addition') {
                answer = num1 + num2;
                problemStr = `${num1} + ${num2}`;
            } else {
                if (num1 < num2) [num1, num2] = [num2, num1]; 
                answer = num1 - num2;
                problemStr = `${num1} - ${num2}`;
            }
            setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, operand2: num2 });
        } else {
            num1 = (Math.floor(Math.random() * 9) + 1) * 10;
            num2 = (Math.floor(Math.random() * 9) + 1) * 10;
            answer = num1 + num2; 
            problemStr = `${num1} + ${num2}`;
            setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, operand2: num2 });
        }
        break;
      case 'addition': 
      default:
        num1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        num2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
        answer = num1 + num2;
        problemStr = `${num1} + ${num2}`;
        setCurrentProblem({ problemString: problemStr, correctAnswer: answer, operand1: num1, operand2: num2 });
        break;
    }

    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
  }, [minOperand, maxOperand, problemType, minResultOperand, maxResultOperand, tens, showFeedback]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem, exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) {
        generateNewProblem();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewProblem]);

  const checkAnswer = useCallback(() => {
    if (!currentProblem || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);

    if (isNaN(userAnswer)){
         showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
         onAttempt(false);
         setIsAttemptPending(false); // Allow retry
         return;
    }

    const isCorrect = userAnswer === currentProblem.correctAnswer;
    onAttempt(isCorrect);
    
    if(isCorrect) {
        showFeedback({ type: 'correct', message: '¡Muy bien!' });
    } else {
        showFeedback({ type: 'incorrect', message: '¡Ups! Esa no es la respuesta. Sigue intentando.' });
        setIsAttemptPending(false); // Allow retry
    }
  }, [userInput, currentProblem, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      checkAnswer();
    } else if (userInput.length < 7 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  }, [isAttemptPending, checkAnswer, userInput, showFeedback]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null); // Cleanup
  }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="text-xl text-slate-600">Cargando problema...</div>;
    }
    
    let currentSpeechBubbleIcon = <Icons.OperationsIcon className="w-8 h-8 inline-block" />;
    let speechBubbleColor = "bg-blue-400"; 

    if (currentProblem?.problemString?.includes('+')) {
        currentSpeechBubbleIcon = <Icons.OperationsIcon className="w-8 h-8 inline-block" />;
        speechBubbleColor = "bg-green-400";
    } else if (currentProblem?.problemString?.includes('-')) {
        currentSpeechBubbleIcon = <Icons.OperationsIcon className="w-8 h-8 inline-block" />;
        speechBubbleColor = "bg-red-400";
    } else if (problemType === 'double' || problemType === 'half' || problemType === 'triple' || problemType === 'third') {
        currentSpeechBubbleIcon = <Icons.ProblemsIcon className="w-8 h-8 inline-block" />;
        speechBubbleColor = "bg-purple-400";
    } else if (problemType === 'multiplyByPowerOfTen' || problemType === 'divideByBasicDivisor'){
        currentSpeechBubbleIcon = <Icons.OperationsIcon className="w-8 h-8 inline-block" />;
        speechBubbleColor = "bg-yellow-400";
    } else if (problemType.startsWith('mixed_')) {
        currentSpeechBubbleIcon = <Icons.ProblemsIcon className="w-8 h-8 inline-block" />;
        speechBubbleColor = "bg-indigo-400";
    }


    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-lg">
        <div className="relative mb-8 h-20"> 
            <div className="absolute top-0 right-0 transform translate-x-1/2 sm:translate-x-1/4">
                <Icons.SpeechBubbleIcon className={`${speechBubbleColor} text-white`} direction="left">
                    {currentSpeechBubbleIcon}
                </Icons.SpeechBubbleIcon>
            </div>
        </div>

        <p className="text-5xl md:text-6xl font-bold text-slate-800 mb-8 tracking-wider">
          {currentProblem.problemString}
        </p>

        <div
          className="w-full max-w-sm h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider mb-6 shadow-inner"
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
