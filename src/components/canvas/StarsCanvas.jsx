import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const StarBackground = (props) => {
  const ref = React.useRef();
  const [sphere] = React.useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = ({ children }) => (
  <Canvas
    fragmentShader={null}
    vertexShader={null}
    camera={{ position: [0, 0, 1] }}
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
  >
    <StarBackground />
    {children}
  </Canvas>
);

export default StarsCanvas;