
import { Scenario } from '../../types'; // This path should now be correct

export const generalScenarios: Scenario[] = [
  {
    id: 'peces_acuario_venden',
    problemTextTemplate: (n1: number, n2: number) => `En una tienda de mascotas había ${n1} peces en un acuario. Si vendieron ${n2} peces, ¿cuántos quedan?`,
    operation: '-',
    data1Label: 'Peces había',
    data1Unit: 'peces',
    data2Label: 'Peces vendidos',
    data2Unit: 'peces',
    resultLabelTemplate: (res: number) => `Quedan ${res} peces en el acuario.`,
    icon: '🐠',
  },
  // Add more general scenarios as needed from the original problemScenarios.ts
  {
    id: 'tractor_cereales',
    problemTextTemplate: (n1, n2) => `Un tractor transporta ${n1} kilos de maíz y ${n2} kilos de trigo. ¿Cuántos kilos de cereal transporta en total?`,
    operation: '+', data1Label: 'De maíz', data1Unit: 'kilos', data2Label: 'De trigo', data2Unit: 'kilos',
    resultLabelTemplate: (res) => `El tractor transporta ${res} kilos de cereal en total.`, icon: '🚜',
  },
  {
    id: 'pasajeros_colectivo_suben',
    problemTextTemplate: (n1, n2) => `En un colectivo viajan ${n1} pasajeros. En la primera parada, suben ${n2} pasajeros más. ¿Cuántos pasajeros hay ahora en el colectivo?`,
    operation: '+', data1Label: 'Pasajeros iniciales', data1Unit: 'pasajeros', data2Label: 'Suben en parada', data2Unit: 'pasajeros',
    resultLabelTemplate: (res) => `Ahora hay ${res} pasajeros en el colectivo.`, icon: '🚌',
  },
];
