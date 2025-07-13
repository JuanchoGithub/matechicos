
import { Scenario } from '../../types';

export const houseScenarios: Scenario[] = [
  {
    id: 'platos_lavar_fregar',
    problemTextTemplate: (n1, n2) => `Había ${n1} platos sucios en la pileta. Mamá lavó ${n2} platos. ¿Cuántos platos sucios quedan?`,
    operation: '-',
    data1Label: 'Platos sucios', data1Unit: 'platos',
    data2Label: 'Platos lavados', data2Unit: 'platos',
    resultLabelTemplate: (res) => `Quedan ${res} platos sucios.`,
    icon: '🍽️',
  },
  {
    id: 'juguetes_ordenar_guardar',
    problemTextTemplate: (n1, n2) => `Había ${n1} juguetes desparramados. Guardaste ${n2} en la caja. ¿Cuántos juguetes más necesitas guardar?`,
    operation: '-',
    data1Label: 'Juguetes desparramados', data1Unit: 'juguetes',
    data2Label: 'Juguetes guardados', data2Unit: 'juguetes',
    resultLabelTemplate: (res) => `Necesitas guardar ${res} juguetes más.`,
    icon: '🧸',
  },
  {
    id: 'libros_estanteria_colocar',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} libros en tu escritorio y ${n2} libros en una pila. ¿Cuántos libros tienes que colocar en la estantería en total?`,
    operation: '+',
    data1Label: 'Libros escritorio', data1Unit: 'libros',
    data2Label: 'Libros pila', data2Unit: 'libros',
    resultLabelTemplate: (res) => `Tienes que colocar ${res} libros en total.`,
    icon: '📚',
  },
  {
    id: 'ropa_lavar_secada',
    problemTextTemplate: (n1, n2) => `Pusiste ${n1} prendas de ropa a lavar. Ya se secaron ${n2} prendas. ¿Cuántas prendas faltan por secarse?`,
    operation: '-',
    data1Label: 'Prendas a lavar', data1Unit: 'prendas',
    data2Label: 'Prendas secas', data2Unit: 'prendas',
    resultLabelTemplate: (res) => `Faltan ${res} prendas por secarse.`,
    icon: '🧺',
  },
];
