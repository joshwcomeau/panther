import React, { Component }     from 'react';
import classNames               from 'classnames';
import FlipMove                 from 'react-flip-move';

import { findCenterOfNode } from '../../helpers/position.helpers';
import Node from './Node'

class NodeGroup extends Component {
  constructor(props) {
    super(props);
    this.finishHandler = this.finishHandler.bind(this);
  }

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

  finishHandler(element, domNode) {
    // Sadly, I have to break out of React's lovely declarative abstraction here.
    // I need the specific co-ordinates of this DOM node.
    // TODO: Replace with an onFinishAll handler.

    this.props.finishTransition([
      {
        node: element.props.data,
        ...findCenterOfNode(domNode)
      }
    ]);
  }

  render() {
    const { id, nodes } = this.props;

    return (
      <FlipMove
        key={id}
        duration={1000}
        easing="ease"
        className="node-group"
        onFinish={this.finishHandler}
      >
        { this.renderNodes(nodes) }
      </FlipMove>
    );
  }
};

export default NodeGroup;
