
import { Exercise, ExerciseComponentType, OriginalIconName, CertaintyScenario, ProbabilityComparisonScenario, SimpleProbabilityScenario, FrecuenciaScenario } from './types';

// Scenarios for g3-s7-e2: Comparar Probabilidades
const g3s7e2_scenarios: ProbabilityComparisonScenario[] = [
  {
    id: "bolsa1_roja_vs_azul",
    contextText: "Observa la Bolsa A:",
    eventA: {
      text: "Sacar una bolita ROJA de la Bolsa A.",
      visual: "Bolsa A: 🔴🔴🔴🔵 (4 bolitas)",
      favorable: 3,
      total: 4,
    },
    eventB: {
      text: "Sacar una bolita AZUL de la Bolsa A.",
      visual: "Bolsa A: 🔴🔴🔴🔵 (4 bolitas)",
      favorable: 1,
      total: 4,
    },
    emoji: "🛍️",
  },
  {
    id: "bolsa_vs_bolsa_verdes",
    contextText: "Compara las dos bolsas:",
    eventA: {
      text: "Sacar una bolita VERDE de la Bolsa X.",
      visual: "Bolsa X: 🟢🟢⚪️ (3 bolitas)",
      favorable: 2,
      total: 3,
    },
    eventB: {
      text: "Sacar una bolita VERDE de la Bolsa Y.",
      visual: "Bolsa Y: 🟢⚪️⚪️⚪️ (4 bolitas)",
      favorable: 1,
      total: 4,
    },
    emoji: "⚖️",
  },
  {
    id: "ruleta_colores",
    contextText: "Gira la ruleta:",
    eventA: {
      text: "Que la flecha caiga en ROJO.",
      visual: "Ruleta: 🟥🟥🟦🟩 (4 secciones)",
      favorable: 2, // 2 Rojos
      total: 4,     // 4 Secciones
    },
    eventB: {
      text: "Que la flecha caiga en AZUL.",
      visual: "Ruleta: 🟥🟥🟦🟩 (4 secciones)",
      favorable: 1, // 1 Azul
      total: 4,     // 4 Secciones
    },
    emoji: "🎡",
  },
  {
    id: "dado_par_vs_mayor4",
    contextText: "Al lanzar un dado común de 6 caras:",
    eventA: {
      text: "Sacar un número PAR.",
      visual: "Dado: ❶❷❸❹❺❻",
      favorable: 3, // 2, 4, 6
      total: 6,
    },
    eventB: {
      text: "Sacar un número MAYOR que 4.",
      visual: "Dado: ❶❷❸❹❺❻",
      favorable: 2, // 5, 6
      total: 6,
    },
    emoji: "🎲",
  },
  {
    id: "cartas_oro_vs_espada",
    contextText: "De un pequeño mazo de cartas:",
    eventA: {
      text: "Sacar una carta de ORO.",
      visual: "Mazo: 🟡🟡⚔️ (3 cartas)", // 2 Oros, 1 Espada
      favorable: 2,
      total: 3,
    },
    eventB: {
      text: "Sacar una carta de ESPADA.",
      visual: "Mazo: 🟡🟡⚔️ (3 cartas)",
      favorable: 1,
      total: 3,
    },
    emoji: "🃏",
  },
  {
    id: "igual_prob_bolitas",
    contextText: "Observa la bolsa:",
    eventA: {
      text: "Sacar una bolita AMARILLA.",
      visual: "Bolsa Z: 🟡🟡🔵🔵 (4 bolitas)",
      favorable: 2,
      total: 4,
    },
    eventB: {
      text: "Sacar una bolita AZUL.",
      visual: "Bolsa Z: 🟡🟡🔵🔵 (4 bolitas)",
      favorable: 2,
      total: 4,
    },
    emoji: "🛍️",
  },
  {
    id: "ruleta_impar_vs_menor3",
    contextText: "Gira la ruleta con números del 1 al 5:",
    eventA: {
      text: "Que salga un número IMPAR.",
      visual: "Ruleta: ①②③④⑤",
      favorable: 3, // 1, 3, 5
      total: 5,
    },
    eventB: {
      text: "Que salga un número MENOR que 3.",
      visual: "Ruleta: ①②③④⑤",
      favorable: 2, // 1, 2
      total: 5,
    },
    emoji: "🎯",
  }
];

