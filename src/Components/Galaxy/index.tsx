import { useEffect } from "react";
import * as THREE from "three";
import particleTextureImage from "../../assets/textures/particles/2.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI({
  width: 360,
});
gui.close();

const Galaxy = () => {
  const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.02,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  };

  let geometry: THREE.BufferGeometry;
  let material: THREE.PointsMaterial;
  let galaxy: THREE.Points;
  let scene: THREE.Scene;

  const generateGalaxy = () => {
    if (galaxy) {
      reset();
    }

    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.y = 5;
    camera.position.z = 7;
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(particleTextureImage);

    // Galaxy
    // Material
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; ++i) {
      const i3 = i * 3;

      // Positions
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Colors
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    material = new THREE.PointsMaterial({
      size: parameters.size,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      vertexColors: true,
    });
    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    const canvas = document.getElementById("galaxy") as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = false;
    // Shadow map algorithm
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit controls
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.zoomSpeed = 0.5;

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      orbitControls.update();
    };
    tick();

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    });
  };

  useEffect(() => {
    generateGalaxy();
    initDebug();
  });

  const reset = () => {
    console.log("reset");
    geometry.dispose();
    material.dispose();
    scene.remove(galaxy);
  };

  const initDebug = () => {
    gui
      .add(parameters, "count")
      .min(100)
      .max(100000)
      .step(100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "size")
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "radius")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "branches")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
  };

  return (
    <>
      <canvas id="galaxy"></canvas>
    </>
  );
};

export default Galaxy;
