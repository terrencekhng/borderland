import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {gsap} from 'gsap';
import {useEffect, useRef, useState} from "react";
import GUI from 'lil-gui';

// Styles
import styles from './index.module.css';
import {MeshBasicMaterial} from "three";

// Imports texture resources
// import doorColorImage from '../../assets/textures/door/color.jpg';
// import doorColorImage from '../../assets/textures/checkerboard-1024x1024.png';
// import doorColorImage from '../../assets/textures/checkerboard-8x8.png';
import doorColorImage from '../../assets/textures/minecraft.png';
import doorAlphaImage from '../../assets/textures/door/alpha.jpg';
import doorHeightImage from '../../assets/textures/door/height.jpg';
import doorNormalImage from '../../assets/textures/door/normal.jpg';
import doorAmbientOcclusionImage from '../../assets/textures/door/ambientOcclusion.jpg';
import doorMetalnessImage from '../../assets/textures/door/metalness.jpg';
import doorRoughnessImage from '../../assets/textures/door/roughness.jpg';

const Welcome = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const q = gsap.utils.selector(el);
  const tl = useRef<ReturnType<typeof gsap.timeline>>();
  const [reversed, setReversed] = useState(false);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Debug
  const gui = new GUI();
  gui.close();

  useEffect(() => {
    // Textures
    // const image = new Image();
    // const doorColorTexture = new THREE.Texture(image);
    // image.onload = () => {
    //   // Update the doorColorTexture
    //   doorColorTexture.needsUpdate = true;
    // }
    // image.src = doorColorImage;
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      console.log('onStart');
    }
    loadingManager.onProgress = () => {
      console.log('onProgress');
    }
    loadingManager.onLoad = () => {
      console.log('onLoaded');
    }
    loadingManager.onError = () => {
      console.error('onError');
    }
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const doorColorTexture = textureLoader.load(doorColorImage);
    const doorAlphaTexture = textureLoader.load(doorAlphaImage);
    const doorHeightTexture = textureLoader.load(doorHeightImage);
    const doorNormalTexture = textureLoader.load(doorNormalImage);
    const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusionImage);
    const doorMetalnessTexture = textureLoader.load(doorMetalnessImage);
    const doorRoughnessTexture = textureLoader.load(doorRoughnessImage);

    // doorColorTexture.repeat.x = 2;
    // doorColorTexture.repeat.y = 3;
    // doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // doorColorTexture.wrapT = THREE.RepeatWrapping;
    // doorColorTexture.offset.x = 0.5;
    // doorColorTexture.rotation = 1;
    // doorColorTexture.center.x = 0.5;
    // doorColorTexture.center.y = 0.5;
    // doorColorTexture.rotation = Math.PI / 4;

    doorColorTexture.generateMipmaps = false;
    // doorColorTexture.minFilter = THREE.NearestFilter;
    doorColorTexture.magFilter = THREE.NearestFilter;

    const scene: THREE.Scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      // new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        map: doorColorTexture,
      })
    );
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        map: doorColorTexture,
      })
    );
    cube2.position.set(-2, 0, 0);
    group.add(cube2);

    // const cube3 = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
    //   new THREE.MeshBasicMaterial({
    //     color: 0x0000ff,
    //     wireframe: true,
    //   })
    // );
    // cube3.position.set(2, 0, 0);
    // group.add(cube3);


    // const positionsArray = new Float32Array(9);
    // positionsArray[0] = 0;
    // positionsArray[1] = 0;
    // positionsArray[2] = 0;
    //
    // positionsArray[3] = 0;
    // positionsArray[4] = 1;
    // positionsArray[5] = 0;
    //
    // positionsArray[6] = 1;
    // positionsArray[7] = 0;
    // positionsArray[8] = 0;

    // 1. Create buffer array
    const positionsArray = new Float32Array([
      0,0,0,
      0,1,0,
      1,0,0
    ]);

    // 2. Convert buffer array to buffer attribute
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

    // 3. Add buffer attribute to buffer geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionsAttribute);
    const geometryMaterial = new THREE.Mesh(
      geometry,
      new MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      })
    );
    geometryMaterial.position.x = 1;
    scene.add(geometryMaterial);

    // const count = 50;
    // const geometry1 = new THREE.BufferGeometry();
    // const positionArray1 = new Float32Array(count * 9);
    // for (let i = 0; i < count * 9; ++i) {
    //   positionArray1[i] = Math.random();
    // }
    // const positionsAttribute1 = new THREE.BufferAttribute(positionArray1, 3);
    // geometry1.setAttribute('position', positionsAttribute1);
    // const geometryMaterial1 = new THREE.Mesh(
    //   geometry1,
    //   new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     wireframe: true,
    //   }),
    // );
    // geometryMaterial1.position.x = 2;
    // scene.add(geometryMaterial1);

    // group.rotation.y = 1;

    // Axes helper
    const axesHelper: THREE.AxesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // Camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    // const aspectRatio = sizes.width / sizes.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );
    camera.position.z = 4;
    // camera.position.y = 1;
    // camera.position.x = 1;
    scene.add(camera);

    const canvas = document.getElementById('webgl') as HTMLCanvasElement;

    // Orbit controls
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.zoomSpeed = 0.5;
    // orbitControls.target.y = 1;
    // orbitControls.update();

    // Camera helper
    // const cameraHelper: THREE.CameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);

    // Renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    // GSAP animation
    // gsap.to(group.position, {
    //   x: 2,
    //   duration: 1,
    //   delay: 1,
    // });
    // gsap.to(group.position, {
    //   x: 0,
    //   delay: 2,
    // });

    // Clock
    const clock = new THREE.Clock();
    // let time = Date.now();

    // Cursor
    const cursor = {
      x: 0,
      y: 0,
    };

    // Mouse event
    window.addEventListener('mousemove', (e: MouseEvent) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = e.clientY / sizes.height - 0.5;
    });

    // Handle resize
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Handle fullscreen
    window.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement;

      if (!fullscreenElement) {
        if (canvas['requestFullscreen']) {
          canvas.requestFullscreen().then(() => {
            console.log('Enter fullscreen succeeded');
          })
            .catch(() => {
              console.info('Enter fullscreen failed');
            });
        }
      } else {
        if (document['exitFullscreen']) {
          document.exitFullscreen().then(() => {
            console.log('Leave fullscreen succeeded');
          })
            .catch(() => {
              console.info('Leave fullscreen failed');
            });
        }
      }
    });

    // Debug
    gui.add(group.position, 'x', -3, 3, 0.2);
    gui.add(group.position, 'y', -3, 3, 0.2);
    gui.add(group.position, 'z', -3, 3, 0.2);
    gui.add(cube1.material, 'wireframe').name('Cube 1 wireframe');
    gui.add(cube2.material, 'wireframe').name('Cube 2 wireframe');
    const parameters = {
      cube1Color: 0xff0000,
      cube2Color: 0x00ff00,
      spin: () => {
        gsap.to(group.rotation, {
          duration: 1,
          y: group.rotation.y + 5,
        });
      },
    };
    gui
      .addColor(parameters, 'cube1Color')
      .onChange(() => {
        cube1.material.color.set(parameters.cube1Color);
      })
      .name('Cube 1 color');
    gui
      .addColor(parameters, 'cube2Color')
      .onChange(() => {
        cube2.material.color.set(parameters.cube2Color);
      })
      .name('Cube 2 color');
    gui
      .add(parameters, 'spin');

    const tick = () => {
      // Time
      // const currentTime = Date.now();
      // const deltaTime = currentTime - time;
      // time = currentTime;
      // group.rotation.y += 0.0001 * deltaTime;

      const elapsedTime = clock.getElapsedTime();
      // group.rotation.y = 0.1 * elapsedTime;
      // group.rotation.x = 0.1 * elapsedTime;
      // group.position.y = Math.sin(elapsedTime);
      // group.position.z = Math.sin(elapsedTime);

      // camera.lookAt(group.position);

      // Update camera
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 5;

      orbitControls.update();

      // Render
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }
    tick();

    // GSAP
    gsap.to(boxRef.current, {
      rotation: '+=360'
    });

    tl.current = gsap.timeline()
      .to(q('.box1'), {
        rotate: 360,
      })
      .to(q('.circle1'), {
        x: 100,
      });
  }, []);

  useEffect(() => {
    // toggle the direction of our timeline
    if (tl.current) {
      tl.current.reversed(reversed);
    }
  }, [reversed]);

  return (
    <section className={styles.container}>
      <canvas id='webgl'/>
      <button onClick={() => setReversed(!reversed)}>Toggle</button>
      <div className={styles.box} ref={boxRef}></div>
      <div ref={el}>
        <div className={`${styles.box} box1`}></div>
        <div className={`${styles.circle} circle1`}></div>
      </div>
    </section>
  )
}

export default Welcome;
