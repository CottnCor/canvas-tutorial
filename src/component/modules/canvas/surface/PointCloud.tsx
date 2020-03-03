import React from 'react';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
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

const PointCloud = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  private animationHandle: number;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private canvas: React.RefObject<HTMLCanvasElement>;
  private camera: { x: number; y: number; z: number };
  private pointCloud: IPointCloudGenerator;
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.animationHandle = Number.NaN;
    this.canvas = React.createRef();
    this.camera = {
      x: 0,
      y: -100,
      z: 600
    };
    this.pointCloud = new PointCloudGenerator(this.props.rotateState.thinningRatio);
  }
  componentDidMount() {
    this.ctx = this.canvas.current?.getContext('2d');
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
      this.pointCloud.points.forEach(point => {
        if (this.ctx) {
          const pointSize = (2 * this.camera.z) / (this.camera.z - point.z);
          this.ctx.beginPath();
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
    }
  }
  animationFrame() {
    this.animationHandle = window.requestAnimationFrame(() => {
      this.pointCloud.updatePoints(this.props.rotateState.thinningRatio);
      this.pointCloud.updatePointProjection(this.props.rotateState.rotateSpeed, this.camera);
      this.draw();
      this.animationFrame();
    });
  }
  render() {
    const { size } = this.props;
    return (
      <canvas className="pointCloud" ref={this.canvas} width={size.width} height={size.height}>
        canvas not support
      </canvas>
    );
  }
} as React.ComponentClass<Props>;

export default PointCloud;
