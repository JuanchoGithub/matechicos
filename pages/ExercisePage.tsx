
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi } from '../types';
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../components/icons'; 
import { NumericKeypad } from '../components/NumericKeypad'; // Import NumericKeypad
import { ExerciseScaffold } from '../components/ExerciseScaffold'; // Added import

interface ExercisePageProps {
  gradeId: GradeLevel;
  subjectId: SubjectId;
  exerciseId: string;
  onNavigateBack: () => void; 
  onNavigateToMain: () => void; 
  onNavigateToAvatar: () => void;
  onSetCompleted: (exerciseId: string) => void;
}

type KeypadHandler = (key: string) => void;

const GenericExerciseDisplay: React.FC<{ exerciseData: Exercise, gradeThemeColor: string, onNavigateBack: () => void, onNavigateToAvatar: () => void, currentAvatar: AvatarData }> = 
  ({ exerciseData, gradeThemeColor, onNavigateBack, onNavigateToAvatar, currentAvatar}) => {
  
  const AvatarIconComponent = getIcon(currentAvatar.iconName as AllIconNames) || Icons.UserCircleIcon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className={`w-full p-3 shadow-md ${gradeThemeColor} text-white sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <BackArrowIcon className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-7 h-7" /> 
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide truncate max-w-xs sm:max-w-md md:max-w-lg">
              {exerciseData.title}
            </h1>
          </div>
          <button onClick={onNavigateToAvatar} className={`p-1 rounded-full hover:bg-white/30 transition-colors ${currentAvatar.color}`}>
            <AvatarIconComponent className="w-8 h-8" />
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-3">{exerciseData.question || exerciseData.title}</h2>
          <div className="text-slate-600 space-y-4">
            {typeof exerciseData.content === 'string' ? <p>{exerciseData.content}</p> : exerciseData.content || <p>Este ejercicio estará disponible próximamente.</p>}
          </div>
          <div className="mt-8">
            <button 
                onClick={onNavigateBack}
                className={`px-6 py-3 ${gradeThemeColor.replace('bg-opacity-80','')} text-white font-semibold rounded-lg shadow hover:opacity-90 transition-opacity`}
            >
                Volver a Ejercicios
            </button>
          </div>
        </div>
      </main>
       <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200">
         Matechicos - Ejercicio
      </footer>
    </div>
  );
};

const DEFAULT_EXERCISE_STARS_FALLBACK = 3;


export const ExercisePage: React.FC<ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandler, setExerciseSpecificKeypadHandler] = useState<KeypadHandler | null>(null);
  const [customKeypadContent, setCustomKeypadContent] = useState<React.ReactNode | null>(null); // New state

  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => {
    return GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-sky-500';
  }, [gradeId]);
  
  useEffect(() => {
    setExerciseSpecificKeypadHandler(null);
    setCustomKeypadContent(null); // Reset custom keypad on exercise change
  }, [exerciseId]);

  const registerKeypadHandler = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandler(() => handler);
  }, []);

  // Callback for exercises to set custom sidebar content
  const setSidebarContentOverride = useCallback((content: React.ReactNode | null) => {
    setCustomKeypadContent(content);
  }, []);


  if (!exerciseData) {
    return (
        <div className="p-6 text-center">
            <p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p>
            <button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
                Volver al Inicio
            </button>
        </div>
    );
  }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id,
    exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS_FALLBACK,
    onNavigateBack,
    onGoHome: onNavigateBack, 
    onAvatarClick: onNavigateToAvatar,
    onSetCompleted,
    currentAvatar,
  };
  
  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, 
    scaffoldApi: api, 
    registerKeypadHandler: registerKeypadHandler,
    setCustomKeypadContent: setSidebarContentOverride, // Pass the setter
  });

  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  let keypadToRender: React.ReactNode = null; // Default for this page if no specific logic
  let allowDecimalForKeypad = false;

  switch (exerciseData.componentType) {
    case ExerciseComponentType.GENERIC:
    default:
      mainContentRenderer = () => (
        <GenericExerciseDisplay 
            exerciseData={exerciseData} 
            gradeThemeColor={gradeThemeColor} 
            onNavigateBack={onNavigateBack} 
            onNavigateToAvatar={onNavigateToAvatar} 
            currentAvatar={currentAvatar} 
        />
      );
      break;
  }
  
  let finalKeypadComponent: React.ReactNode = customKeypadContent; 

  if (!finalKeypadComponent) {
    if (keypadToRender) {
        finalKeypadComponent = keypadToRender;
    } else if (exerciseSpecificKeypadHandler) {
        finalKeypadComponent = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandler} className="w-full" allowDecimal={allowDecimalForKeypad} />;
    } else {
        finalKeypadComponent = <div className="p-4 text-slate-400">No se requiere teclado para este ejercicio.</div>;
    }
  }

  return <ExerciseScaffold {...scaffoldProps} mainExerciseContentRenderer={mainContentRenderer} keypadComponent={finalKeypadComponent} />;
};

