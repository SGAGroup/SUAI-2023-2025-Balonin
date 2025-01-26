if (tick == 0) {
 if (typeof sceneexist == 'undefined') {
     WC = window.innerWidth * 0.75;
     HC = window.innerHeight * 0.75;
     OpenCanvas('wCanvas', WC, HC);
     F = true; SetColorStuff();
     
     X = 0,Y = 0,Z = 0,W = 1;
     
     cameras = {};
     currentCamera = undefined;
     document.ChangeCamera = ChangeCamera;
     scene = null; var camera, renderer; CreateScene(WC, HC);
     initParameters();
     initChangeCameraControls();

     var XC = W * (5 * RobotMData.WEBDX - RobotMData.WEBSIZ / 4);
     var YC = -8.1 * W;
     var ZC = W * 3;
     CreateWEBCAM(XC, YC, ZC, RobotMData);
     XC = W * (5 * CleanRobotData.WEBDX - CleanRobotData.WEBSIZ / 4);
     CreateWEBCAM(XC, YC, ZC, CleanRobotData);
     
     Station = DrawStation();
     Station.position.set(X, Y, Z);
     Station.scale.set(W, W, W);
     scene.add(Station);
     
     RobotM = DrawRobotM();
     RobotM.position.set(X, Y + W, Z);
     RobotM.rotateX(-PI / 2);
     RobotM.rotateZ(PI / 3);
     RobotM.scale.set(W, W, W);
     RobotM.name = 'RobotM';
     scene.add(RobotM);
     Robots[0] = { obj: RobotM, data: RobotMData };
     
     CleanRobot = DrawCleanRobot();
     CleanRobot.position.copy(CleanRobotData.homePos.clone());
     CleanRobot.rotateX(-PI / 2);
     CleanRobot.rotateZ(-PI / 16);
     CleanRobot.scale.set(W, W, W);
     CleanRobot.name = 'CleanRobot';
     scene.add(CleanRobot);
     Robots[1] = { obj: CleanRobot, data: CleanRobotData };
     
     WetFloor = DrawWetFloor();
     WetFloor.position.set(X,Y,Z);
     WetFloor.scale.set(W,W,W);
     scene.add(WetFloor);
     render();

     test_train = DrawVagon();
     test_train.position.set(X, Y+10*W, Z);
     test_train.scale.set(W, W, W);
     scene.add(test_train);
     
     rob = DrawRobotM();
     rob.position.set(X+10*W, Y+20*W, Z);
     rob.scale.set(W, W, W);
     rob.rotation.x = -PI/2;
     scene.add(rob);
 }
}
F = true;
restart(20);
puts("tick: ".concat(tick));
animate();

