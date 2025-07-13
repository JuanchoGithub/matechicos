
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, RomanNumeralChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { shuffleArray } from '../../utils';

interface NumerosRomanosG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_ROMANOS = ['🏛️', '🤔', '🧐', '📜', '✒️', '💡'];

const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) return "N/A"; // Basic Roman numerals usually up to 3999
    const romanMap: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let result = '';
    for (let key in romanMap) {
        while (num >= romanMap[key]) {
            result += key;
            num -= romanMap[key];
        }
    }
    return result;
};


export const NumerosRomanosG4Exercise: React.FC<NumerosRomanosG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<RomanNumeralChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_ROMANOS[0]);
  const [availableChallenges, setAvailableChallenges] = useState<RomanNumeralChallenge[]>([]);

  const { challenges = [], maxNumber = 100 } = exercise.data || {}; // maxNumber used if no predefined challenges
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  const generateSingleChallenge = useCallback((): RomanNumeralChallenge => {
    const numAr = Math.floor(Math.random() * maxNumber) + 1;
    const numRo = toRoman(numAr);
    const questionType = Math.random() < 0.5 ? 'ar_to_ro' : 'ro_to_ar';
    let options: string[] = [];
    let correctAnswer = "";

    if (questionType === 'ar_to_ro') {
      correctAnswer = numRo;
      options.push(correctAnswer);
      while (options.length < 4) {
        const randomNum = Math.floor(Math.random() * maxNumber) + 1;
        if (randomNum !== numAr) {
          const distractorRoman = toRoman(randomNum);
          if (!options.includes(distractorRoman)) options.push(distractorRoman);
        }
      }
    } else { // ro_to_ar
      correctAnswer = numAr.toString();
      options.push(correctAnswer);
      while (options.length < 4) {
        const randomNum = Math.floor(Math.random() * maxNumber) + 1;
        if (randomNum !== numAr && !options.includes(randomNum.toString())) {
          options.push(randomNum.toString());
        }
      }
    }
    return { numberAr: numAr, numberRo: numRo, options: shuffleArray(options), questionType, correctAnswer } as RomanNumeralChallenge;
  }, [maxNumber]);
  
  useEffect(() => {
    if ((challenges as RomanNumeralChallenge[]).length > 0) {
      setAvailableChallenges(shuffleArray([...challenges as RomanNumeralChallenge[]]));
    } else {
      const pool: RomanNumeralChallenge[] = [];
      for(let i=0; i< (exercise.data?.totalStars || 10) * 2; i++) pool.push(generateSingleChallenge());
      setAvailableChallenges(shuffleArray(pool));
    }
  }, [challenges, exercise.id, exercise.data?.totalStars, maxNumber, generateSingleChallenge]);

  const loadNewChallenge = useCallback(() => {
    setAvailableChallenges(currentPool => {
        let nextPool = [...currentPool];
        if (nextPool.length === 0) {
            if (challenges.length > 0) {
                nextPool = shuffleArray([...challenges as RomanNumeralChallenge[]]);
            } else {
                // No predefined challenges, generate a new dynamic one
                setCurrentChallenge(generateSingleChallenge());
                return []; // Pool is empty, a dynamic one was just set
            }
        }
        
        if (nextPool.length > 0) {
            const nextChallenge = {...nextPool.shift()!};

            // Improvement: Robustly generate and shuffle options if missing.
            if (!nextChallenge.options || nextChallenge.options.length === 0) {
                const correctAnswer = nextChallenge.questionType === 'ar_to_ro' ? nextChallenge.numberRo : nextChallenge.numberAr.toString();
                const tempOptions: string[] = [correctAnswer];
                while(tempOptions.length < 4) {
                    const randomNum = Math.floor(Math.random() * maxNumber) + 1;
                    if (nextChallenge.questionType === 'ar_to_ro') {
                        const distractor = toRoman(randomNum);
                        if (distractor !== correctAnswer && !tempOptions.includes(distractor)) tempOptions.push(distractor);
                    } else {
                        if (randomNum !== nextChallenge.numberAr && !tempOptions.includes(randomNum.toString())) tempOptions.push(randomNum.toString());
                    }
                }
                nextChallenge.options = tempOptions;
            }
            nextChallenge.options = shuffleArray(nextChallenge.options!);
            
            setCurrentChallenge(nextChallenge);
            setSelectedOption(null);
            setIsVerified(false);
            showFeedback(null);
            setCharacterEmoji(FACE_EMOJIS_ROMANOS[Math.floor(Math.random() * FACE_EMOJIS_ROMANOS.length)]);
            
            return nextPool;
        } else {
            // Should not be reached if dynamic generation is handled above, but as a fallback.
            onAttempt(true);
            return [];
        }
    });
  }, [challenges, maxNumber, showFeedback, onAttempt, generateSingleChallenge]);


  useEffect(() => { 
    // This effect ensures the very first challenge is loaded.
    loadNewChallenge(); 
  }, [exercise.id]); // Reruns only when the exercise itself changes

  useEffect(() => { 
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) {
        loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal; 
  }, [advanceToNextChallengeSignal, loadNewChallenge]);


  const handleOptionSelect = useCallback((option: string) => {
    if (isVerified && currentChallenge && selectedOption === (currentChallenge.questionType === 'ar_to_ro' ? currentChallenge.numberRo : currentChallenge.numberAr.toString())) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== (currentChallenge?.questionType === 'ar_to_ro' ? currentChallenge.numberRo : currentChallenge?.numberAr.toString())) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !selectedOption || (isVerified && selectedOption === (currentChallenge.questionType === 'ar_to_ro' ? currentChallenge.numberRo : currentChallenge.numberAr.toString()))) return;
    setIsVerified(true);
    const correctAnswer = currentChallenge.questionType === 'ar_to_ro' ? currentChallenge.numberRo : currentChallenge.numberAr.toString();
    const isCorrect = selectedOption === correctAnswer;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. La respuesta era ${correctAnswer}.` });
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const questionText = currentChallenge.questionType === 'ar_to_ro' 
      ? `¿Cuál es el número romano para ${currentChallenge.numberAr}?`
      : `¿Qué número arábigo es ${currentChallenge.numberRo}?`;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-amber-600 text-white text-md p-2 max-w-[280px]" direction="left">
            {questionText}
          </Icons.SpeechBubbleIcon>
        </div>
        <p className="text-2xl text-slate-600 mt-2">
          {currentChallenge.questionType === 'ar_to_ro' ? `Número: ${currentChallenge.numberAr}` : `Romano: ${currentChallenge.numberRo}`}
        </p>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    const correctAnswer = currentChallenge.questionType === 'ar_to_ro' ? currentChallenge.numberRo : currentChallenge.numberAr.toString();
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentChallenge.options.map((optStr, index) => {
          const isSelected = selectedOption === optStr;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) buttonClass = isVerified && optStr === correctAnswer ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          else if (isVerified && optStr === correctAnswer) buttonClass = 'bg-green-200 text-green-700';
          else if (isVerified) buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          return (<button key={index} onClick={() => handleOptionSelect(optStr)} disabled={isVerified && selectedOption === correctAnswer} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{optStr}</button>);
        })}
        <button onClick={verifyAnswer} disabled={!selectedOption || (isVerified && selectedOption === correctAnswer)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === correctAnswer)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { if (setCustomKeypadContent) { if (currentChallenge) setCustomKeypadContent(<OptionsKeypad />); else setCustomKeypadContent(null); } return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return <MainContent />;
};
