import * as THREE from '../types';

interface RobotData {
  Sonar: THREE.Object3D;
  LineV: THREE.Object3D;
  LineH: THREE.Object3D;
  raycasterV_pos: THREE.Vector3;
  raycasterV_dir: THREE.Vector3;
  raycasterV: THREE.Raycaster;
  intersects: THREE.Intersection[];
  XR: number;
  YR: number;
  AR: number;
  RR: number;
  Timer: number;
  NUMTURN: number;
  V: number;
  ANGLE: number; // используется только тут
  STPX: number; // только тут
  STPY: number; // только тут
  TRESHDIS: number;
  COLV: string;
  V0: number;
  TREEDIS: number;
  CR: number;
  SR: number;
  raycaster_WEB_pos: THREE.Vector3; // откуда запускаем луч
  raycaster_WEB_dir: THREE.Vector3; // вектор, куда запускаем луч
  raycaster_WEB: THREE.Raycaster;
  WEBDX: number;
  WEBDZ: number;
  WEBSIZ: number;
  WEBDIS: Matrix<number>;
  WEBCOL: Matrix<string>;
  Materialcube: Matrix<THREE.Material>;
  TREECOL: string;
  TRESHCOL: string;
  BORDERCOL: '#ff8500' | '#ffbf00';
  //----------BALONIN------LOCAL----
  isBorderTouched: boolean;
  DIS: number;
  FLGV: boolean;
  DISV: number;
  TRESHTimer: number;
  HOMETimer: number;
  HOMESleep: number;
  HOMECOL: string;
  TREESDX: number;
  TRESHSDX: number;
  TRESHANGLE: number;
}

function puts(s: unknown) {
  console.log(s);
}

// eslint-disable-next-line @typescript-eslint/no-unused-lets
function OpenCanvas(_name: string, _WC: number, _HC: number) {
  //
}

const { cos, sin, abs, sign, atan, pow, PI, sqrt, floor } = Math;
function random(_value: number): number {
  return Math.random() * _value;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function zeros(A: number) {
  return new Array(A).fill(null).map(() => new Array(A).fill(0));
}

function ones(A: number) {
  return new Array(A).fill(null).map(() => new Array(A).fill(1));
}

function mulp(M: number[][], val: number) {
  const Mcopy: number[][] = JSON.parse(JSON.stringify(M));
  Mcopy.forEach((N) => N.forEach((X) => (X *= val)));
  return Mcopy;
}

function RGB2HEX(r: number, g: number, b: number) {
  const a = `#${new THREE.Color(r, g, b).getHexString()}`;
  return a;
}

let tick: number = 0;

function tick_tick(): number {
  return setInterval(() => {
    tick += 1;
  }, 16);
}

tick_tick();

export function restart(ms: number) {
  setTimeout(main, ms);
}

THREE.Object3D.prototype.applyMatrix = THREE.Object3D.prototype.applyMatrix4;
let sceneexist: boolean | undefined = undefined;

// balon ignore begin
let X = 0,
  Y = 0,
  Z = 0,
  W = 1;
let F: boolean = true;
// balon ignore end
// РАБОЧЕЕ
// balon setup begin
F = true;
(X = 0), (Y = 0), (Z = 0), (W = 1);
// balon setup end

// balon ignore begin
let WC: number, HC: number;
let scene: THREE.Scene = new THREE.Scene();
let renderer: THREE.WebGLRenderer;
let controls: THREE.OrbitControls;

let Station: THREE.Object3D;

let CleanRobot: THREE.Object3D;
let CleanRobotData: RobotData;

let RobotM: THREE.Object3D;
let RobotMData: RobotData;

let clock: THREE.Clock;

let trains: Array<THREE.Object3D>;
let trainSummaryTime: number;
let trainArriveTime: number;
let trainStayTime: number;

let cameras: Partial<{
  main: THREE.Camera;
  robot: THREE.Camera;
  robotCleaner: THREE.Camera;
  poi: Array<THREE.Camera>;
}>;
let currentCamera: THREE.Camera | undefined;

let wetFloorCtx: CanvasRenderingContext2D;
let wetFloorTex: THREE.CanvasTexture;
let WetFloor: THREE.Object3D;

const helpers: THREE.ArrowHelper[] = [];
let animateDoors = () => {};
let resetAnimateDoors = () => {};
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
      // balon setup
      cameras = {};
      currentCamera = undefined;
      //@ts-expect-error tak nuzhno
      document.ChangeCamera = ChangeCamera;

      CreateScene(WC, HC);
      initParameters();
      initChangeCameraControls();

      //TODO: CreateWEBCAM for each robot
      CreateWEBCAM(
        W * (5 * RobotMData.WEBDX - RobotMData.WEBSIZ / 4),
        -8.1 * W,
        W * 3,
        RobotMData,
      );
      CreateWEBCAM(
        W * (5 * CleanRobotData.WEBDX - CleanRobotData.WEBSIZ / 4),
        -8.1 * W,
        W * 3,
        CleanRobotData,
      );

      Station = DrawStation();
      Station.position.set(X, Y, Z);
      Station.scale.set(W, W, W);
      scene.add(Station);

      RobotM = DrawRobotM();
      RobotM.position.set(X, Y + 1, Z);
      RobotM.rotateX(-PI / 2);
      RobotM.rotateZ(PI / 3);
      RobotM.scale.set(W, W, W);
      scene.add(RobotM);

      CleanRobot = DrawCleanRobot();
      CleanRobot.position.set(X, Y + 1, Z);
      CleanRobot.rotateX(-PI / 2);
      CleanRobot.rotateZ(-PI / 16);
      CleanRobot.scale.set(W, W, W);
      scene.add(CleanRobot);

      WetFloor = DrawWetFloor()!;
      WetFloor.position.set(X, Y, Z);
      WetFloor.scale.set(W, W, W);
      scene.add(WetFloor);

      render();
    }
  }

  F = true;
  // puts(tick);
  restart(20);
  // balon block end
}
main();

// balon block begin
puts(`tick: ${tick}`);
function render() {
  requestAnimationFrame(render);

  if (F) {
    if (RobotMData.V > 0) GetDISbySonarV(RobotMData);
    else RobotMData.LineV.visible = false;
    if (CleanRobotData.V > 0) GetDISbySonarV(CleanRobotData);
    else CleanRobotData.LineV.visible = false;

    F = false;
  }

  controls.update();

  // balon ignore
  animate();
  if (currentCamera) renderer.render(scene, currentCamera);
}
function animate() {
  DisWEBCAM(RobotMData);
  DisWEBCAM(CleanRobotData);
  animateRobot(RobotM, RobotMData);
  animateRobot(CleanRobot, CleanRobotData);
  animateCleanFloor();
  animateWetFloor();
  animateTrains();
}

animate();

function animatorByName(
  animations: {
    type: string;
    vector: THREE.Vector3;
    objectName: string;
    startTime: number;
    time: number;
  }[],
  endtime: number,
  times: number,
) {
  let clock = 0;
  const _startTimes = times;
  const animate = function () {
    if (clock === endtime) {
      times--;
      clock = 0;
    }
    if (!times) return;
    clock++;

    for (const it of animations) {
      if (it.startTime > clock || it.startTime + it.time <= clock) continue;
      const objects = scene.GetObjectsByProperty(
        'name',
        it.objectName,
      ) as THREE.Object3D<THREE.Object3DEventMap>[];
      for (const object of objects) {
        if (it.type === 'position') {
          object.position.lerp(it.vector, (clock - it.startTime) / it.time);
        }
        if (it.type === 'rotation') {
          object.rotation.setFromVector3(
            new THREE.Vector3()
              .setFromEuler(object.rotation)
              .lerp(it.vector, (clock - it.startTime) / it.time),
          );
        }
        if (it.type === 'scale') {
          object.scale.lerp(it.vector, (clock - it.startTime) / it.time);
        }
      }
    }
  };
  const reset = function () {
    clock = 0;
    times = _startTimes;
  };
  return [animate, reset];
}

function animateWetFloor() {
  if (!wetFloorCtx || !wetFloorTex) return;

  const { floor } = WetFloor.userData;
  const boundingBox = new THREE.Box3().setFromObject(floor);
  const size = {
    x: boundingBox.max.x - boundingBox.min.x,
    y: boundingBox.max.z - boundingBox.min.z,
  };

  const pos = floor.position;
  const { imageSize } = floor.userData;

  const x =
    (((RobotMData as RobotData).XR - pos.x) / size.x + 0.5) * imageSize.x;
  const y =
    (((RobotMData as RobotData).YR - pos.z) / size.y + 0.5) * imageSize.y;

  wetFloorCtx.fillStyle = '#0000ff';
  wetFloorCtx.beginPath();
  wetFloorCtx.arc(x, y, 20, 0, PI * 2);
  wetFloorCtx.closePath();
  wetFloorCtx.fill();

  wetFloorTex.needsUpdate = true;
}

function animateCleanFloor() {
  if (!wetFloorCtx || !wetFloorTex) return;
  const { floor } = WetFloor.userData;
  const boundingBox = new THREE.Box3().setFromObject(floor);
  const size = {
    x: boundingBox.max.x - boundingBox.min.x,
    y: boundingBox.max.z - boundingBox.min.z,
  };

  const pos = floor.position;
  const { imageSize } = floor.userData;

  const x = ((CleanRobotData.XR - pos.x) / size.x + 0.5) * imageSize.x;
  const y = ((CleanRobotData.YR - pos.z) / size.y + 0.5) * imageSize.y;

  const style = '#ffff00';
  const w = 20;

  wetFloorCtx.fillStyle = style;
  wetFloorCtx.beginPath();
  wetFloorCtx.arc(x, y, w, 0, PI * 2);
  wetFloorCtx.closePath();
  wetFloorCtx.fill();
  wetFloorTex.needsUpdate = true;
}

function animateTrains() {
  const EPS = 100; // in milliseconds
  const current = tick % trainSummaryTime; //Текущее время цикла

  const isArrived = current > trainArriveTime;
  const isStay =
    trainArriveTime < current && current <= trainArriveTime + trainStayTime;

  if (!trains || trains.length === 0) {
    DrawTrains();
  }

  if (current < EPS) {
    // Если начался новый цикл
    // RemoveTrainsFromScene(); // Удалить текущие поезда со сцены
    MoveTrainsToStart();
    // DrawTrains(); // Пересоздать поезда
    AddTrainsToScene(); // Добавить поезда на сцену
  }

  for (const train of trains) {
    if (!train.userData.startPos) {
      console.error(
        `У поезда ${train.id} нет стартовой позиции. Cм: userData.startPos`,
      );
      return;
    }
    if (!train.userData.arrivePos) {
      console.error(
        `У поезда ${train.id} нет позиции прибытия. Cм: userData.arrivePos`,
      );
      return;
    }
    if (!train.userData.endPos) {
      console.error(`У поезда ${train.id} нет userData.endPos`);
      return;
    }

    //console.log(train.position);

    if (!isArrived)
      // Поезд приезжает
      // Передвижение из туннеля к платформе
      train.position.lerpVectors(
        train.userData.startPos,
        train.userData.arrivePos,
        easeOutQuad(current / trainArriveTime),
      );
    else if (!isStay)
      // Поезд уезжает
      // Движение от платформы к следующей станции
      train.position.lerpVectors(
        train.userData.arrivePos,
        train.userData.endPos,
        easeInQuad(
          (current - trainArriveTime - trainStayTime) /
            (trainSummaryTime - trainArriveTime - trainStayTime),
        ),
      );
    if (isStay) {
      animateDoors();
    }
  }

  function MoveTrainsToStart() {
    trains.forEach((train) => {
      const { x, y, z } = train.userData.startPos;
      train.position.set(x, y, z);
      resetAnimateDoors();
    });
  }

  function DrawTrains() {
    const trainCreationData: Array<{
      startPos: THREE.Vector3;
      arrivePos: THREE.Vector3;
      endPos: THREE.Vector3;
    }> = [
      {
        startPos: new THREE.Vector3(150, -1, -18.604),
        arrivePos: new THREE.Vector3(-20, -1, -18.604),
        endPos: new THREE.Vector3(-250, -1, -18.604),
      },
      {
        startPos: new THREE.Vector3(-150, -1, 18.604),
        arrivePos: new THREE.Vector3(-20, -1, 18.604),
        endPos: new THREE.Vector3(250, -1, 18.604),
      },
    ];

    trains = trainCreationData.map((data) => {
      const { startPos } = data;

      const train = DrawTrain();
      train.userData = data;
      {
        const { x, y, z } = startPos;
        train.position.set(x, y, z);
      }
      return train;
    });
  }

  function AddTrainsToScene() {
    trains.forEach((train) => scene.add(train));
  }

  function easeOutQuad(t: number, b: number = 0, c: number = 1, d: number = 1) {
    return -c * (t /= d) * (t - 2) + b;
  }

  function easeInQuad(t: number, b: number = 0, c: number = 1, d: number = 1) {
    return c * (t /= d) * t + b;
  }
}

function animateRobot(robotObj: THREE.Object3D, robotData: RobotData) {
  // ГЛОНАС ДАТЧИК
  robotData.XR = robotObj.position.x;
  robotData.YR = robotObj.position.z;
  robotData.AR = abs(robotObj.rotation.y);
  if (robotData.AR > 2 * PI) robotData.AR -= 2 * PI;
  robotData.RR = sqrt(pow(robotData.XR - X, 2) + pow(robotData.YR - Y, 2));

  // ОПРОС ВЕБКАМЕРЫ
  // DisWEBCAM(); // LineH.rotation.z=sin(0.8*tick);
  // РЕФЛЕКСЫ
  switch (true) {
    case robotData.isBorderTouched: //КАСАНИЕ ГРАНИЦЫ
      // См. https://www.desmos.com/calculator/rgjllht2hk
      const multiplier = 50; // m_ult;
      const worldOrigin = new THREE.Vector3(20, 0, 0); // O

      const robotForward = new THREE.Vector3(
        cos(robotObj.rotation.z),
        0,
        -sin(robotObj.rotation.z),
      );

      const toCenterVec = worldOrigin.sub(robotObj.position.clone());

      const randomDirection = new THREE.Vector3(
        random(1),
        0,
        random(1),
      ).normalize();

      const D = robotObj.position.clone().distanceTo(worldOrigin) / multiplier;
      randomDirection.add(toCenterVec.multiplyScalar(D));

      const deltaInRadians = robotForward
        .clone()
        .setComponent(1, 0)
        .angleTo(randomDirection);

      robotObj.rotateZ(deltaInRadians);
      robotData.isBorderTouched = false;
      break;
    // МАНЕВР ПОВОРОТА
    case tick - robotData.Timer <= robotData.NUMTURN:
      robotObj.rotation.y -= robotData.ANGLE / robotData.NUMTURN;
      robotData.CR = cos(robotObj.rotation.y);
      robotData.SR = sin(robotObj.rotation.y);
      robotData.STPX = robotData.V * robotData.CR;
      robotData.STPY = robotData.V * robotData.SR;
      robotData.TRESHTimer = -10;
      break;
    // МАНЕВР ПОВОРОТА НА МУСОР
    default:
      switch (true) {
        default:
          switch (true) {
            default: // ПЕРЕМЕЩЕНИЕ
              robotData.CR = cos(robotObj.rotation.z);
              robotData.SR = sin(robotObj.rotation.z);
              robotData.STPX = robotData.V * robotData.CR;
              robotData.STPY = robotData.V * -robotData.SR;
              robotObj.position.x = robotObj.position.x + robotData.STPX;
              robotObj.position.z = robotObj.position.z + robotData.STPY;
          }
      }
  }
  // puts(currentCase);

  SetSonarV(robotObj, robotData);
  OutWEBCAM(robotData);
}

function iniDoorsAnimation() {
  return animatorByName(
    [
      {
        type: 'position',
        vector: new THREE.Vector3(1, 0, 0),
        objectName: 'leftDoor',
        startTime: 0,
        time: 100,
      },
      {
        type: 'position',
        vector: new THREE.Vector3(-1, 0, 0),
        objectName: 'rightDoor',
        startTime: 0,
        time: 100,
      },
      {
        type: 'position',
        vector: new THREE.Vector3(0, 0, 0),
        objectName: 'leftDoor',
        startTime: 100,
        time: 100,
      },
      {
        type: 'position',
        vector: new THREE.Vector3(0, 0, 0),
        objectName: 'rightDoor',
        startTime: 100,
        time: 100,
      },
    ],
    300,
    1,
  );
}
function initParameters() {
  clock = new THREE.Clock();

  //@ts-expect-error eto nuzhno
  RobotMData = {};
  //@ts-expect-error eto nuzhno
  CleanRobotData = {};

  iniRobot(RobotMData);
  iniRobot(CleanRobotData);
  iniTrains();
  [animateDoors, resetAnimateDoors] = iniDoorsAnimation();
  IniSonarV(RobotMData);
  IniSonarV(CleanRobotData);
}

function iniRobot(robotData: Partial<RobotData>) {
  robotData.isBorderTouched = false;
  robotData.WEBSIZ = 9; // СТОРОНА МАТРИЦЫ
  robotData.DISV = 0; // Дистанция по вертикали
  robotData.COLV = '#f8ff50'; // Цвет по вертикали
  robotData.FLGV = false; // Флаг дорожки
  robotData.RR = robotData.AR = robotData.XR = robotData.YR = 0; // ГЛОНАС

  robotData.V = robotData.V0 = 0.05; // Скорость
  robotData.STPX = -1;
  robotData.STPY = 0; // Элементарные перемещения
  robotData.Timer = -10; // Переменная реле времени поворота
  robotData.TRESHTimer = -10; // Переменная времени мусора
  // FLAMETimer = -10; // Переменная времени пламени
  robotData.HOMETimer = 100; // Переменная времени желания домой
  robotData.HOMESleep = 2000; // Переменная времени сна
  robotData.NUMTURN = 5; // Число шагов на поворот
  robotData.ANGLE = 0; // Угол поворота корпуса
  // ПАРАМЕТРЫ СИСТЕМЫ ЦЕЛИ
  robotData.HOMECOL = '#fd9412'; // ЦВЕТ ДОРОЖКИ ДОМОЙ
  robotData.TREECOL = '#994422'; // ЦВЕТ ДЕРЕВА

  robotData.BORDERCOL = '#ff8500'; // ЦВЕТ ГРАНИЦЫ ПЕРЕМЕЩЕНИЯ РОБОТА

  // balon ignore
  // У нас и у балонина разные цвета почему-то. Предполагается, что из-за версии
  // balon ignore
  robotData.BORDERCOL = '#ffbf00'; // ЦВЕТ ГРАНИЦЫ ПЕРЕМЕЩЕНИЯ РОБОТА

  robotData.TREEDIS = -100; // ДИСТАНЦИЯ ДО ДЕРЕВА
  robotData.TREESDX = -100; // КООРДИНАТЫ ДЕРЕВА НА ТАБЛО
  robotData.TRESHCOL = '#ffffff'; // ЦВЕТ МУСОРА
  robotData.TRESHDIS = -100; // ДИСТАНЦИЯ ДО МУСОРА
  robotData.TRESHSDX = -100; // КООРДИНАТЫ МУСОРА НА ТАБЛО
  robotData.TRESHANGLE = 0; // КООРДИНАТЫ УГЛА НА ЦЕЛЬ
  // ПАРАМЕТРЫ СИСТЕМЫ ЗРЕНИЯ
  robotData.WEBDIS = mulp(ones(robotData.WEBSIZ), 100); // МАТРИЦА ДИСТАНЦИЙ
  robotData.WEBCOL = zeros(robotData.WEBSIZ); // МАТРИЦА ЦВЕТОВ
  for (let i = 0; i < robotData.WEBSIZ; i++)
    for (let j = 0; j < robotData.WEBSIZ; j++)
      robotData.WEBCOL[i][j] = '#f8ff50';
  robotData.WEBDZ = 0.05; // ШАГ РАЗВЕРТКИ ЛУЧА ПО ВЫСОТЕ
  robotData.WEBDX = 0.1; // ШАГ РАЗВЕРТКИ ЛУЧА ПО ШИРИНЕ
}

function iniTrains() {
  trains = [];
  trainSummaryTime = 800;
  trainArriveTime = 200;
  trainStayTime = 300;
}

function IniSonarV(robotData: Partial<RobotData>) {
  // СОЗДАНИЕ ПЕРЕМЕННЫХ СОНАРА
  robotData.raycasterV_pos = new THREE.Vector3(0, 0, Z + W); // откуда запускаем луч
  robotData.raycasterV_dir = new THREE.Vector3(0, -W, 0); // вектор, куда запускаем луч
  robotData.raycasterV = new THREE.Raycaster(undefined, undefined, 0, 100);

  robotData.intersects = robotData.raycasterV.intersectObjects(scene.children);
}
function GetDISbySonarV(robotData: RobotData) {
  robotData.raycasterV.set(robotData.raycasterV_pos, robotData.raycasterV_dir);
  robotData.intersects = robotData.raycasterV.intersectObjects(
    scene.children,
    true,
  );

  robotData.COLV = '#000000';
  if (robotData.intersects.length > 0) {
    let DISV = robotData.intersects[0].distance;
    if (DISV > 10) DISV = 10;
    robotData.LineV.scale.z = DISV / W;
    robotData.LineV.visible = true;

    const colors = robotData.intersects.map(
      // @ts-expect-error Мы украли это из работающего проекта
      (i) => '#' + i.object.material.color.getHex().toString(16),
    );
    robotData.COLV = colors[0];
    // console.warn(`Цвет снизу: ${COLV}`);

    if (robotData.COLV === robotData.BORDERCOL.toLowerCase()) {
      puts('Коснулся границы');
      robotData.isBorderTouched = true;
    }
    // puts(COLV);
  } else {
    robotData.LineV.visible = false;
  }
}
function SetSonarV(robot: THREE.Object3D, robotData: Partial<RobotData>) {
  if (!robotData || !robotData.raycasterV_pos || !robotData.Sonar) return;
  // ВЫЧИСЛЯЕМ НОВЫЕ КООРДИНАТЫ СОНАРА
  const CR = cos(robot.rotation.z);
  const SR = sin(robot.rotation.z);
  robotData.raycasterV_pos.y = RobotM.position.y;
  robotData.raycasterV_pos.x =
    robot.position.x + (W * robotData.Sonar.position.x * CR) / 3;
  robotData.raycasterV_pos.z =
    robot.position.z + (W * robotData.Sonar.position.x * -SR) / 3;
}

function DisWEBCAM(robotData: RobotData) {
  // ВЫТАЩИМ СРЕДНЮЮ КООРДИНАТУ ДЕРЕВА И МУСОРА ИЗ ТАБЛО
  let N1, N2;
  N1 = N2 = 0;
  let S1, S2;
  S1 = S2 = 0;
  robotData.TREESDX = -100;
  robotData.TREEDIS = 0;
  robotData.TRESHSDX = -100;
  robotData.TRESHDIS = 0;
  for (let i = 0; i < robotData.WEBSIZ; i++)
    for (let j = 0; j < robotData.WEBSIZ; j++) {
      robotData.DIS = robotData.WEBDIS[i][j];
      const Col = robotData.WEBCOL[i][j];
      if (Col == robotData.TREECOL) {
        N1++;
        S1 += j;
        robotData.TREEDIS += robotData.DIS;
      }
      if (Col == robotData.TRESHCOL) {
        N2++;
        S2 += j;
        robotData.TRESHDIS += robotData.DIS;
      }
    }
  if (N1) {
    robotData.TREESDX = S1 / N1;
    robotData.TREEDIS = robotData.TREEDIS / N1; // LineH.scale.x=TREEDIS/W;
  } else robotData.TREEDIS = 100;
  if (N2) {
    robotData.TRESHSDX = S2 / N2;
    robotData.TRESHDIS = robotData.TRESHDIS / N2;
    robotData.LineH.scale.x = robotData.TRESHDIS / W;
  } else robotData.TRESHDIS = 100; // putm(WEBCOL); putm(WEBDIS);
}

function OutWEBCAM(robotData: RobotData) {
  let i, j, Col;
  for (i = 0; i < robotData.WEBSIZ; i++)
    for (j = 0; j < robotData.WEBSIZ; j++) {
      robotData.DIS = robotData.WEBDIS[i][j];
      Col = robotData.WEBCOL[i][j];
      const ColR = floor((parseInt(Col.slice(1, 3), 16) * 5) / robotData.DIS);
      const ColG = floor((parseInt(Col.slice(3, 5), 16) * 5) / robotData.DIS);
      const ColB = floor((parseInt(Col.slice(5, 7), 16) * 5) / robotData.DIS);
      Col = RGB2HEX(ColR, ColG, ColB);
      // Graphcube[i][j].position.z = ColBW / 500;
      // balon ignore
      // @ts-expect-error У балонина работает
      robotData.Materialcube[i][j].color.set(Col);
    }
}

