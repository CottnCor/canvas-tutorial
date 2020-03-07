import React from 'react';
import PolylineGenerator, { IPolylineGenerator } from './PolylineGenerator';
import { RotateDirection, RotateState } from '../interface-common.d';

const defaultProps = {
  lineOffset: 0,
  rotateState: { x: 0, y: 0, z: 0, rotateSpeed: 2, thinningRatio: 16 },
  size: { width: 600, height: 600 }
};

type Props = {
  lineOffset: number;
  rotateState: RotateState;
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;

interface State {
  lineOffset: number;
  rotateState: RotateState;
}

const Polyline = class extends React.Component<Props & typeof defaultProps, State> {
  static defaultProps = defaultProps;
  readonly state = {} as State;
  private animationHandle: number;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private wave: React.RefObject<HTMLCanvasElement>;
  private camera: { x: number; y: number; z: number };
  private polylineList: IPolylineGenerator[];
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.wave = React.createRef();
    this.camera = {
      x: 0,
      y: -100,
      z: 600
    };
    this.animationHandle = Number.NaN;
    const { lineOffset, rotateState } = this.props;
    this.state = { lineOffset, rotateState };
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
    this.animationFrame();
  }
  componentWillUnmount() {
    if (!Number.isNaN(this.animationHandle)) {
      window.cancelAnimationFrame(this.animationHandle);
    }
  }
  draw() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
      this.polylineList.forEach(polyline => {
        polyline.pointList.forEach(point => {
          if (this.ctx) {
            this.ctx.beginPath();
            const pointSize = (2 * this.camera.z) / (this.camera.z - point.z);
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
    this.animationHandle = window.requestAnimationFrame(() => {
      const { lineOffset } = this.state;
      this.setState({ lineOffset: lineOffset + 2 });
      this.polylineList.forEach((polyline, index) => {
        const lineOffset = this.state.lineOffset;
        polyline.updatePointList(lineOffset, this.state.rotateState.rotateSpeed, this.camera);
      });
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
