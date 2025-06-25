
import React, { useState, useEffect, useCallback } from 'react';
// import { ExerciseScaffold, ExerciseScaffoldProps } from '../components/ExerciseScaffold'; // Potentially remove if this becomes content-only
import { NumericKeypad } from '../components/NumericKeypad';
import { AvatarData, Exercise as ExerciseType, ExerciseScaffoldApi, Scenario } from '../types'; 
import { Icons } from '../components/icons';
import { scenarioCollections, ScenarioSetId, generateProblemNumbers } from './problemScenarios'; 
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
  const [previousScenarioId, setPreviousScenarioId] = useState<string | null>(null);


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
    const activeScenarios = scenarioCollections[scenarioSetId as ScenarioSetId] || scenarioCollections[ScenarioSetId.GENERAL];
    if (activeScenarios.length === 0) {
        scaffoldApi.showFeedback({type: 'congrats', message: "No hay más problemas."});
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
    let correctResult = 0;
    if (selectedScenario.operation === '+') correctResult = num1 + num2;
    else if (selectedScenario.operation === '-') correctResult = num1 - num2;
    else if (selectedScenario.operation === '*') correctResult = num1 * num2;
    else if (selectedScenario.operation === '/') correctResult = num2 !== 0 ? num1 / num2 : 0;

    setCurrentProblemInstance({ ...selectedScenario, num1, num2, correctResult });
    scaffoldApi.showFeedback(null); 
  }, [numberRange, scenarioSetId, previousScenarioId, scaffoldApi]);

  useEffect(() => {
    loadNextProblem(); 
  }, [exercise.id]); // Removed loadNextProblem from dependency array here, it causes loop

  useEffect(() => {
    // Check if advanceToNextChallengeSignal exists and has changed.
    // The signal might be undefined if the scaffoldApi is not fully initialized
    // or if this component is mounted before the scaffold provides a valid API.
    if (scaffoldApi && scaffoldApi.advanceToNextChallengeSignal !== undefined && 
        scaffoldApi.advanceToNextChallengeSignal !== (previousScenarioId === null ? -1 : scaffoldApi.advanceToNextChallengeSignal -1) ) { // Ensure it's a new signal
        loadNextProblem();
    }
  }, [scaffoldApi?.advanceToNextChallengeSignal, loadNextProblem, previousScenarioId]); // Added loadNextProblem here.


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
