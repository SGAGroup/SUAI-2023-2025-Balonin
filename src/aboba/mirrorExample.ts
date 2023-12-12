//#region
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from '../types';

function puts(s: string) {
  console.log(s);
}

function OpenCanvas(_name: string, _WC: number, _HC: number) {
  //
}

const PI: number = 3.14;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let tick: number = 0;

function tick_tick() {
  setTimeout(() => {
    tick += 1;
    tick_tick();
  }, 16);
}

tick_tick();

export function restart(ms: number) {
  setTimeout(main, ms);
}

let sceneexist: boolean | undefined = undefined;

// balon setup begin
let F: boolean = true;
const X = 0,
  Y = 0,
  Z = 0,
  W = 1;

const animatables: {
  doors: {
    left: THREE.Object3D;
    right: THREE.Object3D;
    initPos?: { left: THREE.Vector3; right: THREE.Vector3 };
    transition: number;
    state: boolean;
  }[];
  anchor?: THREE.Mesh;
  mirrorObj?: THREE.Mesh;
  mirroredObj?: THREE.Mesh[];
} = {
  doors: [],
};
// balon setup end

// balon ignore begin
let WC, HC;
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let controls: THREE.OrbitControls;

let testCube: THREE.Object3D;
// balon ignore end

const clock = new THREE.Clock();
function main() {
  // balon block begin
  if (tick == 0) {
    if (typeof sceneexist == 'undefined') {
      OpenCanvas(
        'wCanvas',
        (WC = window.innerWidth * 0.75),
        (HC = window.innerHeight * 0.75),
      );
      CreateScene(WC, HC);

      // balon setup

      testCube = MirrorExample();
      testCube.position.set(X, Y, Z);
      testCube.scale.set(W, W, W);
      // testCube.rotation.set(PI, 0, 0);
      scene.add(testCube);

      render();
    }
  }

  F = true;
  restart(20);
  // balon block end
}
main();

// balon block begin
function render() {
  requestAnimationFrame(render);

  if (true) {
    animate();
    F = false;
  }

  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  clock.getElapsedTime();
  animatables.mirroredObj?.forEach((obj) => scene.remove(obj));

  animatables.anchor?.position.set(
    Math.cos(clock.elapsedTime) * 7,
    Math.cos(clock.elapsedTime * 20) * 2,
    Math.sin(clock.elapsedTime / 2) * 11,
  );

  if (!animatables.mirrorObj) return;
  animatables.mirrorObj.position.set(
    10 + Math.cos(clock.elapsedTime * 4),
    3,
    4 + Math.sin(clock.elapsedTime * 2) * 4,
  );

  const objects = mirror(
    animatables.mirrorObj,
    new Set(['z', 'y', 'x']),
    animatables.anchor?.position,
  );
  objects.forEach((obj) => scene.add(obj));
  animatables.mirroredObj = objects;
}
//#endregion
//#region
function MirrorExample() {
  const geom = new THREE.ConeGeometry();
  const mat = new THREE.MeshStandardMaterial({ color: 0xff5500 });

  const box = new THREE.Mesh(geom, mat);
  box.scale.set(1, 3, 1);
  box.rotation.set(PI / 2, PI / 3, PI / 4);
  box.position.set(3, 4, 5);
  animatables.mirrorObj = box;

  const anchor = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial(),
  );
  anchor.position.set(5, 2, 9);
  animatables.anchor = anchor;

  const axesHelper = new THREE.AxesHelper(3);

  const out = new THREE.Object3D();
  out.add(axesHelper, anchor);
  return out;
}

///obj - Объект для отражения
///axes - оси для отражения
function mirror(
  obj: THREE.Mesh,
  axes: Set<'x' | 'y' | 'z'>,
  anchor: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
) {
  const localObj = [obj];
  for (const axe of axes) {
    const clones = localObj.map((obj) => obj.clone());
    for (const clone of clones) {
      clone.rotation.set(
        axe === 'x' ? clone.rotation.x : -clone.rotation.x,
        axe === 'y' ? clone.rotation.y : -clone.rotation.y,
        axe === 'z' ? clone.rotation.z : -clone.rotation.z,
      );

      //Why 'Y' mirror requieres negative scale, while other axes don't?
      if (axe === 'y') {
        clone.geometry = clone.geometry.clone().scale(-1, -1, 1);
      }
      clone.position.set(
        axe === 'x' ? anchor.x * 2 - clone.position.x : clone.position.x,
        axe === 'y' ? anchor.y * 2 - clone.position.y : clone.position.y,
        axe === 'z' ? anchor.z * 2 - clone.position.z : clone.position.z,
      );
    }
    clones.forEach((obj) => localObj.push(obj));
  }
  return localObj;
}

//#region
function CreateScene(WC: number, HC: number) {
  THREE.Object3D.prototype.setRotation = function (
    x_rot: number,
    y_rot: number,
    z_rot: number,
  ) {
    this.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), x_rot);
    this.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), z_rot);
    this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y_rot);
  };

  if (typeof sceneexist == 'undefined') {
    sceneexist = true;
    // объявление сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444488);
    camera = new THREE.PerspectiveCamera(30, WC / HC, 1, 1000);
    camera.position.x = -40;
    camera.position.y = 70;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // привяжем отрисовку к html и высоте канвы
    // renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('wCanvas')?.appendChild(renderer.domElement);
    renderer.setSize(WC, HC);
    // установим модуль управления камерой
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    // источники света
    scene.add(new THREE.AmbientLight(0x555555, 2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, -2, 4).normalize();
    directionalLight2.position.set(-5, 2, 4).normalize();
    scene.add(directionalLight);
    scene.add(directionalLight2);

    // balon ignore
    document.body.appendChild(renderer.domElement);
  }
}
// balon block end
//#endregion
