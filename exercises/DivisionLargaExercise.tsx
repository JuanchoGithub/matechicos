
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ExerciseScaffoldApi } from '../types'; 
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType } from '../types';
import { Icons } from '../components/icons';
import { getRandomInt } from '../utils'; 

type KeypadHandler = (key: string) => void;

interface DivisionLargaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: KeypadHandler | null) => void;
}

type FocusablePart = 
    | { type: 'quotient'; visualDigitIndexInQuotientRow: number } 
    | { type: 'product'; stepIndex: number; visualDigitIndexInLine: number } 
    | { type: 'subtraction'; stepIndex: number; visualDigitIndexInLine: number }; 

interface StepCalculation {
    partialDividendString: string; 
    quotientDigit: string;   
    product: string;         
    subtractionResult: string; 
    originalDividendIndexCovered: number; 
}

interface ProblemDetails {
    dividend: number;
    divisor: number;
    correctQuotient: string;
    allSteps: StepCalculation[]; 
    numQuotientDigits: number;
    dividendStrLength: number; 
    quotientVisualMap: (number | null)[]; 
    initialProblemWidthChars: number; // Width based on initial dividend, divisor, quotient
}

interface UserInputState {
    quotient: string[]; 
    products: string[][]; 
    subtractions: string[][];  
}

const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-start z-50 pt-12 pb-6 px-0.5 md:pr-[calc(20rem+0.125rem)]" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-5 max-w-lg w-full max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-lg sm:text-xl font-semibold text-sky-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl font-bold p-1" aria-label="Cerrar ayuda">
            &times;
          </button>
        </div>
        <div className="text-slate-700 space-y-3 leading-relaxed text-sm overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

const InputDigitBox: React.FC<{ 
    value: string; 
    isActive?: boolean; 
    isError?: boolean; 
    onClick?: () => void; 
    className?: string;
    placeholder?: string;
}> = ({ value, isActive, isError, onClick, className = "", placeholder="_" }) => {
  // Use consistent styling for all input boxes (remove isQuotient special treatment)
  let boxSpecificClass = 'border-slate-300 bg-white';
  if (isActive) boxSpecificClass = 'border-sky-500 ring-2 ring-sky-300 bg-sky-50';
  else if (isError) boxSpecificClass = 'border-red-400 bg-red-100';
  
  const displayValue = value || placeholder;
  const valueClasses = value 
    ? (isError && !isActive ? 'text-red-600' : 'text-slate-800') 
    : 'text-slate-500 font-medium';

  return (
    <div
      className={`w-8 h-12 sm:w-10 sm:h-14 border-2 rounded-md flex items-center justify-center text-xl sm:text-2xl font-bold mx-px tabular-nums ${boxSpecificClass} ${valueClasses} ${className} transition-colors duration-150`}
      onClick={onClick}
      role={onClick ? "button" : "cell"}
      tabIndex={onClick ? 0 : -1}
      aria-label={onClick ? `Casilla de entrada, valor actual: ${value || 'vacío'}` : `Dígito mostrado: ${value}`}
    >
      {displayValue}
    </div>
  );
};

const StaticDigitBox: React.FC<{ digitChar: string; className?: string }> = ({ digitChar, className = "" }) => (
  <div className={`w-8 h-12 sm:w-10 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold mx-px tabular-nums text-slate-700 ${className}`}>
    {digitChar === ' ' ? '\u00A0' : digitChar}
  </div>
);


