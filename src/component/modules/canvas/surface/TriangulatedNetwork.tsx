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

interface PointList {
  [key: string]: Point;
}

interface PointMap {
  [key: string]: string[];
}

const TriangulatedNetwork = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  private animationHandle: number;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private triangulatedNetwork: React.RefObject<HTMLCanvasElement>;
  private camera: { x: number; y: number; z: number };
  private pointList: PointList;
  private pointMap: PointMap;
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.animationHandle = Number.NaN;
    this.triangulatedNetwork = React.createRef();
    this.camera = {
      x: 0,
      y: 0,
      z: 300
    };
    this.pointList = {
      A: { x: 80, y: 140, z: -100 },
      B: { x: 130, y: 80, z: 50 },
      C: { x: 140, y: 40, z: 20 },
      D: { x: 60, y: 20, z: 40 },
      E: { x: 30, y: 20, z: -80 },
      F: { x: 50, y: 60, z: -20 },
      G: { x: 90, y: 80, z: 10 },
      H: { x: 80, y: 90, z: 160 }
    };
    this.pointMap = {
      A: ['B', 'F', 'G', 'H'],
      B: ['C', 'G'],
      C: ['D', 'F', 'G'],
      D: ['E', 'F'],
      E: ['F'],
      F: ['G', 'H'],
      G: ['H']
    };
  }
  componentDidMount() {
    this.ctx = this.triangulatedNetwork.current?.getContext('2d');
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
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
      let point = {} as { x: number; y: number };
      for (const startPointKey in this.pointMap) {
        if (this.pointMap.hasOwnProperty(startPointKey)) {
          const map = this.pointMap[startPointKey as keyof PointMap];
          map.forEach(endPointKey => {
            if (this.ctx) {
              this.ctx.beginPath();
              point = this.transformCoordinatePoint(this.pointList[startPointKey]);
              this.ctx.moveTo(point.x, point.y);
              point = this.transformCoordinatePoint(this.pointList[endPointKey]);
              this.ctx.lineTo(point.x, point.y);
              this.ctx.stroke();
              this.ctx.closePath();
            }
          });
        }
      }
    }
  }
  animationFrame() {
    this.animationHandle = window.requestAnimationFrame(() => {
      for (const key in this.pointList) {
        if (this.pointList.hasOwnProperty(key)) {
          const point = this.pointList[key as keyof PointList];
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
      <canvas className="triangulatedNetwork" ref={this.triangulatedNetwork} width={size.width} height={size.height}>
        canvas not support
      </canvas>
    );
  }
} as React.ComponentClass<Props>;

export default TriangulatedNetwork;
