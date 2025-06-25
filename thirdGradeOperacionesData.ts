
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';

// Specific exercises for Third Grade - Operaciones (s2)
export const thirdGradeOperacionesExercises: Exercise[] = [
    {
      id: 'g3-s2-e1',
      title: 'Sumas llevando. Tres sumandos hasta 3 dígitos.',
      description: 'Sumas con llevadas y tres números de hasta 3 dígitos.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.COLUMNAR_OPERATION, // Updated type
      data: { 
        totalStars: 10, 
        operationType: 'addition',
        minOperandValue: 1, 
        maxOperandValue: 999, 
        numOperands: 3 
      },
      question: 'Resuelve la suma con llevadas:',
      content: 'Coloca los números y suma, atendiendo a las llevadas. Ingresa el resultado cifra por cifra.'
    },
    {
      id: 'g3-s2-e2',
      title: 'Restas llevando. Minuendo y sustraendo de tres dígitos.',
      description: 'Restas con llevadas usando números de hasta 3 dígitos.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.COLUMNAR_OPERATION, // Updated type
      data: { 
        totalStars: 10, 
        operationType: 'subtraction',
        minOperandValue: 100, 
        maxOperandValue: 999,
        numOperands: 2 // Subtraction always has 2 operands (minuend, subtrahend)
      },
      question: 'Resuelve la resta con llevadas:',
      content: 'Coloca los números y resta, atendiendo a las llevadas. Ingresa el resultado cifra por cifra.'
    },
    {
      id: 'g3-s2-e3',
      title: 'Multiplicación: 1 dígito x 1 dígito (1-5)',
      description: 'Multiplica un número de 1 dígito por otro entre 1 y 5.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: 1, multiplierDigitCount: 1, multiplierRange: [1, 5], multiplicandRange: [1,9]},
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa el producto.'
    },
    {
      id: 'g3-s2-e4',
      title: 'Multiplicación: 1 dígito x 1 dígito (6-9)',
      description: 'Multiplica un número de 1 dígito por otro entre 6 y 9.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: 1, multiplierDigitCount: 1, multiplierRange: [6, 9], multiplicandRange: [1,9] },
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa el producto.'
    },
    {
      id: 'g3-s2-e5',
      title: 'Multiplicación: 2 dígitos x 1 dígito (0-5)',
      description: 'Multiplica un número de 2 dígitos por otro entre 0 y 5.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: 2, multiplierDigitCount: 1, multiplierRange: [0, 5] },
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa el producto.'
    },
    {
      id: 'g3-s2-e6',
      title: 'Multiplicación: 2 dígitos x 1 dígito (0-9)',
      description: 'Multiplica un número de 2 dígitos por otro entre 0 y 9.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: 2, multiplierDigitCount: 1, multiplierRange: [0, 9] },
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa el producto.'
    },
    {
      id: 'g3-s2-e7',
      title: 'Multiplicación: 2 dígitos x 2 dígitos',
      description: 'Multiplica un número de 2 dígitos por otro de 2 dígitos.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: 2, multiplierDigitCount: 2 },
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa los productos parciales y el producto final.'
    },
    {
      id: 'g3-s2-e8',
      title: 'Multiplicación: 2/3 dígitos x 2 dígitos',
      description: 'Multiplica un número de 2 o 3 dígitos por uno de 2 dígitos.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
      data: { totalStars: 10, multiplicandDigitCount: [2, 3], multiplierDigitCount: 2 }, // Use array for random choice
      question: 'Resuelve la multiplicación en columna:',
      content: 'Ingresa los productos parciales y el producto final.'
    },
    {
      id: 'g3-s2-e9',
      title: 'Divisiones por un dígito. Dividendo de uno o dos dígitos.',
      description: 'Iniciación a la división con resultados exactos.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.DIVISION_SIMPLE,
      data: { totalStars: 10, minDivisor: 2, maxDivisor: 9, maxDividendDigits: 2 },
      question: 'Resuelve la división:',
      content: 'Encuentra el cociente de la división exacta.'
    },
    {
      id: 'g3-s2-e10',
      title: 'División larga: Divisor 1 dígito, Dividendo 2 dígitos',
      description: 'Practica la división larga con dividendos de dos cifras. Divisiones exactas.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.DIVISION_LARGA,
      data: { totalStars: 10, dividendDigitCount: 2, divisorDigitCount: 1, exactDivision: true },
      question: 'Resuelve la división usando el método de la caja:',
      content: 'Completa cada paso de la división larga.'
    },
    {
      id: 'g3-s2-e11',
      title: 'División larga: Divisor 1 dígito, Dividendo 3 dígitos',
      description: 'Avanza en la división larga con dividendos de tres cifras. Divisiones exactas.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.DIVISION_LARGA,
      data: { totalStars: 10, dividendDigitCount: 3, divisorDigitCount: 1, exactDivision: true },
      question: 'Resuelve la división usando el método de la caja:',
      content: 'Completa cada paso de la división larga.'
    },
    {
      id: 'g3-s2-e12',
      title: 'División larga: Divisor 1 dígito, Dividendo 4 dígitos',
      description: 'Domina la división larga con dividendos de cuatro cifras. Divisiones exactas.',
      iconName: 'OperationsIcon',
      isLocked: false,
      componentType: ExerciseComponentType.DIVISION_LARGA,
      data: { totalStars: 10, dividendDigitCount: 4, divisorDigitCount: 1, exactDivision: true },
      question: 'Resuelve la división usando el método de la caja:',
      content: 'Completa cada paso de la división larga.'
    },
];
