
import { Exercise, ExerciseComponentType, OriginalIconName, FinanceChallengeG5 } from './types';
import { ScenarioSetId } from './exercises/problemScenarios/index';

// Define age-appropriate financial scenarios for 3rd Grade
const thirdGradeFinanceScenarios: FinanceChallengeG5[] = [
  {
    id: 'g3_fin_adv_1',
    initialMoney: 1000,
    shoppingList: [
      { item: { name: 'Juguete', price: 250, icon: '🧸' }, quantity: 1 },
      { item: { name: 'Golosinas', price: 120, icon: '🍬' }, quantity: 2 },
    ],
  },
  {
    id: 'g3_fin_adv_2',
    initialMoney: 2000,
    shoppingList: [
      { item: { name: 'Libro', price: 800, icon: '📚' }, quantity: 1 },
      { item: { name: 'Lápices', price: 150, icon: '✏️' }, quantity: 3 },
    ],
  },
  {
    id: 'g3_fin_adv_3',
    initialMoney: 1500,
    shoppingList: [
      { item: { name: 'Entrada al cine', price: 700, icon: '🎟️' }, quantity: 1 },
      { item: { name: 'Pochoclos', price: 450, icon: '🍿' }, quantity: 1 },
    ],
  },
];


// Specific exercises for Third Grade - Problemas (s3)
const thirdGradeProblemasBaseData = {
  totalStars: 10,
  numberRange: [10, 999] as [number, number],
  maxDigitsForDataEntry: 3,
  maxDigitsForResultEntry: 4,
};

export const thirdGradeProblemasExercises: Exercise[] = [
    {
      id: 'g3-s3-e1',
      title: 'Problemas: Generales (+, -)',
      description: 'Analiza, extrae datos, elige operación y resuelve sumas o restas.',
      iconName: 'ProblemsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
      data: { ...thirdGradeProblemasBaseData, scenarioSetId: ScenarioSetId.GENERAL, allowedOperations: ['+', '-'] },
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
        numberRange: [1, 50] as [number, number],
        maxDigitsForDataEntry: 2,
        maxDigitsForResultEntry: 4,
        allowedOperations: ['*', '/']
      },
      question: 'Lee el problema y sigue los pasos (multiplicación/división):',
    },
    { 
      id: 'g3-s3-e8',
      title: 'Finanzas para Chicos (3er Grado)',
      description: 'Calcula costos, totales y vueltos en problemas de compras.',
      iconName: 'ProblemsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.FINANZAS_AVANZADO,
      data: { 
        totalStars: 9, 
        scenarios: thirdGradeFinanceScenarios,
      },
      question: 'Resuelve el problema de finanzas paso a paso:',
    },
];
