
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface MultiplicationTablePracticeExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const CHARACTER_EMOJIS_TABLE = ['✖️', '🤔', '🧐', '💡', '🔢', '🤓'];

export const MultiplicationTablePracticeExercise: React.FC<MultiplicationTablePracticeExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [currentTable, setCurrentTable] = useState<number>(2);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [correctAnswer, setCorrectAnswer] = useState<number>(2);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_TABLE[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { tables = [2, 5, 10], maxMultiplier = 10 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const table = tables[Math.floor(Math.random() * tables.length)];
    const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
    setCurrentTable(table);
    setCurrentMultiplier(multiplier);
    setCorrectAnswer(table * multiplier);
    setCharacterEmoji(CHARACTER_EMOJIS_TABLE[Math.floor(Math.random() * CHARACTER_EMOJIS_TABLE.length)]);
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
  }, [tables, maxMultiplier, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) generateNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = userAnswerNum === correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else { showFeedback({ type: 'incorrect', message: 'Inténtalo de nuevo.' }); setIsAttemptPending(false); }
  }, [userInput, correctAnswer, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 3 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-4">
      <div className="relative flex items-center justify-center mb-2">
        <div className="w-24 h-24 flex items-center justify-center text-7xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-lg p-3 max-w-xs" direction="left">
          Tabla del {currentTable}:
        </Icons.SpeechBubbleIcon>
      </div>
      <p className="text-5xl font-bold text-slate-700 my-4">
        {currentTable} × {currentMultiplier} = ?
      </p>
      <div className="w-full max-w-xs h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
        {userInput || <span className="text-slate-400">_</span>}
      </div>
    </div>
  );

  return <MainContent />;
};
