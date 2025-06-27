
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad'; // Adjusted path
import { Exercise as ExerciseType, ExerciseScaffoldApi, PlaceValueKey } from '../../types'; // Adjusted path
import { Icons } from '../../components/icons'; // Adjusted path
import { ROD_CONFIG as PLACE_VALUE_CONFIG_ABACUS, PLACE_VALUES_ORDER_FOR_DISPLAY } from '../../components/abacusConstants'; // Use alias to avoid conflict and import correct constant

interface DescomposicionPolinomicaG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface ChallengeG4 {
  numberToDecompose: number;
  correctParts: number[]; 
}

const FACE_EMOJIS_DECOMP = ['🔢', '🤔', '🧐', '💡', '➕', '🧩'];

// --- Help Modal Component (similar to DivisionLargaExercise) ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => { 
        document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5" // Adjusted padding for left alignment
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="helpModalTitle"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" // Added md:ml-2 md:mr-auto for left alignment on larger screens
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-xl sm:text-2xl font-semibold text-sky-700">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-700 text-3xl sm:text-4xl font-bold p-1" 
            aria-label="Cerrar ayuda"
          >
            &times;
          </button>
        </div>
        <div className="text-slate-700 space-y-3 leading-relaxed text-sm sm:text-base overflow-y-auto flex-grow">
          {children}
        </div>
         <button 
            onClick={onClose} 
            className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center"
        >
            Entendido, ¡a resolver!
        </button>
      </div>
    </div>
  );
};

const ComoEraDescomposicionContent: React.FC = () => (
  <>
    <p className="font-semibold text-sky-600 text-lg">¡Hola! ¿Recordamos cómo descomponer un número?</p>
    <p>Descomponer un número en forma polinómica significa escribirlo como una <strong className="text-sky-600">suma</strong>, donde cada parte de la suma es el <strong className="text-sky-600">valor de una de sus cifras</strong>.</p>
    <p>Es como "desarmar" el número en pedacitos según cuánto vale cada cifra.</p>
    
    <div className="my-3 p-3 bg-sky-50 rounded-lg border border-sky-200">
      <p className="font-bold text-md text-sky-700">Veamos un ejemplo con el número 345.678:</p>
      <ol className="list-decimal list-inside space-y-1 mt-2 text-left">
        <li>
          <strong>Identificamos el valor de cada cifra:</strong>
          <ul className="list-disc list-inside ml-4 mt-1 text-xs sm:text-sm space-y-0.5">
            <li>El <strong>8</strong> está en las <strong>Unidades (U)</strong>, entonces vale <strong className="text-orange-600">8</strong>.</li>
            <li>El <strong>7</strong> está en las <strong>Decenas (D)</strong>, entonces vale <strong className="text-orange-600">70</strong> (siete decenas).</li>
            <li>El <strong>6</strong> está en las <strong>Centenas (C)</strong>, entonces vale <strong className="text-orange-600">600</strong> (seis centenas).</li>
            <li>El <strong>5</strong> está en las <strong>Unidades de Mil (UM)</strong>, vale <strong className="text-orange-600">5.000</strong> (cinco unidades de mil).</li>
            <li>El <strong>4</strong> está en las <strong>Decenas de Mil (DM)</strong>, vale <strong className="text-orange-600">40.000</strong> (cuarenta mil).</li>
            <li>El <strong>3</strong> está en las <strong>Centenas de Mil (CM)</strong>, vale <strong className="text-orange-600">300.000</strong> (trescientos mil).</li>
          </ul>
        </li>
        <li className="mt-2">
          <strong>Escribimos la suma de estos valores:</strong>
          <p className="mt-1 p-2 bg-white rounded-md shadow-sm text-center font-mono text-sky-700 text-sm sm:text-base">
            345.678 = 300.000 + 40.000 + 5.000 + 600 + 70 + 8
          </p>
        </li>
      </ol>
    </div>
    <p>¡Y listo! Así se descompone un número en forma polinómica. ¡Es como mostrar todos sus "ingredientes"!</p>
    
    <div className="my-3 p-3 bg-sky-50 rounded-lg border border-sky-200">
      <p className="font-bold text-md text-sky-700">Otro ejemplo más cortito: 2.703</p>
      <ul className="list-disc list-inside ml-4 mt-1 text-xs sm:text-sm space-y-0.5 text-left">
          <li>3 unidades = <strong className="text-orange-600">3</strong></li>
          <li>0 decenas = <strong className="text-orange-600">0</strong> (o no se escribe)</li>
          <li>7 centenas = <strong className="text-orange-600">700</strong></li>
          <li>2 unidades de mil = <strong className="text-orange-600">2.000</strong></li>
      </ul>
      <p className="mt-1 p-2 bg-white rounded-md shadow-sm text-center font-mono text-sky-700 text-sm sm:text-base">
        2.703 = 2.000 + 700 + 0 + 3
      </p>
      <p className="text-xs sm:text-sm text-slate-600">(O también: 2.000 + 700 + 3, ¡porque el cero no suma nada!)</p>
    </div>
    <p className="font-semibold text-sky-600">¡Ahora te toca a vos!</p>
  </>
);
// --- End Help Modal Content ---

