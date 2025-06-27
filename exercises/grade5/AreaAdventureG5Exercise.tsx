
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, AreaAdventureChallenge } from '../../types';
import { Icons, CharacterQuestionIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface AreaAdventureG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_AREA = ['📐', '🤔', '🧐', '💡', '🖼️', '🏰', '🗺️'];

// --- Helper Modal Component ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleEsc); }
    else { document.body.style.overflow = 'auto'; }
    return () => { document.body.style.overflow = 'auto'; window.removeEventListener('keydown', handleEsc); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5" role="dialog" aria-modal="true" aria-labelledby="helpModalTitle" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-xl sm:text-2xl font-semibold text-sky-700">Fórmulas de Área</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl sm:text-4xl font-bold p-1" aria-label="Cerrar ayuda">&times;</button>
        </div>
        <div className="text-slate-700 space-y-4 leading-relaxed text-sm sm:text-base overflow-y-auto flex-grow">
          <div>
            <h4 className="font-bold text-sky-600">Rectángulo</h4>
            <p>El área de un rectángulo se calcula multiplicando su base por su altura.</p>
            <p className="mt-1 p-2 bg-slate-100 rounded text-center font-mono">Área = base × altura</p>
          </div>
          <div>
            <h4 className="font-bold text-sky-600">Triángulo</h4>
            <p>El área de un triángulo es la mitad del resultado de multiplicar su base por su altura.</p>
            <p className="mt-1 p-2 bg-slate-100 rounded text-center font-mono">Área = (base × altura) / 2</p>
          </div>
          <div>
            <h4 className="font-bold text-sky-600">Trapecio</h4>
            <p>Para un trapecio, se suman las dos bases (la mayor y la menor), se multiplica por la altura, y luego se divide por dos.</p>
            <p className="mt-1 p-2 bg-slate-100 rounded text-center font-mono">Área = ((Base mayor + Base menor) × altura) / 2</p>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center">
            Entendido
        </button>
      </div>
    </div>
  );
};

// --- Interactive Shape Viewer ---
interface InteractiveShapeViewerProps {
    shapeType: 'rectangle' | 'triangle' | 'trapezoid';
    initialDimensions: any;
}

