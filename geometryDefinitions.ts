
import React from 'react';
import { LineType, RectasPairType, CirclePartDefinition, AngleTypeId, AngleDefinition, ANGLE_TYPE_LABELS, TriangleSideTypeId, TriangleSideDefinition, TRIANGLE_SIDE_TYPE_LABELS, QuadrilateralTypeId, QuadrilateralDefinition, QUADRILATERAL_TYPE_LABELS, PolygonBasicTypeId, PolygonBasicDefinition, POLYGON_BASIC_TYPE_LABELS, PerimeterShapeTypeId, PerimeterShapeDefinition, PERIMETER_SHAPE_TYPE_LABELS, SymmetryChallengeDefinition, GeometricBodyTypeId, GeometricBodyDefinition, GEOMETRIC_BODY_TYPE_LABELS, LINE_TYPE_LABELS, RECTAS_PAIR_TYPE_LABELS, BasicShapeTypeId, BasicShapeDefinition, BASIC_SHAPE_LABELS } from './types';

// --- START Geometria (s5) - Line Visual Components (Tipos de Líneas) ---
export const RectaHorizontalSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 50",
    className: `w-40 h-20 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("line", { x1: "10", y1: "25", x2: "90", y2: "25", strokeWidth: "3", stroke: "black" })
  );

export const RectaVerticalSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 50 100",
    className: `w-24 h-32 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("line", { x1: "25", y1: "10", x2: "25", y2: "90", strokeWidth: "3", stroke: "black" })
  );

export const CurvaSimpleSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 50",
    className: `w-40 h-20 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("path", { d: "M10,40 C30,10 70,10 90,40", strokeWidth: "3", fill: "none", stroke: "black" })
  );

export const CurvaOnduladaSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 50",
    className: `w-40 h-20 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("path", { d: "M10,25 C25,10 35,40 50,25 S75,10 90,25", strokeWidth: "3", fill: "none", stroke: "black" })
  );

export const PoligonalAbiertaSVG1: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 60",
    className: `w-40 h-24 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polyline", { points: "10,50 30,10 50,50 70,10 90,50", strokeWidth: "3", fill: "none", stroke: "black" })
  );

export const PoligonalAbiertaSVG2: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 60",
    className: `w-40 h-24 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polyline", { points: "10,10 40,50 60,10 90,50", strokeWidth: "3", fill: "none", stroke: "black" })
  );

export const PoligonalCerradaSVG1: React.FC<{className?: string; strokeColor?: string; fillColor?: string}> = ({ className: additionalClasses = "", strokeColor = "black", fillColor = "rgba(221,160,221,0.3)" }) => // Light purple fill
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: `w-32 h-32 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,10 90,40 70,90 30,90 10,40", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const PoligonalCerradaSVG2: React.FC<{className?: string; strokeColor?: string; fillColor?: string}> = ({ className: additionalClasses = "", strokeColor = "black", fillColor = "rgba(221,160,221,0.3)" }) => // Light purple fill
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: `w-32 h-32 ${additionalClasses}`.trim(),
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "20,20 80,20 80,80 20,80", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const CurvaCerradaSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255,192,203,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("ellipse", { cx: "50", cy: "50", rx: "40", ry: "30", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const Circulo2DSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(173, 216, 230, 0.4)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("circle", { cx: "50", cy: "50", r: "40", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

// --- END Line Visual Components ---

// --- START Geometria (s5) - Line Pair Visual Components (Paralelas, Secantes, Perpendiculares) ---
export const ParalelasHorizontalesSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 60", className: `w-40 h-24 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "20", x2: "90", y2: "20", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "10", y1: "40", x2: "90", y2: "40", strokeWidth: "3", stroke: "black" })
  );

export const ParalelasVerticalesSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 60 100", className: `w-24 h-40 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "20", y1: "10", x2: "20", y2: "90", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "40", y1: "10", x2: "40", y2: "90", strokeWidth: "3", stroke: "black" })
  );

export const ParalelasDiagonalesSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: `w-32 h-32 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "30", x2: "70", y2: "90", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "30", y1: "10", x2: "90", y2: "70", strokeWidth: "3", stroke: "black" })
  );

export const PerpendicularesHvSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: `w-32 h-32 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "50", x2: "90", y2: "50", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "50", y1: "10", x2: "50", y2: "90", strokeWidth: "3", stroke: "black" }),
    React.createElement("rect", { x: "47", y: "47", width: "6", height: "6", fill: "none", stroke: "black", strokeWidth: "1" })
  );

export const PerpendicularesCruzSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: `w-32 h-32 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "10", x2: "90", y2: "90", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "10", y1: "90", x2: "90", y2: "10", strokeWidth: "3", stroke: "black" }),
    React.createElement("rect", { x: "47", y: "47", width: "6", height: "6", fill: "none", stroke: "black", strokeWidth: "1", transform:"rotate(45 50 50)"})
  );
  
export const SecantesDiagonalesSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: `w-32 h-32 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "20", x2: "90", y2: "80", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "10", y1: "80", x2: "90", y2: "20", strokeWidth: "3", stroke: "black" })
  );

export const SecantesUnaHorizontalSVG: React.FC<{className?: string}> = ({ className: additionalClasses = "" }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: `w-32 h-32 ${additionalClasses}`.trim(), xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("line", { x1: "10", y1: "50", x2: "90", y2: "50", strokeWidth: "3", stroke: "black" }),
    React.createElement("line", { x1: "20", y1: "10", x2: "80", y2: "90", strokeWidth: "3", stroke: "black" })
  );
