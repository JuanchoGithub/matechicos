
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExerciseScaffoldApi } from '../../types'; // Corrected import
import { Exercise as ExerciseType, TableScenarioTemplate, TableRowData, TableQuestion, TableQuestionTemplate } from '../../types';
import { Icons } from '../../components/icons';

// Interface for the fully generated and active scenario, including questions
interface ActiveTableScenarioData {
  tableTitle: string;
  columnHeaders: [string, string];
  rowData: TableRowData[];
  questions: TableQuestion[];
  totalStarsInScenario: number;
  icon?: string;
}

interface InterpretarTablaSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; // Added prop
}

const FACE_EMOJIS_TABLES = ['📋', '📊', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯'];
const DEFAULT_TABLE_ICON = '📋';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateNumericDistractorsTable = (correctValue: number, allTableValues: number[], numDistractors: number = 3, minVal?:number, maxVal?:number): string[] => {
    const distractors: Set<number> = new Set();
    const sortedUniqueTableValues = [...new Set(allTableValues)].sort((a, b) => a - b);
    
    for (const val of shuffleArray(sortedUniqueTableValues)) {
        if (distractors.size < numDistractors && val !== correctValue) {
            distractors.add(val);
        }
    }
    const minPossible = minVal !== undefined ? minVal : Math.max(0, correctValue - 10, Math.min(...allTableValues) - 5);
    const maxPossible = maxVal !== undefined ? maxVal : Math.min(correctValue + 10, Math.max(...allTableValues) + 5, Math.max(...allTableValues) * 1.5 );

    let attempts = 0;
    while (distractors.size < numDistractors && attempts < 20) {
        const randomDistractor = getRandomInt(Math.max(0, minPossible), Math.max(correctValue + 2, maxPossible));
        if (randomDistractor !== correctValue && !distractors.has(randomDistractor) && !allTableValues.includes(randomDistractor)) {
            distractors.add(randomDistractor);
        }
        attempts++;
    }
    if (distractors.size < numDistractors && correctValue > 0 && !distractors.has(correctValue - 1) && !allTableValues.includes(correctValue - 1) && (correctValue - 1 >=0)) distractors.add(correctValue - 1);
    if (distractors.size < numDistractors && !distractors.has(correctValue + 1) && !allTableValues.includes(correctValue + 1)) distractors.add(correctValue + 1);
    
    return Array.from(distractors).slice(0, numDistractors).map(String);
};

const generateDynamicTableQuestion = (
  template: TableQuestionTemplate,
  rowDataWithValue: TableRowData[],
  columnValueHeader: string, 
  questionIdPrefix: string
): TableQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  let correctAnswerIndex = -1;

  switch (template.type) {
    case 'findMaxRow': {
      const maxVal = Math.max(...rowDataWithValue.map(r => r.value));
      const candidates = rowDataWithValue.filter(r => r.value === maxVal);
      const targetRow = candidates[0]; 
      text = `¿Quién/Qué tiene más ${columnValueHeader.toLowerCase()}?`;
      options = rowDataWithValue.map(r => r.name);
      correctAnswer = targetRow.name;
      break;
    }
    case 'findMinRow': {
      const minVal = Math.min(...rowDataWithValue.map(r => r.value));
      const candidates = rowDataWithValue.filter(r => r.value === minVal);
      const targetRow = candidates[0]; 
      text = `¿Quién/Qué tiene menos ${columnValueHeader.toLowerCase()}?`;
      options = rowDataWithValue.map(r => r.name);
      correctAnswer = targetRow.name;
      break;
    }
    case 'findSpecificValue': {
      const targetRow = rowDataWithValue[Math.floor(Math.random() * rowDataWithValue.length)];
      text = `¿Cuántos ${columnValueHeader.toLowerCase()} tiene ${targetRow.name}?`;
      correctAnswer = targetRow.value.toString();
      const distractors = generateNumericDistractorsTable(targetRow.value, rowDataWithValue.map(r => r.value));
      options = shuffleArray([correctAnswer, ...distractors]);
      break;
    }
    case 'compareTwoRows': {
      let rowA = rowDataWithValue[Math.floor(Math.random() * rowDataWithValue.length)];
      let rowB;
      do {
        rowB = rowDataWithValue[Math.floor(Math.random() * rowDataWithValue.length)];
      } while (rowA.name === rowB.name || rowA.value === rowB.value); 
      if (rowA.value < rowB.value) [rowA, rowB] = [rowB, rowA]; 
      
      text = `¿Cuántos ${columnValueHeader.toLowerCase()} más tiene ${rowA.name} que ${rowB.name}?`;
      const difference = rowA.value - rowB.value;
      correctAnswer = difference.toString();
      const distractors = generateNumericDistractorsTable(difference, rowDataWithValue.map(r => r.value), 3, 1, Math.max(rowA.value, rowB.value));
      options = shuffleArray([correctAnswer, ...distractors]);
      break;
    }
    case 'findTotalColumnValue': {
      const totalSum = rowDataWithValue.reduce((sum, r) => sum + r.value, 0);
      text = `¿Cuántos ${columnValueHeader.toLowerCase()} hay en total?`;
      correctAnswer = totalSum.toString();
      const distractors = generateNumericDistractorsTable(totalSum, rowDataWithValue.map(r => r.value), 3, Math.floor(totalSum * 0.5), Math.ceil(totalSum * 1.5));
      options = shuffleArray([correctAnswer, ...distractors]);
      break;
    }
  }
  const finalOptions = Array.from(new Set(options.slice(0,4)));
  if (!finalOptions.includes(correctAnswer) && finalOptions.length === 4) {
      finalOptions[Math.floor(Math.random() * finalOptions.length)] = correctAnswer;
  } else if(!finalOptions.includes(correctAnswer)) {
      finalOptions.push(correctAnswer);
  }
  const shuffledFinalOptions = shuffleArray(finalOptions);
  correctAnswerIndex = shuffledFinalOptions.indexOf(correctAnswer);
  
  return { id: `${questionIdPrefix}_${template.id}`, text, options: shuffledFinalOptions, correctAnswerIndex };
};


