import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import { Canvas, useThree } from '@react-three/fiber';
import RingChartGroup from './RingChartGroup';
import WorldGlobe from './WorldGlobe';
import Background from './Background';
import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { OrthographicCamera} from "@react-three/drei";
import { useMemo } from "react";

function ResponsiveScene() {
  const { viewport } = useThree(); // Get viewport size
  const scaleFactor = Math.min(viewport.width, viewport.height) * 0.083; // Scale everything proportionally

  const userActivityData = [
    { progress: 0.1, color: '#B01A27', text: 'CSS', shift: 0.2},
    { progress: 0.35, color: '#59A9A5', text: 'JSX', textColor: '#000000'},
    { progress: 0.1, color: '#1657AC', text: 'HTML', shift: 0.2},
    { progress: 0.2, color: '#9C31C6', text: 'CSS'},
    { progress: 0.25, color: '#B77417', text: 'HTML', textColor: '#000000',},
        
        
    ];
    const [usersData, setUsersData] = useState([]);
    const [coordinates, setCoordinates] = useState([])
    const colors = [
        { color: '#B01A27', textColor: '#ffffff'},
        { color: '#59A9A5', textColor: '#000000'},
        { color: '#1657AC', textColor: '#ffffff'},
        { color: '#9C31C6', textColor: '#ffffff'},
        { color: '#B77417', textColor: '#000000'},
        { color: '#8a2be2', textColor: '#ffffff'},
        { color: '#404040', textColor: '#ffffff'}
    ]
    const chartGroupRef = useRef()

    useEffect(() => {
        const rootDiv = document.getElementById("chart-root");
    
        if (!rootDiv) {
          console.warn("chart-root div not found");
          return;
        }
    
        const data = rootDiv.getAttribute("data-json");
        if (!data) {
          console.warn("data-json attribute not found");
          return;
        }
    console.log(data);
        try {
          const jsonData = JSON.parse(data);
    
          if (!jsonData.users || !Array.isArray(jsonData.users)) {
            console.warn("Invalid users data");
            return;
          }
    
          let totalUser = jsonData.users.reduce((sum, user) => sum + user.user_count, 0);
    
          let totalUserData = jsonData.users.map((element, index) => ({
            progress: (element.user_count / totalUser) * 100,
            text: element.role_name,
            color: colors[index % colors.length]?.color || "#000",
            textColor: colors[index % colors.length]?.textColor || "#fff"
        }));
        
        // Step 1: Floor values and calculate total floored sum
        let floored = totalUserData.map(item => Math.floor(item.progress));
        let remainder = 100 - floored.reduce((sum, val) => sum + val, 0);
        
        // Step 2: Sort by largest remainder and distribute the remainder
        let remainders = totalUserData.map((item, index) => ({
            index,
            remainder: item.progress - floored[index]
        }));
        remainders.sort((a, b) => b.remainder - a.remainder);
        
        // Step 3: Distribute the remaining points
        for (let i = 0; i < remainder; i++) {
            floored[remainders[i].index]++;
        }
        
        // Step 4: Convert back to decimal values
        totalUserData = totalUserData.map((item, index) => ({
            ...item,
            progress: floored[index] / 100 // Ensure 2 decimal places
        }));
    
          setUsersData(totalUserData);
          setCoordinates(jsonData.coordinates);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }, []);

  return (
    <group scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <directionalLight position={[3, 6, 3]} intensity={3} castShadow />
                <ambientLight intensity={5} />
                <group position={[0, 0.1, -6.97]} rotation={[0, 0, 0]}>
                    <WorldGlobe args={[3.9, 44, 44]} coordinates={coordinates} />
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
                        segmentData={usersData}
                        radius={1.6}
                        innerRadius={1.1}
                        inclinaison={-Math.PI/10}
                        delay={1200}
                        text='72%'
                    />
                    <RingChartGroup 
                        position={[-5.5,-3.6,0]}
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
            <div id='back-layer'></div>
            <div id='canvas-container'>
                <Canvas
                    orthographic
                    camera={{
                        position: [0, 0, 20],
                        //fov: 45,
                        //near: 0,
                        //far: 1000,
                        zoom: 200
                    }}
                >
                    <ResponsiveScene />
                    {/* Optional: Add controls if you want to interact with the scene */}
                    {/* <OrbitControls /> */}
                </Canvas>
            </div>
        </Router>
    )
}

export default App
