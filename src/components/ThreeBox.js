import React, { useRef } from 'react';

import { useFrame } from 'react-three-fiber';

function ThreeBox(props) {
    const mesh = useRef();

    const n = props.n;
    const baseWid = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth*1.25;
    const boxSize = baseWid / (n*2);

    useFrame(() => {(props.showAnsFlag && props.ansMap[props.x][props.y]===1) ? mesh.current.rotation.y += 0.1 : mesh.current.rotation.y = 0 });

    return (
        <mesh
            {...props}
            ref={mesh} >
                <boxBufferGeometry attach="geometry" args={[boxSize, boxSize, boxSize]} />
                <meshStandardMaterial attach="material" color={props.color} />
        </mesh>
    );
}

export default ThreeBox;
