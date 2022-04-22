import {useEffect} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

import particleTextureImage from "../../assets/textures/particles/2.png";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const Particles = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 3;
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(particleTextureImage);

    // Objects
    // Particles
    // Geometry
    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const position = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; ++i) {
      position[i] = (Math.random() - 0.5) * 5;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xff88cc,
      size: 0.1,
      sizeAttenuation: true,
      alphaMap: particleTexture,
      transparent: true,
      // alphaTest: 0.001,
      // depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particles);

    const canvas = document.getElementById('lights') as HTMLCanvasElement;
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

      particles.rotation.y += 0.00034;
      particles.rotation.x += 0.00045;
    };
    tick();

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    })
  });

  return (
    <>
      <canvas id='lights'></canvas>
    </>
  )
}

export default Particles;
