
import { RemainderProblem } from '../../types';

export const fifthGradeRemainderScenarios: RemainderProblem[] = [
  {
    id: 'g5_rem_1',
    dividend: 25,
    divisor: 4,
    context: "Hay 25 galletas para empaquetar en cajas donde caben 4 galletas cada una.",
    quotientLabel: "¿Cuántas cajas se pueden llenar completamente?",
    remainderLabel: "¿Cuántas galletas sobran?",
    icon: '🍪',
  },
  {
    id: 'g5_rem_2',
    dividend: 38,
    divisor: 5,
    context: "Se necesitan transportar 38 personas en autos. En cada auto caben 5 personas.",
    quotientLabel: "¿Cuántos autos se llenarán por completo?",
    remainderLabel: "¿Cuántas personas necesitarán otro auto?",
    icon: '🚗',
  },
  {
    id: 'g5_rem_3',
    dividend: 50,
    divisor: 6,
    context: "Un agricultor recolectó 50 huevos y los quiere vender en cartones de 6 huevos.",
    quotientLabel: "¿Cuántos cartones completos puede vender?",
    remainderLabel: "¿Cuántos huevos le quedan sueltos?",
    icon: '🥚',
  },
  {
    id: 'g5_rem_4',
    dividend: 42,
    divisor: 8,
    context: "Una bibliotecaria quiere hacer pilas de 8 libros cada una con 42 libros.",
    quotientLabel: "¿Cuántas pilas de 8 libros puede hacer?",
    remainderLabel: "¿Cuántos libros no alcanzan para formar una pila completa?",
    icon: '📚',
  },
  {
    id: 'g5_rem_5',
    dividend: 100,
    divisor: 7,
    context: "Se quieren formar equipos de 7 jugadores con 100 alumnos para un torneo.",
    quotientLabel: "¿Cuántos equipos completos se pueden formar?",
    remainderLabel: "¿Cuántos alumnos quedan sin equipo?",
    icon: '⚽',
  },
];
