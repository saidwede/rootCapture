import * as THREE from 'three';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, QuadraticBezierLine,Html, Text, Line} from '@react-three/drei'
import MainCurvedLines from './curveline';
import { useSpring, animated, config } from '@react-spring/three';
import { useControls, button, useStoreContext, folder } from 'leva';

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
        <group>
            <QuadraticBezierLine
                start={points.start}
                end={points.end}
                control={points.control}
                color={color}
                lineWidth={2}
                dashed={false}
            />
            
            {/* Group mesh and text together */}
            <group position={points.end} ref={textAreaRef}>
                {/* Mesh as parent */}
                {/* Adding a helper function to check axis */}
                <mesh rotation = {[0, 0, 0]} position={[0.00, 0, 0.012]} >
                    <planeGeometry args={[0.15, 0.42, 64, 64]} />
                    <meshBasicMaterial 
                        color={color}
                        metalness={0.8}
                        roughness={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* <TransformControls object={textAreaRef} /> */}
                {/* </TransformControls> */}
                {/* Text as child, positioned relative to the mesh */}
                <Text
                    position={[0.0, 0.0, 0.014]} // Adjust to place text slightly above
                    rotation={[0, 0, -Math.PI/2]}
                    fontSize={0.08}
                    fontWeight={500}
                    fontFamily={"Inter"}
                    color={"white"}
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
    constructor(radius = 2, radialThickness = 1.0, height = 0.3, segments = 128, progress = 0.6, startAngle = 0, arcLength, edgeSegments = 128) {
        super();
        
        const vertices = [];
        const indices = [];
        const segmentAngle = arcLength / segments;
        
        // Helper function to create a point on the rounded corner
        const createCornerPoint = (centerX, centerY, cornerRadius, angle, height) => {
            const x = centerX + cornerRadius * Math.cos(angle);
            const y = centerY + cornerRadius * Math.sin(angle);
            return [x, y, height];
        };
        
        // Create vertices for the detailed cross-section at each segment
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i * segmentAngle);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            const cornerRadius = radialThickness * 0.1; // Size of rounded corners
            const innerRadius = radius - radialThickness/2;
            const outerRadius = radius + radialThickness/2;
            
            // Create points for each edge of the cross-section
            const edgePoints = [];
            
            // Add points for each edge (top, right, bottom, left)
            for (let edge = 0; edge < 4; edge++) {
                const startAngle = (edge * Math.PI/2);
                for (let j = 0; j <= edgeSegments; j++) {
                    const t = j / edgeSegments;
                    const cornerAngle = startAngle + (Math.PI/2) * t;
                    
                    let point;
                    if (edge === 0) { // Top edge
                        point = [
                            (innerRadius + radialThickness * t) * cos,
                            (innerRadius + radialThickness * t) * sin,
                            height/2
                        ];
                    } else if (edge === 1) { // Right edge
                        point = [
                            outerRadius * cos,
                            outerRadius * sin,
                            height/2 - height * t
                        ];
                    } else if (edge === 2) { // Bottom edge
                        point = [
                            (outerRadius - radialThickness * t) * cos,
                            (outerRadius - radialThickness * t) * sin,
                            -height/2
                        ];
                    } else { // Left edge
                        point = [
                            innerRadius * cos,
                            innerRadius * sin,
                            -height/2 + height * t
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
                    }
                }
            }
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setIndex(indices);
        this.computeVertexNormals();
    }
}