// Scenarios for g3-s7-e3: Expresar Probabilidad Simple
const g3s7e3_scenarios: SimpleProbabilityScenario[] = [
  {
    id: "bolsa_roja_simple",
    contextText: "En esta bolsa hay bolitas de colores:",
    visualContext: "Bolsa: 🔴🔵🔵 (3 bolitas)",
    eventToEvaluate: "Sacar una bolita ROJA.",
    options: [
      { text: "1 de 3", isCorrect: true },
      { text: "1 de 2", isCorrect: false },
      { text: "2 de 3", isCorrect: false },
      { text: "3 de 1", isCorrect: false },
    ],
    emoji: "🛍️",
  },
  {
    id: "ruleta_verde_simple",
    contextText: "Observa esta ruleta:",
    visualContext: "Ruleta: 🟢🟡🟡🟡 (4 secciones)",
    eventToEvaluate: "Que la flecha caiga en VERDE.",
    options: [
      { text: "1 de 4", isCorrect: true },
      { text: "1 de 3", isCorrect: false },
      { text: "3 de 4", isCorrect: false },
      { text: "4 de 1", isCorrect: false },
    ],
    emoji: "🎡",
  },
  {
    id: "dado_sacar_5_simple",
    contextText: "Al lanzar un dado común de 6 caras:",
    visualContext: "Dado: ❶❷❸❹❺❻",
    eventToEvaluate: "Sacar el número 5.",
    options: [
      { text: "1 de 6", isCorrect: true },
      { text: "5 de 6", isCorrect: false },
      { text: "1 de 5", isCorrect: false },
      { text: "6 de 1", isCorrect: false },
    ],
    emoji: "🎲",
  },
  {
    id: "bolsa_azul_multiple",
    contextText: "Tenemos esta bolsa con bolitas:",
    visualContext: "Bolsa: 🔵🔵🔵🔴🟡 (5 bolitas)",
    eventToEvaluate: "Sacar una bolita AZUL.",
    options: [
      { text: "3 de 5", isCorrect: true },
      { text: "2 de 5", isCorrect: false },
      { text: "3 de 2", isCorrect: false },
      { text: "5 de 3", isCorrect: false },
    ],
    emoji: "🛍️",
  },
  {
    id: "ruleta_par_simple",
    contextText: "En esta ruleta con números del 1 al 4:",
    visualContext: "Ruleta: ①②③④",
    eventToEvaluate: "Que salga un número PAR.",
    options: [
      { text: "2 de 4", isCorrect: true }, // 2 y 4 son pares
      { text: "1 de 4", isCorrect: false },
      { text: "2 de 2", isCorrect: false },
      { text: "4 de 2", isCorrect: false },
    ],
    emoji: "🎯",
  },
  {
    id: "cartas_corazon_simple",
    contextText: "De este grupo de cartas:",
    visualContext: "Cartas: ❤️♠️♦️❤️ (4 cartas)",
    eventToEvaluate: "Sacar una carta de CORAZÓN.",
    options: [
      { text: "2 de 4", isCorrect: true },
      { text: "1 de 4", isCorrect: false },
      { text: "1 de 2", isCorrect: false },
      { text: "4 de 2", isCorrect: false },
    ],
    emoji: "🃏",
  },
];

// Scenarios for g3-s7-e4: Frecuencia de Sucesos
const g3s7e4_frecuencia_scenarios: FrecuenciaScenario[] = [
  { id: 'fs1', eventText: "Que un perro hable en chino.", correctFrequency: 'nunca', emoji: '🐕' },
  { id: 'fs2', eventText: "Que hoy sea lunes.", correctFrequency: 'a_veces', emoji: '🗓️' },
  { id: 'fs3', eventText: "Que después del día venga la noche.", correctFrequency: 'siempre', emoji: '🌃' },
  { id: 'fs4', eventText: "Sacar un 7 al tirar un dado de 6 caras.", correctFrequency: 'nunca', emoji: '🎲' },
  { id: 'fs5', eventText: "Que nieve en el desierto del Sahara.", correctFrequency: 'a_veces', emoji: '🏜️' }, // Raramente, pero ha pasado
  { id: 'fs6', eventText: "Que el agua hierva a 100°C (a nivel del mar).", correctFrequency: 'siempre', emoji: '🔥' },
  { id: 'fs7', eventText: "Que un gato ladre.", correctFrequency: 'nunca', emoji: '🐈' },
  { id: 'fs8', eventText: "Sentir hambre durante el día.", correctFrequency: 'a_veces', emoji: '😋' }, // "Siempre" podría ser debatible
  { id: 'fs9', eventText: "Que un círculo tenga 4 lados.", correctFrequency: 'nunca', emoji: '⭕' },
  { id: 'fs10', eventText: "Ver un arcoíris cuando llueve y hace sol.", correctFrequency: 'a_veces', emoji: '🌈' },
  { id: 'fs11', eventText: "Que 2 + 2 sea igual a 4.", correctFrequency: 'siempre', emoji: '✔️' },
  { id: 'fs12', eventText: "Que salga el sol por el Oeste.", correctFrequency: 'nunca', emoji: '🌅' },
  { id: 'fs13', eventText: "Usar abrigo en verano en el Polo Norte.", correctFrequency: 'siempre', emoji: '🧥' },
  { id: 'fs14', eventText: "Encontrar un billete en la calle.", correctFrequency: 'a_veces', emoji: '💸' },
  { id: 'fs15', eventText: "Que una planta crezca sin agua.", correctFrequency: 'nunca', emoji: '🌵' }, // Cactus are an exception but generally for kids
];

