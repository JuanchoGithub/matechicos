

import { Exercise, ExerciseComponentType, OriginalIconName, FinanceChallengeG5, FraccionCantidadChallenge } from './types';
import { ScenarioSetId } from './exercises/problemScenarios/index';

// Define scenarios locally for grade 4
const fourthGradeFinanceAdvancedScenarios: FinanceChallengeG5[] = [
  {
    id: 'g4_fin_adv_1',
    initialMoney: 5000,
    shoppingList: [
      { item: { name: 'Pelota de Fútbol', price: 1800, icon: '⚽' }, quantity: 1 },
      { item: { name: 'Remera', price: 1950, icon: '👕' }, quantity: 1 },
    ],
  },
  {
    id: 'g4_fin_adv_2',
    initialMoney: 10000,
    shoppingList: [
      { item: { name: 'Mochila', price: 4500, icon: '🎒' }, quantity: 1 },
      { item: { name: 'Libro de Aventuras', price: 1500, icon: '📚' }, quantity: 2 },
    ],
  },
  {
    id: 'g4_fin_adv_3',
    initialMoney: 8000,
    shoppingList: [
      { item: { name: 'Auriculares', price: 3500, icon: '🎧' }, quantity: 1 },
      { item: { name: 'Juego', price: 2800, icon: '🎮' }, quantity: 1 },
    ],
  },
];


export const fourthGradeProblemasExercises: Exercise[] = [
    { 
    id: 'g4-s3-e1', title: 'Problemas de Dos o Más Pasos', 
    description: 'Resuelve problemas combinando operaciones.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 8, numberRange: [10, 500], scenarioSetId: ScenarioSetId.GENERAL, allowedOperations: ['+', '-', '*'] }, 
    question: 'Lee y resuelve paso a paso:',
  },
   { 
    id: 'g4-s3-e2', title: 'Problemas con Multiplicación y División', 
    description: 'Aplica multiplicación y división en problemas.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 8, numberRange: [2, 100], scenarioSetId: ScenarioSetId.MIXED_OPERATIONS_ADVANCED, allowedOperations: ['*', '/'] }, 
    question: 'Resuelve el problema:',
  },
  { 
    id: 'g4-s3-e3', title: 'Problemas con Fracciones (Parte de un Todo)', 
    description: 'Calcula la fracción de una cantidad.', 
    iconName: 'BookOpenIcon', 
    isLocked: false,
    componentType: ExerciseComponentType.FRACCION_DE_CANTIDAD_G5,
    data: {
      totalStars: 10,
      challenges: [
        { fractionNum: 1, fractionDen: 4, wholeNumber: 20, correctAnswer: 5, context: 'caramelos' },
        { fractionNum: 2, fractionDen: 3, wholeNumber: 18, correctAnswer: 12, context: 'figuritas' },
        { fractionNum: 3, fractionDen: 5, wholeNumber: 25, correctAnswer: 15, context: 'libros' },
        { fractionNum: 1, fractionDen: 2, wholeNumber: 30, correctAnswer: 15, context: 'alumnos' },
        { fractionNum: 3, fractionDen: 4, wholeNumber: 16, correctAnswer: 12, context: 'manzanas' },
        { fractionNum: 4, fractionDen: 7, wholeNumber: 21, correctAnswer: 12, context: 'lápices' },
        { fractionNum: 2, fractionDen: 6, wholeNumber: 24, correctAnswer: 8, context: 'globos' }, 
        { fractionNum: 5, fractionDen: 8, wholeNumber: 40, correctAnswer: 25, context: 'pesos' },
        { fractionNum: 2, fractionDen: 9, wholeNumber: 27, correctAnswer: 6, context: 'flores' },
        { fractionNum: 1, fractionDen: 10, wholeNumber: 100, correctAnswer: 10, context: 'puntos' }
      ] as FraccionCantidadChallenge[]
    },
    question: 'Calcula la fracción de la cantidad:',
    content: 'Encuentra la parte de un número total basándote en la fracción dada.'
  },
  { 
    id: 'g4-s3-e4',
    title: 'Finanzas para Chicos', 
    description: 'Calcula costos y vueltos en problemas de compras.', 
    iconName: 'ProblemsIcon', 
    isLocked: false,
    componentType: ExerciseComponentType.FINANZAS_AVANZADO, 
    data: { 
        totalStars: 9, // 3 problems * 3 steps each
        scenarios: fourthGradeFinanceAdvancedScenarios,
    },
    question: 'Resuelve el problema de finanzas paso a paso:',
  },
];