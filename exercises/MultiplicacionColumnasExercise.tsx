import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi } from '../types';
import { DrawingCanvas, DrawingCanvasRef } from '../components/DrawingCanvas';

type KeypadHandler = (key: string) => void;

interface MultiplicacionColumnasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

type FocusTarget = 'intermediate1' | 'intermediate2' | 'finalProduct';

interface ProblemDetails {
  multiplicand: number;
  multiplier: number;
  correctIntermediate1?: string; 
  correctIntermediate2?: string; 
  correctFinalProduct: string;
  numDigitsIntermediate1: number;
  numDigitsIntermediate2: number;
  numDigitsFinalProduct: number;
  entryOrderIntermediate1: number[];
  entryOrderIntermediate2: number[];
  entryOrderFinalProduct: number[];
  problemWidthChars: number; 
}

interface UserInputState {
  intermediate1: string[]; 
  intermediate2: string[]; 
  finalProduct: string[];  
}

const getRandomNumberByDigits = (digitCount: number, range?: [number, number]): number => {
  if (range) return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  if (digitCount === 1 && !range) return Math.floor(Math.random() * 9) + 1; 
  const min = Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getVisualPlaceholderOrderForEntry(numDigits: number): number[] {
    if (numDigits <= 0) return [];
    const sequence = [];
    for (let i = 0; i < numDigits; i++) { 
        sequence.push(numDigits - 1 - i); 
    }
    return sequence; 
}

const DigitDisplayBox: React.FC<{ digitChar: string, className?: string }> = ({ digitChar, className }) => (
  <div className={`w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl font-bold mx-0.5 tabular-nums ${className}`}>
    {digitChar === ' ' ? '\u00A0' : digitChar} 
  </div>
);

const InputDigitBox: React.FC<{ 
    value: string; 
    isActive?: boolean; 
    isError?: boolean; 
    onClick?: () => void; 
    className?: string;
    placeholder?: string;
}> = ({ value, isActive, isError, onClick, className = "", placeholder="_" }) => {
  let boxSpecificClass = 'border-slate-300 bg-white';
  if (isActive) boxSpecificClass = 'border-sky-500 ring-2 ring-sky-300 bg-sky-50';
  else if (isError) boxSpecificClass = 'bg-red-100 border-red-500 text-red-700';
  
  const valueClasses = value ? (isError && !isActive ? 'text-red-700' : 'text-slate-800') : 'text-slate-400';

  return (
    <div
      className={`w-10 h-14 sm:w-12 sm:h-16 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5 tabular-nums ${boxSpecificClass} ${valueClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : "cell"}
      tabIndex={onClick ? 0 : -1}
      aria-label={onClick ? `Input for digit, current value: ${value || 'empty'}` : `Displayed digit: ${value}`}
    >
      {value || placeholder}
    </div>
  );
};


// Help Modal Component
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-start z-50 m-0.5 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl p-5 max-w-lg w-full ml-0.5 mt-0.5 my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-sky-700">Multiplicación en columnas</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl font-bold p-1" aria-label="Cerrar ayuda">
            &times;
          </button>
        </div>
        <div className="text-slate-700 space-y-4 leading-relaxed">
          <p>Vamos a aprender a multiplicar en columnas, paso a paso:</p>
          
          <div className="flex items-start">
            <div className="bg-sky-100 rounded-full w-7 h-7 flex items-center justify-center text-sky-700 font-bold mr-3 mt-0.5 flex-shrink-0">1</div>
            <div>
              <p className="font-semibold">Acomoda los números</p>
              <p>Escribe el multiplicando (número mayor) arriba y el multiplicador (número menor) abajo.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-sky-100 rounded-full w-7 h-7 flex items-center justify-center text-sky-700 font-bold mr-3 mt-0.5 flex-shrink-0">2</div>
            <div>
              <p className="font-semibold">Multiplica las unidades</p>
              <p>Multiplica el dígito de las <span className="text-green-600 font-medium">unidades</span> del multiplicando por el multiplicador.</p>
              <p className="text-sm italic mt-1">Ejemplo: 4<span className="text-green-600 font-medium underline">7</span> × 6 = Multiplica <span className="text-green-600 font-medium">7</span> × 6 = 42</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-sky-100 rounded-full w-7 h-7 flex items-center justify-center text-sky-700 font-bold mr-3 mt-0.5 flex-shrink-0">3</div>
            <div>
              <p className="font-semibold">Multiplica las decenas</p>
              <p>Multiplica el dígito de las <span className="text-blue-600 font-medium">decenas</span> del multiplicando por el multiplicador.</p>
              <p className="text-sm italic mt-1">Ejemplo: <span className="text-blue-600 font-medium underline">4</span>7 × 6 = Multiplica <span className="text-blue-600 font-medium">4</span> × 6 = 24</p>
              <p className="text-sm italic">Como estamos en la posición de las decenas, añadimos un 0: 24 × 10 = 240</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-sky-100 rounded-full w-7 h-7 flex items-center justify-center text-sky-700 font-bold mr-3 mt-0.5 flex-shrink-0">4</div>
            <div>
              <p className="font-semibold">Suma los resultados parciales</p>
              <p>Suma los resultados de cada multiplicación para obtener el producto final.</p>
              <p className="text-sm italic mt-1">Ejemplo: 42 + 240 = 282</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg mt-3 font-mono border border-slate-200">
            <div className="flex">
              <div className="w-24 text-slate-500 text-xs mr-3 mt-1 text-right">
                <p className="mb-6">Acomoda los números:</p>
                <p className="mb-6">Multiplica unidades:</p>
                <p className="mb-6">Multiplica decenas:</p>
                <p className="mb-5">Suma los resultados:</p>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <p className="mb-1 text-right">47</p>
                  <p className="mb-1 text-right">× 6</p>
                  <hr className="border-slate-700 mb-1" />
                </div>
                <div className="mb-2">
                  <p className="mb-1 text-right">4<span className="text-green-600">7</span></p>
                  <p className="mb-1 text-right">× <span className="text-green-600">6</span></p>
                  <hr className="border-slate-700 mb-1" />
                  <p className="mb-1 text-right text-green-600 font-medium">42</p>
                </div>
                <div className="mb-2">
                  <p className="mb-1 text-right"><span className="text-blue-600">4</span>7</p>
                  <p className="mb-1 text-right">× <span className="text-blue-600">6</span></p>
                  <hr className="border-slate-700 mb-1" />
                  <p className="mb-1 text-right text-green-600 font-medium">42</p>
                  <p className="mb-1 text-right text-blue-600 font-medium">240</p>
                </div>
                <div>
                  <p className="mb-1 text-right">47</p>
                  <p className="mb-1 text-right">× 6</p>
                  <hr className="border-slate-700 mb-1" />
                  <p className="mb-1 text-right text-green-600">42</p>
                  <p className="mb-1 text-right text-blue-600">240</p>
                  <hr className="border-slate-700 mb-1" />
                  <p className="mb-1 text-right font-bold">282</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-sky-500 text-white font-medium text-sm rounded-md hover:bg-sky-600 transition-colors shadow"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiplicacionColumnasExercise: React.FC<MultiplicacionColumnasExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<UserInputState>({ intermediate1: [], intermediate2: [], finalProduct: [] });
  const [currentFocusTarget, setCurrentFocusTarget] = useState<FocusTarget>('finalProduct');
  const [currentEntryStepOnLine, setCurrentEntryStepOnLine] = useState<number>(0); 
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const [intermediate1DigitErrors, setIntermediate1DigitErrors] = useState<boolean[]>([]);
  const [intermediate2DigitErrors, setIntermediate2DigitErrors] = useState<boolean[]>([]);
  const [finalProductDigitErrors, setFinalProductDigitErrors] = useState<boolean[]>([]);

  const {
    multiplicandDigitCount = 2, 
    multiplierDigitCount = 1,
    multiplicandRange,
    multiplierRange,
  } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null);

  const generateNewProblem = useCallback(() => {
    const actualMultiplicandDigits = Array.isArray(multiplicandDigitCount) 
        ? multiplicandDigitCount[Math.floor(Math.random() * multiplicandDigitCount.length)]
        : multiplicandDigitCount;

    const multiplicand = getRandomNumberByDigits(actualMultiplicandDigits, multiplicandRange);
    const multiplier = getRandomNumberByDigits(multiplierDigitCount, multiplierRange);
    
    const finalProductVal = multiplicand * multiplier;
    const finalProductStr = finalProductVal.toString();
    const numDigitsFinalProd = finalProductStr.length > 0 ? finalProductStr.length : 1;

    let problemWidth = Math.max(
        multiplicand.toString().length,
        multiplier.toString().length,
        numDigitsFinalProd
    );

    const details: ProblemDetails = {
        multiplicand,
        multiplier,
        correctFinalProduct: finalProductStr,
        numDigitsIntermediate1: 0,
        numDigitsIntermediate2: 0,
        numDigitsFinalProduct: numDigitsFinalProd,
        entryOrderIntermediate1: [],
        entryOrderIntermediate2: [],
        entryOrderFinalProduct: getVisualPlaceholderOrderForEntry(numDigitsFinalProd),
        problemWidthChars: 0, 
    };

    let initialFocusTarget: FocusTarget = 'finalProduct'; 
    let numIntermediate1StorageDigits = 0;
    let numIntermediate2StorageDigits = 0;

    if (multiplierDigitCount === 2) {
        const unitsMultiplier = multiplier % 10;
        const tensMultiplier = Math.floor(multiplier / 10);
        
        const inter1Val = multiplicand * unitsMultiplier;
        const inter2Val = multiplicand * tensMultiplier;

        const inter1Str = inter1Val.toString();
        const inter2Str = inter2Val.toString();
        
        details.correctIntermediate1 = inter1Str;
        numIntermediate1StorageDigits = inter1Str.length > 0 ? inter1Str.length : 1;
        details.numDigitsIntermediate1 = numIntermediate1StorageDigits;
        details.entryOrderIntermediate1 = getVisualPlaceholderOrderForEntry(numIntermediate1StorageDigits);
        problemWidth = Math.max(problemWidth, numIntermediate1StorageDigits);

        details.correctIntermediate2 = inter2Str;
        numIntermediate2StorageDigits = inter2Str.length > 0 ? inter2Str.length : 1;
        details.numDigitsIntermediate2 = numIntermediate2StorageDigits; 
        details.entryOrderIntermediate2 = getVisualPlaceholderOrderForEntry(numIntermediate2StorageDigits);
        problemWidth = Math.max(problemWidth, numIntermediate2StorageDigits + (numIntermediate2StorageDigits > 0 ? 1: 0) ); 
        
        initialFocusTarget = numIntermediate1StorageDigits > 0 ? 'intermediate1' : (numIntermediate2StorageDigits > 0 ? 'intermediate2' : 'finalProduct');
    } else { 
        numIntermediate1StorageDigits = numDigitsFinalProd; 
        details.numDigitsIntermediate1 = numIntermediate1StorageDigits; 
        details.entryOrderIntermediate1 = getVisualPlaceholderOrderForEntry(numIntermediate1StorageDigits);
        details.correctIntermediate1 = finalProductStr; // For 1-digit multiplier, inter1 is the final product
        problemWidth = Math.max(problemWidth, numIntermediate1StorageDigits);
        initialFocusTarget = 'intermediate1'; 
    }
    details.problemWidthChars = problemWidth;
    
    setProblemDetails(details); 
    setUserInput({
      intermediate1: Array(numIntermediate1StorageDigits).fill(''),
      intermediate2: Array(numIntermediate2StorageDigits).fill(''),
      finalProduct: multiplierDigitCount === 2 ? Array(details.numDigitsFinalProduct).fill('') : [], 
    });

    setIntermediate1DigitErrors(Array(numIntermediate1StorageDigits).fill(false));
    setIntermediate2DigitErrors(Array(numIntermediate2StorageDigits).fill(false));
    setFinalProductDigitErrors(Array(multiplierDigitCount === 2 ? details.numDigitsFinalProduct : 0).fill(false));
    
    setCurrentFocusTarget(initialFocusTarget);
    setCurrentEntryStepOnLine(0); 
    showFeedback(null);
    setIsAttemptPending(false);

  }, [multiplicandDigitCount, multiplierDigitCount, multiplicandRange, multiplierRange, showFeedback]);


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
    if (!problemDetails || isAttemptPending) return;
    setIsAttemptPending(true);

    const { correctFinalProduct, correctIntermediate1, correctIntermediate2 } = problemDetails;
    let allCorrect = true;
    let issues: string[] = [];
    
    const newIntermediate1Errors = Array(userInput.intermediate1.length).fill(false);
    const newIntermediate2Errors = Array(userInput.intermediate2.length).fill(false);
    const newFinalProductErrors = Array(userInput.finalProduct.length).fill(false);

    if (multiplierDigitCount === 2 && correctIntermediate1) {
      const userAnswerInter1 = userInput.intermediate1.join('');
      if (userAnswerInter1 !== correctIntermediate1) {
        allCorrect = false; issues.push("el primer producto parcial");
        const paddedCorrect1 = correctIntermediate1.padStart(userInput.intermediate1.length, ' ');
        userInput.intermediate1.forEach((digit, i) => {
            if (digit !== paddedCorrect1[i] && paddedCorrect1[i] !== ' ') newIntermediate1Errors[i] = true;
        });
      }
    } else if (multiplierDigitCount === 1 && correctIntermediate1) { 
        const userAnswerInter1 = userInput.intermediate1.join('');
        if (userAnswerInter1 !== correctFinalProduct) {
            allCorrect = false; issues.push("el producto");
             const paddedCorrectFinal = correctFinalProduct.padStart(userInput.intermediate1.length, ' ');
             userInput.intermediate1.forEach((digit, i) => {
                if (digit !== paddedCorrectFinal[i] && paddedCorrectFinal[i] !== ' ') newIntermediate1Errors[i] = true;
             });
        }
    }


    if (multiplierDigitCount === 2 && correctIntermediate2) {
      const userAnswerInter2 = userInput.intermediate2.join('');
      if (userAnswerInter2 !== correctIntermediate2) {
        allCorrect = false; issues.push("el segundo producto parcial");
        const paddedCorrect2 = correctIntermediate2.padStart(userInput.intermediate2.length, ' ');
        userInput.intermediate2.forEach((digit, i) => {
            if (digit !== paddedCorrect2[i] && paddedCorrect2[i] !== ' ') newIntermediate2Errors[i] = true;
        });
      }
    }
    
    if (multiplierDigitCount === 2) {
      const userAnswerFinal = userInput.finalProduct.join('');
      if (userAnswerFinal !== correctFinalProduct) {
        allCorrect = false; 
        if (!issues.includes("el producto final")) issues.push("el producto final");
        const paddedCorrectFinal = correctFinalProduct.padStart(userInput.finalProduct.length, ' ');
        userInput.finalProduct.forEach((digit, i) => {
            if (digit !== paddedCorrectFinal[i] && paddedCorrectFinal[i] !== ' ') newFinalProductErrors[i] = true;
        });
      }
    }

    setIntermediate1DigitErrors(newIntermediate1Errors);
    setIntermediate2DigitErrors(newIntermediate2Errors);
    setFinalProductDigitErrors(newFinalProductErrors);

    onAttempt(allCorrect);
    if (allCorrect) { 
      showFeedback({ type: 'correct', message: '¡Multiplicación correcta!' });
    } else { 
      let incorrectMessage = "Resultado incorrecto. ";
      if (issues.length > 0) {
        incorrectMessage += `Revisa ${issues.join(', ')}.`;
      } else {
        incorrectMessage += "Revisa tu cálculo.";
      }
      showFeedback({ type: 'incorrect', message: incorrectMessage });
      setIsAttemptPending(false); // Allow retry
    }
  }, [problemDetails, userInput, multiplierDigitCount, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (!problemDetails || isAttemptPending) return;
    showFeedback(null); 
    
    if (currentFocusTarget === 'intermediate1') setIntermediate1DigitErrors(Array(userInput.intermediate1.length).fill(false));
    else if (currentFocusTarget === 'intermediate2') setIntermediate2DigitErrors(Array(userInput.intermediate2.length).fill(false));
    else if (currentFocusTarget === 'finalProduct') setFinalProductDigitErrors(Array(userInput.finalProduct.length).fill(false));

    const entryOrderCurrentLine = 
        currentFocusTarget === 'intermediate1' ? problemDetails.entryOrderIntermediate1 :
        currentFocusTarget === 'intermediate2' ? problemDetails.entryOrderIntermediate2 :
        problemDetails.entryOrderFinalProduct;

    if (key === 'check') {
      verifyAnswer();
      return;
    }
    
    let targetArray = userInput[currentFocusTarget];
    let visualIndexToModify = entryOrderCurrentLine[currentEntryStepOnLine];

    if (key === 'backspace') {
      const newArray = [...targetArray];
      if (visualIndexToModify < newArray.length && newArray[visualIndexToModify] !== '') { 
        newArray[visualIndexToModify] = '';
      } else if (currentEntryStepOnLine > 0) { 
        const prevStep = currentEntryStepOnLine - 1;
        const prevVisualIndex = entryOrderCurrentLine[prevStep];
        if(prevVisualIndex < newArray.length) newArray[prevVisualIndex] = ''; 
        setCurrentEntryStepOnLine(prevStep);
      } else { 
        if (currentFocusTarget === 'finalProduct' && multiplierDigitCount === 2 && problemDetails.numDigitsIntermediate2 > 0) {
          setCurrentFocusTarget('intermediate2');
          setCurrentEntryStepOnLine(0); 
        } else if (((currentFocusTarget === 'finalProduct' && multiplierDigitCount === 2 && problemDetails.numDigitsIntermediate2 === 0) || currentFocusTarget === 'intermediate2') && multiplierDigitCount === 2 && problemDetails.numDigitsIntermediate1 > 0) {
          setCurrentFocusTarget('intermediate1');
          setCurrentEntryStepOnLine(0);
        }
      }
       setUserInput(prev => ({ ...prev, [currentFocusTarget]: newArray }));
    } else if (/\d/.test(key) && currentEntryStepOnLine < entryOrderCurrentLine.length) {
      const newArray = [...targetArray];
      if(visualIndexToModify < newArray.length) newArray[visualIndexToModify] = key;
      setUserInput(prev => ({ ...prev, [currentFocusTarget]: newArray }));
      
      if (currentEntryStepOnLine < entryOrderCurrentLine.length - 1) {
        setCurrentEntryStepOnLine(prev => prev + 1);
      } else { 
        if (currentFocusTarget === 'intermediate1' && multiplierDigitCount === 2 && problemDetails.numDigitsIntermediate2 > 0) {
          setCurrentFocusTarget('intermediate2');
          setCurrentEntryStepOnLine(0);
        } else if (((currentFocusTarget === 'intermediate1' && multiplierDigitCount === 2 && problemDetails.numDigitsIntermediate2 === 0) || currentFocusTarget === 'intermediate2') && multiplierDigitCount === 2 && problemDetails.numDigitsFinalProduct > 0) {
          setCurrentFocusTarget('finalProduct');
          setCurrentEntryStepOnLine(0);
        }
      }
    }
  }, [problemDetails, currentFocusTarget, currentEntryStepOnLine, userInput, verifyAnswer, showFeedback, multiplierDigitCount, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  
  const renderInputBoxesLine = (
    valueArray: string[], 
    numVisualBoxes: number, 
    targetType: FocusTarget, 
    entryOrderForLine: number[], 
    digitErrorFlags: boolean[],
    isShifted: boolean = false 
) => {
    if (numVisualBoxes === 0 && !(targetType === 'intermediate1' && multiplierDigitCount === 1)) return null; 
    
    if (numVisualBoxes === 0 && targetType === 'intermediate1' && multiplierDigitCount === 1 && problemDetails?.correctFinalProduct === "0"){
        numVisualBoxes = 1;
        if(valueArray.length === 0) valueArray = ['']; 
        if(entryOrderForLine.length === 0) entryOrderForLine = [0]; 
        if(digitErrorFlags.length === 0) digitErrorFlags = [false];
    }

    const boxes = [];
    const activeVisualBoxIndexForCurrentLine = currentFocusTarget === targetType ? entryOrderForLine[currentEntryStepOnLine] : -1;

    for (let visualI = 0; visualI < numVisualBoxes; visualI++) { 
        const isActive = currentFocusTarget === targetType && activeVisualBoxIndexForCurrentLine === visualI;
        const hasError = digitErrorFlags[visualI]; 
        
        boxes.push( 
            <InputDigitBox
                key={`${targetType}-input-${visualI}`}
                value={valueArray[visualI] || ''}
                isActive={isActive}
                isError={hasError}
                onClick={() => { 
                    setCurrentFocusTarget(targetType);
                    const entryStep = entryOrderForLine.indexOf(visualI);
                    setCurrentEntryStepOnLine(entryStep !== -1 ? entryStep : 0);
                    showFeedback(null);
                }}
            />
        );
    }
    if (isShifted && targetType === 'intermediate2' && problemDetails && problemDetails.correctIntermediate2 !== "0" && numVisualBoxes > 0) {
        boxes.push(
             <DigitDisplayBox key={`${targetType}-shift`} digitChar="0" className="bg-transparent border-transparent !text-slate-400/70" />
        );
    }
    return <div className="flex justify-end my-1">{boxes}</div>;
  };

  // Detect if this is a 2-digit x 1-digit (step-by-step) exercise
  const isStepByStepSimple = multiplicandDigitCount === 2 && multiplierDigitCount === 1;

  // Step state for step-by-step mode
  const [step, setStep] = useState(0); // 0: units, 1: tens, 2: sum
  const [stepInputs, setStepInputs] = useState<{units: string, tens: string, sum: string}>({units: '', tens: '', sum: ''});
  const [stepErrors, setStepErrors] = useState<{units: boolean, tens: boolean, sum: boolean}>({units: false, tens: false, sum: false});

  // Step-by-step logic for 2-digit x 1-digit
  const handleStepKeyPress = useCallback((key: string) => {
    if (!problemDetails || isAttemptPending) return;
    showFeedback(null);
    let newInputs = { ...stepInputs };
    let newErrors = { ...stepErrors };
    if (key === 'check') {
      // Validate current step
      const multiplicandStr = problemDetails.multiplicand.toString().padStart(2, '0');
      const units = parseInt(multiplicandStr[1]);
      const tens = parseInt(multiplicandStr[0]);
      const multiplier = problemDetails.multiplier;
      const unitsResult = units * multiplier;
      const tensResult = tens * multiplier * 10;
      const sumResult = unitsResult + tensResult;
      let correct = false;
      if (step === 0) {
        correct = parseInt(stepInputs.units) === unitsResult;
        newErrors.units = !correct;
      } else if (step === 1) {
        correct = parseInt(stepInputs.tens) === tensResult;
        newErrors.tens = !correct;
      } else if (step === 2) {
        correct = parseInt(stepInputs.sum) === sumResult;
        newErrors.sum = !correct;
      }
      setStepErrors(newErrors);
      if (correct) {
        if (step < 2) {
          setStep(step + 1);
        } else {
          showFeedback({ type: 'correct', message: '¡Multiplicación correcta!' });
          onAttempt(true);
        }
      } else {
        showFeedback({ type: 'incorrect', message: 'Revisa tu cálculo.' });
        setIsAttemptPending(false);
      }
      return;
    }
    if (key === 'backspace') {
      if (step === 0) newInputs.units = newInputs.units.slice(0, -1);
      if (step === 1) newInputs.tens = newInputs.tens.slice(0, -1);
      if (step === 2) newInputs.sum = newInputs.sum.slice(0, -1);
    } else if (/\d/.test(key)) {
      if (step === 0) newInputs.units += key;
      if (step === 1) newInputs.tens += key;
      if (step === 2) newInputs.sum += key;
    }
    setStepInputs(newInputs);
    setStepErrors({units: false, tens: false, sum: false});
  }, [problemDetails, step, stepInputs, stepErrors, showFeedback, onAttempt, isAttemptPending]);

  useEffect(() => {
    if (isStepByStepSimple) {
      registerKeypadHandler(handleStepKeyPress);
      return () => registerKeypadHandler(null);
    }
  }, [registerKeypadHandler, handleStepKeyPress, isStepByStepSimple]);

  useEffect(() => {
    if (isStepByStepSimple) {
      setStep(0);
      setStepInputs({units: '', tens: '', sum: ''});
      setStepErrors({units: false, tens: false, sum: false});
    }
  }, [problemDetails, isStepByStepSimple]);

  // Step-by-step state for columnar layout
  const [stepCol, setStepCol] = useState(0); // 0: units row, 1: tens row, 2: sum row
  const [colInputs, setColInputs] = useState<{units: string[]; tens: string[]; sum: string[]}>({units: [], tens: [], sum: []});
  const [colErrors, setColErrors] = useState<{units: boolean[]; tens: boolean[]; sum: boolean[]}>({units: [], tens: [], sum: []});

  // Setup for columnar step-by-step mode
  useEffect(() => {
    if (isStepByStepSimple && problemDetails) {
      // All rows have the same width as the final product
      const width = problemDetails.numDigitsFinalProduct;
      setColInputs({
        units: Array(width).fill(''),
        tens: Array(width).fill(''),
        sum: Array(width).fill(''),
      });
      setColErrors({
        units: Array(width).fill(false),
        tens: Array(width).fill(false),
        sum: Array(width).fill(false),
      });
      setStepCol(0);
    }
  }, [isStepByStepSimple, problemDetails]);

  // Columnar step-by-step keypad handler
  const handleColKeypad = useCallback((key: string) => {
    if (!problemDetails || isAttemptPending) return;
    showFeedback(null);
    const width = problemDetails.numDigitsFinalProduct;
    let newInputs = {...colInputs};
    let newErrors = {...colErrors};
    let row: 'units' | 'tens' | 'sum' = stepCol === 0 ? 'units' : stepCol === 1 ? 'tens' : 'sum';
    let arr = [...newInputs[row]];
    let errArr = [...newErrors[row]];
    // Find first empty
    let idx = arr.findIndex(v => v === '');
    if (key === 'backspace') {
      if (idx === -1) idx = width;
      if (idx > 0) arr[idx-1] = '';
    } else if (/\d/.test(key) && idx !== -1) {
      arr[idx] = key;
    } else if (key === 'check') {
      // Validate row
      const multiplicandStr = problemDetails.multiplicand.toString().padStart(2, '0');
      const multiplier = problemDetails.multiplier;
      const units = parseInt(multiplicandStr[1]);
      const tens = parseInt(multiplicandStr[0]);
      const unitsResult = (units * multiplier).toString().padStart(width, '0');
      const tensResult = (tens * multiplier * 10).toString().padStart(width, '0');
      const sumResult = (problemDetails.multiplicand * multiplier).toString().padStart(width, '0');
      let correct = true;
      if (row === 'units') {
        for (let i = 0; i < width; i++) {
          if (arr[i] !== unitsResult[i]) { errArr[i] = true; correct = false; }
        }
      } else if (row === 'tens') {
        for (let i = 0; i < width; i++) {
          if (arr[i] !== tensResult[i]) { errArr[i] = true; correct = false; }
        }
      } else if (row === 'sum') {
        for (let i = 0; i < width; i++) {
          if (arr[i] !== sumResult[i]) { errArr[i] = true; correct = false; }
        }
      }
      newErrors[row] = errArr;
      setColErrors(newErrors);
      if (correct) {
        if (stepCol < 2) setStepCol(stepCol + 1);
        else { showFeedback({type:'correct',message:'¡Multiplicación correcta!'}); onAttempt(true); }
      } else {
        showFeedback({type:'incorrect',message:'Revisa tu cálculo.'});
        setIsAttemptPending(false);
      }
      return;
    }
    newInputs[row] = arr;
    newErrors[row] = errArr.map(() => false);
    setColInputs(newInputs);
    setColErrors(newErrors);
  }, [problemDetails, colInputs, colErrors, stepCol, showFeedback, onAttempt, isAttemptPending]);

  useEffect(() => {
    if (isStepByStepSimple) {
      registerKeypadHandler(handleColKeypad);
      return () => registerKeypadHandler(null);
    }
  }, [registerKeypadHandler, handleColKeypad, isStepByStepSimple]);

  // We're now using the grid-based layout and directly rendering input cells in the grid
  // This old renderer is no longer used, but keeping for reference
  /*
  const renderColInputRow = (arr: string[], errArr: boolean[], active: boolean, numCells: number, rowType: 'units' | 'tens' | 'sum') => {
    // Only render the rightmost numCells input boxes, pad left with empty space
    const pad = arr.length - numCells;
    return (
      <div className="flex justify-end">
        {Array.from({length: pad}).map((_, i) => (
          <div key={`pad-${i}`} className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5" />
        ))}
        {arr.slice(pad).map((v, i) => (
          <InputDigitBox 
            key={i} 
            value={v} 
            isActive={active && v === ''} 
            isError={errArr[pad + i]} 
            onClick={() => {
              // Always set the current step to the row that was clicked
              setStepCol(rowType === 'units' ? 0 : rowType === 'tens' ? 1 : 2);
              // Focus logic: set empty cell to ''
              const newArr = [...arr];
              newArr[pad + i] = '';
              setColInputs(prev => ({...prev, [rowType]: newArr}));
            }} 
            className={active ? '' : 'opacity-60'} 
          />
        ))}
      </div>
    );
  };
  */

  const StepByStepContent: React.FC = () => {
    if (!problemDetails) return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    const width = problemDetails.numDigitsFinalProduct;
    const multiplicandStr = problemDetails.multiplicand.toString().padStart(width, ' ');
    const multiplierStr = problemDetails.multiplier.toString().padStart(width, ' ');
    // Calculate number of digits for each row
    const multiplicand = problemDetails.multiplicand;
    const multiplier = problemDetails.multiplier;
    const units = parseInt(multiplicand.toString().padStart(2, '0')[1]);
    const tens = parseInt(multiplicand.toString().padStart(2, '0')[0]);
    const unitsResult = (units * multiplier).toString();
    const tensResult = (tens * multiplier * 10).toString();
    const sumResult = (multiplicand * multiplier).toString();
    // Number of input cells for each row
    const unitsCells = unitsResult === '0' ? 1 : unitsResult.length;
    const tensCells = tensResult === '0' ? 1 : tensResult.length;
    const sumCells = sumResult.length;
    return (
      <div className="flex flex-col items-center w-full max-w-md p-3 space-y-2 mt-4 relative">
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        
        <button 
          onClick={() => setShowHelp(true)} 
          className="mb-2 px-3 py-1.5 bg-sky-500 text-white text-xs rounded-md hover:bg-sky-600 transition-colors shadow flex items-center"
        >
          <span className="mr-1">?</span> ¿Cómo era?
        </button>
        
        <div className="w-full h-96 border rounded-lg overflow-hidden relative">
          <DrawingCanvas ref={drawingCanvasRef} className="absolute inset-0 z-0" />
          
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="font-mono text-slate-700 w-full text-center bg-white bg-opacity-70 p-2 rounded">
              {/* Grid for vertical alignment */}
              <div className="grid grid-cols-1 gap-1 max-w-xs mx-auto">
                {/* Single table-like grid for perfect alignment */}
                <div className="grid" style={{
                  gridTemplateColumns: `auto repeat(${width}, 3rem)`,
                  justifyContent: 'center'
                }}>
                  {/* Multiplicand row - right-aligned */}
                  <div className="contents">
                    <div className="flex justify-end items-center"></div>
                    {/* Extract the actual digits (ignoring leading spaces) */}
                    {(() => {
                      const trimmedMultiplicandStr = multiplicandStr.trimStart();
                      // Create empty cells for padding
                      const emptyCells = Array(width - trimmedMultiplicandStr.length).fill(null).map((_, i) => (
                        <div key={`multiplicand-empty-${i}`} className="flex justify-center">
                          <div className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5"></div>
                        </div>
                      ));
                      // Create cells for actual digits
                      const digitCells = trimmedMultiplicandStr.split('').map((char, i) => (
                        <div key={`multiplicand-${i}`} className="flex justify-center">
                          <DigitDisplayBox digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                        </div>
                      ));
                      // Return empty cells followed by digit cells for right alignment
                      return [...emptyCells, ...digitCells];
                    })()}
                  </div>

                  {/* Multiplier row with × sign - right-aligned */}
                  <div className="contents">
                    <div className="flex justify-end items-center">
                      <span className="self-center text-3xl sm:text-4xl">×</span>
                    </div>
                    {/* Extract the actual digits (ignoring leading spaces) */}
                    {(() => {
                      const trimmedMultiplierStr = multiplierStr.trimStart();
                      // Create empty cells for padding
                      const emptyCells = Array(width - trimmedMultiplierStr.length).fill(null).map((_, i) => (
                        <div key={`multiplier-empty-${i}`} className="flex justify-center">
                          <div className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5"></div>
                        </div>
                      ));
                      // Create cells for actual digits
                      const digitCells = trimmedMultiplierStr.split('').map((char, i) => (
                        <div key={`multiplier-${i}`} className="flex justify-center">
                          <DigitDisplayBox digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                        </div>
                      ));
                      // Return empty cells followed by digit cells for right alignment
                      return [...emptyCells, ...digitCells];
                    })()}
                  </div>
                  
                  {/* Horizontal line */}
                  <div className="col-span-full border-t-2 border-slate-600 mt-1 mb-2"></div>
                </div>
                
                {/* Grid for the multiplication steps */}
                <div className="grid" style={{
                  gridTemplateColumns: `auto repeat(${width}, 3rem)`,
                  justifyContent: 'center',
                  gridRowGap: '0.5rem'
                }}>
                  {/* Units row */}
                  <div className="contents">
                    <div className="flex justify-end items-center"></div>
                    {Array(width).fill(null).map((_, idx) => {
                      const cellIndex = width - 1 - idx;
                      const isValidCell = cellIndex < unitsCells;
                      
                      const value = isValidCell && cellIndex < colInputs.units.length ? 
                        colInputs.units[colInputs.units.length - 1 - idx] : '';
                      const isError = isValidCell && cellIndex < colErrors.units.length ? 
                        colErrors.units[colErrors.units.length - 1 - idx] : false;
                      
                      return (
                        <div key={`units-${idx}`} className="flex justify-center">
                          {isValidCell ? (
                            <InputDigitBox
                              value={value}
                              isActive={stepCol === 0 && value === ''}
                              isError={isError}
                              onClick={() => {
                                setStepCol(0);
                                const newArr = [...colInputs.units];
                                const adjustedIdx = colInputs.units.length - 1 - idx;
                                if (adjustedIdx >= 0) newArr[adjustedIdx] = '';
                                setColInputs(prev => ({...prev, units: newArr}));
                              }}
                              className={stepCol === 0 ? '' : 'opacity-60'}
                            />
                          ) : (
                            <div className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Plus sign */}
                  <div className="contents">
                    <div className="flex justify-end items-center">
                      <span className="text-2xl font-bold text-slate-700">+</span>
                    </div>
                    {Array(width).fill(null).map((_, idx) => {
                      const cellIndex = width - 1 - idx;
                      const isValidCell = cellIndex < tensCells;
                      
                      const value = isValidCell && cellIndex < colInputs.tens.length ? 
                        colInputs.tens[colInputs.tens.length - 1 - idx] : '';
                      const isError = isValidCell && cellIndex < colErrors.tens.length ? 
                        colErrors.tens[colErrors.tens.length - 1 - idx] : false;
                      
                      return (
                        <div key={`tens-${idx}`} className="flex justify-center">
                          {isValidCell ? (
                            <InputDigitBox
                              value={value}
                              isActive={stepCol === 1 && value === ''}
                              isError={isError}
                              onClick={() => {
                                setStepCol(1);
                                const newArr = [...colInputs.tens];
                                const adjustedIdx = colInputs.tens.length - 1 - idx;
                                if (adjustedIdx >= 0) newArr[adjustedIdx] = '';
                                setColInputs(prev => ({...prev, tens: newArr}));
                              }}
                              className={stepCol === 1 ? '' : 'opacity-60'}
                            />
                          ) : (
                            <div className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Horizontal line */}
                  <div className="col-span-full border-t-2 border-slate-600 mt-1 mb-2"></div>
                  
                  {/* Sum row */}
                  <div className="contents">
                    <div className="flex justify-end items-center"></div>
                    {Array(width).fill(null).map((_, idx) => {
                      const cellIndex = width - 1 - idx;
                      const isValidCell = cellIndex < sumCells;
                      
                      const value = isValidCell && cellIndex < colInputs.sum.length ? 
                        colInputs.sum[colInputs.sum.length - 1 - idx] : '';
                      const isError = isValidCell && cellIndex < colErrors.sum.length ? 
                        colErrors.sum[colErrors.sum.length - 1 - idx] : false;
                      
                      return (
                        <div key={`sum-${idx}`} className="flex justify-center">
                          {isValidCell ? (
                            <InputDigitBox
                              value={value}
                              isActive={stepCol === 2 && value === ''}
                              isError={isError}
                              onClick={() => {
                                setStepCol(2);
                                const newArr = [...colInputs.sum];
                                const adjustedIdx = colInputs.sum.length - 1 - idx;
                                if (adjustedIdx >= 0) newArr[adjustedIdx] = '';
                                setColInputs(prev => ({...prev, sum: newArr}));
                              }}
                              className={stepCol === 2 ? '' : 'opacity-60'}
                            />
                          ) : (
                            <div className="w-10 h-14 sm:w-12 sm:h-16 mx-0.5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => drawingCanvasRef.current?.clearCanvas()} 
          className="mt-2 p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
        >
          Limpiar Lienzo
        </button>
      </div>
    );
  };

  const MainContent: React.FC = () => {
    if (isStepByStepSimple) {
      return <StepByStepContent />;
    }
    
    if (!problemDetails) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }

    const { 
        multiplicand, multiplier, 
        numDigitsIntermediate1, numDigitsIntermediate2, numDigitsFinalProduct,
        entryOrderIntermediate1, entryOrderIntermediate2, entryOrderFinalProduct,
        problemWidthChars
    } = problemDetails;

    const multiplicandStr = multiplicand.toString().padStart(problemWidthChars, ' ');
    const multiplierStr = multiplier.toString().padStart(problemWidthChars, ' ');

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-md p-3 space-y-1 mt-4">
        <div className="font-mono text-slate-700 w-full" style={{ minWidth: `${problemWidthChars * 3.5}rem` }}>
            <div className="flex justify-end pr-1"> 
              <div className="flex">
                {/* Use a more explicit right-alignment approach */}
                {(() => {
                  const trimmedMultiplicandStr = multiplicandStr.trimStart();
                  return trimmedMultiplicandStr.split('').map((char, idx) => (
                    <DigitDisplayBox key={`mplicand-${idx}`} digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                  ));
                })()}
              </div>
            </div>
            <div className="flex justify-end items-center pr-1"> 
                <span className="mr-2 self-center text-3xl sm:text-4xl">×</span>
                <div className="flex">
                  {(() => {
                    const trimmedMultiplierStr = multiplierStr.trimStart();
                    return trimmedMultiplierStr.split('').map((char, idx) => (
                      <DigitDisplayBox key={`mplier-${idx}`} digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                    ));
                  })()}
                </div>
            </div>
            <div className="flex justify-end pr-1">
                 <div className="border-t-2 border-slate-600 mt-1" style={{width: `calc(${problemWidthChars} * (2.5rem + 0.25rem * 2))`}}></div>
            </div>

            {multiplierDigitCount === 2 ?
                renderInputBoxesLine(userInput.intermediate1, numDigitsIntermediate1, 'intermediate1', entryOrderIntermediate1, intermediate1DigitErrors)
                : renderInputBoxesLine(userInput.intermediate1, numDigitsIntermediate1, 'intermediate1', entryOrderIntermediate1, intermediate1DigitErrors)
            }
            {multiplierDigitCount === 2 && renderInputBoxesLine(userInput.intermediate2, numDigitsIntermediate2, 'intermediate2', entryOrderIntermediate2, intermediate2DigitErrors, true)}
            
            {multiplierDigitCount === 2 && (numDigitsIntermediate1 > 0 || numDigitsIntermediate2 > 0) && (
                <div className="flex justify-end pr-1">
                    <div className="border-t-2 border-slate-600 mt-1" style={{width: `calc(${problemWidthChars} * (2.5rem + 0.25rem * 2))`}}></div>
                </div>
            )}
            
            {multiplierDigitCount === 2 && renderInputBoxesLine(userInput.finalProduct, numDigitsFinalProduct, 'finalProduct', entryOrderFinalProduct, finalProductDigitErrors)}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
