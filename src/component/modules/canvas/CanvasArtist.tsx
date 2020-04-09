import './CanvasArtist.scss';
import React from 'react';
import { Slider, Radio } from 'antd';
import Cube from './surface/Cube';
import Polyline from './surface/Polyline';
import PointCloud from './surface/PointCloud';
import PointCloud3D from './surface/PointCloud3D';
import TriangulatedNetwork from './surface/TriangulatedNetwork';
import { RotateDirection } from '../../../interfaces/common/RotateDirection';
import { IRotateState } from '../../../interfaces/common/IRotateState';

const defaultProps = {
    size: { width: 600, height: 600 }
};
type Props = {
    size: { width: number; height: number };
} & Partial<typeof defaultProps>;
interface State {
    tsuma: string;
    rotateState: IRotateState;
}
const CanvasArtist = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;
    readonly state = {} as State;
    constructor(props: Props) {
        super(props);
        this.state = {
            tsuma: 'Hyodo Michiru',
            rotateState: {
                x: RotateDirection.Static,
                y: RotateDirection.Static,
                z: RotateDirection.Static,
                rotateSpeed: 1,
                thinningRatio: 96
            }
        };
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
            { key: 'Katou Megumi', value: 'Katou Megumi' },
            { key: 'Eriri Spencer Sawamura', value: 'Eriri Spencer Sawamura' },
            { key: 'Kasumigaoka Utaha', value: 'Kasumigaoka Utaha' },
            { key: 'Hyodo Michiru', value: 'Hyodo Michiru' },
            { key: 'Hashima Izumi', value: 'Hashima Izumi' },
            { key: 'Hashima Iori', value: 'Hashima Iori' }
        ];
    }
    handleChange(key: keyof State, value: string | IRotateState) {
        this.setState({
            [key]: value
        } as Pick<State, typeof key>);
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
    renderSurface() {
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
            return <PointCloud3D rotateState={this.state.rotateState} size={this.props.size} />;
        } else {
            return (
                <TriangulatedNetwork rotateState={this.state.rotateState} size={this.props.size} />
            );
        }
    }
    render() {
        const { width, height } = this.props.size;
        return (
            <div className="canvas-artist" onClick={this.handleClick.bind(this)}>
                {this.renderSurface()}
                <div {...this.renderSilentDiv('switch-wapper')}>
                    <Radio.Group
                        defaultValue={this.state.tsuma}
                        value={this.state.tsuma}
                        onChange={(event) => this.handleChange('tsuma', event.target.value)}
                    >
                        {this.requestKanojyo().map((item) => (
                            <Radio.Button
                                style={{ display: 'block' }}
                                key={item.key}
                                value={item.key}
                            >
                                {item.value}
                            </Radio.Button>
                        ))}
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
                    <Slider
                        {...this.renderSlider.apply(this)}
                        defaultValue={this.state.rotateState.rotateSpeed * 10}
                        value={this.state.rotateState.rotateSpeed * 10}
                        onChange={(event) =>
                            this.handleChange('rotateState', {
                                ...this.state.rotateState,
                                ...{ rotateSpeed: +event / 10 }
                            })
                        }
                    />
                </div>
            </div>
        );
    }
} as React.ComponentClass<Props>;
export default CanvasArtist;
