
import React from 'react';
import { Icons } from './icons';

interface TimeOptionsKeypadProps {
  options: string[];
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  onVerify: () => void;
  isVerified: boolean;
  correctAnswerText: string | null; // To style correctly after verification
}

export const TimeOptionsKeypad: React.FC<TimeOptionsKeypadProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  onVerify,
  isVerified,
  correctAnswerText,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2 sm:space-y-3 p-2 mt-4">
      {options.map((optionText, index) => {
        const isSelected = selectedOption === optionText;
        let buttonClass = 'bg-white text-slate-700 hover:bg-sky-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = optionText === correctAnswerText
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (optionText === correctAnswerText) {
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
            key={index}
            onClick={() => onOptionSelect(optionText)}
            disabled={isVerified && selectedOption === correctAnswerText}
            className={`w-full p-3 rounded-lg text-center text-sm sm:text-md font-semibold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
          >
            {optionText}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedOption || (isVerified && selectedOption === correctAnswerText)}
        className={`w-full p-3 mt-3 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${(!selectedOption || (isVerified && selectedOption === correctAnswerText))
            ? 'bg-slate-300 cursor-not-allowed' 
            : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600'}`}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        Verificar
      </button>
    </div>
  );
};
