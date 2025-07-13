import { Exercise, ExerciseComponentType, OriginalIconName } from "@/types";

// --- Scenarios for g3-s6-e5: InterpretarTablaSimpleExercise ---
const g3s6e5_AnimalesFavoritos: TableScenarioTemplate = {
  scenarioId: "animales_fav_g3s6e5",
  tableTitle: "Animales Favoritos de la Clase",
  columnHeaders: ["Animal", "Votos"],
  rowCategories: [
    { name: "Perro", valueRange: [5, 15] },
    { name: "Gato", valueRange: [3, 12] },
    { name: "Pájaro", valueRange: [1, 8] },
    { name: "Pez", valueRange: [2, 10] },
  ],
  questionTemplates: [
    { id: "q1", type: 'findMaxRow' },
    { id: "q2", type: 'findSpecificValue' },
    { id: "q3", type: 'findTotalColumnValue' },
    { id: "q4", type: 'findMinRow' },
  ],
  totalStarsPerScenario: 4,
  icon: "🐾",
};

const g3s6e5_PuntosJuegos: TableScenarioTemplate = {
  scenarioId: "puntos_juegos_g3s6e5",
  tableTitle: "Puntos en Juegos de Mesa",
  columnHeaders: ["Juego", "Puntos"],
  rowCategories: [
    { name: "Ajedrez", valueRange: [100, 500] },
    { name: "Damas", valueRange: [50, 300] },
    { name: "Ludo", valueRange: [20, 150] },
    { name: "Oca", valueRange: [30, 200] },
  ],
  questionTemplates: [
    { id: "q1", type: 'findMinRow' },
    { id: "q2", type: 'compareTwoRows' },
    { id: "q3", type: 'findSpecificValue' },
    { id: "q4", type: 'findMaxRow'},
  ],
  totalStarsPerScenario: 4,
  icon: "🎲",
};


// --- Scenarios for g3-s6-e6: Ubicar en Tabla ---
const g3s6e6ObjetosEscolares: UbicarEnTablaScenarioTemplate = {
  scenarioId: 'objetos_escolares_g3s6e6',
  tableTitle: 'Objetos en el Pupitre',
  gridSize: { rows: 3, cols: 3 },
  possibleItems: ['✏️', '📚', '✂️', '📏', '🎒', '🎨', '🍎', '🍌', '💡'],
  numQuestionsPerScenario: 5, 
  totalStarsPerScenario: 5,
  icon: '✏️',
};

const g3s6e6JuguetesEstantes: UbicarEnTablaScenarioTemplate = {
  scenarioId: 'juguetes_estantes_g3s6e6',
  tableTitle: 'Juguetes en los Estantes',
  gridSize: { rows: 2, cols: 4 },
  possibleItems: ['🧸', '🚗', '⚽️', '🧩', '🪁', '🚂', '🥁', '🚀'],
  numQuestionsPerScenario: 5,
  totalStarsPerScenario: 5,
  icon: '🧸',
};

const g3s6e6AnimalesGranja: UbicarEnTablaScenarioTemplate = {
  scenarioId: 'animales_granja_g3s6e6',
  tableTitle: 'Animales en la Granja',
  gridSize: { rows: 3, cols: 2 },
  possibleItems: ['🐄', '🐖', '🐑', '🐔', '🐎', '🐕'],
  numQuestionsPerScenario: 5,
  totalStarsPerScenario: 5,
  icon: '🐄',
};


// --- Scenarios for g3-s6-e7: Interpretar Tabla Doble Entrada (Avanzado) ---
const g3s6e7VentasHelados: TableDobleEntradaScenarioTemplate = {
  scenarioId: "ventas_helados_dia_sabor",
  tableTitle: "Venta de Helados por Sabor y Día",
  rowHeaders: ["Chocolate", "Fresa", "Vainilla"],
  columnHeaders: ["Sábado", "Domingo"],
  valueAxisLabel: "Helados Vendidos",
  cellValueRange: [5, 25],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue', targetRowName: "Chocolate", targetColName: "Sábado" },
    { id: "q2", type: 'findRowTotal', targetRowName: "Fresa" },
    { id: "q3", type: 'findColumnTotal', targetColName: "Domingo" },
    { id: "q4", type: 'findGrandTotal' },
    { id: "q5", type: 'findCategoryWithMaxInRow', targetRowName: "Vainilla" },
    { id: "q6", type: 'findCategoryWithMinForColumn', targetColName: "Sábado" },
    { id: "q7", type: 'compareTwoCellValues', cell1Coords: {rowName:"Chocolate", colName:"Sábado"}, cell2Coords:{rowName:"Fresa", colName:"Domingo"}}
  ],
  totalStarsPerScenario: 7,
  icon: "🍦",
};

