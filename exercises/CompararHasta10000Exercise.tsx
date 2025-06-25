
import React from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, ComparisonSymbol } from '../types'; // Import ComparisonSymbol from types.ts
import { Icons } from '../components/icons';

// ComparisonSymbol is now imported from types.ts

// These might be moved or passed as props if more variation is needed
const FACE_EMOJIS_COMPARISON = ['⚖️', '🤔', '🧐', '👀', '💡', '🧠', '👍', '👌', '🎯', '💯'];

interface CompararHasta10000DisplayProps {
  // Props to display the current state, managed by the page
  number1: number | null;
  number2: number | null;
  selectedSymbol: ComparisonSymbol | null;
  currentEmoji: string;
  questionText: string; // Added from error
  // Removed: exercise, scaffoldApi. This is now primarily for display.
}

export const CompararHasta10000Exercise: React.FC<CompararHasta10000DisplayProps> = ({
  number1,
  number2,
  selectedSymbol,
  currentEmoji,
  questionText, // Added from error
}) => {
  if (number1 === null || number2 === null) {
    return <div className="text-xl text-slate-600">Cargando desafío...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl">
      <div className="relative mb-8">
        <div className="w-32 h-32 flex items-center justify-center text-8xl">
          {currentEmoji || FACE_EMOJIS_COMPARISON[0]}
        </div>
        <div className="absolute -top-5 -right-10 transform translate-x-1/2">
          <Icons.SpeechBubbleIcon className="bg-purple-500 text-white" direction="left">
            <Icons.CharacterQuestionIcon className="w-8 h-8 inline-block opacity-75" />
          </Icons.SpeechBubbleIcon>
        </div>
      </div>

      <div className="flex items-center justify-around w-full mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-300 w-40 h-32 flex items-center justify-center">
          <span className="text-5xl font-bold text-blue-600">{number1}</span>
        </div>
        <div
          className="text-6xl font-bold text-slate-400 w-20 h-20 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300"
          aria-hidden="true"
        >
          {selectedSymbol || '?'}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-300 w-40 h-32 flex items-center justify-center">
          <span className="text-5xl font-bold text-green-600">{number2}</span>
        </div>
      </div>
    </div>
  );
};
