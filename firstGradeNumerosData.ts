
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';

// Specific exercises for First Grade - Numeros (s1)
// g1-s1-eX
export const firstGradeNumerosExercises: Exercise[] = [
  // count to 10
  { 
    id: 'g1-s1-e1', 
    title: 'Contar hasta 10', 
    description: 'Aprende a contar objetos hasta 10.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.CONTAR_ELEMENTOS, 
    data: { totalStars: 5, maxNumber: 10 }, // itemsToCount removed
    question: '¿Cuántos objetos hay?',
    content: 'Cuenta los objetos que aparecen en la pantalla.' // Fallback for generic display, less relevant now
  },
  // write to 10
  { 
    id: 'g1-s1-e2', 
    title: 'Escribir números hasta 10', 
    description: 'Escribe el número que se muestra en palabras.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 10 },
    question: '¿Qué número hay escrito?',
  },
  // compare to 10
  { 
    id: 'g1-s1-e3', 
    title: 'Comparar números hasta 10', 
    description: 'Usa <, =, > para comparar números hasta 10.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 10 },
    question: 'Compara los números:',
  },
  // count to 20
  { 
    id: 'g1-s1-e4', 
    title: 'Contar hasta 20', 
    description: 'Aprende a contar objetos hasta 20.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.CONTAR_ELEMENTOS, 
    data: { totalStars: 5, maxNumber: 20 }, // itemsToCount removed
    question: '¿Cuántos objetos ves?',
    content: 'Cuenta los objetos que aparecen en la pantalla hasta 20.'
  },
  // write to 20
  { 
    id: 'g1-s1-e5', 
    title: 'Escribir números hasta 20', 
    description: 'Escribe el número (en cifras) que se dice o muestra.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 20 },
    question: 'Escribe el número:',
  },
  // compare to 20
  { 
    id: 'g1-s1-e6', 
    title: 'Comparar números hasta 20', 
    description: 'Compara pares de números hasta el 20.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 20 },
    question: 'Elige el símbolo correcto:',
  },
  // write to 100
  { 
    id: 'g1-s1-e7', 
    title: 'Escribir números hasta 100', 
    description: 'Escribe números hasta el 100.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ESCRIBIR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 100 },
    question: 'Escribe el número en cifras:',
  },
  // compare to 100
  { 
    id: 'g1-s1-e8', 
    title: 'Comparar números hasta 100', 
    description: 'Usa los símbolos <, =, > para comparar números hasta 100.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_HASTA_10000,
    data: { totalStars: 10, minNumber: 0, maxNumber: 100 },
    question: '¿Cuál es el símbolo correcto?',
  },
  // compose a number using abacus up to 100
  { 
    id: 'g1-s1-e9', 
    title: 'Componer con Ábaco (hasta 100)', 
    description: 'Usa el ábaco para formar números hasta 100.', 
    iconName: 'OwlIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPONER_HASTA_10000_ABACO,
    data: { totalStars: 8, minNumber: 1, maxNumber: 100, placeValuesToShow: ['c', 'd', 'u'] }, 
    question: 'Forma el número en el ábaco:',
  },
  // compose a number up to 100 using words
  { 
    id: 'g1-s1-e10', 
    title: 'Componer con Palabras (hasta 100)', 
    description: 'Indica cuántas centenas, decenas y unidades tiene el número.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPONER_HASTA_10000_TEXTO,
    data: { totalStars: 10, minNumber: 1, maxNumber: 100, placeValuesToAsk: ['c', 'd', 'u'] }, 
    question: 'Descompón el número:',
  },
  // identify even and odds
  { 
    id: 'g1-s1-e11', 
    title: 'Pares e Impares', 
    description: 'Identifica si un número es par o impar (hasta 20).', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_PARES_IMPARES, 
    data: { totalStars: 10, maxNumber: 20 },
    question: '¿Este número es par o impar?',
    content: 'Observa el número y decide si es par o impar.'
  },
  // identify ordinals up to 5
  { 
    id: 'g1-s1-e12', 
    title: 'Ordinales hasta 5º', 
    description: 'Reconoce los números ordinales hasta el quinto.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_ORDINALES,
    data: { totalStars: 5, minCardinal: 1, maxCardinal: 5 },
    question: '¿Qué número ordinal es?',
  },
  // sort up to 5 numbers
  { 
    id: 'g1-s1-e13', 
    title: 'Ordenar números hasta 5', 
    description: 'Ordena una serie de hasta 5 números.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ORDENAR_NUMEROS_SIMPLE, 
    data: { totalStars: 5, count: 5, numberRange: [0, 20], sortOrder: 'asc' }, 
    question: 'Ordena los números de menor a mayor:',
    content: 'Arrastra los números para ordenarlos.'
  },
  // identify ordinals up to 10
  { 
    id: 'g1-s1-e14', 
    title: 'Ordinales hasta 10º', 
    description: 'Aprende los ordinales hasta el décimo.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_ORDINALES,
    data: { totalStars: 10, minCardinal: 1, maxCardinal: 10 },
    question: 'Identifica el ordinal:',
  },
  // sort up to 10 (now OrdenarNumerosSimple)
  { 
    id: 'g1-s1-e15', 
    title: 'Ordenar números hasta 10', 
    description: 'Ordena secuencias de hasta 5 números menores que 10.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ORDENAR_NUMEROS_SIMPLE, 
    data: { totalStars: 5, count: 5, numberRange: [0, 10], sortOrder: 'asc' }, // Adjusted count and numberRange
    question: 'Ordena la secuencia:',
    content: 'Coloca los números en el orden correcto.'
  },
  // add 1 digit numbers
  { 
    id: 'g1-s1-e16', 
    title: 'Sumar 1 Cifra', 
    description: 'Suma números de un dígito.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS, 
    data: { totalStars: 10, minOperand: 0, maxOperand: 9, operationType: 'addition' },
    question: 'Resuelve la suma:',
  },
  // subtract 1 digit numbers
  { 
    id: 'g1-s1-e17', 
    title: 'Restar 1 Cifra', 
    description: 'Resta números de un dígito.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 0, maxOperand: 9, operationType: 'subtraction' },
    question: 'Resuelve la resta:',
  },
  // add and subtract 1 digit numbers
  { 
    id: 'g1-s1-e18', 
    title: 'Sumar y Restar 1 Cifra', 
    description: 'Operaciones mixtas con números de un dígito.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 0, maxOperand: 9, operationType: 'mixed' },
    question: 'Resuelve la operación:',
  },
  // add and subtract up to 20
  { 
    id: 'g1-s1-e19', 
    title: 'Sumar y Restar hasta 20', 
    description: 'Operaciones con resultados hasta 20.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 1, maxOperand: 10, operationType: 'mixed' }, // max result will be 20 for sum, and within range for sub.
    question: 'Calcula:',
  },
  // add and subtract up to 100
  { 
    id: 'g1-s1-e20', 
    title: 'Sumar y Restar hasta 100', 
    description: 'Operaciones con números de hasta dos cifras.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS,
    data: { totalStars: 10, minOperand: 1, maxOperand: 99, operationType: 'mixed' },
    question: 'Resuelve:',
  },
  // add and sub with multiples of 10
  { 
    id: 'g1-s1-e21', 
    title: 'Sumar y Restar Decenas Enteras', 
    description: 'Opera con múltiplos de 10 (10, 20, 30...).', 
    iconName: 'OperationsIcon', 
    isLocked: false,
    componentType: ExerciseComponentType.CALCULA_MENTALMENTE, 
    data: { totalStars: 10, problemType: 'add_subtract_tens', tens: [10, 20, 30, 40, 50, 60, 70, 80, 90] },
    question: 'Calcula mentalmente:',
    content: 'Ej: 20 + 30, 50 - 10.'
  },
  // before and after with numbers < 10
  { 
    id: 'g1-s1-e22', 
    title: 'Anterior y Posterior (<10)', 
    description: 'Encuentra el número anterior y posterior a uno dado (menor que 10).', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.NUMERO_ANTERIOR_POSTERIOR, 
    data: { totalStars: 10, minNumber: 0, maxNumber: 9 }, // Central number range
    question: '¿Cuál es el anterior y el posterior?',
    content: 'Escribe el número que va antes y el que va después.'
  },
  // before and after with numbers < 50
  { 
    id: 'g1-s1-e23', 
    title: 'Anterior y Posterior (<50)', 
    description: 'Identifica el antecesor y sucesor de números menores que 50.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.NUMERO_ANTERIOR_POSTERIOR, 
    data: { totalStars: 10, minNumber: 0, maxNumber: 49 }, // Central number range
    question: 'Completa con el anterior y posterior:',
    content: 'Escribe el número que va antes y el que va después.'
  },
   // before and after with numbers < 100
  { 
    id: 'g1-s1-e24', 
    title: 'Anterior y Posterior (<100)', 
    description: 'Identifica el antecesor y sucesor de números menores que 100.', 
    iconName: 'NumbersIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.NUMERO_ANTERIOR_POSTERIOR, 
    data: { totalStars: 10, minNumber: 0, maxNumber: 99 }, // Central number range
    question: 'Completa con el anterior y posterior:',
    content: 'Escribe el número que va antes y el que va después.'
  },
  // double numbers up to 10
  { 
    id: 'g1-s1-e25', 
    title: 'El Doble (hasta 10)', 
    description: 'Calcula el doble de números del 1 al 10.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.CALCULA_MENTALMENTE,
    data: { totalStars: 10, problemType: 'double', minOperand: 1, maxOperand: 10 },
    question: 'Calcula el doble:',
  },
  // half numbers < 20
  { 
    id: 'g1-s1-e26', 
    title: 'La Mitad (pares < 20)', 
    description: 'Calcula la mitad de números pares menores que 20.', 
    iconName: 'OperationsIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.CALCULA_MENTALMENTE,
    data: { totalStars: 10, problemType: 'half', minOperand: 2, maxOperand: 18 }, 
    question: 'Calcula la mitad:',
  },
];
