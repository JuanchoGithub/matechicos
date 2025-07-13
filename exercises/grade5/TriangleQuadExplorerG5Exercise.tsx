
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, TriangleQuadExplorerChallenge, QuadrilateralTypeId, QuadrilateralDefinition, QUADRILATERAL_TYPE_LABELS } from '../../types';
import { Icons, CharacterQuestionIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface TriangleQuadExplorerProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_EXPLORER = ['🔬', '🤔', '🧐', '💡', '📐', '✨'];

// --- UI Components ---

const TriangleAngleSVG: React.FC<{ angles: [number, number, number | null] }> = ({ angles }) => {
    // This is a representative visual, not a geometrically perfect one based on angles
    return (
        <svg viewBox="0 0 120 120" className="w-48 h-48">
            <polygon points="60,10 110,100 10,100" stroke="rgb(59, 130, 246)" fill="rgba(147, 197, 253, 0.3)" strokeWidth="2" />
            <text x="60" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgb(29, 78, 216)">{angles[0]}°</text>
            <text x="30" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgb(29, 78, 216)">{angles[1]}°</text>
            <text x="90" y="95" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgb(239, 68, 68)">?</text>
        </svg>
    );
};

const QuadrilateralOptionsKeypad: React.FC<{
  options: QuadrilateralDefinition[];
  selectedOptionId: QuadrilateralTypeId | null;
  onSelect: (id: QuadrilateralTypeId) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerId: QuadrilateralTypeId | null;
}> = ({ options, selectedOptionId, onSelect, onVerify, isVerified, correctAnswerId }) => {
    return (
        <div className="w-full flex flex-col space-y-2 p-2">
            {options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
                 if (isVerified) {
                    if (isSelected) {
                        buttonClass = opt.id === correctAnswerId ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
                    } else {
                        buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
                    }
                } else if (isSelected) {
                    buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
                }
                
                return (
                    <button key={opt.id} onClick={() => onSelect(opt.id)} disabled={isVerified && selectedOptionId === correctAnswerId}
                            className={`w-full p-2 rounded-lg flex items-center justify-center space-x-2 text-md font-semibold transition-all shadow-sm ${buttonClass}`}>
                        <opt.VisualComponent className="w-8 h-8" />
                        <span>{opt.name}</span>
                    </button>
                );
            })}
            <button onClick={onVerify} disabled={!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)}
                    className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
            </button>
        </div>
    );
};


