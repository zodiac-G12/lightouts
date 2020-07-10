import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';
import * as THREE from "three";

// ⚠️  CAUTIONS!!!!
// in :973 comment outed
// vim ../node_modules/three/examples/jsm/controls/OrbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { isProblemDifficult, fStatusLights, fMapLights, fIdt_mtrx, F2_Gauss_Jordan, toShowAnsMap } from './modules/lightsout';


extend({ OrbitControls });


////////////////////////////////////////////////////////////////////////////
//                            パズルの定義
////////////////////////////////////////////////////////////////////////////

const N = !window.location.href.split("#")[1] || parseInt(window.location.href.split("#")[1]) < 2 ? 3 : parseInt(window.location.href.split("#")[1]);

const baseWid = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
const boxSize = baseWid / (N*2);

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
let ansMap = (!isProblemDifficult(N) && toAnsMtrx) ? toShowAnsMap(statusLights.flat(), toAnsMtrx, N) : JSON.parse(JSON.stringify(defaultAnsMap));

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
        ansMap = JSON.parse(JSON.stringify(toShowAnsMap(statusLights.flat(), toAnsMtrx, N)));
    }

    console.log(statusLights.map(xs => {return xs.join(", ")}).join("\n"));
}

function Box(props) {
    const mesh = useRef();

    const [state, setState] = useState(props);

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


function MatrixBox(props) {
    const mesh = useRef();

    const [state, setState] = useState(props);

    const basezDistance = boxSize + boxSize / 2;

    const preIdx = [...Array(N).keys()].map((_, i) => {
        return (i - Math.floor(N / 2)) * basezDistance + (N&1 ? 0 : basezDistance/2);
    });

    const idxes = preIdx.map(i => {return preIdx.map(j => {return [i, j, 0] }) }).flat();

    const lists = [];

    for(let xyz in idxes) {
        let y = parseInt(idxes[xyz][0] / basezDistance + Math.floor(N/2)),
            x = (N-1)-parseInt(idxes[xyz][1] / basezDistance + Math.floor(N/2));

        lists.push(
            <Box
                onClick={(e) => {
                    clickBox([y,x]);
                    setState({...state, active: statusLights, answer: ansMap});
                } }
                key={xyz}
                y={y}
                x={x}
                showAnsFlag={props.showAnsFlag}
                ansMap={state.answer}
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
    const cameraDistance = 700;;
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            camera.position.set(0, 0, cameraDistance);
            controls.minDistance = 0;
            controls.maxDistance = 1000;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

function App(props) {
    const [state, setState] = useState(props);

    return (
        <div className="app-container">
            <button
                onClick={(e) => { setState({...state, showAnsFlag: !state.showAnsFlag }) } }
                className="ans-show-button">SHOW ANSWER</button>
            <Canvas>
                <CameraController />
                <ambientLight />
                <pointLight position={[0, 0, 1000]} />
                <MatrixBox showAnsFlag={state.showAnsFlag} />
            </Canvas>
        </div>
    );
}

App.defaultProps = {
    showAnsFlag: false
}

export default App;
