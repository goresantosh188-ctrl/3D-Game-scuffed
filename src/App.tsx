import Scene from "./components/Scene";
import Plane from "./components/Plane";
import { useRef, useState } from "react";
import { type PortalPos, type TreePos } from "./types/types";
import type { BufferGeometry, BufferGeometryEventMap, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from "three";

function App(): React.JSX.Element {
  const [blocks, setBlocks] = useState<[x: number, y: number, z: number][]>([]);
  const [chunks, setChunks] = useState<Set<string>>(new Set(["0,0"]))
  const [treePosArrayPerChunk, setTreePosArrayPerChunk] = useState<Array<Array<TreePos>>>([])
  const [portalCoords, setPortalCoords] = useState<PortalPos>([[Infinity, Infinity, Infinity], [Infinity, Infinity, Infinity]])

  const chunkSize = 40;
  const worldCoords = [chunkSize, chunkSize];
 
  const worldMinX = -worldCoords[0] / 2;
  const worldMaxX = worldCoords[0] / 2;
  const worldMinZ = -worldCoords[1] / 2;
  const worldMaxZ = worldCoords[1] / 2;

  const PortalOneRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>(null);
  const PortalTwoRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap> | null>(null);

  console.log(worldCoords, worldMinX, worldMaxX, worldMinZ, worldMaxZ);
  console.log(treePosArrayPerChunk)
  console.count("APP RENDER");

  return (
    <Scene blocks={blocks} setBlocks={setBlocks} chunks={chunks} setChunks={setChunks} chunkSize={chunkSize} treePosArrayPerChunk={treePosArrayPerChunk} setTreePosArrayPerChunk={setTreePosArrayPerChunk} portalCoords={portalCoords} setPortalCoords={setPortalCoords} PortalOneRef={PortalOneRef} PortalTwoRef={PortalTwoRef}>
      <Plane blocks={blocks} chunks={chunks} chunkSize={chunkSize} treePosArrayPerChunk={treePosArrayPerChunk} setTreePosArrayPerChunk={setTreePosArrayPerChunk} portalCoords={portalCoords} PortalOneRef={PortalOneRef} PortalTwoRef={PortalTwoRef} /> 
    </Scene>
  )
}

export default App;