

import React from 'react';
import { OriginalIconName as ImportedOriginalIconName } from './components/icons'; // Corrected import, aliased to avoid conflict

// IconName combines OriginalIconName with other specific icons, effectively covering all icons.
export type IconName = ImportedOriginalIconName | 'HomeIcon' | 'StarIcon' | 'GiftIcon' | 'CharacterQuestionIcon' | 'BackspaceIcon' | 'SpeechBubbleIcon' | 'CharacterPlaceholderIcon' | 'CheckIcon' | 'HeartIcon' | 'BrokenHeartIcon' | 'PencilIcon' | 'EraserIcon' | 'ClearIcon'; // Added new drawing icons

// Export OriginalIconName directly for use in other files if needed
export type OriginalIconName = ImportedOriginalIconName;

export type HeartStatus = 'filled' | 'empty' | 'losing';


export enum PageView {
  MAIN = 'main',
  GRADE = 'grade',
  EXERCISE = 'exercise',
  AVATAR = 'avatar',
}

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export enum SubjectId {
  NUMEROS = 'numeros',
  OPERACIONES = 'operaciones',
  MEDIDAS = 'medidas',
  GEOMETRIA = 'geometria',
  ESTADISTICA = 'estadistica',
  PROBABILIDAD = 'probabilidad',
  PROBLEMAS = 'problemas',
}

export type ComparisonSymbol = '<' | '=' | '>';

