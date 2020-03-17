import React from 'react';
import * as THREE from 'three';
import {  } from "three-orbitcontrols";
import {  } from "three-transformcontrols";
import { voronoi } from 'd3-voronoi';
import { RotateState } from '../interface-common';
import PointCloudGenerator, { IPointCloudGenerator } from './PointCloudGenerator';
import { transformCoordinatePoint } from '../CanvasHelper';

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

const PointCloud3D = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;
    readonly state = {} as State;
    private canvas: React.RefObject<HTMLDivElement>;
    private pointCloud: IPointCloudGenerator;
    private cube: THREE.Mesh;
    private orbit: THREE.Mesh;
    private control: THREE.Mesh;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    constructor(props: Props) {
        super(props);
        this.cube = new THREE.Mesh();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.canvas = React.createRef();
        this.pointCloud = new PointCloudGenerator(this.props.rotateState.thinningRatio);
    }
    componentDidMount() {
        this.init();
        this.draw();
    }
    init() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        //
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );
        this.camera.position.set(1000, 500, 1000);
        this.camera.lookAt(0, 200, 0);
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.GridHelper(1000, 10));
        var light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        var texture = new THREE.TextureLoader().load('textures/crate.gif', render);
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
        var material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.update();
        this.orbit.addEventListener('change', render);
        this.control = new TransformControls(this.camera, this.renderer.domElement);
        this.control.addEventListener('change', render);
        this.control.addEventListener('dragging-changed', function(event) {
            this.orbit.enabled = !event.value;
        });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.control.attach(mesh);
        this.scene.add(this.control);
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', function(event) {
            switch (event.keyCode) {
                case 81: // Q
                    this.control.setSpace(this.control.space === 'local' ? 'world' : 'local');
                    break;
                case 16: // Shift
                    this.control.setTranslationSnap(100);
                    this.control.setRotationSnap(THREE.MathUtils.degToRad(15));
                    this.control.setScaleSnap(0.25);
                    break;
                case 87: // W
                    this.control.setMode('translate');
                    break;
                case 69: // E
                    this.control.setMode('rotate');
                    break;
                case 82: // R
                    this.control.setMode('scale');
                    break;
                case 187:
                case 107: // +, =, num+
                    this.control.setSize(this.control.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                    this.control.setSize(Math.max(this.control.size - 0.1, 0.1));
                    break;
                case 88: // X
                    this.control.showX = !this.control.showX;
                    break;
                case 89: // Y
                    this.control.showY = !this.control.showY;
                    break;
                case 90: // Z
                    this.control.showZ = !this.control.showZ;
                    break;
                case 32: // Spacebar
                    this.control.enabled = !this.control.enabled;
                    break;
            }
        });
        window.addEventListener('keyup', function(event) {
            switch (event.keyCode) {
                case 17: // Ctrl
                    this.control.setTranslationSnap(null);
                    this.control.setRotationSnap(null);
                    this.control.setScaleSnap(null);
                    break;
            }
        });
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.draw();
    }
    draw() {
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        const { size } = this.props;
        return (
            <div
                className="pointCloud"
                ref={this.canvas}
                style={{ width: size.width, height: size.height }}
            />
        );
    }
} as React.ComponentClass<Props>;

export default PointCloud3D;
