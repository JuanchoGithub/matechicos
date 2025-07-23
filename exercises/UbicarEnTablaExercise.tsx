import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExerciseScaffoldApi } from '@/types';
import { Exercise as ExerciseType, AvatarData, UbicarEnTablaScenarioTemplate, UbicarEnTablaItem, UbicarEnTablaQuestionType } from '@/types';
import { Icons } from '@components';

interface ActiveUbicarEnTablaScenario {
  tableTitle: string;
  gridSize: { rows: number; cols: number };
  gridItems: UbicarEnTablaItem[][]; 
  questions: GeneratedQuestion[];
  totalStarsPerScenario: number;
  icon?: string;
}

interface GeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface UbicarEnTablaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; // Added this prop
}

const FACE_EMOJIS_UBICAR = ['🗺️', '📍', '🤔', '🧐', '💡', '🎯', '👀', '📌'];
const DEFAULT_UBICAR_ICON = '🗺️';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateGrid = (rows: number, cols: number, possibleItems: UbicarEnTablaItem[]): UbicarEnTablaItem[][] => {
  const grid: UbicarEnTablaItem[][] = [];
  const usedItems = new Set<UbicarEnTablaItem>();
  const shuffledPossibleItems = shuffleArray([...possibleItems]);
  let itemPool = [...shuffledPossibleItems];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      if (itemPool.length === 0) { 
        itemPool = [...shuffledPossibleItems];
      }
      let itemToAdd = itemPool.shift() as UbicarEnTablaItem;
      grid[r][c] = itemToAdd;
      usedItems.add(itemToAdd);
    }
  }
  return grid;
};

const generateQuestionsForGrid = (
  grid: UbicarEnTablaItem[][],
  numQuestions: number,
  scenarioId: string
): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const allItemsInGrid = shuffleArray(Array.from(new Set(grid.flat())));

  for (let i = 0; i < numQuestions; i++) {
    const questionType: UbicarEnTablaQuestionType = Math.random() < 0.5 ? 'what_is_in_cell' : 'where_is_item';
    let questionText = "";
    let correctAnswer: string = ""; 
    let options: string[] = [];

    if (questionType === 'what_is_in_cell' && allItemsInGrid.length > 0) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      questionText = `¿Qué hay en la Fila ${r + 1}, Columna ${c + 1}?`;
      correctAnswer = String(grid[r][c]); 
      const distractors = shuffleArray(
        allItemsInGrid.filter(item => String(item) !== correctAnswer).map(item => String(item)) 
      ).slice(0, 3);
      options = shuffleArray([correctAnswer, ...distractors]);
      if (options.length < 2 && allItemsInGrid.length > 1) {
        const foundDistractor = allItemsInGrid.find(item => String(item) !== correctAnswer);
        options.push(foundDistractor ? String(foundDistractor) : "Otro Objeto"); 
      } else if (options.length < 2) {
          options.push("Otro Objeto");
      }
    } else if (questionType === 'where_is_item' && allItemsInGrid.length > 0) {
      const targetItem = allItemsInGrid[Math.floor(Math.random() * allItemsInGrid.length)];
      questionText = `¿En qué Fila y Columna está el objeto ${String(targetItem)}?`; 
      let found = false;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === targetItem) { 
            correctAnswer = `Fila ${r + 1}, Columna ${c + 1}`;
            found = true; break;
          }
        }
        if (found) break;
      }
      const distractorCoords: string[] = [];
      while (distractorCoords.length < 3) {
        const dr = Math.floor(Math.random() * rows) + 1;
        const dc = Math.floor(Math.random() * cols) + 1;
        const coordStr = `Fila ${dr}, Columna ${dc}`;
        if (coordStr !== correctAnswer && !distractorCoords.includes(coordStr)) {
          distractorCoords.push(coordStr);
        }
      }
      options = shuffleArray([correctAnswer, ...distractorCoords]);
    } else { // Fallback if no items or specific conditions not met
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      questionText = `¿Qué hay en la Fila ${r + 1}, Columna ${c + 1}?`;
      correctAnswer = grid[r][c] ? String(grid[r][c]) : "Vacío"; 
      options = shuffleArray([correctAnswer, "Opción B", "Opción C", "Opción D"].slice(0,4));
    }
    questions.push({ id: `${scenarioId}_q${i}`, text: questionText, options: shuffleArray(options.slice(0,4)), correctAnswer });
  }
  return questions;
};

