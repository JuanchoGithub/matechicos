import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, NumeroEnteroChallenge, ComparisonSymbol } from '../../types';
import { Icons } from '../../components/icons';
import { ComparisonKeypad } from '../../components/ComparisonKeypad';
import { shuffleArray } from '../../utils';

interface NumerosEnterosIntroG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_ENTEROS = ['🤔', '🧐', '💡', '🌡️', '📉', '📈', '🧭'];

// A visual number line component
const NumberLine: React.FC<{ value1: number; value2?: number; range: [number, number] }> = ({ value1, value2, range }) => {
    const [min, max] = range;
    const totalPoints = max - min + 1;
    const points = Array.from({ length: totalPoints }, (_, i) => min + i);

    return (
        <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-lg shadow">
            <div className="relative h-12 flex items-center">
                {/* The line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-400 transform -translate-y-1/2"></div>
                
                {/* Points and labels */}
                {points.map(p => {
                    const isHighlighted = p === value1 || p === value2;
                    const position = ((p - min) / (totalPoints - 1)) * 100;
                    
                    return (
                        <div key={p} className="absolute top-1/2" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
                            <div className={`w-1 h-3 bg-slate-400`}></div>
                            { (p % 5 === 0 || p === 0 || isHighlighted) && (
                                <span className={`absolute -bottom-5 text-xs ${isHighlighted ? 'font-bold text-sky-600' : 'text-slate-500'}`}>{p}</span>
                            )}
                            { isHighlighted && (
                                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-sky-500 rounded-full border-2 border-white shadow"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const NumerosEnterosIntroG5Exercise: React.FC<NumerosEnterosIntroG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<NumeroEnteroChallenge | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<ComparisonSymbol | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_ENTEROS[0]);

  const { totalStars = 10, numberRange = [-15, 15] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    // For now, focusing on 'compare_integers' task
    const task: 'compare_integers' = 'compare_integers';
    
    let num1: number, num2: number;
    do {
        num1 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
        num2 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
    } while (num1 === num2);

    let correctSymbol: ComparisonSymbol = '=';
    if (num1 < num2) correctSymbol = '<';
    if (num1 > num2) correctSymbol = '>';
    
    setCurrentChallenge({
        value1: num1,
        value2: num2,
        task: task,
        correctAnswer: correctSymbol,
        numberLineRange: numberRange
    });

    setSelectedSymbol(null);
    setIsVerified(false);
    showFeedback(null);
    setCharacterEmoji(FACE_EMOJIS_ENTEROS[Math.floor(Math.random() * FACE_EMOJIS_ENTEROS.length)]);
  }, [numberRange, showFeedback]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge, exercise.id]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        generateNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, generateNewChallenge]);
  
  const handleSymbolSelect = useCallback((symbol: ComparisonSymbol) => {
    if (isVerified && selectedSymbol === currentChallenge?.correctAnswer) return;
    setSelectedSymbol(symbol);
    showFeedback(null);
    if (isVerified) setIsVerified(false);
  }, [isVerified, selectedSymbol, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedSymbol || (isVerified && selectedSymbol === currentChallenge.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedSymbol === currentChallenge.correctAnswer;
    onAttempt(isCorrect);
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta correcta era '${currentChallenge.correctAnswer}'.` });
      // Don't auto-reset verification on incorrect, let user see the error
    }
  }, [currentChallenge, selectedSymbol, isVerified, showFeedback, onAttempt]);

  useEffect(() => {
    if (setCustomKeypadContent && currentChallenge) {
      setCustomKeypadContent(
        <ComparisonKeypad 
          onSymbolSelect={handleSymbolSelect} 
          onVerify={verifyAnswer} 
          selectedSymbol={selectedSymbol}
          isVerified={isVerified}
          correctSymbolForFeedback={currentChallenge.correctAnswer as ComparisonSymbol}
        />
      );
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, currentChallenge, selectedSymbol, isVerified, handleSymbolSelect, verifyAnswer]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    const { value1, value2, task, numberLineRange } = currentChallenge;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-3 space-y-4">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 flex items-center justify-center text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-sky-600 text-white text-md p-3 max-w-xs" direction="left">
            {task === 'compare_integers' ? "Compara los siguientes números enteros:" : "Ubica el número en la recta:"}
          </Icons.SpeechBubbleIcon>
        </div>

        {task === 'compare_integers' && (
          <div className="flex items-center justify-around w-full my-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-300 w-28 h-24 sm:w-32 sm:h-28 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-bold text-blue-600">{value1}</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold text-slate-400 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 mx-2">
              {selectedSymbol || '?'}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-300 w-28 h-24 sm:w-32 sm:h-28 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-bold text-green-600">{value2}</span>
            </div>
          </div>
        )}

        {numberLineRange && (
          <div className="w-full mt-4">
            <p className="text-sm text-slate-500 mb-2">Usa la recta numérica como ayuda:</p>
            <NumberLine value1={value1} value2={value2} range={numberLineRange} />
          </div>
        )}
      </div>
    );
  };
  
  return <MainContent />;
};
