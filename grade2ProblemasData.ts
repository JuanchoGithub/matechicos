
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';
import { ScenarioSetId } from './exercises/problemScenarios';

const secondGradeProblemasBaseData = {
  maxDigitsForDataEntry: 2, 
  maxDigitsForResultEntry: 3, // Max for 2-digit sums/subtraction can be 99+99=198
};

export const secondGradeProblemasExercises: Exercise[] = [
  {
    id: 'g2-s3-e1', title: 'Problemas de Suma (hasta 100)',
    description: 'Resuelve problemas de suma con números de hasta dos cifras.',
    iconName: 'ProblemsIcon', isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { ...secondGradeProblemasBaseData, totalStars: 8, numberRange: [10, 89] as [number, number], scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, allowedOperations: ['+'] },
    question: 'Lee y resuelve:',
  },
  {
    id: 'g2-s3-e2', title: 'Problemas de Resta (hasta 100)',
    description: 'Resuelve problemas de resta con números de hasta dos cifras.',
    iconName: 'ProblemsIcon', isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { ...secondGradeProblemasBaseData, totalStars: 8, numberRange: [10, 99] as [number, number], scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, allowedOperations: ['-'] },
    question: 'Lee y resuelve:',
  },
  {
    id: 'g2-s3-e3', title: 'Problemas de Suma y Resta Mixtos',
    description: 'Problemas variados de suma y resta hasta 100.',
    iconName: 'ProblemsIcon', isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { ...secondGradeProblemasBaseData, totalStars: 10, numberRange: [10, 99] as [number, number], scenarioSetId: ScenarioSetId.GENERAL, allowedOperations: ['+', '-'] },
    question: 'Piensa y resuelve:',
  },
  {
    id: 'g2-s3-e4', title: 'Problemas con Dinero (sumas simples)',
    description: 'Calcula totales de dinero con monedas y billetes pequeños.',
    iconName: 'ProblemsIcon', isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO, // Can adapt general problems or need specific monetary scenario set
    data: { ...secondGradeProblemasBaseData, totalStars: 5, numberRange: [5, 50] as [number, number], scenarioSetId: ScenarioSetId.FOOD, // Placeholder, better to have money scenarios
            allowedOperations: ['+'] }, 
    question: 'Calcula el dinero:',
  },
];
