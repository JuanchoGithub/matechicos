
import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'; 
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi, ComparisonSymbol } from '../../types';
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../../components/icons'; 
import { NumericKeypad } from '../../components/NumericKeypad'; 
import { ExerciseScaffold } from '../../components/ExerciseScaffold'; 
import { ComparisonKeypad } from '../../components/ComparisonKeypad';

// --- Import G4 specific components (or reused ones) ---
// Numeros
import { EscribirHasta10000Exercise } from '../../exercises/EscribirHasta10000Exercise'; 
import { CompararHasta10000Exercise } from '../../exercises/CompararHasta10000Exercise'; 
import { ComponerHasta10000TextoExercise } from '../../exercises/ComponerHasta10000TextoExercise'; 
import { AproximarNumeroExercise } from '../../exercises/AproximarNumeroExercise';
import { DescomposicionPolinomicaG4Exercise } from '../../exercises/grade4/DescomposicionPolinomicaG4Exercise';
import { NumerosRomanosG4Exercise } from '../../exercises/grade4/NumerosRomanosG4Exercise';
import { FraccionesEquivalentesG4Exercise } from '../../exercises/grade4/FraccionesEquivalentesG4Exercise'; 
import { CompararFraccionesG4Exercise } from '../../exercises/grade4/CompararFraccionesG4Exercise';
import { OperarFraccionesIgualDenominadorG4Exercise } from '../../exercises/grade4/OperarFraccionesIgualDenominadorG4Exercise';
import { NumerosMixtosIntroG4Exercise } from '../../exercises/grade4/NumerosMixtosIntroG4Exercise';
import { DecimalesIntroFraccionG4Exercise } from '../../exercises/grade4/DecimalesIntroFraccionG4Exercise';
import { MultiplosDivisoresConceptoG4Exercise } from '../../exercises/grade4/MultiplosDivisoresConceptoG4Exercise';
import { FraccionDeCantidadG5Exercise } from '../../exercises/grade5/FraccionDeCantidadG5Exercise';

// Operaciones
import { ColumnarOperationExercise } from '../../exercises/ColumnarOperationExercise';
import { MultiplicacionColumnasExercise } from '../../exercises/MultiplicacionColumnasExercise';
import { DivisionLargaExercise } from '../../exercises/DivisionLargaExercise';
import { CalculaMentalmenteExercise } from '../../exercises/CalculaMentalmenteExercise';
import { OperacionesCombinadasSimplesG4Exercise as OperacionesCombinadasSimplesG4ExerciseComponent } from '../../exercises/grade4/OperacionesCombinadasSimplesG4Exercise'; 

// Problemas
import { ProblemasMatematicosGuiadosExercise } from '../../exercises/ProblemasMatematicosGuiadosExercise';
import { FinanzasAvanzadoExercise } from '../../exercises/grade5/FinanzasAvanzadoG5Exercise';

// Medidas
import { CalcularAreaG4Exercise } from '../../exercises/grade4/CalcularAreaG4Exercise';
import { ConversionUnidadesG4Exercise } from '../../exercises/grade4/ConversionUnidadesG4Exercise';
import { CalcularTiempoTranscurridoG4Exercise } from '../../exercises/grade4/CalcularTiempoTranscurridoG4Exercise';
import { VolumenCubosUnitariosG4Exercise } from '../../exercises/grade4/VolumenCubosUnitariosG4Exercise';

// Geometria
import { IdentificarFormaGeometricaGenericoExercise } from '../../exercises/IdentificarFormaGeometricaGenericoExercise';
import { IdentificarDiagonalesPoligonoG4Exercise } from '../../exercises/grade4/IdentificarDiagonalesPoligonoG4Exercise';
import { RedesCuerposGeometricosG4Exercise } from '../../exercises/grade4/RedesCuerposGeometricosG4Exercise';
import { IdentificarTransformacionesGeometricasG4Exercise } from '../../exercises/grade4/IdentificarTransformacionesGeometricasG4Exercise';
import { MedirAngulosTransportadorG4Exercise } from '../../exercises/grade4/MedirAngulosTransportadorG4Exercise'; 

// Estadistica
import { CalcularMediaG4Exercise } from '../../exercises/grade4/CalcularMediaG4Exercise';
import { IdentificarModaRangoG4Exercise } from '../../exercises/grade4/IdentificarModaRangoG4Exercise';
import { InterpretarGraficoCircularG4Exercise } from '../../exercises/grade4/InterpretarGraficoCircularG4Exercise';
import { ExperimentoAleatorioRegistroG4Exercise } from '../../exercises/grade4/ExperimentoAleatorioRegistroG4Exercise';
import { InterpretarGraficoPuntosG4Exercise } from '../../exercises/grade4/InterpretarGraficoPuntosG4Exercise'; 
import { OrganizarDatosEnTablaFrecuenciaG4Exercise } from '../../exercises/grade4/OrganizarDatosEnTablaFrecuenciaG4Exercise';
import { CrearDiagramaBarrasSimpleG4Exercise } from '../../exercises/grade4/CrearDiagramaBarrasSimpleG4Exercise';

