
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Exercise as ExerciseType, ExerciseScaffoldApi, NetsOf3DShapesChallenge, NetConstructionPieceType } from '../../types';
import { shuffleArray } from '../../utils';
import { Canvas, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import { InteractivePrism } from '../../components/Interactive3DShape';

// This is a workaround for an environment where the default type augmentation from @react-three/fiber is not working.
// It explicitly adds the required R3F components to JSX's IntrinsicElements interface.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: ThreeElements['mesh'];
      group: ThreeElements['group'];
      cylinderGeometry: ThreeElements['cylinderGeometry'];
      meshStandardMaterial: ThreeElements['meshStandardMaterial'];
      sphereGeometry: ThreeElements['sphereGeometry'];
      ambientLight: ThreeElements['ambientLight'];
      pointLight: ThreeElements['pointLight'];
    }
  }
}


interface NetsOf3DShapesG5ExerciseProps {
  exercise: ExerciseType;
  scaffoldApi: ExerciseScaffoldApi;
}

// --- Helper Components ---
const DraggablePiece: React.FC<{ type: NetConstructionPieceType }> = ({ type }) => {
  let pieceStyle = "bg-sky-300 border-2 border-sky-500"; // Default for square
  let symbol = "■";

  if (type === 'rectangle_a') {
    pieceStyle = "bg-teal-300 border-2 border-teal-500";
    symbol = "▬";
  } else if (type === 'rectangle_b') {
    pieceStyle = "bg-indigo-300 border-2 border-indigo-500";
    symbol = "▮";
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('pieceType', type);
        e.currentTarget.style.opacity = '0.5';
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
      className={`w-12 h-12 ${pieceStyle} rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg`}
    >
      <span className="text-2xl text-white font-sans">{symbol}</span>
    </div>
  );
};

const PieceDisplay: React.FC<{ type: NetConstructionPieceType | null }> = ({ type }) => {
  if (!type) return null;
  let style = "w-full h-full flex items-center justify-center";
  let symbol = "";
  if (type === 'square') { style += " bg-sky-400"; symbol = "■"; }
  else if (type === 'rectangle_a') { style += " bg-teal-400"; symbol = "▬"; }
  else if (type === 'rectangle_b') { style += " bg-indigo-400"; symbol = "▮"; }
  
  return <div className={style}><span className="text-2xl text-white font-sans">{symbol}</span></div>;
};


const GridCell: React.FC<{
  pieceType: NetConstructionPieceType | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}> = ({ pieceType, onDrop, onDragOver }) => (
  <div
    onDrop={onDrop}
    onDragOver={onDragOver}
    className={`w-14 h-14 border border-slate-300 transition-colors ${!pieceType ? 'bg-slate-100 hover:bg-slate-200' : ''}`}
  >
    <PieceDisplay type={pieceType} />
  </div>
);

