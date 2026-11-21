import { Canvas } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import React, { useRef } from "react";
import Player from "./Player";
import DynamicSky from "../Sky/DynamicSky"
import { type TreePos, type PortalPos } from "../../types/types"
import { type BufferGeometry, type BufferGeometryEventMap, type Material, type Mesh, type NormalBufferAttributes, type Object3DEventMap } from "three";

let controlsRef: any = null;

function Scene({ children, blocks, setBlocks, chunks, setChunks, chunkSize, treePosArrayPerChunk, setTreePosArrayPerChunk, portalCoords, setPortalCoords, PortalOneRef, PortalTwoRef, deleteMode, setDeleteMode }: { children: React.ReactNode, blocks: [x: number, y: number, z: number][], setBlocks: React.Dispatch<React.SetStateAction<[x: number, y: number, z: number][]>>, chunks: Set<string>, setChunks: React.Dispatch<React.SetStateAction<Set<string>>>, chunkSize: number, treePosArrayPerChunk: Array<Array<TreePos>>, setTreePosArrayPerChunk: React.Dispatch<React.SetStateAction<Array<Array<TreePos>>>>, portalCoords: PortalPos, setPortalCoords: React.Dispatch<React.SetStateAction<PortalPos>>, PortalOneRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>, PortalTwoRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>, deleteMode: boolean, setDeleteMode: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
    controlsRef = useRef<any>(null);

    return (
        <Canvas shadows="soft">
            <PointerLockControls ref={controlsRef} />
            <Player controlsRef={controlsRef} blocks={blocks} setBlocks={setBlocks} chunks={chunks} setChunks={setChunks} chunkSize={chunkSize} treePosArrayPerChunk={treePosArrayPerChunk} setTreePosArrayPerChunk={setTreePosArrayPerChunk} portalCoords={portalCoords} setPortalCoords={setPortalCoords} PortalOneRef={PortalOneRef} PortalTwoRef={PortalTwoRef} deleteMode={deleteMode} setDeleteMode={setDeleteMode} />
            <DynamicSky />
            <ambientLight intensity={0.75} />
            {children}
        </Canvas>
    )
}


export default Scene;
