import React, { Component }     from 'react';
import classNames               from 'classnames';
import FlipMove                 from 'react-flip-move';

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
      <FlipMove duration={1000} className="node-group" key={id}>
        { this.renderNodes(nodes) }
      </FlipMove>
    );
  }
};

export default NodeGroup;
