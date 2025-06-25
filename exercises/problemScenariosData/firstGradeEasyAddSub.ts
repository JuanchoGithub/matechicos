
import { Scenario } from '../../types'; // This path should now be correct

export const firstGradeEasyAddSubScenarios: Scenario[] = [
  // Sums
  {
    id: 'g1_globos_suma_simple',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} globo${n1 === 1 ? '' : 's'}. Te regalan ${n2} más. ¿Cuántos globos tienes ahora?`,
    operation: '+', data1Label: 'Globos tenías', data1Unit: 'globos', data2Label: 'Te regalan', data2Unit: 'globos',
    resultLabelTemplate: (res) => `Ahora tienes ${res} globo${res === 1 ? '' : 's'}.`, icon: '🎈',
  },
  {
    id: 'g1_manzanas_junta_simple',
    problemTextTemplate: (n1, n2) => `Juntas ${n1} manzana${n1 === 1 ? '' : 's'} rojas y ${n2} manzana${n2 === 1 ? '' : 's'} verdes. ¿Cuántas manzanas tienes en total?`,
    operation: '+', data1Label: 'Manzanas rojas', data1Unit: 'manzanas', data2Label: 'Manzanas verdes', data2Unit: 'manzanas',
    resultLabelTemplate: (res) => `Tienes ${res} manzana${res === 1 ? '' : 's'} en total.`, icon: '🍎',
  },
  {
    id: 'g1_lapices_compra_simple',
    problemTextTemplate: (n1, n2) => `Hay ${n1} lápiz${n1 === 1 ? '' : 'ces'} en la caja. Compras ${n2} más. ¿Cuántos lápices hay ahora?`,
    operation: '+', data1Label: 'Lápices había', data1Unit: 'lápices', data2Label: 'Compras', data2Unit: 'lápices',
    resultLabelTemplate: (res) => `Ahora hay ${res} lápiz${res === 1 ? '' : 'ces'}.`, icon: '✏️',
  },
  {
    id: 'g1_autitos_amigo_simple',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} autito${n1 === 1 ? '' : 's'}. Tu amigo te da ${n2}. ¿Cuántos autitos tienes en total?`,
    operation: '+', data1Label: 'Autitos tenías', data1Unit: 'autitos', data2Label: 'Te da', data2Unit: 'autitos',
    resultLabelTemplate: (res) => `Tienes ${res} autito${res === 1 ? '' : 's'} en total.`, icon: '🚗',
  },
  {
    id: 'g1_flores_recoge_simple',
    problemTextTemplate: (n1, n2) => `Recoges ${n1} flor${n1 === 1 ? '' : 'es'} amarillas y ${n2} flor${n2 === 1 ? '' : 'es'} rojas. ¿Cuántas flores recogiste?`,
    operation: '+', data1Label: 'Flores amarillas', data1Unit: 'flores', data2Label: 'Flores rojas', data2Unit: 'flores',
    resultLabelTemplate: (res) => `Recogiste ${res} flor${res === 1 ? '' : 'es'}.`, icon: '🌸',
  },
   {
    id: 'g1_peces_agrega_simple',
    problemTextTemplate: (n1, n2) => `En la pecera hay ${n1} ${n1 === 1 ? 'pez' : 'peces'}. Agregan ${n2} más. ¿Cuántos peces hay ahora?`,
    operation: '+', data1Label: 'Peces había', data1Unit: 'peces', data2Label: 'Agregan', data2Unit: 'peces',
    resultLabelTemplate: (res) => `Ahora hay ${res} ${res === 1 ? 'pez' : 'peces'}.`, icon: '🐠',
  },
  {
    id: 'g1_libros_estante_simple',
    problemTextTemplate: (n1, n2) => `Hay ${n1} ${n1 === 1 ? 'libro' : 'libros'} en un estante. Pones ${n2} más. ¿Cuántos libros hay ahora?`,
    operation: '+', data1Label: 'Libros había', data1Unit: 'libros', data2Label: 'Pones', data2Unit: 'libros',
    resultLabelTemplate: (res) => `Ahora hay ${res} ${res === 1 ? 'libro' : 'libros'}.`, icon: '📚',
  },
  {
    id: 'g1_patos_laguna_simple',
    problemTextTemplate: (n1, n2) => `Nadan ${n1} ${n1 === 1 ? 'pato' : 'patos'} en la laguna. Llegan ${n2} más. ¿Cuántos patos nadan ahora?`,
    operation: '+', data1Label: 'Patos nadando', data1Unit: 'patos', data2Label: 'Llegan', data2Unit: 'patos',
    resultLabelTemplate: (res) => `Ahora nadan ${res} ${res === 1 ? 'pato' : 'patos'}.`, icon: '🦆',
  },
  {
    id: 'g1_soles_dibuja_simple',
    problemTextTemplate: (n1, n2) => `Dibujas ${n1} ${n1 === 1 ? 'sol' : 'soles'} pequeños. Luego dibujas ${n2} más. ¿Cuántos soles dibujaste?`,
    operation: '+', data1Label: 'Soles dibujados', data1Unit: 'soles', data2Label: 'Dibuja más', data2Unit: 'soles',
    resultLabelTemplate: (res) => `Dibujaste ${res} ${res === 1 ? 'sol' : 'soles'}.`, icon: '☀️',
  },
   {
    id: 'g1_nubes_cielo_simple',
    problemTextTemplate: (n1, n2) => `Ves ${n1} ${n1 === 1 ? 'nube' : 'nubes'} en el cielo. Aparecen ${n2} más. ¿Cuántas nubes ves ahora?`,
    operation: '+', data1Label: 'Nubes veías', data1Unit: 'nubes', data2Label: 'Aparecen', data2Unit: 'nubes',
    resultLabelTemplate: (res) => `Ahora ves ${res} ${res === 1 ? 'nube' : 'nubes'}.`, icon: '☁️',
  },
  // Restas
  {
    id: 'g1_galletas_come_simple',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} galleta${n1 === 1 ? '' : 's'}. Te comes ${n2}. ¿Cuántas galletas te quedan?`,
    operation: '-', data1Label: 'Galletas tenías', data1Unit: 'galletas', data2Label: 'Te comes', data2Unit: 'galletas',
    resultLabelTemplate: (res) => `Te quedan ${res} galleta${res === 1 ? '' : 's'}.`, icon: '🍪',
  },
  {
    id: 'g1_pelotas_pierde_simple',
    problemTextTemplate: (n1, n2) => `Juegas con ${n1} pelota${n1 === 1 ? '' : 's'}. Pierdes ${n2}. ¿Cuántas pelotas te quedan?`,
    operation: '-', data1Label: 'Pelotas tenías', data1Unit: 'pelotas', data2Label: 'Pierdes', data2Unit: 'pelotas',
    resultLabelTemplate: (res) => `Te quedan ${res} pelota${res === 1 ? '' : 's'}.`, icon: '⚽',
  },
  {
    id: 'g1_juguetes_presta_simple',
    problemTextTemplate: (n1, n2) => `Tenías ${n1} juguete${n1 === 1 ? '' : 's'}. Prestaste ${n2}. ¿Cuántos juguetes tienes ahora?`,
    operation: '-', data1Label: 'Juguetes tenías', data1Unit: 'juguetes', data2Label: 'Prestaste', data2Unit: 'juguetes',
    resultLabelTemplate: (res) => `Ahora tienes ${res} juguete${res === 1 ? '' : 's'}.`, icon: '🧸',
  },
  {
    id: 'g1_pájaros_vuelan_simple',
    problemTextTemplate: (n1, n2) => `Hay ${n1} pájaro${n1 === 1 ? '' : 's'} en el árbol. Se vuelan ${n2}. ¿Cuántos pájaros quedan?`,
    operation: '-', data1Label: 'Pájaros había', data1Unit: 'pájaros', data2Label: 'Se vuelan', data2Unit: 'pájaros',
    resultLabelTemplate: (res) => `Quedan ${res} pájaro${res === 1 ? '' : 's'}.`, icon: '🐦',
  },
  {
    id: 'g1_caramelos_comparte_simple',
    problemTextTemplate: (n1, n2) => `Tienes ${n1} caramelo${n1 === 1 ? '' : 's'}. Compartes ${n2}. ¿Cuántos caramelos te quedan?`,
    operation: '-', data1Label: 'Caramelos tenías', data1Unit: 'caramelos', data2Label: 'Compartes', data2Unit: 'caramelos',
    resultLabelTemplate: (res) => `Te quedan ${res} caramelo${res === 1 ? '' : 's'}.`, icon: '🍬',
  },
  {
    id: 'g1_estrellas_desaparecen_simple',
    problemTextTemplate: (n1, n2) => `En el cielo hay ${n1} ${n1 === 1 ? 'estrella' : 'estrellas'}. Desaparecen ${n2}. ¿Cuántas estrellas quedan?`,
    operation: '-', data1Label: 'Estrellas había', data1Unit: 'estrellas', data2Label: 'Desaparecen', data2Unit: 'estrellas',
    resultLabelTemplate: (res) => `Quedan ${res} ${res === 1 ? 'estrella' : 'estrellas'}.`, icon: '🌟',
  },
  {
    id: 'g1_burbujas_explotan_simple',
    problemTextTemplate: (n1, n2) => `Haces ${n1} ${n1 === 1 ? 'burbuja' : 'burbujas'}. Se explotan ${n2}. ¿Cuántas burbujas quedan?`,
    operation: '-', data1Label: 'Burbujas hiciste', data1Unit: 'burbujas', data2Label: 'Explotan', data2Unit: 'burbujas',
    resultLabelTemplate: (res) => `Quedan ${res} ${res === 1 ? 'burbuja' : 'burbujas'}.`, icon: '🫧',
  },
  {
    id: 'g1_velas_apagan_simple',
    problemTextTemplate: (n1, n2) => `Hay ${n1} ${n1 === 1 ? 'vela' : 'velas'} encendidas. Se apagan ${n2}. ¿Cuántas velas quedan prendidas?`,
    operation: '-', data1Label: 'Velas encendidas', data1Unit: 'velas', data2Label: 'Se apagan', data2Unit: 'velas',
    resultLabelTemplate: (res) => `Quedan ${res} ${res === 1 ? 'vela' : 'velas'} prendidas.`, icon: '🕯️',
  },
   {
    id: 'g1_botones_caen_simple',
    problemTextTemplate: (n1, n2) => `Una camisa tiene ${n1} ${n1 === 1 ? 'botón' : 'botones'}. Se caen ${n2}. ¿Cuántos botones quedan?`,
    operation: '-', data1Label: 'Botones tenía', data1Unit: 'botones', data2Label: 'Se caen', data2Unit: 'botones',
    resultLabelTemplate: (res) => `Quedan ${res} ${res === 1 ? 'botón' : 'botones'}.`, icon: '🔘',
  },
  {
    id: 'g1_hojas_caen_arbol_simple',
    problemTextTemplate: (n1, n2) => `Un árbol tiene ${n1} ${n1 === 1 ? 'hoja' : 'hojas'}. Se caen ${n2}. ¿Cuántas hojas le quedan al árbol?`,
    operation: '-', data1Label: 'Hojas tenía', data1Unit: 'hojas', data2Label: 'Se caen', data2Unit: 'hojas',
    resultLabelTemplate: (res) => `Al árbol le quedan ${res} ${res === 1 ? 'hoja' : 'hojas'}.`, icon: '🍂',
  },
];
