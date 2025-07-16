import React from 'react';
import { Icons } from './icons'; 

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  className?: string;
  allowDecimal?: boolean; // New prop
}

const KeyButton: React.FC<{
  value: string;
  onClick: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  applyAspectSquare?: boolean;
}> = ({ value, onClick, className = '', children, ariaLabel, applyAspectSquare = true }) => (
  <button
    onClick={() => onClick(value)}
    className={`rounded-md shadow hover:bg-slate-100 text-black font-bold min-h-[28px] ${applyAspectSquare ? 'aspect-square' : ''} flex items-center justify-center transition-colors ${className}`}
    aria-label={ariaLabel || (value === 'backspace' ? 'Borrar' : value === '.' ? 'Punto decimal' : `Número ${value}`)}
  >
    {children || value}
  </button>
);

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, className = "", allowDecimal = false }) => {
  const baseKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const specialKeys = allowDecimal ? ['0', '.', 'backspace'] : ['0', 'backspace'];
  // The 'check' button is handled separately for consistent placement

  return (
    <div className={`grid grid-cols-3 gap-1 p-0.5 ${className}`}>
      {baseKeys.map((key) => (
        <KeyButton 
          key={key} 
          value={key} 
          onClick={onKeyPress} 
          className="bg-white text-lg sm:text-xl"
        />
      ))}
      
      {/* Row for 0, decimal (if allowed), and backspace */}
      {allowDecimal ? (
        <>
          <KeyButton key="0" value="0" onClick={onKeyPress} className="bg-white text-lg sm:text-xl" />
          <KeyButton key="." value="." onClick={onKeyPress} className="bg-white text-xl sm:text-2xl pb-1" ariaLabel="Punto decimal" />
          <KeyButton key="backspace" value="backspace" onClick={onKeyPress} className="bg-white">
            <Icons.BackspaceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </KeyButton>
        </>
      ) : (
        <>
          <KeyButton 
            key="0" 
            value="0" 
            onClick={onKeyPress} 
            className="col-span-2 bg-white text-lg sm:text-xl" 
            applyAspectSquare={false}
          />
          <KeyButton key="backspace" value="backspace" onClick={onKeyPress} className="bg-white">
            <Icons.BackspaceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </KeyButton>
        </>
      )}
      
      {/* Check button - spans full width or placed as needed */}
      <KeyButton 
        key="check" 
        value="check" 
        onClick={onKeyPress} 
        className="bg-yellow-400 hover:bg-yellow-500 text-white col-span-3 mt-0.5 h-8 sm:h-10" // Further reduced height
        ariaLabel="Comprobar respuesta"
        applyAspectSquare={false}
      >
        <Icons.CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </KeyButton>
    </div>
  );
};
