import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, LinePlotScenarioTemplate, LinePlotQuestion, LinePlotDataPoint } from '../types';
import { InteractiveLinePlotG5 } from '../components/InteractiveLinePlotG5';

interface LinePlotCreatorExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
}

interface ActiveLinePlotScenario {
  scenarioId: string;
  title: string;
  description: string;
  dataPoints: LinePlotDataPoint[];
  question: LinePlotQuestion;
  unit: string;
  range: [number, number];
  step: number;
  icon?: string;
}

const DEFAULT_PLOT_EMOJI = '📊';
const SCIENCE_EMOJIS = ['🔬', '📊', '📐', '📏', '⚖️', '🧪', '🔭', '🧠'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const LinePlotCreatorExercise: React.FC<LinePlotCreatorExerciseProps> = ({
  exercise,
  scaffoldApi
}) => {
  const [currentScenario, setCurrentScenario] = useState<ActiveLinePlotScenario | null>(null);
  const [availableScenarios, setAvailableScenarios] = useState<LinePlotScenarioTemplate[]>([]);
  const [userPlotData, setUserPlotData] = useState<Map<number, number>>(new Map());
  const [isAttemptPending, setIsAttemptPending] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_PLOT_EMOJI);
  
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  // Initialize available scenarios from exercise data
  useEffect(() => {
    const scenarios = exercise.data as LinePlotScenarioTemplate[] || [];
    if (scenarios.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarios]));
    }
  }, [exercise.data]);

  // Load a new scenario
  const loadNewScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as LinePlotScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as LinePlotScenarioTemplate[])]);
    }
    if (scenarioPool.length === 0) {
      showFeedback({type: 'congrats', message: '¡Has completado todos los ejercicios de gráficas de puntos!'});
      onAttempt(true);
      return;
    }
    
    const nextScenario = scenarioPool[0];
    setCurrentScenario({
      scenarioId: nextScenario.scenarioId,
      title: nextScenario.title,
      description: nextScenario.description,
      dataPoints: nextScenario.dataPoints,
      question: nextScenario.question,
      unit: nextScenario.unit,
      range: nextScenario.range,
      step: nextScenario.step,
      icon: nextScenario.icon
    });
    
    setCurrentEmoji(nextScenario.icon || SCIENCE_EMOJIS[Math.floor(Math.random() * SCIENCE_EMOJIS.length)]);
    setUserPlotData(new Map());
    setSelectedAnswer(null);
    setShowOptions(false);
    showFeedback(null);
    setIsAttemptPending(false);
    setAvailableScenarios(prev => prev.slice(1));

  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  // Initialize with the first scenario
  useEffect(() => {
    if ((exercise.data as LinePlotScenarioTemplate[])?.length > 0 && !currentScenario) { 
      loadNewScenario();
    }
  }, [exercise.data, currentScenario, loadNewScenario]);

  // Handle advancing to next challenge
  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) {
      loadNewScenario();
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewScenario]);

  // Update plot data
  const handlePlotChange = useCallback((newPlotData: Map<number, number>) => {
    setUserPlotData(newPlotData);
  }, []);

  // Verify if the plot is correct
  const verifyPlot = useCallback(() => {
    if (!currentScenario || isAttemptPending) return;
    setIsAttemptPending(true);
    
    const expectedData = new Map<number, number>();
    currentScenario.dataPoints.forEach(point => {
      const value = point.value;
      expectedData.set(value, (expectedData.get(value) || 0) + 1);
    });
    
    const isCorrect = Array.from(expectedData.entries()).every(([value, count]) => {
      return userPlotData.get(value) === count;
    }) && 
    Array.from(userPlotData.entries()).every(([value, count]) => {
      return expectedData.get(value) === count;
    });
    
    if (isCorrect) {
      showFeedback({ type: 'correct', message: '¡Excelente! Has creado el gráfico de puntos correctamente.' });
      setShowOptions(true);
    } else {
      const missingPoints = Array.from(expectedData.entries())
        .filter(([value, count]) => userPlotData.get(value) !== count)
        .map(([value, count]) => `${value}${currentScenario.unit} (${count})`);
      
      const extraPoints = Array.from(userPlotData.entries())
        .filter(([value, count]) => expectedData.get(value) !== count)
        .map(([value, count]) => `${value}${currentScenario.unit} (${count})`);
      
      let message = '¡Casi! Revisa bien los datos.';
      if (missingPoints.length > 0) {
        message += ` Faltan puntos en: ${missingPoints.join(', ')}.`;
      }
      if (extraPoints.length > 0) {
        message += ` Hay puntos de más en: ${extraPoints.join(', ')}.`;
      }
      
      showFeedback({ type: 'incorrect', message });
      setIsAttemptPending(false);
    }
  }, [currentScenario, isAttemptPending, userPlotData, showFeedback]);

  // Verify answer to the question
  const verifyAnswer = useCallback((answer: string) => {
    if (!currentScenario || isAttemptPending) return;
    setIsAttemptPending(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === currentScenario.question.correctAnswer;
    
    if (isCorrect) {
      showFeedback({ 
        type: 'correct', 
        message: `¡Correcto! ${currentScenario.question.explanation}` 
      });
    } else {
      showFeedback({ 
        type: 'incorrect', 
        message: 'Esa no es la respuesta correcta. Vuelve a revisar el gráfico de puntos.' 
      });
      setIsAttemptPending(false);
      return;
    }
    
    onAttempt(true);
  }, [currentScenario, isAttemptPending, showFeedback, onAttempt]);

  if (!currentScenario) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  // Generate frequency map for highlighting duplicates
  const expectedFrequency: Map<number, number> = new Map();
  currentScenario.dataPoints.forEach(point => {
    const value = point.value;
    expectedFrequency.set(value, (expectedFrequency.get(value) || 0) + 1);
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-xl font-bold mb-2 text-center">
        {currentEmoji} Laboratorio de Ciencia: Gráfico de Puntos
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4 shadow-md w-full max-w-3xl">
        <h2 className="text-lg font-semibold text-blue-800">{currentScenario.title}</h2>
        <p className="mb-2">{currentScenario.description}</p>
        
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Instrucciones:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Haz clic sobre la línea numérica para colocar un punto (X).</li>
            <li>Cada X representa una medida individual.</li>
            <li>Si hay varias medidas con el mismo valor, debes colocar varias X en ese valor.</li>
            <li>Puedes eliminar un punto haciendo clic sobre él.</li>
          </ul>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-2xl">
            <InteractiveLinePlotG5
              range={currentScenario.range}
              step={currentScenario.step}
              unit={currentScenario.unit}
              dotIcon="X"
              plotData={userPlotData}
              onPlotChange={handlePlotChange}
              isInteractive={!showOptions}
              size={{ width: 500, height: 250 }}
            />
          </div>
        </div>

        {!showOptions && (
          <div className="flex justify-center mt-2">
            <button
              onClick={verifyPlot}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isAttemptPending}
            >
              Verificar gráfico
            </button>
          </div>
        )}
        
        {showOptions && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">{currentScenario.question.text}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {currentScenario.question.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => verifyAnswer(option)}
                  className={`px-4 py-2 rounded-md ${
                    selectedAnswer === option
                      ? selectedAnswer === currentScenario.question.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                  disabled={isAttemptPending || selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Display data points for debugging or teacher view 
        <div className="mt-4 text-sm text-gray-500">
          <div>Datos a representar: {currentScenario.dataPoints.map(p => p.value + currentScenario.unit).join(', ')}</div>
        </div>
        */}
      </div>
    </div>
  );
};
