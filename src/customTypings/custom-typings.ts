/* eslint-disable @typescript-eslint/no-explicit-any */
import { Matrix4 } from 'three';

declare module 'three' {
  interface Object3D {
    setRotation(x_rot: number, y_rot: number, z_rot: number): void;
    getObjsByProperty(
      name: string, // Fix: Use 'string' instead of 'any'
      value: any,
      result?: Array<unknown>, // Fix: Specify the correct type for the 'result' parameter
    ): unknown;
    applyMatrix(a: Matrix4): void;
  }
}
