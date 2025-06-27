
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, LinePlotChallengeG4, LinePlotPointG4, LinePlotQuestionG4 } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';
import { NumericKeypad } from '../../components/NumericKeypad';

interface InterpretarGraficoPuntosG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_LINEPLOT = ['📊', '📈', '🤔', '🧐', '💡', '🔢', '✏️'];

const LinePlotSVG: React.FC<{
  data: LinePlotPointG4[];
  xAxisLabel: string;
  size?: { width: number; height: number };
  dotRadius?: number;
  dotColor?: string;
  axisColor?: string;
  labelColor?: string;
}> = ({
  data,
  xAxisLabel,
  size = { width: 350, height: 250 },
  dotRadius = 5,
  dotColor = 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
  axisColor = 'rgb(71, 85, 105)', // slate-700
  labelColor = 'rgb(100, 116, 139)', // slate-500
}) => {
  if (!data || data.length === 0) return <div className="text-sm text-slate-500">No hay datos para el gráfico.</div>;

  const padding = { top: 20, right: 20, bottom: 50, left: 30 };
  const plotWidth = size.width - padding.left - padding.right;
  const plotHeight = size.height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const maxFrequency = Math.max(...data.map(d => d.frequency), 0);

  const numTicks = Math.min(10, maxValue - minValue + 1); // Max 10 ticks or one per value
  const tickValues = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);

  const valueToX = (value: number) => {
    if (maxValue === minValue) return plotWidth / 2; // Center if only one value
    return ((value - minValue) / (maxValue - minValue)) * plotWidth;
  };
  
  // Adjust y-scaling to ensure dots don't overlap too much and fit within plotHeight
  const effectiveDotDiameter = dotRadius * 2 + 2; // dot diameter + spacing
  const yBase = plotHeight; 
  const yPerDot = Math.min(effectiveDotDiameter, plotHeight / (maxFrequency > 0 ? maxFrequency : 1) );


  return (
    <svg width={size.width} height={size.height} aria-label={`Gráfico de puntos: ${xAxisLabel}`}>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* X-axis line */}
        <line x1="0" y1={plotHeight} x2={plotWidth} y2={plotHeight} stroke={axisColor} strokeWidth="1.5" />
        {/* X-axis ticks and labels */}
        {tickValues.map(value => (
          <g key={`tick-${value}`} transform={`translate(${valueToX(value)}, ${plotHeight})`}>
            <line y1="0" y2="5" stroke={axisColor} strokeWidth="1" />
            <text y="15" textAnchor="middle" fontSize="10" fill={labelColor}>{value}</text>
          </g>
        ))}
        {/* X-axis label */}
        <text x={plotWidth / 2} y={plotHeight + 35} textAnchor="middle" fontSize="12" fontWeight="medium" fill={axisColor}>
          {xAxisLabel}
        </text>
        {/* Dots */}
        {data.map(point => {
          const x = valueToX(point.value);
          return Array.from({ length: point.frequency }).map((_, i) => (
            <circle
              key={`dot-${point.value}-${i}`}
              cx={x}
              cy={yBase - (i * yPerDot) - (yPerDot / 2) } // Position dots from bottom up
              r={dotRadius}
              fill={dotColor}
              aria-label={`${point.frequency} ${xAxisLabel} de valor ${point.value}`}
            />
          ));
        })}
      </g>
    </svg>
  );
};


// Options Keypad for MCQ
const MCQOptionsKeypad: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((opt, index) => {
        const isSelected = selectedOption === opt;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (isSelected) buttonClass = opt === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          else if (opt === correctAnswer) {} // Optionally highlight correct if not selected by user
          else buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        } else if (isSelected) buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        return (<button key={index} onClick={() => onSelect(opt)} disabled={isVerified && selectedOption === correctAnswer} className={`w-full p-3 rounded-lg text-center text-md font-semibold ${buttonClass}`}>{opt}</button>);
      })}
      <button onClick={onVerify} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  );
};


