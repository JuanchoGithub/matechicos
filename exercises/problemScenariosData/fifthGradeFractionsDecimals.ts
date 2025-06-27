
import { Scenario } from '../../types';

export const fifthGradeFractionsDecimalsScenarios: Scenario[] = [
  {
    id: 'g5_fracdec_1',
    problemTextTemplate: (n1, n2) => `Compraste ${n1} kg de manzanas y ${n2} kg de bananas. ¿Cuántos kg de fruta compraste en total?`,
    operation: '+',
    data1Label: 'Manzanas', data1Unit: 'kg',
    data2Label: 'Bananas', data2Unit: 'kg',
    resultLabelTemplate: (res) => `Compraste ${res} kg en total.`,
    icon: '⚖️',
  },
  {
    id: 'g5_fracdec_2',
    problemTextTemplate: (n1, n2) => `Una botella tenía ${n1} litros de jugo. Bebiste ${n2} litros. ¿Cuánto jugo queda?`,
    operation: '-',
    data1Label: 'Jugo inicial', data1Unit: 'litros',
    data2Label: 'Jugo bebido', data2Unit: 'litros',
    resultLabelTemplate: (res) => `Quedan ${res} litros de jugo.`,
    icon: '🥤',
  },
  {
    id: 'g5_fracdec_3',
    problemTextTemplate: (n1, n2) => `Corriste ${n1} km el lunes y ${n2} km el martes. ¿Cuántos km corriste en total?`,
    operation: '+',
    data1Label: 'Km Lunes', data1Unit: 'km',
    data2Label: 'Km Martes', data2Unit: 'km',
    resultLabelTemplate: (res) => `Corriste ${res} km en total.`,
    icon: '🏃‍♀️',
  },
  {
    id: 'g5_fracdec_4',
    problemTextTemplate: (n1, n2) => `Una receta requiere 1/4 taza de azúcar y 3/4 taza de harina. ¿Cuántas tazas de ingredientes secos son en total?`,
    operation: '+',
    data1Label: 'Azúcar', data1Unit: 'tazas',
    data2Label: 'Harina', data2Unit: 'tazas',
    resultLabelTemplate: (res) => `Son ${res} tazas en total.`,
    icon: '🥣',
  },
];