const g3s6e7PuntosDeportes: TableDobleEntradaScenarioTemplate = {
  scenarioId: "puntos_deportes_equipo_partido",
  tableTitle: "Puntos Anotados por Equipo y Partido",
  rowHeaders: ["Equipo Rojo", "Equipo Azul", "Equipo Verde"],
  columnHeaders: ["Partido 1", "Partido 2", "Partido 3"],
  valueAxisLabel: "Puntos",
  cellValueRange: [10, 50],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue' },
    { id: "q2", type: 'findRowTotal' },
    { id: "q3", type: 'findColumnTotal' },
    { id: "q4", type: 'findGrandTotal' },
    { id: "q5", type: 'findCategoryWithMinForColumn' },
    { id: "q6", type: 'findCategoryWithMaxInRow'},
    { id: "q7", type: 'compareTwoCellValues'}
  ],
  totalStarsPerScenario: 7,
  icon: "🏀",
};

const g3s6e7ComidaFavoritaGrado: TableDobleEntradaScenarioTemplate = {
  scenarioId: "comida_favorita_grado",
  tableTitle: "Comida Favorita por Grado",
  rowHeaders: ["Pizza", "Hamburguesa", "Ensalada", "Pasta"],
  columnHeaders: ["3ºA", "3ºB", "3ºC"],
  valueAxisLabel: "Votos",
  cellValueRange: [3, 20],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue' },
    { id: "q2", type: 'findRowTotal' },
    { id: "q3", type: 'findColumnTotal' },
    { id: "q4", type: 'findGrandTotal' },
    { id: "q5", type: 'findCategoryWithMaxInRow' },
    { id: "q6", type: 'findCategoryWithMinForColumn' },
    { id: "q7", type: 'compareTwoCellValues' }
  ],
  totalStarsPerScenario: 7,
  icon: "🍕",
};

const g3s6e7ActividadesExtraGenero: TableDobleEntradaScenarioTemplate = {
  scenarioId: "actividades_extra_genero",
  tableTitle: "Actividades Extraescolares por Género",
  rowHeaders: ["Fútbol", "Danza", "Música", "Arte"],
  columnHeaders: ["Niños", "Niñas"],
  valueAxisLabel: "Inscriptos",
  cellValueRange: [5, 25],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue'},
    { id: "q2", type: 'findRowTotal'},
    { id: "q3", type: 'findColumnTotal'},
    { id: "q4", type: 'findGrandTotal'},
    { id: "q5", type: 'findCategoryWithMaxForColumn', targetColName: "Niños"},
    { id: "q6", type: 'findCategoryWithMinInRow', targetRowName: "Música"},
    { id: "q7", type: 'compareTwoCellValues'}
  ],
  totalStarsPerScenario: 7,
  icon: "⚽",
};

// --- Scenarios for g3-s6-e8: Completar Tabla Datos Faltantes ---
const g3s6e8_FrutasSemana: MissingInfoPuzzleScenarioTemplate = {
  scenarioId: "frutas_semana_faltante_g3s6e8",
  title: "Frutas Vendidas esta Semana",
  rowCategoryHeader: "Fruta",
  dataColumnHeaders: ["Lunes", "Martes"],
  displayRowTotalsColumn: true,
  rowData: [
    { header: "Manzanas", values: [
        { display: "10" },
        { display: "?" , isMissingCell: true },
        { display: "25", isTotalCell: true }
    ]},
    { header: "Peras", values: [
        { display: "12" },
        { display: "8" },
        { display: "20", isTotalCell: true }
    ]},
    { header: "Total Día", isTotalRow: true, values: [
        { display: "22", isTotalCell: true },
        { display: "23", isTotalCell: true },
        { display: "45", isTotalCell: true }
    ]}
  ],
  correctAnswer: 15,
  questionText: "Completa la tabla encontrando cuántas manzanas se vendieron el martes.",
  totalStars: 1,
  icon: "🍎",
  valueUnit: "frutas"
};