function render() {
requestAnimationFrame(render);
if (F) {
 if (RobotMData.V > 0)
     GetDISbySonarV(RobotMData);
 else
     RobotMData.LineV.visible = false;
 if (CleanRobotData.V > 0)
     GetDISbySonarV(CleanRobotData);
 else
     CleanRobotData.LineV.visible = false;
 F = false;
}
controls.update();
if (currentCamera)
 renderer.render(scene, currentCamera);
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

function initParameters() {
var _a;
clock = new THREE.Clock();
Robots = [];
RobotMData = {};

CleanRobotData = {};
iniRobot(RobotMData);
iniRobot(CleanRobotData, true);
iniTrains();
_a = iniDoorsAnimation(), animateDoors = _a[0], resetAnimateDoors = _a[1];
IniSonarV(RobotMData);
IniSonarV(CleanRobotData);
}

function iniRobot(robotData, second) {
if (second === void 0) { second = false; }
robotData.isBorderTouched = false;
robotData.WEBSIZ = 9; // СТОРОНА МАТРИЦЫ
robotData.DISV = 0; // Дистанция по вертикали
robotData.COLV = '#f8ff50'; // Цвет по вертикали
robotData.FLGV = false; // Флаг дорожки
robotData.RR = robotData.AR = robotData.XR = robotData.YR = 0; // ГЛОНАС
if (second)
 robotData.V = robotData.V0 = 0.08; // Скорость
else
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
robotData.TREEDIS = -100; // ДИСТАНЦИЯ ДО ДЕРЕВА
robotData.TREESDX = -100; // КООРДИНАТЫ ДЕРЕВА НА ТАБЛО
robotData.TRESHCOL = '#ffffff'; // ЦВЕТ МУСОРА
robotData.TRESHDIS = -100; // ДИСТАНЦИЯ ДО МУСОРА
robotData.TRESHSDX = -100; // КООРДИНАТЫ МУСОРА НА ТАБЛО
robotData.TRESHANGLE = 0; // КООРДИНАТЫ УГЛА НА ЦЕЛЬ
// ПАРАМЕТРЫ СИСТЕМЫ ЗРЕНИЯ
robotData.WEBDIS = mulp(ones(robotData.WEBSIZ), 100); // МАТРИЦА ДИСТАНЦИЙ
robotData.WEBCOL = zeros(robotData.WEBSIZ); // МАТРИЦА ЦВЕТОВ
for (var i = 0; i < robotData.WEBSIZ; i++)
 for (var j = 0; j < robotData.WEBSIZ; j++)
     robotData.WEBCOL[i][j] = '#f8ff50';
robotData.WEBDZ = 0.05; // ШАГ РАЗВЕРТКИ ЛУЧА ПО ВЫСОТЕ
robotData.WEBDX = 0.1; // ШАГ РАЗВЕРТКИ ЛУЧА ПО ШИРИНЕ
robotData.rotationTicks = 15;
robotData.aliveTicks = 1000;
if (second)
 robotData.homePos = new THREE.Vector3(-30, 1, 2);
else
 robotData.homePos = new THREE.Vector3(-30, 1, -2);
robotData.isStay = second;
}

function iniTrains() {
trains = [];
trainArriveTime = 200;
trainStayTime = 300;
trainSumTime = 800;
}

function IniSonarV(robotData) {
// СОЗДАНИЕ ПЕРЕМЕННЫХ СОНАРА
robotData.raycasterV_pos = new THREE.Vector3(0, 0, Z + W); // откуда запускаем луч
robotData.raycasterV_dir = new THREE.Vector3(0, -W, 0); // вектор, куда запускаем луч
robotData.raycasterV = new THREE.Raycaster(undefined, undefined, 0, 100);
robotData.intersects = robotData.raycasterV.intersectObjects(scene.children);
}

function GetDISbySonarV(robotData) {
robotData.raycasterV.set(robotData.raycasterV_pos, robotData.raycasterV_dir);
robotData.intersects = robotData.raycasterV.intersectObjects(scene.children, true);
robotData.COLV = '#000000';
if (robotData.intersects.length > 0) {
 var DISV = robotData.intersects[0].distance;
 if (DISV > 10)
     DISV = 10;
 robotData.LineV.scale.z = DISV / W;
 robotData.LineV.visible = true;
 var colors = robotData.intersects.map(
 function (i) { return '#' + i.object.material.color.getHex().toString(16); });
 robotData.COLV = colors[0];
 if (robotData.COLV === robotData.BORDERCOL.toLowerCase()) {
     puts('Коснулся границы');
     robotData.isBorderTouched = true;
 }
}
else {
 robotData.LineV.visible = false;
}
}

function SetSonarV(robot, robotData) {
if (!robotData || !robotData.raycasterV_pos || !robotData.Sonar)
 return;
// ВЫЧИСЛЯЕМ НОВЫЕ КООРДИНАТЫ СОНАРА
var CR = cos(robot.rotation.z);
var SR = sin(robot.rotation.z);
robotData.raycasterV_pos.y = RobotM.position.y;
robotData.raycasterV_pos.x =
 robot.position.x + (W * robotData.Sonar.position.x * CR) / 3;
robotData.raycasterV_pos.z =
 robot.position.z + (W * robotData.Sonar.position.x * -SR) / 3;
}

function DisWEBCAM(robotData) {
// ВЫТАЩИМ СРЕДНЮЮ КООРДИНАТУ ДЕРЕВА И МУСОРА ИЗ ТАБЛО
var N1, N2;
N1 = N2 = 0;
var S1, S2;
S1 = S2 = 0;
robotData.TREESDX = -100;
robotData.TREEDIS = 0;
robotData.TRESHSDX = -100;
robotData.TRESHDIS = 0;
for (var i = 0; i < robotData.WEBSIZ; i++)
 for (var j = 0; j < robotData.WEBSIZ; j++) {
     robotData.DIS = robotData.WEBDIS[i][j];
     var Col = robotData.WEBCOL[i][j];
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
}
else
 robotData.TREEDIS = 100;
if (N2) {
 robotData.TRESHSDX = S2 / N2;
 robotData.TRESHDIS = robotData.TRESHDIS / N2;
 robotData.LineH.scale.x = robotData.TRESHDIS / W;
}
else
 robotData.TRESHDIS = 100; // putm(WEBCOL); putm(WEBDIS);
}

function OutWEBCAM(robotData) {
var i, j, Col;
for (i = 0; i < robotData.WEBSIZ; i++)
 for (j = 0; j < robotData.WEBSIZ; j++) {
     robotData.DIS = robotData.WEBDIS[i][j];
     Col = robotData.WEBCOL[i][j];
     var ColR = floor((parseInt(Col.slice(1, 3), 16) * 5) / robotData.DIS);
     var ColG = floor((parseInt(Col.slice(3, 5), 16) * 5) / robotData.DIS);
     var ColB = floor((parseInt(Col.slice(5, 7), 16) * 5) / robotData.DIS);
     Col = RGB2HEX(ColR, ColG, ColB);
     // Graphcube[i][j].position.z = ColBW / 500;
 }
}

function CreateWEBCAM(XC, YC, ZC, robotData) {
// ПАРАМЕТРЫ ЛУЧА
robotData.raycaster_WEB_pos = new THREE.Vector3(0, 0, Z + W); // откуда запускаем луч
robotData.raycaster_WEB_dir = new THREE.Vector3(W, 0, 0); // вектор, куда запускаем луч
robotData.raycaster_WEB = new THREE.Raycaster(undefined, undefined, 0, 10);
robotData.intersects = robotData.raycaster_WEB.intersectObjects(scene.children);
// WEBDX ШАГ РАЗВЕРТКИ ЛУЧА ПО ШИРИНЕ
// WEBDZ ШАГ РАЗВЕРТКИ ЛУЧА ПО ВЫСОТЕ
var DX = 5 * robotData.WEBDX;
var DY = 0.1;
var DZ = 5 * robotData.WEBDZ;
var Graphcube = zeros(robotData.WEBSIZ);
robotData.Materialcube = zeros(robotData.WEBSIZ);
var geometry = new THREE.BoxGeometry(DX, DY, DZ);
for (var i = 0; i < robotData.WEBSIZ; i++)
 for (var j = 0; j < robotData.WEBSIZ; j++) {
     robotData.Materialcube[i][j] = new THREE.MeshBasicMaterial({
         color: 0xf8ff50,
     });
     Graphcube[i][j] = new THREE.Mesh(geometry, robotData.Materialcube[i][j]);
     Graphcube[i][j].position.set(XC + DX * j, YC, ZC - DZ * i);
     scene.add(Graphcube[i][j]);
 }
}

function animateWetFloor() {
if (!wetFloorCtx || !wetFloorTex)
 return;
var floor = WetFloor.userData.floor;
var boundingBox = new THREE.Box3().setFromObject(floor);
var size = {
 x: boundingBox.max.x - boundingBox.min.x,
 y: boundingBox.max.z - boundingBox.min.z,
};
var pos = floor.position;
var imageSize = floor.userData.imageSize;
var x = ((RobotMData.XR - pos.x) / size.x + 0.5) * imageSize.x;
var y = ((RobotMData.YR - pos.z) / size.y + 0.5) * imageSize.y;
wetFloorCtx.fillStyle = '#0000ff';
wetFloorCtx.beginPath();
wetFloorCtx.arc(x, y, 20, 0, PI * 2);
wetFloorCtx.closePath();
wetFloorCtx.fill();
wetFloorTex.needsUpdate = true;
}

function animateCleanFloor() {
if (!wetFloorCtx || !wetFloorTex)
 return;
var floor = WetFloor.userData.floor;
var boundingBox = new THREE.Box3().setFromObject(floor);
var size = {
 x: boundingBox.max.x - boundingBox.min.x,
 y: boundingBox.max.z - boundingBox.min.z,
};
var pos = floor.position;
var imageSize = floor.userData.imageSize;
var x = ((CleanRobotData.XR - pos.x) / size.x + 0.5) * imageSize.x;
var y = ((CleanRobotData.YR - pos.z) / size.y + 0.5) * imageSize.y;
var style = '#ffff00';
var w = 12;
wetFloorCtx.fillStyle = style;
wetFloorCtx.beginPath();
wetFloorCtx.arc(x, y, w, 0, PI * 2);
wetFloorCtx.closePath();
wetFloorCtx.fill();
wetFloorTex.needsUpdate = true;
}

function animateTrains() {
var EPS = 100; // in milliseconds
var current = tick % trainSumTime; //Текущее время цикла
var isArrived = current > trainArriveTime;
var isStay = trainArriveTime < current && current <= trainArriveTime + trainStayTime;
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
for (var _i = 0, trains_1 = trains; _i < trains_1.length; _i++) {
 var train = trains_1[_i];
 if (!train.userData.startPos) {
     console.error("\u0423 \u043F\u043E\u0435\u0437\u0434\u0430 ".concat(train.id, " \u043D\u0435\u0442 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u043E\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u0438. C\u043C: userData.startPos"));
     return;
 }
 if (!train.userData.arrivePos) {
     console.error("\u0423 \u043F\u043E\u0435\u0437\u0434\u0430 ".concat(train.id, " \u043D\u0435\u0442 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u043F\u0440\u0438\u0431\u044B\u0442\u0438\u044F. C\u043C: userData.arrivePos"));
     return;
 }
 if (!train.userData.endPos) {
     console.error("\u0423 \u043F\u043E\u0435\u0437\u0434\u0430 ".concat(train.id, " \u043D\u0435\u0442 userData.endPos"));
     return;
 }
 
 if (!isArrived)
     // Поезд приезжает
     // Передвижение из туннеля к платформе
     train.position.lerpVectors(train.userData.startPos, train.userData.arrivePos, easeOutQuad(current / trainArriveTime));
 else if (!isStay)
     // Поезд уезжает
     // Движение от платформы к следующей станции
     train.position.lerpVectors(train.userData.arrivePos, train.userData.endPos, easeInQuad((current - trainArriveTime - trainStayTime) /
         (trainSumTime - trainArriveTime - trainStayTime)));
 if (isStay) {
     animateDoors();
 }
}
function MoveTrainsToStart() {
 trains.forEach(function (train) {
     var _a = train.userData.startPos, x = _a.x, y = _a.y, z = _a.z;
     train.position.set(x, y, z);
     resetAnimateDoors();
 });
}
function DrawTrains() {
 var trainCreationData = [
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
 trains = trainCreationData.map(function (data) {
     var startPos = data.startPos;
     var train = DrawTrain(3);
     train.userData = data;
     {
         var x = startPos.x, y = startPos.y, z = startPos.z;
         train.position.set(x, y, z);
     }
     return train;
 });
}
function AddTrainsToScene() {
 trains.forEach(function (train) { return scene.add(train); });
}
function easeOutQuad(t, b, c, d) {
 if (b === void 0) { b = 0; }
 if (c === void 0) { c = 1; }
 if (d === void 0) { d = 1; }
 return -c * (t /= d) * (t - 2) + b;
}
function easeInQuad(t, b, c, d) {
 if (b === void 0) { b = 0; }
 if (c === void 0) { c = 1; }
 if (d === void 0) { d = 1; }
 return c * (t /= d) * t + b;
}
}

function animateRobot(robotObj, robotData) {
// ГЛОНАС ДАТЧИК
robotData.XR = robotObj.position.x;
robotData.YR = robotObj.position.z;
robotData.AR = abs(robotObj.rotation.y);
if (robotData.AR > 2 * PI)
 robotData.AR -= 2 * PI;
robotData.RR = sqrt(pow(robotData.XR - X, 2) + pow(robotData.YR - Y, 2));
var cycledTick = tick % robotData.aliveTicks;
// РЕФЛЕКСЫ
switch (true) {
 case robotData.isNeedGoHome:
     var dirToHome = robotData.homePos.clone().sub(robotObj.position);
     var dirToHomeClonedNormalized = dirToHome.clone().normalize();
     dirToHomeClonedNormalized.set(dirToHomeClonedNormalized.z, dirToHomeClonedNormalized.y, -dirToHomeClonedNormalized.x);
     robotData.CR = cos(robotObj.rotation.z);
     robotData.SR = sin(robotObj.rotation.z);
     var currentDir = new THREE.Vector3(cos(robotObj.rotation.z), 0, -sin(robotObj.rotation.z));
     var angleToHome = currentDir.angleTo(dirToHome) *
         -sign(currentDir.dot(dirToHomeClonedNormalized));
     var delta = angleToHome / robotData.rotationTicks;
     robotObj.rotation.z += delta;
     robotData.STPX = robotData.V * robotData.CR;
     robotData.STPY = robotData.V * -robotData.SR;
     robotObj.position.x = robotObj.position.x + robotData.STPX;
     robotObj.position.z = robotObj.position.z + robotData.STPY;
     // debugger;
     if (robotObj.position.clone().distanceTo(robotData.homePos) <= 1) {
         robotData.isStay = true;
         robotData.isNeedGoHome = false;
         robotObj.rotation.z = 0;
         tick = 0;
         var otherRobot = Robots.find(function (robot) { return robot.obj.id !== robotObj.id; });
         if (!otherRobot) {
             console.error('Не найден второй робот');
             return;
         }
         otherRobot.data.isStay = false;
     }
     break;
 case robotData.isStay:
     // if (abs(cycledTick - robotData.aliveTicks) === 3) {
     //   robotData.isStay = false;
     // }
     break;
 case robotData.isBorderTouched: //КАСАНИЕ ГРАНИЦЫ
     // См. https://www.desmos.com/calculator/rgjllht2hk
     var multiplier = 50; // m_ult;
     var worldOrigin = new THREE.Vector3(20, 0, 0); // O
     var robotForward = new THREE.Vector3(cos(robotObj.rotation.z), 0, -sin(robotObj.rotation.z));
     var toCenterVec = worldOrigin.sub(robotObj.position.clone());
     var randomDirection = new THREE.Vector3(random(1), 0, random(1)).normalize();
     var D = robotObj.position.clone().distanceTo(worldOrigin) / multiplier;
     randomDirection.add(toCenterVec.multiplyScalar(D));
     var deltaInRadians = robotForward
         .clone()
         .setComponent(1, 0)
         .angleTo(randomDirection);
     robotObj.rotateZ(deltaInRadians);
     robotData.isBorderTouched = false;
     break;
 default:
     // ПЕРЕМЕЩЕНИЕ
     robotData.CR = cos(robotObj.rotation.z);
     robotData.SR = sin(robotObj.rotation.z);
     robotData.STPX = robotData.V * robotData.CR;
     robotData.STPY = robotData.V * -robotData.SR;
     robotObj.position.x = robotObj.position.x + robotData.STPX;
     robotObj.position.z = robotObj.position.z + robotData.STPY;
     robotObj.userData.lastPos = robotObj.position.clone();
     if (abs(cycledTick - robotData.aliveTicks) === 5) {
         robotData.isNeedGoHome = true;
     }
     break;
}
SetSonarV(robotObj, robotData);
OutWEBCAM(robotData);
}

function DrawWetFloor() {
var baseSize = 256;
var geo = new THREE.BoxGeometry(2,2,2);
var floor = new THREE.Mesh(geo);
floor.position.set(24.4, 0.574, 0);
floor.scale.set(56.1, 0.3, 6.35);
var boundingBox = new THREE.Box3().setFromObject(floor);
var aspectRatio = (boundingBox.max.x - boundingBox.min.x) /
 (boundingBox.max.z - boundingBox.min.z);
var image;
if (aspectRatio < 0)
 image = new Image(baseSize, nearestPowerOf2(baseSize / aspectRatio));
else
 image = new Image(baseSize * nearestPowerOf2(aspectRatio), baseSize);
var canvasEl = document.createElement('canvas');
canvasEl.width = image.width;
canvasEl.height = image.height;

var ctx = canvasEl.getContext('2d');
if (!ctx)
 return console.error('Почему-то нет контекста');
wetFloorCtx = ctx;
ctx.drawImage(image, 0, 0);
ctx.fillStyle = '#ffc920';
ctx.fillRect(0, 0, image.width, image.height);
ctx.beginPath();
wetFloorTex = new THREE.CanvasTexture(canvasEl);
floor.material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(0.5,0.4,0.3),
 metalness: 0.3, roughness: 1,
 metalnessMap: wetFloorTex,
 roughnessMap: wetFloorTex,
});
floor.userData = {imageSize:{x:image.width, y:image.height}};
var out = new THREE.Group();
out.add(floor);
out.userData = { floor: floor };
return out;
function nearestPowerOf2(n) {
 return 1 << (31 - Math.clz32(n));
}
}
function DrawTrain(trainLength) {
var originVagon = DrawVagon();
var boundingBox = new THREE.Box3().setFromObject(originVagon);
var vagonLength = boundingBox.max.x - boundingBox.min.x;
var train = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var newVagon = originVagon.clone();
 newVagon.position.x = i * (vagonLength + 0.3);
 train.add(newVagon);
}
return train;
}
function DrawTrainDoor() {
var rightDoor = DrawRightDoorFunction();
rightDoor.scale.set(1,1,1);
var leftDoor = rightDoor.clone();
leftDoor.updateMatrixWorld(true);
leftDoor.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
var resultDoor = new THREE.Group();
resultDoor.add(rightDoor, leftDoor);
var out = new THREE.Group();
rightDoor.name = 'rightDoor';
leftDoor.name = 'leftDoor';
out.add(resultDoor);
return out;
}
function DrawRobotM() {

//лицевые центральные панели
var geo = new THREE.PlaneGeometry(2,2);
var pan1 = new THREE.Mesh(geo, Washer_mainMatDS);
var pan2 = pan1.clone();var pan3 = pan1.clone();var pan4 = pan1.clone();var pan5 = pan1.clone();
    pan1.rotation.set(PI/2,-PI/2.397,0);pan1.scale.set(0.0762,0.09,1);pan1.position.set(0.5630,0.8232,0);
    pan2.rotation.set(PI/2,-PI/2.266,0);pan2.scale.set(0.0565,0.09,1);pan2.position.set(0.5929,0.6940,0);
    pan3.rotation.set(PI/2,-PI/2.189,0);pan3.scale.set(0.0466,0.09,1);pan3.position.set(0.6096,0.5922,0);
    pan4.rotation.set(PI/2,-PI/2.081,0);pan4.scale.set(0.0401,0.09,1);pan4.position.set(0.6183,0.5060,0);
    pan5.rotation.set(PI/2,-PI/2.000,0);pan5.scale.set(0.0487,0.09,1);pan5.position.set(0.6208,0.4173,0);
var panels_mid = new THREE.Group();
    panels_mid.add(pan1,pan2,pan3,pan4,pan5);
    panels_mid.scale.z = 2.011; panels_mid.position.z = -0.0005;
//лицевые боковые панели рядом с центром
var pan14 = new THREE.Mesh(geo, Washer_mainMatDS);
var pan15 = pan14.clone();var pan16 = pan14.clone();var pan17 = pan14.clone();var pan18 = pan14.clone();
    pan14.setRot(1.8353,0,-1.3109);pan14.scale.set(0.0762,0.09,1);pan14.position.set(0.5405,0.8172,0.2646);
    pan15.setRot(1.8396,0,-1.3866);pan15.scale.set(0.0565,0.09,1);pan15.position.set(0.5697,0.6896,0.2645);
    pan16.setRot(1.8417,0,-1.4353);pan16.scale.set(0.0466,0.09,1);pan16.position.set(0.5860,0.5890,0.2645);
    pan17.setRot(1.8436,0,-1.5094);pan17.scale.set(0.0401,0.09,1);pan17.position.set(0.5944,0.5045,0.2644);
    pan18.setRot(1.8427,0,-1.5700);pan18.scale.set(0.0487,0.09,1);pan18.position.set(0.5968,0.4173,0.2644);
var panels_l = new THREE.Group();
    panels_l.add(pan14,pan15,pan16,pan17,pan18);
var panels_r = panels_l.clone(); panels_r.scale.z = -1;
//лицевые боковые панели
var pan6 = new THREE.Mesh(geo, Washer_mainMatDS);
var pan7 = pan6.clone(); var pan8  = pan6.clone();
var pan9 = pan6.clone(); var pan10 = pan6.clone();
    pan6.setRot(2.4592, 0,-1.3109);pan6.scale.set(0.0762,0.09,0.0743);pan6.position.set(0.4513, 0.7935,0.4066);
    pan7.setRot(2.4694, 0,-1.3866);pan7.scale.set(0.0565,0.09,0.0743);pan7.position.set(0.4795, 0.6693,0.4059);
    pan8.setRot(2.4745, 0,-1.4353);pan8.scale.set(0.0466,0.09,0.0743);pan8.position.set(0.4938, 0.5741,0.4054);
    pan9.setRot(2.4755, 0,-1.5345);pan9.scale.set(0.0401,0.09,0.0743);pan9.position.set(0.5003, 0.4940,0.4039);
    pan10.setRot(2.4807,0,-1.57); pan10.scale.set(0.0487,0.09,0.0743);pan10.position.set(0.5027,0.4143,0.4046);
var panels_side_l = new THREE.Group();
    panels_side_l.add(pan6,pan7,pan8,pan9,pan10);
var panels_side_r = panels_side_l.clone(); panels_side_r.scale.z = -1;

//верхний кусок лицевой панели
var cube_087 = new THREE.Mesh(geo, WasherMat);
    cube_087.scale.set(0.0847, 0.5837, 0.089);
    cube_087.setRot(0.2645, 0, -1.3109);
    cube_087.position.set(-0.0454, 0.828, 0.112);
var cube_087MirroredZ = new THREE.Group();
    cube_087MirroredZ.add(cube_087);
//боковой верхний кусок лицевой панели
var cube_096 = new THREE.Mesh(geo, WasherMat);
    cube_096.scale.set(0.0847, 0.3559, 0.089);
    cube_096.setRot(0.8884, 0, -1.3109);
    cube_096.position.set(0.193, 0.8914, 0.1304);
var cube_096MirroredZ = new THREE.Group();
    cube_096MirroredZ.add(cube_096);

//отмостка
var geo = new THREE.CylinderGeometry(1,1,2,10);
var otm_fr = new THREE.Mesh(geo,MetalMat);
    otm_fr.scale.set(0.25,0.04,0.47);otm_fr.position.set(0.45,0.345,0);
var geo = new THREE.BoxGeometry(2,2,2);
var otm_b = new THREE.Mesh(geo, MetalMat);
    otm_b.scale.set(0.6,0.04, 0.47);otm_b.position.set(-0.15, 0.345, 0);
var otmostka = new THREE.Group(); otmostka.add(otm_fr,otm_b);


var cube_038 = new THREE.Mesh(geo, MetalMat);
    cube_038.position.set(0.9393, 0.0739,0);
    cube_038.scale.set(0.1139, 0.0767, 0.5205);
var cube_039 = new THREE.Mesh(geo, MetalMat);
    cube_039.position.set(0.7271, 0.1346,0);
    cube_039.scale.set(0.2689, 0.0901, 0.233);
    cube_039.setRot(0.3098, 1.5708,0);

var cube_072 = new THREE.Mesh(geo, WasherMat);
    cube_072.position.set(0.253, 0.2265, 0);
    cube_072.scale.set(0.2689, 0.0995, 0.3515);
var cube_073 = new THREE.Mesh(geo, WasherMat);
    cube_073.position.set(-0.0907, 0.4654, 0);
    cube_073.scale.set(0.5784, 0.0973, 0.3757);

//side panel
var cube_074 = new THREE.Mesh(geo, WasherMat);
    cube_074.setRot(0, 0.0641, 0);
    cube_074.scale.set(0.5784, 0.1078, 0.0355);
    cube_074.position.set(-0.1438, 0.4107, -0.386);
//side panel
    var cube_075 = new THREE.Mesh(geo, WasherMat);
    cube_075.setRot(0,0.0641,0);
    cube_075.scale.set(0.5784, 0.0382, 0.0355);
    cube_075.position.set(-0.1438, 0.5567, -0.386);
//side panel
var cube_079 = new THREE.Mesh(geo, WasherMat);
    cube_079.setRot(0,0.0641,0);
    cube_079.scale.set(0.5693, 0.0382, 0.0355);
    cube_079.position.set(-0.1529, 0.6332, -0.3854);
//side panel
var cube_083 = new THREE.Mesh(geo, WasherMat);
    cube_083.setRot(0, 0.0641, 0);
    cube_083.scale.set(0.5654, 0.0382, 0.0355);
    cube_083.position.set(-0.1568, 0.7097, -0.3851);
//side panel
var cube_084 = new THREE.Mesh(geo, WasherMat);
    cube_084.setRot(0, 0.0641, 0);
    cube_084.scale.set(0.5537, 0.0382, 0.0355);
    cube_084.position.set(-0.1685, 0.7862, -0.3844);
//side panel
var cube_098 = new THREE.Mesh(geo, WasherMat);
    cube_098.scale.set(0.5438, 0.0454, 0.0355);
    cube_098.setRot(0.0, 0.0641, 0.0);
    cube_098.position.set(-0.1784, 0.8698, -0.3837);
var cube_098MirroredZ = new THREE.Group();
    cube_098MirroredZ.add(cube_074,cube_075,cube_079,cube_083,cube_084,cube_098);

//decor front
var cube_076 = new THREE.Mesh(geo, ColonaMat);
    cube_076.setRot(-0.8986, 0, -1.3866);
    cube_076.scale.set(0.0555, 0.0086, 0.013);
    cube_076.position.set(0.4123, 0.6581, -0.4561);
//decor front (чуть ниже)
var cube_077 = new THREE.Mesh(geo, ColonaMat);
    cube_077.setRot(-0.9037, 0, -1.4353);
    cube_077.scale.set(0.0416, 0.0086, 0.013);
    cube_077.position.set(0.428, 0.5632, -0.456);
//decor front (самый низкий)
var cube_078 = new THREE.Mesh(geo, ColonaMat);
    cube_078.setRot(-1.5549, -0.6436, -1.5405);
    cube_078.scale.set(0.0682, 0.0086, 0.013);
    cube_078.position.set(0.4351, 0.4555, -0.4546);
//decor front (чуть повыше)
var cube_080 = new THREE.Mesh(geo, ColonaMat);
    cube_080.setRot(-0.8884, 0, -1.3109);
    cube_080.scale.set(0.0783, 0.0086, 0.013);
    cube_080.position.set(0.3823, 0.7872, -0.4562);
var cube_080MirroredZ = new THREE.Group();
    cube_080MirroredZ.add(cube_076,cube_077,cube_078,cube_080);

//передние фары
var faraOut = new THREE.Mesh(geo, WhiteDotsMat);
var faraIn = new THREE.Mesh(geo, YellowMat);
    faraOut.setRot(0,0.2328,-1.1176);faraOut.scale.set(0.04,0.07,0.05);faraOut.position.set(0.58,0.39,-0.255);
    faraIn.setRot( 0,0.2328,-1.1176);faraIn.scale.set(0.03,0.05,0.045);faraIn.position.set(0.6,0.4,-0.26);
var fara_r = new THREE.Group();fara_r.add(faraOut, faraIn);
var fara_l = fara_r.clone(); fara_l.scale.z = -1;
var fara_fr = new THREE.Group(); fara_fr.add(fara_l,fara_r);

    
var geo = new THREE.CylinderGeometry(1, 1, 2, 12);
//front washer part
var cylinder_008 = new THREE.Mesh(geo, ColonaMat);
    cylinder_008.setRot(1.5708,0,0);
    cylinder_008.scale.set(0.0746, 0.5291, 0.0746);
    cylinder_008.position.set(0.6385, 0.1628, 0);
//front washer part (боковые накладки)
var cylinder_009 = new THREE.Mesh(geo, Green_PictureMat);
    cylinder_009.setRot(1.5708,0,0);
    cylinder_009.scale.set(0.1,0.06,0.1);
    cylinder_009.position.set(0.6385, 0.1628,0.5);
//front washer part (накладки ближе к центру)
var cylinder_013 = new THREE.Mesh(geo, MetalMat);
    cylinder_013.scale.set(0.0872, 0.0458, 0.0872);
    cylinder_013.setRot(1.5708, 0, 0);
    cylinder_013.position.set(0.6385, 0.1628, 0.2746);
var cylinder_013MirroredZ = new THREE.Group();
    cylinder_013MirroredZ.add(cylinder_008,cylinder_009,cylinder_013);

//wheels
var tire = new THREE.Mesh(geo, ColonaMat);   tire.scale.set(0.15, 0.06, 0.15);
var wheel_in = new THREE.Mesh(geo, MetalMat);wheel_in.scale.set(0.13, 0.07, 0.13);
var wheel_fr = new THREE.Group();wheel_fr.add(tire,wheel_in);
    wheel_fr.setRot(1.5708,0,0); wheel_fr.position.set(0.2474, 0.14, 0.4746);

//боковые фары
var fara_side = new THREE.Mesh(geo, MetalMat);
    fara_side.setRot(1.4661, 1.9292, -0.6546);
    fara_side.scale.set(0.0495, 0.0125, 0.0495);
    fara_side.position.set(0.312, 0.5726, -0.5081);
//фонарь в боковых фарах
var fara_light = new THREE.Mesh(geo, YellowMat);
    fara_light.setRot(1.4661, 1.9292, -0.6546);
    fara_light.scale.set(0.0392, 0.01, 0.0392);
    fara_light.position.set(0.3223, 0.5735, -0.5127);
    //side fara support
var geo1 = new THREE.BoxGeometry(2,2,2);
var fara_stoika = new THREE.Mesh(geo1, MetalMat);
    fara_stoika.setRot(1.4661, 1.9292, -0.6546);
    fara_stoika.scale.set(0.0277, 0.0114, 0.0581);
    fara_stoika.position.set(0.3396, 0.5026, -0.461);

var fara_side_r = new THREE.Group(); fara_side_r.add(fara_side,fara_light,fara_stoika);
var fara_side_l = fara_side_r.clone(); fara_side_l.scale.z = -1;
var fara_side = new THREE.Group(); fara_side.add(fara_side_r,fara_side_l);

//внутренняя часть заднего колеса
var cylinder_016 = new THREE.Mesh(geo, MetalMat);
    cylinder_016.position.set(-0.6668, 0.1409, 0);
    cylinder_016.scale.set(-0.1354, -0.0673, -0.1354);
    cylinder_016.setRot(1.5708, 0, 0);
//покрышка заднего колеса
var cylinder_017 = new THREE.Mesh(geo, ColonaMat);
    cylinder_017.position.set(-0.6668, 0.1409, 0);
    cylinder_017.scale.set(0.1549, 0.0604, 0.1549);
    cylinder_017.setRot(1.5708, 0, 0);

//front washer part(наклонный кубик)
var geo = new THREE.BoxGeometry(2,2,2);
var cube_086 = new THREE.Mesh(geo, BrassMat);
    cube_086.scale.set(0.0388, 0.0299, 0.1104);
    cube_086.setRot(0.3098, 1.5708, 0);
    cube_086.position.set(0.7549, 0.1227, 0.5);
var cube_086MirroredZ = new THREE.Group();
    cube_086MirroredZ.add(cube_086);

//кусок моющей части впереди
var cube_088 = new THREE.Mesh(geo, MetalMat);
    cube_088.setRot(1.5708, 1.309, 0);
    cube_088.scale.set(0.0335, 0.109, 0.0767);
    cube_088.position.set(0.9393, 0.0739, 0.5241);
//кусок моющей части впереди
var cube_089 = new THREE.Mesh(geo, MetalMat);
    cube_089.setRot(1.5708, 0.7854, 0);
    cube_089.scale.set(0.0335, 0.109, 0.0767);
    cube_089.position.set(0.9351, 0.0739, 0.5313);
//кусок моющей части впереди
var cube_090 = new THREE.Mesh(geo, MetalMat);
    cube_090.setRot(1.5708, 0.2618, 0);
    cube_090.scale.set(0.0335, 0.109, 0.0767);
    cube_090.position.set(0.9279, 0.0739, 0.5355);
//кусок моющей части впереди
var cube_091 = new THREE.Mesh(geo, MetalMat);
    cube_091.setRot(1.5708, 0, 0);
    cube_091.scale.set(0.0178, 0.0632, 0.0767);
    cube_091.position.set(0.906, 0.0739, 0.5862);
//кусок моющей части впереди
var cube_093 = new THREE.Mesh(geo, MetalMat);
    cube_093.setRot(1.5708, -0.3927, 0);
    cube_093.scale.set(0.024, 0.0632, 0.0767);
    cube_093.position.set(0.8902, 0.0739, 0.5818);
//кусок моющей части впереди
var cube_094 = new THREE.Mesh(geo, MetalMat);
    cube_094.scale.set(0.024, 0.0388, 0.0767);
    cube_094.setRot(1.5708, -1.1781, -0.0);
    cube_094.position.set(0.8705, 0.0739, 0.5939);
//кусок моющей части впереди
var cube_095 = new THREE.Mesh(geo, MetalMat);
    cube_095.scale.set(0.0333, 0.0388, 0.0767);
    cube_095.setRot(1.5708, 1.5708, 0);
    cube_095.position.set(0.8643, 0.0739, 0.5533);
var cube_095MirroredZ = new THREE.Group();
    cube_095MirroredZ.add(cube_088,cube_089,cube_090,cube_091,cube_093,cube_094,cube_095);

//upper decor element
var cube_097 = new THREE.Mesh(geo, ColonaMat);
    cube_097.scale.set(0.0861, 0.0086, 0.013);
    cube_097.setRot(1.4046, 0.6992, 0.2008);
    cube_097.position.set(0.3904, 1.0188, 0.4005);
var cube_097MirroredZ = new THREE.Group();
    cube_097MirroredZ.add(cube_097);

//кусок корпуса внутри
var cube_099 = new THREE.Mesh(geo, WasherMat);
    cube_099.scale.set(0.5438, 0.3097, 0.1828);
    cube_099.setRot(0, 0.0641, 0);
var cube_099MZ = cube_099.clone();
    cube_099MZ.updateMatrixWorld(true);
    cube_099.position.set(0, 0, -0.1658);
    cube_099MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_099MZ.position.set(0, 0, 0.1649);
var cube_099MirroredZ = new THREE.Group();
    cube_099MirroredZ.add(cube_099, cube_099MZ);
    cube_099MirroredZ.position.set(-0.1644, 0.6126, 0);

//задний контур декора
var cube_101 = new THREE.Mesh(geo, ColonaMat);
    cube_101.scale.set(0.3095, 0.0126, 0.013);
    cube_101.setRot(-1.5708, 0.0641, -1.5708);
var cube_101MZ = cube_101.clone();
    cube_101MZ.updateMatrixWorld(true);
    cube_101.position.set(0, 0, -0.3832);
    cube_101MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_101MZ.position.set(0, 0, 0.3822);
var cube_101MirroredZ = new THREE.Group();
    cube_101MirroredZ.add(cube_101, cube_101MZ);
    cube_101MirroredZ.position.set(-0.7233, 0.6164, 0);

//задняя часть внутреннего корпуса
var cube_085 = new THREE.Mesh(geo, WasherMat);
    cube_085.scale.set(0.345, 0.3137, 0.2025);
    cube_085.setRot(0, 0.0641, 0);
var cube_085MZ = cube_085.clone();
    cube_085MZ.updateMatrixWorld(true);
    cube_085.position.set(0, 0, -0.0847);
    cube_085MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_085MZ.position.set(0, 0, 0.0837);
var cube_085MirroredZ = new THREE.Group();
    cube_085MirroredZ.add(cube_085, cube_085MZ);
    cube_085MirroredZ.position.set(-0.4076, 0.5014, 0);

var cube_103 = new THREE.Mesh(geo, Floor_trainMat);
    cube_103.position.set(-0.7408, 0.5486, -0.0005);
    cube_103.scale.set(-0.068, -0.122, -0.122);
    cube_103.setRot(0, 0, -0.3156);

var cube_104 = new THREE.Mesh(geo, WasherMat);
    cube_104.scale.set(0.0865, 0.5837, 0.089);
    cube_104.setRot(0, 0, -1.0914);
var cube_104MZ = cube_104.clone();
    cube_104MZ.updateMatrixWorld(true);
    cube_104.position.set(0, 0, 0.0898);
    cube_104MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_104MZ.position.set(0, 0, -0.0907);
var cube_104MirroredZ = new THREE.Group();
    cube_104MirroredZ.add(cube_104, cube_104MZ);
    cube_104MirroredZ.position.set(-0.0144, 0.7044, 0);

var cube_105 = new THREE.Mesh(geo, WasherMat);
    cube_105.scale.set(0.0847, 0.5828, 0.089);
    cube_105.setRot(0, 0, -1.3109);
var cube_105MZ = cube_105.clone();
    cube_105MZ.updateMatrixWorld(true);
    cube_105.position.set(0, 0, -0.0895);
    cube_105MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_105MZ.position.set(0, 0, 0.0885);
var cube_105MirroredZ = new THREE.Group();
    cube_105MirroredZ.add(cube_105, cube_105MZ);
    cube_105MirroredZ.position.set(-0.0782, 0.8192, 0);

var cube_106 = new THREE.Mesh(geo, ColonaMat);
    cube_106.scale.set(0.0783, 0.0086, 0.013);
    cube_106.setRot(-0.8884, -0.0, -1.3109);
var cube_106MZ = cube_106.clone();
    cube_106MZ.updateMatrixWorld(true);
    cube_106.position.set(0, 0, -0.4562);
    cube_106MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_106MZ.position.set(0, 0, 0.4553);
var cube_106MirroredZ = new THREE.Group();
    cube_106MirroredZ.add(cube_106, cube_106MZ);
    cube_106MirroredZ.position.set(0.3421, 0.9384, 0);

var cube_107 = new THREE.Mesh(geo, ColonaMat);
    cube_107.scale.set(0.5328, 0.0126, 0.013);
    cube_107.setRot(1.5708, 0.0641, -3.1416);
var cube_107MZ = cube_107.clone();
    cube_107MZ.updateMatrixWorld(true);
    cube_107.position.set(0, 0, -0.4181);
    cube_107MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_107MZ.position.set(0, 0, 0.4172);
var cube_107MirroredZ = new THREE.Group();
    cube_107MirroredZ.add(cube_107, cube_107MZ);
    cube_107MirroredZ.position.set(-0.1835, 0.9129, 0);

var cube_108 = new THREE.Mesh(geo, cube_108Mat);
    cube_108.scale.set(0.0319, 0.0539, 0.0095);
    cube_108.setRot(1.5149, 0, -1.5708);
var cube_108MZ = cube_108.clone();
    cube_108MZ.updateMatrixWorld(true);
    cube_108.position.set(0, 0, -0.3317);
    cube_108MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_108MZ.position.set(0, 0, 0.3307);
var cube_108MirroredZ = new THREE.Group();
    cube_108MirroredZ.add(cube_108, cube_108MZ);
    cube_108MirroredZ.position.set(-0.7324, 0.3456, 0);

var cube_109 = new THREE.Mesh(geo, YellowMat);
    cube_109.scale.set(0.0293, 0.0495, 0.0042);
    cube_109.setRot(1.5149, 0.0, -1.5708);
var cube_109MZ = cube_109.clone();
    cube_109MZ.updateMatrixWorld(true);
    cube_109.position.set(0, 0, -0.3311);
    cube_109MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_109MZ.position.set(0, 0, 0.3302);
var cube_109MirroredZ = new THREE.Group();
    cube_109MirroredZ.add(cube_109, cube_109MZ);
    cube_109MirroredZ.position.set(-0.7422, 0.3456, 0);

var cube_110 = new THREE.Mesh(geo, Green_PictureMat);
    cube_110.scale.set(-0.0358, -0.0754, -0.0358);
    cube_110.setRot(0, 0, -0.7854);
var cube_110MZ = cube_110.clone();
    cube_110MZ.updateMatrixWorld(true);
    cube_110.position.set(0, 0, 0.1288);
    cube_110MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_110MZ.position.set(0, 0, -0.1298);
var cube_110MirroredZ = new THREE.Group();
    cube_110MirroredZ.add(cube_110, cube_110MZ);
    cube_110MirroredZ.position.set(-0.6403, 0.1674, 0);

var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_018 = new THREE.Mesh(geo, MetalMat);
    cylinder_018.position.set(-0.6668, 0.1409, -0.0005);
    cylinder_018.scale.set(-0.0317, -0.1797, -0.0317);
    cylinder_018.setRot(1.5708, 0, 0);

var cylinder_019 = new THREE.Mesh(geo, Green_PictureMat);
    cylinder_019.scale.set(0.1012, 0.0067, 0.1012);
    cylinder_019.setRot(1.5708, 0.0, 0.0);
var cylinder_019MZ = cylinder_019.clone();
    cylinder_019MZ.updateMatrixWorld(true);
    cylinder_019.position.set(0, 0, 0.4813);
    cylinder_019MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_019MZ.position.set(0, 0, -0.4822);
var cylinder_019MirroredZ = new THREE.Group();
    cylinder_019MirroredZ.add(cylinder_019, cylinder_019MZ);
    cylinder_019MirroredZ.position.set(0.2474, 0.1409, 0);

var cylinder_020 = new THREE.Mesh(geo, Green_PictureMat);
    cylinder_020.position.set(-0.6668, 0.1409, 0);
    cylinder_020.scale.set(-0.0284, -0.1868, -0.0284);
    cylinder_020.setRot(1.5708, 0, 0);

var cyl_021 = new THREE.Mesh(geo, Blue_PictureMat);
    cyl_021.position.set(-0.777, 0.6567, -0.0954);
    cyl_021.scale.set(0.0196, 0.0044, 0.0196);
    cyl_021.setRot(0.0, -0.0, 1.2552);
var cylinder_022 = new THREE.Mesh(geo, YellowMat);
    cylinder_022.position.set(-0.7865, 0.6277, -0.0411);
    cylinder_022.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_022.setRot(0.0, -0.0, 1.2552);
var cylinder_023 = new THREE.Mesh(geo, Green_PictureMat);
    cylinder_023.position.set(-0.777, 0.6567, 0.0131);
    cylinder_023.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_023.setRot(0.0, -0.0, 1.2552);
var cylinder_024 = new THREE.Mesh(geo, Train_blueMat);
    cylinder_024.position.set(-0.7865, 0.6277, 0.0673);
    cylinder_024.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_024.setRot(0.0, -0.0, 1.2552);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_111 = new THREE.Mesh(geo, Floor_trainMat);
    cube_111.position.set(-0.7408, 0.3941, 0);
    cube_111.scale.set(-0.068, -0.0905, -0.0741);
var cube_112 = new THREE.Mesh(geo, Green_PictureMat);
    cube_112.position.set(-0.833, 0.4853, -0.0005);
    cube_112.scale.set(-0.0059, -0.0233, -0.1071);
    cube_112.setRot(0, 0, -0.3156);
var cube_113 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_113.position.set(-0.8328, 0.5005, -0.0005);
    cube_113.scale.set(-0.0059, -0.0048, -0.1029);
    cube_113.setRot(0, 0, -0.3156);
var cube_114 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_114.position.set(-0.842, 0.4724, -0.0005);
    cube_114.scale.set(-0.0059, -0.0048, -0.1029);
    cube_114.setRot(0, 0, -0.3156);
var cube_115 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_115.position.set(-0.8374, 0.4865, 0.0976);
    cube_115.scale.set(-0.0059, -0.0048, -0.0118);
    cube_115.setRot(-1.5708, 0, -0.3156);
var cube_116 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_116.position.set(-0.8374, 0.4865, -0.0986);
    cube_116.scale.set(-0.0059, -0.0048, -0.0118);
    cube_116.setRot(-1.5708, 0, -0.3156);
var cube_117 = new THREE.Mesh(geo, ColonaMat);
    cube_117.position.set(-0.8245, 0.5566, -0.0904);
    cube_117.scale.set(-0.0053, -0.0053, -0.0015);
    cube_117.setRot(0,0,1.2552);
var cube_118 = new THREE.Mesh(geo, ColonaMat);
    cube_118.position.set(-0.8318, 0.5341, -0.0904);
    cube_118.scale.set(-0.0053, -0.0053, -0.0015);
    cube_118.setRot(0,0,1.2552);
var cube_119 = new THREE.Mesh(geo, ColonaMat);
    cube_119.position.set(-0.8254, 0.5539, -0.0425);
    cube_119.scale.set(-0.0053, -0.0053, -0.0015);
    cube_119.setRot(-1.1034, 1.2201, 0.8109);
var cube_120 = new THREE.Mesh(geo, ColonaMat);
    cube_120.position.set(-0.831, 0.5368, -0.0272);
    cube_120.scale.set(-0.0053, -0.0053, -0.0015);
    cube_120.setRot(-1.1034, 1.2201, 0.8109);
var cube_121 = new THREE.Mesh(geo, ColonaMat);
    cube_121.position.set(-0.8286, 0.544, 0.0438);
    cube_121.scale.set(-0.0053, -0.0053, -0.0015);
    cube_121.setRot(1.2537, -1.6022, -0.0959);
var cube_122 = new THREE.Mesh(geo, ColonaMat);
    cube_122.position.set(-0.8279, 0.5463, 0.0202);
    cube_122.scale.set(-0.0053, -0.0053, -0.0015);
    cube_122.setRot(1.2537, -1.6022, -0.0959);
var cube_123 = new THREE.Mesh(geo, ColonaMat);
    cube_123.position.set(-0.8312, 0.5359, 0.0835);
    cube_123.scale.set(-0.0053, -0.0053, -0.0015);
    cube_123.setRot(-1.0361, -4.2732, -0.9159);
var cube_124 = new THREE.Mesh(geo, ColonaMat);
    cube_124.position.set(-0.8251, 0.5546, 0.0966);
    cube_124.scale.set(-0.0053, -0.0053, -0.0015);
    cube_124.setRot(-1.0361, -4.2732, -0.9159);

//middle black part
var body_bl = new THREE.Mesh(geo, MetalMat);
body_bl.setRot(0, 0,0.06);body_bl.scale.set(0.55,0.09,0.2);body_bl.position.set(-0.13,0.9,0);
    
var cube_126 = new THREE.Mesh(geo, ColonaMat);
    cube_126.scale.set(0.0908, 0.0086, 0.013);
    cube_126.setRot(1.3195, 1.3148, 0.0672);
var cube_126MZ = cube_126.clone();
    cube_126MZ.updateMatrixWorld(true);
    cube_126.position.set(0, 0, 0.263);
    cube_126MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_126MZ.position.set(0, 0, -0.2639);
var cube_126MirroredZ = new THREE.Group();
    cube_126MirroredZ.add(cube_126, cube_126MZ);
    cube_126MirroredZ.position.set(0.4752, 1.0414, 0);

var cube_128 = new THREE.Mesh(geo, ColonaMat);
    cube_128.position.set(0.7502, 0.2067, -0.0005);
    cube_128.scale.set(0.1506, 0.042, 0.233);
    cube_128.setRot(0.3098, 1.5708, 0);
var cube_129 = new THREE.Mesh(geo, MetalMat);
    cube_129.position.set(0.7526, 0.2428, -0.0005);
    cube_129.scale.set(0.0423, 0.0157, 0.233);
    cube_129.setRot(0.3098, 1.5708, 0);

var geo = new THREE.SphereGeometry(1, 16, 16);
var sphere = new THREE.Mesh(geo, Green_PictureMat);
    sphere.position.set(-0.9298, 0.5169, 0.1035);
    sphere.scale.set(0.0139, 0.0139, 0.0139);
    sphere.setRot(0.4012, 0, 1.2552);
var sphere_001 = new THREE.Mesh(geo, ColonaMat);
    sphere_001.scale.set(0.0178, 0.0178, 0.0178);
var sphere_001MZ = sphere_001.clone();
    sphere_001MZ.updateMatrixWorld(true);
    sphere_001.position.set(0, 0, -0.0988);
    sphere_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    sphere_001MZ.position.set(0, 0, 0.0979);
var sphere_001MirroredZ = new THREE.Group();
    sphere_001MirroredZ.add(sphere_001, sphere_001MZ);
    sphere_001MirroredZ.position.set(-0.7787, 0.3129, 0);
var sphere_002 = new THREE.Mesh(geo, ColonaMat);
    sphere_002.scale.set(0.0178, 0.0178, 0.0178);
var sphere_002MZ = sphere_002.clone();
    sphere_002MZ.updateMatrixWorld(true);
    sphere_002.position.set(0, 0, -0.2324);
    sphere_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    sphere_002MZ.position.set(0, 0, 0.2314);
var sphere_002MirroredZ = new THREE.Group();
    sphere_002MirroredZ.add(sphere_002, sphere_002MZ);
    sphere_002MirroredZ.position.set(-0.7787, 0.1538, 0);
var sphere_003 = new THREE.Mesh(geo, ColonaMat);
    sphere_003.scale.set(0.08, 0.08, 0.08);
    sphere_003.setRot(1.5708, 0, 0);
var sphere_003MZ = sphere_003.clone();
    sphere_003MZ.updateMatrixWorld(true);
    sphere_003.position.set(0, 0, -0.1681);
    sphere_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    sphere_003MZ.position.set(0, 0, 0.1671);
var sphere_003MirroredZ = new THREE.Group();
    sphere_003MirroredZ.add(sphere_003, sphere_003MZ);
    sphere_003MirroredZ.position.set(0.9595, 0.1429, 0);

var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_025 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_025.position.set(-0.8762, 0.4994, 0.0796);
    cylinder_025.scale.set(0.007, 0.0613, 0.007);
    cylinder_025.setRot(0.4012, 0, 1.2552);

var cylinder_026 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_026.position.set(-0.8149, 0.5407, -0.0904);
    cylinder_026.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_026.setRot(0,0,1.2552);

var cylinder_027 = new THREE.Mesh(geo, ColonaMat);
    cylinder_027.position.set(-0.8253, 0.5441, -0.0904);
    cylinder_027.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_027.setRot(0,0,1.2552);

var cylinder_028 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_028.position.set(-0.8149, 0.5408, -0.0348);
    cylinder_028.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_028.setRot(1.1034, -1.2201, 0.8109);

var cylinder_029 = new THREE.Mesh(geo, ColonaMat);
    cylinder_029.position.set(-0.8253, 0.5442, -0.0348);
    cylinder_029.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_029.setRot(1.1034, -1.2201, 0.8109);

var cylinder_030 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_030.position.set(-0.8148, 0.541, 0.032);
    cylinder_030.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_030.setRot(-1.2537, 1.6022, -0.0959);

var cylinder_031 = new THREE.Mesh(geo, ColonaMat);
    cylinder_031.position.set(-0.8253, 0.5444, 0.032);
    cylinder_031.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_031.setRot(-1.2537, 1.6022, -0.0959);

var cylinder_032 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_032.position.set(-0.8149, 0.5408, 0.09);
    cylinder_032.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_032.setRot(1.0361, 4.2732, -0.9159);

var cylinder_033 = new THREE.Mesh(geo, ColonaMat);
    cylinder_033.position.set(-0.8253, 0.5442, 0.09);
    cylinder_033.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_033.setRot(1.0361, 4.2732, -0.9159);

var cylinder_034 = new THREE.Mesh(geo, ColonaMat);
    cylinder_034.scale.set(0.0162, 0.0722, 0.0162);
var cylinder_034MZ = cylinder_034.clone();
    cylinder_034MZ.updateMatrixWorld(true);
    cylinder_034.position.set(0, 0, -0.0988);
    cylinder_034MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_034MZ.position.set(0, 0, 0.0979);
var cylinder_034MirroredZ = new THREE.Group();
    cylinder_034MirroredZ.add(cylinder_034, cylinder_034MZ);
    cylinder_034MirroredZ.position.set(-0.7787, 0.3851, 0);

var cylinder_035 = new THREE.Mesh(geo, ColonaMat);
    cylinder_035.scale.set(0.0162, 0.1045, 0.0162);
    cylinder_035.setRot(0.6981,0,0);
var cylinder_035MZ = cylinder_035.clone();
    cylinder_035MZ.updateMatrixWorld(true);
    cylinder_035.position.set(0,0, -0.1652);
    cylinder_035MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_035MZ.position.set(0,0, 0.1642);
var cylinder_035MirroredZ = new THREE.Group();
    cylinder_035MirroredZ.add(cylinder_035, cylinder_035MZ);
    cylinder_035MirroredZ.position.set(-0.7787, 0.2339, 0);

var cylinder_036 = new THREE.Mesh(geo, ColonaMat);
    cylinder_036.scale.set(0.0162, 0.3859, 0.0162);
    cylinder_036.setRot(0,0,-1.5708);
var cylinder_036MZ = cylinder_036.clone();
    cylinder_036MZ.updateMatrixWorld(true);
    cylinder_036.position.set(0, 0, -0.2324);
    cylinder_036MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_036MZ.position.set(0, 0, 0.2314);
var cylinder_036MirroredZ = new THREE.Group();
    cylinder_036MirroredZ.add(cylinder_036, cylinder_036MZ);
    cylinder_036MirroredZ.position.set(-0.3951, 0.1538, 0);

var cylinder_037 = new THREE.Mesh(geo, ColonaMat);
    cylinder_037.position.set(0.9595, 0.1429, 0);
    cylinder_037.scale.set(0.0817, 0.1676, 0.0817);
    cylinder_037.setRot(1.5708,0,0);

var robot = new THREE.Group();
robot.add(cube_038, cube_039, fara_side, fara_fr, panels_mid, panels_l, panels_r, panels_side_l, panels_side_r, otmostka, cube_072, cube_073, cube_080MirroredZ, cube_098MirroredZ, wheel_fr, cylinder_013MirroredZ, cube_086MirroredZ, cube_095MirroredZ, cube_087MirroredZ, cube_096MirroredZ, cube_097MirroredZ, cube_099MirroredZ, cube_101MirroredZ, cylinder_016, cylinder_017, cube_085MirroredZ, cube_103, cube_104MirroredZ, cube_105MirroredZ, cube_106MirroredZ, cube_107MirroredZ, cube_108MirroredZ, cube_109MirroredZ, cylinder_018, cube_110MirroredZ, cylinder_019MirroredZ, cylinder_020, cube_111, cyl_021, cylinder_022, cylinder_023, cylinder_024, cube_112, cube_113, cube_114, cube_115, cube_116, cylinder_025, sphere, cylinder_026, cylinder_027, cube_117, cube_118, cylinder_028, cylinder_029, cube_119, cube_120, cylinder_030, cylinder_031, cube_121, cube_122, cylinder_032, cylinder_033, cube_123, cube_124, cylinder_034MirroredZ, sphere_001MirroredZ, cylinder_035MirroredZ, sphere_002MirroredZ, cylinder_036MirroredZ, body_bl, cube_126MirroredZ, cylinder_037, sphere_003MirroredZ, cube_128, cube_129);
robot.rotateX(PI/2);
var out = new THREE.Group();
out.add(robot);
// ===== CAMERA 2
cameras.robot = new THREE.PerspectiveCamera(75, WC / HC, 1, 1000);
cameras.robot.rotation.set(PI/2,-PI/2, 0);
cameras.robot.position.set(-4, 0, 2);
out.add(cameras.robot);
// откуда
RobotMData.Sonar = DrawSphere();
RobotMData.Sonar.position.x = 1.2;
RobotMData.Sonar.scale.setScalar(0.2);
// Линия луча
var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
var Mat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
var Linetelo;
Linetelo = new THREE.Mesh(geometry, Mat);
Linetelo.position.x = 0.5;
Linetelo.rotation.z = PI/2;
RobotMData.LineH = new THREE.Group();
RobotMData.LineH.add(Linetelo);
RobotMData.LineH.position.x = RobotMData.Sonar.position.x;
Linetelo = new THREE.Mesh(geometry, Mat);
Linetelo.position.z = -0.5;
Linetelo.rotation.x = PI / 2;
RobotMData.LineV = new THREE.Group();
RobotMData.LineV.add(Linetelo);
RobotMData.LineV.position.x = RobotMData.Sonar.position.x;
out.add(RobotMData.Sonar, RobotMData.LineH, RobotMData.LineV);
function DrawSphere() {
 var geometry = new THREE.SphereGeometry(0.5, 32, 16);
 var Mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
 var sphere = new THREE.Mesh(geometry, Mat);
 return sphere;
}
return out;
}
function DrawCleanRobot() {

var Mat = new THREE.MeshStandardMaterial({color:0xEEEEEE,metalness:1,roughness:0.5});
var Mat_1 = new THREE.MeshStandardMaterial({color:0x111111,roughness: 0.5});
var Mat_2 = new THREE.MeshStandardMaterial({color:new THREE.Color(0.0504,0.209,1),roughness: 0.5});
var Mat_3 = new THREE.MeshStandardMaterial({color:new THREE.Color(0.0154,0.8,0),roughness: 0.5});
var Mat_5 = new THREE.MeshStandardMaterial({color:new THREE.Color(1, 0.0146, 0.0039),roughness:0.5});
var Mat_6 = new THREE.MeshStandardMaterial({color:new THREE.Color(0.1788, 0.1788, 0.1788),roughness: 0.5});
var Mat_7 = new THREE.MeshStandardMaterial({color:new THREE.Color(0.504, 0.4274, 0.4433),roughness: 0.5});
var cylinder_brushesMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2254, 0.0735, 0.8924)});

