
import { Scenario } from '../../types';

export const mixedOperationsAdvancedScenarios: Scenario[] = [
  {
    id: 'cajas_lapices',
    problemTextTemplate: (n1, n2) => `Hay ${n1} cajas con ${n2} lápices cada una. ¿Cuántos lápices hay en total?`,
    operation: '*',
    data1Label: 'Cajas', data1Unit: 'cajas',
    data2Label: 'Lápices por caja', data2Unit: 'lápices',
    resultLabelTemplate: (res) => `Hay ${res} lápices en total.`,
    icon: '✏️',
  },
  {
    id: 'flores_floreros',
    problemTextTemplate: (n1, n2) => `Si tienes ${n1} flores y quieres poner ${n2} flores en cada florero, ¿cuántos floreros necesitarás?`,
    operation: '/',
    data1Label: 'Total flores', data1Unit: 'flores',
    data2Label: 'Flores por florero', data2Unit: 'flores',
    resultLabelTemplate: (res) => `Necesitarás ${res} floreros.`,
    icon: '💐',
  },
  {
    id: 'paquetes_galletas_total',
    problemTextTemplate: (n1, n2) => `Compraste ${n1} paquetes de galletas, y cada paquete trae ${n2} galletas. ¿Cuántas galletas compraste en total?`,
    operation: '*',
    data1Label: 'Paquetes', data1Unit: 'paquetes',
    data2Label: 'Galletas por paquete', data2Unit: 'galletas',
    resultLabelTemplate: (res) => `Compraste ${res} galletas en total.`,
    icon: '🍪',
  },
  {
    id: 'caramelos_repartir_niños',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} caramelos y los quieres repartir en partes iguales entre ${n2} niños. ¿Cuántos caramelos le tocarán a cada niño?`,
    operation: '/',
    data1Label: 'Total caramelos', data1Unit: 'caramelos',
    data2Label: 'Niños', data2Unit: 'niños',
    resultLabelTemplate: (res) => `A cada niño le tocarán ${res} caramelos.`,
    icon: '🍬',
  },
];
