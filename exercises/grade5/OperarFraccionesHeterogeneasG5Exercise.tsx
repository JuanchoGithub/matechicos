
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, OperarFraccionesHeterogeneasChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface OperarFraccionesHeterogeneasG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_OP_FRAC_H = ['➕➖', '🤔', '🧐', '💡', '🍰', '🧮', '🔥'];
type ActiveFracInput = 'numerator' | 'denominator';

// --- Help Modal Component ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'auto'; }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-xl sm:text-2xl font-semibold text-sky-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl sm:text-4xl font-bold p-1" aria-label="Cerrar ayuda">&times;</button>
        </div>
        <div className="text-slate-700 space-y-3 leading-relaxed text-sm sm:text-base overflow-y-auto flex-grow">{children}</div>
        <button onClick={onClose} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center">Entendido, ¡listo para resolver!</button>
      </div>
    </div>
  );
};

const ComoEraContent: React.FC = () => (
    <>
      <p className="font-semibold text-sky-600 text-lg">¡Hola! Para sumar o restar fracciones con distinto denominador, seguimos estos pasos:</p>
      
      <div className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-bold text-md text-blue-700">Ejemplo: Sumemos 1/2 + 1/3</p>
        <ol className="list-decimal list-inside space-y-2 mt-2 text-left text-xs sm:text-sm">
            <li><strong>Encontrar un "amigo" común para los denominadores (denominador común).</strong> El truco es encontrar el mínimo común múltiplo (mcm) de 2 y 3. ¡Es 6!</li>
            <li><strong>Convertir las fracciones para que ambas tengan ese amigo.</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Para 1/2: ¿Por cuánto multiplicamos el 2 para que sea 6? ¡Por 3! Multiplicamos arriba y abajo por 3: (1x3)/(2x3) = <strong>3/6</strong>.</li>
                    <li>Para 1/3: ¿Por cuánto multiplicamos el 3 para que sea 6? ¡Por 2! Multiplicamos arriba y abajo por 2: (1x2)/(3x2) = <strong>2/6</strong>.</li>
                </ul>
            </li>
            <li><strong>¡Ahora sí! Sumar (o restar) los numeradores.</strong> El denominador se queda igual.
                 <p className="mt-1 p-2 bg-white rounded-md shadow-sm text-center font-mono text-blue-700 text-sm sm:text-base">
                    3/6 + 2/6 = (3+2)/6 = 5/6
                </p>
            </li>
            <li><strong>(Opcional) Simplificar si se puede.</strong> 5/6 ya no se puede simplificar. ¡Ese es el resultado final!</li>
        </ol>
      </div>
      
      <div className="my-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="font-bold text-md text-green-700">Ejemplo con resta: 3/4 - 1/6</p>
        <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li><strong>Denominador común (mcm de 4 y 6):</strong> ¡Es 12!</li>
            <li><strong>Convertir:</strong> 3/4 = (3x3)/(4x3) = 9/12.  Y 1/6 = (1x2)/(6x2) = 2/12.</li>
            <li><strong>Restar:</strong> 9/12 - 2/12 = (9-2)/12 = 7/12.</li>
            <li><strong>¿Simplificar?</strong> 7/12 no se puede. ¡Listo!</li>
        </ol>
      </div>
    </>
);


