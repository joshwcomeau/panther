import React, { Component }     from 'react';
import classNames               from 'classnames';
import FlipMove                 from 'react-flip-move';

import Node from './Node'

class Nodes extends Component {
  render() {
    console.log(this.props.nodes.toJS());
    return (
      <div id="nodes">
        <FlipMove className="nodes-flip">
          { }
          <div id="graveyard" className="nodes-region">

          </div>
          <div id="past" className="nodes-region">
            <Node
              key={this.props.nodes.get('past').get('name')}
              data={this.props.nodes.get('past')}
              clickNode={this.props.actions.clickNode}
            />
          </div>
          <div id="present" className="nodes-region">
            <Node
              key={this.props.nodes.get('present').get('name')}
              data={this.props.nodes.get('present')}
              clickNode={this.props.actions.clickNode}
            />
          </div>
          <div id="future" className="nodes-region">
            {
              this.props.nodes.get('future').map( node => (
                <Node
                  key={node.get('name')}
                  data={node}
                  clickNode={this.props.actions.clickNode}
                />
              ))
            }
          </div>
        </FlipMove>
      </div>
    );
  }
};

export default Nodes;
