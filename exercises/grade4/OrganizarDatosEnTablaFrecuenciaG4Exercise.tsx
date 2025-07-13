
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, FrequencyTableChallengeG4, RawDataItemG4 } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface OrganizarDatosEnTablaFrecuenciaG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_TABLE_FREQ = ['📊', '📋', '🤔', '🧐', '💡', '🔢', '✏️'];

export const OrganizarDatosEnTablaFrecuenciaG4Exercise: React.FC<OrganizarDatosEnTablaFrecuenciaG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<FrequencyTableChallengeG4 | null>(null);
  const [userFrequencies, setUserFrequencies] = useState<{ [category: string]: string }>({});
  const [activeCategoryInput, setActiveCategoryInput] = useState<string | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_TABLE_FREQ[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<FrequencyTableChallengeG4[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as FrequencyTableChallengeG4[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as FrequencyTableChallengeG4[]).length > 0) {
      pool = shuffleArray([...challenges as FrequencyTableChallengeG4[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      const initialFrequencies: { [category: string]: string } = {};
      nextChallenge.categories.forEach(cat => initialFrequencies[cat] = '');
      setUserFrequencies(initialFrequencies);
      setActiveCategoryInput(nextChallenge.categories[0] || null);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_TABLE_FREQ[Math.floor(Math.random() * FACE_EMOJIS_TABLE_FREQ.length)]);
    } else {
      onAttempt(true); // All challenges done
      return;
    }
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if ((challenges as FrequencyTableChallengeG4[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleInputFocus = (category: string) => {
    setActiveCategoryInput(category);
    showFeedback(null);
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    let allCorrect = true;
    for (const category of currentChallenge.categories) {
      const userAnswer = parseInt(userFrequencies[category] || "0", 10); // Default to 0 if empty
      const correctAnswer = currentChallenge.correctFrequencies[category] || 0;
      if (userAnswer !== correctAnswer) {
        allCorrect = false;
        break;
      }
    }
    onAttempt(allCorrect);
    if (allCorrect) {
      showFeedback({ type: 'correct', message: '¡Tabla de frecuencias completada correctamente!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Algunas frecuencias no son correctas. ¡Revisa tus conteos!' });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userFrequencies, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending || !activeCategoryInput) return;
    showFeedback(null);

    if (key === 'check') {
      verifyAnswer();
      return;
    }
    if (key === 'backspace') {
      setUserFrequencies(prev => ({ ...prev, [activeCategoryInput]: '' }));
    } else if (/\d/.test(key)) {
      setUserFrequencies(prev => {
        const currentVal = prev[activeCategoryInput] || '';
        // Allow up to 2 digits for frequency count
        const newVal = currentVal.length < 2 ? currentVal + key : key;
        return { ...prev, [activeCategoryInput]: newVal };
      });
    }
  }, [activeCategoryInput, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const RawDataDisplay: React.FC<{ data: RawDataItemG4[]; description: string }> = ({ data, description }) => (
    <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
      <h4 className="text-md font-medium text-amber-800 mb-2">{description}</h4>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center items-center p-2 bg-white rounded shadow-inner max-h-32 overflow-y-auto">
        {data.map((item, index) => (
          <span key={index} className="text-sm text-slate-700">
            {String(item)}{index < data.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
  );

  const FrequencyTableDisplay: React.FC<{
    categories: string[];
    frequencies: { [category: string]: string };
    activeInput: string | null;
    onInputClick: (category: string) => void;
  }> = ({ categories, frequencies, activeInput, onInputClick }) => {
    return (
      <table className="w-full max-w-sm my-3 border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-slate-200">
            <th className="p-2 border border-slate-300 text-slate-700 text-left text-sm font-semibold">Categoría</th>
            <th className="p-2 border border-slate-300 text-slate-700 text-center text-sm font-semibold">Frecuencia (Conteo)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category} className="hover:bg-slate-50">
              <td className="p-2 border border-slate-300 text-slate-800 text-sm font-medium">{category}</td>
              <td className="p-1 border border-slate-300 text-center">
                <button
                  onClick={() => onInputClick(category)}
                  className={`w-16 h-10 text-lg font-mono rounded-md border-2 flex items-center justify-center mx-auto transition-all
                              ${activeInput === category ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50 text-sky-700' 
                                                         : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
                  aria-label={`Frecuencia para ${category}, valor actual: ${frequencies[category] || 'vacío'}`}
                >
                  {frequencies[category] || <span className="text-slate-400">_</span>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallenge.questionText}
          </Icons.SpeechBubbleIcon>
        </div>
        <RawDataDisplay data={currentChallenge.rawData} description={currentChallenge.description} />
        <FrequencyTableDisplay
          categories={currentChallenge.categories}
          frequencies={userFrequencies}
          activeInput={activeCategoryInput}
          onInputClick={handleInputFocus}
        />
      </div>
    );
  };
  
  return <MainContent />;
};