// Probabilidad
import { ExpresarProbabilidadSimpleExercise } from '../../exercises/ExpresarProbabilidadSimpleExercise';
import { PredecirResultadosProbabilidadG4Exercise } from '../../exercises/grade4/PredecirResultadosProbabilidadG4Exercise'; 
import { SucesosDependientesIndependientesG4Exercise } from '../../exercises/grade4/SucesosDependientesIndependientesG4Exercise';


interface Grade4ExercisePageProps {
  gradeId: GradeLevel; // Will always be 4
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

const DEFAULT_EXERCISE_STARS_G4 = 10;
const COMPARISON_FACE_EMOJIS_G4 = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];


export const Grade4ExercisePage: React.FC<Grade4ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandlerG4, setExerciseSpecificKeypadHandlerG4] = useState<KeypadHandler | null>(null);
  const [customKeypadContentG4, setCustomKeypadContentG4] = useState<React.ReactNode | null>(null); 
  
  const currentScaffoldApiRef = useRef<ExerciseScaffoldApi | null>(null);
  const previousSignalValueFromScaffoldRef = useRef<number | undefined>(undefined);

  // State for COMPARAR_HASTA_10000 (reused for G4)
  const [comparisonChallengeG4, setComparisonChallengeG4] = useState<{ number1: number; number2: number; correctSymbol: ComparisonSymbol } | null>(null);
  const [comparisonSelectedSymbolG4, setComparisonSelectedSymbolG4] = useState<ComparisonSymbol | null>(null);
  const [comparisonIsVerifiedG4, setComparisonIsVerifiedG4] = useState<boolean>(false);
  const [comparisonEmojiG4, setComparisonEmojiG4] = useState<string>(COMPARISON_FACE_EMOJIS_G4[0]);
  
  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-green-500', [gradeId]);
  
  const generateNewComparisonChallengeG4 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_HASTA_10000) return;
    const { minNumber = 10000, maxNumber = 999999 } = exerciseData.data || {};
    let num1: number, num2: number;
    const forceEqual = Math.random() < 0.15;
    if (forceEqual) { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = num1; } 
    else { do { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; } while (num1 === num2); }
    let correctSym: ComparisonSymbol = num1 < num2 ? '<' : (num1 > num2 ? '>' : '=');
    setComparisonChallengeG4({ number1: num1, number2: num2, correctSymbol: correctSym });
    setComparisonSelectedSymbolG4(null); setComparisonIsVerifiedG4(false);
    setComparisonEmojiG4(COMPARISON_FACE_EMOJIS_G4[Math.floor(Math.random() * COMPARISON_FACE_EMOJIS_G4.length)]);
    currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleComparisonSymbolSelectG4 = (symbol: ComparisonSymbol) => { 
    if (comparisonIsVerifiedG4 && comparisonSelectedSymbolG4 === comparisonChallengeG4?.correctSymbol) return;
    setComparisonSelectedSymbolG4(symbol); currentScaffoldApiRef.current?.showFeedback(null);
    if (comparisonIsVerifiedG4 && comparisonSelectedSymbolG4 !== comparisonChallengeG4?.correctSymbol) setComparisonIsVerifiedG4(false);
  };
  const handleComparisonVerifyAnswerG4 = useCallback(() => { 
    if (!comparisonChallengeG4 || !comparisonSelectedSymbolG4 || (comparisonIsVerifiedG4 && comparisonSelectedSymbolG4 === comparisonChallengeG4.correctSymbol)) return;
    setComparisonIsVerifiedG4(true); const isCorrect = comparisonSelectedSymbolG4 === comparisonChallengeG4.correctSymbol;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! ${comparisonChallengeG4.number1} ${comparisonChallengeG4.correctSymbol} ${comparisonChallengeG4.number2}`});} 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: 'Ese no es el símbolo correcto. ¡Inténtalo otra vez!'}); setTimeout(() => setComparisonIsVerifiedG4(false), 1500); }
  }, [comparisonChallengeG4, comparisonSelectedSymbolG4, comparisonIsVerifiedG4]);
  
  const handleApiReady = useCallback((api: ExerciseScaffoldApi) => {
    currentScaffoldApiRef.current = api;
    const newSignalValue = api.advanceToNextChallengeSignal;
    if (newSignalValue !== undefined && newSignalValue !== previousSignalValueFromScaffoldRef.current) {
      const type = exerciseData?.componentType;
      if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG4();
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    } else if (previousSignalValueFromScaffoldRef.current === undefined && newSignalValue !== undefined) {
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    }
  }, [exerciseData, generateNewComparisonChallengeG4]);

  useEffect(() => {
    setCustomKeypadContentG4(null); 
    setExerciseSpecificKeypadHandlerG4(null);
    previousSignalValueFromScaffoldRef.current = undefined; 

    const type = exerciseData?.componentType;
    if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG4();
    else { setComparisonChallengeG4(null); }
  }, [exerciseId, subjectId, gradeId, exerciseData, generateNewComparisonChallengeG4]);
  
  const registerKeypadHandlerG4 = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandlerG4(() => handler);
  }, []);

  const setSidebarContentForExerciseG4 = useCallback((keypadNode: React.ReactNode | null) => { 
    setCustomKeypadContentG4(keypadNode);
  }, []);

  if (!exerciseData) { return ( <div className="p-6 text-center"><p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p><button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Volver al Inicio</button></div> ); }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id, exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS_G4,
    onNavigateBack, onGoHome: onNavigateBack, onAvatarClick: onNavigateToAvatar,
    onSetCompleted, currentAvatar, onApiReady: handleApiReady,
  };

  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, scaffoldApi: api, 
    registerKeypadHandler: registerKeypadHandlerG4,
    setCustomKeypadContent: setSidebarContentForExerciseG4, 
    gradeLevel: gradeId,
  });
  
  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  
  const allowDecimalForKeypadG4 = useMemo(() => {
    const type = exerciseData?.componentType;
    return (
      type === ExerciseComponentType.CALCULAR_MEDIA_G4 ||
      type === ExerciseComponentType.CONVERSION_UNIDADES_G4 ||
      exerciseData.data?.allowDecimal === true
    );
  }, [exerciseData]);

  switch (exerciseData.componentType) {
    // Numeros
    case ExerciseComponentType.ESCRIBIR_HASTA_10000: mainContentRenderer = (api) => <EscribirHasta10000Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_HASTA_10000: mainContentRenderer = () => ( <CompararHasta10000Exercise number1={comparisonChallengeG4?.number1 ?? null} number2={comparisonChallengeG4?.number2 ?? null} selectedSymbol={comparisonSelectedSymbolG4} currentEmoji={comparisonEmojiG4} questionText={exerciseData.question || "¿Cuál es el símbolo correcto?"}/>); setCustomKeypadContentG4(<ComparisonKeypad onSymbolSelect={handleComparisonSymbolSelectG4} onVerify={handleComparisonVerifyAnswerG4} selectedSymbol={comparisonSelectedSymbolG4} isVerified={comparisonIsVerifiedG4} correctSymbolForFeedback={comparisonChallengeG4?.correctSymbol ?? null} />); break;
    case ExerciseComponentType.COMPONER_HASTA_10000_TEXTO: mainContentRenderer = (api) => <ComponerHasta10000TextoExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.APROXIMAR_NUMERO: mainContentRenderer = (api) => <AproximarNumeroExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DESCOMPOSICION_POLINOMICA_G4: mainContentRenderer = (api) => <DescomposicionPolinomicaG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.NUMEROS_ROMANOS_G4: mainContentRenderer = (api) => <NumerosRomanosG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4}/>; break;
    case ExerciseComponentType.FRACCIONES_EQUIVALENTES_G4: mainContentRenderer = (api) => <FraccionesEquivalentesG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.COMPARAR_FRACCIONES_G4: mainContentRenderer = (api) => <CompararFraccionesG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.OPERAR_FRACCIONES_IGUAL_DENOMINADOR_G4: mainContentRenderer = (api) => <OperarFraccionesIgualDenominadorG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.NUMEROS_MIXTOS_INTRO_G4: mainContentRenderer = (api) => <NumerosMixtosIntroG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.DECIMALES_INTRO_FRACCION_G4: mainContentRenderer = (api) => <DecimalesIntroFraccionG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.MULTIPLOS_DIVISORES_CONCEPTO_G4: mainContentRenderer = (api) => <MultiplosDivisoresConceptoG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    
    // Operaciones
    case ExerciseComponentType.COLUMNAR_OPERATION: mainContentRenderer = (api) => <ColumnarOperationExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MULTIPLICACION_COLUMNAS: mainContentRenderer = (api) => <MultiplicacionColumnasExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DIVISION_LARGA: mainContentRenderer = (api) => <DivisionLargaExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.CALCULA_MENTALMENTE: mainContentRenderer = (api) => <CalculaMentalmenteExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.OPERACIONES_COMBINADAS_SIMPLES_G4: mainContentRenderer = (api) => <OperacionesCombinadasSimplesG4ExerciseComponent {...createExerciseContentProps(api)} />; break;
    
    // Problemas
    case ExerciseComponentType.PROBLEMAS_PASO_A_PASO: mainContentRenderer = (api) => <ProblemasMatematicosGuiadosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break; 
    case ExerciseComponentType.FINANZAS_AVANZADO: mainContentRenderer = (api) => <FinanzasAvanzadoExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.FRACCION_DE_CANTIDAD_G5: mainContentRenderer = (api) => <FraccionDeCantidadG5Exercise {...createExerciseContentProps(api)} />; break;
    
    // Medidas
    case ExerciseComponentType.CALCULAR_AREA_G4: mainContentRenderer = (api) => <CalcularAreaG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.CONVERSION_UNIDADES_G4: mainContentRenderer = (api) => <ConversionUnidadesG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.CALCULAR_TIEMPO_TRANSCURRIDO_G4: mainContentRenderer = (api) => <CalcularTiempoTranscurridoG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.VOLUMEN_CUBOS_UNITARIOS_G4: mainContentRenderer = (api) => <VolumenCubosUnitariosG4Exercise {...createExerciseContentProps(api)} />; break;

    // Geometria
    case ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO: mainContentRenderer = (api) => <IdentificarFormaGeometricaGenericoExercise {...createExerciseContentProps(api)} setExternalKeypad={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.MEDIR_ANGULOS_TRANSPORTADOR_G4: mainContentRenderer = (api) => <MedirAngulosTransportadorG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.IDENTIFICAR_DIAGONALES_POLIGONO_G4: mainContentRenderer = (api) => <IdentificarDiagonalesPoligonoG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.REDES_CUERPOS_GEOMETRICOS_G4: mainContentRenderer = (api) => <RedesCuerposGeometricosG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.IDENTIFICAR_TRANSFORMACIONES_GEOMETRICAS_G4: mainContentRenderer = (api) => <IdentificarTransformacionesGeometricasG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;

    // Estadistica
    case ExerciseComponentType.CALCULAR_MEDIA_G4: mainContentRenderer = (api) => <CalcularMediaG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.IDENTIFICAR_MODA_RANGO_G4: mainContentRenderer = (api) => <IdentificarModaRangoG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.INTERPRETAR_GRAFICO_CIRCULAR_G4: mainContentRenderer = (api) => <InterpretarGraficoCircularG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.EXPERIMENTO_ALEATORIO_REGISTRO_G4: mainContentRenderer = (api) => <ExperimentoAleatorioRegistroG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.INTERPRETAR_GRAFICO_PUNTOS_G4: mainContentRenderer = (api) => <InterpretarGraficoPuntosG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} registerKeypadHandler={registerKeypadHandlerG4} />; break;
    case ExerciseComponentType.ORGANIZAR_DATOS_EN_TABLA_FRECUENCIA_G4: mainContentRenderer = (api) => <OrganizarDatosEnTablaFrecuenciaG4Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.CREAR_DIAGRAMA_BARRAS_SIMPLE_G4: mainContentRenderer = (api) => <CrearDiagramaBarrasSimpleG4Exercise {...createExerciseContentProps(api)} />; break;

    // Probabilidad
    case ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE: mainContentRenderer = (api) => <ExpresarProbabilidadSimpleExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    case ExerciseComponentType.PREDECIR_RESULTADOS_PROBABILIDAD_G4: mainContentRenderer = (api) => <PredecirResultadosProbabilidadG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break; 
    case ExerciseComponentType.SUCESOS_DEPENDIENTES_INDEPENDIENTES_G4: mainContentRenderer = (api) => <SucesosDependientesIndependientesG4Exercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExerciseG4} />; break;
    
    case ExerciseComponentType.GENERIC: default: mainContentRenderer = () => <GenericExerciseDisplay exerciseData={exerciseData} gradeThemeColor={gradeThemeColor} onNavigateBack={onNavigateBack} onNavigateToAvatar={onNavigateToAvatar} currentAvatar={currentAvatar} />; break;
  }
  
  let finalKeypadComponentForScaffold: React.ReactNode = customKeypadContentG4; 
  if (!finalKeypadComponentForScaffold) { 
    if (exerciseSpecificKeypadHandlerG4) { 
        finalKeypadComponentForScaffold = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG4} className="w-full" allowDecimal={allowDecimalForKeypadG4} />;
    } else {
        finalKeypadComponentForScaffold = <div className="p-4 text-slate-400">Este ejercicio no requiere un teclado específico.</div>;
    }
  }

  return <ExerciseScaffold {...scaffoldProps} mainExerciseContentRenderer={mainContentRenderer} keypadComponent={finalKeypadComponentForScaffold} />;
};
