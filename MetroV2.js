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

     robo = DrawRobotM();
     robo.rotateX(-PI / 2);
     robo.position.set(X+5*W, Y + 15*W, Z);
     robo.scale.set(W, W, W);
     scene.add(robo);


     render();

     var audio = new Audio();
     audio.loop = true;
     audio.src = "http://livelab.spb.ru/labs/files/metro_sound.mp3";
     audio.volume = 0.1;
     audio.play();
     scene.add(audio);
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

Operator.legL1.rotation.x = sin(PI);
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
trainArriveTime = 450;
trainStayTime = 700;
trainSumTime = 1730;
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
     // Поезд приезжает, передвижение из туннеля к платформе
     train.position.lerpVectors(train.userData.startPos, train.userData.arrivePos, easeOutQuad(current / trainArriveTime));
 else if (!isStay)
     // Поезд уезжает, движение от платформы к следующей станции
     train.position.lerpVectors(train.userData.arrivePos, train.userData.endPos, easeInQuad((current - trainArriveTime - trainStayTime) / (trainSumTime - trainArriveTime - trainStayTime)));
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
         startPos: new THREE.Vector3(130, -1, -18.604),
         arrivePos: new THREE.Vector3(-20, -1, -18.604),
         endPos: new THREE.Vector3(-230, -1, -18.604),
     },
     {
         startPos: new THREE.Vector3(-130, -1, 18.604),
         arrivePos: new THREE.Vector3(-20, -1, 18.604),
         endPos: new THREE.Vector3(230, -1, 18.604),
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
var floor = new THREE.Mesh(geo); floor.receiveShadow = true;
floor.position.set(24.4, 0.574, 0); floor.scale.set(56.1, 0.3, 6.35);
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
floor.material = floor_mat;
//  color: new THREE.Color(0.5,0.4,0.3),
//  metalness: 0.3, roughness: 1,
//  metalnessMap: wetFloorTex,
//  roughnessMap: wetFloorTex,
// });
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
var robot = new THREE.Group();

function DrawOperator() {
var out = new THREE.Group(); 
var Human = DrawHuman();
    Human.position.set(-1.1,-0.15,0); Human.rotation.y = PI/2;
    handL1.rotation.set(-PI/6,0,0);
    handR1.rotation.set(handL1.rotation.x,0,-handL1.rotation.z);
    handL2.rotation.set(-PI/4,0,0);
    handR2.rotation.set(handL2.rotation.x,0,0);
    handL3.rotation.set(0,0,-PI/2);
    handR3.rotation.set(0,-handL3.rotation.y,-handL3.rotation.z);

    fingerR[0].rotation.y=PI/4;
    fingerL[0].rotation.y=-PI/4;

for (i=1;i<5;i++) {
     if (i==1) falangaR[i][1].rotation.x=PI/5;
     else falangaR[i][1].rotation.x=PI/5+i/5; 
     falangaR[i][2].rotation.x=PI/5+i/5;
}
for (i=1;i<5;i++) {
     if (i==1) falangaL[i][1].rotation.x=PI/5;
     else falangaL[i][1].rotation.x=PI/5+i/5; 
     falangaL[i][2].rotation.x=PI/5+i/5;
}

var WS = 0.6; Human.scale.set(WS,WS,WS);
out.add(Human);
return out;
}
Operator = DrawOperator();
    robot.add(Operator);

//Передняя панель
var geo = new THREE.CylinderGeometry(2,2,2,10,1,true,0,PI/2);
var front_panel = new THREE.Mesh(geo,WasherMat); var WS = 0.19; 
    front_panel.scale.set(WS,WS,WS*2);
var geo = new THREE.CylinderGeometry(2,1.6,2,10,1,false,0,PI/2);
var side_panel_l = new THREE.Mesh(geo,WasherMat);
    side_panel_l.scale.set(WS,WS/2,WS*2);
    side_panel_l.position.y = -WS*2+side_panel_l.scale.y;
var side_panel_r = side_panel_l.clone();
    side_panel_r.scale.y = -side_panel_l.scale.y; 
    side_panel_r.position.y = -side_panel_l.position.y;
var lob = new THREE.Group();
    lob.rotation.x = -PI/2; lob.position.set(0.3,0.3,0);
    lob.add(front_panel,side_panel_l,side_panel_r);
//Тело
var geo = new THREE.BoxGeometry(2,2,2);
var body = new THREE.Mesh(geo,WasherMat);
    body.scale.set(0.5,0.385,0.1963);
    body.position.set(-0.2,0.6945,0);
var body_side_l = body.clone();
    body_side_l.position.set(-0.2,0.6045,0.19);
    body_side_l.scale.set(0.5,0.3045,0.19);
var body_side_rot_l = body.clone();
    body_side_rot_l.position.set(-0.2,0.92,0.22);
    body_side_rot_l.scale.set(0.5,0.125,0.1);
    body_side_rot_l.rotation.x = PI/0.046;
//Фары
var faraOut = new THREE.Mesh(geo, WhiteDotsMat);
var faraIn = new THREE.Mesh(geo, YellowMat);
    faraOut.position.set(0.62,0.4,0.255);faraOut.scale.set(0.04,0.07,0.05);
    faraIn.position.set(0.64,0.4,0.26);    faraIn.scale.set(0.03,0.05,0.05);
var fara_fr_l = new THREE.Group();fara_fr_l.add(faraOut, faraIn);
var fara_b_l = new THREE.Mesh(geo, YellowMat);
    fara_b_l.position.set(-0.7,0.35,0.3); fara_b_l.scale.set(0.004,0.0293,0.05);
//Ручка
var Handle = new THREE.Group();
var geo = new THREE.CylinderGeometry(1, 1, 2, 12);
var Handle_mid = new THREE.Mesh(geo,ColonaMat); Handle_mid.rotation.x=PI/2;
    Handle_mid.position.set(-0.85,1,0);Handle_mid.scale.set(0.05,0.5,0.05);
var Handle_end = Handle_mid.clone();
    Handle_end.position.set(-0.45,0.85,0);Handle_end.scale.set(0.035,0.47,0.04);
    Handle.add(Handle_mid,Handle_end);
var Handle_side_l = Handle_mid.clone(); Handle_side_l.rotation.set(PI/2,-PI/8,PI/2);
    Handle_side_l.position.set(-0.65,0.93,0.43);Handle_side_l.scale.set(0.03,0.2,0.03);
//Моющая часть
var washer_mid_fr = new THREE.Mesh(geo, ColonaMat);
    washer_mid_fr.position.set(0.63, 0.16, 0);
    washer_mid_fr.scale.set(0.08, 0.52, 0.08);
    washer_mid_fr.rotation.x = PI/2;
var washer_side_l = new THREE.Mesh(geo, BrownMat);
    washer_side_l.position.set(0.63, 0.16,0.5);
    washer_side_l.scale.set(0.1,0.06,0.1);
    washer_side_l.rotation.x = PI/2;
var geo = new THREE.BoxGeometry(2,2,2);
var washer_l = new THREE.Mesh(geo, BrassMat);
    washer_l.scale.set(0.11, 0.03, 0.03);
    washer_l.rotation.z = 0.3;
    washer_l.position.set(0.75, 0.12, 0.5);
var washer_body = new THREE.Mesh(geo, MetalMat);
    washer_body.position.set(-0.13,0.9,0);
    washer_body.scale.set(0.55,10.09,0.2);
var washer_nakl = new THREE.Mesh(geo, ColonaMat);
    washer_nakl.position.set(0.75, 0.2067, 0);
    washer_nakl.scale.set(0.23, 0.042, 0.15);
    washer_nakl.rotation.z = -0.3;
var washer_fr = new THREE.Mesh(geo, ColonaMat);
    washer_fr.position.set(0.96, 0.143, 0);
    washer_fr.scale.set(0.09,0.09,0.6);
//Колеса
var wheel_back_hold_l = new THREE.Mesh(geo, BrownMat);
    wheel_back_hold_l.scale.set(0.03, 0.18, 0.03);
    wheel_back_hold_l.position.set(-0.54, 0.26, 0.12);
    wheel_back_hold_l.rotation.z = -PI/4;
var geo = new THREE.CylinderGeometry(1,1,2,16);
var tire = new THREE.Mesh(geo, ColonaMat);   tire.scale.set(0.15, 0.06, 0.15);
var wheel_in = new THREE.Mesh(geo, WhiteDotsMat); wheel_in.scale.set(0.1, 0.07, 0.1);
var wheel_fr_l = new THREE.Group();wheel_fr_l.add(tire,wheel_in); wheel_fr_l.rotation.x = PI/2;
var wheel_b = wheel_fr_l.clone(); wheel_b.position.set(-0.7, 0.14, 0);wheel_b.scale.set(1.1,1.1,1.1);
    wheel_fr_l.position.set(0.2, 0.2, 0.35); wheel_fr_l.scale.set(2,1,2);
//Панель управления
var lever = new THREE.Mesh(geo, WhiteDotsMat);
    lever.position.set(-0.8762, 0.485, 0.0796);
    lever.scale.set(0.007, 0.0613, 0.007);
    lever.rotation.set(-PI/0.4,0,PI/1.5);
var btn1 = new THREE.Mesh(geo,BlueMat);btn1.rotation.z = PI/2.5;
    btn1.position.set(-0.777, 0.65, -0.0954);btn1.scale.set(0.02,0.005,0.02);
var btn2 = new THREE.Mesh(geo,YellowMat);btn2.rotation.z = PI/2.5;
    btn2.position.set(-0.777, 0.65, -0.0411);btn2.scale.set(0.02,0.005,0.02);
var btn3 = new THREE.Mesh(geo,BrownMat);btn3.rotation.z = PI/2.5;
    btn3.position.set(-0.777, 0.65, 0.0131);btn3.scale.set(0.02,0.005,0.02);
var btn4 = new THREE.Mesh(geo,BlueMat);btn4.rotation.z = PI/2.5;
    btn4.position.set(-0.777, 0.65, 0.0673);btn4.scale.set(0.02,0.005,0.02);
var bobs1 = new THREE.Mesh(geo, WhiteDotsMat);
    bobs1.position.set(-0.8328, 0.5005, -0.0005);
    bobs1.scale.set(0.006,0.01,0.006);
    bobs1.rotation.z = -PI/9.95;
var bobs2 = bobs1.clone();
    bobs2.position.set(-0.842, 0.4724, -0.0005);
var bobs3 = bobs1.clone();
    bobs3.position.set(-0.8374, 0.4865, 0.09);
var bobs4 = bobs1.clone();
    bobs4.position.set(-0.8374, 0.4865, -0.09);    
var geo = new THREE.BoxGeometry(2,2,2);
var btn_panel_vert_l = new THREE.Mesh(geo, Floor_trainMat);
    btn_panel_vert_l.position.set(-0.74, 0.39, 0);
    btn_panel_vert_l.scale.set(0.07, 0.1, 0.07);
var lever_pan = new THREE.Mesh(geo, BrownMat);
    lever_pan.position.set(-0.833, 0.4853, 0);
    lever_pan.scale.set(0.006, 0.01, 0.1);
    lever_pan.rotation.z = -PI/9.95;
var btn_panel = new THREE.Mesh(geo, Floor_trainMat);
    btn_panel.position.set(-0.7408, 0.5486, -0.0005);
    btn_panel.scale.set(-0.068, -0.122, -0.122);
    btn_panel.rotation.z = -PI/9.95;    
var btnAlt_base = new THREE.Mesh(geo, WhiteDotsMat);
    btnAlt_base.position.set(0.002,0.005,0);
    btnAlt_base.scale.set(0.015,0.005,0.015);
var btnAlt = new THREE.Mesh(geo, ColonaMat);
    btnAlt.scale.set(0.01,0.015,0.01);
var btnAlt_gr = new THREE.Group(); btnAlt_gr.rotation.z = PI/2.5;
    btnAlt_gr.add(btnAlt_base,btnAlt); btnAlt_gr.position.set(-0.81,0.54,-0.09);
var btnAlt_all = new THREE.Group(); btnAlt_all.add(btnAlt_gr);
for(var i=0;i<7;i++){
var btnClone = btnAlt_gr.clone();
    btnClone.position.z+= 0.03*i;
    btnAlt_all.add(btnClone);
}
//Сборка
var leftSideRobo = new THREE.Group();
    leftSideRobo.add(wheel_fr_l,fara_fr_l,body_side_l,body_side_rot_l,Handle_side_l,washer_side_l,wheel_back_hold_l,fara_b_l,washer_l);
var rightSideRobo = leftSideRobo.clone(); rightSideRobo.scale.z = -1;
robot.add(lob,Handle,body,rightSideRobo,washer_mid_fr,leftSideRobo,wheel_b, btn_panel, wheel_back_hold_l, btn_panel_vert_l, btn1, btn2, btn3, btn4, lever_pan, bobs1, bobs2, bobs3, bobs4, lever, btnAlt_all, washer_body, washer_fr, washer_nakl);
robot.rotateX(PI/2);
var WS = 1.5; robot.scale.set(WS,WS,WS);
var out = new THREE.Group();
out.add(robot);
// ===== CAMERA 2
cameras.robot = new THREE.PerspectiveCamera(75, WC / HC, 1, 1000);
cameras.robot.rotation.set(PI/2,-PI/2, 0);
cameras.robot.position.set(-4, 0, 2);
out.add(cameras.robot);
// откуда
var geometry = new THREE.SphereGeometry(0.5, 12, 12);
RobotMData.Sonar = new THREE.Mesh(geometry);
RobotMData.Sonar.position.x = 1.2;
RobotMData.Sonar.scale.setScalar(0.2);
// Линия луча
var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
var Linetelo = new THREE.Mesh(geometry);
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
    cylinder_wheel2.rotation.x = PI/2;
var cylinder_wheel3 = new THREE.Mesh(geo, ColonaMat);
    cylinder_wheel3.position.set(0, 0.0052, -0.4846);
    cylinder_wheel3.scale.set(-0.0159, -0.0054, -0.0158);
    cylinder_wheel3.rotation.x = PI/2;
var cylinder_wheel1 = new THREE.Mesh(geo, ColonaMat);
    cylinder_wheel1.position.set(0.3747, 0.0394, 0.2595);
    cylinder_wheel1.scale.set(-0.0516, -0.0176, -0.0515);
    cylinder_wheel1.rotation.x = PI/2;
var cylinder_button_off = new THREE.Mesh(geo, BrassMat);
    cylinder_button_off.position.set(0.0516, 0.2185, -0.4293);
    cylinder_button_off.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_button_on = new THREE.Mesh(geo, PurpleMat);
    cylinder_button_on.position.set(-0.0509, 0.2185, -0.4293);
    cylinder_button_on.scale.set(0.0227, 0.0227, 0.0227);
var cylinder_brushes = new THREE.Mesh(geo, cylinder_brushesMat);
    cylinder_brushes.position.set(0,0.0858,0);
    cylinder_brushes.scale.set(0.28, 0.0802, 0.0802);

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
var cube_antenna2 = new THREE.Mesh(geo, WhiteDotsMat);
    cube_antenna2.position.set(0.4558, 0.3083,0);
    cube_antenna2.scale.set(-0.0949, -0.0088, -0.0041);

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
CleanRobotData.Sonar = new THREE.Mesh(geo);
CleanRobotData.Sonar.position.x = 0.5;
CleanRobotData.Sonar.scale.setScalar(0.2);
// Линия луча
var geo = new THREE.CylinderGeometry(0.05, 0.05, 1, 9);
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
    skamia_side_top.position.set(0,3.6,-2.1);skamia_side_top.rotation.x = -PI/2.2;
    skamia_side_top.scale.set(0.06,0.3,0.4);
    skamia_side_mid.position.set(0,2.8,-1.79); skamia_side_mid.rotation.x = -PI/2.2;
    skamia_side_mid.scale.set(0.06,0.6,0.5);
var skamia_side_l = new THREE.Group(); skamia_side_l.position.set(-8.4,0,0);
    skamia_side_l.add(skamia_side_mid,skamia_side_top);
var skamia_side_r = skamia_side_l.clone(); skamia_side_l.position.x = -4.4; 
var mesh = new THREE.Mesh(geo, BrownMat);
var sidushka = new THREE.Mesh(geo, sidenia_mat); var spinka = sidushka.clone();
    sidushka.position.set(-6.4,3.1,-1.8); sidushka.scale.set(2,0.08,0.5);
    spinka.position.set(-6.4,3.45,-2.2);spinka.scale.set(2,0.08,0.43);
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
    plakat.position.set(1.56, 4.88, 2.35);
    plakat.scale.set(0.5, 0.6, 0.01);
var plakat_1 = new THREE.Mesh(geo, BrownMat);
    plakat_1.position.set(-4.86, 4.88, -2.35);
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
    ceiling_r.rotation.x = -ceiling_l.rotation.x;
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
function DrawHuman() {
var KBx=0.8;  // ширина бедер
var KPx=0.19; // смещение ягодицы
var Kz=17;    // делитель степени прогиба спины

function DrawKubik(xk,yk,zk,dx,dy,dz,Col) {
var j,x,y,z,WS;
// ЛАСТИК ИЗ ШАРА
WS=2/3;
var material = new THREE.MeshStandardMaterial( { color: Col } );
var geometry = new THREE.SphereGeometry(1,25,25);
var last = new THREE.Mesh( geometry, material );
    for (var j = 0; j < geometry.vertices.length; j++) {
    x=geometry.vertices[j].x; 
    y=geometry.vertices[j].y; 
    z=geometry.vertices[j].z; 
    if (abs(x)>WS) x=WS*sign(x); // if (x<-WS) x=-WS;
    if (abs(y)>WS) y=WS*sign(y); // if (y<-WS) y=-WS;
    if (abs(z)>WS) z=WS*sign(z); // if (z<-WS) z=-WS;
    geometry.vertices[j].x=x;
    geometry.vertices[j].y=y;
    geometry.vertices[j].z=z;
}
last.position.set(xk,yk,zk);
last.scale.set(dx,dy,dz);
return last;
}
function DrawTelo() {
var x,y,z,p,r,K;
// ТЕЛО ИЗ СФЕРЫ 
var material = new THREE.MeshStandardMaterial({color: 0xffdead});
var geometry = new THREE.SphereGeometry(1,40,20);
var tube = new THREE.Mesh( geometry, material );
    K=0.4; // сжатие в дыньку
    for (var j = 0; j < geometry.vertices.length; j++) {
    z=geometry.vertices[j].z; 
    x=geometry.vertices[j].x; 
    y=geometry.vertices[j].y; 
// ПЛЕЧИ
    if ((z>0.2)&&(z<0.8)) 
    if ((abs(x)>0.6)||(y<0)) { x=1.9*x;
    if (abs(x)>1.7) x=1.7*sign(x);
    }
// КРЕСТЕЦ
    if (z<-0.4) { x=1.2*x; p=-0.85; if (z<p) z=p; }
// СПИННОЙ ХРЕБЕТ И ТОРС
    if (y>0.6) y=0.6-exp(-5*abs(x))/20+abs(sin(PI*x))/20; 
// ЭФФЕКТ ВДАВЛЕННОЙ ВАННЫ
    if (z<0.4) { // ПОДТЯЖКА ЖИВОТА 
    if ((z<-0.99)&&(y<0.5)) z=z+0.05; 
    geometry.vertices[j].z=0.95*z; // .05
}
    if (0) if (z<-0.4) if (y>0) { 
// ПОЯСНИЧНАЯ ОБЛАСТЬ
var Kzx=abs(sin(2*(z+0.4))*sin(2*x));
    x=x+sign(x)*0.2*Kzx; y=y+0.9*Kzx;
    }else{
var Kzx=abs(sin(2*(z+0.4))*sin(2*(abs(x)+0.1)));
    x=x+sign(x)*0.5*Kzx; y=y+0.9*Kzx; 
}
// ГРУДНАЯ КЛЕТКА
    if ((z<0)&&(y<0)&&(abs(x)<0.7)) y+=0.05*abs(sin(5*z)*cos(5*x));
    geometry.vertices[j].x=K*x;
    // ПРОГИБ В ПОЯСНИЦЕ: 
    geometry.vertices[j].y=K*y-cos(PI*z/2)/Kz;
}
    geometry.computeVertexNormals();
var geometry = new THREE.SphereGeometry(0.1,20,20);
    copchik=new THREE.Mesh( geometry, material ); 
    copchik.scale.set(1.8,1,2); z=-0.55; y=0.15-cos(PI*z/2)/Kz;
    tube.add(copchik); copchik.position.set(0,y,z);

// КЛЮЧИЦЫ
var kluchR = DrawKubik(-0.26,-0.235,0.68,0.3,0.05,0.05,0xffdead);
var kluchL = kluchR.clone(); kluchL.position.x=-kluchR.position.x;
    kluchL.rotation.y=-PI/20; kluchR.rotation.y=-kluchL.rotation.y;
    kluchL.rotation.z=PI/10;  kluchR.rotation.z=-kluchL.rotation.z;
    tube.add(kluchL,kluchR);
// РЕБРА
    for (j = 0; j < 3; j++) {
var kubR = DrawKubik(-0.285,-0.1-0.008*j,-0.15+0.1*j,0.15,0.1,0.1,0xffdead);
var kubL = kubR.clone(); kubL.position.x=-kubR.position.x;
    tube.add(kubL,kubR);
}
// ГРУДНЫЕ МЫШЦЫ И МЫШЦЫ ЖИВОТА
var material = new THREE.MeshStandardMaterial( { color: 0xffdead } );
var geometry = new THREE.SphereGeometry(0.2,25,25);
var grudR  = new THREE.Mesh( geometry, material );
    sosR=grudR.clone(); var WS=1/4; sosR.scale.set(WS,WS,WS);     
    sosR.position.set(0,-0.15,-0.05); grudR.add(sosR); 
    z=0.35; y=-0.3-cos(PI*z/2)/Kz;
    grudR.position.set(-0.2,y,z); 
var grudL = grudR.clone(); grudL.position.x=-grudR.position.x;
    tube.add(grudR,grudL);

var geometry = new THREE.TorusGeometry(1,1.2,20,10);
var pup = new THREE.Mesh( geometry, material );
    WS=0.035; pup.scale.set(WS/3,WS,WS);
    z=-0.4; y=-0.31-cos(PI*z/2)/Kz;
    pup.position.set(0,y,z);
    pup.rotation.x=-PI/2; // 2.5
    tube.add(pup); 

// ТРЯПКА ТРУСОВ ИЛИ ПРОМЕЖНОСТЬ
    if (0) { tube.add(DrawTunika()); }else{
    z=-0.85; y=-0.2-cos(PI*z/2)/Kz;
var leaf=DrawLeaf(0.07,0x227733);
    leaf.position.set(0,y,z);
    leaf.rotation.x=2*PI/4;
    tube.add(leaf);
}
     
// юстировка
var out = new THREE.Group(); 
var WS=3; tube.scale.set(WS,WS,WS);
    tube.position.z=0.8*WS;
    tube.castShadow = true;
    out.add(tube);
return out;
}
function DrawPopa() {
var x,y,z,p,px,py,dwn,r,K;
// СФЕРЫ ЯГОДИЦ: ТРУСЫ
if (0) { text='http://livelab.spb.ru/labs/files/Painting1.jpg';
var texture = new THREE.TextureLoader().load(text);
var material = new THREE.MeshLambertMaterial({color:0xffdead,map:texture});
    }else var material = new THREE.MeshStandardMaterial({ color: 0xffdead  });
var geometry = new THREE.SphereGeometry(0.42,20,20);
var ppopL = new THREE.Mesh( geometry, material );
    K=0.78; // сжатие в дыньку
    for (var j = 0; j < geometry.vertices.length; j++) {
    z=geometry.vertices[j].z; 
    x=geometry.vertices[j].x; 
    y=geometry.vertices[j].y; 
// ОТСТУП СПЕРЕДИ
var p=0.15; if (y<-p) y=-p; 
// ОТСТУП СНИЗУ
var p=0.32; if (z<-p) z=-p; 
// ОТСТУП ОТ СЕРЕДИНЫ
var p=0.25; if (x<-p) 
    if (z<-0.2) x=x+sin(0.75*(p+x));
    geometry.vertices[j].z=0.75*z;
    geometry.vertices[j].x=0.75*K*x;
    geometry.vertices[j].y=K*y-sin(PI*z/3-1)/5;
}
    geometry.computeVertexNormals();
var ppopR = ppopL.clone(); ppopR.scale.set(-1,1,1);
    popL =  new THREE.Group(); popL.add(ppopL);  
    popR =  new THREE.Group(); popR.add(ppopR);
    px=KPx; py=-0.1; dwn = 0;
    popL.position.set(px,py,dwn); popR.position.set(-px,py,dwn);
var out = new THREE.Group(); out.add(popL,popR);
var WS=3.2; out.scale.set(WS,WS,WS);
out.position.z=7;
return out;
}
function DrawLeaf(R,Col) { 
// Heart Leaf
const vertices = [
new THREE.Vector3(0, 0, 0), // point C
new THREE.Vector3(0, 5, -1.5),
new THREE.Vector3(5, 5, 0), // point A
new THREE.Vector3(9, 9, 0),  new THREE.Vector3(5, 9, 2),
new THREE.Vector3(7, 13, 0), new THREE.Vector3(3, 13, 0),
new THREE.Vector3(0, 11, 0), new THREE.Vector3(5, 9, -2),
new THREE.Vector3(0, 8, -3), new THREE.Vector3(0, 8, 3),
new THREE.Vector3(0, 5, 1.5), // point B
new THREE.Vector3(-9, 9, 0),  new THREE.Vector3(-5, 5, 0),
new THREE.Vector3(-5, 9, -2), new THREE.Vector3(-5, 9, 2),
new THREE.Vector3(-7, 13, 0), new THREE.Vector3(-3, 13, 0),
];
const trianglesIndexes = [
// face 1
    2,11,0, // This represents the 3 points A,B,C 
    2,3,4,5,4,3,4,5,6,4,6,7,4,7,10,4,10,11,4,11,2,
    0,11,13,12,13,15,12,15,16,16,15,17,17,15,7,7,15,10,
    11,10,15,13,11,15,
// face 2
    0,1,2,1,9,2,9,8,2,5,3,8,8,3,2,6,5,8,7,6,8,
    9,7,8,14,17,7,14,7,9,14,9,1,9,1,13,1,0,13,
    14,1,13,16,14,12,16,17,14,12,14,13];
const geo = new THREE.Geometry()
    for (let i in trianglesIndexes) {
    if ((i+1)%3 === 0) {
    geo.vertices.push(vertices[trianglesIndexes[i-2]], 
    vertices[trianglesIndexes[i-1]],vertices[trianglesIndexes[i]])
    geo.faces.push(new THREE.Face3(i-2, i-1, i))
    }
}
    geo.computeVertexNormals()
var material = new THREE.MeshLambertMaterial( { color: Col} )
var LeafMesh = new THREE.Mesh(geo, material)
    LeafMesh.position.y=-1.8*R; 
    LeafMesh.scale.set(R/5,R/5,R/50);
// красный шарик центра
var material = new THREE.MeshStandardMaterial({ color: 0xff2222 });
var geometry = new THREE.SphereGeometry(0.5*R,10,10);
var Marker = new THREE.Mesh( geometry, material );
var out =  new THREE.Group(); out.add(LeafMesh,Marker);
return out;
}
function DrawTunika() {
// Одежда
    texture='http://livelab.spb.ru/labs/files/borshevik_flower.jpg';
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(texture); 
var material = new THREE.MeshStandardMaterial({ map: texture });
// Используем IcosahedronGeometry для создания грубой формы
var geometry = new THREE.IcosahedronGeometry(0.58, 1);
// Изменяем вершины для создания неровной поверхности
    for (var i = 0; i < geometry.vertices.length; i++) {
var vertex = geometry.vertices[i];
    vertex.x += (random() - 0.5) * 0.1;
    vertex.y += (random() - 0.5) * 0.1+0.1;
    vertex.z += (random() - 0.5) * 0.1;
    vertex.y *= 0.8;
    if (vertex.y<0) vertex.y *= (1+vertex.z);
    if (vertex.z < -0.4) vertex.z = 0; else 
    if (vertex.z >  0.4) vertex.z = 0.4;    
}
var tun = new THREE.Mesh(geometry, material);
// Юстировка
var out = new THREE.Group();
tun.position.set(0, 0, -0.8);
out.add(tun);
return out;
}
function DrawBedro() {
var material = new THREE.MeshStandardMaterial({ color: 0xffdead  });
var geometry = new THREE.SphereGeometry(0.8,40,20);
var bedro = new THREE.Mesh( geometry, material );
    bedro.scale.set(0.85,1,2.2); 
var bedroD=DrawKubik(-0.1,-0.1,-0.75,0.5,0.5,0.3,0xffdead);
var bedroU=bedroD.clone();
var WS=1; bedroU.scale.set(WS,WS,0.75);
    bedroU.position.set(-0.1,0.05,0.3);
    bedro.add(bedroD,bedroU);
    bedro.position.set(0.1,0.1,-1.2);
return bedro;
}
function DrawGolen() {
var material = new THREE.MeshStandardMaterial({ color: 0xffdead  });
var geometry = new THREE.SphereGeometry(0.35,40,20);
var golen = new THREE.Mesh( geometry, material );
    golen.scale.set(1,1,2.7);
    golen.position.set(0.1,0.1,-1.3);
var kubR = DrawKubik(0.15,0.3,0.1,0.21,0.1,0.1,0xffdead);
var kubL = kubR.clone(); kubL.position.x=-kubR.position.x;
    golen.add(kubL,kubR);
return golen;
}
function DrawSustav(typ,dx,dz,len) {
var x,y,z,p,r,K;
// ИЗ СФЕРЫ 
var material = new THREE.MeshStandardMaterial({ color: 0xffdead });
var geometry = new THREE.SphereGeometry(1,50,25);
var tube = new THREE.Mesh( geometry, material );
    K=0.1; // сжатие в дыньку
    for (var j = 0; j < geometry.vertices.length; j++) {
    z=geometry.vertices[j].z; 
    x=geometry.vertices[j].x; 
    y=geometry.vertices[j].y; 
    if (typ==0) { if (z>0) if (abs(x)<dx) z=dz; }else 
    if (typ==1) { if (z>0) if (abs(x)>dx) z=dz; }else 
    if (typ==2) { if (z>0) { if (x>dx) z=dz; } 
                else if (abs(x)>dx) z=-dz;
                }else 
    if (typ==3) { if (z>0) { if (x<-dx) z=dz; } 
                else if (abs(x)>dx) z=-dz;
    }   
    p=0.7; if (z>p) z=p; if (z<-p) z=-p;
    geometry.vertices[j].z=z;
    geometry.vertices[j].x=K*x;
    geometry.vertices[j].y=K*y;
}
    if (typ==1) tube.rotation.y=PI;
// красный шарик центра
    if (0) {
var material = new THREE.MeshStandardMaterial({ color: 0xff2222 });
var geometry = new THREE.SphereGeometry(0.5,50,25);
var Marker = new THREE.Mesh( geometry, material );
var WS=0.15; Marker.scale.set(1,WS,WS);
}
// юстировка
var out = new THREE.Group(); 
    tube.position.z=-1.5*len; tube.castShadow = true;
var WS=2.5; tube.scale.set(WS,WS,WS*len);
    out.add(tube);
return out;
}
function DrawStupniaR() {
var x,y,z,j;
var material = new THREE.MeshStandardMaterial({ color: 0xffdead });
var geometry = new THREE.CylinderBufferGeometry(1,1,3,20,2,false,0,PI);
var sandalia = new THREE.Mesh(geometry, material);
var geometry = new THREE.CubeGeometry(2,3,0.1);
var podoshva = new THREE.Mesh(geometry, material);
    sandalia.rotation.y = -PI/2;
var stupnia = new THREE.Group();
    stupnia.add(sandalia); stupnia.add(podoshva);
    stupnia.add(DrawKubik(0,-0.8,1,0.33,0.5,0.25,0xff9922));  
    legfingerR = []; y=-1.7; z=0.2;
    for (j = 0; j <5; j++) {  x=0.65-0.35*j; 
    if (j==0) legfingerR[j]=DrawKubik(0,0,0,0.3,0.33,0.3,0xffdead);
    else // Greece
    if (j==1) legfingerR[j]=DrawKubik(0,0,0,0.25,0.43,0.25,0xffdead);
    else legfingerR[j] = DrawKubik(0,0,0,0.25,0.33,0.25,0xffdead); 
    legfingerR[j].position.set(x,y,z);
    stupnia.add(legfingerR[j]);
    }
    legfingerR[0].position.x+=0.05;
// юстировка
var out = new THREE.Group(); 
var WS=0.45; stupnia.scale.set(WS,WS,WS);
    stupnia.position.set(0,-0.5*WS,-0.98*WS);
out.add(stupnia);
return out;
}
function DrawStupniaL() {
var x,y,z,j;
var material = new THREE.MeshStandardMaterial({ color: 0xffdead });
var geometry = new THREE.CylinderBufferGeometry(1,1,3,20,2,false,0,PI);
var sandalia = new THREE.Mesh(geometry, material);
var geometry = new THREE.CubeGeometry(2,3,0.1);
var podoshva = new THREE.Mesh(geometry, material);  
    sandalia.rotation.y = -PI/2;
var stupnia = new THREE.Group();
    stupnia.add(sandalia); stupnia.add(podoshva);
    stupnia.add(DrawKubik(0,-0.8,1,0.33,0.5,0.25,0xff9922));
    legfingerL = []; y=-1.7; z=0.2; 
    for (j = 0; j <5; j++) {  x=-0.65+0.35*j; 
    if (j==0) legfingerL[j]=DrawKubik(0,0,0,0.3,0.33,0.3,0xffdead);
    else // Greece
    if (j==1) legfingerL[j]=DrawKubik(0,0,0,0.25,0.43,0.25,0xffdead);
    else legfingerL[j] = DrawKubik(0,0,0,0.25,0.33,0.25,0xffdead); 
    legfingerL[j].position.set(x,y,z);
    stupnia.add(legfingerL[j]);
    }
    legfingerL[0].position.x-=0.05;
// юстировка
var out = new THREE.Group(); 
var WS=0.45; stupnia.scale.set(WS,WS,WS);
    stupnia.position.set(0,-0.5*WS,-0.98*WS);
out.add(stupnia);
return out;
}
function DrawHandR() {
var x,y,z,i,j,k,f;
var hand = new THREE.Group();
    hand.add(DrawKubik(0,0,0,0.9,0.21,1,0xffdead));
// ось крепления
    hand.add(DrawKubik(0,0.25,-0.5,0.3,0.4,0.3,0xffdead));
    hand.add(DrawKubik(0.4,-0.15,0.1,0.5,0.36,0.59,0xffdead));
    fingerR = []; falangaR = matrix(5,3);
    for (var j = 0; j < 5; j++) {  f=j; if (j==1) f=3;
    fingerR[j] = new THREE.Group();
    for (var i = 0; i < 3; i++) { 
    falangaR[j][i] = new THREE.Group();
var kub = DrawKubik(0,0,0,0.2-i/100,0.2-i/100,0.35-f/50,0xffdead);
    kub.position.z=0.22; 
    if (i>1) kub.position.z-=i*f/250; 
    if (i>0) kub.position.z-=f/50;
    falangaR[j][i].add(kub);
    if (i>0) falangaR[j][i].position.z=0.43;
    else falangaR[j][i].position.z=-0.22;
    for (var k = 0; k < i; k++)
    falangaR[j][k].add(falangaR[j][i]);
    }
    fingerR[j].add(falangaR[j][0]);
    x=0.75-0.3*j; y=0; z=0.8; 
    fingerR[j].position.set(x,y,z);
    hand.add(fingerR[j]);
    }
    fingerR[0].position.set(0.55,-0.25,z-0.79);  
    fingerR[0].rotation.z=PI;    
    hand.position.z=-0.2; hand.rotation.set(PI,0,PI/2);
var WS=0.5; hand.scale.set(WS,WS,WS);
var out = new THREE.Group();
out.add(hand);
return out;
}
function DrawHandL() {
var x,y,z,i,j,k,f;
var hand = new THREE.Group();
    hand.add(DrawKubik(0,0,0,0.9,0.21,1,0xffdead));
// ось крепления
    hand.add(DrawKubik(0,0.25,-0.5,0.3,0.4,0.3,0xffdead));
    hand.add(DrawKubik(-0.4,-0.15,0.1,0.5,0.36,0.59,0xffdead));
    fingerL = []; falangaL = matrix(5,3);
    for (var j = 0; j < 5; j++) { f=j; if (j==1) f=3;
    fingerL[j] = new THREE.Group();
    for (var i = 0; i < 3; i++) { 
    falangaL[j][i] = new THREE.Group();
var kub = DrawKubik(0,0,0,0.2-i/100,0.2-i/100,0.35-f/50,0xffdead);
    kub.position.z=0.22; 
    if (i>1) kub.position.z-=i*f/150; 
    if (i>0) kub.position.z-=f/50;
    falangaL[j][i].add(kub);
    if (i>0) falangaL[j][i].position.z=0.43;
    else falangaL[j][i].position.z=-0.22;
    for (var k = 0; k < i; k++)
    falangaL[j][k].add(falangaL[j][i]);
    }
    fingerL[j].add(falangaL[j][0]);
    x=-0.75+0.3*j; y=0; z=0.8; 
    fingerL[j].position.set(x,y,z);
    hand.add(fingerL[j]);
    }
    fingerL[0].position.set(-0.55,-0.25,z-0.79); 
    fingerL[0].rotation.z=PI;     
    hand.position.z=-0.2; hand.rotation.set(PI,0,-PI/2);
var WS=0.5; hand.scale.set(WS,WS,WS);
var out = new THREE.Group();
out.add(hand);
return out;
}
function DrawHead() {
var j,x,y,z,r;r=1.01;
var geometry = new THREE.SphereGeometry(r,16,16,0,PI);
var material = new THREE.MeshPhongMaterial({ color: 0xa0522d});
var BackHeir = new THREE.Mesh(geometry, material); 
var geometry = new THREE.CylinderGeometry(r,r,0.1,20);
var BackHeirDown = new THREE.Mesh(geometry, material); 
    BackHeir.add(BackHeirDown); BackHeirDown.rotation.x=PI/2;
    BackHeir.rotation.x = PI+0.75;
// ЛОКОН
    BackHeir.add(DrawKubik(0,-0.99,0,0.25,0.1,0.25,0xffdead));  
// ИЗ СФЕРЫ голова
    Face='http://livelab.spb.ru/labs/files/MashaFF.jpg?12345';
var texture = new THREE.TextureLoader().load(Face);
var faceMat = new THREE.MeshLambertMaterial({color:0xFFDEAD,map:texture});
var geometry = new THREE.SphereGeometry(1,20,20,0,PI);
var headMesh = new THREE.Mesh( geometry, faceMat );
    BackHeir2=BackHeir.clone(); BackHeir2.rotation.x=3;
    Podbor=BackHeir.clone(); Podbor.rotation.x=1.5; // 2.5;
    headMesh.add(BackHeir,BackHeir2,Podbor);
// Лицо сетки смотрит вверх, высота y  
    headMesh.rotation.set(PI/2,0,0);
    lipsdist=-0.3; // граница губ по высоте
    eyedist=-0.65;   // отстояние глаз от затылка

    for (var j = 0; j < geometry.vertices.length; j++) {
    x=geometry.vertices[j].x; 
    y=geometry.vertices[j].y; 
    z=geometry.vertices[j].z; 
    r=0.7; // низ головы срезаем
    // Лицо сетки смотрит вверх, высота y  
    if (y<-r) geometry.vertices[j].y=-r;
    else 
    if (z>0) { // лицевая часть
    if (y>lipsdist+0.1) // граница губ
    // делаем плоское лицо (выполаживаем)
    if ((abs(x)<0.5)&&(y<0.5)) { r=0.95;
// на нос попадает одна точка из 20x20
    if ((abs(x)<0.1)&&(y>-0.1)&&(y<0.1)) r=1.01;  
    geometry.vertices[j].z=r*z;
    geometry.vertices[j].x=r*x; 
    }}
// голова дынькой/редькой
    x=geometry.vertices[j].x; 
    z=geometry.vertices[j].z; 
    r=0.85+0.05*(1-y); z=r*z; x=r*x; 
    geometry.vertices[j].z=r*z;
    geometry.vertices[j].x=r*x; 
    geometry.vertices[j].y=r*y; 
}
// Пересчитываем нормали после изменения вершин
    headMesh.geometry.computeVertexNormals();
var head = new THREE.Group(); head.add(headMesh);
    head.castShadow = true;
          
// Юстировка размера и высоты головы на шее
var WS=1.2; head.scale.set(WS,WS,WS); 
    head.position.set(0,0,1.2);
// красный шарик центра 0xff2222 -> шея
var geometry = new THREE.SphereGeometry(0.35,50,25);
var Marker = new THREE.Mesh( geometry, HumanMat );
var out = new THREE.Group();
    out.add(head,Marker);
    return out;    
}

var Robot = new THREE.Group(); 
    head=DrawHead();
    tors = DrawTelo();
    head.position.z=5.3;
    tors.position.z=6.7;
    tors.add(head);

    popa = DrawPopa(); 
    Robot.add(tors,popa);

    plechoR0 = new THREE.Group(); 
    plechoL0 = new THREE.Group(); 
    plechoR = new THREE.Group(); 
    plechoL = new THREE.Group(); 
    handR1 = DrawSustav(1,0.3,0.5,0.7); 
    handR2 = DrawSustav(0,0.3,0.5,0.64); 
    handR3=DrawHandR();
    handR2.add(handR3);
    handR1.add(handR2);
    handR2.position.z=handR1.position.z-2.1;
    handR3.position.z=handR2.position.z+0.1;
    plechoR0.position.set(-1.7,-0.25,3.8);
    plechoR.add(handR1);
    plechoR0.add(plechoR); 
    tors.add(plechoR0);

    handL1 = DrawSustav(1,0.3,0.5,0.7); 
    handL2 = DrawSustav(0,0.3,0.5,0.64); 
    handL3=DrawHandL();
    handL2.add(handL3);
    handL1.add(handL2);
    handL2.position.z=handL1.position.z-2.1; 
    handL3.position.z=handL2.position.z+0.1;
    plechoL0.position.set(1.7,-0.25,3.8);
    plechoL.add(handL1); 
    plechoL0.add(plechoL);
    tors.add(plechoL0);

var plecho=DrawKubik(0,0,0,0.5,0.5,0.5,0xffdead);
var lochot=DrawKubik(-0.2,0,-2.1,0.1,0.1,0.1,0xffdead);
    handR1.add(plecho,lochot);
var plecho=DrawKubik(0,0,0,0.5,0.5,0.5,0xffdead);
var lochot=DrawKubik(0.2,0,-2.1,0.1,0.1,0.1,0xffdead);
    handL1.add(plecho,lochot);

    bedroR0 = new THREE.Group();
    bedroL0 = new THREE.Group();
    bedroR = new THREE.Group();
    bedroL = new THREE.Group();
    legR1 = DrawSustav(2,0.3,0.5,1);
    legR2 = DrawSustav(0,0.3,0.5,1);
    legR3 = DrawStupniaR();
    legR2.add(legR3);
    legR1.add(legR2);
    legR2.position.z=legR1.position.z-3;
    legR3.position.z=legR2.position.z;  
var musclebedroR = DrawBedro();
    legR1.add(musclebedroR);
var musclegolenR = DrawGolen();
    legR2.add(musclegolenR);
    bedroR0.position.set(-KBx,0,6.8);
    bedroR.add(legR1);
    bedroR0.add(bedroR);
    Robot.add(bedroR0);

    legL1 = DrawSustav(3,0.3,0.5,1);
    legL2 = DrawSustav(0,0.3,0.5,1);
    legL3 = DrawStupniaL();
    legL2.add(legL3);
    legL1.add(legL2);
    legL2.position.z=legL1.position.z-3; 
    legL3.position.z=legL2.position.z;  
    musclebedroL = musclebedroR.clone();
    musclebedroL.scale.x=-musclebedroL.scale.x;
    musclebedroL.position.x=-musclebedroL.position.x;
    legL1.add(musclebedroL);
var musclegolenL = DrawGolen();
    musclegolenL.position.x=-musclegolenL.position.x;
    legL2.add(musclegolenL);
    bedroL0.position.set(KBx,0,6.8);
    bedroL.add(legL1);
    bedroL0.add(bedroL);
    Robot.add(bedroL0);

    // юстировка
    Robot.position.z=-0.45;
var out = new THREE.Group(); 
var WS=0.25; Robot.scale.set(WS,WS,WS);
Robot.rotation.set(-PI/2,0,0);
out.add(Robot);
return out; 
}
function DrawVagon() {
var out = new THREE.Group();

function DrawSitPassenger() {
var out = new THREE.Group(); 
var Human = DrawHuman();
    Human.position.y = 2.4;

    legL1.rotation.set(-PI/2,0,0);
    legR1.rotation.set(legL1.rotation.x,0,0);
    legL2.rotation.set(PI/2,0,0);
    legR2.rotation.set(legL2.rotation.x,0,0);

    handL1.rotation.set(-PI/6,0,-PI/2);
    handR1.rotation.set(handL1.rotation.x,0,-handL1.rotation.z);
    handL2.rotation.set(-PI/4,0,0);
    handR2.rotation.set(handL2.rotation.x,0,0);
    handL3.rotation.set(0,-PI/4,-PI/5);
    handR3.rotation.set(0,-handL3.rotation.y,-handL3.rotation.z);

out.add(Human);
return out;
}

var SitPassenger_1 = DrawSitPassenger();
    SitPassenger_1.position.set(-7,-0.8,-1.45);
var SitPassenger_2 = DrawSitPassenger();
    SitPassenger_2.position.set(7,-0.8,-1.45);    
var SitPassenger_3 = DrawSitPassenger();
    SitPassenger_3.rotation.y = PI;
    SitPassenger_3.position.set(1.2,-0.8,1.45); 

out.add(SitPassenger_1,SitPassenger_2,SitPassenger_3);

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
var leftSide = new THREE.Group();
//КАРТИНА С ПЕТРОМ
var geom = new THREE.BoxGeometry(2,2,2);
var image_petr = new THREE.Mesh(geom, petr_mat); image_petr.receiveShadow = true;
    image_petr.position.set(-31,6,0);  image_petr.scale.set(0.2,3.8,3.8);
var image_base = new THREE.Mesh(geom, BrassMat); image_base.receiveShadow = true;
    image_base.position.set(-31.1,6,0);image_base.scale.set(0.2,4,4);
//колонны
function DrawColumn() {
var geo = new THREE.CylinderGeometry(1, 1, 2, 12);
var col_main = new THREE.Mesh(geo,colonna_mat); 
    col_main.position.y = 3.3;col_main.scale.set(0.5,2.5,0.5);
    col_main.receiveShadow = true; col_main.castShadow = true;
var col_bot = new THREE.Mesh(geo,ColPlateMat);
    col_bot.position.y = 1;   col_bot.scale.set(0.55, 0.2, 0.55);
var col_top = col_bot.clone();col_top.position.y = 5.5;
var col_dec = new THREE.Mesh(geo,BrassMat);
    col_dec.position.y = 5.6; col_dec.scale.set(0.6, 0.15, 0.6);
var geo = new THREE.BoxGeometry(2,2,2);
var colSup_top = new THREE.Mesh(geo, WhiteDotsMat);
    colSup_top.scale.set(0.7,0.1,1.04);colSup_top.position.y = 5.8;
var col_single = new THREE.Group(); col_single.add(col_main,col_bot,col_top,col_dec,colSup_top);
    col_single.position.set(-30.7,0,0.17);
//арка
var arc_vert = new THREE.Mesh(geo, ColPlateMat);
    arc_vert.position.set(-5.7, 0, 0.9);
    arc_vert.scale.set(1,3.5,0.8);
var cube_2 = new THREE.Mesh(geo, ColPlateMat);
    cube_2.position.set(-4.8356, 0.9, 0.9);
    cube_2.scale.set(0.4453, 0.29, 0.8); cube_2.rotation.z = PI/2.947;
var cube_4 = new THREE.Mesh(geo, ColPlateMat);
    cube_4.position.set(-4.3814, 1.6, 0.9);
    cube_4.scale.set(0.4453, 0.43, 0.8); cube_4.rotation.z = PI/4.823;
var cube_5 = new THREE.Mesh(geo, ColPlateMat);
    cube_5.position.set(-3.5579, 1.832, 0.9);
    cube_5.scale.set(0.4453, 0.23, 0.8); cube_5.rotation.z = PI/10.105;
var cube_6 = new THREE.Mesh(geo, ColPlateMat);
    cube_6.position.set(-2.6974, 1.8917, 0.9);
    cube_6.scale.set(0.4453, 0.15, 0.8);
var cube_7 = new THREE.Mesh(geo, ColPlateMat);
    cube_7.position.set(-0.5818, 0.92, 0.9);
    cube_7.scale.set(0.4453, 0.29, 0.8); cube_7.rotation.z = -PI/2.947;
var cube_9 = new THREE.Mesh(geo, ColPlateMat);
    cube_9.position.set(-4.8361, 1.832, 0.9);
    cube_9.scale.set(0.4453, 0.23, 0.8); cube_9.rotation.z = -PI/10.105;
var cube_11 = new THREE.Mesh(geo, ColPlateMat);
    cube_11.position.set(-1.8361, 1.832, 0.9);
    cube_11.scale.set(0.4453, 0.23, 0.8);cube_11.rotation.z = -PI/10.105;
var cube_12 = new THREE.Mesh(geo, ColPlateMat);
    cube_12.position.set(-1.0135, 1.5959, 0.9);
    cube_12.scale.set(0.4453, 0.43, 0.8);cube_12.rotation.z = -PI/4.823;
var cube_13 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_13.position.set(-0.6364, 0.92, 0.9);
    cube_13.scale.set(0.4453, 0.29, 0.6);cube_13.rotation.z = -PI/2.947;
var cube_15 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_15.position.set(-5.709, 0.3331, 0.9);
    cube_15.scale.set(1.05, 3.47, 0.6);
var cube_16 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_16.position.set(-4.777, 0.92, 0.9);
    cube_16.scale.set(0.4453, 0.29, 0.6);cube_16.rotation.z = PI/2.947;
var cube_17 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_17.position.set(-4.3235, 1.5959, 0.9);
    cube_17.scale.set(0.4453, 0.43, 0.6);cube_17.rotation.z = PI/4.823;
var cube_18 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_18.position.set(-3.4432, 1.832, 0.9);
    cube_18.scale.set(0.4453, 0.23, 0.6);cube_18.rotation.z = PI/10.105;
var cube_19 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_19.position.set(-2.6974, 1.8583, 0.9);
    cube_19.scale.set(0.4453, 0.15, 0.6);
var cube_20 = new THREE.Mesh(geo, ColPlateMat);
    cube_20.position.set(-0.5818, 0.92, 0.9);
    cube_20.scale.set(0.4453, 0.29, 0.6);cube_20.rotation.z = -PI/2.947;
var cube_21 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_21.position.set(-1.068, 1.5959, 0.9);
    cube_21.scale.set(0.4453, 0.43, 0.6);cube_21.rotation.z = -PI/4.823;
var cube_22 = new THREE.Mesh(geo, Floor_ColumnsMat);
    cube_22.position.set(-1.9447, 1.832, 0.9);
    cube_22.scale.set(0.4453, 0.23, 0.6);cube_22.rotation.z = -PI/10.09;
var arka = new THREE.Group(); arka.add(arc_vert,cube_2,cube_4,cube_5,cube_6,cube_7,cube_9,cube_11,cube_12,cube_13,cube_15,cube_16,cube_17,cube_18,cube_19,cube_20,cube_21,cube_22);
    arka.position.set(-25,4,0);
var out = new THREE.Group(); out.add(col_single,arka);
return out;
}
var columns = new THREE.Group();
for(var i = 0; i<12; i++) {
    var column = DrawColumn();
    column.position.x = 6*i;
    columns.add(column);
}   columns.position.z = 7;
//нижняя панель часов из меди
var cube_042 = new THREE.Mesh(geo, BrassMat);
    cube_042.position.set(53.6094, 6.0196, 0);
    cube_042.scale.set(1.2, 0.1788, 7.0248);
//боковые вертикальные медные полоски
var cube_043 = new THREE.Mesh(geo, BrassMat);
    cube_043.position.set(53.6094, 7.359, -5.01);
    cube_043.scale.set(1.2, 1.1606, 0.0529);
//боковые вертикальные медные полоски ближе к часам
var cube_044 = new THREE.Mesh(geo, BrassMat);
    cube_044.position.set(53.6094, 7.9044, -2.5808);
    cube_044.scale.set(1.2,1.7061, 0.0529);
//средняя медная палочка горизонтальная
var cube_046 = new THREE.Mesh(geo, BrassMat);
    cube_046.position.set(53.6429, 8.2123, 0);
    cube_046.scale.set(1.2, 0.0405, 5.5555);
//синяя панель
var cube_047 = new THREE.Mesh(geo, BlueMat);
cube_047.position.set(52.4948, 8.1131, 0);
cube_047.scale.set(-0.0232, 1.9147, 4.9622);
function DrawClock() {
//основание циферблата
var geo = new THREE.CylinderGeometry(1,1,2,20);
var cylinder_008 = new THREE.Mesh(geo, BrassMat);
cylinder_008.position.set(0.4284,8,0);
cylinder_008.scale.set(1, 0.0534, 1);
cylinder_008.rotation.z = -PI/2;
//циферблат
var cylinder_009 = new THREE.Mesh(geo, WhiteDotsMat);
cylinder_009.position.set(0.3781,8,0);
cylinder_009.scale.set(0.0534 ,0.9637, 0.9637);
//крепление стрелок
var cylinder_010 = new THREE.Mesh(geo, ColonaMat);
cylinder_010.position.set(0.32,8,0);
cylinder_010.scale.set(0.075,0.0188,0.075);
cylinder_010.rotation.z = -PI/2;
//минутная стрелка
var geo = new THREE.BoxGeometry(2, 2, 2);
var cube_048 = new THREE.Mesh(geo, ColonaMat);
cube_048.position.set(0.3406, 8.4, 0);
cube_048.scale.set(0.0334, 0.3772, 0.0334);
//часовая стрелка
var cube_049 = new THREE.Mesh(geo, ColonaMat);
cube_049.position.set(0.34, 8.19, 0.2);
cube_049.scale.set(0.0334, 0.305, 0.0334);
cube_049.rotation.x = PI/4;
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
cube_053.position.y = 8.55;cube_053.rotation.x = PI/4;

var out = new THREE.Group(); out.add(cylinder_008,cylinder_009, cylinder_010, cube_048, cube_049,cube_050,cube_053,cube_052,cube_051);
return out;
}var clock = DrawClock();clock.position.set(52,0,0);

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
//Карта метро
var map = new THREE.Mesh(geo, MapMat);
map.scale.set(0.04, 0.67, 0.47);
var map_fr = new THREE.Group();
for (var i = 0; i < 5; i++) {
var tempCub = map.clone();tempCub.position.x = 12*i;
    map_fr.add(tempCub);
}   map_fr.position.set(-23.65, 3, 0);
var map_b = map_fr.clone();map_b.position.x = -25.75;
var maps = new THREE.Group(); maps.position.z = 7.9;
    maps.add(map_fr,map_b);
//Рельсы
var rail_bot = new THREE.Mesh(geo, BrownMat);rail_bot.receiveShadow=true;
    rail_bot.position.set(0,-2,18);rail_bot.scale.set(200,0.1,4);
var rail_r = new THREE.Mesh(geo, MetalMat);
    rail_r.position.set(0, -1.5, 16.3);rail_r.scale.set(200,0.4,0.15);
var rail_l = rail_r.clone(); rail_l.position.z = 21;
//hall walls
var geo = new THREE.BoxGeometry(2,2,2);
var wall_hall = new THREE.Mesh(geo, ColPlateMat);
    wall_hall.position.set(43, 4, 7.9); wall_hall.scale.set(7, 3.5, 1);
    wall_hall.receiveShadow = true; wall_hall.castShadow = true;
//длинные стены у эскалаторов
var wall_exc = new THREE.Mesh(geo, ColPlateMat);
    wall_exc.scale.set(70, 7, 2.5);
    wall_exc.position.set(130, 3, 12.5);
//стена между рельсами и платформой
var wall_platform = new THREE.Mesh(geo, Floor_CentralMat);
    wall_platform.position.set(0, -0.7, 14.5);
    wall_platform.scale.set(50, 1.1, 0.2);
//стена на которой часы висят
var wall_clock = new THREE.Mesh(geo, ColPlateMat);
    wall_clock.position.set(67.5, 8, 0);
    wall_clock.scale.set(15, 2, 7);
//Стена у Петра
var petr_backwall = new THREE.Mesh(geo, ColPlateMat);
    petr_backwall.position.x = -40; petr_backwall.scale.set(9,10,8);
    petr_backwall.receiveShadow = true; petr_backwall.castShadow = true;
var petr_longwall = new THREE.Mesh(geo, ColPlateMat);
    petr_longwall.position.set(-120,5,0);petr_longwall.scale.set(80, 7, 15);
    petr_longwall.receiveShadow = true; petr_longwall.castShadow = true;
//стена переграждающая путь к эскалаторам
var wall_long_exc = new THREE.Mesh(geo, ColPlateMat);
    wall_long_exc.position.set(80,3.775,0); wall_long_exc.scale.set(0.35,3.5,10);
    wall_long_exc.receiveShadow = true;wall_long_exc.castShadow = true;
//боковая стена метро
var tunnel_wall = new THREE.Mesh(geo, wall_tunnel_mat);tunnel_wall.position.z = 22;
    tunnel_wall.scale.set(200,6,0.2);tunnel_wall.receiveShadow = true;
//Полоса с надписью на стене
var tunnel_wall_mid = new THREE.Mesh(geo, wall_sign_mat);
    tunnel_wall_mid.scale.set(200,0.3,0.23);tunnel_wall_mid.position.y = 3.5;
    tunnel_wall_mid.position.z = 22;tunnel_wall_mid.receiveShadow = true;
//нижняя часть рельсовой стены
var tunnel_wall_d = new THREE.Mesh(geo, ColonaMat);
    tunnel_wall_d.scale.set(200,1,0.23); tunnel_wall_d.position.y = -1;
    tunnel_wall_d.position.z = 22;tunnel_wall_d.receiveShadow = true;
//пол под колоннами
var floor_columns = new THREE.Mesh(geo, colonna_floor_mat);
    floor_columns.position.set(5,0.55,8.6);floor_columns.receiveShadow = true;
    floor_columns.scale.set(45,0.35,2.5);
//платформа у поезда
var floor_trainsside = new THREE.Mesh(geo,floor_trainsside_mat);
    floor_trainsside.position.set(5,0.56,13); floor_trainsside.scale.set(45,0.3,2);
    floor_trainsside.receiveShadow = true;
function razmetka(n){
var razmetka = new THREE.Group();
var geom = new THREE.PlaneGeometry(0.8,0.3);
var stripes_L = new THREE.Group();
for (var i = 0; i < n+1; i++) {
var stripe = new THREE.Mesh(geom, YellowMat);stripe.receiveShadow=true;
    stripe.position.x = 1.2135*i; stripes_L.add(stripe);
}   stripes_L.position.x = -41;
var geom = new THREE.CircleGeometry(0.13, 8)
var dots_L = new THREE.Group();
for (var i = 0; i < n; i++) {
var stripeDots = new THREE.Mesh(geom, WhiteDotsMat);stripeDots.receiveShadow=true;
    stripeDots.position.x = 1.2134*i; dots_L.add(stripeDots);
}   dots_L.position.x = -40.4;
    razmetka.position.y = 0.87; razmetka.rotation.x = -PI/2;
    razmetka.add(stripes_L,dots_L); 
return razmetka;
} var razmetka_L = razmetka(75); razmetka_L.position.z =  14.5;
//Ограда для роботов
var geo = new THREE.BoxGeometry(2,2,2);
var liniaRobot_exc = new THREE.Mesh(geo, YellowMat);liniaRobot_exc.receiveShadow=true;
    liniaRobot_exc.position.set(70,0.9,0);
    liniaRobot_exc.scale.set(0.15,0.02,5.15);
var liniaRobot_petr = liniaRobot_exc.clone();liniaRobot_petr.receiveShadow=true;
    liniaRobot_petr.position.x = -30;
var liniaRobot_side = new THREE.Mesh(geo, YellowMat);liniaRobot_side.receiveShadow=true;
    liniaRobot_side.position.set(20, 0.9, 5);
    liniaRobot_side.scale.set(50,0.02,0.15);
//Поддержка крыши
var roof_sup_up = new THREE.Mesh(geo, WhiteDotsMat);roof_sup_up.scale.set(45,0.2,0.72);
var roof_sup_mid = roof_sup_up.clone(); var roof_sup_bot = roof_sup_up.clone();
    roof_sup_up.position.set(5,7,0.84);   roof_sup_bot.position.set(5,6,0);
    roof_sup_mid.position.set(5,6.5,0.87);roof_sup_mid.rotation.x = -PI/4;
var roof_sup = new THREE.Group();
    roof_sup.add(roof_sup_up,roof_sup_mid,roof_sup_bot);
    roof_sup.position.z = 9;
var roof_sup_mir = roof_sup.clone(); roof_sup_mir.scale.z = -1;roof_sup_mir.position.z = 6.85;
//Крыша
var geo = new THREE.CylinderGeometry(2,2,2,32,1,true,0,PI);geo.scale(-1, 1, 1);
var roof = new THREE.Mesh(geo, roof_mat); roof.scale.set(2,45,2.7);   
    roof.position.set(5,6.8,0); roof.rotation.z = -PI/2;
var geo = new THREE.CylinderGeometry(2,2,2,32,1,true,0,PI/1.1);geo.scale(-1, 1, 1);
var roof_side = new THREE.Mesh(geo, roof_mat_side);
    roof_side.position.set(0,5,16);roof_side.rotation.z =-PI/2;roof_side.scale.set(3,200,3);
    roof_side.receiveShadow = true; roof_side.castShadow = true;
leftSide.add(columns,cube_043,cube_044,maps,rail_r,rail_l,rail_bot,wall_hall,wall_exc,wall_platform,wall_long_exc,tunnel_wall,tunnel_wall_mid,tunnel_wall_d,floor_columns,floor_trainsside,razmetka_L,liniaRobot_side,roof_side,roof_sup,roof_sup_mir);
var rightSide = leftSide.clone(); rightSide.scale.z = -1;
out.add(leftSide,rightSide,image_base,roof,clock,image_petr, wall_clock, cube_042, cube_046, cube_047, cube_054, cube_055, cube_056, cube_057, cube_058, cube_059, cube_060, cube_061, cube_062, cube_063, cube_064, cube_065, liniaRobot_side, liniaRobot_exc, liniaRobot_petr, petr_backwall, petr_longwall);
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
 if (!times) return;
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
 clock = 0; times = _startTimes;
};
return [animate, reset];
}
function iniDoorsAnimation() {
return animatorByName([
 {
     type: 'position',
     vector: new THREE.Vector3(1,0,0),
     objectName: 'leftDoor',
     startTime: 0,
     time: 400,
 },
 {
     type: 'position',
     vector: new THREE.Vector3(-1,0,0),
     objectName: 'rightDoor',
     startTime: 0,
     time: 400,
 },
 {
     type: 'position',
     vector: new THREE.Vector3(0,0,0),
     objectName: 'leftDoor',
     startTime: 1200,
     time: 400,
 },
 {
     type: 'position',
     vector: new THREE.Vector3(0,0,0),
     objectName: 'rightDoor',
     startTime: 1200,
     time: 400,
 },
], 2400, 1);
}

