
import { Exercise, ExerciseComponentType, OriginalIconName, GenericVisualChallenge, BasicShapeTypeId, BasicShapeDefinition, BASIC_SHAPE_LABELS, LineType, LINE_TYPE_LABELS, SpatialChallenge, SpatialConcept } from './types';
import { RectaHorizontalSVG, CurvaSimpleSVG, PoligonalAbiertaSVG1, PoligonalCerradaSVG1, Circulo2DSVG, CuadradoSVG, TrianguloEquilateroSVG, RectanguloSVG, CurvaCerradaSVG } from './geometryDefinitions';

// Helper function to shuffle an array (if not already available globally)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Data for spatial relationships ---
const spatialChallengesRawData: {concept: SpatialConcept, data: Omit<SpatialChallenge, 'options' | 'emoji'>[], options: {id:string, label:string}[] }[] = [
  {
    concept: 'dentro_fuera',
    options: [{ id: 'dentro', label: 'Dentro' }, { id: 'fuera', label: 'Fuera' }],
    data: [
      { id: 'apple_box_in', visuals: { item: '🍎', reference: '📦', position: 'inside' }, itemLabel: 'la manzana', referenceLabel: 'la caja', correctAnswerId: 'dentro' },
      { id: 'ball_basket_out', visuals: { item: '⚽', reference: '🧺', position: 'outside' }, itemLabel: 'la pelota', referenceLabel: 'la canasta', correctAnswerId: 'fuera' },
      { id: 'bird_cage_in', visuals: { item: '🐦', reference: '🥅', position: 'inside' }, itemLabel: 'el pájaro', referenceLabel: 'la jaula', correctAnswerId: 'dentro' },
      { id: 'fish_bowl_out', visuals: { item: '🐠', reference: '🥣', position: 'outside' }, itemLabel: 'el pez', referenceLabel: 'la pecera', correctAnswerId: 'fuera' },
      { id: 'dog_house_in', visuals: { item: '🐶', reference: '🏠', position: 'inside' }, itemLabel: 'el perro', referenceLabel: 'la casa', correctAnswerId: 'dentro'},
      { id: 'cat_box_out', visuals: { item: '🐈', reference: '🎁', position: 'outside' }, itemLabel: 'el gato', referenceLabel: 'la caja de regalo', correctAnswerId: 'fuera'},
    ]
  },
  {
    concept: 'arriba_abajo',
    options: [{ id: 'arriba', label: 'Arriba' }, { id: 'abajo', label: 'Abajo' }],
    data: [
      { id: 'cloud_tree_up', visuals: { item: '☁️', reference: '🌳', position: 'above' }, itemLabel: 'la nube', referenceLabel: 'el árbol', correctAnswerId: 'arriba' },
      { id: 'book_table_down', visuals: { item: '📚', reference: '🪑', position: 'below' }, itemLabel: 'el libro', referenceLabel: 'la silla', correctAnswerId: 'abajo' },
      { id: 'sun_house_up', visuals: { item: '☀️', reference: '🏠', position: 'above' }, itemLabel: 'el sol', referenceLabel: 'la casa', correctAnswerId: 'arriba' },
      { id: 'worm_ground_down', visuals: { item: '🐛', reference: '🌱', position: 'below' }, itemLabel: 'el gusano', referenceLabel: 'la planta', correctAnswerId: 'abajo' },
      { id: 'star_moon_up', visuals: { item: '⭐', reference: '🌙', position: 'above'}, itemLabel: 'la estrella', referenceLabel: 'la luna', correctAnswerId: 'arriba'},
      { id: 'ball_floor_down', visuals: { item: '🎈', reference: '👟', position: 'below'}, itemLabel: 'el globo', referenceLabel: 'el zapato', correctAnswerId: 'abajo'},
    ]
  },
  {
    concept: 'encima_debajo',
    options: [{ id: 'encima', label: 'Encima' }, { id: 'debajo', label: 'Debajo' }],
    data: [
      { id: 'cat_mat_on', visuals: { item: '🐈', reference: '🟩', position: 'on_top' }, itemLabel: 'el gato', referenceLabel: 'la alfombra', correctAnswerId: 'encima' },
      { id: 'shoes_bed_under', visuals: { item: '👟', reference: '🛏️', position: 'under' }, itemLabel: 'los zapatos', referenceLabel: 'la cama', correctAnswerId: 'debajo' },
      { id: 'hat_head_on', visuals: { item: '👒', reference: '😀', position: 'on_top' }, itemLabel: 'el sombrero', referenceLabel: 'la cabeza', correctAnswerId: 'encima' },
      { id: 'toy_chair_under', visuals: { item: '🧸', reference: '🪑', position: 'under' }, itemLabel: 'el juguete', referenceLabel: 'la silla', correctAnswerId: 'debajo' },
      { id: 'plate_table_on', visuals: { item: '🍽️', reference: '🟧', position: 'on_top' }, itemLabel: 'el plato', referenceLabel: 'la mesa', correctAnswerId: 'encima'},
      { id: 'mouse_table_under', visuals: { item: '🐁', reference: '🟧', position: 'under' }, itemLabel: 'el ratón', referenceLabel: 'la mesa', correctAnswerId: 'debajo'},
    ]
  },
   {
    concept: 'adelante_atras',
    options: [{ id: 'adelante', label: 'Adelante' }, { id: 'atras', label: 'Atrás' }],
    data: [
      { id: 'car_house_front', visuals: { item: '🚗', reference: '🏠', position: 'in_front' }, itemLabel: 'el auto', referenceLabel: 'la casa', correctAnswerId: 'adelante' },
      { id: 'child_tree_behind', visuals: { item: '🧍', reference: '🌳', position: 'behind' }, itemLabel: 'el niño', referenceLabel: 'el árbol', correctAnswerId: 'atras' },
      { id: 'bus_stop_front', visuals: { item: '🚌', reference: '🚏', position: 'in_front'}, itemLabel: 'el autobús', referenceLabel: 'la parada', correctAnswerId: 'adelante'},
      { id: 'backpack_person_behind', visuals: { item: '🎒', reference: '🚶', position: 'behind'}, itemLabel: 'la mochila', referenceLabel: 'la persona', correctAnswerId: 'atras'},
    ]
  },
  {
    concept: 'derecha_izquierda',
    options: [{ id: 'derecha', label: 'A la Derecha' }, { id: 'izquierda', label: 'A la Izquierda' }],
    data: [
      { id: 'apple_pear_right', visuals: { item: '🍎', reference: '🍐', position: 'right_of_pear' }, itemLabel: 'la manzana', referenceLabel: 'la pera', correctAnswerId: 'derecha' },
      { id: 'ball_box_left', visuals: { item: '⚽', reference: '📦', position: 'left_of_box' }, itemLabel: 'la pelota', referenceLabel: 'la caja', correctAnswerId: 'izquierda' },
      { id: 'sun_cloud_right', visuals: { item: '☀️', reference: '☁️', position: 'right_of_cloud'}, itemLabel: 'el sol', referenceLabel: 'la nube', correctAnswerId: 'derecha'},
      { id: 'moon_star_left', visuals: { item: '🌙', reference: '⭐', position: 'left_of_star'}, itemLabel: 'la luna', referenceLabel: 'la estrella', correctAnswerId: 'izquierda'},
    ]
  },
];

