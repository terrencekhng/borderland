import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {gsap} from 'gsap';
import {useEffect, useRef, useState} from "react";

// Styles
import styles from './index.module.css';

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

  useEffect(() => {
    const scene: THREE.Scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );
    cube2.position.set(-2, 0, 0);
    group.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      })
    );
    cube3.position.set(2, 0, 0);
    group.add(cube3);
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
    // tick();


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
