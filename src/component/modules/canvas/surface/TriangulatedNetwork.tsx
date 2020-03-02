import React from 'react';

const defaultProps = {
  rotationAngleSpeed: 1,
  size: { width: 600, height: 600 }
};

type Props = {
  rotationAngleSpeed: number;
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;

interface State {
  rotationAngleSpeed: number;
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
  private ctx: CanvasRenderingContext2D | null | undefined;
  private triangulatedNetwork: React.RefObject<HTMLCanvasElement>;
  private visual: { x: number; y: number; z: number };
  private pointList: PointList;
  private pointMap: PointMap;
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.triangulatedNetwork = React.createRef();
    this.visual = {
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
  transformCoordinatePoint(point: Point, offsetX = this.props.size.width / 2, offsetY = this.props.size.height / 2) {
    return {
      x: ((point.x - this.visual.x) * this.visual.z) / (this.visual.z - point.z) + offsetX,
      y: ((point.y - this.visual.y) * this.visual.z) / (this.visual.z - point.z) + offsetY
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
    window.requestAnimationFrame(() => {
      for (const key in this.pointList) {
        if (this.pointList.hasOwnProperty(key)) {
          const point = this.pointList[key as keyof PointList];
          const { x, y, z } = point;
          point.x =
            x * Math.cos((this.props.rotationAngleSpeed / 180) * Math.PI) -
            z * Math.sin((this.props.rotationAngleSpeed / 180) * Math.PI);
          point.y = y;
          point.z =
            z * Math.cos((this.props.rotationAngleSpeed / 180) * Math.PI) +
            x * Math.sin((this.props.rotationAngleSpeed / 180) * Math.PI);
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
