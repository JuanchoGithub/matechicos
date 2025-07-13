
import { Exercise, ExerciseComponentType, OriginalIconName, CertaintyScenario, CertaintyLevel, SimpleChanceGameScenario } from './types'; // Added SimpleChanceGameScenario

const certezaSucesos2ndGradeScenarios: CertaintyScenario[] = [
  { id: 'g2_sol_sale_dia', eventText: "Que el sol salga durante el día.", correctCertainty: 'seguro' as CertaintyLevel, emoji: '☀️' },
  { id: 'g2_gato_ladre', eventText: "Que un gato ladre como un perro.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🐈' },
  { id: 'g2_jugar_recreo', eventText: "Jugar con amigos en el recreo.", correctCertainty: 'posible' as CertaintyLevel, emoji: '⚽' },
  { id: 'g2_luna_durante_dia', eventText: "Ver la luna en el cielo durante el día.", correctCertainty: 'posible' as CertaintyLevel, emoji: '🌙' }, // Moon can be visible
  { id: 'g2_agua_moje', eventText: "Que el agua moje.", correctCertainty: 'seguro' as CertaintyLevel, emoji: '💧' },
  { id: 'g2_volar_sin_alas', eventText: "Volar sin alas ni avión.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🪁' },
];

const simpleChanceGameScenariosG2: SimpleChanceGameScenario[] = [
  {
    id: "g2_moneda_mas_probable",
    contextText: "Al lanzar una moneda al aire:",
    visualContext: "🪙",
    questionText: "¿Qué es más probable que salga?",
    options: [
      {id: 'cara', label: 'Cara'}, 
      {id: 'cruz', label: 'Cruz'}, 
      {id: 'igual', label: 'Igual de probable'}
    ],
    correctOptionId: 'igual',
    emoji: "🪙",
  },
  {
    id: "g2_bolsa_roja_azul",
    contextText: "De una bolsa con 2 bolitas rojas y 1 azul:",
    visualContext: "🔴🔴🔵 (3 bolitas)",
    questionText: "¿Qué color es más probable sacar sin mirar?",
    options: [
      {id: 'roja', label: 'Roja'}, 
      {id: 'azul', label: 'Azul'}, 
      {id: 'igual', label: 'Igual de probable'}
    ],
    correctOptionId: 'roja',
    emoji: "🛍️",
  },
  {
    id: "g2_ruleta_simple_colores",
    contextText: "Al girar esta ruleta (2 secciones rojas, 1 azul):",
    visualContext: "🎡 (RR A)",
    questionText: "¿En qué color es más probable que caiga la flecha?",
    options: [
      {id: 'rojo', label: 'Rojo'}, 
      {id: 'azul', label: 'Azul'}
    ],
    correctOptionId: 'rojo',
    emoji: "🎡",
  },
  {
    id: "g2_dado_1234_posible_3",
    contextText: "Al tirar un dado con los números 1, 2, 3, 4:",
    visualContext: "🎲 (1,2,3,4)",
    questionText: "¿Es posible que salga el número 3?",
    options: [{id: 'si', label: 'Sí'}, {id: 'no', label: 'No'}],
    correctOptionId: 'si',
    emoji: "🎲",
  },
    {
    id: "g2_dado_1234_posible_5",
    contextText: "Al tirar un dado con los números 1, 2, 3, 4:",
    visualContext: "🎲 (1,2,3,4)",
    questionText: "¿Es posible que salga el número 5?",
    options: [{id: 'si', label: 'Sí'}, {id: 'no', label: 'No'}],
    correctOptionId: 'no',
    emoji: "🎲",
  },
  {
    id: "g2_bolsa_1roja_3azules",
    contextText: "De una bolsa con 1 bolita roja y 3 azules:",
    visualContext: "🔴🔵🔵🔵 (4 bolitas)",
    questionText: "¿Qué color es más probable sacar?",
    options: [
      {id: 'roja', label: 'Roja'}, 
      {id: 'azul', label: 'Azul'}
    ],
    correctOptionId: 'azul',
    emoji: "🛍️",
  }
];

export const secondGradeProbabilidadExercises: Exercise[] = [
  { 
    id: 'g2-s7-e1', title: 'Seguro, Posible o Imposible', 
    description: 'Clasifica sucesos cotidianos según su probabilidad.', 
    iconName: 'ProbabilityIcon', isLocked: false, 
    componentType: ExerciseComponentType.CERTEZA_SUCESOS,
    data: { totalStars: 5, scenarios: certezaSucesos2ndGradeScenarios },
    question: '¿Esto es seguro, posible o imposible?',
  },
  { 
    id: 'g2-s7-e2', title: 'Juegos de Azar Simples', 
    description: 'Predice resultados en juegos sencillos (ej: sacar un color).', 
    iconName: 'ProbabilityIcon', isLocked: false, 
    componentType: ExerciseComponentType.SIMPLE_CHANCE_GAME,
    data: { totalStars: 5, scenarios: simpleChanceGameScenariosG2 },
    question: '¿Qué es más probable que pase?',
  },
];
