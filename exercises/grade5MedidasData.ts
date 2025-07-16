

import { Exercise, ExerciseComponentType, OriginalIconName, MetricConversionQuestChallenge, PerimeterPuzzleChallenge, AreaAdventureChallenge, VolumeVoyageChallenge, MeasurementDataExplorerChallengeG5 } from './types';

// Data for the Metric Conversion Quest exercise
const metricConversionQuestChallenges: MetricConversionQuestChallenge[] = [
  // Length
  { unitType: 'length', fromUnit: 'km', toUnit: 'm', valueFrom: 3.2, correctAnswer: 3200, context: "Mide el largo de un sendero.", icon: "🗺️" },
  { unitType: 'length', fromUnit: 'm', toUnit: 'cm', valueFrom: 1.5, correctAnswer: 150, context: "Mide la altura de una puerta.", icon: "🚪" },
  { unitType: 'length', fromUnit: 'cm', toUnit: 'mm', valueFrom: 25, correctAnswer: 250, context: "Mide el ancho de un libro.", icon: "📚" },
  { unitType: 'length', fromUnit: 'm', toUnit: 'km', valueFrom: 5600, correctAnswer: 5.6, context: "Calcula la distancia de un viaje.", icon: "🚗" },
  { unitType: 'length', fromUnit: 'cm', toUnit: 'm', valueFrom: 350, correctAnswer: 3.5, context: "Mide una tela para cortinas.", icon: "✂️" },
  
  // Mass
  { unitType: 'mass', fromUnit: 'kg', toUnit: 'g', valueFrom: 2.5, correctAnswer: 2500, context: "Pesa los ingredientes para una receta.", icon: "🍰" },
  { unitType: 'mass', fromUnit: 'g', toUnit: 'kg', valueFrom: 500, correctAnswer: 0.5, context: "Pesa un paquete de harina.", icon: "⚖️" },
  { unitType: 'mass', fromUnit: 't', toUnit: 'kg', valueFrom: 1.2, correctAnswer: 1200, context: "Calcula el peso de una carga.", icon: "🚚" },
  { unitType: 'mass', fromUnit: 'kg', toUnit: 't', valueFrom: 4500, correctAnswer: 4.5, context: "Pesa un vehículo pequeño.", icon: "🚙" },

  // Capacity
  { unitType: 'capacity', fromUnit: 'l', toUnit: 'ml', valueFrom: 1.5, correctAnswer: 1500, context: "Mide el jugo en una botella.", icon: "🧃" },
  { unitType: 'capacity', fromUnit: 'ml', toUnit: 'l', valueFrom: 750, correctAnswer: 0.75, context: "Calcula la capacidad de una jarra.", icon: "💧" },
  { unitType: 'capacity', fromUnit: 'kl', toUnit: 'l', valueFrom: 0.8, correctAnswer: 800, context: "Mide el agua en un tanque pequeño.", icon: "🛢️" },
  { unitType: 'capacity', fromUnit: 'l', toUnit: 'kl', valueFrom: 3500, correctAnswer: 3.5, context: "Estima la capacidad de una piscina pequeña.", icon: "🏊" },
];

// Data for Perimeter Puzzle Builder
const perimeterPuzzleChallenges: PerimeterPuzzleChallenge[] = [
  {
    id: 'rect_zoo',
    shapeType: 'Rectángulo',
    // vertices defining a 9x6 rectangle, scaled for display
    vertices: [[10, 10], [100, 10], [100, 70], [10, 70]], 
    unit: 'm',
    context: "Diseña el recinto para los leones.",
    icon: '🦁',
  },
  {
    id: 'l_shape_monkeys',
    shapeType: 'Forma de L',
    // L-shape: 10x8 total, with a 4x4 cutout
    vertices: [[10, 10], [110, 10], [110, 50], [70, 50], [70, 90], [10, 90]],
    unit: 'm',
    context: "Construye el área de juegos de los monos.",
    icon: '🐵',
  },
  {
    id: 'penta_birds',
    shapeType: 'Pentágono Irregular',
    vertices: [[50, 10], [110, 40], [90, 90], [30, 90], [10, 50]],
    unit: 'm',
    context: "Delimita el aviario de aves exóticas.",
    icon: '🦜',
  },
   {
    id: 'square_pandas',
    shapeType: 'Cuadrado',
    vertices: [[20, 10], [90, 10], [90, 80], [20, 80]],
    unit: 'm',
    context: "Prepara el hábitat de los pandas.",
    icon: '🐼',
  },
];

