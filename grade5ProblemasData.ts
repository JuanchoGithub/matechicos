import { Exercise, ExerciseComponentType } from "@/types";

// Specific exercises for Fifth Grade - Problemas (s7)
// This file is currently a placeholder. Exercises will be added here.
export const fifthGradeProblemasExercises: Exercise[] = [
  {
    id: "problemas_paso_a_paso",
    title: "Problemas paso a paso",
    description: "Resuelve problemas matemáticos guiados.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PASO_A_PASO,
  },
  {
    id: "problemas_multiples_pasos_g5",
    title: "Problemas de múltiples pasos",
    description: "Resuelve problemas que requieren varios pasos.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_MULTIPLES_PASOS_G5,
  },
  {
    id: "problemas_proporcionalidad_g5",
    title: "Problemas de proporcionalidad",
    description: "Resuelve problemas de proporcionalidad.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PROPORCIONALIDAD_G5,
  },
  {
    id: "problemas_interpretar_resto_g5",
    title: "Interpretar el resto en problemas",
    description: "Aprende a interpretar el resto en problemas de división.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_INTERPRETAR_RESTO_G5,
  },
  {
    id: "finanzas_avanzado",
    title: "Finanzas avanzado",
    description: "Resuelve problemas avanzados de finanzas.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.FINANZAS_AVANZADO,
  },
];
