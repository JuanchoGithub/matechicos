
import { GradeData, SubjectData, GradeLevel, SubjectId, Exercise, ExerciseComponentType, OriginalIconName } from './types';
import { createExercise } from '../utils/exerciseUtils'; 

// Import new grade-specific aggregated data
import { grade1ExerciseData } from './grade1Constants';
import { grade2ExerciseData } from './grade2Constants'; // Added import for 2nd grade
import { grade3ExerciseData } from './grade3Constants';

export const GRADES_CONFIG: Omit<GradeData, 'subjects'>[] = [
  { id: 1, name: "1er Grado", longName: "PRIMERO", themeColor: "bg-red-500" },
  { id: 2, name: "2do Grado", longName: "SEGUNDO", themeColor: "bg-orange-500" },
  { id: 3, name: "3er Grado", longName: "TERCERO", themeColor: "bg-yellow-500" },
  { id: 4, name: "4to Grado", longName: "CUARTO", themeColor: "bg-green-500" },
  { id: 5, name: "5to Grado", longName: "QUINTO", themeColor: "bg-blue-500" },
  { id: 6, name: "6to Grado", longName: "SEXTO", themeColor: "bg-purple-500" },
];

// SUBJECTS_TEMPLATES is now defined locally within this file
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
      // Generic templates, will be overridden by grade-specific data if available
      { title: 'Contar y Escribir', description: 'Aprende los números.' },
      { title: 'Comparar Números', description: 'Mayor, menor o igual.' },
      { title: 'Valor Posicional', description: 'Unidades, decenas, centenas.' },
      { title: 'Ordenar Números', description: 'De menor a mayor y viceversa.' },
      { title: 'Redondear Números', description: 'Aproxima a la decena o centena.' },
      { title: 'Números Ordinales', description: 'Primero, segundo, tercero...' },
      { title: 'Pares e Impares', description: 'Identifica números pares e impares.' },
      { title: 'Dobles y Mitades', description: 'Calcula el doble y la mitad.' },
      { title: 'Fracciones Simples', description: 'Introduce las fracciones.' },
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
    ]
  },
  {
    id: SubjectId.PROBLEMAS, name: 'Problemas', iconName: 'ProblemsIcon', subjectThemeColor: 'bg-amber-500', exerciseTemplates: [
      { title: 'Problemas de Suma', description: 'Resuelve problemas sumando.' },
      { title: 'Problemas de Resta', description: 'Resuelve problemas restando.' },
      { title: 'Problemas Mixtos', description: 'Problemas con varias operaciones.' },
    ]
  },
  {
    id: SubjectId.MEDIDAS, name: 'Medidas', iconName: 'MeasureIcon', subjectThemeColor: 'bg-rose-500', exerciseTemplates: [
      { title: 'Longitud (cm, m)', description: 'Mide objetos.' },
      { title: 'Peso (kg, g)', description: 'Compara pesos.' },
      { title: 'Capacidad (l, ml)', description: 'Compara capacidades.' },
      { title: 'Tiempo (horas, minutos)', description: 'Aprende a leer el reloj.' },
      { title: 'Dinero (monedas)', description: 'Cuenta monedas.' },
    ]
  },
  {
    id: SubjectId.GEOMETRIA, name: 'Geometría', iconName: 'GeometryIcon', subjectThemeColor: 'bg-indigo-500', exerciseTemplates: [
      { title: 'Figuras Planas', description: 'Círculo, cuadrado, triángulo.' },
      { title: 'Tipos de líneas', description: 'Recta, curva, quebrada.' },
      { title: 'Cuerpos Geométricos', description: 'Cubo, esfera, cono.' },
    ]
  },
  {
    id: SubjectId.ESTADISTICA, name: 'Estadística', iconName: 'StatisticsIcon', subjectThemeColor: 'bg-teal-500', exerciseTemplates: [
      { title: 'Gráficos de Barras', description: 'Interpreta datos en gráficos.' },
      { title: 'Tablas Simples', description: 'Organiza información en tablas.' },
    ]
  },
  {
    id: SubjectId.PROBABILIDAD, name: 'Probabilidad', iconName: 'ProbabilityIcon', subjectThemeColor: 'bg-lime-500', exerciseTemplates: [
      { title: 'Posible e Imposible', description: '¿Qué puede pasar?' },
      { title: 'Juegos de Azar', description: 'Calcula probabilidades simples.' },
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
        ExerciseComponentType.GENERIC,
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

  if (gradeId === 1) {
    subjects = subjects.map(subject => {
      const specificExercises = grade1ExerciseData[subject.id];
      return specificExercises ? { ...subject, exercises: specificExercises } : subject;
    });
  } else if (gradeId === 2) { // Added case for 2nd Grade
    subjects = subjects.map(subject => {
      const specificExercises = grade2ExerciseData[subject.id];
      return specificExercises ? { ...subject, exercises: specificExercises } : subject;
    });
  } else if (gradeId === 3) {
    subjects = subjects.map(subject => {
      const specificExercises = grade3ExerciseData[subject.id];
      if (!specificExercises) {
        return subject; 
      }
      return { ...subject, exercises: specificExercises };
    });
  }
  
  return {
    ...gradeConfig,
    subjects,
  };
};
