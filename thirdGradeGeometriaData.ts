
import { Exercise, ExerciseComponentType, IconName, QuadrilateralTypeId, PolygonBasicTypeId, GeometricBodyTypeId, LINE_TYPE_LABELS, RECTAS_PAIR_TYPE_LABELS, ANGLE_TYPE_LABELS, TRIANGLE_SIDE_TYPE_LABELS, QUADRILATERAL_TYPE_LABELS, POLYGON_BASIC_TYPE_LABELS, GEOMETRIC_BODY_TYPE_LABELS, GenericVisualOption, GenericVisualChallenge, RepasoChallenge } from './types';
import {
  lineChallenges as originalLineChallenges,
  linePairChallenges as originalLinePairChallenges,
  circlePartsDefinitions,
  angleDefinitions,
  triangleSideDefinitions,
  quadrilateralDefinitions,
  polygonBasicDefinitions,
  perimeterShapeDefinitions, 
  symmetryChallengeDefinitions,
  geometricBodyDefinitions, 
  ALL_GEO_LABELS_POOL, // Import the pool
} from './geometryDefinitions';
import { repasoGeometriaChallengesData } from './repasoGeometriaTestData';


// --- Data transformations for generic component ---

// Helper function to shuffle an array (if not already available globally)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const transformedLineChallenges: GenericVisualChallenge[] = originalLineChallenges.map(challenge => ({
  id: challenge.id,
  VisualComponent: challenge.LineVisualComponent,
  visualProps: { className: "max-w-full max-h-full" },
  correctAnswerId: challenge.correctType,
  options: challenge.options.map(typeId => ({ id: typeId, label: LINE_TYPE_LABELS[typeId] })),
  description: `Una línea ${LINE_TYPE_LABELS[challenge.correctType].toLowerCase()}.`
}));

const transformedLinePairChallenges: GenericVisualChallenge[] = originalLinePairChallenges.map(challenge => ({
  id: challenge.id,
  VisualComponent: challenge.ImageComponent,
  visualProps: { className: "max-w-full max-h-full" },
  correctAnswerId: challenge.correctType,
  options: challenge.options.map(typeId => ({ id: typeId, label: RECTAS_PAIR_TYPE_LABELS[typeId] })),
  description: `Un par de rectas ${RECTAS_PAIR_TYPE_LABELS[challenge.correctType].toLowerCase()}.`
}));

const transformedAngleChallenges: GenericVisualChallenge[] = angleDefinitions.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(59 130 246)" },
  correctAnswerId: def.id,
  options: (Object.keys(ANGLE_TYPE_LABELS) as Array<keyof typeof ANGLE_TYPE_LABELS>).map(typeId => ({ id: typeId, label: ANGLE_TYPE_LABELS[typeId] })),
  description: `${def.name} (${def.degreesDisplay}).`
}));

const transformedTriangleSideChallenges: GenericVisualChallenge[] = triangleSideDefinitions.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(79 70 229)", tickColor: "rgba(50,50,50,0.8)" },
  correctAnswerId: def.id,
  options: (Object.keys(TRIANGLE_SIDE_TYPE_LABELS) as Array<keyof typeof TRIANGLE_SIDE_TYPE_LABELS>).map(typeId => ({ id: typeId, label: TRIANGLE_SIDE_TYPE_LABELS[typeId] })),
  description: def.characteristic
}));

const transformedQuadrilateralChallenges = (quadDefs: typeof quadrilateralDefinitions, optionOrder: QuadrilateralTypeId[]): GenericVisualChallenge[] => quadDefs.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(8 145 178)" },
  correctAnswerId: def.id,
  options: optionOrder.map(typeId => ({ id: typeId, label: QUADRILATERAL_TYPE_LABELS[typeId] })),
  description: def.characteristic
}));

const transformedPolygonBasicChallenges = (polyDefs: typeof polygonBasicDefinitions, optionOrder: PolygonBasicTypeId[]): GenericVisualChallenge[] => polyDefs.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(234 88 12)" },
  correctAnswerId: def.id,
  options: optionOrder.map(typeId => ({ id: typeId, label: POLYGON_BASIC_TYPE_LABELS[typeId] })),
  description: def.sidesDescription
}));

const transformedGeometricBodyChallenges = (bodyDefs: typeof geometricBodyDefinitions, optionOrder: GeometricBodyTypeId[]): GenericVisualChallenge[] => bodyDefs.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: { className: "max-w-full max-h-full", strokeColor: "rgb(15 23 42)", fillColor: "rgba(71, 85, 105, 0.2)", fillOpacity: 0.2 },
  correctAnswerId: def.id,
  options: optionOrder.map(typeId => ({ id: typeId, label: GEOMETRIC_BODY_TYPE_LABELS[typeId] })),
  description: def.characteristic
}));

