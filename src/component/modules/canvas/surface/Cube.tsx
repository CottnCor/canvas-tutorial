import React from 'react';
import { RotateDirection, RotateState } from '../interface-common.d';

const defaultProps = {
  rotateState: { x: 0, y: 0, z: 0, rotateSpeed: 2, thinningRatio: 16 },
  size: { width: 600, height: 600 }
};

type Props = {
  rotateState: RotateState;
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;

interface State {
  rotateState: RotateState;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

interface PointMap {
  A: Point;
  B: Point;
  C: Point;
  D: Point;
  E: Point;
  F: Point;
  G: Point;
  H: Point;
}

const Cube = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  private animationHandle: number;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private cube: React.RefObject<HTMLCanvasElement>;
  private camera: { x: number; y: number; z: number };
  private pointMap: PointMap;
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.animationHandle = Number.NaN;
    this.cube = React.createRef();
    this.camera = {
      x: 0,
      y: 0,
      z: 300
    };
    this.pointMap = {
      A: { x: -50, y: 50, z: 50 },
      B: { x: -50, y: 50, z: -50 },
      C: { x: 50, y: 50, z: -50 },
      D: { x: 50, y: 50, z: 50 },
      E: { x: -50, y: -50, z: 50 },
      F: { x: -50, y: -50, z: -50 },
      G: { x: 50, y: -50, z: -50 },
      H: { x: 50, y: -50, z: 50 }
    };
  }
  componentDidMount() {
    this.ctx = this.cube.current?.getContext('2d');
    this.animationFrame();
  }
  componentWillUnmount() {
    if (!Number.isNaN(this.animationHandle)) {
      window.cancelAnimationFrame(this.animationHandle);
    }
  }
  transformCoordinatePoint(point: Point, offsetX = this.props.size.width / 2, offsetY = this.props.size.height / 2) {
    return {
      x: ((point.x - this.camera.x) * this.camera.z) / (this.camera.z - point.z) + offsetX,
      y: ((point.y - this.camera.y) * this.camera.z) / (this.camera.z - point.z) + offsetY
    };
  }
  draw() {
    let point = {} as { x: number; y: number };
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
      // 绘制矩形ABCD
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.A);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.B);
      this.ctx.lineTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.C);
      this.ctx.lineTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.D);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.closePath();
      this.ctx.stroke();
      // 绘制矩形EFGH
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.E);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.F);
      this.ctx.lineTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.G);
      this.ctx.lineTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.H);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.closePath();
      this.ctx.stroke();
      // 绘制直线AE
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.A);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.E);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.ctx.closePath();
      // 绘制直线BF
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.B);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.F);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.ctx.closePath();
      // 绘制直线CD
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.C);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.G);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.ctx.closePath();
      // 绘制直线DH
      this.ctx.beginPath();
      point = this.transformCoordinatePoint(this.pointMap.D);
      this.ctx.moveTo(point.x, point.y);
      point = this.transformCoordinatePoint(this.pointMap.H);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  animationFrame() {
    this.animationHandle = window.requestAnimationFrame(() => {
      for (const key in this.pointMap) {
        if (this.pointMap.hasOwnProperty(key)) {
          const point = this.pointMap[key as keyof PointMap];
          const { x, y, z } = point;
          point.x =
            x * Math.cos((this.props.rotateState.rotateSpeed / 180) * Math.PI) -
            z * Math.sin((this.props.rotateState.rotateSpeed / 180) * Math.PI);
          point.y = y;
          point.z =
            z * Math.cos((this.props.rotateState.rotateSpeed / 180) * Math.PI) +
            x * Math.sin((this.props.rotateState.rotateSpeed / 180) * Math.PI);
        }
      }
      this.draw();
      this.animationFrame();
    });
  }
  render() {
    const { size } = this.props;
    return (
      <canvas className="cube" ref={this.cube} width={size.width} height={size.height}>
        canvas not support
      </canvas>
    );
  }
} as React.ComponentClass<Props>;

export default Cube;
