import { Canvas } from "@react-three/fiber";
import { Line, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

const createRoundedRectangle = (width, height, radius) => {
  const path = new THREE.Path();

  const w = width;
  const h = height;
  const r = Math.min(radius, w, h);

  path.moveTo(-w + 2 * r, h + h);
  path.lineTo(-w + r, h + h);
  path.quadraticCurveTo(-w, h + h, -w, h - r + h);
  path.lineTo(-w, -h + r + h);
  path.quadraticCurveTo(-w, -h + h, -w + r, -h + h);
  path.lineTo(-w + 2 * r, -h + h);

  return path;
};

const createRoundedRectangle2 = (width, height) => {
  const path = new THREE.Path();

  const w = width;
  const h = height;

  path.moveTo(w, h + h);
  path.lineTo(-w, h + h);
  path.quadraticCurveTo(-w - (2*w), 0 + h, -w, -h + h);
  path.lineTo(w, -h + h);

  return path;
};

function LargeBacket ({width, height, radius, lineWidth = 1.5, position=[0,0,0], color='white'}) {
  const w = width;
  const h = height;
  const r = Math.min(radius, w, h);
  return (
    <group position={position}>
      <QuadraticBezierLine
        start={[-w + 2 * r, h + h, 0]}
        end={[-w + r, h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w + r, h + h, 0]}
        end={[-w, h - r + h, 0]}
        mid={[-w, h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w, h - r + h, 0]}
        end={[-w, -h + r + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w, -h + r + h, 0]}
        end={[-w + r, -h + h, 0]}
        mid={[-w, -h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w + r, -h + h, 0]}
        end={[-w + 2 * r, -h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
    </group>
  )
}
function SmallBacket ({width, height, lineWidth = 1.5, position=[0,0,0], color='white'}) {
  const w = width;
  const h = height;

  return (
    <group position={position}>
      <QuadraticBezierLine
        start={[w, h + h, 0]}
        end={[-w, h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w, h + h, 0]}
        end={[-w, -h + h, 0]}
        mid={[-w - (2*w), 0 + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
      <QuadraticBezierLine
        start={[-w, -h + h, 0, 0]}
        end={[w, -h + h, 0]}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />
    </group>
  )
}

export default function MainCurvedLines() {
  const path = createRoundedRectangle(2, 1.30, 0.3);
  const points = path.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const path2 = createRoundedRectangle2(0.06, 0.58, 0.3);
  const points2 = path2.getPoints();
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

  // Define curved paths using THREE.CatmullRomCurve3
  const width = 2;
  const height = 2;
  const radius = 0.5;
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  const leftLargeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-w + r, -h, 0), // Bottom left start
    new THREE.Vector3(-w + r, -h, 0), // Bottom left start (straight)
    new THREE.Vector3(w - r, -h, 0), // Bottom right start (straight)

    new THREE.Vector3(w, -h, 0), // Corner start
    new THREE.Vector3(w, -h + r, 0), // Bottom right curve
    new THREE.Vector3(w, h - r, 0), // Top right curve
    new THREE.Vector3(w, h, 0), // Top left start (straight)
  ]);

  const leftSmallCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 0.7, 0),
    new THREE.Vector3(-1.9, 0.65, 0),
    new THREE.Vector3(-2.0, 0.4, 0),
    new THREE.Vector3(-2.0, -0.4, 0),
    // new THREE.Vector3(-1.8, -0.5, 0),
    new THREE.Vector3(-1.9, -0.8, 0),
    new THREE.Vector3(-1.5, -0.85, 0),
    // new THREE.Vector3(-2.7, 0.3, 0),
    // new THREE.Vector3(-2.5, 0.1, 0),
    // new THREE.Vector3(-2.1, 0.0, 0),
  ]);

  const leftLargePoints = leftLargeCurve.getPoints(50); // Increase for a smoother curve
  const leftSmallPoints = leftSmallCurve.getPoints(50); // Increase for a smoother curve

  return (
    <>
      <mesh position={[-2.15, 2.45, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      <mesh position={[-2.15, -0.15, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      {/* <mesh position={[-1.5, 0.7, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh> */}
      {/* <mesh position={[-1.5, -0.85, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh> */}
      <SmallBacket
        width={.07}
        height={.6}
        color="cyan"
        lineWidth={1}
        position={[-1.94, -0.77, 0]}
      />
      <LargeBacket
        width={1.30}
        height={1.3}
        radius={0.32}
        position={[-1.50, -0.15, 0]}
        color="cyan"
        lineWidth={1}
      />
    </>
  );
}