const transformedSymmetryChallenges: GenericVisualChallenge[] = symmetryChallengeDefinitions.map(def => ({
  id: def.id,
  VisualComponent: def.VisualComponent,
  visualProps: {className: "max-w-full max-h-full", shapeStroke: "black", shapeFill: "rgba(128,0,128,0.1)", axisStroke: "rgb(220, 38, 38)", axisStyle: "dashed"},
  correctAnswerId: def.isSymmetricalAboutAxis.toString(), // 'true' or 'false'
  options: [
    { id: 'true', label: 'Sí, es un eje de simetría' },
    { id: 'false', label: 'No, no es un eje de simetría' }
  ],
  description: def.name
}));


// --- Transformation for RepasoGeometria ---
const transformedRepasoChallenges: GenericVisualChallenge[] = repasoGeometriaChallengesData.map((rc: RepasoChallenge) => {
  const correctOption: GenericVisualOption = { id: rc.correctAnswerId as string, label: rc.correctAnswerLabel };
  
  const distractorPool = ALL_GEO_LABELS_POOL.filter(label => label !== rc.correctAnswerLabel);
  const shuffledDistractorLabels = shuffleArray(distractorPool);
  
  // Aim for 3-4 options total (1 correct + 2-3 distractors)
  const numDistractors = Math.min(3, shuffledDistractorLabels.length); 
  const distractorOptions: GenericVisualOption[] = shuffledDistractorLabels.slice(0, numDistractors).map(label => ({
    id: label, // Use label as ID for distractors if no canonical ID map is readily available
    label: label
  }));
  
  const options = shuffleArray([correctOption, ...distractorOptions]);

  return {
    id: rc.id,
    VisualComponent: rc.VisualComponent,
    visualProps: rc.visualProps || { className: "max-w-full max-h-full" }, // Ensure visualProps exists
    correctAnswerId: rc.correctAnswerId as string,
    options: options,
    description: rc.category, 
    emoji: undefined, // RepasoChallenge doesn't have emoji, default will be used by generic component
  };
});


