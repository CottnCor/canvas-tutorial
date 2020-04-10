import React from 'react';
import * as triangulate from 'delaunay-triangulate';
import { TrackballControls } from 'three-trackballcontrols-ts';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
import { IRotateState } from '../../../../interfaces/common/IRotateState';
import {
    Vector2,
    Vector3,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Geometry,
    Line,
    LinePieces,
    LineBasicMaterial,
    SpotLight,
    Color,
    SphereGeometry,
    MeshLambertMaterial,
    Mesh
} from 'three';

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

const PointCloud3D = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;
    readonly state = {} as State;
    private container: React.RefObject<HTMLDivElement>;
    private camera: PerspectiveCamera;
    private controls: TrackballControls;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private mouse: Vector2;
    private pointCloud: IPointCloudGenerator;
    private animationHandle: number;
    constructor(props: Props) {
        super(props);
        this.container = React.createRef();
        this.mouse = new Vector2();
        this.camera = new PerspectiveCamera(84, window.innerWidth / window.innerHeight, 1, 1000);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.controls = new TrackballControls(Object.create(this.camera), this.renderer.domElement);
        this.pointCloud = new PointCloudGenerator(this.props.rotateState.thinningRatio);
        this.animationHandle = Number.NaN;
    }
    componentDidMount() {
        this.init();
        this.animate();
    }
    componentWillUnmount() {
        if (!Number.isNaN(this.animationHandle)) {
            window.cancelAnimationFrame(this.animationHandle);
        }
    }
    init() {
        this.scene.background = new Color(0xffffff);

        this.camera.position.z = 36;

        const light = new SpotLight(0xffffff, 1.5);
        light.position.set(0, 100, 200);
        this.scene.add(light);

        console.log(`start: ${new Date().getSeconds()}`);

        const points = this.pointCloud.points.map((point) => [point.x, point.y, point.z]);

        const triangles = triangulate(points);

        console.log(`triangles: ${new Date().getSeconds()}`);

        console.log(`triangles: ${triangles}`);

        triangles.forEach((triangle: number[]) => {
            for (let i = 0; i < triangle.length; i++) {
                let pointStart = points[triangle[i]];
                let pointEnd = [] as number[];
                if (i < triangle.length - 1) {
                    pointEnd = points[triangle[i + 1]];
                    this.scene.add(this.initLine(pointStart, pointEnd));
                } else pointEnd = pointStart;
                this.scene.add(this.initEndpoint(pointStart));
                this.scene.add(this.initEndpoint(pointEnd));
                this.scene.add(this.initLine(pointStart, pointEnd));
            }
        });

        console.log(`initLine: ${new Date().getSeconds()}`);

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.current?.appendChild(this.renderer.domElement);

        this.controls = new TrackballControls(Object.create(this.camera), this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.renderer.domElement.addEventListener('mousemove', (e: MouseEvent) => {
            this.onMouseMove(e);
        });

        console.log(`renderer: ${new Date().getSeconds()}`);
    }
    initEndpoint(point: number[]) {
        const sphereGeometry = new SphereGeometry(0.2);
        const sphereMaterial = new MeshLambertMaterial({ color: 0xfd753a });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(point[0], point[1], point[2]);
        return sphere;
    }
    initLine(pointA: number[], pointB: number[]) {
        const geometry = new Geometry();
        const material = new LineBasicMaterial({ vertexColors: true });
        const color1 = new Color(0x1d5575);
        const color2 = new Color(0x1d5575);
        const p1 = new Vector3(...Array.from(pointA));
        const p2 = new Vector3(...Array.from(pointB));
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.colors.push(color1, color2);
        return new Line(geometry, material, LinePieces);
    }
    onMouseMove(e: MouseEvent) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    animate() {
        this.animationHandle = window.requestAnimationFrame(() => {
            this.draw();
            this.animate();
        });
    }
    draw() {
        this.controls.update();
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        const { size } = this.props;
        return <div ref={this.container} style={{ width: size.width, height: size.height }} />;
    }
} as React.ComponentClass<Props>;

export default PointCloud3D;
