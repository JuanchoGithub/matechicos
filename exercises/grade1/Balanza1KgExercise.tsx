import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface Balanza1KgExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type BalanceOption = 'MAS_DE_1KG' | 'MENOS_DE_1KG' | 'IGUAL_A_1KG';
interface BalanceChallenge {
  objectEmoji: string;
  objectLabel: string;
  actualWeightGrams: number; 
  correctAnswer: BalanceOption;
}

const CHARACTER_EMOJIS_BALANZA = ['⚖️', '🤔', '🧐', '🍎', '🍉', '❓'];
const OPTIONS_BALANZA: { id: BalanceOption; label: string }[] = [
    { id: 'MAS_DE_1KG', label: 'Pesa MÁS de 1kg' },
    { id: 'IGUAL_A_1KG', label: 'Pesa IGUAL a 1kg' },
    { id: 'MENOS_DE_1KG', label: 'Pesa MENOS de 1kg' },
];

const BalanceScaleSVG: React.FC<{ leftWeightGrams: number, rightWeightGrams: number, leftLabel?: string, rightLabel?: string }> = ({ leftWeightGrams, rightWeightGrams, leftLabel = "1kg", rightLabel = "?" }) => {
  let beamRotation = 0;
  if (leftWeightGrams > rightWeightGrams) beamRotation = -5; 
  else if (rightWeightGrams > leftWeightGrams) beamRotation = 5; 

  const armLength = 60; const panSize = 25; const panOffsetY = 5; 

  return (
    <svg viewBox="-5 -5 130 80" className="w-48 h-32 sm:w-64 sm:h-40">
      <polygon points="50,70 40,75 60,75" fill="rgb(107 114 128)" />
      <rect x="47.5" y="35" width="5" height="35" fill="rgb(107 114 128)" />
      <g transform={`rotate(${beamRotation} 60 35)`}>
        <line x1={60 - armLength/2} y1="35" x2={60 + armLength/2} y2="35" stroke="rgb(75 85 99)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="35" r="4" fill="rgb(55 65 81)" />
        <line x1={60 - armLength/2} y1="35" x2={60 - armLength/2} y2={35 + panOffsetY + panSize/2} stroke="rgb(156 163 175)" strokeWidth="1.5" />
        <ellipse cx={60 - armLength/2} cy={35 + panOffsetY + panSize/2 + panSize/4} rx={panSize/2} ry={panSize/4} fill="rgb(209 213 219)" stroke="rgb(107 114 128)" strokeWidth="1.5"/>
        <text x={60 - armLength/2} y={35 + panOffsetY + panSize/2 + panSize/4 + 2} textAnchor="middle" fontSize="5px" fontWeight="bold">{leftLabel}</text>
        <line x1={60 + armLength/2} y1="35" x2={60 + armLength/2} y2={35 + panOffsetY + panSize/2} stroke="rgb(156 163 175)" strokeWidth="1.5" />
        <ellipse cx={60 + armLength/2} cy={35 + panOffsetY + panSize/2 + panSize/4} rx={panSize/2} ry={panSize/4} fill="rgb(209 213 219)" stroke="rgb(107 114 128)" strokeWidth="1.5"/>
        <text x={60 + armLength/2} y={35 + panOffsetY + panSize/2 + panSize/4 + 2} textAnchor="middle" fontSize="8px" fontWeight="bold">{rightLabel}</text>
      </g>
    </svg>
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const Balanza1KgExercise: React.FC<Balanza1KgExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<BalanceChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<BalanceOption | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_BALANZA[0]);
  const [availableChallenges, setAvailableChallenges] = useState<BalanceChallenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = pool[0]; setCurrentChallenge(next); setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_BALANZA[Math.floor(Math.random() * CHARACTER_EMOJIS_BALANZA.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: BalanceOption) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. El objeto ${currentChallenge.objectLabel.toLowerCase()} ${currentChallenge.correctAnswer.toLowerCase().replace('_', ' ').replace('1kg', '1 kilogramo')}.` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <BalanceScaleSVG leftWeightGrams={1000} rightWeightGrams={currentChallenge.actualWeightGrams} leftLabel="1kg" rightLabel={currentChallenge.objectEmoji} />
        <p className="text-sm text-slate-600">El objeto es: {currentChallenge.objectLabel}</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {OPTIONS_BALANZA.map((opt) => {
          const isSelected = selectedOption === opt.id;
          let buttonClass = `bg-white text-black hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) {
            buttonClass = isVerified && opt.id === currentChallenge.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' 
                : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          } else if (isVerified) { 
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          return (<button key={opt.id} onClick={() => handleOptionSelect(opt.id)} disabled={isVerified && selectedOption === currentChallenge.correctAnswer} className={`w-full p-3 rounded-lg text-center text-sm font-semibold ${buttonClass}`}>{opt.label}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(<OptionsKeypad />);
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