// --- END Line Pair Visual Components ---

// --- START Line Challenges Data ---
export const lineChallenges: { id: string; LineVisualComponent: React.FC<{ className?: string }>; correctType: LineType; options: LineType[] }[] = [
  { id: 'linea_recta_h', LineVisualComponent: RectaHorizontalSVG, correctType: 'recta', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_curva_s', LineVisualComponent: CurvaSimpleSVG, correctType: 'curva', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_pa_1', LineVisualComponent: PoligonalAbiertaSVG1, correctType: 'poligonal_abierta', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_pc_1', LineVisualComponent: PoligonalCerradaSVG1, correctType: 'poligonal_cerrada', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_recta_v', LineVisualComponent: RectaVerticalSVG, correctType: 'recta', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_curva_o', LineVisualComponent: CurvaOnduladaSVG, correctType: 'curva', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_pa_2', LineVisualComponent: PoligonalAbiertaSVG2, correctType: 'poligonal_abierta', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
  { id: 'linea_pc_2', LineVisualComponent: PoligonalCerradaSVG2, correctType: 'poligonal_cerrada', options: ['recta', 'curva', 'poligonal_abierta', 'poligonal_cerrada'] },
];

export const linePairChallenges: { id: string; ImageComponent: React.FC<{ className?: string }>; correctType: RectasPairType; options: RectasPairType[] }[] = [
  { id: 'paralelas_h', ImageComponent: ParalelasHorizontalesSVG, correctType: 'paralelas', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'perpendiculares_hv', ImageComponent: PerpendicularesHvSVG, correctType: 'perpendiculares', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'secantes_diag_cruz', ImageComponent: SecantesDiagonalesSVG, correctType: 'secantes', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'paralelas_v', ImageComponent: ParalelasVerticalesSVG, correctType: 'paralelas', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'perpendiculares_cruz_diag', ImageComponent: PerpendicularesCruzSVG, correctType: 'perpendiculares', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'secantes_h_diag', ImageComponent: SecantesUnaHorizontalSVG, correctType: 'secantes', options: ['paralelas', 'secantes', 'perpendiculares'] },
  { id: 'paralelas_diag', ImageComponent: ParalelasDiagonalesSVG, correctType: 'paralelas', options: ['paralelas', 'secantes', 'perpendiculares'] },
];
// --- END Line Challenges Data ---

// --- START Circle Parts Definitions ---
export const circlePartsDefinitions: CirclePartDefinition[] = [
  { id: 'centro', name: 'Centro', definition: 'Punto interior equidistante de todos los puntos de la circunferencia.' },
  { id: 'radio', name: 'Radio', definition: 'Segmento que une el centro con un punto cualquiera de la circunferencia.' },
  { id: 'diametro', name: 'Diámetro', definition: 'Segmento que une dos puntos de la circunferencia pasando por el centro. Es la cuerda de mayor longitud.' },
  { id: 'cuerda', name: 'Cuerda', definition: 'Segmento que une dos puntos cualesquiera de la circunferencia.' },
  { id: 'arco', name: 'Arco', definition: 'Porción de la circunferencia comprendida entre dos puntos.' },
  { id: 'circunferencia', name: 'Circunferencia', definition: 'Línea curva cerrada cuyos puntos equidistan de otro situado en el mismo plano que se llama centro.' },
  { id: 'circulo', name: 'Círculo', definition: 'Superficie plana limitada por una circunferencia.' },
];
// --- END Circle Parts Definitions ---

// --- START Angle Visual Components & Definitions ---
export const AnguloRectoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className: propClassName, strokeColor = "black" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: propClassName || "w-24 h-24",
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polyline", { points: "10,90 10,10 90,10", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("rect", { x: "10", y: "10", width: "12", height: "12", stroke: strokeColor, strokeWidth: "2", fill: "rgba(0,0,0,0.1)" }),
    React.createElement("path", { d: "M 25,10 A 15,15 0 0,0 10,25", stroke: "rgba(100,100,255,0.6)", strokeWidth: "2", fill: "none" })
  );

export const AnguloAgudoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className: propClassName, strokeColor = "black" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: propClassName || "w-24 h-24",
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polyline", { points: "10,90 10,10 70,50", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("path", { d: "M 10,25 A 15,15 0 0,0 22.5,18.3", stroke: "rgba(100,100,255,0.6)", strokeWidth: "2", fill: "none" }) 
  );

export const AnguloObtusoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className: propClassName, strokeColor = "black" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: propClassName || "w-24 h-24",
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polyline", { points: "10,90 10,10 90,50", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("path", { d: "M 10,25 A 15,15 0 0,0 23.4,16.7", stroke: "rgba(100,100,255,0.6)", strokeWidth: "2", fill: "none" }) 
  );