function CreateWEBCAM(
  XC: number,
  YC: number,
  ZC: number,
  robotData: RobotData,
) {
  // ПАРАМЕТРЫ ЛУЧА
  robotData.raycaster_WEB_pos = new THREE.Vector3(0, 0, Z + W); // откуда запускаем луч
  robotData.raycaster_WEB_dir = new THREE.Vector3(W, 0, 0); // вектор, куда запускаем луч
  robotData.raycaster_WEB = new THREE.Raycaster(undefined, undefined, 0, 10);
  robotData.intersects = robotData.raycaster_WEB.intersectObjects(
    scene.children,
  );

  // WEBDX ШАГ РАЗВЕРТКИ ЛУЧА ПО ШИРИНЕ
  // WEBDZ ШАГ РАЗВЕРТКИ ЛУЧА ПО ВЫСОТЕ
  const DX = 5 * robotData.WEBDX;
  const DY = 0.1;
  const DZ = 5 * robotData.WEBDZ;
  const Graphcube = zeros(robotData.WEBSIZ);
  robotData.Materialcube = zeros(robotData.WEBSIZ);
  const geometry = new THREE.BoxGeometry(DX, DY, DZ);
  for (let i = 0; i < robotData.WEBSIZ; i++)
    for (let j = 0; j < robotData.WEBSIZ; j++) {
      robotData.Materialcube[i][j] = new THREE.MeshBasicMaterial({
        color: 0xf8ff50,
      });
      Graphcube[i][j] = new THREE.Mesh(geometry, robotData.Materialcube[i][j]);
      Graphcube[i][j].position.set(XC + DX * j, YC, ZC - DZ * i);
      scene.add(Graphcube[i][j]);
    }
}
function DrawWetFloor() {
  const baseSize = 256;

  const floorGeom = new THREE.BoxGeometry(2, 2, 2);
  const floor = new THREE.Mesh(floorGeom);
  floor.position.set(24.3999, 0.574, -0.0);
  floor.scale.set(56.1089, 0.2965, 6.3485);

  const boundingBox = new THREE.Box3().setFromObject(floor);
  const aspectRatio =
    (boundingBox!.max.x - boundingBox!.min.x) /
    (boundingBox!.max.z - boundingBox!.min.z);
  let image: HTMLImageElement;
  if (aspectRatio < 0)
    image = new Image(baseSize, nearestPowerOf2(baseSize / aspectRatio));
  else image = new Image(baseSize * nearestPowerOf2(aspectRatio), baseSize);

  const canvasEl = document.createElement('canvas');
  canvasEl.width = image.width;
  canvasEl.height = image.height;
  // document.body.append(canvasEl);
  const ctx = canvasEl.getContext('2d');
  if (!ctx) return console.error('Почему-то нет контекста');
  wetFloorCtx = ctx;
  ctx.drawImage(image!, 0, 0);

  ctx.fillStyle = '#ffc920';
  ctx.fillRect(0, 0, image.width, image.height);
  ctx.beginPath();

  wetFloorTex = new THREE.CanvasTexture(canvasEl);

  floor.material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.3902, 0.2623),
    metalness: 0.3,
    roughness: 1,
    metalnessMap: wetFloorTex,
    roughnessMap: wetFloorTex,
  });

  floor.userData = {
    imageSize: { x: image.width, y: image.height },
  };

  const out = new THREE.Object3D();
  out.add(floor);
  out.userData = { floor };
  return out;

  function nearestPowerOf2(n: number) {
    return 1 << (31 - Math.clz32(n));
  }
}
function DrawTrain() {
  const trainLength = 3; //Количество вагонов в поезде

  const originVagon = DrawVagon();
  const boundingBox = new THREE.Box3().setFromObject(originVagon);
  const vagonLength = boundingBox.max.x - boundingBox.min.x;

  const train = new THREE.Object3D();
  for (let i = 0; i < trainLength; i++) {
    const newVagon = originVagon.clone();
    newVagon.position.x = i * (vagonLength + 0.3);
    train.add(newVagon);
  }
  return train;
}
function DrawTrainDoor() {
  const rightDoor = DrawRightDoorFunction();
  rightDoor.scale.set(1.0, 1.0, 1.0);
  rightDoor.setRotation(0.0, 0.0, -0.0);
  const leftDoor = rightDoor.clone();
  leftDoor.updateMatrixWorld(true);
  rightDoor.position.set(0.0, 0, 0);
  leftDoor.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  leftDoor.position.set(-0.0, 0, 0);
  const resultDoor = new THREE.Group();
  resultDoor.add(rightDoor, leftDoor);
  resultDoor.position.set(0, 0.0, 0.0);
  const out = new THREE.Group();
  rightDoor.name = 'rightDoor';
  leftDoor.name = 'leftDoor';
  out.add(resultDoor);
  return out;
}
function DrawRobotM() {
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.0213, 0.0026),
    metalness: 0.8254,
    roughness: 0.8849,
  });
  const Washer_mainMaterialDS = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0228, 0.1325, 0.1523),
    side: THREE.DoubleSide,
    roughness: 0.5,
  });
  const Washer_mainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0228, 0.1325, 0.1523),
    roughness: 0.5,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.5225, 0.0),
  });
  const BrassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7948, 0.7991, 0.0045),
    metalness: 0.9127,
    roughness: 0.1,
  });
  const Floor_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3506, 0.1574, 0.0969),
    metalness: 1.0,
    roughness: 0.5397,
  });
  const cube_108Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1516, 0.8829, 0.4275),
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1467, 0.2457, 0.8),
    roughness: 0.5,
  });
  const Green_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0351, 0.4869, 0.0138),
    roughness: 0.5,
  });
  const Train_blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0343, 0.1009, 0.652),
    roughness: 0.5,
  });

  const cube_038Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_038 = new THREE.Mesh(cube_038Geometry, MetalMaterial);
  cube_038.position.set(0.9393, 0.0739, -0.0005);
  cube_038.scale.set(0.1139, 0.0767, 0.5205);

  const cube_039Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_039 = new THREE.Mesh(cube_039Geometry, MetalMaterial);
  cube_039.position.set(0.7271, 0.1346, -0.0005);
  cube_039.scale.set(0.2689, 0.0901, 0.233);
  cube_039.setRotation(0.3098, 1.5708, 0.0);

  const cylinder_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_008 = new THREE.Mesh(cylinder_008Geometry, ColoumnMaterial);
  cylinder_008.position.set(0.6385, 0.1628, -0.0005);
  cylinder_008.scale.set(0.0746, 0.5291, 0.0746);
  cylinder_008.setRotation(1.5708, 0.0, 0.0);

  const cylinder_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_009 = new THREE.Mesh(
    cylinder_009Geometry,
    Metall_RustMaterial,
  );
  cylinder_009.scale.set(0.1018, 0.0604, 0.1018);
  cylinder_009.setRotation(1.5708, 0.0, 0.0);
  const cylinder_009MZ = cylinder_009.clone();
  cylinder_009MZ.updateMatrixWorld(true);
  cylinder_009.position.set(0, 0, 0.5);
  cylinder_009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_009MZ.position.set(0, 0, -0.5009);
  const cylinder_009MirroredZ = new THREE.Group();
  cylinder_009MirroredZ.add(cylinder_009, cylinder_009MZ);
  cylinder_009MirroredZ.position.set(0.6385, 0.1628, 0);
  const plane_001Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_001 = new THREE.Mesh(plane_001Geometry, Washer_mainMaterialDS);
  plane_001.scale.set(0.0762, 0.089, 0.0743);
  plane_001.setRotation(1.5708, 0.0, -1.3109);
  const plane_001MZ = plane_001.clone();
  plane_001MZ.updateMatrixWorld(true);
  plane_001.position.set(0, 0, 0.0898);
  plane_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_001MZ.position.set(0, 0, -0.0907);
  const plane_001MirroredZ = new THREE.Group();
  plane_001MirroredZ.add(plane_001, plane_001MZ);
  plane_001MirroredZ.position.set(0.563, 0.8232, 0);
  const plane_002Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_002 = new THREE.Mesh(plane_002Geometry, Washer_mainMaterialDS);
  plane_002.scale.set(0.0565, 0.089, 0.0743);
  plane_002.setRotation(1.5708, 0.0, -1.3866);
  const plane_002MZ = plane_002.clone();
  plane_002MZ.updateMatrixWorld(true);
  plane_002.position.set(0, 0, 0.0898);
  plane_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_002MZ.position.set(0, 0, -0.0907);
  const plane_002MirroredZ = new THREE.Group();
  plane_002MirroredZ.add(plane_002, plane_002MZ);
  plane_002MirroredZ.position.set(0.5929, 0.694, 0);
  const plane_003Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_003 = new THREE.Mesh(plane_003Geometry, Washer_mainMaterialDS);
  plane_003.scale.set(0.0466, 0.089, 0.0743);
  plane_003.setRotation(1.5708, 0.0, -1.4353);
  const plane_003MZ = plane_003.clone();
  plane_003MZ.updateMatrixWorld(true);
  plane_003.position.set(0, 0, 0.0898);
  plane_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_003MZ.position.set(0, 0, -0.0907);
  const plane_003MirroredZ = new THREE.Group();
  plane_003MirroredZ.add(plane_003, plane_003MZ);
  plane_003MirroredZ.position.set(0.6096, 0.5922, 0);
  const plane_004Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_004 = new THREE.Mesh(plane_004Geometry, Washer_mainMaterialDS);
  plane_004.scale.set(0.0401, 0.089, 0.0743);
  plane_004.setRotation(1.5708, 0.0, -1.5094);
  const plane_004MZ = plane_004.clone();
  plane_004MZ.updateMatrixWorld(true);
  plane_004.position.set(0, 0, 0.0898);
  plane_004MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_004MZ.position.set(0, 0, -0.0907);
  const plane_004MirroredZ = new THREE.Group();
  plane_004MirroredZ.add(plane_004, plane_004MZ);
  plane_004MirroredZ.position.set(0.6183, 0.506, 0);
  const plane_005Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_005 = new THREE.Mesh(plane_005Geometry, Washer_mainMaterialDS);
  plane_005.scale.set(0.0487, 0.089, 0.0743);
  plane_005.setRotation(1.5708, 0.0, -1.57);
  const plane_005MZ = plane_005.clone();
  plane_005MZ.updateMatrixWorld(true);
  plane_005.position.set(0, 0, 0.0898);
  plane_005MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_005MZ.position.set(0, 0, -0.0907);
  const plane_005MirroredZ = new THREE.Group();
  plane_005MirroredZ.add(plane_005, plane_005MZ);
  plane_005MirroredZ.position.set(0.6208, 0.4173, 0);
  const plane_014Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_014 = new THREE.Mesh(plane_014Geometry, Washer_mainMaterialDS);
  plane_014.scale.set(0.0762, 0.089, 0.0743);
  plane_014.setRotation(1.8353, 0.0, -1.3109);
  const plane_014MZ = plane_014.clone();
  plane_014MZ.updateMatrixWorld(true);
  plane_014.position.set(0, 0, 0.2646);
  plane_014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_014MZ.position.set(0, 0, -0.2656);
  const plane_014MirroredZ = new THREE.Group();
  plane_014MirroredZ.add(plane_014, plane_014MZ);
  plane_014MirroredZ.position.set(0.5405, 0.8172, 0);
  const plane_015Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_015 = new THREE.Mesh(plane_015Geometry, Washer_mainMaterialDS);
  plane_015.scale.set(0.0565, 0.089, 0.0743);
  plane_015.setRotation(1.8396, -0.0, -1.3866);
  const plane_015MZ = plane_015.clone();
  plane_015MZ.updateMatrixWorld(true);
  plane_015.position.set(0, 0, 0.2645);
  plane_015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_015MZ.position.set(0, 0, -0.2655);
  const plane_015MirroredZ = new THREE.Group();
  plane_015MirroredZ.add(plane_015, plane_015MZ);
  plane_015MirroredZ.position.set(0.5697, 0.6896, 0);
  const plane_016Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_016 = new THREE.Mesh(plane_016Geometry, Washer_mainMaterialDS);
  plane_016.scale.set(0.0466, 0.089, 0.0743);
  plane_016.setRotation(1.8417, 0.0, -1.4353);
  const plane_016MZ = plane_016.clone();
  plane_016MZ.updateMatrixWorld(true);
  plane_016.position.set(0, 0, 0.2645);
  plane_016MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_016MZ.position.set(0, 0, -0.2654);
  const plane_016MirroredZ = new THREE.Group();
  plane_016MirroredZ.add(plane_016, plane_016MZ);
  plane_016MirroredZ.position.set(0.586, 0.589, 0);
  const plane_017Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_017 = new THREE.Mesh(plane_017Geometry, Washer_mainMaterialDS);
  plane_017.scale.set(0.0401, 0.089, 0.0743);
  plane_017.setRotation(1.8436, 0.0, -1.5094);
  const plane_017MZ = plane_017.clone();
  plane_017MZ.updateMatrixWorld(true);
  plane_017.position.set(0, 0, 0.2644);
  plane_017MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_017MZ.position.set(0, 0, -0.2654);
  const plane_017MirroredZ = new THREE.Group();
  plane_017MirroredZ.add(plane_017, plane_017MZ);
  plane_017MirroredZ.position.set(0.5944, 0.5045, 0);
  const plane_018Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_018 = new THREE.Mesh(plane_018Geometry, Washer_mainMaterialDS);
  plane_018.scale.set(0.0487, 0.089, 0.0743);
  plane_018.setRotation(1.8427, -0.0014, -1.57);
  const plane_018MZ = plane_018.clone();
  plane_018MZ.updateMatrixWorld(true);
  plane_018.position.set(0, 0, 0.2644);
  plane_018MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_018MZ.position.set(0, 0, -0.2654);
  const plane_018MirroredZ = new THREE.Group();
  plane_018MirroredZ.add(plane_018, plane_018MZ);
  plane_018MirroredZ.position.set(0.5968, 0.4173, 0);
  const plane_006Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_006 = new THREE.Mesh(plane_006Geometry, Washer_mainMaterialDS);
  plane_006.scale.set(0.0762, 0.089, 0.0743);
  plane_006.setRotation(2.4592, 0.0, -1.3109);
  const plane_006MZ = plane_006.clone();
  plane_006MZ.updateMatrixWorld(true);
  plane_006.position.set(0, 0, 0.4066);
  plane_006MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_006MZ.position.set(0, 0, -0.4076);
  const plane_006MirroredZ = new THREE.Group();
  plane_006MirroredZ.add(plane_006, plane_006MZ);
  plane_006MirroredZ.position.set(0.4513, 0.7935, 0);
  const plane_007Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_007 = new THREE.Mesh(plane_007Geometry, Washer_mainMaterialDS);
  plane_007.scale.set(0.0565, 0.089, 0.0743);
  plane_007.setRotation(2.4694, -0.0, -1.3866);
  const plane_007MZ = plane_007.clone();
  plane_007MZ.updateMatrixWorld(true);
  plane_007.position.set(0, 0, 0.4059);
  plane_007MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_007MZ.position.set(0, 0, -0.4069);
  const plane_007MirroredZ = new THREE.Group();
  plane_007MirroredZ.add(plane_007, plane_007MZ);
  plane_007MirroredZ.position.set(0.4795, 0.6693, 0);
  const plane_008Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_008 = new THREE.Mesh(plane_008Geometry, Washer_mainMaterialDS);
  plane_008.scale.set(0.0466, 0.089, 0.0743);
  plane_008.setRotation(2.4745, 0.0, -1.4353);
  const plane_008MZ = plane_008.clone();
  plane_008MZ.updateMatrixWorld(true);
  plane_008.position.set(0, 0, 0.4054);
  plane_008MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_008MZ.position.set(0, 0, -0.4063);
  const plane_008MirroredZ = new THREE.Group();
  plane_008MirroredZ.add(plane_008, plane_008MZ);
  plane_008MirroredZ.position.set(0.4938, 0.5741, 0);
  const plane_009Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_009 = new THREE.Mesh(plane_009Geometry, Washer_mainMaterialDS);
  plane_009.scale.set(0.0401, 0.089, 0.0743);
  plane_009.setRotation(3.1283, 0.6462, -1.5345);
  const plane_009MZ = plane_009.clone();
  plane_009MZ.updateMatrixWorld(true);
  plane_009.position.set(0, 0, 0.4039);
  plane_009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_009MZ.position.set(0, 0, -0.4049);
  const plane_009MirroredZ = new THREE.Group();
  plane_009MirroredZ.add(plane_009, plane_009MZ);
  plane_009MirroredZ.position.set(0.5003, 0.494, 0);
  const plane_011Geometry = new THREE.PlaneGeometry(2, 2);
  const plane_011 = new THREE.Mesh(plane_011Geometry, Washer_mainMaterialDS);
  plane_011.scale.set(0.0487, 0.089, 0.0743);
  plane_011.setRotation(2.4807, -0.0014, -1.57);
  const plane_011MZ = plane_011.clone();
  plane_011MZ.updateMatrixWorld(true);
  plane_011.position.set(0, 0, 0.4046);
  plane_011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  plane_011MZ.position.set(0, 0, -0.4056);
  const plane_011MirroredZ = new THREE.Group();
  plane_011MirroredZ.add(plane_011, plane_011MZ);
  plane_011MirroredZ.position.set(0.5027, 0.4143, 0);
  const cube_042Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_042 = new THREE.Mesh(cube_042Geometry, ColoumnMaterial);
  cube_042.position.set(0.5929, 0.694, -0.0005);
  cube_042.scale.set(0.0555, 0.0086, 0.013);
  cube_042.setRotation(0.0, 0.0, -1.3866);

  const cube_043Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_043 = new THREE.Mesh(cube_043Geometry, ColoumnMaterial);
  cube_043.position.set(0.6094, 0.5931, -0.0005);
  cube_043.scale.set(0.0471, 0.0086, 0.013);
  cube_043.setRotation(0.0, 0.0, -1.4353);

  const cube_044Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_044 = new THREE.Mesh(cube_044Geometry, ColoumnMaterial);
  cube_044.position.set(0.6183, 0.5063, -0.0005);
  cube_044.scale.set(0.0407, 0.0086, 0.013);
  cube_044.setRotation(0.0, 0.0, -1.5094);

  const cube_045Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_045 = new THREE.Mesh(cube_045Geometry, ColoumnMaterial);
  cube_045.position.set(0.6208, 0.4262, -0.0005);
  cube_045.scale.set(0.0401, 0.0086, 0.013);
  cube_045.setRotation(0.0, 0.0, -1.57);

  const cube_046Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_046 = new THREE.Mesh(cube_046Geometry, ColoumnMaterial);
  cube_046.position.set(0.563, 0.8232, -0.0005);
  cube_046.scale.set(0.0783, 0.0086, 0.013);
  cube_046.setRotation(0.0, 0.0, -1.3109);

  const cube_047Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_047 = new THREE.Mesh(cube_047Geometry, ColoumnMaterial);
  cube_047.position.set(0.5037, 0.9733, -0.0005);
  cube_047.scale.set(0.0861, 0.0086, 0.013);
  cube_047.setRotation(0.0, 0.0, -1.0922);

  const cube_048Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_048 = new THREE.Mesh(cube_048Geometry, MetalMaterial);
  cube_048.position.set(0.5892, 0.3456, -0.0005);
  cube_048.scale.set(0.0777, 0.0449, 0.2378);

  const cube_049Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_049 = new THREE.Mesh(cube_049Geometry, MetalMaterial);
  cube_049.scale.set(0.0449, 0.0676, 0.0536);
  cube_049.setRotation(-1.5708, -1.338, -1.5708);
  const cube_049MZ = cube_049.clone();
  cube_049MZ.updateMatrixWorld(true);
  cube_049.position.set(0, 0, -0.2749);
  cube_049MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_049MZ.position.set(0, 0, 0.2739);
  const cube_049MirroredZ = new THREE.Group();
  cube_049MirroredZ.add(cube_049, cube_049MZ);
  cube_049MirroredZ.position.set(0.5887, 0.3456, 0);
  const cube_050Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_050 = new THREE.Mesh(cube_050Geometry, MetalMaterial);
  cube_050.scale.set(0.0449, 0.0676, 0.0607);
  cube_050.setRotation(-1.0613, 0.0, -1.5708);
  const cube_050MZ = cube_050.clone();
  cube_050MZ.updateMatrixWorld(true);
  cube_050.position.set(0, 0, -0.4017);
  cube_050MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_050MZ.position.set(0, 0, 0.4007);
  const cube_050MirroredZ = new THREE.Group();
  cube_050MirroredZ.add(cube_050, cube_050MZ);
  cube_050MirroredZ.position.set(0.4855, 0.3456, 0);
  const cube_051Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_051 = new THREE.Mesh(cube_051Geometry, MetalMaterial);
  cube_051.scale.set(0.0449, 0.0676, 0.0566);
  cube_051.setRotation(-0.6742, 0.0, -1.5708);
  const cube_051MZ = cube_051.clone();
  cube_051MZ.updateMatrixWorld(true);
  cube_051.position.set(0, 0, -0.3447);
  cube_051MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_051MZ.position.set(0, 0, 0.3437);
  const cube_051MirroredZ = new THREE.Group();
  cube_051MirroredZ.add(cube_051, cube_051MZ);
  cube_051MirroredZ.position.set(0.5539, 0.3456, 0);
  const cube_052Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_052 = new THREE.Mesh(cube_052Geometry, MetalMaterial);
  cube_052.scale.set(0.0449, 0.0676, 0.0634);
  cube_052.setRotation(-1.4054, 0.0, -1.5708);
  const cube_052MZ = cube_052.clone();
  cube_052MZ.updateMatrixWorld(true);
  cube_052.position.set(0, 0, -0.4341);
  cube_052MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_052MZ.position.set(0, 0, 0.4331);
  const cube_052MirroredZ = new THREE.Group();
  cube_052MirroredZ.add(cube_052, cube_052MZ);
  cube_052MirroredZ.position.set(0.3918, 0.3456, 0);
  const cube_053Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_053 = new THREE.Mesh(cube_053Geometry, MetalMaterial);
  cube_053.scale.set(0.0449, 0.0676, 0.2967);
  cube_053.setRotation(-1.7417, 0.0, -1.5708);
  const cube_053MZ = cube_053.clone();
  cube_053MZ.updateMatrixWorld(true);
  cube_053.position.set(0, 0, -0.3941);
  cube_053MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_053MZ.position.set(0, 0, 0.3931);
  const cube_053MirroredZ = new THREE.Group();
  cube_053MirroredZ.add(cube_053, cube_053MZ);
  cube_053MirroredZ.position.set(0.0596, 0.3456, 0);
  const cube_072Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_072 = new THREE.Mesh(cube_072Geometry, Washer_mainMaterial);
  cube_072.position.set(0.253, 0.2265, -0.0005);
  cube_072.scale.set(0.2689, 0.0995, 0.3515);

  const cube_073Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_073 = new THREE.Mesh(cube_073Geometry, Washer_mainMaterial);
  cube_073.position.set(-0.0907, 0.4654, -0.0005);
  cube_073.scale.set(0.5784, 0.0973, 0.3757);

  const cube_074Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_074 = new THREE.Mesh(cube_074Geometry, Washer_mainMaterial);
  cube_074.scale.set(0.5784, 0.1078, 0.0355);
  cube_074.setRotation(0.0, 0.0641, 0.0);
  const cube_074MZ = cube_074.clone();
  cube_074MZ.updateMatrixWorld(true);
  cube_074.position.set(0, 0, -0.386);
  cube_074MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_074MZ.position.set(0, 0, 0.385);
  const cube_074MirroredZ = new THREE.Group();
  cube_074MirroredZ.add(cube_074, cube_074MZ);
  cube_074MirroredZ.position.set(-0.1438, 0.4107, 0);
  const cube_075Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_075 = new THREE.Mesh(cube_075Geometry, Washer_mainMaterial);
  cube_075.scale.set(0.5784, 0.0382, 0.0355);
  cube_075.setRotation(0.0, 0.0641, 0.0);
  const cube_075MZ = cube_075.clone();
  cube_075MZ.updateMatrixWorld(true);
  cube_075.position.set(0, 0, -0.386);
  cube_075MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_075MZ.position.set(0, 0, 0.385);
  const cube_075MirroredZ = new THREE.Group();
  cube_075MirroredZ.add(cube_075, cube_075MZ);
  cube_075MirroredZ.position.set(-0.1438, 0.5567, 0);
  const cube_076Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_076 = new THREE.Mesh(cube_076Geometry, ColoumnMaterial);
  cube_076.scale.set(0.0555, 0.0086, 0.013);
  cube_076.setRotation(-0.8986, 0.0, -1.3866);
  const cube_076MZ = cube_076.clone();
  cube_076MZ.updateMatrixWorld(true);
  cube_076.position.set(0, 0, -0.4561);
  cube_076MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_076MZ.position.set(0, 0, 0.4551);
  const cube_076MirroredZ = new THREE.Group();
  cube_076MirroredZ.add(cube_076, cube_076MZ);
  cube_076MirroredZ.position.set(0.4123, 0.6581, 0);
  const cube_077Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_077 = new THREE.Mesh(cube_077Geometry, ColoumnMaterial);
  cube_077.scale.set(0.0416, 0.0086, 0.013);
  cube_077.setRotation(-0.9037, -0.0001, -1.4353);
  const cube_077MZ = cube_077.clone();
  cube_077MZ.updateMatrixWorld(true);
  cube_077.position.set(0, 0, -0.456);
  cube_077MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_077MZ.position.set(0, 0, 0.455);
  const cube_077MirroredZ = new THREE.Group();
  cube_077MirroredZ.add(cube_077, cube_077MZ);
  cube_077MirroredZ.position.set(0.428, 0.5632, 0);
  const cube_078Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_078 = new THREE.Mesh(cube_078Geometry, ColoumnMaterial);
  cube_078.scale.set(0.0682, 0.0086, 0.013);
  cube_078.setRotation(-1.5549, -0.6436, -1.5405);
  const cube_078MZ = cube_078.clone();
  cube_078MZ.updateMatrixWorld(true);
  cube_078.position.set(0, 0, -0.4546);
  cube_078MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_078MZ.position.set(0, 0, 0.4537);
  const cube_078MirroredZ = new THREE.Group();
  cube_078MirroredZ.add(cube_078, cube_078MZ);
  cube_078MirroredZ.position.set(0.4351, 0.4555, 0);
  const cube_080Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_080 = new THREE.Mesh(cube_080Geometry, ColoumnMaterial);
  cube_080.scale.set(0.0783, 0.0086, 0.013);
  cube_080.setRotation(-0.8884, -0.0, -1.3109);
  const cube_080MZ = cube_080.clone();
  cube_080MZ.updateMatrixWorld(true);
  cube_080.position.set(0, 0, -0.4562);
  cube_080MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_080MZ.position.set(0, 0, 0.4553);
  const cube_080MirroredZ = new THREE.Group();
  cube_080MirroredZ.add(cube_080, cube_080MZ);
  cube_080MirroredZ.position.set(0.3823, 0.7872, 0);
  const cube_079Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_079 = new THREE.Mesh(cube_079Geometry, Washer_mainMaterial);
  cube_079.scale.set(0.5693, 0.0382, 0.0355);
  cube_079.setRotation(0.0, 0.0641, 0.0);
  const cube_079MZ = cube_079.clone();
  cube_079MZ.updateMatrixWorld(true);
  cube_079.position.set(0, 0, -0.3854);
  cube_079MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_079MZ.position.set(0, 0, 0.3844);
  const cube_079MirroredZ = new THREE.Group();
  cube_079MirroredZ.add(cube_079, cube_079MZ);
  cube_079MirroredZ.position.set(-0.1529, 0.6332, 0);
  const cube_081Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_081 = new THREE.Mesh(cube_081Geometry, WhiteDotsMaterial);
  cube_081.scale.set(0.0449, 0.0676, 0.0536);
  cube_081.setRotation(0.0, 0.2328, -1.1176);
  const cube_081MZ = cube_081.clone();
  cube_081MZ.updateMatrixWorld(true);
  cube_081.position.set(0, 0, -0.2677);
  cube_081MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_081MZ.position.set(0, 0, 0.2668);
  const cube_081MirroredZ = new THREE.Group();
  cube_081MirroredZ.add(cube_081, cube_081MZ);
  cube_081MirroredZ.position.set(0.5585, 0.3907, 0);
  const cube_082Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_082 = new THREE.Mesh(cube_082Geometry, Floor_StripesMaterial);
  cube_082.scale.set(0.0372, 0.056, 0.0444);
  cube_082.setRotation(0.0, 0.2328, -1.1176);
  const cube_082MZ = cube_082.clone();
  cube_082MZ.updateMatrixWorld(true);
  cube_082.position.set(0, 0, -0.2715);
  cube_082MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_082MZ.position.set(0, 0, 0.2705);
  const cube_082MirroredZ = new THREE.Group();
  cube_082MirroredZ.add(cube_082, cube_082MZ);
  cube_082MirroredZ.position.set(0.5743, 0.3986, 0);
  const cube_083Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_083 = new THREE.Mesh(cube_083Geometry, Washer_mainMaterial);
  cube_083.scale.set(0.5654, 0.0382, 0.0355);
  cube_083.setRotation(0.0, 0.0641, 0.0);
  const cube_083MZ = cube_083.clone();
  cube_083MZ.updateMatrixWorld(true);
  cube_083.position.set(0, 0, -0.3851);
  cube_083MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_083MZ.position.set(0, 0, 0.3842);
  const cube_083MirroredZ = new THREE.Group();
  cube_083MirroredZ.add(cube_083, cube_083MZ);
  cube_083MirroredZ.position.set(-0.1568, 0.7097, 0);
  const cube_084Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_084 = new THREE.Mesh(cube_084Geometry, Washer_mainMaterial);
  cube_084.scale.set(0.5537, 0.0382, 0.0355);
  cube_084.setRotation(0.0, 0.0641, 0.0);
  const cube_084MZ = cube_084.clone();
  cube_084MZ.updateMatrixWorld(true);
  cube_084.position.set(0, 0, -0.3844);
  cube_084MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_084MZ.position.set(0, 0, 0.3834);
  const cube_084MirroredZ = new THREE.Group();
  cube_084MirroredZ.add(cube_084, cube_084MZ);
  cube_084MirroredZ.position.set(-0.1685, 0.7862, 0);
  const cylinder_010Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_010 = new THREE.Mesh(cylinder_010Geometry, ColoumnMaterial);
  cylinder_010.scale.set(0.1549, 0.0604, 0.1549);
  cylinder_010.setRotation(1.5708, 0.0, 0.0);
  const cylinder_010MZ = cylinder_010.clone();
  cylinder_010MZ.updateMatrixWorld(true);
  cylinder_010.position.set(0, 0, 0.4147);
  cylinder_010MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_010MZ.position.set(0, 0, -0.4157);
  const cylinder_010MirroredZ = new THREE.Group();
  cylinder_010MirroredZ.add(cylinder_010, cylinder_010MZ);
  cylinder_010MirroredZ.position.set(0.2474, 0.1409, 0);
  const cylinder_011Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_011 = new THREE.Mesh(cylinder_011Geometry, MetalMaterial);
  cylinder_011.scale.set(0.1293, 0.0086, 0.1293);
  cylinder_011.setRotation(1.5708, 0.0, 0.0);
  const cylinder_011MZ = cylinder_011.clone();
  cylinder_011MZ.updateMatrixWorld(true);
  cylinder_011.position.set(0, 0, 0.4746);
  cylinder_011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_011MZ.position.set(0, 0, -0.4756);
  const cylinder_011MirroredZ = new THREE.Group();
  cylinder_011MirroredZ.add(cylinder_011, cylinder_011MZ);
  cylinder_011MirroredZ.position.set(0.2474, 0.1409, 0);
  const cylinder_013Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_013 = new THREE.Mesh(cylinder_013Geometry, MetalMaterial);
  cylinder_013.scale.set(0.0872, 0.0458, 0.0872);
  cylinder_013.setRotation(1.5708, 0.0, 0.0);
  const cylinder_013MZ = cylinder_013.clone();
  cylinder_013MZ.updateMatrixWorld(true);
  cylinder_013.position.set(0, 0, 0.2746);
  cylinder_013MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_013MZ.position.set(0, 0, -0.2755);
  const cylinder_013MirroredZ = new THREE.Group();
  cylinder_013MirroredZ.add(cylinder_013, cylinder_013MZ);
  cylinder_013MirroredZ.position.set(0.6385, 0.1628, 0);
  const cube_086Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_086 = new THREE.Mesh(cube_086Geometry, BrassMaterial);
  cube_086.scale.set(0.0388, 0.0299, 0.1104);
  cube_086.setRotation(0.3098, 1.5708, 0.0);
  const cube_086MZ = cube_086.clone();
  cube_086MZ.updateMatrixWorld(true);
  cube_086.position.set(0, 0, 0.5);
  cube_086MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_086MZ.position.set(0, 0, -0.5009);
  const cube_086MirroredZ = new THREE.Group();
  cube_086MirroredZ.add(cube_086, cube_086MZ);
  cube_086MirroredZ.position.set(0.7549, 0.1227, 0);
  const cube_088Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_088 = new THREE.Mesh(cube_088Geometry, MetalMaterial);
  cube_088.scale.set(0.0335, 0.109, 0.0767);
  cube_088.setRotation(1.5708, 1.309, -0.0);
  const cube_088MZ = cube_088.clone();
  cube_088MZ.updateMatrixWorld(true);
  cube_088.position.set(0, 0, 0.5241);
  cube_088MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_088MZ.position.set(0, 0, -0.5251);
  const cube_088MirroredZ = new THREE.Group();
  cube_088MirroredZ.add(cube_088, cube_088MZ);
  cube_088MirroredZ.position.set(0.9393, 0.0739, 0);
  const cube_089Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_089 = new THREE.Mesh(cube_089Geometry, MetalMaterial);
  cube_089.scale.set(0.0335, 0.109, 0.0767);
  cube_089.setRotation(1.5708, 0.7854, -0.0);
  const cube_089MZ = cube_089.clone();
  cube_089MZ.updateMatrixWorld(true);
  cube_089.position.set(0, 0, 0.5313);
  cube_089MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_089MZ.position.set(0, 0, -0.5323);
  const cube_089MirroredZ = new THREE.Group();
  cube_089MirroredZ.add(cube_089, cube_089MZ);
  cube_089MirroredZ.position.set(0.9351, 0.0739, 0);
  const cube_090Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_090 = new THREE.Mesh(cube_090Geometry, MetalMaterial);
  cube_090.scale.set(0.0335, 0.109, 0.0767);
  cube_090.setRotation(1.5708, 0.2618, -0.0);
  const cube_090MZ = cube_090.clone();
  cube_090MZ.updateMatrixWorld(true);
  cube_090.position.set(0, 0, 0.5355);
  cube_090MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_090MZ.position.set(0, 0, -0.5364);
  const cube_090MirroredZ = new THREE.Group();
  cube_090MirroredZ.add(cube_090, cube_090MZ);
  cube_090MirroredZ.position.set(0.9279, 0.0739, 0);
  const cube_091Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_091 = new THREE.Mesh(cube_091Geometry, MetalMaterial);
  cube_091.scale.set(0.0178, 0.0632, 0.0767);
  cube_091.setRotation(1.5708, -0.0, -0.0);
  const cube_091MZ = cube_091.clone();
  cube_091MZ.updateMatrixWorld(true);
  cube_091.position.set(0, 0, 0.5862);
  cube_091MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_091MZ.position.set(0, 0, -0.5871);
  const cube_091MirroredZ = new THREE.Group();
  cube_091MirroredZ.add(cube_091, cube_091MZ);
  cube_091MirroredZ.position.set(0.906, 0.0739, 0);
  const cube_093Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_093 = new THREE.Mesh(cube_093Geometry, MetalMaterial);
  cube_093.scale.set(0.024, 0.0632, 0.0767);
  cube_093.setRotation(1.5708, -0.3927, -0.0);
  const cube_093MZ = cube_093.clone();
  cube_093MZ.updateMatrixWorld(true);
  cube_093.position.set(0, 0, 0.5818);
  cube_093MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_093MZ.position.set(0, 0, -0.5828);
  const cube_093MirroredZ = new THREE.Group();
  cube_093MirroredZ.add(cube_093, cube_093MZ);
  cube_093MirroredZ.position.set(0.8902, 0.0739, 0);
  const cube_094Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_094 = new THREE.Mesh(cube_094Geometry, MetalMaterial);
  cube_094.scale.set(0.024, 0.0388, 0.0767);
  cube_094.setRotation(1.5708, -1.1781, -0.0);
  const cube_094MZ = cube_094.clone();
  cube_094MZ.updateMatrixWorld(true);
  cube_094.position.set(0, 0, 0.5939);
  cube_094MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_094MZ.position.set(0, 0, -0.5949);
  const cube_094MirroredZ = new THREE.Group();
  cube_094MirroredZ.add(cube_094, cube_094MZ);
  cube_094MirroredZ.position.set(0.8705, 0.0739, 0);
  const cube_095Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_095 = new THREE.Mesh(cube_095Geometry, MetalMaterial);
  cube_095.scale.set(0.0333, 0.0388, 0.0767);
  cube_095.setRotation(1.5708, 1.5708, -0.0);
  const cube_095MZ = cube_095.clone();
  cube_095MZ.updateMatrixWorld(true);
  cube_095.position.set(0, 0, 0.5533);
  cube_095MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_095MZ.position.set(0, 0, -0.5543);
  const cube_095MirroredZ = new THREE.Group();
  cube_095MirroredZ.add(cube_095, cube_095MZ);
  cube_095MirroredZ.position.set(0.8643, 0.0739, 0);
  const cube_087Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_087 = new THREE.Mesh(cube_087Geometry, Washer_mainMaterial);
  cube_087.scale.set(0.0847, 0.5837, 0.089);
  cube_087.setRotation(0.2645, 0.0, -1.3109);
  const cube_087MZ = cube_087.clone();
  cube_087MZ.updateMatrixWorld(true);
  cube_087.position.set(0, 0, 0.112);
  cube_087MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_087MZ.position.set(0, 0, -0.113);
  const cube_087MirroredZ = new THREE.Group();
  cube_087MirroredZ.add(cube_087, cube_087MZ);
  cube_087MirroredZ.position.set(-0.0454, 0.828, 0);
  const cube_096Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_096 = new THREE.Mesh(cube_096Geometry, Washer_mainMaterial);
  cube_096.scale.set(0.0847, 0.3559, 0.089);
  cube_096.setRotation(0.8884, 0.0, -1.3109);
  const cube_096MZ = cube_096.clone();
  cube_096MZ.updateMatrixWorld(true);
  cube_096.position.set(0, 0, 0.1304);
  cube_096MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_096MZ.position.set(0, 0, -0.1314);
  const cube_096MirroredZ = new THREE.Group();
  cube_096MirroredZ.add(cube_096, cube_096MZ);
  cube_096MirroredZ.position.set(0.193, 0.8914, 0);
  const cube_097Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_097 = new THREE.Mesh(cube_097Geometry, ColoumnMaterial);
  cube_097.scale.set(0.0861, 0.0086, 0.013);
  cube_097.setRotation(1.4046, 0.6992, 0.2008);
  const cube_097MZ = cube_097.clone();
  cube_097MZ.updateMatrixWorld(true);
  cube_097.position.set(0, 0, 0.4005);
  cube_097MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_097MZ.position.set(0, 0, -0.4015);
  const cube_097MirroredZ = new THREE.Group();
  cube_097MirroredZ.add(cube_097, cube_097MZ);
  cube_097MirroredZ.position.set(0.3904, 1.0188, 0);
  const cube_098Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_098 = new THREE.Mesh(cube_098Geometry, Washer_mainMaterial);
  cube_098.scale.set(0.5438, 0.0454, 0.0355);
  cube_098.setRotation(0.0, 0.0641, 0.0);
  const cube_098MZ = cube_098.clone();
  cube_098MZ.updateMatrixWorld(true);
  cube_098.position.set(0, 0, -0.3837);
  cube_098MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_098MZ.position.set(0, 0, 0.3828);
  const cube_098MirroredZ = new THREE.Group();
  cube_098MirroredZ.add(cube_098, cube_098MZ);
  cube_098MirroredZ.position.set(-0.1784, 0.8698, 0);
  const cube_099Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_099 = new THREE.Mesh(cube_099Geometry, Washer_mainMaterial);
  cube_099.scale.set(0.5438, 0.3097, 0.1828);
  cube_099.setRotation(0.0, 0.0641, 0.0);
  const cube_099MZ = cube_099.clone();
  cube_099MZ.updateMatrixWorld(true);
  cube_099.position.set(0, 0, -0.1658);
  cube_099MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_099MZ.position.set(0, 0, 0.1649);
  const cube_099MirroredZ = new THREE.Group();
  cube_099MirroredZ.add(cube_099, cube_099MZ);
  cube_099MirroredZ.position.set(-0.1644, 0.6126, 0);
  const cube_100Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_100 = new THREE.Mesh(cube_100Geometry, MetalMaterial);
  cube_100.scale.set(0.0449, 0.0676, 0.3383);
  cube_100.setRotation(1.5149, 0.0, -1.5708);
  const cube_100MZ = cube_100.clone();
  cube_100MZ.updateMatrixWorld(true);
  cube_100.position.set(0, 0, -0.3506);
  cube_100MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_100MZ.position.set(0, 0, 0.3496);
  const cube_100MirroredZ = new THREE.Group();
  cube_100MirroredZ.add(cube_100, cube_100MZ);
  cube_100MirroredZ.position.set(-0.4006, 0.3456, 0);
  const cube_101Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_101 = new THREE.Mesh(cube_101Geometry, ColoumnMaterial);
  cube_101.scale.set(0.3095, 0.0126, 0.013);
  cube_101.setRotation(-1.5708, 0.0641, -1.5708);
  const cube_101MZ = cube_101.clone();
  cube_101MZ.updateMatrixWorld(true);
  cube_101.position.set(0, 0, -0.3832);
  cube_101MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_101MZ.position.set(0, 0, 0.3822);
  const cube_101MirroredZ = new THREE.Group();
  cube_101MirroredZ.add(cube_101, cube_101MZ);
  cube_101MirroredZ.position.set(-0.7233, 0.6164, 0);
  const cube_102Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_102 = new THREE.Mesh(cube_102Geometry, MetalMaterial);
  cube_102.scale.set(0.0277, 0.0114, 0.0581);
  cube_102.setRotation(1.4661, 1.9292, -0.6546);
  const cube_102MZ = cube_102.clone();
  cube_102MZ.updateMatrixWorld(true);
  cube_102.position.set(0, 0, -0.461);
  cube_102MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_102MZ.position.set(0, 0, 0.4601);
  const cube_102MirroredZ = new THREE.Group();
  cube_102MirroredZ.add(cube_102, cube_102MZ);
  cube_102MirroredZ.position.set(0.3396, 0.5026, 0);
  const cylinder_014Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_014 = new THREE.Mesh(cylinder_014Geometry, MetalMaterial);
  cylinder_014.scale.set(0.0495, 0.0125, 0.0495);
  cylinder_014.setRotation(1.4661, 1.9292, -0.6546);
  const cylinder_014MZ = cylinder_014.clone();
  cylinder_014MZ.updateMatrixWorld(true);
  cylinder_014.position.set(0, 0, -0.5081);
  cylinder_014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_014MZ.position.set(0, 0, 0.5071);
  const cylinder_014MirroredZ = new THREE.Group();
  cylinder_014MirroredZ.add(cylinder_014, cylinder_014MZ);
  cylinder_014MirroredZ.position.set(0.312, 0.5726, 0);
  const cylinder_015Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_015 = new THREE.Mesh(
    cylinder_015Geometry,
    Floor_StripesMaterial,
  );
  cylinder_015.scale.set(0.0392, 0.0099, 0.0392);
  cylinder_015.setRotation(1.4661, 1.9292, -0.6546);
  const cylinder_015MZ = cylinder_015.clone();
  cylinder_015MZ.updateMatrixWorld(true);
  cylinder_015.position.set(0, 0, -0.5127);
  cylinder_015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_015MZ.position.set(0, 0, 0.5117);
  const cylinder_015MirroredZ = new THREE.Group();
  cylinder_015MirroredZ.add(cylinder_015, cylinder_015MZ);
  cylinder_015MirroredZ.position.set(0.3223, 0.5735, 0);
  const cylinder_016Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_016 = new THREE.Mesh(cylinder_016Geometry, MetalMaterial);
  cylinder_016.position.set(-0.6668, 0.1409, -0.0005);
  cylinder_016.scale.set(-0.1354, -0.0673, -0.1354);
  cylinder_016.setRotation(1.5708, 0.0, 0.0);

  const cylinder_017Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_017 = new THREE.Mesh(cylinder_017Geometry, ColoumnMaterial);
  cylinder_017.position.set(-0.6668, 0.1409, -0.0005);
  cylinder_017.scale.set(0.1549, 0.0604, 0.1549);
  cylinder_017.setRotation(1.5708, 0.0, 0.0);

  const cube_085Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_085 = new THREE.Mesh(cube_085Geometry, Washer_mainMaterial);
  cube_085.scale.set(0.345, 0.3137, 0.2025);
  cube_085.setRotation(0.0, 0.0641, 0.0);
  const cube_085MZ = cube_085.clone();
  cube_085MZ.updateMatrixWorld(true);
  cube_085.position.set(0, 0, -0.0847);
  cube_085MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_085MZ.position.set(0, 0, 0.0837);
  const cube_085MirroredZ = new THREE.Group();
  cube_085MirroredZ.add(cube_085, cube_085MZ);
  cube_085MirroredZ.position.set(-0.4076, 0.5014, 0);
  const cube_103Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_103 = new THREE.Mesh(cube_103Geometry, Floor_trainMaterial);
  cube_103.position.set(-0.7408, 0.5486, -0.0005);
  cube_103.scale.set(-0.068, -0.122, -0.122);
  cube_103.setRotation(0.0, 0.0, -0.3156);

  const cube_104Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_104 = new THREE.Mesh(cube_104Geometry, Washer_mainMaterial);
  cube_104.scale.set(0.0865, 0.5837, 0.089);
  cube_104.setRotation(0.0, 0.0, -1.0914);
  const cube_104MZ = cube_104.clone();
  cube_104MZ.updateMatrixWorld(true);
  cube_104.position.set(0, 0, 0.0898);
  cube_104MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_104MZ.position.set(0, 0, -0.0907);
  const cube_104MirroredZ = new THREE.Group();
  cube_104MirroredZ.add(cube_104, cube_104MZ);
  cube_104MirroredZ.position.set(-0.0144, 0.7044, 0);
  const cube_105Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_105 = new THREE.Mesh(cube_105Geometry, Washer_mainMaterial);
  cube_105.scale.set(0.0847, 0.5828, 0.089);
  cube_105.setRotation(0.0, 0.0, -1.3109);
  const cube_105MZ = cube_105.clone();
  cube_105MZ.updateMatrixWorld(true);
  cube_105.position.set(0, 0, -0.0895);
  cube_105MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_105MZ.position.set(0, 0, 0.0885);
  const cube_105MirroredZ = new THREE.Group();
  cube_105MirroredZ.add(cube_105, cube_105MZ);
  cube_105MirroredZ.position.set(-0.0782, 0.8192, 0);
  const cube_106Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_106 = new THREE.Mesh(cube_106Geometry, ColoumnMaterial);
  cube_106.scale.set(0.0783, 0.0086, 0.013);
  cube_106.setRotation(-0.8884, -0.0, -1.3109);
  const cube_106MZ = cube_106.clone();
  cube_106MZ.updateMatrixWorld(true);
  cube_106.position.set(0, 0, -0.4562);
  cube_106MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_106MZ.position.set(0, 0, 0.4553);
  const cube_106MirroredZ = new THREE.Group();
  cube_106MirroredZ.add(cube_106, cube_106MZ);
  cube_106MirroredZ.position.set(0.3421, 0.9384, 0);
  const cube_107Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_107 = new THREE.Mesh(cube_107Geometry, ColoumnMaterial);
  cube_107.scale.set(0.5328, 0.0126, 0.013);
  cube_107.setRotation(1.5708, 0.0641, -3.1416);
  const cube_107MZ = cube_107.clone();
  cube_107MZ.updateMatrixWorld(true);
  cube_107.position.set(0, 0, -0.4181);
  cube_107MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_107MZ.position.set(0, 0, 0.4172);
  const cube_107MirroredZ = new THREE.Group();
  cube_107MirroredZ.add(cube_107, cube_107MZ);
  cube_107MirroredZ.position.set(-0.1835, 0.9129, 0);
  const cube_108Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_108 = new THREE.Mesh(cube_108Geometry, cube_108Material);
  cube_108.scale.set(0.0319, 0.0539, 0.0095);
  cube_108.setRotation(1.5149, 0.0, -1.5708);
  const cube_108MZ = cube_108.clone();
  cube_108MZ.updateMatrixWorld(true);
  cube_108.position.set(0, 0, -0.3317);
  cube_108MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_108MZ.position.set(0, 0, 0.3307);
  const cube_108MirroredZ = new THREE.Group();
  cube_108MirroredZ.add(cube_108, cube_108MZ);
  cube_108MirroredZ.position.set(-0.7324, 0.3456, 0);
  const cube_109Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_109 = new THREE.Mesh(cube_109Geometry, Floor_StripesMaterial);
  cube_109.scale.set(0.0293, 0.0495, 0.0042);
  cube_109.setRotation(1.5149, 0.0, -1.5708);
  const cube_109MZ = cube_109.clone();
  cube_109MZ.updateMatrixWorld(true);
  cube_109.position.set(0, 0, -0.3311);
  cube_109MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_109MZ.position.set(0, 0, 0.3302);
  const cube_109MirroredZ = new THREE.Group();
  cube_109MirroredZ.add(cube_109, cube_109MZ);
  cube_109MirroredZ.position.set(-0.7422, 0.3456, 0);
  const cylinder_018Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_018 = new THREE.Mesh(cylinder_018Geometry, MetalMaterial);
  cylinder_018.position.set(-0.6668, 0.1409, -0.0005);
  cylinder_018.scale.set(-0.0317, -0.1797, -0.0317);
  cylinder_018.setRotation(1.5708, 0.0, 0.0);

  const cube_110Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_110 = new THREE.Mesh(cube_110Geometry, Metall_RustMaterial);
  cube_110.scale.set(-0.0358, -0.0754, -0.0358);
  cube_110.setRotation(0.0, 0.0, -0.7854);
  const cube_110MZ = cube_110.clone();
  cube_110MZ.updateMatrixWorld(true);
  cube_110.position.set(0, 0, 0.1288);
  cube_110MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_110MZ.position.set(0, 0, -0.1298);
  const cube_110MirroredZ = new THREE.Group();
  cube_110MirroredZ.add(cube_110, cube_110MZ);
  cube_110MirroredZ.position.set(-0.6403, 0.1674, 0);
  const cylinder_019Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_019 = new THREE.Mesh(
    cylinder_019Geometry,
    Metall_RustMaterial,
  );
  cylinder_019.scale.set(0.1012, 0.0067, 0.1012);
  cylinder_019.setRotation(1.5708, 0.0, 0.0);
  const cylinder_019MZ = cylinder_019.clone();
  cylinder_019MZ.updateMatrixWorld(true);
  cylinder_019.position.set(0, 0, 0.4813);
  cylinder_019MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_019MZ.position.set(0, 0, -0.4822);
  const cylinder_019MirroredZ = new THREE.Group();
  cylinder_019MirroredZ.add(cylinder_019, cylinder_019MZ);
  cylinder_019MirroredZ.position.set(0.2474, 0.1409, 0);
  const cylinder_020Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_020 = new THREE.Mesh(
    cylinder_020Geometry,
    Metall_RustMaterial,
  );
  cylinder_020.position.set(-0.6668, 0.1409, -0.0005);
  cylinder_020.scale.set(-0.0284, -0.1868, -0.0284);
  cylinder_020.setRotation(1.5708, 0.0, 0.0);

  const cube_111Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_111 = new THREE.Mesh(cube_111Geometry, Floor_trainMaterial);
  cube_111.position.set(-0.7408, 0.3941, -0.0005);
  cube_111.scale.set(-0.068, -0.0905, -0.0741);

  const cylinder_021Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_021 = new THREE.Mesh(
    cylinder_021Geometry,
    Blue_PictureMaterial,
  );
  cylinder_021.position.set(-0.777, 0.6567, -0.0954);
  cylinder_021.scale.set(0.0196, 0.0044, 0.0196);
  cylinder_021.setRotation(0.0, -0.0, 1.2552);

  const cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_022 = new THREE.Mesh(
    cylinder_022Geometry,
    Floor_StripesMaterial,
  );
  cylinder_022.position.set(-0.7865, 0.6277, -0.0411);
  cylinder_022.scale.set(0.0196, 0.0044, 0.0196);
  cylinder_022.setRotation(0.0, -0.0, 1.2552);

  const cylinder_023Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_023 = new THREE.Mesh(
    cylinder_023Geometry,
    Green_PictureMaterial,
  );
  cylinder_023.position.set(-0.777, 0.6567, 0.0131);
  cylinder_023.scale.set(0.0196, 0.0044, 0.0196);
  cylinder_023.setRotation(0.0, -0.0, 1.2552);

  const cylinder_024Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_024 = new THREE.Mesh(cylinder_024Geometry, Train_blueMaterial);
  cylinder_024.position.set(-0.7865, 0.6277, 0.0673);
  cylinder_024.scale.set(0.0196, 0.0044, 0.0196);
  cylinder_024.setRotation(0.0, -0.0, 1.2552);

  const cube_112Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_112 = new THREE.Mesh(cube_112Geometry, Metall_RustMaterial);
  cube_112.position.set(-0.833, 0.4853, -0.0005);
  cube_112.scale.set(-0.0059, -0.0233, -0.1071);
  cube_112.setRotation(0.0, 0.0, -0.3156);

  const cube_113Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_113 = new THREE.Mesh(cube_113Geometry, WhiteDotsMaterial);
  cube_113.position.set(-0.8328, 0.5005, -0.0005);
  cube_113.scale.set(-0.0059, -0.0048, -0.1029);
  cube_113.setRotation(0.0, 0.0, -0.3156);

  const cube_114Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_114 = new THREE.Mesh(cube_114Geometry, WhiteDotsMaterial);
  cube_114.position.set(-0.842, 0.4724, -0.0005);
  cube_114.scale.set(-0.0059, -0.0048, -0.1029);
  cube_114.setRotation(0.0, 0.0, -0.3156);

  const cube_115Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_115 = new THREE.Mesh(cube_115Geometry, WhiteDotsMaterial);
  cube_115.position.set(-0.8374, 0.4865, 0.0976);
  cube_115.scale.set(-0.0059, -0.0048, -0.0118);
  cube_115.setRotation(-1.5708, 0.0, -0.3156);

  const cube_116Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_116 = new THREE.Mesh(cube_116Geometry, WhiteDotsMaterial);
  cube_116.position.set(-0.8374, 0.4865, -0.0986);
  cube_116.scale.set(-0.0059, -0.0048, -0.0118);
  cube_116.setRotation(-1.5708, 0.0, -0.3156);

  const cylinder_025Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_025 = new THREE.Mesh(cylinder_025Geometry, WhiteDotsMaterial);
  cylinder_025.position.set(-0.8762, 0.4994, 0.0796);
  cylinder_025.scale.set(0.007, 0.0613, 0.007);
  cylinder_025.setRotation(0.4012, 0.0, 1.2552);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere = new THREE.Mesh(sphereGeometry, Green_PictureMaterial);
  sphere.position.set(-0.9298, 0.5169, 0.1035);
  sphere.scale.set(0.0139, 0.0139, 0.0139);
  sphere.setRotation(0.4012, 0.0, 1.2552);

  const cylinder_026Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_026 = new THREE.Mesh(cylinder_026Geometry, WhiteDotsMaterial);
  cylinder_026.position.set(-0.8149, 0.5407, -0.0904);
  cylinder_026.scale.set(0.0156, 0.0044, 0.0156);
  cylinder_026.setRotation(0.0, -0.0, 1.2552);

  const cylinder_027Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_027 = new THREE.Mesh(cylinder_027Geometry, ColoumnMaterial);
  cylinder_027.position.set(-0.8253, 0.5441, -0.0904);
  cylinder_027.scale.set(0.0121, 0.0101, 0.0121);
  cylinder_027.setRotation(0.0, -0.0, 1.2552);

  const cube_117Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_117 = new THREE.Mesh(cube_117Geometry, ColoumnMaterial);
  cube_117.position.set(-0.8245, 0.5566, -0.0904);
  cube_117.scale.set(-0.0053, -0.0053, -0.0015);
  cube_117.setRotation(0.0, 0.0, 1.2552);

  const cube_118Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_118 = new THREE.Mesh(cube_118Geometry, ColoumnMaterial);
  cube_118.position.set(-0.8318, 0.5341, -0.0904);
  cube_118.scale.set(-0.0053, -0.0053, -0.0015);
  cube_118.setRotation(0.0, 0.0, 1.2552);

  const cylinder_028Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_028 = new THREE.Mesh(cylinder_028Geometry, WhiteDotsMaterial);
  cylinder_028.position.set(-0.8149, 0.5408, -0.0348);
  cylinder_028.scale.set(0.0156, 0.0044, 0.0156);
  cylinder_028.setRotation(1.1034, -1.2201, 0.8109);

  const cylinder_029Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_029 = new THREE.Mesh(cylinder_029Geometry, ColoumnMaterial);
  cylinder_029.position.set(-0.8253, 0.5442, -0.0348);
  cylinder_029.scale.set(0.0121, 0.0101, 0.0121);
  cylinder_029.setRotation(1.1034, -1.2201, 0.8109);

  const cube_119Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_119 = new THREE.Mesh(cube_119Geometry, ColoumnMaterial);
  cube_119.position.set(-0.8254, 0.5539, -0.0425);
  cube_119.scale.set(-0.0053, -0.0053, -0.0015);
  cube_119.setRotation(-1.1034, 1.2201, 0.8109);

  const cube_120Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_120 = new THREE.Mesh(cube_120Geometry, ColoumnMaterial);
  cube_120.position.set(-0.831, 0.5368, -0.0272);
  cube_120.scale.set(-0.0053, -0.0053, -0.0015);
  cube_120.setRotation(-1.1034, 1.2201, 0.8109);

  const cylinder_030Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_030 = new THREE.Mesh(cylinder_030Geometry, WhiteDotsMaterial);
  cylinder_030.position.set(-0.8148, 0.541, 0.032);
  cylinder_030.scale.set(0.0156, 0.0044, 0.0156);
  cylinder_030.setRotation(-1.2537, 1.6022, -0.0959);

  const cylinder_031Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_031 = new THREE.Mesh(cylinder_031Geometry, ColoumnMaterial);
  cylinder_031.position.set(-0.8253, 0.5444, 0.032);
  cylinder_031.scale.set(0.0121, 0.0101, 0.0121);
  cylinder_031.setRotation(-1.2537, 1.6022, -0.0959);

  const cube_121Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_121 = new THREE.Mesh(cube_121Geometry, ColoumnMaterial);
  cube_121.position.set(-0.8286, 0.544, 0.0438);
  cube_121.scale.set(-0.0053, -0.0053, -0.0015);
  cube_121.setRotation(1.2537, -1.6022, -0.0959);

  const cube_122Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_122 = new THREE.Mesh(cube_122Geometry, ColoumnMaterial);
  cube_122.position.set(-0.8279, 0.5463, 0.0202);
  cube_122.scale.set(-0.0053, -0.0053, -0.0015);
  cube_122.setRotation(1.2537, -1.6022, -0.0959);

  const cylinder_032Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_032 = new THREE.Mesh(cylinder_032Geometry, WhiteDotsMaterial);
  cylinder_032.position.set(-0.8149, 0.5408, 0.09);
  cylinder_032.scale.set(0.0156, 0.0044, 0.0156);
  cylinder_032.setRotation(1.0361, 4.2732, -0.9159);

  const cylinder_033Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_033 = new THREE.Mesh(cylinder_033Geometry, ColoumnMaterial);
  cylinder_033.position.set(-0.8253, 0.5442, 0.09);
  cylinder_033.scale.set(0.0121, 0.0101, 0.0121);
  cylinder_033.setRotation(1.0361, 4.2732, -0.9159);

  const cube_123Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_123 = new THREE.Mesh(cube_123Geometry, ColoumnMaterial);
  cube_123.position.set(-0.8312, 0.5359, 0.0835);
  cube_123.scale.set(-0.0053, -0.0053, -0.0015);
  cube_123.setRotation(-1.0361, -4.2732, -0.9159);

  const cube_124Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_124 = new THREE.Mesh(cube_124Geometry, ColoumnMaterial);
  cube_124.position.set(-0.8251, 0.5546, 0.0966);
  cube_124.scale.set(-0.0053, -0.0053, -0.0015);
  cube_124.setRotation(-1.0361, -4.2732, -0.9159);

  const cylinder_034Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_034 = new THREE.Mesh(cylinder_034Geometry, ColoumnMaterial);
  cylinder_034.scale.set(0.0162, 0.0722, 0.0162);
  cylinder_034.setRotation(0.0, 0.0, -0.0);
  const cylinder_034MZ = cylinder_034.clone();
  cylinder_034MZ.updateMatrixWorld(true);
  cylinder_034.position.set(0, 0, -0.0988);
  cylinder_034MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_034MZ.position.set(0, 0, 0.0979);
  const cylinder_034MirroredZ = new THREE.Group();
  cylinder_034MirroredZ.add(cylinder_034, cylinder_034MZ);
  cylinder_034MirroredZ.position.set(-0.7787, 0.3851, 0);
  const sphere_001Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_001 = new THREE.Mesh(sphere_001Geometry, ColoumnMaterial);
  sphere_001.scale.set(0.0178, 0.0178, 0.0178);
  sphere_001.setRotation(0.0, 0.0, 0.0);
  const sphere_001MZ = sphere_001.clone();
  sphere_001MZ.updateMatrixWorld(true);
  sphere_001.position.set(0, 0, -0.0988);
  sphere_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sphere_001MZ.position.set(0, 0, 0.0979);
  const sphere_001MirroredZ = new THREE.Group();
  sphere_001MirroredZ.add(sphere_001, sphere_001MZ);
  sphere_001MirroredZ.position.set(-0.7787, 0.3129, 0);
  const cylinder_035Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_035 = new THREE.Mesh(cylinder_035Geometry, ColoumnMaterial);
  cylinder_035.scale.set(0.0162, 0.1045, 0.0162);
  cylinder_035.setRotation(0.6981, 0.0, 0.0);
  const cylinder_035MZ = cylinder_035.clone();
  cylinder_035MZ.updateMatrixWorld(true);
  cylinder_035.position.set(0, 0, -0.1652);
  cylinder_035MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_035MZ.position.set(0, 0, 0.1642);
  const cylinder_035MirroredZ = new THREE.Group();
  cylinder_035MirroredZ.add(cylinder_035, cylinder_035MZ);
  cylinder_035MirroredZ.position.set(-0.7787, 0.2339, 0);
  const sphere_002Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_002 = new THREE.Mesh(sphere_002Geometry, ColoumnMaterial);
  sphere_002.scale.set(0.0178, 0.0178, 0.0178);
  sphere_002.setRotation(0.0, 0.0, 0.0);
  const sphere_002MZ = sphere_002.clone();
  sphere_002MZ.updateMatrixWorld(true);
  sphere_002.position.set(0, 0, -0.2324);
  sphere_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sphere_002MZ.position.set(0, 0, 0.2314);
  const sphere_002MirroredZ = new THREE.Group();
  sphere_002MirroredZ.add(sphere_002, sphere_002MZ);
  sphere_002MirroredZ.position.set(-0.7787, 0.1538, 0);
  const cylinder_036Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_036 = new THREE.Mesh(cylinder_036Geometry, ColoumnMaterial);
  cylinder_036.scale.set(0.0162, 0.3859, 0.0162);
  cylinder_036.setRotation(0.0, 0.0, -1.5708);
  const cylinder_036MZ = cylinder_036.clone();
  cylinder_036MZ.updateMatrixWorld(true);
  cylinder_036.position.set(0, 0, -0.2324);
  cylinder_036MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_036MZ.position.set(0, 0, 0.2314);
  const cylinder_036MirroredZ = new THREE.Group();
  cylinder_036MirroredZ.add(cylinder_036, cylinder_036MZ);
  cylinder_036MirroredZ.position.set(-0.3951, 0.1538, 0);
  const cube_125Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_125 = new THREE.Mesh(cube_125Geometry, MetalMaterial);
  cube_125.scale.set(0.5438, 0.0871, 0.1828);
  cube_125.setRotation(-0.0041, 0.0643, 0.0637);
  const cube_125MZ = cube_125.clone();
  cube_125MZ.updateMatrixWorld(true);
  cube_125.position.set(0, 0, -0.144);
  cube_125MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_125MZ.position.set(0, 0, 0.1431);
  const cube_125MirroredZ = new THREE.Group();
  cube_125MirroredZ.add(cube_125, cube_125MZ);
  cube_125MirroredZ.position.set(-0.1368, 0.9015, 0);
  const cube_126Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_126 = new THREE.Mesh(cube_126Geometry, ColoumnMaterial);
  cube_126.scale.set(0.0908, 0.0086, 0.013);
  cube_126.setRotation(1.3195, 1.3148, 0.0672);
  const cube_126MZ = cube_126.clone();
  cube_126MZ.updateMatrixWorld(true);
  cube_126.position.set(0, 0, 0.263);
  cube_126MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_126MZ.position.set(0, 0, -0.2639);
  const cube_126MirroredZ = new THREE.Group();
  cube_126MirroredZ.add(cube_126, cube_126MZ);
  cube_126MirroredZ.position.set(0.4752, 1.0414, 0);
  const cube_127Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_127 = new THREE.Mesh(cube_127Geometry, ColoumnMaterial);
  cube_127.scale.set(0.0849, 0.0086, 0.0036);
  cube_127.setRotation(0.2645, 0.0, -1.3109);
  const cube_127MZ = cube_127.clone();
  cube_127MZ.updateMatrixWorld(true);
  cube_127.position.set(0, 0, 0.1793);
  cube_127MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_127MZ.position.set(0, 0, -0.1802);
  const cube_127MirroredZ = new THREE.Group();
  cube_127MirroredZ.add(cube_127, cube_127MZ);
  cube_127MirroredZ.position.set(0.5156, 0.9777, 0);
  cube_127MirroredZ.setRotation(0.2645, 0.0, -1.3109);
  const cube_127MirroredZMZ = cube_127MirroredZ.clone();
  cube_127MirroredZMZ.updateMatrixWorld(true);
  cube_127MirroredZ.position.set(0, 0, 0.1793);
  cube_127MirroredZMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_127MirroredZMZ.position.set(0, 0, -0.1802);
  const cube_127MirroredZMirroredZ = new THREE.Group();
  cube_127MirroredZMirroredZ.add(cube_127MirroredZ, cube_127MirroredZMZ);
  cube_127MirroredZMirroredZ.position.set(0.5156, 0.9777, 0);
  const cylinder_037Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_037 = new THREE.Mesh(cylinder_037Geometry, ColoumnMaterial);
  cylinder_037.position.set(0.9595, 0.1429, -0.0005);
  cylinder_037.scale.set(0.0817, 0.1676, 0.0817);
  cylinder_037.setRotation(1.5708, 0.0, 0.0);

  const sphere_003Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_003 = new THREE.Mesh(sphere_003Geometry, ColoumnMaterial);
  sphere_003.scale.set(0.08, 0.08, 0.08);
  sphere_003.setRotation(1.5708, 0.0, 0.0);
  const sphere_003MZ = sphere_003.clone();
  sphere_003MZ.updateMatrixWorld(true);
  sphere_003.position.set(0, 0, -0.1681);
  sphere_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sphere_003MZ.position.set(0, 0, 0.1671);
  const sphere_003MirroredZ = new THREE.Group();
  sphere_003MirroredZ.add(sphere_003, sphere_003MZ);
  sphere_003MirroredZ.position.set(0.9595, 0.1429, 0);
  const cube_128Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_128 = new THREE.Mesh(cube_128Geometry, ColoumnMaterial);
  cube_128.position.set(0.7502, 0.2067, -0.0005);
  cube_128.scale.set(0.1506, 0.042, 0.233);
  cube_128.setRotation(0.3098, 1.5708, 0.0);

  const cube_129Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_129 = new THREE.Mesh(cube_129Geometry, MetalMaterial);
  cube_129.position.set(0.7526, 0.2428, -0.0005);
  cube_129.scale.set(0.0423, 0.0157, 0.233);
  cube_129.setRotation(0.3098, 1.5708, 0.0);

  const robot = new THREE.Group();
  robot.add(
    cube_038,
    cube_039,
    cylinder_008,
    cylinder_009MirroredZ,
    plane_001MirroredZ,
    plane_002MirroredZ,
    plane_003MirroredZ,
    plane_004MirroredZ,
    plane_005MirroredZ,
    plane_014MirroredZ,
    plane_015MirroredZ,
    plane_016MirroredZ,
    plane_017MirroredZ,
    plane_018MirroredZ,
    plane_006MirroredZ,
    plane_007MirroredZ,
    plane_008MirroredZ,
    plane_009MirroredZ,
    plane_011MirroredZ,
    cube_042,
    cube_043,
    cube_044,
    cube_045,
    cube_046,
    cube_047,
    cube_048,
    cube_049MirroredZ,
    cube_050MirroredZ,
    cube_051MirroredZ,
    cube_052MirroredZ,
    cube_053MirroredZ,
    cube_072,
    cube_073,
    cube_074MirroredZ,
    cube_075MirroredZ,
    cube_076MirroredZ,
    cube_077MirroredZ,
    cube_078MirroredZ,
    cube_080MirroredZ,
    cube_079MirroredZ,
    cube_081MirroredZ,
    cube_082MirroredZ,
    cube_083MirroredZ,
    cube_084MirroredZ,
    cylinder_010MirroredZ,
    cylinder_011MirroredZ,
    cylinder_013MirroredZ,
    cube_086MirroredZ,
    cube_088MirroredZ,
    cube_089MirroredZ,
    cube_090MirroredZ,
    cube_091MirroredZ,
    cube_093MirroredZ,
    cube_094MirroredZ,
    cube_095MirroredZ,
    cube_087MirroredZ,
    cube_096MirroredZ,
    cube_097MirroredZ,
    cube_098MirroredZ,
    cube_099MirroredZ,
    cube_100MirroredZ,
    cube_101MirroredZ,
    cube_102MirroredZ,
    cylinder_014MirroredZ,
    cylinder_015MirroredZ,
    cylinder_016,
    cylinder_017,
    cube_085MirroredZ,
    cube_103,
    cube_104MirroredZ,
    cube_105MirroredZ,
    cube_106MirroredZ,
    cube_107MirroredZ,
    cube_108MirroredZ,
    cube_109MirroredZ,
    cylinder_018,
    cube_110MirroredZ,
    cylinder_019MirroredZ,
    cylinder_020,
    cube_111,
    cylinder_021,
    cylinder_022,
    cylinder_023,
    cylinder_024,
    cube_112,
    cube_113,
    cube_114,
    cube_115,
    cube_116,
    cylinder_025,
    sphere,
    cylinder_026,
    cylinder_027,
    cube_117,
    cube_118,
    cylinder_028,
    cylinder_029,
    cube_119,
    cube_120,
    cylinder_030,
    cylinder_031,
    cube_121,
    cube_122,
    cylinder_032,
    cylinder_033,
    cube_123,
    cube_124,
    cylinder_034MirroredZ,
    sphere_001MirroredZ,
    cylinder_035MirroredZ,
    sphere_002MirroredZ,
    cylinder_036MirroredZ,
    cube_125MirroredZ,
    cube_126MirroredZ,
    cube_127MirroredZMirroredZ,
    cylinder_037,
    sphere_003MirroredZ,
    cube_128,
    cube_129,
  );
  robot.rotateX(PI / 2);

  const out = new THREE.Object3D();
  out.add(robot);

  // ===== CAMERA 2
  // Cam = DrawSphere(); Cam.position.set(3,0,-0.5); telo.add(Cam);
  cameras.robot = new THREE.PerspectiveCamera(75, WC / HC, 1, 1000);
  cameras.robot.rotation.set(PI / 2, -PI / 2, 0);
  cameras.robot.position.set(-4, 0, 2);
  out.add(cameras.robot);

  // откуда
  RobotMData.Sonar = DrawSphere();
  RobotMData.Sonar.position.set(1.2, 0, 0);
  RobotMData.Sonar.scale.setScalar(0.2);

  // Линия луча
  const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
  const material = new THREE.MeshLambertMaterial({ color: 0xffdd00 });

  let Linetelo;
  Linetelo = new THREE.Mesh(geometry, material);
  Linetelo.position.x = 0.5;
  Linetelo.rotation.z = PI / 2;
  RobotMData.LineH = new THREE.Object3D();
  RobotMData.LineH.add(Linetelo);
  RobotMData.LineH.position.x = RobotMData.Sonar.position.x;
  Linetelo = new THREE.Mesh(geometry, material);
  Linetelo.position.z = -0.5;
  Linetelo.rotation.x = PI / 2;
  RobotMData.LineV = new THREE.Object3D();
  RobotMData.LineV.add(Linetelo);
  RobotMData.LineV.position.x = RobotMData.Sonar.position.x;
  out.add(RobotMData.Sonar, RobotMData.LineH, RobotMData.LineV);

  return out;
  function DrawSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  }
}

