import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseScaffold } from '../components/ExerciseScaffold';
import { NumericKeypad } from '../components/NumericKeypad';
import { Exercise as ExerciseType, AvatarData, PictogramScenarioTemplate, PictogramItem, PictogramQuestionTemplate, PictogramQuestionType, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

// --- Data Structures ---
interface ActivePictogramQuestion {
  id: string;
  text: string;
  questionType: PictogramQuestionType; // To know if options are numeric or categories
  options: string[]; // Can be category names or numeric strings
  correctAnswer: string; // The correct option string
}

interface ActivePictogramScenarioData {
  title: string;
  keyLabel: string;
  items: PictogramItem[]; // Actual items with their counts for display
  questions: ActivePictogramQuestion[];
  totalStarsInScenario: number;
  icon?: string;
  itemTypeSingular: string;
  itemTypePlural: string;
}

interface InterpretarPictogramasExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  registerKeypadHandler: (handler: ((key: string) => void) | null) => void;
  // Removed: currentAvatar, onNavigateBack, onGoHome, onAvatarClick, onComplete
}

const FACE_EMOJIS_PICTOGRAM = ['📊', '📈', '🤔', '🧐', '💡', '🔢', '🍎', '⚽'];
const DEFAULT_PICTOGRAM_ICON = '📊';

// --- Helper Functions ---
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateNumericDistractorsPictogram = (correctValue: number, allValuesInChart: number[], numDistractors: number = 2): string[] => {
    const distractors: Set<number> = new Set();
    const uniqueValues = [...new Set(allValuesInChart)];
    
    // Try to pick from other values in the chart first
    for (const val of shuffleArray(uniqueValues)) {
        if (distractors.size < numDistractors && val !== correctValue) {
            distractors.add(val);
        }
    }
    
    // If not enough, generate simple variations
    let attempts = 0;
    while (distractors.size < numDistractors && attempts < 10) {
        const variation = Math.random() < 0.5 ? correctValue + getRandomInt(1,3) : Math.max(0, correctValue - getRandomInt(1,3));
        if (variation !== correctValue && !distractors.has(variation) && !uniqueValues.includes(variation)) {
            distractors.add(variation);
        }
        attempts++;
    }
     // Still not enough? Add simple +-1 if distinct
    if (distractors.size < numDistractors && correctValue > 0 && !distractors.has(correctValue - 1) && !uniqueValues.includes(correctValue - 1)) distractors.add(correctValue - 1);
    if (distractors.size < numDistractors && !distractors.has(correctValue + 1) && !uniqueValues.includes(correctValue + 1)) distractors.add(correctValue + 1);

    return Array.from(distractors).slice(0, numDistractors).map(String);
};


