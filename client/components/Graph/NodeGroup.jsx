import React, { Component }     from 'react';
import classNames               from 'classnames';
// import FlipMove                 from 'react-flip-move';

import FlipMove from '../FlipMove';
import Node from './Node'

class NodeGroup extends Component {
  renderNodes(nodes) {
    const numOfSiblings = nodes.size;

    return nodes.map( node => (
      <Node
        key={node.get('name')}
        data={node}
        siblings={numOfSiblings}
        clickNode={this.props.clickNode}
      />
    ));
  }

  render() {
    const { id, nodes } = this.props;

    return (
      <FlipMove
        key={id}
        duration={1000}
        easing="ease-in-out"
        className="node-group"
      >
        { this.renderNodes(nodes) }
      </FlipMove>
    );
  }
};

export default NodeGroup;
