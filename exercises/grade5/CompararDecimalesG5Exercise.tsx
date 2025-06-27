
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

   useEffect(() => {
    // Placeholder challenge
    setChallenge({ decimalA: 0.7, decimalB: 0.07, correctSymbol: '>' });
    return () => setCustomKeypadContent(null);
  }, [exercise.id, setCustomKeypadContent]);

  const handleSelect = (symbol: ComparisonSymbol) => { setSelectedSymbol(symbol); setIsVerified(false); scaffoldApi.showFeedback(null);};
  const handleVerify = () => {
    if(!challenge || !selectedSymbol) return;
    setIsVerified(true);
    const correct = selectedSymbol === challenge.correctSymbol;
    scaffoldApi.onAttempt(correct);
    scaffoldApi.showFeedback(correct ? {type: 'correct', message:'Correcto!'} : {type:'incorrect', message: `Incorrecto. La respuesta era ${challenge.correctSymbol}`});
  };

  if (!challenge) return <div>Cargando...</div>;

  useEffect(() => {
    setCustomKeypadContent(
        <ComparisonKeypad 
            onSymbolSelect={handleSelect} 
            onVerify={handleVerify} 
            selectedSymbol={selectedSymbol}
            isVerified={isVerified}
            correctSymbolForFeedback={challenge.correctSymbol}
        />
    );
  }, [challenge, selectedSymbol, isVerified, handleSelect, handleVerify, setCustomKeypadContent]);


  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">Comparar: {challenge.decimalA} vs {challenge.decimalB}</h3>
      <div className="text-4xl my-4">{selectedSymbol || '?'}</div>
    </div>
  );
};
