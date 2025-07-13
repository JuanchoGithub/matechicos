
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, AreaCalculationChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { CuadradoConLadosSVG, RectanguloConLadosSVG } from '../../geometryDefinitions'; // Assuming side labels are shown

interface CalcularAreaG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_AREA = ['📐', '🤔', '🧐', '💡', '🖼️', '🏁'];

export const CalcularAreaG4Exercise: React.FC<CalcularAreaG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<AreaCalculationChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_AREA[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minSide = 1, maxSide = 20, unit = 'cm' } = exercise.data || {}; // Added unit default
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    const shapeType = Math.random() < 0.5 ? 'cuadrado' : 'rectangulo';
    const sideA = Math.floor(Math.random() * (maxSide - minSide + 1)) + minSide;
    let sideB = sideA; // Initialize sideB for square
    if (shapeType === 'rectangulo') {
      do {
        sideB = Math.floor(Math.random() * (maxSide - minSide + 1)) + minSide;
      } while (sideB === sideA && maxSide > minSide); // Ensure sideB is different for rectangle if possible
    }
    const correctArea = shapeType === 'cuadrado' ? sideA * sideA : sideA * sideB;
    setCurrentChallenge({ shapeType, sideA, sideB, correctArea, unit });
    setUserInput(''); 
    showFeedback(null); // Use scaffoldApi.showFeedback
    setIsAttemptPending(false);
    setCharacterEmoji(FACE_EMOJIS_AREA[Math.floor(Math.random() * FACE_EMOJIS_AREA.length)]);
  }, [minSide, maxSide, unit, showFeedback]); // Corrected dependency

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) generateNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    const userAnswerNum = parseInt(userInput, 10);
    if (isNaN(userAnswerNum)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número.' });
      onAttempt(false); setIsAttemptPending(false); return;
    }
    const isCorrect = userAnswerNum === currentChallenge.correctArea;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Área Correcta!' });
    else { showFeedback({ type: 'incorrect', message: `Incorrecto. El área era ${currentChallenge.correctArea}${currentChallenge.unit}².` }); setIsAttemptPending(false); }
  }, [currentChallenge, userInput, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') setUserInput(prev => prev.slice(0, -1));
    else if (userInput.length < 4 && /\d/.test(key)) setUserInput(prev => prev + key);
  }, [userInput, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { shapeType, sideA, sideB, unit: challengeUnit } = currentChallenge;
    const VisualComponent = shapeType === 'cuadrado' ? CuadradoConLadosSVG : RectanguloConLadosSVG;
    const sideLengths = shapeType === 'cuadrado' ? [sideA] : [sideA, sideB || sideA];
    const shapeName = shapeType === 'cuadrado' ? 'cuadrado' : 'rectángulo';

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-green-600 text-white text-md p-2 max-w-[280px]" direction="left">
            Calcula el área del {shapeName}:
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent className="max-w-full max-h-full" sideLengths={sideLengths} showLabels={true} fillColor={shapeType==='cuadrado' ? "rgba(255,215,0,0.2)" : "rgba(173,216,230,0.2)"} />
        </div>
        <p className="text-slate-600 text-sm">Lados: {sideA}{challengeUnit}{shapeType === 'rectangulo' ? ` y ${sideB}${challengeUnit}` : ''}</p>
        <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
          {userInput || <span className="text-slate-400">_</span>}
          {userInput && <span className="text-slate-500 text-xl ml-1">{challengeUnit}²</span>}
        </div>
      </div>
    );
  };
  return <MainContent />;
};
