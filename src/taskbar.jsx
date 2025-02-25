import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Html, useTexture, Text, Text3D } from "@react-three/drei";
const Taskbar = ({onClose, onMaximize, onMinimize, onOpen, text}) => {
    const minimizeTexture = useTexture( "/minimize-sign.png"); // Replace with your image path
    const maximizeTexture = useTexture( "/maximize.png"); // Replace with your image path
    const closeTexture = useTexture( "/close.png"); // Replace with your image path
    minimizeTexture.wrapS = THREE.RepeatWrapping;
    minimizeTexture.wrapT = THREE.RepeatWrapping;
    minimizeTexture.repeat.set(1, 1); // Adjust as needed
  
    return (
        <group>
            <mesh position={[0, 2.5, 0]}> {/* Taskbar */}
                <boxGeometry args={[4.15, 0.4, 0.01]} /> 
                <meshStandardMaterial color="#004d69" transparent={true} />
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
                    <meshStandardMaterial color="#19dcdb" transparent={true} side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[1.75, 2.5, 0.02]}> 
                    <planeGeometry args={[0.18, 0.18]} />
                    <meshStandardMaterial color="#19dcdb" map={closeTexture} transparent={true} side={THREE.DoubleSide} />
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
                    <meshStandardMaterial color="#19dcdb" transparent={true} side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[1.31, 2.5, 0.02]}> {/* Maximize Button */}
                    <planeGeometry args={[0.20, 0.20]} />
                    <meshStandardMaterial map={maximizeTexture} transparent={true}/>
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
                    <meshStandardMaterial color="#19dcdb" transparent={true} side={THREE.DoubleSide} />
                </mesh>        
                <mesh position={[0.87, 2.5, 0.02]}>
                    <planeGeometry args={[0.18, 0.18]} />
                    <meshStandardMaterial map={minimizeTexture} transparent={true} />
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
                    <meshStandardMaterial color="#19dcdb" transparent={true} />
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
                        reflectivity={1}
                    />
                </Text>
            </group>
        </group>
    )
}

export default Taskbar;