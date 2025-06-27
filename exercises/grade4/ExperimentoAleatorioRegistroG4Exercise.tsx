
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, ExperimentoAleatorioChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface ExperimentoAleatorioRegistroG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_EXPERIMENTO = ['🎲', '🪙', '🤔', '🧐', '💡', '📊'];

// This component structure assumes predefined results for MCQ format.
// For actual simulation, it would be far more complex.

export const ExperimentoAleatorioRegistroG4Exercise: React.FC<ExperimentoAleatorioRegistroG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ExperimentoAleatorioChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_EXPERIMENTO[0]);
  const [availableChallenges, setAvailableChallenges] = useState<ExperimentoAleatorioChallenge[]>([]);
  
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
      setCharacterEmoji(FACE_EMOJIS_EXPERIMENTO[Math.floor(Math.random() * FACE_EMOJIS_EXPERIMENTO.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentChallenge.correctAnswer}.` });
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { description, simulatedResults, questionAbout } = currentChallenge;
    let questionText = "";
    switch(currentChallenge.questionType){
        case 'frequency_of_outcome': questionText = `¿Cuántas veces salió ${questionAbout}?`; break;
        case 'most_frequent': questionText = `¿Cuál fue el resultado más frecuente?`; break;
        case 'least_frequent': questionText = `¿Cuál fue el resultado menos frecuente?`; break;
        default: questionText = "Observa los resultados y responde:";
    }

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-yellow-500 text-slate-800 text-md p-2 max-w-[280px]" direction="left">
            {description}
          </Icons.SpeechBubbleIcon>
        </div>
        {simulatedResults && (
          <div className="p-2 bg-slate-100 rounded-md shadow">
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Resultados Registrados:</h4>
            <ul className="text-xs text-slate-600 list-disc list-inside">
              {simulatedResults.map(res => <li key={res.outcome}>{res.outcome}: {res.count} veces</li>)}
            </ul>
          </div>
        )}
        <p className="text-md font-semibold text-slate-700 mt-2">{questionText}</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentChallenge.options.map((optStr, index) => {
          const isSelected = selectedOption === optStr;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) buttonClass = isVerified && optStr === currentChallenge.correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          else if (isVerified && optStr === currentChallenge.correctAnswer) buttonClass = 'bg-green-200 text-green-700';
          else if (isVerified) buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          return (<button key={index} onClick={() => handleOptionSelect(optStr)} disabled={isVerified && selectedOption === currentChallenge.correctAnswer} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{optStr}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { if (setCustomKeypadContent) { if (currentChallenge) setCustomKeypadContent(<OptionsKeypad />); else setCustomKeypadContent(null); } return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