function makeTexturedMaterial(urls, repeatX = 1, repeatY = 1, type = "standard", rotation = 0, offsetX = 0, offsetY = 0) {
    const loader = new THREE.TextureLoader();
  
    // Карты, поддерживаемые обоими материалами
    const mapTypes = {
      map: urls.diffuse,
      roughnessMap: urls.roughness,
      normalMap: urls.normal,
      metalnessMap: urls.metalness
    };
  
    const textures = {};
  
    for (const [key, url] of Object.entries(mapTypes)) {
      if (!url) continue;
  
      // Загружаем текстуру
      const tex = loader.load(url);
  
      // Обязательно задаём повторение, иначе offset работать не будет
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
  
      // Задаём центр поворота (это влияет на rotation)
      tex.center.set(0.5, 0.5);
      tex.rotation = rotation;
  
      // Устанавливаем offset.
      // Если offset не срабатывал, можно попробовать задать значения в диапазоне от 0 до 1,
      // либо явно обновить текстуру, вызвав tex.needsUpdate = true;
      tex.offset.set(offsetX, offsetY);
      tex.needsUpdate = true;
  
      textures[key] = tex;
    }
  
    // Выбираем тип материала
    if (type === "physical") {
      return new THREE.MeshPhysicalMaterial({
        ...textures,
        clearcoat: 1,
        clearcoatRoughness: 1,
        transmission: 0,
        thickness: 1
      });
    } else {
      return new THREE.MeshStandardMaterial(textures);
    }
}
function SetColorStuff(){
textureLoader = new THREE.TextureLoader();
var cubeTextureLoader = new THREE.CubeTextureLoader();
environmentMap = cubeTextureLoader.load([
    'https://i.postimg.cc/HxGhdYq3/posx.jpg', // Positive X
    'https://i.postimg.cc/CxQ2rHJ3/negx.jpg', // Negative X
    'https://i.postimg.cc/1Xs7VW5q/posy.jpg', // Positive Y
    'https://i.postimg.cc/VN0VxrVd/negy.jpg', // Negative Y
    'https://i.postimg.cc/HnzZwQVP/posz.jpg', // Positive Z
    'https://i.postimg.cc/pTD1TNxv/negz.jpg'  // Negative Z
]);

var load = textureLoader.load('http://livelab.spb.ru/labs/files/metromap2023r.jpg');
MapMat = new THREE.MeshStandardMaterial({map:load,roughness:0.8,metalness:0.05});

//Текстура плитки для пола
var floor_trainsside_tex = {
    diffuse:'https://i.postimg.cc/rDyvDGty/patio-tiles-diff-1k.jpg',
    roughness: 'https://i.postimg.cc/XpWMb6jC/patio-tiles-rough-1k.jpg',
    normal: 'https://i.postimg.cc/C19SQtqj/patio-tiles-nor-gl-1k.jpg',
    metalness: 'https://i.postimg.cc/3JsYBPT7/patio-tiles-arm-1k.jpg'
};  floor_trainsside_mat = makeTexturedMaterial(floor_trainsside_tex,30,1,"physical");
    floor_mat = makeTexturedMaterial(floor_trainsside_tex,30,3,"physical");
//Текстура изображения петра
var petr_tex = {
    diffuse:'https://i.postimg.cc/FYBdqZy7/petr-diff.png',
    roughness: 'https://i.postimg.cc/sBGQRhmK/petr-rough.png'
};  petr_mat = makeTexturedMaterial(petr_tex,1,1,"standard");
petr_mat.metalness = 0.1;
petr_mat.roughness = 0.8;
//Текстура пола под колоннами
var colonna_floor_tex = {
    diffuse:'https://i.postimg.cc/z33gwv9J/rubber-tiles-diff-1k.jpg',
    roughness: 'https://i.postimg.cc/TYkjyMZd/rubber-tiles-rough-1k.jpg',
    normal: 'https://i.postimg.cc/tCRtCCvv/rubber-tiles-nor-gl-1k.jpg',
    metalness: 'https://i.postimg.cc/n9s9nSvs/rubber-tiles-arm-1k.jpg'
};  colonna_floor_mat = makeTexturedMaterial(colonna_floor_tex,1.5,45,"physical",PI/2);
//Текстура стены тоннеля
var wall_tunnel_tex = {
    diffuse:'https://i.postimg.cc/L5QTFcS8/granite-tile-diff-1k.jpg',
    roughness: 'https://i.postimg.cc/Kv4fD87k/granite-tile-rough-1k.jpg',
    normal: 'https://i.postimg.cc/MZ9tBQBJ/granite-tile-nor-gl-1k.jpg',
    metalness: 'https://i.postimg.cc/3NxB6KPq/granite-tile-arm-1k.jpg'
};  wall_tunnel_mat = makeTexturedMaterial(wall_tunnel_tex,120,3,"standard");
//Текстура таблички на стене тоннеля
var wall_sign_tex = {
    diffuse:'https://i.postimg.cc/8zp6mKgy/Plastic-Color.png',
    roughness: 'https://i.postimg.cc/bwm2Cxzq/Plastic-Roughness.png',
    normal: 'https://i.postimg.cc/jjCnGD5P/Plastic-Normal.png'
};  wall_sign_mat = makeTexturedMaterial(wall_sign_tex,200,1,"standard");
var sidenia_tex = {
    diffuse:'https://i.postimg.cc/rpCyZcGx/leather-col.jpg',
    roughness: 'https://i.postimg.cc/PqkrMNDd/leather-rough.jpg',
    normal: 'https://i.postimg.cc/TwddZSQS/leather-gl.jpg',
    metalness: 'https://i.postimg.cc/L6wsnx6Y/leather-arm.jpg'
};  sidenia_mat = makeTexturedMaterial(sidenia_tex,3,2,"standard");
var colonna_tex = {
    diffuse:'https://i.postimg.cc/zX745b1p/column-diff.jpg',
    roughness: 'https://i.postimg.cc/gcvfStSC/column-rough.jpg',
    normal: 'https://i.postimg.cc/kg5z5JJC/column-nor.jpg',
    metalness: 'https://i.postimg.cc/02PhLGhb/column-arm.jpg'
};  colonna_mat = makeTexturedMaterial(colonna_tex,2,1.2,"standard",PI/2);
var roof_tex = {
    diffuse:'https://i.postimg.cc/GtRb2qx6/roof-dif.png',
    normal: 'https://i.postimg.cc/Y2NpVBp7/roof-norm.png',
};  roof_mat  = makeTexturedMaterial(roof_tex,0.1,2.5,"physical",0,0.15,0);
roof_mat_side = makeTexturedMaterial(roof_tex,1,10,"physical");

HumanMat  = new THREE.MeshStandardMaterial({color: 0xFFDEAD, roughness: 0.9, metalness: 0});
GlassMat = new THREE.MeshStandardMaterial({color: 0x393D53, transparent: true, opacity: 0.32, roughness: 0.5});
Ceiling_trainMat = new THREE.MeshStandardMaterial({color: 0x604C18, roughness: 0.12}); 
PurpleMat = new THREE.MeshStandardMaterial({color: 0x6600CC, roughness: 0.5});
ColonaMat = new THREE.MeshStandardMaterial({color: 0x333333, roughness: 0.8});
BrassMat = new THREE.MeshStandardMaterial({color: 0xCCCC00, roughness: 0.1, metalness: 0.9});
RoofTilesMat = new THREE.MeshStandardMaterial({color: 0xEEEEEE, metalness: 1, emissive: 0xEEEEEE});
ColPlateMat = new THREE.MeshStandardMaterial({color: 0x664D33, roughness: 0.5});
Floor_ColumnsMat = new THREE.MeshStandardMaterial({color: 0x332619, roughness: 0.2, metalness: 0.1});
Floor_CentralMat = new THREE.MeshStandardMaterial({color: 0x80664D, roughness: 0.9, metalness: 0.1});
BlueMat = new THREE.MeshStandardMaterial({color: 0x1A4DCC, roughness: 0.5});
WhiteDotsMat = new THREE.MeshStandardMaterial({color: 0xEEEEEE});
MetalMat = new THREE.MeshStandardMaterial({color: 0xCCCCCC, metalness: 0.7, roughness:0.35,envMap:environmentMap,envMapIntensity: 0.4});
BrownMat = new THREE.MeshStandardMaterial({color: 0x99664D, roughness: 0.9, metalness: 0.8});
//нельзя менять
YellowMat = new THREE.MeshStandardMaterial({color: new THREE.Color(1,0.522,0)});
FloorTileMat = new THREE.MeshStandardMaterial({color: 0x80804D, roughness:0.5, metalness:0.1});
Washer_mainMatDS = new THREE.MeshStandardMaterial({color: 0x334D4D, side:THREE.DoubleSide, roughness:0.5});
WasherMat = new THREE.MeshStandardMaterial({color: 0x334D4D, roughness:0.5, metalness:0.6});
Floor_trainMat = new THREE.MeshStandardMaterial({color:0x664444, roughness:0.7, metalness:0.1});
}

