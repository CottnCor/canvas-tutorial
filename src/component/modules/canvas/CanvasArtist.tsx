import './CanvasArtist.scss';
import React from 'react';
import { Slider, Radio, Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cube from './surface/Cube';
import Polyline from './surface/Polyline';
import PointCloud from './surface/PointCloud';
import PointCloud3D from './surface/PointCloud3D';
import TriangulatedNetwork from './surface/TriangulatedNetwork';
import { RotateDirection } from '../../../interfaces/common/RotateDirection';
import { IRotateState } from '../../../interfaces/common/IRotateState';

import img_mesh from './faker/13671589020006_.pic.jpg';
import img_point from './faker/13681589020007_.pic.jpg';

const defaultProps = {
    size: { width: 600, height: 600 }
};
type IProps = {
    size: { width: number; height: number };
} & Partial<typeof defaultProps>;
interface IState {
    file?: File;
    tsuma: string;
    rotateState: IRotateState;
}
const CanvasArtist = class extends React.Component<IProps & typeof defaultProps, IState> {
    private ref: React.RefObject<HTMLInputElement>;
    static defaultProps = defaultProps;
    readonly state = {} as IState;
    constructor(props: IProps) {
        super(props);
        this.state = {
            tsuma: 'Katou Megumi',
            rotateState: {
                x: RotateDirection.Static,
                y: RotateDirection.Static,
                z: RotateDirection.Static,
                rotateSpeed: 1,
                thinningRatio: 96
            }
        };
        this.ref = React.createRef();
    }
    requestMask() {
        return {
            20: '20%',
            40: '40%',
            60: '60%',
            80: '80%',
            100: {
                style: {
                    color: '#ac8ece'
                },
                label: <strong>100%</strong>
            }
        };
    }
    requestKanojyo() {
        return [
            { key: 'Katou Megumi', value: '文件导入' },
            { key: 'Eriri Spencer Sawamura', value: '散乱点云模型' },
            { key: 'Kasumigaoka Utaha', value: '三角网格模型' }
            // { key: 'Hyodo Michiru', value: 'Hyodo Michiru' },
            // { key: 'Hashima Izumi', value: 'Hashima Izumi' },
            // { key: 'Hashima Iori', value: 'Hashima Iori' }
        ];
    }
    fileHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = this.ref.current
            ? this.ref.current.files
                ? this.ref.current.files
                : []
            : [];
        files.length > 0 ? this.handleChange('file', files[0]) : this.handleChange('file', null);
    }
    handleChange(key: keyof IState, value: string | IRotateState | File | null) {
        this.setState({
            [key]: value
        } as Pick<IState, typeof key>);
    }
    handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { width, height } = this.props.size;
        const x = this.judgeTrisectorZone(width, event.clientX);
        const y = this.judgeTrisectorZone(height, event.clientY);
        const rotateState = { ...this.state.rotateState, ...{ x, y } };
        this.setState({ rotateState });
        console.log(
            `x: ${+this.state.rotateState.x}, y: ${+this.state.rotateState.y}, z: ${+this.state
                .rotateState.z}`
        );
    }
    judgeTrisectorZone(zone: number, droppoint: number) {
        if (droppoint > 0 && droppoint < zone * (1 / 3)) {
            return RotateDirection.Anticlockwise;
        } else if (droppoint > zone * (1 / 3) && droppoint < zone * (2 / 3)) {
            return RotateDirection.Static;
        } else if (droppoint > zone * (2 / 3) && droppoint < zone) {
            return RotateDirection.Clockwise;
        } else {
            return RotateDirection.Anticlockwise;
        }
    }
    renderUploadProps() {
        return {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text'
            },
            onChange() {}
        };
    }
    renderSilentDiv(className: string) {
        return {
            className: className,
            onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                event.stopPropagation();
            }
        };
    }
    renderSlider() {
        const marks = this.requestMask();
        return { style: { color: '#fff' }, marks };
    }
    renderSurfaceCopy() {
        const { file } = this.state;
        if (this.state.tsuma === 'Katou Megumi') {
            return <Cube rotateState={this.state.rotateState} size={this.props.size} />;
        } else if (this.state.tsuma === 'Eriri Spencer Sawamura') {
            return (
                <Polyline
                    lineOffset={6}
                    rotateState={this.state.rotateState}
                    size={this.props.size}
                />
            );
        } else if (this.state.tsuma === 'Kasumigaoka Utaha') {
            return <PointCloud rotateState={this.state.rotateState} size={this.props.size} />;
        } else if (this.state.tsuma === 'Hyodo Michiru') {
            return file ? <PointCloud3D file={file} size={this.props.size} /> : <div></div>;
        } else {
            return (
                <TriangulatedNetwork rotateState={this.state.rotateState} size={this.props.size} />
            );
        }
    }
    renderSurface() {
        const { file } = this.state;
        if (this.state.tsuma === 'Katou Megumi') {
            return <img className="img-faker" />;
        } else if (this.state.tsuma === 'Eriri Spencer Sawamura') {
            return <img className="img-faker" src={img_point} />;
        } else if (this.state.tsuma === 'Kasumigaoka Utaha') {
            return <img className="img-faker" src={img_mesh} />;
        }
    }
    render() {
        return (
            <div className="canvas-artist" onClick={this.handleClick.bind(this)}>
                {this.renderSurface()}
                <div {...this.renderSilentDiv('switch-wapper')}>
                    <Radio.Group
                        defaultValue={this.state.tsuma}
                        value={this.state.tsuma}
                        onChange={(event) => this.handleChange('tsuma', event.target.value)}
                    >
                        {this.requestKanojyo().map((item) =>
                            item.key !== '' ? (
                                <Radio.Button
                                    style={{ display: 'block' }}
                                    key={item.key}
                                    value={item.key}
                                >
                                    {item.value}
                                </Radio.Button>
                            ) : (
                                <Upload {...this.renderUploadProps()}>
                                    <Button>
                                        <UploadOutlined /> 文件导入
                                    </Button>
                                </Upload>
                            )
                        )}
                    </Radio.Group>
                </div>
                <div {...this.renderSilentDiv('thinning-slider')}>
                    <Slider
                        vertical
                        {...this.renderSlider.apply(this)}
                        defaultValue={this.state.rotateState.thinningRatio}
                        value={this.state.rotateState.thinningRatio}
                        onChange={(event) =>
                            this.handleChange('rotateState', {
                                ...this.state.rotateState,
                                ...{ thinningRatio: +event }
                            })
                        }
                    />
                </div>
                <div {...this.renderSilentDiv('rotate-speed-slider')}>
                    {/* <input
                        type="file"
                        accept=".json"
                        ref={this.ref}
                        onChange={this.fileHandleChange.bind(this)}
                    /> */}
                </div>
            </div>
        );
    }
} as React.ComponentClass<IProps>;
export default CanvasArtist;
