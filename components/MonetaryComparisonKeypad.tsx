import React from 'react';
import { Icons } from './icons';

export type MonetaryComparisonOption = 'less' | 'equal' | 'more';

interface MonetaryComparisonKeypadProps {
  onOptionSelect: (option: MonetaryComparisonOption) => void;
  onVerify: () => void;
  selectedOption: MonetaryComparisonOption | null;
  isVerified: boolean;
  correctOptionForFeedback: MonetaryComparisonOption | null; // Used to style after verification
  targetAmountLabel?: string; // e.g., "$1"
}

const OPTION_DEFINITIONS: { id: MonetaryComparisonOption; labelTemplate: string }[] = [
  { id: 'less', labelTemplate: 'Menos de {TARGET}' },
  { id: 'equal', labelTemplate: 'Igual a {TARGET}' },
  { id: 'more', labelTemplate: 'Más de {TARGET}' },
];

export const MonetaryComparisonKeypad: React.FC<MonetaryComparisonKeypadProps> = ({
  onOptionSelect,
  onVerify,
  selectedOption,
  isVerified,
  correctOptionForFeedback,
  targetAmountLabel = "$1"
}) => {
  return (
    <div className="w-full flex flex-col space-y-3 p-2 mt-4">
      {OPTION_DEFINITIONS.map((optDef) => {
        const isSelected = selectedOption === optDef.id;
        const label = optDef.labelTemplate.replace('{TARGET}', targetAmountLabel);
        let buttonClass = 'bg-white text-black hover:bg-slate-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = optDef.id === correctOptionForFeedback
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (optDef.id === correctOptionForFeedback) {
            // buttonClass = 'bg-green-200 text-green-700'; // Optionally highlight correct if not chosen
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }

        return (
          <button
            key={optDef.id}
            onClick={() => onOptionSelect(optDef.id)}
            disabled={isVerified && selectedOption === correctOptionForFeedback}
            className={`w-full p-3 rounded-lg text-center text-sm font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${label}`}
          >
            {label}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption === correctOptionForFeedback)}
        className={`w-full p-3 mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${!selectedOption || (isVerified && selectedOption === correctOptionForFeedback)
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-6 h-6 mr-2" />
        Verificar
      </button>
    </div>
  );
};
