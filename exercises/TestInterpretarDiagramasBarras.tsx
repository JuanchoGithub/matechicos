
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, BarChartScenarioTemplate, BarChartCategoryTemplate, BarChartQuestionTemplate, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

// --- Data Structures (align with types.ts) ---
interface ChartCategory { name: string; value: number; color: string; }
interface ChartQuestion { id: string; text: string; options: string[]; correctAnswer: string; }

// Holds the currently active, fully generated chart and its single question
interface ActiveDisplayData {
  chartTitle: string;
  valueAxisLabel: string;
  categories: ChartCategory[]; // Dynamically generated for THIS question
  currentQuestion: ChartQuestion; // The single, dynamically generated question for THIS chart
  orientation: 'vertical' | 'horizontal';
  icon?: string;
}

interface TestInterpretarDiagramasBarrasProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; 
}

const FACE_EMOJIS_BAR_CHART = ['📊', '📈', '📉', '🤔', '🧐', '💡', '🏆', '🎯'];
const DEFAULT_BAR_CHART_ICON = '📊';

const BAR_CSS_COLOR_MAP: { [key: string]: string } = {
  "bg-blue-500": "rgba(59, 130, 246, 0.9)", "bg-pink-500": "rgba(236, 72, 153, 0.9)",
  "bg-green-500": "rgba(34, 197, 94, 0.9)", "bg-yellow-500": "rgba(234, 179, 8, 0.9)",
  "bg-red-500": "rgba(239, 68, 68, 0.9)", "bg-yellow-400": "rgba(250, 204, 21, 0.9)",
  "bg-orange-500": "rgba(249, 115, 22, 0.9)", "bg-purple-500": "rgba(168, 85, 247, 0.9)",
  "bg-teal-500": "rgba(20, 184, 166, 0.9)", "bg-lime-500": "rgba(132, 204, 22, 0.9)",
  "bg-sky-500": "rgba(14, 165, 233, 0.9)", "bg-green-600": "rgba(22, 163, 74, 0.9)", 
  "bg-orange-600": "rgba(234, 88, 12, 0.9)", 
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateNumericDistractorsBarChart = (correctValue: number, allValuesInChart: number[], numDistractors: number = 2): string[] => {
    const distractors: Set<number> = new Set();
    const uniqueValues = [...new Set(allValuesInChart)];
    
    for (const val of shuffleArray(uniqueValues)) {
        if (distractors.size < numDistractors && val !== correctValue) {
            distractors.add(val);
        }
    }
    
    let attempts = 0;
    while (distractors.size < numDistractors && attempts < 10) {
        const variation = Math.random() < 0.5 ? correctValue + getRandomInt(1,3) : Math.max(0, correctValue - getRandomInt(1,3));
        if (variation !== correctValue && !distractors.has(variation) && !uniqueValues.includes(variation) && variation >= 0) {
            distractors.add(variation);
        }
        attempts++;
    }
    if (distractors.size < numDistractors && correctValue > 0 && !distractors.has(correctValue - 1) && !uniqueValues.includes(correctValue - 1)) distractors.add(correctValue - 1);
    if (distractors.size < numDistractors && !distractors.has(correctValue + 1) && !uniqueValues.includes(correctValue + 1)) distractors.add(correctValue + 1);

    return Array.from(distractors).slice(0, numDistractors).map(String);
};


const generateDynamicBarChartQuestion = (
  template: BarChartQuestionTemplate,
  categoriesWithValue: ChartCategory[], // The freshly generated categories for THIS question
  chartTitle: string 
): ChartQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  const allValues = categoriesWithValue.map(c => c.value);

  switch (template.type) {
    case 'findMax': {
      const maxVal = Math.max(...allValues);
      const candidates = categoriesWithValue.filter(c => c.value === maxVal);
      correctAnswer = candidates[Math.floor(Math.random()*candidates.length)].name;
      text = `¿Cuál categoría tiene el valor más alto en "${chartTitle}"?`;
      options = shuffleArray(categoriesWithValue.map(c => c.name));
      break;
    }
    case 'findMin': {
      const minVal = Math.min(...allValues);
      const candidates = categoriesWithValue.filter(c => c.value === minVal);
      correctAnswer = candidates[Math.floor(Math.random()*candidates.length)].name;
      text = `¿Cuál categoría tiene el valor más bajo en "${chartTitle}"?`;
      options = shuffleArray(categoriesWithValue.map(c => c.name));
      break;
    }
    case 'findSpecific': {
      const targetCategory = categoriesWithValue[Math.floor(Math.random() * categoriesWithValue.length)];
      text = `¿Cuál es el valor de "${targetCategory.name}" en "${chartTitle}"?`;
      correctAnswer = targetCategory.value.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsBarChart(targetCategory.value, allValues)]);
      break;
    }
    case 'compareTwo': {
      if (categoriesWithValue.length < 2) { // Fallback if not enough categories
        text = "Pregunta no disponible."; correctAnswer = "N/A"; options = ["N/A"]; break;
      }
      const [catA, catB] = shuffleArray(categoriesWithValue).slice(0,2);
      text = `Compara "${catA.name}" (${catA.value}) con "${catB.name}" (${catB.value}) en "${chartTitle}".`;
      if (catA.value > catB.value) correctAnswer = `${catA.name} es mayor`;
      else if (catB.value > catA.value) correctAnswer = `${catB.name} es mayor`;
      else correctAnswer = "Son iguales";
      options = [`${catA.name} es mayor`, `${catB.name} es mayor`, "Son iguales"];
      break;
    }
    case 'findTotal': {
      const totalSum = allValues.reduce((sum, val) => sum + val, 0);
      text = `¿Cuál es el total de todas las categorías en "${chartTitle}"?`;
      correctAnswer = totalSum.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsBarChart(totalSum, allValues)]);
      break;
    }
    default:
      text = "Pregunta no configurada."; correctAnswer = "N/A"; options = ["N/A"];
  }
  // Ensure options are unique and usually 3 or 4 options
  const finalOptions = Array.from(new Set(options));
  if (!finalOptions.includes(correctAnswer)) { // Ensure correct answer is always an option
    if (finalOptions.length >=4) finalOptions[0] = correctAnswer; else finalOptions.push(correctAnswer);
  }
  return { id: `${chartTitle}_${template.id}`, text, options: shuffleArray(finalOptions.slice(0,4)), correctAnswer };
};

