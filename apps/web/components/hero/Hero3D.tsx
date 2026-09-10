'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Vision Pro-inspired 3D hero background.
 *
 * Design language:
 * - Floating UI fragments in deep 3D space (mock data hints, not abstract)
 * - Soft volumetric lighting (top-left warm, bottom-right cool)
 * - Subtle particle field for depth perception
 * - Mouse-driven parallax (non-intrusive)
 * - Refined typography rendered as texture planes
 *
 * Accessibility:
 * - Honors `prefers-reduced-motion`: when reduced motion is requested,
 *   renders a static CSS gradient placeholder (no THREE.js scene).
 * - Listens for live changes to the media query and swaps scenes dynamically.
 * - Mouse parallax is disabled when reduced motion is preferred.
 */
export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  // SSR-safe initial value: assume motion OK on server, then re-check on mount.
  // `false` ensures the 3D scene path is the default in headless environments.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mql.matches);
    update();
    // Modern API
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    // Legacy Safari < 14 fallback
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  useEffect(() => {
    // If reduced motion is preferred, do not initialize the THREE.js scene.
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // ── Scene setup ──
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Lighting ──
    // Ambient — very subtle base light
    const ambient = new THREE.AmbientLight(0xfafaf9, 0.8);
    scene.add(ambient);

    // Key light — warm, top-left (like window light)
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.2);
    keyLight.position.set(-4, 6, 5);
    scene.add(keyLight);

    // Fill light — cool blue from bottom-right
    const fillLight = new THREE.DirectionalLight(0xe0e8ff, 0.4);
    fillLight.position.set(4, -3, 3);
    scene.add(fillLight);

    // Rim light — brand blue from behind
    const rimLight = new THREE.DirectionalLight(0x2563eb, 0.3);
    rimLight.position.set(0, 0, -4);
    scene.add(rimLight);

    // ── Background gradient mesh ──
    const bgGeometry = new THREE.PlaneGeometry(40, 40);
    const bgMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec3 warm = vec3(0.98, 0.965, 0.95);     // warm off-white
          vec3 cool = vec3(0.94, 0.93, 0.97);     // cool undertone
          vec3 brand = vec3(0.145, 0.388, 0.922); // brand blue
          vec3 depth = vec3(0.486, 0.227, 0.929); // violet depth

          // Radial gradient from center-bottom
          vec2 center = vUv - vec2(0.5, 0.3);
          float dist = length(center * vec2(1.2, 0.8));
          float radial = 1.0 - smoothstep(0.0, 0.8, dist);

          // Top accent glow
          float topGlow = smoothstep(0.3, 1.0, vUv.y) * 0.3;
          vec3 color = mix(warm, cool, radial * 0.4);
          color = mix(color, brand, topGlow * 0.15);
          color = mix(color, depth, vUv.y * 0.04);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -8;
    scene.add(bgMesh);

    // ── Floating card meshes (abstract UI cards) ──
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    interface FloatingCard {
      group: THREE.Group;
      basePos: THREE.Vector3;
      floatOffset: number;
      floatSpeed: number;
      floatAmp: number;
      rotSpeed: THREE.Vector3;
    }

    const cards: FloatingCard[] = [];

    // Card 1 — large hero card (left) — price comparison mock
    const card1Group = new THREE.Group();
    card1Group.position.set(-2.5, 0.8, 0);
    const card1Body = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.4, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.9,
      })
    );
    const card1Inner = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 1.35),
      new THREE.MeshStandardMaterial({
        color: 0xf7f6f3,
        roughness: 0.9,
        metalness: 0,
      })
    );
    card1Inner.position.z = 0.03;
    const card1Line = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.04, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.5 })
    );
    card1Line.position.set(0, 0.68, 0.03);
    // Mini chart line on card 1 — suggests price trend
    const card1Chart = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.6),
      new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            float curve = sin(vUv.x * 6.0) * 0.15 + 0.5 - vUv.x * 0.4;
            float line = smoothstep(curve - 0.015, curve, vUv.y) * (1.0 - smoothstep(curve, curve + 0.015, vUv.y));
            vec3 brand = vec3(0.145, 0.388, 0.922);
            gl_FragColor = vec4(brand, line * 0.85);
          }
        `,
      })
    );
    card1Chart.position.set(0, 0, 0.04);
    // Mini store dots row — suggests 4 platforms
    const card1Dots = new THREE.Group();
    [0, 0.18, 0.36, 0.54].forEach((x, i) => {
      const dot = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.12, 0.005),
        new THREE.MeshStandardMaterial({
          color: i === 3 ? 0x18181b : 0xffffff,
          roughness: 0.3,
        })
      );
      dot.position.set(-0.7 + x, -0.45, 0.04);
      card1Dots.add(dot);
    });
    // Title bar
    const card1TitleBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.08, 0.005),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
    );
    card1TitleBar.position.set(-0.5, 0.45, 0.04);
    // Shadow plane
    const card1Shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        transparent: true,
        opacity: 0.04,
        roughness: 1,
      })
    );
    card1Shadow.position.set(0.1, -0.1, -0.01);
    card1Group.add(card1Shadow, card1Body, card1Inner, card1Line, card1Chart, card1Dots, card1TitleBar);
    cardGroup.add(card1Group);

    cards.push({
      group: card1Group,
      basePos: new THREE.Vector3(-2.5, 0.8, 0),
      floatOffset: 0,
      floatSpeed: 0.8,
      floatAmp: 0.15,
      rotSpeed: new THREE.Vector3(0.0005, 0.0008, 0.0002),
    });

    // Card 2 — medium card (right, higher) — idea-to-tool list mock
    const card2Group = new THREE.Group();
    card2Group.position.set(2.2, 1.2, 1.5);
    card2Group.rotation.z = 0.12;
    const card2Body = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.08,
        metalness: 0.0,
        transparent: true,
        opacity: 0.85,
      })
    );
    const card2Inner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.75, 1.15),
      new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.95 })
    );
    card2Inner.position.z = 0.03;
    const card2Line = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.03, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 })
    );
    card2Line.position.set(0, 0.585, 0.03);
    // 3 list rows — suggests problem → tool suggestions
    [0, 1, 2].forEach((i) => {
      const rowBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.05, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
      );
      rowBar.position.set(-0.35, 0.32 - i * 0.18, 0.04);
      card2Group.add(rowBar);
      const rowSub = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.03, 0.005),
        new THREE.MeshStandardMaterial({ color: 0xa1a1aa, roughness: 0.5 })
      );
      rowSub.position.set(-0.55, 0.22 - i * 0.18, 0.04);
      card2Group.add(rowSub);
      const pill = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.06, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 })
      );
      pill.position.set(0.65, 0.27 - i * 0.18, 0.04);
      card2Group.add(pill);
    });
    // Title bar
    const card2TitleBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.06, 0.005),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
    );
    card2TitleBar.position.set(-0.2, 0.5, 0.04);
    card2Group.add(card2TitleBar, card2Body, card2Inner, card2Line);
    const card2Shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x18181b, transparent: true, opacity: 0.035, roughness: 1 })
    );
    card2Shadow.position.set(0.08, -0.08, -0.01);
    card2Group.add(card2Shadow);
    cardGroup.add(card2Group);

    cards.push({
      group: card2Group,
      basePos: new THREE.Vector3(2.2, 1.2, 1.5),
      floatOffset: Math.PI * 0.5,
      floatSpeed: 1.1,
      floatAmp: 0.12,
      rotSpeed: new THREE.Vector3(0.0003, 0.0004, 0.0001),
    });

    // Card 3 — small card (bottom left)
    const card3Group = new THREE.Group();
    card3Group.position.set(-1.5, -1.8, 2);
    card3Group.rotation.z = -0.08;
    const card3Body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.75,
      })
    );
    const card3Shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x18181b, transparent: true, opacity: 0.03, roughness: 1 })
    );
    card3Shadow.position.set(0.06, -0.06, -0.01);
    card3Group.add(card3Shadow, card3Body);
    cardGroup.add(card3Group);

    cards.push({
      group: card3Group,
      basePos: new THREE.Vector3(-1.5, -1.8, 2),
      floatOffset: Math.PI * 1.3,
      floatSpeed: 0.9,
      floatAmp: 0.1,
      rotSpeed: new THREE.Vector3(0.0004, 0.0002, 0.0003),
    });

    // Card 4 — tall card (far right)
    const card4Group = new THREE.Group();
    card4Group.position.set(3.2, -0.5, 2.5);
    card4Group.rotation.z = -0.06;
    const card4Body = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.6, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.12,
        metalness: 0.0,
        transparent: true,
        opacity: 0.7,
      })
    );
    const card4Line = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.03, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 })
    );
    card4Line.position.set(0, 0.785, 0.03);
    const card4Shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x18181b, transparent: true, opacity: 0.03, roughness: 1 })
    );
    card4Shadow.position.set(0.07, -0.07, -0.01);
    card4Group.add(card4Shadow, card4Body, card4Line);
    cardGroup.add(card4Group);

    cards.push({
      group: card4Group,
      basePos: new THREE.Vector3(3.2, -0.5, 2.5),
      floatOffset: Math.PI * 0.8,
      floatSpeed: 1.3,
      floatAmp: 0.08,
      rotSpeed: new THREE.Vector3(0.0002, 0.0003, 0.0004),
    });

    // ── Particle field ──
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      opacities[i] = Math.random();
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float aOpacity;
        varying float vOpacity;
        void main() {
          vOpacity = aOpacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (2.0 + aOpacity * 2.0) * (8.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * vOpacity * 0.4;
          gl_FragColor = vec4(0.145, 0.388, 0.922, alpha); // brand blue
        }
      `,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── Mouse tracking — disabled entirely when reduced motion is on ──
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    let mouseMoveTarget: Window | null = null;
    // Always re-check the latest reduced-motion preference; if it flips
    // mid-session to "reduce", we drop the listener (the upper effect
    // unmounts the scene, but be defensive).
    const isReducedNow = () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedNow()) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      mouseMoveTarget = window;
    }

    // ── Resize handling ──
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ──
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.008;

      // Camera parallax from mouse (skipped when reduced motion is on)
      if (!isReducedNow()) {
        camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.03;
        camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
      } else {
        // Lock camera to base position
        camera.position.set(0, 0, 12);
        camera.lookAt(0, 0, 0);
      }

      // Floating cards
      for (const card of cards) {
        const floatY = Math.sin(time * card.floatSpeed + card.floatOffset) * card.floatAmp;
        const floatX = Math.cos(time * card.floatSpeed * 0.7 + card.floatOffset) * card.floatAmp * 0.5;
        card.group.position.set(
          card.basePos.x + floatX,
          card.basePos.y + floatY,
          card.basePos.z
        );
        card.group.rotation.x += card.rotSpeed.x;
        card.group.rotation.y += card.rotSpeed.y;
        card.group.rotation.z += card.rotSpeed.z;
      }

      // Slow particle drift
      particles.rotation.y = time * 0.015;
      particles.rotation.x = Math.sin(time * 0.01) * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (mouseMoveTarget) mouseMoveTarget.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // Static, accessible CSS-only placeholder that preserves the warm/brand
    // gradient look from the 3D scene without any animation or canvas.
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        style={{
          height: '100%',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 60%), linear-gradient(180deg, #fafaf9 0%, #f0efec 100%)',
        }}
        aria-hidden
        data-reduced-motion-placeholder="hero3d"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ height: '100%' }}
      aria-hidden
    />
  );
}
