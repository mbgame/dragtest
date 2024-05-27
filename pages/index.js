import React,{useRef, useState} from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react"; // No need to import separately
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

  // const bind =  useDrag(({ movement: [x, y], down, event }) => {
  //     if(!isCardEnlarged){
  //       if (event.type.includes('touch')) {
  //         event.stopPropagation(); 
  //         event.preventDefault();
  //       }
  //       api.start({
  //         config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
  //         position: down ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
  //       });
  //     }
  //   },
  //   // Enable touch events:
  //   { eventOptions: { passive: false },eventType: 'all', } 
  // );

  const bind = useGesture(
    {
      onDrag: ({ offset: [x,y], event, down, first }) => {
        if (!isCardEnlarged) { 

          const newPosition = [
            -1 + x / viewport.factor * 1.5,
            1 + 0.2 - y / viewport.factor * 1.5,
            0,
          ];
            api.start({
              position:  newPosition ,
              rotation: [0, 0, 0],
              config: { mass: 0.1, tension: 100, friction: 20 },
            });
        }
       
      },
      onDragEnd: ({ offset: [x,y], event }) => {
        event.stopPropagation(); // Prevent default touch behavior
        if(!isCardEnlarged ){
          const newPosition = [
            -1 + x / viewport.factor * 1.5,
            1 + 0.2 - y / viewport.factor * 1.5,
            0,
          ];

          // const dir =  swipeFinder(newPosition)
          // handleSwipe(dir);
        }
      },
    },
    { drag: { filterTaps: true, threshold: 10,
      // bounds: { top: -300, bottom: 100 },
      from:()=>{
      // if(dragPosition[1] === position[1]){
        return [0,0]
      // }
      // else{
      //   return [mousePos[0],mousePos[1]]
      // }
      
    }
    
    } } // Adjust threshold for better touch sensitivity
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