import React from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold';
import { AnyExercise, ExerciseComponentType } from '../types';
import { grade5ProbabilidadData } from '../grade5ProbabilidadData';

const ProbabilidadPageG5: React.FC = () => {
  const exercises = [
    { id: 'g5-prob-unified', title: 'Desafío de Ruleta de Carnaval', component: 'SpinnerProbabilityExercise', data: grade5ProbabilidadData[1], componentType: ExerciseComponentType.SPINNER_PROBABILITY },
    { id: 'g5-s6-e3', title: 'Juego de Probabilidad con Monedas y Dados', component: 'CoinDiceProbabilityExercise', data: grade5ProbabilidadData[2], componentType: ExerciseComponentType.COIN_DICE_PROBABILITY },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">5to Grado - Probabilidad</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map(exercise => (
          <div key={exercise.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{exercise.title}</h2>
            {/* This is a simplified representation. The actual rendering is handled in Grade5ExercisePage */}
            <a href={`#/exercise/5/probabilidad/${exercise.id}`} className="text-blue-500 hover:underline">
              Iniciar Ejercicio
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProbabilidadPageG5;