const areaAdventureChallenges: AreaAdventureChallenge[] = [
    { id: 'g5_area_tri_1', prompt: "Calcula el área de un triángulo con base 8 cm y altura 5 cm.", shapeType: 'triangle', dimensions: { base: 8, height: 5 }, unit: 'cm', correctAnswer: 20 },
    { id: 'g5_area_trap_1', prompt: "Halla el área de un trapecio con bases de 6 m y 4 m, y una altura de 3 m.", shapeType: 'trapezoid', dimensions: { base1: 6, base2: 4, height: 3 }, unit: 'm', correctAnswer: 15 },
    { id: 'g5_area_rect_1', prompt: "Un jardín rectangular mide 7 m de ancho y 4 m de alto. ¿Cuál es su área?", shapeType: 'rectangle', dimensions: { width: 7, height: 4 }, unit: 'm', correctAnswer: 28 },
    { id: 'g5_area_tri_2', prompt: "Una vela triangular tiene una base de 10 m y una altura de 7 m. Calcula el área de la vela.", shapeType: 'triangle', dimensions: { base: 10, height: 7 }, unit: 'm', correctAnswer: 35 },
    { id: 'g5_area_rect_2', prompt: "Calcula el área de una hoja de papel de 12 cm de ancho por 10 cm de alto.", shapeType: 'rectangle', dimensions: { width: 12, height: 10 }, unit: 'cm', correctAnswer: 120 },
    { id: 'g5_area_trap_2', prompt: "Una parcela de tierra tiene forma de trapecio. Sus bases miden 8 cm y 5 cm, y su altura es de 4 cm. ¿Cuál es su área?", shapeType: 'trapezoid', dimensions: { base1: 8, base2: 5, height: 4 }, unit: 'cm', correctAnswer: 26 },
    { id: 'g5_area_tri_3', prompt: "Calcula el área de un triángulo con una base y altura de 6 cm cada una.", shapeType: 'triangle', dimensions: { base: 6, height: 6 }, unit: 'cm', correctAnswer: 18 },
    { id: 'g5_area_rect_3', prompt: "Encuentra el área de un terreno cuadrado con lados de 9 m.", shapeType: 'rectangle', dimensions: { width: 9, height: 9 }, unit: 'm', correctAnswer: 81 },
    { id: 'g5_area_tri_4', prompt: "Una pequeña pieza de metal triangular tiene una base de 5 cm y una altura de 3 cm. ¿Cuál es su área?", shapeType: 'triangle', dimensions: { base: 5, height: 3 }, unit: 'cm', correctAnswer: 7.5 },
    { id: 'g5_area_trap_3', prompt: "Calcula el área de un trapecio cuyas bases son 10 m y 8 m, y su altura es de 5 m.", shapeType: 'trapezoid', dimensions: { base1: 10, base2: 8, height: 5 }, unit: 'm', correctAnswer: 45 },
];

// Volume Voyage Challenges
const volumeVoyageChallenges: VolumeVoyageChallenge[] = [
    { 
        id: 'cube_4cm', 
        prompt: "Calcula el volumen de un cubo con lado 4 cm.", 
        shapeType: 'cubo', 
        dimensions: { length: 4, width: 4, height: 4 }, 
        unit: 'cm', 
        icon: '🧊', 
        correctAnswer: 64 
    },
    { 
        id: 'prism_5x3x2', 
        prompt: "Encuentra el volumen de un prisma rectangular con largo 5 m, ancho 3 m, y alto 2 m.", 
        shapeType: 'prismaRectangular', 
        dimensions: { length: 5, width: 3, height: 2 }, 
        unit: 'm', 
        icon: '📦', 
        correctAnswer: 30 
    },
    { 
        id: 'cube_2cm', 
        prompt: "Si construyes un cubo con arista de 2 cm, ¿cuál es su volumen?", 
        shapeType: 'cubo', 
        dimensions: { length: 2, width: 2, height: 2 }, 
        unit: 'cm', 
        icon: '🧊', 
        correctAnswer: 8 
    },
    { 
        id: 'prism_6x2x3', 
        prompt: "Calcula el volumen de una caja de 6 cm de largo, 2 cm de ancho y 3 cm de alto.", 
        shapeType: 'prismaRectangular', 
        dimensions: { length: 6, width: 2, height: 3 }, 
        unit: 'cm', 
        icon: '🎁', 
        correctAnswer: 36 
    },
    { 
        id: 'cube_3m', 
        prompt: "Un tanque de agua tiene forma de cubo con lado 3 m. ¿Cuál es su volumen?", 
        shapeType: 'cubo', 
        dimensions: { length: 3, width: 3, height: 3 }, 
        unit: 'm', 
        icon: '💧', 
        correctAnswer: 27 
    },
    { 
        id: 'prism_10x4x5', 
        prompt: "Diseña una estación espacial con dimensiones de 10 m x 4 m x 5 m. ¿Cuál es su volumen?", 
        shapeType: 'prismaRectangular', 
        dimensions: { length: 10, width: 4, height: 5 }, 
        unit: 'm', 
        icon: '🚀', 
        correctAnswer: 200 
    },
];