const generateDynamicPictogramQuestion = (
  template: PictogramQuestionTemplate,
  itemsWithValue: PictogramItem[],
  itemTypeSingular: string,
  itemTypePlural: string,
  scenarioId: string
): ActivePictogramQuestion => {
  let text = "";
  let options: string[] = [];
  let correctAnswer = "";
  const allCounts = itemsWithValue.map(item => item.count);

  switch (template.type) {
    case 'count_specific': {
      const targetItem = itemsWithValue.find(item => item.category === template.targetCategory1) || itemsWithValue[0];
      text = `¿Cuántos ${targetItem.category.toLowerCase()} hay?`;
      correctAnswer = targetItem.count.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsPictogram(targetItem.count, allCounts)]);
      break;
    }
    case 'find_max': {
      const maxCount = Math.max(...allCounts);
      const candidates = itemsWithValue.filter(item => item.count === maxCount);
      const targetItem = candidates[Math.floor(Math.random() * candidates.length)]; // Pick one if multiple have max
      text = `¿De qué hay más cantidad?`;
      options = shuffleArray(itemsWithValue.map(item => item.category));
      correctAnswer = targetItem.category;
      break;
    }
    case 'find_min': {
      const minCount = Math.min(...allCounts);
      const candidates = itemsWithValue.filter(item => item.count === minCount);
      const targetItem = candidates[Math.floor(Math.random() * candidates.length)];
      text = `¿De qué hay menos cantidad?`;
      options = shuffleArray(itemsWithValue.map(item => item.category));
      correctAnswer = targetItem.category;
      break;
    }
    case 'compare_two': {
      const item1 = itemsWithValue.find(item => item.category === template.targetCategory1) || itemsWithValue[0];
      const item2 = itemsWithValue.find(item => item.category === template.targetCategory2) || itemsWithValue[1 % itemsWithValue.length];
      const difference = Math.abs(item1.count - item2.count);
      const comparisonText = item1.count > item2.count ? `más ${item1.category.toLowerCase()} que ${item2.category.toLowerCase()}` : `más ${item2.category.toLowerCase()} que ${item1.category.toLowerCase()}`;
      if (item1.count === item2.count) {
        text = `¿Hay la misma cantidad de ${item1.category.toLowerCase()} y ${item2.category.toLowerCase()}?`;
        correctAnswer = "Sí";
        options = ["Sí", "No"];
      } else {
        text = `¿Cuántos ${comparisonText} hay?`;
        correctAnswer = difference.toString();
        options = shuffleArray([correctAnswer, ...generateNumericDistractorsPictogram(difference, allCounts, 2)]);
      }
      break;
    }
    case 'count_total': {
      const totalCount = allCounts.reduce((sum, count) => sum + count, 0);
      text = `¿Cuántos ${itemTypePlural} hay en total?`;
      correctAnswer = totalCount.toString();
      options = shuffleArray([correctAnswer, ...generateNumericDistractorsPictogram(totalCount, allCounts, 2)]);
      break;
    }
  }
  return { id: `${scenarioId}_${template.id}`, text, options, correctAnswer, questionType: template.type };
};


