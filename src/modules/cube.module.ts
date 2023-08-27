import * as THREE from 'three';
import type {Accessor} from 'solid-js';
export type CubeColor = 'darkorange' | 'darkslateblue';

// FIXME class化

export type Cube = THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;

export const createCubes = (props: {
  N: number;
  scene: THREE.Scene;
  matrix: number[][];
  boxEachSideLength: number;
}) => {
  const {N, scene, matrix, boxEachSideLength} = props;

  const cubes = [...Array(N * N)].map((_, i) => {
    const x = i % N;
    const y = Math.floor(i / N);

    const cube = createCube({x, y, N, matrix, boxEachSideLength, scene});

    return cube;
  });

  return cubes;
};

export const createCube = (props: {
  x: number;
  y: number;
  N: number;
  matrix: number[][];
  boxEachSideLength: number;
  scene: THREE.Scene;
}) => {
  const {x, y, N, matrix, boxEachSideLength, scene} = props;

  const cubeAbsolutePositionX =
    (x - Math.floor(N / 2)) * (boxEachSideLength * 1.25);
  const cubeAbsolutePositionY =
    (y - Math.floor(N / 2)) * (boxEachSideLength * 1.25);
  const cubeAbsolutePositionZ = 0;

  const isLight = matrix[x][y];
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
};

export const cubeSpin = (props: {
  cubes: Cube[];
  answer: number[][];
  isShowAnswer: Accessor<boolean>;
}) => {
  const {cubes, answer, isShowAnswer} = props;

  cubes.forEach((cube) => {
    const {x, y} = cube.userData;
    const isAnswerBox = answer[x][y];

    if (isShowAnswer() && isAnswerBox) {
      cube.rotation.y += 0.1;
    } else {
      cube.rotation.y = 0;
    }
  });
};

export const effectCubes = (props: {
  x: number;
  y: number;
  N: number;
  cubes: Cube[];
}) => {
  const {x, y, cubes, N} = props;

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
            cube.userData.x === candidateX && cube.userData.y === candidateY
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
};
