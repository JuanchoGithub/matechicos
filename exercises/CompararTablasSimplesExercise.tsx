
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, CompararTablasSimplesScenarioTemplate, CompararTablasSimplesQuestionTemplate, SimpleTableDataForComparison, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ActiveCompararTablasScenario {
  scenarioId: string;
  description: string;
  tableA: SimpleTableDataForComparison;
  tableB: SimpleTableDataForComparison;
  questions: GeneratedTableComparisonQuestion[];
  totalStarsPerScenario: number;
  icon?: string;
}

interface GeneratedTableComparisonQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface CompararTablasSimplesExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_COMPARE_TABLES = ['📊', '🆚', '🤔', '🧐', '💡', '📈', '📉'];
const DEFAULT_COMPARE_ICON = '🆚';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateComparisonQuestions = (
  scenarioTemplate: CompararTablasSimplesScenarioTemplate,
  randomizedTableA: SimpleTableDataForComparison,
  randomizedTableB: SimpleTableDataForComparison
): GeneratedTableComparisonQuestion[] => {
  const questions: GeneratedTableComparisonQuestion[] = [];
  const valueHeader = randomizedTableA.valueHeader.toLowerCase();

  for (const qTemplate of scenarioTemplate.questionTemplates) {
    let text = "";
    let correctAnswer = "";
    const options: string[] = [];

    switch (qTemplate.type) {
      case 'compareCategoryBetweenTables':
        if (qTemplate.targetCategoryName) {
          const catName = qTemplate.targetCategoryName;
          const valA = randomizedTableA.rows.find(r => r.name === catName)?.value || 0;
          const valB = randomizedTableB.rows.find(r => r.name === catName)?.value || 0;
          options.push(randomizedTableA.title, randomizedTableB.title);
          if (valA === valB) options.push("Ambas (igual cantidad)");

          if (valA === valB) {
            text = `¿${catName} tiene la misma cantidad de ${valueHeader} en ambas tablas?`;
            correctAnswer = "Ambas (igual cantidad)";
            options.length = 0; 
            options.push("Sí, tienen igual cantidad", `No, ${randomizedTableA.title} tiene más`, `No, ${randomizedTableB.title} tiene más`);
            correctAnswer = "Sí, tienen igual cantidad";
          } else {
            text = `¿En qué tabla ${catName} tiene ${qTemplate.comparisonType === 'more' ? 'más' : qTemplate.comparisonType === 'less' ? 'menos' : 'igual'} ${valueHeader}?`;
            if (qTemplate.comparisonType === 'more') correctAnswer = valA > valB ? randomizedTableA.title : randomizedTableB.title;
            else if (qTemplate.comparisonType === 'less') correctAnswer = valA < valB ? randomizedTableA.title : randomizedTableB.title;
            else correctAnswer = "Ambas (igual cantidad)"; 
          }
        }
        break;
      case 'findDifferenceForCategory':
        if (qTemplate.targetCategoryName) {
          const catName = qTemplate.targetCategoryName;
          const valA = randomizedTableA.rows.find(r => r.name === catName)?.value || 0;
          const valB = randomizedTableB.rows.find(r => r.name === catName)?.value || 0;
          const difference = Math.abs(valA - valB);
          text = `¿Cuál es la diferencia de ${valueHeader} para ${catName} entre las tablas?`;
          correctAnswer = difference.toString();
          const allValues = [...randomizedTableA.rows.map(r=>r.value), ...randomizedTableB.rows.map(r=>r.value)];
          const distractors = shuffleArray(allValues.filter(v => v !== difference).map(String)).slice(0,2);
          distractors.push((difference + 5).toString(), Math.max(0, difference - 2).toString());
          options.push(correctAnswer, ...shuffleArray(Array.from(new Set(distractors))).slice(0,3));
        }
        break;
      case 'whichTableHasMaxForCategory':
         if (qTemplate.targetCategoryName) {
          const catName = qTemplate.targetCategoryName;
          const valA = randomizedTableA.rows.find(r => r.name === catName)?.value || 0;
          const valB = randomizedTableB.rows.find(r => r.name === catName)?.value || 0;
          text = `Para ${catName}, ¿qué tabla muestra más ${valueHeader}?`;
          options.push(randomizedTableA.title, randomizedTableB.title);
          if (valA === valB) options.push("Ambas por igual");
          if (valA > valB) correctAnswer = randomizedTableA.title;
          else if (valB > valA) correctAnswer = randomizedTableB.title;
          else correctAnswer = "Ambas por igual";
        }
        break;
      case 'whichTableHasMaxOverall': {
        const maxA = Math.max(...randomizedTableA.rows.map(r => r.value));
        const maxB = Math.max(...randomizedTableB.rows.map(r => r.value));
        text = `¿En qué tabla se encuentra el valor más alto de ${valueHeader} en general?`;
        options.push(randomizedTableA.title, randomizedTableB.title);
        if (maxA === maxB) options.push("Ambas tienen el mismo máximo");
        if (maxA > maxB) correctAnswer = randomizedTableA.title;
        else if (maxB > maxA) correctAnswer = randomizedTableB.title;
        else correctAnswer = "Ambas tienen el mismo máximo";
        break;
      }
       case 'whichTableHasMinOverall': {
        const minA = Math.min(...randomizedTableA.rows.map(r => r.value));
        const minB = Math.min(...randomizedTableB.rows.map(r => r.value));
        text = `¿En qué tabla se encuentra el valor más bajo de ${valueHeader} en general?`;
        options.push(randomizedTableA.title, randomizedTableB.title);
        if (minA === minB) options.push("Ambas tienen el mismo mínimo");
        if (minA < minB) correctAnswer = randomizedTableA.title;
        else if (minB < minA) correctAnswer = randomizedTableB.title;
        else correctAnswer = "Ambas tienen el mismo mínimo";
        break;
      }
      default: text = "Pregunta no configurada."; correctAnswer = "N/A"; options.push("N/A");
    }
    const finalOptions = Array.from(new Set(options.slice(0,4)));
    if (!finalOptions.includes(correctAnswer) && finalOptions.length === 4) {
        finalOptions[Math.floor(Math.random() * finalOptions.length)] = correctAnswer;
    } else if (!finalOptions.includes(correctAnswer)) {
        finalOptions.push(correctAnswer);
    }
    questions.push({ id: qTemplate.id, text, options: shuffleArray(finalOptions), correctAnswer });
  }
  return questions;
};