// Measurement Data Explorer Challenges
const measurementDataExplorerChallenges: MeasurementDataExplorerChallengeG5[] = [
    {
        id: 'plant_heights',
        mode: 'create',
        title: "¡Estamos midiendo el crecimiento de nuestras plantas!",
        data: [2.5, 3, 2.5, 4],
        unit: 'cm',
        question: "¿Cuántas plantas miden 2.5 cm?",
        correctAnswer: 2,
        dotIcon: "🌱",
        lineRange: [0, 5],
        step: 0.5,
    },
    {
        id: 'weights_sum',
        mode: 'interpret',
        title: "Observa las pesas en la balanza del laboratorio.",
        data: [0.5, 0.5, 1],
        unit: 'kg',
        question: "¿Cuál es el peso total de todas las pesas?",
        correctAnswer: 2,
        dotIcon: "⚖️",
        lineRange: [0, 2],
        step: 0.5,
    },
    {
        id: 'temperatures_mean',
        mode: 'create',
        title: "Registramos temperaturas para nuestro experimento.",
        data: [22, 24, 23, 22, 25],
        unit: '°C',
        question: "¿Cuál es la temperatura más frecuente?",
        correctAnswer: 22,
        dotIcon: "🌡️",
        lineRange: [20, 26],
        step: 1,
    },
    {
        id: 'pencil_lengths',
        mode: 'create',
        title: "Medimos lápices usados en nuestra clase.",
        data: [12, 10, 10, 8, 12, 9],
        unit: 'cm',
        question: "¿Cuántos lápices miden 10 cm?",
        correctAnswer: 2,
        dotIcon: "✏️",
        lineRange: [7, 13],
        step: 1,
    },
    {
        id: 'liquid_volumes',
        mode: 'interpret',
        title: "Volúmenes de líquidos medidos en probetas.",
        data: [25, 50, 25, 75, 50],
        unit: 'ml',
        question: "¿Cuál es la diferencia entre el mayor y menor volumen?",
        correctAnswer: 50,
        dotIcon: "💧",
        lineRange: [0, 100],
        step: 25,
    },
    {
        id: 'jump_distances',
        mode: 'create',
        title: "Distancias de saltos en clase de educación física.",
        data: [1.5, 1.2, 1.2, 1.8, 1.5, 1.3],
        unit: 'm',
        question: "¿Cuál es la moda (valor más frecuente) de las distancias de salto?",
        correctAnswer: 1.5,
        dotIcon: "🏃",
        lineRange: [1, 2],
        step: 0.1,
    },
];

export const fifthGradeMedidasExercises: Exercise[] = [
  { 
    id: 'g5-s4-e1', 
    title: 'Metric Conversion Quest', 
    description: 'Convierte unidades de longitud, masa y capacidad en una aventura de medición.', 
    iconName: 'MeasureIcon', 
    isLocked: false, 
    componentType: ExerciseComponentType.METRIC_CONVERSION_QUEST_G5,
    data: { 
        totalStars: 10,
        challenges: metricConversionQuestChallenges,
    },
    question: 'Realiza la conversión métrica para completar la misión:',
  },
  {
    id: 'g5-s4-e2',
    title: 'Perimeter Puzzle Builder',
    description: 'Mide y calcula el perímetro de recintos para un zoológico.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PERIMETER_PUZZLE_BUILDER_G5,
    data: {
      totalStars: 8,
      challenges: perimeterPuzzleChallenges,
    },
    question: 'Construye el recinto y calcula su perímetro:',
  },
  {
    id: 'g5-s4-e3',
    title: 'Area Adventure',
    description: 'Calcula áreas de triángulos, rectángulos y otras figuras.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.AREA_ADVENTURE_G5,
    data: {
      totalStars: 10,
      challenges: areaAdventureChallenges,
      allowDecimal: true,
    },
    question: 'Calcula el área de la figura:',
  },
  {
    id: 'g5-s4-e4',
    title: 'Volume Voyage',
    description: 'Explora y calcula el volumen de cuerpos geométricos.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.VOLUMEN_VOYAGE_G5,
    data: {
      totalStars: 8,
      challenges: volumeVoyageChallenges,
      allowDecimal: false,
    },
    question: 'Calcula el volumen del cuerpo geométrico:',
  },
  {
    id: 'g5-s4-e5',
    title: 'Measurement Data Explorer',
    description: 'Crea e interpreta gráficos de puntos con datos de medición.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MEASUREMENT_DATA_EXPLORER_G5,
    data: {
      totalStars: 10,
      challenges: measurementDataExplorerChallenges,
    },
    question: 'Trabaja con datos de medición:',
  }
];