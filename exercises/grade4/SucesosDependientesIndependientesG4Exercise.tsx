
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, DependenciaSucesosChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface SucesosDependientesIndependientesG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_SUCESOS = ['🤔', '🧐', '💡', '🔗', '⛓️', '❓'];
const DEFAULT_OPTIONS: {id: string, label: string}[] = [
    {id:'independientes', label:'Independientes'}, 
    {id:'dependientes', label:'Dependientes'}
];

// Keypad Component for Options
const SucesosOptionsKeypad: React.FC<{
  options: { id: string; label: string }[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerId: string | null;
}> = ({ options, selectedOptionId, onSelect, onVerify, isVerified, correctAnswerId }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctAnswerId 
              ? 'bg-green-500 text-white ring-2 ring-green-700' 
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (opt.id === correctAnswerId) {
            // Optionally highlight correct answer if not selected
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isVerified && selectedOptionId === correctAnswerId}
            className={`w-full p-3 rounded-lg text-center text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${opt.label}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const SucesosDependientesIndependientesG4Exercise: React.FC<SucesosDependientesIndependientesG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DependenciaSucesosChallenge | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_SUCESOS[0]);
  const [availableChallenges, setAvailableChallenges] = useState<DependenciaSucesosChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as DependenciaSucesosChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as DependenciaSucesosChallenge[]).length > 0) { 
      pool = shuffleArray([...challenges as DependenciaSucesosChallenge[]]); 
      setAvailableChallenges(pool); 
    }

    if (pool.length > 0) {
      const next = {...pool[0]};
      // Options are static for this exercise type
      next.options = [...DEFAULT_OPTIONS]; 
      setCurrentChallenge(next);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_SUCESOS[Math.floor(Math.random() * FACE_EMOJIS_SUCESOS.length)]);
    } else {
      onAttempt(true); // No more challenges, signal completion
      return;
    }
    setSelectedOptionId(null); 
    setIsVerified(false); 
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as DependenciaSucesosChallenge[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctAnswerId) return;
    setSelectedOptionId(optionId); 
    showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctAnswerId) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)) return;
    setIsVerified(true);
    const isCorrect = selectedOptionId === currentChallenge.correctAnswerId;
    onAttempt(isCorrect);
    const correctLabel = currentChallenge.correctAnswerId === 'independientes' ? "independientes" : "dependientes";
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! Los sucesos son ${correctLabel}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. Los sucesos eran ${correctLabel}. ${currentChallenge.explanation || ''}` });
    }
  }, [currentChallenge, selectedOptionId, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    const { eventA, eventB } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-lime-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "¿Son estos sucesos dependientes o independientes?"}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full p-3 bg-sky-50 border border-sky-200 rounded-lg shadow-sm text-sm">
          <p className="font-semibold text-sky-700">Suceso A:</p>
          <p className="text-slate-600">{eventA}</p>
        </div>
        <div className="w-full p-3 bg-orange-50 border border-orange-200 rounded-lg shadow-sm text-sm">
          <p className="font-semibold text-orange-700">Suceso B:</p>
          <p className="text-slate-600">{eventB}</p>
        </div>
      </div>
    );
  };
  
  const KeypadForSidebar: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <SucesosOptionsKeypad
        options={currentChallenge.options}
        selectedOptionId={selectedOptionId}
        onSelect={handleOptionSelect}
        onVerify={verifyAnswer}
        isVerified={isVerified}
        correctAnswerId={currentChallenge.correctAnswerId}
      />
    );
  }, [currentChallenge, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

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
