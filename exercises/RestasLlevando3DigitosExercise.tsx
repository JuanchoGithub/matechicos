import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Added import
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData } from '../types';
import { Icons } from '../components/icons';

interface RestasLlevando3DigitosExerciseProps {
  exercise: ExerciseType;
  currentAvatar: AvatarData;
  onNavigateBack: () => void;
  onGoHome: () => void;
  onAvatarClick: () => void;
  onComplete: (success: boolean) => void;
  onSetCompleted?: (exerciseId: string) => void; 
}

interface CurrentProblem {
  minuend: number;
  subtrahend: number;
  correctAnswerString: string;
  numAnswerDigits: number;
  entryOrderIndices: number[]; 
}

function getVisualPlaceholderOrderForEntry(numDigits: number): number[] {
  if (numDigits <= 0) return [];
  const sequence = [];
  for (let i = 0; i < numDigits; i++) { 
    sequence.push(numDigits - 1 - i); 
  }
  return sequence; 
}

export const RestasLlevando3DigitosExercise: React.FC<RestasLlevando3DigitosExerciseProps> = ({
  exercise,
  currentAvatar,
  onNavigateBack,
  onGoHome,
  onAvatarClick,
  onComplete,
  onSetCompleted, 
}) => {
  const [userInputValues, setUserInputValues] = useState<string[]>([]);
  const [currentEntryStep, setCurrentEntryStep] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem | null>(null);

  const {
    totalStars = 10,
    minOperand = 100,
    maxOperand = 999,
  } = exercise.data || {};

  const generateNewProblem = useCallback(() => {
    let minuend: number, subtrahend: number;
    do {
      minuend = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
      subtrahend = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
    } while (minuend < subtrahend); 

    const difference = minuend - subtrahend;
    const correctAnswerString = difference.toString();
    const numAnswerDigits = correctAnswerString.length || 1; 
    const entryOrderIndices = getVisualPlaceholderOrderForEntry(numAnswerDigits);

    setCurrentProblem({
      minuend,
      subtrahend,
      correctAnswerString,
      numAnswerDigits,
      entryOrderIndices,
    });

    setUserInputValues(Array(numAnswerDigits).fill(''));
    setCurrentEntryStep(0);
    setFeedback(null);
  }, [minOperand, maxOperand]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const verifyAnswer = useCallback(() => {
    if (!currentProblem) return;

    let userAnswerString = "";
    for (let i = 0; i < currentProblem.numAnswerDigits; i++) {
        const visualBoxIndex = currentProblem.numAnswerDigits - 1 - i;
        userAnswerString = (userInputValues[visualBoxIndex] || '') + userAnswerString;
    }
    userAnswerString = userAnswerString || "0";

    if (userAnswerString === currentProblem.correctAnswerString) {
      setStars(prev => Math.min(prev + 1, totalStars));
      setFeedback({ type: 'correct', message: '¡Resta correcta!' });
      onComplete(true);
      if (stars + 1 >= totalStars) {
        if(onSetCompleted) onSetCompleted(exercise.id); 
        setTimeout(() => setFeedback({ type: 'correct', message: '¡Felicidades! Ejercicio completado.' }), 50);
        setTimeout(onNavigateBack, 2500);
      } else {
        setTimeout(generateNewProblem, 2000);
      }
    } else {
      setFeedback({ type: 'incorrect', message: 'Resultado incorrecto. Revisa tu resta y las llevadas.' });
      onComplete(false);
    }
  }, [currentProblem, userInputValues, totalStars, onComplete, generateNewProblem, stars, onNavigateBack, exercise.id, onSetCompleted]);

  const handleKeyPress = (key: string) => {
    if (!currentProblem) return;
    setFeedback(null);

    const { numAnswerDigits, entryOrderIndices } = currentProblem;

    if (key === 'check') {
      verifyAnswer();
      return;
    }
    
    const visualIndexForCurrentStep = entryOrderIndices[currentEntryStep];

    if (key === 'backspace') {
      const newInputValues = [...userInputValues];
      if (newInputValues[visualIndexForCurrentStep] !== '') {
        newInputValues[visualIndexForCurrentStep] = '';
        setUserInputValues(newInputValues);
      } else if (currentEntryStep > 0) {
        const prevEntryStep = currentEntryStep - 1;
        const prevVisualIndexToClear = entryOrderIndices[prevEntryStep];
        newInputValues[prevVisualIndexToClear] = '';
        setUserInputValues(newInputValues);
        setCurrentEntryStep(prevEntryStep);
      }
    } else if (/\d/.test(key) && currentEntryStep < numAnswerDigits) {
      const newInputValues = [...userInputValues];
      newInputValues[visualIndexForCurrentStep] = key;
      setUserInputValues(newInputValues);

      if (currentEntryStep < numAnswerDigits - 1) {
        setCurrentEntryStep(currentEntryStep + 1);
      }
    }
  };

  const MainContent: React.FC = () => {
    if (!currentProblem) {
      return <div className="p-4 text-xl text-slate-600">Cargando problema...</div>;
    }

    const { minuend, subtrahend, numAnswerDigits, entryOrderIndices } = currentProblem;
    const activeVisualInputIndex = currentEntryStep < entryOrderIndices.length ? entryOrderIndices[currentEntryStep] : -1;
    
    const maxLength = Math.max(minuend.toString().length, subtrahend.toString().length, numAnswerDigits, 1);

    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-sm p-3 space-y-3">
        <div className="font-mono text-3xl sm:text-4xl text-slate-700 mt-4">
          <div className="inline-block text-right"> 
            <div className="flex justify-end items-center my-1" style={{ minWidth: `${maxLength + 2}ch` }}>
                <span className="inline-block text-center tabular-nums" style={{width: '1.5ch'}}>
                {'\u00A0'} 
                </span>
                <span className="inline-block tabular-nums" style={{minWidth: `${maxLength}ch`}}>{minuend.toString()}</span>
            </div>
            <div className="flex justify-end items-center my-1" style={{ minWidth: `${maxLength + 2}ch` }}>
                <span className="inline-block text-center tabular-nums" style={{width: '1.5ch'}}>
                 -
                </span>
                <span className="inline-block tabular-nums" style={{minWidth: `${maxLength}ch`}}>{subtrahend.toString()}</span>
            </div>
            <div className="border-t-2 border-slate-600 my-2 ml-auto" style={{ width: `${maxLength + 0.5}ch` }}></div>
          </div>
        </div>

        <div className="flex justify-center w-full mb-3">
           <div className="flex">
            {Array.from({ length: numAnswerDigits }).map((_, visualIndex) => (
                <div
                key={`result-${visualIndex}`}
                className={`w-10 h-14 sm:w-12 sm:h-16 border-2 rounded-md flex items-center justify-center text-2xl sm:text-3xl font-bold mx-0.5 tabular-nums
                            ${activeVisualInputIndex === visualIndex ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white'}
                            ${userInputValues[visualIndex] ? 'text-slate-800' : 'text-slate-400'}`}
                >
                {userInputValues[visualIndex] || ''}
                </div>
            ))}
           </div>
        </div>
        
        <div className="h-12 mt-2 flex items-center justify-center w-full">
          {feedback && (
            <div className={`p-2 rounded-md text-white font-semibold text-sm w-full max-w-md ${feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ExerciseScaffold
      exerciseId={exercise.id}
      exerciseQuestion={exercise.question || `Resuelve la resta con llevadas:`}
      totalStarsForExercise={totalStars} // Corrected prop name
      onNavigateBack={onNavigateBack}
      onGoHome={onGoHome}
      onAvatarClick={onAvatarClick}
      currentAvatar={currentAvatar}
      mainExerciseContentRenderer={(api) => <MainContent />}
      keypadComponent={<NumericKeypad onKeyPress={handleKeyPress} className="w-full" />}
      onFooterBack={onNavigateBack}
      onFooterHome={onGoHome}
      onSetCompleted={onSetCompleted || ((exerciseId) => console.log(`Exercise ${exerciseId} completed via scaffold`))}
    />
  );
};
