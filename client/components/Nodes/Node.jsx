import React, { Component } from 'react';

class Node extends Component {
  render() {
    return (
      <div className="node-wrapper">
        <div className="node">{this.props.data.get('name')}</div>
      </div>
    );
  }
}

export default Node;
