import React from 'react';
import { voronoi } from 'd3-voronoi';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
import { transformCoordinatePoint } from '../CanvasHelper';
import { IRotateState } from '../../../../interfaces/common/IRotateState';

const defaultProps = {
    rotateState: { x: 0, y: 0, z: 0, rotateSpeed: 2, thinningRatio: 16 },
    size: { width: 600, height: 600 }
};

type Props = {
    rotateState: IRotateState;
    size: { width: number; height: number };
} & Partial<typeof defaultProps>;

interface State {
    rotateState: IRotateState;
}

interface Point {
    x: number;
    y: number;
    z: number;
}

const PointCloud = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;
    readonly state = {} as State;
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
            this.pointCloud.points.forEach((point) => {
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
    drawTriangulated() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
            let points: [number, number][] = this.pointCloud.points.map((item) => [item.x, item.y]);
            let links = voronoi().links(points);
            if (links.length > 0) {
                this.ctx.beginPath();
                let point = {} as Point;
                let newPoint = {} as { x: number; y: number };
                let offsetX = this.props.size.width / 2;
                let offsetY = this.props.size.height / 2;
                for (const link of links) {
                    point = { x: link.source[0], y: link.source[1], z: 0 };
                    newPoint = transformCoordinatePoint(point, offsetX, offsetY);
                    this.ctx.moveTo(newPoint.x, newPoint.y);
                    point = { x: link.target[0], y: link.target[1], z: 0 };
                    newPoint = transformCoordinatePoint(point, offsetX, offsetY);
                    this.ctx.lineTo(newPoint.x, newPoint.y);
                }
                this.ctx.stroke();
            }
        }
    }
    transformCoordinatePoint(
        point: Point,
        offsetX = this.props.size.width / 2,
        offsetY = this.props.size.height / 2
    ) {
        return {
            x: ((point.x - this.camera.x) * this.camera.z) / (this.camera.z - point.z) + offsetX,
            y: ((point.y - this.camera.y) * this.camera.z) / (this.camera.z - point.z) + offsetY
        };
    }
    animationFrame() {
        this.animationHandle = window.requestAnimationFrame(() => {
            this.pointCloud.updatePoints(this.props.rotateState.thinningRatio);
            this.pointCloud.updatePointProjection(this.props.rotateState.rotateSpeed, this.camera);
            this.drawTriangulated();
            this.animationFrame();
        });
    }
    render() {
        const { size } = this.props;
        return (
            <canvas
                className="pointCloud"
                ref={this.canvas}
                width={size.width}
                height={size.height}
            >
                canvas not support
            </canvas>
        );
    }
} as React.ComponentClass<Props>;

export default PointCloud;
