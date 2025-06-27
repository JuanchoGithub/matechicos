

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { AvatarData, ExerciseScaffoldApi, Scenario } from '../types'; 
import { Icons, PencilIcon, EraserIcon, ClearIcon } from '../components/icons'; // Added drawing icons
// Scenario is now imported from ../types
import { DrawingCanvas, DrawingCanvasRef, CanvasTool } from '../components/DrawingCanvas'; // Added DrawingCanvas imports

export interface GeneratedProblem extends Scenario {
  num1: number;
  num2: number;
  correctResult: number;
}

export interface MultiStepProblemSolverConfig {
    maxDigitsForDataEntry: number; 
    maxDigitsForResultEntry: number; 
}

type OperationType = '+' | '-' | '*' | '/';

interface MultiStepProblemSolverProps {
  problem: GeneratedProblem;
  config: MultiStepProblemSolverConfig;
  exerciseQuestionText: string;
  scaffoldApi: ExerciseScaffoldApi; 
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  allowedOperations: OperationType[]; 
  setCustomKeypadContent?: (content: React.ReactNode | null) => void;
  allowDecimal?: boolean; // New prop
}

type ExerciseStep = 'DATA' | 'OPERATION' | 'RESOLVE' | 'FINAL_STATEMENT';
type ActiveDataField = 'data1' | 'data2';

const getVisualPlaceholderOrderForEntry = (numDigits: number): number[] => {
    if (numDigits <= 0) return [0];
    const order: number[] = [];
    for (let i = 0; i < numDigits; i++) {
        order.push(i); 
    }
    return order;
};

const digitBoxBaseClasses = "w-10 h-14 sm:w-12 sm:h-16 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5";

const renderNumberAsDigitBoxes = (numStr: string, maxLength: number, isOperand: boolean) => {
    const paddedNumStr = numStr.padStart(maxLength, ' ');
    const digitsToRender = paddedNumStr.split('');
    const baseSizingAndFont = "w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5";
    return digitsToRender.map((digitChar, index) => {
        let classList = `${baseSizingAndFont}`;
        if (isOperand) {
            classList += digitChar === ' ' ? " bg-transparent text-transparent" : " text-slate-700";
        } else { 
            classList += " border-2 rounded-md";
            classList += digitChar === ' ' ? " border-transparent bg-transparent" : " border-slate-300 bg-white text-slate-700";
        }
        return <div key={`num-digit-${index}-${isOperand ? 'op' : 'non-op'}`} className={classList}>{digitChar === ' ' ? ' ' : digitChar}</div>;
    });
};

const OperationButton: React.FC<{op: OperationType, label: string, onClick: (op: OperationType) => void, icon?: React.ReactNode}> = React.memo(({op, label, onClick, icon}) => (
    <button
        onClick={() => onClick(op)}
        className="w-full p-3 rounded-lg text-center text-lg font-semibold transition-all duration-150 ease-in-out shadow-md hover:shadow-lg bg-sky-500 hover:bg-sky-600 text-white focus:ring-2 focus:ring-sky-300 flex items-center justify-center space-x-2"
        aria-label={`Operación ${label}`}
    >
        {icon}
        <span>{label}</span>
    </button>
));