export const TriangleQuadExplorerG5Exercise: React.FC<TriangleQuadExplorerProps> = ({
  exercise, scaffoldApi, registerKeypadHandler, setCustomKeypadContent
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<TriangleQuadExplorerChallenge | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<TriangleQuadExplorerChallenge[]>([]);
  const [userInputAngle, setUserInputAngle] = useState('');
  const [selectedQuadId, setSelectedQuadId] = useState<QuadrilateralTypeId | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_EXPLORER[0]);

  const { challenges = [], quadrilateralDefinitions = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);
  
  useEffect(() => {
    if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges]));
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as TriangleQuadExplorerChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as TriangleQuadExplorerChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      setCurrentChallenge(pool[0]);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_EXPLORER[Math.floor(Math.random() * FACE_EMOJIS_EXPLORER.length)]);
    } else {
      onAttempt(true);
      return;
    }
    setUserInputAngle('');
    setSelectedQuadId(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if ((challenges as TriangleQuadExplorerChallenge[]).length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge();
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge) return;
    if (isVerified) return;

    let isCorrect = false;
    if (currentChallenge.type === 'triangle_angle') {
      const { knownAngles } = currentChallenge;
      const correctAnswer = 180 - knownAngles[0] - knownAngles[1];
      const userAnswer = parseInt(userInputAngle, 10);
      isCorrect = !isNaN(userAnswer) && userAnswer === correctAnswer;
      if (isCorrect) {
        showFeedback({ type: 'correct', message: `¡Eso es! 180° - ${knownAngles[0]}° - ${knownAngles[1]}° = ${correctAnswer}°.` });
      } else {
        showFeedback({ type: 'incorrect', message: `No es correcto. Recuerda que los ángulos de un triángulo suman 180°. La respuesta era ${correctAnswer}°.` });
      }
    } else if (currentChallenge.type === 'quad_property') {
        if (!selectedQuadId) {
            showFeedback({type: 'incorrect', message: "Por favor, selecciona una figura."});
            return;
        }
      isCorrect = selectedQuadId === currentChallenge.correctShapeId;
      if (isCorrect) {
          showFeedback({ type: 'correct', message: `¡Correcto! Un ${QUADRILATERAL_TYPE_LABELS[currentChallenge.correctShapeId].toLowerCase()} tiene esas propiedades.` });
      } else {
          showFeedback({ type: 'incorrect', message: `No es correcto. Esa figura no cumple con la descripción.`});
      }
    }
    
    setIsVerified(true);
    onAttempt(isCorrect);

  }, [currentChallenge, userInputAngle, selectedQuadId, onAttempt, showFeedback]);

  const handleKeyPress = useCallback((key: string) => {
    if (currentChallenge?.type !== 'triangle_angle' || isVerified) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInputAngle(prev => prev.slice(0, -1));
    else if (userInputAngle.length < 3 && /\d/.test(key)) setUserInputAngle(prev => prev + key);
  }, [userInputAngle, verifyAnswer, showFeedback, isVerified, currentChallenge]);
  
  useEffect(() => {
    if (currentChallenge?.type === 'triangle_angle') {
      registerKeypadHandler(handleKeyPress);
      if (setCustomKeypadContent) setCustomKeypadContent(null);
    } else if (currentChallenge?.type === 'quad_property') {
      registerKeypadHandler(null);
      if (setCustomKeypadContent) {
        const quadOptions = currentChallenge.options
            .map(optId => quadrilateralDefinitions.find(def => def.id === optId))
            .filter((def): def is QuadrilateralDefinition => !!def);

        setCustomKeypadContent(
          <QuadrilateralOptionsKeypad 
            options={quadOptions}
            selectedOptionId={selectedQuadId}
            onSelect={(id) => { if(!isVerified) setSelectedQuadId(id); }}
            onVerify={verifyAnswer}
            isVerified={isVerified}
            correctAnswerId={currentChallenge.correctShapeId}
          />
        );
      }
    }
    return () => {
      registerKeypadHandler(null);
      if (setCustomKeypadContent) setCustomKeypadContent(null);
    };
  }, [currentChallenge, registerKeypadHandler, setCustomKeypadContent, selectedQuadId, verifyAnswer, isVerified]);

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando misión...</div>;

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-2 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
            <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md p-2 max-w-[280px]" direction="left">
                Misión de Laboratorio:
            </Icons.SpeechBubbleIcon>
        </div>

      {currentChallenge.type === 'triangle_angle' && (
        <>
            <p className="text-md font-semibold text-slate-700">Encuentra el ángulo faltante en este triángulo:</p>
            <TriangleAngleSVG angles={[currentChallenge.knownAngles[0], currentChallenge.knownAngles[1], null]} />
            <div className="flex items-center space-x-2">
                 <label htmlFor="angle-input" className="text-lg font-medium">Ángulo Faltante:</label>
                 <div className="w-24 h-14 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl text-slate-700 font-mono">
                    {userInputAngle || <span className="text-slate-400">?</span>}
                    {userInputAngle && <span className="text-slate-500 text-2xl">°</span>}
                 </div>
            </div>
             <p className="text-xs text-slate-500 italic">Pista: ¡La suma de los ángulos de un triángulo es 180°!</p>
        </>
      )}

      {currentChallenge.type === 'quad_property' && (
        <>
            <p className="text-md font-semibold text-slate-700">Identifica el cuadrilátero con esta propiedad:</p>
            <div className="p-3 my-2 bg-amber-100 border border-amber-300 rounded-md shadow-sm min-h-[3rem] flex items-center justify-center">
                <p className="text-slate-800 italic">"{currentChallenge.description}"</p>
            </div>
            <p className="text-sm text-slate-500 mt-2">Selecciona la figura correcta en el panel de la derecha.</p>
            {selectedQuadId && (
                <div className="mt-2 text-center text-slate-600">
                    Seleccionado: <span className="font-bold">{QUADRILATERAL_TYPE_LABELS[selectedQuadId]}</span>
                </div>
            )}
        </>
      )}

    </div>
  );
};
