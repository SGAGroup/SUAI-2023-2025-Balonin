if (tick == 0) {
 if (typeof sceneexist == 'undefined') {
     WC=window.innerWidth*0.75;HC=window.innerHeight*0.75;
     OpenCanvas('wCanvas',WC,HC);
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
     
     rob = DrawRobotM();
     rob.position.set(X+10*W, Y+20*W, Z);
     rob.scale.set(W, W, W);
     rob.rotation.x = -PI/2;
     scene.add(rob);
 }
}
F = true;
restart(20);
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
_a = iniDoorsAnimation(), animateDoors = _a[0], resetAnimateDoors = _a[1];
IniSonarV(RobotMData);
IniSonarV(CleanRobotData);
//Init Trains
trains = [];
trainArriveTime = 200;
trainStayTime = 300;
trainSumTime = 800;
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
var rightDoor = DrawRightDoor();
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
var cube_075 = cube_074.clone();var cube_079 = cube_074.clone();
var cube_083 = cube_074.clone();var cube_084 = cube_074.clone();
var cube_098 = cube_074.clone();
    cube_074.setRot(0,0.0641,0);cube_074.scale.set(0.5784,0.1078,0.0355);cube_074.position.set(-0.1438,0.4107,-0.386);
//side panel
    cube_075.setRot(0,0.0641,0);cube_075.scale.set(0.5784,0.0382,0.0355);cube_075.position.set(-0.1438,0.5567 -0.386);
//side panel
    cube_079.setRot(0,0.0641,0);cube_079.scale.set(0.5693,0.0382,0.0355);cube_079.position.set(-0.1529,0.6332,-0.3854);
//side panel
    cube_083.setRot(0,0.0641,0);cube_083.scale.set(0.5654,0.0382,0.0355);cube_083.position.set(-0.1568,0.7097,-0.3851);
//side panel
    cube_084.setRot(0,0.0641,0);cube_084.scale.set(0.5537,0.0382,0.0355);cube_084.position.set(-0.1685,0.7862,-0.3844);
//side panel
    cube_098.setRot(0,0.0641,0);cube_098.scale.set(0.5438,0.0454,0.0355);cube_098.position.set(-0.1784,0.8698,-0.3837);
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
//decor front (самый верх)
var cube_106 = new THREE.Mesh(geo, ColonaMat);
    cube_106.setRot(-0.8884,0,-1.3109);
    cube_106.scale.set(0.0783, 0.0086, 0.013);
    cube_106.position.set(0.3421, 0.9384, -0.4562);
var cube_106MirroredZ = new THREE.Group();
    cube_106MirroredZ.add(cube_076,cube_077,cube_078,cube_080,cube_106);

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
var cylinder_009 = new THREE.Mesh(geo, BrownMat);
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

var cube_110 = new THREE.Mesh(geo, BrownMat);
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

var cylinder_019 = new THREE.Mesh(geo, BrownMat);
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

var cylinder_020 = new THREE.Mesh(geo, BrownMat);
    cylinder_020.position.set(-0.6668, 0.1409, 0);
    cylinder_020.scale.set(-0.0284, -0.1868, -0.0284);
    cylinder_020.setRot(1.5708, 0, 0);

var cyl_021 = new THREE.Mesh(geo, BlueMat);
    cyl_021.position.set(-0.777, 0.6567, -0.0954);
    cyl_021.scale.set(0.0196, 0.0044, 0.0196);
    cyl_021.setRot(0.0, -0.0, 1.2552);
var cylinder_022 = new THREE.Mesh(geo, YellowMat);
    cylinder_022.position.set(-0.7865, 0.6277, -0.0411);
    cylinder_022.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_022.setRot(0.0, -0.0, 1.2552);
var cylinder_023 = new THREE.Mesh(geo, BrownMat);
    cylinder_023.position.set(-0.777, 0.6567, 0.0131);
    cylinder_023.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_023.setRot(0.0, -0.0, 1.2552);
var cylinder_024 = new THREE.Mesh(geo, BlueMat);
    cylinder_024.position.set(-0.7865, 0.6277, 0.0673);
    cylinder_024.scale.set(0.0196, 0.0044, 0.0196);
    cylinder_024.setRot(0.0, -0.0, 1.2552);

var geo = new THREE.BoxGeometry(2,2,2);
var button_panel = new THREE.Mesh(geo, Floor_trainMat);
    button_panel.position.set(-0.7408, 0.3941, 0);
    button_panel.scale.set(-0.068, -0.0905, -0.0741);
var cube_112 = new THREE.Mesh(geo, BrownMat);
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
    cube_128.position.set(0.75, 0.2067, 0);
    cube_128.scale.set(0.15, 0.042, 0.233);
    cube_128.setRot(0.3098, 1.5708, 0);


var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_025 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_025.position.set(-0.8762, 0.4994, 0.0796);
    cylinder_025.scale.set(0.007, 0.0613, 0.007);
    cylinder_025.setRot(0.4012, 0, 1.2552);
    //button 1 base 
var cylinder_026 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_026.position.set(-0.8149, 0.5407, -0.0904);
    cylinder_026.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_026.setRot(0,0,1.2552);
    //button 1
var cylinder_027 = new THREE.Mesh(geo, ColonaMat);
    cylinder_027.position.set(-0.8253, 0.5441, -0.0904);
    cylinder_027.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_027.setRot(0,0,1.2552);
    //button 2 base 
var cylinder_028 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_028.position.set(-0.8149, 0.5408, -0.0348);
    cylinder_028.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_028.setRot(1.1034, -1.2201, 0.8109);
    //button 2
var cylinder_029 = new THREE.Mesh(geo, ColonaMat);
    cylinder_029.position.set(-0.8253, 0.5442, -0.0348);
    cylinder_029.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_029.setRot(1.1034, -1.2201, 0.8109);
    //button 3 base 
var cylinder_030 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_030.position.set(-0.8148, 0.541, 0.032);
    cylinder_030.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_030.setRot(-1.2537, 1.6022, -0.0959);
    //button 3
var cylinder_031 = new THREE.Mesh(geo, ColonaMat);
    cylinder_031.position.set(-0.8253, 0.5444, 0.032);
    cylinder_031.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_031.setRot(-1.2537, 1.6022, -0.0959);
    //button 4 base
var cylinder_032 = new THREE.Mesh(geo, WhiteDotsMat);
    cylinder_032.position.set(-0.8149, 0.5408, 0.09);
    cylinder_032.scale.set(0.0156, 0.0044, 0.0156);
    cylinder_032.setRot(1.0361, 4.2732, -0.9159);
    //button 4
var cylinder_033 = new THREE.Mesh(geo, ColonaMat);
    cylinder_033.position.set(-0.8253, 0.5442, 0.09);
    cylinder_033.scale.set(0.0121, 0.0101, 0.0121);
    cylinder_033.setRot(1.0361, 4.2732, -0.9159);

    //передний капсюль
var cylinder_037 = new THREE.Mesh(geo, ColonaMat);
    cylinder_037.position.set(0.9595, 0.1429, 0);
    cylinder_037.scale.set(0.0817, 0.1676, 0.0817);
    cylinder_037.setRot(1.5708,0,0);

