import { useEffect } from 'react';

import { extend, useThree } from 'react-three-fiber';

// ⚠️  CAUTIONS!!!!
// in :973 comment outed
// vim ../node_modules/three/examples/jsm/controls/OrbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

const CameraController = () => {
    const { camera, gl } = useThree();
    const cameraDistance = 700;;
    useEffect(() => {
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

export default CameraController;
