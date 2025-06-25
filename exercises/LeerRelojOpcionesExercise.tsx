
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi } from '../types';
import { Icons } from '../components/icons';

// Data structure from types.ts (challenge data passed via exercise prop)
// export interface TimeChallengeData { ... } // REMOVED - Now in types.ts

// Props for this display-only component
interface LeerRelojDisplayProps {
  hours: number;
  minutes: number;
  currentEmoji: string;
  questionText: string;
}

const AnalogClock: React.FC<{ hours: number; minutes: number; size?: number }> = ({ hours, minutes, size = 200 }) => {
  const clockHours = hours % 12; 
  const hourAngle = (clockHours + minutes / 60) * 30; 
  const minuteAngle = minutes * 6; 
  const center = size / 2;
  const hourHandLength = size * 0.25;
  const minuteHandLength = size * 0.4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Reloj marcando las ${hours} y ${minutes}`}>
      <circle cx={center} cy={center} r={size * 0.48} fill="white" stroke="rgb(71 85 105)" strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30 * (Math.PI / 180); 
        const x1 = center + Math.sin(angle) * (size * 0.42);
        const y1 = center - Math.cos(angle) * (size * 0.42);
        const x2 = center + Math.sin(angle) * (size * 0.48);
        const y2 = center - Math.cos(angle) * (size * 0.48);
        const isMajorHour = (i === 0 || i === 3 || i === 6 || i === 9);
        return <line key={`mark-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(100 116 139)" strokeWidth={isMajorHour ? "3" : "1.5"} />;
      })}
       {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null; 
        const angle = i * 6 * (Math.PI / 180);
        const x1 = center + Math.sin(angle) * (size * 0.45);
        const y1 = center - Math.cos(angle) * (size * 0.45);
        const x2 = center + Math.sin(angle) * (size * 0.48);
        const y2 = center - Math.cos(angle) * (size * 0.48);
        return <line key={`min-mark-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(148 163 184)" strokeWidth="1" />;
      })}
      <line x1={center} y1={center} x2={center + Math.sin(hourAngle * Math.PI / 180) * hourHandLength} y2={center - Math.cos(hourAngle * Math.PI / 180) * hourHandLength} stroke="rgb(30 41 59)" strokeWidth="6" strokeLinecap="round" />
      <line x1={center} y1={center} x2={center + Math.sin(minuteAngle * Math.PI / 180) * minuteHandLength} y2={center - Math.cos(minuteAngle * Math.PI / 180) * minuteHandLength} stroke="rgb(30 41 59)" strokeWidth="4" strokeLinecap="round" />
      <circle cx={center} cy={center} r="4" fill="rgb(30 41 59)" />
    </svg>
  );
};

// This is now primarily a display component. Logic is in Grade3ExercisePage.
export const LeerRelojOpcionesExercise: React.FC<LeerRelojDisplayProps> = ({
  hours,
  minutes,
  currentEmoji,
  questionText,
}) => {
  if (hours === undefined || minutes === undefined) { // Check if props are ready
    return <div className="p-4 text-xl text-slate-600">Cargando reloj...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-3 space-y-4">
      <div className="relative flex items-center justify-center mb-2">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl">
          {currentEmoji}
        </div>
        <Icons.SpeechBubbleIcon className="bg-cyan-500 text-white text-md p-2 max-w-[280px]" direction="left">
          {questionText}
        </Icons.SpeechBubbleIcon>
      </div>
      <AnalogClock hours={hours} minutes={minutes} size={200} />
    </div>
  );
};
