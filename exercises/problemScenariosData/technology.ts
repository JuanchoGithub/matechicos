
import { Scenario } from '../../types';

export const technologyScenarios: Scenario[] = [
  {
    id: 'archivos_descargados',
    problemTextTemplate: (n1, n2) => `Descargaste ${n1} canciones y ${n2} videos. ¿Cuántos archivos descargaste en total?`,
    operation: '+',
    data1Label: 'Canciones', data1Unit: 'archivos',
    data2Label: 'Videos', data2Unit: 'archivos',
    resultLabelTemplate: (res) => `Descargaste ${res} archivos en total.`,
    icon: '💻',
  },
  {
    id: 'bateria_celular',
    problemTextTemplate: (n1, n2) => `Tu celular tenía ${n1}% de batería y gastaste ${n2}% jugando. ¿Cuánta batería le queda?`,
    operation: '-',
    data1Label: 'Batería inicial', data1Unit: '%',
    data2Label: 'Batería gastada', data2Unit: '%',
    resultLabelTemplate: (res) => `Le queda ${res}% de batería.`,
    icon: '🔋',
  },
  {
    id: 'fotos_tomadas_borradas',
    problemTextTemplate: (n1, n2) => `Tomaste ${n1} fotos con tu tablet. Luego borraste ${n2} que no te gustaron. ¿Cuántas fotos te quedaron?`,
    operation: '-',
    data1Label: 'Fotos tomadas', data1Unit: 'fotos',
    data2Label: 'Fotos borradas', data2Unit: 'fotos',
    resultLabelTemplate: (res) => `Te quedaron ${res} fotos.`,
    icon: '📸',
  },
  {
    id: 'mensajes_recibidos_enviados',
    problemTextTemplate: (n1, n2) => `Recibiste ${n1} mensajes de WhatsApp y enviaste ${n2}. ¿Cuántos mensajes intercambiaste en total?`,
    operation: '+',
    data1Label: 'Mensajes recibidos', data1Unit: 'mensajes',
    data2Label: 'Mensajes enviados', data2Unit: 'mensajes',
    resultLabelTemplate: (res) => `Intercambiaste ${res} mensajes en total.`,
    icon: '💬',
  },
];
