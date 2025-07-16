import { Exercise, ExerciseComponentType } from "@/types";
import { fifthGradeMultiStepScenarios } from "./exercises/problemScenariosData/fifthGradeMultiStep";
import { fifthGradeProportionalityScenarios } from "./exercises/problemScenariosData/fifthGradeProportionality";
import { fifthGradeRemainderScenarios } from "./exercises/problemScenariosData/fifthGradeRemainder";
import { fifthGradeFinanceAdvancedScenarios } from "./exercises/problemScenariosData/fifthGradeFinanceAdvanced";

// Specific exercises for Fifth Grade - Problemas (s7)
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
    data: {
      scenarios: fifthGradeMultiStepScenarios,
      totalStars: 6
    },
  },
  {
    id: "problemas_proporcionalidad_g5",
    title: "Problemas de proporcionalidad",
    description: "Resuelve problemas de proporcionalidad.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_PROPORCIONALIDAD_G5,
    data: {
      scenarios: fifthGradeProportionalityScenarios,
      totalStars: 6
    },
  },
  {
    id: "problemas_interpretar_resto_g5",
    title: "Interpretar el resto en problemas",
    description: "Aprende a interpretar el resto en problemas de división.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.PROBLEMAS_INTERPRETAR_RESTO_G5,
    data: {
      scenarios: fifthGradeRemainderScenarios,
      totalStars: 6
    },
  },
  {
    id: "finanzas_avanzado",
    title: "Finanzas avanzado",
    description: "Resuelve problemas avanzados de finanzas.",
    iconName: "ProblemsIcon",
    isLocked: false,
    componentType: ExerciseComponentType.FINANZAS_AVANZADO,
    data: {
      scenarios: fifthGradeFinanceAdvancedScenarios,
      totalStars: 6
    },
  },
];
