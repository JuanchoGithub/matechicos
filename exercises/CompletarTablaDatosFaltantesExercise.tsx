
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // No longer needed as it's content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, MissingInfoPuzzleScenarioTemplate, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface CompletarTablaDatosFaltantesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_PUZZLE = ['🧩', '🤔', '🧐', '💡', '🔢', '🔍', '🎯'];
const DEFAULT_PUZZLE_ICON = '🧩';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CompletarTablaDatosFaltantesExercise: React.FC<CompletarTablaDatosFaltantesExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentScenario, setCurrentScenario] = useState<MissingInfoPuzzleScenarioTemplate | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_PUZZLE_ICON);
  const [availableScenarios, setAvailableScenarios] = useState<MissingInfoPuzzleScenarioTemplate[]>([]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  
  const { totalStars: exerciseTotalStarsPerScenario = 1 } = exercise.data?.[0] || { totalStars: 1 }; 
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);


  useEffect(() => {
    const scenarios = exercise.data as MissingInfoPuzzleScenarioTemplate[] || [];
    if (scenarios.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarios]));
    }
  }, [exercise.data]);

  const loadNewScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as MissingInfoPuzzleScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as MissingInfoPuzzleScenarioTemplate[])]);
    }
    if (scenarioPool.length === 0) {
        showFeedback({type: 'congrats', message: '¡Todos los puzzles de este tipo completados!'});
        onAttempt(true); 
        return;
    }
    
    const nextScenario = scenarioPool[0];
    setCurrentScenario(nextScenario);
    setCurrentEmoji(nextScenario.icon || FACE_EMOJIS_PUZZLE[Math.floor(Math.random() * FACE_EMOJIS_PUZZLE.length)]);
    setUserInput('');
    showFeedback(null);
    setIsAttemptPending(false);
    setAvailableScenarios(prev => prev.slice(1));

  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  useEffect(() => {
    if ((exercise.data as MissingInfoPuzzleScenarioTemplate[])?.length > 0 && !currentScenario ) { 
        loadNewScenario();
    }
  }, [exercise.data, currentScenario, loadNewScenario]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) {
        loadNewScenario();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewScenario]);

  const verifyAnswer = useCallback(() => {
    if (!currentScenario || isAttemptPending) return;
    setIsAttemptPending(true);

    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }

    const isCorrect = userAnswerNum === currentScenario.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! El valor faltante era ${currentScenario.correctAnswer}.` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Valor incorrecto. Revisa tus cálculos y los totales.' });
      setIsAttemptPending(false);
    }
  }, [currentScenario, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if(isAttemptPending) return;
    showFeedback(null);
    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 4 && /\d/.test(key)) setUserInput(prev => prev + key); 
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);


  const PuzzleTable: React.FC<{ scenario: MissingInfoPuzzleScenarioTemplate }> = ({ scenario }) => {
    const allColumnHeaders = [scenario.rowCategoryHeader, ...scenario.dataColumnHeaders];
    if (scenario.displayRowTotalsColumn) {
      allColumnHeaders.push("Total");
    }

    return (
      <div className="w-full max-w-md p-2 sm:p-3 bg-white rounded-lg shadow overflow-x-auto">
        <h3 className="text-md font-semibold text-center text-slate-700 mb-2 sm:mb-3">{scenario.title}</h3>
        <table className="w-full text-xs sm:text-sm text-left text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {allColumnHeaders.map(header => (
                <th key={header} scope="col" className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-black">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenario.rowData.map((row, rIndex) => (
              <tr key={row.header} className={`${rIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${row.isTotalRow ? 'font-bold bg-slate-200' : ''}`}>
                <th scope="row" className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-slate-800 whitespace-nowrap">{row.header}</th>
                {row.values.map((cell, cIndex) => (
                  <td key={`${row.header}-cell-${cIndex}`} className={`px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-center ${cell.isTotalCell && !row.isTotalRow ? 'font-semibold' : ''}`}>
                    {cell.isMissingCell 
                      ? <span className="text-red-500 font-bold text-lg">?</span> 
                      : cell.display}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const MainContent: React.FC = () => {
    if (!currentScenario) return <div className="p-4 text-xl text-slate-600">Cargando puzzle...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-indigo-600 text-white text-sm p-2 max-w-[260px]" direction="left">
            {currentScenario.questionText || exercise.question || "Encuentra el valor faltante:"}
          </Icons.SpeechBubbleIcon>
        </div>
        <PuzzleTable scenario={currentScenario} />
        <p className="text-md sm:text-lg font-semibold text-slate-700 mt-3">
            Ingresa el valor para la casilla marcada con <span className="text-red-500 font-bold text-lg">?</span>:
        </p>
        <div
          className="w-1/2 max-w-xs h-12 sm:h-16 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl text-slate-700 font-mono tracking-wider shadow-inner"
          aria-live="polite"
          aria-label={`Respuesta ingresada: ${userInput || 'Vacío'}`}
        >
          {userInput || <span className="text-slate-400">_</span>}
           {userInput && currentScenario.valueUnit && <span className="text-slate-500 text-sm ml-1.5">{currentScenario.valueUnit}</span>}
        </div>
      </div>
    );
  };

  return (<MainContent />);
};
