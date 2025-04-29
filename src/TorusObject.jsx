import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useState, useRef, useEffect } from 'react';
import { QuadraticBezierLine,Text} from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import MainCurvedLines from './curveline';

const RoundedRectangle = ({ position, color, width = 0.3, height = 1, radius = 0.1, opacity=1 }) => {
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
        <meshStandardMaterial color={color}
            transparent
            opacity={opacity}
        />
      </mesh>
    );
};

const CurvedLine = ({ startPoint, angle, length = 0.5, color, progress, text, textColor='white', position, opacity=1 }) => {
    const textAreaRef = useRef()
    const leftAngle = angle > (Math.PI/2) && angle < ((3*Math.PI)/2);
    const bottomAngle = angle > (Math.PI) && angle < (2*Math.PI);

    const points = useMemo(() => {
        // Start point is where the line connects to the ring
        const start = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
        
        // End point is extended outward at an angle (on the same plane as ring)
        const end = new THREE.Vector3(
            startPoint.x + length * (leftAngle ? -1 : 1),
            startPoint.y,
            startPoint.z + length * (bottomAngle ? -1 : 1)
        );
        const end2 = new THREE.Vector3(
            startPoint.x + length * 1.5 * (leftAngle ? -1 : 1),
            startPoint.y,
            startPoint.z + length * (bottomAngle ? -1 : 1)
        );
    
        // Control point for the quadratic curve
        const control = new THREE.Vector3(
            startPoint.x,
            startPoint.y,
            startPoint.z + length * (bottomAngle ? -1 : 1)
        );

        return {
            start,
            end,
            control,
            end2
        };
    }, [startPoint, angle, length]);
  
    return (
        <group rotation={[0,0,0]} position={position}>
            <mesh position={points.start}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color={color}
                    transparent
                    opacity={opacity}
                />
            </mesh>
            <QuadraticBezierLine
                start={points.start}
                end={points.end}
                mid={points.control}
                color={color}
                lineWidth={1.5}
                dashed={false}
                transparent
                opacity={opacity}
            />
            <QuadraticBezierLine
                start={points.end}
                end={points.end2}
                color={color}
                lineWidth={1.5}
                dashed={false}
                transparent
                opacity={opacity}
            />
            
            {/* Group mesh and text together */}
            <group position={points.end2} rotation={[(1/2)*Math.PI , 0, (1/2)*Math.PI]} ref={textAreaRef}>
                <RoundedRectangle 
                    color={color} 
                    height={2}
                    width={0.22}
                    radius={0.07}
                    position={[
                        0,
                        (leftAngle ? 1 : -1) * 1,
                        0
                    ]}
                    opacity={opacity}
                />
                <Text
                    position={[0.01, (leftAngle ? 1 : -1) * 1, 0.012]} // Adjust to place text slightly above
                    rotation={[0, 0, -Math.PI/2]}
                    fontSize={0.20}
                    fontWeight={600}
                    fontFamily={"Inter"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {parseInt(progress*100)}% {text}
                    <meshPhysicalMaterial
                        color={textColor}
                        transparent={true}
                        opacity={opacity}
                    />
                </Text>
            </group>
        </group>
    );
};



class SquareRingGeometry extends THREE.BufferGeometry {
    constructor(radius = 2, innerRadius = 0.5, thickness = 0.4, segments = 3, startAngle = 0, arcLength, shift = 0, edgeSegments = 1) {
        super();
        
        const vertices = [];
        const indices = [];
        const segmentAngle = arcLength / segments;
        
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
    gap = 0.10, // Gap in radians between segments
    position,
    inclinaison = 0,
    delay=0
  }) => {
    const [localRotation, setLocalRotation] = useState(Math.sin(performance.now() * 0.0001));
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
            const bottomAngle = centerAngle > (Math.PI) && centerAngle < (2*Math.PI);
            const centerPoint = new THREE.Vector3(
                (radius + (segmentData[i].shift || 0)) * Math.cos(centerAngle),
                (radius + (segmentData[i].shift || 0)) * Math.sin(centerAngle),
                (thickness/2)  - (bottomAngle ? thickness : 0)
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
                text: segmentData[i].text,
                textColor: segmentData[i].textColor || 'white'
            });
            
            startAngle += segmentAngle + gap;
        }
        return {
            portions: portions,
            points: points
        };
    }, [radius, thickness, segments, gap, segmentData]);

    const [blinks, setBlinks] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [timer, setTimer] = useState(0);
    const maxBlinks = 4; // Number of blinks
    const blinkSpeed = 0.05; // Speed of fading

    const [visible, setVisible] = useState(false);
      
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useFrame(() => {
        if(visible){
            if (blinks < maxBlinks) {
                if (timer < 30 * blinkSpeed && timer > 0 * blinkSpeed){
                    setOpacity(0);
                }else{
                    setOpacity(0.2);
                    setBlinks((prev) => prev + 1);
                }
                setTimer((prev) => {
                    if(prev >= 60 * blinkSpeed){
                        return 0;
                    }else{
                        return prev+1;
                    }
                });
            }else{
                setOpacity(1);
            }
        }
        if (blinks >= maxBlinks){
            setLocalRotation((prev) => Math.sin(performance.now() * 0.0002)/2);
        }
    });
    return (
    
      <group rotation={[0, inclinaison, localRotation]} position={position} ref={groupRef}>
        <group>
            <group>
                {segmentGeometries.portions.map((segment, index) => (
                    <mesh key={index} geometry={segment.geometry}>
                        <meshStandardMaterial
                            side={THREE.DoubleSide}
                            color={segment.color}
                            metalness={0.7}
                            roughness={0.7}
                            wireframe={false}
                            transparent
                            opacity={opacity}
                        />
                    </mesh>
                ))}
            </group>
            {segmentGeometries.points.map((point, index) => (
                <group
                    key={index}
                    rotation={[
                        0,
                        0,
                        -localRotation
                    ]}
                    position={point.point}
                >
                    <group position={[-point.point.x, -point.point.y, -point.point.z]}>
                        <group position={point.point} rotation={[-Math.PI/6,-inclinaison + (inclinaison/7),0]}>
                            <group position={[-point.point.x, -point.point.y, -point.point.z]}>
                                <CurvedLine
                                    key={`line-${index}`}
                                    startPoint={point.point}
                                    angle={point.angle}
                                    length={0.5}
                                    color={point.color}
                                    progress={point.progress}
                                    text={point.text}
                                    thickness={thickness}
                                    textColor={point.textColor}
                                    opacity={opacity}
                                />
                            </group>
                        </group>
                    </group>
                </group>
            ))}
        </group>
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
    inclinaison = 0,
    zoomed = false,
    delay=0,
    text=''
  }) => {
    const [visible, setVisible] = useState(false);
      
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay+700);
        return () => clearTimeout(timer);
    }, [delay]);

    const { ringSpring } = useSpring({
        ringSpring: zoomed ? 1.15 : 1, 
        config: { tension: 100, friction: 10 },
    });
    return (
      <>
        <Text
            font='/fonts/Rajdhani-Bold.ttf'
            fontSize={0.4}
            position={[0, -0.25, 0]}
            anchorX="center"
            anchorY="middle"
        >{text}
            <meshPhysicalMaterial
                color='cyan'
                transparent={true}
                opacity={visible ? 1 : 0}
            />
        </Text>
        <group position={[0, 0, -1]}>
            <MainCurvedLines delay={delay+400} />
        </group>
        <group position={[0, 0, -1]} rotation={[0, Math.PI, 0]}>
            <MainCurvedLines delay={delay+400} />
        </group>
        <animated.group rotation={[-Math.PI/3,0,0]} scale={ringSpring}>
            <ProgressRing 
                segmentData={segmentData}
                thickness={thickness}
                radius={radius}
                innerRadius={innerRadius}
                gap={gap}
                position={[0, -0.5, 0]} 
                inclinaison={inclinaison}
                delay={delay+500}
            />
        </animated.group>
      </>
    );
};
  
export default RingChartObject;