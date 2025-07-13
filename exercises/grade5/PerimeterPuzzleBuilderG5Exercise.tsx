
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PerimeterPuzzleChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface PerimeterPuzzleBuilderG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_PERIMETER = ['📏', '📐', '🤔', '🧐', '💡', '➕', '✅', '🦁', '🐵', '🐼', '🦜'];
const PIXELS_PER_UNIT = 10; // e.g., 10 pixels = 1 meter

// Helper to calculate distance between two points
const distance = (p1: [number, number], p2: [number, number]): number => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
};

// Helper to calculate side lengths from vertices, rounded to one decimal place
const calculateSideLengths = (vertices: [number, number][]): number[] => {
    const lengths: number[] = [];
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const pixelLength = distance(p1, p2);
        const realLength = parseFloat((pixelLength / PIXELS_PER_UNIT).toFixed(1));
        lengths.push(realLength);
    }
    return lengths;
};

// SVG Shape Component
const ShapeSVG: React.FC<{
    challenge: PerimeterPuzzleChallenge,
    revealedSides: boolean[],
    onSideClick: (index: number) => void
}> = ({ challenge, revealedSides, onSideClick }) => {
    const { vertices, unit } = challenge;
    const sideLengths = calculateSideLengths(vertices);
    const viewBoxSize = 130;

    const pathData = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v[0]} ${v[1]}`).join(' ') + ' Z';

    return (
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
            <polygon points={vertices.map(v => v.join(',')).join(' ')} fill="rgba(134, 239, 172, 0.3)" stroke="rgba(22, 163, 74, 0.8)" strokeWidth="2" />
            {vertices.map((_, index) => {
                const p1 = vertices[index];
                const p2 = vertices[(index + 1) % vertices.length];
                const midX = (p1[0] + p2[0]) / 2;
                const midY = (p1[1] + p2[1]) / 2;
                // Angle for text rotation
                const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;

                return (
                    <g key={index} onClick={() => onSideClick(index)} className="cursor-pointer">
                        <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="transparent" strokeWidth="15" />
                        {revealedSides[index] && (
                            <text
                                x={midX} y={midY}
                                fontSize="8" fill="rgb(21, 128, 61)" textAnchor="middle"
                                dominantBaseline="central"
                                transform={`rotate(${angle} ${midX} ${midY}) translate(0, -6)`}
                                className="font-semibold pointer-events-none"
                            >
                                {sideLengths[index]}{unit}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};


export const PerimeterPuzzleBuilderG5Exercise: React.FC<PerimeterPuzzleBuilderG5ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<PerimeterPuzzleChallenge | null>(null);
  const [revealedSides, setRevealedSides] = useState<boolean[]>([]);
  const [userInput, setUserInput] = useState('');
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_PERIMETER[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [availableChallenges, setAvailableChallenges] = useState<PerimeterPuzzleChallenge[]>([]);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const sideLengthsMemo = useMemo(() => currentChallenge ? calculateSideLengths(currentChallenge.vertices) : [], [currentChallenge]);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as PerimeterPuzzleChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as PerimeterPuzzleChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setRevealedSides(new Array(nextChallenge.vertices.length).fill(false));
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.icon || FACE_EMOJIS_PERIMETER[Math.floor(Math.random() * FACE_EMOJIS_PERIMETER.length)]);
    } else {
      onAttempt(true); return;
    }
    setUserInput(''); setIsAttemptPending(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleSideClick = (index: number) => {
    if (isAttemptPending) return;
    setRevealedSides(prev => {
      const newRevealed = [...prev];
      newRevealed[index] = true;
      return newRevealed;
    });
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);

    if (revealedSides.some(revealed => !revealed)) {
        showFeedback({ type: 'incorrect', message: '¡Aún no has medido todos los lados! Haz clic en cada lado para ver su longitud.' });
        setIsAttemptPending(false);
        return;
    }

    const correctPerimeter = parseFloat(sideLengthsMemo.reduce((sum, len) => sum + len, 0).toFixed(1));
    const userAnswerNum = parseFloat(userInput.replace(',', '.'));
    
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido para el perímetro.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = Math.abs(userAnswerNum - correctPerimeter) < 0.01;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Perímetro correcto! ¡Buen trabajo!' });
    else { showFeedback({ type: 'incorrect', message: `Casi... El perímetro correcto era ${correctPerimeter} ${currentChallenge.unit}. ¡Suma de nuevo!` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, revealedSides, sideLengthsMemo, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (key === '.') { if (!userInput.includes('.')) setUserInput(prev => prev + '.'); }
    else if (userInput.length < 6 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const calculationTape = sideLengthsMemo
    .filter((_, index) => revealedSides[index])
    .join(' + ');

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
        <ShapeSVG challenge={currentChallenge} revealedSides={revealedSides} onSideClick={handleSideClick} />
      </div>

      <div className="w-full p-2 bg-slate-100 rounded-md shadow-inner text-center min-h-[4rem]">
        <p className="text-xs text-slate-600">Cálculo:</p>
        <p className="font-mono text-lg text-slate-800 break-all">{calculationTape || "Haz clic en los lados para medir..."}</p>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <label htmlFor="perimeter-input" className="text-md font-semibold text-slate-700">Perímetro Total:</label>
        <div className="w-32 h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-lg ml-1">{currentChallenge.unit}</span>}
        </div>
      </div>
    </div>
  );
};
