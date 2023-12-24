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

// balon setup end

// balon ignore begin
let WC, HC;
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
// @ts-expect-error Type defined in setupcontrols function
let controls: PointerLockControls;
let raycaster: THREE.Raycaster;
let raycasterRight: THREE.Raycaster;
let raycasterLeft: THREE.Raycaster;
let raycasterForward: THREE.Raycaster;
let raycasterBackward: THREE.Raycaster;
let raycasterRB: THREE.Raycaster;
let raycasterRF: THREE.Raycaster;
let raycasterLB: THREE.Raycaster;
let raycasterLF: THREE.Raycaster;
let collisions: THREE.Object3D[];
let objectFit: number;

let station: THREE.Object3D;
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

      station = CreateStation();
      station.position.set(X, Y, Z);
      station.scale.set(W, W, W);
      // station.rotation.set(PI, 0, 0);
      scene.add(station);
      collisions.push(station);

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
    raycasterRight.ray.origin.copy(controls.getObject().position);
    raycasterLeft.ray.origin.copy(controls.getObject().position);
    raycasterBackward.ray.origin.copy(controls.getObject().position);
    raycasterForward.ray.origin.copy(controls.getObject().position); // Перемещаем в центр персонажа
    raycasterRB.ray.origin.copy(controls.getObject().position);
    raycasterRF.ray.origin.copy(controls.getObject().position);
    raycasterLB.ray.origin.copy(controls.getObject().position);
    raycasterLF.ray.origin.copy(controls.getObject().position);

    const target = new THREE.Vector3();
    controls.getObject().getWorldDirection(target);
    console.log(target);

    // 2m tall
    // raycaster.ray.origin.y -= 1;

    const intersections = raycaster.intersectObjects(collisions, true);
    const isOnObject = intersections.length > 0;

    const intR = raycasterRight.intersectObjects(collisions, true).length > 0;
    const intL = raycasterLeft.intersectObjects(collisions, true).length > 0;
    const intF = raycasterForward.intersectObjects(collisions, true).length > 0;
    const intB =
      raycasterBackward.intersectObjects(collisions, true).length > 0;
    const intRB = raycasterRB.intersectObjects(collisions, true).length > 0;
    const intLB = raycasterLB.intersectObjects(collisions, true).length > 0;
    const intRF = raycasterRF.intersectObjects(collisions, true).length > 0;
    const intLF = raycasterLF.intersectObjects(collisions, true).length > 0;
    // console.log(intR, intL, intF, intB, isOnObject);

    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    0;

    if (!isFly) {
      velocity.y -= 9.8 * 10.0 * delta; // 50.0 = mass
    }

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    const speed = 200;
    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    if (!isFly && isOnObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    if ((intR || intRB || intRF) && velocity.x) {
      velocity.x = 0;
      controls.getObject().position.x -= objectFit / 50;
      if (intRF) controls.getObject().position.z -= objectFit / 50;
      if (intRB) controls.getObject().position.z += objectFit / 50;
      console.log('right');
    }
    if ((intL || intLB || intLF) && velocity.x) {
      velocity.x = 0;
      controls.getObject().position.x += objectFit / 50;
      if (intLF) controls.getObject().position.z -= objectFit / 50;
      if (intLB) controls.getObject().position.z += objectFit / 50;
      console.log('left');
    }
    if ((intF || intLF || intRF) && velocity.z) {
      velocity.z = 0;
      controls.getObject().position.z -= objectFit / 50;
      if (intRF) controls.getObject().position.x -= objectFit / 50;
      if (intLF) controls.getObject().position.x += objectFit / 50;
      console.log('forw');
    }
    if ((intB || intLB || intRB) && velocity.z) {
      velocity.z = 0;
      controls.getObject().position.z += objectFit / 50;
      if (intRB) controls.getObject().position.x -= objectFit / 50;
      if (intLB) controls.getObject().position.x += objectFit / 50;
      console.log('back');
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;

    if (!isFly) {
      if (controls.getObject().position.y < -0) {
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
  objectFit = 1.4;
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = true;
  isFly = false;
  prevTime = performance.now();
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    objectFit,
  );
  collisions = [];
  raycasterRight = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, 0),
    0,
    objectFit,
  );
  raycasterLeft = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(-1, 0, 0),
    0,
    objectFit,
  );
  raycasterForward = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, 0, 1),
    0,
    objectFit,
  );
  raycasterBackward = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, 0, -1),
    0,
    objectFit,
  );
  raycasterRF = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, 1),
    0,
    objectFit,
  );
  raycasterLF = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(-1, 0, 1),
    0,
    objectFit,
  );
  raycasterLB = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(-1, 0, -1),
    0,
    objectFit,
  );
  raycasterRB = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, -1),
    0,
    objectFit,
  );
}
//#endregion
//#region
function CreateStation() {
  //#endregion

  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.3019, 0.296, 0.3827),
  });
  const cube_001Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.5683, 0.9396, 0.4627),
  });
  const cube_003Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.6205, 0.0165, 0.8582),
  });
  const cube_002Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7857, 0.7349, 0.1579),
  });
  const cube_004Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.9336, 0.1442, 0.1084),
  });
  const cube_005Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.0278, 0.2383, 0.1813),
  });
  const cube_006Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.7438, 0.5944, 0.0673),
  });

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.scale.set(35.2342, 0.2499, 35.0041);

  const cube_001Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_001 = new THREE.Mesh(cube_001Geometry, cube_001Material);
  cube_001.scale.set(0.9468, -2.1224, -31.8471);
  cube_001.setRotation(0.0, 0.0, -0.0);
  const cube_001MX = cube_001.clone();
  cube_001.position.set(33.8894, 0, 0);
  cube_001MX.position.set(33.8894, 0, 0);
  cube_001MX.applyMatrix(cube_001MX.matrixWorld.makeScale(-1, 1, 1));
  const cube_001MirroredX = new THREE.Group();
  cube_001MirroredX.add(cube_001, cube_001MX);
  cube_001MirroredX.position.set(0, 0.0, -0.0);
  const cube_003Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_003 = new THREE.Mesh(cube_003Geometry, cube_003Material);
  cube_003.scale.set(-34.7083, 2.4146, 1.0);
  cube_003.setRotation(0.0, 0.0, -0.0);
  const cube_003MZ = cube_003.clone();
  cube_003.position.set(0, 0, -31.912);
  cube_003MZ.position.set(0, 0, -31.912);
  cube_003MZ.applyMatrix(cube_003MZ.matrixWorld.makeScale(1, 1, -1));
  const cube_003MirroredZ = new THREE.Group();
  cube_003MirroredZ.add(cube_003, cube_003MZ);
  cube_003MirroredZ.position.set(0.0, 0.0, 0);
  const cube_002Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_002 = new THREE.Mesh(cube_002Geometry, cube_002Material);
  cube_002.position.set(22.2292, 0.0, -18.9583);

  const cube_004Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_004 = new THREE.Mesh(cube_004Geometry, cube_004Material);
  cube_004.position.set(22.9624, 0.0, -12.5748);
  cube_004.scale.set(1.0, -2.531, 1.0);

  const cube_005Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_005 = new THREE.Mesh(cube_005Geometry, cube_005Material);
  cube_005.position.set(22.9624, 0.0, -5.8073);
  cube_005.scale.set(1.0, -5.8299, 1.0);

  const cube_006Geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube_006 = new THREE.Mesh(cube_006Geometry, cube_006Material);
  cube_006.position.set(22.9624, 0.0, 1.5859);
  cube_006.scale.set(1.0, -9.5095, 1.0);

  const out = new THREE.Group();
  out.add(
    cube,
    cube_001MirroredX,
    cube_003MirroredZ,
    cube_002,
    cube_004,
    cube_005,
    cube_006,
  );

  //#region
  // const help = new THREE.AxesHelper(10);
  // out.add(help);
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
    camera = new THREE.PerspectiveCamera(70, WC / HC, 0.001, 1000);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // привяжем отрисовку к html и высоте канвы
    // renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('wCanvas')?.appendChild(renderer.domElement);
    renderer.setSize(WC, HC);
    setupcontrols(scene);
    // установим модуль управления камерой
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;

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
  controls.getObject().position.set(-0.572, 2.7, -0.0787);
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
          if (canJump === true) velocity.y += 20;
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
//#endregion