const g3s6e8_PuntosEquipos: MissingInfoPuzzleScenarioTemplate = {
  scenarioId: "puntos_equipos_faltante_g3s6e8",
  title: "Puntos por Equipo",
  rowCategoryHeader: "Equipo",
  dataColumnHeaders: ["Partido 1", "Partido 2"],
  displayRowTotalsColumn: true,
  rowData: [
    { header: "Rojos", values: [
        { display: "25" },
        { display: "30" },
        { display: "55", isTotalCell: true }
    ]},
    { header: "Azules", values: [
        { display: "?" , isMissingCell: true },
        { display: "22" },
        { display: "52", isTotalCell: true }
    ]},
    { header: "Total Partido", isTotalRow: true, values: [
        { display: "55", isTotalCell: true },
        { display: "52", isTotalCell: true },
        { display: "107", isTotalCell: true }
    ]}
  ],
  correctAnswer: 30,
  questionText: "¿Cuántos puntos hizo el equipo Azul en el Partido 1?",
  totalStars: 1,
  icon: "🏆",
  valueUnit: "puntos"
};

const g3s6e8_AlumnosActividad: MissingInfoPuzzleScenarioTemplate = {
  scenarioId: "alumnos_actividad_faltante_g3s6e8",
  title: "Alumnos por Actividad",
  rowCategoryHeader: "Actividad",
  dataColumnHeaders: ["Mañana", "Tarde"],
  displayRowTotalsColumn: false, 
  rowData: [
    { header: "Plástica", values: [{ display: "15" }, { display: "12" }] },
    { header: "Música", values: [{ display: "10" }, { display: "?" , isMissingCell: true }] },
    { header: "Total Turno", isTotalRow: true, values: [
        { display: "25", isTotalCell: true }, 
        { display: "30", isTotalCell: true }  
    ]}
  ],
  correctAnswer: 18,
  questionText: "¿Cuántos alumnos van a Música por la tarde?",
  totalStars: 1,
  icon: "🎨",
  valueUnit: "alumnos"
};

// --- Scenarios for g3-s6-e9: Ordenar Datos en Tabla ---
const g3s6e9_PuntajesTorneo: OrdenarDatosEnTablaScenarioTemplate = {
  scenarioId: "puntajes_torneo_g3s6e9",
  title: "Puntajes del Torneo de Videojuegos",
  categoryHeader: "Jugador",
  valueHeader: "Puntaje",
  unsortedData: [
    { name: "Ana", value: 1250 },
    { name: "Luis", value: 1500 },
    { name: "Carlos", value: 980 },
    { name: "Sofía", value: 1820 },
    { name: "Mateo", value: 1100 },
  ],
  sortInstructionText: "Ordena los jugadores de Mayor a Menor Puntaje (Top 3).",
  sortBy: 'value',
  sortOrder: 'desc',
  numItemsToDisplayInTable: 3,
  totalStarsPerScenario: 3, 
  icon: "🏆",
};

const g3s6e9_PesoAnimales: OrdenarDatosEnTablaScenarioTemplate = {
  scenarioId: "peso_animales_g3s6e9",
  title: "Peso de Animales de la Granja",
  categoryHeader: "Animal",
  valueHeader: "Peso (kg)",
  unsortedData: [
    { name: "Vaca Lola", value: 450 },
    { name: "Cerdo Pipo", value: 120 },
    { name: "Oveja Beti", value: 65 },
    { name: "Caballo Rayo", value: 550 },
    { name: "Gallina Cloti", value: 2 },
  ],
  sortInstructionText: "Ordena los animales del Más Liviano al Más Pesado (Todos).",
  sortBy: 'value',
  sortOrder: 'asc',
  numItemsToDisplayInTable: 5,
  totalStarsPerScenario: 5,
  icon: "⚖️",
};

