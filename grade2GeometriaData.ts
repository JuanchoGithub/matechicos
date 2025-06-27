
import { Exercise, ExerciseComponentType, OriginalIconName, GenericVisualChallenge, BasicShapeTypeId, BASIC_SHAPE_LABELS, LineType, LINE_TYPE_LABELS } from './types';
import { 
    RectaHorizontalSVG, 
    CurvaSimpleSVG, 
    PoligonalAbiertaSVG1, 
    // Visual components for 3D shapes
    EsferaSVG, 
    PrismaRectangularSVG, // Used for Cubo
    ConoSVG, 
    CilindroSVG, 
    PiramideCuadrangularSVG, // Used for Pirámide
    // Basic 2D shapes (already used by another exercise in this file)
    Circulo2DSVG, 
    CuadradoSVG, 
    TrianguloEquilateroSVG, 
    RectanguloSVG 
} from './geometryDefinitions'; 
import { shuffleArray } from './utils'; 

// Shapes for 2nd Grade (g2-s5-e1)
const basicShapesG2: { id: BasicShapeTypeId, VisualComponent: React.FC<any> }[] = [
    { id: 'circulo', VisualComponent: Circulo2DSVG },
    { id: 'cuadrado', VisualComponent: CuadradoSVG },
    { id: 'triangulo', VisualComponent: TrianguloEquilateroSVG },
    { id: 'rectangulo', VisualComponent: RectanguloSVG },
];

