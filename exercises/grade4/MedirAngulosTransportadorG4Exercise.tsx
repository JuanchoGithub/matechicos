
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, MedirAngulosTransportadorG4Challenge } from '../../types';
import { Icons } from '../../components/icons'; // Adjusted path
import { shuffleArray } from '../../utils'; // Assuming utils.ts is in the root or accessible path

interface MedirAngulosTransportadorG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_ANGULOS_MEDIR = ['📐', '🤔', '🧐', '💡', '🎯', '📏'];

const AngleVisual: React.FC<{ angle: number; size?: number; strokeColor?: string; showProtractor?: boolean }> = 
  ({ angle, size = 150, strokeColor = "black", showProtractor = false }) => {
  const S = size;
  const V = S / 2; 
  const L = S * 0.4; 

  const angleRad = angle * (Math.PI / 180);
  const x1 = V + L; // First arm along positive x-axis from vertex
  const y1 = V;
  const x2 = V + L * Math.cos(-angleRad); // Negative angle for clockwise SVG rotation from positive x-axis
  const y2 = V + L * Math.sin(-angleRad); // SVG y is top-down, positive sin goes down

  const arcRadius = L * 0.25;
  const arcX1 = V + arcRadius;
  const arcY1 = V;
  const arcX2 = V + arcRadius * Math.cos(-angleRad);
  const arcY2 = V + arcRadius * Math.sin(-angleRad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const sweepFlag = 1; // Draw arc in positive direction
  const arcPath = `M ${arcX1},${arcY1} A ${arcRadius},${arcRadius} 0 ${largeArcFlag},${sweepFlag} ${arcX2},${arcY2}`;

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S} aria-label={`Ángulo de ${angle} grados`}>
      {showProtractor && (
        <>
          <circle cx={V} cy={V} r={L * 1.1} fill="none" stroke="rgba(200,200,200,0.5)" strokeWidth="1" />
          <circle cx={V} cy={V} r={L * 1.05} fill="none" stroke="rgba(200,200,200,0.5)" strokeWidth="0.5" />
          {/* Simple protractor markings */}
          {Array.from({ length: 12 }).map((_, i) => { // Markings every 30 degrees
            const markAngle = i * 30;
            const markAngleRad = markAngle * (Math.PI / 180);
            const xS = V + (L * 1.0) * Math.cos(-markAngleRad);
            const yS = V + (L * 1.0) * Math.sin(-markAngleRad);
            const xE = V + (L * 1.1) * Math.cos(-markAngleRad);
            const yE = V + (L * 1.1) * Math.sin(-markAngleRad);
            return <line key={`prot-mark-${i}`} x1={xS} y1={yS} x2={xE} y2={yE} stroke="rgba(150,150,150,0.7)" strokeWidth="1" />;
          })}
           <text x={V + L*1.15} y={V+5} fontSize="8" fill="grey" textAnchor="middle">0°</text>
           <text x={V} y={V - L*1.15 -2} fontSize="8" fill="grey" textAnchor="middle">90°</text>
           <text x={V - L*1.15 -5} y={V+5} fontSize="8" fill="grey" textAnchor="middle">180°</text>
        </>
      )}
      <line x1={V} y1={V} x2={x1} y2={y1} stroke={strokeColor} strokeWidth="3" />
      <line x1={V} y1={V} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="3" />
      <circle cx={V} cy={V} r="3" fill={strokeColor} />
      {angle < 360 && angle > 0 && (
        <path d={arcPath} stroke="rgba(100,100,255,0.7)" strokeWidth="2" fill="none" />
      )}
    </svg>
  );
};


// Options Keypad Component
const AngleOptionsKeypad: React.FC<{
  options: number[];
  selectedOption: number | null;
  onSelect: (option: number) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswer: number | null;
}> = ({ options, selectedOption, onSelect, onVerify, isVerified, correctAnswer }) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2">
      {options.map((optValue) => {
        const isSelected = selectedOption === optValue;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (isSelected) buttonClass = optValue === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          else if (optValue === correctAnswer) {} // Optionally highlight correct
          else buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        return (
          <button key={optValue} onClick={() => onSelect(optValue)} disabled={isVerified && selectedOption === correctAnswer}
                  className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>
            {optValue}°
          </button>
        );
      })}
      <button onClick={onVerify} disabled={selectedOption === null || (isVerified && selectedOption === correctAnswer)}
              className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};


export const MedirAngulosTransportadorG4Exercise: React.FC<MedirAngulosTransportadorG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<MedirAngulosTransportadorG4Challenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_ANGULOS_MEDIR[0]);
  const [availableChallenges, setAvailableChallenges] = useState<MedirAngulosTransportadorG4Challenge[]>([]);
  
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
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_ANGULOS_MEDIR[Math.floor(Math.random() * FACE_EMOJIS_ANGULOS_MEDIR.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: number) => {
    if (isVerified && selectedOption === currentChallenge?.angleDegrees) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.angleDegrees) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && selectedOption === currentChallenge.angleDegrees)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.angleDegrees;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. El ángulo mide ${currentChallenge.angleDegrees}°.` });
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-orange-500 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallenge.questionText || `¿Cuántos grados mide este ángulo?`}
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-slate-50 p-2 rounded-lg border border-slate-200 shadow">
          {currentChallenge.imageUrl ? 
            <img src={currentChallenge.imageUrl} alt="Ángulo con transportador" className="max-w-full max-h-full object-contain"/> :
            <AngleVisual angle={currentChallenge.angleDegrees} size={180} showProtractor={true}/>
          }
        </div>
      </div>
    );
  };
  
  const KeypadContent: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
        <AngleOptionsKeypad
            options={currentChallenge.options}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
            onVerify={verifyAnswer}
            isVerified={isVerified}
            correctAnswer={currentChallenge.angleDegrees}
        />
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);


  useEffect(() => { 
    if (setCustomKeypadContent) { 
        if (currentChallenge) {
            setCustomKeypadContent(<KeypadContent />);
        } else {
            setCustomKeypadContent(null);
        }
    }
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [setCustomKeypadContent, KeypadContent, currentChallenge]);

  return <MainContent />;
};
