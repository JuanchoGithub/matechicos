
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise as ExerciseType, AvatarData, ExerciseScaffoldApi, Scenario } from '../types'; // Import ExerciseScaffoldApi
import { MultiStepProblemSolver, GeneratedProblem, MultiStepProblemSolverConfig } from './MultiStepProblemSolver';
import { generateProblemNumbers, scenarioCollections, ScenarioSetId } from './problemScenarios'; 

interface ProblemasMatematicosGuiadosExerciseProps {
  exercise: ExerciseType; 
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  setCustomKeypadContent?: (content: React.ReactNode | null) => void; // Added prop
  // Removed props: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

type OperationType = '+' | '-' | '*' | '/';

export const ProblemasMatematicosGuiadosExercise: React.FC<ProblemasMatematicosGuiadosExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
  setCustomKeypadContent, // Destructure the prop
}) => {
  // Add a guard for the exercise prop
  if (!exercise) {
    console.error("ProblemasMatematicosGuiadosExercise rendered with undefined 'exercise' prop.");
    return <div className="p-4 text-center text-red-500">Error: Datos del ejercicio no disponibles. Vuelve a intentarlo.</div>;
  }

  const [currentProblemInstance, setCurrentProblemInstance] = useState<GeneratedProblem | null>(null);
  const [previousScenarioId, setPreviousScenarioId] = useState<string | null>(null);


  const { 
    numberRange = [10, 999], 
    maxDigitsForDataEntry = 3,
    maxDigitsForResultEntry = 4,
    scenarioSetId = ScenarioSetId.GENERAL, 
  } = exercise.data || {};

  const solverConfig: MultiStepProblemSolverConfig = {
    maxDigitsForDataEntry,
    maxDigitsForResultEntry,
  };

  const allowedOperations: OperationType[] = scenarioSetId === ScenarioSetId.MIXED_OPERATIONS_ADVANCED
    ? ['+', '-', '*', '/']
    : ['+', '-'];

  const loadNextProblem = useCallback(() => {
    const activeScenarios = scenarioCollections[scenarioSetId as ScenarioSetId] || scenarioCollections[ScenarioSetId.GENERAL];

    if (activeScenarios.length === 0) {
        scaffoldApi.showFeedback({type: 'congrats', message: 'No hay más problemas de este tipo.'});
        // The scaffold will handle overall exercise completion if this was the last set of stars.
        return;
    }
    
    let selectedScenario: Scenario;
    if (activeScenarios.length === 1) {
        selectedScenario = activeScenarios[0];
    } else {
        let attempts = 0;
        do {
            selectedScenario = activeScenarios[Math.floor(Math.random() * activeScenarios.length)];
            attempts++;
        } while (selectedScenario.id === previousScenarioId && attempts < activeScenarios.length * 2); 
    }
    
    setPreviousScenarioId(selectedScenario.id);

    const { num1, num2 } = generateProblemNumbers(numberRange as [number, number], selectedScenario.operation);
    
    let correctResult: number;
    if (selectedScenario.operation === '+') correctResult = num1 + num2;
    else if (selectedScenario.operation === '-') correctResult = num1 - num2;
    else if (selectedScenario.operation === '*') correctResult = num1 * num2;
    else if (selectedScenario.operation === '/') correctResult = num2 !== 0 ? num1 / num2 : 0;
    else correctResult = 0; 

    setCurrentProblemInstance({
      ...selectedScenario,
      num1,
      num2,
      correctResult,
    });
  }, [numberRange, scenarioSetId, previousScenarioId, scaffoldApi]); 

  useEffect(() => {
    loadNextProblem();
  }, [exercise.id]); // Load first problem on mount or exercise change. Removed loadNextProblem from deps to avoid loop.

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > 0) { // Only trigger if signal is explicitly advanced (not on initial 0)
        loadNextProblem();
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, loadNextProblem]); // Re-add loadNextProblem here.


  if (!currentProblemInstance) {
    return <div className="p-4 text-slate-700">Cargando problema matemático...</div>;
  }
  
  return (
    <MultiStepProblemSolver
      problem={currentProblemInstance}
      config={solverConfig}
      exerciseQuestionText={exercise.question || "Resuelve el problema paso a paso:"}
      scaffoldApi={scaffoldApi}
      registerKeypadHandler={registerKeypadHandler}
      allowedOperations={allowedOperations}
      setCustomKeypadContent={setCustomKeypadContent} // Pass it down
    />
  );
};
