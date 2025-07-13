
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, CirclePartId, CirclePartDefinition, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface IdentificarPartesCirculoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void; // Changed prop name
}

type ChallengeMode = 'identifyByName' | 'nameThePart';

interface CurrentChallenge {
  mode: ChallengeMode;
  targetPart: CirclePartDefinition;
  questionText: string;
  options: CirclePartDefinition[]; 
}

const FACE_EMOJIS_CIRCULO = ['🤔', '🧐', '💡', '🎯', '⭕', '⏺️', '📏'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const CircleDiagram: React.FC<{
    highlightedPartId?: CirclePartId | null;
    selectedPartId?: CirclePartId | null;
    onPartClick?: (partId: CirclePartId) => void;
    mode: ChallengeMode;
    targetPartNameForAccessibility?: string; 
}> = ({ highlightedPartId, selectedPartId, onPartClick, mode, targetPartNameForAccessibility }) => {
    const centerX = 100;
    const centerY = 100;
    const radius = 75;

    const getPartVisualClasses = (partId: CirclePartId, isOverrideHighlighted: boolean, isOverrideSelected: boolean): string => {
        let classes = "transition-all duration-200 ease-in-out ";
        const isLineElement = ['circunferencia', 'arco', 'diametro', 'radio', 'cuerda'].includes(partId);
        const styleTypeSuffix = isLineElement ? (partId === 'arco' ? 'line-arc' : 'line') 
                               : (partId === 'circulo' ? 'area' : 'point');
    
        if (isOverrideHighlighted) {
            classes += `cp-highlighted-${styleTypeSuffix} `;
        } else if (isOverrideSelected) {
            classes += `cp-selected-${styleTypeSuffix} `;
        } else {
            classes += `cp-default-${styleTypeSuffix} `;
        }
    
        if (onPartClick && mode === 'identifyByName') {
            classes += " circle-diagram-part ";
        }
        return classes.trim();
    };

    const renderPartElement = (partId: CirclePartId) => {
        const isHighlightedForPart = mode === 'nameThePart' && highlightedPartId === partId;
        const isSelectedForPart = mode === 'identifyByName' && selectedPartId === partId;
        const classNames = getPartVisualClasses(partId, isHighlightedForPart, isSelectedForPart);
        
        const commonProps = {
            className: classNames,
            onClick: (mode === 'identifyByName' && onPartClick) ? () => onPartClick(partId) : undefined,
            tabIndex: (onPartClick && mode === 'identifyByName') ? 0 : -1,
            role: (onPartClick && mode === 'identifyByName') ? 'button' : undefined,
            'aria-pressed': (onPartClick && mode === 'identifyByName' && isSelectedForPart) ? true : undefined,
        };

        let circuloDefaultFill: string | undefined = undefined;
        let circuloDefaultStroke: string | undefined = undefined;

        if (partId === 'circulo' && !isHighlightedForPart && !isSelectedForPart) {
            circuloDefaultFill = 'rgba(229, 231, 235, 0.7)'; 
            circuloDefaultStroke = 'transparent';
        }


        switch (partId) {
            case 'centro':
                return <circle cx={centerX} cy={centerY} r="7" {...commonProps} aria-label="Centro" />;
            case 'radio':
                return <line x1={centerX} y1={centerY} x2={centerX + radius * 0.7} y2={centerY - radius * 0.7} {...commonProps} aria-label="Radio" />;
            case 'diametro':
                return <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} {...commonProps} aria-label="Diámetro" />;
            case 'cuerda':
                return <line x1={centerX - radius * 0.6} y1={centerY - radius * 0.5} x2={centerX + radius * 0.3} y2={centerY + radius * 0.8} {...commonProps} aria-label="Cuerda" />;
            case 'arco': 
                return <path d={`M ${centerX} ${centerY-radius} A ${radius} ${radius} 0 0 1 ${centerX + radius*0.866} ${centerY - radius*0.5}`} {...commonProps} aria-label="Arco" />;
            case 'circunferencia':
                return <circle cx={centerX} cy={centerY} r={radius} {...commonProps} aria-label="Circunferencia (el borde)" />;
            case 'circulo':
                return <circle 
                            cx={centerX} cy={centerY} r={radius} 
                            fill={circuloDefaultFill} 
                            stroke={circuloDefaultStroke} 
                            {...commonProps} 
                            aria-label="Círculo (área interior)" />;
            default:
                return null;
        }
    };
    
    const baseCircleAriaLabel = "Diagrama de un círculo con sus partes.";
    const identifyByNameAriaLabel = targetPartNameForAccessibility ? `Por favor, haz clic en el ${targetPartNameForAccessibility} en el diagrama.` : baseCircleAriaLabel;
    const nameThePartAriaLabel = highlightedPartId ? `Una parte del círculo está resaltada. ¿Cuál es?` : baseCircleAriaLabel;

    return (
        <svg 
            viewBox="0 0 200 200" 
            className="w-full max-w-xs sm:max-w-sm h-auto aspect-square" 
            aria-label={mode === 'identifyByName' ? identifyByNameAriaLabel : nameThePartAriaLabel}
            role="graphics-document"
            aria-roledescription="diagrama interactivo"
        >
            <title>Diagrama de un Círculo</title>
            <desc>Un diagrama interactivo que muestra las partes de un círculo.</desc>
            
            {renderPartElement('circulo')}
            {renderPartElement('circunferencia')}

            {mode === 'nameThePart' && highlightedPartId && 
             !['circulo', 'circunferencia'].includes(highlightedPartId) &&
                renderPartElement(highlightedPartId)
            }

            {mode === 'identifyByName' && (
                <>
                    {['radio', 'diametro', 'cuerda', 'arco', 'centro'].map(part => 
                        renderPartElement(part as CirclePartId)
                    )}
                </>
            )}
        </svg>
    );
};


