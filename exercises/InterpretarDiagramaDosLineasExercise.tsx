
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, MultiLineChartScenarioTemplate, MultiLineChartDataSeries, LinealChartDataPoint, MultiLineChartQuestionTemplate, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface ActiveMultiLineChartScenarioData {
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  series: [MultiLineChartDataSeries, MultiLineChartDataSeries];
  questions: GeneratedMultiLineChartQuestion[];
  totalStarsPerScenario: number; 
  icon?: string;
  yAxisValueStep?: number;
}

interface GeneratedMultiLineChartQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface InterpretarDiagramaDosLineasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; 
}

const FACE_EMOJIS_DUAL_LINE = ['📊', '📉📈', '🤔', '🧐', '💡', '🤓', '🆚'];
const DEFAULT_DUAL_LINE_ICON = '📉📈';

const TAILWIND_COLOR_TO_SVG: { [key: string]: string } = {
  "blue-500": "rgb(59, 130, 246)", "green-500": "rgb(34, 197, 94)",
  "red-500": "rgb(239, 68, 68)", "pink-500": "rgb(236, 72, 153)",
  "purple-500": "rgb(168, 85, 247)", "orange-500": "rgb(249, 115, 22)",
  "teal-500": "rgb(20, 184, 166)", "yellow-500": "rgb(234, 179, 8)",
};

const MONTH_ABBREV_TO_FULL: { [key: string]: string } = {
  "Ene": "Enero", "Feb": "Febrero", "Mar": "Marzo", "Abr": "Abril",
  "May": "Mayo", "Jun": "Junio", "Jul": "Julio", "Ago": "Agosto",
  "Sep": "Septiembre", "Oct": "Octubre", "Nov": "Noviembre", "Dic": "Diciembre",
};
const getFullXLabelDual = (abbrev: string): string => MONTH_ABBREV_TO_FULL[abbrev] || abbrev;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateNumericDistractorsDLC = (correctValue: number, allYValues: number[], numDistractors: number = 3, minVal?: number, maxVal?: number): string[] => {
  const distractors: Set<number> = new Set();
  const uniqueSortedYValues = [...new Set(allYValues)].sort((a, b) => a - b);
  for (const val of shuffleArray(uniqueSortedYValues)) {
    if (distractors.size < numDistractors && val !== correctValue) distractors.add(val);
  }
  const dataMin = Math.min(...allYValues, correctValue);
  const dataMax = Math.max(...allYValues, correctValue);
  const range = Math.max(5, dataMax - dataMin);
  const minPossible = minVal !== undefined ? minVal : Math.max(0, correctValue - Math.floor(range / 2));
  const maxPossible = maxVal !== undefined ? maxVal : correctValue + Math.ceil(range / 2);
  let attempts = 0;
  while (distractors.size < numDistractors && attempts < 50) {
    const randomDistractor = Math.floor(Math.random() * (maxPossible - minPossible + 1)) + minPossible;
    if (randomDistractor !== correctValue && !distractors.has(randomDistractor) && !allYValues.includes(randomDistractor)) distractors.add(randomDistractor);
    attempts++;
  }
  const fallbackDistractors = [correctValue + 1, correctValue - 1, correctValue + 2, correctValue - 2, Math.floor(correctValue / 2), correctValue * 2];
  for (const fd of fallbackDistractors) {
    if (distractors.size < numDistractors && fd !== correctValue && !distractors.has(fd) && fd >=0 && !allYValues.includes(fd)) distractors.add(fd);
  }
  return Array.from(distractors).slice(0, numDistractors).map(String);
};

