
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface SecuenciaDiaSemanaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

const CHARACTER_EMOJIS_SECUENCIA_DIA = ['🗓️', '🤔', '🧐', '⏪', '⏩', '💡'];
const ALL_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const SecuenciaDiaSemanaExercise: React.FC<SecuenciaDiaSemanaExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentDay, setCurrentDay] = useState<string>("");
  const [correctAnterior, setCorrectAnterior] = useState<string>("");
  const [correctPosterior, setCorrectPosterior] = useState<string>("");
  const [selectedAnterior, setSelectedAnterior] = useState<string>("");
  const [selectedPosterior, setSelectedPosterior] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_SECUENCIA_DIA[0]);
  
  const { days: dayPool = ALL_DAYS } = exercise.data || { days: ALL_DAYS };
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { setAvailableDays(shuffleArray([...dayPool])); }, [dayPool, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let currentPool = availableDays;
    if (currentPool.length === 0 && dayPool.length > 0) { currentPool = shuffleArray([...dayPool]); setAvailableDays(currentPool); }
    if (currentPool.length > 0) {
      const dayName = currentPool[0]; setCurrentDay(dayName);
      const currentIndex = ALL_DAYS.indexOf(dayName);
      setCorrectAnterior(ALL_DAYS[(currentIndex - 1 + ALL_DAYS.length) % ALL_DAYS.length]); 
      setCorrectPosterior(ALL_DAYS[(currentIndex + 1) % ALL_DAYS.length]); 
      setAvailableDays(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_SECUENCIA_DIA[Math.floor(Math.random() * CHARACTER_EMOJIS_SECUENCIA_DIA.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedAnterior(""); setSelectedPosterior(""); setIsVerified(false); showFeedback(null);
  }, [availableDays, dayPool, showFeedback, onAttempt]);

  useEffect(() => { if (dayPool.length > 0 && !currentDay) loadNewChallenge(); }, [dayPool, currentDay, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior) return; 
    setIsVerified(true);
    const anteriorIsOk = selectedAnterior === correctAnterior;
    const posteriorIsOk = selectedPosterior === correctPosterior;
    const isCorrect = anteriorIsOk && posteriorIsOk;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. Ayer fue ${correctAnterior} y mañana será ${correctPosterior}.` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [selectedAnterior, selectedPosterior, correctAnterior, correctPosterior, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentDay) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-slate-700">Si hoy es: <strong className="text-blue-600">{currentDay.toUpperCase()}</strong></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mt-4">
          <div className="flex flex-col items-center">
            <label htmlFor="dia-anterior" className="text-lg font-medium text-slate-600 mb-1">Ayer fue:</label>
            <select id="dia-anterior" value={selectedAnterior} onChange={(e) => setSelectedAnterior(e.target.value)} disabled={(isVerified && selectedAnterior === correctAnterior)} className="p-2 border border-slate-300 rounded-md shadow-sm text-md w-full focus:ring-sky-500 focus:border-sky-500">
              <option value="">Selecciona...</option>
              {ALL_DAYS.map(d => <option key={`ant-${d}`} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="dia-posterior" className="text-lg font-medium text-slate-600 mb-1">Mañana será:</label>
            <select id="dia-posterior" value={selectedPosterior} onChange={(e) => setSelectedPosterior(e.target.value)} disabled={(isVerified && selectedPosterior === correctPosterior)} className="p-2 border border-slate-300 rounded-md shadow-sm text-md w-full focus:ring-sky-500 focus:border-sky-500">
              <option value="">Selecciona...</option>
              {ALL_DAYS.map(d => <option key={`pos-${d}`} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => (
    <div className="w-full flex flex-col space-y-2 p-2 mt-8">
      <button onClick={verifyAnswer} disabled={!selectedAnterior || !selectedPosterior || (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior)} className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedAnterior || !selectedPosterior || (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  ), [selectedAnterior, selectedPosterior, correctAnterior, correctPosterior, isVerified, verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      setCustomKeypadContent(<OptionsKeypad />);
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, OptionsKeypad]);

  return <MainContent />;
};
