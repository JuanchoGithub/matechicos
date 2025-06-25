
import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'; 
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi, TimeChallengeData, ComparisonSymbol, Coin, UnitOptionGeneric, ItemChallengeGeneric } from '../../types'; 
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../../components/icons'; 
import { NumericKeypad } from '../../components/NumericKeypad'; 
import { ExerciseScaffold } from '../../components/ExerciseScaffold'; 
import { ComparisonKeypad } from '../../components/ComparisonKeypad';
import { MonetaryComparisonKeypad, MonetaryComparisonOption } from '../../components/MonetaryComparisonKeypad';
import { UnitSelectionKeypad } from '../../components/UnitSelectionKeypad';
import { TimeOptionsKeypad } from '../../components/TimeOptionsKeypad';
import { shuffleArray } from '../../utils';

// Numeros G3
import { EscribirHasta10000Exercise } from '../../exercises/EscribirHasta10000Exercise'; 
import { CompararHasta10000Exercise } from '../../exercises/CompararHasta10000Exercise'; 
import { ComponerHasta10000AbacoExercise } from '../../exercises/ComponerHasta10000AbacoExercise'; 
import { ComponerHasta10000TextoExercise } from '../../exercises/ComponerHasta10000TextoExercise'; 
import { AproximarNumeroExercise } from '../../exercises/AproximarNumeroExercise'; 
import { IdentificarOrdinalesExercise } from '../../exercises/IdentificarOrdinalesExercise'; 
import { TwoDigitSimpleArithmeticExercise } from '../../exercises/TwoDigitSimpleArithmeticExercise'; 
import { CalculaMentalmenteExercise } from '../../exercises/CalculaMentalmenteExercise'; 
import { LeerFraccionesPropiasExercise } from '../../exercises/LeerFraccionesPropiasExercise';
import { RepresentarFraccionesExercise } from '../../exercises/RepresentarFraccionesExercise';
import { EscribirFraccionesPropiasExercise } from '../../exercises/EscribirFraccionesPropiasExercise';

// Operaciones G3
import { ColumnarOperationExercise } from '../../exercises/ColumnarOperationExercise';
import { MultiplicacionColumnasExercise } from '../../exercises/MultiplicacionColumnasExercise';
import { DivisionSimpleExercise } from '../../exercises/DivisionSimpleExercise';
import { DivisionLargaExercise } from '../../exercises/DivisionLargaExercise';

// Problemas G3
import { ProblemasMatematicosGuiadosExercise } from '../../exercises/ProblemasMatematicosGuiadosExercise';

// Medidas G3
import { ConvertirMetrosACmExercise } from '../../exercises/ConvertirMetrosACmExercise';
import { IdentificarUnidadMedidaGenericoExercise } from '../../exercises/IdentificarUnidadMedidaGenericoExercise';
import { ProblemasCapacidadSumaRestaExercise } from '../../exercises/ProblemasCapacidadSumaRestaExercise';
import { LeerRelojOpcionesExercise } from '../../exercises/LeerRelojOpcionesExercise'; 
import { ConvertirSumarCapacidadMlExercise } from '../../exercises/ConvertirSumarCapacidadMlExercise';
import { CompararMonedasConPesoExercise } from '../../exercises/CompararMonedasConPesoExercise';
import { SumarItemsMonetariosSimplesExercise } from '../../exercises/SumarItemsMonetariosSimplesExercise';
import { SumarMonedasPesosCentavosExercise } from '../../exercises/SumarMonedasPesosCentavosExercise';

// Geometria G3
import { IdentificarFormaGeometricaGenericoExercise } from '../../exercises/IdentificarFormaGeometricaGenericoExercise';
import { IdentificarPartesCirculoExercise } from '../../exercises/IdentificarPartesCirculoExercise';
import { CalcularPerimetroPoligonoSimpleExercise } from '../../exercises/CalcularPerimetroPoligonoSimpleExercise';

// Estadistica G3
import { TestInterpretarDiagramasBarras } from '../../exercises/TestInterpretarDiagramasBarras';
import { InterpretarTablaSimpleExercise } from '../../exercises/InterpretarTablaSimpleExercise';
import { UbicarEnTablaExercise } from '../../exercises/UbicarEnTablaExercise';
import { InterpretarTablaDobleEntradaExercise } from '../../exercises/InterpretarTablaDobleEntradaExercise';
import { CompletarTablaDatosFaltantesExercise } from '../../exercises/CompletarTablaDatosFaltantesExercise';
import { OrdenarDatosEnTablaExercise } from '../../exercises/OrdenarDatosEnTablaExercise';
import { CompararTablasSimplesExercise } from '../../exercises/CompararTablasSimplesExercise';
import { InterpretarDiagramaLinealSimpleExercise } from '../../exercises/InterpretarDiagramaLinealSimpleExercise';
import { InterpretarDiagramaDosLineasExercise } from '../../exercises/InterpretarDiagramaDosLineasExercise';

