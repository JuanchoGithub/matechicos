
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExerciseScaffoldApi } from '../../types'; 
import { Exercise as ExerciseType, AvatarData, TableDobleEntradaScenarioTemplate, TableDobleEntradaQuestionTemplate, TableCellData, TableQuestion } from '../../types';
import { Icons } from '../../components/icons';

// Interface for the fully generated and active double entry table scenario
interface ActiveTableDobleEntradaScenarioData {
  tableTitle: string;
  rowHeaders: string[];
  columnHeaders: string[];
  cellData: TableCellData[][]; 
  questions: TableQuestion[];   
  totalStarsPerScenario: number;
  icon?: string;
  valueAxisLabel: string;
}


interface InterpretarTablaDobleEntradaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; 
}

const FACE_EMOJIS_TABLE_DE = ['📊', '📋', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯', '📈', '📉'];
const DEFAULT_TABLE_DE_ICON = '📋';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// generateNumericDistractorsDE and generateDynamicTableDEQuestion would be defined here.
const generateNumericDistractorsDE = (correctValue: number, allCellValues: number[], numDistractors: number = 3, minVal?:number, maxVal?:number): string[] => {
    const distractors: Set<number> = new Set();
    const sortedUniqueValues = [...new Set(allCellValues)].sort((a, b) => a - b);
    
    for (const val of shuffleArray(sortedUniqueValues)) {
        if (distractors.size < numDistractors && val !== correctValue) distractors.add(val);
    }
    const minPossible = minVal !== undefined ? minVal : Math.max(0, correctValue - 10, Math.min(...allCellValues, correctValue) - 5);
    const maxPossible = maxVal !== undefined ? maxVal : Math.min(correctValue + 10, Math.max(...allCellValues, correctValue) + 5, Math.max(...allCellValues, correctValue) * 1.5 );

    let attempts = 0;
    while (distractors.size < numDistractors && attempts < 50) { 
        const randomDistractor = getRandomInt(Math.max(0, minPossible), Math.max(correctValue + 2, maxPossible));
        if (randomDistractor !== correctValue && !distractors.has(randomDistractor) && !allCellValues.includes(randomDistractor)) {
            distractors.add(randomDistractor);
        }
        attempts++;
    }
    const variations = [correctValue - 1, correctValue + 1, correctValue - 2, correctValue + 2, Math.floor(correctValue / 2), correctValue * 2];
    for (const v of variations) {
        if (distractors.size < numDistractors && v !== correctValue && v >= 0 && !distractors.has(v) && !allCellValues.includes(v)) {
             distractors.add(v);
        }
    }
    return Array.from(distractors).slice(0, numDistractors).map(String);
};

const generateDynamicTableDEQuestion = (
  template: TableDobleEntradaQuestionTemplate, 
  activeData: ActiveTableDobleEntradaScenarioData 
): TableQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  const { rowHeaders, columnHeaders, cellData, valueAxisLabel } = activeData;
  const allCellValuesFlat = cellData.flat().map(cell => cell.value);
  const getRandomRowIndex = () => getRandomInt(0, rowHeaders.length - 1);
  const getRandomColIndex = () => getRandomInt(0, columnHeaders.length - 1);

  switch (template.type) {
    case 'findSpecificCellValue': {
      const rIdx = template.targetRowName ? rowHeaders.indexOf(template.targetRowName) : getRandomRowIndex();
      const cIdx = template.targetColName ? columnHeaders.indexOf(template.targetColName) : getRandomColIndex();
      const rowName = rowHeaders[rIdx];
      const colName = columnHeaders[cIdx];
      const cellValue = cellData[rIdx][cIdx].value;
      text = `¿Cuántos ${valueAxisLabel.toLowerCase()} de ${rowName.toLowerCase()} hubo en ${colName.toLowerCase()}?`;
      correctAnswer = cellValue.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsDE(cellValue, allCellValuesFlat)]);
      break;
    }
    case 'findRowTotal': {
      const rIdx = template.targetRowName ? rowHeaders.indexOf(template.targetRowName) : getRandomRowIndex();
      const rowName = rowHeaders[rIdx];
      const total = cellData[rIdx].reduce((sum, cell) => sum + cell.value, 0);
      text = `¿Cuántos ${valueAxisLabel.toLowerCase()} de ${rowName.toLowerCase()} hubo en total?`;
      correctAnswer = total.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsDE(total, allCellValuesFlat)]);
      break;
    }
    case 'findColumnTotal': {
      const cIdx = template.targetColName ? columnHeaders.indexOf(template.targetColName) : getRandomColIndex();
      const colName = columnHeaders[cIdx];
      const total = cellData.reduce((sum, row) => sum + row[cIdx].value, 0);
      text = `¿Cuántos ${valueAxisLabel.toLowerCase()} hubo en total en ${colName.toLowerCase()}?`;
      correctAnswer = total.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsDE(total, allCellValuesFlat)]);
      break;
    }
    case 'findGrandTotal': {
      const total = allCellValuesFlat.reduce((sum, val) => sum + val, 0);
      text = `¿Cuántos ${valueAxisLabel.toLowerCase()} hubo en total general?`;
      correctAnswer = total.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsDE(total, allCellValuesFlat)]);
      break;
    }
    case 'compareTwoCellValues': {
        const r1Idx = template.cell1Coords ? rowHeaders.indexOf(template.cell1Coords.rowName) : getRandomRowIndex();
        const c1Idx = template.cell1Coords ? columnHeaders.indexOf(template.cell1Coords.colName) : getRandomColIndex();
        let r2Idx, c2Idx;
        do {
            r2Idx = template.cell2Coords ? rowHeaders.indexOf(template.cell2Coords.rowName) : getRandomRowIndex();
            c2Idx = template.cell2Coords ? columnHeaders.indexOf(template.cell2Coords.colName) : getRandomColIndex();
        } while (r1Idx === r2Idx && c1Idx === c2Idx); 
        const val1 = cellData[r1Idx][c1Idx].value;
        const val2 = cellData[r2Idx][c2Idx].value;
        const diff = Math.abs(val1 - val2);
        const item1Desc = `${rowHeaders[r1Idx]} en ${columnHeaders[c1Idx]}`;
        const item2Desc = `${rowHeaders[r2Idx]} en ${columnHeaders[c2Idx]}`;
        text = `¿Cuál es la diferencia en ${valueAxisLabel.toLowerCase()} entre ${item1Desc.toLowerCase()} y ${item2Desc.toLowerCase()}?`;
        correctAnswer = diff.toString();
        options = shuffleArray([correctAnswer, ...generateNumericDistractorsDE(diff, allCellValuesFlat, 3, 0, Math.max(val1, val2))]);
        break;
    }
    case 'findCategoryWithMaxInRow': {
        const rIdx = template.targetRowName ? rowHeaders.indexOf(template.targetRowName) : getRandomRowIndex();
        const rowName = rowHeaders[rIdx];
        const rowValues = cellData[rIdx].map(cell => cell.value);
        const maxVal = Math.max(...rowValues);
        const maxIndices = rowValues.reduce((indices, val, idx) => (val === maxVal ? [...indices, idx] : indices), [] as number[]);
        const correctColName = columnHeaders[maxIndices[Math.floor(Math.random() * maxIndices.length)]];
        text = `Para ${rowName.toLowerCase()}, ¿en qué ${columnHeaders[0].toLowerCase().includes("partido") ? "partido" : columnHeaders[0].toLowerCase().includes("día") ? "día" : "categoría"} hubo más ${valueAxisLabel.toLowerCase()}?`;
        options = shuffleArray([...columnHeaders]);
        correctAnswer = correctColName;
        break;
    }
    case 'findCategoryWithMaxForColumn': {
        const cIdx = template.targetColName ? columnHeaders.indexOf(template.targetColName) : getRandomColIndex();
        const colName = columnHeaders[cIdx];
        const colValues = cellData.map(row => row[cIdx].value);
        const maxVal = Math.max(...colValues);
        const maxIndices = colValues.reduce((indices, val, idx) => (val === maxVal ? [...indices, idx] : indices), [] as number[]);
        const correctRowName = rowHeaders[maxIndices[Math.floor(Math.random() * maxIndices.length)]];
        text = `En ${colName.toLowerCase()}, ¿qué ${rowHeaders[0].toLowerCase().split(' ')[0]} tuvo más ${valueAxisLabel.toLowerCase()}?`;
        options = shuffleArray([...rowHeaders]);
        correctAnswer = correctRowName;
        break;
    }
     case 'findCategoryWithMinInRow': {
        const rIdx = template.targetRowName ? rowHeaders.indexOf(template.targetRowName) : getRandomRowIndex();
        const rowName = rowHeaders[rIdx];
        const rowValues = cellData[rIdx].map(cell => cell.value);
        const minVal = Math.min(...rowValues);
        const minIndices = rowValues.reduce((indices, val, idx) => (val === minVal ? [...indices, idx] : indices), [] as number[]);
        const correctColName = columnHeaders[minIndices[Math.floor(Math.random() * minIndices.length)]];
        text = `Para ${rowName.toLowerCase()}, ¿en qué ${columnHeaders[0].toLowerCase().includes("partido") ? "partido" : columnHeaders[0].toLowerCase().includes("día") ? "día" : "categoría"} hubo menos ${valueAxisLabel.toLowerCase()}?`;
        options = shuffleArray([...columnHeaders]);
        correctAnswer = correctColName;
        break;
    }
    case 'findCategoryWithMinForColumn': {
        const cIdx = template.targetColName ? columnHeaders.indexOf(template.targetColName) : getRandomColIndex();
        const colName = columnHeaders[cIdx];
        const colValues = cellData.map(row => row[cIdx].value);
        const minVal = Math.min(...colValues);
        const minIndices = colValues.reduce((indices, val, idx) => (val === minVal ? [...indices, idx] : indices), [] as number[]);
        const correctRowName = rowHeaders[minIndices[Math.floor(Math.random() * minIndices.length)]];
        text = `En ${colName.toLowerCase()}, ¿qué ${rowHeaders[0].toLowerCase().split(' ')[0]} tuvo menos ${valueAxisLabel.toLowerCase()}?`;
        options = shuffleArray([...rowHeaders]);
        correctAnswer = correctRowName;
        break;
    }
    default: text = "Pregunta no implementada"; options = ["N/A"]; correctAnswer = "N/A";
  }
  const finalOptions = Array.from(new Set(options.slice(0,4))); 
  if (!finalOptions.includes(correctAnswer) && finalOptions.length === 4) {
      finalOptions[Math.floor(Math.random() * finalOptions.length)] = correctAnswer;
  } else if(!finalOptions.includes(correctAnswer)) {
      finalOptions.push(correctAnswer);
  }
  return { id: `${template.id}_${Date.now()}`, text, options: shuffleArray(finalOptions), correctAnswerIndex: shuffleArray(finalOptions).indexOf(correctAnswer) };
};

