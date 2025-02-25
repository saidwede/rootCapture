import { useRef, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber';
import RingChartGroup from './RingChartGroup';
import * as THREE from "three";
import { OrbitControls, Sphere, Line } from '@react-three/drei';

const WorldGlobe = ({ position, args }) => {
    const texture = useMemo(() => new THREE.TextureLoader().load("/map.jpg"), []);
    const globeRef = useRef();
    useFrame(() => {
        if (globeRef.current) {
          globeRef.current.rotation.y += 0.005; // Rotate slowly on Y-axis
        }
    });
    return (
      <Sphere args={args} position={position} ref={globeRef}>
        <meshStandardMaterial map={texture} />
      </Sphere>
    );
};

function Circle({ radius = 2, segments = 500, color = "blue", opacity = 1 }) {
    // Create a path for the circle
    const path = new THREE.Path();
    path.absarc(0, 0, radius, 0, Math.PI * 2, false); // Full circle
  
    // Get points from the path
    const points = path.getPoints(segments);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
    return <Line transparent opacity={opacity} points={points} color={color} lineWidth={2} geometry={geometry} />;
}

function App() {

    const userActivityData = [
        { progress: 0.1, color: '#B01A27', text: 'CSS', shift: 0.2},
        { progress: 0.35, color: '#59A9A5', text: 'JSX', textColor: '#000000'},
        { progress: 0.1, color: '#1657AC', text: 'HTML', shift: 0.2},
        { progress: 0.2, color: '#9C31C6', text: 'CSS'},
        { progress: 0.25, color: '#B77417', text: 'HTML', textColor: '#000000',},
        
        
    ];
    const totalUserData = [
        { progress: 0.6, color: '#8a2be2', text: 'JSX'},
        { progress: 0.4, color: '#404040', text: 'CSS'}
    ]
    // Adding bg color 
    return (
        <Router>
            {/* <TopNavbar /> */}
            <Canvas
                orthographic
                camera={{
                    position: [0, 0, 5],
                    fov: 45,
                    near: 0,
                    //aspect: window.innerWidth / window.innerHeight,
                    far: 1000,
                    zoom: 75
                }}
            >

                <directionalLight position={[3, 6, 3]} intensity={3} castShadow />
                <ambientLight intensity={5} />
                <group position={[0, 0, -4.97]} rotation={[0, 0, 0]}>
                    <WorldGlobe args={[4.5, 44, 44]} />
                    <Circle radius={4.7} color="#bb8fdb" opacity={0.04} />
                    <Circle radius={5} color="#bb8fdb" opacity={0.04} />
                    <Circle radius={5.3} color="#bb8fdb" opacity={0.04} />
                    <Circle radius={5.6} color="#bb8fdb" opacity={0.04} />
                    <Circle radius={5.9} color="#ffffff" opacity={0.03} />
                    <Circle radius={6.2} color="#ffffff" opacity={0.02} />
                    <Circle radius={6.5} color="#ffffff" opacity={0.01} />
                </group>
                <RingChartGroup 
                    position={[-5.5,2,0]}
                    title='USER ACTIVITY'
                    segmentData={userActivityData}
                    radius={1.4}
                    innerRadius={0.6}
                    thickness={0.4}
                    gap={0.05}
                    inclinaison={Math.PI/25}
                />
                <RingChartGroup 
                    position={[5.5,2,0]}
                    title='TOTAL USER' 
                    segmentData={totalUserData}
                    radius={1.6}
                    innerRadius={1.1}
                    inclinaison={-Math.PI/10}
                />
                <RingChartGroup 
                    position={[-5.5,-4.5,0]}
                    title='ACTIVE SESSIONS' 
                    segmentData={userActivityData}
                    radius={1.4}
                    innerRadius={0.6}
                    thickness={0.4}
                    gap={0.05}
                    inclinaison={Math.PI/4}
                />


                {/* Optional: Add controls if you want to interact with the scene */}
                {/* <OrbitControls /> */}

            </Canvas>
        </Router>
    )
}

export default App