export const AnguloLlanoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className: propClassName, strokeColor = "black" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 50",
    className: propClassName || "w-32 h-16",
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("line", { x1: "5", y1: "25", x2: "95", y2: "25", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("circle", { cx: "50", cy: "25", r: "4", fill: strokeColor, stroke: "none" }),
    React.createElement("path", { d: "M 35,25 A 15,15 0 0,1 65,25", stroke: "rgba(100,100,255,0.6)", strokeWidth: "2", fill: "none" })
  );

export const AnguloCompletoSVG: React.FC<{ className?: string; strokeColor?: string }> = ({ className: propClassName, strokeColor = "black" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: propClassName || "w-24 h-24",
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("circle", { cx: "50", cy: "50", r: "30", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("line", { x1: "50", y1: "50", x2: "80", y2: "50", stroke: strokeColor, fill: "none", strokeWidth: "3" }),
    React.createElement("circle", { cx: "50", cy: "50", r: "4", fill: strokeColor, stroke: "none" }),
    React.createElement("circle", { cx: "50", cy: "50", r: "15", stroke: "rgba(100,100,255,0.6)", strokeWidth: "2", fill: "none", strokeDasharray: "3 3" })
  );

export const angleDefinitions: AngleDefinition[] = [
  { id: 'recto', name: ANGLE_TYPE_LABELS.recto, degreesDisplay: '90°', VisualComponent: AnguloRectoSVG },
  { id: 'agudo', name: ANGLE_TYPE_LABELS.agudo, degreesDisplay: '< 90°', VisualComponent: AnguloAgudoSVG },
  { id: 'obtuso', name: ANGLE_TYPE_LABELS.obtuso, degreesDisplay: '> 90° y < 180°', VisualComponent: AnguloObtusoSVG },
  { id: 'llano', name: ANGLE_TYPE_LABELS.llano, degreesDisplay: '180°', VisualComponent: AnguloLlanoSVG },
  { id: 'completo', name: ANGLE_TYPE_LABELS.completo, degreesDisplay: '360°', VisualComponent: AnguloCompletoSVG },
];
// --- END Angle Visual Components & Definitions ---

// --- START Triangle (by sides) Visual Components & Definitions ---
export const TrianguloEquilateroSVG: React.FC<{ className?: string; strokeColor?: string; tickColor?: string; fillColor?:string }> = ({ className: propClassName, strokeColor = "black", tickColor = "rgba(0,0,0,0.7)", fillColor = "rgba(135,220,135,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,15 15,85 85,85", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    React.createElement("line", { x1: "32.5", y1: "50", x2: "37.5", y2: "50", stroke: tickColor, strokeWidth: "2", transform: "rotate(-60 35 50)" }),
    React.createElement("line", { x1: "62.5", y1: "50", x2: "67.5", y2: "50", stroke: tickColor, strokeWidth: "2", transform: "rotate(60 65 50)" }),
    React.createElement("line", { x1: "47.5", y1: "85", x2: "52.5", y2: "85", stroke: tickColor, strokeWidth: "2" })
  );

export const TrianguloIsoscelesSVG: React.FC<{ className?: string; strokeColor?: string; tickColor?: string; fillColor?:string }> = ({ className: propClassName, strokeColor = "black", tickColor = "rgba(0,0,0,0.7)", fillColor = "rgba(135,206,235,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,10 20,90 80,90", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    React.createElement("line", { x1: "35", y1: "50", x2: "40", y2: "50", stroke: tickColor, strokeWidth: "2", transform: "rotate(-71.57 37.5 50)" }),
    React.createElement("line", { x1: "60", y1: "50", x2: "65", y2: "50", stroke: tickColor, strokeWidth: "2", transform: "rotate(71.57 62.5 50)" }),
    React.createElement("line", { x1: "45", y1: "90", x2: "50", y2: "90", stroke: tickColor, strokeWidth: "2" }),
    React.createElement("line", { x1: "50", y1: "90", x2: "55", y2: "90", stroke: tickColor, strokeWidth: "2", transform: "translate(2.5,0)" })
  );

export const TrianguloEscalenoSVG: React.FC<{ className?: string; strokeColor?: string; tickColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", tickColor = "rgba(0,0,0,0.7)", fillColor = "rgba(255,160,122,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,15 10,80 90,60", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    React.createElement("line", { x1: "30", y1: "47.5", x2: "35", y2: "47.5", stroke: tickColor, strokeWidth: "2", transform: "rotate(-58 32.5 47.5)" }), 
    React.createElement("line", { x1: "70", y1: "37.5", x2: "75", y2: "37.5", stroke: tickColor, strokeWidth: "2", transform: "rotate(26.57 72.5 37.5)" }),
    React.createElement("line", { x1: "70", y1: "37.5", x2: "75", y2: "37.5", stroke: tickColor, strokeWidth: "2", transform: "rotate(26.57 72.5 37.5) translate(2.5, 0)" }), 
    React.createElement("line", { x1: "50", y1: "70", x2: "55", y2: "70", stroke: tickColor, strokeWidth: "2" }), 
    React.createElement("line", { x1: "50", y1: "70", x2: "55", y2: "70", stroke: tickColor, strokeWidth: "2", transform: "translate(2.5, 0)" }),
    React.createElement("line", { x1: "50", y1: "70", x2: "55", y2: "70", stroke: tickColor, strokeWidth: "2", transform: "translate(5, 0)" }) 
  );

export const triangleSideDefinitions: TriangleSideDefinition[] = [
  { id: 'equilatero', name: TRIANGLE_SIDE_TYPE_LABELS.equilatero, characteristic: 'Todos sus lados son iguales.', VisualComponent: TrianguloEquilateroSVG },
  { id: 'isosceles', name: TRIANGLE_SIDE_TYPE_LABELS.isosceles, characteristic: 'Tiene dos lados iguales y uno desigual.', VisualComponent: TrianguloIsoscelesSVG },
  { id: 'escaleno', name: TRIANGLE_SIDE_TYPE_LABELS.escaleno, characteristic: 'Todos sus lados son desiguales.', VisualComponent: TrianguloEscalenoSVG },
];
// --- END Triangle (by sides) Visual Components & Definitions ---

// --- START Quadrilateral Visual Components & Definitions ---
export const CuadradoSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255,215,0,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("rect", { x: "20", y: "20", width: "60", height: "60", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const RectanguloSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(173,216,230,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 60", // Adjusted viewBox for typical rectangle aspect
    className: propClassName || "w-32 h-20", 
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("rect", { x: "10", y: "10", width: "80", height: "40", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const RomboSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(221,160,221,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,10 90,50 50,90 10,50", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const RomboideSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(144,238,144,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 70", // Adjusted viewBox for typical romboide aspect
    className: propClassName || "w-28 h-20", 
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "25,15 85,15 75,55 15,55", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }) // Points for a parallelogram (romboide)
  );

export const TrapecioIsoscelesSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255,182,193,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 70", // Adjusted for typical trapecio aspect
    className: propClassName || "w-28 h-20", 
    xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "25,15 75,15 90,55 10,55", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const TrapezoideSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(240,230,140,0.3)" }) =>
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "20,20 80,30 70,80 10,60", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const quadrilateralDefinitions: QuadrilateralDefinition[] = [
  { id: 'cuadrado', name: QUADRILATERAL_TYPE_LABELS.cuadrado, characteristic: '4 lados iguales y 4 ángulos rectos.', VisualComponent: CuadradoSVG },
  { id: 'rectangulo', name: QUADRILATERAL_TYPE_LABELS.rectangulo, characteristic: 'Lados iguales dos a dos y 4 ángulos rectos.', VisualComponent: RectanguloSVG },
  { id: 'rombo', name: QUADRILATERAL_TYPE_LABELS.rombo, characteristic: '4 lados iguales. Ángulos iguales dos a dos (no rectos).', VisualComponent: RomboSVG },
  { id: 'romboide', name: QUADRILATERAL_TYPE_LABELS.romboide, characteristic: 'Lados y ángulos opuestos iguales. No tiene ángulos rectos.', VisualComponent: RomboideSVG },
  { id: 'trapecio', name: QUADRILATERAL_TYPE_LABELS.trapecio, characteristic: 'Solo un par de lados paralelos.', VisualComponent: TrapecioIsoscelesSVG },
  { id: 'trapezoide', name: QUADRILATERAL_TYPE_LABELS.trapezoide, characteristic: 'Ningún lado paralelo a otro.', VisualComponent: TrapezoideSVG },
];
// --- END Quadrilateral Visual Components & Definitions ---

// --- START Basic Polygon Visual Components & Definitions (for g3-s5-e8) ---
export const TrianguloGenericoSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(173, 216, 230, 0.4)" }) => // Light blue fill
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { points: "50,15 15,85 85,85", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const CuadrilateroGenericoSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(144, 238, 144, 0.4)" }) => // Light green fill
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("rect", { x: "20", y: "20", width: "60", height: "60", stroke: strokeColor, fill: fillColor, strokeWidth: "3" })
  );

export const PentagonoRegularSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255, 228, 181, 0.5)" }) => // Light orange/peach fill
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { 
      points: "50,10 90,40 75,85 25,85 10,40", 
      stroke: strokeColor, fill: fillColor, strokeWidth: "3" 
    })
  );

export const HexagonoRegularSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }> = ({ className: propClassName, strokeColor = "black", fillColor = "rgba(221, 160, 221, 0.4)" }) => // Light purple/pink fill
  React.createElement("svg", {
    viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg"
  },
    React.createElement("polygon", { 
      points: "50,10 85,30 85,70 50,90 15,70 15,30", 
      stroke: strokeColor, fill: fillColor, strokeWidth: "3" 
    })
  );

export const polygonBasicDefinitions: PolygonBasicDefinition[] = [
  { id: 'triangulo', name: POLYGON_BASIC_TYPE_LABELS.triangulo, sidesDescription: '3 lados.', VisualComponent: TrianguloGenericoSVG },
  { id: 'cuadrilatero', name: POLYGON_BASIC_TYPE_LABELS.cuadrilatero, sidesDescription: '4 lados.', VisualComponent: CuadrilateroGenericoSVG },
  { id: 'pentagono', name: POLYGON_BASIC_TYPE_LABELS.pentagono, sidesDescription: '5 lados.', VisualComponent: PentagonoRegularSVG },
  { id: 'hexagono', name: POLYGON_BASIC_TYPE_LABELS.hexagono, sidesDescription: '6 lados.', VisualComponent: HexagonoRegularSVG },
];

// Basic Shape Definitions for 1st Grade (using existing or new simple SVGs)
export const basicShapeDefinitions: BasicShapeDefinition[] = [
  { id: 'circulo', name: BASIC_SHAPE_LABELS.circulo, description: 'Figura redonda sin lados ni esquinas.', VisualComponent: Circulo2DSVG },
  { id: 'cuadrado', name: BASIC_SHAPE_LABELS.cuadrado, description: 'Tiene 4 lados iguales y 4 esquinas rectas.', VisualComponent: CuadradoSVG },
  { id: 'triangulo', name: BASIC_SHAPE_LABELS.triangulo, description: 'Tiene 3 lados y 3 esquinas.', VisualComponent: TrianguloEquilateroSVG }, // Using Equilatero as a generic triangle for recognition
  { id: 'rectangulo', name: BASIC_SHAPE_LABELS.rectangulo, description: 'Tiene 4 lados, los opuestos son iguales, y 4 esquinas rectas.', VisualComponent: RectanguloSVG },
];
// --- END Basic Polygon Visual Components & Definitions ---

// --- START Perimeter Calculation Shape Visual Components & Definitions ---

const SideLabel: React.FC<{ x: number; y: number; length: number; angle?: number; textAnchor?: string }> = ({ x, y, length, angle = 0, textAnchor = "middle" }) => {
  return React.createElement("text", {
    x, y,
    transform: `rotate(${angle} ${x} ${y})`,
    fontSize: "10", // Standardized font size
    fill: "rgb(50,50,50)",
    textAnchor: textAnchor,
    dominantBaseline: "middle"
  }, length);
};

export const TrianguloEquilateroConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(135,220,135,0.3)", sideLengths, showLabels = true }) => {
  const l = sideLengths[0] || 0; 
  const h = (Math.sqrt(3) / 2) * 70; 
  const points = `50,${50 - h / 1.5} 15,${50 + h / 3} 85,${50 + h / 3}`;
  return React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("polygon", { points, stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 50, y: (50 + h / 3) + 10, length: l }), 
    showLabels && React.createElement(SideLabel, { x: 25, y: (50 - h/1.5 + 50 + h/3)/2 + 5, length: l, angle: -60, textAnchor: "end" }),
    showLabels && React.createElement(SideLabel, { x: 75, y: (50 - h/1.5 + 50 + h/3)/2 + 5, length: l, angle: 60, textAnchor: "start" })
  );
};

export const CuadradoConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255,215,0,0.3)", sideLengths, showLabels = true }) => {
  const l = sideLengths[0] || 0; 
  return React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("rect", { x: "20", y: "20", width: "60", height: "60", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 50, y: 12, length: l }), 
    showLabels && React.createElement(SideLabel, { x: 50, y: 88, length: l }), 
    showLabels && React.createElement(SideLabel, { x: 12, y: 50, length: l, angle: -90 }), 
    showLabels && React.createElement(SideLabel, { x: 88, y: 50, length: l, angle: 90 })
  );
};

export const RectanguloConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(173,216,230,0.3)", sideLengths, showLabels = true }) => {
  const base = sideLengths[0] || 0;
  const altura = sideLengths[1] || 0;
  return React.createElement("svg", { viewBox: "0 0 100 60", className: propClassName || "w-32 h-20", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("rect", { x: "10", y: "10", width: "80", height: "40", stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 50, y: 5, length: base }), 
    showLabels && React.createElement(SideLabel, { x: 50, y: 55, length: base }), 
    showLabels && React.createElement(SideLabel, { x: 5, y: 30, length: altura, angle: -90 }), 
    showLabels && React.createElement(SideLabel, { x: 95, y: 30, length: altura, angle: 90 })
  );
};

export const TrianguloIsoscelesConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(135,206,235,0.3)", sideLengths, showLabels = true }) => {
  const base = sideLengths[0] || 0; 
  const ladoIgual = sideLengths[1] || 0; 
  const points = "50,10 20,90 80,90";
  return React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("polygon", { points, stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 50, y: 98, length: base }), 
    showLabels && React.createElement(SideLabel, { x: 25, y: 50, length: ladoIgual, angle: -71.57, textAnchor: "end" }), 
    showLabels && React.createElement(SideLabel, { x: 75, y: 50, length: ladoIgual, angle: 71.57, textAnchor: "start" })
  );
};

