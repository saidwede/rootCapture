import * as THREE from 'three';
import { useTexture, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from "react";


const Taskbar = ({onClose, onMaximize, onMinimize, onOpen, text, delay}) => {
    const minimizeTexture = useTexture( "/img/minimize-sign.png"); // Replace with your image path
    const maximizeTexture = useTexture( "/img/maximize.png"); // Replace with your image path
    const closeTexture = useTexture( "/img/close.png"); // Replace with your image path
    minimizeTexture.wrapS = THREE.RepeatWrapping;
    minimizeTexture.wrapT = THREE.RepeatWrapping;
    minimizeTexture.repeat.set(1, 1); // Adjust as needed
  
    const [blinks, setBlinks] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [timer, setTimer] = useState(0);
    const maxBlinks = 4; // Number of blinks
    const blinkSpeed = 0.05; // Speed of fading

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
  
    useFrame(() => {
        if(visible){
            if (blinks < maxBlinks) {
                if (timer < 30 * blinkSpeed && timer > 0){
                    setOpacity(0.1);
                }else{
                    setOpacity(0.2);
                    setBlinks((prev) => prev + 1);
                }
                setTimer((prev) => {
                    if(prev >= 60 * blinkSpeed){
                        return 0;
                    }else{
                        return prev+1;
                    }
                });
            }else{
                setOpacity(1);
            }
        }
    });
    return (
        <group>
            <mesh position={[0, 2.5, 0]}> {/* Taskbar */}
                <boxGeometry args={[4.15, 0.4, 0.01]} /> 
                <meshStandardMaterial transparent opacity={opacity} color="#004d69" />
            </mesh>

            {/* Close Button */}
            <group 
                onClick={onClose}
                onPointerOver={(e) => {
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    document.body.style.cursor = 'auto';
                }}
                position={[0.1, 0, 0]}
            >
                <mesh position={[1.75, 2.5, 0.01]}> 
                    <planeGeometry args={[0.24, 0.28]} />
                    <meshStandardMaterial transparent opacity={opacity} color="#19dcdb" side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[1.75, 2.5, 0.02]}> 
                    <planeGeometry args={[0.18, 0.18]} />
                    <meshStandardMaterial transparent opacity={opacity} color="#19dcdb" map={closeTexture} side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Maximize Button */}
            <group 
                onClick={onMaximize}
                onPointerOver={(e) => {
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    document.body.style.cursor = 'auto';
                }}
                position={[0.21, 0, 0]}
            >
                <mesh position={[1.31, 2.5, 0.01]}> 
                    <planeGeometry args={[0.26, 0.28]} />
                    <meshStandardMaterial transparent opacity={opacity} color="#19dcdb" side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[1.31, 2.5, 0.02]}> {/* Maximize Button */}
                    <planeGeometry args={[0.20, 0.20]} />
                    <meshStandardMaterial transparent opacity={opacity} map={maximizeTexture}/>
                </mesh>
            </group>
            
            
            {/* Minimize Button */}
            <group 
                onClick={onMinimize}
                onPointerOver={(e) => {
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    document.body.style.cursor = 'auto';
                }}
                position={[0.3, 0, 0]}
            >
                <mesh position={[0.87, 2.5, 0.01]}> 
                    <planeGeometry args={[0.26, 0.28]} />
                    <meshStandardMaterial transparent opacity={opacity} color="#19dcdb" side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[0.87, 2.5, 0.02]}>
                    <planeGeometry args={[0.18, 0.18]} />
                    <meshStandardMaterial transparent opacity={opacity} map={minimizeTexture} />
                </mesh>
            </group>

            {/* User Activity Text */}
            <group position={[0.15, 0, 0]}
                onPointerOver={(e) => {
                    document.body.style.cursor = 'pointer';
                }}
                onClick={onOpen}
            >
                <mesh position={[-1.24, 2.5, 0.01]}>
                    <planeGeometry args={[1.8, 0.28]} />
                    <meshStandardMaterial transparent opacity={opacity} color="#19dcdb"/>
                </mesh>
                <Text
                    font='/fonts/Rajdhani-SemiBold.ttf'
                    fontSize={0.23}
                    backgroundColor="white"
                    position={[-1.23, 2.5, 0.02]}
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                    <meshPhysicalMaterial
                        color="white"
                        metalness={1}
                        roughness={0.2}
                        clearcoat={1}
                        clearcoatRoughness={0.2}
                        reflectivity={1} transparent opacity={opacity}
                    />
                </Text>
            </group>
        </group>
    )
}

export default Taskbar;