
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CompletarPalabraSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

interface WordChallenge {
  gappedWord: string; 
  missingLetter: string; 
  options: string[]; 
  correctAnswer: string; 
  wordType?: string; 
}

const CHARACTER_EMOJIS_PALABRA = ['✏️', '🤔', '🧐', '🔡', '📖', '💡'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompletarPalabraSimpleExercise: React.FC<CompletarPalabraSimpleExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_PALABRA[0]);
  const [availableChallenges, setAvailableChallenges] = useState<WordChallenge[]>([]);

  const { words = [], wordType = "palabra" } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (words.length > 0) setAvailableChallenges(shuffleArray([...words])); }, [words, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && words.length > 0) { pool = shuffleArray([...words]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = pool[0]; setCurrentChallenge(next); setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_PALABRA[Math.floor(Math.random() * CHARACTER_EMOJIS_PALABRA.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedLetter(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, words, showFeedback, onAttempt]);

  useEffect(() => { if (words.length > 0 && !currentChallenge) loadNewChallenge(); }, [words, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleLetterSelect = useCallback((letter: string) => {
    if (isVerified && selectedLetter === currentChallenge?.correctAnswer) return;
    setSelectedLetter(letter); showFeedback(null);
    if (isVerified && selectedLetter !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedLetter, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedLetter || (isVerified && selectedLetter === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedLetter === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Letra Correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La letra era "${currentChallenge.correctAnswer}".` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedLetter, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-slate-700 tracking-widest p-4 bg-slate-100 rounded-lg shadow-inner">
          {currentChallenge.gappedWord.split("").map((char, i) => char === '_' ? <span key={i} className="text-blue-500 mx-1">_</span> : <span key={i}>{char}</span>)}
        </div>
        <p className="text-sm text-slate-500">Completa el/la {currentChallenge.wordType?.toLowerCase() || 'palabra'}.</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    const shuffledDisplayOptions = shuffleArray([...currentChallenge.options]);
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {shuffledDisplayOptions.map((letter) => {
          const isSelected = selectedLetter === letter;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) {
            if (isVerified) {
              buttonClass = letter === currentChallenge.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
          } else { 
            if (isVerified) {
              buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
          }
          return (<button key={letter} onClick={() => handleLetterSelect(letter)} disabled={isVerified && selectedLetter === currentChallenge.correctAnswer} className={`w-full p-3 rounded-lg text-center text-2xl font-bold ${buttonClass}`}>{letter}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedLetter || (isVerified && selectedLetter === currentChallenge.correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedLetter || (isVerified && selectedLetter === currentChallenge.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedLetter, isVerified, handleLetterSelect, verifyAnswer]);
  
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
