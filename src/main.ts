import * as THREE from "./types";

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

var tick: number = 0;

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

var sceneexist: boolean | undefined = undefined;

// balon begin
var WC = 700,
  HC = 700;
var F: boolean = true;
var scene: THREE.Scene = new THREE.Scene();
var camera: THREE.Camera;
var renderer: THREE.WebGLRenderer;
var controls: THREE.OrbitControls;
var X = 0,
  Y = 0,
  Z = 0,
  W = 1;

var Marsianka: THREE.Object3D;
// balon end

function main() {
  // balon begin
  if (tick == 0) {
    if (typeof sceneexist == "undefined") {
      OpenCanvas("wCanvas", WC, HC);
      CreateScene(WC, HC);

      Marsianka = DrawMarsianka();
      Marsianka.position.set(X, Y, Z);
      Marsianka.scale.set(W, W, W);
      scene.add(Marsianka);

      render();
    }
  }

  F = true;
  restart(20);
  // balon end
}
main();

// balon begin
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
  Marsianka.rotateZ(0.01);
}

function DrawMarsianka() {
  function DrawMan() {
    var Man = new THREE.Group();
    var skinMan = new THREE.MeshLambertMaterial({ color: 0xfad2b0 });
    var costum_mat = new THREE.MeshLambertMaterial({ color: 0xa0522d });
    var glaz_mat = new THREE.MeshLambertMaterial({ color: 0xffffe0 });
    var red_mat = new THREE.MeshLambertMaterial({ color: 0xdc143c });
    var black_mat = new THREE.MeshLambertMaterial({ color: 0x000000 });

    var telo_geom = new THREE.SphereGeometry(1, 15, 10);
    var telo = new THREE.Mesh(telo_geom, skinMan);
    telo.position.set(0, 0, 0);

    var costum_geom = new THREE.CylinderGeometry(1, 0.6, 2.5, 16);
    var costum1_geom = new THREE.CylinderGeometry(0.6, 0.2, 0.5, 16);
    var costum = new THREE.Mesh(costum_geom, costum_mat);
    var costum1 = new THREE.Mesh(costum1_geom, costum_mat);
    costum.position.set(0, 0, 1.5);
    costum.rotateX(-PI / 2);
    costum1.position.set(0, 0, 3);
    costum1.rotateX(-PI / 2);
    var Corpus = new THREE.Group();
    Corpus.add(telo, costum, costum1);
    /////////////////////////////////////////
    var golova_geom = new THREE.SphereGeometry(0.8, 15, 10);
    var golova1_geom = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    var nose_geom = new THREE.SphereGeometry(0.2, 15, 8);
    var nose = new THREE.Mesh(nose_geom, skinMan);
    var golova = new THREE.Mesh(golova_geom, skinMan);
    var golova1 = new THREE.Mesh(golova1_geom, skinMan);
    var rot_geom = new THREE.BoxGeometry(1.2, 0.2, 0.05);
    var rot1 = new THREE.Mesh(rot_geom, black_mat);

    var glaz_geom = new THREE.SphereGeometry(
      0.3,
      15,
      8,
      0,
      PI * 2,
      (2 * PI) / 3,
      PI / 2
    );
    var zrach_geom = new THREE.SphereGeometry(
      0.1,
      15,
      8,
      0,
      PI * 2,
      (2 * PI) / 3,
      PI
    );
    var lglaz = new THREE.Mesh(glaz_geom, glaz_mat);
    var rzrach = new THREE.Mesh(zrach_geom, red_mat);

    nose.position.set(0, -0.8, 4.1);
    nose.scale.set(1.1, 1.1, 2.1);
    nose.rotateX(-PI / 9);
    rzrach.position.set(0.3, -0.73, 4.7);
    rzrach.scale.set(1, 1, 1.5);
    var lzrach = rzrach.clone();
    lzrach.position.set(-0.3, -0.73, 4.7);
    lglaz.position.set(-0.3, -0.48, 4.7);
    lglaz.scale.set(1.2, 1.1, 1.7);
    var rglaz = lglaz.clone();
    rglaz.position.set(0.3, -0.48, 4.7);
    golova1.position.set(0, -0.25, 4.4);
    golova1.scale.set(1.2, 1, 1);
    golova1.rotateX(PI / 2);

    rot1.position.set(0, -0.7, 4);
    var rot = golova.clone();
    rot.position.set(0, -0.55, 4);
    rot.scale.set(1.3, 0.3, 0.3);
    golova.position.set(0, 0, 5);
    golova.scale.set(1.5, 1, 1);

    var HeadMan = new THREE.Group();
    HeadMan.add(golova, golova1, rot, rot1, lglaz, rglaz, rzrach, lzrach, nose);
    HeadMan.position.set(0, 0.2, 0);
    ///////////////////////////////////////////////////////////////////////////
    var sheyi_geom = new THREE.CylinderGeometry(0.2, 0.3, 2, 10);
    var sheyi = new THREE.Mesh(sheyi_geom, skinMan);

    sheyi.position.set(0, 0, 3.7);
    sheyi.rotateX(-PI / 2);
    ///////////////////////////////////////////////////////////////////
    var rykav_geom = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 10);
    var plecho_geom = new THREE.CylinderGeometry(0.2, 0.2, 1.3, 10);
    var systav_geom = new THREE.SphereGeometry(0.2, 10, 8);
    var systavL = new THREE.Mesh(systav_geom, skinMan);
    var plechoL = new THREE.Mesh(plecho_geom, skinMan);
    var rykavL = new THREE.Mesh(rykav_geom, costum_mat);
    rykavL.position.set(-0.7, 0, 2.5);
    rykavL.rotateX(PI / 2);
    rykavL.rotateZ(-PI / 3);
    var rykavR = rykavL.clone();
    rykavR.position.set(0.7, 0, 2.5);
    rykavR.rotateZ((2 * PI) / 3);

    plechoL.rotateX(PI / 2);
    plechoL.rotateZ(-PI / 3);
    plechoL.position.set(-1.5, 0, 2);
    systavL.position.set(-2.1, 0, 1.63);
    var plechoR = plechoL.clone();
    var systavR = systavL.clone();
    plechoR.rotateZ((2 * PI) / 3);
    plechoR.position.set(1.5, 0, 2);
    systavR.position.set(2.1, 0, 1.63);

    var ManHandL = new THREE.Group();
    ManHandL.add(rykavL, plechoL, systavL);

    var ManHandR = new THREE.Group();
    ManHandR.add(rykavR, rykavR, plechoR, systavR);
    /////////////////////////////////////////////////////////
    var shup_geom = new THREE.SphereGeometry(0.2, 10, 8);
    var shup = new THREE.Mesh(shup_geom, skinMan);
    var predplechoL = plechoR.clone();
    var predplechoR = plechoL.clone();
    predplechoL.position.set(-1.5, 0, 1.3);
    predplechoR.position.set(1.5, 0, 1.3);
    shup.position.set(1, 0, 0.8);
    shup.scale.set(1, 1, 1.8);

    var shupL = shup.clone();
    shupL.position.set(-1, 0, 0.8);

    var ManKistL = new THREE.Group();
    var ManKistR = new THREE.Group();
    ManKistR.add(predplechoR, shup);
    ManKistL.add(predplechoL, shupL);
    ////////////////////////////////////////////////////////////
    var noga_geom = new THREE.CylinderGeometry(0.3, 0.2, 3, 10);
    var nogaLF = new THREE.Mesh(noga_geom, skinMan);
    nogaLF.position.set(-0.2, -0.4, -1.4);
    nogaLF.rotateX(PI / 2);
    var shupLF = shup.clone();
    shupLF.position.set(-0.3, -0.53, -2.8);
    shupLF.scale.set(1, 1, 2);
    shupLF.rotateX(PI / 2);
    shupLF.rotateY(-PI / 6);

    var nogaRF = nogaLF.clone();
    nogaRF.position.set(0.2, -0.4, -1.4);
    var shupRF = shupLF.clone();
    shupRF.position.set(0.3, -0.53, -2.8);
    shupRF.rotateY(PI / 3);

    var ManLegLF = new THREE.Group();
    ManLegLF.add(nogaLF, shupLF);

    var ManLegRF = new THREE.Group();
    ManLegRF.add(nogaRF, shupRF);
    /////////////////////////////////////////////////

    Man.add(Corpus);
    Man.add(HeadMan);
    Man.add(sheyi);
    Man.add(ManHandL);
    Man.add(ManHandR);
    Man.add(ManKistL);
    Man.add(ManKistR);
    Man.add(ManLegLF);
    //Man.add(ManLegLB);
    //Man.add(ManLegRB);
    Man.add(ManLegRF);

    Man.position.set(0, 0, 0.11);

    Man.receiveShadow = true;

    var WS = 0.08;
    Man.scale.set(WS, WS, WS);
    var out = new THREE.Object3D();
    out.add(Man);
    return out;
  }

  function DrawWheel() {
    // рисуем колесо
    let WS = 3;
    let materialBlack = new THREE.MeshPhongMaterial({ color: 0x000000 });
    let materialGrey = new THREE.MeshPhongMaterial({ color: 0xb7b0b0 });
    let materialDarkWhite = new THREE.MeshPhongMaterial({ color: 0xd8cac6 });

    var wheel = new THREE.Group();

    let geometry = new THREE.TorusGeometry(0.1, 0.03, 16, 100);
    let tire = new THREE.Mesh(geometry, materialBlack);
    tire.rotateY(PI / 2);
    tire.rotateX(PI / 2);
    wheel.add(tire);

    let geometry1 = new THREE.CylinderGeometry(0.1, 0.1, 0.067, 32);
    let disk = new THREE.Mesh(geometry1, materialDarkWhite);

    let geometry2 = new THREE.CylinderGeometry(0.086, 0.086, 0.069, 32);
    let inDisk = new THREE.Mesh(geometry2, materialGrey);

    let geometry3 = new THREE.SphereGeometry(0.08, 32, 16);
    let diskCenter = new THREE.Mesh(geometry3, materialDarkWhite);
    diskCenter.scale.y = 0.5;
    diskCenter.position.y = -0.01;
    wheel.add(disk, inDisk, diskCenter);
    wheel.scale.set(WS, WS * 1.6, WS);

    let out = new THREE.Object3D();
    out.add(wheel);

    return out;
  }

  var out = new THREE.Object3D();

  const cube_geometry = new THREE.BoxGeometry(4, 2, 0.7);
  const cube_geometry2 = new THREE.BoxGeometry(4.15, 2.15, 0.2);
  const cube_geometry3 = new THREE.BoxGeometry(3.8, 1.8, 0.2);
  const cube_material = new THREE.MeshPhongMaterial({ color: 0xf59042 });
  const cube_material2 = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const cube = new THREE.Mesh(cube_geometry, cube_material);
  const cube2 = new THREE.Mesh(cube_geometry2, cube_material);
  const cube3 = new THREE.Mesh(cube_geometry3, cube_material2);
  cube3.position.z = -0.3;
  out.add(cube);
  out.add(cube2);
  out.add(cube3);

  var kupol = new THREE.Object3D();

  const capsule_geometry = new THREE.SphereGeometry(1, 32, 16);
  const capsule_geometry2 = new THREE.SphereGeometry(1, 4, 16);
  const capsule_material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    depthWrite: false,
    opacity: 0.4,
    transparent: true,
  });
  const geometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
  const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  const black = new THREE.MeshPhongMaterial({ color: 0x000000 });
  const torus = new THREE.Mesh(geometry, material);
  const capsule = new THREE.Mesh(capsule_geometry, capsule_material);
  const capsule2 = new THREE.Mesh(capsule_geometry2, black);
  capsule2.scale.z = 0.01;
  capsule2.position.z = 0.05;
  kupol.add(torus);
  kupol.add(capsule);
  kupol.add(capsule2);
  kupol.scale.y = 0.7;
  kupol.scale.z = 0.5;
  kupol.position.x = 0.38;
  kupol.position.z = 0.35;
  out.add(kupol);

  var lampa = new THREE.Object3D();

  const lamp_geometry = new THREE.SphereGeometry(0.2, 32, 16);
  const lamp_geometry2 = new THREE.TorusGeometry(0.2, 0.05, 16, 100);
  const lamp_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const torus2 = new THREE.Mesh(lamp_geometry2, material);
  const lamp = new THREE.Mesh(lamp_geometry, lamp_material);
  lampa.add(torus2);
  lampa.add(lamp);
  lampa.position.x = -1.5;
  lampa.position.z = 0.35;
  out.add(lampa);

  var fara = new THREE.Object3D();

  const fara_geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
  const fara_material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const farag = new THREE.Mesh(fara_geometry, fara_material);
  const fara_svet_geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 32);
  const fara_svet_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const farag_svet = new THREE.Mesh(fara_svet_geometry, fara_svet_material);
  fara.add(farag);
  fara.add(farag_svet);
  fara.rotateZ(PI / 2);
  fara.position.x = -2.05;
  fara.position.y = -0.7;

  var fara2 = fara.clone();
  fara.position.y = 0.7;

  var fara3 = new THREE.Object3D();

  const fara_geometry2 = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
  const farag2 = new THREE.Mesh(fara_geometry2, fara_material);
  const fara_svet_geometry2 = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 32);
  const fara_svet_material2 = new THREE.MeshBasicMaterial({ color: 0xff1111 });
  const farag_svet2 = new THREE.Mesh(fara_svet_geometry2, fara_svet_material2);
  fara3.add(farag2);
  fara3.add(farag_svet2);
  fara3.rotateZ(PI / 2);
  fara3.position.x = 2.05;
  fara3.position.y = -0.7;

  var fara4 = fara3.clone();
  fara4.position.y = 0.7;

  out.add(fara);
  out.add(fara2);
  out.add(fara3);
  out.add(fara4);

  var krylo = new THREE.Object3D();

  const krylo_geometry = new THREE.CylinderGeometry(
    0.5,
    0.5,
    2.25,
    32,
    1,
    false,
    -PI / 2,
    PI
  );
  const krylog = new THREE.Mesh(krylo_geometry, cube_material);

  const krylo_cube_geometry = new THREE.BoxGeometry(0.99, 2.24, 0.1);
  const krylo_cube = new THREE.Mesh(krylo_cube_geometry, cube_material2);

  krylo.add(krylog);
  krylo.add(krylo_cube);

  krylo.position.z = -0.35;
  krylo.position.x = 1.2;

  var krylo2 = krylo.clone();
  krylo2.position.x = -1.2;

  out.add(krylo);
  out.add(krylo2);

  var wheel1 = DrawWheel();
  wheel1.position.x = 1.2;
  wheel1.position.y = -0.85;
  wheel1.position.z = -0.35;

  var wheel2 = DrawWheel();
  wheel2.position.x = -1.2;
  wheel2.position.y = -0.85;
  wheel2.position.z = -0.35;

  var wheel3 = DrawWheel();
  wheel3.position.x = 1.2;
  wheel3.position.y = 0.85;
  wheel3.position.z = -0.35;
  wheel3.scale.y = -1;

  var wheel4 = DrawWheel();
  wheel4.position.x = -1.2;
  wheel4.position.y = 0.85;
  wheel4.position.z = -0.35;
  wheel4.scale.y = -1;

  out.add(wheel1);
  out.add(wheel2);
  out.add(wheel3);
  out.add(wheel4);

  const hvost_geometry = new THREE.BoxGeometry(0.5, 0.1, 0.6);
  const hvost = new THREE.Mesh(hvost_geometry, cube_material);
  hvost.rotateY(0.4);
  hvost.position.x = 1.75;
  hvost.position.z = 0.5;
  out.add(hvost);

  var man = DrawMan();
  man.rotateZ(-PI / 2);
  man.scale.set(1.2, 1.2, 1.2);
  man.position.z = 0.15;
  man.position.x = 0.38;
  // usik.rotateX(PI/6);

  var usiki = new THREE.Object3D();
  var usikg = new THREE.CylinderGeometry(0.01, 0.01, 3, 32);
  var usik_material = new THREE.MeshPhongMaterial({ color: 0x8a8a8a });
  var usik = new THREE.Mesh(usikg, usik_material);
  usik.rotation.z = (PI / 8) * 3;

  usik.position.z = 1;
  usik.position.x = -3;
  usik.position.y = 0.8;
  usiki.add(usik);
  var usik2 = usik.clone();
  usik2.position.y = -0.8;
  usik2.rotation.z = (-PI / 8) * 3;
  usiki.add(usik2);
  usiki.rotateY(PI / 8);
  usiki.position.z = -1.5;
  out.add(usiki);

  out.add(man);

  return out;
}

function CreateScene(WC: number, HC: number) {
  if (typeof sceneexist == "undefined") {
    sceneexist = true;
    // объявление сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444488);
    camera = new THREE.PerspectiveCamera(30, WC / HC, 1, 1000);
    camera.position.x = 0;
    camera.position.y = -40;
    camera.position.z = 20;
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // привяжем отрисовку к html и высоте канвы
    // renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("wCanvas")?.appendChild(renderer.domElement);
    renderer.setSize(WC, HC);
    // установим модуль управления камерой
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    // источники света
    scene.add(new THREE.AmbientLight(0x555555));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, -2, 4).normalize();
    scene.add(directionalLight);
    directionalLight.position.set(-5, -2, 4).normalize();
    scene.add(directionalLight);

    // balon ignore
    document.body.appendChild( renderer.domElement );
  }
}
// balon end

/*
    {{html
    <!DOCTYPE html>
    <head>
     <script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
     <script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
    </head>
    html}}
  */