const InteractiveShapeViewer: React.FC<InteractiveShapeViewerProps> = ({ shapeType, initialDimensions }) => {
    const [dims, setDims] = useState(initialDimensions);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        setDims(initialDimensions);
        setShowHint(false); 
    }, [initialDimensions]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDims((prev: any) => ({ ...prev, [name]: parseFloat(value) }));
    };

    let areaFormula = "";

    const { width = 0, height = 0, base = 0, base1 = 0, base2 = 0 } = dims || {};

    switch (shapeType) {
        case 'rectangle':
            areaFormula = `${width.toFixed(1)} × ${height.toFixed(1)}`;
            break;
        case 'triangle':
            areaFormula = `(${base.toFixed(1)} × ${height.toFixed(1)}) / 2`;
            break;
        case 'trapezoid':
            areaFormula = `((${base1.toFixed(1)} + ${base2.toFixed(1)}) × ${height.toFixed(1)}) / 2`;
            break;
    }
    
    return (
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 p-2 bg-slate-50 rounded-lg">
            <InteractiveShapeSVG shapeType={shapeType} dimensions={dims} showHint={showHint} />
            <div className="w-full md:w-1/2 space-y-3">
                {Object.keys(dims || {}).map(key => {
                    const value = dims[key as keyof typeof dims];
                    const displayValue = typeof value === 'number' ? value.toFixed(1) : '0.0';
                    const inputValue = typeof value === 'number' ? value : 0;
                    
                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-slate-700 capitalize">{key}: {displayValue}</label>
                            <input
                                type="range" id={key} name={key}
                                min="1" max="20" step="0.5"
                                value={inputValue}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    );
                })}
                <div className="pt-2 text-center">
                    <p className="text-sm text-slate-600">Fórmula: <span className="font-mono">{areaFormula}</span></p>
                     {shapeType === 'trapezoid' && (
                        <button onClick={() => setShowHint(prev => !prev)} className="mt-2 text-xs bg-sky-200 text-sky-800 px-2 py-1 rounded hover:bg-sky-300">
                           {showHint ? 'Ocultar Pista' : 'Mostrar Pista'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const InteractiveShapeSVG: React.FC<{ shapeType: 'rectangle' | 'triangle' | 'trapezoid', dimensions: any, showHint: boolean }> = ({ shapeType, dimensions, showHint }) => {
    const { width = 10, height = 10, base = 10, base1 = 10, base2 = 5 } = dimensions;
    const S = 150; // SVG Size
    const P = 15;  // Padding

    if (shapeType === 'rectangle') {
        const w = (width / 20) * (S - 2 * P); const h = (height / 20) * (S - 2 * P);
        const x = (S - w) / 2; const y = (S - h) / 2;
        return <svg viewBox={`0 0 ${S} ${S}`} className="w-48 h-48"><rect x={x} y={y} width={w} height={h} fill="rgba(135, 206, 235, 0.5)" stroke="rgb(59, 130, 246)" strokeWidth="2" /></svg>;
    }

    if (shapeType === 'triangle') {
        const b = (base / 20) * (S - 2 * P); const h = (height / 20) * (S - 2 * P);
        return <svg viewBox={`0 0 ${S} ${S}`} className="w-48 h-48"><polygon points={`${S/2 - b/2},${S-P} ${S/2 + b/2},${S-P} ${S/2},${S-P-h}`} fill="rgba(147, 197, 253, 0.5)" stroke="rgb(37, 99, 235)" strokeWidth="2" /></svg>;
    }

    if (shapeType === 'trapezoid') {
        const h = (height / 20) * (S - 2 * P); const b1 = (base1 / 20) * (S - 2 * P); const b2 = (base2 / 20) * (S - 2 * P);
        const yTop = (S - h) / 2; const yBottom = yTop + h;
        // The components for the animated hint
        const totalWidth = Math.max(b1, b2);
        const xOffset = (S - totalWidth) / 2;
        const rectWidth = Math.min(b1,b2);
        const triWidth1 = Math.abs(b1 - b2) / 2;
        const triWidth2 = triWidth1;
        const rectX = b1 > b2 ? xOffset + triWidth1 : xOffset;

        return (
            <svg viewBox={`0 0 ${S} ${S}`} className="w-48 h-48 overflow-visible">
                <polygon 
                    className={`trapezoid-part ${showHint ? 'hidden' : 'visible'}`}
                    points={`${(S-b1)/2},${yTop} ${(S+b1)/2},${yTop} ${(S+b2)/2},${yBottom} ${(S-b2)/2},${yBottom}`} 
                    fill="rgba(251, 146, 60, 0.5)" stroke="rgb(249, 115, 22)" strokeWidth="2" />
                
                {/* Decomposed parts for hint */}
                <g className={`trapezoid-part ${showHint ? 'visible' : 'hidden'}`}>
                    <polygon className={`triangle-left ${showHint ? 'separated' : ''}`} points={`${xOffset},${yBottom} ${xOffset+triWidth1},${yBottom} ${xOffset+triWidth1},${yTop}`} fill="rgba(134, 239, 172, 0.6)" stroke="rgb(22, 163, 74)" strokeWidth="1.5"/>
                    <rect x={rectX} y={yTop} width={rectWidth} height={h} fill="rgba(147, 197, 253, 0.6)" stroke="rgb(37, 99, 235)" strokeWidth="1.5"/>
                    <polygon className={`triangle-right ${showHint ? 'separated' : ''}`} points={`${rectX+rectWidth},${yTop} ${rectX+rectWidth},${yBottom} ${rectX+rectWidth+triWidth2},${yBottom}`} fill="rgba(134, 239, 172, 0.6)" stroke="rgb(22, 163, 74)" strokeWidth="1.5"/>
                </g>
            </svg>
        );
    }
    return null;
};


export const AreaAdventureG5Exercise: React.FC<AreaAdventureG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<AreaAdventureChallenge | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<AreaAdventureChallenge[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  
  const { challenges = [], allowDecimal = false } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as AreaAdventureChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as AreaAdventureChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as AreaAdventureChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
    } else {
      onAttempt(true); // All challenges done
      return;
    }
    setUserInput('');
    setIsAttemptPending(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if ((challenges as AreaAdventureChallenge[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseFloat(userInput.replace(',', '.'));
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      setIsAttemptPending(false);
      return;
    }
    const isCorrect = Math.abs(userAnswerNum - currentChallenge.correctAnswer) < 0.01;
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Área Correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. El área correcta era ${currentChallenge.correctAnswer} ${currentChallenge.unit}².` });
      setIsAttemptPending(false);
    }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') {
      verifyAnswer();
      return;
    }
    if (key === 'backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (allowDecimal && key === '.') {
      if (!userInput.includes('.')) {
        setUserInput(prev => prev + '.');
      }
    } else if (userInput.length < 6 && /\d/.test(key)) {
      setUserInput(prev => prev + key);
    }
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending, allowDecimal]);

  useEffect(() => {
    registerKeypadHandler(handleKeyPress);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress]);

  const defaultExplorerDimensions = useMemo(() => ({
    rectangle: { width: 5, height: 5 },
    triangle: { base: 5, height: 5 },
    trapezoid: { base1: 6, base2: 4, height: 3 },
  }), []);

  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando aventura de áreas...</div>;
    }
    
    const { shapeType, unit, prompt } = currentChallenge;
    const explorerDims = defaultExplorerDimensions[shapeType];

    return (
      <>
        <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
          <div className="w-full flex justify-start">
            <button onClick={() => setShowHelp(true)} className="px-3 py-1.5 bg-sky-100 text-sky-700 font-semibold rounded-lg shadow-sm hover:bg-sky-200 transition-colors text-xs flex items-center">
                <CharacterQuestionIcon className="w-4 h-4 mr-1 opacity-80" /> Fórmulas
            </button>
          </div>
          
          <div className="w-full border-t-2 border-dashed border-slate-300 my-2 pt-3">
              <h4 className="text-lg font-semibold text-slate-600">Explorador de Área</h4>
              <p className="text-xs text-slate-500 mb-2">Usa los controles deslizantes para visualizar y entender la fórmula del área.</p>
          </div>

          <InteractiveShapeViewer 
            shapeType={shapeType} 
            initialDimensions={explorerDims}
          />

          <div className="w-full p-4 mt-4 bg-amber-50 border border-amber-200 rounded-lg shadow">
             <p className="text-md font-semibold text-slate-700 text-center mb-3">
               {prompt}
             </p>
             <div className="flex items-center justify-center space-x-2">
               <label htmlFor="area-input" className="text-md font-semibold text-slate-700">Tu Respuesta:</label>
               <div className="w-36 h-14 bg-white border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl text-slate-700 font-mono tracking-wider shadow-inner">
                 {userInput || <span className="text-slate-400">_</span>}
                 {userInput && <span className="text-slate-500 text-lg ml-1">{unit}²</span>}
               </div>
             </div>
          </div>

        </div>
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </>
    );
  };
  
  return <MainContent />;
};