// --- Scenarios for g3-s6-e10: Tablas de Doble Entrada (Introducción) ---
const g3s6e10_BolasColores: TableDobleEntradaScenarioTemplate = {
  scenarioId: "bolas_colores_simple_g3s6e10",
  tableTitle: "Tipos de Pelotas y Colores",
  rowHeaders: ["Básquet", "Fútbol"],
  columnHeaders: ["Rojo", "Azul"],
  valueAxisLabel: "Cantidad",
  cellValueRange: [1, 10],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue', targetRowName: "Básquet", targetColName: "Rojo" },
    { id: "q2", type: 'findSpecificCellValue', targetRowName: "Fútbol", targetColName: "Azul" },
    { id: "q3", type: 'findSpecificCellValue', targetRowName: "Básquet", targetColName: "Azul" },
    { id: "q4", type: 'findSpecificCellValue', targetRowName: "Fútbol", targetColName: "Rojo" },
    { id: "q5", type: 'findRowTotal', targetRowName: "Básquet" }, 
  ],
  totalStarsPerScenario: 5,
  icon: "🏀",
};

const g3s6e10_MascotasTipos: TableDobleEntradaScenarioTemplate = {
  scenarioId: "mascotas_tipos_simple_g3s6e10",
  tableTitle: "Mascotas en Casa",
  rowHeaders: ["Perros", "Gatos"],
  columnHeaders: ["Pequeños", "Grandes"],
  valueAxisLabel: "Número",
  cellValueRange: [0, 8],
  questionTemplates: [
    { id: "q1", type: 'findSpecificCellValue', targetRowName: "Perros", targetColName: "Pequeños" },
    { id: "q2", type: 'findSpecificCellValue', targetRowName: "Gatos", targetColName: "Grandes" },
    { id: "q3", type: 'findColumnTotal', targetColName: "Pequeños" },
    { id: "q4", type: 'findGrandTotal' },
  ],
  totalStarsPerScenario: 4,
  icon: "🐾",
};

// --- Scenarios for g3-s6-e11: Comparando Tablas Simples ---
const g3s6e11_DeportesClases: CompararTablasSimplesScenarioTemplate = {
  scenarioId: "deportes_clases_g3s6e11",
  description: "Compara los deportes favoritos en dos clases.",
  tableA: {
    tableId: "claseA",
    title: "Deportes Favoritos - Clase A",
    categoryHeader: "Deporte",
    valueHeader: "Votos",
    rows: [ { name: "Fútbol", value: 0 }, { name: "Básquet", value: 0 }, { name: "Vóley", value: 0 } ],
  },
  tableB: {
    tableId: "claseB",
    title: "Deportes Favoritos - Clase B",
    categoryHeader: "Deporte",
    valueHeader: "Votos",
    rows: [ { name: "Fútbol", value: 0 }, { name: "Básquet", value: 0 }, { name: "Vóley", value: 0 } ],
  },
  valueRangeForRandomization: [5, 25],
  questionTemplates: [
    { id: "q1", type: 'compareCategoryBetweenTables', targetCategoryName: "Fútbol", comparisonType: 'more' },
    { id: "q2", type: 'findDifferenceForCategory', targetCategoryName: "Básquet" },
    { id: "q3", type: 'whichTableHasMaxForCategory', targetCategoryName: "Vóley"},
    { id: "q4", type: 'whichTableHasMaxOverall'},
  ],
  totalStarsPerScenario: 4,
  icon: "🏆",
};

const g3s6e11_VentasTiendas: CompararTablasSimplesScenarioTemplate = {
  scenarioId: "ventas_tiendas_g3s6e11",
  description: "Compara las ventas de frutas en dos tiendas.",
  tableA: {
    tableId: "tiendaNorte", title: "Ventas Frutas - Tienda Norte", categoryHeader: "Fruta", valueHeader: "Kilos",
    rows: [ { name: "Manzanas", value: 0 }, { name: "Bananas", value: 0 }, { name: "Naranjas", value: 0 } ],
  },
  tableB: {
    tableId: "tiendaSur", title: "Ventas Frutas - Tienda Sur", categoryHeader: "Fruta", valueHeader: "Kilos",
    rows: [ { name: "Manzanas", value: 0 }, { name: "Bananas", value: 0 }, { name: "Naranjas", value: 0 } ],
  },
  valueRangeForRandomization: [10, 50],
  questionTemplates: [
    { id: "q1", type: 'compareCategoryBetweenTables', targetCategoryName: "Manzanas", comparisonType: 'less' },
    { id: "q2", type: 'findDifferenceForCategory', targetCategoryName: "Naranjas" },
    { id: "q3", type: 'whichTableHasMinOverall'},
  ],
  totalStarsPerScenario: 3,
  icon: "🍎",
};

