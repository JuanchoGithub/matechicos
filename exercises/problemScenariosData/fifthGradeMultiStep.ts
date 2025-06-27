
import { MultiStepProblem } from '../../types';

export const fifthGradeMultiStepScenarios: MultiStepProblem[] = [
  {
    id: 'g5_ms_1',
    problemText: 'Ana tenía 150 pesos. Compró un libro por 45 pesos y una revista por 25 pesos. ¿Cuánto dinero le queda?',
    steps: [
      {
        question: 'Primero, suma los gastos de Ana. ¿Cuánto gastó en total?',
        correctAnswer: 70,
      }
    ],
    finalQuestion: 'Si tenía 150 pesos y gastó 70, ¿cuánto dinero le queda?',
    finalAnswer: 80,
    icon: '📚',
  },
  {
    id: 'g5_ms_2',
    problemText: 'Un cine tiene 200 asientos. En la primera función se ocuparon 120 asientos y en la segunda, 150. ¿Cuántos asientos más se ocuparon en la segunda función que en la primera?',
    steps: [
      {
        question: 'Este es un problema de un solo paso, pero requiere comparación. ¿Cuál es la diferencia entre los asientos ocupados?',
        correctAnswer: 30,
      }
    ],
    finalQuestion: 'Calcula la diferencia: 150 - 120.',
    finalAnswer: 30,
    icon: '🍿',
  },
  {
    id: 'g5_ms_3',
    problemText: 'En una granja hay 12 vacas y el doble de gallinas que de vacas. ¿Cuántos animales hay en total?',
    steps: [
      {
        question: 'Primero, calcula cuántas gallinas hay (el doble de 12).',
        correctAnswer: 24,
      }
    ],
    finalQuestion: 'Ahora suma las 12 vacas y las 24 gallinas. ¿Cuántos animales hay?',
    finalAnswer: 36,
    icon: '🐄',
  },
  {
    id: 'g5_ms_4',
    problemText: 'Un camión transporta 5 cajas. Cada caja contiene 10 bolsas y cada bolsa pesa 2 kg. ¿Cuántos kilos transporta el camión en total?',
    steps: [
      {
        question: 'Primero, ¿cuántas bolsas hay en total?',
        correctAnswer: 50,
      }
    ],
    finalQuestion: 'Si hay 50 bolsas y cada una pesa 2 kg, ¿cuál es el peso total?',
    finalAnswer: 100,
    icon: '🚚',
  },
  {
    id: 'g5_ms_5',
    problemText: 'Compraste 3 pizzas a 180 pesos cada una. Pagaste con un billete de 1000 pesos. ¿Cuánto vuelto recibiste?',
    steps: [
      {
        question: 'Primero, calcula el costo total de las 3 pizzas.',
        correctAnswer: 540,
      }
    ],
    finalQuestion: 'Si pagaste con 1000 pesos, ¿cuánto te dieron de vuelto?',
    finalAnswer: 460,
    icon: '🍕',
  },
];
