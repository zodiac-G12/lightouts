// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';

import * as serviceWorker from './serviceWorker';

//
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA

import ReactDOM from 'react-dom';
import React, { useRef, useState } from 'react';
import { Canvas } from 'react-three-fiber';

const N = 3;

const statusLights = [];
for (let i = 0; i < N; i++) {
    statusLights[i] = [];
    for (let j = 0; j < N; j++) statusLights[i][j] = 0;
}

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
                <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                <meshStandardMaterial attach="material" color={props.color} />
        </mesh>
    );
}

function MatrixBox(props) {
    const mesh = useRef();

    const [state, setState] = useState(props);

    const preIdx = [-1.5, 0, 1.5];

    const idxes = preIdx.map(i => {return preIdx.map(j => {return [i, j, 0] }) }).flat();

    const lists = [];

    for(let xyz in idxes) {
        let y = parseInt(idxes[xyz][0]/1.5+1),
            x = 2-parseInt(idxes[xyz][1]/(1.5)+1);

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

ReactDOM.render(
    <Canvas>
        <ambientLight />
        <pointLight position={[100, 100, 100]} />
        <MatrixBox />
    </Canvas>,
    document.getElementById('root')
);

serviceWorker.unregister();
