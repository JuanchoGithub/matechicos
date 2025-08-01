import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, VolumeVoyageChallenge } from '../../types';
import { CharacterQuestionIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';
import { CubeStack } from '../../components/CubeStack';

interface VolumeVoyageG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

// --- Helper Components ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'auto'; }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-sky-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl font-bold">&times;</button>
        </div>
        <div className="text-slate-700 space-y-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const ComoEraContent: React.FC = () => (
    <>
      <p className="font-semibold text-sky-600 text-lg">¿Cómo se calcula el Volumen?</p>
      <p>El volumen es el espacio que ocupa un objeto. Para cubos y prismas rectangulares, la fórmula es muy sencilla:</p>
      <p className="mt-2 p-3 bg-slate-100 rounded text-center font-mono text-blue-700 text-lg shadow-inner">
        Volumen = Largo × Ancho × Alto
      </p>
      <p className="mt-2">Simplemente multiplicas las tres dimensiones. Si un cubo tiene lados de 4 cm, su volumen es 4 × 4 × 4 = 64 cm³ (centímetros cúbicos).</p>
    </>
);

// --- Prism3D SVG Component ---
const Prism3D: React.FC<{
    dimensions: { l: number; w: number; h: number },
    unit: string,
    animate?: boolean
}> = ({ dimensions, unit, animate }) => {
    // Drawing area
    const svgWidth = 360;
    const svgHeight = 260;
    const margin = 24;
    const { l, w, h } = dimensions;
    // Find the max possible extent in x/y for any orientation
    // Isometric projection: dx = scale*l, dy = scale*w*0.5, dz = -scale*h
    // The furthest right: x0 + scale*l + scale*w*0.5
    // The highest: y0 - scale*w*0.5 - scale*h
    // We'll solve for scale so that the shape fits within svgWidth/svgHeight with margin
    const maxL = Math.max(l, 1);
    const maxW = Math.max(w, 1);
    const maxH = Math.max(h, 1);
    // Calculate scale so that the shape fits
    const scaleX = (svgWidth - 2 * margin) / (maxL + maxW * 0.5);
    const scaleY = (svgHeight - 2 * margin) / (maxH + maxW * 0.5);
    const scale = Math.min(scaleX, scaleY);
    // Base point
    const x0 = margin;
    const y0 = svgHeight - margin;
    const dx = scale * l;
    const dy = scale * w * 0.5;
    const dz = -scale * h;
    // 8 corners of the prism
    const A = [x0, y0];
    const B = [x0 + dx, y0];
    const C = [x0 + dx + dy, y0 - dy];
    const D = [x0 + dy, y0 - dy];
    const E = [A[0], A[1] + dz];
    const F = [B[0], B[1] + dz];
    const G = [C[0], C[1] + dz];
    const H = [D[0], D[1] + dz];
    const pts = (arr: number[][]) => arr.map(p => p.join(",")).join(" ");
    return (
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto">
            {/* Draw faces in back-to-front order for 3D effect */}
            {/* Top face */}
            <polygon points={pts([E, F, G, H])} fill="#dbeafe" stroke="#2563eb" strokeWidth="2" opacity="0.7" />
            {/* Side face */}
            <polygon points={pts([B, C, G, F])} fill="#93c5fd" stroke="#2563eb" strokeWidth="2" opacity="0.8" />
            {/* Front face */}
            <polygon points={pts([A, B, F, E])} fill="#60a5fa" stroke="#2563eb" strokeWidth="2" opacity="0.9" />
            {/* Left face */}
            <polygon points={pts([A, D, H, E])} fill="#3b82f6" stroke="#2563eb" strokeWidth="2" opacity="0.8" />
            {/* Top outline for clarity */}
            <polyline points={pts([E, F, G, H, E])} fill="none" stroke="#1e40af" strokeWidth="2" />
            {/* Dimension labels, repositioned for new area */}
            <text x={x0 + dx/2} y={y0 + 24} fontSize="16" fill="#1e293b" textAnchor="middle">Largo: {l} {unit}</text>
            <text x={x0 - 10} y={y0 - dy/2} fontSize="16" fill="#1e293b" textAnchor="end">Ancho: {w} {unit}</text>
            <text x={x0 - 2} y={y0 + dz/2} fontSize="16" fill="#1e293b" textAnchor="end" transform={`rotate(-90,${x0 - 2},${y0 + dz/2})`}>Alto: {h} {unit}</text>
        </svg>
    );
};

