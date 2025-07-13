
import React, { useState, useMemo, useEffect } from 'react';
import { GradeData, SubjectData, Exercise, SubjectId, GradeLevel } from '../types';
import { getGradeData, DEFAULT_AVATAR } from '../constants'; 
import { Icons, BackArrowIcon, OwlIcon } from '../components/icons';
import { IconName } from '../types'; 

interface GradePageProps {
  gradeId: GradeLevel;
  initialSubjectId?: SubjectId;
  onNavigateBack: () => void;
  onNavigateToExercise: (gradeId: GradeLevel, subjectId: SubjectId, exerciseId: string) => void;
  onNavigateToAvatar: () => void;
  completedExercises: Set<string>; // New prop
}

const AvatarDisplay: React.FC<{ avatar: { iconName: IconName, color: string }, onClick: () => void }> = ({ avatar, onClick }) => {
  const AvatarIconComponent = Icons[avatar.iconName as keyof typeof Icons]; 
  return (
    <button onClick={onClick} className={`p-1 rounded-full hover:bg-slate-300 transition-colors ${avatar.color}`}>
      <AvatarIconComponent className="w-8 h-8" />
    </button>
  );
};

const ExerciseCard: React.FC<{ exercise: Exercise; subjectThemeColor: string; onClick: () => void; index: number; isCompleted: boolean }> = 
  ({ exercise, subjectThemeColor, onClick, index, isCompleted }) => {
  const IconComponent = Icons[exercise.iconName as keyof typeof Icons] || Icons.BookOpenIcon;
  
  let cardBgColor = 'bg-white hover:bg-slate-50';
  let textColor = 'text-slate-700';
  const themeColorBase = subjectThemeColor.split('-')[1];
  const themeColorShade = subjectThemeColor.split('-')[2] || '500';
  let borderColor = `border-${themeColorBase}-${themeColorShade}`;
  let iconColor = `text-${themeColorBase}-${themeColorShade}`;
  let indexCircleBg = subjectThemeColor;
  let isDisabled = false;
  let titleFontWeight = 'font-semibold';

  if (isCompleted) {
    cardBgColor = 'bg-amber-50 hover:bg-amber-100';
    textColor = 'text-amber-700';
    borderColor = 'border-amber-400';
    iconColor = 'text-amber-600';
    indexCircleBg = 'bg-amber-500';
    titleFontWeight = 'font-bold'; // Make title slightly bolder for completed
  } else if (exercise.isLocked) {
    cardBgColor = 'bg-slate-200';
    textColor = 'text-slate-500';
    borderColor = 'border-slate-300';
    iconColor = 'text-slate-400';
    indexCircleBg = 'bg-slate-400';
    isDisabled = true;
  }
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-4 border-2 ${borderColor} ${cardBgColor} ${textColor} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={`Ejercicio ${index + 1}: ${exercise.title}. ${exercise.description}${isCompleted ? ' Completado.' : (exercise.isLocked ? ' Bloqueado.' : '')}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${indexCircleBg} text-white flex items-center justify-center font-bold text-lg`}>
        {index + 1}
      </div>
      <IconComponent className={`w-8 h-8 flex-shrink-0 ${iconColor}`} />
      <div className="flex-grow text-left">
        <h3 className={`${titleFontWeight} text-md`}>{exercise.title}</h3>
        <p className="text-xs">{exercise.description}</p>
      </div>
      {isCompleted ? (
        <Icons.StarIcon className="w-6 h-6 text-amber-500 flex-shrink-0" filled={true} />
      ) : exercise.isLocked ? (
        <Icons.LockIcon className="w-6 h-6 text-slate-500 flex-shrink-0" />
      ) : null}
    </button>
  );
};