const OptionsSidebar: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  if (!options || options.length === 0) {
    return null; 
  }
  return (
    <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4">
      {options.map((option, index) => {
        const isCorrectOption = option === correctAnswer;
        const isSelected = selectedOption === option;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isSelected) {
          if (isVerified) {
            buttonClass = isCorrectOption
              ? 'bg-green-500 text-white ring-2 ring-green-700' 
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else {
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
        } else if (isVerified && isCorrectOption) {
          // buttonClass = 'bg-green-200 text-green-700 ring-1 ring-green-400'; // Optionally highlight correct
        } else if (isVerified) {
          buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        }
        return (
          <button key={index} onClick={() => onSelect(option)} disabled={isVerified && isSelected && isCorrectOption} 
                  className={`w-full p-2.5 sm:p-3 rounded-lg text-center text-sm sm:text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}>
            {option}
          </button>
        );
      })}
      <button onClick={onVerify} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)}
              className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}>
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};


export const InterpretarTablaSimpleExercise: React.FC<InterpretarTablaSimpleExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad
}) => {
  const [activeScenarioInstance, setActiveScenarioInstance] = useState<ActiveTableScenarioData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_TABLE_ICON);

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;

  useEffect(() => {
    const scenarioTemplates = exercise.data as TableScenarioTemplate[];
    if (scenarioTemplates && scenarioTemplates.length > 0) {
      const randomTemplateIndex = Math.floor(Math.random() * scenarioTemplates.length);
      const selectedTemplate = scenarioTemplates[randomTemplateIndex];

      let tempActiveRowData: TableRowData[] = selectedTemplate.rowCategories.map(catTemplate => ({
        name: catTemplate.name,
        value: getRandomInt(catTemplate.valueRange[0], catTemplate.valueRange[1]),
      }));
      
      const activeRowData = tempActiveRowData;

      const generatedQuestions: TableQuestion[] = selectedTemplate.questionTemplates.map(qTemplate => 
        generateDynamicTableQuestion(qTemplate, activeRowData, selectedTemplate.columnHeaders[1], selectedTemplate.scenarioId)
      );
      
      setActiveScenarioInstance({
        tableTitle: selectedTemplate.tableTitle,
        columnHeaders: selectedTemplate.columnHeaders,
        rowData: activeRowData,
        questions: generatedQuestions,
        totalStarsInScenario: selectedTemplate.totalStarsPerScenario,
        icon: selectedTemplate.icon || FACE_EMOJIS_TABLES[Math.floor(Math.random() * FACE_EMOJIS_TABLES.length)]
      });

      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsVerified(false);
      showFeedback(null);
      setCurrentEmoji(selectedTemplate.icon || FACE_EMOJIS_TABLES[Math.floor(Math.random() * FACE_EMOJIS_TABLES.length)]);
    }
  }, [exercise.id, exercise.data, showFeedback]);

  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);
  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current && activeScenarioInstance) {
        if (currentQuestionIndex + 1 < activeScenarioInstance.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsVerified(false);
            showFeedback(null);
            setCurrentEmoji(activeScenarioInstance.icon || FACE_EMOJIS_TABLES[Math.floor(Math.random() * FACE_EMOJIS_TABLES.length)]);
        }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentQuestionIndex, activeScenarioInstance, showFeedback]);


  const currentQuestion = activeScenarioInstance?.questions[currentQuestionIndex];

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentQuestion?.options[currentQuestion?.correctAnswerIndex || 0]) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentQuestion?.options[currentQuestion?.correctAnswerIndex || 0]) setIsVerified(false);
  }, [isVerified, selectedOption, currentQuestion, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentQuestion || !activeScenarioInstance || selectedOption === null || (isVerified && selectedOption === currentQuestion.options[currentQuestion.correctAnswerIndex])) return;
    setIsVerified(true);
    const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswerIndex];
    const isCorrect = selectedOption === correctAnswerText;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Respuesta Correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Revisa la tabla!' });
    }
  }, [currentQuestion, activeScenarioInstance, selectedOption, isVerified, showFeedback, onAttempt]);
  
  useEffect(() => {
    if (setExternalKeypad) {
      if (currentQuestion) {
        const keypadProps = {
          options: currentQuestion.options,
          selectedOption: selectedOption,
          onSelect: handleOptionSelect,
          onVerify: verifyAnswer,
          isVerified: isVerified,
          correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex],
        };
        setExternalKeypad(<OptionsSidebar {...keypadProps} />);
      } else {
         setExternalKeypad(null); 
      }
    }
    return () => {
      if (setExternalKeypad) {
        setExternalKeypad(null);
      }
    };
  }, [setExternalKeypad, currentQuestion, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);


  const DataTable: React.FC<{ title: string; headers: [string, string]; data: TableRowData[] }> = ({ title, headers, data }) => {
    return (
      <div className="w-full max-w-md p-3 bg-white rounded-lg shadow">
        <h3 className="text-md font-semibold text-center text-slate-700 mb-3">{title}</h3>
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-black uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-4 py-2">{headers[0]}</th>
              <th scope="col" className="px-4 py-2 text-right">{headers[1]}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200`}>
                <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{row.name}</td>
                <td className="px-4 py-2 text-right">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const MainContent: React.FC = () => {
    if (!activeScenarioInstance || !currentQuestion) return <div className="p-4 text-xl text-slate-600">Cargando tabla...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-blue-500 text-white text-sm p-2 max-w-[260px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <DataTable title={activeScenarioInstance.tableTitle} headers={activeScenarioInstance.columnHeaders} data={activeScenarioInstance.rowData} />
        <p className="text-md sm:text-lg font-semibold text-slate-700 mt-3 min-h-[3em] flex items-center text-center justify-center px-2">
            {currentQuestion.text}
        </p>
      </div>
    );
  };
  
  return <MainContent />;
};
