import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import { Mesh, Group, BufferAttribute } from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

const Particles = () => {
  const count = 60;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  const pointsRef = useRef<any>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
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
      <pointsMaterial size={0.025} color="#00d4ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

const HumanoidFigure = () => {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating and rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#0066ff"
          emissiveIntensity={0.5}
          wireframe
          distort={0.1}
          speed={2}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
      </mesh>

      {/* Torso */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={bodyRef} position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <MeshDistortMaterial
            color="#00d4ff"
            emissive="#0066ff"
            emissiveIntensity={0.6}
            wireframe
            distort={0.05}
            speed={1.5}
          />
        </mesh>
      </Float>

      {/* Pelvis */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.35, 1.1, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.35, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.12, 0.15, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.12, 0.15, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
          <meshStandardMaterial color="#00d4ff" wireframe emissive="#0066ff" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Orbital rings */}
      <OrbitRing radius={0.8} speed={1} rotationAxis="y" />
      <OrbitRing radius={1} speed={0.7} rotationAxis="x" />
      <OrbitRing radius={0.6} speed={1.3} rotationAxis="z" />

      {/* Particles */}
      <Particles />
    </group>
  );
};

const OrbitRing = ({
  radius,
  speed,
  rotationAxis
}: {
  radius: number;
  speed: number;
  rotationAxis: "x" | "y" | "z";
}) => {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const rotation = state.clock.elapsedTime * speed;
      if (rotationAxis === "x") {
        ringRef.current.rotation.x = rotation;
        ringRef.current.rotation.y = Math.PI / 4;
      } else if (rotationAxis === "y") {
        ringRef.current.rotation.y = rotation;
        ringRef.current.rotation.x = Math.PI / 6;
      } else {
        ringRef.current.rotation.z = rotation;
        ringRef.current.rotation.x = Math.PI / 3;
      }
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0.6, 0]}>
      <torusGeometry args={[radius, 0.01, 16, 100]} />
      <meshStandardMaterial
        color="#00d4ff"
        emissive="#00aaff"
        emissiveIntensity={1.0}
        transparent
        opacity={0.6}
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

const Avatar3D = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0.5, 3.5], fov: 45 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d4ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#0066ff" />
          <pointLight position={[0, -5, 5]} intensity={0.3} color="#00ffaa" />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            color="#ffffff"
          />
          <HumanoidFigure />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Avatar3D;
