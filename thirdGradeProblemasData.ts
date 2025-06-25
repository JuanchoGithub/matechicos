
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';
import { ScenarioSetId } from './exercises/problemScenarios';

// Specific exercises for Third Grade - Problemas (s3)
const thirdGradeProblemasBaseData = {
  totalStars: 10,
  numberRange: [10, 999] as [number, number],
  maxDigitsForDataEntry: 3,
  maxDigitsForResultEntry: 4, // Adjusted for potential larger results from multiplication
};

export const thirdGradeProblemasExercises: Exercise[] = [
    {
      id: 'g3-s3-e1',
      title: 'Problemas: Generales (+, -)',
      description: 'Analiza, extrae datos, elige operación y resuelve sumas o restas.',
      iconName: 'ProblemsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.GENERAL },
      question: 'Lee el problema y sigue los pasos:',
    },
    {
      id: 'g3-s3-e2',
      title: 'Problemas: Tecnología (+, -)',
      description: 'Resuelve problemas de suma y resta relacionados con la tecnología.',
      iconName: 'OwlIcon',
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.TECHNOLOGY },
      question: 'Problemas tecnológicos: ¡A resolver!',
    },
    {
      id: 'g3-s3-e3',
      title: 'Problemas: En Casa (+, -)',
      description: 'Situaciones matemáticas de suma y resta que ocurren en el hogar.',
      iconName: 'HomeIcon',
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.HOUSE },
      question: 'Problemas caseros: ¡Calcula!',
    },
    {
      id: 'g3-s3-e4',
      title: 'Problemas: Transportes (+, -)',
      description: 'Calcula y resuelve problemas de suma y resta sobre viajes y vehículos.',
      iconName: 'MeasureIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.TRANSPORT },
      question: 'Problemas de transporte: ¡En marcha!',
    },
    {
      id: 'g3-s3-e5',
      title: 'Problemas: Videojuegos (+, -)',
      description: 'Resuelve desafíos de suma y resta inspirados en videojuegos.',
      iconName: 'GiftIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.VIDEOGAMES },
      question: 'Problemas de videojuegos: ¡Nivel superado!',
    },
    {
      id: 'g3-s3-e6',
      title: 'Problemas: Comida (+, -)',
      description: 'Situaciones con alimentos para practicar sumas y restas.',
      iconName: 'ProblemsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.FOOD },
      question: 'Problemas de comida: ¡Qué rico!',
    },
    {
      id: 'g3-s3-e7',
      title: 'Problemas: Multiplicar y Dividir',
      description: 'Resuelve problemas que implican multiplicación o división.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: {
        ...thirdGradeProblemasBaseData,
        scenarioSetId: ScenarioSetId.MIXED_OPERATIONS_ADVANCED,
        numberRange: [1, 50] as [number, number], // Keep specific range for this set
        maxDigitsForDataEntry: 2,
        maxDigitsForResultEntry: 4,
      },
      question: 'Lee el problema y sigue los pasos (multiplicación/división):',
    },
    { 
      id: 'g3-s3-e8', 
      title: 'Desafíos Combinados 1', 
      description: 'Problemas con sumas, restas y multiplicaciones.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.GENERIC, // This will now show upcoming soon, as it's GENERIC.
      data: {},
      question: 'Ejercicio en preparación',
      content: 'Más problemas combinados estarán disponibles pronto.'
    },
    { 
      id: 'g3-s3-e9', 
      title: 'Desafíos Combinados 2', 
      description: 'Problemas variados con tres operaciones.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.GENERIC,
      data: {},
      question: 'Ejercicio en preparación',
      content: 'Más problemas variados con tres operaciones estarán disponibles pronto.'
    },
    { 
      id: 'g3-s3-e10', 
      title: 'Práctica Extra: Operaciones', 
      description: 'Desafíos con sumas, restas y multiplicaciones.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.GENERIC,
      data: {},
      question: 'Ejercicio en preparación',
      content: 'Desafíos adicionales con las tres operaciones básicas muy pronto.'
    },
    { 
      id: 'g3-s3-e11', 
      title: 'Más Práctica Combinada', 
      description: 'Continúa practicando las tres operaciones.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.GENERIC,
      data: {},
      question: 'Ejercicio en preparación',
      content: 'Sigue practicando con más problemas de operaciones combinadas.'
    },
    { 
      id: 'g3-s3-e12', 
      title: 'Reto Final de Problemas', 
      description: 'Últimos problemas con tres operaciones.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.GENERIC,
      data: {},
      question: 'Ejercicio en preparación',
      content: '¡Prepárate para los últimos desafíos de problemas combinados!'
    },
];
