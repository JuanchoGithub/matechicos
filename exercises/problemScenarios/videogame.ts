
import { Scenario } from '../../types';

export const videogameScenarios: Scenario[] = [
  {
    id: 'monedas_recolectadas_juego',
    problemTextTemplate: (n1, n2) => `En un nivel de tu juego favorito recolectaste ${n1} monedas de oro y ${n2} monedas de plata. ¿Cuántas monedas recolectaste en total?`,
    operation: '+',
    data1Label: 'Monedas de oro', data1Unit: 'monedas',
    data2Label: 'Monedas de plata', data2Unit: 'monedas',
    resultLabelTemplate: (res) => `Recolectaste ${res} monedas en total.`,
    icon: '🪙',
  },
  {
    id: 'vidas_perdidas_juego',
    problemTextTemplate: (n1, n2) => `Empezaste el juego con ${n1} vidas. Perdiste ${n2} vidas al caer en una trampa. ¿Cuántas vidas te quedan?`,
    operation: '-',
    data1Label: 'Vidas iniciales', data1Unit: 'vidas',
    data2Label: 'Vidas perdidas', data2Unit: 'vidas',
    resultLabelTemplate: (res) => `Te quedan ${res} vidas.`,
    icon: '❤️',
  },
  {
    id: 'puntos_experiencia_ganados',
    problemTextTemplate: (n1, n2) => `Ganaste ${n1} puntos de experiencia por completar una misión y ${n2} puntos por derrotar a un enemigo. ¿Cuántos puntos de experiencia ganaste en total?`,
    operation: '+',
    data1Label: 'Puntos misión', data1Unit: 'puntos',
    data2Label: 'Puntos enemigo', data2Unit: 'puntos',
    resultLabelTemplate: (res) => `Ganaste ${res} puntos de experiencia en total.`,
    icon: '🌟',
  },
  {
    id: 'pociones_usadas_juego',
    problemTextTemplate: (n1, n2) => `Tenías ${n1} pociones de curación en tu inventario. Usaste ${n2} pociones después de una batalla. ¿Cuántas pociones te quedan?`,
    operation: '-',
    data1Label: 'Pociones tenías', data1Unit: 'pociones',
    data2Label: 'Pociones usadas', data2Unit: 'pociones',
    resultLabelTemplate: (res) => `Te quedan ${res} pociones.`,
    icon: '🧪',
  },
];
