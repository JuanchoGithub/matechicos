import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Corrected: Will be content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ProblemasCapacidadSumaRestaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface ProblemTemplate {
  id: string;
  textTemplate: (n1: number, n2: number) => string;
  num1Range: [number, number];
  num2Range: [number, number];
  operation: '+' | '-';
  unit: string;
  resultUnitSingular: string;
  resultUnitPlural: string;
  emoji?: string;
}

interface CurrentChallenge {
  problemText: string;
  correctAnswer: number;
  emoji: string;
  resultUnitSingular: string;
  resultUnitPlural: string;
}

const DEFAULT_EMOJI = '💧';
const FACE_EMOJIS = ['🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '🚰', '⛽', '🏊', '🥤', '🥛', '🪴'];


export const ProblemasCapacidadSumaRestaExercise: React.FC<ProblemasCapacidadSumaRestaExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [availableProblems, setAvailableProblems] = useState<ProblemTemplate[]>([]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { problems = [] } = exercise.data || {};

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (problems.length > 0) {
      setAvailableProblems(shuffleArray([...problems as ProblemTemplate[]]));
    }
  }, [problems]);

  const generateNewChallenge = useCallback(() => {
    let problemPool = availableProblems;
    if (problemPool.length === 0 && (problems as ProblemTemplate[]).length > 0) {
        problemPool = shuffleArray([...problems as ProblemTemplate[]]);
        setAvailableProblems(problemPool);
    }
    if (problemPool.length === 0) {
        // No more internal scenarios, let scaffold handle overall completion via stars
        showFeedback({type: 'congrats', message: '¡Todos los problemas de este tipo completados!'});
        // onAttempt(true); // Removed, as scaffoldApi.onAttempt below covers the last attempt result
        return;
    }

    const selectedTemplate = problemPool[0];
    setAvailableProblems(prev => prev.slice(1));

    let num1 = Math.floor(Math.random() * (selectedTemplate.num1Range[1] - selectedTemplate.num1Range[0] + 1)) + selectedTemplate.num1Range[0];
    let num2 = Math.floor(Math.random() * (selectedTemplate.num2Range[1] - selectedTemplate.num2Range[0] + 1)) + selectedTemplate.num2Range[0];
    
    let correctAnswer: number;
    if (selectedTemplate.operation === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1];
      correctAnswer = num1 - num2;
    } else {
      correctAnswer = num1 + num2;
    }
    
    const problemText = selectedTemplate.textTemplate(num1, num2);
    const emoji = selectedTemplate.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)] || DEFAULT_EMOJI;

    setCurrentChallenge({
      problemText,
      correctAnswer,
      emoji,
      resultUnitSingular: selectedTemplate.resultUnitSingular,
      resultUnitPlural: selectedTemplate.resultUnitPlural,
    });
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
  }, [availableProblems, problems, showFeedback]);


  useEffect(() => {
    if ((problems as ProblemTemplate[]).length > 0 && !currentChallenge) { 
        generateNewChallenge();
    }
  }, [problems, currentChallenge, generateNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal !== previousAdvanceSignalRef.current) {
        generateNewChallenge();
        previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
    }
  }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    
    const isCorrect = userAnswer === currentChallenge.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Respuesta correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'No es correcto. Revisa el problema y tu cálculo.' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 4 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  },[userInput, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
            {currentChallenge.emoji}
          </div>
           <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-lg p-3" direction="left">
            ¡Calcula!
          </Icons.SpeechBubbleIcon>
        </div>

        <p className="text-lg sm:text-xl text-slate-700 p-4 bg-amber-100 border border-amber-300 rounded-lg shadow-sm min-h-[120px] flex items-center">
          {currentChallenge.problemText}
        </p>
        
        <div
          className="w-full max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
           {userInput && <span className="text-slate-500 text-xl ml-2">{currentChallenge.correctAnswer === 1 ? currentChallenge.resultUnitSingular : currentChallenge.resultUnitPlural}</span>}
        </div>
      </div>
    );
  };

  return <MainContent />;
};