// Scenarios for g3-s7-e5: Harder Expresar Probabilidad Simple
const g3s7e5_harder_scenarios: SimpleProbabilityScenario[] = [
  {
    id: "bolsa_8_bolitas",
    contextText: "En esta bolsa hay 8 bolitas:",
    visualContext: "Bolsa: 🔴🔴🔵🔵🔵🟡🟡⚪️",
    eventToEvaluate: "Sacar una bolita AZUL.",
    options: [
      { text: "3 de 8", isCorrect: true },
      { text: "2 de 8", isCorrect: false },
      { text: "3 de 5", isCorrect: false },
      { text: "8 de 3", isCorrect: false },
    ],
    emoji: "🛍️",
  },
  {
    id: "ruleta_10_secciones_no_amarilla",
    contextText: "Observa esta ruleta de 10 secciones:",
    visualContext: "Ruleta: 🟩🟩🟩🟨🟨🟪🟪🟪🟪⚪️",
    eventToEvaluate: "Que la flecha NO caiga en AMARILLO.",
    options: [
      { text: "8 de 10", isCorrect: true }, // 3G + 4P + 1W = 8
      { text: "2 de 10", isCorrect: false }, // Only yellow
      { text: "7 de 10", isCorrect: false }, // Off by one
      { text: "10 de 8", isCorrect: false }, // Swapped
    ],
    emoji: "🎡",
  },
  {
    id: "cartas_1_a_9_mayor_6",
    contextText: "Se saca una carta al azar de este grupo (1 al 9):",
    visualContext: "Cartas: ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨",
    eventToEvaluate: "Sacar una carta con un número MAYOR QUE 6.",
    options: [
      { text: "3 de 9", isCorrect: true }, // 7, 8, 9
      { text: "6 de 9", isCorrect: false }, // Counts up to 6
      { text: "2 de 9", isCorrect: false }, // Off by one
      { text: "9 de 3", isCorrect: false }, // Swapped
    ],
    emoji: "🃏",
  },
  {
    id: "animales_corral_oveja",
    contextText: "En un corral hay estos animales:",
    visualContext: "Corral: 🐑🐑🐑🐄🐄🐖 (6 animales)",
    eventToEvaluate: "Que el primer animal en salir sea una OVEJA.",
    options: [
      { text: "3 de 6", isCorrect: true },
      { text: "1 de 6", isCorrect: false }, // Only one sheep
      { text: "3 de 3", isCorrect: false }, // Confuses favorable with total of sheep
      { text: "6 de 3", isCorrect: false }, // Swapped
    ],
    emoji: "🐑",
  },
  {
    id: "caramelos_rojo_o_verde",
    contextText: "Un frasco contiene estos caramelos:",
    visualContext: "Frasco: 🍬(R)x4, 🍬(V)x3, 🍬(A)x2 (Total 9)", // Updated total and removed Naranja for clarity
    eventToEvaluate: "Sacar un caramelo que SEA ROJO o VERDE.",
    options: [
      { text: "7 de 9", isCorrect: true }, // 4R + 3V = 7
      { text: "4 de 9", isCorrect: false }, // Only red
      { text: "3 de 9", isCorrect: false }, // Only green
      { text: "9 de 7", isCorrect: false }, // Swapped
    ],
    emoji: "🍬",
  },
  {
    id: "frutas_canasta_no_manzana",
    contextText: "Una canasta tiene estas frutas:",
    visualContext: "Canasta: 🍎🍎🍏🍐🍐🍌 (6 frutas)",
    eventToEvaluate: "Sacar una fruta que NO SEA MANZANA (ni roja ni verde).",
    options: [
      { text: "3 de 6", isCorrect: true }, // 2 peras + 1 banana
      { text: "3 de 3", isCorrect: false }, // Confuses non-apples with total non-apples
      { text: "2 de 6", isCorrect: false }, // Only peras
      { text: "6 de 3", isCorrect: false }, // Swapped
    ],
    emoji: "🧺",
  },
];

// Scenarios for g3-s7-e6: Advanced Probability (OR/NOT logic)
const g3s7e6_advanced_scenarios: SimpleProbabilityScenario[] = [
  {
    id: "pelotas_futbol_o_tenis",
    contextText: "Una caja contiene estas pelotas:",
    visualContext: "Caja: ⚽⚽🏀🏀🏀🎾 (6 pelotas)",
    eventToEvaluate: "Sacar una pelota de FÚTBOL o de TENIS.",
    options: [
      { text: "3 de 6", isCorrect: true }, // 2 fútbol + 1 tenis = 3
      { text: "2 de 6", isCorrect: false }, // Solo fútbol
      { text: "1 de 6", isCorrect: false }, // Solo tenis
      { text: "4 de 6", isCorrect: false }, // Otro error
    ],
    emoji: "⚽",
  },
  {
    id: "ruleta_no_rojo",
    contextText: "Gira esta ruleta de colores:",
    visualContext: "Ruleta: 🔴🔴🔵🟢🟡 (5 secciones)",
    eventToEvaluate: "Que la flecha NO caiga en ROJO.",
    options: [
      { text: "3 de 5", isCorrect: true }, // 1 azul + 1 verde + 1 amarillo = 3
      { text: "2 de 5", isCorrect: false }, // Solo rojos
      { text: "4 de 5", isCorrect: false },
      { text: "1 de 5", isCorrect: false },
    ],
    emoji: "🎡",
  },
  {
    id: "dulces_rojo_o_azul",
    contextText: "Un frasco tiene estos dulces:",
    visualContext: "Dulces: 🍬(R)x3, 🍬(V)x4, 🍬(A)x2, 🍬(N)x1 (Total 10)",
    eventToEvaluate: "Sacar un dulce ROJO o AZUL.",
    options: [
      { text: "5 de 10", isCorrect: true }, // 3 Rojos + 2 Azules = 5
      { text: "3 de 10", isCorrect: false }, // Solo Rojos
      { text: "2 de 10", isCorrect: false }, // Solo Azules
      { text: "7 de 10", isCorrect: false }, // Rojos + Verdes
    ],
    emoji: "🍬",
  },
  {
    id: "animales_no_oveja",
    contextText: "En el campo hay estos animales:",
    visualContext: "Campo: 🐑🐑🐑🐑🐑🐄🐄🐄🐎🐎 (10 animales)",
    eventToEvaluate: "Que el primer animal que se acerque NO SEA una OVEJA.",
    options: [
      { text: "5 de 10", isCorrect: true }, // 3 vacas + 2 caballos = 5
      { text: "3 de 10", isCorrect: false }, // Solo vacas
      { text: "2 de 10", isCorrect: false }, // Solo caballos
      { text: "7 de 10", isCorrect: false },
    ],
    emoji: "🐄",
  },
];

