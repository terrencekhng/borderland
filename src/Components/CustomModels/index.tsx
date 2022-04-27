import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const CustomModels = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(2, 2, 2);
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();

    // Models
    let mixer: THREE.AnimationMixer | null = null;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      'https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/draco/',
    );
    dracoLoader.preload();
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      // 'https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/models/Duck/glTF/Duck.gltf',
      // 'https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/models/FlightHelmet/glTF/FlightHelmet.gltf',
      // 'https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/models/Duck/glTF-Draco/Duck.gltf',
      'https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/models/Fox/glTF/Fox.gltf',
      (gltf) => {
        console.log('success');
        console.log(gltf);
        gltf.scene.scale.set(0.025, 0.025, 0.025);

        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        scene.add(gltf.scene);
        // scene.add(...gltf.scene.children);
      },
    );

    // Plane
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
      }),
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const canvas = document.getElementById(
      'custom-models',
    ) as HTMLCanvasElement;
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
    let lastElapsedTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;

      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      orbitControls.update();

      // Update mixer
      mixer?.update(deltaTime);
    };
    tick();

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    });
  });

  return (
    <>
      <canvas id="custom-models" />
    </>
  );
};

export default CustomModels;
