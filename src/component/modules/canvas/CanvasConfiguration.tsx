import './CanvasConfiguration.scss';
import React from 'react';
import { Form, Select, InputNumber, Switch, Radio, Slider, Button, Upload, Rate, Checkbox, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
interface Props {}
interface State {
  age: number;
  name: string;
  otaku: boolean;
  tsuma: string;
  kanojyo: string[];
}
const CanvasConfiguration = class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { age: 15, name: 'Aki Tomoya', otaku: true, kanojyo: ['Katou Megumi'], tsuma: 'Katou Megumi' };
  }
  handleChange(key: keyof State, value: string | string[] | number | boolean | undefined) {
    this.setState({
      [key]: value
    } as Pick<State, typeof key>);
  }
  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log(this.state);
    event.preventDefault();
  }
  requestFormItemOption() {
    return {
      className: 'item'
    };
  }
  requestFormOption() {
    return {
      name: 'canvas-configuration',
      className: 'canvas-configuration',
      initialValues: this.state,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
  }
  requestRules() {
    return [{ required: true, message: 'Please select your tsuma!' }];
  }
  requestTsumaMask() {
    return {
      0: 'Katou Megumi',
      20: 'Eriri Spencer Sawamura',
      40: 'Kasumigaoka Utaha',
      60: 'Hyodo Michiru',
      80: 'Hashima Izumi',
      100: 'Hashima Iori'
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
  render() {
    const { Option } = Select;
    return (
      <Form {...this.requestFormOption()} onSubmitCapture={this.handleSubmit}>
        <Form.Item {...this.requestFormItemOption()} name="name" label="name">
          <span className="ant-form-text">{this.state.name}</span>
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="age" label="age">
          <InputNumber
            defaultValue={this.state.age}
            min={1}
            max={150}
            onChange={event => this.handleChange('age', event)}
          />
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="tsuma" label="tsuma" rules={this.requestRules()}>
          <Select
            defaultValue={this.state.tsuma}
            value={this.state.tsuma}
            onChange={event => this.handleChange('tsuma', event)}
          >
            {this.requestKanojyo().map(item => (
              <Option value={item.key}>{item.value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="kanojyo" label="kanojyo">
          <Select
            mode="multiple"
            defaultValue={this.state.kanojyo}
            value={this.state.kanojyo}
            onChange={event => this.handleChange('kanojyo', event)}
          >
            {this.requestKanojyo().map(item => (
              <Option value={item.key}>{item.value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="otaku" label="otaku" valuePropName="checked">
          <Switch
            defaultChecked={this.state.otaku}
            checked={this.state.otaku}
            onChange={event => this.handleChange('otaku', event)}
          />
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="tsuma" label="tsuma">
          <Radio.Group
            defaultValue={this.state.tsuma}
            value={this.state.tsuma}
            onChange={event => this.handleChange('tsuma', event.target.value)}
          >
            {this.requestKanojyo().map(item => (
              <Radio.Button value={item.key}>{item.value}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} name="rate" label="Rate">
          <Rate defaultValue={this.state.kanojyo.length * 10} value={this.state.kanojyo.length * 10} />
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} label="suihon">
          <Upload.Dragger name="files">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-hint">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item {...this.requestFormItemOption()} wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
};
export default CanvasConfiguration;