// Scenarios for g3-s7-e7: Práctica: Nunca, a veces, siempre.
const g3s7e7_frecuencia_scenarios_extra: FrecuenciaScenario[] = [
  { id: 'fs_extra1', eventText: "Que un pez viva fuera del agua por mucho tiempo.", correctFrequency: 'nunca', emoji: '🐠' },
  { id: 'fs_extra2', eventText: "Que haga frío en invierno en la Antártida.", correctFrequency: 'siempre', emoji: '❄️' },
  { id: 'fs_extra3', eventText: "Ver un avión de pasajeros volando en el cielo.", correctFrequency: 'a_veces', emoji: '✈️' },
  { id: 'fs_extra4', eventText: "Que un bebé recién nacido sepa leer un libro complejo.", correctFrequency: 'nunca', emoji: '👶' },
  { id: 'fs_extra5', eventText: "Que el semáforo de la esquina esté en color rojo.", correctFrequency: 'a_veces', emoji: '🚦' },
  { id: 'fs_extra6', eventText: "Que la luna llena se vea todas las noches.", correctFrequency: 'a_veces', emoji: '🌕' }, // It's only full moon once a month.
  { id: 'fs_extra7', eventText: "Que un auto de juguete funcione sin pilas ni motor.", correctFrequency: 'nunca', emoji: '🚗' },
  { id: 'fs_extra8', eventText: "Sentir sueño después de un día largo de juegos y estudio.", correctFrequency: 'a_veces', emoji: '😴' }, // Changed to a_veces, could be siempre for some
];

// Scenarios for g3-s7-e8: Test de Probabilidad (palabras)
const g3s7e8_test_probabilidad_scenarios_palabras: SimpleProbabilityScenario[] = [
  {
    id: "test_spinner_azul_palabras",
    contextText: "Gira la ruleta:",
    visualContext: "Ruleta: 🟥🟦🟩🟨 (4 colores)",
    eventToEvaluate: "Que la flecha caiga en AZUL.",
    options: [
      { text: "1 de 4", isCorrect: true }, { text: "1 de 3", isCorrect: false },
      { text: "2 de 4", isCorrect: false }, { text: "4 de 1", isCorrect: false },
    ],
    emoji: "🎡",
  },
  {
    id: "test_bag_naranja_palabras",
    contextText: "De esta bolsa de frutas:",
    visualContext: "Bolsa: 🍎🍎🍊🍊🍊 (5 frutas)",
    eventToEvaluate: "Sacar una NARANJA.",
    options: [
      { text: "3 de 5", isCorrect: true }, { text: "2 de 5", isCorrect: false },
      { text: "3 de 2", isCorrect: false }, { text: "5 de 3", isCorrect: false },
    ],
    emoji: "🧺",
  },
  {
    id: "test_dice_menor3_palabras",
    contextText: "Al lanzar un dado común:",
    visualContext: "Dado: ❶❷❸❹❺❻",
    eventToEvaluate: "Sacar un número MENOR que 3.", // 1, 2
    options: [
      { text: "2 de 6", isCorrect: true }, { text: "1 de 6", isCorrect: false },
      { text: "3 de 6", isCorrect: false }, { text: "6 de 2", isCorrect: false },
    ],
    emoji: "🎲",
  },
  {
    id: "test_candies_menta_palabras",
    contextText: "De esta caja de caramelos:",
    visualContext: "Caja: 🍬(M)x3, 🍬(F)x2, 🍬(L)x1 (Total 6)",
    eventToEvaluate: "Sacar un caramelo de MENTA.",
    options: [
      { text: "3 de 6", isCorrect: true }, { text: "1 de 6", isCorrect: false },
      { text: "2 de 6", isCorrect: false }, { text: "6 de 3", isCorrect: false },
    ],
    emoji: "🍬",
  },
  {
    id: "test_spinner_num_par_palabras",
    contextText: "Gira la ruleta numerada:",
    visualContext: "Ruleta: ①②③④⑤",
    eventToEvaluate: "Que la flecha caiga en un número PAR.", // 2, 4
    options: [
      { text: "2 de 5", isCorrect: true }, { text: "1 de 5", isCorrect: false },
      { text: "3 de 5", isCorrect: false }, { text: "5 de 2", isCorrect: false },
    ],
    emoji: "🎯",
  },
  {
    id: "test_bag_animal_gato_palabras",
    contextText: "De esta bolsa con figuras de animales:",
    visualContext: "Bolsa: 🐶🐱🐱🐦 (4 figuras)",
    eventToEvaluate: "Sacar la figura de un GATO.",
    options: [
      { text: "2 de 4", isCorrect: true }, { text: "1 de 4", isCorrect: false },
      { text: "1 de 2", isCorrect: false }, { text: "4 de 2", isCorrect: false },
    ],
    emoji: "🧸",
  },
];

