import * as THREE from 'three';
import type {Accessor} from 'solid';

// 🚨 !!!!CAUTIONS!!!!
// in :973 comment outed
// vim /node_modules/three/examples/jsm/controls/OrbitControls.js
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {fStatusLights} from '@/modules/lightsout';
import {
  fMapLights,
  fIdt_mtrx,
  F2_Gauss_Jordan,
  toShowAnsMap,
} from '@/modules/lightsout';

// FIXME (^^)
type CubeColor = 'darkorange' | 'darkslateblue';

const Canvas = (N = 3, isShowAnswer: Accessor<boolean>) => {
  // 拡大隣接行列->単位行列にする予定
  const toIdt = fMapLights(N);

  // 単位行列->拡大隣接行列の逆行列にする予定
  const mapLightsInv = fIdt_mtrx(N);

  // 拡大隣接行列の逆行列　存在しない時はnull
  const toAnsMtrx = F2_Gauss_Jordan(N, toIdt, mapLightsInv);

  if (!toAnsMtrx) return;

  const firstLightStatuses = fStatusLights(N);

  let ansMap = toShowAnsMap(firstLightStatuses.flat(), toAnsMtrx, N);

  console.log(
      firstLightStatuses
          .map((xs) => {
            return xs.join(', ');
          })
          .join('\n')
  );
  console.log(
      ansMap
          .map((xs) => {
            return xs.join(', ');
          })
          .join('\n')
  );

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

  const cubes = [...Array(N * N)].map((_, i) => {
    const x = i % N;
    const y = Math.floor(i / N);

    const cubeAbsolutePositionX =
      (x - Math.floor(N / 2)) * (boxEachSideLength * 1.25);
    const cubeAbsolutePositionY =
      (y - Math.floor(N / 2)) * (boxEachSideLength * 1.25);
    const cubeAbsolutePositionZ = 0;

    const isLight = firstLightStatuses[x][y];
    const boxColor: CubeColor = isLight ? 'darkorange' : 'darkslateblue';

    const geometry = new THREE.BoxGeometry(
        boxEachSideLength,
        boxEachSideLength,
        boxEachSideLength
    );
    const material = new THREE.MeshStandardMaterial({
      color: boxColor,
      roughness: 0.5,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
        cubeAbsolutePositionX,
        cubeAbsolutePositionY,
        cubeAbsolutePositionZ
    );
    cube.userData = {x, y, isLight};

    scene.add(cube);

    return cube;
  });

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    cubes.forEach((cube) => {
      const {x, y} = cube.userData;
      const isAnswerBox = ansMap[x][y];

      if (isShowAnswer() && isAnswerBox) {
        cube.rotation.y += 0.1;
      } else {
        cube.rotation.y = 0;
      }
    });

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
          const boxColorNow = isLightNow ? 'darkorange' : 'darkslateblue';

          selectedCube.userData.isLight = isLightNow;
          selectedCube.material.color.setColorName(boxColorNow);

          console.log(selectedCube.userData);

          // FIXME 🌝
          [
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
            {x: 0, y: -1},
          ].forEach((direction) => {
            const candidateX = direction.x + x;
            const candidateY = direction.y + y;
            if (
              0 <= candidateX &&
              candidateX < N &&
              0 <= candidateY &&
              candidateY < N
            ) {
              const candidateCube = cubes.find(
                  (cube) =>
                    cube.userData.x === candidateX &&
                  cube.userData.y === candidateY
              );

              if (!candidateCube) return;

              const {isLight: isLightCandidate} = candidateCube.userData;

              const isLightNowCandidate = !isLightCandidate;
              const boxColorNowCandidate = isLightNowCandidate ?
                'darkorange' :
                'darkslateblue';

              candidateCube.userData.isLight = isLightNowCandidate;
              candidateCube.material.color.setColorName(boxColorNowCandidate);
            }
          });
          const nowLightStatuses = cubes
              .sort(
                  (cubeA, cubeB) =>
                    cubeA.userData.x - cubeB.userData.x ||
                cubeA.userData.y - cubeB.userData.y
              )
              .map((cube) => {
                return cube.userData.isLight ? 1 : 0;
              });

          ansMap = toShowAnsMap(nowLightStatuses.flat(), toAnsMtrx, N);
          console.log(
              ansMap
                  .map((xs) => {
                    return xs.join(', ');
                  })
                  .join('\n')
          );
        }
      }
    };

    renderer.render(scene, camera);
  };

  return animate();
};

export default Canvas;
