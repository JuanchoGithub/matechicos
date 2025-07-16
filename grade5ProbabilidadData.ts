import { Exercise, ExerciseComponentType, LikelihoodEventScenario } from './types';

// Likelihood sorting game scenarios
const likelihoodSortingScenarios: LikelihoodEventScenario[] = [
  {
    id: 'weather-rain',
    eventText: 'Lloverá esta tarde.',
    correctLikelihood: 'likely',
    emoji: '🌧️',
    feedbackMessage: '¡Correcto! Que llueva esta tarde es posible pero no seguro, así que es probable.'
  },
  {
    id: 'coin-both-sides',
    eventText: 'Una moneda caerá mostrando cara y cruz al mismo tiempo.',
    correctLikelihood: 'impossible',
    emoji: '🪙',
    feedbackMessage: '¡Correcto! Una moneda no puede mostrar ambos lados a la vez, por lo que es imposible.'
  },
  {
    id: 'sunrise-tomorrow',
    eventText: 'El sol saldrá mañana.',
    correctLikelihood: 'certain',
    emoji: '🌞',
    feedbackMessage: '¡Correcto! El sol saldrá mañana sin importar si está nublado o no, es seguro.'
  },
  {
    id: 'snow-summer',
    eventText: 'Nevará en pleno verano en la ciudad.',
    correctLikelihood: 'unlikely',
    emoji: '❄️',
    feedbackMessage: '¡Correcto! Aunque no es imposible, es muy poco probable que nieve durante el verano en la mayoría de las ciudades.'
  },
  {
    id: 'dice-seven',
    eventText: 'Al lanzar un dado de 6 caras, saldrá un 7.',
    correctLikelihood: 'impossible',
    emoji: '🎲',
    feedbackMessage: '¡Correcto! Un dado de 6 caras solo tiene números del 1 al 6, por lo que es imposible obtener un 7.'
  },
  {
    id: 'birthday-day',
    eventText: 'Tu cumpleaños caerá en algún día de la semana.',
    correctLikelihood: 'certain',
    emoji: '🎂',
    feedbackMessage: '¡Correcto! Todos los días pertenecen a algún día de la semana, así que es seguro que tu cumpleaños caerá en uno.'
  },
  {
    id: 'rainbow-rain',
    eventText: 'Después de la lluvia aparecerá un arcoíris.',
    correctLikelihood: 'likely',
    emoji: '🌈',
    feedbackMessage: '¡Correcto! Cuando hay lluvia y luego sale el sol, es probable (aunque no seguro) que se forme un arcoíris.'
  },
  {
    id: 'pencil-break',
    eventText: 'Si presionas muy fuerte un lápiz, se romperá la punta.',
    correctLikelihood: 'likely',
    emoji: '✏️',
    feedbackMessage: '¡Correcto! Aunque depende de la fuerza aplicada, es probable que la punta se rompa si presionas demasiado.'
  },
  {
    id: 'alphabet-backward',
    eventText: 'Podrás recitar el alfabeto al revés sin equivocarte en el primer intento.',
    correctLikelihood: 'unlikely',
    emoji: '🔤',
    feedbackMessage: '¡Correcto! Recitar el alfabeto al revés es difícil y requiere práctica, así que es poco probable acertar a la primera.'
  },
  {
    id: 'plant-grow-overnight',
    eventText: 'Una semilla plantada hoy se convertirá en un árbol mañana.',
    correctLikelihood: 'impossible',
    emoji: '🌱',
    feedbackMessage: '¡Correcto! Los árboles tardan años en crecer, así que es imposible que ocurra en un día.'
  },
];

