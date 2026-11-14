function TreeLog(): React.JSX.Element {
    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 6, 1]} />
            <meshLambertMaterial color={"brown"} />
        </mesh>
    )
}

export default TreeLog; 