var robot = new THREE.Group();
robot.add(cube_038, cube_039, fara_side, fara_fr, panels_mid, panels_l, panels_r, panels_side_l, panels_side_r, otmostka, cube_072, cube_073, cube_098MirroredZ, wheel_fr, cylinder_013MirroredZ, cube_086MirroredZ, cube_095MirroredZ, cube_087MirroredZ, cube_096MirroredZ, cube_097MirroredZ, cube_099MirroredZ, cube_101MirroredZ, cylinder_016, cylinder_017, cube_085MirroredZ, cube_103, cube_104MirroredZ, cube_105MirroredZ, cube_106MirroredZ, cube_107MirroredZ, cube_108MirroredZ, cube_109MirroredZ, cube_110MirroredZ, cylinder_019MirroredZ, cylinder_020, button_panel, cyl_021, cylinder_022, cylinder_023, cylinder_024, cube_112, cube_113, cube_114, cube_115, cube_116, cylinder_025, cylinder_026, cylinder_027, cylinder_028, cylinder_029, cylinder_030, cylinder_031, cylinder_032, cylinder_033, body_bl, cube_126MirroredZ, cylinder_037, cube_128);
robot.rotateX(PI/2);
var out = new THREE.Group();
out.add(robot);
// ===== CAMERA 2
cameras.robot = new THREE.PerspectiveCamera(75, WC / HC, 1, 1000);
cameras.robot.rotation.set(PI/2,-PI/2, 0);
cameras.robot.position.set(-4, 0, 2);
out.add(cameras.robot);
// откуда
var geometry = new THREE.SphereGeometry(0.5, 12, 12);
RobotMData.Sonar = new THREE.Mesh(geometry, WhiteDotsMat);
RobotMData.Sonar.position.x = 1.2;
RobotMData.Sonar.scale.setScalar(0.2);
// Линия луча
var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
var WhiteDotsMat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
var Linetelo = new THREE.Mesh(geometry, WhiteDotsMat);
Linetelo.position.z = -0.5;
Linetelo.rotation.x = PI / 2;
RobotMData.LineV = new THREE.Group();
RobotMData.LineV.add(Linetelo);
RobotMData.LineV.position.x = RobotMData.Sonar.position.x;
out.add(RobotMData.Sonar);
return out;
}
function DrawCleanRobot() {
var cylinder_brushesMat = new THREE.MeshStandardMaterial({color: 0x3912E4});

var geo = new THREE.CylinderGeometry(1, 1, 2, 16);
var cylinder_body = new THREE.Mesh(geo, Washer_mainMatDS);
    cylinder_body.position.set(0, 0.1347, 0);
    cylinder_body.scale.set(0.5636, -0.0994, 0.5636);
var cylinder_wheel2 = new THREE.Mesh(geo, ColonaMat);
    cylinder_wheel2.position.set(-0.3844, 0.0394, 0.2595);
    cylinder_wheel2.scale.set(-0.0516, -0.0176, -0.0515);
    cylinder_wheel2.setRot(1.8196, -4.5347, 1.5422);
var cylinder_wheel3 = new THREE.Mesh(geo, ColonaMat);
    cylinder_wheel3.position.set(0, 0.0052, -0.4846);
    cylinder_wheel3.scale.set(-0.0159, -0.0054, -0.0158);
    cylinder_wheel3.setRot(1.8196, -1.8235, 1.5422);
var cylinder_wheel1 = new THREE.Mesh(geo, ColonaMat);
    cylinder_wheel1.position.set(0.3747, 0.0394, 0.2595);
    cylinder_wheel1.scale.set(-0.0516, -0.0176, -0.0515);
    cylinder_wheel1.setRot(-1.322, -2.628, 1.5994);
var cylinder_button_off = new THREE.Mesh(geo, BrassMat);
    cylinder_button_off.position.set(0.0516, 0.2185, -0.4293);
    cylinder_button_off.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_button_on = new THREE.Mesh(geo, PurpleMat);
    cylinder_button_on.position.set(-0.0509, 0.2185, -0.4293);
    cylinder_button_on.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_brushes = new THREE.Mesh(geo, cylinder_brushesMat);
    cylinder_brushes.position.set(0,0.0858,0);
    cylinder_brushes.scale.set(0.0802, 0.28, 0.0802);
    cylinder_brushes.setRot(0,0, -1.5708);

var geo = new THREE.SphereGeometry(1, 16, 16);
var sphere_support = new THREE.Mesh(geo, RoofTilesMat);
    sphere_support.position.set(0,0.0515,-0.4844);
    sphere_support.scale.set(0.0434,0.0434,0.0434);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_display = new THREE.Mesh(geo, ColonaMat);
    cube_display.position.set(0,0.2231,0);
    cube_display.scale.set(-0.2711, -0.0151, -0.2711);
var cube_antenna1 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_antenna1.position.set(-0.441, 0.3083, 0);
    cube_antenna1.scale.set(-0.0949, -0.0088, -0.0041);
    cube_antenna1.setRot(0,0, -1.0986);
var cube_antenna2 = new THREE.Mesh(geo, WhiteDotsMat);
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
var geo = new THREE.SphereGeometry(0.5, 16, 16);
var WhiteDotsMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
CleanRobotData.Sonar = new THREE.Mesh(geo, WhiteDotsMat);
CleanRobotData.Sonar.position.x = 0.5;
CleanRobotData.Sonar.scale.setScalar(0.2);
// Линия луча
var geo = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
var WhiteDotsMat = new THREE.MeshLambertMaterial({ color: 0xffdd00 });
var Linetelo;
Linetelo = new THREE.Mesh(geo, WhiteDotsMat);
Linetelo.position.x = 0.5;
Linetelo.rotation.z = PI / 2;
CleanRobotData.LineH = new THREE.Group();
CleanRobotData.LineH.add(Linetelo);
CleanRobotData.LineH.position.x = CleanRobotData.Sonar.position.x;
Linetelo = new THREE.Mesh(geo, WhiteDotsMat);
Linetelo.position.z = -0.5;
Linetelo.rotation.x = PI / 2;
CleanRobotData.LineV = new THREE.Group();
CleanRobotData.LineV.add(Linetelo);
CleanRobotData.LineV.position.x = CleanRobotData.Sonar.position.x;
out.add(CleanRobotData.Sonar, CleanRobotData.LineH, CleanRobotData.LineV);
return out;
}
function DrawVagonDecorations() {
//lamps
var geo = new THREE.CylinderGeometry(1,1,2,10);
var cyl_021 = new THREE.Mesh(geo, BrownMat);
var geo = new THREE.SphereGeometry(1,12,8);
var sphere_002 = new THREE.Mesh(geo, RoofTilesMat);
sphere_002.scale.set(0.24, 0.21, 0.24);
cyl_021.scale.set(0.32, 0.05, 0.32);
var lampsGroup = new THREE.Group(); lampsGroup.add(sphere_002,cyl_021);
for (var i = 0; i < 4; i++) {
var newLamp = lampsGroup.clone();
    newLamp.position.x = -3.5*i;
    lampsGroup.add(newLamp);
}
lampsGroup.position.set(11, 6.9, 0);

function DrawSkamia() {
var geo = new THREE.BoxGeometry(2,2,2);
var mesh = new THREE.Mesh(geo, Floor_CentralMat);
var skamia_side_top = mesh.clone();var skamia_side_mid = mesh.clone();
    skamia_side_top.position.set(0,3.6,-2.11);skamia_side_top.rotation.x = -PI/2.2;
    skamia_side_top.scale.set(0.06,0.3,0.4);
    skamia_side_mid.position.set(0,2.8,-1.8); skamia_side_mid.rotation.x = -PI/2.2;
    skamia_side_mid.scale.set(0.06,0.6,0.5);
var skamia_side_l = new THREE.Group(); skamia_side_l.position.set(-8.4,0,0);
    skamia_side_l.add(skamia_side_mid,skamia_side_top);
var skamia_side_r = skamia_side_l.clone(); skamia_side_l.position.x = -4.4; 
var mesh = new THREE.Mesh(geo, BrownMat);
var sidushka = mesh.clone(); var spinka = mesh.clone();
    sidushka.position.set(-6.4,3,-1.8); sidushka.scale.set(2,0.1,0.5);
    spinka.position.set(-6.4,3.45,-2.2);spinka.scale.set(2,0.1,0.43);
    spinka.rotation.x = PI/2.2;
var zaslonka = new THREE.Mesh(geo, Floor_CentralMat);
    zaslonka.position.set(-6.4, 2.68, -1.5);
    zaslonka.scale.set(2, 0.07, 0.4);
    zaslonka.rotation.x = PI/2.2;
//Поручни
var geo = new THREE.CylinderGeometry(1,1,2,10);
var cyl_bot = new THREE.Mesh(geo,MetalMat);
var cyl_mid = cyl_bot.clone(); var cyl_mid_base = cyl_bot.clone();
var cyl_top = cyl_bot.clone(); var cyl_top_base = cyl_bot.clone();
var cyl_bot_base = cyl_bot.clone();
    cyl_bot.position.set(0, 3.6, -1.3);
    cyl_bot.scale.set(0.04, 0.4636, 0.04);
    cyl_mid.position.set(0, 3.84, -1.59);
    cyl_mid.scale.set(0.04, 0.28, 0.04);    cyl_mid.rotation.x = PI/2;
    cyl_mid_base.position.set(0, 3.84, -1.78);
    cyl_mid_base.scale.set(0.05,0.03,0.05); cyl_mid_base.rotation.x = PI/2;
    cyl_bot_base.position.set(0,3.2,-1.3);
    cyl_bot_base.scale.set(0.05,0.08,0.05);
    cyl_top_base.position.set(0, 4.1, -2.3);
    cyl_top_base.scale.set(0.05,0.06,0.05); cyl_top_base.rotation.x = PI/2;
    cyl_top.position.set(0, 4.0978, -1.8363);
    cyl_top.scale.set(0.04, 0.53, 0.04);    cyl_top.rotation.x = PI/2; 
var geo = new THREE.SphereGeometry(0.06,10,10);
var joint = new THREE.Mesh(geo, MetalMat);
    joint.position.set(0, 4.1, -1.3);
var skamia_poruchni_l = new THREE.Group(); skamia_poruchni_l.add(cyl_top,cyl_bot,cyl_mid,cyl_mid_base,cyl_bot_base,cyl_top_base,joint);
    skamia_poruchni_l.position.x = -8.4;
var skamia_poruchni_r = skamia_poruchni_l.clone();
    skamia_poruchni_r.position.x = -4.4;
var out = new THREE.Group();
out.add(skamia_poruchni_l,skamia_poruchni_r,sidushka,spinka,zaslonka,skamia_side_l,skamia_side_r);
return out;
}

var skamia_r = new THREE.Group();
for (var i = 0; i < 3; i++) {
var skamia_new = DrawSkamia();
    skamia_new.position.set(6.4288 * i, 0, 0);
    skamia_r.add(skamia_new);
}
var skamia_l = skamia_r.clone();
    skamia_l.scale.z = -1;

var geo = new THREE.BoxGeometry(2, 2, 2);
var plakat = new THREE.Mesh(geo, YellowMat);
    plakat.position.set(1.56, 4.88, 2.37);
    plakat.scale.set(0.5, 0.6, 0.01);
var plakat_1 = new THREE.Mesh(geo, BrownMat);
    plakat_1.position.set(-4.86, 4.88, -2.36);
    plakat_1.scale.set(0.5, 0.6, 0.01);
//Плакат сверху поезда, показывающий станции на линии
function DrawStationsPlakat() {
var geo = new THREE.BoxGeometry(2, 2, 2);
var line_base = new THREE.Mesh(geo, WhiteDotsMat);
    line_base.position.z = -0.05;
    line_base.scale.set(2, 0.2, 0.015);
var line_inside = new THREE.Mesh(geo, PurpleMat);
    line_inside.position.z = -0.04;
    line_inside.scale.set(1.8, 0.05, 0.01);
var geo = new THREE.CylinderGeometry(1, 1, 2, 32);
var line_point_1 = new THREE.Mesh(geo, PurpleMat);
    line_point_1.position.set(-1.8, 0, -0.03);
    line_point_1.scale.set(0.15, 0.01, 0.15);
    line_point_1.rotation.x = PI/2;
var line_point_2 = new THREE.Mesh(geo, BrownMat);
    line_point_2.position.set(0.6, 0, -0.03);
    line_point_2.scale.set(0.15, 0.01, 0.15);
    line_point_2.rotation.x = PI/2;
var line_point_3 = new THREE.Mesh(geo, YellowMat);
    line_point_3.position.set(-0.6, 0, -0.03);
    line_point_3.scale.set(0.15, 0.01, 0.15);
    line_point_3.rotation.x = PI/2;
var line_point_4 = line_point_1.clone();
    line_point_4.position.x = -line_point_1.position.x
var out = new THREE.Group();
    out.add(line_base,line_inside,line_point_1,line_point_2,line_point_3,line_point_4);
return out;   
}
var line_plakat = DrawStationsPlakat();
    line_plakat.position.set(0,6,-2.3);
var line_plakat_1 = line_plakat.clone();
    line_plakat_1.rotation.y = PI; line_plakat_1.position.z = -line_plakat.position.z;

//Поручни
function DrawPoruchen() {
var geo = new THREE.CylinderGeometry(1, 1, 2, 8);
var handle = new THREE.Mesh(geo, MetalMat);
    handle.position.x = 0.01; handle.rotation.z = PI/2;
    handle.scale.set(0.04,12.5,0.04);
var handle_staple = new THREE.Group();
for (var i=0; i<5; i++) {
var staple = new THREE.Mesh(geo, MetalMat);
    staple.scale.set(0.03, 0.21, 0.03);
    staple.position.x = 5.5*i;
    handle_staple.add(staple);
}   handle_staple.position.set(-10.83, 0.2, 0);
var out = new THREE.Group(); out.add(handle_staple,handle);
return out;
}
var poruchen_r = DrawPoruchen();
    poruchen_r.position.set(0,6.5,-0.77);
var poruchen_l = poruchen_r.clone(); poruchen_l.position.z = -poruchen_r.position.z;

var geo = new THREE.BoxGeometry(2,2,2);
var ceiling_l = new THREE.Mesh(geo, FloorTileMat);
    ceiling_l.position.set(0.01, 6.8, 1.5);
    ceiling_l.scale.set(12.5,0.1,0.9);
    ceiling_l.rotation.x = PI/20;
var ceiling_r = ceiling_l.clone();
    ceiling_r.position.z = -ceiling_l.position.z;
    ceiling_r.setRot(-ceiling_l.rotation.x*2, 0, 0);
var ceilingVert_l = new THREE.Mesh(geo, FloorTileMat);
    ceilingVert_l.position.set(0.01, 7.025, 0.7325);
    ceilingVert_l.scale.set(12.5, 0.2164,0.12);
var ceilingVert_r = ceilingVert_l.clone();
    ceilingVert_r.position.z = -ceilingVert_l.position.z;

function DrawTrainStripes() {
var stripes = new THREE.Group();

//полоски слева/справа окна
var stripe_1 = new THREE.Mesh(geo, MetalMat);
    stripe_1.position.set(-4.87, 5, 0);
    stripe_1.scale.set(0.5, 0.035, 0.03);
var stripe_2 = stripe_1.clone(); stripe_2.position.x = -7.96;
var stripe_3 = stripe_1.clone(); stripe_3.position.y = 4.52;
var stripe_4 = stripe_2.clone(); stripe_4.position.y = 4.52;
var window_stripes = new THREE.Group();
    window_stripes.add(stripe_1,stripe_2,stripe_3,stripe_4);
//полоски сверху/снизу окна
var stripe_5 = new THREE.Mesh(geo, MetalMat);
    stripe_5.position.set(-6.42, 2.96, 0);
    stripe_5.scale.set(2, 0.035, 0.03);
var stripe_6 = stripe_5.clone(); stripe_6.position.y = 6.55;
var stripe_7 = stripe_6.clone(); stripe_7.position.y = 6.04;
var upper_stripes = new THREE.Group();
    upper_stripes.add(stripe_5,stripe_6,stripe_7);
//размножаем полоски
for (var i = 0; i < 3; i++) {
var new_stripe = window_stripes.clone();
    new_stripe.position.x = 6.423*i;stripes.add(new_stripe);
var new_stripe = upper_stripes.clone();
    new_stripe.position.x = 6.423*i;stripes.add(new_stripe);
}
var out = new THREE.Group();
    out.add(stripes);
return out;
}
var stripes_l = DrawTrainStripes();stripes_l.position.z = -2.45;
var stripes_r = DrawTrainStripes();stripes_r.position.z =  2.45;

function DrawTrainWhiteStripes() {
var cube_431Group = new THREE.Group();
for (var i = 0; i < 3; i++) {
 var cube_431 = new THREE.Mesh(geo, WhiteDotsMat);
 cube_431.scale.set(2.1443, 0.17, 0.0248);
 cube_431.position.x = 6.42*i;
 cube_431Group.add(cube_431);
}
cube_431Group.position.x = -6.42;

var stripe_front_side = new THREE.Mesh(geo, WhiteDotsMat);
    stripe_front_side.position.x = -0.66;
    stripe_front_side.scale.set(0.9461, 0.1709, 0.0248);
var stripe_front = new THREE.Mesh(geo, WhiteDotsMat);
    stripe_front.position.set(-1.58, 0, 0.89);
    stripe_front.scale.set(0.0248, 0.1709, 0.9146);
var stripes_corner_b = new THREE.Group(); stripes_corner_b.add(stripe_front_side,stripe_front);
    stripes_corner_b.position.x = -11;
var stripes_corner_fr = stripes_corner_b.clone(); 
    stripes_corner_fr.scale.x = -1; stripes_corner_fr.position.x = -stripes_corner_b.position.x;
var out = new THREE.Group(); out.add(cube_431Group,stripes_corner_b,stripes_corner_fr);
return out;
}
var TrainWhiteStripes = DrawTrainWhiteStripes();
    TrainWhiteStripes.position.set(0,3.8,-2.46);
var TrainWhiteStripes_r = TrainWhiteStripes.clone();
    TrainWhiteStripes_r.position.z = -TrainWhiteStripes.position.z;
    TrainWhiteStripes_r.scale.z = -1;

var out = new THREE.Group();
out.add(stripes_l,plakat_1,TrainWhiteStripes_r,TrainWhiteStripes,stripes_r,skamia_r,skamia_l, line_plakat, line_plakat_1, lampsGroup, poruchen_r, poruchen_l, plakat, ceiling_l,ceiling_r, ceilingVert_l,ceilingVert_r);
return out;
}
function DrawVagon() {
var out = new THREE.Group();
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
var train_base = new THREE.Mesh(geo, BlueMat);
    train_base.position.set(0,1.97,0);
    train_base.scale.set(12.537, 0.3, 2.46);
var train_floor = new THREE.Mesh(geo, Floor_trainMat);
    train_floor.position.y = 2.3;
    train_floor.scale.set(12.49, 0.15, 2.4);
var trainRoof = new THREE.Mesh(geo, BlueMat);
    trainRoof.position.set(0, 7.2557, 0);
    trainRoof.scale.set(12.545, 0.08, 2.47);
var trainRoof_top = new THREE.Mesh(geo, BlueMat);
    trainRoof_top.position.set(0, 7.3977, 0);
    trainRoof_top.scale.set(12.1678, 0.2214, 1.4361);
var train_ceiling = new THREE.Mesh(geo, Ceiling_trainMat);
    train_ceiling.position.y = 7;
    train_ceiling.scale.set(12.5,0.1,0.7);

function DrawTrainBackWall() {
var geo = new THREE.BoxGeometry(2,2,2);
var wall_back_l_bot = new THREE.Mesh(geo, BlueMat);
    wall_back_l_bot.scale.set(0.0446, 0.9062, 0.8412);
    wall_back_l_bot.position.y = 3.15;
var geo = new THREE.BoxGeometry(2, 2, 2);
var wall_back_window_l = new THREE.Mesh(geo, BlueMat);
    wall_back_window_l.scale.set(0.0446, 0.91, 0.1275);
    wall_back_window_l.position.set(0, 4.965, -0.7137);
var wall_back_window_r = new THREE.Mesh(geo, BlueMat);
    wall_back_window_r.scale.set(0.0446, 0.91, 0.1275);
    wall_back_window_r.position.set(0, 4.965, 0.7137);
var wall_back_l_top = new THREE.Mesh(geo, BlueMat);
    wall_back_l_top.scale.set(0.0446, 0.681, 0.8412);
    wall_back_l_top.position.y = 6.5;
    
var out = new THREE.Group(); out.add(wall_back_l_top,wall_back_window_r,wall_back_window_l,wall_back_l_bot);
return out;
}

function DrawTrainWindow() {
var geo = new THREE.BoxGeometry(2,2,2);
var corner_d_l = new THREE.Mesh(geo, ColonaMat);
    corner_d_l.position.set(0, 4.05, 0);
    corner_d_l.scale.set(0.03, 0.1434, 0.1545);
    corner_d_l.rotation.x = PI/4;
var corner_t_l = corner_d_l.clone();
    corner_t_l.position.y = 5.827;
var corner_l = new THREE.Group();
    corner_l.add(corner_d_l, corner_t_l);
var corner_r = corner_l.clone();
    corner_r.position.z = -1.18;
var border_down = new THREE.Mesh(geo, ColonaMat);
    border_down.position.set(0, 4.06, -0.607);
    border_down.scale.set(0.03, 0.0226, 0.46);
var border_up = border_down.clone();
    border_up.position.y = 5.815;
var border_r = new THREE.Mesh(geo, ColonaMat);
    border_r.position.set(0, 4.95, -0.02);
    border_r.scale.set(0.03, 0.7643, 0.0226);
var border_l = border_r.clone();
    border_l.position.z = -1.19;
var glass = new THREE.Mesh(geo, GlassMat);
    glass.scale.set(0.015, 1, 0.714);
    glass.position.set(0, 4.9411, -0.607);  
var out = new THREE.Group();
    out.add(glass,border_down,border_up,border_r,border_l,corner_l,corner_r);
return out;
}

//Фары вагона
var geo = new THREE.CylinderGeometry(1, 1, 2, 10);
var lightBase = new THREE.Mesh(geo, YellowMat);
    lightBase.scale.set(0.3, 0.1, 0.3);
    lightBase.rotation.z = -PI/2;
var geo = new THREE.SphereGeometry(1, 10, 10);
var light = new THREE.Mesh(geo, RoofTilesMat);
    light.scale.set(0.27, 0.08, 0.27);
    light.rotation.z = -PI/2;
    light.position.x = -0.1;
var trainLight_b_r = new THREE.Group();trainLight_b_r.position.z = -1.5; 
    trainLight_b_r.add(light,lightBase);
var trainLight_b_l = trainLight_b_r.clone(); trainLight_b_l.position.set(-0.15,3.15,0.027);

var backWall_l = DrawTrainBackWall();
var window_back_l = DrawTrainWindow();
    window_back_l.position.set(-0.01,0,0.607);
var geo = new THREE.BoxGeometry(2,2,2);
var wall_side_b = new THREE.Mesh(geo, BlueMat);
    wall_side_b.scale.set(0.9, 2.47, 0.05);
    wall_side_b.position.set(0.855, 4.7166, -2.412);
var wall_side_b_r = wall_side_b.clone(); wall_side_b_r.position.z = -wall_side_b.position.z;
var backWall_full_l = new THREE.Group(); backWall_full_l.add(backWall_l,window_back_l,trainLight_b_l);
    backWall_full_l.position.z = -1.527;
var backWall_full_r = backWall_full_l.clone(); backWall_full_r.position.z = -backWall_full_l.position.z;
var backDoor = DrawRightDoor();
    backDoor.position.set(0, 2.22, -0.7);
    backDoor.scale.set(1.25,1.055,1); backDoor.rotation.y = PI/2;
var backWall_full = new THREE.Group(); backWall_full.add(wall_side_b,wall_side_b_r,backWall_full_r,backWall_full_l,backDoor);
    backWall_full.position.x = -12.5;
var frontWall = backWall_full.clone(); frontWall.position.x = 12.491;
    frontWall.scale.x = -1;

var geo = new THREE.BoxGeometry(2, 2, 2);
var train_side_top = new THREE.Mesh(geo, BlueMat);
    train_side_top.position.set(0, 6.8, 0);
    train_side_top.scale.set(12.5, 0.5, 0.05);
var wall_side = new THREE.Group();
var wall_bot = new THREE.Mesh(geo, BlueMat);
    wall_bot.position.set(-6.42, 3.1279, 0);
    wall_bot.scale.set(2.11, 0.8864, 0.05);
var wall_top = new THREE.Mesh(geo, BlueMat);
    wall_top.position.set(-6.42, 6.2439, 0);
    wall_top.scale.set(2.11, 0.7, 0.05);
var wall_wind_r = new THREE.Mesh(geo, BlueMat);
    wall_wind_r.position.set(-7.9641, 4.778, 0);
    wall_wind_r.scale.set(0.5707, 0.7636,0.05);
var wall_wind_l = new THREE.Mesh(geo, BlueMat);
    wall_wind_l.scale.set(0.5707, 0.7636, 0.05);
    wall_wind_l.position.set(-4.8768, 4.778, 0);
var wall_window = DrawTrainWindow();
    wall_window.position.set(-5.39,0.54,0);
    wall_window.scale.set(1,0.86,1.7);
    wall_window.rotation.y = PI/2;
    wall_side.add(wall_bot,wall_top,wall_wind_r,wall_wind_l,wall_window); 
var wall_side_full = new THREE.Group()
for (var i = 0; i < 3; i++) {
var wall_side_temp = wall_side.clone()
    wall_side_temp.position.x = 6.4194 * i;
    wall_side_full.add(wall_side_temp);
}   
var side_door_opening = new THREE.Group();
for (var i = 0; i < 4; i++) {
var side_door = DrawTrainDoor();
    side_door.position.x = 6.4192 * i;
    side_door_opening.add(side_door);
}   side_door_opening.position.set(-9.62, 2.24, 0.01);
    wall_side_full.add(side_door_opening,train_side_top);
    wall_side_full.position.z = -2.41;
var wall_side_full_r = wall_side_full.clone(); wall_side_full_r.position.z = -wall_side_full.position.z;
//top decor elements of train
var train_decor_l = new THREE.Group();
for (var i = 0; i<30; i++) {
var decor = new THREE.Mesh(geo, BlueMat);
    decor.scale.set(0.1,0.3,0.3); decor.position.x = 0.8*i;
    train_decor_l.add(decor);
}   train_decor_l.rotation.x = -PI/4;
    train_decor_l.position.z = -1.45;
var train_decor_r = train_decor_l.clone();
    train_decor_r.position.z = 1.45;
    train_decor_r.scale.z = -1; 
var train_decor_top = new THREE.Group();
    train_decor_top.add(train_decor_l,train_decor_r);
    train_decor_top.position.set(-11.6, 7.2, 0);

var Decor = DrawVagonDecorations();
out.add(backWall_full,wall_side_full_r,frontWall,Decor, wheel_base_1, wheel_base_2, train_base, trainRoof, trainRoof_top, train_ceiling, wall_side_full, train_decor_top, train_floor);
return out;
}
function DrawRightDoor() {
var load = textureLoader.load('http://livelab.spb.ru/labs/files/doorTexWithDecor.png');
load.wrapS = load.wrapT = THREE.RepeatWrapping;
var doorMat = new THREE.MeshStandardMaterial({map:load,roughness:0.5,metalness:0.1,transparent:true});
var geo = new THREE.BoxGeometry(2, 2, 2);
var Door = new THREE.Mesh(geo, doorMat);
Door.scale.set(0.55, 2.35, 0.03);
Door.position.set(-0.55, Door.scale.y, 0);
var out = new THREE.Group(); out.add(Door);
return out;
}
function DrawStation() {
var out = new THREE.Group();


//КАРТИНА С ПЕТРОМ
var geom = new THREE.BoxGeometry(2, 2, 2);
var image_petr = new THREE.Mesh(geom, ColonaMat);
image_petr.position.set(-31, 6, 0);
image_petr.scale.set(0.2, 3.85, 3.85);

var image_base = new THREE.Mesh(geom, BrassMat);
image_base.position.set(-31.1, 6, 0);
image_base.scale.set(0.2, 4, 4);
out.add(image_base);

//КОЛОННА и арка
function DrawColumn() {
var geo = new THREE.CylinderGeometry(1, 1, 2, 12);
 var cylinder_002 = new THREE.Mesh(geo, ColonaMat);
 cylinder_002.scale.set(0.5, 2.5, 0.5);
cylinder_002.position.set(-30.7, 3.2961, 0.171);
 var cylinder_005 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_005.scale.set(0.55, 0.2319, 0.55);
cylinder_005.position.set(-30.709, 1.0416, 0.1711);
 var cylinder_006 = new THREE.Mesh(geo, ColoumnPlateMat);
 cylinder_006.scale.set(0.55, 0.3036, 0.55);
cylinder_006.position.set(-30.709, 5.47, 0.1711);
 var cylinder_007 = new THREE.Mesh(geo, BrassMat);
 cylinder_007.scale.set(0.6, 0.1363, 0.6);
cylinder_007.position.set(-30.709, 5.4668, 0.1711);
var geo = new THREE.TorusGeometry(1, 0.25, 12, 10);
 var torus_004 = new THREE.Mesh(geo, BrassMat);
 torus_004.scale.set(0.5, 0.5, 0.5233);
torus_004.setRot(1.5708, 0.0, 0.0);
torus_004.position.set(-30.709, 1.0461, 0.1657);
 var torus_005 = new THREE.Mesh(geo, BrassMat);
 torus_005.scale.set(0.52, 0.52, 0.2641);
torus_005.setRot(1.5708, 0.0, 0.0);
torus_005.position.set(-30.709, 5.307, 0.1655);
var torus_006 = new THREE.Mesh(geo, BrassMat);
torus_006.scale.set(0.52, 0.52, 0.5233);
torus_006.setRot(1.5708, 0, 0);
torus_006.position.set(-30.709, 5.7037, 0.1711);
var geo = new THREE.BoxGeometry(2,2,2);
var cube_001 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_001.scale.set(0.7, 0.0759, 0.0);
    cube_001.position.set(-30.709, 5.8089, 0.1711);
var geo = new THREE.BoxGeometry(2,2,2);
var cube = new THREE.Mesh(geo, ColoumnPlateMat);
    cube.position.set(-30.7, 4.33, 0.9);
    cube.scale.y = 3.4789;
var cube_2 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_2.position.set(-29.8356, 4.9, 0.9);
    cube_2.scale.set(0.4453, 0.2934, 1);
    cube_2.setRot(0,0,1.0669);
var cube_4 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_4.position.set(-29.3814, 5.6, 0.9);
    cube_4.scale.set(0.4453, 0.4393, 1);
    cube_4.setRot(0,0,0.6511);
var cube_5 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_5.position.set(-28.5579, 5.832, 0.9);
    cube_5.scale.set(0.4453, 0.2384, 1);
    cube_5.setRot(0,0,0.3109);
var cube_6 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_6.position.set(-27.6974, 5.8917, 0.9);
    cube_6.scale.set(0.4453, 0.1584, 1);
var cube_7 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_7.position.set(-25.5818, 4.92, 0.8995);
    cube_7.scale.set(0.4453, 0.2934, 0.9985);
    cube_7.setRot(0,0,-1.0669);
var cube_8 = new THREE.Mesh(geo, ColoumnPlateMat);
    cube_8.position.set(-26.0135, 5.5959, 0.8995);
    cube_8.scale.set(0.4453, 0.4393, 0.9985);
    cube_8.setRot(0.0, 0.0, -0.6511);
var cube_9 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_9.position.set(-26.8361, 5.832, 0.8995);
cube_9.scale.set(0.4453, 0.2384, 0.9985);
cube_9.setRot(0.0, 0.0, -0.3109);
 var cube_11 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_11.position.set(-26.8361, 5.832, 0.8995);
 cube_11.scale.set(0.4453, 0.2384, 0.9985);
cube_11.setRot(0.0, 0.0, -0.3109);
 var cube_12 = new THREE.Mesh(geo, ColoumnPlateMat);
 cube_12.position.set(-26.0135, 5.5959, 0.8995);
 cube_12.scale.set(0.4453, 0.4393, 0.9985);
cube_12.setRot(0.0, 0.0, -0.6511);
 var cube_13 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_13.scale.set(0.4453, 0.2934, 0.6455);
 cube_13.position.set(-25.6364, 4.92, 0.8995);
cube_13.setRot(0.0, 0.0, -1.0669);
 var cube_15 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_15.scale.set(1.05, 3.4789, 0.6455);
 cube_15.position.set(-30.709, 4.3331, 0.8995);
 var cube_16 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_16.position.set(-29.777, 4.92, 0.8995);
 cube_16.scale.set(0.4453, 0.2934, 0.6455);
cube_16.setRot(0, 0, 1.0669);
 var cube_17 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_17.scale.set(0.4453, 0.4393, 0.6455);
 cube_17.position.set(-29.3235, 5.5959, 0.8995);
cube_17.setRot(0.0, 0.0, 0.6511);
 var cube_18 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_18.scale.set(0.4453, 0.2384, 0.6455);
 cube_18.position.set(-28.4432, 5.832, 0.8995);
cube_18.setRot(0.0, 0.0, 0.3109);
 var cube_19 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_19.scale.set(0.4453, 0.1584, 0.6455);
 cube_19.position.set(-27.6974, 5.8583, 0.8995);
var cube_20 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_20.position.set(-25.5818, 4.92, 0.8995);
cube_20.scale.set(0.4453, 0.2934, 0.9985);
cube_20.setRot(0, 0, -1.0669);
 var cube_21 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_21.scale.set(0.4453, 0.4393, 0.6455);
 cube_21.position.set(-26.068, 5.5959, 0.8995);
cube_21.setRot(0.0, 0.0, -0.6511);
 var cube_22 = new THREE.Mesh(geo, Floor_ColumnsMat);
 cube_22.scale.set(0.4453, 0.2384, 0.6455);
 cube_22.position.set(-26.9447, 5.832, 0.8995);
cube_22.setRot(0.0, 0.0, -0.3109);
var col = new THREE.Group();
var coloumns_up = new THREE.Mesh(geo, Floor_ColumnsMat);
    coloumns_up.scale.set(42.5516, 0.1921, 0.7246);
    coloumns_up.position.set(10.4587, 7.0259, 0.8464);
var coloumns_up_1 = new THREE.Mesh(geo, Floor_ColumnsMat);
    coloumns_up_1.scale.set(42.5516, 0.1921, 0.7246);
    coloumns_up_1.setRot(-0.7258, 0, 0);
    coloumns_up_1.position.set(10.4587, 6.5967, 0.876);
var coloumns_up_2 = new THREE.Mesh(geo, Floor_ColumnsMat);
    coloumns_up_2.scale.set(42.5516, 0.1921, 0.7246);
    coloumns_up_2.position.set(10.4587, 6.0642, -0.1651);
col.add(coloumns_up,coloumns_up_1,coloumns_up_2); col.position.z = -14;
var out = new THREE.Group(); out.add(col,cylinder_002,cylinder_005,cylinder_006,cylinder_007,torus_004,torus_005,torus_006,cube_001,cube,cube_2,cube_4,cube_5,cube_6,cube_7,cube_8,cube_9,cube_11,cube_12,cube_13,cube_15,cube_16,cube_17,cube_18,cube_19,cube_20,cube_21,cube_22);
return out;
}
var columns = new THREE.Group();
for(var i = 0; i<12; i++) {
    var column = DrawColumn();
    column.position.set(6 * i, 0, 0);
    columns.add(column);
}   columns.position.z = 7;
var columns_r = columns.clone(); columns_r.position.z = -7; columns_r.scale.z = -1;

var geo = new THREE.BoxGeometry(2,2,2);
var cube_038 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_038.position.set(44.5687, 4.3331, 7.8995);
cube_038.scale.set(8.2777, 3.4789, 1.0);
var cube_038MZ = cube_038.clone();
cube_038MZ.position.z = -cube_038.position.z;
var cube_038MirroredZ = new THREE.Group();
cube_038MirroredZ.add(cube_038, cube_038MZ);

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

//стены чуть дальше
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

//боковая стена метро
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

//стена между рельсами и платформой
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


var cube_041 = new THREE.Mesh(geo, ColoumnPlateMat);
cube_041.position.set(53.7454, 7.9374, -0.0);
cube_041.scale.set(1.1221, 2.1309, 7.0248);

var cube_042 = new THREE.Mesh(geo, BrassMat);
cube_042.position.set(53.6094, 6.0196, -0.0);
cube_042.scale.set(1.2033, 0.1788, 7.0248);

//к часам
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

//синяя панель
var cube_047 = new THREE.Mesh(geo, BlueMat);
cube_047.position.set(52.4948, 8.1131, -0.0);
cube_047.scale.set(-0.0232, 1.9147, 4.9622);

function DrawClock() {
//основание циферблата
var geo = new THREE.CylinderGeometry(1, 1, 2, 20);
var cylinder_008 = new THREE.Mesh(geo, BrassMat);
cylinder_008.position.set(0.4284, 8, 0);
cylinder_008.scale.set(1, 0.0534, 1);
cylinder_008.rotation.z = -PI/2;
//циферблат
var cylinder_009 = new THREE.Mesh(geo, WhiteDotsMat);
cylinder_009.position.set(0.3781, 8, -0.0);
cylinder_009.scale.set(0.9637, 0.0534, 0.9637);
cylinder_009.setRot(0.0, 0.0, -1.5708);
//крепление стрелок
var cylinder_010 = new THREE.Mesh(geo, ColonaMat);
cylinder_010.position.set(0.32, 8, 0);
cylinder_010.scale.set(0.075, 0.0188, 0.075);
cylinder_010.rotation.z = -PI/2;
//минутная стрелка
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_048 = new THREE.Mesh(geo, ColonaMat);
cube_048.position.set(0.3406, 8.4, 0);
cube_048.scale.set(0.0334, 0.3772, 0.0334);
//часовая стрелка
var cube_049 = new THREE.Mesh(geo, ColonaMat);
cube_049.position.set(0.34, 8.05, 0.3139);
cube_049.scale.set(0.0334, 0.305, 0.0334);
cube_049.setRot(1.2316, 0, 0);
//засечки на часах вертикальные
var cube_050 = new THREE.Mesh(geo, ColonaMat);
cube_050.position.set(0.34, 8.8, 0);
cube_050.scale.set(0.0328, 0.0583, 0.0328);
//засечки на часах горизонтальные
var cube_051 = new THREE.Mesh(geo, ColonaMat);
cube_051.position.set(0.34, 7.93, 0.8682);
cube_051.scale.set(0.0328, 0.0328, 0.0583);
// засечки на часах диагональные нижние
var cube_052 = new THREE.Mesh(geo, ColonaMat);
cube_052.position.set(0.34, 7.32, 0.6139);
cube_052.scale.set(0.0328, 0.0583, 0.0328);
cube_052.rotation.x = -PI/4;
// засечки на часах диагональные верхние
var cube_053 = cube_052.clone();
cube_053.position.y = 8.55;
cube_053.rotation.x = PI/4;

var out = new THREE.Group(); out.add(cylinder_008,cylinder_009, cylinder_010, cube_048, cube_049,cube_050,cube_053,cube_052,cube_051);
return out;
}
var clock = DrawClock();
    clock.position.set(52,0,0);

var geo = new THREE.BoxGeometry(2,2,2);
var cube_054 = new THREE.Mesh(geo, MetalMat);
cube_054.position.set(38, 2.3445, 6.9102);
cube_054.scale.set(1.2649, 0.9801, 0.0322);

var cube_055 = new THREE.Mesh(geo, MetalMat);
cube_055.position.set(38, 3.1273, -6.8906);
cube_055.scale.set(1.6975, 1.1575, 0.0322);

var cube_056 = new THREE.Mesh(geo, BlueMat);
cube_056.position.set(38, 2.9853, -6.8646);
cube_056.scale.set(1.6244, 0.9379, 0.0322);

var cube_057 = new THREE.Mesh(geo, BrownMat);
cube_057.position.set(38, 4.0931, -6.8646);
cube_057.scale.set(1.6244, 0.146, 0.0322);

var cube_058 = new THREE.Mesh(geo, MetalMat);
cube_058.position.set(38, 4.4235, 6.9102);
cube_058.scale.set(1.2649, 0.9801, 0.0322);

var cube_059 = new THREE.Mesh(geo, BrownMat);
cube_059.position.set(38, 2.3445, 6.8851);
cube_059.scale.set(1.1847, 0.918, 0.0301);

var cube_060 = new THREE.Mesh(geo, BlueMat);
cube_060.position.set(38, 4.4235, 6.8851);
cube_060.scale.set(1.1847, 0.918, 0.0301);

var cube_061 = new THREE.Mesh(geo, MetalMat);
cube_061.position.set(38, 5.1875, -6.9009);
cube_061.scale.set(0.1398, 0.1398, 0.0286);

var cube_062 = new THREE.Mesh(geo, MetalMat);
cube_062.position.set(38, 5.1875, -6.7612);
cube_062.scale.set(0.041, 0.041, 0.1231);

var cube_063 = new THREE.Mesh(geo, MetalMat);
cube_063.position.set(38, 5.1875, -6.3446);
cube_063.scale.set(0.1035, 0.3, 0.3);

var cube_064 = new THREE.Mesh(geo, BrownMat);
cube_064.position.set(38, 5.1875, -6.3446);
cube_064.scale.set(0.1379, 0.2533, 0.2533);

// i
var cube_065 = new THREE.Mesh(geo, WhiteDotsMat);
cube_065.position.set(38, 5.1086, -6.3446);
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
var cube_072 = new THREE.Mesh(geo, BrownMat);
    cube_072.scale.set(337.424, 0.0913, 3.9259);
var cube_072MZ = cube_072.clone();
    cube_072MZ.updateMatrixWorld(true);
    cube_072.position.set(0, 0, 18.6043);
    cube_072MZ.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    cube_072MZ.position.set(0, 0, -18.6043);
var cube_072MirroredZ = new THREE.Group();
    cube_072MirroredZ.add(cube_072, cube_072MZ);
    cube_072MirroredZ.position.set(-0.9392, -1.8809, 0);

var cube_073 = new THREE.Mesh(geo, BrownMat);
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

var cube_floor_central = new THREE.Mesh(geo, Floor_CentralMat);
    cube_floor_central.position.set(24.3999, 0.5684, 0);
    cube_floor_central.scale.set(56.1089, 0.2965, 6.3485);

var cube_floor_columns = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_floor_columns.scale.set(65.4645, 0.2965, 2.497);
    cube_floor_columns.position.set(15.9462, 0.5578, -8.8396);
//платформа у поезда
var geo = new THREE.BoxGeometry(2,2,2);
var cube_floor_trainsside = new THREE.Mesh(geo, Floor_CentralMat);
    cube_floor_trainsside.scale.set(51.4855, 0.2965, 1.7465);
    cube_floor_trainsside.position.set(-0.5219, 0.5684, -13.6124);

//разметка у поезда
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

    razmetka.position.y = 0.88; razmetka.rotation.x = -PI/2;
    razmetka.add(stripes_L,dots_L); 
    return razmetka;
}
var razmetka_L = razmetka(82); razmetka_L.position.z =  14.5;
var razmetka_R = razmetka(82); razmetka_R.position.z = -14.5;

