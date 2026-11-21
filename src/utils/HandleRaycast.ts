import type { ThreeEvent } from "@react-three/fiber";
import type { Vector3DCoordinatesObject } from "../types/types";

let lastHitValue: Vector3DCoordinatesObject | null = null;

function handleRaycastEvent(event: ThreeEvent<PointerEvent>, deleteMode = false): void {
    event.stopPropagation();
    if (!event.face || event.distance < 1.5 || event.distance > 6.75) return
    const [hitX, hitY, hitZ] = event?.point ?? [0,0,0];

    const normal = event.face.normal.clone();
    normal.transformDirection(event.object.matrixWorld);

    const offsetX = normal.x === 1 ? -1 : 0;
    const offsetY = -0.5;
    const offsetZ = normal.z === 1 ? -1 : 0;

    if (deleteMode) {
        normal.x = 0;
        normal.y = 0;
        normal.z = 0;
    } 

    const snappedHitCoords: Vector3DCoordinatesObject = {x: Math.round(hitX) + normal.x + offsetX, y: Math.max(Math.round(hitY) + normal.y + offsetY, -0.5), z: Math.round(hitZ) + normal.z + offsetZ};

    lastHitValue = snappedHitCoords;
}

export function getLastHitValue(): Vector3DCoordinatesObject {
    return lastHitValue ?? {x: 0, y: 0, z: 0}
}

export default handleRaycastEvent;