function DrawCleanRobot() {
  const Material_002 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0504, 0.209, 1.0),
    roughness: 0.5,
  });
  const Material_001 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const Material_006 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1788, 0.1788, 0.1788),
    roughness: 0.5,
  });
  const Material_007 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.504, 0.4274, 0.4433),
    roughness: 0.5,
  });
  const Material_005 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.0146, 0.0039),
    roughness: 0.5,
  });
  const Material_003 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0154, 0.8, 0.0),
    roughness: 0.5,
  });
  const cylinder_brushesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2254, 0.0735, 0.8924),
  });
  const Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
    metalness: 1.0,
    roughness: 0.5,
  });

  const cylinder_bodyGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_body = new THREE.Mesh(cylinder_bodyGeometry, Material_002);
  cylinder_body.position.set(0.0, 0.1347, -0.0);
  cylinder_body.scale.set(0.5636, -0.0994, 0.5636);

  const cylinder_wheel2Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel2 = new THREE.Mesh(cylinder_wheel2Geometry, Material_001);
  cylinder_wheel2.position.set(-0.3844, 0.0394, 0.2595);
  cylinder_wheel2.scale.set(-0.0516, -0.0176, -0.0515);
  cylinder_wheel2.setRotation(1.8196, -4.5347, 1.5422);

  const sphere_supportGeometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_support = new THREE.Mesh(sphere_supportGeometry, Material_006);
  sphere_support.position.set(0.0, 0.0515, -0.4844);
  sphere_support.scale.set(0.0434, 0.0434, 0.0434);

  const cylinder_wheel3Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel3 = new THREE.Mesh(cylinder_wheel3Geometry, Material_001);
  cylinder_wheel3.position.set(0.0001, 0.0052, -0.4846);
  cylinder_wheel3.scale.set(-0.0159, -0.0054, -0.0158);
  cylinder_wheel3.setRotation(1.8196, -1.8235, 1.5422);

  const cylinder_wheel1Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel1 = new THREE.Mesh(cylinder_wheel1Geometry, Material_001);
  cylinder_wheel1.position.set(0.3747, 0.0394, 0.2595);
  cylinder_wheel1.scale.set(-0.0516, -0.0176, -0.0515);
  cylinder_wheel1.setRotation(-1.322, -2.628, 1.5994);

  const cube_displayGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_display = new THREE.Mesh(cube_displayGeometry, Material_007);
  cube_display.position.set(0.0, 0.2231, -0.0);
  cube_display.scale.set(-0.2711, -0.0151, -0.2711);

  const cylinder_button_offGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_button_off = new THREE.Mesh(
    cylinder_button_offGeometry,
    Material_005,
  );
  cylinder_button_off.position.set(0.0516, 0.2185, -0.4293);
  cylinder_button_off.scale.set(0.0227, 0.0227, 0.0227);

  const cylinder_button_onGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_button_on = new THREE.Mesh(
    cylinder_button_onGeometry,
    Material_003,
  );
  cylinder_button_on.position.set(-0.0509, 0.2185, -0.4293);
  cylinder_button_on.scale.set(0.0227, 0.0227, 0.0227);

  const cylinder_brushesGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_brushes = new THREE.Mesh(
    cylinder_brushesGeometry,
    cylinder_brushesMaterial,
  );
  cylinder_brushes.position.set(0.0, 0.0858, -0.0);
  cylinder_brushes.scale.set(0.0802, 0.28, 0.0802);
  cylinder_brushes.setRotation(0.0, 0.0, -1.5708);

  const cube_antenna1Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_antenna1 = new THREE.Mesh(cube_antenna1Geometry, Material);
  cube_antenna1.position.set(-0.441, 0.3083, -0.0);
  cube_antenna1.scale.set(-0.0949, -0.0088, -0.0041);
  cube_antenna1.setRotation(0.0, 0.0, -1.0986);

  const cube_antenna2Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_antenna2 = new THREE.Mesh(cube_antenna2Geometry, Material);
  cube_antenna2.position.set(0.4558, 0.3083, -0.0);
  cube_antenna2.scale.set(-0.0949, -0.0088, -0.0041);
  cube_antenna2.setRotation(0.0, 3.1416, -1.0986);

  const robot = new THREE.Group();
  robot.add(
    cylinder_body,
    cylinder_wheel2,
    sphere_support,
    cylinder_wheel3,
    cylinder_wheel1,
    cube_display,
    cylinder_button_off,
    cylinder_button_on,
    cylinder_brushes,
    cube_antenna1,
    cube_antenna2,
  );
  robot.rotateX(PI / 2);
  robot.rotateY(-PI / 2);
  robot.position.z -= 0.1;

  const out = new THREE.Group();
  out.add(robot);

  // ===== CAMERA 2
  // Cam = DrawSphere(); Cam.position.set(3,0,-0.5); telo.add(Cam);
  cameras.robotCleaner = new THREE.PerspectiveCamera(75, WC / HC, 1, 1000);
  cameras.robotCleaner.rotation.set(PI / 2, -PI / 2, 0);
  cameras.robotCleaner.position.set(-4, 0, 2);
  out.add(cameras.robotCleaner);

  // откуда
  CleanRobotData.Sonar = DrawSphere();
  CleanRobotData.Sonar.position.set(0.5, 0, 0);
  CleanRobotData.Sonar.scale.setScalar(0.2);

  // Линия луча
  const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
  const material = new THREE.MeshLambertMaterial({ color: 0xffdd00 });

  let Linetelo;
  Linetelo = new THREE.Mesh(geometry, material);
  Linetelo.position.x = 0.5;
  Linetelo.rotation.z = PI / 2;
  CleanRobotData.LineH = new THREE.Object3D();
  CleanRobotData.LineH.add(Linetelo);
  CleanRobotData.LineH.position.x = CleanRobotData.Sonar.position.x;
  Linetelo = new THREE.Mesh(geometry, material);
  Linetelo.position.z = -0.5;
  Linetelo.rotation.x = PI / 2;
  CleanRobotData.LineV = new THREE.Object3D();
  CleanRobotData.LineV.add(Linetelo);
  CleanRobotData.LineV.position.x = CleanRobotData.Sonar.position.x;
  out.add(CleanRobotData.Sonar, CleanRobotData.LineH, CleanRobotData.LineV);

  return out;

  function DrawSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  }
}

