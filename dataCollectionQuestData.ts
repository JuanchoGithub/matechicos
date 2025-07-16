import { ExerciseComponentType, DataCollectionQuestScenarioData } from './types';
import { Exercise } from './types';

// Example 1: Favorite sports survey scenario
const favoriteSportsScenario: DataCollectionQuestScenarioData = {
  id: 'favorite-sports-survey',
  title: 'Deportes Favoritos',
  description: 'Encuesta a 5 amigos sobre su deporte favorito y crea un gráfico de barras.',
  instructions: 'Ingresa las respuestas en el formulario y luego crea un gráfico de barras.',
  surveyOptions: ['Fútbol', 'Básquetbol', 'Natación'],
  questionText: '¿Cuál es el deporte más popular?',
  requiredResponses: 5,
  graphType: 'bar',
  analysisType: 'most-popular',
  feedbackMessages: {
    incomplete: 'Aún necesitas recolectar {remaining} respuestas.',
    incorrect: 'Revisa tu gráfico. Recuerda que el deporte más popular tiene la barra más alta.',
    correct: '¡Genial! {answer} es el deporte más popular con {count} votos.',
  },
  emoji: '🏆'
};

// Example 2: Books read survey scenario
const booksReadScenario: DataCollectionQuestScenarioData = {
  id: 'books-read-survey',
  title: 'Libros Leídos',
  description: 'Recolecta datos sobre la cantidad de libros leídos: 2, 3, 2, 4. Crea un gráfico de puntos y encuentra el promedio.',
  instructions: 'Ingresa los datos y crea un gráfico de puntos. Luego calcula el promedio.',
  dataPoints: [2, 3, 2, 4],
  questionText: '¿Cuál es el promedio de libros leídos?',
  graphType: 'line-plot',
  analysisType: 'mean',
  correctAnswer: 2.75,
  feedbackMessages: {
    incomplete: 'Debes representar todos los datos en el gráfico.',
    incorrect: 'Revisa tu cálculo. El promedio se calcula sumando todos los valores y dividiendo por la cantidad de datos.',
    correct: '¡Correcto! (2 + 3 + 2 + 4) ÷ 4 = 2.75.',
  },
  range: [0, 5],
  step: 1,
  unit: ' libros',
  emoji: '📚'
};

// Additional scenario: Favorite subject survey
const favoriteSubjectScenario: DataCollectionQuestScenarioData = {
  id: 'favorite-subject-survey',
  title: 'Asignaturas Favoritas',
  description: 'Encuesta a 6 compañeros sobre su asignatura favorita y crea un gráfico de barras.',
  instructions: 'Ingresa las respuestas en el formulario y luego crea un gráfico de barras.',
  surveyOptions: ['Matemáticas', 'Ciencias', 'Literatura', 'Arte'],
  questionText: '¿Cuál es la asignatura favorita de la mayoría?',
  requiredResponses: 6,
  graphType: 'bar',
  analysisType: 'most-popular',
  feedbackMessages: {
    incomplete: 'Aún necesitas recolectar {remaining} respuestas.',
    incorrect: 'Revisa tu gráfico. Recuerda contar cada respuesta antes de graficar.',
    correct: '¡Excelente! {answer} es la asignatura favorita con {count} votos.',
  },
  emoji: '📝'
};

// Height measurement scenario
const studentHeightScenario: DataCollectionQuestScenarioData = {
  id: 'student-height-survey',
  title: 'Alturas de Estudiantes',
  description: 'Recolecta datos sobre la altura de 5 estudiantes en centímetros: 142, 138, 145, 140, 138. Crea un gráfico de puntos y encuentra el promedio.',
  instructions: 'Ingresa las alturas y crea un gráfico de puntos. Luego calcula el promedio.',
  dataPoints: [142, 138, 145, 140, 138],
  questionText: '¿Cuál es la altura promedio en centímetros?',
  graphType: 'line-plot',
  analysisType: 'mean',
  correctAnswer: 140.6,
  feedbackMessages: {
    incomplete: 'Debes representar todas las alturas en el gráfico.',
    incorrect: 'Revisa tu cálculo del promedio. Suma todas las alturas y divide por 5.',
    correct: '¡Correcto! (142 + 138 + 145 + 140 + 138) ÷ 5 = 140.6 cm.',
  },
  range: [130, 150],
  step: 1,
  unit: ' cm',
  emoji: '📏'
};

// Temperature reading scenario
const temperatureScenario: DataCollectionQuestScenarioData = {
  id: 'temperature-survey',
  title: 'Temperaturas Diarias',
  description: 'Registra las temperaturas durante 6 días: 24°C, 22°C, 25°C, 23°C, 26°C, 24°C. Crea un gráfico de puntos y encuentra la moda.',
  instructions: 'Ingresa las temperaturas y crea un gráfico de puntos. Luego determina la moda.',
  dataPoints: [24, 22, 25, 23, 26, 24],
  questionText: '¿Cuál es la temperatura que aparece con más frecuencia (moda)?',
  graphType: 'line-plot',
  analysisType: 'mode',
  correctAnswer: 24,
  feedbackMessages: {
    incomplete: 'Debes representar todas las temperaturas en el gráfico.',
    incorrect: 'Revisa el gráfico. La moda es el valor que aparece con más frecuencia.',
    correct: '¡Correcto! 24°C aparece dos veces, siendo el valor más frecuente.',
  },
  range: [20, 30],
  step: 1,
  unit: '°C',
  emoji: '🌡️'
};