export const UbicarEnTablaExercise: React.FC<UbicarEnTablaExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad
}) => {
  const [activeScenario, setActiveScenario] = useState<ActiveUbicarEnTablaScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_UBICAR_ICON);
  
  const [availableScenarios, setAvailableScenarios] = useState<UbicarEnTablaScenarioTemplate[]>([]);

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as UbicarEnTablaScenarioTemplate[];
    if (scenarioTemplates && scenarioTemplates.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarioTemplates]));
    }
  }, [exercise.data]);

  const loadNextScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as UbicarEnTablaScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as UbicarEnTablaScenarioTemplate[])]);
    }

    if (scenarioPool.length > 0) {
      const template = scenarioPool[0];
      const gridItems = generateGrid(template.gridSize.rows, template.gridSize.cols, template.possibleItems);
      const questions = generateQuestionsForGrid(gridItems, template.numQuestionsPerScenario, template.scenarioId);

      setActiveScenario({
        tableTitle: template.tableTitle,
        gridSize: template.gridSize,
        gridItems,
        questions,
        totalStarsPerScenario: template.totalStarsPerScenario,
        icon: template.icon || FACE_EMOJIS_UBICAR[Math.floor(Math.random() * FACE_EMOJIS_UBICAR.length)],
      });
      setAvailableScenarios(prev => prev.slice(1));
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsVerified(false);
      showFeedback(null);
      setCurrentEmoji(template.icon || FACE_EMOJIS_UBICAR[Math.floor(Math.random() * FACE_EMOJIS_UBICAR.length)]);
    } else {
      onAttempt(true); 
      return;
    }
  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  useEffect(() => {
    if ((exercise.data as UbicarEnTablaScenarioTemplate[])?.length > 0 && !activeScenario ) {
      loadNextScenario();
    }
  }, [exercise.data, activeScenario, loadNextScenario]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current && activeScenario) {
      if (currentQuestionIndex + 1 < activeScenario.questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsVerified(false);
        showFeedback(null);
        setCurrentEmoji(activeScenario.icon || FACE_EMOJIS_UBICAR[Math.floor(Math.random() * FACE_EMOJIS_UBICAR.length)]);
      } else { 
        loadNextScenario(); 
      }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentQuestionIndex, activeScenario, loadNextScenario, showFeedback]);

  const currentGeneratedQuestion = activeScenario?.questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    console.log('handleOptionSelect called with:', option);
    // Don't block selection if already verified correct - only condition where we should block
    if (isVerified && selectedOption === currentGeneratedQuestion?.correctAnswer) return;
    
    // Always set the selected option
    setSelectedOption(option);
    
    // Clear any feedback
    showFeedback(null);
    
    // If a different option was selected after verification, reset verification state
    if (isVerified) {
      console.log('Resetting verification state');
      setIsVerified(false);
    }
  };

  const verifyAnswer = useCallback(() => {
    console.log('verifyAnswer called, selectedOption:', selectedOption);
    
    // Validation checks
    if (!currentGeneratedQuestion || !activeScenario) {
      console.log('Missing question or scenario data');
      return;
    }
    
    if (selectedOption === null) {
      console.log('No option selected');
      return;
    }
    
    // Skip if already verified correct answer
    if (isVerified && selectedOption === currentGeneratedQuestion.correctAnswer) {
      console.log('Answer already verified as correct');
      return;
    }
    
    // Set verification state
    setIsVerified(true);
    
    // Check if answer is correct
    const isCorrect = selectedOption === currentGeneratedQuestion.correctAnswer;
    console.log('Answer is', isCorrect ? 'correct' : 'incorrect');
    
    // Notify scaffold of attempt
    onAttempt(isCorrect);

    // Show appropriate feedback
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Muy bien! Respuesta Correcta.' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. Fíjate bien en la tabla.' });
    }
  }, [currentGeneratedQuestion, activeScenario, selectedOption, isVerified, showFeedback, onAttempt]);
  
  const SimpleGridTable: React.FC<{ title: string; gridData: UbicarEnTablaItem[][] }> = ({ title, gridData }) => {
    // Remove unused numRows variable
    const numCols = gridData[0]?.length || 0;
    return (
      <div className="w-full max-w-xs sm:max-w-sm p-2 sm:p-3 bg-white rounded-lg shadow overflow-x-auto">
        <h3 className="text-sm sm:text-md font-semibold text-center text-slate-700 mb-2">{title}</h3>
        <table className="w-full text-xs sm:text-sm text-center border-collapse">
          <thead>
            <tr>
              <th className="p-1 border border-slate-300 bg-slate-100 text-black"></th> 
              {Array.from({ length: numCols }).map((_, cIndex) => (
                <th key={`col-h-${cIndex}`} scope="col" className="p-1 border border-slate-300 bg-slate-100 font-medium text-black">Columna {cIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridData.map((rowItems, rIndex) => (
              <tr key={`row-${rIndex}`}>
                <th scope="row" className="p-1 border border-slate-300 bg-slate-100 font-medium text-black">Fila {rIndex + 1}</th>
                {rowItems.map((item, cIndex) => (
                  <td key={`cell-${rIndex}-${cIndex}`} className="p-1 border border-slate-300 text-2xl sm:text-3xl h-12 sm:h-14">
                    {String(item)} 
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // OptionsSidebar component, now passed to setExternalKeypad
  const OptionsSidebar: React.FC = () => {
    if (!currentGeneratedQuestion) return null;
    
    // Add console logging for debugging button interactions
    const handleOptionClick = (option: string) => {
      console.log('Button clicked:', option);
      handleOptionSelect(option);
    };
    
    return (
      <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4">
        {currentGeneratedQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option; 
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
          
          // Revised button state logic
          if (isSelected) {
            if (isVerified) {
              buttonClass = option === currentGeneratedQuestion.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
          } else if (isVerified && option === currentGeneratedQuestion.correctAnswer) {
            buttonClass = 'bg-green-200 text-green-700 ring-1 ring-green-400'; // Now enabled
          } else if (isVerified) {
            // Only disable appearance but still allow interactions
            buttonClass = 'bg-slate-200 text-slate-600';
          }
          
          // Only disable the button if the answer is already verified and correct
          const shouldDisable = isVerified && selectedOption === currentGeneratedQuestion.correctAnswer;
          
          return (
            <button 
              key={index} 
              onClick={() => handleOptionClick(option)} 
              disabled={shouldDisable}
              className={`w-full p-2.5 sm:p-3 rounded-lg text-center text-sm sm:text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
        <button 
          onClick={() => {
            console.log('Verify button clicked');
            verifyAnswer();
          }} 
          disabled={!selectedOption || (isVerified && selectedOption === currentGeneratedQuestion.correctAnswer)}
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === currentGeneratedQuestion.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  };

  // Ensure keypad is properly rendered and updated
  useEffect(() => {
    console.log('External keypad effect running', {
      hasSetExternalKeypad: !!setExternalKeypad,
      hasQuestion: !!currentGeneratedQuestion,
      selectedOption,
      isVerified
    });
    
    if (setExternalKeypad) {
      if (currentGeneratedQuestion) {
        // Pass the keypad component with the latest state
        setExternalKeypad(<OptionsSidebar />);
        console.log('External keypad component set');
      } else {
        setExternalKeypad(null);
        console.log('External keypad set to null - no current question');
      }
    }
    
    // Cleanup function
    return () => {
      if (setExternalKeypad) {
        setExternalKeypad(null);
        console.log('External keypad cleanup');
      }
    };
  }, [
    setExternalKeypad, 
    currentGeneratedQuestion, 
    selectedOption, 
    isVerified
    // Note: handleOptionSelect and verifyAnswer are derived from the above state
    // and don't need to be in the dependency array
  ]);


  const MainContent: React.FC = () => {
    if (!activeScenario || !currentGeneratedQuestion) return <div className="p-4 text-xl text-slate-600">Cargando tabla y preguntas...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-sm p-2 max-w-[260px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <SimpleGridTable title={activeScenario.tableTitle} gridData={activeScenario.gridItems} />
        <p className="text-md sm:text-lg font-semibold text-slate-700 mt-3 min-h-[3em] flex items-center text-center justify-center px-2">
            {currentGeneratedQuestion.text}
        </p>
      </div>
    );
  };
  
  return <MainContent />;
};
