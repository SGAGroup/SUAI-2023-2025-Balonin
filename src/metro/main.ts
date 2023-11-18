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
let Marsianka: THREE.Object3D;
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let controls: THREE.OrbitControls;
// balon ignore end

function main() {
  // balon block begin
  if (tick == 0) {
    if (typeof sceneexist == 'undefined') {
      OpenCanvas('wCanvas', (WC = window.innerWidth * 0.75), (HC = window.innerHeight * 0.75));
      CreateScene(WC, HC);

      // balon setup

      Marsianka = createMetroStation();
      Marsianka.position.set(X, Y, Z);
      Marsianka.scale.set(W, W, W);
      scene.add(Marsianka);

      const vagon = createVagon();
      vagon.position.set(16, 0, 0);
      const s = 0.8;
      vagon.scale.set(s, s, s);
      scene.add(vagon);

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
  const deltaRight = new THREE.Vector3(0, 0, -2);
  const dT = 0.01;
  animatables.doors.forEach((door) => {
    if (!door.initPos) door.initPos = { left: door.left.position.clone(), right: door.right.position.clone() };
    door.transition += dT;
    const leftTarget = door.state ? door.initPos.left : door.initPos.left.clone().add(deltaRight);
    const rightTarget = door.state
      ? door.initPos.right
      : door.initPos.right.clone().add(deltaRight.clone().multiplyScalar(-1));
    if (door.transition > 1 || door.transition < 0) {
      door.state = !door.state;
      door.transition = 0;
    }
    door.left.position.lerp(leftTarget, door.transition);
    door.right.position.lerp(rightTarget, door.transition);
  });
}

function createMetroStation() {
  const CubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const CubeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7951, 0.1565, 0.3541) });
  const Cube = new THREE.Mesh(CubeGeometry, CubeMaterial);
  Cube.scale.set(13.0823, 0.2679, 21.8795);

  const Cube_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_001Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5106, 0.0754, 0.8399) });
  const Cube_001 = new THREE.Mesh(Cube_001Geometry, Cube_001Material);
  Cube_001.position.set(0.0, 0.4623, 16.9036);
  Cube_001.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_002Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8858, 0.8273, 0.3455) });
  const Cube_002 = new THREE.Mesh(Cube_002Geometry, Cube_002Material);
  Cube_002.position.set(0.0, 5.1169, 21.5582);
  Cube_002.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_003Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5612, 0.4027, 0.869) });
  const Cube_003 = new THREE.Mesh(Cube_003Geometry, Cube_003Material);
  Cube_003.position.set(0.0, 4.5997, 21.041);
  Cube_003.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_004Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1836, 0.3921, 0.5983) });
  const Cube_004 = new THREE.Mesh(Cube_004Geometry, Cube_004Material);
  Cube_004.position.set(0.0, 4.0825, 20.5238);
  Cube_004.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_005Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.998, 0.1974, 0.276) });
  const Cube_005 = new THREE.Mesh(Cube_005Geometry, Cube_005Material);
  Cube_005.position.set(0.0, 3.5653, 20.0067);
  Cube_005.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_006Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4806, 0.0481, 0.5683) });
  const Cube_006 = new THREE.Mesh(Cube_006Geometry, Cube_006Material);
  Cube_006.position.set(0.0, 3.0482, 19.4895);
  Cube_006.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_007Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5852, 0.9172, 0.9708) });
  const Cube_007 = new THREE.Mesh(Cube_007Geometry, Cube_007Material);
  Cube_007.position.set(0.0, 2.531, 18.9723);
  Cube_007.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_008Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2887, 0.093, 0.7635) });
  const Cube_008 = new THREE.Mesh(Cube_008Geometry, Cube_008Material);
  Cube_008.position.set(0.0, 2.0138, 18.4551);
  Cube_008.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_009Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9595, 0.8237, 0.2657) });
  const Cube_009 = new THREE.Mesh(Cube_009Geometry, Cube_009Material);
  Cube_009.position.set(0.0, 1.4966, 17.9379);
  Cube_009.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_010Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0607, 0.7391, 0.9445) });
  const Cube_010 = new THREE.Mesh(Cube_010Geometry, Cube_010Material);
  Cube_010.position.set(0.0, 0.9795, 17.4208);
  Cube_010.scale.set(13.0782, 0.2586, 0.2586);

  const Cube_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_011Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1868, 0.3576, 0.1565) });
  const Cube_011 = new THREE.Mesh(Cube_011Geometry, Cube_011Material);
  Cube_011.position.set(0.0, 0.4623, 16.9036);
  Cube_011.scale.set(13.0782, 0.2586, 0.2586);

  const CylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
  const CylinderMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
  Cylinder.position.set(9.6401, 4.7315, 10.7761);
  Cylinder.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_001Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_001Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_001 = new THREE.Mesh(Cylinder_001Geometry, Cylinder_001Material);
  Cylinder_001.position.set(9.6401, 4.7315, 4.8604);
  Cylinder_001.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_002Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_002Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_002 = new THREE.Mesh(Cylinder_002Geometry, Cylinder_002Material);
  Cylinder_002.position.set(9.6401, 4.7315, -1.241);
  Cylinder_002.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_003Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_003Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_003 = new THREE.Mesh(Cylinder_003Geometry, Cylinder_003Material);
  Cylinder_003.position.set(9.6401, 4.7315, -7.721);
  Cylinder_003.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_004Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_004Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_004 = new THREE.Mesh(Cylinder_004Geometry, Cylinder_004Material);
  Cylinder_004.position.set(9.6401, 4.7315, -14.1167);
  Cylinder_004.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_005Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_005Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_005 = new THREE.Mesh(Cylinder_005Geometry, Cylinder_005Material);
  Cylinder_005.position.set(-9.0997, 4.7315, 10.7761);
  Cylinder_005.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_006Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_006Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_006 = new THREE.Mesh(Cylinder_006Geometry, Cylinder_006Material);
  Cylinder_006.position.set(-9.0997, 4.7315, 4.8604);
  Cylinder_006.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_007Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_007Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_007 = new THREE.Mesh(Cylinder_007Geometry, Cylinder_007Material);
  Cylinder_007.position.set(-9.0997, 4.7315, -1.241);
  Cylinder_007.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_008Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_008Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_008 = new THREE.Mesh(Cylinder_008Geometry, Cylinder_008Material);
  Cylinder_008.position.set(-9.0997, 4.7315, -7.721);
  Cylinder_008.scale.set(1.0, 4.8045, 1.0);

  const Cylinder_009Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_009Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cylinder_009 = new THREE.Mesh(Cylinder_009Geometry, Cylinder_009Material);
  Cylinder_009.position.set(-9.0997, 4.7315, -14.1167);
  Cylinder_009.scale.set(1.0, 4.8045, 1.0);

  const Cube_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_012Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3267, 0.7858, 0.6882) });
  const Cube_012 = new THREE.Mesh(Cube_012Geometry, Cube_012Material);
  Cube_012.position.set(0.0, -2.0071, -0.0);
  Cube_012.scale.set(19.5184, 0.2679, 21.8795);

  const Cube_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_013Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3799, 0.516, 0.9824) });
  const Cube_013 = new THREE.Mesh(Cube_013Geometry, Cube_013Material);
  Cube_013.position.set(19.2477, 0.8518, -0.0);
  Cube_013.scale.set(0.4091, 3.2368, 21.9766);

  const Cube_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_014Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6376, 0.5303, 0.4743) });
  const Cube_014 = new THREE.Mesh(Cube_014Geometry, Cube_014Material);
  Cube_014.position.set(-19.3779, 0.8518, -0.0);
  Cube_014.scale.set(0.4091, 3.2368, 21.9766);

  const Cube_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_015Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5914, 0.6163, 0.1711) });
  const Cube_015 = new THREE.Mesh(Cube_015Geometry, Cube_015Material);
  Cube_015.position.set(14.1863, -1.58, -0.0);
  Cube_015.scale.set(0.0939, -0.2266, 21.8873);

  const Cube_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_016Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3392, 0.0894, 0.3583) });
  const Cube_016 = new THREE.Mesh(Cube_016Geometry, Cube_016Material);
  Cube_016.position.set(18.0331, -1.58, -0.0);
  Cube_016.scale.set(0.0939, -0.2266, 21.8873);

  const Cube_144Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_144Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.403, 0.1785, 0.4526) });
  const Cube_144 = new THREE.Mesh(Cube_144Geometry, Cube_144Material);
  Cube_144.position.set(-17.8714, -1.58, -0.0);
  Cube_144.scale.set(0.0939, -0.2266, 21.8873);

  const Cube_145Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_145Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2715, 0.0708, 0.3106) });
  const Cube_145 = new THREE.Mesh(Cube_145Geometry, Cube_145Material);
  Cube_145.position.set(-14.0246, -1.58, -0.0);
  Cube_145.scale.set(0.0939, -0.2266, 21.8873);

  const out = new THREE.Group();
  out.add(
    Cube,
    Cube_001,
    Cube_002,
    Cube_003,
    Cube_004,
    Cube_005,
    Cube_006,
    Cube_007,
    Cube_008,
    Cube_009,
    Cube_010,
    Cube_011,
    Cylinder,
    Cylinder_001,
    Cylinder_002,
    Cylinder_003,
    Cylinder_004,
    Cylinder_005,
    Cylinder_006,
    Cylinder_007,
    Cylinder_008,
    Cylinder_009,
    Cube_012,
    Cube_013,
    Cube_014,
    Cube_015,
    Cube_016,
    Cube_144,
    Cube_145,
  );
  return out;
}

