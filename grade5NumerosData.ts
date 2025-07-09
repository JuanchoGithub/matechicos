import { Exercise, ExerciseComponentType } from './types';

// Ejercicios específicos para Quinto Grado - Números (s1)
// Este archivo es actualmente un marcador de posición. Los ejercicios se agregarán aquí.
export const fifthGradeNumerosExercises: Exercise[] = [
  {
    id: 'escribir_hasta_10000',
    title: 'Escribir números hasta 9,999,999',
    description: 'Practica la escritura de números grandes.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000,
  },
  {
    id: 'comparar_hasta_10000',
    title: 'Comparar números grandes',
    description: 'Compara números de hasta 7 cifras.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { minNumber: 100000, maxNumber: 9999999 },
  },
  {
    id: 'componer_hasta_10000_texto',
    title: 'Componer números en texto',
    description: 'Descompón y escribe números en palabras.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COMPONER_HASTA_10000_TEXTO,
  },
  {
    id: 'decimales_avanzado_g5',
    title: 'Decimales avanzado',
    description: 'Trabaja con decimales complejos.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.DECIMALES_AVANZADO_G5,
  },
  {
    id: 'comparar_decimales_g5',
    title: 'Comparar decimales',
    description: 'Compara números decimales.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COMPARAR_DECIMALES_G5,
  },
  {
    id: 'ordenar_decimales_g5',
    title: 'Ordenar decimales',
    description: 'Ordena números decimales.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.ORDENAR_DECIMALES_G5,
  },
  {
    id: 'redondear_decimales_g5',
    title: 'Redondear decimales',
    description: 'Redondea números decimales.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.REDONDEAR_DECIMALES_G5,
  },
  {
    id: 'fraccion_de_cantidad_g5',
    title: 'Fracción de una cantidad',
    description: 'Calcula fracciones de cantidades.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.FRACCION_DE_CANTIDAD_G5,
  },
  {
    id: 'primos_compuestos_g5',
    title: 'Números primos y compuestos',
    description: 'Identifica números primos y compuestos.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PRIMOS_COMPUESTOS_G5,
  },
  {
    id: 'reglas_divisibilidad_g5',
    title: 'Reglas de divisibilidad',
    description: 'Aprende reglas de divisibilidad.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.REGLAS_DIVISIBILIDAD_G5,
    data: {
      totalStars: 10,
      numberRange: [10, 1000],
      challenges: [] // You can add custom challenges here if desired
    },
  },
  {
    id: 'mcd_mcm_g5',
    title: 'MCD y MCM',
    description: 'Máximo común divisor y mínimo común múltiplo.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MCD_MCM_G5,
  },
  {
    id: 'numeros_enteros_intro_g5',
    title: 'Introducción a los números enteros',
    description: 'Conoce los números enteros.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.NUMEROS_ENTEROS_INTRO_G5,
  },
  {
    id: 'simplificar_fracciones_g5',
    title: 'Simplificar fracciones',
    description: 'Simplifica fracciones a su mínima expresión.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.SIMPLIFICAR_FRACCIONES_G5,
    data: {
      // Precompute all possible (numerator, denominator) pairs that are not coprime
      challenges: (() => {
        const denominators = [4, 5, 6, 8, 9, 10, 12, 15, 16];
        const pool: { numerator: number; denominator: number }[] = [];
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        denominators.forEach(denominator => {
          for (let numerator = 2; numerator < denominator; numerator++) {
            if (gcd(numerator, denominator) > 1) {
              pool.push({ numerator, denominator });
            }
          }
        });
        // Efficiently pick 12 unique random challenges
        const selected: { numerator: number; denominator: number }[] = [];
        const usedIndices = new Set<number>();
        while (selected.length < 12 && usedIndices.size < pool.length) {
          const idx = Math.floor(Math.random() * pool.length);
          if (!usedIndices.has(idx)) {
            usedIndices.add(idx);
            selected.push(pool[idx]);
          }
        }
        return selected.map(({ numerator, denominator }) => {
          const factor = gcd(numerator, denominator);
          const correctNumerator = numerator / factor;
          const correctDenominator = denominator / factor;
          const options = [
            { fraction: { numerator: correctNumerator, denominator: correctDenominator }, isCorrect: true },
            { fraction: { numerator, denominator }, isCorrect: false },
            { fraction: { numerator: correctNumerator * 2, denominator: correctDenominator * 2 }, isCorrect: false }
          ].sort(() => Math.random() - 0.5);
          return {
            fractionToSimplify: { numerator, denominator },
            correctSimplifiedFraction: { numerator: correctNumerator, denominator: correctDenominator },
            options,
            visualType: 'bar'
          };
        });
      })()
    },
  },
  {
    id: 'numeros_mixtos_avanzado_g5',
    title: 'Números mixtos avanzado',
    description: 'Trabaja con números mixtos.',
    iconName: 'NumbersIcon',
    isLocked: false,
    componentType: ExerciseComponentType.NUMEROS_MIXTOS_AVANZADO_G5,
    data: {
      challenges: generateMixedNumberChallenges(20)
    },
  },
];

// --- Challenge generator for Números Mixtos Avanzado G5 ---
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function generateMixedToImproper(): { question: string, correct: string, distractors: string[] } {
  const whole = getRandomInt(1, 9);
  let denominator = getRandomInt(2, 9);
  let numerator = getRandomInt(1, denominator - 1);
  // Avoid trivial cases
  if (gcd(numerator, denominator) > 1) {
    numerator = 1;
  }
  const improperNum = whole * denominator + numerator;
  const correct = `${improperNum}/${denominator}`;
  // Distractors
  const d1 = `${whole * denominator + getRandomInt(1, denominator - 1)}/${denominator}`;
  const d2 = `${numerator}/${denominator}`;
  return {
    question: `${whole} ${numerator}/${denominator}`,
    correct,
    distractors: [d1 !== correct ? d1 : `${improperNum + 1}/${denominator}`, d2 !== correct ? d2 : `${numerator + 1}/${denominator}`]
  };
}

function generateImproperToMixed(): { question: string, correct: string, distractors: string[] } {
  const denominator = getRandomInt(2, 9);
  const whole = getRandomInt(1, 9);
  const numerator = getRandomInt(1, denominator - 1);
  const improperNum = whole * denominator + numerator;
  const correct = `${whole} ${numerator}/${denominator}`;
  // Distractors
  const d1 = `${whole + 1} ${numerator}/${denominator}`;
  const d2 = `${whole} ${getRandomInt(1, denominator - 1)}/${denominator}`;
  return {
    question: `${improperNum}/${denominator}`,
    correct,
    distractors: [d1 !== correct ? d1 : `${whole + 2} ${numerator}/${denominator}`, d2 !== correct ? d2 : `${whole} ${numerator + 1}/${denominator}`]
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateMixedNumberChallenges(count: number) {
  const challenges = [];
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      const { question, correct, distractors } = generateMixedToImproper();
      challenges.push({
        question,
        type: 'mixed_to_improper',
        options: shuffleArray([correct, ...distractors]),
        correctAnswer: correct
      });
    } else {
      const { question, correct, distractors } = generateImproperToMixed();
      challenges.push({
        question,
        type: 'improper_to_mixed',
        options: shuffleArray([correct, ...distractors]),
        correctAnswer: correct
      });
    }
  }
  return challenges;
}
