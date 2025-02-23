import { useState, useRef, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import MultipleScene from './TorusMultipleObject';
import RingChartObject from './TorusObject';
import Taskbar from './taskbar';
import TopNavbar from './Navbar';
import RingChartGroup from './RingChartGroup';
import * as THREE from "three";
import { OrbitControls, Sphere } from '@react-three/drei';

const WorldGlobe = ({ position, args }) => {
    const texture = useMemo(() => new THREE.TextureLoader().load("/earthmap.jpg"), []);
    return (
      <Sphere args={args} position={position}>
        <meshStandardMaterial map={texture} />
      </Sphere>
    );
};

function App() {

    const userActivityData = [
        { progress: 0.25, color: '#59A9A5', text: 'JSX'},
        { progress: 0.1, color: '#B01A27', text: 'CSS'},
        { progress: 0.35, color: '#B77417', text: 'HTML'},
        { progress: 0.2, color: '#9C31C6', text: 'CSS'},
        { progress: 0.1, color: '#1657AC', text: 'HTML'},
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
                    position: [0, 4, 5],
                    fov: 45,
                    near: 0,
                    //aspect: window.innerWidth / window.innerHeight,
                    far: 1000,
                    zoom: 70
                }}
            >

                <directionalLight position={[3, 3, 3]} intensity={1} castShadow />
                <ambientLight intensity={0.1} />
                <WorldGlobe args={[4.5, 44, 44]} position={[0, -4.95, -4.97]} />
                <RingChartGroup 
                    position={[-5.5,3.5,0]}
                    title='USER ACTIVITY'
                    segmentData={userActivityData}
                    radius={1.2}
                />
                <RingChartGroup 
                    position={[5.5,3.5,0]}
                    title='TOTAL USER' 
                    segmentData={totalUserData}
                    radius={1.4}
                />
                <RingChartGroup 
                    position={[-5.5,-4.5,0]}
                    title='ACTIVE SESSIONS' 
                />


                {/* Optional: Add controls if you want to interact with the scene */}
                <OrbitControls />
                

            </Canvas>
        </Router>
    )
}

export default App
