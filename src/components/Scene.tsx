import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Sky } from "@react-three/drei";
import React, { useRef } from "react";
import Player from "./Player";
import { type TreePos, type PortalPos } from "../types/types"
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";

let controlsRef: any = null;

function Scene({ children, blocks, setBlocks, chunks, setChunks, chunkSize, treePosArrayPerChunk, setTreePosArrayPerChunk, portalCoords, setPortalCoords, PortalOneRef, PortalTwoRef }: { children: React.ReactNode, blocks: [x: number, y: number, z: number][], setBlocks: React.Dispatch<React.SetStateAction<[x: number, y: number, z: number][]>>, chunks: Set<string>, setChunks: React.Dispatch<React.SetStateAction<Set<string>>>, chunkSize: number, treePosArrayPerChunk: Array<Array<TreePos>>, setTreePosArrayPerChunk: React.Dispatch<React.SetStateAction<Array<Array<TreePos>>>>, portalCoords: PortalPos, setPortalCoords: React.Dispatch<React.SetStateAction<PortalPos>>, PortalOneRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>, PortalTwoRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null> }): React.JSX.Element {
    controlsRef = useRef<any>(null);

    return (
        <Canvas>
            <PointerLockControls ref={controlsRef} />
            <directionalLight position={[0, 100, 100]} intensity={3} />
            <ambientLight intensity={1} />
            <Player controlsRef={controlsRef} blocks={blocks} setBlocks={setBlocks} chunks={chunks} setChunks={setChunks} chunkSize={chunkSize} treePosArrayPerChunk={treePosArrayPerChunk} setTreePosArrayPerChunk={setTreePosArrayPerChunk} portalCoords={portalCoords} setPortalCoords={setPortalCoords} PortalOneRef={PortalOneRef} PortalTwoRef={PortalTwoRef} />
            <Sky />
            {children}
        </Canvas>
    )
}


export default Scene;
