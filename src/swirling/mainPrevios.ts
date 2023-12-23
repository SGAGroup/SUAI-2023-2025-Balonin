//#region
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
THREE.Object3D.prototype.applyMatrix = THREE.Object3D.prototype.applyMatrix4;
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
//#endregion
//#region
function CreateTestCube() {
  //#endregion

  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const BrassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7948, 0.7991, 0.0045),
    metalness: 0.9127,
    roughness: 0.1,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
    metalness: 1.0,
    emissive: new THREE.Color(1.0, 1.0, 1.0),
  });
  const RoofTiles_1Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.814, 0.814, 0.814),
  });
  const ColoumnPlateMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3672, 0.2714, 0.1523),
    roughness: 0.5,
  });
  const Floor_ColumnsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2396, 0.197, 0.134),
    metalness: 0.123,
    roughness: 0.1508,
  });
  const Floor_CentralMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.3902, 0.2623),
    metalness: 0.123,
    roughness: 0.1508,
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1467, 0.2457, 0.8),
    roughness: 0.5,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const Green_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0351, 0.4869, 0.0138),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.0213, 0.0026),
    metalness: 0.8254,
    roughness: 0.8849,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.5225, 0.0),
  });
  const Floor_Sides_1Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3343, 0.2742, 0.1854),
    metalness: 0.123,
    roughness: 0.3333,
  });
  const FloorTileMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.686, 0.6165, 0.3163),
    roughness: 0.5,
  });

  const cube_imageGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_image = new THREE.Mesh(cube_imageGeometry, ColoumnMaterial);
  cube_image.position.set(-31.329, 5.5248, -0.0053);
  cube_image.scale.set(0.18, 3.8564, 3.3873);

  const cube_borderGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_border = new THREE.Mesh(cube_borderGeometry, BrassMaterial);
  cube_border.position.set(-31.329, 6.267, 3.5536);
  cube_border.scale.set(0.2035, 5.141, 0.2341);

  const cube_border_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_border_001 = new THREE.Mesh(
    cube_border_001Geometry,
    BrassMaterial,
  );
  cube_border_001.position.set(-31.329, 6.267, -3.667);
  cube_border_001.scale.set(0.2035, 5.141, 0.2341);

  const cube_border_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_border_002 = new THREE.Mesh(
    cube_border_002Geometry,
    BrassMaterial,
  );
  cube_border_002.position.set(-31.3395, 1.3972, -0.005);
  cube_border_002.scale.set(0.2035, 3.6351, 0.2712);
  cube_border_002.setRotation(1.5708, 0.0, 0.0);

  const cube_smallroof_tileGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tileGroup = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile = new THREE.Mesh(
      cube_smallroof_tileGeometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile.scale.set(1.9374, -0.1342, 0.6357);
    cube_smallroof_tile.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tileGroup.add(cube_smallroof_tile);
  }
  cube_smallroof_tileGroup.setRotation(3.0771, 0.0, -0.0);
  cube_smallroof_tileGroup.position.set(-29.7716, 9.7462, -0.6276);
  const cube_smallroof_tile_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_005Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_005 = new THREE.Mesh(
      cube_smallroof_tile_005Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_005.scale.set(1.9374, -0.1342, 0.6357);
    cube_smallroof_tile_005.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_005Group.add(cube_smallroof_tile_005);
  }
  cube_smallroof_tile_005Group.setRotation(2.968, 0.0, -0.0);
  cube_smallroof_tile_005Group.position.set(-29.7716, 9.5972, -1.8736);
  const cube_smallroof_tile_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_004Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_004 = new THREE.Mesh(
      cube_smallroof_tile_004Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_004.scale.set(1.9374, -0.1342, 0.579);
    cube_smallroof_tile_004.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_004Group.add(cube_smallroof_tile_004);
  }
  cube_smallroof_tile_004Group.setRotation(2.8706, 0.0, -0.0);
  cube_smallroof_tile_004Group.position.set(-29.7716, 9.3407, -3.0144);
  const cube_smallroof_tile_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_003Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_003 = new THREE.Mesh(
      cube_smallroof_tile_003Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_003.scale.set(1.9374, -0.1342, 0.5332);
    cube_smallroof_tile_003.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_003Group.add(cube_smallroof_tile_003);
  }
  cube_smallroof_tile_003Group.setRotation(2.7329, 0.0, -0.0);
  cube_smallroof_tile_003Group.position.set(-29.7716, 8.9771, -4.0545);
  const cube_smallroof_tile_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_002Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_002 = new THREE.Mesh(
      cube_smallroof_tile_002Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_002.scale.set(1.9374, -0.1342, 0.5332);
    cube_smallroof_tile_002.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_002Group.add(cube_smallroof_tile_002);
  }
  cube_smallroof_tile_002Group.setRotation(2.4437, 0.0, -0.0);
  cube_smallroof_tile_002Group.position.set(-29.7716, 8.4392, -4.9277);
  const cube_smallroof_tile_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_001Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_001 = new THREE.Mesh(
      cube_smallroof_tile_001Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_001.scale.set(1.9374, -0.1342, 0.6071);
    cube_smallroof_tile_001.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_001Group.add(cube_smallroof_tile_001);
  }
  cube_smallroof_tile_001Group.setRotation(2.1312, 0.0, -0.0);
  cube_smallroof_tile_001Group.position.set(-29.7716, 7.6197, -5.6245);
  const cube_smallroof_tile_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_006Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_006 = new THREE.Mesh(
      cube_smallroof_tile_006Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_006.scale.set(0.1278, -0.1342, 0.6357);
    cube_smallroof_tile_006.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_006Group.add(cube_smallroof_tile_006);
  }
  cube_smallroof_tile_006Group.setRotation(3.0771, 0.0, -0.0);
  cube_smallroof_tile_006Group.position.set(-27.7592, 9.6666, -0.6276);
  const cube_smallroof_tile_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_007Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_007 = new THREE.Mesh(
      cube_smallroof_tile_007Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_007.scale.set(0.1278, -0.1342, 0.6357);
    cube_smallroof_tile_007.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_007Group.add(cube_smallroof_tile_007);
  }
  cube_smallroof_tile_007Group.setRotation(2.968, 0.0, -0.0);
  cube_smallroof_tile_007Group.position.set(-27.7592, 9.5176, -1.8736);
  const cube_smallroof_tile_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_008Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_008 = new THREE.Mesh(
      cube_smallroof_tile_008Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_008.scale.set(0.1278, -0.1342, 0.579);
    cube_smallroof_tile_008.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_008Group.add(cube_smallroof_tile_008);
  }
  cube_smallroof_tile_008Group.setRotation(2.8706, 0.0, -0.0);
  cube_smallroof_tile_008Group.position.set(-27.7592, 9.261, -3.0144);
  const cube_smallroof_tile_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_009Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_009 = new THREE.Mesh(
      cube_smallroof_tile_009Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_009.scale.set(0.1278, -0.1342, 0.5332);
    cube_smallroof_tile_009.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_009Group.add(cube_smallroof_tile_009);
  }
  cube_smallroof_tile_009Group.setRotation(2.7329, 0.0, -0.0);
  cube_smallroof_tile_009Group.position.set(-27.7592, 8.8974, -4.0545);
  const cube_smallroof_tile_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_010Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_010 = new THREE.Mesh(
      cube_smallroof_tile_010Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_010.scale.set(0.1278, -0.1342, 0.5332);
    cube_smallroof_tile_010.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_010Group.add(cube_smallroof_tile_010);
  }
  cube_smallroof_tile_010Group.setRotation(2.4437, 0.0, -0.0);
  cube_smallroof_tile_010Group.position.set(-27.7592, 8.3596, -4.9277);
  const cube_smallroof_tile_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_011Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_011 = new THREE.Mesh(
      cube_smallroof_tile_011Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_011.scale.set(0.1278, -0.1342, 0.6071);
    cube_smallroof_tile_011.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_011Group.add(cube_smallroof_tile_011);
  }
  cube_smallroof_tile_011Group.setRotation(2.1312, 0.0, -0.0);
  cube_smallroof_tile_011Group.position.set(-27.7592, 7.5401, -5.6245);
  const cube_smallroof_tile_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_012Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_012 = new THREE.Mesh(
      cube_smallroof_tile_012Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_012.scale.set(1.9374, -0.1342, 0.6357);
    cube_smallroof_tile_012.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_012Group.add(cube_smallroof_tile_012);
  }
  cube_smallroof_tile_012Group.setRotation(-3.0772, 0.0, -0.0);
  cube_smallroof_tile_012Group.position.set(-29.7716, 9.7482, 0.6277);
  const cube_smallroof_tile_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_013Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_013 = new THREE.Mesh(
      cube_smallroof_tile_013Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_013.scale.set(1.9374, -0.1342, 0.6357);
    cube_smallroof_tile_013.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_013Group.add(cube_smallroof_tile_013);
  }
  cube_smallroof_tile_013Group.setRotation(-2.968, 0.0, -0.0);
  cube_smallroof_tile_013Group.position.set(-29.7716, 9.6026, 1.8431);
  const cube_smallroof_tile_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_014Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_014 = new THREE.Mesh(
      cube_smallroof_tile_014Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_014.scale.set(1.9374, -0.1342, 0.579);
    cube_smallroof_tile_014.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_014Group.add(cube_smallroof_tile_014);
  }
  cube_smallroof_tile_014Group.setRotation(-2.8706, 0.0, -0.0);
  cube_smallroof_tile_014Group.position.set(-29.7716, 9.3406, 3.0144);
  const cube_smallroof_tile_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_015Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_015 = new THREE.Mesh(
      cube_smallroof_tile_015Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_015.scale.set(1.9374, -0.1342, 0.5332);
    cube_smallroof_tile_015.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_015Group.add(cube_smallroof_tile_015);
  }
  cube_smallroof_tile_015Group.setRotation(-2.7329, 0.0, -0.0);
  cube_smallroof_tile_015Group.position.set(-29.7716, 8.977, 4.0544);
  const cube_smallroof_tile_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_016Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_016 = new THREE.Mesh(
      cube_smallroof_tile_016Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_016.scale.set(1.9374, -0.1342, 0.5332);
    cube_smallroof_tile_016.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_016Group.add(cube_smallroof_tile_016);
  }
  cube_smallroof_tile_016Group.setRotation(-2.4437, 0.0, -0.0);
  cube_smallroof_tile_016Group.position.set(-29.7716, 8.4452, 4.9207);
  const cube_smallroof_tile_017Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_017Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_017 = new THREE.Mesh(
      cube_smallroof_tile_017Geometry,
      RoofTilesMaterial,
    );
    cube_smallroof_tile_017.scale.set(1.9374, -0.1342, 0.6071);
    cube_smallroof_tile_017.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_017Group.add(cube_smallroof_tile_017);
  }
  cube_smallroof_tile_017Group.setRotation(-2.1312, 0.0, -0.0);
  cube_smallroof_tile_017Group.position.set(-29.7716, 7.6197, 5.6245);
  const cube_smallroof_tile_018Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_018Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_018 = new THREE.Mesh(
      cube_smallroof_tile_018Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_018.scale.set(0.1278, -0.1342, 0.6357);
    cube_smallroof_tile_018.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_018Group.add(cube_smallroof_tile_018);
  }
  cube_smallroof_tile_018Group.setRotation(-3.0772, 0.0, -0.0);
  cube_smallroof_tile_018Group.position.set(-27.7592, 9.6682, 0.6277);
  const cube_smallroof_tile_019Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_019Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_019 = new THREE.Mesh(
      cube_smallroof_tile_019Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_019.scale.set(0.1278, -0.1342, 0.6357);
    cube_smallroof_tile_019.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_019Group.add(cube_smallroof_tile_019);
  }
  cube_smallroof_tile_019Group.setRotation(-2.968, 0.0, -0.0);
  cube_smallroof_tile_019Group.position.set(-27.7592, 9.5207, 1.8742);
  const cube_smallroof_tile_020Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_020Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_020 = new THREE.Mesh(
      cube_smallroof_tile_020Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_020.scale.set(0.1278, -0.1342, 0.579);
    cube_smallroof_tile_020.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_020Group.add(cube_smallroof_tile_020);
  }
  cube_smallroof_tile_020Group.setRotation(-2.8706, 0.0, -0.0);
  cube_smallroof_tile_020Group.position.set(-27.7592, 9.2635, 3.0151);
  const cube_smallroof_tile_021Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_021Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_021 = new THREE.Mesh(
      cube_smallroof_tile_021Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_021.scale.set(0.1278, -0.1342, 0.5332);
    cube_smallroof_tile_021.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_021Group.add(cube_smallroof_tile_021);
  }
  cube_smallroof_tile_021Group.setRotation(-2.7329, 0.0, -0.0);
  cube_smallroof_tile_021Group.position.set(-27.7592, 8.8938, 4.0628);
  const cube_smallroof_tile_022Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_022Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_022 = new THREE.Mesh(
      cube_smallroof_tile_022Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_022.scale.set(0.1278, -0.1342, 0.5332);
    cube_smallroof_tile_022.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_022Group.add(cube_smallroof_tile_022);
  }
  cube_smallroof_tile_022Group.setRotation(-2.4437, 0.0, -0.0);
  cube_smallroof_tile_022Group.position.set(-27.7592, 8.3655, 4.9207);
  const cube_smallroof_tile_023Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_023Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_023 = new THREE.Mesh(
      cube_smallroof_tile_023Geometry,
      BrassMaterial,
    );
    cube_smallroof_tile_023.scale.set(0.1278, -0.1342, 0.6071);
    cube_smallroof_tile_023.position.set(4.0321 * i, 0, 0);
    cube_smallroof_tile_023Group.add(cube_smallroof_tile_023);
  }
  cube_smallroof_tile_023Group.setRotation(-2.1312, 0.0, -0.0);
  cube_smallroof_tile_023Group.position.set(-27.7592, 7.5401, 5.6245);
  const cube_smallroof_tile_024Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_024 = new THREE.Mesh(
    cube_smallroof_tile_024Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_024.position.set(-31.4153, 9.461, -0.6276);
  cube_smallroof_tile_024.scale.set(0.2866, -0.2859, 0.6404);
  cube_smallroof_tile_024.setRotation(3.0771, 0.0, -0.0);

  const cube_smallroof_tile_025Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_025 = new THREE.Mesh(
    cube_smallroof_tile_025Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_025.position.set(-31.4153, 9.312, -1.8736);
  cube_smallroof_tile_025.scale.set(0.2866, -0.283, 0.6686);
  cube_smallroof_tile_025.setRotation(2.968, 0.0, -0.0);

  const cube_smallroof_tile_026Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_026 = new THREE.Mesh(
    cube_smallroof_tile_026Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_026.position.set(-31.4153, 9.0554, -3.0144);
  cube_smallroof_tile_026.scale.set(0.2866, -0.2783, 0.6486);
  cube_smallroof_tile_026.setRotation(2.8706, 0.0, -0.0);

  const cube_smallroof_tile_027Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_027 = new THREE.Mesh(
    cube_smallroof_tile_027Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_027.position.set(-31.4153, 9.4626, 0.6277);
  cube_smallroof_tile_027.scale.set(0.2866, -0.2859, 0.6404);
  cube_smallroof_tile_027.setRotation(-3.0772, 0.0, -0.0);

  const cube_smallroof_tile_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_028 = new THREE.Mesh(
    cube_smallroof_tile_028Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_028.position.set(-31.4153, 9.3151, 1.8742);
  cube_smallroof_tile_028.scale.set(0.2866, -0.283, 0.6686);
  cube_smallroof_tile_028.setRotation(-2.968, 0.0, -0.0);

  const cube_smallroof_tile_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_029 = new THREE.Mesh(
    cube_smallroof_tile_029Geometry,
    BrassMaterial,
  );
  cube_smallroof_tile_029.position.set(-31.4153, 9.0579, 3.0151);
  cube_smallroof_tile_029.scale.set(0.2866, -0.2783, 0.6486);
  cube_smallroof_tile_029.setRotation(-2.8706, 0.0, -0.0);

  const cube_smallroof_tile_030Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_030Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_030 = new THREE.Mesh(
      cube_smallroof_tile_030Geometry,
      RoofTiles_1Material,
    );
    cube_smallroof_tile_030.scale.set(1.9374, -0.1342, -0.102);
    cube_smallroof_tile_030.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_030Group.add(cube_smallroof_tile_030);
  }
  cube_smallroof_tile_030Group.setRotation(2.8706, 0.0, -0.0);
  cube_smallroof_tile_030Group.position.set(-29.7716, 9.3073, -3.0144);
  const cube_smallroof_tile_031Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_smallroof_tile_031Group = new THREE.Group();
  for (var i = 0; i < 21; i++) {
    const cube_smallroof_tile_031 = new THREE.Mesh(
      cube_smallroof_tile_031Geometry,
      RoofTiles_1Material,
    );
    cube_smallroof_tile_031.scale.set(1.9374, -0.1342, -0.102);
    cube_smallroof_tile_031.position.set(4.0298 * i, 0, 0);
    cube_smallroof_tile_031Group.add(cube_smallroof_tile_031);
  }
  cube_smallroof_tile_031Group.setRotation(-2.8706, 0.0, -0.0);
  cube_smallroof_tile_031Group.position.set(-29.7716, 9.3073, 3.0144);
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeGroup = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube = new THREE.Mesh(cubeGeometry, ColoumnPlateMaterial);
    cube.scale.set(1.0, 3.4789, 1.0);
    cube.position.set(6.0 * i, 0, 0);
    cubeGroup.add(cube);
  }
  cubeGroup.position.set(-30.709, 4.3331, 7.8995);
  const cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_002Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_002 = new THREE.Mesh(cube_002Geometry, ColoumnPlateMaterial);
    cube_002.scale.set(0.4453, 0.2934, 0.9985);
    cube_002.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_002Group.add(cube_002);
  }
  cube_002Group.setRotation(0.0, 0.0, 1.0669);
  cube_002Group.position.set(-29.8356, 4.92, 7.8995);
  const cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_004Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_004 = new THREE.Mesh(cube_004Geometry, ColoumnPlateMaterial);
    cube_004.scale.set(0.4453, 0.4393, 0.9985);
    cube_004.position.set(4.771 * i, -3.6355 * i, 0);
    cube_004Group.add(cube_004);
  }
  cube_004Group.setRotation(0.0, 0.0, 0.6511);
  cube_004Group.position.set(-29.3814, 5.5959, 7.8995);
  const cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_005Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_005 = new THREE.Mesh(cube_005Geometry, ColoumnPlateMaterial);
    cube_005.scale.set(0.4453, 0.2384, 0.9985);
    cube_005.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_005Group.add(cube_005);
  }
  cube_005Group.setRotation(0.0, 0.0, 0.3109);
  cube_005Group.position.set(-28.5579, 5.832, 7.8995);
  const cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_006Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_006 = new THREE.Mesh(cube_006Geometry, ColoumnPlateMaterial);
    cube_006.scale.set(0.4453, 0.1584, 0.9985);
    cube_006.position.set(5.9981 * i, 0, 0);
    cube_006Group.add(cube_006);
  }
  cube_006Group.position.set(-27.6974, 5.8917, 7.8995);
  const cube_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_007Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_007 = new THREE.Mesh(cube_007Geometry, ColoumnPlateMaterial);
    cube_007.scale.set(0.4453, 0.2934, 0.9985);
    cube_007.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_007Group.add(cube_007);
  }
  cube_007Group.setRotation(0.0, 0.0, -1.0669);
  cube_007Group.position.set(-25.5818, 4.92, 7.8995);
  const cube_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_008 = new THREE.Mesh(cube_008Geometry, ColoumnPlateMaterial);
  cube_008.position.set(-26.0135, 5.5959, 7.8995);
  cube_008.scale.set(0.4453, 0.4393, 0.9985);
  cube_008.setRotation(0.0, 0.0, -0.6511);

  const cube_009Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_009 = new THREE.Mesh(cube_009Geometry, ColoumnPlateMaterial);
  cube_009.position.set(-26.8361, 5.832, 7.8995);
  cube_009.scale.set(0.4453, 0.2384, 0.9985);
  cube_009.setRotation(0.0, 0.0, -0.3109);

  const cube_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_011Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_011 = new THREE.Mesh(cube_011Geometry, ColoumnPlateMaterial);
    cube_011.scale.set(0.4453, 0.2384, 0.9985);
    cube_011.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_011Group.add(cube_011);
  }
  cube_011Group.setRotation(0.0, 0.0, -0.3109);
  cube_011Group.position.set(-26.8361, 5.832, 7.8995);
  const cube_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_012Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_012 = new THREE.Mesh(cube_012Geometry, ColoumnPlateMaterial);
    cube_012.scale.set(0.4453, 0.4393, 0.9985);
    cube_012.position.set(4.771 * i, 3.6355 * i, 0);
    cube_012Group.add(cube_012);
  }
  cube_012Group.setRotation(0.0, 0.0, -0.6511);
  cube_012Group.position.set(-26.0135, 5.5959, 7.8995);
  const cube_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_013Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_013 = new THREE.Mesh(cube_013Geometry, Floor_ColumnsMaterial);
    cube_013.scale.set(0.4453, 0.2934, 0.6455);
    cube_013.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_013Group.add(cube_013);
  }
  cube_013Group.setRotation(0.0, 0.0, -1.0669);
  cube_013Group.position.set(-25.6364, 4.92, 7.8995);
  const cube_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_015Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube_015 = new THREE.Mesh(cube_015Geometry, Floor_ColumnsMaterial);
    cube_015.scale.set(1.05, 3.4789, 0.6455);
    cube_015.position.set(6.0 * i, 0, 0);
    cube_015Group.add(cube_015);
  }
  cube_015Group.position.set(-30.709, 4.3331, 7.8995);
  const cube_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_016Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_016 = new THREE.Mesh(cube_016Geometry, Floor_ColumnsMaterial);
    cube_016.scale.set(0.4453, 0.2934, 0.6455);
    cube_016.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_016Group.add(cube_016);
  }
  cube_016Group.setRotation(0.0, 0.0, 1.0669);
  cube_016Group.position.set(-29.777, 4.92, 7.8995);
  const cube_017Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_017Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_017 = new THREE.Mesh(cube_017Geometry, Floor_ColumnsMaterial);
    cube_017.scale.set(0.4453, 0.4393, 0.6455);
    cube_017.position.set(4.771 * i, -3.6355 * i, 0);
    cube_017Group.add(cube_017);
  }
  cube_017Group.setRotation(0.0, 0.0, 0.6511);
  cube_017Group.position.set(-29.3235, 5.5959, 7.8995);
  const cube_018Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_018Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_018 = new THREE.Mesh(cube_018Geometry, Floor_ColumnsMaterial);
    cube_018.scale.set(0.4453, 0.2384, 0.6455);
    cube_018.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_018Group.add(cube_018);
  }
  cube_018Group.setRotation(0.0, 0.0, 0.3109);
  cube_018Group.position.set(-28.4432, 5.832, 7.8995);
  const cube_019Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_019Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_019 = new THREE.Mesh(cube_019Geometry, Floor_ColumnsMaterial);
    cube_019.scale.set(0.4453, 0.1584, 0.6455);
    cube_019.position.set(5.9981 * i, 0, 0);
    cube_019Group.add(cube_019);
  }
  cube_019Group.position.set(-27.6974, 5.8583, 7.8995);
  const cube_020Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_020 = new THREE.Mesh(cube_020Geometry, ColoumnPlateMaterial);
  cube_020.position.set(-25.5818, 4.92, 7.8995);
  cube_020.scale.set(0.4453, 0.2934, 0.9985);
  cube_020.setRotation(0.0, 0.0, -1.0669);

  const cube_021Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_021Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_021 = new THREE.Mesh(cube_021Geometry, Floor_ColumnsMaterial);
    cube_021.scale.set(0.4453, 0.4393, 0.6455);
    cube_021.position.set(4.771 * i, 3.6355 * i, 0);
    cube_021Group.add(cube_021);
  }
  cube_021Group.setRotation(0.0, 0.0, -0.6511);
  cube_021Group.position.set(-26.068, 5.5959, 7.8995);
  const cube_022Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_022Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_022 = new THREE.Mesh(cube_022Geometry, Floor_ColumnsMaterial);
    cube_022.scale.set(0.4453, 0.2384, 0.6455);
    cube_022.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_022Group.add(cube_022);
  }
  cube_022Group.setRotation(0.0, 0.0, -0.3109);
  cube_022Group.position.set(-26.9447, 5.832, 7.8995);
  const cube_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_010Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube_010 = new THREE.Mesh(cube_010Geometry, ColoumnPlateMaterial);
    cube_010.scale.set(1.0, 3.4789, 1.0);
    cube_010.position.set(6.0 * i, 0, 0);
    cube_010Group.add(cube_010);
  }
  cube_010Group.position.set(-30.709, 4.3331, -7.8995);
  const cube_023Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_023Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube_023 = new THREE.Mesh(cube_023Geometry, Floor_ColumnsMaterial);
    cube_023.scale.set(1.05, 3.4789, 0.6455);
    cube_023.position.set(6.0 * i, 0, 0);
    cube_023Group.add(cube_023);
  }
  cube_023Group.position.set(-30.709, 4.3331, -7.8995);
  const cube_024Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_024Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_024 = new THREE.Mesh(cube_024Geometry, ColoumnPlateMaterial);
    cube_024.scale.set(0.4453, 0.2934, 0.9985);
    cube_024.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_024Group.add(cube_024);
  }
  cube_024Group.setRotation(0.0, 0.0, 1.0669);
  cube_024Group.position.set(-29.8356, 4.92, -7.901);
  const cube_025Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_025Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_025 = new THREE.Mesh(cube_025Geometry, ColoumnPlateMaterial);
    cube_025.scale.set(0.4453, 0.4393, 0.9985);
    cube_025.position.set(4.771 * i, -3.6355 * i, 0);
    cube_025Group.add(cube_025);
  }
  cube_025Group.setRotation(0.0, 0.0, 0.6511);
  cube_025Group.position.set(-29.3814, 5.5959, -7.901);
  const cube_026Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_026Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_026 = new THREE.Mesh(cube_026Geometry, ColoumnPlateMaterial);
    cube_026.scale.set(0.4453, 0.2384, 0.9985);
    cube_026.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_026Group.add(cube_026);
  }
  cube_026Group.setRotation(0.0, 0.0, 0.3109);
  cube_026Group.position.set(-28.5579, 5.832, -7.901);
  const cube_027Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_027Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_027 = new THREE.Mesh(cube_027Geometry, ColoumnPlateMaterial);
    cube_027.scale.set(0.4453, 0.1584, 0.9985);
    cube_027.position.set(5.9981 * i, 0, 0);
    cube_027Group.add(cube_027);
  }
  cube_027Group.position.set(-27.6974, 5.8917, -7.901);
  const cube_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_028Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_028 = new THREE.Mesh(cube_028Geometry, ColoumnPlateMaterial);
    cube_028.scale.set(0.4453, 0.2934, 0.9985);
    cube_028.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_028Group.add(cube_028);
  }
  cube_028Group.setRotation(0.0, 0.0, -1.0669);
  cube_028Group.position.set(-25.5818, 4.92, -7.901);
  const cube_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_029Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_029 = new THREE.Mesh(cube_029Geometry, ColoumnPlateMaterial);
    cube_029.scale.set(0.4453, 0.2384, 0.9985);
    cube_029.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_029Group.add(cube_029);
  }
  cube_029Group.setRotation(0.0, 0.0, -0.3109);
  cube_029Group.position.set(-26.8361, 5.832, -7.901);
  const cube_030Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_030Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_030 = new THREE.Mesh(cube_030Geometry, ColoumnPlateMaterial);
    cube_030.scale.set(0.4453, 0.4393, 0.9985);
    cube_030.position.set(4.771 * i, 3.6355 * i, 0);
    cube_030Group.add(cube_030);
  }
  cube_030Group.setRotation(0.0, 0.0, -0.6511);
  cube_030Group.position.set(-26.0135, 5.5959, -7.901);
  const cube_031Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_031Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_031 = new THREE.Mesh(cube_031Geometry, Floor_ColumnsMaterial);
    cube_031.scale.set(0.4453, 0.2934, 0.6455);
    cube_031.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_031Group.add(cube_031);
  }
  cube_031Group.setRotation(0.0, 0.0, -1.0669);
  cube_031Group.position.set(-25.6364, 4.92, -7.901);
  const cube_032Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_032Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_032 = new THREE.Mesh(cube_032Geometry, Floor_ColumnsMaterial);
    cube_032.scale.set(0.4453, 0.2934, 0.6455);
    cube_032.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_032Group.add(cube_032);
  }
  cube_032Group.setRotation(0.0, 0.0, 1.0669);
  cube_032Group.position.set(-29.777, 4.92, -7.901);
  const cube_033Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_033Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_033 = new THREE.Mesh(cube_033Geometry, Floor_ColumnsMaterial);
    cube_033.scale.set(0.4453, 0.4393, 0.6455);
    cube_033.position.set(4.771 * i, -3.6355 * i, 0);
    cube_033Group.add(cube_033);
  }
  cube_033Group.setRotation(0.0, 0.0, 0.6511);
  cube_033Group.position.set(-29.3235, 5.5959, -7.901);
  const cube_034Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_034Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_034 = new THREE.Mesh(cube_034Geometry, Floor_ColumnsMaterial);
    cube_034.scale.set(0.4453, 0.2384, 0.6455);
    cube_034.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_034Group.add(cube_034);
  }
  cube_034Group.setRotation(0.0, 0.0, 0.3109);
  cube_034Group.position.set(-28.4432, 5.832, -7.901);
  const cube_035Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_035Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_035 = new THREE.Mesh(cube_035Geometry, Floor_ColumnsMaterial);
    cube_035.scale.set(0.4453, 0.1584, 0.6455);
    cube_035.position.set(5.9981 * i, 0, 0);
    cube_035Group.add(cube_035);
  }
  cube_035Group.position.set(-27.6974, 5.8583, -7.901);
  const cube_036Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_036Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_036 = new THREE.Mesh(cube_036Geometry, Floor_ColumnsMaterial);
    cube_036.scale.set(0.4453, 0.4393, 0.6455);
    cube_036.position.set(4.771 * i, 3.6355 * i, 0);
    cube_036Group.add(cube_036);
  }
  cube_036Group.setRotation(0.0, 0.0, -0.6511);
  cube_036Group.position.set(-26.068, 5.5959, -7.901);
  const cube_037Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_037Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_037 = new THREE.Mesh(cube_037Geometry, Floor_ColumnsMaterial);
    cube_037.scale.set(0.4453, 0.2384, 0.6455);
    cube_037.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_037Group.add(cube_037);
  }
  cube_037Group.setRotation(0.0, 0.0, -0.3109);
  cube_037Group.position.set(-26.9447, 5.832, -7.901);
  const cube_038Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_038 = new THREE.Mesh(cube_038Geometry, ColoumnPlateMaterial);
  cube_038.scale.set(8.2777, 3.4789, 1.0);
  const cube_038MZ = cube_038.clone();
  cube_038.position.set(0, 0, 7.8995);
  cube_038MZ.position.set(0, 0, -7.8995);
  cube_038.setRotation(0.0, 0.0, -0.0);
  cube_038MZ.setRotation(0.0, -0.0, -0.0);
  const cube_038MirroredZ = new THREE.Group();
  cube_038MirroredZ.add(cube_038, cube_038MZ);
  cube_038MirroredZ.position.set(44.5687, 4.3331, 0);
  const cube_039Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_039 = new THREE.Mesh(cube_039Geometry, ColoumnPlateMaterial);
  cube_039.scale.set(1.0167, 3.4789, 2.3384);
  const cube_039MZ = cube_039.clone();
  cube_039.position.set(0, 0, 9.2379);
  cube_039MZ.position.set(0, 0, -9.2379);
  cube_039.setRotation(0.0, 0.0, -0.0);
  cube_039MZ.setRotation(0.0, -0.0, -0.0);
  const cube_039MirroredZ = new THREE.Group();
  cube_039MirroredZ.add(cube_039, cube_039MZ);
  cube_039MirroredZ.position.set(53.863, 4.3331, 0);
  const cube_040Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_040 = new THREE.Mesh(cube_040Geometry, ColoumnPlateMaterial);
  cube_040.scale.set(8.8883, 3.4789, 1.128);
  const cube_040MZ = cube_040.clone();
  cube_040.position.set(0, 0, 10.4484);
  cube_040MZ.position.set(0, 0, -10.4484);
  cube_040.setRotation(0.0, 0.0, -0.0);
  cube_040MZ.setRotation(0.0, -0.0, -0.0);
  const cube_040MirroredZ = new THREE.Group();
  cube_040MirroredZ.add(cube_040, cube_040MZ);
  cube_040MirroredZ.position.set(63.7679, 4.3331, 0);
  const cube_070Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_070Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_070 = new THREE.Mesh(cube_070Geometry, ColoumnPlateMaterial);
    cube_070.scale.set(2.0429, 0.9826, 0.9985);
    cube_070.position.set(5.998 * i, 0, 0);
    cube_070Group.add(cube_070);
  }
  cube_070Group.position.set(-27.6974, 6.8294, -7.901);
  const cube_071Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_071Group = new THREE.Group();
  for (var i = 0; i < 11; i++) {
    const cube_071 = new THREE.Mesh(cube_071Geometry, ColoumnPlateMaterial);
    cube_071.scale.set(2.0429, 0.9826, 0.9985);
    cube_071.position.set(5.998 * i, 0, 0);
    cube_071Group.add(cube_071);
  }
  cube_071Group.position.set(-27.6974, 6.8294, 7.901);
  const cube_092Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_092 = new THREE.Mesh(cube_092Geometry, ColoumnPlateMaterial);
  cube_092.scale.set(8.9444, 3.4789, 1.0);
  const cube_092MZ = cube_092.clone();
  cube_092.position.set(0, 0, 7.8995);
  cube_092MZ.position.set(0, 0, -7.8995);
  cube_092.setRotation(0.0, 0.0, -0.0);
  cube_092MZ.setRotation(0.0, -0.0, -0.0);
  const cube_092MirroredZ = new THREE.Group();
  cube_092MirroredZ.add(cube_092, cube_092MZ);
  cube_092MirroredZ.position.set(-40.6534, 4.3331, 0);
  const cube_bigroofGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_bigroof = new THREE.Mesh(
    cube_bigroofGeometry,
    Floor_CentralMaterial,
  );
  cube_bigroof.scale.set(49.229, 0.1743, 6.2642);
  const cube_bigroofMZ = cube_bigroof.clone();
  cube_bigroof.position.set(0, 0, 22.6954);
  cube_bigroofMZ.position.set(0, 0, -22.6954);
  cube_bigroof.setRotation(1.5708, 0.0, 0.0);
  cube_bigroofMZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_bigroofMirroredZ = new THREE.Group();
  cube_bigroofMirroredZ.add(cube_bigroof, cube_bigroofMZ);
  cube_bigroofMirroredZ.position.set(-1.2151, -0.2095, 0);
  const cube_bigroof_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_bigroof_004 = new THREE.Mesh(
    cube_bigroof_004Geometry,
    Floor_CentralMaterial,
  );
  cube_bigroof_004.scale.set(49.229, 0.1743, 3.3728);
  const cube_bigroof_004MZ = cube_bigroof_004.clone();
  cube_bigroof_004.position.set(0, 0, 14.5133);
  cube_bigroof_004MZ.position.set(0, 0, -14.5133);
  cube_bigroof_004.setRotation(1.5708, 0.0, 0.0);
  cube_bigroof_004MZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_bigroof_004MirroredZ = new THREE.Group();
  cube_bigroof_004MirroredZ.add(cube_bigroof_004, cube_bigroof_004MZ);
  cube_bigroof_004MirroredZ.position.set(-1.2151, -3.1009, 0);
  const cube_stairs_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stairs_005Group = new THREE.Group();
  for (var i = 0; i < 29; i++) {
    const cube_stairs_005 = new THREE.Mesh(
      cube_stairs_005Geometry,
      RoofTilesMaterial,
    );
    cube_stairs_005.scale.set(0.2302, 0.2302, 1.0);
    cube_stairs_005.position.set(0.4605 * i, 0.4605 * i, 0);
    cube_stairs_005Group.add(cube_stairs_005);
  }
  cube_stairs_005Group.position.set(73.4026, 1.0795, -6.6399);
  const cube_escfloor_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_escfloor_011 = new THREE.Mesh(
    cube_escfloor_011Geometry,
    RoofTilesMaterial,
  );
  cube_escfloor_011.position.set(72.3317, 0.7364, -6.6458);
  cube_escfloor_011.scale.set(1.3957, 0.9468, 0.1099);
  cube_escfloor_011.setRotation(1.5708, 0.0, 0.0);

  const cube_handrail_014Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_handrail_014 = new THREE.Mesh(
    cube_handrail_014Geometry,
    RoofTilesMaterial,
  );
  cube_handrail_014.scale.set(9.0522, 0.9024, 0.1501);
  const cube_handrail_014MZ = cube_handrail_014.clone();
  cube_handrail_014.position.set(0, 0, -5.5815);
  cube_handrail_014MZ.position.set(0, 0, -7.6983);
  cube_handrail_014.setRotation(0.0, 0.0, 0.7854);
  cube_handrail_014MZ.setRotation(0.0, -0.0, 0.7854);
  const cube_handrail_014MirroredZ = new THREE.Group();
  cube_handrail_014MirroredZ.add(cube_handrail_014, cube_handrail_014MZ);
  cube_handrail_014MirroredZ.position.set(79.9783, 7.997, 0);
  const cube_handrail_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_handrail_013 = new THREE.Mesh(
    cube_handrail_013Geometry,
    RoofTilesMaterial,
  );
  cube_handrail_013.scale.set(1.0888, 0.8356, 0.1501);
  const cube_handrail_013MZ = cube_handrail_013.clone();
  cube_handrail_013.position.set(0, 0, -5.5815);
  cube_handrail_013MZ.position.set(0, 0, -7.6983);
  cube_handrail_013.setRotation(0.0, 0.0, -0.0);
  cube_handrail_013MZ.setRotation(0.0, -0.0, -0.0);
  const cube_handrail_013MirroredZ = new THREE.Group();
  cube_handrail_013MirroredZ.add(cube_handrail_013, cube_handrail_013MZ);
  cube_handrail_013MirroredZ.position.set(72.3317, 1.3748, 0);
  const cylinder_handrail_020Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_handrail_020 = new THREE.Mesh(
    cylinder_handrail_020Geometry,
    RoofTilesMaterial,
  );
  cylinder_handrail_020.scale.set(1.0, 0.1516, 1.0);
  const cylinder_handrail_020MZ = cylinder_handrail_020.clone();
  cylinder_handrail_020.position.set(0, 0, -5.5823);
  cylinder_handrail_020MZ.position.set(0, 0, -7.6976);
  cylinder_handrail_020.setRotation(1.5708, 0.0, 0.0);
  cylinder_handrail_020MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinder_handrail_020MirroredZ = new THREE.Group();
  cylinder_handrail_020MirroredZ.add(
    cylinder_handrail_020,
    cylinder_handrail_020MZ,
  );
  cylinder_handrail_020MirroredZ.position.set(73.4026, 1.5286, 0);
  const cylinder_handrail_019Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_handrail_019 = new THREE.Mesh(
    cylinder_handrail_019Geometry,
    RoofTilesMaterial,
  );
  cylinder_handrail_019.scale.set(1.0, 0.1516, 1.0);
  const cylinder_handrail_019MZ = cylinder_handrail_019.clone();
  cylinder_handrail_019.position.set(0, 0, -5.5823);
  cylinder_handrail_019MZ.position.set(0, 0, -7.6976);
  cylinder_handrail_019.setRotation(1.5708, 0.0, 0.0);
  cylinder_handrail_019MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinder_handrail_019MirroredZ = new THREE.Group();
  cylinder_handrail_019MirroredZ.add(
    cylinder_handrail_019,
    cylinder_handrail_019MZ,
  );
  cylinder_handrail_019MirroredZ.position.set(86.5219, 14.535, 0);
  const cylinder_handrail_018Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_handrail_018 = new THREE.Mesh(
    cylinder_handrail_018Geometry,
    RoofTilesMaterial,
  );
  cylinder_handrail_018.scale.set(1.0, 0.1516, 1.0);
  const cylinder_handrail_018MZ = cylinder_handrail_018.clone();
  cylinder_handrail_018.position.set(0, 0, -5.5823);
  cylinder_handrail_018MZ.position.set(0, 0, -7.6976);
  cylinder_handrail_018.setRotation(1.5708, 0.0, 0.0);
  cylinder_handrail_018MZ.setRotation(-1.5708, -0.0, 0.0);
  const cylinder_handrail_018MirroredZ = new THREE.Group();
  cylinder_handrail_018MirroredZ.add(
    cylinder_handrail_018,
    cylinder_handrail_018MZ,
  );
  cylinder_handrail_018MirroredZ.position.set(71.3058, 1.241, 0);
  const cube_handrail_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_handrail_012 = new THREE.Mesh(
    cube_handrail_012Geometry,
    RoofTilesMaterial,
  );
  cube_handrail_012.scale.set(1.0888, 0.8356, 0.1501);
  const cube_handrail_012MZ = cube_handrail_012.clone();
  cube_handrail_012.position.set(0, 0, -5.5815);
  cube_handrail_012MZ.position.set(0, 0, -7.6983);
  cube_handrail_012.setRotation(0.0, -0.0, -3.1416);
  cube_handrail_012MZ.setRotation(0.0, 0.0, -3.1416);
  const cube_handrail_012MirroredZ = new THREE.Group();
  cube_handrail_012MirroredZ.add(cube_handrail_012, cube_handrail_012MZ);
  cube_handrail_012MirroredZ.position.set(87.9709, 14.5346, 0);
  const cylinder_handrail_017Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_handrail_017 = new THREE.Mesh(
    cylinder_handrail_017Geometry,
    RoofTilesMaterial,
  );
  cylinder_handrail_017.scale.set(1.0, 0.1516, 1.0);
  const cylinder_handrail_017MZ = cylinder_handrail_017.clone();
  cylinder_handrail_017.position.set(0, 0, -5.5823);
  cylinder_handrail_017MZ.position.set(0, 0, -7.6976);
  cylinder_handrail_017.setRotation(1.5708, -0.0, -3.1416);
  cylinder_handrail_017MZ.setRotation(-1.5708, 0.0, -3.1416);
  const cylinder_handrail_017MirroredZ = new THREE.Group();
  cylinder_handrail_017MirroredZ.add(
    cylinder_handrail_017,
    cylinder_handrail_017MZ,
  );
  cylinder_handrail_017MirroredZ.position.set(88.9967, 14.4624, 0);
  const cube_escfloor_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_escfloor_010 = new THREE.Mesh(
    cube_escfloor_010Geometry,
    RoofTilesMaterial,
  );
  cube_escfloor_010.position.set(87.8165, 14.1388, -6.6458);
  cube_escfloor_010.scale.set(1.3957, 0.9468, 0.1099);
  cube_escfloor_010.setRotation(1.5708, 0.0, 0.0);

  const cube_041Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_041 = new THREE.Mesh(cube_041Geometry, ColoumnPlateMaterial);
  cube_041.position.set(53.7454, 7.9374, -0.0);
  cube_041.scale.set(1.1221, 2.1309, 7.0248);

  const cube_042Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_042 = new THREE.Mesh(cube_042Geometry, BrassMaterial);
  cube_042.position.set(53.6094, 6.0196, -0.0);
  cube_042.scale.set(1.2033, 0.1788, 7.0248);

  const cube_043Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_043 = new THREE.Mesh(cube_043Geometry, BrassMaterial);
  cube_043.scale.set(1.2033, 0.0529, 1.1606);
  const cube_043MZ = cube_043.clone();
  cube_043.position.set(0, 0, -5.01);
  cube_043MZ.position.set(0, 0, 5.01);
  cube_043.setRotation(1.5708, 0.0, 0.0);
  cube_043MZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_043MirroredZ = new THREE.Group();
  cube_043MirroredZ.add(cube_043, cube_043MZ);
  cube_043MirroredZ.position.set(53.6094, 7.359, 0);
  const cube_044Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_044 = new THREE.Mesh(cube_044Geometry, BrassMaterial);
  cube_044.scale.set(1.2033, 0.0529, 1.7061);
  const cube_044MZ = cube_044.clone();
  cube_044.position.set(0, 0, -2.5808);
  cube_044MZ.position.set(0, 0, 2.5808);
  cube_044.setRotation(1.5708, 0.0, 0.0);
  cube_044MZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_044MirroredZ = new THREE.Group();
  cube_044MirroredZ.add(cube_044, cube_044MZ);
  cube_044MirroredZ.position.set(53.6094, 7.9044, 0);
  const cube_045Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_045 = new THREE.Mesh(cube_045Geometry, BrassMaterial);
  cube_045.position.set(53.6094, 7.9044, -0.0);
  cube_045.scale.set(1.2033, 0.0529, 1.7061);
  cube_045.setRotation(1.5708, 0.0, 0.0);

  const cube_046Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_046 = new THREE.Mesh(cube_046Geometry, BrassMaterial);
  cube_046.position.set(53.6429, 8.2123, -0.0);
  cube_046.scale.set(1.2033, 0.0405, 5.5555);

  const cube_047Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_047 = new THREE.Mesh(cube_047Geometry, Blue_PictureMaterial);
  cube_047.position.set(52.4948, 8.1131, -0.0);
  cube_047.scale.set(-0.0232, 1.9147, 4.9622);

  const cylinder_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_008 = new THREE.Mesh(cylinder_008Geometry, BrassMaterial);
  cylinder_008.position.set(52.4284, 7.9374, -0.0);
  cylinder_008.scale.set(1.0, 0.0534, 1.0);
  cylinder_008.setRotation(0.0, 0.0, -1.5708);

  const cylinder_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_009 = new THREE.Mesh(cylinder_009Geometry, WhiteDotsMaterial);
  cylinder_009.position.set(52.3781, 7.9374, -0.0);
  cylinder_009.scale.set(0.9637, 0.0534, 0.9637);
  cylinder_009.setRotation(0.0, 0.0, -1.5708);

  const cylinder_010Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_010 = new THREE.Mesh(cylinder_010Geometry, ColoumnMaterial);
  cylinder_010.position.set(52.3201, 7.9374, -0.0);
  cylinder_010.scale.set(0.075, 0.0188, 0.075);
  cylinder_010.setRotation(0.0, 0.0, -1.5708);

  const cube_048Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_048 = new THREE.Mesh(cube_048Geometry, ColoumnMaterial);
  cube_048.position.set(52.3406, 8.3492, -0.0);
  cube_048.scale.set(0.0334, 0.3772, 0.0334);

  const cube_049Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_049 = new THREE.Mesh(cube_049Geometry, ColoumnMaterial);
  cube_049.position.set(52.3406, 8.0482, 0.3139);
  cube_049.scale.set(0.0334, 0.305, 0.0334);
  cube_049.setRotation(1.2316, 0.0, 0.0);

  const cube_050Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_050 = new THREE.Mesh(cube_050Geometry, ColoumnMaterial);
  cube_050.scale.set(0.0328, 0.0583, 0.0328);
  const cube_050MX = cube_050.clone();
  cube_050.position.set(52.3403, 0, 0);
  cube_050MX.position.set(52.416, 0, 0);
  cube_050.setRotation(0.0, 0.0, -0.0);
  cube_050MX.setRotation(0.0, -0.0, 0.0);
  const cube_050MirroredX = new THREE.Group();
  cube_050MirroredX.add(cube_050, cube_050MX);
  cube_050MirroredX.position.set(0, 8.8056, -0.0);
  const cube_051Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_051 = new THREE.Mesh(cube_051Geometry, ColoumnMaterial);
  cube_051.scale.set(0.0328, 0.0583, 0.0328);
  const cube_051MZ = cube_051.clone();
  cube_051.position.set(0, 0, 0.8682);
  cube_051MZ.position.set(0, 0, -0.8682);
  cube_051.setRotation(1.5708, 0.0, 0.0);
  cube_051MZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_051MirroredZ = new THREE.Group();
  cube_051MirroredZ.add(cube_051, cube_051MZ);
  cube_051MirroredZ.position.set(52.3403, 7.9374, 0);
  const cube_052Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_052 = new THREE.Mesh(cube_052Geometry, ColoumnMaterial);
  cube_052.scale.set(0.0328, 0.0583, 0.0328);
  const cube_052MZ = cube_052.clone();
  cube_052.position.set(0, 0, 0.6139);
  cube_052MZ.position.set(0, 0, -0.6139);
  cube_052.setRotation(2.3562, 0.0, 0.0);
  cube_052MZ.setRotation(-2.3562, -0.0, 0.0);
  const cube_052MirroredZ = new THREE.Group();
  cube_052MirroredZ.add(cube_052, cube_052MZ);
  cube_052MirroredZ.position.set(52.3403, 7.3235, 0);
  const cube_053Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_053 = new THREE.Mesh(cube_053Geometry, ColoumnMaterial);
  cube_053.scale.set(0.0328, 0.0583, 0.0328);
  const cube_053MZ = cube_053.clone();
  cube_053.position.set(0, 0, 0.6139);
  cube_053MZ.position.set(0, 0, -0.6139);
  cube_053.setRotation(0.7854, 0.0, 0.0);
  cube_053MZ.setRotation(-0.7854, -0.0, 0.0);
  const cube_053MirroredZ = new THREE.Group();
  cube_053MirroredZ.add(cube_053, cube_053MZ);
  cube_053MirroredZ.position.set(52.3403, 8.5513, 0);
  const cylinder_011Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_011 = new THREE.Mesh(cylinder_011Geometry, RoofTilesMaterial);
  cylinder_011.position.set(52.3299, 7.9374, -0.0);
  cylinder_011.scale.set(0.4398, 0.011, 0.4398);
  cylinder_011.setRotation(0.0, 0.0, -1.5708);

  const cube_054Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_054 = new THREE.Mesh(cube_054Geometry, MetalMaterial);
  cube_054.position.set(38.1605, 2.3445, 6.9102);
  cube_054.scale.set(1.2649, 0.9801, 0.0322);

  const cube_055Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_055 = new THREE.Mesh(cube_055Geometry, MetalMaterial);
  cube_055.position.set(38.1605, 3.1273, -6.8906);
  cube_055.scale.set(1.6975, 1.1575, 0.0322);

  const cube_056Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_056 = new THREE.Mesh(cube_056Geometry, Blue_PictureMaterial);
  cube_056.position.set(38.1605, 2.9853, -6.8646);
  cube_056.scale.set(1.6244, 0.9379, 0.0322);

  const cube_057Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_057 = new THREE.Mesh(cube_057Geometry, Green_PictureMaterial);
  cube_057.position.set(38.1605, 4.0931, -6.8646);
  cube_057.scale.set(1.6244, 0.146, 0.0322);

  const cube_058Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_058 = new THREE.Mesh(cube_058Geometry, MetalMaterial);
  cube_058.position.set(38.1605, 4.4235, 6.9102);
  cube_058.scale.set(1.2649, 0.9801, 0.0322);

  const cube_059Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_059 = new THREE.Mesh(cube_059Geometry, Green_PictureMaterial);
  cube_059.position.set(38.1605, 2.3445, 6.8851);
  cube_059.scale.set(1.1847, 0.918, 0.0301);

  const cube_060Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_060 = new THREE.Mesh(cube_060Geometry, Blue_PictureMaterial);
  cube_060.position.set(38.1605, 4.4235, 6.8851);
  cube_060.scale.set(1.1847, 0.918, 0.0301);

  const cube_061Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_061 = new THREE.Mesh(cube_061Geometry, MetalMaterial);
  cube_061.position.set(38.1605, 5.1875, -6.9009);
  cube_061.scale.set(0.1398, 0.1398, 0.0286);

  const cube_062Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_062 = new THREE.Mesh(cube_062Geometry, MetalMaterial);
  cube_062.position.set(38.1605, 5.1875, -6.7612);
  cube_062.scale.set(0.041, 0.041, 0.1231);

  const cube_063Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_063 = new THREE.Mesh(cube_063Geometry, MetalMaterial);
  cube_063.position.set(38.1605, 5.1875, -6.3446);
  cube_063.scale.set(0.1035, 0.3, 0.3);

  const cube_064Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_064 = new THREE.Mesh(cube_064Geometry, Green_PictureMaterial);
  cube_064.position.set(38.1605, 5.1875, -6.3446);
  cube_064.scale.set(0.1379, 0.2533, 0.2533);

  const cube_065Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_065 = new THREE.Mesh(cube_065Geometry, WhiteDotsMaterial);
  cube_065.position.set(38.1605, 5.1086, -6.3446);
  cube_065.scale.set(0.1751, 0.1278, 0.0332);

  const cylinder_012Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_012 = new THREE.Mesh(cylinder_012Geometry, WhiteDotsMaterial);
  cylinder_012.position.set(38.1605, 5.3262, -6.3446);
  cylinder_012.scale.set(0.0413, 0.1645, 0.0413);
  cylinder_012.setRotation(0.0, 0.0, -1.5708);

  const cube_066Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_066Group = new THREE.Group();
  for (var i = 0; i < 5; i++) {
    const cube_066 = new THREE.Mesh(cube_066Geometry, WhiteDotsMaterial);
    cube_066.scale.set(0.0392, 0.6686, 0.47);
    cube_066.position.set(12.001 * i, 0, 0);
    cube_066Group.add(cube_066);
  }
  cube_066Group.position.set(-23.6566, 3.1162, 7.8995);
  const cube_067Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_067Group = new THREE.Group();
  for (var i = 0; i < 5; i++) {
    const cube_067 = new THREE.Mesh(cube_067Geometry, WhiteDotsMaterial);
    cube_067.scale.set(0.0392, 0.6686, 0.47);
    cube_067.position.set(12.001 * i, 0, 0);
    cube_067Group.add(cube_067);
  }
  cube_067Group.position.set(-23.6566, 3.1162, -7.8995);
  const cube_068Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_068Group = new THREE.Group();
  for (var i = 0; i < 5; i++) {
    const cube_068 = new THREE.Mesh(cube_068Geometry, WhiteDotsMaterial);
    cube_068.scale.set(0.0392, 0.6686, 0.47);
    cube_068.position.set(12.001 * i, 0, 0);
    cube_068Group.add(cube_068);
  }
  cube_068Group.position.set(-25.7557, 3.1162, 7.8995);
  const cube_069Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_069Group = new THREE.Group();
  for (var i = 0; i < 5; i++) {
    const cube_069 = new THREE.Mesh(cube_069Geometry, WhiteDotsMaterial);
    cube_069.scale.set(0.0392, 0.6686, 0.47);
    cube_069.position.set(12.001 * i, 0, 0);
    cube_069Group.add(cube_069);
  }
  cube_069Group.position.set(-25.7557, 3.1162, -7.8995);
  const cube_072Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_072 = new THREE.Mesh(cube_072Geometry, Metall_RustMaterial);
  cube_072.scale.set(49.7057, 0.0913, 3.9259);
  const cube_072MZ = cube_072.clone();
  cube_072.position.set(0, 0, 18.6043);
  cube_072MZ.position.set(0, 0, -18.6043);
  cube_072.setRotation(0.0, 0.0, -0.0);
  cube_072MZ.setRotation(0.0, -0.0, -0.0);
  const cube_072MirroredZ = new THREE.Group();
  cube_072MirroredZ.add(cube_072, cube_072MZ);
  cube_072MirroredZ.position.set(-1.2151, -2.8464, 0);
  const cube_073Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_073 = new THREE.Mesh(cube_073Geometry, Metall_RustMaterial);
  cube_073.scale.set(49.7057, 0.0913, 0.6522);
  const cube_073MZ = cube_073.clone();
  cube_073.position.set(0, 0, 22.347);
  cube_073MZ.position.set(0, 0, -22.347);
  cube_073.setRotation(-1.0876, 0.0, 0.0);
  cube_073MZ.setRotation(1.0876, -0.0, 0.0);
  const cube_073MirroredZ = new THREE.Group();
  cube_073MirroredZ.add(cube_073, cube_073MZ);
  cube_073MirroredZ.position.set(-1.4681, -2.5929, 0);
  const cube_074Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_074 = new THREE.Mesh(cube_074Geometry, MetalMaterial);
  cube_074.scale.set(49.7057, 0.2605, 0.166);
  const cube_074MZ = cube_074.clone();
  cube_074.position.set(0, 0, 16.1386);
  cube_074MZ.position.set(0, 0, -16.1386);
  cube_074.setRotation(0.0, 0.0, -0.0);
  cube_074MZ.setRotation(0.0, -0.0, -0.0);
  const cube_074MirroredZ = new THREE.Group();
  cube_074MirroredZ.add(cube_074, cube_074MZ);
  cube_074MirroredZ.position.set(-1.2151, -2.4946, 0);
  const cube_075Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_075 = new THREE.Mesh(cube_075Geometry, MetalMaterial);
  cube_075.scale.set(49.7057, 0.2605, 0.166);
  const cube_075MZ = cube_075.clone();
  cube_075.position.set(0, 0, 21.0701);
  cube_075MZ.position.set(0, 0, -21.0701);
  cube_075.setRotation(0.0, 0.0, -0.0);
  cube_075MZ.setRotation(0.0, -0.0, -0.0);
  const cube_075MirroredZ = new THREE.Group();
  cube_075MirroredZ.add(cube_075, cube_075MZ);
  cube_075MirroredZ.position.set(-1.2151, -2.4946, 0);
  const cube_076Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_076 = new THREE.Mesh(cube_076Geometry, ColoumnMaterial);
  cube_076.scale.set(49.7057, 0.0913, 1.6548);
  const cube_076MZ = cube_076.clone();
  cube_076.position.set(0, 0, 22.5792);
  cube_076MZ.position.set(0, 0, -22.5792);
  cube_076.setRotation(1.5708, 0.0, 0.0);
  cube_076MZ.setRotation(-1.5708, -0.0, 0.0);
  const cube_076MirroredZ = new THREE.Group();
  cube_076MirroredZ.add(cube_076, cube_076MZ);
  cube_076MirroredZ.position.set(-1.4681, -0.7137, 0);
  const cube_077Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_077Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_077 = new THREE.Mesh(cube_077Geometry, WhiteDotsMaterial);
    cube_077.scale.set(1.5186, 0.0513, 1.4186);
    cube_077.position.set(3.341 * i, 0, 0);
    cube_077Group.add(cube_077);
  }
  cube_077Group.setRotation(0.053, -0.0, 0.0);
  cube_077Group.position.set(-48.0887, 9.1261, 15.2259);
  const cube_078Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_078Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_078 = new THREE.Mesh(cube_078Geometry, WhiteDotsMaterial);
    cube_078.scale.set(1.5186, 0.0513, 1.3299);
    cube_078.position.set(3.341 * i, 0, 0);
    cube_078Group.add(cube_078);
  }
  cube_078Group.setRotation(-0.2552, -0.0, 0.0);
  cube_078Group.position.set(-48.0887, 8.8694, 12.5384);
  const cube_079Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_079Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_079 = new THREE.Mesh(cube_079Geometry, WhiteDotsMaterial);
    cube_079.scale.set(1.5186, 0.0513, 1.2076);
    cube_079.position.set(3.341 * i, 0, 0);
    cube_079Group.add(cube_079);
  }
  cube_079Group.setRotation(-0.6303, -0.0, 0.0);
  cube_079Group.position.set(-48.0887, 7.8661, 10.3425);
  const cube_080Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_080Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_080 = new THREE.Mesh(cube_080Geometry, WhiteDotsMaterial);
    cube_080.scale.set(1.5186, 0.0513, 0.6538);
    cube_080.position.set(3.341 * i, 0, 0);
    cube_080Group.add(cube_080);
  }
  cube_080Group.setRotation(-1.1069, -0.0, -0.0);
  cube_080Group.position.set(-48.0887, 6.6251, 9.1086);
  const cube_081Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_081Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_081 = new THREE.Mesh(cube_081Geometry, WhiteDotsMaterial);
    cube_081.scale.set(1.5186, 0.0513, 1.4186);
    cube_081.position.set(3.341 * i, 0, 0);
    cube_081Group.add(cube_081);
  }
  cube_081Group.setRotation(0.3397, -0.0, 0.0);
  cube_081Group.position.set(-48.0887, 8.5788, 17.9723);
  const cube_082Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_082Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_082 = new THREE.Mesh(cube_082Geometry, WhiteDotsMaterial);
    cube_082.scale.set(1.5186, 0.0513, 1.3442);
    cube_082.position.set(3.341 * i, 0, 0);
    cube_082Group.add(cube_082);
  }
  cube_082Group.setRotation(0.6479, -0.0, 0.0);
  cube_082Group.position.set(-48.0887, 7.3242, 20.3389);
  const cube_083Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_083Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_083 = new THREE.Mesh(cube_083Geometry, WhiteDotsMaterial);
    cube_083.scale.set(1.5186, 0.0513, 1.3442);
    cube_083.position.set(3.341 * i, 0, 0);
    cube_083Group.add(cube_083);
  }
  cube_083Group.setRotation(1.023, -0.0, 0.0);
  cube_083Group.position.set(-48.0887, 5.4288, 22.068);
  const cube_084Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_084Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_084 = new THREE.Mesh(cube_084Geometry, MetalMaterial);
    cube_084.scale.set(0.1738, 0.0511, 1.3427);
    cube_084.position.set(3.341 * i, 0, 0);
    cube_084Group.add(cube_084);
  }
  cube_084Group.setRotation(1.023, -0.0, 0.0);
  cube_084Group.position.set(-46.4182, 5.3882, 22.0402);
  const cube_085Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_085Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_085 = new THREE.Mesh(cube_085Geometry, MetalMaterial);
    cube_085.scale.set(0.1738, 0.0513, 1.4127);
    cube_085.position.set(3.341 * i, 0, 0);
    cube_085Group.add(cube_085);
  }
  cube_085Group.setRotation(0.053, -0.0, 0.0);
  cube_085Group.position.set(-46.4182, 9.0855, 15.2265);
  const cube_086Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_086Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_086 = new THREE.Mesh(cube_086Geometry, MetalMaterial);
    cube_086.scale.set(0.1738, 0.0513, 1.3247);
    cube_086.position.set(3.341 * i, 0, 0);
    cube_086Group.add(cube_086);
  }
  cube_086Group.setRotation(-0.2552, -0.0, 0.0);
  cube_086Group.position.set(-46.4182, 8.8288, 12.5501);
  const cube_087Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_087Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_087 = new THREE.Mesh(cube_087Geometry, MetalMaterial);
    cube_087.scale.set(0.1738, 0.0512, 1.2043);
    cube_087.position.set(3.341 * i, 0, 0);
    cube_087Group.add(cube_087);
  }
  cube_087Group.setRotation(-0.6303, -0.0, 0.0);
  cube_087Group.position.set(-46.4182, 7.8255, 10.3634);
  const cube_088Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_088Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_088 = new THREE.Mesh(cube_088Geometry, MetalMaterial);
    cube_088.scale.set(0.1738, 0.0511, 0.6533);
    cube_088.position.set(3.341 * i, 0, 0);
    cube_088Group.add(cube_088);
  }
  cube_088Group.setRotation(-1.1069, -0.0, 0.0);
  cube_088Group.position.set(-46.4182, 6.5845, 9.1346);
  const cube_089Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_089Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_089 = new THREE.Mesh(cube_089Geometry, MetalMaterial);
    cube_089.scale.set(0.1738, 0.0513, 1.4133);
    cube_089.position.set(3.341 * i, 0, 0);
    cube_089Group.add(cube_089);
  }
  cube_089Group.setRotation(0.3397, -0.0, 0.0);
  cube_089Group.position.set(-46.4182, 8.5382, 17.9615);
  const cube_090Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_090Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_090 = new THREE.Mesh(cube_090Geometry, MetalMaterial);
    cube_090.scale.set(0.1738, 0.0512, 1.3406);
    cube_090.position.set(3.341 * i, 0, 0);
    cube_090Group.add(cube_090);
  }
  cube_090Group.setRotation(0.6479, -0.0, 0.0);
  cube_090Group.position.set(-46.4182, 7.2836, 20.3183);
  const cube_091Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_091Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_091 = new THREE.Mesh(cube_091Geometry, MetalMaterial);
    cube_091.scale.set(1.5186, 0.0513, 0.0838);
    cube_091.position.set(3.341 * i, 0, 0);
    cube_091Group.add(cube_091);
  }
  cube_091Group.setRotation(0.1825, 0.0, 0.0);
  cube_091Group.position.set(-48.0887, 9.0256, 16.6168);
  const cube_093Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_093Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_093 = new THREE.Mesh(cube_093Geometry, WhiteDotsMaterial);
    cube_093.scale.set(1.5186, 0.0513, 0.6538);
    cube_093.position.set(3.341 * i, 0, 0);
    cube_093Group.add(cube_093);
  }
  cube_093Group.setRotation(1.1069, -0.0, -0.0);
  cube_093Group.position.set(-48.0887, 6.6251, -9.1086);
  const cube_094Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_094Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_094 = new THREE.Mesh(cube_094Geometry, WhiteDotsMaterial);
    cube_094.scale.set(1.5186, 0.0513, 1.2076);
    cube_094.position.set(3.341 * i, 0, 0);
    cube_094Group.add(cube_094);
  }
  cube_094Group.setRotation(0.6303, -0.0, 0.0);
  cube_094Group.position.set(-48.0887, 7.8661, -10.3425);
  const cube_095Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_095Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_095 = new THREE.Mesh(cube_095Geometry, MetalMaterial);
    cube_095.scale.set(0.1738, 0.0511, 0.6533);
    cube_095.position.set(3.341 * i, 0, 0);
    cube_095Group.add(cube_095);
  }
  cube_095Group.setRotation(1.1069, -0.0, 0.0);
  cube_095Group.position.set(-46.4182, 6.5845, -9.1346);
  const cube_096Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_096Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_096 = new THREE.Mesh(cube_096Geometry, MetalMaterial);
    cube_096.scale.set(0.1738, 0.0512, 1.2043);
    cube_096.position.set(3.341 * i, 0, 0);
    cube_096Group.add(cube_096);
  }
  cube_096Group.setRotation(0.6303, -0.0, 0.0);
  cube_096Group.position.set(-46.4182, 7.8255, -10.3634);
  const cube_097Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_097Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_097 = new THREE.Mesh(cube_097Geometry, WhiteDotsMaterial);
    cube_097.scale.set(1.5186, 0.0513, 1.3299);
    cube_097.position.set(3.341 * i, 0, 0);
    cube_097Group.add(cube_097);
  }
  cube_097Group.setRotation(0.2552, -0.0, 0.0);
  cube_097Group.position.set(-48.0887, 8.8694, -12.5384);
  const cube_098Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_098Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_098 = new THREE.Mesh(cube_098Geometry, MetalMaterial);
    cube_098.scale.set(0.1738, 0.0513, 1.3247);
    cube_098.position.set(3.341 * i, 0, 0);
    cube_098Group.add(cube_098);
  }
  cube_098Group.setRotation(0.2552, -0.0, 0.0);
  cube_098Group.position.set(-46.4182, 8.8288, -12.5501);
  const cube_099Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_099Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_099 = new THREE.Mesh(cube_099Geometry, WhiteDotsMaterial);
    cube_099.scale.set(1.5186, 0.0513, 1.4186);
    cube_099.position.set(3.341 * i, 0, 0);
    cube_099Group.add(cube_099);
  }
  cube_099Group.setRotation(-0.053, -0.0, 0.0);
  cube_099Group.position.set(-48.0888, 9.1261, -15.2259);
  const cube_100Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_100Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_100 = new THREE.Mesh(cube_100Geometry, MetalMaterial);
    cube_100.scale.set(0.1738, 0.0513, 1.4127);
    cube_100.position.set(3.341 * i, 0, 0);
    cube_100Group.add(cube_100);
  }
  cube_100Group.setRotation(-0.053, -0.0, 0.0);
  cube_100Group.position.set(-46.4182, 9.0855, -15.2265);
  const cube_101Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_101Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_101 = new THREE.Mesh(cube_101Geometry, WhiteDotsMaterial);
    cube_101.scale.set(1.5186, 0.0513, 1.4186);
    cube_101.position.set(3.341 * i, 0, 0);
    cube_101Group.add(cube_101);
  }
  cube_101Group.setRotation(-0.3397, -0.0, 0.0);
  cube_101Group.position.set(-48.0887, 8.5788, -17.9723);
  const cube_102Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_102Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_102 = new THREE.Mesh(cube_102Geometry, MetalMaterial);
    cube_102.scale.set(0.1738, 0.0512, 1.3406);
    cube_102.position.set(3.341 * i, 0, 0);
    cube_102Group.add(cube_102);
  }
  cube_102Group.setRotation(-0.6479, -0.0, 0.0);
  cube_102Group.position.set(-46.4182, 7.2836, -20.3183);
  const cube_103Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_103Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_103 = new THREE.Mesh(cube_103Geometry, MetalMaterial);
    cube_103.scale.set(0.1738, 0.0513, 1.4133);
    cube_103.position.set(3.341 * i, 0, 0);
    cube_103Group.add(cube_103);
  }
  cube_103Group.setRotation(-0.3397, -0.0, 0.0);
  cube_103Group.position.set(-46.4182, 8.5382, -17.9615);
  const cube_104Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_104Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_104 = new THREE.Mesh(cube_104Geometry, WhiteDotsMaterial);
    cube_104.scale.set(1.5186, 0.0513, 1.3442);
    cube_104.position.set(3.341 * i, 0, 0);
    cube_104Group.add(cube_104);
  }
  cube_104Group.setRotation(-0.6479, -0.0, 0.0);
  cube_104Group.position.set(-48.0887, 7.3242, -20.3389);
  const cube_105Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_105Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_105 = new THREE.Mesh(cube_105Geometry, WhiteDotsMaterial);
    cube_105.scale.set(1.5186, 0.0513, 1.3442);
    cube_105.position.set(3.341 * i, 0, 0);
    cube_105Group.add(cube_105);
  }
  cube_105Group.setRotation(-1.023, -0.0, 0.0);
  cube_105Group.position.set(-48.0887, 5.4288, -22.068);
  const cube_106Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_106Group = new THREE.Group();
  for (var i = 0; i < 30; i++) {
    const cube_106 = new THREE.Mesh(cube_106Geometry, MetalMaterial);
    cube_106.scale.set(0.1738, 0.0511, 1.3427);
    cube_106.position.set(3.341 * i, 0, 0);
    cube_106Group.add(cube_106);
  }
  cube_106Group.setRotation(-1.023, -0.0, 0.0);
  cube_106Group.position.set(-46.4182, 5.3882, -22.0402);
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderGroup = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder = new THREE.Mesh(cylinderGeometry, ColoumnMaterial);
    cylinder.scale.set(0.5, 2.5, 0.5);
    cylinder.position.set(6.0 * i, 0, 0);
    cylinderGroup.add(cylinder);
  }
  cylinderGroup.position.set(-30.709, 3.2961, -7.1816);
  const cylinder_001Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_001Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_001 = new THREE.Mesh(
      cylinder_001Geometry,
      ColoumnPlateMaterial,
    );
    cylinder_001.scale.set(0.55, 0.2319, 0.55);
    cylinder_001.position.set(6.0 * i, 0, 0);
    cylinder_001Group.add(cylinder_001);
  }
  cylinder_001Group.position.set(-30.709, 1.0416, -7.1816);
  const cube_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_003Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube_003 = new THREE.Mesh(cube_003Geometry, ColoumnPlateMaterial);
    cube_003.scale.set(0.7, 0.0759, 0.7);
    cube_003.position.set(6.0 * i, 0, 0);
    cube_003Group.add(cube_003);
  }
  cube_003Group.position.set(-30.709, 5.8089, -7.1816);
  const cylinder_003Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_003Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_003 = new THREE.Mesh(
      cylinder_003Geometry,
      ColoumnPlateMaterial,
    );
    cylinder_003.scale.set(0.55, 0.3036, 0.55);
    cylinder_003.position.set(6.0 * i, 0, 0);
    cylinder_003Group.add(cylinder_003);
  }
  cylinder_003Group.position.set(-30.709, 5.47, -7.1816);
  const cylinder_004Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_004Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_004 = new THREE.Mesh(cylinder_004Geometry, BrassMaterial);
    cylinder_004.scale.set(0.6, 0.1363, 0.6);
    cylinder_004.position.set(6.0 * i, 0, 0);
    cylinder_004Group.add(cylinder_004);
  }
  cylinder_004Group.position.set(-30.709, 5.4668, -7.1816);
  const torus_001Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_001Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_001 = new THREE.Mesh(torus_001Geometry, BrassMaterial);
    torus_001.scale.set(0.5, 0.5, 0.5233);
    torus_001.position.set(6.0 * i, 0, 0);
    torus_001Group.add(torus_001);
  }
  torus_001Group.setRotation(1.5708, 0.0, 0.0);
  torus_001Group.position.set(-30.709, 1.0461, -7.1816);
  const torus_002Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_002Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_002 = new THREE.Mesh(torus_002Geometry, BrassMaterial);
    torus_002.scale.set(0.52, 0.52, 0.5233);
    torus_002.position.set(6.0 * i, 0, 0);
    torus_002Group.add(torus_002);
  }
  torus_002Group.setRotation(1.5708, 0.0, 0.0);
  torus_002Group.position.set(-30.709, 5.7037, -7.1816);
  const torus_003Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_003Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_003 = new THREE.Mesh(torus_003Geometry, BrassMaterial);
    torus_003.scale.set(0.52, 0.52, 0.2641);
    torus_003.position.set(6.0 * i, 0, 0);
    torus_003Group.add(torus_003);
  }
  torus_003Group.setRotation(1.5708, 0.0, 0.0);
  torus_003Group.position.set(-30.709, 5.307, -7.1816);
  const cube_floor_centralGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_central = new THREE.Mesh(
    cube_floor_centralGeometry,
    Floor_CentralMaterial,
  );
  cube_floor_central.position.set(24.3999, 0.5684, -0.0);
  cube_floor_central.scale.set(56.1089, 0.2965, 6.3485);

  const cube_floor_columnsGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_columns = new THREE.Mesh(
    cube_floor_columnsGeometry,
    Floor_ColumnsMaterial,
  );
  cube_floor_columns.scale.set(65.4645, 0.2965, 2.497);
  const cube_floor_columnsMZ = cube_floor_columns.clone();
  cube_floor_columns.position.set(0, 0, -8.8396);
  cube_floor_columnsMZ.position.set(0, 0, 8.8396);
  cube_floor_columns.setRotation(0.0, 0.0, -0.0);
  cube_floor_columnsMZ.setRotation(0.0, -0.0, -0.0);
  const cube_floor_columnsMirroredZ = new THREE.Group();
  cube_floor_columnsMirroredZ.add(cube_floor_columns, cube_floor_columnsMZ);
  cube_floor_columnsMirroredZ.position.set(15.9462, 0.5578, 0);
  const cube_stripesGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripesGroup = new THREE.Group();
  for (var i = 0; i < 55; i++) {
    const cube_stripes = new THREE.Mesh(
      cube_stripesGeometry,
      Floor_StripesMaterial,
    );
    cube_stripes.scale.set(0.4256, 0.0239, 0.1614);
    cube_stripes.position.set(1.7023 * i, 0, 0);
    cube_stripesGroup.add(cube_stripes);
  }
  cube_stripesGroup.position.set(-31.3272, 0.8634, -4.7543);
  const cube_floor_sidedGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_sided = new THREE.Mesh(
    cube_floor_sidedGeometry,
    Floor_Sides_1Material,
  );
  cube_floor_sided.scale.set(50.6075, 0.2965, 0.2803);
  const cube_floor_sidedMZ = cube_floor_sided.clone();
  cube_floor_sided.position.set(0, 0, -11.612);
  cube_floor_sidedMZ.position.set(0, 0, 11.612);
  cube_floor_sided.setRotation(0.0, 0.0, -0.0);
  cube_floor_sidedMZ.setRotation(0.0, -0.0, -0.0);
  const cube_floor_sidedMirroredZ = new THREE.Group();
  cube_floor_sidedMirroredZ.add(cube_floor_sided, cube_floor_sidedMZ);
  cube_floor_sidedMirroredZ.position.set(0.3561, 0.5394, 0);
  const cube_floor_trainssideGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_trainsside = new THREE.Mesh(
    cube_floor_trainssideGeometry,
    Floor_CentralMaterial,
  );
  cube_floor_trainsside.scale.set(51.4855, 0.2965, 1.7465);
  const cube_floor_trainssideMZ = cube_floor_trainsside.clone();
  cube_floor_trainsside.position.set(0, 0, -13.6124);
  cube_floor_trainssideMZ.position.set(0, 0, 13.6124);
  cube_floor_trainsside.setRotation(0.0, 0.0, -0.0);
  cube_floor_trainssideMZ.setRotation(0.0, -0.0, -0.0);
  const cube_floor_trainssideMirroredZ = new THREE.Group();
  cube_floor_trainssideMirroredZ.add(
    cube_floor_trainsside,
    cube_floor_trainssideMZ,
  );
  cube_floor_trainssideMirroredZ.position.set(-0.5219, 0.5684, 0);
  const cube_stripes_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_001Group = new THREE.Group();
  for (var i = 0; i < 83; i++) {
    const cube_stripes_001 = new THREE.Mesh(
      cube_stripes_001Geometry,
      Floor_StripesMaterial,
    );
    cube_stripes_001.scale.set(0.4667, 0.0239, 0.1338);
    cube_stripes_001.position.set(1.2135 * i, 0, 0);
    cube_stripes_001Group.add(cube_stripes_001);
  }
  cube_stripes_001Group.position.set(-49.0516, 0.8519, -13.6124);
  const cylinder_stripe_dotsGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_stripe_dotsGroup = new THREE.Group();
  for (var i = 0; i < 82; i++) {
    const cylinder_stripe_dots = new THREE.Mesh(
      cylinder_stripe_dotsGeometry,
      WhiteDotsMaterial,
    );
    cylinder_stripe_dots.scale.set(0.131, 0.0041, 0.131);
    cylinder_stripe_dots.position.set(1.2134 * i, 0, 0);
    cylinder_stripe_dotsGroup.add(cylinder_stripe_dots);
  }
  cylinder_stripe_dotsGroup.position.set(-48.4447, 0.8683, -13.6124);
  const cube_stripes_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_002Group = new THREE.Group();
  for (var i = 0; i < 55; i++) {
    const cube_stripes_002 = new THREE.Mesh(
      cube_stripes_002Geometry,
      Floor_StripesMaterial,
    );
    cube_stripes_002.scale.set(0.4256, 0.0239, 0.1614);
    cube_stripes_002.position.set(1.7023 * i, 0, 0);
    cube_stripes_002Group.add(cube_stripes_002);
  }
  cube_stripes_002Group.position.set(-31.3272, 0.8634, 4.7543);
  const cylinder_002Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_002Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_002 = new THREE.Mesh(cylinder_002Geometry, ColoumnMaterial);
    cylinder_002.scale.set(0.5, 2.5, 0.5);
    cylinder_002.position.set(6.0 * i, 0, 0);
    cylinder_002Group.add(cylinder_002);
  }
  cylinder_002Group.position.set(-30.709, 3.2961, 7.171);
  const cube_stripes_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_003Group = new THREE.Group();
  for (var i = 0; i < 83; i++) {
    const cube_stripes_003 = new THREE.Mesh(
      cube_stripes_003Geometry,
      Floor_StripesMaterial,
    );
    cube_stripes_003.scale.set(0.4667, 0.0239, 0.1338);
    cube_stripes_003.position.set(1.2135 * i, 0, 0);
    cube_stripes_003Group.add(cube_stripes_003);
  }
  cube_stripes_003Group.position.set(-49.0516, 0.8519, 13.6124);
  const cylinder_stripe_dots_001Geometry = new THREE.CylinderGeometry(
    1,
    1,
    2,
    32,
  );
  const cylinder_stripe_dots_001Group = new THREE.Group();
  for (var i = 0; i < 82; i++) {
    const cylinder_stripe_dots_001 = new THREE.Mesh(
      cylinder_stripe_dots_001Geometry,
      WhiteDotsMaterial,
    );
    cylinder_stripe_dots_001.scale.set(0.131, 0.0041, 0.131);
    cylinder_stripe_dots_001.position.set(1.2134 * i, 0, 0);
    cylinder_stripe_dots_001Group.add(cylinder_stripe_dots_001);
  }
  cylinder_stripe_dots_001Group.position.set(-48.4447, 0.8683, 13.6124);
  const cylinder_005Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_005Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_005 = new THREE.Mesh(
      cylinder_005Geometry,
      ColoumnPlateMaterial,
    );
    cylinder_005.scale.set(0.55, 0.2319, 0.55);
    cylinder_005.position.set(6.0 * i, 0, 0);
    cylinder_005Group.add(cylinder_005);
  }
  cylinder_005Group.position.set(-30.709, 1.0416, 7.1711);
  const torus_004Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_004Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_004 = new THREE.Mesh(torus_004Geometry, BrassMaterial);
    torus_004.scale.set(0.5, 0.5, 0.5233);
    torus_004.position.set(6.0 * i, 0, 0);
    torus_004Group.add(torus_004);
  }
  torus_004Group.setRotation(1.5708, 0.0, 0.0);
  torus_004Group.position.set(-30.709, 1.0461, 7.1657);
  const cylinder_006Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_006Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_006 = new THREE.Mesh(
      cylinder_006Geometry,
      ColoumnPlateMaterial,
    );
    cylinder_006.scale.set(0.55, 0.3036, 0.55);
    cylinder_006.position.set(6.0 * i, 0, 0);
    cylinder_006Group.add(cylinder_006);
  }
  cylinder_006Group.position.set(-30.709, 5.47, 7.1711);
  const torus_005Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_005Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_005 = new THREE.Mesh(torus_005Geometry, BrassMaterial);
    torus_005.scale.set(0.52, 0.52, 0.2641);
    torus_005.position.set(6.0 * i, 0, 0);
    torus_005Group.add(torus_005);
  }
  torus_005Group.setRotation(1.5708, 0.0, 0.0);
  torus_005Group.position.set(-30.709, 5.307, 7.1655);
  const cylinder_007Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_007Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cylinder_007 = new THREE.Mesh(cylinder_007Geometry, BrassMaterial);
    cylinder_007.scale.set(0.6, 0.1363, 0.6);
    cylinder_007.position.set(6.0 * i, 0, 0);
    cylinder_007Group.add(cylinder_007);
  }
  cylinder_007Group.position.set(-30.709, 5.4668, 7.1711);
  const cube_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_001Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const cube_001 = new THREE.Mesh(cube_001Geometry, ColoumnPlateMaterial);
    cube_001.scale.set(0.7, 0.0759, 0.7);
    cube_001.position.set(6.0 * i, 0, 0);
    cube_001Group.add(cube_001);
  }
  cube_001Group.position.set(-30.709, 5.8089, 7.1711);
  const torus_006Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_006Group = new THREE.Group();
  for (var i = 0; i < 12; i++) {
    const torus_006 = new THREE.Mesh(torus_006Geometry, BrassMaterial);
    torus_006.scale.set(0.52, 0.52, 0.5233);
    torus_006.position.set(6.0 * i, 0, 0);
    torus_006Group.add(torus_006);
  }
  torus_006Group.setRotation(1.5708, 0.0, 0.0);
  torus_006Group.position.set(-30.709, 5.7037, 7.1711);
  const cube_stripes_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_004Group = new THREE.Group();
  for (var i = 0; i < 6; i++) {
    const cube_stripes_004 = new THREE.Mesh(
      cube_stripes_004Geometry,
      Floor_StripesMaterial,
    );
    cube_stripes_004.scale.set(0.4256, 0.0239, 0.1614);
    cube_stripes_004.position.set(1.7023 * i, 0, 0);
    cube_stripes_004Group.add(cube_stripes_004);
  }
  cube_stripes_004Group.setRotation(0.0, -1.5708, 0.0);
  cube_stripes_004Group.position.set(61.7731, 0.8634, -4.236);
  const cube_backwallGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_backwall = new THREE.Mesh(
    cube_backwallGeometry,
    FloorTileMaterial,
  );
  cube_backwall.position.set(-40.9615, 5.4803, -0.0);
  cube_backwall.scale.set(9.4309, 4.626, 8.2679);

  const cube_backwall_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_backwall_005 = new THREE.Mesh(
    cube_backwall_005Geometry,
    FloorTileMaterial,
  );
  cube_backwall_005.position.set(-50.9049, 5.7355, -0.0);
  cube_backwall_005.scale.set(1.3866, 13.2495, 26.3803);

  const cube_platform_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_002 = new THREE.Mesh(
    cube_platform_002Geometry,
    FloorTileMaterial,
  );
  cube_platform_002.position.set(131.9431, 4.9485, -9.36);
  cube_platform_002.scale.set(18.8583, 9.1838, 10.2647);
  cube_platform_002.setRotation(0.0, 0.6632, 0.0);

  const cube_platform_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_003 = new THREE.Mesh(
    cube_platform_003Geometry,
    FloorTileMaterial,
  );
  cube_platform_003.position.set(143.1654, 4.9485, -31.787);
  cube_platform_003.scale.set(18.8583, 9.1838, 10.2647);
  cube_platform_003.setRotation(0.0, 1.5708, 0.0);

  const cube_platform_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_004 = new THREE.Mesh(
    cube_platform_004Geometry,
    FloorTileMaterial,
  );
  cube_platform_004.position.set(143.1654, 17.1768, -54.3248);
  cube_platform_004.scale.set(4.524, 20.7624, 13.0694);
  cube_platform_004.setRotation(0.0, 1.5708, 0.0);

  const cube_platform_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_006 = new THREE.Mesh(
    cube_platform_006Geometry,
    FloorTileMaterial,
  );
  cube_platform_006.position.set(126.4892, 16.2657, -16.3414);
  cube_platform_006.scale.set(8.1106, 9.1838, -1.4964);
  cube_platform_006.setRotation(0.0, 0.6632, 0.0);

  const cube_platform_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_007 = new THREE.Mesh(
    cube_platform_007Geometry,
    FloorTileMaterial,
  );
  cube_platform_007.position.set(132.2996, 16.3831, -27.0969);
  cube_platform_007.scale.set(6.4677, 9.1838, -2.1092);
  cube_platform_007.setRotation(0.0, 1.5708, 0.0);

  const cube_platform_008Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_platform_008 = new THREE.Mesh(
    cube_platform_008Geometry,
    FloorTileMaterial,
  );
  cube_platform_008.position.set(4.2305, 17.1768, -40.2182);
  cube_platform_008.scale.set(9.9024, 57.1623, 45.22);
  cube_platform_008.setRotation(0.0, 1.5708, 0.0);

  const cube_coloumnsupper_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_coloumnsupper_001 = new THREE.Mesh(
    cube_coloumnsupper_001Geometry,
    Floor_ColumnsMaterial,
  );
  cube_coloumnsupper_001.scale.set(42.5516, 0.1921, 0.7246);
  const cube_coloumnsupper_001MZ = cube_coloumnsupper_001.clone();
  cube_coloumnsupper_001.position.set(0, 0, -6.1536);
  cube_coloumnsupper_001MZ.position.set(0, 0, 6.1536);
  cube_coloumnsupper_001.setRotation(0.0, 0.0, -0.0);
  cube_coloumnsupper_001MZ.setRotation(0.0, -0.0, -0.0);
  const cube_coloumnsupper_001MirroredZ = new THREE.Group();
  cube_coloumnsupper_001MirroredZ.add(
    cube_coloumnsupper_001,
    cube_coloumnsupper_001MZ,
  );
  cube_coloumnsupper_001MirroredZ.position.set(10.4587, 7.0259, 0);
  const cube_coloumnsupper_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_coloumnsupper_002 = new THREE.Mesh(
    cube_coloumnsupper_002Geometry,
    Floor_ColumnsMaterial,
  );
  cube_coloumnsupper_002.scale.set(42.5516, 0.1921, 0.7246);
  const cube_coloumnsupper_002MZ = cube_coloumnsupper_002.clone();
  cube_coloumnsupper_002.position.set(0, 0, -6.124);
  cube_coloumnsupper_002MZ.position.set(0, 0, 6.124);
  cube_coloumnsupper_002.setRotation(-0.7258, 0.0, 0.0);
  cube_coloumnsupper_002MZ.setRotation(0.7258, -0.0, 0.0);
  const cube_coloumnsupper_002MirroredZ = new THREE.Group();
  cube_coloumnsupper_002MirroredZ.add(
    cube_coloumnsupper_002,
    cube_coloumnsupper_002MZ,
  );
  cube_coloumnsupper_002MirroredZ.position.set(10.4587, 6.5967, 0);
  const cube_coloumnsupper_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_coloumnsupper_003 = new THREE.Mesh(
    cube_coloumnsupper_003Geometry,
    Floor_ColumnsMaterial,
  );
  cube_coloumnsupper_003.scale.set(42.5516, 0.1921, 0.7246);
  const cube_coloumnsupper_003MZ = cube_coloumnsupper_003.clone();
  cube_coloumnsupper_003.position.set(0, 0, -7.1651);
  cube_coloumnsupper_003MZ.position.set(0, 0, 7.1651);
  cube_coloumnsupper_003.setRotation(0.0, 0.0, -0.0);
  cube_coloumnsupper_003MZ.setRotation(0.0, -0.0, -0.0);
  const cube_coloumnsupper_003MirroredZ = new THREE.Group();
  cube_coloumnsupper_003MirroredZ.add(
    cube_coloumnsupper_003,
    cube_coloumnsupper_003MZ,
  );
  cube_coloumnsupper_003MirroredZ.position.set(10.4587, 6.0642, 0);
  const out = new THREE.Group();
  out.add(
    cube_image,
    cube_border,
    cube_border_001,
    cube_border_002,
    cube_smallroof_tileGroup,
    cube_smallroof_tile_005Group,
    cube_smallroof_tile_004Group,
    cube_smallroof_tile_003Group,
    cube_smallroof_tile_002Group,
    cube_smallroof_tile_001Group,
    cube_smallroof_tile_006Group,
    cube_smallroof_tile_007Group,
    cube_smallroof_tile_008Group,
    cube_smallroof_tile_009Group,
    cube_smallroof_tile_010Group,
    cube_smallroof_tile_011Group,
    cube_smallroof_tile_012Group,
    cube_smallroof_tile_013Group,
    cube_smallroof_tile_014Group,
    cube_smallroof_tile_015Group,
    cube_smallroof_tile_016Group,
    cube_smallroof_tile_017Group,
    cube_smallroof_tile_018Group,
    cube_smallroof_tile_019Group,
    cube_smallroof_tile_020Group,
    cube_smallroof_tile_021Group,
    cube_smallroof_tile_022Group,
    cube_smallroof_tile_023Group,
    cube_smallroof_tile_024,
    cube_smallroof_tile_025,
    cube_smallroof_tile_026,
    cube_smallroof_tile_027,
    cube_smallroof_tile_028,
    cube_smallroof_tile_029,
    cube_smallroof_tile_030Group,
    cube_smallroof_tile_031Group,
    cubeGroup,
    cube_002Group,
    cube_004Group,
    cube_005Group,
    cube_006Group,
    cube_007Group,
    cube_008,
    cube_009,
    cube_011Group,
    cube_012Group,
    cube_013Group,
    cube_015Group,
    cube_016Group,
    cube_017Group,
    cube_018Group,
    cube_019Group,
    cube_020,
    cube_021Group,
    cube_022Group,
    cube_010Group,
    cube_023Group,
    cube_024Group,
    cube_025Group,
    cube_026Group,
    cube_027Group,
    cube_028Group,
    cube_029Group,
    cube_030Group,
    cube_031Group,
    cube_032Group,
    cube_033Group,
    cube_034Group,
    cube_035Group,
    cube_036Group,
    cube_037Group,
    cube_038MirroredZ,
    cube_039MirroredZ,
    cube_040MirroredZ,
    cube_070Group,
    cube_071Group,
    cube_092MirroredZ,
    cube_bigroofMirroredZ,
    cube_bigroof_004MirroredZ,
    cube_stairs_005Group,
    cube_escfloor_011,
    cube_handrail_014MirroredZ,
    cube_handrail_013MirroredZ,
    cylinder_handrail_020MirroredZ,
    cylinder_handrail_019MirroredZ,
    cylinder_handrail_018MirroredZ,
    cube_handrail_012MirroredZ,
    cylinder_handrail_017MirroredZ,
    cube_escfloor_010,
    cube_041,
    cube_042,
    cube_043MirroredZ,
    cube_044MirroredZ,
    cube_045,
    cube_046,
    cube_047,
    cylinder_008,
    cylinder_009,
    cylinder_010,
    cube_048,
    cube_049,
    cube_050MirroredX,
    cube_051MirroredZ,
    cube_052MirroredZ,
    cube_053MirroredZ,
    cylinder_011,
    cube_054,
    cube_055,
    cube_056,
    cube_057,
    cube_058,
    cube_059,
    cube_060,
    cube_061,
    cube_062,
    cube_063,
    cube_064,
    cube_065,
    cylinder_012,
    cube_066Group,
    cube_067Group,
    cube_068Group,
    cube_069Group,
    cube_072MirroredZ,
    cube_073MirroredZ,
    cube_074MirroredZ,
    cube_075MirroredZ,
    cube_076MirroredZ,
    cube_077Group,
    cube_078Group,
    cube_079Group,
    cube_080Group,
    cube_081Group,
    cube_082Group,
    cube_083Group,
    cube_084Group,
    cube_085Group,
    cube_086Group,
    cube_087Group,
    cube_088Group,
    cube_089Group,
    cube_090Group,
    cube_091Group,
    cube_093Group,
    cube_094Group,
    cube_095Group,
    cube_096Group,
    cube_097Group,
    cube_098Group,
    cube_099Group,
    cube_100Group,
    cube_101Group,
    cube_102Group,
    cube_103Group,
    cube_104Group,
    cube_105Group,
    cube_106Group,
    cylinderGroup,
    cylinder_001Group,
    cube_003Group,
    cylinder_003Group,
    cylinder_004Group,
    torus_001Group,
    torus_002Group,
    torus_003Group,
    cube_floor_central,
    cube_floor_columnsMirroredZ,
    cube_stripesGroup,
    cube_floor_sidedMirroredZ,
    cube_floor_trainssideMirroredZ,
    cube_stripes_001Group,
    cylinder_stripe_dotsGroup,
    cube_stripes_002Group,
    cylinder_002Group,
    cube_stripes_003Group,
    cylinder_stripe_dots_001Group,
    cylinder_005Group,
    torus_004Group,
    cylinder_006Group,
    torus_005Group,
    cylinder_007Group,
    cube_001Group,
    torus_006Group,
    cube_stripes_004Group,
    cube_backwall,
    cube_backwall_005,
    cube_platform_002,
    cube_platform_003,
    cube_platform_004,
    cube_platform_006,
    cube_platform_007,
    cube_platform_008,
    cube_coloumnsupper_001MirroredZ,
    cube_coloumnsupper_002MirroredZ,
    cube_coloumnsupper_003MirroredZ,
  );

  //#region
  const help = new THREE.AxesHelper(10);
  out.add(help);
  return out;
  //#endregion
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
