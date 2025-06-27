
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MixedNumberChallenge } from '../../types';
import { Icons } from '../../components/icons'; // Adjusted path
import { shuffleArray } from '../../utils'; // Adjusted path

interface NumerosMixtosAvanzadoG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_MIXED_G5 = ['🤔', '🧐', '💡', '🔄', '🍰', '🍕', '🧮'];

interface ParsedFraction {
  whole?: number;
  numerator?: number;
  denominator?: number;
  isFraction: boolean;
  originalString: string;
}

const parseFractionString = (str: string): ParsedFraction => {
  const result: ParsedFraction = { isFraction: false, originalString: str };
  const trimmedStr = str.trim();
  const spaceIndex = trimmedStr.indexOf(' ');

  if (spaceIndex > -1) { 
    const wholePart = trimmedStr.substring(0, spaceIndex);
    const fractionPart = trimmedStr.substring(spaceIndex + 1);
    result.whole = parseInt(wholePart, 10);
    if (isNaN(result.whole)) result.whole = undefined;

    const slashIndex = fractionPart.indexOf('/');
    if (slashIndex > -1) {
      result.numerator = parseInt(fractionPart.substring(0, slashIndex), 10);
      result.denominator = parseInt(fractionPart.substring(slashIndex + 1), 10);
      if (!isNaN(result.numerator) && !isNaN(result.denominator) && result.denominator !== 0) {
        result.isFraction = true;
      } else {
        result.numerator = undefined; result.denominator = undefined;
      }
    }
  } else { 
    const slashIndex = trimmedStr.indexOf('/');
    if (slashIndex > -1) {
      result.numerator = parseInt(trimmedStr.substring(0, slashIndex), 10);
      result.denominator = parseInt(trimmedStr.substring(slashIndex + 1), 10);
      if (!isNaN(result.numerator) && !isNaN(result.denominator) && result.denominator !== 0) {
        result.isFraction = true;
      } else {
        result.numerator = undefined; result.denominator = undefined;
      }
    }
  }
  return result;
};

const FractionPartDisplay: React.FC<{ numerator: number; denominator: number; size?: 'sm' | 'lg', className?: string }> = 
  ({ numerator, denominator, size = 'lg', className = "" }) => {
  const numDenFontSize = size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-lg sm:text-xl';
  const hrWidth = size === 'lg' ? 'w-12 sm:w-16' : 'w-8 sm:w-10';
  const hrMargin = size === 'lg' ? 'my-1 sm:my-1.5' : 'my-0.5';
  return (
    <div className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className={`${numDenFontSize} font-bold`}>{numerator}</span>
      <hr className={`${hrWidth} border-t-2 border-current ${hrMargin}`} />
      <span className={`${numDenFontSize} font-bold`}>{denominator}</span>
    </div>
  );
};

// Keypad Component for Options
const OptionsKeypad: React.FC<{
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: string | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((optStr, index) => {
        const parsedOpt = parseFractionString(optStr);
        const isSelected = selectedOption === optStr;
        let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
        if (isSelected) {
          buttonClass = isVerified && optStr === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
        } else if (isVerified && optStr === correctAnswer) {
          buttonClass = 'bg-green-200 text-green-700 ring-1 ring-green-300';
        } else if (isVerified) {
          buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        }
        
        return (
          <button 
            key={index} 
            onClick={() => onSelect(optStr)} 
            disabled={isVerified && selectedOption === correctAnswer} 
            className={`w-full p-3 rounded-lg text-center transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass} flex items-center justify-center space-x-1 min-h-[3.5rem]`}
            aria-label={`Opción: ${optStr}`}
          >
            {parsedOpt.whole !== undefined && <span className="text-xl font-bold">{parsedOpt.whole}</span>}
            {parsedOpt.isFraction && typeof parsedOpt.numerator === 'number' && typeof parsedOpt.denominator === 'number' && (
              <FractionPartDisplay 
                numerator={parsedOpt.numerator} 
                denominator={parsedOpt.denominator} 
                size="sm" 
                className="ml-1"
              />
            )}
             {!parsedOpt.isFraction && parsedOpt.whole === undefined && (
               <span className="text-xl font-bold">{parsedOpt.originalString}</span>
             )}
          </button>
        );
      })}
      <button onClick={onVerify} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
    </div>
  );
};


export const NumerosMixtosAvanzadoG5Exercise: React.FC<NumerosMixtosAvanzadoG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MixedNumberChallenge | null>(null);
  const [parsedQuestion, setParsedQuestion] = useState<ParsedFraction | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_MIXED_G5[0]);
  const [availableChallenges, setAvailableChallenges] = useState<MixedNumberChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = {...pool[0]};
      next.options = shuffleArray([...next.options]);
      setCurrentChallenge(next);
      setParsedQuestion(parseFractionString(next.question));
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_MIXED_G5[Math.floor(Math.random() * FACE_EMOJIS_MIXED_G5.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentChallenge?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentChallenge.correctAnswer}.` });
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge || !parsedQuestion) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const questionPrompt = currentChallenge.type === 'mixed_to_improper' 
      ? `Convierte a fracción impropia:`
      : `Convierte a número mixto:`;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-purple-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {questionPrompt}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="flex items-center justify-center text-slate-700 my-3 min-h-[6rem]">
          {parsedQuestion.whole !== undefined && <span className="text-5xl font-bold mr-2">{parsedQuestion.whole}</span>}
          {parsedQuestion.isFraction && typeof parsedQuestion.numerator === 'number' && typeof parsedQuestion.denominator === 'number' && (
            <FractionPartDisplay 
              numerator={parsedQuestion.numerator} 
              denominator={parsedQuestion.denominator} 
              size="lg" 
            />
          )}
          {!parsedQuestion.isFraction && parsedQuestion.whole === undefined && (
             <span className="text-5xl font-bold">{parsedQuestion.originalString}</span>
          )}
        </div>
      </div>
    );
  };

  const KeypadForSidebar: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <OptionsKeypad
        options={currentChallenge.options}
        selectedOption={selectedOption}
        onSelect={handleOptionSelect}
        onVerify={verifyAnswer}
        isVerified={isVerified}
        correctAnswer={currentChallenge.correctAnswer}
      />
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

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
