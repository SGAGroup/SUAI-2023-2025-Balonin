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
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.381, 0.6477, 0.7046),
  });
  const cube_002Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.9784, 0.6745, 0.5916),
  });
  const cube_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8745, 0.523, 0.0782),
  });
  const cube_004Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.648, 0.8121, 0.5354),
  });
  const cube_005Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8188, 0.9624, 0.8371),
  });
  const cube_006Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.4186, 0.7367, 0.6246),
  });
  const cube_007Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.824, 0.7611, 0.0564),
  });
  const cube_008Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.5433, 0.4723, 0.9211),
  });
  const cube_009Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8885, 0.9729, 0.2731),
  });
  const cube_010Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.5368, 0.9056, 0.9304),
  });
  const cube_011Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.4929, 0.6753, 0.1012),
  });
  const AbobiumMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0017, 0.0, 0.1424),
    roughness: 0.5,
  });
  const cube_012Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.153, 0.0083, 0.1267),
  });
  const cube_014Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0956, 0.1091, 0.9104),
  });
  const cube_015Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.4084, 0.0303, 0.6448),
  });
  const cube_016Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8006, 0.9205, 0.9459),
  });
  const cube_144Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3035, 0.8763, 0.4829),
  });
  const cube_145Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1327, 0.281, 0.1377),
  });

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0.8865, 2.6103, -0.288);
  cube.setRotation(0.5236, 0.0, -1.0472);
  cube.scale.set(13.0823, 0.2679, -21.8795);

  const cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_002 = new THREE.Mesh(cube_002Geometry, cube_002Material);
  cube_002.position.set(-4.6108, -0.5636, 20.9404);
  cube_002.setRotation(0.5236, 0.0, -1.0472);
  cube_002.scale.set(13.0782, 0.2586, -0.2586);

  const cube_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_003 = new THREE.Mesh(cube_003Geometry, cube_003Material);
  cube_003.position.set(-4.7748, -0.6583, 20.2339);
  cube_003.setRotation(0.5236, 0.0, -1.0472);
  cube_003.scale.set(13.0782, 0.2586, -0.2586);

  const cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_004 = new THREE.Mesh(cube_004Geometry, cube_004Material);
  cube_004.position.set(-4.9387, -0.7529, 19.5274);
  cube_004.setRotation(0.5236, 0.0, -1.0472);
  cube_004.scale.set(13.0782, 0.2586, -0.2586);

  const cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_005 = new THREE.Mesh(cube_005Geometry, cube_005Material);
  cube_005.position.set(-5.1026, -0.8476, 18.8209);
  cube_005.setRotation(0.5236, 0.0, -1.0472);
  cube_005.scale.set(13.0782, 0.2586, -0.2586);

  const cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_006 = new THREE.Mesh(cube_006Geometry, cube_006Material);
  cube_006.position.set(-5.2666, -0.9422, 18.1145);
  cube_006.setRotation(0.5236, 0.0, -1.0472);
  cube_006.scale.set(13.0782, 0.2586, -0.2586);

  const cube_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_007 = new THREE.Mesh(cube_007Geometry, cube_007Material);
  cube_007.position.set(-5.4305, -1.0369, 17.408);
  cube_007.setRotation(0.5236, 0.0, -1.0472);
  cube_007.scale.set(13.0782, 0.2586, -0.2586);

  const cube_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_008 = new THREE.Mesh(cube_008Geometry, cube_008Material);
  cube_008.position.set(-5.5945, -1.1315, 16.7015);
  cube_008.setRotation(0.5236, 0.0, -1.0472);
  cube_008.scale.set(13.0782, 0.2586, -0.2586);

  const cube_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_009 = new THREE.Mesh(cube_009Geometry, cube_009Material);
  cube_009.position.set(-5.7584, -1.2262, 15.995);
  cube_009.setRotation(0.5236, 0.0, -1.0472);
  cube_009.scale.set(13.0782, 0.2586, -0.2586);

  const cube_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_010 = new THREE.Mesh(cube_010Geometry, cube_010Material);
  cube_010.position.set(-5.9223, -1.3208, 15.2886);
  cube_010.setRotation(0.5236, 0.0, -1.0472);
  cube_010.scale.set(13.0782, 0.2586, -0.2586);

  const cube_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_011 = new THREE.Mesh(cube_011Geometry, cube_011Material);
  cube_011.position.set(-6.0863, -1.4155, 14.5821);
  cube_011.setRotation(0.5236, 0.0, -1.0472);
  cube_011.scale.set(13.0782, 0.2586, -0.2586);

  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder = new THREE.Mesh(cylinderGeometry, AbobiumMaterial);
  cylinder.position.set(4.589, -6.3835, 11.4101);
  cylinder.setRotation(0.5236, 0.0, -1.0472);
  cylinder.scale.set(1.0, 4.8045, -1.0);

  const cylinder_001Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_001 = new THREE.Mesh(cylinder_001Geometry, AbobiumMaterial);
  cylinder_001.position.set(7.1506, -4.9046, 6.287);
  cylinder_001.setRotation(0.5236, 0.0, -1.0472);
  cylinder_001.scale.set(1.0, 4.8045, -1.0);

  const cylinder_002Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_002 = new THREE.Mesh(cylinder_002Geometry, AbobiumMaterial);
  cylinder_002.position.set(9.7925, -3.3792, 1.003);
  cylinder_002.setRotation(0.5236, 0.0, -1.0472);
  cylinder_002.scale.set(1.0, 4.8045, -1.0);

  const cylinder_003Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_003 = new THREE.Mesh(cylinder_003Geometry, AbobiumMaterial);
  cylinder_003.position.set(12.5984, -1.7592, -4.6088);
  cylinder_003.setRotation(0.5236, 0.0, -1.0472);
  cylinder_003.scale.set(1.0, 4.8045, -1.0);

  const cylinder_004Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_004 = new THREE.Mesh(cylinder_004Geometry, AbobiumMaterial);
  cylinder_004.position.set(15.3679, -0.1603, -10.1477);
  cylinder_004.setRotation(0.5236, 0.0, -1.0472);
  cylinder_004.scale.set(1.0, 4.8045, -1.0);

  const cylinder_005Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_005 = new THREE.Mesh(cylinder_005Geometry, AbobiumMaterial);
  cylinder_005.position.set(-4.7809, 9.8456, 11.4101);
  cylinder_005.setRotation(0.5236, 0.0, -1.0472);
  cylinder_005.scale.set(1.0, 4.8045, -1.0);

  const cylinder_006Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_006 = new THREE.Mesh(cylinder_006Geometry, AbobiumMaterial);
  cylinder_006.position.set(-2.2193, 11.3246, 6.287);
  cylinder_006.setRotation(0.5236, 0.0, -1.0472);
  cylinder_006.scale.set(1.0, 4.8045, -1.0);

  const cylinder_007Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_007 = new THREE.Mesh(cylinder_007Geometry, AbobiumMaterial);
  cylinder_007.position.set(0.4226, 12.8499, 1.003);
  cylinder_007.setRotation(0.5236, 0.0, -1.0472);
  cylinder_007.scale.set(1.0, 4.8045, -1.0);

  const cylinder_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_008 = new THREE.Mesh(cylinder_008Geometry, AbobiumMaterial);
  cylinder_008.position.set(3.2285, 14.4699, -4.6088);
  cylinder_008.setRotation(0.5236, 0.0, -1.0472);
  cylinder_008.scale.set(1.0, 4.8045, -1.0);

  const cylinder_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_009 = new THREE.Mesh(cylinder_009Geometry, AbobiumMaterial);
  cylinder_009.position.set(5.998, 16.0688, -10.1477);
  cylinder_009.setRotation(0.5236, 0.0, -1.0472);
  cylinder_009.scale.set(1.0, 4.8045, -1.0);

  const cube_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_012 = new THREE.Mesh(cube_012Geometry, cube_012Material);
  cube_012.position.set(-0.6189, 1.7411, -1.2916);
  cube_012.setRotation(0.5236, 0.0, -1.0472);
  cube_012.scale.set(19.5184, 0.2679, -21.8795);

  const cube_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_014 = new THREE.Mesh(cube_014Geometry, cube_014Material);
  cube_014.position.set(-8.1636, 19.7609, 0.1379);
  cube_014.setRotation(0.5236, 0.0, -1.0472);
  cube_014.scale.set(0.4091, 3.2368, -21.9766);

  const cube_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_015 = new THREE.Mesh(cube_015Geometry, cube_015Material);
  cube_015.position.set(6.7946, -10.3596, -1.078);
  cube_015.setRotation(0.5236, 0.0, -1.0472);
  cube_015.scale.set(0.0939, -0.2266, -21.8873);

  const cube_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_016 = new THREE.Mesh(cube_016Geometry, cube_016Material);
  cube_016.position.set(8.7181, -13.691, -1.078);
  cube_016.setRotation(0.5236, 0.0, -1.0472);
  cube_016.scale.set(0.0939, -0.2266, -21.8873);

  const cube_144Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_144 = new THREE.Mesh(cube_144Geometry, cube_144Material);
  cube_144.position.set(-9.2342, 17.4032, -1.078);
  cube_144.setRotation(0.5236, 0.0, -1.0472);
  cube_144.scale.set(0.0939, -0.2266, -21.8873);

  const cube_145Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_145 = new THREE.Mesh(cube_145Geometry, cube_145Material);
  cube_145.position.set(-7.3108, 14.0717, -1.078);
  cube_145.setRotation(0.5236, 0.0, -1.0472);
  cube_145.scale.set(0.0939, -0.2266, -21.8873);

  const out = new THREE.Group();
  out.add(
    cube,
    cube_002,
    cube_003,
    cube_004,
    cube_005,
    cube_006,
    cube_007,
    cube_008,
    cube_009,
    cube_010,
    cube_011,
    cylinder,
    cylinder_001,
    cylinder_002,
    cylinder_003,
    cylinder_004,
    cylinder_005,
    cylinder_006,
    cylinder_007,
    cylinder_008,
    cylinder_009,
    cube_012,
    cube_014,
    cube_015,
    cube_016,
    cube_144,
    cube_145,
  );

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
    this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y_rot);
    this.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), z_rot);
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
