import { Exercise, ExerciseComponentType, MeanValueQuestion } from './types';

const meanValueScenarios: MeanValueQuestion[] = [
  {
    id: 'test-scores',
    title: 'Media de Calificaciones',
    description: 'Ayuda a calcular la media de las calificaciones del equipo',
    context: 'Encuentra la media de estas calificaciones del examen: 80, 90, 70.',
    values: [80, 90, 70],
    visualization: 'scale',
    feedback: {
      correct: '¡Excelente! (80 + 90 + 70) ÷ 3 = 80.',
      incorrect: 'Recuerda sumar todos los valores y dividir por la cantidad de datos.'
    },
    hint: 'Para calcular la media: Suma todos los valores y divide por la cantidad de datos.',
    emoji: '📊'
  },
  {
    id: 'running-distances',
    title: 'Media de Distancias',
    description: 'Calcula la distancia media recorrida',
    context: 'Calcula la media de estas distancias corridas: 2.5 km, 3 km, 2 km.',
    values: [2.5, 3, 2],
    unit: 'km',
    visualization: 'numberLine',
    feedback: {
      correct: '¡Correcto! (2.5 + 3 + 2) ÷ 3 = 2.5 km.',
      incorrect: 'Recuerda sumar todas las distancias y dividir por la cantidad de datos.'
    },
    hint: 'La media representa el punto de equilibrio de todos los valores.',
    emoji: '🏃'
  },
  {
    id: 'book-pages',
    title: 'Media de Páginas',
    description: 'Calcula el promedio de páginas',
    context: 'Calcula la media de páginas leídas: 15, 25, 20, 30.',
    values: [15, 25, 20, 30],
    unit: ' páginas',
    visualization: 'scale',
    feedback: {
      correct: '¡Excelente! (15 + 25 + 20 + 30) ÷ 4 = 22.5 páginas.',
      incorrect: 'Asegúrate de dividir por el número correcto de valores (4).'
    },
    hint: 'Suma todos los valores y divide por 4.',
    emoji: '📚'
  },
  {
    id: 'temperatures',
    title: 'Media de Temperaturas',
    description: 'Calcula la temperatura media de la semana',
    context: 'Calcula la media de estas temperaturas: 24°C, 26°C, 22°C, 25°C, 23°C.',
    values: [24, 26, 22, 25, 23],
    unit: '°C',
    visualization: 'numberLine',
    feedback: {
      correct: '¡Correcto! (24 + 26 + 22 + 25 + 23) ÷ 5 = 24°C.',
      incorrect: 'Recuerda dividir por el número total de temperaturas (5).'
    },
    hint: 'Suma todas las temperaturas y divide por 5.',
    emoji: '🌡️'
  },
  {
    id: 'points-scored',
    title: 'Media de Puntos',
    description: 'Calcula la media de puntos del equipo',
    context: 'Calcula la media de puntos anotados en un torneo: 12, 8, 15, 9.',
    values: [12, 8, 15, 9],
    unit: ' puntos',
    visualization: 'scale',
    feedback: {
      correct: '¡Excelente! (12 + 8 + 15 + 9) ÷ 4 = 11 puntos.',
      incorrect: 'Suma todos los puntos y divide por el número de partidos (4).'
    },
    hint: 'La media es el "punto de equilibrio" de todos los valores.',
    emoji: '⚽'
  },
  {
    id: 'fruit-weights',
    title: 'Media de Pesos',
    description: 'Calcula el peso medio de las frutas',
    context: 'Calcula la media de los pesos de estas frutas: 120g, 150g, 135g, 95g.',
    values: [120, 150, 135, 95],
    unit: 'g',
    visualization: 'numberLine',
    feedback: {
      correct: '¡Correcto! (120 + 150 + 135 + 95) ÷ 4 = 125g.',
      incorrect: 'Recuerda sumar todos los pesos y dividir por la cantidad de frutas.'
    },
    hint: 'Suma los pesos de todas las frutas y divide por 4.',
    emoji: '🍎'
  }
];

// Create the Mean Value Mission exercise
export const meanValueMissionExercise: Exercise = {
  id: 'g5-s5-e3',
  title: 'Misión Valor Medio',
  description: 'Calcula la media de conjuntos de datos y comprende su significado visual.',
  iconName: 'StatisticsIcon',
  isLocked: false,
  componentType: ExerciseComponentType.MEAN_VALUE_MISSION,
  data: {
    scenarios: meanValueScenarios,
    totalStars: meanValueScenarios.length
  }
};