function DrawVagonDecorations() {
  const FloorTileMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.686, 0.6165, 0.3163),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.0213, 0.0026),
    metalness: 0.8254,
    roughness: 0.8849,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
    metalness: 1.0,
  });
  const Floor_CentralMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.3902, 0.2623),
    metalness: 0.123,
    roughness: 0.1508,
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
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.5225, 0.0),
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
  });
  const PurpleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3581, 0.0, 0.8),
    roughness: 0.5,
  });

  const cube_307Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_307 = new THREE.Mesh(cube_307Geometry, FloorTileMaterial);
  cube_307.position.set(0.0127, 6.3994, -1.6438);
  cube_307.scale.set(12.5105, 0.1214, 0.8001);
  cube_307.setRotation(-0.2859, 0.0, 0.0);

  const cube_308Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_308 = new THREE.Mesh(cube_308Geometry, FloorTileMaterial);
  cube_308.position.set(0.0127, 6.725, -0.7205);
  cube_308.scale.set(12.5105, 0.1214, 0.2164);
  cube_308.setRotation(1.5708, 0.0, 0.0);

  const cube_309Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_309 = new THREE.Mesh(cube_309Geometry, Metall_RustMaterial);
  cube_309.position.set(0.0127, 6.725, -0.6018);
  cube_309.scale.set(12.4539, 0.0107, 0.1974);
  cube_309.setRotation(1.5708, 0.0, 0.0);

  const cylinder_021Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_021Group = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const cylinder_021 = new THREE.Mesh(
      cylinder_021Geometry,
      Metall_RustMaterial,
    );
    cylinder_021.scale.set(0.3252, 0.052, 0.3252);
    cylinder_021.position.set(-2.732 * i, 0, 0);
    cylinder_021Group.add(cylinder_021);
  }
  cylinder_021Group.position.set(10.931, 6.8703, 0.006);
  const sphere_002Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_002Group = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const sphere_002 = new THREE.Mesh(sphere_002Geometry, RoofTilesMaterial);
    sphere_002.scale.set(0.2453, 0.2164, 0.2453);
    sphere_002.position.set(-2.7314 * i, 0, 0);
    sphere_002Group.add(sphere_002);
  }
  sphere_002Group.position.set(10.931, 6.8266, 0.006);
  const cube_310Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_310Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_310 = new THREE.Mesh(cube_310Geometry, Floor_CentralMaterial);
    cube_310.scale.set(0.0702, 0.2701, 0.4985);
    cube_310.position.set(6.4288 * i, 0, 0);
    cube_310Group.add(cube_310);
  }
  cube_310Group.position.set(-8.4084, 2.5756, -1.8708);
  const cube_311Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_311Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_311 = new THREE.Mesh(cube_311Geometry, Floor_CentralMaterial);
    cube_311.scale.set(0.0702, 0.1597, 0.5837);
    cube_311.position.set(6.4288 * i, 0, 0);
    cube_311Group.add(cube_311);
  }
  cube_311Group.position.set(-8.4084, 3.0054, -1.7856);
  const cube_312Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_312Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_312 = new THREE.Mesh(cube_312Geometry, Floor_CentralMaterial);
    cube_312.scale.set(0.0702, 0.1597, 0.2747);
    cube_312.position.set(6.4288 * i, 0, 0);
    cube_312Group.add(cube_312);
  }
  cube_312Group.setRotation(1.5708, 0.0, 0.0);
  cube_312Group.position.set(-8.4084, 3.4397, -2.2097);
  const cube_313Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_313Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_313 = new THREE.Mesh(cube_313Geometry, Floor_CentralMaterial);
    cube_313.scale.set(0.0702, 0.1264, 0.2747);
    cube_313.position.set(6.4288 * i, 0, 0);
    cube_313Group.add(cube_313);
  }
  cube_313Group.setRotation(3.1416, 0.0, 0.0);
  cube_313Group.position.set(-8.4084, 3.8408, -2.0946);
  const cube_314Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_314Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_314 = new THREE.Mesh(cube_314Geometry, Floor_CentralMaterial);
    cube_314.scale.set(0.0702, 0.1264, 0.3091);
    cube_314.position.set(6.4288 * i, 0, 0);
    cube_314Group.add(cube_314);
  }
  cube_314Group.setRotation(1.9635, 0.0, 0.0);
  cube_314Group.position.set(-8.4084, 3.4772, -2.055);
  const cube_315Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_315Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_315 = new THREE.Mesh(cube_315Geometry, Floor_CentralMaterial);
    cube_315.scale.set(0.0702, 0.1519, 0.4307);
    cube_315.position.set(6.4288 * i, 0, 0);
    cube_315Group.add(cube_315);
  }
  cube_315Group.setRotation(0.3405, 0.0, 0.0);
  cube_315Group.position.set(-8.4084, 3.1657, -1.6586);
  const cube_316Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_316Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_316 = new THREE.Mesh(cube_316Geometry, Floor_CentralMaterial);
    cube_316.scale.set(0.0702, 0.1519, 0.2855);
    cube_316.position.set(6.4288 * i, 0, 0);
    cube_316Group.add(cube_316);
  }
  cube_316Group.setRotation(1.8909, 0.0, -0.0);
  cube_316Group.position.set(-8.4084, 2.6225, -1.4359);
  const cube_317Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_317Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_317 = new THREE.Mesh(cube_317Geometry, Floor_CentralMaterial);
    cube_317.scale.set(0.0702, 0.2701, 0.4985);
    cube_317.position.set(6.4288 * i, 0, 0);
    cube_317Group.add(cube_317);
  }
  cube_317Group.position.set(-4.4057, 2.5756, -1.8708);
  const cube_318Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_318Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_318 = new THREE.Mesh(cube_318Geometry, Floor_CentralMaterial);
    cube_318.scale.set(0.0702, 0.1597, 0.5837);
    cube_318.position.set(6.4288 * i, 0, 0);
    cube_318Group.add(cube_318);
  }
  cube_318Group.position.set(-4.4057, 3.0054, -1.7856);
  const cube_319Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_319Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_319 = new THREE.Mesh(cube_319Geometry, Floor_CentralMaterial);
    cube_319.scale.set(0.0702, 0.1597, 0.2747);
    cube_319.position.set(6.4288 * i, 0, 0);
    cube_319Group.add(cube_319);
  }
  cube_319Group.setRotation(1.5708, 0.0, 0.0);
  cube_319Group.position.set(-4.4057, 3.4397, -2.2097);
  const cube_320Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_320Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_320 = new THREE.Mesh(cube_320Geometry, Floor_CentralMaterial);
    cube_320.scale.set(0.0702, 0.1264, 0.2747);
    cube_320.position.set(6.4288 * i, 0, 0);
    cube_320Group.add(cube_320);
  }
  cube_320Group.setRotation(3.1416, 0.0, 0.0);
  cube_320Group.position.set(-4.4057, 3.8408, -2.0946);
  const cube_321Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_321Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_321 = new THREE.Mesh(cube_321Geometry, Floor_CentralMaterial);
    cube_321.scale.set(0.0702, 0.1264, 0.3091);
    cube_321.position.set(6.4288 * i, 0, 0);
    cube_321Group.add(cube_321);
  }
  cube_321Group.setRotation(1.9635, 0.0, 0.0);
  cube_321Group.position.set(-4.4057, 3.4772, -2.055);
  const cube_322Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_322Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_322 = new THREE.Mesh(cube_322Geometry, Floor_CentralMaterial);
    cube_322.scale.set(0.0702, 0.1519, 0.4307);
    cube_322.position.set(6.4288 * i, 0, 0);
    cube_322Group.add(cube_322);
  }
  cube_322Group.setRotation(0.3405, 0.0, 0.0);
  cube_322Group.position.set(-4.4057, 3.1657, -1.6586);
  const cube_323Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_323Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_323 = new THREE.Mesh(cube_323Geometry, Floor_CentralMaterial);
    cube_323.scale.set(0.0702, 0.1519, 0.2855);
    cube_323.position.set(6.4288 * i, 0, 0);
    cube_323Group.add(cube_323);
  }
  cube_323Group.setRotation(1.8909, 0.0, -0.0);
  cube_323Group.position.set(-4.4057, 2.6225, -1.4359);
  const cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_022Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_022 = new THREE.Mesh(cylinder_022Geometry, MetalMaterial);
    cylinder_022.scale.set(0.039, 0.4636, 0.039);
    cylinder_022.position.set(6.4289 * i, 0, 0);
    cylinder_022Group.add(cylinder_022);
  }
  cylinder_022Group.position.set(-8.4084, 3.6063, -1.3034);
  const cylinder_023Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_023Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_023 = new THREE.Mesh(cylinder_023Geometry, MetalMaterial);
    cylinder_023.scale.set(0.039, 0.2801, 0.039);
    cylinder_023.position.set(6.4297 * i, 0, 0);
    cylinder_023Group.add(cylinder_023);
  }
  cylinder_023Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_023Group.position.set(-8.4084, 3.8477, -1.5809);
  const cylinder_024Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_024Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_024 = new THREE.Mesh(cylinder_024Geometry, MetalMaterial);
    cylinder_024.scale.set(0.0483, 0.033, 0.0483);
    cylinder_024.position.set(6.4293 * i, 0, 0);
    cylinder_024Group.add(cylinder_024);
  }
  cylinder_024Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_024Group.position.set(-8.4084, 3.8477, -1.787);
  const cylinder_025Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_025Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_025 = new THREE.Mesh(cylinder_025Geometry, MetalMaterial);
    cylinder_025.scale.set(0.0543, 0.0831, 0.0543);
    cylinder_025.position.set(6.4289 * i, 0, 0);
    cylinder_025Group.add(cylinder_025);
  }
  cylinder_025Group.position.set(-8.4084, 3.2062, -1.3034);
  const sphere_003Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_003Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sphere_003 = new THREE.Mesh(sphere_003Geometry, MetalMaterial);
    sphere_003.scale.set(0.0552, 0.0552, 0.0552);
    sphere_003.position.set(6.4265 * i, 0, 0);
    sphere_003Group.add(sphere_003);
  }
  sphere_003Group.position.set(-8.4084, 4.0978, -1.3034);
  const cylinder_026Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_026Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_026 = new THREE.Mesh(cylinder_026Geometry, MetalMaterial);
    cylinder_026.scale.set(0.039, 0.5356, 0.039);
    cylinder_026.position.set(6.4297 * i, 0, 0);
    cylinder_026Group.add(cylinder_026);
  }
  cylinder_026Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_026Group.position.set(-4.4057, 4.0978, -1.8363);
  const cylinder_027Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_027Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_027 = new THREE.Mesh(cylinder_027Geometry, MetalMaterial);
    cylinder_027.scale.set(0.0508, 0.0545, 0.0508);
    cylinder_027.position.set(6.4299 * i, 0, 0);
    cylinder_027Group.add(cylinder_027);
  }
  cylinder_027Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_027Group.position.set(-8.4084, 4.0978, -2.3174);
  const cylinder_028Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_028Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_028 = new THREE.Mesh(cylinder_028Geometry, MetalMaterial);
    cylinder_028.scale.set(0.039, 0.5356, 0.039);
    cylinder_028.position.set(6.4297 * i, 0, 0);
    cylinder_028Group.add(cylinder_028);
  }
  cylinder_028Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_028Group.position.set(-8.4084, 4.0978, -1.8363);
  const cylinder_029Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_029Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_029 = new THREE.Mesh(cylinder_029Geometry, MetalMaterial);
    cylinder_029.scale.set(0.0508, 0.0545, 0.0508);
    cylinder_029.position.set(6.4289 * i, 0, 0);
    cylinder_029Group.add(cylinder_029);
  }
  cylinder_029Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_029Group.position.set(-4.4057, 4.0978, -2.3174);
  const sphere_004Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_004Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sphere_004 = new THREE.Mesh(sphere_004Geometry, MetalMaterial);
    sphere_004.scale.set(0.0552, 0.0552, 0.0552);
    sphere_004.position.set(6.4309 * i, 0, 0);
    sphere_004Group.add(sphere_004);
  }
  sphere_004Group.position.set(-4.4057, 4.0978, -1.3034);
  const cube_324Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_324Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_324 = new THREE.Mesh(cube_324Geometry, Metall_RustMaterial);
    cube_324.scale.set(2.0087, 0.071, 0.5573);
    cube_324.position.set(6.4279 * i, 0, 0);
    cube_324Group.add(cube_324);
  }
  cube_324Group.setRotation(3.1416, 0.0, 0.0);
  cube_324Group.position.set(-6.4071, 3.067, -1.8271);
  const cube_325Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_325Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_325 = new THREE.Mesh(cube_325Geometry, Metall_RustMaterial);
    cube_325.scale.set(2.0087, 0.071, 0.4356);
    cube_325.position.set(6.4279 * i, 0, 0);
    cube_325Group.add(cube_325);
  }
  cube_325Group.setRotation(4.465, 0.0, 0.0);
  cube_325Group.position.set(-6.4071, 3.4491, -2.2037);
  const cube_326Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_326Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_326 = new THREE.Mesh(cube_326Geometry, Floor_CentralMaterial);
    cube_326.scale.set(2.0087, 0.071, 0.4033);
    cube_326.position.set(6.4279 * i, 0, 0);
    cube_326Group.add(cube_326);
  }
  cube_326Group.setRotation(1.8968, 0.0, 0.0);
  cube_326Group.position.set(-6.4071, 2.6874, -1.4993);
  const cylinder_030Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_030Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_030 = new THREE.Mesh(cylinder_030Geometry, MetalMaterial);
    cylinder_030.scale.set(0.039, 0.4636, 0.039);
    cylinder_030.position.set(6.4289 * i, 0, 0);
    cylinder_030Group.add(cylinder_030);
  }
  cylinder_030Group.position.set(-4.4057, 3.6063, -1.3034);
  const cylinder_031Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_031Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_031 = new THREE.Mesh(cylinder_031Geometry, MetalMaterial);
    cylinder_031.scale.set(0.039, 0.2801, 0.039);
    cylinder_031.position.set(6.4297 * i, 0, 0);
    cylinder_031Group.add(cylinder_031);
  }
  cylinder_031Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_031Group.position.set(-4.4057, 3.8477, -1.5809);
  const cylinder_032Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_032Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_032 = new THREE.Mesh(cylinder_032Geometry, MetalMaterial);
    cylinder_032.scale.set(0.0483, 0.033, 0.0483);
    cylinder_032.position.set(6.4283 * i, 0, 0);
    cylinder_032Group.add(cylinder_032);
  }
  cylinder_032Group.setRotation(1.5708, 0.0, 0.0);
  cylinder_032Group.position.set(-4.4057, 3.8477, -1.787);
  const cylinder_033Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_033Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_033 = new THREE.Mesh(cylinder_033Geometry, MetalMaterial);
    cylinder_033.scale.set(0.0543, 0.0831, 0.0543);
    cylinder_033.position.set(6.4289 * i, 0, 0);
    cylinder_033Group.add(cylinder_033);
  }
  cylinder_033Group.position.set(-4.4057, 3.2062, -1.3034);
  const cube_327Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_327 = new THREE.Mesh(cube_327Geometry, Green_PictureMaterial);
  cube_327.position.set(-4.8635, 4.8871, -2.3676);
  cube_327.scale.set(0.5148, 0.0124, 0.5964);
  cube_327.setRotation(1.5708, 0.0, 0.0);

  const cube_328Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_328 = new THREE.Mesh(cube_328Geometry, Floor_StripesMaterial);
  cube_328.position.set(7.984, 4.8871, -2.3676);
  cube_328.scale.set(0.5148, 0.0124, 0.5964);
  cube_328.setRotation(1.5708, 0.0, 0.0);

  const cube_329Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_329Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_329 = new THREE.Mesh(cube_329Geometry, Floor_CentralMaterial);
    cube_329.scale.set(0.0702, 0.2701, 0.4985);
    cube_329.position.set(6.4288 * i, 0, 0);
    cube_329Group.add(cube_329);
  }
  cube_329Group.setRotation(0.0, 3.1416, 0.0);
  cube_329Group.position.set(8.4518, 2.5756, 1.8774);
  const cube_330Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_330Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_330 = new THREE.Mesh(cube_330Geometry, Floor_CentralMaterial);
    cube_330.scale.set(0.0702, 0.1597, 0.5837);
    cube_330.position.set(6.4288 * i, 0, 0);
    cube_330Group.add(cube_330);
  }
  cube_330Group.setRotation(0.0, 3.1416, 0.0);
  cube_330Group.position.set(8.4518, 3.0054, 1.7922);
  const cube_331Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_331Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_331 = new THREE.Mesh(cube_331Geometry, Floor_CentralMaterial);
    cube_331.scale.set(0.0702, 0.1597, 0.2747);
    cube_331.position.set(6.4288 * i, 0, 0);
    cube_331Group.add(cube_331);
  }
  cube_331Group.setRotation(1.5708, 3.1416, 0.0);
  cube_331Group.position.set(8.4518, 3.4397, 2.2163);
  const cube_332Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_332Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_332 = new THREE.Mesh(cube_332Geometry, Floor_CentralMaterial);
    cube_332.scale.set(0.0702, 0.1264, 0.2747);
    cube_332.position.set(6.4288 * i, 0, 0);
    cube_332Group.add(cube_332);
  }
  cube_332Group.setRotation(3.1416, 3.1416, 0.0);
  cube_332Group.position.set(8.4518, 3.8408, 2.1012);
  const cube_333Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_333Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_333 = new THREE.Mesh(cube_333Geometry, Floor_CentralMaterial);
    cube_333.scale.set(0.0702, 0.1264, 0.3091);
    cube_333.position.set(6.4288 * i, 0, 0);
    cube_333Group.add(cube_333);
  }
  cube_333Group.setRotation(1.9635, 3.1416, 0.0);
  cube_333Group.position.set(8.4518, 3.4772, 2.0616);
  const cube_334Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_334Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_334 = new THREE.Mesh(cube_334Geometry, Floor_CentralMaterial);
    cube_334.scale.set(0.0702, 0.1519, 0.4307);
    cube_334.position.set(6.4288 * i, 0, 0);
    cube_334Group.add(cube_334);
  }
  cube_334Group.setRotation(0.3405, 3.1416, 0.0);
  cube_334Group.position.set(8.4518, 3.1657, 1.6652);
  const cube_335Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_335Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_335 = new THREE.Mesh(cube_335Geometry, Floor_CentralMaterial);
    cube_335.scale.set(0.0702, 0.1519, 0.2855);
    cube_335.position.set(6.4288 * i, 0, 0);
    cube_335Group.add(cube_335);
  }
  cube_335Group.setRotation(1.8909, 3.1416, 0.0);
  cube_335Group.position.set(8.4518, 2.6225, 1.4425);
  const cube_336Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_336Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_336 = new THREE.Mesh(cube_336Geometry, Floor_CentralMaterial);
    cube_336.scale.set(0.0702, 0.2701, 0.4985);
    cube_336.position.set(6.4288 * i, 0, 0);
    cube_336Group.add(cube_336);
  }
  cube_336Group.setRotation(0.0, 3.1416, 0.0);
  cube_336Group.position.set(4.4491, 2.5756, 1.8774);
  const cube_337Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_337Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_337 = new THREE.Mesh(cube_337Geometry, Floor_CentralMaterial);
    cube_337.scale.set(0.0702, 0.1597, 0.5837);
    cube_337.position.set(6.4288 * i, 0, 0);
    cube_337Group.add(cube_337);
  }
  cube_337Group.setRotation(0.0, 3.1416, 0.0);
  cube_337Group.position.set(4.4491, 3.0054, 1.7922);
  const cube_338Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_338Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_338 = new THREE.Mesh(cube_338Geometry, Floor_CentralMaterial);
    cube_338.scale.set(0.0702, 0.1597, 0.2747);
    cube_338.position.set(6.4288 * i, 0, 0);
    cube_338Group.add(cube_338);
  }
  cube_338Group.setRotation(1.5708, 3.1416, 0.0);
  cube_338Group.position.set(4.4491, 3.4397, 2.2163);
  const cube_339Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_339Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_339 = new THREE.Mesh(cube_339Geometry, Floor_CentralMaterial);
    cube_339.scale.set(0.0702, 0.1264, 0.2747);
    cube_339.position.set(6.4288 * i, 0, 0);
    cube_339Group.add(cube_339);
  }
  cube_339Group.setRotation(3.1416, 3.1416, 0.0);
  cube_339Group.position.set(4.4491, 3.8408, 2.1012);
  const cube_340Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_340Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_340 = new THREE.Mesh(cube_340Geometry, Floor_CentralMaterial);
    cube_340.scale.set(0.0702, 0.1264, 0.3091);
    cube_340.position.set(6.4288 * i, 0, 0);
    cube_340Group.add(cube_340);
  }
  cube_340Group.setRotation(1.9635, 3.1416, 0.0);
  cube_340Group.position.set(4.4491, 3.4772, 2.0616);
  const cube_341Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_341Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_341 = new THREE.Mesh(cube_341Geometry, Floor_CentralMaterial);
    cube_341.scale.set(0.0702, 0.1519, 0.4307);
    cube_341.position.set(6.4288 * i, 0, 0);
    cube_341Group.add(cube_341);
  }
  cube_341Group.setRotation(0.3405, 3.1416, 0.0);
  cube_341Group.position.set(4.4491, 3.1657, 1.6652);
  const cube_342Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_342Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_342 = new THREE.Mesh(cube_342Geometry, Floor_CentralMaterial);
    cube_342.scale.set(0.0702, 0.1519, 0.2855);
    cube_342.position.set(6.4288 * i, 0, 0);
    cube_342Group.add(cube_342);
  }
  cube_342Group.setRotation(1.8909, 3.1416, 0.0);
  cube_342Group.position.set(4.4491, 2.6225, 1.4425);
  const cylinder_034Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_034Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_034 = new THREE.Mesh(cylinder_034Geometry, MetalMaterial);
    cylinder_034.scale.set(0.039, 0.4636, 0.039);
    cylinder_034.position.set(6.4289 * i, 0, 0);
    cylinder_034Group.add(cylinder_034);
  }
  cylinder_034Group.setRotation(0.0, 3.1416, 0.0);
  cylinder_034Group.position.set(8.4518, 3.6063, 1.31);
  const cylinder_035Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_035Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_035 = new THREE.Mesh(cylinder_035Geometry, MetalMaterial);
    cylinder_035.scale.set(0.039, 0.2801, 0.039);
    cylinder_035.position.set(6.4297 * i, 0, 0);
    cylinder_035Group.add(cylinder_035);
  }
  cylinder_035Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_035Group.position.set(8.4518, 3.8477, 1.5875);
  const cylinder_036Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_036Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_036 = new THREE.Mesh(cylinder_036Geometry, MetalMaterial);
    cylinder_036.scale.set(0.0483, 0.033, 0.0483);
    cylinder_036.position.set(6.4293 * i, 0, 0);
    cylinder_036Group.add(cylinder_036);
  }
  cylinder_036Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_036Group.position.set(8.4518, 3.8477, 1.7936);
  const cylinder_037Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_037Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_037 = new THREE.Mesh(cylinder_037Geometry, MetalMaterial);
    cylinder_037.scale.set(0.0543, 0.0831, 0.0543);
    cylinder_037.position.set(6.4289 * i, 0, 0);
    cylinder_037Group.add(cylinder_037);
  }
  cylinder_037Group.setRotation(0.0, 3.1416, 0.0);
  cylinder_037Group.position.set(8.4518, 3.2062, 1.31);
  const sphere_005Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_005Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sphere_005 = new THREE.Mesh(sphere_005Geometry, MetalMaterial);
    sphere_005.scale.set(0.0552, 0.0552, 0.0552);
    sphere_005.position.set(6.4265 * i, 0, 0);
    sphere_005Group.add(sphere_005);
  }
  sphere_005Group.setRotation(0.0, 3.1416, 0.0);
  sphere_005Group.position.set(8.4518, 4.0978, 1.31);
  const cylinder_038Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_038Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_038 = new THREE.Mesh(cylinder_038Geometry, MetalMaterial);
    cylinder_038.scale.set(0.039, 0.5356, 0.039);
    cylinder_038.position.set(6.4297 * i, 0, 0);
    cylinder_038Group.add(cylinder_038);
  }
  cylinder_038Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_038Group.position.set(4.4491, 4.0978, 1.8429);
  const cylinder_040Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_040Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_040 = new THREE.Mesh(cylinder_040Geometry, MetalMaterial);
    cylinder_040.scale.set(0.039, 0.5356, 0.039);
    cylinder_040.position.set(6.4297 * i, 0, 0);
    cylinder_040Group.add(cylinder_040);
  }
  cylinder_040Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_040Group.position.set(8.4518, 4.0978, 1.8429);
  const cylinder_041Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_041Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_041 = new THREE.Mesh(cylinder_041Geometry, MetalMaterial);
    cylinder_041.scale.set(0.0508, 0.0545, 0.0508);
    cylinder_041.position.set(6.4289 * i, 0, 0);
    cylinder_041Group.add(cylinder_041);
  }
  cylinder_041Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_041Group.position.set(4.4491, 4.0978, 2.3241);
  const sphere_006Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_006Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sphere_006 = new THREE.Mesh(sphere_006Geometry, MetalMaterial);
    sphere_006.scale.set(0.0552, 0.0552, 0.0552);
    sphere_006.position.set(6.4309 * i, 0, 0);
    sphere_006Group.add(sphere_006);
  }
  sphere_006Group.setRotation(0.0, 3.1416, 0.0);
  sphere_006Group.position.set(4.4491, 4.0978, 1.31);
  const cube_343Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_343Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_343 = new THREE.Mesh(cube_343Geometry, Metall_RustMaterial);
    cube_343.scale.set(2.0087, 0.071, 0.5573);
    cube_343.position.set(6.4279 * i, 0, 0);
    cube_343Group.add(cube_343);
  }
  cube_343Group.setRotation(3.1416, 3.1416, 0.0);
  cube_343Group.position.set(6.4504, 3.067, 1.8337);
  const cube_344Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_344Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_344 = new THREE.Mesh(cube_344Geometry, Metall_RustMaterial);
    cube_344.scale.set(2.0087, 0.071, 0.4356);
    cube_344.position.set(6.4279 * i, 0, 0);
    cube_344Group.add(cube_344);
  }
  cube_344Group.setRotation(4.465, 3.1416, 0.0);
  cube_344Group.position.set(6.4504, 3.4491, 2.2104);
  const cube_345Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_345Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_345 = new THREE.Mesh(cube_345Geometry, Floor_CentralMaterial);
    cube_345.scale.set(2.0087, 0.071, 0.4033);
    cube_345.position.set(6.4279 * i, 0, 0);
    cube_345Group.add(cube_345);
  }
  cube_345Group.setRotation(1.8968, 3.1416, 0.0);
  cube_345Group.position.set(6.4504, 2.6874, 1.5059);
  const cylinder_042Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_042Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_042 = new THREE.Mesh(cylinder_042Geometry, MetalMaterial);
    cylinder_042.scale.set(0.039, 0.4636, 0.039);
    cylinder_042.position.set(6.4289 * i, 0, 0);
    cylinder_042Group.add(cylinder_042);
  }
  cylinder_042Group.setRotation(0.0, 3.1416, 0.0);
  cylinder_042Group.position.set(4.4491, 3.6063, 1.31);
  const cylinder_043Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_043Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_043 = new THREE.Mesh(cylinder_043Geometry, MetalMaterial);
    cylinder_043.scale.set(0.039, 0.2801, 0.039);
    cylinder_043.position.set(6.4297 * i, 0, 0);
    cylinder_043Group.add(cylinder_043);
  }
  cylinder_043Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_043Group.position.set(4.4491, 3.8477, 1.5875);
  const cylinder_044Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_044Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_044 = new THREE.Mesh(cylinder_044Geometry, MetalMaterial);
    cylinder_044.scale.set(0.0483, 0.033, 0.0483);
    cylinder_044.position.set(6.4283 * i, 0, 0);
    cylinder_044Group.add(cylinder_044);
  }
  cylinder_044Group.setRotation(1.5708, 3.1416, 0.0);
  cylinder_044Group.position.set(4.4491, 3.8477, 1.7936);
  const cylinder_045Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_045Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cylinder_045 = new THREE.Mesh(cylinder_045Geometry, MetalMaterial);
    cylinder_045.scale.set(0.0543, 0.0831, 0.0543);
    cylinder_045.position.set(6.4289 * i, 0, 0);
    cylinder_045Group.add(cylinder_045);
  }
  cylinder_045Group.setRotation(0.0, 3.1416, 0.0);
  cylinder_045Group.position.set(4.4491, 3.2062, 1.31);
  const cube_346Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_346 = new THREE.Mesh(cube_346Geometry, Floor_StripesMaterial);
  cube_346.position.set(1.5609, 4.8871, 2.3723);
  cube_346.scale.set(0.5148, 0.0124, 0.5964);
  cube_346.setRotation(1.5708, 0.0, 0.0);

  const cube_347Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_347 = new THREE.Mesh(cube_347Geometry, WhiteDotsMaterial);
  cube_347.position.set(0.0113, 5.8328, -2.3649);
  cube_347.scale.set(1.973, 0.0148, 0.1951);
  cube_347.setRotation(1.5708, 0.0, 0.0);

  const cylinder_046Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_046 = new THREE.Mesh(cylinder_046Geometry, PurpleMaterial);
  cylinder_046.position.set(-1.7525, 5.8328, -2.3461);
  cylinder_046.scale.set(0.1498, 0.0122, 0.1498);
  cylinder_046.setRotation(1.5708, 0.0, 0.0);

  const cube_348Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_348 = new THREE.Mesh(cube_348Geometry, PurpleMaterial);
  cube_348.position.set(0.0113, 5.8328, -2.3606);
  cube_348.scale.set(1.8175, 0.0148, 0.0586);
  cube_348.setRotation(1.5708, 0.0, 0.0);

  const cylinder_047Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_047 = new THREE.Mesh(
    cylinder_047Geometry,
    Green_PictureMaterial,
  );
  cylinder_047.position.set(0.5851, 5.8328, -2.3461);
  cylinder_047.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_047.setRotation(1.6353, 0.0, -4.7124);

  const cylinder_048Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_048 = new THREE.Mesh(
    cylinder_048Geometry,
    Floor_StripesMaterial,
  );
  cylinder_048.position.set(-0.5837, 5.8328, -2.3461);
  cylinder_048.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_048.setRotation(1.4952, 0.0, -1.5708);

  const cube_349Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_349 = new THREE.Mesh(cube_349Geometry, WhiteDotsMaterial);
  cube_349.position.set(6.4755, 5.8328, 2.3389);
  cube_349.scale.set(1.973, 0.0148, 0.1951);
  cube_349.setRotation(1.5708, 3.1416, 0.0);

  const cylinder_049Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_049 = new THREE.Mesh(cylinder_049Geometry, PurpleMaterial);
  cylinder_049.position.set(8.2393, 5.8328, 2.3201);
  cylinder_049.scale.set(0.1498, 0.0122, 0.1498);
  cylinder_049.setRotation(1.5708, 3.1416, 0.0);

  const cube_350Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_350 = new THREE.Mesh(cube_350Geometry, PurpleMaterial);
  cube_350.position.set(6.4755, 5.8328, 2.3346);
  cube_350.scale.set(1.8175, 0.0148, 0.0586);
  cube_350.setRotation(1.5708, 3.1416, 0.0);

  const cylinder_050Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_050 = new THREE.Mesh(
    cylinder_050Geometry,
    Green_PictureMaterial,
  );
  cylinder_050.position.set(5.9017, 5.8328, 2.3201);
  cylinder_050.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_050.setRotation(4.7769, 0.0, -4.7124);

  const cylinder_051Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_051 = new THREE.Mesh(
    cylinder_051Geometry,
    Floor_StripesMaterial,
  );
  cylinder_051.position.set(7.0705, 5.8328, 2.3201);
  cylinder_051.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_051.setRotation(-1.6464, 0.0, -1.5708);

  const cube_351Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_351 = new THREE.Mesh(cube_351Geometry, WhiteDotsMaterial);
  cube_351.position.set(-6.4193, 5.8328, 2.3389);
  cube_351.scale.set(1.973, 0.0148, 0.1951);
  cube_351.setRotation(1.5708, 3.1416, 0.0);

  const cylinder_052Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_052 = new THREE.Mesh(cylinder_052Geometry, PurpleMaterial);
  cylinder_052.position.set(-4.6554, 5.8328, 2.3201);
  cylinder_052.scale.set(0.1498, 0.0122, 0.1498);
  cylinder_052.setRotation(1.5708, 3.1416, 0.0);

  const cube_352Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_352 = new THREE.Mesh(cube_352Geometry, PurpleMaterial);
  cube_352.position.set(-6.4193, 5.8328, 2.3346);
  cube_352.scale.set(1.8175, 0.0148, 0.0586);
  cube_352.setRotation(1.5708, 3.1416, 0.0);

  const cylinder_053Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_053 = new THREE.Mesh(
    cylinder_053Geometry,
    Green_PictureMaterial,
  );
  cylinder_053.position.set(-6.993, 5.8328, 2.3201);
  cylinder_053.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_053.setRotation(4.7769, 0.0, -4.7124);

  const cylinder_054Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_054 = new THREE.Mesh(
    cylinder_054Geometry,
    Floor_StripesMaterial,
  );
  cylinder_054.position.set(-5.8242, 5.8328, 2.3201);
  cylinder_054.scale.set(0.1489, 0.0121, 0.1489);
  cylinder_054.setRotation(-1.6464, 0.0, -1.5708);

  const cylinder_055Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_055 = new THREE.Mesh(cylinder_055Geometry, MetalMaterial);
  cylinder_055.position.set(0.0127, 6.1242, -0.7744);
  cylinder_055.scale.set(0.039, 12.4875, 0.039);
  cylinder_055.setRotation(1.5708, 1.5708, 0.0);

  const cylinder_056Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_056 = new THREE.Mesh(cylinder_056Geometry, MetalMaterial);
  cylinder_056.position.set(0.0127, 6.1242, 0.786);
  cylinder_056.scale.set(0.039, 12.4875, 0.039);
  cylinder_056.setRotation(1.5708, 1.5708, 0.0);

  const cylinder_057Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_057Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cylinder_057 = new THREE.Mesh(cylinder_057Geometry, MetalMaterial);
    cylinder_057.scale.set(0.0389, 0.2166, 0.0389);
    cylinder_057.position.set(5.5554 * i, 0, 0);
    cylinder_057Group.add(cylinder_057);
  }
  cylinder_057Group.position.set(-10.8298, 6.3231, -0.7744);
  const cylinder_058Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_058Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cylinder_058 = new THREE.Mesh(cylinder_058Geometry, MetalMaterial);
    cylinder_058.scale.set(0.0389, 0.2162, 0.0389);
    cylinder_058.position.set(5.5456 * i, 0, 0);
    cylinder_058Group.add(cylinder_058);
  }
  cylinder_058Group.position.set(-10.8298, 6.3231, 0.7876);
  const cube_353Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_353 = new THREE.Mesh(cube_353Geometry, FloorTileMaterial);
  cube_353.position.set(0.0127, 6.3994, 1.6559);
  cube_353.scale.set(12.5105, 0.1214, 0.8001);
  cube_353.setRotation(-0.2859, 3.1416, 0.0);

  const cube_116Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_116 = new THREE.Mesh(cube_116Geometry, FloorTileMaterial);
  cube_116.position.set(0.0127, 6.725, 0.7325);
  cube_116.scale.set(12.5105, 0.1214, 0.2164);
  cube_116.setRotation(1.5708, 0.0, 0.0);

  const cube_145Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_145 = new THREE.Mesh(cube_145Geometry, Metall_RustMaterial);
  cube_145.position.set(0.0127, 6.725, 0.6138);
  cube_145.scale.set(12.4539, 0.0107, 0.1974);
  cube_145.setRotation(1.5708, 0.0, 0.0);

  const out = new THREE.Group();
  out.add(
    cube_307,
    cube_308,
    cube_309,
    cylinder_021Group,
    sphere_002Group,
    cube_310Group,
    cube_311Group,
    cube_312Group,
    cube_313Group,
    cube_314Group,
    cube_315Group,
    cube_316Group,
    cube_317Group,
    cube_318Group,
    cube_319Group,
    cube_320Group,
    cube_321Group,
    cube_322Group,
    cube_323Group,
    cylinder_022Group,
    cylinder_023Group,
    cylinder_024Group,
    cylinder_025Group,
    sphere_003Group,
    cylinder_026Group,
    cylinder_027Group,
    cylinder_028Group,
    cylinder_029Group,
    sphere_004Group,
    cube_324Group,
    cube_325Group,
    cube_326Group,
    cylinder_030Group,
    cylinder_031Group,
    cylinder_032Group,
    cylinder_033Group,
    cube_327,
    cube_328,
    cube_329Group,
    cube_330Group,
    cube_331Group,
    cube_332Group,
    cube_333Group,
    cube_334Group,
    cube_335Group,
    cube_336Group,
    cube_337Group,
    cube_338Group,
    cube_339Group,
    cube_340Group,
    cube_341Group,
    cube_342Group,
    cylinder_034Group,
    cylinder_035Group,
    cylinder_036Group,
    cylinder_037Group,
    sphere_005Group,
    cylinder_038Group,
    cylinder_040Group,
    cylinder_041Group,
    sphere_006Group,
    cube_343Group,
    cube_344Group,
    cube_345Group,
    cylinder_042Group,
    cylinder_043Group,
    cylinder_044Group,
    cylinder_045Group,
    cube_346,
    cube_347,
    cylinder_046,
    cube_348,
    cylinder_047,
    cylinder_048,
    cube_349,
    cylinder_049,
    cube_350,
    cylinder_050,
    cylinder_051,
    cube_351,
    cylinder_052,
    cube_352,
    cylinder_053,
    cylinder_054,
    cylinder_055,
    cylinder_056,
    cylinder_057Group,
    cylinder_058Group,
    cube_353,
    cube_116,
    cube_145,
  );

  return out;
}

