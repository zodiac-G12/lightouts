import * as THREE from 'three';
import type {Accessor} from 'solid-js';

import {LightsOut, Cube, ThreeCanvas} from '@/modules';

const Canvas = (N = 3, isShowAnswer: Accessor<boolean>) => {
  const lightsout = new LightsOut({n: N});

  let answer = lightsout.answer;
  const matrix = lightsout.matrix;

  if (!answer) return;

  const threeCanvas = new ThreeCanvas();

  const {scene, camera, renderer, controls} = threeCanvas;

  const boxEachSideLength = 30.0 / N;

  const cube = new Cube({N, scene, matrix, boxEachSideLength});

  const cubes = cube.cubes;

  document.body.appendChild(renderer.domElement);

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    if (!answer) return;
    cube.spin({isShowAnswer, answer});

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

      if (intersection.length <= 0) {
        return;
      }

      const {object} = intersection[0];

      const selectedCube = cubes.find((cube) => cube.id === object.id);

      if (!selectedCube) {
        return;
      }

      cube.colorChange({cube: selectedCube});

      const {x, y} = selectedCube.userData;

      cube.effect({x, y});

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
    };

    renderer.render(scene, camera);
  };

  return animate();
};

export default Canvas;
