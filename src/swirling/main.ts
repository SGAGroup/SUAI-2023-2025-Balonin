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
// Draw Functions Start
function DrawWetFloor() {
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const baseSize = 256;

  const floor = new THREE.Mesh(boxGeo);
  floor.position.set(24.4, 0.57, 0);
  floor.scale.set(56.1, 0.3, 6.35);

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
    color: new THREE.Color(0.48, 0.39, 0.26),
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
  rightDoor.scale.set(1, 1, 1);
  rightDoor.setRotation(0, 0, 0);
  const leftDoor = rightDoor.clone();
  leftDoor.updateMatrixWorld(true);
  rightDoor.position.set(0, 0, 0);
  leftDoor.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  leftDoor.position.set(0, 0, 0);
  const resultDoor = new THREE.Group();
  resultDoor.add(rightDoor, leftDoor);
  resultDoor.position.set(0, 0, 0);
  const out = new THREE.Group();
  rightDoor.name = 'rightDoor';
  leftDoor.name = 'leftDoor';
  out.add(resultDoor);
  return out;
}
function DrawRobotM() {
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.48, 0.48),
    metalness: 1,
    roughness: 0.5,
  });
  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0, 0, 0),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.02, 0),
    metalness: 0.83,
    roughness: 0.88,
  });
  const Washer_mainMaterialDS = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.02, 0.13, 0.15),
    side: THREE.DoubleSide,
    roughness: 0.5,
  });
  const Washer_mainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.02, 0.13, 0.15),
    roughness: 0.5,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.52, 0),
  });
  const BrassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.79, 0.8, 0),
    metalness: 0.91,
    roughness: 0.1,
  });
  const Floor_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.35, 0.16, 0.1),
    metalness: 1,
    roughness: 0.54,
  });
  const kub108Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.15, 0.88, 0.43),
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.15, 0.25, 0.8),
    roughness: 0.5,
  });
  const Green_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.04, 0.49, 0.01),
    roughness: 0.5,
  });
  const Train_blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.03, 0.1, 0.65),
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
  const planeGeo = new THREE.PlaneGeometry(2, 2);

  const kub38 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub38.position.set(0.94, 0.07, -0);
  kub38.scale.set(0.11, 0.08, 0.52);

  const kub39 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub39.position.set(0.73, 0.13, -0);
  kub39.scale.set(0.27, 0.09, 0.23);
  kub39.setRotation(0.31, 1.57, 0);

  const cyl8 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl8.position.set(0.64, 0.16, -0);
  cyl8.scale.set(0.07, 0.53, 0.07);
  cyl8.setRotation(1.57, 0, 0);

  const cyl9 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl9.scale.set(0.1, 0.06, 0.1);
  cyl9.setRotation(1.57, 0, 0);
  const cyl9MZ = cyl9.clone();
  cyl9MZ.updateMatrixWorld(true);
  cyl9.position.set(0, 0, 0.5);
  cyl9MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl9MZ.position.set(0, 0, -0.5);
  const cyl9MrZ = new THREE.Group();
  cyl9MrZ.add(cyl9, cyl9MZ);
  cyl9MrZ.position.set(0.64, 0.16, 0);
  const pln1 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln1.scale.set(0.08, 0.09, 0.07);
  pln1.setRotation(1.57, 0, -1.31);
  const pln1MZ = pln1.clone();
  pln1MZ.updateMatrixWorld(true);
  pln1.position.set(0, 0, 0.09);
  pln1MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln1MZ.position.set(0, 0, -0.09);
  const pln1MrZ = new THREE.Group();
  pln1MrZ.add(pln1, pln1MZ);
  pln1MrZ.position.set(0.56, 0.82, 0);
  const pln2 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln2.scale.set(0.06, 0.09, 0.07);
  pln2.setRotation(1.57, 0, -1.39);
  const pln2MZ = pln2.clone();
  pln2MZ.updateMatrixWorld(true);
  pln2.position.set(0, 0, 0.09);
  pln2MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln2MZ.position.set(0, 0, -0.09);
  const pln2MrZ = new THREE.Group();
  pln2MrZ.add(pln2, pln2MZ);
  pln2MrZ.position.set(0.59, 0.69, 0);
  const pln3 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln3.scale.set(0.05, 0.09, 0.07);
  pln3.setRotation(1.57, 0, -1.44);
  const pln3MZ = pln3.clone();
  pln3MZ.updateMatrixWorld(true);
  pln3.position.set(0, 0, 0.09);
  pln3MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln3MZ.position.set(0, 0, -0.09);
  const pln3MrZ = new THREE.Group();
  pln3MrZ.add(pln3, pln3MZ);
  pln3MrZ.position.set(0.61, 0.59, 0);
  const pln4 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln4.scale.set(0.04, 0.09, 0.07);
  pln4.setRotation(1.57, 0, -1.51);
  const pln4MZ = pln4.clone();
  pln4MZ.updateMatrixWorld(true);
  pln4.position.set(0, 0, 0.09);
  pln4MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln4MZ.position.set(0, 0, -0.09);
  const pln4MrZ = new THREE.Group();
  pln4MrZ.add(pln4, pln4MZ);
  pln4MrZ.position.set(0.62, 0.51, 0);
  const pln5 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln5.scale.set(0.05, 0.09, 0.07);
  pln5.setRotation(1.57, 0, -1.57);
  const pln5MZ = pln5.clone();
  pln5MZ.updateMatrixWorld(true);
  pln5.position.set(0, 0, 0.09);
  pln5MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln5MZ.position.set(0, 0, -0.09);
  const pln5MrZ = new THREE.Group();
  pln5MrZ.add(pln5, pln5MZ);
  pln5MrZ.position.set(0.62, 0.42, 0);
  const pln14 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln14.scale.set(0.08, 0.09, 0.07);
  pln14.setRotation(1.84, 0, -1.31);
  const pln14MZ = pln14.clone();
  pln14MZ.updateMatrixWorld(true);
  pln14.position.set(0, 0, 0.26);
  pln14MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln14MZ.position.set(0, 0, -0.27);
  const pln14MrZ = new THREE.Group();
  pln14MrZ.add(pln14, pln14MZ);
  pln14MrZ.position.set(0.54, 0.82, 0);
  const pln15 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln15.scale.set(0.06, 0.09, 0.07);
  pln15.setRotation(1.84, 0, -1.39);
  const pln15MZ = pln15.clone();
  pln15MZ.updateMatrixWorld(true);
  pln15.position.set(0, 0, 0.26);
  pln15MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln15MZ.position.set(0, 0, -0.27);
  const pln15MrZ = new THREE.Group();
  pln15MrZ.add(pln15, pln15MZ);
  pln15MrZ.position.set(0.57, 0.69, 0);
  const pln16 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln16.scale.set(0.05, 0.09, 0.07);
  pln16.setRotation(1.84, 0, -1.44);
  const pln16MZ = pln16.clone();
  pln16MZ.updateMatrixWorld(true);
  pln16.position.set(0, 0, 0.26);
  pln16MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln16MZ.position.set(0, 0, -0.27);
  const pln16MrZ = new THREE.Group();
  pln16MrZ.add(pln16, pln16MZ);
  pln16MrZ.position.set(0.59, 0.59, 0);
  const pln17 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln17.scale.set(0.04, 0.09, 0.07);
  pln17.setRotation(1.84, 0, -1.51);
  const pln17MZ = pln17.clone();
  pln17MZ.updateMatrixWorld(true);
  pln17.position.set(0, 0, 0.26);
  pln17MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln17MZ.position.set(0, 0, -0.27);
  const pln17MrZ = new THREE.Group();
  pln17MrZ.add(pln17, pln17MZ);
  pln17MrZ.position.set(0.59, 0.5, 0);
  const pln18 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln18.scale.set(0.05, 0.09, 0.07);
  pln18.setRotation(1.84, -0, -1.57);
  const pln18MZ = pln18.clone();
  pln18MZ.updateMatrixWorld(true);
  pln18.position.set(0, 0, 0.26);
  pln18MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln18MZ.position.set(0, 0, -0.27);
  const pln18MrZ = new THREE.Group();
  pln18MrZ.add(pln18, pln18MZ);
  pln18MrZ.position.set(0.6, 0.42, 0);
  const pln6 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln6.scale.set(0.08, 0.09, 0.07);
  pln6.setRotation(2.46, 0, -1.31);
  const pln6MZ = pln6.clone();
  pln6MZ.updateMatrixWorld(true);
  pln6.position.set(0, 0, 0.41);
  pln6MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln6MZ.position.set(0, 0, -0.41);
  const pln6MrZ = new THREE.Group();
  pln6MrZ.add(pln6, pln6MZ);
  pln6MrZ.position.set(0.45, 0.79, 0);
  const pln7 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln7.scale.set(0.06, 0.09, 0.07);
  pln7.setRotation(2.47, 0, -1.39);
  const pln7MZ = pln7.clone();
  pln7MZ.updateMatrixWorld(true);
  pln7.position.set(0, 0, 0.41);
  pln7MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln7MZ.position.set(0, 0, -0.41);
  const pln7MrZ = new THREE.Group();
  pln7MrZ.add(pln7, pln7MZ);
  pln7MrZ.position.set(0.48, 0.67, 0);
  const pln8 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln8.scale.set(0.05, 0.09, 0.07);
  pln8.setRotation(2.47, 0, -1.44);
  const pln8MZ = pln8.clone();
  pln8MZ.updateMatrixWorld(true);
  pln8.position.set(0, 0, 0.41);
  pln8MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln8MZ.position.set(0, 0, -0.41);
  const pln8MrZ = new THREE.Group();
  pln8MrZ.add(pln8, pln8MZ);
  pln8MrZ.position.set(0.49, 0.57, 0);
  const pln9 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln9.scale.set(0.04, 0.09, 0.07);
  pln9.setRotation(3.13, 0.65, -1.53);
  const pln9MZ = pln9.clone();
  pln9MZ.updateMatrixWorld(true);
  pln9.position.set(0, 0, 0.4);
  pln9MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln9MZ.position.set(0, 0, -0.4);
  const pln9MrZ = new THREE.Group();
  pln9MrZ.add(pln9, pln9MZ);
  pln9MrZ.position.set(0.5, 0.49, 0);
  const pln11 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln11.scale.set(0.05, 0.09, 0.07);
  pln11.setRotation(2.48, -0, -1.57);
  const pln11MZ = pln11.clone();
  pln11MZ.updateMatrixWorld(true);
  pln11.position.set(0, 0, 0.4);
  pln11MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln11MZ.position.set(0, 0, -0.41);
  const pln11MrZ = new THREE.Group();
  pln11MrZ.add(pln11, pln11MZ);
  pln11MrZ.position.set(0.5, 0.41, 0);
  const kub42 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub42.position.set(0.59, 0.69, -0);
  kub42.scale.set(0.06, 0.01, 0.01);
  kub42.setRotation(0, 0, -1.39);

  const kub43 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub43.position.set(0.61, 0.59, -0);
  kub43.scale.set(0.05, 0.01, 0.01);
  kub43.setRotation(0, 0, -1.44);

  const kub44 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub44.position.set(0.62, 0.51, -0);
  kub44.scale.set(0.04, 0.01, 0.01);
  kub44.setRotation(0, 0, -1.51);

  const kub45 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub45.position.set(0.62, 0.43, -0);
  kub45.scale.set(0.04, 0.01, 0.01);
  kub45.setRotation(0, 0, -1.57);

  const kub46 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub46.position.set(0.56, 0.82, -0);
  kub46.scale.set(0.08, 0.01, 0.01);
  kub46.setRotation(0, 0, -1.31);

  const kub47 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub47.position.set(0.5, 0.97, -0);
  kub47.scale.set(0.09, 0.01, 0.01);
  kub47.setRotation(0, 0, -1.09);

  const kub48 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub48.position.set(0.59, 0.35, -0);
  kub48.scale.set(0.08, 0.04, 0.24);

  const kub49 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub49.scale.set(0.04, 0.07, 0.05);
  kub49.setRotation(-1.57, -1.34, -1.57);
  const kub49MZ = kub49.clone();
  kub49MZ.updateMatrixWorld(true);
  kub49.position.set(0, 0, -0.27);
  kub49MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub49MZ.position.set(0, 0, 0.27);
  const kub49MrZ = new THREE.Group();
  kub49MrZ.add(kub49, kub49MZ);
  kub49MrZ.position.set(0.59, 0.35, 0);
  const kub50 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub50.scale.set(0.04, 0.07, 0.06);
  kub50.setRotation(-1.06, 0, -1.57);
  const kub50MZ = kub50.clone();
  kub50MZ.updateMatrixWorld(true);
  kub50.position.set(0, 0, -0.4);
  kub50MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub50MZ.position.set(0, 0, 0.4);
  const kub50MrZ = new THREE.Group();
  kub50MrZ.add(kub50, kub50MZ);
  kub50MrZ.position.set(0.49, 0.35, 0);
  const kub51 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub51.scale.set(0.04, 0.07, 0.06);
  kub51.setRotation(-0.67, 0, -1.57);
  const kub51MZ = kub51.clone();
  kub51MZ.updateMatrixWorld(true);
  kub51.position.set(0, 0, -0.34);
  kub51MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub51MZ.position.set(0, 0, 0.34);
  const kub51MrZ = new THREE.Group();
  kub51MrZ.add(kub51, kub51MZ);
  kub51MrZ.position.set(0.55, 0.35, 0);
  const kub52 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub52.scale.set(0.04, 0.07, 0.06);
  kub52.setRotation(-1.41, 0, -1.57);
  const kub52MZ = kub52.clone();
  kub52MZ.updateMatrixWorld(true);
  kub52.position.set(0, 0, -0.43);
  kub52MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub52MZ.position.set(0, 0, 0.43);
  const kub52MrZ = new THREE.Group();
  kub52MrZ.add(kub52, kub52MZ);
  kub52MrZ.position.set(0.39, 0.35, 0);
  const kub53 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub53.scale.set(0.04, 0.07, 0.3);
  kub53.setRotation(-1.74, 0, -1.57);
  const kub53MZ = kub53.clone();
  kub53MZ.updateMatrixWorld(true);
  kub53.position.set(0, 0, -0.39);
  kub53MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub53MZ.position.set(0, 0, 0.39);
  const kub53MrZ = new THREE.Group();
  kub53MrZ.add(kub53, kub53MZ);
  kub53MrZ.position.set(0.06, 0.35, 0);
  const kub72 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub72.position.set(0.25, 0.23, -0);
  kub72.scale.set(0.27, 0.1, 0.35);

  const kub73 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub73.position.set(-0.09, 0.47, -0);
  kub73.scale.set(0.58, 0.1, 0.38);

  const kub74 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub74.scale.set(0.58, 0.11, 0.04);
  kub74.setRotation(0, 0.06, 0);
  const kub74MZ = kub74.clone();
  kub74MZ.updateMatrixWorld(true);
  kub74.position.set(0, 0, -0.39);
  kub74MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub74MZ.position.set(0, 0, 0.39);
  const kub74MrZ = new THREE.Group();
  kub74MrZ.add(kub74, kub74MZ);
  kub74MrZ.position.set(-0.14, 0.41, 0);
  const kub75 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub75.scale.set(0.58, 0.04, 0.04);
  kub75.setRotation(0, 0.06, 0);
  const kub75MZ = kub75.clone();
  kub75MZ.updateMatrixWorld(true);
  kub75.position.set(0, 0, -0.39);
  kub75MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub75MZ.position.set(0, 0, 0.39);
  const kub75MrZ = new THREE.Group();
  kub75MrZ.add(kub75, kub75MZ);
  kub75MrZ.position.set(-0.14, 0.56, 0);
  const kub76 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub76.scale.set(0.06, 0.01, 0.01);
  kub76.setRotation(-0.9, 0, -1.39);
  const kub76MZ = kub76.clone();
  kub76MZ.updateMatrixWorld(true);
  kub76.position.set(0, 0, -0.46);
  kub76MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub76MZ.position.set(0, 0, 0.46);
  const kub76MrZ = new THREE.Group();
  kub76MrZ.add(kub76, kub76MZ);
  kub76MrZ.position.set(0.41, 0.66, 0);
  const kub77 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub77.scale.set(0.04, 0.01, 0.01);
  kub77.setRotation(-0.9, 0, -1.44);
  const kub77MZ = kub77.clone();
  kub77MZ.updateMatrixWorld(true);
  kub77.position.set(0, 0, -0.46);
  kub77MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub77MZ.position.set(0, 0, 0.46);
  const kub77MrZ = new THREE.Group();
  kub77MrZ.add(kub77, kub77MZ);
  kub77MrZ.position.set(0.43, 0.56, 0);
  const kub78 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub78.scale.set(0.07, 0.01, 0.01);
  kub78.setRotation(-1.55, -0.64, -1.54);
  const kub78MZ = kub78.clone();
  kub78MZ.updateMatrixWorld(true);
  kub78.position.set(0, 0, -0.45);
  kub78MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub78MZ.position.set(0, 0, 0.45);
  const kub78MrZ = new THREE.Group();
  kub78MrZ.add(kub78, kub78MZ);
  kub78MrZ.position.set(0.44, 0.46, 0);
  const kub80 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub80.scale.set(0.08, 0.01, 0.01);
  kub80.setRotation(-0.89, 0, -1.31);
  const kub80MZ = kub80.clone();
  kub80MZ.updateMatrixWorld(true);
  kub80.position.set(0, 0, -0.46);
  kub80MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub80MZ.position.set(0, 0, 0.46);
  const kub80MrZ = new THREE.Group();
  kub80MrZ.add(kub80, kub80MZ);
  kub80MrZ.position.set(0.38, 0.79, 0);
  const kub79 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub79.scale.set(0.57, 0.04, 0.04);
  kub79.setRotation(0, 0.06, 0);
  const kub79MZ = kub79.clone();
  kub79MZ.updateMatrixWorld(true);
  kub79.position.set(0, 0, -0.39);
  kub79MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub79MZ.position.set(0, 0, 0.38);
  const kub79MrZ = new THREE.Group();
  kub79MrZ.add(kub79, kub79MZ);
  kub79MrZ.position.set(-0.15, 0.63, 0);
  const kub81 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub81.scale.set(0.04, 0.07, 0.05);
  kub81.setRotation(0, 0.23, -1.12);
  const kub81MZ = kub81.clone();
  kub81MZ.updateMatrixWorld(true);
  kub81.position.set(0, 0, -0.27);
  kub81MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub81MZ.position.set(0, 0, 0.27);
  const kub81MrZ = new THREE.Group();
  kub81MrZ.add(kub81, kub81MZ);
  kub81MrZ.position.set(0.56, 0.39, 0);
  const kub82 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub82.scale.set(0.04, 0.06, 0.04);
  kub82.setRotation(0, 0.23, -1.12);
  const kub82MZ = kub82.clone();
  kub82MZ.updateMatrixWorld(true);
  kub82.position.set(0, 0, -0.27);
  kub82MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub82MZ.position.set(0, 0, 0.27);
  const kub82MrZ = new THREE.Group();
  kub82MrZ.add(kub82, kub82MZ);
  kub82MrZ.position.set(0.57, 0.4, 0);
  const kub83 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub83.scale.set(0.57, 0.04, 0.04);
  kub83.setRotation(0, 0.06, 0);
  const kub83MZ = kub83.clone();
  kub83MZ.updateMatrixWorld(true);
  kub83.position.set(0, 0, -0.39);
  kub83MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub83MZ.position.set(0, 0, 0.38);
  const kub83MrZ = new THREE.Group();
  kub83MrZ.add(kub83, kub83MZ);
  kub83MrZ.position.set(-0.16, 0.71, 0);
  const kub84 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub84.scale.set(0.55, 0.04, 0.04);
  kub84.setRotation(0, 0.06, 0);
  const kub84MZ = kub84.clone();
  kub84MZ.updateMatrixWorld(true);
  kub84.position.set(0, 0, -0.38);
  kub84MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub84MZ.position.set(0, 0, 0.38);
  const kub84MrZ = new THREE.Group();
  kub84MrZ.add(kub84, kub84MZ);
  kub84MrZ.position.set(-0.17, 0.79, 0);
  const cyl10 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl10.scale.set(0.15, 0.06, 0.15);
  cyl10.setRotation(1.57, 0, 0);
  const cyl10MZ = cyl10.clone();
  cyl10MZ.updateMatrixWorld(true);
  cyl10.position.set(0, 0, 0.41);
  cyl10MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl10MZ.position.set(0, 0, -0.42);
  const cyl10MrZ = new THREE.Group();
  cyl10MrZ.add(cyl10, cyl10MZ);
  cyl10MrZ.position.set(0.25, 0.14, 0);
  const cyl11 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl11.scale.set(0.13, 0.01, 0.13);
  cyl11.setRotation(1.57, 0, 0);
  const cyl11MZ = cyl11.clone();
  cyl11MZ.updateMatrixWorld(true);
  cyl11.position.set(0, 0, 0.47);
  cyl11MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl11MZ.position.set(0, 0, -0.48);
  const cyl11MrZ = new THREE.Group();
  cyl11MrZ.add(cyl11, cyl11MZ);
  cyl11MrZ.position.set(0.25, 0.14, 0);
  const cyl13 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl13.scale.set(0.09, 0.05, 0.09);
  cyl13.setRotation(1.57, 0, 0);
  const cyl13MZ = cyl13.clone();
  cyl13MZ.updateMatrixWorld(true);
  cyl13.position.set(0, 0, 0.27);
  cyl13MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl13MZ.position.set(0, 0, -0.28);
  const cyl13MrZ = new THREE.Group();
  cyl13MrZ.add(cyl13, cyl13MZ);
  cyl13MrZ.position.set(0.64, 0.16, 0);
  const kub86 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub86.scale.set(0.04, 0.03, 0.11);
  kub86.setRotation(0.31, 1.57, 0);
  const kub86MZ = kub86.clone();
  kub86MZ.updateMatrixWorld(true);
  kub86.position.set(0, 0, 0.5);
  kub86MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub86MZ.position.set(0, 0, -0.5);
  const kub86MrZ = new THREE.Group();
  kub86MrZ.add(kub86, kub86MZ);
  kub86MrZ.position.set(0.75, 0.12, 0);
  const kub88 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub88.scale.set(0.03, 0.11, 0.08);
  kub88.setRotation(1.57, 1.31, 0);
  const kub88MZ = kub88.clone();
  kub88MZ.updateMatrixWorld(true);
  kub88.position.set(0, 0, 0.52);
  kub88MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub88MZ.position.set(0, 0, -0.53);
  const kub88MrZ = new THREE.Group();
  kub88MrZ.add(kub88, kub88MZ);
  kub88MrZ.position.set(0.94, 0.07, 0);
  const kub89 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub89.scale.set(0.03, 0.11, 0.08);
  kub89.setRotation(1.57, 0.79, 0);
  const kub89MZ = kub89.clone();
  kub89MZ.updateMatrixWorld(true);
  kub89.position.set(0, 0, 0.53);
  kub89MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub89MZ.position.set(0, 0, -0.53);
  const kub89MrZ = new THREE.Group();
  kub89MrZ.add(kub89, kub89MZ);
  kub89MrZ.position.set(0.94, 0.07, 0);
  const kub90 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub90.scale.set(0.03, 0.11, 0.08);
  kub90.setRotation(1.57, 0.26, 0);
  const kub90MZ = kub90.clone();
  kub90MZ.updateMatrixWorld(true);
  kub90.position.set(0, 0, 0.54);
  kub90MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub90MZ.position.set(0, 0, -0.54);
  const kub90MrZ = new THREE.Group();
  kub90MrZ.add(kub90, kub90MZ);
  kub90MrZ.position.set(0.93, 0.07, 0);
  const kub91 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub91.scale.set(0.02, 0.06, 0.08);
  kub91.setRotation(1.57, 0, 0);
  const kub91MZ = kub91.clone();
  kub91MZ.updateMatrixWorld(true);
  kub91.position.set(0, 0, 0.59);
  kub91MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub91MZ.position.set(0, 0, -0.59);
  const kub91MrZ = new THREE.Group();
  kub91MrZ.add(kub91, kub91MZ);
  kub91MrZ.position.set(0.91, 0.07, 0);
  const kub93 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub93.scale.set(0.02, 0.06, 0.08);
  kub93.setRotation(1.57, -0.39, 0);
  const kub93MZ = kub93.clone();
  kub93MZ.updateMatrixWorld(true);
  kub93.position.set(0, 0, 0.58);
  kub93MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub93MZ.position.set(0, 0, -0.58);
  const kub93MrZ = new THREE.Group();
  kub93MrZ.add(kub93, kub93MZ);
  kub93MrZ.position.set(0.89, 0.07, 0);
  const kub94 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub94.scale.set(0.02, 0.04, 0.08);
  kub94.setRotation(1.57, -1.18, 0);
  const kub94MZ = kub94.clone();
  kub94MZ.updateMatrixWorld(true);
  kub94.position.set(0, 0, 0.59);
  kub94MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub94MZ.position.set(0, 0, -0.59);
  const kub94MrZ = new THREE.Group();
  kub94MrZ.add(kub94, kub94MZ);
  kub94MrZ.position.set(0.87, 0.07, 0);
  const kub95 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub95.scale.set(0.03, 0.04, 0.08);
  kub95.setRotation(1.57, 1.57, 0);
  const kub95MZ = kub95.clone();
  kub95MZ.updateMatrixWorld(true);
  kub95.position.set(0, 0, 0.55);
  kub95MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub95MZ.position.set(0, 0, -0.55);
  const kub95MrZ = new THREE.Group();
  kub95MrZ.add(kub95, kub95MZ);
  kub95MrZ.position.set(0.86, 0.07, 0);
  const kub87 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub87.scale.set(0.08, 0.58, 0.09);
  kub87.setRotation(0.26, 0, -1.31);
  const kub87MZ = kub87.clone();
  kub87MZ.updateMatrixWorld(true);
  kub87.position.set(0, 0, 0.11);
  kub87MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub87MZ.position.set(0, 0, -0.11);
  const kub87MrZ = new THREE.Group();
  kub87MrZ.add(kub87, kub87MZ);
  kub87MrZ.position.set(-0.05, 0.83, 0);
  const kub96 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub96.scale.set(0.08, 0.36, 0.09);
  kub96.setRotation(0.89, 0, -1.31);
  const kub96MZ = kub96.clone();
  kub96MZ.updateMatrixWorld(true);
  kub96.position.set(0, 0, 0.13);
  kub96MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub96MZ.position.set(0, 0, -0.13);
  const kub96MrZ = new THREE.Group();
  kub96MrZ.add(kub96, kub96MZ);
  kub96MrZ.position.set(0.19, 0.89, 0);
  const kub97 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub97.scale.set(0.09, 0.01, 0.01);
  kub97.setRotation(1.4, 0.7, 0.2);
  const kub97MZ = kub97.clone();
  kub97MZ.updateMatrixWorld(true);
  kub97.position.set(0, 0, 0.4);
  kub97MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub97MZ.position.set(0, 0, -0.4);
  const kub97MrZ = new THREE.Group();
  kub97MrZ.add(kub97, kub97MZ);
  kub97MrZ.position.set(0.39, 1.02, 0);
  const kub98 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub98.scale.set(0.54, 0.05, 0.04);
  kub98.setRotation(0, 0.06, 0);
  const kub98MZ = kub98.clone();
  kub98MZ.updateMatrixWorld(true);
  kub98.position.set(0, 0, -0.38);
  kub98MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub98MZ.position.set(0, 0, 0.38);
  const kub98MrZ = new THREE.Group();
  kub98MrZ.add(kub98, kub98MZ);
  kub98MrZ.position.set(-0.18, 0.87, 0);
  const kub99 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub99.scale.set(0.54, 0.31, 0.18);
  kub99.setRotation(0, 0.06, 0);
  const kub99MZ = kub99.clone();
  kub99MZ.updateMatrixWorld(true);
  kub99.position.set(0, 0, -0.17);
  kub99MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub99MZ.position.set(0, 0, 0.16);
  const kub99MrZ = new THREE.Group();
  kub99MrZ.add(kub99, kub99MZ);
  kub99MrZ.position.set(-0.16, 0.61, 0);
  const kub100 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub100.scale.set(0.04, 0.07, 0.34);
  kub100.setRotation(1.51, 0, -1.57);
  const kub100MZ = kub100.clone();
  kub100MZ.updateMatrixWorld(true);
  kub100.position.set(0, 0, -0.35);
  kub100MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub100MZ.position.set(0, 0, 0.35);
  const kub100MrZ = new THREE.Group();
  kub100MrZ.add(kub100, kub100MZ);
  kub100MrZ.position.set(-0.4, 0.35, 0);
  const kub101 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub101.scale.set(0.31, 0.01, 0.01);
  kub101.setRotation(-1.57, 0.06, -1.57);
  const kub101MZ = kub101.clone();
  kub101MZ.updateMatrixWorld(true);
  kub101.position.set(0, 0, -0.38);
  kub101MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub101MZ.position.set(0, 0, 0.38);
  const kub101MrZ = new THREE.Group();
  kub101MrZ.add(kub101, kub101MZ);
  kub101MrZ.position.set(-0.72, 0.62, 0);
  const kub102 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub102.scale.set(0.03, 0.01, 0.06);
  kub102.setRotation(1.47, 1.93, -0.65);
  const kub102MZ = kub102.clone();
  kub102MZ.updateMatrixWorld(true);
  kub102.position.set(0, 0, -0.46);
  kub102MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub102MZ.position.set(0, 0, 0.46);
  const kub102MrZ = new THREE.Group();
  kub102MrZ.add(kub102, kub102MZ);
  kub102MrZ.position.set(0.34, 0.5, 0);
  const cyl14 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl14.scale.set(0.05, 0.01, 0.05);
  cyl14.setRotation(1.47, 1.93, -0.65);
  const cyl14MZ = cyl14.clone();
  cyl14MZ.updateMatrixWorld(true);
  cyl14.position.set(0, 0, -0.51);
  cyl14MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl14MZ.position.set(0, 0, 0.51);
  const cyl14MrZ = new THREE.Group();
  cyl14MrZ.add(cyl14, cyl14MZ);
  cyl14MrZ.position.set(0.31, 0.57, 0);
  const cyl15 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl15.scale.set(0.04, 0.01, 0.04);
  cyl15.setRotation(1.47, 1.93, -0.65);
  const cyl15MZ = cyl15.clone();
  cyl15MZ.updateMatrixWorld(true);
  cyl15.position.set(0, 0, -0.51);
  cyl15MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl15MZ.position.set(0, 0, 0.51);
  const cyl15MrZ = new THREE.Group();
  cyl15MrZ.add(cyl15, cyl15MZ);
  cyl15MrZ.position.set(0.32, 0.57, 0);
  const cyl16 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl16.position.set(-0.67, 0.14, -0);
  cyl16.scale.set(-0.14, -0.07, -0.14);
  cyl16.setRotation(1.57, 0, 0);

  const cyl17 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl17.position.set(-0.67, 0.14, -0);
  cyl17.scale.set(0.15, 0.06, 0.15);
  cyl17.setRotation(1.57, 0, 0);

  const kub85 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub85.scale.set(0.34, 0.31, 0.2);
  kub85.setRotation(0, 0.06, 0);
  const kub85MZ = kub85.clone();
  kub85MZ.updateMatrixWorld(true);
  kub85.position.set(0, 0, -0.08);
  kub85MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub85MZ.position.set(0, 0, 0.08);
  const kub85MrZ = new THREE.Group();
  kub85MrZ.add(kub85, kub85MZ);
  kub85MrZ.position.set(-0.41, 0.5, 0);
  const kub103 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub103.position.set(-0.74, 0.55, -0);
  kub103.scale.set(-0.07, -0.12, -0.12);
  kub103.setRotation(0, 0, -0.32);

  const kub104 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub104.scale.set(0.09, 0.58, 0.09);
  kub104.setRotation(0, 0, -1.09);
  const kub104MZ = kub104.clone();
  kub104MZ.updateMatrixWorld(true);
  kub104.position.set(0, 0, 0.09);
  kub104MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub104MZ.position.set(0, 0, -0.09);
  const kub104MrZ = new THREE.Group();
  kub104MrZ.add(kub104, kub104MZ);
  kub104MrZ.position.set(-0.01, 0.7, 0);
  const kub105 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub105.scale.set(0.08, 0.58, 0.09);
  kub105.setRotation(0, 0, -1.31);
  const kub105MZ = kub105.clone();
  kub105MZ.updateMatrixWorld(true);
  kub105.position.set(0, 0, -0.09);
  kub105MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub105MZ.position.set(0, 0, 0.09);
  const kub105MrZ = new THREE.Group();
  kub105MrZ.add(kub105, kub105MZ);
  kub105MrZ.position.set(-0.08, 0.82, 0);
  const kub106 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub106.scale.set(0.08, 0.01, 0.01);
  kub106.setRotation(-0.89, 0, -1.31);
  const kub106MZ = kub106.clone();
  kub106MZ.updateMatrixWorld(true);
  kub106.position.set(0, 0, -0.46);
  kub106MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub106MZ.position.set(0, 0, 0.46);
  const kub106MrZ = new THREE.Group();
  kub106MrZ.add(kub106, kub106MZ);
  kub106MrZ.position.set(0.34, 0.94, 0);
  const kub107 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub107.scale.set(0.53, 0.01, 0.01);
  kub107.setRotation(1.57, 0.06, -3.14);
  const kub107MZ = kub107.clone();
  kub107MZ.updateMatrixWorld(true);
  kub107.position.set(0, 0, -0.42);
  kub107MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub107MZ.position.set(0, 0, 0.42);
  const kub107MrZ = new THREE.Group();
  kub107MrZ.add(kub107, kub107MZ);
  kub107MrZ.position.set(-0.18, 0.91, 0);
  const kub108 = new THREE.Mesh(boxGeo, kub108Material);
  kub108.scale.set(0.03, 0.05, 0.01);
  kub108.setRotation(1.51, 0, -1.57);
  const kub108MZ = kub108.clone();
  kub108MZ.updateMatrixWorld(true);
  kub108.position.set(0, 0, -0.33);
  kub108MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub108MZ.position.set(0, 0, 0.33);
  const kub108MrZ = new THREE.Group();
  kub108MrZ.add(kub108, kub108MZ);
  kub108MrZ.position.set(-0.73, 0.35, 0);
  const kub109 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub109.scale.set(0.03, 0.05, 0);
  kub109.setRotation(1.51, 0, -1.57);
  const kub109MZ = kub109.clone();
  kub109MZ.updateMatrixWorld(true);
  kub109.position.set(0, 0, -0.33);
  kub109MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub109MZ.position.set(0, 0, 0.33);
  const kub109MrZ = new THREE.Group();
  kub109MrZ.add(kub109, kub109MZ);
  kub109MrZ.position.set(-0.74, 0.35, 0);
  const cyl18 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl18.position.set(-0.67, 0.14, -0);
  cyl18.scale.set(-0.03, -0.18, -0.03);
  cyl18.setRotation(1.57, 0, 0);

  const kub110 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub110.scale.set(-0.04, -0.08, -0.04);
  kub110.setRotation(0, 0, -0.79);
  const kub110MZ = kub110.clone();
  kub110MZ.updateMatrixWorld(true);
  kub110.position.set(0, 0, 0.13);
  kub110MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub110MZ.position.set(0, 0, -0.13);
  const kub110MrZ = new THREE.Group();
  kub110MrZ.add(kub110, kub110MZ);
  kub110MrZ.position.set(-0.64, 0.17, 0);
  const cyl19 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl19.scale.set(0.1, 0.01, 0.1);
  cyl19.setRotation(1.57, 0, 0);
  const cyl19MZ = cyl19.clone();
  cyl19MZ.updateMatrixWorld(true);
  cyl19.position.set(0, 0, 0.48);
  cyl19MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl19MZ.position.set(0, 0, -0.48);
  const cyl19MrZ = new THREE.Group();
  cyl19MrZ.add(cyl19, cyl19MZ);
  cyl19MrZ.position.set(0.25, 0.14, 0);
  const cyl20 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl20.position.set(-0.67, 0.14, -0);
  cyl20.scale.set(-0.03, -0.19, -0.03);
  cyl20.setRotation(1.57, 0, 0);

  const kub111 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub111.position.set(-0.74, 0.39, -0);
  kub111.scale.set(-0.07, -0.09, -0.07);

  const cyl21 = new THREE.Mesh(cylinderGeo, Blue_PictureMaterial);
  cyl21.position.set(-0.78, 0.66, -0.1);
  cyl21.scale.set(0.02, 0, 0.02);
  cyl21.setRotation(0, 0, 1.26);

  const cyl22 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl22.position.set(-0.79, 0.63, -0.04);
  cyl22.scale.set(0.02, 0, 0.02);
  cyl22.setRotation(0, 0, 1.26);

  const cyl23 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl23.position.set(-0.78, 0.66, 0.01);
  cyl23.scale.set(0.02, 0, 0.02);
  cyl23.setRotation(0, 0, 1.26);

  const cyl24 = new THREE.Mesh(cylinderGeo, Train_blueMaterial);
  cyl24.position.set(-0.79, 0.63, 0.07);
  cyl24.scale.set(0.02, 0, 0.02);
  cyl24.setRotation(0, 0, 1.26);

  const kub112 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub112.position.set(-0.83, 0.49, -0);
  kub112.scale.set(-0.01, -0.02, -0.11);
  kub112.setRotation(0, 0, -0.32);

  const kub113 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub113.position.set(-0.83, 0.5, -0);
  kub113.scale.set(-0.01, -0, -0.1);
  kub113.setRotation(0, 0, -0.32);

  const kub114 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub114.position.set(-0.84, 0.47, -0);
  kub114.scale.set(-0.01, -0, -0.1);
  kub114.setRotation(0, 0, -0.32);

  const kub115 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub115.position.set(-0.84, 0.49, 0.1);
  kub115.scale.set(-0.01, -0, -0.01);
  kub115.setRotation(-1.57, 0, -0.32);

  const kub116 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub116.position.set(-0.84, 0.49, -0.1);
  kub116.scale.set(-0.01, -0, -0.01);
  kub116.setRotation(-1.57, 0, -0.32);

  const cyl25 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl25.position.set(-0.88, 0.5, 0.08);
  cyl25.scale.set(0.01, 0.06, 0.01);
  cyl25.setRotation(0.4, 0, 1.26);

  const sphere = new THREE.Mesh(sphereGeo, Green_PictureMaterial);
  sphere.position.set(-0.93, 0.52, 0.1);
  sphere.scale.set(0.01, 0.01, 0.01);
  sphere.setRotation(0.4, 0, 1.26);

  const cyl26 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl26.position.set(-0.81, 0.54, -0.09);
  cyl26.scale.set(0.02, 0, 0.02);
  cyl26.setRotation(0, 0, 1.26);

  const cyl27 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl27.position.set(-0.83, 0.54, -0.09);
  cyl27.scale.set(0.01, 0.01, 0.01);
  cyl27.setRotation(0, 0, 1.26);

  const kub117 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub117.position.set(-0.82, 0.56, -0.09);
  kub117.scale.set(-0.01, -0.01, -0);
  kub117.setRotation(0, 0, 1.26);

  const kub118 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub118.position.set(-0.83, 0.53, -0.09);
  kub118.scale.set(-0.01, -0.01, -0);
  kub118.setRotation(0, 0, 1.26);

  const cyl28 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl28.position.set(-0.81, 0.54, -0.03);
  cyl28.scale.set(0.02, 0, 0.02);
  cyl28.setRotation(1.1, -1.22, 0.81);

  const cyl29 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl29.position.set(-0.83, 0.54, -0.03);
  cyl29.scale.set(0.01, 0.01, 0.01);
  cyl29.setRotation(1.1, -1.22, 0.81);

  const kub119 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub119.position.set(-0.83, 0.55, -0.04);
  kub119.scale.set(-0.01, -0.01, -0);
  kub119.setRotation(-1.1, 1.22, 0.81);

  const kub120 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub120.position.set(-0.83, 0.54, -0.03);
  kub120.scale.set(-0.01, -0.01, -0);
  kub120.setRotation(-1.1, 1.22, 0.81);

  const cyl30 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl30.position.set(-0.81, 0.54, 0.03);
  cyl30.scale.set(0.02, 0, 0.02);
  cyl30.setRotation(-1.25, 1.6, -0.1);

  const cyl31 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl31.position.set(-0.83, 0.54, 0.03);
  cyl31.scale.set(0.01, 0.01, 0.01);
  cyl31.setRotation(-1.25, 1.6, -0.1);

  const kub121 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub121.position.set(-0.83, 0.54, 0.04);
  kub121.scale.set(-0.01, -0.01, -0);
  kub121.setRotation(1.25, -1.6, -0.1);

  const kub122 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub122.position.set(-0.83, 0.55, 0.02);
  kub122.scale.set(-0.01, -0.01, -0);
  kub122.setRotation(1.25, -1.6, -0.1);

  const cyl32 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl32.position.set(-0.81, 0.54, 0.09);
  cyl32.scale.set(0.02, 0, 0.02);
  cyl32.setRotation(1.04, 4.27, -0.92);

  const cyl33 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl33.position.set(-0.83, 0.54, 0.09);
  cyl33.scale.set(0.01, 0.01, 0.01);
  cyl33.setRotation(1.04, 4.27, -0.92);

  const kub123 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub123.position.set(-0.83, 0.54, 0.08);
  kub123.scale.set(-0.01, -0.01, -0);
  kub123.setRotation(-1.04, -4.27, -0.92);

  const kub124 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub124.position.set(-0.83, 0.55, 0.1);
  kub124.scale.set(-0.01, -0.01, -0);
  kub124.setRotation(-1.04, -4.27, -0.92);

  const cyl34 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl34.scale.set(0.02, 0.07, 0.02);
  cyl34.setRotation(0, 0, 0);
  const cyl34MZ = cyl34.clone();
  cyl34MZ.updateMatrixWorld(true);
  cyl34.position.set(0, 0, -0.1);
  cyl34MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl34MZ.position.set(0, 0, 0.1);
  const cyl34MrZ = new THREE.Group();
  cyl34MrZ.add(cyl34, cyl34MZ);
  cyl34MrZ.position.set(-0.78, 0.39, 0);
  const sph1 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph1.scale.set(0.02, 0.02, 0.02);
  sph1.setRotation(0, 0, 0);
  const sph1MZ = sph1.clone();
  sph1MZ.updateMatrixWorld(true);
  sph1.position.set(0, 0, -0.1);
  sph1MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph1MZ.position.set(0, 0, 0.1);
  const sph1MrZ = new THREE.Group();
  sph1MrZ.add(sph1, sph1MZ);
  sph1MrZ.position.set(-0.78, 0.31, 0);
  const cyl35 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl35.scale.set(0.02, 0.1, 0.02);
  cyl35.setRotation(0.7, 0, 0);
  const cyl35MZ = cyl35.clone();
  cyl35MZ.updateMatrixWorld(true);
  cyl35.position.set(0, 0, -0.17);
  cyl35MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl35MZ.position.set(0, 0, 0.16);
  const cyl35MrZ = new THREE.Group();
  cyl35MrZ.add(cyl35, cyl35MZ);
  cyl35MrZ.position.set(-0.78, 0.23, 0);
  const sph2 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph2.scale.set(0.02, 0.02, 0.02);
  sph2.setRotation(0, 0, 0);
  const sph2MZ = sph2.clone();
  sph2MZ.updateMatrixWorld(true);
  sph2.position.set(0, 0, -0.23);
  sph2MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph2MZ.position.set(0, 0, 0.23);
  const sph2MrZ = new THREE.Group();
  sph2MrZ.add(sph2, sph2MZ);
  sph2MrZ.position.set(-0.78, 0.15, 0);
  const cyl36 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl36.scale.set(0.02, 0.39, 0.02);
  cyl36.setRotation(0, 0, -1.57);
  const cyl36MZ = cyl36.clone();
  cyl36MZ.updateMatrixWorld(true);
  cyl36.position.set(0, 0, -0.23);
  cyl36MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl36MZ.position.set(0, 0, 0.23);
  const cyl36MrZ = new THREE.Group();
  cyl36MrZ.add(cyl36, cyl36MZ);
  cyl36MrZ.position.set(-0.4, 0.15, 0);
  const kub125 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub125.scale.set(0.54, 0.09, 0.18);
  kub125.setRotation(-0, 0.06, 0.06);
  const kub125MZ = kub125.clone();
  kub125MZ.updateMatrixWorld(true);
  kub125.position.set(0, 0, -0.14);
  kub125MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub125MZ.position.set(0, 0, 0.14);
  const kub125MrZ = new THREE.Group();
  kub125MrZ.add(kub125, kub125MZ);
  kub125MrZ.position.set(-0.14, 0.9, 0);
  const kub126 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub126.scale.set(0.09, 0.01, 0.01);
  kub126.setRotation(1.32, 1.31, 0.07);
  const kub126MZ = kub126.clone();
  kub126MZ.updateMatrixWorld(true);
  kub126.position.set(0, 0, 0.26);
  kub126MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub126MZ.position.set(0, 0, -0.26);
  const kub126MrZ = new THREE.Group();
  kub126MrZ.add(kub126, kub126MZ);
  kub126MrZ.position.set(0.48, 1.04, 0);
  const kub127 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub127.scale.set(0.08, 0.01, 0);
  kub127.setRotation(0.26, 0, -1.31);
  const kub127MZ = kub127.clone();
  kub127MZ.updateMatrixWorld(true);
  kub127.position.set(0, 0, 0.18);
  kub127MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub127MZ.position.set(0, 0, -0.18);
  const kub127MrZ = new THREE.Group();
  kub127MrZ.add(kub127, kub127MZ);
  kub127MrZ.position.set(0.52, 0.98, 0);
  kub127MrZ.setRotation(0.26, 0, -1.31);
  const kub127MrZMZ = kub127MrZ.clone();
  kub127MrZMZ.updateMatrixWorld(true);
  kub127MrZ.position.set(0, 0, 0.18);
  kub127MrZMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub127MrZMZ.position.set(0, 0, -0.18);
  const kub127MrZMrZ = new THREE.Group();
  kub127MrZMrZ.add(kub127MrZ, kub127MrZMZ);
  kub127MrZMrZ.position.set(0.52, 0.98, 0);
  const cyl37 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl37.position.set(0.96, 0.14, -0);
  cyl37.scale.set(0.08, 0.17, 0.08);
  cyl37.setRotation(1.57, 0, 0);

  const sph3 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph3.scale.set(0.08, 0.08, 0.08);
  sph3.setRotation(1.57, 0, 0);
  const sph3MZ = sph3.clone();
  sph3MZ.updateMatrixWorld(true);
  sph3.position.set(0, 0, -0.17);
  sph3MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph3MZ.position.set(0, 0, 0.17);
  const sph3MrZ = new THREE.Group();
  sph3MrZ.add(sph3, sph3MZ);
  sph3MrZ.position.set(0.96, 0.14, 0);
  const kub128 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub128.position.set(0.75, 0.21, -0);
  kub128.scale.set(0.15, 0.04, 0.23);
  kub128.setRotation(0.31, 1.57, 0);

  const kub129 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub129.position.set(0.75, 0.24, -0);
  kub129.scale.set(0.04, 0.02, 0.23);
  kub129.setRotation(0.31, 1.57, 0);

  const robot = new THREE.Group();
  robot.add(
    kub38,
    kub39,
    cyl8,
    cyl9MrZ,
    pln1MrZ,
    pln2MrZ,
    pln3MrZ,
    pln4MrZ,
    pln5MrZ,
    pln14MrZ,
    pln15MrZ,
    pln16MrZ,
    pln17MrZ,
    pln18MrZ,
    pln6MrZ,
    pln7MrZ,
    pln8MrZ,
    pln9MrZ,
    pln11MrZ,
    kub42,
    kub43,
    kub44,
    kub45,
    kub46,
    kub47,
    kub48,
    kub49MrZ,
    kub50MrZ,
    kub51MrZ,
    kub52MrZ,
    kub53MrZ,
    kub72,
    kub73,
    kub74MrZ,
    kub75MrZ,
    kub76MrZ,
    kub77MrZ,
    kub78MrZ,
    kub80MrZ,
    kub79MrZ,
    kub81MrZ,
    kub82MrZ,
    kub83MrZ,
    kub84MrZ,
    cyl10MrZ,
    cyl11MrZ,
    cyl13MrZ,
    kub86MrZ,
    kub88MrZ,
    kub89MrZ,
    kub90MrZ,
    kub91MrZ,
    kub93MrZ,
    kub94MrZ,
    kub95MrZ,
    kub87MrZ,
    kub96MrZ,
    kub97MrZ,
    kub98MrZ,
    kub99MrZ,
    kub100MrZ,
    kub101MrZ,
    kub102MrZ,
    cyl14MrZ,
    cyl15MrZ,
    cyl16,
    cyl17,
    kub85MrZ,
    kub103,
    kub104MrZ,
    kub105MrZ,
    kub106MrZ,
    kub107MrZ,
    kub108MrZ,
    kub109MrZ,
    cyl18,
    kub110MrZ,
    cyl19MrZ,
    cyl20,
    kub111,
    cyl21,
    cyl22,
    cyl23,
    cyl24,
    kub112,
    kub113,
    kub114,
    kub115,
    kub116,
    cyl25,
    sphere,
    cyl26,
    cyl27,
    kub117,
    kub118,
    cyl28,
    cyl29,
    kub119,
    kub120,
    cyl30,
    cyl31,
    kub121,
    kub122,
    cyl32,
    cyl33,
    kub123,
    kub124,
    cyl34MrZ,
    sph1MrZ,
    cyl35MrZ,
    sph2MrZ,
    cyl36MrZ,
    kub125MrZ,
    kub126MrZ,
    kub127MrZMrZ,
    cyl37,
    sph3MrZ,
    kub128,
    kub129,
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
  const material = new THREE.MeshLambertMaterial({ color: 0xffdd0 });

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
    const material = new THREE.MeshBasicMaterial({ color: 0xff0 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  }
}

function DrawCleanRobot() {
  const Material_2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.05, 0.21, 1),
    roughness: 0.5,
  });
  const Material_1 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0, 0, 0),
    roughness: 0.5,
  });
  const Material_6 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.18, 0.18, 0.18),
    roughness: 0.5,
  });
  const Material_7 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.5, 0.43, 0.44),
    roughness: 0.5,
  });
  const Material_5 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.01, 0),
    roughness: 0.5,
  });
  const Material_3 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.02, 0.8, 0),
    roughness: 0.5,
  });
  const cylbrushesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.23, 0.07, 0.89),
  });
  const Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const cylbody = new THREE.Mesh(cylinderGeo, Material_2);
  cylbody.position.set(0, 0.13, 0);
  cylbody.scale.set(0.56, -0.1, 0.56);

  const cylwheel2 = new THREE.Mesh(cylinderGeo, Material_1);
  cylwheel2.position.set(-0.38, 0.04, 0.26);
  cylwheel2.scale.set(-0.05, -0.02, -0.05);
  cylwheel2.setRotation(1.82, -4.53, 1.54);

  const sphsupport = new THREE.Mesh(sphereGeo, Material_6);
  sphsupport.position.set(0, 0.05, -0.48);
  sphsupport.scale.set(0.04, 0.04, 0.04);

  const cylwheel3 = new THREE.Mesh(cylinderGeo, Material_1);
  cylwheel3.position.set(0, 0.01, -0.48);
  cylwheel3.scale.set(-0.02, -0.01, -0.02);
  cylwheel3.setRotation(1.82, -1.82, 1.54);

  const cylwheel1 = new THREE.Mesh(cylinderGeo, Material_1);
  cylwheel1.position.set(0.37, 0.04, 0.26);
  cylwheel1.scale.set(-0.05, -0.02, -0.05);
  cylwheel1.setRotation(-1.32, -2.63, 1.6);

  const kubdisplay = new THREE.Mesh(boxGeo, Material_7);
  kubdisplay.position.set(0, 0.22, 0);
  kubdisplay.scale.set(-0.27, -0.02, -0.27);

  const cylbutton_off = new THREE.Mesh(cylinderGeo, Material_5);
  cylbutton_off.position.set(0.05, 0.22, -0.43);
  cylbutton_off.scale.set(0.02, 0.02, 0.02);

  const cylbutton_on = new THREE.Mesh(cylinderGeo, Material_3);
  cylbutton_on.position.set(-0.05, 0.22, -0.43);
  cylbutton_on.scale.set(0.02, 0.02, 0.02);

  const cylbrushes = new THREE.Mesh(cylinderGeo, cylbrushesMaterial);
  cylbrushes.position.set(0, 0.09, 0);
  cylbrushes.scale.set(0.08, 0.28, 0.08);
  cylbrushes.setRotation(0, 0, -1.57);

  const kubantenna1 = new THREE.Mesh(boxGeo, Material);
  kubantenna1.position.set(-0.44, 0.31, 0);
  kubantenna1.scale.set(-0.09, -0.01, -0);
  kubantenna1.setRotation(0, 0, -1.1);

  const kubantenna2 = new THREE.Mesh(boxGeo, Material);
  kubantenna2.position.set(0.46, 0.31, 0);
  kubantenna2.scale.set(-0.09, -0.01, -0);
  kubantenna2.setRotation(0, 3.14, -1.1);

  const robot = new THREE.Group();
  robot.add(
    cylbody,
    cylwheel2,
    sphsupport,
    cylwheel3,
    cylwheel1,
    kubdisplay,
    cylbutton_off,
    cylbutton_on,
    cylbrushes,
    kubantenna1,
    kubantenna2,
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
  const material = new THREE.MeshLambertMaterial({ color: 0xffdd0 });

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
    const material = new THREE.MeshBasicMaterial({ color: 0xff0 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  }
}

function DrawVagonDecorations() {
  const FloorTileMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.69, 0.62, 0.32),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.02, 0),
    metalness: 0.83,
    roughness: 0.88,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
  });
  const Floor_CentralMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.39, 0.26),
    metalness: 0.12,
    roughness: 0.15,
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.48, 0.48),
    metalness: 1,
    roughness: 0.5,
  });
  const Green_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.04, 0.49, 0.01),
    roughness: 0.5,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.52, 0),
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
  });
  const PurpleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.36, 0, 0.8),
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const kub307 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub307.position.set(0.01, 6.4, -1.64);
  kub307.scale.set(12.5, 0.12, 0.8);
  kub307.setRotation(-0.29, 0, 0);

  const kub308 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub308.position.set(0.01, 6.72, -0.72);
  kub308.scale.set(12.5, 0.12, 0.22);
  kub308.setRotation(1.57, 0, 0);

  const kub309 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub309.position.set(0.01, 6.72, -0.6);
  kub309.scale.set(12.5, 0.01, 0.2);
  kub309.setRotation(1.57, 0, 0);

  const cyl21Gr = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const cyl21 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
    cyl21.scale.set(0.33, 0.05, 0.33);
    cyl21.position.set(-2.73 * i, 0, 0);
    cyl21Gr.add(cyl21);
  }
  cyl21Gr.position.set(10.9, 6.87, 0.01);
  const sph2Gr = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const sph2 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
    sph2.scale.set(0.25, 0.22, 0.25);
    sph2.position.set(-2.73 * i, 0, 0);
    sph2Gr.add(sph2);
  }
  sph2Gr.position.set(10.9, 6.83, 0.01);
  const kub310Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub310 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub310.scale.set(0.07, 0.27, 0.5);
    kub310.position.set(6.43 * i, 0, 0);
    kub310Gr.add(kub310);
  }
  kub310Gr.position.set(-8.41, 2.58, -1.87);
  const kub311Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub311 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub311.scale.set(0.07, 0.16, 0.58);
    kub311.position.set(6.43 * i, 0, 0);
    kub311Gr.add(kub311);
  }
  kub311Gr.position.set(-8.41, 3.01, -1.79);
  const kub312Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub312 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub312.scale.set(0.07, 0.16, 0.27);
    kub312.position.set(6.43 * i, 0, 0);
    kub312Gr.add(kub312);
  }
  kub312Gr.setRotation(1.57, 0, 0);
  kub312Gr.position.set(-8.41, 3.44, -2.21);
  const kub313Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub313 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub313.scale.set(0.07, 0.13, 0.27);
    kub313.position.set(6.43 * i, 0, 0);
    kub313Gr.add(kub313);
  }
  kub313Gr.setRotation(3.14, 0, 0);
  kub313Gr.position.set(-8.41, 3.84, -2.09);
  const kub314Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub314 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub314.scale.set(0.07, 0.13, 0.31);
    kub314.position.set(6.43 * i, 0, 0);
    kub314Gr.add(kub314);
  }
  kub314Gr.setRotation(1.96, 0, 0);
  kub314Gr.position.set(-8.41, 3.48, -2.06);
  const kub315Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub315 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub315.scale.set(0.07, 0.15, 0.43);
    kub315.position.set(6.43 * i, 0, 0);
    kub315Gr.add(kub315);
  }
  kub315Gr.setRotation(0.34, 0, 0);
  kub315Gr.position.set(-8.41, 3.17, -1.66);
  const kub316Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub316 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub316.scale.set(0.07, 0.15, 0.29);
    kub316.position.set(6.43 * i, 0, 0);
    kub316Gr.add(kub316);
  }
  kub316Gr.setRotation(1.89, 0, 0);
  kub316Gr.position.set(-8.41, 2.62, -1.44);
  const kub317Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub317 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub317.scale.set(0.07, 0.27, 0.5);
    kub317.position.set(6.43 * i, 0, 0);
    kub317Gr.add(kub317);
  }
  kub317Gr.position.set(-4.41, 2.58, -1.87);
  const kub318Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub318 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub318.scale.set(0.07, 0.16, 0.58);
    kub318.position.set(6.43 * i, 0, 0);
    kub318Gr.add(kub318);
  }
  kub318Gr.position.set(-4.41, 3.01, -1.79);
  const kub319Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub319 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub319.scale.set(0.07, 0.16, 0.27);
    kub319.position.set(6.43 * i, 0, 0);
    kub319Gr.add(kub319);
  }
  kub319Gr.setRotation(1.57, 0, 0);
  kub319Gr.position.set(-4.41, 3.44, -2.21);
  const kub320Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub320 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub320.scale.set(0.07, 0.13, 0.27);
    kub320.position.set(6.43 * i, 0, 0);
    kub320Gr.add(kub320);
  }
  kub320Gr.setRotation(3.14, 0, 0);
  kub320Gr.position.set(-4.41, 3.84, -2.09);
  const kub321Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub321 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub321.scale.set(0.07, 0.13, 0.31);
    kub321.position.set(6.43 * i, 0, 0);
    kub321Gr.add(kub321);
  }
  kub321Gr.setRotation(1.96, 0, 0);
  kub321Gr.position.set(-4.41, 3.48, -2.06);
  const kub322Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub322 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub322.scale.set(0.07, 0.15, 0.43);
    kub322.position.set(6.43 * i, 0, 0);
    kub322Gr.add(kub322);
  }
  kub322Gr.setRotation(0.34, 0, 0);
  kub322Gr.position.set(-4.41, 3.17, -1.66);
  const kub323Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub323 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub323.scale.set(0.07, 0.15, 0.29);
    kub323.position.set(6.43 * i, 0, 0);
    kub323Gr.add(kub323);
  }
  kub323Gr.setRotation(1.89, 0, 0);
  kub323Gr.position.set(-4.41, 2.62, -1.44);
  const cyl22Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl22 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl22.scale.set(0.04, 0.46, 0.04);
    cyl22.position.set(6.43 * i, 0, 0);
    cyl22Gr.add(cyl22);
  }
  cyl22Gr.position.set(-8.41, 3.61, -1.3);
  const cyl23Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl23 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl23.scale.set(0.04, 0.28, 0.04);
    cyl23.position.set(6.43 * i, 0, 0);
    cyl23Gr.add(cyl23);
  }
  cyl23Gr.setRotation(1.57, 0, 0);
  cyl23Gr.position.set(-8.41, 3.85, -1.58);
  const cyl24Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl24 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl24.scale.set(0.05, 0.03, 0.05);
    cyl24.position.set(6.43 * i, 0, 0);
    cyl24Gr.add(cyl24);
  }
  cyl24Gr.setRotation(1.57, 0, 0);
  cyl24Gr.position.set(-8.41, 3.85, -1.79);
  const cyl25Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl25 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl25.scale.set(0.05, 0.08, 0.05);
    cyl25.position.set(6.43 * i, 0, 0);
    cyl25Gr.add(cyl25);
  }
  cyl25Gr.position.set(-8.41, 3.21, -1.3);
  const sph3Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph3 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph3.scale.set(0.06, 0.06, 0.06);
    sph3.position.set(6.43 * i, 0, 0);
    sph3Gr.add(sph3);
  }
  sph3Gr.position.set(-8.41, 4.1, -1.3);
  const cyl26Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl26 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl26.scale.set(0.04, 0.54, 0.04);
    cyl26.position.set(6.43 * i, 0, 0);
    cyl26Gr.add(cyl26);
  }
  cyl26Gr.setRotation(1.57, 0, 0);
  cyl26Gr.position.set(-4.41, 4.1, -1.84);
  const cyl27Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl27 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl27.scale.set(0.05, 0.05, 0.05);
    cyl27.position.set(6.43 * i, 0, 0);
    cyl27Gr.add(cyl27);
  }
  cyl27Gr.setRotation(1.57, 0, 0);
  cyl27Gr.position.set(-8.41, 4.1, -2.32);
  const cyl28Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl28 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl28.scale.set(0.04, 0.54, 0.04);
    cyl28.position.set(6.43 * i, 0, 0);
    cyl28Gr.add(cyl28);
  }
  cyl28Gr.setRotation(1.57, 0, 0);
  cyl28Gr.position.set(-8.41, 4.1, -1.84);
  const cyl29Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl29 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl29.scale.set(0.05, 0.05, 0.05);
    cyl29.position.set(6.43 * i, 0, 0);
    cyl29Gr.add(cyl29);
  }
  cyl29Gr.setRotation(1.57, 0, 0);
  cyl29Gr.position.set(-4.41, 4.1, -2.32);
  const sph4Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph4 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph4.scale.set(0.06, 0.06, 0.06);
    sph4.position.set(6.43 * i, 0, 0);
    sph4Gr.add(sph4);
  }
  sph4Gr.position.set(-4.41, 4.1, -1.3);
  const kub324Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub324 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub324.scale.set(2.01, 0.07, 0.56);
    kub324.position.set(6.43 * i, 0, 0);
    kub324Gr.add(kub324);
  }
  kub324Gr.setRotation(3.14, 0, 0);
  kub324Gr.position.set(-6.41, 3.07, -1.83);
  const kub325Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub325 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub325.scale.set(2.01, 0.07, 0.44);
    kub325.position.set(6.43 * i, 0, 0);
    kub325Gr.add(kub325);
  }
  kub325Gr.setRotation(4.46, 0, 0);
  kub325Gr.position.set(-6.41, 3.45, -2.2);
  const kub326Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub326 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub326.scale.set(2.01, 0.07, 0.4);
    kub326.position.set(6.43 * i, 0, 0);
    kub326Gr.add(kub326);
  }
  kub326Gr.setRotation(1.9, 0, 0);
  kub326Gr.position.set(-6.41, 2.69, -1.5);
  const cyl30Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl30 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl30.scale.set(0.04, 0.46, 0.04);
    cyl30.position.set(6.43 * i, 0, 0);
    cyl30Gr.add(cyl30);
  }
  cyl30Gr.position.set(-4.41, 3.61, -1.3);
  const cyl31Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl31 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl31.scale.set(0.04, 0.28, 0.04);
    cyl31.position.set(6.43 * i, 0, 0);
    cyl31Gr.add(cyl31);
  }
  cyl31Gr.setRotation(1.57, 0, 0);
  cyl31Gr.position.set(-4.41, 3.85, -1.58);
  const cyl32Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl32 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl32.scale.set(0.05, 0.03, 0.05);
    cyl32.position.set(6.43 * i, 0, 0);
    cyl32Gr.add(cyl32);
  }
  cyl32Gr.setRotation(1.57, 0, 0);
  cyl32Gr.position.set(-4.41, 3.85, -1.79);
  const cyl33Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl33 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl33.scale.set(0.05, 0.08, 0.05);
    cyl33.position.set(6.43 * i, 0, 0);
    cyl33Gr.add(cyl33);
  }
  cyl33Gr.position.set(-4.41, 3.21, -1.3);
  const kub327 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub327.position.set(-4.86, 4.89, -2.37);
  kub327.scale.set(0.51, 0.01, 0.6);
  kub327.setRotation(1.57, 0, 0);

  const kub328 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub328.position.set(7.98, 4.89, -2.37);
  kub328.scale.set(0.51, 0.01, 0.6);
  kub328.setRotation(1.57, 0, 0);

  const kub329Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub329 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub329.scale.set(0.07, 0.27, 0.5);
    kub329.position.set(6.43 * i, 0, 0);
    kub329Gr.add(kub329);
  }
  kub329Gr.setRotation(0, 3.14, 0);
  kub329Gr.position.set(8.45, 2.58, 1.88);
  const kub330Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub330 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub330.scale.set(0.07, 0.16, 0.58);
    kub330.position.set(6.43 * i, 0, 0);
    kub330Gr.add(kub330);
  }
  kub330Gr.setRotation(0, 3.14, 0);
  kub330Gr.position.set(8.45, 3.01, 1.79);
  const kub331Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub331 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub331.scale.set(0.07, 0.16, 0.27);
    kub331.position.set(6.43 * i, 0, 0);
    kub331Gr.add(kub331);
  }
  kub331Gr.setRotation(1.57, 3.14, 0);
  kub331Gr.position.set(8.45, 3.44, 2.22);
  const kub332Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub332 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub332.scale.set(0.07, 0.13, 0.27);
    kub332.position.set(6.43 * i, 0, 0);
    kub332Gr.add(kub332);
  }
  kub332Gr.setRotation(3.14, 3.14, 0);
  kub332Gr.position.set(8.45, 3.84, 2.1);
  const kub333Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub333 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub333.scale.set(0.07, 0.13, 0.31);
    kub333.position.set(6.43 * i, 0, 0);
    kub333Gr.add(kub333);
  }
  kub333Gr.setRotation(1.96, 3.14, 0);
  kub333Gr.position.set(8.45, 3.48, 2.06);
  const kub334Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub334 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub334.scale.set(0.07, 0.15, 0.43);
    kub334.position.set(6.43 * i, 0, 0);
    kub334Gr.add(kub334);
  }
  kub334Gr.setRotation(0.34, 3.14, 0);
  kub334Gr.position.set(8.45, 3.17, 1.67);
  const kub335Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub335 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub335.scale.set(0.07, 0.15, 0.29);
    kub335.position.set(6.43 * i, 0, 0);
    kub335Gr.add(kub335);
  }
  kub335Gr.setRotation(1.89, 3.14, 0);
  kub335Gr.position.set(8.45, 2.62, 1.44);
  const kub336Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub336 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub336.scale.set(0.07, 0.27, 0.5);
    kub336.position.set(6.43 * i, 0, 0);
    kub336Gr.add(kub336);
  }
  kub336Gr.setRotation(0, 3.14, 0);
  kub336Gr.position.set(4.45, 2.58, 1.88);
  const kub337Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub337 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub337.scale.set(0.07, 0.16, 0.58);
    kub337.position.set(6.43 * i, 0, 0);
    kub337Gr.add(kub337);
  }
  kub337Gr.setRotation(0, 3.14, 0);
  kub337Gr.position.set(4.45, 3.01, 1.79);
  const kub338Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub338 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub338.scale.set(0.07, 0.16, 0.27);
    kub338.position.set(6.43 * i, 0, 0);
    kub338Gr.add(kub338);
  }
  kub338Gr.setRotation(1.57, 3.14, 0);
  kub338Gr.position.set(4.45, 3.44, 2.22);
  const kub339Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub339 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub339.scale.set(0.07, 0.13, 0.27);
    kub339.position.set(6.43 * i, 0, 0);
    kub339Gr.add(kub339);
  }
  kub339Gr.setRotation(3.14, 3.14, 0);
  kub339Gr.position.set(4.45, 3.84, 2.1);
  const kub340Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub340 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub340.scale.set(0.07, 0.13, 0.31);
    kub340.position.set(6.43 * i, 0, 0);
    kub340Gr.add(kub340);
  }
  kub340Gr.setRotation(1.96, 3.14, 0);
  kub340Gr.position.set(4.45, 3.48, 2.06);
  const kub341Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub341 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub341.scale.set(0.07, 0.15, 0.43);
    kub341.position.set(6.43 * i, 0, 0);
    kub341Gr.add(kub341);
  }
  kub341Gr.setRotation(0.34, 3.14, 0);
  kub341Gr.position.set(4.45, 3.17, 1.67);
  const kub342Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub342 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub342.scale.set(0.07, 0.15, 0.29);
    kub342.position.set(6.43 * i, 0, 0);
    kub342Gr.add(kub342);
  }
  kub342Gr.setRotation(1.89, 3.14, 0);
  kub342Gr.position.set(4.45, 2.62, 1.44);
  const cyl34Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl34 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl34.scale.set(0.04, 0.46, 0.04);
    cyl34.position.set(6.43 * i, 0, 0);
    cyl34Gr.add(cyl34);
  }
  cyl34Gr.setRotation(0, 3.14, 0);
  cyl34Gr.position.set(8.45, 3.61, 1.31);
  const cyl35Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl35 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl35.scale.set(0.04, 0.28, 0.04);
    cyl35.position.set(6.43 * i, 0, 0);
    cyl35Gr.add(cyl35);
  }
  cyl35Gr.setRotation(1.57, 3.14, 0);
  cyl35Gr.position.set(8.45, 3.85, 1.59);
  const cyl36Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl36 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl36.scale.set(0.05, 0.03, 0.05);
    cyl36.position.set(6.43 * i, 0, 0);
    cyl36Gr.add(cyl36);
  }
  cyl36Gr.setRotation(1.57, 3.14, 0);
  cyl36Gr.position.set(8.45, 3.85, 1.79);
  const cyl37Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl37 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl37.scale.set(0.05, 0.08, 0.05);
    cyl37.position.set(6.43 * i, 0, 0);
    cyl37Gr.add(cyl37);
  }
  cyl37Gr.setRotation(0, 3.14, 0);
  cyl37Gr.position.set(8.45, 3.21, 1.31);
  const sph5Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph5 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph5.scale.set(0.06, 0.06, 0.06);
    sph5.position.set(6.43 * i, 0, 0);
    sph5Gr.add(sph5);
  }
  sph5Gr.setRotation(0, 3.14, 0);
  sph5Gr.position.set(8.45, 4.1, 1.31);
  const cyl38Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl38 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl38.scale.set(0.04, 0.54, 0.04);
    cyl38.position.set(6.43 * i, 0, 0);
    cyl38Gr.add(cyl38);
  }
  cyl38Gr.setRotation(1.57, 3.14, 0);
  cyl38Gr.position.set(4.45, 4.1, 1.84);
  const cyl40Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl40 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl40.scale.set(0.04, 0.54, 0.04);
    cyl40.position.set(6.43 * i, 0, 0);
    cyl40Gr.add(cyl40);
  }
  cyl40Gr.setRotation(1.57, 3.14, 0);
  cyl40Gr.position.set(8.45, 4.1, 1.84);
  const cyl41Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl41 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl41.scale.set(0.05, 0.05, 0.05);
    cyl41.position.set(6.43 * i, 0, 0);
    cyl41Gr.add(cyl41);
  }
  cyl41Gr.setRotation(1.57, 3.14, 0);
  cyl41Gr.position.set(4.45, 4.1, 2.32);
  const sph6Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph6 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph6.scale.set(0.06, 0.06, 0.06);
    sph6.position.set(6.43 * i, 0, 0);
    sph6Gr.add(sph6);
  }
  sph6Gr.setRotation(0, 3.14, 0);
  sph6Gr.position.set(4.45, 4.1, 1.31);
  const kub343Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub343 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub343.scale.set(2.01, 0.07, 0.56);
    kub343.position.set(6.43 * i, 0, 0);
    kub343Gr.add(kub343);
  }
  kub343Gr.setRotation(3.14, 3.14, 0);
  kub343Gr.position.set(6.45, 3.07, 1.83);
  const kub344Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub344 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub344.scale.set(2.01, 0.07, 0.44);
    kub344.position.set(6.43 * i, 0, 0);
    kub344Gr.add(kub344);
  }
  kub344Gr.setRotation(4.46, 3.14, 0);
  kub344Gr.position.set(6.45, 3.45, 2.21);
  const kub345Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub345 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub345.scale.set(2.01, 0.07, 0.4);
    kub345.position.set(6.43 * i, 0, 0);
    kub345Gr.add(kub345);
  }
  kub345Gr.setRotation(1.9, 3.14, 0);
  kub345Gr.position.set(6.45, 2.69, 1.51);
  const cyl42Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl42 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl42.scale.set(0.04, 0.46, 0.04);
    cyl42.position.set(6.43 * i, 0, 0);
    cyl42Gr.add(cyl42);
  }
  cyl42Gr.setRotation(0, 3.14, 0);
  cyl42Gr.position.set(4.45, 3.61, 1.31);
  const cyl43Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl43 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl43.scale.set(0.04, 0.28, 0.04);
    cyl43.position.set(6.43 * i, 0, 0);
    cyl43Gr.add(cyl43);
  }
  cyl43Gr.setRotation(1.57, 3.14, 0);
  cyl43Gr.position.set(4.45, 3.85, 1.59);
  const cyl44Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl44 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl44.scale.set(0.05, 0.03, 0.05);
    cyl44.position.set(6.43 * i, 0, 0);
    cyl44Gr.add(cyl44);
  }
  cyl44Gr.setRotation(1.57, 3.14, 0);
  cyl44Gr.position.set(4.45, 3.85, 1.79);
  const cyl45Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl45 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl45.scale.set(0.05, 0.08, 0.05);
    cyl45.position.set(6.43 * i, 0, 0);
    cyl45Gr.add(cyl45);
  }
  cyl45Gr.setRotation(0, 3.14, 0);
  cyl45Gr.position.set(4.45, 3.21, 1.31);
  const kub346 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub346.position.set(1.56, 4.89, 2.37);
  kub346.scale.set(0.51, 0.01, 0.6);
  kub346.setRotation(1.57, 0, 0);

  const kub347 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub347.position.set(0.01, 5.83, -2.36);
  kub347.scale.set(1.97, 0.01, 0.2);
  kub347.setRotation(1.57, 0, 0);

  const cyl46 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl46.position.set(-1.75, 5.83, -2.35);
  cyl46.scale.set(0.15, 0.01, 0.15);
  cyl46.setRotation(1.57, 0, 0);

  const kub348 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub348.position.set(0.01, 5.83, -2.36);
  kub348.scale.set(1.82, 0.01, 0.06);
  kub348.setRotation(1.57, 0, 0);

  const cyl47 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl47.position.set(0.59, 5.83, -2.35);
  cyl47.scale.set(0.15, 0.01, 0.15);
  cyl47.setRotation(1.64, 0, -4.71);

  const cyl48 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl48.position.set(-0.58, 5.83, -2.35);
  cyl48.scale.set(0.15, 0.01, 0.15);
  cyl48.setRotation(1.5, 0, -1.57);

  const kub349 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub349.position.set(6.48, 5.83, 2.34);
  kub349.scale.set(1.97, 0.01, 0.2);
  kub349.setRotation(1.57, 3.14, 0);

  const cyl49 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl49.position.set(8.24, 5.83, 2.32);
  cyl49.scale.set(0.15, 0.01, 0.15);
  cyl49.setRotation(1.57, 3.14, 0);

  const kub350 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub350.position.set(6.48, 5.83, 2.33);
  kub350.scale.set(1.82, 0.01, 0.06);
  kub350.setRotation(1.57, 3.14, 0);

  const cyl50 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl50.position.set(5.9, 5.83, 2.32);
  cyl50.scale.set(0.15, 0.01, 0.15);
  cyl50.setRotation(4.78, 0, -4.71);

  const cyl51 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl51.position.set(7.07, 5.83, 2.32);
  cyl51.scale.set(0.15, 0.01, 0.15);
  cyl51.setRotation(-1.65, 0, -1.57);

  const kub351 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub351.position.set(-6.42, 5.83, 2.34);
  kub351.scale.set(1.97, 0.01, 0.2);
  kub351.setRotation(1.57, 3.14, 0);

  const cyl52 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl52.position.set(-4.66, 5.83, 2.32);
  cyl52.scale.set(0.15, 0.01, 0.15);
  cyl52.setRotation(1.57, 3.14, 0);

  const kub352 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub352.position.set(-6.42, 5.83, 2.33);
  kub352.scale.set(1.82, 0.01, 0.06);
  kub352.setRotation(1.57, 3.14, 0);

  const cyl53 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl53.position.set(-6.99, 5.83, 2.32);
  cyl53.scale.set(0.15, 0.01, 0.15);
  cyl53.setRotation(4.78, 0, -4.71);

  const cyl54 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl54.position.set(-5.82, 5.83, 2.32);
  cyl54.scale.set(0.15, 0.01, 0.15);
  cyl54.setRotation(-1.65, 0, -1.57);

  const cyl55 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl55.position.set(0.01, 6.12, -0.77);
  cyl55.scale.set(0.04, 12.5, 0.04);
  cyl55.setRotation(1.57, 1.57, 0);

  const cyl56 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl56.position.set(0.01, 6.12, 0.79);
  cyl56.scale.set(0.04, 12.5, 0.04);
  cyl56.setRotation(1.57, 1.57, 0);

  const cyl57Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cyl57 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl57.scale.set(0.04, 0.22, 0.04);
    cyl57.position.set(5.56 * i, 0, 0);
    cyl57Gr.add(cyl57);
  }
  cyl57Gr.position.set(-10.8, 6.32, -0.77);
  const cyl58Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cyl58 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl58.scale.set(0.04, 0.22, 0.04);
    cyl58.position.set(5.55 * i, 0, 0);
    cyl58Gr.add(cyl58);
  }
  cyl58Gr.position.set(-10.8, 6.32, 0.79);
  const kub353 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub353.position.set(0.01, 6.4, 1.66);
  kub353.scale.set(12.5, 0.12, 0.8);
  kub353.setRotation(-0.29, 3.14, 0);

  const kub116 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub116.position.set(0.01, 6.72, 0.73);
  kub116.scale.set(12.5, 0.12, 0.22);
  kub116.setRotation(1.57, 0, 0);

  const kub145 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub145.position.set(0.01, 6.72, 0.61);
  kub145.scale.set(12.5, 0.01, 0.2);
  kub145.setRotation(1.57, 0, 0);

  const out = new THREE.Group();
  out.add(
    kub307,
    kub308,
    kub309,
    cyl21Gr,
    sph2Gr,
    kub310Gr,
    kub311Gr,
    kub312Gr,
    kub313Gr,
    kub314Gr,
    kub315Gr,
    kub316Gr,
    kub317Gr,
    kub318Gr,
    kub319Gr,
    kub320Gr,
    kub321Gr,
    kub322Gr,
    kub323Gr,
    cyl22Gr,
    cyl23Gr,
    cyl24Gr,
    cyl25Gr,
    sph3Gr,
    cyl26Gr,
    cyl27Gr,
    cyl28Gr,
    cyl29Gr,
    sph4Gr,
    kub324Gr,
    kub325Gr,
    kub326Gr,
    cyl30Gr,
    cyl31Gr,
    cyl32Gr,
    cyl33Gr,
    kub327,
    kub328,
    kub329Gr,
    kub330Gr,
    kub331Gr,
    kub332Gr,
    kub333Gr,
    kub334Gr,
    kub335Gr,
    kub336Gr,
    kub337Gr,
    kub338Gr,
    kub339Gr,
    kub340Gr,
    kub341Gr,
    kub342Gr,
    cyl34Gr,
    cyl35Gr,
    cyl36Gr,
    cyl37Gr,
    sph5Gr,
    cyl38Gr,
    cyl40Gr,
    cyl41Gr,
    sph6Gr,
    kub343Gr,
    kub344Gr,
    kub345Gr,
    cyl42Gr,
    cyl43Gr,
    cyl44Gr,
    cyl45Gr,
    kub346,
    kub347,
    cyl46,
    kub348,
    cyl47,
    cyl48,
    kub349,
    cyl49,
    kub350,
    cyl50,
    cyl51,
    kub351,
    cyl52,
    kub352,
    cyl53,
    cyl54,
    cyl55,
    cyl56,
    cyl57Gr,
    cyl58Gr,
    kub353,
    kub116,
    kub145,
  );

  return out;
}