const generateDynamicMultiLineChartQuestion = (
  template: MultiLineChartQuestionTemplate,
  activeData: ActiveMultiLineChartScenarioData 
): GeneratedMultiLineChartQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  const { series, yAxisLabel, xAxisLabel } = activeData;
  const allYValues = series.flatMap(s => s.points.map(p => p.yValue));
  const line1 = series[0];
  const line2 = series[1];

  switch (template.type) {
    case 'findYValueForLineAndX': {
      const lineName = template.targetLineName1 || line1.name;
      const targetLine = series.find(s => s.name === lineName) || line1;
      const targetXAbbrev = template.targetXLabel || targetLine.points[Math.floor(Math.random() * targetLine.points.length)].xLabel;
      const targetXFull = getFullXLabelDual(targetXAbbrev);
      const point = targetLine.points.find(dp => dp.xLabel === targetXAbbrev);
      if (point) {
        text = `¿Cuál fue el ${yAxisLabel.toLowerCase()} de ${lineName} en ${targetXFull.toLowerCase()}?`;
        correctAnswer = point.yValue.toString();
        options = shuffleArray([correctAnswer, ...generateNumericDistractorsDLC(point.yValue, allYValues)]);
      }
      break;
    }
    case 'whichLineHasMaxYAtX': {
      const targetXAbbrev = template.targetXLabel || line1.points[Math.floor(Math.random() * line1.points.length)].xLabel;
      const targetXFull = getFullXLabelDual(targetXAbbrev);
      const val1 = line1.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      const val2 = line2.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      text = `En ${targetXFull.toLowerCase()}, ¿qué línea tuvo el valor más alto de ${yAxisLabel.toLowerCase()}?`;
      correctAnswer = val1 > val2 ? line1.name : (val2 > val1 ? line2.name : "Ambas igual");
      options = [line1.name, line2.name];
      if (val1 === val2) options.push("Ambas igual");
      options = shuffleArray(options);
      break;
    }
     case 'whichLineHasMinYAtX': { 
      const targetXAbbrev = template.targetXLabel || line1.points[Math.floor(Math.random() * line1.points.length)].xLabel;
      const targetXFull = getFullXLabelDual(targetXAbbrev);
      const val1 = line1.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      const val2 = line2.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      text = `En ${targetXFull.toLowerCase()}, ¿qué línea tuvo el valor más bajo de ${yAxisLabel.toLowerCase()}?`;
      correctAnswer = val1 < val2 ? line1.name : (val2 < val1 ? line2.name : "Ambas igual");
      options = [line1.name, line2.name];
      if (val1 === val2) options.push("Ambas igual");
      options = shuffleArray(options);
      break;
    }
     case 'findDifferenceBetweenLinesAtX': {
      const targetXAbbrev = template.targetXLabel || line1.points[Math.floor(Math.random() * line1.points.length)].xLabel;
      const targetXFull = getFullXLabelDual(targetXAbbrev);
      const val1 = line1.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      const val2 = line2.points.find(p => p.xLabel === targetXAbbrev)?.yValue || 0;
      const diff = Math.abs(val1 - val2);
      text = `En ${targetXFull.toLowerCase()}, ¿cuál fue la diferencia en ${yAxisLabel.toLowerCase()} entre ${line1.name} y ${line2.name}?`;
      correctAnswer = diff.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsDLC(diff, allYValues)]);
      break;
    }
    case 'describeOverallTrendForLine': {
      const lineName = template.targetLineName1 || line1.name;
      const targetLine = series.find(s => s.name === lineName) || line1;
      const startXAbbrev = template.targetXLabelStart || targetLine.points[0].xLabel;
      const endXAbbrev = template.targetXLabelEnd || targetLine.points[targetLine.points.length - 1].xLabel;
      const startXFull = getFullXLabelDual(startXAbbrev);
      const endXFull = getFullXLabelDual(endXAbbrev);
      const startVal = targetLine.points.find(p => p.xLabel === startXAbbrev)?.yValue || 0;
      const endVal = targetLine.points.find(p => p.xLabel === endXAbbrev)?.yValue || 0;
      text = `¿Cuál fue la tendencia general de ${lineName} desde ${startXFull.toLowerCase()} hasta ${endXFull.toLowerCase()}?`;
      if (endVal > startVal) correctAnswer = "Aumentó";
      else if (endVal < startVal) correctAnswer = "Disminuyó";
      else correctAnswer = "Se mantuvo igual";
      options = ["Aumentó", "Disminuyó", "Se mantuvo igual"];
      break;
    }
    case 'compareOverallTrends': {
      const startXAbbrev = template.targetXLabelStart || line1.points[0].xLabel;
      const endXAbbrev = template.targetXLabelEnd || line1.points[line1.points.length - 1].xLabel;
      const startXFull = getFullXLabelDual(startXAbbrev);
      const endXFull = getFullXLabelDual(endXAbbrev);
      const startVal1 = line1.points.find(p=>p.xLabel === startXAbbrev)?.yValue || 0;
      const endVal1 = line1.points.find(p=>p.xLabel === endXAbbrev)?.yValue || 0;
      const trend1 = endVal1 > startVal1 ? 1 : (endVal1 < startVal1 ? -1 : 0); 
      const startVal2 = line2.points.find(p=>p.xLabel === startXAbbrev)?.yValue || 0;
      const endVal2 = line2.points.find(p=>p.xLabel === endXAbbrev)?.yValue || 0;
      const trend2 = endVal2 > startVal2 ? 1 : (endVal2 < startVal2 ? -1 : 0);
      text = `Comparando la tendencia desde ${startXFull.toLowerCase()} hasta ${endXFull.toLowerCase()}, ¿cuál describe mejor a ${line1.name} y ${line2.name}?`;
      if (trend1 === 1 && trend2 === 1) correctAnswer = `${line1.name} y ${line2.name} aumentaron`;
      else if (trend1 === -1 && trend2 === -1) correctAnswer = `${line1.name} y ${line2.name} disminuyeron`;
      else if (trend1 === 1 && trend2 === -1) correctAnswer = `${line1.name} aumentó y ${line2.name} disminuyó`;
      else if (trend1 === -1 && trend2 === 1) correctAnswer = `${line1.name} disminuyó y ${line2.name} aumentó`;
      else correctAnswer = "Una aumentó y la otra se mantuvo, o viceversa"; 
      options = [`${line1.name} y ${line2.name} aumentaron`, `${line1.name} y ${line2.name} disminuyeron`, `${line1.name} aumentó y ${line2.name} disminuyó`, `${line1.name} disminuyó y ${line2.name} aumentó`];
      if (!options.includes(correctAnswer)) options.push(correctAnswer); 
      options = shuffleArray(options.slice(0,4));
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
  if (!options || options.length === 0) return <div className="p-4 text-slate-400">Cargando opciones...</div>;
  return (
    <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2 mt-4 max-w-sm mx-auto">
      {options.map((option, index) => {
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (selectedOption === option) buttonClass = option === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          else if (option === correctAnswer) {} else buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        } else if (selectedOption === option) buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        return (<button key={index} onClick={() => onSelect(option)} disabled={isVerified && selectedOption === correctAnswer} className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}>{option}</button>);
      })}
      <button onClick={onVerify} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  );
};


