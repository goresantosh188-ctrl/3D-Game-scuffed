import type React from "react";
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";


function PortalPortal({ PortalRef }: { PortalRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null> }): React.JSX.Element {
    return (
        <group>
            <mesh ref={PortalRef}>
                <boxGeometry args={[0.5, 3]} />
                <meshStandardMaterial color={"blue"} emissive={"blue"} emissiveIntensity={2} transparent opacity={0.89} />
            </mesh>
        </group>
    )
}

export default PortalPortal;