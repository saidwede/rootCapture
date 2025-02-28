import { useRef, useMemo, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber';
import RingChartGroup from './RingChartGroup';
import * as THREE from "three";
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { useDrag } from "@use-gesture/react";

const WorldGlobe = ({ position, args }) => {
  
    const texture = useMemo(() => new THREE.TextureLoader().load("/map.jpg"), []);
    const globeRef = useRef();
    const [isDragging, setIsDragging] = useState(false);
    
    useFrame(() => {
        if (globeRef.current && !isDragging) {
          globeRef.current.rotation.y += 0.005; // Rotate slowly on Y-axis
        }
    });

    const bind = useDrag(({ movement: [x], down }) => {
      //setIsDragging(down);
      if (globeRef.current) {
        globeRef.current.rotation.y += x * 0.0002;
      }
    });

    useEffect(() => {
      const handleScroll = (event) => {
        if (globeRef.current) {
          globeRef.current.rotation.y += event.deltaY * 0.001;
        }
      };
  
      window.addEventListener("wheel", handleScroll);
      return () => window.removeEventListener("wheel", handleScroll);
    }, []);

    const radioWaveCoords = [
      { lat: 6.367, lng: 2.433 }, // Cotonou, Benin
      { lat: 37.7749, lng: -122.4194 }, // San Francisco
      { lat: 51.5074, lng: -0.1278 }, // London
      { lat: 35.6895, lng: 139.6917 }, // Tokyo
    ];

    return (
      <group>
        <group ref={globeRef} {...bind()}>
          <Sphere args={args} position={position}>
            <meshStandardMaterial map={texture} />
          </Sphere>
          {/* Radio Waves at Specific Locations */}
          {radioWaveCoords.map((coord, index) => (
            <RadioWave key={index} position={latLngToCartesian(coord.lat, coord.lng, args[0])} rotation={computeRotation(coord.lat, coord.lng)} />
          ))}
        </group>
        {/* <Circle radius={3.85} color="#bb8fdb" opacity={0.04} />
        <Circle radius={4.15} color="#bb8fdb" opacity={0.04} />
        <Circle radius={4.45} color="#bb8fdb" opacity={0.04} />
        <Circle radius={4.75} color="#bb8fdb" opacity={0.04} />
        <Circle radius={5.05} color="#ffffff" opacity={0.03} />
        <Circle radius={5.35} color="#ffffff" opacity={0.02} />
        <Circle radius={5.65} color="#ffffff" opacity={0.01} /> */}
      </group>
    );
};

function latLngToCartesian(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}
function computeRotation(lat, lng) {
  const normal = new THREE.Vector3(...latLngToCartesian(lat, lng, 1)).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  
  // Compute tangent and bitangent to align the ring
  const tangent = new THREE.Vector3().crossVectors(up, normal).normalize();
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();

  // Create a rotation matrix
  const matrix = new THREE.Matrix4().makeBasis(tangent, bitangent, normal);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return [euler.x, euler.y, euler.z];
}

function Circle({ radius = 2, segments = 500, color = "blue", opacity = 1 }) {
    // Create a path for the circle
    const path = new THREE.Path();
    path.absarc(0, 0, radius, 0, Math.PI * 2, false); // Full circle
  
    // Get points from the path
    const points = path.getPoints(segments);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
    return <Line transparent opacity={opacity} points={points} color={color} lineWidth={2} geometry={geometry} />;
}

function RadioWave({position, args=[0.75, 1, 64], rotation}) {
    const wavesRef = useRef([]);
    const [waves, setWaves] = useState([]);
  
    useFrame(({ clock }) => {
      const time = clock.elapsedTime;
  
      // Add a new wave every second
      if (waves.length === 0 || time - waves[waves.length - 1].start > 1) {
        setWaves([...waves, { start: time, scale: 0.1, opacity: 1 }]);
      }
  
      // Update waves
      setWaves((waves) =>
        waves
          .map((wave) => ({
            ...wave,
            scale: wave.scale + 0.01,
            opacity: Math.max(wave.opacity - 0.02, 0),
          }))
          .filter((wave) => wave.opacity > 0) // Remove fully faded waves
      );
    });
  
    return (
      <group position={position} rotation={rotation}>
        {waves.map((wave, index) => (
          <group key={index}>
            <mesh scale={[wave.scale, wave.scale, 1]}>
             <ringGeometry args={args} /> 
              <meshBasicMaterial color="#13ba5b" transparent opacity={wave.opacity} side={2} />
            </mesh>
            <mesh scale={[1.2*wave.scale, 1.2*wave.scale, 1]}>
             <ringGeometry args={[2*args[1] - 0.05, 2*args[1], 2*args[2]]} /> 
              <meshBasicMaterial color="#13ba5b" transparent opacity={wave.opacity - 0.5} side={2} />
            </mesh>
          </group>
        ))}
      </group>
    );
}

export default WorldGlobe;