export enum ExerciseComponentType {
  GENERIC = 'generic',
  ESCRIBIR_HASTA_10000 = 'escribir_hasta_10000',
  CALCULA_MENTALMENTE = 'calcula_mentalmente', 
  LEER_FRACCIONES_PROPIAS = 'leer_fracciones_propias',
  COMPARAR_HASTA_10000 = 'comparar_hasta_10000',
  COMPONER_HASTA_10000_ABACO = 'componer_hasta_10000_abaco',
  COMPONER_HASTA_10000_TEXTO = 'componer_hasta_10000_texto',
  APROXIMAR_NUMERO = 'aproximar_numero', 
  IDENTIFICAR_ORDINALES = 'identificar_ordinales', 
  ARITMETICA_SIMPLE_2_CIFRAS = 'aritmetica_simple_2_cifras', 
  REPRESENTAR_FRACCIONES = 'representar_fracciones',
  ESCRIBIR_FRACCIONES_PROPIAS = 'escribir_fracciones_propias',
  SUMAS_LLEVANDO_3_SUMANDOS = 'sumas_llevando_3_sumandos', 
  RESTAS_LLEVANDO_3_DIGITOS = 'restas_llevando_3_digitos', 
  COLUMNAR_OPERATION = 'columnar_operation', 
  MULTIPLICACION_COLUMNAS = 'multiplicacion_columnas',
  DIVISION_SIMPLE = 'division_simple',
  DIVISION_LARGA = 'division_larga',
  PROBLEMAS_PASO_A_PASO = 'problemas_paso_a_paso', 
  CONVERTIR_METROS_A_CM = 'convertir_metros_a_cm', 
  IDENTIFICAR_UNIDAD_LONGITUD = 'identificar_unidad_longitud', 
  IDENTIFICAR_UNIDAD_MASA = 'identificar_unidad_masa', 
  IDENTIFICAR_UNIDAD_CAPACIDAD = 'identificar_unidad_capacidad', 
  IDENTIFICAR_UNIDAD_MEDIDA_GENERICO = 'identificar_unidad_medida_generico', 
  PROBLEMAS_CAPACIDAD_SUMA_RESTA = 'problemas_capacidad_suma_resta',
  PROBLEMAS_CAPACIDAD_CONVERSION_SUMA = 'problemas_capacidad_conversion_suma', 
  SUMAR_CAPACIDAD_CONVERSION_ML = 'sumar_capacidad_conversion_ml', 
  LEER_RELOJ_OPCIONES = 'leer_reloj_opciones', 
  CONVERTIR_SUMAR_CAPACIDAD_ML = 'convertir_sumar_capacidad_ml', 
  COMPARAR_MONEDAS_CON_PESO = 'comparar_monedas_con_peso', 
  SUMAR_MONEDAS_PESOS_SIMPLES = 'sumar_monedas_pesos_simples', 
  SUMAR_ITEMS_MONETARIOS_SIMPLES = 'sumar_items_monetarios_simples', 
  SUMAR_MONEDAS_PESOS_CENTAVOS = 'sumar_monedas_pesos_centavos', 
  SUMAR_BILLETES_PESOS = 'sumar_billetes_pesos', 
  IDENTIFICAR_TIPOS_DE_LINEAS = 'identificar_tipos_de_lineas', 
  CLASIFICAR_PARES_DE_RECTAS = 'clasificar_pares_de_rectas', 
  IDENTIFICAR_PARTES_CIRCULO = 'identificar_partes_circulo', 
  IDENTIFICAR_TIPOS_ANGULOS = 'identificar_tipos_angulos', 
  IDENTIFICAR_TIPOS_TRIANGULOS_LADOS = 'identificar_tipos_triangulos_lados', 
  IDENTIFICAR_CUADRILATEROS = 'identificar_cuadrilateros', 
  IDENTIFICAR_POLIGONOS_BASICOS = 'identificar_poligonos_basicos', 
  IDENTIFICAR_FORMA_GEOMETRICA_GENERICO = 'identificar_forma_geometrica_generico', 
  CALCULAR_PERIMETRO_POLIGONO_SIMPLE = 'calcular_perimetro_poligono_simple',
  IDENTIFICAR_EJE_SIMETRIA = 'identificar_eje_simetria', 
  IDENTIFICAR_CUERPOS_GEOMETRICOS = 'identificar_cuerpos_geometricos', 
  REPASO_GEOMETRIA_MIXTO = 'repaso_geometria_mixto',
  INTERPRETAR_DIAGRAMA_BARRAS_VERTICAL = 'interpretar_diagrama_barras_vertical',
  INTERPRETAR_DIAGRAMA_BARRAS_HORIZONTAL = 'interpretar_diagrama_barras_horizontal',
  TEST_INTERPRETAR_DIAGRAMAS_BARRAS = 'test_interpretar_diagramas_barras',
  INTERPRETAR_TABLA_SIMPLE = 'interpretar_tabla_simple',
  INTERPRETAR_TABLA_DOBLE_ENTRADA = 'interpretar_tabla_doble_entrada',
  UBICAR_EN_TABLA = 'ubicar_en_tabla',
  COMPLETAR_TABLA_DATOS_FALTANTES = 'completar_tabla_datos_faltantes',
  ORDENAR_DATOS_EN_TABLA = 'ordenar_datos_en_tabla',
  COMPARAR_TABLAS_SIMPLES = 'comparar_tablas_simples',
  INTERPRETAR_DIAGRAMA_LINEAL_SIMPLE = 'interpretar_diagrama_lineal_simple',
  INTERPRETAR_DIAGRAMA_DOS_LINEAS = 'interpretar_diagrama_dos_lineas',
  CERTEZA_SUCESOS = 'certeza_sucesos', 
  COMPARAR_PROBABILIDADES = 'comparar_probabilidades',
  EXPRESAR_PROBABILIDAD_SIMPLE = 'expresar_probabilidad_simple',
  FRECUENCIA_SUCESOS = 'frecuencia_sucesos', 
  INTERPRETAR_PICTOGRAMAS = 'interpretar_pictogramas', // New Type

  // New types for 1st Grade Numeros
  CONTAR_ELEMENTOS = 'contar_elementos',
  IDENTIFICAR_PARES_IMPARES = 'identificar_pares_impares',
  ORDENAR_NUMEROS_SIMPLE = 'ordenar_numeros_simple',
  NUMERO_ANTERIOR_POSTERIOR = 'numero_anterior_posterior',
  VISUAL_ARITHMETIC_1_DIGIT = 'visual_arithmetic_1_digit',