function CreateScene(WC, HC) {
var _a;
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
 scene.background = new THREE.Color(0x333355);
 scene.environment = environmentMap;
 scene.fog = new THREE.FogExp2(0x9999aa, 0.005);
 cameras.main = new THREE.PerspectiveCamera(70,WC/HC,0.1,1000);
 renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.toneMapping = THREE.Uncharted2ToneMapping; //Тонмаппинг
 renderer.toneMappingExposure = 0.75; // Экспозиция (регулирует яркость)
 renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.BasicShadowMap; //Тени
 renderer.setPixelRatio(window.devicePixelRatio);
 (_a = document.getElementById('wCanvas')) === null || _a === void 0 ? void 0 : _a.appendChild(renderer.domElement);
 renderer.setSize(WC, HC);

 controls = new THREE.OrbitControls(cameras.main, renderer.domElement);
 cameras.main.position.set(15,10,0);
 controls.update();
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

var ambiLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambiLight);
// var dirLight = new THREE.DirectionalLight(0xffffff, 1); dirLight.castShadow = true
//     scene.add(dirLight);

var roofLight_l = new THREE.RectAreaLight(0xffffff, 2.5, 90, 8);
roofLight_l.position.set(5, 7.21, 8);
roofLight_l.rotation.set(-PI/2, 0, 0);
var roofLight_r = new THREE.RectAreaLight(0xffffff, 2.5, 90, 8);
roofLight_r.position.set(roofLight_l.position.x, roofLight_l.position.y, -roofLight_l.position.z);
roofLight_r.rotation.set(-PI/2, 0, 0);

scene.add(roofLight_l,roofLight_r);
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
<script> //Инициализируем микро-шейдер чтобы свет излучаемый RectAreaLight отражался и рассеивался по помещению
  THREE.RectAreaLightUniformsShader = {
    init: function () {
      THREE.ShaderChunk[ 'lights_rect_area_pars_fragment' ] = `
        struct RectAreaLight {
          vec3 color;
          vec3 position;
          vec3 halfWidth;
          vec3 halfHeight;
        };
        uniform RectAreaLight rectAreaLights[ RECTAREALIGHTS_MAX ];
        void RE_Direct_RectArea( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in Material material, inout ReflectedLight reflectedLight ) {}
      `;
    }
  };
  THREE.RectAreaLightUniformsShader.init();
</script>
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