// --- Scenarios for g3-s6-e12: Interpretar Diagrama Lineal Simple ---
const g3s6e12_TemperaturaSemanal: LinealChartScenarioTemplate = {
  scenarioId: "temp_semanal_g3s6e12",
  chartTitle: "Temperatura Máxima Semanal",
  xAxisLabel: "Día de la Semana",
  yAxisLabel: "Temperatura (°C)",
  dataPoints: [
    { xLabel: "Lun", yValue: 22 }, { xLabel: "Mar", yValue: 25 }, { xLabel: "Mié", yValue: 23 },
    { xLabel: "Jue", yValue: 26 }, { xLabel: "Vie", yValue: 28 }, { xLabel: "Sáb", yValue: 30 },
    { xLabel: "Dom", yValue: 27 },
  ],
  questionTemplates: [
    { id: "q1", type: 'findSpecificYValue', targetXLabel1: "Mar" }, { id: "q2", type: 'findMaxYValue' },
    { id: "q3", type: 'findMinYValue' }, { id: "q4", type: 'calculateDifferenceBetweenTwoYValues', targetXLabel1: "Vie", targetXLabel2: "Lun" },
    { id: "q5", type: 'describeTrend', targetXLabel1: "Jue", targetXLabel2: "Vie" },
  ],
  totalStarsPerScenario: 5, icon: "🌡️", yAxisValueStep: 5,
};

const g3s6e12_CrecimientoPlanta: LinealChartScenarioTemplate = {
  scenarioId: "crecimiento_planta_g3s6e12",
  chartTitle: "Crecimiento de una Planta",
  xAxisLabel: "Semana",
  yAxisLabel: "Altura (cm)",
  dataPoints: [
    { xLabel: "S1", yValue: 5 }, { xLabel: "S2", yValue: 8 }, { xLabel: "S3", yValue: 12 },
    { xLabel: "S4", yValue: 15 }, { xLabel: "S5", yValue: 17 },
  ],
  questionTemplates: [
    { id: "q1", type: 'findSpecificYValue', targetXLabel1: "S3" }, { id: "q2", type: 'findMinYValue' },
    { id: "q3", type: 'describeTrend', targetXLabel1: "S1", targetXLabel2: "S2" },
    { id: "q4", type: 'calculateDifferenceBetweenTwoYValues', targetXLabel1: "S5", targetXLabel2: "S1"},
    { id: "q5", type: 'findTotalYValue' }
  ],
  totalStarsPerScenario: 5, icon: "🌱", yAxisValueStep: 5,
};

// --- Scenarios for g3-s6-e13 & g3-s6-e14: Interpretar Diagrama Dos Líneas ---
const g3s6e13_VentasProductos: MultiLineChartScenarioTemplate = {
  scenarioId: "ventas_productos_g3s6e13",
  chartTitle: "Ventas de Dos Productos",
  xAxisLabel: "Mes",
  yAxisLabel: "Unidades Vendidas",
  series: [
    { name: "Producto A", points: [
        { xLabel: "Ene", yValue: 150 }, { xLabel: "Feb", yValue: 170 }, { xLabel: "Mar", yValue: 160 },
        { xLabel: "Abr", yValue: 180 }, { xLabel: "May", yValue: 200 },
      ], color: "blue-500"
    },
    { name: "Producto B", points: [
        { xLabel: "Ene", yValue: 120 }, { xLabel: "Feb", yValue: 140 }, { xLabel: "Mar", yValue: 165 },
        { xLabel: "Abr", yValue: 170 }, { xLabel: "May", yValue: 190 },
      ], color: "green-500"
    },
  ],
  questionTemplates: [
    { id: "q1", type: 'findYValueForLineAndX', targetLineName1: "Producto A", targetXLabel: "Mar" },
    { id: "q2", type: 'whichLineHasMaxYAtX', targetXLabel: "Feb" },
    { id: "q3", type: 'findDifferenceBetweenLinesAtX', targetXLabel: "Abr" },
    { id: "q4", type: 'describeOverallTrendForLine', targetLineName1: "Producto B", targetXLabelStart: "Ene", targetXLabelEnd: "May" },
  ],
  totalStarsPerScenario: 4, icon: "📈", yAxisValueStep: 50,
};

