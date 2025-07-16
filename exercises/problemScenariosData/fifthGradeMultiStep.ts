
import { MultiStepProblem } from '../../types';

export const fifthGradeMultiStepScenarios: MultiStepProblem[] = [
  {
    id: 'ms_g5_biblioteca',
    problemText: 'La biblioteca escolar recibe una donación de 328 libros. Ya tenían 1,452 libros. Después de organizar todos los libros, distribuyen 275 entre las aulas.',
    steps: [
      {
        question: 'Primero, ¿cuántos libros tienen en total después de recibir la donación?',
        correctAnswer: 1780
      }
    ],
    finalQuestion: 'Finalmente, ¿cuántos libros quedan en la biblioteca después de distribuir los libros a las aulas?',
    finalAnswer: 1505,
    icon: '📚'
  },
  {
    id: 'ms_g5_parque',
    problemText: 'En un parque de diversiones, el boleto de entrada cuesta $150. Un grupo de 35 estudiantes recibe un descuento de $25 por persona.',
    steps: [
      {
        question: '¿Cuál es el precio con descuento por estudiante?',
        correctAnswer: 125
      }
    ],
    finalQuestion: '¿Cuánto pagarán en total por las 35 entradas con descuento?',
    finalAnswer: 4375,
    icon: '🎡'
  },
  {
    id: 'ms_g5_pasteleria',
    problemText: 'Una pastelería vende 245 pasteles de chocolate a $85 cada uno y 178 pasteles de vainilla a $75 cada uno en una semana.',
    steps: [
      {
        question: '¿Cuánto dinero reciben por todos los pasteles de chocolate?',
        correctAnswer: 20825
      },
      {
        question: '¿Cuánto dinero reciben por todos los pasteles de vainilla?',
        correctAnswer: 13350
      }
    ],
    finalQuestion: '¿Cuál es el total de dinero recibido por todos los pasteles vendidos?',
    finalAnswer: 34175,
    icon: '🎂'
  },
  {
    id: 'ms_g5_distancias',
    problemText: 'Miguel camina 2.5 km para ir a la escuela. Después de clases, camina 1.8 km para ir a casa de su amigo y luego 3.2 km más para llegar a su casa.',
    steps: [
      {
        question: '¿Cuántos kilómetros camina Miguel después de la escuela (hasta llegar a su casa)?',
        correctAnswer: 5
      }
    ],
    finalQuestion: '¿Cuántos kilómetros camina Miguel en total durante todo el día?',
    finalAnswer: 7.5,
    icon: '🚶'
  },
  {
    id: 'ms_g5_huerto',
    problemText: 'En un huerto hay 124 árboles frutales. Cada árbol produce en promedio 35 frutas. Se venden 3,560 frutas en el mercado.',
    steps: [
      {
        question: '¿Cuántas frutas producen todos los árboles en total?',
        correctAnswer: 4340
      }
    ],
    finalQuestion: '¿Cuántas frutas quedan después de las ventas?',
    finalAnswer: 780,
    icon: '🍎'
  },
  {
    id: 'ms_g5_materiales',
    problemText: 'Para un proyecto, cada uno de los 24 estudiantes necesita 3 cartulinas, 5 plumones y 2 pegamentos. Cada cartulina cuesta $12, cada plumón cuesta $8 y cada pegamento cuesta $15.',
    steps: [
      {
        question: '¿Cuántas cartulinas se necesitan en total?',
        correctAnswer: 72
      },
      {
        question: '¿Cuántos plumones se necesitan en total?',
        correctAnswer: 120
      },
      {
        question: '¿Cuántos pegamentos se necesitan en total?',
        correctAnswer: 48
      }
    ],
    finalQuestion: '¿Cuál es el costo total de todos los materiales?',
        finalAnswer: 2304,
    icon: '🎨'
  }
];
