//animator version 1
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
 * @param times - количество повторений
 *
 * @returns функция анимации
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
  return function () {
    if (clock === endtime) {
      times--;
      clock = 0;
    }
    if (!times) return;
    clock++;
    for (const it of animations) {
      if (it.startTime > clock || it.startTime + it.time <= clock) continue;
      if (it.type === 'position') {
        it.object.position.lerpVectors(
          it.object.position,
          it.vector,
          1 / (it.time - (clock - it.startTime)),
        );
      }
      if (it.type === 'rotation') {
        it.object.rotation.setFromVector3(
          new THREE.Vector3().lerpVectors(
            new THREE.Vector3().setFromEuler(it.object.rotation),
            it.vector,
            1 / (it.time - (clock - it.startTime)),
          ),
        );
      }
      if (it.type === 'scale') {
        it.object.scale.lerpVectors(
          it.object.scale,
          it.vector,
          1 / (it.time - (clock - it.startTime)),
        );
      }
    }
  };
}
