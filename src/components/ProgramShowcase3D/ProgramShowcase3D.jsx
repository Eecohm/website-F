/**
 * ProgramShowcase3D — interactive 3D model viewer section on the Home page.
 *
 * Shows 3 clickable program categories. User clicks a tab → the matching
 * GLB model loads and can be freely orbited with mouse drag. Models use
 * natural PBR lighting (no neon), soft shadows, neutral environment.
 *
 * Layout: left = text/tabs, right = full-height Canvas.
 * Mobile: canvas hidden, tabs only.
 */

import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './ProgramShowcase3D.module.css';

// ── Model data ───────────────────────────────────────────────────────────────
const MODELS = [
  {
    id: 'technology',
    label: 'Computer Science',
    desc: 'Software development, networking, and IT — hands-on learning with industry tools.',
    glb: '/glb/eecohm_laptop.glb',
    scale: 2.2,
    position: [0, -0.5, 0],
    link: '/programs/advanced-diploma-computer-science',
    color: '#0D5C63',
    hint: 'Drag to rotate • Scroll to zoom',
  },
  {
    id: 'hospitality',
    label: 'Hotel Management',
    desc: 'International-standard hospitality training with internship placements worldwide.',
    glb: '/glb/eecohm_chef_hat.glb',
    scale: 1.8,
    position: [0, -0.6, 0],
    link: '/programs/advanced-diploma-hotel-management',
    color: '#8B4513',
    hint: 'Drag to rotate • Scroll to zoom',
  },
  {
    id: 'academic',
    label: 'Academic Excellence',
    desc: 'NEB-affiliated education from pre-school through advanced diplomas.',
    glb: '/glb/eecohm_graduation_cap.glb',
    scale: 2.0,
    position: [0, -0.4, 0],
    link: '/programs',
    color: '#6C3483',
    hint: 'Drag to rotate • Scroll to zoom',
  },
];

// Preload all 3
MODELS.forEach(m => useGLTF.preload(m.glb));

// ── Single model rendered inside Canvas ─────────────────────────────────────
function Model({ glb, scale, position, isIdle }) {
  const { scene } = useGLTF(glb);
  const ref = useRef();

  // Gentle idle rotation when user isn't dragging
  useFrame((_, delta) => {
    if (!ref.current || !isIdle) return;
    ref.current.rotation.y += delta * 0.4;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.15}
      floatIntensity={0.5}
      floatingRange={[-0.08, 0.08]}
    >
      <primitive
        ref={ref}
        object={scene}
        scale={scale}
        position={position}
      />
    </Float>
  );
}

// ── The 3D viewport ──────────────────────────────────────────────────────────
function Viewport({ model }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 1.2, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      shadows
    >
      {/* Neutral warm-cool lighting — no neon */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#c8d8e8" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#f5e6c8" />

      {/* Soft environment — no HDR, just subtle hemisphere */}
      <hemisphereLight skyColor="#dce8f0" groundColor="#c8b89a" intensity={0.6} />

      <Suspense fallback={null}>
        <Model
          key={model.glb}
          glb={model.glb}
          scale={model.scale}
          position={model.position}
          isIdle={!isDragging}
        />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={2}
          color="#6b4f3a"
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
        minDistance={2.5}
        maxDistance={8}
        autoRotate={false}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />
    </Canvas>
  );
}

// ── Exported component ───────────────────────────────────────────────────────
export default function ProgramShowcase3D() {
  const [active, setActive] = useState(0);
  const model = MODELS[active];

  return (
    <section className={styles.section} aria-label="Interactive 3D Program Showcase">
      <div className={styles.inner}>

        {/* ── Left panel ── */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>Explore in 3D</span>
          <h2 className={styles.heading}>
            Our Programs,<br />
            <span className={styles.accent}>Brought to Life</span>
          </h2>
          <p className={styles.subhead}>
            Pick a track and rotate the model freely — each represents a world-class
            EECOHM program with dual certification.
          </p>

          {/* Tab buttons */}
          <div className={styles.tabs} role="tablist">
            {MODELS.map((m, i) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={active === i}
                className={`${styles.tab} ${active === i ? styles.tabActive : ''}`}
                onClick={() => setActive(i)}
                style={active === i ? { '--tab-color': m.color } : {}}
              >
                <span className={styles.tabDot} style={{ background: m.color }} />
                {m.label}
              </button>
            ))}
          </div>

          {/* Description + CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={styles.desc}
            >
              <p>{model.desc}</p>
              <Link to={model.link} className={styles.cta}>
                Explore Program <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right panel — 3D Canvas ── */}
        <div className={styles.right} aria-hidden="true">
          <div className={styles.canvasWrap}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={styles.canvasInner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Viewport model={model} />
              </motion.div>
            </AnimatePresence>
            <p className={styles.hint}>{model.hint}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
