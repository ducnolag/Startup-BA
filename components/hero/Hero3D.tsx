'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense } from 'react';
import * as THREE from 'three';

function FloatingOrb({
  position,
  color,
  distort,
  speed,
  scale,
}: {
  position: [number, number, number];
  color: string;
  distort: number;
  speed: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    meshRef.current.rotation.y = t * speed * 0.1;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  const particlePositions = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    const radius = Math.random() * 8 + 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
          count={particlePositions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#00b8ef"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#5ee8ff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0c1a3d" />
        <pointLight position={[0, 0, 5]} intensity={2} color="#00b8ef" />

        <ParticleField />

        <FloatingOrb
          position={[-2.5, 0.8, 0]}
          color="#0c1a3d"
          distort={0.4}
          speed={1.2}
          scale={1.3}
        />
        <FloatingOrb
          position={[2.2, -0.5, -1]}
          color="#00b8ef"
          distort={0.5}
          speed={1.5}
          scale={0.9}
        />
        <FloatingOrb
          position={[0.5, 1.5, -2]}
          color="#5ee8ff"
          distort={0.3}
          speed={1}
          scale={0.5}
        />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <HeroScene />
      {/* Vignette to blend with page */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/60" />
    </motion.div>
  );
}
