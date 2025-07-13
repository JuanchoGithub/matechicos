
import { Scenario } from '../../types';

export const transportScenarios: Scenario[] = [
  {
    id: 'kilometros_viaje_auto',
    problemTextTemplate: (n1, n2) => `Un auto recorrió ${n1} kilómetros por la mañana y ${n2} kilómetros por la tarde. ¿Cuántos kilómetros recorrió en total?`,
    operation: '+',
    data1Label: 'Km mañana', data1Unit: 'km',
    data2Label: 'Km tarde', data2Unit: 'km',
    resultLabelTemplate: (res) => `El auto recorrió ${res} km en total.`,
    icon: '🚗',
  },
  {
    id: 'pasajeros_avion_destino',
    problemTextTemplate: (n1, n2) => `Un avión despegó con ${n1} pasajeros. En la primera escala bajaron ${n2} pasajeros. ¿Cuántos pasajeros siguieron viaje?`,
    operation: '-',
    data1Label: 'Pasajeros al despegar', data1Unit: 'pasajeros',
    data2Label: 'Pasajeros bajaron', data2Unit: 'pasajeros',
    resultLabelTemplate: (res) => `Siguieron viaje ${res} pasajeros.`,
    icon: '✈️',
  },
  {
    id: 'bicicletas_parque_suman',
    problemTextTemplate: (n1, n2) => `Había ${n1} bicicletas en el bicicletero del parque. Llegaron ${n2} ciclistas más. ¿Cuántas bicicletas hay ahora?`,
    operation: '+',
    data1Label: 'Bicicletas había', data1Unit: 'bicicletas',
    data2Label: 'Bicicletas llegaron', data2Unit: 'bicicletas',
    resultLabelTemplate: (res) => `Ahora hay ${res} bicicletas.`,
    icon: '🚲',
  },
  {
    id: 'barcos_puerto_zarpan',
    problemTextTemplate: (n1, n2) => `En el puerto había ${n1} barcos amarrados. Zarparon ${n2} barcos. ¿Cuántos barcos quedaron en el puerto?`,
    operation: '-',
    data1Label: 'Barcos había', data1Unit: 'barcos',
    data2Label: 'Barcos zarparon', data2Unit: 'barcos',
    resultLabelTemplate: (res) => `Quedaron ${res} barcos en el puerto.`,
    icon: '🚢',
  },
];