// --- Main Component ---
export const VolumeVoyageG5Exercise: React.FC<VolumeVoyageG5ExerciseProps> = ({ exercise, scaffoldApi, registerKeypadHandler }) => {
  const [currentChallenge, setCurrentChallenge] = useState<VolumeVoyageChallenge | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<VolumeVoyageChallenge[]>([]);
  const [userDimensions, setUserDimensions] = useState({ l: 1, w: 1, h: 1 });
  const [userInputVolume, setUserInputVolume] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [animateCubes, setAnimateCubes] = useState(false);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as VolumeVoyageChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as VolumeVoyageChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setUserDimensions({ l: 1, w: 1, h: 1 }); // Reset sliders
      setAnimateCubes(false); // Reset animation state
      setIsAttemptPending(false);
    } else {
      onAttempt(true);
      return;
    }
    setUserInputVolume('');
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    // First check if we need to show challenge dimensions
    const { length, width, height } = currentChallenge.dimensions;
    const userHasAdjustedDimensions = userDimensions.l !== 1 || userDimensions.w !== 1 || userDimensions.h !== 1;
    
    // If the user hasn't adjusted any dimensions and this is their first try, 
    // set the dimensions to the challenge and show animation
    if (!userHasAdjustedDimensions) {
        setUserDimensions({ l: length, w: width, h: height });
        setAnimateCubes(true);
        showFeedback({ type: 'incorrect', message: 'Aquí tienes las dimensiones correctas. Ahora calcula el volumen.' });
        setIsAttemptPending(false);
        return;
    }

    // Check if dimensions match the challenge
    const isDimensionsCorrect = userDimensions.l === length && userDimensions.w === width && userDimensions.h === height;
    if (!isDimensionsCorrect) {
        showFeedback({ 
            type: 'incorrect', 
            message: `Las dimensiones no son las correctas. Usa largo: ${length}, ancho: ${width}, alto: ${height}.` 
        });
        setUserDimensions({ l: length, w: width, h: height });
        setAnimateCubes(true);
        onAttempt(false);
        setIsAttemptPending(false);
        return;
    }

    // Check if user has entered a volume
    const userAnswerVolume = parseInt(userInputVolume, 10);
    if (isNaN(userAnswerVolume)) {
        showFeedback({ type: 'incorrect', message: '¡Dimensiones correctas! Ahora ingresa el volumen que calculaste.' });
        onAttempt(false);
        setIsAttemptPending(false);
        return;
    }
    
    // Check if volume is correct
    const isVolumeCorrect = userAnswerVolume === currentChallenge.correctAnswer;
    onAttempt(isVolumeCorrect);

    if (isVolumeCorrect) {
        showFeedback({ 
            type: 'correct', 
            message: `¡Perfecto! ${length} × ${width} × ${height} = ${currentChallenge.correctAnswer} ${currentChallenge.unit}³` 
        });
        setAnimateCubes(true); // Celebrate with animation
    } else {
        showFeedback({ 
            type: 'incorrect', 
            message: `El volumen correcto es ${length} × ${width} × ${height} = ${currentChallenge.correctAnswer} ${currentChallenge.unit}³.` 
        });
        setIsAttemptPending(false);
    }
  }, [currentChallenge, userDimensions, userInputVolume, onAttempt, showFeedback, isAttemptPending]);
  
  const handleKeypad = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') verifyAnswer();
    else if (key === 'backspace') setUserInputVolume(prev => prev.slice(0, -1));
    else if (userInputVolume.length < 5 && /\d/.test(key)) setUserInputVolume(prev => prev + key);
  }, [userInputVolume, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => {
    registerKeypadHandler(handleKeypad);
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeypad]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando misión...</div>;

    const { unit } = currentChallenge;

    return (
      <>
        <div className="flex flex-col items-center justify-start text-center w-full max-w-md p-2 space-y-2">
          <div className="w-full flex justify-start">
              <button onClick={() => setShowHelp(true)} className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-lg shadow-sm hover:bg-sky-200 flex items-center gap-1">
                  <CharacterQuestionIcon className="w-4 h-4 opacity-70"/>Ayuda
              </button>
          </div>
          <p className="font-semibold text-slate-700 text-lg min-h-[4rem] flex items-center justify-center">{currentChallenge.prompt}</p>
          
          <div className="w-full h-48 flex items-center justify-center p-2 my-2">
            <Prism3D 
              dimensions={userDimensions} 
              unit={unit} 
              animate={animateCubes} 
            />
          </div>

          <div className="w-full max-w-sm space-y-3 p-4 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-md font-semibold text-slate-700">Ajusta dimensiones:</span>
                <button 
                  onClick={() => setAnimateCubes(true)} 
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Animar construcción
                </button>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Largo: <span className="font-bold text-slate-800">{userDimensions.l} {unit}</span></label>
                <input type="range" min="1" max="12" value={userDimensions.l} onChange={e => handleSliderChange('l', e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Ancho: <span className="font-bold text-slate-800">{userDimensions.w} {unit}</span></label>
                <input type="range" min="1" max="12" value={userDimensions.w} onChange={e => handleSliderChange('w', e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Alto: <span className="font-bold text-slate-800">{userDimensions.h} {unit}</span></label>
                <input type="range" min="1" max="12" value={userDimensions.h} onChange={e => handleSliderChange('h', e.target.value)} className="w-full" />
              </div>
          </div>
          
          <div className="w-full flex items-center justify-center space-x-2 mt-4">
              <label htmlFor="volume-input" className="text-md font-semibold text-slate-700">Volumen:</label>
              <div className="w-40 h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl font-mono">
                {userInputVolume || <span className="text-slate-400">_</span>}
              </div>
               <span className="text-slate-500 text-lg">{unit}³</span>
          </div>

        </div>
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Fórmula del Volumen">
          <ComoEraContent />
        </HelpModal>
      </>
    );
  };

  const handleSliderChange = (dim: 'l' | 'w' | 'h', value: string) => {
    setUserDimensions(prev => ({ ...prev, [dim]: parseInt(value, 10) }));
  };

  return <MainContent />;
};
