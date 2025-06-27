

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { AvatarData, Exercise as ExerciseType, ExerciseScaffoldApi, Scenario } from '../types'; 
import { Icons } from '../components/icons';
import { scenarioCollections, ScenarioSetId, generateProblemNumbers } from './problemScenarios/index'; 
import { MultiStepProblemSolver, GeneratedProblem, MultiStepProblemSolverConfig } from './MultiStepProblemSolver';


interface ProblemasMatematicosGuiadosExerciseProps {
  exercise: ExerciseType; 
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  setCustomKeypadContent?: (content: React.ReactNode | null) => void; 
}

export const ProblemasMatematicosGuiadosExercise: React.FC<ProblemasMatematicosGuiadosExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler,
  setCustomKeypadContent, 
}) => {
  if (!exercise) {
    console.error("ProblemasMatematicosGuiadosExercise rendered with undefined 'exercise' prop.");
    return <div className="p-4 text-center text-red-500">Error: Datos del ejercicio no disponibles. Vuelve a intentarlo.</div>;
  }
  
  const [currentProblemInstance, setCurrentProblemInstance] = useState<GeneratedProblem | null>(null);
  const previousScenarioId = useRef<string | null>(null);
  const previousAdvanceSignalRef = useRef(scaffoldApi.advanceToNextChallengeSignal);

  const { 
    numberRange = [10, 999], 
    maxDigitsForDataEntry = 3,
    maxDigitsForResultEntry = 4,
    scenarioSetId = ScenarioSetId.GENERAL,
    allowDecimal = false, 
  } = exercise.data || {};

  const solverConfig: MultiStepProblemSolverConfig = {
    maxDigitsForDataEntry,
    maxDigitsForResultEntry,
  };

  const allowedOperations: Array<'+' | '-' | '*' | '/'> = scenarioSetId === ScenarioSetId.MIXED_OPERATIONS_ADVANCED
    ? ['+', '-', '*', '/']
    : ['+', '-'];

  const loadNextProblem = useCallback(() => {
    const activeScenarios = (scenarioCollections[scenarioSetId as ScenarioSetId] || scenarioCollections[ScenarioSetId.GENERAL]) as Scenario[];
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
        } while (selectedScenario.id === previousScenarioId.current && attempts < activeScenarios.length * 2);
    }
    previousScenarioId.current = selectedScenario.id;

    const { num1, num2 } = generateProblemNumbers(numberRange as [number, number], selectedScenario.operation, allowDecimal);
    let correctResult = 0;
    if (selectedScenario.operation === '+') correctResult = num1 + num2;
    else if (selectedScenario.operation === '-') correctResult = num1 - num2;
    else if (selectedScenario.operation === '*') correctResult = num1 * num2;
    else if (selectedScenario.operation === '/') correctResult = num2 !== 0 ? num1 / num2 : 0;
    
    if(allowDecimal) correctResult = parseFloat(correctResult.toFixed(2));

    setCurrentProblemInstance({ ...selectedScenario, num1, num2, correctResult });
    scaffoldApi.showFeedback(null); 
  }, [numberRange, scenarioSetId, scaffoldApi, allowDecimal]);

  useEffect(() => {
    loadNextProblem(); 
  }, [exercise.id, allowDecimal, loadNextProblem]);

  useEffect(() => {
    if (scaffoldApi.advanceToNextChallengeSignal > (previousAdvanceSignalRef.current ?? -1) ) {
        loadNextProblem();
    }
    previousAdvanceSignalRef.current = scaffoldApi.advanceToNextChallengeSignal;
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
      allowedOperations={allowedOperations}
      setCustomKeypadContent={setCustomKeypadContent}
      allowDecimal={allowDecimal}
    />
  );
};