export const TrianguloEscalenoConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255,160,122,0.3)", sideLengths, showLabels = true }) => {
  const l1 = sideLengths[0] || 0; 
  const l2 = sideLengths[1] || 0; 
  const l3 = sideLengths[2] || 0; 
  const points = "50,15 10,80 90,60";
  return React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("polygon", { points, stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 20, y: 40, length: l1, angle: -58, textAnchor: "end" }), 
    showLabels && React.createElement(SideLabel, { x: 78, y: 30, length: l2, angle: 26.57, textAnchor: "start" }), 
    showLabels && React.createElement(SideLabel, { x: 50, y: 80, length: l3 })
  );
};

export const RomboConLadosSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }> =
 ({ className: propClassName, strokeColor = "black", fillColor = "rgba(221,160,221,0.3)", sideLengths, showLabels = true }) => {
  const l = sideLengths[0] || 0; 
  const points = "50,10 90,50 50,90 10,50";
  return React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-24 h-24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("polygon", { points, stroke: strokeColor, fill: fillColor, strokeWidth: "3" }),
    showLabels && React.createElement(SideLabel, { x: 77, y: 23, length: l, angle: 45, textAnchor: "start" }), 
    showLabels && React.createElement(SideLabel, { x: 77, y: 77, length: l, angle: -45, textAnchor: "start" }), 
    showLabels && React.createElement(SideLabel, { x: 23, y: 77, length: l, angle: 45, textAnchor: "end" }), 
    showLabels && React.createElement(SideLabel, { x: 23, y: 23, length: l, angle: -45, textAnchor: "end" })
  );
};