  // New types for 1st Grade Medidas
  COMPARAR_ALTURAS = 'comparar_alturas',
  COMPARAR_LONGITUDES = 'comparar_longitudes',
  MEDIR_CON_REGLA_CM = 'medir_con_regla_cm',
  COMPARAR_PESOS_CONCEPTUAL = 'comparar_pesos_conceptual',
  BALANZA_1KG = 'balanza_1kg',
  COMPARAR_CAPACIDAD_1L = 'comparar_capacidad_1l',
  CALENDARIO_MES_ANT_POST = 'calendario_mes_ant_post',
  COMPLETAR_PALABRA_SIMPLE = 'completar_palabra_simple',
  SECUENCIA_DIA_SEMANA = 'secuencia_dia_semana',
  SECUENCIA_MES_ANIO = 'secuencia_mes_anio',

  // New types for 1st Grade Geometria
  POSICION_RELATIVA_OBJETOS = 'posicion_relativa_objetos',

  // New types for 2nd Grade Numeros (to be defined if needed beyond existing)
  VISUAL_MULTIPLICATION_INTRO = 'visual_multiplication_intro',
  MULTIPLICATION_TABLE_PRACTICE = 'multiplication_table_practice',
  SIMPLE_CHANCE_GAME = 'simple_chance_game', // Added for 2nd Grade Probabilidad
}

export type LineType = 'recta' | 'curva' | 'poligonal_abierta' | 'poligonal_cerrada' | 'poligonal'; // 'poligonal' for 1st grade "quebrada"
export const LINE_TYPE_LABELS: Record<LineType, string> = {
  recta: 'Recta',
  curva: 'Curva',
  poligonal_abierta: 'Poligonal Abierta',
  poligonal_cerrada: 'Poligonal Cerrada',
  poligonal: 'Quebrada / Poligonal', // Simpler term for 1st grade
};

export type RectasPairType = 'paralelas' | 'secantes' | 'perpendiculares';
export const RECTAS_PAIR_TYPE_LABELS: Record<RectasPairType, string> = {
  paralelas: 'Paralelas',
  secantes: 'Secantes',
  perpendiculares: 'Perpendiculares',
};

export type CirclePartId = 'centro' | 'radio' | 'diametro' | 'cuerda' | 'arco' | 'circunferencia' | 'circulo';
export interface CirclePartDefinition {
  id: CirclePartId;
  name: string;
  definition: string;
}

export type AngleTypeId = 'recto' | 'agudo' | 'obtuso' | 'llano' | 'completo';
export const ANGLE_TYPE_LABELS: Record<AngleTypeId, string> = {
  recto: 'Recto',
  agudo: 'Agudo',
  obtuso: 'Obtuso',
  llano: 'Llano',
  completo: 'Completo',
};
export interface AngleDefinition {
  id: AngleTypeId;
  name: string; 
  degreesDisplay: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string }>;
}

export type TriangleSideTypeId = 'equilatero' | 'isosceles' | 'escaleno';
export const TRIANGLE_SIDE_TYPE_LABELS: Record<TriangleSideTypeId, string> = {
  equilatero: 'Equilátero',
  isosceles: 'Isósceles',
  escaleno: 'Escaleno',
};
export interface TriangleSideDefinition {
  id: TriangleSideTypeId;
  name: string; 
  characteristic: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; tickColor?: string }>;
}

export type QuadrilateralTypeId = 'cuadrado' | 'rectangulo' | 'rombo' | 'romboide' | 'trapecio' | 'trapezoide';
export const QUADRILATERAL_TYPE_LABELS: Record<QuadrilateralTypeId, string> = {
  cuadrado: 'Cuadrado',
  rectangulo: 'Rectángulo',
  rombo: 'Rombo',
  romboide: 'Romboide',
  trapecio: 'Trapecio', 
  trapezoide: 'Trapezoide',
};
export interface QuadrilateralDefinition {
  id: QuadrilateralTypeId;
  name: string; 
  characteristic: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}

