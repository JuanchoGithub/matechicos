import React, { useState, useEffect } from 'react';
import { 
  Exercise as ExerciseType, 
  ExerciseScaffoldApi, 
  DataCollectionQuestScenarioData
} from '../types';

interface DataCollectionQuestExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
}

// Colors for graphs
const GRAPH_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899'  // pink
];

// Utility to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Main exercise component
const DataCollectionQuestExercise: React.FC<DataCollectionQuestExerciseProps> = ({ 
  exercise, 
  scaffoldApi
}) => {
  // Get a random scenario from the available scenarios
  const scenarios = exercise.data?.scenarios || [];
  const [randomizedScenarios, setRandomizedScenarios] = useState<DataCollectionQuestScenarioData[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = randomizedScenarios[currentScenarioIndex] as DataCollectionQuestScenarioData;
  
  // Exercise state
  const [exerciseStep, setExerciseStep] = useState<'survey' | 'graph' | 'analysis'>('survey');
  const [surveyResponses, setSurveyResponses] = useState<Record<string, number>>({});
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<string | number>('');
  const [graphData, setGraphData] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [previousSurveyResults, setPreviousSurveyResults] = useState<Record<string, number>>({});
  
  // Initialize the exercise data
  useEffect(() => {
    if (currentScenario) {
      // Reset state for new scenario
      setExerciseStep('survey');
      setUserAnswer('');
      setGraphData({});
      setFeedback(null);
      setIsCorrect(null);
      
      // For predefined data scenarios, initialize dataPoints but don't populate yet
      if (currentScenario.dataPoints) {
        setDataPoints([]);
      } else if (currentScenario.surveyOptions) {
        // Initialize survey responses to zero
        const initialResponses: Record<string, number> = {};
        currentScenario.surveyOptions.forEach(option => {
          initialResponses[option] = 0;
        });
        setSurveyResponses(initialResponses);
        
        // Initialize active category for the bar chart
        if (currentScenario.surveyOptions.length > 0) {
          setActiveCategory(currentScenario.surveyOptions[0]);
        }
      }
    }
  }, [currentScenario]);

  // Shuffle scenarios and their options/data points on mount
  useEffect(() => {
    if (scenarios.length > 0) {
      // Deep copy and randomize scenarios and their values
      const randomized = shuffle(scenarios).map(scenario => {
        // Deep copy using JSON methods to avoid reference issues
        const copy: DataCollectionQuestScenarioData = JSON.parse(JSON.stringify(scenario));
        if (copy.surveyOptions) {
          copy.surveyOptions = shuffle(copy.surveyOptions);
        }
        if (copy.dataPoints) {
          copy.dataPoints = shuffle(copy.dataPoints);
        }
        return copy;
      });
      setRandomizedScenarios(randomized);
    }
  }, [exercise.data]);

  // Handle submit survey response
  const handleSurveyResponse = (option: string) => {
    if (exerciseStep !== 'survey') return;
    
    setSurveyResponses(prev => ({
      ...prev,
      [option]: (prev[option] || 0) + 1
    }));
    
    // Play a sound effect
    const audio = new Audio('/audio/click.mp3');
    audio.play().catch(e => console.log('Audio play failed: ', e));
    
    // We don't automatically advance to the graph step or update graphData
    // The "Crear Gráfico" button will handle that when clicked
  };

  // Handle adding data point to line plot
  const handleAddDataPoint = (value: number) => {
    if (exerciseStep !== 'survey') return;
    
    setDataPoints(prev => [...prev, value]);
    
    // Play a sound effect
    const audio = new Audio('/audio/click.mp3');
    audio.play().catch(e => console.log('Audio play failed: ', e));
    
    // We don't automatically advance to the graph step anymore
  };

  // Handle submitting analysis answer
  const handleSubmitAnswer = () => {
    if (!userAnswer) return;
    
    let correct = false;
    let resultMessage = '';
    
    if (currentScenario.analysisType === 'most-popular') {
      // Find most popular option
      const entries = Object.entries(graphData);
      entries.sort((a, b) => b[1] - a[1]);
      const mostPopular = entries[0][0];
      const mostPopularCount = entries[0][1];
      
      correct = String(userAnswer).toLowerCase() === mostPopular.toLowerCase();
      
      if (correct) {
        resultMessage = currentScenario.feedbackMessages.correct
          .replace('{answer}', mostPopular)
          .replace('{count}', String(mostPopularCount));
      } else {
        resultMessage = currentScenario.feedbackMessages.incorrect;
      }
    } else if (currentScenario.analysisType === 'mean') {
      const sum = dataPoints.reduce((total, val) => total + val, 0);
      const mean = sum / dataPoints.length;
      const meanRounded = Math.round(mean * 100) / 100; // Round to 2 decimal places
      
      correct = Number(userAnswer) === meanRounded;
      
      if (correct) {
        resultMessage = currentScenario.feedbackMessages.correct;
      } else {
        resultMessage = currentScenario.feedbackMessages.incorrect;
      }
    } else if (currentScenario.analysisType === 'mode') {
      // Find mode (most frequent value)
      const counts: Record<number, number> = {};
      dataPoints.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });
      
      let mode = dataPoints[0];
      let maxCount = 0;
      
      Object.entries(counts).forEach(([val, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mode = Number(val);
        }
      });
      
      correct = Number(userAnswer) === mode;
      
      if (correct) {
        resultMessage = currentScenario.feedbackMessages.correct;
      } else {
        resultMessage = currentScenario.feedbackMessages.incorrect;
      }
    }
    
    setFeedback(resultMessage);
    setIsCorrect(correct);
    
    if (correct) {
      // Play success sound
      const audio = new Audio('/audio/success.mp3');
      audio.play().catch(e => console.log('Audio play failed: ', e));
      
      // Report success to scaffold
      scaffoldApi.onAttempt(true);
      scaffoldApi.showFeedback({
        type: 'correct',
        message: resultMessage
      });
    } else {
      // Play error sound
      const audio = new Audio('/audio/error.mp3');
      audio.play().catch(e => console.log('Audio play failed: ', e));
      
      scaffoldApi.onAttempt(false);
      scaffoldApi.showFeedback({
        type: 'incorrect',
        message: resultMessage
      });
    }
  };

  // Reset the exercise
  const handleReset = () => {
    setExerciseStep('survey');
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setGraphData({}); // Clear graph data
    
    // For predefined data scenarios, initialize dataPoints
    if (currentScenario.dataPoints) {
      setDataPoints([]);
    } else if (currentScenario.surveyOptions) {
      // Initialize survey responses to zero
      const initialResponses: Record<string, number> = {};
      currentScenario.surveyOptions.forEach(option => {
        initialResponses[option] = 0;
      });
      setSurveyResponses(initialResponses);
    }
  };

  // Handle input change for data point and answer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.name === 'dataPoint') {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setUserAnswer(numValue);
      }
    } else if (e.target.name === 'answer') {
      setUserAnswer(value);
    }
  };
  
  // No longer needed as we use the inline calculation

  // Render survey form
  const renderSurveyForm = () => {
    if (currentScenario.surveyOptions) {
      const totalResponses = Object.values(surveyResponses).reduce((sum, val) => sum + val, 0);
      const requiredResponses = currentScenario.requiredResponses || 0;
      const remaining = Math.max(0, requiredResponses - totalResponses);
      
      return (
        <div className="survey-form">
          <h3 className="text-xl font-bold mb-4">Formulario de Encuesta</h3>
          {remaining > 0 && (
            <div className="mb-4 text-blue-600">
              Necesitas {remaining} {remaining === 1 ? 'respuesta más' : 'respuestas más'}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            {currentScenario.surveyOptions && currentScenario.surveyOptions.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSurveyResponse(option)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
              >
                {option} {surveyResponses[option] > 0 && `(${surveyResponses[option]})`}
              </button>
            ))}
          </div>
          
          {/* Button to move to the graph step */}
          {remaining === 0 && (
            <div className="mt-6">
              <button
                onClick={() => {
                  // Store survey responses for reference in the graph step
                  setPreviousSurveyResults(surveyResponses);
                  // When moving to the graph step, reset surveyResponses to all zeros so the chart is empty
                  if (currentScenario.surveyOptions) {
                    const zeroed: Record<string, number> = {};
                    currentScenario.surveyOptions.forEach(option => {
                      zeroed[option] = 0;
                    });
                    setSurveyResponses(zeroed);
                  }
                  setExerciseStep('graph');
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-bold"
              >
                Crear Gráfico
              </button>
            </div>
          )}
        </div>
      );
    } else if (currentScenario.dataPoints) {
      // For predefined data scenarios, show remaining points to add
      
      return (
        <div className="data-form">
          <h3 className="text-xl font-bold mb-4">Ingreso de Datos</h3>
          {dataPoints.length < (currentScenario.dataPoints?.length || 0) ? (
            <>
              <p className="mb-2">Ingresa estos datos en orden:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentScenario.dataPoints.map((point, idx) => (
                  <span 
                    key={idx} 
                    className={`px-3 py-1 rounded-full ${dataPoints.includes(point) || dataPoints.length > idx ? 'bg-gray-300 line-through' : 'bg-blue-100'}`}
                  >
                    {point}{currentScenario.unit || ''}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="dataPoint"
                  value={userAnswer}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-24"
                  step={currentScenario.step || 1}
                />
                <span>{currentScenario.unit || ''}</span>
                <button
                  onClick={() => {
                    if (typeof userAnswer === 'number') {
                      handleAddDataPoint(userAnswer);
                      setUserAnswer('');
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Agregar
                </button>
              </div>
            </>
          ) : (
            <div className="text-green-600 mb-4">
              ¡Todos los datos ingresados! Ahora puedes crear el gráfico.
            </div>
          )}
          
          <div className="mt-4">
            <p className="font-bold">Datos ingresados:</p>
            <div className="flex flex-wrap gap-2">
              {dataPoints.map((point, idx) => (
                <span key={idx} className="bg-blue-100 px-3 py-1 rounded-full">
                  {point}{currentScenario.unit || ''}
                </span>
              ))}
            </div>
          </div>
          
          {/* Button to move to the graph step */}
          {dataPoints.length === currentScenario.dataPoints?.length && (
            <div className="mt-6">
              <button
                onClick={() => setExerciseStep('graph')}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-bold"
              >
                Crear Gráfico
              </button>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  // Handler for bar chart increment/decrement
  const adjustBar = (category: string, delta: number) => {
    if (!category) return;
    
    setSurveyResponses(prev => {
      const total = Object.values(prev).reduce((sum, v) => sum + v, 0);
      if (delta > 0 && total >= (currentScenario.requiredResponses || 5)) return prev;
      const newValue = Math.max(0, (prev[category] || 0) + delta);
      return { ...prev, [category]: newValue };
    });
  };
  
  // Interactive Bar Chart for Step 2
  const renderInteractiveBarChart = () => {
    if (!currentScenario.surveyOptions) return null;

    // Prepare categories and user values
    const categories = currentScenario.surveyOptions.map((name, idx) => ({
      name,
      color: GRAPH_COLORS[idx % GRAPH_COLORS.length],
    }));

    const maxVotes = Math.max(
      currentScenario.requiredResponses || 5,
      ...Object.values(surveyResponses)
    );

    // Check if chart is complete
    const totalVotes = Object.values(surveyResponses).reduce((sum, v) => sum + v, 0);
    const canProceed = totalVotes === (currentScenario.requiredResponses || 5);

    return (
      <div className="flex flex-col md:flex-row items-start w-full">
        {/* Side box with survey results */}
        <div className="bg-slate-100 rounded-lg p-4 mb-4 md:mb-0 md:mr-6 min-w-[180px] shadow-sm border border-slate-200">
          <div className="font-bold mb-2 text-slate-700 text-center">Respuestas de la encuesta</div>
          <ul className="space-y-1">
            {Object.entries(previousSurveyResults).map(([option, count]) => (
              <li key={option} className="flex justify-between">
                <span>{option}</span>
                <span className="font-mono font-bold text-blue-700">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Main chart builder UI */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4">Construir el Gráfico de Barras</h3>
          <div className="flex gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => adjustBar(activeCategory || '', -1)}
              className="bg-slate-200 text-xl px-4 py-2 rounded-lg font-bold"
              disabled={!activeCategory || (surveyResponses[activeCategory || ''] || 0) === 0}
            >
              -
            </button>
            <button
              onClick={() => adjustBar(activeCategory || '', 1)}
              className="bg-blue-500 text-white text-xl px-4 py-2 rounded-lg font-bold"
              disabled={!activeCategory || totalVotes >= (currentScenario.requiredResponses || 5)}
            >
              +
            </button>
          </div>
          {/* Bar Chart SVG */}
          <div className="w-full flex justify-center">
            <svg width={320} height={220}>
              {/* Axes */}
              <line x1="40" y1="20" x2="40" y2="180" stroke="#888" strokeWidth="2" />
              <line x1="40" y1="180" x2="300" y2="180" stroke="#888" strokeWidth="2" />
              {/* Bars */}
              {categories.map((cat, idx) => {
                const value = surveyResponses[cat.name] || 0;
                const barHeight = maxVotes > 0 ? (value / maxVotes) * 140 : 0;
                return (
                  <g key={cat.name}>
                    <rect
                      x={60 + idx * 60}
                      y={180 - barHeight}
                      width={40}
                      height={barHeight}
                      fill={cat.color}
                      rx={6}
                      className={activeCategory === cat.name ? 'stroke-2 stroke-blue-700' : ''}
                    />
                    <text
                      x={80 + idx * 60}
                      y={195}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#333"
                    >
                      {cat.name}
                    </text>
                    {value > 0 && (
                      <text
                        x={80 + idx * 60}
                        y={170 - barHeight}
                        textAnchor="middle"
                        fontSize="14"
                        fill="#222"
                        fontWeight="bold"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <button
            onClick={() => {
              if (canProceed) {
                setGraphData({ ...surveyResponses });
                setExerciseStep('analysis');
              }
            }}
            className={`mt-6 px-6 py-3 rounded-lg font-bold text-white transition-colors ${canProceed ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-300 cursor-not-allowed'}`}
            disabled={!canProceed}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Render analysis UI
  const renderAnalysis = () => {
    // For most-popular type, use the survey options as buttons styled for sidebar
    const renderAnswerOptions = () => {
      if (currentScenario.analysisType === 'most-popular' && currentScenario.surveyOptions) {
        return (
          <div className="flex flex-col gap-3 mb-4">
            {currentScenario.surveyOptions.map(option => {
              const isSelected = userAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => setUserAnswer(option)}
                  className={`w-full p-3 rounded-lg text-left font-semibold transition-all duration-150 shadow-sm hover:shadow-md
                    ${isSelected ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-500' : 'bg-white text-black hover:bg-sky-50'}`}
                  style={{ minWidth: 120 }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );
      } else if (currentScenario.analysisType === 'mean' || currentScenario.analysisType === 'mode') {
        // For numerical answers, create number option buttons
        const min = Math.min(...dataPoints);
        const max = Math.max(...dataPoints);
        let options: number[] = [];
        if (currentScenario.analysisType === 'mean') {
          const sum = dataPoints.reduce((total, val) => total + val, 0);
          const mean = sum / dataPoints.length;
          const correctMean = Math.round(mean * 100) / 100;
          options = [correctMean, correctMean - 0.5, correctMean + 0.5, correctMean - 1, correctMean + 1].sort((a, b) => a - b);
        } else {
          options = [...new Set(dataPoints)];
          if (options.length < 4) {
            if (min > 0) options.push(min - 1);
            options.push(max + 1);
          }
          options.sort((a, b) => a - b);
        }
        return (
          <div className="flex flex-col gap-3 mb-4">
            {options.map(option => {
              const isSelected = userAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => setUserAnswer(option)}
                  className={`w-full p-3 rounded-lg text-left font-semibold transition-all duration-150 shadow-sm hover:shadow-md
                    ${isSelected ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-500' : 'bg-white text-black hover:bg-sky-50'}`}
                  style={{ minWidth: 120 }}
                >
                  {option}{currentScenario.unit || ''}
                </button>
              );
            })}
          </div>
        );
      }
      return null;
    };

    return (
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-bold mb-4">Análisis de Datos</h3>
        <p className="mb-4">{currentScenario.questionText}</p>
        {renderAnswerOptions()}
        <button
          onClick={handleSubmitAnswer}
          className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${!userAnswer ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={!userAnswer}
        >
          Verificar Respuesta
        </button>
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  const isLoading = randomizedScenarios.length === 0 || !randomizedScenarios[currentScenarioIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-xl text-gray-500">
        Cargando ejercicio...
      </div>
    );
  }

  return (
    <div className="data-collection-quest p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          {currentScenario.emoji && <span className="mr-2 text-3xl">{currentScenario.emoji}</span>}
          {currentScenario.title}
        </h2>
        <p className="text-gray-700">{currentScenario.description}</p>
        {currentScenario.instructions && (
          <p className="mt-2 text-blue-600">{currentScenario.instructions}</p>
        )}
      </div>
      
      <div className="exercise-content bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        {exerciseStep === 'survey' && renderSurveyForm()}
        {exerciseStep === 'graph' && renderInteractiveBarChart()}
        {exerciseStep === 'analysis' && renderAnalysis()}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
        >
          Reiniciar
        </button>
        
        {isCorrect && (
          <button
            onClick={() => {
              const newIndex = (currentScenarioIndex + 1) % scenarios.length;
              setCurrentScenarioIndex(newIndex);
            }}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Siguiente Ejercicio
          </button>
        )}
      </div>
    </div>
  );
};

export default DataCollectionQuestExercise;
