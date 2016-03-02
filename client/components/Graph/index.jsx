import React, { PropTypes } from 'react';
import FlipMove from 'react-flip-move';

import NodeGroup from './NodeGroup.jsx';

const Graph = ({nodeGroups, actions}) => (
  <div id="graph">
    <div id="nodes">
      <FlipMove className="nodes-flip" easing="ease" duration={1000}>
        {
          nodeGroups.map( group => (
            <NodeGroup
              key={group.get('id')}
              id={group.get('id')}
              nodes={group.get('nodes')}
              clickNode={actions.selectArtist}
              finishTransition={actions.updateNodePositions}
            />
          ))
        }
      </FlipMove>
    </div>
    { /* Edges here */}
  </div>
);

export default Graph;
