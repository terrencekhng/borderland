import GUI from 'lil-gui';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// Import texture resources
// door textures
import doorColorImage from '../../assets/textures/door/color.jpg';
import doorAlphaImage from '../../assets/textures/door/alpha.jpg';
import doorHeightImage from '../../assets/textures/door/height.jpg';
import doorNormalImage from '../../assets/textures/door/normal.jpg';
import doorAmbientOcclusionImage from '../../assets/textures/door/ambientOcclusion.jpg';
import doorMetalnessImage from '../../assets/textures/door/metalness.jpg';
import doorRoughnessImage from '../../assets/textures/door/roughness.jpg';
// brick textures
import brickColorTextureImage from '../../assets/textures/bricks/color.jpg';
import brickNormalTextureImage from '../../assets/textures/bricks/normal.jpg';
import brickAmbientOcclusionTextureImage from '../../assets/textures/bricks/ambientOcclusion.jpg';
import brickRoughnessTextureImage from '../../assets/textures/bricks/roughness.jpg';
// grass textures
import grassColorTextureImage from '../../assets/textures/grass/color.jpg';
import grassNormalTextureImage from '../../assets/textures/grass/normal.jpg';
import grassAmbientOcclusionTextureImage from '../../assets/textures/grass/ambientOcclusion.jpg';
import grassRoughnessTextureImage from '../../assets/textures/grass/roughness.jpg';
// grave textures
import graveColorTextureImage from '../../assets/textures/graves/StoneBricksBeige015_Flat.jpg';
import graveNormalTextureImage from '../../assets/textures/graves/StoneBricksBeige015_NRM_1K.jpg';
import graveAmbientOcclusionTextureImage from '../../assets/textures/graves/StoneBricksBeige015_AO_1K.jpg';

// Fonts
import typefaceFront from '../../assets/fonts/Cinzel ExtraBold_Regular.json';

// Styles
import styles from './index.module.scss';

// Components
import StaticContent from './static';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameters = {
  videoCount: 2,
};