// For 1st grade, basic shapes are sufficient.
export type BasicShapeTypeId = 'circulo' | 'cuadrado' | 'triangulo' | 'rectangulo';
export const BASIC_SHAPE_LABELS: Record<BasicShapeTypeId, string> = {
  circulo: 'Círculo',
  cuadrado: 'Cuadrado',
  triangulo: 'Triángulo',
  rectangulo: 'Rectángulo',
};
// A simplified definition for basic shapes for IDENTIFICAR_FORMA_GEOMETRICA_GENERICO
export interface BasicShapeDefinition {
  id: BasicShapeTypeId;
  name: string;
  description: string; // e.g., "Tiene 4 lados iguales y 4 esquinas rectas."
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}


export type PolygonBasicTypeId = 'triangulo' | 'cuadrilatero' | 'pentagono' | 'hexagono';
export const POLYGON_BASIC_TYPE_LABELS: Record<PolygonBasicTypeId, string> = {
  triangulo: 'Triángulo',
  cuadrilatero: 'Cuadrilátero',
  pentagono: 'Pentágono',
  hexagono: 'Hexágono',
};
export interface PolygonBasicDefinition {
  id: PolygonBasicTypeId;
  name: string; 
  sidesDescription: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}

export type PerimeterShapeTypeId = 'trianguloEquilatero' | 'cuadrado' | 'rectangulo' | 'trianguloIsosceles' | 'trianguloEscaleno' | 'rombo';
export const PERIMETER_SHAPE_TYPE_LABELS: Record<PerimeterShapeTypeId, string> = {
  trianguloEquilatero: 'Triángulo Equilátero',
  cuadrado: 'Cuadrado',
  rectangulo: 'Rectángulo',
  trianguloIsosceles: 'Triángulo Isósceles',
  trianguloEscaleno: 'Triángulo Escaleno',
  rombo: 'Rombo',
};
export interface PerimeterShapeDefinition {
  id: PerimeterShapeTypeId;
  name: string;
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean; }>;
  getPerimeter: (sideLengths: number[]) => number;
  generateSideLengths: (minSide: number, maxSide: number) => number[];
  formulaDescription: string;
}

export interface SymmetryChallengeDefinition {
  id: string; 
  name: string; 
  VisualComponent: React.FC<{ className?: string; shapeStroke?: string; shapeFill?: string; axisStroke?: string; axisStyle?: 'solid' | 'dashed' }>;
  isSymmetricalAboutAxis: boolean;
}

export type GeometricBodyTypeId = 'prismaRectangular' | 'piramideCuadrangular' | 'esfera' | 'cono' | 'cilindro';
export const GEOMETRIC_BODY_TYPE_LABELS: Record<GeometricBodyTypeId, string> = {
  prismaRectangular: 'Prisma Rectangular',
  piramideCuadrangular: 'Pirámide Cuadrangular',
  esfera: 'Esfera',
  cono: 'Cono',
  cilindro: 'Cilindro',
};
export interface GeometricBodyDefinition {
  id: GeometricBodyTypeId;
  name: string;
  characteristic: string;
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; fillOpacity?: number }>;
}

export interface RepasoChallenge {
  id: string; 
  questionText?: string; 
  VisualComponent: React.FC<any>; 
  visualProps?: any; 
  correctAnswerLabel: string; 
  category: string; 
  correctAnswerId: LineType | RectasPairType | CirclePartId | AngleTypeId | TriangleSideTypeId | QuadrilateralTypeId | PolygonBasicTypeId | GeometricBodyTypeId | string; 
}


export interface Exercise {
  id: string;
  title: string;
  description: string;
  iconName: IconName; 
  isLocked: boolean;
  content?: React.ReactNode; 
  componentType?: ExerciseComponentType; 
  question?: string; 
  data?: any; 
}

export interface SubjectData {
  id: SubjectId;
  name: string;
  iconName: OriginalIconName;
  subjectThemeColor: string; 
  exercises: Exercise[];
}

export interface GradeData {
  id: GradeLevel;
  name: string; 
  longName: string; 
  themeColor: string; 
  subjects: SubjectData[];
}

