type Vector3DCoordinatesArray = [x: number, y: number, z: number];
type Vector3DCoordinatesObject = {x: number, y: number, z: number};

type TreePos = Vector3DCoordinatesObject;

type PortalStartPos = Vector3DCoordinatesArray;
type PortalEndPos = Vector3DCoordinatesArray;

type PortalPos = [PortalStartPos, PortalEndPos]

export type { TreePos, PortalPos, Vector3DCoordinatesArray, Vector3DCoordinatesObject }