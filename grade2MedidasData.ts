
import { Exercise, ExerciseComponentType, OriginalIconName, TimeChallengeData } from './types';

export const secondGradeMedidasExercises: Exercise[] = [
  { 
    id: 'g2-s4-e1', title: 'Medir Longitudes con Regla (cm)', 
    description: 'Usa la regla para medir objetos en centímetros.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.MEDIR_CON_REGLA_CM,
    data: { totalStars: 5, rulerMaxCm: 15, challenges: [ { objectEmoji: '🖍️', lengthCm: 8, label:'Crayón'}, { objectEmoji: '🔑', lengthCm: 6, label:'Llave'}, { objectEmoji: '📱', lengthCm: 12, label:'Celular'} ] },
    question: '¿Cuántos centímetros mide el objeto?',
  },
  { 
    id: 'g2-s4-e2', title: 'Comparar Pesos (Balanza)', 
    description: 'Observa la balanza y decide qué objeto pesa más o menos.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.BALANZA_1KG, // Reusing this, assuming 1kg is a reference
    data: { totalStars: 5, challenges: [{objectEmoji:'📚', objectLabel:'Libro', actualWeightGrams:500, correctAnswer:'MENOS_DE_1KG'}, {objectEmoji:'🧱', objectLabel:'Ladrillo', actualWeightGrams:1500, correctAnswer:'MAS_DE_1KG'}, {objectEmoji:'⚖️', objectLabel:'Paquete Azúcar', actualWeightGrams:1000, correctAnswer:'IGUAL_A_1KG'}] },
    question: 'El objeto, ¿pesa más, menos o igual a 1kg?',
  },
  { 
    id: 'g2-s4-e3', title: 'Leer el Reloj (Horas y Medias Horas)', 
    description: 'Identifica la hora en punto y las medias horas en un reloj analógico.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.LEER_RELOJ_OPCIONES,
    data: { totalStars: 8, 
        times: [
            { hours: 2, minutes: 0, correctText: "Son las dos en punto", distractors: ["Son las dos y media", "Es la una y media"] },
            { hours: 4, minutes: 30, correctText: "Son las cuatro y media", distractors: ["Son las cuatro en punto", "Son las cinco menos cuarto"] },
            { hours: 7, minutes: 0, correctText: "Son las siete en punto", distractors: ["Son las siete y cuarto", "Son las seis y media"] },
            { hours: 1, minutes: 30, correctText: "Es la una y media", distractors: ["Es la una en punto", "Son las dos y media"] },
            { hours: 10, minutes: 0, correctText: "Son las diez en punto", distractors: ["Son las diez y media", "Son las nueve y media"] },
            { hours: 5, minutes: 30, correctText: "Son las cinco y media", distractors: ["Son las cinco en punto", "Son las seis menos cuarto"] },
            { hours: 12, minutes: 30, correctText: "Son las doce y media", distractors: ["Son las doce en punto", "Es la una menos veinte"] },
            { hours: 8, minutes: 0, correctText: "Son las ocho en punto", distractors: ["Son las ocho y cuarto", "Son las siete y media"] },
        ] as TimeChallengeData[]
    },
    question: '¿Qué hora es?',
  },
  { 
    id: 'g2-s4-e4', title: 'Días de la Semana', 
    description: 'Ordena los días de la semana.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.SECUENCIA_DIA_SEMANA,
    data: { totalStars: 3, days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
    question: 'Ordena los días de la semana, empezando por Lunes.',
  },
  { 
    id: 'g2-s4-e5', title: 'Meses del Año', 
    description: 'Reconoce el orden de los meses del año.', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.SECUENCIA_MES_ANIO,
    data: { totalStars: 3, months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] },
    question: 'Ordena los meses del año, empezando por Enero.',
  },
  {
    id: 'g2-s4-e6', title: 'Monedas: Sumar Pesos (hasta $20)', 
    description: 'Suma el valor de monedas de $1, $2, $5 y $10 (hasta $20).', 
    iconName: 'MeasureIcon', isLocked: false, 
    componentType: ExerciseComponentType.SUMAR_ITEMS_MONETARIOS_SIMPLES,
    data: {
      totalStars: 8,
      problems: [ 
        { items: [{value: 100, count: 3, label: "$1"}, {value: 200, count: 1, label: "$2"}]},
        { items: [{value: 500, count: 1, label: "$5"}, {value: 100, count: 2, label: "$1"}]},
        { items: [{value: 1000, count: 1, label: "$10"}, {value: 200, count: 3, label: "$2"}]},
        { items: [{value: 500, count: 2, label: "$5"}, {value: 100, count: 4, label: "$1"}]},
        { items: [{value: 200, count: 5, label: "$2"}]},
        { items: [{value: 100, count: 7, label: "$1"}, {value: 500, count: 1, label: "$5"}]},
        { items: [{value: 1000, count: 1, label: "$10"}, {value: 500, count: 1, label: "$5"}, {value: 200, count:2, label: "$2"}]},
        { items: [{value: 200, count: 4, label: "$2"}, {value: 500, count: 2, label: "$5"}]},
      ]
    },
    question: '¿Cuántos pesos hay en total?',
  },
];
