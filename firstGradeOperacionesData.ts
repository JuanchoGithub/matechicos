
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';

// Helper to generate numbers for "sin llevar" (no carry) addition
const generateNoCarryAdditionOperands = (maxOperand: number, numOperands: number): number[] => {
    let operands: number[];
    let sum: number;
    let unitsSum: number;
    let tensSum: number;

    if (numOperands === 2) {
        do {
            operands = [
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
            ];
            sum = operands[0] + operands[1];
            unitsSum = (operands[0] % 10) + (operands[1] % 10);
            tensSum = (Math.floor(operands[0] / 10)) + (Math.floor(operands[1] / 10));
        } while ( (maxOperand <= 9 && sum >= 10) || // Single digit, no carry
                  (maxOperand > 9 && (unitsSum >= 10 || tensSum >=10 || sum >=100) ) // Two digits, no carry in units or tens, sum < 100
                );
    } else { // numOperands === 3, assumed all single digit for 1st grade "sin llevar"
        do {
             operands = [
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
                Math.floor(Math.random() * (maxOperand + 1)),
            ];
            sum = operands[0] + operands[1] + operands[2];
        } while (sum >= 10); // Ensure sum of 3 single digits is less than 10
    }
    return operands;
};

// Helper to generate numbers for "sin prestar" (no borrow) subtraction
const generateNoBorrowSubtractionOperands = (maxOperand: number): number[] => {
    let num1: number, num2: number;
     if (maxOperand <= 9) { // Single digit
        do {
            num1 = Math.floor(Math.random() * (maxOperand + 1));
            num2 = Math.floor(Math.random() * (num1 + 1)); // num2 <= num1
        } while (false); // No specific borrow condition for single digit beyond num1 >= num2
    } else { // Two digits
        do {
            num1 = Math.floor(Math.random() * (maxOperand - 10 + 1)) + 10; // Ensure num1 is at least 10 for 2-digit
            num2 = Math.floor(Math.random() * (maxOperand + 1));
            if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure num1 >= num2
        } while ( (num1 % 10) < (num2 % 10) || (Math.floor(num1 / 10) % 10) < (Math.floor(num2 / 10) % 10) );
    }
    return [num1, num2];
};


