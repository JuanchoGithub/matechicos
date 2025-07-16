
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MetricConversionQuestChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface MetricConversionQuestG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

// Main content components are below

// --- Help Modal Component ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-5 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-xl font-semibold text-sky-700">Ayuda para Conversiones</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl font-bold p-1" aria-label="Cerrar ayuda">&times;</button>
        </div>
        <div className="text-slate-700 space-y-3 leading-relaxed text-sm overflow-y-auto flex-grow">
            <h4 className="font-bold text-sky-600">Longitud (metro: m)</h4>
            <ul className="list-disc list-inside space-y-1">
                <li>1 kilómetro (km) = 1.000 metros (m)</li>
                <li>1 metro (m) = 100 centímetros (cm)</li>
                <li>1 centímetro (cm) = 10 milímetros (mm)</li>
            </ul>
            <p className="text-xs italic">Para convertir de una unidad grande a una más pequeña (ej: km a m), se <strong>multiplica</strong>. Para convertir de una pequeña a una grande (ej: cm a m), se <strong>divide</strong>.</p>
            <hr className="my-2"/>
            <h4 className="font-bold text-sky-600">Masa (gramo: g)</h4>
            <ul className="list-disc list-inside space-y-1">
                <li>1 tonelada (t) = 1.000 kilogramos (kg)</li>
                <li>1 kilogramo (kg) = 1.000 gramos (g)</li>
            </ul>
             <hr className="my-2"/>
            <h4 className="font-bold text-sky-600">Capacidad (litro: L)</h4>
            <ul className="list-disc list-inside space-y-1">
                <li>1 kilolitro (kL) = 1.000 litros (L)</li>
                <li>1 litro (L) = 1.000 mililitros (mL)</li>
            </ul>
        </div>
        <button onClick={onClose} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center">Entendido</button>
      </div>
    </div>
  );
};


// Visual Aid Components
const ConversionLineSVG: React.FC<{ 
    from: string, 
    to: string, 
    operation: 'x 1000' | '÷ 1000' | 'x 100' | '÷ 100', 
    animate?: boolean 
}> = ({ from, to, operation, animate = false }) => (
    <div className="flex items-center space-x-2 p-2 bg-slate-100 rounded-lg">
        <span className={`font-semibold text-slate-700 p-2 bg-white rounded shadow ${animate ? 'transition-all duration-700' : ''}`} style={{ 
            transform: animate && operation.includes('x') ? 'scale(0.5)' : animate && operation.includes('÷') ? 'scale(2)' : 'scale(1)'
        }}>{from}</span>
        <div className="flex flex-col items-center">
            <span className="text-xs text-blue-600">{operation}</span>
            <svg width="100" height="20">
                <line x1="5" y1="10" x2="95" y2="10" stroke="rgb(59, 130, 246)" strokeWidth="2" />
                <polygon points="95,10 85,6 85,14" fill="rgb(59, 130, 246)" />
            </svg>
        </div>
        <span className={`font-semibold text-slate-700 p-2 bg-white rounded shadow ${animate ? 'transition-all duration-700' : ''}`} style={{ 
            transform: animate && operation.includes('x') ? 'scale(2)' : animate && operation.includes('÷') ? 'scale(0.5)' : 'scale(1)'
        }}>{to}</span>
    </div>
);

const BalanceScaleSVG: React.FC<{ leftLabel: string, rightLabel: string, leftValue: number, rightValue: number }> = ({ leftLabel, rightLabel, leftValue, rightValue }) => {
    let rotation = 0;
    if(leftValue > rightValue) rotation = -5;
    if(rightValue > leftValue) rotation = 5;

    return (
        <svg viewBox="0 0 120 70" className="w-48 h-auto">
            {/* Base */}
            <polygon points="55,65 65,65 70,70 50,70" fill="#a8a29e" />
            <rect x="58" y="30" width="4" height="35" fill="#a8a29e" />
            {/* Beam */}
            <g transform={`rotate(${rotation} 60 30)`}>
                <rect x="10" y="28" width="100" height="4" fill="#78716c" rx="2" />
                <circle cx="60" cy="30" r="5" fill="#57534e" />
                 {/* Left Pan */}
                <line x1="20" y1="32" x2="20" y2="40" stroke="#78716c" />
                <ellipse cx="20" cy="45" rx="15" ry="5" fill="#d6d3d1" stroke="#78716c" strokeWidth="1"/>
                <text x="20" y="47" textAnchor="middle" fontSize="6px" className="font-bold">{leftLabel}</text>
                {/* Right Pan */}
                <line x1="100" y1="32" x2="100" y2="40" stroke="#78716c" />
                <ellipse cx="100" cy="45" rx="15" ry="5" fill="#d6d3d1" stroke="#78716c" strokeWidth="1"/>
                <text x="100" y="47" textAnchor="middle" fontSize="6px" className="font-bold">{rightLabel}</text>
            </g>
        </svg>
    );
};

