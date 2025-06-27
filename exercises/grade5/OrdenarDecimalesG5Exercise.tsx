
import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, OrdenarDecimalesChallenge } from '../../types';

interface OrdenarDecimalesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

export const OrdenarDecimalesG5Exercise: React.FC<OrdenarDecimalesG5ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent
}) => {
  const [challenge, setChallenge] = useState<OrdenarDecimalesChallenge | null>(null);
  // Add state for user's ordered list, etc.

  useEffect(() => {
    setChallenge({ decimals: [0.5, 0.12, 1.0, 0.099], sortOrder: 'asc' });
    if (setCustomKeypadContent) setCustomKeypadContent(<div className="p-2 text-sm">Arrastra o selecciona para ordenar. Botón Verificar aquí.</div>);
    return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); };
  }, [exercise.id, setCustomKeypadContent]);

  if (!challenge) return <div className="p-4">Cargando desafío de ordenar decimales...</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
      <p className="text-md mb-1">Ordena los siguientes decimales de {challenge.sortOrder === 'asc' ? 'menor a mayor' : 'mayor a menor'}:</p>
      <div className="flex space-x-2 p-2 bg-slate-100 rounded my-2">
        {challenge.decimals.map(d => <span key={d} className="p-2 border bg-white rounded">{d}</span>)}
      </div>
      {/* Placeholder for actual ordering UI */}
      <div className="p-4 border rounded-md bg-slate-50 min-h-[50px]">
        Área para que el usuario ordene los números.
      </div>
    </div>
  );
};
