import React, { Component }     from 'react';
import classNames               from 'classnames';

import Node from './Node'

class Nodes extends Component {
  render() {
    return (
      <div id="nodes">
        <div id="graveyard" className="nodes-region">

        </div>
        <div id="past" className="nodes-region">
          <Node data={this.props.nodes.get('past')} />
        </div>
        <div id="present" className="nodes-region">
          <Node data={this.props.nodes.get('present')} />
        </div>
        <div id="future" className="nodes-region">
          {
            this.props.nodes.get('future').map( node => (
              <Node key={node.get('name')} data={node} />
            ))
          }
        </div>
      </div>
    );
  }
};

export default Nodes;