var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_body = new THREE.Mesh(geo, Mat_2);
    cylinder_body.position.set(0, 0.1347, 0);
    cylinder_body.scale.set(0.5636, -0.0994, 0.5636);
var cylinder_wheel2 = new THREE.Mesh(geo, Mat_1);
    cylinder_wheel2.position.set(-0.3844, 0.0394, 0.2595);
    cylinder_wheel2.scale.set(-0.0516, -0.0176, -0.0515);
    cylinder_wheel2.setRot(1.8196, -4.5347, 1.5422);
var cylinder_wheel3 = new THREE.Mesh(geo, Mat_1);
    cylinder_wheel3.position.set(0, 0.0052, -0.4846);
    cylinder_wheel3.scale.set(-0.0159, -0.0054, -0.0158);
    cylinder_wheel3.setRot(1.8196, -1.8235, 1.5422);
var cylinder_wheel1 = new THREE.Mesh(geo, Mat_1);
    cylinder_wheel1.position.set(0.3747, 0.0394, 0.2595);
    cylinder_wheel1.scale.set(-0.0516, -0.0176, -0.0515);
    cylinder_wheel1.setRot(-1.322, -2.628, 1.5994);
var cylinder_button_off = new THREE.Mesh(geo, Mat_5);
    cylinder_button_off.position.set(0.0516, 0.2185, -0.4293);
    cylinder_button_off.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_button_on = new THREE.Mesh(geo, Mat_3);
    cylinder_button_on.position.set(-0.0509, 0.2185, -0.4293);
    cylinder_button_on.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_brushes = new THREE.Mesh(geo, cylinder_brushesMat);
    cylinder_brushes.position.set(0,0.0858,0);
    cylinder_brushes.scale.set(0.0802, 0.28, 0.0802);
    cylinder_brushes.setRot(0,0, -1.5708);

var geo = new THREE.SphereGeometry(1, 16, 16);
var sphere_support = new THREE.Mesh(geo, Mat_6);
    sphere_support.position.set(0,0.0515,-0.4844);
    sphere_support.scale.set(0.0434,0.0434,0.0434);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_display = new THREE.Mesh(geo, Mat_7);
    cube_display.position.set(0,0.2231,0);
    cube_display.scale.set(-0.2711, -0.0151, -0.2711);
var cube_antenna1 = new THREE.Mesh(geo, Mat);
    cube_antenna1.position.set(-0.441, 0.3083, 0);
    cube_antenna1.scale.set(-0.0949, -0.0088, -0.0041);
    cube_antenna1.setRot(0,0, -1.0986);
var cube_antenna2 = new THREE.Mesh(geo, Mat);
    cube_antenna2.position.set(0.4558, 0.3083,0);
    cube_antenna2.scale.set(-0.0949, -0.0088, -0.0041);
    cube_antenna2.setRot(0.0, 3.1416, -1.0986);

var robot = new THREE.Group();
robot.add(cylinder_body, cylinder_wheel2, sphere_support, cylinder_wheel3, cylinder_wheel1, cube_display, cylinder_button_off, cylinder_button_on, cylinder_brushes, cube_antenna1, cube_antenna2);
robot.rotateX(PI/2);
robot.rotateY(-PI/2);
robot.position.z -= 0.1;
var out = new THREE.Group();
out.add(robot);
// ===== CAMERA 2
cameras.robotCleaner = new THREE.PerspectiveCamera(75, WC/HC, 1, 1000);
cameras.robotCleaner.rotation.set(PI/2, -PI/2, 0);
cameras.robotCleaner.position.set(-4, 0, 2);
out.add(cameras.robotCleaner);
// откуда
CleanRobotData.Sonar = DrawSphere();
CleanRobotData.Sonar.position.x = 0.5;
CleanRobotData.Sonar.scale.setScalar(0.2);
// Линия луча
var geo = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
var Mat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
var Linetelo;
Linetelo = new THREE.Mesh(geo, Mat);
Linetelo.position.x = 0.5;
Linetelo.rotation.z = PI / 2;
CleanRobotData.LineH = new THREE.Group();
CleanRobotData.LineH.add(Linetelo);
CleanRobotData.LineH.position.x = CleanRobotData.Sonar.position.x;
Linetelo = new THREE.Mesh(geo, Mat);
Linetelo.position.z = -0.5;
Linetelo.rotation.x = PI / 2;
CleanRobotData.LineV = new THREE.Group();
CleanRobotData.LineV.add(Linetelo);
CleanRobotData.LineV.position.x = CleanRobotData.Sonar.position.x;
out.add(CleanRobotData.Sonar, CleanRobotData.LineH, CleanRobotData.LineV);
return out;
function DrawSphere() {
 var geo = new THREE.SphereGeometry(0.5, 32, 16);
 var Mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
 var sphere = new THREE.Mesh(geo, Mat);
 return sphere;
}
}
function DrawVagonDecorations() {
var cube_307Geometry = new THREE.BoxGeometry(2, 2, 2);
var train_base = new THREE.Mesh(cube_307Geometry, FloorTileMat);
train_base.position.set(0.0127, 6.3994, -1.6438);
train_base.scale.set(12.5105, 0.1214, 0.8001);
train_base.setRot(-0.2859, 0.0, 0.0);
var cube_308Geometry = new THREE.BoxGeometry(2, 2, 2);
var wheel_hold_u = new THREE.Mesh(cube_308Geometry, FloorTileMat);
wheel_hold_u.position.set(0.0127, 6.725, -0.7205);
wheel_hold_u.scale.set(12.5105, 0.1214, 0.2164);
wheel_hold_u.setRot(1.5708, 0.0, 0.0);
var cube_309Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_309 = new THREE.Mesh(cube_309Geometry, Green_PictureMat);
cube_309.position.set(0.0127, 6.725, -0.6018);
cube_309.scale.set(12.4539, 0.0107, 0.1974);
cube_309.setRot(1.5708, 0.0, 0.0);
var cylinder_021Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cyl_Group = new THREE.Group();
for (var i = 0; i < 9; i++) {
 var cyl_021 = new THREE.Mesh(cylinder_021Geometry, Green_PictureMat);
 cyl_021.scale.set(0.3252, 0.052, 0.3252);
 cyl_021.position.set(-2.732 * i, 0, 0);
 cyl_Group.add(cyl_021);
}
cyl_Group.position.set(10.931, 6.8703, 0.006);
var sphere_002Geometry = new THREE.SphereGeometry(1, 32, 16);
var sphere_002Group = new THREE.Group();
for (var i = 0; i < 9; i++) {
 var sphere_002 = new THREE.Mesh(sphere_002Geometry, RoofTilesMat);
 sphere_002.scale.set(0.2453, 0.2164, 0.2453);
 sphere_002.position.set(-2.7314 * i, 0, 0);
 sphere_002Group.add(sphere_002);
}
sphere_002Group.position.set(10.931, 6.8266, 0.006);
var cube_310Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_310Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var wheel_hold_p = new THREE.Mesh(cube_310Geometry, Floor_CentralMat);
 wheel_hold_p.scale.set(0.0702, 0.2701, 0.4985);
 wheel_hold_p.position.set(6.4288 * i, 0, 0);
 cube_310Group.add(wheel_hold_p);
}
cube_310Group.position.set(-8.4084, 2.5756, -1.8708);
var wheel_balkaGeometry = new THREE.BoxGeometry(2, 2, 2);
var wheel_balkaGroup = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var wheel_balka = new THREE.Mesh(wheel_balkaGeometry, Floor_CentralMat);
 wheel_balka.scale.set(0.0702, 0.1597, 0.5837);
 wheel_balka.position.set(6.4288 * i, 0, 0);
 wheel_balkaGroup.add(wheel_balka);
}
wheel_balkaGroup.position.set(-8.4084, 3.0054, -1.7856);
var cube_312Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_312Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_312 = new THREE.Mesh(cube_312Geometry, Floor_CentralMat);
 cube_312.scale.set(0.0702, 0.1597, 0.2747);
 cube_312.position.set(6.4288 * i, 0, 0);
 cube_312Group.add(cube_312);
}
cube_312Group.setRot(1.5708, 0.0, 0.0);
cube_312Group.position.set(-8.4084, 3.4397, -2.2097);
var cube_313Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_313Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_313 = new THREE.Mesh(cube_313Geometry, Floor_CentralMat);
 cube_313.scale.set(0.0702, 0.1264, 0.2747);
 cube_313.position.set(6.4288 * i, 0, 0);
 cube_313Group.add(cube_313);
}
cube_313Group.setRot(3.1416, 0.0, 0.0);
cube_313Group.position.set(-8.4084, 3.8408, -2.0946);
var cube_314Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_314Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_314 = new THREE.Mesh(cube_314Geometry, Floor_CentralMat);
 cube_314.scale.set(0.0702, 0.1264, 0.3091);
 cube_314.position.set(6.4288 * i, 0, 0);
 cube_314Group.add(cube_314);
}
cube_314Group.setRot(1.9635, 0.0, 0.0);
cube_314Group.position.set(-8.4084, 3.4772, -2.055);
var cube_315Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_315Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_315 = new THREE.Mesh(cube_315Geometry, Floor_CentralMat);
 cube_315.scale.set(0.0702, 0.1519, 0.4307);
 cube_315.position.set(6.4288 * i, 0, 0);
 cube_315Group.add(cube_315);
}
cube_315Group.setRot(0.3405, 0.0, 0.0);
cube_315Group.position.set(-8.4084, 3.1657, -1.6586);
var cube_316Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_316Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_316 = new THREE.Mesh(cube_316Geometry, Floor_CentralMat);
 cube_316.scale.set(0.0702, 0.1519, 0.2855);
 cube_316.position.set(6.4288 * i, 0, 0);
 cube_316Group.add(cube_316);
}
cube_316Group.setRot(1.8909, 0.0, -0.0);
cube_316Group.position.set(-8.4084, 2.6225, -1.4359);
var cube_317Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_317Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_317 = new THREE.Mesh(cube_317Geometry, Floor_CentralMat);
 cube_317.scale.set(0.0702, 0.2701, 0.4985);
 cube_317.position.set(6.4288 * i, 0, 0);
 cube_317Group.add(cube_317);
}
cube_317Group.position.set(-4.4057, 2.5756, -1.8708);
var cube_318Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_318Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_318 = new THREE.Mesh(cube_318Geometry, Floor_CentralMat);
 cube_318.scale.set(0.0702, 0.1597, 0.5837);
 cube_318.position.set(6.4288 * i, 0, 0);
 cube_318Group.add(cube_318);
}
cube_318Group.position.set(-4.4057, 3.0054, -1.7856);
var cube_319Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_319Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_319 = new THREE.Mesh(cube_319Geometry, Floor_CentralMat);
 cube_319.scale.set(0.0702, 0.1597, 0.2747);
 cube_319.position.set(6.4288 * i, 0, 0);
 cube_319Group.add(cube_319);
}
cube_319Group.setRot(1.5708, 0.0, 0.0);
cube_319Group.position.set(-4.4057, 3.4397, -2.2097);
var cube_320Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_320Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_320 = new THREE.Mesh(cube_320Geometry, Floor_CentralMat);
 cube_320.scale.set(0.0702, 0.1264, 0.2747);
 cube_320.position.set(6.4288 * i, 0, 0);
 cube_320Group.add(cube_320);
}
cube_320Group.setRot(3.1416, 0.0, 0.0);
cube_320Group.position.set(-4.4057, 3.8408, -2.0946);
var cube_321Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_321Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_321 = new THREE.Mesh(cube_321Geometry, Floor_CentralMat);
 cube_321.scale.set(0.0702, 0.1264, 0.3091);
 cube_321.position.set(6.4288 * i, 0, 0);
 cube_321Group.add(cube_321);
}
cube_321Group.setRot(1.9635, 0.0, 0.0);
cube_321Group.position.set(-4.4057, 3.4772, -2.055);
var cube_322Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_322Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_322 = new THREE.Mesh(cube_322Geometry, Floor_CentralMat);
 cube_322.scale.set(0.0702, 0.1519, 0.4307);
 cube_322.position.set(6.4288 * i, 0, 0);
 cube_322Group.add(cube_322);
}
cube_322Group.setRot(0.3405, 0.0, 0.0);
cube_322Group.position.set(-4.4057, 3.1657, -1.6586);
var cube_323Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_323Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_323 = new THREE.Mesh(cube_323Geometry, Floor_CentralMat);
 cube_323.scale.set(0.0702, 0.1519, 0.2855);
 cube_323.position.set(6.4288 * i, 0, 0);
 cube_323Group.add(cube_323);
}
cube_323Group.setRot(1.8909, 0.0, -0.0);
cube_323Group.position.set(-4.4057, 2.6225, -1.4359);
var cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_022Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_022 = new THREE.Mesh(cylinder_022Geometry, MetalMat);
 cylinder_022.scale.set(0.039, 0.4636, 0.039);
 cylinder_022.position.set(6.4289 * i, 0, 0);
 cylinder_022Group.add(cylinder_022);
}
cylinder_022Group.position.set(-8.4084, 3.6063, -1.3034);
var cylinder_023Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_023Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_023 = new THREE.Mesh(cylinder_023Geometry, MetalMat);
 cylinder_023.scale.set(0.039, 0.2801, 0.039);
 cylinder_023.position.set(6.4297 * i, 0, 0);
 cylinder_023Group.add(cylinder_023);
}
cylinder_023Group.setRot(1.5708, 0.0, 0.0);
cylinder_023Group.position.set(-8.4084, 3.8477, -1.5809);
var cylinder_024Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_024Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_024 = new THREE.Mesh(cylinder_024Geometry, MetalMat);
 cylinder_024.scale.set(0.0483, 0.033, 0.0483);
 cylinder_024.position.set(6.4293 * i, 0, 0);
 cylinder_024Group.add(cylinder_024);
}
cylinder_024Group.setRot(1.5708, 0.0, 0.0);
cylinder_024Group.position.set(-8.4084, 3.8477, -1.787);
var cylinder_025Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_025Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_025 = new THREE.Mesh(cylinder_025Geometry, MetalMat);
 cylinder_025.scale.set(0.0543, 0.0831, 0.0543);
 cylinder_025.position.set(6.4289 * i, 0, 0);
 cylinder_025Group.add(cylinder_025);
}
cylinder_025Group.position.set(-8.4084, 3.2062, -1.3034);
var sphere_003Geometry = new THREE.SphereGeometry(1, 32, 16);
var sphere_003Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var sphere_003 = new THREE.Mesh(sphere_003Geometry, MetalMat);
 sphere_003.scale.set(0.0552, 0.0552, 0.0552);
 sphere_003.position.set(6.4265 * i, 0, 0);
 sphere_003Group.add(sphere_003);
}
sphere_003Group.position.set(-8.4084, 4.0978, -1.3034);
var cylinder_026Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_026Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_026 = new THREE.Mesh(cylinder_026Geometry, MetalMat);
 cylinder_026.scale.set(0.039, 0.5356, 0.039);
 cylinder_026.position.set(6.4297 * i, 0, 0);
 cylinder_026Group.add(cylinder_026);
}
cylinder_026Group.setRot(1.5708, 0.0, 0.0);
cylinder_026Group.position.set(-4.4057, 4.0978, -1.8363);
var cylinder_027Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_027Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_027 = new THREE.Mesh(cylinder_027Geometry, MetalMat);
 cylinder_027.scale.set(0.0508, 0.0545, 0.0508);
 cylinder_027.position.set(6.4299 * i, 0, 0);
 cylinder_027Group.add(cylinder_027);
}
cylinder_027Group.setRot(1.5708, 0.0, 0.0);
cylinder_027Group.position.set(-8.4084, 4.0978, -2.3174);
var cylinder_028Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_028Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_028 = new THREE.Mesh(cylinder_028Geometry, MetalMat);
 cylinder_028.scale.set(0.039, 0.5356, 0.039);
 cylinder_028.position.set(6.4297 * i, 0, 0);
 cylinder_028Group.add(cylinder_028);
}
cylinder_028Group.setRot(1.5708, 0.0, 0.0);
cylinder_028Group.position.set(-8.4084, 4.0978, -1.8363);
var cylinder_029Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_029Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_029 = new THREE.Mesh(cylinder_029Geometry, MetalMat);
 cylinder_029.scale.set(0.0508, 0.0545, 0.0508);
 cylinder_029.position.set(6.4289 * i, 0, 0);
 cylinder_029Group.add(cylinder_029);
}
cylinder_029Group.setRot(1.5708, 0.0, 0.0);
cylinder_029Group.position.set(-4.4057, 4.0978, -2.3174);
var sphere_004Geometry = new THREE.SphereGeometry(1, 32, 16);
var sphere_004Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var sphere_004 = new THREE.Mesh(sphere_004Geometry, MetalMat);
 sphere_004.scale.set(0.0552, 0.0552, 0.0552);
 sphere_004.position.set(6.4309 * i, 0, 0);
 sphere_004Group.add(sphere_004);
}
sphere_004Group.position.set(-4.4057, 4.0978, -1.3034);
var cube_324Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_324Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_324 = new THREE.Mesh(cube_324Geometry, Green_PictureMat);
 cube_324.scale.set(2.0087, 0.071, 0.5573);
 cube_324.position.set(6.4279 * i, 0, 0);
 cube_324Group.add(cube_324);
}
cube_324Group.setRot(3.1416, 0.0, 0.0);
cube_324Group.position.set(-6.4071, 3.067, -1.8271);
var cube_325Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_325Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_325 = new THREE.Mesh(cube_325Geometry, Green_PictureMat);
 cube_325.scale.set(2.0087, 0.071, 0.4356);
 cube_325.position.set(6.4279 * i, 0, 0);
 cube_325Group.add(cube_325);
}
cube_325Group.setRot(4.465, 0.0, 0.0);
cube_325Group.position.set(-6.4071, 3.4491, -2.2037);
var cube_326Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_326Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_326 = new THREE.Mesh(cube_326Geometry, Floor_CentralMat);
 cube_326.scale.set(2.0087, 0.071, 0.4033);
 cube_326.position.set(6.4279 * i, 0, 0);
 cube_326Group.add(cube_326);
}
cube_326Group.setRot(1.8968, 0.0, 0.0);
cube_326Group.position.set(-6.4071, 2.6874, -1.4993);
var cylinder_030Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_030Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_030 = new THREE.Mesh(cylinder_030Geometry, MetalMat);
 cylinder_030.scale.set(0.039, 0.4636, 0.039);
 cylinder_030.position.set(6.4289 * i, 0, 0);
 cylinder_030Group.add(cylinder_030);
}
cylinder_030Group.position.set(-4.4057, 3.6063, -1.3034);
var cylinder_031Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_031Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_031 = new THREE.Mesh(cylinder_031Geometry, MetalMat);
 cylinder_031.scale.set(0.039, 0.2801, 0.039);
 cylinder_031.position.set(6.4297 * i, 0, 0);
 cylinder_031Group.add(cylinder_031);
}
cylinder_031Group.setRot(1.5708, 0.0, 0.0);
cylinder_031Group.position.set(-4.4057, 3.8477, -1.5809);
var cylinder_032Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_032Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_032 = new THREE.Mesh(cylinder_032Geometry, MetalMat);
 cylinder_032.scale.set(0.0483, 0.033, 0.0483);
 cylinder_032.position.set(6.4283 * i, 0, 0);
 cylinder_032Group.add(cylinder_032);
}
cylinder_032Group.setRot(1.5708, 0.0, 0.0);
cylinder_032Group.position.set(-4.4057, 3.8477, -1.787);
var cylinder_033Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_033Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_033 = new THREE.Mesh(cylinder_033Geometry, MetalMat);
 cylinder_033.scale.set(0.0543, 0.0831, 0.0543);
 cylinder_033.position.set(6.4289 * i, 0, 0);
 cylinder_033Group.add(cylinder_033);
}
cylinder_033Group.position.set(-4.4057, 3.2062, -1.3034);
var cube_327Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_327 = new THREE.Mesh(cube_327Geometry, Green_PictureMat);
cube_327.position.set(-4.8635, 4.8871, -2.3676);
cube_327.scale.set(0.5148, 0.0124, 0.5964);
cube_327.setRot(1.5708, 0.0, 0.0);
var cube_328Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_328 = new THREE.Mesh(cube_328Geometry, YellowMat);
cube_328.position.set(7.984, 4.8871, -2.3676);
cube_328.scale.set(0.5148, 0.0124, 0.5964);
cube_328.setRot(1.5708, 0.0, 0.0);
var cube_329Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_329Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_329 = new THREE.Mesh(cube_329Geometry, Floor_CentralMat);
 cube_329.scale.set(0.0702, 0.2701, 0.4985);
 cube_329.position.set(6.4288 * i, 0, 0);
 cube_329Group.add(cube_329);
}
cube_329Group.setRot(0.0, 3.1416, 0.0);
cube_329Group.position.set(8.4518, 2.5756, 1.8774);
var cube_330Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_330Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_330 = new THREE.Mesh(cube_330Geometry, Floor_CentralMat);
 cube_330.scale.set(0.0702, 0.1597, 0.5837);
 cube_330.position.set(6.4288 * i, 0, 0);
 cube_330Group.add(cube_330);
}
cube_330Group.setRot(0.0, 3.1416, 0.0);
cube_330Group.position.set(8.4518, 3.0054, 1.7922);
var cube_331Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_331Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_331 = new THREE.Mesh(cube_331Geometry, Floor_CentralMat);
 cube_331.scale.set(0.0702, 0.1597, 0.2747);
 cube_331.position.set(6.4288 * i, 0, 0);
 cube_331Group.add(cube_331);
}
cube_331Group.setRot(1.5708, 3.1416, 0.0);
cube_331Group.position.set(8.4518, 3.4397, 2.2163);
var cube_332Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_332Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_332 = new THREE.Mesh(cube_332Geometry, Floor_CentralMat);
 cube_332.scale.set(0.0702, 0.1264, 0.2747);
 cube_332.position.set(6.4288 * i, 0, 0);
 cube_332Group.add(cube_332);
}
cube_332Group.setRot(3.1416, 3.1416, 0.0);
cube_332Group.position.set(8.4518, 3.8408, 2.1012);
var cube_333Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_333Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_333 = new THREE.Mesh(cube_333Geometry, Floor_CentralMat);
 cube_333.scale.set(0.0702, 0.1264, 0.3091);
 cube_333.position.set(6.4288 * i, 0, 0);
 cube_333Group.add(cube_333);
}
cube_333Group.setRot(1.9635, 3.1416, 0.0);
cube_333Group.position.set(8.4518, 3.4772, 2.0616);
var cube_334Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_334Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_334 = new THREE.Mesh(cube_334Geometry, Floor_CentralMat);
 cube_334.scale.set(0.0702, 0.1519, 0.4307);
 cube_334.position.set(6.4288 * i, 0, 0);
 cube_334Group.add(cube_334);
}
cube_334Group.setRot(0.3405, 3.1416, 0.0);
cube_334Group.position.set(8.4518, 3.1657, 1.6652);
var cube_335Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_335Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_335 = new THREE.Mesh(cube_335Geometry, Floor_CentralMat);
 cube_335.scale.set(0.0702, 0.1519, 0.2855);
 cube_335.position.set(6.4288 * i, 0, 0);
 cube_335Group.add(cube_335);
}
cube_335Group.setRot(1.8909, 3.1416, 0.0);
cube_335Group.position.set(8.4518, 2.6225, 1.4425);
var cube_336Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_336Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_336 = new THREE.Mesh(cube_336Geometry, Floor_CentralMat);
 cube_336.scale.set(0.0702, 0.2701, 0.4985);
 cube_336.position.set(6.4288 * i, 0, 0);
 cube_336Group.add(cube_336);
}
cube_336Group.setRot(0.0, 3.1416, 0.0);
cube_336Group.position.set(4.4491, 2.5756, 1.8774);
var cube_337Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_337Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_337 = new THREE.Mesh(cube_337Geometry, Floor_CentralMat);
 cube_337.scale.set(0.0702, 0.1597, 0.5837);
 cube_337.position.set(6.4288 * i, 0, 0);
 cube_337Group.add(cube_337);
}
cube_337Group.setRot(0.0, 3.1416, 0.0);
cube_337Group.position.set(4.4491, 3.0054, 1.7922);
var cube_338Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_338Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_338 = new THREE.Mesh(cube_338Geometry, Floor_CentralMat);
 cube_338.scale.set(0.0702, 0.1597, 0.2747);
 cube_338.position.set(6.4288 * i, 0, 0);
 cube_338Group.add(cube_338);
}
cube_338Group.setRot(1.5708, 3.1416, 0.0);
cube_338Group.position.set(4.4491, 3.4397, 2.2163);
var cube_339Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_339Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_339 = new THREE.Mesh(cube_339Geometry, Floor_CentralMat);
 cube_339.scale.set(0.0702, 0.1264, 0.2747);
 cube_339.position.set(6.4288 * i, 0, 0);
 cube_339Group.add(cube_339);
}
cube_339Group.setRot(3.1416, 3.1416, 0.0);
cube_339Group.position.set(4.4491, 3.8408, 2.1012);
var cube_340Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_340Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_340 = new THREE.Mesh(cube_340Geometry, Floor_CentralMat);
 cube_340.scale.set(0.0702, 0.1264, 0.3091);
 cube_340.position.set(6.4288 * i, 0, 0);
 cube_340Group.add(cube_340);
}
cube_340Group.setRot(1.9635, 3.1416, 0.0);
cube_340Group.position.set(4.4491, 3.4772, 2.0616);
var cube_341Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_341Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_341 = new THREE.Mesh(cube_341Geometry, Floor_CentralMat);
 cube_341.scale.set(0.0702, 0.1519, 0.4307);
 cube_341.position.set(6.4288 * i, 0, 0);
 cube_341Group.add(cube_341);
}
cube_341Group.setRot(0.3405, 3.1416, 0.0);
cube_341Group.position.set(4.4491, 3.1657, 1.6652);
var cube_342Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_342Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_342 = new THREE.Mesh(cube_342Geometry, Floor_CentralMat);
 cube_342.scale.set(0.0702, 0.1519, 0.2855);
 cube_342.position.set(6.4288 * i, 0, 0);
 cube_342Group.add(cube_342);
}
cube_342Group.setRot(1.8909, 3.1416, 0.0);
cube_342Group.position.set(4.4491, 2.6225, 1.4425);
var cylinder_034Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_034Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_034 = new THREE.Mesh(cylinder_034Geometry, MetalMat);
 cylinder_034.scale.set(0.039, 0.4636, 0.039);
 cylinder_034.position.set(6.4289 * i, 0, 0);
 cylinder_034Group.add(cylinder_034);
}
cylinder_034Group.setRot(0.0, 3.1416, 0.0);
cylinder_034Group.position.set(8.4518, 3.6063, 1.31);
var cylinder_035Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_035Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_035 = new THREE.Mesh(cylinder_035Geometry, MetalMat);
 cylinder_035.scale.set(0.039, 0.2801, 0.039);
 cylinder_035.position.set(6.4297 * i, 0, 0);
 cylinder_035Group.add(cylinder_035);
}
cylinder_035Group.setRot(1.5708, 3.1416, 0.0);
cylinder_035Group.position.set(8.4518, 3.8477, 1.5875);
var cylinder_036Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_036Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_036 = new THREE.Mesh(cylinder_036Geometry, MetalMat);
 cylinder_036.scale.set(0.0483, 0.033, 0.0483);
 cylinder_036.position.set(6.4293 * i, 0, 0);
 cylinder_036Group.add(cylinder_036);
}
cylinder_036Group.setRot(1.5708, 3.1416, 0.0);
cylinder_036Group.position.set(8.4518, 3.8477, 1.7936);
var cylinder_037Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_037Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_037 = new THREE.Mesh(cylinder_037Geometry, MetalMat);
 cylinder_037.scale.set(0.0543, 0.0831, 0.0543);
 cylinder_037.position.set(6.4289 * i, 0, 0);
 cylinder_037Group.add(cylinder_037);
}
cylinder_037Group.setRot(0.0, 3.1416, 0.0);
cylinder_037Group.position.set(8.4518, 3.2062, 1.31);
var sphere_005Geometry = new THREE.SphereGeometry(1, 32, 16);
var sphere_005Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var sphere_005 = new THREE.Mesh(sphere_005Geometry, MetalMat);
 sphere_005.scale.set(0.0552, 0.0552, 0.0552);
 sphere_005.position.set(6.4265 * i, 0, 0);
 sphere_005Group.add(sphere_005);
}
sphere_005Group.setRot(0.0, 3.1416, 0.0);
sphere_005Group.position.set(8.4518, 4.0978, 1.31);
var cylinder_038Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_038Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_038 = new THREE.Mesh(cylinder_038Geometry, MetalMat);
 cylinder_038.scale.set(0.039, 0.5356, 0.039);
 cylinder_038.position.set(6.4297 * i, 0, 0);
 cylinder_038Group.add(cylinder_038);
}
cylinder_038Group.setRot(1.5708, 3.1416, 0.0);
cylinder_038Group.position.set(4.4491, 4.0978, 1.8429);
var cylinder_040Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_040Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_040 = new THREE.Mesh(cylinder_040Geometry, MetalMat);
 cylinder_040.scale.set(0.039, 0.5356, 0.039);
 cylinder_040.position.set(6.4297 * i, 0, 0);
 cylinder_040Group.add(cylinder_040);
}
cylinder_040Group.setRot(1.5708, 3.1416, 0.0);
cylinder_040Group.position.set(8.4518, 4.0978, 1.8429);
var cylinder_041Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_041Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_041 = new THREE.Mesh(cylinder_041Geometry, MetalMat);
 cylinder_041.scale.set(0.0508, 0.0545, 0.0508);
 cylinder_041.position.set(6.4289 * i, 0, 0);
 cylinder_041Group.add(cylinder_041);
}
cylinder_041Group.setRot(1.5708, 3.1416, 0.0);
cylinder_041Group.position.set(4.4491, 4.0978, 2.3241);
var sphere_006Geometry = new THREE.SphereGeometry(1, 32, 16);
var sphere_006Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var sphere_006 = new THREE.Mesh(sphere_006Geometry, MetalMat);
 sphere_006.scale.set(0.0552, 0.0552, 0.0552);
 sphere_006.position.set(6.4309 * i, 0, 0);
 sphere_006Group.add(sphere_006);
}
sphere_006Group.setRot(0.0, 3.1416, 0.0);
sphere_006Group.position.set(4.4491, 4.0978, 1.31);
var cube_343Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_343Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_343 = new THREE.Mesh(cube_343Geometry, Green_PictureMat);
 cube_343.scale.set(2.0087, 0.071, 0.5573);
 cube_343.position.set(6.4279 * i, 0, 0);
 cube_343Group.add(cube_343);
}
cube_343Group.setRot(3.1416, 3.1416, 0.0);
cube_343Group.position.set(6.4504, 3.067, 1.8337);
var cube_344Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_344Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_344 = new THREE.Mesh(cube_344Geometry, Green_PictureMat);
 cube_344.scale.set(2.0087, 0.071, 0.4356);
 cube_344.position.set(6.4279 * i, 0, 0);
 cube_344Group.add(cube_344);
}
cube_344Group.setRot(4.465, 3.1416, 0.0);
cube_344Group.position.set(6.4504, 3.4491, 2.2104);
var cube_345Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_345Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_345 = new THREE.Mesh(cube_345Geometry, Floor_CentralMat);
 cube_345.scale.set(2.0087, 0.071, 0.4033);
 cube_345.position.set(6.4279 * i, 0, 0);
 cube_345Group.add(cube_345);
}
cube_345Group.setRot(1.8968, 3.1416, 0.0);
cube_345Group.position.set(6.4504, 2.6874, 1.5059);
var cylinder_042Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_042Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_042 = new THREE.Mesh(cylinder_042Geometry, MetalMat);
 cylinder_042.scale.set(0.039, 0.4636, 0.039);
 cylinder_042.position.set(6.4289 * i, 0, 0);
 cylinder_042Group.add(cylinder_042);
}
cylinder_042Group.setRot(0.0, 3.1416, 0.0);
cylinder_042Group.position.set(4.4491, 3.6063, 1.31);
var cylinder_043Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_043Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_043 = new THREE.Mesh(cylinder_043Geometry, MetalMat);
 cylinder_043.scale.set(0.039, 0.2801, 0.039);
 cylinder_043.position.set(6.4297 * i, 0, 0);
 cylinder_043Group.add(cylinder_043);
}
cylinder_043Group.setRot(1.5708, 3.1416, 0.0);
cylinder_043Group.position.set(4.4491, 3.8477, 1.5875);
var cylinder_044Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_044Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_044 = new THREE.Mesh(cylinder_044Geometry, MetalMat);
 cylinder_044.scale.set(0.0483, 0.033, 0.0483);
 cylinder_044.position.set(6.4283 * i, 0, 0);
 cylinder_044Group.add(cylinder_044);
}
cylinder_044Group.setRot(1.5708, 3.1416, 0.0);
cylinder_044Group.position.set(4.4491, 3.8477, 1.7936);
var cylinder_045Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_045Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cylinder_045 = new THREE.Mesh(cylinder_045Geometry, MetalMat);
 cylinder_045.scale.set(0.0543, 0.0831, 0.0543);
 cylinder_045.position.set(6.4289 * i, 0, 0);
 cylinder_045Group.add(cylinder_045);
}
cylinder_045Group.setRot(0.0, 3.1416, 0.0);
cylinder_045Group.position.set(4.4491, 3.2062, 1.31);
var cube_346Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_346 = new THREE.Mesh(cube_346Geometry, YellowMat);
cube_346.position.set(1.5609, 4.8871, 2.3723);
cube_346.scale.set(0.5148, 0.0124, 0.5964);
cube_346.setRot(1.5708, 0.0, 0.0);
var cube_347Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_347 = new THREE.Mesh(cube_347Geometry, WhiteDotsMat);
cube_347.position.set(0.0113, 5.8328, -2.3649);
cube_347.scale.set(1.973, 0.0148, 0.1951);
cube_347.setRot(1.5708, 0.0, 0.0);
var cylinder_046Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_046 = new THREE.Mesh(cylinder_046Geometry, PurpleMat);
cylinder_046.position.set(-1.7525, 5.8328, -2.3461);
cylinder_046.scale.set(0.1498, 0.0122, 0.1498);
cylinder_046.setRot(1.5708, 0.0, 0.0);
var cube_348Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_348 = new THREE.Mesh(cube_348Geometry, PurpleMat);
cube_348.position.set(0.0113, 5.8328, -2.3606);
cube_348.scale.set(1.8175, 0.0148, 0.0586);
cube_348.setRot(1.5708, 0.0, 0.0);
var cylinder_047Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_047 = new THREE.Mesh(cylinder_047Geometry, Green_PictureMat);
cylinder_047.position.set(0.5851, 5.8328, -2.3461);
cylinder_047.scale.set(0.1489, 0.0121, 0.1489);
cylinder_047.setRot(1.6353, 0.0, -4.7124);
var cylinder_048Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_048 = new THREE.Mesh(cylinder_048Geometry, YellowMat);
cylinder_048.position.set(-0.5837, 5.8328, -2.3461);
cylinder_048.scale.set(0.1489, 0.0121, 0.1489);
cylinder_048.setRot(1.4952, 0.0, -1.5708);
var cube_349Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_349 = new THREE.Mesh(cube_349Geometry, WhiteDotsMat);
cube_349.position.set(6.4755, 5.8328, 2.3389);
cube_349.scale.set(1.973, 0.0148, 0.1951);
cube_349.setRot(1.5708, 3.1416, 0.0);
var cylinder_049Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_049 = new THREE.Mesh(cylinder_049Geometry, PurpleMat);
cylinder_049.position.set(8.2393, 5.8328, 2.3201);
cylinder_049.scale.set(0.1498, 0.0122, 0.1498);
cylinder_049.setRot(1.5708, 3.1416, 0.0);
var cube_350Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_350 = new THREE.Mesh(cube_350Geometry, PurpleMat);
cube_350.position.set(6.4755, 5.8328, 2.3346);
cube_350.scale.set(1.8175, 0.0148, 0.0586);
cube_350.setRot(1.5708, 3.1416, 0.0);
var cylinder_050Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_050 = new THREE.Mesh(cylinder_050Geometry, Green_PictureMat);
cylinder_050.position.set(5.9017, 5.8328, 2.3201);
cylinder_050.scale.set(0.1489, 0.0121, 0.1489);
cylinder_050.setRot(4.7769, 0.0, -4.7124);
var cylinder_051Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_051 = new THREE.Mesh(cylinder_051Geometry, YellowMat);
cylinder_051.position.set(7.0705, 5.8328, 2.3201);
cylinder_051.scale.set(0.1489, 0.0121, 0.1489);
cylinder_051.setRot(-1.6464, 0.0, -1.5708);
var cube_351Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_351 = new THREE.Mesh(cube_351Geometry, WhiteDotsMat);
cube_351.position.set(-6.4193, 5.8328, 2.3389);
cube_351.scale.set(1.973, 0.0148, 0.1951);
cube_351.setRot(1.5708, 3.1416, 0.0);
var cylinder_052Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_052 = new THREE.Mesh(cylinder_052Geometry, PurpleMat);
cylinder_052.position.set(-4.6554, 5.8328, 2.3201);
cylinder_052.scale.set(0.1498, 0.0122, 0.1498);
cylinder_052.setRot(1.5708, 3.1416, 0.0);
var cube_352Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_352 = new THREE.Mesh(cube_352Geometry, PurpleMat);
cube_352.position.set(-6.4193, 5.8328, 2.3346);
cube_352.scale.set(1.8175, 0.0148, 0.0586);
cube_352.setRot(1.5708, 3.1416, 0.0);
var cylinder_053Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_053 = new THREE.Mesh(cylinder_053Geometry, Green_PictureMat);
cylinder_053.position.set(-6.993, 5.8328, 2.3201);
cylinder_053.scale.set(0.1489, 0.0121, 0.1489);
cylinder_053.setRot(4.7769, 0.0, -4.7124);
var cylinder_054Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_054 = new THREE.Mesh(cylinder_054Geometry, YellowMat);
cylinder_054.position.set(-5.8242, 5.8328, 2.3201);
cylinder_054.scale.set(0.1489, 0.0121, 0.1489);
cylinder_054.setRot(-1.6464, 0.0, -1.5708);
var cylinder_055Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_055 = new THREE.Mesh(cylinder_055Geometry, MetalMat);
cylinder_055.position.set(0.0127, 6.1242, -0.7744);
cylinder_055.scale.set(0.039, 12.4875, 0.039);
cylinder_055.setRot(1.5708, 1.5708, 0.0);
var cylinder_056Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_056 = new THREE.Mesh(cylinder_056Geometry, MetalMat);
cylinder_056.position.set(0.0127, 6.1242, 0.786);
cylinder_056.scale.set(0.039, 12.4875, 0.039);
cylinder_056.setRot(1.5708, 1.5708, 0.0);
var cylinder_057Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_057Group = new THREE.Group();
for (var i = 0; i < 5; i++) {
 var cylinder_057 = new THREE.Mesh(cylinder_057Geometry, MetalMat);
 cylinder_057.scale.set(0.0389, 0.2166, 0.0389);
 cylinder_057.position.set(5.5554 * i, 0, 0);
 cylinder_057Group.add(cylinder_057);
}
cylinder_057Group.position.set(-10.8298, 6.3231, -0.7744);
var cylinder_058Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_058Group = new THREE.Group();
for (var i = 0; i < 5; i++) {
 var cylinder_058 = new THREE.Mesh(cylinder_058Geometry, MetalMat);
 cylinder_058.scale.set(0.0389, 0.2162, 0.0389);
 cylinder_058.position.set(5.5456 * i, 0, 0);
 cylinder_058Group.add(cylinder_058);
}
cylinder_058Group.position.set(-10.8298, 6.3231, 0.7876);
var cube_353Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_353 = new THREE.Mesh(cube_353Geometry, FloorTileMat);
cube_353.position.set(0.0127, 6.3994, 1.6559);
cube_353.scale.set(12.5105, 0.1214, 0.8001);
cube_353.setRot(-0.2859, 3.1416, 0.0);
var cube_116Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_116 = new THREE.Mesh(cube_116Geometry, FloorTileMat);
cube_116.position.set(0.0127, 6.725, 0.7325);
cube_116.scale.set(12.5105, 0.1214, 0.2164);
cube_116.setRot(1.5708, 0.0, 0.0);
var cube_145Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_145 = new THREE.Mesh(cube_145Geometry, Green_PictureMat);
cube_145.position.set(0.0127, 6.725, 0.6138);
cube_145.scale.set(12.4539, 0.0107, 0.1974);
cube_145.setRot(1.5708, 0.0, 0.0);
var out = new THREE.Group();
out.add(train_base, wheel_hold_u, cyl_Group, sphere_002Group, cube_310Group, wheel_balkaGroup, cube_312Group, cube_313Group, cube_314Group, cube_315Group, cube_316Group, cube_317Group, cube_318Group, cube_319Group, cube_320Group, cube_321Group, cube_322Group, cube_323Group, cylinder_022Group, cylinder_023Group, cylinder_024Group, cylinder_025Group, sphere_003Group, cylinder_026Group, cylinder_027Group, cylinder_028Group, cylinder_029Group, sphere_004Group, cube_324Group, cube_325Group, cube_326Group, cylinder_030Group, cylinder_031Group, cylinder_032Group, cylinder_033Group, cube_327, cube_328, cube_329Group, cube_330Group, cube_331Group, cube_332Group, cube_333Group, cube_334Group, cube_335Group, cube_336Group, cube_337Group, cube_338Group, cube_339Group, cube_340Group, cube_341Group, cube_342Group, cylinder_034Group, cylinder_035Group, cylinder_036Group, cylinder_037Group, sphere_005Group, cylinder_038Group, cylinder_040Group, cylinder_041Group, sphere_006Group, cube_343Group, cube_344Group, cube_345Group, cylinder_042Group, cylinder_043Group, cylinder_044Group, cylinder_045Group, cube_346, cube_347, cylinder_046, cube_348, cylinder_047, cylinder_048, cube_349, cylinder_049, cube_350, cylinder_050, cylinder_051, cube_351, cylinder_052, cube_352, cylinder_053, cylinder_054, cylinder_055, cylinder_056, cylinder_057Group, cylinder_058Group, cube_353, cube_116, cube_145);
return out;
}
function DrawVagon() {

var YellowMat = new THREE.MeshStandardMaterial({color: new THREE.Color(1.0, 0.5225, 0)});
var Train_blueMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0.0343, 0.1009, 0.652),roughness: 0.5});
var GlassMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0.2227, 0.241, 0.3264),transparent: true,opacity: 0.32,roughness: 0.5});
var Ceiling_trainMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0.3757, 0.298, 0.0955),roughness:0.12,});

