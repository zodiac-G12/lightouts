import * as THREE from 'three';
import type {Accessor} from 'solid-js';

// 🚨 !!!!CAUTIONS!!!!
// in :973 comment outed
// vim /node_modules/three/examples/jsm/controls/OrbitControls.js
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {LightsOut} from './modules/LightsOut';
import {
  createCubes,
  cubeSpin,
  CubeColor,
  effectCubes,
} from './modules/cube.module';

const Canvas = (N = 3, isShowAnswer: Accessor<boolean>) => {
  const lightsout = new LightsOut({n: N});

  let answer = lightsout.answer;
  const matrix = lightsout.matrix;

  if (!answer) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      20000
  );
  camera.position.set(0, 0, 100);

  const light = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 4, 10, 0.5);
  light.position.set(20, 20, 40);
  scene.add(light);

  const boxEachSideLength = 30.0 / N;

  const cubes = createCubes({N, scene, matrix, boxEachSideLength});

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    if (!answer) return;
    cubeSpin({isShowAnswer, answer, cubes});

    // FIXME
    document.onmousedown = (event) => {
      event.preventDefault();

      const raycaster = new THREE.Raycaster();

      const vector = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * -2 + 1
      );

      raycaster.setFromCamera(vector, camera);

      const intersection = raycaster.intersectObjects(cubes);

      if (intersection.length > 0) {
        const {object} = intersection[0];

        const selectedCube = cubes.find((cube) => cube.id === object.id);

        if (selectedCube) {
          const {isLight: isLightBefore, x, y} = selectedCube.userData;

          const isLightNow = !isLightBefore;
          const boxColorNow: CubeColor = isLightNow ?
            'darkorange' :
            'darkslateblue';

          selectedCube.userData.isLight = isLightNow;
          selectedCube.material.color.setColorName(boxColorNow);

          console.log(selectedCube.userData);

          effectCubes({x, y, N, cubes});

          const nowLightStatuses: number[] = cubes
              .sort(
                  (cubeA, cubeB) =>
                    cubeA.userData.x - cubeB.userData.x ||
                cubeA.userData.y - cubeB.userData.y
              )
              .map((cube): number => {
                return cube.userData.isLight ? 1 : 0;
              });

          console.log('nowLightStatuses', nowLightStatuses);

          lightsout.update({states: nowLightStatuses});
          answer = lightsout.answer;
          lightsout.getAnswer();
        }
      }
    };

    renderer.render(scene, camera);
  };

  return animate();
};

export default Canvas;
