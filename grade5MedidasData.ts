import { Exercise, ExerciseComponentType, MetricConversionQuestChallenge } from './types';

// Metric conversion challenges data
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

// Ejercicios específicos para Quinto Grado - Medidas (s4)
export const fifthGradeMedidasExercises: Exercise[] = [
  {
    id: 'metric_conversion_quest_g5',
    title: 'Conversión de unidades métricas',
    description: 'Convierte entre diferentes unidades métricas.',
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
    id: 'perimeter_puzzle_builder_g5',
    title: 'Construye perímetros',
    description: 'Construye y calcula perímetros.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.PERIMETER_PUZZLE_BUILDER_G5,
    data: {
      totalStars: 8,
      challenges: [
        {
          id: 'rect_zoo',
          shapeType: 'Rectángulo',
          vertices: [[10, 10], [100, 10], [100, 70], [10, 70]], 
          unit: 'm',
          context: "Diseña el recinto para los leones.",
          icon: '🦁',
        },
        {
          id: 'l_shape_monkeys',
          shapeType: 'Forma de L',
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
      ],
    },
    question: 'Construye el recinto y calcula su perímetro:',
  },
  {
    id: 'area_adventure_g5',
    title: 'Aventura de áreas',
    description: 'Explora y calcula áreas.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.AREA_ADVENTURE_G5,
    data: {
      totalStars: 10,
      challenges: [
        { id: 'g5_area_tri_1', prompt: "Calcula el área de un triángulo con base 8 cm y altura 5 cm.", shapeType: 'triangle', dimensions: { base: 8, height: 5 }, unit: 'cm', correctAnswer: 20 },
        { id: 'g5_area_trap_1', prompt: "Halla el área de un trapecio con bases de 6 m y 4 m, y una altura de 3 m.", shapeType: 'trapezoid', dimensions: { base1: 6, base2: 4, height: 3 }, unit: 'm', correctAnswer: 15 },
        { id: 'g5_area_rect_1', prompt: "Un jardín rectangular mide 7 m de ancho y 4 m de alto. ¿Cuál es su área?", shapeType: 'rectangle', dimensions: { width: 7, height: 4 }, unit: 'm', correctAnswer: 28 },
        { id: 'g5_area_tri_2', prompt: "Una vela triangular tiene una base de 10 m y una altura de 7 m. Calcula el área de la vela.", shapeType: 'triangle', dimensions: { base: 10, height: 7 }, unit: 'm', correctAnswer: 35 },
      ],
      allowDecimal: true,
    },
    question: 'Calcula el área de la figura:',
  },
  {
    id: 'area_puzzle_builder_g5',
    title: 'Construye áreas',
    description: 'Construye y calcula áreas de figuras.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.AREA_PUZZLE_BUILDER_G5,
    data: {
      totalStars: 10,
      challenges: [
        {
          id: 'rect_garden',
          shapeType: 'Rectángulo',
          vertices: [[10, 10], [90, 10], [90, 70], [10, 70]],
          unit: 'm',
          context: 'Calcula el área del jardín rectangular.',
          icon: '🌻',
        },
        {
          id: 'l_shape_playground',
          shapeType: 'Forma de L',
          vertices: [[10, 10], [70, 10], [70, 50], [50, 50], [50, 90], [10, 90]],
          unit: 'm',
          context: 'Halla el área del patio de juegos en L.',
          icon: '🏀',
        },
        {
          id: 'penta_park',
          shapeType: 'Pentágono Irregular',
          vertices: [[30, 10], [90, 30], [80, 80], [40, 90], [10, 50]],
          unit: 'm',
          context: 'Calcula el área del parque pentagonal.',
          icon: '🌳',
        },
        {
          id: 'square_pool',
          shapeType: 'Cuadrado',
          vertices: [[20, 20], [80, 20], [80, 80], [20, 80]],
          unit: 'm',
          context: 'Halla el área de la piscina cuadrada.',
          icon: '🏊',
        },
      ],
    },
    question: 'Construye y calcula el área:',
  },
  {
    id: 'volumen_voyage_g5',
    title: 'Viaje por el volumen',
    description: 'Calcula el volumen de cuerpos geométricos.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.VOLUMEN_VOYAGE_G5,
    data: {
      totalStars: 8,
      challenges: [
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
      ],
      allowDecimal: false,
    },
    question: 'Calcula el volumen del cuerpo geométrico:',
  },
  {
    id: 'measurement_data_explorer_g5',
    title: 'Explorador de datos de medidas',
    description: 'Analiza y explora datos de medidas.',
    iconName: 'MeasureIcon',
    isLocked: false,
    componentType: ExerciseComponentType.MEASUREMENT_DATA_EXPLORER_G5,
    data: {
      totalStars: 10,
      challenges: [
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
      ],
    },
    question: 'Trabaja con datos de medición:',
  },
];
