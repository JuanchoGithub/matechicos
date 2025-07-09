import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'; 
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi, ComparisonSymbol } from '../../types';
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../../components/icons'; 
import { NumericKeypad } from '../../components/NumericKeypad'; 
import { ExerciseScaffold } from '../../components/ExerciseScaffold'; 
import { ComparisonKeypad } from '../../components/ComparisonKeypad';

// --- Import G5 specific components (or reused ones) ---
// Numeros
import { EscribirHasta10000Exercise } from '../../exercises/EscribirHasta10000Exercise'; 
import { CompararHasta10000Exercise } from '../../exercises/CompararHasta10000Exercise'; 
import { ComponerHasta10000TextoExercise } from '../../exercises/ComponerHasta10000TextoExercise'; 
import { SimplificarFraccionesG5Exercise } from '../../exercises/grade5/SimplificarFraccionesG5Exercise'; 
import { NumerosMixtosAvanzadoG5Exercise } from '../../exercises/grade5/NumerosMixtosAvanzadoG5Exercise'; 
import { DecimalesAvanzadoG5Exercise } from '../../exercises/grade5/DecimalesAvanzadoG5Exercise';
import { CompararDecimalesG5Exercise } from '../../exercises/grade5/CompararDecimalesG5Exercise';
import { OrdenarDecimalesG5Exercise } from '../../exercises/grade5/OrdenarDecimalesG5Exercise';
import { RedondearDecimalesG5Exercise } from '../../exercises/grade5/RedondearDecimalesG5Exercise';
import { FraccionDeCantidadG5Exercise } from '../../exercises/grade5/FraccionDeCantidadG5Exercise';
import { PrimosCompuestosG5Exercise } from '../../exercises/grade5/PrimosCompuestosG5Exercise';
import { ReglasDivisibilidadG5Exercise } from '../../exercises/grade5/ReglasDivisibilidadG5Exercise';
import { McdMcmG5Exercise } from '../../exercises/grade5/McdMcmG5Exercise';
import { NumerosEnterosIntroG5Exercise } from '../../exercises/grade5/NumerosEnterosIntroG5Exercise';

// Operaciones G5
import { ColumnarOperationExercise } from '../../exercises/ColumnarOperationExercise';
import { OperarFraccionesHeterogeneasG5Exercise } from '../../exercises/grade5/OperarFraccionesHeterogeneasG5Exercise';
import { MultiplicarFraccionesG5Exercise } from '../../exercises/grade5/MultiplicarFraccionesG5Exercise';
import { DividirFraccionesG5Exercise } from '../../exercises/grade5/DividirFraccionesG5Exercise';
import { ColumnarOperationDecimalExercise } from '../../exercises/grade5/ColumnarOperationDecimalExercise';
import { MultiplicarDecimalesG5Exercise } from '../../exercises/grade5/MultiplicarDecimalesG5Exercise';
import { DividirDecimalesPorEnteroG5Exercise } from '../../exercises/grade5/DividirDecimalesPorEnteroG5Exercise';
import { OperacionesCombinadasG5Exercise } from '../../exercises/grade5/OperacionesCombinadasG5Exercise';
import { PotenciasCuadradosCubosG5Exercise } from '../../exercises/grade5/PotenciasCuadradosCubosG5Exercise';

// Medidas G5
import { MetricConversionQuestG5Exercise } from '../../exercises/grade5/MetricConversionQuestG5Exercise';
import { PerimeterPuzzleBuilderG5Exercise } from '../../exercises/grade5/PerimeterPuzzleBuilderG5Exercise';
import { AreaPuzzleBuilderG5Exercise } from '../../exercises/grade5/AreaPuzzleBuilderG5Exercise';
import { AreaAdventureG5Exercise } from '../../exercises/grade5/AreaAdventureG5Exercise';
import { VolumeVoyageG5Exercise } from '../../exercises/grade5/VolumeVoyageG5Exercise';
import { MeasurementDataExplorerG5Exercise } from '../../exercises/grade5/MeasurementDataExplorerG5Exercise';

// Geometria G5
import { PolygonSortingChallengeG5Exercise } from '../../exercises/grade5/PolygonSortingChallengeG5Exercise';
import { TriangleQuadExplorerG5Exercise } from '../../exercises/grade5/TriangleQuadExplorerG5Exercise';
import { Shape3DCounterG5Exercise } from '../../exercises/grade5/Shape3DCounterG5Exercise';
import { NetsOf3DShapesG5Exercise } from '../../exercises/grade5/NetsOf3DShapesG5Exercise';

