

import { Exercise, ExerciseComponentType, OriginalIconName, PlaceValueKey, FractionChallenge, SimplificarFraccionChallenge, MixedNumberChallenge, McdMcmChallenge } from './types'; // Added McdMcmChallenge
import { shuffleArray } from './utils'; // Assuming utils.ts is in the root or accessible path

// --- Helper to generate simple challenges for placeholder components ---
const generatePlaceholderChallenges = (count: number, type: string) => 
    Array.from({length: count}, (_, i) => ({ id: `${type}_${i}`, text: `Desafío ${type} ${i+1}`, options: ["Opción A", "Opción B", "Opción C"], correctAnswer: "Opción A" }));


export const fifthGradeNumerosExercises: Exercise[] = [
  { 
    id: 'g5-s1-e1', title: 'Explorando los Millones', 
    description: 'Lee, escribe y compara números hasta millones.', 
    iconName: 'NumbersIcon', isLocked: false, 
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000, // Reusing, data will drive behavior
    data: { totalStars: 10, minNumber: 100000, maxNumber: 9999999, placeValuesToAsk: ['umillon', 'cmil', 'dmil', 'um', 'c', 'd', 'u'] as PlaceValueKey[] },
    question: 'Escribe el número en cifras:',
  },
  {
    id: 'g5-s1-e1b', title: 'Comparar Millones',
    description: 'Usa <, =, > para comparar números grandes.',
    iconName: 'BookOpenIcon', isLocked: false,
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { totalStars: 10, minNumber: 100000, maxNumber: 9999999},
    question: 'Compara los números:'
  },
  {
    id: 'g5-s1-e1c', title: 'Valor Posicional Millonario',
    description: 'Identifica el valor de las cifras en números millonarios.',
    iconName: 'OwlIcon', isLocked: false,
    componentType: ExerciseComponentType.COMPONER_HASTA_10000_TEXTO,
    data: { totalStars: 8, minNumber: 1000000, maxNumber: 9999999, placeValuesToAsk: ['umillon', 'cmil', 'dmil', 'um', 'c', 'd', 'u'] as PlaceValueKey[] },
    question: 'Descompón el número:',
  },
  { 
    id: 'g5-s1-e2', title: 'El Universo de los Decimales', 
    description: 'Trabaja con décimos, centésimos y milésimos.', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.DECIMALES_AVANZADO_G5, 
    data: { totalStars: 10, challenges: generatePlaceholderChallenges(10, "decimal_avanzado") },
    question: '¿Cuál es la representación correcta?',
  },
  { 
    id: 'g5-s1-e3', title: 'Simplificar Fracciones', 
    description: 'Encuentra la forma más simple de una fracción.', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.SIMPLIFICAR_FRACCIONES_G5,
    data: { 
        totalStars: 8, 
        challenges: [
            { fractionToSimplify: { numerator: 4, denominator: 6 }, options: [ {fraction: { numerator: 2, denominator: 3 }, isCorrect: true}, {fraction: { numerator: 1, denominator: 2 }, isCorrect: false}, {fraction: { numerator: 4, denominator: 6 }, isCorrect: false}, {fraction: { numerator: 3, denominator: 4 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 2, denominator: 3 }, visualType: 'bar' },
            { fractionToSimplify: { numerator: 8, denominator: 12 }, options: [ {fraction: { numerator: 2, denominator: 3 }, isCorrect: true}, {fraction: { numerator: 4, denominator: 6 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 2 }, isCorrect: false}, {fraction: { numerator: 3, denominator: 4 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 2, denominator: 3 }, visualType: 'bar' },
            { fractionToSimplify: { numerator: 5, denominator: 10 }, options: [ {fraction: { numerator: 1, denominator: 2 }, isCorrect: true}, {fraction: { numerator: 2, denominator: 5 }, isCorrect: false}, {fraction: { numerator: 5, denominator: 10 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 5 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 1, denominator: 2 }, visualType: 'bar' },
            { fractionToSimplify: { numerator: 9, denominator: 15 }, options: [ {fraction: { numerator: 3, denominator: 5 }, isCorrect: true}, {fraction: { numerator: 2, denominator: 3 }, isCorrect: false}, {fraction: { numerator: 9, denominator: 15 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 2 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 3, denominator: 5 } },
            { fractionToSimplify: { numerator: 6, denominator: 18 }, options: [ {fraction: { numerator: 1, denominator: 3 }, isCorrect: true}, {fraction: { numerator: 2, denominator: 6 }, isCorrect: false}, {fraction: { numerator: 3, denominator: 9 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 2 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 1, denominator: 3 } },
            { fractionToSimplify: { numerator: 10, denominator: 25 }, options: [ {fraction: { numerator: 2, denominator: 5 }, isCorrect: true}, {fraction: { numerator: 1, denominator: 5 }, isCorrect: false}, {fraction: { numerator: 10, denominator: 25 }, isCorrect: false}, {fraction: { numerator: 5, denominator: 10 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 2, denominator: 5 } },
            { fractionToSimplify: { numerator: 14, denominator: 21 }, options: [ {fraction: { numerator: 2, denominator: 3 }, isCorrect: true}, {fraction: { numerator: 7, denominator: 10 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 3 }, isCorrect: false}, {fraction: { numerator: 14, denominator: 21 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 2, denominator: 3 } },
            { fractionToSimplify: { numerator: 12, denominator: 16 }, options: [ {fraction: { numerator: 3, denominator: 4 }, isCorrect: true}, {fraction: { numerator: 6, denominator: 8 }, isCorrect: false}, {fraction: { numerator: 1, denominator: 2 }, isCorrect: false}, {fraction: { numerator: 2, denominator: 3 }, isCorrect: false} ], correctSimplifiedFraction: { numerator: 3, denominator: 4 } },
        ] as SimplificarFraccionChallenge[]
    },
    question: 'Encuentra la forma más simple de la fracción:',
  },
  { 
    id: 'g5-s1-e4', title: 'Números Mixtos y Fracciones Impropias (Avanzado)', 
    description: 'Convierte entre fracciones impropias y números mixtos (valores mayores).', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.NUMEROS_MIXTOS_AVANZADO_G5, 
    data: { 
        totalStars: 10, 
        challenges: [
            { question: "4 2/5", type: 'mixed_to_improper', options: ["22/5", "20/5", "18/5", "24/5"], correctAnswer: "22/5" },
            { question: "17/3", type: 'improper_to_mixed', options: ["5 2/3", "5 1/3", "6 1/3", "4 5/3"], correctAnswer: "5 2/3" },
            { question: "2 7/8", type: 'mixed_to_improper', options: ["23/8", "16/8", "25/8", "20/8"], correctAnswer: "23/8" },
            { question: "31/6", type: 'improper_to_mixed', options: ["5 1/6", "5 5/6", "4 7/6", "6 1/6"], correctAnswer: "5 1/6" },
            { question: "1 5/12", type: 'mixed_to_improper', options: ["17/12", "12/12", "10/12", "20/12"], correctAnswer: "17/12" },
            { question: "29/4", type: 'improper_to_mixed', options: ["7 1/4", "7 0/4", "6 5/4", "8 1/4"], correctAnswer: "7 1/4" },
            { question: "5 3/7", type: 'mixed_to_improper', options: ["38/7", "35/7", "30/7", "40/7"], correctAnswer: "38/7" },
            { question: "43/5", type: 'improper_to_mixed', options: ["8 3/5", "8 2/5", "7 8/5", "9 3/5"], correctAnswer: "8 3/5" },
            { question: "3 5/9", type: 'mixed_to_improper', options: ["32/9", "27/9", "30/9", "35/9"], correctAnswer: "32/9" },
            { question: "50/8", type: 'improper_to_mixed', options: ["6 2/8", "6 0/8", "5 10/8", "7 2/8"], correctAnswer: "6 2/8" }, // Could be 6 1/4
        ] as MixedNumberChallenge[]
    },
    question: 'Convierte o identifica:',
  },
  { 
    id: 'g5-s1-e5', title: 'Fracción de una Cantidad (Nivel Experto)', 
    description: 'Calcula la fracción de números enteros mayores.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.FRACCION_DE_CANTIDAD_G5, 
    data: { totalStars: 10, challenges: generatePlaceholderChallenges(10, "fraccion_cantidad") },
    question: 'Calcula la fracción de la cantidad:',
  },
  { 
    id: 'g5-s1-e6', title: 'Detectives de Primos y Compuestos', 
    description: 'Identifica números primos y compuestos.', 
    iconName: 'NumbersIcon', isLocked: false, 
    componentType: ExerciseComponentType.PRIMOS_COMPUESTOS_G5, 
    data: { totalStars: 15, numberRange: [2, 100] },
    question: '¿Este número es primo o compuesto?',
  },
  { 
    id: 'g5-s1-e7', title: 'Las Pistas de la Divisibilidad', 
    description: 'Usa reglas de divisibilidad (2, 3, 5, 9, 10).', 
    iconName: 'BookOpenIcon', isLocked: false, 
    componentType: ExerciseComponentType.REGLAS_DIVISIBILIDAD_G5, 
    data: { totalStars: 10, numberRange: [10, 1000] },
    question: '¿Es divisible por...?',
  },
  { 
    id: 'g5-s1-e8', title: 'Buscando Factores y Múltiplos (MCD y mcm)', 
    description: 'Encuentra M.C.D. y m.c.m.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MCD_MCM_G5, 
    data: { 
        totalStars: 8, 
        minNum: 4, 
        maxNum: 60,
        challenges: [
            { numbers: [12, 18], type: 'mcd', correctAnswer: 6 },
            { numbers: [8, 12], type: 'mcm', correctAnswer: 24 },
            { numbers: [20, 30], type: 'mcd', correctAnswer: 10 },
            { numbers: [9, 15], type: 'mcm', correctAnswer: 45 },
            { numbers: [24, 36], type: 'mcd', correctAnswer: 12 },
            { numbers: [7, 5], type: 'mcm', correctAnswer: 35 },
            { numbers: [40, 50], type: 'mcd', correctAnswer: 10 },
            { numbers: [10, 14], type: 'mcm', correctAnswer: 70 },
        ] as McdMcmChallenge[]
    },
    question: 'Calcula el M.C.D. o m.c.m.:',
  },
  { 
    id: 'g5-s1-e9', title: 'Viaje a los Números Enteros', 
    description: 'Compara números positivos y negativos en la recta numérica.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.NUMEROS_ENTEROS_INTRO_G5, 
    data: { 
      totalStars: 10,
      numberRange: [-20, 20] 
    },
    question: 'Compara los números enteros:',
  },
];