const DualLineChartSVG: React.FC<{
  series: [MultiLineChartDataSeries, MultiLineChartDataSeries]; width: number; height: number; padding: number;
  yAxisLabel: string; xAxisLabel: string; yStep?: number;
}> = ({ series: [series1, series2], width, height, padding, yAxisLabel, xAxisLabel, yStep }) => {
  const plotWidth = width - 2 * padding - 10; const plotHeight = height - 2 * padding - 20; 
  const allYValues = [...series1.points.map(d => d.yValue), ...series2.points.map(d => d.yValue)];
  const minY = Math.min(...allYValues, 0); const maxY = Math.max(...allYValues);
  const effectiveYStep = yStep || Math.max(1, Math.ceil((maxY - minY) / 5 / 5) * 5);
  const yAxisMax = Math.ceil(maxY / effectiveYStep) * effectiveYStep;
  const yAxisMin = Math.floor(minY / effectiveYStep) * effectiveYStep;
  const numYSteps = Math.max(1, (yAxisMax - yAxisMin) / effectiveYStep);
  const xLabels = series1.points.map(p => p.xLabel); 
  const getX = (index: number) => padding + (index / (xLabels.length - 1)) * plotWidth;
  const getY = (value: number) => padding + plotHeight - ((value - yAxisMin) / (yAxisMax - yAxisMin)) * plotHeight;
  if(xLabels.length === 0) return <div className="text-slate-500">No hay datos para mostrar.</div>;
  const pathData1 = series1.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.yValue)}`).join(' ');
  const pathData2 = series2.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.yValue)}`).join(' ');
  return (
    <svg width={width} height={height} aria-label={` Diagrama de dos líneas: ${series1.name} y ${series2.name}`}>
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
      {series1.points.length > 1 && <path d={pathData1} stroke={TAILWIND_COLOR_TO_SVG[series1.color] || "blue"} strokeWidth="2" fill="none" />}
      {series1.points.map((point, index) => (<circle key={`point1-${index}`} cx={getX(index)} cy={getY(point.yValue)} r="3" fill={TAILWIND_COLOR_TO_SVG[series1.color] || "blue"} />))}
      {series2.points.length > 1 && <path d={pathData2} stroke={TAILWIND_COLOR_TO_SVG[series2.color] || "green"} strokeWidth="2" fill="none" />}
      {series2.points.map((point, index) => (<circle key={`point2-${index}`} cx={getX(index)} cy={getY(point.yValue)} r="3" fill={TAILWIND_COLOR_TO_SVG[series2.color] || "green"} />))}
      <g transform={`translate(${width - padding + 5 - 50}, ${padding})`}><rect x="0" y="0" width="8" height="8" fill={TAILWIND_COLOR_TO_SVG[series1.color] || "blue"} /><text x="12" y="7" fontSize="8" fill="rgb(71 85 105)">{series1.name}</text><rect x="0" y="15" width="8" height="8" fill={TAILWIND_COLOR_TO_SVG[series2.color] || "green"} /><text x="12" y="22" fontSize="8" fill="rgb(71 85 105)">{series2.name}</text></g>
    </svg>
  );
};

