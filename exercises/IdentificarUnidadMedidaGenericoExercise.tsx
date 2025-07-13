
import React from 'react';
import { ItemChallengeGeneric } from '../types';
import { Icons } from '../components/icons';

// Props for the display-only component
interface IdentificarUnidadMedidaGenericoDisplayProps {
  currentChallenge: ItemChallengeGeneric | null;
  currentEmoji: string;
  questionPrompt: string;
}

export const IdentificarUnidadMedidaGenericoExercise: React.FC<IdentificarUnidadMedidaGenericoDisplayProps> = ({
  currentChallenge,
  currentEmoji,
  questionPrompt,
}) => {
  if (!currentChallenge) {
    return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
  }
  const itemEmojiToDisplay = currentChallenge.emoji || currentEmoji;

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4 sm:space-y-6">
      <div className="relative flex items-center justify-center mb-2 sm:mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
          {itemEmojiToDisplay}
        </div>
        <Icons.SpeechBubbleIcon className="bg-indigo-500 text-white text-md sm:text-lg p-2 sm:p-3 max-w-xs" direction="left">
           {questionPrompt} <strong className="block text-lg sm:text-xl">{currentChallenge.description}</strong>
        </Icons.SpeechBubbleIcon>
      </div>
    </div>
  );
};
