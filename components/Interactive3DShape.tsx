
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

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

// --- Constants ---
const highlightFaceColor = new THREE.Color('#ef4444'); // red-500
const defaultFaceColor = new THREE.Color('#93c5fd');   // sky-300
const highlightEdgeColor = new THREE.Color('#facc15'); // yellow-400
const defaultEdgeColor = new THREE.Color('#374151');   // gray-700
const highlightVertexColor = new THREE.Color('#22c55e'); // green-500
const defaultVertexColor = new THREE.Color('#374151'); // gray-700
const vertexRadius = 0.08;
const defaultEdgeThickness = 0.015;
const highlightedEdgeThickness = 0.03;

// --- Props interface for all interactive shapes ---
// Making props optional to handle display-only use case where no props are passed.
interface ShapeWrapperProps {
    onFaceClick?: (id: number) => void;
    onEdgeClick?: (id: number) => void;
    onVertexClick?: (id: number) => void;
    highlightedFaces?: Set<number>;
    highlightedEdges?: Set<number>;
    highlightedVertices?: Set<number>;
    className?: string;
}

// --- Reusable 3D Edge component ---
const Edge: React.FC<{ start: THREE.Vector3, end: THREE.Vector3, color: THREE.Color, thickness: number, onClick: (e: any) => void }> = ({ start, end, color, thickness, onClick }) => {
    const length = start.distanceTo(end);
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const edgeVector = new THREE.Vector3().subVectors(end, start).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(yAxis, edgeVector);

    return (
        <mesh position={midPoint} quaternion={quaternion} onClick={onClick}>
            <cylinderGeometry args={[thickness, thickness, length, 8]} />
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.6}/>
        </mesh>
    );
};