export interface AvatarData {
  iconName: IconName; 
  color: string;
  name?: string; 
}

export interface RouteParams {
  page: PageView;
  gradeId?: GradeLevel;
  subjectId?: SubjectId;
  exerciseId?: string;
}

// --- ExerciseScaffold API ---
export interface ExerciseScaffoldApi {
  onAttempt: (isCorrect: boolean) => void;
  advanceToNextChallengeSignal: number; // Incremented by scaffold to signal exercise to generate next internal challenge
  showFeedback: (feedback: {type: 'correct' | 'incorrect' | 'gameover' | 'congrats', message: string} | null) => void; // Allow exercise to show temp contextual feedback if needed
  // Adding onSetCompleted to the API allows refactored components to signal completion if needed.
  // This is particularly useful if an exercise type manages its own completion logic
  // (e.g., finishing all sub-questions within one "star" attempt, or completing a multi-scenario exercise).
  // The main ExerciseScaffold component will still call its own onSetCompleted prop when all stars are achieved.
  onSetCompleted?: (exerciseId: string) => void; 
}

// --- Statistics Types - Start ---

// For InterpretarTablaSimpleExercise
export interface TableRowData { // Defined for InterpretarTablaSimpleExercise
  name: string;
  value: number;
}

// Generic structure for a question generated by an exercise, used by table exercises
export interface TableQuestion { // Defined for InterpretarTablaSimpleExercise & InterpretarTablaDobleEntradaExercise
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // Index of the correct answer in the options array
}


// For InterpretarTablaSimpleExercise (g3-s6-e5)
export interface TableRowCategoryTemplate {
  name: string; // e.g., "Perro", "Ajedrez"
  valueRange: [number, number]; // Min and max possible value for this category
}

export interface TableQuestionTemplate {
  id: string;
  type: 'findMaxRow' | 'findMinRow' | 'findSpecificValue' | 'compareTwoRows' | 'findTotalColumnValue';
}

export interface TableScenarioTemplate {
  scenarioId: string;
  tableTitle: string;
  columnHeaders: [string, string]; // e.g., ["Animal", "Votos"] or ["Juego", "Puntos"]
  rowCategories: TableRowCategoryTemplate[];
  questionTemplates: TableQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string; // Emoji or icon name
}

// For InterpretarTablaDobleEntradaExercise
export interface TableCellData { // Defined for InterpretarTablaDobleEntradaExercise
  value: number;
}

export type TableDobleEntradaQuestionType =
  | 'findSpecificCellValue'
  | 'findRowTotal'
  | 'findColumnTotal'
  | 'findGrandTotal'
  | 'findCategoryWithMaxInRow' 
  | 'findCategoryWithMinInRow' 
  | 'findCategoryWithMaxForColumn' 
  | 'findCategoryWithMinForColumn' 
  | 'compareTwoCellValues'; 

export interface TableDobleEntradaQuestionCoordinates {
  rowName: string;
  colName: string;
}

export interface TableDobleEntradaQuestionTemplate {
  id: string;
  type: TableDobleEntradaQuestionType;
  targetRowName?: string; 
  targetColName?: string;
  cell1Coords?: TableDobleEntradaQuestionCoordinates;
  cell2Coords?: TableDobleEntradaQuestionCoordinates;
}

export interface TableDobleEntradaCell {
  value: number;
  isMissing?: boolean; // For puzzles where student fills it
}

export interface TableDobleEntradaRow {
  header: string;
  cells: TableDobleEntradaCell[];
  isTotalRow?: boolean; // If this row represents totals
}

export interface TableDobleEntradaScenarioTemplate {
  scenarioId: string;
  tableTitle: string;
  rowHeaders: string[];
  columnHeaders: string[];
  valueAxisLabel: string; // e.g., "Cantidad de Helados", "Puntos"
  cellValueRange: [number, number];
  questionTemplates: TableDobleEntradaQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string;
}

export interface UbicarEnTablaItem extends String {} // Usually emoji strings

