
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../../components/NumericKeypad';
import { Exercise as ExerciseType, ExerciseScaffoldApi, ModeRangeChallenge } from '../../types';
import { Icons } from '../../components/icons';

interface IdentificarModaRangoG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
}

const FACE_EMOJIS_MODA_RANGO = ['📊', '🤔', '🧐', '💡', '🎯', '📉📈'];

const generateRandomSetAndModeRange = (minSetSize: number, maxSetSize: number, minValue: number, maxValue: number): ModeRangeChallenge => {
  const setSize = Math.floor(Math.random() * (maxSetSize - minSetSize + 1)) + minSetSize;
  const numbers: number[] = [];
  for (let i = 0; i < setSize; i++) {
    numbers.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
  }
  numbers.sort((a, b) => a - b); // Sort for easier range calculation and mode finding

  // Calculate Mode
  const frequency: { [key: number]: number } = {};
  let maxFreq = 0;
  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) maxFreq = frequency[num];
  });
  let modes: number[] = [];
  if (maxFreq > 1) { // Mode exists only if a number repeats
    for (const numStr in frequency) {
      if (frequency[numStr] === maxFreq) modes.push(parseInt(numStr, 10));
    }
  }
  const correctMode = modes.length > 0 ? (modes.length === 1 ? modes[0] : modes.sort((a,b) => a-b)) : null;

  // Calculate Range
  const correctRange = numbers[numbers.length - 1] - numbers[0];

  return { numbers, correctMode, correctRange };
};

type ActiveTargetG4 = 'mode' | 'range';

