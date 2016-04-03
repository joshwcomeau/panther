import React, { Component } from 'react';

import immutableProps from '../immutable_props.jsx';


@immutableProps(['id'])
class VertexShadow extends Component {
  render() {
    return (
      <defs>
        <filter id={this.props.id}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    );
  }
}

export default VertexShadow;
