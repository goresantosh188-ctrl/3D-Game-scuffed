import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";


function PortalPortal({ PortalOneRef, PortalTwoRef }: { PortalOneRef?: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>, PortalTwoRef?: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null> }): React.JSX.Element {
    const pointLightRef = useRef<any>(null);

    useFrame((state) => {
        if (!pointLightRef.current) return
        pointLightRef.current.intensity = 4.5 + Math.sin(state.clock.elapsedTime * 4) * 0.6 + Math.cos(state.clock.elapsedTime * 9) * 0.4;
    })

    return (
        <group>
            <mesh ref={PortalTwoRef ? PortalTwoRef : PortalOneRef}>
                <boxGeometry args={[0.5, 3, 2]} />
                <meshStandardMaterial color={"blue"} emissive={"blue"} emissiveIntensity={1.2} transparent opacity={0.89} toneMapped={false} />
            </mesh>
            <pointLight ref={pointLightRef} color={"blue"} castShadow intensity={3} position={[0,0.5,0]} />
            <Sparkles count={1000} position={[0,0.5,0]} scale={2} color={"blue"} size={2} />
        </group>
    )
}

export default PortalPortal;