export const InterpretarDiagramaDosLineasExercise: React.FC<InterpretarDiagramaDosLineasExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad
}) => {
  const [activeScenario, setActiveScenario] = useState<ActiveMultiLineChartScenarioData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_DUAL_LINE_ICON);
  const [availableScenarioTemplates, setAvailableScenarioTemplates] = useState<MultiLineChartScenarioTemplate[]>([]);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as MultiLineChartScenarioTemplate[] || [];
    if (scenarioTemplates.length > 0) setAvailableScenarioTemplates(shuffleArray([...scenarioTemplates]));
  }, [exercise.id, exercise.data]); // Added exercise.id

  const loadNewScenario = useCallback(() => {
    let scenarioPool = availableScenarioTemplates;
    if (scenarioPool.length === 0 && (exercise.data as MultiLineChartScenarioTemplate[])?.length > 0) scenarioPool = shuffleArray([...(exercise.data as MultiLineChartScenarioTemplate[])]);
    if (scenarioPool.length === 0) { onAttempt(true); return; }
    const template = scenarioPool[0];
    // Create a temporary ActiveMultiLineChartScenarioData to pass to generateDynamicMultiLineChartQuestion
    const instanceDataForQuestionGen: ActiveMultiLineChartScenarioData = { 
        ...template, 
        questions: [], // Questions will be filled by the generator
        totalStarsPerScenario: template.totalStarsPerScenario 
    };
    const generatedQuestions = template.questionTemplates.map(qTemplate => 
      generateDynamicMultiLineChartQuestion(qTemplate, instanceDataForQuestionGen)
    );
    
    setActiveScenario({...instanceDataForQuestionGen, questions: generatedQuestions});
    setAvailableScenarioTemplates(prev => prev.slice(1));
    setCurrentQuestionIndex(0); setSelectedOption(null); setIsVerified(false); showFeedback(null);
    setCurrentEmoji(template.icon || FACE_EMOJIS_DUAL_LINE[Math.floor(Math.random() * FACE_EMOJIS_DUAL_LINE.length)]);
  }, [availableScenarioTemplates, exercise.data, showFeedback, onAttempt]);

  useEffect(() => { if ((exercise.data as MultiLineChartScenarioTemplate[])?.length > 0 && !activeScenario) loadNewScenario(); }, [exercise.data, activeScenario, loadNewScenario]);

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
    if(setExternalKeypad && currentGeneratedQuestion) {
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
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-sm p-2 max-w-[260px]" direction="left">{exercise.question}</Icons.SpeechBubbleIcon>
        </div>
        <DualLineChartSVG series={activeScenario.series} width={380} height={280} padding={40} yAxisLabel={activeScenario.yAxisLabel} xAxisLabel={activeScenario.xAxisLabel} yStep={activeScenario.yAxisValueStep} />
        <p className="text-md font-semibold text-slate-700 mt-2 min-h-[2.5em] flex items-center text-center justify-center px-1">{currentGeneratedQuestion.text}</p>
      </div>
    );
  };
  return <MainContent />;
};
