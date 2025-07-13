import { GradeData, SubjectData, GradeLevel, SubjectId, ExerciseComponentType, OriginalIconName } from "@/types";
import { createExercise } from "@/utils/exerciseUtils"; 

// Import new grade-specific aggregated data
import { grade1ExerciseData } from "@/grade1Constants";
import { grade2ExerciseData } from "@/grade2Constants";
import { grade3ExerciseData } from "@/grade3Constants";
import { grade4ExerciseData } from "@/grade4Constants"; 
import { grade5ExerciseData } from "@/grade5Constants";

export const GRADES_CONFIG: Omit<GradeData, 'subjects'>[] = [
  { id: 1, name: "1er Grado", longName: "PRIMERO", themeColor: "bg-red-500" },
  { id: 2, name: "2do Grado", longName: "SEGUNDO", themeColor: "bg-orange-500" },
  { id: 3, name: "3er Grado", longName: "TERCERO", themeColor: "bg-yellow-500" },
  { id: 4, name: "4to Grado", longName: "CUARTO", themeColor: "bg-green-500" },
  { id: 5, name: "5to Grado", longName: "QUINTO", themeColor: "bg-blue-500" },
  { id: 6, name: "6to Grado", longName: "SEXTO", themeColor: "bg-purple-500" },
];

interface ExerciseTemplateData {
  title: string;
  description: string;
  iconName?: OriginalIconName;
}

interface SubjectTemplate {
  id: SubjectId;
  name: string;
  iconName: OriginalIconName;
  subjectThemeColor: string; 
  exerciseTemplates: ExerciseTemplateData[]; 
}

const SUBJECTS_TEMPLATES: SubjectTemplate[] = [
  {
    id: SubjectId.NUMEROS, name: 'Números', iconName: 'NumbersIcon', subjectThemeColor: 'bg-sky-500', exerciseTemplates: [
      { title: 'Contar y Escribir', description: 'Aprende los números.' },
      { title: 'Comparar Números', description: 'Mayor, menor o igual.' },
      { title: 'Valor Posicional', description: 'Unidades, decenas, centenas.' },
      { title: 'Ordenar Números', description: 'De menor a mayor y viceversa.' },
      { title: 'Redondear Números', description: 'Aproxima a la decena o centena.' },
      { title: 'Números Ordinales', description: 'Primero, segundo, tercero...' },
      { title: 'Pares e Impares', description: 'Identifica números pares e impares.' },
      { title: 'Dobles y Mitades', description: 'Calcula el doble y la mitad.' },
      { title: 'Fracciones Simples', description: 'Introduce las fracciones.' },
      { title: 'Números Romanos', description: 'Conoce los números romanos.'},
      { title: 'Múltiplos y Divisores', description: 'Conceptos básicos.'},
    ]
  },
  {
    id: SubjectId.OPERACIONES, name: 'Operaciones', iconName: 'OperationsIcon', subjectThemeColor: 'bg-emerald-500', exerciseTemplates: [
      { title: 'Sumas Simples', description: 'Practica sumas sin llevar.' },
      { title: 'Restas Simples', description: 'Practica restas sin prestar.' },
      { title: 'Sumas con Llevada', description: 'Sumas más complejas.' },
      { title: 'Restas con Llevada', description: 'Restas más complejas.' },
      { title: 'Introducción a Multiplicar', description: 'Concepto de multiplicación.' },
      { title: 'Tablas de Multiplicar', description: 'Aprende las tablas.' },
      { title: 'Introducción a Dividir', description: 'Concepto de división.' },
      { title: 'División con Resto', description: 'Divisiones que no son exactas.' },
      { title: 'Operaciones Combinadas', description: 'Mezcla de sumas y restas.' },
    ]
  },
  {
    id: SubjectId.PROBLEMAS, name: 'Problemas', iconName: 'ProblemsIcon', subjectThemeColor: 'bg-amber-500', exerciseTemplates: [
      { title: 'Problemas de Suma', description: 'Resuelve problemas sumando.' },
      { title: 'Problemas de Resta', description: 'Resuelve problemas restando.' },
      { title: 'Problemas Mixtos', description: 'Problemas con varias operaciones.' },
      { title: 'Problemas con Multiplicación', description: 'Aplica la multiplicación.'},
      { title: 'Problemas con División', description: 'Aplica la división.'},
    ]
  },
  {
    id: SubjectId.MEDIDAS, name: 'Medidas', iconName: 'MeasureIcon', subjectThemeColor: 'bg-rose-500', exerciseTemplates: [
      { title: 'Longitud (cm, m, km)', description: 'Mide y convierte longitudes.' },
      { title: 'Peso (kg, g, t)', description: 'Compara y convierte pesos.' },
      { title: 'Capacidad (l, ml, kl)', description: 'Compara y convierte capacidades.' },
      { title: 'Tiempo (horas, minutos, segundos)', description: 'Aprende a leer el reloj y calcular tiempo.' },
      { title: 'Dinero', description: 'Operaciones con dinero.' },
      { title: 'Perímetro y Área', description: 'Calcula el contorno y la superficie.'},
      { title: 'Volumen (introducción)', description: 'Concepto de volumen.'},
    ]
  },
  {
    id: SubjectId.GEOMETRIA, name: 'Geometría', iconName: 'GeometryIcon', subjectThemeColor: 'bg-indigo-500', exerciseTemplates: [
      { title: 'Figuras Planas', description: 'Círculo, cuadrado, triángulo.' },
      { title: 'Tipos de líneas', description: 'Recta, curva, quebrada.' },
      { title: 'Cuerpos Geométricos', description: 'Cubo, esfera, cono.' },
      { title: 'Ángulos', description: 'Reconoce tipos de ángulos.' },
      { title: 'Clasificación de Triángulos', description: 'Por lados y ángulos.'},
      { title: 'Polígonos', description: 'Identifica polígonos por sus lados.'},
      { title: 'Simetría', description: 'Ejes de simetría.'},
    ]
  },
  {
    id: SubjectId.ESTADISTICA, name: 'Estadística', iconName: 'StatisticsIcon', subjectThemeColor: 'bg-teal-500', exerciseTemplates: [
      { title: 'Gráficos de Barras', description: 'Interpreta datos en gráficos.' },
      { title: 'Tablas Simples', description: 'Organiza información en tablas.' },
      { title: 'Tablas de Frecuencia', description: 'Crea y lee tablas de frecuencia.'},
      { title: 'Media, Moda, Rango', description: 'Calcula medidas estadísticas.'},
    ]
  },
  {
    id: SubjectId.PROBABILIDAD, name: 'Probabilidad', iconName: 'ProbabilityIcon', subjectThemeColor: 'bg-lime-500', exerciseTemplates: [
      { title: 'Posible e Imposible', description: '¿Qué puede pasar?' },
      { title: 'Juegos de Azar', description: 'Calcula probabilidades simples.' },
      { title: 'Expresar Probabilidad', description: 'Con fracciones y porcentajes.'},
    ]
  },
];