const transformedBasicShapesChallengesG2: GenericVisualChallenge[] = basicShapesG2.map(shapeDef => ({
  id: `g2_shape_${shapeDef.id}`,
  VisualComponent: shapeDef.VisualComponent,
  visualProps: { className: "w-32 h-32" , strokeColor: "rgb(75, 85, 99)", fillColor: shapeDef.id === 'circulo' ? 'rgba(250, 204, 21, 0.4)' : shapeDef.id === 'cuadrado' ? 'rgba(59, 130, 246, 0.4)' : shapeDef.id === 'triangulo' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'},
  correctAnswerId: shapeDef.id,
  options: (Object.keys(BASIC_SHAPE_LABELS) as BasicShapeTypeId[]).map(typeId => ({ id: typeId, label: BASIC_SHAPE_LABELS[typeId] })),
  description: `Un ${BASIC_SHAPE_LABELS[shapeDef.id].toLowerCase()}.`,
  emoji: shapeDef.id === 'circulo' ? '🟠' : shapeDef.id === 'cuadrado' ? '🟦' : shapeDef.id === 'triangulo' ? '🔺' : '🟥'
}));

// Line types for 2nd Grade (g2-s5-e2)
const lineTypeChallengesG2: GenericVisualChallenge[] = [
  { id: 'g2_linea_recta', VisualComponent: RectaHorizontalSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'recta', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📏'},
  { id: 'g2_linea_curva', VisualComponent: CurvaSimpleSVG, visualProps: {className: "w-32 h-16"}, correctAnswerId: 'curva', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '🌊'},
  { id: 'g2_linea_poligonal', VisualComponent: PoligonalAbiertaSVG1, visualProps: {className: "w-32 h-20"}, correctAnswerId: 'poligonal', options: [{id:'recta', label:LINE_TYPE_LABELS.recta}, {id:'curva', label:LINE_TYPE_LABELS.curva}, {id:'poligonal', label:LINE_TYPE_LABELS.poligonal}], emoji: '📈'},
];

// Data for g2-s5-e3: Cuerpos Geométricos (Introducción)
const g2CuerposGeometricosChallenges: GenericVisualChallenge[] = [
  {
    id: 'g2_cuerpo_esfera_challenge',
    VisualComponent: EsferaSVG, 
    visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(239 68 68)", fillColor: "rgba(252, 165, 165, 0.3)", fillOpacity: 0.3 },
    correctAnswerId: 'esfera',
    options: [
      { id: 'esfera', label: 'Esfera' }, { id: 'cubo', label: 'Cubo' },
      { id: 'cono', label: 'Cono' }, { id: 'cilindro', label: 'Cilindro' },
    ],
    description: 'Es redonda como una pelota.',
    emoji: '⚽'
  },
  {
    id: 'g2_cuerpo_cubo_challenge',
    VisualComponent: PrismaRectangularSVG, 
    visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(59 130 246)", fillColor: "rgba(147, 197, 253, 0.3)", fillOpacity: 0.3 },
    correctAnswerId: 'cubo',
    options: [
      { id: 'cubo', label: 'Cubo' }, { id: 'piramide', label: 'Pirámide' },
      { id: 'esfera', label: 'Esfera' }, { id: 'cilindro', label: 'Cilindro' },
    ],
    description: 'Tiene 6 caras cuadradas.',
    emoji: '🧊'
  },
  {
    id: 'g2_cuerpo_cono_challenge',
    VisualComponent: ConoSVG, 
    visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(34 197 94)", fillColor: "rgba(134, 239, 172, 0.3)", fillOpacity: 0.3 },
    correctAnswerId: 'cono',
    options: [
      { id: 'cono', label: 'Cono' }, { id: 'cilindro', label: 'Cilindro' },
      { id: 'cubo', label: 'Cubo' }, { id: 'esfera', label: 'Esfera' },
    ],
    description: 'Tiene una base redonda y termina en punta.',
    emoji: '🍦'
  },
  {
    id: 'g2_cuerpo_cilindro_challenge',
    VisualComponent: CilindroSVG, 
    visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(168 85 247)", fillColor: "rgba(209, 196, 233, 0.3)", fillOpacity: 0.3 },
    correctAnswerId: 'cilindro',
    options: [
      { id: 'cilindro', label: 'Cilindro' }, { id: 'esfera', label: 'Esfera' },
      { id: 'piramide', label: 'Pirámide' }, { id: 'cono', label: 'Cono' },
    ],
    description: 'Tiene dos bases redondas iguales.',
    emoji: '🥫'
  },
  {
    id: 'g2_cuerpo_piramide_challenge',
    VisualComponent: PiramideCuadrangularSVG, 
    visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(249 115 22)", fillColor: "rgba(253, 186, 116, 0.3)", fillOpacity: 0.3 },
    correctAnswerId: 'piramide',
    options: [
      { id: 'piramide', label: 'Pirámide' }, { id: 'cono', label: 'Cono' },
      { id: 'cubo', label: 'Cubo' }, { id: 'cilindro', label: 'Cilindro' },
    ],
    description: 'Tiene una base y caras triangulares.',
    emoji: '🔺'
  },
];


export const secondGradeGeometriaExercises: Exercise[] = [
  { 
    id: 'g2-s5-e1', title: 'Figuras Geométricas Básicas', 
    description: 'Reconoce círculos, cuadrados, triángulos y rectángulos.', 
    iconName: 'GeometryIcon', isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: 8, questionPrompt: "¿Qué figura es?", challenges: shuffleArray([...transformedBasicShapesChallengesG2, ...transformedBasicShapesChallengesG2]) },
    question: '¿Qué figura es?',
  },
  { 
    id: 'g2-s5-e2', title: 'Tipos de Líneas Simples', 
    description: 'Distingue entre línea recta, curva y quebrada (poligonal).', 
    iconName: 'GeometryIcon', isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { totalStars: 6, questionPrompt: "¿Qué tipo de línea es?", challenges: shuffleArray(lineTypeChallengesG2) },
    question: '¿Qué tipo de línea es?',
  },
  { 
    id: 'g2-s5-e3', title: 'Cuerpos Geométricos (Introducción)', 
    description: 'Reconoce esfera, cubo, cono, cilindro y pirámide.', 
    iconName: 'GeometryIcon', isLocked: false, 
    componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
    data: { 
      totalStars: 5, 
      questionPrompt: "¿Qué cuerpo geométrico es este?",
      challenges: shuffleArray(g2CuerposGeometricosChallenges) 
    },
    question: '¿Qué cuerpo geométrico es?',
  },
];