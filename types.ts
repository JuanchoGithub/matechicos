

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

// Extended PlaceValueKey for larger numbers in 4th grade
export type PlaceValueKey = 'umillon' | 'cmillon' | 'dmillon' | 'umil' | 'cmil' | 'dmil' | 'um' | 'c' | 'd' | 'u';


export enum ExerciseComponentType {
  GENERIC = 'generic',
  ESCRIBIR_HASTA_10000 = 'escribir_hasta_10000', // Used for up to 9,999,999 by varying data
  CALCULA_MENTALMENTE = 'calcula_mentalmente', 
  LEER_FRACCIONES_PROPIAS = 'leer_fracciones_propias',
  COMPARAR_HASTA_10000 = 'comparar_hasta_10000', // Used for up to 9,999,999 by varying data
  COMPONER_HASTA_10000_ABACO = 'componer_hasta_10000_abaco', // Used for up to 9,999,999 by varying data
  COMPONER_HASTA_10000_TEXTO = 'componer_hasta_10000_texto', // Used for up to 9,999,999 by varying data
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
  INTERPRETAR_PICTOGRAMAS = 'interpretar_pictogramas', 

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

  // New types for 2nd Grade
  VISUAL_MULTIPLICATION_INTRO = 'visual_multiplication_intro',
  MULTIPLICATION_TABLE_PRACTICE = 'multiplication_table_practice',
  SIMPLE_CHANCE_GAME = 'simple_chance_game',

  // --- START 4th Grade New Component Types ---
  // Numeros
  DESCOMPOSICION_POLINOMICA_G4 = 'descomposicion_polinomica_g4',
  FRACCIONES_EQUIVALENTES_G4 = 'fracciones_equivalentes_g4',
  COMPARAR_FRACCIONES_G4 = 'comparar_fracciones_g4',
  OPERAR_FRACCIONES_IGUAL_DENOMINADOR_G4 = 'operar_fracciones_igual_denominador_g4',
  NUMEROS_MIXTOS_INTRO_G4 = 'numeros_mixtos_intro_g4',
  DECIMALES_INTRO_FRACCION_G4 = 'decimales_intro_fraccion_g4',
  NUMEROS_ROMANOS_G4 = 'numeros_romanos_g4',
  MULTIPLOS_DIVISORES_CONCEPTO_G4 = 'multiplos_divisores_concepto_g4',
  
  // Operaciones
  OPERACIONES_COMBINADAS_SIMPLES_G4 = 'operaciones_combinadas_simples_g4',
  
  // Medidas
  CONVERSION_UNIDADES_G4 = 'conversion_unidades_g4', 
  CALCULAR_TIEMPO_TRANSCURRIDO_G4 = 'calcular_tiempo_transcurrido_g4',
  CALCULAR_AREA_G4 = 'calcular_area_g4',
  VOLUMEN_CUBOS_UNITARIOS_G4 = 'volumen_cubos_unitarios_g4',

  // Geometria
  MEDIR_ANGULOS_TRANSPORTADOR_G4 = 'medir_angulos_transportador_g4',
  IDENTIFICAR_DIAGONALES_POLIGONO_G4 = 'identificar_diagonales_poligono_g4',
  REDES_CUERPOS_GEOMETRICOS_G4 = 'redes_cuerpos_geometricos_g4',
  IDENTIFICAR_TRANSFORMACIONES_GEOMETRICAS_G4 = 'identificar_transformaciones_geometricas_g4',
  
  // Estadistica
  CALCULAR_MEDIA_G4 = 'calcular_media_g4',
  IDENTIFICAR_MODA_RANGO_G4 = 'identificar_moda_rango_g4',
  INTERPRETAR_GRAFICO_CIRCULAR_G4 = 'interpretar_grafico_circular_g4',
  EXPERIMENTO_ALEATORIO_REGISTRO_G4 = 'experimento_aleatorio_registro_g4',
  INTERPRETAR_GRAFICO_PUNTOS_G4 = 'interpretar_grafico_puntos_g4', 
  ORGANIZAR_DATOS_EN_TABLA_FRECUENCIA_G4 = 'organizar_datos_en_tabla_frecuencia_g4',
  CREAR_DIAGRAMA_BARRAS_SIMPLE_G4 = 'crear_diagrama_barras_simple_g4',

  // Probabilidad
  PREDECIR_RESULTADOS_PROBABILIDAD_G4 = 'predecir_resultados_probabilidad_g4',
  SUCESOS_DEPENDIENTES_INDEPENDIENTES_G4 = 'sucesos_dependientes_independientes_g4',
  // --- END 4th Grade New Component Types ---

  // --- START 5th Grade New Component Types (Numeros) ---
  DECIMALES_AVANZADO_G5 = 'decimales_avanzado_g5',
  COMPARAR_DECIMALES_G5 = 'comparar_decimales_g5',
  ORDENAR_DECIMALES_G5 = 'ordenar_decimales_g5',
  REDONDEAR_DECIMALES_G5 = 'redondear_decimales_g5',
  FRACCION_DE_CANTIDAD_G5 = 'fraccion_de_cantidad_g5',
  PRIMOS_COMPUESTOS_G5 = 'primos_compuestos_g5',
  REGLAS_DIVISIBILIDAD_G5 = 'reglas_divisibilidad_g5',
  MCD_MCM_G5 = 'mcd_mcm_g5',
  NUMEROS_ENTEROS_INTRO_G5 = 'numeros_enteros_intro_g5',
  SIMPLIFICAR_FRACCIONES_G5 = 'simplificar_fracciones_g5', // New for g5-s1-e3
  NUMEROS_MIXTOS_AVANZADO_G5 = 'numeros_mixtos_avanzado_g5', // New for g5-s1-e4
  // --- END 5th Grade New Component Types ---