// --- Main Component ---
export const InterpretarPictogramasExercise: React.FC<InterpretarPictogramasExerciseProps> = ({
  exercise,
  scaffoldApi,
  registerKeypadHandler
}) => {
  const [activeScenario, setActiveScenario] = useState<ActivePictogramScenarioData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Removed: overallStars, starsInCurrentScenario. Scaffold handles this.

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>(''); // For numeric input questions
  const [isVerified, setIsVerified] = useState<boolean>(false);
  // Removed: feedback. Use scaffoldApi.showFeedback
  const [currentEmoji, setCurrentEmoji] = useState<string>(DEFAULT_PICTOGRAM_ICON);
  
  const [availableScenarioTemplates, setAvailableScenarioTemplates] = useState<PictogramScenarioTemplate[]>([]);

  const { scenarios = [], overallTotalStars = 1 } = exercise.data || {}; // overallTotalStars is for the entire ExerciseScaffold

  useEffect(() => {
    setAvailableScenarioTemplates(shuffleArray([...(scenarios as PictogramScenarioTemplate[])]));
  }, [exercise.id, scenarios]);

  const loadNewScenario = useCallback(() => {
    // Scaffold handles overall completion based on its totalStarsForExercise prop.
    // This function loads a new scenario if available.
    let currentPool = availableScenarioTemplates;
    if (currentPool.length === 0 && (scenarios as PictogramScenarioTemplate[]).length > 0) {
        currentPool = shuffleArray([...(scenarios as PictogramScenarioTemplate[])]);
    }
    if (currentPool.length === 0) {
        scaffoldApi.onAttempt(true); // No more internal scenarios, signal success for this "challenge attempt"
        return;
    }

    const template = currentPool[0];
    setAvailableScenarioTemplates(prev => prev.slice(1));

    const activeItems: PictogramItem[] = template.items.map(itemTemplate => ({
      category: itemTemplate.category,
      icon: itemTemplate.icon,
      count: getRandomInt(itemTemplate.valueRange[0], itemTemplate.valueRange[1]),
    }));
    
    const activeQuestions = template.questionTemplates.map(qTemplate => 
        generateDynamicPictogramQuestion(qTemplate, activeItems, template.itemTypeSingular, template.itemTypePlural, template.scenarioId)
    );

    setActiveScenario({
      title: template.title,
      keyLabel: template.keyLabelTemplate.replace("{ICONO}", activeItems[0]?.icon || "dibujo").replace("{ITEM_TYPE}", template.itemTypeSingular),
      items: activeItems,
      questions: activeQuestions,
      totalStarsInScenario: template.totalStarsPerScenario, // Used for internal logic if needed, scaffold uses overallTotalStars
      icon: template.icon || DEFAULT_PICTOGRAM_ICON,
      itemTypeSingular: template.itemTypeSingular,
      itemTypePlural: template.itemTypePlural,
    });

    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserInput('');
    setIsVerified(false);
    scaffoldApi.showFeedback(null);
    setCurrentEmoji(template.icon || FACE_EMOJIS_PICTOGRAM[Math.floor(Math.random() * FACE_EMOJIS_PICTOGRAM.length)]);

  }, [availableScenarioTemplates, scenarios, scaffoldApi]);

  useEffect(() => {
    if ((scenarios as PictogramScenarioTemplate[]).length > 0 && !activeScenario ) {
      loadNewScenario();
    }
  }, [scenarios, activeScenario, loadNewScenario]);

  const currentGeneratedQuestion = activeScenario?.questions[currentQuestionIndex];
  const requiresNumericInput = currentGeneratedQuestion?.questionType === 'count_specific' || 
                               (currentGeneratedQuestion?.questionType === 'compare_two' && currentGeneratedQuestion?.correctAnswer !== "Sí" && currentGeneratedQuestion?.correctAnswer !== "No") ||
                               currentGeneratedQuestion?.questionType === 'count_total';


  const handleOptionSelectOrInputChange = (value: string) => {
    if (isVerified && scaffoldApi.showFeedback && (requiresNumericInput ? userInput === currentGeneratedQuestion?.correctAnswer : selectedOption === currentGeneratedQuestion?.correctAnswer)) return;
    
    if (requiresNumericInput) {
        // This is handled by handleKeyPress
    } else {
        setSelectedOption(value);
    }
    scaffoldApi.showFeedback(null);
    if (isVerified && scaffoldApi.showFeedback && (requiresNumericInput ? userInput !== currentGeneratedQuestion?.correctAnswer : selectedOption !== currentGeneratedQuestion?.correctAnswer)) setIsVerified(false);
  };
  
  const verifyAnswer = useCallback(() => {
    if (!currentGeneratedQuestion || !activeScenario || (requiresNumericInput && userInput === '') || (!requiresNumericInput && selectedOption === null) || (isVerified && (requiresNumericInput ? userInput === currentGeneratedQuestion.correctAnswer : selectedOption === currentGeneratedQuestion.correctAnswer))) return;
    setIsVerified(true);

    const answerToVerify = requiresNumericInput ? userInput : selectedOption;
    const isCorrect = answerToVerify === currentGeneratedQuestion.correctAnswer;
    scaffoldApi.onAttempt(isCorrect); // This will manage stars and lives

    if (isCorrect) {
      scaffoldApi.showFeedback({ type: 'correct', message: '¡Respuesta Correcta!' });
      // Scaffold will advance to next challenge if onAttempt(true) doesn't complete the exercise
    } else {
      scaffoldApi.showFeedback({ type: 'incorrect', message: 'Respuesta incorrecta. ¡Observa bien los dibujos!' });
      // Scaffold might handle retry or simply show incorrect and wait for next attempt or advance signal
    }
  }, [currentGeneratedQuestion, activeScenario, selectedOption, userInput, requiresNumericInput, isVerified, scaffoldApi]);
  
  const handleKeyPress = (key: string) => {
    if (!requiresNumericInput) return; 
    scaffoldApi.showFeedback(null);
    if (isVerified && (requiresNumericInput ? userInput === currentGeneratedQuestion?.correctAnswer : selectedOption === currentGeneratedQuestion?.correctAnswer)) return;
    if (isVerified && (requiresNumericInput ? userInput !== currentGeneratedQuestion?.correctAnswer : selectedOption !== currentGeneratedQuestion?.correctAnswer)) setIsVerified(false);


    if (key === 'backspace') setUserInput('');
    else if (key === 'check') verifyAnswer();
    else if (userInput.length < 2 && /\d/.test(key)) setUserInput(prev => prev + key);
  };

  useEffect(() => {
    if(requiresNumericInput){
        registerKeypadHandler(handleKeyPress);
    } else {
        registerKeypadHandler(null);
    }
    return () => registerKeypadHandler(null);
  }, [registerKeypadHandler, handleKeyPress, requiresNumericInput]);


  // Main content display
  const PictogramDisplay: React.FC<{ items: PictogramItem[] }> = ({ items }) => (
    <div className="w-full p-2 my-2 space-y-2 bg-slate-50 rounded-md border border-slate-200">
      {items.map(item => (
        <div key={item.category} className="flex items-center space-x-2">
          <span className="w-20 text-sm font-medium text-slate-700 text-right">{item.category}:</span>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: item.count }).map((_, i) => (
              <span key={i} className="text-2xl sm:text-3xl" role="img" aria-label={item.category}>{item.icon}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const MainContent: React.FC = () => {
    if (!activeScenario || !currentGeneratedQuestion) return <div className="p-4 text-xl text-slate-600">Cargando pictograma...</div>;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-2xl p-1 sm:p-3 space-y-2">
        <div className="relative flex items-center justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">{currentEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-green-500 text-white text-sm p-2 max-w-[260px]" direction="left">{activeScenario.title}</Icons.SpeechBubbleIcon>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-600">{activeScenario.keyLabel}</p>
        <PictogramDisplay items={activeScenario.items} />
        <p className="text-md sm:text-lg font-medium text-slate-700 mt-2 min-h-[2.5em] flex items-center text-center justify-center px-1">
            {currentGeneratedQuestion.text}
        </p>
        {requiresNumericInput && (
            <div className="w-1/2 max-w-xs h-12 sm:h-16 bg-sky-100 border-b-4 border-sky-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl text-slate-700 font-mono tracking-wider shadow-inner mt-1">
                {userInput || <span className="text-slate-400">_</span>}
            </div>
        )}
      </div>
    );
  };

  const OptionsOrKeypadSidebar: React.FC = () => { 
    if (!currentGeneratedQuestion) return null;
    if (requiresNumericInput) {
      // Keypad is handled by page-level scaffold now
      return null; 
    }
    // Options for categorical questions
    return (
      <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 p-2">
        {currentGeneratedQuestion.options.map((option, index) => {
          let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';
          if (isVerified) {
            if (selectedOption === option) {
              buttonClass = option === currentGeneratedQuestion.correctAnswer 
                ? 'bg-green-500 text-white ring-2 ring-green-700' 
                : 'bg-red-500 text-white ring-2 ring-red-700';
            } else {
              buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
            }
          } else if (selectedOption === option) {
            buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
          }
          return (
            <button key={index} onClick={() => handleOptionSelectOrInputChange(option)} disabled={isVerified && (requiresNumericInput ? userInput === currentGeneratedQuestion.correctAnswer : selectedOption === currentGeneratedQuestion.correctAnswer)}
                    className={`w-full p-2.5 sm:p-3 rounded-lg text-center text-sm sm:text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}>
              {option}
            </button>
          );
        })}
        <button onClick={verifyAnswer} disabled={(!requiresNumericInput && !selectedOption) || (isVerified && (requiresNumericInput ? userInput === currentGeneratedQuestion.correctAnswer : selectedOption === currentGeneratedQuestion.correctAnswer))}
                className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors ${((!requiresNumericInput && !selectedOption) || (isVerified && (requiresNumericInput ? userInput === currentGeneratedQuestion.correctAnswer : selectedOption === currentGeneratedQuestion.correctAnswer))) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}>
          <Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar
        </button>
      </div>
    );
  };

  // The main content is rendered by scaffold's mainExerciseContentRenderer.
  // The options or keypad (if any) are passed to scaffold's keypadComponent.
  return (<MainContent />);
};