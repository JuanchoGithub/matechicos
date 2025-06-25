
import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ContarElementosExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const ITEM_SETS: { [key: string]: { singular: string; plural: string; emoji: string } } = {
  apples: { singular: "manzana", plural: "manzanas", emoji: "🍎" },
  stars: { singular: "estrella", plural: "estrellas", emoji: "⭐" },
  balls: { singular: "pelota", plural: "pelotas", emoji: "⚽" },
  balloons: { singular: "globo", plural: "globos", emoji: "🎈" },
  cars: { singular: "auto", plural: "autos", emoji: "🚗" },
  flowers: { singular: "flor", plural: "flores", emoji: "🌸" },
  butterflies: {singular: "mariposa", plural: "mariposas", emoji: "🦋"},
  trees: {singular: "árbol", plural: "árboles", emoji: "🌳"},
  fish: {singular: "pez", plural: "peces", emoji: "🐠"},
};
const ITEM_KEYS = Object.keys(ITEM_SETS);

const CHARACTER_EMOJIS = ['😀', '🤔', '😊', '🥳', '🤩', '🧐', '🙂', '😇', '😃', '😉'];

export const ContarElementosExercise: React.FC<ContarElementosExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentItemEmoji, setCurrentItemEmoji] = useState<string>('🍎');
  const [currentItemNamePlural, setCurrentItemNamePlural] = useState<string>('manzanas');
  const [correctCount, setCorrectCount] = useState<number>(1);
  const [itemsToDisplay, setItemsToDisplay] = useState<string[]>([]);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS[0]);

  const { maxNumber = 10 } = exercise.data || {};

  const generateNewChallenge = useCallback(() => {
    const randomItemKey = ITEM_KEYS[Math.floor(Math.random() * ITEM_KEYS.length)];
    const itemDetails = ITEM_SETS[randomItemKey];
    const count = Math.floor(Math.random() * maxNumber) + 1;

    setCurrentItemEmoji(itemDetails.emoji);
    setCurrentItemNamePlural(itemDetails.plural);
    setCorrectCount(count);
    setItemsToDisplay(Array(count).fill(itemDetails.emoji));
    
    setCharacterEmoji(CHARACTER_EMOJIS[Math.floor(Math.random() * CHARACTER_EMOJIS.length)]);
    setUserInput('');
    scaffoldApi.showFeedback(null);
  }, [maxNumber, scaffoldApi]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]); 

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);


  const verifyAnswer = useCallback(() => {
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      scaffoldApi.onAttempt(false);
      return;
    }

    const isCorrect = userAnswerNum === correctCount;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Inténtalo de nuevo. ¡Cuenta con cuidado!' });
    }
  }, [userInput, correctCount, scaffoldApi]);

  const handleKeyPress = useCallback((key: string) => {
    scaffoldApi.showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyAnswer();
    } else if (userInput.length < 2 && /\d/.test(key)) { 
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, scaffoldApi]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const MainContent: React.FC = () => (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-2 space-y-4">
      <div className="relative flex items-center justify-center mb-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
          {characterEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-pink-500 text-white text-md p-2 max-w-[280px]" direction="left">
          ¿Cuántas {currentItemNamePlural} hay?
        </Icons.SpeechBubbleIcon>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 p-2 bg-slate-100 rounded-lg shadow-inner min-h-[100px] w-full max-w-md">
        {itemsToDisplay.map((emoji, index) => (
          <span key={index} className="text-3xl sm:text-4xl" role="img" aria-label={currentItemNamePlural.slice(0,-1)}>
            {emoji}
          </span>
        ))}
      </div>
      
      <div 
        className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner"
        aria-live="polite"
        aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
      >
        {userInput || <span className="text-slate-400">_</span>}
      </div>
    </div>
  );

  return <MainContent />;
};
