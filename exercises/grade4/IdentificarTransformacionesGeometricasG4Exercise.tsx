
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, TransformationChallenge, TransformationType } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface IdentificarTransformacionesGeometricasG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_TRANSFORM = ['🤔', '🧐', '💡', '➡️', '🔄', '🪞', '✨', '❓'];
const DEFAULT_TRANSFORM_EMOJI = '✨';

// Keypad Component for Options
const OptionsKeypad: React.FC<{
  options: { id: TransformationType; label: string }[];
  selectedOptionId: TransformationType | null;
  onSelect: (optionId: TransformationType) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerId: TransformationType | null;
}> = ({ options, selectedOptionId, onSelect, onVerify, isVerified, correctAnswerId }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
        if (isSelected) {
          buttonClass = isVerified && opt.id === correctAnswerId 
              ? 'bg-green-500 text-white ring-2 ring-green-700' 
              : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' 
              : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
        } else if (isVerified && opt.id === correctAnswerId) {
          // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct
        } else if (isVerified) {
          buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isVerified && selectedOptionId === correctAnswerId}
            className={`w-full p-3 rounded-lg text-center text-lg font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${opt.label}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId))
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const IdentificarTransformacionesGeometricasG4Exercise: React.FC<IdentificarTransformacionesGeometricasG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<TransformationChallenge | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<TransformationType | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(DEFAULT_TRANSFORM_EMOJI);
  const [availableChallenges, setAvailableChallenges] = useState<TransformationChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { 
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as TransformationChallenge[]]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as TransformationChallenge[]).length > 0) { 
      pool = shuffleArray([...challenges as TransformationChallenge[]]); 
      setAvailableChallenges(pool); 
    }

    if (pool.length > 0) {
      const next = {...pool[0]};
      next.options = next.options && next.options.length > 0 ? shuffleArray([...next.options]) : [
        {id:'traslacion', label:'Traslación'}, {id:'rotacion', label:'Rotación'}, {id:'reflexion', label:'Reflexión'}
      ];
      setCurrentChallenge(next);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_TRANSFORM[Math.floor(Math.random() * FACE_EMOJIS_TRANSFORM.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOptionId(null); 
    setIsVerified(false); 
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { 
    if ((challenges as TransformationChallenge[]).length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: TransformationType) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctTransformation) return;
    setSelectedOptionId(optionId); 
    showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctTransformation) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctTransformation)) return;
    setIsVerified(true);
    const isCorrect = selectedOptionId === currentChallenge.correctTransformation;
    onAttempt(isCorrect);
    const correctLabel = currentChallenge.options.find(opt => opt.id === currentChallenge.correctTransformation)?.label.toLowerCase() || "la correcta";
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! Es una ${correctLabel}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La transformación era: ${correctLabel}.` });
    }
  }, [currentChallenge, selectedOptionId, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando transformación...</div>;
    const { BeforeShapeComponent, AfterShapeComponent, shapeProps = {} } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {exercise.question || "¿Qué transformación geométrica ocurrió?"}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex flex-row justify-around items-center w-full my-3 space-x-2 sm:space-x-4">
          <div className="flex flex-col items-center p-2 border border-slate-300 rounded-lg bg-slate-50 shadow w-5/12 sm:w-[45%]">
            <p className="text-sm font-semibold text-slate-700 mb-1">ANTES</p>
            <div className="w-full aspect-square bg-white rounded flex items-center justify-center overflow-hidden p-1">
              <BeforeShapeComponent {...shapeProps} className="max-w-full max-h-full" />
            </div>
          </div>
          
          <div className="flex flex-col items-center p-2 border border-slate-300 rounded-lg bg-slate-50 shadow w-5/12 sm:w-[45%]">
            <p className="text-sm font-semibold text-slate-700 mb-1">DESPUÉS</p>
            <div className="w-full aspect-square bg-white rounded flex items-center justify-center overflow-hidden p-1">
              <AfterShapeComponent {...shapeProps} className="max-w-full max-h-full" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const KeypadForSidebar: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <OptionsKeypad
        options={currentChallenge.options}
        selectedOptionId={selectedOptionId}
        onSelect={handleOptionSelect}
        onVerify={verifyAnswer}
        isVerified={isVerified}
        correctAnswerId={currentChallenge.correctTransformation}
      />
    );
  }, [currentChallenge, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { 
    if (setCustomKeypadContent) { 
      if (currentChallenge) {
        setCustomKeypadContent(<KeypadForSidebar />);
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, KeypadForSidebar, currentChallenge]);

  return <MainContent />;
};