// --- Specific exercises for Third Grade - Geometria (s5) ---
export const thirdGradeGeometriaExercises: Exercise[] = [
    {
      id: 'g3-s5-e1',
      title: 'Tipos de líneas',
      description: 'Identifica si la línea es recta, curva, poligonal abierta o poligonal cerrada.',
      iconName: 'GeometryIcon',
      isLocked: false,
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
      question: 'Observa el dibujo. ¿Qué tipo de línea es?',
      data: {
        totalStars: 8,
        questionPrompt: 'Observa el dibujo. ¿Qué tipo de línea es?',
        challenges: transformedLineChallenges,
      },
      content: 'Clasifica diferentes tipos de líneas según su forma.'
    },
    {
      id: 'g3-s5-e2',
      title: 'Rectas paralelas, secantes y perpendiculares.',
      description: 'Clasifica pares de rectas según su relación.',
      iconName: 'GeometryIcon',
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
      question: 'Observa el par de rectas. ¿Cómo se clasifican?',
      data: {
        totalStars: originalLinePairChallenges.length > 0 ? originalLinePairChallenges.length : 7,
        questionPrompt: 'Observa el par de rectas. ¿Cómo se clasifican?',
        challenges: transformedLinePairChallenges, 
      },
      content: 'Identifica si dos rectas son paralelas, secantes o perpendiculares.'
    },
    { 
      id: 'g3-s5-e3', 
      title: 'Partes de la circunferencia y el círculo.', 
      description: 'Conoce los elementos del círculo.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_PARTES_CIRCULO,
      data: {
        totalStars: 7, 
        parts: circlePartsDefinitions, 
      },
      question: '¿Qué parte es? / Identifica la parte', 
      content: 'Aprende a identificar el centro, radio, diámetro, cuerda, arco, circunferencia y círculo.'
    },
    { 
      id: 'g3-s5-e4', 
      title: 'Clases de ángulos', 
      description: 'Recto, agudo, obtuso, llano, completo.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
      question: 'Observa el ángulo. ¿Qué tipo de ángulo es?',
      data: {
        totalStars: 10,
        questionPrompt: 'Observa el ángulo. ¿Qué tipo de ángulo es?',
        challenges: transformedAngleChallenges, 
      },
      content: 'Identifica y clasifica diferentes tipos de ángulos.'
    },
    { 
      id: 'g3-s5-e5', 
      title: 'Clases de triángulos por sus lados', 
      description: 'Equilátero, isósceles, escaleno.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
      question: 'Observa el triángulo. Según sus lados, ¿qué tipo de triángulo es?',
      data: {
        totalStars: 9,
        questionPrompt: 'Observa el triángulo. Según sus lados, ¿qué tipo de triángulo es?',
        challenges: transformedTriangleSideChallenges, 
      },
      content: 'Identifica si un triángulo es equilátero, isósceles o escaleno.'
    },
    { 
      id: 'g3-s5-e6', 
      title: 'Identificar cuadriláteros (Todos)', 
      description: 'Cuadrado, rectángulo, rombo, romboide, trapecio, trapezoide.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
      question: 'Observa la figura. ¿Qué tipo de cuadrilátero es?',
      data: {
        totalStars: 12,
        questionPrompt: 'Observa la figura. ¿Qué tipo de cuadrilátero es?',
        challenges: transformedQuadrilateralChallenges(quadrilateralDefinitions, ['cuadrado', 'rectangulo', 'rombo', 'romboide', 'trapecio', 'trapezoide']),
      },
      content: 'Aprende a reconocer diferentes tipos de cuadriláteros.'
    },
    { 
      id: 'g3-s5-e7', 
      title: 'Cuadriláteros: Cuadrado, Rectángulo, Rombo, Trapecio', 
      description: 'Identifica el cuadrado, rectángulo, rombo y trapecio.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
      question: 'Observa la figura. ¿Qué tipo de cuadrilátero es de los presentados?',
      data: {
        totalStars: 8, 
        questionPrompt: 'Observa la figura. ¿Qué tipo de cuadrilátero es de los presentados?',
        challenges: transformedQuadrilateralChallenges(
            quadrilateralDefinitions.filter(def => ['cuadrado', 'rectangulo', 'rombo', 'trapecio'].includes(def.id)),
            ['cuadrado', 'rectangulo', 'rombo', 'trapecio']
        ),
      },
      content: 'Aprende a reconocer el cuadrado, rectángulo, rombo y trapecio.'
    },
    { 
      id: 'g3-s5-e8', 
      title: 'Polígonos básicos', 
      description: 'Triángulo, cuadrilátero, pentágono, hexágono.', 
      iconName: 'GeometryIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, 
      question: 'Observa la figura. ¿Qué tipo de polígono es?',
      data: {
        totalStars: 8,
        questionPrompt: 'Observa la figura. ¿Qué tipo de polígono es?',
        challenges: transformedPolygonBasicChallenges(polygonBasicDefinitions, ['triangulo', 'cuadrilatero', 'pentagono', 'hexagono']),
      },
      content: 'Identifica polígonos básicos por su número de lados.'
    },
    { 
      id: 'g3-s5-e9', 
      title: 'Calcular perímetros', 
      description: 'Calcula el perímetro de triángulos y cuadriláteros simples.', 
      iconName: 'MeasureIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.CALCULAR_PERIMETRO_POLIGONO_SIMPLE,
      data: {
        totalStars: 10, 
        shapes: perimeterShapeDefinitions,
        minSideLength: 1,
        maxSideLength: 20,
      },
      question: '¿Qué figura es esta?', 
      content: 'Suma las longitudes de todos los lados de la figura para hallar su perímetro.'
    },
    { 
      id: 'g3-s5-e10', 
      title: '¿Es simétrico?', 
      description: 'Identifica si una línea es un eje de simetría para una figura.', 
      iconName: 'GeometryIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
      question: '¿Es esta línea un eje de simetría para la figura?',
      data: {
        totalStars: symmetryChallengeDefinitions.length > 0 ? symmetryChallengeDefinitions.length : 10,
        questionPrompt: '¿Es esta línea un eje de simetría para la figura?',
        challenges: transformedSymmetryChallenges,
      },
      content: 'Decide si la línea roja divide la figura en dos mitades especulares.'
    },
    { 
      id: 'g3-s5-e11', 
      title: 'Cuerpos geométricos', 
      description: 'Prisma, pirámide, esfera, cono y cilindro.', 
      iconName: 'GeometryIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO,
      question: 'Observa el cuerpo geométrico. ¿Cuál es su nombre?',
      data: {
        totalStars: 10,
        questionPrompt: 'Observa el cuerpo geométrico. ¿Cuál es su nombre?',
        challenges: transformedGeometricBodyChallenges(geometricBodyDefinitions, ['prismaRectangular', 'piramideCuadrangular', 'esfera', 'cono', 'cilindro']),
      },
      content: 'Identifica los principales cuerpos geométricos.'
    },
    { 
      id: 'g3-s5-e12', 
      title: 'Test final del tema', 
      description: 'Repasa todos los conceptos de geometría aprendidos.', 
      iconName: 'BookOpenIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO, // CHANGED
      data: {
        totalStars: repasoGeometriaChallengesData.length > 0 ? repasoGeometriaChallengesData.length : 12,
        questionPrompt: "Demuestra lo que aprendiste: ¿Qué es esto?",
        challenges: transformedRepasoChallenges, // Use transformed data
      },
      question: 'Demuestra lo que aprendiste: ¿Qué es esto?', // Kept for consistency if generic uses it
      content: 'Identifica la figura o concepto geométrico mostrado.'
    },
];
