import React, { useRef, useLayoutEffect } from "react"
import type { Vector3DCoordinatesArray } from "../../types/types"
import { useFrame } from "@react-three/fiber"
import { Float, Sky, Stars, /*useHelper*/ } from "@react-three/drei"
// import { DirectionalLightHelper, Color } from "three"

function DynamicSky(): React.JSX.Element {
    const sunPosition = useRef<Vector3DCoordinatesArray>([0,150,0]);

    const lightRef = useRef<any>(null);
    const skyRef = useRef<any>(null);
    const starRef = useRef<any>(null);
    const skyGroupRef = useRef<any>(null);

    let timeOfDay: number = 300;

    // useHelper(lightRef, DirectionalLightHelper, 10, "red")

    useLayoutEffect(() => {
        const camera = lightRef.current.shadow.camera;
        camera.left = -60;
        camera.right = 60;
        camera.top = 50;
        camera.bottom = -50;
        camera.near = 100;
        camera.far = 300;
        lightRef.current.shadow.normalBias = 0.06;
        lightRef.current.shadow.mapSize.set(2048, 2048);
        if (lightRef.current.shadow.map) {
            lightRef.current.shadow.dispose();
            lightRef.current.shadow.map = null;
        }
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        lightRef.current.updateMatrixWorld();
        lightRef.current.target.updateMatrixWorld();
        if (skyRef.current) {
            if (skyRef.current.material.fragmentShader.includes("CustomSunColorAppliedKey")) return
            // const color = new Color("rgb(255, 200, 100)");
            // const vec3String: string = `vec3(${color.r.toFixed(4)}, ${color.g.toFixed(4)}, ${color.b.toFixed(4)})`
            skyRef.current.material.fragmentShader = skyRef.current.material.fragmentShader.replace('const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324', 'const float sunAngularDiameterCos = 0.999')
            /* skyRef.current.material.fragmentShader = skyRef.current.material.fragmentShader.replace(/gl_FragColor\s*=\s*vec4\s*\(\s*retColor\s*,\s*1\.0\s*\)\s*;/, 
                                                `
                                                // CustomSunColorAppliedKey
                                                vec3 yellowSun = ${vec3String};

                                                float halo = pow(max(cosTheta, 0.0), 80.0);
                                                float sunMask = clamp(sundisk + halo, 0.0, 1.0);

                                                retColor = mix(retColor, yellowSun, sunMask);

                                                gl_FragColor = vec4(retColor, 1.0);`); */
            console.log(skyRef.current.material.fragmentShader)
            skyRef.current.material.needsUpdate = true;
        }
    }, []);

    useFrame((state) => {
        timeOfDay = (state.clock.elapsedTime + 300) % 600;
        
        const newSunPosition: Vector3DCoordinatesArray = [-160 * Math.sin((Math.PI / 300) * timeOfDay), 
                                                          -150 * Math.cos((Math.PI / 300) * timeOfDay) + (10 * Math.sin((Math.PI / 300) * timeOfDay) ** 2), 0];
        
        sunPosition.current = newSunPosition;

        if (lightRef.current) {
            const shadowTexelSize = 120 /  lightRef.current.shadow.mapSize.width;

            const snappedX = Math.floor(state.camera.position.x / shadowTexelSize) * shadowTexelSize;
            const snappedZ = Math.floor(state.camera.position.z / shadowTexelSize) * shadowTexelSize;

            lightRef.current.target.position.set(snappedX,0,snappedZ);
            lightRef.current.position.set(sunPosition.current[0], sunPosition.current[1], sunPosition.current[2]);
            lightRef.current.updateMatrixWorld();
            lightRef.current.target.updateMatrixWorld();
            lightRef.current.visible = sunPosition.current[1] > -5;
        }
        if (skyRef.current) {
            skyRef.current.material.uniforms.sunPosition.value.set(sunPosition.current[0], sunPosition.current[1], sunPosition.current[2]);
            skyRef.current.material.uniforms.rayleigh.value = 1 + 7 * ((Math.tanh((timeOfDay - 104) / 2) - Math.tanh((timeOfDay - 246) / 2)) + (Math.tanh((timeOfDay - 404) / 2) - Math.tanh((timeOfDay - 576) / 2)));
        }
        if (starRef.current) {
            starRef.current.position.set(state.camera.position.x, state.camera.position.y, state.camera.position.z)
            starRef.current.visible = sunPosition.current[1] < 10;
        }
        if (skyGroupRef.current) {
            skyGroupRef.current.position.copy(state.camera.position);
        }
    })

    return(<>
        <group ref={skyGroupRef}>
            <directionalLight ref={lightRef} intensity={3} castShadow />
            <Sky ref={skyRef} turbidity={0.8} />
        </group>
        <Float speed={0.5} rotationIntensity={0.75} floatIntensity={0.5} >
                <Stars ref={starRef} radius={100} depth={100} saturation={3} fade />
        </Float>
        </>)
}

export default DynamicSky