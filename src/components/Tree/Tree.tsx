import TreeLeaf from "./TreeLeaf";
import TreeLog from "./TreeLog";

function Tree({ position }: { position?: [x: number, y: number, z: number] }): React.JSX.Element {
    return (
        <group position={position}>
            <TreeLog />
            <TreeLeaf leafAddY={2.5} leafAddZ={1} />
            <TreeLeaf leafAddX={1} leafAddY={2.5} leafAddZ={1} />
            <TreeLeaf leafAddX={-1} leafAddY={2.5} leafAddZ={1} />
            <TreeLeaf leafAddX={1} leafAddY={2.5} />
            <TreeLeaf leafAddX={-1} leafAddY={2.5} />
            <TreeLeaf leafAddY={2.5} leafAddZ={-1} />
            <TreeLeaf leafAddX={1} leafAddY={2.5} leafAddZ={-1} />
            <TreeLeaf leafAddX={-1} leafAddY={2.5} leafAddZ={-1} />
            <TreeLeaf leafAddY={2.5} />
        </group>
    )
}

export default Tree;