
import { Exercise, ExerciseComponentType, RomanNumeralChallenge, PlaceValueKey } from './types';

// Specific exercises for Fourth Grade - Numeros (s1)
export const fourthGradeNumerosExercises: Exercise[] = [
  { 
    id: 'g4-s1-e1', title: 'Leer y Escribir hasta 1.000.000', 
    description: 'Escribe números hasta un millón.', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000,
    data: { totalStars: 10, minNumber: 10000, maxNumber: 999999 },
    question: 'Escribe el número en cifras:',
  },
  { 
    id: 'g4-s1-e2', title: 'Comparar Números Grandes', 
    description: 'Compara números hasta un millón.', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { totalStars: 10, minNumber: 10000, maxNumber: 999999 },
    question: 'Compara los números:',
  },
  { 
    id: 'g4-s1-e3', title: 'Valor Posicional (CMil, DMil)', 
    description: 'Unidades, decenas, centenas, UM, DMil, CMil.', 
    iconName: 'NumbersIcon', isLocked: false, 
    componentType: ExerciseComponentType.COMPONER_HASTA_10000_TEXTO,
    data: { totalStars: 10, minNumber: 10000, maxNumber: 999999, placeValuesToAsk: ['cmil','dmil','um', 'c', 'd', 'u'] as PlaceValueKey[] },
    question: 'Indica el valor de cada cifra:',
  },
   { 
    id: 'g4-s1-e4', title: 'Descomposición Polinómica', 
    description: 'Ej: 345.678 = 300.000 + 40.000 + ...', 
    iconName: 'NumbersIcon', isLocked: false, 
    componentType: ExerciseComponentType.DESCOMPOSICION_POLINOMICA_G4, 
    data: { totalStars: 10, minNumber: 1000, maxNumber: 999999 },
    question: 'Descompón el número en forma de suma:',
  },
  { 
    id: 'g4-s1-e5', title: 'Redondeo Avanzado (UM y DM)', 
    description: 'Redondea a la unidad de mil y decena de mil.', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.APROXIMAR_NUMERO,
    data: { totalStars: 10, minNumber: 1000, maxNumber: 199999, roundingUnits: [1000, 10000], roundingUnit: 1000 }, // Default to UM
    question: 'Redondea el número a la unidad de mil:', 
  },
  { 
    id: 'g4-s1-e6', title: 'Números Romanos (Básico)', 
    description: 'Lee y escribe números romanos básicos (I, V, X, L, C).', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.NUMEROS_ROMANOS_G4, 
    data: { 
        totalStars: 10, 
        challenges: [
            { numberAr: 4, numberRo: "IV", questionType: 'ar_to_ro', options: ["IV", "VI", "IIII", "V"], correctAnswer: "IV" },
            { numberAr: 9, numberRo: "IX", questionType: 'ar_to_ro', options: ["IX", "XI", "VIIII", "VX"], correctAnswer: "IX" },
            { numberAr: 19, numberRo: "XIX", questionType: 'ro_to_ar', options: ["19", "21", "18", "9"], correctAnswer: "19" },
            { numberAr: 35, numberRo: "XXXV", questionType: 'ar_to_ro', options: ["XXXV", "XXV", "XLV", "VVV"], correctAnswer: "XXXV" },
            { numberAr: 40, numberRo: "XL", questionType: 'ro_to_ar', options: ["40", "60", "39", "50"], correctAnswer: "40" },
            { numberAr: 50, numberRo: "L", questionType: 'ar_to_ro', options: ["L", "C", "XXXXX", "LL"], correctAnswer: "L" },
            { numberAr: 90, numberRo: "XC", questionType: 'ro_to_ar', options: ["90", "110", "80", "100"], correctAnswer: "90" },
            { numberAr: 100, numberRo: "C", questionType: 'ar_to_ro', options: ["C", "L", "D", "CC"], correctAnswer: "C" },
            { numberAr: 67, numberRo: "LXVII", questionType: 'ro_to_ar', options: ["67", "57", "77", "47"], correctAnswer: "67" },
            { numberAr: 88, numberRo: "LXXXVIII", questionType: 'ar_to_ro', options: ["LXXXVIII", "XXCII", "LXXIIX", "C-XII"], correctAnswer: "LXXXVIII" },
        ] as RomanNumeralChallenge[]
    },
    question: '¿Qué número es? / Escribe en romano:',
  },
  { 
    id: 'g4-s1-e7', title: 'Fracciones Equivalentes', 
    description: 'Identifica y genera fracciones equivalentes.', 
    iconName: 'BookOpenIcon', isLocked: false,
    componentType: ExerciseComponentType.FRACCIONES_EQUIVALENTES_G4, 
    data: { 
        totalStars: 6,
        challenges: [
            { baseFraction: { numerator: 1, denominator: 2 }, options: [ { fraction: { numerator: 2, denominator: 4 }, isCorrect: true }, { fraction: { numerator: 3, denominator: 5 }, isCorrect: false }, { fraction: { numerator: 1, denominator: 3 }, isCorrect: false } ], visualType: 'bar' },
            { baseFraction: { numerator: 1, denominator: 3 }, options: [ { fraction: { numerator: 2, denominator: 6 }, isCorrect: true }, { fraction: { numerator: 1, denominator: 4 }, isCorrect: false }, { fraction: { numerator: 3, denominator: 8 }, isCorrect: false } ], visualType: 'bar' },
            { baseFraction: { numerator: 2, denominator: 3 }, options: [ { fraction: { numerator: 4, denominator: 6 }, isCorrect: true }, { fraction: { numerator: 3, denominator: 4 }, isCorrect: false }, { fraction: { numerator: 2, denominator: 5 }, isCorrect: false } ], visualType: 'bar' },
            { baseFraction: { numerator: 3, denominator: 4 }, options: [ { fraction: { numerator: 6, denominator: 8 }, isCorrect: true }, { fraction: { numerator: 4, denominator: 5 }, isCorrect: false }, { fraction: { numerator: 3, denominator: 6 }, isCorrect: false } ], visualType: 'bar' },
            { baseFraction: { numerator: 1, denominator: 4 }, options: [ { fraction: { numerator: 2, denominator: 8 }, isCorrect: true }, { fraction: { numerator: 1, denominator: 5 }, isCorrect: false }, { fraction: { numerator: 3, denominator: 10 }, isCorrect: false } ], visualType: 'bar' },
            { baseFraction: { numerator: 2, denominator: 5 }, options: [ { fraction: { numerator: 4, denominator: 10 }, isCorrect: true }, { fraction: { numerator: 3, denominator: 7 }, isCorrect: false }, { fraction: { numerator: 2, denominator: 8 }, isCorrect: false } ], visualType: 'bar' },
        ] 
    },
    question: 'Encuentra la fracción equivalente:',
  },
  { 
    id: 'g4-s1-e8', title: 'Comparar Fracciones Simples', 
    description: 'Compara fracciones con igual y distinto denominador (casos simples).', 
    iconName: 'BookOpenIcon', isLocked: false,
    componentType: ExerciseComponentType.COMPARAR_FRACCIONES_G4, 
    data: { totalStars: 8,
            challenges: [
                { fractionA: {numerator: 1, denominator: 4}, fractionB: {numerator: 3, denominator: 4}, correctSymbol: '<'},
                { fractionA: {numerator: 2, denominator: 5}, fractionB: {numerator: 1, denominator: 5}, correctSymbol: '>'},
                { fractionA: {numerator: 1, denominator: 2}, fractionB: {numerator: 2, denominator: 4}, correctSymbol: '='},
                { fractionA: {numerator: 3, denominator: 8}, fractionB: {numerator: 1, denominator: 2}, correctSymbol: '<'}, 
                { fractionA: {numerator: 2, denominator: 3}, fractionB: {numerator: 5, denominator: 6}, correctSymbol: '<'}, 
                { fractionA: {numerator: 4, denominator: 5}, fractionB: {numerator: 7, denominator: 10}, correctSymbol: '>'},
            ]
    },
    question: '¿Qué fracción es mayor?',
  },
   { 
    id: 'g4-s1-e9', title: 'Operar Fracciones (Igual Denominador)', 
    description: 'Suma y resta fracciones con el mismo denominador.', 
    iconName: 'OperationsIcon', isLocked: false,
    componentType: ExerciseComponentType.OPERAR_FRACCIONES_IGUAL_DENOMINADOR_G4, 
    data: { totalStars: 10,
            challenges: [
                { fractionA: {numerator: 1, denominator: 5}, fractionB: {numerator: 2, denominator: 5}, operation: '+', correctResult: {numerator: 3, denominator: 5} },
                { fractionA: {numerator: 3, denominator: 7}, fractionB: {numerator: 2, denominator: 7}, operation: '+', correctResult: {numerator: 5, denominator: 7} },
                { fractionA: {numerator: 4, denominator: 9}, fractionB: {numerator: 2, denominator: 9}, operation: '-', correctResult: {numerator: 2, denominator: 9} },
                { fractionA: {numerator: 5, denominator: 8}, fractionB: {numerator: 1, denominator: 8}, operation: '-', correctResult: {numerator: 4, denominator: 8} }, // Could simplify to 1/2, but G4 might not expect simplification yet
                { fractionA: {numerator: 2, denominator: 6}, fractionB: {numerator: 3, denominator: 6}, operation: '+', correctResult: {numerator: 5, denominator: 6} },
            ]
    },
    question: 'Calcula el resultado:',
  },
  { 
    id: 'g4-s1-e10', title: 'Números Mixtos (Introducción)', 
    description: 'Reconoce números mixtos y conviértelos a fracciones impropias.', 
    iconName: 'BookOpenIcon', isLocked: false,
    componentType: ExerciseComponentType.NUMEROS_MIXTOS_INTRO_G4, 
    data: { totalStars: 8,
            challenges: [
                { question: "2 1/3", type: 'mixed_to_improper', options: ["7/3", "5/3", "2/3", "6/3"], correctAnswer: "7/3" },
                { question: "7/4", type: 'improper_to_mixed', options: ["1 3/4", "2 1/4", "1 1/4", "7 0/4"], correctAnswer: "1 3/4" },
                { question: "3 2/5", type: 'mixed_to_improper', options: ["17/5", "10/5", "7/5", "15/5"], correctAnswer: "17/5" },
                { question: "11/3", type: 'improper_to_mixed', options: ["3 2/3", "3 1/3", "2 5/3", "4 0/3"], correctAnswer: "3 2/3" },
            ] 
    },
    question: 'Convierte o identifica el número mixto:',
  },
  { 
    id: 'g4-s1-e11', title: 'Decimales: Décimos y Centésimos', 
    description: 'Relaciona fracciones decimales con su notación decimal (0.1, 0.01).', 
    iconName: 'BookOpenIcon', isLocked: false,
    componentType: ExerciseComponentType.DECIMALES_INTRO_FRACCION_G4, 
    data: { totalStars: 8,
            challenges: [
                { representation: "3/10", type: 'fraction_to_decimal', options: ["0.3", "3.0", "0.03", "0.30"], correctAnswer: "0.3" },
                { representation: "0.7", type: 'decimal_to_fraction', options: ["7/10", "7/100", "1/7", "0/7"], correctAnswer: "7/10" },
                { representation: "25/100", type: 'fraction_to_decimal', options: ["0.25", "2.5", "0.025", "25.0"], correctAnswer: "0.25" },
                { representation: "0.09", type: 'decimal_to_fraction', options: ["9/100", "9/10", "1/9", "0/9"], correctAnswer: "9/100" },
            ] 
    },
    question: '¿Cuál es el decimal/fracción equivalente?',
  },
   { 
    id: 'g4-s1-e12', title: 'Múltiplos y Divisores (Concepto)', 
    description: 'Identifica múltiplos y divisores de números pequeños.', 
    iconName: 'NumbersIcon', isLocked: false,
    componentType: ExerciseComponentType.MULTIPLOS_DIVISORES_CONCEPTO_G4, 
    data: { totalStars: 10,
            challenges: [
                { numberA: 15, numberB: 3, type: 'isMultiple', correctAnswer: true}, 
                { numberA: 20, numberB: 4, type: 'isDivisor', correctAnswer: true}, 
                { numberA: 17, numberB: 5, type: 'isMultiple', correctAnswer: false},
                { numberA: 25, numberB: 6, type: 'isDivisor', correctAnswer: false},
                { numberA: 30, numberB: 10, type: 'isMultiple', correctAnswer: true},
            ]
     },
    question: '¿Es múltiplo/divisor?',
  },
];