const HauntedHouse = () => {
  let currentVideoCount = useRef(0);

  useEffect(() => {
    const gui = new GUI();
    gui.close();

    const textureLoader = new THREE.TextureLoader();
    // Load door textures
    const doorColorTexture = textureLoader.load(doorColorImage);
    const doorAlphaTexture = textureLoader.load(doorAlphaImage);
    const doorHeightTexture = textureLoader.load(doorHeightImage);
    const doorNormalTexture = textureLoader.load(doorNormalImage);
    const doorAmbientOcclusionTexture = textureLoader.load(
      doorAmbientOcclusionImage,
    );
    const doorMetalnessTexture = textureLoader.load(doorMetalnessImage);
    const doorRoughnessTexture = textureLoader.load(doorRoughnessImage);
    // Load brick textures
    const brickColorTexture = textureLoader.load(brickColorTextureImage);
    const brickNormalTexture = textureLoader.load(brickNormalTextureImage);
    const brickAmbientOcclusionTexture = textureLoader.load(
      brickAmbientOcclusionTextureImage,
    );
    const brickRoughnessTexture = textureLoader.load(
      brickRoughnessTextureImage,
    );
    // Load grass textures
    const grassColorTexture = textureLoader.load(grassColorTextureImage);
    const grassNormalTexture = textureLoader.load(grassNormalTextureImage);
    const grassAmbientOcclusionTexture = textureLoader.load(
      grassAmbientOcclusionTextureImage,
    );
    const grassRoughnessTexture = textureLoader.load(
      grassRoughnessTextureImage,
    );
    grassColorTexture.repeat.set(8, 8);
    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.repeat.set(8, 8);
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.repeat.set(8, 8);
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
    // Load grave textures
    const graveColorTexture = textureLoader.load(graveColorTextureImage);
    const graveNormalTexture = textureLoader.load(graveNormalTextureImage);
    const graveAmbientOcclusionTexture = textureLoader.load(
      graveAmbientOcclusionTextureImage,
    );

    const scene = new THREE.Scene();
    const house = new THREE.Group();
    const cameraGroup = new THREE.Group();
    scene.add(house);
    scene.add(cameraGroup);

    // Fog
    const fog = new THREE.Fog('#262837', 6, 15);
    scene.fog = fog;
    const fogGUI = gui.addFolder('Fog');
    fogGUI.addColor(fog, 'color');
    fogGUI.add(fog, 'near').min(1).max(10).step(0.01);
    fogGUI.add(fog, 'far').min(5).max(30).step(0.1);

    // Walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture,
      }),
    );
    walls.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
    );
    walls.position.y = walls.geometry.parameters.height / 2;
    house.add(walls);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({
        color: '#b35f45',
      }),
    );
    roof.position.y =
      walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    // Door
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2, 64, 64),
      new THREE.MeshStandardMaterial({
        transparent: true,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
      }),
    );
    door.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
    );
    door.position.z = 2 + 0.001;
    door.position.y = 1;
    house.add(door);

    // Bushes
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({
      color: '#89c854',
    });
    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);
    house.add(bush1, bush2, bush3, bush4);

    // Graveyards
    const graves = new THREE.Group();
    scene.add(graves);
    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2, 32, 32, 32);
    // const graveMaterial = new THREE.MeshStandardMaterial({
    //   color: '#b2b6b1',
    // });
    const graveCount = 50;
    for (let i = 0; i < graveCount; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(
        graveGeometry,
        new THREE.MeshStandardMaterial({
          // color: '#b2b6b1',
          map: graveColorTexture,
          normalMap: graveNormalTexture,
          aoMap: graveAmbientOcclusionTexture,
        }),
      );
      grave.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array, 2),
      );
      grave.position.x = x;
      grave.position.z = z;
      grave.position.y = 0.3;
      grave.rotation.x = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;
      grave.name = `grave${i + 1}`;
      graves.add(grave);
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
      }),
    );
    floor.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    // Lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
    moonLight.position.set(4, 5, -2);
    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
    scene.add(moonLight);

    // Door light
    const doorLight = new THREE.PointLight('#ff7d46', 1.5, 7);
    doorLight.position.set(0, 2.2, 2.2);
    house.add(doorLight);

    // Ghosts
    const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
    scene.add(ghost1);
    const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
    scene.add(ghost2);
    const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
    scene.add(ghost3);

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(1, 10, 17);
    camera.lookAt(house.position);
    scene.add(camera);
    cameraGroup.add(camera);

    const canvas = document.getElementById(
      'haunted-house',
    ) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor('#262837');

    // Raycaster
    const raycaster = new THREE.Raycaster();

    const cameraFocusPoint = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
      }),
    );
    cameraFocusPoint.position.z = 4;
    cameraFocusPoint.position.y = 2;
    cameraFocusPoint.position.x = 0;
    cameraFocusPoint.visible = false;
    scene.add(cameraFocusPoint);

    // Texts
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(typefaceFront);
    const textGeometry = new TextGeometry('HAUNTED HOUSE', {
      font,
      size: 0.55,
      height: 0.2,
      curveSegments: 64,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 64,
    });
    textGeometry.center();
    const titleFonts = new THREE.Mesh(
      textGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      }),
    );
    titleFonts.position.set(-2.62, 5, 5);
    titleFonts.rotation.y = 0.15;
    scene.add(titleFonts);

    const textSpotLight = new THREE.SpotLight(
      0xffffff,
      1,
      10,
      0.313,
      0.25,
      1.52,
    );
    textSpotLight.position.set(
      titleFonts.position.x / 2,
      titleFonts.position.y - 0.3,
      titleFonts.position.z + 1,
    );
    textSpotLight.target.position.y = titleFonts.position.y + 0.5;
    scene.add(textSpotLight);
    scene.add(textSpotLight.target);

    // Shadows
    renderer.shadowMap.enabled = true;
    moonLight.castShadow = true;
    doorLight.castShadow = true;
    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;

    walls.castShadow = true;
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    floor.receiveShadow = true;
    // Optimize shadows
    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;
    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;
    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;
    // Shadow map algorithm
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit controls
    // const orbitControls = new OrbitControls(camera, canvas);
    // orbitControls.enableDamping = true;
    // orbitControls.zoomSpeed = 0.2;
    // orbitControls.enableZoom = true;
    // orbitControls.dampingFactor = 0.02;
    // orbitControls.maxPolarAngle = Math.PI / 2.1;

    // Cursor
    const cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener('mousemove', (e: MouseEvent) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = e.clientY / sizes.height - 0.5;

      mouse.x = (e.clientX / sizes.width) * 2 - 1;
      mouse.y = -((e.clientY / sizes.height) * 2 - 1);
    });

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    });

    const listContainer = document.getElementById(
      'list-container',
    ) as HTMLDivElement;
    let lastScrollTop = listContainer.scrollTop;
    if (listContainer) {
      listContainer.addEventListener('scroll', (e: Event) => {
        lastScrollTop = listContainer.scrollTop;
      });
    }

    // Animation
    console.log(-Math.cos((lastScrollTop / sizes.height) * 0.7) * 3);
    const mouse = new THREE.Vector2();
    // Animations
    const clock = new THREE.Clock();
    let previousTime = 0;
    let currentIntersect: null | THREE.Intersection = null;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      // orbitControls.update();

      // Update ghosts
      const ghost1Angle = elapsedTime * 0.5;
      ghost1.position.x = Math.sin(ghost1Angle) * 4;
      ghost1.position.z = Math.cos(ghost1Angle) * 4;
      ghost1.position.y = Math.cos(elapsedTime * 3);

      const ghost2Angle = -elapsedTime * 0.32;
      ghost2.position.x = Math.sin(ghost2Angle) * 5;
      ghost2.position.z = Math.cos(ghost2Angle) * 5;
      ghost2.position.y =
        Math.cos(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

      const ghost3Angle = -elapsedTime * 0.18;
      ghost3.position.x =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
      ghost3.position.z =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost3.position.y =
        Math.cos(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

      // Animation spotlight
      textSpotLight.target.position.x = Math.sin(elapsedTime * 0.5) * 12 - 8;

      // Update camera
      camera.position.x =
        Math.sin(((lastScrollTop / sizes.height) * Math.PI) / 2) * 10;
      camera.position.z =
        Math.cos(((lastScrollTop / sizes.height) * Math.PI) / 2) * 10;
      camera.position.y = Math.abs(
        Math.cos(lastScrollTop / sizes.height) * 0.5 + 3,
      );
      // camera.lookAt(house.position);

      // Parallax
      const parallaxX = cursor.x;
      const parallaxY = -cursor.y;
      // cameraGroup.position.x = parallaxX;
      // cameraGroup.position.y = parallaxY;
      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * deltaTime * 15;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * deltaTime * 15;

      // ellipse curve
      cameraFocusPoint.position.x =
        1.5 *
          Math.sin((((lastScrollTop / sizes.height) * Math.PI) / 2) * 0.5) *
          2 -
        2;
      cameraFocusPoint.position.z =
        2 *
        Math.cos((((lastScrollTop / sizes.height) * Math.PI) / 2) * 0.5) *
        2;
      camera.lookAt(cameraFocusPoint.position);

      // Raycaster
      const rayCasterObjects = [...graves.children];
      const intersects = raycaster.intersectObjects(rayCasterObjects);
      for (const object of rayCasterObjects) {
        const obj = object as THREE.Mesh<
          THREE.SphereGeometry,
          THREE.MeshBasicMaterial
        >;
        obj.material.color.set('#b2b6b1');
      }

      if (intersects.length > 0) {
        const sphereObj = intersects[0].object as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.MeshBasicMaterial
        >;
        sphereObj.material.color.set('rgb(213,215,210)');
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

    const currentGraveWithVideo: Record<
      string,
      {
        obj: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
        videoEl: HTMLVideoElement;
        light: THREE.Light;
      }
    > = {};
    window.addEventListener('click', () => {
      if (currentIntersect) {
        console.log(currentGraveWithVideo);
        const currentObject = currentIntersect.object as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.MeshBasicMaterial
        >;
        if (currentVideoCount.current <= parameters.videoCount) {
          if (currentGraveWithVideo[currentObject.name]) {
            // Turn off
            // Video
            const videoPlane = currentGraveWithVideo[currentObject.name];
            const videoPlaneAnimation = [
              gsap.to(videoPlane.obj.position, {
                y: 0,
                duration: 1,
                ease: 'power2.outIn',
              }),
              gsap.to(videoPlane.obj.material, {
                opacity: 0,
                duration: 1,
              }),
            ];
            Promise.all(videoPlaneAnimation).then(() => {
              videoPlane.obj.geometry.dispose();
              videoPlane.obj.material.dispose();
              videoPlane.videoEl.pause();
              scene.remove(videoPlane.obj);
            });
            currentVideoCount.current -= 1;
            // remove light
            videoPlane.light.dispose();
            scene.remove(videoPlane.light);
            delete currentGraveWithVideo[currentObject.name];
          } else {
            // Turn on
            // Video
            const videoIndex = Math.random() > 0.5 ? 1 : 2;
            const video = document.getElementById(
              `video${videoIndex}`,
            ) as HTMLVideoElement;
            video.loop = true;
            const videoTexture = new THREE.VideoTexture(video);
            const videoPlaneWidth = 2;
            const videoPlaneHeight =
              (videoPlaneWidth * video.videoHeight) / video.videoWidth;
            const videoPlane = new THREE.Mesh(
              new THREE.PlaneGeometry(videoPlaneWidth, videoPlaneHeight),
              new THREE.MeshBasicMaterial({
                map: videoTexture,
                transparent: true,
              }),
            );

            videoPlane.position.set(
              currentObject.position.x,
              0,
              currentObject.position.z,
            );
            videoPlane.material.opacity = 0;
            scene.add(videoPlane);
            gsap.to(videoPlane.position, {
              y:
                currentObject.geometry.parameters.height +
                currentObject.position.y,
              duration: 1,
              ease: 'power2.outIn',
            });
            gsap.to(videoPlane.material, {
              opacity: 1,
              duration: 1,
            });
            video.play();
            currentVideoCount.current += 1;
            // Light
            const graveLight = new THREE.DirectionalLight(
              'rgba(232,200,79,0.7)',
              0.6,
            );
            graveLight.position.set(
              currentObject.position.x,
              -0.3,
              currentObject.position.z + 0.5,
            );
            graveLight.rotation.x = Math.PI * 0.88;
            scene.add(graveLight);

            currentGraveWithVideo[currentObject.name] = {
              obj: videoPlane,
              videoEl: video,
              light: graveLight,
            };
          }
        }
      }
    });
  });

  return (
    <>
      <StaticContent />
      <canvas id="haunted-house"></canvas>
      <video
        className={styles.video}
        id="video1"
        loop
        crossOrigin="anonymous"
        playsInline
      >
        <source
          src="https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/assets/videos/video1.mp4"
          type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        />
      </video>
      <video
        className={styles.video}
        id="video2"
        loop
        crossOrigin="anonymous"
        playsInline
      >
        <source
          src="https://personal-1301369739.cos.ap-guangzhou.myqcloud.com/threejs/assets/videos/video2.mp4"
          type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        />
      </video>
    </>
  );
};

export default HauntedHouse;
