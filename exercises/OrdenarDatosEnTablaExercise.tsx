
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, AvatarData, OrdenarDatosEnTablaScenarioTemplate, OrdenarDatosEnTablaItem, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

interface OrdenarDatosEnTablaExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setExternalKeypad?: (keypadNode: React.ReactNode | null) => void; // Added prop
}

const FACE_EMOJIS_ORDENAR = ['📊', '📈', '📉', '🥇', '🥈', '🥉', '📋', '🗂️'];
const DEFAULT_ORDENAR_ICON = '🗂️';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const OrdenarDatosEnTablaExercise: React.FC<OrdenarDatosEnTablaExerciseProps> = ({
  exercise, scaffoldApi, setExternalKeypad // Added setExternalKeypad
}) => {
  const [activeScenario, setActiveScenario] = useState<OrdenarDatosEnTablaScenarioTemplate | null>(null);
  const [userSelections, setUserSelections] = useState<(string | null)[]>([]); 
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_ORDENAR_ICON);
  const [availableScenarios, setAvailableScenarios] = useState<OrdenarDatosEnTablaScenarioTemplate[]>([]);

  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const previousAdvanceSignalRef = React.useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    const scenarioTemplates = exercise.data as OrdenarDatosEnTablaScenarioTemplate[] || [];
    if (scenarioTemplates.length > 0) {
      setAvailableScenarios(shuffleArray([...scenarioTemplates]));
    }
  }, [exercise.data]);

  const loadNextScenario = useCallback(() => {
    let scenarioPool = availableScenarios;
    if (scenarioPool.length === 0 && (exercise.data as OrdenarDatosEnTablaScenarioTemplate[])?.length > 0) {
      scenarioPool = shuffleArray([...(exercise.data as OrdenarDatosEnTablaScenarioTemplate[])]);
    }

    if (scenarioPool.length > 0) {
      const nextScenario = scenarioPool[0];
      setActiveScenario(nextScenario);
      setUserSelections(Array(nextScenario.numItemsToDisplayInTable).fill(null));
      setAvailableScenarios(prev => prev.slice(1));
      setIsVerified(false);
      showFeedback(null);
      setCurrentEmoji(nextScenario.icon || FACE_EMOJIS_ORDENAR[Math.floor(Math.random() * FACE_EMOJIS_ORDENAR.length)]);
    } else {
        onAttempt(true); 
        return;
    }
  }, [availableScenarios, exercise.data, showFeedback, onAttempt]);

  useEffect(() => {
    if ((exercise.data as OrdenarDatosEnTablaScenarioTemplate[])?.length > 0 && !activeScenario ) {
      loadNextScenario();
    }
  }, [exercise.data, activeScenario, loadNextScenario]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > previousAdvanceSignalRef.current) {
        loadNextScenario(); 
    }
    previousAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNextScenario]);

  const selectedItemsAreCorrect = (selections: (string | null)[], scenario: OrdenarDatosEnTablaScenarioTemplate): boolean => {
    const selectedItemsObjects: (OrdenarDatosEnTablaItem | null)[] = selections.map(name =>
        name ? scenario.unsortedData.find(item => item.name === name) || null : null
    );
     if (selectedItemsObjects.some(item => item === null)) return false;
    let orderCorrect = true;
    for (let i = 0; i < selectedItemsObjects.length - 1; i++) {
        const val1 = selectedItemsObjects[i]!.value;
        const val2 = selectedItemsObjects[i+1]!.value;
        if (scenario.sortOrder === 'desc' && val1 < val2) { orderCorrect = false; break; }
        if (scenario.sortOrder === 'asc' && val1 > val2) { orderCorrect = false; break; }
    }
    return orderCorrect;
  };

  const handleDropdownChange = (rankIndex: number, selectedItemName: string) => {
    if (isVerified && activeScenario && selectedItemsAreCorrect(userSelections, activeScenario)) return;
    
    const newSelections = [...userSelections];
    newSelections[rankIndex] = selectedItemName === "" ? null : selectedItemName; 
    setUserSelections(newSelections);
    showFeedback(null);
    if (isVerified && activeScenario && !selectedItemsAreCorrect(userSelections, activeScenario)) setIsVerified(false);
  };

  const verifyOrder = useCallback(() => {
    if (!activeScenario || (isVerified && selectedItemsAreCorrect(userSelections, activeScenario))) return;
    setIsVerified(true);

    const selectedItemsObjects: (OrdenarDatosEnTablaItem | null)[] = userSelections.map(name =>
      name ? activeScenario.unsortedData.find(item => item.name === name) || null : null
    );

    if (selectedItemsObjects.some(item => item === null)) {
      showFeedback({ type: 'incorrect', message: 'Por favor, selecciona un elemento para cada puesto.' });
      onAttempt(false);
      setIsVerified(false); 
      return;
    }

    const selectedNames = selectedItemsObjects.map(item => item!.name);
    if (new Set(selectedNames).size !== selectedNames.length) {
      showFeedback({ type: 'incorrect', message: 'No puedes seleccionar el mismo elemento varias veces.' });
      onAttempt(false);
      setIsVerified(false); 
      return;
    }

    const orderCorrect = selectedItemsAreCorrect(userSelections, activeScenario);

    onAttempt(orderCorrect);
    if (orderCorrect) {
      showFeedback({ type: 'correct', message: '¡Ordenamiento Correcto!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'El orden no es correcto. ¡Revisa los valores!' });
      setIsVerified(false); 
    }
  }, [activeScenario, userSelections, isVerified, showFeedback, onAttempt]);

  // Keypad component to be passed to the sidebar
  const KeypadContent = React.useMemo(() => () => {
    if (!activeScenario) return null;
    return (
        <div className="w-full flex flex-col items-center space-y-3 p-2 mt-4 max-w-xs mx-auto">
        <button
            onClick={verifyOrder}
            disabled={ (activeScenario && isVerified && selectedItemsAreCorrect(userSelections, activeScenario)) || userSelections.some(s => s === null)}
            className={`w-full p-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
            ${((activeScenario && isVerified && selectedItemsAreCorrect(userSelections, activeScenario)) || userSelections.some(s => s === null))
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
            }`}
        >
            <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Verificar Orden
        </button>
        </div>
    );
  }, [activeScenario, userSelections, isVerified, verifyOrder]);


  useEffect(() => {
    if (setExternalKeypad) {
      if (activeScenario) {
        setExternalKeypad(<KeypadContent />);
      } else {
         setExternalKeypad(null); 
      }
    }
    return () => {
      if (setExternalKeypad) {
        setExternalKeypad(null);
      }
    };
  }, [setExternalKeypad, KeypadContent, activeScenario]); 


  const MainContent: React.FC = () => {
    if (!activeScenario) return <div className="p-4 text-xl text-slate-600">Cargando desafío de ordenamiento...</div>;

    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-purple-600 text-white text-sm p-2 max-w-[280px]" direction="left">
            {exercise.question || "Ordena la tabla:"}
          </Icons.SpeechBubbleIcon>
        </div>

        <div className="w-full p-3 bg-slate-50 rounded-lg shadow mb-3">
          <h4 className="text-md font-semibold text-slate-700 mb-1">{activeScenario.title}</h4>
          <p className="text-sm text-slate-600 mb-2">{activeScenario.sortInstructionText}</p>
          <ul className="text-xs text-slate-500 list-disc list-inside max-h-24 overflow-y-auto">
            {activeScenario.unsortedData.map(item => (
              <li key={item.name}>{item.name}: {item.value}</li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md p-2 sm:p-3 bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-slate-600 border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-black">Puesto</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-black">{activeScenario.categoryHeader}</th>
                <th className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-black text-right">{activeScenario.valueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: activeScenario.numItemsToDisplayInTable }).map((_, rankIndex) => {
                const selectedItemName = userSelections[rankIndex];
                const selectedItemObject = selectedItemName ? activeScenario.unsortedData.find(item => item.name === selectedItemName) : null;
                
                return (
                  <tr key={rankIndex} className={`${rankIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-center font-medium">{rankIndex + 1}°</td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300">
                      <select
                        value={selectedItemName || ""}
                        onChange={(e) => handleDropdownChange(rankIndex, e.target.value)}
                        className="w-full p-1 bg-white border border-slate-300 rounded text-slate-700 text-xs sm:text-sm focus:ring-sky-500 focus:border-sky-500"
                        disabled={isVerified && activeScenario && selectedItemsAreCorrect(userSelections, activeScenario)}
                      >
                        <option value="">Seleccionar...</option>
                        {activeScenario.unsortedData.map(item => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 border border-slate-300 text-right">
                      {selectedItemObject ? selectedItemObject.value : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return <MainContent />;
};
