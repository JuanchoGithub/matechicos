
import { Exercise, ExerciseComponentType, OriginalIconName } from './types';
import { ScenarioSetId } from './exercises/problemScenarios/index';

// Data for 1st Grade - Medidas (s4)
// g1-s4-eX
export const firstGradeMedidasExercises: Exercise[] = [
  { 
    id: 'g1-s4-e1', 
    title: 'Más Alto, Igual, Más Bajo', 
    description: 'Compara alturas de objetos.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_ALTURAS, 
    data: { 
        totalStars: 5, 
        challenges: [
            { visualA: '🦒', labelA: 'Jirafa', visualB: '🐜', labelB: 'Hormiga', correctAnswer: 'A_MAS_ALTO' },
            { visualA: '🌳', labelA: 'Árbol', visualB: '🍄', labelB: 'Hongo', correctAnswer: 'A_MAS_ALTO' },
            { visualA: '🧍', labelA: 'Persona', visualB: '🧍', labelB: 'Persona', correctAnswer: 'IGUAL_ALTURA' },
            { visualA: '🏠', labelA: 'Casa', visualB: '🏢', labelB: 'Edificio', correctAnswer: 'B_MAS_ALTO' },
            { visualA: '📏', labelA: 'Regla', visualB: '✏️', labelB: 'Lápiz', correctAnswer: 'A_MAS_ALTO', note: "Asumiendo regla típica vs lápiz" },
        ]
    },
    question: '¿Cuál es más alto, más bajo o son iguales?',
  },
  { 
    id: 'g1-s4-e2', 
    title: 'Más Largo, Igual, Más Corto', 
    description: 'Compara longitudes de objetos.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_LONGITUDES, 
    data: { 
        totalStars: 5,
        challenges: [
            { visualA: '🐛', labelA: 'Gusano', visualB: '🐍', labelB: 'Serpiente', correctAnswer: 'B_MAS_LARGO' },
            { visualA: '🥖', labelA: 'Baguette', visualB: '✏️', labelB: 'Lápiz Corto', correctAnswer: 'A_MAS_LARGO' },
            { visualA: '📏', labelA: 'Regla 1', visualB: '📏', labelB: 'Regla 2', correctAnswer: 'IGUAL_LARGO' },
            { visualA: '✈️', labelA: 'Avión', visualB: '🚗', labelB: 'Auto', correctAnswer: 'A_MAS_LARGO' },
            { visualA: '🥄', labelA: 'Cuchara', visualB: '🍴', labelB: 'Tenedor', correctAnswer: 'IGUAL_LARGO', note:"Depende del tipo, pero para niños suelen ser similares" },
        ]
    },
    question: '¿Cuál es más largo, más corto o son iguales?',
  },
  { 
    id: 'g1-s4-e3', 
    title: 'Medir con Regla (cm)', 
    description: 'Mide objetos simples en centímetros usando una regla visual.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.MEDIR_CON_REGLA_CM, 
    data: { 
        totalStars: 5,
        rulerMaxCm: 10, // Ruler from 0 to 10 cm
        challenges: [
            { objectEmoji: '✏️', lengthCm: 7, label: 'Lápiz' },
            { objectEmoji: '🐛', lengthCm: 4, label: 'Gusano' },
            { objectEmoji: '🔑', lengthCm: 5, label: 'Llave' },
            { objectEmoji: '🍫', lengthCm: 9, label: 'Barra de Chocolate' },
            { objectEmoji: '📎', lengthCm: 3, label: 'Clip' },
        ]
    },
    question: '¿Cuántos centímetros mide?',
  },
  { 
    id: 'g1-s4-e4', 
    title: 'Pesa Más, Pesa Menos', 
    description: 'Compara conceptualmente el peso de dos objetos.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_PESOS_CONCEPTUAL, 
    data: {
        totalStars: 5,
        challenges: [
            { visualA: '🐘', labelA: 'Elefante', visualB: '🎈', labelB: 'Globo', correctAnswer: 'A_MAS_PESADO', questionType: 'MAS_PESADO' },
            { visualA: '🧱', labelA: 'Ladrillo', visualB: '🪶', labelB: 'Pluma', correctAnswer: 'A_MAS_PESADO', questionType: 'MAS_PESADO' },
            { visualA: '🍉', labelA: 'Sandía', visualB: '🍎', labelB: 'Manzana', correctAnswer: 'A_MAS_PESADO', questionType: 'MAS_PESADO' },
            { visualA: '🚗', labelA: 'Auto', visualB: '🚲', labelB: 'Bicicleta', correctAnswer: 'A_MAS_PESADO', questionType: 'MAS_PESADO' },
            { visualA: '📖', labelA: 'Libro', visualB: '📄', labelB: 'Hoja de Papel', correctAnswer: 'A_MAS_PESADO', questionType: 'MAS_PESADO' },
        ]
    },
    question: '¿Cuál pesa más?', 
  },
  { 
    id: 'g1-s4-e5', 
    title: 'Balanza: Comparar con 1kg', 
    description: 'Decide si un objeto pesa más, menos o igual a 1kg usando una balanza.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.BALANZA_1KG, 
    data: {
        totalStars: 5,
        challenges: [
            { objectEmoji: '🍉', objectLabel: "Sandía Mediana", actualWeightGrams: 3000, correctAnswer: 'MAS_DE_1KG' },
            { objectEmoji: '🍎', objectLabel: "Manzana", actualWeightGrams: 150, correctAnswer: 'MENOS_DE_1KG' },
            { objectEmoji: '🛍️', objectLabel: "Paquete de Azúcar", actualWeightGrams: 1000, correctAnswer: 'IGUAL_A_1KG' },
            { objectEmoji: '📚', objectLabel: "Libro Grueso", actualWeightGrams: 1200, correctAnswer: 'MAS_DE_1KG' },
            { objectEmoji: '✏️', objectLabel: "Lápiz", actualWeightGrams: 5, correctAnswer: 'MENOS_DE_1KG' },
        ]
    },
    question: 'El objeto, ¿pesa más, menos o igual a 1kg?',
  },
  { 
    id: 'g1-s4-e6', 
    title: 'Capacidad: Más o Menos de 1 Litro', 
    description: 'Compara la capacidad de recipientes con 1 litro.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_CAPACIDAD_1L, 
    data: {
        totalStars: 5,
        challenges: [
            { itemEmoji: '🥄', itemLabel: "Cuchara", correctAnswer: 'MENOS_DE_1L' },
            { itemEmoji: '🥛', itemLabel: "Vaso de Agua", correctAnswer: 'MENOS_DE_1L' },
            { itemEmoji: '🪣', itemLabel: "Balde", correctAnswer: 'MAS_DE_1L' },
            { itemEmoji: '🍾', itemLabel: "Botella de Gaseosa (2L)", correctAnswer: 'MAS_DE_1L' },
            { itemEmoji: '💧', itemLabel: "Gotero", correctAnswer: 'MENOS_DE_1L' },
        ]
    },
    question: 'Este recipiente, ¿tiene más, menos o aproximadamente 1 litro de capacidad?',
  },
  { 
    id: 'g1-s4-e7', 
    title: 'Sumar Litros', 
    description: 'Resuelve problemas sumando litros.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.PROBLEMAS_CAPACIDAD_SUMA_RESTA,
    data: {
        totalStars: 5,
        problems: [
          { id: 'g1_litros1', textTemplate: (n1: number, n2: number) => `En una jarra hay ${n1} litro${n1===1?'':'s'}. Se añade${n2===1?'':'n'} ${n2} litro${n2===1?'':'s'} más. ¿Cuántos litros hay ahora?`, num1Range: [1, 5], num2Range: [1, 5], operation: '+', unit: "litros", resultUnitSingular: "litro", resultUnitPlural: "litros", emoji: "🫙" },
          { id: 'g1_litros2', textTemplate: (n1: number, n2: number) => `Un balde tiene ${n1} litro${n1===1?'':'s'} de agua. Otro balde tiene ${n2} litro${n2===1?'':'s'}. Si juntas el agua, ¿cuántos litros tienes?`, num1Range: [2, 6], num2Range: [1, 4], operation: '+', unit: "litros", resultUnitSingular: "litro", resultUnitPlural: "litros", emoji: "🪣" },
        ]
    },
    question: '¿Cuántos litros hay en total?',
  },
  { 
    id: 'g1-s4-e8', 
    title: 'Sumar Dinero (Pesos)', 
    description: 'Suma el valor de monedas y billetes simples.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.SUMAR_ITEMS_MONETARIOS_SIMPLES,
    data: {
        totalStars: 5,
        problems: [ // value is in cents
          { items: [{value: 100, count: 2, label: "$1"}, {value: 200, count: 1, label: "$2"}]}, 
          { items: [{value: 500, count: 1, label: "$5"}, {value: 100, count: 3, label: "$1"}]}, 
          { items: [{value: 1000, count: 1, label: "$10"}, {value: 200, count: 2, label: "$2"}]},
          { items: [{value: 100, count: 1, label: "$1"}, {value: 200, count: 1, label: "$2"}, {value: 500, count: 1, label: "$5"}]},
          { items: [{value: 1000, count: 1, label: "$10"}, {value: 500, count: 1, label: "$5"}, {value:100, count:1, label: "$1"}]},
        ]
    },
    question: '¿Cuántos pesos hay en total?',
  },
  { 
    id: 'g1-s4-e9', 
    title: 'Monedas y $1', 
    description: 'Compara el valor de un grupo de monedas con $1.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO,
    data: {
        totalStars: 5,
        coinCollections: [ // value is in cents
          { coins: [{value: 50, count: 1, label: "50c"}, {value: 10, count: 3, label:"10c"}], correctOption: 'less' }, 
          { coins: [{value: 25, count: 4, label: "25c"}], correctOption: 'equal' }, 
          { coins: [{value: 50, count: 1, label: "50c"}, {value: 25, count: 2, label:"25c"}, {value:10, count:1, label:"10c"}], correctOption: 'more' }, 
          { coins: [{value: 10, count: 10, label: "10c"}], correctOption: 'equal' },
          { coins: [{value: 50, count: 1, label: "50c"}, {value: 10, count: 6, label:"10c"}], correctOption: 'more' },
        ]
    },
    question: 'El valor total de las monedas es:',
  },
  { 
    id: 'g1-s4-e10', 
    title: 'Mes Anterior y Posterior', 
    description: 'Identifica el mes anterior y posterior a uno dado.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.CALENDARIO_MES_ANT_POST,
    data: {
        totalStars: 5,
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    question: 'Indica el mes anterior y el posterior:',
  },
  { 
    id: 'g1-s4-e11', 
    title: 'Leer el Reloj (Horas en Punto)', 
    description: 'Lee la hora en punto en un reloj de agujas.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.LEER_RELOJ_OPCIONES,
    data: {
        totalStars: 3, 
        times: [
          { hours: 3, minutes: 0, correctText: "Son las tres", distractors: ["Son las doce", "Son las cuatro", "Son las cinco"] },
          { hours: 6, minutes: 0, correctText: "Son las seis", distractors: ["Son las cinco", "Son las siete", "Son las doce"] },
          { hours: 11, minutes: 0, correctText: "Son las once", distractors: ["Son las diez", "Es la una", "Son las nueve"] },
          // Adding a few more for variety if needed, ensuring totalStars is matched
          { hours: 1, minutes: 0, correctText: "Es la una", distractors: ["Son las dos", "Son las doce", "Son las tres"] },
          { hours: 8, minutes: 0, correctText: "Son las ocho", distractors: ["Son las siete", "Son las nueve", "Son las diez"] },
          { hours: 12, minutes: 0, correctText: "Son las doce", distractors: ["Es la una", "Son las once", "Son las dos"] },
        ]
    },
    question: '¿Qué hora marca el reloj?',
  },
  { 
    id: 'g1-s4-e12', 
    title: 'Completar Días de la Semana', 
    description: 'Completa la letra que falta en los días de la semana.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPLETAR_PALABRA_SIMPLE,
    data: {
        totalStars: 7,
        wordType: "Día de la Semana",
        words: [
            { gappedWord: "LUN_S", missingLetter: "E", options: ["A", "E", "I"], correctAnswer: "E" },
            { gappedWord: "MA_TES", missingLetter: "R", options: ["N", "R", "P"], correctAnswer: "R" },
            { gappedWord: "MIÉRCOL_S", missingLetter: "E", options: ["A", "O", "E"], correctAnswer: "E" },
            { gappedWord: "JU_VES", missingLetter: "E", options: ["I", "E", "U"], correctAnswer: "E" },
            { gappedWord: "VIE_NES", missingLetter: "R", options: ["M", "S", "R"], correctAnswer: "R" },
            { gappedWord: "SÁBA_O", missingLetter: "D", options: ["B", "D", "T"], correctAnswer: "D" },
            { gappedWord: "DOMI_GO", missingLetter: "N", options: ["M", "N", "L"], correctAnswer: "N" },
        ]
    },
    question: '¿Qué letra falta?',
  },
  { 
    id: 'g1-s4-e13', 
    title: 'Completar Meses del Año', 
    description: 'Completa la letra que falta en los meses del año.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.COMPLETAR_PALABRA_SIMPLE,
    data: {
        totalStars: 6, 
        wordType: "Mes del Año",
        words: [
            { gappedWord: "EN_RO", missingLetter: "E", options: ["A", "E", "I"], correctAnswer: "E" },
            { gappedWord: "FEBR_RO", missingLetter: "E", options: ["A", "U", "E"], correctAnswer: "E" },
            { gappedWord: "MA_ZO", missingLetter: "R", options: ["N", "R", "P"], correctAnswer: "R" },
            { gappedWord: "ABR_L", missingLetter: "I", options: ["A", "E", "I"], correctAnswer: "I" },
            { gappedWord: "MA_O", missingLetter: "Y", options: ["L", "Y", "Z"], correctAnswer: "Y" },
            { gappedWord: "JUN_O", missingLetter: "I", options: ["U", "I", "A"], correctAnswer: "I" },
        ]
    },
    question: '¿Qué letra falta?',
  },
  { 
    id: 'g1-s4-e14', 
    title: 'Días: Antes y Después', 
    description: 'Indica el día anterior y posterior al mostrado.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.SECUENCIA_DIA_SEMANA,
    data: {
        totalStars: 5,
        days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    },
    question: '¿Qué día fue ayer y qué día será mañana?',
  },
  { 
    id: 'g1-s4-e15', 
    title: 'Meses: Antes y Después', 
    description: 'Indica el mes anterior y posterior al mostrado.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.SECUENCIA_MES_ANIO,
    data: {
        totalStars: 5,
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    question: '¿Cuál fue el mes anterior y cuál será el próximo mes?',
  },
];