const getRandomSide = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const perimeterShapeDefinitions: PerimeterShapeDefinition[] = [
  {
    id: 'trianguloEquilatero', name: PERIMETER_SHAPE_TYPE_LABELS.trianguloEquilatero, VisualComponent: TrianguloEquilateroConLadosSVG,
    getPerimeter: (sides) => sides[0] * 3,
    generateSideLengths: (min, max) => { const s = getRandomSide(min, max); return [s, s, s]; },
    formulaDescription: "Lado + Lado + Lado (o Lado × 3)"
  },
  {
    id: 'cuadrado', name: PERIMETER_SHAPE_TYPE_LABELS.cuadrado, VisualComponent: CuadradoConLadosSVG,
    getPerimeter: (sides) => sides[0] * 4,
    generateSideLengths: (min, max) => { const s = getRandomSide(min, max); return [s, s, s, s]; },
    formulaDescription: "Lado + Lado + Lado + Lado (o Lado × 4)"
  },
  {
    id: 'rectangulo', name: PERIMETER_SHAPE_TYPE_LABELS.rectangulo, VisualComponent: RectanguloConLadosSVG,
    getPerimeter: (sides) => (sides[0] + sides[1]) * 2,
    generateSideLengths: (min, max) => {
      let base = getRandomSide(min, max);
      let altura = getRandomSide(min, max);
      if (altura > base && max > min) { // Ensure base is generally >= altura for typical visual, only swap if not forced to be square (max > min)
        [base, altura] = [altura, base];
      }
      return [base, altura, base, altura]; 
    },
    formulaDescription: "Base + Altura + Base + Altura (o 2 × Base + 2 × Altura)"
  },
  {
    id: 'trianguloIsosceles', name: PERIMETER_SHAPE_TYPE_LABELS.trianguloIsosceles, VisualComponent: TrianguloIsoscelesConLadosSVG,
    getPerimeter: (sides) => sides[0] + sides[1] * 2,
    generateSideLengths: (min, max) => { const s1 = getRandomSide(min, max); let s2; do { s2 = getRandomSide(min, max); } while (s1 === s2 && max > min); return [s1, s2, s2]; },
    formulaDescription: "Lado Base + Lado Igual + Lado Igual"
  },
  {
    id: 'trianguloEscaleno', name: PERIMETER_SHAPE_TYPE_LABELS.trianguloEscaleno, VisualComponent: TrianguloEscalenoConLadosSVG,
    getPerimeter: (sides) => sides.reduce((a, b) => a + b, 0),
    generateSideLengths: (min, max) => { 
        let s1, s2, s3;
        do {
            s1 = getRandomSide(min, max);
            s2 = getRandomSide(min, max);
            s3 = getRandomSide(min, max);
        } while (!(s1 + s2 > s3 && s1 + s3 > s2 && s2 + s3 > s1 && s1 !== s2 && s1 !== s3 && s2 !== s3) && (max-min > 2)); 
        if(max-min <=2) { 
             do { s1 = getRandomSide(min,max); s2 = getRandomSide(min,max); s3 = getRandomSide(min,max); } while(!(s1 + s2 > s3 && s1 + s3 > s2 && s2 + s3 > s1));
        }
        return [s1, s2, s3];
    },
    formulaDescription: "Lado 1 + Lado 2 + Lado 3"
  },
  {
    id: 'rombo', name: PERIMETER_SHAPE_TYPE_LABELS.rombo, VisualComponent: RomboConLadosSVG,
    getPerimeter: (sides) => sides[0] * 4,
    generateSideLengths: (min, max) => { const s = getRandomSide(min, max); return [s, s, s, s]; },
    formulaDescription: "Lado + Lado + Lado + Lado (o Lado × 4)"
  },
];
// --- END Perimeter Calculation Shape Visual Components & Definitions ---

