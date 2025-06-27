
import { APP_TITLE, DEFAULT_AVATAR } from './appMetaConstants';
import { 
    GRADES_CONFIG, 
    getGradeData 
} from './gradeConstants';
// Imports from exerciseDataConstants.ts are removed.

// Re-export all necessary constants to maintain the public API
export {
  APP_TITLE,
  DEFAULT_AVATAR,
  GRADES_CONFIG,
  getGradeData,
  // SUBJECTS_TEMPLATES is no longer exported from here as it's an internal detail of gradeConstants.ts
};

// Note: Individual exercise arrays (like firstGradeNumerosExercises, thirdGradeOperacionesExercises, etc.)
// are encapsulated within the grade-specific constants files (e.g., grade1Constants.ts) 
// and consumed by getGradeData in gradeConstants.ts.
// The main way to access exercise data is through getGradeData(gradeId).
