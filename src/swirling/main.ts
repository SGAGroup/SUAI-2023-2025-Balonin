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
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const baseSize = 256;

  const floor = new THREE.Mesh(boxGeo);
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
  const kub108Material = new THREE.MeshStandardMaterial({
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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
  const planeGeo = new THREE.PlaneGeometry(2, 2);

  const kub038 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub038.position.set(0.9393, 0.0739, -0.0005);
  kub038.scale.set(0.1139, 0.0767, 0.5205);

  const kub039 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub039.position.set(0.7271, 0.1346, -0.0005);
  kub039.scale.set(0.2689, 0.0901, 0.233);
  kub039.setRotation(0.3098, 1.5708, 0.0);

  const cyl008 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl008.position.set(0.6385, 0.1628, -0.0005);
  cyl008.scale.set(0.0746, 0.5291, 0.0746);
  cyl008.setRotation(1.5708, 0.0, 0.0);

  const cyl009 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl009.scale.set(0.1018, 0.0604, 0.1018);
  cyl009.setRotation(1.5708, 0.0, 0.0);
  const cyl009MZ = cyl009.clone();
  cyl009MZ.updateMatrixWorld(true);
  cyl009.position.set(0, 0, 0.5);
  cyl009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl009MZ.position.set(0, 0, -0.5009);
  const cyl009MrZ = new THREE.Group();
  cyl009MrZ.add(cyl009, cyl009MZ);
  cyl009MrZ.position.set(0.6385, 0.1628, 0);
  const pln001 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln001.scale.set(0.0762, 0.089, 0.0743);
  pln001.setRotation(1.5708, 0.0, -1.3109);
  const pln001MZ = pln001.clone();
  pln001MZ.updateMatrixWorld(true);
  pln001.position.set(0, 0, 0.0898);
  pln001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln001MZ.position.set(0, 0, -0.0907);
  const pln001MrZ = new THREE.Group();
  pln001MrZ.add(pln001, pln001MZ);
  pln001MrZ.position.set(0.563, 0.8232, 0);
  const pln002 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln002.scale.set(0.0565, 0.089, 0.0743);
  pln002.setRotation(1.5708, 0.0, -1.3866);
  const pln002MZ = pln002.clone();
  pln002MZ.updateMatrixWorld(true);
  pln002.position.set(0, 0, 0.0898);
  pln002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln002MZ.position.set(0, 0, -0.0907);
  const pln002MrZ = new THREE.Group();
  pln002MrZ.add(pln002, pln002MZ);
  pln002MrZ.position.set(0.5929, 0.694, 0);
  const pln003 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln003.scale.set(0.0466, 0.089, 0.0743);
  pln003.setRotation(1.5708, 0.0, -1.4353);
  const pln003MZ = pln003.clone();
  pln003MZ.updateMatrixWorld(true);
  pln003.position.set(0, 0, 0.0898);
  pln003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln003MZ.position.set(0, 0, -0.0907);
  const pln003MrZ = new THREE.Group();
  pln003MrZ.add(pln003, pln003MZ);
  pln003MrZ.position.set(0.6096, 0.5922, 0);
  const pln004 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln004.scale.set(0.0401, 0.089, 0.0743);
  pln004.setRotation(1.5708, 0.0, -1.5094);
  const pln004MZ = pln004.clone();
  pln004MZ.updateMatrixWorld(true);
  pln004.position.set(0, 0, 0.0898);
  pln004MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln004MZ.position.set(0, 0, -0.0907);
  const pln004MrZ = new THREE.Group();
  pln004MrZ.add(pln004, pln004MZ);
  pln004MrZ.position.set(0.6183, 0.506, 0);
  const pln005 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln005.scale.set(0.0487, 0.089, 0.0743);
  pln005.setRotation(1.5708, 0.0, -1.57);
  const pln005MZ = pln005.clone();
  pln005MZ.updateMatrixWorld(true);
  pln005.position.set(0, 0, 0.0898);
  pln005MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln005MZ.position.set(0, 0, -0.0907);
  const pln005MrZ = new THREE.Group();
  pln005MrZ.add(pln005, pln005MZ);
  pln005MrZ.position.set(0.6208, 0.4173, 0);
  const pln014 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln014.scale.set(0.0762, 0.089, 0.0743);
  pln014.setRotation(1.8353, 0.0, -1.3109);
  const pln014MZ = pln014.clone();
  pln014MZ.updateMatrixWorld(true);
  pln014.position.set(0, 0, 0.2646);
  pln014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln014MZ.position.set(0, 0, -0.2656);
  const pln014MrZ = new THREE.Group();
  pln014MrZ.add(pln014, pln014MZ);
  pln014MrZ.position.set(0.5405, 0.8172, 0);
  const pln015 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln015.scale.set(0.0565, 0.089, 0.0743);
  pln015.setRotation(1.8396, -0.0, -1.3866);
  const pln015MZ = pln015.clone();
  pln015MZ.updateMatrixWorld(true);
  pln015.position.set(0, 0, 0.2645);
  pln015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln015MZ.position.set(0, 0, -0.2655);
  const pln015MrZ = new THREE.Group();
  pln015MrZ.add(pln015, pln015MZ);
  pln015MrZ.position.set(0.5697, 0.6896, 0);
  const pln016 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln016.scale.set(0.0466, 0.089, 0.0743);
  pln016.setRotation(1.8417, 0.0, -1.4353);
  const pln016MZ = pln016.clone();
  pln016MZ.updateMatrixWorld(true);
  pln016.position.set(0, 0, 0.2645);
  pln016MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln016MZ.position.set(0, 0, -0.2654);
  const pln016MrZ = new THREE.Group();
  pln016MrZ.add(pln016, pln016MZ);
  pln016MrZ.position.set(0.586, 0.589, 0);
  const pln017 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln017.scale.set(0.0401, 0.089, 0.0743);
  pln017.setRotation(1.8436, 0.0, -1.5094);
  const pln017MZ = pln017.clone();
  pln017MZ.updateMatrixWorld(true);
  pln017.position.set(0, 0, 0.2644);
  pln017MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln017MZ.position.set(0, 0, -0.2654);
  const pln017MrZ = new THREE.Group();
  pln017MrZ.add(pln017, pln017MZ);
  pln017MrZ.position.set(0.5944, 0.5045, 0);
  const pln018 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln018.scale.set(0.0487, 0.089, 0.0743);
  pln018.setRotation(1.8427, -0.0014, -1.57);
  const pln018MZ = pln018.clone();
  pln018MZ.updateMatrixWorld(true);
  pln018.position.set(0, 0, 0.2644);
  pln018MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln018MZ.position.set(0, 0, -0.2654);
  const pln018MrZ = new THREE.Group();
  pln018MrZ.add(pln018, pln018MZ);
  pln018MrZ.position.set(0.5968, 0.4173, 0);
  const pln006 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln006.scale.set(0.0762, 0.089, 0.0743);
  pln006.setRotation(2.4592, 0.0, -1.3109);
  const pln006MZ = pln006.clone();
  pln006MZ.updateMatrixWorld(true);
  pln006.position.set(0, 0, 0.4066);
  pln006MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln006MZ.position.set(0, 0, -0.4076);
  const pln006MrZ = new THREE.Group();
  pln006MrZ.add(pln006, pln006MZ);
  pln006MrZ.position.set(0.4513, 0.7935, 0);
  const pln007 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln007.scale.set(0.0565, 0.089, 0.0743);
  pln007.setRotation(2.4694, -0.0, -1.3866);
  const pln007MZ = pln007.clone();
  pln007MZ.updateMatrixWorld(true);
  pln007.position.set(0, 0, 0.4059);
  pln007MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln007MZ.position.set(0, 0, -0.4069);
  const pln007MrZ = new THREE.Group();
  pln007MrZ.add(pln007, pln007MZ);
  pln007MrZ.position.set(0.4795, 0.6693, 0);
  const pln008 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln008.scale.set(0.0466, 0.089, 0.0743);
  pln008.setRotation(2.4745, 0.0, -1.4353);
  const pln008MZ = pln008.clone();
  pln008MZ.updateMatrixWorld(true);
  pln008.position.set(0, 0, 0.4054);
  pln008MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln008MZ.position.set(0, 0, -0.4063);
  const pln008MrZ = new THREE.Group();
  pln008MrZ.add(pln008, pln008MZ);
  pln008MrZ.position.set(0.4938, 0.5741, 0);
  const pln009 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln009.scale.set(0.0401, 0.089, 0.0743);
  pln009.setRotation(3.1283, 0.6462, -1.5345);
  const pln009MZ = pln009.clone();
  pln009MZ.updateMatrixWorld(true);
  pln009.position.set(0, 0, 0.4039);
  pln009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln009MZ.position.set(0, 0, -0.4049);
  const pln009MrZ = new THREE.Group();
  pln009MrZ.add(pln009, pln009MZ);
  pln009MrZ.position.set(0.5003, 0.494, 0);
  const pln011 = new THREE.Mesh(planeGeo, Washer_mainMaterialDS);
  pln011.scale.set(0.0487, 0.089, 0.0743);
  pln011.setRotation(2.4807, -0.0014, -1.57);
  const pln011MZ = pln011.clone();
  pln011MZ.updateMatrixWorld(true);
  pln011.position.set(0, 0, 0.4046);
  pln011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  pln011MZ.position.set(0, 0, -0.4056);
  const pln011MrZ = new THREE.Group();
  pln011MrZ.add(pln011, pln011MZ);
  pln011MrZ.position.set(0.5027, 0.4143, 0);
  const kub042 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub042.position.set(0.5929, 0.694, -0.0005);
  kub042.scale.set(0.0555, 0.0086, 0.013);
  kub042.setRotation(0.0, 0.0, -1.3866);

  const kub043 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub043.position.set(0.6094, 0.5931, -0.0005);
  kub043.scale.set(0.0471, 0.0086, 0.013);
  kub043.setRotation(0.0, 0.0, -1.4353);

  const kub044 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub044.position.set(0.6183, 0.5063, -0.0005);
  kub044.scale.set(0.0407, 0.0086, 0.013);
  kub044.setRotation(0.0, 0.0, -1.5094);

  const kub045 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub045.position.set(0.6208, 0.4262, -0.0005);
  kub045.scale.set(0.0401, 0.0086, 0.013);
  kub045.setRotation(0.0, 0.0, -1.57);

  const kub046 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub046.position.set(0.563, 0.8232, -0.0005);
  kub046.scale.set(0.0783, 0.0086, 0.013);
  kub046.setRotation(0.0, 0.0, -1.3109);

  const kub047 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub047.position.set(0.5037, 0.9733, -0.0005);
  kub047.scale.set(0.0861, 0.0086, 0.013);
  kub047.setRotation(0.0, 0.0, -1.0922);

  const kub048 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub048.position.set(0.5892, 0.3456, -0.0005);
  kub048.scale.set(0.0777, 0.0449, 0.2378);

  const kub049 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub049.scale.set(0.0449, 0.0676, 0.0536);
  kub049.setRotation(-1.5708, -1.338, -1.5708);
  const kub049MZ = kub049.clone();
  kub049MZ.updateMatrixWorld(true);
  kub049.position.set(0, 0, -0.2749);
  kub049MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub049MZ.position.set(0, 0, 0.2739);
  const kub049MrZ = new THREE.Group();
  kub049MrZ.add(kub049, kub049MZ);
  kub049MrZ.position.set(0.5887, 0.3456, 0);
  const kub050 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub050.scale.set(0.0449, 0.0676, 0.0607);
  kub050.setRotation(-1.0613, 0.0, -1.5708);
  const kub050MZ = kub050.clone();
  kub050MZ.updateMatrixWorld(true);
  kub050.position.set(0, 0, -0.4017);
  kub050MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub050MZ.position.set(0, 0, 0.4007);
  const kub050MrZ = new THREE.Group();
  kub050MrZ.add(kub050, kub050MZ);
  kub050MrZ.position.set(0.4855, 0.3456, 0);
  const kub051 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub051.scale.set(0.0449, 0.0676, 0.0566);
  kub051.setRotation(-0.6742, 0.0, -1.5708);
  const kub051MZ = kub051.clone();
  kub051MZ.updateMatrixWorld(true);
  kub051.position.set(0, 0, -0.3447);
  kub051MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub051MZ.position.set(0, 0, 0.3437);
  const kub051MrZ = new THREE.Group();
  kub051MrZ.add(kub051, kub051MZ);
  kub051MrZ.position.set(0.5539, 0.3456, 0);
  const kub052 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub052.scale.set(0.0449, 0.0676, 0.0634);
  kub052.setRotation(-1.4054, 0.0, -1.5708);
  const kub052MZ = kub052.clone();
  kub052MZ.updateMatrixWorld(true);
  kub052.position.set(0, 0, -0.4341);
  kub052MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub052MZ.position.set(0, 0, 0.4331);
  const kub052MrZ = new THREE.Group();
  kub052MrZ.add(kub052, kub052MZ);
  kub052MrZ.position.set(0.3918, 0.3456, 0);
  const kub053 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub053.scale.set(0.0449, 0.0676, 0.2967);
  kub053.setRotation(-1.7417, 0.0, -1.5708);
  const kub053MZ = kub053.clone();
  kub053MZ.updateMatrixWorld(true);
  kub053.position.set(0, 0, -0.3941);
  kub053MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub053MZ.position.set(0, 0, 0.3931);
  const kub053MrZ = new THREE.Group();
  kub053MrZ.add(kub053, kub053MZ);
  kub053MrZ.position.set(0.0596, 0.3456, 0);
  const kub072 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub072.position.set(0.253, 0.2265, -0.0005);
  kub072.scale.set(0.2689, 0.0995, 0.3515);

  const kub073 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub073.position.set(-0.0907, 0.4654, -0.0005);
  kub073.scale.set(0.5784, 0.0973, 0.3757);

  const kub074 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub074.scale.set(0.5784, 0.1078, 0.0355);
  kub074.setRotation(0.0, 0.0641, 0.0);
  const kub074MZ = kub074.clone();
  kub074MZ.updateMatrixWorld(true);
  kub074.position.set(0, 0, -0.386);
  kub074MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub074MZ.position.set(0, 0, 0.385);
  const kub074MrZ = new THREE.Group();
  kub074MrZ.add(kub074, kub074MZ);
  kub074MrZ.position.set(-0.1438, 0.4107, 0);
  const kub075 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub075.scale.set(0.5784, 0.0382, 0.0355);
  kub075.setRotation(0.0, 0.0641, 0.0);
  const kub075MZ = kub075.clone();
  kub075MZ.updateMatrixWorld(true);
  kub075.position.set(0, 0, -0.386);
  kub075MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub075MZ.position.set(0, 0, 0.385);
  const kub075MrZ = new THREE.Group();
  kub075MrZ.add(kub075, kub075MZ);
  kub075MrZ.position.set(-0.1438, 0.5567, 0);
  const kub076 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub076.scale.set(0.0555, 0.0086, 0.013);
  kub076.setRotation(-0.8986, 0.0, -1.3866);
  const kub076MZ = kub076.clone();
  kub076MZ.updateMatrixWorld(true);
  kub076.position.set(0, 0, -0.4561);
  kub076MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub076MZ.position.set(0, 0, 0.4551);
  const kub076MrZ = new THREE.Group();
  kub076MrZ.add(kub076, kub076MZ);
  kub076MrZ.position.set(0.4123, 0.6581, 0);
  const kub077 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub077.scale.set(0.0416, 0.0086, 0.013);
  kub077.setRotation(-0.9037, -0.0001, -1.4353);
  const kub077MZ = kub077.clone();
  kub077MZ.updateMatrixWorld(true);
  kub077.position.set(0, 0, -0.456);
  kub077MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub077MZ.position.set(0, 0, 0.455);
  const kub077MrZ = new THREE.Group();
  kub077MrZ.add(kub077, kub077MZ);
  kub077MrZ.position.set(0.428, 0.5632, 0);
  const kub078 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub078.scale.set(0.0682, 0.0086, 0.013);
  kub078.setRotation(-1.5549, -0.6436, -1.5405);
  const kub078MZ = kub078.clone();
  kub078MZ.updateMatrixWorld(true);
  kub078.position.set(0, 0, -0.4546);
  kub078MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub078MZ.position.set(0, 0, 0.4537);
  const kub078MrZ = new THREE.Group();
  kub078MrZ.add(kub078, kub078MZ);
  kub078MrZ.position.set(0.4351, 0.4555, 0);
  const kub080 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub080.scale.set(0.0783, 0.0086, 0.013);
  kub080.setRotation(-0.8884, -0.0, -1.3109);
  const kub080MZ = kub080.clone();
  kub080MZ.updateMatrixWorld(true);
  kub080.position.set(0, 0, -0.4562);
  kub080MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub080MZ.position.set(0, 0, 0.4553);
  const kub080MrZ = new THREE.Group();
  kub080MrZ.add(kub080, kub080MZ);
  kub080MrZ.position.set(0.3823, 0.7872, 0);
  const kub079 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub079.scale.set(0.5693, 0.0382, 0.0355);
  kub079.setRotation(0.0, 0.0641, 0.0);
  const kub079MZ = kub079.clone();
  kub079MZ.updateMatrixWorld(true);
  kub079.position.set(0, 0, -0.3854);
  kub079MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub079MZ.position.set(0, 0, 0.3844);
  const kub079MrZ = new THREE.Group();
  kub079MrZ.add(kub079, kub079MZ);
  kub079MrZ.position.set(-0.1529, 0.6332, 0);
  const kub081 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub081.scale.set(0.0449, 0.0676, 0.0536);
  kub081.setRotation(0.0, 0.2328, -1.1176);
  const kub081MZ = kub081.clone();
  kub081MZ.updateMatrixWorld(true);
  kub081.position.set(0, 0, -0.2677);
  kub081MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub081MZ.position.set(0, 0, 0.2668);
  const kub081MrZ = new THREE.Group();
  kub081MrZ.add(kub081, kub081MZ);
  kub081MrZ.position.set(0.5585, 0.3907, 0);
  const kub082 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub082.scale.set(0.0372, 0.056, 0.0444);
  kub082.setRotation(0.0, 0.2328, -1.1176);
  const kub082MZ = kub082.clone();
  kub082MZ.updateMatrixWorld(true);
  kub082.position.set(0, 0, -0.2715);
  kub082MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub082MZ.position.set(0, 0, 0.2705);
  const kub082MrZ = new THREE.Group();
  kub082MrZ.add(kub082, kub082MZ);
  kub082MrZ.position.set(0.5743, 0.3986, 0);
  const kub083 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub083.scale.set(0.5654, 0.0382, 0.0355);
  kub083.setRotation(0.0, 0.0641, 0.0);
  const kub083MZ = kub083.clone();
  kub083MZ.updateMatrixWorld(true);
  kub083.position.set(0, 0, -0.3851);
  kub083MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub083MZ.position.set(0, 0, 0.3842);
  const kub083MrZ = new THREE.Group();
  kub083MrZ.add(kub083, kub083MZ);
  kub083MrZ.position.set(-0.1568, 0.7097, 0);
  const kub084 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub084.scale.set(0.5537, 0.0382, 0.0355);
  kub084.setRotation(0.0, 0.0641, 0.0);
  const kub084MZ = kub084.clone();
  kub084MZ.updateMatrixWorld(true);
  kub084.position.set(0, 0, -0.3844);
  kub084MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub084MZ.position.set(0, 0, 0.3834);
  const kub084MrZ = new THREE.Group();
  kub084MrZ.add(kub084, kub084MZ);
  kub084MrZ.position.set(-0.1685, 0.7862, 0);
  const cyl010 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl010.scale.set(0.1549, 0.0604, 0.1549);
  cyl010.setRotation(1.5708, 0.0, 0.0);
  const cyl010MZ = cyl010.clone();
  cyl010MZ.updateMatrixWorld(true);
  cyl010.position.set(0, 0, 0.4147);
  cyl010MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl010MZ.position.set(0, 0, -0.4157);
  const cyl010MrZ = new THREE.Group();
  cyl010MrZ.add(cyl010, cyl010MZ);
  cyl010MrZ.position.set(0.2474, 0.1409, 0);
  const cyl011 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl011.scale.set(0.1293, 0.0086, 0.1293);
  cyl011.setRotation(1.5708, 0.0, 0.0);
  const cyl011MZ = cyl011.clone();
  cyl011MZ.updateMatrixWorld(true);
  cyl011.position.set(0, 0, 0.4746);
  cyl011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl011MZ.position.set(0, 0, -0.4756);
  const cyl011MrZ = new THREE.Group();
  cyl011MrZ.add(cyl011, cyl011MZ);
  cyl011MrZ.position.set(0.2474, 0.1409, 0);
  const cyl013 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl013.scale.set(0.0872, 0.0458, 0.0872);
  cyl013.setRotation(1.5708, 0.0, 0.0);
  const cyl013MZ = cyl013.clone();
  cyl013MZ.updateMatrixWorld(true);
  cyl013.position.set(0, 0, 0.2746);
  cyl013MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl013MZ.position.set(0, 0, -0.2755);
  const cyl013MrZ = new THREE.Group();
  cyl013MrZ.add(cyl013, cyl013MZ);
  cyl013MrZ.position.set(0.6385, 0.1628, 0);
  const kub086 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub086.scale.set(0.0388, 0.0299, 0.1104);
  kub086.setRotation(0.3098, 1.5708, 0.0);
  const kub086MZ = kub086.clone();
  kub086MZ.updateMatrixWorld(true);
  kub086.position.set(0, 0, 0.5);
  kub086MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub086MZ.position.set(0, 0, -0.5009);
  const kub086MrZ = new THREE.Group();
  kub086MrZ.add(kub086, kub086MZ);
  kub086MrZ.position.set(0.7549, 0.1227, 0);
  const kub088 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub088.scale.set(0.0335, 0.109, 0.0767);
  kub088.setRotation(1.5708, 1.309, -0.0);
  const kub088MZ = kub088.clone();
  kub088MZ.updateMatrixWorld(true);
  kub088.position.set(0, 0, 0.5241);
  kub088MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub088MZ.position.set(0, 0, -0.5251);
  const kub088MrZ = new THREE.Group();
  kub088MrZ.add(kub088, kub088MZ);
  kub088MrZ.position.set(0.9393, 0.0739, 0);
  const kub089 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub089.scale.set(0.0335, 0.109, 0.0767);
  kub089.setRotation(1.5708, 0.7854, -0.0);
  const kub089MZ = kub089.clone();
  kub089MZ.updateMatrixWorld(true);
  kub089.position.set(0, 0, 0.5313);
  kub089MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub089MZ.position.set(0, 0, -0.5323);
  const kub089MrZ = new THREE.Group();
  kub089MrZ.add(kub089, kub089MZ);
  kub089MrZ.position.set(0.9351, 0.0739, 0);
  const kub090 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub090.scale.set(0.0335, 0.109, 0.0767);
  kub090.setRotation(1.5708, 0.2618, -0.0);
  const kub090MZ = kub090.clone();
  kub090MZ.updateMatrixWorld(true);
  kub090.position.set(0, 0, 0.5355);
  kub090MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub090MZ.position.set(0, 0, -0.5364);
  const kub090MrZ = new THREE.Group();
  kub090MrZ.add(kub090, kub090MZ);
  kub090MrZ.position.set(0.9279, 0.0739, 0);
  const kub091 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub091.scale.set(0.0178, 0.0632, 0.0767);
  kub091.setRotation(1.5708, -0.0, -0.0);
  const kub091MZ = kub091.clone();
  kub091MZ.updateMatrixWorld(true);
  kub091.position.set(0, 0, 0.5862);
  kub091MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub091MZ.position.set(0, 0, -0.5871);
  const kub091MrZ = new THREE.Group();
  kub091MrZ.add(kub091, kub091MZ);
  kub091MrZ.position.set(0.906, 0.0739, 0);
  const kub093 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub093.scale.set(0.024, 0.0632, 0.0767);
  kub093.setRotation(1.5708, -0.3927, -0.0);
  const kub093MZ = kub093.clone();
  kub093MZ.updateMatrixWorld(true);
  kub093.position.set(0, 0, 0.5818);
  kub093MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub093MZ.position.set(0, 0, -0.5828);
  const kub093MrZ = new THREE.Group();
  kub093MrZ.add(kub093, kub093MZ);
  kub093MrZ.position.set(0.8902, 0.0739, 0);
  const kub094 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub094.scale.set(0.024, 0.0388, 0.0767);
  kub094.setRotation(1.5708, -1.1781, -0.0);
  const kub094MZ = kub094.clone();
  kub094MZ.updateMatrixWorld(true);
  kub094.position.set(0, 0, 0.5939);
  kub094MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub094MZ.position.set(0, 0, -0.5949);
  const kub094MrZ = new THREE.Group();
  kub094MrZ.add(kub094, kub094MZ);
  kub094MrZ.position.set(0.8705, 0.0739, 0);
  const kub095 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub095.scale.set(0.0333, 0.0388, 0.0767);
  kub095.setRotation(1.5708, 1.5708, -0.0);
  const kub095MZ = kub095.clone();
  kub095MZ.updateMatrixWorld(true);
  kub095.position.set(0, 0, 0.5533);
  kub095MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub095MZ.position.set(0, 0, -0.5543);
  const kub095MrZ = new THREE.Group();
  kub095MrZ.add(kub095, kub095MZ);
  kub095MrZ.position.set(0.8643, 0.0739, 0);
  const kub087 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub087.scale.set(0.0847, 0.5837, 0.089);
  kub087.setRotation(0.2645, 0.0, -1.3109);
  const kub087MZ = kub087.clone();
  kub087MZ.updateMatrixWorld(true);
  kub087.position.set(0, 0, 0.112);
  kub087MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub087MZ.position.set(0, 0, -0.113);
  const kub087MrZ = new THREE.Group();
  kub087MrZ.add(kub087, kub087MZ);
  kub087MrZ.position.set(-0.0454, 0.828, 0);
  const kub096 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub096.scale.set(0.0847, 0.3559, 0.089);
  kub096.setRotation(0.8884, 0.0, -1.3109);
  const kub096MZ = kub096.clone();
  kub096MZ.updateMatrixWorld(true);
  kub096.position.set(0, 0, 0.1304);
  kub096MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub096MZ.position.set(0, 0, -0.1314);
  const kub096MrZ = new THREE.Group();
  kub096MrZ.add(kub096, kub096MZ);
  kub096MrZ.position.set(0.193, 0.8914, 0);
  const kub097 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub097.scale.set(0.0861, 0.0086, 0.013);
  kub097.setRotation(1.4046, 0.6992, 0.2008);
  const kub097MZ = kub097.clone();
  kub097MZ.updateMatrixWorld(true);
  kub097.position.set(0, 0, 0.4005);
  kub097MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub097MZ.position.set(0, 0, -0.4015);
  const kub097MrZ = new THREE.Group();
  kub097MrZ.add(kub097, kub097MZ);
  kub097MrZ.position.set(0.3904, 1.0188, 0);
  const kub098 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub098.scale.set(0.5438, 0.0454, 0.0355);
  kub098.setRotation(0.0, 0.0641, 0.0);
  const kub098MZ = kub098.clone();
  kub098MZ.updateMatrixWorld(true);
  kub098.position.set(0, 0, -0.3837);
  kub098MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub098MZ.position.set(0, 0, 0.3828);
  const kub098MrZ = new THREE.Group();
  kub098MrZ.add(kub098, kub098MZ);
  kub098MrZ.position.set(-0.1784, 0.8698, 0);
  const kub099 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub099.scale.set(0.5438, 0.3097, 0.1828);
  kub099.setRotation(0.0, 0.0641, 0.0);
  const kub099MZ = kub099.clone();
  kub099MZ.updateMatrixWorld(true);
  kub099.position.set(0, 0, -0.1658);
  kub099MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub099MZ.position.set(0, 0, 0.1649);
  const kub099MrZ = new THREE.Group();
  kub099MrZ.add(kub099, kub099MZ);
  kub099MrZ.position.set(-0.1644, 0.6126, 0);
  const kub100 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub100.scale.set(0.0449, 0.0676, 0.3383);
  kub100.setRotation(1.5149, 0.0, -1.5708);
  const kub100MZ = kub100.clone();
  kub100MZ.updateMatrixWorld(true);
  kub100.position.set(0, 0, -0.3506);
  kub100MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub100MZ.position.set(0, 0, 0.3496);
  const kub100MrZ = new THREE.Group();
  kub100MrZ.add(kub100, kub100MZ);
  kub100MrZ.position.set(-0.4006, 0.3456, 0);
  const kub101 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub101.scale.set(0.3095, 0.0126, 0.013);
  kub101.setRotation(-1.5708, 0.0641, -1.5708);
  const kub101MZ = kub101.clone();
  kub101MZ.updateMatrixWorld(true);
  kub101.position.set(0, 0, -0.3832);
  kub101MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub101MZ.position.set(0, 0, 0.3822);
  const kub101MrZ = new THREE.Group();
  kub101MrZ.add(kub101, kub101MZ);
  kub101MrZ.position.set(-0.7233, 0.6164, 0);
  const kub102 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub102.scale.set(0.0277, 0.0114, 0.0581);
  kub102.setRotation(1.4661, 1.9292, -0.6546);
  const kub102MZ = kub102.clone();
  kub102MZ.updateMatrixWorld(true);
  kub102.position.set(0, 0, -0.461);
  kub102MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub102MZ.position.set(0, 0, 0.4601);
  const kub102MrZ = new THREE.Group();
  kub102MrZ.add(kub102, kub102MZ);
  kub102MrZ.position.set(0.3396, 0.5026, 0);
  const cyl014 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl014.scale.set(0.0495, 0.0125, 0.0495);
  cyl014.setRotation(1.4661, 1.9292, -0.6546);
  const cyl014MZ = cyl014.clone();
  cyl014MZ.updateMatrixWorld(true);
  cyl014.position.set(0, 0, -0.5081);
  cyl014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl014MZ.position.set(0, 0, 0.5071);
  const cyl014MrZ = new THREE.Group();
  cyl014MrZ.add(cyl014, cyl014MZ);
  cyl014MrZ.position.set(0.312, 0.5726, 0);
  const cyl015 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl015.scale.set(0.0392, 0.0099, 0.0392);
  cyl015.setRotation(1.4661, 1.9292, -0.6546);
  const cyl015MZ = cyl015.clone();
  cyl015MZ.updateMatrixWorld(true);
  cyl015.position.set(0, 0, -0.5127);
  cyl015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl015MZ.position.set(0, 0, 0.5117);
  const cyl015MrZ = new THREE.Group();
  cyl015MrZ.add(cyl015, cyl015MZ);
  cyl015MrZ.position.set(0.3223, 0.5735, 0);
  const cyl016 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl016.position.set(-0.6668, 0.1409, -0.0005);
  cyl016.scale.set(-0.1354, -0.0673, -0.1354);
  cyl016.setRotation(1.5708, 0.0, 0.0);

  const cyl017 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl017.position.set(-0.6668, 0.1409, -0.0005);
  cyl017.scale.set(0.1549, 0.0604, 0.1549);
  cyl017.setRotation(1.5708, 0.0, 0.0);

  const kub085 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub085.scale.set(0.345, 0.3137, 0.2025);
  kub085.setRotation(0.0, 0.0641, 0.0);
  const kub085MZ = kub085.clone();
  kub085MZ.updateMatrixWorld(true);
  kub085.position.set(0, 0, -0.0847);
  kub085MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub085MZ.position.set(0, 0, 0.0837);
  const kub085MrZ = new THREE.Group();
  kub085MrZ.add(kub085, kub085MZ);
  kub085MrZ.position.set(-0.4076, 0.5014, 0);
  const kub103 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub103.position.set(-0.7408, 0.5486, -0.0005);
  kub103.scale.set(-0.068, -0.122, -0.122);
  kub103.setRotation(0.0, 0.0, -0.3156);

  const kub104 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub104.scale.set(0.0865, 0.5837, 0.089);
  kub104.setRotation(0.0, 0.0, -1.0914);
  const kub104MZ = kub104.clone();
  kub104MZ.updateMatrixWorld(true);
  kub104.position.set(0, 0, 0.0898);
  kub104MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub104MZ.position.set(0, 0, -0.0907);
  const kub104MrZ = new THREE.Group();
  kub104MrZ.add(kub104, kub104MZ);
  kub104MrZ.position.set(-0.0144, 0.7044, 0);
  const kub105 = new THREE.Mesh(boxGeo, Washer_mainMaterial);
  kub105.scale.set(0.0847, 0.5828, 0.089);
  kub105.setRotation(0.0, 0.0, -1.3109);
  const kub105MZ = kub105.clone();
  kub105MZ.updateMatrixWorld(true);
  kub105.position.set(0, 0, -0.0895);
  kub105MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub105MZ.position.set(0, 0, 0.0885);
  const kub105MrZ = new THREE.Group();
  kub105MrZ.add(kub105, kub105MZ);
  kub105MrZ.position.set(-0.0782, 0.8192, 0);
  const kub106 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub106.scale.set(0.0783, 0.0086, 0.013);
  kub106.setRotation(-0.8884, -0.0, -1.3109);
  const kub106MZ = kub106.clone();
  kub106MZ.updateMatrixWorld(true);
  kub106.position.set(0, 0, -0.4562);
  kub106MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub106MZ.position.set(0, 0, 0.4553);
  const kub106MrZ = new THREE.Group();
  kub106MrZ.add(kub106, kub106MZ);
  kub106MrZ.position.set(0.3421, 0.9384, 0);
  const kub107 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub107.scale.set(0.5328, 0.0126, 0.013);
  kub107.setRotation(1.5708, 0.0641, -3.1416);
  const kub107MZ = kub107.clone();
  kub107MZ.updateMatrixWorld(true);
  kub107.position.set(0, 0, -0.4181);
  kub107MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub107MZ.position.set(0, 0, 0.4172);
  const kub107MrZ = new THREE.Group();
  kub107MrZ.add(kub107, kub107MZ);
  kub107MrZ.position.set(-0.1835, 0.9129, 0);
  const kub108 = new THREE.Mesh(boxGeo, kub108Material);
  kub108.scale.set(0.0319, 0.0539, 0.0095);
  kub108.setRotation(1.5149, 0.0, -1.5708);
  const kub108MZ = kub108.clone();
  kub108MZ.updateMatrixWorld(true);
  kub108.position.set(0, 0, -0.3317);
  kub108MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub108MZ.position.set(0, 0, 0.3307);
  const kub108MrZ = new THREE.Group();
  kub108MrZ.add(kub108, kub108MZ);
  kub108MrZ.position.set(-0.7324, 0.3456, 0);
  const kub109 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub109.scale.set(0.0293, 0.0495, 0.0042);
  kub109.setRotation(1.5149, 0.0, -1.5708);
  const kub109MZ = kub109.clone();
  kub109MZ.updateMatrixWorld(true);
  kub109.position.set(0, 0, -0.3311);
  kub109MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub109MZ.position.set(0, 0, 0.3302);
  const kub109MrZ = new THREE.Group();
  kub109MrZ.add(kub109, kub109MZ);
  kub109MrZ.position.set(-0.7422, 0.3456, 0);
  const cyl018 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl018.position.set(-0.6668, 0.1409, -0.0005);
  cyl018.scale.set(-0.0317, -0.1797, -0.0317);
  cyl018.setRotation(1.5708, 0.0, 0.0);

  const kub110 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub110.scale.set(-0.0358, -0.0754, -0.0358);
  kub110.setRotation(0.0, 0.0, -0.7854);
  const kub110MZ = kub110.clone();
  kub110MZ.updateMatrixWorld(true);
  kub110.position.set(0, 0, 0.1288);
  kub110MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub110MZ.position.set(0, 0, -0.1298);
  const kub110MrZ = new THREE.Group();
  kub110MrZ.add(kub110, kub110MZ);
  kub110MrZ.position.set(-0.6403, 0.1674, 0);
  const cyl019 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl019.scale.set(0.1012, 0.0067, 0.1012);
  cyl019.setRotation(1.5708, 0.0, 0.0);
  const cyl019MZ = cyl019.clone();
  cyl019MZ.updateMatrixWorld(true);
  cyl019.position.set(0, 0, 0.4813);
  cyl019MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl019MZ.position.set(0, 0, -0.4822);
  const cyl019MrZ = new THREE.Group();
  cyl019MrZ.add(cyl019, cyl019MZ);
  cyl019MrZ.position.set(0.2474, 0.1409, 0);
  const cyl020 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
  cyl020.position.set(-0.6668, 0.1409, -0.0005);
  cyl020.scale.set(-0.0284, -0.1868, -0.0284);
  cyl020.setRotation(1.5708, 0.0, 0.0);

  const kub111 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub111.position.set(-0.7408, 0.3941, -0.0005);
  kub111.scale.set(-0.068, -0.0905, -0.0741);

  const cyl021 = new THREE.Mesh(cylinderGeo, Blue_PictureMaterial);
  cyl021.position.set(-0.777, 0.6567, -0.0954);
  cyl021.scale.set(0.0196, 0.0044, 0.0196);
  cyl021.setRotation(0.0, -0.0, 1.2552);

  const cyl022 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl022.position.set(-0.7865, 0.6277, -0.0411);
  cyl022.scale.set(0.0196, 0.0044, 0.0196);
  cyl022.setRotation(0.0, -0.0, 1.2552);

  const cyl023 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl023.position.set(-0.777, 0.6567, 0.0131);
  cyl023.scale.set(0.0196, 0.0044, 0.0196);
  cyl023.setRotation(0.0, -0.0, 1.2552);

  const cyl024 = new THREE.Mesh(cylinderGeo, Train_blueMaterial);
  cyl024.position.set(-0.7865, 0.6277, 0.0673);
  cyl024.scale.set(0.0196, 0.0044, 0.0196);
  cyl024.setRotation(0.0, -0.0, 1.2552);

  const kub112 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub112.position.set(-0.833, 0.4853, -0.0005);
  kub112.scale.set(-0.0059, -0.0233, -0.1071);
  kub112.setRotation(0.0, 0.0, -0.3156);

  const kub113 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub113.position.set(-0.8328, 0.5005, -0.0005);
  kub113.scale.set(-0.0059, -0.0048, -0.1029);
  kub113.setRotation(0.0, 0.0, -0.3156);

  const kub114 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub114.position.set(-0.842, 0.4724, -0.0005);
  kub114.scale.set(-0.0059, -0.0048, -0.1029);
  kub114.setRotation(0.0, 0.0, -0.3156);

  const kub115 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub115.position.set(-0.8374, 0.4865, 0.0976);
  kub115.scale.set(-0.0059, -0.0048, -0.0118);
  kub115.setRotation(-1.5708, 0.0, -0.3156);

  const kub116 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub116.position.set(-0.8374, 0.4865, -0.0986);
  kub116.scale.set(-0.0059, -0.0048, -0.0118);
  kub116.setRotation(-1.5708, 0.0, -0.3156);

  const cyl025 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl025.position.set(-0.8762, 0.4994, 0.0796);
  cyl025.scale.set(0.007, 0.0613, 0.007);
  cyl025.setRotation(0.4012, 0.0, 1.2552);

  const sphere = new THREE.Mesh(sphereGeo, Green_PictureMaterial);
  sphere.position.set(-0.9298, 0.5169, 0.1035);
  sphere.scale.set(0.0139, 0.0139, 0.0139);
  sphere.setRotation(0.4012, 0.0, 1.2552);

  const cyl026 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl026.position.set(-0.8149, 0.5407, -0.0904);
  cyl026.scale.set(0.0156, 0.0044, 0.0156);
  cyl026.setRotation(0.0, -0.0, 1.2552);

  const cyl027 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl027.position.set(-0.8253, 0.5441, -0.0904);
  cyl027.scale.set(0.0121, 0.0101, 0.0121);
  cyl027.setRotation(0.0, -0.0, 1.2552);

  const kub117 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub117.position.set(-0.8245, 0.5566, -0.0904);
  kub117.scale.set(-0.0053, -0.0053, -0.0015);
  kub117.setRotation(0.0, 0.0, 1.2552);

  const kub118 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub118.position.set(-0.8318, 0.5341, -0.0904);
  kub118.scale.set(-0.0053, -0.0053, -0.0015);
  kub118.setRotation(0.0, 0.0, 1.2552);

  const cyl028 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl028.position.set(-0.8149, 0.5408, -0.0348);
  cyl028.scale.set(0.0156, 0.0044, 0.0156);
  cyl028.setRotation(1.1034, -1.2201, 0.8109);

  const cyl029 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl029.position.set(-0.8253, 0.5442, -0.0348);
  cyl029.scale.set(0.0121, 0.0101, 0.0121);
  cyl029.setRotation(1.1034, -1.2201, 0.8109);

  const kub119 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub119.position.set(-0.8254, 0.5539, -0.0425);
  kub119.scale.set(-0.0053, -0.0053, -0.0015);
  kub119.setRotation(-1.1034, 1.2201, 0.8109);

  const kub120 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub120.position.set(-0.831, 0.5368, -0.0272);
  kub120.scale.set(-0.0053, -0.0053, -0.0015);
  kub120.setRotation(-1.1034, 1.2201, 0.8109);

  const cyl030 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl030.position.set(-0.8148, 0.541, 0.032);
  cyl030.scale.set(0.0156, 0.0044, 0.0156);
  cyl030.setRotation(-1.2537, 1.6022, -0.0959);

  const cyl031 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl031.position.set(-0.8253, 0.5444, 0.032);
  cyl031.scale.set(0.0121, 0.0101, 0.0121);
  cyl031.setRotation(-1.2537, 1.6022, -0.0959);

  const kub121 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub121.position.set(-0.8286, 0.544, 0.0438);
  kub121.scale.set(-0.0053, -0.0053, -0.0015);
  kub121.setRotation(1.2537, -1.6022, -0.0959);

  const kub122 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub122.position.set(-0.8279, 0.5463, 0.0202);
  kub122.scale.set(-0.0053, -0.0053, -0.0015);
  kub122.setRotation(1.2537, -1.6022, -0.0959);

  const cyl032 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl032.position.set(-0.8149, 0.5408, 0.09);
  cyl032.scale.set(0.0156, 0.0044, 0.0156);
  cyl032.setRotation(1.0361, 4.2732, -0.9159);

  const cyl033 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl033.position.set(-0.8253, 0.5442, 0.09);
  cyl033.scale.set(0.0121, 0.0101, 0.0121);
  cyl033.setRotation(1.0361, 4.2732, -0.9159);

  const kub123 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub123.position.set(-0.8312, 0.5359, 0.0835);
  kub123.scale.set(-0.0053, -0.0053, -0.0015);
  kub123.setRotation(-1.0361, -4.2732, -0.9159);

  const kub124 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub124.position.set(-0.8251, 0.5546, 0.0966);
  kub124.scale.set(-0.0053, -0.0053, -0.0015);
  kub124.setRotation(-1.0361, -4.2732, -0.9159);

  const cyl034 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl034.scale.set(0.0162, 0.0722, 0.0162);
  cyl034.setRotation(0.0, 0.0, -0.0);
  const cyl034MZ = cyl034.clone();
  cyl034MZ.updateMatrixWorld(true);
  cyl034.position.set(0, 0, -0.0988);
  cyl034MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl034MZ.position.set(0, 0, 0.0979);
  const cyl034MrZ = new THREE.Group();
  cyl034MrZ.add(cyl034, cyl034MZ);
  cyl034MrZ.position.set(-0.7787, 0.3851, 0);
  const sph001 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph001.scale.set(0.0178, 0.0178, 0.0178);
  sph001.setRotation(0.0, 0.0, 0.0);
  const sph001MZ = sph001.clone();
  sph001MZ.updateMatrixWorld(true);
  sph001.position.set(0, 0, -0.0988);
  sph001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph001MZ.position.set(0, 0, 0.0979);
  const sph001MrZ = new THREE.Group();
  sph001MrZ.add(sph001, sph001MZ);
  sph001MrZ.position.set(-0.7787, 0.3129, 0);
  const cyl035 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl035.scale.set(0.0162, 0.1045, 0.0162);
  cyl035.setRotation(0.6981, 0.0, 0.0);
  const cyl035MZ = cyl035.clone();
  cyl035MZ.updateMatrixWorld(true);
  cyl035.position.set(0, 0, -0.1652);
  cyl035MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl035MZ.position.set(0, 0, 0.1642);
  const cyl035MrZ = new THREE.Group();
  cyl035MrZ.add(cyl035, cyl035MZ);
  cyl035MrZ.position.set(-0.7787, 0.2339, 0);
  const sph002 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph002.scale.set(0.0178, 0.0178, 0.0178);
  sph002.setRotation(0.0, 0.0, 0.0);
  const sph002MZ = sph002.clone();
  sph002MZ.updateMatrixWorld(true);
  sph002.position.set(0, 0, -0.2324);
  sph002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph002MZ.position.set(0, 0, 0.2314);
  const sph002MrZ = new THREE.Group();
  sph002MrZ.add(sph002, sph002MZ);
  sph002MrZ.position.set(-0.7787, 0.1538, 0);
  const cyl036 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl036.scale.set(0.0162, 0.3859, 0.0162);
  cyl036.setRotation(0.0, 0.0, -1.5708);
  const cyl036MZ = cyl036.clone();
  cyl036MZ.updateMatrixWorld(true);
  cyl036.position.set(0, 0, -0.2324);
  cyl036MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl036MZ.position.set(0, 0, 0.2314);
  const cyl036MrZ = new THREE.Group();
  cyl036MrZ.add(cyl036, cyl036MZ);
  cyl036MrZ.position.set(-0.3951, 0.1538, 0);
  const kub125 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub125.scale.set(0.5438, 0.0871, 0.1828);
  kub125.setRotation(-0.0041, 0.0643, 0.0637);
  const kub125MZ = kub125.clone();
  kub125MZ.updateMatrixWorld(true);
  kub125.position.set(0, 0, -0.144);
  kub125MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub125MZ.position.set(0, 0, 0.1431);
  const kub125MrZ = new THREE.Group();
  kub125MrZ.add(kub125, kub125MZ);
  kub125MrZ.position.set(-0.1368, 0.9015, 0);
  const kub126 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub126.scale.set(0.0908, 0.0086, 0.013);
  kub126.setRotation(1.3195, 1.3148, 0.0672);
  const kub126MZ = kub126.clone();
  kub126MZ.updateMatrixWorld(true);
  kub126.position.set(0, 0, 0.263);
  kub126MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub126MZ.position.set(0, 0, -0.2639);
  const kub126MrZ = new THREE.Group();
  kub126MrZ.add(kub126, kub126MZ);
  kub126MrZ.position.set(0.4752, 1.0414, 0);
  const kub127 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub127.scale.set(0.0849, 0.0086, 0.0036);
  kub127.setRotation(0.2645, 0.0, -1.3109);
  const kub127MZ = kub127.clone();
  kub127MZ.updateMatrixWorld(true);
  kub127.position.set(0, 0, 0.1793);
  kub127MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub127MZ.position.set(0, 0, -0.1802);
  const kub127MrZ = new THREE.Group();
  kub127MrZ.add(kub127, kub127MZ);
  kub127MrZ.position.set(0.5156, 0.9777, 0);
  kub127MrZ.setRotation(0.2645, 0.0, -1.3109);
  const kub127MrZMZ = kub127MrZ.clone();
  kub127MrZMZ.updateMatrixWorld(true);
  kub127MrZ.position.set(0, 0, 0.1793);
  kub127MrZMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub127MrZMZ.position.set(0, 0, -0.1802);
  const kub127MrZMrZ = new THREE.Group();
  kub127MrZMrZ.add(kub127MrZ, kub127MrZMZ);
  kub127MrZMrZ.position.set(0.5156, 0.9777, 0);
  const cyl037 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl037.position.set(0.9595, 0.1429, -0.0005);
  cyl037.scale.set(0.0817, 0.1676, 0.0817);
  cyl037.setRotation(1.5708, 0.0, 0.0);

  const sph003 = new THREE.Mesh(sphereGeo, ColoumnMaterial);
  sph003.scale.set(0.08, 0.08, 0.08);
  sph003.setRotation(1.5708, 0.0, 0.0);
  const sph003MZ = sph003.clone();
  sph003MZ.updateMatrixWorld(true);
  sph003.position.set(0, 0, -0.1681);
  sph003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph003MZ.position.set(0, 0, 0.1671);
  const sph003MrZ = new THREE.Group();
  sph003MrZ.add(sph003, sph003MZ);
  sph003MrZ.position.set(0.9595, 0.1429, 0);
  const kub128 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub128.position.set(0.7502, 0.2067, -0.0005);
  kub128.scale.set(0.1506, 0.042, 0.233);
  kub128.setRotation(0.3098, 1.5708, 0.0);

  const kub129 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub129.position.set(0.7526, 0.2428, -0.0005);
  kub129.scale.set(0.0423, 0.0157, 0.233);
  kub129.setRotation(0.3098, 1.5708, 0.0);

  const robot = new THREE.Group();
  robot.add(
    kub038,
    kub039,
    cyl008,
    cyl009MrZ,
    pln001MrZ,
    pln002MrZ,
    pln003MrZ,
    pln004MrZ,
    pln005MrZ,
    pln014MrZ,
    pln015MrZ,
    pln016MrZ,
    pln017MrZ,
    pln018MrZ,
    pln006MrZ,
    pln007MrZ,
    pln008MrZ,
    pln009MrZ,
    pln011MrZ,
    kub042,
    kub043,
    kub044,
    kub045,
    kub046,
    kub047,
    kub048,
    kub049MrZ,
    kub050MrZ,
    kub051MrZ,
    kub052MrZ,
    kub053MrZ,
    kub072,
    kub073,
    kub074MrZ,
    kub075MrZ,
    kub076MrZ,
    kub077MrZ,
    kub078MrZ,
    kub080MrZ,
    kub079MrZ,
    kub081MrZ,
    kub082MrZ,
    kub083MrZ,
    kub084MrZ,
    cyl010MrZ,
    cyl011MrZ,
    cyl013MrZ,
    kub086MrZ,
    kub088MrZ,
    kub089MrZ,
    kub090MrZ,
    kub091MrZ,
    kub093MrZ,
    kub094MrZ,
    kub095MrZ,
    kub087MrZ,
    kub096MrZ,
    kub097MrZ,
    kub098MrZ,
    kub099MrZ,
    kub100MrZ,
    kub101MrZ,
    kub102MrZ,
    cyl014MrZ,
    cyl015MrZ,
    cyl016,
    cyl017,
    kub085MrZ,
    kub103,
    kub104MrZ,
    kub105MrZ,
    kub106MrZ,
    kub107MrZ,
    kub108MrZ,
    kub109MrZ,
    cyl018,
    kub110MrZ,
    cyl019MrZ,
    cyl020,
    kub111,
    cyl021,
    cyl022,
    cyl023,
    cyl024,
    kub112,
    kub113,
    kub114,
    kub115,
    kub116,
    cyl025,
    sphere,
    cyl026,
    cyl027,
    kub117,
    kub118,
    cyl028,
    cyl029,
    kub119,
    kub120,
    cyl030,
    cyl031,
    kub121,
    kub122,
    cyl032,
    cyl033,
    kub123,
    kub124,
    cyl034MrZ,
    sph001MrZ,
    cyl035MrZ,
    sph002MrZ,
    cyl036MrZ,
    kub125MrZ,
    kub126MrZ,
    kub127MrZMrZ,
    cyl037,
    sph003MrZ,
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
  const cylbrushesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2254, 0.0735, 0.8924),
  });
  const Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1.0, 1.0, 1.0),
    metalness: 1.0,
    roughness: 0.5,
  });

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const cylbody = new THREE.Mesh(cylinderGeo, Material_002);
  cylbody.position.set(0.0, 0.1347, -0.0);
  cylbody.scale.set(0.5636, -0.0994, 0.5636);

  const cylwheel2 = new THREE.Mesh(cylinderGeo, Material_001);
  cylwheel2.position.set(-0.3844, 0.0394, 0.2595);
  cylwheel2.scale.set(-0.0516, -0.0176, -0.0515);
  cylwheel2.setRotation(1.8196, -4.5347, 1.5422);

  const sphsupport = new THREE.Mesh(sphereGeo, Material_006);
  sphsupport.position.set(0.0, 0.0515, -0.4844);
  sphsupport.scale.set(0.0434, 0.0434, 0.0434);

  const cylwheel3 = new THREE.Mesh(cylinderGeo, Material_001);
  cylwheel3.position.set(0.0001, 0.0052, -0.4846);
  cylwheel3.scale.set(-0.0159, -0.0054, -0.0158);
  cylwheel3.setRotation(1.8196, -1.8235, 1.5422);

  const cylwheel1 = new THREE.Mesh(cylinderGeo, Material_001);
  cylwheel1.position.set(0.3747, 0.0394, 0.2595);
  cylwheel1.scale.set(-0.0516, -0.0176, -0.0515);
  cylwheel1.setRotation(-1.322, -2.628, 1.5994);

  const kubdisplay = new THREE.Mesh(boxGeo, Material_007);
  kubdisplay.position.set(0.0, 0.2231, -0.0);
  kubdisplay.scale.set(-0.2711, -0.0151, -0.2711);

  const cylbutton_off = new THREE.Mesh(cylinderGeo, Material_005);
  cylbutton_off.position.set(0.0516, 0.2185, -0.4293);
  cylbutton_off.scale.set(0.0227, 0.0227, 0.0227);

  const cylbutton_on = new THREE.Mesh(cylinderGeo, Material_003);
  cylbutton_on.position.set(-0.0509, 0.2185, -0.4293);
  cylbutton_on.scale.set(0.0227, 0.0227, 0.0227);

  const cylbrushes = new THREE.Mesh(cylinderGeo, cylbrushesMaterial);
  cylbrushes.position.set(0.0, 0.0858, -0.0);
  cylbrushes.scale.set(0.0802, 0.28, 0.0802);
  cylbrushes.setRotation(0.0, 0.0, -1.5708);

  const kubantenna1 = new THREE.Mesh(boxGeo, Material);
  kubantenna1.position.set(-0.441, 0.3083, -0.0);
  kubantenna1.scale.set(-0.0949, -0.0088, -0.0041);
  kubantenna1.setRotation(0.0, 0.0, -1.0986);

  const kubantenna2 = new THREE.Mesh(boxGeo, Material);
  kubantenna2.position.set(0.4558, 0.3083, -0.0);
  kubantenna2.scale.set(-0.0949, -0.0088, -0.0041);
  kubantenna2.setRotation(0.0, 3.1416, -1.0986);

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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const kub307 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub307.position.set(0.0127, 6.3994, -1.6438);
  kub307.scale.set(12.5105, 0.1214, 0.8001);
  kub307.setRotation(-0.2859, 0.0, 0.0);

  const kub308 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub308.position.set(0.0127, 6.725, -0.7205);
  kub308.scale.set(12.5105, 0.1214, 0.2164);
  kub308.setRotation(1.5708, 0.0, 0.0);

  const kub309 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub309.position.set(0.0127, 6.725, -0.6018);
  kub309.scale.set(12.4539, 0.0107, 0.1974);
  kub309.setRotation(1.5708, 0.0, 0.0);

  const cyl021Gr = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const cyl021 = new THREE.Mesh(cylinderGeo, Metall_RustMaterial);
    cyl021.scale.set(0.3252, 0.052, 0.3252);
    cyl021.position.set(-2.732 * i, 0, 0);
    cyl021Gr.add(cyl021);
  }
  cyl021Gr.position.set(10.931, 6.8703, 0.006);
  const sph002Gr = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const sph002 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
    sph002.scale.set(0.2453, 0.2164, 0.2453);
    sph002.position.set(-2.7314 * i, 0, 0);
    sph002Gr.add(sph002);
  }
  sph002Gr.position.set(10.931, 6.8266, 0.006);
  const kub310Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub310 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub310.scale.set(0.0702, 0.2701, 0.4985);
    kub310.position.set(6.4288 * i, 0, 0);
    kub310Gr.add(kub310);
  }
  kub310Gr.position.set(-8.4084, 2.5756, -1.8708);
  const kub311Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub311 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub311.scale.set(0.0702, 0.1597, 0.5837);
    kub311.position.set(6.4288 * i, 0, 0);
    kub311Gr.add(kub311);
  }
  kub311Gr.position.set(-8.4084, 3.0054, -1.7856);
  const kub312Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub312 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub312.scale.set(0.0702, 0.1597, 0.2747);
    kub312.position.set(6.4288 * i, 0, 0);
    kub312Gr.add(kub312);
  }
  kub312Gr.setRotation(1.5708, 0.0, 0.0);
  kub312Gr.position.set(-8.4084, 3.4397, -2.2097);
  const kub313Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub313 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub313.scale.set(0.0702, 0.1264, 0.2747);
    kub313.position.set(6.4288 * i, 0, 0);
    kub313Gr.add(kub313);
  }
  kub313Gr.setRotation(3.1416, 0.0, 0.0);
  kub313Gr.position.set(-8.4084, 3.8408, -2.0946);
  const kub314Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub314 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub314.scale.set(0.0702, 0.1264, 0.3091);
    kub314.position.set(6.4288 * i, 0, 0);
    kub314Gr.add(kub314);
  }
  kub314Gr.setRotation(1.9635, 0.0, 0.0);
  kub314Gr.position.set(-8.4084, 3.4772, -2.055);
  const kub315Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub315 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub315.scale.set(0.0702, 0.1519, 0.4307);
    kub315.position.set(6.4288 * i, 0, 0);
    kub315Gr.add(kub315);
  }
  kub315Gr.setRotation(0.3405, 0.0, 0.0);
  kub315Gr.position.set(-8.4084, 3.1657, -1.6586);
  const kub316Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub316 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub316.scale.set(0.0702, 0.1519, 0.2855);
    kub316.position.set(6.4288 * i, 0, 0);
    kub316Gr.add(kub316);
  }
  kub316Gr.setRotation(1.8909, 0.0, -0.0);
  kub316Gr.position.set(-8.4084, 2.6225, -1.4359);
  const kub317Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub317 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub317.scale.set(0.0702, 0.2701, 0.4985);
    kub317.position.set(6.4288 * i, 0, 0);
    kub317Gr.add(kub317);
  }
  kub317Gr.position.set(-4.4057, 2.5756, -1.8708);
  const kub318Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub318 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub318.scale.set(0.0702, 0.1597, 0.5837);
    kub318.position.set(6.4288 * i, 0, 0);
    kub318Gr.add(kub318);
  }
  kub318Gr.position.set(-4.4057, 3.0054, -1.7856);
  const kub319Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub319 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub319.scale.set(0.0702, 0.1597, 0.2747);
    kub319.position.set(6.4288 * i, 0, 0);
    kub319Gr.add(kub319);
  }
  kub319Gr.setRotation(1.5708, 0.0, 0.0);
  kub319Gr.position.set(-4.4057, 3.4397, -2.2097);
  const kub320Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub320 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub320.scale.set(0.0702, 0.1264, 0.2747);
    kub320.position.set(6.4288 * i, 0, 0);
    kub320Gr.add(kub320);
  }
  kub320Gr.setRotation(3.1416, 0.0, 0.0);
  kub320Gr.position.set(-4.4057, 3.8408, -2.0946);
  const kub321Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub321 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub321.scale.set(0.0702, 0.1264, 0.3091);
    kub321.position.set(6.4288 * i, 0, 0);
    kub321Gr.add(kub321);
  }
  kub321Gr.setRotation(1.9635, 0.0, 0.0);
  kub321Gr.position.set(-4.4057, 3.4772, -2.055);
  const kub322Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub322 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub322.scale.set(0.0702, 0.1519, 0.4307);
    kub322.position.set(6.4288 * i, 0, 0);
    kub322Gr.add(kub322);
  }
  kub322Gr.setRotation(0.3405, 0.0, 0.0);
  kub322Gr.position.set(-4.4057, 3.1657, -1.6586);
  const kub323Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub323 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub323.scale.set(0.0702, 0.1519, 0.2855);
    kub323.position.set(6.4288 * i, 0, 0);
    kub323Gr.add(kub323);
  }
  kub323Gr.setRotation(1.8909, 0.0, -0.0);
  kub323Gr.position.set(-4.4057, 2.6225, -1.4359);
  const cyl022Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl022 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl022.scale.set(0.039, 0.4636, 0.039);
    cyl022.position.set(6.4289 * i, 0, 0);
    cyl022Gr.add(cyl022);
  }
  cyl022Gr.position.set(-8.4084, 3.6063, -1.3034);
  const cyl023Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl023 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl023.scale.set(0.039, 0.2801, 0.039);
    cyl023.position.set(6.4297 * i, 0, 0);
    cyl023Gr.add(cyl023);
  }
  cyl023Gr.setRotation(1.5708, 0.0, 0.0);
  cyl023Gr.position.set(-8.4084, 3.8477, -1.5809);
  const cyl024Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl024 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl024.scale.set(0.0483, 0.033, 0.0483);
    cyl024.position.set(6.4293 * i, 0, 0);
    cyl024Gr.add(cyl024);
  }
  cyl024Gr.setRotation(1.5708, 0.0, 0.0);
  cyl024Gr.position.set(-8.4084, 3.8477, -1.787);
  const cyl025Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl025 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl025.scale.set(0.0543, 0.0831, 0.0543);
    cyl025.position.set(6.4289 * i, 0, 0);
    cyl025Gr.add(cyl025);
  }
  cyl025Gr.position.set(-8.4084, 3.2062, -1.3034);
  const sph003Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph003 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph003.scale.set(0.0552, 0.0552, 0.0552);
    sph003.position.set(6.4265 * i, 0, 0);
    sph003Gr.add(sph003);
  }
  sph003Gr.position.set(-8.4084, 4.0978, -1.3034);
  const cyl026Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl026 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl026.scale.set(0.039, 0.5356, 0.039);
    cyl026.position.set(6.4297 * i, 0, 0);
    cyl026Gr.add(cyl026);
  }
  cyl026Gr.setRotation(1.5708, 0.0, 0.0);
  cyl026Gr.position.set(-4.4057, 4.0978, -1.8363);
  const cyl027Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl027 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl027.scale.set(0.0508, 0.0545, 0.0508);
    cyl027.position.set(6.4299 * i, 0, 0);
    cyl027Gr.add(cyl027);
  }
  cyl027Gr.setRotation(1.5708, 0.0, 0.0);
  cyl027Gr.position.set(-8.4084, 4.0978, -2.3174);
  const cyl028Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl028 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl028.scale.set(0.039, 0.5356, 0.039);
    cyl028.position.set(6.4297 * i, 0, 0);
    cyl028Gr.add(cyl028);
  }
  cyl028Gr.setRotation(1.5708, 0.0, 0.0);
  cyl028Gr.position.set(-8.4084, 4.0978, -1.8363);
  const cyl029Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl029 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl029.scale.set(0.0508, 0.0545, 0.0508);
    cyl029.position.set(6.4289 * i, 0, 0);
    cyl029Gr.add(cyl029);
  }
  cyl029Gr.setRotation(1.5708, 0.0, 0.0);
  cyl029Gr.position.set(-4.4057, 4.0978, -2.3174);
  const sph004Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph004 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph004.scale.set(0.0552, 0.0552, 0.0552);
    sph004.position.set(6.4309 * i, 0, 0);
    sph004Gr.add(sph004);
  }
  sph004Gr.position.set(-4.4057, 4.0978, -1.3034);
  const kub324Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub324 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub324.scale.set(2.0087, 0.071, 0.5573);
    kub324.position.set(6.4279 * i, 0, 0);
    kub324Gr.add(kub324);
  }
  kub324Gr.setRotation(3.1416, 0.0, 0.0);
  kub324Gr.position.set(-6.4071, 3.067, -1.8271);
  const kub325Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub325 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub325.scale.set(2.0087, 0.071, 0.4356);
    kub325.position.set(6.4279 * i, 0, 0);
    kub325Gr.add(kub325);
  }
  kub325Gr.setRotation(4.465, 0.0, 0.0);
  kub325Gr.position.set(-6.4071, 3.4491, -2.2037);
  const kub326Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub326 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub326.scale.set(2.0087, 0.071, 0.4033);
    kub326.position.set(6.4279 * i, 0, 0);
    kub326Gr.add(kub326);
  }
  kub326Gr.setRotation(1.8968, 0.0, 0.0);
  kub326Gr.position.set(-6.4071, 2.6874, -1.4993);
  const cyl030Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl030 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl030.scale.set(0.039, 0.4636, 0.039);
    cyl030.position.set(6.4289 * i, 0, 0);
    cyl030Gr.add(cyl030);
  }
  cyl030Gr.position.set(-4.4057, 3.6063, -1.3034);
  const cyl031Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl031 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl031.scale.set(0.039, 0.2801, 0.039);
    cyl031.position.set(6.4297 * i, 0, 0);
    cyl031Gr.add(cyl031);
  }
  cyl031Gr.setRotation(1.5708, 0.0, 0.0);
  cyl031Gr.position.set(-4.4057, 3.8477, -1.5809);
  const cyl032Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl032 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl032.scale.set(0.0483, 0.033, 0.0483);
    cyl032.position.set(6.4283 * i, 0, 0);
    cyl032Gr.add(cyl032);
  }
  cyl032Gr.setRotation(1.5708, 0.0, 0.0);
  cyl032Gr.position.set(-4.4057, 3.8477, -1.787);
  const cyl033Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl033 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl033.scale.set(0.0543, 0.0831, 0.0543);
    cyl033.position.set(6.4289 * i, 0, 0);
    cyl033Gr.add(cyl033);
  }
  cyl033Gr.position.set(-4.4057, 3.2062, -1.3034);
  const kub327 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub327.position.set(-4.8635, 4.8871, -2.3676);
  kub327.scale.set(0.5148, 0.0124, 0.5964);
  kub327.setRotation(1.5708, 0.0, 0.0);

  const kub328 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub328.position.set(7.984, 4.8871, -2.3676);
  kub328.scale.set(0.5148, 0.0124, 0.5964);
  kub328.setRotation(1.5708, 0.0, 0.0);

  const kub329Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub329 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub329.scale.set(0.0702, 0.2701, 0.4985);
    kub329.position.set(6.4288 * i, 0, 0);
    kub329Gr.add(kub329);
  }
  kub329Gr.setRotation(0.0, 3.1416, 0.0);
  kub329Gr.position.set(8.4518, 2.5756, 1.8774);
  const kub330Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub330 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub330.scale.set(0.0702, 0.1597, 0.5837);
    kub330.position.set(6.4288 * i, 0, 0);
    kub330Gr.add(kub330);
  }
  kub330Gr.setRotation(0.0, 3.1416, 0.0);
  kub330Gr.position.set(8.4518, 3.0054, 1.7922);
  const kub331Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub331 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub331.scale.set(0.0702, 0.1597, 0.2747);
    kub331.position.set(6.4288 * i, 0, 0);
    kub331Gr.add(kub331);
  }
  kub331Gr.setRotation(1.5708, 3.1416, 0.0);
  kub331Gr.position.set(8.4518, 3.4397, 2.2163);
  const kub332Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub332 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub332.scale.set(0.0702, 0.1264, 0.2747);
    kub332.position.set(6.4288 * i, 0, 0);
    kub332Gr.add(kub332);
  }
  kub332Gr.setRotation(3.1416, 3.1416, 0.0);
  kub332Gr.position.set(8.4518, 3.8408, 2.1012);
  const kub333Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub333 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub333.scale.set(0.0702, 0.1264, 0.3091);
    kub333.position.set(6.4288 * i, 0, 0);
    kub333Gr.add(kub333);
  }
  kub333Gr.setRotation(1.9635, 3.1416, 0.0);
  kub333Gr.position.set(8.4518, 3.4772, 2.0616);
  const kub334Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub334 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub334.scale.set(0.0702, 0.1519, 0.4307);
    kub334.position.set(6.4288 * i, 0, 0);
    kub334Gr.add(kub334);
  }
  kub334Gr.setRotation(0.3405, 3.1416, 0.0);
  kub334Gr.position.set(8.4518, 3.1657, 1.6652);
  const kub335Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub335 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub335.scale.set(0.0702, 0.1519, 0.2855);
    kub335.position.set(6.4288 * i, 0, 0);
    kub335Gr.add(kub335);
  }
  kub335Gr.setRotation(1.8909, 3.1416, 0.0);
  kub335Gr.position.set(8.4518, 2.6225, 1.4425);
  const kub336Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub336 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub336.scale.set(0.0702, 0.2701, 0.4985);
    kub336.position.set(6.4288 * i, 0, 0);
    kub336Gr.add(kub336);
  }
  kub336Gr.setRotation(0.0, 3.1416, 0.0);
  kub336Gr.position.set(4.4491, 2.5756, 1.8774);
  const kub337Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub337 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub337.scale.set(0.0702, 0.1597, 0.5837);
    kub337.position.set(6.4288 * i, 0, 0);
    kub337Gr.add(kub337);
  }
  kub337Gr.setRotation(0.0, 3.1416, 0.0);
  kub337Gr.position.set(4.4491, 3.0054, 1.7922);
  const kub338Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub338 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub338.scale.set(0.0702, 0.1597, 0.2747);
    kub338.position.set(6.4288 * i, 0, 0);
    kub338Gr.add(kub338);
  }
  kub338Gr.setRotation(1.5708, 3.1416, 0.0);
  kub338Gr.position.set(4.4491, 3.4397, 2.2163);
  const kub339Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub339 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub339.scale.set(0.0702, 0.1264, 0.2747);
    kub339.position.set(6.4288 * i, 0, 0);
    kub339Gr.add(kub339);
  }
  kub339Gr.setRotation(3.1416, 3.1416, 0.0);
  kub339Gr.position.set(4.4491, 3.8408, 2.1012);
  const kub340Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub340 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub340.scale.set(0.0702, 0.1264, 0.3091);
    kub340.position.set(6.4288 * i, 0, 0);
    kub340Gr.add(kub340);
  }
  kub340Gr.setRotation(1.9635, 3.1416, 0.0);
  kub340Gr.position.set(4.4491, 3.4772, 2.0616);
  const kub341Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub341 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub341.scale.set(0.0702, 0.1519, 0.4307);
    kub341.position.set(6.4288 * i, 0, 0);
    kub341Gr.add(kub341);
  }
  kub341Gr.setRotation(0.3405, 3.1416, 0.0);
  kub341Gr.position.set(4.4491, 3.1657, 1.6652);
  const kub342Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub342 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub342.scale.set(0.0702, 0.1519, 0.2855);
    kub342.position.set(6.4288 * i, 0, 0);
    kub342Gr.add(kub342);
  }
  kub342Gr.setRotation(1.8909, 3.1416, 0.0);
  kub342Gr.position.set(4.4491, 2.6225, 1.4425);
  const cyl034Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl034 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl034.scale.set(0.039, 0.4636, 0.039);
    cyl034.position.set(6.4289 * i, 0, 0);
    cyl034Gr.add(cyl034);
  }
  cyl034Gr.setRotation(0.0, 3.1416, 0.0);
  cyl034Gr.position.set(8.4518, 3.6063, 1.31);
  const cyl035Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl035 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl035.scale.set(0.039, 0.2801, 0.039);
    cyl035.position.set(6.4297 * i, 0, 0);
    cyl035Gr.add(cyl035);
  }
  cyl035Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl035Gr.position.set(8.4518, 3.8477, 1.5875);
  const cyl036Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl036 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl036.scale.set(0.0483, 0.033, 0.0483);
    cyl036.position.set(6.4293 * i, 0, 0);
    cyl036Gr.add(cyl036);
  }
  cyl036Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl036Gr.position.set(8.4518, 3.8477, 1.7936);
  const cyl037Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl037 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl037.scale.set(0.0543, 0.0831, 0.0543);
    cyl037.position.set(6.4289 * i, 0, 0);
    cyl037Gr.add(cyl037);
  }
  cyl037Gr.setRotation(0.0, 3.1416, 0.0);
  cyl037Gr.position.set(8.4518, 3.2062, 1.31);
  const sph005Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph005 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph005.scale.set(0.0552, 0.0552, 0.0552);
    sph005.position.set(6.4265 * i, 0, 0);
    sph005Gr.add(sph005);
  }
  sph005Gr.setRotation(0.0, 3.1416, 0.0);
  sph005Gr.position.set(8.4518, 4.0978, 1.31);
  const cyl038Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl038 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl038.scale.set(0.039, 0.5356, 0.039);
    cyl038.position.set(6.4297 * i, 0, 0);
    cyl038Gr.add(cyl038);
  }
  cyl038Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl038Gr.position.set(4.4491, 4.0978, 1.8429);
  const cyl040Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl040 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl040.scale.set(0.039, 0.5356, 0.039);
    cyl040.position.set(6.4297 * i, 0, 0);
    cyl040Gr.add(cyl040);
  }
  cyl040Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl040Gr.position.set(8.4518, 4.0978, 1.8429);
  const cyl041Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl041 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl041.scale.set(0.0508, 0.0545, 0.0508);
    cyl041.position.set(6.4289 * i, 0, 0);
    cyl041Gr.add(cyl041);
  }
  cyl041Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl041Gr.position.set(4.4491, 4.0978, 2.3241);
  const sph006Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sph006 = new THREE.Mesh(sphereGeo, MetalMaterial);
    sph006.scale.set(0.0552, 0.0552, 0.0552);
    sph006.position.set(6.4309 * i, 0, 0);
    sph006Gr.add(sph006);
  }
  sph006Gr.setRotation(0.0, 3.1416, 0.0);
  sph006Gr.position.set(4.4491, 4.0978, 1.31);
  const kub343Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub343 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub343.scale.set(2.0087, 0.071, 0.5573);
    kub343.position.set(6.4279 * i, 0, 0);
    kub343Gr.add(kub343);
  }
  kub343Gr.setRotation(3.1416, 3.1416, 0.0);
  kub343Gr.position.set(6.4504, 3.067, 1.8337);
  const kub344Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub344 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
    kub344.scale.set(2.0087, 0.071, 0.4356);
    kub344.position.set(6.4279 * i, 0, 0);
    kub344Gr.add(kub344);
  }
  kub344Gr.setRotation(4.465, 3.1416, 0.0);
  kub344Gr.position.set(6.4504, 3.4491, 2.2104);
  const kub345Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub345 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
    kub345.scale.set(2.0087, 0.071, 0.4033);
    kub345.position.set(6.4279 * i, 0, 0);
    kub345Gr.add(kub345);
  }
  kub345Gr.setRotation(1.8968, 3.1416, 0.0);
  kub345Gr.position.set(6.4504, 2.6874, 1.5059);
  const cyl042Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl042 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl042.scale.set(0.039, 0.4636, 0.039);
    cyl042.position.set(6.4289 * i, 0, 0);
    cyl042Gr.add(cyl042);
  }
  cyl042Gr.setRotation(0.0, 3.1416, 0.0);
  cyl042Gr.position.set(4.4491, 3.6063, 1.31);
  const cyl043Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl043 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl043.scale.set(0.039, 0.2801, 0.039);
    cyl043.position.set(6.4297 * i, 0, 0);
    cyl043Gr.add(cyl043);
  }
  cyl043Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl043Gr.position.set(4.4491, 3.8477, 1.5875);
  const cyl044Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl044 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl044.scale.set(0.0483, 0.033, 0.0483);
    cyl044.position.set(6.4283 * i, 0, 0);
    cyl044Gr.add(cyl044);
  }
  cyl044Gr.setRotation(1.5708, 3.1416, 0.0);
  cyl044Gr.position.set(4.4491, 3.8477, 1.7936);
  const cyl045Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cyl045 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl045.scale.set(0.0543, 0.0831, 0.0543);
    cyl045.position.set(6.4289 * i, 0, 0);
    cyl045Gr.add(cyl045);
  }
  cyl045Gr.setRotation(0.0, 3.1416, 0.0);
  cyl045Gr.position.set(4.4491, 3.2062, 1.31);
  const kub346 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kub346.position.set(1.5609, 4.8871, 2.3723);
  kub346.scale.set(0.5148, 0.0124, 0.5964);
  kub346.setRotation(1.5708, 0.0, 0.0);

  const kub347 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub347.position.set(0.0113, 5.8328, -2.3649);
  kub347.scale.set(1.973, 0.0148, 0.1951);
  kub347.setRotation(1.5708, 0.0, 0.0);

  const cyl046 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl046.position.set(-1.7525, 5.8328, -2.3461);
  cyl046.scale.set(0.1498, 0.0122, 0.1498);
  cyl046.setRotation(1.5708, 0.0, 0.0);

  const kub348 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub348.position.set(0.0113, 5.8328, -2.3606);
  kub348.scale.set(1.8175, 0.0148, 0.0586);
  kub348.setRotation(1.5708, 0.0, 0.0);

  const cyl047 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl047.position.set(0.5851, 5.8328, -2.3461);
  cyl047.scale.set(0.1489, 0.0121, 0.1489);
  cyl047.setRotation(1.6353, 0.0, -4.7124);

  const cyl048 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl048.position.set(-0.5837, 5.8328, -2.3461);
  cyl048.scale.set(0.1489, 0.0121, 0.1489);
  cyl048.setRotation(1.4952, 0.0, -1.5708);

  const kub349 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub349.position.set(6.4755, 5.8328, 2.3389);
  kub349.scale.set(1.973, 0.0148, 0.1951);
  kub349.setRotation(1.5708, 3.1416, 0.0);

  const cyl049 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl049.position.set(8.2393, 5.8328, 2.3201);
  cyl049.scale.set(0.1498, 0.0122, 0.1498);
  cyl049.setRotation(1.5708, 3.1416, 0.0);

  const kub350 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub350.position.set(6.4755, 5.8328, 2.3346);
  kub350.scale.set(1.8175, 0.0148, 0.0586);
  kub350.setRotation(1.5708, 3.1416, 0.0);

  const cyl050 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl050.position.set(5.9017, 5.8328, 2.3201);
  cyl050.scale.set(0.1489, 0.0121, 0.1489);
  cyl050.setRotation(4.7769, 0.0, -4.7124);

  const cyl051 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl051.position.set(7.0705, 5.8328, 2.3201);
  cyl051.scale.set(0.1489, 0.0121, 0.1489);
  cyl051.setRotation(-1.6464, 0.0, -1.5708);

  const kub351 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub351.position.set(-6.4193, 5.8328, 2.3389);
  kub351.scale.set(1.973, 0.0148, 0.1951);
  kub351.setRotation(1.5708, 3.1416, 0.0);

  const cyl052 = new THREE.Mesh(cylinderGeo, PurpleMaterial);
  cyl052.position.set(-4.6554, 5.8328, 2.3201);
  cyl052.scale.set(0.1498, 0.0122, 0.1498);
  cyl052.setRotation(1.5708, 3.1416, 0.0);

  const kub352 = new THREE.Mesh(boxGeo, PurpleMaterial);
  kub352.position.set(-6.4193, 5.8328, 2.3346);
  kub352.scale.set(1.8175, 0.0148, 0.0586);
  kub352.setRotation(1.5708, 3.1416, 0.0);

  const cyl053 = new THREE.Mesh(cylinderGeo, Green_PictureMaterial);
  cyl053.position.set(-6.993, 5.8328, 2.3201);
  cyl053.scale.set(0.1489, 0.0121, 0.1489);
  cyl053.setRotation(4.7769, 0.0, -4.7124);

  const cyl054 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl054.position.set(-5.8242, 5.8328, 2.3201);
  cyl054.scale.set(0.1489, 0.0121, 0.1489);
  cyl054.setRotation(-1.6464, 0.0, -1.5708);

  const cyl055 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl055.position.set(0.0127, 6.1242, -0.7744);
  cyl055.scale.set(0.039, 12.4875, 0.039);
  cyl055.setRotation(1.5708, 1.5708, 0.0);

  const cyl056 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl056.position.set(0.0127, 6.1242, 0.786);
  cyl056.scale.set(0.039, 12.4875, 0.039);
  cyl056.setRotation(1.5708, 1.5708, 0.0);

  const cyl057Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cyl057 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl057.scale.set(0.0389, 0.2166, 0.0389);
    cyl057.position.set(5.5554 * i, 0, 0);
    cyl057Gr.add(cyl057);
  }
  cyl057Gr.position.set(-10.8298, 6.3231, -0.7744);
  const cyl058Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cyl058 = new THREE.Mesh(cylinderGeo, MetalMaterial);
    cyl058.scale.set(0.0389, 0.2162, 0.0389);
    cyl058.position.set(5.5456 * i, 0, 0);
    cyl058Gr.add(cyl058);
  }
  cyl058Gr.position.set(-10.8298, 6.3231, 0.7876);
  const kub353 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub353.position.set(0.0127, 6.3994, 1.6559);
  kub353.scale.set(12.5105, 0.1214, 0.8001);
  kub353.setRotation(-0.2859, 3.1416, 0.0);

  const kub116 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kub116.position.set(0.0127, 6.725, 0.7325);
  kub116.scale.set(12.5105, 0.1214, 0.2164);
  kub116.setRotation(1.5708, 0.0, 0.0);

  const kub145 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub145.position.set(0.0127, 6.725, 0.6138);
  kub145.scale.set(12.4539, 0.0107, 0.1974);
  kub145.setRotation(1.5708, 0.0, 0.0);

  const out = new THREE.Group();
  out.add(
    kub307,
    kub308,
    kub309,
    cyl021Gr,
    sph002Gr,
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
    cyl022Gr,
    cyl023Gr,
    cyl024Gr,
    cyl025Gr,
    sph003Gr,
    cyl026Gr,
    cyl027Gr,
    cyl028Gr,
    cyl029Gr,
    sph004Gr,
    kub324Gr,
    kub325Gr,
    kub326Gr,
    cyl030Gr,
    cyl031Gr,
    cyl032Gr,
    cyl033Gr,
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
    cyl034Gr,
    cyl035Gr,
    cyl036Gr,
    cyl037Gr,
    sph005Gr,
    cyl038Gr,
    cyl040Gr,
    cyl041Gr,
    sph006Gr,
    kub343Gr,
    kub344Gr,
    kub345Gr,
    cyl042Gr,
    cyl043Gr,
    cyl044Gr,
    cyl045Gr,
    kub346,
    kub347,
    cyl046,
    kub348,
    cyl047,
    cyl048,
    kub349,
    cyl049,
    kub350,
    cyl050,
    cyl051,
    kub351,
    cyl052,
    kub352,
    cyl053,
    cyl054,
    cyl055,
    cyl056,
    cyl057Gr,
    cyl058Gr,
    kub353,
    kub116,
    kub145,
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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const sphereGeo = new THREE.SphereGeometry(1, 32, 16);

  const cylwheel_008 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_008.scale.set(0.8096, 0.1641, 0.8096);
  cylwheel_008.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_008MZ = cylwheel_008.clone();
  cylwheel_008MZ.updateMatrixWorld(true);
  cylwheel_008.position.set(0, 0, -2.124);
  cylwheel_008MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_008MZ.position.set(0, 0, 2.124);
  const cylwheel_008MrZ = new THREE.Group();
  cylwheel_008MrZ.add(cylwheel_008, cylwheel_008MZ);
  cylwheel_008MrZ.position.set(-6.1348, 0.7716, 0);
  const cylwheel_009 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_009.scale.set(0.509, 0.1032, 0.509);
  cylwheel_009.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_009MZ = cylwheel_009.clone();
  cylwheel_009MZ.updateMatrixWorld(true);
  cylwheel_009.position.set(0, 0, -2.3912);
  cylwheel_009MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_009MZ.position.set(0, 0, 2.3912);
  const cylwheel_009MrZ = new THREE.Group();
  cylwheel_009MrZ.add(cylwheel_009, cylwheel_009MZ);
  cylwheel_009MrZ.position.set(-6.1348, 0.7716, 0);
  const cylwheel_010 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_010.scale.set(0.8096, 0.1641, 0.8096);
  cylwheel_010.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_010MZ = cylwheel_010.clone();
  cylwheel_010MZ.updateMatrixWorld(true);
  cylwheel_010.position.set(0, 0, -2.124);
  cylwheel_010MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_010MZ.position.set(0, 0, 2.124);
  const cylwheel_010MrZ = new THREE.Group();
  cylwheel_010MrZ.add(cylwheel_010, cylwheel_010MZ);
  cylwheel_010MrZ.position.set(-10.4008, 0.7716, 0);
  const cylwheel_011 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_011.scale.set(0.509, 0.1032, 0.509);
  cylwheel_011.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_011MZ = cylwheel_011.clone();
  cylwheel_011MZ.updateMatrixWorld(true);
  cylwheel_011.position.set(0, 0, -2.3912);
  cylwheel_011MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_011MZ.position.set(0, 0, 2.3912);
  const cylwheel_011MrZ = new THREE.Group();
  cylwheel_011MrZ.add(cylwheel_011, cylwheel_011MZ);
  cylwheel_011MrZ.position.set(-10.4008, 0.7716, 0);
  const kub307 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub307.position.set(-0.0006, 1.9794, -0.0);
  kub307.scale.set(12.5898, 0.2671, 2.4701);

  const kub308 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub308.scale.set(0.1708, 0.4672, 0.1996);
  kub308.setRotation(0.0, 0.0, -0.0);
  const kub308MZ = kub308.clone();
  kub308MZ.updateMatrixWorld(true);
  kub308.position.set(0, 0, -1.1446);
  kub308MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub308MZ.position.set(0, 0, 1.1446);
  const kub308MrZ = new THREE.Group();
  kub308MrZ.add(kub308, kub308MZ);
  kub308MrZ.position.set(-6.1348, 1.2844, 0);
  const kub309 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub309.scale.set(0.1708, 0.2173, 0.1996);
  kub309.setRotation(0.0, 0.0, -0.0);
  const kub309MZ = kub309.clone();
  kub309MZ.updateMatrixWorld(true);
  kub309.position.set(0, 0, -1.763);
  kub309MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub309MZ.position.set(0, 0, 1.7629);
  const kub309MrZ = new THREE.Group();
  kub309MrZ.add(kub309, kub309MZ);
  kub309MrZ.position.set(-6.1348, 0.7716, 0);
  const kub310 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub310.scale.set(0.1708, 0.1639, 0.3627);
  kub310.setRotation(-0.5678, 0.0, 0.0);
  const kub310MZ = kub310.clone();
  kub310MZ.updateMatrixWorld(true);
  kub310.position.set(0, 0, -1.3783);
  kub310MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub310MZ.position.set(0, 0, 1.3783);
  const kub310MrZ = new THREE.Group();
  kub310MrZ.add(kub310, kub310MZ);
  kub310MrZ.position.set(-6.1348, 0.9047, 0);
  const cyl021Gr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cyl021 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl021.scale.set(0.1218, 0.3642, 0.1218);
    cyl021.position.set(0.4874 * i, 0, 0);
    cyl021Gr.add(cyl021);
  }
  cyl021Gr.setRotation(0.0, 0.0, -0.0);
  const cyl021GroupMZ = cyl021Gr.clone();
  cyl021GroupMZ.updateMatrixWorld(true);
  cyl021Gr.position.set(0, 0, -2.102);
  cyl021GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl021GroupMZ.position.set(0, 0, 2.102);
  const cyl021GroupMrZ = new THREE.Group();
  cyl021GroupMrZ.add(cyl021Gr, cyl021GroupMZ);
  cyl021GroupMrZ.position.set(-8.9801, 1.0627, 0);
  const kub311 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub311.scale.set(2.8418, 0.1639, 0.0489);
  kub311.setRotation(0.0, 0.0, -0.0);
  const kub311MZ = kub311.clone();
  kub311MZ.updateMatrixWorld(true);
  kub311.position.set(0, 0, -1.8431);
  kub311MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub311MZ.position.set(0, 0, 1.8431);
  const kub311MrZ = new THREE.Group();
  kub311MrZ.add(kub311, kub311MZ);
  kub311MrZ.position.set(-8.2678, 0.7884, 0);
  const kub312 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub312.scale.set(0.1708, 0.1639, 0.3627);
  kub312.setRotation(-0.5678, 0.0, 0.0);
  const kub312MZ = kub312.clone();
  kub312MZ.updateMatrixWorld(true);
  kub312.position.set(0, 0, -1.3783);
  kub312MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub312MZ.position.set(0, 0, 1.3783);
  const kub312MrZ = new THREE.Group();
  kub312MrZ.add(kub312, kub312MZ);
  kub312MrZ.position.set(-10.4008, 0.9047, 0);
  const kub313 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub313.scale.set(0.1708, 0.4672, 0.1996);
  kub313.setRotation(0.0, 0.0, -0.0);
  const kub313MZ = kub313.clone();
  kub313MZ.updateMatrixWorld(true);
  kub313.position.set(0, 0, -1.1446);
  kub313MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub313MZ.position.set(0, 0, 1.1446);
  const kub313MrZ = new THREE.Group();
  kub313MrZ.add(kub313, kub313MZ);
  kub313MrZ.position.set(-10.4008, 1.2844, 0);
  const kub314 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub314.scale.set(2.8418, 0.1639, 0.0489);
  kub314.setRotation(0.0, 0.0, -0.0);
  const kub314MZ = kub314.clone();
  kub314MZ.updateMatrixWorld(true);
  kub314.position.set(0, 0, -2.3571);
  kub314MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub314MZ.position.set(0, 0, 2.357);
  const kub314MrZ = new THREE.Group();
  kub314MrZ.add(kub314, kub314MZ);
  kub314MrZ.position.set(-8.2678, 1.5807, 0);
  const kub315 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub315.scale.set(1.0521, 0.1639, 0.0812);
  kub315.setRotation(0.0, 0.0, -0.0);
  const kub315MZ = kub315.clone();
  kub315MZ.updateMatrixWorld(true);
  kub315.position.set(0, 0, -2.3912);
  kub315MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub315MZ.position.set(0, 0, 2.3912);
  const kub315MrZ = new THREE.Group();
  kub315MrZ.add(kub315, kub315MZ);
  kub315MrZ.position.set(-8.2678, 0.7716, 0);
  const kub316 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub316.scale.set(0.1708, 0.2173, 0.1996);
  kub316.setRotation(0.0, 0.0, -0.0);
  const kub316MZ = kub316.clone();
  kub316MZ.updateMatrixWorld(true);
  kub316.position.set(0, 0, -1.763);
  kub316MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub316MZ.position.set(0, 0, 1.7629);
  const kub316MrZ = new THREE.Group();
  kub316MrZ.add(kub316, kub316MZ);
  kub316MrZ.position.set(-10.4008, 0.7716, 0);
  const cylwheel_012 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_012.scale.set(0.8096, 0.1641, 0.8096);
  cylwheel_012.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_012MZ = cylwheel_012.clone();
  cylwheel_012MZ.updateMatrixWorld(true);
  cylwheel_012.position.set(0, 0, -2.124);
  cylwheel_012MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_012MZ.position.set(0, 0, 2.124);
  const cylwheel_012MrZ = new THREE.Group();
  cylwheel_012MrZ.add(cylwheel_012, cylwheel_012MZ);
  cylwheel_012MrZ.position.set(11.1541, 0.7716, 0);
  const cylwheel_013 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_013.scale.set(0.509, 0.1032, 0.509);
  cylwheel_013.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_013MZ = cylwheel_013.clone();
  cylwheel_013MZ.updateMatrixWorld(true);
  cylwheel_013.position.set(0, 0, -2.3912);
  cylwheel_013MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_013MZ.position.set(0, 0, 2.3912);
  const cylwheel_013MrZ = new THREE.Group();
  cylwheel_013MrZ.add(cylwheel_013, cylwheel_013MZ);
  cylwheel_013MrZ.position.set(11.1541, 0.7716, 0);
  const cylwheel_014 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cylwheel_014.scale.set(0.8096, 0.1641, 0.8096);
  cylwheel_014.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_014MZ = cylwheel_014.clone();
  cylwheel_014MZ.updateMatrixWorld(true);
  cylwheel_014.position.set(0, 0, -2.124);
  cylwheel_014MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_014MZ.position.set(0, 0, 2.124);
  const cylwheel_014MrZ = new THREE.Group();
  cylwheel_014MrZ.add(cylwheel_014, cylwheel_014MZ);
  cylwheel_014MrZ.position.set(6.8881, 0.7716, 0);
  const cylwheel_015 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cylwheel_015.scale.set(0.509, 0.1032, 0.509);
  cylwheel_015.setRotation(1.5708, 0.0, 0.0);
  const cylwheel_015MZ = cylwheel_015.clone();
  cylwheel_015MZ.updateMatrixWorld(true);
  cylwheel_015.position.set(0, 0, -2.3912);
  cylwheel_015MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cylwheel_015MZ.position.set(0, 0, 2.3912);
  const cylwheel_015MrZ = new THREE.Group();
  cylwheel_015MrZ.add(cylwheel_015, cylwheel_015MZ);
  cylwheel_015MrZ.position.set(6.8881, 0.7716, 0);
  const kub317 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub317.scale.set(0.1708, 0.4672, 0.1996);
  kub317.setRotation(0.0, 0.0, -0.0);
  const kub317MZ = kub317.clone();
  kub317MZ.updateMatrixWorld(true);
  kub317.position.set(0, 0, -1.1446);
  kub317MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub317MZ.position.set(0, 0, 1.1446);
  const kub317MrZ = new THREE.Group();
  kub317MrZ.add(kub317, kub317MZ);
  kub317MrZ.position.set(11.1541, 1.2844, 0);
  const kub318 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub318.scale.set(0.1708, 0.2173, 0.1996);
  kub318.setRotation(0.0, 0.0, -0.0);
  const kub318MZ = kub318.clone();
  kub318MZ.updateMatrixWorld(true);
  kub318.position.set(0, 0, -1.763);
  kub318MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub318MZ.position.set(0, 0, 1.7629);
  const kub318MrZ = new THREE.Group();
  kub318MrZ.add(kub318, kub318MZ);
  kub318MrZ.position.set(11.1541, 0.7716, 0);
  const kub319 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub319.scale.set(0.1708, 0.1639, 0.3627);
  kub319.setRotation(-0.5678, 0.0, 0.0);
  const kub319MZ = kub319.clone();
  kub319MZ.updateMatrixWorld(true);
  kub319.position.set(0, 0, -1.3783);
  kub319MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub319MZ.position.set(0, 0, 1.3783);
  const kub319MrZ = new THREE.Group();
  kub319MrZ.add(kub319, kub319MZ);
  kub319MrZ.position.set(11.1541, 0.9047, 0);
  const kub320 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub320.scale.set(2.8418, 0.1639, 0.0489);
  kub320.setRotation(0.0, 0.0, -0.0);
  const kub320MZ = kub320.clone();
  kub320MZ.updateMatrixWorld(true);
  kub320.position.set(0, 0, -1.8431);
  kub320MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub320MZ.position.set(0, 0, 1.8431);
  const kub320MrZ = new THREE.Group();
  kub320MrZ.add(kub320, kub320MZ);
  kub320MrZ.position.set(9.0211, 0.7884, 0);
  const kub321 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub321.scale.set(0.1708, 0.1639, 0.3627);
  kub321.setRotation(-0.5678, 0.0, 0.0);
  const kub321MZ = kub321.clone();
  kub321MZ.updateMatrixWorld(true);
  kub321.position.set(0, 0, -1.3783);
  kub321MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub321MZ.position.set(0, 0, 1.3783);
  const kub321MrZ = new THREE.Group();
  kub321MrZ.add(kub321, kub321MZ);
  kub321MrZ.position.set(6.8881, 0.9047, 0);
  const kub322 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub322.scale.set(0.1708, 0.4672, 0.1996);
  kub322.setRotation(0.0, 0.0, -0.0);
  const kub322MZ = kub322.clone();
  kub322MZ.updateMatrixWorld(true);
  kub322.position.set(0, 0, -1.1446);
  kub322MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub322MZ.position.set(0, 0, 1.1446);
  const kub322MrZ = new THREE.Group();
  kub322MrZ.add(kub322, kub322MZ);
  kub322MrZ.position.set(6.8881, 1.2844, 0);
  const kub323 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub323.scale.set(2.8418, 0.1639, 0.0489);
  kub323.setRotation(0.0, 0.0, -0.0);
  const kub323MZ = kub323.clone();
  kub323MZ.updateMatrixWorld(true);
  kub323.position.set(0, 0, -2.3571);
  kub323MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub323MZ.position.set(0, 0, 2.357);
  const kub323MrZ = new THREE.Group();
  kub323MrZ.add(kub323, kub323MZ);
  kub323MrZ.position.set(9.0211, 1.5807, 0);
  const kub324 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub324.scale.set(1.0521, 0.1639, 0.0812);
  kub324.setRotation(0.0, 0.0, -0.0);
  const kub324MZ = kub324.clone();
  kub324MZ.updateMatrixWorld(true);
  kub324.position.set(0, 0, -2.3912);
  kub324MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub324MZ.position.set(0, 0, 2.3912);
  const kub324MrZ = new THREE.Group();
  kub324MrZ.add(kub324, kub324MZ);
  kub324MrZ.position.set(9.0211, 0.7716, 0);
  const kub325 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub325.scale.set(0.1708, 0.2173, 0.1996);
  kub325.setRotation(0.0, 0.0, -0.0);
  const kub325MZ = kub325.clone();
  kub325MZ.updateMatrixWorld(true);
  kub325.position.set(0, 0, -1.763);
  kub325MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub325MZ.position.set(0, 0, 1.7629);
  const kub325MrZ = new THREE.Group();
  kub325MrZ.add(kub325, kub325MZ);
  kub325MrZ.position.set(6.8881, 0.7716, 0);
  const kub326 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub326.scale.set(0.9318, 0.051, 2.4701);
  kub326.setRotation(1.5708, 0.0, 0.0);
  const kub326MZ = kub326.clone();
  kub326MZ.updateMatrixWorld(true);
  kub326.position.set(0, 0, -2.4192);
  kub326MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub326MZ.position.set(0, 0, 2.4191);
  const kub326MrZ = new THREE.Group();
  kub326MrZ.add(kub326, kub326MZ);
  kub326MrZ.position.set(-11.6586, 4.7166, 0);
  const kub327 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub327.scale.set(0.8412, 0.0446, 0.9062);
  kub327.setRotation(1.5708, 1.5708, 0.0);
  const kub327MZ = kub327.clone();
  kub327MZ.updateMatrixWorld(true);
  kub327.position.set(0, 0, -1.527);
  kub327MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub327MZ.position.set(0, 0, 1.5269);
  const kub327MrZ = new THREE.Group();
  kub327MrZ.add(kub327, kub327MZ);
  kub327MrZ.position.set(-12.5457, 3.1527, 0);
  const cyl022 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl022.scale.set(0.3106, 0.044, 0.3106);
  cyl022.setRotation(0.0, 0.0, -1.5708);
  const cyl022MZ = cyl022.clone();
  cyl022MZ.updateMatrixWorld(true);
  cyl022.position.set(0, 0, -1.527);
  cyl022MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl022MZ.position.set(0, 0, 1.5269);
  const cyl022MrZ = new THREE.Group();
  cyl022MrZ.add(cyl022, cyl022MZ);
  cyl022MrZ.position.set(-12.593, 3.1527, 0);
  const sph002 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
  sph002.scale.set(0.2749, 0.0831, 0.2749);
  sph002.setRotation(0.0, 0.0, -1.5708);
  const sph002MZ = sph002.clone();
  sph002MZ.updateMatrixWorld(true);
  sph002.position.set(0, 0, -1.527);
  sph002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph002MZ.position.set(0, 0, 1.5269);
  const sph002MrZ = new THREE.Group();
  sph002MrZ.add(sph002, sph002MZ);
  sph002MrZ.position.set(-12.6391, 3.1527, 0);
  const kub328 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub328.scale.set(0.1275, 0.0446, 0.9062);
  kub328.setRotation(1.5708, 1.5708, 0.0);
  const kub328MZ = kub328.clone();
  kub328MZ.updateMatrixWorld(true);
  kub328.position.set(0, 0, -2.2407);
  kub328MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub328MZ.position.set(0, 0, 2.2406);
  const kub328MrZ = new THREE.Group();
  kub328MrZ.add(kub328, kub328MZ);
  kub328MrZ.position.set(-12.5457, 4.965, 0);
  const kub329 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub329.scale.set(0.1275, 0.0446, 0.9062);
  kub329.setRotation(1.5708, 1.5708, 0.0);
  const kub329MZ = kub329.clone();
  kub329MZ.updateMatrixWorld(true);
  kub329.position.set(0, 0, -0.8133);
  kub329MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub329MZ.position.set(0, 0, 0.8132);
  const kub329MrZ = new THREE.Group();
  kub329MrZ.add(kub329, kub329MZ);
  kub329MrZ.position.set(-12.5457, 4.965, 0);
  const kub330 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub330.scale.set(0.8412, 0.0446, 0.681);
  kub330.setRotation(1.5708, 1.5708, 0.0);
  const kub330MZ = kub330.clone();
  kub330MZ.updateMatrixWorld(true);
  kub330.position.set(0, 0, -1.527);
  kub330MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub330MZ.position.set(0, 0, 1.5269);
  const kub330MrZ = new THREE.Group();
  kub330MrZ.add(kub330, kub330MZ);
  kub330MrZ.position.set(-12.5457, 6.5057, 0);
  const kub331 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub331.position.set(-12.5457, 3.1527, -0.0);
  kub331.scale.set(0.7058, 0.0351, 0.9062);
  kub331.setRotation(1.5708, 1.5708, 0.0);

  const kub332 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub332.position.set(-12.5457, 4.9776, -0.5792);
  kub332.scale.set(0.1266, 0.0351, 0.9188);
  kub332.setRotation(1.5708, 1.5708, 0.0);

  const kub333 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub333.position.set(-12.5457, 6.4998, -0.0);
  kub333.scale.set(0.7058, 0.0351, 0.6869);
  kub333.setRotation(1.5708, 1.5708, 0.0);

  const kub334 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub334.scale.set(0.1434, 0.0309, 0.1545);
  kub334.setRotation(1.5708, 1.5708, 0.7854);
  const kub334MZ = kub334.clone();
  kub334MZ.updateMatrixWorld(true);
  kub334.position.set(0, 0, -0.9277);
  kub334MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub334MZ.position.set(0, 0, 0.9276);
  const kub334MrZ = new THREE.Group();
  kub334MrZ.add(kub334, kub334MZ);
  const kub334MrZMY = kub334MrZ.clone();
  kub334MrZMY.updateMatrixWorld(true);
  kub334MrZ.position.set(0, 4.0498, 0);
  kub334MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub334MrZMY.position.set(0, 5.827, 0);
  const kub334MrZMrY = new THREE.Group();
  kub334MrZMrY.add(kub334MrZ, kub334MrZMY);
  kub334MrZMrY.position.set(-12.5457, 0, 0);
  const kub335 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub335.scale.set(-0.0151, 1.0, 0.7144);
  kub335.setRotation(0.0, 0.0, -0.0);
  const kub335MZ = kub335.clone();
  kub335MZ.updateMatrixWorld(true);
  kub335.position.set(0, 0, -1.527);
  kub335MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub335MZ.position.set(0, 0, 1.5269);
  const kub335MrZ = new THREE.Group();
  kub335MrZ.add(kub335, kub335MZ);
  kub335MrZ.position.set(-12.5457, 4.9411, 0);
  const kub336 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub336.scale.set(0.4607, 0.0309, 0.0226);
  kub336.setRotation(1.5708, 1.5708, -0.0);
  const kub336MZ = kub336.clone();
  kub336MZ.updateMatrixWorld(true);
  kub336.position.set(0, 0, -1.527);
  kub336MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub336MZ.position.set(0, 0, 1.5269);
  const kub336MrZ = new THREE.Group();
  kub336MrZ.add(kub336, kub336MZ);
  const kub336MrZMY = kub336MrZ.clone();
  kub336MrZMY.updateMatrixWorld(true);
  kub336MrZ.position.set(0, 4.0617, 0);
  kub336MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub336MrZMY.position.set(0, 5.815, 0);
  const kub336MrZMrY = new THREE.Group();
  kub336MrZMrY.add(kub336MrZ, kub336MrZMY);
  kub336MrZMrY.position.set(-12.5457, 0, 0);
  const kub337 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub337.scale.set(0.7643, 0.0309, 0.0226);
  kub337.setRotation(3.1416, 0.0, 1.5708);
  const kub337MX = kub337.clone();
  kub337MX.updateMatrixWorld(true);
  kub337.position.set(-12.5457, 0, 0);
  kub337MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub337MX.position.set(-12.5457, 0, 0);
  const kub337MrX = new THREE.Group();
  kub337MrX.add(kub337, kub337MX);
  const kub337MrXMZ = kub337MrX.clone();
  kub337MrXMZ.updateMatrixWorld(true);
  kub337MrX.position.set(0, 0, -0.9381);
  kub337MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub337MrXMZ.position.set(0, 0, 0.9381);
  const kub337MrXMrZ = new THREE.Group();
  kub337MrXMrZ.add(kub337MrX, kub337MrXMZ);
  const kub337MrXMrZMY = kub337MrXMrZ.clone();
  kub337MrXMrZMY.updateMatrixWorld(true);
  kub337MrXMrZ.position.set(0, 4.936, 0);
  kub337MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub337MrXMrZMY.position.set(0, 4.9408, 0);
  const kub337MrXMrZMrY = new THREE.Group();
  kub337MrXMrZMrY.add(kub337MrXMrZ, kub337MrXMrZMY);
  const kub338 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub338.position.set(-12.5457, 4.9384, -0.0);
  kub338.scale.set(-0.0151, 0.9645, 0.4812);

  const kub339 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub339.scale.set(0.1434, 0.0309, 0.1545);
  kub339.setRotation(1.5708, 1.5708, 0.7854);
  const kub339MZ = kub339.clone();
  kub339MZ.updateMatrixWorld(true);
  kub339.position.set(0, 0, 0.4478);
  kub339MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub339MZ.position.set(0, 0, -0.4478);
  const kub339MrZ = new THREE.Group();
  kub339MrZ.add(kub339, kub339MZ);
  const kub339MrZMY = kub339MrZ.clone();
  kub339MrZMY.updateMatrixWorld(true);
  kub339MrZ.position.set(0, 4.0693, 0);
  kub339MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub339MrZMY.position.set(0, 5.8075, 0);
  const kub339MrZMrY = new THREE.Group();
  kub339MrZMrY.add(kub339MrZ, kub339MrZMY);
  kub339MrZMrY.position.set(-12.5457, 0, 0);
  const kub340 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub340.scale.set(0.4607, 0.0309, 0.0226);
  kub340.setRotation(1.5708, 1.5708, -0.0);
  const kub340MY = kub340.clone();
  kub340MY.updateMatrixWorld(true);
  kub340.position.set(0, 4.0568, 0);
  kub340MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub340MY.position.set(0, 5.82, 0);
  const kub340MrY = new THREE.Group();
  kub340MrY.add(kub340, kub340MY);
  kub340MrY.position.set(-12.5457, 0, -0.0);
  const kub341 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub341.scale.set(0.7643, 0.0309, 0.0226);
  kub341.setRotation(3.1416, 0.0, 1.5708);
  const kub341MZ = kub341.clone();
  kub341MZ.updateMatrixWorld(true);
  kub341.position.set(0, 0, 0.4584);
  kub341MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub341MZ.position.set(0, 0, -0.4584);
  const kub341MrZ = new THREE.Group();
  kub341MrZ.add(kub341, kub341MZ);
  kub341MrZ.position.set(-12.5457, 4.9303, 0);
  const kub342 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub342.scale.set(0.7643, 0.0309, 0.0226);
  kub342.setRotation(3.1416, 0.0, 1.5708);
  const kub342MX = kub342.clone();
  kub342MX.updateMatrixWorld(true);
  kub342.position.set(-12.5457, 0, 0);
  kub342MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub342MX.position.set(-12.5457, 0, 0);
  const kub342MrX = new THREE.Group();
  kub342MrX.add(kub342, kub342MX);
  const kub342MrXMZ = kub342MrX.clone();
  kub342MrXMZ.updateMatrixWorld(true);
  kub342MrX.position.set(0, 0, 2.1187);
  kub342MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub342MrXMZ.position.set(0, 0, -2.1187);
  const kub342MrXMrZ = new THREE.Group();
  kub342MrXMrZ.add(kub342MrX, kub342MrXMZ);
  const kub342MrXMrZMY = kub342MrXMrZ.clone();
  kub342MrXMrZMY.updateMatrixWorld(true);
  kub342MrXMrZ.position.set(0, 4.936, 0);
  kub342MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub342MrXMrZMY.position.set(0, 4.9408, 0);
  const kub342MrXMrZMrY = new THREE.Group();
  kub342MrXMrZMrY.add(kub342MrXMrZ, kub342MrXMrZMY);
  const kub343 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub343.scale.set(0.1434, 0.0309, 0.1545);
  kub343.setRotation(1.5708, 1.5708, 0.7854);
  const kub343MZ = kub343.clone();
  kub343MZ.updateMatrixWorld(true);
  kub343.position.set(0, 0, 2.1206);
  kub343MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub343MZ.position.set(0, 0, -2.1207);
  const kub343MrZ = new THREE.Group();
  kub343MrZ.add(kub343, kub343MZ);
  const kub343MrZMY = kub343MrZ.clone();
  kub343MrZMY.updateMatrixWorld(true);
  kub343MrZ.position.set(0, 4.0498, 0);
  kub343MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub343MrZMY.position.set(0, 5.827, 0);
  const kub343MrZMrY = new THREE.Group();
  kub343MrZMrY.add(kub343MrZ, kub343MrZMY);
  kub343MrZMrY.position.set(-12.5457, 0, 0);
  const cyl023Gr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const cyl023 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl023.scale.set(0.1218, 0.3642, 0.1218);
    cyl023.position.set(0.4874 * i, 0, 0);
    cyl023Gr.add(cyl023);
  }
  cyl023Gr.setRotation(0.0, 0.0, -0.0);
  const cyl023GroupMZ = cyl023Gr.clone();
  cyl023GroupMZ.updateMatrixWorld(true);
  cyl023Gr.position.set(0, 0, -2.102);
  cyl023GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl023GroupMZ.position.set(0, 0, 2.102);
  const cyl023GroupMrZ = new THREE.Group();
  cyl023GroupMrZ.add(cyl023Gr, cyl023GroupMZ);
  cyl023GroupMrZ.position.set(8.3088, 1.0627, 0);
  const kub344 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub344.scale.set(-0.9318, 0.051, 2.4701);
  kub344.setRotation(1.5708, 0.0, 0.0);
  const kub344MZ = kub344.clone();
  kub344MZ.updateMatrixWorld(true);
  kub344.position.set(0, 0, -2.4192);
  kub344MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub344MZ.position.set(0, 0, 2.4191);
  const kub344MrZ = new THREE.Group();
  kub344MrZ.add(kub344, kub344MZ);
  kub344MrZ.position.set(11.6574, 4.7166, 0);
  const kub345 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub345.scale.set(0.8412, -0.0446, 0.9062);
  kub345.setRotation(1.5708, 1.5708, 0.0);
  const kub345MZ = kub345.clone();
  kub345MZ.updateMatrixWorld(true);
  kub345.position.set(0, 0, -1.527);
  kub345MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub345MZ.position.set(0, 0, 1.5269);
  const kub345MrZ = new THREE.Group();
  kub345MrZ.add(kub345, kub345MZ);
  kub345MrZ.position.set(12.5445, 3.1527, 0);
  const cyl024 = new THREE.Mesh(cylinderGeo, Floor_StripesMaterial);
  cyl024.scale.set(0.3106, -0.044, 0.3106);
  cyl024.setRotation(0.0, 0.0, -1.5708);
  const cyl024MZ = cyl024.clone();
  cyl024MZ.updateMatrixWorld(true);
  cyl024.position.set(0, 0, -1.527);
  cyl024MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  cyl024MZ.position.set(0, 0, 1.5269);
  const cyl024MrZ = new THREE.Group();
  cyl024MrZ.add(cyl024, cyl024MZ);
  cyl024MrZ.position.set(12.5918, 3.1527, 0);
  const sph003 = new THREE.Mesh(sphereGeo, RoofTilesMaterial);
  sph003.scale.set(0.2749, -0.0831, 0.2749);
  sph003.setRotation(0.0, 0.0, -1.5708);
  const sph003MZ = sph003.clone();
  sph003MZ.updateMatrixWorld(true);
  sph003.position.set(0, 0, -1.527);
  sph003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  sph003MZ.position.set(0, 0, 1.5269);
  const sph003MrZ = new THREE.Group();
  sph003MrZ.add(sph003, sph003MZ);
  sph003MrZ.position.set(12.638, 3.1527, 0);
  const kub346 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub346.scale.set(0.1275, -0.0446, 0.9062);
  kub346.setRotation(1.5708, 1.5708, 0.0);
  const kub346MZ = kub346.clone();
  kub346MZ.updateMatrixWorld(true);
  kub346.position.set(0, 0, -2.2407);
  kub346MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub346MZ.position.set(0, 0, 2.2406);
  const kub346MrZ = new THREE.Group();
  kub346MrZ.add(kub346, kub346MZ);
  kub346MrZ.position.set(12.5445, 4.965, 0);
  const kub347 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub347.scale.set(0.1275, -0.0446, 0.9062);
  kub347.setRotation(1.5708, 1.5708, 0.0);
  const kub347MZ = kub347.clone();
  kub347MZ.updateMatrixWorld(true);
  kub347.position.set(0, 0, -0.8133);
  kub347MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub347MZ.position.set(0, 0, 0.8132);
  const kub347MrZ = new THREE.Group();
  kub347MrZ.add(kub347, kub347MZ);
  kub347MrZ.position.set(12.5445, 4.965, 0);
  const kub348 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub348.scale.set(0.8412, -0.0446, 0.681);
  kub348.setRotation(1.5708, 1.5708, 0.0);
  const kub348MZ = kub348.clone();
  kub348MZ.updateMatrixWorld(true);
  kub348.position.set(0, 0, -1.527);
  kub348MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub348MZ.position.set(0, 0, 1.5269);
  const kub348MrZ = new THREE.Group();
  kub348MrZ.add(kub348, kub348MZ);
  kub348MrZ.position.set(12.5445, 6.5057, 0);
  const kub349 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub349.position.set(12.5445, 3.1527, -0.0);
  kub349.scale.set(0.7058, -0.0351, 0.9062);
  kub349.setRotation(1.5708, 1.5708, 0.0);

  const kub350 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub350.position.set(12.5445, 6.4998, -0.0);
  kub350.scale.set(0.7058, -0.0351, 0.6869);
  kub350.setRotation(1.5708, 1.5708, 0.0);

  const kub351 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub351.scale.set(0.1434, -0.0309, 0.1545);
  kub351.setRotation(1.5708, 1.5708, 0.7854);
  const kub351MZ = kub351.clone();
  kub351MZ.updateMatrixWorld(true);
  kub351.position.set(0, 0, -0.9277);
  kub351MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub351MZ.position.set(0, 0, 0.9276);
  const kub351MrZ = new THREE.Group();
  kub351MrZ.add(kub351, kub351MZ);
  const kub351MrZMY = kub351MrZ.clone();
  kub351MrZMY.updateMatrixWorld(true);
  kub351MrZ.position.set(0, 4.0498, 0);
  kub351MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub351MrZMY.position.set(0, 5.827, 0);
  const kub351MrZMrY = new THREE.Group();
  kub351MrZMrY.add(kub351MrZ, kub351MrZMY);
  kub351MrZMrY.position.set(12.5445, 0, 0);
  const kub352 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub352.scale.set(0.0151, 1.0, 0.7144);
  kub352.setRotation(0.0, 0.0, -0.0);
  const kub352MZ = kub352.clone();
  kub352MZ.updateMatrixWorld(true);
  kub352.position.set(0, 0, -1.527);
  kub352MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub352MZ.position.set(0, 0, 1.5269);
  const kub352MrZ = new THREE.Group();
  kub352MrZ.add(kub352, kub352MZ);
  kub352MrZ.position.set(12.5445, 4.9411, 0);
  const kub353 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub353.scale.set(0.4607, -0.0309, 0.0226);
  kub353.setRotation(1.5708, 1.5708, -0.0);
  const kub353MZ = kub353.clone();
  kub353MZ.updateMatrixWorld(true);
  kub353.position.set(0, 0, -1.527);
  kub353MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub353MZ.position.set(0, 0, 1.5269);
  const kub353MrZ = new THREE.Group();
  kub353MrZ.add(kub353, kub353MZ);
  const kub353MrZMY = kub353MrZ.clone();
  kub353MrZMY.updateMatrixWorld(true);
  kub353MrZ.position.set(0, 4.0617, 0);
  kub353MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub353MrZMY.position.set(0, 5.815, 0);
  const kub353MrZMrY = new THREE.Group();
  kub353MrZMrY.add(kub353MrZ, kub353MrZMY);
  kub353MrZMrY.position.set(12.5445, 0, 0);
  const kub354 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub354.scale.set(0.7643, -0.0309, 0.0226);
  kub354.setRotation(3.1416, 0.0, 1.5708);
  const kub354MX = kub354.clone();
  kub354MX.updateMatrixWorld(true);
  kub354.position.set(12.5445, 0, 0);
  kub354MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub354MX.position.set(12.5445, 0, 0);
  const kub354MrX = new THREE.Group();
  kub354MrX.add(kub354, kub354MX);
  const kub354MrXMZ = kub354MrX.clone();
  kub354MrXMZ.updateMatrixWorld(true);
  kub354MrX.position.set(0, 0, -0.9381);
  kub354MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub354MrXMZ.position.set(0, 0, 0.9381);
  const kub354MrXMrZ = new THREE.Group();
  kub354MrXMrZ.add(kub354MrX, kub354MrXMZ);
  const kub354MrXMrZMY = kub354MrXMrZ.clone();
  kub354MrXMrZMY.updateMatrixWorld(true);
  kub354MrXMrZ.position.set(0, 4.936, 0);
  kub354MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub354MrXMrZMY.position.set(0, 4.9408, 0);
  const kub354MrXMrZMrY = new THREE.Group();
  kub354MrXMrZMrY.add(kub354MrXMrZ, kub354MrXMrZMY);
  const kub355 = new THREE.Mesh(boxGeo, GlassMaterial);
  kub355.position.set(12.5445, 4.9384, -0.0);
  kub355.scale.set(0.0151, 0.9645, 0.4812);

  const kub356 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub356.scale.set(0.1434, -0.0309, 0.1545);
  kub356.setRotation(1.5708, 1.5708, 0.7854);
  const kub356MZ = kub356.clone();
  kub356MZ.updateMatrixWorld(true);
  kub356.position.set(0, 0, 0.4478);
  kub356MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub356MZ.position.set(0, 0, -0.4478);
  const kub356MrZ = new THREE.Group();
  kub356MrZ.add(kub356, kub356MZ);
  const kub356MrZMY = kub356MrZ.clone();
  kub356MrZMY.updateMatrixWorld(true);
  kub356MrZ.position.set(0, 4.0693, 0);
  kub356MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub356MrZMY.position.set(0, 5.8075, 0);
  const kub356MrZMrY = new THREE.Group();
  kub356MrZMrY.add(kub356MrZ, kub356MrZMY);
  kub356MrZMrY.position.set(12.5445, 0, 0);
  const kub357 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub357.scale.set(0.4607, -0.0309, 0.0226);
  kub357.setRotation(1.5708, 1.5708, -0.0);
  const kub357MY = kub357.clone();
  kub357MY.updateMatrixWorld(true);
  kub357.position.set(0, 4.0568, 0);
  kub357MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub357MY.position.set(0, 5.82, 0);
  const kub357MrY = new THREE.Group();
  kub357MrY.add(kub357, kub357MY);
  kub357MrY.position.set(12.5445, 0, -0.0);
  const kub358 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub358.scale.set(0.7643, -0.0309, 0.0226);
  kub358.setRotation(3.1416, 0.0, 1.5708);
  const kub358MZ = kub358.clone();
  kub358MZ.updateMatrixWorld(true);
  kub358.position.set(0, 0, 0.4584);
  kub358MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub358MZ.position.set(0, 0, -0.4584);
  const kub358MrZ = new THREE.Group();
  kub358MrZ.add(kub358, kub358MZ);
  kub358MrZ.position.set(12.5445, 4.9303, 0);
  const kub359 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub359.scale.set(0.7643, -0.0309, 0.0226);
  kub359.setRotation(3.1416, 0.0, 1.5708);
  const kub359MX = kub359.clone();
  kub359MX.updateMatrixWorld(true);
  kub359.position.set(12.5445, 0, 0);
  kub359MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub359MX.position.set(12.5445, 0, 0);
  const kub359MrX = new THREE.Group();
  kub359MrX.add(kub359, kub359MX);
  const kub359MrXMZ = kub359MrX.clone();
  kub359MrXMZ.updateMatrixWorld(true);
  kub359MrX.position.set(0, 0, 2.1187);
  kub359MrXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub359MrXMZ.position.set(0, 0, -2.1187);
  const kub359MrXMrZ = new THREE.Group();
  kub359MrXMrZ.add(kub359MrX, kub359MrXMZ);
  const kub359MrXMrZMY = kub359MrXMrZ.clone();
  kub359MrXMrZMY.updateMatrixWorld(true);
  kub359MrXMrZ.position.set(0, 4.936, 0);
  kub359MrXMrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub359MrXMrZMY.position.set(0, 4.9408, 0);
  const kub359MrXMrZMrY = new THREE.Group();
  kub359MrXMrZMrY.add(kub359MrXMrZ, kub359MrXMrZMY);
  const kub360 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub360.scale.set(0.1434, -0.0309, 0.1545);
  kub360.setRotation(1.5708, 1.5708, 0.7854);
  const kub360MZ = kub360.clone();
  kub360MZ.updateMatrixWorld(true);
  kub360.position.set(0, 0, 2.1206);
  kub360MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub360MZ.position.set(0, 0, -2.1207);
  const kub360MrZ = new THREE.Group();
  kub360MrZ.add(kub360, kub360MZ);
  const kub360MrZMY = kub360MrZ.clone();
  kub360MrZMY.updateMatrixWorld(true);
  kub360MrZ.position.set(0, 4.0498, 0);
  kub360MrZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub360MrZMY.position.set(0, 5.827, 0);
  const kub360MrZMrY = new THREE.Group();
  kub360MrZMrY.add(kub360MrZ, kub360MrZMY);
  kub360MrZMrY.position.set(12.5445, 0, 0);
  const kub361 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub361.position.set(-0.0006, 7.2557, -0.0);
  kub361.scale.set(12.5898, 0.069, 2.4701);

  const kub362 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub362.position.set(-0.0006, 7.3977, -0.0);
  kub362.scale.set(12.1678, 0.2214, 1.4361);

  const kub363 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub363.position.set(-12.1452, 7.2829, -0.0);
  kub363.scale.set(0.2541, 0.2214, 1.4361);
  kub363.setRotation(0.0, 0.0, -0.7854);

  const kub364 = new THREE.Mesh(boxGeo, Ceiling_trainMaterial);
  kub364.position.set(-0.0006, 7.0623, -0.0);
  kub364.scale.set(12.5105, 0.1214, 2.3753);

  const kub365 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub365.position.set(-0.0006, 2.1963, -0.0);
  kub365.scale.set(12.5105, 0.1214, 2.3753);

  const kub372 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub372.position.set(-12.5457, 4.9776, 0.5792);
  kub372.scale.set(0.1266, 0.0351, 0.9188);
  kub372.setRotation(1.5708, 1.5708, 0.0);

  const kub373 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub373.position.set(12.5445, 4.9776, 0.5792);
  kub373.scale.set(0.1266, 0.0351, 0.9188);
  kub373.setRotation(1.5708, 1.5708, 0.0);

  const kub374 = new THREE.Mesh(boxGeo, Train_blueMaterial);
  kub374.position.set(12.5445, 4.9776, -0.5792);
  kub374.scale.set(0.1266, 0.0351, 0.9188);
  kub374.setRotation(1.5708, 1.5708, 0.0);

  const kub409Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub409 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub409.scale.set(2.1144, 0.051, 0.8864);
    kub409.position.set(6.4194 * i, 0, 0);
    kub409Gr.add(kub409);
  }
  kub409Gr.setRotation(1.5708, 0.0, 0.0);
  kub409Gr.position.set(-6.4204, 3.1279, 2.4191);
  const kub410Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub410 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub410.scale.set(2.1144, 0.051, 0.7023);
    kub410.position.set(6.4194 * i, 0, 0);
    kub410Gr.add(kub410);
  }
  kub410Gr.setRotation(1.5708, 0.0, 0.0);
  kub410Gr.position.set(-6.4204, 6.2439, 2.4191);
  const kub411 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub411.position.set(-0.001, 7.0636, -2.4216);
  kub411.scale.set(10.7268, 0.051, 0.1232);
  kub411.setRotation(1.5708, 0.0, 0.0);

  const kub412Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub412 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub412.scale.set(0.5707, 0.051, 0.7636);
    kub412.position.set(6.4195 * i, 0, 0);
    kub412Gr.add(kub412);
  }
  kub412Gr.setRotation(1.5708, 0.0, 0.0);
  kub412Gr.position.set(-7.9641, 4.778, 2.4191);
  const kub413Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub413 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub413.scale.set(0.5707, 0.051, 0.7636);
    kub413.position.set(6.4195 * i, 0, 0);
    kub413Gr.add(kub413);
  }
  kub413Gr.setRotation(1.5708, 0.0, 0.0);
  kub413Gr.position.set(-4.8768, 4.778, 2.4191);
  const kub414Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub414 = new THREE.Mesh(boxGeo, GlassMaterial);
    kub414.scale.set(-0.0151, 0.786, 1.0055);
    kub414.position.set(0, 0, 6.4153 * i);
    kub414Gr.add(kub414);
  }
  kub414Gr.setRotation(0.0, 1.5708, 0.0);
  kub414Gr.position.set(-6.4205, 4.778, 2.4191);
  const kub415Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub415 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub415.scale.set(0.9267, 0.0309, 0.0215);
    kub415.position.set(-6.4313 * i, 0, 0);
    kub415Gr.add(kub415);
  }
  kub415Gr.setRotation(1.5708, 3.1416, 0.0);
  const kub415GroupMY = kub415Gr.clone();
  kub415GroupMY.updateMatrixWorld(true);
  kub415Gr.position.set(0, 4.0179, 0);
  kub415GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub415GroupMY.position.set(0, 5.5774, 0);
  const kub415GroupMrY = new THREE.Group();
  kub415GroupMrY.add(kub415Gr, kub415GroupMY);
  kub415GroupMrY.position.set(-6.4205, 0, 2.4191);
  const kub416Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub416 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub416.scale.set(0.1252, 0.0309, 0.1349);
    kub416.position.set(-4.5462 * i, 0, -4.5331 * i);
    kub416Gr.add(kub416);
  }
  kub416Gr.setRotation(1.5708, 3.1416, 0.7854);
  const kub416GroupMY = kub416Gr.clone();
  kub416GroupMY.updateMatrixWorld(true);
  kub416Gr.position.set(0, 4.0135, 0);
  kub416GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub416GroupMY.position.set(0, 5.5424, 0);
  const kub416GroupMrY = new THREE.Group();
  kub416GroupMrY.add(kub416Gr, kub416GroupMY);
  kub416GroupMrY.position.set(-7.3886, 0, 2.4191);
  const kub417Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub417 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub417.scale.set(0.1252, 0.0309, 0.1349);
    kub417.position.set(-4.5462 * i, 0, -4.5331 * i);
    kub417Gr.add(kub417);
  }
  kub417Gr.setRotation(1.5708, 3.1416, 0.7854);
  const kub417GroupMY = kub417Gr.clone();
  kub417GroupMY.updateMatrixWorld(true);
  kub417Gr.position.set(0, 3.9782, 0);
  kub417GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub417GroupMY.position.set(0, 5.5778, 0);
  const kub417GroupMrY = new THREE.Group();
  kub417GroupMrY.add(kub417Gr, kub417GroupMY);
  kub417GroupMrY.position.set(-5.4376, 0, 2.4191);
  const kub418Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub418 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub418.scale.set(0.7261, 0.0309, 0.0176);
    kub418.position.set(0, 0, -6.4199 * i);
    kub418Gr.add(kub418);
  }
  kub418Gr.setRotation(4.7124, 0.0, 1.5708);
  kub418Gr.position.set(-7.3937, 4.7961, 2.4191);
  const kub419Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub419 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub419.scale.set(0.7261, 0.0309, 0.0176);
    kub419.position.set(0, 0, -6.4199 * i);
    kub419Gr.add(kub419);
  }
  kub419Gr.setRotation(4.7124, 0.0, 1.5708);
  kub419Gr.position.set(-5.4465, 4.7961, 2.4191);
  const kub420Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub420 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub420.scale.set(2.1144, 0.051, 0.8864);
    kub420.position.set(6.4194 * i, 0, 0);
    kub420Gr.add(kub420);
  }
  kub420Gr.setRotation(1.5708, 0.0, 0.0);
  kub420Gr.position.set(-6.4204, 3.1279, -2.4192);
  const kub421Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub421 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub421.scale.set(2.1144, 0.051, 0.7023);
    kub421.position.set(6.4194 * i, 0, 0);
    kub421Gr.add(kub421);
  }
  kub421Gr.setRotation(1.5708, 0.0, 0.0);
  kub421Gr.position.set(-6.4204, 6.2439, -2.4192);
  const kub422Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub422 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub422.scale.set(0.5707, 0.051, 0.7636);
    kub422.position.set(6.4195 * i, 0, 0);
    kub422Gr.add(kub422);
  }
  kub422Gr.setRotation(1.5708, 0.0, 0.0);
  kub422Gr.position.set(-7.9641, 4.778, -2.4192);
  const kub423Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub423 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub423.scale.set(0.5707, 0.051, 0.7636);
    kub423.position.set(6.4195 * i, 0, 0);
    kub423Gr.add(kub423);
  }
  kub423Gr.setRotation(1.5708, 0.0, 0.0);
  kub423Gr.position.set(-4.8768, 4.778, -2.4192);
  const kub424Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub424 = new THREE.Mesh(boxGeo, GlassMaterial);
    kub424.scale.set(-0.0151, 0.786, 1.0055);
    kub424.position.set(0, 0, 6.4153 * i);
    kub424Gr.add(kub424);
  }
  kub424Gr.setRotation(0.0, 1.5708, 0.0);
  kub424Gr.position.set(-6.4205, 4.778, -2.4192);
  const kub425Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub425 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub425.scale.set(0.9267, 0.0309, 0.0215);
    kub425.position.set(-6.4313 * i, 0, 0);
    kub425Gr.add(kub425);
  }
  kub425Gr.setRotation(1.5708, 3.1416, 0.0);
  const kub425GroupMY = kub425Gr.clone();
  kub425GroupMY.updateMatrixWorld(true);
  kub425Gr.position.set(0, 4.0179, 0);
  kub425GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub425GroupMY.position.set(0, 5.5774, 0);
  const kub425GroupMrY = new THREE.Group();
  kub425GroupMrY.add(kub425Gr, kub425GroupMY);
  kub425GroupMrY.position.set(-6.4205, 0, -2.4192);
  const kub426Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub426 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub426.scale.set(0.1252, 0.0309, 0.1349);
    kub426.position.set(-4.5462 * i, 0, -4.5331 * i);
    kub426Gr.add(kub426);
  }
  kub426Gr.setRotation(1.5708, 3.1416, 0.7854);
  const kub426GroupMY = kub426Gr.clone();
  kub426GroupMY.updateMatrixWorld(true);
  kub426Gr.position.set(0, 4.0135, 0);
  kub426GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub426GroupMY.position.set(0, 5.5424, 0);
  const kub426GroupMrY = new THREE.Group();
  kub426GroupMrY.add(kub426Gr, kub426GroupMY);
  kub426GroupMrY.position.set(-7.3886, 0, -2.4192);
  const kub427Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub427 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub427.scale.set(0.1252, 0.0309, 0.1349);
    kub427.position.set(-4.5462 * i, 0, -4.5331 * i);
    kub427Gr.add(kub427);
  }
  kub427Gr.setRotation(1.5708, 3.1416, 0.7854);
  const kub427GroupMY = kub427Gr.clone();
  kub427GroupMY.updateMatrixWorld(true);
  kub427Gr.position.set(0, 3.9782, 0);
  kub427GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub427GroupMY.position.set(0, 5.5778, 0);
  const kub427GroupMrY = new THREE.Group();
  kub427GroupMrY.add(kub427Gr, kub427GroupMY);
  kub427GroupMrY.position.set(-5.4376, 0, -2.4192);
  const kub428Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub428 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub428.scale.set(0.7261, 0.0309, 0.0176);
    kub428.position.set(0, 0, -6.4199 * i);
    kub428Gr.add(kub428);
  }
  kub428Gr.setRotation(4.7124, 0.0, 1.5708);
  kub428Gr.position.set(-7.3937, 4.7961, -2.4192);
  const kub429Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub429 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub429.scale.set(0.7261, 0.0309, 0.0176);
    kub429.position.set(0, 0, -6.4199 * i);
    kub429Gr.add(kub429);
  }
  kub429Gr.setRotation(4.7124, 0.0, 1.5708);
  kub429Gr.position.set(-5.4465, 4.7961, -2.4192);
  const kub430 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub430.position.set(-0.001, 7.0636, 2.4074);
  kub430.scale.set(10.7268, 0.051, 0.1232);
  kub430.setRotation(1.5708, 0.0, 0.0);

  const kub431Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub431 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub431.scale.set(2.1443, 0.0248, 0.1709);
    kub431.position.set(6.4201 * i, 0, 0);
    kub431Gr.add(kub431);
  }
  kub431Gr.setRotation(1.5708, 0.0, 0.0);
  kub431Gr.position.set(-6.4204, 3.7969, -2.4653);
  const kub432Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub432 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub432.scale.set(0.9461, 0.0248, 0.1709);
    kub432.position.set(23.3213 * i, 0, 0);
    kub432Gr.add(kub432);
  }
  kub432Gr.setRotation(1.5708, 0.0, 0.0);
  kub432Gr.position.set(-11.6623, 3.7969, -2.4653);
  const kub433Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub433 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub433.scale.set(0.9146, 0.0248, 0.1709);
    kub433.position.set(0, 25.1753 * i, 0);
    kub433Gr.add(kub433);
  }
  kub433Gr.setRotation(1.5708, 1.5708, 0.0);
  kub433Gr.position.set(-12.5888, 3.7969, -1.5755);
  const kub442Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub442 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub442.scale.set(0.0294, 0.0351, 2.0562);
    kub442.position.set(0, 0, -6.4153 * i);
    kub442Gr.add(kub442);
  }
  kub442Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub442Gr.position.set(-6.4204, 3.4743, -2.4483);
  const kub443Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub443 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub443.scale.set(0.0294, 0.0351, 2.0562);
    kub443.position.set(0, 0, -6.4153 * i);
    kub443Gr.add(kub443);
  }
  kub443Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub443Gr.position.set(-6.4204, 2.9648, -2.4483);
  const kub444Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub444 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub444.scale.set(0.0294, 0.0351, 2.0562);
    kub444.position.set(0, 0, -6.4153 * i);
    kub444Gr.add(kub444);
  }
  kub444Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub444Gr.position.set(-6.4204, 2.4562, -2.4483);
  const kub445Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub445 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub445.scale.set(0.0294, 0.0351, 2.0562);
    kub445.position.set(0, 0, -6.4153 * i);
    kub445Gr.add(kub445);
  }
  kub445Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub445Gr.position.set(-6.4204, 6.5576, -2.4483);
  const kub446Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub446 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub446.scale.set(0.0294, 0.0351, 2.0562);
    kub446.position.set(0, 0, -6.4153 * i);
    kub446Gr.add(kub446);
  }
  kub446Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub446Gr.position.set(-6.4204, 6.0482, -2.4483);
  const kub447Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub447 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub447.scale.set(0.0294, 0.0351, 0.5273);
    kub447.position.set(0, 0, -6.4229 * i);
    kub447Gr.add(kub447);
  }
  kub447Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub447Gr.position.set(-4.8768, 5.0327, -2.4544);
  const kub448Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub448 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub448.scale.set(0.0294, 0.0351, 0.5273);
    kub448.position.set(0, 0, -6.4229 * i);
    kub448Gr.add(kub448);
  }
  kub448Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub448Gr.position.set(-4.8768, 4.5232, -2.4544);
  const kub449Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub449 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub449.scale.set(0.0294, 0.0351, 0.5273);
    kub449.position.set(0, 0, -6.4229 * i);
    kub449Gr.add(kub449);
  }
  kub449Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub449Gr.position.set(-7.9641, 5.0327, -2.4544);
  const kub450Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub450 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub450.scale.set(0.0294, 0.0351, 0.5273);
    kub450.position.set(0, 0, -6.4229 * i);
    kub450Gr.add(kub450);
  }
  kub450Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub450Gr.position.set(-7.9641, 4.5232, -2.4544);
  const kub451Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub451 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub451.scale.set(0.0294, 0.0351, 0.8515);
    kub451.position.set(0, 0, -23.3301 * i);
    kub451Gr.add(kub451);
  }
  kub451Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub451Gr.position.set(-11.6586, 5.2258, -2.465);
  const kub452Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub452 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub452.scale.set(0.0294, 0.0351, 0.8515);
    kub452.position.set(0, 0, -23.3301 * i);
    kub452Gr.add(kub452);
  }
  kub452Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub452Gr.position.set(-11.6586, 4.7163, -2.465);
  const kub453Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub453 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub453.scale.set(0.0294, 0.0351, 0.8515);
    kub453.position.set(0, 0, -23.3301 * i);
    kub453Gr.add(kub453);
  }
  kub453Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub453Gr.position.set(-11.6586, 4.2077, -2.465);
  const kub454Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub454 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub454.scale.set(0.0294, 0.0351, 0.8515);
    kub454.position.set(0, 0, -23.3301 * i);
    kub454Gr.add(kub454);
  }
  kub454Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub454Gr.position.set(-11.6586, 6.7176, -2.465);
  const kub455Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub455 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub455.scale.set(0.0294, 0.0351, 0.8515);
    kub455.position.set(0, 0, -23.3301 * i);
    kub455Gr.add(kub455);
  }
  kub455Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub455Gr.position.set(-11.6586, 6.2081, -2.465);
  const kub456Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub456 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub456.scale.set(0.0294, 0.0351, 0.8515);
    kub456.position.set(0, 0, -23.3301 * i);
    kub456Gr.add(kub456);
  }
  kub456Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub456Gr.position.set(-11.6586, 5.6995, -2.465);
  const kub457Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub457 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub457.scale.set(0.0294, 0.0351, 0.8515);
    kub457.position.set(0, 0, -23.3301 * i);
    kub457Gr.add(kub457);
  }
  kub457Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub457Gr.position.set(-11.6586, 3.2845, -2.465);
  const kub458Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub458 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub458.scale.set(0.0294, 0.0351, 0.8515);
    kub458.position.set(0, 0, -23.3301 * i);
    kub458Gr.add(kub458);
  }
  kub458Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub458Gr.position.set(-11.6586, 2.775, -2.465);
  const kub459Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub459 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub459.scale.set(0.0294, 0.0351, 0.8515);
    kub459.position.set(0, 0, -23.3301 * i);
    kub459Gr.add(kub459);
  }
  kub459Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub459Gr.position.set(-11.6586, 2.2664, -2.465);
  const kub460Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub460 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub460.scale.set(1.0, 0.4065, 0.5334);
    kub460.position.set(-2.2 * i, 0, 0);
    kub460Gr.add(kub460);
  }
  kub460Gr.position.set(4.7305, 1.2702, -1.8726);
  const kub461Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub461 = new THREE.Mesh(boxGeo, ColoumnMaterial);
    kub461.scale.set(1.0, 0.4065, 0.5334);
    kub461.position.set(-2.2 * i, 0, 0);
    kub461Gr.add(kub461);
  }
  kub461Gr.position.set(4.7305, 1.2702, 1.8725);
  const kub462Gr = new THREE.Group();
  for (let i = 0; i < 31; i++) {
    const kub462 = new THREE.Mesh(boxGeo, Train_blueMaterial);
    kub462.scale.set(0.1124, 0.1685, 0.2825);
    kub462.position.set(0.7865 * i, 0, 0);
    kub462Gr.add(kub462);
  }
  kub462Gr.setRotation(-0.5843, 0.0, 0.0);
  const kub462GroupMZ = kub462Gr.clone();
  kub462GroupMZ.updateMatrixWorld(true);
  kub462Gr.position.set(0, 0, -1.5788);
  kub462GroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub462GroupMZ.position.set(0, 0, 1.5787);
  const kub462GroupMrZ = new THREE.Group();
  kub462GroupMrZ.add(kub462Gr, kub462GroupMZ);
  kub462GroupMrZ.position.set(-11.6149, 7.3227, 0);
  const kub463 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub463.position.set(12.1903, 7.2829, -0.0);
  kub463.scale.set(-0.2541, -0.2214, 1.4361);
  kub463.setRotation(0.0, 0.0, -0.7854);

  const kub464Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub464 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub464.scale.set(2.1443, -0.0248, 0.1709);
    kub464.position.set(6.4201 * i, 0, 0);
    kub464Gr.add(kub464);
  }
  kub464Gr.setRotation(1.5708, 0.0, 0.0);
  kub464Gr.position.set(-6.4204, 3.7969, 2.4659);
  const kub465Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub465 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub465.scale.set(0.9461, -0.0248, 0.1709);
    kub465.position.set(23.3213 * i, 0, 0);
    kub465Gr.add(kub465);
  }
  kub465Gr.setRotation(1.5708, 0.0, 0.0);
  kub465Gr.position.set(-11.6623, 3.7969, 2.4659);
  const kub466Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub466 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub466.scale.set(-0.9146, 0.0248, 0.1709);
    kub466.position.set(0, 25.1753 * i, 0);
    kub466Gr.add(kub466);
  }
  kub466Gr.setRotation(1.5708, 1.5708, 0.0);
  kub466Gr.position.set(-12.5888, 3.7969, 1.5761);
  const kub475Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub475 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub475.scale.set(-0.0294, -0.0351, 2.0562);
    kub475.position.set(0, 0, -6.4153 * i);
    kub475Gr.add(kub475);
  }
  kub475Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub475Gr.position.set(-6.4204, 3.4743, 2.4489);
  const kub476Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub476 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub476.scale.set(-0.0294, -0.0351, 2.0562);
    kub476.position.set(0, 0, -6.4153 * i);
    kub476Gr.add(kub476);
  }
  kub476Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub476Gr.position.set(-6.4204, 2.9648, 2.4489);
  const kub477Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub477 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub477.scale.set(-0.0294, -0.0351, 2.0562);
    kub477.position.set(0, 0, -6.4153 * i);
    kub477Gr.add(kub477);
  }
  kub477Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub477Gr.position.set(-6.4204, 2.4562, 2.4489);
  const kub478Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub478 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub478.scale.set(-0.0294, -0.0351, 2.0562);
    kub478.position.set(0, 0, -6.4153 * i);
    kub478Gr.add(kub478);
  }
  kub478Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub478Gr.position.set(-6.4204, 6.5576, 2.4489);
  const kub479Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub479 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub479.scale.set(-0.0294, -0.0351, 2.0562);
    kub479.position.set(0, 0, -6.4153 * i);
    kub479Gr.add(kub479);
  }
  kub479Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub479Gr.position.set(-6.4204, 6.0482, 2.4489);
  const kub480Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub480 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub480.scale.set(-0.0294, -0.0351, 0.5273);
    kub480.position.set(0, 0, -6.4229 * i);
    kub480Gr.add(kub480);
  }
  kub480Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub480Gr.position.set(-4.8768, 5.0327, 2.455);
  const kub481Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub481 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub481.scale.set(-0.0294, -0.0351, 0.5273);
    kub481.position.set(0, 0, -6.4229 * i);
    kub481Gr.add(kub481);
  }
  kub481Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub481Gr.position.set(-4.8768, 4.5232, 2.455);
  const kub482Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub482 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub482.scale.set(-0.0294, -0.0351, 0.5273);
    kub482.position.set(0, 0, -6.4229 * i);
    kub482Gr.add(kub482);
  }
  kub482Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub482Gr.position.set(-7.9641, 5.0327, 2.455);
  const kub483Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub483 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub483.scale.set(-0.0294, -0.0351, 0.5273);
    kub483.position.set(0, 0, -6.4229 * i);
    kub483Gr.add(kub483);
  }
  kub483Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub483Gr.position.set(-7.9641, 4.5232, 2.455);
  const kub484Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub484 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub484.scale.set(-0.0294, -0.0351, 0.8515);
    kub484.position.set(0, 0, -23.3301 * i);
    kub484Gr.add(kub484);
  }
  kub484Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub484Gr.position.set(-11.6586, 5.2258, 2.4657);
  const kub485Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub485 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub485.scale.set(-0.0294, -0.0351, 0.8515);
    kub485.position.set(0, 0, -23.3301 * i);
    kub485Gr.add(kub485);
  }
  kub485Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub485Gr.position.set(-11.6586, 4.7163, 2.4657);
  const kub486Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub486 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub486.scale.set(-0.0294, -0.0351, 0.8515);
    kub486.position.set(0, 0, -23.3301 * i);
    kub486Gr.add(kub486);
  }
  kub486Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub486Gr.position.set(-11.6586, 4.2077, 2.4657);
  const kub487Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub487 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub487.scale.set(-0.0294, -0.0351, 0.8515);
    kub487.position.set(0, 0, -23.3301 * i);
    kub487Gr.add(kub487);
  }
  kub487Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub487Gr.position.set(-11.6586, 6.7176, 2.4657);
  const kub488Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub488 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub488.scale.set(-0.0294, -0.0351, 0.8515);
    kub488.position.set(0, 0, -23.3301 * i);
    kub488Gr.add(kub488);
  }
  kub488Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub488Gr.position.set(-11.6586, 6.2081, 2.4657);
  const kub489Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub489 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub489.scale.set(-0.0294, -0.0351, 0.8515);
    kub489.position.set(0, 0, -23.3301 * i);
    kub489Gr.add(kub489);
  }
  kub489Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub489Gr.position.set(-11.6586, 5.6995, 2.4657);
  const kub490Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub490 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub490.scale.set(-0.0294, -0.0351, 0.8515);
    kub490.position.set(0, 0, -23.3301 * i);
    kub490Gr.add(kub490);
  }
  kub490Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub490Gr.position.set(-11.6586, 3.2845, 2.4657);
  const kub491Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub491 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub491.scale.set(-0.0294, -0.0351, 0.8515);
    kub491.position.set(0, 0, -23.3301 * i);
    kub491Gr.add(kub491);
  }
  kub491Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub491Gr.position.set(-11.6586, 2.775, 2.4657);
  const kub492Gr = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const kub492 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub492.scale.set(-0.0294, -0.0351, 0.8515);
    kub492.position.set(0, 0, -23.3301 * i);
    kub492Gr.add(kub492);
  }
  kub492Gr.setRotation(-0.0, -1.5708, 0.7854);
  kub492Gr.position.set(-11.6586, 2.2664, 2.4657);
  const kub493 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub493.scale.set(0.0457, 0.0229, 0.0229);
  kub493.setRotation(0.0, 0.0, -0.0);
  const kub493MZ = kub493.clone();
  kub493MZ.updateMatrixWorld(true);
  kub493.position.set(0, 0, -0.8133);
  kub493MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub493MZ.position.set(0, 0, -0.8133);
  const kub493MrZ = new THREE.Group();
  kub493MrZ.add(kub493, kub493MZ);
  kub493MrZ.position.set(-12.636, 4.0817, 0);
  const cyl025 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl025.position.set(-12.6604, 4.965, -0.8133);
  cyl025.scale.set(0.017, 0.87, 0.017);

  const kub494 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub494.scale.set(0.0457, 0.0229, 0.0229);
  kub494.setRotation(0.0, 0.0, -0.0);
  const kub494MZ = kub494.clone();
  kub494MZ.updateMatrixWorld(true);
  kub494.position.set(0, 0, 0.8132);
  kub494MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub494MZ.position.set(0, 0, -2.4397);
  const kub494MrZ = new THREE.Group();
  kub494MrZ.add(kub494, kub494MZ);
  kub494MrZ.position.set(-12.636, 4.0817, 0);
  const cyl026 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl026.position.set(-12.6604, 4.965, 0.8132);
  cyl026.scale.set(0.017, 0.87, 0.017);

  const kub495 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub495.scale.set(-0.0457, 0.0229, 0.0229);
  kub495.setRotation(0.0, 0.0, -0.0);
  const kub495MZ = kub495.clone();
  kub495MZ.updateMatrixWorld(true);
  kub495.position.set(0, 0, -0.8133);
  kub495MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub495MZ.position.set(0, 0, -0.8133);
  const kub495MrZ = new THREE.Group();
  kub495MrZ.add(kub495, kub495MZ);
  kub495MrZ.position.set(12.6349, 4.0817, 0);
  const cyl027 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl027.position.set(12.6592, 4.965, -0.8133);
  cyl027.scale.set(-0.017, 0.87, 0.017);

  const kub496 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub496.scale.set(-0.0457, 0.0229, 0.0229);
  kub496.setRotation(0.0, 0.0, -0.0);
  const kub496MZ = kub496.clone();
  kub496MZ.updateMatrixWorld(true);
  kub496.position.set(0, 0, 0.8132);
  kub496MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub496MZ.position.set(0, 0, -2.4397);
  const kub496MrZ = new THREE.Group();
  kub496MrZ.add(kub496, kub496MZ);
  kub496MrZ.position.set(12.6349, 4.0817, 0);
  const cyl028 = new THREE.Mesh(cylinderGeo, MetalMaterial);
  cyl028.position.set(12.6592, 4.965, 0.8132);
  cyl028.scale.set(-0.017, 0.87, 0.017);

  const kub497 = new THREE.Mesh(boxGeo, Floor_trainMaterial);
  kub497.position.set(-0.0006, 2.1963, -0.0);
  kub497.scale.set(12.5105, 0.1214, 2.3753);

  const kub533Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub533 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
    kub533.scale.set(2.1144, 0.051, 0.8864);
    kub533.position.set(6.4194 * i, 0, 0);
    kub533Gr.add(kub533);
  }
  kub533Gr.setRotation(1.5708, 0.0, 0.0);
  kub533Gr.position.set(-6.4204, 3.1279, 2.4191);
  const kub542Gr = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const kub542 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub542.scale.set(2.1443, -0.0248, 0.1709);
    kub542.position.set(6.4201 * i, 0, 0);
    kub542Gr.add(kub542);
  }
  kub542Gr.setRotation(1.5708, 0.0, 0.0);
  kub542Gr.position.set(-6.4204, 3.7969, 2.4659);
  const DrawTrainDoorFunctionEntityGr = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.4192 * i, 0, 0);
    DrawTrainDoorFunctionEntityGr.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGr.setRotation(0.0, 0.0, -0.0);

  const DrawTrainDoorFunctionEntityGroupMZ = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const DrawTrainDoorFunctionEntity = DrawTrainDoor();
    DrawTrainDoorFunctionEntity.position.set(6.4192 * i, 0, 0);
    DrawTrainDoorFunctionEntityGroupMZ.add(DrawTrainDoorFunctionEntity);
  }
  DrawTrainDoorFunctionEntityGroupMZ.updateMatrixWorld(true);

  DrawTrainDoorFunctionEntityGr.position.set(0, 0, -2.4011);
  DrawTrainDoorFunctionEntityGroupMZ.applyMatrix(
    new THREE.Matrix4().makeScale(1, 1, -1),
  );
  DrawTrainDoorFunctionEntityGroupMZ.position.set(0, 0, 2.4011);

  const DrawTrainDoorFunctionEntityGroupMrZ = new THREE.Group();
  DrawTrainDoorFunctionEntityGroupMrZ.add(
    DrawTrainDoorFunctionEntityGr,
    DrawTrainDoorFunctionEntityGroupMZ,
  );
  DrawTrainDoorFunctionEntityGroupMrZ.position.set(-9.6225, 2.2455, 0);

  const Decor = DrawVagonDecorations();
  const out = new THREE.Group();
  out.add(
    Decor,
    cylwheel_008MrZ,
    cylwheel_009MrZ,
    cylwheel_010MrZ,
    cylwheel_011MrZ,
    kub307,
    kub308MrZ,
    kub309MrZ,
    kub310MrZ,
    cyl021GroupMrZ,
    kub311MrZ,
    kub312MrZ,
    kub313MrZ,
    kub314MrZ,
    kub315MrZ,
    kub316MrZ,
    cylwheel_012MrZ,
    cylwheel_013MrZ,
    cylwheel_014MrZ,
    cylwheel_015MrZ,
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
    cyl022MrZ,
    sph002MrZ,
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
    cyl023GroupMrZ,
    kub344MrZ,
    kub345MrZ,
    cyl024MrZ,
    sph003MrZ,
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
    cyl025,
    kub494MrZ,
    cyl026,
    kub495MrZ,
    cyl027,
    kub496MrZ,
    cyl028,
    kub497,
    kub533Gr,
    kub542Gr,
    DrawTrainDoorFunctionEntityGroupMrZ,
  );

  return out;
}

