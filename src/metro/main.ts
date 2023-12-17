import * as THREE from '../types';

function puts(s: string) {
  console.log(s);
}

function OpenCanvas(name: string, WC: number, HC: number) {
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

// balon setup end

// balon ignore begin
let WC, HC;
let Station: THREE.Object3D;
let Robot: THREE.Object3D;
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
// @ts-expect-error Type defined in setupcontrols function
let controls: PointerLockControls;
let raycaster: THREE.Raycaster;
let collisions: THREE.Object3D[];

// balon ignore
// controls globals
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let isFly = true;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
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
      initParameters();
      // balon setup

      Station = createMetroStation();
      Station.position.set(X, Y, Z);
      Station.scale.set(W, W, W);
      scene.add(Station);
      collisions.push(Station);

      Robot = createRobot();
      Robot.position.set(X, Y, Z);
      Robot.scale.set(W, W, W);
      scene.add(Robot);

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

  // console.log(velocity);

  if (F) {
    F = false;
  }

  // balon ignore
  // https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html

  const time = performance.now();

  if (controls.isLocked) {
    raycaster.ray.origin.copy(controls.getObject().position);
    // 2m tall
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(collisions, true);
    const isOnObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (!isFly) {
      velocity.y -= 9.8 * 50.0 * delta; // 50.0 = mass
    }

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (!isFly && isOnObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;

    if (!isFly) {
      if (controls.getObject().position.y < -0) {
        // controls.getObject().position.set(-0.572, 1.8259, -0.0787);
        velocity.y = 0;
        controls.getObject().position.y = 0;

        canJump = true;
      }
    }
  }

  prevTime = time;

  // controls.update();
  renderer.render(scene, camera);
}

function initParameters() {
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = true;
  isFly = true;
  prevTime = performance.now();
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  raycaster = new THREE.Raycaster();
  collisions = [];
}

function createRobot() {
  const cuberemoveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.597, 0.6645, 0.7586),
  });

  const cuberemoveGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cuberemove = new THREE.Mesh(cuberemoveGeometry, cuberemoveMaterial);
  cuberemove.position.set(-0.572, 1.8259, -0.0787);
  cuberemove.scale.set(0.5, 1.0, 0.5);

  const out = new THREE.Group();
  out.add(cuberemove);

  return out;
}

function createKolonna() {
  const KolonnaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const LatunMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7836, 0.8, 0.0789),
    metalness: 1.0,
    roughness: 0.5,
  });
  const KolonnayaPlitkaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3672, 0.2714, 0.1523),
    roughness: 0.5,
  });

  const cylinderkolonna_002Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_002 = new THREE.Mesh(
    cylinderkolonna_002Geometry,
    KolonnaMaterial,
  );
  cylinderkolonna_002.position.set(0.0, 0.0, -0.0);
  cylinderkolonna_002.scale.set(0.6216, 2.2292, 0.6216);

  const cylinderkolonna_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_008 = new THREE.Mesh(
    cylinderkolonna_008Geometry,
    LatunMaterial,
  );
  cylinderkolonna_008.position.set(0.0, 2.3675, -0.0);
  cylinderkolonna_008.scale.set(0.7011, 0.2069, 0.7011);

  const cylinderkolonna_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_009 = new THREE.Mesh(
    cylinderkolonna_009Geometry,
    LatunMaterial,
  );
  cylinderkolonna_009.position.set(0.0, 2.2569, -0.0);
  cylinderkolonna_009.scale.set(0.7436, 0.0517, 0.7436);

  const cylinderkolonna_010Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_010 = new THREE.Mesh(
    cylinderkolonna_010Geometry,
    LatunMaterial,
  );
  cylinderkolonna_010.position.set(0.0, 2.5751, -0.0);
  cylinderkolonna_010.scale.set(0.7436, 0.0517, 0.7436);

  const cylinderkolonna_011Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_011 = new THREE.Mesh(
    cylinderkolonna_011Geometry,
    LatunMaterial,
  );
  cylinderkolonna_011.position.set(0.0, -2.0552, -0.0);
  cylinderkolonna_011.scale.set(0.7011, 0.2069, 0.7011);

  const cylinderkolonna_012Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderkolonna_012 = new THREE.Mesh(
    cylinderkolonna_012Geometry,
    LatunMaterial,
  );
  cylinderkolonna_012.position.set(0.0, -2.0598, -0.0);
  cylinderkolonna_012.scale.set(0.7436, 0.0827, 0.7436);

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(cubeGeometry, KolonnayaPlitkaMaterial);
  cube.position.set(0.0, 2.6176, -0.0);
  cube.scale.set(0.8355, 0.0763, 0.8355);

  const cube_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_001 = new THREE.Mesh(cube_001Geometry, KolonnayaPlitkaMaterial);
  cube_001.position.set(0.0, -0.4172, -0.9191);
  cube_001.scale.set(1.0, 1.9289, 1.0);

  const cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_002 = new THREE.Mesh(cube_002Geometry, KolonnayaPlitkaMaterial);
  cube_002.position.set(0.0, 2.7032, -0.9191);
  cube_002.scale.set(1.55, 1.55, 1.0);
  cube_002.setRotation(0.0, 0.0, -0.7854);

  const out = new THREE.Group();
  out.add(
    cylinderkolonna_002,
    cylinderkolonna_008,
    cylinderkolonna_009,
    cylinderkolonna_010,
    cylinderkolonna_011,
    cylinderkolonna_012,
    cube,
    cube_001,
    cube_002,
  );

  return out;
}

