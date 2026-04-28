import Tree from "./Tree/Tree";
import React, { useEffect, useRef } from "react";
import { type TreePos, type PortalPos } from "../types/types";
import Portal  from "./Portal/Portal"
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";

const treeHeight = -0.5

const spawnChunkTreePosArray: Array<TreePos> = [
    {x: 20, y: treeHeight, z: 20},
    {x: 15, y: treeHeight, z: 15},
    {x: 25, y: treeHeight, z: 25},
    {x: 16, y: treeHeight, z: 26},
    {x: 20, y: treeHeight, z: 30},
    {x: 25, y: treeHeight, z: 15},
    {x: 26, y: treeHeight, z: 19},
]

function Plane({ blocks, chunks, chunkSize, treePosArrayPerChunk, setTreePosArrayPerChunk, portalCoords, PortalRef }: { blocks: [x: number, y: number, z: number][], chunks: Set<string>, chunkSize: number, treePosArrayPerChunk: Array<Array<TreePos>>, setTreePosArrayPerChunk: React.Dispatch<React.SetStateAction<Array<Array<TreePos>>>>, portalCoords: PortalPos, PortalRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null> }): React.JSX.Element {
    setTreePosArrayPerChunk(oldTreePosArrayPerChunk => !oldTreePosArrayPerChunk.includes(spawnChunkTreePosArray) ? [...oldTreePosArrayPerChunk, spawnChunkTreePosArray] : oldTreePosArrayPerChunk)
    const doneChunks = useRef<Array<string>>([]);
    
    useEffect(() => {
        console.log("Chunk changes!!")
        Array.from(chunks).forEach(chunk => {
            if (chunk === "0,0" || doneChunks.current.includes(chunk)) return;
            const [x, z] = chunk.split(",").map(Number);
            const newTreePosArray: Array<TreePos> = []
            console.log("Inside chunk ", chunk)
            doneChunks.current.push(chunk);
            for (let i = 1; i <= 7; i++) {
                const chunkX = x * chunkSize;
                const chunkZ = z * chunkSize

                const minX = chunkX;
                const maxX = chunkX + chunkSize;
                const minZ = chunkZ;
                const maxZ = chunkZ + chunkSize;

                const treeX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
                const treeZ = Math.floor(Math.random() * (maxZ - minZ + 1)) + minZ;

                newTreePosArray.push({x: treeX, y: treeHeight, z: treeZ});

                console.log("Tree X/Z Position for said chunk:, ", treeX, treeZ)
            }
            setTreePosArrayPerChunk(oldTreePosArrayPerChunk => [...oldTreePosArrayPerChunk, newTreePosArray]);
            console.log("New treePosArrayPerChunk ", treePosArrayPerChunk)
        })
    }, [chunks])    
    return ( <>
        {Array.from(chunks).map(key => {
            const [x, z] = key.split(",").map(Number);

            return (
                <mesh key={key} rotation={[-Math.PI / 2, 0, 0]} position={[x * chunkSize + chunkSize / 2, -1, z * chunkSize + chunkSize / 2]}> {/* ground meshes using chunk generation */}
                    <planeGeometry args={[chunkSize, chunkSize]} />
                    <meshLambertMaterial color={"#3a5f0b"} />
                </mesh>
            )
        })}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.999, 25]}> {/* spawnpoint mesh */}
            <planeGeometry args={[2.5, 2.5]} />
            <meshStandardMaterial color={"#080808bf"} />
        </mesh>
        {treePosArrayPerChunk.map(treePosArray => 
            treePosArray.map((tree: TreePos, i: number) => {
                return (
                    <Tree key={i} position={[tree.x, tree.y, tree.z]} />
                )
            })
        )}
        {blocks.map((blockArray, i) => {
            return (
                blockArray[0] !== portalCoords[0][0] ||
                blockArray[1] !== portalCoords[0][1] || 
                blockArray[2] !== portalCoords[0][2] ? 
                <mesh key={i} position={blockArray}>
                    <boxGeometry />
                    <meshLambertMaterial color={"purple"} />
                </mesh> : <></>
            )
        })}
        <Portal position={portalCoords[0]} facingX linkExists={portalCoords[1][0] !== Infinity} PortalRef={PortalRef} />
        <Portal position={portalCoords[1]} facingX linkExists={portalCoords[1][0] !== Infinity} PortalRef={PortalRef} />
    </>
    )
}

export default Plane;