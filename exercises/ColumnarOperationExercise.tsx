import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons, PencilIcon, EraserIcon, ClearIcon } from '../components/icons';
import { DrawingCanvas, DrawingCanvasRef, CanvasTool } from '../components/DrawingCanvas';

type KeypadHandler = (key: string) => void;

interface ColumnarOperationExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentProblem {
  operands: number[];
  operationType: 'addition' | 'subtraction';
  correctAnswerString: string;
  numAnswerDigits: number;
  entryOrderIndices: number[]; 
  maxLength: number; 
}

function getVisualPlaceholderOrderForEntry(numDigits: number): number[] {
  if (numDigits <= 0) return [];
  const sequence = [];
  for (let i = 0; i < numDigits; i++) { 
    sequence.push(numDigits - 1 - i); 
  }
  return sequence; 
}

const OperandDigitBox: React.FC<{ digitChar: string; className?: string }> = ({ digitChar, className = "" }) => (
    <div
      className={`w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl font-bold mx-0.5 tabular-nums bg-transparent text-slate-800 ${className}`}
    >
      {digitChar === ' ' ? '\u00A0' : digitChar}
    </div>
  );

const ResultDigitBox: React.FC<{ 
    value: string; 
    isActive?: boolean; 
    isError?: boolean; 
    onClick?: () => void; 
    className?: string 
}> = ({ value, isActive, isError, onClick, className = "" }) => {
  let boxSpecificClass = 'border-slate-300 bg-white';
  if (isActive) boxSpecificClass = 'border-sky-500 ring-2 ring-sky-300 bg-sky-50';
  else if (isError) boxSpecificClass = 'bg-red-100 border-red-500 text-red-700';

  const valueClasses = value ? (isError && !isActive ? 'text-red-700' : 'text-slate-800') : 'text-slate-400';
  
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-10 h-14 sm:w-12 sm:h-16 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5 tabular-nums ${boxSpecificClass} ${valueClasses} ${className} pointer-events-auto`}
      aria-label={onClick ? `Input for digit, current value: ${value || 'empty'}` : `Displayed digit: ${value}`}
    >
      {value || ''}
    </button>
  );
};


export const ColumnarOperationExercise: React.FC<ColumnarOperationExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInputValues, setUserInputValues] = useState<string[]>([]); 
  const [currentEntryStep, setCurrentEntryStep] = useState<number>(0); 
  const [digitErrorFlags, setDigitErrorFlags] = useState<boolean[]>([]);
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const drawingCanvasRef = useRef<DrawingCanvasRef>(null);
  const [activeCanvasTool, setActiveCanvasTool] = useState<CanvasTool>('pen');

  const {
    operationType = 'addition', 
    minOperandValue = 1,
    maxOperandValue = 999,
    numOperands = 2, 
    ensureNoCarry = false, 
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewProblem = useCallback(() => {
    const operands: number[] = [];
    let actualNumOperands = operationType === 'subtraction' ? 2 : numOperands;

    for (let i = 0; i < actualNumOperands; i++) {
        let operand;
        if (ensureNoCarry && operationType === 'addition' && actualNumOperands === 3 && maxOperandValue <=9) { 
            operand = Math.floor(Math.random() * 3) +1; 
        } else {
            operand = Math.floor(Math.random() * (maxOperandValue - minOperandValue + 1)) + minOperandValue;
        }
        operands.push(operand);
    }

    if (operationType === 'subtraction' && operands[0] < operands[1]) {
      [operands[0], operands[1]] = [operands[1], operands[0]];
    }
    if (ensureNoCarry && operationType === 'subtraction') {
        let tempOp1 = operands[0];
        let tempOp2 = operands[1];
        const op1Str = tempOp1.toString();
        const op2Str = tempOp2.toString().padStart(op1Str.length, '0'); 
        let needsBorrow = false;
        for(let i = 0; i < op1Str.length; i++) {
          const digit1 = parseInt(op1Str[op1Str.length - 1 - i], 10);
          const digit2 = parseInt(op2Str[op2Str.length - 1 - i], 10);
          if (digit1 < digit2) {
            needsBorrow = true;
            break;
          }
        }
        if (needsBorrow) {
          // For strict no-borrow, might need to regenerate or adjust operands.
        }
    }

    let result: number;
    if (operationType === 'addition') {
      result = operands.reduce((acc, val) => acc + val, 0);
    } else { 
      result = operands[0] - operands[1];
    }

    const correctAnswerString = result.toString();
    const numAnswerDigits = correctAnswerString.length || 1; 
    const entryOrderIndices = getVisualPlaceholderOrderForEntry(numAnswerDigits);
    const maxLength = Math.max(...operands.map(op => op.toString().length), numAnswerDigits);

    setCurrentProblem({
      operands,
      operationType: operationType as 'addition' | 'subtraction',
      correctAnswerString,
      numAnswerDigits,
      entryOrderIndices,
      maxLength,
    });

    setUserInputValues(Array(numAnswerDigits).fill(''));
    setDigitErrorFlags(Array(numAnswerDigits).fill(false));
    setCurrentEntryStep(0);
    showFeedback(null);
    setIsAttemptPending(false);
    drawingCanvasRef.current?.clearCanvas(); 
  }, [minOperandValue, maxOperandValue, numOperands, operationType, ensureNoCarry, showFeedback]);

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

    let userAnswerString = "";
    for (let i = 0; i < currentProblem.numAnswerDigits; i++) {
        const visualBoxIndex = currentProblem.numAnswerDigits - 1 - i; 
        userAnswerString = (userInputValues[visualBoxIndex] || '') + userAnswerString;
    }
    userAnswerString = userAnswerString || "0";

    const newDigitErrors = Array(currentProblem.numAnswerDigits).fill(false);
    const paddedCorrectAnswer = currentProblem.correctAnswerString.padStart(currentProblem.numAnswerDigits, '0');
    
    const isOverallCorrect = userAnswerString === currentProblem.correctAnswerString;
    
    if (!isOverallCorrect) {
        for (let i = 0; i < currentProblem.numAnswerDigits; i++) {
            const visualBoxIndex = i; 
            const enteredDigit = userInputValues[visualBoxIndex] || '';
            
            const logicalPositionOfThisVisualBox = currentProblem.entryOrderIndices.indexOf(visualBoxIndex);
            const correctDigitForThisVisualBox = logicalPositionOfThisVisualBox !== -1 ? paddedCorrectAnswer[currentProblem.numAnswerDigits - 1 - logicalPositionOfThisVisualBox] : ' '; 

            if (enteredDigit !== correctDigitForThisVisualBox) {
                newDigitErrors[visualBoxIndex] = true;
            }
        }
    }
    
    setDigitErrorFlags(newDigitErrors); 
    onAttempt(isOverallCorrect);

    if (isOverallCorrect) {
      showFeedback({ type: 'correct', message: '¡Operación correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. Revisa tu cálculo.' });
      setIsAttemptPending(false); 
    }
  }, [currentProblem, userInputValues, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (!currentProblem || isAttemptPending) return;
    showFeedback(null);
    setDigitErrorFlags(Array(currentProblem.numAnswerDigits).fill(false));

    const { numAnswerDigits, entryOrderIndices } = currentProblem;

    if (key === 'check') {
      verifyAnswer();
      return;
    }
    
    const visualIndexForCurrentStep = entryOrderIndices[currentEntryStep];

    if (key === 'backspace') {
      const newInputValues = [...userInputValues];
      if (visualIndexForCurrentStep < newInputValues.length && newInputValues[visualIndexForCurrentStep] !== '') {
        newInputValues[visualIndexForCurrentStep] = '';
        setUserInputValues(newInputValues);
      } else if (currentEntryStep > 0) {
        const prevEntryStep = currentEntryStep - 1;
        const prevVisualIndexToClear = entryOrderIndices[prevEntryStep];
        if (prevVisualIndexToClear < newInputValues.length) newInputValues[prevVisualIndexToClear] = '';
        setUserInputValues(newInputValues);
        setCurrentEntryStep(prevEntryStep);
      }
    } else if (/\d/.test(key) && currentEntryStep < numAnswerDigits) {
      const newInputValues = [...userInputValues];
       if (visualIndexForCurrentStep < newInputValues.length) {
           newInputValues[visualIndexForCurrentStep] = key;
           setUserInputValues(newInputValues);
           if (currentEntryStep < numAnswerDigits - 1) {
             setCurrentEntryStep(currentEntryStep + 1);
           }
       }
    }
  }, [currentProblem, userInputValues, currentEntryStep, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const handleCanvasToolChange = (tool: CanvasTool) => {
    setActiveCanvasTool(tool);
    drawingCanvasRef.current?.setTool(tool);
  };

  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }

    const { operands, operationType: problemOperationType, numAnswerDigits, entryOrderIndices, maxLength } = currentProblem;
    const activeVisualInputIndex = currentEntryStep < entryOrderIndices.length ? entryOrderIndices[currentEntryStep] : -1;
    
    const operationSymbol = problemOperationType === 'addition' ? '+' : '-';
    
    return (
      <div className="relative w-full max-w-xs sm:max-w-sm flex flex-col items-center p-4 border border-slate-300 rounded-lg shadow-lg bg-slate-50">
        {/* Drawing Canvas as Background */}
        <DrawingCanvas
          ref={drawingCanvasRef}
          className="absolute inset-0 z-0 rounded-lg" 
        />

        {/* Foreground Content Wrapper (Numbers, Inputs, Controls) */}
        <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
            {/* Problem Numbers Area */}
            <div className="font-mono text-3xl sm:text-4xl text-slate-700 p-3 rounded-md mb-2 bg-white/70 backdrop-blur-sm shadow-sm">
                <div className="inline-block text-right"> 
                {operands.map((op, index) => (
                    <div key={index} className="flex justify-end items-center my-1" style={{ minWidth: `${maxLength + 2}ch` }}>
                    <span className="inline-block text-center tabular-nums text-slate-700" style={{width: '1.5ch'}}>
                    {index === operands.length - 1 && operationSymbol ? operationSymbol : '\u00A0'}
                    </span>
                    <div className="flex">
                        {op.toString().padStart(maxLength, ' ').split('').map((char, charIdx) => (
                            <OperandDigitBox key={`op-${index}-char-${charIdx}`} digitChar={char} />
                        ))}
                    </div>
                    </div>
                ))}
                <div className="border-t-2 border-slate-400 my-2 ml-auto" style={{ width: `calc(${maxLength} * (2.5rem + 2 * 0.125rem))`}}></div>
                </div>
            </div>

            {/* Result Input Boxes */}
            <div className="flex justify-center my-2 pointer-events-auto"> 
                <div className="flex">
                {Array.from({ length: numAnswerDigits }).map((_, visualIndex) => (
                    <ResultDigitBox
                        key={`result-${visualIndex}`}
                        value={userInputValues[visualIndex] || ''}
                        isActive={activeVisualInputIndex === visualIndex}
                        isError={digitErrorFlags[visualIndex]}
                        onClick={() => {
                            const entryStepForThisVisual = entryOrderIndices.indexOf(visualIndex);
                            if (entryStepForThisVisual !== -1) {
                                setCurrentEntryStep(entryStepForThisVisual);
                            }
                        }}
                    />
                ))}
                </div>
            </div>

            {/* Canvas Controls */}
            <div className="mt-3 flex space-x-2 p-2 bg-slate-100/80 backdrop-blur-sm rounded-md shadow pointer-events-auto z-10">
                <button 
                    onClick={() => handleCanvasToolChange('pen')}
                    className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'pen' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                    aria-pressed={activeCanvasTool === 'pen'}
                    title="Usar Lápiz"
                > <Icons.PencilIcon className="w-5 h-5" /> </button>
                <button 
                    onClick={() => handleCanvasToolChange('eraser')}
                    className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'eraser' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                    aria-pressed={activeCanvasTool === 'eraser'}
                    title="Usar Goma de Borrar"
                > <Icons.EraserIcon className="w-5 h-5" /> </button>
                <button 
                    onClick={() => drawingCanvasRef.current?.clearCanvas()}
                    className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Limpiar Lienzo"
                > <Icons.ClearIcon className="w-5 h-5" /> </button>
            </div>
        </div>
      </div>
    );
  };

  return <MainContent />;
};
