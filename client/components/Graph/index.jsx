import React, { PropTypes } from 'react';
// import FlipMove from 'react-flip-move';
import FlipMove from '../FlipMove';

import NodeGroup from './NodeGroup.jsx';
import EdgesContainer from '../../containers/EdgesContainer.jsx';

const Graph = ({nodeGroups, actions}) => (
  <div id="graph">
    <div id="nodes">
      <FlipMove
        className="nodes-flip"
        easing="ease"
        duration={1000}
      >
        {
          nodeGroups.map( group => (
            <NodeGroup
              key={group.get('id')}
              id={group.get('id')}
              nodes={group.get('nodes')}
              clickNode={actions.selectArtist}
            />
          ))
        }
      </FlipMove>
    </div>
    <EdgesContainer />
    <div className="background">
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Graph;
