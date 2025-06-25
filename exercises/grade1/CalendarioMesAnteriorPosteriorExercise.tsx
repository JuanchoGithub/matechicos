
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CalendarioMesAnteriorPosteriorExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

const CHARACTER_EMOJIS_CALENDARIO = ['🗓️', '📅', '🤔', '🧐', '📆'];
const ALL_MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CalendarioMesAnteriorPosteriorExercise: React.FC<CalendarioMesAnteriorPosteriorExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [correctAnterior, setCorrectAnterior] = useState<string>("");
  const [correctPosterior, setCorrectPosterior] = useState<string>("");
  const [selectedAnterior, setSelectedAnterior] = useState<string>("");
  const [selectedPosterior, setSelectedPosterior] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_CALENDARIO[0]);
  
  const { months: monthPool = ALL_MONTHS } = exercise.data || { months: ALL_MONTHS };
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { setAvailableMonths(shuffleArray([...monthPool])); }, [monthPool, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let currentPool = availableMonths;
    if (currentPool.length === 0 && monthPool.length > 0) { currentPool = shuffleArray([...monthPool]); setAvailableMonths(currentPool); }
    if (currentPool.length > 0) {
      const monthName = currentPool[0]; setCurrentMonth(monthName);
      const currentIndex = ALL_MONTHS.indexOf(monthName);
      setCorrectAnterior(currentIndex > 0 ? ALL_MONTHS[currentIndex - 1] : "N/A");
      setCorrectPosterior(currentIndex < ALL_MONTHS.length - 1 ? ALL_MONTHS[currentIndex + 1] : "N/A");
      setAvailableMonths(prev => prev.slice(1));
      setCharacterEmoji(CHARACTER_EMOJIS_CALENDARIO[Math.floor(Math.random() * CHARACTER_EMOJIS_CALENDARIO.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedAnterior(""); setSelectedPosterior(""); setIsVerified(false); showFeedback(null);
  }, [availableMonths, monthPool, showFeedback, onAttempt]);

  useEffect(() => { if (monthPool.length > 0 && !currentMonth) loadNewChallenge(); }, [monthPool, currentMonth, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior) return; 
    setIsVerified(true);
    const anteriorIsOk = (selectedAnterior === correctAnterior) || (correctAnterior === "N/A" && selectedAnterior === "");
    const posteriorIsOk = (selectedPosterior === correctPosterior) || (correctPosterior === "N/A" && selectedPosterior === "");
    const isCorrect = anteriorIsOk && posteriorIsOk;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. El mes anterior es ${correctAnterior==="N/A"?"ninguno":correctAnterior} y el posterior es ${correctPosterior==="N/A"?"ninguno":correctPosterior}.` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [selectedAnterior, selectedPosterior, correctAnterior, correctPosterior, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentMonth) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-slate-700">Si el mes actual es: <strong className="text-blue-600">{currentMonth.toUpperCase()}</strong></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mt-4">
          <div className="flex flex-col items-center">
            <label htmlFor="mes-anterior" className="text-lg font-medium text-slate-600 mb-1">Mes Anterior:</label>
            <select id="mes-anterior" value={selectedAnterior} onChange={(e) => setSelectedAnterior(e.target.value)} disabled={(isVerified && selectedAnterior === correctAnterior) || correctAnterior === "N/A"} className="p-2 border border-slate-300 rounded-md shadow-sm text-md w-full focus:ring-sky-500 focus:border-sky-500">
              <option value="">{correctAnterior === "N/A" ? "(Ninguno)" : "Selecciona..."}</option>
              {ALL_MONTHS.map(m => <option key={`ant-${m}`} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="mes-posterior" className="text-lg font-medium text-slate-600 mb-1">Mes Posterior:</label>
            <select id="mes-posterior" value={selectedPosterior} onChange={(e) => setSelectedPosterior(e.target.value)} disabled={(isVerified && selectedPosterior === correctPosterior) || correctPosterior === "N/A"} className="p-2 border border-slate-300 rounded-md shadow-sm text-md w-full focus:ring-sky-500 focus:border-sky-500">
              <option value="">{correctPosterior === "N/A" ? "(Ninguno)" : "Selecciona..."}</option>
              {ALL_MONTHS.map(m => <option key={`pos-${m}`} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => (
    <div className="w-full flex flex-col space-y-2 p-2 mt-8">
      <button onClick={verifyAnswer} disabled={((selectedAnterior === "" && correctAnterior !== "N/A") || (selectedPosterior === "" && correctPosterior !== "N/A")) || (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior)} className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(((selectedAnterior === "" && correctAnterior !== "N/A") || (selectedPosterior === "" && correctPosterior !== "N/A")) || (isVerified && selectedAnterior === correctAnterior && selectedPosterior === correctPosterior)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
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
