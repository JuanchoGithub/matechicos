
import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'; 
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi, TimeChallengeData, ComparisonSymbol, Coin, UnitOptionGeneric, ItemChallengeGeneric } from '../../types'; 
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../../components/icons'; 
import { NumericKeypad } from '../../components/NumericKeypad'; 
import { ExerciseScaffold } from '../../components/ExerciseScaffold'; 
import { ComparisonKeypad } from '../../components/ComparisonKeypad';
import { TimeOptionsKeypad } from '../../components/TimeOptionsKeypad';
import { UnitSelectionKeypad } from '../../components/UnitSelectionKeypad';
import { shuffleArray } from '../../utils';

// Grade 2 Specific Component Imports (or reused from other grades)
// Numeros
import { EscribirHasta10000Exercise } from '../../exercises/EscribirHasta10000Exercise'; 
import { CompararHasta10000Exercise } from '../../exercises/CompararHasta10000Exercise'; 
import { ComponerHasta10000TextoExercise } from '../../exercises/ComponerHasta10000TextoExercise'; 
import { ComponerHasta10000AbacoExercise } from '../../exercises/ComponerHasta10000AbacoExercise'; 
import { OrdenarNumerosSimpleExercise } from '../../exercises/OrdenarNumerosSimpleExercise';
import { NumeroAnteriorPosteriorExercise } from '../../exercises/NumeroAnteriorPosteriorExercise';
import { AproximarNumeroExercise } from '../../exercises/AproximarNumeroExercise'; 
import { IdentificarOrdinalesExercise } from '../../exercises/IdentificarOrdinalesExercise'; 
import { IdentificarParesImparesExercise } from '../../exercises/IdentificarParesImparesExercise';
import { CalculaMentalmenteExercise } from '../../exercises/CalculaMentalmenteExercise'; 
import { RepresentarFraccionesExercise } from '../../exercises/RepresentarFraccionesExercise';
import { VisualMultiplicationIntroExercise } from '../../exercises/grade2/VisualMultiplicationIntroExercise'; 
import { MultiplicationTablePracticeExercise } from '../../exercises/grade2/MultiplicationTablePracticeExercise'; 

// Operaciones
import { TwoDigitSimpleArithmeticExercise } from '../../exercises/TwoDigitSimpleArithmeticExercise'; 
import { ColumnarOperationExercise } from '../../exercises/ColumnarOperationExercise';
import { ProblemasMatematicosGuiadosExercise } from '../../exercises/ProblemasMatematicosGuiadosExercise';

// Medidas
import { MedirConReglaCmExercise } from '../../exercises/grade1/MedirConReglaCmExercise'; // Reused from G1
import { Balanza1KgExercise } from '../../exercises/grade1/Balanza1KgExercise'; // Reused from G1
import { LeerRelojOpcionesExercise } from '../../exercises/LeerRelojOpcionesExercise';
import { SecuenciaDiaSemanaExercise } from '../../exercises/grade1/SecuenciaDiaSemanaExercise'; // Reused from G1
import { SecuenciaMesAnioExercise } from '../../exercises/grade1/SecuenciaMesAnioExercise'; // Reused from G1
import { SumarItemsMonetariosSimplesExercise } from '../../exercises/SumarItemsMonetariosSimplesExercise'; // Reused

// Geometria
import { IdentificarFormaGeometricaGenericoExercise } from '../../exercises/IdentificarFormaGeometricaGenericoExercise'; // Reused

// Estadistica
import { InterpretarPictogramasExercise } from '../../exercises/InterpretarPictogramasExercise'; // Reused
import { InterpretarTablaSimpleExercise } from '../../exercises/InterpretarTablaSimpleExercise'; // Added

// Probabilidad
import { CertezaSucesosExercise } from '../../exercises/CertezaSucesosExercise'; // Reused
import { SimpleChanceGameExercise } from '../../exercises/grade2/SimpleChanceGameExercise'; // New import

interface Grade2ExercisePageProps {
  gradeId: GradeLevel; // Will always be 2
  subjectId: SubjectId;
  exerciseId: string;
  onNavigateBack: () => void; 
  onNavigateToMain: () => void; 
  onNavigateToAvatar: () => void;
  onSetCompleted: (exerciseId: string) => void;
}

type KeypadHandler = (key: string) => void;

// Local type for active time challenge state for G2
interface ActiveTimeChallengeRelojG2 extends TimeChallengeData {
  options: string[]; 
}

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