export interface UbicarEnTablaScenarioTemplate {
  scenarioId: string;
  tableTitle: string;
  gridSize: { rows: number; cols: number };
  possibleItems: UbicarEnTablaItem[];
  numQuestionsPerScenario: number;
  totalStarsPerScenario: number;
  icon?: string;
}

export type UbicarEnTablaQuestionType = 'what_is_in_cell' | 'where_is_item';


export interface MissingInfoPuzzleCellTemplate {
  display: string; // "?" for missing, or the actual number/text
  isMissingCell?: boolean;
  isTotalCell?: boolean; // If this cell itself is a total cell
}

export interface MissingInfoPuzzleRowTemplate {
  header: string;
  values: MissingInfoPuzzleCellTemplate[];
  isTotalRow?: boolean; // If the entire row is for totals
}

export interface MissingInfoPuzzleScenarioTemplate {
  scenarioId: string;
  title: string;
  rowCategoryHeader: string; 
  dataColumnHeaders: string[]; 
  displayRowTotalsColumn?: boolean; 
  rowData: MissingInfoPuzzleRowTemplate[];
  correctAnswer: number; // The value for the missing cell
  questionText?: string; // Specific question if needed, defaults to generic
  totalStars: number;
  icon?: string;
  valueUnit?: string;
}

export interface OrdenarDatosEnTablaItem {
  name: string;
  value: number;
}
export interface OrdenarDatosEnTablaScenarioTemplate {
  scenarioId: string;
  title: string;
  categoryHeader: string; // e.g., "Jugador", "Animal"
  valueHeader: string;    // e.g., "Puntaje", "Peso (kg)"
  unsortedData: OrdenarDatosEnTablaItem[];
  sortInstructionText: string; // e.g., "Ordena de Mayor a Menor"
  sortBy: 'name' | 'value';
  sortOrder: 'asc' | 'desc';
  numItemsToDisplayInTable: number; // How many items the student needs to correctly place in the table
  totalStarsPerScenario: number;
  icon?: string;
}

export interface SimpleTableDataRow {
  name: string; // Category name
  value: number; // Data value
}
export interface SimpleTableDataForComparison {
  tableId: string;
  title: string;
  categoryHeader: string;
  valueHeader: string;
  rows: SimpleTableDataRow[];
}
export interface CompararTablasSimplesQuestionTemplate {
  id: string;
  type: 'compareCategoryBetweenTables' | 'findDifferenceForCategory' | 'whichTableHasMaxForCategory' | 'whichTableHasMaxOverall' | 'whichTableHasMinOverall';
  targetCategoryName?: string;
  comparisonType?: 'more' | 'less' | 'equal'; // For 'compareCategoryBetweenTables'
}
export interface CompararTablasSimplesScenarioTemplate {
  scenarioId: string;
  description: string; // General description of what's being compared
  tableA: SimpleTableDataForComparison;
  tableB: SimpleTableDataForComparison;
  valueRangeForRandomization: [number, number]; // Range for randomizing values in tables A & B
  questionTemplates: CompararTablasSimplesQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string;
}


export interface LinealChartDataPoint {
  xLabel: string; // e.g., "Lunes", "Enero", "Semana 1"
  yValue: number;
}
export interface LinealChartQuestionTemplate {
  id: string;
  type: 'findSpecificYValue' | 'findMaxYValue' | 'findMinYValue' | 'calculateDifferenceBetweenTwoYValues' | 'describeTrend' | 'findTotalYValue';
  targetXLabel1?: string; // For types needing one X-axis point
  targetXLabel2?: string; // For types needing two X-axis points (e.g., difference, trend)
}
export interface LinealChartScenarioTemplate {
  scenarioId: string;
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataPoints: LinealChartDataPoint[];
  questionTemplates: LinealChartQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string;
  yAxisValueStep?: number; // Optional: control y-axis ticks. If not provided, will be auto-calculated.
}

