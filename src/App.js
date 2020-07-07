import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';

import { isProblemDifficult, fStatusLights, fMapLights, fIdt_mtrx, F2_Gauss_Jordan, toShowAnsMap } from './modules/lightsout';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });


////////////////////////////////////////////////////////////////////////////
//                            パズルの定義
////////////////////////////////////////////////////////////////////////////

const N = 3;

// TODO FIXME N=3 only
const boxSize = window.innerWidth > window.innerHeight ? 1 : 0.5;

// Light Outs ライトの初期値
const statusLights = fStatusLights(N);

// この問題に関して、解が一意的に存在するか判定しやすいかの是非
console.log(
    isProblemDifficult(N) ? "Difficult" : "Easy"
);

// 拡大隣接行列->単位行列にする予定
const toIdt = fMapLights(N);

// 単位行列->拡大隣接行列の逆行列にする予定
const mapLightsInv = fIdt_mtrx(N);

// 拡大隣接行列の逆行列　存在しない時はnull
const toAnsMtrx = F2_Gauss_Jordan(N, toIdt, mapLightsInv);

// 答の場所を示すライトの位置の初期値
const defaultAnsMap = [];
for (let i = 0; i < N; i++) {
    defaultAnsMap[i] = [];
    for (let j = 0; j < N; j++) defaultAnsMap[i][j] = 0;
}

// 答の場所を示すライトの位置
let ansMap = JSON.parse(JSON.stringify(defaultAnsMap));

let showAnsFlag = false;

////////////////////////////////////////////////////////////////////////////


// TODO コンポーネント分け
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

    if (!isProblemDifficult(N) && toAnsMtrx) {
        ansMap = toShowAnsMap(statusLights.flat(), toAnsMtrx, N);
    }

    console.log(statusLights.map(xs => {return xs.join(", ")}).join("\n"));
}

function Box(props) {
    const mesh = useRef();

    let y = parseInt(props.position[0]/(boxSize+boxSize/2)+1),
        x = (N-1)-parseInt(props.position[1]/(boxSize+boxSize/2)+1);

    useFrame(() => {(showAnsFlag && ansMap[x][y]===1) ? mesh.current.rotation.y += 0.1 : mesh.current.rotation.y = 0 });

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
                    setState({...state, active: statusLights, answer: ansMap});
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
    active: statusLights,
    answer: ansMap
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

// <CameraController />
function App() {
    return (
        <div className="app-container">
            <button
                onClick={(e) => { showAnsFlag = !showAnsFlag } }
                className="ans-show-button">SHOW ANSWER</button>
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <MatrixBox />
            </Canvas>
        </div>
    );
}

export default App;