// Problemas G5
import { ProblemasMatematicosGuiadosExercise } from '../../exercises/ProblemasMatematicosGuiadosExercise';
import { ProblemasMultiplesPasosG5Exercise } from '../../exercises/grade5/ProblemasMultiplesPasosG5Exercise';
import { ProporcionalidadG5Exercise } from '../../exercises/grade5/ProporcionalidadG5Exercise';
import { InterpretarRestoG5Exercise } from '../../exercises/grade5/InterpretarRestoG5Exercise';
import { FinanzasAvanzadoExercise } from '../../exercises/grade5/FinanzasAvanzadoG5Exercise';

interface Grade5ExercisePageProps {
  gradeId: GradeLevel; // Will always be 5
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

const DEFAULT_EXERCISE_STARS_G5 = 10; 
const COMPARISON_FACE_EMOJIS_G5 = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];

export const Grade5ExercisePage: React.FC<Grade5ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandlerG5, setExerciseSpecificKeypadHandlerG5] = useState<KeypadHandler | null>(null);
  const [customKeypadContentG5, setCustomKeypadContentG5] = useState<React.ReactNode | null>(null); 
  
  const currentScaffoldApiRef = useRef<ExerciseScaffoldApi | null>(null);
  const previousSignalValueFromScaffoldRef = useRef<number | undefined>(undefined);

  // State for COMPARAR_HASTA_10000
  const [comparisonChallengeG5, setComparisonChallengeG5] = useState<{ number1: number; number2: number; correctSymbol: ComparisonSymbol } | null>(null);
  const [comparisonSelectedSymbolG5, setComparisonSelectedSymbolG5] = useState<ComparisonSymbol | null>(null);
  const [comparisonIsVerifiedG5, setComparisonIsVerifiedG5] = useState<boolean>(false);
  const [comparisonEmojiG5, setComparisonEmojiG5] = useState<string>(COMPARISON_FACE_EMOJIS_G5[0]);
  
  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-blue-500', [gradeId]);
  
  const generateNewComparisonChallengeG5 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_HASTA_10000) return;
    const { minNumber = 100000, maxNumber = 9999999 } = exerciseData.data || {};
    let num1: number, num2: number;
    const forceEqual = Math.random() < 0.15;
    if (forceEqual) { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = num1; } 
    else { do { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; } while (num1 === num2); }
    let correctSym: ComparisonSymbol = num1 < num2 ? '<' : (num1 > num2 ? '>' : '=');
    setComparisonChallengeG5({ number1: num1, number2: num2, correctSymbol: correctSym });
    setComparisonSelectedSymbolG5(null); setComparisonIsVerifiedG5(false);
    setComparisonEmojiG5(COMPARISON_FACE_EMOJIS_G5[Math.floor(Math.random() * COMPARISON_FACE_EMOJIS_G5.length)]);
    currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleComparisonSymbolSelectG5 = (symbol: ComparisonSymbol) => { 
    if (comparisonIsVerifiedG5 && comparisonSelectedSymbolG5 === comparisonChallengeG5?.correctSymbol) return;
    setComparisonSelectedSymbolG5(symbol); currentScaffoldApiRef.current?.showFeedback(null);
    if (comparisonIsVerifiedG5 && comparisonSelectedSymbolG5 !== comparisonChallengeG5?.correctSymbol) setComparisonIsVerifiedG5(false);
  };
  const handleComparisonVerifyAnswerG5 = useCallback(() => { 
    if (!comparisonChallengeG5 || !comparisonSelectedSymbolG5 || (comparisonIsVerifiedG5 && comparisonSelectedSymbolG5 === comparisonChallengeG5.correctSymbol)) return;
    setComparisonIsVerifiedG5(true); const isCorrect = comparisonSelectedSymbolG5 === comparisonChallengeG5.correctSymbol;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! ${comparisonChallengeG5.number1} ${comparisonChallengeG5.correctSymbol} ${comparisonChallengeG5.number2}`});} 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: 'Ese no es el símbolo correcto. ¡Inténtalo otra vez!'}); setTimeout(() => setComparisonIsVerifiedG5(false), 1500); }
  }, [comparisonChallengeG5, comparisonSelectedSymbolG5, comparisonIsVerifiedG5]);
  
  const handleApiReady = useCallback((api: ExerciseScaffoldApi) => {
    currentScaffoldApiRef.current = api;
    const newSignalValue = api.advanceToNextChallengeSignal;
    if (newSignalValue !== undefined && newSignalValue !== previousSignalValueFromScaffoldRef.current) {
      const type = exerciseData?.componentType;
      if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG5();
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    } else if (previousSignalValueFromScaffoldRef.current === undefined && newSignalValue !== undefined) {
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    }
  }, [exerciseData, generateNewComparisonChallengeG5]);

  useEffect(() => {
    setCustomKeypadContentG5(null); 
    setExerciseSpecificKeypadHandlerG5(null);
    previousSignalValueFromScaffoldRef.current = undefined; 

    const type = exerciseData?.componentType;
    if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG5();
    else { setComparisonChallengeG5(null); }
  }, [exerciseId, subjectId, gradeId, exerciseData, generateNewComparisonChallengeG5]);
  
  const registerKeypadHandlerG5 = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandlerG5(() => handler);
  }, []);

  const setSidebarContentForExerciseG5 = useCallback((keypadNode: React.ReactNode | null) => { 
    setCustomKeypadContentG5(keypadNode);
  }, []);

  useEffect(() => {
    if (exerciseData?.componentType === ExerciseComponentType.COMPARAR_HASTA_10000) {
      setCustomKeypadContentG5(
        <ComparisonKeypad
          onSymbolSelect={handleComparisonSymbolSelectG5}
          onVerify={handleComparisonVerifyAnswerG5}
          selectedSymbol={comparisonSelectedSymbolG5}
          isVerified={comparisonIsVerifiedG5}
          correctSymbolForFeedback={comparisonChallengeG5?.correctSymbol ?? null}
        />
      );
    }
  }, [exerciseData, comparisonSelectedSymbolG5, comparisonIsVerifiedG5, comparisonChallengeG5]);

  if (!exerciseData) { return ( <div className="p-6 text-center"><p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p><button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Volver al Inicio</button></div> ); }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id, exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS_G5,
    onNavigateBack, onGoHome: onNavigateBack, onAvatarClick: onNavigateToAvatar,
    onSetCompleted, currentAvatar, onApiReady: handleApiReady,
  };

  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, scaffoldApi: api, 
    registerKeypadHandler: registerKeypadHandlerG5,
    setCustomKeypadContent: setSidebarContentForExerciseG5, 
    gradeLevel: gradeId,
  });
  
  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  
  const allowDecimalForKeypadG5 = useMemo(() => {
    const type = exerciseData?.componentType;
    return (
      type === ExerciseComponentType.COLUMNAR_OPERATION_DECIMAL ||
      type === ExerciseComponentType.MULTIPLICAR_DECIMALES_G5 ||
      type === ExerciseComponentType.DIVIDIR_DECIMALES_POR_ENTERO_G5 ||
      type === ExerciseComponentType.DECIMALES_AVANZADO_G5 ||
      type === ExerciseComponentType.REDONDEAR_DECIMALES_G5 ||
      type === ExerciseComponentType.METRIC_CONVERSION_QUEST_G5 ||
      type === ExerciseComponentType.PERIMETER_PUZZLE_BUILDER_G5 ||
      type === ExerciseComponentType.AREA_ADVENTURE_G5 ||
      type === ExerciseComponentType.AREA_PUZZLE_BUILDER_G5 ||
      type === ExerciseComponentType.MEASUREMENT_DATA_EXPLORER_G5 ||
      exerciseData.data?.allowDecimal === true
    );
  }, [exerciseData]);

  switch (exerciseData.componentType) {
    // --- Numeros ---
    case ExerciseComponentType.ESCRIBIR_HASTA_10000: mainContentRenderer = (api) => <EscribirHasta10000Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_HASTA_10000:
      mainContentRenderer = () => (
        <CompararHasta10000Exercise
          number1={comparisonChallengeG5?.number1 ?? null}
          number2={comparisonChallengeG5?.number2 ?? null}
          selectedSymbol={comparisonSelectedSymbolG5}
          currentEmoji={comparisonEmojiG5}
          questionText={exerciseData.question || "¿Cuál es el símbolo correcto?"}
        />
      );
      break;
    case ExerciseComponentType.COMPONER_HASTA_10000_TEXTO: mainContentRenderer = (api) => <ComponerHasta10000TextoExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DECIMALES_AVANZADO_G5: mainContentRenderer = (api) => <DecimalesAvanzadoG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_DECIMALES_G5:
      mainContentRenderer = (api) => (
        <CompararDecimalesG5Exercise
          exercise={exerciseData!}
          scaffoldApi={api}
          setCustomKeypadContent={setSidebarContentForExerciseG5}
        />
      );
      break;
    case ExerciseComponentType.ORDENAR_DECIMALES_G5: mainContentRenderer = (api) => <OrdenarDecimalesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.REDONDEAR_DECIMALES_G5: mainContentRenderer = (api) => <RedondearDecimalesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.FRACCION_DE_CANTIDAD_G5: mainContentRenderer = (api) => <FraccionDeCantidadG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PRIMOS_COMPUESTOS_G5: mainContentRenderer = (api) => <PrimosCompuestosG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.REGLAS_DIVISIBILIDAD_G5: mainContentRenderer = (api) => <ReglasDivisibilidadG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MCD_MCM_G5: mainContentRenderer = (api) => <McdMcmG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.NUMEROS_ENTEROS_INTRO_G5: mainContentRenderer = (api) => <NumerosEnterosIntroG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.SIMPLIFICAR_FRACCIONES_G5: mainContentRenderer = (api) => <SimplificarFraccionesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.NUMEROS_MIXTOS_AVANZADO_G5: mainContentRenderer = (api) => <NumerosMixtosAvanzadoG5Exercise {...createExerciseContentProps(api)} />; break;
    
    // --- Operaciones ---
    case ExerciseComponentType.MEGA_OPERACIONES_ENTEROS_G5: mainContentRenderer = (api) => <ColumnarOperationExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.OPERAR_FRACCIONES_HETEROGENEAS_G5: mainContentRenderer = (api) => <OperarFraccionesHeterogeneasG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MULTIPLICAR_FRACCIONES_G5: mainContentRenderer = (api) => <MultiplicarFraccionesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DIVIDIR_FRACCIONES_G5: mainContentRenderer = (api) => <DividirFraccionesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COLUMNAR_OPERATION_DECIMAL: mainContentRenderer = (api) => <ColumnarOperationDecimalExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MULTIPLICAR_DECIMALES_G5: mainContentRenderer = (api) => <MultiplicarDecimalesG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DIVIDIR_DECIMALES_POR_ENTERO_G5: mainContentRenderer = (api) => <DividirDecimalesPorEnteroG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.OPERACIONES_COMBINADAS_G5: mainContentRenderer = (api) => <OperacionesCombinadasG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.POTENCIAS_CUADRADOS_CUBOS_G5: mainContentRenderer = (api) => <PotenciasCuadradosCubosG5Exercise {...createExerciseContentProps(api)} />; break;
    
    // --- Medidas ---
    case ExerciseComponentType.METRIC_CONVERSION_QUEST_G5: mainContentRenderer = (api) => <MetricConversionQuestG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PERIMETER_PUZZLE_BUILDER_G5: mainContentRenderer = (api) => <PerimeterPuzzleBuilderG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.AREA_ADVENTURE_G5: mainContentRenderer = (api) => <AreaAdventureG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.AREA_PUZZLE_BUILDER_G5: mainContentRenderer = (api) => <AreaPuzzleBuilderG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.VOLUMEN_VOYAGE_G5: mainContentRenderer = (api) => <VolumeVoyageG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MEASUREMENT_DATA_EXPLORER_G5: mainContentRenderer = (api) => <MeasurementDataExplorerG5Exercise {...createExerciseContentProps(api)} />; break;

    // --- Geometria ---
    case ExerciseComponentType.POLYGON_SORTING_CHALLENGE_G5: mainContentRenderer = (api) => <PolygonSortingChallengeG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.TRIANGLE_QUAD_EXPLORER_G5: mainContentRenderer = (api) => <TriangleQuadExplorerG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.SHAPE_3D_COUNTER_G5: mainContentRenderer = (api) => <Shape3DCounterG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.NETS_OF_3D_SHAPES_G5: mainContentRenderer = (api) => <NetsOf3DShapesG5Exercise {...createExerciseContentProps(api)} />; break;
    
    // --- Problemas ---
    case ExerciseComponentType.PROBLEMAS_PASO_A_PASO: mainContentRenderer = (api) => <ProblemasMatematicosGuiadosExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PROBLEMAS_MULTIPLES_PASOS_G5: mainContentRenderer = (api) => <ProblemasMultiplesPasosG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PROBLEMAS_PROPORCIONALIDAD_G5: mainContentRenderer = (api) => <ProporcionalidadG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PROBLEMAS_INTERPRETAR_RESTO_G5: mainContentRenderer = (api) => <InterpretarRestoG5Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.FINANZAS_AVANZADO: mainContentRenderer = (api) => <FinanzasAvanzadoExercise {...createExerciseContentProps(api)} />; break;

    default: mainContentRenderer = () => <GenericExerciseDisplay exerciseData={exerciseData} gradeThemeColor={gradeThemeColor} onNavigateBack={onNavigateBack} onNavigateToAvatar={onNavigateToAvatar} currentAvatar={currentAvatar} />; break;
  }
  
  let finalKeypadComponentForScaffold: React.ReactNode = customKeypadContentG5; 
  if (!finalKeypadComponentForScaffold) { 
    if (exerciseSpecificKeypadHandlerG5) { 
        finalKeypadComponentForScaffold = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG5} className="w-full" allowDecimal={allowDecimalForKeypadG5} />;
    } else {
        finalKeypadComponentForScaffold = <div className="p-4 text-slate-400">Este ejercicio no requiere un teclado específico.</div>;
    }
  }

  return <ExerciseScaffold {...scaffoldProps} mainExerciseContentRenderer={mainContentRenderer} keypadComponent={finalKeypadComponentForScaffold} />;
};
