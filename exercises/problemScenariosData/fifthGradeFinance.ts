
import { Scenario } from '../../types';

export const fifthGradeFinanceScenarios: Scenario[] = [
  {
    id: 'g5_finanzas_compra_juego_accesorio',
    problemTextTemplate: (n1, n2) => `Ahorraste para comprar un videojuego que cuesta ${n1} pesos. También quieres comprar un accesorio que cuesta ${n2} pesos. ¿Cuánto dinero necesitas en total?`,
    operation: '+',
    data1Label: 'Costo Videojuego', data1Unit: 'pesos',
    data2Label: 'Costo Accesorio', data2Unit: 'pesos',
    resultLabelTemplate: (res) => `Necesitas ${res} pesos en total.`,
    icon: '🎮',
  },
  {
    id: 'g5_finanzas_ahorros_gasto',
    problemTextTemplate: (n1, n2) => `Tenías ${n1} pesos ahorrados. Gastaste ${n2} pesos en una salida con amigos. ¿Cuánto dinero te queda?`,
    operation: '-',
    data1Label: 'Ahorros iniciales', data1Unit: 'pesos',
    data2Label: 'Dinero gastado', data2Unit: 'pesos',
    resultLabelTemplate: (res) => `Te quedan ${res} pesos.`,
    icon: '💸',
  },
  {
    id: 'g5_finanzas_venta_ganancia',
    problemTextTemplate: (n1, n2) => `Vendiste limonada por ${n1} pesos y galletas por ${n2} pesos. ¿Cuánto dinero ganaste en total?`,
    operation: '+',
    data1Label: 'Ganancia limonada', data1Unit: 'pesos',
    data2Label: 'Ganancia galletas', data2Unit: 'pesos',
    resultLabelTemplate: (res) => `Ganaste ${res} pesos en total.`,
    icon: '🍋',
  },
  {
    id: 'g5_finanzas_presupuesto_ropa',
    problemTextTemplate: (n1, n2) => `Tienes un presupuesto de ${n1} pesos para ropa. Una remera cuesta ${n2} pesos. ¿Cuánto dinero te sobrará después de comprarla?`,
    operation: '-',
    data1Label: 'Presupuesto', data1Unit: 'pesos',
    data2Label: 'Costo remera', data2Unit: 'pesos',
    resultLabelTemplate: (res) => `Te sobrarán ${res} pesos.`,
    icon: '👕',
  },
];
