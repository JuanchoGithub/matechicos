
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, VolumenCubosUnitariosChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface VolumenCubosUnitariosG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_VOLUMEN = ['🧊', '🤔', '🧐', '💡', '📦', '🧱'];

export const VolumenCubosUnitariosG4Exercise: React.FC<VolumenCubosUnitariosG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<VolumenCubosUnitariosChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_VOLUMEN[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<VolumenCubosUnitariosChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_VOLUMEN[Math.floor(Math.random() * FACE_EMOJIS_VOLUMEN.length)]);
    } else {
      onAttempt(true); return;
    }
    setUserInput(''); setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = userAnswerNum === currentChallenge.correctVolume;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Volumen Correcto!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. El volumen era ${currentChallenge.correctVolume} cubos.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (userInput.length < 3 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { dimensions } = currentChallenge;
    const visualCubes = Array(dimensions.height).fill(0).map((_, h) => (
        <div key={h} className="flex">
            {Array(dimensions.length).fill(0).map((_, l) => (
                <div key={`${h}-${l}`} className="flex flex-col">
                    {Array(dimensions.width).fill(0).map((_, w) => (
                         <div key={`${h}-${l}-${w}`} className="w-4 h-4 border border-slate-400 bg-sky-200 m-px opacity-70 transform -skew-y-6 -skew-x-3"></div>
                    ))}
                </div>
            ))}
        </div>
    ));
    const simpleVisual = (
      <div className="text-6xl my-4 opacity-70">
        {Array(Math.min(dimensions.length*dimensions.width*dimensions.height, 10)).fill('🧊').join('')}
        {dimensions.length*dimensions.width*dimensions.height > 10 ? '...' : ''}
      </div>
    );

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-blue-600 text-white text-md p-2 max-w-[280px]" direction="left">
            ¿Cuántos cubos unidad forman esta figura?
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-lg text-slate-700">Largo: {dimensions.length}, Ancho: {dimensions.width}, Alto: {dimensions.height} cubos</p>
        {/* Replace with actual 3D visual if possible, for now text description + simple emoji */}
        {simpleVisual}
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-1">cubos</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
