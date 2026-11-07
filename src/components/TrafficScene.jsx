import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei'

const LAMP_CONFIG = [
  { key: 'RED', color: '#ff426d', position: [0, 1.62, 0.62] },
  { key: 'YELLOW', color: '#ffc857', position: [0, 0.16, 0.62] },
  { key: 'GREEN', color: '#35e58c', position: [0, -1.30, 0.62] },
]

function Lamp({ color, position, active, pulseFlash }) {
  const lampRef = useRef(null)
  const haloRef = useRef(null)

  useFrame(({ clock }) => {
    const shimmer = active ? 1 + Math.sin(clock.elapsedTime * 4.2) * 0.045 : 1
    const pulse = active && pulseFlash ? 1.11 : shimmer
    if (lampRef.current) {
      lampRef.current.scale.setScalar(pulse)
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = active ? 0.16 + Math.sin(clock.elapsedTime * 3.5) * 0.025 : 0.012
    }
  })

  return (
    <group position={position}>
      <mesh ref={haloRef} position={[0, 0, -0.03]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.66, 48]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.16 : 0.012} depthWrite={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.48, 0.095, 20, 48]} />
        <meshStandardMaterial color="#162431" metalness={0.82} roughness={0.26} />
      </mesh>
      <mesh ref={lampRef} position={[0, 0, 0.055]}>
        <sphereGeometry args={[0.38, 40, 24]} />
        <meshStandardMaterial
          color={active ? color : '#0d151d'}
          emissive={active ? color : '#020407'}
          emissiveIntensity={active ? 2.25 : 0.015}
          metalness={0.14}
          roughness={0.18}
        />
      </mesh>
      {active && <pointLight position={[0, 0, 0.35]} color={color} intensity={1.5} distance={2.1} decay={2} />}
    </group>
  )
}

function TrafficLightModel({ activeLight, pulseFlash }) {
  return (
    <group position={[0, 0.35, 0]} rotation={[0, -0.16, 0]}>
      <RoundedBox args={[3.05, 5.18, 1.24]} radius={0.22} smoothness={5} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#080e16" metalness={0.64} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[2.72, 4.86, 0.13]} radius={0.17} smoothness={4} position={[0, 0.45, 0.66]}>
        <meshStandardMaterial color="#101a25" metalness={0.36} roughness={0.38} />
      </RoundedBox>
      <mesh position={[0, 3.10, 0.71]} castShadow>
        <boxGeometry args={[2.38, 0.07, 0.1]} />
        <meshStandardMaterial color="#273b4a" metalness={0.8} roughness={0.24} />
      </mesh>
      {LAMP_CONFIG.map((lamp) => <Lamp key={lamp.key} {...lamp} active={lamp.key === activeLight} pulseFlash={pulseFlash} />)}
      <mesh position={[0, -2.33, 0.03]} castShadow>
        <boxGeometry args={[2.22, 0.11, 1.26]} />
        <meshStandardMaterial color="#070c12" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -2.58, -0.02]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 2.3, 32]} />
        <meshStandardMaterial color="#6b8494" metalness={0.88} roughness={0.2} />
      </mesh>
      <mesh position={[0, -3.74, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.22, 32]} />
        <meshStandardMaterial color="#243746" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, -3.88, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.16, 1.24, 0.22, 48]} />
        <meshStandardMaterial color="#182937" metalness={0.86} roughness={0.22} />
      </mesh>
      <mesh position={[0, -3.99, 0]} receiveShadow>
        <cylinderGeometry args={[0.98, 1.04, 0.08, 48]} />
        <meshStandardMaterial color="#0d1a25" metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  )
}

export default function TrafficScene({ activeLight, pulseFlash }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [7.2, 4.7, 8.6], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => { gl.setClearColor('#071321', 0) }}
    >
      <ambientLight intensity={0.48} color="#9bc5da" />
      <hemisphereLight intensity={0.48} color="#a5d8ee" groundColor="#081421" />
      <directionalLight castShadow position={[5, 9, 6]} intensity={2.2} color="#d9f5ff" shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <pointLight position={[-5, 2, 3]} intensity={1.1} distance={10} color="#1b8fc8" />
      <pointLight position={[4, -1, -2]} intensity={0.9} distance={8} color="#4a65ff" />
      <TrafficLightModel activeLight={activeLight} pulseFlash={pulseFlash} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#071421" metalness={0.35} roughness={0.74} />
      </mesh>
      <gridHelper args={[20, 20, '#1a5066', '#10283b']} position={[0, -4.47, 0]} />
      <ContactShadows position={[0, -4.42, 0]} opacity={0.58} scale={12} blur={2.2} far={6} color="#000814" />
      <OrbitControls enablePan={false} minDistance={6.6} maxDistance={13.5} minPolarAngle={Math.PI * 0.31} maxPolarAngle={Math.PI * 0.58} target={[0, -0.35, 0]} />
    </Canvas>
  )
}
