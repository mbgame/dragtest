import React from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react"; // No need to import separately
import { useSpring, a } from "@react-spring/three";
import styles from "../styles/Home.module.css";
import * as THREE from 'three';
import { Box } from "@react-three/drei";


function Obj() {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const frontTexture = useLoader(THREE.TextureLoader, `/textures/eagle.jpg`);

  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }));

  const bind = 
    useDrag(({ movement: [x, y], down, event }) => {
      if (event.type.includes('touch')) {
        event.stopPropagation(); 
        event.preventDefault();
      }
      set({
        config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
        position: down ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
      });
    },
    // Enable touch events:
    { eventOptions: { passive: false },eventType: 'all', } 
  );

  return (
    <a.mesh {...spring} {...bind()} castShadow>
      <Box args={[1.5, 2, 0.01]}>
        <meshBasicMaterial
          map={frontTexture}
          side={THREE.FrontSide}
        />
      </Box>
    </a.mesh>
  );
}

const Home = () => {
  return (
    <div className={styles.container}> 
      <Canvas shadows camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.6}
          position={[20, 10, 10]}
          angle={0.15}
          penumbra={1}
          shadow-mapSize={[2048, 2048]}
          castShadow
        />
        <mesh receiveShadow position={[0, 0, -1]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#303040" />
        </mesh>
        <Obj />
      </Canvas>
    </div>
  );
};

export default Home;