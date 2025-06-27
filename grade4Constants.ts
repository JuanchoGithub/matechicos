
import { SubjectId, Exercise, ExerciseComponentType, OriginalIconName, FractionEquivalentChallenge, CompareFractionChallenge, OperateFractionChallenge, MixedNumberChallenge, DecimalIntroChallenge, RomanNumeralChallenge, MultiplosDivisoresChallenge, AreaCalculationChallenge, ConversionUnidadesChallenge, TiempoTranscurridoChallenge, VolumenCubosUnitariosChallenge, DiagonalChallenge, NetChallenge, TransformationChallenge, PieChartChallenge, PieChartQuestion, ExperimentoAleatorioChallenge, PrediccionProbabilidadChallenge, DependenciaSucesosChallenge, MeanCalculationChallenge, ModeRangeChallenge, MedirAngulosTransportadorG4Challenge, LinePlotChallengeG4, LinePlotPointG4, LinePlotQuestionG4, FrequencyTableChallengeG4, CreateBarGraphChallengeG4, BarGraphCategoryDataG4, FinanceChallengeG5, FraccionCantidadChallenge, PlaceValueKey } from './types';
import { GradeExerciseData } from './grade1Constants'; 
import { 
    PentagonoRegularSVG, HexagonoRegularSVG, HeptagonoRegularSVG, OctagonoRegularSVG, EneagonoRegularSVG, DecagonoRegularSVG,
    NetCuboSVG, NetPrismaRectSVG, NetPiramideCuadrSVG,
    FShapeSVG, FShapeTrasladadaSVG, FShapeRotadaSVG, FShapeReflejadaSVG,
    SimpleTriangleSVG, SimpleTriangleTrasladadaSVG, SimpleTriangleRotadaSVG, SimpleTriangleReflejadaSVG,
    SimpleRectangleSVG, SimpleRectangleTrasladadaSVG, SimpleRectangleRotadaSVG, SimpleRectangleReflejadaSVG,
    LShapeSVG, LShapeTrasladadaSVG, LShapeRotadaSVG, LShapeReflejadaSVG,
    RShapeSVG, RShapeTrasladadaSVG, RShapeRotadaSVG, RShapeReflejadaSVG,
    PShapeSVG, PShapeTrasladadaSVG, PShapeRotadaSVG, PShapeReflejadaSVG,
    JShapeSVG, JShapeTrasladadaSVG, JShapeRotadaSVG, JShapeReflejadaSVG,
    QShapeSVG, QShapeTrasladadaSVG, QShapeRotadaSVG, QShapeReflejadaSVG,
    transformedTriangleSideChallenges, 
    transformedTriangleAngleChallengesG4, 
    transformedG4PolygonChallenges,
    CuadradoSVG, // For diagonal challenge placeholder
} from './geometryDefinitions';
import { ScenarioSetId } from './exercises/problemScenarios/index';
import { shuffleArray } from './utils'; 


// --- 4th Grade Specific Exercises ---

