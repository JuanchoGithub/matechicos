
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Exercise as ExerciseType, RepasoChallenge, GenericVisualOption, GenericVisualChallenge, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';
import { shuffleArray } from '../utils';
import { repasoGeometriaChallengesData } from './repasoGeometriaTestData'; // Import the data
import { ALL_GEO_LABELS_POOL } from '../geometryDefinitions'; // Import the pool


interface RepasoGeometriaMixtoExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

const FACE_EMOJIS_REPASO = ['🤔', '🧐', '💡', '🏆', '✨', '🧠', '🎯'];
const DEFAULT_REPASO_EMOJI = '🏆';

// Keypad Component for Options
const RepasoOptionsKeypad: React.FC<{
  options: GenericVisualOption[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerId: string | null;
}> = ({ options, selectedOptionId, onSelect, onVerify, isVerified, correctAnswerId }) => {
  return (
    <div className="w-full flex flex-col space-y-1.5 p-2">
      {options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
        if (isVerified) {
          if (isSelected) {
            buttonClass = opt.id === correctAnswerId ? 'bg-green-500 text-white ring-2 ring-green-700' : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (opt.id === correctAnswerId) {
            // buttonClass = 'bg-green-200 text-green-700';
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isVerified && selectedOptionId === correctAnswerId}
            className={`w-full p-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
          >
            {opt.label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)}
        className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOptionId || (isVerified && selectedOptionId === correctAnswerId)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
      </button>
    </div>
  );
};

export const RepasoGeometriaMixtoExercise: React.FC<RepasoGeometriaMixtoExerciseProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<GenericVisualChallenge | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<GenericVisualOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_REPASO_EMOJI);
  const [availableChallenges, setAvailableChallenges] = useState<GenericVisualChallenge[]>([]);

  const { challenges: exerciseSpecificChallenges, questionPrompt = "Demuestra lo que aprendiste: ¿Qué es esto?" } = exercise.data || {};

  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    // Transform RepasoChallenge to GenericVisualChallenge
    const transformedRepasoChallenges: GenericVisualChallenge[] = (exerciseSpecificChallenges || repasoGeometriaChallengesData).map((rc: RepasoChallenge) => {
      const correctOption: GenericVisualOption = { id: rc.correctAnswerId as string, label: rc.correctAnswerLabel };
      const distractorPool = ALL_GEO_LABELS_POOL.filter(label => label !== rc.correctAnswerLabel);
      const shuffledDistractorLabels = shuffleArray(distractorPool);
      const numDistractors = Math.min(3, shuffledDistractorLabels.length); 
      const distractorOptions: GenericVisualOption[] = shuffledDistractorLabels.slice(0, numDistractors).map(label => ({
        id: label, 
        label: label
      }));
      const options = shuffleArray([correctOption, ...distractorOptions]);

      return {
        id: rc.id,
        VisualComponent: rc.VisualComponent,
        visualProps: rc.visualProps || { className: "max-w-full max-h-full" },
        correctAnswerId: rc.correctAnswerId as string,
        options: options,
        description: rc.category, 
        emoji: FACE_EMOJIS_REPASO[Math.floor(Math.random() * FACE_EMOJIS_REPASO.length)],
      };
    });
    setAvailableChallenges(shuffleArray(transformedRepasoChallenges));
  }, [exerciseSpecificChallenges, exercise.id]);


  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
     if (challengePool.length === 0 && (exerciseSpecificChallenges || repasoGeometriaChallengesData).length > 0) {
        const transformed = (exerciseSpecificChallenges || repasoGeometriaChallengesData).map((rc: RepasoChallenge) => { /* transform logic as above */ 
            const correctOption: GenericVisualOption = { id: rc.correctAnswerId as string, label: rc.correctAnswerLabel };
            const distractorPool = ALL_GEO_LABELS_POOL.filter(label => label !== rc.correctAnswerLabel);
            const shuffledDistractorLabels = shuffleArray(distractorPool);
            const numDistractors = Math.min(3, shuffledDistractorLabels.length); 
            const distractorOptions: GenericVisualOption[] = shuffledDistractorLabels.slice(0, numDistractors).map(label => ({ id: label, label: label }));
            const options = shuffleArray([correctOption, ...distractorOptions]);
            return { id: rc.id, VisualComponent: rc.VisualComponent, visualProps: rc.visualProps || { className: "max-w-full max-h-full" }, correctAnswerId: rc.correctAnswerId as string, options: options, description: rc.category, emoji: FACE_EMOJIS_REPASO[Math.floor(Math.random() * FACE_EMOJIS_REPASO.length)] };
        });
        challengePool = shuffleArray(transformed);
        setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setShuffledOptions(shuffleArray([...nextChallenge.options])); // Ensure options are shuffled for each new challenge
      setAvailableChallenges(prev => prev.slice(1));
      setCurrentEmoji(nextChallenge.emoji || DEFAULT_REPASO_EMOJI);
    } else {
      onAttempt(true); 
      return;
    }
    setSelectedOptionId(null);
    setIsVerified(false);
    showFeedback(null);
  }, [availableChallenges, exerciseSpecificChallenges, showFeedback, onAttempt]);

  useEffect(() => {
    if (availableChallenges.length > 0 && !currentChallenge) { 
        loadNewChallenge();
    }
  }, [availableChallenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isVerified && selectedOptionId === currentChallenge?.correctAnswerId) return;
    setSelectedOptionId(optionId);
    showFeedback(null);
    if (isVerified && selectedOptionId !== currentChallenge?.correctAnswerId) setIsVerified(false);
  }, [isVerified, selectedOptionId, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOptionId || (isVerified && selectedOptionId === currentChallenge.correctAnswerId)) return;
    setIsVerified(true);
    const isCorrect = selectedOptionId === currentChallenge.correctAnswerId;
    onAttempt(isCorrect);
    const correctLabel = currentChallenge.options.find(opt => opt.id === currentChallenge.correctAnswerId)?.label.toLowerCase() || "la opción correcta";
    if (isCorrect) {
      showFeedback({ type: 'correct', message: `¡Correcto! Es ${correctLabel}.` });
    } else {
      showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta correcta era ${correctLabel}.` });
    }
  }, [currentChallenge, selectedOptionId, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    const { VisualComponent, visualProps, description } = currentChallenge;
    const defaultVisualProps = { className: "max-w-full max-h-full", strokeColor: "rgb(59 130 246)" };
    const finalVisualProps = { ...defaultVisualProps, ...visualProps };
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-purple-600 text-white text-md p-2 max-w-[280px]" direction="left">{questionPrompt}</Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-slate-100 p-4 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent {...finalVisualProps} />
        </div>
        {description && <p className="text-slate-600 text-sm italic">({description})</p>}
      </div>
    );
  };

  const KeypadSidebarContent: React.FC = useMemo(() => () => {
    if (!currentChallenge) return null;
    return (
      <RepasoOptionsKeypad
        options={shuffledOptions}
        selectedOptionId={selectedOptionId}
        onSelect={handleOptionSelect}
        onVerify={verifyAnswer}
        isVerified={isVerified}
        correctAnswerId={currentChallenge.correctAnswerId}
      />
    );
  }, [currentChallenge, shuffledOptions, selectedOptionId, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) setCustomKeypadContent(<KeypadSidebarContent />);
      else setCustomKeypadContent(null);
      return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
    }
  }, [setCustomKeypadContent, KeypadSidebarContent, currentChallenge]);

  return <MainContent />;
};