export const IdentificarModaRangoG4Exercise: React.FC<IdentificarModaRangoG4ExerciseProps> = ({
  exercise, scaffoldApi, registerKeypadHandler,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<ModeRangeChallenge | null>(null);
  const [userInputMode, setUserInputMode] = useState<string>('');
  const [userInputRange, setUserInputRange] = useState<string>('');
  const [activeTarget, setActiveTarget] = useState<ActiveTargetG4>('mode');
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_MODA_RANGO[0]);
  const [isAttemptPending, setIsAttemptPending] = useState(false);

  const { minSetSize = 5, maxSetSize = 10, minValue = 1, maxValue = 20 } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateNewChallenge = useCallback(() => {
    setCurrentChallenge(generateRandomSetAndModeRange(minSetSize, maxSetSize, minValue, maxValue));
    setUserInputMode(''); setUserInputRange(''); setActiveTarget('mode');
    showFeedback(null); setIsAttemptPending(false);
    setCharacterEmoji(FACE_EMOJIS_MODA_RANGO[Math.floor(Math.random() * FACE_EMOJIS_MODA_RANGO.length)]);
  }, [minSetSize, maxSetSize, minValue, maxValue, showFeedback]);

  useEffect(() => { generateNewChallenge(); }, [generateNewChallenge, exercise.id]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) generateNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, generateNewChallenge]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || isAttemptPending) return;
    setIsAttemptPending(true);
    
    const userModeNum = userInputMode === '' ? null : userInputMode.split(',').map(s => parseInt(s.trim(),10)).filter(n => !isNaN(n)).sort((a,b)=>a-b);
    const userRangeNum = parseInt(userInputRange, 10);

    let modeIsCorrect = false;
    if (userModeNum === null && currentChallenge.correctMode === null) {
      modeIsCorrect = true;
    } else if (Array.isArray(userModeNum) && Array.isArray(currentChallenge.correctMode)) {
      modeIsCorrect = userModeNum.length === currentChallenge.correctMode.length && userModeNum.every((val, idx) => val === (currentChallenge.correctMode as number[])[idx]);
    } else if (typeof userModeNum === 'number' && typeof currentChallenge.correctMode === 'number') {
      modeIsCorrect = userModeNum === currentChallenge.correctMode;
    } else if (userModeNum === null && Array.isArray(currentChallenge.correctMode) && currentChallenge.correctMode.length === 0) { // Case where user inputs nothing and there is no mode
      modeIsCorrect = true;
    } else if (Array.isArray(userModeNum) && userModeNum.length === 1 && typeof currentChallenge.correctMode === 'number' ) {
      modeIsCorrect = userModeNum[0] === currentChallenge.correctMode;
    }


    const rangeIsCorrect = !isNaN(userRangeNum) && userRangeNum === currentChallenge.correctRange;
    const isCorrect = modeIsCorrect && rangeIsCorrect;
    onAttempt(isCorrect);

    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto! Moda y rango identificados.' });
    else { 
      let errorMsg = "Incorrecto. ";
      if(!modeIsCorrect) errorMsg += `La moda era ${currentChallenge.correctMode === null ? "ninguna" : (Array.isArray(currentChallenge.correctMode) ? currentChallenge.correctMode.join(', ') : currentChallenge.correctMode)}. `;
      if(!rangeIsCorrect) errorMsg += `El rango era ${currentChallenge.correctRange}.`;
      showFeedback({ type: 'incorrect', message: errorMsg.trim() }); 
      setIsAttemptPending(false); 
    }
  }, [currentChallenge, userInputMode, userInputRange, showFeedback, onAttempt, isAttemptPending]);

  const handleKeyPress = useCallback((key: string) => {
    if (isAttemptPending) return;
    showFeedback(null);
    const targetInputSetter = activeTarget === 'mode' ? setUserInputMode : setUserInputRange;
    const currentVal = activeTarget === 'mode' ? userInputMode : userInputRange;

    if (key === 'check') { verifyAnswer(); return; }
    if (key === 'backspace') { targetInputSetter(prev => prev.slice(0,-1)); }
    else if (key === ',' && activeTarget === 'mode' && !currentVal.includes(',')) { targetInputSetter(prev => prev + key); } // Allow one comma for multi-mode
    else if (currentVal.length < (activeTarget === 'mode' ? 7 : 3) && /\d/.test(key)) { // Mode can be e.g. "1,10,12", range usually smaller
        targetInputSetter(prev => prev + key);
    }
  }, [activeTarget, userInputMode, userInputRange, verifyAnswer, showFeedback, isAttemptPending]);
  
  useEffect(() => { registerKeypadHandler(handleKeyPress); return () => registerKeypadHandler(null); }, [registerKeypadHandler, handleKeyPress]);

  const InputField: React.FC<{label: string, value: string, isActive: boolean, onClick: () => void, placeholder: string}> = 
    ({label, value, isActive, onClick, placeholder}) => (
    <div className="flex flex-col items-center w-full">
      <label className="text-sm text-slate-600 mb-1">{label}:</label>
      <button onClick={onClick}
        className={`w-3/4 max-w-[150px] h-12 sm:h-14 text-center text-xl sm:text-2xl font-mono border-2 rounded-md transition-all
                    ${isActive ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
      >
        {value || <span className="text-slate-400">{placeholder}</span>}
      </button>
    </div>
  );

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-purple-600 text-white text-md p-2 max-w-[280px]" direction="left">
            Encuentra la Moda y el Rango:
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-lg sm:text-xl font-semibold text-slate-700 p-2 bg-slate-100 rounded-md shadow flex flex-wrap justify-center gap-2">
          {currentChallenge.numbers.map((n,i) => <span key={i} className="px-1">{n}</span>)}
        </p>
        <div className="flex flex-col sm:flex-row justify-around w-full items-start gap-3 mt-2">
          <InputField label="Moda" value={userInputMode} isActive={activeTarget === 'mode'} onClick={() => setActiveTarget('mode')} placeholder="ej: 5 ó 2,7"/>
          <InputField label="Rango" value={userInputRange} isActive={activeTarget === 'range'} onClick={() => setActiveTarget('range')} placeholder="ej: 12"/>
        </div>
        <p className="text-xs text-slate-500 mt-1">Si no hay moda, deja el campo vacío. Si hay varias modas, sepáralas con coma (ej: 3,5).</p>
      </div>
    );
  };
  return <MainContent />;
};
