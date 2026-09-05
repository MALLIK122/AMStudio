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
    const initialZ = (window.innerWidth < 640 || container.clientWidth < 420) ? 10.8 : 8.5;
    camera.position.set(0, 0, initialZ);

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

    // Interactive Localized Black Cursor Lens on 3D AM Logo
    const spotUniforms = {
      uMousePos: { value: new THREE.Vector2(-9999, -9999) },
      uSpotRadius: { value: window.innerWidth < 640 ? 36.0 : 46.0 },
      uDpr: { value: Math.min(window.devicePixelRatio, 2) },
      uSpotActive: { value: 0.0 },
    };

    const injectBlackSpotShader = (shader) => {
      shader.uniforms.uMousePos = spotUniforms.uMousePos;
      shader.uniforms.uSpotRadius = spotUniforms.uSpotRadius;
      shader.uniforms.uDpr = spotUniforms.uDpr;
      shader.uniforms.uSpotActive = spotUniforms.uSpotActive;

      shader.fragmentShader = `
        uniform vec2 uMousePos;
        uniform float uSpotRadius;
        uniform float uDpr;
        uniform float uSpotActive;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        if (uSpotActive > 0.001) {
          float fragDist = distance(gl_FragCoord.xy, uMousePos);
          float pixelRadius = uSpotRadius * uDpr;
          // Smooth anti-aliased edge
          float spotFactor = 1.0 - smoothstep(pixelRadius - (3.5 * uDpr), pixelRadius, fragDist);
          spotFactor *= uSpotActive;
          // Turn localized area pure jet black
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), spotFactor);
        }
        `
      );
    };

    logoMaterial.onBeforeCompile = injectBlackSpotShader;
    edgeMaterial.onBeforeCompile = injectBlackSpotShader;

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

    // 5. Lighting: High-contrast studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

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
    let targetSpotActive = 0;
    let currentSpotActive = 0;

    const updateMouseCoords = (clientX, clientY) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      mouseX = (clientX / windowWidth) * 2 - 1;
      mouseY = -(clientY / windowHeight) * 2 + 1;

      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const dpr = renderer.getPixelRatio();
      const px = (clientX - rect.left) * dpr;
      const py = (rect.bottom - clientY) * dpr;

      spotUniforms.uMousePos.value.set(px, py);
      spotUniforms.uDpr.value = dpr;

      // Check if cursor is near the 3D logo container bounds
      const isOver = 
        clientX >= rect.left - 40 &&
        clientX <= rect.right + 40 &&
        clientY >= rect.top - 40 &&
        clientY <= rect.bottom + 40;

      targetSpotActive = isOver ? 1.0 : 0.0;
    };

    const handleMouseMove = (e) => {
      updateMouseCoords(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      targetSpotActive = 0.0;
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        targetSpotActive = 0.0;
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

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
      camera.position.z = (window.innerWidth < 640 || width < 420) ? 10.8 : 8.5;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      spotUniforms.uDpr.value = renderer.getPixelRatio();
      spotUniforms.uSpotRadius.value = window.innerWidth < 640 ? 36.0 : 46.0;
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

      // Smooth fade for the black cursor spot on the logo
      currentSpotActive += (targetSpotActive - currentSpotActive) * 0.15;
      spotUniforms.uSpotActive.value = currentSpotActive;

      // Particle motion
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
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
    <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[420px] md:h-[500px] lg:h-[580px] flex items-center justify-center pointer-events-none overflow-hidden select-none">
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
