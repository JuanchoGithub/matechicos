import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi } from '../../types';
import { Icons, PencilIcon, EraserIcon, ClearIcon } from '../../components/icons';
import { DrawingCanvas, DrawingCanvasRef, CanvasTool } from '../../components/DrawingCanvas';

type KeypadHandler = (key: string) => void;

interface ColumnarOperationDecimalExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

interface CurrentProblem {
  operands: number[];
  operationType: 'addition' | 'subtraction';
  correctAnswer: number;
  formattedOperands: { integerPart: string; fractionalPart: string }[];
  formattedAnswer: { integerPart: string; fractionalPart: string };
  maxLengthInteger: number;
  maxLengthFractional: number;
}

const formatDecimalOperand = (num: number, maxFractionalDigits: number): { integerPart: string, fractionalPart: string } => {
    const fixedNum = num.toFixed(maxFractionalDigits);
    const parts = fixedNum.split('.');
    return {
        integerPart: parts[0],
        fractionalPart: parts[1] || ''
    };
};

export const ColumnarOperationDecimalExercise: React.FC<ColumnarOperationDecimalExerciseProps> = ({
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
    operationType = 'mixed',
    minOperandValue = 0.1,
    maxOperandValue = 999.99,
    maxOperands = 2,
    maxDecimalPlaces = 2,
    forceCarryOrBorrow = true,
  } = exercise.data || {};
  
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewProblem = useCallback(() => {
    let actualOperationType = operationType === 'mixed' ? (Math.random() < 0.5 ? 'addition' : 'subtraction') : operationType;
    let operands: number[];

    // Generation logic
    do {
      operands = Array.from({ length: maxOperands }, () => {
        const value = Math.random() * (maxOperandValue - minOperandValue) + minOperandValue;
        return parseFloat(value.toFixed(maxDecimalPlaces));
      });
      if (actualOperationType === 'subtraction' && operands[0] < operands[1]) {
        [operands[0], operands[1]] = [operands[1], operands[0]];
      }
    } while (operands.length > 1 && operands[0] === operands[1]); // Ensure they are not equal for more interesting problems

    const result = actualOperationType === 'addition'
      ? operands.reduce((sum, op) => sum + op, 0)
      : operands[0] - operands[1];
    
    const formattedOperands = operands.map(op => formatDecimalOperand(op, maxDecimalPlaces));
    const formattedAnswer = formatDecimalOperand(result, maxDecimalPlaces);

    const maxLengthInteger = Math.max(...formattedOperands.map(f => f.integerPart.length), formattedAnswer.integerPart.length);
    const maxLengthFractional = Math.max(...formattedOperands.map(f => f.fractionalPart.length), formattedAnswer.fractionalPart.length);
    
    // Pad for alignment
    formattedOperands.forEach(f => {
        f.integerPart = f.integerPart.padStart(maxLengthInteger, ' ');
        f.fractionalPart = f.fractionalPart.padEnd(maxLengthFractional, ' ');
    });
    formattedAnswer.integerPart = formattedAnswer.integerPart.padStart(maxLengthInteger, ' ');
    formattedAnswer.fractionalPart = formattedAnswer.fractionalPart.padEnd(maxLengthFractional, ' ');

    setCurrentProblem({
      operands,
      operationType: actualOperationType as 'addition' | 'subtraction',
      correctAnswer: parseFloat(result.toFixed(maxDecimalPlaces)),
      formattedOperands,
      formattedAnswer,
      maxLengthInteger,
      maxLengthFractional
    });
    
    const totalAnswerDigits = maxLengthInteger + maxLengthFractional;
    setUserInputValues(Array(totalAnswerDigits).fill(''));
    setDigitErrorFlags(Array(totalAnswerDigits).fill(false));
    setCurrentEntryStep(0);
    showFeedback(null);
    setIsAttemptPending(false);
    drawingCanvasRef.current?.clearCanvas();
  }, [operationType, minOperandValue, maxOperandValue, maxOperands, maxDecimalPlaces, showFeedback]);

  useEffect(() => { generateNewProblem(); }, [generateNewProblem, exercise.id]);
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) generateNewProblem();
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewProblem]);
  
  const verifyAnswer = useCallback(() => {
    if (!currentProblem || isAttemptPending) return;
    setIsAttemptPending(true);

    const { maxLengthInteger, maxLengthFractional } = currentProblem;
    const intPart = userInputValues.slice(0, maxLengthInteger).join('');
    const fracPart = userInputValues.slice(maxLengthInteger).join('');
    const userAnswerString = `${intPart}.${fracPart}`;
    const userAnswerNum = parseFloat(userAnswerString);
    
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, completa la respuesta.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    
    const isCorrect = Math.abs(userAnswerNum - currentProblem.correctAnswer) < 0.001;
    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Resultado Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Resultado incorrecto. ¡Revisa tu cálculo!' });
      setIsAttemptPending(false);
    }
  }, [currentProblem, userInputValues, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);

    if (key === 'check') { verifyAnswer(); return; }

    const entryOrder = Array.from({ length: userInputValues.length }, (_, i) => i);
    const targetIndex = entryOrder[currentEntryStep];
    
    if (key === 'backspace') {
        const newInputValues = [...userInputValues];
        if (targetIndex >= 0 && newInputValues[targetIndex] !== '') {
            newInputValues[targetIndex] = '';
            setUserInputValues(newInputValues);
        } else if (currentEntryStep > 0) {
            const prevStep = currentEntryStep - 1;
            const prevVisualIndexToClear = entryOrder[prevStep];
            newInputValues[prevVisualIndexToClear] = '';
            setUserInputValues(newInputValues);
            setCurrentEntryStep(prevStep);
        }
    } else if (/\d/.test(key) && currentEntryStep < userInputValues.length) {
        const newInputValues = [...userInputValues];
        if (targetIndex < newInputValues.length) {
            newInputValues[targetIndex] = key;
            setUserInputValues(newInputValues);
            if (currentEntryStep < userInputValues.length - 1) {
                setCurrentEntryStep(prev => prev + 1);
            }
        }
    }
  }, [isAttemptPending, showFeedback, verifyAnswer, currentEntryStep, userInputValues]);

  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const handleCanvasToolChange = (tool: CanvasTool) => {
    setActiveCanvasTool(tool);
    drawingCanvasRef.current?.setTool(tool);
  };

  const DigitBox: React.FC<{ char: string, className?: string }> = ({ char, className = "" }) => (
    <div className={`w-8 h-12 sm:w-10 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold mx-px tabular-nums ${className}`}>
      {char}
    </div>
  );

  const InputDigitBox: React.FC<{ value: string, isActive: boolean, onClick: () => void }> = ({ value, isActive, onClick }) => (
      <button type="button" onClick={onClick} className={`w-8 h-12 sm:w-10 sm:h-14 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-px tabular-nums pointer-events-auto transition-all ${isActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white text-slate-800'}`}>
        {value || ''}
      </button>
  );

  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }

    const { formattedOperands, operationType: problemOperationType, maxLengthInteger, maxLengthFractional } = currentProblem;
    const operationSymbol = problemOperationType === 'addition' ? '+' : '-';
    
    return (
      <div className="relative w-full max-w-sm flex flex-col items-center p-4 border border-slate-300 rounded-lg shadow-lg bg-slate-50">
        <DrawingCanvas ref={drawingCanvasRef} className="absolute inset-0 z-0 rounded-lg" />
        <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
            {/* Problem Numbers Area */}
            <div className="font-mono text-slate-800 p-3 rounded-md mb-2 bg-white/70 backdrop-blur-sm shadow-sm">
                <div className="inline-block text-right">
                    {formattedOperands.map((op, index) => (
                    <div key={index} className="flex justify-end items-center my-1">
                        {index === formattedOperands.length - 1 && <DigitBox char={operationSymbol} className="text-slate-700" />}
                        <div className="flex">
                        {op.integerPart.split('').map((char, i) => <DigitBox key={`op${index}-int-${i}`} char={char} />)}
                        <DigitBox char="," className="text-slate-700" />
                        {op.fractionalPart.split('').map((char, i) => <DigitBox key={`op${index}-frac-${i}`} char={char} />)}
                        </div>
                    </div>
                    ))}
                    <div className="border-t-2 border-slate-400 my-2 ml-auto" style={{ width: `calc(${(maxLengthInteger + maxLengthFractional + 1 + 1)} * (2rem + 2 * 1px))` }}></div>
                </div>
            </div>
            {/* Result Input Boxes */}
            <div className="flex justify-center my-2 pointer-events-auto z-10">
                <div className="flex">
                    {Array.from({ length: maxLengthInteger }).map((_, i) => (
                    <InputDigitBox key={`res-int-${i}`} value={userInputValues[i] || ''} isActive={currentEntryStep === i} onClick={() => setCurrentEntryStep(i)} />
                    ))}
                    <DigitBox char="," className="text-slate-700 !border-transparent" />
                    {Array.from({ length: maxLengthFractional }).map((_, i) => {
                    const overallIndex = maxLengthInteger + i;
                    return <InputDigitBox key={`res-frac-${i}`} value={userInputValues[overallIndex] || ''} isActive={currentEntryStep === overallIndex} onClick={() => setCurrentEntryStep(overallIndex)} />;
                    })}
                </div>
            </div>
            {/* Canvas Controls */}
            <div className="mt-3 flex space-x-2 p-2 bg-slate-100/80 backdrop-blur-sm rounded-md shadow pointer-events-auto z-10">
                <button onClick={() => handleCanvasToolChange('pen')} className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'pen' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`} aria-pressed={activeCanvasTool === 'pen'} title="Usar Lápiz">
                    <Icons.PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleCanvasToolChange('eraser')} className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'eraser' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`} aria-pressed={activeCanvasTool === 'eraser'} title="Usar Goma de Borrar">
                    <Icons.EraserIcon className="w-5 h-5" />
                </button>
                <button onClick={() => drawingCanvasRef.current?.clearCanvas()} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors" title="Limpiar Lienzo">
                    <Icons.ClearIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    );
  };
  return <MainContent />;
};
