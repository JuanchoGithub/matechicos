
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
    className={`rounded-lg shadow hover:bg-slate-100 text-slate-700 font-bold text-2xl ${applyAspectSquare ? 'aspect-square' : ''} flex items-center justify-center transition-colors ${className}`}
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
    <div className={`grid grid-cols-3 gap-2 p-2 ${className}`}>
      {baseKeys.map((key) => (
        <KeyButton key={key} value={key} onClick={onKeyPress} className="bg-white"/>
      ))}
      
      {/* Row for 0, decimal (if allowed), and backspace */}
      {allowDecimal ? (
        <>
          <KeyButton key="0" value="0" onClick={onKeyPress} className="bg-white" />
          <KeyButton key="." value="." onClick={onKeyPress} className="bg-white text-3xl pb-1" ariaLabel="Punto decimal" />
          <KeyButton key="backspace" value="backspace" onClick={onKeyPress} className="bg-white">
            <Icons.BackspaceIcon className="w-7 h-7" />
          </KeyButton>
        </>
      ) : (
        <>
          <KeyButton 
            key="0" 
            value="0" 
            onClick={onKeyPress} 
            className="col-span-2 bg-white" 
            applyAspectSquare={false}
          />
          <KeyButton key="backspace" value="backspace" onClick={onKeyPress} className="bg-white">
            <Icons.BackspaceIcon className="w-7 h-7" />
          </KeyButton>
        </>
      )}
      
      {/* Check button - spans full width or placed as needed */}
      <KeyButton 
        key="check" 
        value="check" 
        onClick={onKeyPress} 
        className="bg-yellow-400 hover:bg-yellow-500 text-white col-span-3 mt-1 h-14" // Spans 3 columns and has some margin top
        ariaLabel="Comprobar respuesta"
        applyAspectSquare={false}
      >
        <Icons.CheckIcon className="w-8 h-8" />
      </KeyButton>
    </div>
  );
};