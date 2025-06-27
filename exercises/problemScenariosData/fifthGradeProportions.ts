
import { ProportionProblem } from '../../types';

export const fifthGradeProportionsScenarios: ProportionProblem[] = [
  {
    id: 'g5_prop_1',
    a: 3, aLabel: 'manzanas',
    b: 2, bLabel: 'pesos',
    c: 9, cLabel: 'manzanas',
    xLabel: 'pesos',
    context: "Si 3 manzanas cuestan $2, ¿cuánto costarán 9 manzanas?",
    icon: '🍎'
  },
  {
    id: 'g5_prop_2',
    a: 4, aLabel: 'lápices',
    b: 10, bLabel: 'pesos',
    c: 10, cLabel: 'lápices',
    xLabel: 'pesos',
    context: "Si 4 lápices cuestan $10, ¿cuánto costarán 10 lápices?",
    icon: '✏️'
  },
  {
    id: 'g5_prop_3',
    a: 2, aLabel: 'horas',
    b: 120, bLabel: 'km',
    c: 5, cLabel: 'horas',
    xLabel: 'km',
    context: "Un auto recorre 120 km en 2 horas. A la misma velocidad, ¿cuántos km recorrerá en 5 horas?",
    icon: '🚗'
  },
  {
    id: 'g5_prop_4',
    a: 5, aLabel: 'obreros',
    b: 10, bLabel: 'días',
    c: 2, cLabel: 'obreros',
    xLabel: 'días',
    context: "Si 5 obreros construyen una pared en 10 días, ¿cuánto tardarían 2 obreros? (¡Ojo! Proporción inversa)",
    icon: '👷'
  },
  {
    id: 'g5_prop_5',
    a: 100, aLabel: 'gramos de queso',
    b: 50, bLabel: 'pesos',
    c: 250, cLabel: 'gramos de queso',
    xLabel: 'pesos',
    context: "Si 100 gramos de queso cuestan $50, ¿cuánto costarán 250 gramos?",
    icon: '🧀'
  },
];