function DrawWheelBase(){
//колёсо
var geo = new THREE.CylinderGeometry(1,1,2,12);
var wheel_white = new THREE.Mesh(geo, RoofTilesMat);
var wheel_black = new THREE.Mesh(geo, ColonaMat);
    wheel_black.scale.set(0.8,0.1,0.8);  wheel_black.rotation.x = PI/2;
    wheel_white.scale.set(0.5,0.1,0.5);  wheel_white.rotation.x = PI/2; 
    wheel_white.position.z = -0.1;
var wheel = new THREE.Group();  wheel.add(wheel_black,wheel_white);
    wheel.position.set(0,0.8, -1.1);
//поддержка колес
var geo = new THREE.BoxGeometry(2,2,2);
var wheel_hold_p = new THREE.Mesh(geo, ColonaMat);
var wheel_hold_u = new THREE.Mesh(geo, ColonaMat);
    wheel_hold_u.scale.set(0.2,0.4,0.2); wheel_hold_u.position.y =  0.4; 
    wheel_hold_p.scale.set(0.2,0.2,0.5); wheel_hold_p.position.z = -0.35; 
    wheel_hold_p.rotation.x = -PI/9;
var stoika = new THREE.Group(); stoika.add(wheel_hold_u,wheel_hold_p);
    stoika.position.set(0,0.9,-0.1);
//колесо с креплением
var wheel_full = new THREE.Group();    wheel_full.add(wheel, stoika);
    wheel_full.position.set(2,0,1);
var wheel_full_1 = wheel_full.clone(); wheel_full_1.position.x = -2;
//балка соединяющая колёса
var wheel_balka = new THREE.Mesh(geo, ColonaMat);
    wheel_balka.position.set(0,0.8,0.15);
    wheel_balka.scale.set(3,0.15,0.1);
//рейка колёс, прилегающая к корпусу
var wheel_balka_top = new THREE.Mesh(geo, ColonaMat);
    wheel_balka_top.position.set(0,1.7,-0.4);
    wheel_balka_top.scale.set(3,0.2,0.1);
//лицевая балка крепления колёс
var wheel_balka_fr = new THREE.Mesh(geo, ColonaMat);
    wheel_balka_fr.position.y = 0.8;
    wheel_balka_fr.scale.set(1,0.2,0.1);
//цилиндры у блока колёс
var geo = new THREE.CylinderGeometry(0.2,0.2,1.1,6,1,true);
var cyl_gr = new THREE.Group();
    for (var i = 0; i < 3; i++) {
    var cyl = new THREE.Mesh(geo, ColonaMat);
    cyl.position.x = 0.5*i;
    cyl_gr.add(cyl);
}cyl_gr.position.set(-0.5,1,0);
//Половина колёсной базы
var wheel_base_half = new THREE.Group(); wheel_base_half.position.z = -2;
    wheel_base_half.add(wheel_full,wheel_full_1,wheel_balka,wheel_balka_top,wheel_balka_fr,cyl_gr);
var wheel_base_half_1 = wheel_base_half.clone(); wheel_base_half_1.rotation.x = PI;
    wheel_base_half_1.position.z = 2; wheel_base_half_1.scale.y = -1;
//Сборка всего и юст
var wheel_base = new THREE.Group();
var WS = 1; wheel_base.scale.set(WS,WS,WS);
    wheel_base.add(wheel_base_half,wheel_base_half_1);
return wheel_base;
}

var wheel_base_1 = DrawWheelBase();
    wheel_base_1.position.x = -8.5;

var wheel_base_2 = DrawWheelBase();
    wheel_base_2.position.x =  9;

var geo = new THREE.BoxGeometry(2, 2, 2);
var train_base = new THREE.Mesh(geo, Blue_PictureMat);
    train_base.position.set(0,1.97,0);
    train_base.scale.set(12.58, 0.26, 2.47);

var geo = new THREE.BoxGeometry(2,2,2);

//train part
var cube_326 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_326.scale.set(0.9318, 0.051, 2.4701);
    cube_326.setRot(1.5708, 0.0, 0.0);
var cube_326MZ = cube_326.clone();
    cube_326MZ.updateMatrixWorld(true);
    cube_326.position.set(0, 0, -2.4192);
    cube_326MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_326MZ.position.set(0, 0, 2.4191);
var cube_326MirroredZ = new THREE.Group();
    cube_326MirroredZ.add(cube_326, cube_326MZ);
    cube_326MirroredZ.position.set(-11.6586, 4.7166, 0);
//train part
var cube_327 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_327.scale.set(0.8412, 0.0446, 0.9062);
    cube_327.setRot(1.5708, 1.5708, 0.0);
var cube_327MZ = cube_327.clone();
    cube_327MZ.updateMatrixWorld(true);
    cube_327.position.set(0, 0, -1.527);
    cube_327MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_327MZ.position.set(0, 0, 1.5269);
var cube_327MirroredZ = new THREE.Group();
    cube_327MirroredZ.add(cube_327, cube_327MZ);
    cube_327MirroredZ.position.set(-12.5457, 3.1527, 0);
//train part (lights)
var cylinder_022Geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_022 = new THREE.Mesh(cylinder_022Geometry, YellowMat);
    cylinder_022.scale.set(0.3106, 0.044, 0.3106);
    cylinder_022.setRot(0.0, 0.0, -1.5708);
var cylinder_022MZ = cylinder_022.clone();
    cylinder_022MZ.updateMatrixWorld(true);
    cylinder_022.position.set(0, 0, -1.527);
    cylinder_022MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_022MZ.position.set(0, 0, 1.5269);
var cylinder_022MirroredZ = new THREE.Group();
    cylinder_022MirroredZ.add(cylinder_022, cylinder_022MZ);
    cylinder_022MirroredZ.position.set(-12.593, 3.1527, 0);
//train part (back lights)
var geo = new THREE.SphereGeometry(1, 32, 16);
var sphere_002 = new THREE.Mesh(geo, RoofTilesMat);
    sphere_002.scale.set(0.2749, 0.0831, 0.2749);
    sphere_002.setRot(0.0, 0.0, -1.5708);
var sphere_002MZ = sphere_002.clone();
    sphere_002MZ.updateMatrixWorld(true);
    sphere_002.position.set(0, 0, -1.527);
    sphere_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    sphere_002MZ.position.set(0, 0, 1.5269);
var sphere_002MirroredZ = new THREE.Group();
    sphere_002MirroredZ.add(sphere_002, sphere_002MZ);
    sphere_002MirroredZ.position.set(-12.6391, 3.1527, 0);
//train part
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_328 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_328.scale.set(0.1275, 0.0446, 0.9062);
    cube_328.setRot(1.5708, 1.5708, 0.0);
var cube_328MZ = cube_328.clone();
    cube_328MZ.updateMatrixWorld(true);
    cube_328.position.set(0, 0, -2.2407);
    cube_328MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_328MZ.position.set(0, 0, 2.2406);
var cube_328MirroredZ = new THREE.Group();
    cube_328MirroredZ.add(cube_328, cube_328MZ);
    cube_328MirroredZ.position.set(-12.5457, 4.965, 0);
//train part
var cube_329 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_329.scale.set(0.1275, 0.0446, 0.9062);
    cube_329.setRot(1.5708, 1.5708, 0.0);
var cube_329MZ = cube_329.clone();
    cube_329MZ.updateMatrixWorld(true);
    cube_329.position.set(0, 0, -0.8133);
    cube_329MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_329MZ.position.set(0, 0, 0.8132);
var cube_329MirroredZ = new THREE.Group();
    cube_329MirroredZ.add(cube_329, cube_329MZ);
    cube_329MirroredZ.position.set(-12.5457, 4.965, 0);
//train part
var cube_330 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_330.scale.set(0.8412, 0.0446, 0.681);
    cube_330.setRot(1.5708, 1.5708, 0.0);
var cube_330MZ = cube_330.clone();
    cube_330MZ.updateMatrixWorld(true);
    cube_330.position.set(0, 0, -1.527);
    cube_330MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_330MZ.position.set(0, 0, 1.5269);
var cube_330MirroredZ = new THREE.Group();
    cube_330MirroredZ.add(cube_330, cube_330MZ);
    cube_330MirroredZ.position.set(-12.5457, 6.5057, 0);

//train part
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_331 = new THREE.Mesh(geo, Train_blueMat);
    cube_331.position.set(-12.5457, 3.1527, -0.0);
    cube_331.scale.set(0.7058, 0.0351, 0.9062);
    cube_331.setRot(1.5708, 1.5708, 0.0);

var cube_332 = new THREE.Mesh(geo, Train_blueMat);
    cube_332.position.set(-12.5457, 4.9776, -0.5792);
    cube_332.scale.set(0.1266, 0.0351, 0.9188);
    cube_332.setRot(1.5708, 1.5708, 0.0);

var cube_333 = new THREE.Mesh(geo, Train_blueMat);
    cube_333.position.set(-12.5457, 6.4998, -0.0);
    cube_333.scale.set(0.7058, 0.0351, 0.6869);
    cube_333.setRot(1.5708, 1.5708, 0.0);

var cube_334 = new THREE.Mesh(geo, ColonaMat);
    cube_334.scale.set(0.1434, 0.0309, 0.1545);
    cube_334.setRot(1.5708, 1.5708, 0.7854);
var cube_334MZ = cube_334.clone();
    cube_334MZ.updateMatrixWorld(true);
    cube_334.position.set(0, 0, -0.9277);
    cube_334MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_334MZ.position.set(0, 0, 0.9276);
var cube_334MirroredZ = new THREE.Group();
    cube_334MirroredZ.add(cube_334, cube_334MZ);
var cube_334MirroredZMY = cube_334MirroredZ.clone();
    cube_334MirroredZMY.updateMatrixWorld(true);
    cube_334MirroredZ.position.set(0, 4.0498, 0);
    cube_334MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_334MirroredZMY.position.set(0, 5.827, 0);
var cube_334MirroredZMirroredY = new THREE.Group();
    cube_334MirroredZMirroredY.add(cube_334MirroredZ, cube_334MirroredZMY);
    cube_334MirroredZMirroredY.position.set(-12.5457, 0, 0);

var cube_335 = new THREE.Mesh(geo, GlassMat);
cube_335.scale.set(-0.0151, 1.0, 0.7144);

var cube_335MZ = cube_335.clone();
    cube_335MZ.updateMatrixWorld(true);
    cube_335.position.set(0, 0, -1.527);
    cube_335MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_335MZ.position.set(0, 0, 1.5269);
var cube_335MirroredZ = new THREE.Group();
    cube_335MirroredZ.add(cube_335, cube_335MZ);
    cube_335MirroredZ.position.set(-12.5457, 4.9411, 0);

var cube_336 = new THREE.Mesh(geo, ColonaMat);
    cube_336.scale.set(0.4607, 0.0309, 0.0226);
    cube_336.setRot(1.5708, 1.5708, -0.0);
var cube_336MZ = cube_336.clone();
    cube_336MZ.updateMatrixWorld(true);
    cube_336.position.set(0, 0, -1.527);
    cube_336MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_336MZ.position.set(0, 0, 1.5269);
var cube_336MirroredZ = new THREE.Group();
    cube_336MirroredZ.add(cube_336, cube_336MZ);
var cube_336MirroredZMY = cube_336MirroredZ.clone();
    cube_336MirroredZMY.updateMatrixWorld(true);
    cube_336MirroredZ.position.set(0, 4.0617, 0);
    cube_336MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_336MirroredZMY.position.set(0, 5.815, 0);
var cube_336MirroredZMirroredY = new THREE.Group();
    cube_336MirroredZMirroredY.add(cube_336MirroredZ, cube_336MirroredZMY);
    cube_336MirroredZMirroredY.position.set(-12.5457, 0, 0);

var cube_337 = new THREE.Mesh(geo, ColonaMat);
    cube_337.scale.set(0.7643, 0.0309, 0.0226);
    cube_337.setRot(3.1416, 0.0, 1.5708);
var cube_337MX = cube_337.clone();
    cube_337MX.updateMatrixWorld(true);
    cube_337.position.set(-12.5457, 0, 0);
    cube_337MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    cube_337MX.position.set(-12.5457, 0, 0);
