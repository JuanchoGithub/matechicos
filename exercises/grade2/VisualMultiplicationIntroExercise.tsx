
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface VisualMultiplicationIntroExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const ITEM_EMOJIS_MULT = ['⭐', '⚽', '🎈', '🍎', '🚗', '🌸'];
const CHARACTER_EMOJIS_MULT = ['🤔', '🧐', '💡', '✖️', '🔢'];

export const VisualMultiplicationIntroExercise: React.FC<VisualMultiplicationIntroExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [groups, setGroups] = useState<number>(2);
  const [itemsPerGroup, setItemsPerGroup] = useState<number>(3);
  const [currentItemEmoji, setCurrentItemEmoji] = useState<string>(ITEM_EMOJIS_MULT[0]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(6);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_MULT[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { maxGroups = 5, maxInGroup = 5 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const numGroups = Math.floor(Math.random() * (maxGroups - 1)) + 2; // 2 to maxGroups
    const numItems = Math.floor(Math.random() * (maxInGroup - 1)) + 2; // 2 to maxInGroup
    setGroups(numGroups);
    setItemsPerGroup(numItems);
    setCorrectAnswer(numGroups * numItems);
    setCurrentItemEmoji(ITEM_EMOJIS_MULT[Math.floor(Math.random() * ITEM_EMOJIS_MULT.length)]);
    setCharacterEmoji(CHARACTER_EMOJIS_MULT[Math.floor(Math.random() * CHARACTER_EMOJIS_MULT.length)]);
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
  }, [maxGroups, maxInGroup, showFeedback]);

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
    else if (userInput.length < 2 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-2 space-y-3">
      <div className="relative flex items-center justify-center mb-1">
        <div className="w-20 h-20 flex items-center justify-center text-6xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-blue-500 text-white text-md p-2 max-w-[280px]" direction="left">
          Hay {groups} grupos con {itemsPerGroup} {currentItemEmoji} cada uno. ¿Cuántos hay en total?
        </Icons.SpeechBubbleIcon>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-3 p-2 bg-slate-100 rounded-lg shadow-inner min-h-[100px] w-full max-w-md">
        {Array.from({ length: groups }).map((_, groupIndex) => (
          <div key={groupIndex} className="flex border border-slate-300 p-1 rounded">
            {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
              <span key={itemIndex} className="text-2xl sm:text-3xl mx-0.5">{currentItemEmoji}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="text-lg font-semibold text-slate-700">{groups} × {itemsPerGroup} = ?</div>
      <div className="w-3/4 max-w-xs h-16 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl text-slate-700 font-mono tracking-wider shadow-inner">
        {userInput || <span className="text-slate-400">_</span>}
      </div>
    </div>
  );

  return <MainContent />;
};
