
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, PerimeterShapeDefinition, PERIMETER_SHAPE_TYPE_LABELS, PerimeterShapeTypeId, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface CalcularPerimetroPoligonoSimpleExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (keypadNode: React.ReactNode | null) => void;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

type ExercisePhase = 'identify' | 'calculate';

interface CurrentChallenge {
  shapeDef: PerimeterShapeDefinition;
  sideLengths: number[];
  correctPerimeter: number;
}

const FACE_EMOJIS_PERIMETER = ['📏', '📐', '🤔', '🧐', '💡', '➕', '✅', '🔲', '🔺'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const CalcularPerimetroPoligonoSimpleExercise: React.FC<CalcularPerimetroPoligonoSimpleExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
  registerKeypadHandler,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_PERIMETER[0]);
  const [availableShapes, setAvailableShapes] = useState<PerimeterShapeDefinition[]>([]);
  
  const [currentPhase, setCurrentPhase] = useState<ExercisePhase>('identify');
  const [selectedShapeTypeOption, setSelectedShapeTypeOption] = useState<PerimeterShapeTypeId | null>(null);
  const [isIdentificationVerified, setIsIdentificationVerified] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [shuffledShapeOptions, setShuffledShapeOptions] = useState<PerimeterShapeTypeId[]>([]);

  const { shapes = [], minSideLength = 1, maxSideLength = 20 } = exercise.data as {
    shapes: PerimeterShapeDefinition[];
    minSideLength: number;
    maxSideLength: number;
  } || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (shapes.length > 0) {
      setAvailableShapes(shuffleArray([...shapes]));
      setShuffledShapeOptions(shuffleArray(Object.keys(PERIMETER_SHAPE_TYPE_LABELS) as PerimeterShapeTypeId[]));
    }
  }, [shapes]);

  const loadNewChallenge = useCallback(() => {
    let shapePool = availableShapes;
    if (shapePool.length === 0 && shapes.length > 0) {
        shapePool = shuffleArray([...shapes]);
        setAvailableShapes(shapePool);
    }

    if (shapePool.length > 0) {
      const shapeDef = shapePool[0];
      const sideLengths = shapeDef.generateSideLengths(minSideLength, maxSideLength);
      const correctPerimeter = shapeDef.getPerimeter(sideLengths);
      
      setCurrentChallenge({ shapeDef, sideLengths, correctPerimeter });
      setAvailableShapes(prev => prev.slice(1));
    } else {
      onAttempt(true); // Signal completion of internal challenges
      return;
    }
    
    setUserInput('');
    showFeedback(null);
    setCurrentEmoji(FACE_EMOJIS_PERIMETER[Math.floor(Math.random() * FACE_EMOJIS_PERIMETER.length)]);
    setCurrentPhase('identify');
    setSelectedShapeTypeOption(null);
    setIsIdentificationVerified(false);
    setShowFormula(false);
    setShuffledShapeOptions(shuffleArray(Object.keys(PERIMETER_SHAPE_TYPE_LABELS) as PerimeterShapeTypeId[]));
  }, [availableShapes, shapes, minSideLength, maxSideLength, showFeedback, onAttempt]);

  useEffect(() => {
    if (shapes.length > 0 && !currentChallenge) {
        loadNewChallenge();
    }
  }, [shapes, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);


  const handleShapeTypeOptionSelect = (shapeTypeId: PerimeterShapeTypeId) => {
    if (currentPhase !== 'identify' || (isIdentificationVerified && selectedShapeTypeOption === currentChallenge?.shapeDef.id)) return;
    setSelectedShapeTypeOption(shapeTypeId);
    showFeedback(null);
    if (isIdentificationVerified && selectedShapeTypeOption !== currentChallenge?.shapeDef.id) setIsIdentificationVerified(false);
  };

  const verifyShapeIdentification = () => {
    if (!currentChallenge || currentPhase !== 'identify' || !selectedShapeTypeOption) return;

    setIsIdentificationVerified(true);
    if (selectedShapeTypeOption === currentChallenge.shapeDef.id) {
      showFeedback({ type: 'correct', message: `¡Correcto! Es un ${currentChallenge.shapeDef.name.toLowerCase()}.` });
      setShowFormula(true);
      setTimeout(() => {
        showFeedback(null);
        setCurrentPhase('calculate');
      }, 1500);
    } else {
      const selectedLabel = PERIMETER_SHAPE_TYPE_LABELS[selectedShapeTypeOption];
      showFeedback({ type: 'incorrect', message: `No es un ${selectedLabel.toLowerCase()}. ¡Intenta de nuevo!` });
      setIsIdentificationVerified(false);
    }
  };

  const verifyPerimeterAnswer = useCallback(() => {
    if (!currentChallenge || currentPhase !== 'calculate') return;
    const userAnswer = parseInt(userInput, 10);
    if (isNaN(userAnswer)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, introduce un número válido.' });
      onAttempt(false);
      return;
    }

    const isCorrect = userAnswer === currentChallenge.correctPerimeter;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Perímetro Correcto! El perímetro es ${currentChallenge.correctPerimeter}.` });
    } else {
      showFeedback({ type: 'incorrect', message: 'Perímetro incorrecto. Recuerda sumar todos los lados. ¡Intenta otra vez!' });
    }
  }, [currentChallenge, userInput, currentPhase, showFeedback, onAttempt]);

  const handleNumericKeyPress = useCallback((key: string) => {
    if (currentPhase !== 'calculate') return;
    showFeedback(null);
    if (key === 'backspace') {
      setUserInput('');
    } else if (key === 'check') {
      verifyPerimeterAnswer();
    } else if (userInput.length < 3 && /\d/.test(key)) {
      setUserInput(prev => prev + key);
    }
  }, [currentPhase, userInput, verifyPerimeterAnswer, showFeedback]);
  
  useEffect(() => {
    if (currentPhase === 'calculate') {
      registerKeypadHandler(handleNumericKeyPress);
    } else {
      registerKeypadHandler(null);
    }
    return () => registerKeypadHandler(null);
  }, [currentPhase, registerKeypadHandler, handleNumericKeyPress]);


  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando figura...</div>;
    }
    const { shapeDef, sideLengths } = currentChallenge;
    const { VisualComponent, name, formulaDescription } = shapeDef;
    
    let speechBubbleText = "";
    if (currentPhase === 'identify') {
      speechBubbleText = "Que figura es esta?";
    } else {
      speechBubbleText = `Ahora, calcula el perímetro de este ${name.toLowerCase()}:`;
    }

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-emerald-500 text-white text-sm p-2 max-w-[280px]" direction="left">{speechBubbleText}</Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent 
            className="max-w-full max-h-full" 
            strokeColor="rgb(20 83 45)" 
            fillColor={currentPhase === 'calculate' ? "rgba(22,163,74,0.2)" : "rgba(200,200,200,0.2)"}
            sideLengths={sideLengths}
            showLabels={currentPhase === 'calculate'}
          />
        </div>
        {currentPhase === 'calculate' && showFormula && <p className="text-slate-600 text-xs italic max-w-md fade-in">Fórmula: {formulaDescription}</p>}
        {currentPhase === 'calculate' && (
          <div className="w-3/4 max-w-xs h-16 sm:h-20 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-3xl sm:text-4xl text-slate-700 font-mono tracking-wider shadow-inner">
            {userInput || <span className="text-slate-400">_</span>}
            {userInput && <span className="text-slate-500 text-xl ml-1">cm</span>}
          </div>
        )}
      </div>
    );
  };

  const KeypadContentForIdentification: React.FC = useMemo(() => () => {
    if (!currentChallenge || currentPhase !== 'identify') return null;
    return (
      <div className="w-full flex flex-col space-y-1.5 p-2">
        {shuffledShapeOptions.map((shapeTypeId) => {
          const label = PERIMETER_SHAPE_TYPE_LABELS[shapeTypeId];
          const isSelected = selectedShapeTypeOption === shapeTypeId;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
          if (isIdentificationVerified) {
            if (isSelected) buttonClass = shapeTypeId === currentChallenge.shapeDef.id ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
            else buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          } else if (isSelected) buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          return (
            <button key={shapeTypeId} onClick={() => handleShapeTypeOptionSelect(shapeTypeId)}
                    disabled={isIdentificationVerified && selectedShapeTypeOption === currentChallenge.shapeDef.id}
                    className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold ${buttonClass}`}>
              {label}
            </button>
          );
        })}
        <button onClick={verifyShapeIdentification} disabled={!selectedShapeTypeOption || (isIdentificationVerified && selectedShapeTypeOption === currentChallenge.shapeDef.id)}
                className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white ${(!selectedShapeTypeOption || (isIdentificationVerified && selectedShapeTypeOption === currentChallenge.shapeDef.id)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Confirmar Figura
        </button>
      </div>
    );
  }, [currentChallenge, currentPhase, shuffledShapeOptions, selectedShapeTypeOption, isIdentificationVerified, handleShapeTypeOptionSelect, verifyShapeIdentification]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentPhase === 'identify' && currentChallenge) {
        setCustomKeypadContent(<KeypadContentForIdentification />);
      } else {
        setCustomKeypadContent(null); // Numeric keypad will be handled by registerKeypadHandler
      }
    }
    return () => {
      if (setCustomKeypadContent) setCustomKeypadContent(null);
    };
  }, [setCustomKeypadContent, currentPhase, currentChallenge, KeypadContentForIdentification]);

  return <MainContent />;
};
