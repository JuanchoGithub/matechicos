
import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react'; 
import { GradeLevel, SubjectId, Exercise, ExerciseComponentType, AvatarData, ExerciseScaffoldApi, TimeChallengeData, Coin, ComparisonSymbol, UnitOptionGeneric, ItemChallengeGeneric } from '../../types'; // Added Coin, ComparisonSymbol
import { getGradeData, DEFAULT_AVATAR, GRADES_CONFIG } from '../../constants'; 
import { Icons, BackArrowIcon, getIcon, AllIconNames, CheckIcon } from '../../components/icons'; 
import { NumericKeypad } from '../../components/NumericKeypad'; 
import { ExerciseScaffold } from '../../components/ExerciseScaffold'; 
import { shuffleArray } from '../../utils';

// Grade 1 Specific Component Imports
import { ContarElementosExercise } from '../../exercises/ContarElementosExercise';
import { IdentificarParesImparesExercise } from '../../exercises/IdentificarParesImparesExercise';
import { OrdenarNumerosSimpleExercise } from '../../exercises/OrdenarNumerosSimpleExercise';
import { NumeroAnteriorPosteriorExercise } from '../../exercises/NumeroAnteriorPosteriorExercise';
import { EscribirHasta10000Exercise } from '../../exercises/EscribirHasta10000Exercise'; 
import { CompararHasta10000Exercise } from '../../exercises/CompararHasta10000Exercise'; 
import { ComparisonKeypad } from '../../components/ComparisonKeypad';
import { MonetaryComparisonKeypad, MonetaryComparisonOption } from '../../components/MonetaryComparisonKeypad'; // Added
import { ComponerHasta10000AbacoExercise } from '../../exercises/ComponerHasta10000AbacoExercise'; 
import { ComponerHasta10000TextoExercise } from '../../exercises/ComponerHasta10000TextoExercise'; 
import { IdentificarOrdinalesExercise } from '../../exercises/IdentificarOrdinalesExercise'; 
import { TwoDigitSimpleArithmeticExercise } from '../../exercises/TwoDigitSimpleArithmeticExercise'; 
import { CalculaMentalmenteExercise } from '../../exercises/CalculaMentalmenteExercise'; 
import { VisualArithmetic1DigitExercise } from '../../exercises/grade1/VisualArithmetic1DigitExercise'; // Corrected Path
import { ColumnarOperationExercise } from '../../exercises/ColumnarOperationExercise'; 
import { ProblemasMatematicosGuiadosExercise } from '../../exercises/ProblemasMatematicosGuiadosExercise'; 

// Medidas Component Imports for Grade 1
import { CompararAlturasExercise } from '../../exercises/grade1/CompararAlturasExercise';
import { CompararLongitudesExercise } from '../../exercises/grade1/CompararLongitudesExercise';
import { MedirConReglaCmExercise } from '../../exercises/grade1/MedirConReglaCmExercise';
import { CompararPesosConceptualExercise } from '../../exercises/grade1/CompararPesosConceptualExercise';
import { Balanza1KgExercise } from '../../exercises/grade1/Balanza1KgExercise';
import { CompararCapacidad1LitroExercise } from '../../exercises/grade1/CompararCapacidad1LitroExercise';
import { CalendarioMesAnteriorPosteriorExercise } from '../../exercises/grade1/CalendarioMesAnteriorPosteriorExercise';
import { CompletarPalabraSimpleExercise } from '../../exercises/grade1/CompletarPalabraSimpleExercise';
import { SecuenciaDiaSemanaExercise } from '../../exercises/grade1/SecuenciaDiaSemanaExercise';
import { SecuenciaMesAnioExercise } from '../../exercises/grade1/SecuenciaMesAnioExercise';
import { LeerRelojOpcionesExercise } from '../../exercises/LeerRelojOpcionesExercise'; 
import { TimeOptionsKeypad } from '../../components/TimeOptionsKeypad';


