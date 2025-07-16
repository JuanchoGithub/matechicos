import { ExerciseComponentType, BarGraphBuilderQuestionData, BarGraphBuilderScenarioData } from './types';
import { Exercise } from './types';

// Example 1: Build a bar graph for favorite pets
const buildGraphPetsScenario: BarGraphBuilderQuestionData = {
  id: 'build-pets-graph',
  type: 'buildGraph',
  title: 'Mascotas Favoritas',
  description: 'Construye un gráfico de barras que muestre las mascotas favoritas: 4 perros, 3 gatos, 2 pájaros.',
  xAxisLabel: 'Tipo de Mascota',
  yAxisLabel: 'Número de Votos',
  categories: [
    { name: 'Perros', correctValue: 4, color: '#3B82F6' }, // blue
    { name: 'Gatos', correctValue: 3, color: '#EC4899' }, // pink
    { name: 'Pájaros', correctValue: 2, color: '#10B981' }, // green
  ],
  question: '¿Cuál es la mascota más popular según el gráfico?',
  answer: 'Perros',
  hint: 'Recuerda que cada unidad representa un voto.',
  feedback: {
    correct: '¡Correcto! Los perros tienen la barra más alta con 4 votos.',
    incorrect: 'Revisa las alturas. Perros: 4, Gatos: 3, Pájaros: 2.'
  },
  emoji: '🐾'
};

// Example 2: Interpret a bar graph of ice cream flavors
const interpretGraphIceCreamScenario: BarGraphBuilderQuestionData = {
  id: 'interpret-icecream-graph',
  type: 'interpretGraph',
  title: 'Sabores de Helado',
  description: 'Observa el gráfico de barras de los sabores de helado favoritos de la clase.',
  xAxisLabel: 'Sabor',
  yAxisLabel: 'Número de Estudiantes',
  categories: [
    { name: 'Vainilla', correctValue: 5, color: '#F7F9CA' }, // cream
    { name: 'Chocolate', correctValue: 3, color: '#7E5A3C' }, // brown
    { name: 'Fresa', correctValue: 4, color: '#F472B6' }, // strawberry pink
  ],
  question: '¿Cuántos estudiantes más eligieron vainilla que chocolate?',
  answer: '2',
  feedback: {
    correct: '¡Correcto! 5 (vainilla) - 3 (chocolate) = 2.',
    incorrect: 'Para calcular la diferencia, resta el valor de chocolate (3) del valor de vainilla (5): 5 - 3 = 2.'
  },
  emoji: '🍦'
};

// Additional scenario: Class survey on favorite sports
const buildGraphSportsScenario: BarGraphBuilderQuestionData = {
  id: 'build-sports-graph',
  type: 'buildGraph',
  title: 'Deportes Favoritos',
  description: 'Construye un gráfico de barras con los resultados de la encuesta sobre deportes favoritos.',
  xAxisLabel: 'Deporte',
  yAxisLabel: 'Número de Votos',
  categories: [
    { name: 'Fútbol', correctValue: 8, color: '#10B981' }, // green
    { name: 'Básquetbol', correctValue: 6, color: '#F59E0B' }, // amber
    { name: 'Natación', correctValue: 5, color: '#3B82F6' }, // blue
    { name: 'Tenis', correctValue: 3, color: '#EF4444' }, // red
  ],
  question: '¿Qué deporte tiene más votos y cuántos son?',
  answer: 'Fútbol, 8',
  options: ['Fútbol, 8', 'Básquetbol, 6', 'Natación, 5', 'Tenis, 3'],
  hint: 'Busca la barra más alta y cuenta cuántas unidades tiene.',
  feedback: {
    correct: '¡Correcto! El fútbol es el más popular con 8 votos.',
    incorrect: 'La barra más alta corresponde al fútbol con 8 votos.'
  },
  emoji: '⚽'
};

// Additional scenario: Interpret a bar graph on favorite fruits
const interpretGraphFruitsScenario: BarGraphBuilderQuestionData = {
  id: 'interpret-fruits-graph',
  type: 'interpretGraph',
  title: 'Frutas Favoritas',
  description: 'Analiza el gráfico de barras sobre las frutas favoritas de los estudiantes.',
  xAxisLabel: 'Fruta',
  yAxisLabel: 'Número de Estudiantes',
  categories: [
    { name: 'Manzana', correctValue: 7, color: '#EF4444' }, // red
    { name: 'Plátano', correctValue: 9, color: '#F59E0B' }, // yellow
    { name: 'Naranja', correctValue: 6, color: '#F97316' }, // orange
    { name: 'Uvas', correctValue: 5, color: '#8B5CF6' }, // purple
  ],
  question: '¿Cuál es la fruta menos popular y cuántos estudiantes la eligieron?',
  answer: 'Uvas, 5',
  options: ['Manzana, 7', 'Plátano, 9', 'Naranja, 6', 'Uvas, 5'],
  feedback: {
    correct: '¡Correcto! Las uvas son las menos populares con 5 votos.',
    incorrect: 'Observa la barra más baja. Las uvas tienen 5 votos, siendo la fruta menos popular.'
  },
  emoji: '🍎'
};

// Additional scenario: Build a graph on transportation methods
const buildGraphTransportScenario: BarGraphBuilderQuestionData = {
  id: 'build-transport-graph',
  type: 'buildGraph',
  title: 'Transporte al Colegio',
  description: 'Construye un gráfico de barras sobre cómo llegan los estudiantes al colegio: 10 en automóvil, 7 caminando, 5 en bicicleta, 8 en autobús.',
  xAxisLabel: 'Medio de Transporte',
  yAxisLabel: 'Número de Estudiantes',
  categories: [
    { name: 'Auto', correctValue: 10, color: '#3B82F6' }, // blue
    { name: 'Caminando', correctValue: 7, color: '#10B981' }, // green
    { name: 'Bicicleta', correctValue: 5, color: '#F59E0B' }, // amber
    { name: 'Autobús', correctValue: 8, color: '#EF4444' }, // red
  ],
  question: '¿Cuál es el total de estudiantes representados en el gráfico?',
  answer: '30',
  hint: 'Suma los valores de todas las barras para encontrar el total.',
  feedback: {
    correct: '¡Correcto! 10 + 7 + 5 + 8 = 30 estudiantes en total.',
    incorrect: 'Para encontrar el total, suma todos los valores: 10 (auto) + 7 (caminando) + 5 (bicicleta) + 8 (autobús) = 30.'
  },
  emoji: '🚗'
};

// Combine all scenarios
const barGraphBuilderScenarios: BarGraphBuilderQuestionData[] = [
  buildGraphPetsScenario,
  interpretGraphIceCreamScenario,
  buildGraphSportsScenario,
  interpretGraphFruitsScenario,
  buildGraphTransportScenario
];

// Create the exercise data
export const barGraphBuilderExerciseData: BarGraphBuilderScenarioData = {
  scenarios: barGraphBuilderScenarios,
  totalStars: barGraphBuilderScenarios.length
};

// Exercise for 5th grade estadística
export const barGraphBuilderExercise: Exercise = {
  id: 'g5-s6-e9',
  title: 'Construir Gráficos de Barras',
  description: 'Aprende a construir e interpretar gráficos de barras con datos categóricos.',
  iconName: 'StatisticsIcon',
  isLocked: false,
  componentType: ExerciseComponentType.BAR_GRAPH_BUILDER,
  data: barGraphBuilderExerciseData,
  question: 'Construye e interpreta gráficos de barras:',
};
