import {useEffect} from "react";
import * as THREE from "three";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from 'lil-gui';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const Shadows = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 3;
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();

    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;
    material.roughness = 0.7
    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5,  32, 32),
      material
    );
    scene.add(sphere);

    // Plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      material
    );
    plane.rotation.x = - Math.PI * 0.5;
    plane.position.y = - 0.5;
    scene.add(plane);

    // Lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(2, 2, - 1);
    gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001);
    gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001);
    gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001);
    scene.add(directionalLight);


    const canvas = document.getElementById('lights') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

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

export default Shadows;