// Probabilidad G3
import { CertezaSucesosExercise } from '../../exercises/CertezaSucesosExercise';
import { CompararProbabilidadesExercise } from '../../exercises/CompararProbabilidadesExercise';
import { ExpresarProbabilidadSimpleExercise } from '../../exercises/ExpresarProbabilidadSimpleExercise';
import { FrecuenciaSucesosExercise } from '../../exercises/FrecuenciaSucesosExercise';


interface Grade3ExercisePageProps {
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

const DEFAULT_EXERCISE_STARS_G3 = 10;
const COMPARISON_FACE_EMOJIS_G3 = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];
const MEDIDAS_FACE_EMOJIS_G3 = ['📏', '⚖️', '💧', '🤔', '🧐', '💡', '🎯', '💯'];
const RELOJ_FACE_EMOJIS_G3 = ['⏰', '🕰️', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯'];
const MONETARY_COMPARISON_EMOJIS_G3 = ['💰', '🪙', '🤔', '🧐', '💡', '👀'];

interface ActiveTimeChallengeRelojG3 extends TimeChallengeData {
  options: string[];
}
interface CoinCollectionChallengeG3 {
  coins: Coin[];
  correctOption: MonetaryComparisonOption;
  emoji?: string;
}

export const Grade3ExercisePage: React.FC<Grade3ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandler, setExerciseSpecificKeypadHandler] = useState<KeypadHandler | null>(null);
  const [customKeypadContent, setCustomKeypadContent] = useState<React.ReactNode | null>(null); 

  const currentScaffoldApiRef = useRef<ExerciseScaffoldApi | null>(null);
  const previousSignalValueFromScaffoldRef = useRef<number | undefined>(undefined);

  const [comparisonChallengeG3, setComparisonChallengeG3] = useState<{ number1: number; number2: number; correctSymbol: ComparisonSymbol } | null>(null);
  const [comparisonSelectedSymbolG3, setComparisonSelectedSymbolG3] = useState<ComparisonSymbol | null>(null);
  const [comparisonIsVerifiedG3, setComparisonIsVerifiedG3] = useState<boolean>(false);
  const [comparisonEmojiG3, setComparisonEmojiG3] = useState<string>(COMPARISON_FACE_EMOJIS_G3[0]);
  
  const [currentTimeChallengeRelojG3, setCurrentTimeChallengeRelojG3] = useState<ActiveTimeChallengeRelojG3 | null>(null);
  const [availableTimeChallengesRelojG3, setAvailableTimeChallengesRelojG3] = useState<TimeChallengeData[]>([]);
  const [selectedTimeOptionRelojG3, setSelectedTimeOptionRelojG3] = useState<string | null>(null);
  const [isVerifiedRelojG3, setIsVerifiedRelojG3] = useState<boolean>(false);
  const [relojEmojiG3, setRelojEmojiG3] = useState<string>(RELOJ_FACE_EMOJIS_G3[0]);

  const [coinCollectionChallengeG3, setCoinCollectionChallengeG3] = useState<CoinCollectionChallengeG3 | null>(null);
  const [availableCoinCollectionsG3, setAvailableCoinCollectionsG3] = useState<any[]>([]);
  const [selectedMonetaryComparisonOptionG3, setSelectedMonetaryComparisonOptionG3] = useState<MonetaryComparisonOption | null>(null);
  const [isMonetaryComparisonVerifiedG3, setIsMonetaryComparisonVerifiedG3] = useState<boolean>(false);
  const [monetaryComparisonEmojiG3, setMonetaryComparisonEmojiG3] = useState<string>(MONETARY_COMPARISON_EMOJIS_G3[0]);
  
  const [activeUnitChallengeG3, setActiveUnitChallengeG3] = useState<ItemChallengeGeneric | null>(null);
  const [availableUnitItemsG3, setAvailableUnitItemsG3] = useState<ItemChallengeGeneric[]>([]);
  const [selectedUnitOptionG3, setSelectedUnitOptionG3] = useState<string | null>(null);
  const [isUnitVerifiedG3, setIsUnitVerifiedG3] = useState<boolean>(false);
  const [unitChallengeEmojiG3, setUnitChallengeEmojiG3] = useState<string>(MEDIDAS_FACE_EMOJIS_G3[0]);
  const [currentUnitOptionsG3, setCurrentUnitOptionsG3] = useState<UnitOptionGeneric[]>([]);

  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-yellow-500', [gradeId]);
  
  const generateNewComparisonChallengeG3 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_HASTA_10000) return;
    const { minNumber = 100, maxNumber = 10000 } = exerciseData.data || {};
    let num1: number, num2: number;
    const forceEqual = Math.random() < 0.15;
    if (forceEqual) { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = num1; } 
    else { do { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; } while (num1 === num2); }
    let correctSym: ComparisonSymbol = num1 < num2 ? '<' : (num1 > num2 ? '>' : '=');
    setComparisonChallengeG3({ number1: num1, number2: num2, correctSymbol: correctSym });
    setComparisonSelectedSymbolG3(null); setComparisonIsVerifiedG3(false);
    setComparisonEmojiG3(COMPARISON_FACE_EMOJIS_G3[Math.floor(Math.random() * COMPARISON_FACE_EMOJIS_G3.length)]);
    currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleComparisonSymbolSelectG3 = (symbol: ComparisonSymbol) => { 
    if (comparisonIsVerifiedG3 && comparisonSelectedSymbolG3 === comparisonChallengeG3?.correctSymbol) return;
    setComparisonSelectedSymbolG3(symbol); currentScaffoldApiRef.current?.showFeedback(null);
    if (comparisonIsVerifiedG3 && comparisonSelectedSymbolG3 !== comparisonChallengeG3?.correctSymbol) setComparisonIsVerifiedG3(false);
  };
  const handleComparisonVerifyAnswerG3 = useCallback(() => { 
    if (!comparisonChallengeG3 || !comparisonSelectedSymbolG3 || (comparisonIsVerifiedG3 && comparisonSelectedSymbolG3 === comparisonChallengeG3.correctSymbol)) return;
    setComparisonIsVerifiedG3(true); const isCorrect = comparisonSelectedSymbolG3 === comparisonChallengeG3.correctSymbol;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! ${comparisonChallengeG3.number1} ${comparisonChallengeG3.correctSymbol} ${comparisonChallengeG3.number2}`});} 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: 'Ese no es el símbolo correcto. ¡Inténtalo otra vez!'}); setTimeout(() => setComparisonIsVerifiedG3(false), 1500); }
  }, [comparisonChallengeG3, comparisonSelectedSymbolG3, comparisonIsVerifiedG3]);
  
  const generateNewTimeChallengeRelojG3 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.LEER_RELOJ_OPCIONES) return;
    setAvailableTimeChallengesRelojG3(currentPool => {
        let poolToUse = currentPool; const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] | undefined;
        if (poolToUse.length === 0 && timeChallengesRaw && timeChallengesRaw.length > 0) { poolToUse = shuffleArray([...timeChallengesRaw]); }
        if (poolToUse.length > 0) {
            const nextChallengeData = poolToUse[0];
            let rawOptions = [...nextChallengeData.distractors, nextChallengeData.correctText]; let finalOptions = shuffleArray(rawOptions);
            const uniqueOptions = Array.from(new Set(finalOptions));
            if (uniqueOptions.length < 4) { const genericWrongTimes = ["Son las siete y diez", "Son las cuatro menos cinco", "Es la una en punto", "Son las once y veinte", "Son las dos y media", "Son las cinco y cuarto"]; let i = 0; while(uniqueOptions.length < 4 && i < genericWrongTimes.length){ if(!uniqueOptions.includes(genericWrongTimes[i])) uniqueOptions.push(genericWrongTimes[i]); i++; } }
            finalOptions = shuffleArray(uniqueOptions.slice(0,4));
            if (!finalOptions.includes(nextChallengeData.correctText) && finalOptions.length === 4) { finalOptions[Math.floor(Math.random() * 4)] = nextChallengeData.correctText; finalOptions = shuffleArray(finalOptions); } else if (!finalOptions.includes(nextChallengeData.correctText)) { finalOptions.push(nextChallengeData.correctText); finalOptions = shuffleArray(finalOptions.slice(0,4));}
            setCurrentTimeChallengeRelojG3({ ...nextChallengeData, options: finalOptions });
            setRelojEmojiG3(nextChallengeData.emoji || RELOJ_FACE_EMOJIS_G3[Math.floor(Math.random() * RELOJ_FACE_EMOJIS_G3.length)]);
            return poolToUse.slice(1);
        } else { setCurrentTimeChallengeRelojG3(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedTimeOptionRelojG3(null); setIsVerifiedRelojG3(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleTimeOptionSelectRelojG3 = (option: string) => { 
    if (isVerifiedRelojG3 && selectedTimeOptionRelojG3 === currentTimeChallengeRelojG3?.correctText) return;
    setSelectedTimeOptionRelojG3(option); currentScaffoldApiRef.current?.showFeedback(null);
    if (isVerifiedRelojG3 && selectedTimeOptionRelojG3 !== currentTimeChallengeRelojG3?.correctText) setIsVerifiedRelojG3(false);
  };
  const handleVerifyTimeAnswerRelojG3 = useCallback(() => { 
    if (!currentTimeChallengeRelojG3 || !selectedTimeOptionRelojG3 || (isVerifiedRelojG3 && selectedTimeOptionRelojG3 === currentTimeChallengeRelojG3.correctText)) return;
    setIsVerifiedRelojG3(true); const isCorrect = selectedTimeOptionRelojG3 === currentTimeChallengeRelojG3.correctText;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({ type: 'correct', message: `¡Correcto! ${currentTimeChallengeRelojG3.correctText}.` }); } 
    else { currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: `No es correcto. La hora es: "${currentTimeChallengeRelojG3.correctText}".` }); setTimeout(() => setIsVerifiedRelojG3(false), 1500); }
  }, [currentTimeChallengeRelojG3, selectedTimeOptionRelojG3, isVerifiedRelojG3]);

  const generateNewCoinCollectionChallengeG3 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) return;
    setAvailableCoinCollectionsG3(currentPool => {
        let poolToUse = currentPool; const coinCollectionsRaw = exerciseData.data?.coinCollections as any[] | undefined;
        if (poolToUse.length === 0 && coinCollectionsRaw && coinCollectionsRaw.length > 0) { poolToUse = shuffleArray([...coinCollectionsRaw]); }
        if (poolToUse.length > 0) { const nextCollectionData = poolToUse[0];
            setCoinCollectionChallengeG3({ coins: nextCollectionData.coins, correctOption: nextCollectionData.correctOption, emoji: nextCollectionData.emoji || MONETARY_COMPARISON_EMOJIS_G3[Math.floor(Math.random() * MONETARY_COMPARISON_EMOJIS_G3.length)] });
            return poolToUse.slice(1);
        } else { setCoinCollectionChallengeG3(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedMonetaryComparisonOptionG3(null); setIsMonetaryComparisonVerifiedG3(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleMonetaryComparisonOptionSelectG3 = (option: MonetaryComparisonOption) => { 
    if (isMonetaryComparisonVerifiedG3 && selectedMonetaryComparisonOptionG3 === coinCollectionChallengeG3?.correctOption) return;
    setSelectedMonetaryComparisonOptionG3(option); currentScaffoldApiRef.current?.showFeedback(null);
    if (isMonetaryComparisonVerifiedG3 && selectedMonetaryComparisonOptionG3 !== coinCollectionChallengeG3?.correctOption) setIsMonetaryComparisonVerifiedG3(false);
  };
  const handleVerifyMonetaryComparisonAnswerG3 = useCallback(() => { 
    if (!coinCollectionChallengeG3 || !selectedMonetaryComparisonOptionG3 || (isMonetaryComparisonVerifiedG3 && selectedMonetaryComparisonOptionG3 === coinCollectionChallengeG3.correctOption)) return;
    setIsMonetaryComparisonVerifiedG3(true); const totalValueCents = coinCollectionChallengeG3.coins.reduce((sum, coin) => sum + (coin.value * coin.count), 0);
    let actualComparison: MonetaryComparisonOption; if (totalValueCents < 100) actualComparison = 'less'; else if (totalValueCents === 100) actualComparison = 'equal'; else actualComparison = 'more';
    const isCorrect = selectedMonetaryComparisonOptionG3 === actualComparison && selectedMonetaryComparisonOptionG3 === coinCollectionChallengeG3.correctOption;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! El valor es ${actualComparison === 'less' ? 'menor que' : actualComparison === 'equal' ? 'igual a' : 'mayor que'} $1.`}); } 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: `Incorrecto. El valor es ${actualComparison === 'less' ? 'menor que' : actualComparison === 'equal' ? 'igual a' : 'mayor que'} $1.`}); setTimeout(() => setIsMonetaryComparisonVerifiedG3(false), 1500); }
  }, [coinCollectionChallengeG3, selectedMonetaryComparisonOptionG3, isMonetaryComparisonVerifiedG3]);
  
  const generateNewUnitChallengeG3 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.IDENTIFICAR_UNIDAD_MEDIDA_GENERICO) return;
    setAvailableUnitItemsG3(currentPool => {
        let poolToUse = currentPool; const itemChallengesFromData = exerciseData.data?.itemChallenges as ItemChallengeGeneric[] | undefined;
        if (poolToUse.length === 0 && itemChallengesFromData && itemChallengesFromData.length > 0) { poolToUse = shuffleArray([...itemChallengesFromData]); }
        if (poolToUse.length > 0) { const nextItem = poolToUse[0]; setActiveUnitChallengeG3(nextItem);
            setUnitChallengeEmojiG3(nextItem.emoji || MEDIDAS_FACE_EMOJIS_G3[Math.floor(Math.random() * MEDIDAS_FACE_EMOJIS_G3.length)]);
            return poolToUse.slice(1);
        } else { setActiveUnitChallengeG3(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedUnitOptionG3(null); setIsUnitVerifiedG3(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleUnitOptionSelectG3 = (unitId: string) => { 
    if (isUnitVerifiedG3 && selectedUnitOptionG3 === activeUnitChallengeG3?.correctUnit) return;
    setSelectedUnitOptionG3(unitId); currentScaffoldApiRef.current?.showFeedback(null);
    if (isUnitVerifiedG3 && selectedUnitOptionG3 !== activeUnitChallengeG3?.correctUnit) setIsUnitVerifiedG3(false);
  };
  const handleUnitVerifyAnswerG3 = useCallback(() => { 
    if (!activeUnitChallengeG3 || !selectedUnitOptionG3 || (isUnitVerifiedG3 && selectedUnitOptionG3 === activeUnitChallengeG3.correctUnit)) return;
    setIsUnitVerifiedG3(true); const isCorrect = selectedUnitOptionG3 === activeUnitChallengeG3.correctUnit;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    const correctUnitLabel = currentUnitOptionsG3.find(opt => opt.unitId === activeUnitChallengeG3.correctUnit)?.fullLabel || activeUnitChallengeG3.correctUnit;
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({ type: 'correct', message: activeUnitChallengeG3.feedbackMessages?.correct || `¡Correcto! Usarías ${correctUnitLabel} para ${activeUnitChallengeG3.description}.`}); } 
    else { currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: activeUnitChallengeG3.feedbackMessages?.incorrect || `No es la unidad más adecuada. Para ${activeUnitChallengeG3.description} es mejor ${correctUnitLabel}.`}); setTimeout(() => setIsUnitVerifiedG3(false), 1500); }
  }, [activeUnitChallengeG3, selectedUnitOptionG3, isUnitVerifiedG3, currentUnitOptionsG3]);

  const handleApiReady = useCallback((api: ExerciseScaffoldApi) => {
    currentScaffoldApiRef.current = api;
    const newSignalValue = api.advanceToNextChallengeSignal;
    if (newSignalValue !== undefined && newSignalValue !== previousSignalValueFromScaffoldRef.current) {
      const type = exerciseData?.componentType;
      if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG3();
      else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) generateNewTimeChallengeRelojG3();
      else if (type === ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) generateNewCoinCollectionChallengeG3();
      else if (type === ExerciseComponentType.IDENTIFICAR_UNIDAD_MEDIDA_GENERICO) generateNewUnitChallengeG3();
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    } else if (previousSignalValueFromScaffoldRef.current === undefined && newSignalValue !== undefined) {
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    }
  }, [exerciseData, generateNewComparisonChallengeG3, generateNewTimeChallengeRelojG3, generateNewCoinCollectionChallengeG3, generateNewUnitChallengeG3]);

  useEffect(() => {
    setCustomKeypadContent(null); 
    setExerciseSpecificKeypadHandler(null);
    previousSignalValueFromScaffoldRef.current = undefined; 

    const type = exerciseData?.componentType;
    if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG3();
    else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) {
        const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] || [];
        setAvailableTimeChallengesRelojG3(shuffleArray([...timeChallengesRaw]));
        generateNewTimeChallengeRelojG3(); 
    } else if (type === ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) {
        const coinCollectionsRaw = exerciseData.data?.coinCollections as any[] || [];
        setAvailableCoinCollectionsG3(shuffleArray([...coinCollectionsRaw]));
        generateNewCoinCollectionChallengeG3(); 
    } else if (type === ExerciseComponentType.IDENTIFICAR_UNIDAD_MEDIDA_GENERICO) {
        const unitItemsRaw = exerciseData.data?.itemChallenges as ItemChallengeGeneric[] || [];
        const unitOptionsRaw = exerciseData.data?.unitOptions as UnitOptionGeneric[] || [];
        setAvailableUnitItemsG3(shuffleArray([...unitItemsRaw]));
        setCurrentUnitOptionsG3(shuffleArray([...unitOptionsRaw])); 
        generateNewUnitChallengeG3(); 
    } else {
        setComparisonChallengeG3(null); setCurrentTimeChallengeRelojG3(null); 
        setCoinCollectionChallengeG3(null); setActiveUnitChallengeG3(null);
    }
  }, [exerciseId, exerciseData, generateNewComparisonChallengeG3, generateNewTimeChallengeRelojG3, generateNewCoinCollectionChallengeG3, generateNewUnitChallengeG3]);

  const registerKeypadHandler = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandler(() => handler);
  }, []);

  const setExternalKeypad = useCallback((keypadNode: React.ReactNode | null) => { 
    setCustomKeypadContent(keypadNode);
  }, []);

  if (!exerciseData) { return ( <div className="p-6 text-center"><p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p><button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Volver al Inicio</button></div> ); }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id, exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS_G3,
    onNavigateBack, onGoHome: onNavigateBack, onAvatarClick: onNavigateToAvatar,
    onSetCompleted, currentAvatar, onApiReady: handleApiReady,
  };

  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, scaffoldApi: api, registerKeypadHandler: registerKeypadHandler,
    setCustomKeypadContent: setExternalKeypad, // Pass the renamed setExternalKeypad
    gradeLevel: gradeId, // Pass gradeLevel
  });
  
  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  let keypadToRender: React.ReactNode = null; 
  let allowDecimalForKeypad = false;
  
  const isSidebarExercise = 
    exerciseData.componentType === ExerciseComponentType.COMPARAR_HASTA_10000 ||
    exerciseData.componentType === ExerciseComponentType.LEER_RELOJ_OPCIONES ||
    exerciseData.componentType === ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_UNIDAD_MEDIDA_GENERICO ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_PARTES_CIRCULO ||
    exerciseData.componentType === ExerciseComponentType.CALCULAR_PERIMETRO_POLIGONO_SIMPLE ||
    exerciseData.componentType === ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE ||
    exerciseData.componentType === ExerciseComponentType.PROBLEMAS_PASO_A_PASO ||
    exerciseData.componentType === ExerciseComponentType.CERTEZA_SUCESOS ||
    exerciseData.componentType === ExerciseComponentType.COMPARAR_PROBABILIDADES ||
    exerciseData.componentType === ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE ||
    exerciseData.componentType === ExerciseComponentType.FRECUENCIA_SUCESOS ||
    exerciseData.componentType === ExerciseComponentType.LEER_FRACCIONES_PROPIAS ||
    exerciseData.componentType === ExerciseComponentType.REPRESENTAR_FRACCIONES ||
    exerciseData.componentType === ExerciseComponentType.IDENTIFICAR_ORDINALES ||
    exerciseData.componentType === ExerciseComponentType.UBICAR_EN_TABLA ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_TABLA_DOBLE_ENTRADA ||
    exerciseData.componentType === ExerciseComponentType.ORDENAR_DATOS_EN_TABLA ||
    exerciseData.componentType === ExerciseComponentType.COMPARAR_TABLAS_SIMPLES ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_DIAGRAMA_LINEAL_SIMPLE ||
    exerciseData.componentType === ExerciseComponentType.INTERPRETAR_DIAGRAMA_DOS_LINEAS;


  switch (exerciseData.componentType) {
    case ExerciseComponentType.ESCRIBIR_HASTA_10000: mainContentRenderer = (api) => <EscribirHasta10000Exercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_HASTA_10000: mainContentRenderer = () => ( <CompararHasta10000Exercise number1={comparisonChallengeG3?.number1 ?? null} number2={comparisonChallengeG3?.number2 ?? null} selectedSymbol={comparisonSelectedSymbolG3} currentEmoji={comparisonEmojiG3} questionText={exerciseData.question || "¿Cuál es el símbolo correcto?"}/>); keypadToRender = (<ComparisonKeypad onSymbolSelect={handleComparisonSymbolSelectG3} onVerify={handleComparisonVerifyAnswerG3} selectedSymbol={comparisonSelectedSymbolG3} isVerified={comparisonIsVerifiedG3} correctSymbolForFeedback={comparisonChallengeG3?.correctSymbol ?? null} />); break;
    case ExerciseComponentType.COMPONER_HASTA_10000_ABACO: mainContentRenderer = (api) => <ComponerHasta10000AbacoExercise {...createExerciseContentProps(api)} />; break; 
    case ExerciseComponentType.COMPONER_HASTA_10000_TEXTO: mainContentRenderer = (api) => <ComponerHasta10000TextoExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.APROXIMAR_NUMERO: mainContentRenderer = (api) => <AproximarNumeroExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.IDENTIFICAR_ORDINALES: mainContentRenderer = (api) => <IdentificarOrdinalesExercise {...createExerciseContentProps(api)} />; break; 
    case ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS: mainContentRenderer = (api) => <TwoDigitSimpleArithmeticExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.CALCULA_MENTALMENTE: mainContentRenderer = (api) => <CalculaMentalmenteExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.LEER_FRACCIONES_PROPIAS: mainContentRenderer = (api) => <LeerFraccionesPropiasExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.REPRESENTAR_FRACCIONES: mainContentRenderer = (api) => <RepresentarFraccionesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.ESCRIBIR_FRACCIONES_PROPIAS: mainContentRenderer = (api) => <EscribirFraccionesPropiasExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COLUMNAR_OPERATION: case ExerciseComponentType.SUMAS_LLEVANDO_3_SUMANDOS: case ExerciseComponentType.RESTAS_LLEVANDO_3_DIGITOS: mainContentRenderer = (api) => <ColumnarOperationExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.MULTIPLICACION_COLUMNAS: mainContentRenderer = (api) => <MultiplicacionColumnasExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DIVISION_SIMPLE: mainContentRenderer = (api) => <DivisionSimpleExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.DIVISION_LARGA: mainContentRenderer = (api) => <DivisionLargaExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.PROBLEMAS_PASO_A_PASO: mainContentRenderer = (api) => <ProblemasMatematicosGuiadosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break; 
    case ExerciseComponentType.CONVERTIR_METROS_A_CM: mainContentRenderer = (api) => <ConvertirMetrosACmExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.IDENTIFICAR_UNIDAD_MEDIDA_GENERICO: mainContentRenderer = () => ( <IdentificarUnidadMedidaGenericoExercise currentChallenge={activeUnitChallengeG3} currentEmoji={unitChallengeEmojiG3} questionPrompt={exerciseData.data?.questionPrompt || "¿Qué unidad usarías?"}/>); keypadToRender = (<UnitSelectionKeypad options={currentUnitOptionsG3} selectedOptionId={selectedUnitOptionG3} onOptionSelect={handleUnitOptionSelectG3} onVerify={handleUnitVerifyAnswerG3} isVerified={isUnitVerifiedG3} correctOptionId={activeUnitChallengeG3?.correctUnit || null} />); break;
    case ExerciseComponentType.PROBLEMAS_CAPACIDAD_SUMA_RESTA: mainContentRenderer = (api) => <ProblemasCapacidadSumaRestaExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.LEER_RELOJ_OPCIONES: mainContentRenderer = () => (<LeerRelojOpcionesExercise hours={currentTimeChallengeRelojG3?.hours ?? 0} minutes={currentTimeChallengeRelojG3?.minutes ?? 0} currentEmoji={relojEmojiG3} questionText={exerciseData.question || "¿Qué hora es?"}/>); keypadToRender = (<TimeOptionsKeypad options={currentTimeChallengeRelojG3?.options || []} selectedOption={selectedTimeOptionRelojG3} onOptionSelect={handleTimeOptionSelectRelojG3} onVerify={handleVerifyTimeAnswerRelojG3} isVerified={isVerifiedRelojG3} correctAnswerText={currentTimeChallengeRelojG3?.correctText || null}/>); break;
    case ExerciseComponentType.SUMAR_CAPACIDAD_CONVERSION_ML: case ExerciseComponentType.CONVERTIR_SUMAR_CAPACIDAD_ML: mainContentRenderer = (api) => <ConvertirSumarCapacidadMlExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO: mainContentRenderer = () => ( <CompararMonedasConPesoExercise coinsToDisplay={coinCollectionChallengeG3?.coins || []} currentEmoji={monetaryComparisonEmojiG3} questionText={exerciseData.question || "¿El valor total es?"}/>); keypadToRender = (<MonetaryComparisonKeypad onOptionSelect={handleMonetaryComparisonOptionSelectG3} onVerify={handleVerifyMonetaryComparisonAnswerG3} selectedOption={selectedMonetaryComparisonOptionG3} isVerified={isMonetaryComparisonVerifiedG3} correctOptionForFeedback={coinCollectionChallengeG3?.correctOption ?? null} targetAmountLabel="$1"/>); break;
    case ExerciseComponentType.SUMAR_ITEMS_MONETARIOS_SIMPLES: case ExerciseComponentType.SUMAR_MONEDAS_PESOS_SIMPLES: case ExerciseComponentType.SUMAR_BILLETES_PESOS: mainContentRenderer = (api) => <SumarItemsMonetariosSimplesExercise {...createExerciseContentProps(api)} />; break;
    case ExerciseComponentType.SUMAR_MONEDAS_PESOS_CENTAVOS: mainContentRenderer = (api) => <SumarMonedasPesosCentavosExercise {...createExerciseContentProps(api)} />; allowDecimalForKeypad = true; break;
    case ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO: mainContentRenderer = (api) => <IdentificarFormaGeometricaGenericoExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.IDENTIFICAR_PARTES_CIRCULO: mainContentRenderer = (api) => <IdentificarPartesCirculoExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.CALCULAR_PERIMETRO_POLIGONO_SIMPLE: mainContentRenderer = (api) => <CalcularPerimetroPoligonoSimpleExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} registerKeypadHandler={registerKeypadHandler} />; break; 
    case ExerciseComponentType.TEST_INTERPRETAR_DIAGRAMAS_BARRAS: case ExerciseComponentType.INTERPRETAR_DIAGRAMA_BARRAS_VERTICAL: case ExerciseComponentType.INTERPRETAR_DIAGRAMA_BARRAS_HORIZONTAL: mainContentRenderer = (api) => <TestInterpretarDiagramasBarras {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.INTERPRETAR_TABLA_SIMPLE: mainContentRenderer = (api) => <InterpretarTablaSimpleExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break; 
    case ExerciseComponentType.UBICAR_EN_TABLA: mainContentRenderer = (api) => <UbicarEnTablaExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad}/>; break;
    case ExerciseComponentType.INTERPRETAR_TABLA_DOBLE_ENTRADA: mainContentRenderer = (api) => <InterpretarTablaDobleEntradaExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad}/>; break;
    case ExerciseComponentType.COMPLETAR_TABLA_DATOS_FALTANTES: mainContentRenderer = (api) => <CompletarTablaDatosFaltantesExercise {...createExerciseContentProps(api)} />; break; 
    case ExerciseComponentType.ORDENAR_DATOS_EN_TABLA: mainContentRenderer = (api) => <OrdenarDatosEnTablaExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.COMPARAR_TABLAS_SIMPLES: mainContentRenderer = (api) => <CompararTablasSimplesExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.INTERPRETAR_DIAGRAMA_LINEAL_SIMPLE: mainContentRenderer = (api) => <InterpretarDiagramaLinealSimpleExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.INTERPRETAR_DIAGRAMA_DOS_LINEAS: mainContentRenderer = (api) => <InterpretarDiagramaDosLineasExercise {...createExerciseContentProps(api)} setExternalKeypad={setExternalKeypad} />; break;
    case ExerciseComponentType.CERTEZA_SUCESOS: mainContentRenderer = (api) => <CertezaSucesosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.COMPARAR_PROBABILIDADES: mainContentRenderer = (api) => <CompararProbabilidadesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.EXPRESAR_PROBABILIDAD_SIMPLE: mainContentRenderer = (api) => <ExpresarProbabilidadSimpleExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.FRECUENCIA_SUCESOS: mainContentRenderer = (api) => <FrecuenciaSucesosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setExternalKeypad} />; break;
    case ExerciseComponentType.GENERIC: default: mainContentRenderer = (api) => <GenericExerciseDisplay exerciseData={exerciseData} gradeThemeColor={gradeThemeColor} onNavigateBack={onNavigateBack} onNavigateToAvatar={onNavigateToAvatar} currentAvatar={currentAvatar} />; keypadToRender = null; break;
  }
  
  // Determine final keypad component based on exercise type and state
  let finalKeypadComponentForScaffold: React.ReactNode = null;

  if (customKeypadContent) {
    finalKeypadComponentForScaffold = customKeypadContent;
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
