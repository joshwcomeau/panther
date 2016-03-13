import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.helpers';


const Edge = ({ data }) => {

  return <line
    x1={data.get('x1')}
    y1={data.get('y1')}
    x2={data.get('x2')}
    y2={data.get('y2')}
  />;
};

function setDashStyles(x1, y1, x2, y2, styles = {}) {
  const edgeLength = calculateLineLength(x1, y1, x2, y2);
  styles.strokeDasharray  =  edgeLength;
  styles.strokeDashoffset =  edgeLength;

  return styles;
}

export default Edge;