const spatialExercises: Exercise[] = spatialChallengesRawData.map((conceptData, index) => {
    const { concept, data: challengesData, options } = conceptData;
    const title = concept.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' o ');
    return {
        id: `g1-s5-e${index + 1}`, // Subject 5 (Geometría)
        title: title,
        description: `Identifica si un objeto está ${options[0].label.toLowerCase()} o ${options[1].label.toLowerCase()} de otro.`,
        iconName: 'GeometryIcon' as OriginalIconName,
        isLocked: false,
        componentType: ExerciseComponentType.POSICION_RELATIVA_OBJETOS,
        data: {
            totalStars: challengesData.length > 0 ? challengesData.length : 4,
            concept: concept,
            questionTemplateString: `¿{itemLabel} está {optionPlaceholder} de {referenceLabel}?`, // Corrected template
            challenges: shuffleArray(challengesData.map(cd => ({...cd, emoji: cd.visuals.item }))),
            options: options
        },
        question: `¿${title}?`,
    };
});


// --- Challenges for Line Types (Recta, Curva, Quebrada) ---
const lineTypeChallengesG1: GenericVisualChallenge[] = [
  { id: 'g1_linea_recta', VisualComponent: RectaHorizontalSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'recta', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📏'},
  { id: 'g1_linea_curva', VisualComponent: CurvaSimpleSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'curva', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '🌊'},
  { id: 'g1_linea_poligonal', VisualComponent: PoligonalAbiertaSVG1, visualProps: {className: "w-32 h-20"}, correctAnswerId: 'poligonal', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📈'},
  // Add more simple examples for each type if needed
  { id: 'g1_linea_recta_2', VisualComponent: RectaHorizontalSVG, visualProps: {className: "w-28 h-12", strokeColor:"blue"}, correctAnswerId: 'recta', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📏'},
  { id: 'g1_linea_curva_2', VisualComponent: CurvaSimpleSVG, visualProps: {className: "w-28 h-12", strokeColor:"green"}, correctAnswerId: 'curva', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '🌊'},
  { id: 'g1_linea_poligonal_2', VisualComponent: PoligonalAbiertaSVG1, visualProps: {className: "w-28 h-18", strokeColor:"red"}, correctAnswerId: 'poligonal', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📈'},
];

// --- Challenges for Line Open/Closed ---
const lineOpenClosedChallengesG1: GenericVisualChallenge[] = [
  { id: 'g1_linea_abierta_curva', VisualComponent: CurvaSimpleSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'abierta', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '🌊'},
  { id: 'g1_linea_abierta_poligonal', VisualComponent: PoligonalAbiertaSVG1, visualProps: {className: "w-32 h-20"}, correctAnswerId: 'abierta', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '📈'},
  { id: 'g1_linea_cerrada_poligonal', VisualComponent: PoligonalCerradaSVG1, visualProps: {className: "w-28 h-28"}, correctAnswerId: 'cerrada', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '🖼️'},
  { id: 'g1_linea_cerrada_curva', VisualComponent: CurvaCerradaSVG, visualProps: {className: "w-28 h-28", fillColor:"rgba(173,216,230,0.3)"}, correctAnswerId: 'cerrada', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '🥚'},
  // Add more simple examples
  { id: 'g1_linea_abierta_recta', VisualComponent: RectaHorizontalSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'abierta', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '📏'},
  { id: 'g1_linea_cerrada_cuadrado', VisualComponent: CuadradoSVG, visualProps: {className: "w-28 h-28", fillColor: "rgba(255, 215, 0, 0.2)"}, correctAnswerId: 'cerrada', options: [{id:'abierta', label:'Abierta'}, {id:'cerrada', label:'Cerrada'}], emoji: '🟨'},
];

// --- Challenges for Basic Shapes ---
const basicShapesDefinitionsG1: BasicShapeDefinition[] = [
  { id: 'circulo', name: 'Círculo', description: 'Figura redonda sin lados ni esquinas.', VisualComponent: Circulo2DSVG },
  { id: 'cuadrado', name: 'Cuadrado', description: 'Tiene 4 lados iguales y 4 esquinas rectas.', VisualComponent: CuadradoSVG },
  { id: 'triangulo', name: 'Triángulo', description: 'Tiene 3 lados y 3 esquinas.', VisualComponent: TrianguloEquilateroSVG },
  { id: 'rectangulo', name: 'Rectángulo', description: 'Tiene 4 lados, los opuestos son iguales, y 4 esquinas rectas.', VisualComponent: RectanguloSVG },
];

const transformedBasicShapesChallengesG1: GenericVisualChallenge[] = basicShapesDefinitionsG1.map(def => ({
  id: `g1_shape_${def.id}`,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "w-28 h-28", strokeColor: "rgb(75, 85, 99)", fillColor: def.id === 'circulo' ? 'rgba(250, 204, 21, 0.4)' : def.id === 'cuadrado' ? 'rgba(59, 130, 246, 0.4)' : def.id === 'triangulo' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)' },
  correctAnswerId: def.id,
  options: (Object.keys(BASIC_SHAPE_LABELS) as BasicShapeTypeId[]).map(typeId => ({ id: typeId, label: BASIC_SHAPE_LABELS[typeId] })),
  description: def.description,
  emoji: def.id === 'circulo' ? '🟠' : def.id === 'cuadrado' ? '🟦' : def.id === 'triangulo' ? '🔺' : '🟥'
}));


export const firstGradeGeometriaExercises: Exercise[] = [
  ...spatialExercises, // Add the 5 spatial exercises first (e1-e5)
  {
    id: 'g1-s5-e6', title: 'Líneas: Recta, Curva, Quebrada', description: 'Identifica los tipos básicos de líneas.',
    iconName: 'GeometryIcon' as OriginalIconName, isLocked: false, componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: Math.min(6, lineTypeChallengesG1.length), questionPrompt: "¿Qué tipo de línea es?", challenges: shuffleArray(lineTypeChallengesG1) },
    question: '¿Qué tipo de línea es?',
  },
  {
    id: 'g1-s5-e7', title: 'Líneas: Abierta o Cerrada', description: 'Distingue entre líneas abiertas y cerradas.',
    iconName: 'GeometryIcon' as OriginalIconName, isLocked: false, componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: Math.min(6, lineOpenClosedChallengesG1.length), questionPrompt: "¿La línea es abierta o cerrada?", challenges: shuffleArray(lineOpenClosedChallengesG1) },
    question: '¿La línea es abierta o cerrada?',
  },
  {
    id: 'g1-s5-e8', title: 'Figuras: Círculo, Cuadrado, Triángulo, Rectángulo', description: 'Reconoce las formas geométricas básicas.',
    iconName: 'GeometryIcon' as OriginalIconName, isLocked: false, componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: Math.min(8, transformedBasicShapesChallengesG1.length * 2), questionPrompt: "¿Qué figura es?", challenges: shuffleArray([...transformedBasicShapesChallengesG1, ...transformedBasicShapesChallengesG1]) }, // Duplicate for more practice
    question: '¿Qué figura es?',
  },
  {
    id: 'g1-s5-e9', title: 'Identificar Figuras Básicas (Más Práctica)', description: 'Más práctica reconociendo círculo, cuadrado, triángulo y rectángulo.',
    iconName: 'GeometryIcon' as OriginalIconName, isLocked: false, componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: Math.min(8, transformedBasicShapesChallengesG1.length * 2), questionPrompt: "¿Qué figura geométrica es?", challenges: shuffleArray([...transformedBasicShapesChallengesG1, ...transformedBasicShapesChallengesG1]) }, // Duplicate for more practice
    question: '¿Qué figura geométrica es?',
  },
];
