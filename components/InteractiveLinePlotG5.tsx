
import React from 'react';

interface InteractiveLinePlotProps {
  range: [number, number];
  step: number;
  unit: string;
  dotIcon?: string;
  plotData: Map<number, number>; // Map from value to count of dots
  onPlotChange: (newPlotData: Map<number, number>) => void;
  isInteractive: boolean;
  size?: { width: number; height: number };
}

export const InteractiveLinePlotG5: React.FC<InteractiveLinePlotProps> = ({
  range, step, unit, dotIcon = 'X', plotData, onPlotChange, isInteractive,
  size = { width: 400, height: 200 }
}) => {
  const padding = { top: 20, right: 20, bottom: 40, left: 30 };
  const plotWidth = size.width - padding.left - padding.right;
  const plotHeight = size.height - padding.top - padding.bottom;

  const [min, max] = range;
  const tickValues: number[] = [];
  for (let i = min; i <= max; i += step) {
    tickValues.push(parseFloat(i.toFixed(2)));
  }

  const valueToX = (value: number) => {
    if (max === min) return plotWidth / 2;
    return ((value - min) / (max - min)) * plotWidth;
  };
  
  const yPerDot = 18; // Height of each dot/emoji + spacing

  const handleTickClick = (value: number) => {
    if (!isInteractive) return;
    const newPlotData = new Map(plotData);
    const currentCount = newPlotData.get(value) || 0;
    newPlotData.set(value, currentCount + 1);
    onPlotChange(newPlotData);
  };
  
  const handleDotClick = (value: number) => {
    if (!isInteractive) return;
    const newPlotData = new Map(plotData);
    const currentCount = newPlotData.get(value) || 0;
    if (currentCount > 0) {
      newPlotData.set(value, currentCount - 1);
    }
    onPlotChange(newPlotData);
  };

  return (
    <svg width={size.width} height={size.height} aria-label={`Gráfico de puntos interactivo de ${min}${unit} a ${max}${unit}`}>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Axis line */}
        <line x1="0" y1={plotHeight} x2={plotWidth} y2={plotHeight} stroke="rgb(100 116 139)" strokeWidth="1.5" />

        {/* Ticks, Labels, and Clickable Areas */}
        {tickValues.map(value => (
          <g key={`tick-group-${value}`} transform={`translate(${valueToX(value)}, 0)`}>
            <line x1="0" y1={plotHeight} x2="0" y2={plotHeight + 5} stroke="rgb(100 116 139)" strokeWidth="1" />
            <text x="0" y={plotHeight + 20} textAnchor="middle" fontSize="11" fill="rgb(71 85 105)">
              {value.toLocaleString()}
            </text>
            {isInteractive && (
                <rect 
                    x={-plotWidth / (tickValues.length -1) / 2} 
                    y="0" 
                    width={plotWidth / (tickValues.length - 1)} 
                    height={plotHeight} 
                    fill="transparent" 
                    className="cursor-pointer"
                    onClick={() => handleTickClick(value)}
                    aria-label={`Añadir punto en ${value} ${unit}`}
                />
            )}
          </g>
        ))}

        {/* Plotted Dots/Emojis */}
        {Array.from(plotData.entries()).map(([value, count]) => {
          if (count === 0) return null;
          const x = valueToX(value);
          return Array.from({ length: count }).map((_, i) => (
            <text
              key={`dot-${value}-${i}`}
              x={x}
              y={plotHeight - (i * yPerDot) - 5}
              textAnchor="middle"
              fontSize="16"
              className={isInteractive ? "cursor-pointer" : ""}
              onClick={() => handleDotClick(value)}
              aria-label={`Punto en ${value}. Click para remover.`}
            >
              {dotIcon}
            </text>
          ));
        })}
      </g>
    </svg>
  );
};
