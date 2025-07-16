
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MeasurementDataExplorerChallengeG5 } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';
import { InteractiveLinePlotG5 } from '../../components/InteractiveLinePlotG5';

interface MeasurementDataExplorerG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_DATA_EXPLORER = ['🔬', '📈', '🤔', '🧐', '💡', '🌱', '⚖️'];

export const MeasurementDataExplorerG5Exercise: React.FC<MeasurementDataExplorerG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MeasurementDataExplorerChallengeG5 | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<MeasurementDataExplorerChallengeG5[]>([]);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_DATA_EXPLORER[0]);
  
  // State for the exercise flow
  const [phase, setPhase] = useState<'plotting' | 'answering'>('plotting');
  const [userPlot, setUserPlot] = useState<Map<number, number>>(new Map());
  const [userInput, setUserInput] = useState('');

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const getCorrectPlotMap = (data: number[]): Map<number, number> => {
    const map = new Map<number, number>();
    data.forEach(val => {
      map.set(val, (map.get(val) || 0) + 1);
    });
    return map;
  };
  
  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as MeasurementDataExplorerChallengeG5[]).length > 0) {
      pool = shuffleArray([...challenges as MeasurementDataExplorerChallengeG5[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_DATA_EXPLORER[Math.floor(Math.random() * FACE_EMOJIS_DATA_EXPLORER.length)]);
      
      // Reset state for the new challenge
      setPhase(nextChallenge.mode === 'create' ? 'plotting' : 'answering');
      setUserPlot(nextChallenge.mode === 'interpret' ? getCorrectPlotMap(nextChallenge.data) : new Map());
      setUserInput('');
      showFeedback(null);

    } else {
      onAttempt(true); // End of challenges
    }
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if ((challenges as MeasurementDataExplorerChallengeG5[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handlePlotChange = (newPlotData: Map<number, number>) => {
    if (phase !== 'plotting') return;
    setUserPlot(newPlotData);
    showFeedback(null); // Clear feedback when user interacts
  };

  const checkPlot = () => {
    if (!currentChallenge || phase !== 'plotting') return;
    const correctPlot = getCorrectPlotMap(currentChallenge.data);
    
    let plotsMatch = correctPlot.size === userPlot.size;
    if (plotsMatch) {
      for (const [key, value] of correctPlot) {
        if (userPlot.get(key) !== value) {
          plotsMatch = false;
          break;
        }
      }
    }
    // Also check that userPlot doesn't have extra keys
    if (plotsMatch) {
        for (const key of userPlot.keys()) {
            if (!correctPlot.has(key)) {
                plotsMatch = false;
                break;
            }
        }
    }

    // Check if plot is correct
    if (plotsMatch) {
      showFeedback({ type: 'correct', message: '¡Gráfico correcto! Ahora responde la pregunta.' });
      setTimeout(() => {
        setPhase('answering');
        showFeedback(null);
      }, 1500);
    } else {
      showFeedback({ type: 'incorrect', message: 'El gráfico no es correcto. Revisa los datos y vuelve a intentarlo.' });
    }
  };
  
  const verifyFinalAnswer = () => {
    if (!currentChallenge || phase !== 'answering') return;
    const userAnswerNum = parseFloat(userInput.replace(',', '.'));
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Ingresa una respuesta numérica.' });
      return;
    }
    
    const isCorrect = Math.abs(userAnswerNum - currentChallenge.correctAnswer) < 0.01;
    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Respuesta final correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Respuesta incorrecta. La respuesta correcta era ${currentChallenge.correctAnswer}.` });
    }
  };

  const handleKeyPress = useCallback((key: string) => {
    showFeedback(null);
    if (key === 'check') {
        if(phase === 'plotting') checkPlot();
        else verifyFinalAnswer();
        return;
    }
    if (phase !== 'answering') return; // Only allow numeric input in answering phase

    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (/\d|\./.test(key) && userInput.length < 6) {
        if (key === '.' && userInput.includes('.')) return;
        setUserInput(prev => prev + key);
    }
  }, [phase, userInput, checkPlot, verifyFinalAnswer, showFeedback]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  if (!currentChallenge) {
    return <div className="p-4 text-xl text-slate-600">Cargando laboratorio de datos...</div>;
  }
  
  const { title, data, unit, question, lineRange, step, dotIcon } = currentChallenge;

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
      <div className="relative flex items-center justify-center mb-1">
        <div className="w-16 h-16 flex items-center justify-center text-5xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-sm p-2 max-w-[280px]" direction="left">
          {title}
        </Icons.SpeechBubbleIcon>
      </div>
      
      {phase === 'plotting' && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm font-medium text-slate-700">Datos a graficar: Haz clic en la línea numérica para agregar puntos.</p>
            <p className="text-md font-mono text-amber-800">{data.join(` ${unit}, `)} {unit}</p>
        </div>
      )}
      
      <InteractiveLinePlotG5
        range={lineRange}
        step={step}
        unit={unit}
        dotIcon={dotIcon}
        plotData={userPlot}
        onPlotChange={handlePlotChange}
        isInteractive={phase === 'plotting'}
      />
      
      {phase === 'answering' ? (
        <div className="w-full p-3 bg-green-50 border-t-2 border-b-2 border-green-200 mt-2 animate-fade-in">
            <p className="text-md font-semibold text-green-800">{question}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
               <label htmlFor="final-answer-input" className="text-md font-semibold text-slate-700">Respuesta:</label>
                <div className="w-32 h-14 bg-white border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl text-slate-700 font-mono tracking-wider shadow-inner">
                    {userInput || <span className="text-slate-400">_</span>}
                    {userInput && !isNaN(parseFloat(userInput)) && <span className="text-slate-500 text-lg ml-1">{unit}</span>}
                </div>
            </div>
        </div>
      ) : (
        <button 
            onClick={checkPlot}
            className="mt-2 px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
        >
            Verificar Gráfico
        </button>
      )}
    </div>
  );
};
