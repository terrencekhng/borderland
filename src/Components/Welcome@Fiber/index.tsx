import {Canvas, useThree} from '@react-three/fiber';
import {useEffect} from "react";
import * as THREE from 'three';

import styles from "../Welcome/index.module.css";

const Cube1 = (prop: JSX.IntrinsicElements['mesh']) => {
  return (
    <mesh
      {...prop}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  )
}

const WelcomeFiber = () => {
  return (
    <section className={styles.container}>
      <Canvas>
        <Cube1 />
      </Canvas>
    </section>
  )
}

export default WelcomeFiber;
