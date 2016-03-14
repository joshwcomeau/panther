import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.helpers';
import { edgesRetractLength } from '../../config/timing';


const Edge = ({ retracting, expanding, x1, y1, x2, y2 }) => {
  const classes = classNames({ retracting, expanding });
  let styles = {};

  if ( retracting ) {
    styles = setDashStyles(x1, y1, x2, y2);
    styles.animationTimingFunction  = 'ease';
    styles.animationDuration        = `${edgesRetractLength}ms`;
  }

  if ( expanding ) {
    styles = setDashStyles(x1, y1, x2, y2);
    styles.animationTimingFunction  = 'ease';
    styles.animationDuration        = `${edgesExpandLength}ms`;
  }

  return <line
    class={classes}
    style={styles}
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
  />;
};

function setDashStyles(x1, y1, x2, y2, styles = {}) {
  const edgeLength = calculateLineLength(x1, y1, x2, y2);
  styles.strokeDasharray  =  edgeLength;
  styles.strokeDashoffset =  edgeLength;

  return styles;
}

export default Edge;