// Scenarios for g3-s7-e9: Test de Probabilidad con FRACCIONES
const g3s7e9_test_probabilidad_fracciones: SimpleProbabilityScenario[] = [
  {
    id: "test_frac_bolsa_azul",
    contextText: "En una bolsa hay bolitas de colores.",
    visualContext: "Bolsa: 🔴🔴🔴🔵🔵 (5 bolitas)",
    eventToEvaluate: "Sacar una bolita AZUL.",
    options: [
      { text: "2/5", isCorrect: true }, { text: "3/5", isCorrect: false },
      { text: "2/3", isCorrect: false }, { text: "5/2", isCorrect: false },
    ],
    emoji: "🛍️",
  },
  {
    id: "test_frac_ruleta_impar",
    contextText: "Gira esta ruleta numerada del 1 al 6.",
    visualContext: "Ruleta: ①②③④⑤⑥",
    eventToEvaluate: "Que la flecha caiga en un número IMPAR.",
    options: [
      { text: "3/6", isCorrect: true }, { text: "1/6", isCorrect: false },
      { text: "1/2", isCorrect: false }, { text: "3/3", isCorrect: false }, // 1/2 is a valid distractor
    ],
    emoji: "🎯",
  },
  {
    id: "test_frac_dados_suma7",
    contextText: "Al lanzar dos dados comunes y sumar sus puntos:",
    visualContext: "Dados: 🎲🎲",
    eventToEvaluate: "Que la suma sea 7.",
    options: [
      { text: "6/36", isCorrect: true }, { text: "1/36", isCorrect: false },
      { text: "7/36", isCorrect: false }, { text: "1/6", isCorrect: false },
    ],
    emoji: "🎲",
  },
  {
    id: "test_frac_frutas_pera",
    contextText: "De una canasta con frutas:",
    visualContext: "Canasta: 🍎🍎🍏🍏🍏🍐 (6 frutas)",
    eventToEvaluate: "Sacar una PERA.",
    options: [
      { text: "1/6", isCorrect: true }, { text: "3/6", isCorrect: false },
      { text: "2/6", isCorrect: false }, { text: "1/5", isCorrect: false },
    ],
    emoji: "🧺",
  },
  {
    id: "test_frac_cartas_figura",
    contextText: "Se saca una carta de un mazo de 4 cartas (As, Rey, Reina, Jota).",
    visualContext: "Cartas: A K Q J",
    eventToEvaluate: "Sacar una carta que sea una FIGURA (Rey, Reina, Jota).",
    options: [
      { text: "3/4", isCorrect: true }, { text: "1/4", isCorrect: false },
      { text: "4/3", isCorrect: false }, { text: "1/2", isCorrect: false },
    ],
    emoji: "🃏",
  },
  {
    id: "test_frac_dias_finde",
    contextText: "Si se elige un día de la semana al azar:",
    visualContext: "Semana: L M X J V S D",
    eventToEvaluate: "Que sea un día del FIN DE SEMANA (Sábado o Domingo).",
    options: [
      { text: "2/7", isCorrect: true }, { text: "5/7", isCorrect: false },
      { text: "1/7", isCorrect: false }, { text: "2/5", isCorrect: false },
    ],
    emoji: "🗓️",
  },
];

// Scenarios for g3-s7-e10: Probabilidad con Fracciones
const g3s7e10_fracciones_scenarios: SimpleProbabilityScenario[] = [
  {
    id: "spinner_a_azul",
    contextText: "Gira la ruleta:",
    visualContext: "Ruleta: 🔴🔴🔵🟢🟢 (5 secciones)",
    eventToEvaluate: "Que caiga en AZUL.",
    options: [
      { text: "1/5", isCorrect: true }, { text: "2/5", isCorrect: false },
      { text: "1/4", isCorrect: false }, { text: "5/1", isCorrect: false }
    ],
    emoji: "🎡",
  },
  {
    id: "marbles_b_amarilla",
    contextText: "De esta bolsa de bolitas:",
    visualContext: "Bolsa: 🟡🟡🟡🟡🟣🟣 (6 bolitas)",
    eventToEvaluate: "Sacar una bolita AMARILLA.",
    options: [
      { text: "4/6", isCorrect: true }, { text: "2/6", isCorrect: false },
      { text: "2/4", isCorrect: false }, { text: "1/2", isCorrect: false } // 1/2 is equivalent to 4/6 if reduced but 4/6 is the direct representation
    ],
    emoji: "🛍️",
  },
  {
    id: "dice_c_par",
    contextText: "Al lanzar un dado común:",
    visualContext: "Dado: ❶-❻",
    eventToEvaluate: "Sacar un número PAR.",
    options: [
      { text: "3/6", isCorrect: true }, { text: "1/6", isCorrect: false },
      { text: "2/6", isCorrect: false }, { text: "1/3", isCorrect: false }
    ],
    emoji: "🎲",
  },
  {
    id: "cards_d_estrella",
    contextText: "De este grupo de cartas:",
    visualContext: "Cartas: ⭐🌙☀️ (3 cartas)",
    eventToEvaluate: "Sacar la carta ESTRELLA.",
    options: [
      { text: "1/3", isCorrect: true }, { text: "1/2", isCorrect: false },
      { text: "2/3", isCorrect: false }, { text: "3/1", isCorrect: false }
    ],
    emoji: "🃏",
  },
  {
    id: "animals_e_perro",
    contextText: "De este grupo de animales:",
    visualContext: "Animales: 🐶🐶🐱🐦 (4 animales)",
    eventToEvaluate: "Elegir un PERRO.",
    options: [
      { text: "2/4", isCorrect: true }, { text: "1/4", isCorrect: false },
      { text: "1/2", isCorrect: false }, { text: "4/2", isCorrect: false }
    ],
    emoji: "🐾",
  },
  {
    id: "spinner_f_naranja",
    contextText: "Gira la siguiente ruleta:",
    visualContext: "Ruleta: 🟠🟠🟠🔵🔵🔵🔵🔵 (8 secciones)",
    eventToEvaluate: "Que caiga en NARANJA.",
    options: [
      { text: "3/8", isCorrect: true }, { text: "5/8", isCorrect: false },
      { text: "3/5", isCorrect: false }, { text: "8/3", isCorrect: false }
    ],
    emoji: "🎯",
  },
];

