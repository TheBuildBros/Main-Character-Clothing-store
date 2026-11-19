"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Center } from "@react-three/drei";

function Coin() {
  const { scene } = useGLTF("/models/coin.glb");
  return (
    <Center>
      <group scale={0.5}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

export default function CoinScene() {
  return (
    <Canvas
      gl={{ alpha: true }}
      className="h-full w-full"
      style={{ width: "100%", height: "100%", background: "transparent" }}
      camera={{ position: [0, 0, 7], fov: 45 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Coin />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/coin.glb");
