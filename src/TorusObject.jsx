import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useState, useRef } from 'react';
import { OrbitControls, QuadraticBezierLine, Edges, Float, Text, RoundedBox} from '@react-three/drei'
import { useControls, button, useStoreContext, folder } from 'leva';
import MainCurvedLines from './curveline';

const RoundedRectangle = ({ position, color, width = 0.3, height = 1, radius = 0.1 }) => {
    const shape = new THREE.Shape();
  
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  
    return (
      <mesh position={position}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

const CurvedLine = ({ startPoint, angle, length = 0.5, color, progress, text }) => {
    const textAreaRef = useRef()

    const points = useMemo(() => {
        // Start point is where the line connects to the ring
        const start = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
        
        // End point is extended outward at an angle (on the same plane as ring)
        const end = new THREE.Vector3(
            startPoint.x + Math.cos(angle) * length * 1.5,
            startPoint.y + Math.sin(angle) * length * 1.5,
            startPoint.z
        );
    
        // Control point for the quadratic curve
        const control = new THREE.Vector3(
            startPoint.x + Math.cos(angle) * length * 0.8,
            startPoint.y + Math.sin(angle) * length * 0.8,
            startPoint.z + length * 0.5 // Lift only the control point for curve shape
        );

        return {
            start,
            end,
            control
        };
    }, [startPoint, angle, length]);
  
    return (
        <group rotation={[0,0,0]}>
            <QuadraticBezierLine
                start={points.start}
                end={points.end}
                control={points.control}
                color={color}
                lineWidth={2}
                dashed={false}
            />
            
            {/* Group mesh and text together */}
            <group position={points.end} rotation={[(1/4)*Math.PI , 0, (1/2)*Math.PI]} ref={textAreaRef}>
                {/* Mesh as parent */}
                {/* Adding a helper function to check axis */}
                {/* <mesh rotation = {[0, 0, 0]} position={[0.00, 0, 0.012]} >
                    <planeGeometry args={[0.20, 0.50]} />
                    <meshBasicMaterial 
                        color={color}
                        metalness={0.8}
                        roughness={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh> */}
                <RoundedRectangle 
                    color={color} 
                    height={0.8}
                    width={0.13}
                    radius={0.07}
                />
                {/* <RoundedBox args={[0.2, 0.5, 0.01]}>
                    
                    <meshBasicMaterial 
                        color={color}
                        metalness={0.8}
                        roughness={0.5}
                        side={THREE.DoubleSide}
                    />
                </RoundedBox> */}
                {/* <TransformControls object={textAreaRef} /> */}
                {/* </TransformControls> */}
                {/* Text as child, positioned relative to the mesh */}
                <Text
                    position={[0.0, 0.0, 0.014]} // Adjust to place text slightly above
                    rotation={[0, 0, -Math.PI/2]}
                    fontSize={0.12}
                    fontWeight={600}
                    fontFamily={"Inter"}
                    color={"#ffffff"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {progress*100}% {text}
                </Text>
            </group>
        </group>
    );
};



class SquareRingGeometry extends THREE.BufferGeometry {
    constructor(radius = 2, innerRadius = 0.5, thickness = 0.4, segments = 3, startAngle = 0, arcLength, shift = 0, edgeSegments = 3) {
        super();
        
        const vertices = [];
        const indices = [];
        const segmentAngle = arcLength / segments;
        
        // Helper function to create a point on the rounded corner
        // const createCornerPoint = (centerX, centerY, cornerRadius, angle, height) => {
        //     const x = centerX + cornerRadius * Math.cos(angle);
        //     const y = centerY + cornerRadius * Math.sin(angle);
        //     return [x, y, height];
        // };
        
        // Create vertices for the detailed cross-section at each segment
        let topLeft = 0;
        let topRight = 0;
        let bottomRight = 0;
        let bottomLeft = 0;

        let topLeft2 = 0;
        let topRight2 = 0;
        let bottomRight2 = 0;
        let bottomLeft2 = 0;

        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i * segmentAngle);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            //const cornerRadius = thickness * 0.1; // Size of rounded corners
            const localInnerRadius = Math.min(radius, innerRadius);
            const outerRadius = radius;
            
            // Create points for each edge of the cross-section
            const edgePoints = [];
            
            // Add points for each edge (top, right, bottom, left)
            for (let edge = 0; edge < 4; edge++) {
                const startAngle = (edge * Math.PI/2);
                for (let j = 0; j <= edgeSegments; j++) {
                    const t = j / edgeSegments;
                    // const cornerAngle = startAngle + (Math.PI/2) * t;
                    
                    let point;
                    if (edge === 0) { // Top edge
                        point = [
                            (localInnerRadius + (outerRadius - localInnerRadius) * t + shift) * cos,
                            (localInnerRadius + (outerRadius - localInnerRadius) * t + shift) * sin,
                            thickness/2
                        ];
                    } else if (edge === 1) { // Right edge
                        point = [
                            (outerRadius + shift) * cos,
                            (outerRadius + shift) * sin,
                            thickness/2 - thickness * t
                        ];
                    } else if (edge === 2) { // Bottom edge
                        point = [
                            (localInnerRadius + (outerRadius - localInnerRadius) * t + shift) * cos,
                            (localInnerRadius + (outerRadius - localInnerRadius) * t + shift) * sin,
                            -thickness/2
                        ];
                    } else { // Left edge
                        point = [
                            (localInnerRadius + shift) * cos,
                            (localInnerRadius + shift) * sin,
                            -thickness/2 + thickness * t
                        ];
                    }
                    
                    vertices.push(...point);
                    edgePoints.push(vertices.length/3 - 1);
                }
            }
            
            // Create faces between current and next segment
            if (i < segments) {
                const segmentVertCount = (edgeSegments + 1) * 4;
                const currentStart = i * segmentVertCount;
                const nextStart = (i + 1) * segmentVertCount;
                
                // Create faces for each edge
                for (let e = 0; e < 4; e++) {
                    const edgeStart = e * (edgeSegments + 1);
                    for (let j = 0; j < edgeSegments; j++) {
                        const current = currentStart + edgeStart + j;
                        const next = nextStart + edgeStart + j;
                        
                        // Create two triangles for each quad
                        indices.push(
                            current, next, current + 1,
                            current + 1, next, next + 1
                        );
                        if(i === 0 && j === 0){
                            if(e === 0){
                                topLeft = current;
                            }
                            if(e === 1){
                                topRight = current;
                            }
                            if(e === 2){
                                bottomRight = current;
                            }
                            if(e === 3){
                                bottomLeft = current - 1;
                            }
                        }
                        if(i === segments - 1  && j === 0){
                            if(e === 0){
                                topLeft2 = next;
                            }
                            if(e === 1){
                                topRight2 = next;
                            }
                            if(e === 2){
                                bottomRight2 = next;
                            }
                            if(e === 3){
                                bottomLeft2 = next-1;
                            }
                        }
                    }
                }
            }

            //Create segment closing faces
            if(i === segments){
                indices.push(
                    topRight2, bottomLeft2, topLeft2,
                    topLeft2, bottomLeft2, bottomRight2,
                )
            }
            if(i === 0){
                indices.push(
                    topRight, bottomLeft, topLeft,
                    topLeft, bottomLeft, bottomRight,
                )
            }
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setIndex(indices);
        this.computeVertexNormals();
    }
}


const ProgressRing = ({
    radius = 0.75,
    innerRadius = 0.5,
    thickness = 0.3,
    segments = 264,
    segmentData = [
        { progress: 1, color: '#67129b', text: 'Text', shift: 0}, // Purple - 30%
    ],
    gap = 0.10 // Gap in radians between segments
  }) => {
    const noOfSegments = segmentData.length;
    const groupRef = useRef();
    
    const segmentGeometries = useMemo(() => {
      
        // Calculate total available angle (full circle minus `noOfSegments` gaps)
        const totalAvailableAngle = Math.PI * 2 - (gap * noOfSegments);
        const portions = [];
        const points = [];
        // Calculate segment angles based on progress split of available angle
        let startAngle = gap
        for (let i = 0; i < noOfSegments; i++) {
            const segmentAngle = totalAvailableAngle * segmentData[i].progress;
            
            //console.log(`Segment ${i + 1}: Start Angle = ${startAngle}, Segment Angle = ${segmentAngle}`);
        
            const geometry = new SquareRingGeometry(
                radius, 
                innerRadius,
                thickness, 
                50, 
                startAngle, 
                segmentAngle,
                segmentData[i].shift
            );

            // Calculate center point of the segment
            const centerAngle = startAngle + (segmentAngle / 2);
            const centerPoint = new THREE.Vector3(
                (radius) * Math.cos(centerAngle),
                (radius) * Math.sin(centerAngle),
                0+thickness/2
            );

            // Store segment geometry and color
            portions.push({
                geometry: geometry,
                color: segmentData[i].color
            });

            // Store points for curved lines
            points.push({
                point: centerPoint,
                angle: centerAngle,
                color: segmentData[i].color,
                progress: segmentData[i].progress,
                text: segmentData[i].text
            });
            
            startAngle += segmentAngle + gap;
        }
        return {
            portions: portions,
            points: points
        };
    }, [radius, thickness, segments, gap, segmentData]);

    useFrame(() => {
        //groupRef.current.rotation.z = Math.sin(performance.now() * 0.0001);
    });
  
    return (
    
      <group rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>

        <OrbitControls enableRotate={false} enableZoom={true} enablePan={true} />
        
        <group>
            {segmentGeometries.portions.map((segment, index) => (
                <mesh key={index} geometry={segment.geometry}>
                    {/* <Edges color="#a03ed6" /> */}
                    <meshStandardMaterial
                        side={THREE.DoubleSide}
                        color={segment.color}
                        metalness={0.50}
                        roughness={0.65}
                        wireframe={false}
                    />
                </mesh>
            ))}
        </group>
        {segmentGeometries.points.map((point, index) => (
            <CurvedLine
                key={`line-${index}`}
                startPoint={point.point}
                angle={point.angle}
                length={0.5}
                color={point.color}
                progress={point.progress}
                text={point.text}
            />
        ))}
      </group>
    );
};


// Scene Component
const RingChartObject = ({
    radius = 0.75,
    innerRadius = 0.5,
    thickness = 0.3,
    segmentData = [
        { progress: 0.4, color: '#8a2be2', text: 'JSX'},
        { progress: 0.4, color: '#404040', text: 'CSS'},
        { progress: 0.2, color: '#ff4040', text: 'HTML'},
    ],
    gap = 0.10, // Gap in radians between segments
  }) => {
    // const [segmentData, setSegmentData] = useState([
    //     { progress: 0.4, color: '#8a2be2', text: 'JSX'},
    //     { progress: 0.4, color: '#404040', text: 'CSS'},
    //     { progress: 0.2, color: '#ff4040', text: 'HTML'},
    //     // { progress: 0.2, color: '#ff4040' }
    // ]);

    const [segmentLength, setSegmentLength] = useState(3);

    // Store the controls schema separately
    // State for temporary working data
    const [tempSegmentData, setTempSegmentData] = useState([...segmentData]);

    // Store the controls schema separately
    const createSegmentControls = (segments) => {
        const controls = {};
        segments.forEach((segment, index) => {
            controls[`Segment ${index + 1}`] = folder({
                [`progress_${index}`]: {
                    value: segment.progress * 100,
                    min: 0,
                    max: 100,
                    step: 1,
                    label: 'Progress (%)',
                    onChange: (value) => {
                        setTempSegmentData(prevData => {
                            const newData = [...prevData];
                            newData[index] = { ...newData[index], progress: value / 100 };
                            return newData;
                        });
                    }
                },
                [`color_${index}`]: {
                    value: segment.color,
                    label: 'Color',
                    onChange: (value) => {
                        setTempSegmentData(prevData => {
                            const newData = [...prevData];
                            newData[index] = { ...newData[index], color: value };
                            return newData;
                        });
                    }
                },
                [`text_${index}`]: {
                    value: segment.text || '',
                    label: 'Label',
                    onChange: (value) => {
                        setTempSegmentData(prevData => {
                            const newData = [...prevData];
                            newData[index] = { ...newData[index], text: value };
                            return newData;
                        });
                    }
                }
            });
        });
        return controls;
    };

    // Initial configuration controls
    // const { numberOfSegments } = useControls('Ring Configuration', {
    //     numberOfSegments: {
    //         value: 3,
    //         min: 1,
    //         max: 10,
    //         step: 1,
    //         label: 'Number of Segments',
    //         onChange: (value) => {
    //             setSegmentLength(value);
    //         }
    //     },
    //     'Create Segments': button(() => {
    //         const equalProgress = 1 / segmentLength;
    //         const newSegments = Array(segmentLength).fill(null).map(() => ({
    //             progress: equalProgress,
    //             color: '#000000',
    //             text: ''
    //         }));
    //         console.log('Creating segments with length:', segmentLength);
    //         setTempSegmentData(newSegments);
    //         setSegmentData(newSegments);
    //     })
    // }, {collapsed: true}, [segmentLength]); // Add dependency to update control when segmentLength changes

    // Use useEffect to monitor segmentLength changes
    // useEffect(() => {
    //     console.log('Segment length updated:', segmentLength);
    // }, [segmentLength]);

    // Calculate total progress from temporary data
    const totalProgress = tempSegmentData.reduce((sum, segment) => sum + segment.progress, 0);

    // Dynamic segment controls that update when tempSegmentData changes
    // useControls(
    //     'Segment Controls', 
    //     createSegmentControls(tempSegmentData),
    //     { collapsed: true },
    //     [tempSegmentData, numberOfSegments]
    // );

    // Validation controls with auto-update
    // useControls('Actions', {
    //     'Total Progress': {
    //         value: (totalProgress * 100).toFixed(1) + '%',
    //         editable: false,
    //         label: 'Total Progress'
    //     },
    //     'Status': {
    //         value: Math.abs(totalProgress - 1) <= 0.01 ? '✅ Valid' : '❌ Must equal 100%',
    //         editable: false
    //     },
    //     'Apply Changes': button(() => {
    //         if (Math.abs(totalProgress - 1) > 0.01) {
    //             alert(`Total progress must equal 100%. Current total: ${(totalProgress * 100).toFixed(1)}%`);
    //             return;
    //         }
    //         // Only update the actual segment data when applying changes
    //         setSegmentData([...tempSegmentData]);
    //     }),
        
    // }, {collapsed: true}, [tempSegmentData]); // Update based on temporary data    

    return (
      <>
        {/* <directionalLight position={[1,2,3]} intensity={1}/>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} /> */}
        <group>
            <MainCurvedLines />
        </group>
        <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <MainCurvedLines />
        </group>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <ProgressRing 
                segmentData={segmentData}
                thickness={thickness}
                radius={radius}
                innerRadius={innerRadius}
                gap={gap}
            />
        </group>
      </>
    );
};
  
export default RingChartObject;