const fourthGradeNumerosExercises: Exercise[] = [
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

const fourthGradeOperacionesExercises: Exercise[] = [
  { 
    id: 'g4-s2-e1', title: 'Sumas en Columna (Números Grandes)', 
    description: 'Suma números de hasta 5 o 6 dígitos.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'addition', numOperands: 2, minOperandValue: 10000, maxOperandValue: 999999 },
    question: 'Resuelve la suma:',
  },
  { 
    id: 'g4-s2-e2', title: 'Restas en Columna (Números Grandes)', 
    description: 'Resta números de hasta 5 o 6 dígitos.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.COLUMNAR_OPERATION,
    data: { totalStars: 10, operationType: 'subtraction', numOperands: 2, minOperandValue: 10000, maxOperandValue: 999999 },
    question: 'Resuelve la resta:',
  },
  { 
    id: 'g4-s2-e3', title: 'Multiplicación: 3 dig x 2 dig', 
    description: 'Multiplica números de tres cifras por dos cifras.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
    data: { totalStars: 10, multiplicandDigitCount: 3, multiplierDigitCount: 2 },
    question: 'Resuelve la multiplicación:',
  },
  { 
    id: 'g4-s2-e4', title: 'Multiplicación: 4 dig x 1 dig', 
    description: 'Multiplica números de cuatro cifras por una cifra.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.MULTIPLICACION_COLUMNAS,
    data: { totalStars: 10, multiplicandDigitCount: 4, multiplierDigitCount: 1 },
    question: 'Resuelve la multiplicación:',
  },
  { 
    id: 'g4-s2-e5', title: 'División Larga con Resto', 
    description: 'Divide (hasta 4 dig / 1 dig) e interpreta el resto.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.DIVISION_LARGA,
    data: { totalStars: 10, dividendDigitCount: 4, divisorDigitCount: 1, exactDivision: false },
    question: 'Resuelve la división (indica cociente y resto):',
  },
  { 
    id: 'g4-s2-e6', title: 'Dividir por 10, 100, 1000', 
    description: 'Divide mentalmente por la unidad seguida de ceros.', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.CALCULA_MENTALMENTE,
    data: { totalStars: 10, problemType: 'divideByPowerOfTen', minOperand: 100, maxOperand: 999000 },
    question: 'Calcula mentalmente:',
  },
  { 
    id: 'g4-s2-e7', title: 'Operaciones Combinadas Simples', 
    description: 'Resuelve sumas, restas y multiplicaciones (sin paréntesis).', 
    iconName: 'OperationsIcon', isLocked: false, 
    componentType: ExerciseComponentType.OPERACIONES_COMBINADAS_SIMPLES_G4, 
    data: { totalStars: 10, maxOperands: 3, maxOperandValue: 50, operations: ['+', '-', '*'] },
    question: 'Calcula el resultado:',
  },
];

const fourthGradeProblemasExercises: Exercise[] = [
    { 
    id: 'g4-s3-e1', title: 'Problemas de Dos o Más Pasos', 
    description: 'Resuelve problemas combinando operaciones.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 8, numberRange: [10, 500], scenarioSetId: ScenarioSetId.GENERAL, allowedOperations: ['+', '-', '*'] }, 
    question: 'Lee y resuelve paso a paso:',
  },
   { 
    id: 'g4-s3-e2', title: 'Problemas con Multiplicación y División', 
    description: 'Aplica multiplicación y división en problemas.', 
    iconName: 'ProblemsIcon', isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
    data: { totalStars: 8, numberRange: [2, 100], scenarioSetId: ScenarioSetId.MIXED_OPERATIONS_ADVANCED, allowedOperations: ['*', '/'] }, 
    question: 'Resuelve el problema:',
  },
  { 
    id: 'g4-s3-e3', title: 'Problemas con Fracciones (Parte de un Todo)', 
    description: 'Calcula la fracción de una cantidad.', 
    iconName: 'BookOpenIcon', 
    isLocked: false, // Unlocked
    componentType: ExerciseComponentType.FRACCION_DE_CANTIDAD_G5, // Implemented
    data: {
      totalStars: 10,
      challenges: [
        { fractionNum: 1, fractionDen: 4, wholeNumber: 20, correctAnswer: 5, context: 'caramelos' },
        { fractionNum: 2, fractionDen: 3, wholeNumber: 18, correctAnswer: 12, context: 'figuritas' },
        { fractionNum: 3, fractionDen: 5, wholeNumber: 25, correctAnswer: 15, context: 'libros' },
        { fractionNum: 1, fractionDen: 2, wholeNumber: 30, correctAnswer: 15, context: 'alumnos' },
        { fractionNum: 3, fractionDen: 4, wholeNumber: 16, correctAnswer: 12, context: 'manzanas' },
        { fractionNum: 4, fractionDen: 7, wholeNumber: 21, correctAnswer: 12, context: 'lápices' },
        { fractionNum: 2, fractionDen: 6, wholeNumber: 24, correctAnswer: 8, context: 'globos' }, 
        { fractionNum: 5, fractionDen: 8, wholeNumber: 40, correctAnswer: 25, context: 'pesos' },
        { fractionNum: 2, fractionDen: 9, wholeNumber: 27, correctAnswer: 6, context: 'flores' },
        { fractionNum: 1, fractionDen: 10, wholeNumber: 100, correctAnswer: 10, context: 'puntos' }
      ] as FraccionCantidadChallenge[]
    },
    question: 'Calcula la fracción de la cantidad:',
    content: 'Encuentra la parte de un número total basándote en la fracción dada.'
  },
  { 
    id: 'g4-s3-e4', title: 'Finanzas para Chicos (Dinero y Decimales)', 
    description: 'Calcula costos y vueltos en problemas de compras.', 
    iconName: 'ProblemsIcon', 
    isLocked: false, // Unlocked
    componentType: ExerciseComponentType.FINANZAS_AVANZADO, // Implemented
    data: { 
        totalStars: 9,
        scenarios: [
          {
            id: 'g4_fin_adv_1',
            initialMoney: 5000,
            shoppingList: [
              { item: { name: 'Pelota de Fútbol', price: 1800, icon: '⚽' }, quantity: 1 },
              { item: { name: 'Remera', price: 1950, icon: '👕' }, quantity: 1 },
            ],
          },
          {
            id: 'g4_fin_adv_2',
            initialMoney: 10000,
            shoppingList: [
              { item: { name: 'Mochila', price: 4500, icon: '🎒' }, quantity: 1 },
              { item: { name: 'Libro de Aventuras', price: 1500, icon: '📚' }, quantity: 2 },
            ],
          },
          {
            id: 'g4_fin_adv_3',
            initialMoney: 8000,
            shoppingList: [
              { item: { name: 'Auriculares', price: 3500, icon: '🎧' }, quantity: 1 },
              { item: { name: 'Juego', price: 2800, icon: '🎮' }, quantity: 1 },
            ],
          },
        ] as FinanceChallengeG5[],
    },
    question: 'Resuelve el problema de finanzas paso a paso:',
  },
];

const fourthGradeMedidasExercises: Exercise[] = [
   { 
    id: 'g4-s4-e1', title: 'Conversión de Unidades', 
    description: 'Convierte entre km, m, cm, mm; kg, g; L, ml.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.CONVERSION_UNIDADES_G4, 
    data: { 
        totalStars: 10,
        challenges: [ 
            { fromUnit: 'km', toUnit: 'm', valueFrom: 2, correctAnswerTo: 2000, unitType: 'longitud' },
            { fromUnit: 'm', toUnit: 'cm', valueFrom: 5, correctAnswerTo: 500, unitType: 'longitud' },
            { fromUnit: 'cm', toUnit: 'mm', valueFrom: 10, correctAnswerTo: 100, unitType: 'longitud' },
            { fromUnit: 'kg', toUnit: 'g', valueFrom: 3, correctAnswerTo: 3000, unitType: 'masa' },
            { fromUnit: 'l', toUnit: 'ml', valueFrom: 1.5, correctAnswerTo: 1500, unitType: 'capacidad' },
            { fromUnit: 'horas', toUnit: 'minutos', valueFrom: 2, correctAnswerTo: 120, unitType: 'tiempo' },
        ] as ConversionUnidadesChallenge[]
    },
    question: 'Convierte la medida:',
  },
  { 
    id: 'g4-s4-e2', title: 'Calcular Área (Cuadrado/Rectángulo)', 
    description: 'Calcula el área de cuadrados y rectángulos.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.CALCULAR_AREA_G4, 
    data: { totalStars: 10, minSide: 1, maxSide: 20, unit: "cm" },
    question: 'Calcula el área:',
  },
  { 
    id: 'g4-s4-e3', title: 'Calcular Tiempo Transcurrido', 
    description: 'Encuentra cuánto tiempo pasó entre dos horas dadas.', 
    iconName: 'MeasureIcon', isLocked: false,
    componentType: ExerciseComponentType.CALCULAR_TIEMPO_TRANSCURRIDO_G4, 
    data: { totalStars: 8,
            challenges: [
                { startTime: "08:00", endTime: "10:30", correctAnswer: {hours: 2, minutes: 30} },
                { startTime: "14:15", endTime: "16:00", correctAnswer: {hours: 1, minutes: 45} },
                { startTime: "09:45", endTime: "12:15", correctAnswer: {hours: 2, minutes: 30} },
            ] as TiempoTranscurridoChallenge[]
     },
    question: '¿Cuánto tiempo pasó?',
  },
  { 
    id: 'g4-s4-e4', title: 'Volumen con Cubos Unitarios', 
    description: 'Calcula el volumen contando cubos unidad.', 
    iconName: 'MeasureIcon', isLocked: false,
    componentType: ExerciseComponentType.VOLUMEN_CUBOS_UNITARIOS_G4, 
    data: { totalStars: 8,
            challenges: [
                { dimensions: {length: 3, width: 2, height: 2}, correctVolume: 12 },
                { dimensions: {length: 4, width: 3, height: 1}, correctVolume: 12 },
                { dimensions: {length: 2, width: 2, height: 3}, correctVolume: 12 },
            ] as VolumenCubosUnitariosChallenge[]
    },
    question: '¿Cuál es el volumen en cubos unidad?',
  },
];

const transformationOptions = [{id:'traslacion', label:'Traslación'}, {id:'rotacion', label:'Rotación'}, {id:'reflexion', label:'Reflexión'}];

const fourthGradeGeometriaExercises: Exercise[] = [
   { 
    id: 'g4-s5-e1', title: 'Clasificar Triángulos (Lados y Ángulos)', 
    description: 'Identifica triángulos por sus lados y ángulos.', 
    iconName: 'GeometryIcon', isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
    data: { 
        totalStars: 10, 
        questionPrompt: "¿Qué tipo de triángulo es?",
        challenges: shuffleArray([
            ...transformedTriangleSideChallenges, 
            ...transformedTriangleAngleChallengesG4
        ])
    },
    question: '¿Qué tipo de triángulo es?',
  },
  { 
    id: 'g4-s5-e2', title: 'Clasificar Polígonos (hasta Decágono)', 
    description: 'Nombra polígonos hasta el decágono.', 
    iconName: 'GeometryIcon', isLocked: false,
    componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
    data: { 
        totalStars: 10, 
        questionPrompt: "¿Qué polígono es?",
        challenges: transformedG4PolygonChallenges, 
    },
    question: '¿Qué polígono es?',
  },
  { 
    id: 'g4-s5-e3', title: 'Medir Ángulos', 
    description: 'Identifica la medida del ángulo mostrado entre las opciones.', 
    iconName: 'GeometryIcon', isLocked: false, 
    componentType: ExerciseComponentType.MEDIR_ANGULOS_TRANSPORTADOR_G4, 
    data: { 
        totalStars: 8,
        challenges: [
            {id: 'a45', angleDegrees: 45, options: [30, 45, 60, 90]},
            {id: 'a90', angleDegrees: 90, options: [75, 85, 90, 100]},
            {id: 'a30', angleDegrees: 30, options: [15, 30, 45, 60]},
            {id: 'a120', angleDegrees: 120, options: [90, 110, 120, 135]},
            {id: 'a60', angleDegrees: 60, options: [45, 50, 60, 75]},
            {id: 'a150', angleDegrees: 150, options: [120, 135, 150, 165]},
            {id: 'a10', angleDegrees: 10, options: [5, 10, 15, 20], questionText: "¿Mide el ángulo agudo?"},
            {id: 'a170', angleDegrees: 170, options: [150, 160, 170, 180], questionText: "¿Mide el ángulo obtuso?"},
        ] as MedirAngulosTransportadorG4Challenge[]
    },
    question: '¿Cuántos grados mide el ángulo?', 
  },
  { 
    id: 'g4-s5-e4', title: 'Identificar Diagonales de Polígonos', 
    description: 'Cuenta o identifica las diagonales de diferentes polígonos.', 
    iconName: 'GeometryIcon', isLocked: false,
    componentType: ExerciseComponentType.IDENTIFICAR_DIAGONALES_POLIGONO_G4, 
    data: { 
        totalStars: 8, 
        challenges: [
            { polygonName: 'cuadrilatero', sides: 4, VisualComponent: CuadradoSVG , correctNumDiagonals: 2, options: [0,1,2,3,4] },
            { polygonName: 'pentagono', sides: 5, VisualComponent: PentagonoRegularSVG, correctNumDiagonals: 5, options: [2,3,4,5,6] },
            { polygonName: 'hexagono', sides: 6, VisualComponent: HexagonoRegularSVG, correctNumDiagonals: 9, options: [6,7,8,9,10] },
        ] as DiagonalChallenge[]
    },
    question: '¿Cuántas diagonales tiene este polígono?',
  },
  { 
    id: 'g4-s5-e5', title: 'Redes de Cuerpos Geométricos', 
    description: 'Identifica qué cuerpo geométrico se forma con una red dada.', 
    iconName: 'GeometryIcon', isLocked: false,
    componentType: ExerciseComponentType.REDES_CUERPOS_GEOMETRICOS_G4, 
    data: { 
        totalStars: 8, 
        challenges: [
            { netVisualComponent: NetCuboSVG, correctBodyId: 'cubo', options: [{id: 'cubo', label:'Cubo'}, {id:'prismaRectangular', label:'Prisma'}, {id:'piramideCuadrangular', label:'Pirámide'}] },
            { netVisualComponent: NetPrismaRectSVG, correctBodyId: 'prismaRectangular', options: [{id: 'cubo', label:'Cubo'}, {id:'prismaRectangular', label:'Prisma'}, {id:'cilindro', label:'Cilindro'}] },
            { netVisualComponent: NetPiramideCuadrSVG, correctBodyId: 'piramideCuadrangular', options: [{id: 'piramideCuadrangular', label:'Pirámide'}, {id:'cono', label:'Cono'}, {id:'prismaRectangular', label:'Prisma'}] },
        ] as NetChallenge[]
    },
    question: '¿Qué cuerpo se forma con esta red?',
  },
  { 
    id: 'g4-s5-e6', title: 'Identificar Transformaciones Geométricas', 
    description: 'Identifica traslaciones, rotaciones y reflexiones.', 
    iconName: 'GeometryIcon', isLocked: false,
    componentType: ExerciseComponentType.IDENTIFICAR_TRANSFORMACIONES_GEOMETRICAS_G4, 
    data: { 
        totalStars: 24,
        challenges: [
            { id: 'g4-s5-e6-fshape_t1', BeforeShapeComponent: FShapeSVG, AfterShapeComponent: FShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-fshape_r1', BeforeShapeComponent: FShapeSVG, AfterShapeComponent: FShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-fshape_f1', BeforeShapeComponent: FShapeSVG, AfterShapeComponent: FShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },
            
            { id: 'g4-s5-e6-triangle_t1', BeforeShapeComponent: SimpleTriangleSVG, AfterShapeComponent: SimpleTriangleTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-triangle_r1', BeforeShapeComponent: SimpleTriangleSVG, AfterShapeComponent: SimpleTriangleRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-triangle_f1', BeforeShapeComponent: SimpleTriangleSVG, AfterShapeComponent: SimpleTriangleReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },

            { id: 'g4-s5-e6-rectangle_t1', BeforeShapeComponent: SimpleRectangleSVG, AfterShapeComponent: SimpleRectangleTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-rectangle_r1', BeforeShapeComponent: SimpleRectangleSVG, AfterShapeComponent: SimpleRectangleRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-rectangle_f1', BeforeShapeComponent: SimpleRectangleSVG, AfterShapeComponent: SimpleRectangleReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },

            { id: 'g4-s5-e6-lshape_t1', BeforeShapeComponent: LShapeSVG, AfterShapeComponent: LShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-lshape_r1', BeforeShapeComponent: LShapeSVG, AfterShapeComponent: LShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-lshape_f1', BeforeShapeComponent: LShapeSVG, AfterShapeComponent: LShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },

            { id: 'g4-s5-e6-rshape_t1', BeforeShapeComponent: RShapeSVG, AfterShapeComponent: RShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-rshape_r1', BeforeShapeComponent: RShapeSVG, AfterShapeComponent: RShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-rshape_f1', BeforeShapeComponent: RShapeSVG, AfterShapeComponent: RShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },
            
            { id: 'g4-s5-e6-pshape_t1', BeforeShapeComponent: PShapeSVG, AfterShapeComponent: PShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-pshape_r1', BeforeShapeComponent: PShapeSVG, AfterShapeComponent: PShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-pshape_f1', BeforeShapeComponent: PShapeSVG, AfterShapeComponent: PShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },

            { id: 'g4-s5-e6-jshape_t1', BeforeShapeComponent: JShapeSVG, AfterShapeComponent: JShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-jshape_r1', BeforeShapeComponent: JShapeSVG, AfterShapeComponent: JShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-jshape_f1', BeforeShapeComponent: JShapeSVG, AfterShapeComponent: JShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },

            { id: 'g4-s5-e6-qshape_t1', BeforeShapeComponent: QShapeSVG, AfterShapeComponent: QShapeTrasladadaSVG, correctTransformation: 'traslacion', options: transformationOptions },
            { id: 'g4-s5-e6-qshape_r1', BeforeShapeComponent: QShapeSVG, AfterShapeComponent: QShapeRotadaSVG, correctTransformation: 'rotacion', options: transformationOptions },
            { id: 'g4-s5-e6-qshape_f1', BeforeShapeComponent: QShapeSVG, AfterShapeComponent: QShapeReflejadaSVG, correctTransformation: 'reflexion', options: transformationOptions },
        ] as TransformationChallenge[]
    },
    question: '¿Qué transformación se aplicó?',
  },
];

const G4_ESTADISTICA_GRAFICO_CIRCULAR_CHALLENGES: PieChartChallenge[] = [
  {
    title: "Colores Favoritos de la Clase",
    data: [
      { label: "Rojo", value: 30, color: "#FF6384" },    
      { label: "Azul", value: 50, color: "#36A2EB" },    
      { label: "Verde", value: 15, color: "#4BC0C0" },   
      { label: "Amarillo", value: 5, color: "#FFCE56" }, 
    ],
    questions: [
      { text: "¿Qué color es el más popular?", options: ["Rojo", "Azul", "Verde", "Amarillo"], correctAnswer: "Azul" },
      { text: "¿Qué porcentaje aproximado prefiere el color Amarillo?", options: ["5%", "10%", "15%", "20%"], correctAnswer: "5%" },
      { text: "Si hay 20 alumnos en total, ¿cuántos prefieren Rojo?", options: ["3", "6", "9", "12"], correctAnswer: "6" }
    ],
  },
  {
    title: "Mascotas Preferidas",
    data: [
      { label: "Perros", value: 45, color: "#E57373" },
      { label: "Gatos", value: 30, color: "#81C784" },
      { label: "Pájaros", value: 15, color: "#64B5F6" },
      { label: "Peces", value: 10, color: "#FFF176" },
    ],
    questions: [
      { text: "¿Cuál es la mascota más preferida?", options: ["Perros", "Gatos", "Pájaros", "Peces"], correctAnswer: "Perros" },
      { text: "¿Es cierto que los Gatos son el doble de populares que los Pájaros?", options: ["Sí", "No"], correctAnswer: "Sí" },
      { text: "¿Qué porcentaje aproximado prefiere los Peces?", options: ["5%", "10%", "15%", "20%"], correctAnswer: "10%" },
    ],
  },
  {
    title: "Actividades Extraescolares",
    data: [
      { label: "Deportes", value: 40, color: "#FFB74D" },
      { label: "Música", value: 25, color: "#BA68C8" },
      { label: "Arte", value: 20, color: "#7986CB" },
      { label: "Idiomas", value: 15, color: "#AED581" },
    ],
    questions: [
      { text: "¿Qué actividad es la menos elegida?", options: ["Deportes", "Música", "Arte", "Idiomas"], correctAnswer: "Idiomas" },
      { text: "Entre Música y Arte, ¿cuál es más popular?", options: ["Música", "Arte", "Iguales"], correctAnswer: "Música" },
      { text: "Si 100 alumnos participan, ¿cuántos eligen Deportes?", options: ["20", "30", "40", "50"], correctAnswer: "40" },
    ],
  }
];

// --- 4th Grade Statistics Exercises ---
const G4_ESTADISTICA_LINE_PLOT_CHALLENGES: LinePlotChallengeG4[] = [
  {
    id: "lp_mascotas_g4",
    title: "Mascotas por Alumno",
    xAxisLabel: "Número de Mascotas",
    data: [
      { value: 0, frequency: 3 }, { value: 1, frequency: 7 },
      { value: 2, frequency: 5 }, { value: 3, frequency: 2 },
      { value: 4, frequency: 1 },
    ],
    questions: [
      { id: "q1", text: "¿Cuántos alumnos tienen 2 mascotas?", questionType: 'numeric', correctAnswer: "5" },
      { id: "q2", text: "¿Cuál es el número más común de mascotas (moda)?", questionType: 'numeric', correctAnswer: "1" },
      { id: "q3", text: "¿Cuántos alumnos fueron encuestados en total?", questionType: 'numeric', correctAnswer: "18" },
      { id: "q4", text: "¿Cuántos alumnos tienen más de 2 mascotas?", questionType: 'numeric', correctAnswer: "3"},
    ],
    icon: "🐾",
  },
  {
    id: "lp_hermanos_g4",
    title: "Número de Hermanos",
    xAxisLabel: "Cantidad de Hermanos",
    data: [
      { value: 0, frequency: 4 }, { value: 1, frequency: 8 },
      { value: 2, frequency: 6 }, { value: 3, frequency: 3 },
    ],
    questions: [
      { id: "q1", text: "¿Cuántos alumnos no tienen hermanos?", questionType: 'numeric', correctAnswer: "4" },
      { id: "q2", text: "¿Cuál es el número de hermanos más frecuente (moda)?", questionType: 'numeric', correctAnswer: "1" },
      { id: "q3", text: "¿Cuál es el rango en la cantidad de hermanos (diferencia entre el máximo y mínimo reportado)?", questionType: 'numeric', correctAnswer: "3"}, // 3 - 0 = 3
      { id: "q4", text: "Si se suman todos los hermanos de todos los alumnos, ¿cuántos hermanos hay en total?", questionType: 'numeric', correctAnswer: "29" } 
    ],
    icon: "👨‍👩‍👧‍👦",
  },
   {
    id: "lp_visitas_parque_g4",
    title: "Visitas al Parque en la Semana",
    xAxisLabel: "Número de Visitas",
    data: [
      { value: 0, frequency: 2 }, { value: 1, frequency: 5 },
      { value: 2, frequency: 6 }, { value: 3, frequency: 4 },
      { value: 4, frequency: 2 }, { value: 5, frequency: 1 },
    ],
    questions: [
      { id: "vp_q1", text: "¿Cuántas personas visitaron el parque 3 veces?", questionType: 'numeric', correctAnswer: "4" },
      { id: "vp_q2", text: "¿Cuál es el número de visitas más común (moda)?", questionType: 'numeric', correctAnswer: "2" },
      { id: "vp_q3", text: "¿Cuántas personas fueron encuestadas?", questionType: 'numeric', correctAnswer: "20" },
      { id: "vp_q4", text: "¿Cuántas personas visitaron el parque más de 3 veces?", questionType: 'numeric', correctAnswer: "3"},
    ],
    icon: "🌳",
  },
  {
    id: "lp_lapices_estuches_g4",
    title: "Lápices de Colores en Estuches",
    xAxisLabel: "Cantidad de Lápices",
    data: [
      { value: 5, frequency: 1 }, { value: 6, frequency: 3 },
      { value: 7, frequency: 2 }, { value: 8, frequency: 5 },
      { value: 9, frequency: 3 }, { value: 10, frequency: 4 },
      { value: 12, frequency: 2 },
    ],
    questions: [
      { id: "lc_q1", text: "¿Cuántos estuches tienen exactamente 8 lápices?", questionType: 'numeric', correctAnswer: "5" },
      { id: "lc_q2", text: "¿Cuál es la cantidad de lápices más frecuente (moda)?", questionType: 'numeric', correctAnswer: "8" },
      { id: "lc_q3", text: "¿Cuál es el rango en la cantidad de lápices (diferencia entre el máximo y mínimo)?", questionType: 'numeric', correctAnswer: "7"}, // 12 - 5 = 7
      { id: "lc_q4", text: "¿Cuántos estuches tienen menos de 7 lápices?", questionType: 'numeric', correctAnswer: "4"},
    ],
    icon: "🖍️",
  },
  {
    id: "lp_horas_sueno_g4",
    title: "Horas de Sueño de Estudiantes",
    xAxisLabel: "Horas de Sueño",
    data: [
      { value: 6, frequency: 1 }, { value: 7, frequency: 4 },
      { value: 8, frequency: 9 }, { value: 9, frequency: 5 },
      { value: 10, frequency: 2 },
    ],
    questions: [
      { id: "hs_q1", text: "¿Cuántos estudiantes duermen 8 horas?", questionType: 'numeric', correctAnswer: "9" },
      { id: "hs_q2", text: "¿Cuál es la cantidad de horas de sueño más común (moda)?", questionType: 'numeric', correctAnswer: "8" },
      { id: "hs_q3", text: "¿Cuántos estudiantes duermen menos de 8 horas?", questionType: 'numeric', correctAnswer: "5"},
      { id: "hs_q4", text: "¿Cuántos estudiantes fueron encuestados en total?", questionType: 'numeric', correctAnswer: "21" },
    ],
    icon: "😴",
  },
  {
    id: "lp_paginas_leidas_g4",
    title: "Páginas Leídas en un Día",
    xAxisLabel: "Número de Páginas",
    data: [
      { value: 5, frequency: 3 }, { value: 10, frequency: 6 },
      { value: 15, frequency: 5 }, { value: 20, frequency: 4 },
      { value: 25, frequency: 2 },
    ],
    questions: [
      { id: "pl_q1", text: "¿Cuántos estudiantes leyeron 10 páginas?", questionType: 'numeric', correctAnswer: "6" },
      { id: "pl_q2", text: "¿Cuál es el rango en el número de páginas leídas?", questionType: 'numeric', correctAnswer: "20"}, // 25 - 5 = 20
      { id: "pl_q3", text: "¿Cuántos estudiantes leyeron más de 15 páginas?", questionType: 'numeric', correctAnswer: "6"},
      { id: "pl_q4", text: "¿Cuál fue la cantidad de páginas leídas menos frecuente (excluyendo cero si no está)?", questionType: 'numeric', correctAnswer: "25"},
    ],
    icon: "📚",
  },
];

const G4_ESTADISTICA_ORGANIZAR_DATOS_CHALLENGES: FrequencyTableChallengeG4[] = [
  {
    id: "colores_fav_g4",
    description: "Estos son los colores favoritos de un grupo de amigos:",
    rawData: ["Rojo", "Azul", "Verde", "Rojo", "Azul", "Azul", "Amarillo", "Verde", "Rojo", "Azul", "Rojo"],
    categories: ["Rojo", "Azul", "Verde", "Amarillo"],
    questionText: "Completa la tabla contando cuántas veces aparece cada color.",
    icon: "🎨",
    correctFrequencies: { "Rojo": 4, "Azul": 4, "Verde": 2, "Amarillo": 1 },
    totalStars: 1,
  },
  {
    id: "deportes_clase_g4",
    description: "Deportes elegidos por los alumnos de 4to A:",
    rawData: ["Fútbol", "Básquet", "Fútbol", "Tenis", "Fútbol", "Básquet", "Vóley", "Fútbol", "Tenis", "Fútbol", "Vóley"],
    categories: ["Fútbol", "Básquet", "Tenis", "Vóley"],
    questionText: "Organiza los datos en la tabla de frecuencias.",
    icon: "⚽",
    correctFrequencies: { "Fútbol": 5, "Básquet": 2, "Tenis": 2, "Vóley": 2 },
    totalStars: 1,
  },
  {
    id: "animales_parque_g4",
    description: "Animales observados en el parque durante una hora:",
    rawData: ["Perro", "Pájaro", "Gato", "Perro", "Perro", "Pájaro", "Ardilla", "Gato", "Perro", "Pájaro", "Pájaro", "Ardilla"],
    categories: ["Perro", "Pájaro", "Gato", "Ardilla"],
    questionText: "Cuenta cada tipo de animal y completa la tabla.",
    icon: "🏞️",
    correctFrequencies: { "Perro": 4, "Pájaro": 4, "Gato": 2, "Ardilla": 2 },
    totalStars: 1,
  },
];

const G4_ESTADISTICA_CREAR_GRAFICO_BARRAS_CHALLENGES: CreateBarGraphChallengeG4[] = [
  {
    id: "crear_helados_g4",
    title: "Gráfico: Sabores de Helado",
    description: "Usa la tabla para crear el gráfico de barras de los sabores de helado favoritos.",
    tableData: [
      { categoryName: "Chocolate", correctFrequency: 8, color: "#795548" }, // Marrón
      { categoryName: "Fresa", correctFrequency: 5, color: "#E91E63" },   // Rosa
      { categoryName: "Vainilla", correctFrequency: 7, color: "#FFEB3B" }, // Amarillo
      { categoryName: "Limón", correctFrequency: 3, color: "#CDDC39" },    // Lima
    ],
    xAxisLabel: "Sabor de Helado",
    yAxisLabel: "Cantidad de Votos",
    maxYAxisValue: 10,
    yAxisStep: 2,
    icon: "🍦",
    totalStars: 1, // One star for completing this single graph
  },
  {
    id: "crear_mascotas_g4",
    title: "Gráfico: Mascotas en Casa",
    description: "Construye un gráfico de barras que muestre cuántas mascotas de cada tipo hay.",
    tableData: [
      { categoryName: "Perros", correctFrequency: 6, color: "#607D8B" },  // Gris azulado
      { categoryName: "Gatos", correctFrequency: 4, color: "#FF9800" },   // Naranja
      { categoryName: "Pájaros", correctFrequency: 2, color: "#03A9F4" }, // Azul claro
      { categoryName: "Peces", correctFrequency: 5, color: "#2196F3" },   // Azul
    ],
    xAxisLabel: "Tipo de Mascota",
    yAxisLabel: "Número de Mascotas",
    maxYAxisValue: 8,
    yAxisStep: 1,
    icon: "🐾",
    totalStars: 1,
  },
  {
    id: "crear_deportes_g4",
    title: "Gráfico: Deportes Favoritos",
    description: "Crea un gráfico de barras para los deportes favoritos de un grupo.",
    tableData: [
      { categoryName: "Fútbol", correctFrequency: 10, color: "#4CAF50" }, // Verde
      { categoryName: "Básquet", correctFrequency: 7, color: "#FFC107" }, // Ámbar
      { categoryName: "Vóley", correctFrequency: 4, color: "#9C27B0" },  // Púrpura
      { categoryName: "Tenis", correctFrequency: 6, color: "#00BCD4" },  // Cyan
    ],
    xAxisLabel: "Deporte",
    yAxisLabel: "Alumnos",
    maxYAxisValue: 12,
    yAxisStep: 2,
    icon: "🏆",
    totalStars: 1,
  }
];


const fourthGradeEstadisticaExercises: Exercise[] = [
  { 
    id: 'g4-s6-e1', title: 'Calcular Media Aritmética', 
    description: 'Encuentra el promedio de un conjunto de datos.', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.CALCULAR_MEDIA_G4, 
    data: { totalStars: 8, minSetSize: 3, maxSetSize: 7, minValue: 1, maxValue: 50 } as {totalStars: number} & Partial<MeanCalculationChallenge>,
    question: 'Calcula la media:',
  },
  { 
    id: 'g4-s6-e2', title: 'Identificar Moda y Rango', 
    description: 'Encuentra la moda y el rango de un conjunto de datos.', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_MODA_RANGO_G4, 
    data: { totalStars: 8, minSetSize: 5, maxSetSize: 10, minValue: 1, maxValue: 20 } as {totalStars: number} & Partial<ModeRangeChallenge>,
    question: 'Encuentra la moda y el rango:',
  },
   { 
    id: 'g4-s6-e3', title: 'Interpretar Gráficos Circulares', 
    description: 'Lee e interpreta datos presentados en gráficos circulares.', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.INTERPRETAR_GRAFICO_CIRCULAR_G4, 
    data: { 
        totalStars: G4_ESTADISTICA_GRAFICO_CIRCULAR_CHALLENGES.reduce((sum, c) => sum + c.questions.length, 0), 
        challenges: G4_ESTADISTICA_GRAFICO_CIRCULAR_CHALLENGES
    },
    question: 'Observa el gráfico y responde:',
  },
  { 
    id: 'g4-s6-e4', title: 'Experimentos Aleatorios y Registro', 
    description: 'Registra resultados de experimentos aleatorios simples (dados, monedas).', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.EXPERIMENTO_ALEATORIO_REGISTRO_G4, 
    data: { 
        totalStars: 6,
        challenges: [
            { experimentType: 'dice', description: 'Lanzar un dado 10 veces y anotar los resultados.', possibleOutcomes: ["1","2","3","4","5","6"], questionType: 'frequency_of_outcome', simulatedResults: [{outcome:"3", count:3},{outcome:"5",count:2},{outcome:"1",count:5}], questionAbout:"el número 3", correctAnswer: "3 veces", options: ["1 vez", "2 veces", "3 veces", "4 veces"] },
            { experimentType: 'coin', description: 'Lanzar una moneda 8 veces y anotar si sale Cara o Cruz.', possibleOutcomes: ["Cara","Cruz"], questionType: 'most_frequent', simulatedResults: [{outcome:"Cara", count:5},{outcome:"Cruz",count:3}], correctAnswer: "Cara", options: ["Cara", "Cruz", "Ambos igual"] },
        ] as ExperimentoAleatorioChallenge[]
    },
    question: 'Observa los resultados y responde:',
  },
  { 
    id: 'g4-s6-e5', title: 'Interpretar Gráficos de Puntos', 
    description: 'Lee e interpreta datos presentados en gráficos de puntos (dot plots).', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.INTERPRETAR_GRAFICO_PUNTOS_G4, 
    data: { 
        totalStars: G4_ESTADISTICA_LINE_PLOT_CHALLENGES.reduce((sum, c) => sum + c.questions.length, 0),
        challenges: G4_ESTADISTICA_LINE_PLOT_CHALLENGES
    },
    question: 'Observa el gráfico de puntos y responde:',
  },
  {
    id: 'g4-s6-e6', title: 'Organizar Datos: Tabla de Frecuencias',
    description: 'Cuenta datos y completa una tabla de frecuencias.',
    iconName: 'StatisticsIcon', isLocked: false,
    componentType: ExerciseComponentType.ORGANIZAR_DATOS_EN_TABLA_FRECUENCIA_G4,
    data: {
        totalStars: G4_ESTADISTICA_ORGANIZAR_DATOS_CHALLENGES.length, // Each challenge is one table, so 1 star per challenge
        challenges: G4_ESTADISTICA_ORGANIZAR_DATOS_CHALLENGES,
    },
    question: "Organiza los datos en la tabla:",
  },
  {
    id: 'g4-s6-e7', title: 'Crear Diagrama de Barras Simple',
    description: 'Construye un diagrama de barras a partir de una tabla de frecuencias.',
    iconName: 'StatisticsIcon', isLocked: false,
    componentType: ExerciseComponentType.CREAR_DIAGRAMA_BARRAS_SIMPLE_G4,
    data: {
        totalStars: G4_ESTADISTICA_CREAR_GRAFICO_BARRAS_CHALLENGES.length,
        challenges: G4_ESTADISTICA_CREAR_GRAFICO_BARRAS_CHALLENGES,
    },
    question: "Crea el gráfico de barras usando la tabla:",
  }
];

const fourthGradeProbabilidadExercises: Exercise[] = [
  { 
    id: 'g4-s7-e1', title: 'Expresar Probabilidad como Fracción', 
    description: 'Escribe la probabilidad de un evento como fracción.', 
    iconName: 'ProbabilityIcon', isLocked: false, 
    componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
    data: { 
        totalStars: 10, 
        scenarios: [ 
            { id: "g4_bolsa_roja", contextText: "Bolsa: 🔴🔴🔵🔵🔵", visualContext:"(5 bolitas)", eventToEvaluate:"Sacar ROJA", options:[{text:"2/5",isCorrect:true},{text:"3/5",isCorrect:false},{text:"2/3",isCorrect:false}]},
            { id: "g4_ruleta_verde", contextText: "Ruleta: 🟢🟢🟡⚪️", visualContext:"(4 secciones)", eventToEvaluate:"Sacar VERDE", options:[{text:"2/4",isCorrect:true},{text:"1/4",isCorrect:false},{text:"1/2",isCorrect:false}]},
        ] 
    },
    question: '¿Cuál es la probabilidad?',
  },
  { 
    id: 'g4-s7-e2', title: 'Predecir Resultados (Probabilidad)', 
    description: 'Estima cuántas veces ocurrirá un evento en varios intentos.', 
    iconName: 'ProbabilityIcon', isLocked: false, 
    componentType: ExerciseComponentType.PREDECIR_RESULTADOS_PROBABILIDAD_G4, 
    data: { 
        totalStars: 8,
        challenges: [
            { eventDescription: "Sacar CARA al lanzar una moneda", probability: {favorable: 1, total: 2}, numTrials: 20, questionText: "Si lanzas la moneda 20 veces, ¿aprox. cuántas veces saldrá CARA?", correctAnswer: 10, options: [5,10,15,20] },
            { eventDescription: "Sacar un 6 al lanzar un dado", probability: {favorable: 1, total: 6}, numTrials: 30, questionText: "Si lanzas el dado 30 veces, ¿aprox. cuántas veces saldrá un 6?", correctAnswer: 5, options: [3,5,6,10] },
            { eventDescription: "Sacar una bolita AZUL de una bolsa con 2 azules y 3 rojas", probability: {favorable: 2, total: 5}, numTrials: 10, questionText: "Si sacas una bolita 10 veces (devolviéndola), ¿aprox. cuántas veces saldrá AZUL?", correctAnswer: 4, options: [2,4,5,6] },
            { eventDescription: "Que una ruleta de 4 colores IGUALES (Rojo, Azul, Verde, Amarillo) caiga en ROJO", probability: {favorable: 1, total: 4}, numTrials: 40, questionText: "Si giras la ruleta 40 veces, ¿aprox. cuántas veces caerá en ROJO?", correctAnswer: 10, options: [5,10,15,20] },
        ] as PrediccionProbabilidadChallenge[]
    },
    question: '¿Aproximadamente cuántas veces ocurrirá?',
  },
  { 
    id: 'g4-s7-e3', title: 'Sucesos Dependientes e Independientes', 
    description: 'Distingue entre sucesos que se afectan mutuamente y los que no.', 
    iconName: 'ProbabilityIcon', isLocked: false, 
    componentType: ExerciseComponentType.SUCESOS_DEPENDIENTES_INDEPENDIENTES_G4, 
    data: { 
        totalStars: 8,
        challenges: [
            {eventA: "Sacar una bolita roja de una bolsa y NO devolverla.", eventB: "Sacar una segunda bolita roja de la misma bolsa.", areIndependent: false, correctAnswerId: "dependientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Al no devolver la primera bolita, cambian las condiciones para sacar la segunda."},
            {eventA: "Lanzar una moneda y que salga CARA.", eventB: "Lanzar un dado y que salga 6.", areIndependent: true, correctAnswerId: "independientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"El resultado de la moneda no afecta al resultado del dado."},
            {eventA: "Sacar una carta de un mazo.", eventB: "Sacar otra carta del mismo mazo SIN reponer la primera.", areIndependent: false, correctAnswerId: "dependientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Al no reponer la primera carta, hay una carta menos en el mazo, lo que afecta la probabilidad de la segunda."},
            {eventA: "Que hoy llueva.", eventB: "Que mañana gane tu equipo de fútbol.", areIndependent: true, correctAnswerId: "independientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"La lluvia de hoy no suele afectar el resultado de un partido de fútbol de mañana de forma directa."},
            {eventA: "Tomar un caramelo rojo de una bolsa con 3 rojos y 2 azules.", eventB: "Tomar un segundo caramelo (sin reponer el primero) y que sea azul.", areIndependent: false, correctAnswerId: "dependientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Sacar el primer caramelo cambia la cantidad de caramelos restantes."},
            {eventA: "Estudiar para un examen.", eventB: "Aprobar el examen.", areIndependent: false, correctAnswerId: "dependientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Estudiar generalmente aumenta la probabilidad de aprobar."},
            {eventA: "Elegir una manzana de una canasta.", eventB: "Elegir una naranja de OTRA canasta diferente.", areIndependent: true, correctAnswerId: "independientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Lo que elijas de una canasta no afecta lo que hay en la otra."},
             {eventA: "Girar una ruleta y obtener color verde.", eventB: "Girar la MISMA ruleta una segunda vez y obtener color verde.", areIndependent: true, correctAnswerId: "independientes", options: [{id:"independientes", label:"Independientes"}, {id:"dependientes", label:"Dependientes"}], explanation:"Cada giro de la ruleta es un evento nuevo y no se ve afectado por el anterior."},
        ] as DependenciaSucesosChallenge[]
    },
    question: '¿Son estos sucesos dependientes o independientes?',
  },
];


export const grade4ExerciseData: GradeExerciseData = {
  [SubjectId.NUMEROS]: fourthGradeNumerosExercises,
  [SubjectId.OPERACIONES]: fourthGradeOperacionesExercises,
  [SubjectId.PROBLEMAS]: fourthGradeProblemasExercises,
  [SubjectId.MEDIDAS]: fourthGradeMedidasExercises,
  [SubjectId.GEOMETRIA]: fourthGradeGeometriaExercises,
  [SubjectId.ESTADISTICA]: fourthGradeEstadisticaExercises,
  [SubjectId.PROBABILIDAD]: fourthGradeProbabilidadExercises,
};
