import { RotateDirection } from './RotateDirection';

export interface IRotateState {
    x: RotateDirection;
    y: RotateDirection;
    z: RotateDirection;
    rotateSpeed: number;
    thinningRatio: number;
}
