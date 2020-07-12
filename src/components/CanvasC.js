import React from 'react';

import { Canvas } from 'react-three-fiber';

import ThreeMatrixBox from '../components/ThreeMatrixBox';
import CameraController from '../components/CameraController';

function CanvasC(props) {
    return (
        <Canvas>
            <CameraController />
            <ambientLight />
            <pointLight position={[0, 0, 1000]} />
            <ThreeMatrixBox showAnsFlag={props.showAnsFlag} />
        </Canvas>
    );
}

export default CanvasC;