var cube_337MirroredX = new THREE.Group();
    cube_337MirroredX.add(cube_337, cube_337MX);
var cube_337MirroredXMZ = cube_337MirroredX.clone();
    cube_337MirroredXMZ.updateMatrixWorld(true);
    cube_337MirroredX.position.set(0, 0, -0.9381);
    cube_337MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_337MirroredXMZ.position.set(0, 0, 0.9381);
var cube_337MirroredXMirroredZ = new THREE.Group();
    cube_337MirroredXMirroredZ.add(cube_337MirroredX, cube_337MirroredXMZ);
var cube_337MirroredXMirroredZMY = cube_337MirroredXMirroredZ.clone();
    cube_337MirroredXMirroredZMY.updateMatrixWorld(true);
    cube_337MirroredXMirroredZ.position.set(0, 4.936, 0);
    cube_337MirroredXMirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_337MirroredXMirroredZMY.position.set(0, 4.9408, 0);
var cube_337MirroredXMirroredZMirroredY = new THREE.Group();
    cube_337MirroredXMirroredZMirroredY.add(cube_337MirroredXMirroredZ, cube_337MirroredXMirroredZMY);

var cube_338 = new THREE.Mesh(geo, GlassMat);
    cube_338.position.set(-12.5457, 4.9384, -0.0);
    cube_338.scale.set(-0.0151, 0.9645, 0.4812);

var cube_339 = new THREE.Mesh(geo, ColonaMat);
    cube_339.scale.set(0.1434, 0.0309, 0.1545);
    cube_339.setRot(1.5708, 1.5708, 0.7854);
var cube_339MZ = cube_339.clone();
    cube_339MZ.updateMatrixWorld(true);
    cube_339.position.set(0, 0, 0.4478);
    cube_339MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_339MZ.position.set(0, 0, -0.4478);
var cube_339MirroredZ = new THREE.Group();
    cube_339MirroredZ.add(cube_339, cube_339MZ);
var cube_339MirroredZMY = cube_339MirroredZ.clone();
    cube_339MirroredZMY.updateMatrixWorld(true);
    cube_339MirroredZ.position.set(0, 4.0693, 0);
    cube_339MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_339MirroredZMY.position.set(0, 5.8075, 0);
var cube_339MirroredZMirroredY = new THREE.Group();
    cube_339MirroredZMirroredY.add(cube_339MirroredZ, cube_339MirroredZMY);
    cube_339MirroredZMirroredY.position.set(-12.5457, 0, 0);

var cube_340 = new THREE.Mesh(geo, ColonaMat);
    cube_340.scale.set(0.4607, 0.0309, 0.0226);
    cube_340.setRot(1.5708, 1.5708, -0.0);
var cube_340MY = cube_340.clone();
    cube_340MY.updateMatrixWorld(true);
    cube_340.position.set(0, 4.0568, 0);
    cube_340MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_340MY.position.set(0, 5.82, 0);
var cube_340MirroredY = new THREE.Group();
    cube_340MirroredY.add(cube_340, cube_340MY);
    cube_340MirroredY.position.set(-12.5457, 0, -0.0);

var cube_341 = new THREE.Mesh(geo, ColonaMat);
    cube_341.scale.set(0.7643, 0.0309, 0.0226);
    cube_341.setRot(3.1416, 0.0, 1.5708);
var cube_341MZ = cube_341.clone();
    cube_341MZ.updateMatrixWorld(true);
    cube_341.position.set(0, 0, 0.4584);
    cube_341MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_341MZ.position.set(0, 0, -0.4584);
var cube_341MirroredZ = new THREE.Group();
    cube_341MirroredZ.add(cube_341, cube_341MZ);
    cube_341MirroredZ.position.set(-12.5457, 4.9303, 0);

var cube_342 = new THREE.Mesh(geo, ColonaMat);
    cube_342.scale.set(0.7643, 0.0309, 0.0226);
    cube_342.setRot(3.1416, 0.0, 1.5708);
var cube_342MX = cube_342.clone();
    cube_342MX.updateMatrixWorld(true);
    cube_342.position.set(-12.5457, 0, 0);
    cube_342MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    cube_342MX.position.set(-12.5457, 0, 0);
var cube_342MirroredX = new THREE.Group();
    cube_342MirroredX.add(cube_342, cube_342MX);
var cube_342MirroredXMZ = cube_342MirroredX.clone();
    cube_342MirroredXMZ.updateMatrixWorld(true);
    cube_342MirroredX.position.set(0, 0, 2.1187);
    cube_342MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_342MirroredXMZ.position.set(0, 0, -2.1187);
var cube_342MirroredXMirroredZ = new THREE.Group();
    cube_342MirroredXMirroredZ.add(cube_342MirroredX, cube_342MirroredXMZ);
var cube_342MirroredXMirroredZMY = cube_342MirroredXMirroredZ.clone();
    cube_342MirroredXMirroredZMY.updateMatrixWorld(true);
    cube_342MirroredXMirroredZ.position.set(0, 4.936, 0);
    cube_342MirroredXMirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_342MirroredXMirroredZMY.position.set(0, 4.9408, 0);
var cube_342MirroredXMirroredZMirroredY = new THREE.Group();
    cube_342MirroredXMirroredZMirroredY.add(cube_342MirroredXMirroredZ, cube_342MirroredXMirroredZMY);

var cube_343 = new THREE.Mesh(geo, ColonaMat);
    cube_343.scale.set(0.1434, 0.0309, 0.1545);
    cube_343.setRot(1.5708, 1.5708, 0.7854);
var cube_343MZ = cube_343.clone();
    cube_343MZ.updateMatrixWorld(true);
    cube_343.position.set(0, 0, 2.1206);
    cube_343MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_343MZ.position.set(0, 0, -2.1207);
var cube_343MirroredZ = new THREE.Group();
    cube_343MirroredZ.add(cube_343, cube_343MZ);
var cube_343MirroredZMY = cube_343MirroredZ.clone();
    cube_343MirroredZMY.updateMatrixWorld(true);
    cube_343MirroredZ.position.set(0, 4.0498, 0);
    cube_343MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_343MirroredZMY.position.set(0, 5.827, 0);
var cube_343MirroredZMirroredY = new THREE.Group();
    cube_343MirroredZMirroredY.add(cube_343MirroredZ, cube_343MirroredZMY);
    cube_343MirroredZMirroredY.position.set(-12.5457, 0, 0);

var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_344 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_344.scale.set(-0.9318, 0.051, 2.4701);
    cube_344.setRot(1.5708, 0.0, 0.0);
var cube_344MZ = cube_344.clone();
    cube_344MZ.updateMatrixWorld(true);
    cube_344.position.set(0, 0, -2.4192);
    cube_344MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_344MZ.position.set(0, 0, 2.4191);
var cube_344MirroredZ = new THREE.Group();
    cube_344MirroredZ.add(cube_344, cube_344MZ);
    cube_344MirroredZ.position.set(11.6574, 4.7166, 0);

var cube_345 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_345.scale.set(0.8412, -0.0446, 0.9062);
    cube_345.setRot(1.5708, 1.5708, 0.0);
var cube_345MZ = cube_345.clone();
    cube_345MZ.updateMatrixWorld(true);
    cube_345.position.set(0, 0, -1.527);
    cube_345MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_345MZ.position.set(0, 0, 1.5269);
var cube_345MirroredZ = new THREE.Group();
    cube_345MirroredZ.add(cube_345, cube_345MZ);
    cube_345MirroredZ.position.set(12.5445, 3.1527, 0);
    
var geo = new THREE.CylinderGeometry(1, 1, 2, 32);
var cylinder_024 = new THREE.Mesh(geo, YellowMat);
    cylinder_024.scale.set(0.3106, -0.044, 0.3106);
    cylinder_024.setRot(0.0, 0.0, -1.5708);
var cylinder_024MZ = cylinder_024.clone();
    cylinder_024MZ.updateMatrixWorld(true);
    cylinder_024.position.set(0, 0, -1.527);
    cylinder_024MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cylinder_024MZ.position.set(0, 0, 1.5269);
var cylinder_024MirroredZ = new THREE.Group();
    cylinder_024MirroredZ.add(cylinder_024, cylinder_024MZ);
    cylinder_024MirroredZ.position.set(12.5918, 3.1527, 0);

var geo = new THREE.SphereGeometry(1, 32, 16);
var sphere_003 = new THREE.Mesh(geo, RoofTilesMat);
    sphere_003.scale.set(0.2749, -0.0831, 0.2749);
    sphere_003.setRot(0.0, 0.0, -1.5708);
var sphere_003MZ = sphere_003.clone();
    sphere_003MZ.updateMatrixWorld(true);
    sphere_003.position.set(0, 0, -1.527);
    sphere_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    sphere_003MZ.position.set(0, 0, 1.5269);
var sphere_003MirroredZ = new THREE.Group();
    sphere_003MirroredZ.add(sphere_003, sphere_003MZ);
    sphere_003MirroredZ.position.set(12.638, 3.1527, 0);

var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_346 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_346.scale.set(0.1275, -0.0446, 0.9062);
    cube_346.setRot(1.5708, 1.5708, 0.0);
var cube_346MZ = cube_346.clone();
    cube_346MZ.updateMatrixWorld(true);
    cube_346.position.set(0, 0, -2.2407);
    cube_346MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_346MZ.position.set(0, 0, 2.2406);
var cube_346MirroredZ = new THREE.Group();
    cube_346MirroredZ.add(cube_346, cube_346MZ);
    cube_346MirroredZ.position.set(12.5445, 4.965, 0);

var cube_347 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_347.scale.set(0.1275, -0.0446, 0.9062);
    cube_347.setRot(1.5708, 1.5708, 0);
var cube_347MZ = cube_347.clone();
    cube_347MZ.updateMatrixWorld(true);
    cube_347.position.set(0, 0, -0.8133);
    cube_347MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_347MZ.position.set(0, 0, 0.8132);
var cube_347MirroredZ = new THREE.Group();
    cube_347MirroredZ.add(cube_347, cube_347MZ);
    cube_347MirroredZ.position.set(12.5445, 4.965, 0);

var cube_348 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_348.scale.set(0.8412, -0.0446, 0.681);
    cube_348.setRot(1.5708, 1.5708, 0);
var cube_348MZ = cube_348.clone();
    cube_348MZ.updateMatrixWorld(true);
    cube_348.position.set(0, 0, -1.527);
    cube_348MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_348MZ.position.set(0, 0, 1.5269);
var cube_348MirroredZ = new THREE.Group();
    cube_348MirroredZ.add(cube_348, cube_348MZ);
    cube_348MirroredZ.position.set(12.5445, 6.5057, 0);

var cube_349 = new THREE.Mesh(geo, Train_blueMat);
    cube_349.position.set(12.5445, 3.1527, 0);
    cube_349.scale.set(0.7058, -0.0351, 0.9062);
    cube_349.setRot(1.5708, 1.5708, 0.0);

var cube_350 = new THREE.Mesh(geo, Train_blueMat);
    cube_350.position.set(12.5445, 6.4998, -0.0);
    cube_350.scale.set(0.7058, -0.0351, 0.6869);
    cube_350.setRot(1.5708, 1.5708, 0.0);

var cube_351 = new THREE.Mesh(geo, ColonaMat);
    cube_351.scale.set(0.1434, -0.0309, 0.1545);
    cube_351.setRot(1.5708, 1.5708, 0.7854);
var cube_351MZ = cube_351.clone();
    cube_351MZ.updateMatrixWorld(true);
    cube_351.position.set(0, 0, -0.9277);
    cube_351MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_351MZ.position.set(0, 0, 0.9276);
var cube_351MirroredZ = new THREE.Group();
    cube_351MirroredZ.add(cube_351, cube_351MZ);
var cube_351MirroredZMY = cube_351MirroredZ.clone();
    cube_351MirroredZMY.updateMatrixWorld(true);
    cube_351MirroredZ.position.set(0, 4.0498, 0);
    cube_351MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_351MirroredZMY.position.set(0, 5.827, 0);
var cube_351MirroredZMirroredY = new THREE.Group();
    cube_351MirroredZMirroredY.add(cube_351MirroredZ, cube_351MirroredZMY);
    cube_351MirroredZMirroredY.position.set(12.5445, 0, 0);

var cube_352 = new THREE.Mesh(geo, GlassMat);
cube_352.scale.set(0.0151, 1, 0.7144);

var cube_352MZ = cube_352.clone();
    cube_352MZ.updateMatrixWorld(true);
    cube_352.position.set(0, 0, -1.527);
    cube_352MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_352MZ.position.set(0, 0, 1.5269);
var cube_352MirroredZ = new THREE.Group();
    cube_352MirroredZ.add(cube_352, cube_352MZ);
    cube_352MirroredZ.position.set(12.5445, 4.9411, 0);

var cube_353 = new THREE.Mesh(geo, ColonaMat);
    cube_353.scale.set(0.4607, -0.0309, 0.0226);
    cube_353.setRot(1.5708, 1.5708, 0);
var cube_353MZ = cube_353.clone();
    cube_353MZ.updateMatrixWorld(true);
    cube_353.position.set(0, 0, -1.527);
    cube_353MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_353MZ.position.set(0, 0, 1.5269);
var cube_353MirroredZ = new THREE.Group();
    cube_353MirroredZ.add(cube_353, cube_353MZ);
var cube_353MirroredZMY = cube_353MirroredZ.clone();
    cube_353MirroredZMY.updateMatrixWorld(true);
    cube_353MirroredZ.position.set(0, 4.0617, 0);
    cube_353MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_353MirroredZMY.position.set(0, 5.815, 0);
var cube_353MirroredZMirroredY = new THREE.Group();
    cube_353MirroredZMirroredY.add(cube_353MirroredZ, cube_353MirroredZMY);
    cube_353MirroredZMirroredY.position.set(12.5445, 0, 0);

var cube_354 = new THREE.Mesh(geo, ColonaMat);
    cube_354.scale.set(0.7643, -0.0309, 0.0226);
    cube_354.setRot(3.1416, 0.0, 1.5708);
var cube_354MX = cube_354.clone();
    cube_354MX.updateMatrixWorld(true);
    cube_354.position.set(12.5445, 0, 0);
    cube_354MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    cube_354MX.position.set(12.5445, 0, 0);
var cube_354MirroredX = new THREE.Group();
    cube_354MirroredX.add(cube_354, cube_354MX);
var cube_354MirroredXMZ = cube_354MirroredX.clone();
    cube_354MirroredXMZ.updateMatrixWorld(true);
    cube_354MirroredX.position.set(0, 0, -0.9381);
    cube_354MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_354MirroredXMZ.position.set(0, 0, 0.9381);
var cube_354MirroredXMirroredZ = new THREE.Group();
    cube_354MirroredXMirroredZ.add(cube_354MirroredX, cube_354MirroredXMZ);
var cube_354MirroredXMirroredZMY = cube_354MirroredXMirroredZ.clone();
    cube_354MirroredXMirroredZMY.updateMatrixWorld(true);
    cube_354MirroredXMirroredZ.position.set(0, 4.936, 0);
    cube_354MirroredXMirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_354MirroredXMirroredZMY.position.set(0, 4.9408, 0);
var cube_354MirroredXMirroredZMirroredY = new THREE.Group();
    cube_354MirroredXMirroredZMirroredY.add(cube_354MirroredXMirroredZ, cube_354MirroredXMirroredZMY);

var cube_355 = new THREE.Mesh(geo, GlassMat);
    cube_355.position.set(12.5445, 4.9384, -0.0);
    cube_355.scale.set(0.0151, 0.9645, 0.4812);

var cube_356 = new THREE.Mesh(geo, ColonaMat);
    cube_356.scale.set(0.1434, -0.0309, 0.1545);
    cube_356.setRot(1.5708, 1.5708, 0.7854);
var cube_356MZ = cube_356.clone();
    cube_356MZ.updateMatrixWorld(true);
    cube_356.position.set(0, 0, 0.4478);
    cube_356MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_356MZ.position.set(0, 0, -0.4478);
var cube_356MirroredZ = new THREE.Group();
    cube_356MirroredZ.add(cube_356, cube_356MZ);
var cube_356MirroredZMY = cube_356MirroredZ.clone();
    cube_356MirroredZMY.updateMatrixWorld(true);
    cube_356MirroredZ.position.set(0, 4.0693, 0);
    cube_356MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_356MirroredZMY.position.set(0, 5.8075, 0);
var cube_356MirroredZMirroredY = new THREE.Group();
    cube_356MirroredZMirroredY.add(cube_356MirroredZ, cube_356MirroredZMY);
    cube_356MirroredZMirroredY.position.set(12.5445, 0, 0);

var cube_357 = new THREE.Mesh(geo, ColonaMat);
    cube_357.scale.set(0.4607, -0.0309, 0.0226);
    cube_357.setRot(1.5708, 1.5708, -0.0);
var cube_357MY = cube_357.clone();
    cube_357MY.updateMatrixWorld(true);
    cube_357.position.set(0, 4.0568, 0);
    cube_357MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_357MY.position.set(0, 5.82, 0);
var cube_357MirroredY = new THREE.Group();
    cube_357MirroredY.add(cube_357, cube_357MY);
    cube_357MirroredY.position.set(12.5445, 0, -0.0);

var cube_358 = new THREE.Mesh(geo, ColonaMat);
    cube_358.scale.set(0.7643, -0.0309, 0.0226);
    cube_358.setRot(3.1416, 0.0, 1.5708);
var cube_358MZ = cube_358.clone();
    cube_358MZ.updateMatrixWorld(true);
    cube_358.position.set(0, 0, 0.4584);
    cube_358MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_358MZ.position.set(0, 0, -0.4584);
var cube_358MirroredZ = new THREE.Group();
    cube_358MirroredZ.add(cube_358, cube_358MZ);
    cube_358MirroredZ.position.set(12.5445, 4.9303, 0);

var cube_359 = new THREE.Mesh(geo, ColonaMat);
    cube_359.scale.set(0.7643, -0.0309, 0.0226);
    cube_359.setRot(3.1416, 0.0, 1.5708);
var cube_359MX = cube_359.clone();
    cube_359MX.updateMatrixWorld(true);
    cube_359.position.set(12.5445, 0, 0);
    cube_359MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    cube_359MX.position.set(12.5445, 0, 0);
var cube_359MirroredX = new THREE.Group();
    cube_359MirroredX.add(cube_359, cube_359MX);
var cube_359MirroredXMZ = cube_359MirroredX.clone();
    cube_359MirroredXMZ.updateMatrixWorld(true);
    cube_359MirroredX.position.set(0, 0, 2.1187);
    cube_359MirroredXMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_359MirroredXMZ.position.set(0, 0, -2.1187);
var cube_359MirroredXMirroredZ = new THREE.Group();
    cube_359MirroredXMirroredZ.add(cube_359MirroredX, cube_359MirroredXMZ);
var cube_359MirroredXMirroredZMY = cube_359MirroredXMirroredZ.clone();
    cube_359MirroredXMirroredZMY.updateMatrixWorld(true);
    cube_359MirroredXMirroredZ.position.set(0, 4.936, 0);
    cube_359MirroredXMirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_359MirroredXMirroredZMY.position.set(0, 4.9408, 0);
var cube_359MirroredXMirroredZMirroredY = new THREE.Group();
    cube_359MirroredXMirroredZMirroredY.add(cube_359MirroredXMirroredZ, cube_359MirroredXMirroredZMY);

var cube_360 = new THREE.Mesh(geo, ColonaMat);
    cube_360.scale.set(0.1434, -0.0309, 0.1545);
    cube_360.setRot(1.5708, 1.5708, 0.7854);
var cube_360MZ = cube_360.clone();
    cube_360MZ.updateMatrixWorld(true);
    cube_360.position.set(0, 0, 2.1206);
    cube_360MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_360MZ.position.set(0, 0, -2.1207);
var cube_360MirroredZ = new THREE.Group();
    cube_360MirroredZ.add(cube_360, cube_360MZ);
var cube_360MirroredZMY = cube_360MirroredZ.clone();
    cube_360MirroredZMY.updateMatrixWorld(true);
    cube_360MirroredZ.position.set(0, 4.0498, 0);
    cube_360MirroredZMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
    cube_360MirroredZMY.position.set(0, 5.827, 0);
var cube_360MirroredZMirroredY = new THREE.Group();
    cube_360MirroredZMirroredY.add(cube_360MirroredZ, cube_360MirroredZMY);
    cube_360MirroredZMirroredY.position.set(12.5445, 0, 0);

var cube_361 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_361.position.set(-0.0006, 7.2557, -0.0);
    cube_361.scale.set(12.5898, 0.069, 2.4701);

var cube_362 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_362.position.set(-0.0006, 7.3977, -0.0);
    cube_362.scale.set(12.1678, 0.2214, 1.4361);

var cube_363 = new THREE.Mesh(geo, Blue_PictureMat);
    cube_363.position.set(-12.1452, 7.2829, -0.0);
    cube_363.scale.set(0.2541, 0.2214, 1.4361);
    cube_363.setRot(0.0, 0.0, -0.7854);

var cube_364 = new THREE.Mesh(geo, Ceiling_trainMat);
    cube_364.position.set(-0.0006, 7.0623, -0.0);
    cube_364.scale.set(12.5105, 0.1214, 2.3753);

var cube_365 = new THREE.Mesh(geo, Floor_trainMat);
    cube_365.position.set(-0.0006, 2.1963, -0.0);
    cube_365.scale.set(12.5105, 0.1214, 2.3753);

var cube_372 = new THREE.Mesh(geo, Train_blueMat);
    cube_372.position.set(-12.5457, 4.9776, 0.5792);
    cube_372.scale.set(0.1266, 0.0351, 0.9188);
    cube_372.setRot(1.5708, 1.5708, 0.0);

var cube_373 = new THREE.Mesh(geo, Train_blueMat);
    cube_373.position.set(12.5445, 4.9776, 0.5792);
    cube_373.scale.set(0.1266, 0.0351, 0.9188);
    cube_373.setRot(1.5708, 1.5708, 0.0);

var cube_374 = new THREE.Mesh(geo, Train_blueMat);
    cube_374.position.set(12.5445, 4.9776, -0.5792);
    cube_374.scale.set(0.1266, 0.0351, 0.9188);
    cube_374.setRot(1.5708, 1.5708, 0.0);

//train side panels (down)
var cube_409Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_409 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_409.scale.set(2.1144, 0.051, 0.8864);
 cube_409.position.set(6.4194 * i, 0, 0);
 cube_409Group.add(cube_409);
}
cube_409Group.setRot(1.5708, 0.0, 0.0);
cube_409Group.position.set(-6.4204, 3.1279, 2.4191);


var cube_410Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_410 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_410.scale.set(2.1144, 0.051, 0.7023);
 cube_410.position.set(6.4194 * i, 0, 0);
 cube_410Group.add(cube_410);
}
cube_410Group.setRot(1.5708, 0.0, 0.0);
cube_410Group.position.set(-6.4204, 6.2439, 2.4191);

//top side panel
var cube_411 = new THREE.Mesh(geo, Blue_PictureMat);
cube_411.position.set(-0.001, 7.0636, -2.4216);
cube_411.scale.set(10.7268, 0.051, 0.1232);
cube_411.setRot(1.5708, 0.0, 0.0);

//train side panel (window)
var cube_412Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_412 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_412.scale.set(0.5707, 0.051, 0.7636);
 cube_412.position.set(6.4195 * i, 0, 0);
 cube_412Group.add(cube_412);
}
cube_412Group.setRot(1.5708, 0.0, 0.0);
cube_412Group.position.set(-7.9641, 4.778, 2.4191);

var cube_413Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_413 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_413.scale.set(0.5707, 0.051, 0.7636);
 cube_413.position.set(6.4195 * i, 0, 0);
 cube_413Group.add(cube_413);
}
cube_413Group.setRot(1.5708, 0.0, 0.0);
cube_413Group.position.set(-4.8768, 4.778, 2.4191);

var cube_414Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_414 = new THREE.Mesh(geo, GlassMat);
 cube_414.scale.set(-0.0151, 0.786, 1.0055);
 cube_414.position.set(0, 0, 6.4153 * i);
 cube_414Group.add(cube_414);
}
cube_414Group.setRot(0.0, 1.5708, 0.0);
cube_414Group.position.set(-6.4205, 4.778, 2.4191);

var cube_415Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_415 = new THREE.Mesh(geo, ColonaMat);
 cube_415.scale.set(0.9267, 0.0309, 0.0215);
 cube_415.position.set(-6.4313 * i, 0, 0);
 cube_415Group.add(cube_415);
}
cube_415Group.setRot(1.5708, 3.1416, 0.0);
var cube_415GroupMY = cube_415Group.clone();
cube_415GroupMY.updateMatrixWorld(true);
cube_415Group.position.set(0, 4.0179, 0);
cube_415GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_415GroupMY.position.set(0, 5.5774, 0);
var cube_415GroupMirroredY = new THREE.Group();
cube_415GroupMirroredY.add(cube_415Group, cube_415GroupMY);
cube_415GroupMirroredY.position.set(-6.4205, 0, 2.4191);

var cube_416Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_416 = new THREE.Mesh(geo, ColonaMat);
 cube_416.scale.set(0.1252, 0.0309, 0.1349);
 cube_416.position.set(-4.5462 * i, 0, -4.5331 * i);
 cube_416Group.add(cube_416);
}
cube_416Group.setRot(1.5708, 3.1416, 0.7854);
var cube_416GroupMY = cube_416Group.clone();
cube_416GroupMY.updateMatrixWorld(true);
cube_416Group.position.set(0, 4.0135, 0);
cube_416GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_416GroupMY.position.set(0, 5.5424, 0);
var cube_416GroupMirroredY = new THREE.Group();
cube_416GroupMirroredY.add(cube_416Group, cube_416GroupMY);
cube_416GroupMirroredY.position.set(-7.3886, 0, 2.4191);

var cube_417Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_417 = new THREE.Mesh(geo, ColonaMat);
 cube_417.scale.set(0.1252, 0.0309, 0.1349);
 cube_417.position.set(-4.5462 * i, 0, -4.5331 * i);
 cube_417Group.add(cube_417);
}
cube_417Group.setRot(1.5708, 3.1416, 0.7854);
var cube_417GroupMY = cube_417Group.clone();
cube_417GroupMY.updateMatrixWorld(true);
cube_417Group.position.set(0, 3.9782, 0);
cube_417GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_417GroupMY.position.set(0, 5.5778, 0);
var cube_417GroupMirroredY = new THREE.Group();
cube_417GroupMirroredY.add(cube_417Group, cube_417GroupMY);
cube_417GroupMirroredY.position.set(-5.4376, 0, 2.4191);

var cube_418Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_418 = new THREE.Mesh(geo, ColonaMat);
 cube_418.scale.set(0.7261, 0.0309, 0.0176);
 cube_418.position.set(0, 0, -6.4199 * i);
 cube_418Group.add(cube_418);
}
cube_418Group.setRot(4.7124, 0.0, 1.5708);
cube_418Group.position.set(-7.3937, 4.7961, 2.4191);

var cube_419Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_419 = new THREE.Mesh(geo, ColonaMat);
 cube_419.scale.set(0.7261, 0.0309, 0.0176);
 cube_419.position.set(0, 0, -6.4199 * i);
 cube_419Group.add(cube_419);
}
cube_419Group.setRot(4.7124, 0.0, 1.5708);
cube_419Group.position.set(-5.4465, 4.7961, 2.4191);

var cube_420Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_420 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_420.scale.set(2.1144, 0.051, 0.8864);
 cube_420.position.set(6.4194 * i, 0, 0);
 cube_420Group.add(cube_420);
}
cube_420Group.setRot(1.5708, 0.0, 0.0);
cube_420Group.position.set(-6.4204, 3.1279, -2.4192);

var cube_421Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_421 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_421.scale.set(2.1144, 0.051, 0.7023);
 cube_421.position.set(6.4194 * i, 0, 0);
 cube_421Group.add(cube_421);
}
cube_421Group.setRot(1.5708, 0.0, 0.0);
cube_421Group.position.set(-6.4204, 6.2439, -2.4192);

var cube_422Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_422 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_422.scale.set(0.5707, 0.051, 0.7636);
 cube_422.position.set(6.4195 * i, 0, 0);
 cube_422Group.add(cube_422);
}
cube_422Group.setRot(1.5708, 0.0, 0.0);
cube_422Group.position.set(-7.9641, 4.778, -2.4192);

var cube_423Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_423 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_423.scale.set(0.5707, 0.051, 0.7636);
 cube_423.position.set(6.4195 * i, 0, 0);
 cube_423Group.add(cube_423);
}
cube_423Group.setRot(1.5708,0,0);
cube_423Group.position.set(-4.8768, 4.778, -2.4192);

var cube_424Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_424 = new THREE.Mesh(geo, GlassMat);
 cube_424.scale.set(-0.0151, 0.786, 1.0055);
 cube_424.position.set(0, 0, 6.4153 * i);
 cube_424Group.add(cube_424);
}
cube_424Group.setRot(0.0, 1.5708, 0.0);
cube_424Group.position.set(-6.4205, 4.778, -2.4192);

