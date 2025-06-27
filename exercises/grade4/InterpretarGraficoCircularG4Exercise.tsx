
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, PieChartChallenge, PieChartSlice, PieChartQuestion } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils'; // Added import

interface InterpretarGraficoCircularG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_PIE = ['📊', '🤔', '🧐', '💡', '🍰', '🍕'];


const PieChartSVG: React.FC<{ data: PieChartSlice[], size?: number }> = ({ data, size = 150 }) => {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  if (total === 0) return <div className="text-sm text-slate-500">No hay datos para mostrar el gráfico.</div>;

  let accumulatedAngle = 0;
  const radius = size / 2;
  const center = radius;
  const isPercentage = data.every(slice => slice.value >=0 && slice.value <=100) && Math.abs(total - 100) < 0.01;


  return (
    <svg width={size + 100} height={Math.max(size, data.length * 20 + 10)} viewBox={`0 0 ${size + 100} ${Math.max(size, data.length * 20 + 10)}`}>
      <g transform={`translate(${center}, ${center})`}>
        {data.map((slice, index) => {
          const angle = (slice.value / total) * 360;
          const startAngleRad = (accumulatedAngle - 90) * (Math.PI / 180); // Start from 12 o'clock
          const endAngleRad = (accumulatedAngle + angle - 90) * (Math.PI / 180);

          const x1 = radius * Math.cos(startAngleRad);
          const y1 = radius * Math.sin(startAngleRad);
          const x2 = radius * Math.cos(endAngleRad);
          const y2 = radius * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = `M 0,0 L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
          
          accumulatedAngle += angle;
          return <path key={index} d={pathData} fill={slice.color} />;
        })}
      </g>
      {/* Legend */}
      <g transform={`translate(${size + 10}, 0)`}>
        {data.map((slice, index) => (
          <g key={`legend-${index}`} transform={`translate(0, ${20 + index * 20})`}>
            <rect width="12" height="12" fill={slice.color} />
            <text x="18" y="10" fontSize="10" fill="black">
              {slice.label} ({slice.value}{isPercentage ? '%' : ''})
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export const InterpretarGraficoCircularG4Exercise: React.FC<InterpretarGraficoCircularG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallengeData, setCurrentChallengeData] = useState<PieChartChallenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<PieChartQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_PIE[0]);
  const [availableChallenges, setAvailableChallenges] = useState<PieChartChallenge[]>([]);
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallengeAndQuestion = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges.length > 0) { 
      challengePool = shuffleArray([...challenges]); 
      setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallengeData(nextChallenge);
      setCurrentQuestionIndex(0);
      setCurrentQuestion({...nextChallenge.questions[0], options: shuffleArray(nextChallenge.questions[0].options)});
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_PIE[Math.floor(Math.random() * FACE_EMOJIS_PIE.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallengeData) loadNewChallengeAndQuestion(); }, [challenges, currentChallengeData, loadNewChallengeAndQuestion]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) { // Check if signal has changed
        if (currentChallengeData && currentQuestionIndex < currentChallengeData.questions.length - 1) {
            const nextQIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextQIndex);
            setCurrentQuestion({...currentChallengeData.questions[nextQIndex], options: shuffleArray(currentChallengeData.questions[nextQIndex].options)});
            setSelectedOption(null); setIsVerified(false); showFeedback(null);
        } else {
            loadNewChallengeAndQuestion();
        }
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, currentChallengeData, currentQuestionIndex, loadNewChallengeAndQuestion, showFeedback]);

  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && selectedOption === currentQuestion?.correctAnswer) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentQuestion?.correctAnswer) setIsVerified(false);
  }, [isVerified, selectedOption, currentQuestion, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentQuestion || !selectedOption || (isVerified && selectedOption === currentQuestion.correctAnswer)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${currentQuestion.correctAnswer}.` });
  }, [currentQuestion, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallengeData || !currentQuestion) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-purple-600 text-white text-md p-2 max-w-[280px]" direction="left">
            {currentChallengeData.title}
          </Icons.SpeechBubbleIcon>
        </div>
        <PieChartSVG data={currentChallengeData.data} />
        <p className="text-md font-semibold text-slate-700 mt-2">{currentQuestion.text}</p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentQuestion) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentQuestion.options.map((opt, index) => {
          const isSelected = selectedOption === opt;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) buttonClass = isVerified && opt === currentQuestion.correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          else if (isVerified && opt === currentQuestion.correctAnswer) {} // Optionally highlight correct
          else if (isVerified) buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          return (<button key={index} onClick={() => handleOptionSelect(opt)} disabled={isVerified && selectedOption === currentQuestion.correctAnswer} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{opt}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOption || (isVerified && selectedOption === currentQuestion.correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === currentQuestion.correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentQuestion, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { 
    if (setCustomKeypadContent) { 
      if (currentQuestion) setCustomKeypadContent(<OptionsKeypad />); 
      else setCustomKeypadContent(null); 
    } 
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; 
  }, [setCustomKeypadContent, OptionsKeypad, currentQuestion]);

  return <MainContent />;
};