export const fifthGradeProbabilidadExercises: Exercise[] = [
  {
    id: 'g5-s6-e1',
    title: 'Juego de Clasificación por Probabilidad',
    question: 'Clasifica los eventos según su probabilidad de ocurrencia',
    componentType: ExerciseComponentType.LIKELIHOOD_SORTING_GAME,
    description: 'En este ejercicio deberás clasificar diferentes eventos según su probabilidad: seguro, probable, poco probable o imposible. ¡Conviértete en un meteorólogo y predice correctamente!',
    iconName: 'ProbabilityIcon',
    isLocked: false,
    data: likelihoodSortingScenarios
  },
  // Single spinner probability exercise with random configurations
  {
    id: 'g5-prob-unified',
    title: 'Desafío de Ruleta de Carnaval',
    question: '¿Cuál es la probabilidad de que la ruleta caiga en el color indicado?',
    description: 'En este juego de carnaval, deberás calcular la probabilidad de que la ruleta caiga en un color específico. ¡Cada vez será un desafío diferente!',
    componentType: ExerciseComponentType.SPINNER_PROBABILITY,
    iconName: 'ProbabilityIcon',
    isLocked: false,
    type: 'spinner-probability',
    data: {
      useRandomConfig: true,
      // Example fallback configuration in case random generation fails
      sections: [
        { color: 'red', label: 'Rojo' },
        { color: 'blue', label: 'Azul' },
        { color: 'green', label: 'Verde' },
        { color: 'yellow', label: 'Amarillo' },
      ],
      targetSection: 'Rojo',
      correctNumerator: 1,
      correctDenominator: 4
    }
  },
  // New Coin and Dice Probability Exercise
  {
    id: 'g5-s6-e3',
    title: 'Juego de Probabilidad con Monedas y Dados',
    question: '¿Cuál es la probabilidad del evento indicado?',
    description: 'En este juego, lanzarás monedas y dados para calcular probabilidades de diferentes eventos. ¡Conviértete en un experto en probabilidad!',
    componentType: ExerciseComponentType.COIN_DICE_PROBABILITY,
    iconName: 'ProbabilityIcon',
    isLocked: false,
    type: 'coin-dice-probability',
    data: {
      scenarios: [
        {
          label: 'Moneda estándar: ¿probabilidad de sacar cara?',
          experimentType: 'coin',
          experimentConfig: {
            coinSides: [
              { value: 'heads', label: 'Cara' },
              { value: 'tails', label: 'Cruz' }
            ]
          },
          correctNumerator: 1,
          correctDenominator: 2
        },
        {
          label: 'Moneda con dos caras: ¿probabilidad de sacar cara?',
          experimentType: 'coin',
          experimentConfig: {
            coinSides: [
              { value: 'heads', label: 'Cara' },
              { value: 'heads', label: 'Cara' }
            ]
          },
          correctNumerator: 2,
          correctDenominator: 2
        },
        {
          label: 'Moneda con dos cruces: ¿probabilidad de sacar cruz?',
          experimentType: 'coin',
          experimentConfig: {
            coinSides: [
              { value: 'tails', label: 'Cruz' },
              { value: 'tails', label: 'Cruz' }
            ]
          },
          correctNumerator: 2,
          correctDenominator: 2
        },
        {
          label: 'Dado de 6 caras: ¿probabilidad de sacar un número par?',
          experimentType: 'dice',
          experimentConfig: {
            diceType: 6,
            targetType: 'even',
            targetLabel: 'número par'
          },
          correctNumerator: 3,
          correctDenominator: 6
        },
        {
          label: 'Dado de 6 caras: ¿probabilidad de sacar un 5?',
          experimentType: 'dice',
          experimentConfig: {
            diceType: 6,
            targetType: 'number',
            targetValue: 5,
            targetLabel: '5'
          },
          correctNumerator: 1,
          correctDenominator: 6
        },
        {
          label: 'Dado de 8 caras: ¿probabilidad de sacar un número mayor que 6?',
          experimentType: 'dice',
          experimentConfig: {
            diceType: 8,
            targetType: 'greater',
            targetValue: 6,
            targetLabel: 'mayor que 6'
          },
          correctNumerator: 2,
          correctDenominator: 8
        },
        {
          label: 'Moneda y dado: ¿probabilidad de sacar cara y un número par?',
          experimentType: 'combined',
          experimentConfig: {
            coinSides: [
              { value: 'heads', label: 'Cara' },
              { value: 'tails', label: 'Cruz' }
            ],
            diceType: 6,
            targetType: 'heads_even',
            targetLabel: 'cara y número par'
          },
          correctNumerator: 3,
          correctDenominator: 12
        }
      ]
    }
  },
  // Probability Word Problem Quest Exercise
  {
    id: 'g5-s6-e4',
    title: 'Misión de Problemas de Probabilidad',
    question: '¿Cuál es la probabilidad del evento?',
    description: 'Resuelve problemas de probabilidad en contextos del mundo real. ¡Calcular correctamente te permitirá descubrir pistas para la búsqueda del tesoro!',
    componentType: ExerciseComponentType.PROBABILITY_WORD_PROBLEM,
    iconName: 'ProbabilityIcon',
    isLocked: false,
    type: 'probability-word-problem',
    data: {
      scenarios: [
        {
          id: 'marbles-bag',
          prompt: 'Una bolsa tiene 3 canicas rojas y 2 canicas azules. ¿Cuál es la probabilidad de sacar una canica roja?',
          context: 'Una bolsa con canicas de diferentes colores',
          items: [
            { type: 'marble', color: '#e53935', label: 'roja', count: 3 },
            { type: 'marble', color: '#1e88e5', label: 'azul', count: 2 }
          ],
          targetItem: 'roja',
          correctNumerator: 3,
          correctDenominator: 5,
          hint: 'Cuenta cuántas canicas rojas hay (casos favorables) y divídelo por el número total de canicas (casos totales).',
          feedback: '¡Excelente! 3 canicas rojas de un total de 5 canicas nos da una probabilidad de 3/5.',
          animation: 'draw'
        },
        {
          id: 'chocolate-candy',
          prompt: 'Una caja tiene 4 caramelos de chocolate y 6 de vainilla. ¿Cuál es la probabilidad de elegir un caramelo de vainilla?',
          context: 'Una caja con caramelos de diferentes sabores',
          items: [
            { type: 'candy', color: '#795548', label: 'chocolate', count: 4 },
            { type: 'candy', color: '#fff59d', label: 'vainilla', count: 6 }
          ],
          targetItem: 'vainilla',
          correctNumerator: 6,
          correctDenominator: 10,
          simplifiedFraction: { numerator: 3, denominator: 5 },
          hint: 'Cuenta cuántos caramelos de vainilla hay y divídelo por el número total de caramelos en la caja.',
          feedback: 'Correcto! 6 caramelos de vainilla de un total de 10 caramelos nos da una probabilidad de 6/10, que se simplifica a 3/5.',
          animation: 'pick'
        },
        {
          id: 'colored-balls',
          prompt: 'Una bolsa tiene 2 pelotas verdes, 3 pelotas amarillas y 1 pelota naranja. ¿Cuál es la probabilidad de sacar una pelota amarilla?',
          context: 'Una bolsa con pelotas de diferentes colores',
          items: [
            { type: 'marble', color: '#4caf50', label: 'verde', count: 2 },
            { type: 'marble', color: '#ffeb3b', label: 'amarilla', count: 3 },
            { type: 'marble', color: '#ff9800', label: 'naranja', count: 1 }
          ],
          targetItem: 'amarilla',
          correctNumerator: 3,
          correctDenominator: 6,
          simplifiedFraction: { numerator: 1, denominator: 2 },
          hint: 'Divide el número de pelotas amarillas entre el número total de pelotas en la bolsa.',
          feedback: '¡Correcto! 3 pelotas amarillas de un total de 6 pelotas nos da una probabilidad de 3/6, que se simplifica a 1/2.',
          animation: 'draw'
        },
        {
          id: 'fruit-basket',
          prompt: 'Una canasta tiene 4 manzanas, 2 peras y 2 plátanos. ¿Cuál es la probabilidad de elegir una pera al azar?',
          context: 'Una canasta con diferentes frutas',
          items: [
            { type: 'candy', color: '#f44336', label: 'manzana', count: 4 },
            { type: 'candy', color: '#8bc34a', label: 'pera', count: 2 },
            { type: 'candy', color: '#ffeb3b', label: 'plátano', count: 2 }
          ],
          targetItem: 'pera',
          correctNumerator: 2,
          correctDenominator: 8,
          simplifiedFraction: { numerator: 1, denominator: 4 },
          hint: 'Probabilidad = número de peras ÷ número total de frutas en la canasta.',
          feedback: '¡Muy bien! 2 peras de un total de 8 frutas nos da una probabilidad de 2/8, que simplificada es 1/4.',
          animation: 'pick'
        }
      ]
    }
  },
  // Experimental Probability Simulator Exercise
  {
    id: 'g5-s6-e5',
    title: 'Simulador de Probabilidad Experimental',
    question: '¿Cuál es la probabilidad experimental y cómo se compara con la teórica?',
    description: 'Realiza experimentos virtuales para determinar probabilidades experimentales y compararlas con las teóricas. ¡Conviértete en un científico de datos!',
    componentType: ExerciseComponentType.EXPERIMENTAL_PROBABILITY_SIMULATOR,
    iconName: 'ProbabilityIcon',
    isLocked: false,
    type: 'experimental-probability-simulator',
    data: {
      scenarios: [
        {
          id: 'spinner-experiment',
          title: 'Experimento con Ruleta',
          description: 'Gira una ruleta con 4 secciones (1 roja y 3 azules) 10 veces. Registra los resultados y estima la probabilidad experimental de obtener rojo.',
          config: {
            type: 'spinner',
            sections: [
              { color: 'red', label: 'Rojo' },
              { color: 'blue', label: 'Azul' },
              { color: 'blue', label: 'Azul' },
              { color: 'blue', label: 'Azul' }
            ],
            targetSection: 'Rojo',
            numTrials: 10,
            theoreticalProbability: { numerator: 1, denominator: 4 }
          },
          hint: 'La probabilidad experimental se calcula dividiendo el número de veces que salió rojo entre el número total de giros. Para obtener un resultado más preciso, intenta aumentar el número de experimentos.'
        },
        {
          id: 'coin-experiment',
          title: 'Experimento con Moneda',
          description: 'Lanza una moneda 12 veces. ¿Cuál es la probabilidad experimental de obtener cara? Compara con la probabilidad teórica (1/2).',
          config: {
            type: 'coin',
            coinSides: [
              { value: 'heads', label: 'Cara' },
              { value: 'tails', label: 'Cruz' }
            ],
            targetValue: 'heads',
            numTrials: 12,
            theoreticalProbability: { numerator: 1, denominator: 2 }
          },
          hint: 'La probabilidad experimental se calcula dividiendo el número de caras obtenidas entre el número total de lanzamientos. Recuerda que cuantos más lanzamientos hagas, más se acercará tu resultado a la probabilidad teórica.'
        },
        {
          id: 'spinner-complex',
          title: 'Experimento Avanzado con Ruleta',
          description: 'Gira una ruleta con 6 secciones (2 rojas, 3 azules, 1 verde) 20 veces. Registra los resultados y estima la probabilidad experimental de obtener azul.',
          config: {
            type: 'spinner',
            sections: [
              { color: 'red', label: 'Rojo' },
              { color: 'red', label: 'Rojo' },
              { color: 'blue', label: 'Azul' },
              { color: 'blue', label: 'Azul' },
              { color: 'blue', label: 'Azul' },
              { color: 'green', label: 'Verde' }
            ],
            targetSection: 'Azul',
            numTrials: 20,
            theoreticalProbability: { numerator: 3, denominator: 6 }
          },
          hint: 'La probabilidad teórica de obtener azul es 3/6 = 1/2. Al realizar el experimento muchas veces, tu probabilidad experimental debería acercarse a este valor. ¿Notas alguna diferencia si aumentas el número de giros?'
        }
      ]
    }
  }
];