// --- START Symmetry Challenge Visual Components & Definitions ---
const ShapeWithAxis: React.FC<{
  shapeElement: React.ReactNode;
  axisElement: React.ReactNode;
  className?: string;
}> = ({ shapeElement, axisElement, className }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: className || "w-32 h-32", xmlns: "http://www.w3.org/2000/svg" },
    shapeElement,
    axisElement
  );

export const CuadradoConEjeHorizontalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> = 
  ({ className, shapeStroke = "black", shapeFill = "rgba(255,215,0,0.2)", axisStroke = "red", axisStyle = "dashed" }) => 
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("rect", { x: "20", y: "20", width: "60", height: "60", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "5", y1: "50", x2: "95", y2: "50", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const CuadradoConEjeDiagonalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> = 
  ({ className, shapeStroke = "black", shapeFill = "rgba(255,215,0,0.2)", axisStroke = "red", axisStyle = "dashed" }) => 
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("rect", { x: "20", y: "20", width: "60", height: "60", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "5", y1: "5", x2: "95", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const RectanguloConEjeVerticalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(173,216,230,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("rect", { x: "15", y: "30", width: "70", height: "40", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "50", y1: "5", x2: "50", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const RectanguloConEjeDiagonalIncorrectoSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(173,216,230,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("rect", { x: "15", y: "30", width: "70", height: "40", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "5", y1: "5", x2: "95", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const TrianguloIsoscelesConEjeAlturaSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(135,206,235,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("polygon", { points: "50,10 20,90 80,90", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "50", y1: "5", x2: "50", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });
  
export const CirculoConEjeDiametralSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(255,192,203,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("circle", { cx: "50", cy: "50", r: "40", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "5", y1: "50", x2: "95", y2: "50", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const CorazonConEjeVerticalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(255,99,71,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("path", { d: "M50,30 Q20,10 20,40 Q20,70 50,90 Q80,70 80,40 Q80,10 50,30 Z", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "50", y1: "5", x2: "50", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });
  
export const LetraAConEjeVerticalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(128,0,128,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("path", { d: "M50,10 L20,90 L30,90 L45,30 L55,30 L70,90 L80,90 Z M35,60 L65,60", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "50", y1: "5", x2: "50", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const RomboConEjeVerticalSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(221,160,221,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("polygon", { points: "50,10 90,50 50,90 10,50", stroke: shapeStroke, fill: shapeFill, strokeWidth: "2" }),
    axisElement: React.createElement("line", { x1: "50", y1: "5", x2: "50", y2: "95", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });

export const LetraSConEjeIncorrectoSVG: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }> =
  ({ className, shapeStroke = "black", shapeFill = "rgba(0,128,0,0.2)", axisStroke = "red", axisStyle = "dashed" }) =>
  React.createElement(ShapeWithAxis, { className,
    shapeElement: React.createElement("path", { d: "M80,20 Q60,20 50,40 T20,60 Q40,60 50,80 T80,100", stroke: shapeStroke, fill: "none", strokeWidth: "5" }), // Thicker "S"
    axisElement: React.createElement("line", { x1: "5", y1: "50", x2: "95", y2: "50", stroke: axisStroke, strokeWidth: "2.5", strokeDasharray: axisStyle === 'dashed' ? "5,5" : undefined })
  });


export const symmetryChallengeDefinitions: SymmetryChallengeDefinition[] = [
  { id: 'cuadrado-horizontal', name: "Cuadrado con eje horizontal", VisualComponent: CuadradoConEjeHorizontalSVG, isSymmetricalAboutAxis: true },
  { id: 'cuadrado-diagonal', name: "Cuadrado con eje diagonal", VisualComponent: CuadradoConEjeDiagonalSVG, isSymmetricalAboutAxis: true },
  { id: 'rectangulo-vertical', name: "Rectángulo con eje vertical", VisualComponent: RectanguloConEjeVerticalSVG, isSymmetricalAboutAxis: true },
  { id: 'rectangulo-diagonal-incorrecto', name: "Rectángulo con eje diagonal", VisualComponent: RectanguloConEjeDiagonalIncorrectoSVG, isSymmetricalAboutAxis: false },
  { id: 'triangulo-isosceles-altura', name: "Triángulo isósceles con eje en altura", VisualComponent: TrianguloIsoscelesConEjeAlturaSVG, isSymmetricalAboutAxis: true },
  { id: 'circulo-diametral', name: "Círculo con eje diametral", VisualComponent: CirculoConEjeDiametralSVG, isSymmetricalAboutAxis: true },
  { id: 'corazon-vertical', name: "Corazón con eje vertical", VisualComponent: CorazonConEjeVerticalSVG, isSymmetricalAboutAxis: true },
  { id: 'letraA-vertical', name: "Letra A con eje vertical", VisualComponent: LetraAConEjeVerticalSVG, isSymmetricalAboutAxis: true },
  { id: 'rombo-vertical', name: "Rombo con eje vertical", VisualComponent: RomboConEjeVerticalSVG, isSymmetricalAboutAxis: true },
  { id: 'letraS-incorrecto', name: "Letra S con eje horizontal", VisualComponent: LetraSConEjeIncorrectoSVG, isSymmetricalAboutAxis: false },
];
// --- END Symmetry Challenge Visual Components & Definitions ---

// --- START Geometric Body Visual Components & Definitions (3D Shapes) ---
export const PrismaRectangularSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string, fillOpacity?: number }> =
  ({ className: propClassName, strokeColor = "black", fillColor = "rgba(0, 128, 255, 0.3)", fillOpacity = 0.3 }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-28 h-28", xmlns: "http://www.w3.org/2000/svg" },
    // Visible faces
    React.createElement("polygon", { points: "20,45 70,45 85,30 35,30", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }), // Top Face
    React.createElement("polygon", { points: "70,45 70,85 85,70 85,30", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }), // Right Side Face
    React.createElement("polygon", { points: "20,45 70,45 70,85 20,85", stroke: strokeColor, fill: `rgba(0, 128, 255, ${Number(fillOpacity) + 0.2})`, strokeWidth: "2" }), // Front Face (slightly more opaque)
    // Hidden lines (drawn after visible faces or rely on fillOpacity)
    React.createElement("line", { x1:"20", y1:"85", x2:"35", y2:"70", stroke: strokeColor, strokeWidth:"1.5", strokeDasharray:"3,3"}), // front-bottom-left to back-bottom-left
    React.createElement("line", { x1:"35", y1:"70", x2:"85", y2:"70", stroke: strokeColor, strokeWidth:"1.5", strokeDasharray:"3,3"}), // back-bottom-left to back-bottom-right
    React.createElement("line", { x1:"35", y1:"30", x2:"35", y2:"70", stroke: strokeColor, strokeWidth:"1.5", strokeDasharray:"3,3"})  // back-top-left to back-bottom-left
  );

export const PiramideCuadrangularSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string, fillOpacity?: number }> =
  ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255, 165, 0, 0.3)", fillOpacity = 0.3 }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-28 h-28", xmlns: "http://www.w3.org/2000/svg" },
    // Base (parallelogram for perspective)
    React.createElement("polygon", { points: "20,80 50,90 80,80 50,70", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    // Visible faces (triangles)
    React.createElement("polygon", { points: "50,10 20,80 50,70", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    React.createElement("polygon", { points: "50,10 80,80 50,70", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    // Visible edges to apex
    React.createElement("line", { x1: "50", y1: "10", x2: "20", y2: "80", stroke: strokeColor, strokeWidth: "2" }),
    React.createElement("line", { x1: "50", y1: "10", x2: "80", y2: "80", stroke: strokeColor, strokeWidth: "2" }),
    // Hidden edges of base
    React.createElement("line", { x1: "20", y1: "80", x2: "50", y2: "90", stroke: strokeColor, strokeWidth: "1.5", strokeDasharray: "3,3" }),
    React.createElement("line", { x1: "80", y1: "80", x2: "50", y2: "90", stroke: strokeColor, strokeWidth: "1.5", strokeDasharray: "3,3" }),
     // Hidden edge to apex from back base vertex (visual guide)
    React.createElement("line", { x1: "50", y1: "10", x2: "50", y2: "90", stroke: strokeColor, strokeWidth: "1", strokeDasharray: "2,2", opacity: "0.5" })
  );

export const EsferaSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string, fillOpacity?: number }> =
  ({ className: propClassName, strokeColor = "black", fillColor = "rgba(255, 0, 0, 0.3)", fillOpacity = 0.3 }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-28 h-28", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("circle", { cx: "50", cy: "50", r: "40", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    React.createElement("ellipse", { cx: "50", cy: "50", rx: "15", ry: "40", stroke: strokeColor, fill: "none", strokeWidth: "1", strokeDasharray:"2,2", opacity:"0.6" , transform:"rotate(-20 50 50)"})
  );

export const ConoSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string, fillOpacity?: number }> =
  ({ className: propClassName, strokeColor = "black", fillColor = "rgba(0, 255, 0, 0.3)", fillOpacity = 0.3 }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-28 h-28", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("ellipse", { cx: "50", cy: "80", rx: "40", ry: "15", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    React.createElement("line", { x1: "10", y1: "80", x2: "50", y2: "10", stroke: strokeColor, strokeWidth: "2" }),
    React.createElement("line", { x1: "90", y1: "80", x2: "50", y2: "10", stroke: strokeColor, strokeWidth: "2" }),
    React.createElement("path", { d: "M10,80 A 40,15 0 0,0 90,80", stroke: strokeColor, fill:"none", strokeWidth: "1.5", strokeDasharray:"3,3" }) // Hidden back part of ellipse
  );

export const CilindroSVG: React.FC<{ className?: string; strokeColor?: string; fillColor?: string, fillOpacity?: number }> =
  ({ className: propClassName, strokeColor = "black", fillColor = "rgba(128, 0, 128, 0.3)", fillOpacity = 0.3 }) =>
  React.createElement("svg", { viewBox: "0 0 100 100", className: propClassName || "w-28 h-28", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("ellipse", { cx: "50", cy: "20", rx: "30", ry: "10", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    React.createElement("ellipse", { cx: "50", cy: "80", rx: "30", ry: "10", stroke: strokeColor, fill: fillColor, strokeWidth: "2", style: { fillOpacity } }),
    React.createElement("line", { x1: "20", y1: "20", x2: "20", y2: "80", stroke: strokeColor, strokeWidth: "2" }),
    React.createElement("line", { x1: "80", y1: "20", x2: "80", y2: "80", stroke: strokeColor, strokeWidth: "2" }),
    React.createElement("path", { d: "M20,80 A 30,10 0 0,0 80,80", stroke: strokeColor, fill:"none", strokeWidth: "1.5", strokeDasharray:"3,3" }) // Hidden back part of bottom ellipse
  );

export const geometricBodyDefinitions: GeometricBodyDefinition[] = [
  { id: 'prismaRectangular', name: GEOMETRIC_BODY_TYPE_LABELS.prismaRectangular, characteristic: 'Tiene 6 caras rectangulares, 12 aristas y 8 vértices.', VisualComponent: PrismaRectangularSVG },
  { id: 'piramideCuadrangular', name: GEOMETRIC_BODY_TYPE_LABELS.piramideCuadrangular, characteristic: 'Base cuadrada y 4 caras triangulares que se unen en un vértice.', VisualComponent: PiramideCuadrangularSVG },
  { id: 'esfera', name: GEOMETRIC_BODY_TYPE_LABELS.esfera, characteristic: 'Superficie curva donde todos los puntos están a igual distancia del centro.', VisualComponent: EsferaSVG },
  { id: 'cono', name: GEOMETRIC_BODY_TYPE_LABELS.cono, characteristic: 'Base circular y una superficie curva que se une en un vértice.', VisualComponent: ConoSVG },
  { id: 'cilindro', name: GEOMETRIC_BODY_TYPE_LABELS.cilindro, characteristic: 'Dos bases circulares iguales y una superficie curva lateral.', VisualComponent: CilindroSVG },
];
// --- END Geometric Body Visual Components & Definitions ---

// Helper function to shuffle an array (used for distractors)
// const shuffleArray = <T,>(array: T[]): T[] => { // Already defined above
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };

// Pool of all geometry labels for generating distractors
export const ALL_GEO_LABELS_POOL = ((): string[] => {
  const labels = new Set<string>();
  (Object.values(LINE_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  (Object.values(RECTAS_PAIR_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  circlePartsDefinitions.forEach(part => labels.add(part.name));
  (Object.values(ANGLE_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  (Object.values(TRIANGLE_SIDE_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  (Object.values(QUADRILATERAL_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  (Object.values(POLYGON_BASIC_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  (Object.values(GEOMETRIC_BODY_TYPE_LABELS) as string[]).forEach(label => labels.add(label));
  return Array.from(labels);
})();