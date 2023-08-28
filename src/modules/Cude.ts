import * as THREE from 'three';
import type {Accessor} from 'solid-js';
import {createCubes, createCube, cubeSpin, effectCubes} from './cube.module';

export type CubeMesh = THREE.Mesh<
  THREE.BoxGeometry,
  THREE.MeshStandardMaterial
>;
export type CubeColor = 'darkorange' | 'darkslateblue';

export class Cube {
  N: number;
  matrix: number[][];
  boxEachSideLength: number;
  scene: THREE.Scene;
  cubes: CubeMesh[];

  constructor(props: {
    N: number;
    scene: THREE.Scene;
    matrix: number[][];
    boxEachSideLength: number;
  }) {
    this.N = props.N;
    this.scene = props.scene;
    this.matrix = props.matrix;
    this.boxEachSideLength = props.boxEachSideLength;
    this.cubes = this.createCubes(props);
  }

  createCube(props: {
    x: number;
    y: number;
    N: number;
    matrix: number[][];
    boxEachSideLength: number;
    scene: THREE.Scene;
  }) {
    return createCube(props);
  }

  createCubes(props: {
    N: number;
    scene: THREE.Scene;
    matrix: number[][];
    boxEachSideLength: number;
  }) {
    return createCubes(props);
  }

  spin(props: { answer: number[][]; isShowAnswer: Accessor<boolean> }) {
    return cubeSpin({
      ...props,
      cubes: this.cubes,
    });
  }

  effect(props: { x: number; y: number; N: number }) {
    return effectCubes({
      ...props,
      cubes: this.cubes,
    });
  }
}
