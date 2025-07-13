
import { Exercise, ExerciseComponentType, OriginalIconName, PictogramScenarioTemplate } from './types';

// --- Scenarios for Pictogram Exercises ---

const pictogramScenarioFrutas: PictogramScenarioTemplate = {
  scenarioId: "frutas_favoritas_g1s6",
  title: "Frutas Favoritas",
  keyLabelTemplate: "Cada {ICONO} representa 1 fruta",
  itemTypeSingular: "fruta",
  itemTypePlural: "frutas",
  items: [
    { category: "Manzanas", icon: "🍎", valueRange: [2, 5] },
    { category: "Bananas", icon: "🍌", valueRange: [1, 4] },
    { category: "Naranjas", icon: "🍊", valueRange: [2, 6] },
  ],
  questionTemplates: [
    { id: "q1", type: 'count_specific', targetCategory1: "Manzanas" },
    { id: "q2", type: 'find_max' },
    { id: "q3", type: 'find_min' },
    { id: "q4", type: 'count_total' },
  ],
  totalStarsPerScenario: 4,
  icon: "📊",
};

const pictogramScenarioJuguetes: PictogramScenarioTemplate = {
  scenarioId: "juguetes_clase_g1s6",
  title: "Juguetes en la Clase",
  keyLabelTemplate: "Cada {ICONO} representa 1 juguete",
  itemTypeSingular: "juguete",
  itemTypePlural: "juguetes",
  items: [
    { category: "Pelotas", icon: "⚽", valueRange: [3, 6] },
    { category: "Autos", icon: "🚗", valueRange: [2, 5] },
    { category: "Muñecas", icon: "🧸", valueRange: [1, 4] },
  ],
  questionTemplates: [
    { id: "q1", type: 'count_specific', targetCategory1: "Autos" },
    { id: "q2", type: 'find_max' },
    { id: "q3", type: 'compare_two', targetCategory1: "Pelotas", targetCategory2: "Muñecas"},
    { id: "q4", type: 'count_total'},
  ],
  totalStarsPerScenario: 4,
  icon: "🎲",
};

const pictogramScenarioMascotas: PictogramScenarioTemplate = {
  scenarioId: "mascotas_casa_g1s6",
  title: "Mascotas en Casa",
  keyLabelTemplate: "Cada {ICONO} representa 1 mascota",
  itemTypeSingular: "mascota",
  itemTypePlural: "mascotas",
  items: [
    { category: "Perros", icon: "🐶", valueRange: [1, 4] },
    { category: "Gatos", icon: "🐱", valueRange: [2, 5] },
    { category: "Peces", icon: "🐠", valueRange: [3, 7] },
  ],
  questionTemplates: [
    { id: "q1", type: 'count_specific', targetCategory1: "Peces" },
    { id: "q2", type: 'find_min' },
    { id: "q3", type: 'compare_two', targetCategory1: "Gatos", targetCategory2: "Perros"},
    { id: "q4", type: 'count_total'},
  ],
  totalStarsPerScenario: 4,
  icon: "🐾",
};


export const firstGradeEstadisticaExercises: Exercise[] = [
  { 
    id: 'g1-s6-e1', 
    title: 'Contando con Dibujos', 
    description: 'Interpreta pictogramas simples y responde preguntas.', 
    iconName: 'StatisticsIcon' as OriginalIconName, 
    isLocked: false,
    componentType: ExerciseComponentType.INTERPRETAR_PICTOGRAMAS,
    data: { 
      scenarios: [pictogramScenarioFrutas, pictogramScenarioJuguetes], // Array of scenarios for this exercise
      overallTotalStars: 8, // Total stars for completing this exercise (e.g. 2 scenarios * 4 stars each)
    }, 
    question: 'Observa los dibujos y responde:',
  },
  { 
    id: 'g1-s6-e2', 
    title: 'Más Dibujos para Contar', 
    description: 'Practica la interpretación de pictogramas con más ejemplos.', 
    iconName: 'StatisticsIcon' as OriginalIconName, 
    isLocked: false, 
    componentType: ExerciseComponentType.INTERPRETAR_PICTOGRAMAS, 
    data: { 
      scenarios: [pictogramScenarioMascotas, pictogramScenarioJuguetes], // Can reuse or add new scenarios
      overallTotalStars: 8,
    }, 
    question: 'Mira los dibujos y cuenta:',
  },
];
