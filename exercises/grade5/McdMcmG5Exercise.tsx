
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, McdMcmChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface McdMcmG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_MCD_MCM = ['🤔', '🧐', '💡', '🔢', '✨', '🧮'];

// --- Helper Modal Component ---
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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="helpModalTitle"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" 
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

const ComoEraContent: React.FC = () => (
    <>
      <p className="font-semibold text-sky-600 text-lg">Un Método Poderoso: Descomposición en Factores Primos</p>
      <p>Para números más grandes, buscar todos los divisores o múltiplos puede ser largo. ¡Hay un truco de detectives matemáticos! Se llama <strong>descomponer en factores primos</strong>.</p>
      <p className="text-xs mt-1">Un número primo es aquel que solo se puede dividir por 1 y por sí mismo (como 2, 3, 5, 7, 11...).</p>
      
      <div className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-bold text-md text-blue-700">Calcular el MCD de 12 y 18 (con el truco)</p>
        <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li><strong>Descomponemos los números en factores primos:</strong>
                <div className="flex justify-around mt-1 font-mono bg-white p-2 rounded">
                    <div>12 | 2<br/> 6 | 2<br/> 3 | 3<br/> 1 |<p className="mt-1">12 = 2² x 3</p></div>
                    <div>18 | 2<br/> 9 | 3<br/> 3 | 3<br/> 1 |<p className="mt-1">18 = 2 x 3²</p></div>
                </div>
            </li>
            <li><strong>Buscamos los "ingredientes" comunes:</strong> Ambos números tienen el <strong className="text-blue-600">2</strong> y el <strong className="text-blue-600">3</strong> como factores.</li>
            <li><strong>Elegimos el de menor exponente:</strong>
                <ul className="list-disc list-inside ml-4">
                    <li>Entre 2² y 2, el más "pequeño" es <strong>2</strong>.</li>
                    <li>Entre 3 y 3², el más "pequeño" es <strong>3</strong>.</li>
                </ul>
            </li>
            <li><strong>Multiplicamos los que elegimos:</strong> 2 x 3 = <strong className="text-blue-800 text-base">6</strong>.</li>
        </ol>
        <p className="text-sm mt-2"><strong>¡El MCD es 6!</strong> ¡El mismo resultado que antes, pero más rápido para números grandes!</p>
      </div>
      
      <div className="my-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="font-bold text-md text-green-700">Calcular el mcm de 12 y 18 (con el truco)</p>
        <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li><strong>Descomponemos los números (¡ya lo hicimos!):</strong>
                 <div className="flex justify-around mt-1 font-mono bg-white p-2 rounded">
                    <div>12 = 2² x 3</div>
                    <div>18 = 2 x 3²</div>
                </div>
            </li>
            <li><strong>Buscamos TODOS los "ingredientes" diferentes:</strong> Los ingredientes son el <strong className="text-green-600">2</strong> y el <strong className="text-green-600">3</strong>.</li>
            <li><strong>Elegimos el de MAYOR exponente:</strong>
                <ul className="list-disc list-inside ml-4">
                    <li>Entre 2² y 2, el más "grande" es <strong>2²</strong> (que es 4).</li>
                    <li>Entre 3 y 3², el más "grande" es <strong>3²</strong> (que es 9).</li>
                </ul>
            </li>
            <li><strong>Multiplicamos los que elegimos:</strong> 2² x 3² = 4 x 9 = <strong className="text-green-800 text-base">36</strong>.</li>
        </ol>
        <p className="text-sm mt-2"><strong>¡El mcm es 36!</strong></p>
      </div>
    </>
);


// Helper functions for GCD (MCD) and LCM (mcm)
const gcd = (a: number, b: number): number => {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
};

const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
};

