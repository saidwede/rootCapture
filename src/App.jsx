import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import { Canvas, useThree } from '@react-three/fiber';
import RingChartGroup from './RingChartGroup';
import WorldGlobe from './WorldGlobe';
import Background from './Background';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { OrthographicCamera} from "@react-three/drei";
import { useMemo } from "react";

function ResponsiveScene() {
  const { viewport } = useThree(); // Get viewport size
  const scaleFactor = Math.min(viewport.width, viewport.height) * 0.07; // Scale everything proportionally

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
    const chartGroupRef = useRef()

  return (
    <group scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <directionalLight position={[3, 6, 3]} intensity={3} castShadow />
                <ambientLight intensity={5} />
                <group position={[0, -0.1, -6.97]} rotation={[0, 0, 0]}>
                    <WorldGlobe args={[3.7, 44, 44]} />
                </group>
                <group ref={chartGroupRef} >
                    <RingChartGroup 
                        position={[-5.5,2.3,0]}
                        title='USER ACTIVITY'
                        segmentData={userActivityData}
                        radius={1.4}
                        innerRadius={0.6}
                        thickness={0.4}
                        gap={0.05}
                        inclinaison={Math.PI/25}
                        delay={500}
                    />
                    <RingChartGroup 
                        position={[5.5,2.3,0]}
                        title='TOTAL USER' 
                        segmentData={totalUserData}
                        radius={1.6}
                        innerRadius={1.1}
                        inclinaison={-Math.PI/10}
                        delay={1200}
                        text='72%'
                    />
                    <RingChartGroup 
                        position={[-5.5,-3.8,0]}
                        title='ACTIVE SESSIONS' 
                        segmentData={userActivityData}
                        radius={1.4}
                        innerRadius={0.6}
                        thickness={0.4}
                        gap={0.05}
                        inclinaison={Math.PI/4}
                        delay={2200}
                    />
                </group>
    </group>
  );
}




function App() {
    // Adding bg color 
    return (
        <Router>
            <Background />
            <Canvas
                orthographic
                camera={{
                    position: [0, 0, 20],
                    //fov: 45,
                    //near: 0,
                    //far: 1000,
                    zoom: 200
                }}
                // aspect= {window.innerWidth / window.innerHeight}
            >

                <ResponsiveScene />
                {/* Optional: Add controls if you want to interact with the scene */}
                <OrbitControls />
            </Canvas>
        </Router>
    )
}

export default App
