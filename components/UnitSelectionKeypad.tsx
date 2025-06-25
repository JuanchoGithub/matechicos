
import React from 'react';
import { UnitOptionGeneric } from '../types';
import { Icons } from './icons';

interface UnitSelectionKeypadProps {
  options: UnitOptionGeneric[];
  selectedOptionId: string | null;
  onOptionSelect: (unitId: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctOptionId: string | null; // To style correctly after verification
}

export const UnitSelectionKeypad: React.FC<UnitSelectionKeypadProps> = ({
  options,
  selectedOptionId,
  onOptionSelect,
  onVerify,
  isVerified,
  correctOptionId,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {options.map((option) => {
        const isSelected = selectedOptionId === option.unitId;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = option.unitId === correctOptionId
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (option.unitId === correctOptionId) {
            // Optionally highlight correct answer if not selected by user
            // buttonClass = 'bg-green-200 text-green-700';
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }

        return (
          <button
            key={option.unitId}
            onClick={() => onOptionSelect(option.unitId)}
            disabled={isVerified && selectedOptionId === correctOptionId}
            className={`w-full p-3 sm:p-4 rounded-lg text-center text-lg sm:text-xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Opción: ${option.fullLabel} (${option.label})`}
          >
            {option.fullLabel} <span className="text-sm">({option.label})</span>
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOptionId || (isVerified && selectedOptionId === correctOptionId)}
        className={`w-full p-3 mt-3 sm:mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${!selectedOptionId || (isVerified && selectedOptionId === correctOptionId)
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'
          }`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        Verificar
      </button>
    </div>
  );
};
