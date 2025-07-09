import React, { useState, useEffect, useCallback } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, CompararDecimalesChallenge, ComparisonSymbol } from '../../types';
import { Icons } from '../../components/icons';
import { ComparisonKeypad } from '../../components/ComparisonKeypad';


interface CompararDecimalesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

export const CompararDecimalesG5Exercise: React.FC<CompararDecimalesG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [challenge, setChallenge] = useState<CompararDecimalesChallenge | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<ComparisonSymbol | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const prevAdvanceSignal = React.useRef<number>(scaffoldApi.advanceToNextChallengeSignal);

  // Generate a new random challenge
  const generateChallenge = useCallback(() => {
    // Generate two random decimals with 1-3 decimal places
    const places = () => Math.floor(Math.random() * 3) + 1;
    const rnd = (p: number) => parseFloat((Math.random() * 9 + 0.1).toFixed(p));
    let a = rnd(places());
    let b = rnd(places());
    // Avoid equal numbers unless forced
    if (Math.random() < 0.15) b = a;
    else while (a === b) b = rnd(places());
    let correct: ComparisonSymbol = a < b ? '<' : (a > b ? '>' : '=');
    setChallenge({ decimalA: a, decimalB: b, correctSymbol: correct });
    setSelectedSymbol(null);
    setIsVerified(false);
    setCustomKeypadContent(null);
    scaffoldApi.showFeedback(null);
  }, [setCustomKeypadContent, scaffoldApi]);

  // On mount and when exercise.id changes, generate a challenge
  useEffect(() => { generateChallenge(); }, [exercise.id, generateChallenge]);

  // Listen for advance signal
  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > (prevAdvanceSignal.current ?? -1)) {
      generateChallenge();
    }
    prevAdvanceSignal.current = scaffoldApi.advanceToNextChallengeSignal;
  }, [scaffoldApi.advanceToNextChallengeSignal, generateChallenge]);

  const handleSelect = (symbol: ComparisonSymbol) => {
    setSelectedSymbol(symbol);
    setIsVerified(false);
    scaffoldApi.showFeedback(null);
  };
  const handleVerify = () => {
    if (!challenge || !selectedSymbol) return;
    setIsVerified(true);
    const correct = selectedSymbol === challenge.correctSymbol;
    scaffoldApi.onAttempt(correct);
    scaffoldApi.showFeedback(correct ? {type: 'correct', message:'¡Correcto!'} : {type:'incorrect', message: `Incorrecto. La respuesta era ${challenge.correctSymbol}`});
  };

  useEffect(() => {
    setCustomKeypadContent(
      <ComparisonKeypad 
        onSymbolSelect={handleSelect}
        onVerify={handleVerify}
        selectedSymbol={selectedSymbol}
        isVerified={isVerified}
        correctSymbolForFeedback={challenge?.correctSymbol ?? null}
      />
    );
    return () => setCustomKeypadContent(null);
  }, [challenge, selectedSymbol, isVerified, setCustomKeypadContent]);

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">Comparar: {challenge ? `${challenge.decimalA} vs ${challenge.decimalB}` : '...'}</h3>
      <div className="text-4xl my-4">{selectedSymbol || '?'}</div>
    </div>
  );
};
