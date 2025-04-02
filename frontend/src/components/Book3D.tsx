import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Book3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate the book
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Create a simple book mesh
  return (
    <mesh ref={meshRef} scale={[1, 1, 0.1]} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1.4, 0.2]} />
      <meshStandardMaterial color="#48BB78" />
      {/* Book cover */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.05, 1.45, 0.02]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
      {/* Book pages */}
      <mesh position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.2, 1.4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </mesh>
  );
}

export default Book3D; 