const DEFAULT_EXERCISE_STARS_G2 = 5; // Default for 2nd grade, can be overridden by exercise data
const COMPARISON_FACE_EMOJIS_G2 = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];
const RELOJ_FACE_EMOJIS_G2 = ['⏰', '🕰️', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯'];

export const Grade2ExercisePage: React.FC<Grade2ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandler, setExerciseSpecificKeypadHandler] = useState<KeypadHandler | null>(null);
  const [customKeypadContentG2, setCustomKeypadContentG2] = useState<React.ReactNode | null>(null); 
  
  const currentScaffoldApiRef = useRef<ExerciseScaffoldApi | null>(null);
  const previousSignalValueFromScaffoldRef = useRef<number | undefined>(undefined);

  // State for COMPARAR_HASTA_10000
  const [comparisonChallengeG2, setComparisonChallengeG2] = useState<{ number1: number; number2: number; correctSymbol: ComparisonSymbol } | null>(null);
  const [comparisonSelectedSymbolG2, setComparisonSelectedSymbolG2] = useState<ComparisonSymbol | null>(null);
  const [comparisonIsVerifiedG2, setComparisonIsVerifiedG2] = useState<boolean>(false);
  const [comparisonEmojiG2, setComparisonEmojiG2] = useState<string>(COMPARISON_FACE_EMOJIS_G2[0]);
  
  // State for LEER_RELOJ_OPCIONES
  const [currentTimeChallengeRelojG2, setCurrentTimeChallengeRelojG2] = useState<ActiveTimeChallengeRelojG2 | null>(null);
  const [availableTimeChallengesRelojG2, setAvailableTimeChallengesRelojG2] = useState<TimeChallengeData[]>([]);
  const [selectedTimeOptionRelojG2, setSelectedTimeOptionRelojG2] = useState<string | null>(null);
  const [isVerifiedRelojG2, setIsVerifiedRelojG2] = useState<boolean>(false);
  const [relojEmojiG2, setRelojEmojiG2] = useState<string>(RELOJ_FACE_EMOJIS_G2[0]);

  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-orange-500', [gradeId]);
  
  // Specific logic for COMPARAR_HASTA_10000
  const generateNewComparisonChallengeG2 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_HASTA_10000) return;
    const { minNumber = 0, maxNumber = 200 } = exerciseData.data || {};
    let num1: number, num2: number;
    const forceEqual = Math.random() < 0.15;
    if (forceEqual) { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = num1; } 
    else { do { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; } while (num1 === num2); }
    let correctSym: ComparisonSymbol = num1 < num2 ? '<' : (num1 > num2 ? '>' : '=');
    setComparisonChallengeG2({ number1: num1, number2: num2, correctSymbol: correctSym });
    setComparisonSelectedSymbolG2(null); setComparisonIsVerifiedG2(false);
    setComparisonEmojiG2(COMPARISON_FACE_EMOJIS_G2[Math.floor(Math.random() * COMPARISON_FACE_EMOJIS_G2.length)]);
    currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleComparisonSymbolSelectG2 = (symbol: ComparisonSymbol) => { 
    if (comparisonIsVerifiedG2 && comparisonSelectedSymbolG2 === comparisonChallengeG2?.correctSymbol) return;
    setComparisonSelectedSymbolG2(symbol); currentScaffoldApiRef.current?.showFeedback(null);
    if (comparisonIsVerifiedG2 && comparisonSelectedSymbolG2 !== comparisonChallengeG2?.correctSymbol) setComparisonIsVerifiedG2(false);
  };
  const handleComparisonVerifyAnswerG2 = useCallback(() => { 
    if (!comparisonChallengeG2 || !comparisonSelectedSymbolG2 || (comparisonIsVerifiedG2 && comparisonSelectedSymbolG2 === comparisonChallengeG2.correctSymbol)) return;
    setComparisonIsVerifiedG2(true); const isCorrect = comparisonSelectedSymbolG2 === comparisonChallengeG2.correctSymbol;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! ${comparisonChallengeG2.number1} ${comparisonChallengeG2.correctSymbol} ${comparisonChallengeG2.number2}`});} 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: 'Ese no es el símbolo correcto. ¡Inténtalo otra vez!'}); setTimeout(() => setComparisonIsVerifiedG2(false), 1500); }
  }, [comparisonChallengeG2, comparisonSelectedSymbolG2, comparisonIsVerifiedG2]);
  
  // Specific logic for LEER_RELOJ_OPCIONES
  const generateNewTimeChallengeRelojG2 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.LEER_RELOJ_OPCIONES) return;
    setAvailableTimeChallengesRelojG2(currentPool => {
        let poolToUse = currentPool; const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] | undefined;
        if (poolToUse.length === 0 && timeChallengesRaw && timeChallengesRaw.length > 0) { poolToUse = shuffleArray([...timeChallengesRaw]); }
        if (poolToUse.length > 0) {
            const nextChallengeData = poolToUse[0];
            let rawOptions = [...nextChallengeData.distractors, nextChallengeData.correctText]; let finalOptions = shuffleArray(rawOptions);
            const uniqueOptions = Array.from(new Set(finalOptions));
            if (uniqueOptions.length < 4) { const genericWrongTimes = ["Son las siete y diez", "Son las cuatro menos cinco", "Es la una en punto", "Son las once y veinte", "Son las dos y media", "Son las cinco y cuarto"]; let i = 0; while(uniqueOptions.length < 4 && i < genericWrongTimes.length){ if(!uniqueOptions.includes(genericWrongTimes[i])) uniqueOptions.push(genericWrongTimes[i]); i++; } }
            finalOptions = shuffleArray(uniqueOptions.slice(0,4));
            if (!finalOptions.includes(nextChallengeData.correctText) && finalOptions.length === 4) { finalOptions[Math.floor(Math.random() * 4)] = nextChallengeData.correctText; finalOptions = shuffleArray(finalOptions); } else if (!finalOptions.includes(nextChallengeData.correctText)) { finalOptions.push(nextChallengeData.correctText); finalOptions = shuffleArray(finalOptions.slice(0,4));}
            setCurrentTimeChallengeRelojG2({ ...nextChallengeData, options: finalOptions });
            setRelojEmojiG2(nextChallengeData.emoji || RELOJ_FACE_EMOJIS_G2[Math.floor(Math.random() * RELOJ_FACE_EMOJIS_G2.length)]);
            return poolToUse.slice(1);
        } else { setCurrentTimeChallengeRelojG2(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedTimeOptionRelojG2(null); setIsVerifiedRelojG2(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleTimeOptionSelectRelojG2 = (option: string) => { 
    if (isVerifiedRelojG2 && selectedTimeOptionRelojG2 === currentTimeChallengeRelojG2?.correctText) return;
    setSelectedTimeOptionRelojG2(option); currentScaffoldApiRef.current?.showFeedback(null);
    if (isVerifiedRelojG2 && selectedTimeOptionRelojG2 !== currentTimeChallengeRelojG2?.correctText) setIsVerifiedRelojG2(false);
  };
  const handleVerifyTimeAnswerRelojG2 = useCallback(() => { 
    if (!currentTimeChallengeRelojG2 || !selectedTimeOptionRelojG2 || (isVerifiedRelojG2 && selectedTimeOptionRelojG2 === currentTimeChallengeRelojG2.correctText)) return;
    setIsVerifiedRelojG2(true); const isCorrect = selectedTimeOptionRelojG2 === currentTimeChallengeRelojG2.correctText;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({ type: 'correct', message: `¡Correcto! ${currentTimeChallengeRelojG2.correctText}.` }); } 
    else { currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: `No es correcto. La hora es: "${currentTimeChallengeRelojG2.correctText}".` }); setTimeout(() => setIsVerifiedRelojG2(false), 1500); }
  }, [currentTimeChallengeRelojG2, selectedTimeOptionRelojG2, isVerifiedRelojG2]);

  const handleApiReady = useCallback((api: ExerciseScaffoldApi) => {
    currentScaffoldApiRef.current = api;
    const newSignalValue = api.advanceToNextChallengeSignal;
    if (newSignalValue !== undefined && newSignalValue !== previousSignalValueFromScaffoldRef.current) {
      const type = exerciseData?.componentType;
      if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG2();
      else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) generateNewTimeChallengeRelojG2();
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    } else if (previousSignalValueFromScaffoldRef.current === undefined && newSignalValue !== undefined) {
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    }
  }, [exerciseData, generateNewComparisonChallengeG2, generateNewTimeChallengeRelojG2]);

  useEffect(() => {
    setCustomKeypadContentG2(null); 
    setExerciseSpecificKeypadHandler(null);
    previousSignalValueFromScaffoldRef.current = undefined; 

    const type = exerciseData?.componentType;
    if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG2();
    else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) {
      const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] || [];
      setAvailableTimeChallengesRelojG2(shuffleArray([...timeChallengesRaw]));
      generateNewTimeChallengeRelojG2();
    }
    else { setComparisonChallengeG2(null); setCurrentTimeChallengeRelojG2(null); }
  }, [exerciseId, exerciseData, generateNewComparisonChallengeG2, generateNewTimeChallengeRelojG2]);
  
  const registerKeypadHandlerG2 = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandler(() => handler);
  }, []);

  const setSidebarContentForExercise = useCallback((keypadNode: React.ReactNode | null) => { 
    setCustomKeypadContentG2(keypadNode);
  }, []);

  if (!exerciseData) { return ( <div className="p-6 text-center"><p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p><button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Volver al Inicio</button></div> ); }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id, exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS_G2,
    onNavigateBack, onGoHome: onNavigateBack, onAvatarClick: onNavigateToAvatar,
    onSetCompleted, currentAvatar, onApiReady: handleApiReady,
  };

  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, scaffoldApi: api, 
    registerKeypadHandler: registerKeypadHandlerG2,
    setCustomKeypadContent: setSidebarContentForExercise,
    gradeLevel: gradeId, 
  });
  
  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  let keypadToRender: React.ReactNode = null; 
  let allowDecimalForKeypad = false;
  
  const isSidebarExercise = 
    exerciseData.componentType === ExerciseComponentType.COMPARAR_HASTA_10000 ||
    exerciseData.componentType === ExerciseComponentType.LEER_RELOJ_OPCIONES ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_ORDINALES ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_PARES_IMPARES ||
    exerciseData.componentType === ExerciseComponentType.REPRESENTAR_FRACCIONES ||
    exerciseData.componentType === ExerciseComponentType.BALANZA_1KG ||
    exerciseData.componentType === ExerciseComponentType.SECUENCIA_DIA_SEMANA ||
    exerciseData.componentType === ExerciseComponentType.SECUENCIA_MES_ANIO ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_PICTOGRAMAS ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE || 
    exerciseData.componentType === ExerciseComponentType.CERTEZA_SUCESOS ||
    exerciseData.componentType === ExerciseComponentType.SIMPLE_CHANCE_GAME || // Added
    exerciseData.componentType === ExerciseComponentType.PROBLEMAS_PASO_A_PASO;


  switch (exerciseData.componentType) {
    // Numeros
    case ExerciseComponentType.ESCRIBIR_HASTA_10000: mainContentRenderer = (api) => <EscribirHasta10000Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_HASTA_10000: mainContentRenderer = () => ( <CompararHasta10000Exercise number1={comparisonChallengeG2?.number1 ?? null} number2={comparisonChallengeG2?.number2 ?? null} selectedSymbol={comparisonSelectedSymbolG2} currentEmoji={comparisonEmojiG2} questionText={exerciseData.question || "¿Cuál es el símbolo correcto?"}/>); keypadToRender = (<ComparisonKeypad onSymbolSelect={handleComparisonSymbolSelectG2} onVerify={handleComparisonVerifyAnswerG2} selectedSymbol={comparisonSelectedSymbolG2} isVerified={comparisonIsVerifiedG2} correctSymbolForFeedback={comparisonChallengeG2?.correctSymbol ?? null} />); break;
    case ExerciseComponentType.COMPONER_HASTA_10000_TEXTO: mainContentRenderer = (api) => <ComponerHasta10000TextoExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPONER_HASTA_10000_ABACO: mainContentRenderer = (api) => <ComponerHasta10000AbacoExercise {...createExerciseContentProps(api)} />; break; 
    case ExerciseComponentType.ORDENAR_NUMEROS_SIMPLE: mainContentRenderer = (api) => <OrdenarNumerosSimpleExercise {...createExerciseContentProps(api)} />; break; 
    case ExerciseComponentType.NUMERO_ANTERIOR_POSTERIOR: mainContentRenderer = (api) => <NumeroAnteriorPosteriorExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.APROXIMAR_NUMERO: mainContentRenderer = (api) => <AproximarNumeroExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.IDENTIFICAR_ORDINALES: mainContentRenderer = (api) => <IdentificarOrdinalesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break; 
    case ExerciseComponentType.IDENTIFICAR_PARES_IMPARES: mainContentRenderer = (api) => <IdentificarParesImparesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.CALCULA_MENTALMENTE: mainContentRenderer = (api) => <CalculaMentalmenteExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.REPRESENTAR_FRACCIONES: mainContentRenderer = (api) => <RepresentarFraccionesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.VISUAL_MULTIPLICATION_INTRO: mainContentRenderer = (api) => <VisualMultiplicationIntroExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MULTIPLICATION_TABLE_PRACTICE: mainContentRenderer = (api) => <MultiplicationTablePracticeExercise {...createExerciseContentProps(api)} />; break;
    // Operaciones
    case ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS: mainContentRenderer = (api) => <TwoDigitSimpleArithmeticExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COLUMNAR_OPERATION: mainContentRenderer = (api) => <ColumnarOperationExercise {...createExerciseContentProps(api)} />; break;
    // Problemas
    case ExerciseComponentType.PROBLEMAS_PASO_A_PASO: mainContentRenderer = (api) => <ProblemasMatematicosGuiadosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG2} />; break; 
    // Medidas
    case ExerciseComponentType.MEDIR_CON_REGLA_CM: mainContentRenderer = (api) => <MedirConReglaCmExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.BALANZA_1KG: mainContentRenderer = (api) => <Balanza1KgExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.LEER_RELOJ_OPCIONES: mainContentRenderer = () => (<LeerRelojOpcionesExercise hours={currentTimeChallengeRelojG2?.hours ?? 0} minutes={currentTimeChallengeRelojG2?.minutes ?? 0} currentEmoji={relojEmojiG2} questionText={exerciseData.question || "¿Qué hora es?"}/>); keypadToRender = (<TimeOptionsKeypad options={currentTimeChallengeRelojG2?.options || []} selectedOption={selectedTimeOptionRelojG2} onOptionSelect={handleTimeOptionSelectRelojG2} onVerify={handleVerifyTimeAnswerRelojG2} isVerified={isVerifiedRelojG2} correctAnswerText={currentTimeChallengeRelojG2?.correctText || null}/>); break;
    case ExerciseComponentType.SECUENCIA_DIA_SEMANA: mainContentRenderer = (api) => <SecuenciaDiaSemanaExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.SECUENCIA_MES_ANIO: mainContentRenderer = (api) => <SecuenciaMesAnioExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.SUMAR_ITEMS_MONETARIOS_SIMPLES: mainContentRenderer = (api) => <SumarItemsMonetariosSimplesExercise {...createExerciseContentProps(api)} />; break;
    // Geometria
    case ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO: mainContentRenderer = (api) => <IdentificarFormaGeometricaGenericoExercise {...createExerciseContentProps(api)} setExternalKeypad={setSidebarContentForExercise} />; break;
    // Estadistica
    case ExerciseComponentType.INTERPRETAR_PICTOGRAMAS: mainContentRenderer = (api) => <InterpretarPictogramasExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE: mainContentRenderer = (api) => <InterpretarTablaSimpleExercise {...createExerciseContentProps(api)} setExternalKeypad={setSidebarContentForExercise} />; break;
    // Probabilidad
    case ExerciseComponentType.CERTEZA_SUCESOS: mainContentRenderer = (api) => <CertezaSucesosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;
    case ExerciseComponentType.SIMPLE_CHANCE_GAME: mainContentRenderer = (api) => <SimpleChanceGameExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setSidebarContentForExercise} />; break;

    case ExerciseComponentType.GENERIC: default: mainContentRenderer = (api) => <GenericExerciseDisplay exerciseData={exerciseData} gradeThemeColor={gradeThemeColor} onNavigateBack={onNavigateBack} onNavigateToAvatar={onNavigateToAvatar} currentAvatar={currentAvatar} />; keypadToRender = null; break;
  }
  
  let finalKeypadComponentForScaffold: React.ReactNode = null;
  if (customKeypadContentG2) {
    finalKeypadComponentForScaffold = customKeypadContentG2;
  } else if (isSidebarExercise && keypadToRender) {
    finalKeypadComponentForScaffold = keypadToRender; 
  } else if (isSidebarExercise) {
    finalKeypadComponentForScaffold = <div className="p-4 text-slate-400">Cargando opciones...</div>;
  } else if (keypadToRender) { 
    finalKeypadComponentForScaffold = keypadToRender;
  } else if (exerciseSpecificKeypadHandler) { 
    finalKeypadComponentForScaffold = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandler} className="w-full" allowDecimal={allowDecimalForKeypad} />;
  } else {
    finalKeypadComponentForScaffold = <div className="p-4 text-slate-400">No se requiere teclado para este ejercicio.</div>;
  }

  return <ExerciseScaffold {...scaffoldProps} mainExerciseContentRenderer={mainContentRenderer} keypadComponent={finalKeypadComponentForScaffold} />;
};
