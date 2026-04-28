import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { type PortalPos, type TreePos } from "../types/types";

function Player({ controlsRef, blocks, setBlocks, chunks, setChunks, chunkSize, treePosArrayPerChunk, portalCoords, setPortalCoords, PortalRef }: { controlsRef: RefObject<any>, blocks: [x: number, y: number, z: number][], setBlocks: React.Dispatch<React.SetStateAction<[x: number, y: number, z: number][]>>, chunks: Set<string>, setChunks: React.Dispatch<React.SetStateAction<Set<string>>>, chunkSize: number, treePosArrayPerChunk: Array<Array<TreePos>>, portalCoords: PortalPos, setPortalCoords: React.Dispatch<React.SetStateAction<PortalPos>>, PortalRef: React.RefObject<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material | THREE.Material[], THREE.Object3DEventMap> | null> }): React.JSX.Element {
    const keys = useRef<{ [key: string]: boolean }>({});
    const [buildMode, setBuildMode] = useState<boolean>(false);
    const direction = new THREE.Vector3();
    const previewMeshRef = useRef<THREE.Mesh>(null);

    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(chunkSize / 2, 0, chunkSize / 2 + 5)
    }, [])

    useEffect(() => {
        const handleDown = (event: KeyboardEvent) => {
            keys.current[event.key.toLowerCase()] = true;
        }

        const handleUp = (event: KeyboardEvent) => {
            keys.current[event.key.toLowerCase()] = false;
        }

        const handleClick = (event: MouseEvent) => {
            const preview = previewMeshRef.current;
            if (!buildMode || !preview) return;

            if (event.button === 2) {
                const previewXnotInPortalCoords = !(
                    preview.position.x === portalCoords[0][0] ||
                    preview.position.x === portalCoords[0][0] + 1 ||
                    preview.position.x === portalCoords[0][0] - 1 ||
                    preview.position.x === portalCoords[1][0] ||
                    preview.position.x === portalCoords[1][0] + 1 ||
                    preview.position.x === portalCoords[1][0] - 1
                );
                const previewYnotInPortalCoords = !(
                    preview.position.y === portalCoords[0][1] ||
                    preview.position.y === portalCoords[0][1] + 1 ||
                    preview.position.y === portalCoords[0][1] + 2 ||
                    preview.position.y === portalCoords[1][1] ||
                    preview.position.y === portalCoords[1][1] + 1 ||
                    preview.position.y === portalCoords[1][1] + 2
                );
                const previewZnotInPortalCoords = !(
                    preview.position.z === portalCoords[0][2] ||
                    preview.position.z === portalCoords[0][2] + 1 ||
                    preview.position.z === portalCoords[0][2] - 1 ||
                    preview.position.z === portalCoords[1][2] ||
                    preview.position.z === portalCoords[1][2] + 1 ||
                    preview.position.z === portalCoords[1][2] - 1
                );

                console.log(`preview: ${preview.position.x} ${preview.position.y} ${preview.position.z}\nportal: ${portalCoords[0]}\nconditions: ${previewXnotInPortalCoords} ${previewYnotInPortalCoords} ${previewZnotInPortalCoords}`)
                setBlocks(oldBlocks => previewXnotInPortalCoords || previewYnotInPortalCoords || previewZnotInPortalCoords  ? [...oldBlocks, [preview.position.x, preview.position.y, preview.position.z]] : oldBlocks);
            }
            if (event.button === 0) {
                setBlocks(oldBlocks => oldBlocks.filter(block => !(block[0] === preview.position.x && block[1] === preview.position.y && block[2] === preview.position.z)))
            }
        }

        const handleContext = (event: PointerEvent) => event.preventDefault();

        window.addEventListener("keydown", handleDown);
        window.addEventListener("keyup", handleUp);
        window.addEventListener("mousedown", handleClick);
        window.addEventListener("contextmenu", handleContext);

        return () => {
            window.removeEventListener("keydown", handleDown);
            window.removeEventListener("keyup", handleUp);
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("contextmenu", handleContext);
        }
    }, [buildMode]);

    // variable definitions for useFrame
    const speed = 5;
    
    const velocityY = useRef(0);
    const jumpForce = 0.3;

    const treeSize = 1;
    const blockSize = 1;
    const blockOffset = -0.5;
    const blockTop = 1.5;

    const placeDistance = 3;

    let groundY = 0;
    const worldGround = 0;

    let timeSinceBuildModePress = 0;
    let timeSincePortalPress = 0;
    let timeSincePortalTeleport = 0;

    let portals = 0;

    useFrame((state, delta) => {
        controlsRef.current.getDirection(direction);

        direction.y = 0;
        direction.normalize();

        const moveX = direction.x * speed * delta;
        const moveZ = direction.z * speed * delta;

        for (const block of blocks) {
            const blockMinX = block[0] - blockSize;
            const blockMaxX = block[0] + blockSize;
            const blockMinZ = block[2] - blockSize;
            const blockMaxZ = block[2] + blockSize;
            const blockY = block[1] + blockTop;

            if (state.camera.position.y + velocityY.current <= blockY  && state.camera.position.y >= blockY && (state.camera.position.x > blockMinX && state.camera.position.x < blockMaxX) && (state.camera.position.z > blockMinZ && state.camera.position.z < blockMaxZ) && velocityY.current <= 0) {
                velocityY.current = 0;
                groundY = blockY;
                state.camera.position.y = blockY;
                break;
            }

            else {
                const loweredGroundY = groundY - blockTop;
                groundY = loweredGroundY <= worldGround ? worldGround : loweredGroundY;
            }
        }

        const previewMeshRefX = Math.round(state.camera.position.x + direction.x * placeDistance);
        const previewMeshRefY = Math.round(state.camera.position.y) + blockOffset;
        const previewMeshRefZ = Math.round(state.camera.position.z + direction.z * placeDistance);

        previewMeshRef.current?.position.set(previewMeshRefX, previewMeshRefY, previewMeshRefZ);

        const chunkX = Math.floor(state.camera.position.x / chunkSize);
        const chunkZ = Math.floor(state.camera.position.z / chunkSize);

        const key = `${chunkX},${chunkZ}`;

        if (!chunks.has(key)) {
            setChunks(oldChunks => new Set(oldChunks).add(key));
        }

        if (PortalRef.current) {
            PortalRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }

        if (keys.current["w"]) {
            const newX = state.camera.position.x + moveX;
            const newZ = state.camera.position.z + moveZ;
            
            let collideTree = false;
            let collideBlock = false;
            let collidePortal = false;
            for (const treePosArray of treePosArrayPerChunk) {
                for (const tree of treePosArray) {
                    const treePosMinX = tree.x - treeSize;
                    const treePosMaxX = tree.x + treeSize;
                    const treePosMinZ = tree.z - treeSize;
                    const treePosMaxZ = tree.z + treeSize;

                    if ((newX > treePosMinX && newX < treePosMaxX) && (newZ > treePosMinZ && newZ < treePosMaxZ) && state.camera.position.y < tree.y + 2.5) {
                        collideTree = true;
                        break;
                    }
                }
            }
            for (const block of blocks) {
                const blockMinX = block[0] - blockSize;
                const blockMaxX = block[0] + blockSize;
                const blockMinZ = block[2] - blockSize;
                const blockMaxZ = block[2] + blockSize;
                const blockY = block[1] - blockOffset;

                if ((newX > blockMinX && newX < blockMaxX) && (newZ > blockMinZ && newZ < blockMaxZ) && state.camera.position.y === blockY) {
                    collideBlock = true;
                    break;
                }
            }
            const portalCoordsOneMaxX = portalCoords[0][0] - blockOffset;
            const portalCoordsOneMinX = portalCoords[0][0] + blockOffset;
            const portalCoordsOneMaxZ = portalCoords[0][2] + 1 - blockOffset;
            const portalCoordsOneMinZ = portalCoords[0][2] - 1 + blockOffset; 
            const portalCoordsTwoMaxX = portalCoords[1][0] - blockOffset;
            const portalCoordsTwoMinX = portalCoords[1][0] + blockOffset;
            const portalCoordsTwoMaxZ = portalCoords[1][2] + 1 - blockOffset;
            const portalCoordsTwoMinZ = portalCoords[1][2] - 1 + blockOffset;
            const portalCoordsMinY = portalCoords[0][1] - blockOffset;
            const portalCoordsMaxY = portalCoords[0][1] + 2 - blockOffset;
            console.log(newX, newZ, portalCoordsOneMaxX, portalCoordsOneMinX, portalCoords[0][2], portalCoordsTwoMaxX, portalCoordsTwoMinX, portalCoords[1][2], blockOffset, state.camera.rotation, "x z maxx minx boffset")
            if ((newX >= portalCoordsOneMinX && newX <= portalCoordsOneMaxX) && newZ >= portalCoords[0][2] + blockOffset && newZ <= portalCoords[0][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsTwoMinX;
                state.camera.position.z = portalCoords[1][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if ((newX >= portalCoordsTwoMinX && newX <= portalCoordsTwoMaxX) && newZ >= portalCoords[1][2] + blockOffset && newZ <= portalCoords[1][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsOneMinX;
                state.camera.position.z = portalCoords[0][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if (((newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ && !(newX === portalCoords[0][0] && newZ === portalCoords[0][2])) || (newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ && !(newX === portalCoords[1][0] && newZ === portalCoords[1][2]))) && (state.camera.position.y + velocityY.current >= portalCoordsMinY && state.camera.position.y + velocityY.current <= portalCoordsMaxY)) {
                collidePortal = true;
            }
            console.log(`portal1: ${(newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ)}\nportal2: ${(newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ)}`)
            if (collideTree || collideBlock || collidePortal) return;

            state.camera.position.x = newX;
            state.camera.position.z = newZ;
        }

        if (keys.current["s"]) {
            const newX = state.camera.position.x - moveX;
            const newZ = state.camera.position.z - moveZ;

            let collideTree = false;
            let collideBlock = false;
            let collidePortal = false;
            for (const treePosArray of treePosArrayPerChunk) {
                for (const tree of treePosArray) {
                    const treePosMinX = tree.x - treeSize;
                    const treePosMaxX = tree.x + treeSize;
                    const treePosMinZ = tree.z - treeSize;
                    const treePosMaxZ = tree.z + treeSize;

                    if ((newX > treePosMinX && newX < treePosMaxX) && (newZ > treePosMinZ && newZ < treePosMaxZ) && state.camera.position.y < tree.y + 2.5) {
                        collideTree = true;
                        break;
                    }
                }
            }
            for (const block of blocks) {
                const blockMinX = block[0] - blockSize;
                const blockMaxX = block[0] + blockSize;
                const blockMinZ = block[2] - blockSize;
                const blockMaxZ = block[2] + blockSize;
                const blockY = block[1] - blockOffset;

                if ((newX > blockMinX && newX < blockMaxX) && (newZ > blockMinZ && newZ < blockMaxZ) && state.camera.position.y === blockY) {
                    collideBlock = true;
                    break;
                }
            }
            const portalCoordsOneMaxX = portalCoords[0][0] - blockOffset;
            const portalCoordsOneMinX = portalCoords[0][0] + blockOffset;
            const portalCoordsOneMaxZ = portalCoords[0][2] + 1 - blockOffset;
            const portalCoordsOneMinZ = portalCoords[0][2] - 1 + blockOffset; 
            const portalCoordsTwoMaxX = portalCoords[1][0] - blockOffset;
            const portalCoordsTwoMinX = portalCoords[1][0] + blockOffset;
            const portalCoordsTwoMaxZ = portalCoords[1][2] + 1 - blockOffset;
            const portalCoordsTwoMinZ = portalCoords[1][2] - 1 + blockOffset;
            const portalCoordsMinY = portalCoords[0][1] - blockOffset;
            const portalCoordsMaxY = portalCoords[0][1] + 2 - blockOffset;
            if ((newX >= portalCoordsOneMinX && newX <= portalCoordsOneMaxX) && newZ >= portalCoords[0][2] + blockOffset && newZ <= portalCoords[0][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsTwoMinX;
                state.camera.position.z = portalCoords[1][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if ((newX >= portalCoordsTwoMinX && newX <= portalCoordsTwoMaxX) && newZ >= portalCoords[1][2] + blockOffset && newZ <= portalCoords[1][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsOneMinX;
                state.camera.position.z = portalCoords[0][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if (((newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ && !(newX === portalCoords[0][0] && newZ === portalCoords[0][2])) || (newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ && !(newX === portalCoords[1][0] && newZ === portalCoords[1][2]))) && (state.camera.position.y + velocityY.current >= portalCoordsMinY && state.camera.position.y + velocityY.current <= portalCoordsMaxY)) {
                collidePortal = true;
            }
            console.log(`portal1: ${(newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ)}\nportal2: ${(newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ)}`)
            if (collideTree || collideBlock || collidePortal) return;

            state.camera.position.x = newX;
            state.camera.position.z = newZ;
        }

        if (keys.current["a"]) {
            const newX = state.camera.position.x + moveZ;
            const newZ = state.camera.position.z - moveX;

            let collideTree = false;
            let collideBlock = false;
            let collidePortal = false;
            for (const treePosArray of treePosArrayPerChunk) {
                for (const tree of treePosArray) {
                    const treePosMinX = tree.x - treeSize;
                    const treePosMaxX = tree.x + treeSize;
                    const treePosMinZ = tree.z - treeSize;
                    const treePosMaxZ = tree.z + treeSize;

                    if ((newX > treePosMinX && newX < treePosMaxX) && (newZ > treePosMinZ && newZ < treePosMaxZ) && state.camera.position.y < tree.y + 2.5) {
                        collideTree = true;
                        break;
                    }
                }
            }
            for (const block of blocks) {
                const blockMinX = block[0] - blockSize;
                const blockMaxX = block[0] + blockSize;
                const blockMinZ = block[2] - blockSize;
                const blockMaxZ = block[2] + blockSize;
                const blockY = block[1] - blockOffset;

                if ((newX > blockMinX && newX < blockMaxX) && (newZ > blockMinZ && newZ < blockMaxZ) && state.camera.position.y === blockY) {
                    collideBlock = true;
                    break;
                }
            }
            const portalCoordsOneMaxX = portalCoords[0][0] - blockOffset;
            const portalCoordsOneMinX = portalCoords[0][0] + blockOffset;
            const portalCoordsOneMaxZ = portalCoords[0][2] + 1 - blockOffset;
            const portalCoordsOneMinZ = portalCoords[0][2] - 1 + blockOffset; 
            const portalCoordsTwoMaxX = portalCoords[1][0] - blockOffset;
            const portalCoordsTwoMinX = portalCoords[1][0] + blockOffset;
            const portalCoordsTwoMaxZ = portalCoords[1][2] + 1 - blockOffset;
            const portalCoordsTwoMinZ = portalCoords[1][2] - 1 + blockOffset;
            const portalCoordsMinY = portalCoords[0][1] - blockOffset;
            const portalCoordsMaxY = portalCoords[0][1] + 2 - blockOffset;
            if ((newX >= portalCoordsOneMinX && newX <= portalCoordsOneMaxX) && newZ >= portalCoords[0][2] + blockOffset && newZ <= portalCoords[0][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsTwoMinX;
                state.camera.position.z = portalCoords[1][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if ((newX >= portalCoordsTwoMinX && newX <= portalCoordsTwoMaxX) && newZ >= portalCoords[1][2] + blockOffset && newZ <= portalCoords[1][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsOneMinX;
                state.camera.position.z = portalCoords[0][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if (((newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ && !(newX === portalCoords[0][0] && newZ === portalCoords[0][2])) || (newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ && !(newX === portalCoords[1][0] && newZ === portalCoords[1][2]))) && (state.camera.position.y + velocityY.current >= portalCoordsMinY && state.camera.position.y + velocityY.current <= portalCoordsMaxY)) {
                collidePortal = true;
            }
            console.log(`portal1: ${(newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ)}\nportal2: ${(newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ)}`)
            if (collideTree || collideBlock || collidePortal) return;

            state.camera.position.x = newX;
            state.camera.position.z = newZ;
        }

        if (keys.current["d"]) {
            const newX = state.camera.position.x - moveZ;
            const newZ = state.camera.position.z + moveX;

            let collideTree = false;
            let collideBlock = false;
            let collidePortal = false;
            for (const treePosArray of treePosArrayPerChunk) {
                for (const tree of treePosArray) {
                    const treePosMinX = tree.x - treeSize;
                    const treePosMaxX = tree.x + treeSize;
                    const treePosMinZ = tree.z - treeSize;
                    const treePosMaxZ = tree.z + treeSize;

                    if ((newX > treePosMinX && newX < treePosMaxX) && (newZ > treePosMinZ && newZ < treePosMaxZ) && state.camera.position.y < tree.y + 2.5) {
                        collideTree = true;
                        break;
                    }
                }
            }
            for (const block of blocks) {
                const blockMinX = block[0] - blockSize;
                const blockMaxX = block[0] + blockSize;
                const blockMinZ = block[2] - blockSize;
                const blockMaxZ = block[2] + blockSize;
                const blockY = block[1] - blockOffset;

                if ((newX > blockMinX && newX < blockMaxX) && (newZ > blockMinZ && newZ < blockMaxZ) && state.camera.position.y === blockY) {
                    collideBlock = true;
                    break;
                }
            }
            const portalCoordsOneMaxX = portalCoords[0][0] - blockOffset;
            const portalCoordsOneMinX = portalCoords[0][0] + blockOffset;
            const portalCoordsOneMaxZ = portalCoords[0][2] + 1 - blockOffset;
            const portalCoordsOneMinZ = portalCoords[0][2] - 1 + blockOffset; 
            const portalCoordsTwoMaxX = portalCoords[1][0] - blockOffset;
            const portalCoordsTwoMinX = portalCoords[1][0] + blockOffset;
            const portalCoordsTwoMaxZ = portalCoords[1][2] + 1 - blockOffset;
            const portalCoordsTwoMinZ = portalCoords[1][2] - 1 + blockOffset;
            const portalCoordsMinY = portalCoords[0][1] - blockOffset;
            const portalCoordsMaxY = portalCoords[0][1] + 2 - blockOffset;
            if ((newX >= portalCoordsOneMinX && newX <= portalCoordsOneMaxX) && newZ >= portalCoords[0][2] + blockOffset && newZ <= portalCoords[0][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsTwoMinX;
                state.camera.position.z = portalCoords[1][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if ((newX >= portalCoordsTwoMinX && newX <= portalCoordsTwoMaxX) && newZ >= portalCoords[1][2] + blockOffset && newZ <= portalCoords[1][2] - blockOffset && timeSincePortalTeleport >= 1 &&  portalCoords[0][0] !== Infinity && portalCoords[1][0] !== Infinity) {
                state.camera.position.x = portalCoordsOneMinX;
                state.camera.position.z = portalCoords[0][2];
                timeSincePortalTeleport = 0;    
                return;
            }
            if (((newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ && !(newX === portalCoords[0][0] && newZ === portalCoords[0][2])) || (newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ && !(newX === portalCoords[1][0] && newZ === portalCoords[1][2]))) && (state.camera.position.y + velocityY.current >= portalCoordsMinY && state.camera.position.y + velocityY.current <= portalCoordsMaxY)) {
                collidePortal = true;
            }
            console.log(`portal1: ${(newX > portalCoordsOneMinX && newX < portalCoordsOneMaxX && newZ > portalCoordsOneMinZ && newZ < portalCoordsOneMaxZ)}\nportal2: ${(newX > portalCoordsTwoMinX && newX < portalCoordsTwoMaxX && newZ > portalCoordsTwoMinZ && newZ < portalCoordsTwoMaxZ)}\ncamera y: ${state.camera.position.y} ${state.camera.position.y + velocityY.current}\nportal y: ${portalCoordsMinY} ${portalCoordsMaxY}`)
            if (collideTree || collideBlock || collidePortal) return;
            state.camera.position.x = newX;
            state.camera.position.z = newZ;
        }
        
        if (keys.current["b"] && timeSinceBuildModePress >= 0.2) {
            setBuildMode(oldBuildMode => !oldBuildMode);
            timeSinceBuildModePress = 0
        }

        velocityY.current -= delta;

        if (state.camera.position.y + velocityY.current < groundY) {
            velocityY.current = 0;
            state.camera.position.y = groundY;
        }
        
        if (keys.current[" "] && state.camera.position.y === groundY) {
            velocityY.current = jumpForce;
        }

        state.camera.position.y += velocityY.current;

        if (keys.current["p"] && portals < 2 && timeSincePortalPress >= 0.2) {
            const portalX = Math.round(state.camera.position.x + direction.x * placeDistance);
            const portalY = -0.5;
            const portalZ = Math.round(state.camera.position.z + direction.z * placeDistance)
            if (portalCoords[0][0] === Infinity) {
                console.log("portal 1")
                setPortalCoords([[portalX, portalY, portalZ], [Infinity, Infinity, Infinity]]);
            }
            else if (portalCoords[1][0] === Infinity) {
                console.log("portal 2")
                if (portalX === portalCoords[0][0] && portalZ === portalCoords[0][2]) return;
                setPortalCoords(oldPortalCoords => [oldPortalCoords[0], [portalX, portalY, portalZ]]);
            }

            timeSincePortalPress = 0;
        }

        if (keys.current["o"]) {
            setPortalCoords([[Infinity, Infinity, Infinity], [Infinity, Infinity, Infinity]])
        }

        timeSinceBuildModePress += delta;
        timeSincePortalPress += delta;
        timeSincePortalTeleport += delta;
    });

    return (
        (buildMode ? <mesh ref={previewMeshRef}>
                        <boxGeometry />
                        <meshStandardMaterial color={"white"} transparent opacity={0.4} />
                     </mesh> : <>hi</>)
    )
}

export default Player;