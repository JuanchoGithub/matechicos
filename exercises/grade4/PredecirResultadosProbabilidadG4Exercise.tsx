
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PrediccionProbabilidadChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface PredecirResultadosProbabilidadG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_PREDICT = ['🔮', '🤔', '🧐', '💡', '🎲', '🎯'];

// Keypad Component for Numerical Options
const PredictionOptionsKeypad: React.FC<{
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
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = optValue === correctAnswer
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (optValue === correctAnswer) {
            // Optionally highlight correct answer if not selected
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        
        return (
          <button
            key={index}
            onClick={() => onSelect(optValue)}
            disabled={isVerified && selectedOption === correctAnswer}
            className={`w-full p-3 rounded-lg text-center text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${optValue}`}
          >
            {optValue}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={selectedOption === null || (isVerified && selectedOption === correctAnswer)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(selectedOption === null || (isVerified && selectedOption === correctAnswer))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const PredecirResultadosProbabilidadG4Exercise: React.FC<PredecirResultadosProbabilidadG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<PrediccionProbabilidadChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_PREDICT[0]);
  const [availableChallenges, setAvailableChallenges] = useState<PrediccionProbabilidadChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as PrediccionProbabilidadChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as PrediccionProbabilidadChallenge[]).length > 0) { 
      pool = shuffleArray([...challenges as PrediccionProbabilidadChallenge[]]); 
      setAvailableChallenges(pool); 
    }

    if (pool.length > 0) {
      const next = {...pool[0]};
      next.options = shuffleArray([...next.options]); // Shuffle options for the current challenge
      setCurrentChallenge(next);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_PREDICT[Math.floor(Math.random() * FACE_EMOJIS_PREDICT.length)]);
    } else {
      onAttempt(true); // No more challenges, signal completion
      return;
    }
    setSelectedOption(null); 
    setIsVerified(false); 
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as PrediccionProbabilidadChallenge[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) { // Handle initial undefined case
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
      showFeedback({ type: 'correct', message: '¡Predicción Correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La predicción más probable era ${currentChallenge.correctAnswer}.` });
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando predicción...</div>;
    const { eventDescription, probability, numTrials, questionText } = currentChallenge;
    const probText = `${probability.favorable} de ${probability.total}`;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-teal-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {questionText}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm text-sm text-slate-700">
          <p><strong className="font-semibold">Evento:</strong> {eventDescription}</p>
          <p><strong className="font-semibold">Probabilidad:</strong> {probText}</p>
          <p><strong className="font-semibold">Número de Intentos:</strong> {numTrials}</p>
        </div>
      </div>
    );
  };
  
  const KeypadForSidebar: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <PredictionOptionsKeypad
        options={currentChallenge.options}
        selectedOption={selectedOption}
        onSelect={handleOptionSelect}
        onVerify={verifyAnswer}
        isVerified={isVerified}
        correctAnswer={currentChallenge.correctAnswer}
      />
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { 
    if (setCustomKeypadContent) { 
      if (currentChallenge) {
        setCustomKeypadContent(<KeypadForSidebar />);
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; 
  }, [setCustomKeypadContent, KeypadForSidebar, currentChallenge]);

  return <MainContent />;
};
