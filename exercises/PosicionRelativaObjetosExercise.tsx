
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ExerciseScaffold } from '../../components/ExerciseScaffold'; // Removed
import { Exercise as ExerciseType, AvatarData, SpatialChallenge, ExerciseScaffoldApi } from '../../types';
import { Icons } from '../../components/icons';

interface PosicionRelativaObjetosExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

const CHARACTER_EMOJIS_POSICION = ['🤔', '🧐', '👀', '📍', '🗺️', '👆', '➡️', '🍎', '📦'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const PosicionRelativaObjetosExercise: React.FC<PosicionRelativaObjetosExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<SpatialChallenge | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [chosenWordForQuestion, setChosenWordForQuestion] = useState<string>("[___]");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(CHARACTER_EMOJIS_POSICION[0]);
  const [availableChallenges, setAvailableChallenges] = useState<SpatialChallenge[]>([]);

  const { 
    challenges = [], 
    options = [], 
    questionTemplateString = "¿{itemLabel} está {optionPlaceholder} de {referenceLabel}?" 
  } = exercise.data || {};

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);


  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges.length > 0) {
        challengePool = shuffleArray([...challenges]);
        setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(nextChallenge.emoji || CHARACTER_EMOJIS_POSICION[Math.floor(Math.random() * CHARACTER_EMOJIS_POSICION.length)]);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOptionId(null);
    setChosenWordForQuestion("[___]");
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
        loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctAnswerId) return;
    
    setSelectedOptionId(optionId);
    const optionObject = (options as {id: string, label:string}[])?.find(opt => opt.id === optionId);
    if (optionObject) {
        setChosenWordForQuestion(optionObject.label.toLowerCase());
    }

    showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctAnswerId) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback, options]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)) return;
    setIsVerified(true);
    
    const currentConceptOptions = (options as {id: string, label:string}[]) || [];
    const correctOptionObj = currentConceptOptions.find(opt => opt.id === currentChallenge.correctAnswerId);
    const correctOptionLabel = correctOptionObj ? correctOptionObj.label.toLowerCase() : currentChallenge.correctAnswerId;
    
    const selectedOptionObj = currentConceptOptions.find(opt => opt.id === selectedOptionId);
    const selectedOptionLabel = selectedOptionObj ? selectedOptionObj.label.toLowerCase() : "tu selección";

    const isCorrect = selectedOptionId === currentChallenge.correctAnswerId;
    onAttempt(isCorrect);

    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! ${currentChallenge.itemLabel} está ${correctOptionLabel} de ${currentChallenge.referenceLabel}.` });
      setChosenWordForQuestion(correctOptionLabel); 
    } else {
      showFeedback({ type: 'incorrect', message: `No es correcto. ${currentChallenge.itemLabel} está ${correctOptionLabel} de ${currentChallenge.referenceLabel}, no ${selectedOptionLabel}.` });
      setTimeout(() => setIsVerified(false), 1500);
    }
  }, [currentChallenge, selectedOptionId, isVerified, showFeedback, onAttempt, options]);
  
  const VisualDisplay: React.FC<{ challenge: SpatialChallenge }> = ({ challenge }) => {
    const { item, reference, position } = challenge.visuals;
    let arrangement; 
    const boxStyle = `border-4 border-dashed border-slate-400 p-3 rounded-lg w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-slate-100`;
    const baseItemStyle = "text-6xl sm:text-7xl transition-transform duration-300 ease-in-out";
    const baseReferenceStyle = "text-6xl sm:text-7xl opacity-80 transition-transform duration-300 ease-in-out";
    const stackedItemBaseStyle = "absolute transition-transform duration-300 ease-in-out";
    const zStackContainerStyle = "relative w-24 h-24 flex items-center justify-center";

    switch (position) {
        case 'inside':      arrangement = <div className={`${boxStyle} relative`}><span className="absolute opacity-0">{reference}</span><span className={`${baseItemStyle} absolute`}>{item}</span> </div>; break;
        case 'outside':     arrangement = <><span className={`${baseItemStyle} mr-3 sm:mr-4`}>{item}</span><div className={boxStyle}><span className="opacity-0">{reference}</span></div></>; break;
        case 'above':       arrangement = <div className="flex flex-col items-center space-y-1 sm:space-y-2"><span className={baseItemStyle}>{item}</span><hr className="w-16 border-slate-300 border-t-2 my-1"/><span className={baseReferenceStyle}>{reference}</span></div>; break;
        case 'below':       arrangement = <div className="flex flex-col items-center space-y-1 sm:space-y-2"><span className={baseReferenceStyle}>{reference}</span><hr className="w-16 border-slate-300 border-t-2 my-1"/><span className={baseItemStyle}>{item}</span></div>; break;
        case 'on_top':      arrangement = <div className="flex flex-col items-center"><span className={baseItemStyle}>{item}</span><span className={baseReferenceStyle}>{reference}</span></div>; break;
        case 'under':       arrangement = <div className="flex flex-col items-center"><span className={baseReferenceStyle}>{reference}</span><span className={baseItemStyle}>{item}</span></div>; break;
        case 'in_front':    arrangement = (<div className={zStackContainerStyle}><span className={`${stackedItemBaseStyle} ${baseReferenceStyle} opacity-50 scale-125`}>{reference}</span><span className={`${stackedItemBaseStyle} ${baseItemStyle} z-10`}>{item}</span></div>); break;
        case 'behind':      arrangement = (<div className={zStackContainerStyle}><span className={`${stackedItemBaseStyle} ${baseItemStyle} opacity-50 scale-125`}>{item}</span><span className={`${stackedItemBaseStyle} ${baseReferenceStyle} z-10`}>{reference}</span></div>); break;
        case 'right_of_pear': arrangement = <div className="flex items-center"><span className={`${baseReferenceStyle} mr-3 sm:mr-4`}>🍐</span><span className={baseItemStyle}>🍎</span></div>; break;
        case 'left_of_box': arrangement = <div className="flex items-center"><span className={`${baseItemStyle} mr-3 sm:mr-4`}>⚽</span><span className={baseReferenceStyle}>📦</span></div>; break;
        case 'right_of_cloud': arrangement = <div className="flex items-center"><span className={`${baseReferenceStyle} mr-3 sm:mr-4`}>☁️</span><span className={baseItemStyle}>☀️</span></div>; break;
        case 'left_of_star': arrangement = <div className="flex items-center"><span className={`${baseItemStyle} mr-3 sm:mr-4`}>🌙</span><span className={baseReferenceStyle}>⭐</span></div>; break;
        default:            arrangement = <><span className={baseItemStyle}>{item}</span> <span className="text-4xl mx-2 text-slate-400">?</span> <span className={baseReferenceStyle}>{reference}</span></>;
    }
    return <div className="my-3 p-3 min-h-[160px] flex items-center justify-center">{arrangement}</div>;
  };

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const questionParts = questionTemplateString.split('{optionPlaceholder}');
    const questionDisplay = (
        <>
            {questionParts[0].replace('{itemLabel}', currentChallenge.itemLabel).replace('{referenceLabel}', currentChallenge.referenceLabel)}
            <span 
                className={`font-bold px-1 mx-1 py-0.5 rounded-md transition-colors duration-150 ease-in-out
                    ${isVerified && selectedOptionId === currentChallenge.correctAnswerId ? 'text-green-700 bg-green-100 ring-1 ring-green-500' : ''}
                    ${isVerified && selectedOptionId !== currentChallenge.correctAnswerId ? 'text-red-700 bg-red-100 ring-1 ring-red-500 line-through' : ''}
                    ${!isVerified && selectedOptionId ? 'text-blue-700 bg-blue-100 ring-1 ring-blue-500' : 'text-slate-500 border-b-2 border-slate-400'}`}
            >
                {chosenWordForQuestion}
            </span>
            {questionParts[1].replace('{itemLabel}', currentChallenge.itemLabel).replace('{referenceLabel}', currentChallenge.referenceLabel)}
        </>
    );

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-rose-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {questionDisplay}
            </Icons.SpeechBubbleIcon>
        </div>
        <VisualDisplay challenge={currentChallenge} />
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge) return null;
    const currentConceptOptions = (options as {id: string, label:string}[]) || []; 
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentConceptOptions.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) {
            buttonClass = isVerified && opt.id === currentChallenge.correctAnswerId 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' 
                : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          } else if (isVerified) { 
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
          return (<button key={opt.id} onClick={() => handleOptionSelect(opt.id)} disabled={isVerified && selectedOptionId === currentChallenge.correctAnswerId} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{opt.label}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer, options]);
  
  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(<OptionsKeypad />);
      } else {
        setCustomKeypadContent(null);
      }
    }
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