function DrawVagon() {
  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
    metalness: 1.0,
    emissive: new THREE.Color(1.0, 1.0, 1.0),
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.1467, 0.2457, 0.8),
    roughness: 0.5,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.5225, 0.0),
  });
  const Train_blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0343, 0.1009, 0.652),
    roughness: 0.5,
  });
  const GlassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2227, 0.241, 0.3264),
    transparent: true,
    opacity: 0.315,
    roughness: 0.5,
  });
  const Ceiling_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3757, 0.298, 0.0955),
    roughness: 0.119,
  });
  const Floor_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3506, 0.1574, 0.0969),
    metalness: 1.0,
    roughness: 0.5397,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });

  const cylinder_wheel_008Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_008 = new THREE.Mesh(
    cylinder_wheel_008Geometry,
    ColoumnMaterial,
  );
  cylinder_wheel_008.scale.set(0.8096, 0.1641, 0.8096);
  cylinder_wheel_008.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_008MZ = cylinder_wheel_008.clone();
  cylinder_wheel_008MZ.updateMatrixWorld(true);
  cylinder_wheel_008.position.set(0, 0, -2.124);
  cylinder_wheel_008MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_008MZ.position.set(0, 0, 2.124);
  const cylinder_wheel_008MirroredZ = new THREE.Group();
  cylinder_wheel_008MirroredZ.add(cylinder_wheel_008, cylinder_wheel_008MZ);
  cylinder_wheel_008MirroredZ.position.set(-6.1348, 0.7716, 0);
  const cylinder_wheel_009Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_009 = new THREE.Mesh(
    cylinder_wheel_009Geometry,
    RoofTilesMaterial,
  );
  cylinder_wheel_009.scale.set(0.509, 0.1032, 0.509);
  cylinder_wheel_009.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_009MZ = cylinder_wheel_009.clone();
  cylinder_wheel_009MZ.updateMatrixWorld(true);
  cylinder_wheel_009.position.set(0, 0, -2.3912);
  cylinder_wheel_009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_009MZ.position.set(0, 0, 2.3912);
  const cylinder_wheel_009MirroredZ = new THREE.Group();
  cylinder_wheel_009MirroredZ.add(cylinder_wheel_009, cylinder_wheel_009MZ);
  cylinder_wheel_009MirroredZ.position.set(-6.1348, 0.7716, 0);
  const cylinder_wheel_010Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_010 = new THREE.Mesh(
    cylinder_wheel_010Geometry,
    ColoumnMaterial,
  );
  cylinder_wheel_010.scale.set(0.8096, 0.1641, 0.8096);
  cylinder_wheel_010.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_010MZ = cylinder_wheel_010.clone();
  cylinder_wheel_010MZ.updateMatrixWorld(true);
  cylinder_wheel_010.position.set(0, 0, -2.124);
  cylinder_wheel_010MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_010MZ.position.set(0, 0, 2.124);
  const cylinder_wheel_010MirroredZ = new THREE.Group();
  cylinder_wheel_010MirroredZ.add(cylinder_wheel_010, cylinder_wheel_010MZ);
  cylinder_wheel_010MirroredZ.position.set(-10.4008, 0.7716, 0);
  const cylinder_wheel_011Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_011 = new THREE.Mesh(
    cylinder_wheel_011Geometry,
    RoofTilesMaterial,
  );
  cylinder_wheel_011.scale.set(0.509, 0.1032, 0.509);
  cylinder_wheel_011.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_011MZ = cylinder_wheel_011.clone();
  cylinder_wheel_011MZ.updateMatrixWorld(true);
  cylinder_wheel_011.position.set(0, 0, -2.3912);
  cylinder_wheel_011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_011MZ.position.set(0, 0, 2.3912);
  const cylinder_wheel_011MirroredZ = new THREE.Group();
  cylinder_wheel_011MirroredZ.add(cylinder_wheel_011, cylinder_wheel_011MZ);
  cylinder_wheel_011MirroredZ.position.set(-10.4008, 0.7716, 0);
  const cube_307Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_307 = new THREE.Mesh(cube_307Geometry, Blue_PictureMaterial);
  cube_307.position.set(-0.0006, 1.9794, -0.0);
  cube_307.scale.set(12.5898, 0.2671, 2.4701);

  const cube_308Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_308 = new THREE.Mesh(cube_308Geometry, ColoumnMaterial);
  cube_308.scale.set(0.1708, 0.4672, 0.1996);
  cube_308.setRotation(0.0, 0.0, -0.0);
  const cube_308MZ = cube_308.clone();
  cube_308MZ.updateMatrixWorld(true);
  cube_308.position.set(0, 0, -1.1446);
  cube_308MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_308MZ.position.set(0, 0, 1.1446);
  const cube_308MirroredZ = new THREE.Group();
  cube_308MirroredZ.add(cube_308, cube_308MZ);
  cube_308MirroredZ.position.set(-6.1348, 1.2844, 0);
  const cube_309Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_309 = new THREE.Mesh(cube_309Geometry, ColoumnMaterial);
  cube_309.scale.set(0.1708, 0.2173, 0.1996);
  cube_309.setRotation(0.0, 0.0, -0.0);
  const cube_309MZ = cube_309.clone();
  cube_309MZ.updateMatrixWorld(true);
  cube_309.position.set(0, 0, -1.763);
  cube_309MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_309MZ.position.set(0, 0, 1.7629);
  const cube_309MirroredZ = new THREE.Group();
  cube_309MirroredZ.add(cube_309, cube_309MZ);
  cube_309MirroredZ.position.set(-6.1348, 0.7716, 0);
  const cube_310Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_310 = new THREE.Mesh(cube_310Geometry, ColoumnMaterial);
  cube_310.scale.set(0.1708, 0.1639, 0.3627);
  cube_310.setRotation(-0.5678, 0.0, 0.0);
  const cube_310MZ = cube_310.clone();
  cube_310MZ.updateMatrixWorld(true);
  cube_310.position.set(0, 0, -1.3783);
  cube_310MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_310MZ.position.set(0, 0, 1.3783);
  const cube_310MirroredZ = new THREE.Group();
  cube_310MirroredZ.add(cube_310, cube_310MZ);
  cube_310MirroredZ.position.set(-6.1348, 0.9047, 0);
  const cylinder_021Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_021Group = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cylinder_021 = new THREE.Mesh(cylinder_021Geometry, ColoumnMaterial);
    cylinder_021.scale.set(0.1218, 0.3642, 0.1218);
    cylinder_021.position.set(0.4874 * i, 0, 0);
    cylinder_021Group.add(cylinder_021);
  }
  cylinder_021Group.setRotation(0.0, 0.0, -0.0);
  const cylinder_021GroupMZ = cylinder_021Group.clone();
  cylinder_021GroupMZ.updateMatrixWorld(true);
  cylinder_021Group.position.set(0, 0, -2.102);
  cylinder_021GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_021GroupMZ.position.set(0, 0, 2.102);
  const cylinder_021GroupMirroredZ = new THREE.Group();
  cylinder_021GroupMirroredZ.add(cylinder_021Group, cylinder_021GroupMZ);
  cylinder_021GroupMirroredZ.position.set(-8.9801, 1.0627, 0);
  const cube_311Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_311 = new THREE.Mesh(cube_311Geometry, ColoumnMaterial);
  cube_311.scale.set(2.8418, 0.1639, 0.0489);
  cube_311.setRotation(0.0, 0.0, -0.0);
  const cube_311MZ = cube_311.clone();
  cube_311MZ.updateMatrixWorld(true);
  cube_311.position.set(0, 0, -1.8431);
  cube_311MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_311MZ.position.set(0, 0, 1.8431);
  const cube_311MirroredZ = new THREE.Group();
  cube_311MirroredZ.add(cube_311, cube_311MZ);
  cube_311MirroredZ.position.set(-8.2678, 0.7884, 0);
  const cube_312Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_312 = new THREE.Mesh(cube_312Geometry, ColoumnMaterial);
  cube_312.scale.set(0.1708, 0.1639, 0.3627);
  cube_312.setRotation(-0.5678, 0.0, 0.0);
  const cube_312MZ = cube_312.clone();
  cube_312MZ.updateMatrixWorld(true);
  cube_312.position.set(0, 0, -1.3783);
  cube_312MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_312MZ.position.set(0, 0, 1.3783);
  const cube_312MirroredZ = new THREE.Group();
  cube_312MirroredZ.add(cube_312, cube_312MZ);
  cube_312MirroredZ.position.set(-10.4008, 0.9047, 0);
  const cube_313Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_313 = new THREE.Mesh(cube_313Geometry, ColoumnMaterial);
  cube_313.scale.set(0.1708, 0.4672, 0.1996);
  cube_313.setRotation(0.0, 0.0, -0.0);
  const cube_313MZ = cube_313.clone();
  cube_313MZ.updateMatrixWorld(true);
  cube_313.position.set(0, 0, -1.1446);
  cube_313MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_313MZ.position.set(0, 0, 1.1446);
  const cube_313MirroredZ = new THREE.Group();
  cube_313MirroredZ.add(cube_313, cube_313MZ);
  cube_313MirroredZ.position.set(-10.4008, 1.2844, 0);
  const cube_314Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_314 = new THREE.Mesh(cube_314Geometry, ColoumnMaterial);
  cube_314.scale.set(2.8418, 0.1639, 0.0489);
  cube_314.setRotation(0.0, 0.0, -0.0);
  const cube_314MZ = cube_314.clone();
  cube_314MZ.updateMatrixWorld(true);
  cube_314.position.set(0, 0, -2.3571);
  cube_314MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_314MZ.position.set(0, 0, 2.357);
  const cube_314MirroredZ = new THREE.Group();
  cube_314MirroredZ.add(cube_314, cube_314MZ);
  cube_314MirroredZ.position.set(-8.2678, 1.5807, 0);
  const cube_315Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_315 = new THREE.Mesh(cube_315Geometry, ColoumnMaterial);
  cube_315.scale.set(1.0521, 0.1639, 0.0812);
  cube_315.setRotation(0.0, 0.0, -0.0);
  const cube_315MZ = cube_315.clone();
  cube_315MZ.updateMatrixWorld(true);
  cube_315.position.set(0, 0, -2.3912);
  cube_315MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_315MZ.position.set(0, 0, 2.3912);
  const cube_315MirroredZ = new THREE.Group();
  cube_315MirroredZ.add(cube_315, cube_315MZ);
  cube_315MirroredZ.position.set(-8.2678, 0.7716, 0);
  const cube_316Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_316 = new THREE.Mesh(cube_316Geometry, ColoumnMaterial);
  cube_316.scale.set(0.1708, 0.2173, 0.1996);
  cube_316.setRotation(0.0, 0.0, -0.0);
  const cube_316MZ = cube_316.clone();
  cube_316MZ.updateMatrixWorld(true);
  cube_316.position.set(0, 0, -1.763);
  cube_316MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_316MZ.position.set(0, 0, 1.7629);
  const cube_316MirroredZ = new THREE.Group();
  cube_316MirroredZ.add(cube_316, cube_316MZ);
  cube_316MirroredZ.position.set(-10.4008, 0.7716, 0);
  const cylinder_wheel_012Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_012 = new THREE.Mesh(
    cylinder_wheel_012Geometry,
    ColoumnMaterial,
  );
  cylinder_wheel_012.scale.set(0.8096, 0.1641, 0.8096);
  cylinder_wheel_012.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_012MZ = cylinder_wheel_012.clone();
  cylinder_wheel_012MZ.updateMatrixWorld(true);
  cylinder_wheel_012.position.set(0, 0, -2.124);
  cylinder_wheel_012MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_012MZ.position.set(0, 0, 2.124);
  const cylinder_wheel_012MirroredZ = new THREE.Group();
  cylinder_wheel_012MirroredZ.add(cylinder_wheel_012, cylinder_wheel_012MZ);
  cylinder_wheel_012MirroredZ.position.set(11.1541, 0.7716, 0);
  const cylinder_wheel_013Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_013 = new THREE.Mesh(
    cylinder_wheel_013Geometry,
    RoofTilesMaterial,
  );
  cylinder_wheel_013.scale.set(0.509, 0.1032, 0.509);
  cylinder_wheel_013.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_013MZ = cylinder_wheel_013.clone();
  cylinder_wheel_013MZ.updateMatrixWorld(true);
  cylinder_wheel_013.position.set(0, 0, -2.3912);
  cylinder_wheel_013MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_013MZ.position.set(0, 0, 2.3912);
  const cylinder_wheel_013MirroredZ = new THREE.Group();
  cylinder_wheel_013MirroredZ.add(cylinder_wheel_013, cylinder_wheel_013MZ);
  cylinder_wheel_013MirroredZ.position.set(11.1541, 0.7716, 0);
  const cylinder_wheel_014Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_014 = new THREE.Mesh(
    cylinder_wheel_014Geometry,
    ColoumnMaterial,
  );
  cylinder_wheel_014.scale.set(0.8096, 0.1641, 0.8096);
  cylinder_wheel_014.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_014MZ = cylinder_wheel_014.clone();
  cylinder_wheel_014MZ.updateMatrixWorld(true);
  cylinder_wheel_014.position.set(0, 0, -2.124);
  cylinder_wheel_014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_014MZ.position.set(0, 0, 2.124);
  const cylinder_wheel_014MirroredZ = new THREE.Group();
  cylinder_wheel_014MirroredZ.add(cylinder_wheel_014, cylinder_wheel_014MZ);
  cylinder_wheel_014MirroredZ.position.set(6.8881, 0.7716, 0);
  const cylinder_wheel_015Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_wheel_015 = new THREE.Mesh(
    cylinder_wheel_015Geometry,
    RoofTilesMaterial,
  );
  cylinder_wheel_015.scale.set(0.509, 0.1032, 0.509);
  cylinder_wheel_015.setRotation(1.5708, 0.0, 0.0);
  const cylinder_wheel_015MZ = cylinder_wheel_015.clone();
  cylinder_wheel_015MZ.updateMatrixWorld(true);
  cylinder_wheel_015.position.set(0, 0, -2.3912);
  cylinder_wheel_015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_wheel_015MZ.position.set(0, 0, 2.3912);
  const cylinder_wheel_015MirroredZ = new THREE.Group();
  cylinder_wheel_015MirroredZ.add(cylinder_wheel_015, cylinder_wheel_015MZ);
  cylinder_wheel_015MirroredZ.position.set(6.8881, 0.7716, 0);
  const cube_317Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_317 = new THREE.Mesh(cube_317Geometry, ColoumnMaterial);
  cube_317.scale.set(0.1708, 0.4672, 0.1996);
  cube_317.setRotation(0.0, 0.0, -0.0);
  const cube_317MZ = cube_317.clone();
  cube_317MZ.updateMatrixWorld(true);
  cube_317.position.set(0, 0, -1.1446);
  cube_317MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_317MZ.position.set(0, 0, 1.1446);
  const cube_317MirroredZ = new THREE.Group();
  cube_317MirroredZ.add(cube_317, cube_317MZ);
  cube_317MirroredZ.position.set(11.1541, 1.2844, 0);
  const cube_318Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_318 = new THREE.Mesh(cube_318Geometry, ColoumnMaterial);
  cube_318.scale.set(0.1708, 0.2173, 0.1996);
  cube_318.setRotation(0.0, 0.0, -0.0);
  const cube_318MZ = cube_318.clone();
  cube_318MZ.updateMatrixWorld(true);
  cube_318.position.set(0, 0, -1.763);
  cube_318MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_318MZ.position.set(0, 0, 1.7629);
  const cube_318MirroredZ = new THREE.Group();
  cube_318MirroredZ.add(cube_318, cube_318MZ);
  cube_318MirroredZ.position.set(11.1541, 0.7716, 0);
  const cube_319Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_319 = new THREE.Mesh(cube_319Geometry, ColoumnMaterial);
  cube_319.scale.set(0.1708, 0.1639, 0.3627);
  cube_319.setRotation(-0.5678, 0.0, 0.0);
  const cube_319MZ = cube_319.clone();
  cube_319MZ.updateMatrixWorld(true);
  cube_319.position.set(0, 0, -1.3783);
  cube_319MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_319MZ.position.set(0, 0, 1.3783);
  const cube_319MirroredZ = new THREE.Group();
  cube_319MirroredZ.add(cube_319, cube_319MZ);
  cube_319MirroredZ.position.set(11.1541, 0.9047, 0);
  const cube_320Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_320 = new THREE.Mesh(cube_320Geometry, ColoumnMaterial);
  cube_320.scale.set(2.8418, 0.1639, 0.0489);
  cube_320.setRotation(0.0, 0.0, -0.0);
  const cube_320MZ = cube_320.clone();
  cube_320MZ.updateMatrixWorld(true);
  cube_320.position.set(0, 0, -1.8431);
  cube_320MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_320MZ.position.set(0, 0, 1.8431);
  const cube_320MirroredZ = new THREE.Group();
  cube_320MirroredZ.add(cube_320, cube_320MZ);
  cube_320MirroredZ.position.set(9.0211, 0.7884, 0);
  const cube_321Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_321 = new THREE.Mesh(cube_321Geometry, ColoumnMaterial);
  cube_321.scale.set(0.1708, 0.1639, 0.3627);
  cube_321.setRotation(-0.5678, 0.0, 0.0);
  const cube_321MZ = cube_321.clone();
  cube_321MZ.updateMatrixWorld(true);
  cube_321.position.set(0, 0, -1.3783);
  cube_321MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_321MZ.position.set(0, 0, 1.3783);
  const cube_321MirroredZ = new THREE.Group();
  cube_321MirroredZ.add(cube_321, cube_321MZ);
  cube_321MirroredZ.position.set(6.8881, 0.9047, 0);
  const cube_322Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_322 = new THREE.Mesh(cube_322Geometry, ColoumnMaterial);
  cube_322.scale.set(0.1708, 0.4672, 0.1996);
  cube_322.setRotation(0.0, 0.0, -0.0);
  const cube_322MZ = cube_322.clone();
  cube_322MZ.updateMatrixWorld(true);
  cube_322.position.set(0, 0, -1.1446);
  cube_322MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_322MZ.position.set(0, 0, 1.1446);
  const cube_322MirroredZ = new THREE.Group();
  cube_322MirroredZ.add(cube_322, cube_322MZ);
  cube_322MirroredZ.position.set(6.8881, 1.2844, 0);
  const cube_323Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_323 = new THREE.Mesh(cube_323Geometry, ColoumnMaterial);
  cube_323.scale.set(2.8418, 0.1639, 0.0489);
  cube_323.setRotation(0.0, 0.0, -0.0);
  const cube_323MZ = cube_323.clone();
  cube_323MZ.updateMatrixWorld(true);
  cube_323.position.set(0, 0, -2.3571);
  cube_323MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_323MZ.position.set(0, 0, 2.357);
  const cube_323MirroredZ = new THREE.Group();
  cube_323MirroredZ.add(cube_323, cube_323MZ);
  cube_323MirroredZ.position.set(9.0211, 1.5807, 0);
  const cube_324Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_324 = new THREE.Mesh(cube_324Geometry, ColoumnMaterial);
  cube_324.scale.set(1.0521, 0.1639, 0.0812);
  cube_324.setRotation(0.0, 0.0, -0.0);
  const cube_324MZ = cube_324.clone();
  cube_324MZ.updateMatrixWorld(true);
  cube_324.position.set(0, 0, -2.3912);
  cube_324MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_324MZ.position.set(0, 0, 2.3912);
  const cube_324MirroredZ = new THREE.Group();
  cube_324MirroredZ.add(cube_324, cube_324MZ);
  cube_324MirroredZ.position.set(9.0211, 0.7716, 0);
  const cube_325Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_325 = new THREE.Mesh(cube_325Geometry, ColoumnMaterial);
  cube_325.scale.set(0.1708, 0.2173, 0.1996);
  cube_325.setRotation(0.0, 0.0, -0.0);
  const cube_325MZ = cube_325.clone();
  cube_325MZ.updateMatrixWorld(true);
  cube_325.position.set(0, 0, -1.763);
  cube_325MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_325MZ.position.set(0, 0, 1.7629);
  const cube_325MirroredZ = new THREE.Group();
  cube_325MirroredZ.add(cube_325, cube_325MZ);
  cube_325MirroredZ.position.set(6.8881, 0.7716, 0);
  const cube_326Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_326 = new THREE.Mesh(cube_326Geometry, Blue_PictureMaterial);
  cube_326.scale.set(0.9318, 0.051, 2.4701);
  cube_326.setRotation(1.5708, 0.0, 0.0);
  const cube_326MZ = cube_326.clone();
  cube_326MZ.updateMatrixWorld(true);
  cube_326.position.set(0, 0, -2.4192);
  cube_326MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_326MZ.position.set(0, 0, 2.4191);
  const cube_326MirroredZ = new THREE.Group();
  cube_326MirroredZ.add(cube_326, cube_326MZ);
  cube_326MirroredZ.position.set(-11.6586, 4.7166, 0);
  const cube_327Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_327 = new THREE.Mesh(cube_327Geometry, Blue_PictureMaterial);
  cube_327.scale.set(0.8412, 0.0446, 0.9062);
  cube_327.setRotation(1.5708, 1.5708, 0.0);
  const cube_327MZ = cube_327.clone();
  cube_327MZ.updateMatrixWorld(true);
  cube_327.position.set(0, 0, -1.527);
  cube_327MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_327MZ.position.set(0, 0, 1.5269);
  const cube_327MirroredZ = new THREE.Group();
  cube_327MirroredZ.add(cube_327, cube_327MZ);
  cube_327MirroredZ.position.set(-12.5457, 3.1527, 0);
  const cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_022 = new THREE.Mesh(
    cylinder_022Geometry,
    Floor_StripesMaterial,
  );
  cylinder_022.scale.set(0.3106, 0.044, 0.3106);
  cylinder_022.setRotation(0.0, 0.0, -1.5708);
  const cylinder_022MZ = cylinder_022.clone();
  cylinder_022MZ.updateMatrixWorld(true);
  cylinder_022.position.set(0, 0, -1.527);
  cylinder_022MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_022MZ.position.set(0, 0, 1.5269);
  const cylinder_022MirroredZ = new THREE.Group();
  cylinder_022MirroredZ.add(cylinder_022, cylinder_022MZ);
  cylinder_022MirroredZ.position.set(-12.593, 3.1527, 0);
  const sphere_002Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_002 = new THREE.Mesh(sphere_002Geometry, RoofTilesMaterial);
  sphere_002.scale.set(0.2749, 0.0831, 0.2749);
  sphere_002.setRotation(0.0, 0.0, -1.5708);
  const sphere_002MZ = sphere_002.clone();
  sphere_002MZ.updateMatrixWorld(true);
  sphere_002.position.set(0, 0, -1.527);
  sphere_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sphere_002MZ.position.set(0, 0, 1.5269);
  const sphere_002MirroredZ = new THREE.Group();
  sphere_002MirroredZ.add(sphere_002, sphere_002MZ);
  sphere_002MirroredZ.position.set(-12.6391, 3.1527, 0);
  const cube_328Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_328 = new THREE.Mesh(cube_328Geometry, Blue_PictureMaterial);
  cube_328.scale.set(0.1275, 0.0446, 0.9062);
  cube_328.setRotation(1.5708, 1.5708, 0.0);
  const cube_328MZ = cube_328.clone();
  cube_328MZ.updateMatrixWorld(true);
  cube_328.position.set(0, 0, -2.2407);
  cube_328MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_328MZ.position.set(0, 0, 2.2406);
  const cube_328MirroredZ = new THREE.Group();
  cube_328MirroredZ.add(cube_328, cube_328MZ);
  cube_328MirroredZ.position.set(-12.5457, 4.965, 0);
  const cube_329Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_329 = new THREE.Mesh(cube_329Geometry, Blue_PictureMaterial);
  cube_329.scale.set(0.1275, 0.0446, 0.9062);
  cube_329.setRotation(1.5708, 1.5708, 0.0);
  const cube_329MZ = cube_329.clone();
  cube_329MZ.updateMatrixWorld(true);
  cube_329.position.set(0, 0, -0.8133);
  cube_329MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_329MZ.position.set(0, 0, 0.8132);
  const cube_329MirroredZ = new THREE.Group();
  cube_329MirroredZ.add(cube_329, cube_329MZ);
  cube_329MirroredZ.position.set(-12.5457, 4.965, 0);
  const cube_330Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_330 = new THREE.Mesh(cube_330Geometry, Blue_PictureMaterial);
  cube_330.scale.set(0.8412, 0.0446, 0.681);
  cube_330.setRotation(1.5708, 1.5708, 0.0);
  const cube_330MZ = cube_330.clone();
  cube_330MZ.updateMatrixWorld(true);
  cube_330.position.set(0, 0, -1.527);
  cube_330MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_330MZ.position.set(0, 0, 1.5269);
  const cube_330MirroredZ = new THREE.Group();
  cube_330MirroredZ.add(cube_330, cube_330MZ);
  cube_330MirroredZ.position.set(-12.5457, 6.5057, 0);
  const cube_331Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_331 = new THREE.Mesh(cube_331Geometry, Train_blueMaterial);
  cube_331.position.set(-12.5457, 3.1527, -0.0);
  cube_331.scale.set(0.7058, 0.0351, 0.9062);
  cube_331.setRotation(1.5708, 1.5708, 0.0);

  const cube_332Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_332 = new THREE.Mesh(cube_332Geometry, Train_blueMaterial);
  cube_332.position.set(-12.5457, 4.9776, -0.5792);
  cube_332.scale.set(0.1266, 0.0351, 0.9188);
  cube_332.setRotation(1.5708, 1.5708, 0.0);

  const cube_333Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_333 = new THREE.Mesh(cube_333Geometry, Train_blueMaterial);
  cube_333.position.set(-12.5457, 6.4998, -0.0);
  cube_333.scale.set(0.7058, 0.0351, 0.6869);
  cube_333.setRotation(1.5708, 1.5708, 0.0);

  const cube_334Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_334 = new THREE.Mesh(cube_334Geometry, ColoumnMaterial);
  cube_334.scale.set(0.1434, 0.0309, 0.1545);
  cube_334.setRotation(1.5708, 1.5708, 0.7854);
  const cube_334MZ = cube_334.clone();
  cube_334MZ.updateMatrixWorld(true);
  cube_334.position.set(0, 0, -0.9277);
  cube_334MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_334MZ.position.set(0, 0, 0.9276);
  const cube_334MirroredZ = new THREE.Group();
  cube_334MirroredZ.add(cube_334, cube_334MZ);
  const cube_334MirroredZMY = cube_334MirroredZ.clone();
  cube_334MirroredZMY.updateMatrixWorld(true);
  cube_334MirroredZ.position.set(0, 4.0498, 0);
  cube_334MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_334MirroredZMY.position.set(0, 5.827, 0);
  const cube_334MirroredZMirroredY = new THREE.Group();
  cube_334MirroredZMirroredY.add(cube_334MirroredZ, cube_334MirroredZMY);
  cube_334MirroredZMirroredY.position.set(-12.5457, 0, 0);
  const cube_335Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_335 = new THREE.Mesh(cube_335Geometry, GlassMaterial);
  cube_335.scale.set(-0.0151, 1.0, 0.7144);
  cube_335.setRotation(0.0, 0.0, -0.0);
  const cube_335MZ = cube_335.clone();
  cube_335MZ.updateMatrixWorld(true);
  cube_335.position.set(0, 0, -1.527);
  cube_335MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_335MZ.position.set(0, 0, 1.5269);
  const cube_335MirroredZ = new THREE.Group();
  cube_335MirroredZ.add(cube_335, cube_335MZ);
  cube_335MirroredZ.position.set(-12.5457, 4.9411, 0);
  const cube_336Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_336 = new THREE.Mesh(cube_336Geometry, ColoumnMaterial);
  cube_336.scale.set(0.4607, 0.0309, 0.0226);
  cube_336.setRotation(1.5708, 1.5708, -0.0);
  const cube_336MZ = cube_336.clone();
  cube_336MZ.updateMatrixWorld(true);
  cube_336.position.set(0, 0, -1.527);
  cube_336MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_336MZ.position.set(0, 0, 1.5269);
  const cube_336MirroredZ = new THREE.Group();
  cube_336MirroredZ.add(cube_336, cube_336MZ);
  const cube_336MirroredZMY = cube_336MirroredZ.clone();
  cube_336MirroredZMY.updateMatrixWorld(true);
  cube_336MirroredZ.position.set(0, 4.0617, 0);
  cube_336MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_336MirroredZMY.position.set(0, 5.815, 0);
  const cube_336MirroredZMirroredY = new THREE.Group();
  cube_336MirroredZMirroredY.add(cube_336MirroredZ, cube_336MirroredZMY);
  cube_336MirroredZMirroredY.position.set(-12.5457, 0, 0);
  const cube_337Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_337 = new THREE.Mesh(cube_337Geometry, ColoumnMaterial);
  cube_337.scale.set(0.7643, 0.0309, 0.0226);
  cube_337.setRotation(3.1416, 0.0, 1.5708);
  const cube_337MX = cube_337.clone();
  cube_337MX.updateMatrixWorld(true);
  cube_337.position.set(-12.5457, 0, 0);
  cube_337MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  cube_337MX.position.set(-12.5457, 0, 0);
  const cube_337MirroredX = new THREE.Group();
  cube_337MirroredX.add(cube_337, cube_337MX);
  const cube_337MirroredXMZ = cube_337MirroredX.clone();
  cube_337MirroredXMZ.updateMatrixWorld(true);
  cube_337MirroredX.position.set(0, 0, -0.9381);
  cube_337MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_337MirroredXMZ.position.set(0, 0, 0.9381);
  const cube_337MirroredXMirroredZ = new THREE.Group();
  cube_337MirroredXMirroredZ.add(cube_337MirroredX, cube_337MirroredXMZ);
  const cube_337MirroredXMirroredZMY = cube_337MirroredXMirroredZ.clone();
  cube_337MirroredXMirroredZMY.updateMatrixWorld(true);
  cube_337MirroredXMirroredZ.position.set(0, 4.936, 0);
  cube_337MirroredXMirroredZMY.applyMatrix(
    new THREE.Matrix4().makeScale(1, -1, 1),
  );
  cube_337MirroredXMirroredZMY.position.set(0, 4.9408, 0);
  const cube_337MirroredXMirroredZMirroredY = new THREE.Group();
  cube_337MirroredXMirroredZMirroredY.add(
    cube_337MirroredXMirroredZ,
    cube_337MirroredXMirroredZMY,
  );
  const cube_338Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_338 = new THREE.Mesh(cube_338Geometry, GlassMaterial);
  cube_338.position.set(-12.5457, 4.9384, -0.0);
  cube_338.scale.set(-0.0151, 0.9645, 0.4812);

  const cube_339Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_339 = new THREE.Mesh(cube_339Geometry, ColoumnMaterial);
  cube_339.scale.set(0.1434, 0.0309, 0.1545);
  cube_339.setRotation(1.5708, 1.5708, 0.7854);
  const cube_339MZ = cube_339.clone();
  cube_339MZ.updateMatrixWorld(true);
  cube_339.position.set(0, 0, 0.4478);
  cube_339MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_339MZ.position.set(0, 0, -0.4478);
  const cube_339MirroredZ = new THREE.Group();
  cube_339MirroredZ.add(cube_339, cube_339MZ);
  const cube_339MirroredZMY = cube_339MirroredZ.clone();
  cube_339MirroredZMY.updateMatrixWorld(true);
  cube_339MirroredZ.position.set(0, 4.0693, 0);
  cube_339MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_339MirroredZMY.position.set(0, 5.8075, 0);
  const cube_339MirroredZMirroredY = new THREE.Group();
  cube_339MirroredZMirroredY.add(cube_339MirroredZ, cube_339MirroredZMY);
  cube_339MirroredZMirroredY.position.set(-12.5457, 0, 0);
  const cube_340Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_340 = new THREE.Mesh(cube_340Geometry, ColoumnMaterial);
  cube_340.scale.set(0.4607, 0.0309, 0.0226);
  cube_340.setRotation(1.5708, 1.5708, -0.0);
  const cube_340MY = cube_340.clone();
  cube_340MY.updateMatrixWorld(true);
  cube_340.position.set(0, 4.0568, 0);
  cube_340MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_340MY.position.set(0, 5.82, 0);
  const cube_340MirroredY = new THREE.Group();
  cube_340MirroredY.add(cube_340, cube_340MY);
  cube_340MirroredY.position.set(-12.5457, 0, -0.0);
  const cube_341Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_341 = new THREE.Mesh(cube_341Geometry, ColoumnMaterial);
  cube_341.scale.set(0.7643, 0.0309, 0.0226);
  cube_341.setRotation(3.1416, 0.0, 1.5708);
  const cube_341MZ = cube_341.clone();
  cube_341MZ.updateMatrixWorld(true);
  cube_341.position.set(0, 0, 0.4584);
  cube_341MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_341MZ.position.set(0, 0, -0.4584);
  const cube_341MirroredZ = new THREE.Group();
  cube_341MirroredZ.add(cube_341, cube_341MZ);
  cube_341MirroredZ.position.set(-12.5457, 4.9303, 0);
  const cube_342Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_342 = new THREE.Mesh(cube_342Geometry, ColoumnMaterial);
  cube_342.scale.set(0.7643, 0.0309, 0.0226);
  cube_342.setRotation(3.1416, 0.0, 1.5708);
  const cube_342MX = cube_342.clone();
  cube_342MX.updateMatrixWorld(true);
  cube_342.position.set(-12.5457, 0, 0);
  cube_342MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  cube_342MX.position.set(-12.5457, 0, 0);
  const cube_342MirroredX = new THREE.Group();
  cube_342MirroredX.add(cube_342, cube_342MX);
  const cube_342MirroredXMZ = cube_342MirroredX.clone();
  cube_342MirroredXMZ.updateMatrixWorld(true);
  cube_342MirroredX.position.set(0, 0, 2.1187);
  cube_342MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_342MirroredXMZ.position.set(0, 0, -2.1187);
  const cube_342MirroredXMirroredZ = new THREE.Group();
  cube_342MirroredXMirroredZ.add(cube_342MirroredX, cube_342MirroredXMZ);
  const cube_342MirroredXMirroredZMY = cube_342MirroredXMirroredZ.clone();
  cube_342MirroredXMirroredZMY.updateMatrixWorld(true);
  cube_342MirroredXMirroredZ.position.set(0, 4.936, 0);
  cube_342MirroredXMirroredZMY.applyMatrix(
    new THREE.Matrix4().makeScale(1, -1, 1),
  );
  cube_342MirroredXMirroredZMY.position.set(0, 4.9408, 0);
  const cube_342MirroredXMirroredZMirroredY = new THREE.Group();
  cube_342MirroredXMirroredZMirroredY.add(
    cube_342MirroredXMirroredZ,
    cube_342MirroredXMirroredZMY,
  );
  const cube_343Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_343 = new THREE.Mesh(cube_343Geometry, ColoumnMaterial);
  cube_343.scale.set(0.1434, 0.0309, 0.1545);
  cube_343.setRotation(1.5708, 1.5708, 0.7854);
  const cube_343MZ = cube_343.clone();
  cube_343MZ.updateMatrixWorld(true);
  cube_343.position.set(0, 0, 2.1206);
  cube_343MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_343MZ.position.set(0, 0, -2.1207);
  const cube_343MirroredZ = new THREE.Group();
  cube_343MirroredZ.add(cube_343, cube_343MZ);
  const cube_343MirroredZMY = cube_343MirroredZ.clone();
  cube_343MirroredZMY.updateMatrixWorld(true);
  cube_343MirroredZ.position.set(0, 4.0498, 0);
  cube_343MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_343MirroredZMY.position.set(0, 5.827, 0);
  const cube_343MirroredZMirroredY = new THREE.Group();
  cube_343MirroredZMirroredY.add(cube_343MirroredZ, cube_343MirroredZMY);
  cube_343MirroredZMirroredY.position.set(-12.5457, 0, 0);
  const cylinder_023Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_023Group = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cylinder_023 = new THREE.Mesh(cylinder_023Geometry, ColoumnMaterial);
    cylinder_023.scale.set(0.1218, 0.3642, 0.1218);
    cylinder_023.position.set(0.4874 * i, 0, 0);
    cylinder_023Group.add(cylinder_023);
  }
  cylinder_023Group.setRotation(0.0, 0.0, -0.0);
  const cylinder_023GroupMZ = cylinder_023Group.clone();
  cylinder_023GroupMZ.updateMatrixWorld(true);
  cylinder_023Group.position.set(0, 0, -2.102);
  cylinder_023GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_023GroupMZ.position.set(0, 0, 2.102);
  const cylinder_023GroupMirroredZ = new THREE.Group();
  cylinder_023GroupMirroredZ.add(cylinder_023Group, cylinder_023GroupMZ);
  cylinder_023GroupMirroredZ.position.set(8.3088, 1.0627, 0);
  const cube_344Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_344 = new THREE.Mesh(cube_344Geometry, Blue_PictureMaterial);
  cube_344.scale.set(-0.9318, 0.051, 2.4701);
  cube_344.setRotation(1.5708, 0.0, 0.0);
  const cube_344MZ = cube_344.clone();
  cube_344MZ.updateMatrixWorld(true);
  cube_344.position.set(0, 0, -2.4192);
  cube_344MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_344MZ.position.set(0, 0, 2.4191);
  const cube_344MirroredZ = new THREE.Group();
  cube_344MirroredZ.add(cube_344, cube_344MZ);
  cube_344MirroredZ.position.set(11.6574, 4.7166, 0);
  const cube_345Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_345 = new THREE.Mesh(cube_345Geometry, Blue_PictureMaterial);
  cube_345.scale.set(0.8412, -0.0446, 0.9062);
  cube_345.setRotation(1.5708, 1.5708, 0.0);
  const cube_345MZ = cube_345.clone();
  cube_345MZ.updateMatrixWorld(true);
  cube_345.position.set(0, 0, -1.527);
  cube_345MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_345MZ.position.set(0, 0, 1.5269);
  const cube_345MirroredZ = new THREE.Group();
  cube_345MirroredZ.add(cube_345, cube_345MZ);
  cube_345MirroredZ.position.set(12.5445, 3.1527, 0);
  const cylinder_024Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_024 = new THREE.Mesh(
    cylinder_024Geometry,
    Floor_StripesMaterial,
  );
  cylinder_024.scale.set(0.3106, -0.044, 0.3106);
  cylinder_024.setRotation(0.0, 0.0, -1.5708);
  const cylinder_024MZ = cylinder_024.clone();
  cylinder_024MZ.updateMatrixWorld(true);
  cylinder_024.position.set(0, 0, -1.527);
  cylinder_024MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylinder_024MZ.position.set(0, 0, 1.5269);
  const cylinder_024MirroredZ = new THREE.Group();
  cylinder_024MirroredZ.add(cylinder_024, cylinder_024MZ);
  cylinder_024MirroredZ.position.set(12.5918, 3.1527, 0);
  const sphere_003Geometry = new THREE.SphereGeometry(1, 32, 16);
  const sphere_003 = new THREE.Mesh(sphere_003Geometry, RoofTilesMaterial);
  sphere_003.scale.set(0.2749, -0.0831, 0.2749);
  sphere_003.setRotation(0.0, 0.0, -1.5708);
  const sphere_003MZ = sphere_003.clone();
  sphere_003MZ.updateMatrixWorld(true);
  sphere_003.position.set(0, 0, -1.527);
  sphere_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sphere_003MZ.position.set(0, 0, 1.5269);
  const sphere_003MirroredZ = new THREE.Group();
  sphere_003MirroredZ.add(sphere_003, sphere_003MZ);
  sphere_003MirroredZ.position.set(12.638, 3.1527, 0);
  const cube_346Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_346 = new THREE.Mesh(cube_346Geometry, Blue_PictureMaterial);
  cube_346.scale.set(0.1275, -0.0446, 0.9062);
  cube_346.setRotation(1.5708, 1.5708, 0.0);
  const cube_346MZ = cube_346.clone();
  cube_346MZ.updateMatrixWorld(true);
  cube_346.position.set(0, 0, -2.2407);
  cube_346MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_346MZ.position.set(0, 0, 2.2406);
  const cube_346MirroredZ = new THREE.Group();
  cube_346MirroredZ.add(cube_346, cube_346MZ);
  cube_346MirroredZ.position.set(12.5445, 4.965, 0);
  const cube_347Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_347 = new THREE.Mesh(cube_347Geometry, Blue_PictureMaterial);
  cube_347.scale.set(0.1275, -0.0446, 0.9062);
  cube_347.setRotation(1.5708, 1.5708, 0.0);
  const cube_347MZ = cube_347.clone();
  cube_347MZ.updateMatrixWorld(true);
  cube_347.position.set(0, 0, -0.8133);
  cube_347MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_347MZ.position.set(0, 0, 0.8132);
  const cube_347MirroredZ = new THREE.Group();
  cube_347MirroredZ.add(cube_347, cube_347MZ);
  cube_347MirroredZ.position.set(12.5445, 4.965, 0);
  const cube_348Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_348 = new THREE.Mesh(cube_348Geometry, Blue_PictureMaterial);
  cube_348.scale.set(0.8412, -0.0446, 0.681);
  cube_348.setRotation(1.5708, 1.5708, 0.0);
  const cube_348MZ = cube_348.clone();
  cube_348MZ.updateMatrixWorld(true);
  cube_348.position.set(0, 0, -1.527);
  cube_348MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_348MZ.position.set(0, 0, 1.5269);
  const cube_348MirroredZ = new THREE.Group();
  cube_348MirroredZ.add(cube_348, cube_348MZ);
  cube_348MirroredZ.position.set(12.5445, 6.5057, 0);
  const cube_349Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_349 = new THREE.Mesh(cube_349Geometry, Train_blueMaterial);
  cube_349.position.set(12.5445, 3.1527, -0.0);
  cube_349.scale.set(0.7058, -0.0351, 0.9062);
  cube_349.setRotation(1.5708, 1.5708, 0.0);

  const cube_350Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_350 = new THREE.Mesh(cube_350Geometry, Train_blueMaterial);
  cube_350.position.set(12.5445, 6.4998, -0.0);
  cube_350.scale.set(0.7058, -0.0351, 0.6869);
  cube_350.setRotation(1.5708, 1.5708, 0.0);

  const cube_351Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_351 = new THREE.Mesh(cube_351Geometry, ColoumnMaterial);
  cube_351.scale.set(0.1434, -0.0309, 0.1545);
  cube_351.setRotation(1.5708, 1.5708, 0.7854);
  const cube_351MZ = cube_351.clone();
  cube_351MZ.updateMatrixWorld(true);
  cube_351.position.set(0, 0, -0.9277);
  cube_351MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_351MZ.position.set(0, 0, 0.9276);
  const cube_351MirroredZ = new THREE.Group();
  cube_351MirroredZ.add(cube_351, cube_351MZ);
  const cube_351MirroredZMY = cube_351MirroredZ.clone();
  cube_351MirroredZMY.updateMatrixWorld(true);
  cube_351MirroredZ.position.set(0, 4.0498, 0);
  cube_351MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_351MirroredZMY.position.set(0, 5.827, 0);
  const cube_351MirroredZMirroredY = new THREE.Group();
  cube_351MirroredZMirroredY.add(cube_351MirroredZ, cube_351MirroredZMY);
  cube_351MirroredZMirroredY.position.set(12.5445, 0, 0);
  const cube_352Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_352 = new THREE.Mesh(cube_352Geometry, GlassMaterial);
  cube_352.scale.set(0.0151, 1.0, 0.7144);
  cube_352.setRotation(0.0, 0.0, -0.0);
  const cube_352MZ = cube_352.clone();
  cube_352MZ.updateMatrixWorld(true);
  cube_352.position.set(0, 0, -1.527);
  cube_352MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_352MZ.position.set(0, 0, 1.5269);
  const cube_352MirroredZ = new THREE.Group();
  cube_352MirroredZ.add(cube_352, cube_352MZ);
  cube_352MirroredZ.position.set(12.5445, 4.9411, 0);
  const cube_353Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_353 = new THREE.Mesh(cube_353Geometry, ColoumnMaterial);
  cube_353.scale.set(0.4607, -0.0309, 0.0226);
  cube_353.setRotation(1.5708, 1.5708, -0.0);
  const cube_353MZ = cube_353.clone();
  cube_353MZ.updateMatrixWorld(true);
  cube_353.position.set(0, 0, -1.527);
  cube_353MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_353MZ.position.set(0, 0, 1.5269);
  const cube_353MirroredZ = new THREE.Group();
  cube_353MirroredZ.add(cube_353, cube_353MZ);
  const cube_353MirroredZMY = cube_353MirroredZ.clone();
  cube_353MirroredZMY.updateMatrixWorld(true);
  cube_353MirroredZ.position.set(0, 4.0617, 0);
  cube_353MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_353MirroredZMY.position.set(0, 5.815, 0);
  const cube_353MirroredZMirroredY = new THREE.Group();
  cube_353MirroredZMirroredY.add(cube_353MirroredZ, cube_353MirroredZMY);
  cube_353MirroredZMirroredY.position.set(12.5445, 0, 0);
  const cube_354Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_354 = new THREE.Mesh(cube_354Geometry, ColoumnMaterial);
  cube_354.scale.set(0.7643, -0.0309, 0.0226);
  cube_354.setRotation(3.1416, 0.0, 1.5708);
  const cube_354MX = cube_354.clone();
  cube_354MX.updateMatrixWorld(true);
  cube_354.position.set(12.5445, 0, 0);
  cube_354MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  cube_354MX.position.set(12.5445, 0, 0);
  const cube_354MirroredX = new THREE.Group();
  cube_354MirroredX.add(cube_354, cube_354MX);
  const cube_354MirroredXMZ = cube_354MirroredX.clone();
  cube_354MirroredXMZ.updateMatrixWorld(true);
  cube_354MirroredX.position.set(0, 0, -0.9381);
  cube_354MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_354MirroredXMZ.position.set(0, 0, 0.9381);
  const cube_354MirroredXMirroredZ = new THREE.Group();
  cube_354MirroredXMirroredZ.add(cube_354MirroredX, cube_354MirroredXMZ);
  const cube_354MirroredXMirroredZMY = cube_354MirroredXMirroredZ.clone();
  cube_354MirroredXMirroredZMY.updateMatrixWorld(true);
  cube_354MirroredXMirroredZ.position.set(0, 4.936, 0);
  cube_354MirroredXMirroredZMY.applyMatrix(
    new THREE.Matrix4().makeScale(1, -1, 1),
  );
  cube_354MirroredXMirroredZMY.position.set(0, 4.9408, 0);
  const cube_354MirroredXMirroredZMirroredY = new THREE.Group();
  cube_354MirroredXMirroredZMirroredY.add(
    cube_354MirroredXMirroredZ,
    cube_354MirroredXMirroredZMY,
  );
  const cube_355Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_355 = new THREE.Mesh(cube_355Geometry, GlassMaterial);
  cube_355.position.set(12.5445, 4.9384, -0.0);
  cube_355.scale.set(0.0151, 0.9645, 0.4812);

  const cube_356Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_356 = new THREE.Mesh(cube_356Geometry, ColoumnMaterial);
  cube_356.scale.set(0.1434, -0.0309, 0.1545);
  cube_356.setRotation(1.5708, 1.5708, 0.7854);
  const cube_356MZ = cube_356.clone();
  cube_356MZ.updateMatrixWorld(true);
  cube_356.position.set(0, 0, 0.4478);
  cube_356MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_356MZ.position.set(0, 0, -0.4478);
  const cube_356MirroredZ = new THREE.Group();
  cube_356MirroredZ.add(cube_356, cube_356MZ);
  const cube_356MirroredZMY = cube_356MirroredZ.clone();
  cube_356MirroredZMY.updateMatrixWorld(true);
  cube_356MirroredZ.position.set(0, 4.0693, 0);
  cube_356MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_356MirroredZMY.position.set(0, 5.8075, 0);
  const cube_356MirroredZMirroredY = new THREE.Group();
  cube_356MirroredZMirroredY.add(cube_356MirroredZ, cube_356MirroredZMY);
  cube_356MirroredZMirroredY.position.set(12.5445, 0, 0);
  const cube_357Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_357 = new THREE.Mesh(cube_357Geometry, ColoumnMaterial);
  cube_357.scale.set(0.4607, -0.0309, 0.0226);
  cube_357.setRotation(1.5708, 1.5708, -0.0);
  const cube_357MY = cube_357.clone();
  cube_357MY.updateMatrixWorld(true);
  cube_357.position.set(0, 4.0568, 0);
  cube_357MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_357MY.position.set(0, 5.82, 0);
  const cube_357MirroredY = new THREE.Group();
  cube_357MirroredY.add(cube_357, cube_357MY);
  cube_357MirroredY.position.set(12.5445, 0, -0.0);
  const cube_358Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_358 = new THREE.Mesh(cube_358Geometry, ColoumnMaterial);
  cube_358.scale.set(0.7643, -0.0309, 0.0226);
  cube_358.setRotation(3.1416, 0.0, 1.5708);
  const cube_358MZ = cube_358.clone();
  cube_358MZ.updateMatrixWorld(true);
  cube_358.position.set(0, 0, 0.4584);
  cube_358MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_358MZ.position.set(0, 0, -0.4584);
  const cube_358MirroredZ = new THREE.Group();
  cube_358MirroredZ.add(cube_358, cube_358MZ);
  cube_358MirroredZ.position.set(12.5445, 4.9303, 0);
  const cube_359Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_359 = new THREE.Mesh(cube_359Geometry, ColoumnMaterial);
  cube_359.scale.set(0.7643, -0.0309, 0.0226);
  cube_359.setRotation(3.1416, 0.0, 1.5708);
  const cube_359MX = cube_359.clone();
  cube_359MX.updateMatrixWorld(true);
  cube_359.position.set(12.5445, 0, 0);
  cube_359MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  cube_359MX.position.set(12.5445, 0, 0);
  const cube_359MirroredX = new THREE.Group();
  cube_359MirroredX.add(cube_359, cube_359MX);
  const cube_359MirroredXMZ = cube_359MirroredX.clone();
  cube_359MirroredXMZ.updateMatrixWorld(true);
  cube_359MirroredX.position.set(0, 0, 2.1187);
  cube_359MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_359MirroredXMZ.position.set(0, 0, -2.1187);
  const cube_359MirroredXMirroredZ = new THREE.Group();
  cube_359MirroredXMirroredZ.add(cube_359MirroredX, cube_359MirroredXMZ);
  const cube_359MirroredXMirroredZMY = cube_359MirroredXMirroredZ.clone();
  cube_359MirroredXMirroredZMY.updateMatrixWorld(true);
  cube_359MirroredXMirroredZ.position.set(0, 4.936, 0);
  cube_359MirroredXMirroredZMY.applyMatrix(
    new THREE.Matrix4().makeScale(1, -1, 1),
  );
  cube_359MirroredXMirroredZMY.position.set(0, 4.9408, 0);
  const cube_359MirroredXMirroredZMirroredY = new THREE.Group();
  cube_359MirroredXMirroredZMirroredY.add(
    cube_359MirroredXMirroredZ,
    cube_359MirroredXMirroredZMY,
  );
  const cube_360Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_360 = new THREE.Mesh(cube_360Geometry, ColoumnMaterial);
  cube_360.scale.set(0.1434, -0.0309, 0.1545);
  cube_360.setRotation(1.5708, 1.5708, 0.7854);
  const cube_360MZ = cube_360.clone();
  cube_360MZ.updateMatrixWorld(true);
  cube_360.position.set(0, 0, 2.1206);
  cube_360MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_360MZ.position.set(0, 0, -2.1207);
  const cube_360MirroredZ = new THREE.Group();
  cube_360MirroredZ.add(cube_360, cube_360MZ);
  const cube_360MirroredZMY = cube_360MirroredZ.clone();
  cube_360MirroredZMY.updateMatrixWorld(true);
  cube_360MirroredZ.position.set(0, 4.0498, 0);
  cube_360MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_360MirroredZMY.position.set(0, 5.827, 0);
  const cube_360MirroredZMirroredY = new THREE.Group();
  cube_360MirroredZMirroredY.add(cube_360MirroredZ, cube_360MirroredZMY);
  cube_360MirroredZMirroredY.position.set(12.5445, 0, 0);
  const cube_361Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_361 = new THREE.Mesh(cube_361Geometry, Blue_PictureMaterial);
  cube_361.position.set(-0.0006, 7.2557, -0.0);
  cube_361.scale.set(12.5898, 0.069, 2.4701);

  const cube_362Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_362 = new THREE.Mesh(cube_362Geometry, Blue_PictureMaterial);
  cube_362.position.set(-0.0006, 7.3977, -0.0);
  cube_362.scale.set(12.1678, 0.2214, 1.4361);

  const cube_363Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_363 = new THREE.Mesh(cube_363Geometry, Blue_PictureMaterial);
  cube_363.position.set(-12.1452, 7.2829, -0.0);
  cube_363.scale.set(0.2541, 0.2214, 1.4361);
  cube_363.setRotation(0.0, 0.0, -0.7854);

  const cube_364Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_364 = new THREE.Mesh(cube_364Geometry, Ceiling_trainMaterial);
  cube_364.position.set(-0.0006, 7.0623, -0.0);
  cube_364.scale.set(12.5105, 0.1214, 2.3753);

  const cube_365Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_365 = new THREE.Mesh(cube_365Geometry, Floor_trainMaterial);
  cube_365.position.set(-0.0006, 2.1963, -0.0);
  cube_365.scale.set(12.5105, 0.1214, 2.3753);

  const cube_372Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_372 = new THREE.Mesh(cube_372Geometry, Train_blueMaterial);
  cube_372.position.set(-12.5457, 4.9776, 0.5792);
  cube_372.scale.set(0.1266, 0.0351, 0.9188);
  cube_372.setRotation(1.5708, 1.5708, 0.0);

  const cube_373Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_373 = new THREE.Mesh(cube_373Geometry, Train_blueMaterial);
  cube_373.position.set(12.5445, 4.9776, 0.5792);
  cube_373.scale.set(0.1266, 0.0351, 0.9188);
  cube_373.setRotation(1.5708, 1.5708, 0.0);

  const cube_374Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_374 = new THREE.Mesh(cube_374Geometry, Train_blueMaterial);
  cube_374.position.set(12.5445, 4.9776, -0.5792);
  cube_374.scale.set(0.1266, 0.0351, 0.9188);
  cube_374.setRotation(1.5708, 1.5708, 0.0);

  const cube_409Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_409Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_409 = new THREE.Mesh(cube_409Geometry, Blue_PictureMaterial);
    cube_409.scale.set(2.1144, 0.051, 0.8864);
    cube_409.position.set(6.4194 * i, 0, 0);
    cube_409Group.add(cube_409);
  }
  cube_409Group.setRotation(1.5708, 0.0, 0.0);
  cube_409Group.position.set(-6.4204, 3.1279, 2.4191);
  const cube_410Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_410Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_410 = new THREE.Mesh(cube_410Geometry, Blue_PictureMaterial);
    cube_410.scale.set(2.1144, 0.051, 0.7023);
    cube_410.position.set(6.4194 * i, 0, 0);
    cube_410Group.add(cube_410);
  }
  cube_410Group.setRotation(1.5708, 0.0, 0.0);
  cube_410Group.position.set(-6.4204, 6.2439, 2.4191);
  const cube_411Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_411 = new THREE.Mesh(cube_411Geometry, Blue_PictureMaterial);
  cube_411.position.set(-0.001, 7.0636, -2.4216);
  cube_411.scale.set(10.7268, 0.051, 0.1232);
  cube_411.setRotation(1.5708, 0.0, 0.0);

  const cube_412Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_412Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_412 = new THREE.Mesh(cube_412Geometry, Blue_PictureMaterial);
    cube_412.scale.set(0.5707, 0.051, 0.7636);
    cube_412.position.set(6.4195 * i, 0, 0);
    cube_412Group.add(cube_412);
  }
  cube_412Group.setRotation(1.5708, 0.0, 0.0);
  cube_412Group.position.set(-7.9641, 4.778, 2.4191);
  const cube_413Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_413Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_413 = new THREE.Mesh(cube_413Geometry, Blue_PictureMaterial);
    cube_413.scale.set(0.5707, 0.051, 0.7636);
    cube_413.position.set(6.4195 * i, 0, 0);
    cube_413Group.add(cube_413);
  }
  cube_413Group.setRotation(1.5708, 0.0, 0.0);
  cube_413Group.position.set(-4.8768, 4.778, 2.4191);
  const cube_414Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_414Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_414 = new THREE.Mesh(cube_414Geometry, GlassMaterial);
    cube_414.scale.set(-0.0151, 0.786, 1.0055);
    cube_414.position.set(0, 0, 6.4153 * i);
    cube_414Group.add(cube_414);
  }
  cube_414Group.setRotation(0.0, 1.5708, 0.0);
  cube_414Group.position.set(-6.4205, 4.778, 2.4191);
  const cube_415Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_415Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_415 = new THREE.Mesh(cube_415Geometry, ColoumnMaterial);
    cube_415.scale.set(0.9267, 0.0309, 0.0215);
    cube_415.position.set(-6.4313 * i, 0, 0);
    cube_415Group.add(cube_415);
  }
  cube_415Group.setRotation(1.5708, 3.1416, 0.0);
  const cube_415GroupMY = cube_415Group.clone();
  cube_415GroupMY.updateMatrixWorld(true);
  cube_415Group.position.set(0, 4.0179, 0);
  cube_415GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_415GroupMY.position.set(0, 5.5774, 0);
  const cube_415GroupMirroredY = new THREE.Group();
  cube_415GroupMirroredY.add(cube_415Group, cube_415GroupMY);
  cube_415GroupMirroredY.position.set(-6.4205, 0, 2.4191);
  const cube_416Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_416Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_416 = new THREE.Mesh(cube_416Geometry, ColoumnMaterial);
    cube_416.scale.set(0.1252, 0.0309, 0.1349);
    cube_416.position.set(-4.5462 * i, 0, -4.5331 * i);
    cube_416Group.add(cube_416);
  }
  cube_416Group.setRotation(1.5708, 3.1416, 0.7854);
  const cube_416GroupMY = cube_416Group.clone();
  cube_416GroupMY.updateMatrixWorld(true);
  cube_416Group.position.set(0, 4.0135, 0);
  cube_416GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_416GroupMY.position.set(0, 5.5424, 0);
  const cube_416GroupMirroredY = new THREE.Group();
  cube_416GroupMirroredY.add(cube_416Group, cube_416GroupMY);
  cube_416GroupMirroredY.position.set(-7.3886, 0, 2.4191);
  const cube_417Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_417Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_417 = new THREE.Mesh(cube_417Geometry, ColoumnMaterial);
    cube_417.scale.set(0.1252, 0.0309, 0.1349);
    cube_417.position.set(-4.5462 * i, 0, -4.5331 * i);
    cube_417Group.add(cube_417);
  }
  cube_417Group.setRotation(1.5708, 3.1416, 0.7854);
  const cube_417GroupMY = cube_417Group.clone();
  cube_417GroupMY.updateMatrixWorld(true);
  cube_417Group.position.set(0, 3.9782, 0);
  cube_417GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_417GroupMY.position.set(0, 5.5778, 0);
  const cube_417GroupMirroredY = new THREE.Group();
  cube_417GroupMirroredY.add(cube_417Group, cube_417GroupMY);
  cube_417GroupMirroredY.position.set(-5.4376, 0, 2.4191);
  const cube_418Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_418Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_418 = new THREE.Mesh(cube_418Geometry, ColoumnMaterial);
    cube_418.scale.set(0.7261, 0.0309, 0.0176);
    cube_418.position.set(0, 0, -6.4199 * i);
    cube_418Group.add(cube_418);
  }
  cube_418Group.setRotation(4.7124, 0.0, 1.5708);
  cube_418Group.position.set(-7.3937, 4.7961, 2.4191);
  const cube_419Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_419Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_419 = new THREE.Mesh(cube_419Geometry, ColoumnMaterial);
    cube_419.scale.set(0.7261, 0.0309, 0.0176);
    cube_419.position.set(0, 0, -6.4199 * i);
    cube_419Group.add(cube_419);
  }
  cube_419Group.setRotation(4.7124, 0.0, 1.5708);
  cube_419Group.position.set(-5.4465, 4.7961, 2.4191);
  const cube_420Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_420Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_420 = new THREE.Mesh(cube_420Geometry, Blue_PictureMaterial);
    cube_420.scale.set(2.1144, 0.051, 0.8864);
    cube_420.position.set(6.4194 * i, 0, 0);
    cube_420Group.add(cube_420);
  }
  cube_420Group.setRotation(1.5708, 0.0, 0.0);
  cube_420Group.position.set(-6.4204, 3.1279, -2.4192);
  const cube_421Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_421Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_421 = new THREE.Mesh(cube_421Geometry, Blue_PictureMaterial);
    cube_421.scale.set(2.1144, 0.051, 0.7023);
    cube_421.position.set(6.4194 * i, 0, 0);
    cube_421Group.add(cube_421);
  }
  cube_421Group.setRotation(1.5708, 0.0, 0.0);
  cube_421Group.position.set(-6.4204, 6.2439, -2.4192);
  const cube_422Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_422Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_422 = new THREE.Mesh(cube_422Geometry, Blue_PictureMaterial);
    cube_422.scale.set(0.5707, 0.051, 0.7636);
    cube_422.position.set(6.4195 * i, 0, 0);
    cube_422Group.add(cube_422);
  }
  cube_422Group.setRotation(1.5708, 0.0, 0.0);
  cube_422Group.position.set(-7.9641, 4.778, -2.4192);
  const cube_423Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_423Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_423 = new THREE.Mesh(cube_423Geometry, Blue_PictureMaterial);
    cube_423.scale.set(0.5707, 0.051, 0.7636);
    cube_423.position.set(6.4195 * i, 0, 0);
    cube_423Group.add(cube_423);
  }
  cube_423Group.setRotation(1.5708, 0.0, 0.0);
  cube_423Group.position.set(-4.8768, 4.778, -2.4192);
  const cube_424Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_424Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_424 = new THREE.Mesh(cube_424Geometry, GlassMaterial);
    cube_424.scale.set(-0.0151, 0.786, 1.0055);
    cube_424.position.set(0, 0, 6.4153 * i);
    cube_424Group.add(cube_424);
  }
  cube_424Group.setRotation(0.0, 1.5708, 0.0);
  cube_424Group.position.set(-6.4205, 4.778, -2.4192);
  const cube_425Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_425Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_425 = new THREE.Mesh(cube_425Geometry, ColoumnMaterial);
    cube_425.scale.set(0.9267, 0.0309, 0.0215);
    cube_425.position.set(-6.4313 * i, 0, 0);
    cube_425Group.add(cube_425);
  }
  cube_425Group.setRotation(1.5708, 3.1416, 0.0);
  const cube_425GroupMY = cube_425Group.clone();
  cube_425GroupMY.updateMatrixWorld(true);
  cube_425Group.position.set(0, 4.0179, 0);
  cube_425GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_425GroupMY.position.set(0, 5.5774, 0);
  const cube_425GroupMirroredY = new THREE.Group();
  cube_425GroupMirroredY.add(cube_425Group, cube_425GroupMY);
  cube_425GroupMirroredY.position.set(-6.4205, 0, -2.4192);
  const cube_426Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_426Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_426 = new THREE.Mesh(cube_426Geometry, ColoumnMaterial);
    cube_426.scale.set(0.1252, 0.0309, 0.1349);
    cube_426.position.set(-4.5462 * i, 0, -4.5331 * i);
    cube_426Group.add(cube_426);
  }
  cube_426Group.setRotation(1.5708, 3.1416, 0.7854);
  const cube_426GroupMY = cube_426Group.clone();
  cube_426GroupMY.updateMatrixWorld(true);
  cube_426Group.position.set(0, 4.0135, 0);
  cube_426GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_426GroupMY.position.set(0, 5.5424, 0);
  const cube_426GroupMirroredY = new THREE.Group();
  cube_426GroupMirroredY.add(cube_426Group, cube_426GroupMY);
  cube_426GroupMirroredY.position.set(-7.3886, 0, -2.4192);
  const cube_427Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_427Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_427 = new THREE.Mesh(cube_427Geometry, ColoumnMaterial);
    cube_427.scale.set(0.1252, 0.0309, 0.1349);
    cube_427.position.set(-4.5462 * i, 0, -4.5331 * i);
    cube_427Group.add(cube_427);
  }
  cube_427Group.setRotation(1.5708, 3.1416, 0.7854);
  const cube_427GroupMY = cube_427Group.clone();
  cube_427GroupMY.updateMatrixWorld(true);
  cube_427Group.position.set(0, 3.9782, 0);
  cube_427GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_427GroupMY.position.set(0, 5.5778, 0);
  const cube_427GroupMirroredY = new THREE.Group();
  cube_427GroupMirroredY.add(cube_427Group, cube_427GroupMY);
  cube_427GroupMirroredY.position.set(-5.4376, 0, -2.4192);
  const cube_428Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_428Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_428 = new THREE.Mesh(cube_428Geometry, ColoumnMaterial);
    cube_428.scale.set(0.7261, 0.0309, 0.0176);
    cube_428.position.set(0, 0, -6.4199 * i);
    cube_428Group.add(cube_428);
  }
  cube_428Group.setRotation(4.7124, 0.0, 1.5708);
  cube_428Group.position.set(-7.3937, 4.7961, -2.4192);
  const cube_429Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_429Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_429 = new THREE.Mesh(cube_429Geometry, ColoumnMaterial);
    cube_429.scale.set(0.7261, 0.0309, 0.0176);
    cube_429.position.set(0, 0, -6.4199 * i);
    cube_429Group.add(cube_429);
  }
  cube_429Group.setRotation(4.7124, 0.0, 1.5708);
  cube_429Group.position.set(-5.4465, 4.7961, -2.4192);
  const cube_430Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_430 = new THREE.Mesh(cube_430Geometry, Blue_PictureMaterial);
  cube_430.position.set(-0.001, 7.0636, 2.4074);
  cube_430.scale.set(10.7268, 0.051, 0.1232);
  cube_430.setRotation(1.5708, 0.0, 0.0);

  const cube_431Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_431Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_431 = new THREE.Mesh(cube_431Geometry, WhiteDotsMaterial);
    cube_431.scale.set(2.1443, 0.0248, 0.1709);
    cube_431.position.set(6.4201 * i, 0, 0);
    cube_431Group.add(cube_431);
  }
  cube_431Group.setRotation(1.5708, 0.0, 0.0);
  cube_431Group.position.set(-6.4204, 3.7969, -2.4653);
  const cube_432Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_432Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_432 = new THREE.Mesh(cube_432Geometry, WhiteDotsMaterial);
    cube_432.scale.set(0.9461, 0.0248, 0.1709);
    cube_432.position.set(23.3213 * i, 0, 0);
    cube_432Group.add(cube_432);
  }
  cube_432Group.setRotation(1.5708, 0.0, 0.0);
  cube_432Group.position.set(-11.6623, 3.7969, -2.4653);
  const cube_433Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_433Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_433 = new THREE.Mesh(cube_433Geometry, WhiteDotsMaterial);
    cube_433.scale.set(0.9146, 0.0248, 0.1709);
    cube_433.position.set(0, 25.1753 * i, 0);
    cube_433Group.add(cube_433);
  }
  cube_433Group.setRotation(1.5708, 1.5708, 0.0);
  cube_433Group.position.set(-12.5888, 3.7969, -1.5755);
  const cube_442Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_442Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_442 = new THREE.Mesh(cube_442Geometry, MetalMaterial);
    cube_442.scale.set(0.0294, 0.0351, 2.0562);
    cube_442.position.set(0, 0, -6.4153 * i);
    cube_442Group.add(cube_442);
  }
  cube_442Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_442Group.position.set(-6.4204, 3.4743, -2.4483);
  const cube_443Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_443Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_443 = new THREE.Mesh(cube_443Geometry, MetalMaterial);
    cube_443.scale.set(0.0294, 0.0351, 2.0562);
    cube_443.position.set(0, 0, -6.4153 * i);
    cube_443Group.add(cube_443);
  }
  cube_443Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_443Group.position.set(-6.4204, 2.9648, -2.4483);
  const cube_444Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_444Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_444 = new THREE.Mesh(cube_444Geometry, MetalMaterial);
    cube_444.scale.set(0.0294, 0.0351, 2.0562);
    cube_444.position.set(0, 0, -6.4153 * i);
    cube_444Group.add(cube_444);
  }
  cube_444Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_444Group.position.set(-6.4204, 2.4562, -2.4483);
  const cube_445Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_445Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_445 = new THREE.Mesh(cube_445Geometry, MetalMaterial);
    cube_445.scale.set(0.0294, 0.0351, 2.0562);
    cube_445.position.set(0, 0, -6.4153 * i);
    cube_445Group.add(cube_445);
  }
  cube_445Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_445Group.position.set(-6.4204, 6.5576, -2.4483);
  const cube_446Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_446Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_446 = new THREE.Mesh(cube_446Geometry, MetalMaterial);
    cube_446.scale.set(0.0294, 0.0351, 2.0562);
    cube_446.position.set(0, 0, -6.4153 * i);
    cube_446Group.add(cube_446);
  }
  cube_446Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_446Group.position.set(-6.4204, 6.0482, -2.4483);
  const cube_447Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_447Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_447 = new THREE.Mesh(cube_447Geometry, MetalMaterial);
    cube_447.scale.set(0.0294, 0.0351, 0.5273);
    cube_447.position.set(0, 0, -6.4229 * i);
    cube_447Group.add(cube_447);
  }
  cube_447Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_447Group.position.set(-4.8768, 5.0327, -2.4544);
  const cube_448Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_448Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_448 = new THREE.Mesh(cube_448Geometry, MetalMaterial);
    cube_448.scale.set(0.0294, 0.0351, 0.5273);
    cube_448.position.set(0, 0, -6.4229 * i);
    cube_448Group.add(cube_448);
  }
  cube_448Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_448Group.position.set(-4.8768, 4.5232, -2.4544);
  const cube_449Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_449Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_449 = new THREE.Mesh(cube_449Geometry, MetalMaterial);
    cube_449.scale.set(0.0294, 0.0351, 0.5273);
    cube_449.position.set(0, 0, -6.4229 * i);
    cube_449Group.add(cube_449);
  }
  cube_449Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_449Group.position.set(-7.9641, 5.0327, -2.4544);
  const cube_450Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_450Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_450 = new THREE.Mesh(cube_450Geometry, MetalMaterial);
    cube_450.scale.set(0.0294, 0.0351, 0.5273);
    cube_450.position.set(0, 0, -6.4229 * i);
    cube_450Group.add(cube_450);
  }
  cube_450Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_450Group.position.set(-7.9641, 4.5232, -2.4544);
  const cube_451Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_451Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_451 = new THREE.Mesh(cube_451Geometry, MetalMaterial);
    cube_451.scale.set(0.0294, 0.0351, 0.8515);
    cube_451.position.set(0, 0, -23.3301 * i);
    cube_451Group.add(cube_451);
  }
  cube_451Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_451Group.position.set(-11.6586, 5.2258, -2.465);
  const cube_452Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_452Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_452 = new THREE.Mesh(cube_452Geometry, MetalMaterial);
    cube_452.scale.set(0.0294, 0.0351, 0.8515);
    cube_452.position.set(0, 0, -23.3301 * i);
    cube_452Group.add(cube_452);
  }
  cube_452Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_452Group.position.set(-11.6586, 4.7163, -2.465);
  const cube_453Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_453Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_453 = new THREE.Mesh(cube_453Geometry, MetalMaterial);
    cube_453.scale.set(0.0294, 0.0351, 0.8515);
    cube_453.position.set(0, 0, -23.3301 * i);
    cube_453Group.add(cube_453);
  }
  cube_453Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_453Group.position.set(-11.6586, 4.2077, -2.465);
  const cube_454Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_454Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_454 = new THREE.Mesh(cube_454Geometry, MetalMaterial);
    cube_454.scale.set(0.0294, 0.0351, 0.8515);
    cube_454.position.set(0, 0, -23.3301 * i);
    cube_454Group.add(cube_454);
  }
  cube_454Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_454Group.position.set(-11.6586, 6.7176, -2.465);
  const cube_455Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_455Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_455 = new THREE.Mesh(cube_455Geometry, MetalMaterial);
    cube_455.scale.set(0.0294, 0.0351, 0.8515);
    cube_455.position.set(0, 0, -23.3301 * i);
    cube_455Group.add(cube_455);
  }
  cube_455Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_455Group.position.set(-11.6586, 6.2081, -2.465);
  const cube_456Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_456Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_456 = new THREE.Mesh(cube_456Geometry, MetalMaterial);
    cube_456.scale.set(0.0294, 0.0351, 0.8515);
    cube_456.position.set(0, 0, -23.3301 * i);
    cube_456Group.add(cube_456);
  }
  cube_456Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_456Group.position.set(-11.6586, 5.6995, -2.465);
  const cube_457Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_457Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_457 = new THREE.Mesh(cube_457Geometry, MetalMaterial);
    cube_457.scale.set(0.0294, 0.0351, 0.8515);
    cube_457.position.set(0, 0, -23.3301 * i);
    cube_457Group.add(cube_457);
  }
  cube_457Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_457Group.position.set(-11.6586, 3.2845, -2.465);
  const cube_458Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_458Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_458 = new THREE.Mesh(cube_458Geometry, MetalMaterial);
    cube_458.scale.set(0.0294, 0.0351, 0.8515);
    cube_458.position.set(0, 0, -23.3301 * i);
    cube_458Group.add(cube_458);
  }
  cube_458Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_458Group.position.set(-11.6586, 2.775, -2.465);
  const cube_459Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_459Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_459 = new THREE.Mesh(cube_459Geometry, MetalMaterial);
    cube_459.scale.set(0.0294, 0.0351, 0.8515);
    cube_459.position.set(0, 0, -23.3301 * i);
    cube_459Group.add(cube_459);
  }
  cube_459Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_459Group.position.set(-11.6586, 2.2664, -2.465);
  const cube_460Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_460Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cube_460 = new THREE.Mesh(cube_460Geometry, ColoumnMaterial);
    cube_460.scale.set(1.0, 0.4065, 0.5334);
    cube_460.position.set(-2.2 * i, 0, 0);
    cube_460Group.add(cube_460);
  }
  cube_460Group.position.set(4.7305, 1.2702, -1.8726);
  const cube_461Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_461Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cube_461 = new THREE.Mesh(cube_461Geometry, ColoumnMaterial);
    cube_461.scale.set(1.0, 0.4065, 0.5334);
    cube_461.position.set(-2.2 * i, 0, 0);
    cube_461Group.add(cube_461);
  }
  cube_461Group.position.set(4.7305, 1.2702, 1.8725);
  const cube_462Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_462Group = new THREE.Group();
  for (let i = 0; i < 31; i++) {
    const cube_462 = new THREE.Mesh(cube_462Geometry, Train_blueMaterial);
    cube_462.scale.set(0.1124, 0.1685, 0.2825);
    cube_462.position.set(0.7865 * i, 0, 0);
    cube_462Group.add(cube_462);
  }
  cube_462Group.setRotation(-0.5843, 0.0, 0.0);
  const cube_462GroupMZ = cube_462Group.clone();
  cube_462GroupMZ.updateMatrixWorld(true);
  cube_462Group.position.set(0, 0, -1.5788);
  cube_462GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_462GroupMZ.position.set(0, 0, 1.5787);
  const cube_462GroupMirroredZ = new THREE.Group();
  cube_462GroupMirroredZ.add(cube_462Group, cube_462GroupMZ);
  cube_462GroupMirroredZ.position.set(-11.6149, 7.3227, 0);
  const cube_463Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_463 = new THREE.Mesh(cube_463Geometry, Blue_PictureMaterial);
  cube_463.position.set(12.1903, 7.2829, -0.0);
  cube_463.scale.set(-0.2541, -0.2214, 1.4361);
  cube_463.setRotation(0.0, 0.0, -0.7854);

  const cube_464Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_464Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_464 = new THREE.Mesh(cube_464Geometry, WhiteDotsMaterial);
    cube_464.scale.set(2.1443, -0.0248, 0.1709);
    cube_464.position.set(6.4201 * i, 0, 0);
    cube_464Group.add(cube_464);
  }
  cube_464Group.setRotation(1.5708, 0.0, 0.0);
  cube_464Group.position.set(-6.4204, 3.7969, 2.4659);
  const cube_465Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_465Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_465 = new THREE.Mesh(cube_465Geometry, WhiteDotsMaterial);
    cube_465.scale.set(0.9461, -0.0248, 0.1709);
    cube_465.position.set(23.3213 * i, 0, 0);
    cube_465Group.add(cube_465);
  }
  cube_465Group.setRotation(1.5708, 0.0, 0.0);
  cube_465Group.position.set(-11.6623, 3.7969, 2.4659);
  const cube_466Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_466Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_466 = new THREE.Mesh(cube_466Geometry, WhiteDotsMaterial);
    cube_466.scale.set(-0.9146, 0.0248, 0.1709);
    cube_466.position.set(0, 25.1753 * i, 0);
    cube_466Group.add(cube_466);
  }
  cube_466Group.setRotation(1.5708, 1.5708, 0.0);
  cube_466Group.position.set(-12.5888, 3.7969, 1.5761);
  const cube_475Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_475Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_475 = new THREE.Mesh(cube_475Geometry, MetalMaterial);
    cube_475.scale.set(-0.0294, -0.0351, 2.0562);
    cube_475.position.set(0, 0, -6.4153 * i);
    cube_475Group.add(cube_475);
  }
  cube_475Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_475Group.position.set(-6.4204, 3.4743, 2.4489);
  const cube_476Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_476Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_476 = new THREE.Mesh(cube_476Geometry, MetalMaterial);
    cube_476.scale.set(-0.0294, -0.0351, 2.0562);
    cube_476.position.set(0, 0, -6.4153 * i);
    cube_476Group.add(cube_476);
  }
  cube_476Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_476Group.position.set(-6.4204, 2.9648, 2.4489);
  const cube_477Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_477Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_477 = new THREE.Mesh(cube_477Geometry, MetalMaterial);
    cube_477.scale.set(-0.0294, -0.0351, 2.0562);
    cube_477.position.set(0, 0, -6.4153 * i);
    cube_477Group.add(cube_477);
  }
  cube_477Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_477Group.position.set(-6.4204, 2.4562, 2.4489);
  const cube_478Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_478Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_478 = new THREE.Mesh(cube_478Geometry, MetalMaterial);
    cube_478.scale.set(-0.0294, -0.0351, 2.0562);
    cube_478.position.set(0, 0, -6.4153 * i);
    cube_478Group.add(cube_478);
  }
  cube_478Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_478Group.position.set(-6.4204, 6.5576, 2.4489);
  const cube_479Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_479Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_479 = new THREE.Mesh(cube_479Geometry, MetalMaterial);
    cube_479.scale.set(-0.0294, -0.0351, 2.0562);
    cube_479.position.set(0, 0, -6.4153 * i);
    cube_479Group.add(cube_479);
  }
  cube_479Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_479Group.position.set(-6.4204, 6.0482, 2.4489);
  const cube_480Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_480Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_480 = new THREE.Mesh(cube_480Geometry, MetalMaterial);
    cube_480.scale.set(-0.0294, -0.0351, 0.5273);
    cube_480.position.set(0, 0, -6.4229 * i);
    cube_480Group.add(cube_480);
  }
  cube_480Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_480Group.position.set(-4.8768, 5.0327, 2.455);
  const cube_481Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_481Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_481 = new THREE.Mesh(cube_481Geometry, MetalMaterial);
    cube_481.scale.set(-0.0294, -0.0351, 0.5273);
    cube_481.position.set(0, 0, -6.4229 * i);
    cube_481Group.add(cube_481);
  }
  cube_481Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_481Group.position.set(-4.8768, 4.5232, 2.455);
  const cube_482Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_482Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_482 = new THREE.Mesh(cube_482Geometry, MetalMaterial);
    cube_482.scale.set(-0.0294, -0.0351, 0.5273);
    cube_482.position.set(0, 0, -6.4229 * i);
    cube_482Group.add(cube_482);
  }
  cube_482Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_482Group.position.set(-7.9641, 5.0327, 2.455);
  const cube_483Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_483Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_483 = new THREE.Mesh(cube_483Geometry, MetalMaterial);
    cube_483.scale.set(-0.0294, -0.0351, 0.5273);
    cube_483.position.set(0, 0, -6.4229 * i);
    cube_483Group.add(cube_483);
  }
  cube_483Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_483Group.position.set(-7.9641, 4.5232, 2.455);
  const cube_484Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_484Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_484 = new THREE.Mesh(cube_484Geometry, MetalMaterial);
    cube_484.scale.set(-0.0294, -0.0351, 0.8515);
    cube_484.position.set(0, 0, -23.3301 * i);
    cube_484Group.add(cube_484);
  }
  cube_484Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_484Group.position.set(-11.6586, 5.2258, 2.4657);
  const cube_485Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_485Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_485 = new THREE.Mesh(cube_485Geometry, MetalMaterial);
    cube_485.scale.set(-0.0294, -0.0351, 0.8515);
    cube_485.position.set(0, 0, -23.3301 * i);
    cube_485Group.add(cube_485);
  }
  cube_485Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_485Group.position.set(-11.6586, 4.7163, 2.4657);
  const cube_486Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_486Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_486 = new THREE.Mesh(cube_486Geometry, MetalMaterial);
    cube_486.scale.set(-0.0294, -0.0351, 0.8515);
    cube_486.position.set(0, 0, -23.3301 * i);
    cube_486Group.add(cube_486);
  }
  cube_486Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_486Group.position.set(-11.6586, 4.2077, 2.4657);
  const cube_487Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_487Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_487 = new THREE.Mesh(cube_487Geometry, MetalMaterial);
    cube_487.scale.set(-0.0294, -0.0351, 0.8515);
    cube_487.position.set(0, 0, -23.3301 * i);
    cube_487Group.add(cube_487);
  }
  cube_487Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_487Group.position.set(-11.6586, 6.7176, 2.4657);
  const cube_488Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_488Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_488 = new THREE.Mesh(cube_488Geometry, MetalMaterial);
    cube_488.scale.set(-0.0294, -0.0351, 0.8515);
    cube_488.position.set(0, 0, -23.3301 * i);
    cube_488Group.add(cube_488);
  }
  cube_488Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_488Group.position.set(-11.6586, 6.2081, 2.4657);
  const cube_489Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_489Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_489 = new THREE.Mesh(cube_489Geometry, MetalMaterial);
    cube_489.scale.set(-0.0294, -0.0351, 0.8515);
    cube_489.position.set(0, 0, -23.3301 * i);
    cube_489Group.add(cube_489);
  }
  cube_489Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_489Group.position.set(-11.6586, 5.6995, 2.4657);
  const cube_490Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_490Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_490 = new THREE.Mesh(cube_490Geometry, MetalMaterial);
    cube_490.scale.set(-0.0294, -0.0351, 0.8515);
    cube_490.position.set(0, 0, -23.3301 * i);
    cube_490Group.add(cube_490);
  }
  cube_490Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_490Group.position.set(-11.6586, 3.2845, 2.4657);
  const cube_491Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_491Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_491 = new THREE.Mesh(cube_491Geometry, MetalMaterial);
    cube_491.scale.set(-0.0294, -0.0351, 0.8515);
    cube_491.position.set(0, 0, -23.3301 * i);
    cube_491Group.add(cube_491);
  }
  cube_491Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_491Group.position.set(-11.6586, 2.775, 2.4657);
  const cube_492Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_492Group = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const cube_492 = new THREE.Mesh(cube_492Geometry, MetalMaterial);
    cube_492.scale.set(-0.0294, -0.0351, 0.8515);
    cube_492.position.set(0, 0, -23.3301 * i);
    cube_492Group.add(cube_492);
  }
  cube_492Group.setRotation(-0.0, -1.5708, 0.7854);
  cube_492Group.position.set(-11.6586, 2.2664, 2.4657);
  const cube_493Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_493 = new THREE.Mesh(cube_493Geometry, MetalMaterial);
  cube_493.scale.set(0.0457, 0.0229, 0.0229);
  cube_493.setRotation(0.0, 0.0, -0.0);
  const cube_493MZ = cube_493.clone();
  cube_493MZ.updateMatrixWorld(true);
  cube_493.position.set(0, 0, -0.8133);
  cube_493MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_493MZ.position.set(0, 0, -0.8133);
  const cube_493MirroredZ = new THREE.Group();
  cube_493MirroredZ.add(cube_493, cube_493MZ);
  cube_493MirroredZ.position.set(-12.636, 4.0817, 0);
  const cylinder_025Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_025 = new THREE.Mesh(cylinder_025Geometry, MetalMaterial);
  cylinder_025.position.set(-12.6604, 4.965, -0.8133);
  cylinder_025.scale.set(0.017, 0.87, 0.017);

  const cube_494Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_494 = new THREE.Mesh(cube_494Geometry, MetalMaterial);
  cube_494.scale.set(0.0457, 0.0229, 0.0229);
  cube_494.setRotation(0.0, 0.0, -0.0);
  const cube_494MZ = cube_494.clone();
  cube_494MZ.updateMatrixWorld(true);
  cube_494.position.set(0, 0, 0.8132);
  cube_494MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_494MZ.position.set(0, 0, -2.4397);
  const cube_494MirroredZ = new THREE.Group();
  cube_494MirroredZ.add(cube_494, cube_494MZ);
  cube_494MirroredZ.position.set(-12.636, 4.0817, 0);
  const cylinder_026Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_026 = new THREE.Mesh(cylinder_026Geometry, MetalMaterial);
  cylinder_026.position.set(-12.6604, 4.965, 0.8132);
  cylinder_026.scale.set(0.017, 0.87, 0.017);

  const cube_495Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_495 = new THREE.Mesh(cube_495Geometry, MetalMaterial);
  cube_495.scale.set(-0.0457, 0.0229, 0.0229);
  cube_495.setRotation(0.0, 0.0, -0.0);
  const cube_495MZ = cube_495.clone();
  cube_495MZ.updateMatrixWorld(true);
  cube_495.position.set(0, 0, -0.8133);
  cube_495MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_495MZ.position.set(0, 0, -0.8133);
  const cube_495MirroredZ = new THREE.Group();
  cube_495MirroredZ.add(cube_495, cube_495MZ);
  cube_495MirroredZ.position.set(12.6349, 4.0817, 0);
  const cylinder_027Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_027 = new THREE.Mesh(cylinder_027Geometry, MetalMaterial);
  cylinder_027.position.set(12.6592, 4.965, -0.8133);
  cylinder_027.scale.set(-0.017, 0.87, 0.017);

  const cube_496Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_496 = new THREE.Mesh(cube_496Geometry, MetalMaterial);
  cube_496.scale.set(-0.0457, 0.0229, 0.0229);
  cube_496.setRotation(0.0, 0.0, -0.0);
  const cube_496MZ = cube_496.clone();
  cube_496MZ.updateMatrixWorld(true);
  cube_496.position.set(0, 0, 0.8132);
  cube_496MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_496MZ.position.set(0, 0, -2.4397);
  const cube_496MirroredZ = new THREE.Group();
  cube_496MirroredZ.add(cube_496, cube_496MZ);
  cube_496MirroredZ.position.set(12.6349, 4.0817, 0);
  const cylinder_028Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_028 = new THREE.Mesh(cylinder_028Geometry, MetalMaterial);
  cylinder_028.position.set(12.6592, 4.965, 0.8132);
  cylinder_028.scale.set(-0.017, 0.87, 0.017);

  const cube_497Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_497 = new THREE.Mesh(cube_497Geometry, Floor_trainMaterial);
  cube_497.position.set(-0.0006, 2.1963, -0.0);
  cube_497.scale.set(12.5105, 0.1214, 2.3753);

  const cube_533Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_533Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_533 = new THREE.Mesh(cube_533Geometry, Blue_PictureMaterial);
    cube_533.scale.set(2.1144, 0.051, 0.8864);
    cube_533.position.set(6.4194 * i, 0, 0);
    cube_533Group.add(cube_533);
  }
  cube_533Group.setRotation(1.5708, 0.0, 0.0);
  cube_533Group.position.set(-6.4204, 3.1279, 2.4191);
  const cube_542Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_542Group = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cube_542 = new THREE.Mesh(cube_542Geometry, WhiteDotsMaterial);
    cube_542.scale.set(2.1443, -0.0248, 0.1709);
    cube_542.position.set(6.4201 * i, 0, 0);
    cube_542Group.add(cube_542);
  }
  cube_542Group.setRotation(1.5708, 0.0, 0.0);
  cube_542Group.position.set(-6.4204, 3.7969, 2.4659);
  const DrawTrainDoorFunctionEntityGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.4192 * i, 0, 0);
    DrawTrainDoorFunctionEntityGroup.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGroup.setRotation(0.0, 0.0, -0.0);

  const DrawTrainDoorFunctionEntityGroupMZ = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.4192 * i, 0, 0);
    DrawTrainDoorFunctionEntityGroupMZ.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGroupMZ.updateMatrixWorld(true);

  DrawTrainDoorFunctionEntityGroup.position.set(0, 0, -2.4011);
  DrawTrainDoorFunctionEntityGroupMZ.applyMatrix(
    new THREE.Matrix4().makeScale(1, 1, -1),
  );
  DrawTrainDoorFunctionEntityGroupMZ.position.set(0, 0, 2.4011);

  const DrawTrainDoorFunctionEntityGroupMirroredZ = new THREE.Group();
  DrawTrainDoorFunctionEntityGroupMirroredZ.add(
    DrawTrainDoorFunctionEntityGroup,
    DrawTrainDoorFunctionEntityGroupMZ,
  );
  DrawTrainDoorFunctionEntityGroupMirroredZ.position.set(-9.6225, 2.2455, 0);

  const Decor = DrawVagonDecorations();
  const out = new THREE.Group();
  out.add(
    Decor,
    cylinder_wheel_008MirroredZ,
    cylinder_wheel_009MirroredZ,
    cylinder_wheel_010MirroredZ,
    cylinder_wheel_011MirroredZ,
    cube_307,
    cube_308MirroredZ,
    cube_309MirroredZ,
    cube_310MirroredZ,
    cylinder_021GroupMirroredZ,
    cube_311MirroredZ,
    cube_312MirroredZ,
    cube_313MirroredZ,
    cube_314MirroredZ,
    cube_315MirroredZ,
    cube_316MirroredZ,
    cylinder_wheel_012MirroredZ,
    cylinder_wheel_013MirroredZ,
    cylinder_wheel_014MirroredZ,
    cylinder_wheel_015MirroredZ,
    cube_317MirroredZ,
    cube_318MirroredZ,
    cube_319MirroredZ,
    cube_320MirroredZ,
    cube_321MirroredZ,
    cube_322MirroredZ,
    cube_323MirroredZ,
    cube_324MirroredZ,
    cube_325MirroredZ,
    cube_326MirroredZ,
    cube_327MirroredZ,
    cylinder_022MirroredZ,
    sphere_002MirroredZ,
    cube_328MirroredZ,
    cube_329MirroredZ,
    cube_330MirroredZ,
    cube_331,
    cube_332,
    cube_333,
    cube_334MirroredZMirroredY,
    cube_335MirroredZ,
    cube_336MirroredZMirroredY,
    cube_337MirroredXMirroredZMirroredY,
    cube_338,
    cube_339MirroredZMirroredY,
    cube_340MirroredY,
    cube_341MirroredZ,
    cube_342MirroredXMirroredZMirroredY,
    cube_343MirroredZMirroredY,
    cylinder_023GroupMirroredZ,
    cube_344MirroredZ,
    cube_345MirroredZ,
    cylinder_024MirroredZ,
    sphere_003MirroredZ,
    cube_346MirroredZ,
    cube_347MirroredZ,
    cube_348MirroredZ,
    cube_349,
    cube_350,
    cube_351MirroredZMirroredY,
    cube_352MirroredZ,
    cube_353MirroredZMirroredY,
    cube_354MirroredXMirroredZMirroredY,
    cube_355,
    cube_356MirroredZMirroredY,
    cube_357MirroredY,
    cube_358MirroredZ,
    cube_359MirroredXMirroredZMirroredY,
    cube_360MirroredZMirroredY,
    cube_361,
    cube_362,
    cube_363,
    cube_364,
    cube_365,
    cube_372,
    cube_373,
    cube_374,
    cube_409Group,
    cube_410Group,
    cube_411,
    cube_412Group,
    cube_413Group,
    cube_414Group,
    cube_415GroupMirroredY,
    cube_416GroupMirroredY,
    cube_417GroupMirroredY,
    cube_418Group,
    cube_419Group,
    cube_420Group,
    cube_421Group,
    cube_422Group,
    cube_423Group,
    cube_424Group,
    cube_425GroupMirroredY,
    cube_426GroupMirroredY,
    cube_427GroupMirroredY,
    cube_428Group,
    cube_429Group,
    cube_430,
    cube_431Group,
    cube_432Group,
    cube_433Group,
    cube_442Group,
    cube_443Group,
    cube_444Group,
    cube_445Group,
    cube_446Group,
    cube_447Group,
    cube_448Group,
    cube_449Group,
    cube_450Group,
    cube_451Group,
    cube_452Group,
    cube_453Group,
    cube_454Group,
    cube_455Group,
    cube_456Group,
    cube_457Group,
    cube_458Group,
    cube_459Group,
    cube_460Group,
    cube_461Group,
    cube_462GroupMirroredZ,
    cube_463,
    cube_464Group,
    cube_465Group,
    cube_466Group,
    cube_475Group,
    cube_476Group,
    cube_477Group,
    cube_478Group,
    cube_479Group,
    cube_480Group,
    cube_481Group,
    cube_482Group,
    cube_483Group,
    cube_484Group,
    cube_485Group,
    cube_486Group,
    cube_487Group,
    cube_488Group,
    cube_489Group,
    cube_490Group,
    cube_491Group,
    cube_492Group,
    cube_493MirroredZ,
    cylinder_025,
    cube_494MirroredZ,
    cylinder_026,
    cube_495MirroredZ,
    cylinder_027,
    cube_496MirroredZ,
    cylinder_028,
    cube_497,
    cube_533Group,
    cube_542Group,
    DrawTrainDoorFunctionEntityGroupMirroredZ,
  );

  return out;
}