// Scenarios for g3-s7-e11: Más Probabilidad con Fracciones
const g3s7e11_mas_fracciones_scenarios: SimpleProbabilityScenario[] = [
  {
    id: "spinner_8_rojo",
    contextText: "Gira esta ruleta de 8 secciones:",
    visualContext: "Ruleta: 🔴🔴🔴🔵🔵🟢🟢🟢",
    eventToEvaluate: "Que caiga en ROJO.",
    options: [
      { text: "3/8", isCorrect: true }, { text: "2/8", isCorrect: false },
      { text: "3/5", isCorrect: false }, { text: "5/8", isCorrect: false }
    ],
    emoji: "🎡",
  },
  {
    id: "marbles_10_negra",
    contextText: "En esta bolsa hay 10 bolitas:",
    visualContext: "Bolsa: ⚫⚫⚫⚫⚫⚫🟡🟡🟡🟡", // 6 Negras, 4 Amarillas
    eventToEvaluate: "Sacar una bolita NEGRA.",
    options: [
      { text: "6/10", isCorrect: true }, { text: "4/10", isCorrect: false },
      { text: "3/5", isCorrect: false }, { text: "2/5", isCorrect: false } // 3/5 is equivalent to 6/10
    ],
    emoji: "🛍️",
  },
  {
    id: "cards_7_corazon",
    contextText: "De un mazo de 7 cartas:",
    visualContext: "Cartas: ♥️♥️♥️♠️♠️♣️♣️", // 3 Corazones, 2 Picas, 2 Tréboles
    eventToEvaluate: "Sacar una carta de CORAZÓN.",
    options: [
      { text: "3/7", isCorrect: true }, { text: "2/7", isCorrect: false },
      { text: "3/4", isCorrect: false }, { text: "4/7", isCorrect: false }
    ],
    emoji: "🃏",
  },
  {
    id: "animals_9_gato",
    contextText: "En la granja hay 9 animales:",
    visualContext: "Granja: 🐶🐶🐶🐶🐶🐱🐱🐱🐱", // 5 Perros, 4 Gatos
    eventToEvaluate: "Que el animal elegido sea un GATO.",
    options: [
      { text: "4/9", isCorrect: true }, { text: "5/9", isCorrect: false },
      { text: "4/5", isCorrect: false }, { text: "1/2", isCorrect: false }
    ],
    emoji: "🐾",
  },
  {
    id: "fruits_12_banana",
    contextText: "Una canasta tiene 12 frutas:",
    visualContext: "Canasta: 🍎x7, 🍌x5", // 7 Manzanas, 5 Bananas
    eventToEvaluate: "Sacar una BANANA.",
    options: [
      { text: "5/12", isCorrect: true }, { text: "7/12", isCorrect: false },
      { text: "1/2", isCorrect: false }, { text: "5/7", isCorrect: false }
    ],
    emoji: "🧺",
  },
  {
    id: "fichas_10_mayor_7",
    contextText: "Caja con fichas numeradas del 1 al 10:",
    visualContext: "Fichas: ①-⑩",
    eventToEvaluate: "Sacar una ficha con un número MAYOR que 7.", // 8, 9, 10
    options: [
      { text: "3/10", isCorrect: true }, { text: "7/10", isCorrect: false },
      { text: "1/10", isCorrect: false }, { text: "3/7", isCorrect: false }
    ],
    emoji: "🏷️",
  },
];

