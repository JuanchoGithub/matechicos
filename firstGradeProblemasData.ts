
import { Exercise, ExerciseComponentType } from '../types';
import { ScenarioSetId } from './exercises/problemScenarios'; // Ensure this path is correct relative to this new file's location

// Base data configuration for 1st Grade Problemas
const firstGradeProblemasBaseData = {
  maxDigitsForDataEntry: 2, // For numbers like 9, or 15
  maxDigitsForResultEntry: 2, // For results like 9, or 18
};

export const firstGradeProblemasExercises: Exercise[] = [
  {
    id: 'g1-s3-e1',
    title: 'Problemas fáciles de Sumar (<10)',
    description: 'Resuelve problemas simples de suma con números hasta 10.',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { 
      ...firstGradeProblemasBaseData,
      totalStars: 5, // 5 problems for this exercise
      numberRange: [0, 9] as [number, number], // Numbers in problems will be small
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_EASY, // Use the specific scenario set
      allowedOperations: ['+'], // Only addition
    },
    question: 'Lee y resuelve el problema de suma:',
  },
  {
    id: 'g1-s3-e2',
    title: 'Problemas fáciles de Restar (<10)',
    description: 'Resuelve problemas simples de resta con números hasta 10.',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { 
      ...firstGradeProblemasBaseData,
      totalStars: 5,
      numberRange: [0, 9] as [number, number],
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_EASY,
      allowedOperations: ['-'], // Only subtraction
    },
    question: 'Lee y resuelve el problema de resta:',
  },
  {
    id: 'g1-s3-e3',
    title: 'Problemas fáciles de Sumar y Restar (<10)',
    description: 'Resuelve problemas simples de suma o resta con números hasta 10.',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { 
      ...firstGradeProblemasBaseData,
      totalStars: 10, // More problems as it's mixed
      numberRange: [0, 9] as [number, number],
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_EASY,
      allowedOperations: ['+', '-'], // Mixed operations
    },
    question: 'Lee y resuelve el problema:',
  },
  {
    id: 'g1-s3-e4',
    title: 'Problemas de Sumar (<20)',
    description: 'Resuelve problemas de suma con números y resultados hasta 20 (sin llevar complejo).',
    iconName: 'ProblemsIcon',
    isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { 
      ...firstGradeProblemasBaseData,
      maxDigitsForResultEntry: 2, // e.g., 18
      totalStars: 5,
      numberRange: [0, 19] as [number, number], // numbers can be up to 19, e.g. 12+7
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, // Use this set for slightly larger numbers
      allowedOperations: ['+'],
    },
    question: 'Lee y resuelve el problema de suma:',
  },
  {
    id: 'g1-s3-e5',
    title: 'Problemas de Restar (<20)',
    description: 'Resuelve problemas de resta con números y resultados hasta 20 (sin prestar complejo).',
    iconName: 'ProblemsIcon',
    isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { 
      ...firstGradeProblemasBaseData,
      maxDigitsForResultEntry: 2,
      totalStars: 5,
      numberRange: [0, 19] as [number, number],
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE,
      allowedOperations: ['-'],
    },
    question: 'Lee y resuelve el problema de resta:',
  },
  // Exercises 6-10 for numbers < 100 (simple cases)
  {
    id: 'g1-s3-e6',
    title: 'Problemas: Sumar Decenas (<100)',
    description: 'Suma decenas enteras (10+20, 30+40).',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...firstGradeProblemasBaseData,
      maxDigitsForDataEntry: 2,
      maxDigitsForResultEntry: 2, // e.g., 90
      totalStars: 5,
      numberRange: [10, 90] as [number,number], // For operands that are multiples of 10
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, // Scenarios should generate multiples of 10
      allowedOperations: ['+'],
    },
    question: 'Problema con decenas:',
  },
  {
    id: 'g1-s3-e7',
    title: 'Problemas: Restar Decenas (<100)',
    description: 'Resta decenas enteras (50-20, 80-30).',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...firstGradeProblemasBaseData,
      maxDigitsForDataEntry: 2,
      maxDigitsForResultEntry: 2,
      totalStars: 5,
      numberRange: [10, 90] as [number,number],
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, 
      allowedOperations: ['-'],
    },
    question: 'Problema con decenas:',
  },
  {
    id: 'g1-s3-e8',
    title: 'Problemas: Sumar (2 dig + 1 dig, <100)',
    description: 'Suma un número de dos dígitos con uno de un dígito (ej: 23+5).',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...firstGradeProblemasBaseData,
      maxDigitsForDataEntry: 2,
      maxDigitsForResultEntry: 2, // e.g. 98+1 = 99
      totalStars: 5,
      numberRange: [10, 98] as [number,number], // Main operand
      // For this, scenario generator should ensure one number is 2-digit, other 1-digit
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, 
      allowedOperations: ['+'],
    },
    question: 'Problema de suma:',
  },
  {
    id: 'g1-s3-e9',
    title: 'Problemas: Restar (2 dig - 1 dig, <100)',
    description: 'Resta un número de un dígito a uno de dos dígitos (ej: 37-4).',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...firstGradeProblemasBaseData,
      maxDigitsForDataEntry: 2,
      maxDigitsForResultEntry: 2,
      totalStars: 5,
      numberRange: [10, 99] as [number,number],
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE,
      allowedOperations: ['-'],
    },
    question: 'Problema de resta:',
  },
  {
    id: 'g1-s3-e10',
    title: 'Más Problemas (<100)',
    description: 'Problemas variados de suma y resta con números hasta 100 (casos simples).',
    iconName: 'ProblemsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: {
      ...firstGradeProblemasBaseData,
      maxDigitsForDataEntry: 2,
      maxDigitsForResultEntry: 2,
      totalStars: 10,
      numberRange: [1, 50] as [number,number], // Keep numbers generally smaller
      scenarioSetId: ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE, 
      allowedOperations: ['+', '-'],
    },
    question: 'Resuelve el problema:',
  },
];
