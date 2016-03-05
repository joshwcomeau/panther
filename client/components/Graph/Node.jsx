import React, { Component } from 'react';
import classNames from 'classnames';

import { PAST, PRESENT, FUTURE } from '../../helpers/graph.duck.helpers';


class Node extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    // Ignore clicks on the present node.
    if ( this.props.group === PRESENT ) return;

    // If we click a node in the FUTURE, we're going forwards.
    // If we click a node in the PAST, we're going backwards.
    const direction = this.props.group === FUTURE ? 'forwards' : 'backwards';

    this.props.clickNode(this.props.data, direction);
  }

  render() {
    const classes = classNames([
      'node',
      this.props.data.get('rejected') ? 'rejected' : ''
    ]);

    return (
      <div className="node-wrapper">
        <div
          className={classes}
          onClick={this.clickHandler}
          data-id={this.props.data.get('id')}
        >
          {this.props.data.get('name')}
        </div>
      </div>
    );
  }
}

export default Node;
