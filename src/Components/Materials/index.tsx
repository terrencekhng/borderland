import * as THREE from "three";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

// Import texture resources
import doorColorImage from "../../assets/textures/door/color.jpg";
import doorAlphaImage from "../../assets/textures/door/alpha.jpg";
import doorHeightImage from "../../assets/textures/door/height.jpg";
import doorNormalImage from "../../assets/textures/door/normal.jpg";
import doorAmbientOcclusionImage from "../../assets/textures/door/ambientOcclusion.jpg";
import doorMetalnessImage from "../../assets/textures/door/metalness.jpg";
import doorRoughnessImage from "../../assets/textures/door/roughness.jpg";
import matcapTextureImage from "../../assets/textures/matcaps/8.png";
import gradientTextureImage from "../../assets/textures/gradients/3.jpg";
import nx from "../../assets/textures/environmentMaps/0/nx.jpg";
import ny from "../../assets/textures/environmentMaps/0/ny.jpg";
import px from "../../assets/textures/environmentMaps/0/px.jpg";
import py from "../../assets/textures/environmentMaps/0/py.jpg";
import nz from "../../assets/textures/environmentMaps/0/nz.jpg";
import pz from "../../assets/textures/environmentMaps/0/pz.jpg";

const gui = new GUI();
gui.close();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const Materials = () => {
  useEffect(() => {
    const canvas = document.getElementById("materials") as HTMLCanvasElement;

    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    // Textures
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      console.log("onStart");
    };
    loadingManager.onProgress = () => {
      console.log("onProgress");
    };
    loadingManager.onLoad = () => {
      console.log("onLoaded");
    };
    loadingManager.onError = () => {
      console.error("onError");
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);
    // Door textures
    const doorColorTexture = textureLoader.load(doorColorImage);
    const doorAlphaTexture = textureLoader.load(doorAlphaImage);
    const doorHeightTexture = textureLoader.load(doorHeightImage);
    const doorNormalTexture = textureLoader.load(doorNormalImage);
    const doorAmbientOcclusionTexture = textureLoader.load(
      doorAmbientOcclusionImage
    );
    const doorMetalnessTexture = textureLoader.load(doorMetalnessImage);
    const doorRoughnessTexture = textureLoader.load(doorRoughnessImage);
    // Other textures
    const matcapTexture = textureLoader.load(matcapTextureImage);
    const gradientTexture = textureLoader.load(gradientTextureImage);
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;

    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
    const environmentMapTexture = cubeTextureLoader.load([
      px,
      nx,
      py,
      ny,
      pz,
      nz,
    ]);

    // Materials
    // Basic material
    // const material = new THREE.MeshBasicMaterial();
    // material.color.setColorName('red');
    // material.map = matcapTexture;
    // material.wireframe = true;
    // material.opacity = 0.5;
    // material.transparent = true;
    // material.alphaMap = doorAlphaTexture;
    // material.side = THREE.DoubleSide;
    // Normal material
    // const material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;
    // Metcap material
    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = matcapTexture;
    // Mesh depth material
    // const material = new THREE.MeshDepthMaterial();
    // Mesh Lambert material
    // const material = new THREE.MeshLambertMaterial();
    // Mesh Phong material
    // const material = new THREE.MeshPhongMaterial();
    // material.shininess = 100;
    // material.specular = new THREE.Color(0x1994d1);
    // Mesh toon material
    // const material = new THREE.MeshToonMaterial();
    // material.gradientMap = gradientTexture;
    // Mesh standard material
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    // material.map = doorColorTexture;
    // material.aoMap = doorAmbientOcclusionTexture;
    // material.aoMapIntensity = 2;
    // material.displacementMap = doorHeightTexture;
    // material.displacementScale = 0.05;
    // material.metalnessMap = doorMetalnessTexture;
    // material.roughnessMap = doorRoughnessTexture;
    // material.normalMap = doorNormalTexture;
    // material.alphaMap = doorAlphaTexture;
    // material.transparent = true;
    // envMap
    material.envMap = environmentMapTexture;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material
    );
    sphere.position.x = -1.5;
    group.add(sphere);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );
    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );
    group.add(plane);
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material
    );
    torus.position.x = 1.5;
    group.add(torus);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(ambientLight, pointLight);

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      2000
    );
    camera.position.z = 4;
    scene.add(camera);
    camera.lookAt(group.position);

    // Orbit controls
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.zoomSpeed = 0.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    const clock = new THREE.Clock();
    const tick = () => {
      window.requestAnimationFrame(tick);

      renderer.render(scene, camera);
      orbitControls.update();

      // Update objects
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = 0.1 * elapsedTime;
      plane.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      plane.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;
    };

    tick();

    // Debug
    gui.add(material, "metalness").min(0).max(1).step(0.01);
    gui.add(material, "roughness").min(0).max(1).step(0.01);
    gui.add(material, "aoMapIntensity").min(0).max(4).step(0.01);
    gui.add(material, "displacementScale").min(0).max(1).step(0.001);

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    });
  }, []);

  return (
    <>
      <canvas id="materials"></canvas>
    </>
  );
};

export default Materials;
