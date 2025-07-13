
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, CreateBarGraphChallengeG4, BarGraphCategoryDataG4 } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface CrearDiagramaBarrasSimpleG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_BAR_GRAPH = ['📊', '📈', '🤔', '🧐', '💡', '✏️', '🎨'];
const DEFAULT_BAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']; // blue, green, amber, red, purple, pink

const BarGraphDisplaySVG: React.FC<{
  categoriesData: BarGraphCategoryDataG4[];
  userFrequencies: { [category: string]: number };
  xAxisLabel: string;
  yAxisLabel: string;
  maxYAxisValue: number;
  yAxisStep: number;
  activeCategory: string | null;
  onBarClick: (categoryName: string) => void;
  width?: number;
  height?: number;
}> = ({ categoriesData, userFrequencies, xAxisLabel, yAxisLabel, maxYAxisValue, yAxisStep, activeCategory, onBarClick, width = 360, height = 280 }) => {
  const padding = { top: 20, right: 20, bottom: 60, left: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const numBars = categoriesData.length;
  const barGroupWidth = plotWidth / numBars;
  const barWidth = barGroupWidth * 0.6;
  const barSpacing = barGroupWidth * 0.4;

  return (
    <svg width={width} height={height} aria-label={`Gráfico de barras para ${xAxisLabel}`}>
      {/* Y-axis Label */}
      <text x={-(padding.top + plotHeight / 2)} y={padding.left / 3} transform="rotate(-90)" textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{yAxisLabel}</text>
      {/* X-axis Label */}
      <text x={padding.left + plotWidth / 2} y={height - padding.bottom / 4} textAnchor="middle" fontSize="10" fill="rgb(71 85 105)">{xAxisLabel}</text>

      {/* Axes */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" />
      <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" />

      {/* Y-axis Ticks and Grid Lines */}
      {Array.from({ length: Math.floor(maxYAxisValue / yAxisStep) + 1 }).map((_, i) => {
        const value = i * yAxisStep;
        const yPos = padding.top + plotHeight - (value / maxYAxisValue) * plotHeight;
        return (
          <g key={`y-tick-${value}`}>
            <line x1={padding.left - 3} y1={yPos} x2={padding.left + plotWidth} y2={yPos} stroke={value === 0 ? "rgb(100 116 139)" : "rgb(203 213 225)"} strokeWidth="1" strokeDasharray={value === 0 ? "" : "2,2"} />
            <text x={padding.left - 8} y={yPos + 3} textAnchor="end" fontSize="8" fill="rgb(100 116 139)">{value}</text>
          </g>
        );
      })}

      {/* Bars and X-axis Labels */}
      {categoriesData.map((cat, index) => {
        const userFreq = userFrequencies[cat.categoryName] || 0;
        const barHeight = maxYAxisValue > 0 ? (userFreq / maxYAxisValue) * plotHeight : 0;
        const xPos = padding.left + barSpacing / 2 + index * barGroupWidth;
        const barFillColor = cat.color || DEFAULT_BAR_COLORS[index % DEFAULT_BAR_COLORS.length];
        const isActive = activeCategory === cat.categoryName;
        
        return (
          <g 
            key={cat.categoryName} 
            onClick={() => onBarClick(cat.categoryName)}
            className="cursor-pointer group"
            aria-label={`Categoría ${cat.categoryName}, valor actual ${userFreq}. ${isActive ? 'Actualmente seleccionada.' : 'Haz clic para seleccionar.'}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onBarClick(cat.categoryName);}}
          >
            <rect
              x={xPos}
              y={padding.top + plotHeight - barHeight}
              width={barWidth}
              height={barHeight}
              fill={barFillColor}
              className={`transition-all duration-200 ease-in-out ${isActive ? 'opacity-100 ring-2 ring-offset-1 ring-sky-500' : 'opacity-70 group-hover:opacity-90'}`}
            />
            <text 
              x={xPos + barWidth / 2} 
              y={padding.top + plotHeight + 15} 
              textAnchor="middle" 
              fontSize={isActive ? "11" : "9"} 
              fill={isActive ? "rgb(2, 132, 199)" : "rgb(71 85 105)"} 
              fontWeight={isActive ? "bold" : "normal"}
              className={`transition-all duration-150 ease-in-out ${!isActive ? 'group-hover:fill-sky-600' : ''}`}
            >
              {cat.categoryName}
            </text>
            {userFreq > 0 && (
              <text x={xPos + barWidth / 2} y={padding.top + plotHeight - barHeight - 3} textAnchor="middle" fontSize="8" fill="rgb(50,50,50)" className="font-semibold pointer-events-none">{userFreq}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};


const FrequencyTableForGraph: React.FC<{ title: string; data: BarGraphCategoryDataG4[]; xAxisLabel: string; yAxisLabel: string }> = ({ title, data, xAxisLabel, yAxisLabel }) => (
  <div className="w-full max-w-xs p-2 bg-white rounded shadow-md mb-3">
    <h4 className="text-sm font-semibold text-center text-slate-700 mb-1.5">{title || "Tabla de Frecuencias"}</h4>
    <table className="w-full text-xs text-left text-slate-600">
      <thead className="bg-slate-100">
        <tr>
          <th scope="col" className="px-3 py-2 border border-slate-300 text-black">{xAxisLabel}</th>
          <th scope="col" className="px-3 py-2 border border-slate-300 text-right text-black">{yAxisLabel}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.categoryName} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
            <td className="px-3 py-2 border border-slate-300 font-medium text-slate-800">{row.categoryName}</td>
            <td className="px-3 py-2 border border-slate-300 text-right">{row.correctFrequency}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CrearDiagramaBarrasSimpleG4Exercise: React.FC<CrearDiagramaBarrasSimpleG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CreateBarGraphChallengeG4 | null>(null);
  const [userFrequencies, setUserFrequencies] = useState<{ [category: string]: number }>({});
  const [activeCategoryInput, setActiveCategoryInput] = useState<string | null>(null);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_BAR_GRAPH[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<CreateBarGraphChallengeG4[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as CreateBarGraphChallengeG4[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as CreateBarGraphChallengeG4[]).length > 0) {
      pool = shuffleArray([...challenges as CreateBarGraphChallengeG4[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      const initialFrequencies: { [category: string]: number } = {};
      nextChallenge.tableData.forEach(cat => initialFrequencies[cat.categoryName] = 0);
      setUserFrequencies(initialFrequencies);
      setActiveCategoryInput(nextChallenge.tableData[0]?.categoryName || null);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_BAR_GRAPH[Math.floor(Math.random() * FACE_EMOJIS_BAR_GRAPH.length)]);
    } else {
      onAttempt(true); return;
    }
    setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if ((challenges as CreateBarGraphChallengeG4[]).length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleBarClick = (categoryName: string) => { setActiveCategoryInput(categoryName); showFeedback(null); };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    let allCorrect = true;
    for (const catData of currentChallenge.tableData) {
      if ((userFrequencies[catData.categoryName] || 0) !== catData.correctFrequency) {
        allCorrect = false; break;
      }
    }
    onAttempt(allCorrect);
    if (allCorrect) showFeedback({ type: 'correct', message: '¡Gráfico de barras correcto!' });
    else { showFeedback({ type: 'incorrect', message: 'Algunas barras no tienen la altura correcta. Revisa la tabla.' }); setIsAttemptPending(false); }
  }, [currentChallenge, userFrequencies, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending || !activeCategoryInput || !currentChallenge) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    
    const currentValStr = (userFrequencies[activeCategoryInput] || 0).toString();
    let newValStr = currentValStr;

    if (key === 'backspace') {
      newValStr = currentValStr.slice(0, -1);
      if (newValStr === '') newValStr = '0';
    } else if (/\d/.test(key)) {
      newValStr = currentValStr === '0' ? key : currentValStr + key;
      if (newValStr.length > 2 && parseInt(newValStr,10) > (currentChallenge.maxYAxisValue || 99) ) {
         newValStr = key; // Reset if too long and over max
      } else if (newValStr.length > 2){
         newValStr = newValStr.slice(-2); // Keep last two digits if it gets too long but under max
      }
    }
    
    let newFreq = parseInt(newValStr, 10);
    if(isNaN(newFreq)) newFreq = 0;

    const maxY = currentChallenge.maxYAxisValue || Math.max(10, ...currentChallenge.tableData.map(d=>d.correctFrequency) || [10]) +2;
    if (newFreq > maxY) newFreq = maxY;


    setUserFrequencies(prev => ({ ...prev, [activeCategoryInput]: newFreq }));

  }, [activeCategoryInput, userFrequencies, verifyAnswer, showFeedback, isAttemptPending, currentChallenge]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    const maxYValueFromData = Math.max(...currentChallenge.tableData.map(item => item.correctFrequency), 0);
    const calculatedMaxY = currentChallenge.maxYAxisValue || (Math.ceil((maxYValueFromData +1) / 5) * 5) || 10;
    const calculatedYStep = currentChallenge.yAxisStep || Math.max(1, Math.ceil(calculatedMaxY / 5 / (calculatedMaxY > 20 ? 2 : 1) ) * (calculatedMaxY > 20 ? 2 : 1) );

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-sm p-2 max-w-[260px]" direction="left">
            {currentChallenge.description}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 w-full justify-center">
          <FrequencyTableForGraph title={currentChallenge.title} data={currentChallenge.tableData} xAxisLabel={currentChallenge.xAxisLabel} yAxisLabel={currentChallenge.yAxisLabel} />
          <BarGraphDisplaySVG 
            categoriesData={currentChallenge.tableData}
            userFrequencies={userFrequencies}
            xAxisLabel={currentChallenge.xAxisLabel}
            yAxisLabel={currentChallenge.yAxisLabel}
            maxYAxisValue={calculatedMaxY}
            yAxisStep={calculatedYStep}
            activeCategory={activeCategoryInput}
            onBarClick={handleBarClick}
          />
        </div>
        {activeCategoryInput && (
          <p className="text-xs text-slate-600 mt-1 px-2 py-1 bg-sky-50 rounded-md border border-sky-200">
            Barra activa: <strong className="text-sky-700">{activeCategoryInput}</strong>. Frecuencia actual: {userFrequencies[activeCategoryInput] || 0}. Haz clic en el <strong>nombre de la barra</strong> (debajo del gráfico) para seleccionarla.
          </p>
        )}
      </div>
    );
  };
  
  return <MainContent />;
};