const _generateSubjectsForGrade = (grade: GradeLevel): SubjectData[] => {
  return SUBJECTS_TEMPLATES.map((subjectTemplate, subjectIndex) => {
    const exercises = subjectTemplate.exerciseTemplates.map((exTemplate, exIndex) => {
      const isLocked = false; 
      return createExercise(
        grade,
        subjectIndex,
        exIndex,
        exTemplate.title,
        exTemplate.description,
        isLocked, 
        ExerciseComponentType.GENERIC, // Default, specific components will override
        {},
        undefined,
        exTemplate.iconName || 'BookOpenIcon'
      );
    });
    return {
      id: subjectTemplate.id,
      name: subjectTemplate.name,
      iconName: subjectTemplate.iconName,
      subjectThemeColor: subjectTemplate.subjectThemeColor,
      exercises,
    };
  });
};

export const getGradeData = (gradeId: GradeLevel): GradeData | undefined => {
  const gradeConfig = GRADES_CONFIG.find(g => g.id === gradeId);
  if (!gradeConfig) return undefined;

  let subjects = _generateSubjectsForGrade(gradeId); 

  // Apply grade-specific exercise data where available
  let specificGradeData;
  if (gradeId === 1) specificGradeData = grade1ExerciseData;
  else if (gradeId === 2) specificGradeData = grade2ExerciseData;
  else if (gradeId === 3) specificGradeData = grade3ExerciseData;
  else if (gradeId === 4) specificGradeData = grade4ExerciseData;
  else if (gradeId === 5) specificGradeData = grade5ExerciseData;

  if (specificGradeData) {
    subjects = subjects.map(subject => {
      const specificExercises = specificGradeData[subject.id];
      // If specific exercises exist for this subject, use them. Otherwise, keep the templated ones.
      return specificExercises ? { ...subject, exercises: specificExercises } : subject;
    });
  }
  
  return {
    ...gradeConfig,
    subjects,
  };
};
