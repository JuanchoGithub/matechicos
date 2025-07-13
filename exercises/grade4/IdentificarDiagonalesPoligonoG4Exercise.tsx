
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, DiagonalChallenge } from '../../types'; // Adjusted path
import { Icons } from '../../components/icons'; // Adjusted path
import { shuffleArray } from '../../utils'; // Adjusted path
import { PentagonoRegularSVG } from '../../geometryDefinitions'; // Added import for example

interface IdentificarDiagonalesPoligonoG4ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent: (content: React.ReactNode | null) => void;
}

const FACE_EMOJIS_DIAGONALES = ['🤔', '🧐', '💡', '📐', '✨', '🕸️'];

// --- Help Modal Component ---
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start z-50 py-4 px-0.5" 
      role="dialog" aria-modal="true" aria-labelledby="helpModalTitle" onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] flex flex-col mx-0.5 md:ml-2 md:mr-auto" 
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 id="helpModalTitle" className="text-xl sm:text-2xl font-semibold text-sky-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-3xl sm:text-4xl font-bold p-1" aria-label="Cerrar ayuda">&times;</button>
        </div>
        <div className="text-slate-700 space-y-3 leading-relaxed text-sm sm:text-base overflow-y-auto flex-grow">
          {children}
        </div>
        <button onClick={onClose} className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-center">Entendido</button>
      </div>
    </div>
  );
};

const ComoContarDiagonalesContent: React.FC = () => (
  <>
    <p className="font-semibold text-sky-600 text-lg">1. ¿Qué es una Diagonal?</p>
    <p>Una <strong>diagonal</strong> es una línea recta que une dos <strong>vértices</strong> (esquinas) de un polígono.</p>
    <p>¡Importante! La línea <strong>NO</strong> puede ser uno de los lados del polígono. Debe ir "por dentro" de la figura hacia una esquina que no esté justo al lado.</p>
    <div className="my-2 p-2 bg-slate-50 rounded border border-slate-200 flex justify-around items-center">
        <svg viewBox="0 0 50 50" className="w-16 h-16">
            <rect x="5" y="5" width="40" height="40" stroke="black" fill="rgba(255,215,0,0.1)" strokeWidth="1"/>
            <line x1="5" y1="5" x2="45" y2="5" stroke="red" strokeWidth="2.5" />
            <text x="25" y="30" textAnchor="middle" fontSize="6" fill="red">NO (lado)</text>
        </svg>
        <svg viewBox="0 0 50 50" className="w-16 h-16">
            <rect x="5" y="5" width="40" height="40" stroke="black" fill="rgba(255,215,0,0.1)" strokeWidth="1"/>
            <line x1="5" y1="5" x2="45" y2="45" stroke="green" strokeWidth="2.5" />
            <text x="25" y="30" textAnchor="middle" fontSize="6" fill="green">SÍ (diagonal)</text>
        </svg>
    </div>

    <p className="font-semibold text-sky-600 text-lg mt-3">2. Pasos para Encontrarlas (Ejemplo con un Pentágono)</p>
    <p>Imagina un pentágono (figura de 5 lados). Vamos a llamarle PENTI.</p>
    <div className="my-2 flex justify-center">
        <PentagonoRegularSVG className="w-24 h-24" strokeColor="black" fillColor="rgba(221, 160, 221, 0.2)"/>
    </div>
    <ol className="list-decimal list-inside space-y-1 text-left text-xs sm:text-sm">
        <li><strong>Elige una esquina.</strong> Empecemos por la esquina de arriba (A).</li>
        <li><strong>Traza líneas a las esquinas NO vecinas.</strong>
            <ul className="list-disc list-inside ml-4">
                <li>Desde A, podemos ir a C y a D. (¡2 diagonales!)</li>
                <li>(A-B y A-E son lados, no diagonales).</li>
            </ul>
        </li>
        <li><strong>Ve a la siguiente esquina (B) y repite, ¡sin contar de nuevo!</strong>
            <ul className="list-disc list-inside ml-4">
                <li>Desde B, podemos ir a D y a E. (¡2 diagonales NUEVAS!)</li>
            </ul>
        </li>
        <li><strong>Siguiente esquina (C).</strong>
             <ul className="list-disc list-inside ml-4">
                <li>Desde C, solo podemos ir a E como diagonal NUEVA. (A-C ya la contamos). (¡1 diagonal NUEVA!)</li>
            </ul>
        </li>
        <li><strong>Esquinas D y E:</strong> Si revisas, ¡todas sus diagonales ya están dibujadas!</li>
        <li><strong>Cuenta las diagonales ÚNICAS:</strong> 2 (de A) + 2 (de B) + 1 (de C) = <strong>5 diagonales</strong>.</li>
    </ol>
    <div className="my-2 flex justify-center">
        {/* Basic SVG of pentagon with diagonals */}
        <svg viewBox="0 0 100 100" className="w-28 h-28">
            <polygon points="50,10 90,40 75,85 25,85 10,40" stroke="black" fill="rgba(221,160,221,0.1)" strokeWidth="1"/>
            <line x1="50" y1="10" x2="75" y2="85" stroke="blue" strokeWidth="1"/> {/* A-C */}
            <line x1="50" y1="10" x2="25" y2="85" stroke="blue" strokeWidth="1"/> {/* A-D */}
            <line x1="90" y1="40" x2="25" y2="85" stroke="green" strokeWidth="1"/> {/* B-D */}
            <line x1="90" y1="40" x2="10" y2="40" stroke="green" strokeWidth="1"/> {/* B-E */}
            <line x1="75" y1="85" x2="10" y2="40" stroke="purple" strokeWidth="1"/> {/* C-E */}
        </svg>
    </div>
    <p className="font-semibold text-sky-600 text-lg mt-3">3. ¡A Practicar!</p>
    <p>Intenta esto con un cuadrado (4 lados). Deberías encontrar 2 diagonales.</p>
  </>
);
// --- End Help Modal ---


