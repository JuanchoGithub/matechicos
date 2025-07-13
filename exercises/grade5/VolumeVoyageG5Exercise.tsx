
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, VolumeVoyageChallenge } from '../../types';
import { Icons, CharacterQuestionIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface VolumeVoyageG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_VOLUME = ['🧊', '🤔', '🧐', '💡', '📦', '🧱', '🚀'];

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

const Cube: React.FC<{ x: number, y: number, size: number }> = React.memo(({ x, y, size }) => (
    <g transform={`translate(${x}, ${y})`}>
        {/* Top Face */}
        <path d={`M 0 0 L ${size} 0 L ${size * 1.5} ${size * -0.25} L ${size * 0.5} ${size * -0.25} Z`} fill="#60a5fa" stroke="#1e40af" strokeWidth="0.5"/>
        {/* Front face */}
        <path d={`M 0 0 L 0 ${size} L ${size} ${size} L ${size} 0 Z`} fill="#3b82f6" stroke="#1e40af" strokeWidth="0.5"/>
        {/* Right face */}
        <path d={`M ${size} 0 L ${size} ${size} L ${size * 1.5} ${size * 0.75} L ${size * 1.5} ${size * -0.25} Z`} fill="#93c5fd" stroke="#1e40af" strokeWidth="0.5"/>
    </g>
));

const Prism3D: React.FC<{ dimensions: { l: number; w: number; h: number } }> = React.memo(({ dimensions }) => {
    const { l, w, h } = dimensions;
    if (l === 0 || w === 0 || h === 0) return null;

    const size = 18;
    const cubes = [];

    // Loop from bottom to top, front to back
    for (let y = 0; y < h; y++) {
        for (let z = 0; z < w; z++) { // INVERTED LOOP: From front (0) to back (w-1)
            for (let x = 0; x < l; x++) {
                const screenX = (x * size) + (z * size * 0.5);
                const screenY = (z * size * 0.25) - (y * size);
                cubes.push(<Cube key={`${x}-${y}-${z}`} x={screenX} y={screenY} size={size} />);
            }
        }
    }

    const totalWidth = l * size + w * size * 0.5 + 20;
    const totalHeight = h * size + w * size * 0.25 + 20;

    return (
        <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="w-full h-full max-w-md max-h-56 drop-shadow-lg overflow-visible">
            <g transform={`translate(10, ${totalHeight * 0.8})`}>
                {cubes}
            </g>
        </svg>
    );
});


// --- Main Component ---
export const VolumeVoyageG5Exercise: React.FC<VolumeVoyageG5ExerciseProps> = ({ exercise, scaffoldApi, registerKeypadHandler }) => {
  const [currentChallenge, setCurrentChallenge] = useState<VolumeVoyageChallenge | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<VolumeVoyageChallenge[]>([]);
  const [userDimensions, setUserDimensions] = useState({ l: 1, w: 1, h: 1 });
  const [userInputVolume, setUserInputVolume] = useState('');
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_VOLUME[0]);
  const [showHelp, setShowHelp] = useState(false);
  
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
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_VOLUME[Math.floor(Math.random() * FACE_EMOJIS_VOLUME.length)]);
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
    if (!currentChallenge) return;

    const { length, width, height } = currentChallenge.dimensions;
    const isDimensionsCorrect = userDimensions.l === length && userDimensions.w === width && userDimensions.h === height;

    if (!isDimensionsCorrect) {
        showFeedback({ type: 'incorrect', message: 'Las dimensiones no son las correctas para este desafío. ¡Ajusta los controles!' });
        onAttempt(false);
        return;
    }

    const userAnswerVolume = parseInt(userInputVolume, 10);
    if (isNaN(userAnswerVolume)) {
        showFeedback({ type: 'incorrect', message: '¡Dimensiones correctas! Ahora ingresa el volumen que calculaste.' });
        onAttempt(false);
        return;
    }
    
    const isVolumeCorrect = userAnswerVolume === currentChallenge.correctAnswer;
    onAttempt(isVolumeCorrect);

    if (isVolumeCorrect) {
        showFeedback({ type: 'correct', message: '¡Perfecto! Dimensiones y volumen correctos.' });
    } else {
        showFeedback({ type: 'incorrect', message: `Dimensiones correctas, pero el volumen no. El volumen correcto es ${currentChallenge.correctAnswer} ${currentChallenge.unit}³.` });
    }
  }, [currentChallenge, userDimensions, userInputVolume, onAttempt, showFeedback]);
  
  const handleKeypad = useCallback((key: string) => {
    if (key === 'check') verifyAnswer();
    else if (key === 'backspace') setUserInputVolume(prev => prev.slice(0, -1));
    else if (userInputVolume.length < 5 && /\d/.test(key)) setUserInputVolume(prev => prev + key);
  }, [userInputVolume, verifyAnswer]);
  
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
            <Prism3D dimensions={userDimensions} />
          </div>

          <div className="w-full max-w-sm space-y-3 p-4 bg-white rounded-lg shadow-lg border border-slate-200">
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
