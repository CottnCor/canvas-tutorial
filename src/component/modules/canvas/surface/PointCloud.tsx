import React from 'react';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';

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

const PointCloud = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private pointCloud: React.RefObject<HTMLCanvasElement>;
  private visual: { x: number; y: number; z: number };
  private pointCloudList: IPointCloudGenerator[];
  constructor(props: Props) {
    super(props);
    this.ctx = null;
    this.pointCloud = React.createRef();
    this.visual = {
      x: 0,
      y: -100,
      z: 600
    };
    const { lineOffset, rotationAngleSpeed } = this.props;
    this.state = { lineOffset, rotationAngleSpeed };
    this.pointCloudList = [new PointCloudGenerator()];
  }
  componentDidMount() {
    this.ctx = this.pointCloud.current?.getContext('2d');
    this.draw();
    this.animationFrame();
  }
  draw() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
      this.pointCloudList.forEach(polyline => {
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
      this.pointCloudList.forEach((polyline, index) => {
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
      <canvas className="pointCloud" ref={this.pointCloud} width={size.width} height={size.height}>
        canvas not support
      </canvas>
    );
  }
} as React.ComponentClass<Props>;

export default PointCloud;