export interface MultiLineChartDataSeries {
  name: string; // e.g., "Producto A", "Ana"
  points: LinealChartDataPoint[];
  color: string; // Tailwind color class like "blue-500"
}
export interface MultiLineChartQuestionTemplate {
  id: string;
  type: 'findYValueForLineAndX' | 'whichLineHasMaxYAtX' | 'whichLineHasMinYAtX' | 'findDifferenceBetweenLinesAtX' | 'describeOverallTrendForLine' | 'compareOverallTrends';
  targetLineName1?: string; // For questions specific to one line or the first line in comparison
  targetLineName2?: string; // For questions comparing two specific lines (optional)
  targetXLabel?: string;    // For questions about a specific X point
  targetXLabelStart?: string; // For trend questions
  targetXLabelEnd?: string;   // For trend questions
}
export interface MultiLineChartScenarioTemplate {
  scenarioId: string;
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  series: [MultiLineChartDataSeries, MultiLineChartDataSeries]; // Fixed to two series for now
  questionTemplates: MultiLineChartQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string;
  yAxisValueStep?: number;
}


export type CertaintyLevel = 'posible' | 'imposible' | 'seguro';
export interface CertaintyScenario {
  id: string;
  eventText: string;
  correctCertainty: CertaintyLevel;
  emoji?: string;
}

export type FrequencyLevel = 'nunca' | 'a_veces' | 'siempre';
export const FREQUENCY_LEVEL_LABELS: Record<FrequencyLevel, string> = {
  nunca: 'Nunca',
  a_veces: 'A Veces',
  siempre: 'Siempre',
};
export interface FrecuenciaScenario {
  id: string;
  eventText: string;
  correctFrequency: FrequencyLevel;
  emoji?: string;
}


export interface ProbabilityEvent {
  text: string; // e.g., "🔴🔵🔵 (3)" or "Dado: ❶-❻"
  visual: string; // Short visual cue, e.g., "🔴🔵🔵 (3)" or "Dado: ❶-❻"
  favorable: number;
  total: number;
}
export interface ProbabilityComparisonScenario {
  id: string;
  contextText: string; // e.g., "Observa las dos bolsas:"
  eventA: ProbabilityEvent;
  eventB: ProbabilityEvent;
  emoji?: string;
}

export interface ProbabilityOption {
  text: string; // e.g., "1 de 3", "2 de 5"
  isCorrect: boolean;
}
export interface SimpleProbabilityScenario {
  id: string;
  contextText: string; // e.g., "En esta bolsa hay bolitas de colores:"
  visualContext: string; // e.g., "Bolsa: 🔴🔵🔵 (3 bolitas)"
  eventToEvaluate: string; // e.g., "Sacar una bolita ROJA."
  options: ProbabilityOption[];
  emoji?: string;
}

// Types for SimpleChanceGame
export interface SimpleChanceGameOption {
  id: string; // e.g., 'roja', 'azul', 'si', 'no', 'igual_probable'
  label: string; // e.g., "Roja", "Azul", "Sí", "No", "Igual de probable"
}

export interface SimpleChanceGameScenario {
  id: string;
  contextText: string; // e.g., "Al lanzar una moneda al aire:" or "De una bolsa con:"
  visualContext: string; // Emoji or simple text description of the setup, e.g., "🪙" or "🔴🔴🔵 (3 bolitas)"
  questionText: string; // e.g., "¿Qué es más probable que salga?" or "¿Es posible sacar una bolita roja?"
  options: SimpleChanceGameOption[]; // Array of possible answers
  correctOptionId: string; // The 'id' of the correct option
  emoji?: string; // Emoji for the overall scenario/question character
}


// New Generic Unit Identification Types
export interface UnitOptionGeneric {
  unitId: string; // e.g., "cm", "kg", "ml"
  label: string;  // e.g., "cm", "kg", "ml" (for button)
  fullLabel: string; // e.g., "Centímetro", "Kilogramo", "Litro" (for accessibility/tooltip)
}

export interface ItemChallengeGeneric {
  id: string;
  description: string;
  correctUnit: string; // Corresponds to unitId in UnitOptionGeneric
  emoji?: string;
  feedbackMessages?: { // Optional custom feedback messages
    correct: string;
    incorrect: string;
  };
}

