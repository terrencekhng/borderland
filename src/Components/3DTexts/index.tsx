import * as THREE from 'three';
import {useEffect} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import typefaceFront from '../../assets/fonts/helvetiker_bold.typeface.json';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";

// Import textures
import matcapTextureImage from '../../assets/textures/matcaps/8.png';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


const ThreeDTexts = () => {

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
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(matcapTextureImage);

    // Objects
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1,  64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
      })
    );
    // group.add(mesh);

    console.time('donut');
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
    const matcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    for (let i = 0; i < 200; ++i) {
      const donut = new THREE.Mesh(donutGeometry, matcapMaterial);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.PI * Math.random();
      donut.rotation.y = Math.PI * Math.random();

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);

      scene.add(donut);
    }
    console.timeEnd('donut');

    // Texts
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(typefaceFront);
    const textGeometry = new TextGeometry(
      'Hi Terence',
      {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 64,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 64,
      }
    );
    // Center the text geometry
    // textGeometry.computeBoundingBox();
    // if (textGeometry.boundingBox) {
    //   textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) / 2,
    //     -(textGeometry.boundingBox.max.y - 0.02) / 2,
    //     -(textGeometry.boundingBox.max.z - 0.03) / 2
    //   );
    // }
    textGeometry.center();
    const textMaterial = new THREE.Mesh(
      textGeometry,
      // new THREE.MeshBasicMaterial({
      //   wireframe: true,
      // })
      matcapMaterial
    );
    scene.add(textMaterial);


    const canvas = document.getElementById('threed-texts') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    // Orbit controls
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.enableDamping = true;
    orbitControls.zoomSpeed = 0.5;


    const tick = () => {
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
      <canvas id='threed-texts'></canvas>
    </>
  )
}

export default ThreeDTexts;