function DrawRightDoorFunction() {
  const cube_642Geometry = new THREE.BoxGeometry(2, 2, 2);
  const Train_blue_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0343, 0.1009, 0.652),
    roughness: 0.5,
  });
  const Glass_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2227, 0.241, 0.3264),
    transparent: true,
    opacity: 0.315,
    roughness: 0.5,
  });
  const Coloumn_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0, 0.0, 0.0),
    roughness: 0.5,
  });
  const WhiteDots_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
  });
  const Metal_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.477, 0.477, 0.477),
    metalness: 1.0,
    roughness: 0.5,
  });
  const cube_642 = new THREE.Mesh(cube_642Geometry, Train_blue_003Material);
  cube_642.position.set(-0.5485, 0.8713, -0.0051);
  cube_642.scale.set(0.5484, 0.0351, 0.8609);
  cube_642.setRotation(1.5708, 3.1416, 0.0);

  const cube_643Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_643 = new THREE.Mesh(cube_643Geometry, Glass_003Material);
  cube_643.position.set(-0.5485, 2.5616, -0.0051);
  cube_643.scale.set(-0.0151, 0.9163, 0.3739);
  cube_643.setRotation(0.0, 1.5708, 0.0);

  const cube_644Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_644 = new THREE.Mesh(cube_644Geometry, Coloumn_003Material);
  cube_644.scale.set(0.1252, 0.0309, 0.1349);
  cube_644.setRotation(1.5708, 3.1416, 0.7854);
  const cube_644MY = cube_644.clone();
  cube_644MY.updateMatrixWorld(true);
  cube_644.position.set(0, 1.7421, 0);
  cube_644MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_644MY.position.set(0, 3.3811, 0);
  const cube_644MirroredY = new THREE.Group();
  cube_644MirroredY.add(cube_644, cube_644MY);
  cube_644MirroredY.position.set(-0.2006, 0, -0.0051);
  const cube_645Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_645 = new THREE.Mesh(cube_645Geometry, Train_blue_003Material);
  cube_645.position.set(-0.9986, 2.605, -0.0051);
  cube_645.scale.set(0.0984, 0.0351, 0.8728);
  cube_645.setRotation(1.5708, 3.1416, 0.0);

  const cube_646Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_646 = new THREE.Mesh(cube_646Geometry, Coloumn_003Material);
  cube_646.position.set(-0.5511, 1.7302, -0.0051);
  cube_646.scale.set(0.3579, 0.0309, 0.0215);
  cube_646.setRotation(1.5708, 3.1416, 0.0);

  const cube_647Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_647 = new THREE.Mesh(cube_647Geometry, Coloumn_003Material);
  cube_647.scale.set(0.1252, 0.0309, 0.1349);
  cube_647.setRotation(1.5708, 3.1416, 0.7854);
  const cube_647MY = cube_647.clone();
  cube_647MY.updateMatrixWorld(true);
  cube_647.position.set(0, 1.7421, 0);
  cube_647MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  cube_647MY.position.set(0, 3.3811, 0);
  const cube_647MirroredY = new THREE.Group();
  cube_647MirroredY.add(cube_647, cube_647MY);
  cube_647MirroredY.position.set(-0.9097, 0, -0.0051);
  const cube_648Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_648 = new THREE.Mesh(cube_648Geometry, WhiteDots_003Material);
  cube_648.position.set(-0.0872, 0.5556, -0.0198);
  cube_648.scale.set(0.087, 0.0279, 0.087);
  cube_648.setRotation(1.5708, 0.0, -0.0);

  const cube_649Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_649 = new THREE.Mesh(cube_649Geometry, Coloumn_003Material);
  cube_649.position.set(-0.0177, 2.3728, -0.0123);
  cube_649.scale.set(2.3673, 0.0387, 0.0176);
  cube_649.setRotation(4.7124, 0.0, 1.5708);

  const cube_650Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_650 = new THREE.Mesh(cube_650Geometry, Train_blue_003Material);
  cube_650.position.set(-0.5485, 4.0511, -0.0051);
  cube_650.scale.set(0.5484, 0.0351, 0.6526);
  cube_650.setRotation(1.5708, 3.1416, 0.0);

  const cube_651Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_651 = new THREE.Mesh(cube_651Geometry, Glass_003Material);
  cube_651.position.set(-0.5485, 2.5616, -0.0051);
  cube_651.scale.set(-0.0151, 0.9163, 0.3739);
  cube_651.setRotation(0.0, 1.5708, 0.0);

  const cube_652Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_652 = new THREE.Mesh(cube_652Geometry, Train_blue_003Material);
  cube_652.position.set(-0.0985, 2.605, -0.0051);
  cube_652.scale.set(0.0984, 0.0351, 0.8728);
  cube_652.setRotation(1.5708, 3.1416, 0.0);

  const cube_653Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_653 = new THREE.Mesh(cube_653Geometry, WhiteDots_003Material);
  cube_653.position.set(-0.6357, 1.1039, -0.0237);
  cube_653.scale.set(0.7754, 0.0248, 0.1232);
  cube_653.setRotation(1.5708, 0.0, -0.7854);

  const cube_654Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_654 = new THREE.Mesh(cube_654Geometry, Metal_003Material);
  cube_654.position.set(-0.5485, 0.4296, -0.0099);
  cube_654.scale.set(0.0294, 0.0351, 0.5456);
  cube_654.setRotation(-1.5708, 0.0, 1.5708);

  const out = new THREE.Group();
  out.add(
    cube_642,
    cube_643,
    cube_644MirroredY,
    cube_645,
    cube_646,
    cube_647MirroredY,
    cube_648,
    cube_649,
    cube_650,
    cube_651,
    cube_652,
    cube_653,
    cube_654,
  );
  return out;
}

