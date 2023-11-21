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

      testCube = CreateTestCube();
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

  if (F) {
    animate();
    F = false;
  }

  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  //
}

function CreateTestCube() {
 

var Material = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.8, 0.8, 0.8),
  roughness: 0.5,
});

var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
var cubeGroupGroupGroup = new THREE.Group();
for (var k = 0; k < 2; k++) {
  var cubeGroupGroup = new THREE.Group();
  for (var j = 0; j < 2; j++) {
    var cubeGroup = new THREE.Group();
    for (var i = 0; i < 9; i++) {
      var cube = new THREE.Mesh(cubeGeometry, Material);
      cube.scale.set(1.21, 1.0, 1.0);
      cube.position.set(7.244 * i, 0, 0);
      cubeGroup.add(cube);
    }
    cubeGroup.position.set(-6.0372 * j, 0, 11.2 * j);
    cubeGroupGroup.add(cubeGroup);
  }
  cubeGroupGroup.position.set(0.0 * k, 6.6 * k, 0);
  cubeGroupGroupGroup.add(cubeGroupGroup);
}
cubeGroupGroupGroup.setRotation(-1.5708, 0.6824, 0.8971);
cubeGroupGroupGroup.position.set(-2.46, 0.0, -0.0);
var out = new THREE.Group();
out.add(cubeGroupGroupGroup);



  const help = new THREE.AxesHelper(10);
  out.add(help);
  return out;
}

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
