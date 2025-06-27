
import { Scenario } from '../../types';

export const fifthGradeConversionsScenarios: Scenario[] = [
  {
    id: 'g5_conv_1',
    problemTextTemplate: (n1, n2) => `Una cuerda mide ${n1} metros de largo. Si cortas un trozo de ${n2} cm, ¿cuántos centímetros de cuerda quedan? (Recuerda: 1m = 100cm)`,
    operation: '-',
    data1Label: 'Largo total (en cm)', data1Unit: 'cm',
    data2Label: 'Trozo cortado', data2Unit: 'cm',
    resultLabelTemplate: (res) => `Quedan ${res} cm de cuerda.`,
    icon: '📏',
  },
  {
    id: 'g5_conv_2',
    problemTextTemplate: (n1, n2) => `Compras una botella de jugo de ${n1/1000} litros y otra de ${n2} ml. ¿Cuántos mililitros de jugo tienes en total?`,
    operation: '+',
    data1Label: 'Botella 1 (en ml)', data1Unit: 'ml',
    data2Label: 'Botella 2', data2Unit: 'ml',
    resultLabelTemplate: (res) => `Tienes ${res} ml de jugo en total.`,
    icon: '🧃',
  },
  {
    id: 'g5_conv_3',
    problemTextTemplate: (n1, n2) => `Un paquete pesa ${n1/1000} kilogramos y otro pesa ${n2} gramos. ¿Cuál es el peso total en gramos? (Recuerda: 1kg = 1000g)`,
    operation: '+',
    data1Label: 'Paquete 1 (en g)', data1Unit: 'gramos',
    data2Label: 'Paquete 2', data2Unit: 'gramos',
    resultLabelTemplate: (res) => `El peso total es de ${res} gramos.`,
    icon: '📦',
  },
  {
    id: 'g5_conv_4',
    problemTextTemplate: (n1, n2) => `El viaje a la escuela dura ${n1} minutos. El viaje de vuelta dura ${n2} minutos. ¿Cuántos segundos dura el viaje de ida y vuelta en total? (Recuerda: 1 min = 60 seg)`,
    operation: '+',
    data1Label: 'Viaje ida (en seg)', data1Unit: 'segundos',
    data2Label: 'Viaje vuelta (en seg)', data2Unit: 'segundos',
    resultLabelTemplate: (res) => `El viaje total dura ${res} segundos.`,
    icon: '⏰',
  },
];