// --- Core Shape component that handles rendering and interaction logic ---
function Shape({
    geometry,
    materials,
    edgeVertexPairs,
    uniqueVertexPositions,
    onFaceClick,
    onEdgeClick,
    onVertexClick,
    highlightedFaces,
    highlightedEdges,
    highlightedVertices
}: {
    geometry: THREE.BufferGeometry;
    materials: THREE.Material[];
    edgeVertexPairs: [number, number][];
    uniqueVertexPositions: THREE.Vector3[];
    onFaceClick: (id: number) => void;
    onEdgeClick: (id: number) => void;
    onVertexClick: (id: number) => void;
    highlightedFaces: Set<number>;
    highlightedEdges: Set<number>;
    highlightedVertices: Set<number>;
}) {
    // Update material colors based on highlightedFaces set
    useEffect(() => {
        materials.forEach((material, index) => {
            if (material instanceof THREE.MeshStandardMaterial) {
                const isHighlighted = highlightedFaces.has(index);
                material.color.set(isHighlighted ? highlightFaceColor : defaultFaceColor);
                material.opacity = isHighlighted ? 0.9 : 0.7;
                material.needsUpdate = true;
            }
        });
    }, [highlightedFaces, materials]);

    return (
        <group>
            <mesh
                geometry={geometry}
                material={materials}
                onClick={(e) => {
                    e.stopPropagation();
                    if (e.face && typeof e.face.materialIndex !== 'undefined') {
                        onFaceClick(e.face.materialIndex);
                    }
                }}
            />

            <group>
                {edgeVertexPairs.map((edge, i) => {
                    const [v1_idx, v2_idx] = edge;
                    if (v1_idx >= uniqueVertexPositions.length || v2_idx >= uniqueVertexPositions.length) return null;
                    const start = uniqueVertexPositions[v1_idx];
                    const end = uniqueVertexPositions[v2_idx];
                    if (!start || !end) return null;
                    const isHighlighted = highlightedEdges.has(i);
                    return (
                        <Edge
                            key={`edge-${i}`}
                            start={start}
                            end={end}
                            color={isHighlighted ? highlightEdgeColor : defaultEdgeColor}
                            thickness={isHighlighted ? highlightedEdgeThickness : defaultEdgeThickness}
                            onClick={(e) => { e.stopPropagation(); onEdgeClick(i); }}
                        />
                    );
                })}
            </group>
            
            <group>
                {uniqueVertexPositions.map((pos, i) => (
                    <mesh key={`vertex-${i}`} position={pos} onClick={(e) => { e.stopPropagation(); onVertexClick(i); }}>
                        <sphereGeometry args={[vertexRadius, 16, 16]} />
                        <meshStandardMaterial color={highlightedVertices.has(i) ? highlightVertexColor : defaultVertexColor} metalness={0.2} roughness={0.8} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// --- Base Canvas setup ---
const BaseCanvas: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={className}>
        <Canvas camera={{ position: [2.5, 2.5, 4], fov: 50 }} dpr={[1, 2]} shadows>
            <ambientLight intensity={1.8} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <Suspense fallback={null}>{children}</Suspense>
            <OrbitControls enablePan={true} enableZoom={true} />
        </Canvas>
    </div>
);

// --- Default props to prevent crashes when components are used for display only ---
const defaultProps: Required<Omit<ShapeWrapperProps, 'className'>> = {
    onFaceClick: () => {},
    onEdgeClick: () => {},
    onVertexClick: () => {},
    highlightedFaces: new Set(),
    highlightedEdges: new Set(),
    highlightedVertices: new Set(),
};

// --- Exported Shape Components with Default Props ---
export const InteractiveCube: React.FC<ShapeWrapperProps> = (props) => {
    const finalProps = { ...defaultProps, ...props };
    const { geometry, materials, edgeVertexPairs, uniqueVertexPositions } = useMemo(() => {
        const geom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const mats = Array.from({ length: 6 }).map(() => new THREE.MeshStandardMaterial({
            color: defaultFaceColor, transparent: true, opacity: 0.7, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5
        }));
        const w = 1.5/2, h = 1.5/2, d = 1.5/2;
        const positions = [[-w,-h,d],[w,-h,d],[w,-h,-d],[-w,-h,-d],[-w,h,d],[w,h,d],[w,h,-d],[-w,h,-d]].map(p => new THREE.Vector3(...p as [number,number,number]));
        const edges: [number, number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        return { geometry: geom, materials: mats, uniqueVertexPositions: positions, edgeVertexPairs: edges };
    }, []);
    return <BaseCanvas className={props.className}><Shape {...finalProps} geometry={geometry} materials={materials} edgeVertexPairs={edgeVertexPairs} uniqueVertexPositions={uniqueVertexPositions} /></BaseCanvas>;
};

export const InteractivePrism: React.FC<ShapeWrapperProps> = (props) => {
    const finalProps = { ...defaultProps, ...props };
    const { geometry, materials, edgeVertexPairs, uniqueVertexPositions } = useMemo(() => {
        const width = 2, height = 1.5, depth = 1;
        const geom = new THREE.BoxGeometry(width, height, depth);
        const mats = Array.from({ length: 6 }).map(() => new THREE.MeshStandardMaterial({
             color: defaultFaceColor, transparent: true, opacity: 0.7, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5
        }));
        const w = width/2, h = height/2, d = depth/2;
        const positions = [[-w,-h,d],[w,-h,d],[w,-h,-d],[-w,-h,-d],[-w,h,d],[w,h,d],[w,h,-d],[-w,h,-d]].map(p => new THREE.Vector3(...p as [number,number,number]));
        const edges: [number, number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        return { geometry: geom, materials: mats, uniqueVertexPositions: positions, edgeVertexPairs: edges };
    }, []);
    return <BaseCanvas className={props.className}><Shape {...finalProps} geometry={geometry} materials={materials} edgeVertexPairs={edgeVertexPairs} uniqueVertexPositions={uniqueVertexPositions} /></BaseCanvas>;
};

export const InteractivePyramid: React.FC<ShapeWrapperProps> = (props) => {
    const finalProps = { ...defaultProps, ...props };
    const { geometry, materials, edgeVertexPairs, uniqueVertexPositions } = useMemo(() => {
        const radius = 1.2, height = 1.8;
        const geom = new THREE.ConeGeometry(radius, height, 4); // Square base
        geom.groups = [
            { start: 0, count: 3, materialIndex: 0 },  // Side face 1
            { start: 3, count: 3, materialIndex: 1 },  // Side face 2
            { start: 6, count: 3, materialIndex: 2 },  // Side face 3
            { start: 9, count: 3, materialIndex: 3 },  // Side face 4
            { start: 12, count: 6, materialIndex: 4 }, // Base (composed of 2 triangles)
        ];
        const mats = Array.from({ length: 5 }).map(() => new THREE.MeshStandardMaterial({
             color: defaultFaceColor, transparent: true, opacity: 0.7, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5
        }));
        const apex = new THREE.Vector3(0, height / 2, 0);
        const base = [
            new THREE.Vector3(radius, -height / 2, 0),
            new THREE.Vector3(0, -height / 2, -radius),
            new THREE.Vector3(-radius, -height / 2, 0),
            new THREE.Vector3(0, -height / 2, radius),
        ];
        const positions = [apex, ...base];
        const edges: [number, number][] = [[1,2],[2,3],[3,4],[4,1],[0,1],[0,2],[0,3],[0,4]];
        return { geometry: geom, materials: mats, uniqueVertexPositions: positions, edgeVertexPairs: edges };
    }, []);
    return <BaseCanvas className={props.className}><Shape {...finalProps} geometry={geometry} materials={materials} edgeVertexPairs={edgeVertexPairs} uniqueVertexPositions={uniqueVertexPositions} /></BaseCanvas>;
};
