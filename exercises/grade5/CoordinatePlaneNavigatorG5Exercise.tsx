import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, CoordinatePlaneChallenge } from '../../types';
import { Icons } from '../../components/icons';
import { NumericKeypad } from '../../components/NumericKeypad';

interface CoordinatePlaneNavigatorProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

// Colors and styling constants
const GRID_COLOR = '#cbd5e1'; // slate-300
const AXIS_COLOR = '#475569'; // slate-600
const POINT_COLOR = '#ef4444'; // red-500
const TARGET_COLOR = '#3b82f6'; // blue-500
const TREASURE_COLOR = '#f59e0b'; // amber-500
const GRID_SIZE = 10; // 10x10 grid
const POINT_RADIUS = 6;

interface Point {
  x: number;
  y: number;
}

export const CoordinatePlaneNavigatorG5Exercise: React.FC<CoordinatePlaneNavigatorProps> = ({
  exercise,
  scaffoldApi,
  setCustomKeypadContent,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<CoordinatePlaneChallenge | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<CoordinatePlaneChallenge[]>([]);
  const [userPoint, setUserPoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [inputCoords, setInputCoords] = useState<{ x: string, y: string }>({ x: '', y: '' });
  const [currentEmoji, setCurrentEmoji] = useState<string>('🧭');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { challenges = [] } = exercise.data as { totalStars?: number; challenges: CoordinatePlaneChallenge[] } || {};
  const { advanceToNextChallengeSignal, showFeedback, onAttempt } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  // Initialize challenges
  useEffect(() => {
    if (challenges.length > 0) {
      setAvailableChallenges(shuffleArray([...challenges]));
    }
  }, [challenges]);

  // Load new challenge
  const loadNewChallenge = useCallback(() => {
    let challengePool = availableChallenges;
    if (challengePool.length === 0 && challenges.length > 0) {
      challengePool = shuffleArray([...challenges]);
      setAvailableChallenges(challengePool);
    }

    if (challengePool.length > 0) {
      const nextChallenge = challengePool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));
      
      // Reset state for new challenge
      setUserPoint(null);
      setShowTarget(false);
      setShowHint(false);
      setInputCoords({ x: '', y: '' });
      
      // Set emoji based on challenge type
      setCurrentEmoji(nextChallenge.type === 'plot' ? '🧭' : '🏆');
      
      // Show initial hint if available
      if (nextChallenge.hints?.initial) {
        showFeedback({ type: 'correct', message: nextChallenge.hints.initial });
        setTimeout(() => showFeedback(null), 3000);
      }
    } else {
      onAttempt(true);
      return;
    }

    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  // Initialize and handle challenge advances
  useEffect(() => {
    if (challenges.length > 0 && !currentChallenge) {
      loadNewChallenge();
    }
  }, [challenges, currentChallenge, loadNewChallenge]);

  useEffect(() => {
    if (advanceToNextChallengeSignal > prevAdvanceSignalRef.current) {
      loadNewChallenge();
    }
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  // Draw the coordinate plane grid
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make sure canvas dimensions are set correctly
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = Math.min(width, height) / (GRID_SIZE + 2); // Add 2 for margin

    // Clear canvas with a white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate origin (0,0) at bottom left with margin
    const originX = cellSize * 1.5;
    const originY = height - cellSize * 1.5;
    
    // Draw grid lines
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(originX, originY - i * cellSize);
      ctx.lineTo(originX + GRID_SIZE * cellSize, originY - i * cellSize);
      ctx.stroke();
    }
    
    // Draw vertical grid lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(originX + i * cellSize, originY);
      ctx.lineTo(originX + i * cellSize, originY - GRID_SIZE * cellSize);
      ctx.stroke();
    }
    
    // Draw X and Y axes with stronger lines
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 2.5;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(originX - 5, originY);
    ctx.lineTo(originX + GRID_SIZE * cellSize + 10, originY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, originY + 5);
    ctx.lineTo(originX, originY - GRID_SIZE * cellSize - 10);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = AXIS_COLOR;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // X-axis numbers
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.fillText(`${i}`, originX + i * cellSize, originY + cellSize / 2);
    }
    
    // Y-axis numbers
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.fillText(`${i}`, originX - cellSize / 2, originY - i * cellSize);
    }
    
    // Label axes
    ctx.font = 'bold 16px Arial';
    ctx.fillText('X', originX + GRID_SIZE * cellSize + cellSize / 2, originY);
    ctx.fillText('Y', originX, originY - GRID_SIZE * cellSize - cellSize / 2);
    
    // Draw user point if available
    if (userPoint) {
      const pointX = originX + userPoint.x * cellSize;
      const pointY = originY - userPoint.y * cellSize;
      
      // Add a white halo for visibility
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pointX, pointY, POINT_RADIUS + 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw the actual point
      ctx.fillStyle = POINT_COLOR;
      ctx.beginPath();
      ctx.arc(pointX, pointY, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a label showing coordinates
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`(${userPoint.x},${userPoint.y})`, pointX, pointY - 15);
    }
    
    // Draw target/correct point if needed
    if (showTarget && currentChallenge) {
      const targetX = originX + currentChallenge.x * cellSize;
      const targetY = originY - currentChallenge.y * cellSize;
      
      // Draw target as a treasure if identify type
      if (currentChallenge.type === 'identify') {
        const treasureSize = cellSize * 0.9;
        
        // Draw attention circle
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)'; // Semi-transparent gold
        ctx.beginPath();
        ctx.arc(targetX, targetY, treasureSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw treasure circle
        ctx.fillStyle = TREASURE_COLOR;
        ctx.strokeStyle = '#7c2d12'; // Darker outline
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, treasureSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw treasure chest symbol with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💰', targetX, targetY);
        ctx.shadowColor = 'transparent';
        
        // Draw a "?" to indicate this is what needs to be identified
        ctx.fillStyle = '#7c2d12';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('?', targetX, targetY - 25);
      } else {
        // Draw target point for plot type
        ctx.strokeStyle = TARGET_COLOR;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(targetX, targetY, POINT_RADIUS + 4, 0, Math.PI * 2);
        ctx.stroke();
        
        // Fill with semi-transparent color
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Semi-transparent blue
        ctx.beginPath();
        ctx.arc(targetX, targetY, POINT_RADIUS + 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [currentChallenge, userPoint, showTarget]);
  
  // Convert screen coordinates to grid coordinates
  const screenToGridCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cell size (accounting for margins)
    const cellSize = Math.min(width, height) / (GRID_SIZE + 2);
    
    // Calculate origin position
    const originX = cellSize * 1.5;
    const originY = height - cellSize * 1.5;
    
    // Get position relative to the canvas
    const mouseX = (clientX - rect.left);
    const mouseY = (clientY - rect.top);
    
    // Convert to grid coordinates
    const gridX = Math.round((mouseX - originX) / cellSize);
    const gridY = Math.round((originY - mouseY) / cellSize);
    
    return { gridX, gridY };
  };

  // Canvas event handlers for dragging and positioning points
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !currentChallenge || currentChallenge.type === 'identify') return;
    
    const coords = screenToGridCoordinates(e.clientX, e.clientY);
    if (!coords) return;
    
    const { gridX, gridY } = coords;
    
    // Ensure point is within the grid (first quadrant only)
    if (gridX >= 0 && gridX <= GRID_SIZE && gridY >= 0 && gridY <= GRID_SIZE) {
      setUserPoint({ x: gridX, y: gridY });
      setInputCoords({ x: gridX.toString(), y: gridY.toString() });
      setIsDragging(true);
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || !currentChallenge || currentChallenge.type === 'identify') return;
    
    const coords = screenToGridCoordinates(e.clientX, e.clientY);
    if (!coords) return;
    
    const { gridX, gridY } = coords;
    
    // Ensure point is within the grid (first quadrant only)
    if (gridX >= 0 && gridX <= GRID_SIZE && gridY >= 0 && gridY <= GRID_SIZE) {
      setUserPoint({ x: gridX, y: gridY });
      setInputCoords({ x: gridX.toString(), y: gridY.toString() });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };
  
  // Current coordinate being edited (x or y)
  const [activeCoord, setActiveCoord] = useState<'x' | 'y'>('x');

  // Handle numeric keypad input
  const handleKeypadPress = (key: string) => {
    if (!currentChallenge || currentChallenge.type !== 'identify') return;
    
    if (key === 'check') {
      if (userPoint) {
        verifyAnswer();
      }
      return;
    }
    
    if (key === 'backspace') {
      // Handle backspace
      const newValue = inputCoords[activeCoord].slice(0, -1);
      const newCoords = { ...inputCoords, [activeCoord]: newValue };
      setInputCoords(newCoords);
      
      // Update or clear user point
      const x = parseInt(activeCoord === 'x' ? newValue : inputCoords.x);
      const y = parseInt(activeCoord === 'y' ? newValue : inputCoords.y);
      
      if (!isNaN(x) && !isNaN(y) && x >= 0 && x <= GRID_SIZE && y >= 0 && y <= GRID_SIZE) {
        setUserPoint({ x, y });
      } else {
        setUserPoint(null);
      }
      
      // If input is cleared, swap to the other coordinate field
      if (newValue === '') {
        setActiveCoord(activeCoord === 'x' ? 'y' : 'x');
      }
      
      return;
    }
    
    // Handle number keys
    const currentValue = inputCoords[activeCoord];
    
    // Prevent values larger than GRID_SIZE or more than 2 digits
    const newValue = currentValue + key;
    const numValue = parseInt(newValue);
    
    if (numValue > GRID_SIZE || newValue.length > 2) {
      // If we hit the limit, automatically move to the other coordinate field
      if (activeCoord === 'x' && inputCoords.y === '') {
        setActiveCoord('y');
      }
      return;
    }
    
    // Update the coordinate
    const newCoords = { ...inputCoords, [activeCoord]: newValue };
    setInputCoords(newCoords);
    
    // Update user point if both coordinates are valid
    const x = parseInt(activeCoord === 'x' ? newValue : inputCoords.x);
    const y = parseInt(activeCoord === 'y' ? newValue : inputCoords.y);
    
    if (!isNaN(x) && !isNaN(y) && x >= 0 && x <= GRID_SIZE && y >= 0 && y <= GRID_SIZE) {
      setUserPoint({ x, y });
      
      // Auto-switch to y coordinate after entering x
      if (activeCoord === 'x' && inputCoords.y === '') {
        setActiveCoord('y');
      }
    }
  };
  
  // Set initial visibility of treasure for identify challenges
  useEffect(() => {
    if (currentChallenge?.type === 'identify') {
      setShowTarget(true); // Show the treasure immediately for identify challenges
    } else {
      setShowTarget(false); // Hide for plot challenges until verification
    }
  }, [currentChallenge]);

  // Verify the answer
  const verifyAnswer = useCallback(() => {
    if (!currentChallenge || !userPoint) return;
    
    const isCorrect = userPoint.x === currentChallenge.x && userPoint.y === currentChallenge.y;
    
    // For plot challenges, show target after verification
    if (currentChallenge.type === 'plot') {
      setShowTarget(true);
    }
    
    onAttempt(isCorrect);
    
    if (isCorrect) {
      if (currentChallenge.type === 'plot') {
        showFeedback({ 
          type: 'correct', 
          message: `¡Excelente! Has ubicado correctamente el punto (${currentChallenge.x},${currentChallenge.y}), que está ${currentChallenge.x} a la derecha y ${currentChallenge.y} hacia arriba.` 
        });
      } else {
        showFeedback({ 
          type: 'correct', 
          message: `¡Correcto! Las coordenadas del tesoro son (${currentChallenge.x},${currentChallenge.y}).` 
        });
      }
    } else {
      if (currentChallenge.hints?.afterAttempt) {
        showFeedback({ 
          type: 'incorrect', 
          message: currentChallenge.hints.afterAttempt 
        });
      } else if (currentChallenge.type === 'plot') {
        showFeedback({ 
          type: 'incorrect', 
          message: `Intentalo de nuevo. El punto (${currentChallenge.x},${currentChallenge.y}) está ${currentChallenge.x} a la derecha y ${currentChallenge.y} hacia arriba.` 
        });
      } else {
        showFeedback({ 
          type: 'incorrect', 
          message: `Esas no son las coordenadas correctas. Las coordenadas se escriben como (x,y), donde x es la distancia hacia la derecha y y es la distancia hacia arriba.` 
        });
      }
    }
  }, [currentChallenge, userPoint, onAttempt, showFeedback]);
  
  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        // Force the canvas to be square for consistent coordinate grid
        const size = Math.min(container.clientWidth, container.clientHeight);
        
        // Set canvas CSS size
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        
        // Set canvas internal size (with device pixel ratio for crisp rendering)
        const scale = window.devicePixelRatio || 1;
        canvas.width = size * scale;
        canvas.height = size * scale;
        
        // Scale the context to account for the device pixel ratio
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
        }
        
        // Redraw the grid
        drawGrid();
      }
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Re-size on window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Re-size when the component becomes visible (helps with container size issues)
    const resizeTimer = setTimeout(resizeCanvas, 300);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(resizeTimer);
    };
  }, [drawGrid]);
  
  // Redraw when needed
  useEffect(() => {
    drawGrid();
  }, [drawGrid, currentChallenge, userPoint, showTarget]);
  
  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  // Custom keypad for coordinate input
  const CoordinateInputKeypad: React.FC = () => {
    if (!currentChallenge) return null;
    
    // For plot challenges, just use drag and click on the grid
    if (currentChallenge.type === 'plot') {
      return (
        <div className="w-full flex flex-col space-y-1 p-0.5">
          <div className="bg-white rounded-md p-1 sm:p-2 flex flex-col space-y-1 sm:space-y-2">
            <h3 className="text-center font-semibold text-slate-700 text-xs sm:text-sm">Ubicar Punto</h3>
            
            <div className="flex items-center justify-center space-x-1">
              <div className="flex items-center bg-slate-50 rounded-md p-0.5 sm:p-1 border border-slate-200">
                <span className="text-slate-700 font-medium text-xs sm:text-sm mx-0.5">X:</span>
                <div className="w-6 sm:w-8 h-6 sm:h-8 border border-slate-300 rounded flex items-center justify-center font-bold text-sm sm:text-base">
                  {userPoint?.x || '?'}
                </div>
              </div>
              <div className="flex items-center bg-slate-50 rounded-md p-0.5 sm:p-1 border border-slate-200">
                <span className="text-slate-700 font-medium text-xs sm:text-sm mx-0.5">Y:</span>
                <div className="w-6 sm:w-8 h-6 sm:h-8 border border-slate-300 rounded flex items-center justify-center font-bold text-sm sm:text-base">
                  {userPoint?.y || '?'}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-blue-600 text-center font-medium bg-blue-50 p-0.5 rounded">
              Haz clic o arrastra para ubicar
            </p>
            
            <div className="flex space-x-1">
              <button
                onClick={toggleHint}
                className={`flex-1 p-0.5 rounded-md flex items-center justify-center font-medium text-xs
                  ${showHint 
                    ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'} transition-colors`}
              >
                {showHint ? '🔍 Ocultar' : '💡 Pista'}
              </button>
              <button
                onClick={verifyAnswer}
                disabled={!userPoint}
                className={`flex-1 p-0.5 rounded-md flex items-center justify-center font-medium text-xs text-white transition-colors
                  ${!userPoint ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                <Icons.CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> Verificar
              </button>
            </div>
            
            {showHint && (
              <div className="bg-amber-50 p-1 rounded-md text-amber-800 text-xs border border-amber-200">
                <p className="font-medium">
                  Para (x,y): x unidades derecha, y unidades arriba.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // For identify challenges, use numeric keypad
    return (
      <div className="w-full flex flex-col space-y-1 p-0.5">
        <div className="bg-white rounded-md p-1 sm:p-2 flex flex-col space-y-1 sm:space-y-2">
          <h3 className="text-center font-semibold text-slate-700 text-xs sm:text-sm">Coordenadas del Tesoro</h3>
          
          <div className="flex items-center justify-center space-x-1">
            <div 
              className={`flex items-center bg-slate-50 rounded-md p-0.5 sm:p-1 border transition-colors
                ${activeCoord === 'x' ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}
              onClick={() => setActiveCoord('x')}
            >
              <span className="text-slate-700 font-medium text-xs sm:text-sm mx-0.5">X:</span>
              <div className={`w-6 sm:w-8 h-6 sm:h-8 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-sm sm:text-base transition-all
                ${activeCoord === 'x' && inputCoords.x ? 'scale-105 text-blue-600' : ''}`}>
                {inputCoords.x || '?'}
              </div>
            </div>
            <div 
              className={`flex items-center bg-slate-50 rounded-md p-0.5 sm:p-1 border transition-colors
                ${activeCoord === 'y' ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}
              onClick={() => setActiveCoord('y')}
            >
              <span className="text-slate-700 font-medium text-xs sm:text-sm mx-0.5">Y:</span>
              <div className={`w-6 sm:w-8 h-6 sm:h-8 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-sm sm:text-base transition-all
                ${activeCoord === 'y' && inputCoords.y ? 'scale-105 text-blue-600' : ''}`}>
                {inputCoords.y || '?'}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={toggleHint}
              className={`flex-1 py-0.5 px-1 rounded-md flex items-center justify-center font-medium text-xs
                ${showHint 
                  ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'} transition-colors`}
            >
              {showHint ? '🔍 Ocultar' : '💡 Pista'}
            </button>
          </div>
          
          {showHint && (
            <div className="bg-amber-50 p-1 rounded-md text-amber-800 text-xs border border-amber-200">
              <p className="font-medium">
                Coordenadas (x,y): x unidades derecha, y unidades arriba.
              </p>
            </div>
          )}
          
          {/* Numeric keypad for entering coordinates */}
          <NumericKeypad 
            onKeyPress={handleKeypadPress} 
            className="bg-slate-50 rounded-md"
          />
        </div>
      </div>
    );
  };
  
  // Set up custom keypad
  useEffect(() => {
    if (setCustomKeypadContent) {
      if (currentChallenge) {
        setCustomKeypadContent(<CoordinateInputKeypad />);
      } else {
        setCustomKeypadContent(null);
      }
      return () => {
        if (setCustomKeypadContent) {
          setCustomKeypadContent(null);
        }
      };
    }
  }, [setCustomKeypadContent, currentChallenge, inputCoords, showHint, userPoint]);
  
  // Main content renderer
  const MainContent: React.FC = () => {
    if (!currentChallenge) {
      return <div className="p-4 text-xl text-slate-600">Cargando desafío...</div>;
    }
    
    return (
      <div className="flex flex-col items-center justify-start text-center w-full max-w-xl p-1 sm:p-2 space-y-1 sm:space-y-2">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-4xl sm:text-5xl">
            {currentEmoji}
          </div>
          <Icons.SpeechBubbleIcon className="bg-blue-500 text-white text-xs sm:text-sm p-1.5 max-w-[180px] sm:max-w-[240px]" direction="left">
            {currentChallenge.prompt}
          </Icons.SpeechBubbleIcon>
        </div>
        
        <div 
          ref={containerRef}
          className="w-full h-64 sm:h-72 md:h-80 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-300 shadow-inner relative p-1 sm:p-2"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={(e) => {
              if (currentChallenge?.type === 'plot') {
                e.preventDefault();
                const touch = e.touches[0];
                handleCanvasMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
              }
            }}
            onTouchMove={(e) => {
              if (isDragging && currentChallenge?.type === 'plot') {
                e.preventDefault();
                const touch = e.touches[0];
                handleCanvasMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as any);
              }
            }}
            onTouchEnd={() => handleCanvasMouseUp()}
            className="cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-semibold text-slate-700 shadow-sm">
            Plano Cartesiano
          </div>
        </div>
        
        {currentChallenge.type === 'identify' && (
          <div className="flex flex-col items-center justify-center w-full gap-3">          <div className="w-full max-w-md text-xs text-amber-800 text-center font-medium bg-amber-50 p-1.5 sm:p-2 rounded-lg border border-amber-300 shadow-sm">
              <p className="font-bold mb-0.5">¿Dónde está el tesoro? 🗺️</p>
              <p>Observa la ubicación del tesoro (💰) e ingresa sus coordenadas (x,y).</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="bg-amber-100 p-1 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-amber-700 font-medium text-xs sm:text-sm">Coordenadas:</span>
                <div className="ml-1 p-0.5 px-1 bg-white rounded-md border border-amber-300 flex items-center">
                  <span className="text-slate-600 font-bold">(</span>
                  <div className={`w-6 sm:w-7 text-center font-bold text-sm sm:text-base transition-all ${activeCoord === 'x' ? 'text-blue-600 scale-105' : 'text-slate-700'}`}>
                    {inputCoords.x || '?'}
                  </div>
                  <span className="text-slate-600 font-bold">,</span>
                  <div className={`w-6 sm:w-7 text-center font-bold text-sm sm:text-base transition-all ${activeCoord === 'y' ? 'text-blue-600 scale-105' : 'text-slate-700'}`}>
                    {inputCoords.y || '?'}
                  </div>
                  <span className="text-slate-600 font-bold">)</span>
                </div>
              </div>
              
              <button
                onClick={verifyAnswer}
                disabled={!userPoint}
                className={`py-1 px-2 rounded-md flex items-center justify-center font-medium text-white transition-colors text-xs sm:text-sm
                  ${!userPoint ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                <Icons.CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> Verificar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return <MainContent />;
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