function DrawRightDoorFunction() {
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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);

  const kub642 = new THREE.Mesh(boxGeo, Train_blue_003Material);
  kub642.position.set(-0.5485, 0.8713, -0.0051);
  kub642.scale.set(0.5484, 0.0351, 0.8609);
  kub642.setRotation(1.5708, 3.1416, 0.0);

  const kub643 = new THREE.Mesh(boxGeo, Glass_003Material);
  kub643.position.set(-0.5485, 2.5616, -0.0051);
  kub643.scale.set(-0.0151, 0.9163, 0.3739);
  kub643.setRotation(0.0, 1.5708, 0.0);

  const kub644 = new THREE.Mesh(boxGeo, Coloumn_003Material);
  kub644.scale.set(0.1252, 0.0309, 0.1349);
  kub644.setRotation(1.5708, 3.1416, 0.7854);
  const kub644MY = kub644.clone();
  kub644MY.updateMatrixWorld(true);
  kub644.position.set(0, 1.7421, 0);
  kub644MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub644MY.position.set(0, 3.3811, 0);
  const kub644MrY = new THREE.Group();
  kub644MrY.add(kub644, kub644MY);
  kub644MrY.position.set(-0.2006, 0, -0.0051);
  const kub645 = new THREE.Mesh(boxGeo, Train_blue_003Material);
  kub645.position.set(-0.9986, 2.605, -0.0051);
  kub645.scale.set(0.0984, 0.0351, 0.8728);
  kub645.setRotation(1.5708, 3.1416, 0.0);

  const kub646 = new THREE.Mesh(boxGeo, Coloumn_003Material);
  kub646.position.set(-0.5511, 1.7302, -0.0051);
  kub646.scale.set(0.3579, 0.0309, 0.0215);
  kub646.setRotation(1.5708, 3.1416, 0.0);

  const kub647 = new THREE.Mesh(boxGeo, Coloumn_003Material);
  kub647.scale.set(0.1252, 0.0309, 0.1349);
  kub647.setRotation(1.5708, 3.1416, 0.7854);
  const kub647MY = kub647.clone();
  kub647MY.updateMatrixWorld(true);
  kub647.position.set(0, 1.7421, 0);
  kub647MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
  kub647MY.position.set(0, 3.3811, 0);
  const kub647MrY = new THREE.Group();
  kub647MrY.add(kub647, kub647MY);
  kub647MrY.position.set(-0.9097, 0, -0.0051);
  const kub648 = new THREE.Mesh(boxGeo, WhiteDots_003Material);
  kub648.position.set(-0.0872, 0.5556, -0.0198);
  kub648.scale.set(0.087, 0.0279, 0.087);
  kub648.setRotation(1.5708, 0.0, -0.0);

  const kub649 = new THREE.Mesh(boxGeo, Coloumn_003Material);
  kub649.position.set(-0.0177, 2.3728, -0.0123);
  kub649.scale.set(2.3673, 0.0387, 0.0176);
  kub649.setRotation(4.7124, 0.0, 1.5708);

  const kub650 = new THREE.Mesh(boxGeo, Train_blue_003Material);
  kub650.position.set(-0.5485, 4.0511, -0.0051);
  kub650.scale.set(0.5484, 0.0351, 0.6526);
  kub650.setRotation(1.5708, 3.1416, 0.0);

  const kub651 = new THREE.Mesh(boxGeo, Glass_003Material);
  kub651.position.set(-0.5485, 2.5616, -0.0051);
  kub651.scale.set(-0.0151, 0.9163, 0.3739);
  kub651.setRotation(0.0, 1.5708, 0.0);

  const kub652 = new THREE.Mesh(boxGeo, Train_blue_003Material);
  kub652.position.set(-0.0985, 2.605, -0.0051);
  kub652.scale.set(0.0984, 0.0351, 0.8728);
  kub652.setRotation(1.5708, 3.1416, 0.0);

  const kub653 = new THREE.Mesh(boxGeo, WhiteDots_003Material);
  kub653.position.set(-0.6357, 1.1039, -0.0237);
  kub653.scale.set(0.7754, 0.0248, 0.1232);
  kub653.setRotation(1.5708, 0.0, -0.7854);

  const kub654 = new THREE.Mesh(boxGeo, Metal_003Material);
  kub654.position.set(-0.5485, 0.4296, -0.0099);
  kub654.scale.set(0.0294, 0.0351, 0.5456);
  kub654.setRotation(-1.5708, 0.0, 1.5708);

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

  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
  const torusGeo = new THREE.TorusGeometry(1, 0.25, 12, 48);

  const kubimage = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kubimage.position.set(-31.329, 5.5248, -0.0053);
  kubimage.scale.set(0.18, 3.8564, 3.3873);

  const kubborder = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder.position.set(-31.329, 6.267, 3.5536);
  kubborder.scale.set(0.2035, 5.141, 0.2341);

  const kubborder_001 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder_001.position.set(-31.329, 6.267, -3.667);
  kubborder_001.scale.set(0.2035, 5.141, 0.2341);

  const kubborder_002 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubborder_002.position.set(-31.3395, 1.3972, -0.005);
  kubborder_002.scale.set(0.2035, 3.6351, 0.2712);
  kubborder_002.setRotation(1.5708, 0.0, 0.0);

  const kubsmallroof_tileGr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile.scale.set(1.9374, -0.1342, 0.6357);
    kubsmallroof_tile.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tileGr.add(kubsmallroof_tile);
  }
  kubsmallroof_tileGr.setRotation(3.0771, 0.0, -0.0);
  kubsmallroof_tileGr.position.set(-29.7716, 9.7462, -0.6276);
  const kubsmallroof_tile_005Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_005 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_005.scale.set(1.9374, -0.1342, 0.6357);
    kubsmallroof_tile_005.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_005Gr.add(kubsmallroof_tile_005);
  }
  kubsmallroof_tile_005Gr.setRotation(2.968, 0.0, -0.0);
  kubsmallroof_tile_005Gr.position.set(-29.7716, 9.5972, -1.8736);
  const kubsmallroof_tile_004Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_004 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_004.scale.set(1.9374, -0.1342, 0.579);
    kubsmallroof_tile_004.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_004Gr.add(kubsmallroof_tile_004);
  }
  kubsmallroof_tile_004Gr.setRotation(2.8706, 0.0, -0.0);
  kubsmallroof_tile_004Gr.position.set(-29.7716, 9.3407, -3.0144);
  const kubsmallroof_tile_003Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_003 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_003.scale.set(1.9374, -0.1342, 0.5332);
    kubsmallroof_tile_003.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_003Gr.add(kubsmallroof_tile_003);
  }
  kubsmallroof_tile_003Gr.setRotation(2.7329, 0.0, -0.0);
  kubsmallroof_tile_003Gr.position.set(-29.7716, 8.9771, -4.0545);
  const kubsmallroof_tile_002Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_002 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_002.scale.set(1.9374, -0.1342, 0.5332);
    kubsmallroof_tile_002.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_002Gr.add(kubsmallroof_tile_002);
  }
  kubsmallroof_tile_002Gr.setRotation(2.4437, 0.0, -0.0);
  kubsmallroof_tile_002Gr.position.set(-29.7716, 8.4392, -4.9277);
  const kubsmallroof_tile_001Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_001 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_001.scale.set(1.9374, -0.1342, 0.6071);
    kubsmallroof_tile_001.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_001Gr.add(kubsmallroof_tile_001);
  }
  kubsmallroof_tile_001Gr.setRotation(2.1312, 0.0, -0.0);
  kubsmallroof_tile_001Gr.position.set(-29.7716, 7.6197, -5.6245);
  const kubsmallroof_tile_006Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_006 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_006.scale.set(0.1278, -0.1342, 0.6357);
    kubsmallroof_tile_006.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_006Gr.add(kubsmallroof_tile_006);
  }
  kubsmallroof_tile_006Gr.setRotation(3.0771, 0.0, -0.0);
  kubsmallroof_tile_006Gr.position.set(-27.7592, 9.6666, -0.6276);
  const kubsmallroof_tile_007Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_007 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_007.scale.set(0.1278, -0.1342, 0.6357);
    kubsmallroof_tile_007.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_007Gr.add(kubsmallroof_tile_007);
  }
  kubsmallroof_tile_007Gr.setRotation(2.968, 0.0, -0.0);
  kubsmallroof_tile_007Gr.position.set(-27.7592, 9.5176, -1.8736);
  const kubsmallroof_tile_008Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_008 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_008.scale.set(0.1278, -0.1342, 0.579);
    kubsmallroof_tile_008.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_008Gr.add(kubsmallroof_tile_008);
  }
  kubsmallroof_tile_008Gr.setRotation(2.8706, 0.0, -0.0);
  kubsmallroof_tile_008Gr.position.set(-27.7592, 9.261, -3.0144);
  const kubsmallroof_tile_009Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_009 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_009.scale.set(0.1278, -0.1342, 0.5332);
    kubsmallroof_tile_009.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_009Gr.add(kubsmallroof_tile_009);
  }
  kubsmallroof_tile_009Gr.setRotation(2.7329, 0.0, -0.0);
  kubsmallroof_tile_009Gr.position.set(-27.7592, 8.8974, -4.0545);
  const kubsmallroof_tile_010Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_010 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_010.scale.set(0.1278, -0.1342, 0.5332);
    kubsmallroof_tile_010.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_010Gr.add(kubsmallroof_tile_010);
  }
  kubsmallroof_tile_010Gr.setRotation(2.4437, 0.0, -0.0);
  kubsmallroof_tile_010Gr.position.set(-27.7592, 8.3596, -4.9277);
  const kubsmallroof_tile_011Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_011 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_011.scale.set(0.1278, -0.1342, 0.6071);
    kubsmallroof_tile_011.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_011Gr.add(kubsmallroof_tile_011);
  }
  kubsmallroof_tile_011Gr.setRotation(2.1312, 0.0, -0.0);
  kubsmallroof_tile_011Gr.position.set(-27.7592, 7.5401, -5.6245);
  const kubsmallroof_tile_012Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_012 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_012.scale.set(1.9374, -0.1342, 0.6357);
    kubsmallroof_tile_012.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_012Gr.add(kubsmallroof_tile_012);
  }
  kubsmallroof_tile_012Gr.setRotation(-3.0772, 0.0, -0.0);
  kubsmallroof_tile_012Gr.position.set(-29.7716, 9.7482, 0.6277);
  const kubsmallroof_tile_013Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_013 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_013.scale.set(1.9374, -0.1342, 0.6357);
    kubsmallroof_tile_013.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_013Gr.add(kubsmallroof_tile_013);
  }
  kubsmallroof_tile_013Gr.setRotation(-2.968, 0.0, -0.0);
  kubsmallroof_tile_013Gr.position.set(-29.7716, 9.6026, 1.8431);
  const kubsmallroof_tile_014Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_014 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_014.scale.set(1.9374, -0.1342, 0.579);
    kubsmallroof_tile_014.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_014Gr.add(kubsmallroof_tile_014);
  }
  kubsmallroof_tile_014Gr.setRotation(-2.8706, 0.0, -0.0);
  kubsmallroof_tile_014Gr.position.set(-29.7716, 9.3406, 3.0144);
  const kubsmallroof_tile_015Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_015 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_015.scale.set(1.9374, -0.1342, 0.5332);
    kubsmallroof_tile_015.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_015Gr.add(kubsmallroof_tile_015);
  }
  kubsmallroof_tile_015Gr.setRotation(-2.7329, 0.0, -0.0);
  kubsmallroof_tile_015Gr.position.set(-29.7716, 8.977, 4.0544);
  const kubsmallroof_tile_016Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_016 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_016.scale.set(1.9374, -0.1342, 0.5332);
    kubsmallroof_tile_016.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_016Gr.add(kubsmallroof_tile_016);
  }
  kubsmallroof_tile_016Gr.setRotation(-2.4437, 0.0, -0.0);
  kubsmallroof_tile_016Gr.position.set(-29.7716, 8.4452, 4.9207);
  const kubsmallroof_tile_017Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_017 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
    kubsmallroof_tile_017.scale.set(1.9374, -0.1342, 0.6071);
    kubsmallroof_tile_017.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_017Gr.add(kubsmallroof_tile_017);
  }
  kubsmallroof_tile_017Gr.setRotation(-2.1312, 0.0, -0.0);
  kubsmallroof_tile_017Gr.position.set(-29.7716, 7.6197, 5.6245);
  const kubsmallroof_tile_018Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_018 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_018.scale.set(0.1278, -0.1342, 0.6357);
    kubsmallroof_tile_018.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_018Gr.add(kubsmallroof_tile_018);
  }
  kubsmallroof_tile_018Gr.setRotation(-3.0772, 0.0, -0.0);
  kubsmallroof_tile_018Gr.position.set(-27.7592, 9.6682, 0.6277);
  const kubsmallroof_tile_019Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_019 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_019.scale.set(0.1278, -0.1342, 0.6357);
    kubsmallroof_tile_019.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_019Gr.add(kubsmallroof_tile_019);
  }
  kubsmallroof_tile_019Gr.setRotation(-2.968, 0.0, -0.0);
  kubsmallroof_tile_019Gr.position.set(-27.7592, 9.5207, 1.8742);
  const kubsmallroof_tile_020Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_020 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_020.scale.set(0.1278, -0.1342, 0.579);
    kubsmallroof_tile_020.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_020Gr.add(kubsmallroof_tile_020);
  }
  kubsmallroof_tile_020Gr.setRotation(-2.8706, 0.0, -0.0);
  kubsmallroof_tile_020Gr.position.set(-27.7592, 9.2635, 3.0151);
  const kubsmallroof_tile_021Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_021 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_021.scale.set(0.1278, -0.1342, 0.5332);
    kubsmallroof_tile_021.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_021Gr.add(kubsmallroof_tile_021);
  }
  kubsmallroof_tile_021Gr.setRotation(-2.7329, 0.0, -0.0);
  kubsmallroof_tile_021Gr.position.set(-27.7592, 8.8938, 4.0628);
  const kubsmallroof_tile_022Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_022 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_022.scale.set(0.1278, -0.1342, 0.5332);
    kubsmallroof_tile_022.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_022Gr.add(kubsmallroof_tile_022);
  }
  kubsmallroof_tile_022Gr.setRotation(-2.4437, 0.0, -0.0);
  kubsmallroof_tile_022Gr.position.set(-27.7592, 8.3655, 4.9207);
  const kubsmallroof_tile_023Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_023 = new THREE.Mesh(boxGeo, BrassMaterial);
    kubsmallroof_tile_023.scale.set(0.1278, -0.1342, 0.6071);
    kubsmallroof_tile_023.position.set(4.0321 * i, 0, 0);
    kubsmallroof_tile_023Gr.add(kubsmallroof_tile_023);
  }
  kubsmallroof_tile_023Gr.setRotation(-2.1312, 0.0, -0.0);
  kubsmallroof_tile_023Gr.position.set(-27.7592, 7.5401, 5.6245);
  const kubsmallroof_tile_024 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_024.position.set(-31.4153, 9.461, -0.6276);
  kubsmallroof_tile_024.scale.set(0.2866, -0.2859, 0.6404);
  kubsmallroof_tile_024.setRotation(3.0771, 0.0, -0.0);

  const kubsmallroof_tile_025 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_025.position.set(-31.4153, 9.312, -1.8736);
  kubsmallroof_tile_025.scale.set(0.2866, -0.283, 0.6686);
  kubsmallroof_tile_025.setRotation(2.968, 0.0, -0.0);

  const kubsmallroof_tile_026 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_026.position.set(-31.4153, 9.0554, -3.0144);
  kubsmallroof_tile_026.scale.set(0.2866, -0.2783, 0.6486);
  kubsmallroof_tile_026.setRotation(2.8706, 0.0, -0.0);

  const kubsmallroof_tile_027 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_027.position.set(-31.4153, 9.4626, 0.6277);
  kubsmallroof_tile_027.scale.set(0.2866, -0.2859, 0.6404);
  kubsmallroof_tile_027.setRotation(-3.0772, 0.0, -0.0);

  const kubsmallroof_tile_028 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_028.position.set(-31.4153, 9.3151, 1.8742);
  kubsmallroof_tile_028.scale.set(0.2866, -0.283, 0.6686);
  kubsmallroof_tile_028.setRotation(-2.968, 0.0, -0.0);

  const kubsmallroof_tile_029 = new THREE.Mesh(boxGeo, BrassMaterial);
  kubsmallroof_tile_029.position.set(-31.4153, 9.0579, 3.0151);
  kubsmallroof_tile_029.scale.set(0.2866, -0.2783, 0.6486);
  kubsmallroof_tile_029.setRotation(-2.8706, 0.0, -0.0);

  const kubsmallroof_tile_030Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_030 = new THREE.Mesh(boxGeo, RoofTiles_1Material);
    kubsmallroof_tile_030.scale.set(1.9374, -0.1342, -0.102);
    kubsmallroof_tile_030.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_030Gr.add(kubsmallroof_tile_030);
  }
  kubsmallroof_tile_030Gr.setRotation(2.8706, 0.0, -0.0);
  kubsmallroof_tile_030Gr.position.set(-29.7716, 9.3073, -3.0144);
  const kubsmallroof_tile_031Gr = new THREE.Group();
  for (let i = 0; i < 21; i++) {
    const kubsmallroof_tile_031 = new THREE.Mesh(boxGeo, RoofTiles_1Material);
    kubsmallroof_tile_031.scale.set(1.9374, -0.1342, -0.102);
    kubsmallroof_tile_031.position.set(4.0298 * i, 0, 0);
    kubsmallroof_tile_031Gr.add(kubsmallroof_tile_031);
  }
  kubsmallroof_tile_031Gr.setRotation(-2.8706, 0.0, -0.0);
  kubsmallroof_tile_031Gr.position.set(-29.7716, 9.3073, 3.0144);
  const cubeGr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cube = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    cube.scale.set(1.0, 3.4789, 1.0);
    cube.position.set(6.0 * i, 0, 0);
    cubeGr.add(cube);
  }
  cubeGr.position.set(-30.709, 4.3331, 7.8995);
  const kub002Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub002 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub002.scale.set(0.4453, 0.2934, 0.9985);
    kub002.position.set(2.8961 * i, -5.2527 * i, 0);
    kub002Gr.add(kub002);
  }
  kub002Gr.setRotation(0.0, 0.0, 1.0669);
  kub002Gr.position.set(-29.8356, 4.92, 7.8995);
  const kub004Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub004 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub004.scale.set(0.4453, 0.4393, 0.9985);
    kub004.position.set(4.771 * i, -3.6355 * i, 0);
    kub004Gr.add(kub004);
  }
  kub004Gr.setRotation(0.0, 0.0, 0.6511);
  kub004Gr.position.set(-29.3814, 5.5959, 7.8995);
  const kub005Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub005 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub005.scale.set(0.4453, 0.2384, 0.9985);
    kub005.position.set(5.7105 * i, -1.8349 * i, 0);
    kub005Gr.add(kub005);
  }
  kub005Gr.setRotation(0.0, 0.0, 0.3109);
  kub005Gr.position.set(-28.5579, 5.832, 7.8995);
  const kub006Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub006 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub006.scale.set(0.4453, 0.1584, 0.9985);
    kub006.position.set(5.9981 * i, 0, 0);
    kub006Gr.add(kub006);
  }
  kub006Gr.position.set(-27.6974, 5.8917, 7.8995);
  const kub007Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub007 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub007.scale.set(0.4453, 0.2934, 0.9985);
    kub007.position.set(2.8961 * i, 5.2527 * i, 0);
    kub007Gr.add(kub007);
  }
  kub007Gr.setRotation(0.0, 0.0, -1.0669);
  kub007Gr.position.set(-25.5818, 4.92, 7.8995);
  const kub008 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub008.position.set(-26.0135, 5.5959, 7.8995);
  kub008.scale.set(0.4453, 0.4393, 0.9985);
  kub008.setRotation(0.0, 0.0, -0.6511);

  const kub009 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub009.position.set(-26.8361, 5.832, 7.8995);
  kub009.scale.set(0.4453, 0.2384, 0.9985);
  kub009.setRotation(0.0, 0.0, -0.3109);

  const kub011Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub011 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub011.scale.set(0.4453, 0.2384, 0.9985);
    kub011.position.set(5.7105 * i, 1.8349 * i, 0);
    kub011Gr.add(kub011);
  }
  kub011Gr.setRotation(0.0, 0.0, -0.3109);
  kub011Gr.position.set(-26.8361, 5.832, 7.8995);
  const kub012Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub012 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub012.scale.set(0.4453, 0.4393, 0.9985);
    kub012.position.set(4.771 * i, 3.6355 * i, 0);
    kub012Gr.add(kub012);
  }
  kub012Gr.setRotation(0.0, 0.0, -0.6511);
  kub012Gr.position.set(-26.0135, 5.5959, 7.8995);
  const kub013Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub013 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub013.scale.set(0.4453, 0.2934, 0.6455);
    kub013.position.set(2.8961 * i, 5.2527 * i, 0);
    kub013Gr.add(kub013);
  }
  kub013Gr.setRotation(0.0, 0.0, -1.0669);
  kub013Gr.position.set(-25.6364, 4.92, 7.8995);
  const kub015Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub015 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub015.scale.set(1.05, 3.4789, 0.6455);
    kub015.position.set(6.0 * i, 0, 0);
    kub015Gr.add(kub015);
  }
  kub015Gr.position.set(-30.709, 4.3331, 7.8995);
  const kub016Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub016 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub016.scale.set(0.4453, 0.2934, 0.6455);
    kub016.position.set(2.8961 * i, -5.2527 * i, 0);
    kub016Gr.add(kub016);
  }
  kub016Gr.setRotation(0.0, 0.0, 1.0669);
  kub016Gr.position.set(-29.777, 4.92, 7.8995);
  const kub017Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub017 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub017.scale.set(0.4453, 0.4393, 0.6455);
    kub017.position.set(4.771 * i, -3.6355 * i, 0);
    kub017Gr.add(kub017);
  }
  kub017Gr.setRotation(0.0, 0.0, 0.6511);
  kub017Gr.position.set(-29.3235, 5.5959, 7.8995);
  const kub018Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub018 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub018.scale.set(0.4453, 0.2384, 0.6455);
    kub018.position.set(5.7105 * i, -1.8349 * i, 0);
    kub018Gr.add(kub018);
  }
  kub018Gr.setRotation(0.0, 0.0, 0.3109);
  kub018Gr.position.set(-28.4432, 5.832, 7.8995);
  const kub019Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub019 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub019.scale.set(0.4453, 0.1584, 0.6455);
    kub019.position.set(5.9981 * i, 0, 0);
    kub019Gr.add(kub019);
  }
  kub019Gr.position.set(-27.6974, 5.8583, 7.8995);
  const kub020 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub020.position.set(-25.5818, 4.92, 7.8995);
  kub020.scale.set(0.4453, 0.2934, 0.9985);
  kub020.setRotation(0.0, 0.0, -1.0669);

  const kub021Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub021 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub021.scale.set(0.4453, 0.4393, 0.6455);
    kub021.position.set(4.771 * i, 3.6355 * i, 0);
    kub021Gr.add(kub021);
  }
  kub021Gr.setRotation(0.0, 0.0, -0.6511);
  kub021Gr.position.set(-26.068, 5.5959, 7.8995);
  const kub022Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub022 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub022.scale.set(0.4453, 0.2384, 0.6455);
    kub022.position.set(5.7105 * i, 1.8349 * i, 0);
    kub022Gr.add(kub022);
  }
  kub022Gr.setRotation(0.0, 0.0, -0.3109);
  kub022Gr.position.set(-26.9447, 5.832, 7.8995);
  const kub010Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub010 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub010.scale.set(1.0, 3.4789, 1.0);
    kub010.position.set(6.0 * i, 0, 0);
    kub010Gr.add(kub010);
  }
  kub010Gr.position.set(-30.709, 4.3331, -7.8995);
  const kub023Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub023 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub023.scale.set(1.05, 3.4789, 0.6455);
    kub023.position.set(6.0 * i, 0, 0);
    kub023Gr.add(kub023);
  }
  kub023Gr.position.set(-30.709, 4.3331, -7.8995);
  const kub024Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub024 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub024.scale.set(0.4453, 0.2934, 0.9985);
    kub024.position.set(2.8961 * i, -5.2527 * i, 0);
    kub024Gr.add(kub024);
  }
  kub024Gr.setRotation(0.0, 0.0, 1.0669);
  kub024Gr.position.set(-29.8356, 4.92, -7.901);
  const kub025Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub025 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub025.scale.set(0.4453, 0.4393, 0.9985);
    kub025.position.set(4.771 * i, -3.6355 * i, 0);
    kub025Gr.add(kub025);
  }
  kub025Gr.setRotation(0.0, 0.0, 0.6511);
  kub025Gr.position.set(-29.3814, 5.5959, -7.901);
  const kub026Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub026 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub026.scale.set(0.4453, 0.2384, 0.9985);
    kub026.position.set(5.7105 * i, -1.8349 * i, 0);
    kub026Gr.add(kub026);
  }
  kub026Gr.setRotation(0.0, 0.0, 0.3109);
  kub026Gr.position.set(-28.5579, 5.832, -7.901);
  const kub027Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub027 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub027.scale.set(0.4453, 0.1584, 0.9985);
    kub027.position.set(5.9981 * i, 0, 0);
    kub027Gr.add(kub027);
  }
  kub027Gr.position.set(-27.6974, 5.8917, -7.901);
  const kub028Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub028 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub028.scale.set(0.4453, 0.2934, 0.9985);
    kub028.position.set(2.8961 * i, 5.2527 * i, 0);
    kub028Gr.add(kub028);
  }
  kub028Gr.setRotation(0.0, 0.0, -1.0669);
  kub028Gr.position.set(-25.5818, 4.92, -7.901);
  const kub029Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub029 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub029.scale.set(0.4453, 0.2384, 0.9985);
    kub029.position.set(5.7105 * i, 1.8349 * i, 0);
    kub029Gr.add(kub029);
  }
  kub029Gr.setRotation(0.0, 0.0, -0.3109);
  kub029Gr.position.set(-26.8361, 5.832, -7.901);
  const kub030Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub030 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub030.scale.set(0.4453, 0.4393, 0.9985);
    kub030.position.set(4.771 * i, 3.6355 * i, 0);
    kub030Gr.add(kub030);
  }
  kub030Gr.setRotation(0.0, 0.0, -0.6511);
  kub030Gr.position.set(-26.0135, 5.5959, -7.901);
  const kub031Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub031 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub031.scale.set(0.4453, 0.2934, 0.6455);
    kub031.position.set(2.8961 * i, 5.2527 * i, 0);
    kub031Gr.add(kub031);
  }
  kub031Gr.setRotation(0.0, 0.0, -1.0669);
  kub031Gr.position.set(-25.6364, 4.92, -7.901);
  const kub032Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub032 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub032.scale.set(0.4453, 0.2934, 0.6455);
    kub032.position.set(2.8961 * i, -5.2527 * i, 0);
    kub032Gr.add(kub032);
  }
  kub032Gr.setRotation(0.0, 0.0, 1.0669);
  kub032Gr.position.set(-29.777, 4.92, -7.901);
  const kub033Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub033 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub033.scale.set(0.4453, 0.4393, 0.6455);
    kub033.position.set(4.771 * i, -3.6355 * i, 0);
    kub033Gr.add(kub033);
  }
  kub033Gr.setRotation(0.0, 0.0, 0.6511);
  kub033Gr.position.set(-29.3235, 5.5959, -7.901);
  const kub034Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub034 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub034.scale.set(0.4453, 0.2384, 0.6455);
    kub034.position.set(5.7105 * i, -1.8349 * i, 0);
    kub034Gr.add(kub034);
  }
  kub034Gr.setRotation(0.0, 0.0, 0.3109);
  kub034Gr.position.set(-28.4432, 5.832, -7.901);
  const kub035Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub035 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub035.scale.set(0.4453, 0.1584, 0.6455);
    kub035.position.set(5.9981 * i, 0, 0);
    kub035Gr.add(kub035);
  }
  kub035Gr.position.set(-27.6974, 5.8583, -7.901);
  const kub036Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub036 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub036.scale.set(0.4453, 0.4393, 0.6455);
    kub036.position.set(4.771 * i, 3.6355 * i, 0);
    kub036Gr.add(kub036);
  }
  kub036Gr.setRotation(0.0, 0.0, -0.6511);
  kub036Gr.position.set(-26.068, 5.5959, -7.901);
  const kub037Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub037 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
    kub037.scale.set(0.4453, 0.2384, 0.6455);
    kub037.position.set(5.7105 * i, 1.8349 * i, 0);
    kub037Gr.add(kub037);
  }
  kub037Gr.setRotation(0.0, 0.0, -0.3109);
  kub037Gr.position.set(-26.9447, 5.832, -7.901);
  const kub038 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub038.scale.set(8.2777, 3.4789, 1.0);
  kub038.setRotation(0.0, 0.0, -0.0);
  const kub038MZ = kub038.clone();
  kub038MZ.updateMatrixWorld(true);
  kub038.position.set(0, 0, 7.8995);
  kub038MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub038MZ.position.set(0, 0, -7.8995);
  const kub038MrZ = new THREE.Group();
  kub038MrZ.add(kub038, kub038MZ);
  kub038MrZ.position.set(44.5687, 4.3331, 0);
  const kub039 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub039.scale.set(1.0167, 3.4789, 2.3384);
  kub039.setRotation(0.0, 0.0, -0.0);
  const kub039MZ = kub039.clone();
  kub039MZ.updateMatrixWorld(true);
  kub039.position.set(0, 0, 9.2379);
  kub039MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub039MZ.position.set(0, 0, -9.2379);
  const kub039MrZ = new THREE.Group();
  kub039MrZ.add(kub039, kub039MZ);
  kub039MrZ.position.set(53.863, 4.3331, 0);
  const kub040 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub040.scale.set(15.8045, 3.4789, 1.128);
  kub040.setRotation(0.0, 0.0, -0.0);
  const kub040MZ = kub040.clone();
  kub040MZ.updateMatrixWorld(true);
  kub040.position.set(0, 0, 10.4484);
  kub040MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub040MZ.position.set(0, 0, -10.4484);
  const kub040MrZ = new THREE.Group();
  kub040MrZ.add(kub040, kub040MZ);
  kub040MrZ.position.set(70.6842, 4.3331, 0);
  const kub070Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub070 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub070.scale.set(2.0429, 0.9826, 0.9985);
    kub070.position.set(5.998 * i, 0, 0);
    kub070Gr.add(kub070);
  }
  kub070Gr.position.set(-27.6974, 6.8294, -7.901);
  const kub071Gr = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const kub071 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub071.scale.set(2.0429, 0.9826, 0.9985);
    kub071.position.set(5.998 * i, 0, 0);
    kub071Gr.add(kub071);
  }
  kub071Gr.position.set(-27.6974, 6.8294, 7.901);
  const kub092 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub092.scale.set(8.9444, 3.4789, 1.0);
  kub092.setRotation(0.0, 0.0, -0.0);
  const kub092MZ = kub092.clone();
  kub092MZ.updateMatrixWorld(true);
  kub092.position.set(0, 0, 7.8995);
  kub092MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub092MZ.position.set(0, 0, -7.8995);
  const kub092MrZ = new THREE.Group();
  kub092MrZ.add(kub092, kub092MZ);
  kub092MrZ.position.set(-40.6534, 4.3331, 0);
  const kub300 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub300.scale.set(146.5053, 6.6273, 2.6352);
  kub300.setRotation(0.0, 0.0, -0.0);
  const kub300MZ = kub300.clone();
  kub300MZ.updateMatrixWorld(true);
  kub300.position.set(0, 0, 12.4841);
  kub300MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub300MZ.position.set(0, 0, -12.4841);
  const kub300MrZ = new THREE.Group();
  kub300MrZ.add(kub300, kub300MZ);
  kub300MrZ.position.set(197.0714, 3.2323, 0);
  const kub301 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub301.scale.set(146.5053, 6.6273, 2.6352);
  kub301.setRotation(1.8693, 0.0, 0.0);
  const kub301MZ = kub301.clone();
  kub301MZ.updateMatrixWorld(true);
  kub301.position.set(0, 0, 19.9295);
  kub301MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub301MZ.position.set(0, 0, -19.9295);
  const kub301MrZ = new THREE.Group();
  kub301MrZ.add(kub301, kub301MZ);
  kub301MrZ.position.set(197.0714, 10.2316, 0);
  const kub306 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub306.scale.set(146.5053, 6.6273, 2.6352);
  kub306.setRotation(1.8693, 0.0, 0.0);
  const kub306MZ = kub306.clone();
  kub306MZ.updateMatrixWorld(true);
  kub306.position.set(0, 0, 19.9273);
  kub306MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub306MZ.position.set(0, 0, -19.9273);
  const kub306MrZ = new THREE.Group();
  kub306MrZ.add(kub306, kub306MZ);
  kub306MrZ.position.set(-195.3522, 10.2316, 0);
  const kubbigroof = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubbigroof.scale.set(347.5576, 0.1743, 6.2642);
  kubbigroof.setRotation(1.5708, 0.0, 0.0);
  const kubbigroofMZ = kubbigroof.clone();
  kubbigroofMZ.updateMatrixWorld(true);
  kubbigroof.position.set(0, 0, 22.6954);
  kubbigroofMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubbigroofMZ.position.set(0, 0, -22.6954);
  const kubbigroofMrZ = new THREE.Group();
  kubbigroofMrZ.add(kubbigroof, kubbigroofMZ);
  kubbigroofMrZ.position.set(-0.2398, -0.2095, 0);
  const kubbigroof_004 = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubbigroof_004.scale.set(49.229, 0.1743, 3.3728);
  kubbigroof_004.setRotation(1.5708, 0.0, 0.0);
  const kubbigroof_004MZ = kubbigroof_004.clone();
  kubbigroof_004MZ.updateMatrixWorld(true);
  kubbigroof_004.position.set(0, 0, 14.5133);
  kubbigroof_004MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubbigroof_004MZ.position.set(0, 0, -14.5133);
  const kubbigroof_004MrZ = new THREE.Group();
  kubbigroof_004MrZ.add(kubbigroof_004, kubbigroof_004MZ);
  kubbigroof_004MrZ.position.set(-1.2151, -3.1009, 0);
  const kubescfloor_011 = new THREE.Mesh(boxGeo, RoofTilesMaterial);
  kubescfloor_011.position.set(72.3317, 0.7364, -6.6458);
  kubescfloor_011.scale.set(1.3957, 0.9468, 0.1099);
  kubescfloor_011.setRotation(1.5708, 0.0, 0.0);

  const kub041 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub041.position.set(53.7454, 7.9374, -0.0);
  kub041.scale.set(1.1221, 2.1309, 7.0248);

  const kub042 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub042.position.set(53.6094, 6.0196, -0.0);
  kub042.scale.set(1.2033, 0.1788, 7.0248);

  const kub043 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub043.scale.set(1.2033, 0.0529, 1.1606);
  kub043.setRotation(1.5708, 0.0, 0.0);
  const kub043MZ = kub043.clone();
  kub043MZ.updateMatrixWorld(true);
  kub043.position.set(0, 0, -5.01);
  kub043MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub043MZ.position.set(0, 0, 5.01);
  const kub043MrZ = new THREE.Group();
  kub043MrZ.add(kub043, kub043MZ);
  kub043MrZ.position.set(53.6094, 7.359, 0);
  const kub044 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub044.scale.set(1.2033, 0.0529, 1.7061);
  kub044.setRotation(1.5708, 0.0, 0.0);
  const kub044MZ = kub044.clone();
  kub044MZ.updateMatrixWorld(true);
  kub044.position.set(0, 0, -2.5808);
  kub044MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub044MZ.position.set(0, 0, 2.5808);
  const kub044MrZ = new THREE.Group();
  kub044MrZ.add(kub044, kub044MZ);
  kub044MrZ.position.set(53.6094, 7.9044, 0);
  const kub045 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub045.position.set(53.6094, 7.9044, -0.0);
  kub045.scale.set(1.2033, 0.0529, 1.7061);
  kub045.setRotation(1.5708, 0.0, 0.0);

  const kub046 = new THREE.Mesh(boxGeo, BrassMaterial);
  kub046.position.set(53.6429, 8.2123, -0.0);
  kub046.scale.set(1.2033, 0.0405, 5.5555);

  const kub047 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub047.position.set(52.4948, 8.1131, -0.0);
  kub047.scale.set(-0.0232, 1.9147, 4.9622);

  const cyl008 = new THREE.Mesh(cylinderGeo, BrassMaterial);
  cyl008.position.set(52.4284, 7.9374, -0.0);
  cyl008.scale.set(1.0, 0.0534, 1.0);
  cyl008.setRotation(0.0, 0.0, -1.5708);

  const cyl009 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl009.position.set(52.3781, 7.9374, -0.0);
  cyl009.scale.set(0.9637, 0.0534, 0.9637);
  cyl009.setRotation(0.0, 0.0, -1.5708);

  const cyl010 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
  cyl010.position.set(52.3201, 7.9374, -0.0);
  cyl010.scale.set(0.075, 0.0188, 0.075);
  cyl010.setRotation(0.0, 0.0, -1.5708);

  const kub048 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub048.position.set(52.3406, 8.3492, -0.0);
  kub048.scale.set(0.0334, 0.3772, 0.0334);

  const kub049 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub049.position.set(52.3406, 8.0482, 0.3139);
  kub049.scale.set(0.0334, 0.305, 0.0334);
  kub049.setRotation(1.2316, 0.0, 0.0);

  const kub050 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub050.scale.set(0.0328, 0.0583, 0.0328);
  kub050.setRotation(0.0, 0.0, -0.0);
  const kub050MX = kub050.clone();
  kub050MX.updateMatrixWorld(true);
  kub050.position.set(52.3403, 0, 0);
  kub050MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  kub050MX.position.set(52.416, 0, 0);
  const kub050MrX = new THREE.Group();
  kub050MrX.add(kub050, kub050MX);
  kub050MrX.position.set(0, 8.8056, -0.0);
  const kub051 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub051.scale.set(0.0328, 0.0583, 0.0328);
  kub051.setRotation(1.5708, 0.0, 0.0);
  const kub051MZ = kub051.clone();
  kub051MZ.updateMatrixWorld(true);
  kub051.position.set(0, 0, 0.8682);
  kub051MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub051MZ.position.set(0, 0, -0.8682);
  const kub051MrZ = new THREE.Group();
  kub051MrZ.add(kub051, kub051MZ);
  kub051MrZ.position.set(52.3403, 7.9374, 0);
  const kub052 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub052.scale.set(0.0328, 0.0583, 0.0328);
  kub052.setRotation(2.3562, 0.0, 0.0);
  const kub052MZ = kub052.clone();
  kub052MZ.updateMatrixWorld(true);
  kub052.position.set(0, 0, 0.6139);
  kub052MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub052MZ.position.set(0, 0, -0.6139);
  const kub052MrZ = new THREE.Group();
  kub052MrZ.add(kub052, kub052MZ);
  kub052MrZ.position.set(52.3403, 7.3235, 0);
  const kub053 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub053.scale.set(0.0328, 0.0583, 0.0328);
  kub053.setRotation(0.7854, 0.0, 0.0);
  const kub053MZ = kub053.clone();
  kub053MZ.updateMatrixWorld(true);
  kub053.position.set(0, 0, 0.6139);
  kub053MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub053MZ.position.set(0, 0, -0.6139);
  const kub053MrZ = new THREE.Group();
  kub053MrZ.add(kub053, kub053MZ);
  kub053MrZ.position.set(52.3403, 8.5513, 0);
  const cyl011 = new THREE.Mesh(cylinderGeo, RoofTilesMaterial);
  cyl011.position.set(52.3299, 7.9374, -0.0);
  cyl011.scale.set(0.4398, 0.011, 0.4398);
  cyl011.setRotation(0.0, 0.0, -1.5708);

  const kub054 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub054.position.set(38.1605, 2.3445, 6.9102);
  kub054.scale.set(1.2649, 0.9801, 0.0322);

  const kub055 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub055.position.set(38.1605, 3.1273, -6.8906);
  kub055.scale.set(1.6975, 1.1575, 0.0322);

  const kub056 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub056.position.set(38.1605, 2.9853, -6.8646);
  kub056.scale.set(1.6244, 0.9379, 0.0322);

  const kub057 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub057.position.set(38.1605, 4.0931, -6.8646);
  kub057.scale.set(1.6244, 0.146, 0.0322);

  const kub058 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub058.position.set(38.1605, 4.4235, 6.9102);
  kub058.scale.set(1.2649, 0.9801, 0.0322);

  const kub059 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub059.position.set(38.1605, 2.3445, 6.8851);
  kub059.scale.set(1.1847, 0.918, 0.0301);

  const kub060 = new THREE.Mesh(boxGeo, Blue_PictureMaterial);
  kub060.position.set(38.1605, 4.4235, 6.8851);
  kub060.scale.set(1.1847, 0.918, 0.0301);

  const kub061 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub061.position.set(38.1605, 5.1875, -6.9009);
  kub061.scale.set(0.1398, 0.1398, 0.0286);

  const kub062 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub062.position.set(38.1605, 5.1875, -6.7612);
  kub062.scale.set(0.041, 0.041, 0.1231);

  const kub063 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub063.position.set(38.1605, 5.1875, -6.3446);
  kub063.scale.set(0.1035, 0.3, 0.3);

  const kub064 = new THREE.Mesh(boxGeo, Green_PictureMaterial);
  kub064.position.set(38.1605, 5.1875, -6.3446);
  kub064.scale.set(0.1379, 0.2533, 0.2533);

  const kub065 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
  kub065.position.set(38.1605, 5.1086, -6.3446);
  kub065.scale.set(0.1751, 0.1278, 0.0332);

  const cyl012 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
  cyl012.position.set(38.1605, 5.3262, -6.3446);
  cyl012.scale.set(0.0413, 0.1645, 0.0413);
  cyl012.setRotation(0.0, 0.0, -1.5708);

  const kub066Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub066 = new THREE.Mesh(boxGeo, MapMaterial);
    kub066.scale.set(0.0392, 0.6686, 0.47);
    kub066.position.set(12.001 * i, 0, 0);
    kub066Gr.add(kub066);
  }
  kub066Gr.position.set(-23.6566, 3.1162, 7.8995);
  const kub067Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub067 = new THREE.Mesh(boxGeo, MapMaterial);
    kub067.scale.set(0.0392, 0.6686, 0.47);
    kub067.position.set(12.001 * i, 0, 0);
    kub067Gr.add(kub067);
  }
  kub067Gr.position.set(-23.6566, 3.1162, -7.8995);
  const kub068Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub068 = new THREE.Mesh(boxGeo, MapMaterial);
    kub068.scale.set(0.0392, 0.6686, 0.47);
    kub068.position.set(12.001 * i, 0, 0);
    kub068Gr.add(kub068);
  }
  kub068Gr.position.set(-25.7557, 3.1162, 7.8995);
  const kub069Gr = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const kub069 = new THREE.Mesh(boxGeo, MapMaterial);
    kub069.scale.set(0.0392, 0.6686, 0.47);
    kub069.position.set(12.001 * i, 0, 0);
    kub069Gr.add(kub069);
  }
  kub069Gr.position.set(-25.7557, 3.1162, -7.8995);
  const kub072 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub072.scale.set(337.424, 0.0913, 3.9259);
  kub072.setRotation(0.0, 0.0, -0.0);
  const kub072MZ = kub072.clone();
  kub072MZ.updateMatrixWorld(true);
  kub072.position.set(0, 0, 18.6043);
  kub072MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub072MZ.position.set(0, 0, -18.6043);
  const kub072MrZ = new THREE.Group();
  kub072MrZ.add(kub072, kub072MZ);
  kub072MrZ.position.set(-0.9392, -1.8809, 0);
  const kub073 = new THREE.Mesh(boxGeo, Metall_RustMaterial);
  kub073.scale.set(350.9227, 0.0913, 0.6522);
  kub073.setRotation(-1.0876, 0.0, 0.0);
  const kub073MZ = kub073.clone();
  kub073MZ.updateMatrixWorld(true);
  kub073.position.set(0, 0, 22.347);
  kub073MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub073MZ.position.set(0, 0, -22.347);
  const kub073MrZ = new THREE.Group();
  kub073MrZ.add(kub073, kub073MZ);
  kub073MrZ.position.set(-2.026, -1.6274, 0);
  const kub074 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub074.scale.set(352.5921, 0.2605, 0.166);
  kub074.setRotation(0.0, 0.0, -0.0);
  const kub074MZ = kub074.clone();
  kub074MZ.updateMatrixWorld(true);
  kub074.position.set(0, 0, 16.1386);
  kub074MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub074MZ.position.set(0, 0, -16.1386);
  const kub074MrZ = new THREE.Group();
  kub074MrZ.add(kub074, kub074MZ);
  kub074MrZ.position.set(-1.2826, -1.529, 0);
  const kub075 = new THREE.Mesh(boxGeo, MetalMaterial);
  kub075.scale.set(352.5921, 0.2605, 0.166);
  kub075.setRotation(0.0, 0.0, -0.0);
  const kub075MZ = kub075.clone();
  kub075MZ.updateMatrixWorld(true);
  kub075.position.set(0, 0, 21.0701);
  kub075MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub075MZ.position.set(0, 0, -21.0701);
  const kub075MrZ = new THREE.Group();
  kub075MrZ.add(kub075, kub075MZ);
  kub075MrZ.position.set(-1.2826, -1.529, 0);
  const kub076 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub076.scale.set(350.9227, 0.0913, 1.6548);
  kub076.setRotation(1.5708, 0.0, 0.0);
  const kub076MZ = kub076.clone();
  kub076MZ.updateMatrixWorld(true);
  kub076.position.set(0, 0, 22.5792);
  kub076MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kub076MZ.position.set(0, 0, -22.5792);
  const kub076MrZ = new THREE.Group();
  kub076MrZ.add(kub076, kub076MZ);
  kub076MrZ.position.set(-2.026, 0.2518, 0);
  const kub077Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub077 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub077.scale.set(1.5186, 0.0513, 1.4186);
    kub077.position.set(3.341 * i, 0, 0);
    kub077Gr.add(kub077);
  }
  kub077Gr.setRotation(0.053, -0.0, 0.0);
  kub077Gr.position.set(-48.0887, 9.1261, 15.2259);
  const kub078Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub078 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub078.scale.set(1.5186, 0.0513, 1.3299);
    kub078.position.set(3.341 * i, 0, 0);
    kub078Gr.add(kub078);
  }
  kub078Gr.setRotation(-0.2552, -0.0, 0.0);
  kub078Gr.position.set(-48.0887, 8.8694, 12.5384);
  const kub079Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub079 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub079.scale.set(1.5186, 0.0513, 1.2076);
    kub079.position.set(3.341 * i, 0, 0);
    kub079Gr.add(kub079);
  }
  kub079Gr.setRotation(-0.6303, -0.0, 0.0);
  kub079Gr.position.set(-48.0887, 7.8661, 10.3425);
  const kub080Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub080 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub080.scale.set(1.5186, 0.0513, 0.6538);
    kub080.position.set(3.341 * i, 0, 0);
    kub080Gr.add(kub080);
  }
  kub080Gr.setRotation(-1.1069, -0.0, -0.0);
  kub080Gr.position.set(-48.0887, 6.6251, 9.1086);
  const kub081Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub081 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub081.scale.set(1.5186, 0.0513, 1.4186);
    kub081.position.set(3.341 * i, 0, 0);
    kub081Gr.add(kub081);
  }
  kub081Gr.setRotation(0.3397, -0.0, 0.0);
  kub081Gr.position.set(-48.0887, 8.5788, 17.9723);
  const kub082Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub082 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub082.scale.set(1.5186, 0.0513, 1.3442);
    kub082.position.set(3.341 * i, 0, 0);
    kub082Gr.add(kub082);
  }
  kub082Gr.setRotation(0.6479, -0.0, 0.0);
  kub082Gr.position.set(-48.0887, 7.3242, 20.3389);
  const kub083Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub083 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub083.scale.set(1.5186, 0.0513, 1.3442);
    kub083.position.set(3.341 * i, 0, 0);
    kub083Gr.add(kub083);
  }
  kub083Gr.setRotation(1.023, -0.0, 0.0);
  kub083Gr.position.set(-48.0887, 5.4288, 22.068);
  const kub084Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub084 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub084.scale.set(0.1738, 0.0511, 1.3427);
    kub084.position.set(3.341 * i, 0, 0);
    kub084Gr.add(kub084);
  }
  kub084Gr.setRotation(1.023, -0.0, 0.0);
  kub084Gr.position.set(-46.4182, 5.3882, 22.0402);
  const kub085Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub085 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub085.scale.set(0.1738, 0.0513, 1.4127);
    kub085.position.set(3.341 * i, 0, 0);
    kub085Gr.add(kub085);
  }
  kub085Gr.setRotation(0.053, -0.0, 0.0);
  kub085Gr.position.set(-46.4182, 9.0855, 15.2265);
  const kub086Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub086 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub086.scale.set(0.1738, 0.0513, 1.3247);
    kub086.position.set(3.341 * i, 0, 0);
    kub086Gr.add(kub086);
  }
  kub086Gr.setRotation(-0.2552, -0.0, 0.0);
  kub086Gr.position.set(-46.4182, 8.8288, 12.5501);
  const kub087Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub087 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub087.scale.set(0.1738, 0.0512, 1.2043);
    kub087.position.set(3.341 * i, 0, 0);
    kub087Gr.add(kub087);
  }
  kub087Gr.setRotation(-0.6303, -0.0, 0.0);
  kub087Gr.position.set(-46.4182, 7.8255, 10.3634);
  const kub088Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub088 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub088.scale.set(0.1738, 0.0511, 0.6533);
    kub088.position.set(3.341 * i, 0, 0);
    kub088Gr.add(kub088);
  }
  kub088Gr.setRotation(-1.1069, -0.0, 0.0);
  kub088Gr.position.set(-46.4182, 6.5845, 9.1346);
  const kub089Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub089 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub089.scale.set(0.1738, 0.0513, 1.4133);
    kub089.position.set(3.341 * i, 0, 0);
    kub089Gr.add(kub089);
  }
  kub089Gr.setRotation(0.3397, -0.0, 0.0);
  kub089Gr.position.set(-46.4182, 8.5382, 17.9615);
  const kub090Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub090 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub090.scale.set(0.1738, 0.0512, 1.3406);
    kub090.position.set(3.341 * i, 0, 0);
    kub090Gr.add(kub090);
  }
  kub090Gr.setRotation(0.6479, -0.0, 0.0);
  kub090Gr.position.set(-46.4182, 7.2836, 20.3183);
  const kub091Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub091 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub091.scale.set(1.5186, 0.0513, 0.0838);
    kub091.position.set(3.341 * i, 0, 0);
    kub091Gr.add(kub091);
  }
  kub091Gr.setRotation(0.1825, 0.0, 0.0);
  kub091Gr.position.set(-48.0887, 9.0256, 16.6168);
  const kub093Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub093 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub093.scale.set(1.5186, 0.0513, 0.6538);
    kub093.position.set(3.341 * i, 0, 0);
    kub093Gr.add(kub093);
  }
  kub093Gr.setRotation(1.1069, -0.0, -0.0);
  kub093Gr.position.set(-48.0887, 6.6251, -9.1086);
  const kub094Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub094 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub094.scale.set(1.5186, 0.0513, 1.2076);
    kub094.position.set(3.341 * i, 0, 0);
    kub094Gr.add(kub094);
  }
  kub094Gr.setRotation(0.6303, -0.0, 0.0);
  kub094Gr.position.set(-48.0887, 7.8661, -10.3425);
  const kub095Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub095 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub095.scale.set(0.1738, 0.0511, 0.6533);
    kub095.position.set(3.341 * i, 0, 0);
    kub095Gr.add(kub095);
  }
  kub095Gr.setRotation(1.1069, -0.0, 0.0);
  kub095Gr.position.set(-46.4182, 6.5845, -9.1346);
  const kub096Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub096 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub096.scale.set(0.1738, 0.0512, 1.2043);
    kub096.position.set(3.341 * i, 0, 0);
    kub096Gr.add(kub096);
  }
  kub096Gr.setRotation(0.6303, -0.0, 0.0);
  kub096Gr.position.set(-46.4182, 7.8255, -10.3634);
  const kub097Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub097 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub097.scale.set(1.5186, 0.0513, 1.3299);
    kub097.position.set(3.341 * i, 0, 0);
    kub097Gr.add(kub097);
  }
  kub097Gr.setRotation(0.2552, -0.0, 0.0);
  kub097Gr.position.set(-48.0887, 8.8694, -12.5384);
  const kub098Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub098 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub098.scale.set(0.1738, 0.0513, 1.3247);
    kub098.position.set(3.341 * i, 0, 0);
    kub098Gr.add(kub098);
  }
  kub098Gr.setRotation(0.2552, -0.0, 0.0);
  kub098Gr.position.set(-46.4182, 8.8288, -12.5501);
  const kub099Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub099 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub099.scale.set(1.5186, 0.0513, 1.4186);
    kub099.position.set(3.341 * i, 0, 0);
    kub099Gr.add(kub099);
  }
  kub099Gr.setRotation(-0.053, -0.0, 0.0);
  kub099Gr.position.set(-48.0888, 9.1261, -15.2259);
  const kub100Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub100 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub100.scale.set(0.1738, 0.0513, 1.4127);
    kub100.position.set(3.341 * i, 0, 0);
    kub100Gr.add(kub100);
  }
  kub100Gr.setRotation(-0.053, -0.0, 0.0);
  kub100Gr.position.set(-46.4182, 9.0855, -15.2265);
  const kub101Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub101 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub101.scale.set(1.5186, 0.0513, 1.4186);
    kub101.position.set(3.341 * i, 0, 0);
    kub101Gr.add(kub101);
  }
  kub101Gr.setRotation(-0.3397, -0.0, 0.0);
  kub101Gr.position.set(-48.0887, 8.5788, -17.9723);
  const kub102Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub102 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub102.scale.set(0.1738, 0.0512, 1.3406);
    kub102.position.set(3.341 * i, 0, 0);
    kub102Gr.add(kub102);
  }
  kub102Gr.setRotation(-0.6479, -0.0, 0.0);
  kub102Gr.position.set(-46.4182, 7.2836, -20.3183);
  const kub103Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub103 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub103.scale.set(0.1738, 0.0513, 1.4133);
    kub103.position.set(3.341 * i, 0, 0);
    kub103Gr.add(kub103);
  }
  kub103Gr.setRotation(-0.3397, -0.0, 0.0);
  kub103Gr.position.set(-46.4182, 8.5382, -17.9615);
  const kub104Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub104 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub104.scale.set(1.5186, 0.0513, 1.3442);
    kub104.position.set(3.341 * i, 0, 0);
    kub104Gr.add(kub104);
  }
  kub104Gr.setRotation(-0.6479, -0.0, 0.0);
  kub104Gr.position.set(-48.0887, 7.3242, -20.3389);
  const kub105Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub105 = new THREE.Mesh(boxGeo, WhiteDotsMaterial);
    kub105.scale.set(1.5186, 0.0513, 1.3442);
    kub105.position.set(3.341 * i, 0, 0);
    kub105Gr.add(kub105);
  }
  kub105Gr.setRotation(-1.023, -0.0, 0.0);
  kub105Gr.position.set(-48.0887, 5.4288, -22.068);
  const kub106Gr = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const kub106 = new THREE.Mesh(boxGeo, MetalMaterial);
    kub106.scale.set(0.1738, 0.0511, 1.3427);
    kub106.position.set(3.341 * i, 0, 0);
    kub106Gr.add(kub106);
  }
  kub106Gr.setRotation(-1.023, -0.0, 0.0);
  kub106Gr.position.set(-46.4182, 5.3882, -22.0402);
  const kub297 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub297.position.set(70.754, 7.9374, -0.0);
  kub297.scale.set(15.8864, 2.1309, 7.0248);

  const kub298 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub298.position.set(70.754, 6.6102, -0.0);
  kub298.scale.set(15.8864, 0.3534, 10.2896);

  const kub299 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
  kub299.position.set(80.1152, 3.775, -0.0);
  kub299.scale.set(3.5137, 0.3534, 10.2896);
  kub299.setRotation(0.0, 0.0, -1.5708);

  const cylinderGr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cylinder = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cylinder.scale.set(0.5, 2.5, 0.5);
    cylinder.position.set(6.0 * i, 0, 0);
    cylinderGr.add(cylinder);
  }
  cylinderGr.position.set(-30.709, 3.2961, -7.1816);
  const cyl001Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl001 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl001.scale.set(0.55, 0.2319, 0.55);
    cyl001.position.set(6.0 * i, 0, 0);
    cyl001Gr.add(cyl001);
  }
  cyl001Gr.position.set(-30.709, 1.0416, -7.1816);
  const kub003Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub003 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub003.scale.set(0.7, 0.0759, 0.7);
    kub003.position.set(6.0 * i, 0, 0);
    kub003Gr.add(kub003);
  }
  kub003Gr.position.set(-30.709, 5.8089, -7.1816);
  const cyl003Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl003 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl003.scale.set(0.55, 0.3036, 0.55);
    cyl003.position.set(6.0 * i, 0, 0);
    cyl003Gr.add(cyl003);
  }
  cyl003Gr.position.set(-30.709, 5.47, -7.1816);
  const cyl004Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl004 = new THREE.Mesh(cylinderGeo, BrassMaterial);
    cyl004.scale.set(0.6, 0.1363, 0.6);
    cyl004.position.set(6.0 * i, 0, 0);
    cyl004Gr.add(cyl004);
  }
  cyl004Gr.position.set(-30.709, 5.4668, -7.1816);
  const tor001Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor001 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor001.scale.set(0.5, 0.5, 0.5233);
    tor001.position.set(6.0 * i, 0, 0);
    tor001Gr.add(tor001);
  }
  tor001Gr.setRotation(1.5708, 0.0, 0.0);
  tor001Gr.position.set(-30.709, 1.0461, -7.1816);
  const tor002Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor002 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor002.scale.set(0.52, 0.52, 0.5233);
    tor002.position.set(6.0 * i, 0, 0);
    tor002Gr.add(tor002);
  }
  tor002Gr.setRotation(1.5708, 0.0, 0.0);
  tor002Gr.position.set(-30.709, 5.7037, -7.1816);
  const tor003Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor003 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor003.scale.set(0.52, 0.52, 0.2641);
    tor003.position.set(6.0 * i, 0, 0);
    tor003Gr.add(tor003);
  }
  tor003Gr.setRotation(1.5708, 0.0, 0.0);
  tor003Gr.position.set(-30.709, 5.307, -7.1816);
  const kubfloor_central = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubfloor_central.position.set(24.3999, 0.5684, -0.0);
  kubfloor_central.scale.set(56.1089, 0.2965, 6.3485);

  const kubfloor_columns = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubfloor_columns.scale.set(65.4645, 0.2965, 2.497);
  kubfloor_columns.setRotation(0.0, 0.0, -0.0);
  const kubfloor_columnsMZ = kubfloor_columns.clone();
  kubfloor_columnsMZ.updateMatrixWorld(true);
  kubfloor_columns.position.set(0, 0, -8.8396);
  kubfloor_columnsMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_columnsMZ.position.set(0, 0, 8.8396);
  const kubfloor_columnsMrZ = new THREE.Group();
  kubfloor_columnsMrZ.add(kubfloor_columns, kubfloor_columnsMZ);
  kubfloor_columnsMrZ.position.set(15.9462, 0.5578, 0);
  const kubfloor_sided = new THREE.Mesh(boxGeo, Floor_Sides_1Material);
  kubfloor_sided.scale.set(50.6075, 0.2965, 0.2803);
  kubfloor_sided.setRotation(0.0, 0.0, -0.0);
  const kubfloor_sidedMZ = kubfloor_sided.clone();
  kubfloor_sidedMZ.updateMatrixWorld(true);
  kubfloor_sided.position.set(0, 0, -11.612);
  kubfloor_sidedMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_sidedMZ.position.set(0, 0, 11.612);
  const kubfloor_sidedMrZ = new THREE.Group();
  kubfloor_sidedMrZ.add(kubfloor_sided, kubfloor_sidedMZ);
  kubfloor_sidedMrZ.position.set(0.3561, 0.5394, 0);
  const kubfloor_trainsside = new THREE.Mesh(boxGeo, Floor_CentralMaterial);
  kubfloor_trainsside.scale.set(51.4855, 0.2965, 1.7465);
  kubfloor_trainsside.setRotation(0.0, 0.0, -0.0);
  const kubfloor_trainssideMZ = kubfloor_trainsside.clone();
  kubfloor_trainssideMZ.updateMatrixWorld(true);
  kubfloor_trainsside.position.set(0, 0, -13.6124);
  kubfloor_trainssideMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubfloor_trainssideMZ.position.set(0, 0, 13.6124);
  const kubfloor_trainssideMrZ = new THREE.Group();
  kubfloor_trainssideMrZ.add(kubfloor_trainsside, kubfloor_trainssideMZ);
  kubfloor_trainssideMrZ.position.set(-0.5219, 0.5684, 0);
  const kubstripes_001Gr = new THREE.Group();
  for (let i = 0; i < 83; i++) {
    const kubstripes_001 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
    kubstripes_001.scale.set(0.4667, 0.0239, 0.1338);
    kubstripes_001.position.set(1.2135 * i, 0, 0);
    kubstripes_001Gr.add(kubstripes_001);
  }
  kubstripes_001Gr.position.set(-49.0516, 0.8519, -13.6124);
  const cylstripe_dotsGr = new THREE.Group();
  for (let i = 0; i < 82; i++) {
    const cylstripe_dots = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
    cylstripe_dots.scale.set(0.131, 0.0041, 0.131);
    cylstripe_dots.position.set(1.2134 * i, 0, 0);
    cylstripe_dotsGr.add(cylstripe_dots);
  }
  cylstripe_dotsGr.position.set(-48.4447, 0.8683, -13.6124);
  const kubstripes_002 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_002.scale.set(-59.1002, 0.0239, 0.1614);
  kubstripes_002.setRotation(0.0, 0.0, -0.0);
  const kubstripes_002MZ = kubstripes_002.clone();
  kubstripes_002MZ.updateMatrixWorld(true);
  kubstripes_002.position.set(0, 0, 4.7543);
  kubstripes_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubstripes_002MZ.position.set(0, 0, -4.7543);
  const kubstripes_002MrZ = new THREE.Group();
  kubstripes_002MrZ.add(kubstripes_002, kubstripes_002MZ);
  kubstripes_002MrZ.position.set(23.6445, 0.8634, 0);
  const cyl002Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl002 = new THREE.Mesh(cylinderGeo, ColoumnMaterial);
    cyl002.scale.set(0.5, 2.5, 0.5);
    cyl002.position.set(6.0 * i, 0, 0);
    cyl002Gr.add(cyl002);
  }
  cyl002Gr.position.set(-30.709, 3.2961, 7.171);
  const kubstripes_003Gr = new THREE.Group();
  for (let i = 0; i < 83; i++) {
    const kubstripes_003 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
    kubstripes_003.scale.set(0.4667, 0.0239, 0.1338);
    kubstripes_003.position.set(1.2135 * i, 0, 0);
    kubstripes_003Gr.add(kubstripes_003);
  }
  kubstripes_003Gr.position.set(-49.0516, 0.8519, 13.6124);
  const cylstripe_dots_001Gr = new THREE.Group();
  for (let i = 0; i < 82; i++) {
    const cylstripe_dots_001 = new THREE.Mesh(cylinderGeo, WhiteDotsMaterial);
    cylstripe_dots_001.scale.set(0.131, 0.0041, 0.131);
    cylstripe_dots_001.position.set(1.2134 * i, 0, 0);
    cylstripe_dots_001Gr.add(cylstripe_dots_001);
  }
  cylstripe_dots_001Gr.position.set(-48.4447, 0.8683, 13.6124);
  const cyl005Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl005 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl005.scale.set(0.55, 0.2319, 0.55);
    cyl005.position.set(6.0 * i, 0, 0);
    cyl005Gr.add(cyl005);
  }
  cyl005Gr.position.set(-30.709, 1.0416, 7.1711);
  const tor004Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor004 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor004.scale.set(0.5, 0.5, 0.5233);
    tor004.position.set(6.0 * i, 0, 0);
    tor004Gr.add(tor004);
  }
  tor004Gr.setRotation(1.5708, 0.0, 0.0);
  tor004Gr.position.set(-30.709, 1.0461, 7.1657);
  const cyl006Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl006 = new THREE.Mesh(cylinderGeo, ColoumnPlateMaterial);
    cyl006.scale.set(0.55, 0.3036, 0.55);
    cyl006.position.set(6.0 * i, 0, 0);
    cyl006Gr.add(cyl006);
  }
  cyl006Gr.position.set(-30.709, 5.47, 7.1711);
  const tor005Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor005 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor005.scale.set(0.52, 0.52, 0.2641);
    tor005.position.set(6.0 * i, 0, 0);
    tor005Gr.add(tor005);
  }
  tor005Gr.setRotation(1.5708, 0.0, 0.0);
  tor005Gr.position.set(-30.709, 5.307, 7.1655);
  const cyl007Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const cyl007 = new THREE.Mesh(cylinderGeo, BrassMaterial);
    cyl007.scale.set(0.6, 0.1363, 0.6);
    cyl007.position.set(6.0 * i, 0, 0);
    cyl007Gr.add(cyl007);
  }
  cyl007Gr.position.set(-30.709, 5.4668, 7.1711);
  const kub001Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const kub001 = new THREE.Mesh(boxGeo, ColoumnPlateMaterial);
    kub001.scale.set(0.7, 0.0759, 0.7);
    kub001.position.set(6.0 * i, 0, 0);
    kub001Gr.add(kub001);
  }
  kub001Gr.position.set(-30.709, 5.8089, 7.1711);
  const tor006Gr = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const tor006 = new THREE.Mesh(torusGeo, BrassMaterial);
    tor006.scale.set(0.52, 0.52, 0.5233);
    tor006.position.set(6.0 * i, 0, 0);
    tor006Gr.add(tor006);
  }
  tor006Gr.setRotation(1.5708, 0.0, 0.0);
  tor006Gr.position.set(-30.709, 5.7037, 7.1711);
  const kubstripes_006 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_006.position.set(76.6066, 0.8634, 0.0932);
  kubstripes_006.scale.set(-5.1172, 0.0239, 0.1614);
  kubstripes_006.setRotation(0.0, 1.5708, 0.0);

  const kubstripes_004 = new THREE.Mesh(boxGeo, Floor_StripesMaterial);
  kubstripes_004.position.set(-31.1419, 0.8634, 0.0932);
  kubstripes_004.scale.set(-5.1172, 0.0239, 0.1614);
  kubstripes_004.setRotation(0.0, 1.5708, 0.0);

  const kubbackwall = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall.position.set(-40.9615, 5.4803, -0.0);
  kubbackwall.scale.set(9.4309, 4.626, 8.2679);

  const kubcoloumnsupper_001 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_001.scale.set(42.5516, 0.1921, 0.7246);
  kubcoloumnsupper_001.setRotation(0.0, 0.0, -0.0);
  const kubcoloumnsupper_001MZ = kubcoloumnsupper_001.clone();
  kubcoloumnsupper_001MZ.updateMatrixWorld(true);
  kubcoloumnsupper_001.position.set(0, 0, -6.1536);
  kubcoloumnsupper_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_001MZ.position.set(0, 0, 6.1536);
  const kubcoloumnsupper_001MrZ = new THREE.Group();
  kubcoloumnsupper_001MrZ.add(kubcoloumnsupper_001, kubcoloumnsupper_001MZ);
  kubcoloumnsupper_001MrZ.position.set(10.4587, 7.0259, 0);
  const kubcoloumnsupper_002 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_002.scale.set(42.5516, 0.1921, 0.7246);
  kubcoloumnsupper_002.setRotation(-0.7258, 0.0, 0.0);
  const kubcoloumnsupper_002MZ = kubcoloumnsupper_002.clone();
  kubcoloumnsupper_002MZ.updateMatrixWorld(true);
  kubcoloumnsupper_002.position.set(0, 0, -6.124);
  kubcoloumnsupper_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_002MZ.position.set(0, 0, 6.124);
  const kubcoloumnsupper_002MrZ = new THREE.Group();
  kubcoloumnsupper_002MrZ.add(kubcoloumnsupper_002, kubcoloumnsupper_002MZ);
  kubcoloumnsupper_002MrZ.position.set(10.4587, 6.5967, 0);
  const kubcoloumnsupper_003 = new THREE.Mesh(boxGeo, Floor_ColumnsMaterial);
  kubcoloumnsupper_003.scale.set(42.5516, 0.1921, 0.7246);
  kubcoloumnsupper_003.setRotation(0.0, 0.0, -0.0);
  const kubcoloumnsupper_003MZ = kubcoloumnsupper_003.clone();
  kubcoloumnsupper_003MZ.updateMatrixWorld(true);
  kubcoloumnsupper_003.position.set(0, 0, -7.1651);
  kubcoloumnsupper_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  kubcoloumnsupper_003MZ.position.set(0, 0, 7.1651);
  const kubcoloumnsupper_003MrZ = new THREE.Group();
  kubcoloumnsupper_003MrZ.add(kubcoloumnsupper_003, kubcoloumnsupper_003MZ);
  kubcoloumnsupper_003MrZ.position.set(10.4587, 6.0642, 0);
  const kubbackwall_001 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall_001.position.set(-53.4691, 1.9826, -0.0);
  kubbackwall_001.scale.set(3.0767, 9.221, 14.9665);

  const kubbackwall_002 = new THREE.Mesh(boxGeo, FloorTileMaterial);
  kubbackwall_002.position.set(-182.3204, 1.9826, -0.0);
  kubbackwall_002.scale.set(125.7746, 9.221, 14.9665);

  const kub302 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub302.position.set(344.4503, 3.6897, 19.9295);
  kub302.scale.set(2.946, 12.7853, 12.7853);

  const kub303 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub303.position.set(344.4503, 3.6897, -18.5225);
  kub303.scale.set(2.946, 12.7853, 12.7853);

  const kub304 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub304.position.set(-308.372, 3.6897, 19.9295);
  kub304.scale.set(2.946, 12.7853, 12.7853);

  const kub305 = new THREE.Mesh(boxGeo, ColoumnMaterial);
  kub305.position.set(-308.372, 3.6897, -18.5225);
  kub305.scale.set(2.946, 12.7853, 12.7853);

  const out = new THREE.Group();
  out.add(
    kubimage,
    kubborder,
    kubborder_001,
    kubborder_002,
    kubsmallroof_tileGr,
    kubsmallroof_tile_005Gr,
    kubsmallroof_tile_004Gr,
    kubsmallroof_tile_003Gr,
    kubsmallroof_tile_002Gr,
    kubsmallroof_tile_001Gr,
    kubsmallroof_tile_006Gr,
    kubsmallroof_tile_007Gr,
    kubsmallroof_tile_008Gr,
    kubsmallroof_tile_009Gr,
    kubsmallroof_tile_010Gr,
    kubsmallroof_tile_011Gr,
    kubsmallroof_tile_012Gr,
    kubsmallroof_tile_013Gr,
    kubsmallroof_tile_014Gr,
    kubsmallroof_tile_015Gr,
    kubsmallroof_tile_016Gr,
    kubsmallroof_tile_017Gr,
    kubsmallroof_tile_018Gr,
    kubsmallroof_tile_019Gr,
    kubsmallroof_tile_020Gr,
    kubsmallroof_tile_021Gr,
    kubsmallroof_tile_022Gr,
    kubsmallroof_tile_023Gr,
    kubsmallroof_tile_024,
    kubsmallroof_tile_025,
    kubsmallroof_tile_026,
    kubsmallroof_tile_027,
    kubsmallroof_tile_028,
    kubsmallroof_tile_029,
    kubsmallroof_tile_030Gr,
    kubsmallroof_tile_031Gr,
    cubeGr,
    kub002Gr,
    kub004Gr,
    kub005Gr,
    kub006Gr,
    kub007Gr,
    kub008,
    kub009,
    kub011Gr,
    kub012Gr,
    kub013Gr,
    kub015Gr,
    kub016Gr,
    kub017Gr,
    kub018Gr,
    kub019Gr,
    kub020,
    kub021Gr,
    kub022Gr,
    kub010Gr,
    kub023Gr,
    kub024Gr,
    kub025Gr,
    kub026Gr,
    kub027Gr,
    kub028Gr,
    kub029Gr,
    kub030Gr,
    kub031Gr,
    kub032Gr,
    kub033Gr,
    kub034Gr,
    kub035Gr,
    kub036Gr,
    kub037Gr,
    kub038MrZ,
    kub039MrZ,
    kub040MrZ,
    kub070Gr,
    kub071Gr,
    kub092MrZ,
    kub300MrZ,
    kub301MrZ,
    kub306MrZ,
    kubbigroofMrZ,
    kubbigroof_004MrZ,
    kubescfloor_011,
    kub041,
    kub042,
    kub043MrZ,
    kub044MrZ,
    kub045,
    kub046,
    kub047,
    cyl008,
    cyl009,
    cyl010,
    kub048,
    kub049,
    kub050MrX,
    kub051MrZ,
    kub052MrZ,
    kub053MrZ,
    cyl011,
    kub054,
    kub055,
    kub056,
    kub057,
    kub058,
    kub059,
    kub060,
    kub061,
    kub062,
    kub063,
    kub064,
    kub065,
    cyl012,
    kub066Gr,
    kub067Gr,
    kub068Gr,
    kub069Gr,
    kub072MrZ,
    kub073MrZ,
    kub074MrZ,
    kub075MrZ,
    kub076MrZ,
    kub077Gr,
    kub078Gr,
    kub079Gr,
    kub080Gr,
    kub081Gr,
    kub082Gr,
    kub083Gr,
    kub084Gr,
    kub085Gr,
    kub086Gr,
    kub087Gr,
    kub088Gr,
    kub089Gr,
    kub090Gr,
    kub091Gr,
    kub093Gr,
    kub094Gr,
    kub095Gr,
    kub096Gr,
    kub097Gr,
    kub098Gr,
    kub099Gr,
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
    cyl001Gr,
    kub003Gr,
    cyl003Gr,
    cyl004Gr,
    tor001Gr,
    tor002Gr,
    tor003Gr,
    kubfloor_central,
    kubfloor_columnsMrZ,
    kubfloor_sidedMrZ,
    kubfloor_trainssideMrZ,
    kubstripes_001Gr,
    cylstripe_dotsGr,
    kubstripes_002MrZ,
    cyl002Gr,
    kubstripes_003Gr,
    cylstripe_dots_001Gr,
    cyl005Gr,
    tor004Gr,
    cyl006Gr,
    tor005Gr,
    cyl007Gr,
    kub001Gr,
    tor006Gr,
    kubstripes_006,
    kubstripes_004,
    kubbackwall,
    kubcoloumnsupper_001MrZ,
    kubcoloumnsupper_002MrZ,
    kubcoloumnsupper_003MrZ,
    kubbackwall_001,
    kubbackwall_002,
    kub302,
    kub303,
    kub304,
    kub305,
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
