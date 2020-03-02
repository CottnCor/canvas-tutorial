import './BasicLayout.scss';
import React from 'react';
interface Props {
  main: JSX.Element;
  aside: JSX.Element;
  ready: (size: { width: number; height: number }) => void;
}
const BasicLayout = class extends React.Component<Props> {
  private main: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.main = React.createRef();
  }
  componentDidMount() {
    const width = this.main.current?.clientWidth || 0;
    const height = this.main.current?.clientHeight || 0;
    this.props.ready({ width, height });
  }
  render() {
    const { main, aside } = this.props;
    return (
      <div className="wapper">
        <main ref={this.main}>{main}</main>
        <aside className="shadow_strong">{aside}</aside>
      </div>
    );
  }
};
export default BasicLayout;
