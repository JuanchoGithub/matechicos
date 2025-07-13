import React from 'react';
import { Icons } from './icons';
import { ComparisonSymbol } from '../types'; // Updated path, assuming ComparisonSymbol might be used elsewhere or defined in types.ts

export const COMPARISON_SYMBOLS_OPTIONS: ComparisonSymbol[] = ['<', '=', '>'];

interface ComparisonKeypadProps {
  onSymbolSelect: (symbol: ComparisonSymbol) => void;
  onVerify: () => void;
  selectedSymbol: ComparisonSymbol | null;
  isVerified: boolean;
  correctSymbolForFeedback: ComparisonSymbol | null; // Used to style after verification
}

export const ComparisonKeypad: React.FC<ComparisonKeypadProps> = ({
  onSymbolSelect,
  onVerify,
  selectedSymbol,
  isVerified,
  correctSymbolForFeedback,
}) => {
  return (
    <div className="w-full flex flex-col space-y-3 p-2 mt-4">
      {COMPARISON_SYMBOLS_OPTIONS.map((symbol) => {
        const isSelected = selectedSymbol === symbol;
        let buttonClass = 'bg-white text-black hover:bg-slate-50 focus:ring-2 focus:ring-sky-400';

        if (isVerified) {
          if (isSelected) {
            buttonClass = symbol === correctSymbolForFeedback
              ? 'bg-green-500 text-white ring-2 ring-green-700'
              : 'bg-red-500 text-white ring-2 ring-red-700';
          } else if (symbol === correctSymbolForFeedback) {
            // Optionally highlight correct if not chosen
            // buttonClass = 'bg-green-200 text-green-700';
          } else {
            buttonClass = 'bg-slate-200 text-slate-500 cursor-not-allowed';
          }
        } else if (isSelected) {
          buttonClass = 'bg-sky-100 text-sky-700 ring-2 ring-sky-500';
        }

        return (
          <button
            key={symbol}
            onClick={() => onSymbolSelect(symbol)}
            disabled={isVerified && selectedSymbol === correctSymbolForFeedback}
            className={`w-full p-4 rounded-lg text-center text-4xl font-bold transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${buttonClass}`}
            aria-label={`Símbolo ${symbol === '<' ? 'menor que' : symbol === '>' ? 'mayor que' : 'igual a'}`}
          >
            {symbol}
          </button>
        );
      })}
      <button
        onClick={onVerify}
        disabled={!selectedSymbol || (isVerified && selectedSymbol === correctSymbolForFeedback)}
        className={`w-full p-3 mt-4 rounded-lg flex items-center justify-center font-semibold text-white shadow-md transition-colors
          ${!selectedSymbol || (isVerified && selectedSymbol === correctSymbolForFeedback)
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
