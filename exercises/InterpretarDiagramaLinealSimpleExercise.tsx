
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, LinealChartScenarioTemplate, LinealChartDataPoint, LinealChartQuestionTemplate, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ActiveLinealChartScenarioData {
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataPoints: LinealChartDataPoint[];
  questions: GeneratedLinealChartQuestion[];
  totalStarsPerScenario: number;
  icon?: string;
  yAxisValueStep?: number;
}

interface GeneratedLinealChartQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface InterpretarDiagramaLinealSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi; 
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_LINE_CHART = ['📈', '📉', '🤔', '🧐', '💡', '📊', '✨'];
const DEFAULT_LINE_CHART_ICON = '📈';

const DAY_ABBREV_TO_FULL: { [key: string]: string } = {
  "Lun": "Lunes", "Mar": "Martes", "Mié": "Miércoles",
  "Jue": "Jueves", "Vie": "Viernes", "Sáb": "Sábado", "Dom": "Domingo",
};
const getFullXLabel = (abbrev: string): string => DAY_ABBREV_TO_FULL[abbrev] || abbrev;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateNumericDistractorsLC = (correctValue: number, allChartYValues: number[], numDistractors: number = 3, minVal?: number, maxVal?: number): string[] => {
  const distractors: Set<number> = new Set();
  const uniqueSortedYValues = [...new Set(allChartYValues)].sort((a, b) => a - b);
  for (const val of shuffleArray(uniqueSortedYValues)) {
    if (distractors.size < numDistractors && val !== correctValue) distractors.add(val);
  }
  const dataMin = Math.min(...allChartYValues, correctValue);
  const dataMax = Math.max(...allChartYValues, correctValue);
  const range = Math.max(5, dataMax - dataMin); 
  const minPossible = minVal !== undefined ? minVal : Math.max(0, correctValue - Math.floor(range / 2));
  const maxPossible = maxVal !== undefined ? maxVal : correctValue + Math.ceil(range / 2);
  let attempts = 0;
  while (distractors.size < numDistractors && attempts < 50) {
    const randomDistractor = Math.floor(Math.random() * (maxPossible - minPossible + 1)) + minPossible;
    if (randomDistractor !== correctValue && !distractors.has(randomDistractor) && !allChartYValues.includes(randomDistractor)) {
      distractors.add(randomDistractor);
    }
    attempts++;
  }
  const fallbackDistractors = [correctValue + 1, correctValue - 1, correctValue + 2, correctValue - 2, Math.floor(correctValue / 2), correctValue * 2];
  for (const fd of fallbackDistractors) {
    if (distractors.size < numDistractors && fd !== correctValue && !distractors.has(fd) && fd >=0 && !allChartYValues.includes(fd)) {
      distractors.add(fd);
    }
  }
  return Array.from(distractors).slice(0, numDistractors).map(String);
};

