import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CANNON from "cannon";
import GUI from "lil-gui";
import { debounce } from "lodash";

// Import environment maps

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const PhysicalWorld = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-3, 3, 3);
    // camera.lookAt(group.position);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMapTexture = cubeTextureLoader.load([
      require("../../assets/textures/environmentMaps/1/px.png"),
      require("../../assets/textures/environmentMaps/1/nx.png"),
      require("../../assets/textures/environmentMaps/1/py.png"),
      require("../../assets/textures/environmentMaps/1/ny.png"),
      require("../../assets/textures/environmentMaps/1/pz.png"),
      require("../../assets/textures/environmentMaps/1/nz.png"),
    ]);

    // Sounds
    const maxImpactStrength = 10;
    const impactStrengthThreshold = 1.6;
    const hitSound = new Audio(require("../../assets/sounds/hit.mp3"));
    const playHitSound = (collision: CANNON.ICollisionEvent) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
      if (impactStrength > impactStrengthThreshold) {
        hitSound.volume =
          (impactStrength * 1) / (maxImpactStrength - impactStrengthThreshold);
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };
    const playHitSoundDebounced = debounce(playHitSound, 100, {
      leading: true,
    });

    // Objects
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Physics
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    // Optimise the collision
    world.broadphase = new CANNON.SAPBroadphase(world);

    // Materials
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;
    world.allowSleep = true;

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0,
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI / 2
    );
    floorBody.addShape(floorShape);
    world.addBody(floorBody);

    const canvas = document.getElementById(
      "physical-world"
    ) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = true;
    // Shadow map algorithm
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Utils
    let objectToUpdate: {
      mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
      body: CANNON.Body;
    }[] = [];
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.8,
      roughness: 0.1,
      envMap: environmentMapTexture,
    });
    // Sphere creator
    const createSphere = (radius: number, position: THREE.Vector3) => {
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.scale.set(radius, radius, radius);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      // Physical
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        shape,
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial,
      });
      body.position.x = position.x;
      body.position.y = position.y;
      body.position.z = position.z;
      body.addEventListener("collide", playHitSoundDebounced);
      world.addBody(body);

      objectToUpdate.push({
        mesh,
        body,
      });
    };
    createSphere(0.5, new THREE.Vector3(0, 3, 0));

    // Box creator
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });
    const createBox = (
      width: number,
      height: number,
      depth: number,
      position: THREE.Vector3
    ) => {
      const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh.scale.set(width, height, depth);
      mesh.position.copy(position);
      mesh.castShadow = true;
      scene.add(mesh);

      // Physical
      const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
      );
      const body = new CANNON.Body({
        shape,
        mass: 1,
        material: defaultMaterial,
        position: new CANNON.Vec3(0, 3, 0),
      });
      body.addShape(shape);
      body.position.x = position.x;
      body.position.y = position.y;
      body.position.z = position.z;
      body.addEventListener("collide", playHitSoundDebounced);
      world.addBody(body);

      objectToUpdate.push({
        mesh,
        body,
      });
    };

    // Orbit controls
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.zoomSpeed = 0.5;

    const clock = new THREE.Clock();
    let oldElapsedTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      orbitControls.update();

      // Update physical world
      world.step(1 / 60, deltaTime, 3);
      for (const object of objectToUpdate) {
        object.mesh.position.x = object.body.position.x;
        object.mesh.position.y = object.body.position.y;
        object.mesh.position.z = object.body.position.z;

        object.mesh.quaternion.x = object.body.quaternion.x;
        object.mesh.quaternion.y = object.body.quaternion.y;
        object.mesh.quaternion.z = object.body.quaternion.z;
        object.mesh.quaternion.w = object.body.quaternion.w;
      }
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

    // Debug
    const debugObject = {
      createSphere: () => {
        createSphere(
          Math.random() * 0.5,
          new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3
          )
        );
      },
      createBox: () => {
        createBox(
          Math.random(),
          Math.random(),
          Math.random(),
          new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3
          )
        );
      },
      reset: () => {
        for (const obj of objectToUpdate) {
          obj.body.removeEventListener("collide", playHitSoundDebounced);
          world.remove(obj.body);
          scene.remove(obj.mesh);
        }
        objectToUpdate = [];
      },
    };
    gui.add(debugObject, "createSphere");
    gui.add(debugObject, "createBox");
    gui.add(debugObject, "reset");
  });

  return (
    <>
      <canvas id="physical-world"></canvas>
    </>
  );
};

export default PhysicalWorld;