const FoldingCube: React.FC<{ layout: [number, number][], foldProgress: number, isVerified: boolean }> = ({ layout, foldProgress, isVerified }) => {
    // Safety check for empty layout
    if (!layout || layout.length === 0) {
        return (
            <Box args={[1, 1, 1]} position={[0, 0, 0]}>
                <meshStandardMaterial color={'#60a5fa'} />
            </Box>
        );
    }

    const connections = useMemo(() => {
        try {
            const adj: number[][] = Array.from({ length: layout.length }, () => []);
            for (let i = 0; i < layout.length; i++) {
                for (let j = i + 1; j < layout.length; j++) {
                    if (!layout[i] || !layout[j]) continue; // Skip if coordinates don't exist
                    
                    const [r1, c1] = layout[i];
                    const [r2, c2] = layout[j];
                    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
                    if (dist === 1) {
                        adj[i].push(j);
                        adj[j].push(i);
                    }
                }
            }
            return adj;
        } catch (error) {
            console.error("Error computing connections:", error);
            return [[]];
        }
    }, [layout]);

    const tree = useMemo(() => {
        try {
            if (layout.length === 0) return [];
            const baseIndex = 0;
            const treeNodes: { parent: number | null, children: number[] }[] = 
                Array.from({ length: layout.length }, () => ({ parent: null, children: [] }));
            
            const q: number[] = [baseIndex];
            const visited = new Set<number>([baseIndex]);
            let head = 0;
            
            while (head < q.length) {
                const u = q[head++];
                if (!connections[u]) continue; // Skip if no connections
                
                for (const v of connections[u]) {
                    if (!visited.has(v)) {
                        visited.add(v);
                        treeNodes[u].children.push(v);
                        treeNodes[v].parent = u;
                        q.push(v);
                    }
                }
            }
            return treeNodes;
        } catch (error) {
            console.error("Error computing tree:", error);
            return [];
        }
    }, [layout, connections]);

    const FoldingBranch: React.FC<{ pieceIndex: number, parentIndex: number | null }> = ({ pieceIndex, parentIndex }) => {
        try {
            let position = new THREE.Vector3(0, 0, 0);
            let rotation = new THREE.Euler(0, 0, 0);
            const angle = -Math.PI / 2 * foldProgress;

            if (parentIndex !== null && layout[parentIndex] && layout[pieceIndex]) {
                const parentCoords = layout[parentIndex];
                const pieceCoords = layout[pieceIndex];
                const [pr, pc] = parentCoords;
                const [r, c] = pieceCoords;

                if (r === pr + 1) { // Child is below parent
                    position.set(0, -1, 0); 
                    rotation.set(angle, 0, 0);
                } else if (r === pr - 1) { // Child is above parent
                    position.set(0, 1, 0); 
                    rotation.set(-angle, 0, 0);
                } else if (c === pc + 1) { // Child is right of parent
                    position.set(1, 0, 0); 
                    rotation.set(0, -angle, 0);
                } else if (c === pc - 1) { // Child is left of parent
                    position.set(-1, 0, 0);
                    rotation.set(0, angle, 0);
                }
            }

            return (
                <group position={position} rotation={rotation}>
                    <Box args={[1, 1, 0.05]}>
                        <meshStandardMaterial 
                            color={isVerified ? '#34d399' : '#60a5fa'} 
                            opacity={0.9} 
                            transparent 
                        />
                    </Box>
                    {tree[pieceIndex]?.children?.map(childIndex => (
                        <FoldingBranch 
                            key={childIndex} 
                            pieceIndex={childIndex} 
                            parentIndex={pieceIndex} 
                        />
                    ))}
                </group>
            );
        } catch (error) {
            console.error("Error rendering branch:", error);
            return null;
        }
    };
    
    if (layout.length === 0 || tree.length === 0) {
        // Fallback rendering if we can't build the tree
        return (
            <Box args={[1, 1, 1]} position={[0, 0, 0]}>
                <meshStandardMaterial color={isVerified ? '#34d399' : '#60a5fa'} />
            </Box>
        );
    }
    
    // Try to render the folding animation, with fallback to a simple cube
    try {
        return <FoldingBranch pieceIndex={0} parentIndex={null} />;
    } catch (error) {
        console.error("Error rendering folding cube:", error);
        return (
            <Box args={[1, 1, 1]} position={[0, 0, 0]}>
                <meshStandardMaterial color={isVerified ? '#34d399' : '#60a5fa'} />
            </Box>
        );
    }
};