export const DivisionLargaExercise: React.FC<DivisionLargaExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
    const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);
    const [userInputs, setUserInputs] = useState<UserInputState>({ quotient: [], products: [], subtractions: [] });
    const [currentFocus, setCurrentFocus] = useState<FocusablePart | null>(null); 
    const [currentEntryStepForNumber, setCurrentEntryStepForNumber] = useState<number>(0); 
    
    const [digitErrorFlags, setDigitErrorFlags] = useState<{quotient: boolean[], products: boolean[][], subtractions: boolean[][]}>({quotient: [], products: [[]], subtractions: [[]]});
    const [showHelp, setShowHelp] = useState(false);
    
    const {
        dividendDigitCount = 2, 
        divisorDigitCount = 1,  
        exactDivision = true,   
    } = exercise.data || {};

    const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
    const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

    useEffect(() => {
      if (showHelp) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
      return () => { 
          document.body.style.overflow = 'auto';
      };
    }, [showHelp]);

    const generateProblemDetailsInternal = useCallback((dividend: number, divisor: number): ProblemDetails => {
        const dividendStr = dividend.toString();
        const allSteps: StepCalculation[] = [];
        let calculatedQuotient = "";
        let currentRemainder = 0;
        let currentDividendSliceDigitsStr = ""; 
    
        for (let i = 0; i < dividendStr.length; i++) {
            currentDividendSliceDigitsStr += dividendStr[i];
            currentRemainder = parseInt(currentDividendSliceDigitsStr, 10);
    
            if (currentRemainder >= divisor || (calculatedQuotient.length > 0 && currentDividendSliceDigitsStr.length > 0 && currentDividendSliceDigitsStr !== "0")) {
                const quotientDigitVal = Math.floor(currentRemainder / divisor);
                const productVal = quotientDigitVal * divisor;
                const subtractionResultVal = currentRemainder - productVal;
                
                calculatedQuotient += quotientDigitVal.toString();
                
                allSteps.push({
                    partialDividendString: currentDividendSliceDigitsStr, 
                    quotientDigit: quotientDigitVal.toString(),
                    product: productVal.toString(),
                    subtractionResult: subtractionResultVal.toString(),
                    originalDividendIndexCovered: i 
                });
                currentRemainder = subtractionResultVal;
                currentDividendSliceDigitsStr = currentRemainder > 0 ? currentRemainder.toString() : "";
            } else if (calculatedQuotient.length > 0 || (i === dividendStr.length -1 && dividend < divisor) ) { 
                 calculatedQuotient += "0"; 
                 allSteps.push({ 
                    partialDividendString: currentDividendSliceDigitsStr, 
                    quotientDigit: "0",
                    product: "0", 
                    subtractionResult: currentDividendSliceDigitsStr, 
                    originalDividendIndexCovered: i 
                });
                 currentRemainder = parseInt(currentDividendSliceDigitsStr, 10); // Keep remainder if it was less than divisor
                 currentDividendSliceDigitsStr = currentRemainder > 0 ? currentRemainder.toString() : "";
            }
        }
        
        if (dividend === 0 && divisor > 0) {
          calculatedQuotient = "0";
          if (allSteps.length === 0) { 
            allSteps.push({ partialDividendString: "0", quotientDigit: "0", product: "0", subtractionResult: "0", originalDividendIndexCovered: 0});
          }
        } else if (calculatedQuotient.length === 0 && dividend > 0 && dividend < divisor && allSteps.length === 0) { 
           calculatedQuotient = "0";
            allSteps.push({ 
                partialDividendString: dividendStr, 
                quotientDigit: "0", 
                product: "0", 
                subtractionResult: dividendStr, 
                originalDividendIndexCovered: dividendStr.length -1 
            });
        }
        if(calculatedQuotient.length === 0 && dividend >= divisor) { // Handle cases like 5/5 = 1, loop might not push step
           const qDigit = Math.floor(dividend/divisor);
           const pVal = qDigit * divisor;
           const sVal = dividend - pVal;
           calculatedQuotient = qDigit.toString();
            allSteps.push({
                partialDividendString: dividendStr,
                quotientDigit: qDigit.toString(),
                product: pVal.toString(),
                subtractionResult: sVal.toString(),
                originalDividendIndexCovered: dividendStr.length -1
            });
        }


        const qVisualMap = Array(dividendStr.length).fill(null);
        let qActualIdx = 0;
        
        for (const step of allSteps) {
            const quotientRelatedDividendIndex = step.originalDividendIndexCovered;
            if (qActualIdx < calculatedQuotient.length) {
                qVisualMap[quotientRelatedDividendIndex] = qActualIdx;
                qActualIdx++;
            }
        }
        
        const initialWidth = Math.max(dividendStr.length, divisor.toString().length, Math.max(1, calculatedQuotient.length));
        return { dividend, divisor, correctQuotient: calculatedQuotient, allSteps, numQuotientDigits: calculatedQuotient.length, dividendStrLength: dividendStr.length, quotientVisualMap: qVisualMap, initialProblemWidthChars: initialWidth };
    }, []);
    
    const initializeNewProblem = useCallback(() => {
        let dividend = 0, divisor = 1, quotient = 0;
        
        do {
            const minDiv = Math.max(1, Math.pow(10, divisorDigitCount - 1)); 
            const maxDiv = Math.pow(10, divisorDigitCount) - 1;
            divisor = getRandomInt(minDiv, maxDiv);

            const minDividend = dividendDigitCount === 1 ? 0 : Math.pow(10, dividendDigitCount - 1) ; 
            const maxDividend = Math.pow(10, dividendDigitCount) - 1;
            
            if (exactDivision) {
                const minQuotientApprox = Math.floor(minDividend / divisor);
                const maxQuotientApprox = Math.floor(maxDividend / divisor);
                quotient = getRandomInt(Math.max(0, minQuotientApprox), Math.max(1,maxQuotientApprox)); 
                dividend = quotient * divisor;
                 if (dividend === 0 && divisor > 0) quotient = 0; 
            } else {
                 dividend = getRandomInt(minDividend, maxDividend);
            }
        } while (dividend.toString().length > dividendDigitCount || (exactDivision && dividend % divisor !== 0 && !(dividend === 0 && divisor > 0) ));
        

        const details = generateProblemDetailsInternal(dividend, divisor);
        setProblemDetails(details);
        
        setUserInputs({
            quotient: Array(details.dividendStrLength).fill(''), 
            products: details.allSteps.map(step => Array(Math.max(1, step.product.length)).fill('')),
            subtractions: details.allSteps.map(step => Array(Math.max(1, step.subtractionResult.length)).fill('')),
        });
        setDigitErrorFlags({
            quotient: Array(details.dividendStrLength).fill(false),
            products: details.allSteps.map(step => Array(Math.max(1,step.product.length)).fill(false)),
            subtractions: details.allSteps.map(step => Array(Math.max(1,step.subtractionResult.length)).fill(false)),
        });
        
        const firstQuotientEntryVisualIndex = details.quotientVisualMap.findIndex(qIdx => qIdx === 0);
        setCurrentFocus({ type: 'quotient', visualDigitIndexInQuotientRow: firstQuotientEntryVisualIndex !== -1 ? firstQuotientEntryVisualIndex : 0 });
        setCurrentEntryStepForNumber(0); 
        showFeedback(null);
    }, [dividendDigitCount, divisorDigitCount, exactDivision, generateProblemDetailsInternal, showFeedback]);

    useEffect(() => {
        initializeNewProblem();
    }, [initializeNewProblem, exercise.id]);

    useEffect(() => {
        if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
            initializeNewProblem();
        }
        prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
    }, [advanceToNextChallengeSignal, initializeNewProblem]);

    const verifyAnswer = useCallback(() => {
        if (!problemDetails) return;
        let anyError = false;
        const { correctQuotient, allSteps, quotientVisualMap, numQuotientDigits } = problemDetails;
        
        let userQuotientString = "";
        for(let i=0; i < quotientVisualMap.length; i++){
            const actualQIdx = quotientVisualMap[i];
            if(actualQIdx !== null && i < userInputs.quotient.length){ 
                userQuotientString += (userInputs.quotient[i] || '_'); 
            }
        }
        userQuotientString = userQuotientString.replace(/_/g, ''); 
        if (numQuotientDigits === 0 && userQuotientString === "") userQuotientString = "0"; 
        if (correctQuotient === "0" && userQuotientString === "") userQuotientString = "0";

        const newDigitErrors = {
            quotient: userInputs.quotient.map((digit, visualIdx) => {
                const actualQIdx = quotientVisualMap[visualIdx];
                if (actualQIdx === null) return false; 
                const correctQDigit = correctQuotient[actualQIdx] || '';
                return (digit || '') !== correctQDigit; 
            }),
            products: userInputs.products.map((pDigits, stepIdx) => {
                if (stepIdx >= allSteps.length) return pDigits.map(() => false);
                const correctP = allSteps[stepIdx].product.padStart(pDigits.length, '0');
                return pDigits.map((digit, digitIdx) => (digit||'') !== correctP[digitIdx]);
            }),
            subtractions: userInputs.subtractions.map((sDigits, stepIdx) => {
                if (stepIdx >= allSteps.length) return sDigits.map(() => false);
                const correctS = allSteps[stepIdx].subtractionResult.padStart(sDigits.length, '0');
                return sDigits.map((digit, digitIdx) => (digit||'') !== correctS[digitIdx]);
            }),
        };
    
        if (userQuotientString !== correctQuotient) anyError = true;
        newDigitErrors.products.forEach((errors) => { if(errors.some(e => e)) anyError = true; });
        newDigitErrors.subtractions.forEach((errors) => { if(errors.some(e => e)) anyError = true; });
        
        setDigitErrorFlags(newDigitErrors);
    
        if (!anyError) {
            onAttempt(true);
        } else {
            showFeedback({ type: 'incorrect', message: 'Algunos números no son correctos. ¡Revisa los pasos!' });
            onAttempt(false); 
        }
    }, [problemDetails, userInputs, showFeedback, onAttempt]);

   const handleKeyPress = useCallback((key: string) => {
    if (!problemDetails || !currentFocus) return;
    showFeedback(null);

    const tempErrors = JSON.parse(JSON.stringify(digitErrorFlags));
    const tempUserInputs = JSON.parse(JSON.stringify(userInputs));

    let targetArray: string[];
    let numVisualDigitsInCurrentLine: number = 0; 
    let currentDigitLogicalIndex: number = currentEntryStepForNumber;
    let visualIndexOfCurrentDigitBox: number;

    switch (currentFocus.type) {
        case 'quotient':
            targetArray = tempUserInputs.quotient;
            visualIndexOfCurrentDigitBox = currentFocus.visualDigitIndexInQuotientRow;
            if (visualIndexOfCurrentDigitBox < tempErrors.quotient.length) tempErrors.quotient[visualIndexOfCurrentDigitBox] = false;
            break;
        case 'product':
            if (!tempUserInputs.products[currentFocus.stepIndex]) tempUserInputs.products[currentFocus.stepIndex] = Array(Math.max(1, problemDetails.allSteps[currentFocus.stepIndex].product.length)).fill('');
            targetArray = tempUserInputs.products[currentFocus.stepIndex];
            numVisualDigitsInCurrentLine = targetArray.length;
            visualIndexOfCurrentDigitBox = currentDigitLogicalIndex; 
            if (tempErrors.products[currentFocus.stepIndex]?.[visualIndexOfCurrentDigitBox]) tempErrors.products[currentFocus.stepIndex][visualIndexOfCurrentDigitBox] = false;
            break;
        case 'subtraction':
            if (!tempUserInputs.subtractions[currentFocus.stepIndex]) tempUserInputs.subtractions[currentFocus.stepIndex] = Array(Math.max(1, problemDetails.allSteps[currentFocus.stepIndex].subtractionResult.length)).fill('');
            targetArray = tempUserInputs.subtractions[currentFocus.stepIndex];
            numVisualDigitsInCurrentLine = targetArray.length;
            visualIndexOfCurrentDigitBox = currentDigitLogicalIndex; 
            if (tempErrors.subtractions[currentFocus.stepIndex]?.[visualIndexOfCurrentDigitBox]) tempErrors.subtractions[currentFocus.stepIndex][visualIndexOfCurrentDigitBox] = false;
            break;
        default: return;
    }
    setDigitErrorFlags(tempErrors);

    if (key === 'check') { verifyAnswer(); return; }

    if (key === 'backspace') {
        if (visualIndexOfCurrentDigitBox < targetArray.length && targetArray[visualIndexOfCurrentDigitBox] !== '') {
            targetArray[visualIndexOfCurrentDigitBox] = '';
        } else if (currentFocus.type !== 'quotient' && currentDigitLogicalIndex > 0) {
            setCurrentEntryStepForNumber(prev => prev - 1);
        }
        setUserInputs(tempUserInputs);
    } else if (/\d/.test(key)) {
        if (currentFocus.type === 'quotient') {
            if (problemDetails.quotientVisualMap[visualIndexOfCurrentDigitBox] !== null && visualIndexOfCurrentDigitBox < targetArray.length) {
                targetArray[visualIndexOfCurrentDigitBox] = key;
                const currentStepIndexOfQuotient = problemDetails.quotientVisualMap[visualIndexOfCurrentDigitBox];
                if (currentStepIndexOfQuotient !== null && currentStepIndexOfQuotient < problemDetails.allSteps.length) {
                     const productLen = problemDetails.allSteps[currentStepIndexOfQuotient].product.length;
                    setCurrentFocus({ type: 'product', stepIndex: currentStepIndexOfQuotient, visualDigitIndexInLine: Math.max(0, productLen -1) });
                    setCurrentEntryStepForNumber(Math.max(0, productLen -1)); 
                }
            }
        } else { 
            if (currentDigitLogicalIndex < numVisualDigitsInCurrentLine && visualIndexOfCurrentDigitBox < targetArray.length) {
                targetArray[visualIndexOfCurrentDigitBox] = key;
                if (currentDigitLogicalIndex < numVisualDigitsInCurrentLine - 1) {
                    setCurrentEntryStepForNumber(prev => prev + 1);
                } else { 
                    if (currentFocus.type === 'product') {
                        const subLen = problemDetails.allSteps[currentFocus.stepIndex].subtractionResult.length;
                        setCurrentFocus({ type: 'subtraction', stepIndex: currentFocus.stepIndex, visualDigitIndexInLine: Math.max(0, subLen -1) });
                        setCurrentEntryStepForNumber(Math.max(0, subLen-1));
                    } else if (currentFocus.type === 'subtraction') {
                        const nextStepIdx = currentFocus.stepIndex + 1;
                        if (nextStepIdx < problemDetails.allSteps.length) {
                            const nextVisualQuotientIdx = problemDetails.quotientVisualMap.findIndex(qMapIdx => qMapIdx === nextStepIdx);
                            if (nextVisualQuotientIdx !== -1) {
                                setCurrentFocus({ type: 'quotient', visualDigitIndexInQuotientRow: nextVisualQuotientIdx });
                                // No need to set currentEntryStepForNumber for quotient as it's directly tied to visualDigitIndexInQuotientRow
                            }
                        }
                    }
                }
            }
        }
        setUserInputs(tempUserInputs);
    }
}, [problemDetails, currentFocus, userInputs, currentEntryStepForNumber, verifyAnswer, showFeedback, digitErrorFlags]);



    useEffect(() => {
        registerKeypadHandler(handleKeyPress);
        return () => registerKeypadHandler(null);
    }, [registerKeypadHandler, handleKeyPress]);

    const ComoEraContent: React.FC = () => (
      <>
        <p className="mb-2">¡Hola! Dividir puede parecer difícil, ¡pero es como repartir caramelos en partes iguales!</p>
        <p className="font-semibold">Ejemplo: Dividamos 78 caramelos entre 3 amigos (78 ÷ 3)</p>
        
        <div className="my-3 p-2 bg-slate-100 rounded text-sm">
          <p className="font-semibold">Paso 1: Mirar el primer número del dividendo (78)</p>
          <p>Es el 7. ¿Cuántas veces entra el 3 en el 7 sin pasarse? ¡Entra 2 veces! (porque 2 × 3 = 6). Escribe el 2 arriba del 7.</p>
          <div className="font-mono whitespace-pre bg-slate-200 p-1 my-1 rounded text-xs sm:text-sm overflow-x-auto">
            {'  2  \n'}
            {' --- \n'}
            {'3|78 '}
          </div>
        </div>

        <div className="my-3 p-2 bg-slate-100 rounded text-sm">
          <p className="font-semibold">Paso 2: Multiplicar y restar</p>
          <p>2 (del cociente) × 3 (divisor) = 6. Ponemos el 6 debajo del 7 y restamos: 7 - 6 = 1.</p>
           <div className="font-mono whitespace-pre bg-slate-200 p-1 my-1 rounded text-xs sm:text-sm overflow-x-auto">
            {'  2  \n'}
            {' --- \n'}
            {'3|78 \n'}
            {' -6  \n'}
            {' --- \n'}
            {'  1  '}
          </div>
        </div>

        <div className="my-3 p-2 bg-slate-100 rounded text-sm">
          <p className="font-semibold">Paso 3: Bajar el siguiente número</p>
          <p>Bajamos el 8 (del 78) al lado del 1. Ahora tenemos 18.</p>
           <div className="font-mono whitespace-pre bg-slate-200 p-1 my-1 rounded text-xs sm:text-sm overflow-x-auto">
            {'  2  \n'}
            {' --- \n'}
            {'3|78 \n'}
            {' -6↓ \n'}
            {' --- \n'}
            {'  18 '}
          </div>
        </div>
        
        <div className="my-3 p-2 bg-slate-100 rounded text-sm">
          <p className="font-semibold">Paso 4: Repetir con el nuevo número (18)</p>
          <p>¿Cuántas veces entra el 3 en el 18? ¡Entra 6 veces! (porque 6 × 3 = 18). Escribimos el 6 en el cociente, arriba del 8.</p>
          <div className="font-mono whitespace-pre bg-slate-200 p-1 my-1 rounded text-xs sm:text-sm overflow-x-auto">
            {'  26 \n'}
            {' ----\n'}
            {'3|78 \n'}
            {' -6↓ \n'}
            {' ----\n'}
            {'  18 '}
          </div>
        </div>

        <div className="my-3 p-2 bg-slate-100 rounded text-sm">
          <p className="font-semibold">Paso 5: Multiplicar y restar de nuevo</p>
          <p>6 (del cociente) × 3 (divisor) = 18. Restamos: 18 - 18 = 0.</p>
           <div className="font-mono whitespace-pre bg-slate-200 p-1 my-1 rounded text-xs sm:text-sm overflow-x-auto">
            {'  26 \n'}
            {' ----\n'}
            {'3|78 \n'}
            {' -6↓ \n'}
            {' ----\n'}
            {'  18 \n'}
            {' -18 \n'}
            {' ----\n'}
            {'   0 '}
          </div>
        </div>
        <p>¡Listo! 78 ÷ 3 = 26. A cada amigo le tocan 26 caramelos y no sobra ninguno (resto 0).</p>
        <p>¡Seguí practicando y te volverás un genio de las divisiones!</p>
      </>
    );


    const MainContent: React.FC = () => {
        if (!problemDetails || !currentFocus) return <div className="p-4 text-xl text-slate-600">Cargando división...</div>;
        const { dividend, divisor, allSteps, dividendStrLength, quotientVisualMap, initialProblemWidthChars } = problemDetails;
        
        const finalProblemWidthChars = useMemo(() => {
            let width = initialProblemWidthChars;
            allSteps.forEach((step, stepIndex) => {
                const productVisualLength = Math.max(1, step.product.length);
                const subtractionVisualLength = Math.max(1, step.subtractionResult.length);
                const isShiftedProduct = stepIndex > 0 && step.product !== "0";
                const isShiftedSubtraction = stepIndex > 0 && step.subtractionResult !== "0";
                const showArrow = stepIndex < allSteps.length - 1 && allSteps[stepIndex + 1].originalDividendIndexCovered > step.originalDividendIndexCovered;

                width = Math.max(width, 1 + productVisualLength + (isShiftedProduct ? 1 : 0));
                width = Math.max(width, subtractionVisualLength + (isShiftedSubtraction ? 1 : 0) + (showArrow ? 1 : 0));
            });
            return width;
        }, [problemDetails]);


        const dividendStrPadded = dividend.toString().padStart(finalProblemWidthChars, ' ');
        const divisorStr = divisor.toString();
        
        let quotientDisplayRow: React.ReactNode[] = [];
        for(let visualCol = 0; visualCol < finalProblemWidthChars; visualCol++){
            const dividendColIndex = finalProblemWidthChars - dividendStrLength + visualCol; 
            let actualQIdxMapped: number | null = null;

            if (dividendColIndex >= 0 && dividendColIndex < dividendStrLength) {
                 actualQIdxMapped = quotientVisualMap[dividendColIndex];
            }
            
            let isQuotientBoxActive = false;
            let hasErrorInQuotientBox = false;
            let valueInQuotientBox = '';
            let placeholderForQuotient = '\u00A0'; 

            if(actualQIdxMapped !== null && dividendColIndex < userInputs.quotient.length) { 
                 isQuotientBoxActive = currentFocus.type === 'quotient' && currentFocus.visualDigitIndexInQuotientRow === dividendColIndex;
                 hasErrorInQuotientBox = digitErrorFlags.quotient[dividendColIndex] && actualQIdxMapped !== null;
                 valueInQuotientBox = userInputs.quotient[dividendColIndex] || '';
                 placeholderForQuotient = '_'; 
            }
            
            quotientDisplayRow.push(
              actualQIdxMapped !== null ? 
                (<InputDigitBox 
                    key={`q-box-${visualCol}`} 
                    value={valueInQuotientBox} 
                    isActive={isQuotientBoxActive}
                    isError={hasErrorInQuotientBox}
                    onClick={() => {
                        if (actualQIdxMapped !== null && dividendColIndex < userInputs.quotient.length) {
                            setCurrentFocus({type: 'quotient', visualDigitIndexInQuotientRow: dividendColIndex});
                        }
                    }}
                    placeholder={placeholderForQuotient}
                />)
                :
                (<StaticDigitBox
                    key={`q-placeholder-${visualCol}`}
                    digitChar=" "
                    className="border-2 !border-transparent !bg-transparent"
                />)
            );
        }


        return (
            <div className="flex flex-col items-center justify-start text-center w-full max-w-md p-2 space-y-0.5 font-mono">
                 <button onClick={() => setShowHelp(true)} className="mb-3 px-3 py-1.5 bg-sky-500 text-white text-xs rounded-md hover:bg-sky-600 transition-colors shadow">
                    ¿Cómo era? 🤔
                </button>
                
                <div className="inline-grid" style={{ gridTemplateColumns: `${divisorStr.length * 2.5}rem auto 1fr`}}>
                    {/* Quotient Row */}
                    <div className="col-start-3 flex justify-end items-center">{quotientDisplayRow}</div>

                    {/* Divisor | Dividend Line */}
                    <div className="flex items-center justify-end pr-1 border-r-2 border-b-2 border-slate-600">
                       <span className="text-xl sm:text-2xl font-bold text-slate-700">{divisorStr}</span>
                    </div>
                    <div className="col-start-2 col-span-1 border-b-2 border-slate-600"> </div>
                    <div className="flex justify-end items-center pl-1 border-b-2 border-slate-600"> {/* Changed to justify-end */}
                        {dividendStrPadded.split('').map((digit, index) => ( <StaticDigitBox key={`dividend-digit-${index}`} digitChar={digit} /> ))}
                    </div>

                    {/* Steps */}
                    {allSteps.map((step, stepIndex) => {
                        const productDigitsCorrect = step.product.split('');
                        const subtractionResultDigitsCorrect = step.subtractionResult.split('');
                        
                        const productVisualLength = Math.max(1, productDigitsCorrect.length);
                        const subtractionVisualLength = Math.max(1, subtractionResultDigitsCorrect.length);
                        
                        const productShiftOffset = step.originalDividendIndexCovered + 1 - productVisualLength;
                        const numLeadingSpacesForProduct = Math.max(0, finalProblemWidthChars - (finalProblemWidthChars - productShiftOffset) - productVisualLength -1);

                        const subtractionShiftOffset = step.originalDividendIndexCovered + 1 - subtractionVisualLength;
                        const numLeadingSpacesForSubtraction = Math.max(0, finalProblemWidthChars - (finalProblemWidthChars - subtractionShiftOffset) - subtractionVisualLength);


                        const showBringDownArrow = stepIndex < problemDetails.allSteps.length - 1 &&
                                               problemDetails.allSteps[stepIndex + 1].originalDividendIndexCovered > step.originalDividendIndexCovered;

                        return (
                            <React.Fragment key={`step-frag-${stepIndex}`}>
                                {/* Product Line */}
                                <div className="col-start-3 flex justify-end items-center">
                                    {Array.from({length: numLeadingSpacesForProduct}).map((_, k) => <StaticDigitBox key={`prod-pad-lead-${stepIndex}-${k}`} digitChar=" " className="!border-transparent !bg-transparent" />)}
                                    <StaticDigitBox digitChar="-" className="text-red-500 font-bold !border-transparent !bg-transparent" />
                                    {Array.from({ length: productVisualLength }).map((_, digitLogicalIdx) => {
                                        const isActive = currentFocus.type === 'product' && currentFocus.stepIndex === stepIndex && currentEntryStepForNumber === digitLogicalIdx;
                                        const hasError = digitErrorFlags.products[stepIndex]?.[digitLogicalIdx];
                                        return (
                                            <InputDigitBox
                                                key={`product-${stepIndex}-digit-${digitLogicalIdx}`}
                                                value={userInputs.products[stepIndex]?.[digitLogicalIdx] || ''}
                                                isActive={isActive} isError={!!hasError}
                                                onClick={() => { setCurrentFocus({type: 'product', stepIndex, visualDigitIndexInLine: digitLogicalIdx}); setCurrentEntryStepForNumber(digitLogicalIdx); }}
                                            />);
                                    })}
                                    <StaticDigitBox digitChar=" " className="!border-transparent !bg-transparent"/>
                                </div>
                                {/* Horizontal Rule for Product */}
                                <div className="col-start-3 flex justify-end">
                                     {Array.from({length: numLeadingSpacesForProduct }).map((_, k) => <div key={`phr-pad-${stepIndex}-${k}`} className="w-8 sm:w-10 mx-px"></div>)}
                                    <div className="border-t-2 border-slate-500 mt-0.5" style={{ width: `calc(${productVisualLength + 1} * (2rem + 2px))` }}></div>
                                     <div className="w-8 sm:w-10 mx-px"></div> 
                                </div>
                                
                                {/* Subtraction Result Line */}
                                <div className="col-start-3 flex justify-end items-center">
                                     {Array.from({length: numLeadingSpacesForSubtraction}).map((_, k) => <StaticDigitBox key={`sub-pad-lead-${stepIndex}-${k}`} digitChar=" " className="!border-transparent !bg-transparent"/>)}
                                    {Array.from({ length: subtractionVisualLength }).map((_, digitLogicalIdx) => {
                                         const isActive = currentFocus.type === 'subtraction' && currentFocus.stepIndex === stepIndex && currentEntryStepForNumber === digitLogicalIdx;
                                         const hasError = digitErrorFlags.subtractions[stepIndex]?.[digitLogicalIdx];
                                        return (
                                            <InputDigitBox
                                                key={`subtraction-${stepIndex}-digit-${digitLogicalIdx}`}
                                                value={userInputs.subtractions[stepIndex]?.[digitLogicalIdx] || ''}
                                                isActive={isActive} isError={!!hasError}
                                                onClick={() => { setCurrentFocus({type: 'subtraction', stepIndex, visualDigitIndexInLine: digitLogicalIdx}); setCurrentEntryStepForNumber(digitLogicalIdx);}}
                                            />);
                                    })}
                                    {showBringDownArrow ? (
                                        <span key={`arrow-${stepIndex}`} className="text-red-500 font-bold text-xl sm:text-2xl flex items-center justify-center w-8 sm:w-10 h-12 sm:h-14 mx-px">↓</span>
                                    ) : (
                                        <StaticDigitBox key={`arrow-space-${stepIndex}`} digitChar=" " className="!border-transparent !bg-transparent"/> 
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                 <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo Dividir? (Método de la Caja)">
                    <ComoEraContent />
                </HelpModal>
            </div>
        );
    };
    return <MainContent />;
};
