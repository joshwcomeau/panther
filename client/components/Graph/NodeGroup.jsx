import React, { Component }     from 'react';
import classNames               from 'classnames';
// import FlipMove                 from 'react-flip-move';
import FlipMove from '../FlipMove';

import { repositionLength } from '../../config/timing';
import { repositionEasing } from '../../config/easing';
import Node                 from './Node'


class NodeGroup extends Component {
  renderNodes(nodes) {
    const numOfSiblings = nodes.size;

    return nodes.map( node => (
      <Node
        key={node.get('name')}
        data={node}
        siblings={numOfSiblings}
        group={this.props.group}
        clickNode={this.props.clickNode}
      />
    ));
  }

  render() {
    const { id, nodes } = this.props;

    return (
      <FlipMove
        key={id}
        duration={repositionLength}
        easing={repositionEasing}
        className="node-group"
      >
        { this.renderNodes(nodes) }
      </FlipMove>
    );
  }
};

export default NodeGroup;
