import GUI from "lil-gui";
import { useEffect } from "react";
import * as THREE from "three";
import styles from "./index.module.css";
import gsap from "gsap";

// Textures
import gradientTextureImage from "../../assets/textures/gradients/3.jpg";
import particleTextureImage from "../../assets/textures/particles/2.png";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
gui.close();

const parameter = {
  materialColor: 0xffeded,
};

const ScrollBasedAnimation = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 6;
    cameraGroup.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(gradientTextureImage);
    const particleTexture = textureLoader.load(particleTextureImage);
    gradientTexture.magFilter = THREE.NearestFilter;

    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameter.materialColor,
      gradientMap: gradientTexture,
    });
    // Objects
    const objectsDistance = 4;
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      new THREE.MeshToonMaterial({
        color: 0xaa6939,
        gradientMap: gradientTexture,
      })
    );
    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      new THREE.MeshToonMaterial({
        color: 0xaa9539,
        gradientMap: gradientTexture,
      })
    );
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      new THREE.MeshToonMaterial({
        color: 0x3e3175,
        gradientMap: gradientTexture,
      })
    );

    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;
    mesh1.position.x = -2;
    mesh2.position.x = 2;
    mesh3.position.x = -2;

    scene.add(mesh1, mesh2, mesh3);
    const sectionMeshes = [mesh1, mesh2, mesh3];

    // Particles
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; ++i) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] =
        objectsDistance / 2 -
        Math.random() * objectsDistance * sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      // color: parameter.materialColor,
      sizeAttenuation: true,
      size: 0.5,
      alphaMap: particleTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const canvas = document.getElementById(
      "scroll-animation"
    ) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = false;
    // Shadow map algorithm
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit controls
    // const orbitControls = new OrbitControls(camera, canvas);
    // orbitControls.enableDamping = true;
    // orbitControls.zoomSpeed = 0.5;

    // Scroll
    let scrollY = window.scrollY;
    let currentSection = 0;
    window.addEventListener("scroll", (e: Event) => {
      scrollY = window.scrollY;
      const newSection = Math.round(scrollY / sizes.height);
      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: "power2.inOut",
          x: "+=6",
          y: "+=3",
          z: "+=1.5",
        });
      }
    });

    // Parallax
    const cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener("mousemove", (e: MouseEvent) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = e.clientY / sizes.height - 0.5;
    });

    const clock = new THREE.Clock();
    let previousTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      window.requestAnimationFrame(tick);

      // Animate meshes
      sectionMeshes.forEach((mesh) => {
        // mesh.rotation.x = elapsedTime * 0.1;
        // mesh.rotation.y = elapsedTime * 0.12;
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
      });

      // Animate camera
      camera.position.y = (-scrollY / sizes.height) * objectsDistance;
      const parallaxX = cursor.x;
      const parallaxY = -cursor.y;
      // cameraGroup.position.x = parallaxX;
      // cameraGroup.position.y = parallaxY;
      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * deltaTime * 5;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * deltaTime * 5;

      // Animate particles
      particles.rotation.y += (parallaxX - particles.rotation.y) * deltaTime;
      particles.rotation.x +=
        (parallaxY - particles.rotation.x) * deltaTime * 3;

      renderer.render(scene, camera);
      // orbitControls.update();
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
    gui.addColor(parameter, "materialColor").onChange(() => {
      material.color.set(parameter.materialColor);
      particlesMaterial.color.set(parameter.materialColor);
    });
  });

  return (
    <>
      <section className={`${styles.section} ${styles.right}`}>
        <h1>My Portfolio</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </section>
      <section className={`${styles.section} ${styles.left}`}>
        <h1>My projects</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </section>
      <section className={`${styles.section} ${styles.right}`}>
        <h1>Contact me</h1>
        <p>
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </section>
      <canvas
        id="scroll-animation"
        className={styles["scroll-animation"]}
      ></canvas>
    </>
  );
};

export default ScrollBasedAnimation;
