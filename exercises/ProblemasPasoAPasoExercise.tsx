import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, Scenario } from '../types';
import { scenarioCollections, ScenarioSetId, generateProblemNumbers } from './problemScenarios/index'; 
import { MultiStepProblemSolver, GeneratedProblem, MultiStepProblemSolverConfig } from './MultiStepProblemSolver';


interface ProblemasPasoAPasoExerciseProps {
  exercise: ExerciseType; 
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  setCustomKeypadContent?: (content: React.ReactNode | null) => void; // Add this prop
}

export const ProblemasPasoAPasoExercise: React.FC<ProblemasPasoAPasoExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
  setCustomKeypadContent, // Destructure new prop
}) => {
  const [currentProblemInstance, setCurrentProblemInstance] = useState<GeneratedProblem | null>(null);
  const previousScenarioId = useRef<string | null>(null);
  const previousAdvanceSignalRef = useRef(scaffoldApi.advanceToNextChallengeSignal);
  // Add a ref to track if we're loading a problem to prevent multiple simultaneous loads
  const isLoadingProblemRef = useRef(false);
  // Add a ref to track if the component is mounted
  const isMountedRef = useRef(true);

  const { 
    numberRange = [10, 999], 
    maxDigitsForDataEntry = 3,
    maxDigitsForResultEntry = 4,
    scenarioSetId = ScenarioSetId.GENERAL,
    allowedOperations = ['+', '-']
  } = exercise.data || {};

  const solverConfig: MultiStepProblemSolverConfig = {
    maxDigitsForDataEntry,
    maxDigitsForResultEntry,
  };

  const loadNextProblem = useCallback(() => {
    // Prevent multiple simultaneous problem loads
    if (isLoadingProblemRef.current || !isMountedRef.current) return;
    
    isLoadingProblemRef.current = true;

    const activeScenarios = (scenarioCollections[scenarioSetId as ScenarioSetId] || scenarioCollections[ScenarioSetId.GENERAL]) as Scenario[];
    if (activeScenarios.length === 0) {
        scaffoldApi.showFeedback({type: 'congrats', message: "No hay más problemas."});
        isLoadingProblemRef.current = false;
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
        } while (selectedScenario.id === previousScenarioId.current && attempts < activeScenarios.length * 2);
    }
    previousScenarioId.current = selectedScenario.id;

    const { num1, num2 } = generateProblemNumbers(numberRange as [number, number], selectedScenario.operation);
    let correctResult = 0;
    if (selectedScenario.operation === '+') correctResult = num1 + num2;
    else if (selectedScenario.operation === '-') correctResult = num1 - num2;
    else if (selectedScenario.operation === '*') correctResult = num1 * num2;
    else if (selectedScenario.operation === '/') correctResult = num2 !== 0 ? num1 / num2 : 0;

    setCurrentProblemInstance({ ...selectedScenario, num1, num2, correctResult });
    scaffoldApi.showFeedback(null);
    
    // Reset loading flag after a short delay to prevent rapid consecutive loads
    setTimeout(() => {
      isLoadingProblemRef.current = false;
    }, 500);
  }, [numberRange, scenarioSetId, scaffoldApi]);

  // Set mounted flag on component mount and clear it on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial load of a problem when the component mounts
  useEffect(() => {
    loadNextProblem(); 
  }, [exercise.id]); // Only depend on exercise.id to prevent unnecessary reloads

  // Handle advances to next challenge
  useEffect(() => {
    const currentSignal = scaffoldApi.advanceToNextChallengeSignal;
    const previousSignal = previousAdvanceSignalRef.current ?? -1;
    
    if (currentSignal > previousSignal) {
      loadNextProblem();
      previousAdvanceSignalRef.current = currentSignal;
    }
  }, [scaffoldApi.advanceToNextChallengeSignal, loadNextProblem]);


  if (!currentProblemInstance) {
    return <div className="p-4 text-slate-700">Cargando problema...</div>;
  }

  return (
    <MultiStepProblemSolver
      problem={currentProblemInstance}
      config={solverConfig}
      exerciseQuestionText={exercise.question || "Resuelve el problema paso a paso:"}
      scaffoldApi={scaffoldApi}
      registerKeypadHandler={registerKeypadHandler}
      allowedOperations={allowedOperations as Array<'+' | '-' | '*' | '/'>}
      setCustomKeypadContent={setCustomKeypadContent} // Pass it down
    />
  );
};