const g3s6e13_AhorrosAmigos: MultiLineChartScenarioTemplate = {
  scenarioId: "ahorros_amigos_g3s6e13",
  chartTitle: "Ahorros Mensuales de Dos Amigos",
  xAxisLabel: "Mes",
  yAxisLabel: "Ahorro ($)",
  series: [
    { name: "Ana", points: [
        { xLabel: "Ene", yValue: 50 }, { xLabel: "Feb", yValue: 60 }, { xLabel: "Mar", yValue: 55 },
        { xLabel: "Abr", yValue: 70 }, { xLabel: "May", yValue: 75 },
      ], color: "pink-500"
    },
    { name: "Luis", points: [
        { xLabel: "Ene", yValue: 40 }, { xLabel: "Feb", yValue: 50 }, { xLabel: "Mar", yValue: 65 },
        { xLabel: "Abr", yValue: 60 }, { xLabel: "May", yValue: 80 },
      ], color: "purple-500"
    },
  ],
  questionTemplates: [
    { id: "q1", type: 'findYValueForLineAndX', targetLineName1: "Luis", targetXLabel: "Mar" },
    { id: "q2", type: 'whichLineHasMinYAtX', targetXLabel: "Abr" },
    { id: "q3", type: 'findDifferenceBetweenLinesAtX', targetXLabel: "May" },
    { id: "q4", type: 'compareOverallTrends', targetXLabelStart: "Ene", targetXLabelEnd: "May" },
  ],
  totalStarsPerScenario: 4, icon: "💰", yAxisValueStep: 20,
};

// Scenarios for Bar Charts (g3-s6-e1, g3-s6-e2)
const g3s6e1_frutasFavoritasVertical: BarChartScenarioTemplate = {
  scenarioId: "frutas_favoritas_vertical_g3s6e1",
  chartTitle: "Frutas Favoritas",
  yAxisLabel: "Cantidad de Votos",
  categories: [
    { name: "Manzana", valueRange: [5, 20], color: "bg-red-500" },
    { name: "Banana", valueRange: [10, 25], color: "bg-yellow-400" },
    { name: "Naranja", valueRange: [3, 18], color: "bg-orange-500" },
  ],
  questionTemplates: [ { id: "q1", type: 'findMax' }, { id: "q2", type: 'findSpecific' }, { id: "q3", type: 'findMin' } ],
  totalStarsPerScenario: 3,
};

const g3s6e2_deportesPreferidosHorizontal: BarChartScenarioTemplate = {
  scenarioId: "deportes_preferidos_horizontal_g3s6e2",
  chartTitle: "Deportes Preferidos",
  yAxisLabel: "Número de Estudiantes", // This is the value axis label
  categories: [
    { name: "Fútbol", valueRange: [8, 22], color: "bg-green-600" },
    { name: "Básquet", valueRange: [5, 15], color: "bg-orange-600" },
    { name: "Vóley", valueRange: [3, 12], color: "bg-purple-500" },
  ],
  questionTemplates: [ { id: "q1", type: 'findSpecific' }, { id: "q2", type: 'compareTwo' }, { id: "q3", type: 'findTotal' } ],
  totalStarsPerScenario: 3,
};

