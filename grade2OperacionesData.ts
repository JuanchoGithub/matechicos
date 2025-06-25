
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';

// Helper to generate numbers for "sin llevar" (no carry) addition
const generateNoCarryAdditionOperandsG2 = (maxOperand: number, numOperands: number): number[] => {
    let operands: number[];
    let sum: number;
    let unitsSum: number;
    let tensSum: number;
    do {
        operands = Array.from({ length: numOperands }, () => Math.floor(Math.random() * (maxOperand + 1)));
        sum = operands.reduce((acc, val) => acc + val, 0);
        if (numOperands === 2) {
            unitsSum = (operands[0] % 10) + (operands[1] % 10);
            tensSum = (Math.floor(operands[0] / 10)) + (Math.floor(operands[1] / 10));
            if (unitsSum >= 10 || tensSum >=10 || sum >=100) continue;
        } else { // Simplified for 3 operands, ensure individual sums don't create intermediate carries usually.
            if (sum >=100) continue; // Just cap total for simplicity in 2nd grade intro
        }
    } while ( (maxOperand <= 9 && sum >= 10) || // Single digit, no carry
              (maxOperand > 9 && numOperands === 2 && (unitsSum >= 10 || tensSum >=10 || sum >=100) ) 
            );
    return operands;
};

const generateNoBorrowSubtractionOperandsG2 = (maxOperand: number): number[] => {
    let num1: number, num2: number;
    do {
        num1 = Math.floor(Math.random() * (maxOperand - 10 + 1)) + 10; 
        num2 = Math.floor(Math.random() * (num1 + 1)); // ensure num2 <= num1 initially
        if (num2 > maxOperand) num2 = Math.floor(Math.random() * (maxOperand + 1)); // ensure num2 is within general maxOp

        if ( (num1 % 10) < (num2 % 10) ) continue;
        if ( (Math.floor(num1/10)%10) < (Math.floor(num2/10)%10) ) continue;

    } while ( (num1 % 10) < (num2 % 10) || (maxOperand > 9 && (Math.floor(num1/10)%10) < (Math.floor(num2/10)%10) ) );
    return [num1, num2];
};


export const secondGradeOperacionesExercises: Exercise[] = [
  { 
    id: 'g2-s2-e1', title: 'Sumas Sin Llevar (2 dígitos)', 
    description: 'Suma números de dos dígitos sin llevar.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 10, maxOperand: 99, operationType: 'addition', generateOperands: () => generateNoCarryAdditionOperandsG2(99, 2) },
    question: 'Resuelve la suma:',
  },
  { 
    id: 'g2-s2-e2', title: 'Restas Sin Prestar (2 dígitos)', 
    description: 'Resta números de dos dígitos sin prestar.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 10, maxOperand: 99, operationType: 'subtraction', generateOperands: () => generateNoBorrowSubtractionOperandsG2(99) },
    question: 'Resuelve la resta:',
  },
  { 
    id: 'g2-s2-e3', title: 'Sumas Llevando (2 dig + 1 dig)', 
    description: 'Suma un número de dos dígitos y uno de un dígito, con llevadas.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'addition', operandsConfig: [{digits: 2, min:10, max:99}, {digits:1, min:1, max:9}] },
    question: 'Resuelve la suma:',
  },
   { 
    id: 'g2-s2-e4', title: 'Sumas Llevando (2 dig + 2 dig, simple)', 
    description: 'Suma dos números de dos dígitos, con llevadas simples.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'addition', numOperands: 2, minOperandValue:10, maxOperandValue:99 },
    question: 'Resuelve la suma:',
  },
  { 
    id: 'g2-s2-e5', title: 'Restas Prestando (2 dig - 1 dig)', 
    description: 'Resta un número de un dígito a uno de dos, prestando.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'subtraction', operandsConfig: [{digits: 2, min:10, max:99}, {digits:1, min:1, max:9}] },
    question: 'Resuelve la resta:',
  },
  { 
    id: 'g2-s2-e6', title: 'Restas Prestando (2 dig - 2 dig, simple)', 
    description: 'Resta dos números de dos dígitos, con llevadas simples.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'subtraction', numOperands: 2, minOperandValue:10, maxOperandValue:99 },
    question: 'Resuelve la resta:',
  },
  { 
    id: 'g2-s2-e7', title: 'Multiplicación por 2 (hasta 2x10)', 
    description: 'Practica la tabla del 2.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MULTIPLICATION_TABLE_PRACTICE, 
    data: { totalStars: 10, tables: [2], maxMultiplier: 10 },
    question: '¿Cuánto es?',
  },
  { 
    id: 'g2-s2-e8', title: 'Multiplicación por 5 (hasta 5x10)', 
    description: 'Practica la tabla del 5.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MULTIPLICATION_TABLE_PRACTICE, 
    data: { totalStars: 10, tables: [5], maxMultiplier: 10 },
    question: '¿Cuánto es?',
  },
  { 
    id: 'g2-s2-e9', title: 'Multiplicación por 10 (hasta 10x10)', 
    description: 'Practica la tabla del 10.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MULTIPLICATION_TABLE_PRACTICE, 
    data: { totalStars: 10, tables: [10], maxMultiplier: 10 },
    question: '¿Cuánto es?',
  },
  { 
    id: 'g2-s2-e10', title: 'Problemas de Suma (hasta 100)', 
    description: 'Resuelve problemas simples de suma con números hasta 100.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 5, numberRange: [10, 50], scenarioSetId: 'first_grade_add_sub_lt100_simple', allowedOperations: ['+'] },
    question: 'Resuelve el problema:',
  },
  { 
    id: 'g2-s2-e11', title: 'Problemas de Resta (hasta 100)', 
    description: 'Resuelve problemas simples de resta con números hasta 100.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 5, numberRange: [10, 99], scenarioSetId: 'first_grade_add_sub_lt100_simple', allowedOperations: ['-'] },
    question: 'Resuelve el problema:',
  },
];
