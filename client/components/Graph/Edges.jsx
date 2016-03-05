import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Edge from './Edge.jsx';


const Edges = ({edges}) => {
  const edgesComponents = (edges || []).map( (edge, i) => (
    <Edge
      key={i}
      x1={edge.get('x1')}
      y1={edge.get('y1')}
      x2={edge.get('x2')}
      y2={edge.get('y2')}
      retracting={edge.get('retracting')}
      expanding={edge.get('expanding')}
      pulling={edge.get('pulling')}
    />
  ));

  return (
    <svg id="edges">
      { edgesComponents }
    </svg>
  );
};

export default Edges;
