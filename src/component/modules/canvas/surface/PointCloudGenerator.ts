import PointGenerator from './PointGenerator';

export interface IPoint {
  x: number;
  y: number;
  z: number;
  canvasX: number;
  canvasY: number;
}
export interface IPointCloudGenerator {
  pointList: IPoint[];
  computePointList(): void;
  updatePointList(lineOffset: number, rotationAngleSpeed: number, visual: { x: number; y: number; z: number }): void;
}
export default class PointCloudGenerator implements IPointCloudGenerator {
  public pointList: IPoint[];
  constructor() {
    this.pointList = [];
    this.computePointList();
  }
  computePointList() {
    const points = PointGenerator();
    for (let index = points.length - 1; index > 0; index--) {
      if (index % 5 == 0) {
        this.pointList.push({
          x: points[index][0] * 3000,
          y: (-points[index][1] + 0.1) * 3000,
          z: points[index][2] * 3000,
          canvasX: 0,
          canvasY: 0
        });
      }
    }
  }
  updatePointList(lineOffset: number, rotationAngleSpeed: number, visual: { x: number; y: number; z: number }) {
    this.pointList.forEach(item => {
      const x = item.x;
      const y = item.y;
      const z = item.z;
      item.y = y;
      item.x = x * Math.cos((rotationAngleSpeed / 180) * Math.PI) - z * Math.sin((rotationAngleSpeed / 180) * Math.PI);
      item.z = z * Math.cos((rotationAngleSpeed / 180) * Math.PI) + x * Math.sin((rotationAngleSpeed / 180) * Math.PI);
      item.canvasX = ((item.x - visual.x) * visual.z) / (visual.z - z);
      item.canvasY = ((item.y - visual.y) * visual.z) / (visual.z - z);
    });
  }
}
