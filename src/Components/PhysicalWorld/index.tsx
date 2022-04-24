import {useEffect} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const PhysicalWorld = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(-3, 3, 3);
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    sphere.castShadow = true;
    sphere.position.y = 0.5;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(sphere, plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = - 7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = - 7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const canvas = document.getElementById('physical-world') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = true;
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
      <canvas id='physical-world'></canvas>
    </>
  )
}

export default PhysicalWorld;