function DrawVagon() {
  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0, 0, 0),
    roughness: 0.5,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    emissive: new THREE.Color(1, 1, 1),
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.15, 0.25, 0.8),
    roughness: 0.5,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.52, 0),
  });
  const Train_blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.03, 0.1, 0.65),
    roughness: 0.5,
  });
  const GlassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.22, 0.24, 0.33),
    transparent: true,
    opacity: 0.32,
    roughness: 0.5,
  });
  const Ceiling_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.38, 0.3, 0.1),
    roughness: 0.12,
  });
  const Floor_trainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.35, 0.16, 0.1),
    metalness: 1,
    roughness: 0.54,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.48, 0.48),
    metalness: 1,
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const cylwheel_8 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_8.scale.set(0.81, 0.16, 0.81);
  cylwheel_8.setRotation(1.57, 0, 0);
  const cylwheel_8MZ = cylwheel_8.clone();
  cylwheel_8MZ.updateMatrixWorld(true);
  cylwheel_8.position.set(0, 0, -2.12);
  cylwheel_8MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_8MZ.position.set(0, 0, 2.12);
  const cylwheel_8MrZ = new THREE.Group();
  cylwheel_8MrZ.add(cylwheel_8, cylwheel_8MZ);
  cylwheel_8MrZ.position.set(-6.13, 0.77, 0);
  const cylwheel_9 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_9.scale.set(0.51, 0.1, 0.51);
  cylwheel_9.setRotation(1.57, 0, 0);
  const cylwheel_9MZ = cylwheel_9.clone();
  cylwheel_9MZ.updateMatrixWorld(true);
  cylwheel_9.position.set(0, 0, -2.39);
  cylwheel_9MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_9MZ.position.set(0, 0, 2.39);
  const cylwheel_9MrZ = new THREE.Group();
  cylwheel_9MrZ.add(cylwheel_9, cylwheel_9MZ);
  cylwheel_9MrZ.position.set(-6.13, 0.77, 0);
  const cylwheel_10 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_10.scale.set(0.81, 0.16, 0.81);
  cylwheel_10.setRotation(1.57, 0, 0);
  const cylwheel_10MZ = cylwheel_10.clone();
  cylwheel_10MZ.updateMatrixWorld(true);
  cylwheel_10.position.set(0, 0, -2.12);
  cylwheel_10MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_10MZ.position.set(0, 0, 2.12);
  const cylwheel_10MrZ = new THREE.Group();
  cylwheel_10MrZ.add(cylwheel_10, cylwheel_10MZ);
  cylwheel_10MrZ.position.set(-10.4, 0.77, 0);
  const cylwheel_11 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_11.scale.set(0.51, 0.1, 0.51);
  cylwheel_11.setRotation(1.57, 0, 0);
  const cylwheel_11MZ = cylwheel_11.clone();
  cylwheel_11MZ.updateMatrixWorld(true);
  cylwheel_11.position.set(0, 0, -2.39);
  cylwheel_11MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_11MZ.position.set(0, 0, 2.39);
  const cylwheel_11MrZ = new THREE.Group();
  cylwheel_11MrZ.add(cylwheel_11, cylwheel_11MZ);
  cylwheel_11MrZ.position.set(-10.4, 0.77, 0);
  const kub307 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub307.position.set(-0, 1.98, 0);
  kub307.scale.set(12.6, 0.27, 2.47);

  const kub308 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub308.scale.set(0.17, 0.47, 0.2);
  kub308.setRotation(0, 0, 0);
  const kub308MZ = kub308.clone();
  kub308MZ.updateMatrixWorld(true);
  kub308.position.set(0, 0, -1.14);
  kub308MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub308MZ.position.set(0, 0, 1.14);
  const kub308MrZ = new THREE.Group();
  kub308MrZ.add(kub308, kub308MZ);
  kub308MrZ.position.set(-6.13, 1.28, 0);
  const kub309 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub309.scale.set(0.17, 0.22, 0.2);
  kub309.setRotation(0, 0, 0);
  const kub309MZ = kub309.clone();
  kub309MZ.updateMatrixWorld(true);
  kub309.position.set(0, 0, -1.76);
  kub309MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub309MZ.position.set(0, 0, 1.76);
  const kub309MrZ = new THREE.Group();
  kub309MrZ.add(kub309, kub309MZ);
  kub309MrZ.position.set(-6.13, 0.77, 0);
  const kub310 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub310.scale.set(0.17, 0.16, 0.36);
  kub310.setRotation(-0.57, 0, 0);
  const kub310MZ = kub310.clone();
  kub310MZ.updateMatrixWorld(true);
  kub310.position.set(0, 0, -1.38);
  kub310MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub310MZ.position.set(0, 0, 1.38);
  const kub310MrZ = new THREE.Group();
  kub310MrZ.add(kub310, kub310MZ);
  kub310MrZ.position.set(-6.13, 0.9, 0);
  const cyl21Gr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cyl21 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl21.scale.set(0.12, 0.36, 0.12);
    cyl21.position.set(0.49 * i, 0, 0);
    cyl21Gr.add(cyl21);
  }
  cyl21Gr.setRotation(0, 0, 0);
  const cyl21GroupMZ = cyl21Gr.clone();
  cyl21GroupMZ.updateMatrixWorld(true);
  cyl21Gr.position.set(0, 0, -2.1);
  cyl21GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl21GroupMZ.position.set(0, 0, 2.1);
  const cyl21GroupMrZ = new THREE.Group();
  cyl21GroupMrZ.add(cyl21Gr, cyl21GroupMZ);
  cyl21GroupMrZ.position.set(-8.98, 1.06, 0);
  const kub311 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub311.scale.set(2.84, 0.16, 0.05);
  kub311.setRotation(0, 0, 0);
  const kub311MZ = kub311.clone();
  kub311MZ.updateMatrixWorld(true);
  kub311.position.set(0, 0, -1.84);
  kub311MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub311MZ.position.set(0, 0, 1.84);
  const kub311MrZ = new THREE.Group();
  kub311MrZ.add(kub311, kub311MZ);
  kub311MrZ.position.set(-8.27, 0.79, 0);
  const kub312 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub312.scale.set(0.17, 0.16, 0.36);
  kub312.setRotation(-0.57, 0, 0);
  const kub312MZ = kub312.clone();
  kub312MZ.updateMatrixWorld(true);
  kub312.position.set(0, 0, -1.38);
  kub312MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub312MZ.position.set(0, 0, 1.38);
  const kub312MrZ = new THREE.Group();
  kub312MrZ.add(kub312, kub312MZ);
  kub312MrZ.position.set(-10.4, 0.9, 0);
  const kub313 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub313.scale.set(0.17, 0.47, 0.2);
  kub313.setRotation(0, 0, 0);
  const kub313MZ = kub313.clone();
  kub313MZ.updateMatrixWorld(true);
  kub313.position.set(0, 0, -1.14);
  kub313MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub313MZ.position.set(0, 0, 1.14);
  const kub313MrZ = new THREE.Group();
  kub313MrZ.add(kub313, kub313MZ);
  kub313MrZ.position.set(-10.4, 1.28, 0);
  const kub314 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub314.scale.set(2.84, 0.16, 0.05);
  kub314.setRotation(0, 0, 0);
  const kub314MZ = kub314.clone();
  kub314MZ.updateMatrixWorld(true);
  kub314.position.set(0, 0, -2.36);
  kub314MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub314MZ.position.set(0, 0, 2.36);
  const kub314MrZ = new THREE.Group();
  kub314MrZ.add(kub314, kub314MZ);
  kub314MrZ.position.set(-8.27, 1.58, 0);
  const kub315 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub315.scale.set(1.05, 0.16, 0.08);
  kub315.setRotation(0, 0, 0);
  const kub315MZ = kub315.clone();
  kub315MZ.updateMatrixWorld(true);
  kub315.position.set(0, 0, -2.39);
  kub315MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub315MZ.position.set(0, 0, 2.39);
  const kub315MrZ = new THREE.Group();
  kub315MrZ.add(kub315, kub315MZ);
  kub315MrZ.position.set(-8.27, 0.77, 0);
  const kub316 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub316.scale.set(0.17, 0.22, 0.2);
  kub316.setRotation(0, 0, 0);
  const kub316MZ = kub316.clone();
  kub316MZ.updateMatrixWorld(true);
  kub316.position.set(0, 0, -1.76);
  kub316MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub316MZ.position.set(0, 0, 1.76);
  const kub316MrZ = new THREE.Group();
  kub316MrZ.add(kub316, kub316MZ);
  kub316MrZ.position.set(-10.4, 0.77, 0);
  const cylwheel_12 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_12.scale.set(0.81, 0.16, 0.81);
  cylwheel_12.setRotation(1.57, 0, 0);
  const cylwheel_12MZ = cylwheel_12.clone();
  cylwheel_12MZ.updateMatrixWorld(true);
  cylwheel_12.position.set(0, 0, -2.12);
  cylwheel_12MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_12MZ.position.set(0, 0, 2.12);
  const cylwheel_12MrZ = new THREE.Group();
  cylwheel_12MrZ.add(cylwheel_12, cylwheel_12MZ);
  cylwheel_12MrZ.position.set(11.2, 0.77, 0);
  const cylwheel_13 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_13.scale.set(0.51, 0.1, 0.51);
  cylwheel_13.setRotation(1.57, 0, 0);
  const cylwheel_13MZ = cylwheel_13.clone();
  cylwheel_13MZ.updateMatrixWorld(true);
  cylwheel_13.position.set(0, 0, -2.39);
  cylwheel_13MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_13MZ.position.set(0, 0, 2.39);
  const cylwheel_13MrZ = new THREE.Group();
  cylwheel_13MrZ.add(cylwheel_13, cylwheel_13MZ);
  cylwheel_13MrZ.position.set(11.2, 0.77, 0);
  const cylwheel_14 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_14.scale.set(0.81, 0.16, 0.81);
  cylwheel_14.setRotation(1.57, 0, 0);
  const cylwheel_14MZ = cylwheel_14.clone();
  cylwheel_14MZ.updateMatrixWorld(true);
  cylwheel_14.position.set(0, 0, -2.12);
  cylwheel_14MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_14MZ.position.set(0, 0, 2.12);
  const cylwheel_14MrZ = new THREE.Group();
  cylwheel_14MrZ.add(cylwheel_14, cylwheel_14MZ);
  cylwheel_14MrZ.position.set(6.89, 0.77, 0);
  const cylwheel_15 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_15.scale.set(0.51, 0.1, 0.51);
  cylwheel_15.setRotation(1.57, 0, 0);
  const cylwheel_15MZ = cylwheel_15.clone();
  cylwheel_15MZ.updateMatrixWorld(true);
  cylwheel_15.position.set(0, 0, -2.39);
  cylwheel_15MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_15MZ.position.set(0, 0, 2.39);
  const cylwheel_15MrZ = new THREE.Group();
  cylwheel_15MrZ.add(cylwheel_15, cylwheel_15MZ);
  cylwheel_15MrZ.position.set(6.89, 0.77, 0);
  const kub317 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub317.scale.set(0.17, 0.47, 0.2);
  kub317.setRotation(0, 0, 0);
  const kub317MZ = kub317.clone();
  kub317MZ.updateMatrixWorld(true);
  kub317.position.set(0, 0, -1.14);
  kub317MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub317MZ.position.set(0, 0, 1.14);
  const kub317MrZ = new THREE.Group();
  kub317MrZ.add(kub317, kub317MZ);
  kub317MrZ.position.set(11.2, 1.28, 0);
  const kub318 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub318.scale.set(0.17, 0.22, 0.2);
  kub318.setRotation(0, 0, 0);
  const kub318MZ = kub318.clone();
  kub318MZ.updateMatrixWorld(true);
  kub318.position.set(0, 0, -1.76);
  kub318MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub318MZ.position.set(0, 0, 1.76);
  const kub318MrZ = new THREE.Group();
  kub318MrZ.add(kub318, kub318MZ);
  kub318MrZ.position.set(11.2, 0.77, 0);
  const kub319 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub319.scale.set(0.17, 0.16, 0.36);
  kub319.setRotation(-0.57, 0, 0);
  const kub319MZ = kub319.clone();
  kub319MZ.updateMatrixWorld(true);
  kub319.position.set(0, 0, -1.38);
  kub319MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub319MZ.position.set(0, 0, 1.38);
  const kub319MrZ = new THREE.Group();
  kub319MrZ.add(kub319, kub319MZ);
  kub319MrZ.position.set(11.2, 0.9, 0);
  const kub320 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub320.scale.set(2.84, 0.16, 0.05);
  kub320.setRotation(0, 0, 0);
  const kub320MZ = kub320.clone();
  kub320MZ.updateMatrixWorld(true);
  kub320.position.set(0, 0, -1.84);
  kub320MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub320MZ.position.set(0, 0, 1.84);
  const kub320MrZ = new THREE.Group();
  kub320MrZ.add(kub320, kub320MZ);
  kub320MrZ.position.set(9.02, 0.79, 0);
  const kub321 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub321.scale.set(0.17, 0.16, 0.36);
  kub321.setRotation(-0.57, 0, 0);
  const kub321MZ = kub321.clone();
  kub321MZ.updateMatrixWorld(true);
  kub321.position.set(0, 0, -1.38);
  kub321MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub321MZ.position.set(0, 0, 1.38);
  const kub321MrZ = new THREE.Group();
  kub321MrZ.add(kub321, kub321MZ);
  kub321MrZ.position.set(6.89, 0.9, 0);
  const kub322 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub322.scale.set(0.17, 0.47, 0.2);
  kub322.setRotation(0, 0, 0);
  const kub322MZ = kub322.clone();
  kub322MZ.updateMatrixWorld(true);
  kub322.position.set(0, 0, -1.14);
  kub322MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub322MZ.position.set(0, 0, 1.14);
  const kub322MrZ = new THREE.Group();
  kub322MrZ.add(kub322, kub322MZ);
  kub322MrZ.position.set(6.89, 1.28, 0);
  const kub323 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub323.scale.set(2.84, 0.16, 0.05);
  kub323.setRotation(0, 0, 0);
  const kub323MZ = kub323.clone();
  kub323MZ.updateMatrixWorld(true);
  kub323.position.set(0, 0, -2.36);
  kub323MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub323MZ.position.set(0, 0, 2.36);
  const kub323MrZ = new THREE.Group();
  kub323MrZ.add(kub323, kub323MZ);
  kub323MrZ.position.set(9.02, 1.58, 0);
  const kub324 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub324.scale.set(1.05, 0.16, 0.08);
  kub324.setRotation(0, 0, 0);
  const kub324MZ = kub324.clone();
  kub324MZ.updateMatrixWorld(true);
  kub324.position.set(0, 0, -2.39);
  kub324MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub324MZ.position.set(0, 0, 2.39);
  const kub324MrZ = new THREE.Group();
  kub324MrZ.add(kub324, kub324MZ);
  kub324MrZ.position.set(9.02, 0.77, 0);
  const kub325 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub325.scale.set(0.17, 0.22, 0.2);
  kub325.setRotation(0, 0, 0);
  const kub325MZ = kub325.clone();
  kub325MZ.updateMatrixWorld(true);
  kub325.position.set(0, 0, -1.76);
  kub325MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub325MZ.position.set(0, 0, 1.76);
  const kub325MrZ = new THREE.Group();
  kub325MrZ.add(kub325, kub325MZ);
  kub325MrZ.position.set(6.89, 0.77, 0);
  const kub326 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub326.scale.set(0.93, 0.05, 2.47);
  kub326.setRotation(1.57, 0, 0);
  const kub326MZ = kub326.clone();
  kub326MZ.updateMatrixWorld(true);
  kub326.position.set(0, 0, -2.42);
  kub326MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub326MZ.position.set(0, 0, 2.42);
  const kub326MrZ = new THREE.Group();
  kub326MrZ.add(kub326, kub326MZ);
  kub326MrZ.position.set(-11.7, 4.72, 0);
  const kub327 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub327.scale.set(0.84, 0.04, 0.91);
  kub327.setRotation(1.57, 1.57, 0);
  const kub327MZ = kub327.clone();
  kub327MZ.updateMatrixWorld(true);
  kub327.position.set(0, 0, -1.53);
  kub327MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub327MZ.position.set(0, 0, 1.53);
  const kub327MrZ = new THREE.Group();
  kub327MrZ.add(kub327, kub327MZ);
  kub327MrZ.position.set(-12.5, 3.15, 0);
  const cyl22 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl22.scale.set(0.31, 0.04, 0.31);
  cyl22.setRotation(0, 0, -1.57);
  const cyl22MZ = cyl22.clone();
  cyl22MZ.updateMatrixWorld(true);
  cyl22.position.set(0, 0, -1.53);
  cyl22MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl22MZ.position.set(0, 0, 1.53);
  const cyl22MrZ = new THREE.Group();
  cyl22MrZ.add(cyl22, cyl22MZ);
  cyl22MrZ.position.set(-12.6, 3.15, 0);
  const sph2 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
  sph2.scale.set(0.27, 0.08, 0.27);
  sph2.setRotation(0, 0, -1.57);
  const sph2MZ = sph2.clone();
  sph2MZ.updateMatrixWorld(true);
  sph2.position.set(0, 0, -1.53);
  sph2MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph2MZ.position.set(0, 0, 1.53);
  const sph2MrZ = new THREE.Group();
  sph2MrZ.add(sph2, sph2MZ);
  sph2MrZ.position.set(-12.6, 3.15, 0);
  const kub328 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub328.scale.set(0.13, 0.04, 0.91);
  kub328.setRotation(1.57, 1.57, 0);
  const kub328MZ = kub328.clone();
  kub328MZ.updateMatrixWorld(true);
  kub328.position.set(0, 0, -2.24);
  kub328MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub328MZ.position.set(0, 0, 2.24);
  const kub328MrZ = new THREE.Group();
  kub328MrZ.add(kub328, kub328MZ);
  kub328MrZ.position.set(-12.5, 4.96, 0);
  const kub329 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub329.scale.set(0.13, 0.04, 0.91);
  kub329.setRotation(1.57, 1.57, 0);
  const kub329MZ = kub329.clone();
  kub329MZ.updateMatrixWorld(true);
  kub329.position.set(0, 0, -0.81);
  kub329MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub329MZ.position.set(0, 0, 0.81);
  const kub329MrZ = new THREE.Group();
  kub329MrZ.add(kub329, kub329MZ);
  kub329MrZ.position.set(-12.5, 4.96, 0);
  const kub330 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub330.scale.set(0.84, 0.04, 0.68);
  kub330.setRotation(1.57, 1.57, 0);
  const kub330MZ = kub330.clone();
  kub330MZ.updateMatrixWorld(true);
  kub330.position.set(0, 0, -1.53);
  kub330MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub330MZ.position.set(0, 0, 1.53);
  const kub330MrZ = new THREE.Group();
  kub330MrZ.add(kub330, kub330MZ);
  kub330MrZ.position.set(-12.5, 6.51, 0);
  const kub331 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub331.position.set(-12.5, 3.15, 0);
  kub331.scale.set(0.71, 0.04, 0.91);
  kub331.setRotation(1.57, 1.57, 0);

  const kub332 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub332.position.set(-12.5, 4.98, -0.58);
  kub332.scale.set(0.13, 0.04, 0.92);
  kub332.setRotation(1.57, 1.57, 0);

  const kub333 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub333.position.set(-12.5, 6.5, 0);
  kub333.scale.set(0.71, 0.04, 0.69);
  kub333.setRotation(1.57, 1.57, 0);

  const kub334 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub334.scale.set(0.14, 0.03, 0.15);
  kub334.setRotation(1.57, 1.57, 0.79);
  const kub334MZ = kub334.clone();
  kub334MZ.updateMatrixWorld(true);
  kub334.position.set(0, 0, -0.93);
  kub334MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub334MZ.position.set(0, 0, 0.93);
  const kub334MrZ = new THREE.Group();
  kub334MrZ.add(kub334, kub334MZ);
  const kub334MrZMY = kub334MrZ.clone();
  kub334MrZMY.updateMatrixWorld(true);
  kub334MrZ.position.set(0, 4.05, 0);
  kub334MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub334MrZMY.position.set(0, 5.83, 0);
  const kub334MrZMrY = new THREE.Group();
  kub334MrZMrY.add(kub334MrZ, kub334MrZMY);
  kub334MrZMrY.position.set(-12.5, 0, 0);
  const kub335 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub335.scale.set(-0.02, 1, 0.71);
  kub335.setRotation(0, 0, 0);
  const kub335MZ = kub335.clone();
  kub335MZ.updateMatrixWorld(true);
  kub335.position.set(0, 0, -1.53);
  kub335MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub335MZ.position.set(0, 0, 1.53);
  const kub335MrZ = new THREE.Group();
  kub335MrZ.add(kub335, kub335MZ);
  kub335MrZ.position.set(-12.5, 4.94, 0);
  const kub336 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub336.scale.set(0.46, 0.03, 0.02);
  kub336.setRotation(1.57, 1.57, 0);
  const kub336MZ = kub336.clone();
  kub336MZ.updateMatrixWorld(true);
  kub336.position.set(0, 0, -1.53);
  kub336MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub336MZ.position.set(0, 0, 1.53);
  const kub336MrZ = new THREE.Group();
  kub336MrZ.add(kub336, kub336MZ);
  const kub336MrZMY = kub336MrZ.clone();
  kub336MrZMY.updateMatrixWorld(true);
  kub336MrZ.position.set(0, 4.06, 0);
  kub336MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub336MrZMY.position.set(0, 5.82, 0);
  const kub336MrZMrY = new THREE.Group();
  kub336MrZMrY.add(kub336MrZ, kub336MrZMY);
  kub336MrZMrY.position.set(-12.5, 0, 0);
  const kub337 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub337.scale.set(0.76, 0.03, 0.02);
  kub337.setRotation(3.14, 0, 1.57);
  const kub337MX = kub337.clone();
  kub337MX.updateMatrixWorld(true);
  kub337.position.set(-12.5, 0, 0);
  kub337MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub337MX.position.set(-12.5, 0, 0);
  const kub337MrX = new THREE.Group();
  kub337MrX.add(kub337, kub337MX);
  const kub337MrXMZ = kub337MrX.clone();
  kub337MrXMZ.updateMatrixWorld(true);
  kub337MrX.position.set(0, 0, -0.94);
  kub337MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub337MrXMZ.position.set(0, 0, 0.94);
  const kub337MrXMrZ = new THREE.Group();
  kub337MrXMrZ.add(kub337MrX, kub337MrXMZ);
  const kub337MrXMrZMY = kub337MrXMrZ.clone();
  kub337MrXMrZMY.updateMatrixWorld(true);
  kub337MrXMrZ.position.set(0, 4.94, 0);
  kub337MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub337MrXMrZMY.position.set(0, 4.94, 0);
  const kub337MrXMrZMrY = new THREE.Group();
  kub337MrXMrZMrY.add(kub337MrXMrZ, kub337MrXMrZMY);
  const kub338 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub338.position.set(-12.5, 4.94, 0);
  kub338.scale.set(-0.02, 0.96, 0.48);

  const kub339 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub339.scale.set(0.14, 0.03, 0.15);
  kub339.setRotation(1.57, 1.57, 0.79);
  const kub339MZ = kub339.clone();
  kub339MZ.updateMatrixWorld(true);
  kub339.position.set(0, 0, 0.45);
  kub339MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub339MZ.position.set(0, 0, -0.45);
  const kub339MrZ = new THREE.Group();
  kub339MrZ.add(kub339, kub339MZ);
  const kub339MrZMY = kub339MrZ.clone();
  kub339MrZMY.updateMatrixWorld(true);
  kub339MrZ.position.set(0, 4.07, 0);
  kub339MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub339MrZMY.position.set(0, 5.81, 0);
  const kub339MrZMrY = new THREE.Group();
  kub339MrZMrY.add(kub339MrZ, kub339MrZMY);
  kub339MrZMrY.position.set(-12.5, 0, 0);
  const kub340 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub340.scale.set(0.46, 0.03, 0.02);
  kub340.setRotation(1.57, 1.57, 0);
  const kub340MY = kub340.clone();
  kub340MY.updateMatrixWorld(true);
  kub340.position.set(0, 4.06, 0);
  kub340MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub340MY.position.set(0, 5.82, 0);
  const kub340MrY = new THREE.Group();
  kub340MrY.add(kub340, kub340MY);
  kub340MrY.position.set(-12.5, 0, 0);
  const kub341 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub341.scale.set(0.76, 0.03, 0.02);
  kub341.setRotation(3.14, 0, 1.57);
  const kub341MZ = kub341.clone();
  kub341MZ.updateMatrixWorld(true);
  kub341.position.set(0, 0, 0.46);
  kub341MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub341MZ.position.set(0, 0, -0.46);
  const kub341MrZ = new THREE.Group();
  kub341MrZ.add(kub341, kub341MZ);
  kub341MrZ.position.set(-12.5, 4.93, 0);
  const kub342 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub342.scale.set(0.76, 0.03, 0.02);
  kub342.setRotation(3.14, 0, 1.57);
  const kub342MX = kub342.clone();
  kub342MX.updateMatrixWorld(true);
  kub342.position.set(-12.5, 0, 0);
  kub342MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub342MX.position.set(-12.5, 0, 0);
  const kub342MrX = new THREE.Group();
  kub342MrX.add(kub342, kub342MX);
  const kub342MrXMZ = kub342MrX.clone();
  kub342MrXMZ.updateMatrixWorld(true);
  kub342MrX.position.set(0, 0, 2.12);
  kub342MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub342MrXMZ.position.set(0, 0, -2.12);
  const kub342MrXMrZ = new THREE.Group();
  kub342MrXMrZ.add(kub342MrX, kub342MrXMZ);
  const kub342MrXMrZMY = kub342MrXMrZ.clone();
  kub342MrXMrZMY.updateMatrixWorld(true);
  kub342MrXMrZ.position.set(0, 4.94, 0);
  kub342MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub342MrXMrZMY.position.set(0, 4.94, 0);
  const kub342MrXMrZMrY = new THREE.Group();
  kub342MrXMrZMrY.add(kub342MrXMrZ, kub342MrXMrZMY);
  const kub343 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub343.scale.set(0.14, 0.03, 0.15);
  kub343.setRotation(1.57, 1.57, 0.79);
  const kub343MZ = kub343.clone();
  kub343MZ.updateMatrixWorld(true);
  kub343.position.set(0, 0, 2.12);
  kub343MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub343MZ.position.set(0, 0, -2.12);
  const kub343MrZ = new THREE.Group();
  kub343MrZ.add(kub343, kub343MZ);
  const kub343MrZMY = kub343MrZ.clone();
  kub343MrZMY.updateMatrixWorld(true);
  kub343MrZ.position.set(0, 4.05, 0);
  kub343MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub343MrZMY.position.set(0, 5.83, 0);
  const kub343MrZMrY = new THREE.Group();
  kub343MrZMrY.add(kub343MrZ, kub343MrZMY);
  kub343MrZMrY.position.set(-12.5, 0, 0);
  const cyl23Gr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cyl23 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl23.scale.set(0.12, 0.36, 0.12);
    cyl23.position.set(0.49 * i, 0, 0);
    cyl23Gr.add(cyl23);
  }
  cyl23Gr.setRotation(0, 0, 0);
  const cyl23GroupMZ = cyl23Gr.clone();
  cyl23GroupMZ.updateMatrixWorld(true);
  cyl23Gr.position.set(0, 0, -2.1);
  cyl23GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl23GroupMZ.position.set(0, 0, 2.1);
  const cyl23GroupMrZ = new THREE.Group();
  cyl23GroupMrZ.add(cyl23Gr, cyl23GroupMZ);
  cyl23GroupMrZ.position.set(8.31, 1.06, 0);
  const kub344 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub344.scale.set(-0.93, 0.05, 2.47);
  kub344.setRotation(1.57, 0, 0);
  const kub344MZ = kub344.clone();
  kub344MZ.updateMatrixWorld(true);
  kub344.position.set(0, 0, -2.42);
  kub344MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub344MZ.position.set(0, 0, 2.42);
  const kub344MrZ = new THREE.Group();
  kub344MrZ.add(kub344, kub344MZ);
  kub344MrZ.position.set(11.7, 4.72, 0);
  const kub345 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub345.scale.set(0.84, -0.04, 0.91);
  kub345.setRotation(1.57, 1.57, 0);
  const kub345MZ = kub345.clone();
  kub345MZ.updateMatrixWorld(true);
  kub345.position.set(0, 0, -1.53);
  kub345MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub345MZ.position.set(0, 0, 1.53);
  const kub345MrZ = new THREE.Group();
  kub345MrZ.add(kub345, kub345MZ);
  kub345MrZ.position.set(12.5, 3.15, 0);
  const cyl24 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl24.scale.set(0.31, -0.04, 0.31);
  cyl24.setRotation(0, 0, -1.57);
  const cyl24MZ = cyl24.clone();
  cyl24MZ.updateMatrixWorld(true);
  cyl24.position.set(0, 0, -1.53);
  cyl24MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl24MZ.position.set(0, 0, 1.53);
  const cyl24MrZ = new THREE.Group();
  cyl24MrZ.add(cyl24, cyl24MZ);
  cyl24MrZ.position.set(12.6, 3.15, 0);
  const sph3 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
  sph3.scale.set(0.27, -0.08, 0.27);
  sph3.setRotation(0, 0, -1.57);
  const sph3MZ = sph3.clone();
  sph3MZ.updateMatrixWorld(true);
  sph3.position.set(0, 0, -1.53);
  sph3MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph3MZ.position.set(0, 0, 1.53);
  const sph3MrZ = new THREE.Group();
  sph3MrZ.add(sph3, sph3MZ);
  sph3MrZ.position.set(12.6, 3.15, 0);
  const kub346 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub346.scale.set(0.13, -0.04, 0.91);
  kub346.setRotation(1.57, 1.57, 0);
  const kub346MZ = kub346.clone();
  kub346MZ.updateMatrixWorld(true);
  kub346.position.set(0, 0, -2.24);
  kub346MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub346MZ.position.set(0, 0, 2.24);
  const kub346MrZ = new THREE.Group();
  kub346MrZ.add(kub346, kub346MZ);
  kub346MrZ.position.set(12.5, 4.96, 0);
  const kub347 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub347.scale.set(0.13, -0.04, 0.91);
  kub347.setRotation(1.57, 1.57, 0);
  const kub347MZ = kub347.clone();
  kub347MZ.updateMatrixWorld(true);
  kub347.position.set(0, 0, -0.81);
  kub347MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub347MZ.position.set(0, 0, 0.81);
  const kub347MrZ = new THREE.Group();
  kub347MrZ.add(kub347, kub347MZ);
  kub347MrZ.position.set(12.5, 4.96, 0);
  const kub348 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub348.scale.set(0.84, -0.04, 0.68);
  kub348.setRotation(1.57, 1.57, 0);
  const kub348MZ = kub348.clone();
  kub348MZ.updateMatrixWorld(true);
  kub348.position.set(0, 0, -1.53);
  kub348MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub348MZ.position.set(0, 0, 1.53);
  const kub348MrZ = new THREE.Group();
  kub348MrZ.add(kub348, kub348MZ);
  kub348MrZ.position.set(12.5, 6.51, 0);
  const kub349 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub349.position.set(12.5, 3.15, 0);
  kub349.scale.set(0.71, -0.04, 0.91);
  kub349.setRotation(1.57, 1.57, 0);

  const kub350 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub350.position.set(12.5, 6.5, 0);
  kub350.scale.set(0.71, -0.04, 0.69);
  kub350.setRotation(1.57, 1.57, 0);

  const kub351 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub351.scale.set(0.14, -0.03, 0.15);
  kub351.setRotation(1.57, 1.57, 0.79);
  const kub351MZ = kub351.clone();
  kub351MZ.updateMatrixWorld(true);
  kub351.position.set(0, 0, -0.93);
  kub351MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub351MZ.position.set(0, 0, 0.93);
  const kub351MrZ = new THREE.Group();
  kub351MrZ.add(kub351, kub351MZ);
  const kub351MrZMY = kub351MrZ.clone();
  kub351MrZMY.updateMatrixWorld(true);
  kub351MrZ.position.set(0, 4.05, 0);
  kub351MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub351MrZMY.position.set(0, 5.83, 0);
  const kub351MrZMrY = new THREE.Group();
  kub351MrZMrY.add(kub351MrZ, kub351MrZMY);
  kub351MrZMrY.position.set(12.5, 0, 0);
  const kub352 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub352.scale.set(0.02, 1, 0.71);
  kub352.setRotation(0, 0, 0);
  const kub352MZ = kub352.clone();
  kub352MZ.updateMatrixWorld(true);
  kub352.position.set(0, 0, -1.53);
  kub352MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub352MZ.position.set(0, 0, 1.53);
  const kub352MrZ = new THREE.Group();
  kub352MrZ.add(kub352, kub352MZ);
  kub352MrZ.position.set(12.5, 4.94, 0);
  const kub353 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub353.scale.set(0.46, -0.03, 0.02);
  kub353.setRotation(1.57, 1.57, 0);
  const kub353MZ = kub353.clone();
  kub353MZ.updateMatrixWorld(true);
  kub353.position.set(0, 0, -1.53);
  kub353MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub353MZ.position.set(0, 0, 1.53);
  const kub353MrZ = new THREE.Group();
  kub353MrZ.add(kub353, kub353MZ);
  const kub353MrZMY = kub353MrZ.clone();
  kub353MrZMY.updateMatrixWorld(true);
  kub353MrZ.position.set(0, 4.06, 0);
  kub353MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub353MrZMY.position.set(0, 5.82, 0);
  const kub353MrZMrY = new THREE.Group();
  kub353MrZMrY.add(kub353MrZ, kub353MrZMY);
  kub353MrZMrY.position.set(12.5, 0, 0);
  const kub354 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub354.scale.set(0.76, -0.03, 0.02);
  kub354.setRotation(3.14, 0, 1.57);
  const kub354MX = kub354.clone();
  kub354MX.updateMatrixWorld(true);
  kub354.position.set(12.5, 0, 0);
  kub354MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub354MX.position.set(12.5, 0, 0);
  const kub354MrX = new THREE.Group();
  kub354MrX.add(kub354, kub354MX);
  const kub354MrXMZ = kub354MrX.clone();
  kub354MrXMZ.updateMatrixWorld(true);
  kub354MrX.position.set(0, 0, -0.94);
  kub354MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub354MrXMZ.position.set(0, 0, 0.94);
  const kub354MrXMrZ = new THREE.Group();
  kub354MrXMrZ.add(kub354MrX, kub354MrXMZ);
  const kub354MrXMrZMY = kub354MrXMrZ.clone();
  kub354MrXMrZMY.updateMatrixWorld(true);
  kub354MrXMrZ.position.set(0, 4.94, 0);
  kub354MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub354MrXMrZMY.position.set(0, 4.94, 0);
  const kub354MrXMrZMrY = new THREE.Group();
  kub354MrXMrZMrY.add(kub354MrXMrZ, kub354MrXMrZMY);
  const kub355 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub355.position.set(12.5, 4.94, 0);
  kub355.scale.set(0.02, 0.96, 0.48);

  const kub356 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub356.scale.set(0.14, -0.03, 0.15);
  kub356.setRotation(1.57, 1.57, 0.79);
  const kub356MZ = kub356.clone();
  kub356MZ.updateMatrixWorld(true);
  kub356.position.set(0, 0, 0.45);
  kub356MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub356MZ.position.set(0, 0, -0.45);
  const kub356MrZ = new THREE.Group();
  kub356MrZ.add(kub356, kub356MZ);
  const kub356MrZMY = kub356MrZ.clone();
  kub356MrZMY.updateMatrixWorld(true);
  kub356MrZ.position.set(0, 4.07, 0);
  kub356MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub356MrZMY.position.set(0, 5.81, 0);
  const kub356MrZMrY = new THREE.Group();
  kub356MrZMrY.add(kub356MrZ, kub356MrZMY);
  kub356MrZMrY.position.set(12.5, 0, 0);
  const kub357 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub357.scale.set(0.46, -0.03, 0.02);
  kub357.setRotation(1.57, 1.57, 0);
  const kub357MY = kub357.clone();
  kub357MY.updateMatrixWorld(true);
  kub357.position.set(0, 4.06, 0);
  kub357MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub357MY.position.set(0, 5.82, 0);
  const kub357MrY = new THREE.Group();
  kub357MrY.add(kub357, kub357MY);
  kub357MrY.position.set(12.5, 0, 0);
  const kub358 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub358.scale.set(0.76, -0.03, 0.02);
  kub358.setRotation(3.14, 0, 1.57);
  const kub358MZ = kub358.clone();
  kub358MZ.updateMatrixWorld(true);
  kub358.position.set(0, 0, 0.46);
  kub358MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub358MZ.position.set(0, 0, -0.46);
  const kub358MrZ = new THREE.Group();
  kub358MrZ.add(kub358, kub358MZ);
  kub358MrZ.position.set(12.5, 4.93, 0);
  const kub359 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub359.scale.set(0.76, -0.03, 0.02);
  kub359.setRotation(3.14, 0, 1.57);
  const kub359MX = kub359.clone();
  kub359MX.updateMatrixWorld(true);
  kub359.position.set(12.5, 0, 0);
  kub359MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub359MX.position.set(12.5, 0, 0);
  const kub359MrX = new THREE.Group();
  kub359MrX.add(kub359, kub359MX);
  const kub359MrXMZ = kub359MrX.clone();
  kub359MrXMZ.updateMatrixWorld(true);
  kub359MrX.position.set(0, 0, 2.12);
  kub359MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub359MrXMZ.position.set(0, 0, -2.12);
  const kub359MrXMrZ = new THREE.Group();
  kub359MrXMrZ.add(kub359MrX, kub359MrXMZ);
  const kub359MrXMrZMY = kub359MrXMrZ.clone();
  kub359MrXMrZMY.updateMatrixWorld(true);
  kub359MrXMrZ.position.set(0, 4.94, 0);
  kub359MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub359MrXMrZMY.position.set(0, 4.94, 0);
  const kub359MrXMrZMrY = new THREE.Group();
  kub359MrXMrZMrY.add(kub359MrXMrZ, kub359MrXMrZMY);
  const kub360 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub360.scale.set(0.14, -0.03, 0.15);
  kub360.setRotation(1.57, 1.57, 0.79);
  const kub360MZ = kub360.clone();
  kub360MZ.updateMatrixWorld(true);
  kub360.position.set(0, 0, 2.12);
  kub360MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub360MZ.position.set(0, 0, -2.12);
  const kub360MrZ = new THREE.Group();
  kub360MrZ.add(kub360, kub360MZ);
  const kub360MrZMY = kub360MrZ.clone();
  kub360MrZMY.updateMatrixWorld(true);
  kub360MrZ.position.set(0, 4.05, 0);
  kub360MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub360MrZMY.position.set(0, 5.83, 0);
  const kub360MrZMrY = new THREE.Group();
  kub360MrZMrY.add(kub360MrZ, kub360MrZMY);
  kub360MrZMrY.position.set(12.5, 0, 0);
  const kub361 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub361.position.set(-0, 7.26, 0);
  kub361.scale.set(12.6, 0.07, 2.47);

  const kub362 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub362.position.set(-0, 7.4, 0);
  kub362.scale.set(12.2, 0.22, 1.44);

  const kub363 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub363.position.set(-12.1, 7.28, 0);
  kub363.scale.set(0.25, 0.22, 1.44);
  kub363.setRotation(0, 0, -0.79);

  const kub364 = new THREE.Mesh(boxGeo, Ceiling_trainMaterial);
  kub364.position.set(-0, 7.06, 0);
  kub364.scale.set(12.5, 0.12, 2.38);

  const kub365 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub365.position.set(-0, 2.2, 0);
  kub365.scale.set(12.5, 0.12, 2.38);

  const kub372 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub372.position.set(-12.5, 4.98, 0.58);
  kub372.scale.set(0.13, 0.04, 0.92);
  kub372.setRotation(1.57, 1.57, 0);

  const kub373 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub373.position.set(12.5, 4.98, 0.58);
  kub373.scale.set(0.13, 0.04, 0.92);
  kub373.setRotation(1.57, 1.57, 0);

  const kub374 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub374.position.set(12.5, 4.98, -0.58);
  kub374.scale.set(0.13, 0.04, 0.92);
  kub374.setRotation(1.57, 1.57, 0);

  const kub409Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub409 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub409.scale.set(2.11, 0.05, 0.89);
    kub409.position.set(6.42 * i, 0, 0);
    kub409Gr.add(kub409);
  }
  kub409Gr.setRotation(1.57, 0, 0);
  kub409Gr.position.set(-6.42, 3.13, 2.42);
  const kub410Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub410 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub410.scale.set(2.11, 0.05, 0.7);
    kub410.position.set(6.42 * i, 0, 0);
    kub410Gr.add(kub410);
  }
  kub410Gr.setRotation(1.57, 0, 0);
  kub410Gr.position.set(-6.42, 6.24, 2.42);
  const kub411 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub411.position.set(-0, 7.06, -2.42);
  kub411.scale.set(10.7, 0.05, 0.12);
  kub411.setRotation(1.57, 0, 0);

  const kub412Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub412 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub412.scale.set(0.57, 0.05, 0.76);
    kub412.position.set(6.42 * i, 0, 0);
    kub412Gr.add(kub412);
  }
  kub412Gr.setRotation(1.57, 0, 0);
  kub412Gr.position.set(-7.96, 4.78, 2.42);
  const kub413Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub413 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub413.scale.set(0.57, 0.05, 0.76);
    kub413.position.set(6.42 * i, 0, 0);
    kub413Gr.add(kub413);
  }
  kub413Gr.setRotation(1.57, 0, 0);
  kub413Gr.position.set(-4.88, 4.78, 2.42);
  const kub414Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub414 = new THREE.Mesh(boxGeo, GlassMaterial);
    kub414.scale.set(-0.02, 0.79, 1.01);
    kub414.position.set(0, 0, 6.42 * i);
    kub414Gr.add(kub414);
  }
  kub414Gr.setRotation(0, 1.57, 0);
  kub414Gr.position.set(-6.42, 4.78, 2.42);
  const kub415Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub415 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub415.scale.set(0.93, 0.03, 0.02);
    kub415.position.set(-6.43 * i, 0, 0);
    kub415Gr.add(kub415);
  }
  kub415Gr.setRotation(1.57, 3.14, 0);
  const kub415GroupMY = kub415Gr.clone();
  kub415GroupMY.updateMatrixWorld(true);
  kub415Gr.position.set(0, 4.02, 0);
  kub415GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub415GroupMY.position.set(0, 5.58, 0);
  const kub415GroupMrY = new THREE.Group();
  kub415GroupMrY.add(kub415Gr, kub415GroupMY);
  kub415GroupMrY.position.set(-6.42, 0, 2.42);
  const kub416Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub416 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub416.scale.set(0.13, 0.03, 0.13);
    kub416.position.set(-4.55 * i, 0, -4.53 * i);
    kub416Gr.add(kub416);
  }
  kub416Gr.setRotation(1.57, 3.14, 0.79);
  const kub416GroupMY = kub416Gr.clone();
  kub416GroupMY.updateMatrixWorld(true);
  kub416Gr.position.set(0, 4.01, 0);
  kub416GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub416GroupMY.position.set(0, 5.54, 0);
  const kub416GroupMrY = new THREE.Group();
  kub416GroupMrY.add(kub416Gr, kub416GroupMY);
  kub416GroupMrY.position.set(-7.39, 0, 2.42);
  const kub417Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub417 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub417.scale.set(0.13, 0.03, 0.13);
    kub417.position.set(-4.55 * i, 0, -4.53 * i);
    kub417Gr.add(kub417);
  }
  kub417Gr.setRotation(1.57, 3.14, 0.79);
  const kub417GroupMY = kub417Gr.clone();
  kub417GroupMY.updateMatrixWorld(true);
  kub417Gr.position.set(0, 3.98, 0);
  kub417GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub417GroupMY.position.set(0, 5.58, 0);
  const kub417GroupMrY = new THREE.Group();
  kub417GroupMrY.add(kub417Gr, kub417GroupMY);
  kub417GroupMrY.position.set(-5.44, 0, 2.42);
  const kub418Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub418 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub418.scale.set(0.73, 0.03, 0.02);
    kub418.position.set(0, 0, -6.42 * i);
    kub418Gr.add(kub418);
  }
  kub418Gr.setRotation(4.71, 0, 1.57);
  kub418Gr.position.set(-7.39, 4.8, 2.42);
  const kub419Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub419 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub419.scale.set(0.73, 0.03, 0.02);
    kub419.position.set(0, 0, -6.42 * i);
    kub419Gr.add(kub419);
  }
  kub419Gr.setRotation(4.71, 0, 1.57);
  kub419Gr.position.set(-5.45, 4.8, 2.42);
  const kub420Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub420 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub420.scale.set(2.11, 0.05, 0.89);
    kub420.position.set(6.42 * i, 0, 0);
    kub420Gr.add(kub420);
  }
  kub420Gr.setRotation(1.57, 0, 0);
  kub420Gr.position.set(-6.42, 3.13, -2.42);
  const kub421Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub421 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub421.scale.set(2.11, 0.05, 0.7);
    kub421.position.set(6.42 * i, 0, 0);
    kub421Gr.add(kub421);
  }
  kub421Gr.setRotation(1.57, 0, 0);
  kub421Gr.position.set(-6.42, 6.24, -2.42);
  const kub422Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub422 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub422.scale.set(0.57, 0.05, 0.76);
    kub422.position.set(6.42 * i, 0, 0);
    kub422Gr.add(kub422);
  }
  kub422Gr.setRotation(1.57, 0, 0);
  kub422Gr.position.set(-7.96, 4.78, -2.42);
  const kub423Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub423 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub423.scale.set(0.57, 0.05, 0.76);
    kub423.position.set(6.42 * i, 0, 0);
    kub423Gr.add(kub423);
  }
  kub423Gr.setRotation(1.57, 0, 0);
  kub423Gr.position.set(-4.88, 4.78, -2.42);
  const kub424Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub424 = new THREE.Mesh(boxGeo, GlassMaterial);
    kub424.scale.set(-0.02, 0.79, 1.01);
    kub424.position.set(0, 0, 6.42 * i);
    kub424Gr.add(kub424);
  }
  kub424Gr.setRotation(0, 1.57, 0);
  kub424Gr.position.set(-6.42, 4.78, -2.42);
  const kub425Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub425 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub425.scale.set(0.93, 0.03, 0.02);
    kub425.position.set(-6.43 * i, 0, 0);
    kub425Gr.add(kub425);
  }
  kub425Gr.setRotation(1.57, 3.14, 0);
  const kub425GroupMY = kub425Gr.clone();
  kub425GroupMY.updateMatrixWorld(true);
  kub425Gr.position.set(0, 4.02, 0);
  kub425GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub425GroupMY.position.set(0, 5.58, 0);
  const kub425GroupMrY = new THREE.Group();
  kub425GroupMrY.add(kub425Gr, kub425GroupMY);
  kub425GroupMrY.position.set(-6.42, 0, -2.42);
  const kub426Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub426 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub426.scale.set(0.13, 0.03, 0.13);
    kub426.position.set(-4.55 * i, 0, -4.53 * i);
    kub426Gr.add(kub426);
  }
  kub426Gr.setRotation(1.57, 3.14, 0.79);
  const kub426GroupMY = kub426Gr.clone();
  kub426GroupMY.updateMatrixWorld(true);
  kub426Gr.position.set(0, 4.01, 0);
  kub426GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub426GroupMY.position.set(0, 5.54, 0);
  const kub426GroupMrY = new THREE.Group();
  kub426GroupMrY.add(kub426Gr, kub426GroupMY);
  kub426GroupMrY.position.set(-7.39, 0, -2.42);
  const kub427Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub427 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub427.scale.set(0.13, 0.03, 0.13);
    kub427.position.set(-4.55 * i, 0, -4.53 * i);
    kub427Gr.add(kub427);
  }
  kub427Gr.setRotation(1.57, 3.14, 0.79);
  const kub427GroupMY = kub427Gr.clone();
  kub427GroupMY.updateMatrixWorld(true);
  kub427Gr.position.set(0, 3.98, 0);
  kub427GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub427GroupMY.position.set(0, 5.58, 0);
  const kub427GroupMrY = new THREE.Group();
  kub427GroupMrY.add(kub427Gr, kub427GroupMY);
  kub427GroupMrY.position.set(-5.44, 0, -2.42);
  const kub428Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub428 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub428.scale.set(0.73, 0.03, 0.02);
    kub428.position.set(0, 0, -6.42 * i);
    kub428Gr.add(kub428);
  }
  kub428Gr.setRotation(4.71, 0, 1.57);
  kub428Gr.position.set(-7.39, 4.8, -2.42);
  const kub429Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub429 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub429.scale.set(0.73, 0.03, 0.02);
    kub429.position.set(0, 0, -6.42 * i);
    kub429Gr.add(kub429);
  }
  kub429Gr.setRotation(4.71, 0, 1.57);
  kub429Gr.position.set(-5.45, 4.8, -2.42);
  const kub430 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub430.position.set(-0, 7.06, 2.41);
  kub430.scale.set(10.7, 0.05, 0.12);
  kub430.setRotation(1.57, 0, 0);

  const kub431Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub431 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub431.scale.set(2.14, 0.02, 0.17);
    kub431.position.set(6.42 * i, 0, 0);
    kub431Gr.add(kub431);
  }
  kub431Gr.setRotation(1.57, 0, 0);
  kub431Gr.position.set(-6.42, 3.8, -2.47);
  const kub432Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub432 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub432.scale.set(0.95, 0.02, 0.17);
    kub432.position.set(23.3 * i, 0, 0);
    kub432Gr.add(kub432);
  }
  kub432Gr.setRotation(1.57, 0, 0);
  kub432Gr.position.set(-11.7, 3.8, -2.47);
  const kub433Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub433 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub433.scale.set(0.91, 0.02, 0.17);
    kub433.position.set(0, 25.2 * i, 0);
    kub433Gr.add(kub433);
  }
  kub433Gr.setRotation(1.57, 1.57, 0);
  kub433Gr.position.set(-12.6, 3.8, -1.58);
  const kub442Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub442 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub442.scale.set(0.03, 0.04, 2.06);
    kub442.position.set(0, 0, -6.42 * i);
    kub442Gr.add(kub442);
  }
  kub442Gr.setRotation(0, -1.57, 0.79);
  kub442Gr.position.set(-6.42, 3.47, -2.45);
  const kub443Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub443 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub443.scale.set(0.03, 0.04, 2.06);
    kub443.position.set(0, 0, -6.42 * i);
    kub443Gr.add(kub443);
  }
  kub443Gr.setRotation(0, -1.57, 0.79);
  kub443Gr.position.set(-6.42, 2.96, -2.45);
  const kub444Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub444 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub444.scale.set(0.03, 0.04, 2.06);
    kub444.position.set(0, 0, -6.42 * i);
    kub444Gr.add(kub444);
  }
  kub444Gr.setRotation(0, -1.57, 0.79);
  kub444Gr.position.set(-6.42, 2.46, -2.45);
  const kub445Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub445 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub445.scale.set(0.03, 0.04, 2.06);
    kub445.position.set(0, 0, -6.42 * i);
    kub445Gr.add(kub445);
  }
  kub445Gr.setRotation(0, -1.57, 0.79);
  kub445Gr.position.set(-6.42, 6.56, -2.45);
  const kub446Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub446 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub446.scale.set(0.03, 0.04, 2.06);
    kub446.position.set(0, 0, -6.42 * i);
    kub446Gr.add(kub446);
  }
  kub446Gr.setRotation(0, -1.57, 0.79);
  kub446Gr.position.set(-6.42, 6.05, -2.45);
  const kub447Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub447 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub447.scale.set(0.03, 0.04, 0.53);
    kub447.position.set(0, 0, -6.42 * i);
    kub447Gr.add(kub447);
  }
  kub447Gr.setRotation(0, -1.57, 0.79);
  kub447Gr.position.set(-4.88, 5.03, -2.45);
  const kub448Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub448 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub448.scale.set(0.03, 0.04, 0.53);
    kub448.position.set(0, 0, -6.42 * i);
    kub448Gr.add(kub448);
  }
  kub448Gr.setRotation(0, -1.57, 0.79);
  kub448Gr.position.set(-4.88, 4.52, -2.45);
  const kub449Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub449 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub449.scale.set(0.03, 0.04, 0.53);
    kub449.position.set(0, 0, -6.42 * i);
    kub449Gr.add(kub449);
  }
  kub449Gr.setRotation(0, -1.57, 0.79);
  kub449Gr.position.set(-7.96, 5.03, -2.45);
  const kub450Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub450 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub450.scale.set(0.03, 0.04, 0.53);
    kub450.position.set(0, 0, -6.42 * i);
    kub450Gr.add(kub450);
  }
  kub450Gr.setRotation(0, -1.57, 0.79);
  kub450Gr.position.set(-7.96, 4.52, -2.45);
  const kub451Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub451 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub451.scale.set(0.03, 0.04, 0.85);
    kub451.position.set(0, 0, -23.3 * i);
    kub451Gr.add(kub451);
  }
  kub451Gr.setRotation(0, -1.57, 0.79);
  kub451Gr.position.set(-11.7, 5.23, -2.46);
  const kub452Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub452 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub452.scale.set(0.03, 0.04, 0.85);
    kub452.position.set(0, 0, -23.3 * i);
    kub452Gr.add(kub452);
  }
  kub452Gr.setRotation(0, -1.57, 0.79);
  kub452Gr.position.set(-11.7, 4.72, -2.46);
  const kub453Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub453 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub453.scale.set(0.03, 0.04, 0.85);
    kub453.position.set(0, 0, -23.3 * i);
    kub453Gr.add(kub453);
  }
  kub453Gr.setRotation(0, -1.57, 0.79);
  kub453Gr.position.set(-11.7, 4.21, -2.46);
  const kub454Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub454 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub454.scale.set(0.03, 0.04, 0.85);
    kub454.position.set(0, 0, -23.3 * i);
    kub454Gr.add(kub454);
  }
  kub454Gr.setRotation(0, -1.57, 0.79);
  kub454Gr.position.set(-11.7, 6.72, -2.46);
  const kub455Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub455 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub455.scale.set(0.03, 0.04, 0.85);
    kub455.position.set(0, 0, -23.3 * i);
    kub455Gr.add(kub455);
  }
  kub455Gr.setRotation(0, -1.57, 0.79);
  kub455Gr.position.set(-11.7, 6.21, -2.46);
  const kub456Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub456 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub456.scale.set(0.03, 0.04, 0.85);
    kub456.position.set(0, 0, -23.3 * i);
    kub456Gr.add(kub456);
  }
  kub456Gr.setRotation(0, -1.57, 0.79);
  kub456Gr.position.set(-11.7, 5.7, -2.46);
  const kub457Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub457 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub457.scale.set(0.03, 0.04, 0.85);
    kub457.position.set(0, 0, -23.3 * i);
    kub457Gr.add(kub457);
  }
  kub457Gr.setRotation(0, -1.57, 0.79);
  kub457Gr.position.set(-11.7, 3.28, -2.46);
  const kub458Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub458 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub458.scale.set(0.03, 0.04, 0.85);
    kub458.position.set(0, 0, -23.3 * i);
    kub458Gr.add(kub458);
  }
  kub458Gr.setRotation(0, -1.57, 0.79);
  kub458Gr.position.set(-11.7, 2.77, -2.46);
  const kub459Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub459 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub459.scale.set(0.03, 0.04, 0.85);
    kub459.position.set(0, 0, -23.3 * i);
    kub459Gr.add(kub459);
  }
  kub459Gr.setRotation(0, -1.57, 0.79);
  kub459Gr.position.set(-11.7, 2.27, -2.46);
  const kub460Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub460 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub460.scale.set(1, 0.41, 0.53);
    kub460.position.set(-2.2 * i, 0, 0);
    kub460Gr.add(kub460);
  }
  kub460Gr.position.set(4.73, 1.27, -1.87);
  const kub461Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub461 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub461.scale.set(1, 0.41, 0.53);
    kub461.position.set(-2.2 * i, 0, 0);
    kub461Gr.add(kub461);
  }
  kub461Gr.position.set(4.73, 1.27, 1.87);
  const kub462Gr = new THREE.Group();
  for (let i = 0; i < 31; i++) {
    const kub462 = new THREE.Mesh(boxGeo, Train_blueMaterial);
    kub462.scale.set(0.11, 0.17, 0.28);
    kub462.position.set(0.79 * i, 0, 0);
    kub462Gr.add(kub462);
  }
  kub462Gr.setRotation(-0.58, 0, 0);
  const kub462GroupMZ = kub462Gr.clone();
  kub462GroupMZ.updateMatrixWorld(true);
  kub462Gr.position.set(0, 0, -1.58);
  kub462GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub462GroupMZ.position.set(0, 0, 1.58);
  const kub462GroupMrZ = new THREE.Group();
  kub462GroupMrZ.add(kub462Gr, kub462GroupMZ);
  kub462GroupMrZ.position.set(-11.6, 7.32, 0);
  const kub463 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub463.position.set(12.2, 7.28, 0);
  kub463.scale.set(-0.25, -0.22, 1.44);
  kub463.setRotation(0, 0, -0.79);

  const kub464Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub464 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub464.scale.set(2.14, -0.02, 0.17);
    kub464.position.set(6.42 * i, 0, 0);
    kub464Gr.add(kub464);
  }
  kub464Gr.setRotation(1.57, 0, 0);
  kub464Gr.position.set(-6.42, 3.8, 2.47);
  const kub465Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub465 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub465.scale.set(0.95, -0.02, 0.17);
    kub465.position.set(23.3 * i, 0, 0);
    kub465Gr.add(kub465);
  }
  kub465Gr.setRotation(1.57, 0, 0);
  kub465Gr.position.set(-11.7, 3.8, 2.47);
  const kub466Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub466 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub466.scale.set(-0.91, 0.02, 0.17);
    kub466.position.set(0, 25.2 * i, 0);
    kub466Gr.add(kub466);
  }
  kub466Gr.setRotation(1.57, 1.57, 0);
  kub466Gr.position.set(-12.6, 3.8, 1.58);
  const kub475Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub475 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub475.scale.set(-0.03, -0.04, 2.06);
    kub475.position.set(0, 0, -6.42 * i);
    kub475Gr.add(kub475);
  }
  kub475Gr.setRotation(0, -1.57, 0.79);
  kub475Gr.position.set(-6.42, 3.47, 2.45);
  const kub476Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub476 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub476.scale.set(-0.03, -0.04, 2.06);
    kub476.position.set(0, 0, -6.42 * i);
    kub476Gr.add(kub476);
  }
  kub476Gr.setRotation(0, -1.57, 0.79);
  kub476Gr.position.set(-6.42, 2.96, 2.45);
  const kub477Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub477 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub477.scale.set(-0.03, -0.04, 2.06);
    kub477.position.set(0, 0, -6.42 * i);
    kub477Gr.add(kub477);
  }
  kub477Gr.setRotation(0, -1.57, 0.79);
  kub477Gr.position.set(-6.42, 2.46, 2.45);
  const kub478Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub478 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub478.scale.set(-0.03, -0.04, 2.06);
    kub478.position.set(0, 0, -6.42 * i);
    kub478Gr.add(kub478);
  }
  kub478Gr.setRotation(0, -1.57, 0.79);
  kub478Gr.position.set(-6.42, 6.56, 2.45);
  const kub479Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub479 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub479.scale.set(-0.03, -0.04, 2.06);
    kub479.position.set(0, 0, -6.42 * i);
    kub479Gr.add(kub479);
  }
  kub479Gr.setRotation(0, -1.57, 0.79);
  kub479Gr.position.set(-6.42, 6.05, 2.45);
  const kub480Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub480 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub480.scale.set(-0.03, -0.04, 0.53);
    kub480.position.set(0, 0, -6.42 * i);
    kub480Gr.add(kub480);
  }
  kub480Gr.setRotation(0, -1.57, 0.79);
  kub480Gr.position.set(-4.88, 5.03, 2.46);
  const kub481Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub481 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub481.scale.set(-0.03, -0.04, 0.53);
    kub481.position.set(0, 0, -6.42 * i);
    kub481Gr.add(kub481);
  }
  kub481Gr.setRotation(0, -1.57, 0.79);
  kub481Gr.position.set(-4.88, 4.52, 2.46);
  const kub482Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub482 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub482.scale.set(-0.03, -0.04, 0.53);
    kub482.position.set(0, 0, -6.42 * i);
    kub482Gr.add(kub482);
  }
  kub482Gr.setRotation(0, -1.57, 0.79);
  kub482Gr.position.set(-7.96, 5.03, 2.46);
  const kub483Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub483 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub483.scale.set(-0.03, -0.04, 0.53);
    kub483.position.set(0, 0, -6.42 * i);
    kub483Gr.add(kub483);
  }
  kub483Gr.setRotation(0, -1.57, 0.79);
  kub483Gr.position.set(-7.96, 4.52, 2.46);
  const kub484Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub484 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub484.scale.set(-0.03, -0.04, 0.85);
    kub484.position.set(0, 0, -23.3 * i);
    kub484Gr.add(kub484);
  }
  kub484Gr.setRotation(0, -1.57, 0.79);
  kub484Gr.position.set(-11.7, 5.23, 2.47);
  const kub485Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub485 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub485.scale.set(-0.03, -0.04, 0.85);
    kub485.position.set(0, 0, -23.3 * i);
    kub485Gr.add(kub485);
  }
  kub485Gr.setRotation(0, -1.57, 0.79);
  kub485Gr.position.set(-11.7, 4.72, 2.47);
  const kub486Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub486 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub486.scale.set(-0.03, -0.04, 0.85);
    kub486.position.set(0, 0, -23.3 * i);
    kub486Gr.add(kub486);
  }
  kub486Gr.setRotation(0, -1.57, 0.79);
  kub486Gr.position.set(-11.7, 4.21, 2.47);
  const kub487Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub487 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub487.scale.set(-0.03, -0.04, 0.85);
    kub487.position.set(0, 0, -23.3 * i);
    kub487Gr.add(kub487);
  }
  kub487Gr.setRotation(0, -1.57, 0.79);
  kub487Gr.position.set(-11.7, 6.72, 2.47);
  const kub488Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub488 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub488.scale.set(-0.03, -0.04, 0.85);
    kub488.position.set(0, 0, -23.3 * i);
    kub488Gr.add(kub488);
  }
  kub488Gr.setRotation(0, -1.57, 0.79);
  kub488Gr.position.set(-11.7, 6.21, 2.47);
  const kub489Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub489 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub489.scale.set(-0.03, -0.04, 0.85);
    kub489.position.set(0, 0, -23.3 * i);
    kub489Gr.add(kub489);
  }
  kub489Gr.setRotation(0, -1.57, 0.79);
  kub489Gr.position.set(-11.7, 5.7, 2.47);
  const kub490Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub490 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub490.scale.set(-0.03, -0.04, 0.85);
    kub490.position.set(0, 0, -23.3 * i);
    kub490Gr.add(kub490);
  }
  kub490Gr.setRotation(0, -1.57, 0.79);
  kub490Gr.position.set(-11.7, 3.28, 2.47);
  const kub491Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub491 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub491.scale.set(-0.03, -0.04, 0.85);
    kub491.position.set(0, 0, -23.3 * i);
    kub491Gr.add(kub491);
  }
  kub491Gr.setRotation(0, -1.57, 0.79);
  kub491Gr.position.set(-11.7, 2.77, 2.47);
  const kub492Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub492 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub492.scale.set(-0.03, -0.04, 0.85);
    kub492.position.set(0, 0, -23.3 * i);
    kub492Gr.add(kub492);
  }
  kub492Gr.setRotation(0, -1.57, 0.79);
  kub492Gr.position.set(-11.7, 2.27, 2.47);
  const kub493 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub493.scale.set(0.05, 0.02, 0.02);
  kub493.setRotation(0, 0, 0);
  const kub493MZ = kub493.clone();
  kub493MZ.updateMatrixWorld(true);
  kub493.position.set(0, 0, -0.81);
  kub493MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub493MZ.position.set(0, 0, -0.81);
  const kub493MrZ = new THREE.Group();
  kub493MrZ.add(kub493, kub493MZ);
  kub493MrZ.position.set(-12.6, 4.08, 0);
  const cyl25 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl25.position.set(-12.7, 4.96, -0.81);
  cyl25.scale.set(0.02, 0.87, 0.02);

  const kub494 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub494.scale.set(0.05, 0.02, 0.02);
  kub494.setRotation(0, 0, 0);
  const kub494MZ = kub494.clone();
  kub494MZ.updateMatrixWorld(true);
  kub494.position.set(0, 0, 0.81);
  kub494MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub494MZ.position.set(0, 0, -2.44);
  const kub494MrZ = new THREE.Group();
  kub494MrZ.add(kub494, kub494MZ);
  kub494MrZ.position.set(-12.6, 4.08, 0);
  const cyl26 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl26.position.set(-12.7, 4.96, 0.81);
  cyl26.scale.set(0.02, 0.87, 0.02);

  const kub495 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub495.scale.set(-0.05, 0.02, 0.02);
  kub495.setRotation(0, 0, 0);
  const kub495MZ = kub495.clone();
  kub495MZ.updateMatrixWorld(true);
  kub495.position.set(0, 0, -0.81);
  kub495MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub495MZ.position.set(0, 0, -0.81);
  const kub495MrZ = new THREE.Group();
  kub495MrZ.add(kub495, kub495MZ);
  kub495MrZ.position.set(12.6, 4.08, 0);
  const cyl27 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl27.position.set(12.7, 4.96, -0.81);
  cyl27.scale.set(-0.02, 0.87, 0.02);

  const kub496 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub496.scale.set(-0.05, 0.02, 0.02);
  kub496.setRotation(0, 0, 0);
  const kub496MZ = kub496.clone();
  kub496MZ.updateMatrixWorld(true);
  kub496.position.set(0, 0, 0.81);
  kub496MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub496MZ.position.set(0, 0, -2.44);
  const kub496MrZ = new THREE.Group();
  kub496MrZ.add(kub496, kub496MZ);
  kub496MrZ.position.set(12.6, 4.08, 0);
  const cyl28 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl28.position.set(12.7, 4.96, 0.81);
  cyl28.scale.set(-0.02, 0.87, 0.02);

  const kub497 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub497.position.set(-0, 2.2, 0);
  kub497.scale.set(12.5, 0.12, 2.38);

  const kub533Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub533 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub533.scale.set(2.11, 0.05, 0.89);
    kub533.position.set(6.42 * i, 0, 0);
    kub533Gr.add(kub533);
  }
  kub533Gr.setRotation(1.57, 0, 0);
  kub533Gr.position.set(-6.42, 3.13, 2.42);
  const kub542Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub542 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub542.scale.set(2.14, -0.02, 0.17);
    kub542.position.set(6.42 * i, 0, 0);
    kub542Gr.add(kub542);
  }
  kub542Gr.setRotation(1.57, 0, 0);
  kub542Gr.position.set(-6.42, 3.8, 2.47);
  const DrawTrainDoorFunctionEntityGr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.42 * i, 0, 0);
    DrawTrainDoorFunctionEntityGr.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGr.setRotation(0, 0, 0);

  const DrawTrainDoorFunctionEntityGroupMZ = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.42 * i, 0, 0);
    DrawTrainDoorFunctionEntityGroupMZ.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGroupMZ.updateMatrixWorld(true);

  DrawTrainDoorFunctionEntityGr.position.set(0, 0, -2.4);
  DrawTrainDoorFunctionEntityGroupMZ.applyMatrix(
    new THREE.Matrix4().makeScale(1, 1, -1),
  );
  DrawTrainDoorFunctionEntityGroupMZ.position.set(0, 0, 2.4);

  const DrawTrainDoorFunctionEntityGroupMrZ = new THREE.Group();
  DrawTrainDoorFunctionEntityGroupMrZ.add(
    DrawTrainDoorFunctionEntityGr,
    DrawTrainDoorFunctionEntityGroupMZ,
  );
  DrawTrainDoorFunctionEntityGroupMrZ.position.set(-9.62, 2.25, 0);

  const Decor = DrawVagonDecorations();
  const out = new THREE.Group();
  out.add(
    Decor,
    cylwheel_8MrZ,
    cylwheel_9MrZ,
    cylwheel_10MrZ,
    cylwheel_11MrZ,
    kub307,
    kub308MrZ,
    kub309MrZ,
    kub310MrZ,
    cyl21GroupMrZ,
    kub311MrZ,
    kub312MrZ,
    kub313MrZ,
    kub314MrZ,
    kub315MrZ,
    kub316MrZ,
    cylwheel_12MrZ,
    cylwheel_13MrZ,
    cylwheel_14MrZ,
    cylwheel_15MrZ,
    kub317MrZ,
    kub318MrZ,
    kub319MrZ,
    kub320MrZ,
    kub321MrZ,
    kub322MrZ,
    kub323MrZ,
    kub324MrZ,
    kub325MrZ,
    kub326MrZ,
    kub327MrZ,
    cyl22MrZ,
    sph2MrZ,
    kub328MrZ,
    kub329MrZ,
    kub330MrZ,
    kub331,
    kub332,
    kub333,
    kub334MrZMrY,
    kub335MrZ,
    kub336MrZMrY,
    kub337MrXMrZMrY,
    kub338,
    kub339MrZMrY,
    kub340MrY,
    kub341MrZ,
    kub342MrXMrZMrY,
    kub343MrZMrY,
    cyl23GroupMrZ,
    kub344MrZ,
    kub345MrZ,
    cyl24MrZ,
    sph3MrZ,
    kub346MrZ,
    kub347MrZ,
    kub348MrZ,
    kub349,
    kub350,
    kub351MrZMrY,
    kub352MrZ,
    kub353MrZMrY,
    kub354MrXMrZMrY,
    kub355,
    kub356MrZMrY,
    kub357MrY,
    kub358MrZ,
    kub359MrXMrZMrY,
    kub360MrZMrY,
    kub361,
    kub362,
    kub363,
    kub364,
    kub365,
    kub372,
    kub373,
    kub374,
    kub409Gr,
    kub410Gr,
    kub411,
    kub412Gr,
    kub413Gr,
    kub414Gr,
    kub415GroupMrY,
    kub416GroupMrY,
    kub417GroupMrY,
    kub418Gr,
    kub419Gr,
    kub420Gr,
    kub421Gr,
    kub422Gr,
    kub423Gr,
    kub424Gr,
    kub425GroupMrY,
    kub426GroupMrY,
    kub427GroupMrY,
    kub428Gr,
    kub429Gr,
    kub430,
    kub431Gr,
    kub432Gr,
    kub433Gr,
    kub442Gr,
    kub443Gr,
    kub444Gr,
    kub445Gr,
    kub446Gr,
    kub447Gr,
    kub448Gr,
    kub449Gr,
    kub450Gr,
    kub451Gr,
    kub452Gr,
    kub453Gr,
    kub454Gr,
    kub455Gr,
    kub456Gr,
    kub457Gr,
    kub458Gr,
    kub459Gr,
    kub460Gr,
    kub461Gr,
    kub462GroupMrZ,
    kub463,
    kub464Gr,
    kub465Gr,
    kub466Gr,
    kub475Gr,
    kub476Gr,
    kub477Gr,
    kub478Gr,
    kub479Gr,
    kub480Gr,
    kub481Gr,
    kub482Gr,
    kub483Gr,
    kub484Gr,
    kub485Gr,
    kub486Gr,
    kub487Gr,
    kub488Gr,
    kub489Gr,
    kub490Gr,
    kub491Gr,
    kub492Gr,
    kub493MrZ,
    cyl25,
    kub494MrZ,
    cyl26,
    kub495MrZ,
    cyl27,
    kub496MrZ,
    cyl28,
    kub497,
    kub533Gr,
    kub542Gr,
    DrawTrainDoorFunctionEntityGroupMrZ,
  );

  return out;
}

