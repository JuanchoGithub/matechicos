import { Exercise, ExerciseComponentType, OriginalIconName, TriangleQuadExplorerChallenge, QuadrilateralTypeId, QUADRILATERAL_TYPE_LABELS, Shape3DCounterChallengeG5, NetsOf3DShapesChallenge, NetConstructionPieceType } from './types';
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

const g5NetsChallenges: NetsOf3DShapesChallenge[] = [
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
    },
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
    title: 'Constructor de Figuras 3D',
    description: 'Construye o identifica las redes que forman cuerpos geométricos.',
    iconName: 'GeometryIcon',
    isLocked: false,
    componentType: ExerciseComponentType.NETS_OF_3D_SHAPES_G5,
    data: {
      totalStars: 10,
      challenges: g5NetsChallenges
    },
    question: '¿Puedes construir o identificar la red correcta?',
  }
];
