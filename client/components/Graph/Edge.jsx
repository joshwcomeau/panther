import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.duck.helpers';
import {
  edgesRetractLength, edgesExpandLength, edgesPullLength
} from '../../config/timing';
import {
  edgesRetractEasing, edgesExpandEasing, edgesPullEasing
} from '../../config/easing';


const Edge = ({ retracting, expanding, pulling, x1, y1, x2, y2 }) => {
  const classes = classNames({ retracting, expanding, pulling });

  let styles = {};

  if ( retracting ) {
    styles = setDashStyles(x1, y1, x2, y2);
    styles.animationTimingFunction  = edgesRetractEasing;
    styles.animationDuration        = `${edgesRetractLength}ms`;
  }

  if ( expanding ) {
    styles = setDashStyles(x1, y1, x2, y2);
    styles.animationTimingFunction  = edgesExpandEasing;
    styles.animationDuration        = `${edgesExpandLength}ms`;
  }

  if ( pulling ) {
    styles = setDashStyles(x1, y1, x2, y2);
    styles.animationTimingFunction  = edgesPullEasing;
    styles.animationDuration        = `${edgesPullLength}ms`;
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

function setDashStyles(x1, y1, x2, y2, styles = {}) {
  const edgeLength = calculateLineLength(x1, y1, x2, y2);
  styles.strokeDasharray  =  edgeLength;
  styles.strokeDashoffset =  edgeLength;

  return styles;
}

export default Edge;
