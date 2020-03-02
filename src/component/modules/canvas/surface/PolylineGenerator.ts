import PointGenerator from './PointGenerator';

export interface IPoint {
  x: number;
  y: number;
  z: number;
  offset: number;
  originX: number;
  originY: number;
  canvasX: number;
  canvasY: number;
}
export interface IPolylineGenerator {
  pointList: IPoint[];
  computePointList(): void;
  updatePointList(lineOffset: number, rotationAngleSpeed: number, visual: { x: number; y: number; z: number }): void;
}
export default class PolylineGenerator implements IPolylineGenerator {
  private a: number;
  private b: number;
  private c: number;
  private d: number;
  private z: number;
  private start: number;
  private end: number;
  private gap: number;
  public pointList: IPoint[];
  constructor(a: number, b: number, c: number, d: number, z: number, start: number, end: number, gap: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.z = z;
    this.start = start;
    this.end = end;
    this.gap = gap;
    this.pointList = [];
    this.computePointList();
  }
  computePointList() {
    for (let i = this.start; i <= this.end; i += this.gap) {
      const x = i;
      const y = this.a * Math.sin(((this.b * x + this.c) / 180) * Math.PI) + this.d;
      this.pointList.push({
        x,
        y,
        z: this.z,
        offset: i,
        originX: x,
        originY: 0,
        canvasX: 0,
        canvasY: 0
      });
    }
  }

  updatePointList(lineOffset: number, rotationAngleSpeed: number, visual: { x: number; y: number; z: number }) {
    this.pointList.forEach(item => {
      const x = item.x;
      const y = item.y;
      const z = item.z;
      item.offset = lineOffset;
      item.x = x * Math.cos((rotationAngleSpeed / 180) * Math.PI) - z * Math.sin((rotationAngleSpeed / 180) * Math.PI);
      item.y = this.a * Math.sin(((this.b * item.originX + this.c + item.offset) / 180) * Math.PI) + this.d;
      item.z = z * Math.cos((rotationAngleSpeed / 180) * Math.PI) + x * Math.sin((rotationAngleSpeed / 180) * Math.PI);
      item.canvasX = ((item.x - visual.x) * visual.z) / (visual.z - z);
      item.canvasY = ((item.y - visual.y) * visual.z) / (visual.z - z);
    });
  }
}
