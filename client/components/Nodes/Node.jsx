import React, { Component } from 'react';

class Node extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.clickNode(this.props.data);
  }

  render() {
    return (
      <div className="node-wrapper">
        <div className="node" onClick={this.clickHandler}>{this.props.data.get('name')}</div>
      </div>
    );
  }
}

export default Node;
