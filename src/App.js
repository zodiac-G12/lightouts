import React, { useRef, useState } from 'react';
import { Canvas } from 'react-three-fiber';

// import './App.css';

const N = 3;

// TODO FIXME N=3 only
const boxSize = window.innerWidth > window.innerHeight ? 1 : 0.5;

const statusLights = [];
for (let i = 0; i < N; i++) {
    statusLights[i] = [];
    for (let j = 0; j < N; j++) statusLights[i][j] = Math.floor(Math.random()*2);
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

        console.log(x,y)

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

function App() {
  return (
    <Canvas>
        <ambientLight />
        <pointLight position={[100, 100, 100]} />
        <MatrixBox />
    </Canvas>
  );
}

export default App;
