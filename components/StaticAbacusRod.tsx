
import React from 'react';
import { PlaceValueKey } from '../types'; // Import directly from types.ts
import { ROD_CONFIG } from './abacusConstants';

interface StaticAbacusRodProps {
  placeValue: PlaceValueKey;
  count: number;
}

export const StaticAbacusRod: React.FC<StaticAbacusRodProps> = ({ placeValue, count }) => {
  const config = ROD_CONFIG[placeValue];
  const beads = Array.from({ length: Math.max(0, Math.min(count, 9)) }); // Ensure count is between 0 and 9

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2">
      {/* Top spacer to align with interactive rod's button height */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 sm:mb-2"></div>
      <div 
        className={`w-8 sm:w-10 h-48 sm:h-64 ${config.color} bg-opacity-30 rounded-md flex flex-col-reverse justify-start p-1 items-center relative shadow-inner`}
        aria-label={`${config.label}: ${count} ${count === 1 ? 'cuenta' : 'cuentas'}`}
        role="img" // Indicate it's a graphical representation
      >
        {/* Beads */}
        {beads.map((_, i) => (
          <div key={`bead-${i}`} className={`w-6 h-4 sm:w-8 sm:h-5 rounded-full ${config.beadColor} my-0.5 shadow-sm`}></div>
        ))}
        {/* Rod line */}
         <div className="absolute top-0 left-1/2 w-1 h-full bg-slate-500/50 transform -translate-x-1/2 -z-10 rounded-full"></div>
      </div>
       <span className="mt-1 sm:mt-2 text-sm sm:text-md font-semibold text-slate-600">{config.label}</span>
       {/* Bottom spacer to align with interactive rod's button height */}
       <div className="w-8 h-8 sm:w-10 sm:h-10 mt-1 sm:mt-2"></div>
    </div>
  );
};