const generateDynamicLinealChartQuestion = (
  template: LinealChartQuestionTemplate,
  activeData: ActiveLinealChartScenarioData // Pass the whole active data
): GeneratedLinealChartQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  const { dataPoints, yAxisLabel, xAxisLabel } = activeData; // Destructure from activeData
  const allYValues = dataPoints.map(dp => dp.yValue);

  switch (template.type) {
    case 'findSpecificYValue': {
      const targetXAbbrev = template.targetXLabel1 || dataPoints[Math.floor(Math.random() * dataPoints.length)].xLabel;
      const targetXFull = getFullXLabel(targetXAbbrev);
      const point = dataPoints.find(dp => dp.xLabel === targetXAbbrev);
      if (point) {
        text = `¿Cuál fue el valor de ${yAxisLabel.toLowerCase()} el ${targetXFull.toLowerCase()}?`;
        correctAnswer = point.yValue.toString();
        options = shuffleArray([correctAnswer, ...generateNumericDistractorsLC(point.yValue, allYValues)]);
      } else { 
        text = "Error al generar pregunta."; correctAnswer = "N/A"; options = ["N/A"];
      }
      break;
    }
    case 'findMaxYValue': {
      const maxY = Math.max(...allYValues);
      const pointsWithMaxY = dataPoints.filter(dp => dp.yValue === maxY);
      const targetPoint = pointsWithMaxY[Math.floor(Math.random() * pointsWithMaxY.length)];
      text = `¿En qué ${xAxisLabel.toLowerCase()} se registró el mayor valor de ${yAxisLabel.toLowerCase()}?`;
      correctAnswer = getFullXLabel(targetPoint.xLabel);
      options = shuffleArray(dataPoints.map(dp => getFullXLabel(dp.xLabel))).slice(0, 4);
      if (!options.includes(correctAnswer) && options.length > 0) options[0] = correctAnswer; 
      else if (!options.includes(correctAnswer)) options.push(correctAnswer);
      options = shuffleArray(options);
      break;
    }
    case 'findMinYValue': {
      const minY = Math.min(...allYValues);
      const pointsWithMinY = dataPoints.filter(dp => dp.yValue === minY);
      const targetPoint = pointsWithMinY[Math.floor(Math.random() * pointsWithMinY.length)];
      text = `¿En qué ${xAxisLabel.toLowerCase()} se registró el menor valor de ${yAxisLabel.toLowerCase()}?`;
      correctAnswer = getFullXLabel(targetPoint.xLabel);
      options = shuffleArray(dataPoints.map(dp => getFullXLabel(dp.xLabel))).slice(0, 4);
       if (!options.includes(correctAnswer) && options.length > 0) options[0] = correctAnswer;
       else if (!options.includes(correctAnswer)) options.push(correctAnswer);
      options = shuffleArray(options);
      break;
    }
    case 'calculateDifferenceBetweenTwoYValues': {
      const x1Abbrev = template.targetXLabel1 || dataPoints[0].xLabel;
      const x2Abbrev = template.targetXLabel2 || dataPoints[dataPoints.length - 1].xLabel;
      const x1Full = getFullXLabel(x1Abbrev);
      const x2Full = getFullXLabel(x2Abbrev);
      const point1 = dataPoints.find(dp => dp.xLabel === x1Abbrev);
      const point2 = dataPoints.find(dp => dp.xLabel === x2Abbrev);
      if (point1 && point2) {
        const diff = Math.abs(point1.yValue - point2.yValue);
        text = `¿Cuál es la diferencia en ${yAxisLabel.toLowerCase()} entre ${x1Full.toLowerCase()} y ${x2Full.toLowerCase()}?`;
        correctAnswer = diff.toString();
        options = shuffleArray([correctAnswer, ...generateNumericDistractorsLC(diff, allYValues)]);
      } else { text = "Error al generar pregunta de diferencia."; correctAnswer = "N/A"; options = ["N/A"]; }
      break;
    }
    case 'describeTrend': {
      const startXAbbrev = template.targetXLabel1 || dataPoints[0].xLabel;
      const endXAbbrev = template.targetXLabel2 || dataPoints[Math.min(1, dataPoints.length -1)].xLabel; 
      const startXFull = getFullXLabel(startXAbbrev);
      const endXFull = getFullXLabel(endXAbbrev);
      const startPoint = dataPoints.find(dp => dp.xLabel === startXAbbrev);
      const endPoint = dataPoints.find(dp => dp.xLabel === endXAbbrev);
      if (startPoint && endPoint) {
        text = `¿Cómo fue la tendencia de ${yAxisLabel.toLowerCase()} desde ${startXFull.toLowerCase()} hasta ${endXFull.toLowerCase()}?`;
        if (endPoint.yValue > startPoint.yValue) correctAnswer = "Aumentó";
        else if (endPoint.yValue < startPoint.yValue) correctAnswer = "Disminuyó";
        else correctAnswer = "Se mantuvo igual";
        options = ["Aumentó", "Disminuyó", "Se mantuvo igual"];
      } else { text = "Error al generar pregunta de tendencia."; correctAnswer = "N/A"; options = ["N/A"]; }
      break;
    }
    case 'findTotalYValue': {
      const totalSum = allYValues.reduce((sum, val) => sum + val, 0);
      text = `¿Cuál es el total de ${yAxisLabel.toLowerCase()} registrado en todos los ${xAxisLabel.toLowerCase()}s?`;
      correctAnswer = totalSum.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsLC(totalSum, allYValues, 3, Math.floor(totalSum*0.5), Math.ceil(totalSum*1.5))]);
      break;
    }
    default: text = "Pregunta no implementada"; correctAnswer = "N/A"; options = ["N/A"];
  }
  if (options.length === 0) options = [correctAnswer, "Opción B", "Opción C", "Opción D"].slice(0,4);
  const finalOptions = Array.from(new Set(options.slice(0,4)));
  if (!finalOptions.includes(correctAnswer) && finalOptions.length === 4) {
      finalOptions[Math.floor(Math.random() * finalOptions.length)] = correctAnswer;
  } else if(!finalOptions.includes(correctAnswer)) {
      finalOptions.push(correctAnswer);
  }
  return { id: `${template.id}_${Date.now()}`, text, options: shuffleArray(finalOptions), correctAnswer };
};

