
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Removed
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

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

    const numDigitsCurrentLine = 
        currentFocusTarget === 'intermediate1' ? problemDetails.numDigitsIntermediate1 :
        currentFocusTarget === 'intermediate2' ? problemDetails.numDigitsIntermediate2 :
        problemDetails.numDigitsFinalProduct;
    
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

  const MainContent: React.FC = () => {
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
                {multiplicandStr.split('').map((char, idx) => (
                  <DigitDisplayBox key={`mplicand-${idx}`} digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                ))}
              </div>
            </div>
            <div className="flex justify-end items-center pr-1"> 
                <span className="mr-2 self-center text-3xl sm:text-4xl">×</span>
                <div className="flex">
                  {multiplierStr.split('').map((char, idx) => (
                    <DigitDisplayBox key={`mplier-${idx}`} digitChar={char} className="bg-transparent border-transparent !text-slate-700" />
                  ))}
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