function createVagon() {
  const Cube_021Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_021Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cube_021 = new THREE.Mesh(Cube_021Geometry, Cube_021Material);
  Cube_021.scale.set(2.9555, 0.1578, 13.9988);

  const Cube_022Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_022Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cube_022 = new THREE.Mesh(Cube_022Geometry, Cube_022Material);
  Cube_022.position.set(-2.9952, 0.2552, -0.0);
  Cube_022.scale.set(0.071, 0.2857, 14.0054);
  Cube_022.rotation.set(0.0, 0.0, 0.3763);

  const Cube_023Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_023Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_023 = new THREE.Mesh(Cube_023Geometry, Cube_023Material);
  Cube_023.position.set(-3.0975, 0.723, -0.0);
  Cube_023.scale.set(0.071, 0.2857, 14.0054);
  Cube_023.rotation.set(0.0, 0.0, 0.0146);

  const Cube_024Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_024Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_024 = new THREE.Mesh(Cube_024Geometry, Cube_024Material);
  Cube_024.position.set(-3.0975, 3.1828, -11.9936);
  Cube_024.scale.set(0.0711, 2.2298, 1.9943);
  Cube_024.rotation.set(0.0, 0.0, -0.0152);

  const Cube_025Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_025Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_025 = new THREE.Mesh(Cube_025Geometry, Cube_025Material);
  Cube_025.position.set(-3.0975, 3.1828, -3.8948);
  Cube_025.scale.set(0.0711, 2.2298, 1.9943);
  Cube_025.rotation.set(0.0, 0.0, -0.0152);

  const Cube_026Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_026Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_026 = new THREE.Mesh(Cube_026Geometry, Cube_026Material);
  Cube_026.position.set(-3.0975, 3.1828, 4.0701);
  Cube_026.scale.set(0.0711, 2.2298, 1.9943);
  Cube_026.rotation.set(0.0, 0.0, -0.0152);

  const Cube_027Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_027Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_027 = new THREE.Mesh(Cube_027Geometry, Cube_027Material);
  Cube_027.position.set(-3.0975, 3.1828, 11.9974);
  Cube_027.scale.set(0.0711, 2.2298, 1.9943);
  Cube_027.rotation.set(0.0, 0.0, -0.0152);

  const Cube_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_028Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_028 = new THREE.Mesh(Cube_028Geometry, Cube_028Material);
  Cube_028.position.set(-2.9597, 6.1332, 0.0);
  Cube_028.scale.set(0.071, 0.2857, 14.0054);
  Cube_028.rotation.set(3.1416, 0.0, -0.3763);

  const Cube_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_029Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_029 = new THREE.Mesh(Cube_029Geometry, Cube_029Material);
  Cube_029.position.set(-3.0621, 5.6653, -0.0);
  Cube_029.scale.set(0.071, 0.2857, 14.0054);
  Cube_029.rotation.set(3.1416, 0.0, -0.0146);

  const Cube_030Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_030Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cube_030 = new THREE.Mesh(Cube_030Geometry, Cube_030Material);
  Cube_030.position.set(0.0, 6.2979, -0.0);
  Cube_030.scale.set(2.9555, 0.1578, 13.9988);

  const Cube_DoorR_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_001Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_001 = new THREE.Mesh(Cube_DoorR_001Geometry, Cube_DoorR_001Material);
  Cube_DoorR_001.position.set(-3.0975, 3.1828, -6.8599);
  Cube_DoorR_001.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_001.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_001Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_001 = new THREE.Mesh(Cube_DoorL_001Geometry, Cube_DoorL_001Material);
  Cube_DoorL_001.position.set(-3.0975, 3.1828, -9.0148);
  Cube_DoorL_001.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_001.rotation.set(0.0, 0.0, -0.0152);

  const Cube_037Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_037Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0017, 0.0, 0.1424) });
  const Cube_037 = new THREE.Mesh(Cube_037Geometry, Cube_037Material);
  Cube_037.position.set(2.9289, 0.2588, -0.0);
  Cube_037.scale.set(-0.071, 0.2857, 14.0054);
  Cube_037.rotation.set(0.0, 0.0, -0.4054);

  const Cube_038Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_038Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_038 = new THREE.Mesh(Cube_038Geometry, Cube_038Material);
  Cube_038.position.set(3.0449, 0.7235, -0.0);
  Cube_038.scale.set(-0.071, 0.2857, 14.0054);
  Cube_038.rotation.set(0.0, 0.0, -0.0438);

  const Cube_039Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_039Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_039 = new THREE.Mesh(Cube_039Geometry, Cube_039Material);
  Cube_039.position.set(3.1166, 3.1822, -11.9936);
  Cube_039.scale.set(-0.0711, 2.2298, 1.9943);
  Cube_039.rotation.set(0.0, 0.0, -0.0139);

  const Cube_040Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_040Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_040 = new THREE.Mesh(Cube_040Geometry, Cube_040Material);
  Cube_040.position.set(3.1166, 3.1822, -3.8948);
  Cube_040.scale.set(-0.0711, 2.2298, 1.9943);
  Cube_040.rotation.set(0.0, 0.0, -0.0139);

  const Cube_041Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_041Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_041 = new THREE.Mesh(Cube_041Geometry, Cube_041Material);
  Cube_041.position.set(3.1166, 3.1822, 4.0701);
  Cube_041.scale.set(-0.0711, 2.2298, 1.9943);
  Cube_041.rotation.set(0.0, 0.0, -0.0139);

  const Cube_042Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_042Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_042 = new THREE.Mesh(Cube_042Geometry, Cube_042Material);
  Cube_042.position.set(3.1166, 3.1822, 11.9974);
  Cube_042.scale.set(-0.0711, 2.2298, 1.9943);
  Cube_042.rotation.set(0.0, 0.0, -0.0139);

  const Cube_043Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_043Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.1096, 0.8) });
  const Cube_043 = new THREE.Mesh(Cube_043Geometry, Cube_043Material);
  Cube_043.position.set(3.0649, 6.1353, 0.0);
  Cube_043.scale.set(-0.071, 0.2857, 14.0054);
  Cube_043.rotation.set(3.1416, -0.0, 0.3471);

  const Cube_044Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_044Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_044 = new THREE.Mesh(Cube_044Geometry, Cube_044Material);
  Cube_044.position.set(3.1536, 5.6647, -0.0);
  Cube_044.scale.set(-0.071, 0.2857, 14.0054);
  Cube_044.rotation.set(3.1416, 0.0, -0.0146);

  const Cube_051Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_051Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_051 = new THREE.Mesh(Cube_051Geometry, Cube_051Material);
  Cube_051.position.set(-2.0084, 3.1661, 14.0187);
  Cube_051.scale.set(0.8761, 3.2221, -0.0753);

  const Cube_052Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_052Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_052 = new THREE.Mesh(Cube_052Geometry, Cube_052Material);
  Cube_052.position.set(2.0146, 3.1661, 14.0187);
  Cube_052.scale.set(0.8761, 3.2221, -0.0753);

  const Cube_053Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_053Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_053 = new THREE.Mesh(Cube_053Geometry, Cube_053Material);
  Cube_053.position.set(0.001, 2.2494, 14.0187);
  Cube_053.scale.set(1.1013, 2.2826, -0.0753);

  const Cube_054Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_054Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_054 = new THREE.Mesh(Cube_054Geometry, Cube_054Material);
  Cube_054.position.set(0.001, 5.4721, 14.0187);
  Cube_054.scale.set(1.1013, 0.908, -0.0753);

  const Cube_055Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_055Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8192, 0.6883, 0.5781) });
  const Cube_055 = new THREE.Mesh(Cube_055Geometry, Cube_055Material);
  Cube_055.position.set(-2.9808, 3.185, 14.0187);
  Cube_055.scale.set(0.0806, 2.8642, -0.0753);

  const Cube_056Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_056Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9774, 0.5942, 0.1214) });
  const Cube_056 = new THREE.Mesh(Cube_056Geometry, Cube_056Material);
  Cube_056.position.set(3.0015, 3.2323, 14.0187);
  Cube_056.scale.set(0.0806, 2.8642, -0.0753);

  const Cube_057Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_057Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_057 = new THREE.Mesh(Cube_057Geometry, Cube_057Material);
  Cube_057.position.set(-2.0084, 3.1661, -14.0155);
  Cube_057.scale.set(0.8761, 3.2221, -0.0753);

  const Cube_058Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_058Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_058 = new THREE.Mesh(Cube_058Geometry, Cube_058Material);
  Cube_058.position.set(2.0146, 3.1661, -14.0155);
  Cube_058.scale.set(0.8761, 3.2221, -0.0753);

  const Cube_059Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_059Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cube_059 = new THREE.Mesh(Cube_059Geometry, Cube_059Material);
  Cube_059.position.set(0.001, 2.2494, -14.0155);
  Cube_059.scale.set(1.1013, 2.2826, -0.0753);

  const Cube_060Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_060Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.791, 0.3479) });
  const Cube_060 = new THREE.Mesh(Cube_060Geometry, Cube_060Material);
  Cube_060.position.set(0.001, 5.4721, -14.0155);
  Cube_060.scale.set(1.1013, 0.908, -0.0753);

  const Cube_061Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_061Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.0, 0.0) });
  const Cube_061 = new THREE.Mesh(Cube_061Geometry, Cube_061Material);
  Cube_061.position.set(0.0, -0.383, -0.0);
  Cube_061.scale.set(2.8522, 0.3649, 13.8713);

  const Cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_022Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_022 = new THREE.Mesh(Cylinder_022Geometry, Cylinder_022Material);
  Cylinder_022.position.set(-1.8958, -1.4429, -11.4735);
  Cylinder_022.scale.set(1.0, 0.1531, 1.0);
  Cylinder_022.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_023Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_023Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_023 = new THREE.Mesh(Cylinder_023Geometry, Cylinder_023Material);
  Cylinder_023.position.set(-2.0767, -1.4429, -11.4735);
  Cylinder_023.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_023.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_026Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_026Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_026 = new THREE.Mesh(Cylinder_026Geometry, Cylinder_026Material);
  Cylinder_026.position.set(-1.8958, -1.4429, -9.3935);
  Cylinder_026.scale.set(1.0, 0.1531, 1.0);
  Cylinder_026.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_027Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_027Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_027 = new THREE.Mesh(Cylinder_027Geometry, Cylinder_027Material);
  Cylinder_027.position.set(-1.8958, -1.4429, -7.3135);
  Cylinder_027.scale.set(1.0, 0.1531, 1.0);
  Cylinder_027.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_028Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_028Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_028 = new THREE.Mesh(Cylinder_028Geometry, Cylinder_028Material);
  Cylinder_028.position.set(-1.8958, -1.4429, -2.1719);
  Cylinder_028.scale.set(1.0, 0.1531, 1.0);
  Cylinder_028.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_029Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_029Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_029 = new THREE.Mesh(Cylinder_029Geometry, Cylinder_029Material);
  Cylinder_029.position.set(-1.8958, -1.4429, -0.0919);
  Cylinder_029.scale.set(1.0, 0.1531, 1.0);
  Cylinder_029.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_030Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_030Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_030 = new THREE.Mesh(Cylinder_030Geometry, Cylinder_030Material);
  Cylinder_030.position.set(-1.8958, -1.4429, 1.9881);
  Cylinder_030.scale.set(1.0, 0.1531, 1.0);
  Cylinder_030.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_031Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_031Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_031 = new THREE.Mesh(Cylinder_031Geometry, Cylinder_031Material);
  Cylinder_031.position.set(-1.8958, -1.4429, 7.1297);
  Cylinder_031.scale.set(1.0, 0.1531, 1.0);
  Cylinder_031.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_032Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_032Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_032 = new THREE.Mesh(Cylinder_032Geometry, Cylinder_032Material);
  Cylinder_032.position.set(-1.8958, -1.4429, 9.2097);
  Cylinder_032.scale.set(1.0, 0.1531, 1.0);
  Cylinder_032.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_033Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_033Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_033 = new THREE.Mesh(Cylinder_033Geometry, Cylinder_033Material);
  Cylinder_033.position.set(-1.8958, -1.4429, 11.2897);
  Cylinder_033.scale.set(1.0, 0.1531, 1.0);
  Cylinder_033.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_034Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_034Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_034 = new THREE.Mesh(Cylinder_034Geometry, Cylinder_034Material);
  Cylinder_034.position.set(2.3086, -1.4429, 11.2897);
  Cylinder_034.scale.set(1.0, 0.1531, 1.0);
  Cylinder_034.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_035Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_035Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_035 = new THREE.Mesh(Cylinder_035Geometry, Cylinder_035Material);
  Cylinder_035.position.set(2.3086, -1.4429, 9.2097);
  Cylinder_035.scale.set(1.0, 0.1531, 1.0);
  Cylinder_035.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_036Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_036Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_036 = new THREE.Mesh(Cylinder_036Geometry, Cylinder_036Material);
  Cylinder_036.position.set(2.3086, -1.4429, 7.1297);
  Cylinder_036.scale.set(1.0, 0.1531, 1.0);
  Cylinder_036.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_037Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_037Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_037 = new THREE.Mesh(Cylinder_037Geometry, Cylinder_037Material);
  Cylinder_037.position.set(2.3086, -1.4429, 1.9881);
  Cylinder_037.scale.set(1.0, 0.1531, 1.0);
  Cylinder_037.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_038Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_038Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_038 = new THREE.Mesh(Cylinder_038Geometry, Cylinder_038Material);
  Cylinder_038.position.set(2.3086, -1.4429, -0.0919);
  Cylinder_038.scale.set(1.0, 0.1531, 1.0);
  Cylinder_038.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_039Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_039Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_039 = new THREE.Mesh(Cylinder_039Geometry, Cylinder_039Material);
  Cylinder_039.position.set(2.3086, -1.4429, -2.1719);
  Cylinder_039.scale.set(1.0, 0.1531, 1.0);
  Cylinder_039.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_040Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_040Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_040 = new THREE.Mesh(Cylinder_040Geometry, Cylinder_040Material);
  Cylinder_040.position.set(2.3086, -1.4429, -7.3135);
  Cylinder_040.scale.set(1.0, 0.1531, 1.0);
  Cylinder_040.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_041Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_041Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_041 = new THREE.Mesh(Cylinder_041Geometry, Cylinder_041Material);
  Cylinder_041.position.set(2.3086, -1.4429, -9.3935);
  Cylinder_041.scale.set(1.0, 0.1531, 1.0);
  Cylinder_041.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_042Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_042Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_042 = new THREE.Mesh(Cylinder_042Geometry, Cylinder_042Material);
  Cylinder_042.position.set(2.3086, -1.4429, -11.4735);
  Cylinder_042.scale.set(1.0, 0.1531, 1.0);
  Cylinder_042.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_043Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_043Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_043 = new THREE.Mesh(Cylinder_043Geometry, Cylinder_043Material);
  Cylinder_043.position.set(-2.0767, -1.4429, -9.4038);
  Cylinder_043.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_043.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_044Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_044Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_044 = new THREE.Mesh(Cylinder_044Geometry, Cylinder_044Material);
  Cylinder_044.position.set(-2.0767, -1.4429, -7.3341);
  Cylinder_044.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_044.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_045Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_045Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_045 = new THREE.Mesh(Cylinder_045Geometry, Cylinder_045Material);
  Cylinder_045.position.set(-2.0767, -1.4429, -2.1946);
  Cylinder_045.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_045.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_046Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_046Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_046 = new THREE.Mesh(Cylinder_046Geometry, Cylinder_046Material);
  Cylinder_046.position.set(-2.0767, -1.4429, -0.1249);
  Cylinder_046.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_046.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_047Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_047Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_047 = new THREE.Mesh(Cylinder_047Geometry, Cylinder_047Material);
  Cylinder_047.position.set(-2.0767, -1.4429, 1.9448);
  Cylinder_047.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_047.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_048Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_048Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_048 = new THREE.Mesh(Cylinder_048Geometry, Cylinder_048Material);
  Cylinder_048.position.set(-2.0767, -1.4429, 7.0843);
  Cylinder_048.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_048.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_049Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_049Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_049 = new THREE.Mesh(Cylinder_049Geometry, Cylinder_049Material);
  Cylinder_049.position.set(-2.0767, -1.4429, 9.154);
  Cylinder_049.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_049.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_050Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_050Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_050 = new THREE.Mesh(Cylinder_050Geometry, Cylinder_050Material);
  Cylinder_050.position.set(-2.0767, -1.4429, 11.2236);
  Cylinder_050.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_050.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_051Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_051Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_051 = new THREE.Mesh(Cylinder_051Geometry, Cylinder_051Material);
  Cylinder_051.position.set(2.4949, -1.4429, 11.2236);
  Cylinder_051.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_051.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_052Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_052Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_052 = new THREE.Mesh(Cylinder_052Geometry, Cylinder_052Material);
  Cylinder_052.position.set(2.4949, -1.4429, 9.154);
  Cylinder_052.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_052.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_053Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_053Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_053 = new THREE.Mesh(Cylinder_053Geometry, Cylinder_053Material);
  Cylinder_053.position.set(2.4949, -1.4429, 7.0843);
  Cylinder_053.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_053.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_054Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_054Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_054 = new THREE.Mesh(Cylinder_054Geometry, Cylinder_054Material);
  Cylinder_054.position.set(2.4949, -1.4429, 1.9448);
  Cylinder_054.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_054.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_055Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_055Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_055 = new THREE.Mesh(Cylinder_055Geometry, Cylinder_055Material);
  Cylinder_055.position.set(2.4949, -1.4429, -0.1249);
  Cylinder_055.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_055.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_056Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_056Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_056 = new THREE.Mesh(Cylinder_056Geometry, Cylinder_056Material);
  Cylinder_056.position.set(2.4949, -1.4429, -2.1946);
  Cylinder_056.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_056.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_057Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_057Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_057 = new THREE.Mesh(Cylinder_057Geometry, Cylinder_057Material);
  Cylinder_057.position.set(2.4949, -1.4429, -7.3341);
  Cylinder_057.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_057.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_058Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_058Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_058 = new THREE.Mesh(Cylinder_058Geometry, Cylinder_058Material);
  Cylinder_058.position.set(2.4949, -1.4429, -9.4038);
  Cylinder_058.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_058.rotation.set(0.0, 0.0, -1.5708);

  const Cylinder_059Geometry = new THREE.CylinderGeometry(1, 1, 2);
  const Cylinder_059Material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 1.0, 1.0) });
  const Cylinder_059 = new THREE.Mesh(Cylinder_059Geometry, Cylinder_059Material);
  Cylinder_059.position.set(2.4949, -1.4429, -11.4735);
  Cylinder_059.scale.set(0.8482, 0.1299, 0.8482);
  Cylinder_059.rotation.set(0.0, 0.0, -1.5708);

  const Cube_DoorR_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_002Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_002 = new THREE.Mesh(Cube_DoorR_002Geometry, Cube_DoorR_002Material);
  Cube_DoorR_002.position.set(-3.0975, 3.1828, 1.1619);
  Cube_DoorR_002.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_002.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_002Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_002 = new THREE.Mesh(Cube_DoorL_002Geometry, Cube_DoorL_002Material);
  Cube_DoorL_002.position.set(-3.0975, 3.1828, -0.993);
  Cube_DoorL_002.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_002.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorR_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_003Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_003 = new THREE.Mesh(Cube_DoorR_003Geometry, Cube_DoorR_003Material);
  Cube_DoorR_003.position.set(-3.0975, 3.1828, 9.1283);
  Cube_DoorR_003.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_003.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_003Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_003 = new THREE.Mesh(Cube_DoorL_003Geometry, Cube_DoorL_003Material);
  Cube_DoorL_003.position.set(-3.0975, 3.1828, 6.9734);
  Cube_DoorL_003.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_003.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorR_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_004Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_004 = new THREE.Mesh(Cube_DoorR_004Geometry, Cube_DoorR_004Material);
  Cube_DoorR_004.position.set(3.0795, 3.1828, -6.8599);
  Cube_DoorR_004.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_004.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_004Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_004 = new THREE.Mesh(Cube_DoorL_004Geometry, Cube_DoorL_004Material);
  Cube_DoorL_004.position.set(3.0795, 3.1828, -9.0148);
  Cube_DoorL_004.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_004.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorR_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_005Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_005 = new THREE.Mesh(Cube_DoorR_005Geometry, Cube_DoorR_005Material);
  Cube_DoorR_005.position.set(3.0795, 3.1828, 1.1619);
  Cube_DoorR_005.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_005.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_005Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_005 = new THREE.Mesh(Cube_DoorL_005Geometry, Cube_DoorL_005Material);
  Cube_DoorL_005.position.set(3.0795, 3.1828, -0.993);
  Cube_DoorL_005.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_005.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorR_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorR_006Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorR_006 = new THREE.Mesh(Cube_DoorR_006Geometry, Cube_DoorR_006Material);
  Cube_DoorR_006.position.set(3.0795, 3.1828, 9.1283);
  Cube_DoorR_006.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorR_006.rotation.set(0.0, 0.0, -0.0152);

  const Cube_DoorL_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Cube_DoorL_006Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.0202, 0.1172, 0.686),
    transparent: true,
    opacity: 0.8031,
  });
  const Cube_DoorL_006 = new THREE.Mesh(Cube_DoorL_006Geometry, Cube_DoorL_006Material);
  Cube_DoorL_006.position.set(3.0795, 3.1828, 6.9734);
  Cube_DoorL_006.scale.set(0.0363, 2.2296, 1.0634);
  Cube_DoorL_006.rotation.set(0.0, 0.0, -0.0152);

  const out = new THREE.Group();
  out.add(
    Cube_021,
    Cube_022,
    Cube_023,
    Cube_024,
    Cube_025,
    Cube_026,
    Cube_027,
    Cube_028,
    Cube_029,
    Cube_030,
    Cube_DoorR_001,
    Cube_DoorL_001,
    Cube_037,
    Cube_038,
    Cube_039,
    Cube_040,
    Cube_041,
    Cube_042,
    Cube_043,
    Cube_044,
    Cube_051,
    Cube_052,
    Cube_053,
    Cube_054,
    Cube_055,
    Cube_056,
    Cube_057,
    Cube_058,
    Cube_059,
    Cube_060,
    Cube_061,
    Cylinder_022,
    Cylinder_023,
    Cylinder_026,
    Cylinder_027,
    Cylinder_028,
    Cylinder_029,
    Cylinder_030,
    Cylinder_031,
    Cylinder_032,
    Cylinder_033,
    Cylinder_034,
    Cylinder_035,
    Cylinder_036,
    Cylinder_037,
    Cylinder_038,
    Cylinder_039,
    Cylinder_040,
    Cylinder_041,
    Cylinder_042,
    Cylinder_043,
    Cylinder_044,
    Cylinder_045,
    Cylinder_046,
    Cylinder_047,
    Cylinder_048,
    Cylinder_049,
    Cylinder_050,
    Cylinder_051,
    Cylinder_052,
    Cylinder_053,
    Cylinder_054,
    Cylinder_055,
    Cylinder_056,
    Cylinder_057,
    Cylinder_058,
    Cylinder_059,
    Cube_DoorR_002,
    Cube_DoorL_002,
    Cube_DoorR_003,
    Cube_DoorL_003,
    Cube_DoorR_004,
    Cube_DoorL_004,
    Cube_DoorR_005,
    Cube_DoorL_005,
    Cube_DoorR_006,
    Cube_DoorL_006,
  );

  const doors: typeof animatables.doors = [
    { left: Cube_DoorL_001, right: Cube_DoorR_001, state: false, transition: 0 },
    { left: Cube_DoorL_002, right: Cube_DoorR_002, state: false, transition: 0 },
    { left: Cube_DoorL_003, right: Cube_DoorR_003, state: false, transition: 0 },
  ];

  animatables.doors = doors;
  return out;
}

function CreateScene(WC: number, HC: number) {
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

/*
    {{html
    <!DOCTYPE html>
    <head>
     <script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
     <script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
    </head>
    html}}
  */