  // --- START 5th Grade New Component Types (Operaciones) ---
  MEGA_OPERACIONES_ENTEROS_G5 = 'mega_operaciones_enteros_g5',
  OPERAR_FRACCIONES_HETEROGENEAS_G5 = 'operar_fracciones_heterogeneas_g5',
  MULTIPLICAR_FRACCIONES_G5 = 'multiplicar_fracciones_g5',
  DIVIDIR_FRACCIONES_G5 = 'dividir_fracciones_g5',
  COLUMNAR_OPERATION_DECIMAL = 'columnar_operation_decimal',
  MULTIPLICAR_DECIMALES_G5 = 'multiplicar_decimales_g5',
  DIVIDIR_DECIMALES_POR_ENTERO_G5 = 'dividir_decimales_por_entero_g5',
  OPERACIONES_COMBINADAS_G5 = 'operaciones_combinadas_g5',
  POTENCIAS_CUADRADOS_CUBOS_G5 = 'potencias_cuadrados_cubos_g5',
  // --- END 5th Grade New Component Types (Operaciones) ---
  
  // --- START 5th Grade Medidas Component Types ---
  METRIC_CONVERSION_QUEST_G5 = 'metric_conversion_quest_g5',
  PERIMETER_PUZZLE_BUILDER_G5 = 'perimeter_puzzle_builder_g5',
  AREA_ADVENTURE_G5 = 'area_adventure_g5',
  AREA_PUZZLE_BUILDER_G5 = 'area_puzzle_builder_g5',
  VOLUMEN_VOYAGE_G5 = 'volumen_voyage_g5',
  MEASUREMENT_DATA_EXPLORER_G5 = 'measurement_data_explorer_g5',
  // --- END 5th Grade Medidas Component Types ---

  // --- START 5th Grade Geometria Component Types ---
  POLYGON_SORTING_CHALLENGE_G5 = 'polygon_sorting_challenge_g5',
  TRIANGLE_QUAD_EXPLORER_G5 = 'triangle_quad_explorer_g5',
  SHAPE_3D_COUNTER_G5 = 'shape_3d_counter_g5',
  NETS_OF_3D_SHAPES_G5 = 'nets_of_3d_shapes_g5',
  // --- END 5th Grade Geometria Component Types ---

  // --- START Problemas New Component Types (Multiple Grades) ---
  PROBLEMAS_MULTIPLES_PASOS_G5 = 'problemas_multiples_pasos_g5',
  PROBLEMAS_PROPORCIONALIDAD_G5 = 'problemas_proporcionalidad_g5',
  PROBLEMAS_INTERPRETAR_RESTO_G5 = 'problemas_interpretar_resto_g5',
  FINANZAS_AVANZADO = 'finanzas_avanzado',
  // --- END Problemas New Component Types ---
}

export type LineType = 'recta' | 'curva' | 'poligonal_abierta' | 'poligonal_cerrada' | 'poligonal'; 
export const LINE_TYPE_LABELS: Record<LineType, string> = {
  recta: 'Recta',
  curva: 'Curva',
  poligonal_abierta: 'Poligonal Abierta',
  poligonal_cerrada: 'Poligonal Cerrada',
  poligonal: 'Quebrada / Poligonal', 
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

// For 4th grade: Clasificar Triángulos por sus Ángulos
export type TriangleAngleTypeId = 'rectangulo' | 'acutangulo' | 'obtusangulo';
export const TRIANGLE_ANGLE_TYPE_LABELS: Record<TriangleAngleTypeId, string> = {
  rectangulo: 'Rectángulo', // Triángulo Rectángulo
  acutangulo: 'Acutángulo', // Triángulo Acutángulo
  obtusangulo: 'Obtusángulo', // Triángulo Obtusángulo
};
export interface TriangleAngleDefinition {
  id: TriangleAngleTypeId;
  name: string;
  characteristic: string; // e.g., "Tiene un ángulo recto (90°)."
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; angleMarkerColor?: string }>;
}


export type QuadrilateralTypeId = 'cuadrado' | 'rectangulo' | 'rombo' | 'romboide' | 'trapecio' | 'trapezoide' | 'paralelogramo';
export const QUADRILATERAL_TYPE_LABELS: Record<QuadrilateralTypeId, string> = {
  cuadrado: 'Cuadrado',
  rectangulo: 'Rectángulo',
  rombo: 'Rombo',
  romboide: 'Romboide',
  paralelogramo: 'Paralelogramo',
  trapecio: 'Trapecio', 
  trapezoide: 'Trapezoide',
};
export interface QuadrilateralDefinition {
  id: QuadrilateralTypeId;
  name: string; 
  characteristic: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}

export type BasicShapeTypeId = 'circulo' | 'cuadrado' | 'triangulo' | 'rectangulo';
export const BASIC_SHAPE_LABELS: Record<BasicShapeTypeId, string> = {
  circulo: 'Círculo',
  cuadrado: 'Cuadrado',
  triangulo: 'Triángulo',
  rectangulo: 'Rectángulo',
};
export interface BasicShapeDefinition {
  id: BasicShapeTypeId;
  name: string;
  description: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}