// New Generic Geometry Identification Types
export interface GenericVisualOption {
  id: string; // Corresponds to type IDs like LineType, AngleTypeId etc.
  label: string; // User-facing label for the button
}

export interface GenericVisualChallenge {
  id: string; // Unique ID for React key or specific challenge tracking
  VisualComponent: React.FC<any>; // The component to render the visual
  visualProps?: any; // Props to pass to VisualComponent (e.g., className, strokeColor)
  correctAnswerId: string; // The ID of the correct option (e.g., 'recta', 'agudo')
  options: GenericVisualOption[]; // Options for this specific challenge
  description?: string; // Optional context/characteristic text displayed below visual
  emoji?: string; // Optional emoji for the challenge display
}

// Bar Chart Types
export type BarChartQuestionType =
  | 'findMax'
  | 'findMin'
  | 'findSpecific'
  | 'compareTwo'
  | 'findTotal';

export interface BarChartCategoryTemplate {
  name: string;
  valueRange: [number, number];
  color: string; 
}

export interface BarChartQuestionTemplate {
  id: string;
  type: BarChartQuestionType;
}

export interface BarChartScenarioTemplate {
  scenarioId: string;
  chartTitle: string;
  yAxisLabel: string; // Or valueAxisLabel
  categories: BarChartCategoryTemplate[];
  questionTemplates: BarChartQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string;
}

// Types for POSICION_RELATIVA_OBJETOS
export type SpatialConcept = 'dentro_fuera' | 'arriba_abajo' | 'encima_debajo' | 'adelante_atras' | 'derecha_izquierda';
export interface SpatialChallenge {
  id: string;
  visuals: { item: string; reference: string; position: string }; // e.g. { item: '🍎', reference: '📦', position: 'inside'/'above' etc.}
  itemLabel: string;
  referenceLabel: string;
  options: { id: string; label: string }[]; // e.g. [{id: 'dentro', label: 'Dentro'}, {id: 'fuera', label: 'Fuera'}]
  correctAnswerId: string; // e.g. 'dentro'
  emoji?: string;
}


// Pictogram Types (New)
export interface PictogramItem {
  category: string; // Name of the item (e.g., "Manzanas")
  icon: string;     // Emoji for the item (e.g., "🍎")
  count: number;    // How many of this item
}

export type PictogramQuestionType = 'count_specific' | 'find_max' | 'find_min' | 'compare_two' | 'count_total';

export interface PictogramQuestionTemplate {
  id: string;
  type: PictogramQuestionType;
  targetCategory1?: string; // For 'count_specific', 'compare_two'
  targetCategory2?: string; // For 'compare_two'
}

export interface PictogramScenarioTemplate {
  scenarioId: string;
  title: string;
  keyLabelTemplate: string; // e.g., "Cada {ICONO} representa 1 {ITEM_TYPE}" - will replace {ICONO} and {ITEM_TYPE}
  itemTypeSingular: string; // e.g., "voto", "fruta"
  itemTypePlural: string;   // e.g., "votos", "frutas"
  items: { category: string; icon: string; valueRange: [number, number]; }[]; // Template for items
  questionTemplates: PictogramQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string; // Emoji for the scenario overall
}

// --- Medidas Types ---
// Data structure for LeerRelojOpcionesExercise
export interface TimeChallengeData { 
  hours: number; 
  minutes: number; 
  correctText: string;
  distractors: string[];
  emoji?: string;
}

// Coin type (value in cents)
export interface Coin {
  value: number; // e.g., 50 for 50c, 100 for $1 (in cents)
  count: number;
  label: string; // e.g., "50c", "$1"
}

// --- Scenario type for Problem Solving Exercises ---
export interface Scenario {
  id: string;
  problemTextTemplate: (num1: number, num2: number) => string;
  operation: '+' | '-' | '*' | '/';
  data1Label: string;
  data1Unit: string;
  data2Label: string;
  data2Unit: string;
  resultLabelTemplate: (result: number) => string;
  icon: string; // Emoji
}

// --- Statistics Types - End ---
