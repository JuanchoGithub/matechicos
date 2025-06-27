
import { Scenario } from '../../types';

export const foodScenarios: Scenario[] = [
  {
    id: 'frutas_ensalada',
    problemTextTemplate: (n1, n2) => `Para una ensalada de frutas, usaste ${n1} manzanas y ${n2} bananas. ¿Cuántas frutas usaste en total?`,
    operation: '+',
    data1Label: 'Manzanas', data1Unit: 'frutas',
    data2Label: 'Bananas', data2Unit: 'frutas',
    resultLabelTemplate: (res) => `Usaste ${res} frutas en total.`,
    icon: '🥗',
  },
  {
    id: 'empanadas_comidas_cena',
    problemTextTemplate: (n1, n2) => `Había ${n1} empanadas para la cena. Entre todos comieron ${n2} empanadas. ¿Cuántas empanadas sobraron?`,
    operation: '-',
    data1Label: 'Empanadas había', data1Unit: 'empanadas',
    data2Label: 'Empanadas comidas', data2Unit: 'empanadas',
    resultLabelTemplate: (res) => `Sobraron ${res} empanadas.`,
    icon: '🥟',
  },
  {
    id: 'chocolates_caja_regalo',
    problemTextTemplate: (n1, n2) => `Una caja de chocolates tiene ${n1} chocolates con leche y ${n2} chocolates amargos. ¿Cuántos chocolates hay en la caja?`,
    operation: '+',
    data1Label: 'Chocolates con leche', data1Unit: 'chocolates',
    data2Label: 'Chocolates amargos', data2Unit: 'chocolates',
    resultLabelTemplate: (res) => `Hay ${res} chocolates en la caja.`,
    icon: '🍫',
  },
  {
    id: 'pizzas_porciones_restantes',
    problemTextTemplate: (n1, n2) => `Una pizza grande tenía ${n1} porciones. Te comiste ${n2} porciones. ¿Cuántas porciones de pizza quedan?`,
    operation: '-',
    data1Label: 'Porciones había', data1Unit: 'porciones',
    data2Label: 'Porciones comidas', data2Unit: 'porciones',
    resultLabelTemplate: (res) => `Quedan ${res} porciones de pizza.`,
    icon: '🍕',
  },
];