//ОГРАЖДЕНИЕ ДЛЯ РОБОТОВ
var geo = new THREE.BoxGeometry(2,2,2);
var cube_stripes_006 = new THREE.Mesh(geo, YellowMat);
cube_stripes_006.position.set(76.6066, 0.8634, 0.0932);
cube_stripes_006.scale.set(-5.1172, 0.0239, 0.1614);
cube_stripes_006.rotation.y = PI/2;
//ОГРАЖДЕНИЕ ДЛЯ РОБОТОВ ПОД ПЕТРОМ
var cube_stripes_004 = cube_stripes_006.clone();
cube_stripes_004.position.x = -31.1419;
//оградка для робота по бокам
var cube_stripes_002 = new THREE.Mesh(geo, YellowMat);
    cube_stripes_002.scale.set(60, 0.02, 0.16);
    cube_stripes_002.position.set(23.6445, 0.8634, 4.7543);

var geo = new THREE.BoxGeometry(2,2,2);
var petr_backwall = new THREE.Mesh(geo, FloorTileMat);
petr_backwall.position.set(-40.9615, 5.4803, 0);
petr_backwall.scale.set(9.4309, 4.626, 8.2679);

var cube_backwall_001 = new THREE.Mesh(geo, FloorTileMat);
cube_backwall_001.position.set(-53.4691, 1.9826, 0);
cube_backwall_001.scale.set(3.0767, 9.221, 14.9665);

