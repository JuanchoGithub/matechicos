
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PolygonSortingChallengeG5 } from '../../types';
import { Icons, CharacterQuestionIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface PolygonSortingChallengeProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
}

const FACE_EMOJIS_SORTING = ['🤔', '🧐', '💡', '✨', '🔲', '🔷', '💠'];

const DropBin: React.FC<{
  label: string;
  binType: 'A' | 'B';
  onDrop: (binType: 'A' | 'B') => void;
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}> = ({ label, binType, onDrop, isOver, onDragOver, onDragLeave }) => (
  <div
    onDrop={() => onDrop(binType)}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    className={`drop-zone w-full sm:w-2/5 h-48 sm:h-56 p-4 border-4 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200
      ${isOver ? 'border-green-400 bg-green-100' : 'border-slate-400 bg-slate-100'}
    `}
    aria-label={`Caja para soltar polígonos: ${label}`}
  >
    <p className="text-xl font-bold text-slate-700">{label}</p>
    <p className="text-sm text-slate-500 mt-2">Arrastra la figura aquí</p>
  </div>
);

export const PolygonSortingChallengeG5Exercise: React.FC<PolygonSortingChallengeProps> = ({
  exercise, scaffoldApi
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<PolygonSortingChallengeG5 | null>(null);
  const [challengeType, setChallengeType] = useState<'regularity' | 'concavity'>('regularity');
  const [availableChallenges, setAvailableChallenges] = useState<PolygonSortingChallengeG5[]>([]);
  const [isOverBinA, setIsOverBinA] = useState(false);
  const [isOverBinB, setIsOverBinB] = useState(false);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);
  const draggedPolygonIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges]));
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as PolygonSortingChallengeG5[]).length > 0) {
      pool = shuffleArray([...challenges as PolygonSortingChallengeG5[]]);
      setAvailableChallenges(pool);
    }

    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setChallengeType(Math.random() < 0.5 ? 'regularity' : 'concavity');
    } else {
      onAttempt(true); // End of challenges
      return;
    }
    setIsOverBinA(false);
    setIsOverBinB(false);
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => {
    if ((challenges as PolygonSortingChallengeG5[]).length > 0 && !currentChallenge) loadNewChallenge();
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge();
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleDragStart = (e: React.DragEvent, polygonId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('polygonId', polygonId);
    draggedPolygonIdRef.current = polygonId;
  };

  const handleDrop = (binType: 'A' | 'B') => {
    if (!currentChallenge || draggedPolygonIdRef.current !== currentChallenge.id) return;
    setIsOverBinA(false);
    setIsOverBinB(false);
    
    let isCorrectDrop = false;
    if (challengeType === 'regularity') {
      isCorrectDrop = (currentChallenge.isRegular && binType === 'A') || (!currentChallenge.isRegular && binType === 'B');
    } else { // concavity
      isCorrectDrop = (currentChallenge.isConvex && binType === 'A') || (!currentChallenge.isConvex && binType === 'B');
    }
    
    onAttempt(isCorrectDrop);
    if(isCorrectDrop) {
      showFeedback({type: 'correct', message: '¡Clasificación Correcta!'});
    } else {
      showFeedback({type: 'incorrect', message: 'Esa no es la caja correcta. ¡Intenta de nuevo!'});
    }
  };

  const handleDragOver = (e: React.DragEvent, binType: 'A' | 'B') => {
    e.preventDefault();
    if (binType === 'A') setIsOverBinA(true);
    else setIsOverBinB(true);
  };

  const handleDragLeave = (e: React.DragEvent, binType: 'A' | 'B') => {
    e.preventDefault();
    if (binType === 'A') setIsOverBinA(false);
    else setIsOverBinB(false);
  };

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío de clasificación...</div>;

  const { VisualComponent, visualProps = {} } = currentChallenge;
  const bins = challengeType === 'regularity' 
    ? { A: 'Polígonos Regulares', B: 'Polígonos Irregulares' }
    : { A: 'Polígonos Convexos', B: 'Polígonos Cóncavos' };

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-3xl p-3 space-y-4">
      <h3 className="text-xl font-bold text-sky-700">Misterio Geométrico</h3>
      <p className="text-sm text-slate-600">{exercise.question || 'Arrastra el polígono a la caja correcta.'}</p>

      <div 
        className="draggable-polygon my-4 p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white shadow-lg flex items-center justify-center h-40 w-40"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, currentChallenge.id)}
      >
        <VisualComponent {...visualProps} className="max-w-full max-h-full" />
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-4 mt-4">
        <DropBin label={bins.A} binType="A" onDrop={handleDrop} isOver={isOverBinA} onDragOver={(e) => handleDragOver(e, 'A')} onDragLeave={(e) => handleDragLeave(e, 'A')} />
        <DropBin label={bins.B} binType="B" onDrop={handleDrop} isOver={isOverBinB} onDragOver={(e) => handleDragOver(e, 'B')} onDragLeave={(e) => handleDragLeave(e, 'B')} />
      </div>
    </div>
  );
};