export const MetricConversionQuestG5Exercise: React.FC<MetricConversionQuestG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MetricConversionQuestChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  // Store the emoji for the current challenge
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<MetricConversionQuestChallenge[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges]));
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as MetricConversionQuestChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as MetricConversionQuestChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
    } else {
      onAttempt(true); // All challenges done
      return;
    }
    setUserInput(''); setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseFloat(userInput.replace(',', '.'));
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = Math.abs(userAnswerNum - currentChallenge.correctAnswer) < 0.001; // Tolerance for float
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Misión cumplida! Conversión correcta.' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentChallenge.correctAnswer} ${currentChallenge.toUnit}.` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (key === '.') { if (!userInput.includes('.')) setUserInput(prev => prev + '.'); }
    else if (userInput.length < 8 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  // Draggable conversion number component
  const DraggableConversion: React.FC<{
    valueFrom: number,
    fromUnit: string, 
    toUnit: string, 
    onValueDragged: (value: number) => void
  }> = ({ valueFrom, fromUnit, toUnit, onValueDragged }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isConverted, setIsConverted] = useState(false);
    
    const handleDragStart = () => {
      setIsDragging(true);
    };
    
    const handleDragEnd = () => {
      if (position.x > 100) { // Threshold for conversion
        setIsConverted(true);
        onValueDragged(valueFrom);
      } else {
        setPosition({ x: 0, y: 0 });
      }
      setIsDragging(false);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setPosition({ 
        x: Math.max(0, Math.min(200, position.x + e.movementX)), 
        y: position.y 
      });
    };
    
    // Convert based on units
    const getConversionFactor = (): number => {
      const conversionPair = `${fromUnit}-${toUnit}`;
      if (['km-m', 'm-cm', 'cm-mm'].includes(conversionPair)) return 1000;
      if (['m-km', 'cm-m', 'mm-cm'].includes(conversionPair)) return 0.001;
      if (['kg-g', 't-kg', 'l-ml', 'kl-l'].includes(conversionPair)) return 1000;
      if (['g-kg', 'kg-t', 'ml-l', 'l-kl'].includes(conversionPair)) return 0.001;
      return 1;
    };

    const convertedValue = valueFrom * getConversionFactor();
    
    return (
      <div className="relative w-72 h-24 mt-4 select-none">
        <div className="absolute top-10 left-0 right-0 h-2 bg-gray-300 rounded"></div>
        
        {/* Unit labels */}
        <div className="absolute top-0 left-4 text-sm font-bold text-blue-600">{fromUnit}</div>
        <div className="absolute top-0 right-4 text-sm font-bold text-green-600">{toUnit}</div>
        
        {/* Draggable value */}
        <div 
          className={`absolute top-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} 
                      bg-white p-2 rounded-lg shadow-lg transition-transform duration-300 border-2 
                      ${isConverted ? 'border-green-500' : 'border-blue-500'}`}
          style={{ 
            transform: `translateX(${position.x}px)`,
            left: isConverted ? 'auto' : '20px',
            right: isConverted ? '20px' : 'auto'
          }}
          onMouseDown={isConverted ? undefined : handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isDragging && handleDragEnd()}
        >
          <span className="text-xl font-mono">
            {isConverted ? convertedValue : valueFrom} 
            <span className="text-sm ml-0.5">{isConverted ? toUnit : fromUnit}</span>
          </span>
        </div>
      </div>
    );
  };

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando misión...</div>;
    const { valueFrom, fromUnit, toUnit, context, icon, unitType } = currentChallenge;
    const [isAnimating, setIsAnimating] = useState(false);
    const [showConversionTip, setShowConversionTip] = useState(false);
    
    // Determine operation type and factor
    const conversionPair = `${fromUnit}-${toUnit}`;
    const isMultiplying = ['km-m', 'm-cm', 'cm-mm', 'kg-g', 't-kg', 'l-ml', 'kl-l'].includes(conversionPair);
    
    let operation: 'x 1000' | '÷ 1000' | 'x 100' | '÷ 100' = 'x 1000';
    if (conversionPair === 'm-cm' || conversionPair === 'cm-mm') {
      operation = 'x 100';
    } else if (conversionPair === 'cm-m' || conversionPair === 'mm-cm') {
      operation = '÷ 100';
    } else if (!isMultiplying) {
      operation = '÷ 1000';
    }

    const handleDraggedValue = () => {
      setUserInput(currentChallenge.correctAnswer.toString());
      // Trigger animation to show the conversion
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    };
    
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="w-full flex justify-between m-0.5">
            <button onClick={() => setShowHelp(true)} className="px-3 py-1.5 bg-sky-100 text-sky-700 font-semibold rounded-lg shadow-sm hover:bg-sky-200 transition-colors text-xs flex items-center">
                <Icons.CharacterQuestionIcon className="w-4 h-4 mr-1 opacity-80" /> Ayuda
            </button>
            <button onClick={() => setShowConversionTip(true)} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 font-semibold rounded-lg shadow-sm hover:bg-yellow-200 transition-colors text-xs">
                Pista
            </button>
        </div>
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{icon}</div>
          <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {context}
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-xl font-semibold text-slate-700">Convierte <strong className="text-blue-600">{valueFrom} {fromUnit}</strong> a <strong className="text-green-600">{toUnit}</strong></p>
        
        {/* Interactive draggable conversion option */}
        <DraggableConversion 
          valueFrom={valueFrom} 
          fromUnit={fromUnit} 
          toUnit={toUnit}
          onValueDragged={handleDraggedValue}
        />
        
        <div className="my-2 h-20 flex items-center justify-center">
            {unitType === 'mass' ? 
                <BalanceScaleSVG leftLabel={`${valueFrom}${fromUnit}`} rightLabel={`${userInput || '?'}${toUnit}`} leftValue={valueFrom} rightValue={parseFloat(userInput) || 0} />
                : <ConversionLineSVG from={fromUnit} to={toUnit} operation={operation} animate={isAnimating} />
            }
        </div>
        
        {showConversionTip && (
          <div className="w-full p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 relative">
            <button onClick={() => setShowConversionTip(false)} className="absolute top-1 right-2 text-yellow-600">&times;</button>
            {isMultiplying ? 
              <p>Multiplica por {operation.split(' ')[1]} para convertir {fromUnit} a {toUnit}.</p> :
              <p>Divide por {operation.split(' ')[1]} para convertir {fromUnit} a {toUnit}.</p>
            }
          </div>
        )}
        
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-1">{toUnit}</span>}
        </div>
      </div>
    );
  };
  return (
    <>
      <MainContent />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};
