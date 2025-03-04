import { useRef, useMemo, useState, useEffect } from 'react'
import './App.css'
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
import { Sphere } from '@react-three/drei';
import { useDrag } from "@use-gesture/react";
import { Html } from '@react-three/drei';
import Lottie from 'lottie-react';
import animationData from './assets/pulse.json';

const WorldGlobe = ({ position, args, haloOcculders=[] }) => {
  
    const texture = useMemo(() => new THREE.TextureLoader().load("/map.jpg"), []);
    const globeRef = useRef();
    const sphereRef = useRef();
    const groupRef = useState();
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
      <group ref={groupRef}>
        <Html {...bind()} portal={document.getElementById('back-layer')} zIndexRange={[0, 5]} occlude={haloOcculders} transform>
          <div style={{width: '296px', height: '296px', boxShadow: '0 0 50px #c430ffbb', borderRadius: '50%'}}></div>
        </Html>
        <group ref={globeRef} {...bind()}>
          <Sphere ref={sphereRef} args={args} position={position}>
            <meshStandardMaterial map={texture} />
          </Sphere>
          {/* Radio Waves at Specific Locations */}
          {radioWaveCoords.map((coord, index) => (
            <RadioWave occluders={[sphereRef]} key={index} position={latLngToCartesian(coord.lat, coord.lng, args[0])} rotation={computeRotation(coord.lat, coord.lng)} />
          ))}
        </group>
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

function RadioWave({position, rotation, occluders}) {
    return (
      <Html portal={document.getElementById('back-layer')}  position={position} rotation={rotation} transform occlude={occluders}>
        <div style={{ position: 'relative', width: '55px', height: '55px' }}>
          <Lottie style={{position: 'absolute', transform: 'translateY(-50%)', top: '50%'}} animationData={animationData} loop={true} />
        </div>
      </Html>
    );
}

export default WorldGlobe;