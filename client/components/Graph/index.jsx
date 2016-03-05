import React, { Component, PropTypes } from 'react';
// import FlipMove from 'react-flip-move';
import FlipMove from '../FlipMove';

import { repositionLength } from '../../config/timing';
import { repositionEasing } from '../../config/easing';
import EdgesContainer       from '../../containers/EdgesContainer.jsx';
import NodeGroup            from './NodeGroup.jsx';

class Graph extends Component {
  componentDidMount() {
    this.props.actions.calculateAndExpandEdges()
  }
  render() {
    const { nodeGroups, actions } = this.props;

    return (
      <div id="graph">
        <div id="nodes">
          <FlipMove
            className="nodes-flip"
            easing={repositionEasing}
            duration={repositionLength}
          >
            {
              nodeGroups.map( (group, i) => (
                <NodeGroup
                  key={group.get('id')}
                  id={group.get('id')}
                  nodes={group.get('nodes')}
                  group={i}
                  clickNode={actions.selectArtist}
                />
              ))
            }
          </FlipMove>
        </div>
        <EdgesContainer />
      </div>
    )
  }
};

export default Graph;
