import './CanvasArtist.scss';
import React from 'react';
import HelloBlue from './HelloBlue';
import { Slider, Radio } from 'antd';
import { Surface } from 'gl-react-dom';
const defaultProps = {
  size: { width: 600, height: 600 }
};
type Props = {
  size: { width: number; height: number };
} & Partial<typeof defaultProps>;
interface State {
  blue: number;
  tsuma: string;
}
const CanvasArtist = class extends React.Component<Props & typeof defaultProps, State> {
  static defaultProps = defaultProps;
  constructor(props: Props) {
    super(props);
    this.state = { blue: 0.1, tsuma: 'Katou Megumi' };
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
  render() {
    const { width, height } = this.props.size;
    return (
      <div className="canvas-artist">
        <Surface width={width} height={height}>
          <HelloBlue blue={this.state.blue} />
        </Surface>
        <div className={`switch-wapper`}>
          <Radio.Group
            defaultValue={this.state.tsuma}
            value={this.state.tsuma}
            onChange={event => this.handleChange('tsuma', event.target.value)}
          >
            {this.requestKanojyo().map(item => (
              <Radio.Button style={{ display: 'block' }} value={item.key}>
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
            defaultValue={this.state.blue * 100}
            value={this.state.blue * 100}
            onChange={event => this.handleChange('blue', +event / 100)}
          />
        </div>
      </div>
    );
  }
} as React.ComponentClass<Props>;
export default CanvasArtist;
