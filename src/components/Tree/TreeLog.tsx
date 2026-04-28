function TreeLog(): React.JSX.Element {
    return (
        <mesh>
            <boxGeometry args={[1, 6, 1]} />
            <meshLambertMaterial color={"brown"} />
        </mesh>
    )
}

export default TreeLog; 