var cube_backwall_002 = new THREE.Mesh(geo, FloorTileMat);
cube_backwall_002.position.set(-182.3204, 1.9826, 0);
cube_backwall_002.scale.set(125.7746, 9.221, 14.9665);


out.add(clock,columns_r,columns,image_petr, cube_038MirroredZ, cube_039MirroredZ, cube_040MirroredZ, cube_092MirroredZ, cube_300MirroredZ, cube_bigroofMirroredZ, cube_bigroof_004MirroredZ, cube_041, cube_042, cube_043MirroredZ, cube_044MirroredZ, cube_045, cube_046, cube_047, cube_054, cube_055, cube_056, cube_057, cube_058, cube_059, cube_060, cube_061, cube_062, cube_063, cube_064, cube_065, clock_back, maps_L, maps_R, cube_072MirroredZ, cube_073MirroredZ, cube_074MirroredZ, cube_075MirroredZ, cube_076MirroredZ, cube_297, cube_298, cube_299, cube_floor_central, cube_floor_columns, cube_floor_trainsside, razmetka_L, razmetka_R, cube_stripes_002, cube_stripes_006, cube_stripes_004, petr_backwall, cube_backwall_001, cube_backwall_002);
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
textureLoader = new THREE.TextureLoader();
var cubeTextureLoader = new THREE.CubeTextureLoader();
environmentMap = cubeTextureLoader.load([
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Right.png',
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Left.png',
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Top_RotateNeg90.png',
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Bottom.png',
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Front.png',
    'http://livelab.spb.ru/labs/files/ElDZSkybox_Back.png'
]);
var load = textureLoader.load('http://livelab.spb.ru/labs/files/metromap2023r.jpg');
MapMat = new THREE.MeshStandardMaterial({map:load,roughness:0.8,metalness:0.05});