export const InterpretarGraficoPuntosG4Exercise: React.FC<InterpretarGraficoPuntosG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent, registerKeypadHandler
}) => {
  const [currentPlotChallenge, setCurrentPlotChallenge] = useState<LinePlotChallengeG4 | null>(null);
  const [currentQuestionObj, setCurrentQuestionObj] = useState<LinePlotQuestionG4 | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null);
  const [numericInputValue, setNumericInputValue] = useState<string>('');
  
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_LINEPLOT[0]);
  const [availablePlotChallenges, setAvailablePlotChallenges] = useState<LinePlotChallengeG4[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailablePlotChallenges(shuffleArray([...challenges as LinePlotChallengeG4[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewPlotAndQuestion = useCallback(() => {
    let plotPool = availablePlotChallenges;
    if (plotPool.length === 0 && (challenges as LinePlotChallengeG4[]).length > 0) { 
      plotPool = shuffleArray([...challenges as LinePlotChallengeG4[]]); 
      setAvailablePlotChallenges(plotPool); 
    }

    if (plotPool.length > 0) {
      const nextPlotChallenge = {...plotPool[0]};
      // Shuffle questions within the new plot challenge
      nextPlotChallenge.questions = shuffleArray([...nextPlotChallenge.questions]);
      setCurrentPlotChallenge(nextPlotChallenge);
      setCurrentQuestionIdx(0);
      setCurrentQuestionObj({...nextPlotChallenge.questions[0], options: nextPlotChallenge.questions[0].options ? shuffleArray([...nextPlotChallenge.questions[0].options]) : [] });
      setAvailablePlotChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextPlotChallenge.icon || FACE_EMOJIS_LINEPLOT[Math.floor(Math.random() * FACE_EMOJIS_LINEPLOT.length)]);
    } else {
      onAttempt(true); // All plots done
      return;
    }
    setSelectedMCQOption(null); setNumericInputValue(''); setIsVerified(false); showFeedback(null);
  }, [availablePlotChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as LinePlotChallengeG4[]).length > 0 && !currentPlotChallenge) {
      loadNewPlotAndQuestion();
    }
  }, [challenges, currentPlotChallenge, loadNewPlotAndQuestion]);
  
  const verifyAnswer = useCallback(() => {
    if (!currentQuestionObj || (currentQuestionObj.questionType === 'mcq' && !selectedMCQOption) || (currentQuestionObj.questionType === 'numeric' && numericInputValue === '')) return;
    if (isVerified && ( (currentQuestionObj.questionType === 'mcq' && selectedMCQOption === currentQuestionObj.correctAnswer) || (currentQuestionObj.questionType === 'numeric' && numericInputValue === currentQuestionObj.correctAnswer)  )) return;
    
    setIsVerified(true);
    const userAnswer = currentQuestionObj.questionType === 'mcq' ? selectedMCQOption : numericInputValue;
    const isCorrect = userAnswer === currentQuestionObj.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentQuestionObj.correctAnswer}.` });
  }, [currentQuestionObj, selectedMCQOption, numericInputValue, isVerified, showFeedback, onAttempt]);

  const handleMCQSelect = useCallback((option: string) => {
    if (isVerified && selectedMCQOption === currentQuestionObj?.correctAnswer) return;
    setSelectedMCQOption(option); showFeedback(null);
    if (isVerified && selectedMCQOption !== currentQuestionObj?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedMCQOption, currentQuestionObj, showFeedback]);
  
  const handleNumericKeyPress = useCallback((key: string) => {
    if (isVerified && numericInputValue === currentQuestionObj?.correctAnswer) return;
    showFeedback(null);
    if (isVerified && numericInputValue !== currentQuestionObj?.correctAnswer) setIsVerified(false);

    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setNumericInputValue(prev => prev.slice(0, -1));
    else if (numericInputValue.length < 3 && /\d/.test(key)) setNumericInputValue(prev => prev + key);
  }, [isVerified, numericInputValue, currentQuestionObj, showFeedback, verifyAnswer]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        if (currentPlotChallenge && currentQuestionIdx < currentPlotChallenge.questions.length - 1) {
            const nextQIdx = currentQuestionIdx + 1;
            setCurrentQuestionIdx(nextQIdx);
            setCurrentQuestionObj({...currentPlotChallenge.questions[nextQIdx], options: currentPlotChallenge.questions[nextQIdx].options ? shuffleArray([...currentPlotChallenge.questions[nextQIdx].options!]) : []});
            setSelectedMCQOption(null); setNumericInputValue(''); setIsVerified(false); showFeedback(null);
        } else {
            loadNewPlotAndQuestion();
        }
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentPlotChallenge, currentQuestionIdx, loadNewPlotAndQuestion, showFeedback]);

  const currentGeneratedQuestion = currentPlotChallenge?.questions[currentQuestionIdx];
  const requiresNumericInput = currentGeneratedQuestion?.questionType === 'numeric';
  
  useEffect(() => {
    if (currentQuestionObj?.questionType === 'numeric') {
      registerKeypadHandler(handleNumericKeyPress);
      setCustomKeypadContent(null); // Numeric keypad is default
    } else if (currentQuestionObj?.questionType === 'mcq') {
      registerKeypadHandler(null);
      setCustomKeypadContent(
        <MCQOptionsKeypad
          options={currentQuestionObj.options || []}
          selectedOption={selectedMCQOption}
          onSelect={handleMCQSelect}
          onVerify={verifyAnswer}
          isVerified={isVerified}
          correctAnswer={currentQuestionObj.correctAnswer}
        />
      );
    } else {
      registerKeypadHandler(null);
      setCustomKeypadContent(null);
    }
    return () => { registerKeypadHandler(null); setCustomKeypadContent(null); };
  }, [currentQuestionObj, selectedMCQOption, numericInputValue, isVerified, handleMCQSelect, handleNumericKeyPress, verifyAnswer, registerKeypadHandler, setCustomKeypadContent]);

  const MainContent: React.FC = () => {
    if (!currentPlotChallenge || !currentQuestionObj) return <div className="p-4 text-xl text-slate-600">Cargando gráfico de puntos...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-teal-600 text-white text-sm p-2 max-w-[260px]" direction="left">
            {currentPlotChallenge.title}
          </Icons.SpeechBubbleIcon>
        </div>
        <LinePlotSVG data={currentPlotChallenge.data} xAxisLabel={currentPlotChallenge.xAxisLabel} />
        <p className="text-md font-semibold text-slate-700 mt-1 min-h-[2em]">{currentQuestionObj.text}</p>
        {currentQuestionObj.questionType === 'numeric' && (
          <div className="w-1/2 max-w-xs h-12 sm:h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl text-slate-700 font-mono shadow-inner mt-1">
            {numericInputValue || <span className="text-slate-400">_</span>}
          </div>
        )}
      </div>
    );
  };
  return <MainContent />;
};
