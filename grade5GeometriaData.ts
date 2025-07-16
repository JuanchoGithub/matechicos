import { Exercise, ExerciseComponentType, TriangleQuadExplorerChallenge, QuadrilateralTypeId, QUADRILATERAL_TYPE_LABELS, NetsOf3DShapesChallenge } from './types';
import { polygonSortingChallenges, quadrilateralDefinitions, shape3DCountingChallenges, NetCuboSVG, NetPrismaRectSVG, NetPiramideCuadrSVG, ConoSVG, CilindroSVG, NetCilindroSVG, NetConoSVG } from './geometryDefinitions'; 
import { InteractivePrism, InteractiveCube, InteractivePyramid } from '@components';
import { shuffleArray } from './utils';

const quadOptions = shuffleArray(Object.keys(QUADRILATERAL_TYPE_LABELS) as QuadrilateralTypeId[]);

const triangleAndQuadChallenges: TriangleQuadExplorerChallenge[] = [
    { type: 'triangle_angle', knownAngles: [50, 60] },
    { type: 'quad_property', description: 'Tengo 4 lados iguales y 4 ángulos rectos (90°).', correctShapeId: 'cuadrado', options: quadOptions },
    { type: 'triangle_angle', knownAngles: [90, 30] },
    { type: 'quad_property', description: 'Mis lados opuestos son iguales y paralelos.', correctShapeId: 'paralelogramo', options: quadOptions },
    { type: 'triangle_angle', knownAngles: [45, 45] },
    { type: 'quad_property', description: 'Tengo 4 lados iguales, pero mis ángulos no son rectos.', correctShapeId: 'rombo', options: quadOptions },
    { type: 'triangle_angle', knownAngles: [100, 40] },
    { type: 'quad_property', description: 'Solo tengo un par de lados paralelos.', correctShapeId: 'trapecio', options: quadOptions },
    { type: 'triangle_angle', knownAngles: [25, 85] },
    { type: 'quad_property', description: 'Mis lados opuestos son iguales, y mis 4 ángulos son rectos.', correctShapeId: 'rectangulo', options: quadOptions },
];

// Separate construction challenges
const g5ConstructionNetsChallenges: NetsOf3DShapesChallenge[] = [
    // Construct challenges
    {
        type: 'construct',
        targetShape: 'cube',
        pieces: [{ type: 'square', count: 6 }],
        gridSize: { rows: 6, cols: 6 },
        validLayouts: [], 
        feedback: {
            invalidCount: "Un cubo necesita exactamente 6 caras cuadradas.",
            invalidShape: "Este patrón no se puede plegar para formar un cubo. ¡Intenta otra disposición!",
            correct: "¡Excelente! Este patrón forma un cubo."
        }
    },
    {
        type: 'construct',
        targetShape: 'rectangular_prism',
        pieces: [{ type: 'rectangle_a', count: 4 }, { type: 'square', count: 2 }],
        gridSize: { rows: 6, cols: 6 },
        validLayouts: [],
        feedback: {
            invalidCount: "Un prisma como este necesita 4 rectángulos y 2 cuadrados.",
            invalidShape: "Este patrón no se puede plegar para formar el prisma.",
            correct: "¡Patrón correcto! Se puede formar el prisma."
        }
    }
];

// Separate match challenges
const g5MatchNetsChallenges: NetsOf3DShapesChallenge[] = [
    // Match challenges
    {
        type: 'match',
        targetShapeId: 'prismaRectangular',
        TargetShapeComponent: InteractivePrism,
        netOptions: [
            { id: 'prism_net_correct', NetVisualComponent: NetPrismaRectSVG, isCorrect: true },
            { id: 'cube_net_distractor', NetVisualComponent: NetCuboSVG, isCorrect: false },
            { id: 'pyramid_net_distractor', NetVisualComponent: NetPiramideCuadrSVG, isCorrect: false },
        ]
    },
     {
        type: 'match',
        targetShapeId: 'cubo',
        TargetShapeComponent: InteractiveCube,
        netOptions: [
            { id: 'cube_net_correct_2', NetVisualComponent: NetCuboSVG, isCorrect: true },
            { id: 'prism_net_distractor_for_cube', NetVisualComponent: NetPrismaRectSVG, isCorrect: false },
            { id: 'pyramid_net_distractor_for_cube', NetVisualComponent: NetPiramideCuadrSVG, isCorrect: false },
        ]
    },
    {
        type: 'match',
        targetShapeId: 'piramideCuadrangular',
        TargetShapeComponent: InteractivePyramid,
        netOptions: [
            { id: 'pyramid_net_correct_2', NetVisualComponent: NetPiramideCuadrSVG, isCorrect: true },
            { id: 'cube_net_distractor_for_pyramid', NetVisualComponent: NetCuboSVG, isCorrect: false },
            { id: 'prism_net_distractor_for_pyramid', NetVisualComponent: NetPrismaRectSVG, isCorrect: false },
        ]
    },
    {
        type: 'match',
        targetShapeId: 'cilindro',
        TargetShapeComponent: CilindroSVG,
        netOptions: [
            { id: 'cylinder_net_correct', NetVisualComponent: NetCilindroSVG, isCorrect: true },
            { id: 'cone_net_distractor_for_cylinder', NetVisualComponent: NetConoSVG, isCorrect: false },
            { id: 'cube_net_distractor_for_cylinder', NetVisualComponent: NetCuboSVG, isCorrect: false },
        ]
    },
    {
        type: 'match',
        targetShapeId: 'cono',
        TargetShapeComponent: ConoSVG,
        netOptions: [
            { id: 'cone_net_correct_2', NetVisualComponent: NetConoSVG, isCorrect: true },
            { id: 'cylinder_net_distractor_for_cone', NetVisualComponent: NetCilindroSVG, isCorrect: false },
            { id: 'pyramid_net_distractor_for_cone', NetVisualComponent: NetPiramideCuadrSVG, isCorrect: false },
        ]
    }
];