// Example Bar Chart Scenarios for g3-s6-e3, g3-s6-e4 (reused from before)
const barChartScenarioMascotas: BarChartScenarioTemplate = {
  scenarioId: "mascotas_populares_g3s6e3",
  chartTitle: "Mascotas Más Populares",
  yAxisLabel: "Cantidad de Niños",
  categories: [
    { name: "Perros", valueRange: [10, 30], color: "bg-blue-500" },
    { name: "Gatos", valueRange: [8, 25], color: "bg-pink-500" },
    { name: "Pájaros", valueRange: [3, 15], color: "bg-green-500" },
    { name: "Peces", valueRange: [5, 20], color: "bg-yellow-500" },
  ],
  questionTemplates: [
    { id: "q1", type: 'findMax' }, { id: "q2", type: 'findMin' },
    { id: "q3", type: 'findSpecific' }, { id: "q4", type: 'compareTwo' },
    { id: "q5", type: 'findTotal' },
  ],
  totalStarsPerScenario: 5,
};

const barChartScenarioColores: BarChartScenarioTemplate = {
  scenarioId: "colores_favoritos_g3s6e4",
  chartTitle: "Colores Favoritos de la Clase",
  yAxisLabel: "Votos",
  categories: [
    { name: "Azul", valueRange: [5, 15], color: "bg-sky-500" },
    { name: "Rojo", valueRange: [4, 12], color: "bg-red-400" },
    { name: "Verde", valueRange: [6, 18], color: "bg-lime-500" },
    { name: "Amarillo", valueRange: [2, 10], color: "bg-yellow-200" },
  ],
  questionTemplates: [
    { id: "q1", type: 'findMax' }, { id: "q2", type: 'findMin' },
    { id: "q3", type: 'findSpecific' }, { id: "q4", type: 'compareTwo' },
  ],
  totalStarsPerScenario: 4,
};


