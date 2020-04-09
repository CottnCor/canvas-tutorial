import React from 'react';
import { Shaders, ShadersSheet, Node, GLSL } from 'gl-react';
import { RotateDirection } from '../../../../interfaces/common/RotateDirection';
import { IRotateState } from '../../../../interfaces/common/IRotateState';interface Props {
    blue?: number;
}
interface State {}
const HelloBlue = class extends React.Component<Props, State> {
    readonly state = {} as State;
    private shaders: ShadersSheet;
    constructor(props: Props) {
        super(props);
        this.shaders = Shaders.create({
            helloBlue: {
                frag: GLSL`
        precision highp float;
        varying vec2 uv;
        uniform float blue;
        void main() {
          gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
        }`
            }
        });
    }
    render() {
        const { blue } = this.props;
        return (
            <div className="hello-blue">
                <Node shader={this.shaders.helloBlue} uniforms={{ blue }} />;
            </div>
        );
    }
};
export default HelloBlue;
