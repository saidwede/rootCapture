import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import { Canvas } from '@react-three/fiber';
import RingChartGroup from './RingChartGroup';
import WorldGlobe from './WorldGlobe';






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
                <group position={[0, -0.1, -6.97]} rotation={[0, 0, 0]}>
                    <WorldGlobe args={[3.7, 44, 44]} />
                </group>
                <RingChartGroup 
                    position={[-5.5,3,0]}
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
                    position={[5.5,3,0]}
                    title='TOTAL USER' 
                    segmentData={totalUserData}
                    radius={1.6}
                    innerRadius={1.1}
                    inclinaison={-Math.PI/10}
                    delay={1200}
                />
                <RingChartGroup 
                    position={[-5.5,-3.5,0]}
                    title='ACTIVE SESSIONS' 
                    segmentData={userActivityData}
                    radius={1.4}
                    innerRadius={0.6}
                    thickness={0.4}
                    gap={0.05}
                    inclinaison={Math.PI/4}
                    delay={2200}
                />
                {/* Optional: Add controls if you want to interact with the scene */}
                {/* <OrbitControls /> */}
            </Canvas>
        </Router>
    )
}

export default App