// OptionsSidebar component defined at the file level
const OptionsSidebar: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  if (!options || options.length === 0) return <div className="p-4 text-slate-400">Cargando opciones...</div>;
  return (
      <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4">
      {options.map((option, index) => {
          const isSelected = selectedOption === option;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
          if (isSelected) {
          if (isVerified) {
              buttonClass = option === correctAnswer
              ? 'bg-green-500 text-white ring-2 ring-green-700' 
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else {
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          } else if (isVerified && option === correctAnswer) {
            // buttonClass = 'bg-green-200 text-green-700 ring-1 ring-green-400'; // Optionally highlight correct
          } else if (isVerified) {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          return (
          <button key={index} onClick={() => onSelect(option)} disabled={isVerified && selectedOption === correctAnswer} 
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

export const InterpretarTablaDobleEntradaExercise: React.FC<InterpretarTablaDobleEntradaExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad 
}) => {
  const [activeScenarioInstance, setActiveScenarioInstance] = useState<ActiveTableDobleEntradaScenarioData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_TABLE_DE_ICON);
  
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as TableDobleEntradaScenarioTemplate[];
    if (scenarioTemplates && scenarioTemplates.length > 0) {
      const randomTemplateIndex = Math.floor(Math.random() * scenarioTemplates.length);
      const selectedTemplate = scenarioTemplates[randomTemplateIndex];

      const activeCellData: TableCellData[][] = selectedTemplate.rowHeaders.map(() => 
        selectedTemplate.columnHeaders.map(() => ({
          value: getRandomInt(selectedTemplate.cellValueRange[0], selectedTemplate.cellValueRange[1]),
        }))
      );
      
      const tempActiveData: ActiveTableDobleEntradaScenarioData = {
        tableTitle: selectedTemplate.tableTitle,
        rowHeaders: selectedTemplate.rowHeaders,
        columnHeaders: selectedTemplate.columnHeaders,
        cellData: activeCellData,
        questions: [], 
        totalStarsPerScenario: selectedTemplate.totalStarsPerScenario,
        icon: selectedTemplate.icon || FACE_EMOJIS_TABLE_DE[Math.floor(Math.random() * FACE_EMOJIS_TABLE_DE.length)],
        valueAxisLabel: selectedTemplate.valueAxisLabel,
      };

      const shuffledQuestionTemplates = shuffleArray([...selectedTemplate.questionTemplates]);
      const questionsToGenerate = Math.min(shuffledQuestionTemplates.length, selectedTemplate.totalStarsPerScenario);

      const generatedQuestions: TableQuestion[] = shuffledQuestionTemplates.slice(0, questionsToGenerate).map(qTemplate => 
        generateDynamicTableDEQuestion(qTemplate, tempActiveData)
      );
      
      setActiveScenarioInstance({ ...tempActiveData, questions: generatedQuestions });
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsVerified(false);
      showFeedback(null);
      setCurrentEmoji(selectedTemplate.icon || FACE_EMOJIS_TABLE_DE[Math.floor(Math.random() * FACE_EMOJIS_TABLE_DE.length)]);
    }
  }, [exercise.id, exercise.data, showFeedback]); // Removed scaffoldApi from deps as it's stable via ref

   useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current && activeScenarioInstance) {
        if (currentQuestionIndex + 1 < activeScenarioInstance.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsVerified(false);
            showFeedback(null);
            setCurrentEmoji(activeScenarioInstance.icon || FACE_EMOJIS_TABLE_DE[Math.floor(Math.random() * FACE_EMOJIS_TABLE_DE.length)]);
        }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentQuestionIndex, activeScenarioInstance, showFeedback]);

  const currentQuestion = activeScenarioInstance?.questions[currentQuestionIndex];

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && currentQuestion && selectedOption === currentQuestion.options[currentQuestion.correctAnswerIndex]) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && currentQuestion && selectedOption !== currentQuestion.options[currentQuestion.correctAnswerIndex]) setIsVerified(false);
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
  
  const DataTableDobleEntrada: React.FC<{ title: string; rowHeaders: string[]; colHeaders: string[]; data: TableCellData[][]; valueAxisLabel: string }> = 
    ({ title, rowHeaders, colHeaders, data, valueAxisLabel }) => {
    return (
      <div className="w-full max-w-lg p-2 sm:p-3 bg-white rounded-lg shadow overflow-x-auto">
        <h3 className="text-md font-semibold text-center text-slate-700 mb-2 sm:mb-3">{title}</h3>
        <table className="w-full text-xs sm:text-sm text-left text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th scope="col" className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-black">{valueAxisLabel}</th>
              {colHeaders.map(header => (
                <th key={header} scope="col" className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-center font-medium text-black">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowHeaders.map((rowHeader, rIndex) => (
              <tr key={rowHeader} className={`${rIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <th scope="row" className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 font-medium text-slate-800 whitespace-nowrap">{rowHeader}</th>
                {colHeaders.map((_, cIndex) => (
                  <td key={`${rowHeader}-${cIndex}`} className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-center">
                    {data[rIndex] && data[rIndex][cIndex] ? data[rIndex][cIndex].value : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    if (setExternalKeypad && currentQuestion) {
      setExternalKeypad(
        <OptionsSidebar
          options={currentQuestion.options}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswer={currentQuestion.options[currentQuestion.correctAnswerIndex]}
        />
      );
    }
    return () => {
      if (setExternalKeypad) {
        setExternalKeypad(null);
      }
    };
  }, [setExternalKeypad, currentQuestion, selectedOption, isVerified, handleOptionSelect, verifyAnswer]); // Added handleOptionSelect and verifyAnswer to dependencies


  const MainContent: React.FC = () => {
    if (!activeScenarioInstance || !currentQuestion) return <div className="p-4 text-xl text-slate-600">Cargando tabla de doble entrada...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-teal-600 text-white text-sm p-2 max-w-[260px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <DataTableDobleEntrada 
            title={activeScenarioInstance.tableTitle} 
            rowHeaders={activeScenarioInstance.rowHeaders} 
            colHeaders={activeScenarioInstance.columnHeaders} 
            data={activeScenarioInstance.cellData}
            valueAxisLabel={activeScenarioInstance.valueAxisLabel}
        />
        <p className="text-md sm:text-lg font-semibold text-slate-700 mt-3 min-h-[3em] flex items-center text-center justify-center px-2">
            {currentQuestion.text}
        </p>
      </div>
    );
  };
  
  return <MainContent />;
};
