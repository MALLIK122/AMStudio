import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Root Group for the 3D AM Logo
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 2. Build 3D Shape for Letter "A"
    // Center of A roughly at x = -1.25, height 2.8 (-1.4 to 1.4)
    const shapeA = new THREE.Shape();
    // Outer boundary (Counter-clockwise)
    shapeA.moveTo(-2.25, -1.35); // bottom left outer
    shapeA.lineTo(-1.45, 1.35);  // top left apex
    shapeA.lineTo(-1.05, 1.35);  // top right apex
    shapeA.lineTo(-0.25, -1.35); // bottom right outer
    shapeA.lineTo(-0.75, -1.35); // bottom right inner foot
    shapeA.lineTo(-0.95, -0.65); // right inner to crossbar
    shapeA.lineTo(-1.55, -0.65); // left inner to crossbar
    shapeA.lineTo(-1.75, -1.35); // bottom left inner foot
    shapeA.closePath();

    // Triangle hole in "A"
    const holeA = new THREE.Path();
    holeA.moveTo(-1.43, -0.25);
    holeA.lineTo(-1.25, 0.60);
    holeA.lineTo(-1.07, -0.25);
    holeA.closePath();
    shapeA.holes.push(holeA);

    // 3. Build 3D Shape for Letter "M"
    // Center of M roughly at x = +1.1, height 2.8 (-1.4 to 1.4)
    const shapeM = new THREE.Shape();
    shapeM.moveTo(0.05, -1.35);  // left outer foot
    shapeM.lineTo(0.05, 1.35);   // left top outer
    shapeM.lineTo(0.55, 1.35);   // left top inner shoulder
    shapeM.lineTo(1.10, 0.15);   // central valley notch
    shapeM.lineTo(1.65, 1.35);   // right top inner shoulder
    shapeM.lineTo(2.15, 1.35);   // right top outer
    shapeM.lineTo(2.15, -1.35);  // right outer foot
    shapeM.lineTo(1.70, -1.35);  // right inner foot
    shapeM.lineTo(1.70, 0.55);   // right inner vertical
    shapeM.lineTo(1.10, -0.55);  // center lower apex
    shapeM.lineTo(0.50, 0.55);   // left inner vertical
    shapeM.lineTo(0.50, -1.35);  // left inner foot
    shapeM.closePath();

    // Extrusion specifications for bold 3D depth and beveled edges
    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };

    const geomA = new THREE.ExtrudeGeometry(shapeA, extrudeSettings);
    const geomM = new THREE.ExtrudeGeometry(shapeM, extrudeSettings);

    // Center geometries along Z axis
    geomA.center();
    geomM.center();

    // Position "A" and "M" with precision architectural spacing
    geomA.translate(-1.20, 0, 0);
    geomM.translate(1.10, 0, 0);

    // Materials: Pure Brilliant White Architectural Finish
    const logoMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.18,
      roughness: 0.22,
      emissive: 0x222222,
    });

    const meshA = new THREE.Mesh(geomA, logoMaterial);
    const meshM = new THREE.Mesh(geomM, logoMaterial);

    logoGroup.add(meshA);
    logoGroup.add(meshM);

    // Subtle edge contours for architectural definition
    const edgesA = new THREE.EdgesGeometry(geomA, 25);
    const edgesM = new THREE.EdgesGeometry(geomM, 25);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    const lineA = new THREE.LineSegments(edgesA, edgeMaterial);
    const lineM = new THREE.LineSegments(edgesM, edgeMaterial);

    logoGroup.add(lineA);
    logoGroup.add(lineM);



    // Floating particle field
    const particlesCount = 90;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Lighting: High-contrast studio lighting casting specular highlights on 3D letters
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Dynamic Tracking Spotlight (follows mouse across logo face)
    const cursorLight = new THREE.PointLight(0xffffff, 3.5, 18);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(-5, 5, 2);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xffffff, 1.2, 12);
    bottomGlow.position.set(2, -4, 2);
    scene.add(bottomGlow);

    // 6. Interaction & Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      mouseX = (clientX / windowWidth) * 2 - 1;
      mouseY = -(clientY / windowHeight) * 2 + 1;

      // Update cursor light position to glide over 3D AM facets
      cursorLight.position.x = mouseX * 5;
      cursorLight.position.y = mouseY * 4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll reactivity
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating levitation
      logoGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.12;

      // Subtle resting rotation
      const baseRotationY = Math.sin(elapsedTime * 0.7) * 0.15;
      const baseRotationX = Math.cos(elapsedTime * 0.9) * 0.08;

      // Mouse Parallax Lerping
      targetRotationY = baseRotationY + (mouseX * 0.45) + (scrollY * 0.0006);
      targetRotationX = baseRotationX + (-mouseY * 0.35);

      logoGroup.rotation.y += (targetRotationY - logoGroup.rotation.y) * 0.06;
      logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.06;

      // Particle motion
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geomA.dispose();
      geomM.dispose();
      edgesA.dispose();
      edgesM.dispose();
      logoMaterial.dispose();
      edgeMaterial.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] md:h-[620px] flex items-center justify-center pointer-events-none overflow-hidden select-none">
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0 flex items-center justify-center"
      />
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <span className="font-display font-black text-6xl text-white tracking-widest">AM</span>
            <p className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Studio 3D Monogram</p>
          </div>
        </div>
      )}
    </div>
  );
}
