
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, FinanceChallengeG5 } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface FinanzasAvanzadoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_FINANZAS = ['💰', '🤔', '🧐', '💡', '💸', '🛒', '🛍️'];

export const FinanzasAvanzadoExercise: React.FC<FinanzasAvanzadoExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<FinanceChallengeG5 | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to n-1 for items, n for total, n+1 for change
  const [userInput, setUserInput] = useState('');
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_FINANZAS[0]);
  const [availableChallenges, setAvailableChallenges] = useState<FinanceChallengeG5[]>([]);
  
  const stepAnswersRef = useRef<number[]>([]);

  const { scenarios = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (scenarios.length > 0) setAvailableChallenges(shuffleArray([...scenarios]));
  }, [scenarios, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (scenarios as FinanceChallengeG5[]).length > 0) {
      pool = shuffleArray([...scenarios as FinanceChallengeG5[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_FINANZAS[Math.floor(Math.random() * FACE_EMOJIS_FINANZAS.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setCurrentStepIndex(0);
    setUserInput('');
    stepAnswersRef.current = [];
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableChallenges, scenarios, showFeedback, onAttempt]);

  useEffect(() => { if (scenarios.length > 0 && !currentChallenge) loadNewChallenge(); }, [scenarios, currentChallenge, loadNewChallenge]);
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge();
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      setIsAttemptPending(false);
      return;
    }

    const { shoppingList, initialMoney } = currentChallenge;
    const isCalculatingSubtotal = currentStepIndex < shoppingList.length;
    const isCalculatingTotal = currentStepIndex === shoppingList.length;
    const isCalculatingChange = currentStepIndex === shoppingList.length + 1;

    let correctAnswer: number | null = null;
    if (isCalculatingSubtotal) {
      const currentItem = shoppingList[currentStepIndex];
      correctAnswer = currentItem.item.price * currentItem.quantity;
    } else if (isCalculatingTotal) {
      correctAnswer = stepAnswersRef.current.reduce((sum, val) => sum + val, 0);
    } else if (isCalculatingChange) {
      const totalCost = stepAnswersRef.current[stepAnswersRef.current.length - 1];
      correctAnswer = initialMoney - totalCost;
    }

    const isCorrect = correctAnswer !== null && userAnswerNum === correctAnswer;
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Paso Correcto!' });
      stepAnswersRef.current.push(userAnswerNum);
      setTimeout(() => {
        if (isCalculatingChange) {
          onAttempt(true); // Final correct answer for the whole problem
        } else {
          setCurrentStepIndex(prev => prev + 1);
          setUserInput('');
          setIsAttemptPending(false);
          showFeedback(null);
        }
      }, 1200);
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${correctAnswer}. ¡Revisa tu cálculo!` });
      onAttempt(false); // Mark attempt as incorrect, but don't advance the whole problem
      setIsAttemptPending(false);
    }
  }, [currentChallenge, currentStepIndex, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { setUserInput(prev => prev.slice(0, -1)); }
    else if (userInput.length < 7 && /\d/.test(key)) { setUserInput(prev => prev + key); }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const getCurrentQuestion = () => {
    if (!currentChallenge) return "";
    const { shoppingList, initialMoney } = currentChallenge;
    if (currentStepIndex < shoppingList.length) {
      const { item, quantity } = shoppingList[currentStepIndex];
      return `Calcula el costo de ${quantity} ${item.name.toLowerCase()}${quantity > 1 ? 's' : ''} a ${item.price} pesos cada uno.`;
    }
    if (currentStepIndex === shoppingList.length) {
      return `¿Cuánto gastaste en total en todas tus compras?`;
    }
    return `Si tenías ${initialMoney} pesos, ¿cuánto dinero te queda?`;
  };

  const ShoppingListDisplay: React.FC = () => (
    <div className="w-full text-left bg-white p-3 rounded-lg shadow-sm border border-slate-200">
      <h4 className="font-bold text-black mb-2 text-center">Lista de Compras:</h4>
      <ul className="space-y-1">
        {currentChallenge?.shoppingList.map(({item, quantity}, index) => (
          <li key={index} className="flex justify-between items-center text-sm text-black">
            <span>{item.icon} {quantity} x {item.name}</span>
            <span className="font-mono">${item.price} c/u</span>
          </li>
        ))}
      </ul>
      <hr className="my-2"/>
      <div className="text-sm font-semibold text-right text-black">Dinero Inicial: <span className="font-mono text-green-600">${currentChallenge?.initialMoney}</span></div>
    </div>
  );

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;

  return (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-lg">
      <ShoppingListDisplay />
      <div className="w-full p-4 bg-sky-50 border-2 border-sky-200 rounded-lg shadow-md mt-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="text-5xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-md p-2 max-w-xs" direction="left">
            Paso {currentStepIndex + 1}:
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="font-semibold text-slate-800 text-lg mb-3">{getCurrentQuestion()}</p>
        <div className="w-3/4 max-w-xs h-16 bg-white border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl text-slate-700 font-mono tracking-wider shadow-inner mx-auto">
          {userInput || <span className="text-slate-400">_</span>}
        </div>
      </div>
    </div>
  );
};