// Internal OptionsSidebar component
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
    <div className="w-full flex flex-col space-y-1.5 p-2">
      {options.map((option, index) => {
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (selectedOption === option) {
            buttonClass = option === correctAnswer
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (option === correctAnswer) {
            // buttonClass = 'bg-green-200 text-green-700'; 
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (selectedOption === option) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        return (
          <button key={index} onClick={() => onSelect(option)}
                  disabled={isVerified && selectedOption === correctAnswer}
                  className={`w-full p-2.5 sm:p-3 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}>
            {String(option)}
          </button>
        );
      })}
      <button onClick={onVerify}
              disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)}
              className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}>
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};


const BarChartSVG: React.FC<{
  data: ChartCategory[];
  width: number;
  height: number;
  padding: number;
  orientation: 'vertical' | 'horizontal';
  valueAxisLabel: string;
}> = ({ data, width, height, padding, orientation, valueAxisLabel }) => {
    const plotWidth = orientation === 'vertical' ? width - 2 * padding : width - 2 * padding - 30; 
    const plotHeight = orientation === 'vertical' ? height - 2 * padding - 20 : height - 2 * padding; 

    const maxValue = Math.max(...data.map(d => d.value), 0);
    const numTicks = 5;
    const tickStep = Math.max(1, Math.ceil(maxValue / numTicks / 5) * 5); 
    const yAxisMax = Math.max(tickStep, Math.ceil(maxValue / tickStep) * tickStep); // Ensure yAxisMax is at least tickStep

    const barWidthPercentage = 0.6;

    return (
        <svg width={width} height={height} aria-label={`Diagrama de barras ${orientation}. Eje de valor: ${valueAxisLabel}. Categorías: ${data.map(d=>d.name).join(', ')}.`}>
            {orientation === 'vertical' && (
                <text x={padding / 2 - 10} y={height / 2} transform={`rotate(-90 ${padding / 2 - 10} ${height / 2})`} textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{valueAxisLabel}</text>
            )}
             {orientation === 'horizontal' && (
                <text x={width/2} y={height - padding/4} textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{valueAxisLabel}</text>
            )}

            <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" /> 
            <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" /> 

            {Array.from({ length: Math.max(1, yAxisMax / tickStep) + 1 }).map((_, i) => {
                const value = i * tickStep;
                if (orientation === 'vertical') {
                    const yPos = padding + plotHeight - (value / yAxisMax) * plotHeight;
                    return (
                        <g key={`y-tick-${value}`}>
                            <line x1={padding - 3} y1={yPos} x2={padding + plotWidth} y2={yPos} stroke={value === 0 ? "rgb(100 116 139)" : "rgb(203 213 225)"} strokeWidth="1" strokeDasharray={value === 0 ? "" : "2,2"} />
                            <text x={padding - 8} y={yPos + 3} textAnchor="end" fontSize="8" fill="rgb(100 116 139)">{value}</text>
                        </g>
                    );
                } else { 
                    const xPos = padding + (value / yAxisMax) * plotWidth;
                     return (
                        <g key={`x-tick-${value}`}>
                            <line x1={xPos} y1={padding} x2={xPos} y2={padding + plotHeight + 3} stroke={value === 0 ? "rgb(100 116 139)" : "rgb(203 213 225)"} strokeWidth="1" strokeDasharray={value === 0 ? "" : "2,2"}/>
                            <text x={xPos} y={padding + plotHeight + 12} textAnchor="middle" fontSize="8" fill="rgb(100 116 139)">{value}</text>
                        </g>
                    );
                }
            })}

            {data.map((item, index) => {
                if (orientation === 'vertical') {
                    const barHeight = yAxisMax > 0 ? (item.value / yAxisMax) * plotHeight : 0;
                    const barX = padding + (plotWidth / data.length) * (index + (1 - barWidthPercentage) / 2);
                    const barActualWidth = (plotWidth / data.length) * barWidthPercentage;
                    return (
                        <g key={item.name}>
                            <rect x={barX} y={padding + plotHeight - barHeight} width={barActualWidth} height={barHeight} fill={BAR_CSS_COLOR_MAP[item.color] || item.color} />
                            <text x={barX + barActualWidth / 2} y={padding + plotHeight + 12} textAnchor="middle" fontSize="8" fill="rgb(71 85 105)">{item.name}</text>
                        </g>
                    );
                } else { 
                    const barLength = yAxisMax > 0 ? (item.value / yAxisMax) * plotWidth : 0;
                    const barY = padding + (plotHeight / data.length) * (index + (1- barWidthPercentage)/2);
                    const barActualHeight = (plotHeight / data.length) * barWidthPercentage;
                    return (
                        <g key={item.name}>
                            <rect x={padding} y={barY} width={barLength} height={barActualHeight} fill={BAR_CSS_COLOR_MAP[item.color] || item.color} />
                            <text x={padding - 5} y={barY + barActualHeight / 2 + 3} textAnchor="end" fontSize="8" fill="rgb(71 85 105)">{item.name}</text>
                        </g>
                    );
                }
            })}
        </svg>
    );
};

export const TestInterpretarDiagramasBarras: React.FC<TestInterpretarDiagramasBarrasProps> = ({
  exercise,
  scaffoldApi,
  setExternalKeypad, 
}) => {
  const [currentScenarioTemplate, setCurrentScenarioTemplate] = useState<BarChartScenarioTemplate | null>(null);
  const [currentQuestionTemplateIndex, setCurrentQuestionTemplateIndex] = useState<number>(0);
  const [questionsAskedForCurrentScenario, setQuestionsAskedForCurrentScenario] = useState<number>(0);
  
  const [activeGeneratedData, setActiveGeneratedData] = useState<ActiveDisplayData | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_BAR_CHART_ICON);
  
  const [availableScenarioTemplatesList, setAvailableScenarioTemplatesList] = useState<BarChartScenarioTemplate[]>([]);
  const { scenarios = [], fixedOrientation } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = scenarios as BarChartScenarioTemplate[] || [];
    if (scenarioTemplates.length > 0) {
      setAvailableScenarioTemplatesList(shuffleArray([...scenarioTemplates]));
    }
  }, [exercise.id, scenarios]);

  const generateNewVisualAndQuestion = useCallback((template: BarChartScenarioTemplate, qTemplateIndex: number) => {
    const newActiveCategories: ChartCategory[] = template.categories.map(cat => ({
      name: cat.name,
      value: getRandomInt(cat.valueRange[0], cat.valueRange[1]),
      color: cat.color,
    }));
    const questionTemplate = template.questionTemplates[qTemplateIndex];
    const newQuestionInstance = generateDynamicBarChartQuestion(questionTemplate, newActiveCategories, template.chartTitle);
    
    setActiveGeneratedData({
      chartTitle: template.chartTitle,
      valueAxisLabel: template.yAxisLabel,
      categories: newActiveCategories,
      currentQuestion: newQuestionInstance,
      orientation: fixedOrientation || (Math.random() < 0.5 ? 'vertical' : 'horizontal'),
      icon: template.icon || DEFAULT_BAR_CHART_ICON,
    });
    setCurrentEmoji(template.icon || FACE_EMOJIS_BAR_CHART[Math.floor(Math.random() * FACE_EMOJIS_BAR_CHART.length)]);
    setSelectedOption(null);
    setIsVerified(false);
    showFeedback(null);
  }, [fixedOrientation, showFeedback]);


  const loadNewScenarioTemplate = useCallback(() => {
    let pool = availableScenarioTemplatesList;
    if (pool.length === 0 && (scenarios as BarChartScenarioTemplate[])?.length > 0) {
      pool = shuffleArray([...(scenarios as BarChartScenarioTemplate[])]);
    }

    if (pool.length > 0) {
      const template = pool[0];
      setCurrentScenarioTemplate(template);
      setAvailableScenarioTemplatesList(prev => prev.slice(1));
      setCurrentQuestionTemplateIndex(0);
      setQuestionsAskedForCurrentScenario(0);
      generateNewVisualAndQuestion(template, 0);
    } else {
      onAttempt(true); // No more templates, exercise might be complete based on scaffold's stars
    }
  }, [availableScenarioTemplatesList, scenarios, generateNewVisualAndQuestion, onAttempt]);

  useEffect(() => {
    if ((scenarios as BarChartScenarioTemplate[])?.length > 0 && !currentScenarioTemplate) {
      loadNewScenarioTemplate();
    }
  }, [scenarios, currentScenarioTemplate, loadNewScenarioTemplate]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current && currentScenarioTemplate) {
        const nextQuestionsAskedCount = questionsAskedForCurrentScenario + 1;
        
        if (nextQuestionsAskedCount >= currentScenarioTemplate.totalStarsPerScenario) {
            loadNewScenarioTemplate(); 
        } else {
            const nextQTemplateIndex = (currentQuestionTemplateIndex + 1) % currentScenarioTemplate.questionTemplates.length;
            setCurrentQuestionTemplateIndex(nextQTemplateIndex);
            setQuestionsAskedForCurrentScenario(nextQuestionsAskedCount);
            generateNewVisualAndQuestion(currentScenarioTemplate, nextQTemplateIndex);
        }
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [
      advanceToNextChallengeSignal, 
      currentScenarioTemplate, 
      currentQuestionTemplateIndex, 
      questionsAskedForCurrentScenario, 
      loadNewScenarioTemplate, 
      generateNewVisualAndQuestion
  ]);

  const handleOptionSelect = useCallback((optionValue: string) => { // Renamed param to avoid conflict
    if (isVerified && selectedOption === activeGeneratedData?.currentQuestion.correctAnswer) return;
    setSelectedOption(optionValue);
    showFeedback(null);
    if (isVerified && selectedOption !== activeGeneratedData?.currentQuestion.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, activeGeneratedData, showFeedback]);

  const verifyAnswer = useCallback(() => { 
    if (!activeGeneratedData || !activeGeneratedData.currentQuestion || selectedOption === null || (isVerified && selectedOption === activeGeneratedData.currentQuestion.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === activeGeneratedData.currentQuestion.correctAnswer;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Revisa el gráfico!' });
    }
  }, [activeGeneratedData, selectedOption, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setExternalKeypad) { 
      if (activeGeneratedData?.currentQuestion) { 
        setExternalKeypad(
          <OptionsSidebar
            options={activeGeneratedData.currentQuestion.options}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}  
            onVerify={verifyAnswer}       
            isVerified={isVerified}
            correctAnswer={activeGeneratedData.currentQuestion.correctAnswer}
          />
        );
      } else {
        setExternalKeypad(null);
      }
      return () => { if (setExternalKeypad) setExternalKeypad(null); };
    }
  }, [setExternalKeypad, activeGeneratedData, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);


  const MainContent: React.FC = () => {
    if (!activeGeneratedData || !activeGeneratedData.currentQuestion) {
      return <div className="p-4 text-xl text-slate-600">Cargando diagrama de barras...</div>;
    }
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 flex items-center justify-center text-5xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-sm p-2 max-w-[260px]" direction="left">
            {activeGeneratedData.chartTitle}
          </Icons.SpeechBubbleIcon>
        </div>
        <BarChartSVG
          data={activeGeneratedData.categories}
          width={360} height={260} padding={30}
          orientation={activeGeneratedData.orientation}
          valueAxisLabel={activeGeneratedData.valueAxisLabel}
        />
        <p className="text-md font-semibold text-slate-700 mt-2 min-h-[2.5em] flex items-center text-center justify-center px-1">
          {activeGeneratedData.currentQuestion.text}
        </p>
      </div>
    );
  };

  return (<MainContent />);
};
