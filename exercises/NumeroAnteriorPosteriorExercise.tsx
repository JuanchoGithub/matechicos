
import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface NumeroAnteriorPosteriorExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

interface CurrentChallenge {
  currentNumber: number;
  correctAnterior: string; 
  correctPosterior: string; 
}

type ActiveInputType = 'anterior' | 'posterior';

const FACE_EMOJIS_ORDINAL = ['🤔', '🧐', '🔢', '👍', '🎯', '💡', '🤓', '👀'];
const ARROW_COLOR = "text-slate-400";

export const NumeroAnteriorPosteriorExercise: React.FC<NumeroAnteriorPosteriorExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [userInputAnterior, setUserInputAnterior] = useState<string>('');
  const [userInputPosterior, setUserInputPosterior] = useState<string>('');
  const [activeInput, setActiveInput] = useState<ActiveInputType>('anterior');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_ORDINAL[0]);

  const { 
    minNumber = 0, 
    maxNumber = 9  
  } = exercise.data || {};

  const generateNewChallenge = useCallback(() => {
    const num = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    
    const anterior = (num === minNumber) ? '' : (num - 1).toString();
    const posterior = (num === maxNumber) ? '' : (num + 1).toString();

    setCurrentChallenge({
      currentNumber: num,
      correctAnterior: anterior,
      correctPosterior: posterior,
    });

    setUserInputAnterior('');
    setUserInputPosterior('');
    setActiveInput('anterior');
    scaffoldApi.showFeedback(null);
    setCharacterEmoji(FACE_EMOJIS_ORDINAL[Math.floor(Math.random() * FACE_EMOJIS_ORDINAL.length)]);
  }, [minNumber, maxNumber, scaffoldApi]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);
  
  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) {
        generateNewChallenge();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, generateNewChallenge]);

  const handleInputClick = (inputType: ActiveInputType) => {
    setActiveInput(inputType);
    scaffoldApi.showFeedback(null);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge) return;

    const { correctAnterior, correctPosterior, currentNumber } = currentChallenge;
    let isAnteriorCorrect = userInputAnterior === correctAnterior;
    let isPosteriorCorrect = userInputPosterior === correctPosterior;

    if (currentNumber === minNumber && userInputAnterior === '') isAnteriorCorrect = true;
    if (currentNumber === maxNumber && userInputPosterior === '') isPosteriorCorrect = true;
    
    if (correctAnterior === '' && userInputAnterior !== '') isAnteriorCorrect = false;
    if (correctPosterior === '' && userInputPosterior !== '') isPosteriorCorrect = false;

    const isCorrect = isAnteriorCorrect && isPosteriorCorrect;
    scaffoldApi.onAttempt(isCorrect);

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Muy bien! Secuencia correcta.' });
    } else {
      let errorMsg = "Alguno de los números no es correcto.";
      if (!isAnteriorCorrect && correctAnterior !== '') errorMsg += ` El anterior a ${currentNumber} es ${correctAnterior}.`;
      if (!isPosteriorCorrect && correctPosterior !== '') errorMsg += ` El posterior a ${currentNumber} es ${correctPosterior}.`;
      if (correctAnterior === '' && userInputAnterior !== '') errorMsg += ` El número ${currentNumber} no tiene anterior en este rango.`;
      if (correctPosterior === '' && userInputPosterior !== '') errorMsg += ` El número ${currentNumber} no tiene posterior en este rango.`;
      scaffoldApi.showFeedback({ type: 'incorrect', message: errorMsg.trim() + " ¡Intenta de nuevo!" });
    }
  }, [currentChallenge, userInputAnterior, userInputPosterior, minNumber, maxNumber, scaffoldApi]);

  const handleKeyPress = useCallback((key: string) => {
    scaffoldApi.showFeedback(null);
    const currentMaxLength = maxNumber.toString().length; 

    if (key === 'check') {
      verifyAnswer();
      return;
    }

    const targetInputSetter = activeInput === 'anterior' ? setUserInputAnterior : setUserInputPosterior;
    const currentInputValue = activeInput === 'anterior' ? userInputAnterior : userInputPosterior;

    if (key === 'backspace') {
      targetInputSetter('');
    } else if (/\d/.test(key)) {
      if (currentInputValue.length < currentMaxLength) {
        targetInputSetter(currentInputValue + key);
      } else { 
        targetInputSetter(key);
      }
      // Removed automatic focus switch from here:
      // if (activeInput === 'anterior') {
      //   if (currentChallenge?.correctPosterior !== "") setActiveInput('posterior');
      // }
    }
  }, [activeInput, currentChallenge, userInputAnterior, userInputPosterior, maxNumber, verifyAnswer, scaffoldApi]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const InputBox: React.FC<{ value: string; isActive: boolean; onClick: () => void; placeholder: string; ariaLabel: string }> = 
  ({ value, isActive, onClick, placeholder, ariaLabel }) => (
    <button
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg text-3xl sm:text-4xl font-bold text-slate-700 flex items-center justify-center transition-all
                  ${isActive ? 'border-sky-500 ring-4 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
      aria-label={ariaLabel}
    >
      {value || <span className="text-slate-400">{placeholder}</span>}
    </button>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    const placeholderAnterior = currentChallenge.currentNumber === minNumber ? "-" : "?";
    const placeholderPosterior = currentChallenge.currentNumber === maxNumber ? "-" : "?";

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-lg p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-24 h-24 flex items-center justify-center text-7xl">
            {characterEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-md p-3 max-w-xs" direction="left">
            {exercise.question || "¿Cuál es el anterior y el posterior?"}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <InputBox 
            value={userInputAnterior} 
            isActive={activeInput === 'anterior'} 
            onClick={() => handleInputClick('anterior')}
            placeholder={placeholderAnterior}
            ariaLabel={`Número anterior. Valor actual: ${userInputAnterior || 'vacío'}`}
          />
           <Icons.BackArrowIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${ARROW_COLOR}`} />
           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-bold text-slate-800 shadow-md">
            {currentChallenge.currentNumber}
          </div>
          <Icons.BackArrowIcon className={`w-8 h-8 sm:w-10 sm:h-10 transform rotate-180 ${ARROW_COLOR}`} />
          <InputBox 
            value={userInputPosterior} 
            isActive={activeInput === 'posterior'} 
            onClick={() => handleInputClick('posterior')}
            placeholder={placeholderPosterior}
            ariaLabel={`Número posterior. Valor actual: ${userInputPosterior || 'vacío'}`}
          />
        </div>
      </div>
    );
  };
  return <MainContent />;
};
