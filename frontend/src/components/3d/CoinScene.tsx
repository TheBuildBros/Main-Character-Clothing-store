"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Center } from "@react-three/drei";
import type { Group } from "three";

function Coin({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const { scene } = useGLTF("/models/coin.glb");
  const coinRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!prefersReducedMotion && coinRef.current) {
      // Reduced rotation speed for a smooth, graceful luxury editorial feel (~15s per full rotation)
      coinRef.current.rotation.y += delta * 0.42;
    }
  });

  return (
    <Center>
      <group scale={0.5}>
        {/* Subtle 3D dynamic tilt (pitch & roll) so it spins on an intentional angled 3D plane */}
        <group rotation={[0.2, 0, -0.14]}>
          <group ref={coinRef}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
    </Center>
  );
}

export default function CoinScene() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas
      gl={{ alpha: true, preserveDrawingBuffer: true }}
      className="h-full w-full"
      style={{ width: "100%", height: "100%", background: "transparent" }}
      camera={{ position: [0, 0, 7], fov: 45 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Coin prefersReducedMotion={prefersReducedMotion} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/coin.glb");
