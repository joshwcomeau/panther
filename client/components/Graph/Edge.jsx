import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.duck.helpers';


const Edge = ({ retracting, expanding, pulling, x1, y1, x2, y2 }) => {
  const classes = classNames({ retracting, expanding, pulling });

  let styles = {};

  if ( pulling || retracting || expanding ) {
    const edgeLength = calculateLineLength(x1, y1, x2, y2);
    styles.strokeDasharray  =  edgeLength,
    styles.strokeDashoffset =  edgeLength
  }

  return <line
    className={classes}
    style={styles}
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
  />;
};

export default Edge;
