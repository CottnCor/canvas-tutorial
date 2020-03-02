import './CanvasArtist.scss';
import React from 'react';
import Cube from './surface/Cube';
import HelloBlue from './surface/HelloBlue';
import Polyline from './surface/Polyline';
import PointCloud from './surface/PointCloud';
import TriangulatedNetwork from './surface/TriangulatedNetwork';
import { Slider, Radio } from 'antd';
import { Surface } from 'gl-react-dom';
const defaultProps = {
  size: { width: 600, height: 600 }
};
type Props = {
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;
interface State {
  speed: number;
  tsuma: string;
}
const CanvasArtist = class extends React.Component<Props & typeof defaultProps, State> {
  readonly state = {} as State;
  static defaultProps = defaultProps;
  constructor(props: Props) {
    super(props);
    this.state = { speed: 2, tsuma: 'Katou Megumi' };
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
  handleChange(key: keyof State, value: string | number) {
    this.setState({
      [key]: value
    } as Pick<State, typeof key>);
  }
  renderSurFace() {
    if (this.state.tsuma === 'Katou Megumi') {
      return <Cube rotationAngleSpeed={this.state.speed} size={this.props.size} />;
    } else if (this.state.tsuma === 'Eriri Spencer Sawamura') {
      return <Polyline lineOffset={6} rotationAngleSpeed={this.state.speed} size={this.props.size} />;
    } else if (this.state.tsuma === 'Kasumigaoka Utaha') {
      return <PointCloud lineOffset={0} rotationAngleSpeed={this.state.speed} size={this.props.size} />;
    } else {
      return <TriangulatedNetwork rotationAngleSpeed={this.state.speed} size={this.props.size} />;
    }
  }
  render() {
    const { width, height } = this.props.size;
    return (
      <div className="canvas-artist">
        {this.renderSurFace()}
        {/* <Surface width={width} height={height}>
          <HelloBlue speed={this.state.speed} />
        </Surface> */}
        <div className={`switch-wapper`}>
          <Radio.Group
            defaultValue={this.state.tsuma}
            value={this.state.tsuma}
            onChange={event => this.handleChange('tsuma', event.target.value)}
          >
            {this.requestKanojyo().map(item => (
              <Radio.Button style={{ display: 'block' }} key={item.key} value={item.key}>
                {item.value}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="slider-wapper">
          <Slider
            style={{ color: '#fff' }}
            className="xxx-slider"
            marks={this.requestMask()}
            defaultValue={this.state.speed * 10}
            value={this.state.speed * 10}
            onChange={event => this.handleChange('speed', +event / 10)}
          />
        </div>
      </div>
    );
  }
} as React.ComponentClass<Props>;
export default CanvasArtist;
