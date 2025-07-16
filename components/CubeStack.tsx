import React, { useRef, useState, useEffect } from 'react';

interface CubeStackProps {
  length: number;
  width: number;
  height: number;
  unit: string;
  animate?: boolean;
}

// A single cube unit in the stack
const UnitCube: React.FC<{ x: number; y: number; z: number; size: number }> = ({ x, y, z, size }) => {
  // Calculate color based on position for better 3D effect
  const getColor = (face: string): string => {
    const baseColor = [59, 130, 246]; // Blue-500
    
    switch(face) {
      case 'top': return `rgba(${baseColor[0] + 40}, ${baseColor[1] + 40}, ${baseColor[2] + 40}, 0.9)`;
      case 'front': return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.8)`;
      case 'right': return `rgba(${baseColor[0] - 20}, ${baseColor[1] - 20}, ${baseColor[2] - 20}, 0.85)`;
      default: return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.8)`;
    }
  };

  return (
    <div 
      className="absolute transform-gpu transition-transform duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Front face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: 'translateZ(0)', 
        backgroundColor: getColor('front') 
      }} />

      {/* Back face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: `translateZ(-${size}px)`, 
        backgroundColor: getColor('front') 
      }} />

      {/* Top face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: `rotateX(-90deg) translateZ(-${size}px)`,
        transformOrigin: 'top',
        backgroundColor: getColor('top') 
      }} />

      {/* Bottom face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: `rotateX(90deg)`,
        transformOrigin: 'bottom',
        backgroundColor: getColor('bottom') 
      }} />

      {/* Left face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: `rotateY(-90deg)`,
        transformOrigin: 'left',
        backgroundColor: getColor('right') 
      }} />

      {/* Right face */}
      <div className="absolute inset-0 border border-blue-800" style={{ 
        transform: `rotateY(90deg) translateZ(${size}px)`,
        transformOrigin: 'right',
        backgroundColor: getColor('right') 
      }} />
    </div>
  );
};

export const CubeStack: React.FC<CubeStackProps> = ({ 
  length, width, height, unit, animate = false 
}) => {
  const [visibleHeight, setVisibleHeight] = useState(animate ? 0 : height);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Size of each cube unit
  const unitSize = 24; // pixels
  const cubeSize = unitSize - 1; // Small gap between cubes
  
  // Calculate isometric projection parameters
  const isoAngleX = -20; // degrees
  const isoAngleY = -30; // degrees
  
  // Animation effect for building the cube stack layer by layer
  useEffect(() => {
    if (!animate) {
      setVisibleHeight(height);
      return;
    }
    
    let currentHeight = 0;
    const interval = 300; // ms between adding layers
    
    const addLayer = () => {
      currentHeight += 1;
      setVisibleHeight(currentHeight);
      
      if (currentHeight < height) {
        animationRef.current = window.setTimeout(addLayer, interval);
      }
    };
    
    animationRef.current = window.setTimeout(addLayer, 500); // Initial delay
    
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [height, animate]);
  
  // Generate the cubes for visible layers
  const cubes = [];
  
  for (let y = 0; y < visibleHeight; y++) {
    for (let z = 0; z < width; z++) {
      for (let x = 0; x < length; x++) {
        // Only show cubes that would be visible from the viewer's perspective
        // This significantly reduces the number of DOM elements
        if (
          x === 0 || // leftmost layer
          x === length - 1 || // rightmost layer
          y === 0 || // bottom layer
          y === visibleHeight - 1 || // top layer
          z === 0 || // front layer
          z === width - 1 // back layer
        ) {
          cubes.push(
            <UnitCube
              key={`cube-${x}-${y}-${z}`}
              x={x * unitSize}
              y={-y * unitSize} // Negative because in DOM y increases downward
              z={-z * unitSize} // Negative for better visibility
              size={cubeSize}
            />
          );
        }
      }
    }
  }
  
  return (
    <div className="w-full h-full relative flex items-center justify-center" ref={containerRef}>
      <div
        className="relative transform-gpu"
        style={{
          width: `${length * unitSize}px`,
          height: `${height * unitSize}px`,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${isoAngleX}deg) rotateY(${isoAngleY}deg)`
        }}
      >
        {cubes}
        
        {/* Show outline of the final shape during animation */}
        {animate && visibleHeight < height && (
          <div 
            className="absolute top-0 left-0 border-2 border-dashed border-blue-500"
            style={{
              width: `${length * unitSize}px`,
              height: `${height * unitSize}px`,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${-width * unitSize}px)`
            }}
          />
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 text-sm text-blue-900 font-bold shadow-sm bg-white bg-opacity-70 p-1 rounded">
        <div>{length} × {width} × {height} {unit}³</div>
        <div>Volumen: {length * width * height} {unit}³</div>
      </div>
    </div>
  );
};