export const NetsOf3DShapesG5Exercise: React.FC<NetsOf3DShapesG5ExerciseProps> = ({
  exercise, scaffoldApi,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<NetsOf3DShapesChallenge | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<NetsOf3DShapesChallenge[]>([]);
  
  // States for 'construct' mode
  const [grid, setGrid] = useState<(NetConstructionPieceType | null)[][]>([]);
  const [palette, setPalette] = useState<{type: NetConstructionPieceType, count: number}[]>([]);
  const [isConstructVerified, setIsConstructVerified] = useState(false);
  const [foldProgress, setFoldProgress] = useState(0);
  const [isFolding, setIsFolding] = useState(false);
  
  // States for 'match' mode
  const [selectedNetId, setSelectedNetId] = useState<string | null>(null);
  const [isMatchVerified, setIsMatchVerified] = useState(false);

  const { challenges = [] } = exercise.data || {};
  const { showFeedback, onAttempt, advanceToNextChallengeSignal } = scaffoldApi;
  const prevAdvanceSignalRef = useRef(advanceToNextChallengeSignal);

  useEffect(() => {
    if (challenges.length > 0) setAvailableChallenges(shuffleArray([...challenges]));
  }, [challenges, exercise.id]);

  const loadNewChallenge = useCallback(() => {
    let pool = availableChallenges;
    if (pool.length === 0 && (challenges as NetsOf3DShapesChallenge[]).length > 0) {
      pool = shuffleArray([...challenges as NetsOf3DShapesChallenge[]]);
      setAvailableChallenges(pool);
    }
    if (pool.length > 0) {
      const nextChallenge = pool[0];
      setCurrentChallenge(nextChallenge);
      setAvailableChallenges(prev => prev.slice(1));

      if (nextChallenge.type === 'construct') {
        setGrid(Array(nextChallenge.gridSize.rows).fill(null).map(() => Array(nextChallenge.gridSize.cols).fill(null)));
        setPalette(JSON.parse(JSON.stringify(nextChallenge.pieces)));
        setIsConstructVerified(false);
        setFoldProgress(0);
        setIsFolding(false);
      } else {
        setSelectedNetId(null);
        setIsMatchVerified(false);
      }
    } else {
      onAttempt(true);
    }
    showFeedback(null);
  }, [availableChallenges, challenges, showFeedback, onAttempt]);

  useEffect(() => { if (challenges.length > 0 && !currentChallenge) loadNewChallenge(); }, [challenges, currentChallenge, loadNewChallenge]);
  
  useEffect(() => {
    if (advanceToNextChallengeSignal > (prevAdvanceSignalRef.current ?? -1)) loadNewChallenge();
    prevAdvanceSignalRef.current = advanceToNextChallengeSignal;
  }, [advanceToNextChallengeSignal, loadNewChallenge]);

  const handleDrop = (row: number, col: number, e: React.DragEvent) => {
    e.preventDefault();
    if(grid[row][col] || isConstructVerified) return;

    const pieceType = e.dataTransfer.getData('pieceType') as NetConstructionPieceType;
    const pieceIndex = palette.findIndex(p => p.type === pieceType);
    if (pieceIndex !== -1 && palette[pieceIndex].count > 0) {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = pieceType;
        setGrid(newGrid);

        setPalette(prevPalette => prevPalette.map((p, index) => 
            index === pieceIndex ? { ...p, count: p.count - 1 } : p
        ));
    }
  };

  const handleGridClear = () => {
    if (currentChallenge?.type === 'construct') {
      setGrid(Array(currentChallenge.gridSize.rows).fill(null).map(() => Array(currentChallenge.gridSize.cols).fill(null)));
      setPalette(JSON.parse(JSON.stringify(currentChallenge.pieces)));
      setIsConstructVerified(false);
      showFeedback(null);
      setFoldProgress(0);
      setIsFolding(false);
    }
  };
  
  const verifyConstruction = () => {
     if (currentChallenge?.type !== 'construct' || isConstructVerified) return;
     
     try {
         // Check if all required pieces are placed
         const requiredPiecesCount = currentChallenge.pieces.reduce((sum, piece) => sum + piece.count, 0);
         const placedPieces = grid.flat().filter((p): p is NetConstructionPieceType => p !== null);

         if (placedPieces.length !== requiredPiecesCount) {
             showFeedback({type: 'incorrect', message: currentChallenge.feedback.invalidCount});
             onAttempt(false);
             return;
         }

         // Check if the correct number of each piece type is used
         const placedCounts: { [key: string]: number } = {};
         placedPieces.forEach(p => { placedCounts[p] = (placedCounts[p] || 0) + 1; });
         
         const requiredCounts: { [key: string]: number } = {};
         currentChallenge.pieces.forEach(p => { requiredCounts[p.type] = p.count; });
         
         let countsMatch = true;
         for(const type in requiredCounts) {
             if (requiredCounts[type] !== (placedCounts[type] || 0)) { countsMatch = false; break; }
         }
         for(const type in placedCounts) {
             if (placedCounts[type] !== (requiredCounts[type] || 0)) { countsMatch = false; break; }
         }

         if (!countsMatch) {
            showFeedback({type: 'incorrect', message: currentChallenge.feedback.invalidCount});
            onAttempt(false);
            return;
         }

         // Find all positions with pieces
         const positions: [number, number][] = [];
         grid.forEach((row, r) => row.forEach((cell, c) => { 
             if(cell !== null) positions.push([r, c]); 
         }));
         
         // Safety check - if no positions, we can't continue
         if (positions.length === 0) {
             showFeedback({type: 'incorrect', message: currentChallenge.feedback.invalidCount});
             onAttempt(false);
             return;
         }

         // Check connectivity using BFS
         const q = [positions[0]];
         const visited = new Set<string>([`${positions[0][0]},${positions[0][1]}`]);
         let head = 0;
         
         while(head < q.length) {
             const [r, c] = q[head++];
             const neighbors = [[r-1, c], [r+1, c], [r, c-1], [r, c+1]];
             
             for (const [nr, nc] of neighbors) {
                 // Check if neighbor coordinates are valid and contain a piece
                 if (nr >= 0 && nr < grid.length && 
                     nc >= 0 && nc < grid[0].length && 
                     grid[nr][nc] !== null) {
                     
                     const key = `${nr},${nc}`;
                     if (!visited.has(key)) {
                         visited.add(key);
                         q.push([nr, nc]);
                     }
                 }
             }
         }
         
         // Check if all pieces are connected
         if (visited.size !== requiredPiecesCount) {
             showFeedback({type: 'incorrect', message: "Las caras deben estar conectadas."});
             onAttempt(false);
             return;
         }

         // Check for invalid 2x2 squares
         for (let r = 0; r < grid.length - 1; r++) {
             for (let c = 0; c < grid[0].length - 1; c++) {
                 if (grid[r][c] !== null && grid[r+1][c] !== null && 
                     grid[r][c+1] !== null && grid[r+1][c+1] !== null) {
                     showFeedback({type: 'incorrect', message: currentChallenge.feedback.invalidShape});
                     onAttempt(false);
                     return;
                 }
             }
         }
         
         // Success - this is a valid net
         showFeedback({type: 'correct', message: currentChallenge.feedback.correct});
         setIsConstructVerified(true);
         
     } catch (error) {
         // In case of any error, provide a user-friendly message
         console.error("Error in verification:", error);
         showFeedback({type: 'incorrect', message: "Ocurrió un error. Por favor, intenta de nuevo."});
     }
  };

  const handleFold = () => {
      try {
          if(!isFolding && foldProgress < 1 && currentChallenge?.type === 'construct' && currentChallenge.targetShape === 'cube') {
              setIsFolding(true);
              const startTime = Date.now();
              const duration = 2000;
              
              const animate = () => {
                  try {
                      const elapsed = Date.now() - startTime;
                      const progress = Math.min(elapsed / duration, 1);
                      setFoldProgress(progress);
                      
                      if (progress < 1) {
                          requestAnimationFrame(animate);
                      } else {
                          setIsFolding(false);
                          setTimeout(() => {
                              onAttempt(true);
                          }, 1000);
                      }
                  } catch (error) {
                      console.error("Animation error:", error);
                      setIsFolding(false);
                      onAttempt(true); // Still mark as correct even if animation fails
                  }
              };
              
              requestAnimationFrame(animate);
          } else if (currentChallenge?.type === 'construct' && currentChallenge.targetShape !== 'cube') {
              // For non-cubes, just confirm success without animation
              onAttempt(true);
          }
      } catch (error) {
          console.error("Error in fold handling:", error);
          // Still mark as correct even if handling fails
          onAttempt(true);
      }
  };

  const handleSelectNet = (netId: string) => {
    if(isMatchVerified) return;
    setSelectedNetId(netId);
    showFeedback(null);
  };
  
  const verifyMatch = () => {
    if (currentChallenge?.type !== 'match' || !selectedNetId) return;
    const selected = currentChallenge.netOptions.find(opt => opt.id === selectedNetId);
    if (!selected) return;
    setIsMatchVerified(true);
    onAttempt(selected.isCorrect);
    if (selected.isCorrect) {
      showFeedback({ type: 'correct', message: '¡Red correcta!' });
    } else {
      showFeedback({ type: 'incorrect', message: 'Esa red no forma la figura. ¡Intenta de nuevo!' });
      setTimeout(() => {
        setIsMatchVerified(false);
        setSelectedNetId(null);
      }, 1500);
    }
  };

  if (!currentChallenge) {
    return <div className="p-4 text-xl text-slate-600">Cargando constructor de figuras...</div>;
  }
  
  return (
    <div className="flex flex-col items-center p-2 w-full">
        {currentChallenge.type === 'construct' && (
            <div className="flex flex-col items-center w-full">
                <p className="text-md font-semibold text-slate-700 mb-2">Construye la red de un <strong className="text-sky-600">{currentChallenge.targetShape === 'cube' ? 'cubo' : 'prisma rectangular'}</strong>.</p>
                <div className="flex flex-col md:flex-row w-full justify-center items-center gap-8">
                    <div className="flex flex-col items-center space-y-2 p-4 bg-slate-200 rounded-lg">
                        <p className="text-sm font-bold">Piezas</p>
                        {palette.map(p => Array.from({length: p.count}).map((_, i) => <DraggablePiece key={`${p.type}-${i}`} type={p.type} />))}
                    </div>
                    <div className="grid gap-px mt-4 md:mt-0" style={{gridTemplateColumns: `repeat(${currentChallenge.gridSize.cols}, minmax(0, 1fr))`}}>
                        {grid.map((row, r) => row.map((cell, c) => <GridCell key={`${r}-${c}`} pieceType={cell} onDrop={(e) => handleDrop(r,c,e)} onDragOver={(e) => e.preventDefault()} />))}
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={handleGridClear} className="px-4 py-2 text-sm bg-slate-400 text-white rounded-md shadow hover:bg-slate-500">Limpiar</button>
                    <button onClick={verifyConstruction} disabled={isConstructVerified} className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 disabled:bg-slate-300">Verificar Red</button>
                    {isConstructVerified && <button onClick={handleFold} disabled={isFolding} className="px-4 py-2 text-sm bg-green-500 text-white rounded-md shadow hover:bg-green-600 animate-pulse">¡{currentChallenge.targetShape === 'cube' ? 'Plegar' : 'Confirmar'}!</button>}
                </div>
                 {isConstructVerified && currentChallenge.targetShape === 'cube' && (
                     <div className="w-72 h-72 mt-6 mx-auto">
                        <Canvas camera={{ position: [2.5, 2.5, 4], fov: 75 }}>
                            <ambientLight intensity={1.2} />
                            <pointLight position={[10, 10, 10]} intensity={0.8} />
                            <FoldingCube 
                                layout={grid.map((row, r) => row.map((cell, c) => (cell ? [r,c] : null))).flat().filter(x => x) as [number, number][]}
                                foldProgress={foldProgress}
                                isVerified={isConstructVerified}
                            />
                            <OrbitControls />
                        </Canvas>
                     </div>
                 )}
                 {isConstructVerified && currentChallenge.targetShape === 'rectangular_prism' && (
                     <div className="w-72 h-72 mt-6 mx-auto text-center">
                        <p className="text-sm text-green-700 mb-2">¡Bien hecho! Aquí está el prisma que construiste:</p>
                        <div className="flex justify-center">
                            <InteractivePrism className="max-w-full max-h-full" />
                        </div>
                     </div>
                 )}
            </div>
        )}
        {currentChallenge.type === 'match' && (
            <div className="flex flex-col items-center w-full">
                <p className="text-md font-semibold text-slate-700 mb-4">¿Qué red forma un <strong className="text-sky-600">{currentChallenge.targetShapeId === 'cubo' ? 'cubo' : currentChallenge.targetShapeId === 'prismaRectangular' ? 'prisma' : currentChallenge.targetShapeId}</strong>?</p>
                <div className="w-48 h-48 mx-auto">
                    <currentChallenge.TargetShapeComponent className="max-w-full max-h-full" />
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-6 mx-auto">
                    {currentChallenge.netOptions.map(opt => (
                        <button key={opt.id} onClick={() => handleSelectNet(opt.id)} className={`p-3 rounded-lg border-4 transition-colors ${selectedNetId === opt.id ? 'border-sky-500 bg-sky-100' : 'border-transparent bg-white hover:bg-slate-100'}`}>
                            <opt.NetVisualComponent className="w-28 h-28" />
                        </button>
                    ))}
                </div>
                <button onClick={verifyMatch} disabled={!selectedNetId || isMatchVerified} className="mt-6 px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600 disabled:bg-slate-300">Verificar</button>
            </div>
        )}
    </div>
  );
};