// Define OptionsSidebar as a standalone component
const OptionsSidebarComponent: React.FC<{
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
        <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4 max-w-sm mx-auto">
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
            // buttonClass = 'bg-green-200 text-green-700 ring-1 ring-green-400'; 
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


export const CompararTablasSimplesExercise: React.FC<CompararTablasSimplesExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad
}) => {
  const [activeScenario, setActiveScenario] = useState<ActiveCompararTablasScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_COMPARE_ICON);
  const [availableScenarios, setAvailableScenarios] = useState<CompararTablasSimplesScenarioTemplate[]>([]);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as CompararTablasSimplesScenarioTemplate[] || [];
    if (scenarioTemplates.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarioTemplates]));
    }
  }, [exercise.id, exercise.data]); // Added exercise.id to reset if the whole exercise changes

  const loadNewScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as CompararTablasSimplesScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as CompararTablasSimplesScenarioTemplate[])]);
    }
    if (scenarioPool.length === 0) {
        onAttempt(true); 
        return;
    }

    const template = scenarioPool[0];
    const randomizeTableData = (tableDef: SimpleTableDataForComparison): SimpleTableDataForComparison => ({
      ...tableDef,
      rows: tableDef.rows.map(row => ({
        ...row,
        value: getRandomInt(template.valueRangeForRandomization[0], template.valueRangeForRandomization[1]),
      })),
    });

    const randomizedTableA = randomizeTableData(template.tableA);
    const randomizedTableB = randomizeTableData(template.tableB);
    const questions = generateComparisonQuestions(template, randomizedTableA, randomizedTableB);

    setActiveScenario({
      scenarioId: template.scenarioId,
      description: template.description,
      tableA: randomizedTableA,
      tableB: randomizedTableB,
      questions,
      totalStarsPerScenario: template.totalStarsPerScenario,
      icon: template.icon || DEFAULT_COMPARE_ICON,
    });
    setAvailableScenarios(prev => prev.slice(1));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
    setCurrentEmoji(template.icon || FACE_EMOJIS_COMPARE_TABLES[Math.floor(Math.random() * FACE_EMOJIS_COMPARE_TABLES.length)]);
  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((exercise.data as CompararTablasSimplesScenarioTemplate[])?.length > 0 && !activeScenario) {
      loadNewScenario();
    }
  }, [exercise.data, activeScenario, loadNewScenario]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current && activeScenario) {
        if (currentQuestionIndex + 1 < activeScenario.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsVerified(false);
            showFeedback(null);
        } else {
            loadNewScenario(); 
        }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentQuestionIndex, activeScenario, loadNewScenario, showFeedback]);

  const currentGeneratedQuestion = activeScenario?.questions[currentQuestionIndex];

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentGeneratedQuestion?.correctAnswer) return;
    setSelectedOption(option);
    showFeedback(null);
    if (isVerified && selectedOption !== currentGeneratedQuestion?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentGeneratedQuestion, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentGeneratedQuestion || !activeScenario || selectedOption === null || (isVerified && selectedOption === currentGeneratedQuestion.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentGeneratedQuestion.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Compara con atención!' });
    }
  }, [currentGeneratedQuestion, activeScenario, selectedOption, isVerified, showFeedback, onAttempt]);
  

  useEffect(() => {
    if (setExternalKeypad) {
        if (currentGeneratedQuestion) {
            setExternalKeypad(
                <OptionsSidebarComponent
                    options={currentGeneratedQuestion.options}
                    selectedOption={selectedOption}
                    onSelect={handleOptionSelect}
                    onVerify={verifyAnswer}
                    isVerified={isVerified}
                    correctAnswer={currentGeneratedQuestion.correctAnswer}
                />
            );
        } else {
             setExternalKeypad(null);
        }
    }
    return () => {
        if (setExternalKeypad) setExternalKeypad(null);
    }
  }, [setExternalKeypad, currentGeneratedQuestion, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  const SimpleTableDisplay: React.FC<{ tableData: SimpleTableDataForComparison }> = ({ tableData }) => (
    <div className="w-full p-2 bg-white rounded shadow-md">
      <h4 className="text-sm font-semibold text-center text-slate-700 mb-1.5">{tableData.title}</h4>
      <table className="w-full text-xs text-left text-slate-600">
        <thead className="bg-slate-100">
          <tr>
            <th scope="col" className="px-2 py-1 border border-slate-300 text-black">{tableData.categoryHeader}</th>
            <th scope="col" className="px-2 py-1 border border-slate-300 text-right text-black">{tableData.valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, index) => (
            <tr key={row.name} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
              <td className="px-2 py-1 border border-slate-300 font-medium text-slate-800">{row.name}</td>
              <td className="px-2 py-1 border border-slate-300 text-right">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const MainContent: React.FC = () => {
    if (!activeScenario || !currentGeneratedQuestion) return <div className="p-4 text-xl text-slate-600">Cargando comparación...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-3xl p-1 sm:p-2 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-amber-500 text-white text-sm p-2 max-w-[280px]" direction="left">
            {activeScenario.description}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 w-full">
          <SimpleTableDisplay tableData={activeScenario.tableA} />
          <SimpleTableDisplay tableData={activeScenario.tableB} />
        </div>
        <p className="text-md sm:text-lg font-semibold text-slate-700 mt-2 min-h-[2.5em] flex items-center text-center justify-center px-2">
            {currentGeneratedQuestion.text}
        </p>
      </div>
    );
  };

  return <MainContent />;
};