// Keypad Component for Options (local to this file)
const OptionsKeypad: React.FC<{
  options: number[];
  selectedOption: number | null;
  onSelect: (option: number) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: number | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((optValue, index) => {
        const isSelected = selectedOption === optValue;
        let buttonClass = `bg-white text-black hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`; // Default state with black text

        if (isVerified) {
          if (isSelected) {
            buttonClass = optValue === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (optValue === correctAnswer) {
            // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if not selected
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-black ring-2 ring-sky-500'; // Selected state with black text
        }
        
        return (
          <button
            key={index}
            onClick={() => onSelect(optValue)}
            disabled={isVerified && selectedOption === correctAnswer}
            className={`w-full p-3 rounded-lg text-center text-lg font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
          >
            {optValue}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={selectedOption === null || (isVerified && selectedOption === correctAnswer)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};


export const McdMcmG5Exercise: React.FC<McdMcmG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<McdMcmChallenge | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_MCD_MCM[0]);
  const [availableChallenges, setAvailableChallenges] = useState<McdMcmChallenge[]>([]);
  
  const [options, setOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { challenges = [], minNum = 2, maxNum = 50 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNumericDistractors = (correct: number, problemNumbers: number[], type: 'mcd' | 'mcm'): number[] => {
    const distractors = new Set<number>();
    const [n1, n2] = problemNumbers;

    // Add the other calculation (if MCD, add LCM as distractor, and vice versa)
    const otherResult = type === 'mcd' ? lcm(n1, n2) : gcd(n1, n2);
    if (otherResult !== correct && otherResult > 0) distractors.add(otherResult);

    // Add one of the original numbers
    distractors.add(n1 > n2 ? n1 : n2);

    // Add a simple variation
    if(correct > 2) distractors.add(correct - 1);
    else distractors.add(correct + 1);

    // Add a multiple or factor
    if (type === 'mcd') {
        if(correct > 1) distractors.add(correct * 2);
    } else { // mcm
        if(correct % 2 === 0 && correct / 2 !== correct) distractors.add(correct / 2);
    }
    
    // Ensure we have 3 unique distractors
    let attempts = 0;
    while(distractors.size < 3 && attempts < 20) {
        const randVariation = Math.floor(Math.random() * 5) + 1;
        const newDistractor = correct + randVariation;
        if(newDistractor !== correct && !distractors.has(newDistractor)) {
            distractors.add(newDistractor);
        }
        attempts++;
    }
    
    return Array.from(distractors).filter(d => d !== correct).slice(0, 3);
  };
  
  const generateDynamicChallenge = useCallback((): McdMcmChallenge => {
    const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    let num2;
    do {
      num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    } while (num1 === num2);
    
    const type = Math.random() < 0.5 ? 'mcd' : 'mcm';
    const correctAnswer = type === 'mcd' ? gcd(num1, num2) : lcm(num1, num2);
    
    return { numbers: [num1, num2], type, correctAnswer };
  }, [minNum, maxNum]);

  useEffect(() => {
    if ((challenges as McdMcmChallenge[]).length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as McdMcmChallenge[]]));
    } else {
      const dynamicChallenges = Array.from({ length: 10 }, () => generateDynamicChallenge());
      setAvailableChallenges(dynamicChallenges);
    }
  }, [challenges, exercise.id, generateDynamicChallenge]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0) {
        if ((challenges as McdMcmChallenge[]).length > 0) {
            pool = shuffleArray([...challenges as McdMcmChallenge[]]);
        } else {
            pool = Array.from({ length: 5 }, () => generateDynamicChallenge());
        }
        setAvailableChallenges(pool);
    }
    
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      
      const distractors = generateNumericDistractors(nextChallenge.correctAnswer, nextChallenge.numbers, nextChallenge.type);
      setOptions(shuffleArray([nextChallenge.correctAnswer, ...distractors]));

      setCharacterEmoji(FACE_EMOJIS_MCD_MCM[Math.floor(Math.random() * FACE_EMOJIS_MCD_MCM.length)]);
    } else {
      onAttempt(true); // End of exercise
      return;
    }
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt, generateDynamicChallenge]);
  
  useEffect(() => {
    loadNewChallenge();
  }, [exercise.id]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: number) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option); 
    showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. El resultado era ${currentChallenge.correctAnswer}.` });
      setIsVerified(false);
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(
          <OptionsKeypad
            options={options}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            onVerify={verifyAnswer}
            isVerified={isVerified}
            correctAnswer={currentChallenge.correctAnswer}
          />
        );
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, currentChallenge, options, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);


  if (!currentChallenge) return <div className="p-4 text-slate-700">Cargando desafío de MCD/mcm...</div>;
  
  const typeLabel = currentChallenge.type === 'mcd' ? 'Máximo Común Divisor (MCD)' : 'Mínimo Común Múltiplo (mcm)';

  return (
    <div className="flex flex-col items-center p-4 text-slate-800 w-full">
        <div className="w-full flex justify-start m-0.5">
            <button 
                onClick={() => setShowHelp(true)} 
                className="px-3 py-1 bg-sky-100 text-sky-700 font-semibold rounded-lg shadow-sm hover:bg-sky-200 transition-colors text-xs flex items-center"
                aria-label="Ayuda para MCD y mcm"
            >
                <Icons.CharacterQuestionIcon className="w-4 h-4 mr-1 opacity-80" /> ¿Cómo era?
            </button>
        </div>
        <div className="relative flex items-center justify-center mb-4 mt-2">
            <div className="w-24 h-24 flex items-center justify-center text-7xl">{characterEmoji}</div>
            <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-3 max-w-xs" direction="left">
                Calcula el <strong className="block text-lg">{typeLabel}</strong>
            </Icons.SpeechBubbleIcon>
        </div>
      <p className="text-2xl mb-4">
        de: <strong className="text-blue-600 font-mono text-3xl">{currentChallenge.numbers.join(' y ')}</strong>
      </p>
      <p className="text-slate-500 mt-4">Selecciona la respuesta correcta en el panel de la derecha.</p>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo Encontrar el MCD y el mcm?">
        <ComoEraContent />
      </HelpModal>
    </div>
  );
};
