/**
 * HeroScene — R3F 3D decorative background for the Hero section.
 *
 * LOADED LAZILY — this file is only imported when the hero enters the
 * viewport (intersection-triggered in Hero.jsx). It never touches the
 * initial JS bundle.
 *
 * DESKTOP ONLY — Hero.jsx gates this component behind useIsDesktop().
 * Mobile/touch gets the existing CSS blob @keyframes instead.
 *
 * SEO/A11Y — The canvas wrapper is aria-hidden + role=presentation.
 * All real text (h1, CTA, stats) lives in HTML beside this canvas.
 */

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import styles from './HeroScene.module.css';

// ── Mouse tracker shared across scene ───────────────────────────────────────
const mouse = { x: 0, y: 0 };

function trackMouse(e) {
  // Normalized to [-1, 1]
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
}

// ── Camera rig — lerps toward mouse position via useFrame ───────────────────
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    // easing factor 0.05 — slow, dreamy drift rather than snappy tracking
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Individual shape components ─────────────────────────────────────────────
function Shape({ geometry, position, color, floatSpeed, floatIntensity, rotIntensity, scale = 1, opacity = 0.2 }) {
  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={rotIntensity}
      floatIntensity={floatIntensity}
      floatingRange={[-0.3, 0.3]} // explicitly bound the drift so it doesn't cross the safe zone
    >
      <mesh position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          transparent={true} 
          opacity={opacity} 
          roughness={0.4} 
          metalness={0.1} 
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <CameraRig />

      {/* Shape 1 — top right corner, above faces (Amber). Max 20% opacity. */}
      <Shape
        geometry={<icosahedronGeometry args={[1, 0]} />}
        position={[3.8, 2.5, -2]} 
        color="#E8A020"
        floatSpeed={1.4}
        floatIntensity={0.8}
        rotIntensity={0.6}
        scale={1.3}
        opacity={0.20}
      />

      {/* Shape 2 — bottom right corner, far from text and faces (Teal). Max 15% opacity. */}
      <Shape
        geometry={<torusKnotGeometry args={[0.6, 0.2, 64, 12]} />}
        position={[4.2, -2.8, -2]}
        color="#0D5C63"
        floatSpeed={2.1}
        floatIntensity={1.2}
        rotIntensity={0.8}
        scale={1.1}
        opacity={0.15}
      />
    </>
  );
}

// ── Exported component ───────────────────────────────────────────────────────
export default function HeroScene() {
  useEffect(() => {
    window.addEventListener('mousemove', trackMouse, { passive: true });
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  return (
    // aria-hidden + role=presentation: canvas is decorative, not content
    <div
      className={styles.container}
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          powerPreference: 'low-power',
          antialias: false,
          alpha: true,        // transparent canvas so hero image shows through
        }}
        dpr={[1, 1.5]}        // cap pixel ratio — no need for retina on decorative shapes
        shadows={false}       // shadows have zero benefit on floating abstract shapes
      >
        <Scene />
      </Canvas>
    </div>
  );
}
