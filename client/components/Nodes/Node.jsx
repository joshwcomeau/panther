import React, { Component } from 'react';
import classNames from 'classnames';

class Node extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    console.log("NODE CLICKED", performance.now())
    this.props.clickNode(this.props.data);
  }

  render() {
    const classes = classNames([
      'node',
      this.props.data.get('selected') ? 'selected' : '',
      this.props.data.get('rejected') ? 'rejected' : ''
    ]);

    return (
      <div className={classes} onClick={this.clickHandler}>
        {this.props.data.get('name')}
      </div>
    );
  }
}

export default Node;
