
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, Shape3DCounterChallengeG5 } from '../../types';
import { Icons, CharacterQuestionIcon, BackArrowIcon } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface Shape3DCounterProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_COUNTER = ['🤔', '🧐', '💡', '🧊', '✨', '🚀'];

export const Shape3DCounterG5Exercise: React.FC<Shape3DCounterProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Shape3DCounterChallengeG5 | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<Shape3DCounterChallengeG5[]>([]);
  const [characterEmoji, setCharacterEmoji] = useState(FACE_EMOJIS_COUNTER[0]);
  
  const [highlightedFaces, setHighlightedFaces] = useState<Set<number>>(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState<Set<number>>(new Set());
  const [highlightedVertices, setHighlightedVertices] = useState<Set<number>>(new Set());

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as Shape3DCounterChallengeG5[]).length > 0) {
      pool = shuffleArray([...challenges as Shape3DCounterChallengeG5[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_COUNTER[Math.floor(Math.random() * FACE_EMOJIS_COUNTER.length)]);
    } else {
      onAttempt(true); // End of challenges
      return;
    }
    // Reset counters
    setHighlightedFaces(new Set());
    setHighlightedEdges(new Set());
    setHighlightedVertices(new Set());
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleElementClick = (type: 'face' | 'edge' | 'vertex', id: number) => {
    showFeedback(null);
    switch (type) {
      case 'face':
        setHighlightedFaces(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
        break;
      case 'edge':
        setHighlightedEdges(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
        break;
      case 'vertex':
        setHighlightedVertices(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
        break;
    }
  };

  const handleResetCounts = () => {
    showFeedback(null);
    setHighlightedFaces(new Set());
    setHighlightedEdges(new Set());
    setHighlightedVertices(new Set());
  };

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge) return;
    const { faces, edges, vertices } = currentChallenge.correctCounts;
    const isFacesCorrect = highlightedFaces.size === faces;
    const isEdgesCorrect = highlightedEdges.size === edges;
    const isVerticesCorrect = highlightedVertices.size === vertices;
    const isCorrect = isFacesCorrect && isEdgesCorrect && isVerticesCorrect;
    
    onAttempt(isCorrect);
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Perfecto! Un ${currentChallenge.shapeName.toLowerCase()} tiene ${faces} caras, ${edges} aristas y ${vertices} vértices.` });
    } else {
      let feedbackMsg = "Casi... ";
      if (!isFacesCorrect) feedbackMsg += `Revisa el número de caras (deberían ser ${faces}). `;
      if (!isEdgesCorrect) feedbackMsg += `Revisa el número de aristas (deberían ser ${edges}). `;
      if (!isVerticesCorrect) feedbackMsg += `Revisa el número de vértices (deberían ser ${vertices}). `;
      showFeedback({ type: 'incorrect', message: feedbackMsg.trim() });
    }
  }, [currentChallenge, highlightedFaces, highlightedEdges, highlightedVertices, onAttempt, showFeedback]);

  const CounterDisplay: React.FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div className={`flex flex-col items-center p-2 rounded-lg bg-opacity-80 shadow-sm ${color}`}>
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-2xl font-bold text-white">{count}</span>
    </div>
  );

  const KeypadContent: React.FC = React.useMemo(() => () => (
    <div className="w-full flex flex-col space-y-3 p-2">
        <p className="text-xs text-center text-white/80">Haz clic en la figura para contar. Cuando termines, verifica tu respuesta.</p>
        <button onClick={verifyAnswer} className="w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600">
            <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
        <button onClick={handleResetCounts} className="w-full p-2 rounded-lg flex items-center justify-center font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 shadow-sm">
            <BackArrowIcon className="w-4 h-4 mr-1 transform rotate-90" /> Reiniciar Conteo
        </button>
    </div>
  ), [verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) {
        setCustomKeypadContent(<KeypadContent />);
        return () => setCustomKeypadContent(null);
    }
  }, [setCustomKeypadContent, KeypadContent]);

  if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando arquitecto espacial...</div>;

  const { VisualComponent, shapeName } = currentChallenge;

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-3xl p-2 space-y-2">
      <div className="relative flex items-center justify-center mb-1">
        <div className="w-20 h-20 flex items-center justify-center text-6xl">{characterEmoji}</div>
        <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md p-2 max-w-[280px]" direction="left">
            ¡Arquitecto! ¿Cuántas partes tiene este <strong className="block text-lg">{shapeName.toLowerCase()}</strong>?
        </Icons.SpeechBubbleIcon>
      </div>

      <div className="w-full h-56 sm:h-64 flex items-center justify-center p-2">
        <VisualComponent 
            className="max-w-full max-h-full"
            onFaceClick={(id: number) => handleElementClick('face', id)}
            onEdgeClick={(id: number) => handleElementClick('edge', id)}
            onVertexClick={(id: number) => handleElementClick('vertex', id)}
            highlightedFaces={highlightedFaces}
            highlightedEdges={highlightedEdges}
            highlightedVertices={highlightedVertices}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-sm p-2 bg-slate-700/50 rounded-xl">
        <CounterDisplay label="Caras" count={highlightedFaces.size} color="bg-red-500"/>
        <CounterDisplay label="Aristas" count={highlightedEdges.size} color="bg-yellow-500"/>
        <CounterDisplay label="Vértices" count={highlightedVertices.size} color="bg-green-500"/>
      </div>
    </div>
  );
};