// Coordinate Plane Navigator challenges
const coordinatePlaneChallenges = [
  {
    id: 'coord-challenge-1',
    type: 'plot',
    prompt: 'Ubica el punto (5,2) en el plano de coordenadas.',
    x: 5,
    y: 2,
    hints: {
      initial: 'Recuerda: el primer número es la coordenada X (horizontal) y el segundo es la Y (vertical).',
      afterAttempt: 'Para ubicar (5,2), mueve 5 unidades a la derecha y 2 unidades hacia arriba desde el origen.'
    }
  },
  {
    id: 'coord-challenge-2',
    type: 'identify',
    prompt: '¿Cuáles son las coordenadas del tesoro marcado en el mapa?',
    x: 4,
    y: 6,
    hints: {
      initial: 'Las coordenadas se escriben como (x,y), donde x es la distancia horizontal y y es la vertical.',
      afterAttempt: 'Cuenta primero cuántas unidades está a la derecha (eje X), luego cuántas unidades está hacia arriba (eje Y).'
    }
  },
  {
    id: 'coord-challenge-3',
    type: 'plot',
    prompt: 'Ubica el punto (7,3) en el plano de coordenadas.',
    x: 7,
    y: 3,
    hints: {
      afterAttempt: 'Para ubicar (7,3), mueve 7 unidades a la derecha y 3 unidades hacia arriba desde el origen.'
    }
  },
  {
    id: 'coord-challenge-4',
    type: 'identify',
    prompt: '¿Cuáles son las coordenadas del tesoro marcado en el mapa?',
    x: 2,
    y: 8,
    hints: {
      afterAttempt: 'El tesoro está 2 unidades a la derecha y 8 unidades hacia arriba.'
    }
  },
  {
    id: 'coord-challenge-5',
    type: 'plot',
    prompt: 'Ubica el punto (3,7) en el plano de coordenadas.',
    x: 3,
    y: 7
  },
  {
    id: 'coord-challenge-6',
    type: 'identify',
    prompt: '¿Cuáles son las coordenadas del tesoro marcado en el mapa?',
    x: 8,
    y: 4
  }
];

export const fifthGradeGeometriaExercises: Exercise[] = [
  {
    id: 'g5-s5-e1',
    title: 'Desafío de Clasificación de Polígonos',
    description: 'Clasifica polígonos como regular/irregular o cóncavo/convexo.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.POLYGON_SORTING_CHALLENGE_G5,
    data: {
      totalStars: 6,
      challenges: polygonSortingChallenges
    },
    question: 'Arrastra el polígono a la caja correcta.'
  },
  {
    id: 'g5-s5-e2',
    title: 'Laboratorio de Figuras',
    description: 'Investiga las propiedades de triángulos y cuadriláteros.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.TRIANGLE_QUAD_EXPLORER_G5,
    data: {
        totalStars: 10,
        challenges: triangleAndQuadChallenges,
        quadrilateralDefinitions, // Pass definitions for rendering options
    },
    question: 'Completa la misión del laboratorio:',
  },
  {
    id: 'g5-s5-e3',
    title: 'Arquitecto Espacial: Contador 3D',
    description: 'Cuenta las caras, aristas y vértices de cuerpos geométricos.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.SHAPE_3D_COUNTER_G5,
    data: {
      totalStars: 9, // 3 challenges * 3 counts each
      challenges: shape3DCountingChallenges,
    },
    question: 'Haz clic para contar los elementos de la figura:'
  },
  {
    id: 'g5-s5-e4',
    title: 'Constructor de Redes 3D',
    description: 'Construye las redes que forman cuerpos geométricos.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.NETS_OF_3D_SHAPES_G5,
    data: {
      totalStars: 4,
      challenges: g5ConstructionNetsChallenges
    },
    question: '¿Puedes construir la red correcta?',
  },
  {
    id: 'g5-s5-e5',
    title: 'Identificador de Redes 3D',
    description: 'Identifica las redes que forman cuerpos geométricos.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.NETS_OF_3D_SHAPES_G5,
    data: {
      totalStars: 6,
      challenges: g5MatchNetsChallenges
    },
    question: '¿Qué red forma esta figura 3D?',
  },
  {
    id: 'g5-s5-e6',
    title: 'Navegador del Plano Cartesiano',
    description: 'Localiza y ubica puntos en el primer cuadrante del plano cartesiano.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.COORDINATE_PLANE_NAVIGATOR_G5,
    data: {
      totalStars: 6,
      challenges: coordinatePlaneChallenges
    },
    question: 'Encuentra el tesoro en el mapa de coordenadas:',
  }
];