const OptionsSidebarComponent: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  if (!options || options.length === 0) {
    // This will be cleared by useEffect in the main component if setExternalKeypad(null) is called
    return null; 
  }
  return (
    <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4 max-w-sm mx-auto">
      {options.map((option, index) => {
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (selectedOption === option) {
            buttonClass = option === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (option === correctAnswer) { } else { buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed'; }
        } else if (selectedOption === option) { buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500'; }
        return (<button key={index} onClick={() => onSelect(option)} disabled={isVerified && selectedOption === correctAnswer} className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}>{option}</button>);
      })}
      <button onClick={onVerify} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  );
};

const LineChartSVG: React.FC<{
  dataPoints: LinealChartDataPoint[]; width: number; height: number; padding: number;
  yAxisLabel: string; xAxisLabel: string; yStep?: number;
}> = ({ dataPoints, width, height, padding, yAxisLabel, xAxisLabel, yStep }) => {
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding - 20; 
  const allYValues = dataPoints.map(d => d.yValue);
  const minY = Math.min(...allYValues, 0); const maxY = Math.max(...allYValues);
  const effectiveYStep = yStep || Math.max(1, Math.ceil((maxY - minY) / 5 / 5) * 5); 
  const yAxisMax = Math.ceil(maxY / effectiveYStep) * effectiveYStep;
  const yAxisMin = Math.floor(minY / effectiveYStep) * effectiveYStep; 
  const numYSteps = Math.max(1,(yAxisMax - yAxisMin) / effectiveYStep);
  const xLabels = dataPoints.map(p => p.xLabel); 
  const getX = (index: number) => padding + (index / (xLabels.length - 1)) * plotWidth;
  const getY = (value: number) => padding + plotHeight - ((value - yAxisMin) / (yAxisMax - yAxisMin)) * plotHeight;
  if(xLabels.length === 0) return <div className="text-slate-500">No hay datos para mostrar.</div>;
  const pathData = dataPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.yValue)}`).join(' ');
  return (
    <svg width={width} height={height} aria-label={` Diagrama lineal: ${xAxisLabel} vs ${yAxisLabel}`}>
      <text x={padding/3} y={height/2} transform={`rotate(-90 ${padding/3} ${height/2})`} textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{yAxisLabel}</text>
      <text x={width/2} y={height - padding/3 + 15} textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{xAxisLabel}</text>
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" />
      {Array.from({ length: numYSteps + 1 }).map((_, i) => {
        const value = yAxisMin + i * effectiveYStep; const yPos = getY(value);
        return (<g key={`y-tick-${i}`}><line x1={padding - 3} y1={yPos} x2={padding + plotWidth} y2={yPos} stroke={value === 0 ? "rgb(100 116 139)" : "rgb(203 213 225)"} strokeWidth="1" strokeDasharray={value === 0 ? "" : "2,2"}/><text x={padding - 8} y={yPos + 3} textAnchor="end" fontSize="8" fill="rgb(100 116 139)">{value}</text></g>);
      })}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" />
      {xLabels.map((label, index) => (
        <g key={`x-tick-${index}`}><line x1={getX(index)} y1={padding + plotHeight} x2={getX(index)} y2={padding + plotHeight + 3} stroke="rgb(100 116 139)" strokeWidth="1"/><text x={getX(index)} y={padding + plotHeight + 12} textAnchor="middle" fontSize="8" fill="rgb(100 116 139)">{label}</text></g>
      ))}
      {dataPoints.length > 1 && <path d={pathData} stroke="rgb(59, 130, 246)" strokeWidth="2" fill="none" />}
      {dataPoints.map((point, index) => (<circle key={`point-${index}`} cx={getX(index)} cy={getY(point.yValue)} r="3" fill="rgb(59, 130, 246)" />))}
    </svg>
  );
};

export const InterpretarDiagramaLinealSimpleExercise: React.FC<InterpretarDiagramaLinealSimpleExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad
}) => {
  const [activeScenario, setActiveScenario] = useState<ActiveLinealChartScenarioData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_LINE_CHART_ICON);
  const [availableScenarios, setAvailableScenarios] = useState<LinealChartScenarioTemplate[]>([]);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as LinealChartScenarioTemplate[] || [];
    if (scenarioTemplates.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarioTemplates]));
    }
  }, [exercise.id, exercise.data]); 

  const loadNewScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as LinealChartScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as LinealChartScenarioTemplate[])]);
    }
    if (scenarioPool.length === 0) { onAttempt(true); return; }

    const template = scenarioPool[0];
    const instanceDataForQuestionGen: ActiveLinealChartScenarioData = { 
      ...template, 
      questions: [] 
    };
    const generatedQuestions = template.questionTemplates.map(qTemplate => 
      generateDynamicLinealChartQuestion(qTemplate, instanceDataForQuestionGen)
    );
    
    setActiveScenario({...instanceDataForQuestionGen, questions: generatedQuestions});
    setAvailableScenarios(prev => prev.slice(1));
    setCurrentQuestionIndex(0); setSelectedOption(null); setIsVerified(false); showFeedback(null);
    setCurrentEmoji(template.icon || FACE_EMOJIS_LINE_CHART[Math.floor(Math.random() * FACE_EMOJIS_LINE_CHART.length)]);
  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((exercise.data as LinealChartScenarioTemplate[])?.length > 0 && !activeScenario) loadNewScenario(); 
  }, [exercise.data, activeScenario, loadNewScenario]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current && activeScenario) {
        if (currentQuestionIndex + 1 < activeScenario.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1); setSelectedOption(null); setIsVerified(false); showFeedback(null);
        } else { loadNewScenario(); }
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentQuestionIndex, activeScenario, loadNewScenario, showFeedback]);

  const currentGeneratedQuestion = activeScenario?.questions[currentQuestionIndex];

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentGeneratedQuestion?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentGeneratedQuestion?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentGeneratedQuestion, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentGeneratedQuestion || !activeScenario || selectedOption === null || (isVerified && selectedOption === currentGeneratedQuestion.correctAnswer)) return;
    setIsVerified(true); const isCorrect = selectedOption === currentGeneratedQuestion.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Observa bien el diagrama!' });
  }, [currentGeneratedQuestion, activeScenario, selectedOption, isVerified, showFeedback, onAttempt]);
  

  useEffect(() => {
    if(setExternalKeypad) {
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
            setExternalKeypad(null); // Clear keypad if no question/options
        }
    }
    return () => {
        if(setExternalKeypad) setExternalKeypad(null);
    }
  }, [setExternalKeypad, currentGeneratedQuestion, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!activeScenario || !currentGeneratedQuestion) return <div className="p-4 text-xl text-slate-600">Cargando diagrama...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 flex items-center justify-center text-5xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-lime-600 text-white text-sm p-2 max-w-[260px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <LineChartSVG dataPoints={activeScenario.dataPoints} width={380} height={280} padding={40} yAxisLabel={activeScenario.yAxisLabel} xAxisLabel={activeScenario.xAxisLabel} yStep={activeScenario.yAxisValueStep} />
        <p className="text-md font-semibold text-slate-700 mt-2 min-h-[2.5em] flex items-center text-center justify-center px-1">{currentGeneratedQuestion.text}</p>
      </div>
    );
  };
  return <MainContent />;
};