export const DescomposicionPolinomicaG4Exercise: React.FC<DescomposicionPolinomicaG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeG4 | null>(null);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_DECOMP[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { minNumber = 100, maxNumber = 999999 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const decomposeNumberToArray = (num: number): number[] => {
    const parts: number[] = [];
    let factor = 1;
    let tempNum = num;
    if (num === 0) return [0]; 
    
    while (tempNum > 0) {
      const digit = tempNum % 10;
      if (digit > 0) {
        parts.unshift(digit * factor);
      } else if (factor === 1 && num % 10 === 0 && num > 0) { 
         parts.unshift(0);
      }
      tempNum = Math.floor(tempNum / 10);
      factor *= 10;
    }
    return parts.length > 0 ? parts : [0]; 
  };

  const generateNewChallenge = useCallback(() => {
    const num = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const parts = decomposeNumberToArray(num);
    setCurrentChallenge({ numberToDecompose: num, correctParts: parts });
    setUserInputs(Array(parts.length).fill(''));
    setActiveInputIndex(0);
    showFeedback(null);
    setIsAttemptPending(false);
    setCharacterEmoji(FACE_EMOJIS_DECOMP[Math.floor(Math.random() * FACE_EMOJIS_DECOMP.length)]);
  }, [minNumber, maxNumber, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) { 
      generateNewChallenge(); 
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userPartsNumbers = userInputs.map(s => parseInt(s, 10) || 0);
    
    const userSum = userPartsNumbers.reduce((acc, val) => acc + val, 0);
    const isSumCorrect = userSum === currentChallenge.numberToDecompose;
    
    let allPartsMatch = userPartsNumbers.length === currentChallenge.correctParts.length &&
                        userPartsNumbers.every((val, index) => val === currentChallenge.correctParts[index]);

    onAttempt(isSumCorrect && allPartsMatch); 
    if (isSumCorrect && allPartsMatch) {
        showFeedback({ type: 'correct', message: '¡Descomposición Correcta!' });
    } else if (isSumCorrect && !allPartsMatch) {
        showFeedback({ type: 'incorrect', message: `La suma es correcta, ¡pero la descomposición polinómica esperada era ${currentChallenge.correctParts.join(' + ')}!` });
        setIsAttemptPending(false);
    } else { 
        showFeedback({ type: 'incorrect', message: 'Revisa tu descomposición. La suma no es correcta.' }); 
        setIsAttemptPending(false); 
    }
  }, [currentChallenge, userInputs, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending || activeInputIndex >= userInputs.length) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') {
      setUserInputs(prev => { const newInputs = [...prev]; newInputs[activeInputIndex] = ''; return newInputs; });
    } else if (/\d/.test(key)) {
      setUserInputs(prev => {
        const newInputs = [...prev];
        const currentVal = newInputs[activeInputIndex] || '';
        
        const maxLength = currentChallenge?.numberToDecompose.toString().length || 7;
        if (currentVal.length < maxLength) newInputs[activeInputIndex] = currentVal + key; 
        else newInputs[activeInputIndex] = key; 
        return newInputs;
      });
    }
  }, [activeInputIndex, userInputs.length, verifyAnswer, showFeedback, isAttemptPending, userInputs, currentChallenge]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-2 max-w-[280px]" direction="left">
            Descompón: <strong className="block text-2xl sm:text-3xl font-bold">{currentChallenge.numberToDecompose}</strong>
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {currentChallenge.correctParts.map((_, index) => (
            <React.Fragment key={index}>
              <input
                type="text" 
                readOnly 
                value={userInputs[index] || ''}
                onClick={() => setActiveInputIndex(index)}
                className={`w-20 sm:w-24 h-12 sm:h-14 text-center text-lg sm:text-xl font-mono border-2 rounded-md transition-all
                            ${activeInputIndex === index ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                placeholder="0"
                aria-label={`Parte ${index + 1} de la descomposición`}
              />
              {index < currentChallenge.correctParts.length - 1 && <span className="text-2xl font-semibold text-slate-600 mx-1">+</span>}
            </React.Fragment>
          ))}
        </div>
         <button 
            onClick={() => setShowHelp(true)} 
            className="mt-4 px-4 py-2 bg-sky-100 text-sky-700 font-semibold rounded-lg shadow hover:bg-sky-200 transition-colors text-sm flex items-center"
            aria-label="Mostrar ayuda: ¿Cómo era la descomposición polinómica?"
          >
            <Icons.CharacterQuestionIcon className="w-5 h-5 mr-2 opacity-70" /> ¿Cómo era?
          </button>
      </div>
    );
  };
  return (
    <>
      <MainContent />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo Descomponer un Número?">
        <ComoEraDescomposicionContent />
      </HelpModal>
    </>
  );
};