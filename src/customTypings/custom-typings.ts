import 'three';

declare module 'three' {
  interface Object3D {
    setRotation(x_rot: number, y_rot: number, z_rot: number): void;
  }
}
