import './style/App.scss';
import React from 'react';
import { BasicLayout } from './layout';
import { CanvasArtist, CanvasConfiguration } from './component';
interface Props {}
interface State {
  size: { width: number; height: number } | null;
}
const App = class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { size: null };
  }
  ready(size: { width: number; height: number }) {
    debugger;
    this.setState({ size });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <BasicLayout main={<CanvasArtist />} aside={<CanvasConfiguration />} /> */}
          <BasicLayout
            ready={this.ready.bind(this)}
            main={this.state.size ? <CanvasArtist size={this.state.size} /> : <div />}
            aside={<CanvasConfiguration />}
          />
        </header>
      </div>
    );
  }
};
export default App;