export const IdentificarPartesCirculoExercise: React.FC<IdentificarPartesCirculoExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent // Changed prop name
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CurrentChallenge | null>(null);
  const [selectedPartNameId, setSelectedPartNameId] = useState<CirclePartId | null>(null); 
  const [selectedDiagramPartId, setSelectedDiagramPartId] = useState<CirclePartId | null>(null); 
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(FACE_EMOJIS_CIRCULO[0]);
  const [availableParts, setAvailableParts] = useState<CirclePartDefinition[]>([]);

  const { parts = [] } = exercise.data as { parts: CirclePartDefinition[] } || {};
  
  const currentScaffoldApiRef = useRef(scaffoldApi);
  useEffect(() => {
    currentScaffoldApiRef.current = scaffoldApi;
  }, [scaffoldApi]);

  const prevAdvanceSignalRef = useRef(scaffoldApi.advanceToNextChallengeSignal);

  useEffect(() => {
    if (parts.length > 0) {
      setAvailableParts(shuffleArray([...parts]));
    }
  }, [parts]);

  const loadNewChallenge = useCallback(() => {
    setAvailableParts(currentAvailableParts => {
        let partPool = currentAvailableParts;
        if (partPool.length === 0 && parts.length > 0) {
            partPool = shuffleArray([...parts]);
        }
        
        if (partPool.length === 0) {
            currentScaffoldApiRef.current.onAttempt(true);
            return currentAvailableParts; 
        }

        const targetPart = partPool[0];
        const mode: ChallengeMode = Math.random() < 0.5 ? 'identifyByName' : 'nameThePart';
        let questionText = "";
        let options: CirclePartDefinition[] = [];

        if (mode === 'identifyByName') {
          questionText = `Haz clic en: ${targetPart.name}`;
        } else { 
          questionText = "¿Qué parte del círculo está resaltada?";
          const distractors = shuffleArray(parts.filter(p => p.id !== targetPart.id)).slice(0, 3);
          options = shuffleArray([targetPart, ...distractors]);
        }

        setCurrentChallenge({ mode, targetPart, questionText, options });
        return partPool.slice(1); 
    });

    setSelectedPartNameId(null);
    setSelectedDiagramPartId(null);
    setIsVerified(false);
    currentScaffoldApiRef.current.showFeedback(null);
    setCurrentEmoji(FACE_EMOJIS_CIRCULO[Math.floor(Math.random() * FACE_EMOJIS_CIRCULO.length)]);
  }, [parts]); 

  useEffect(() => {
    if (parts.length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [parts, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = scaffoldApi.advanceToNextChallengeSignal;
  }, [scaffoldApi.advanceToNextChallengeSignal, loadNewChallenge]);


  const handleDiagramPartClick = useCallback((partId: CirclePartId) => {
    if (isVerified && selectedDiagramPartId === currentChallenge?.targetPart.id && currentChallenge?.mode === 'identifyByName') return;
    if (currentChallenge?.mode === 'identifyByName') {
      setSelectedDiagramPartId(partId);
      currentScaffoldApiRef.current.showFeedback(null);
      if (isVerified && selectedDiagramPartId !== currentChallenge?.targetPart.id) setIsVerified(false);
    }
  }, [isVerified, selectedDiagramPartId, currentChallenge?.targetPart.id, currentChallenge?.mode, currentScaffoldApiRef]);

  const handleNameOptionClick = useCallback((partId: CirclePartId) => {
    if (isVerified && selectedPartNameId === currentChallenge?.targetPart.id && currentChallenge?.mode === 'nameThePart') return;
    if (currentChallenge?.mode === 'nameThePart') {
      setSelectedPartNameId(partId);
      currentScaffoldApiRef.current.showFeedback(null);
      if (isVerified && selectedPartNameId !== currentChallenge?.targetPart.id) setIsVerified(false);
    }
  }, [isVerified, selectedPartNameId, currentChallenge?.targetPart.id, currentChallenge?.mode, currentScaffoldApiRef]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || (isVerified && ((currentChallenge.mode === 'identifyByName' && selectedDiagramPartId === currentChallenge.targetPart.id) || (currentChallenge.mode === 'nameThePart' && selectedPartNameId === currentChallenge.targetPart.id)))) return;
    
    const { mode, targetPart } = currentChallenge;
    let isCorrect = false;

    if (mode === 'identifyByName' && selectedDiagramPartId) {
      isCorrect = selectedDiagramPartId === targetPart.id;
    } else if (mode === 'nameThePart' && selectedPartNameId) {
      isCorrect = selectedPartNameId === targetPart.id;
    } else {
      currentScaffoldApiRef.current.showFeedback({type: 'incorrect', message: "Por favor, selecciona una opción."});
      return;
    }
    
    setIsVerified(true);
    currentScaffoldApiRef.current.onAttempt(isCorrect);

    if (isCorrect) {
      currentScaffoldApiRef.current.showFeedback({ type: 'correct', message: `¡Correcto! Es: ${targetPart.name}.` });
    } else {
      currentScaffoldApiRef.current.showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Intenta otra vez!' });
    }
  }, [currentChallenge, selectedDiagramPartId, selectedPartNameId, isVerified, currentScaffoldApiRef]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-pink-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallenge.questionText}
          </Icons.SpeechBubbleIcon>
        </div>
        <CircleDiagram
          highlightedPartId={currentChallenge.mode === 'nameThePart' ? currentChallenge.targetPart.id : null}
          selectedPartId={currentChallenge.mode === 'identifyByName' ? selectedDiagramPartId : null}
          onPartClick={handleDiagramPartClick}
          mode={currentChallenge.mode}
          targetPartNameForAccessibility={currentChallenge.mode === 'identifyByName' ? currentChallenge.targetPart.name : undefined}
        />
      </div>
    );
  };

  const OptionsSidebarContent: React.FC = useMemo(() => () => {
    if (!currentChallenge) return null;
    const optionsToShow = currentChallenge.mode === 'nameThePart' ? currentChallenge.options : [];
    
    const makeButtonsNonInteractive = 
      (isVerified && ((currentChallenge.mode === 'identifyByName' && selectedDiagramPartId === currentChallenge.targetPart.id) || (currentChallenge.mode === 'nameThePart' && selectedPartNameId === currentChallenge.targetPart.id)));

    return (
      <div className="w-full flex flex-col space-y-1.5 p-2">
        {currentChallenge.mode === 'nameThePart' && optionsToShow.map((partDef) => {
          const isSelected = selectedPartNameId === partDef.id;
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

          if (isSelected) { 
            if (isVerified) { 
              buttonClass = partDef.id === currentChallenge.targetPart.id ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
            } else { 
              buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
            }
          } else if (isVerified) {
             buttonClass = 'bg-slate-200 text-slate-500';
             if (makeButtonsNonInteractive) {
                buttonClass += ' cursor-not-allowed';
             }
          }
          
          return (
            <button
              key={partDef.id}
              onClick={() => handleNameOptionClick(partDef.id)}
              disabled={makeButtonsNonInteractive || (isVerified && selectedPartNameId !== currentChallenge.targetPart.id && currentChallenge.mode === 'nameThePart')}
              className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm ${makeButtonsNonInteractive && !(isSelected && partDef.id === currentChallenge.targetPart.id && isVerified) ? 'cursor-default ' + buttonClass : buttonClass + ' hover:shadow-md'}`}
            >
              {partDef.name}
            </button>
          );
        })}
        <button
          onClick={verifyAnswer}
          disabled={
            (currentChallenge.mode === 'identifyByName' && !selectedDiagramPartId) ||
            (currentChallenge.mode === 'nameThePart' && !selectedPartNameId) ||
            makeButtonsNonInteractive
          }
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${((currentChallenge.mode === 'identifyByName' && !selectedDiagramPartId) || (currentChallenge.mode === 'nameThePart' && !selectedPartNameId) || makeButtonsNonInteractive)
              ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
        >
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  }, [currentChallenge, selectedPartNameId, selectedDiagramPartId, isVerified, handleNameOptionClick, verifyAnswer]); 

  useEffect(() => {
    if (setCustomKeypadContent) { // Changed prop name
      if (currentChallenge) {
        setCustomKeypadContent(<OptionsSidebarContent />);
      } else {
        setCustomKeypadContent(null);
      }
      return () => {
        if (setCustomKeypadContent) { // Changed prop name
          setCustomKeypadContent(null);
        }
      };
    }
  }, [setCustomKeypadContent, OptionsSidebarContent, currentChallenge]); // Changed prop name

  return <MainContent />;
};
