

import React, { useState, useEffect, useCallback } from 'react';
import { PageView, GradeLevel, SubjectId, RouteParams } from './types';
import { MainPage } from './pages/MainPage';
import { GradePage } from './pages/GradePage';
import { AvatarPage } from './pages/AvatarPage';
import { GRADES_CONFIG } from './constants';
import { getCompletedExercises, markExerciseAsCompletedInStorage } from './localStorageUtils';

// Import the new grade-specific exercise pages
import { Grade1ExercisePage } from './pages/grade1/Grade1ExercisePage';
import { Grade2ExercisePage } from './pages/grade2/Grade2ExercisePage'; 
import { Grade3ExercisePage } from './pages/grade3/Grade3ExercisePage';
import { Grade4ExercisePage } from './pages/grade4/Grade4ExercisePage';
import { Grade5ExercisePage } from './pages/grade5/Grade5ExercisePage';
// The original ExercisePage will serve as a fallback or for other grades
import { ExercisePage as FallbackExercisePage } from './pages/ExercisePage';

const parseHash = (): RouteParams => {
  const hash = window.location.hash.replace(/^#\/?/, ''); // Remove #/ or #
  if (!hash) return { page: PageView.MAIN };

  const parts = hash.split('/');
  
  if (parts[0] === 'avatar') {
    return { page: PageView.AVATAR };
  }

  if (parts[0] === 'grade' && parts[1]) {
    const gradeId = parseInt(parts[1], 10) as GradeLevel;
    if (parts[2] && Object.values(SubjectId).includes(parts[2] as SubjectId) && parts[3]) {
      // Path: #/grade/{gradeId}/{subjectId}/{exerciseId} - not directly used for exercise page routing here
    }
    if (parts[2] && Object.values(SubjectId).includes(parts[2] as SubjectId)) {
       return { page: PageView.GRADE, gradeId, subjectId: parts[2] as SubjectId };
    }
    return { page: PageView.GRADE, gradeId };
  }
  
  if (parts[0] === 'exercise' && parts[1] && parts[2] && parts[3]) {
    const gradeId = parseInt(parts[1], 10) as GradeLevel;
    const subjectId = parts[2] as SubjectId;
    const exerciseId = parts[3];
    if (!isNaN(gradeId) && Object.values(SubjectId).includes(subjectId) && exerciseId) {
      return { page: PageView.EXERCISE, gradeId, subjectId, exerciseId };
    }
  }

  return { page: PageView.MAIN }; 
};

const App: React.FC = () => {
  const [routeParams, setRouteParams] = useState<RouteParams>(parseHash());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(getCompletedExercises());

  const handleMarkExerciseSetCompleted = useCallback((exerciseId: string) => {
    const updatedSet = markExerciseAsCompletedInStorage(exerciseId);
    setCompletedExercises(new Set(updatedSet)); 
  }, []);


  const handleHashChange = useCallback(() => {
    setRouteParams(parseHash());
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    setRouteParams(parseHash()); 
    setCompletedExercises(getCompletedExercises()); 
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);

  const navigateTo = (path: string) => {
    if (path === '/' || path === '') {
        window.location.hash = '#/';
    } else if (!path.startsWith('#')) {
        window.location.hash = '#/' + path.replace(/^\//, '');
    } else {
        window.location.hash = path;
    }
  };

  const navigateToMain = () => navigateTo('/');
  const navigateToAvatar = () => navigateTo('/avatar');
  const navigateToGrade = (gradeId: GradeLevel, subjectId?: SubjectId) => {
    if (subjectId) {
      navigateTo(`/grade/${gradeId}/${subjectId}`);
    } else {
      navigateTo(`/grade/${gradeId}`);
    }
  };
  const navigateToExercise = (gradeId: GradeLevel, subjectId: SubjectId, exerciseId: string) => {
    navigateTo(`/exercise/${gradeId}/${subjectId}/${exerciseId}`);
  };

  switch (routeParams.page) {
    case PageView.AVATAR:
      return <AvatarPage onNavigateBack={navigateToMain} />;
    case PageView.GRADE:
      if (routeParams.gradeId && GRADES_CONFIG.find(g => g.id === routeParams.gradeId)) { 
        return (
          <GradePage
            gradeId={routeParams.gradeId}
            initialSubjectId={routeParams.subjectId}
            onNavigateBack={navigateToMain}
            onNavigateToExercise={navigateToExercise}
            onNavigateToAvatar={navigateToAvatar}
            completedExercises={completedExercises} 
          />
        );
      }
      navigateToMain(); 
      return null;
    case PageView.EXERCISE:
      if (routeParams.gradeId && routeParams.subjectId && routeParams.exerciseId) {
        const pageProps = {
          gradeId: routeParams.gradeId,
          subjectId: routeParams.subjectId,
          exerciseId: routeParams.exerciseId,
          onNavigateBack: () => navigateToGrade(routeParams.gradeId!, routeParams.subjectId),
          onNavigateToMain: navigateToMain,
          onNavigateToAvatar: navigateToAvatar,
          onSetCompleted: handleMarkExerciseSetCompleted, 
        };

        if (routeParams.gradeId === 1) {
          return <Grade1ExercisePage {...pageProps} />;
        } else if (routeParams.gradeId === 2) { 
          return <Grade2ExercisePage {...pageProps} />;
        } else if (routeParams.gradeId === 3) {
          return <Grade3ExercisePage {...pageProps} />;
        } else if (routeParams.gradeId === 4) {
          return <Grade4ExercisePage {...pageProps} />;
        } else if (routeParams.gradeId === 5) {
          return <Grade5ExercisePage {...pageProps} />;
        }
         else {
          return <FallbackExercisePage {...pageProps} />;
        }
      }
      navigateToMain(); 
      return null;
    case PageView.MAIN:
    default:
      return <MainPage onNavigateToGrade={navigateToGrade} onNavigateToAvatar={navigateToAvatar} />;
  }
};

export default App;
