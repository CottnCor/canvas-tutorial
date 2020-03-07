export enum RotateDirection {
    Anticlockwise = -1,
    Static = 0,
    Clockwise = 1
}

export interface RotateState {
    x: RotateDirection;
    y: RotateDirection;
    z: RotateDirection;
    rotateSpeed: number;
    thinningRatio: number;
}