export const IdentificarDiagonalesPoligonoG4Exercise: React.FC<IdentificarDiagonalesPoligonoG4ExerciseProps> = ({
  exercise, scaffoldApi, setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DiagonalChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [characterEmoji, setCharacterEmoji] = useState<string>(FACE_EMOJIS_DIAGONALES[0]);
  const [availableChallenges, setAvailableChallenges] = useState<DiagonalChallenge[]>([]);
  const [showHelpModal, setShowHelpModal] = useState(false); // State for modal
  
  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => { if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges])); }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && challenges.length > 0) { pool = shuffleArray([...challenges]); setAvailableChallenges(pool); }
    if (pool.length > 0) {
      const next = {...pool[0]};
      next.options = shuffleArray([...next.options]);
      setCurrentChallenge(next);
      setAvailableChallenges(prev => prev.slice(1));
      setCharacterEmoji(FACE_EMOJIS_DIAGONALES[Math.floor(Math.random() * FACE_EMOJIS_DIAGONALES.length)]);
    } else {
      onAttempt(true); return;
    }
    setSelectedOption(null); setIsVerified(false); showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  useEffect(() => { if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) loadNewChallenge(); prevAdvanceSignalRef.current = advanceToNextChallengeSignal; }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleOptionSelect = useCallback((option: number) => {
    if (isVerified && selectedOption === currentChallenge?.correctNumDiagonals) return;
    setSelectedOption(option); showFeedback(null);
    if (isVerified && selectedOption !== currentChallenge?.correctNumDiagonals) setIsVerified(false);
  }, [isVerified, selectedOption, currentChallenge, showFeedback]);

  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || selectedOption === null || (isVerified && selectedOption === currentChallenge.correctNumDiagonals)) return;
    setIsVerified(true);
    const isCorrect = selectedOption === currentChallenge.correctNumDiagonals;
    onAttempt(isCorrect);
    if (isCorrect) showFeedback({ type: 'correct', message: '¡Correcto!' });
    else showFeedback({ type: 'incorrect', message: `Incorrecto. Un ${currentChallenge.polygonName.toLowerCase()} tiene ${currentChallenge.correctNumDiagonals} diagonales.` });
  }, [currentChallenge, selectedOption, isVerified, showFeedback, onAttempt]);

  const MainContent: React.FC = () => {
    if (!currentChallenge) return <div className="p-4 text-xl text-slate-600">Cargando...</div>;
    const { VisualComponent, polygonName, sides } = currentChallenge;
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-3">
        <div className="w-full flex justify-start m-0.5">
          <button 
            onClick={() => setShowHelpModal(true)} 
            className="px-3 py-1.5 bg-sky-500 text-white text-xs rounded-md hover:bg-sky-600 transition-colors shadow flex items-center"
            aria-label="Ayuda para identificar diagonales"
          >
            <Icons.CharacterQuestionIcon className="w-4 h-4 mr-1 opacity-80" /> Ayuda
          </button>
        </div>
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-6xl sm:text-7xl">{characterEmoji}</div>
          <Icons.SpeechBubbleIcon className="bg-red-500 text-white text-md p-2 max-w-[280px]" direction="left">
            ¿Cuántas diagonales tiene un {polygonName.toLowerCase()}? ({sides} lados)
          </Icons.SpeechBubbleIcon>
        </div>
        <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-slate-100 p-2 rounded-lg border-2 border-slate-300 shadow-inner my-2">
          <VisualComponent className="max-w-full max-h-full" strokeColor="rgb(100,100,100)" fillColor="rgba(200,200,255,0.2)" />
        </div>
      </div>
    );
  };

  const OptionsKeypad: React.FC = React.useMemo(() => () => {
    if (!currentChallenge || !currentChallenge.options) return null;
    return (
      <div className="w-full flex flex-col space-y-2 p-2">
        {currentChallenge.options.map((optNum, index) => {
          const isSelected = selectedOption === optNum;
          let buttonClass = `bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400`;
          if (isSelected) buttonClass = isVerified && optNum === currentChallenge.correctNumDiagonals ? 'bg-green-500 text-white ring-2 ring-green-700' : (isVerified ? 'bg-red-500 text-white ring-2 ring-red-700' : 'bg-sky-100 text-sky-700 ring-2 ring-sky-500');
          else if (isVerified && optNum === currentChallenge.correctNumDiagonals) buttonClass = 'bg-green-200 text-green-700';
          else if (isVerified) buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          return (<button key={index} onClick={() => handleOptionSelect(optNum)} disabled={isVerified && selectedOption === currentChallenge.correctNumDiagonals} className={`w-full p-3 rounded-lg text-center text-lg font-semibold ${buttonClass}`}>{optNum}</button>);
        })}
        <button onClick={verifyAnswer} disabled={selectedOption === null || (isVerified && selectedOption === currentChallenge.correctNumDiagonals)} className={`w-full p-3 mt-2 rounded-lg flex items-center justify-center font-semibold text-white shadow-md ${(!selectedOption || (isVerified && selectedOption === currentChallenge.correctNumDiagonals)) ? 'bg-slate-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}><Icons.CheckIcon className="w-5 h-5 mr-2" /> Verificar</button>
      </div>
    );
  }, [currentChallenge, selectedOption, isVerified, handleOptionSelect, verifyAnswer]);

  useEffect(() => { if (setCustomKeypadContent) { if (currentChallenge) setCustomKeypadContent(<OptionsKeypad />); else setCustomKeypadContent(null); } return () => { if (setCustomKeypadContent) setCustomKeypadContent(null); }; }, [setCustomKeypadContent, OptionsKeypad, currentChallenge]);

  return (
    <>
      <MainContent />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} title="¿Cómo Contar las Diagonales?">
        <ComoContarDiagonalesContent />
      </HelpModal>
    </>
  );
};