GlassMat = new THREE.MeshStandardMaterial({color: 0x393D53, transparent: true, opacity: 0.32, roughness: 0.5});
Ceiling_trainMat = new THREE.MeshStandardMaterial({color: 0x604C18, roughness: 0.12}); 
PurpleMat = new THREE.MeshStandardMaterial({color: 0x6600CC, roughness: 0.5});
ColonaMat = new THREE.MeshStandardMaterial({color: 0x333333, roughness: 0.8});
BrassMat = new THREE.MeshStandardMaterial({color: 0xCCCC00, roughness: 0.1, metalness: 0.9});
RoofTilesMat = new THREE.MeshStandardMaterial({color: 0xEEEEEE, metalness: 1, emissive: 0xEEEEEE});
ColoumnPlateMat = new THREE.MeshStandardMaterial({color: 0x664D33, roughness: 0.5});
Floor_ColumnsMat = new THREE.MeshStandardMaterial({color: 0x332619, roughness: 0.2, metalness: 0.1});
Floor_CentralMat = new THREE.MeshStandardMaterial({color: 0x80664D, roughness: 0.9, metalness: 0.1});
BlueMat = new THREE.MeshStandardMaterial({color: 0x1A4DCC, roughness: 0.5});
WhiteDotsMat = new THREE.MeshStandardMaterial({color: 0xEEEEEE});
MetalMat = new THREE.MeshStandardMaterial({color: 0xCCCCCC, metalness: 0.7, roughness:0.35,envMap:environmentMap,envMapIntensity: 0.4});
BrownMat = new THREE.MeshStandardMaterial({color: 0x99664D, roughness: 0.9, metalness: 0.8});
Floor_Sides_1Mat = new THREE.MeshStandardMaterial({color: 0x4D4D33, roughness: 0.3, metalness: 0.1});
//нельзя менять
YellowMat = new THREE.MeshStandardMaterial({color: new THREE.Color(1,0.522,0)});
FloorTileMat = new THREE.MeshStandardMaterial({color: 0x80804D, roughness:0.5, metalness:0.1});
Washer_mainMatDS = new THREE.MeshStandardMaterial({color: 0x334D4D, side:THREE.DoubleSide, roughness:0.5});
WasherMat = new THREE.MeshStandardMaterial({color: 0x334D4D, roughness:0.5});
Floor_trainMat = new THREE.MeshStandardMaterial({color:0x664444, roughness:0.7, metalness:0.1});
cube_108Mat = new THREE.MeshStandardMaterial({color: 0x33CC66});
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
 scene.environment = environmentMap;
 scene.fog = new THREE.FogExp2(0x9999aa, 0.005);
 cameras.main = new THREE.PerspectiveCamera(70,WC/HC,0.1,1000);
 renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.toneMapping = THREE.Uncharted2ToneMapping; //Тонмаппинг
renderer.toneMappingExposure = 0.75; // Экспозиция (регулирует яркость)
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

 var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.35);
 var ambiLight = new THREE.AmbientLight(0xffffff, 0.75);
 var pointLight = new THREE.PointLight(0xFFFFFF, 1);
 pointLight.position.set(0,10,0);
 dirLight1.position.set(5,1, 7);
 scene.add(ambiLight,dirLight1,pointLight);

}
}
// Следующие две функции нужны для переключения камеры с помощью <select>
function initChangeCameraControls() {
// Функция находит select#ChangeCamera на странице, настраивает onclick действие    
var control = document.querySelector('select#ChangeCamera');
if (!control) {
 console.error('Список камер не найден на странице!');
 return;
}
control.addEventListener('input', ChangeCamera);
}
// Срабатывает при выборе камеры из списка
function ChangeCamera(e) {
// Меняет currentCamera.
// currentCamera используется в render(): renderer.render(scene, currentCamera)
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