function DrawRightDoorFunction() {
  const Train_blue_3Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.03, 0.1, 0.65),
    roughness: 0.5,
  });
  const Glass_3Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.22, 0.24, 0.33),
    transparent: true,
    opacity: 0.32,
    roughness: 0.5,
  });
  const Coloumn_3Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0, 0, 0),
    roughness: 0.5,
  });
  const WhiteDots_3Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
  });
  const Metal_3Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.48, 0.48),
    metalness: 1,
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);

  const kub642 = new THREE.Mesh(boxGeo, Train_blue_3Material);
  kub642.position.set(-0.55, 0.87, -0.01);
  kub642.scale.set(0.55, 0.04, 0.86);
  kub642.setRotation(1.57, 3.14, 0);

  const kub643 = new THREE.Mesh(boxGeo, Glass_3Material);
  kub643.position.set(-0.55, 2.56, -0.01);
  kub643.scale.set(-0.02, 0.92, 0.37);
  kub643.setRotation(0, 1.57, 0);

  const kub644 = new THREE.Mesh(boxGeo, Coloumn_3Material);
  kub644.scale.set(0.13, 0.03, 0.13);
  kub644.setRotation(1.57, 3.14, 0.79);
  const kub644MY = kub644.clone();
  kub644MY.updateMatrixWorld(true);
  kub644.position.set(0, 1.74, 0);
  kub644MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub644MY.position.set(0, 3.38, 0);
  const kub644MrY = new THREE.Group();
  kub644MrY.add(kub644, kub644MY);
  kub644MrY.position.set(-0.2, 0, -0.01);
  const kub645 = new THREE.Mesh(boxGeo, Train_blue_3Material);
  kub645.position.set(-1, 2.6, -0.01);
  kub645.scale.set(0.1, 0.04, 0.87);
  kub645.setRotation(1.57, 3.14, 0);

  const kub646 = new THREE.Mesh(boxGeo, Coloumn_3Material);
  kub646.position.set(-0.55, 1.73, -0.01);
  kub646.scale.set(0.36, 0.03, 0.02);
  kub646.setRotation(1.57, 3.14, 0);

  const kub647 = new THREE.Mesh(boxGeo, Coloumn_3Material);
  kub647.scale.set(0.13, 0.03, 0.13);
  kub647.setRotation(1.57, 3.14, 0.79);
  const kub647MY = kub647.clone();
  kub647MY.updateMatrixWorld(true);
  kub647.position.set(0, 1.74, 0);
  kub647MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub647MY.position.set(0, 3.38, 0);
  const kub647MrY = new THREE.Group();
  kub647MrY.add(kub647, kub647MY);
  kub647MrY.position.set(-0.91, 0, -0.01);
  const kub648 = new THREE.Mesh(boxGeo, WhiteDots_3Material);
  kub648.position.set(-0.09, 0.56, -0.02);
  kub648.scale.set(0.09, 0.03, 0.09);
  kub648.setRotation(1.57, 0, 0);

  const kub649 = new THREE.Mesh(boxGeo, Coloumn_3Material);
  kub649.position.set(-0.02, 2.37, -0.01);
  kub649.scale.set(2.37, 0.04, 0.02);
  kub649.setRotation(4.71, 0, 1.57);

  const kub650 = new THREE.Mesh(boxGeo, Train_blue_3Material);
  kub650.position.set(-0.55, 4.05, -0.01);
  kub650.scale.set(0.55, 0.04, 0.65);
  kub650.setRotation(1.57, 3.14, 0);

  const kub651 = new THREE.Mesh(boxGeo, Glass_3Material);
  kub651.position.set(-0.55, 2.56, -0.01);
  kub651.scale.set(-0.02, 0.92, 0.37);
  kub651.setRotation(0, 1.57, 0);

  const kub652 = new THREE.Mesh(boxGeo, Train_blue_3Material);
  kub652.position.set(-0.1, 2.6, -0.01);
  kub652.scale.set(0.1, 0.04, 0.87);
  kub652.setRotation(1.57, 3.14, 0);

  const kub653 = new THREE.Mesh(boxGeo, WhiteDots_3Material);
  kub653.position.set(-0.64, 1.1, -0.02);
  kub653.scale.set(0.78, 0.02, 0.12);
  kub653.setRotation(1.57, 0, -0.79);

  const kub654 = new THREE.Mesh(boxGeo, Metal_3Material);
  kub654.position.set(-0.55, 0.43, -0.01);
  kub654.scale.set(0.03, 0.04, 0.55);
  kub654.setRotation(-1.57, 0, 1.57);

  const out = new THREE.Group();
  out.add(
    kub642,
    kub643,
    kub644MrY,
    kub645,
    kub646,
    kub647MrY,
    kub648,
    kub649,
    kub650,
    kub651,
    kub652,
    kub653,
    kub654,
  );
  return out;
}