export const MultiStepProblemSolver: React.FC<MultiStepProblemSolverProps> = ({
  problem,
  config,
  exerciseQuestionText,
  scaffoldApi,
  registerKeypadHandler,
  allowedOperations,
  setCustomKeypadContent,
  allowDecimal = false, // Destructure new prop
}) => {
  const [currentStep, setCurrentStep] = useState<ExerciseStep>('DATA');
  const [data1Input, setData1Input] = useState<string[]>([]);
  const [data2Input, setData2Input] = useState<string[]>([]);
  const [activeDataField, setActiveDataField] = useState<ActiveDataField>('data1');
  const [currentDataDigitStep, setCurrentDataDigitStep] = useState<number>(0);
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [resultInput, setResultInput] = useState<string[]>([]);
  const [currentResultDigitStep, setCurrentResultDigitStep] = useState<number>(0);

  const drawingCanvasRef = useRef<DrawingCanvasRef>(null);
  const [activeCanvasTool, setActiveCanvasTool] = useState<CanvasTool>('pen');

  const currentScaffoldApiRef = useRef(scaffoldApi);
  useEffect(() => {
    currentScaffoldApiRef.current = scaffoldApi;
  }, [scaffoldApi]);

  useEffect(() => {
    const num1Str = problem.num1.toString();
    const num2Str = problem.num2.toString();
    const resStr = problem.correctResult.toString();

    setData1Input(Array(Math.min(num1Str.length, config.maxDigitsForDataEntry)).fill(''));
    setData2Input(Array(Math.min(num2Str.length, config.maxDigitsForDataEntry)).fill(''));
    setActiveDataField('data1');
    setCurrentDataDigitStep(0);
    setSelectedOperation(null); 
    setResultInput(Array(Math.min(resStr.length, config.maxDigitsForResultEntry)).fill(''));
    setCurrentResultDigitStep(0);
    setCurrentStep('DATA'); 
    currentScaffoldApiRef.current?.showFeedback(null); 
    drawingCanvasRef.current?.clearCanvas();
  }, [problem, config.maxDigitsForDataEntry, config.maxDigitsForResultEntry]);


  const handleOperationSelectInternal = useCallback((op: OperationType) => {
    if (!problem) return;
    setSelectedOperation(op);
    if (op === problem.operation) {
      currentScaffoldApiRef.current?.showFeedback(null);
      setCurrentStep('RESOLVE');
    } else {
      currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: 'Esa no es la operación que necesitas. Piensa de nuevo.' });
    }
  }, [problem, currentScaffoldApiRef]);
  
  
  const operationButtonsJsx = useMemo(() => (
    <div className="w-full flex flex-col space-y-3 p-2">
        {allowedOperations.includes('+') && <OperationButton op="+" label="Suma" icon={<Icons.OperationsIcon className="w-5 h-5"/>} onClick={handleOperationSelectInternal} />}
        {allowedOperations.includes('-') && <OperationButton op="-" label="Resta" icon={<Icons.OperationsIcon className="w-5 h-5 transform rotate-90"/>} onClick={handleOperationSelectInternal} />}
        {allowedOperations.includes('*') && <OperationButton op="*" label="Multiplicación" icon={<span className="text-xl">×</span>} onClick={handleOperationSelectInternal} />}
        {allowedOperations.includes('/') && <OperationButton op="/" label="División" icon={<span className="text-xl">÷</span>} onClick={handleOperationSelectInternal} />}
    </div>
  ), [allowedOperations, handleOperationSelectInternal]);

  const verifyDataStep = useCallback(() => {
    if (!problem) return;
    const enteredNum1 = parseFloat(data1Input.join(''));
    const enteredNum2 = parseFloat(data2Input.join(''));
    if (data1Input.join('').trim() === '' || data2Input.join('').trim() === '') {
        currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: 'Por favor, introduce ambos datos.' }); return;
    }
    if (enteredNum1 === problem.num1 && enteredNum2 === problem.num2) {
      currentScaffoldApiRef.current?.showFeedback({ type: 'correct', message: '¡Datos correctos!' });
      setTimeout(() => { currentScaffoldApiRef.current?.showFeedback(null); setCurrentStep('OPERATION'); }, 1000);
    } else {
      currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: 'Alguno de los datos no es correcto. Revisa el problema.' });
    }
  }, [problem, data1Input, data2Input, currentScaffoldApiRef]);

  const verifyResolveStep = useCallback(() => {
    if (!problem) return;
    const enteredResult = parseFloat(resultInput.join('').replace(',', '.'));
    if (resultInput.join('').trim() === '') {
        currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: 'Por favor, introduce el resultado.' }); return;
    }
    const isCorrect = Math.abs(enteredResult - problem.correctResult) < 0.001;
    currentScaffoldApiRef.current?.onAttempt(isCorrect); 

    if (isCorrect) {
      setCurrentStep('FINAL_STATEMENT'); 
    } else {
      currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: 'El resultado no es correcto. ¡Revisa tu cálculo!' });
    }
  }, [problem, resultInput, currentScaffoldApiRef]);
  
  const handleKeyPress = useCallback((key: string) => {
    currentScaffoldApiRef.current?.showFeedback(null);
    if (currentStep === 'DATA') {
        const isData1Active = activeDataField === 'data1';
        const currentInputArray = isData1Active ? data1Input : data2Input;
        const setCurrentInputArray = isData1Active ? setData1Input : setData2Input;
        const currentNumDigits = currentInputArray.length;
        
        if (key === 'backspace') {
            setCurrentInputArray(prev => prev.slice(0, -1));
        } else if ((/\d|\./.test(key)) && currentInputArray.join('').length < config.maxDigitsForDataEntry) {
            if (key === '.' && currentInputArray.includes('.')) return;
            setCurrentInputArray(prev => [...prev, key]);
        } else if (key === 'check') verifyDataStep();

    } else if (currentStep === 'RESOLVE') {
        if (key === 'backspace') {
            setResultInput(prev => prev.slice(0, -1));
        } else if ((/\d|\./.test(key)) && resultInput.join('').length < config.maxDigitsForResultEntry) {
            if (key === '.' && resultInput.includes('.')) return;
            setResultInput(prev => [...prev, key]);
        } else if (key === 'check') verifyResolveStep();
    }
  }, [currentStep, activeDataField, data1Input, data2Input, resultInput, verifyDataStep, verifyResolveStep, currentScaffoldApiRef, config]);

  useEffect(() => {
    if (currentStep === 'OPERATION') {
      setCustomKeypadContent?.(operationButtonsJsx);
      registerKeypadHandler(null); 
    } else if (currentStep === 'DATA' || currentStep === 'RESOLVE') {
      setCustomKeypadContent?.(null); 
      // The keypad is handled internally in this component's render
      // But we still need to register a handler if it's the default one.
      // This part is tricky if the keypad is external. Let's assume for now
      // the page will provide the keypad with this handler.
      registerKeypadHandler(handleKeyPress);
    } else { // FINAL_STATEMENT or other
      setCustomKeypadContent?.(null);
      registerKeypadHandler(null);
    }
    
    if (currentStep !== 'RESOLVE') {
        drawingCanvasRef.current?.clearCanvas();
    }

    return () => {
      setCustomKeypadContent?.(null);
    };
  }, [currentStep, setCustomKeypadContent, registerKeypadHandler, handleKeyPress, operationButtonsJsx]);

  const handleCanvasToolChange = (tool: CanvasTool) => {
    setActiveCanvasTool(tool);
    drawingCanvasRef.current?.setTool(tool);
  };

  const renderSingleInputBox = (value: string, isActive: boolean, onClick: () => void, placeholder: string) => {
    const activeClasses = isActive ? "border-sky-500 ring-2 ring-sky-300 bg-sky-50" : "border-slate-300 bg-white hover:border-slate-400";
    const valueClasses = value.trim() === '' ? "text-slate-400" : "text-slate-700";
    return <button onClick={onClick} className={`w-40 h-16 sm:w-48 sm:h-20 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5 transition-all ${activeClasses} ${valueClasses} pointer-events-auto`}>{value.trim() === '' ? placeholder : value}</button>;
  };

  if (!problem) return <div className="p-4 text-slate-700">Cargando problema...</div>;
  const problemStatementText = problem.problemTextTemplate(problem.num1, problem.num2);
  const resultStatementText = problem.resultLabelTemplate(problem.correctResult);

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
      <div className="text-xl sm:text-2xl text-slate-700 p-4 bg-amber-100 border border-amber-300 rounded-lg shadow min-h-[100px] flex items-center justify-center">
        {currentStep === 'FINAL_STATEMENT' ? resultStatementText : problemStatementText}
      </div>
      {currentStep !== 'FINAL_STATEMENT' && <div className="text-5xl sm:text-6xl my-2 sm:my-4">{problem.icon}</div>}
      
      {currentStep === 'DATA' && (
           <div className="w-full space-y-3 p-4 bg-slate-50 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-sky-700 mb-2">1. DATOS:</h3>
              <div className="flex flex-col items-center space-y-2 text-lg">
                <div className={`flex items-center p-2 rounded-md transition-colors w-full ${activeDataField === 'data1' ? 'bg-sky-100' : 'bg-transparent'}`}>
                    <span className="w-40 sm:w-48 text-left font-medium text-slate-700 flex-shrink-0">{problem.data1Label}:</span>
                    {renderSingleInputBox(data1Input.join(''), activeDataField === 'data1', () => setActiveDataField('data1'), "???")}
                    <span className="ml-2 w-20 text-left text-slate-700 flex-shrink-0">{problem.data1Unit}</span>
                </div>
                 <div className={`flex items-center p-2 rounded-md transition-colors w-full ${activeDataField === 'data2' ? 'bg-sky-100' : 'bg-transparent'}`}>
                    <span className="w-40 sm:w-48 text-left font-medium text-slate-700 flex-shrink-0">{problem.data2Label}:</span>
                     {renderSingleInputBox(data2Input.join(''), activeDataField === 'data2', () => setActiveDataField('data2'), "???")}
                    <span className="ml-2 w-20 text-left text-slate-700 flex-shrink-0">{problem.data2Unit}</span>
                </div>
              </div>
            </div>
      )}
      {currentStep === 'OPERATION' && ( 
            <div className="w-full space-y-3 p-4 bg-slate-50 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-sky-700 mb-2">2. OPERACIÓN:</h3>
                <div className="flex flex-col items-center space-y-4"> 
                    <p className="text-md text-slate-600 mb-1">{problem.data1Label}: {problem.num1} {problem.data1Unit}</p>
                    <p className="text-md text-slate-600 mb-3">{problem.data2Label}: {problem.num2} {problem.data2Unit}</p>
                    <p className="text-lg text-slate-700 font-medium">Elige la operación correcta en la barra lateral.</p>
                </div>
            </div>
      )}
      {currentStep === 'RESOLVE' && selectedOperation && ( 
           <div className="relative w-full max-w-md p-4 bg-slate-100 rounded-lg shadow-md">
                <DrawingCanvas
                    ref={drawingCanvasRef}
                    className="absolute inset-0 z-0 rounded-lg"
                />
                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                    <h3 className="text-xl font-semibold text-sky-700 mb-2 pointer-events-auto">3. RESUELVE:</h3>
                    <div className="font-mono text-4xl text-slate-700 my-4 p-2 bg-white/80 backdrop-blur-sm rounded">
                        <span>{problem.num1}</span>
                        <span className="mx-2">{selectedOperation === '*' ? '×' : selectedOperation === '/' ? '÷' : selectedOperation}</span>
                        <span>{problem.num2}</span>
                        <span className="mx-2">=</span>
                    </div>
                    {renderSingleInputBox(resultInput.join(''), true, () => {}, "Resultado")}
                    <div className="mt-3 flex justify-center space-x-2 pointer-events-auto">
                        <button onClick={() => handleCanvasToolChange('pen')} className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'pen' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`} aria-label="Lápiz"><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleCanvasToolChange('eraser')} className={`p-2 rounded-md transition-colors ${activeCanvasTool === 'eraser' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`} aria-label="Goma de borrar"><EraserIcon className="w-5 h-5" /></button>
                        <button onClick={() => drawingCanvasRef.current?.clearCanvas()} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors" aria-label="Limpiar lienzo"><ClearIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
      )}
    </div>
  );
};
