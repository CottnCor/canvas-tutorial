import React from 'react';
import PolylineGenerator, { IPolylineGenerator } from './PolylineGenerator';

const defaultProps = {
  lineOffset: 0,
  rotationAngleSpeed: 1,
  size: { width: 600, height: 600 }
};

type Props = {
  lineOffset: number;
  rotationAngleSpeed: number;
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;

interface State {
  lineOffset: number;
  rotationAngleSpeed: number;
}

const Polyline = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private wave: React.RefObject<HTMLCanvasElement>;
  private visual: { x: number; y: number; z: number };
  private polylineList: IPolylineGenerator[];
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.wave = React.createRef();
    this.visual = {
      x: 0,
      y: -100,
      z: 600
    };
    const { lineOffset, rotationAngleSpeed } = this.props;
    this.state = { lineOffset, rotationAngleSpeed };
    this.polylineList = [
      new PolylineGenerator(10, 2, 0, 0, -150, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, -120, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, -90, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, -60, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, -30, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 0, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 30, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 60, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 90, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 120, -200, 200, 10),
      new PolylineGenerator(10, 2, 0, 0, 150, -200, 200, 10)
    ];
  }
  componentDidMount() {
    this.ctx = this.wave.current?.getContext('2d');
    this.draw();
    this.animationFrame();
  }
  draw() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
      this.polylineList.forEach(polyline => {
        polyline.pointList.forEach(point => {
          if (this.ctx) {
            this.ctx.beginPath();
            const pointSize = (2 * this.visual.z) / (this.visual.z - point.z);
            this.ctx.arc(
              point.canvasX + this.props.size.width / 2,
              point.canvasY + this.props.size.height / 3,
              pointSize,
              0,
              2 * Math.PI
            );
            this.ctx.closePath();
            this.ctx.fill();
          }
        });
      });
    }
  }
  animationFrame() {
    window.requestAnimationFrame(() => {
      this.polylineList.forEach((polyline, index) => {
        const lineOffset = this.state.lineOffset;
        polyline.updatePointList(lineOffset, this.state.rotationAngleSpeed, this.visual);
      });
      const { lineOffset } = this.state;
      this.setState({ lineOffset: lineOffset + 2 });
      this.draw();
      this.animationFrame();
    });
  }
  render() {
    const { size } = this.props;
    return (
      <canvas className="wave" ref={this.wave} width={size.width} height={size.height}>
        canvas not support
      </canvas>
    );
  }
} as React.ComponentClass<Props>;

export default Polyline;
