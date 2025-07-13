
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MultiplicarFraccionesChallenge, FractionChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray, gcd } from '../../utils';

interface MultiplicarFraccionesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_OP_FRAC_M = ['✖️', '🤔', '🧐', '💡', '🍰', '🧮', '🚀'];
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
        <button onClick={onClose} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center">Entendido</button>
      </div>
    </div>
  );
};

const ComoEraContent: React.FC = () => (
    <>
      <p className="font-semibold text-sky-600 text-lg">¡Multiplicar fracciones es más fácil de lo que parece! Hay 3 casos:</p>
      
      <div className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-bold text-md text-blue-700">1. Fracción por un Número Entero</p>
        <p>Ejemplo: 2/5 x 3</p>
        <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li>Solo multiplicas el <strong>numerador</strong> (el de arriba) por el número entero.</li>
            <li>El denominador (el de abajo) se queda igual.</li>
            <li className="font-mono text-center bg-white p-1 rounded">2 x 3 = 6  ---&gt;  6/5</li>
        </ol>
      </div>

      <div className="my-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="font-bold text-md text-green-700">2. Fracción por Fracción</p>
        <p>Ejemplo: 2/3 x 4/5</p>
         <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li>Multiplicas los numeradores juntos: 2 x 4 = 8</li>
            <li>Multiplicas los denominadores juntos: 3 x 5 = 15</li>
            <li className="font-mono text-center bg-white p-1 rounded">Resultado: 8/15</li>
        </ol>
      </div>
      
       <div className="my-3 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
        <p className="font-bold text-md text-yellow-700">3. ¡No te olvides de simplificar!</p>
        <p>Ejemplo: 2/3 x 3/4</p>
         <ol className="list-decimal list-inside space-y-1 mt-2 text-left text-xs sm:text-sm">
            <li>Multiplicamos: (2x3)/(3x4) = 6/12</li>
            <li>¿Podemos dividir el 6 y el 12 por el mismo número? ¡Sí, por 6!</li>
            <li>(6 ÷ 6) = 1. (12 ÷ 6) = 2.</li>
            <li className="font-mono text-center bg-white p-1 rounded">Resultado final simplificado: 1/2</li>
        </ol>
      </div>
    </>
);

const FractionInput: React.FC<{
  numerator: string; denominator: string; onNumeratorClick: () => void; onDenominatorClick: () => void;
  isNumeratorActive: boolean; isDenominatorActive: boolean;
}> = ({ numerator, denominator, onNumeratorClick, onDenominatorClick, isNumeratorActive, isDenominatorActive }) => (
    <div className="flex flex-col items-center justify-center">
      <button onClick={onNumeratorClick} className={`w-20 h-12 sm:w-24 sm:h-16 border-2 rounded-md text-2xl font-bold flex items-center justify-center text-slate-800 ${isNumeratorActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
        {numerator || <span className="text-slate-400">?</span>}
      </button>
      <hr className="w-16 border-t-2 border-slate-700 my-1" />
      <button onClick={onDenominatorClick} className={`w-20 h-12 sm:w-24 sm:h-16 border-2 rounded-md text-2xl font-bold flex items-center justify-center text-slate-800 ${isDenominatorActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
        {denominator || <span className="text-slate-400">?</span>}
      </button>
    </div>
  );

const FactorDisplay: React.FC<{ factor: FractionChallenge | number }> = ({ factor }) => {
    if (typeof factor === 'number') {
        return <div className="text-5xl font-bold text-slate-700">{factor}</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md">
            <span className="text-2xl font-bold text-slate-700">{factor.numerator}</span>
            <hr className="w-12 border-t-2 border-slate-500 my-0.5"/>
            <span className="text-2xl font-bold text-slate-700">{factor.denominator}</span>
        </div>
    );
};

export const MultiplicarFraccionesG5Exercise: React.FC<MultiplicarFraccionesG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MultiplicarFraccionesChallenge | null>(null);
  const [userInputNumerator, setUserInputNumerator] = useState<string>('');
  const [userInputDenominator, setUserInputDenominator] = useState<string>('');
  const [activeInput, setActiveInput] = useState<ActiveFracInput>('numerator');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_OP_FRAC_M[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<MultiplicarFraccionesChallenge[]>([]);
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
      setCharacterEmoji(FACE_EMOJIS_OP_FRAC_M[Math.floor(Math.random() * FACE_EMOJIS_OP_FRAC_M.length)]);
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
      if (currentVal.length < 3) targetSetter(prev => prev + key);
      else targetSetter(key);
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
            Resuelve la multiplicación:
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex items-center justify-center space-x-3 my-3">
          <FactorDisplay factor={currentChallenge.factor1} />
          <span className="text-4xl font-bold text-slate-600">×</span>
          <FactorDisplay factor={currentChallenge.factor2} />
          <span className="text-4xl font-bold text-slate-600">=</span>
          <FractionInput 
            numerator={userInputNumerator} denominator={userInputDenominator} 
            onNumeratorClick={() => setActiveInput('numerator')} isNumeratorActive={activeInput === 'numerator'}
            onDenominatorClick={() => setActiveInput('denominator')} isDenominatorActive={activeInput === 'denominator'}
          />
        </div>
         <p className="text-xs text-slate-500 italic mt-2">Recuerda simplificar el resultado a su mínima expresión.</p>
      </div>
    );
  };
  
  return (
    <>
      <MainContent />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo Multiplicar Fracciones?">
        <ComoEraContent />
      </HelpModal>
    </>
  );
};