var cube_425Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_425 = new THREE.Mesh(geo, ColonaMat);
 cube_425.scale.set(0.9267, 0.0309, 0.0215);
 cube_425.position.set(-6.4313 * i, 0, 0);
 cube_425Group.add(cube_425);
}
cube_425Group.setRot(1.5708, 3.1416, 0.0);
var cube_425GroupMY = cube_425Group.clone();
cube_425GroupMY.updateMatrixWorld(true);
cube_425Group.position.set(0, 4.0179, 0);
cube_425GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_425GroupMY.position.set(0, 5.5774, 0);
var cube_425GroupMirroredY = new THREE.Group();
cube_425GroupMirroredY.add(cube_425Group, cube_425GroupMY);
cube_425GroupMirroredY.position.set(-6.4205, 0, -2.4192);

var cube_426Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_426 = new THREE.Mesh(geo, ColonaMat);
 cube_426.scale.set(0.1252, 0.0309, 0.1349);
 cube_426.position.set(-4.5462 * i, 0, -4.5331 * i);
 cube_426Group.add(cube_426);
}
cube_426Group.setRot(1.5708, 3.1416, 0.7854);
var cube_426GroupMY = cube_426Group.clone();
cube_426GroupMY.updateMatrixWorld(true);
cube_426Group.position.set(0, 4.0135, 0);
cube_426GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_426GroupMY.position.set(0, 5.5424, 0);
var cube_426GroupMirroredY = new THREE.Group();
cube_426GroupMirroredY.add(cube_426Group, cube_426GroupMY);
cube_426GroupMirroredY.position.set(-7.3886, 0, -2.4192);

var cube_427Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_427 = new THREE.Mesh(geo, ColonaMat);
 cube_427.scale.set(0.1252, 0.0309, 0.1349);
 cube_427.position.set(-4.5462 * i, 0, -4.5331 * i);
 cube_427Group.add(cube_427);
}
cube_427Group.setRot(1.5708, 3.1416, 0.7854);
var cube_427GroupMY = cube_427Group.clone();
cube_427GroupMY.updateMatrixWorld(true);
cube_427Group.position.set(0, 3.9782, 0);
cube_427GroupMY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_427GroupMY.position.set(0, 5.5778, 0);
var cube_427GroupMirroredY = new THREE.Group();
cube_427GroupMirroredY.add(cube_427Group, cube_427GroupMY);
cube_427GroupMirroredY.position.set(-5.4376, 0, -2.4192);

var cube_428Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_428 = new THREE.Mesh(geo, ColonaMat);
 cube_428.scale.set(0.7261, 0.0309, 0.0176);
 cube_428.position.set(0, 0, -6.4199 * i);
 cube_428Group.add(cube_428);
}
cube_428Group.setRot(4.7124, 0.0, 1.5708);
cube_428Group.position.set(-7.3937, 4.7961, -2.4192);

var cube_429Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_429 = new THREE.Mesh(geo, ColonaMat);
 cube_429.scale.set(0.7261, 0.0309, 0.0176);
 cube_429.position.set(0, 0, -6.4199 * i);
 cube_429Group.add(cube_429);
}
cube_429Group.setRot(4.7124, 0.0, 1.5708);
cube_429Group.position.set(-5.4465, 4.7961, -2.4192);

var cube_430 = new THREE.Mesh(geo, Blue_PictureMat);
cube_430.position.set(-0.001, 7.0636, 2.4074);
cube_430.scale.set(10.7268, 0.051, 0.1232);
cube_430.setRot(1.5708, 0, 0);

var cube_431Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_431 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_431.scale.set(2.1443, 0.0248, 0.1709);
 cube_431.position.set(6.4201*i, 0, 0);
 cube_431Group.add(cube_431);
}
cube_431Group.setRot(1.5708, 0.0, 0.0);
cube_431Group.position.set(-6.4204, 3.7969, -2.4653);

var cube_432Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_432 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_432.scale.set(0.9461, 0.0248, 0.1709);
 cube_432.position.set(23.3213 * i, 0, 0);
 cube_432Group.add(cube_432);
}
cube_432Group.setRot(1.5708, 0.0, 0.0);
cube_432Group.position.set(-11.6623, 3.7969, -2.4653);

var cube_433Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_433 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_433.scale.set(0.9146, 0.0248, 0.1709);
 cube_433.position.set(0, 25.1753 * i, 0);
 cube_433Group.add(cube_433);
}
cube_433Group.setRot(1.5708, 1.5708, 0.0);
cube_433Group.position.set(-12.5888, 3.7969, -1.5755);

var cube_442Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_442 = new THREE.Mesh(geo, MetalMat);
 cube_442.scale.set(0.0294, 0.0351, 2.0562);
 cube_442.position.set(0, 0, -6.4153 * i);
 cube_442Group.add(cube_442);
}
cube_442Group.setRot(-0.0, -1.5708, 0.7854);
cube_442Group.position.set(-6.4204, 3.4743, -2.4483);

var cube_443Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_443 = new THREE.Mesh(geo, MetalMat);
 cube_443.scale.set(0.0294, 0.0351, 2.0562);
 cube_443.position.set(0, 0, -6.4153 * i);
 cube_443Group.add(cube_443);
}
cube_443Group.setRot(0, -1.5708, 0.7854);
cube_443Group.position.set(-6.4204, 2.9648, -2.4483);

var cube_444Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_444 = new THREE.Mesh(geo, MetalMat);
 cube_444.scale.set(0.0294, 0.0351, 2.0562);
 cube_444.position.set(0, 0, -6.4153 * i);
 cube_444Group.add(cube_444);
}
cube_444Group.setRot(-0.0, -1.5708, 0.7854);
cube_444Group.position.set(-6.4204, 2.4562, -2.4483);

var cube_445Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_445 = new THREE.Mesh(geo, MetalMat);
 cube_445.scale.set(0.0294, 0.0351, 2.0562);
 cube_445.position.set(0, 0, -6.4153 * i);
 cube_445Group.add(cube_445);
}
cube_445Group.setRot(-0.0, -1.5708, 0.7854);
cube_445Group.position.set(-6.4204, 6.5576, -2.4483);

var cube_446Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_446 = new THREE.Mesh(geo, MetalMat);
 cube_446.scale.set(0.0294, 0.0351, 2.0562);
 cube_446.position.set(0, 0, -6.4153 * i);
 cube_446Group.add(cube_446);
}
cube_446Group.setRot(-0.0, -1.5708, 0.7854);
cube_446Group.position.set(-6.4204, 6.0482, -2.4483);

var cube_447Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_447 = new THREE.Mesh(geo, MetalMat);
 cube_447.scale.set(0.0294, 0.0351, 0.5273);
 cube_447.position.set(0, 0, -6.4229 * i);
 cube_447Group.add(cube_447);
}
cube_447Group.setRot(-0.0, -1.5708, 0.7854);
cube_447Group.position.set(-4.8768, 5.0327, -2.4544);

var cube_448Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_448 = new THREE.Mesh(geo, MetalMat);
 cube_448.scale.set(0.0294, 0.0351, 0.5273);
 cube_448.position.set(0, 0, -6.4229 * i);
 cube_448Group.add(cube_448);
}
cube_448Group.setRot(-0.0, -1.5708, 0.7854);
cube_448Group.position.set(-4.8768, 4.5232, -2.4544);

var cube_449Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_449 = new THREE.Mesh(geo, MetalMat);
 cube_449.scale.set(0.0294, 0.0351, 0.5273);
 cube_449.position.set(0, 0, -6.4229 * i);
 cube_449Group.add(cube_449);
}
cube_449Group.setRot(-0.0, -1.5708, 0.7854);
cube_449Group.position.set(-7.9641, 5.0327, -2.4544);

var cube_450Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_450 = new THREE.Mesh(geo, MetalMat);
 cube_450.scale.set(0.0294, 0.0351, 0.5273);
 cube_450.position.set(0, 0, -6.4229 * i);
 cube_450Group.add(cube_450);
}
cube_450Group.setRot(-0.0, -1.5708, 0.7854);
cube_450Group.position.set(-7.9641, 4.5232, -2.4544);

var cube_451Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_451 = new THREE.Mesh(geo, MetalMat);
 cube_451.scale.set(0.0294, 0.0351, 0.8515);
 cube_451.position.set(0, 0, -23.3301 * i);
 cube_451Group.add(cube_451);
}
cube_451Group.setRot(-0.0, -1.5708, 0.7854);
cube_451Group.position.set(-11.6586, 5.2258, -2.465);

var cube_452Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_452 = new THREE.Mesh(geo, MetalMat);
 cube_452.scale.set(0.0294, 0.0351, 0.8515);
 cube_452.position.set(0, 0, -23.3301 * i);
 cube_452Group.add(cube_452);
}
cube_452Group.setRot(-0.0, -1.5708, 0.7854);
cube_452Group.position.set(-11.6586, 4.7163, -2.465);

var cube_453Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_453 = new THREE.Mesh(geo, MetalMat);
 cube_453.scale.set(0.0294, 0.0351, 0.8515);
 cube_453.position.set(0, 0, -23.3301 * i);
 cube_453Group.add(cube_453);
}
cube_453Group.setRot(-0.0, -1.5708, 0.7854);
cube_453Group.position.set(-11.6586, 4.2077, -2.465);

var cube_454Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_454 = new THREE.Mesh(geo, MetalMat);
 cube_454.scale.set(0.0294, 0.0351, 0.8515);
 cube_454.position.set(0, 0, -23.3301 * i);
 cube_454Group.add(cube_454);
}
cube_454Group.setRot(-0.0, -1.5708, 0.7854);
cube_454Group.position.set(-11.6586, 6.7176, -2.465);

var cube_455Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_455 = new THREE.Mesh(geo, MetalMat);
 cube_455.scale.set(0.0294, 0.0351, 0.8515);
 cube_455.position.set(0, 0, -23.3301 * i);
 cube_455Group.add(cube_455);
}
cube_455Group.setRot(-0.0, -1.5708, 0.7854);
cube_455Group.position.set(-11.6586, 6.2081, -2.465);

var cube_456Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_456 = new THREE.Mesh(geo, MetalMat);
 cube_456.scale.set(0.0294, 0.0351, 0.8515);
 cube_456.position.set(0, 0, -23.3301 * i);
 cube_456Group.add(cube_456);
}
cube_456Group.setRot(-0.0, -1.5708, 0.7854);
cube_456Group.position.set(-11.6586, 5.6995, -2.465);

var cube_457Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_457 = new THREE.Mesh(geo, MetalMat);
 cube_457.scale.set(0.0294, 0.0351, 0.8515);
 cube_457.position.set(0, 0, -23.3301 * i);
 cube_457Group.add(cube_457);
}
cube_457Group.setRot(-0.0, -1.5708, 0.7854);
cube_457Group.position.set(-11.6586, 3.2845, -2.465);

var cube_458Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_458 = new THREE.Mesh(geo, MetalMat);
 cube_458.scale.set(0.0294, 0.0351, 0.8515);
 cube_458.position.set(0, 0, -23.3301 * i);
 cube_458Group.add(cube_458);
}
cube_458Group.setRot(-0.0, -1.5708, 0.7854);
cube_458Group.position.set(-11.6586, 2.775, -2.465);

var cube_459Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_459 = new THREE.Mesh(geo, MetalMat);
 cube_459.scale.set(0.0294, 0.0351, 0.8515);
 cube_459.position.set(0, 0, -23.3301 * i);
 cube_459Group.add(cube_459);
}
cube_459Group.setRot(-0.0, -1.5708, 0.7854);
cube_459Group.position.set(-11.6586, 2.2664, -2.465);

var cube_460Group = new THREE.Group();
for (var i = 0; i < 5; i++) {
 var cube_460 = new THREE.Mesh(geo, ColonaMat);
 cube_460.scale.set(1.0, 0.4065, 0.5334);
 cube_460.position.set(-2.2 * i, 0, 0);
 cube_460Group.add(cube_460);
}
cube_460Group.position.set(4.7305, 1.2702, -1.8726);

var cube_461Group = new THREE.Group();
for (var i = 0; i < 5; i++) {
 var cube_461 = new THREE.Mesh(geo, ColonaMat);
 cube_461.scale.set(1.0, 0.4065, 0.5334);
 cube_461.position.set(-2.2 * i, 0, 0);
 cube_461Group.add(cube_461);
}
cube_461Group.position.set(4.7305, 1.2702, 1.8725);

//top decor elements of train
var train_decor_l = new THREE.Group();
for (var i = 0; i<30; i++) {
var decor = new THREE.Mesh(geo, Train_blueMat);
    decor.scale.set(0.1,0.3,0.3); decor.position.x = 0.8*i;
    train_decor_l.add(decor);
}   train_decor_l.rotation.x = -PI/4;
    train_decor_l.position.z =  -1.45;
var train_decor_r = train_decor_l.clone();
    train_decor_r.position.z = 1.45;
    train_decor_r.scale.z = -1; 
var train_decor_top = new THREE.Group();
    train_decor_top.add(train_decor_l,train_decor_r);
    train_decor_top.position.set(-11.6, 7.2, 0);

//top front rotated panel
var cube_463 = new THREE.Mesh(geo, Blue_PictureMat);
cube_463.position.set(12.193, 7.283, 0);
cube_463.scale.set(-0.254, -0.221, 1.436);
cube_463.setRot(0, 0, -0.785);

var cube_464Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_464 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_464.scale.set(2.1443, -0.0248, 0.1709);
 cube_464.position.set(6.4201 * i, 0, 0);
 cube_464Group.add(cube_464);
}
cube_464Group.setRot(1.5708, 0, 0);
cube_464Group.position.set(-6.4204, 3.7969, 2.4659);

var cube_465Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_465 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_465.scale.set(0.9461, -0.0248, 0.1709);
 cube_465.position.set(23.3213 * i, 0, 0);
 cube_465Group.add(cube_465);
}
cube_465Group.setRot(1.5708, 0, 0);
cube_465Group.position.set(-11.6623, 3.7969, 2.4659);

var cube_466Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_466 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_466.scale.set(-0.9146, 0.0248, 0.1709);
 cube_466.position.set(0, 25.1753 * i, 0);
 cube_466Group.add(cube_466);
}
cube_466Group.setRot(1.5708, 1.5708, 0);
cube_466Group.position.set(-12.5888, 3.7969, 1.5761);

var cube_475Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_475 = new THREE.Mesh(geo, MetalMat);
 cube_475.scale.set(-0.0294, -0.0351, 2.0562);
 cube_475.position.set(0, 0, -6.4153 * i);
 cube_475Group.add(cube_475);
}
cube_475Group.setRot(0, -1.5708, 0.7854);
cube_475Group.position.set(-6.4204, 3.4743, 2.4489);

var cube_476Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_476 = new THREE.Mesh(geo, MetalMat);
 cube_476.scale.set(-0.0294, -0.0351, 2.0562);
 cube_476.position.set(0, 0, -6.4153 * i);
 cube_476Group.add(cube_476);
}
cube_476Group.setRot(0, -1.5708, 0.7854);
cube_476Group.position.set(-6.4204, 2.9648, 2.4489);

var cube_477Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_477 = new THREE.Mesh(geo, MetalMat);
 cube_477.scale.set(-0.0294, -0.0351, 2.0562);
 cube_477.position.set(0, 0, -6.4153 * i);
 cube_477Group.add(cube_477);
}
cube_477Group.setRot(0, -1.5708, 0.7854);
cube_477Group.position.set(-6.4204, 2.4562, 2.4489);

var cube_478Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_478 = new THREE.Mesh(geo, MetalMat);
 cube_478.scale.set(-0.0294, -0.0351, 2.0562);
 cube_478.position.set(0, 0, -6.4153 * i);
 cube_478Group.add(cube_478);
}
cube_478Group.setRot(0, -1.5708, 0.7854);
cube_478Group.position.set(-6.4204, 6.5576, 2.4489);

var cube_479Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_479 = new THREE.Mesh(geo, MetalMat);
 cube_479.scale.set(-0.0294, -0.0351, 2.0562);
 cube_479.position.set(0, 0, -6.4153 * i);
 cube_479Group.add(cube_479);
}
cube_479Group.setRot(0, -1.5708, 0.7854);
cube_479Group.position.set(-6.4204, 6.0482, 2.4489);

var cube_480Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_480 = new THREE.Mesh(geo, MetalMat);
 cube_480.scale.set(-0.0294, -0.0351, 0.5273);
 cube_480.position.set(0, 0, -6.4229 * i);
 cube_480Group.add(cube_480);
}
cube_480Group.setRot(0, -1.5708, 0.7854);
cube_480Group.position.set(-4.8768, 5.0327, 2.455);

var cube_481Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_481 = new THREE.Mesh(geo, MetalMat);
 cube_481.scale.set(-0.0294, -0.0351, 0.5273);
 cube_481.position.set(0, 0, -6.4229 * i);
 cube_481Group.add(cube_481);
}
cube_481Group.setRot(0, -1.5708, 0.7854);
cube_481Group.position.set(-4.8768, 4.5232, 2.455);

var cube_482Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_482 = new THREE.Mesh(geo, MetalMat);
 cube_482.scale.set(-0.0294, -0.0351, 0.5273);
 cube_482.position.set(0, 0, -6.4229 * i);
 cube_482Group.add(cube_482);
}
cube_482Group.setRot(0, -1.5708, 0.7854);
cube_482Group.position.set(-7.9641, 5.0327, 2.455);

var cube_483Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_483 = new THREE.Mesh(geo, MetalMat);
 cube_483.scale.set(-0.0294, -0.0351, 0.5273);
 cube_483.position.set(0, 0, -6.4229 * i);
 cube_483Group.add(cube_483);
}
cube_483Group.setRot(0, -1.5708, 0.7854);
cube_483Group.position.set(-7.9641, 4.5232, 2.455);

var cube_484Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_484 = new THREE.Mesh(geo, MetalMat);
 cube_484.scale.set(-0.0294, -0.0351, 0.8515);
 cube_484.position.set(0, 0, -23.3301 * i);
 cube_484Group.add(cube_484);
}
cube_484Group.setRot(0, -1.5708, 0.7854);
cube_484Group.position.set(-11.6586, 5.2258, 2.4657);

var cube_485Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_485 = new THREE.Mesh(geo, MetalMat);
 cube_485.scale.set(-0.0294, -0.0351, 0.8515);
 cube_485.position.set(0, 0, -23.3301 * i);
 cube_485Group.add(cube_485);
}
cube_485Group.setRot(0, -1.5708, 0.7854);
cube_485Group.position.set(-11.6586, 4.7163, 2.4657);

var cube_486Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_486 = new THREE.Mesh(geo, MetalMat);
 cube_486.scale.set(-0.0294, -0.0351, 0.8515);
 cube_486.position.set(0, 0, -23.3301 * i);
 cube_486Group.add(cube_486);
}
cube_486Group.setRot(0, -1.5708, 0.7854);
cube_486Group.position.set(-11.6586, 4.2077, 2.4657);

var cube_487Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_487 = new THREE.Mesh(geo, MetalMat);
 cube_487.scale.set(-0.0294, -0.0351, 0.8515);
 cube_487.position.set(0, 0, -23.3301 * i);
 cube_487Group.add(cube_487);
}
cube_487Group.setRot(0, -1.5708, 0.7854);
cube_487Group.position.set(-11.6586, 6.7176, 2.4657);

var cube_488Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_488 = new THREE.Mesh(geo, MetalMat);
 cube_488.scale.set(-0.0294, -0.0351, 0.8515);
 cube_488.position.set(0, 0, -23.3301 * i);
 cube_488Group.add(cube_488);
}
cube_488Group.setRot(0, -1.5708, 0.7854);
cube_488Group.position.set(-11.6586, 6.2081, 2.4657);

var cube_489Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_489 = new THREE.Mesh(geo, MetalMat);
 cube_489.scale.set(-0.0294, -0.0351, 0.8515);
 cube_489.position.set(0, 0, -23.3301 * i);
 cube_489Group.add(cube_489);
}
cube_489Group.setRot(0, -1.5708, 0.7854);
cube_489Group.position.set(-11.6586, 5.6995, 2.4657);

var cube_490Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_490 = new THREE.Mesh(geo, MetalMat);
 cube_490.scale.set(-0.0294, -0.0351, 0.8515);
 cube_490.position.set(0, 0, -23.3301 * i);
 cube_490Group.add(cube_490);
}
cube_490Group.setRot(0, -1.5708, 0.7854);
cube_490Group.position.set(-11.6586, 3.2845, 2.4657);

var cube_491Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_491 = new THREE.Mesh(geo, MetalMat);
 cube_491.scale.set(-0.0294, -0.0351, 0.8515);
 cube_491.position.set(0, 0, -23.3301 * i);
 cube_491Group.add(cube_491);
}
cube_491Group.setRot(0, -1.5708, 0.7854);
cube_491Group.position.set(-11.6586, 2.775, 2.4657);

//decor side black panel down
var cube_492Group = new THREE.Group();
for (var i = 0; i < 2; i++) {
 var cube_492 = new THREE.Mesh(geo, MetalMat);
 cube_492.scale.set(-0.029, -0.035, 0.851);
 cube_492.position.set(0, 0, -23.33 * i);
 cube_492Group.add(cube_492);
}
cube_492Group.setRot(0, -1.57, 0.785);
cube_492Group.position.set(-11.658, 2.266, 2.465);


//train floor
var geo = new THREE.BoxGeometry(2, 2, 2);
var train_floor = new THREE.Mesh(geo, Floor_trainMat);
    train_floor.position.y = 2.2;
    train_floor.scale.set(12.5, 0.15, 2.4);

var cube_533Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_533 = new THREE.Mesh(geo, Blue_PictureMat);
 cube_533.scale.set(2.1144, 0.051, 0.8864);
 cube_533.position.set(6.4194 * i, 0, 0);
 cube_533Group.add(cube_533);
}
cube_533Group.setRot(1.5708, 0.0, 0.0);
cube_533Group.position.set(-6.4204, 3.1279, 2.4191);

var cube_542Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_542 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_542.scale.set(2.1443, -0.0248, 0.1709);
 cube_542.position.set(6.4201 * i, 0, 0);
 cube_542Group.add(cube_542);
}
cube_542Group.setRot(1.5708, 0.0, 0.0);
cube_542Group.position.set(-6.4204, 3.7969, 2.4659);
var TrainDoorFuncEntityGroup = new THREE.Group();
for (var i = 0; i < 4; i++) {
 var DrawTrainDoorFunctionEntity = DrawTrainDoor();
 DrawTrainDoorFunctionEntity.position.set(6.4192 * i, 0, 0);
 TrainDoorFuncEntityGroup.add(DrawTrainDoorFunctionEntity);
}

var TrainDoorFuncEntityGroupMZ = new THREE.Group();
for (var i = 0; i < 4; i++) {
 var DrawTrainDoorFunctionEntity = DrawTrainDoor();
 DrawTrainDoorFunctionEntity.position.set(6.42*i, 0, 0);
 TrainDoorFuncEntityGroupMZ.add(DrawTrainDoorFunctionEntity);
}
TrainDoorFuncEntityGroupMZ.updateMatrixWorld(true);
TrainDoorFuncEntityGroup.position.set(0, 0, -2.4);
TrainDoorFuncEntityGroupMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
TrainDoorFuncEntityGroupMZ.position.set(0, 0, 2.4);
var DrawTrainDoorFunctionEntityGroupMirroredZ = new THREE.Group();
DrawTrainDoorFunctionEntityGroupMirroredZ.add(TrainDoorFuncEntityGroup, TrainDoorFuncEntityGroupMZ);
DrawTrainDoorFunctionEntityGroupMirroredZ.position.set(-9.62, 2.24, 0);
var Decor = DrawVagonDecorations();
var out = new THREE.Group();
out.add(Decor, wheel_base_1, wheel_base_2, train_base, cube_326MirroredZ, cube_327MirroredZ, cylinder_022MirroredZ, sphere_002MirroredZ, cube_328MirroredZ, cube_329MirroredZ, cube_330MirroredZ, cube_331, cube_332, cube_333, cube_334MirroredZMirroredY, cube_335MirroredZ, cube_336MirroredZMirroredY, cube_337MirroredXMirroredZMirroredY, cube_338, cube_339MirroredZMirroredY, cube_340MirroredY, cube_341MirroredZ, cube_342MirroredXMirroredZMirroredY, cube_343MirroredZMirroredY, cube_344MirroredZ, cube_345MirroredZ, cylinder_024MirroredZ, sphere_003MirroredZ, cube_346MirroredZ, cube_347MirroredZ, cube_348MirroredZ, cube_349, cube_350, cube_351MirroredZMirroredY, cube_352MirroredZ, cube_353MirroredZMirroredY, cube_354MirroredXMirroredZMirroredY, cube_355, cube_356MirroredZMirroredY, cube_357MirroredY, cube_358MirroredZ, cube_359MirroredXMirroredZMirroredY, cube_360MirroredZMirroredY, cube_361, cube_362, cube_363, cube_364, cube_365, cube_372, cube_373, cube_374, cube_409Group, cube_410Group, cube_411, cube_412Group, cube_413Group, cube_414Group, cube_415GroupMirroredY, cube_416GroupMirroredY, cube_417GroupMirroredY, cube_418Group, cube_419Group, cube_420Group, cube_421Group, cube_422Group, cube_423Group, cube_424Group, cube_425GroupMirroredY, cube_426GroupMirroredY, cube_427GroupMirroredY, cube_428Group, cube_429Group, cube_430, cube_431Group, cube_432Group, cube_433Group, cube_442Group, cube_443Group, cube_444Group, cube_445Group, cube_446Group, cube_447Group, cube_448Group, cube_449Group, cube_450Group, cube_451Group, cube_452Group, cube_453Group, cube_454Group, cube_455Group, cube_456Group, cube_457Group, cube_458Group, cube_459Group, cube_460Group, cube_461Group, train_decor_top, cube_463, cube_464Group, cube_465Group, cube_466Group, cube_475Group, cube_476Group, cube_477Group, cube_478Group, cube_479Group, cube_480Group, cube_481Group, cube_482Group, cube_483Group, cube_484Group, cube_485Group, cube_486Group, cube_487Group, cube_488Group, cube_489Group, cube_490Group, cube_491Group, cube_492Group, train_floor, cube_533Group, cube_542Group, DrawTrainDoorFunctionEntityGroupMirroredZ);
return out;
}
function DrawRightDoorFunction() {
var cube_642Geometry = new THREE.BoxGeometry(2, 2, 2);
var Train_blue_003Material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(0.0343, 0.1009, 0.652),
 roughness: 0.5,
});
var Glass_003Material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(0.2227, 0.241, 0.3264),
 transparent: true,
 opacity: 0.315,
 roughness: 0.5,
});
var Coloumn_003Material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(0.0, 0.0, 0.0),
 roughness: 0.5,
});
var WhiteDots_003Material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(1.0, 1.0, 1.0),
});
var Metal_003Material = new THREE.MeshStandardMaterial({
 color: new THREE.Color(0.477, 0.477, 0.477),
 metalness: 1.0,
 roughness: 0.5,
});
var cube_642 = new THREE.Mesh(cube_642Geometry, Train_blue_003Material);
cube_642.position.set(-0.5485, 0.8713, -0.0051);
cube_642.scale.set(0.5484, 0.0351, 0.8609);
cube_642.setRot(1.5708, 3.1416, 0.0);
var cube_643Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_643 = new THREE.Mesh(cube_643Geometry, Glass_003Material);
cube_643.position.set(-0.5485, 2.5616, -0.0051);
cube_643.scale.set(-0.0151, 0.9163, 0.3739);
cube_643.setRot(0.0, 1.5708, 0.0);
var cube_644Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_644 = new THREE.Mesh(cube_644Geometry, Coloumn_003Material);
cube_644.scale.set(0.1252, 0.0309, 0.1349);
cube_644.setRot(1.5708, 3.1416, 0.7854);
var cube_644MY = cube_644.clone();
cube_644MY.updateMatrixWorld(true);
cube_644.position.set(0, 1.7421, 0);
cube_644MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_644MY.position.set(0, 3.3811, 0);
var cube_644MirroredY = new THREE.Group();
cube_644MirroredY.add(cube_644, cube_644MY);
cube_644MirroredY.position.set(-0.2006, 0, -0.0051);
var cube_645Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_645 = new THREE.Mesh(cube_645Geometry, Train_blue_003Material);
cube_645.position.set(-0.9986, 2.605, -0.0051);
cube_645.scale.set(0.0984, 0.0351, 0.8728);
cube_645.setRot(1.5708, 3.1416, 0.0);
var cube_646Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_646 = new THREE.Mesh(cube_646Geometry, Coloumn_003Material);
cube_646.position.set(-0.5511, 1.7302, -0.0051);
cube_646.scale.set(0.3579, 0.0309, 0.0215);
cube_646.setRot(1.5708, 3.1416, 0.0);
var cube_647Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_647 = new THREE.Mesh(cube_647Geometry, Coloumn_003Material);
cube_647.scale.set(0.1252, 0.0309, 0.1349);
cube_647.setRot(1.5708, 3.1416, 0.7854);
var cube_647MY = cube_647.clone();
cube_647MY.updateMatrixWorld(true);
cube_647.position.set(0, 1.7421, 0);
cube_647MY.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1));
cube_647MY.position.set(0, 3.3811, 0);
var cube_647MirroredY = new THREE.Group();
cube_647MirroredY.add(cube_647, cube_647MY);
cube_647MirroredY.position.set(-0.9097, 0, -0.0051);
var cube_648Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_648 = new THREE.Mesh(cube_648Geometry, WhiteDots_003Material);
cube_648.position.set(-0.0872, 0.5556, -0.0198);
cube_648.scale.set(0.087, 0.0279, 0.087);
cube_648.setRot(1.5708, 0.0, -0.0);
var cube_649Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_649 = new THREE.Mesh(cube_649Geometry, Coloumn_003Material);
cube_649.position.set(-0.0177, 2.3728, -0.0123);
cube_649.scale.set(2.3673, 0.0387, 0.0176);
cube_649.setRot(4.7124, 0.0, 1.5708);
var cube_650Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_650 = new THREE.Mesh(cube_650Geometry, Train_blue_003Material);
cube_650.position.set(-0.5485, 4.0511, -0.0051);
cube_650.scale.set(0.5484, 0.0351, 0.6526);
cube_650.setRot(1.5708, 3.1416, 0.0);
var cube_651Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_651 = new THREE.Mesh(cube_651Geometry, Glass_003Material);
cube_651.position.set(-0.5485, 2.5616, -0.0051);
cube_651.scale.set(-0.0151, 0.9163, 0.3739);
cube_651.setRot(0.0, 1.5708, 0.0);
var cube_652Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_652 = new THREE.Mesh(cube_652Geometry, Train_blue_003Material);
cube_652.position.set(-0.0985, 2.605, -0.0051);
cube_652.scale.set(0.0984, 0.0351, 0.8728);
cube_652.setRot(1.5708, 3.1416, 0.0);
var cube_653Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_653 = new THREE.Mesh(cube_653Geometry, WhiteDots_003Material);
cube_653.position.set(-0.6357, 1.1039, -0.0237);
cube_653.scale.set(0.7754, 0.0248, 0.1232);
cube_653.setRot(1.5708, 0.0, -0.7854);
var cube_654Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_654 = new THREE.Mesh(cube_654Geometry, Metal_003Material);
cube_654.position.set(-0.5485, 0.4296, -0.0099);
cube_654.scale.set(0.0294, 0.0351, 0.5456);
cube_654.setRot(-1.5708, 0.0, 1.5708);
var out = new THREE.Group();
out.add(cube_642, cube_643, cube_644MirroredY, cube_645, cube_646, cube_647MirroredY, cube_648, cube_649, cube_650, cube_651, cube_652, cube_653, cube_654);
return out;
}