// Scenarios for g3-s7-e12: Comparando Probabilidades (con Fracciones)
const g3s7e12_comparar_fracciones_scenarios: ProbabilityComparisonScenario[] = [
  {
    id: "cf_bolsaX_vs_bolsaY_verdes",
    contextText: "Compara la probabilidad de sacar una bolita VERDE:",
    eventA: { text: "Bolsa X: 🟢🟢⚪️⚪️⚪️ (2/5)", visual: "Prob: 2/5", favorable: 2, total: 5 },
    eventB: { text: "Bolsa Y: 🟢🟢🟢⚪️⚪️ (3/5)", visual: "Prob: 3/5", favorable: 3, total: 5 },
    emoji: "⚖️",
  },
  {
    id: "cf_ruletaP_vs_ruletaQ_azul",
    contextText: "Compara la probabilidad de caer en AZUL:",
    eventA: { text: "Ruleta P: 🟦🟥🟥🟥 (1/4)", visual: "Prob: 1/4", favorable: 1, total: 4 },
    eventB: { text: "Ruleta Q: 🟦🟨🟨 (1/3)", visual: "Prob: 1/3", favorable: 1, total: 3 },
    emoji: "🎡",
  },
  {
    id: "cf_mazo1_vs_mazo2_diamante",
    contextText: "Compara la probabilidad de sacar un DIAMANTE:",
    eventA: { text: "Mazo 1: ♦️♠️♣️ (1/3)", visual: "Prob: 1/3", favorable: 1, total: 3 },
    eventB: { text: "Mazo 2: ♦️♦️♥️♥️ (2/4)", visual: "Prob: 2/4", favorable: 2, total: 4 },
    emoji: "🃏",
  },
  {
    id: "cf_cajaA_vs_cajaB_lapiz",
    contextText: "Compara la probabilidad de sacar un LÁPIZ:",
    eventA: { text: "Caja Alfa: ✏️✏️✂️📏 (2/4)", visual: "Prob: 2/4", favorable: 2, total: 4 },
    eventB: { text: "Caja Beta: ✏️📚🎨🎨 (1/4)", visual: "Prob: 1/4", favorable: 1, total: 4 },
    emoji: "✏️",
  },
  {
    id: "cf_bolsa1_rojo_vs_bolsa2_verde_igual",
    contextText: "Compara las probabilidades:",
    eventA: { text: "Sacar ROJO de Bolsa 1: 🍬(R)x2, 🍬(A)x4 (2/6)", visual: "Prob: 2/6", favorable: 2, total: 6 },
    eventB: { text: "Sacar VERDE de Bolsa 2: 🍬(V)x1, 🍬(N)x2 (1/3)", visual: "Prob: 1/3", favorable: 1, total: 3 },
    emoji: "🍬",
  },
  {
    id: "cf_grupo1_vs_grupo2_sacar1",
    contextText: "Compara la probabilidad de sacar el número '1':",
    eventA: { text: "Grupo Uno: ①②③④⑤ (1/5)", visual: "Prob: 1/5", favorable: 1, total: 5 },
    eventB: { text: "Grupo Dos: ①②③④⑤⑥⑦ (1/7)", visual: "Prob: 1/7", favorable: 1, total: 7 },
    emoji: "🏷️",
  },
];


