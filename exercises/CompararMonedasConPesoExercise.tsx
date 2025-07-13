
import React from 'react';
import { Icons } from '../components/icons'; // Adjusted path
import { ExerciseScaffoldApi, Coin } from '../types'; // Adjusted path & Added Coin type

// Interface for individual coins (assuming this structure is passed from the page)
// Coin interface moved to types.ts for broader use

// Props for this display-only component
interface CompararMonedasConPesoDisplayProps {
  coinsToDisplay: Coin[];
  currentEmoji: string;
  questionText: string; // e.g., "El valor total de las monedas es:"
  // No scaffoldApi or event handlers needed here directly
}

const FACE_EMOJIS_COMPARE_MONEY = ['🪙', '💰', '🤔', '🧐', '⚖️', '👍', '🎯']; // Kept for local emoji cycle if needed, though page might control it

export const CompararMonedasConPesoExercise: React.FC<CompararMonedasConPesoDisplayProps> = ({
  coinsToDisplay,
  currentEmoji,
  questionText,
}) => {
  if (!coinsToDisplay || coinsToDisplay.length === 0) {
    return <div className="p-4 text-xl text-slate-600">Cargando monedas...</div>;
  }

  const allCoinLabels = coinsToDisplay.flatMap(coin => Array(coin.count).fill(coin.label));
  const displayEmoji = currentEmoji || FACE_EMOJIS_COMPARE_MONEY[Math.floor(Math.random() * FACE_EMOJIS_COMPARE_MONEY.length)];

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
      <div className="relative flex items-center justify-center mb-2">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
          {displayEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-yellow-500 text-slate-800 text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
          {questionText}
        </Icons.SpeechBubbleIcon>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-2 p-3 bg-slate-100 rounded-lg shadow-inner min-h-[80px] w-full max-w-md">
          {allCoinLabels.map((coinLabel, index) => (
              <div key={index} className="p-1.5 bg-amber-300 border-2 border-amber-500 rounded-full text-sm font-semibold text-amber-800 shadow">
                  {coinLabel}
              </div>
          ))}
          {allCoinLabels.length === 0 && <p className="text-slate-500 italic">No hay monedas para mostrar.</p>}
      </div>
      {/* The verification feedback will be handled by the ExerciseScaffold in the page component */}
    </div>
  );
};