function DrawStation() {
var out = new THREE.Group();
var textureLoader = new THREE.TextureLoader();
var load = textureLoader.load('http://livelab.spb.ru/labs/files/metromap2023r.jpg');
var MapMat = new THREE.MeshStandardMaterial({map:load,roughness:0.8,metalness:0.05});

var axesHelper = new THREE.AxesHelper(50);
out.add(axesHelper);

//КАРТИНА С ПЕТРОМ
var geom = new THREE.BoxGeometry(2, 2, 2);
var image_petr = new THREE.Mesh(geom, ColonaMat);
image_petr.position.set(-31, 5.5248, 0);
image_petr.scale.set(0.18, 3.8564, 3.3873);

var border_L = new THREE.Mesh(geom, BrassMat);
border_L.position.set(-31, 6.267, 3.5536);
border_L.scale.set(0.2035, 5.141, 0.2341);

var border_R = border_L.clone();
border_R.position.z = -3.667;

var border_D = new THREE.Mesh(geom, BrassMat);
border_D.position.set(-31, 1.3972, 0);
border_D.scale.set(0.2035, 3.6351, 0.2712);
border_D.rotation.x = PI/2;

//КОЛОННА
var geom = new THREE.BoxGeometry(2, 2, 2);
var cubeGroup = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube = new THREE.Mesh(geom, ColoumnPlateMat);
 cube.scale.y = 3.4789; cube.position.x = 6 * i;
 cubeGroup.add(cube);
}
cubeGroup.position.set(-30.709, 4.3331, 7.8995);

var cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_002Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_002 = new THREE.Mesh(cube_002Geometry, ColoumnPlateMat);
 cube_002.scale.set(0.4453, 0.2934, 0.9985);
 cube_002.position.set(2.8961 * i, -5.2527 * i, 0);
 cube_002Group.add(cube_002);
}
cube_002Group.setRot(0.0, 0.0, 1.0669);
cube_002Group.position.set(-29.8356, 4.92, 7.8995);



var cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_004Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_004 = new THREE.Mesh(cube_004Geometry, ColoumnPlateMat);
 cube_004.scale.set(0.4453, 0.4393, 0.9985);
 cube_004.position.set(4.771 * i, -3.6355 * i, 0);
 cube_004Group.add(cube_004);
}
cube_004Group.setRot(0.0, 0.0, 0.6511);
cube_004Group.position.set(-29.3814, 5.5959, 7.8995);
var cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_005Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_005 = new THREE.Mesh(cube_005Geometry, ColoumnPlateMat);
 cube_005.scale.set(0.4453, 0.2384, 0.9985);
 cube_005.position.set(5.7105 * i, -1.8349 * i, 0);
 cube_005Group.add(cube_005);
}
cube_005Group.setRot(0.0, 0.0, 0.3109);
cube_005Group.position.set(-28.5579, 5.832, 7.8995);
var cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_006Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_006 = new THREE.Mesh(cube_006Geometry, ColoumnPlateMat);
 cube_006.scale.set(0.4453, 0.1584, 0.9985);
 cube_006.position.set(5.9981 * i, 0, 0);
 cube_006Group.add(cube_006);
}
cube_006Group.position.set(-27.6974, 5.8917, 7.8995);
var cube_007Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_007Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_007 = new THREE.Mesh(cube_007Geometry, ColoumnPlateMat);
 cube_007.scale.set(0.4453, 0.2934, 0.9985);
 cube_007.position.set(2.8961 * i, 5.2527 * i, 0);
 cube_007Group.add(cube_007);
}
cube_007Group.setRot(0.0, 0.0, -1.0669);
cube_007Group.position.set(-25.5818, 4.92, 7.8995);
var cube_008Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_008 = new THREE.Mesh(cube_008Geometry, ColoumnPlateMat);
cube_008.position.set(-26.0135, 5.5959, 7.8995);
cube_008.scale.set(0.4453, 0.4393, 0.9985);
cube_008.setRot(0.0, 0.0, -0.6511);
var cube_009Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_009 = new THREE.Mesh(cube_009Geometry, ColoumnPlateMat);
cube_009.position.set(-26.8361, 5.832, 7.8995);
cube_009.scale.set(0.4453, 0.2384, 0.9985);
cube_009.setRot(0.0, 0.0, -0.3109);
var cube_011Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_011Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_011 = new THREE.Mesh(cube_011Geometry, ColoumnPlateMat);
 cube_011.scale.set(0.4453, 0.2384, 0.9985);
 cube_011.position.set(5.7105 * i, 1.8349 * i, 0);
 cube_011Group.add(cube_011);
}
cube_011Group.setRot(0.0, 0.0, -0.3109);
cube_011Group.position.set(-26.8361, 5.832, 7.8995);
var cube_012Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_012Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_012 = new THREE.Mesh(cube_012Geometry, ColoumnPlateMat);
 cube_012.scale.set(0.4453, 0.4393, 0.9985);
 cube_012.position.set(4.771 * i, 3.6355 * i, 0);
 cube_012Group.add(cube_012);
}
cube_012Group.setRot(0.0, 0.0, -0.6511);
cube_012Group.position.set(-26.0135, 5.5959, 7.8995);
var cube_013Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_013Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_013 = new THREE.Mesh(cube_013Geometry, Floor_ColumnsMat);
 cube_013.scale.set(0.4453, 0.2934, 0.6455);
 cube_013.position.set(2.8961 * i, 5.2527 * i, 0);
 cube_013Group.add(cube_013);
}
cube_013Group.setRot(0.0, 0.0, -1.0669);
cube_013Group.position.set(-25.6364, 4.92, 7.8995);
var cube_015Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_015Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube_015 = new THREE.Mesh(cube_015Geometry, Floor_ColumnsMat);
 cube_015.scale.set(1.05, 3.4789, 0.6455);
 cube_015.position.set(6.0 * i, 0, 0);
 cube_015Group.add(cube_015);
}
cube_015Group.position.set(-30.709, 4.3331, 7.8995);
var cube_016Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_016Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_016 = new THREE.Mesh(cube_016Geometry, Floor_ColumnsMat);
 cube_016.scale.set(0.4453, 0.2934, 0.6455);
 cube_016.position.set(2.8961 * i, -5.2527 * i, 0);
 cube_016Group.add(cube_016);
}
cube_016Group.setRot(0.0, 0.0, 1.0669);
cube_016Group.position.set(-29.777, 4.92, 7.8995);
var cube_017Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_017Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_017 = new THREE.Mesh(cube_017Geometry, Floor_ColumnsMat);
 cube_017.scale.set(0.4453, 0.4393, 0.6455);
 cube_017.position.set(4.771 * i, -3.6355 * i, 0);
 cube_017Group.add(cube_017);
}
cube_017Group.setRot(0.0, 0.0, 0.6511);
cube_017Group.position.set(-29.3235, 5.5959, 7.8995);
var cube_018Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_018Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_018 = new THREE.Mesh(cube_018Geometry, Floor_ColumnsMat);
 cube_018.scale.set(0.4453, 0.2384, 0.6455);
 cube_018.position.set(5.7105 * i, -1.8349 * i, 0);
 cube_018Group.add(cube_018);
}
cube_018Group.setRot(0.0, 0.0, 0.3109);
cube_018Group.position.set(-28.4432, 5.832, 7.8995);
var cube_019Geometry = new THREE.BoxGeometry(2, 2, 2);
var cube_019Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_019 = new THREE.Mesh(cube_019Geometry, Floor_ColumnsMat);
 cube_019.scale.set(0.4453, 0.1584, 0.6455);
 cube_019.position.set(5.9981 * i, 0, 0);
 cube_019Group.add(cube_019);
}
cube_019Group.position.set(-27.6974, 5.8583, 7.8995);


var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_020 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_020.position.set(-25.5818, 4.92, 7.8995);
cube_020.scale.set(0.4453, 0.2934, 0.9985);
cube_020.setRot(0.0, 0.0, -1.0669);
var cube_021Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_021 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_021.scale.set(0.4453, 0.4393, 0.6455);
 cube_021.position.set(4.771 * i, 3.6355 * i, 0);
 cube_021Group.add(cube_021);
}
cube_021Group.setRot(0.0, 0.0, -0.6511);
cube_021Group.position.set(-26.068, 5.5959, 7.8995);
var cube_022Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_022 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_022.scale.set(0.4453, 0.2384, 0.6455);
 cube_022.position.set(5.7105 * i, 1.8349 * i, 0);
 cube_022Group.add(cube_022);
}
cube_022Group.setRot(0.0, 0.0, -0.3109);
cube_022Group.position.set(-26.9447, 5.832, 7.8995);
var cube_010Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube_010 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_010.scale.set(1.0, 3.4789, 1.0);
 cube_010.position.set(6.0 * i, 0, 0);
 cube_010Group.add(cube_010);
}
cube_010Group.position.set(-30.709, 4.3331, -7.8995);
var cube_023Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube_023 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_023.scale.set(1.05, 3.4789, 0.6455);
 cube_023.position.set(6.0 * i, 0, 0);
 cube_023Group.add(cube_023);
}
cube_023Group.position.set(-30.709, 4.3331, -7.8995);
var cube_024Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_024 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_024.scale.set(0.4453, 0.2934, 0.9985);
 cube_024.position.set(2.8961 * i, -5.2527 * i, 0);
 cube_024Group.add(cube_024);
}
cube_024Group.setRot(0.0, 0.0, 1.0669);
cube_024Group.position.set(-29.8356, 4.92, -7.901);
var cube_025Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_025 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_025.scale.set(0.4453, 0.4393, 0.9985);
 cube_025.position.set(4.771 * i, -3.6355 * i, 0);
 cube_025Group.add(cube_025);
}
cube_025Group.setRot(0.0, 0.0, 0.6511);
cube_025Group.position.set(-29.3814, 5.5959, -7.901);
var cube_026Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_026 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_026.scale.set(0.4453, 0.2384, 0.9985);
 cube_026.position.set(5.7105 * i, -1.8349 * i, 0);
 cube_026Group.add(cube_026);
}
cube_026Group.setRot(0.0, 0.0, 0.3109);
cube_026Group.position.set(-28.5579, 5.832, -7.901);
var cube_027Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_027 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_027.scale.set(0.4453, 0.1584, 0.9985);
 cube_027.position.set(5.9981 * i, 0, 0);
 cube_027Group.add(cube_027);
}
cube_027Group.position.set(-27.6974, 5.8917, -7.901);
var cube_028Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_028 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_028.scale.set(0.4453, 0.2934, 0.9985);
 cube_028.position.set(2.8961 * i, 5.2527 * i, 0);
 cube_028Group.add(cube_028);
}
cube_028Group.setRot(0.0, 0.0, -1.0669);
cube_028Group.position.set(-25.5818, 4.92, -7.901);
var cube_029Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_029 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_029.scale.set(0.4453, 0.2384, 0.9985);
 cube_029.position.set(5.7105 * i, 1.8349 * i, 0);
 cube_029Group.add(cube_029);
}
cube_029Group.setRot(0.0, 0.0, -0.3109);
cube_029Group.position.set(-26.8361, 5.832, -7.901);
var cube_030Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_030 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_030.scale.set(0.4453, 0.4393, 0.9985);
 cube_030.position.set(4.771 * i, 3.6355 * i, 0);
 cube_030Group.add(cube_030);
}
cube_030Group.setRot(0.0, 0.0, -0.6511);
cube_030Group.position.set(-26.0135, 5.5959, -7.901);
var cube_031Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_031 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_031.scale.set(0.4453, 0.2934, 0.6455);
 cube_031.position.set(2.8961 * i, 5.2527 * i, 0);
 cube_031Group.add(cube_031);
}
cube_031Group.setRot(0.0, 0.0, -1.0669);
cube_031Group.position.set(-25.6364, 4.92, -7.901);
var cube_032Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_032 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_032.scale.set(0.4453, 0.2934, 0.6455);
 cube_032.position.set(2.8961 * i, -5.2527 * i, 0);
 cube_032Group.add(cube_032);
}
cube_032Group.setRot(0.0, 0.0, 1.0669);
cube_032Group.position.set(-29.777, 4.92, -7.901);
var cube_033Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_033 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_033.scale.set(0.4453, 0.4393, 0.6455);
 cube_033.position.set(4.771 * i, -3.6355 * i, 0);
 cube_033Group.add(cube_033);
}
cube_033Group.setRot(0.0, 0.0, 0.6511);
cube_033Group.position.set(-29.3235, 5.5959, -7.901);
var cube_034Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_034 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_034.scale.set(0.4453, 0.2384, 0.6455);
 cube_034.position.set(5.7105 * i, -1.8349 * i, 0);
 cube_034Group.add(cube_034);
}
cube_034Group.setRot(0.0, 0.0, 0.3109);
cube_034Group.position.set(-28.4432, 5.832, -7.901);
var cube_035Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_035 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_035.scale.set(0.4453, 0.1584, 0.6455);
 cube_035.position.set(5.9981 * i, 0, 0);
 cube_035Group.add(cube_035);
}
cube_035Group.position.set(-27.6974, 5.8583, -7.901);
var cube_036Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_036 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_036.scale.set(0.4453, 0.4393, 0.6455);
 cube_036.position.set(4.771 * i, 3.6355 * i, 0);
 cube_036Group.add(cube_036);
}
cube_036Group.setRot(0.0, 0.0, -0.6511);
cube_036Group.position.set(-26.068, 5.5959, -7.901);
var cube_037Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_037 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_037.scale.set(0.4453, 0.2384, 0.6455);
 cube_037.position.set(5.7105 * i, 1.8349 * i, 0);
 cube_037Group.add(cube_037);
}
cube_037Group.setRot(0, 0, -0.3109);
cube_037Group.position.set(-26.9447, 5.832, -7.901);

var cube_038 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_038.scale.set(8.2777, 3.4789, 1.0);
cube_038.setRot(0.0, 0.0, -0.0);
var cube_038MZ = cube_038.clone();
cube_038MZ.updateMatrixWorld(true);
cube_038.position.set(0, 0, 7.8995);
cube_038MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_038MZ.position.set(0, 0, -7.8995);
var cube_038MirroredZ = new THREE.Group();
cube_038MirroredZ.add(cube_038, cube_038MZ);
cube_038MirroredZ.position.set(44.5687, 4.3331, 0);

var cube_039 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_039.scale.set(1.0167, 3.4789, 2.3384);
var cube_039MZ = cube_039.clone();
cube_039MZ.updateMatrixWorld(true);
cube_039.position.set(0, 0, 9.2379);
cube_039MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_039MZ.position.set(0, 0, -9.2379);
var cube_039MirroredZ = new THREE.Group();
cube_039MirroredZ.add(cube_039, cube_039MZ);
cube_039MirroredZ.position.set(53.863, 4.3331, 0);

var cube_040 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_040.scale.set(15.8045, 3.4789, 1.128);
var cube_040MZ = cube_040.clone();
cube_040MZ.updateMatrixWorld(true);
cube_040.position.set(0, 0, 10.4484);
cube_040MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_040MZ.position.set(0, 0, -10.4484);
var cube_040MirroredZ = new THREE.Group();
cube_040MirroredZ.add(cube_040, cube_040MZ);
cube_040MirroredZ.position.set(70.6842, 4.3331, 0);

var cube_070Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_070 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_070.scale.set(2.0429, 0.9826, 0.9985);
 cube_070.position.set(5.998 * i, 0, 0);
 cube_070Group.add(cube_070);
}
cube_070Group.position.set(-27.6974, 6.8294, -7.901);
var cube_071Group = new THREE.Group();
for (var i = 0; i < 11; i++) {
 var cube_071 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_071.scale.set(2.0429, 0.9826, 0.9985);
 cube_071.position.set(5.998 * i, 0, 0);
 cube_071Group.add(cube_071);
}
cube_071Group.position.set(-27.6974, 6.8294, 7.901);

var cube_092 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_092.scale.set(8.9444, 3.4789, 1.0);
cube_092.setRot(0.0, 0.0, -0.0);
var cube_092MZ = cube_092.clone();
cube_092MZ.updateMatrixWorld(true);
cube_092.position.set(0, 0, 7.8995);
cube_092MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_092MZ.position.set(0, 0, -7.8995);
var cube_092MirroredZ = new THREE.Group();
cube_092MirroredZ.add(cube_092, cube_092MZ);
cube_092MirroredZ.position.set(-40.6534, 4.3331, 0);

var cube_300 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_300.scale.set(146.5053, 6.6273, 2.6352);
cube_300.setRot(0.0, 0.0, -0.0);
var cube_300MZ = cube_300.clone();
cube_300MZ.updateMatrixWorld(true);
cube_300.position.set(0, 0, 12.4841);
cube_300MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_300MZ.position.set(0, 0, -12.4841);
var cube_300MirroredZ = new THREE.Group();
cube_300MirroredZ.add(cube_300, cube_300MZ);
cube_300MirroredZ.position.set(197.0714, 3.2323, 0);

var cube_301 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_301.scale.set(146.5053, 6.6273, 2.6352);
cube_301.setRot(1.8693, 0.0, 0.0);
var cube_301MZ = cube_301.clone();
cube_301MZ.updateMatrixWorld(true);
cube_301.position.set(0, 0, 19.9295);
cube_301MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_301MZ.position.set(0, 0, -19.9295);
var cube_301MirroredZ = new THREE.Group();
cube_301MirroredZ.add(cube_301, cube_301MZ);
cube_301MirroredZ.position.set(197.0714, 10.2316, 0);

var cube_306 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_306.scale.set(146.5053, 6.6273, 2.6352);
cube_306.setRot(1.8693, 0.0, 0.0);
var cube_306MZ = cube_306.clone();
cube_306MZ.updateMatrixWorld(true);
cube_306.position.set(0, 0, 19.9273);
cube_306MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_306MZ.position.set(0, 0, -19.9273);
var cube_306MirroredZ = new THREE.Group();
cube_306MirroredZ.add(cube_306, cube_306MZ);
cube_306MirroredZ.position.set(-195.3522, 10.2316, 0);

var cube_bigroof = new THREE.Mesh(geo, Floor_CentralMat);
cube_bigroof.scale.set(347.5576, 0.1743, 6.2642);
cube_bigroof.setRot(1.5708, 0.0, 0.0);
var cube_bigroofMZ = cube_bigroof.clone();
cube_bigroofMZ.updateMatrixWorld(true);
cube_bigroof.position.set(0, 0, 22.6954);
cube_bigroofMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_bigroofMZ.position.set(0, 0, -22.6954);
var cube_bigroofMirroredZ = new THREE.Group();
cube_bigroofMirroredZ.add(cube_bigroof, cube_bigroofMZ);
cube_bigroofMirroredZ.position.set(-0.2398, -0.2095, 0);

var cube_bigroof_004 = new THREE.Mesh(geo, Floor_CentralMat);
cube_bigroof_004.scale.set(49.229, 0.1743, 3.3728);
cube_bigroof_004.setRot(1.5708, 0.0, 0.0);
var cube_bigroof_004MZ = cube_bigroof_004.clone();
cube_bigroof_004MZ.updateMatrixWorld(true);
cube_bigroof_004.position.set(0, 0, 14.5133);
cube_bigroof_004MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_bigroof_004MZ.position.set(0, 0, -14.5133);
var cube_bigroof_004MirroredZ = new THREE.Group();
cube_bigroof_004MirroredZ.add(cube_bigroof_004, cube_bigroof_004MZ);
cube_bigroof_004MirroredZ.position.set(-1.2151, -3.1009, 0);

var cube_escfloor_011 = new THREE.Mesh(geo, RoofTilesMat);
cube_escfloor_011.position.set(72.3317, 0.7364, -6.6458);
cube_escfloor_011.scale.set(1.3957, 0.9468, 0.1099);
cube_escfloor_011.setRot(1.5708, 0, 0);

var cube_041 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_041.position.set(53.7454, 7.9374, -0.0);
cube_041.scale.set(1.1221, 2.1309, 7.0248);


var cube_042 = new THREE.Mesh(geo, BrassMat);
cube_042.position.set(53.6094, 6.0196, -0.0);
cube_042.scale.set(1.2033, 0.1788, 7.0248);

var cube_043 = new THREE.Mesh(geo, BrassMat);
cube_043.scale.set(1.2033, 0.0529, 1.1606);
cube_043.setRot(1.5708, 0, 0);
var cube_043MZ = cube_043.clone();
cube_043MZ.updateMatrixWorld(true);
cube_043.position.set(0, 0, -5.01);
cube_043MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_043MZ.position.set(0, 0, 5.01);
var cube_043MirroredZ = new THREE.Group();
cube_043MirroredZ.add(cube_043, cube_043MZ);
cube_043MirroredZ.position.set(53.6094, 7.359, 0);

var cube_044 = new THREE.Mesh(geo, BrassMat);
cube_044.scale.set(1.2033, 0.0529, 1.7061);
cube_044.setRot(1.5708, 0.0, 0.0);
var cube_044MZ = cube_044.clone();
cube_044MZ.updateMatrixWorld(true);
cube_044.position.set(0, 0, -2.5808);
cube_044MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_044MZ.position.set(0, 0, 2.5808);
var cube_044MirroredZ = new THREE.Group();
cube_044MirroredZ.add(cube_044, cube_044MZ);
cube_044MirroredZ.position.set(53.6094, 7.9044, 0);

var cube_045 = new THREE.Mesh(geo, BrassMat);
cube_045.position.set(53.6094, 7.9044, -0.0);
cube_045.scale.set(1.2033, 0.0529, 1.7061);
cube_045.setRot(1.5708, 0.0, 0.0);

var cube_046 = new THREE.Mesh(geo, BrassMat);
cube_046.position.set(53.6429, 8.2123, -0.0);
cube_046.scale.set(1.2033, 0.0405, 5.5555);

var cube_047 = new THREE.Mesh(geo, Blue_PictureMat);
cube_047.position.set(52.4948, 8.1131, -0.0);
cube_047.scale.set(-0.0232, 1.9147, 4.9622);

var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_008 = new THREE.Mesh(geo, BrassMat);
cylinder_008.position.set(52.4284, 7.9374, -0.0);
cylinder_008.scale.set(1.0, 0.0534, 1.0);
cylinder_008.setRot(0.0, 0.0, -1.5708);

var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_009 = new THREE.Mesh(geo, WhiteDotsMat);
cylinder_009.position.set(52.3781, 7.9374, -0.0);
cylinder_009.scale.set(0.9637, 0.0534, 0.9637);
cylinder_009.setRot(0.0, 0.0, -1.5708);

var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_010 = new THREE.Mesh(geo, ColonaMat);
cylinder_010.position.set(52.3201, 7.9374, -0.0);
cylinder_010.scale.set(0.075, 0.0188, 0.075);
cylinder_010.setRot(0.0, 0.0, -1.5708);

var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_048 = new THREE.Mesh(geo, ColonaMat);
cube_048.position.set(52.3406, 8.3492, -0.0);
cube_048.scale.set(0.0334, 0.3772, 0.0334);

var cube_049 = new THREE.Mesh(geo, ColonaMat);
cube_049.position.set(52.3406, 8.0482, 0.3139);
cube_049.scale.set(0.0334, 0.305, 0.0334);
cube_049.setRot(1.2316, 0.0, 0.0);

var cube_050 = new THREE.Mesh(geo, ColonaMat);
cube_050.scale.set(0.0328, 0.0583, 0.0328);
cube_050.setRot(0.0, 0.0, -0.0);
var cube_050MX = cube_050.clone();
cube_050MX.updateMatrixWorld(true);
cube_050.position.set(52.3403, 0, 0);
cube_050MX.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
cube_050MX.position.set(52.416, 0, 0);
var cube_050MirroredX = new THREE.Group();
cube_050MirroredX.add(cube_050, cube_050MX);
cube_050MirroredX.position.set(0, 8.8056, -0.0);

var cube_051 = new THREE.Mesh(geo, ColonaMat);
cube_051.scale.set(0.0328, 0.0583, 0.0328);
cube_051.setRot(1.5708, 0.0, 0.0);
var cube_051MZ = cube_051.clone();
cube_051MZ.updateMatrixWorld(true);
cube_051.position.set(0, 0, 0.8682);
cube_051MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_051MZ.position.set(0, 0, -0.8682);
var cube_051MirroredZ = new THREE.Group();
cube_051MirroredZ.add(cube_051, cube_051MZ);
cube_051MirroredZ.position.set(52.3403, 7.9374, 0);

var cube_052 = new THREE.Mesh(geo, ColonaMat);
cube_052.scale.set(0.0328, 0.0583, 0.0328);
cube_052.setRot(2.3562, 0.0, 0.0);
var cube_052MZ = cube_052.clone();
cube_052MZ.updateMatrixWorld(true);
cube_052.position.set(0, 0, 0.6139);
cube_052MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_052MZ.position.set(0, 0, -0.6139);
var cube_052MirroredZ = new THREE.Group();
cube_052MirroredZ.add(cube_052, cube_052MZ);
cube_052MirroredZ.position.set(52.3403, 7.3235, 0);

var cube_053 = new THREE.Mesh(geo, ColonaMat);
cube_053.scale.set(0.0328, 0.0583, 0.0328);
cube_053.setRot(0.7854, 0, 0);
var cube_053MZ = cube_053.clone();
cube_053MZ.updateMatrixWorld(true);
cube_053.position.set(0, 0, 0.6139);
cube_053MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_053MZ.position.set(0, 0, -0.6139);
var cube_053MirroredZ = new THREE.Group();
cube_053MirroredZ.add(cube_053, cube_053MZ);
cube_053MirroredZ.position.set(52.3403, 8.5513, 0);

var geo = new THREE.CylinderGeometry(1, 1, 2, 12);
var clock_inside = new THREE.Mesh(geo, RoofTilesMat);
clock_inside.position.set(52.33, 7.94, 0);
clock_inside.scale.set(0.45, 0.01, 0.45);
clock_inside.rotation.z = PI/2;

var geo = new THREE.BoxGeometry(2,2,2);
//Временная переменная, пока для удобства
var xT = 38.1605;
var cube_054 = new THREE.Mesh(geo, MetalMat);
cube_054.position.set(xT, 2.3445, 6.9102);
cube_054.scale.set(1.2649, 0.9801, 0.0322);

var cube_055 = new THREE.Mesh(geo, MetalMat);
cube_055.position.set(xT, 3.1273, -6.8906);
cube_055.scale.set(1.6975, 1.1575, 0.0322);

var cube_056 = new THREE.Mesh(geo, Blue_PictureMat);
cube_056.position.set(xT, 2.9853, -6.8646);
cube_056.scale.set(1.6244, 0.9379, 0.0322);

