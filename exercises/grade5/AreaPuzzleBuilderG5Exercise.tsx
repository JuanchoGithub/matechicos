
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, AreaPuzzleChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface AreaPuzzleBuilderG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_AREA = ['📏', '📐', '🤔', '🧐', '💡', '🖼️', '🥕', '🧱', '🐔'];
const PIXELS_PER_UNIT = 10; // e.g., 10 pixels = 1 meter

// Helper to calculate polygon area using the shoelace formula
const calculatePolygonArea = (vertices: [number, number][]): number => {
    let area = 0;
    const n = vertices.length;
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += vertices[i][0] * vertices[j][1];
        area -= vertices[j][0] * vertices[i][1];
    }
    const pixelArea = Math.abs(area / 2);
    // Convert from pixel area to real area
    const realArea = pixelArea / (PIXELS_PER_UNIT * PIXELS_PER_UNIT);
    return parseFloat(realArea.toFixed(2)); // Round to handle potential floating point inaccuracies
};

// SVG Shape Component with Grid
const AreaShapeSVG: React.FC<{
    challenge: AreaPuzzleChallenge,
}> = ({ challenge }) => {
    const { vertices, unit } = challenge;
    const viewBoxSize = 130;

    const pathData = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v[0]} ${v[1]}`).join(' ') + ' Z';
    
    // Create grid pattern
    const gridPatternId = `grid-${challenge.id}`;
    const gridPattern = (
        <pattern id={gridPatternId} width={PIXELS_PER_UNIT} height={PIXELS_PER_UNIT} patternUnits="userSpaceOnUse">
            <path d={`M ${PIXELS_PER_UNIT} 0 L 0 0 0 ${PIXELS_PER_UNIT}`} fill="none" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.5" />
        </pattern>
    );

    return (
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
            <defs>{gridPattern}</defs>
            <polygon points={vertices.map(v => v.join(',')).join(' ')} fill={`url(#${gridPatternId})`} stroke="rgba(22, 163, 74, 0.9)" strokeWidth="2" />
        </svg>
    );
};


export const AreaPuzzleBuilderG5Exercise: React.FC<AreaPuzzleBuilderG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<AreaPuzzleChallenge | null>(null);
  const [userInput, setUserInput] = useState('');
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_AREA[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<AreaPuzzleChallenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);
  
  const correctAreaMemo = useMemo(() => currentChallenge ? calculatePolygonArea(currentChallenge.vertices) : 0, [currentChallenge]);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as AreaPuzzleChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as AreaPuzzleChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_AREA[Math.floor(Math.random() * FACE_EMOJIS_AREA.length)]);
    } else {
      onAttempt(true); return;
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
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido para el área.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    
    const isCorrect = Math.abs(userAnswerNum - correctAreaMemo) < 0.01;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Área correcta! ¡Excelente trabajo!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. El área correcta era ${correctAreaMemo} ${currentChallenge.unit}².` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, correctAreaMemo, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (key === '.') { if (!userInput.includes('.')) setUserInput(prev => prev + '.'); }
    else if (userInput.length < 6 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando constructor...</div>;

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-2 space-y-2">
      <div className="relative flex items-center justify-center mb-1">
        <div className="w-20 h-20 flex items-center justify-center text-6xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-emerald-500 text-white text-md p-2 max-w-[280px]" direction="left">
          {currentChallenge.context}
        </Icons.SpeechBubbleIcon>
      </div>

      <div className="w-full h-56 sm:h-64 flex items-center justify-center bg-green-50 p-2 rounded-lg border-2 border-green-200 shadow-md">
        <AreaShapeSVG challenge={currentChallenge} />
      </div>

      <div className="w-full p-2 bg-slate-100 rounded-md shadow-inner text-center min-h-[4rem]">
        <p className="text-xs text-slate-600">Recuerda: Área = base × altura. Para formas complejas, puedes dividirlas en rectángulos y sumar sus áreas.</p>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <label htmlFor="area-input" className="text-md font-semibold text-slate-700">Área Total:</label>
        <div className="w-32 h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-lg ml-1">{currentChallenge.unit}²</span>}
        </div>
      </div>
    </div>
  );
};
