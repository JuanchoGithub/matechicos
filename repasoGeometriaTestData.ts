import React from 'react';
import { RepasoChallenge } from './types'; 
import { 
    RectaHorizontalSVG, CurvaSimpleSVG, PoligonalAbiertaSVG1, PoligonalCerradaSVG1,
    ParalelasHorizontalesSVG, SecantesDiagonalesSVG, PerpendicularesHvSVG,
    AnguloRectoSVG, AnguloAgudoSVG, AnguloObtusoSVG,
    TrianguloEquilateroSVG, TrianguloIsoscelesSVG, TrianguloEscalenoSVG,
    CuadradoSVG, RectanguloSVG, RomboSVG, TrapecioIsoscelesSVG,
    PentagonoRegularSVG, HexagonoRegularSVG,
    PrismaRectangularSVG, PiramideCuadrangularSVG, EsferaSVG, ConoSVG, CilindroSVG,
    circlePartsDefinitions 
} from './geometryDefinitions'; 
import {
    LINE_TYPE_LABELS, RECTAS_PAIR_TYPE_LABELS, ANGLE_TYPE_LABELS,
    TRIANGLE_SIDE_TYPE_LABELS, QUADRILATERAL_TYPE_LABELS, POLYGON_BASIC_TYPE_LABELS,
    GEOMETRIC_BODY_TYPE_LABELS
} from './types';


// New SVGs for specific parts of the circle if needed for clarity in the test
export const RadioDestacadoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className, strokeColor = "red" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: className || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("circle", { cx: "50", cy: "50", r: "40", stroke: "black", fill: "rgba(173,216,230,0.2)", strokeWidth: "2" }),
    React.createElement("line", { x1: "50", y1: "50", x2: "90", y2: "50", stroke: strokeColor, strokeWidth: "3.5" }),
    React.createElement("circle", { cx: "50", cy: "50", r: "3", fill: "black" })
  );

export const CentroDestacadoSVG: React.FC<{ className?: string; pointColor?: string }> = ({ className, pointColor = "red" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: className || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("circle", { cx: "50", cy: "50", r: "40", stroke: "black", fill: "rgba(173,216,230,0.2)", strokeWidth: "2" }),
    React.createElement("circle", { cx: "50", cy: "50", r: "5", fill: pointColor })
  );


export const repasoGeometriaChallengesData: RepasoChallenge[] = [
  {
    id: 'repaso_linea_recta',
    VisualComponent: RectaHorizontalSVG,
    visualProps: { className: "w-32 h-16" },
    correctAnswerLabel: LINE_TYPE_LABELS.recta,
    category: 'Tipo de Línea',
    correctAnswerId: 'recta',
  },
  {
    id: 'repaso_paralelas',
    VisualComponent: ParalelasHorizontalesSVG,
    visualProps: { className: "w-32 h-20" },
    correctAnswerLabel: RECTAS_PAIR_TYPE_LABELS.paralelas,
    category: 'Pares de Rectas',
    correctAnswerId: 'paralelas',
  },
  {
    id: 'repaso_radio',
    VisualComponent: RadioDestacadoSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "blue" },
    correctAnswerLabel: circlePartsDefinitions.find(p => p.id === 'radio')?.name || 'Radio',
    category: 'Partes del Círculo',
    correctAnswerId: 'radio',
  },
  {
    id: 'repaso_angulo_agudo',
    VisualComponent: AnguloAgudoSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "green" },
    correctAnswerLabel: ANGLE_TYPE_LABELS.agudo,
    category: 'Tipos de Ángulos',
    correctAnswerId: 'agudo',
  },
  {
    id: 'repaso_triangulo_equilatero',
    VisualComponent: TrianguloEquilateroSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "purple", tickColor: "darkpurple" },
    correctAnswerLabel: TRIANGLE_SIDE_TYPE_LABELS.equilatero,
    category: 'Tipos de Triángulos',
    correctAnswerId: 'equilatero',
  },
  {
    id: 'repaso_cuadrado',
    VisualComponent: CuadradoSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "orange", fillColor: "rgba(255,165,0,0.2)" },
    correctAnswerLabel: QUADRILATERAL_TYPE_LABELS.cuadrado,
    category: 'Cuadriláteros',
    correctAnswerId: 'cuadrado',
  },
  {
    id: 'repaso_pentagono',
    VisualComponent: PentagonoRegularSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "teal", fillColor: "rgba(0,128,128,0.2)" },
    correctAnswerLabel: POLYGON_BASIC_TYPE_LABELS.pentagono,
    category: 'Polígonos Básicos',
    correctAnswerId: 'pentagono',
  },
  {
    id: 'repaso_esfera',
    VisualComponent: EsferaSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "navy", fillColor: "rgba(0,0,128,0.2)" },
    correctAnswerLabel: GEOMETRIC_BODY_TYPE_LABELS.esfera,
    category: 'Cuerpos Geométricos',
    correctAnswerId: 'esfera',
  },
  {
    id: 'repaso_linea_curva',
    VisualComponent: CurvaSimpleSVG,
    visualProps: { className: "w-32 h-16" },
    correctAnswerLabel: LINE_TYPE_LABELS.curva,
    category: 'Tipo de Línea',
    correctAnswerId: 'curva',
  },
  {
    id: 'repaso_perpendiculares',
    VisualComponent: PerpendicularesHvSVG,
    visualProps: { className: "w-28 h-28" },
    correctAnswerLabel: RECTAS_PAIR_TYPE_LABELS.perpendiculares,
    category: 'Pares de Rectas',
    correctAnswerId: 'perpendiculares',
  },
  {
    id: 'repaso_centro_circulo',
    VisualComponent: CentroDestacadoSVG,
    visualProps: { className: "w-28 h-28", pointColor: "magenta" },
    correctAnswerLabel: circlePartsDefinitions.find(p => p.id === 'centro')?.name || 'Centro',
    category: 'Partes del Círculo',
    correctAnswerId: 'centro',
  },
  {
    id: 'repaso_cilindro',
    VisualComponent: CilindroSVG,
    visualProps: { className: "w-28 h-28", strokeColor: "brown", fillColor: "rgba(165,42,42,0.2)" },
    correctAnswerLabel: GEOMETRIC_BODY_TYPE_LABELS.cilindro,
    category: 'Cuerpos Geométricos',
    correctAnswerId: 'cilindro',
  }
];