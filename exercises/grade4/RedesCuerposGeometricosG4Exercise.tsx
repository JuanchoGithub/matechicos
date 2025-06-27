
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, NetChallenge, GeometricBodyTypeId, GEOMETRIC_BODY_TYPE_LABELS } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface RedesCuerposGeometricosG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_REDES = ['🤔', '🧐', '💡', '🧊', '✂️', '📐'];


export const RedesCuerposGeometricosG4Exercise: React.FC<RedesCuerposGeometricosG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<NetChallenge | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<GeometricBodyTypeId | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_REDES[0]);
  const [availableChallenges, setAvailableChallenges] = useState<NetChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = {...pool[0]};
      next.options = shuffleArray([...next.options]); // Shuffle options for each challenge
      setCurrentChallenge(next);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_REDES[Math.floor(Math.random() * FACE_EMOJIS_REDES.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOptionId(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: GeometricBodyTypeId) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctBodyId) return;
    setSelectedOptionId(optionId); showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctBodyId) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctBodyId)) return;
    setIsVerified(true);
    const isCorrect = selectedOptionId === currentChallenge.correctBodyId;
    onAttempt(isCorrect);
    const correctLabel = GEOMETRIC_BODY_TYPE_LABELS[currentChallenge.correctBodyId];
    if (isCorrect) showFeedback({ type: 'correct', message: `¡Correcto! Es un/a ${correctLabel.toLowerCase()}.` });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta correcta era ${correctLabel.toLowerCase()}.` });
  }, [currentChallenge, selectedOptionId, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { netVisualComponent: NetVisualComponent } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md p-2 max-w-[280px]" direction="left">
            ¿Qué cuerpo geométrico se forma con esta red?
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <NetVisualComponent className="max-w-full max-h-full" />
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentChallenge.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) buttonClass = isVerified && opt.id === currentChallenge.correctBodyId ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          else if (isVerified && opt.id === currentChallenge.correctBodyId) buttonClass = 'bg-green-200 text-green-700';
          else if (isVerified) buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          return (<button key={opt.id} onClick={() => handleOptionSelect(opt.id)} disabled={isVerified && selectedOptionId === currentChallenge.correctBodyId} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{opt.label}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctBodyId)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctBodyId)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { if (setCustomKeypadContent) { if (currentChallenge) setCustomKeypadContent(<OptionsKeypad />); else setCustomKeypadContent(null); } return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
