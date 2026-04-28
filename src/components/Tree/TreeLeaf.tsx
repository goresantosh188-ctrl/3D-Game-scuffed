function TreeLeaf({ leafAddX = 0, leafAddY = 0, leafAddZ = 0 }: { leafAddX?: number, leafAddY?: number, leafAddZ?: number }): React.JSX.Element {
    return (
        <>
        <mesh position={[leafAddX, leafAddY, leafAddZ]}>
            <boxGeometry />
            <meshLambertMaterial color={"green"} />
        </mesh>
        <mesh position={[leafAddX, leafAddY + 1, leafAddZ]}>
            <boxGeometry />
            <meshLambertMaterial color={"green"} />
        </mesh>
        </>
    )
}

export default TreeLeaf;