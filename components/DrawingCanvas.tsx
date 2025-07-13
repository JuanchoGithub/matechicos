
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  className?: string;
  penColor?: string;
  initialPenWidth?: number;
  initialEraserWidth?: number;
  onDraw?: (isEmpty: boolean) => void; // Callback when drawing happens
}

export type CanvasTool = 'pen' | 'eraser';

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  setTool: (tool: CanvasTool) => void;
  setPenWidth: (width: number) => void;
  setEraserWidth: (width: number) => void;
  getCurrentTool: () => CanvasTool;
}

export const DrawingCanvas = React.forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ 
    className = '', 
    penColor = 'black', 
    initialPenWidth = 2, 
    initialEraserWidth = 20,
    onDraw
  }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState<CanvasTool>('pen');
    const [penWidth, setPenWidth] = useState(initialPenWidth);
    const [eraserWidth, setEraserWidth] = useState(initialEraserWidth);
    const [canvasIsEmpty, setCanvasIsEmpty] = useState(true);

    const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

    const getCanvasAndContext = () => {
        const canvas = canvasRef.current;
        if (!canvas) return { canvas: null, ctx: null };
        if (!contextRef.current) {
            contextRef.current = canvas.getContext('2d');
        }
        return { canvas, ctx: contextRef.current };
    }

    const initializeCanvas = () => {
      const { canvas, ctx } = getCanvasAndContext();
      if (canvas && ctx) {
        const parent = canvas.parentElement;
        if (parent) {
            const computedStyle = getComputedStyle(parent);
            const parentWidth = parent.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
            const parentHeight = parent.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
            
            canvas.style.width = `${parentWidth}px`;
            canvas.style.height = `${parentHeight}px`;
            
            canvas.width = parentWidth * window.devicePixelRatio;
            canvas.height = parentHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        } else { 
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = currentTool === 'pen' ? penWidth : eraserWidth;
      }
    };
    
    useEffect(() => {
        initializeCanvas();
        const handleResize = () => initializeCanvas();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const { ctx } = getCanvasAndContext();
        if (ctx) {
            ctx.strokeStyle = penColor;
            ctx.lineWidth = currentTool === 'pen' ? penWidth : eraserWidth;
        }
    }, [penColor, penWidth, eraserWidth, currentTool]);

    const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const { offsetX, offsetY } = getCoordinates(event);
      const { ctx } = getCanvasAndContext();
      if (!ctx) return;

      setIsDrawing(true);
      lastPositionRef.current = { x: offsetX, y: offsetY };
      
      ctx.beginPath(); 
      ctx.moveTo(offsetX, offsetY);

    }, [currentTool, penWidth, eraserWidth, penColor]);

    const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = getCoordinates(event);
      const { ctx } = getCanvasAndContext();
      if (!ctx || !lastPositionRef.current) return;
      
      if (currentTool === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = eraserWidth;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
      
      lastPositionRef.current = { x: offsetX, y: offsetY };
      if (canvasIsEmpty) setCanvasIsEmpty(false);
      if (onDraw) onDraw(false);

    }, [isDrawing, currentTool, penColor, penWidth, eraserWidth, canvasIsEmpty, onDraw]);

    const stopDrawing = useCallback(() => {
      const { ctx } = getCanvasAndContext();
      if (ctx) {
        ctx.closePath();
      }
      setIsDrawing(false);
      lastPositionRef.current = null;
    }, []);
    
    const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width / window.devicePixelRatio;
        const scaleY = canvas.height / rect.height / window.devicePixelRatio;

        if ('touches' in event) { 
            return {
                offsetX: (event.touches[0].clientX - rect.left) * scaleX,
                offsetY: (event.touches[0].clientY - rect.top) * scaleY
            };
        } else { 
            return {
                offsetX: (event.clientX - rect.left) * scaleX,
                offsetY: (event.clientY - rect.top) * scaleY
            };
        }
    };

    const clearCanvas = useCallback(() => {
      const { canvas, ctx } = getCanvasAndContext();
      if (canvas && ctx) {
        // Use the scaled width/height for clearing
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        setCanvasIsEmpty(true);
        if (onDraw) onDraw(true);
      }
    }, [onDraw]);

    React.useImperativeHandle(ref, () => ({
      clearCanvas,
      setTool: (tool: CanvasTool) => setCurrentTool(tool),
      setPenWidth: (width: number) => setPenWidth(width),
      setEraserWidth: (width: number) => setEraserWidth(width),
      getCurrentTool: () => currentTool,
    }));

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing} 
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`bg-white w-full h-full touch-none ${className}`} // Retain bg-white for drawing surface
        aria-label="Lienzo de dibujo para cálculos"
        role="img" 
      />
    );
  }
);