var cube_057 = new THREE.Mesh(geo, Green_PictureMat);
cube_057.position.set(xT, 4.0931, -6.8646);
cube_057.scale.set(1.6244, 0.146, 0.0322);

var cube_058 = new THREE.Mesh(geo, MetalMat);
cube_058.position.set(xT, 4.4235, 6.9102);
cube_058.scale.set(1.2649, 0.9801, 0.0322);

var cube_059 = new THREE.Mesh(geo, Green_PictureMat);
cube_059.position.set(xT, 2.3445, 6.8851);
cube_059.scale.set(1.1847, 0.918, 0.0301);

var cube_060 = new THREE.Mesh(geo, Blue_PictureMat);
cube_060.position.set(xT, 4.4235, 6.8851);
cube_060.scale.set(1.1847, 0.918, 0.0301);

var cube_061 = new THREE.Mesh(geo, MetalMat);
cube_061.position.set(xT, 5.1875, -6.9009);
cube_061.scale.set(0.1398, 0.1398, 0.0286);

var cube_062 = new THREE.Mesh(geo, MetalMat);
cube_062.position.set(xT, 5.1875, -6.7612);
cube_062.scale.set(0.041, 0.041, 0.1231);

var cube_063 = new THREE.Mesh(geo, MetalMat);
cube_063.position.set(xT, 5.1875, -6.3446);
cube_063.scale.set(0.1035, 0.3, 0.3);

var cube_064 = new THREE.Mesh(geo, Green_PictureMat);
cube_064.position.set(xT, 5.1875, -6.3446);
cube_064.scale.set(0.1379, 0.2533, 0.2533);

var cube_065 = new THREE.Mesh(geo, WhiteDotsMat);
cube_065.position.set(xT, 5.1086, -6.3446);
cube_065.scale.set(0.1751, 0.1278, 0.0332);

//часы
var geo = new THREE.CylinderGeometry(1,1,2,16);
var clock_back = new THREE.Mesh(geo, WhiteDotsMat);
clock_back.position.set(38.1605, 5.3262, -6.3446);
clock_back.scale.set(0.0413, 0.1645, 0.0413);
clock_back.setRot(0.0, 0.0, -1.5708);

//КАРТА МЕТРО НА СТЕНАХ
var geo = new THREE.BoxGeometry(2,2,2);
var map = new THREE.Mesh(geo, MapMat);
map.scale.set(0.04, 0.67, 0.47);

var map_01_L = new THREE.Group();
for (var i = 0; i < 5; i++) {
 var cube_Temp = map.clone();
 cube_Temp.position.x = 12*i;
 map_01_L.add(cube_Temp);
}

map_01_L.position.set(-23.6566, 3.1162, 0);
var map_02_L = map_01_L.clone();
map_02_L.position.x = -25.75;

var maps_L = new THREE.Group();
maps_L.add(map_01_L,map_02_L);
maps_L.position.z = 7.9;

var maps_R = maps_L.clone();
maps_R.position.z = -7.9;


var geo = new THREE.BoxGeometry(2,2,2);
var cube_072 = new THREE.Mesh(geo, Green_PictureMat);
    cube_072.scale.set(337.424, 0.0913, 3.9259);
var cube_072MZ = cube_072.clone();
    cube_072MZ.updateMatrixWorld(true);
    cube_072.position.set(0, 0, 18.6043);
    cube_072MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_072MZ.position.set(0, 0, -18.6043);
var cube_072MirroredZ = new THREE.Group();
    cube_072MirroredZ.add(cube_072, cube_072MZ);
    cube_072MirroredZ.position.set(-0.9392, -1.8809, 0);

var cube_073 = new THREE.Mesh(geo, Green_PictureMat);
    cube_073.scale.set(350.9227, 0.0913, 0.6522);
    cube_073.setRot(-1.0876, 0, 0);
var cube_073MZ = cube_073.clone();
    cube_073MZ.updateMatrixWorld(true);
    cube_073.position.set(0, 0, 22.347);
    cube_073MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_073MZ.position.set(0, 0, -22.347);
var cube_073MirroredZ = new THREE.Group();
    cube_073MirroredZ.add(cube_073, cube_073MZ);
    cube_073MirroredZ.position.set(-2.026, -1.6274, 0);

var cube_074 = new THREE.Mesh(geo, MetalMat);
    cube_074.scale.set(352.5921, 0.2605, 0.166);
var cube_074MZ = cube_074.clone();
    cube_074MZ.updateMatrixWorld(true);
    cube_074.position.set(0, 0, 16.1386);
    cube_074MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_074MZ.position.set(0, 0, -16.1386);
var cube_074MirroredZ = new THREE.Group();
    cube_074MirroredZ.add(cube_074, cube_074MZ);
    cube_074MirroredZ.position.set(-1.2826, -1.529, 0);

var cube_075 = new THREE.Mesh(geo, MetalMat);
    cube_075.scale.set(352.5921, 0.2605, 0.166);
var cube_075MZ = cube_075.clone();
    cube_075MZ.updateMatrixWorld(true);
    cube_075.position.set(0, 0, 21.0701);
    cube_075MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_075MZ.position.set(0, 0, -21.0701);
var cube_075MirroredZ = new THREE.Group();
    cube_075MirroredZ.add(cube_075, cube_075MZ);
    cube_075MirroredZ.position.set(-1.2826, -1.529, 0);

var cube_076 = new THREE.Mesh(geo, ColonaMat);
    cube_076.scale.set(350.9227, 0.0913, 1.6548);
    cube_076.setRot(1.5708, 0, 0);
var cube_076MZ = cube_076.clone();
    cube_076MZ.updateMatrixWorld(true);
    cube_076.position.set(0, 0, 22.5792);
    cube_076MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_076MZ.position.set(0, 0, -22.5792);
var cube_076MirroredZ = new THREE.Group();
    cube_076MirroredZ.add(cube_076, cube_076MZ);
    cube_076MirroredZ.position.set(-2.026, 0.2518, 0);

var cube_297 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_297.position.set(70.754, 7.9374, 0);
    cube_297.scale.set(15.8864, 2.1309, 7.0248);

var cube_298 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_298.position.set(70.754, 6.6102, 0);
    cube_298.scale.set(15.8864, 0.3534, 10.2896);

var cube_299 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_299.position.set(80.1152, 3.775, 0);
    cube_299.scale.set(3.5137, 0.3534, 10.2896);
    cube_299.setRot(0, 0, -1.5708);
var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinderGroup = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder = new THREE.Mesh(geo, ColonaMat);
 cylinder.scale.set(0.5, 2.5, 0.5);
 cylinder.position.set(6*i, 0, 0);
 cylinderGroup.add(cylinder);
}
cylinderGroup.position.set(-30.709, 3.2961, -7.1816);


var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_001Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_001 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_001.scale.set(0.55, 0.2319, 0.55);
 cylinder_001.position.set(6*i, 0, 0);
 cylinder_001Group.add(cylinder_001);
}cylinder_001Group.position.set(-30.709, 1.0416, -7.1816);


var cylinder_003Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_003 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_003.scale.set(0.55, 0.3036, 0.55);
 cylinder_003.position.set(6.0 * i, 0, 0);
 cylinder_003Group.add(cylinder_003);
}
cylinder_003Group.position.set(-30.709, 5.47, -7.1816);
var cylinder_004Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_004 = new THREE.Mesh(geo, BrassMat);
 cylinder_004.scale.set(0.6, 0.1363, 0.6);
 cylinder_004.position.set(6*i, 0, 0);
 cylinder_004Group.add(cylinder_004);
}
cylinder_004Group.position.set(-30.709, 5.4668, -7.1816);


var geo = new THREE.TorusGeometry(1, 0.25, 12, 24);
var torus_001Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_001 = new THREE.Mesh(geo, BrassMat);
 torus_001.scale.set(0.5, 0.5, 0.52);
 torus_001.position.set(6*i, 0, 0);
 torus_001Group.add(torus_001);
}
torus_001Group.setRot(1.5708, 0, 0);
torus_001Group.position.set(-30.709, 1.0461, -7.1816);
var torus_002Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_002 = new THREE.Mesh(geo, BrassMat);
 torus_002.scale.set(0.52, 0.52, 0.52);
 torus_002.position.set(6*i, 0, 0);
 torus_002Group.add(torus_002);
}
torus_002Group.setRot(1.5708, 0, 0);
torus_002Group.position.set(-30.709, 5.7037, -7.1816);
var torus_003Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_003 = new THREE.Mesh(geo, BrassMat);
 torus_003.scale.set(0.52, 0.52, 0.2641);
 torus_003.position.set(6*i, 0, 0);
 torus_003Group.add(torus_003);
}
torus_003Group.setRot(1.5708, 0, 0);
torus_003Group.position.set(-30.709, 5.307, -7.1816);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_003Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube_003 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_003.scale.set(0.7, 0.0759, 0.7);
 cube_003.position.set(6*i, 0, 0);
 cube_003Group.add(cube_003);
}
cube_003Group.position.set(-30.709, 5.8089, -7.1816);

var cube_floor_central = new THREE.Mesh(geo, Floor_CentralMat);
    cube_floor_central.position.set(24.3999, 0.5684, 0);
    cube_floor_central.scale.set(56.1089, 0.2965, 6.3485);

var cube_floor_columns = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_floor_columns.scale.set(65.4645, 0.2965, 2.497);
var cube_floor_columnsMZ = cube_floor_columns.clone();
    cube_floor_columnsMZ.updateMatrixWorld(true);
    cube_floor_columns.position.set(0, 0, -8.8396);
    cube_floor_columnsMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_floor_columnsMZ.position.set(0, 0, 8.8396);
var cube_floor_columnsMirroredZ = new THREE.Group();
    cube_floor_columnsMirroredZ.add(cube_floor_columns, cube_floor_columnsMZ);
    cube_floor_columnsMirroredZ.position.set(15.9462, 0.5578, 0);

var cube_floor_sided = new THREE.Mesh(geo, Floor_Sides_1Mat);
    cube_floor_sided.scale.set(50.6075, 0.2965, 0.2803);
var cube_floor_sidedMZ = cube_floor_sided.clone();
    cube_floor_sidedMZ.updateMatrixWorld(true);
    cube_floor_sided.position.set(0, 0, -11.612);
    cube_floor_sidedMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_floor_sidedMZ.position.set(0, 0, 11.612);
var cube_floor_sidedMirroredZ = new THREE.Group();
    cube_floor_sidedMirroredZ.add(cube_floor_sided, cube_floor_sidedMZ);
    cube_floor_sidedMirroredZ.position.set(0.3561, 0.5394, 0);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_floor_trainsside = new THREE.Mesh(geo, Floor_CentralMat);
    cube_floor_trainsside.scale.set(51.4855, 0.2965, 1.7465);
var cube_floor_trainssideMZ = cube_floor_trainsside.clone();
    cube_floor_trainssideMZ.updateMatrixWorld(true);
    cube_floor_trainsside.position.set(0, 0, -13.6124);
    cube_floor_trainssideMZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_floor_trainssideMZ.position.set(0, 0, 13.6124);
var cube_floor_trainssideMirroredZ = new THREE.Group();
    cube_floor_trainssideMirroredZ.add(cube_floor_trainsside, cube_floor_trainssideMZ);
    cube_floor_trainssideMirroredZ.position.set(-0.5219, 0.5684, 0);

var cube_stripes_002 = new THREE.Mesh(geo, YellowMat);
    cube_stripes_002.scale.set(-59.1002, 0.0239, 0.1614);
var cube_stripes_002MZ = cube_stripes_002.clone();
    cube_stripes_002MZ.updateMatrixWorld(true);
    cube_stripes_002.position.set(0, 0, 4.7543);
    cube_stripes_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_stripes_002MZ.position.set(0, 0, -4.7543);
var cube_stripes_002MirroredZ = new THREE.Group();
    cube_stripes_002MirroredZ.add(cube_stripes_002, cube_stripes_002MZ);
    cube_stripes_002MirroredZ.position.set(23.6445, 0.8634, 0);

var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_002Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_002 = new THREE.Mesh(geo, ColonaMat);
 cylinder_002.scale.set(0.5, 2.5, 0.5);
 cylinder_002.position.set(6.0 * i, 0, 0);
 cylinder_002Group.add(cylinder_002);
}
cylinder_002Group.position.set(-30.7, 3.2961, 7.171);

//РАЗМЕТКА
function razmetka(n){
    var razmetka = new THREE.Group();

    //ЖЕЛТЫЕ ПОЛОСЫ
    var geom = new THREE.PlaneGeometry(0.8, 0.3);
    var stripes_L = new THREE.Group();
    for (var i = 0; i < n+1; i++) {
     var stripe = new THREE.Mesh(geom, YellowMat);
     stripe.position.x = 1.2135*i; stripes_L.add(stripe);
    }
    stripes_L.position.x = -49.0516;

    //БЕЛЫЕ ТОЧКИ
    var geom = new THREE.CircleGeometry(0.13, 8)
    var dots_L = new THREE.Group();
    for (var i = 0; i < n; i++) {
     var stripeDots = new THREE.Mesh(geom, WhiteDotsMat);
     stripeDots.position.x = 1.2134*i; dots_L.add(stripeDots);
    }
    dots_L.position.x = -48.4447;

    //СБОРКА
    razmetka.position.y = 0.88; razmetka.rotation.x = -PI/2;
    razmetka.add(stripes_L,dots_L); 
    return razmetka;
}
var razmetka_L = razmetka(82); razmetka_L.position.z =  14.5;
var razmetka_R = razmetka(82); razmetka_R.position.z = -14.5;


var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_005Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_005 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_005.scale.set(0.55, 0.2319, 0.55);
 cylinder_005.position.x = 6*i;
 cylinder_005Group.add(cylinder_005);
}
cylinder_005Group.position.set(-30.709, 1.0416, 7.1711);
var geo = new THREE.TorusGeometry(1, 0.25, 12, 24);
var torus_004Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_004 = new THREE.Mesh(geo, BrassMat);
 torus_004.scale.set(0.5, 0.5, 0.5233);
 torus_004.position.x = 6*i;
 torus_004Group.add(torus_004);
}
torus_004Group.setRot(1.5708, 0.0, 0.0);
torus_004Group.position.set(-30.709, 1.0461, 7.1657);
var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_006Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_006 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_006.scale.set(0.55, 0.3036, 0.55);
 cylinder_006.position.x = 6*i;
 cylinder_006Group.add(cylinder_006);
}
cylinder_006Group.position.set(-30.709, 5.47, 7.1711);
var geo = new THREE.TorusGeometry(1, 0.25, 12, 24);
var torus_005Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_005 = new THREE.Mesh(geo, BrassMat);
 torus_005.scale.set(0.52, 0.52, 0.2641);
 torus_005.position.x = 6*i;
 torus_005Group.add(torus_005);
}
torus_005Group.setRot(1.5708, 0.0, 0.0);
torus_005Group.position.set(-30.709, 5.307, 7.1655);
var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_007Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cylinder_007 = new THREE.Mesh(geo, BrassMat);
 cylinder_007.scale.set(0.6, 0.1363, 0.6);
 cylinder_007.position.x = 6*i;
 cylinder_007Group.add(cylinder_007);
}
cylinder_007Group.position.set(-30.709, 5.4668, 7.1711);
var geo = new THREE.BoxGeometry(2,2,2);
var cube_001Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var cube_001 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_001.scale.set(0.7, 0.0759, 0.7);
 cube_001.position.x = 6*i;
 cube_001Group.add(cube_001);
}
cube_001Group.position.set(-30.709, 5.8089, 7.1711);
var geo = new THREE.TorusGeometry(1, 0.25, 12, 24);
var torus_006Group = new THREE.Group();
for (var i = 0; i < 12; i++) {
 var torus_006 = new THREE.Mesh(geo, BrassMat);
 torus_006.scale.set(0.52, 0.52, 0.5233);
 torus_006.position.x = 6*i;
 torus_006Group.add(torus_006);
}
torus_006Group.setRot(1.5708, 0, 0);
torus_006Group.position.set(-30.709, 5.7037, 7.1711);

//ОГРАЖДЕНИЕ ДЛЯ РОБОТОВ
var geo = new THREE.BoxGeometry(2,2,2);
var cube_stripes_006 = new THREE.Mesh(geo, YellowMat);
cube_stripes_006.position.set(76.6066, 0.8634, 0.0932);
cube_stripes_006.scale.set(-5.1172, 0.0239, 0.1614);
cube_stripes_006.rotation.y = PI/2;
//ОГРАЖДЕНИЕ ДЛЯ РОБОТОВ ПОД ПЕТРОМ
var cube_stripes_004 = cube_stripes_006.clone();
cube_stripes_004.position.x = -31.1419;


var geo = new THREE.BoxGeometry(2,2,2);
var cube_backwall = new THREE.Mesh(geo, FloorTileMat);
cube_backwall.position.set(-40.9615, 5.4803, 0);
cube_backwall.scale.set(9.4309, 4.626, 8.2679);

var cube_coloumnsupper_001 = new THREE.Mesh(geo, Floor_ColumnsMat);
cube_coloumnsupper_001.scale.set(42.5516, 0.1921, 0.7246);
var cube_coloumnsupper_001MZ = cube_coloumnsupper_001.clone();
cube_coloumnsupper_001MZ.updateMatrixWorld(true);
cube_coloumnsupper_001.position.set(0, 0, -6.1536);
cube_coloumnsupper_001MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_coloumnsupper_001MZ.position.set(0, 0, 6.1536);
var cube_coloumnsupper_001MirroredZ = new THREE.Group();
cube_coloumnsupper_001MirroredZ.add(cube_coloumnsupper_001, cube_coloumnsupper_001MZ);
cube_coloumnsupper_001MirroredZ.position.set(10.4587, 7.0259, 0);

var cube_coloumnsupper_002 = new THREE.Mesh(geo, Floor_ColumnsMat);
cube_coloumnsupper_002.scale.set(42.5516, 0.1921, 0.7246);
cube_coloumnsupper_002.setRot(-0.7258, 0, 0);
var cube_coloumnsupper_002MZ = cube_coloumnsupper_002.clone();
cube_coloumnsupper_002MZ.updateMatrixWorld(true);
cube_coloumnsupper_002.position.set(0, 0, -6.124);
cube_coloumnsupper_002MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_coloumnsupper_002MZ.position.set(0, 0, 6.124);
var cube_coloumnsupper_002MirroredZ = new THREE.Group();
cube_coloumnsupper_002MirroredZ.add(cube_coloumnsupper_002, cube_coloumnsupper_002MZ);
cube_coloumnsupper_002MirroredZ.position.set(10.4587, 6.5967, 0);

var cube_coloumnsupper_003 = new THREE.Mesh(geo, Floor_ColumnsMat);
cube_coloumnsupper_003.scale.set(42.5516, 0.1921, 0.7246);
var cube_coloumnsupper_003MZ = cube_coloumnsupper_003.clone();
cube_coloumnsupper_003MZ.updateMatrixWorld(true);
cube_coloumnsupper_003.position.set(0, 0, -7.1651);
cube_coloumnsupper_003MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
cube_coloumnsupper_003MZ.position.set(0, 0, 7.1651);
var cube_coloumnsupper_003MirroredZ = new THREE.Group();
cube_coloumnsupper_003MirroredZ.add(cube_coloumnsupper_003, cube_coloumnsupper_003MZ);
cube_coloumnsupper_003MirroredZ.position.set(10.4587, 6.0642, 0);

var cube_backwall_001 = new THREE.Mesh(geo, FloorTileMat);
cube_backwall_001.position.set(-53.4691, 1.9826, 0);
cube_backwall_001.scale.set(3.0767, 9.221, 14.9665);

var cube_backwall_002 = new THREE.Mesh(geo, FloorTileMat);
cube_backwall_002.position.set(-182.3204, 1.9826, 0);
cube_backwall_002.scale.set(125.7746, 9.221, 14.9665);


out.add(image_petr, border_L, border_R, border_D, cubeGroup, cube_002Group, cube_004Group, cube_005Group, cube_006Group, cube_007Group, cube_008, cube_009, cube_011Group, cube_012Group, cube_013Group, cube_015Group, cube_016Group, cube_017Group, cube_018Group, cube_019Group, cube_020, cube_021Group, cube_022Group, cube_010Group, cube_023Group, cube_024Group, cube_025Group, cube_026Group, cube_027Group, cube_028Group, cube_029Group, cube_030Group, cube_031Group, cube_032Group, cube_033Group, cube_034Group, cube_035Group, cube_036Group, cube_037Group, cube_038MirroredZ, cube_039MirroredZ, cube_040MirroredZ, cube_070Group, cube_071Group, cube_092MirroredZ, cube_300MirroredZ, cube_301MirroredZ, cube_306MirroredZ, cube_bigroofMirroredZ, cube_bigroof_004MirroredZ, cube_escfloor_011, cube_041, cube_042, cube_043MirroredZ, cube_044MirroredZ, cube_045, cube_046, cube_047, cylinder_008, cylinder_009, cylinder_010, cube_048, cube_049, cube_050MirroredX, cube_051MirroredZ, cube_052MirroredZ, cube_053MirroredZ, clock_inside, cube_054, cube_055, cube_056, cube_057, cube_058, cube_059, cube_060, cube_061, cube_062, cube_063, cube_064, cube_065, clock_back, maps_L, maps_R, cube_072MirroredZ, cube_073MirroredZ, cube_074MirroredZ, cube_075MirroredZ, cube_076MirroredZ, cube_297, cube_298, cube_299, cylinderGroup, cylinder_001Group, cube_003Group, cylinder_003Group, cylinder_004Group, torus_001Group, torus_002Group, torus_003Group, cube_floor_central, cube_floor_columnsMirroredZ, cube_floor_sidedMirroredZ, cube_floor_trainssideMirroredZ, razmetka_L, razmetka_R, cube_stripes_002MirroredZ, cylinder_002Group, cylinder_005Group, torus_004Group, cylinder_006Group, torus_005Group, cylinder_007Group, cube_001Group, torus_006Group, cube_stripes_006, cube_stripes_004, cube_backwall, cube_coloumnsupper_001MirroredZ, cube_coloumnsupper_002MirroredZ, cube_coloumnsupper_003MirroredZ, cube_backwall_001, cube_backwall_002);
return out;
}
function animatorByName(animations, endtime, times) {
var clock = 0;
var _startTimes = times;
var animate = function () {
 if (clock === endtime) {
     times--;
     clock = 0;
 }
 if (!times)
     return;
 clock++;
 for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
     var it = animations_1[_i];
     if (it.startTime > clock || it.startTime + it.time <= clock)
         continue;
     var objects = scene.GetObjectsByProperty('name', it.objectName);
     for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
         var object = objects_1[_a];
         if (it.type === 'position') {
             object.position.lerp(it.vector, (clock - it.startTime) / it.time);
         }
         if (it.type === 'rotation') {
             object.rotation.setFromVector3(new THREE.Vector3()
                 .setFromEuler(object.rotation)
                 .lerp(it.vector, (clock - it.startTime) / it.time));
         }
         if (it.type === 'scale') {
             object.scale.lerp(it.vector, (clock - it.startTime) / it.time);
         }
     }
 }
};
var reset = function () {
 clock = 0;
 times = _startTimes;
};
return [animate, reset];
}
function iniDoorsAnimation() {
return animatorByName([
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
], 300, 1);
}
function SetColorStuff(){
PurpleMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.4,0,0.8),roughness:0.5});
ColonaMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2,0.2,0.2),roughness:0.8});
BrassMat = new THREE.MeshStandardMaterial ({color:new THREE.Color(0.8,0.8,0),roughness:0.1,metalness:0.9});
RoofTilesMat = new THREE.MeshStandardMaterial({color:0xEEEEEE,metalness:1,emissive:0xEEEEEE});
ColoumnPlateMat = new THREE.MeshStandardMaterial ({color:new THREE.Color(0.4,0.3,0.2),roughness:0.5});
Floor_ColumnsMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2,0.15,0.1),roughness:0.2,metalness:0.1});
Floor_CentralMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.5,0.4,0.3),roughness:0.9,metalness:0.1});
Blue_PictureMat = new THREE.MeshStandardMaterial ({color:new THREE.Color(0.1,0.3,0.8),roughness:0.5});
WhiteDotsMat = new THREE.MeshStandardMaterial({color:0xEEEEEE});
MetalMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.5,0.5,0.5),metalness:1,roughness:0.5});
Green_PictureMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.1,0,0),roughness:0.9,metalness:0.8});
Floor_Sides_1Mat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.3,0.3,0.2),roughness:0.3,metalness:0.1});
//нельзя менять
YellowMat = new THREE.MeshStandardMaterial({color: new THREE.Color(1,0.522,0)});
FloorTileMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.5,0.5,0.3),roughness:0.5,metalness:0.1});
Washer_mainMatDS = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2,0.3,0.3),side:THREE.DoubleSide,roughness:0.5});
WasherMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2,0.3,0.3),roughness:0.5});
Floor_trainMat = new THREE.MeshStandardMaterial({color:0x664444,roughness:0.7,metalness:0.1});
cube_108Mat = new THREE.MeshStandardMaterial({color:new THREE.Color(0.2,0.8,0.4)});
Train_blueMat = new THREE.MeshStandardMaterial({color:new THREE.Color(0,0.1,0.7),roughness:0.5});
}

function CreateScene(WC, HC) {
var _a;
THREE.Object3D.prototype.setRot = function (x_rot,y_rot,z_rot) {
 this.rotateOnWorldAxis(new THREE.Vector3(1,0,0),x_rot);
 this.rotateOnWorldAxis(new THREE.Vector3(0,0,1),z_rot);
 this.rotateOnWorldAxis(new THREE.Vector3(0,1,0),y_rot);
};
THREE.Object3D.prototype.GetObjectsByProperty = function (name, value, result) {
 if (result === void 0) { result = []; }
 if (this[name] === value) { result.push(this); }
 var children = this.children;
 for (var i = 0, l = children.length; i < l; i++) {
     children[i].GetObjectsByProperty(name, value, result);
 }
 return result;
};
if (typeof sceneexist == 'undefined') {
 sceneexist = true;
 scene = new THREE.Scene();
 scene.background = new THREE.Color(0x444488);
 cameras.main = new THREE.PerspectiveCamera(70,WC/HC,0.1,1000);
 renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.setPixelRatio(window.devicePixelRatio);
 (_a = document.getElementById('wCanvas')) === null || _a === void 0 ? void 0 : _a.appendChild(renderer.domElement);
 renderer.setSize(WC, HC);
 controls = new THREE.OrbitControls(cameras.main, renderer.domElement);
 cameras.main.position.set(15,10,0);
 controls.update();
 controls.rotateSpeed = 1;
 controls.zoomSpeed = 1.2;
 controls.panSpeed = 0.8;
 // Инициализация камер
 // Заготовки позиций и направлений
 var cams = [
     [new THREE.Vector3(-30, 6.74, -0.205), new THREE.Vector3(1,0,0)],
     [new THREE.Vector3(49.8, 7.434, -0.795), new THREE.Vector3(-1,0,0)],
     [new THREE.Vector3(-34.6, 6.15, -10.056), new THREE.Vector3(1,0,0)],
     [new THREE.Vector3(38.6, 5.21, 10.95), new THREE.Vector3(-1,0,0)], // Шушары
 ];
 // Сохраняем камеры в переменную
 cameras.poi = cams.map(function (cam) {
     var coord = cam[0], dir = cam[1];
     var newCam = new THREE.PerspectiveCamera(70, WC / HC, 0.1, 1000);
     var x = coord.x, y = coord.y, z = coord.z;
     newCam.position.set(x, y, z);
     newCam.lookAt(newCam.position.clone().add(dir));
     return newCam;
 });
 currentCamera = cameras.main;

 var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
 var ambiLight = new THREE.AmbientLight(0xffffff, 1.5);
 dirLight1.position.set(5,1, 7);
 scene.add(ambiLight,dirLight1);

}
}
// Следующие две функции нужны для переключения камеры с помощью <select>
// Функция находит select#ChangeCamera на странице, настраивает onclick действие
function initChangeCameraControls() {
var control = document.querySelector('select#ChangeCamera');
if (!control) {
 console.error('Список камер не найден на странице!');
 return;
}
control.addEventListener('input', ChangeCamera);
}
// Срабатывает при выборе камеры из списка
// Меняет currentCamera.
// currentCamera используется в render(): renderer.render(scene, currentCamera)
function ChangeCamera(e) {
var _a;
var select = e.target;
var value = select.value;
if (!value.includes('poi'))
 currentCamera = cameras[value];
else {
 var index = parseInt(value.split('_')[1]);
 currentCamera = (_a = cameras.poi) === null || _a === void 0 ? void 0 : _a[index];
}
}

{{html
<!DOCTYPE html>
<head>
<script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
<script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
<style>html, body {overflow: hidden;}</style>
<select id="ChangeCamera">
 <option value="main" selected>Главная</option>
 <option value="robot">Робот</option>
 <option value="robotCleaner">Робот-пылесос</option>
 <option value="poi_0">Начало платформы</option>
 <option value="poi_1">Конец платформы</option>
 <option value="poi_2">Направление: Комендантский проспект</option>
 <option value="poi_3">Направлене: Шушары</option>
</select
</head>
html}}