export const thirdGradeEstadisticaExercises: Exercise[] = [
    { 
      id: 'g3-s6-e1', 
      title: 'Interpretar Diagramas de Barras Verticales', 
      description: 'Interpreta gráficos de barras verticales y responde preguntas.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS,
      data: { 
        scenarios: [g3s6e1_frutasFavoritasVertical],
        fixedOrientation: 'vertical',              
        totalStars: g3s6e1_frutasFavoritasVertical.totalStarsPerScenario 
      }, 
      question: 'Observa el gráfico y responde las preguntas:',
    },
    { 
      id: 'g3-s6-e2', 
      title: 'Extraer datos de diagramas horizontales de barras.', 
      description: 'Interpreta gráficos de barras horizontales y responde preguntas.', 
      iconName: 'StatisticsIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS, 
      data: { 
        scenarios: [g3s6e2_deportesPreferidosHorizontal], 
        fixedOrientation: 'horizontal',                  
        totalStars: g3s6e2_deportesPreferidosHorizontal.totalStarsPerScenario
      }, 
      question: 'Observa el gráfico horizontal y responde:',
    },
    { 
      id: 'g3-s6-e3', 
      title: 'Test: Diagramas de Barras (Mixto)', 
      description: 'Pon a prueba tu habilidad para leer gráficos de barras verticales y horizontales.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS,
      data: { scenarios: [barChartScenarioMascotas], totalStars: barChartScenarioMascotas.totalStarsPerScenario }, 
      question: 'Interpreta el gráfico (vertical u horizontal) y responde:',
    },
    { 
      id: 'g3-s6-e4', 
      title: 'Más Test: Diagramas de Barras (Variados)', 
      description: 'Más práctica con interpretación de gráficos de barras verticales y horizontales.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS,
      data: { scenarios: [barChartScenarioColores, barChartScenarioMascotas], totalStars: barChartScenarioColores.totalStarsPerScenario + barChartScenarioMascotas.totalStarsPerScenario }, 
      question: 'Analiza el gráfico y contesta las preguntas:',
    },
    { 
      id: 'g3-s6-e5', 
      title: 'Extraer datos de tablas.', 
      description: 'Interpreta información en tablas simples y responde preguntas.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE,
      data: [g3s6e5_AnimalesFavoritos, g3s6e5_PuntosJuegos], // ADDED SCENARIOS
      question: 'Observa la tabla y responde:',
    },
    { 
      id: 'g3-s6-e6', 
      title: '¿Dónde Está? Ubicar en la Tabla', 
      description: 'Encuentra objetos o figuras usando filas y columnas.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.UBICAR_EN_TABLA,
      data: [g3s6e6ObjetosEscolares, g3s6e6JuguetesEstantes, g3s6e6AnimalesGranja], 
      question: 'Observa la tabla y responde:',
      content: 'Practica la ubicación de elementos en una tabla usando coordenadas de fila y columna.'
    },
    { 
      id: 'g3-s6-e7', 
      title: 'Tablas de Doble Entrada (Avanzado)', 
      description: 'Interpreta tablas de doble entrada complejas y variadas.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.INTERPRETAR_TABLA_DOBLE_ENTRADA,
      data: [g3s6e7VentasHelados, g3s6e7PuntosDeportes, g3s6e7ComidaFavoritaGrado, g3s6e7ActividadesExtraGenero],
      question: 'Analiza la tabla de doble entrada y responde:',
      content: 'Practica la lectura e interpretación de datos en tablas de doble entrada.'
    },
    { 
      id: 'g3-s6-e8', 
      title: 'Puzzles de Tablas (Info Faltante)', 
      description: 'Deduce la información que falta en una tabla.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.COMPLETAR_TABLA_DATOS_FALTANTES,
      data: [g3s6e8_FrutasSemana, g3s6e8_PuntosEquipos, g3s6e8_AlumnosActividad], 
      question: 'Calcula el valor que falta en la tabla:',
      content: 'Usa los datos y totales para encontrar el número misterioso en la tabla.'
    },
    { 
      id: 'g3-s6-e9', 
      title: 'Ordenar Datos en Tabla', 
      description: 'Organiza información en una tabla según un criterio.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.ORDENAR_DATOS_EN_TABLA,
      data: [g3s6e9_PuntajesTorneo, g3s6e9_PesoAnimales], 
      question: 'Ordena los datos en la tabla como se indica:',
      content: 'Arrastra o selecciona los elementos para ordenarlos correctamente en la tabla.'
    },
    { 
      id: 'g3-s6-e10', 
      title: 'Tablas de Doble Entrada (Introducción)', 
      description: 'Interpreta tablas de doble entrada simples.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.INTERPRETAR_TABLA_DOBLE_ENTRADA, 
      data: [g3s6e10_BolasColores, g3s6e10_MascotasTipos], 
      question: 'Observa la tabla y responde:',
      content: 'Aprende a leer tablas de doble entrada con ejemplos sencillos.'
    },
    { 
      id: 'g3-s6-e11', 
      title: 'Comparando Tablas Simples', 
      description: 'Compara información entre dos tablas simples.', 
      iconName: 'StatisticsIcon', 
      isLocked: false,
      componentType: ExerciseComponentType.COMPARAR_TABLAS_SIMPLES,
      data: [g3s6e11_DeportesClases, g3s6e11_VentasTiendas], 
      question: 'Compara las tablas y responde:',
      content: 'Analiza dos tablas y responde preguntas que comparan sus datos.'
    },
    { 
      id: 'g3-s6-e12', 
      title: 'Extraer datos de diagramas lineales.', 
      description: 'Interpreta gráficos lineales simples.', 
      iconName: 'StatisticsIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.INTERPRETAR_DIAGRAMA_LINEAL_SIMPLE,
      data: [g3s6e12_TemperaturaSemanal, g3s6e12_CrecimientoPlanta],
      question: 'Observa el diagrama lineal y responde:',
    },
    { 
      id: 'g3-s6-e13', 
      title: 'Extraer datos de diagramas con dos líneas.', 
      description: 'Interpreta gráficos con dos líneas y compara datos.', 
      iconName: 'StatisticsIcon', 
      isLocked: false, 
      componentType: ExerciseComponentType.INTERPRETAR_DIAGRAMA_DOS_LINEAS,
      data: [g3s6e13_VentasProductos, g3s6e13_AhorrosAmigos],
      question: 'Observa el diagrama de dos líneas y responde:',
    },
    { 
      id: 'g3-s6-e14', 
      title: 'Más diagramas con dos líneas.', 
      description: 'Más interpretación de gráficos multilínea.', 
      iconName: 'StatisticsIcon',
      isLocked: false, 
      componentType: ExerciseComponentType.INTERPRETAR_DIAGRAMA_DOS_LINEAS, 
      data: [g3s6e13_AhorrosAmigos, g3s6e13_VentasProductos], 
      question: 'Analiza el gráfico de dos líneas y responde:',
    },
];
