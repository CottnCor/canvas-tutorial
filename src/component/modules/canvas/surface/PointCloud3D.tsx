import React from 'react';
import BoundGenerator from './BoundGenerator';
import { TrackballControls } from 'three-trackballcontrols-ts';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
import { IRotateState } from '../../../../interfaces/common/IRotateState';
import { computeTriangulation } from '../../../../util/triangulation';

import {
    Vector2,
    Vector3,
    Face3,
    Euler,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    WebGLRenderTarget,
    Geometry,
    BoxBufferGeometry,
    Line,
    LinePieces,
    LineBasicMaterial,
    SpotLight,
    AmbientLight,
    MeshLambertMaterial,
    Color,
    MeshStandardMaterial
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

interface IPoint {
    x: number;
    y: number;
    z: number;
}

interface IPicking {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
}

interface IExtents {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    zmin: number;
    zmax: number;
}

const PointCloud3D = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;
    readonly state = {} as State;
    private container: React.RefObject<HTMLDivElement>;
    // private stats: IStats;
    private camera: PerspectiveCamera;
    private controls: TrackballControls;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private pickingData: Array<IPicking>;
    private pickingTexture: WebGLRenderTarget;
    private pickingScene: Scene;
    private highlightBox: Mesh;
    private mouse: Vector2;
    private offset: Vector3;
    private pointCloud: IPointCloudGenerator;
    private animationHandle: number;
    constructor(props: Props) {
        super(props);
        this.container = React.createRef();
        this.mouse = new Vector2();
        this.offset = new Vector3(10, 10, 10);
        // this.stats = Stats();
        this.pickingData = [];
        this.pickingTexture = new WebGLRenderTarget(1, 1);
        this.pickingScene = new Scene();
        this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.controls = new TrackballControls(Object.create(this.camera), this.renderer.domElement);
        this.pointCloud = new PointCloudGenerator(this.props.rotateState.thinningRatio);
        this.highlightBox = new Mesh(
            new BoxBufferGeometry(),
            new MeshLambertMaterial({ color: 0xffff00 })
        );
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
        const light = new SpotLight(0xffffff, 1.5);
        light.position.set(0, 500, 2000);
        this.camera.position.z = 1000;
        this.scene.background = new Color(0xffffff);
        this.scene.add(new AmbientLight(0x555555));
        this.scene.add(light);

        console.log(`start: ${new Date().getUTCDate}`);

        const points = this.pointCloud.points;
        const boundaries: number[][] = BoundGenerator();

        const extents = this.computeExtents(points);

        const triangles = computeTriangulation(points, boundaries);

        console.log(`triangles: ${new Date().getUTCDate}`);

        triangles.forEach((triangle) => {
            let trianglesSorted = this.sortCounterclockwise(triangle);
            for (let i = 0; i < trianglesSorted.length; i++) {
                let pointStart = Object.values(trianglesSorted[i]);
                let pointEnd = [] as number[];
                if (i < trianglesSorted.length - 1) {
                    pointEnd = Object.values(trianglesSorted[i + 1]);
                } else pointEnd = pointStart;
                this.scene.add(this.initLine(pointStart, pointEnd));
            }
            // this.scene.add(this.createTriangleMesh(trianglesSorted, extents));
        });

        console.log(`initLine: ${new Date().getUTCDate}`);

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

        // this.container.current?.appendChild(this.stats.dom);

        this.renderer.domElement.addEventListener('mousemove', (e: MouseEvent) => {
            this.onMouseMove(e);
        });

        console.log(`renderer: ${new Date().getUTCDate}`);
    }
    initLine(pointA: number[], pointB: number[]) {
        const geometry = new Geometry();
        const material = new LineBasicMaterial({ vertexColors: true });
        const color1 = new Color(0x444444);
        const color2 = new Color(0xff0000);
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
            // this.stats.update();
            this.animate();
        });
    }
    pick() {
        const pixelBuffer = new Uint8Array(4);
        this.camera.setViewOffset(
            this.renderer.domElement.width,
            this.renderer.domElement.height,
            (this.mouse.x * window.devicePixelRatio) | 0,
            (this.mouse.y * window.devicePixelRatio) | 0,
            1,
            1
        );
        this.renderer.setRenderTarget(this.pickingTexture);
        this.renderer.render(this.pickingScene, this.camera);
        this.camera.clearViewOffset();
        this.renderer.readRenderTargetPixels(this.pickingTexture, 0, 0, 1, 1, pixelBuffer);
        const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
        const data = this.pickingData[id];
        if (data) {
            if (data.position && data.rotation && data.scale) {
                this.highlightBox.position.copy(data.position);
                this.highlightBox.rotation.copy(data.rotation);
                this.highlightBox.scale.copy(data.scale).add(this.offset);
                this.highlightBox.visible = true;
            }
        } else {
            this.highlightBox.visible = false;
        }
    }
    draw() {
        this.controls.update();
        // this.pick();
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }
    computeExtents(points: IPoint[]) {
        const extents = {
            xmin: Number.MAX_VALUE,
            xmax: -Number.MAX_VALUE,
            ymin: Number.MAX_VALUE,
            ymax: -Number.MAX_VALUE,
            zmin: Number.MAX_VALUE,
            zmax: -Number.MAX_VALUE
        };
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (p.x < extents.xmin) extents.xmin = p.x;
            if (p.y < extents.ymin) extents.ymin = p.y;
            if (p.x > extents.xmax) extents.xmax = p.x;
            if (p.y > extents.ymax) extents.ymax = p.y;
            if (p.z > extents.zmax) extents.zmax = p.z;
            if (p.z < extents.zmin) extents.zmin = p.z;
        }
        return extents;
    }
    transformPointToScene(point: IPoint, extents: IExtents) {
        const xfact = 200 / (extents.xmax - extents.xmin);
        const yfact = 200 / (extents.ymax - extents.ymin);
        const zfact = 4 / (extents.zmax - extents.zmin);
        return {
            x: (point.x - extents.xmin) * xfact,
            y: (point.y - extents.ymin) * yfact,
            z: (point.z - extents.zmin) * zfact
        };
    }
    sortCounterclockwise(circle_points: IPoint[]) {
        const vector12 = {
            x: circle_points[1].x - circle_points[0].x,
            y: circle_points[1].y - circle_points[0].y
        };
        const vector13 = {
            x: circle_points[2].x - circle_points[0].x,
            y: circle_points[2].y - circle_points[0].y
        };
        const det = vector12.x * vector13.y - vector12.y * vector13.x;
        if (det < 0) {
            const point = circle_points[0];
            circle_points[0] = circle_points[2];
            circle_points[2] = point;
        }
        return circle_points;
    }
    createTriangleMesh(triangle: IPoint[], extents: IExtents) {
        const material = new MeshStandardMaterial({ color: 0xcccccc });
        const p0 = this.transformPointToScene(triangle[0], extents);
        const p1 = this.transformPointToScene(triangle[1], extents);
        const p2 = this.transformPointToScene(triangle[2], extents);

        const geometry = new Geometry();
        geometry.vertices.push(new Vector3(p0.x, p0.y, p0.z));
        geometry.vertices.push(new Vector3(p1.x, p1.y, p1.z));
        geometry.vertices.push(new Vector3(p2.x, p2.y, p2.z));

        const color = new Color(0x000000);
        const face = new Face3(0, 1, 2, undefined, color);

        geometry.faces.push(face);
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        return new Mesh(geometry, material);
    }
    render() {
        const { size } = this.props;
        return <div ref={this.container} style={{ width: size.width, height: size.height }} />;
    }
} as React.ComponentClass<Props>;

export default PointCloud3D;
