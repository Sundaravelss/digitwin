"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import { Mesh, Group, Vector3, CatmullRomCurve3 } from "three";
import { useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/avatar.glb";

interface Avatar3DProps {
  generatedAvatarUrl?: string | null;
  isGenerating?: boolean;
}

/** Loads the GLB human model and auto-rotates it */
const HumanModel = () => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.85, 0]} scale={1.8}>
      <primitive object={cloned} />
    </group>
  );
};

/** Spiral helix tube that wraps around the model */
const SpiralHelix = ({
  direction = 1,
  color = "#00d4ff",
}: {
  direction?: number;
  color?: string;
}) => {
  const meshRef = useRef<Mesh>(null);

  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const turns = 3;
    const height = 2.4;
    const radius = 0.7;
    const segments = 150;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * turns * Math.PI * 2 * direction;
      const y = (i / segments) * height - height / 2;
      points.push(new Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius));
    }
    return new CatmullRomCurve3(points);
  }, [direction]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[curve, 150, 0.012, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
};

/** Floating particles distributed along spiral paths */
const Particles = () => {
  const count = 40;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6;
      const r = 0.55 + Math.random() * 0.4;
      const y = (i / count) * 2.4 - 1.2;
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);

  const pointsRef = useRef<any>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00d4ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

/** Tilted orbital ring */
const OrbitRing = ({
  radius,
  speed,
  tiltX = 0,
  tiltZ = 0,
}: {
  radius: number;
  speed: number;
  tiltX?: number;
  tiltZ?: number;
}) => {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00aaff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
    <div className="w-14 h-14 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
    <span className="text-xs text-muted-foreground">Loading 3D Model...</span>
  </div>
);

const Avatar3D = ({ isGenerating }: Avatar3DProps) => {
  return (
    <div className="w-full h-full relative">
      {isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm z-10">
          <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground mt-2">
            Generating...
          </span>
        </div>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0.3, 2.8], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, 3, -5]} intensity={0.5} color="#0066ff" />
          <pointLight position={[0, -3, 5]} intensity={0.3} color="#00ffaa" />
          <spotLight
            position={[0, 5, 3]}
            angle={0.4}
            penumbra={1}
            intensity={1.5}
          />

          <HumanModel />

          {/* Single spiral helix */}
          <SpiralHelix direction={1} color="#00d4ff" />

          {/* Single orbital accent ring */}
          <OrbitRing
            radius={0.8}
            speed={0.4}
            tiltX={Math.PI / 4}
          />

          <Particles />
        </Canvas>
      </Suspense>
    </div>
  );
};

useGLTF.preload(MODEL_URL);

export default Avatar3D;