export type PolygonBasicTypeId = 'triangulo' | 'cuadrilatero' | 'pentagono' | 'hexagono' | 'heptagono' | 'octagono' | 'eneagono' | 'decagono' | 'undecagono' | 'dodecagono';
export const POLYGON_BASIC_TYPE_LABELS: Record<PolygonBasicTypeId, string> = {
  triangulo: 'Triángulo',
  cuadrilatero: 'Cuadrilátero',
  pentagono: 'Pentágono',
  hexagono: 'Hexágono',
  heptagono: 'Heptágono', 
  octagono: 'Octágono',   
  eneagono: 'Eneágono',   
  decagono: 'Decágono',   
  undecagono: 'Undecágono',
  dodecagono: 'Dodecágono',
};
export interface PolygonBasicDefinition {
  id: PolygonBasicTypeId;
  name: string; 
  sidesDescription: string; 
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string }>;
}

export type PerimeterShapeTypeId = 'trianguloEquilatero' | 'cuadrado' | 'rectangulo' | 'trianguloIsosceles' | 'trianguloEscaleno' | 'rombo' | 'poligonoIrregular'; // Added poligonoIrregular
export const PERIMETER_SHAPE_TYPE_LABELS: Record<PerimeterShapeTypeId, string> = {
  trianguloEquilatero: 'Triángulo Equilátero',
  cuadrado: 'Cuadrado',
  rectangulo: 'Rectángulo',
  trianguloIsosceles: 'Triángulo Isósceles',
  trianguloEscaleno: 'Triángulo Escaleno',
  rombo: 'Rombo',
  poligonoIrregular: 'Polígono Irregular',
};
export interface PerimeterShapeDefinition {
  id: PerimeterShapeTypeId;
  name: string;
  VisualComponent: React.FC<{ className?: string; strokeColor?: string; fillColor?: string; sideLengths: number[]; showLabels?: boolean }>;
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

export type GeometricBodyTypeId = 'prismaRectangular' | 'piramideCuadrangular' | 'esfera' | 'cono' | 'cilindro' | 'cubo'; // Added Cubo explicitly
export const GEOMETRIC_BODY_TYPE_LABELS: Record<GeometricBodyTypeId, string> = {
  prismaRectangular: 'Prisma Rectangular',
  piramideCuadrangular: 'Pirámide Cuadrangular',
  esfera: 'Esfera',
  cono: 'Cono',
  cilindro: 'Cilindro',
  cubo: 'Cubo',
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

export interface ExerciseScaffoldApi {
  onAttempt: (isCorrect: boolean) => void;
  advanceToNextChallengeSignal: number; 
  showFeedback: (feedback: {type: 'correct' | 'incorrect' | 'gameover' | 'congrats', message: string} | null) => void; 
  onSetCompleted?: (exerciseId: string) => void; 
}

// --- Statistics Types - Start ---
export interface TableRowData { 
  name: string;
  value: number;
}
export interface TableQuestion { 
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; 
}
export interface TableRowCategoryTemplate {
  name: string; 
  valueRange: [number, number]; 
}
export interface TableQuestionTemplate {
  id: string;
  type: 'findMaxRow' | 'findMinRow' | 'findSpecificValue' | 'compareTwoRows' | 'findTotalColumnValue';
}
export interface TableScenarioTemplate {
  scenarioId: string;
  tableTitle: string;
  columnHeaders: [string, string]; 
  rowCategories: TableRowCategoryTemplate[];
  questionTemplates: TableQuestionTemplate[];
  totalStarsPerScenario: number;
  icon?: string; 
}
export interface TableCellData { 
  value: number;
}
export type TableDobleEntradaQuestionType =
  | 'findSpecificCellValue' | 'findRowTotal' | 'findColumnTotal' | 'findGrandTotal'
  | 'findCategoryWithMaxInRow' | 'findCategoryWithMinInRow' 
  | 'findCategoryWithMaxForColumn' | 'findCategoryWithMinForColumn' 
  | 'compareTwoCellValues'; 
export interface TableDobleEntradaQuestionCoordinates { rowName: string; colName: string; }
export interface TableDobleEntradaQuestionTemplate {
  id: string; type: TableDobleEntradaQuestionType; targetRowName?: string; 
  targetColName?: string; cell1Coords?: TableDobleEntradaQuestionCoordinates;
  cell2Coords?: TableDobleEntradaQuestionCoordinates;
}
export interface TableDobleEntradaCell { value: number; isMissing?: boolean; }
export interface TableDobleEntradaRow { header: string; cells: TableDobleEntradaCell[]; isTotalRow?: boolean; }
export interface TableDobleEntradaScenarioTemplate {
  scenarioId: string; tableTitle: string; rowHeaders: string[]; columnHeaders: string[];
  valueAxisLabel: string; cellValueRange: [number, number];
  questionTemplates: TableDobleEntradaQuestionTemplate[]; totalStarsPerScenario: number; icon?: string;
}
export type UbicarEnTablaItem = string; 
export interface UbicarEnTablaScenarioTemplate {
  scenarioId: string; tableTitle: string; gridSize: { rows: number; cols: number };
  possibleItems: UbicarEnTablaItem[]; numQuestionsPerScenario: number;
  totalStarsPerScenario: number; icon?: string;
}
export type UbicarEnTablaQuestionType = 'what_is_in_cell' | 'where_is_item';
export interface MissingInfoPuzzleCellTemplate { display: string; isMissingCell?: boolean; isTotalCell?: boolean; }
export interface MissingInfoPuzzleRowTemplate { header: string; values: MissingInfoPuzzleCellTemplate[]; isTotalRow?: boolean; }
export interface MissingInfoPuzzleScenarioTemplate {
  scenarioId: string; title: string; rowCategoryHeader: string; 
  dataColumnHeaders: string[]; displayRowTotalsColumn?: boolean; 
  rowData: MissingInfoPuzzleRowTemplate[]; correctAnswer: number; 
  questionText?: string; totalStars: number; icon?: string; valueUnit?: string;
}
export interface OrdenarDatosEnTablaItem { name: string; value: number; }
export interface OrdenarDatosEnTablaScenarioTemplate {
  scenarioId: string; title: string; categoryHeader: string; valueHeader: string;    
  unsortedData: OrdenarDatosEnTablaItem[]; sortInstructionText: string; 
  sortBy: 'name' | 'value'; sortOrder: 'asc' | 'desc';
  numItemsToDisplayInTable: number; totalStarsPerScenario: number; icon?: string;
}
export interface SimpleTableDataRow { name: string; value: number; }
export interface SimpleTableDataForComparison {
  tableId: string; title: string; categoryHeader: string; valueHeader: string; rows: SimpleTableDataRow[];
}
export interface CompararTablasSimplesQuestionTemplate {
  id: string; type: 'compareCategoryBetweenTables' | 'findDifferenceForCategory' | 'whichTableHasMaxForCategory' | 'whichTableHasMaxOverall' | 'whichTableHasMinOverall';
  targetCategoryName?: string; comparisonType?: 'more' | 'less' | 'equal'; 
}
export interface CompararTablasSimplesScenarioTemplate {
  scenarioId: string; description: string; tableA: SimpleTableDataForComparison;
  tableB: SimpleTableDataForComparison; valueRangeForRandomization: [number, number]; 
  questionTemplates: CompararTablasSimplesQuestionTemplate[]; totalStarsPerScenario: number; icon?: string;
}
export interface LinealChartDataPoint { xLabel: string; yValue: number; }
export interface LinealChartQuestionTemplate {
  id: string; type: 'findSpecificYValue' | 'findMaxYValue' | 'findMinYValue' | 'calculateDifferenceBetweenTwoYValues' | 'describeTrend' | 'findTotalYValue';
  targetXLabel1?: string; targetXLabel2?: string; 
}
export interface LinealChartScenarioTemplate {
  scenarioId: string; chartTitle: string; xAxisLabel: string; yAxisLabel: string;
  dataPoints: LinealChartDataPoint[]; questionTemplates: LinealChartQuestionTemplate[];
  totalStarsPerScenario: number; icon?: string; yAxisValueStep?: number; 
}
export interface MultiLineChartDataSeries { name: string; points: LinealChartDataPoint[]; color: string; }
export interface MultiLineChartQuestionTemplate {
  id: string; type: 'findYValueForLineAndX' | 'whichLineHasMaxYAtX' | 'whichLineHasMinYAtX' | 'findDifferenceBetweenLinesAtX' | 'describeOverallTrendForLine' | 'compareOverallTrends';
  targetLineName1?: string; targetLineName2?: string; targetXLabel?: string;    
  targetXLabelStart?: string; targetXLabelEnd?: string;   
}
export interface MultiLineChartScenarioTemplate {
  scenarioId: string; chartTitle: string; xAxisLabel: string; yAxisLabel: string;
  series: [MultiLineChartDataSeries, MultiLineChartDataSeries]; 
  questionTemplates: MultiLineChartQuestionTemplate[]; totalStarsPerScenario: number;
  icon?: string; yAxisValueStep?: number;
}
export type CertaintyLevel = 'posible' | 'imposible' | 'seguro';
export interface CertaintyScenario { id: string; eventText: string; correctCertainty: CertaintyLevel; emoji?: string; }
export type FrequencyLevel = 'nunca' | 'a_veces' | 'siempre';
export const FREQUENCY_LEVEL_LABELS: Record<FrequencyLevel, string> = { nunca: 'Nunca', a_veces: 'A Veces', siempre: 'Siempre', };
export interface FrecuenciaScenario { id: string; eventText: string; correctFrequency: FrequencyLevel; emoji?: string; }
export interface ProbabilityEvent { text: string; visual: string; favorable: number; total: number; }
export interface ProbabilityComparisonScenario { id: string; contextText: string; eventA: ProbabilityEvent; eventB: ProbabilityEvent; emoji?: string; }
export interface ProbabilityOption { text: string; isCorrect: boolean; }
export interface SimpleProbabilityScenario {
  id: string; contextText: string; visualContext: string; 
  eventToEvaluate: string; options: ProbabilityOption[]; emoji?: string;
}
export interface SimpleChanceGameOption { id: string; label: string; }
export interface SimpleChanceGameScenario {
  id: string; contextText: string; visualContext: string; questionText: string; 
  options: SimpleChanceGameOption[]; correctOptionId: string; emoji?: string; 
}
export interface UnitOptionGeneric { unitId: string; label: string; fullLabel: string; }
export interface ItemChallengeGeneric {
  id: string; description: string; correctUnit: string; emoji?: string;
  feedbackMessages?: { correct: string; incorrect: string; };
}
export interface GenericVisualOption { id: string; label: string; }
export interface GenericVisualChallenge {
  id: string; VisualComponent: React.FC<any>; visualProps?: any; 
  correctAnswerId: string; options: GenericVisualOption[]; 
  description?: string; emoji?: string; 
}
export type BarChartQuestionType = | 'findMax' | 'findMin' | 'findSpecific' | 'compareTwo' | 'findTotal';
export interface BarChartCategoryTemplate { name: string; valueRange: [number, number]; color: string; }
export interface BarChartQuestionTemplate { id: string; type: BarChartQuestionType; }
export interface BarChartScenarioTemplate {
  scenarioId: string; chartTitle: string; yAxisLabel: string; 
  categories: BarChartCategoryTemplate[]; questionTemplates: BarChartQuestionTemplate[];
  totalStarsPerScenario: number; icon?: string;
}
export type SpatialConcept = 'dentro_fuera' | 'arriba_abajo' | 'encima_debajo' | 'adelante_atras' | 'derecha_izquierda';
export interface SpatialChallenge {
  id: string; visuals: { item: string; reference: string; position: string }; 
  itemLabel: string; referenceLabel: string; options: { id: string; label: string }[]; 
  correctAnswerId: string; emoji?: string;
}
export interface PictogramItem { category: string; icon: string; count: number; }
export type PictogramQuestionType = 'count_specific' | 'find_max' | 'find_min' | 'compare_two' | 'count_total';
export interface PictogramQuestionTemplate {
  id: string; type: PictogramQuestionType; targetCategory1?: string; targetCategory2?: string; 
}
export interface PictogramScenarioTemplate {
  scenarioId: string; title: string; keyLabelTemplate: string; 
  itemTypeSingular: string; itemTypePlural: string;   
  items: { category: string; icon: string; valueRange: [number, number]; }[]; 
  questionTemplates: PictogramQuestionTemplate[]; totalStarsPerScenario: number; icon?: string; 
}
// --- Medidas Types ---
export interface TimeChallengeData { hours: number; minutes: number; correctText: string; distractors: string[]; emoji?: string; }
export interface Coin { value: number; count: number; label: string; }
// --- Scenario type for Problem Solving Exercises ---
export interface Scenario {
  id: string; problemTextTemplate: (num1: number, num2: number) => string;
  operation: '+' | '-' | '*' | '/'; data1Label: string; data1Unit: string;
  data2Label: string; data2Unit: string; resultLabelTemplate: (result: number) => string;
  icon: string; 
}
// --- Statistics Types - End ---

// --- 4th Grade Specific Types (New & Updated) ---
export interface DescomposicionPolinomicaChallenge {
  numberToDecompose: number;
  correctParts: number[]; // e.g., [3000, 400, 50, 6] for 3456
}

export interface OperacionesCombinadasChallenge {
  expression: string; 
  correctAnswer: number;
}

export interface RomanNumeralChallenge {
  numberAr: number; 
  numberRo: string; 
  options?: string[]; 
  questionType: 'ar_to_ro' | 'ro_to_ar';
  correctAnswer?: string; // Added
}

export interface AreaCalculationChallenge {
  shapeType: 'cuadrado' | 'rectangulo';
  sideA: number;
  sideB?: number; 
  correctArea: number;
  unit?: string; // e.g. 'cm'
}

export interface MeanCalculationChallenge {
  numbers: number[];
  correctMean: number;
}

export interface ModeRangeChallenge {
  numbers: number[];
  correctMode: number[] | number | null; 
  correctRange: number;
}

export interface FractionChallenge { // General fraction structure
  numerator: number;
  denominator: number;
}

export interface FractionEquivalentChallenge {
  baseFraction: FractionChallenge;
  options: { fraction: FractionChallenge; isCorrect: boolean; visual?: string }[];
  visualType?: 'bar' | 'circle'; // For visual representation
}

export interface SimplificarFraccionChallenge { // New for G5
  fractionToSimplify: FractionChallenge;
  options: { fraction: FractionChallenge; isCorrect: boolean; }[]; 
  correctSimplifiedFraction: FractionChallenge; 
  visualType?: 'bar' | 'circle';
}


export interface CompareFractionChallenge {
  fractionA: FractionChallenge;
  fractionB: FractionChallenge;
  correctSymbol: ComparisonSymbol; // '<', '=', '>'
  visualSupport?: boolean;
}

export interface OperateFractionChallenge {
  fractionA: FractionChallenge;
  fractionB: FractionChallenge; // Denominators will be same for this exercise type
  operation: '+' | '-';
  correctResult: FractionChallenge;
}

export interface MixedNumberChallenge {
  question: string; // e.g., "2 1/3" or "7/3"
  type: 'mixed_to_improper' | 'improper_to_mixed';
  options: string[]; // e.g., ["7/3", "5/3", "2/3"] or ["2 1/3", "1 2/3", "3 1/3"]
  correctAnswer: string; // The correct string representation of the answer
}

export interface DecimalIntroChallenge {
  representation: string; // Can be "3/10" or "0.7"
  type: 'fraction_to_decimal' | 'decimal_to_fraction';
  options: string[]; // e.g., ["0.3", "3.0", "0.03"] or ["7/10", "7/100", "1/7"]
  correctAnswer: string;
}

export interface MultiplosDivisoresChallenge {
  numberA: number;
  numberB: number;
  type: 'isMultiple' | 'isDivisor'; // Is B a multiple/divisor of A?
  correctAnswer: boolean; // true or false
}

export type ConversionUnitType = 'longitud' | 'masa' | 'capacidad' | 'tiempo';
export type LengthUnitId = 'mm' | 'cm' | 'm' | 'km';
export type MassUnitId = 'g' | 'kg' | 't';
export type CapacityUnitId = 'ml' | 'l' | 'kl';
export type TimeUnitId = 'horas' | 'minutos' | 'segundos';
export type AnyUnitId = LengthUnitId | MassUnitId | CapacityUnitId | TimeUnitId;

export interface ConversionUnidadesChallenge {
  fromUnit: AnyUnitId;
  toUnit: AnyUnitId;
  valueFrom: number;
  correctAnswerTo: number;
  unitType: ConversionUnitType;
  context?: string; // Add context for the quest format
}

export interface MetricConversionQuestChallenge {
  unitType: 'length' | 'mass' | 'capacity';
  fromUnit: AnyUnitId;
  toUnit: AnyUnitId;
  valueFrom: number;
  correctAnswer: number;
  context: string;
  icon: string;
}


export interface TiempoTranscurridoChallenge {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  correctAnswer: { hours: number; minutes: number };
}

export interface VolumenCubosUnitariosChallenge {
  dimensions: { length: number; width: number; height: number }; // in units
  // visual? : string or component if simple enough
  correctVolume: number; // in cubic units
}

// For IDENTIFICAR_DIAGONALES_POLIGONO_G4
export interface DiagonalChallenge {
  polygonName: PolygonBasicTypeId;
  sides: number; // For display
  VisualComponent: React.FC<any>; // Visual representation of the polygon
  correctNumDiagonals: number;
  options: number[]; // Numerical options for MCQ
}

// For REDES_CUERPOS_GEOMETRICOS_G4
export interface NetChallenge {
  netVisualComponent: React.FC<any>; // Visual representation of the net
  correctBodyId: GeometricBodyTypeId;
  options: {id: GeometricBodyTypeId, label: string}[]; // Options of 3D body names
}

// For IDENTIFICAR_TRANSFORMACIONES_GEOMETRICAS_G4
export type TransformationType = 'traslacion' | 'rotacion' | 'reflexion';
export interface TransformationChallenge {
  id: string;
  BeforeShapeComponent: React.FC<any>;
  AfterShapeComponent: React.FC<any>;
  shapeProps?: any; // Common props for both components
  correctTransformation: TransformationType;
  options: {id: TransformationType, label: string}[];
}

// For INTERPRETAR_GRAFICO_CIRCULAR_G4
export interface PieChartSlice {
  label: string;
  value: number; // Can be percentage or actual value
  color: string; // e.g., 'bg-red-500' or hex
}
export interface PieChartQuestion {
  text: string;
  options: string[]; // Text options
  correctAnswer: string;
}
export interface PieChartChallenge {
  title: string;
  data: PieChartSlice[];
  questions: PieChartQuestion[]; // Exercise will cycle through these
}

// For EXPERIMENTO_ALEATORIO_REGISTRO_G4
export interface ExperimentoAleatorioChallenge {
  experimentType: 'dice' | 'coin' | 'spinner';
  description: string; // e.g., "Lanza un dado 10 veces y anota los resultados."
  possibleOutcomes: string[]; // e.g., ["1", "2", "3", "4", "5", "6"] or ["Cara", "Cruz"]
  questionType: 'frequency_of_outcome' | 'most_frequent' | 'least_frequent';
  // For simulation, this would be more complex. For G4 MCQ, data might be pre-set.
  simulatedResults?: {outcome: string, count: number}[]; // Pre-defined results for MCQ
  questionAbout?: string; // e.g., "el número 3" or "Cara"
  correctAnswer: string; // e.g., "3 veces" or "Cara"
  options: string[];
}

// For PREDECIR_RESULTADOS_PROBABILIDAD_G4
export interface PrediccionProbabilidadChallenge {
  eventDescription: string; // e.g., "Sacar una bolita roja de una bolsa con 3 rojas y 1 azul."
  probability: { favorable: number; total: number }; // e.g., { favorable: 3, total: 4 }
  numTrials: number; // e.g., 20 lanzamientos
  questionText: string; // e.g., "Si lanzas la moneda 20 veces, ¿aproximadamente cuántas veces saldrá cara?"
  correctAnswer: number; // The expected number of times
  options: number[]; // Numerical options
}

// For SUCESOS_DEPENDIENTES_INDEPENDIENTES_G4
export interface DependenciaSucesosChallenge {
  eventA: string;
  eventB: string;
  areIndependent: boolean; // True if independent, false if dependent
  explanation?: string; // Optional, for learning
  options: {id: string, label: string}[]; // e.g., [{id:'independientes', label:'Independientes'}, {id:'dependientes', label:'Dependientes'}]
  correctAnswerId: string; // 'independientes' or 'dependientes'
}


// For MedirAngulosTransportadorG4
export interface MedirAngulosTransportadorG4Challenge {
  id: string;
  angleDegrees: number; // The actual angle to be measured/identified
  options: number[]; // Array of degree options, one is correctAngle
  imageUrl?: string; // Optional: Path to an image showing an angle on a protractor
  questionText?: string; // e.g., "Mide el ángulo mostrado:" or "¿Cuántos grados mide este ángulo?"
}

// --- START New Types for Line Plot Exercise G4 ---
export interface LinePlotPointG4 {
  value: number;    // The value on the number line (e.g., number of pets, hours read)
  frequency: number; // How many X's or dots above this value
}

export interface LinePlotQuestionG4 {
  id: string;
  text: string;
  questionType: 'mcq' | 'numeric'; // Multiple choice or direct number input
  options?: string[]; // For MCQ: Array of string options
  correctAnswer: string; // String representation of the answer (either the MCQ option string or the numeric string)
}

export interface LinePlotChallengeG4 {
  id: string;
  title: string;
  xAxisLabel: string;
  data: LinePlotPointG4[]; // The actual data points for the plot
  questions: LinePlotQuestionG4[]; // Array of questions related to this specific plot
  icon?: string; // Optional emoji for the scenario
}
// --- END New Types for Line Plot Exercise G4 ---

// --- START New Types for Organizing Data in Frequency Table G4 ---
export type RawDataItemG4 = string | number; // Could be string (color, sport) or number (dice roll)

export interface FrequencyTableChallengeG4 {
  id: string;
  description: string; // e.g., "Los colores favoritos de la clase son:"
  rawData: RawDataItemG4[]; // e.g., ["Rojo", "Azul", "Rojo", "Verde"]
  categories: string[]; // Unique categories to be listed in the table, e.g., ["Rojo", "Azul", "Verde"]
  questionText: string; // e.g., "Completa la tabla de frecuencias contando cuántas veces aparece cada elemento."
  icon?: string; // Optional emoji for the scenario
  correctFrequencies: { [category: string]: number }; // For verification, e.g., {"Rojo": 2, "Azul": 1, "Verde": 1}
  totalStars: number; // Total stars for completing this one scenario (usually 1 if it's one table to fill)
}
// --- END New Types for Organizing Data in Frequency Table G4 ---

// --- START New Types for Creating Simple Bar Graph G4 ---
export interface BarGraphCategoryDataG4 {
  categoryName: string;
  correctFrequency: number;
  color?: string; // Predefined color for this bar in the solution
}

export interface CreateBarGraphChallengeG4 {
  id: string;
  title: string; // e.g., "Sabores de Helado Favoritos"
  description: string; // e.g., "Usa la tabla para crear el gráfico de barras."
  tableData: BarGraphCategoryDataG4[]; // The frequency table data
  xAxisLabel: string; // e.g., "Sabor de Helado"
  yAxisLabel: string; // e.g., "Cantidad de Votos"
  maxYAxisValue?: number; // Optional: if not provided, calculate from data
  yAxisStep?: number;     // Optional: if not provided, calculate
  icon?: string;
  totalStars: number;
}
// --- END New Types for Creating Simple Bar Graph G4 ---
// --- END 4th Grade Specific Types ---


// --- START 5th Grade Specific Types (Numeros) ---
export interface DecimalAvanzadoChallenge {
  value: number; // The decimal number involved
  representationType: 'word_to_decimal' | 'decimal_to_word' | 'identify_place_value_decimal';
  options?: string[]; // Options for MCQ type questions
  correctAnswer: string; // Can be a string (for words) or a number string
  placeToIdentify?: 'decimos' | 'centesimos' | 'milesimos'; // For place value identification
  visual?: string; // e.g., a grid or number line image path
}

export interface CompararDecimalesChallenge {
  decimalA: number;
  decimalB: number;
  correctSymbol: ComparisonSymbol;
}

export interface OrdenarDecimalesChallenge {
  decimals: number[]; // Array of decimals to be ordered
  sortOrder: 'asc' | 'desc'; // User needs to produce the correctly sorted array.
  // Correct answer implicitly the sorted version of `decimals` based on `sortOrder`.
}

export interface RedondearDecimalesChallenge {
  decimal: number;
  placeToRound: 'entero' | 'decimo' | 'centesimo'; // Round to nearest whole, tenth, or hundredth
  correctAnswer: number;
}

export interface FraccionCantidadChallenge {
  fractionNum: number;
  fractionDen: number;
  wholeNumber: number;
  correctAnswer: number;
  context?: string; // Optional: "de X objetos"
  visual?: 'dots' | 'bar'; // Optional visual aid
}

export interface PrimoCompuestoChallenge {
  numberToCheck: number;
  isPrime: boolean; // True if prime, false if composite
  // Options will be "Primo" / "Compuesto"
}

export interface DivisibilidadChallenge {
  numberToCheck: number;
  divisor: 2 | 3 | 5 | 9 | 10; // Or other common divisibility rules for G5
  isDivisible: boolean;
  ruleExplanation?: string; // Optional: e.g., "Termina en 0 o 5."
  // Options will be "Sí, es divisible" / "No, no es divisible"
}

export interface McdMcmChallenge {
  numbers: number[]; // Typically two numbers
  type: 'mcd' | 'mcm'; // Greatest Common Divisor or Least Common Multiple
  correctAnswer: number;
}

export interface NumeroEnteroChallenge {
  value1: number; // Can be positive or negative
  value2?: number; // For comparison or operations
  task: 'locate_on_line' | 'compare_integers' | 'sum_integers' | 'subtract_integers' | 'real_life_context';
  contextQuestion?: string; // e.g., "Si la temperatura baja X grados desde Y grados..."
  options?: (string | number)[];
  correctAnswer: string | number;
  numberLineRange?: [number, number]; // For locate_on_line task
}
// --- END 5th Grade Specific Types ---

// --- START 5th Grade Specific Types (Operaciones) ---

export interface OperarFraccionesHeterogeneasChallenge {
  fractionA: FractionChallenge;
  fractionB: FractionChallenge;
  operation: '+' | '-';
  correctResult: FractionChallenge; // The simplified result
}

export interface MultiplicarFraccionesChallenge {
  factor1: FractionChallenge | number; // Can be a fraction or an integer
  factor2: FractionChallenge | number;
  correctResult: FractionChallenge; // The simplified result
}

export interface DividirFraccionesChallenge {
  dividend: FractionChallenge | number;
  divisor: FractionChallenge | number; // e.g. an integer or a unit fraction
  correctResult: FractionChallenge; // The simplified result
}

export interface ColumnarOperationDecimalChallenge {
  operands: number[]; // e.g., [12.34, 5.6]
  operationType: 'addition' | 'subtraction';
  correctResult: number;
}

export interface MultiplicarDecimalesChallenge {
  factor1: number; // e.g., 1.23
  factor2: number; // e.g., 4.5
  correctResult: number;
}

export interface DividirDecimalesPorEnteroChallenge {
  dividend: number; // e.g., 12.4
  divisor: number; // e.g., 4 (must be an integer)
  correctResult: number; // e.g., 3.1
}

export interface OperacionesCombinadasG5Challenge {
  expression: string; // e.g., "(3 + 5) * 2"
  correctAnswer: number;
}

export interface PotenciasChallenge {
  base: number;
  exponent: 2 | 3; // Square or Cube
  correctAnswer: number;
}
// --- END 5th Grade Specific Types (Operaciones) ---

// --- START 5th Grade Problemas Specific Types ---
export interface MultiStepProblem {
  id: string;
  problemText: string;
  steps: {
    question: string;
    correctAnswer: number;
  }[];
  finalQuestion: string;
  finalAnswer: number;
  icon?: string;
}

export interface ProportionProblem {
  id: string;
  a: number;
  aLabel: string;
  b: number;
  bLabel: string;
  c: number;
  cLabel: string;
  xLabel: string;
  context: string;
  icon?: string;
}

export interface RemainderProblem {
  id: string;
  dividend: number;
  divisor: number;
  context: string;
  quotientLabel: string;
  remainderLabel: string;
  icon?: string;
}

export interface FinanceItem {
  name: string;
  price: number;
  icon: string;
}

export interface FinanceChallengeG5 {
  id: string;
  initialMoney: number;
  shoppingList: {
    item: FinanceItem;
    quantity: number;
  }[];
}
// --- END 5th Grade Problemas Specific Types ---

// --- START 5th Grade Medidas Specific Types ---
export interface PerimeterPuzzleChallenge {
  id: string;
  shapeType: string; // e.g., 'Rectángulo', 'Forma en L'
  vertices: [number, number][];
  unit: 'cm' | 'm' | 'km';
  context: string; // e.g., "Design the lion enclosure."
  icon: string; // e.g., '🦁'
}

export interface AreaPuzzleChallenge {
  id: string;
  shapeType: string; // e.g., 'Rectángulo', 'Forma en L'
  vertices: [number, number][];
  unit: 'cm' | 'm' | 'km';
  context: string; // e.g., "Calculate the area of the garden."
  icon: string; // e.g., '🥕'
}

export interface AreaAdventureChallenge {
  id: string;
  prompt: string;
  shapeType: 'rectangle' | 'triangle' | 'trapezoid';
  dimensions: {
    base?: number;
    height?: number;
    base1?: number; // For trapezoid
    base2?: number; // For trapezoid
    width?: number; // For rectangle
  };
  unit: string;
  correctAnswer: number;
}

export interface VolumeVoyageChallenge {
  id: string;
  prompt: string;
  shapeType: 'cubo' | 'prismaRectangular';
  dimensions: { length: number; width: number; height: number };
  unit: string;
  icon: string;
  correctAnswer: number;
}

// New Interface for Measurement Data Explorer
export interface MeasurementDataExplorerChallengeG5 {
  id: string;
  mode: 'create' | 'interpret';
  title: string;
  data: number[];
  unit: string;
  question: string;
  correctAnswer: number;
  dotIcon?: string;
  icon?: string;
  lineRange: [number, number]; // min and max for the number line
  step: number; // step for the number line ticks
}
// --- END 5th Grade Medidas Specific Types ---


// --- START 5th Grade Geometria Specific Types ---
export interface PolygonSortingChallengeG5 {
  id: string;
  VisualComponent: React.FC<any>;
  visualProps?: any;
  isRegular: boolean;
  isConvex: boolean;
  name: string; // e.g., "Pentágono Regular"
  hint: string;
}

export type TriangleAngleChallengeG5 = {
  type: 'triangle_angle';
  knownAngles: [number, number];
};

export type QuadPropertyChallengeG5 = {
  type: 'quad_property';
  description: string;
  correctShapeId: QuadrilateralTypeId;
  options: QuadrilateralTypeId[];
};

export type TriangleQuadExplorerChallenge = TriangleAngleChallengeG5 | QuadPropertyChallengeG5;

export interface Shape3DCounterChallengeG5 {
  shapeId: GeometricBodyTypeId;
  shapeName: string;
  VisualComponent: React.FC<any>; // Component that takes click handlers
  correctCounts: {
    faces: number;
    edges: number;
    vertices: number;
  };
}

// For NETS_OF_3D_SHAPES_G5
export type NetConstructionPieceType = 'square' | 'rectangle_a' | 'rectangle_b';

export interface NetConstructionChallenge {
  type: 'construct';
  targetShape: 'cube' | 'rectangular_prism';
  pieces: { type: NetConstructionPieceType, count: number }[];
  gridSize: { rows: number; cols: number };
  // We won't predefine layouts, we'll check validity algorithmically
  validLayouts: number[][][]; 
  feedback: {
    invalidCount: string;
    invalidShape: string;
    correct: string;
  };
}

export interface NetMatchingChallenge {
  type: 'match';
  targetShapeId: GeometricBodyTypeId;
  TargetShapeComponent: React.FC<any>;
  netOptions: { id: string, NetVisualComponent: React.FC<any>, isCorrect: boolean }[];
}

export type NetsOf3DShapesChallenge = NetConstructionChallenge | NetMatchingChallenge;
// --- END 5th Grade Geometria Specific Types ---
