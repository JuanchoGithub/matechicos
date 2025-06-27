
import { Exercise, ExerciseComponentType, OriginalIconName, OperacionesCombinadasG5Challenge, OperarFraccionesHeterogeneasChallenge, MultiplicarFraccionesChallenge, DividirFraccionesChallenge, PotenciasChallenge } from './types';

export const fifthGradeOperacionesExercises: Exercise[] = [
  {
    id: 'g5-s2-e1',
    title: 'Mega Operaciones con Enteros',
    description: 'Resuelve las cuatro operaciones básicas con números enteros de varias cifras.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COLUMNAR_OPERATION, // Reusing existing component with different data
    data: {
      totalStars: 10,
      operationType: 'mixed', // Let the component handle choosing sum or subtraction
      minOperandValue: 10000,
      maxOperandValue: 999999,
      numOperands: 2,
    },
    question: 'Resuelve la operación:',
  },
  {
    id: 'g5-s2-e2',
    title: 'Sumando y Restando Fracciones Heterogéneas',
    description: 'Aprende a sumar y restar fracciones que tienen diferentes denominadores.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.OPERAR_FRACCIONES_HETEROGENEAS_G5,
    data: { 
        totalStars: 10,
        challenges: [
            { fractionA: {numerator: 1, denominator: 2}, fractionB: {numerator: 1, denominator: 3}, operation: '+', correctResult: {numerator: 5, denominator: 6} },
            { fractionA: {numerator: 3, denominator: 4}, fractionB: {numerator: 1, denominator: 6}, operation: '-', correctResult: {numerator: 7, denominator: 12} },
            { fractionA: {numerator: 2, denominator: 5}, fractionB: {numerator: 1, denominator: 4}, operation: '+', correctResult: {numerator: 13, denominator: 20} },
            { fractionA: {numerator: 5, denominator: 6}, fractionB: {numerator: 2, denominator: 3}, operation: '-', correctResult: {numerator: 1, denominator: 6} },
            { fractionA: {numerator: 1, denominator: 4}, fractionB: {numerator: 3, denominator: 8}, operation: '+', correctResult: {numerator: 5, denominator: 8} },
            { fractionA: {numerator: 7, denominator: 8}, fractionB: {numerator: 1, denominator: 2}, operation: '-', correctResult: {numerator: 3, denominator: 8} },
            { fractionA: {numerator: 2, denominator: 3}, fractionB: {numerator: 1, denominator: 5}, operation: '+', correctResult: {numerator: 13, denominator: 15} },
            { fractionA: {numerator: 9, denominator: 10}, fractionB: {numerator: 3, denominator: 5}, operation: '-', correctResult: {numerator: 3, denominator: 10} },
            { fractionA: {numerator: 1, denominator: 6}, fractionB: {numerator: 3, denominator: 4}, operation: '+', correctResult: {numerator: 11, denominator: 12} },
            { fractionA: {numerator: 4, denominator: 5}, fractionB: {numerator: 2, denominator: 3}, operation: '-', correctResult: {numerator: 2, denominator: 15} },
        ] as OperarFraccionesHeterogeneasChallenge[]
    },
    question: 'Calcula el resultado de la operación con fracciones:',
  },
  {
    id: 'g5-s2-e3',
    title: 'Multiplicando Fracciones',
    description: 'Multiplica fracciones por números enteros y fracciones por otras fracciones.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MULTIPLICAR_FRACCIONES_G5,
    data: { 
        totalStars: 10,
        challenges: [
            // Fracción x Entero
            { factor1: {numerator: 1, denominator: 4}, factor2: 3, correctResult: {numerator: 3, denominator: 4} },
            { factor1: 5, factor2: {numerator: 2, denominator: 3}, correctResult: {numerator: 10, denominator: 3} },
            { factor1: {numerator: 3, denominator: 8}, factor2: 2, correctResult: {numerator: 3, denominator: 4} }, // 6/8 -> 3/4
            // Fracción x Fracción
            { factor1: {numerator: 1, denominator: 2}, factor2: {numerator: 1, denominator: 3}, correctResult: {numerator: 1, denominator: 6} },
            { factor1: {numerator: 2, denominator: 3}, factor2: {numerator: 3, denominator: 4}, correctResult: {numerator: 1, denominator: 2} }, // 6/12 -> 1/2
            { factor1: {numerator: 3, denominator: 5}, factor2: {numerator: 1, denominator: 2}, correctResult: {numerator: 3, denominator: 10} },
            { factor1: {numerator: 4, denominator: 5}, factor2: {numerator: 5, denominator: 6}, correctResult: {numerator: 2, denominator: 3} }, // 20/30 -> 2/3
            { factor1: {numerator: 3, denominator: 2}, factor2: {numerator: 1, denominator: 3}, correctResult: {numerator: 1, denominator: 2} }, // 3/6 -> 1/2
            { factor1: {numerator: 5, denominator: 8}, factor2: {numerator: 2, denominator: 3}, correctResult: {numerator: 5, denominator: 12} }, // 10/24 -> 5/12
            { factor1: {numerator: 2, denominator: 7}, factor2: 7, correctResult: {numerator: 2, denominator: 1} }, // 14/7 -> 2
        ] as MultiplicarFraccionesChallenge[]
    },
    question: 'Resuelve la multiplicación:',
  },
  {
    id: 'g5-s2-e4',
    title: 'Iniciación a la División de Fracciones',
    description: 'Divide números enteros, fracciones unitarias y otras fracciones.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.DIVIDIR_FRACCIONES_G5,
    data: { 
        totalStars: 10,
        challenges: [
            // Entero / Fracción Unitaria
            { dividend: 3, divisor: { numerator: 1, denominator: 4 }, correctResult: { numerator: 12, denominator: 1 } },
            { dividend: 5, divisor: { numerator: 1, denominator: 2 }, correctResult: { numerator: 10, denominator: 1 } },
            // Fracción Unitaria / Entero
            { dividend: { numerator: 1, denominator: 2 }, divisor: 3, correctResult: { numerator: 1, denominator: 6 } },
            { dividend: { numerator: 1, denominator: 5 }, divisor: 2, correctResult: { numerator: 1, denominator: 10 } },
            // Fracción / Fracción
            { dividend: { numerator: 3, denominator: 4 }, divisor: { numerator: 1, denominator: 2 }, correctResult: { numerator: 3, denominator: 2 } },
            { dividend: { numerator: 2, denominator: 3 }, divisor: { numerator: 5, denominator: 6 }, correctResult: { numerator: 4, denominator: 5 } },
            { dividend: { numerator: 1, denominator: 2 }, divisor: { numerator: 1, denominator: 4 }, correctResult: { numerator: 2, denominator: 1 } },
            { dividend: { numerator: 4, denominator: 5 }, divisor: { numerator: 2, denominator: 5 }, correctResult: { numerator: 2, denominator: 1 } },
            { dividend: { numerator: 5, denominator: 6 }, divisor: { numerator: 1, denominator: 3 }, correctResult: { numerator: 5, denominator: 2 } },
            { dividend: { numerator: 3, denominator: 8 }, divisor: { numerator: 3, denominator: 4 }, correctResult: { numerator: 1, denominator: 2 } },
        ] as DividirFraccionesChallenge[]
    },
    question: 'Resuelve la división:',
  },
  {
    id: 'g5-s2-e5',
    title: 'Dominando la Suma y Resta de Decimales',
    description: 'Suma y resta números decimales hasta las milésimas con precisión.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COLUMNAR_OPERATION_DECIMAL,
    data: { 
      totalStars: 10,
      operationType: 'mixed',
      minOperandValue: 0.1,
      maxOperandValue: 999.99,
      maxOperands: 2,
      maxDecimalPlaces: 2,
      forceCarryOrBorrow: true,
    },
    question: 'Resuelve la operación con decimales:',
  },
  {
    id: 'g5-s2-e6',
    title: 'Multiplicación con Números Decimales',
    description: 'Multiplica números decimales entre sí y por números enteros.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MULTIPLICAR_DECIMALES_G5,
    data: { 
        totalStars: 10,
        minFactor1: 0.1,
        maxFactor1: 99.9,
        maxDecimalPlaces1: 2,
        minFactor2: 0.1,
        maxFactor2: 9.9,
        maxDecimalPlaces2: 1,
     },
    question: 'Resuelve la multiplicación decimal:',
  },
  {
    id: 'g5-s2-e7',
    title: 'División de Decimales por Enteros',
    description: 'Divide números decimales por números enteros, obteniendo cocientes decimales.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.DIVIDIR_DECIMALES_POR_ENTERO_G5,
    data: { 
      totalStars: 10,
     },
    question: 'Calcula la división:',
  },
  {
    id: 'g5-s2-e8',
    title: 'El Orden Importa: Jerarquía de Operaciones',
    description: 'Resuelve cálculos combinados utilizando correctamente la jerarquía y los paréntesis.',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.OPERACIONES_COMBINADAS_G5,
    data: { 
        totalStars: 10,
        challenges: [
            { expression: "(3 + 5) * 2", correctAnswer: 16 },
            { expression: "10 - 2 * 4", correctAnswer: 2 },
            { expression: "20 / 4 + 1", correctAnswer: 6 },
            { expression: "7 + 3 * 3", correctAnswer: 16 },
            { expression: "(15 - 5) / 2", correctAnswer: 5 },
            { expression: "8 * 2 + 4", correctAnswer: 20 },
            { expression: "18 - 12 / 3", correctAnswer: 14 },
            { expression: "5 * (4 + 2)", correctAnswer: 30 },
            { expression: "24 / (3 * 2)", correctAnswer: 4 },
            { expression: "9 + 2 - 3 * 2", correctAnswer: 5 },
            { expression: "30 / 5 - 2", correctAnswer: 4 },
            { expression: "(10 + 6) / (2 + 2)", correctAnswer: 4 }
        ] as OperacionesCombinadasG5Challenge[]
    },
    question: 'Resuelve respetando la jerarquía:',
  },
  {
    id: 'g5-s2-e9',
    title: 'Potencias: Cuadrados y Cubos',
    description: 'Calcula el valor de números elevados al cuadrado (²) y al cubo (³).',
    iconName: 'OperationsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.POTENCIAS_CUADRADOS_CUBOS_G5,
    data: {
      totalStars: 10,
      baseRangeForSquare: [2, 15],
      baseRangeForCube: [2, 10],
    },
    question: 'Calcula la potencia:',
  },
];
