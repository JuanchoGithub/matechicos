
import { Scenario } from '../../types'; // This path should now be correct

export const firstGradeTensSimpleTwoDigitScenarios: Scenario[] = [
  // Sumas
  {
    id: 'g1_figus_decenas_suma',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} figuritas. Te regalan ${n2} más. ¿Cuántas figuritas tienes ahora?`,
    operation: '+', data1Label: 'Figuritas tenías', data1Unit: 'figuritas', data2Label: 'Te regalan', data2Unit: 'figuritas',
    resultLabelTemplate: (res) => `Ahora tienes ${res} figuritas.`, icon: '✨',
  },
  {
    id: 'g1_puntos_juego_suma',
    problemTextTemplate: (n1, n2) => `En un juego, ganas ${n1} puntos y luego ${n2} puntos más. ¿Cuántos puntos tienes en total?`,
    operation: '+', data1Label: 'Puntos ganas', data1Unit: 'puntos', data2Label: 'Ganas más', data2Unit: 'puntos',
    resultLabelTemplate: (res) => `Tienes ${res} puntos en total.`, icon: '🎯',
  },
  {
    id: 'g1_crayones_caja_suma',
    problemTextTemplate: (n1, n2) => `Una caja tiene ${n1} crayones. Agregas ${n2} crayones más. ¿Cuántos crayones hay ahora?`,
    operation: '+', data1Label: 'Crayones había', data1Unit: 'crayones', data2Label: 'Agregas', data2Unit: 'crayones',
    resultLabelTemplate: (res) => `Ahora hay ${res} crayones.`, icon: '🖍️',
  },
  {
    id: 'g1_monedas_alcancia_suma',
    problemTextTemplate: (n1, n2) => `Pones ${n1} monedas en tu alcancía. Luego pones ${n2} monedas más. ¿Cuántas monedas pusiste en total?`,
    operation: '+', data1Label: 'Monedas pones', data1Unit: 'monedas', data2Label: 'Pones más', data2Unit: 'monedas',
    resultLabelTemplate: (res) => `Pusiste ${res} monedas en total.`, icon: '🪙',
  },
  {
    id: 'g1_pegatinas_album_suma',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} pegatinas. Consigues ${n2} más. ¿Cuántas pegatinas tienes en total?`,
    operation: '+', data1Label: 'Pegatinas tenías', data1Unit: 'pegatinas', data2Label: 'Consigues más', data2Unit: 'pegatinas',
    resultLabelTemplate: (res) => `Tienes ${res} pegatinas en total.`, icon: '🌟',
  },
  {
    id: 'g1_cartas_mazo_suma',
    problemTextTemplate: (n1, n2) => `En un mazo hay ${n1} cartas. Se añaden ${n2} cartas nuevas. ¿Cuántas cartas hay ahora?`,
    operation: '+', data1Label: 'Cartas había', data1Unit: 'cartas', data2Label: 'Se añaden', data2Unit: 'cartas',
    resultLabelTemplate: (res) => `Ahora hay ${res} cartas.`, icon: '🃏',
  },
  {
    id: 'g1_bloques_construccion_suma',
    problemTextTemplate: (n1, n2) => `Usas ${n1} bloques para una torre. Luego agregas ${n2} bloques más. ¿Cuántos bloques usaste?`,
    operation: '+', data1Label: 'Bloques usas', data1Unit: 'bloques', data2Label: 'Agregas más', data2Unit: 'bloques',
    resultLabelTemplate: (res) => `Usaste ${res} bloques.`, icon: '🧱',
  },
  {
    id: 'g1_canciones_escuchas_suma',
    problemTextTemplate: (n1, n2) => `Escuchas ${n1} canciones. Después escuchas ${n2} canciones más. ¿Cuántas canciones escuchaste?`,
    operation: '+', data1Label: 'Canciones escuchas', data1Unit: 'canciones', data2Label: 'Escuchas más', data2Unit: 'canciones',
    resultLabelTemplate: (res) => `Escuchaste ${res} canciones.`, icon: '🎶',
  },
  {
    id: 'g1_pasos_caminas_suma',
    problemTextTemplate: (n1, n2) => `Caminas ${n1} pasos. Luego caminas ${n2} pasos más. ¿Cuántos pasos caminaste en total?`,
    operation: '+', data1Label: 'Pasos caminas', data1Unit: 'pasos', data2Label: 'Caminas más', data2Unit: 'pasos',
    resultLabelTemplate: (res) => `Caminaste ${res} pasos en total.`, icon: '👣',
  },
  {
    id: 'g1_animalitos_granja_suma',
    problemTextTemplate: (n1, n2) => `En una granja hay ${n1} pollitos. Nacen ${n2} más. ¿Cuántos pollitos hay ahora?`,
    operation: '+', data1Label: 'Pollitos había', data1Unit: 'pollitos', data2Label: 'Nacen más', data2Unit: 'pollitos',
    resultLabelTemplate: (res) => `Ahora hay ${res} pollitos.`, icon: '🐤',
  },
  // Restas
  {
    id: 'g1_dinero_gasta_resta',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} pesos. Gastas ${n2} pesos en un helado. ¿Cuánto dinero te queda?`,
    operation: '-', data1Label: 'Pesos tenías', data1Unit: 'pesos', data2Label: 'Gastas', data2Unit: 'pesos',
    resultLabelTemplate: (res) => `Te quedan ${res} pesos.`, icon: '💸',
  },
  {
    id: 'g1_galletas_caja_resta',
    problemTextTemplate: (n1, n2) => `Una caja tiene ${n1} galletas. Te comes ${n2}. ¿Cuántas galletas quedan en la caja?`,
    operation: '-', data1Label: 'Galletas había', data1Unit: 'galletas', data2Label: 'Te comes', data2Unit: 'galletas',
    resultLabelTemplate: (res) => `Quedan ${res} galletas en la caja.`, icon: '🍪',
  },
  {
    id: 'g1_hojas_cuaderno_resta',
    problemTextTemplate: (n1, n2) => `Tu cuaderno tiene ${n1} hojas. Usas ${n2} hojas para dibujar. ¿Cuántas hojas quedan?`,
    operation: '-', data1Label: 'Hojas tenía', data1Unit: 'hojas', data2Label: 'Usas', data2Unit: 'hojas',
    resultLabelTemplate: (res) => `Quedan ${res} hojas.`, icon: '🗒️',
  },
  {
    id: 'g1_pasajeros_tren_resta',
    problemTextTemplate: (n1, n2) => `En el tren viajan ${n1} personas. Se bajan ${n2} en una estación. ¿Cuántas personas siguen en el tren?`,
    operation: '-', data1Label: 'Personas viajaban', data1Unit: 'personas', data2Label: 'Se bajan', data2Unit: 'personas',
    resultLabelTemplate: (res) => `Siguen ${res} personas en el tren.`, icon: '🚆',
  },
  {
    id: 'g1_juguetes_guardados_resta',
    problemTextTemplate: (n1, n2) => `Tenías ${n1} juguetes. Guardaste ${n2} en una caja. ¿Cuántos juguetes te quedaron afuera?`,
    operation: '-', data1Label: 'Juguetes tenías', data1Unit: 'juguetes', data2Label: 'Guardaste', data2Unit: 'juguetes',
    resultLabelTemplate: (res) => `Te quedaron ${res} juguetes afuera.`, icon: '📦',
  },
  {
    id: 'g1_libros_leidos_resta',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} libros por leer. Ya leíste ${n2}. ¿Cuántos libros te faltan leer?`,
    operation: '-', data1Label: 'Libros por leer', data1Unit: 'libros', data2Label: 'Leíste', data2Unit: 'libros',
    resultLabelTemplate: (res) => `Te faltan leer ${res} libros.`, icon: '📖',
  },
  {
    id: 'g1_globos_fiesta_revientan_resta',
    problemTextTemplate: (n1, n2) => `Había ${n1} globos en la fiesta. Se reventaron ${n2}. ¿Cuántos globos quedaron?`,
    operation: '-', data1Label: 'Globos había', data1Unit: 'globos', data2Label: 'Reventaron', data2Unit: 'globos',
    resultLabelTemplate: (res) => `Quedaron ${res} globos.`, icon: '🎈',
  },
  {
    id: 'g1_manzanas_cesta_comen_resta',
    problemTextTemplate: (n1, n2) => `Una cesta tiene ${n1} manzanas. Te comes ${n2} manzanas. ¿Cuántas quedan en la cesta?`,
    operation: '-', data1Label: 'Manzanas había', data1Unit: 'manzanas', data2Label: 'Te comes', data2Unit: 'manzanas',
    resultLabelTemplate: (res) => `Quedan ${res} manzanas en la cesta.`, icon: '🧺',
  },
  {
    id: 'g1_flores_ramo_marchitan_resta',
    problemTextTemplate: (n1, n2) => `Un ramo tiene ${n1} flores. Se marchitan ${n2}. ¿Cuántas flores bonitas quedan?`,
    operation: '-', data1Label: 'Flores había', data1Unit: 'flores', data2Label: 'Se marchitan', data2Unit: 'flores',
    resultLabelTemplate: (res) => `Quedan ${res} flores bonitas.`, icon: '💐',
  },
  {
    id: 'g1_peces_pecera_regalan_resta',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} peces en tu pecera. Regalas ${n2} a un amigo. ¿Cuántos peces te quedan?`,
    operation: '-', data1Label: 'Peces tenías', data1Unit: 'peces', data2Label: 'Regalas', data2Unit: 'peces',
    resultLabelTemplate: (res) => `Te quedan ${res} peces.`, icon: '🐠',
  },
];