export const GradePage: React.FC<GradePageProps> = ({ gradeId, initialSubjectId, onNavigateBack, onNavigateToExercise, onNavigateToAvatar, completedExercises }) => {
  const [grade, setGrade] = useState<GradeData | undefined>(undefined);
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId | undefined>(initialSubjectId);
  const [currentDisplaySubject, setCurrentDisplaySubject] = useState<SubjectData | undefined>(undefined);

  useEffect(() => {
    const fetchedGrade = getGradeData(gradeId);
    setGrade(fetchedGrade);
    if (fetchedGrade) {
      const subjectIdToActivate = initialSubjectId && fetchedGrade.subjects.find(s => s.id === initialSubjectId)
        ? initialSubjectId
        : fetchedGrade.subjects[0]?.id || SubjectId.NUMEROS;
      setActiveSubjectId(subjectIdToActivate);
    }
  }, [gradeId, initialSubjectId]);

  useEffect(() => {
    if (grade && activeSubjectId) {
      setCurrentDisplaySubject(grade.subjects.find(s => s.id === activeSubjectId));
    } else {
      setCurrentDisplaySubject(undefined);
    }
  }, [grade, activeSubjectId]);

  const exercisesToDisplay = useMemo(() => {
    if (!currentDisplaySubject || !grade) {
      return [];
    }
    // Apply filtering fix specifically for 1st grade
    if (grade.id === 1) {
      const expectedSubjectIndex = grade.subjects.findIndex(s => s.id === currentDisplaySubject.id) + 1;
      if (expectedSubjectIndex > 0) {
        const expectedIdPrefix = `g${grade.id}-s${expectedSubjectIndex}-`;
        return currentDisplaySubject.exercises.filter(ex => ex.id.startsWith(expectedIdPrefix));
      }
    }
    return currentDisplaySubject.exercises;
  }, [currentDisplaySubject, grade]);


  if (!grade) {
    return <div className="p-4 text-red-500">Cargando datos del grado... <button onClick={onNavigateBack} className="text-blue-500 underline">Volver</button></div>;
  }
  
  const activeSubjectThemeColor = currentDisplaySubject?.subjectThemeColor || 'bg-slate-500'; 
  const activeSubjectTextColor = activeSubjectThemeColor.replace('bg-', 'text-').replace('-500', '-600'); 

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className={`w-full p-3 shadow-md ${grade.themeColor.replace('bg-opacity-80', '')} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Volver">
            <BackArrowIcon className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-2">
            <OwlIcon className="w-9 h-9" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">{grade.longName}</h1>
          </div>
          <AvatarDisplay avatar={DEFAULT_AVATAR} onClick={onNavigateToAvatar} />
        </div>
      </header>

      <nav className="w-full bg-white shadow-sm sticky top-[70px] z-40"> 
        <div className="max-w-7xl mx-auto flex justify-center space-x-1 sm:space-x-2 p-2 overflow-x-auto">
          {grade.subjects.map((subject) => {
            const SubjectIcon = Icons[subject.iconName];
            const isActive = subject.id === activeSubjectId;
            const subjectColorBase = subject.subjectThemeColor.split('-')[1]; 
            
            return (
              <button
                key={subject.id}
                onClick={() => setActiveSubjectId(subject.id)}
                className={`flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all
                  ${isActive 
                    ? `${subject.subjectThemeColor} text-white shadow-md` 
                    : `text-slate-600 hover:bg-${subjectColorBase}-100 hover:text-${subjectColorBase}-700`
                  }`}
                aria-pressed={isActive}
              >
                <SubjectIcon className={`w-5 h-5 mb-1 sm:mb-0 ${isActive ? 'text-white' : `text-${subjectColorBase}-500`}`} />
                <span>{subject.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        {currentDisplaySubject ? (
          <>
            <h2 className={`text-2xl font-semibold ${activeSubjectTextColor} mb-6 text-center`}>
              Ejercicios de {currentDisplaySubject.name}
            </h2>
            {exercisesToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {exercisesToDisplay.map((exercise, index) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    subjectThemeColor={currentDisplaySubject.subjectThemeColor}
                    onClick={() => {
                      if (grade && currentDisplaySubject) {
                        onNavigateToExercise(grade.id, currentDisplaySubject.id, exercise.id);
                      }
                    }}
                    index={index}
                    isCompleted={completedExercises.has(exercise.id)} // Pass completion status
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 mt-10">No hay ejercicios disponibles para esta sección.</p>
            )}
          </>
        ) : (
             <p className="text-center text-slate-500 mt-10">Selecciona una materia para ver los ejercicios.</p>
        )}
      </main>
       <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200">
         Matechicos - {grade.name}
      </footer>
    </div>
  );
};
