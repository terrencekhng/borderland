import {useEffect} from "react";
import * as THREE from "three";
import GUI from 'lil-gui';

import matcapTextureImage from "../../assets/textures/matcaps/8.png";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import typefaceFront from "../../assets/fonts/helvetiker_bold.typeface.json";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const Lights = () => {
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
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5,  32, 32),
      material
    );
    sphere.position.x = -1.5;
    scene.add(sphere);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75, 16, 16, 16),
      material
    );
    scene.add(box);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 64),
      material
    );
    torus.position.x = 1.5;
    scene.add(torus);
    // Plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      material
    );
    plane.rotation.x = - Math.PI * 0.5;
    plane.position.y = - 0.65;
    scene.add(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient light');

    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(1, 0.25, 0);
    scene.add(directionalLight);
    const directionLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
    scene.add(directionLightHelper);
    // gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Directional light');

    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, 0.5, 3, 10);
    pointLight.position.set(1, -0.5, 1);
    scene.add(pointLight);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3());
    scene.add(rectAreaLight);
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    scene.add(rectAreaLightHelper);

    const spotLight = new THREE.SpotLight(0x78ff00, 0.7, 10, Math.PI * 0.08, 0.25, 1);
    spotLight.position.set(0,2,3);
    spotLight.target.position.x = -0.75;
    scene.add(spotLight.target);
    scene.add(spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    window.requestAnimationFrame(() => {
      spotLightHelper.update();
    });
    scene.add(spotLightHelper);

    // Helpers
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    scene.add(hemisphereLightHelper);

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

      // Update objects
      sphere.rotation.y = 0.1 * elapsedTime;
      box.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      box.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

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

export default Lights;
