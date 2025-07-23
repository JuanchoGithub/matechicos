import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, BarGraphBuilderCategoryData, BarGraphBuilderQuestionData } from '../types';
import { Icons } from '../components/icons';
import { shuffleArray } from '../utils';

interface BarGraphBuilderExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

// Color palette for bars
const BAR_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899'  // pink
];

// Emojis for character
const FACE_EMOJIS = ['📊', '📈', '📉', '🤔', '🧐', '💡', '🎮', '🎯', '✏️'];

// Bar Graph Display component
const BarGraphDisplay: React.FC<{
  categories: BarGraphBuilderCategoryData[];
  userValues: { [category: string]: number };
  xAxisLabel: string;
  yAxisLabel: string;
  maxYAxisValue: number;
  yAxisStep: number;
  activeCategory: string | null;
  onBarClick: (category: string) => void;
  onBarAdjust?: (category: string, adjustment: number) => void;
  isInteractive: boolean;
  highlightMax?: boolean;
  width?: number;
  height?: number;
}> = ({ 
  categories, 
  userValues, 
  xAxisLabel, 
  yAxisLabel, 
  maxYAxisValue, 
  yAxisStep, 
  activeCategory, 
  onBarClick,
  onBarAdjust,
  isInteractive, 
  highlightMax = false,
  width,
  height
}) => {
  // Dynamically set width based on number of bars to avoid label cutoff
  const minWidth = 360;
  const barMinWidth = 90; // px per bar
  const numBars = categories.length;
  const dynamicWidth = Math.max(minWidth, numBars * barMinWidth);
  const widthToUse = width ?? dynamicWidth;
  const heightToUse = height ?? 280;
  const svgRef = useRef<SVGSVGElement>(null);
  const padding = { top: 20, right: 20, bottom: 60, left: 40 };
  const plotWidth = widthToUse - padding.left - padding.right;
  const plotHeight = heightToUse - padding.top - padding.bottom;
  const barGroupWidth = plotWidth / numBars;
  const barWidth = barGroupWidth * 0.6;
  const barSpacing = barGroupWidth * 0.4;
  
  // Find max value for highlight if needed
  const maxValue = highlightMax ? 
    Math.max(...categories.map(c => userValues[c.name] || 0)) : 0;

  // Handle bar click and drag for direct height adjustment
  const handleBarAreaClick = useCallback((category: string, e: React.MouseEvent) => {
    if (!isInteractive || !svgRef.current) return;
    
    // Select this bar
    onBarClick(category);
    
    // If we have a handler for direct height adjustment
    if (onBarAdjust) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const yPosition = e.clientY;
      
      // Calculate where in the plot area was clicked
      const relativeY = yPosition - svgRect.top;
      const clickPositionFromBottom = svgRect.height - padding.bottom - relativeY;
      
      // Convert to a value based on the plot height and max Y value
      const valueRange = Math.max(0, Math.round((clickPositionFromBottom / plotHeight) * maxYAxisValue));
      
      // Calculate adjustment needed
      const currentValue = userValues[category] || 0;
      onBarAdjust(category, valueRange - currentValue);
    }
  }, [isInteractive, maxYAxisValue, onBarAdjust, onBarClick, padding.bottom, plotHeight, userValues]);

  return (
    <div className="flex flex-col w-full" style={{ overflowX: 'auto' }}>
      <svg 
        ref={svgRef}
        width={widthToUse}
        height={heightToUse}
        aria-label={`Gráfico de barras para ${xAxisLabel}`}
        style={{ minWidth: minWidth }}
      >
        {/* Y-axis Label */}
        <text 
          x={-(padding.top + plotHeight / 2)} 
          y={padding.left / 3} 
          transform="rotate(-90)" 
          textAnchor="middle" 
          fontSize="10" 
          fill="rgb(71 85 105)"
        >
          {yAxisLabel}
        </text>
        
        {/* X-axis Label */}
        <text 
          x={padding.left + plotWidth / 2} 
          y={heightToUse - padding.bottom / 4} 
          textAnchor="middle" 
          fontSize="10" 
          fill="rgb(71 85 105)"
        >
          {xAxisLabel}
        </text>

        {/* Axes */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={padding.top + plotHeight} 
          stroke="rgb(100 116 139)" 
          strokeWidth="1.5" 
        />
        <line 
          x1={padding.left} 
          y1={padding.top + plotHeight} 
          x2={padding.left + plotWidth} 
          y2={padding.top + plotHeight} 
          stroke="rgb(100 116 139)" 
          strokeWidth="1.5" 
        />

        {/* Y-axis Ticks and Grid Lines */}
        {Array.from({ length: Math.floor(maxYAxisValue / yAxisStep) + 1 }, (_, i) => {
          const value = i * yAxisStep;
          const yPos = padding.top + plotHeight - (value / maxYAxisValue) * plotHeight;
          
          return (
            <g key={`y-tick-${value}`}>
              <line 
                x1={padding.left - 3} 
                y1={yPos} 
                x2={padding.left + plotWidth} 
                y2={yPos} 
                stroke={value === 0 ? "rgb(100 116 139)" : "rgb(226 232 240)"} 
                strokeWidth="1" 
                strokeDasharray={value === 0 ? "" : "2,2"}
              />
              <text 
                x={padding.left - 8} 
                y={yPos + 3} 
                textAnchor="end" 
                fontSize="8" 
                fill="rgb(100 116 139)"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Clickable area for each bar - for bar height adjustment */}
        {isInteractive && onBarAdjust && categories.map((cat, index) => {
          const xPos = padding.left + barSpacing / 2 + index * barGroupWidth;
          
          return (
            <rect
              key={`clickable-${cat.name}`}
              x={xPos}
              y={padding.top}
              width={barWidth}
              height={plotHeight}
              fill="transparent"
              onClick={(e) => handleBarAreaClick(cat.name, e)}
              className="cursor-pointer"
              aria-label={`Ajustar altura de barra ${cat.name}`}
            />
          );
        })}

        {/* Bars */}
        {categories.map((cat, index) => {
          const userValue = userValues[cat.name] || 0;
          const barHeight = maxYAxisValue > 0 ? (userValue / maxYAxisValue) * plotHeight : 0;
          const xPos = padding.left + barSpacing / 2 + index * barGroupWidth;
          const barColor = cat.color || BAR_COLORS[index % BAR_COLORS.length];
          const isActive = activeCategory === cat.name;
          const isMaxValue = highlightMax && userValue === maxValue && userValue > 0;
          
          return (
            <g 
              key={cat.name} 
              onClick={() => isInteractive && onBarClick(cat.name)}
              className={`${isInteractive ? 'cursor-pointer group' : ''}`}
              aria-label={`Categoría ${cat.name}, valor actual ${userValue}. ${isActive ? 'Actualmente seleccionada.' : isInteractive ? 'Haz clic para seleccionar.' : ''}`}
              role={isInteractive ? "button" : "graphics-symbol"}
            >
              <rect
                x={xPos}
                y={padding.top + plotHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                className={`transition-all duration-300 ease-in-out ${
                  isMaxValue ? 'stroke-yellow-500 stroke-2' : ''
                } ${
                  isActive ? 'opacity-100 ring-2 ring-offset-1 ring-sky-500' : 
                  isInteractive ? 'opacity-70 group-hover:opacity-90' : 'opacity-90'
                }`}
              />
              {/* Bar Label */}
              <text 
                x={xPos + barWidth / 2} 
                y={padding.top + plotHeight + 15} 
                textAnchor="middle" 
                fontSize={isActive ? "11" : "9"} 
                fill={isActive ? "rgb(2, 132, 199)" : "rgb(71 85 105)"}
                fontWeight={isActive ? "bold" : "normal"}
                className={`transition-all duration-150 ease-in-out ${!isActive && isInteractive ? 'group-hover:fill-sky-600' : ''}`}
              >
                {cat.name}
              </text>
              
              {/* Value label on top of the bar if there's a value */}
              {userValue > 0 && (
                <text 
                  x={xPos + barWidth / 2} 
                  y={padding.top + plotHeight - barHeight - 3} 
                  textAnchor="middle" 
                  fontSize="8" 
                  fill="rgb(50,50,50)" 
                  className="font-semibold pointer-events-none"
                >
                  {userValue}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* We'll remove the controls from here and put them in the sidebar */}
    </div>
  );
};

// Main component
export const BarGraphBuilderExercise: React.FC<BarGraphBuilderExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<BarGraphBuilderQuestionData | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<BarGraphBuilderQuestionData[]>([]);
  const [userValues, setUserValues] = useState<{ [category: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS[0]);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isAttemptPending, setIsAttemptPending] = useState<boolean>(false);
  
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const { scenarios = [] } = exercise.data || {};

  // Initialize available questions
  useEffect(() => {
    if (scenarios.length > 0) {
      setAvailableQuestions(shuffleArray([...(scenarios as BarGraphBuilderQuestionData[])]));
    }
  }, [scenarios, exercise.id]);

  // Load next question when needed
  const loadNewQuestion = useCallback(() => {
    let pool = availableQuestions;
    if (pool.length === 0 && (scenarios as BarGraphBuilderQuestionData[])?.length > 0) {
      pool = shuffleArray([...(scenarios as BarGraphBuilderQuestionData[])]);
      setAvailableQuestions(pool);
    }

    if (pool.length > 0) {
      const nextQuestion = pool[0];
      setCurrentQuestion(nextQuestion);
      
      // Initialize userValues based on question type
      const initialValues: { [category: string]: number } = {};
      if (nextQuestion.type === 'buildGraph') {
        // Start with zeros for build graph questions
        nextQuestion.categories.forEach(cat => initialValues[cat.name] = 0);
      } else {
        // Start with correct values for interpret graph questions
        nextQuestion.categories.forEach(cat => initialValues[cat.name] = cat.correctValue);
      }
      
      setUserValues(initialValues);
      setActiveCategory(nextQuestion.type === 'buildGraph' ? nextQuestion.categories[0]?.name : null);
      setAvailableQuestions(prev => prev.slice(1));
      setUserAnswer(null);
      
      // Set random emoji for character
      setCharacterEmoji(nextQuestion.emoji || FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableQuestions, scenarios, showFeedback, onAttempt]);

  // Load initial question
  useEffect(() => { 
    if ((scenarios as BarGraphBuilderQuestionData[])?.length > 0 && !currentQuestion) loadNewQuestion(); 
  }, [scenarios, currentQuestion, loadNewQuestion]);

  // Handle advancing to next question
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
      loadNewQuestion();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewQuestion]);

  // Click handler for bars
  const handleBarClick = useCallback((categoryName: string) => {
    if (currentQuestion?.type === 'buildGraph') {
      setActiveCategory(categoryName);
      showFeedback(null);
    }
  }, [currentQuestion, showFeedback]);

  // Keypad handler for adjusting bar heights
  // Handle increase/decrease of bar values for mouse/touch interactions
  const adjustBarValue = useCallback((category: string, adjustment: number) => {
    if (!currentQuestion || currentQuestion.type !== 'buildGraph') return;
    
    setUserValues(prev => {
      const currentValue = prev[category] || 0;
      // Enforce min/max limits
      const newValue = Math.max(0, Math.min(20, currentValue + adjustment));
      return { ...prev, [category]: newValue };
    });
  }, [currentQuestion]);
  

  // Verify user answer
  const verifyAnswer = useCallback(() => {
    if (!currentQuestion || isAttemptPending) return;
    setIsAttemptPending(true);
    
    let isCorrect = false;
    let feedbackMessage = '';
    
    if (currentQuestion.type === 'buildGraph') {
      // Check if all bars have correct heights
      isCorrect = currentQuestion.categories.every(
        cat => userValues[cat.name] === cat.correctValue
      );
      
      if (isCorrect) {
        feedbackMessage = currentQuestion.feedback?.correct || 
          `¡Correcto! Has construido el gráfico perfectamente.`;
      } else {
        // Find which bars are incorrect
        const incorrectBars = currentQuestion.categories
          .filter(cat => userValues[cat.name] !== cat.correctValue)
          .map(cat => `${cat.name} (${userValues[cat.name]} vs ${cat.correctValue})`);
        
        feedbackMessage = currentQuestion.feedback?.incorrect || 
          `Las alturas no son correctas. Revisa: ${incorrectBars.join(', ')}.`;
        
        if (currentQuestion.hint) {
          feedbackMessage += ` ${currentQuestion.hint}`;
        }
      }
    } else if (currentQuestion.type === 'interpretGraph') {
      if (currentQuestion.options) {
        // Multiple choice question
        isCorrect = userAnswer === currentQuestion.answer;
        feedbackMessage = isCorrect
          ? (currentQuestion.feedback?.correct || '¡Correcto! Has interpretado bien el gráfico.')
          : (currentQuestion.feedback?.incorrect || 'Esa no es la respuesta correcta. Observa el gráfico con atención.');
      } else {
        // Numeric answer
        const numAnswer = parseInt(userAnswer || '0');
        const correctNum = parseInt(currentQuestion.answer);
        isCorrect = numAnswer === correctNum;
        feedbackMessage = isCorrect
          ? (currentQuestion.feedback?.correct || `¡Correcto! ${numAnswer} es la respuesta.`)
          : (currentQuestion.feedback?.incorrect || `La respuesta correcta es ${correctNum}.`);
      }
    }
    
    onAttempt(isCorrect);
    showFeedback({ type: isCorrect ? 'correct' : 'incorrect', message: feedbackMessage });
    
    if (!isCorrect) {
      setTimeout(() => {
        setIsAttemptPending(false);
      }, 1500);
    }
  }, [currentQuestion, userValues, userAnswer, onAttempt, showFeedback, isAttemptPending]);
  
  // Create sidebar controls based on the current question type
  const createSidebarControls = useCallback(() => {
    if (!currentQuestion) return null;
    
    // For graph building questions, create + and - buttons
    if (currentQuestion.type === 'buildGraph') {
      return (
        <div className="flex flex-col items-center p-2">
          <div className="text-center mb-3 text-slate-700 font-medium">
            {activeCategory ? `Ajustar: ${activeCategory}` : 'Selecciona una barra'}
          </div>
          
          {activeCategory && (
            <>
              <div className="mb-3 p-2 bg-slate-100 rounded-md w-full text-center">
                <span className="font-semibold text-2xl text-slate-800">{userValues[activeCategory] || 0}</span>
              </div>
              
              <div className="flex justify-between w-full mb-4">
                <button
                  className="w-20 h-16 flex items-center justify-center bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  onClick={() => adjustBarValue(activeCategory, -1)}
                  disabled={!activeCategory}
                  aria-label={`Disminuir valor de ${activeCategory}`}
                >
                  <span className="text-3xl font-bold">−</span>
                </button>
                
                <button
                  className="w-20 h-16 flex items-center justify-center bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  onClick={() => adjustBarValue(activeCategory, 1)}
                  disabled={!activeCategory}
                  aria-label={`Aumentar valor de ${activeCategory}`}
                >
                  <span className="text-3xl font-bold">+</span>
                </button>
              </div>
            </>
          )}
          
          <button
            onClick={verifyAnswer}
            className="mt-4 px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 w-full"
          >
            Verificar Gráfico
          </button>
          
          <p className="text-xs text-slate-600 mt-4 text-center">
            Haz clic en una barra para seleccionarla y ajustar su altura.
          </p>
        </div>
      );
    }
    
    // For interpretation questions with options
    if (currentQuestion.type === 'interpretGraph' && currentQuestion.options) {
      return (
        <div className="flex flex-col items-center p-2">
          <div className="text-center mb-2 text-slate-700 font-medium">
            Selecciona una respuesta:
          </div>
          
          <div className="flex flex-col space-y-2 w-full mb-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                className={`px-4 py-3 text-sm border rounded-md transition-colors ${
                  userAnswer === option 
                    ? 'bg-sky-100 border-sky-500 text-sky-700 font-medium' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          <button
            onClick={verifyAnswer}
            className="mt-2 px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 w-full"
            disabled={!userAnswer}
          >
            Verificar
          </button>
        </div>
      );
    }
    
    // For interpretation questions with numeric answers
    if (currentQuestion.type === 'interpretGraph') {
      return (
        <div className="flex flex-col items-center p-2">
          <div className="text-center mb-2 text-slate-700 font-medium">Ingresa tu respuesta:</div>
          <div className="mb-4 p-3 bg-slate-100 rounded-md w-full text-center">
            <span className="text-2xl font-bold">{userAnswer || '0'}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => setUserAnswer(prev => (prev || '') + num)}
                className="w-12 h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg text-lg font-semibold"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setUserAnswer(prev => (prev || '') + '0')}
              className="w-12 h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg text-lg font-semibold"
            >
              0
            </button>
            <button
              onClick={() => setUserAnswer(null)}
              className="w-12 h-12 flex items-center justify-center bg-red-200 hover:bg-red-300 rounded-lg text-lg font-semibold"
            >
              C
            </button>
            <button
              onClick={() => setUserAnswer(prev => prev?.slice(0, -1) || null)}
              className="w-12 h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg text-lg font-semibold"
            >
              ←
            </button>
          </div>
          
          <button
            onClick={verifyAnswer}
            className="mt-2 px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 w-full"
          >
            Verificar
          </button>
        </div>
      );
    }
    
    return null;
  }, [currentQuestion, activeCategory, userValues, adjustBarValue, userAnswer, verifyAnswer]);

  // Set up sidebar controls
  useEffect(() => {
    if (setCustomKeypadContent && currentQuestion) {
      setCustomKeypadContent(createSidebarControls());
    }
    
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, currentQuestion, activeCategory, userValues, userAnswer, createSidebarControls]);
  
  // Calculate max Y value and step for graph
  const calculatedMaxY = currentQuestion
    ? Math.max(10, ...currentQuestion.categories.map(cat => 
        Math.max(cat.correctValue, userValues[cat.name] || 0)
      )) * 1.2
    : 10;
  
  const calculatedYStep = calculatedMaxY <= 10 ? 1 : 
                         calculatedMaxY <= 20 ? 2 : 
                         calculatedMaxY <= 50 ? 5 : 10;

  // No need for these render functions anymore as controls are now in sidebar
  // They were moved to the external keypad via setExternalKeypad

  // Main render function
  if (!currentQuestion) {
    return <div className="flex justify-center items-center h-64">Cargando ejercicio...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
      <div className="relative flex items-center justify-center mb-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">
          {characterEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-sm p-2 max-w-[260px]" direction="left">
          {currentQuestion.description}
        </Icons.SpeechBubbleIcon>
      </div>

      <h3 className="text-lg font-semibold text-slate-700">
        {currentQuestion.title}
      </h3>

      <p className="text-sm text-slate-600 mb-2">
        {currentQuestion.question}
      </p>

      <div className="flex flex-col items-center justify-center">
        <BarGraphDisplay 
          categories={currentQuestion.categories}
          userValues={userValues}
          xAxisLabel={currentQuestion.xAxisLabel}
          yAxisLabel={currentQuestion.yAxisLabel}
          maxYAxisValue={calculatedMaxY}
          yAxisStep={calculatedYStep}
          activeCategory={activeCategory}
          onBarClick={handleBarClick}
          onBarAdjust={adjustBarValue}
          isInteractive={currentQuestion.type === 'buildGraph'}
          highlightMax={currentQuestion.type === 'interpretGraph' && 
            currentQuestion.question.toLowerCase().includes('más') || 
            currentQuestion.question.toLowerCase().includes('mayor')}
        />
        
        {activeCategory && currentQuestion.type === 'buildGraph' && (
          <p className="text-xs text-slate-600 mt-1 px-2 py-1 bg-sky-50 rounded-md border border-sky-200">
            Barra activa: <strong className="text-sky-700">{activeCategory}</strong>. 
            Altura actual: {userValues[activeCategory] || 0}. 
            Haz clic en la barra para ajustar su altura o usa los botones + y - debajo del gráfico.
          </p>
        )}
      </div>

      {/* All controls are now in the external keypad sidebar */}
    </div>
  );
};