function DrawStation() {
  const ColoumnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0, 0, 0),
    roughness: 0.5,
  });
  const BrassMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.79, 0.8, 0),
    metalness: 0.91,
    roughness: 0.1,
  });
  const RoofTilesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    emissive: new THREE.Color(1, 1, 1),
  });
  const RoofTiles_1Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.81, 0.81, 0.81),
  });
  const ColoumnPlateMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.37, 0.27, 0.15),
    roughness: 0.5,
  });
  const Floor_ColumnsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.24, 0.2, 0.13),
    metalness: 0.12,
    roughness: 0.15,
  });
  const Floor_CentralMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.39, 0.26),
    metalness: 0.12,
    roughness: 0.15,
  });
  const Blue_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.15, 0.25, 0.8),
    roughness: 0.5,
  });
  const WhiteDotsMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
  });
  const MetalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.48, 0.48, 0.48),
    metalness: 1,
    roughness: 0.5,
  });
  const Green_PictureMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.04, 0.49, 0.01),
    roughness: 0.5,
  });
  const Metall_RustMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.08, 0.02, 0),
    metalness: 0.83,
    roughness: 0.88,
  });
  const Floor_Sides_1Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.33, 0.27, 0.19),
    metalness: 0.12,
    roughness: 0.33,
  });
  const Floor_StripesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.52, 0),
  });
  const FloorTileMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.69, 0.62, 0.32),
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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const torusGeo = new THREE.TorusGeometry(1, 0.25, 12, 48);

  const kubimage = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kubimage.position.set(-31.3, 5.52, -0.01);
  kubimage.scale.set(0.18, 3.86, 3.39);

  const kubborder = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder.position.set(-31.3, 6.27, 3.55);
  kubborder.scale.set(0.2, 5.14, 0.23);

  const kubborder_1 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder_1.position.set(-31.3, 6.27, -3.67);
  kubborder_1.scale.set(0.2, 5.14, 0.23);

  const kubborder_2 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder_2.position.set(-31.3, 1.4, -0.01);
  kubborder_2.scale.set(0.2, 3.64, 0.27);
  kubborder_2.setRotation(1.57, 0, 0);

  const kubsmallroof_tileGr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile.scale.set(1.94, -0.13, 0.64);
    kubsmallroof_tile.position.set(4.03 * i, 0, 0);
    kubsmallroof_tileGr.add(kubsmallroof_tile);
  }
  kubsmallroof_tileGr.setRotation(3.08, 0, 0);
  kubsmallroof_tileGr.position.set(-29.8, 9.75, -0.63);
  const kubsmallroof_tile_5Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_5 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_5.scale.set(1.94, -0.13, 0.64);
    kubsmallroof_tile_5.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_5Gr.add(kubsmallroof_tile_5);
  }
  kubsmallroof_tile_5Gr.setRotation(2.97, 0, 0);
  kubsmallroof_tile_5Gr.position.set(-29.8, 9.6, -1.87);
  const kubsmallroof_tile_4Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_4 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_4.scale.set(1.94, -0.13, 0.58);
    kubsmallroof_tile_4.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_4Gr.add(kubsmallroof_tile_4);
  }
  kubsmallroof_tile_4Gr.setRotation(2.87, 0, 0);
  kubsmallroof_tile_4Gr.position.set(-29.8, 9.34, -3.01);
  const kubsmallroof_tile_3Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_3 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_3.scale.set(1.94, -0.13, 0.53);
    kubsmallroof_tile_3.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_3Gr.add(kubsmallroof_tile_3);
  }
  kubsmallroof_tile_3Gr.setRotation(2.73, 0, 0);
  kubsmallroof_tile_3Gr.position.set(-29.8, 8.98, -4.05);
  const kubsmallroof_tile_2Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_2 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_2.scale.set(1.94, -0.13, 0.53);
    kubsmallroof_tile_2.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_2Gr.add(kubsmallroof_tile_2);
  }
  kubsmallroof_tile_2Gr.setRotation(2.44, 0, 0);
  kubsmallroof_tile_2Gr.position.set(-29.8, 8.44, -4.93);
  const kubsmallroof_tile_1Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_1 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_1.scale.set(1.94, -0.13, 0.61);
    kubsmallroof_tile_1.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_1Gr.add(kubsmallroof_tile_1);
  }
  kubsmallroof_tile_1Gr.setRotation(2.13, 0, 0);
  kubsmallroof_tile_1Gr.position.set(-29.8, 7.62, -5.62);
  const kubsmallroof_tile_6Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_6 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_6.scale.set(0.13, -0.13, 0.64);
    kubsmallroof_tile_6.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_6Gr.add(kubsmallroof_tile_6);
  }
  kubsmallroof_tile_6Gr.setRotation(3.08, 0, 0);
  kubsmallroof_tile_6Gr.position.set(-27.8, 9.67, -0.63);
  const kubsmallroof_tile_7Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_7 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_7.scale.set(0.13, -0.13, 0.64);
    kubsmallroof_tile_7.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_7Gr.add(kubsmallroof_tile_7);
  }
  kubsmallroof_tile_7Gr.setRotation(2.97, 0, 0);
  kubsmallroof_tile_7Gr.position.set(-27.8, 9.52, -1.87);
  const kubsmallroof_tile_8Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_8 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_8.scale.set(0.13, -0.13, 0.58);
    kubsmallroof_tile_8.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_8Gr.add(kubsmallroof_tile_8);
  }
  kubsmallroof_tile_8Gr.setRotation(2.87, 0, 0);
  kubsmallroof_tile_8Gr.position.set(-27.8, 9.26, -3.01);
  const kubsmallroof_tile_9Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_9 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_9.scale.set(0.13, -0.13, 0.53);
    kubsmallroof_tile_9.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_9Gr.add(kubsmallroof_tile_9);
  }
  kubsmallroof_tile_9Gr.setRotation(2.73, 0, 0);
  kubsmallroof_tile_9Gr.position.set(-27.8, 8.9, -4.05);
  const kubsmallroof_tile_10Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_10 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_10.scale.set(0.13, -0.13, 0.53);
    kubsmallroof_tile_10.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_10Gr.add(kubsmallroof_tile_10);
  }
  kubsmallroof_tile_10Gr.setRotation(2.44, 0, 0);
  kubsmallroof_tile_10Gr.position.set(-27.8, 8.36, -4.93);
  const kubsmallroof_tile_11Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_11 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_11.scale.set(0.13, -0.13, 0.61);
    kubsmallroof_tile_11.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_11Gr.add(kubsmallroof_tile_11);
  }
  kubsmallroof_tile_11Gr.setRotation(2.13, 0, 0);
  kubsmallroof_tile_11Gr.position.set(-27.8, 7.54, -5.62);
  const kubsmallroof_tile_12Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_12 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_12.scale.set(1.94, -0.13, 0.64);
    kubsmallroof_tile_12.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_12Gr.add(kubsmallroof_tile_12);
  }
  kubsmallroof_tile_12Gr.setRotation(-3.08, 0, 0);
  kubsmallroof_tile_12Gr.position.set(-29.8, 9.75, 0.63);
  const kubsmallroof_tile_13Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_13 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_13.scale.set(1.94, -0.13, 0.64);
    kubsmallroof_tile_13.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_13Gr.add(kubsmallroof_tile_13);
  }
  kubsmallroof_tile_13Gr.setRotation(-2.97, 0, 0);
  kubsmallroof_tile_13Gr.position.set(-29.8, 9.6, 1.84);
  const kubsmallroof_tile_14Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_14 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_14.scale.set(1.94, -0.13, 0.58);
    kubsmallroof_tile_14.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_14Gr.add(kubsmallroof_tile_14);
  }
  kubsmallroof_tile_14Gr.setRotation(-2.87, 0, 0);
  kubsmallroof_tile_14Gr.position.set(-29.8, 9.34, 3.01);
  const kubsmallroof_tile_15Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_15 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_15.scale.set(1.94, -0.13, 0.53);
    kubsmallroof_tile_15.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_15Gr.add(kubsmallroof_tile_15);
  }
  kubsmallroof_tile_15Gr.setRotation(-2.73, 0, 0);
  kubsmallroof_tile_15Gr.position.set(-29.8, 8.98, 4.05);
  const kubsmallroof_tile_16Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_16 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_16.scale.set(1.94, -0.13, 0.53);
    kubsmallroof_tile_16.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_16Gr.add(kubsmallroof_tile_16);
  }
  kubsmallroof_tile_16Gr.setRotation(-2.44, 0, 0);
  kubsmallroof_tile_16Gr.position.set(-29.8, 8.45, 4.92);
  const kubsmallroof_tile_17Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_17 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_17.scale.set(1.94, -0.13, 0.61);
    kubsmallroof_tile_17.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_17Gr.add(kubsmallroof_tile_17);
  }
  kubsmallroof_tile_17Gr.setRotation(-2.13, 0, 0);
  kubsmallroof_tile_17Gr.position.set(-29.8, 7.62, 5.62);
  const kubsmallroof_tile_18Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_18 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_18.scale.set(0.13, -0.13, 0.64);
    kubsmallroof_tile_18.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_18Gr.add(kubsmallroof_tile_18);
  }
  kubsmallroof_tile_18Gr.setRotation(-3.08, 0, 0);
  kubsmallroof_tile_18Gr.position.set(-27.8, 9.67, 0.63);
  const kubsmallroof_tile_19Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_19 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_19.scale.set(0.13, -0.13, 0.64);
    kubsmallroof_tile_19.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_19Gr.add(kubsmallroof_tile_19);
  }
  kubsmallroof_tile_19Gr.setRotation(-2.97, 0, 0);
  kubsmallroof_tile_19Gr.position.set(-27.8, 9.52, 1.87);
  const kubsmallroof_tile_20Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_20 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_20.scale.set(0.13, -0.13, 0.58);
    kubsmallroof_tile_20.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_20Gr.add(kubsmallroof_tile_20);
  }
  kubsmallroof_tile_20Gr.setRotation(-2.87, 0, 0);
  kubsmallroof_tile_20Gr.position.set(-27.8, 9.26, 3.02);
  const kubsmallroof_tile_21Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_21 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_21.scale.set(0.13, -0.13, 0.53);
    kubsmallroof_tile_21.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_21Gr.add(kubsmallroof_tile_21);
  }
  kubsmallroof_tile_21Gr.setRotation(-2.73, 0, 0);
  kubsmallroof_tile_21Gr.position.set(-27.8, 8.89, 4.06);
  const kubsmallroof_tile_22Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_22 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_22.scale.set(0.13, -0.13, 0.53);
    kubsmallroof_tile_22.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_22Gr.add(kubsmallroof_tile_22);
  }
  kubsmallroof_tile_22Gr.setRotation(-2.44, 0, 0);
  kubsmallroof_tile_22Gr.position.set(-27.8, 8.37, 4.92);
  const kubsmallroof_tile_23Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_23 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_23.scale.set(0.13, -0.13, 0.61);
    kubsmallroof_tile_23.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_23Gr.add(kubsmallroof_tile_23);
  }
  kubsmallroof_tile_23Gr.setRotation(-2.13, 0, 0);
  kubsmallroof_tile_23Gr.position.set(-27.8, 7.54, 5.62);
  const kubsmallroof_tile_24 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_24.position.set(-31.4, 9.46, -0.63);
  kubsmallroof_tile_24.scale.set(0.29, -0.29, 0.64);
  kubsmallroof_tile_24.setRotation(3.08, 0, 0);

  const kubsmallroof_tile_25 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_25.position.set(-31.4, 9.31, -1.87);
  kubsmallroof_tile_25.scale.set(0.29, -0.28, 0.67);
  kubsmallroof_tile_25.setRotation(2.97, 0, 0);

  const kubsmallroof_tile_26 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_26.position.set(-31.4, 9.06, -3.01);
  kubsmallroof_tile_26.scale.set(0.29, -0.28, 0.65);
  kubsmallroof_tile_26.setRotation(2.87, 0, 0);

  const kubsmallroof_tile_27 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_27.position.set(-31.4, 9.46, 0.63);
  kubsmallroof_tile_27.scale.set(0.29, -0.29, 0.64);
  kubsmallroof_tile_27.setRotation(-3.08, 0, 0);

  const kubsmallroof_tile_28 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_28.position.set(-31.4, 9.32, 1.87);
  kubsmallroof_tile_28.scale.set(0.29, -0.28, 0.67);
  kubsmallroof_tile_28.setRotation(-2.97, 0, 0);

  const kubsmallroof_tile_29 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_29.position.set(-31.4, 9.06, 3.02);
  kubsmallroof_tile_29.scale.set(0.29, -0.28, 0.65);
  kubsmallroof_tile_29.setRotation(-2.87, 0, 0);

  const kubsmallroof_tile_30Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_30 = new THREE.Mesh(boxGeo, RoofTiles_1Material);
    kubsmallroof_tile_30.scale.set(1.94, -0.13, -0.1);
    kubsmallroof_tile_30.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_30Gr.add(kubsmallroof_tile_30);
  }
  kubsmallroof_tile_30Gr.setRotation(2.87, 0, 0);
  kubsmallroof_tile_30Gr.position.set(-29.8, 9.31, -3.01);
  const kubsmallroof_tile_31Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_31 = new THREE.Mesh(boxGeo, RoofTiles_1Material);
    kubsmallroof_tile_31.scale.set(1.94, -0.13, -0.1);
    kubsmallroof_tile_31.position.set(4.03 * i, 0, 0);
    kubsmallroof_tile_31Gr.add(kubsmallroof_tile_31);
  }
  kubsmallroof_tile_31Gr.setRotation(-2.87, 0, 0);
  kubsmallroof_tile_31Gr.position.set(-29.8, 9.31, 3.01);
  const cubeGr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    cube.scale.set(1, 3.48, 1);
    cube.position.set(6 * i, 0, 0);
    cubeGr.add(cube);
  }
  cubeGr.position.set(-30.7, 4.33, 7.9);
  const kub2Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub2 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub2.scale.set(0.45, 0.29, 1);
    kub2.position.set(2.9 * i, -5.25 * i, 0);
    kub2Gr.add(kub2);
  }
  kub2Gr.setRotation(0, 0, 1.07);
  kub2Gr.position.set(-29.8, 4.92, 7.9);
  const kub4Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub4 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub4.scale.set(0.45, 0.44, 1);
    kub4.position.set(4.77 * i, -3.64 * i, 0);
    kub4Gr.add(kub4);
  }
  kub4Gr.setRotation(0, 0, 0.65);
  kub4Gr.position.set(-29.4, 5.6, 7.9);
  const kub5Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub5 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub5.scale.set(0.45, 0.24, 1);
    kub5.position.set(5.71 * i, -1.83 * i, 0);
    kub5Gr.add(kub5);
  }
  kub5Gr.setRotation(0, 0, 0.31);
  kub5Gr.position.set(-28.6, 5.83, 7.9);
  const kub6Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub6 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub6.scale.set(0.45, 0.16, 1);
    kub6.position.set(6 * i, 0, 0);
    kub6Gr.add(kub6);
  }
  kub6Gr.position.set(-27.7, 5.89, 7.9);
  const kub7Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub7 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub7.scale.set(0.45, 0.29, 1);
    kub7.position.set(2.9 * i, 5.25 * i, 0);
    kub7Gr.add(kub7);
  }
  kub7Gr.setRotation(0, 0, -1.07);
  kub7Gr.position.set(-25.6, 4.92, 7.9);
  const kub8 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub8.position.set(-26, 5.6, 7.9);
  kub8.scale.set(0.45, 0.44, 1);
  kub8.setRotation(0, 0, -0.65);

  const kub9 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub9.position.set(-26.8, 5.83, 7.9);
  kub9.scale.set(0.45, 0.24, 1);
  kub9.setRotation(0, 0, -0.31);

  const kub11Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub11 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub11.scale.set(0.45, 0.24, 1);
    kub11.position.set(5.71 * i, 1.83 * i, 0);
    kub11Gr.add(kub11);
  }
  kub11Gr.setRotation(0, 0, -0.31);
  kub11Gr.position.set(-26.8, 5.83, 7.9);
  const kub12Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub12 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub12.scale.set(0.45, 0.44, 1);
    kub12.position.set(4.77 * i, 3.64 * i, 0);
    kub12Gr.add(kub12);
  }
  kub12Gr.setRotation(0, 0, -0.65);
  kub12Gr.position.set(-26, 5.6, 7.9);
  const kub13Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub13 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub13.scale.set(0.45, 0.29, 0.65);
    kub13.position.set(2.9 * i, 5.25 * i, 0);
    kub13Gr.add(kub13);
  }
  kub13Gr.setRotation(0, 0, -1.07);
  kub13Gr.position.set(-25.6, 4.92, 7.9);
  const kub15Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub15 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub15.scale.set(1.05, 3.48, 0.65);
    kub15.position.set(6 * i, 0, 0);
    kub15Gr.add(kub15);
  }
  kub15Gr.position.set(-30.7, 4.33, 7.9);
  const kub16Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub16 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub16.scale.set(0.45, 0.29, 0.65);
    kub16.position.set(2.9 * i, -5.25 * i, 0);
    kub16Gr.add(kub16);
  }
  kub16Gr.setRotation(0, 0, 1.07);
  kub16Gr.position.set(-29.8, 4.92, 7.9);
  const kub17Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub17 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub17.scale.set(0.45, 0.44, 0.65);
    kub17.position.set(4.77 * i, -3.64 * i, 0);
    kub17Gr.add(kub17);
  }
  kub17Gr.setRotation(0, 0, 0.65);
  kub17Gr.position.set(-29.3, 5.6, 7.9);
  const kub18Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub18 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub18.scale.set(0.45, 0.24, 0.65);
    kub18.position.set(5.71 * i, -1.83 * i, 0);
    kub18Gr.add(kub18);
  }
  kub18Gr.setRotation(0, 0, 0.31);
  kub18Gr.position.set(-28.4, 5.83, 7.9);
  const kub19Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub19 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub19.scale.set(0.45, 0.16, 0.65);
    kub19.position.set(6 * i, 0, 0);
    kub19Gr.add(kub19);
  }
  kub19Gr.position.set(-27.7, 5.86, 7.9);
  const kub20 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub20.position.set(-25.6, 4.92, 7.9);
  kub20.scale.set(0.45, 0.29, 1);
  kub20.setRotation(0, 0, -1.07);

  const kub21Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub21 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub21.scale.set(0.45, 0.44, 0.65);
    kub21.position.set(4.77 * i, 3.64 * i, 0);
    kub21Gr.add(kub21);
  }
  kub21Gr.setRotation(0, 0, -0.65);
  kub21Gr.position.set(-26.1, 5.6, 7.9);
  const kub22Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub22 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub22.scale.set(0.45, 0.24, 0.65);
    kub22.position.set(5.71 * i, 1.83 * i, 0);
    kub22Gr.add(kub22);
  }
  kub22Gr.setRotation(0, 0, -0.31);
  kub22Gr.position.set(-26.9, 5.83, 7.9);
  const kub10Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub10 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub10.scale.set(1, 3.48, 1);
    kub10.position.set(6 * i, 0, 0);
    kub10Gr.add(kub10);
  }
  kub10Gr.position.set(-30.7, 4.33, -7.9);
  const kub23Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub23 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub23.scale.set(1.05, 3.48, 0.65);
    kub23.position.set(6 * i, 0, 0);
    kub23Gr.add(kub23);
  }
  kub23Gr.position.set(-30.7, 4.33, -7.9);
  const kub24Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub24 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub24.scale.set(0.45, 0.29, 1);
    kub24.position.set(2.9 * i, -5.25 * i, 0);
    kub24Gr.add(kub24);
  }
  kub24Gr.setRotation(0, 0, 1.07);
  kub24Gr.position.set(-29.8, 4.92, -7.9);
  const kub25Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub25 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub25.scale.set(0.45, 0.44, 1);
    kub25.position.set(4.77 * i, -3.64 * i, 0);
    kub25Gr.add(kub25);
  }
  kub25Gr.setRotation(0, 0, 0.65);
  kub25Gr.position.set(-29.4, 5.6, -7.9);
  const kub26Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub26 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub26.scale.set(0.45, 0.24, 1);
    kub26.position.set(5.71 * i, -1.83 * i, 0);
    kub26Gr.add(kub26);
  }
  kub26Gr.setRotation(0, 0, 0.31);
  kub26Gr.position.set(-28.6, 5.83, -7.9);
  const kub27Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub27 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub27.scale.set(0.45, 0.16, 1);
    kub27.position.set(6 * i, 0, 0);
    kub27Gr.add(kub27);
  }
  kub27Gr.position.set(-27.7, 5.89, -7.9);
  const kub28Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub28 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub28.scale.set(0.45, 0.29, 1);
    kub28.position.set(2.9 * i, 5.25 * i, 0);
    kub28Gr.add(kub28);
  }
  kub28Gr.setRotation(0, 0, -1.07);
  kub28Gr.position.set(-25.6, 4.92, -7.9);
  const kub29Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub29 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub29.scale.set(0.45, 0.24, 1);
    kub29.position.set(5.71 * i, 1.83 * i, 0);
    kub29Gr.add(kub29);
  }
  kub29Gr.setRotation(0, 0, -0.31);
  kub29Gr.position.set(-26.8, 5.83, -7.9);
  const kub30Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub30 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub30.scale.set(0.45, 0.44, 1);
    kub30.position.set(4.77 * i, 3.64 * i, 0);
    kub30Gr.add(kub30);
  }
  kub30Gr.setRotation(0, 0, -0.65);
  kub30Gr.position.set(-26, 5.6, -7.9);
  const kub31Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub31 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub31.scale.set(0.45, 0.29, 0.65);
    kub31.position.set(2.9 * i, 5.25 * i, 0);
    kub31Gr.add(kub31);
  }
  kub31Gr.setRotation(0, 0, -1.07);
  kub31Gr.position.set(-25.6, 4.92, -7.9);
  const kub32Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub32 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub32.scale.set(0.45, 0.29, 0.65);
    kub32.position.set(2.9 * i, -5.25 * i, 0);
    kub32Gr.add(kub32);
  }
  kub32Gr.setRotation(0, 0, 1.07);
  kub32Gr.position.set(-29.8, 4.92, -7.9);
  const kub33Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub33 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub33.scale.set(0.45, 0.44, 0.65);
    kub33.position.set(4.77 * i, -3.64 * i, 0);
    kub33Gr.add(kub33);
  }
  kub33Gr.setRotation(0, 0, 0.65);
  kub33Gr.position.set(-29.3, 5.6, -7.9);
  const kub34Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub34 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub34.scale.set(0.45, 0.24, 0.65);
    kub34.position.set(5.71 * i, -1.83 * i, 0);
    kub34Gr.add(kub34);
  }
  kub34Gr.setRotation(0, 0, 0.31);
  kub34Gr.position.set(-28.4, 5.83, -7.9);
  const kub35Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub35 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub35.scale.set(0.45, 0.16, 0.65);
    kub35.position.set(6 * i, 0, 0);
    kub35Gr.add(kub35);
  }
  kub35Gr.position.set(-27.7, 5.86, -7.9);
  const kub36Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub36 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub36.scale.set(0.45, 0.44, 0.65);
    kub36.position.set(4.77 * i, 3.64 * i, 0);
    kub36Gr.add(kub36);
  }
  kub36Gr.setRotation(0, 0, -0.65);
  kub36Gr.position.set(-26.1, 5.6, -7.9);
  const kub37Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub37 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub37.scale.set(0.45, 0.24, 0.65);
    kub37.position.set(5.71 * i, 1.83 * i, 0);
    kub37Gr.add(kub37);
  }
  kub37Gr.setRotation(0, 0, -0.31);
  kub37Gr.position.set(-26.9, 5.83, -7.9);
  const kub38 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub38.scale.set(8.28, 3.48, 1);
  kub38.setRotation(0, 0, 0);
  const kub38MZ = kub38.clone();
  kub38MZ.updateMatrixWorld(true);
  kub38.position.set(0, 0, 7.9);
  kub38MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub38MZ.position.set(0, 0, -7.9);
  const kub38MrZ = new THREE.Group();
  kub38MrZ.add(kub38, kub38MZ);
  kub38MrZ.position.set(44.6, 4.33, 0);
  const kub39 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub39.scale.set(1.02, 3.48, 2.34);
  kub39.setRotation(0, 0, 0);
  const kub39MZ = kub39.clone();
  kub39MZ.updateMatrixWorld(true);
  kub39.position.set(0, 0, 9.24);
  kub39MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub39MZ.position.set(0, 0, -9.24);
  const kub39MrZ = new THREE.Group();
  kub39MrZ.add(kub39, kub39MZ);
  kub39MrZ.position.set(53.9, 4.33, 0);
  const kub40 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub40.scale.set(15.8, 3.48, 1.13);
  kub40.setRotation(0, 0, 0);
  const kub40MZ = kub40.clone();
  kub40MZ.updateMatrixWorld(true);
  kub40.position.set(0, 0, 10.4);
  kub40MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub40MZ.position.set(0, 0, -10.4);
  const kub40MrZ = new THREE.Group();
  kub40MrZ.add(kub40, kub40MZ);
  kub40MrZ.position.set(70.7, 4.33, 0);
  const kub70Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub70 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub70.scale.set(2.04, 0.98, 1);
    kub70.position.set(6 * i, 0, 0);
    kub70Gr.add(kub70);
  }
  kub70Gr.position.set(-27.7, 6.83, -7.9);
  const kub71Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub71 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub71.scale.set(2.04, 0.98, 1);
    kub71.position.set(6 * i, 0, 0);
    kub71Gr.add(kub71);
  }
  kub71Gr.position.set(-27.7, 6.83, 7.9);
  const kub92 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub92.scale.set(8.94, 3.48, 1);
  kub92.setRotation(0, 0, 0);
  const kub92MZ = kub92.clone();
  kub92MZ.updateMatrixWorld(true);
  kub92.position.set(0, 0, 7.9);
  kub92MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub92MZ.position.set(0, 0, -7.9);
  const kub92MrZ = new THREE.Group();
  kub92MrZ.add(kub92, kub92MZ);
  kub92MrZ.position.set(-40.7, 4.33, 0);
  const kub300 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub300.scale.set(146.5, 6.63, 2.64);
  kub300.setRotation(0, 0, 0);
  const kub300MZ = kub300.clone();
  kub300MZ.updateMatrixWorld(true);
  kub300.position.set(0, 0, 12.5);
  kub300MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub300MZ.position.set(0, 0, -12.5);
  const kub300MrZ = new THREE.Group();
  kub300MrZ.add(kub300, kub300MZ);
  kub300MrZ.position.set(197.1, 3.23, 0);
  const kub301 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub301.scale.set(146.5, 6.63, 2.64);
  kub301.setRotation(1.87, 0, 0);
  const kub301MZ = kub301.clone();
  kub301MZ.updateMatrixWorld(true);
  kub301.position.set(0, 0, 19.9);
  kub301MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub301MZ.position.set(0, 0, -19.9);
  const kub301MrZ = new THREE.Group();
  kub301MrZ.add(kub301, kub301MZ);
  kub301MrZ.position.set(197.1, 10.2, 0);
  const kub306 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub306.scale.set(146.5, 6.63, 2.64);
  kub306.setRotation(1.87, 0, 0);
  const kub306MZ = kub306.clone();
  kub306MZ.updateMatrixWorld(true);
  kub306.position.set(0, 0, 19.9);
  kub306MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub306MZ.position.set(0, 0, -19.9);
  const kub306MrZ = new THREE.Group();
  kub306MrZ.add(kub306, kub306MZ);
  kub306MrZ.position.set(-195.4, 10.2, 0);
  const kubbigroof = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubbigroof.scale.set(347.6, 0.17, 6.26);
  kubbigroof.setRotation(1.57, 0, 0);
  const kubbigroofMZ = kubbigroof.clone();
  kubbigroofMZ.updateMatrixWorld(true);
  kubbigroof.position.set(0, 0, 22.7);
  kubbigroofMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubbigroofMZ.position.set(0, 0, -22.7);
  const kubbigroofMrZ = new THREE.Group();
  kubbigroofMrZ.add(kubbigroof, kubbigroofMZ);
  kubbigroofMrZ.position.set(-0.24, -0.21, 0);
  const kubbigroof_4 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubbigroof_4.scale.set(49.2, 0.17, 3.37);
  kubbigroof_4.setRotation(1.57, 0, 0);
  const kubbigroof_4MZ = kubbigroof_4.clone();
  kubbigroof_4MZ.updateMatrixWorld(true);
  kubbigroof_4.position.set(0, 0, 14.5);
  kubbigroof_4MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubbigroof_4MZ.position.set(0, 0, -14.5);
  const kubbigroof_4MrZ = new THREE.Group();
  kubbigroof_4MrZ.add(kubbigroof_4, kubbigroof_4MZ);
  kubbigroof_4MrZ.position.set(-1.22, -3.1, 0);
  const kubescfloor_11 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
  kubescfloor_11.position.set(72.3, 0.74, -6.65);
  kubescfloor_11.scale.set(1.4, 0.95, 0.11);
  kubescfloor_11.setRotation(1.57, 0, 0);

  const kub41 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub41.position.set(53.7, 7.94, 0);
  kub41.scale.set(1.12, 2.13, 7.02);

  const kub42 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub42.position.set(53.6, 6.02, 0);
  kub42.scale.set(1.2, 0.18, 7.02);

  const kub43 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub43.scale.set(1.2, 0.05, 1.16);
  kub43.setRotation(1.57, 0, 0);
  const kub43MZ = kub43.clone();
  kub43MZ.updateMatrixWorld(true);
  kub43.position.set(0, 0, -5.01);
  kub43MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub43MZ.position.set(0, 0, 5.01);
  const kub43MrZ = new THREE.Group();
  kub43MrZ.add(kub43, kub43MZ);
  kub43MrZ.position.set(53.6, 7.36, 0);
  const kub44 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub44.scale.set(1.2, 0.05, 1.71);
  kub44.setRotation(1.57, 0, 0);
  const kub44MZ = kub44.clone();
  kub44MZ.updateMatrixWorld(true);
  kub44.position.set(0, 0, -2.58);
  kub44MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub44MZ.position.set(0, 0, 2.58);
  const kub44MrZ = new THREE.Group();
  kub44MrZ.add(kub44, kub44MZ);
  kub44MrZ.position.set(53.6, 7.9, 0);
  const kub45 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub45.position.set(53.6, 7.9, 0);
  kub45.scale.set(1.2, 0.05, 1.71);
  kub45.setRotation(1.57, 0, 0);

  const kub46 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub46.position.set(53.6, 8.21, 0);
  kub46.scale.set(1.2, 0.04, 5.56);

  const kub47 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub47.position.set(52.5, 8.11, 0);
  kub47.scale.set(-0.02, 1.91, 4.96);

  const cyl8 = new THREE.Mesh(cylinderGeo, BrassMaterial);
  cyl8.position.set(52.4, 7.94, 0);
  cyl8.scale.set(1, 0.05, 1);
  cyl8.setRotation(0, 0, -1.57);

  const cyl9 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl9.position.set(52.4, 7.94, 0);
  cyl9.scale.set(0.96, 0.05, 0.96);
  cyl9.setRotation(0, 0, -1.57);

  const cyl10 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl10.position.set(52.3, 7.94, 0);
  cyl10.scale.set(0.07, 0.02, 0.07);
  cyl10.setRotation(0, 0, -1.57);

  const kub48 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub48.position.set(52.3, 8.35, 0);
  kub48.scale.set(0.03, 0.38, 0.03);

  const kub49 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub49.position.set(52.3, 8.05, 0.31);
  kub49.scale.set(0.03, 0.3, 0.03);
  kub49.setRotation(1.23, 0, 0);

  const kub50 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub50.scale.set(0.03, 0.06, 0.03);
  kub50.setRotation(0, 0, 0);
  const kub50MX = kub50.clone();
  kub50MX.updateMatrixWorld(true);
  kub50.position.set(52.3, 0, 0);
  kub50MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub50MX.position.set(52.4, 0, 0);
  const kub50MrX = new THREE.Group();
  kub50MrX.add(kub50, kub50MX);
  kub50MrX.position.set(0, 8.81, 0);
  const kub51 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub51.scale.set(0.03, 0.06, 0.03);
  kub51.setRotation(1.57, 0, 0);
  const kub51MZ = kub51.clone();
  kub51MZ.updateMatrixWorld(true);
  kub51.position.set(0, 0, 0.87);
  kub51MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub51MZ.position.set(0, 0, -0.87);
  const kub51MrZ = new THREE.Group();
  kub51MrZ.add(kub51, kub51MZ);
  kub51MrZ.position.set(52.3, 7.94, 0);
  const kub52 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub52.scale.set(0.03, 0.06, 0.03);
  kub52.setRotation(2.36, 0, 0);
  const kub52MZ = kub52.clone();
  kub52MZ.updateMatrixWorld(true);
  kub52.position.set(0, 0, 0.61);
  kub52MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub52MZ.position.set(0, 0, -0.61);
  const kub52MrZ = new THREE.Group();
  kub52MrZ.add(kub52, kub52MZ);
  kub52MrZ.position.set(52.3, 7.32, 0);
  const kub53 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub53.scale.set(0.03, 0.06, 0.03);
  kub53.setRotation(0.79, 0, 0);
  const kub53MZ = kub53.clone();
  kub53MZ.updateMatrixWorld(true);
  kub53.position.set(0, 0, 0.61);
  kub53MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub53MZ.position.set(0, 0, -0.61);
  const kub53MrZ = new THREE.Group();
  kub53MrZ.add(kub53, kub53MZ);
  kub53MrZ.position.set(52.3, 8.55, 0);
  const cyl11 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cyl11.position.set(52.3, 7.94, 0);
  cyl11.scale.set(0.44, 0.01, 0.44);
  cyl11.setRotation(0, 0, -1.57);

  const kub54 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub54.position.set(38.2, 2.34, 6.91);
  kub54.scale.set(1.26, 0.98, 0.03);

  const kub55 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub55.position.set(38.2, 3.13, -6.89);
  kub55.scale.set(1.7, 1.16, 0.03);

  const kub56 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub56.position.set(38.2, 2.99, -6.86);
  kub56.scale.set(1.62, 0.94, 0.03);

  const kub57 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub57.position.set(38.2, 4.09, -6.86);
  kub57.scale.set(1.62, 0.15, 0.03);

  const kub58 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub58.position.set(38.2, 4.42, 6.91);
  kub58.scale.set(1.26, 0.98, 0.03);

  const kub59 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub59.position.set(38.2, 2.34, 6.89);
  kub59.scale.set(1.18, 0.92, 0.03);

  const kub60 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub60.position.set(38.2, 4.42, 6.89);
  kub60.scale.set(1.18, 0.92, 0.03);

  const kub61 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub61.position.set(38.2, 5.19, -6.9);
  kub61.scale.set(0.14, 0.14, 0.03);

  const kub62 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub62.position.set(38.2, 5.19, -6.76);
  kub62.scale.set(0.04, 0.04, 0.12);

  const kub63 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub63.position.set(38.2, 5.19, -6.34);
  kub63.scale.set(0.1, 0.3, 0.3);

  const kub64 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub64.position.set(38.2, 5.19, -6.34);
  kub64.scale.set(0.14, 0.25, 0.25);

  const kub65 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub65.position.set(38.2, 5.11, -6.34);
  kub65.scale.set(0.18, 0.13, 0.03);

  const cyl12 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl12.position.set(38.2, 5.33, -6.34);
  cyl12.scale.set(0.04, 0.16, 0.04);
  cyl12.setRotation(0, 0, -1.57);

  const kub66Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub66 = new THREE.Mesh(boxGeo, MapMaterial);
    kub66.scale.set(0.04, 0.67, 0.47);
    kub66.position.set(12 * i, 0, 0);
    kub66Gr.add(kub66);
  }
  kub66Gr.position.set(-23.7, 3.12, 7.9);
  const kub67Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub67 = new THREE.Mesh(boxGeo, MapMaterial);
    kub67.scale.set(0.04, 0.67, 0.47);
    kub67.position.set(12 * i, 0, 0);
    kub67Gr.add(kub67);
  }
  kub67Gr.position.set(-23.7, 3.12, -7.9);
  const kub68Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub68 = new THREE.Mesh(boxGeo, MapMaterial);
    kub68.scale.set(0.04, 0.67, 0.47);
    kub68.position.set(12 * i, 0, 0);
    kub68Gr.add(kub68);
  }
  kub68Gr.position.set(-25.8, 3.12, 7.9);
  const kub69Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub69 = new THREE.Mesh(boxGeo, MapMaterial);
    kub69.scale.set(0.04, 0.67, 0.47);
    kub69.position.set(12 * i, 0, 0);
    kub69Gr.add(kub69);
  }
  kub69Gr.position.set(-25.8, 3.12, -7.9);
  const kub72 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub72.scale.set(337.4, 0.09, 3.93);
  kub72.setRotation(0, 0, 0);
  const kub72MZ = kub72.clone();
  kub72MZ.updateMatrixWorld(true);
  kub72.position.set(0, 0, 18.6);
  kub72MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub72MZ.position.set(0, 0, -18.6);
  const kub72MrZ = new THREE.Group();
  kub72MrZ.add(kub72, kub72MZ);
  kub72MrZ.position.set(-0.94, -1.88, 0);
  const kub73 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub73.scale.set(350.9, 0.09, 0.65);
  kub73.setRotation(-1.09, 0, 0);
  const kub73MZ = kub73.clone();
  kub73MZ.updateMatrixWorld(true);
  kub73.position.set(0, 0, 22.3);
  kub73MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub73MZ.position.set(0, 0, -22.3);
  const kub73MrZ = new THREE.Group();
  kub73MrZ.add(kub73, kub73MZ);
  kub73MrZ.position.set(-2.03, -1.63, 0);
  const kub74 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub74.scale.set(352.6, 0.26, 0.17);
  kub74.setRotation(0, 0, 0);
  const kub74MZ = kub74.clone();
  kub74MZ.updateMatrixWorld(true);
  kub74.position.set(0, 0, 16.1);
  kub74MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub74MZ.position.set(0, 0, -16.1);
  const kub74MrZ = new THREE.Group();
  kub74MrZ.add(kub74, kub74MZ);
  kub74MrZ.position.set(-1.28, -1.53, 0);
  const kub75 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub75.scale.set(352.6, 0.26, 0.17);
  kub75.setRotation(0, 0, 0);
  const kub75MZ = kub75.clone();
  kub75MZ.updateMatrixWorld(true);
  kub75.position.set(0, 0, 21.1);
  kub75MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub75MZ.position.set(0, 0, -21.1);
  const kub75MrZ = new THREE.Group();
  kub75MrZ.add(kub75, kub75MZ);
  kub75MrZ.position.set(-1.28, -1.53, 0);
  const kub76 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub76.scale.set(350.9, 0.09, 1.65);
  kub76.setRotation(1.57, 0, 0);
  const kub76MZ = kub76.clone();
  kub76MZ.updateMatrixWorld(true);
  kub76.position.set(0, 0, 22.6);
  kub76MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub76MZ.position.set(0, 0, -22.6);
  const kub76MrZ = new THREE.Group();
  kub76MrZ.add(kub76, kub76MZ);
  kub76MrZ.position.set(-2.03, 0.25, 0);
  const kub77Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub77 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub77.scale.set(1.52, 0.05, 1.42);
    kub77.position.set(3.34 * i, 0, 0);
    kub77Gr.add(kub77);
  }
  kub77Gr.setRotation(0.05, 0, 0);
  kub77Gr.position.set(-48.1, 9.13, 15.2);
  const kub78Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub78 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub78.scale.set(1.52, 0.05, 1.33);
    kub78.position.set(3.34 * i, 0, 0);
    kub78Gr.add(kub78);
  }
  kub78Gr.setRotation(-0.26, 0, 0);
  kub78Gr.position.set(-48.1, 8.87, 12.5);
  const kub79Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub79 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub79.scale.set(1.52, 0.05, 1.21);
    kub79.position.set(3.34 * i, 0, 0);
    kub79Gr.add(kub79);
  }
  kub79Gr.setRotation(-0.63, 0, 0);
  kub79Gr.position.set(-48.1, 7.87, 10.3);
  const kub80Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub80 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub80.scale.set(1.52, 0.05, 0.65);
    kub80.position.set(3.34 * i, 0, 0);
    kub80Gr.add(kub80);
  }
  kub80Gr.setRotation(-1.11, 0, 0);
  kub80Gr.position.set(-48.1, 6.63, 9.11);
  const kub81Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub81 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub81.scale.set(1.52, 0.05, 1.42);
    kub81.position.set(3.34 * i, 0, 0);
    kub81Gr.add(kub81);
  }
  kub81Gr.setRotation(0.34, 0, 0);
  kub81Gr.position.set(-48.1, 8.58, 18);
  const kub82Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub82 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub82.scale.set(1.52, 0.05, 1.34);
    kub82.position.set(3.34 * i, 0, 0);
    kub82Gr.add(kub82);
  }
  kub82Gr.setRotation(0.65, 0, 0);
  kub82Gr.position.set(-48.1, 7.32, 20.3);
  const kub83Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub83 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub83.scale.set(1.52, 0.05, 1.34);
    kub83.position.set(3.34 * i, 0, 0);
    kub83Gr.add(kub83);
  }
  kub83Gr.setRotation(1.02, 0, 0);
  kub83Gr.position.set(-48.1, 5.43, 22.1);
  const kub84Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub84 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub84.scale.set(0.17, 0.05, 1.34);
    kub84.position.set(3.34 * i, 0, 0);
    kub84Gr.add(kub84);
  }
  kub84Gr.setRotation(1.02, 0, 0);
  kub84Gr.position.set(-46.4, 5.39, 22);
  const kub85Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub85 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub85.scale.set(0.17, 0.05, 1.41);
    kub85.position.set(3.34 * i, 0, 0);
    kub85Gr.add(kub85);
  }
  kub85Gr.setRotation(0.05, 0, 0);
  kub85Gr.position.set(-46.4, 9.09, 15.2);
  const kub86Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub86 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub86.scale.set(0.17, 0.05, 1.32);
    kub86.position.set(3.34 * i, 0, 0);
    kub86Gr.add(kub86);
  }
  kub86Gr.setRotation(-0.26, 0, 0);
  kub86Gr.position.set(-46.4, 8.83, 12.6);
  const kub87Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub87 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub87.scale.set(0.17, 0.05, 1.2);
    kub87.position.set(3.34 * i, 0, 0);
    kub87Gr.add(kub87);
  }
  kub87Gr.setRotation(-0.63, 0, 0);
  kub87Gr.position.set(-46.4, 7.83, 10.4);
  const kub88Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub88 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub88.scale.set(0.17, 0.05, 0.65);
    kub88.position.set(3.34 * i, 0, 0);
    kub88Gr.add(kub88);
  }
  kub88Gr.setRotation(-1.11, 0, 0);
  kub88Gr.position.set(-46.4, 6.58, 9.13);
  const kub89Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub89 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub89.scale.set(0.17, 0.05, 1.41);
    kub89.position.set(3.34 * i, 0, 0);
    kub89Gr.add(kub89);
  }
  kub89Gr.setRotation(0.34, 0, 0);
  kub89Gr.position.set(-46.4, 8.54, 18);
  const kub90Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub90 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub90.scale.set(0.17, 0.05, 1.34);
    kub90.position.set(3.34 * i, 0, 0);
    kub90Gr.add(kub90);
  }
  kub90Gr.setRotation(0.65, 0, 0);
  kub90Gr.position.set(-46.4, 7.28, 20.3);
  const kub91Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub91 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub91.scale.set(1.52, 0.05, 0.08);
    kub91.position.set(3.34 * i, 0, 0);
    kub91Gr.add(kub91);
  }
  kub91Gr.setRotation(0.18, 0, 0);
  kub91Gr.position.set(-48.1, 9.03, 16.6);
  const kub93Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub93 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub93.scale.set(1.52, 0.05, 0.65);
    kub93.position.set(3.34 * i, 0, 0);
    kub93Gr.add(kub93);
  }
  kub93Gr.setRotation(1.11, 0, 0);
  kub93Gr.position.set(-48.1, 6.63, -9.11);
  const kub94Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub94 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub94.scale.set(1.52, 0.05, 1.21);
    kub94.position.set(3.34 * i, 0, 0);
    kub94Gr.add(kub94);
  }
  kub94Gr.setRotation(0.63, 0, 0);
  kub94Gr.position.set(-48.1, 7.87, -10.3);
  const kub95Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub95 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub95.scale.set(0.17, 0.05, 0.65);
    kub95.position.set(3.34 * i, 0, 0);
    kub95Gr.add(kub95);
  }
  kub95Gr.setRotation(1.11, 0, 0);
  kub95Gr.position.set(-46.4, 6.58, -9.13);
  const kub96Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub96 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub96.scale.set(0.17, 0.05, 1.2);
    kub96.position.set(3.34 * i, 0, 0);
    kub96Gr.add(kub96);
  }
  kub96Gr.setRotation(0.63, 0, 0);
  kub96Gr.position.set(-46.4, 7.83, -10.4);
  const kub97Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub97 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub97.scale.set(1.52, 0.05, 1.33);
    kub97.position.set(3.34 * i, 0, 0);
    kub97Gr.add(kub97);
  }
  kub97Gr.setRotation(0.26, 0, 0);
  kub97Gr.position.set(-48.1, 8.87, -12.5);
  const kub98Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub98 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub98.scale.set(0.17, 0.05, 1.32);
    kub98.position.set(3.34 * i, 0, 0);
    kub98Gr.add(kub98);
  }
  kub98Gr.setRotation(0.26, 0, 0);
  kub98Gr.position.set(-46.4, 8.83, -12.6);
  const kub99Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub99 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub99.scale.set(1.52, 0.05, 1.42);
    kub99.position.set(3.34 * i, 0, 0);
    kub99Gr.add(kub99);
  }
  kub99Gr.setRotation(-0.05, 0, 0);
  kub99Gr.position.set(-48.1, 9.13, -15.2);
  const kub100Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub100 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub100.scale.set(0.17, 0.05, 1.41);
    kub100.position.set(3.34 * i, 0, 0);
    kub100Gr.add(kub100);
  }
  kub100Gr.setRotation(-0.05, 0, 0);
  kub100Gr.position.set(-46.4, 9.09, -15.2);
  const kub101Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub101 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub101.scale.set(1.52, 0.05, 1.42);
    kub101.position.set(3.34 * i, 0, 0);
    kub101Gr.add(kub101);
  }
  kub101Gr.setRotation(-0.34, 0, 0);
  kub101Gr.position.set(-48.1, 8.58, -18);
  const kub102Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub102 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub102.scale.set(0.17, 0.05, 1.34);
    kub102.position.set(3.34 * i, 0, 0);
    kub102Gr.add(kub102);
  }
  kub102Gr.setRotation(-0.65, 0, 0);
  kub102Gr.position.set(-46.4, 7.28, -20.3);
  const kub103Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub103 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub103.scale.set(0.17, 0.05, 1.41);
    kub103.position.set(3.34 * i, 0, 0);
    kub103Gr.add(kub103);
  }
  kub103Gr.setRotation(-0.34, 0, 0);
  kub103Gr.position.set(-46.4, 8.54, -18);
  const kub104Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub104 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub104.scale.set(1.52, 0.05, 1.34);
    kub104.position.set(3.34 * i, 0, 0);
    kub104Gr.add(kub104);
  }
  kub104Gr.setRotation(-0.65, 0, 0);
  kub104Gr.position.set(-48.1, 7.32, -20.3);
  const kub105Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub105 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub105.scale.set(1.52, 0.05, 1.34);
    kub105.position.set(3.34 * i, 0, 0);
    kub105Gr.add(kub105);
  }
  kub105Gr.setRotation(-1.02, 0, 0);
  kub105Gr.position.set(-48.1, 5.43, -22.1);
  const kub106Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub106 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub106.scale.set(0.17, 0.05, 1.34);
    kub106.position.set(3.34 * i, 0, 0);
    kub106Gr.add(kub106);
  }
  kub106Gr.setRotation(-1.02, 0, 0);
  kub106Gr.position.set(-46.4, 5.39, -22);
  const kub297 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub297.position.set(70.8, 7.94, 0);
  kub297.scale.set(15.9, 2.13, 7.02);

  const kub298 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub298.position.set(70.8, 6.61, 0);
  kub298.scale.set(15.9, 0.35, 10.3);

  const kub299 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub299.position.set(80.1, 3.77, 0);
  kub299.scale.set(3.51, 0.35, 10.3);
  kub299.setRotation(0, 0, -1.57);

  const cylinderGr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinder = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cylinder.scale.set(0.5, 2.5, 0.5);
    cylinder.position.set(6 * i, 0, 0);
    cylinderGr.add(cylinder);
  }
  cylinderGr.position.set(-30.7, 3.3, -7.18);
  const cyl1Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl1 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl1.scale.set(0.55, 0.23, 0.55);
    cyl1.position.set(6 * i, 0, 0);
    cyl1Gr.add(cyl1);
  }
  cyl1Gr.position.set(-30.7, 1.04, -7.18);
  const kub3Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub3 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub3.scale.set(0.7, 0.08, 0.7);
    kub3.position.set(6 * i, 0, 0);
    kub3Gr.add(kub3);
  }
  kub3Gr.position.set(-30.7, 5.81, -7.18);
  const cyl3Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl3 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl3.scale.set(0.55, 0.3, 0.55);
    cyl3.position.set(6 * i, 0, 0);
    cyl3Gr.add(cyl3);
  }
  cyl3Gr.position.set(-30.7, 5.47, -7.18);
  const cyl4Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl4 = new THREE.Mesh(cylinderGeo, BrassMaterial);
    cyl4.scale.set(0.6, 0.14, 0.6);
    cyl4.position.set(6 * i, 0, 0);
    cyl4Gr.add(cyl4);
  }
  cyl4Gr.position.set(-30.7, 5.47, -7.18);
  const tor1Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor1 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor1.scale.set(0.5, 0.5, 0.52);
    tor1.position.set(6 * i, 0, 0);
    tor1Gr.add(tor1);
  }
  tor1Gr.setRotation(1.57, 0, 0);
  tor1Gr.position.set(-30.7, 1.05, -7.18);
  const tor2Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor2 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor2.scale.set(0.52, 0.52, 0.52);
    tor2.position.set(6 * i, 0, 0);
    tor2Gr.add(tor2);
  }
  tor2Gr.setRotation(1.57, 0, 0);
  tor2Gr.position.set(-30.7, 5.7, -7.18);
  const tor3Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor3 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor3.scale.set(0.52, 0.52, 0.26);
    tor3.position.set(6 * i, 0, 0);
    tor3Gr.add(tor3);
  }
  tor3Gr.setRotation(1.57, 0, 0);
  tor3Gr.position.set(-30.7, 5.31, -7.18);
  const kubfloor_central = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubfloor_central.position.set(24.4, 0.57, 0);
  kubfloor_central.scale.set(56.1, 0.3, 6.35);

  const kubfloor_columns = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubfloor_columns.scale.set(65.5, 0.3, 2.5);
  kubfloor_columns.setRotation(0, 0, 0);
  const kubfloor_columnsMZ = kubfloor_columns.clone();
  kubfloor_columnsMZ.updateMatrixWorld(true);
  kubfloor_columns.position.set(0, 0, -8.84);
  kubfloor_columnsMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_columnsMZ.position.set(0, 0, 8.84);
  const kubfloor_columnsMrZ = new THREE.Group();
  kubfloor_columnsMrZ.add(kubfloor_columns, kubfloor_columnsMZ);
  kubfloor_columnsMrZ.position.set(15.9, 0.56, 0);
  const kubfloor_sided = new THREE.Mesh(boxGeo, Floor_Sides_1Material);
  kubfloor_sided.scale.set(50.6, 0.3, 0.28);
  kubfloor_sided.setRotation(0, 0, 0);
  const kubfloor_sidedMZ = kubfloor_sided.clone();
  kubfloor_sidedMZ.updateMatrixWorld(true);
  kubfloor_sided.position.set(0, 0, -11.6);
  kubfloor_sidedMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_sidedMZ.position.set(0, 0, 11.6);
  const kubfloor_sidedMrZ = new THREE.Group();
  kubfloor_sidedMrZ.add(kubfloor_sided, kubfloor_sidedMZ);
  kubfloor_sidedMrZ.position.set(0.36, 0.54, 0);
  const kubfloor_trainsside = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubfloor_trainsside.scale.set(51.5, 0.3, 1.75);
  kubfloor_trainsside.setRotation(0, 0, 0);
  const kubfloor_trainssideMZ = kubfloor_trainsside.clone();
  kubfloor_trainssideMZ.updateMatrixWorld(true);
  kubfloor_trainsside.position.set(0, 0, -13.6);
  kubfloor_trainssideMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_trainssideMZ.position.set(0, 0, 13.6);
  const kubfloor_trainssideMrZ = new THREE.Group();
  kubfloor_trainssideMrZ.add(kubfloor_trainsside, kubfloor_trainssideMZ);
  kubfloor_trainssideMrZ.position.set(-0.52, 0.57, 0);
  const kubstripes_1Gr = new THREE.Group();
  for (let i = 0; i < 83; i++) {
    const kubstripes_1 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
    kubstripes_1.scale.set(0.47, 0.02, 0.13);
    kubstripes_1.position.set(1.21 * i, 0, 0);
    kubstripes_1Gr.add(kubstripes_1);
  }
  kubstripes_1Gr.position.set(-49.1, 0.85, -13.6);
  const cylstripe_dotsGr = new THREE.Group();
  for (let i = 0; i < 82; i++) {
    const cylstripe_dots = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
    cylstripe_dots.scale.set(0.13, 0, 0.13);
    cylstripe_dots.position.set(1.21 * i, 0, 0);
    cylstripe_dotsGr.add(cylstripe_dots);
  }
  cylstripe_dotsGr.position.set(-48.4, 0.87, -13.6);
  const kubstripes_2 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_2.scale.set(-59.1, 0.02, 0.16);
  kubstripes_2.setRotation(0, 0, 0);
  const kubstripes_2MZ = kubstripes_2.clone();
  kubstripes_2MZ.updateMatrixWorld(true);
  kubstripes_2.position.set(0, 0, 4.75);
  kubstripes_2MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubstripes_2MZ.position.set(0, 0, -4.75);
  const kubstripes_2MrZ = new THREE.Group();
  kubstripes_2MrZ.add(kubstripes_2, kubstripes_2MZ);
  kubstripes_2MrZ.position.set(23.6, 0.86, 0);
  const cyl2Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl2 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl2.scale.set(0.5, 2.5, 0.5);
    cyl2.position.set(6 * i, 0, 0);
    cyl2Gr.add(cyl2);
  }
  cyl2Gr.position.set(-30.7, 3.3, 7.17);
  const kubstripes_3Gr = new THREE.Group();
  for (let i = 0; i < 83; i++) {
    const kubstripes_3 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
    kubstripes_3.scale.set(0.47, 0.02, 0.13);
    kubstripes_3.position.set(1.21 * i, 0, 0);
    kubstripes_3Gr.add(kubstripes_3);
  }
  kubstripes_3Gr.position.set(-49.1, 0.85, 13.6);
  const cylstripe_dots_1Gr = new THREE.Group();
  for (let i = 0; i < 82; i++) {
    const cylstripe_dots_1 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
    cylstripe_dots_1.scale.set(0.13, 0, 0.13);
    cylstripe_dots_1.position.set(1.21 * i, 0, 0);
    cylstripe_dots_1Gr.add(cylstripe_dots_1);
  }
  cylstripe_dots_1Gr.position.set(-48.4, 0.87, 13.6);
  const cyl5Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl5 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl5.scale.set(0.55, 0.23, 0.55);
    cyl5.position.set(6 * i, 0, 0);
    cyl5Gr.add(cyl5);
  }
  cyl5Gr.position.set(-30.7, 1.04, 7.17);
  const tor4Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor4 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor4.scale.set(0.5, 0.5, 0.52);
    tor4.position.set(6 * i, 0, 0);
    tor4Gr.add(tor4);
  }
  tor4Gr.setRotation(1.57, 0, 0);
  tor4Gr.position.set(-30.7, 1.05, 7.17);
  const cyl6Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl6 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl6.scale.set(0.55, 0.3, 0.55);
    cyl6.position.set(6 * i, 0, 0);
    cyl6Gr.add(cyl6);
  }
  cyl6Gr.position.set(-30.7, 5.47, 7.17);
  const tor5Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor5 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor5.scale.set(0.52, 0.52, 0.26);
    tor5.position.set(6 * i, 0, 0);
    tor5Gr.add(tor5);
  }
  tor5Gr.setRotation(1.57, 0, 0);
  tor5Gr.position.set(-30.7, 5.31, 7.17);
  const cyl7Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl7 = new THREE.Mesh(cylinderGeo, BrassMaterial);
    cyl7.scale.set(0.6, 0.14, 0.6);
    cyl7.position.set(6 * i, 0, 0);
    cyl7Gr.add(cyl7);
  }
  cyl7Gr.position.set(-30.7, 5.47, 7.17);
  const kub1Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub1 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub1.scale.set(0.7, 0.08, 0.7);
    kub1.position.set(6 * i, 0, 0);
    kub1Gr.add(kub1);
  }
  kub1Gr.position.set(-30.7, 5.81, 7.17);
  const tor6Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor6 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor6.scale.set(0.52, 0.52, 0.52);
    tor6.position.set(6 * i, 0, 0);
    tor6Gr.add(tor6);
  }
  tor6Gr.setRotation(1.57, 0, 0);
  tor6Gr.position.set(-30.7, 5.7, 7.17);
  const kubstripes_6 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_6.position.set(76.6, 0.86, 0.09);
  kubstripes_6.scale.set(-5.12, 0.02, 0.16);
  kubstripes_6.setRotation(0, 1.57, 0);

  const kubstripes_4 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_4.position.set(-31.1, 0.86, 0.09);
  kubstripes_4.scale.set(-5.12, 0.02, 0.16);
  kubstripes_4.setRotation(0, 1.57, 0);

  const kubbackwall = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall.position.set(-41, 5.48, 0);
  kubbackwall.scale.set(9.43, 4.63, 8.27);

  const kubcoloumnsupper_1 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_1.scale.set(42.6, 0.19, 0.72);
  kubcoloumnsupper_1.setRotation(0, 0, 0);
  const kubcoloumnsupper_1MZ = kubcoloumnsupper_1.clone();
  kubcoloumnsupper_1MZ.updateMatrixWorld(true);
  kubcoloumnsupper_1.position.set(0, 0, -6.15);
  kubcoloumnsupper_1MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_1MZ.position.set(0, 0, 6.15);
  const kubcoloumnsupper_1MrZ = new THREE.Group();
  kubcoloumnsupper_1MrZ.add(kubcoloumnsupper_1, kubcoloumnsupper_1MZ);
  kubcoloumnsupper_1MrZ.position.set(10.5, 7.03, 0);
  const kubcoloumnsupper_2 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_2.scale.set(42.6, 0.19, 0.72);
  kubcoloumnsupper_2.setRotation(-0.73, 0, 0);
  const kubcoloumnsupper_2MZ = kubcoloumnsupper_2.clone();
  kubcoloumnsupper_2MZ.updateMatrixWorld(true);
  kubcoloumnsupper_2.position.set(0, 0, -6.12);
  kubcoloumnsupper_2MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_2MZ.position.set(0, 0, 6.12);
  const kubcoloumnsupper_2MrZ = new THREE.Group();
  kubcoloumnsupper_2MrZ.add(kubcoloumnsupper_2, kubcoloumnsupper_2MZ);
  kubcoloumnsupper_2MrZ.position.set(10.5, 6.6, 0);
  const kubcoloumnsupper_3 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_3.scale.set(42.6, 0.19, 0.72);
  kubcoloumnsupper_3.setRotation(0, 0, 0);
  const kubcoloumnsupper_3MZ = kubcoloumnsupper_3.clone();
  kubcoloumnsupper_3MZ.updateMatrixWorld(true);
  kubcoloumnsupper_3.position.set(0, 0, -7.17);
  kubcoloumnsupper_3MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_3MZ.position.set(0, 0, 7.17);
  const kubcoloumnsupper_3MrZ = new THREE.Group();
  kubcoloumnsupper_3MrZ.add(kubcoloumnsupper_3, kubcoloumnsupper_3MZ);
  kubcoloumnsupper_3MrZ.position.set(10.5, 6.06, 0);
  const kubbackwall_1 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall_1.position.set(-53.5, 1.98, 0);
  kubbackwall_1.scale.set(3.08, 9.22, 15);

  const kubbackwall_2 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall_2.position.set(-182.3, 1.98, 0);
  kubbackwall_2.scale.set(125.8, 9.22, 15);

  const kub302 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub302.position.set(344.5, 3.69, 19.9);
  kub302.scale.set(2.95, 12.8, 12.8);

  const kub303 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub303.position.set(344.5, 3.69, -18.5);
  kub303.scale.set(2.95, 12.8, 12.8);

  const kub304 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub304.position.set(-308.4, 3.69, 19.9);
  kub304.scale.set(2.95, 12.8, 12.8);

  const kub305 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub305.position.set(-308.4, 3.69, -18.5);
  kub305.scale.set(2.95, 12.8, 12.8);

  const out = new THREE.Group();
  out.add(
    kubimage,
    kubborder,
    kubborder_1,
    kubborder_2,
    kubsmallroof_tileGr,
    kubsmallroof_tile_5Gr,
    kubsmallroof_tile_4Gr,
    kubsmallroof_tile_3Gr,
    kubsmallroof_tile_2Gr,
    kubsmallroof_tile_1Gr,
    kubsmallroof_tile_6Gr,
    kubsmallroof_tile_7Gr,
    kubsmallroof_tile_8Gr,
    kubsmallroof_tile_9Gr,
    kubsmallroof_tile_10Gr,
    kubsmallroof_tile_11Gr,
    kubsmallroof_tile_12Gr,
    kubsmallroof_tile_13Gr,
    kubsmallroof_tile_14Gr,
    kubsmallroof_tile_15Gr,
    kubsmallroof_tile_16Gr,
    kubsmallroof_tile_17Gr,
    kubsmallroof_tile_18Gr,
    kubsmallroof_tile_19Gr,
    kubsmallroof_tile_20Gr,
    kubsmallroof_tile_21Gr,
    kubsmallroof_tile_22Gr,
    kubsmallroof_tile_23Gr,
    kubsmallroof_tile_24,
    kubsmallroof_tile_25,
    kubsmallroof_tile_26,
    kubsmallroof_tile_27,
    kubsmallroof_tile_28,
    kubsmallroof_tile_29,
    kubsmallroof_tile_30Gr,
    kubsmallroof_tile_31Gr,
    cubeGr,
    kub2Gr,
    kub4Gr,
    kub5Gr,
    kub6Gr,
    kub7Gr,
    kub8,
    kub9,
    kub11Gr,
    kub12Gr,
    kub13Gr,
    kub15Gr,
    kub16Gr,
    kub17Gr,
    kub18Gr,
    kub19Gr,
    kub20,
    kub21Gr,
    kub22Gr,
    kub10Gr,
    kub23Gr,
    kub24Gr,
    kub25Gr,
    kub26Gr,
    kub27Gr,
    kub28Gr,
    kub29Gr,
    kub30Gr,
    kub31Gr,
    kub32Gr,
    kub33Gr,
    kub34Gr,
    kub35Gr,
    kub36Gr,
    kub37Gr,
    kub38MrZ,
    kub39MrZ,
    kub40MrZ,
    kub70Gr,
    kub71Gr,
    kub92MrZ,
    kub300MrZ,
    kub301MrZ,
    kub306MrZ,
    kubbigroofMrZ,
    kubbigroof_4MrZ,
    kubescfloor_11,
    kub41,
    kub42,
    kub43MrZ,
    kub44MrZ,
    kub45,
    kub46,
    kub47,
    cyl8,
    cyl9,
    cyl10,
    kub48,
    kub49,
    kub50MrX,
    kub51MrZ,
    kub52MrZ,
    kub53MrZ,
    cyl11,
    kub54,
    kub55,
    kub56,
    kub57,
    kub58,
    kub59,
    kub60,
    kub61,
    kub62,
    kub63,
    kub64,
    kub65,
    cyl12,
    kub66Gr,
    kub67Gr,
    kub68Gr,
    kub69Gr,
    kub72MrZ,
    kub73MrZ,
    kub74MrZ,
    kub75MrZ,
    kub76MrZ,
    kub77Gr,
    kub78Gr,
    kub79Gr,
    kub80Gr,
    kub81Gr,
    kub82Gr,
    kub83Gr,
    kub84Gr,
    kub85Gr,
    kub86Gr,
    kub87Gr,
    kub88Gr,
    kub89Gr,
    kub90Gr,
    kub91Gr,
    kub93Gr,
    kub94Gr,
    kub95Gr,
    kub96Gr,
    kub97Gr,
    kub98Gr,
    kub99Gr,
    kub100Gr,
    kub101Gr,
    kub102Gr,
    kub103Gr,
    kub104Gr,
    kub105Gr,
    kub106Gr,
    kub297,
    kub298,
    kub299,
    cylinderGr,
    cyl1Gr,
    kub3Gr,
    cyl3Gr,
    cyl4Gr,
    tor1Gr,
    tor2Gr,
    tor3Gr,
    kubfloor_central,
    kubfloor_columnsMrZ,
    kubfloor_sidedMrZ,
    kubfloor_trainssideMrZ,
    kubstripes_1Gr,
    cylstripe_dotsGr,
    kubstripes_2MrZ,
    cyl2Gr,
    kubstripes_3Gr,
    cylstripe_dots_1Gr,
    cyl5Gr,
    tor4Gr,
    cyl6Gr,
    tor5Gr,
    cyl7Gr,
    kub1Gr,
    tor6Gr,
    kubstripes_6,
    kubstripes_4,
    kubbackwall,
    kubcoloumnsupper_1MrZ,
    kubcoloumnsupper_2MrZ,
    kubcoloumnsupper_3MrZ,
    kubbackwall_1,
    kubbackwall_2,
    kub302,
    kub303,
    kub304,
    kub305,
  );
  return out;
}

//Draw Functions End
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
