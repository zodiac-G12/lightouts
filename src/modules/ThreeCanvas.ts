import * as THREE from 'three';

// 🚨 !!!!CAUTIONS!!!!
// in :973 comment outed
// vim /node_modules/three/examples/jsm/controls/OrbitControls.js
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export class ThreeCanvas {
  scene: THREE.Scene;
  camera: THREE.Camera;
  light: THREE.SpotLight;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  constructor() {
    this.camera = this.createCamera();
    this.scene = this.createScene();
    this.light = this.createLight();
    this.renderer = this.createRenderer();
    this.controls = this.createControls();
  }

  createScene() {
    const scene = new THREE.Scene();

    return scene;
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        20000
    );
    camera.position.set(0, 0, 100);

    return camera;
  }

  createLight() {
    const light = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 4, 10, 0.5);
    light.position.set(20, 20, 40);

    this.scene.add(light);

    return light;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
  }

  createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    return controls;
  }
}