// School event planner scenario
const schoolEventScenario: DataCollectionQuestScenarioData = {
  id: 'school-event-planner',
  title: 'Planificador de Eventos Escolares',
  description: 'Realiza una encuesta entre 8 compañeros sobre qué evento escolar les gustaría tener: Feria de Ciencias, Festival de Arte, Torneo Deportivo.',
  instructions: 'Ingresa las respuestas en el formulario y luego crea un gráfico de barras.',
  surveyOptions: ['Feria de Ciencias', 'Festival de Arte', 'Torneo Deportivo'],
  questionText: '¿Qué evento deberíamos organizar según la mayoría?',
  requiredResponses: 8,
  graphType: 'bar',
  analysisType: 'most-popular',
  feedbackMessages: {
    incomplete: 'Aún necesitas recolectar {remaining} respuestas para la encuesta.',
    incorrect: 'Revisa tu conteo y el gráfico. El evento con más votos es el que deberíamos organizar.',
    correct: '¡Excelente decisión! Según la encuesta, deberíamos organizar {answer} con {count} votos.',
  },
  emoji: '🎪'
};

// New scenario: Favorite Fruit
const favoriteFruitScenario: DataCollectionQuestScenarioData = {
  id: 'favorite-fruit-survey',
  title: 'Frutas Favoritas',
  description: 'Encuesta a 7 compañeros sobre su fruta favorita y crea un gráfico de barras.',
  instructions: 'Ingresa las respuestas en el formulario y luego crea un gráfico de barras.',
  surveyOptions: ['Manzana', 'Banana', 'Naranja', 'Uva'],
  questionText: '¿Cuál es la fruta más popular?',
  requiredResponses: 7,
  graphType: 'bar',
  analysisType: 'most-popular',
  feedbackMessages: {
    incomplete: 'Aún necesitas recolectar {remaining} respuestas.',
    incorrect: 'Revisa tu gráfico. La fruta más popular tiene la barra más alta.',
    correct: '¡Bien hecho! {answer} es la fruta más popular con {count} votos.',
  },
  emoji: '🍎'
};

// New scenario: Shoe Sizes
const shoeSizeScenario: DataCollectionQuestScenarioData = {
  id: 'shoe-size-survey',
  title: 'Tallas de Zapatos',
  description: 'Registra las tallas de zapatos de 6 estudiantes: 36, 37, 36, 38, 37, 36. Crea un gráfico de puntos y encuentra la moda.',
  instructions: 'Ingresa las tallas y crea un gráfico de puntos. Luego determina la moda.',
  dataPoints: [36, 37, 36, 38, 37, 36],
  questionText: '¿Cuál es la talla de zapato más común (moda)?',
  graphType: 'line-plot',
  analysisType: 'mode',
  correctAnswer: 36,
  feedbackMessages: {
    incomplete: 'Debes representar todas las tallas en el gráfico.',
    incorrect: 'Revisa el gráfico. La moda es la talla que aparece más veces.',
    correct: '¡Correcto! 36 es la talla más frecuente.',
  },
  range: [35, 39],
  step: 1,
  unit: '',
  emoji: '👟'
};

// New scenario: Number of Pets
const petsScenario: DataCollectionQuestScenarioData = {
  id: 'pets-survey',
  title: 'Mascotas en Casa',
  description: 'Encuesta a tus compañeros sobre cuántas mascotas tienen en casa: 1, 2, 0, 3, 2, 1, 1. Crea un gráfico de puntos y encuentra el promedio.',
  instructions: 'Ingresa los datos y crea un gráfico de puntos. Luego calcula el promedio.',
  dataPoints: [1, 2, 0, 3, 2, 1, 1],
  questionText: '¿Cuál es el promedio de mascotas por estudiante?',
  graphType: 'line-plot',
  analysisType: 'mean',
  correctAnswer: 1.43,
  feedbackMessages: {
    incomplete: 'Debes representar todos los datos en el gráfico.',
    incorrect: 'Revisa tu cálculo. El promedio se calcula sumando todos los valores y dividiendo por la cantidad de datos.',
    correct: '¡Correcto! (1 + 2 + 0 + 3 + 2 + 1 + 1) ÷ 7 = 1.43.',
  },
  range: [0, 4],
  step: 1,
  unit: ' mascotas',
  emoji: '🐶'
};

// Export as a single exercise object
export const dataCollectionQuestExercise: Exercise = {
  id: 'data-collection-quest',
  title: 'Misión Recolección de Datos',
  description: 'Recolecta, organiza y analiza datos usando encuestas y gráficos.',
  iconName: 'StatisticsIcon', 
  isLocked: false,
  componentType: ExerciseComponentType.DATA_COLLECTION_QUEST,
  data: {
    scenarios: [
      favoriteSportsScenario,
      booksReadScenario,
      favoriteSubjectScenario,
      studentHeightScenario,
      temperatureScenario,
      schoolEventScenario,
      favoriteFruitScenario,
      shoeSizeScenario,
      petsScenario
    ],
    scaffoldConfig: {
      initialPrompt: '¡Bienvenido a la Misión de Recolección de Datos! Vas a aprender a recolectar, organizar y analizar datos.',
      attemptsAllowed: 2,
      hints: [
        'Recuerda contar cada respuesta antes de crear tu gráfico.',
        'Para el promedio (media), suma todos los valores y divide por la cantidad de datos.',
        'La moda es el valor que aparece con más frecuencia en los datos.'
      ]
    }
  }
};
