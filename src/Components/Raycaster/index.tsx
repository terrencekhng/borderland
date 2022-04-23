import {useEffect} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const Raycaster = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 5;
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();

    // Objects
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    object1.position.x = - 2;

    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );

    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    // Raycaster
    const raycaster = new THREE.Raycaster();



    const canvas = document.getElementById('raycaster') as HTMLCanvasElement;
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



    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    });


    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e: MouseEvent) => {
      mouse.x = e.clientX / sizes.width * 2 - 1;
      mouse.y = -(e.clientY / sizes.height * 2 - 1);
    });

    const clock = new THREE.Clock();
    let currentIntersect: null | THREE.Intersection = null;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      orbitControls.update();

      // Animation
      object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

      // const rayOrigin = new THREE.Vector3(-3, 0, 0);
      // const rayDirection = new THREE.Vector3(10, 0, 0);
      // rayDirection.normalize();
      // raycaster.set(rayOrigin, rayDirection);
      const objectsToTest = [object1, object2, object3];
      const intersects = raycaster.intersectObjects(objectsToTest);
      for (const object of objectsToTest) {
        let obj = object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
        obj.material.color.set('#ff0000');
      }
      for (const intersect of intersects) {
        let sphereObj = intersect.object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
        sphereObj.material.color.set('#0000ff');
      }
      if (intersects.length) {
        if (currentIntersect === null) {
          console.log('mouse enter');
        }
        currentIntersect = intersects[0];
      } else {
        if (currentIntersect) {
          console.log('mouse leave');
        }
        currentIntersect = null;
      }
      raycaster.setFromCamera(mouse, camera);
    };
    tick();

    window.addEventListener('click', () => {
      if (currentIntersect) {
        if (currentIntersect.object === object1) {
          console.log('click on object1');
        }
        if (currentIntersect.object === object2) {
          console.log('click on object2');
        }
        if (currentIntersect.object === object3) {
          console.log('click on object3');
        }
      }
    });
  });

  return (
    <>
      <canvas id='raycaster'></canvas>
    </>
  )
}

export default Raycaster;
