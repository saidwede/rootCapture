import { QuadraticBezierLine } from "@react-three/drei";

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
