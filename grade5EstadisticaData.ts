import { Exercise, ExerciseComponentType, LinePlotScenarioTemplate } from './types';
import { barGraphBuilderExercise } from './barGraphBuilderData';
import { meanValueMissionExercise } from './meanValueMissionData';
import { dataCollectionQuestExercise } from './dataCollectionQuestData';

// Line Plot Creator exercise data
const linePlotScenarios: LinePlotScenarioTemplate[] = [
  {
    scenarioId: 'pet-weights',
    title: 'Pesos de Mascotas',
    description: 'Crea un gráfico de puntos para representar los siguientes pesos de mascotas: 3 kg, 4 kg, 3 kg, 5 kg.',
    dataPoints: [
      { value: 3 },
      { value: 4 },
      { value: 3 },
      { value: 5 }
    ],
    question: {
      text: '¿Cuántas mascotas pesan 3 kg?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      explanation: 'Hay dos mascotas que pesan 3 kg, como se muestra en el gráfico con dos X en el valor 3.'
    },
    range: [0, 6],
    step: 1,
    unit: ' kg',
    icon: '🐾'
  },
  {
    scenarioId: 'student-heights',
    title: 'Alturas de Estudiantes',
    description: 'Crea un gráfico de puntos para representar las siguientes alturas de estudiantes: 1.2 m, 1.3 m, 1.2 m, 1.4 m.',
    dataPoints: [
      { value: 1.2 },
      { value: 1.3 },
      { value: 1.2 },
      { value: 1.4 }
    ],
    question: {
      text: '¿Cuál es la altura más común?',
      options: ['1.2 m', '1.3 m', '1.4 m', 'Todas igual'],
      correctAnswer: '1.2 m',
      explanation: 'La altura 1.2 m aparece dos veces en el gráfico, siendo la más frecuente.'
    },
    range: [1.0, 1.5],
    step: 0.1,
    unit: ' m',
    icon: '📏'
  },
  {
    scenarioId: 'leaf-lengths',
    title: 'Longitud de Hojas',
    description: 'En nuestro experimento de ciencias, medimos la longitud de varias hojas. Crea un gráfico de puntos con estas medidas: 2.5 cm, 3.0 cm, 2.5 cm, 4.0 cm, 3.5 cm.',
    dataPoints: [
      { value: 2.5 },
      { value: 3.0 },
      { value: 2.5 },
      { value: 4.0 },
      { value: 3.5 }
    ],
    question: {
      text: '¿Qué longitud de hoja se midió más veces?',
      options: ['2.5 cm', '3.0 cm', '3.5 cm', '4.0 cm'],
      correctAnswer: '2.5 cm',
      explanation: 'La longitud 2.5 cm aparece dos veces en el gráfico, siendo la más frecuente.'
    },
    range: [2.0, 4.5],
    step: 0.5,
    unit: ' cm',
    icon: '🍃'
  },
  {
    scenarioId: 'fruit-weights',
    title: 'Pesos de Frutas',
    description: 'En el mercado, pesamos varias manzanas. Crea un gráfico de puntos con estos pesos: 150 g, 200 g, 150 g, 250 g, 200 g, 250 g.',
    dataPoints: [
      { value: 150 },
      { value: 200 },
      { value: 150 },
      { value: 250 },
      { value: 200 },
      { value: 250 }
    ],
    question: {
      text: '¿Cuál es el peso más frecuente?',
      options: ['150 g', '200 g', '250 g', '150 g y 200 g'],
      correctAnswer: '150 g y 200 g',
      explanation: 'Tanto 150 g como 250 g aparecen dos veces cada uno en el gráfico, siendo los más frecuentes.'
    },
    range: [100, 300],
    step: 50,
    unit: ' g',
    icon: '🍎'
  },
  {
    scenarioId: 'book-pages',
    title: 'Páginas de Libros',
    description: 'Contamos las páginas de varios libros en la biblioteca. Crea un gráfico de puntos con estos datos: 50 páginas, 100 páginas, 150 páginas, 100 páginas, 200 páginas, 150 páginas.',
    dataPoints: [
      { value: 50 },
      { value: 100 },
      { value: 150 },
      { value: 100 },
      { value: 200 },
      { value: 150 }
    ],
    question: {
      text: '¿Cuántos libros tienen 100 páginas?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      explanation: 'Hay dos libros con 100 páginas, como se muestra en el gráfico con dos X en el valor 100.'
    },
    range: [0, 250],
    step: 50,
    unit: ' páginas',
    icon: '📚'
  }
];

// Range Finder Challenge data
const rangeFinderChallenges = [
  {
    dataSet: [10, 12, 8, 15],
    context: 'temperaturas',
    unit: '°C',
    minValue: 8,
    maxValue: 15,
    range: 7
  },
  {
    dataSet: [1.5, 2, 1.8],
    context: 'alturas de plantas',
    unit: 'm',
    minValue: 1.5,
    maxValue: 2,
    range: 0.5
  },
  {
    dataSet: [23, 19, 25, 21, 27],
    context: 'temperaturas',
    unit: '°C',
    minValue: 19,
    maxValue: 27,
    range: 8
  },
  {
    dataSet: [4.2, 3.8, 4.5, 3.9],
    context: 'longitudes',
    unit: 'cm',
    minValue: 3.8,
    maxValue: 4.5,
    range: 0.7
  },
  {
    dataSet: [120, 95, 135, 110, 125],
    context: 'puntajes de juego',
    unit: 'puntos',
    minValue: 95,
    maxValue: 135,
    range: 40
  }
];

// Specific exercises for Fifth Grade - Estadistica
export const fifthGradeEstadisticaExercises: Exercise[] = [
  {
    id: 'g5-s5-e1',
    title: 'Creador de Gráficos de Puntos',
    description: 'Crea y analiza gráficos de puntos usando datos de mediciones.',
    iconName: 'StatisticsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.LINE_PLOT_CREATOR_G5,
    data: linePlotScenarios
  },
  {
    id: 'g5-s5-e4', 
    title: 'Reto Calculador de Rango',
    description: 'Calcula el rango de un conjunto de datos identificando los valores mínimos y máximos.',
    iconName: 'StatisticsIcon',
    isLocked: false,
    componentType: ExerciseComponentType.RANGE_FINDER_CHALLENGE,
    data: rangeFinderChallenges
  },
  barGraphBuilderExercise,
  meanValueMissionExercise,
  dataCollectionQuestExercise
];