export const firstGradeOperacionesExercises: Exercise[] = [
  // 1. Sumas sin llevar, dos sumandos de 1 dígito (con ayuda)
  { 
    id: 'g1-s2-e1', 
    title: 'Sumar con Ayuda Visual (1 dígito)', 
    description: 'Suma números de un dígito usando dibujos. Sin llevar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.VISUAL_ARITHMETIC_1_DIGIT, 
    data: { totalStars: 5, operation: '+', maxOperandValue: 9, ensureNoCarryOrBorrow: true },
    question: '¿Cuánto es en total?',
  },
  // 2. Lo mismo pero sin ayuda (Sumas sin llevar, 1 dígito)
  { 
    id: 'g1-s2-e2', 
    title: 'Sumar Sin Llevar (1 dígito)', 
    description: 'Suma números de un dígito. Sin llevar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS, 
    data: { 
        totalStars: 10, 
        minOperand: 0, maxOperand: 9, 
        operationType: 'addition', 
        generateOperands: () => generateNoCarryAdditionOperands(9, 2)
    },
    question: 'Resuelve la suma:',
  },
  // 3. Lo mismo pero con 2 sumandos de 2 dígitos (Sumas sin llevar, 2 dígitos)
  { 
    id: 'g1-s2-e3', 
    title: 'Sumar Sin Llevar (2 dígitos)', 
    description: 'Suma números de dos dígitos. Sin llevar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { 
        totalStars: 10, 
        minOperand: 10, maxOperand: 99, 
        operationType: 'addition',
        generateOperands: () => generateNoCarryAdditionOperands(99, 2)
    },
    question: 'Resuelve la suma:',
  },
  // 4. Lo mismo con 3 sumandos de 1 dígito (Sumas sin llevar, 3 sumandos 1 dígito)
  { 
    id: 'g1-s2-e4', 
    title: 'Sumar 3 Números (1 dígito, sin llevar)', 
    description: 'Suma tres números de un dígito. Sin llevar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION, 
    data: { 
        totalStars: 10, 
        operationType: 'addition',
        minOperandValue: 0, maxOperandValue: 9,
        numOperands: 3,
        ensureNoCarry: true, 
    },
    question: 'Suma los tres números:',
  },
  // 5. Sumas llevando, dos sumandos de 1 dígito con ayuda
  { 
    id: 'g1-s2-e5', 
    title: 'Sumar con Ayuda Visual (llevando)', 
    description: 'Suma números de un dígito con llevadas, usando dibujos.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.VISUAL_ARITHMETIC_1_DIGIT, 
    data: { totalStars: 5, operation: '+', maxOperandValue: 9, forceCarryOrBorrow: true },
    question: '¿Cuánto es en total (con llevada)?',
  },
  // 6. Sumas llevando, 2 sumandos hasta 2 dígitos
  { 
    id: 'g1-s2-e6', 
    title: 'Sumar Llevando (hasta 2 dígitos)', 
    description: 'Suma números de hasta dos dígitos, con llevadas.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { 
        totalStars: 10, 
        operationType: 'addition',
        minOperandValue: 1, maxOperandValue: 99,
        numOperands: 2,
    },
    question: 'Resuelve la suma con llevadas:',
  },
  // 7. Sumas llevando, tres sumandos de 1 dígito
  { 
    id: 'g1-s2-e7', 
    title: 'Sumar Llevando (3 sumandos, 1 dígito)', 
    description: 'Suma tres números de un dígito, con llevadas.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { 
        totalStars: 10, 
        operationType: 'addition',
        minOperandValue: 1, maxOperandValue: 9, 
        numOperands: 3,
    },
    question: 'Suma los tres números (con llevadas):',
  },
  // 8. Mismo, 3 sumandos 2 dígitos (Sumas llevando, 3 sumandos 2 dígitos)
  { 
    id: 'g1-s2-e8', 
    title: 'Sumar Llevando (3 sumandos, 2 dígitos)', 
    description: 'Suma tres números de dos dígitos, con llevadas.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { 
        totalStars: 10, 
        operationType: 'addition',
        minOperandValue: 10, maxOperandValue: 99,
        numOperands: 3,
    },
    question: 'Suma los tres números (con llevadas):',
  },
  // 9. Restas sin llevar, minuendo y sustraendo de 1 dígito con ayuda
  { 
    id: 'g1-s2-e9', 
    title: 'Restar con Ayuda Visual (1 dígito)', 
    description: 'Resta números de un dígito usando dibujos. Sin prestar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.VISUAL_ARITHMETIC_1_DIGIT, 
    data: { totalStars: 5, operation: '-', maxOperandValue: 9, ensureNoCarryOrBorrow: true },
    question: '¿Cuánto queda?',
  },
  // 10. Restas sin llevar, 1 dígito
  { 
    id: 'g1-s2-e10', 
    title: 'Restar Sin Prestar (1 dígito)', 
    description: 'Resta números de un dígito. Sin prestar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS, 
    data: { 
        totalStars: 10, 
        minOperand: 0, maxOperand: 9, 
        operationType: 'subtraction',
        generateOperands: () => generateNoBorrowSubtractionOperands(9)
    },
    question: 'Resuelve la resta:',
  },
  // 11. Mismo pero con minuendo de 2 dígitos y sustraendo de hasta 2 dígitos (Restas sin llevar)
  { 
    id: 'g1-s2-e11', 
    title: 'Restar Sin Prestar (2 dígitos)', 
    description: 'Resta números de hasta dos dígitos. Sin prestar.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { 
        totalStars: 10, 
        minOperand: 0, maxOperand: 99, 
        operationType: 'subtraction',
        generateOperands: () => generateNoBorrowSubtractionOperands(99)
    },
    question: 'Resuelve la resta:',
  },
  // 12. Restas llevando, minuendo de 2 dígitos y sustraendo de hasta 2 dígitos
  { 
    id: 'g1-s2-e12', 
    title: 'Restar Prestando (2 dígitos)', 
    description: 'Resta números de hasta dos dígitos, con llevadas (prestando).', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { 
        totalStars: 10, 
        operationType: 'subtraction',
        minOperandValue: 10, maxOperandValue: 99, 
    },
    question: 'Resuelve la resta (prestando):',
  },
];
