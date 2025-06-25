
import { Exercise, ExerciseComponentType, OriginalIconName, PictogramScenarioTemplate, TableScenarioTemplate } from './types';

const pictogramScenarioAnimalesG2: PictogramScenarioTemplate = {
  scenarioId: "animales_granja_g2s6",
  title: "Animales en la Granja",
  keyLabelTemplate: "Cada {ICONO} representa 1 animal",
  itemTypeSingular: "animal",
  itemTypePlural: "animales",
  items: [
    { category: "Vacas", icon: "🐄", valueRange: [2, 4] },
    { category: "Cerdos", icon: "🐖", valueRange: [1, 3] },
    { category: "Gallinas", icon: "🐔", valueRange: [3, 5] },
  ],
  questionTemplates: [
    { id: "q1", type: 'count_specific', targetCategory1: "Vacas" },
    { id: "q2", type: 'find_max' },
    { id: "q3", type: 'count_total' },
  ],
  totalStarsPerScenario: 3,
  icon: "🚜",
};

// Scenarios for g2-s6-e2: Tablas Simples: ¿Cuántos Hay?
const g2s6e2_JuguetesEstantes: TableScenarioTemplate = {
  scenarioId: "juguetes_estantes_g2s6e2",
  tableTitle: "Juguetes en Estantes",
  columnHeaders: ["Juguete", "Cantidad"],
  rowCategories: [
    { name: "Pelotas", valueRange: [2, 5] },
    { name: "Autos", valueRange: [1, 4] },
    { name: "Muñecas", valueRange: [1, 3] },
  ],
  questionTemplates: [
    { id: "q1", type: 'findSpecificValue' }, // Will randomly pick a category
    { id: "q2", type: 'findMaxRow' },
    { id: "q3", type: 'findSpecificValue' }, // Will randomly pick another category
  ],
  totalStarsPerScenario: 3,
  icon: "🧸",
};

const g2s6e2_AnimalesParque: TableScenarioTemplate = {
  scenarioId: "animales_parque_g2s6e2",
  tableTitle: "Animales en el Parque",
  columnHeaders: ["Animal", "Vistos"],
  rowCategories: [
    { name: "Perros", valueRange: [3, 6] },
    { name: "Pájaros", valueRange: [2, 7] },
    { name: "Mariposas", valueRange: [1, 5] },
  ],
  questionTemplates: [
    { id: "q1", type: 'findSpecificValue' },
    { id: "q2", type: 'findMinRow' },
    { id: "q3", type: 'findSpecificValue' },
  ],
  totalStarsPerScenario: 3,
  icon: "🏞️",
};


export const secondGradeEstadisticaExercises: Exercise[] = [
  { 
    id: 'g2-s6-e1', 
    title: 'Contar en Gráficos Simples', 
    description: 'Interpreta pictogramas y responde cuántos hay de cada elemento.', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.INTERPRETAR_PICTOGRAMAS,
    data: { 
        scenarios: [pictogramScenarioAnimalesG2],
        overallTotalStars: pictogramScenarioAnimalesG2.totalStarsPerScenario,
    },
    question: 'Observa el pictograma y responde:',
  },
  { 
    id: 'g2-s6-e2', 
    title: 'Tablas Simples: ¿Cuántos Hay?', 
    description: 'Lee información de tablas sencillas para contar elementos.', 
    iconName: 'StatisticsIcon', isLocked: false, 
    componentType: ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE,
    data: [g2s6e2_JuguetesEstantes, g2s6e2_AnimalesParque],
    question: 'Mira la tabla y cuenta:',
  },
];