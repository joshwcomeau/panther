import React, { Component }     from 'react';
import classNames               from 'classnames';
import FlipMove                 from '../FlipMove';

import Node from './Node'

class Nodes extends Component {
  renderNodes(nodeGroup) {
    return nodeGroup.map( node => (
      <Node
        key={node.get('name')}
        data={node}
        clickNode={this.props.actions.clickNode}
      />
    ));
  }

  renderNodeContainers() {
    console.log(this.props.nodes)
    return this.props.nodes.map( nodeGroup => (
      <FlipMove limitToAxis='y' className="nodes-region" key={nodeGroup.get('id')}>
        { this.renderNodes(nodeGroup.get('nodes')) }
      </FlipMove>
    ));
  }
  render() {
    return (
      <div id="nodes">
        <FlipMove className="nodes-flip">
          { this.renderNodeContainers() }
        </FlipMove>
      </div>
    );
  }
};

export default Nodes;
