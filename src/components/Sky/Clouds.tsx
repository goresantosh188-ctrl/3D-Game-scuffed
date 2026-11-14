import { Cloud, Clouds } from "@react-three/drei";
import React, { useMemo, useRef } from "react"
import type { Vector3DCoordinatesArray } from "../../types/types";
import { useFrame } from "@react-three/fiber";
import type { Group, Object3DEventMap } from "three";

function CustomClouds({count, windSpeed}: {count: number, windSpeed: number}): React.JSX.Element {
    const cloudRefs = useRef<(Group<Object3DEventMap> | null)[]>([]);

    const clouds = useMemo(() => {
        const minBoundX = 3;
        const maxBoundX = 8;
        const minBoundY = 1;
        const maxBoundY = 2;
        const minBoundZ = 1;
        const maxBoundZ = 3;
        const minPositionX = -1000;
        const maxPositionX = 1000;
        const minPositionY = 300;
        const maxPositionY = 500;
        const minPositionZ = -1000;
        const maxPositionZ = 1000;
        return Array.from({length: count}, (_, index): {
                                                        id: number, 
                                                        bounds: Vector3DCoordinatesArray, 
                                                        position: Vector3DCoordinatesArray, 
                                                        opacity: number, 
                                                        speed: number, 
                                                        volume: number} => ({
            id: index,
            bounds: [
                Math.random() * (maxBoundX - minBoundX + 1) + minBoundX,
                Math.random() * (maxBoundY - minBoundY + 1) + minBoundY,
                Math.random() * (maxBoundZ - minBoundZ + 1) + minBoundZ
            ],
            position: [
                Math.random() * (maxPositionX - minPositionX + 1) + minPositionX,
                Math.random() * (maxPositionY - minPositionY + 1) + minPositionY,
                Math.random() * (maxPositionZ - minPositionZ + 1) +  minPositionZ
            ],
            opacity: (Math.random() + 0.5) % 1,
            speed: Math.abs(Math.random() - 0.5),
            volume: Math.random() * (6 - 5) + 4
        }))
    }, [])

    let spread = 2000;
    useFrame((_,delta) => {
        const halfSpread = spread / 2
        cloudRefs.current.forEach(cloudRef => {
            if (!cloudRef) return
            cloudRef.position.x += (Math.random() * windSpeed) * delta

            if (cloudRef.position.x > halfSpread) {
                cloudRef.position.x = -halfSpread;
            }
        })
    })

    return(<>
        <Clouds limit={20000} frustumCulled={false} castShadow>
            {clouds.map((cloud, index) => (
                <Cloud key={cloud.id} ref={(el) => {cloudRefs.current[index] = el}} position={cloud.position} bounds={cloud.bounds} opacity={cloud.opacity} speed={cloud.speed} volume={cloud.volume} seed={useMemo<number>(() => (Math.random()), [])} fade={30} scale={15} />
            ))}
        </Clouds>
        </>)
}

export default CustomClouds;