const FractionInput: React.FC<{
  numerator: string; denominator: string; onNumeratorClick: () => void; onDenominatorClick: () => void;
  isNumeratorActive: boolean; isDenominatorActive: boolean;
}> = ({ numerator, denominator, onNumeratorClick, onDenominatorClick, isNumeratorActive, isDenominatorActive }) => (
    <div className="flex flex-col items-center justify-center">
      <button onClick={onNumeratorClick} className={`w-20 h-12 sm:w-24 sm:h-16 border-2 rounded-md text-2xl font-bold flex items-center justify-center ${isNumeratorActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
        {numerator || <span className="text-slate-400">?</span>}
      </button>
      <hr className="w-16 border-t-2 border-slate-700 my-1" />
      <button onClick={onDenominatorClick} className={`w-20 h-12 sm:w-24 sm:h-16 border-2 rounded-md text-2xl font-bold flex items-center justify-center ${isDenominatorActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
        {denominator || <span className="text-slate-400">?</span>}
      </button>
    </div>
  );

const FractionDisplay: React.FC<{fraction: {numerator:number, denominator:number}}> = ({fraction}) => (
    <div className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md">
        <span className="text-2xl font-bold text-slate-700">{fraction.numerator}</span>
        <hr className="w-12 border-t-2 border-slate-500 my-0.5"/>
        <span className="text-2xl font-bold text-slate-700">{fraction.denominator}</span>
    </div>
);


export const OperarFraccionesHeterogeneasG5Exercise: React.FC<OperarFraccionesHeterogeneasG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<OperarFraccionesHeterogeneasChallenge | null>(null);
  const [userInputNumerator, setUserInputNumerator] = useState<string>('');
  const [userInputDenominator, setUserInputDenominator] = useState<string>('');
  const [activeInput, setActiveInput] = useState<ActiveFracInput>('numerator');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_OP_FRAC_H[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<OperarFraccionesHeterogeneasChallenge[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_OP_FRAC_H[Math.floor(Math.random() * FACE_EMOJIS_OP_FRAC_H.length)]);
    } else {
      onAttempt(true); return;
    }
    setUserInputNumerator(''); setUserInputDenominator(''); setActiveInput('numerator');
    setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const numN = parseInt(userInputNumerator, 10);
    const numD = parseInt(userInputDenominator, 10);
    if (isNaN(numN) || isNaN(numD) || userInputNumerator === '' || userInputDenominator === '') {
      showFeedback({ type: 'incorrect', message: 'Completa numerador y denominador.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = numN === currentChallenge.correctResult.numerator && numD === currentChallenge.correctResult.denominator;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Fracción Correcta!' });
    else { showFeedback({ type: 'incorrect', message: `Resultado incorrecto. Era ${currentChallenge.correctResult.numerator}/${currentChallenge.correctResult.denominator}.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInputNumerator, userInputDenominator, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    const targetSetter = activeInput === 'numerator' ? setUserInputNumerator : setUserInputDenominator;
    const currentVal = activeInput === 'numerator' ? userInputNumerator : userInputDenominator;

    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { targetSetter(prev => prev.slice(0, -1)); }
    else if (/\d/.test(key)) {
      if (currentVal.length < 2) targetSetter(prev => prev + key);
      else targetSetter(key); // Replace
    }
  }, [activeInput, userInputNumerator, userInputDenominator, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="w-full flex justify-start m-0.5">
          <button onClick={() => setShowHelp(true)} className="px-3 py-1.5 bg-sky-100 text-sky-700 font-semibold rounded-lg shadow-sm hover:bg-sky-200 transition-colors text-xs flex items-center">
            <Icons.CharacterQuestionIcon className="w-4 h-4 mr-1 opacity-80" /> ¿Cómo era?
          </button>
        </div>
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md p-2 max-w-[280px]" direction="left">
            Resuelve la operación:
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex items-center justify-center space-x-3 my-3">
          <FractionDisplay fraction={currentChallenge.fractionA} />
          <span className="text-4xl font-bold text-slate-600">{currentChallenge.operation}</span>
          <FractionDisplay fraction={currentChallenge.fractionB} />
          <span className="text-4xl font-bold text-slate-600">=</span>
          <FractionInput 
            numerator={userInputNumerator} denominator={userInputDenominator} 
            onNumeratorClick={() => setActiveInput('numerator')} isNumeratorActive={activeInput === 'numerator'}
            onDenominatorClick={() => setActiveInput('denominator')} isDenominatorActive={activeInput === 'denominator'}
          />
        </div>
      </div>
    );
  };
  
  return (
    <>
      <MainContent />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo Sumar o Restar Fracciones?">
        <ComoEraContent />
      </HelpModal>
    </>
  );
};
