import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, OrdenarDecimalesChallenge } from '../../types';

interface OrdenarDecimalesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

export const OrdenarDecimalesG5Exercise: React.FC<OrdenarDecimalesG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [challenge, setChallenge] = useState<OrdenarDecimalesChallenge | null>(null);
  const [poolDecimals, setPoolDecimals] = useState<number[]>([]);
  const [slotDecimals, setSlotDecimals] = useState<(number | null)[]>([]);
  const [heldDecimal, setHeldDecimal] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Generate a random challenge
    const decimals = Array.from({length: 4}, () => parseFloat((Math.random() * 1.5 + 0.01).toFixed(Math.floor(Math.random()*3)+1)));
    setChallenge({ decimals, sortOrder: Math.random() < 0.5 ? 'asc' : 'desc' });
    setPoolDecimals([...decimals]);
    setSlotDecimals(Array(4).fill(null));
    setHeldDecimal(null);
    setIsVerified(false);
    setIsCorrect(null);
    if (setCustomKeypadContent) setCustomKeypadContent(null);
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [exercise.id, setCustomKeypadContent]);

  useEffect(() => {
    if (!challenge) return;
    setCustomKeypadContent(
      <div className="flex flex-col gap-2 w-full">
        <button
          className="w-full p-3 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 disabled:opacity-50"
          onClick={() => {
            if (!challenge) return;
            setIsVerified(true);
            const sorted = [...slotDecimals].sort((a, b) => challenge.sortOrder === 'asc' ? (a! - b!) : (b! - a!));
            const correct = slotDecimals.every((v, i) => v === sorted[i] && v !== null);
            setIsCorrect(correct);
            scaffoldApi.onAttempt(correct);
            scaffoldApi.showFeedback(correct
              ? {type: 'correct', message: '¡Correcto!'}
              : {type: 'incorrect', message: 'El orden no es correcto. Intenta de nuevo.'}
            );
          }}
          disabled={isVerified || slotDecimals.some(s => s === null)}
        >
          Verificar
        </button>
        {isVerified && (
          <div className={`text-center font-semibold mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? '¡Correcto!' : 'Intenta de nuevo.'}</div>
        )}
      </div>
    );
  }, [challenge, slotDecimals, isVerified, isCorrect, setCustomKeypadContent, scaffoldApi]);

  if (!challenge) return <div className="p-4">Cargando desafío de ordenar decimales...</div>;

  const handlePoolClick = (num: number) => {
    if (isVerified) return;
    setHeldDecimal(num === heldDecimal ? null : num);
    scaffoldApi.showFeedback(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isVerified) return;
    scaffoldApi.showFeedback(null);
    const newSlots = [...slotDecimals];
    const newPool = [...poolDecimals];
    if (newSlots[slotIndex] !== null) {
      const numToReturn = newSlots[slotIndex] as number;
      newSlots[slotIndex] = null;
      if (!newPool.includes(numToReturn)) {
        newPool.push(numToReturn);
      }
      setHeldDecimal(null);
    } else if (heldDecimal !== null) {
      if (newPool.includes(heldDecimal)) {
        newSlots[slotIndex] = heldDecimal;
        const poolIndex = newPool.indexOf(heldDecimal);
        if (poolIndex > -1) {
          newPool.splice(poolIndex, 1);
        }
        setHeldDecimal(null);
      }
    }
    setSlotDecimals(newSlots);
    setPoolDecimals(newPool);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
      <p className="text-md mb-1">Ordena los siguientes decimales de {challenge.sortOrder === 'asc' ? 'menor a mayor' : 'mayor a menor'}:</p>
      <div className="flex justify-center items-center space-x-2 p-2 bg-slate-200 rounded-lg min-h-[5rem] w-full max-w-md shadow-inner mb-4">
        {slotDecimals.map((num, index) => (
          <button
            key={`slot-${index}`}
            onClick={() => handleSlotClick(index)}
            className={`w-16 h-16 rounded-md flex items-center justify-center text-xl font-bold transition-all
              ${num !== null ? 'bg-white border-2 border-blue-400 text-blue-600 shadow-md' : 'bg-slate-300 border-2 border-dashed border-slate-400 text-slate-500'}`}
            aria-label={num !== null ? `Decimal ${num} en posición ${index + 1}. Click para devolver.` : `Posición ${index + 1} vacía. Click para colocar decimal.`}
            disabled={isVerified}
          >
            {num !== null ? num : '?'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 p-3 bg-sky-50 rounded-lg min-h-[5rem] w-full max-w-md border border-sky-200">
        {poolDecimals.map((num, index) => (
          <button
            key={`pool-${num}-${index}`}
            onClick={() => handlePoolClick(num)}
            className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-semibold shadow-sm transition-all
              ${heldDecimal === num ? 'bg-yellow-400 text-white ring-2 ring-yellow-600 scale-110' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            aria-label={`Decimal ${num} en el grupo. ${heldDecimal === num ? 'Seleccionado.' : 'Click para seleccionar.'}`}
            disabled={isVerified}
          >
            {num}
          </button>
        ))}
        {poolDecimals.length === 0 && <p className="text-slate-500 italic">¡Todos los decimales colocados!</p>}
      </div>
    </div>
  );
};