function createMetroStation() {
  const PortretMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0128, 0.8),
    roughness: 0.5,
  });
  const LatunMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7836, 0.8, 0.0789),
    metalness: 1.0,
    roughness: 0.2,
  });
  const Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8, 0.8, 0.8),
    roughness: 0.5,
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const GlassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3264, 0.3264, 0.3264),
    transparent: true,
    opacity: 0.315,
    roughness: 0.5,
  });
  const Metal_004Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Metal_005Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Metal_006Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Metal_001Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Metal_002Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Metal_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const NapolnayaPlitkaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.686, 0.6165, 0.3163),
    roughness: 0.5,
  });
  const KolonnaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });

  const cubeportretGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeportret = new THREE.Mesh(cubeportretGeometry, PortretMaterial);
  cubeportret.position.set(-31.329, 5.0889, -0.0053);
  cubeportret.scale.set(0.18, 4.5456, 3.3873);

  const cubeobramlenieGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeobramlenie = new THREE.Mesh(cubeobramlenieGeometry, LatunMaterial);
  cubeobramlenie.position.set(-31.329, 5.0889, 3.5536);
  cubeobramlenie.scale.set(0.2035, 5.141, 0.2341);

  const cubeobramlenie_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeobramlenie_001 = new THREE.Mesh(
    cubeobramlenie_001Geometry,
    LatunMaterial,
  );
  cubeobramlenie_001.position.set(-31.329, 5.0889, -3.667);
  cubeobramlenie_001.scale.set(0.2035, 5.141, 0.2341);

  const cubeobramlenie_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeobramlenie_002 = new THREE.Mesh(
    cubeobramlenie_002Geometry,
    LatunMaterial,
  );
  cubeobramlenie_002.position.set(-31.329, 9.9821, -0.005);
  cubeobramlenie_002.scale.set(0.2035, 3.6351, 0.2712);
  cubeobramlenie_002.setRotation(1.5708, 0.0, 0.0);

  const cubemalayakrysha_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubemalayakrysha_001 = new THREE.Mesh(
    cubemalayakrysha_001Geometry,
    Material,
  );
  cubemalayakrysha_001.scale.set(38.6631, 0.1743, 2.2653);
  const cubemalayakrysha_001MZ = cubemalayakrysha_001.clone();
  cubemalayakrysha_001.position.set(0, 0, 6.7442);
  cubemalayakrysha_001MZ.position.set(0, 0, -6.7442);
  cubemalayakrysha_001.setRotation(0.7209, 0.0, 0.0);
  cubemalayakrysha_001MZ.setRotation(-0.7209, -0.0, 0.0);
  const cubemalayakrysha_001MirroredZ = new THREE.Group();
  cubemalayakrysha_001MirroredZ.add(
    cubemalayakrysha_001,
    cubemalayakrysha_001MZ,
  );
  cubemalayakrysha_001MirroredZ.position.set(0.0, 9.163, 0);
  const cubemalayakryshaGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubemalayakrysha = new THREE.Mesh(cubemalayakryshaGeometry, Material);
  cubemalayakrysha.scale.set(38.6631, 0.1744, 2.8073);
  const cubemalayakryshaMZ = cubemalayakrysha.clone();
  cubemalayakrysha.position.set(0, 0, 2.6229);
  cubemalayakryshaMZ.position.set(0, 0, -2.6229);
  cubemalayakrysha.setRotation(0.034, 0.0, 0.0);
  cubemalayakryshaMZ.setRotation(-0.034, -0.0, 0.0);
  const cubemalayakryshaMirroredZ = new THREE.Group();
  cubemalayakryshaMirroredZ.add(cubemalayakrysha, cubemalayakryshaMZ);
  cubemalayakryshaMirroredZ.position.set(0.0, 10.6341, 0);
  const cubebolshayakrysha_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubebolshayakrysha_001 = new THREE.Mesh(
    cubebolshayakrysha_001Geometry,
    Material,
  );
  cubebolshayakrysha_001.scale.set(49.229, 0.1743, 4.7993);
  const cubebolshayakrysha_001MZ = cubebolshayakrysha_001.clone();
  cubebolshayakrysha_001.position.set(0, 0, 19.5416);
  cubebolshayakrysha_001MZ.position.set(0, 0, -19.5416);
  cubebolshayakrysha_001.setRotation(0.7209, 0.0, 0.0);
  cubebolshayakrysha_001MZ.setRotation(-0.7209, -0.0, 0.0);
  const cubebolshayakrysha_001MirroredZ = new THREE.Group();
  cubebolshayakrysha_001MirroredZ.add(
    cubebolshayakrysha_001,
    cubebolshayakrysha_001MZ,
  );
  cubebolshayakrysha_001MirroredZ.position.set(-1.2151, 9.163, 0);
  const cubebolshayakrysha_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubebolshayakrysha_002 = new THREE.Mesh(
    cubebolshayakrysha_002Geometry,
    Material,
  );
  cubebolshayakrysha_002.scale.set(49.229, 0.1744, 5.1262);
  const cubebolshayakrysha_002MZ = cubebolshayakrysha_002.clone();
  cubebolshayakrysha_002.position.set(0, 0, 11.5094);
  cubebolshayakrysha_002MZ.position.set(0, 0, -11.5094);
  cubebolshayakrysha_002.setRotation(0.4408, 0.0, 0.0);
  cubebolshayakrysha_002MZ.setRotation(-0.4408, -0.0, 0.0);
  const cubebolshayakrysha_002MirroredZ = new THREE.Group();
  cubebolshayakrysha_002MirroredZ.add(
    cubebolshayakrysha_002,
    cubebolshayakrysha_002MZ,
  );
  cubebolshayakrysha_002MirroredZ.position.set(-1.2151, 14.4925, 0);
  const cubebolshayakrysha_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubebolshayakrysha_003 = new THREE.Mesh(
    cubebolshayakrysha_003Geometry,
    Material,
  );
  cubebolshayakrysha_003.scale.set(49.229, 0.1744, 3.4919);
  const cubebolshayakrysha_003MZ = cubebolshayakrysha_003.clone();
  cubebolshayakrysha_003.position.set(0, 0, 3.4425);
  cubebolshayakrysha_003MZ.position.set(0, 0, -3.4425);
  cubebolshayakrysha_003.setRotation(0.1266, 0.0, 0.0);
  cubebolshayakrysha_003MZ.setRotation(-0.1266, -0.0, 0.0);
  const cubebolshayakrysha_003MirroredZ = new THREE.Group();
  cubebolshayakrysha_003MirroredZ.add(
    cubebolshayakrysha_003,
    cubebolshayakrysha_003MZ,
  );
  cubebolshayakrysha_003MirroredZ.position.set(-1.2151, 17.1452, 0);
  const cubebolshayakryshaGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubebolshayakrysha = new THREE.Mesh(
    cubebolshayakryshaGeometry,
    Material,
  );
  cubebolshayakrysha.scale.set(49.229, 0.1743, 5.422);
  const cubebolshayakryshaMZ = cubebolshayakrysha.clone();
  cubebolshayakrysha.position.set(0, 0, 23.2652);
  cubebolshayakryshaMZ.position.set(0, 0, -23.2652);
  cubebolshayakrysha.setRotation(1.5708, 0.0, 0.0);
  cubebolshayakryshaMZ.setRotation(-1.5708, -0.0, 0.0);
  const cubebolshayakryshaMirroredZ = new THREE.Group();
  cubebolshayakryshaMirroredZ.add(cubebolshayakrysha, cubebolshayakryshaMZ);
  cubebolshayakryshaMirroredZ.position.set(-1.2151, 0.4506, 0);
  const cubesmotritelGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel = new THREE.Mesh(cubesmotritelGeometry, MetalMaterial);
  cubesmotritel.position.set(48.8319, 1.6299, -0.7317);
  cubesmotritel.scale.set(0.7995, 0.7995, 0.0694);

  const cubesmotritel_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_001 = new THREE.Mesh(
    cubesmotritel_001Geometry,
    MetalMaterial,
  );
  cubesmotritel_001.position.set(48.818, 3.5732, 0.003);
  cubesmotritel_001.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_001.setRotation(-1.5708, 4.7124, -0.0);

  const cubesmotritel_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_002 = new THREE.Mesh(
    cubesmotritel_002Geometry,
    GlassMaterial,
  );
  cubesmotritel_002.position.set(49.5562, 2.977, 0.003);
  cubesmotritel_002.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_002.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_003 = new THREE.Mesh(
    cubesmotritel_003Geometry,
    GlassMaterial,
  );
  cubesmotritel_003.position.set(48.799, 2.977, 0.733);
  cubesmotritel_003.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_003.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_004 = new THREE.Mesh(
    cubesmotritel_004Geometry,
    GlassMaterial,
  );
  cubesmotritel_004.position.set(48.0747, 2.977, -0.0017);
  cubesmotritel_004.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_004.setRotation(0.0, 1.5708, 0.0);

  const cubesmotritel_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_005 = new THREE.Mesh(
    cubesmotritel_005Geometry,
    GlassMaterial,
  );
  cubesmotritel_005.position.set(48.8319, 2.977, -0.7317);
  cubesmotritel_005.scale.set(0.7995, 0.4981, 0.0694);

  const cubesmotritel_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_006 = new THREE.Mesh(
    cubesmotritel_006Geometry,
    MetalMaterial,
  );
  cubesmotritel_006.position.set(48.818, 0.8937, 0.003);
  cubesmotritel_006.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_006.setRotation(-1.5708, 4.7124, -0.0);

  const cubesmotritel_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_007 = new THREE.Mesh(
    cubesmotritel_007Geometry,
    MetalMaterial,
  );
  cubesmotritel_007.position.set(48.799, 1.6299, 0.733);
  cubesmotritel_007.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_007.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_008 = new THREE.Mesh(
    cubesmotritel_008Geometry,
    MetalMaterial,
  );
  cubesmotritel_008.position.set(49.5562, 1.6299, 0.003);
  cubesmotritel_008.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_008.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_009 = new THREE.Mesh(
    cubesmotritel_009Geometry,
    MetalMaterial,
  );
  cubesmotritel_009.position.set(48.0747, 1.6299, -0.0017);
  cubesmotritel_009.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_009.setRotation(0.0, 1.5708, 0.0);

  const cubesmotritel_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_010 = new THREE.Mesh(
    cubesmotritel_010Geometry,
    MetalMaterial,
  );
  cubesmotritel_010.position.set(65.5021, 14.8283, -0.7317);
  cubesmotritel_010.scale.set(0.7995, 0.7995, 0.0694);

  const cubesmotritel_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_011 = new THREE.Mesh(
    cubesmotritel_011Geometry,
    MetalMaterial,
  );
  cubesmotritel_011.position.set(65.4882, 16.7716, 0.003);
  cubesmotritel_011.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_011.setRotation(-1.5708, 4.7124, -0.0);

  const cubesmotritel_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_012 = new THREE.Mesh(
    cubesmotritel_012Geometry,
    GlassMaterial,
  );
  cubesmotritel_012.position.set(66.2264, 16.1754, 0.003);
  cubesmotritel_012.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_012.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_013 = new THREE.Mesh(
    cubesmotritel_013Geometry,
    GlassMaterial,
  );
  cubesmotritel_013.position.set(65.4692, 16.1754, 0.733);
  cubesmotritel_013.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_013.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_014 = new THREE.Mesh(
    cubesmotritel_014Geometry,
    GlassMaterial,
  );
  cubesmotritel_014.position.set(64.7449, 16.1754, -0.0017);
  cubesmotritel_014.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_014.setRotation(0.0, 1.5708, 0.0);

  const cubesmotritel_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_015 = new THREE.Mesh(
    cubesmotritel_015Geometry,
    GlassMaterial,
  );
  cubesmotritel_015.position.set(65.5021, 16.1754, -0.7317);
  cubesmotritel_015.scale.set(0.7995, 0.4981, 0.0694);

  const cubesmotritel_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_016 = new THREE.Mesh(
    cubesmotritel_016Geometry,
    MetalMaterial,
  );
  cubesmotritel_016.position.set(65.4882, 14.0921, 0.003);
  cubesmotritel_016.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_016.setRotation(-1.5708, 4.7124, -0.0);

  const cubesmotritel_017Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_017 = new THREE.Mesh(
    cubesmotritel_017Geometry,
    MetalMaterial,
  );
  cubesmotritel_017.position.set(65.4692, 14.8283, 0.733);
  cubesmotritel_017.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_017.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_018Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_018 = new THREE.Mesh(
    cubesmotritel_018Geometry,
    MetalMaterial,
  );
  cubesmotritel_018.position.set(66.2264, 14.8283, 0.003);
  cubesmotritel_018.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_018.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_019Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_019 = new THREE.Mesh(
    cubesmotritel_019Geometry,
    MetalMaterial,
  );
  cubesmotritel_019.position.set(64.7449, 14.8283, -0.0017);
  cubesmotritel_019.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_019.setRotation(0.0, 1.5708, 0.0);

  const cubelestnicaGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnicaGroup = new THREE.Group();
  for (let i = 0; i < 29; i++) {
    const cubelestnica = new THREE.Mesh(cubelestnicaGeometry, MetalMaterial);
    cubelestnica.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnicaGroup.add(cubelestnica);
  }
  cubelestnicaGroup.position.set(50.1677, 1.0795, -2.4186);
  const cubenapolnikGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik = new THREE.Mesh(cubenapolnikGeometry, MetalMaterial);
  cubenapolnik.position.set(49.0968, 0.7364, -2.4245);
  cubenapolnik.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik.setRotation(1.5708, 0.0, 0.0);

  const cubeporuchenGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen = new THREE.Mesh(cubeporuchenGeometry, MetalMaterial);
  cubeporuchen.scale.set(9.0522, 0.9024, 0.1501);
  const cubeporuchenMZ = cubeporuchen.clone();
  cubeporuchen.position.set(0, 0, -1.3602);
  cubeporuchenMZ.position.set(0, 0, -3.477);
  cubeporuchen.setRotation(0.0, 0.0, 0.7854);
  cubeporuchenMZ.setRotation(0.0, -0.0, 0.7854);
  const cubeporuchenMirroredZ = new THREE.Group();
  cubeporuchenMirroredZ.add(cubeporuchen, cubeporuchenMZ);
  cubeporuchenMirroredZ.position.set(56.7434, 7.997, 0);
  const cubeporuchen_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_001 = new THREE.Mesh(
    cubeporuchen_001Geometry,
    MetalMaterial,
  );
  cubeporuchen_001.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_001MZ = cubeporuchen_001.clone();
  cubeporuchen_001.position.set(0, 0, -1.3602);
  cubeporuchen_001MZ.position.set(0, 0, -3.477);
  cubeporuchen_001.setRotation(0.0, 0.0, -0.0);
  cubeporuchen_001MZ.setRotation(0.0, -0.0, -0.0);
  const cubeporuchen_001MirroredZ = new THREE.Group();
  cubeporuchen_001MirroredZ.add(cubeporuchen_001, cubeporuchen_001MZ);
  cubeporuchen_001MirroredZ.position.set(49.0968, 1.3748, 0);
  const cylinderporuchen_002Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_002 = new THREE.Mesh(
    cylinderporuchen_002Geometry,
    MetalMaterial,
  );
  cylinderporuchen_002.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_002MZ = cylinderporuchen_002.clone();
  cylinderporuchen_002.position.set(0, 0, -1.361);
  cylinderporuchen_002MZ.position.set(0, 0, -3.4762);
  cylinderporuchen_002.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_002MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_002MirroredZ = new THREE.Group();
  cylinderporuchen_002MirroredZ.add(
    cylinderporuchen_002,
    cylinderporuchen_002MZ,
  );
  cylinderporuchen_002MirroredZ.position.set(50.1677, 1.5286, 0);
  const cylinderporuchen_003Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_003 = new THREE.Mesh(
    cylinderporuchen_003Geometry,
    MetalMaterial,
  );
  cylinderporuchen_003.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_003MZ = cylinderporuchen_003.clone();
  cylinderporuchen_003.position.set(0, 0, -1.361);
  cylinderporuchen_003MZ.position.set(0, 0, -3.4762);
  cylinderporuchen_003.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_003MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_003MirroredZ = new THREE.Group();
  cylinderporuchen_003MirroredZ.add(
    cylinderporuchen_003,
    cylinderporuchen_003MZ,
  );
  cylinderporuchen_003MirroredZ.position.set(63.2871, 14.535, 0);
  const cylinderporuchen_004Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_004 = new THREE.Mesh(
    cylinderporuchen_004Geometry,
    MetalMaterial,
  );
  cylinderporuchen_004.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_004MZ = cylinderporuchen_004.clone();
  cylinderporuchen_004.position.set(0, 0, -1.361);
  cylinderporuchen_004MZ.position.set(0, 0, -3.4762);
  cylinderporuchen_004.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_004MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_004MirroredZ = new THREE.Group();
  cylinderporuchen_004MirroredZ.add(
    cylinderporuchen_004,
    cylinderporuchen_004MZ,
  );
  cylinderporuchen_004MirroredZ.position.set(48.0709, 1.241, 0);
  const cubeporuchen_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_005 = new THREE.Mesh(
    cubeporuchen_005Geometry,
    MetalMaterial,
  );
  cubeporuchen_005.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_005MZ = cubeporuchen_005.clone();
  cubeporuchen_005.position.set(0, 0, -1.3602);
  cubeporuchen_005MZ.position.set(0, 0, -3.477);
  cubeporuchen_005.setRotation(0.0, -0.0, -3.1416);
  cubeporuchen_005MZ.setRotation(0.0, 0.0, -3.1416);
  const cubeporuchen_005MirroredZ = new THREE.Group();
  cubeporuchen_005MirroredZ.add(cubeporuchen_005, cubeporuchen_005MZ);
  cubeporuchen_005MirroredZ.position.set(64.736, 14.5346, 0);
  const cylinderporuchen_006Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_006 = new THREE.Mesh(
    cylinderporuchen_006Geometry,
    MetalMaterial,
  );
  cylinderporuchen_006.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_006MZ = cylinderporuchen_006.clone();
  cylinderporuchen_006.position.set(0, 0, -1.361);
  cylinderporuchen_006MZ.position.set(0, 0, -3.4762);
  cylinderporuchen_006.setRotation(1.5708, -0.0, -3.1416);
  cylinderporuchen_006MZ.setRotation(-1.5708, 0.0, -3.1416);
  const cylinderporuchen_006MirroredZ = new THREE.Group();
  cylinderporuchen_006MirroredZ.add(
    cylinderporuchen_006,
    cylinderporuchen_006MZ,
  );
  cylinderporuchen_006MirroredZ.position.set(65.7619, 14.4624, 0);
  const cubenapolnik_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_001 = new THREE.Mesh(
    cubenapolnik_001Geometry,
    MetalMaterial,
  );
  cubenapolnik_001.position.set(64.5817, 14.1388, -2.4245);
  cubenapolnik_001.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_001.setRotation(1.5708, 0.0, 0.0);

  const cubelestnica_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_005Group = new THREE.Group();
  for (let i = 0; i < 29; i++) {
    const cubelestnica_005 = new THREE.Mesh(
      cubelestnica_005Geometry,
      Metal_004Material,
    );
    cubelestnica_005.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_005.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_005Group.add(cubelestnica_005);
  }
  cubelestnica_005Group.position.set(50.1677, 1.0795, -5.1042);
  const cubenapolnik_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_011 = new THREE.Mesh(
    cubenapolnik_011Geometry,
    Metal_004Material,
  );
  cubenapolnik_011.position.set(49.0968, 0.7364, -5.11);
  cubenapolnik_011.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_011.setRotation(1.5708, 0.0, 0.0);

  const cubeporuchen_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_014 = new THREE.Mesh(
    cubeporuchen_014Geometry,
    Metal_004Material,
  );
  cubeporuchen_014.scale.set(9.0522, 0.9024, 0.1501);
  const cubeporuchen_014MZ = cubeporuchen_014.clone();
  cubeporuchen_014.position.set(0, 0, -4.0458);
  cubeporuchen_014MZ.position.set(0, 0, -6.1625);
  cubeporuchen_014.setRotation(0.0, 0.0, 0.7854);
  cubeporuchen_014MZ.setRotation(0.0, -0.0, 0.7854);
  const cubeporuchen_014MirroredZ = new THREE.Group();
  cubeporuchen_014MirroredZ.add(cubeporuchen_014, cubeporuchen_014MZ);
  cubeporuchen_014MirroredZ.position.set(56.7434, 7.997, 0);
  const cubeporuchen_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_013 = new THREE.Mesh(
    cubeporuchen_013Geometry,
    Metal_004Material,
  );
  cubeporuchen_013.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_013MZ = cubeporuchen_013.clone();
  cubeporuchen_013.position.set(0, 0, -4.0458);
  cubeporuchen_013MZ.position.set(0, 0, -6.1625);
  cubeporuchen_013.setRotation(0.0, 0.0, -0.0);
  cubeporuchen_013MZ.setRotation(0.0, -0.0, -0.0);
  const cubeporuchen_013MirroredZ = new THREE.Group();
  cubeporuchen_013MirroredZ.add(cubeporuchen_013, cubeporuchen_013MZ);
  cubeporuchen_013MirroredZ.position.set(49.0968, 1.3748, 0);
  const cylinderporuchen_020Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_020 = new THREE.Mesh(
    cylinderporuchen_020Geometry,
    Metal_004Material,
  );
  cylinderporuchen_020.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_020MZ = cylinderporuchen_020.clone();
  cylinderporuchen_020.position.set(0, 0, -4.0465);
  cylinderporuchen_020MZ.position.set(0, 0, -6.1618);
  cylinderporuchen_020.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_020MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_020MirroredZ = new THREE.Group();
  cylinderporuchen_020MirroredZ.add(
    cylinderporuchen_020,
    cylinderporuchen_020MZ,
  );
  cylinderporuchen_020MirroredZ.position.set(50.1677, 1.5286, 0);
  const cylinderporuchen_019Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_019 = new THREE.Mesh(
    cylinderporuchen_019Geometry,
    Metal_004Material,
  );
  cylinderporuchen_019.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_019MZ = cylinderporuchen_019.clone();
  cylinderporuchen_019.position.set(0, 0, -4.0465);
  cylinderporuchen_019MZ.position.set(0, 0, -6.1618);
  cylinderporuchen_019.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_019MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_019MirroredZ = new THREE.Group();
  cylinderporuchen_019MirroredZ.add(
    cylinderporuchen_019,
    cylinderporuchen_019MZ,
  );
  cylinderporuchen_019MirroredZ.position.set(63.2871, 14.535, 0);
  const cylinderporuchen_018Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_018 = new THREE.Mesh(
    cylinderporuchen_018Geometry,
    Metal_004Material,
  );
  cylinderporuchen_018.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_018MZ = cylinderporuchen_018.clone();
  cylinderporuchen_018.position.set(0, 0, -4.0465);
  cylinderporuchen_018MZ.position.set(0, 0, -6.1618);
  cylinderporuchen_018.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_018MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_018MirroredZ = new THREE.Group();
  cylinderporuchen_018MirroredZ.add(
    cylinderporuchen_018,
    cylinderporuchen_018MZ,
  );
  cylinderporuchen_018MirroredZ.position.set(48.0709, 1.241, 0);
  const cubeporuchen_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_012 = new THREE.Mesh(
    cubeporuchen_012Geometry,
    Metal_004Material,
  );
  cubeporuchen_012.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_012MZ = cubeporuchen_012.clone();
  cubeporuchen_012.position.set(0, 0, -4.0458);
  cubeporuchen_012MZ.position.set(0, 0, -6.1625);
  cubeporuchen_012.setRotation(0.0, -0.0, -3.1416);
  cubeporuchen_012MZ.setRotation(0.0, 0.0, -3.1416);
  const cubeporuchen_012MirroredZ = new THREE.Group();
  cubeporuchen_012MirroredZ.add(cubeporuchen_012, cubeporuchen_012MZ);
  cubeporuchen_012MirroredZ.position.set(64.736, 14.5346, 0);
  const cylinderporuchen_017Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_017 = new THREE.Mesh(
    cylinderporuchen_017Geometry,
    Metal_004Material,
  );
  cylinderporuchen_017.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_017MZ = cylinderporuchen_017.clone();
  cylinderporuchen_017.position.set(0, 0, -4.0465);
  cylinderporuchen_017MZ.position.set(0, 0, -6.1618);
  cylinderporuchen_017.setRotation(1.5708, -0.0, -3.1416);
  cylinderporuchen_017MZ.setRotation(-1.5708, 0.0, -3.1416);
  const cylinderporuchen_017MirroredZ = new THREE.Group();
  cylinderporuchen_017MirroredZ.add(
    cylinderporuchen_017,
    cylinderporuchen_017MZ,
  );
  cylinderporuchen_017MirroredZ.position.set(65.7619, 14.4624, 0);
  const cubenapolnik_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_010 = new THREE.Mesh(
    cubenapolnik_010Geometry,
    Metal_004Material,
  );
  cubenapolnik_010.position.set(64.5817, 14.1388, -5.11);
  cubenapolnik_010.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_010.setRotation(1.5708, 0.0, 0.0);

  const cubelestnica_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_006Group = new THREE.Group();
  for (let i = 0; i < 29; i++) {
    const cubelestnica_006 = new THREE.Mesh(
      cubelestnica_006Geometry,
      Metal_005Material,
    );
    cubelestnica_006.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_006.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_006Group.add(cubelestnica_006);
  }
  cubelestnica_006Group.position.set(50.1677, 1.0795, 2.3681);
  const cubenapolnik_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_013 = new THREE.Mesh(
    cubenapolnik_013Geometry,
    Metal_005Material,
  );
  cubenapolnik_013.position.set(49.0968, 0.7364, 2.3622);
  cubenapolnik_013.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_013.setRotation(1.5708, 0.0, 0.0);

  const cubeporuchen_017Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_017 = new THREE.Mesh(
    cubeporuchen_017Geometry,
    Metal_005Material,
  );
  cubeporuchen_017.scale.set(9.0522, 0.9024, 0.1501);
  const cubeporuchen_017MZ = cubeporuchen_017.clone();
  cubeporuchen_017.position.set(0, 0, 3.4265);
  cubeporuchen_017MZ.position.set(0, 0, 1.3097);
  cubeporuchen_017.setRotation(0.0, 0.0, 0.7854);
  cubeporuchen_017MZ.setRotation(0.0, -0.0, 0.7854);
  const cubeporuchen_017MirroredZ = new THREE.Group();
  cubeporuchen_017MirroredZ.add(cubeporuchen_017, cubeporuchen_017MZ);
  cubeporuchen_017MirroredZ.position.set(56.7434, 7.997, 0);
  const cubeporuchen_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_016 = new THREE.Mesh(
    cubeporuchen_016Geometry,
    Metal_005Material,
  );
  cubeporuchen_016.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_016MZ = cubeporuchen_016.clone();
  cubeporuchen_016.position.set(0, 0, 3.4265);
  cubeporuchen_016MZ.position.set(0, 0, 1.3097);
  cubeporuchen_016.setRotation(0.0, 0.0, -0.0);
  cubeporuchen_016MZ.setRotation(0.0, -0.0, -0.0);
  const cubeporuchen_016MirroredZ = new THREE.Group();
  cubeporuchen_016MirroredZ.add(cubeporuchen_016, cubeporuchen_016MZ);
  cubeporuchen_016MirroredZ.position.set(49.0968, 1.3748, 0);
  const cylinderporuchen_024Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_024 = new THREE.Mesh(
    cylinderporuchen_024Geometry,
    Metal_005Material,
  );
  cylinderporuchen_024.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_024MZ = cylinderporuchen_024.clone();
  cylinderporuchen_024.position.set(0, 0, 3.4257);
  cylinderporuchen_024MZ.position.set(0, 0, 1.3105);
  cylinderporuchen_024.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_024MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_024MirroredZ = new THREE.Group();
  cylinderporuchen_024MirroredZ.add(
    cylinderporuchen_024,
    cylinderporuchen_024MZ,
  );
  cylinderporuchen_024MirroredZ.position.set(50.1677, 1.5286, 0);
  const cylinderporuchen_023Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_023 = new THREE.Mesh(
    cylinderporuchen_023Geometry,
    Metal_005Material,
  );
  cylinderporuchen_023.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_023MZ = cylinderporuchen_023.clone();
  cylinderporuchen_023.position.set(0, 0, 3.4257);
  cylinderporuchen_023MZ.position.set(0, 0, 1.3105);
  cylinderporuchen_023.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_023MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_023MirroredZ = new THREE.Group();
  cylinderporuchen_023MirroredZ.add(
    cylinderporuchen_023,
    cylinderporuchen_023MZ,
  );
  cylinderporuchen_023MirroredZ.position.set(63.2871, 14.535, 0);
  const cylinderporuchen_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_022 = new THREE.Mesh(
    cylinderporuchen_022Geometry,
    Metal_005Material,
  );
  cylinderporuchen_022.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_022MZ = cylinderporuchen_022.clone();
  cylinderporuchen_022.position.set(0, 0, 3.4257);
  cylinderporuchen_022MZ.position.set(0, 0, 1.3105);
  cylinderporuchen_022.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_022MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_022MirroredZ = new THREE.Group();
  cylinderporuchen_022MirroredZ.add(
    cylinderporuchen_022,
    cylinderporuchen_022MZ,
  );
  cylinderporuchen_022MirroredZ.position.set(48.0709, 1.241, 0);
  const cubeporuchen_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_015 = new THREE.Mesh(
    cubeporuchen_015Geometry,
    Metal_005Material,
  );
  cubeporuchen_015.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_015MZ = cubeporuchen_015.clone();
  cubeporuchen_015.position.set(0, 0, 3.4265);
  cubeporuchen_015MZ.position.set(0, 0, 1.3097);
  cubeporuchen_015.setRotation(0.0, -0.0, -3.1416);
  cubeporuchen_015MZ.setRotation(0.0, 0.0, -3.1416);
  const cubeporuchen_015MirroredZ = new THREE.Group();
  cubeporuchen_015MirroredZ.add(cubeporuchen_015, cubeporuchen_015MZ);
  cubeporuchen_015MirroredZ.position.set(64.736, 14.5346, 0);
  const cylinderporuchen_021Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_021 = new THREE.Mesh(
    cylinderporuchen_021Geometry,
    Metal_005Material,
  );
  cylinderporuchen_021.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_021MZ = cylinderporuchen_021.clone();
  cylinderporuchen_021.position.set(0, 0, 3.4257);
  cylinderporuchen_021MZ.position.set(0, 0, 1.3105);
  cylinderporuchen_021.setRotation(1.5708, -0.0, -3.1416);
  cylinderporuchen_021MZ.setRotation(-1.5708, 0.0, -3.1416);
  const cylinderporuchen_021MirroredZ = new THREE.Group();
  cylinderporuchen_021MirroredZ.add(
    cylinderporuchen_021,
    cylinderporuchen_021MZ,
  );
  cylinderporuchen_021MirroredZ.position.set(65.7619, 14.4624, 0);
  const cubenapolnik_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_012 = new THREE.Mesh(
    cubenapolnik_012Geometry,
    Metal_005Material,
  );
  cubenapolnik_012.position.set(64.5817, 14.1388, 2.3622);
  cubenapolnik_012.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_012.setRotation(1.5708, 0.0, 0.0);

  const cubelestnica_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_007Group = new THREE.Group();
  for (let i = 0; i < 29; i++) {
    const cubelestnica_007 = new THREE.Mesh(
      cubelestnica_007Geometry,
      Metal_006Material,
    );
    cubelestnica_007.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_007.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_007Group.add(cubelestnica_007);
  }
  cubelestnica_007Group.position.set(50.1677, 1.0795, 5.1056);
  const cubenapolnik_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_015 = new THREE.Mesh(
    cubenapolnik_015Geometry,
    Metal_006Material,
  );
  cubenapolnik_015.position.set(49.0968, 0.7364, 5.0997);
  cubenapolnik_015.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_015.setRotation(1.5708, 0.0, 0.0);

  const cubeporuchen_020Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_020 = new THREE.Mesh(
    cubeporuchen_020Geometry,
    Metal_006Material,
  );
  cubeporuchen_020.scale.set(9.0522, 0.9024, 0.1501);
  const cubeporuchen_020MZ = cubeporuchen_020.clone();
  cubeporuchen_020.position.set(0, 0, 6.164);
  cubeporuchen_020MZ.position.set(0, 0, 4.0472);
  cubeporuchen_020.setRotation(0.0, 0.0, 0.7854);
  cubeporuchen_020MZ.setRotation(0.0, -0.0, 0.7854);
  const cubeporuchen_020MirroredZ = new THREE.Group();
  cubeporuchen_020MirroredZ.add(cubeporuchen_020, cubeporuchen_020MZ);
  cubeporuchen_020MirroredZ.position.set(56.7434, 7.997, 0);
  const cubeporuchen_019Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_019 = new THREE.Mesh(
    cubeporuchen_019Geometry,
    Metal_006Material,
  );
  cubeporuchen_019.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_019MZ = cubeporuchen_019.clone();
  cubeporuchen_019.position.set(0, 0, 6.164);
  cubeporuchen_019MZ.position.set(0, 0, 4.0472);
  cubeporuchen_019.setRotation(0.0, 0.0, -0.0);
  cubeporuchen_019MZ.setRotation(0.0, -0.0, -0.0);
  const cubeporuchen_019MirroredZ = new THREE.Group();
  cubeporuchen_019MirroredZ.add(cubeporuchen_019, cubeporuchen_019MZ);
  cubeporuchen_019MirroredZ.position.set(49.0968, 1.3748, 0);
  const cylinderporuchen_028Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_028 = new THREE.Mesh(
    cylinderporuchen_028Geometry,
    Metal_006Material,
  );
  cylinderporuchen_028.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_028MZ = cylinderporuchen_028.clone();
  cylinderporuchen_028.position.set(0, 0, 6.1632);
  cylinderporuchen_028MZ.position.set(0, 0, 4.0479);
  cylinderporuchen_028.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_028MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_028MirroredZ = new THREE.Group();
  cylinderporuchen_028MirroredZ.add(
    cylinderporuchen_028,
    cylinderporuchen_028MZ,
  );
  cylinderporuchen_028MirroredZ.position.set(50.1677, 1.5286, 0);
  const cylinderporuchen_027Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_027 = new THREE.Mesh(
    cylinderporuchen_027Geometry,
    Metal_006Material,
  );
  cylinderporuchen_027.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_027MZ = cylinderporuchen_027.clone();
  cylinderporuchen_027.position.set(0, 0, 6.1632);
  cylinderporuchen_027MZ.position.set(0, 0, 4.0479);
  cylinderporuchen_027.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_027MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_027MirroredZ = new THREE.Group();
  cylinderporuchen_027MirroredZ.add(
    cylinderporuchen_027,
    cylinderporuchen_027MZ,
  );
  cylinderporuchen_027MirroredZ.position.set(63.2871, 14.535, 0);
  const cylinderporuchen_026Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_026 = new THREE.Mesh(
    cylinderporuchen_026Geometry,
    Metal_006Material,
  );
  cylinderporuchen_026.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_026MZ = cylinderporuchen_026.clone();
  cylinderporuchen_026.position.set(0, 0, 6.1632);
  cylinderporuchen_026MZ.position.set(0, 0, 4.0479);
  cylinderporuchen_026.setRotation(1.5708, 0.0, 0.0);
  cylinderporuchen_026MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinderporuchen_026MirroredZ = new THREE.Group();
  cylinderporuchen_026MirroredZ.add(
    cylinderporuchen_026,
    cylinderporuchen_026MZ,
  );
  cylinderporuchen_026MirroredZ.position.set(48.0709, 1.241, 0);
  const cubeporuchen_018Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_018 = new THREE.Mesh(
    cubeporuchen_018Geometry,
    Metal_006Material,
  );
  cubeporuchen_018.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_018MZ = cubeporuchen_018.clone();
  cubeporuchen_018.position.set(0, 0, 6.164);
  cubeporuchen_018MZ.position.set(0, 0, 4.0472);
  cubeporuchen_018.setRotation(0.0, -0.0, -3.1416);
  cubeporuchen_018MZ.setRotation(0.0, 0.0, -3.1416);
  const cubeporuchen_018MirroredZ = new THREE.Group();
  cubeporuchen_018MirroredZ.add(cubeporuchen_018, cubeporuchen_018MZ);
  cubeporuchen_018MirroredZ.position.set(64.736, 14.5346, 0);
  const cylinderporuchen_025Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_025 = new THREE.Mesh(
    cylinderporuchen_025Geometry,
    Metal_006Material,
  );
  cylinderporuchen_025.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_025MZ = cylinderporuchen_025.clone();
  cylinderporuchen_025.position.set(0, 0, 6.1632);
  cylinderporuchen_025MZ.position.set(0, 0, 4.0479);
  cylinderporuchen_025.setRotation(1.5708, -0.0, -3.1416);
  cylinderporuchen_025MZ.setRotation(-1.5708, 0.0, -3.1416);
  const cylinderporuchen_025MirroredZ = new THREE.Group();
  cylinderporuchen_025MirroredZ.add(
    cylinderporuchen_025,
    cylinderporuchen_025MZ,
  );
  cylinderporuchen_025MirroredZ.position.set(65.7619, 14.4624, 0);
  const cubenapolnik_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_014 = new THREE.Mesh(
    cubenapolnik_014Geometry,
    Metal_006Material,
  );
  cubenapolnik_014.position.set(64.5817, 14.1388, 5.0997);
  cubenapolnik_014.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_014.setRotation(1.5708, 0.0, 0.0);

  const cubesmotritel_020Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_020 = new THREE.Mesh(
    cubesmotritel_020Geometry,
    MetalMaterial,
  );
  cubesmotritel_020.position.set(110.4389, 15.3204, -40.4363);
  cubesmotritel_020.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_020.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_021Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_021 = new THREE.Mesh(
    cubesmotritel_021Geometry,
    MetalMaterial,
  );
  cubesmotritel_021.position.set(110.4528, 17.2637, -41.1711);
  cubesmotritel_021.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_021.setRotation(-1.5708, 7.854, -0.0);

  const cubesmotritel_022Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_022 = new THREE.Mesh(
    cubesmotritel_022Geometry,
    GlassMaterial,
  );
  cubesmotritel_022.position.set(109.7146, 16.6675, -41.1711);
  cubesmotritel_022.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_022.setRotation(0.0, 7.854, 0.0);

  const cubesmotritel_023Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_023 = new THREE.Mesh(
    cubesmotritel_023Geometry,
    GlassMaterial,
  );
  cubesmotritel_023.position.set(110.4717, 16.6675, -41.9011);
  cubesmotritel_023.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_023.setRotation(0.0, 6.2832, 0.0);

  const cubesmotritel_024Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_024 = new THREE.Mesh(
    cubesmotritel_024Geometry,
    GlassMaterial,
  );
  cubesmotritel_024.position.set(111.196, 16.6675, -41.1664);
  cubesmotritel_024.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_024.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_025Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_025 = new THREE.Mesh(
    cubesmotritel_025Geometry,
    GlassMaterial,
  );
  cubesmotritel_025.position.set(110.4389, 16.6675, -40.4363);
  cubesmotritel_025.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_025.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_026Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_026 = new THREE.Mesh(
    cubesmotritel_026Geometry,
    MetalMaterial,
  );
  cubesmotritel_026.position.set(110.4528, 14.5842, -41.1711);
  cubesmotritel_026.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_026.setRotation(-1.5708, 7.854, -0.0);

  const cubesmotritel_027Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_027 = new THREE.Mesh(
    cubesmotritel_027Geometry,
    MetalMaterial,
  );
  cubesmotritel_027.position.set(110.4717, 15.3204, -41.9011);
  cubesmotritel_027.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_027.setRotation(0.0, 6.2832, 0.0);

  const cubesmotritel_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_028 = new THREE.Mesh(
    cubesmotritel_028Geometry,
    MetalMaterial,
  );
  cubesmotritel_028.position.set(109.7146, 15.3204, -41.1711);
  cubesmotritel_028.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_028.setRotation(0.0, 7.854, 0.0);

  const cubesmotritel_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_029 = new THREE.Mesh(
    cubesmotritel_029Geometry,
    MetalMaterial,
  );
  cubesmotritel_029.position.set(111.196, 15.3204, -41.1664);
  cubesmotritel_029.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_029.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_030Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_030 = new THREE.Mesh(
    cubesmotritel_030Geometry,
    MetalMaterial,
  );
  cubesmotritel_030.position.set(46.9089, 75.239, -40.4363);
  cubesmotritel_030.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_030.setRotation(0.0, 3.1416, 0.0);
  const cubesmotritel_031Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_031 = new THREE.Mesh(
    cubesmotritel_031Geometry,
    MetalMaterial,
  );
  cubesmotritel_031.position.set(46.9227, 77.1822, -41.1711);
  cubesmotritel_031.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_031.setRotation(-1.5708, 7.854, -0.0);

  const cubesmotritel_032Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_032 = new THREE.Mesh(
    cubesmotritel_032Geometry,
    GlassMaterial,
  );
  cubesmotritel_032.position.set(46.1846, 76.586, -41.1711);
  cubesmotritel_032.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_032.setRotation(0.0, 7.854, 0.0);

  const cubesmotritel_033Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_033 = new THREE.Mesh(
    cubesmotritel_033Geometry,
    GlassMaterial,
  );
  cubesmotritel_033.position.set(46.9417, 76.586, -41.9011);
  cubesmotritel_033.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_033.setRotation(0.0, 6.2832, 0.0);

  const cubesmotritel_034Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_034 = new THREE.Mesh(
    cubesmotritel_034Geometry,
    GlassMaterial,
  );
  cubesmotritel_034.position.set(47.666, 76.586, -41.1664);
  cubesmotritel_034.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_034.setRotation(0.0, 4.7124, 0.0);

  const cubesmotritel_035Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_035 = new THREE.Mesh(
    cubesmotritel_035Geometry,
    GlassMaterial,
  );
  cubesmotritel_035.position.set(46.9089, 76.586, -40.4363);
  cubesmotritel_035.scale.set(0.7995, 0.4981, 0.0694);
  cubesmotritel_035.setRotation(0.0, 3.1416, 0.0);

  const cubesmotritel_036Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_036 = new THREE.Mesh(
    cubesmotritel_036Geometry,
    MetalMaterial,
  );
  cubesmotritel_036.position.set(46.9227, 74.5027, -41.1711);
  cubesmotritel_036.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_036.setRotation(-1.5708, 7.854, -0.0);

  const cubesmotritel_037Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_037 = new THREE.Mesh(
    cubesmotritel_037Geometry,
    MetalMaterial,
  );
  cubesmotritel_037.position.set(46.9417, 75.239, -41.9011);
  cubesmotritel_037.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_037.setRotation(0.0, 6.2832, 0.0);

  const cubesmotritel_038Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_038 = new THREE.Mesh(
    cubesmotritel_038Geometry,
    MetalMaterial,
  );
  cubesmotritel_038.position.set(46.1846, 75.239, -41.1711);
  cubesmotritel_038.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_038.setRotation(0.0, 7.854, 0.0);

  const cubesmotritel_039Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubesmotritel_039 = new THREE.Mesh(
    cubesmotritel_039Geometry,
    MetalMaterial,
  );
  cubesmotritel_039.position.set(47.666, 75.239, -41.1664);
  cubesmotritel_039.scale.set(0.7995, 0.7995, 0.0694);
  cubesmotritel_039.setRotation(0.0, 4.7124, 0.0);

  const cubelestnica_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_004Group = new THREE.Group();
  for (let i = 0; i < 130; i++) {
    const cubelestnica_004 = new THREE.Mesh(
      cubelestnica_004Geometry,
      MetalMaterial,
    );
    cubelestnica_004.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_004.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_004Group.add(cubelestnica_004);
  }
  cubelestnica_004Group.setRotation(0.0, 3.1416, 0.0);
  cubelestnica_004Group.position.set(109.1031, 14.77, -38.7495);
  const cubenapolnik_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_008 = new THREE.Mesh(
    cubenapolnik_008Geometry,
    MetalMaterial,
  );
  cubenapolnik_008.position.set(110.174, 14.4269, -38.7436);
  cubenapolnik_008.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_008.setRotation(1.5708, 3.1416, 0.0);

  const cubeporuchen_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_028 = new THREE.Mesh(
    cubeporuchen_028Geometry,
    MetalMaterial,
  );
  cubeporuchen_028.scale.set(42.2406, 0.9024, 0.1501);
  const cubeporuchen_028MZ = cubeporuchen_028.clone();
  cubeporuchen_028.position.set(0, 0, -39.8079);
  cubeporuchen_028MZ.position.set(0, 0, -37.6911);
  cubeporuchen_028.setRotation(0.0, 3.1416, 0.7854);
  cubeporuchen_028MZ.setRotation(0.0, -3.1416, 0.7854);
  const cubeporuchen_028MirroredZ = new THREE.Group();
  cubeporuchen_028MirroredZ.add(cubeporuchen_028, cubeporuchen_028MZ);
  cubeporuchen_028MirroredZ.position.set(79.2887, 44.9262, 0);
  const cubeporuchen_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_029 = new THREE.Mesh(
    cubeporuchen_029Geometry,
    MetalMaterial,
  );
  cubeporuchen_029.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_029MZ = cubeporuchen_029.clone();
  cubeporuchen_029.position.set(0, 0, -39.8079);
  cubeporuchen_029MZ.position.set(0, 0, -37.6911);
  cubeporuchen_029.setRotation(0.0, 3.1416, 0.0);
  cubeporuchen_029MZ.setRotation(0.0, -3.1416, 0.0);
  const cubeporuchen_029MirroredZ = new THREE.Group();
  cubeporuchen_029MirroredZ.add(cubeporuchen_029, cubeporuchen_029MZ);
  cubeporuchen_029MirroredZ.position.set(110.174, 15.0653, 0);
  const cylinderporuchen_030Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_030 = new THREE.Mesh(
    cylinderporuchen_030Geometry,
    MetalMaterial,
  );
  cylinderporuchen_030.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_030MZ = cylinderporuchen_030.clone();
  cylinderporuchen_030.position.set(0, 0, -39.8071);
  cylinderporuchen_030MZ.position.set(0, 0, -37.6919);
  cylinderporuchen_030.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_030MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_030MirroredZ = new THREE.Group();
  cylinderporuchen_030MirroredZ.add(
    cylinderporuchen_030,
    cylinderporuchen_030MZ,
  );
  cylinderporuchen_030MirroredZ.position.set(109.1031, 15.2191, 0);
  const cylinderporuchen_031Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_031 = new THREE.Mesh(
    cylinderporuchen_031Geometry,
    MetalMaterial,
  );
  cylinderporuchen_031.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_031MZ = cylinderporuchen_031.clone();
  cylinderporuchen_031.position.set(0, 0, -39.8071);
  cylinderporuchen_031MZ.position.set(0, 0, -37.6919);
  cylinderporuchen_031.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_031MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_031MirroredZ = new THREE.Group();
  cylinderporuchen_031MirroredZ.add(
    cylinderporuchen_031,
    cylinderporuchen_031MZ,
  );
  cylinderporuchen_031MirroredZ.position.set(49.4927, 74.9621, 0);
  const cylinderporuchen_032Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_032 = new THREE.Mesh(
    cylinderporuchen_032Geometry,
    MetalMaterial,
  );
  cylinderporuchen_032.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_032MZ = cylinderporuchen_032.clone();
  cylinderporuchen_032.position.set(0, 0, -39.8071);
  cylinderporuchen_032MZ.position.set(0, 0, -37.6919);
  cylinderporuchen_032.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_032MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_032MirroredZ = new THREE.Group();
  cylinderporuchen_032MirroredZ.add(
    cylinderporuchen_032,
    cylinderporuchen_032MZ,
  );
  cylinderporuchen_032MirroredZ.position.set(111.1998, 14.9315, 0);
  const cubeporuchen_033Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_033 = new THREE.Mesh(
    cubeporuchen_033Geometry,
    MetalMaterial,
  );
  cubeporuchen_033.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_033MZ = cubeporuchen_033.clone();
  cubeporuchen_033.position.set(0, 0, -39.8079);
  cubeporuchen_033MZ.position.set(0, 0, -37.6911);
  cubeporuchen_033.setRotation(0.0, 3.1416, -3.1416);
  cubeporuchen_033MZ.setRotation(0.0, -3.1416, -3.1416);
  const cubeporuchen_033MirroredZ = new THREE.Group();
  cubeporuchen_033MirroredZ.add(cubeporuchen_033, cubeporuchen_033MZ);
  cubeporuchen_033MirroredZ.position.set(48.0437, 74.9617, 0);
  const cylinderporuchen_034Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_034 = new THREE.Mesh(
    cylinderporuchen_034Geometry,
    MetalMaterial,
  );
  cylinderporuchen_034.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_034MZ = cylinderporuchen_034.clone();
  cylinderporuchen_034.position.set(0, 0, -39.8071);
  cylinderporuchen_034MZ.position.set(0, 0, -37.6919);
  cylinderporuchen_034.setRotation(1.5708, 3.1416, -3.1416);
  cylinderporuchen_034MZ.setRotation(-1.5708, -3.1416, -3.1416);
  const cylinderporuchen_034MirroredZ = new THREE.Group();
  cylinderporuchen_034MirroredZ.add(
    cylinderporuchen_034,
    cylinderporuchen_034MZ,
  );
  cylinderporuchen_034MirroredZ.position.set(47.0178, 74.8895, 0);
  const cubenapolnik_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_009 = new THREE.Mesh(
    cubenapolnik_009Geometry,
    MetalMaterial,
  );
  cubenapolnik_009.position.set(48.1409, 74.2756, -38.7436);
  cubenapolnik_009.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_009.setRotation(1.5708, 3.1416, 0.0);

  const cubelestnica_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_001Group = new THREE.Group();
  for (let i = 0; i < 130; i++) {
    const cubelestnica_001 = new THREE.Mesh(
      cubelestnica_001Geometry,
      Metal_001Material,
    );
    cubelestnica_001.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_001.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_001Group.add(cubelestnica_001);
  }
  cubelestnica_001Group.setRotation(0.0, 3.1416, 0.0);
  cubelestnica_001Group.position.set(109.1031, 14.77, -35.9955);
  const cubenapolnik_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_002 = new THREE.Mesh(
    cubenapolnik_002Geometry,
    Metal_001Material,
  );
  cubenapolnik_002.position.set(110.174, 14.4269, -35.9896);
  cubenapolnik_002.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_002.setRotation(1.5708, 3.1416, 0.0);

  const cubeporuchen_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_003 = new THREE.Mesh(
    cubeporuchen_003Geometry,
    Metal_001Material,
  );
  cubeporuchen_003.scale.set(42.2406, 0.9024, 0.1501);
  const cubeporuchen_003MZ = cubeporuchen_003.clone();
  cubeporuchen_003.position.set(0, 0, -37.0539);
  cubeporuchen_003MZ.position.set(0, 0, -34.9371);
  cubeporuchen_003.setRotation(0.0, 3.1416, 0.7854);
  cubeporuchen_003MZ.setRotation(0.0, -3.1416, 0.7854);
  const cubeporuchen_003MirroredZ = new THREE.Group();
  cubeporuchen_003MirroredZ.add(cubeporuchen_003, cubeporuchen_003MZ);
  cubeporuchen_003MirroredZ.position.set(79.2887, 44.9262, 0);
  const cubeporuchen_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_002 = new THREE.Mesh(
    cubeporuchen_002Geometry,
    Metal_001Material,
  );
  cubeporuchen_002.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_002MZ = cubeporuchen_002.clone();
  cubeporuchen_002.position.set(0, 0, -37.0539);
  cubeporuchen_002MZ.position.set(0, 0, -34.9371);
  cubeporuchen_002.setRotation(0.0, 3.1416, 0.0);
  cubeporuchen_002MZ.setRotation(0.0, -3.1416, 0.0);
  const cubeporuchen_002MirroredZ = new THREE.Group();
  cubeporuchen_002MirroredZ.add(cubeporuchen_002, cubeporuchen_002MZ);
  cubeporuchen_002MirroredZ.position.set(110.174, 15.0653, 0);
  const cylinderporuchen_015Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_015 = new THREE.Mesh(
    cylinderporuchen_015Geometry,
    Metal_001Material,
  );
  cylinderporuchen_015.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_015MZ = cylinderporuchen_015.clone();
  cylinderporuchen_015.position.set(0, 0, -37.0531);
  cylinderporuchen_015MZ.position.set(0, 0, -34.9379);
  cylinderporuchen_015.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_015MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_015MirroredZ = new THREE.Group();
  cylinderporuchen_015MirroredZ.add(
    cylinderporuchen_015,
    cylinderporuchen_015MZ,
  );
  cylinderporuchen_015MirroredZ.position.set(109.1031, 15.2191, 0);
  const cylinderporuchen_014Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_014 = new THREE.Mesh(
    cylinderporuchen_014Geometry,
    Metal_001Material,
  );
  cylinderporuchen_014.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_014MZ = cylinderporuchen_014.clone();
  cylinderporuchen_014.position.set(0, 0, -37.0531);
  cylinderporuchen_014MZ.position.set(0, 0, -34.9379);
  cylinderporuchen_014.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_014MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_014MirroredZ = new THREE.Group();
  cylinderporuchen_014MirroredZ.add(
    cylinderporuchen_014,
    cylinderporuchen_014MZ,
  );
  cylinderporuchen_014MirroredZ.position.set(49.4927, 74.9621, 0);
  const cylinderporuchen_013Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_013 = new THREE.Mesh(
    cylinderporuchen_013Geometry,
    Metal_001Material,
  );
  cylinderporuchen_013.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_013MZ = cylinderporuchen_013.clone();
  cylinderporuchen_013.position.set(0, 0, -37.0531);
  cylinderporuchen_013MZ.position.set(0, 0, -34.9379);
  cylinderporuchen_013.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_013MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_013MirroredZ = new THREE.Group();
  cylinderporuchen_013MirroredZ.add(
    cylinderporuchen_013,
    cylinderporuchen_013MZ,
  );
  cylinderporuchen_013MirroredZ.position.set(111.1998, 14.9315, 0);
  const cubeporuchen_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_010 = new THREE.Mesh(
    cubeporuchen_010Geometry,
    Metal_001Material,
  );
  cubeporuchen_010.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_010MZ = cubeporuchen_010.clone();
  cubeporuchen_010.position.set(0, 0, -37.0539);
  cubeporuchen_010MZ.position.set(0, 0, -34.9371);
  cubeporuchen_010.setRotation(0.0, 3.1416, -3.1416);
  cubeporuchen_010MZ.setRotation(0.0, -3.1416, -3.1416);
  const cubeporuchen_010MirroredZ = new THREE.Group();
  cubeporuchen_010MirroredZ.add(cubeporuchen_010, cubeporuchen_010MZ);
  cubeporuchen_010MirroredZ.position.set(48.0437, 74.9617, 0);
  const cylinderporuchen_001Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_001 = new THREE.Mesh(
    cylinderporuchen_001Geometry,
    Metal_001Material,
  );
  cylinderporuchen_001.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_001MZ = cylinderporuchen_001.clone();
  cylinderporuchen_001.position.set(0, 0, -37.0531);
  cylinderporuchen_001MZ.position.set(0, 0, -34.9379);
  cylinderporuchen_001.setRotation(1.5708, 3.1416, -3.1416);
  cylinderporuchen_001MZ.setRotation(-1.5708, -3.1416, -3.1416);
  const cylinderporuchen_001MirroredZ = new THREE.Group();
  cylinderporuchen_001MirroredZ.add(
    cylinderporuchen_001,
    cylinderporuchen_001MZ,
  );
  cylinderporuchen_001MirroredZ.position.set(47.0178, 74.8895, 0);
  const cubenapolnik_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_007 = new THREE.Mesh(
    cubenapolnik_007Geometry,
    Metal_001Material,
  );
  cubenapolnik_007.position.set(48.1409, 74.2756, -35.9896);
  cubenapolnik_007.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_007.setRotation(1.5708, 3.1416, 0.0);

  const cubelestnica_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_002Group = new THREE.Group();
  for (let i = 0; i < 130; i++) {
    const cubelestnica_002 = new THREE.Mesh(
      cubelestnica_002Geometry,
      Metal_002Material,
    );
    cubelestnica_002.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_002.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_002Group.add(cubelestnica_002);
  }
  cubelestnica_002Group.setRotation(0.0, 3.1416, 0.0);
  cubelestnica_002Group.position.set(109.1031, 14.77, -43.5771);
  const cubenapolnik_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_004 = new THREE.Mesh(
    cubenapolnik_004Geometry,
    Metal_002Material,
  );
  cubenapolnik_004.position.set(110.174, 14.4269, -43.5712);
  cubenapolnik_004.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_004.setRotation(1.5708, 3.1416, 0.0);

  const cubeporuchen_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_006 = new THREE.Mesh(
    cubeporuchen_006Geometry,
    Metal_002Material,
  );
  cubeporuchen_006.scale.set(42.2406, 0.9024, 0.1501);
  const cubeporuchen_006MZ = cubeporuchen_006.clone();
  cubeporuchen_006.position.set(0, 0, -44.6355);
  cubeporuchen_006MZ.position.set(0, 0, -42.5187);
  cubeporuchen_006.setRotation(0.0, 3.1416, 0.7854);
  cubeporuchen_006MZ.setRotation(0.0, -3.1416, 0.7854);
  const cubeporuchen_006MirroredZ = new THREE.Group();
  cubeporuchen_006MirroredZ.add(cubeporuchen_006, cubeporuchen_006MZ);
  cubeporuchen_006MirroredZ.position.set(79.2887, 44.9262, 0);
  const cubeporuchen_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_011 = new THREE.Mesh(
    cubeporuchen_011Geometry,
    Metal_002Material,
  );
  cubeporuchen_011.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_011MZ = cubeporuchen_011.clone();
  cubeporuchen_011.position.set(0, 0, -44.6355);
  cubeporuchen_011MZ.position.set(0, 0, -42.5187);
  cubeporuchen_011.setRotation(0.0, 3.1416, 0.0);
  cubeporuchen_011MZ.setRotation(0.0, -3.1416, 0.0);
  const cubeporuchen_011MirroredZ = new THREE.Group();
  cubeporuchen_011MirroredZ.add(cubeporuchen_011, cubeporuchen_011MZ);
  cubeporuchen_011MirroredZ.position.set(110.174, 15.0653, 0);
  const cylinderporuchen_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_008 = new THREE.Mesh(
    cylinderporuchen_008Geometry,
    Metal_002Material,
  );
  cylinderporuchen_008.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_008MZ = cylinderporuchen_008.clone();
  cylinderporuchen_008.position.set(0, 0, -44.6347);
  cylinderporuchen_008MZ.position.set(0, 0, -42.5195);
  cylinderporuchen_008.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_008MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_008MirroredZ = new THREE.Group();
  cylinderporuchen_008MirroredZ.add(
    cylinderporuchen_008,
    cylinderporuchen_008MZ,
  );
  cylinderporuchen_008MirroredZ.position.set(109.1031, 15.2191, 0);
  const cylinderporuchen_007Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_007 = new THREE.Mesh(
    cylinderporuchen_007Geometry,
    Metal_002Material,
  );
  cylinderporuchen_007.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_007MZ = cylinderporuchen_007.clone();
  cylinderporuchen_007.position.set(0, 0, -44.6347);
  cylinderporuchen_007MZ.position.set(0, 0, -42.5195);
  cylinderporuchen_007.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_007MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_007MirroredZ = new THREE.Group();
  cylinderporuchen_007MirroredZ.add(
    cylinderporuchen_007,
    cylinderporuchen_007MZ,
  );
  cylinderporuchen_007MirroredZ.position.set(49.4927, 74.9621, 0);
  const cylinderporuchen_016Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_016 = new THREE.Mesh(
    cylinderporuchen_016Geometry,
    Metal_002Material,
  );
  cylinderporuchen_016.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_016MZ = cylinderporuchen_016.clone();
  cylinderporuchen_016.position.set(0, 0, -44.6347);
  cylinderporuchen_016MZ.position.set(0, 0, -42.5195);
  cylinderporuchen_016.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_016MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_016MirroredZ = new THREE.Group();
  cylinderporuchen_016MirroredZ.add(
    cylinderporuchen_016,
    cylinderporuchen_016MZ,
  );
  cylinderporuchen_016MirroredZ.position.set(111.1998, 14.9315, 0);
  const cubeporuchen_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_004 = new THREE.Mesh(
    cubeporuchen_004Geometry,
    Metal_002Material,
  );
  cubeporuchen_004.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_004MZ = cubeporuchen_004.clone();
  cubeporuchen_004.position.set(0, 0, -44.6355);
  cubeporuchen_004MZ.position.set(0, 0, -42.5187);
  cubeporuchen_004.setRotation(0.0, 3.1416, -3.1416);
  cubeporuchen_004MZ.setRotation(0.0, -3.1416, -3.1416);
  const cubeporuchen_004MirroredZ = new THREE.Group();
  cubeporuchen_004MirroredZ.add(cubeporuchen_004, cubeporuchen_004MZ);
  cubeporuchen_004MirroredZ.position.set(48.0437, 74.9617, 0);
  const cylinderporuchen_005Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_005 = new THREE.Mesh(
    cylinderporuchen_005Geometry,
    Metal_002Material,
  );
  cylinderporuchen_005.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_005MZ = cylinderporuchen_005.clone();
  cylinderporuchen_005.position.set(0, 0, -44.6347);
  cylinderporuchen_005MZ.position.set(0, 0, -42.5195);
  cylinderporuchen_005.setRotation(1.5708, 3.1416, -3.1416);
  cylinderporuchen_005MZ.setRotation(-1.5708, -3.1416, -3.1416);
  const cylinderporuchen_005MirroredZ = new THREE.Group();
  cylinderporuchen_005MirroredZ.add(
    cylinderporuchen_005,
    cylinderporuchen_005MZ,
  );
  cylinderporuchen_005MirroredZ.position.set(47.0178, 74.8895, 0);
  const cubenapolnik_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_003 = new THREE.Mesh(
    cubenapolnik_003Geometry,
    Metal_002Material,
  );
  cubenapolnik_003.position.set(48.1409, 74.2756, -43.5712);
  cubenapolnik_003.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_003.setRotation(1.5708, 3.1416, 0.0);

  const cubelestnica_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubelestnica_003Group = new THREE.Group();
  for (let i = 0; i < 130; i++) {
    const cubelestnica_003 = new THREE.Mesh(
      cubelestnica_003Geometry,
      Metal_003Material,
    );
    cubelestnica_003.scale.set(0.2302, 0.2302, 1.0);
    cubelestnica_003.position.set(0.4605 * i, 0.4605 * i, 0);
    cubelestnica_003Group.add(cubelestnica_003);
  }
  cubelestnica_003Group.setRotation(0.0, 3.1416, 0.0);
  cubelestnica_003Group.position.set(109.1031, 14.77, -46.46);
  const cubenapolnik_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_006 = new THREE.Mesh(
    cubenapolnik_006Geometry,
    Metal_003Material,
  );
  cubenapolnik_006.position.set(110.174, 14.4269, -46.4541);
  cubenapolnik_006.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_006.setRotation(1.5708, 3.1416, 0.0);

  const cubeporuchen_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_009 = new THREE.Mesh(
    cubeporuchen_009Geometry,
    Metal_003Material,
  );
  cubeporuchen_009.scale.set(42.2406, 0.9024, 0.1501);
  const cubeporuchen_009MZ = cubeporuchen_009.clone();
  cubeporuchen_009.position.set(0, 0, -47.5184);
  cubeporuchen_009MZ.position.set(0, 0, -45.4016);
  cubeporuchen_009.setRotation(0.0, 3.1416, 0.7854);
  cubeporuchen_009MZ.setRotation(0.0, -3.1416, 0.7854);
  const cubeporuchen_009MirroredZ = new THREE.Group();
  cubeporuchen_009MirroredZ.add(cubeporuchen_009, cubeporuchen_009MZ);
  cubeporuchen_009MirroredZ.position.set(79.2887, 44.9262, 0);
  const cubeporuchen_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_008 = new THREE.Mesh(
    cubeporuchen_008Geometry,
    Metal_003Material,
  );
  cubeporuchen_008.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_008MZ = cubeporuchen_008.clone();
  cubeporuchen_008.position.set(0, 0, -47.5184);
  cubeporuchen_008MZ.position.set(0, 0, -45.4016);
  cubeporuchen_008.setRotation(0.0, 3.1416, 0.0);
  cubeporuchen_008MZ.setRotation(0.0, -3.1416, 0.0);
  const cubeporuchen_008MirroredZ = new THREE.Group();
  cubeporuchen_008MirroredZ.add(cubeporuchen_008, cubeporuchen_008MZ);
  cubeporuchen_008MirroredZ.position.set(110.174, 15.0653, 0);
  const cylinderporuchen_012Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_012 = new THREE.Mesh(
    cylinderporuchen_012Geometry,
    Metal_003Material,
  );
  cylinderporuchen_012.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_012MZ = cylinderporuchen_012.clone();
  cylinderporuchen_012.position.set(0, 0, -47.5176);
  cylinderporuchen_012MZ.position.set(0, 0, -45.4024);
  cylinderporuchen_012.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_012MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_012MirroredZ = new THREE.Group();
  cylinderporuchen_012MirroredZ.add(
    cylinderporuchen_012,
    cylinderporuchen_012MZ,
  );
  cylinderporuchen_012MirroredZ.position.set(109.1031, 15.2191, 0);
  const cylinderporuchen_011Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_011 = new THREE.Mesh(
    cylinderporuchen_011Geometry,
    Metal_003Material,
  );
  cylinderporuchen_011.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_011MZ = cylinderporuchen_011.clone();
  cylinderporuchen_011.position.set(0, 0, -47.5176);
  cylinderporuchen_011MZ.position.set(0, 0, -45.4024);
  cylinderporuchen_011.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_011MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_011MirroredZ = new THREE.Group();
  cylinderporuchen_011MirroredZ.add(
    cylinderporuchen_011,
    cylinderporuchen_011MZ,
  );
  cylinderporuchen_011MirroredZ.position.set(49.4927, 74.9621, 0);
  const cylinderporuchen_010Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_010 = new THREE.Mesh(
    cylinderporuchen_010Geometry,
    Metal_003Material,
  );
  cylinderporuchen_010.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_010MZ = cylinderporuchen_010.clone();
  cylinderporuchen_010.position.set(0, 0, -47.5176);
  cylinderporuchen_010MZ.position.set(0, 0, -45.4024);
  cylinderporuchen_010.setRotation(1.5708, 3.1416, 0.0);
  cylinderporuchen_010MZ.setRotation(-1.5708, -3.1416, 0.0);
  const cylinderporuchen_010MirroredZ = new THREE.Group();
  cylinderporuchen_010MirroredZ.add(
    cylinderporuchen_010,
    cylinderporuchen_010MZ,
  );
  cylinderporuchen_010MirroredZ.position.set(111.1998, 14.9315, 0);
  const cubeporuchen_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeporuchen_007 = new THREE.Mesh(
    cubeporuchen_007Geometry,
    Metal_003Material,
  );
  cubeporuchen_007.scale.set(1.0888, 0.8356, 0.1501);
  const cubeporuchen_007MZ = cubeporuchen_007.clone();
  cubeporuchen_007.position.set(0, 0, -47.5184);
  cubeporuchen_007MZ.position.set(0, 0, -45.4016);
  cubeporuchen_007.setRotation(0.0, 3.1416, -3.1416);
  cubeporuchen_007MZ.setRotation(0.0, -3.1416, -3.1416);
  const cubeporuchen_007MirroredZ = new THREE.Group();
  cubeporuchen_007MirroredZ.add(cubeporuchen_007, cubeporuchen_007MZ);
  cubeporuchen_007MirroredZ.position.set(48.0437, 74.9617, 0);
  const cylinderporuchen_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderporuchen_009 = new THREE.Mesh(
    cylinderporuchen_009Geometry,
    Metal_003Material,
  );
  cylinderporuchen_009.scale.set(1.0, 0.1516, 1.0);
  const cylinderporuchen_009MZ = cylinderporuchen_009.clone();
  cylinderporuchen_009.position.set(0, 0, -47.5176);
  cylinderporuchen_009MZ.position.set(0, 0, -45.4024);
  cylinderporuchen_009.setRotation(1.5708, 3.1416, -3.1416);
  cylinderporuchen_009MZ.setRotation(-1.5708, -3.1416, -3.1416);
  const cylinderporuchen_009MirroredZ = new THREE.Group();
  cylinderporuchen_009MirroredZ.add(
    cylinderporuchen_009,
    cylinderporuchen_009MZ,
  );
  cylinderporuchen_009MirroredZ.position.set(47.0178, 74.8895, 0);
  const cubenapolnik_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenapolnik_005 = new THREE.Mesh(
    cubenapolnik_005Geometry,
    Metal_003Material,
  );
  cubenapolnik_005.position.set(48.1409, 74.2756, -46.4541);
  cubenapolnik_005.scale.set(1.3957, 0.9468, 0.1099);
  cubenapolnik_005.setRotation(1.5708, 3.1416, 0.0);

  const cubeplatformaGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma = new THREE.Mesh(
    cubeplatformaGeometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma.position.set(0.0, -1.8366, -0.0);
  cubeplatforma.scale.set(50.7068, 2.6625, 15.7104);

  const cylinderkolonnaGroup = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinderkolonna = createKolonna();
    cylinderkolonna.scale.set(1, 1, 1);

    const cylinderkolonnaMZ = cylinderkolonna.clone();
    cylinderkolonna.position.set(0, 0, -7.1816);
    cylinderkolonnaMZ.position.set(0, 0, 7.1816);
    cylinderkolonna.setRotation(0.0, 0.0, -0.0);
    cylinderkolonnaMZ.setRotation(0.0, PI, -0.0);
    const cylinderkolonnaMirroredZ = new THREE.Group();
    cylinderkolonnaMirroredZ.add(cylinderkolonna, cylinderkolonnaMZ);
    cylinderkolonnaMirroredZ.position.set(5.3716 * i, 0, 0);

    cylinderkolonnaGroup.add(cylinderkolonnaMirroredZ);
  }
  cylinderkolonnaGroup.scale.set(1, 1, 1);
  cylinderkolonnaGroup.position.set(-29.3436, 3.1864, 0);

  const cubezadnyayactenaGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubezadnyayactena = new THREE.Mesh(
    cubezadnyayactenaGeometry,
    NapolnayaPlitkaMaterial,
  );
  cubezadnyayactena.position.set(-41.1399, 5.7355, -0.0);
  cubezadnyayactena.scale.set(9.4309, 6.6795, 13.2992);

  const cubezadnyayactena_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubezadnyayactena_005 = new THREE.Mesh(
    cubezadnyayactena_005Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubezadnyayactena_005.position.set(-50.9049, 5.7355, -0.0);
  cubezadnyayactena_005.scale.set(1.3866, 13.2495, 26.3803);

  const cubeplatforma_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_001 = new THREE.Mesh(
    cubeplatforma_001Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_001.position.set(81.3975, 4.9485, -0.0);
  cubeplatforma_001.scale.set(18.8583, 9.1838, 10.2647);

  const cubeplatforma_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_002 = new THREE.Mesh(
    cubeplatforma_002Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_002.position.set(108.7083, 4.9485, -9.36);
  cubeplatforma_002.scale.set(18.8583, 9.1838, 10.2647);
  cubeplatforma_002.setRotation(0.0, 0.6632, 0.0);

  const cubeplatforma_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_003 = new THREE.Mesh(
    cubeplatforma_003Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_003.position.set(119.9306, 4.9485, -31.787);
  cubeplatforma_003.scale.set(18.8583, 9.1838, 10.2647);
  cubeplatforma_003.setRotation(0.0, 1.5708, 0.0);

  const cubeplatforma_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_004 = new THREE.Mesh(
    cubeplatforma_004Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_004.position.set(119.9306, 17.1768, -54.3248);
  cubeplatforma_004.scale.set(4.524, 20.7624, 13.0694);
  cubeplatforma_004.setRotation(0.0, 1.5708, 0.0);

  const cubeplatforma_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_005 = new THREE.Mesh(
    cubeplatforma_005Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_005.position.set(80.4003, 11.7972, -11.1806);
  cubeplatforma_005.scale.set(18.8583, 13.6124, -1.6351);

  const cubeplatforma_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_006 = new THREE.Mesh(
    cubeplatforma_006Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_006.position.set(103.2543, 16.2657, -16.3414);
  cubeplatforma_006.scale.set(8.1106, 9.1838, -1.4964);
  cubeplatforma_006.setRotation(0.0, 0.6632, 0.0);

  const cubeplatforma_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_007 = new THREE.Mesh(
    cubeplatforma_007Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_007.position.set(109.0647, 16.3831, -27.0969);
  cubeplatforma_007.scale.set(6.4677, 9.1838, -2.1092);
  cubeplatforma_007.setRotation(0.0, 1.5708, 0.0);

  const cubeplatforma_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeplatforma_008 = new THREE.Mesh(
    cubeplatforma_008Geometry,
    NapolnayaPlitkaMaterial,
  );
  cubeplatforma_008.position.set(4.2305, 17.1768, -40.2182);
  cubeplatforma_008.scale.set(9.9024, 57.1623, 45.22);
  cubeplatforma_008.setRotation(0.0, 1.5708, 0.0);

  const cubenadkolonnie_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenadkolonnie_001 = new THREE.Mesh(
    cubenadkolonnie_001Geometry,
    Material,
  );
  cubenadkolonnie_001.scale.set(31.6438, 0.1921, 0.7246);
  const cubenadkolonnie_001MZ = cubenadkolonnie_001.clone();
  cubenadkolonnie_001.position.set(0, 0, -6.2798);
  cubenadkolonnie_001MZ.position.set(0, 0, 6.2798);
  cubenadkolonnie_001.setRotation(0.0, 0.0, -0.0);
  cubenadkolonnie_001MZ.setRotation(0.0, -0.0, -0.0);
  const cubenadkolonnie_001MirroredZ = new THREE.Group();
  cubenadkolonnie_001MirroredZ.add(cubenadkolonnie_001, cubenadkolonnie_001MZ);
  cubenadkolonnie_001MirroredZ.position.set(0.0, 7.0259, 0);
  const cubenadkolonnie_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenadkolonnie_002 = new THREE.Mesh(
    cubenadkolonnie_002Geometry,
    Material,
  );
  cubenadkolonnie_002.scale.set(31.6438, 0.1921, 0.7246);
  const cubenadkolonnie_002MZ = cubenadkolonnie_002.clone();
  cubenadkolonnie_002.position.set(0, 0, -6.124);
  cubenadkolonnie_002MZ.position.set(0, 0, 6.124);
  cubenadkolonnie_002.setRotation(-0.7258, 0.0, 0.0);
  cubenadkolonnie_002MZ.setRotation(0.7258, -0.0, 0.0);
  const cubenadkolonnie_002MirroredZ = new THREE.Group();
  cubenadkolonnie_002MirroredZ.add(cubenadkolonnie_002, cubenadkolonnie_002MZ);
  cubenadkolonnie_002MirroredZ.position.set(0.0, 6.5967, 0);
  const cubenadkolonnie_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubenadkolonnie_003 = new THREE.Mesh(
    cubenadkolonnie_003Geometry,
    Material,
  );
  cubenadkolonnie_003.scale.set(31.6438, 0.1921, 0.7246);
  const cubenadkolonnie_003MZ = cubenadkolonnie_003.clone();
  cubenadkolonnie_003.position.set(0, 0, -7.1651);
  cubenadkolonnie_003MZ.position.set(0, 0, 7.1651);
  cubenadkolonnie_003.setRotation(0.0, 0.0, -0.0);
  cubenadkolonnie_003MZ.setRotation(0.0, -0.0, -0.0);
  const cubenadkolonnie_003MirroredZ = new THREE.Group();
  cubenadkolonnie_003MirroredZ.add(cubenadkolonnie_003, cubenadkolonnie_003MZ);
  cubenadkolonnie_003MirroredZ.position.set(0.0, 6.0642, 0);
  const out = new THREE.Group();
  out.add(
    cubeportret,
    cubeobramlenie,
    cubeobramlenie_001,
    cubeobramlenie_002,
    cubemalayakrysha_001MirroredZ,
    cubemalayakryshaMirroredZ,
    cubebolshayakrysha_001MirroredZ,
    cubebolshayakrysha_002MirroredZ,
    cubebolshayakrysha_003MirroredZ,
    cubebolshayakryshaMirroredZ,
    cubesmotritel,
    cubesmotritel_001,
    cubesmotritel_002,
    cubesmotritel_003,
    cubesmotritel_004,
    cubesmotritel_005,
    cubesmotritel_006,
    cubesmotritel_007,
    cubesmotritel_008,
    cubesmotritel_009,
    cubesmotritel_010,
    cubesmotritel_011,
    cubesmotritel_012,
    cubesmotritel_013,
    cubesmotritel_014,
    cubesmotritel_015,
    cubesmotritel_016,
    cubesmotritel_017,
    cubesmotritel_018,
    cubesmotritel_019,
    cubelestnicaGroup,
    cubenapolnik,
    cubeporuchenMirroredZ,
    cubeporuchen_001MirroredZ,
    cylinderporuchen_002MirroredZ,
    cylinderporuchen_003MirroredZ,
    cylinderporuchen_004MirroredZ,
    cubeporuchen_005MirroredZ,
    cylinderporuchen_006MirroredZ,
    cubenapolnik_001,
    cubelestnica_005Group,
    cubenapolnik_011,
    cubeporuchen_014MirroredZ,
    cubeporuchen_013MirroredZ,
    cylinderporuchen_020MirroredZ,
    cylinderporuchen_019MirroredZ,
    cylinderporuchen_018MirroredZ,
    cubeporuchen_012MirroredZ,
    cylinderporuchen_017MirroredZ,
    cubenapolnik_010,
    cubelestnica_006Group,
    cubenapolnik_013,
    cubeporuchen_017MirroredZ,
    cubeporuchen_016MirroredZ,
    cylinderporuchen_024MirroredZ,
    cylinderporuchen_023MirroredZ,
    cylinderporuchen_022MirroredZ,
    cubeporuchen_015MirroredZ,
    cylinderporuchen_021MirroredZ,
    cubenapolnik_012,
    cubelestnica_007Group,
    cubenapolnik_015,
    cubeporuchen_020MirroredZ,
    cubeporuchen_019MirroredZ,
    cylinderporuchen_028MirroredZ,
    cylinderporuchen_027MirroredZ,
    cylinderporuchen_026MirroredZ,
    cubeporuchen_018MirroredZ,
    cylinderporuchen_025MirroredZ,
    cubenapolnik_014,
    cubesmotritel_020,
    cubesmotritel_021,
    cubesmotritel_022,
    cubesmotritel_023,
    cubesmotritel_024,
    cubesmotritel_025,
    cubesmotritel_026,
    cubesmotritel_027,
    cubesmotritel_028,
    cubesmotritel_029,
    cubesmotritel_030,
    cubesmotritel_031,
    cubesmotritel_032,
    cubesmotritel_033,
    cubesmotritel_034,
    cubesmotritel_035,
    cubesmotritel_036,
    cubesmotritel_037,
    cubesmotritel_038,
    cubesmotritel_039,
    cubelestnica_004Group,
    cubenapolnik_008,
    cubeporuchen_028MirroredZ,
    cubeporuchen_029MirroredZ,
    cylinderporuchen_030MirroredZ,
    cylinderporuchen_031MirroredZ,
    cylinderporuchen_032MirroredZ,
    cubeporuchen_033MirroredZ,
    cylinderporuchen_034MirroredZ,
    cubenapolnik_009,
    cubelestnica_001Group,
    cubenapolnik_002,
    cubeporuchen_003MirroredZ,
    cubeporuchen_002MirroredZ,
    cylinderporuchen_015MirroredZ,
    cylinderporuchen_014MirroredZ,
    cylinderporuchen_013MirroredZ,
    cubeporuchen_010MirroredZ,
    cylinderporuchen_001MirroredZ,
    cubenapolnik_007,
    cubelestnica_002Group,
    cubenapolnik_004,
    cubeporuchen_006MirroredZ,
    cubeporuchen_011MirroredZ,
    cylinderporuchen_008MirroredZ,
    cylinderporuchen_007MirroredZ,
    cylinderporuchen_016MirroredZ,
    cubeporuchen_004MirroredZ,
    cylinderporuchen_005MirroredZ,
    cubenapolnik_003,
    cubelestnica_003Group,
    cubenapolnik_006,
    cubeporuchen_009MirroredZ,
    cubeporuchen_008MirroredZ,
    cylinderporuchen_012MirroredZ,
    cylinderporuchen_011MirroredZ,
    cylinderporuchen_010MirroredZ,
    cubeporuchen_007MirroredZ,
    cylinderporuchen_009MirroredZ,
    cubenapolnik_005,
    cubeplatforma,
    cylinderkolonnaGroup,
    cubezadnyayactena,
    cubezadnyayactena_005,
    cubeplatforma_001,
    cubeplatforma_002,
    cubeplatforma_003,
    cubeplatforma_004,
    cubeplatforma_005,
    cubeplatforma_006,
    cubeplatforma_007,
    cubeplatforma_008,
    cubenadkolonnie_001MirroredZ,
    cubenadkolonnie_002MirroredZ,
    cubenadkolonnie_003MirroredZ,
  );

  out.traverse((obj) => {
    obj.receiveShadow = true;
    obj.castShadow = true;
  });

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
    camera.position.x = -20;
    camera.position.y = 20;
    camera.position.z = 20;
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.shadowMap.width = 1024;
    renderer.shadowMap.height = 1024;
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    // привяжем отрисовку к html и высоте канвы
    // renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('wCanvas')?.appendChild(renderer.domElement);
    renderer.setSize(WC, HC);
    // установим модуль управления камерой
    setupcontrols(scene);

    // источники света
    scene.add(new THREE.AmbientLight(0x555555, 2));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 4, 4).multiplyScalar(100);
    directionalLight2.position.set(-5, 2, 4).multiplyScalar(10);

    [directionalLight, directionalLight2].forEach((light) => {
      light.castShadow = true;
      light.shadow.camera.left = -1000;
      light.shadow.camera.bottom = -1000;
      light.shadow.camera.right = 1000;
      light.shadow.camera.top = 1000;
      light.shadow.camera.far = 100000;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.normalBias = 4;
    });

    scene.add(directionalLight);
    scene.add(directionalLight2);

    // balon ignore
    document.body.appendChild(renderer.domElement);
  }
}
// balon block begin
function setupcontrols(scene: THREE.Scene) {
  const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
  const _vector = new THREE.Vector3();

  const _changeEvent = { type: 'change' };
  const _lockEvent = { type: 'lock' };
  const _unlockEvent = { type: 'unlock' };

  const _PI_2 = Math.PI / 2;

  interface ListenerEvent {
    target?: unknown;
    type: string;
    message?: unknown;
  }
  type ListenerEventLambda = (event: ListenerEvent) => unknown;
  class PointerLockControls {
    camera: THREE.Camera;
    domElement: HTMLElement;
    _listeners?: {
      [index: string]: ListenerEventLambda[];
    };

    isLocked: boolean;

    minPolarAngle: number;
    maxPolarAngle: number;

    pointerSpeed: number;

    _onMouseMove: (event: MouseEvent) => void;
    _onPointerlockChange: (event: unknown) => void;
    _onPointerlockError: (event: unknown) => void;
    constructor(camera: THREE.Camera, domElement: HTMLElement) {
      this.camera = camera;
      this.domElement = domElement;

      this.isLocked = false;

      // Set to constrain the pitch of the camera
      // Range is 0 to Math.PI radians
      this.minPolarAngle = 0; // radians
      this.maxPolarAngle = Math.PI; // radians

      this.pointerSpeed = 1.0;

      this._onMouseMove = this.onMouseMove.bind(this);
      this._onPointerlockChange = this.onPointerlockChange.bind(this);
      this._onPointerlockError = this.onPointerlockError.bind(this);

      this.connect();
    }

    connect() {
      this.domElement.ownerDocument.addEventListener(
        'mousemove',
        this._onMouseMove,
      );
      this.domElement.ownerDocument.addEventListener(
        'pointerlockchange',
        this._onPointerlockChange,
      );
      this.domElement.ownerDocument.addEventListener(
        'pointerlockerror',
        this._onPointerlockError,
      );
    }

    disconnect() {
      this.domElement.ownerDocument.removeEventListener(
        'mousemove',
        this._onMouseMove,
      );
      this.domElement.ownerDocument.removeEventListener(
        'pointerlockchange',
        this._onPointerlockChange,
      );
      this.domElement.ownerDocument.removeEventListener(
        'pointerlockerror',
        this._onPointerlockError,
      );
    }

    dispose() {
      this.disconnect();
    }

    getObject() {
      // retaining this method for backward compatibility

      return this.camera;
    }

    getDirection(v: THREE.Vector3) {
      return v.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    }

    moveForward(distance: number) {
      // move forward parallel to the xz-plane
      // assumes camera.up is y-up

      const camera = this.camera;

      _vector.setFromMatrixColumn(camera.matrix, 0);

      _vector.crossVectors(camera.up, _vector);

      camera.position.addScaledVector(_vector, distance);
    }

    moveRight(distance: number) {
      const camera = this.camera;

      _vector.setFromMatrixColumn(camera.matrix, 0);

      camera.position.addScaledVector(_vector, distance);
    }

    lock() {
      this.domElement.requestPointerLock();
    }

    unlock() {
      this.domElement.ownerDocument.exitPointerLock();
    }
    // event listeners
    addEventListener(type: string, listener: ListenerEventLambda) {
      if (this._listeners === undefined) this._listeners = {};

      const listeners = this._listeners;

      if (listeners[type] === undefined) {
        listeners[type] = [];
      }

      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    }

    hasEventListener(type: string, listener: ListenerEventLambda) {
      if (this._listeners === undefined) return false;

      const listeners = this._listeners;

      return (
        listeners[type] !== undefined &&
        listeners[type].indexOf(listener) !== -1
      );
    }

    removeEventListener(type: string, listener: ListenerEventLambda) {
      if (this._listeners === undefined) return;

      const listeners = this._listeners;
      const listenerArray = listeners[type];

      if (listenerArray !== undefined) {
        const index = listenerArray.indexOf(listener);

        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    }

    dispatchEvent(event: ListenerEvent) {
      if (this._listeners === undefined) return;

      const listeners = this._listeners;
      const listenerArray = listeners[event.type];

      if (listenerArray !== undefined) {
        event.target = this;

        // Make a copy, in case listeners are removed while iterating.
        const array = listenerArray.slice(0);

        for (let i = 0, l = array.length; i < l; i++) {
          array[i].call(this, event);
        }
      }
    }
    onMouseMove(event: MouseEvent) {
      if (this.isLocked === false) return;

      let movementX = event.movementX || 0;
      if ('mozMovementX' in event) movementX = event.mozMovementX as number;
      if ('webkitMovementX' in event)
        movementX = event.webkitMovementX as number;

      const movementY = event.movementY || 0;
      if ('mozMovementY' in event) movementX = event.mozMovementY as number;
      if ('webkitMovementY' in event)
        movementX = event.webkitMovementY as number;

      const camera = this.camera;
      _euler.setFromQuaternion(camera.quaternion);

      _euler.y -= movementX * 0.002 * this.pointerSpeed;
      _euler.x -= movementY * 0.002 * this.pointerSpeed;

      _euler.x = Math.max(
        _PI_2 - this.maxPolarAngle,
        Math.min(_PI_2 - this.minPolarAngle, _euler.x),
      );

      camera.quaternion.setFromEuler(_euler);

      this.dispatchEvent(_changeEvent);
    }

    onPointerlockChange() {
      if (
        this.domElement.ownerDocument.pointerLockElement === this.domElement
      ) {
        this.dispatchEvent(_lockEvent);

        this.isLocked = true;
      } else {
        this.dispatchEvent(_unlockEvent);

        this.isLocked = false;
      }
    }

    onPointerlockError() {
      console.error(
        'THREE.PointerLockControls: Unable to use Pointer Lock API',
      );
    }
  }

  controls = new PointerLockControls(camera, renderer.domElement);
  controls.getObject().position.set(-0.572, 1.8259, -0.0787);
  scene.add(controls.getObject());

  const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if (!isFly) {
          if (canJump === true) velocity.y += 50;
          canJump = false;
        } else {
          controls.getObject().position.y += event.shiftKey ? -5 : 5;
        }
        break;
    }
  };

  const onKeyUp = function (event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  document.addEventListener('click', function () {
    controls.lock();
  });
}
// balon block end