// Geometria Component Imports for Grade 1
import { PosicionRelativaObjetosExercise } from '../../exercises/grade1/PosicionRelativaObjetosExercise'; // Corrected Path
import { IdentificarFormaGeometricaGenericoExercise } from '../../exercises/IdentificarFormaGeometricaGenericoExercise';

// Estadistica Component Imports for Grade 1
import { InterpretarPictogramasExercise } from '../../exercises/InterpretarPictogramasExercise'; 

// Probabilidad Component Imports (reused from 3rd Grade or generic)
import { CertezaSucesosExercise } from '../../exercises/CertezaSucesosExercise'; 
import { FrecuenciaSucesosExercise } from '../../exercises/FrecuenciaSucesosExercise'; 

// Reused components from other grades (if any are directly used, ensure they are imported)
import { ProblemasCapacidadSumaRestaExercise } from '../../exercises/ProblemasCapacidadSumaRestaExercise';
import { SumarItemsMonetariosSimplesExercise } from '../../exercises/SumarItemsMonetariosSimplesExercise';
import { CompararMonedasConPesoExercise } from '../../exercises/CompararMonedasConPesoExercise';


interface Grade1ExercisePageProps {
  gradeId: GradeLevel; // Will always be 1
  subjectId: SubjectId;
  exerciseId: string;
  onNavigateBack: () => void; 
  onNavigateToMain: () => void; 
  onNavigateToAvatar: () => void;
  onSetCompleted: (exerciseId: string) => void;
}

type KeypadHandler = (key: string) => void;

// Local type for active time challenge state
interface ActiveTimeChallengeRelojG1 extends TimeChallengeData {
  options: string[]; // Processed options for buttons
}

interface CoinCollectionChallengeG1 {
  coins: Coin[];
  correctOption: MonetaryComparisonOption;
  emoji?: string;
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

const DEFAULT_EXERCISE_STARS = 5;
const COMPARISON_FACE_EMOJIS_G1 = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];
const MONETARY_COMPARISON_EMOJIS_G1 = ['💰', '🪙', '🤔', '🧐', '💡', '👀'];
const RELOJ_FACE_EMOJIS_G1 = ['⏰', '🕰️', '🤔', '🧐', '💡', '🤓', '👍', '🎯', '💯'];


