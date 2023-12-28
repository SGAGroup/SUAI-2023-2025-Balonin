//animator version 2
/**
 * Конструктор анимаций
 * @param animations - массив анимаций
 * @param type 'position' | 'rotation' | 'scale' - подвид анимации
 * @param vector THREE.Vector3 - целевой вектор, получаемый в конце анимации
 * @param object THREE.Object3D || string - объект на который применяются анимации или имя обьектов
 * @param startTime number - тик начала анимации
 * @param time number - длительность анимации
 *
 * @param endtime - тик прерывания анимаций
 * @param times - количество повторений для бесконечности -1
 *
 * @returns [функция анимации, функция сброса анимации]
 */
function animator(
  animations: {
    type: string;
    vector: THREE.Vector3;
    object: THREE.Object3D;
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
      if (it.type === 'position') {
        it.object.position.lerp(it.vector, (clock - it.startTime) / it.time);
      }
      if (it.type === 'rotation') {
        it.object.rotation.setFromVector3(
          new THREE.Vector3()
            .setFromEuler(it.object.rotation)
            .lerp(it.vector, (clock - it.startTime) / it.time),
        );
      }
      if (it.type === 'scale') {
        it.object.scale.lerp(it.vector, (clock - it.startTime) / it.time);
      }
    }
  };
  const reset = function () {
    clock = 0;
    times = _startTimes;
  };
  return [animate, reset];
}

//animator version 3
/**
 * Конструктор анимаций
 * @param animations - массив анимаций
 * @param type 'position' | 'rotation' | 'scale' - подвид анимации
 * @param vector THREE.Vector3 - целевой вектор, получаемый в конце анимации
 * @param object THREE.Object3D || string - объект на который применяются анимации или имя обьектов
 * @param startTime number - тик начала анимации
 * @param time number - длительность анимации
 *
 * @param endtime - тик прерывания анимаций
 * @param times - количество повторений для бесконечности -1
 *
 * @returns [функция анимации, функция сброса анимации]
 */
function animator(
  animations: {
    type: string;
    vector: THREE.Vector3;
    object: THREE.Object3D;
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
      if (it.type === 'position') {
        it.object.position.lerp(
          it.vector,
          1 / (it.time - (clock - it.startTime)),
        );
      }
      if (it.type === 'rotation') {
        it.object.rotation.setFromVector3(
          new THREE.Vector3()
            .setFromEuler(it.object.rotation)
            .lerp(it.vector, 1 / (it.time - (clock - it.startTime))),
        );
      }
      if (it.type === 'scale') {
        it.object.scale.lerp(it.vector, 1 / (it.time - (clock - it.startTime)));
      }
    }
  };
  const reset = function () {
    clock = 0;
    times = _startTimes;
  };
  return [animate, reset];
}

//Пример задания работы
//animator(
//   [
//     {
//       type: 'position',
//       vector: new THREE.Vector3(1, 0, 0),
//       object: leftDoor,
//       startTime: 0,
//       time: 100,
//     },
//     {
//       type: 'position',
//       vector: new THREE.Vector3(-1, 0, 0),
//       object: rightDoor,
//       startTime: 0,
//       time: 100,
//     },
//     {
//       type: 'position',
//       vector: new THREE.Vector3(0, 0, 0),
//       object: leftDoor,
//       startTime: 200,
//       time: 100,
//     },
//     {
//       type: 'position',
//       vector: new THREE.Vector3(0, 0, 0),
//       object: rightDoor,
//       startTime: 200,
//       time: 100,
//     },
//   ],
//   300,
//   1,
// );