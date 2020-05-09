import React from 'react';
import * as triangulate from 'delaunay-triangulate';
import { TrackballControls } from 'three-trackballcontrols-ts';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
import {
    Vector2,
    Vector3,
    Face3,
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
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    MultiMaterial,
    Object3D
} from 'three';

const defaultProps = {
    size: { width: 600, height: 600 }
};

interface IObject {
    total: number;
    type: 'node' | 'face';
    points: number[][];
    vertices?: number[][];
}

type IProps = {
    file?: File;
    size: { width: number; height: number };
} & Partial<typeof defaultProps>;

const PointCloud3D = class extends React.Component<IProps & typeof defaultProps, {}> {
    static defaultProps = defaultProps;
    private container: React.RefObject<HTMLDivElement>;
    private camera: PerspectiveCamera;
    private controls: TrackballControls;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private mouse: Vector2;
    private animationHandle: number;
    constructor(props: IProps) {
        super(props);
        this.container = React.createRef();
        this.mouse = new Vector2();
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.camera = new PerspectiveCamera(84, window.innerWidth / window.innerHeight, 1, 1000);
        this.controls = new TrackballControls(Object.create(this.camera), this.renderer.domElement);
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
        const { file } = this.props;
        if (file) {
            const $ = this;
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                if (this.result && typeof this.result === 'string') {
                    const object: IObject = JSON.parse(this.result);
                    if (object.type === 'node') {
                        $.initNode(object.points);
                    } else {
                        if (object.vertices) {
                            $.initFace(object.points, object.vertices);
                        }
                    }
                }
            };
        }
    }
    initFace(points: number[][], vertices: number[][]) {
        this.initEnvironment();
        const geometry = new Geometry();
        points.forEach((point) => {
            geometry.vertices.push(new Vector3(...point));
        });
        vertices.forEach((vertex) => {
            if (vertex.length >= 3) {
                geometry.faces.push(new Face3(vertex[0], vertex[1], vertex[2]));
            }
        });
        const material = new MeshBasicMaterial({
            vertexColors: true
        });
        const color1 = new Color(0x1d5575);
        const color2 = new Color(0x1d5575);
        geometry.colors.push(color1, color2);
        this.scene.add(new Mesh(geometry, material));
    }
    initNode(points: number[][]) {
        this.initEnvironment();
        const sphereGroup = new Object3D();
        const sphereGeometry = new SphereGeometry(0.4, 20, 20);
        const sphereMaterial = new MeshLambertMaterial({ color: 0xff00ff });
        const meshMaterial = new MeshLambertMaterial({ color: 0xffffff });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        points.forEach((point) => {
            const geometry = new SphereGeometry(0.2, 10, 10);
            const mesh = new Mesh(geometry, meshMaterial);
            mesh.position.copy(new Vector3(...Array.from(point)));
            sphereGroup.add(mesh);
        });
        sphere.position.set(0, 0, 0);
        this.scene.add(sphere);
        this.scene.add(sphereGroup);
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
    initEnvironment() {
        const light = new SpotLight(0xffffff, 1.5);
        this.scene.background = new Color(0xffffff);
        this.camera.position.z = 36;
        light.position.set(0, 100, 200);
        this.scene.add(light);

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
} as React.ComponentClass<IProps>;

export default PointCloud3D;