export const Grade1ExercisePage: React.FC<Grade1ExercisePageProps> = ({ gradeId, subjectId, exerciseId, onNavigateBack, onNavigateToMain, onNavigateToAvatar, onSetCompleted }) => {
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [exerciseSpecificKeypadHandlerG1, setExerciseSpecificKeypadHandlerG1] = useState<KeypadHandler | null>(null);
  const [customKeypadContentG1, setCustomKeypadContentG1] = useState<React.ReactNode | null>(null); 
  
  const currentScaffoldApiRef = useRef<ExerciseScaffoldApi | null>(null);
  const previousSignalValueFromScaffoldRef = useRef<number | undefined>(undefined);

  const [comparisonChallengeG1, setComparisonChallengeG1] = useState<{ number1: number; number2: number; correctSymbol: ComparisonSymbol } | null>(null);
  const [comparisonSelectedSymbolG1, setComparisonSelectedSymbolG1] = useState<ComparisonSymbol | null>(null);
  const [comparisonIsVerifiedG1, setComparisonIsVerifiedG1] = useState<boolean>(false);
  const [comparisonEmojiG1, setComparisonEmojiG1] = useState<string>(COMPARISON_FACE_EMOJIS_G1[0]);
  
  const [currentTimeChallengeRelojG1, setCurrentTimeChallengeRelojG1] = useState<ActiveTimeChallengeRelojG1 | null>(null);
  const [availableTimeChallengesRelojG1, setAvailableTimeChallengesRelojG1] = useState<TimeChallengeData[]>([]);
  const [selectedTimeOptionRelojG1, setSelectedTimeOptionRelojG1] = useState<string | null>(null);
  const [isVerifiedRelojG1, setIsVerifiedRelojG1] = useState<boolean>(false);
  const [relojEmojiG1, setRelojEmojiG1] = useState<string>(RELOJ_FACE_EMOJIS_G1[0]);

  const [coinCollectionChallengeG1, setCoinCollectionChallengeG1] = useState<CoinCollectionChallengeG1 | null>(null);
  const [availableCoinCollectionsG1, setAvailableCoinCollectionsG1] = useState<any[]>([]); 
  const [selectedMonetaryComparisonOptionG1, setSelectedMonetaryComparisonOptionG1] = useState<MonetaryComparisonOption | null>(null);
  const [isMonetaryComparisonVerifiedG1, setIsMonetaryComparisonVerifiedG1] = useState<boolean>(false);
  const [monetaryComparisonEmojiG1, setMonetaryComparisonEmojiG1] = useState<string>(MONETARY_COMPARISON_EMOJIS_G1[0]);

  const exerciseData = useMemo(() => {
    const grade = getGradeData(gradeId);
    if (!grade) return undefined;
    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) return undefined;
    return subject.exercises.find(ex => ex.id === exerciseId);
  }, [gradeId, subjectId, exerciseId]);

  const gradeThemeColor = useMemo(() => {
    return GRADES_CONFIG.find(g => g.id === gradeId)?.themeColor || 'bg-red-500'; 
  }, [gradeId]);

  const generateNewComparisonChallengeG1 = useCallback(() => {
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_HASTA_10000) return;
    const { minNumber = 0, maxNumber = 20 } = exerciseData.data || {};
    let num1: number, num2: number;
    const forceEqual = Math.random() < 0.15;
    if (forceEqual) { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = num1; } 
    else { do { num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber; } while (num1 === num2); }
    let correctSym: ComparisonSymbol = num1 < num2 ? '<' : (num1 > num2 ? '>' : '=');
    setComparisonChallengeG1({ number1: num1, number2: num2, correctSymbol: correctSym });
    setComparisonSelectedSymbolG1(null); setComparisonIsVerifiedG1(false);
    setComparisonEmojiG1(COMPARISON_FACE_EMOJIS_G1[Math.floor(Math.random() * COMPARISON_FACE_EMOJIS_G1.length)]);
    currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleComparisonSymbolSelectG1 = (symbol: ComparisonSymbol) => { 
    if (comparisonIsVerifiedG1 && comparisonSelectedSymbolG1 === comparisonChallengeG1?.correctSymbol) return;
    setComparisonSelectedSymbolG1(symbol); currentScaffoldApiRef.current?.showFeedback(null);
    if (comparisonIsVerifiedG1 && comparisonSelectedSymbolG1 !== comparisonChallengeG1?.correctSymbol) setComparisonIsVerifiedG1(false);
  };
  const handleComparisonVerifyAnswerG1 = useCallback(() => { 
    if (!comparisonChallengeG1 || !comparisonSelectedSymbolG1 || (comparisonIsVerifiedG1 && comparisonSelectedSymbolG1 === comparisonChallengeG1.correctSymbol)) return;
    setComparisonIsVerifiedG1(true); const isCorrect = comparisonSelectedSymbolG1 === comparisonChallengeG1.correctSymbol;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! ${comparisonChallengeG1.number1} ${comparisonChallengeG1.correctSymbol} ${comparisonChallengeG1.number2}`});} 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: 'Ese no es el símbolo correcto. ¡Inténtalo otra vez!'}); setTimeout(() => setComparisonIsVerifiedG1(false), 1500); }
  }, [comparisonChallengeG1, comparisonSelectedSymbolG1, comparisonIsVerifiedG1]);
  
  const generateNewTimeChallengeRelojG1 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.LEER_RELOJ_OPCIONES) return;
    setAvailableTimeChallengesRelojG1(currentPool => {
        let poolToUse = currentPool; const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] | undefined;
        if (poolToUse.length === 0 && timeChallengesRaw && timeChallengesRaw.length > 0) { poolToUse = shuffleArray([...timeChallengesRaw]); }
        if (poolToUse.length > 0) {
            const nextChallengeData = poolToUse[0];
            let rawOptions = [...nextChallengeData.distractors, nextChallengeData.correctText]; let finalOptions = shuffleArray(rawOptions);
            const uniqueOptions = Array.from(new Set(finalOptions));
            if (uniqueOptions.length < 4) { const genericWrongTimes = ["Son las siete y diez", "Son las cuatro menos cinco", "Es la una en punto", "Son las once y veinte", "Son las dos y media", "Son las cinco y cuarto"]; let i = 0; while(uniqueOptions.length < 4 && i < genericWrongTimes.length){ if(!uniqueOptions.includes(genericWrongTimes[i])) uniqueOptions.push(genericWrongTimes[i]); i++; } }
            finalOptions = shuffleArray(uniqueOptions.slice(0,4));
            if (!finalOptions.includes(nextChallengeData.correctText) && finalOptions.length === 4) { finalOptions[Math.floor(Math.random() * 4)] = nextChallengeData.correctText; finalOptions = shuffleArray(finalOptions); } else if (!finalOptions.includes(nextChallengeData.correctText)) { finalOptions.push(nextChallengeData.correctText); finalOptions = shuffleArray(finalOptions.slice(0,4));}
            setCurrentTimeChallengeRelojG1({ ...nextChallengeData, options: finalOptions });
            setRelojEmojiG1(nextChallengeData.emoji || RELOJ_FACE_EMOJIS_G1[Math.floor(Math.random() * RELOJ_FACE_EMOJIS_G1.length)]);
            return poolToUse.slice(1);
        } else { setCurrentTimeChallengeRelojG1(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedTimeOptionRelojG1(null); setIsVerifiedRelojG1(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleTimeOptionSelectRelojG1 = (option: string) => { 
    if (isVerifiedRelojG1 && selectedTimeOptionRelojG1 === currentTimeChallengeRelojG1?.correctText) return;
    setSelectedTimeOptionRelojG1(option); currentScaffoldApiRef.current?.showFeedback(null);
    if (isVerifiedRelojG1 && selectedTimeOptionRelojG1 !== currentTimeChallengeRelojG1?.correctText) setIsVerifiedRelojG1(false);
  };
  const handleVerifyTimeAnswerRelojG1 = useCallback(() => { 
    if (!currentTimeChallengeRelojG1 || !selectedTimeOptionRelojG1 || (isVerifiedRelojG1 && selectedTimeOptionRelojG1 === currentTimeChallengeRelojG1.correctText)) return;
    setIsVerifiedRelojG1(true); const isCorrect = selectedTimeOptionRelojG1 === currentTimeChallengeRelojG1.correctText;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({ type: 'correct', message: `¡Correcto! ${currentTimeChallengeRelojG1.correctText}.` }); } 
    else { currentScaffoldApiRef.current?.showFeedback({ type: 'incorrect', message: `No es correcto. La hora es: "${currentTimeChallengeRelojG1.correctText}".` }); setTimeout(() => setIsVerifiedRelojG1(false), 1500); }
  }, [currentTimeChallengeRelojG1, selectedTimeOptionRelojG1, isVerifiedRelojG1]);

  const generateNewCoinCollectionChallengeG1 = useCallback(() => { 
    if (!exerciseData || exerciseData.componentType !== ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) return;
    setAvailableCoinCollectionsG1(currentPool => {
        let poolToUse = currentPool; const coinCollectionsRaw = exerciseData.data?.coinCollections as any[] | undefined;
        if (poolToUse.length === 0 && coinCollectionsRaw && coinCollectionsRaw.length > 0) { poolToUse = shuffleArray([...coinCollectionsRaw]); }
        if (poolToUse.length > 0) { const nextCollectionData = poolToUse[0];
            setCoinCollectionChallengeG1({ coins: nextCollectionData.coins, correctOption: nextCollectionData.correctOption, emoji: nextCollectionData.emoji || MONETARY_COMPARISON_EMOJIS_G1[Math.floor(Math.random() * MONETARY_COMPARISON_EMOJIS_G1.length)] });
            return poolToUse.slice(1);
        } else { setCoinCollectionChallengeG1(null); currentScaffoldApiRef.current?.onAttempt(true); return []; }
    });
    setSelectedMonetaryComparisonOptionG1(null); setIsMonetaryComparisonVerifiedG1(false); currentScaffoldApiRef.current?.showFeedback(null);
  }, [exerciseData]);

  const handleMonetaryComparisonOptionSelectG1 = (option: MonetaryComparisonOption) => { 
    if (isMonetaryComparisonVerifiedG1 && selectedMonetaryComparisonOptionG1 === coinCollectionChallengeG1?.correctOption) return;
    setSelectedMonetaryComparisonOptionG1(option); currentScaffoldApiRef.current?.showFeedback(null);
    if (isMonetaryComparisonVerifiedG1 && selectedMonetaryComparisonOptionG1 !== coinCollectionChallengeG1?.correctOption) setIsMonetaryComparisonVerifiedG1(false);
  };
  const handleVerifyMonetaryComparisonAnswerG1 = useCallback(() => { 
    if (!coinCollectionChallengeG1 || !selectedMonetaryComparisonOptionG1 || (isMonetaryComparisonVerifiedG1 && selectedMonetaryComparisonOptionG1 === coinCollectionChallengeG1.correctOption)) return;
    setIsMonetaryComparisonVerifiedG1(true); const totalValueCents = coinCollectionChallengeG1.coins.reduce((sum, coin) => sum + (coin.value * coin.count), 0);
    let actualComparison: MonetaryComparisonOption; if (totalValueCents < 100) actualComparison = 'less'; else if (totalValueCents === 100) actualComparison = 'equal'; else actualComparison = 'more';
    const isCorrect = selectedMonetaryComparisonOptionG1 === actualComparison && selectedMonetaryComparisonOptionG1 === coinCollectionChallengeG1.correctOption;
    currentScaffoldApiRef.current?.onAttempt(isCorrect);
    if (isCorrect) { currentScaffoldApiRef.current?.showFeedback({type: 'correct', message: `¡Correcto! El valor es ${actualComparison === 'less' ? 'menor que' : actualComparison === 'equal' ? 'igual a' : 'mayor que'} $1.`}); } 
    else { currentScaffoldApiRef.current?.showFeedback({type: 'incorrect', message: `Incorrecto. El valor es ${actualComparison === 'less' ? 'menor que' : actualComparison === 'equal' ? 'igual a' : 'mayor que'} $1.`}); setTimeout(() => setIsMonetaryComparisonVerifiedG1(false), 1500); }
  }, [coinCollectionChallengeG1, selectedMonetaryComparisonOptionG1, isMonetaryComparisonVerifiedG1]);


  const handleApiReady = useCallback((api: ExerciseScaffoldApi) => {
    currentScaffoldApiRef.current = api;
    const newSignalValue = api.advanceToNextChallengeSignal;

    if (newSignalValue !== undefined && newSignalValue !== previousSignalValueFromScaffoldRef.current) {
      const type = exerciseData?.componentType;
      if (type === ExerciseComponentType.COMPARAR_HASTA_10000) {
        generateNewComparisonChallengeG1();
      } else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) {
        generateNewTimeChallengeRelojG1();
      } else if (type === ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) {
        generateNewCoinCollectionChallengeG1();
      }
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    } else if (previousSignalValueFromScaffoldRef.current === undefined && newSignalValue !== undefined) {
      previousSignalValueFromScaffoldRef.current = newSignalValue;
    }
  }, [exerciseData, generateNewComparisonChallengeG1, generateNewTimeChallengeRelojG1, generateNewCoinCollectionChallengeG1]);


  useEffect(() => {
    setCustomKeypadContentG1(null); 
    setExerciseSpecificKeypadHandlerG1(null);
    previousSignalValueFromScaffoldRef.current = undefined;

    const type = exerciseData?.componentType;
    if (type === ExerciseComponentType.COMPARAR_HASTA_10000) generateNewComparisonChallengeG1();
    else if (type === ExerciseComponentType.LEER_RELOJ_OPCIONES) {
        const timeChallengesRaw = exerciseData.data?.times as TimeChallengeData[] || [];
        setAvailableTimeChallengesRelojG1(shuffleArray([...timeChallengesRaw]));
        generateNewTimeChallengeRelojG1();
    } else if (type === ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO) {
        const coinCollectionsRaw = exerciseData.data?.coinCollections as any[] || [];
        setAvailableCoinCollectionsG1(shuffleArray([...coinCollectionsRaw]));
        generateNewCoinCollectionChallengeG1();
    }
    else {
        setComparisonChallengeG1(null); setCurrentTimeChallengeRelojG1(null); 
        setCoinCollectionChallengeG1(null);
    }
  }, [exerciseId, subjectId, gradeId, exerciseData, generateNewComparisonChallengeG1, generateNewTimeChallengeRelojG1, generateNewCoinCollectionChallengeG1]);
  

  const registerKeypadHandlerG1 = useCallback((handler: KeypadHandler | null) => {
    setExerciseSpecificKeypadHandlerG1(() => handler);
  }, []);

  const setCustomKeypadContentG1Callback = useCallback((keypadNode: React.ReactNode | null) => { 
    setCustomKeypadContentG1(keypadNode);
  }, []);

  if (!exerciseData) {
    return ( <div className="p-6 text-center"><p className="text-red-500 text-xl mb-4">Ejercicio no encontrado.</p><button onClick={onNavigateToMain} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Volver al Inicio</button></div> );
  }
  
  const scaffoldProps = {
    exerciseId: exerciseData.id, exerciseQuestion: exerciseData.question,
    totalStarsForExercise: exerciseData.data?.totalStars || exerciseData.data?.overallTotalStars || DEFAULT_EXERCISE_STARS,
    onNavigateBack, onGoHome: onNavigateBack, onAvatarClick: onNavigateToAvatar,
    onSetCompleted, currentAvatar, onApiReady: handleApiReady,
  };

  const createExerciseContentProps = (api: ExerciseScaffoldApi) => ({
    exercise: exerciseData!, 
    scaffoldApi: api, 
    registerKeypadHandler: registerKeypadHandlerG1,
    setCustomKeypadContent: setCustomKeypadContentG1Callback, 
    gradeLevel: gradeId, // Pass gradeLevel to exercises that need it
  });
  
  let mainContentRenderer: (api: ExerciseScaffoldApi) => React.ReactNode;
  let keypadToRenderG1: React.ReactNode = null;
  let allowDecimalForKeypadG1 = false;

  switch (exerciseData.componentType) {
    case ExerciseComponentType.CONTAR_ELEMENTOS: mainContentRenderer = (api) => <ContarElementosExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.IDENTIFICAR_PARES_IMPARES: mainContentRenderer = (api) => <IdentificarParesImparesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback}/>; break;
    case ExerciseComponentType.ORDENAR_NUMEROS_SIMPLE: mainContentRenderer = (api) => <OrdenarNumerosSimpleExercise {...createExerciseContentProps(api)}/>; break;
    case ExerciseComponentType.NUMERO_ANTERIOR_POSTERIOR: mainContentRenderer = (api) => <NumeroAnteriorPosteriorExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.ESCRIBIR_HASTA_10000: mainContentRenderer = (api) => <EscribirHasta10000Exercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.COMPARAR_HASTA_10000: mainContentRenderer = () => ( <CompararHasta10000Exercise number1={comparisonChallengeG1?.number1 ?? null} number2={comparisonChallengeG1?.number2 ?? null} selectedSymbol={comparisonSelectedSymbolG1} currentEmoji={comparisonEmojiG1} questionText={exerciseData.question || "¿Cuál es el símbolo correcto?"}/>); keypadToRenderG1 = (<ComparisonKeypad onSymbolSelect={handleComparisonSymbolSelectG1} onVerify={handleComparisonVerifyAnswerG1} selectedSymbol={comparisonSelectedSymbolG1} isVerified={comparisonIsVerifiedG1} correctSymbolForFeedback={comparisonChallengeG1?.correctSymbol ?? null} />); break;
    case ExerciseComponentType.COMPONER_HASTA_10000_ABACO: mainContentRenderer = (api) => <ComponerHasta10000AbacoExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break; 
    case ExerciseComponentType.COMPONER_HASTA_10000_TEXTO: mainContentRenderer = (api) => <ComponerHasta10000TextoExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.IDENTIFICAR_ORDINALES: mainContentRenderer = (api) => <IdentificarOrdinalesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break; 
    case ExerciseComponentType.ARITMETICA_SIMPLE_2_CIFRAS: mainContentRenderer = (api) => <TwoDigitSimpleArithmeticExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.CALCULA_MENTALMENTE: mainContentRenderer = (api) => <CalculaMentalmenteExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.VISUAL_ARITHMETIC_1_DIGIT: mainContentRenderer = (api) => <VisualArithmetic1DigitExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.COLUMNAR_OPERATION: mainContentRenderer = (api) => <ColumnarOperationExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    
    case ExerciseComponentType.PROBLEMAS_PASO_A_PASO: 
      mainContentRenderer = (api) => <ProblemasMatematicosGuiadosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; 
      break;

    case ExerciseComponentType.COMPARAR_ALTURAS: mainContentRenderer = (api) => <CompararAlturasExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.COMPARAR_LONGITUDES: mainContentRenderer = (api) => <CompararLongitudesExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.MEDIR_CON_REGLA_CM: mainContentRenderer = (api) => <MedirConReglaCmExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.COMPARAR_PESOS_CONCEPTUAL: mainContentRenderer = (api) => <CompararPesosConceptualExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.BALANZA_1KG: mainContentRenderer = (api) => <Balanza1KgExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.COMPARAR_CAPACIDAD_1L: mainContentRenderer = (api) => <CompararCapacidad1LitroExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.PROBLEMAS_CAPACIDAD_SUMA_RESTA: mainContentRenderer = (api) => <ProblemasCapacidadSumaRestaExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.SUMAR_ITEMS_MONETARIOS_SIMPLES: case ExerciseComponentType.SUMAR_MONEDAS_PESOS_SIMPLES: case ExerciseComponentType.SUMAR_BILLETES_PESOS: mainContentRenderer = (api) => <SumarItemsMonetariosSimplesExercise {...createExerciseContentProps(api)} />; keypadToRenderG1 = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1 || (() => {})} className="w-full" />; break;
    case ExerciseComponentType.COMPARAR_MONEDAS_CON_PESO: mainContentRenderer = () => ( <CompararMonedasConPesoExercise coinsToDisplay={coinCollectionChallengeG1?.coins || []} currentEmoji={monetaryComparisonEmojiG1} questionText={exerciseData.question || "¿El valor total es?"}/>); keypadToRenderG1 = (<MonetaryComparisonKeypad onOptionSelect={handleMonetaryComparisonOptionSelectG1} onVerify={handleVerifyMonetaryComparisonAnswerG1} selectedOption={selectedMonetaryComparisonOptionG1} isVerified={isMonetaryComparisonVerifiedG1} correctOptionForFeedback={coinCollectionChallengeG1?.correctOption ?? null} targetAmountLabel="$1"/>); break;
    case ExerciseComponentType.CALENDARIO_MES_ANT_POST: mainContentRenderer = (api) => <CalendarioMesAnteriorPosteriorExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.LEER_RELOJ_OPCIONES: mainContentRenderer = () => (<LeerRelojOpcionesExercise hours={currentTimeChallengeRelojG1?.hours ?? 0} minutes={currentTimeChallengeRelojG1?.minutes ?? 0} currentEmoji={relojEmojiG1} questionText={exerciseData.question || "¿Qué hora es?"}/>); keypadToRenderG1 = (<TimeOptionsKeypad options={currentTimeChallengeRelojG1?.options || []} selectedOption={selectedTimeOptionRelojG1} onOptionSelect={handleTimeOptionSelectRelojG1} onVerify={handleVerifyTimeAnswerRelojG1} isVerified={isVerifiedRelojG1} correctAnswerText={currentTimeChallengeRelojG1?.correctText || null}/>); break;
    case ExerciseComponentType.COMPLETAR_PALABRA_SIMPLE: mainContentRenderer = (api) => <CompletarPalabraSimpleExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.SECUENCIA_DIA_SEMANA: mainContentRenderer = (api) => <SecuenciaDiaSemanaExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.SECUENCIA_MES_ANIO: mainContentRenderer = (api) => <SecuenciaMesAnioExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.POSICION_RELATIVA_OBJETOS: mainContentRenderer = (api) => <PosicionRelativaObjetosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.IDENTIFICAR_FORMA_GEOMETRICA_GENERICO: mainContentRenderer = (api) => <IdentificarFormaGeometricaGenericoExercise {...createExerciseContentProps(api)} setExternalKeypad={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.INTERPRETAR_PICTOGRAMAS: mainContentRenderer = (api) => <InterpretarPictogramasExercise {...createExerciseContentProps(api)} registerKeypadHandler={registerKeypadHandlerG1} />; break;
    case ExerciseComponentType.CERTEZA_SUCESOS: mainContentRenderer = (api) => <CertezaSucesosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;
    case ExerciseComponentType.FRECUENCIA_SUCESOS: mainContentRenderer = (api) => <FrecuenciaSucesosExercise {...createExerciseContentProps(api)} setCustomKeypadContent={setCustomKeypadContentG1Callback} />; break;

    case ExerciseComponentType.GENERIC:
    default:
      mainContentRenderer = (api) => <GenericExerciseDisplay exerciseData={exerciseData} gradeThemeColor={gradeThemeColor} onNavigateBack={onNavigateBack} onNavigateToAvatar={onNavigateToAvatar} currentAvatar={currentAvatar} />;
      keypadToRenderG1 = null; 
      break;
  }
  
  let finalKeypadComponentForScaffold: React.ReactNode = customKeypadContentG1; 

  if (!finalKeypadComponentForScaffold) { 
    if (keypadToRenderG1) { 
        finalKeypadComponentForScaffold = keypadToRenderG1;
    } else if (exerciseSpecificKeypadHandlerG1) { 
        finalKeypadComponentForScaffold = <NumericKeypad onKeyPress={exerciseSpecificKeypadHandlerG1} className="w-full" allowDecimal={allowDecimalForKeypadG1} />;
    } else { 
        finalKeypadComponentForScaffold = <div className="p-4 text-slate-400">Este ejercicio no requiere teclado específico.</div>;
    }
  }

  return <ExerciseScaffold {...scaffoldProps} mainExerciseContentRenderer={mainContentRenderer} keypadComponent={finalKeypadComponentForScaffold} />;
};