const ProgressRing = ({
    radius = 0.75,          // Base radius of the ring
    radialThickness = 0.6,  // Thickness from inner to outer radius
    height = 0.2,           // Height/depth of the ring
    segments = 264,         // Number of segments for smooth curves
    noOfSegments = 2,       // Number of ring segments (pieces)
    firstSegmentColor = '#8a2be2',  // Default color for first segment
    secondSegmentColor = '#404040',  // Default color for second segment
    segmentData = [
        { progress: 0.75, color: '#67129b', text: 'JSX'}, // First segment: 75% of circle
        { progress: 0.25, color: '#3d4148', text: 'CSS'}, // Second segment: 25% of circle
    ],
    gap = 0.04  // Physical gap size between segments
}) => {

    const groupRef = useRef();
    const [phase, setPhase] = useState('pause');
    const timeRef = useRef(0);
    const rotationRef = useRef(0);


    const segmentGeometries = useMemo(() => {
        // Calculate outer and inner radii based on base radius and thickness
        const outerRadius = radius + radialThickness / 2;
        const innerRadius = radius - radialThickness / 2;
        
        // Calculate the desired physical gap length at the outer radius
        // This ensures consistent gap appearance
        const desiredGapArcLength = gap * outerRadius;
        
        // Convert the physical gap length to angles at both radii
        // Different radii require different angles for the same arc length
        const gapOuter = desiredGapArcLength / outerRadius;  // Angle at outer radius
        const gapInner = desiredGapArcLength / innerRadius;  // Angle at inner radius
        
        // Use average of inner and outer angles for a balanced gap
        const adjustedGap = (gapOuter + gapInner) / 2;
    
        // Calculate total angle available for segments after subtracting gaps
        const totalAvailableAngle = Math.PI * 2 - (adjustedGap * noOfSegments);
        const portions = [];  // Store geometry and color for each segment
        const points = [];    // Store points for curved lines and labels
    
        // Start first segment after a gap
        let startAngle = adjustedGap;
        
        // Create geometry for each segment
        for (let i = 0; i < noOfSegments; i++) {
            // Calculate angle for this segment based on its progress percentage
            const segmentAngle = totalAvailableAngle * segmentData[i].progress;

            const newRadius = radius + ((Math.random() - 0.5) * 0.10);
            // Create the geometry for this segment
            const geometry = new SquareRingGeometry(
                newRadius, 
                radialThickness, 
                height, 
                segments, 
                segmentData[i].progress, 
                startAngle, 
                segmentAngle
            );
    
            // Calculate the center point for curved lines and labels
            const centerAngle = startAngle + (segmentAngle / 2);
            const centerPoint = new THREE.Vector3(
                (newRadius + radialThickness/2) * Math.cos(centerAngle),
                (newRadius + radialThickness/2) * Math.sin(centerAngle),
                height / 2
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
    
            // Move to next segment start position
            startAngle += segmentAngle + adjustedGap;
        }
    
        return { portions, points };
    }, [radius, radialThickness, height, segments, gap, segmentData]); // Dependencies for memoization
    
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        timeRef.current += delta;

        switch(phase) {
            case 'pause':
                // Pause for 3 seconds
                if (timeRef.current >= 5) {
                    timeRef.current = 0;
                    setPhase('spinForward');
                }
                break;

            case 'spinForward':
                // Duration for one complete rotation (in seconds)
                const rotationDuration = 3;
                
                // Calculate progress through the rotation (0 to 1)
                const progress = Math.min(timeRef.current / rotationDuration, 1);
                
                // Apply easing to the rotation
                const easedProgress = easeInOutQuad(progress);
                const targetRotation = Math.PI * 2 * easedProgress;
                
                // Update rotation
                groupRef.current.rotation.y = targetRotation;
                
                // Check if rotation is complete
                if (progress >= 1) {
                    timeRef.current = 0;
                    groupRef.current.rotation.y = 0; // Reset to initial position
                    setPhase('pause');
                }
                break;
        }
    });

    // Render the ring segments and curved lines
    return (
      
        <group rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>  {/* Rotate to lay flat */}
        <OrbitControls enableRotate={false} enableZoom={true} enablePan={true} />
        
        {/* Render ring segments */}
        {segmentGeometries.portions.map((segment, index) => (
            <mesh key={index} geometry={segment.geometry} >
                <meshStandardMaterial
                    side={THREE.DoubleSide}
                    color={segment.color}
                    metalness={0.50}
                    roughness={0.65}
                    wireframe={false}
                />
            </mesh>
        ))}
        
        {/* Render curved lines and labels */}
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
const MultipleScene = () => {
    const [segmentData, setSegmentData] = useState([
        { progress: 0.3, color: '#8a2be2', text: 'JSX'},
        { progress: 0.3, color: '#404040', text: 'CSS'},
        { progress: 0.2, color: '#ff4040', text: 'HTML'},
        { progress: 0.2, color: '#8a129b', text: 'React'},
        // { progress: 0.2, color: '#ff4040' }
    ]);

    const [segmentLength, setSegmentLength] = useState(4);

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
    const { numberOfSegments } = useControls('Ring Configuration', {
        numberOfSegments: {
            value: 4,
            min: 1,
            max: 10,
            step: 1,
            label: 'Number of Segments',
            onChange: (value) => {
                setSegmentLength(value);
            }
        },
        'Create Segments': button(() => {
            const equalProgress = 1 / segmentLength;
            const newSegments = Array(segmentLength).fill(null).map(() => ({
                progress: equalProgress,
                color: '#000000',
                text: ''
            }));
            console.log('Creating segments with length:', segmentLength);
            setTempSegmentData(newSegments);
            setSegmentData(newSegments);
        })
    }, {collapsed: true}, [segmentLength]); // Add dependency to update control when segmentLength changes


    // Calculate total progress from temporary data
    const totalProgress = tempSegmentData.reduce((sum, segment) => sum + segment.progress, 0);

    // Dynamic segment controls that update when tempSegmentData changes
    useControls(
        'Segment Controls', 
        createSegmentControls(tempSegmentData),
        { collapsed: true },
        [tempSegmentData, numberOfSegments]
    );

    // Validation controls with auto-update
    useControls('Actions', {
        'Total Progress': {
            value: (totalProgress * 100).toFixed(1) + '%',
            editable: false,
            label: 'Total Progress'
        },
        'Status': {
            value: Math.abs(totalProgress - 1) <= 0.01 ? '✅ Valid' : '❌ Must equal 100%',
            editable: false
        },
        'Apply Changes': button(() => {
            if (Math.abs(totalProgress - 1) > 0.01) {
                alert(`Total progress must equal 100%. Current total: ${(totalProgress * 100).toFixed(1)}%`);
                return;
            }
            // Only update the actual segment data when applying changes
            setSegmentData([...tempSegmentData]);
        }),
        
    }, {collapsed: true}, [tempSegmentData]); // Update based on temporary data

    
    const objRef = useRef();

    return (
    <>
        <directionalLight position={[1,2,3]} intensity={4.5}/>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <group>
            <MainCurvedLines />
        </group>
        {/* <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <MainCurvedLines />
        </group> */}
        
        {/* <Float scale={0.75} position={[0, 0.65, 0]} rotation={[0, 0.6, 0]}> */}
            <group ref={objRef} rotation={[0, Math.PI/2, Math.PI/12]} position={[0, 0, 0]}>
                
                <ProgressRing 
                    segmentData={segmentData}
                    noOfSegments={segmentLength}
                />
            </group>
            {/* <TransformControls object={objRef} /> */}
        {/* </Float> */}
    </>
    )
};
export default MultipleScene;