import React, { useRef, useState, useEffect } from 'react';
import { Canvas, extend, useThree } from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

// import './App.css';

const N = 3;

// TODO FIXME N=3 only
const boxSize = window.innerWidth > window.innerHeight ? 1 : 0.5;

const statusLights = [];
for (let i = 0; i < N; i++) {
    statusLights[i] = [];
    for (let j = 0; j < N; j++) statusLights[i][j] = Math.floor(Math.random()*2);
}

const mapLights = [];
for (let i = 0; i < N*N; i++) {
    mapLights[i] = [];
    for (let j = 0; j < N*N; j++) {
        if (
            i === j ||
            (0 <= i-1 && i-1 === j && j%N!==N-1) ||
            (i+1 < N*N && i+1 === j && j%N!==0) ||
            (0 <= i-N && i-N === j) ||
            (i+N <= N*N && i+N === j)
        ) {
            mapLights[i][j] = 1;
        } else {
            mapLights[i][j] = 0;
        }
    } 
}

console.log(mapLights.map(xs => {return xs.join(", ")}).join("\n"));

const toIdt = JSON.parse(JSON.stringify(mapLights));

console.log(toIdt.map(xs => {return xs.join(", ")}).join("\n"));

const idt_mtrx = [];
for (let i = 0; i < N*N; i++) {
    idt_mtrx[i] = [];
    for (let j = 0; j < N*N; j++) {
        if (i===j) { idt_mtrx[i][j] = 1; }
        else { idt_mtrx[i][j] = 0; }
    }
}

const mapLightsInv = JSON.parse(JSON.stringify(idt_mtrx));

console.log(mapLightsInv.map(xs => {return xs.join(", ")}).join("\n"));

function isIdt_mtrx(mtrx) {
    return !mtrx.some((row,idx1) => {
        return row.some((j,idx2) => {
            return (idx1===idx2&&!j) || (idx1!==idx2&&j);
        });
    });
}

// TODO
// while (!isIdt_mtrx(toIdt)) {
//     // toIdt | mapLightsInv
//
// }

console.log(idt_mtrx.map(xs => {return xs.join(", ")}).join("\n"));

function colorDef(active) {
    if (active) return "darkorange";
    return "darkslateblue";
}

function clickBox(index) {
    const y = index[0],
          x = index[1];
    statusLights[x][y] = ~statusLights[x][y] & 1;

    [[1,0],[0,1],[-1,0],[0,-1]].forEach((add) => {
        if(0<=add[0]+x && add[0]+x<N && 0<=add[1]+y && add[1]+y<N) {
            statusLights[add[0]+x][add[1]+y] = ~statusLights[add[0]+x][add[1]+y] & 1;
        }
    });
    console.log(statusLights.map(xs => {return xs.join(", ")}).join("\n"));
}

function Box(props) {
    const mesh = useRef();

    return (
        <mesh
            {...props}
            ref={mesh} >
                <boxBufferGeometry attach="geometry" args={[boxSize, boxSize, boxSize]} />
                <meshStandardMaterial attach="material" color={props.color} />
        </mesh>
    );
}

function MatrixBox(props) {
    const mesh = useRef();

    const [state, setState] = useState(props);

    // TODO FIXME N=3 only
    const preIdx = [-1*(boxSize+boxSize/2), 0, boxSize+boxSize/2];

    const idxes = preIdx.map(i => {return preIdx.map(j => {return [i, j, 0] }) }).flat();

    const lists = [];

    for(let xyz in idxes) {
        // TODO FIXME N=3 only
        let y = parseInt(idxes[xyz][0]/(boxSize+boxSize/2)+1),
            x = (N-1)-parseInt(idxes[xyz][1]/(boxSize+boxSize/2)+1);

        lists.push(
            <Box
                onClick={(e) => {
                    clickBox([y,x]);
                    setState({...state, active: statusLights});
                } }
                key={xyz}
                position={idxes[xyz]}
                color={colorDef(state.active[x][y])}
            />
        );
    }

    return (
        <mesh>{lists}</mesh>
    );
}

MatrixBox.defaultProps = {
    active: statusLights
}

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 3;
            controls.maxDistance = 20;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

function App() {
    return (
        <Canvas>
            <CameraController />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <MatrixBox />
        </Canvas>
    );
}

export default App;