function DrawStation() {
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
  const Floor_Sides_1Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3343, 0.2742, 0.1854),
    metalness: 0.123,
    roughness: 0.3333,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 0.5225, 0.0),
  });
  const FloorTileMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.686, 0.6165, 0.3163),
    roughness: 0.5,
  });
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'Anonymous';
  const myTexture = textureLoader.load(
    'http://livelab.spb.ru/labs/files/metromap2023r.jpg',
  );

  const MapMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.5,
    color: new THREE.Color(1, 1, 1),
    map: myTexture,
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 21; i++) {
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
  for (let i = 0; i < 12; i++) {
    const cube = new THREE.Mesh(cubeGeometry, ColoumnPlateMaterial);
    cube.scale.set(1.0, 3.4789, 1.0);
    cube.position.set(6.0 * i, 0, 0);
    cubeGroup.add(cube);
  }
  cubeGroup.position.set(-30.709, 4.3331, 7.8995);
  const cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_002Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_002 = new THREE.Mesh(cube_002Geometry, ColoumnPlateMaterial);
    cube_002.scale.set(0.4453, 0.2934, 0.9985);
    cube_002.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_002Group.add(cube_002);
  }
  cube_002Group.setRotation(0.0, 0.0, 1.0669);
  cube_002Group.position.set(-29.8356, 4.92, 7.8995);
  const cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_004Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_004 = new THREE.Mesh(cube_004Geometry, ColoumnPlateMaterial);
    cube_004.scale.set(0.4453, 0.4393, 0.9985);
    cube_004.position.set(4.771 * i, -3.6355 * i, 0);
    cube_004Group.add(cube_004);
  }
  cube_004Group.setRotation(0.0, 0.0, 0.6511);
  cube_004Group.position.set(-29.3814, 5.5959, 7.8995);
  const cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_005Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_005 = new THREE.Mesh(cube_005Geometry, ColoumnPlateMaterial);
    cube_005.scale.set(0.4453, 0.2384, 0.9985);
    cube_005.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_005Group.add(cube_005);
  }
  cube_005Group.setRotation(0.0, 0.0, 0.3109);
  cube_005Group.position.set(-28.5579, 5.832, 7.8995);
  const cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_006Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_006 = new THREE.Mesh(cube_006Geometry, ColoumnPlateMaterial);
    cube_006.scale.set(0.4453, 0.1584, 0.9985);
    cube_006.position.set(5.9981 * i, 0, 0);
    cube_006Group.add(cube_006);
  }
  cube_006Group.position.set(-27.6974, 5.8917, 7.8995);
  const cube_007Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_007Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
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
  for (let i = 0; i < 11; i++) {
    const cube_011 = new THREE.Mesh(cube_011Geometry, ColoumnPlateMaterial);
    cube_011.scale.set(0.4453, 0.2384, 0.9985);
    cube_011.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_011Group.add(cube_011);
  }
  cube_011Group.setRotation(0.0, 0.0, -0.3109);
  cube_011Group.position.set(-26.8361, 5.832, 7.8995);
  const cube_012Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_012Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_012 = new THREE.Mesh(cube_012Geometry, ColoumnPlateMaterial);
    cube_012.scale.set(0.4453, 0.4393, 0.9985);
    cube_012.position.set(4.771 * i, 3.6355 * i, 0);
    cube_012Group.add(cube_012);
  }
  cube_012Group.setRotation(0.0, 0.0, -0.6511);
  cube_012Group.position.set(-26.0135, 5.5959, 7.8995);
  const cube_013Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_013Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_013 = new THREE.Mesh(cube_013Geometry, Floor_ColumnsMaterial);
    cube_013.scale.set(0.4453, 0.2934, 0.6455);
    cube_013.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_013Group.add(cube_013);
  }
  cube_013Group.setRotation(0.0, 0.0, -1.0669);
  cube_013Group.position.set(-25.6364, 4.92, 7.8995);
  const cube_015Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_015Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube_015 = new THREE.Mesh(cube_015Geometry, Floor_ColumnsMaterial);
    cube_015.scale.set(1.05, 3.4789, 0.6455);
    cube_015.position.set(6.0 * i, 0, 0);
    cube_015Group.add(cube_015);
  }
  cube_015Group.position.set(-30.709, 4.3331, 7.8995);
  const cube_016Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_016Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_016 = new THREE.Mesh(cube_016Geometry, Floor_ColumnsMaterial);
    cube_016.scale.set(0.4453, 0.2934, 0.6455);
    cube_016.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_016Group.add(cube_016);
  }
  cube_016Group.setRotation(0.0, 0.0, 1.0669);
  cube_016Group.position.set(-29.777, 4.92, 7.8995);
  const cube_017Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_017Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_017 = new THREE.Mesh(cube_017Geometry, Floor_ColumnsMaterial);
    cube_017.scale.set(0.4453, 0.4393, 0.6455);
    cube_017.position.set(4.771 * i, -3.6355 * i, 0);
    cube_017Group.add(cube_017);
  }
  cube_017Group.setRotation(0.0, 0.0, 0.6511);
  cube_017Group.position.set(-29.3235, 5.5959, 7.8995);
  const cube_018Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_018Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_018 = new THREE.Mesh(cube_018Geometry, Floor_ColumnsMaterial);
    cube_018.scale.set(0.4453, 0.2384, 0.6455);
    cube_018.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_018Group.add(cube_018);
  }
  cube_018Group.setRotation(0.0, 0.0, 0.3109);
  cube_018Group.position.set(-28.4432, 5.832, 7.8995);
  const cube_019Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_019Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
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
  for (let i = 0; i < 11; i++) {
    const cube_021 = new THREE.Mesh(cube_021Geometry, Floor_ColumnsMaterial);
    cube_021.scale.set(0.4453, 0.4393, 0.6455);
    cube_021.position.set(4.771 * i, 3.6355 * i, 0);
    cube_021Group.add(cube_021);
  }
  cube_021Group.setRotation(0.0, 0.0, -0.6511);
  cube_021Group.position.set(-26.068, 5.5959, 7.8995);
  const cube_022Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_022Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_022 = new THREE.Mesh(cube_022Geometry, Floor_ColumnsMaterial);
    cube_022.scale.set(0.4453, 0.2384, 0.6455);
    cube_022.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_022Group.add(cube_022);
  }
  cube_022Group.setRotation(0.0, 0.0, -0.3109);
  cube_022Group.position.set(-26.9447, 5.832, 7.8995);
  const cube_010Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_010Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube_010 = new THREE.Mesh(cube_010Geometry, ColoumnPlateMaterial);
    cube_010.scale.set(1.0, 3.4789, 1.0);
    cube_010.position.set(6.0 * i, 0, 0);
    cube_010Group.add(cube_010);
  }
  cube_010Group.position.set(-30.709, 4.3331, -7.8995);
  const cube_023Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_023Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube_023 = new THREE.Mesh(cube_023Geometry, Floor_ColumnsMaterial);
    cube_023.scale.set(1.05, 3.4789, 0.6455);
    cube_023.position.set(6.0 * i, 0, 0);
    cube_023Group.add(cube_023);
  }
  cube_023Group.position.set(-30.709, 4.3331, -7.8995);
  const cube_024Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_024Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_024 = new THREE.Mesh(cube_024Geometry, ColoumnPlateMaterial);
    cube_024.scale.set(0.4453, 0.2934, 0.9985);
    cube_024.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_024Group.add(cube_024);
  }
  cube_024Group.setRotation(0.0, 0.0, 1.0669);
  cube_024Group.position.set(-29.8356, 4.92, -7.901);
  const cube_025Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_025Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_025 = new THREE.Mesh(cube_025Geometry, ColoumnPlateMaterial);
    cube_025.scale.set(0.4453, 0.4393, 0.9985);
    cube_025.position.set(4.771 * i, -3.6355 * i, 0);
    cube_025Group.add(cube_025);
  }
  cube_025Group.setRotation(0.0, 0.0, 0.6511);
  cube_025Group.position.set(-29.3814, 5.5959, -7.901);
  const cube_026Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_026Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_026 = new THREE.Mesh(cube_026Geometry, ColoumnPlateMaterial);
    cube_026.scale.set(0.4453, 0.2384, 0.9985);
    cube_026.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_026Group.add(cube_026);
  }
  cube_026Group.setRotation(0.0, 0.0, 0.3109);
  cube_026Group.position.set(-28.5579, 5.832, -7.901);
  const cube_027Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_027Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_027 = new THREE.Mesh(cube_027Geometry, ColoumnPlateMaterial);
    cube_027.scale.set(0.4453, 0.1584, 0.9985);
    cube_027.position.set(5.9981 * i, 0, 0);
    cube_027Group.add(cube_027);
  }
  cube_027Group.position.set(-27.6974, 5.8917, -7.901);
  const cube_028Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_028Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_028 = new THREE.Mesh(cube_028Geometry, ColoumnPlateMaterial);
    cube_028.scale.set(0.4453, 0.2934, 0.9985);
    cube_028.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_028Group.add(cube_028);
  }
  cube_028Group.setRotation(0.0, 0.0, -1.0669);
  cube_028Group.position.set(-25.5818, 4.92, -7.901);
  const cube_029Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_029Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_029 = new THREE.Mesh(cube_029Geometry, ColoumnPlateMaterial);
    cube_029.scale.set(0.4453, 0.2384, 0.9985);
    cube_029.position.set(5.7105 * i, 1.8349 * i, 0);
    cube_029Group.add(cube_029);
  }
  cube_029Group.setRotation(0.0, 0.0, -0.3109);
  cube_029Group.position.set(-26.8361, 5.832, -7.901);
  const cube_030Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_030Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_030 = new THREE.Mesh(cube_030Geometry, ColoumnPlateMaterial);
    cube_030.scale.set(0.4453, 0.4393, 0.9985);
    cube_030.position.set(4.771 * i, 3.6355 * i, 0);
    cube_030Group.add(cube_030);
  }
  cube_030Group.setRotation(0.0, 0.0, -0.6511);
  cube_030Group.position.set(-26.0135, 5.5959, -7.901);
  const cube_031Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_031Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_031 = new THREE.Mesh(cube_031Geometry, Floor_ColumnsMaterial);
    cube_031.scale.set(0.4453, 0.2934, 0.6455);
    cube_031.position.set(2.8961 * i, 5.2527 * i, 0);
    cube_031Group.add(cube_031);
  }
  cube_031Group.setRotation(0.0, 0.0, -1.0669);
  cube_031Group.position.set(-25.6364, 4.92, -7.901);
  const cube_032Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_032Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_032 = new THREE.Mesh(cube_032Geometry, Floor_ColumnsMaterial);
    cube_032.scale.set(0.4453, 0.2934, 0.6455);
    cube_032.position.set(2.8961 * i, -5.2527 * i, 0);
    cube_032Group.add(cube_032);
  }
  cube_032Group.setRotation(0.0, 0.0, 1.0669);
  cube_032Group.position.set(-29.777, 4.92, -7.901);
  const cube_033Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_033Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_033 = new THREE.Mesh(cube_033Geometry, Floor_ColumnsMaterial);
    cube_033.scale.set(0.4453, 0.4393, 0.6455);
    cube_033.position.set(4.771 * i, -3.6355 * i, 0);
    cube_033Group.add(cube_033);
  }
  cube_033Group.setRotation(0.0, 0.0, 0.6511);
  cube_033Group.position.set(-29.3235, 5.5959, -7.901);
  const cube_034Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_034Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_034 = new THREE.Mesh(cube_034Geometry, Floor_ColumnsMaterial);
    cube_034.scale.set(0.4453, 0.2384, 0.6455);
    cube_034.position.set(5.7105 * i, -1.8349 * i, 0);
    cube_034Group.add(cube_034);
  }
  cube_034Group.setRotation(0.0, 0.0, 0.3109);
  cube_034Group.position.set(-28.4432, 5.832, -7.901);
  const cube_035Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_035Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_035 = new THREE.Mesh(cube_035Geometry, Floor_ColumnsMaterial);
    cube_035.scale.set(0.4453, 0.1584, 0.6455);
    cube_035.position.set(5.9981 * i, 0, 0);
    cube_035Group.add(cube_035);
  }
  cube_035Group.position.set(-27.6974, 5.8583, -7.901);
  const cube_036Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_036Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_036 = new THREE.Mesh(cube_036Geometry, Floor_ColumnsMaterial);
    cube_036.scale.set(0.4453, 0.4393, 0.6455);
    cube_036.position.set(4.771 * i, 3.6355 * i, 0);
    cube_036Group.add(cube_036);
  }
  cube_036Group.setRotation(0.0, 0.0, -0.6511);
  cube_036Group.position.set(-26.068, 5.5959, -7.901);
  const cube_037Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_037Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
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
  cube_038.setRotation(0.0, 0.0, -0.0);
  const cube_038MZ = cube_038.clone();
  cube_038MZ.updateMatrixWorld(true);
  cube_038.position.set(0, 0, 7.8995);
  cube_038MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_038MZ.position.set(0, 0, -7.8995);
  const cube_038MirroredZ = new THREE.Group();
  cube_038MirroredZ.add(cube_038, cube_038MZ);
  cube_038MirroredZ.position.set(44.5687, 4.3331, 0);
  const cube_039Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_039 = new THREE.Mesh(cube_039Geometry, ColoumnPlateMaterial);
  cube_039.scale.set(1.0167, 3.4789, 2.3384);
  cube_039.setRotation(0.0, 0.0, -0.0);
  const cube_039MZ = cube_039.clone();
  cube_039MZ.updateMatrixWorld(true);
  cube_039.position.set(0, 0, 9.2379);
  cube_039MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_039MZ.position.set(0, 0, -9.2379);
  const cube_039MirroredZ = new THREE.Group();
  cube_039MirroredZ.add(cube_039, cube_039MZ);
  cube_039MirroredZ.position.set(53.863, 4.3331, 0);
  const cube_040Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_040 = new THREE.Mesh(cube_040Geometry, ColoumnPlateMaterial);
  cube_040.scale.set(15.8045, 3.4789, 1.128);
  cube_040.setRotation(0.0, 0.0, -0.0);
  const cube_040MZ = cube_040.clone();
  cube_040MZ.updateMatrixWorld(true);
  cube_040.position.set(0, 0, 10.4484);
  cube_040MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_040MZ.position.set(0, 0, -10.4484);
  const cube_040MirroredZ = new THREE.Group();
  cube_040MirroredZ.add(cube_040, cube_040MZ);
  cube_040MirroredZ.position.set(70.6842, 4.3331, 0);
  const cube_070Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_070Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_070 = new THREE.Mesh(cube_070Geometry, ColoumnPlateMaterial);
    cube_070.scale.set(2.0429, 0.9826, 0.9985);
    cube_070.position.set(5.998 * i, 0, 0);
    cube_070Group.add(cube_070);
  }
  cube_070Group.position.set(-27.6974, 6.8294, -7.901);
  const cube_071Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_071Group = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const cube_071 = new THREE.Mesh(cube_071Geometry, ColoumnPlateMaterial);
    cube_071.scale.set(2.0429, 0.9826, 0.9985);
    cube_071.position.set(5.998 * i, 0, 0);
    cube_071Group.add(cube_071);
  }
  cube_071Group.position.set(-27.6974, 6.8294, 7.901);
  const cube_092Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_092 = new THREE.Mesh(cube_092Geometry, ColoumnPlateMaterial);
  cube_092.scale.set(8.9444, 3.4789, 1.0);
  cube_092.setRotation(0.0, 0.0, -0.0);
  const cube_092MZ = cube_092.clone();
  cube_092MZ.updateMatrixWorld(true);
  cube_092.position.set(0, 0, 7.8995);
  cube_092MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_092MZ.position.set(0, 0, -7.8995);
  const cube_092MirroredZ = new THREE.Group();
  cube_092MirroredZ.add(cube_092, cube_092MZ);
  cube_092MirroredZ.position.set(-40.6534, 4.3331, 0);
  const cube_300Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_300 = new THREE.Mesh(cube_300Geometry, ColoumnPlateMaterial);
  cube_300.scale.set(146.5053, 6.6273, 2.6352);
  cube_300.setRotation(0.0, 0.0, -0.0);
  const cube_300MZ = cube_300.clone();
  cube_300MZ.updateMatrixWorld(true);
  cube_300.position.set(0, 0, 12.4841);
  cube_300MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_300MZ.position.set(0, 0, -12.4841);
  const cube_300MirroredZ = new THREE.Group();
  cube_300MirroredZ.add(cube_300, cube_300MZ);
  cube_300MirroredZ.position.set(197.0714, 3.2323, 0);
  const cube_301Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_301 = new THREE.Mesh(cube_301Geometry, ColoumnPlateMaterial);
  cube_301.scale.set(146.5053, 6.6273, 2.6352);
  cube_301.setRotation(1.8693, 0.0, 0.0);
  const cube_301MZ = cube_301.clone();
  cube_301MZ.updateMatrixWorld(true);
  cube_301.position.set(0, 0, 19.9295);
  cube_301MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_301MZ.position.set(0, 0, -19.9295);
  const cube_301MirroredZ = new THREE.Group();
  cube_301MirroredZ.add(cube_301, cube_301MZ);
  cube_301MirroredZ.position.set(197.0714, 10.2316, 0);
  const cube_306Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_306 = new THREE.Mesh(cube_306Geometry, ColoumnPlateMaterial);
  cube_306.scale.set(146.5053, 6.6273, 2.6352);
  cube_306.setRotation(1.8693, 0.0, 0.0);
  const cube_306MZ = cube_306.clone();
  cube_306MZ.updateMatrixWorld(true);
  cube_306.position.set(0, 0, 19.9273);
  cube_306MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_306MZ.position.set(0, 0, -19.9273);
  const cube_306MirroredZ = new THREE.Group();
  cube_306MirroredZ.add(cube_306, cube_306MZ);
  cube_306MirroredZ.position.set(-195.3522, 10.2316, 0);
  const cube_bigroofGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_bigroof = new THREE.Mesh(
    cube_bigroofGeometry,
    Floor_CentralMaterial,
  );
  cube_bigroof.scale.set(347.5576, 0.1743, 6.2642);
  cube_bigroof.setRotation(1.5708, 0.0, 0.0);
  const cube_bigroofMZ = cube_bigroof.clone();
  cube_bigroofMZ.updateMatrixWorld(true);
  cube_bigroof.position.set(0, 0, 22.6954);
  cube_bigroofMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_bigroofMZ.position.set(0, 0, -22.6954);
  const cube_bigroofMirroredZ = new THREE.Group();
  cube_bigroofMirroredZ.add(cube_bigroof, cube_bigroofMZ);
  cube_bigroofMirroredZ.position.set(-0.2398, -0.2095, 0);
  const cube_bigroof_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_bigroof_004 = new THREE.Mesh(
    cube_bigroof_004Geometry,
    Floor_CentralMaterial,
  );
  cube_bigroof_004.scale.set(49.229, 0.1743, 3.3728);
  cube_bigroof_004.setRotation(1.5708, 0.0, 0.0);
  const cube_bigroof_004MZ = cube_bigroof_004.clone();
  cube_bigroof_004MZ.updateMatrixWorld(true);
  cube_bigroof_004.position.set(0, 0, 14.5133);
  cube_bigroof_004MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_bigroof_004MZ.position.set(0, 0, -14.5133);
  const cube_bigroof_004MirroredZ = new THREE.Group();
  cube_bigroof_004MirroredZ.add(cube_bigroof_004, cube_bigroof_004MZ);
  cube_bigroof_004MirroredZ.position.set(-1.2151, -3.1009, 0);
  const cube_escfloor_011Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_escfloor_011 = new THREE.Mesh(
    cube_escfloor_011Geometry,
    RoofTilesMaterial,
  );
  cube_escfloor_011.position.set(72.3317, 0.7364, -6.6458);
  cube_escfloor_011.scale.set(1.3957, 0.9468, 0.1099);
  cube_escfloor_011.setRotation(1.5708, 0.0, 0.0);

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
  cube_043.setRotation(1.5708, 0.0, 0.0);
  const cube_043MZ = cube_043.clone();
  cube_043MZ.updateMatrixWorld(true);
  cube_043.position.set(0, 0, -5.01);
  cube_043MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_043MZ.position.set(0, 0, 5.01);
  const cube_043MirroredZ = new THREE.Group();
  cube_043MirroredZ.add(cube_043, cube_043MZ);
  cube_043MirroredZ.position.set(53.6094, 7.359, 0);
  const cube_044Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_044 = new THREE.Mesh(cube_044Geometry, BrassMaterial);
  cube_044.scale.set(1.2033, 0.0529, 1.7061);
  cube_044.setRotation(1.5708, 0.0, 0.0);
  const cube_044MZ = cube_044.clone();
  cube_044MZ.updateMatrixWorld(true);
  cube_044.position.set(0, 0, -2.5808);
  cube_044MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_044MZ.position.set(0, 0, 2.5808);
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
  cube_050.setRotation(0.0, 0.0, -0.0);
  const cube_050MX = cube_050.clone();
  cube_050MX.updateMatrixWorld(true);
  cube_050.position.set(52.3403, 0, 0);
  cube_050MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  cube_050MX.position.set(52.416, 0, 0);
  const cube_050MirroredX = new THREE.Group();
  cube_050MirroredX.add(cube_050, cube_050MX);
  cube_050MirroredX.position.set(0, 8.8056, -0.0);
  const cube_051Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_051 = new THREE.Mesh(cube_051Geometry, ColoumnMaterial);
  cube_051.scale.set(0.0328, 0.0583, 0.0328);
  cube_051.setRotation(1.5708, 0.0, 0.0);
  const cube_051MZ = cube_051.clone();
  cube_051MZ.updateMatrixWorld(true);
  cube_051.position.set(0, 0, 0.8682);
  cube_051MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_051MZ.position.set(0, 0, -0.8682);
  const cube_051MirroredZ = new THREE.Group();
  cube_051MirroredZ.add(cube_051, cube_051MZ);
  cube_051MirroredZ.position.set(52.3403, 7.9374, 0);
  const cube_052Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_052 = new THREE.Mesh(cube_052Geometry, ColoumnMaterial);
  cube_052.scale.set(0.0328, 0.0583, 0.0328);
  cube_052.setRotation(2.3562, 0.0, 0.0);
  const cube_052MZ = cube_052.clone();
  cube_052MZ.updateMatrixWorld(true);
  cube_052.position.set(0, 0, 0.6139);
  cube_052MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_052MZ.position.set(0, 0, -0.6139);
  const cube_052MirroredZ = new THREE.Group();
  cube_052MirroredZ.add(cube_052, cube_052MZ);
  cube_052MirroredZ.position.set(52.3403, 7.3235, 0);
  const cube_053Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_053 = new THREE.Mesh(cube_053Geometry, ColoumnMaterial);
  cube_053.scale.set(0.0328, 0.0583, 0.0328);
  cube_053.setRotation(0.7854, 0.0, 0.0);
  const cube_053MZ = cube_053.clone();
  cube_053MZ.updateMatrixWorld(true);
  cube_053.position.set(0, 0, 0.6139);
  cube_053MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_053MZ.position.set(0, 0, -0.6139);
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
  for (let i = 0; i < 5; i++) {
    const cube_066 = new THREE.Mesh(cube_066Geometry, MapMaterial);
    cube_066.scale.set(0.0392, 0.6686, 0.47);
    cube_066.position.set(12.001 * i, 0, 0);
    cube_066Group.add(cube_066);
  }
  cube_066Group.position.set(-23.6566, 3.1162, 7.8995);
  const cube_067Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_067Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cube_067 = new THREE.Mesh(cube_067Geometry, MapMaterial);
    cube_067.scale.set(0.0392, 0.6686, 0.47);
    cube_067.position.set(12.001 * i, 0, 0);
    cube_067Group.add(cube_067);
  }
  cube_067Group.position.set(-23.6566, 3.1162, -7.8995);
  const cube_068Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_068Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cube_068 = new THREE.Mesh(cube_068Geometry, MapMaterial);
    cube_068.scale.set(0.0392, 0.6686, 0.47);
    cube_068.position.set(12.001 * i, 0, 0);
    cube_068Group.add(cube_068);
  }
  cube_068Group.position.set(-25.7557, 3.1162, 7.8995);
  const cube_069Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_069Group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cube_069 = new THREE.Mesh(cube_069Geometry, MapMaterial);
    cube_069.scale.set(0.0392, 0.6686, 0.47);
    cube_069.position.set(12.001 * i, 0, 0);
    cube_069Group.add(cube_069);
  }
  cube_069Group.position.set(-25.7557, 3.1162, -7.8995);
  const cube_072Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_072 = new THREE.Mesh(cube_072Geometry, Metall_RustMaterial);
  cube_072.scale.set(337.424, 0.0913, 3.9259);
  cube_072.setRotation(0.0, 0.0, -0.0);
  const cube_072MZ = cube_072.clone();
  cube_072MZ.updateMatrixWorld(true);
  cube_072.position.set(0, 0, 18.6043);
  cube_072MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_072MZ.position.set(0, 0, -18.6043);
  const cube_072MirroredZ = new THREE.Group();
  cube_072MirroredZ.add(cube_072, cube_072MZ);
  cube_072MirroredZ.position.set(-0.9392, -1.8809, 0);
  const cube_073Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_073 = new THREE.Mesh(cube_073Geometry, Metall_RustMaterial);
  cube_073.scale.set(350.9227, 0.0913, 0.6522);
  cube_073.setRotation(-1.0876, 0.0, 0.0);
  const cube_073MZ = cube_073.clone();
  cube_073MZ.updateMatrixWorld(true);
  cube_073.position.set(0, 0, 22.347);
  cube_073MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_073MZ.position.set(0, 0, -22.347);
  const cube_073MirroredZ = new THREE.Group();
  cube_073MirroredZ.add(cube_073, cube_073MZ);
  cube_073MirroredZ.position.set(-2.026, -1.6274, 0);
  const cube_074Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_074 = new THREE.Mesh(cube_074Geometry, MetalMaterial);
  cube_074.scale.set(352.5921, 0.2605, 0.166);
  cube_074.setRotation(0.0, 0.0, -0.0);
  const cube_074MZ = cube_074.clone();
  cube_074MZ.updateMatrixWorld(true);
  cube_074.position.set(0, 0, 16.1386);
  cube_074MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_074MZ.position.set(0, 0, -16.1386);
  const cube_074MirroredZ = new THREE.Group();
  cube_074MirroredZ.add(cube_074, cube_074MZ);
  cube_074MirroredZ.position.set(-1.2826, -1.529, 0);
  const cube_075Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_075 = new THREE.Mesh(cube_075Geometry, MetalMaterial);
  cube_075.scale.set(352.5921, 0.2605, 0.166);
  cube_075.setRotation(0.0, 0.0, -0.0);
  const cube_075MZ = cube_075.clone();
  cube_075MZ.updateMatrixWorld(true);
  cube_075.position.set(0, 0, 21.0701);
  cube_075MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_075MZ.position.set(0, 0, -21.0701);
  const cube_075MirroredZ = new THREE.Group();
  cube_075MirroredZ.add(cube_075, cube_075MZ);
  cube_075MirroredZ.position.set(-1.2826, -1.529, 0);
  const cube_076Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_076 = new THREE.Mesh(cube_076Geometry, ColoumnMaterial);
  cube_076.scale.set(350.9227, 0.0913, 1.6548);
  cube_076.setRotation(1.5708, 0.0, 0.0);
  const cube_076MZ = cube_076.clone();
  cube_076MZ.updateMatrixWorld(true);
  cube_076.position.set(0, 0, 22.5792);
  cube_076MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_076MZ.position.set(0, 0, -22.5792);
  const cube_076MirroredZ = new THREE.Group();
  cube_076MirroredZ.add(cube_076, cube_076MZ);
  cube_076MirroredZ.position.set(-2.026, 0.2518, 0);
  const cube_077Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_077Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_077 = new THREE.Mesh(cube_077Geometry, WhiteDotsMaterial);
    cube_077.scale.set(1.5186, 0.0513, 1.4186);
    cube_077.position.set(3.341 * i, 0, 0);
    cube_077Group.add(cube_077);
  }
  cube_077Group.setRotation(0.053, -0.0, 0.0);
  cube_077Group.position.set(-48.0887, 9.1261, 15.2259);
  const cube_078Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_078Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_078 = new THREE.Mesh(cube_078Geometry, WhiteDotsMaterial);
    cube_078.scale.set(1.5186, 0.0513, 1.3299);
    cube_078.position.set(3.341 * i, 0, 0);
    cube_078Group.add(cube_078);
  }
  cube_078Group.setRotation(-0.2552, -0.0, 0.0);
  cube_078Group.position.set(-48.0887, 8.8694, 12.5384);
  const cube_079Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_079Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_079 = new THREE.Mesh(cube_079Geometry, WhiteDotsMaterial);
    cube_079.scale.set(1.5186, 0.0513, 1.2076);
    cube_079.position.set(3.341 * i, 0, 0);
    cube_079Group.add(cube_079);
  }
  cube_079Group.setRotation(-0.6303, -0.0, 0.0);
  cube_079Group.position.set(-48.0887, 7.8661, 10.3425);
  const cube_080Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_080Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_080 = new THREE.Mesh(cube_080Geometry, WhiteDotsMaterial);
    cube_080.scale.set(1.5186, 0.0513, 0.6538);
    cube_080.position.set(3.341 * i, 0, 0);
    cube_080Group.add(cube_080);
  }
  cube_080Group.setRotation(-1.1069, -0.0, -0.0);
  cube_080Group.position.set(-48.0887, 6.6251, 9.1086);
  const cube_081Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_081Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_081 = new THREE.Mesh(cube_081Geometry, WhiteDotsMaterial);
    cube_081.scale.set(1.5186, 0.0513, 1.4186);
    cube_081.position.set(3.341 * i, 0, 0);
    cube_081Group.add(cube_081);
  }
  cube_081Group.setRotation(0.3397, -0.0, 0.0);
  cube_081Group.position.set(-48.0887, 8.5788, 17.9723);
  const cube_082Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_082Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_082 = new THREE.Mesh(cube_082Geometry, WhiteDotsMaterial);
    cube_082.scale.set(1.5186, 0.0513, 1.3442);
    cube_082.position.set(3.341 * i, 0, 0);
    cube_082Group.add(cube_082);
  }
  cube_082Group.setRotation(0.6479, -0.0, 0.0);
  cube_082Group.position.set(-48.0887, 7.3242, 20.3389);
  const cube_083Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_083Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_083 = new THREE.Mesh(cube_083Geometry, WhiteDotsMaterial);
    cube_083.scale.set(1.5186, 0.0513, 1.3442);
    cube_083.position.set(3.341 * i, 0, 0);
    cube_083Group.add(cube_083);
  }
  cube_083Group.setRotation(1.023, -0.0, 0.0);
  cube_083Group.position.set(-48.0887, 5.4288, 22.068);
  const cube_084Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_084Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_084 = new THREE.Mesh(cube_084Geometry, MetalMaterial);
    cube_084.scale.set(0.1738, 0.0511, 1.3427);
    cube_084.position.set(3.341 * i, 0, 0);
    cube_084Group.add(cube_084);
  }
  cube_084Group.setRotation(1.023, -0.0, 0.0);
  cube_084Group.position.set(-46.4182, 5.3882, 22.0402);
  const cube_085Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_085Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_085 = new THREE.Mesh(cube_085Geometry, MetalMaterial);
    cube_085.scale.set(0.1738, 0.0513, 1.4127);
    cube_085.position.set(3.341 * i, 0, 0);
    cube_085Group.add(cube_085);
  }
  cube_085Group.setRotation(0.053, -0.0, 0.0);
  cube_085Group.position.set(-46.4182, 9.0855, 15.2265);
  const cube_086Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_086Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_086 = new THREE.Mesh(cube_086Geometry, MetalMaterial);
    cube_086.scale.set(0.1738, 0.0513, 1.3247);
    cube_086.position.set(3.341 * i, 0, 0);
    cube_086Group.add(cube_086);
  }
  cube_086Group.setRotation(-0.2552, -0.0, 0.0);
  cube_086Group.position.set(-46.4182, 8.8288, 12.5501);
  const cube_087Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_087Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_087 = new THREE.Mesh(cube_087Geometry, MetalMaterial);
    cube_087.scale.set(0.1738, 0.0512, 1.2043);
    cube_087.position.set(3.341 * i, 0, 0);
    cube_087Group.add(cube_087);
  }
  cube_087Group.setRotation(-0.6303, -0.0, 0.0);
  cube_087Group.position.set(-46.4182, 7.8255, 10.3634);
  const cube_088Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_088Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_088 = new THREE.Mesh(cube_088Geometry, MetalMaterial);
    cube_088.scale.set(0.1738, 0.0511, 0.6533);
    cube_088.position.set(3.341 * i, 0, 0);
    cube_088Group.add(cube_088);
  }
  cube_088Group.setRotation(-1.1069, -0.0, 0.0);
  cube_088Group.position.set(-46.4182, 6.5845, 9.1346);
  const cube_089Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_089Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_089 = new THREE.Mesh(cube_089Geometry, MetalMaterial);
    cube_089.scale.set(0.1738, 0.0513, 1.4133);
    cube_089.position.set(3.341 * i, 0, 0);
    cube_089Group.add(cube_089);
  }
  cube_089Group.setRotation(0.3397, -0.0, 0.0);
  cube_089Group.position.set(-46.4182, 8.5382, 17.9615);
  const cube_090Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_090Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_090 = new THREE.Mesh(cube_090Geometry, MetalMaterial);
    cube_090.scale.set(0.1738, 0.0512, 1.3406);
    cube_090.position.set(3.341 * i, 0, 0);
    cube_090Group.add(cube_090);
  }
  cube_090Group.setRotation(0.6479, -0.0, 0.0);
  cube_090Group.position.set(-46.4182, 7.2836, 20.3183);
  const cube_091Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_091Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_091 = new THREE.Mesh(cube_091Geometry, MetalMaterial);
    cube_091.scale.set(1.5186, 0.0513, 0.0838);
    cube_091.position.set(3.341 * i, 0, 0);
    cube_091Group.add(cube_091);
  }
  cube_091Group.setRotation(0.1825, 0.0, 0.0);
  cube_091Group.position.set(-48.0887, 9.0256, 16.6168);
  const cube_093Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_093Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_093 = new THREE.Mesh(cube_093Geometry, WhiteDotsMaterial);
    cube_093.scale.set(1.5186, 0.0513, 0.6538);
    cube_093.position.set(3.341 * i, 0, 0);
    cube_093Group.add(cube_093);
  }
  cube_093Group.setRotation(1.1069, -0.0, -0.0);
  cube_093Group.position.set(-48.0887, 6.6251, -9.1086);
  const cube_094Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_094Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_094 = new THREE.Mesh(cube_094Geometry, WhiteDotsMaterial);
    cube_094.scale.set(1.5186, 0.0513, 1.2076);
    cube_094.position.set(3.341 * i, 0, 0);
    cube_094Group.add(cube_094);
  }
  cube_094Group.setRotation(0.6303, -0.0, 0.0);
  cube_094Group.position.set(-48.0887, 7.8661, -10.3425);
  const cube_095Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_095Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_095 = new THREE.Mesh(cube_095Geometry, MetalMaterial);
    cube_095.scale.set(0.1738, 0.0511, 0.6533);
    cube_095.position.set(3.341 * i, 0, 0);
    cube_095Group.add(cube_095);
  }
  cube_095Group.setRotation(1.1069, -0.0, 0.0);
  cube_095Group.position.set(-46.4182, 6.5845, -9.1346);
  const cube_096Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_096Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_096 = new THREE.Mesh(cube_096Geometry, MetalMaterial);
    cube_096.scale.set(0.1738, 0.0512, 1.2043);
    cube_096.position.set(3.341 * i, 0, 0);
    cube_096Group.add(cube_096);
  }
  cube_096Group.setRotation(0.6303, -0.0, 0.0);
  cube_096Group.position.set(-46.4182, 7.8255, -10.3634);
  const cube_097Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_097Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_097 = new THREE.Mesh(cube_097Geometry, WhiteDotsMaterial);
    cube_097.scale.set(1.5186, 0.0513, 1.3299);
    cube_097.position.set(3.341 * i, 0, 0);
    cube_097Group.add(cube_097);
  }
  cube_097Group.setRotation(0.2552, -0.0, 0.0);
  cube_097Group.position.set(-48.0887, 8.8694, -12.5384);
  const cube_098Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_098Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_098 = new THREE.Mesh(cube_098Geometry, MetalMaterial);
    cube_098.scale.set(0.1738, 0.0513, 1.3247);
    cube_098.position.set(3.341 * i, 0, 0);
    cube_098Group.add(cube_098);
  }
  cube_098Group.setRotation(0.2552, -0.0, 0.0);
  cube_098Group.position.set(-46.4182, 8.8288, -12.5501);
  const cube_099Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_099Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_099 = new THREE.Mesh(cube_099Geometry, WhiteDotsMaterial);
    cube_099.scale.set(1.5186, 0.0513, 1.4186);
    cube_099.position.set(3.341 * i, 0, 0);
    cube_099Group.add(cube_099);
  }
  cube_099Group.setRotation(-0.053, -0.0, 0.0);
  cube_099Group.position.set(-48.0888, 9.1261, -15.2259);
  const cube_100Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_100Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_100 = new THREE.Mesh(cube_100Geometry, MetalMaterial);
    cube_100.scale.set(0.1738, 0.0513, 1.4127);
    cube_100.position.set(3.341 * i, 0, 0);
    cube_100Group.add(cube_100);
  }
  cube_100Group.setRotation(-0.053, -0.0, 0.0);
  cube_100Group.position.set(-46.4182, 9.0855, -15.2265);
  const cube_101Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_101Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_101 = new THREE.Mesh(cube_101Geometry, WhiteDotsMaterial);
    cube_101.scale.set(1.5186, 0.0513, 1.4186);
    cube_101.position.set(3.341 * i, 0, 0);
    cube_101Group.add(cube_101);
  }
  cube_101Group.setRotation(-0.3397, -0.0, 0.0);
  cube_101Group.position.set(-48.0887, 8.5788, -17.9723);
  const cube_102Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_102Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_102 = new THREE.Mesh(cube_102Geometry, MetalMaterial);
    cube_102.scale.set(0.1738, 0.0512, 1.3406);
    cube_102.position.set(3.341 * i, 0, 0);
    cube_102Group.add(cube_102);
  }
  cube_102Group.setRotation(-0.6479, -0.0, 0.0);
  cube_102Group.position.set(-46.4182, 7.2836, -20.3183);
  const cube_103Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_103Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_103 = new THREE.Mesh(cube_103Geometry, MetalMaterial);
    cube_103.scale.set(0.1738, 0.0513, 1.4133);
    cube_103.position.set(3.341 * i, 0, 0);
    cube_103Group.add(cube_103);
  }
  cube_103Group.setRotation(-0.3397, -0.0, 0.0);
  cube_103Group.position.set(-46.4182, 8.5382, -17.9615);
  const cube_104Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_104Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_104 = new THREE.Mesh(cube_104Geometry, WhiteDotsMaterial);
    cube_104.scale.set(1.5186, 0.0513, 1.3442);
    cube_104.position.set(3.341 * i, 0, 0);
    cube_104Group.add(cube_104);
  }
  cube_104Group.setRotation(-0.6479, -0.0, 0.0);
  cube_104Group.position.set(-48.0887, 7.3242, -20.3389);
  const cube_105Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_105Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_105 = new THREE.Mesh(cube_105Geometry, WhiteDotsMaterial);
    cube_105.scale.set(1.5186, 0.0513, 1.3442);
    cube_105.position.set(3.341 * i, 0, 0);
    cube_105Group.add(cube_105);
  }
  cube_105Group.setRotation(-1.023, -0.0, 0.0);
  cube_105Group.position.set(-48.0887, 5.4288, -22.068);
  const cube_106Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_106Group = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const cube_106 = new THREE.Mesh(cube_106Geometry, MetalMaterial);
    cube_106.scale.set(0.1738, 0.0511, 1.3427);
    cube_106.position.set(3.341 * i, 0, 0);
    cube_106Group.add(cube_106);
  }
  cube_106Group.setRotation(-1.023, -0.0, 0.0);
  cube_106Group.position.set(-46.4182, 5.3882, -22.0402);
  const cube_297Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_297 = new THREE.Mesh(cube_297Geometry, ColoumnPlateMaterial);
  cube_297.position.set(70.754, 7.9374, -0.0);
  cube_297.scale.set(15.8864, 2.1309, 7.0248);

  const cube_298Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_298 = new THREE.Mesh(cube_298Geometry, ColoumnPlateMaterial);
  cube_298.position.set(70.754, 6.6102, -0.0);
  cube_298.scale.set(15.8864, 0.3534, 10.2896);

  const cube_299Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_299 = new THREE.Mesh(cube_299Geometry, ColoumnPlateMaterial);
  cube_299.position.set(80.1152, 3.775, -0.0);
  cube_299.scale.set(3.5137, 0.3534, 10.2896);
  cube_299.setRotation(0.0, 0.0, -1.5708);

  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderGroup = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinder = new THREE.Mesh(cylinderGeometry, ColoumnMaterial);
    cylinder.scale.set(0.5, 2.5, 0.5);
    cylinder.position.set(6.0 * i, 0, 0);
    cylinderGroup.add(cylinder);
  }
  cylinderGroup.position.set(-30.709, 3.2961, -7.1816);
  const cylinder_001Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_001Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
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
  for (let i = 0; i < 12; i++) {
    const cube_003 = new THREE.Mesh(cube_003Geometry, ColoumnPlateMaterial);
    cube_003.scale.set(0.7, 0.0759, 0.7);
    cube_003.position.set(6.0 * i, 0, 0);
    cube_003Group.add(cube_003);
  }
  cube_003Group.position.set(-30.709, 5.8089, -7.1816);
  const cylinder_003Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_003Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
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
  for (let i = 0; i < 12; i++) {
    const cylinder_004 = new THREE.Mesh(cylinder_004Geometry, BrassMaterial);
    cylinder_004.scale.set(0.6, 0.1363, 0.6);
    cylinder_004.position.set(6.0 * i, 0, 0);
    cylinder_004Group.add(cylinder_004);
  }
  cylinder_004Group.position.set(-30.709, 5.4668, -7.1816);
  const torus_001Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_001Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const torus_001 = new THREE.Mesh(torus_001Geometry, BrassMaterial);
    torus_001.scale.set(0.5, 0.5, 0.5233);
    torus_001.position.set(6.0 * i, 0, 0);
    torus_001Group.add(torus_001);
  }
  torus_001Group.setRotation(1.5708, 0.0, 0.0);
  torus_001Group.position.set(-30.709, 1.0461, -7.1816);
  const torus_002Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_002Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const torus_002 = new THREE.Mesh(torus_002Geometry, BrassMaterial);
    torus_002.scale.set(0.52, 0.52, 0.5233);
    torus_002.position.set(6.0 * i, 0, 0);
    torus_002Group.add(torus_002);
  }
  torus_002Group.setRotation(1.5708, 0.0, 0.0);
  torus_002Group.position.set(-30.709, 5.7037, -7.1816);
  const torus_003Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_003Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
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
  cube_floor_columns.setRotation(0.0, 0.0, -0.0);
  const cube_floor_columnsMZ = cube_floor_columns.clone();
  cube_floor_columnsMZ.updateMatrixWorld(true);
  cube_floor_columns.position.set(0, 0, -8.8396);
  cube_floor_columnsMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_floor_columnsMZ.position.set(0, 0, 8.8396);
  const cube_floor_columnsMirroredZ = new THREE.Group();
  cube_floor_columnsMirroredZ.add(cube_floor_columns, cube_floor_columnsMZ);
  cube_floor_columnsMirroredZ.position.set(15.9462, 0.5578, 0);
  const cube_floor_sidedGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_sided = new THREE.Mesh(
    cube_floor_sidedGeometry,
    Floor_Sides_1Material,
  );
  cube_floor_sided.scale.set(50.6075, 0.2965, 0.2803);
  cube_floor_sided.setRotation(0.0, 0.0, -0.0);
  const cube_floor_sidedMZ = cube_floor_sided.clone();
  cube_floor_sidedMZ.updateMatrixWorld(true);
  cube_floor_sided.position.set(0, 0, -11.612);
  cube_floor_sidedMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_floor_sidedMZ.position.set(0, 0, 11.612);
  const cube_floor_sidedMirroredZ = new THREE.Group();
  cube_floor_sidedMirroredZ.add(cube_floor_sided, cube_floor_sidedMZ);
  cube_floor_sidedMirroredZ.position.set(0.3561, 0.5394, 0);
  const cube_floor_trainssideGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_floor_trainsside = new THREE.Mesh(
    cube_floor_trainssideGeometry,
    Floor_CentralMaterial,
  );
  cube_floor_trainsside.scale.set(51.4855, 0.2965, 1.7465);
  cube_floor_trainsside.setRotation(0.0, 0.0, -0.0);
  const cube_floor_trainssideMZ = cube_floor_trainsside.clone();
  cube_floor_trainssideMZ.updateMatrixWorld(true);
  cube_floor_trainsside.position.set(0, 0, -13.6124);
  cube_floor_trainssideMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_floor_trainssideMZ.position.set(0, 0, 13.6124);
  const cube_floor_trainssideMirroredZ = new THREE.Group();
  cube_floor_trainssideMirroredZ.add(
    cube_floor_trainsside,
    cube_floor_trainssideMZ,
  );
  cube_floor_trainssideMirroredZ.position.set(-0.5219, 0.5684, 0);
  const cube_stripes_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_001Group = new THREE.Group();
  for (let i = 0; i < 83; i++) {
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
  for (let i = 0; i < 82; i++) {
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
  const cube_stripes_002 = new THREE.Mesh(
    cube_stripes_002Geometry,
    Floor_StripesMaterial,
  );
  cube_stripes_002.scale.set(-59.1002, 0.0239, 0.1614);
  cube_stripes_002.setRotation(0.0, 0.0, -0.0);
  const cube_stripes_002MZ = cube_stripes_002.clone();
  cube_stripes_002MZ.updateMatrixWorld(true);
  cube_stripes_002.position.set(0, 0, 4.7543);
  cube_stripes_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_stripes_002MZ.position.set(0, 0, -4.7543);
  const cube_stripes_002MirroredZ = new THREE.Group();
  cube_stripes_002MirroredZ.add(cube_stripes_002, cube_stripes_002MZ);
  cube_stripes_002MirroredZ.position.set(23.6445, 0.8634, 0);
  const cylinder_002Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_002Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinder_002 = new THREE.Mesh(cylinder_002Geometry, ColoumnMaterial);
    cylinder_002.scale.set(0.5, 2.5, 0.5);
    cylinder_002.position.set(6.0 * i, 0, 0);
    cylinder_002Group.add(cylinder_002);
  }
  cylinder_002Group.position.set(-30.709, 3.2961, 7.171);
  const cube_stripes_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_003Group = new THREE.Group();
  for (let i = 0; i < 83; i++) {
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
  for (let i = 0; i < 82; i++) {
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
  for (let i = 0; i < 12; i++) {
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
  for (let i = 0; i < 12; i++) {
    const torus_004 = new THREE.Mesh(torus_004Geometry, BrassMaterial);
    torus_004.scale.set(0.5, 0.5, 0.5233);
    torus_004.position.set(6.0 * i, 0, 0);
    torus_004Group.add(torus_004);
  }
  torus_004Group.setRotation(1.5708, 0.0, 0.0);
  torus_004Group.position.set(-30.709, 1.0461, 7.1657);
  const cylinder_006Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_006Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
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
  for (let i = 0; i < 12; i++) {
    const torus_005 = new THREE.Mesh(torus_005Geometry, BrassMaterial);
    torus_005.scale.set(0.52, 0.52, 0.2641);
    torus_005.position.set(6.0 * i, 0, 0);
    torus_005Group.add(torus_005);
  }
  torus_005Group.setRotation(1.5708, 0.0, 0.0);
  torus_005Group.position.set(-30.709, 5.307, 7.1655);
  const cylinder_007Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinder_007Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinder_007 = new THREE.Mesh(cylinder_007Geometry, BrassMaterial);
    cylinder_007.scale.set(0.6, 0.1363, 0.6);
    cylinder_007.position.set(6.0 * i, 0, 0);
    cylinder_007Group.add(cylinder_007);
  }
  cylinder_007Group.position.set(-30.709, 5.4668, 7.1711);
  const cube_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_001Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube_001 = new THREE.Mesh(cube_001Geometry, ColoumnPlateMaterial);
    cube_001.scale.set(0.7, 0.0759, 0.7);
    cube_001.position.set(6.0 * i, 0, 0);
    cube_001Group.add(cube_001);
  }
  cube_001Group.position.set(-30.709, 5.8089, 7.1711);
  const torus_006Geometry = new THREE.TorusGeometry(1, 0.25, 12, 48);
  const torus_006Group = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const torus_006 = new THREE.Mesh(torus_006Geometry, BrassMaterial);
    torus_006.scale.set(0.52, 0.52, 0.5233);
    torus_006.position.set(6.0 * i, 0, 0);
    torus_006Group.add(torus_006);
  }
  torus_006Group.setRotation(1.5708, 0.0, 0.0);
  torus_006Group.position.set(-30.709, 5.7037, 7.1711);
  const cube_stripes_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_006 = new THREE.Mesh(
    cube_stripes_006Geometry,
    Floor_StripesMaterial,
  );
  cube_stripes_006.position.set(76.6066, 0.8634, 0.0932);
  cube_stripes_006.scale.set(-5.1172, 0.0239, 0.1614);
  cube_stripes_006.setRotation(0.0, 1.5708, 0.0);

  const cube_stripes_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_stripes_004 = new THREE.Mesh(
    cube_stripes_004Geometry,
    Floor_StripesMaterial,
  );
  cube_stripes_004.position.set(-31.1419, 0.8634, 0.0932);
  cube_stripes_004.scale.set(-5.1172, 0.0239, 0.1614);
  cube_stripes_004.setRotation(0.0, 1.5708, 0.0);

  const cube_backwallGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_backwall = new THREE.Mesh(
    cube_backwallGeometry,
    FloorTileMaterial,
  );
  cube_backwall.position.set(-40.9615, 5.4803, -0.0);
  cube_backwall.scale.set(9.4309, 4.626, 8.2679);

  const cube_coloumnsupper_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_coloumnsupper_001 = new THREE.Mesh(
    cube_coloumnsupper_001Geometry,
    Floor_ColumnsMaterial,
  );
  cube_coloumnsupper_001.scale.set(42.5516, 0.1921, 0.7246);
  cube_coloumnsupper_001.setRotation(0.0, 0.0, -0.0);
  const cube_coloumnsupper_001MZ = cube_coloumnsupper_001.clone();
  cube_coloumnsupper_001MZ.updateMatrixWorld(true);
  cube_coloumnsupper_001.position.set(0, 0, -6.1536);
  cube_coloumnsupper_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_coloumnsupper_001MZ.position.set(0, 0, 6.1536);
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
  cube_coloumnsupper_002.setRotation(-0.7258, 0.0, 0.0);
  const cube_coloumnsupper_002MZ = cube_coloumnsupper_002.clone();
  cube_coloumnsupper_002MZ.updateMatrixWorld(true);
  cube_coloumnsupper_002.position.set(0, 0, -6.124);
  cube_coloumnsupper_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_coloumnsupper_002MZ.position.set(0, 0, 6.124);
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
  cube_coloumnsupper_003.setRotation(0.0, 0.0, -0.0);
  const cube_coloumnsupper_003MZ = cube_coloumnsupper_003.clone();
  cube_coloumnsupper_003MZ.updateMatrixWorld(true);
  cube_coloumnsupper_003.position.set(0, 0, -7.1651);
  cube_coloumnsupper_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cube_coloumnsupper_003MZ.position.set(0, 0, 7.1651);
  const cube_coloumnsupper_003MirroredZ = new THREE.Group();
  cube_coloumnsupper_003MirroredZ.add(
    cube_coloumnsupper_003,
    cube_coloumnsupper_003MZ,
  );
  cube_coloumnsupper_003MirroredZ.position.set(10.4587, 6.0642, 0);
  const cube_backwall_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_backwall_001 = new THREE.Mesh(
    cube_backwall_001Geometry,
    FloorTileMaterial,
  );
  cube_backwall_001.position.set(-53.4691, 1.9826, -0.0);
  cube_backwall_001.scale.set(3.0767, 9.221, 14.9665);

  const cube_backwall_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_backwall_002 = new THREE.Mesh(
    cube_backwall_002Geometry,
    FloorTileMaterial,
  );
  cube_backwall_002.position.set(-182.3204, 1.9826, -0.0);
  cube_backwall_002.scale.set(125.7746, 9.221, 14.9665);

  const cube_302Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_302 = new THREE.Mesh(cube_302Geometry, ColoumnMaterial);
  cube_302.position.set(344.4503, 3.6897, 19.9295);
  cube_302.scale.set(2.946, 12.7853, 12.7853);

  const cube_303Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_303 = new THREE.Mesh(cube_303Geometry, ColoumnMaterial);
  cube_303.position.set(344.4503, 3.6897, -18.5225);
  cube_303.scale.set(2.946, 12.7853, 12.7853);

  const cube_304Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_304 = new THREE.Mesh(cube_304Geometry, ColoumnMaterial);
  cube_304.position.set(-308.372, 3.6897, 19.9295);
  cube_304.scale.set(2.946, 12.7853, 12.7853);

  const cube_305Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_305 = new THREE.Mesh(cube_305Geometry, ColoumnMaterial);
  cube_305.position.set(-308.372, 3.6897, -18.5225);
  cube_305.scale.set(2.946, 12.7853, 12.7853);

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
    cube_300MirroredZ,
    cube_301MirroredZ,
    cube_306MirroredZ,
    cube_bigroofMirroredZ,
    cube_bigroof_004MirroredZ,
    cube_escfloor_011,
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
    cube_297,
    cube_298,
    cube_299,
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
    cube_floor_sidedMirroredZ,
    cube_floor_trainssideMirroredZ,
    cube_stripes_001Group,
    cylinder_stripe_dotsGroup,
    cube_stripes_002MirroredZ,
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
    cube_stripes_006,
    cube_stripes_004,
    cube_backwall,
    cube_coloumnsupper_001MirroredZ,
    cube_coloumnsupper_002MirroredZ,
    cube_coloumnsupper_003MirroredZ,
    cube_backwall_001,
    cube_backwall_002,
    cube_302,
    cube_303,
    cube_304,
    cube_305,
  );
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
  THREE.Object3D.prototype.GetObjectsByProperty = function (
    name,
    value,
    result = [],
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any)[name] === value) {
      result.push(this);
    }

    const children = this.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].GetObjectsByProperty(name, value, result);
    }

    return result;
  };

  if (typeof sceneexist == 'undefined') {
    sceneexist = true;
    // объявление сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444488);
    cameras.main = new THREE.PerspectiveCamera(70, WC / HC, 0.1, 1000);
    currentCamera = cameras.main;
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // привяжем отрисовку к html и высоте канвы
    // renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('wCanvas')?.appendChild(renderer.domElement);
    renderer.setSize(WC, HC);

    // Настройка управления
    controls = new THREE.OrbitControls(cameras.main, renderer.domElement);
    cameras.main.position.set(0, 20, 0);
    controls.update();
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    // Инициализация камер
    // Заготовки позиций и направлений
    const cams = [
      [new THREE.Vector3(-30, 6.74, -0.205), new THREE.Vector3(1, 0, 0)], // Конец платформы
      [new THREE.Vector3(49.8, 7.434, -0.795), new THREE.Vector3(-1, 0, 0)], // Начало платформы
      [new THREE.Vector3(-34.6, 6.15, -10.056), new THREE.Vector3(1, 0, 0)], // Комендантский
      [new THREE.Vector3(38.6, 5.21, 10.95), new THREE.Vector3(-1, 0, 0)], // Шушары
    ];
    // Сохраняем камеры в переменную
    cameras.poi = cams.map((cam) => {
      const [coord, dir] = cam;

      const newCam = new THREE.PerspectiveCamera(70, WC / HC, 0.1, 1000);
      const { x, y, z } = coord;
      newCam.position.set(x, y, z);
      newCam.lookAt(newCam.position.clone().add(dir));
      return newCam;
    });

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

// Следующие две функции нужны для переключения камеры с помощью <select>
// Функция находит select#ChangeCamera на странице, настраивает onclick действие
function initChangeCameraControls() {
  const control = document.querySelector<HTMLSelectElement>(
    'select#ChangeCamera',
  );

  if (!control) {
    console.error('Список камер не найден на странице!');
    return;
  }

  control.addEventListener('input', ChangeCamera);
}

// Срабатывает при выборе камеры из списка
// Меняет currentCamera.
// currentCamera используется в render(): renderer.render(scene, currentCamera)
function ChangeCamera(e: Event) {
  const select = e.target as HTMLSelectElement;

  const value = select.value;
  if (!value.includes('poi'))
    currentCamera = cameras[value as 'main' | 'robot' | 'robotCleaner'];
  else {
    const index = parseInt(value.split('_')[1]);
    currentCamera = cameras.poi?.[index];
  }
}

// balon block end
//#endregion
