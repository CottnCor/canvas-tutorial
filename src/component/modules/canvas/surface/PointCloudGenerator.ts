import PointGenerator from './PointGenerator';

export interface IPoint {
    x: number;
    y: number;
    z: number;
    canvasX: number;
    canvasY: number;
}
export interface IPointCloudGenerator {
    points: IPoint[];
    computePoints(): void;
    updatePoints(thinningRatio: number): void;
    updatePointProjection(rotateSpeed: number, camera: { x: number; y: number; z: number }): void;
}
export default class PointCloudGenerator implements IPointCloudGenerator {
    public points: IPoint[];
    private originPoints: IPoint[];
    private thinningRatio: number;
    constructor(thinningRatio: number) {
        this.points = [];
        this.originPoints = [];
        // this.thinningRatio = thinningRatio;
        this.thinningRatio = 720;
        this.computePoints();
    }
    computePoints() {
        const points = PointGenerator();
        for (let index = points.length - 1; index > 0; index--) {
            const point = {
                x: points[index][0] * 200,
                y: (points[index][1] - 0.1) * 200,
                z: points[index][2] * 200,
                canvasX: 0,
                canvasY: 0
            };
            this.originPoints.push(point);
            if (index % this.thinningRatio === 0) {
                this.points.push(point);
            }
        }
    }
    updatePoints(thinningRatio: number) {
        if (thinningRatio !== this.thinningRatio) {
            this.points = [];
            this.thinningRatio = thinningRatio;
            this.points = this.originPoints.filter(
                (item, index) => index % this.thinningRatio === 0
            );
        }
    }
    updatePointProjection(rotateSpeed: number, camera: { x: number; y: number; z: number }) {
        this.points.forEach((item, index) => {
            const x = item.x;
            const y = item.y;
            const z = item.z;
            item.y = y;
            item.x =
                x * Math.cos((rotateSpeed / 180) * Math.PI) -
                z * Math.sin((rotateSpeed / 180) * Math.PI);
            item.z =
                z * Math.cos((rotateSpeed / 180) * Math.PI) +
                x * Math.sin((rotateSpeed / 180) * Math.PI);
            item.canvasX = ((item.x - camera.x) * camera.z) / (camera.z - z);
            item.canvasY = ((item.y - camera.y) * camera.z) / (camera.z - z);
        });
    }
}