// Specific exercises for Third Grade - Probabilidad (s7)
export const thirdGradeProbabilidadExercises: Exercise[] = [
    { 
      id: 'g3-s7-e1', 
      title: 'Posible, imposible, seguro.', 
      description: 'Identifica la certeza de diferentes sucesos.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.CERTEZA_SUCESOS,
      question: 'Analiza el suceso: ¿Es posible, imposible o seguro?',
      data: {
        totalStars: 6, // Number of scenarios to complete
        scenarios: [
          { id: 's1', eventText: "Sacar una bolita roja de una bolsa que solo contiene bolitas rojas.", correctCertainty: 'seguro', emoji: '🔴' },
          { id: 's2', eventText: "Que un perro vuele sin ayuda.", correctCertainty: 'imposible', emoji: '🐕' },
          { id: 's3', eventText: "Que llueva mañana en tu ciudad.", correctCertainty: 'posible', emoji: '🌧️' },
          { id: 's4', eventText: "Que el sol no salga mañana.", correctCertainty: 'imposible', emoji: '☀️' },
          { id: 's5', eventText: "Tirar un dado y que salga un número menor que 7.", correctCertainty: 'seguro', emoji: '🎲' },
          { id: 's6', eventText: "Encontrar un trébol de cuatro hojas al primer intento.", correctCertainty: 'posible', emoji: '🍀' },
          { id: 's7', eventText: "Que después del lunes venga el martes.", correctCertainty: 'seguro', emoji: '🗓️' },
          { id: 's8', eventText: "Que un pez nade en el aire.", correctCertainty: 'imposible', emoji: '🐠' },
          { id: 's9', eventText: "Sacar una carta de espadas de un mazo de cartas españolas.", correctCertainty: 'posible', emoji: '🃏' },
          { id: 's10', eventText: "Que en diciembre haga calor en Argentina.", correctCertainty: 'seguro', emoji: '🇦🇷' },
          { id: 's11', eventText: "Que un gato hable en español.", correctCertainty: 'imposible', emoji: '🐈' },
          { id: 's12', eventText: "Que al lanzar una moneda, salga cara.", correctCertainty: 'posible', emoji: '🪙' },
        ] as CertaintyScenario[],
      },
      content: 'Lee la descripción de un evento y decide si es posible, imposible o seguro que ocurra.' 
    },
    { 
      id: 'g3-s7-e2', 
      title: 'Comparar Probabilidades', 
      description: 'Compara dos sucesos y decide cuál es más probable.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.COMPARAR_PROBABILIDADES,
      question: 'Observa los dos sucesos. ¿Cuál de las afirmaciones es correcta?',
      data: {
        totalStars: 6, // Number of scenarios to complete from the list
        scenarios: g3s7e2_scenarios,
      },
      content: 'Analiza dos situaciones y determina cuál tiene mayor probabilidad de ocurrir o si son iguales.' 
    },
    { 
      id: 'g3-s7-e3', 
      title: 'Expresar Probabilidad', 
      description: 'Indica la probabilidad de un suceso como "X de Y".', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: '¿Cuál es la probabilidad del suceso?',
      data: {
        totalStars: 6, 
        scenarios: g3s7e3_scenarios,
      },
      content: 'Observa el escenario y elige la opción que representa correctamente la probabilidad del evento indicado.' 
    },
    { 
      id: 'g3-s7-e4', 
      title: 'Nunca, a veces, siempre.', 
      description: 'Identifica la frecuencia de diferentes sucesos.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.FRECUENCIA_SUCESOS,
      question: 'Analiza el suceso: ¿Ocurre nunca, a veces o siempre?',
      data: {
        totalStars: 8, 
        scenarios: g3s7e4_frecuencia_scenarios,
      },
      content: 'Lee la descripción de un evento y decide si ocurre nunca, a veces o siempre.' 
    },
    { 
      id: 'g3-s7-e5', 
      title: 'Probabilidad: Casos Favorables (Más Desafíos)', 
      description: 'Calcula la probabilidad de eventos con más elementos o preguntas indirectas.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: '¿Cuál es la probabilidad del suceso?',
      data: {
        totalStars: 6, 
        scenarios: g3s7e5_harder_scenarios,
      },
      content: 'Observa el escenario, cuenta los casos y elige la probabilidad correcta.' 
    },
    { 
      id: 'g3-s7-e6', 
      title: "Probabilidad Avanzada: Lógica 'O' y 'NO'", 
      description: "Calcula la probabilidad de eventos usando 'o' y 'no'.", 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: '¿Cuál es la probabilidad del suceso?',
      data: {
        totalStars: 6, 
        scenarios: g3s7e6_advanced_scenarios,
      },
      content: "Observa, cuenta casos favorables y totales, y elige la probabilidad correcta." 
    },
    { 
      id: 'g3-s7-e7', 
      title: 'Práctica: Nunca, a veces, siempre.', 
      description: 'Más práctica con frecuencia de sucesos.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.FRECUENCIA_SUCESOS,
      question: 'Analiza el suceso: ¿Ocurre nunca, a veces o siempre?',
      data: {
        totalStars: 8, 
        scenarios: g3s7e7_frecuencia_scenarios_extra,
      },
      content: 'Lee la descripción de un evento y decide si ocurre nunca, a veces o siempre.' 
    },
    { 
      id: 'g3-s7-e8', 
      title: 'Test de probabilidad.', 
      description: 'Evalúa conocimientos básicos de probabilidad (opciones en palabras).', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: 'Indica la probabilidad del suceso.',
      data: {
        totalStars: 6, 
        scenarios: g3s7e8_test_probabilidad_scenarios_palabras,
      },
      content: 'Elige la opción que representa correctamente la probabilidad del evento.' 
    },
    { 
      id: 'g3-s7-e9', 
      title: 'Test de probabilidad con fracciones.', 
      description: 'Evalúa conocimientos de probabilidad usando fracciones.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: 'Indica la probabilidad del suceso como fracción.',
      data: {
        totalStars: 6, 
        scenarios: g3s7e9_test_probabilidad_fracciones,
      },
      content: 'Elige la fracción que representa correctamente la probabilidad del evento.' 
    },
    { 
      id: 'g3-s7-e10', 
      title: 'Probabilidad con Fracciones', 
      description: 'Representa la probabilidad de un suceso usando fracciones.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: '¿Cuál es la probabilidad del suceso (en fracción)?',
      data: {
        totalStars: 6, 
        scenarios: g3s7e10_fracciones_scenarios,
      },
      content: 'Observa el escenario y elige la fracción que representa la probabilidad.' 
    },
    { 
      id: 'g3-s7-e11', 
      title: 'Más Probabilidad con Fracciones', 
      description: 'Continúa practicando la probabilidad con fracciones, un poco más difícil.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE,
      question: 'Elige la fracción que representa la probabilidad del suceso.',
      data: {
        totalStars: 6, 
        scenarios: g3s7e11_mas_fracciones_scenarios,
      },
      content: 'Observa el escenario con más elementos y elige la fracción correcta.' 
    },
    { 
      id: 'g3-s7-e12', 
      title: 'Probabilidad: Comparando Eventos con Fracciones', 
      description: 'Compara la probabilidad de dos eventos, usando fracciones.', 
      iconName: 'ProbabilityIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.COMPARAR_PROBABILIDADES,
      question: 'Observa los dos sucesos y sus probabilidades. ¿Cuál de las afirmaciones es correcta?',
      data: {
        totalStars: 6, 
        scenarios: g3s7e12_comparar_fracciones_scenarios,
      },
      content: 'Analiza dos situaciones, determina sus probabilidades fraccionarias y compáralas.' 
    },
];
