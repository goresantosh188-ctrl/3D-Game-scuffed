import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";
import { type Vector3DCoordinatesArray } from "../../types/types";
import PortalObsidian from "./PortalObsidian";
import PortalPortal from "./PortalPortal";

function Portal({ position, facingX, linkExists, PortalRef }: { position: Vector3DCoordinatesArray, facingX?: boolean, linkExists?: boolean, PortalRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null> }): React.JSX.Element {
    return(
        <group position={position}>
            <PortalObsidian obsidianOffsetY={2} />
            {facingX ? (
                <>
                    <PortalObsidian obsidianOffsetZ={-1}/>
                    <PortalObsidian obsidianOffsetZ={1}/>
                    <PortalObsidian obsidianOffsetZ={-1} obsidianOffsetY={1}/>
                    <PortalObsidian obsidianOffsetZ={1} obsidianOffsetY={1}/>
                    <PortalObsidian obsidianOffsetZ={1} obsidianOffsetY={2}/>
                    <PortalObsidian obsidianOffsetZ={-1} obsidianOffsetY={2}/>
                    {linkExists ? <PortalPortal PortalRef={PortalRef} /> : <></>}
                </>
            ) : (
                <>
                    <PortalObsidian obsidianOffsetX={-1}/>
                    <PortalObsidian obsidianOffsetX={1}/>
                    <PortalObsidian obsidianOffsetX={-1} obsidianOffsetY={1}/>
                    <PortalObsidian obsidianOffsetX={1} obsidianOffsetY={1}/>
                    <PortalObsidian obsidianOffsetX={1} obsidianOffsetY={2}/>
                    <PortalObsidian obsidianOffsetX={-1} obsidianOffsetY={2}/>
                    {linkExists ? <PortalPortal PortalRef={PortalRef} /> : <></>}
                </>
            )}
        </group>
    )
}

export default Portal;