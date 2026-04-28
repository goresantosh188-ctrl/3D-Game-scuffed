import React from "react";

function PortalObsidian({ obsidianOffsetX = 0, obsidianOffsetY = 0, obsidianOffsetZ = 0 }: { obsidianOffsetX?: number, obsidianOffsetY?: number, obsidianOffsetZ?: number}): React.JSX.Element {
    return (
        <mesh position={[obsidianOffsetX, obsidianOffsetY, obsidianOffsetZ]}>
            <boxGeometry />
            <meshStandardMaterial color={"#74633f"} roughness={0.3} metalness={0.2} />
        </mesh> 
    )
}

export default PortalObsidian;