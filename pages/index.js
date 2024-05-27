import React,{useRef, useState} from "react";
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
  const meshRef = useRef();
  const [isCardEnlarged,setIsCardEnlarged] = useState(false)
  const [spring, api] = useSpring(() => ({
    position:[0,0,0],
    rotation:[0,0,0],
    scale:[1,1,1],
    config: { mass: 2, tension: 400, friction: 40 }, // Adjust spring values as needed
  }));

  const bind = 
    useDrag(({ movement: [x, y], down, event }) => {
      if(!isCardEnlarged){
        if (event.type.includes('touch')) {
          event.stopPropagation(); 
          event.preventDefault();
        }
        api.start({
          config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
          position: down ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
        });
      }
    },
    // Enable touch events:
    { eventOptions: { passive: false },eventType: 'all', } 
  );

/////////////////////
const updateCardTransform = (newPosition, newRotation, newScale) => {
  api.start({
    position: newPosition ,
    rotation: newRotation ,
    scale: newScale ,
    config: { mass: 0.5, tension: 300, friction: 20 },
  });
};

//click on a card for make it large
const handleCardClick = (event) => {
  event.stopPropagation()
  setIsCardEnlarged(!isCardEnlarged);

  const targetPosition = isCardEnlarged ? [0,0,0] : [0, 0, -1];
  const targetRotation = isCardEnlarged ? [0,0,0] : [0, Math.PI, 0];
  const targetScale = isCardEnlarged ? [1,1,1] : [2, 2, 2];

  // setDragPosition(position)
  updateCardTransform(targetPosition, targetRotation, targetScale);
};

  return (
    <a.mesh 
    {...spring} 
    {...bind()} 
    castShadow
    ref={meshRef}
    // name={id}
    onClick={handleCardClick}
    >
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
        />
        <Obj />
      </Canvas>
    </div>
  );
};

export default Home;